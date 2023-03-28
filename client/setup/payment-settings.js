import "./payment-settings.html";
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import LoadingOverlay from "../LoadingOverlay";
import "../lib/global/indexdbstorage.js";
import { OrganisationService } from "../js/organisation-service";
import { TaxRateService } from "../settings/settings-service.js";
import { SideBarService } from "../js/sidebar-service";
import XLSX from "xlsx";
import { UtilityService } from "../utility-service";

const organisationService = new OrganisationService();
const sideBarService = new SideBarService();
const taxRateService = new TaxRateService();

Template.wizard_payment.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
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
  templateObject.getDataTableList = function(data) {
    let linestatus = '';
    if (data.Active == true) {
      linestatus = "";
    } else if (data.Active == false) {
      linestatus = "In-Active";
    };
    let tdIsCreditCard = '';

    if (data.IsCreditCard == true) {
      tdIsCreditCard = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-' + data.PayMethodID + '" checked><label class="custom-control-label chkBox" for="iscreditcard-' + data.PayMethodID + '"></label></div>';
    } else {
      tdIsCreditCard = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-' + data.PayMethodID + '"><label class="custom-control-label chkBox" for="iscreditcard-' + data.PayMethodID + '"></label></div>';
    };
    var dataList = [
      data.PayMethodID || "",
      data.Name || "",
      tdIsCreditCard,
      linestatus,
    ];
    return dataList;
  }

  let headerStructure = [
    { index: 0, label: '#ID', class: 'colPayMethodID', active: false, display: true, width: "50" },
    { index: 1, label: 'Payment Method Name', class: 'colName', active: true, display: true, width: "150" },
    { index: 2, label: 'Is Credit Card', class: 'colIsCreditCard', active: true, display: true, width: "100" },
    { index: 3, label: 'Status', class: 'colStatus', active: true, display: true, width: "60" },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
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
  "click .templateDownload": function () {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SamplePaymentMethodSettings" + ".csv";
    rows[0] = ["Payment Method Name", "Is Credit Card"];
    rows[1] = ["ABC", "false"];
    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .templateDownloadXLSX": function (e) {
    e.preventDefault(); //stop the browser from following
    window.location.href = "sample_imports/SamplePaymentMethodSettings.xlsx";
  },
  "click .btnUploadFile": function (event) {
    $("#attachment-upload").val("");
    $(".file-name").text("");
    //$(".btnImport").removeAttr("disabled");
    $("#attachment-upload").trigger("click");
  },
  "change #attachment-upload": function (e) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload")[0].files[0]["name"];
    var fileExtension = filename.split(".").pop().toLowerCase();
    var validExtensions = ["csv", "txt", "xlsx"];
    var validCSVExtensions = ["csv", "txt"];

    if (validExtensions.indexOf(fileExtension) == -1) {
      swal(
        "Invalid Format",
        "formats allowed are :" + validExtensions.join(", "),
        "error"
      );
      $(".file-name").text("");
      $(".btnImport").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];

      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnImport").removeAttr("disabled");
      } else {
        $(".btnImport").Attr("disabled");
      }
    } else if (fileExtension == "xlsx") {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      var oFile = selectedFile;
      // Create A File Reader HTML5
      var reader = new FileReader();

      // Ready The Event For When A File Gets Selected
      reader.onload = function (e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workbook = XLSX.read(data, { type: "array" });

        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
          var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
          });
          var sCSV = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
          templateObj.selectedFile.set(sCSV);

          if (roa.length) result[sheetName] = roa;
        });
        // see the result, caution: it works after reader event is done.
      };
      reader.readAsArrayBuffer(oFile);

      if ($(".file-name").text() != "") {
        $(".btnImport").removeAttr("disabled");
      } else {
        $(".btnImport").Attr("disabled");
      }
    }
  },
  "click .btnImport": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let objDetails;
    let isCreditCard = false;
    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "Payment Method Name" &&
            results.data[0][1] == "Is Credit Card"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function () {
              $(".importTemplateModal").hide();
              $(".modal-backdrop").hide();
              FlowRouter.go("/paymentmethodSettings?success=true");
              $(".fullScreenSpin").css("display", "none");
            }, parseInt(dataLength));
            for (let i = 0; i < results.data.length - 1; i++) {
              isCreditCard =
                results.data[i + 1][1] !== undefined
                  ? results.data[i + 1][1]
                  : "";
              objDetails = {
                type: "TPaymentMethod",
                fields: {
                  Name: results.data[i + 1][0],
                  IsCreditCard: isCreditCard || false,
                  Active: true,
                },
              };
              if (results.data[i + 1][1]) {
                if (results.data[i + 1][1] !== "") {
                  taxRateService
                    .savePaymentMethod(objDetails)
                    .then(function (data) {

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
                          FlowRouter.go("/paymentmethodSettings?success=true");
                        } else if (result.dismiss === "cancel") {
                          FlowRouter.go("/paymentmethodSettings?success=false");
                        }
                      });
                    });
                }
              }
            }
          } else {
            $(".fullScreenSpin").css("display", "none");
            swal(
              "Invalid Data Mapping fields ",
              "Please check that you are importing the correct file with the correct column headers.",
              "error"
            );
          }
        } else {
          $(".fullScreenSpin").css("display", "none");
          swal(
            "Invalid Data Mapping fields ",
            "Please check that you are importing the correct file with the correct column headers.",
            "error"
          );
        }
      },
    });
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
      PrefName: "tblPaymentMethodList",
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
  datatablerecords: () => {
    return Template.instance()
      .datatablerecords.get()
      .sort(function (a, b) {
        if (a.paymentmethodname == "NA") {
          return 1;
        } else if (b.paymentmethodname == "NA") {
          return -1;
        }
        return a.paymentmethodname.toUpperCase() >
          b.paymentmethodname.toUpperCase()
          ? 1
          : -1;
      });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getPaymentMethodDataList;
  },

  searchAPI: function() {
    return sideBarService.getPaymentMethodDataList;
  },

  service: ()=>{
    let sideBarService = new SideBarService();
    return sideBarService;

  },

  datahandler: function () {
    let templateObject = Template.instance();
    return function(data) {
      let dataReturn =  templateObject.getDataTableList(data)
      return dataReturn
    }
  },

  exDataHandler: function() {
    let templateObject = Template.instance();
    return function(data) {
      let dataReturn =  templateObject.getDataTableList(data)
      return dataReturn
    }
  },

  apiParams: function() {
    return ['limitCount', 'limitFrom', 'deleteFilter'];
  },
  // displayfields: () => {
  //   return Template.instance().displayfields.get();
  // },
})
