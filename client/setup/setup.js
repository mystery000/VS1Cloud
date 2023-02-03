// @ts-nocheck
import { Meteor } from "meteor/meteor";
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import { OrganisationService } from "../js/organisation-service";
import { SideBarService } from "../js/sidebar-service";
import { UtilityService } from "../utility-service";
import { PurchaseBoardService } from "../js/purchase-service";
import { ProductService } from "../product/product-service";
import LoadingOverlay from "../LoadingOverlay";
import { AccountService } from "../accounts/account-service";
import "jquery-editable-select";
import XLSX from 'xlsx';
import FxGlobalFunctions from "../packages/currency/FxGlobalFunctions";
import '../lib/global/utBarcodeConst.js';
import '../lib/global/indexdbstorage.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './AddTermModal.html'
import './setup.html';
import { HTTP } from "meteor/http";

import './organization-settings.js'
import './taxrate-settings.js'
import './payment-settings.js'
import './terms/terms-settings.js';
import './employments/employment-settings.js'
import './accounts/accounts-settings.js'
import './customers/customers-settings.js'
import './suppliers/suppliers-settings.js'
import './bankaccounts/bankaccounts-settings.js'
import './dashboard/dashboard-settings.js'

const organisationService = new OrganisationService();
const sideBarService = new SideBarService();
const utilityService = new UtilityService();
const productService = new ProductService();

const refreshTableTimout = 300;

let stepTitles = ["Organization", "Tax Rates", "Payment", "Terms", "Employees", "Accounts", 'Bank Accounts', "Customers", "Suppliers", "Inventory", "Dashboard", "Launch"];

export const handleSetupRedirection = (onSetupFinished = "/dashboard", onSetupUnFinished = "/setup") => {
  let ERPIPAddress = localStorage.getItem('EIPAddress');
  let ERPUsername = localStorage.getItem('EUserName');
  let ERPPassword = localStorage.getItem('EPassword');
  let ERPDatabase = localStorage.getItem('EDatabase');
  let ERPPort = localStorage.getItem('EPort');
  const apiUrl = `${URLRequest}${ERPIPAddress}:${ERPPort}/erpapi/TCompanyInfo?PropertyList=ID`; //,IsSetUpWizard
  const _headers = {
    database: ERPDatabase,
    username: ERPUsername,
    password: ERPPassword
  };
  HTTP.get(apiUrl, { headers: _headers }, (error, result) => {
    if (error) {
      // handle error here
    } else {
      if (result.data != undefined) {
        if (result.data.tcompanyinfo.length > 0) {
          let data = result.data.tcompanyinfo[0];
          let cntConfirmedSteps = data.Address3 == "" ? 0 : parseInt(data.Address3);
          let bSetupFinished = cntConfirmedSteps == confirmStepCount ? true : false;
          localStorage.setItem("IS_SETUP_FINISHED", bSetuped); //data.IsSetUpWizard
          if (bSetupFinished == true) { // data.IsSetUpWizard
            window.open(onSetupFinished, '_self');
          } else {
            window.open(onSetupUnFinished, '_self');
          }
        }
      } else {
        window.open(onSetupUnFinished, '_self');
      }

    }
  });
};

export const isSetupFinished = async () => {
  const isFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
  if (isFinished == true || isFinished == "true") {
    return true;
  }
  return false;
}

const numberOfSteps = confirmStepCount + 1;

function setAlreadyLoaded(step, bool = false) {
  return localStorage.setItem(`SETUP_STEP_ALREADY-${step}`, bool);
}

function getCurrentStep(onNaN = 1) {
  const step = localStorage.getItem("VS1Cloud_SETUP_STEP") || onNaN;
  return parseInt(step);
}

function getConfirmedSteps() {
  return (
    localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || JSON.stringify([])
  );
}

function setConfirmedSteps(steps = []) {
  return localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", JSON.stringify(steps));
}

function addConfirmedStep(step) {
  if (isNaN(step)) return false;
  let steps = getConfirmedSteps();
  if (!steps.includes(step)) {
    steps = JSON.parse(steps);
    steps.push(step);
    setConfirmedSteps(steps);
  }
}

function isConfirmedStep(stepId) {
  if (isNaN(stepId)) return false;
  let steps = getConfirmedSteps();
  return steps.includes(stepId);
}

function getSkippedSteps() {
  return (
    localStorage.getItem("VS1Cloud_SETUP_SKIPPED_STEP") || JSON.stringify([])
  );
}

function addSkippedStep(step) {
  if (isNaN(step)) return false;
  let steps = getSkippedSteps();
  if (!steps.includes(step)) {
    steps = JSON.parse(steps);
    steps.push(step);
    setSkippedSteps(steps);
  }
}

function setSkippedSteps(steps = []) {
  return localStorage.setItem("VS1Cloud_SETUP_SKIPPED_STEP", JSON.stringify(steps));
}

function isStepSkipped(stepId) {
  let steps = getSkippedSteps();
  return steps.includes(stepId);
}

function isClickableStep(stepId) {
  const confirmedSteps = getConfirmedSteps();
  const skippedSteps = getSkippedSteps();
  if (confirmedSteps.includes(stepId) || skippedSteps.includes(stepId)) {
    return true;
  }
  return false;
}

Template.setup.onCreated(() => {
  const templateObject = Template.instance();
  const _currentStep = localStorage.getItem("VS1Cloud_SETUP_STEP") || 1;
  templateObject.currentStep = new ReactiveVar(_currentStep);
  templateObject.stepNumber = new ReactiveVar(1);
  templateObject.steps = new ReactiveVar([]);
  templateObject.skippedSteps = new ReactiveVar([]);
  templateObject.inventoryList = new ReactiveVar([]);

  templateObject.setCurrentStep = (stepId = 1) => {
    if (isNaN(stepId)) return false;
    templateObject.currentStep.set(stepId);
    return localStorage.setItem("VS1Cloud_SETUP_STEP", parseInt(stepId));
  }

  templateObject.isStepActive = function (stepId) {
    let currentStepID = $(".setup-stepper .current a.gotToStepID").attr(
      "data-step-id"
    );
    if (stepId < currentStepID) {
      return true;
    } else {
      return false;
    }
  }

  templateObject.goToNextStep = function (stepId, isConfirmed = false, onStepChange = (stepId) => { }) {
    isConfirmed == true ? addConfirmedStep(stepId) : addSkippedStep(stepId);
    stepId = stepId + 1;
    templateObject.setCurrentStep(stepId);
    $(".setup-step").removeClass("show");
    $(`.setup-step-${stepId}`).addClass("show");
    onStepChange(stepId);
  }
});

Template.setup.onRendered(function () {
  // LoadingOverlay.show();
  const templateObject = Template.instance();

  templateObject.isSetupFinished = async () => {
    const isFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
    if (isFinished == true || isFinished == "true") {
      FlowRouter.go("dashboard");
    }
  };

  // Get step local storage variable and set step
  const currentStep = getCurrentStep();
  templateObject.loadSteps = () => {
    let _steps = [];
    let remainingSteps = 0;
    for (let i = 1; i <= numberOfSteps - 1; i++) {
      let isStepConfirm = isConfirmedStep(i);
      if (isStepConfirm == false) {
        remainingSteps++;
      }
      _steps.push({
        id: i,
        index: i,
        active: getCurrentStep() == i ? true : false,
        clickable: !isClickableStep(i),
        isConfirmed: isStepConfirm,
        skippedSteps: isStepSkipped(i),
        title: stepTitles[i - 1]
      });

      setAlreadyLoaded(i, false);
    }
    _steps.push({
      id: numberOfSteps,
      index: numberOfSteps,
      active: (getCurrentStep() == numberOfSteps) ? true : false,
      clickable: !isClickableStep(numberOfSteps),
      isConfirmed: (remainingSteps == 0) ? true : false,
      skippedSteps: isStepSkipped(numberOfSteps),
      title: stepTitles[numberOfSteps - 1]
    });
    templateObject.steps.set(_steps);
  };

  setTimeout(function () {
    var url = FlowRouter.current().path;
    if (url.indexOf("?step") > 0) {
      url = new URL(window.location.href);
      var stepId = url.searchParams.get("step");
      $('#progress-steps a[' + 'data-step-id="' + stepId + '"]').trigger("click");
    }
  }, 200);


  templateObject.loadSteps();

  if (currentStep !== null) {
    $(".first-page").css("display", "none");
    $(".main-setup").css("display", "flex");
    let confirmedSteps =
      localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || "";
    for (let i = 0; i < currentStep; i++) {
      if (confirmedSteps.includes(i + 1))
        $(`.setup-stepper li:nth-child(${i + 1})`).addClass("completed");
      if (templateObject.isStepActive(i + 1) == true) {
        $(`.setup-stepper li:nth-child(${i + 1}) a`).removeClass(
          "clickDisabled"
        );
      }
    }
    if (currentStep !== numberOfSteps) {
      $(`.setup-stepper li:nth-child(${currentStep})`).addClass("current");
    }
  }

  /**
   * This function will finish the setup
   */
  templateObject.setSetupFinished = async () => {
    LoadingOverlay.show();
    let data = await organisationService.getOrganisationDetail();
    let companyInfo = data.tcompanyinfo[0];

    let allStepsConfirmed = false;
    let confirmedSteps = getConfirmedSteps();
    let arrConfirmedSteps = JSON.parse(confirmedSteps);
    let cntConfirmedSteps = arrConfirmedSteps.length;
    if (cntConfirmedSteps == confirmStepCount)
      allStepsConfirmed = true;
    companyInfo.Address3 = cntConfirmedSteps.toString();

    organisationService.saveOrganisationSetting({
      type: "TCompanyInfo",
      fields: companyInfo,
    });

    localStorage.setItem("IS_SETUP_FINISHED", allStepsConfirmed);

    window.location.href = "/onloginsuccess";
    // FlowRouter.go("onloginsuccess");
    LoadingOverlay.hide();

  };

  $(function () {
    $(".resizablePopup").resizable();
  });
  
  templateObject.loadInventory = async (refresh = false) => {
    LoadingOverlay.show();
    let _inventoryList = [];
    let data = await sideBarService.getNewProductListVS1("All");

    await addVS1Data("TProductVS1", JSON.stringify(data));

    if (data.tproductvs1) {
      departmentData = "All";

      data.tproductvs1.forEach((product) => {
        let availableQty = 0;
        let onSOORDer = 0;

        if (product.fields.ProductClass != null) {
          for (let a = 0; a < product.fields.ProductClass.length; a++) {
            availableQty +=
              product.fields.ProductClass[a].fields.AvailableQuantity || 0;
          }
        }
        product.fields.AvailableQuantity = availableQty;
        product.fields.onBOOrder = product.fields.TotalQtyInStock - availableQty;
        product.fields.onSOOrder = onSOORDer;

        (product.fields.CostPrice = utilityService.modifynegativeCurrencyFormat(
          Math.floor(product.fields.BuyQty1Cost * 100) / 100
        )),
          (product.fields.CostPriceInc =
            utilityService.modifynegativeCurrencyFormat(
              Math.floor(product.fields.BuyQty1CostInc * 100) / 100
            )),
          (product.fields.SellPrice =
            utilityService.modifynegativeCurrencyFormat(
              Math.floor(product.fields.SellQty1Price * 100) / 100
            )),
          (product.fields.SellPriceInc =
            utilityService.modifynegativeCurrencyFormat(
              Math.floor(product.fields.SellQty1PriceInc * 100) / 100
            )),
          _inventoryList.push({ ...product.fields });
      });
    }

    await templateObject.inventoryList.set(_inventoryList);

    if (await templateObject.inventoryList.get()) {
      if ($.fn.dataTable.isDataTable("#InventoryTable")) {
        $("#InventoryTable").DataTable().destroy();
      }

      setTimeout(function () {
        $("#InventoryTable")
          .dataTable({
            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            select: true,
            destroy: true,
            colReorder: true,
            pageLength: 25,
            paging: true,
            info: true,
            responsive: true,
            "order": [1, 'asc'],
            action: function () {
              $("#InventoryTable").DataTable().ajax.reload();
            },
            language: { search: "", searchPlaceholder: "Search List..." },
            fnInitComplete: function () {
              $(
                "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
              ).insertAfter("#tblInventory_filter");
            },
          })
          .on("length.dt", function (e, settings, len) {
            $(".fullScreenSpin").css("display", "inline-block");
            let dataLenght = settings._iDisplayLength;
            if (dataLenght == -1) {
              LoadingOverlay.hide();
            } else {
              if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                LoadingOverlay.hide();
              } else {
                LoadingOverlay.hide();
              }
            }
          });

        LoadingOverlay.hide();
        $("div.dataTables_filter input").addClass(
          "form-control form-control-sm"
        );
      }, refreshTableTimout);
    }
  };

});



Template.setup.events({
  "click #start-wizard": (e) => {
    let templateObject = Template.instance();
    $(`[data-step-id=1]`).parents("li").addClass("current");
    $(".first-page").css("display", "none");
    $(".main-setup").css("display", "flex");
    templateObject.setCurrentStep(1);
    templateObject.loadSteps();
  },
  "click .confirmBtn": (event) => {
    LoadingOverlay.show();
    const templateObject = Template.instance();
    let stepId = parseInt($(event.currentTarget).attr("data-step-id"));
    templateObject.goToNextStep(stepId, true, (step) => { });
    templateObject.loadSteps();
    window.scrollTo(0, 0);
    LoadingOverlay.hide();
  },
  "click .btnBack": (event) => {
    const templateObject = Template.instance();
    playCancelAudio();
    setTimeout(function () {
      LoadingOverlay.show();
      let skippedSteps = templateObject.skippedSteps.get();
      let stepId = parseInt($(event.currentTarget).attr("data-step-id"));
      templateObject.goToNextStep(stepId, false, (step) => { });
      if (!skippedSteps.includes(stepId)) skippedSteps.push(stepId);
      templateObject.skippedSteps.set(skippedSteps);
      templateObject.loadSteps();
      window.scrollTo(0, 0);
      LoadingOverlay.hide();
    }, delayTimeAfterSound);
  },
  "click .gotToStepID": (event) => {
    const templateObj = Template.instance();
    const stepId = parseInt($(event.currentTarget).attr("data-step-id"));
    $(".setup-step").removeClass("show");
    $(`.setup-step-${stepId}`).addClass("show");
    $(`.setup-stepper li`).removeClass("current");
    $(`.setup-stepper li:nth-child(${stepId})`).addClass("current");
    templateObj.setCurrentStep(stepId);
    templateObj.loadSteps();
  },
  "click #launchBtn": function () {
    const templateObject = Template.instance();
    templateObject.setSetupFinished();
  },

  // TODO: Step 1
  // Organization setting Events
  "click #edtCountry": async function (event) {
    await clearData('TTaxcodeVS1');
  },
  // Accounts Import functionality
  "click .new_attachment_btn_inventory": function (event) {
    $("#attachment-upload-inventory").val("");
    $(".file-name").text("");
    $("#attachment-upload-inventory").trigger("click");
  },
  "change #attachment-upload-inventory": async function (e) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload-inventory")[0].files[0]["name"];
    var fileExtension = filename.split(".").pop().toLowerCase();
    var validExtensions = ["csv", "txt", "xlsx", "xls"];
    var validCSVExtensions = ["csv", "txt"];

    if (validExtensions.indexOf(fileExtension) == -1) {
      swal(
        "Invalid Format",
        "formats allowed are :" + validExtensions.join(", "),
        "error"
      );
      $(".file-name").text("");
      $(".btnInventoryImport").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnInventoryImport").removeAttr("disabled");
      } else {
        $(".btnInventoryImport").Attr("disabled");
      }
    } else if (fileExtension == "xls") {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      var oFileIn;
      var oFile = selectedFile;
      var sFilename = oFile.name;
      // Create A File Reader HTML5
      var reader = new FileReader();

      // Ready The Event For When A File Gets Selected
      reader.onload = function (e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workbook = XLSX.read(data, {
          type: "array",
        });

        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
          var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
          });
          var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
          templateObj.selectedFile.set(sCSV);

          if (roa.length) result[sheetName] = roa;
        });
        // see the result, caution: it works after reader event is done.
      };
      reader.readAsArrayBuffer(oFile);

      if ($(".file-name").text() != "") {
        $(".btnInventoryImport").removeAttr("disabled");
      } else {
        $(".btnInventoryImport").Attr("disabled");
      }
    }
  },
  "click .btnInventoryImport": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let accountService = new AccountService();
    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "Product Name" &&
            results.data[0][1] == "Sales Description" &&
            results.data[0][2] == "Sale Price" &&
            results.data[0][3] == "Sales Account" &&
            results.data[0][4] == "Tax Code" &&
            results.data[0][5] == "Barcode" &&
            results.data[0][6] == "Purchase Description" &&
            results.data[0][7] == "COGGS Account" &&
            results.data[0][8] == "Purchase Tax Code" &&
            results.data[0][9] == "Cost" &&
            results.data[0][10] == "Product Type"
          ) {
            let dataLength = results.data.length * 3000;
            setTimeout(function () {
              // Meteor._reload.reload();
              $(".fullScreenSpin").css("display", "none");
            }, parseInt(dataLength));

            for (let i = 0; i < results.data.length - 1; i++) {
              objDetails = {
                type: "TProductVS1",
                fields: {
                  Active: true,
                  ProductType: results.data[i + 1][10] || "INV",

                  ProductPrintName: results.data[i + 1][0],
                  ProductName: results.data[i + 1][0],
                  SalesDescription: results.data[i + 1][1],
                  SellQty1Price: parseFloat(
                    results.data[i + 1][2].replace(/[^0-9.-]+/g, "")
                  ) || 0,
                  IncomeAccount: results.data[i + 1][3],
                  TaxCodeSales: results.data[i + 1][4],
                  Barcode: results.data[i + 1][5],
                  PurchaseDescription: results.data[i + 1][6],

                  CogsAccount: results.data[i + 1][7],

                  TaxCodePurchase: results.data[i + 1][8],

                  BuyQty1Cost: parseFloat(
                    results.data[i + 1][9].replace(/[^0-9.-]+/g, "")
                  ) || 0,

                  PublishOnVS1: true,
                },
              };
              if (results.data[i + 1][1]) {
                if (results.data[i + 1][1] !== "") {
                  productService
                    .saveProductVS1(objDetails)
                    .then(function (data) {
                      // Meteor._reload.reload();
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
                          // Meteor._reload.reload();
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
  "change #attachment-upload-account": async function (e) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload-account")[0].files[0]["name"];
    var fileExtension = filename.split(".").pop().toLowerCase();
    var validExtensions = ["csv", "txt", "xlsx", "xls"];
    var validCSVExtensions = ["csv", "txt"];

    if (validExtensions.indexOf(fileExtension) == -1) {
      swal(
        "Invalid Format",
        "formats allowed are :" + validExtensions.join(", "),
        "error"
      );
      $(".file-name").text("");
      $(".btnAccountImport").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnAccountImport").removeAttr("disabled");
      } else {
        $(".btnAccountImport").Attr("disabled");
      }
    } else if (fileExtension == "xls") {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      var oFile = selectedFile;
      // Create A File Reader HTML5
      var reader = new FileReader();

      // Ready The Event For When A File Gets Selected
      reader.onload = function (e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workbook = XLSX.read(data, {
          type: "array",
        });

        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
          var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
          });
          var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
          templateObj.selectedFile.set(sCSV);

          if (roa.length) result[sheetName] = roa;
        });
      };
      reader.readAsArrayBuffer(oFile);

      if ($(".file-name").text() != "") {
        $(".btnAccountImport").removeAttr("disabled");
      } else {
        $(".btnAccountImport").Attr("disabled");
      }
    }
  },
  "click .btnAccountImport": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let accountService = new AccountService();
    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "Account Name" &&
            results.data[0][1] == "Description" &&
            results.data[0][2] == "Account No" &&
            results.data[0][3] == "Type" &&
            results.data[0][4] == "Balance" &&
            results.data[0][5] == "Tax Code" &&
            results.data[0][6] == "Bank Acc Name" &&
            results.data[0][7] == "BSB" &&
            results.data[0][8] == "Bank Acc No"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function () {
              sideBarService
                .getAccountListVS1()
                .then(function (dataReload) {
                  addVS1Data("TAccountVS1", JSON.stringify(dataReload))
                    .then(function (datareturn) {
                    })
                    .catch(function (err) {
                    });
                })
                .catch(function (err) {
                  Meteor._reload.reload();
                });
            }, parseInt(dataLength));
            for (let i = 0; i < results.data.length - 1; i++) {
              objDetails = {
                type: "TAccount",
                fields: {
                  Active: true,
                  AccountName: results.data[i + 1][0],
                  Description: results.data[i + 1][1],
                  AccountNumber: results.data[i + 1][2],
                  AccountTypeName: results.data[i + 1][3],
                  Balance: Number(
                    results.data[i + 1][4].replace(/[^0-9.-]+/g, "")
                  ) || 0,
                  TaxCode: results.data[i + 1][5],
                  BankAccountName: results.data[i + 1][6],
                  BSB: results.data[i + 1][7],
                  BankAccountNumber: results.data[i + 1][8],
                  PublishOnVS1: true,
                },
              };
              if (results.data[i + 1][1]) {
                if (results.data[i + 1][1] !== "") {
                  accountService
                    .saveAccount(objDetails)
                    .then(function (data) { })
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
                        } else if (result.dismiss === "cancel") { }
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
  "click .new_attachment_btn_account": function (event) {
    $("#attachment-upload-account").val("");
    $(".file-name").text("");
    $("#attachment-upload-account").trigger("click");
  },
  "change #img-attachment-upload-account": function (e) {
    let templateObj = Template.instance();
    let saveToTAttachment = false;
    let lineIDForAttachment = false;
    let uploadedFilesArray = templateObj.uploadedFiles.get();

    let myFiles = $("#img-attachment-upload-account")[0].files;
    let uploadData = utilityService.attachmentUpload(
      uploadedFilesArray,
      myFiles,
      saveToTAttachment,
      lineIDForAttachment
    );
    templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
    templateObj.attachmentCount.set(uploadData.totalAttachments);
  },
  "click .remove-attachment": function (event, ui) {
    let tempObj = Template.instance();
    let attachmentID = parseInt(event.target.id.split("remove-attachment-")[1]);
    if (tempObj.$("#confirm-action-" + attachmentID).length) {
      tempObj.$("#confirm-action-" + attachmentID).remove();
    } else {
      let actionElement =
        '<div class="confirm-action" id="confirm-action-' +
        attachmentID +
        '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' +
        attachmentID +
        '">' +
        'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
      tempObj.$("#attachment-name-" + attachmentID).append(actionElement);
    }
    tempObj.$("#new-attachment2-tooltip").show();
  },
  "click .file-name": function (event) {
    let attachmentID = parseInt(
      event.currentTarget.parentNode.id.split("attachment-name-")[1]
    );
    let templateObj = Template.instance();
    let uploadedFiles = templateObj.uploadedFiles.get();

    $("#myModalAttachment").modal("hide");
    let previewFile = {};
    let input = uploadedFiles[attachmentID].fields.Description;
    previewFile.link =
      "data:" +
      input +
      ";base64," +
      uploadedFiles[attachmentID].fields.Attachment;
    previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
    let type = uploadedFiles[attachmentID].fields.Description;
    if (type === "application/pdf") {
      previewFile.class = "pdf-class";
    } else if (
      type === "application/msword" ||
      type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      previewFile.class = "docx-class";
    } else if (
      type === "application/vnd.ms-excel" ||
      type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      previewFile.class = "excel-class";
    } else if (
      type === "application/vnd.ms-powerpoint" ||
      type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      previewFile.class = "ppt-class";
    } else if (
      type === "application/vnd.oasis.opendocument.formula" ||
      type === "text/csv" ||
      type === "text/plain" ||
      type === "text/rtf"
    ) {
      previewFile.class = "txt-class";
    } else if (
      type === "application/zip" ||
      type === "application/rar" ||
      type === "application/x-zip-compressed" ||
      type === "application/x-zip,application/x-7z-compressed"
    ) {
      previewFile.class = "zip-class";
    } else {
      previewFile.class = "default-class";
    }

    previewFile.image = type.split("/")[0] === "image";
    templateObj.uploadedFile.set(previewFile);

    $("#files_view").modal("show");
  },
  "click .confirm-delete-attachment": function (event, ui) {
    let tempObj = Template.instance();
    tempObj.$("#new-attachment2-tooltip").show();
    let attachmentID = parseInt(event.target.id.split("delete-attachment-")[1]);
    let uploadedArray = tempObj.uploadedFiles.get();
    let attachmentCount = tempObj.attachmentCount.get();
    $("#attachment-upload").val("");
    uploadedArray.splice(attachmentID, 1);
    tempObj.uploadedFiles.set(uploadedArray);
    attachmentCount--;
    if (attachmentCount === 0) {
      let elementToAdd =
        '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
      $("#file-display").html(elementToAdd);
    }
    tempObj.attachmentCount.set(attachmentCount);
    if (uploadedArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachment(uploadedArray);
    } else {
      $(".attchment-tooltip").show();
    }
  },
  "click .save-to-library": function (event, ui) {
    $(".confirm-delete-attachment").trigger("click");
  },
  "click #btn_Attachment": function () {
    let templateInstance = Template.instance();
    let uploadedFileArray = templateInstance.uploadedFiles.get();
    if (uploadedFileArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachment(uploadedFileArray);
    } else {
      $(".attchment-tooltip").show();
    }
  },
  "click #btnPayment": function () {
    let templateObject = Template.instance();
    let suppliername = $("#edtSupplierName");
    let purchaseService = new PurchaseBoardService();
    if (suppliername.val() === "") {
      swal("Supplier has not been selected!", "", "warning");
      e.preventDefault();
    } else {
      $(".fullScreenSpin").css("display", "inline-block");
      var splashLineArray = [];
      let lineItemsForm = [];
      let lineItemObjForm = {};
      $("#tblCreditLine > tbody > tr").each(function () {
        var lineID = this.id;
        let tdaccount = $("#" + lineID + " .lineAccountName").text();
        let tddmemo = $("#" + lineID + " .lineMemo").text();
        let tdamount = $("#" + lineID + " .lineAmount").val();
        let tdtaxCode = $("#" + lineID + " .lineTaxCode").text();

        if (tdaccount !== "") {
          lineItemObjForm = {
            type: "TCreditLine",
            fields: {
              AccountName: tdaccount || "",
              ProductDescription: tddmemo || "",

              LineCost: Number(tdamount.replace(/[^0-9.-]+/g, "")) || 0,
              LineTaxCode: tdtaxCode || "",
              LineClassName: $("#sltDept").val() || defaultDept,
            },
          };
          lineItemsForm.push(lineItemObjForm);
          splashLineArray.push(lineItemObjForm);
        }
      });
      let getchkcustomField1 = true;
      let getchkcustomField2 = true;
      let getcustomField1 = $(".customField1Text").html();
      let getcustomField2 = $(".customField2Text").html();
      if ($("#formCheck-one").is(":checked")) {
        getchkcustomField1 = false;
      }
      if ($("#formCheck-two").is(":checked")) {
        getchkcustomField2 = false;
      }

      let supplier = $("#edtSupplierName").val();
      let supplierEmail = $("#edtSupplierEmail").val();
      let billingAddress = $("#txabillingAddress").val();

      var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
      var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

      let saleDate =
        saledateTime.getFullYear() +
        "-" +
        (saledateTime.getMonth() + 1) +
        "-" +
        saledateTime.getDate();
      let dueDate =
        duedateTime.getFullYear() +
        "-" +
        (duedateTime.getMonth() + 1) +
        "-" +
        duedateTime.getDate();

      let poNumber = $("#ponumber").val();
      let reference = $("#edtRef").val();
      let termname = $("#sltTerms").val();
      let departement = $("#sltVia").val();
      let shippingAddress = $("#txaShipingInfo").val();
      let comments = $("#txaComment").val();
      let pickingInfrmation = $("#txapickmemo").val();

      var url = FlowRouter.current().path;
      var getso_id = url.split("?id=");
      var currentCredit = getso_id[getso_id.length - 1];
      var currencyCode = $("#sltCurrency").val() || CountryAbbr;
      var objDetails = "";
      if (getso_id[1]) {
        currentCredit = parseInt(currentCredit);
        objDetails = {
          type: "TCredit",
          fields: {
            ID: currentCredit,
            SupplierName: supplier,
            ForeignExchangeCode: currencyCode,
            Lines: splashLineArray,
            OrderTo: billingAddress,
            OrderDate: saleDate,
            Deleted: false,

            SupplierInvoiceNumber: poNumber,
            ConNote: reference,
            TermsName: termname,
            Shipping: departement,
            ShipTo: shippingAddress,
            Comments: comments,

            SalesComments: pickingInfrmation,

            OrderStatus: $("#sltStatus").val(),
          },
        };
      } else {
        objDetails = {
          type: "TCredit",
          fields: {
            SupplierName: supplier,
            ForeignExchangeCode: currencyCode,
            Lines: splashLineArray,
            OrderTo: billingAddress,
            Deleted: false,

            SupplierInvoiceNumber: poNumber,
            ConNote: reference,
            TermsName: termname,
            Shipping: departement,
            ShipTo: shippingAddress,
            Comments: comments,

            SalesComments: pickingInfrmation,

            OrderStatus: $("#sltStatus").val(),
          },
        };
      }

      purchaseService
        .saveCredit(objDetails)
        .then(function (objDetails) {
          var supplierID = $("#edtSupplierEmail").attr("supplierid");
          if (supplierID !== " ") {
            let supplierEmailData = {
              type: "TSupplier",
              fields: {
                ID: supplierID,
                Email: supplierEmail,
              },
            };
            purchaseService
              .saveSupplierEmail(supplierEmailData)
              .then(function (supplierEmailData) { });
          }
          let linesave = objDetails.fields.ID;

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
                PrefName: "creditcard",
              });

              if (checkPrefDetails) {
                CloudPreference.update(
                  {
                    _id: checkPrefDetails._id,
                  },
                  {
                    $set: {
                      username: clientUsername,
                      useremail: clientEmail,
                      PrefGroup: "purchaseform",
                      PrefName: "creditcard",
                      published: true,
                      customFields: [
                        {
                          index: "1",
                          label: getcustomField1,
                          hidden: getchkcustomField1,
                        },
                        {
                          index: "2",
                          label: getcustomField2,
                          hidden: getchkcustomField2,
                        },
                      ],
                      updatedAt: new Date(),
                    },
                  },
                  function (err, idTag) {
                    if (err) {
                      window.open("/paymentcard?soid=" + linesave, "_self");
                    } else {
                      window.open("/paymentcard?soid=" + linesave, "_self");
                    }
                  }
                );
              } else {
                CloudPreference.insert(
                  {
                    userid: clientID,
                    username: clientUsername,
                    useremail: clientEmail,
                    PrefGroup: "purchaseform",
                    PrefName: "creditcard",
                    published: true,
                    customFields: [
                      {
                        index: "1",
                        label: getcustomField1,
                        hidden: getchkcustomField1,
                      },
                      {
                        index: "2",
                        label: getcustomField2,
                        hidden: getchkcustomField2,
                      },
                    ],
                    createdAt: new Date(),
                  },
                  function (err, idTag) {
                    if (err) {
                      window.open("/paymentcard?soid=" + linesave, "_self");
                    } else {
                      window.open("/paymentcard?soid=" + linesave, "_self");
                    }
                  }
                );
              }
            }
          }
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
            } else if (result.dismiss === "cancel") {
            }
          });

          LoadingOverlay.hide();
        });
    }
  },
  "click .chkEmailCopy": function (event) {
    $("#edtSupplierEmail").val($("#edtSupplierEmail").val().replace(/\s/g, ""));
    if ($(event.target).is(":checked")) {
      let checkEmailData = $("#edtSupplierEmail").val();
      if (checkEmailData.replace(/\s/g, "") === "") {
        swal("Supplier Email cannot be blank!", "", "warning");
        event.preventDefault();
      } else {
        function isEmailValid(mailTo) {
          return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
        }
        if (!isEmailValid(checkEmailData)) {
          swal(
            "The email field must be a valid email address !",
            "",
            "warning"
          );

          event.preventDefault();
          return false;
        } else {
        }
      }
    } else {
    }
  },
  "click .exportbtn": (e) => {
    const type = $(e.currentTarget).attr("data-target");
    if (type) {
      LoadingOverlay.show();
      jQuery(`${type} .dt-buttons .btntabletocsv`).click();
      LoadingOverlay.hide();
    }
  },
  "click .exportbtnExcel": (e) => {
    const type = $(e.currentTarget).attr("data-target");
    if (type) {
      LoadingOverlay.show();
      jQuery(`${type} .dt-buttons .btntabletoexcel`).click();
      LoadingOverlay.hide();
    }
  },
  "click .printConfirm": (e) => {
    playPrintAudio();
    setTimeout(function () {
      const type = $(e.currentTarget).attr("data-target");
      if (type) {
        LoadingOverlay.show();
        jQuery(`${type} .dt-buttons .btntabletopdf`).click();
        LoadingOverlay.hide();
      }
    }, delayTimeAfterSound);
  },
  "click .setup-step-9 .btnRefresh": (e) => {
    const templateObject = Template.instance();
    templateObject.loadInventory(true);
    $(".modal.show").modal("hide");
  },
  "click .setup-step-9 .templateDownload": function () {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleProduct" + ".csv";
    rows[0] = [
      "Product Name",
      "Sales Description",
      "Sale Price",
      "Sales Account",
      "Tax Code",
      "Barcode",
      "Purchase Description",
      "COGGS Account",
      "Purchase Tax Code",
      "Cost",
      "Product Type",
    ];
    rows[1] = [
      "TSL - Black",
      "T-Shirt Large Black",
      "600",
      "Sales",
      "NT",
      "",
      "T-Shirt Large Black",
      "Cost of Goods Sold",
      "NT",
      "700",
      "NONINV",
    ];
    rows[2] = [
      "TSL - Blue",
      "T-Shirt Large Blue",
      "600",
      "Sales",
      "NT",
      "",
      "T-Shirt Large Blue",
      "Cost of Goods Sold",
      "NT",
      "700",
      "INV",
    ];
    rows[3] = [
      "TSL - Yellow",
      "T-Shirt Large Yellow",
      "600",
      "Sales",
      "NT",
      "",
      "T-Shirt Large Yellow",
      "Cost of Goods Sold",
      "NT",
      "700",
      "OTHER",
    ];
    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .setup-step-9 .templateDownloadXLSX": function (e) {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleProduct" + ".xls";
    rows[0] = [
      "Product Name",
      "Sales Description",
      "Sale Price",
      "Sales Account",
      "Tax Code",
      "Barcode",
      "Purchase Description",
      "COGGS Account",
      "Purchase Tax Code",
      "Cost",
      "Product Type",
    ];
    rows[1] = [
      "TSL - Black",
      "T-Shirt Large Black",
      "600",
      "Sales",
      "NT",
      "",
      "T-Shirt Large Black",
      "Cost of Goods Sold",
      "NT",
      "700",
      "NONINV",
    ];
    rows[2] = [
      "TSL - Blue",
      "T-Shirt Large Blue",
      "600",
      "Sales",
      "NT",
      "",
      "T-Shirt Large Blue",
      "Cost of Goods Sold",
      "NT",
      "700",
      "INV",
    ];
    rows[3] = [
      "TSL - Yellow",
      "T-Shirt Large Yellow",
      "600",
      "Sales",
      "NT",
      "",
      "T-Shirt Large Yellow",
      "Cost of Goods Sold",
      "NT",
      "700",
      "OTHER",
    ];
    utilityService.exportToCsv(rows, filename, "xls");
  },
  "click .lblCostEx": function (event) {
    var $earch = $(event.currentTarget);
    var offset = $earch.offset();
    if (event.pageX > offset.left + $earch.width() - 10) {
    } else {
      $(".lblCostEx").addClass("hiddenColumn");
      $(".lblCostInc").removeClass("hiddenColumn");
      $(".colCostPriceInc").removeClass("hiddenColumn");
      $(".colCostPrice").addClass("hiddenColumn");
    }
  },
  "click .lblCostInc": function (event) {
    var $earch = $(event.currentTarget);
    var offset = $earch.offset();
    if (event.pageX > offset.left + $earch.width() - 10) {
    } else {
      $(".lblCostInc").addClass("hiddenColumn");
      $(".lblCostEx").removeClass("hiddenColumn");
      $(".colCostPrice").removeClass("hiddenColumn");
      $(".colCostPriceInc").addClass("hiddenColumn");
    }
  },
  "click .lblPriceEx": function (event) {
    var $earch = $(event.currentTarget);
    var offset = $earch.offset();
    if (event.pageX > offset.left + $earch.width() - 10) {
    } else {
      $(".lblPriceEx").addClass("hiddenColumn");
      $(".lblPriceInc").removeClass("hiddenColumn");
      $(".colSalePriceInc").removeClass("hiddenColumn");
      $(".colSalePrice").addClass("hiddenColumn");
    }
  },
  "click .lblPriceInc": function (event) {
    var $earch = $(event.currentTarget);
    var offset = $earch.offset();
    if (event.pageX > offset.left + $earch.width() - 10) {
    } else {
      $(".lblPriceInc").addClass("hiddenColumn");
      $(".lblPriceEx").removeClass("hiddenColumn");
      $(".colSalePrice").removeClass("hiddenColumn");
      $(".colSalePriceInc").addClass("hiddenColumn");
    }
  },
  "click #btnNewProduct": (e) => {
    const modal = $(e.currentTarget).attr("data-toggle");
    $(modal).modal("show");
  },
});

Template.setup.helpers({
  currentStep: () => {
    return Template.instance().currentStep.get();
  },
  steps: () => {
    return Template.instance().steps.get();
  },
  // Step 2 helpers
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
  setupFinished: () => {
    let setupFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
    if (setupFinished == true || setupFinished == "true") {
      return false;
    } else {
      return true;
    }
  },

  statusrecords: () => {
    return Template.instance()
      .statusrecords.get()
      .sort(function (a, b) {
        if (a.orderstatus === "NA") {
          return 1;
        } else if (b.orderstatus === "NA") {
          return -1;
        }
        return a.orderstatus.toUpperCase() > b.orderstatus.toUpperCase()
          ? 1
          : -1;
      });
  },
  companyaddress1: () => {
    return localStorage.getItem("vs1companyaddress1");
  },
  companyaddress2: () => {
    return localStorage.getItem("vs1companyaddress2");
  },
  companyphone: () => {
    return localStorage.getItem("vs1companyPhone");
  },
  companyabn: () => {
    return localStorage.getItem("vs1companyABN");
  },
  organizationname: () => {
    return localStorage.getItem("vs1companyName");
  },
  organizationurl: () => {
    return localStorage.getItem("vs1companyURL");
  },
  isMobileDevices: () => {
    var isMobile = false;

    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4)
      )
    ) {
      isMobile = true;
    }

    return isMobile;
  },
  isCurrencyEnable: () => FxGlobalFunctions.isCurrencyEnabled(),

  // Step 9 helpers
  inventoryList: () => {
    return Template.instance().inventoryList.get();
  },
});

Template.registerHelper("equals", function (a, b) {
  return a === b;
});

Template.registerHelper("isActive", function (currentStep, step) {
  return currentStep == step;
});
