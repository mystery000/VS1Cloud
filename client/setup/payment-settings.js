import "./payment-settings.html";
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import LoadingOverlay from "../LoadingOverlay";
import "../lib/global/indexdbstorage.js";
import { OrganisationService } from "../js/organisation-service";
import { TaxRateService } from "../settings/settings-service.js";
import { SideBarService } from "../js/sidebar-service";

const organisationService = new OrganisationService();
const sideBarService = new SideBarService();
const taxRateService = new TaxRateService();

Template.wizard_payment.onCreated(() => {
  const templateObject = this;
  this.includeCreditCard = new ReactiveVar(false);
  this.deptrecords = new ReactiveVar();
  this.includeCreditCard = new ReactiveVar(false);
  this.includeAccountID = new ReactiveVar(false);
  this.accountID = new ReactiveVar();
  this.loadStripe = () => {
    let url = window.location.href;
    if (url.indexOf("?code") > 0) {
      $(".fullScreenSpin").css("display", "inline-block");
      url = url.split("?code=");
      var id = url[url.length - 1];
      $.ajax({
        url: "https://depot.vs1cloud.com/stripe/connect-to-stripe.php",
        data: {
          code: id,
        },
        method: "post",
        success: function (response) {
          var dataReturnRes = JSON.parse(response);
          if (dataReturnRes.stripe_user_id) {
            let stripe_acc_id = dataReturnRes.stripe_user_id;
            let companyID = 1;

            var objDetails = {
              type: "TCompanyInfo",
              fields: {
                Id: companyID,
                Apcano: stripe_acc_id,
              },
            };
            organisationService
              .saveOrganisationSetting(objDetails)
              .then(function (data) {
                LoadingOverlay.hide();
                swal({
                  title: "Stripe Connection Successful",
                  text: "Your stripe account connection is successful",
                  type: "success",
                  showCancelButton: false,
                  confirmButtonText: "Ok",
                }).then((result) => {
                  if (result.value) {
                    window.open("/paymentmethodSettings", "_self");
                  } else if (result.dismiss === "cancel") {
                    window.open("/paymentmethodSettings", "_self");
                  } else {
                    window.open("/paymentmethodSettings", "_self");
                  }
                });
              })
              .catch(function (err) {
                LoadingOverlay.hide();
                swal({
                  title: "Stripe Connection Successful",
                  text: err,
                  type: "error",
                  showCancelButton: false,
                  confirmButtonText: "Try Again",
                })
              });
          } else {
            LoadingOverlay.hide();
            swal({
              title: "Oooops...",
              text: response,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            })
          }
        },
      });
    }
  };
})

Template.wizard_payment.onRendered(() => {
  this.loadStripe()
})

Template.wizard_payment.events({
  "click #saveStep3"() {
    $(".fullScreenSpin").css("display", "inline-block");
    let companyID = 1;
    let feeMethod = "apply";
    if ($("#feeInPriceInput").is(":checked")) {
      feeMethod = "include";
    }

    var objDetails = {
      type: "TCompanyInfo",
      fields: {
        Id: companyID,
        DvaABN: feeMethod,
      },
    };
    organisationService
      .saveOrganisationSetting(objDetails)
      .then(function (data) {
        localStorage.setItem("vs1companyStripeFeeMethod", feeMethod);
        LoadingOverlay.hide();
        swal({
          title: "Default Payment Method Setting Successfully Changed",
          text: "",
          type: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
        });
      })
      .catch(function (err) {
        LoadingOverlay.hide();
        swal({
          title: "Default Payment Method Setting Successfully Changed",
          text: "",
          type: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
        })
      });
  },
  "click .feeOnTopInput"(event) {
    if ($(event.target).is(":checked")) {
      $(".feeInPriceInput").attr("checked", false);
    }
  },
  "click .feeInPriceInput"(event) {
    if ($(event.target).is(":checked")) {
      $(".feeOnTopInput").attr("checked", false);
    }
  },
  "click .chkDatatablePaymentMethod"(event) {
    var columns = $("#paymentmethodList th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumnPaymentMethod")
      .text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
        if ($(event.target).is(":checked")) {
          $("." + replaceClass + "").css("display", "table-cell");
          $("." + replaceClass + "").css("padding", ".75rem");
          $("." + replaceClass + "").css("vertical-align", "top");
        } else {
          $("." + replaceClass + "").css("display", "none");
        }
      }
    });
  },
  "click .resetPaymentMethodTable"() {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: localStorage.getItem("mycloudLogonID"),
      clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "paymentmethodList",
        });
        if (checkPrefDetails) {
          CloudPreference.remove(
            {
              _id: checkPrefDetails._id,
            },
            function (err, idTag) {
              if (err) {
              } else {
                Meteor._reload.reload();
              }
            }
          );
        }
      }
    }
  },
  "click .savePaymentMethodTable"() {
    let lineItems = [];
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumnPaymentMethod").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass =
        $tblrow.find(".divcolumnPaymentMethod").attr("valueupdate") || "";
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(":checked")) {
        colHidden = false;
      } else {
        colHidden = true;
      }
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass,
      };

      lineItems.push(lineItemObj);
    });

    var getcurrentCloudDetails = CloudUser.findOne({
      _id: localStorage.getItem("mycloudLogonID"),
      clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "paymentmethodList",
        });
        if (checkPrefDetails) {
          CloudPreference.update(
            {
              _id: checkPrefDetails._id,
            },
            {
              $set: {
                userid: clientID,
                username: clientUsername,
                useremail: clientEmail,
                PrefGroup: "salesform",
                PrefName: "paymentmethodList",
                published: true,
                customFields: lineItems,
                updatedAt: new Date(),
              },
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsPaymentMethod").modal("toggle");
              } else {
                $("#btnOpenSettingsPaymentMethod").modal("toggle");
              }
            }
          );
        } else {
          CloudPreference.insert(
            {
              userid: clientID,
              username: clientUsername,
              useremail: clientEmail,
              PrefGroup: "salesform",
              PrefName: "paymentmethodList",
              published: true,
              customFields: lineItems,
              createdAt: new Date(),
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsPaymentMethod").modal("toggle");
              } else {
                $("#btnOpenSettingsPaymentMethod").modal("toggle");
              }
            }
          );
        }
      }
    }
  },
  "blur .divcolumnPaymentMethod"(event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target)
      .closest("div.columnSettings")
      .attr("id");
    var datable = $("#paymentmethodList").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRangePaymentMethod"(event) {
    let range = $(event.target).val();
    $(event.target)
      .closest("div.divColWidth")
      .find(".spWidth")
      .html(range + "px");

    let columData = $(event.target)
      .closest("div.divColWidth")
      .find(".spWidth")
      .attr("value");
    let columnDataValue = $(event.target)
      .closest("div")
      .prev()
      .find(".divcolumnPaymentMethod")
      .text();
    var datable = $("#paymentmethodList th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .btnOpenSettingsPaymentMethod"() {
    let templateObject = Template.instance();
    var columns = $("#paymentmethodList th");

    const tableHeaderList = [];
    let sWidth = "";
    let columVisible = false;
    //should be updated with non_transactional_list
    // $.each(columns, function (i, v) {
    //   if (v.hidden == false) {
    //     columVisible = true;
    //   }
    //   if (v.className.includes("hiddenColumn")) {
    //     columVisible = false;
    //   }
    //   sWidth = v.style.width.replace("px", "");

    //   let datatablerecordObj = {
    //     sTitle: v.innerText || "",
    //     sWidth: sWidth || "",
    //     sIndex: v.cellIndex || "",
    //     sVisible: columVisible || false,
    //     sClass: v.className || "",
    //   };
    //   tableHeaderList.push(datatablerecordObj);
    // });
    // templateObject.tableheaderrecords.set(tableHeaderList);
  },
  "click .btnRefreshPaymentMethod" () {
    $(".fullScreenSpin").css("display", "inline-block");
    sideBarService
      .getPaymentMethodDataVS1()
      .then(function (dataReload) {
        addVS1Data("TPaymentMethod", JSON.stringify(dataReload))
          .then(function (datareturn) {
            location.reload(true);
          })
          .catch(function (err) {
            location.reload(true);
          });
      })
      .catch(function (err) {
        location.reload(true);
      });
  },
  "click .btnDeletePaymentMethod"() {
    playDeleteAudio();
    setTimeout(function(){
    let paymentMethodId = $("#selectDeleteLineID").val();

    let objDetails = {
      type: "TPaymentMethod",
      fields: {
        Id: parseInt(paymentMethodId),
        Active: false,
      },
    };

    taxRateService
      .savePaymentMethod(objDetails)
      .then(function (objDetails) {
        sideBarService
          .getPaymentMethodDataVS1()
          .then(function (dataReload) {
            addVS1Data("TPaymentMethod", JSON.stringify(dataReload))
              .then(function (datareturn) {
                location.reload(true);
              })
              .catch(function (err) {
                location.reload(true);
              });
          })
          .catch(function (err) {
            location.reload(true);
          });
      })
      .catch(function (err) {
        swal({
          title: "Oooops...",
          text: err,
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === "cancel") {
          }
        });
        LoadingOverlay.hide();
      });
    }, delayTimeAfterSound);
    },
  "click .btnSavePaymentMethod"() {
    playSaveAudio();
    setTimeout(function(){
    $(".fullScreenSpin").css("display", "inline-block");

    let paymentMethodID = $("#edtPaymentMethodID").val();
    //let headerDept = $('#sltDepartment').val();
    let paymentName = $("#edtPaymentMethodName").val();
    let isCreditCard = false;
    let siteCode = $("#edtSiteCode").val();

    if ($("#isformcreditcard").is(":checked")) {
      isCreditCard = true;
    } else {
      isCreditCard = false;
    }

    let objDetails = "";
    if (paymentName === "") {
      LoadingOverlay.hide();
      Bert.alert(
        "<strong>WARNING:</strong> Payment Method Name cannot be blank!",
        "warning"
      );
      e.preventDefault();
    }

    if (paymentMethodID == "") {
      taxRateService
        .checkPaymentMethodByName(paymentName)
        .then(function (data) {
          paymentMethodID = data.tpaymentmethod[0].Id;
          objDetails = {
            type: "TPaymentMethod",
            fields: {
              ID: parseInt(paymentMethodID),
              Active: true,
              //PaymentMethodName: paymentName,
              IsCreditCard: isCreditCard,
              PublishOnVS1: true,
            },
          };

          taxRateService
            .savePaymentMethod(objDetails)
            .then(function (objDetails) {
              sideBarService
                .getPaymentMethodDataVS1()
                .then(function (dataReload) {
                  addVS1Data("TPaymentMethod", JSON.stringify(dataReload))
                    .then(function (datareturn) {
                      location.reload(true);
                    })
                    .catch(function (err) {
                      location.reload(true);
                    });
                })
                .catch(function (err) {
                  location.reload(true);
                });
            })
            .catch(function (err) {
              swal({
                title: "Oooops...",
                text: err,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Try Again",
              }).then((result) => {
                if (result.value) {
                  Meteor._reload.reload();
                } else if (result.dismiss === "cancel") {
                }
              });
              LoadingOverlay.hide();
            });
        })
        .catch(function (err) {
          objDetails = {
            type: "TPaymentMethod",
            fields: {
              Active: true,
              PaymentMethodName: paymentName,
              IsCreditCard: isCreditCard,
              PublishOnVS1: true,
            },
          };

          taxRateService
            .savePaymentMethod(objDetails)
            .then(function (objDetails) {
              sideBarService
                .getPaymentMethodDataVS1()
                .then(function (dataReload) {
                  addVS1Data("TPaymentMethod", JSON.stringify(dataReload))
                    .then(function (datareturn) {
                      location.reload(true);
                    })
                    .catch(function (err) {
                      location.reload(true);
                    });
                })
                .catch(function (err) {
                  location.reload(true);
                });
            })
            .catch(function (err) {
              swal({
                title: "Oooops...",
                text: err,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Try Again",
              }).then((result) => {
                if (result.value) {
                  Meteor._reload.reload();
                } else if (result.dismiss === "cancel") {
                }
              });
              LoadingOverlay.hide();
            });
        });
    } else {
      objDetails = {
        type: "TPaymentMethod",
        fields: {
          ID: parseInt(paymentMethodID),
          Active: true,
          PaymentMethodName: paymentName,
          IsCreditCard: isCreditCard,
          PublishOnVS1: true,
        },
      };

      taxRateService
        .savePaymentMethod(objDetails)
        .then(function (objDetails) {
          sideBarService
            .getPaymentMethodDataVS1()
            .then(function (dataReload) {
              addVS1Data("TPaymentMethod", JSON.stringify(dataReload))
                .then(function (datareturn) {
                  location.reload(true);
                })
                .catch(function (err) {
                  location.reload(true);
                });
            })
            .catch(function (err) {
              location.reload(true);
            });
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: err,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              Meteor._reload.reload();
            } else if (result.dismiss === "cancel") {
            }
          });
          LoadingOverlay.hide();
        });
    }
  }, delayTimeAfterSound);
  },
  "click .btnAddPaymentMethod" () {
    let templateObject = Template.instance();
    $("#add-paymentmethod-title").text("Add New Payment Method");
    $("#edtPaymentMethodID").val("");
    $("#edtPaymentMethodName").val("");
    templateObject.includeCreditCard.set(false);
  },
  "click .table-remove-payment-method"(event){
    event.stopPropagation();
    var targetID = $(event.target).closest("tr").attr("id"); // table row ID
    $("#selectDeleteLineID").val(targetID);
    $("#deletePaymentMethodLineModal").modal("toggle");
  },
  "click #paymentmethodList tbody td.clickable"(event){
    let templateObject = Template.instance();

    const tr = $(event.currentTarget).parent();
    var listData = tr.attr("id");
    var isCreditcard = false;
    if (listData) {
      $("#add-paymentmethod-title").text("Edit Payment Method");
      if (listData !== "") {
        listData = Number(listData);

        var paymentMethodID = listData || "";
        var paymentMethodName = tr.find(".colName").text() || "";

        if (tr.find(".colIsCreditCard .chkBox").is(":checked")) {
          isCreditcard = true;
        }

        $("#edtPaymentMethodID").val(paymentMethodID);
        $("#edtPaymentMethodName").val(paymentMethodName);

        if (isCreditcard == true) {
          templateObject.includeCreditCard.set(true);
        } else {
          templateObject.includeCreditCard.set(false);
        }
        $("#btnAddPaymentMethod").modal("toggle");
      }
    }
  },
})

Template.wizard_payment.helpers({
  includeCreditCard: () => {
    return Template.instance().includeCreditCard.get()
  },
  accountID: () => {
    return Template.instance().accountID.get();
  },
  salesCloudPreferenceRecPaymentMethod: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "paymentmethodList",
    });
  },
  deptrecords: () => {
    return Template.instance().deptrecords.get()
      ? Template.instance()
          .deptrecords.get()
          .sort(function (a, b) {
            if (a.department == "NA") {
              return 1;
            } else if (b.department == "NA") {
              return -1;
            }
            return a.department.toUpperCase() > b.department.toUpperCase()
              ? 1
              : -1;
          })
      : [];
  },
  includeAccountID: () => {
    return Template.instance().includeAccountID.get();
  },
  includeCreditCard: () => {
    return Template.instance().includeCreditCard.get();
  },

})
