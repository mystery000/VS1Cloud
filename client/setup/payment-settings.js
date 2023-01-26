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
  const templateObject = Template.instance();
  templateObject.includeCreditCard = new ReactiveVar(false);
  templateObject.deptrecords = new ReactiveVar();
  templateObject.includeCreditCard = new ReactiveVar(false);
  templateObject.includeAccountID = new ReactiveVar(false);
  templateObject.accountID = new ReactiveVar();
  templateObject.loadStripe = () => {
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
  const templateObject = Template.instance();
  templateObject.loadStripe()
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
    let paymentName = $("#edtPaymentMethodName").val();
    let isCreditCard = false;
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
                  // Meteor._reload.reload();
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
                  // Meteor._reload.reload();
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
              // Meteor._reload.reload();
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
  "click #tblPaymentMethodList tbody td:nth-child(2)"(event){
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
