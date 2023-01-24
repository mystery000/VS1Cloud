import { Meteor } from "meteor/meteor";
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import { OrganisationService } from "../js/organisation-service";
import { CountryService } from "../js/country-service";
import { TaxRateService } from "../settings/settings-service.js";
import { SideBarService } from "../js/sidebar-service";
import { UtilityService } from "../utility-service";
import { PurchaseBoardService } from "../js/purchase-service";
import LoadingOverlay from "../LoadingOverlay";
import Employee from "../js/Api/Model/Employee";
import { AccountService } from "../accounts/account-service";
import "jquery-editable-select";
import { ContactService } from "../contacts/contact-service";
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

let organisationService = new OrganisationService();
let sideBarService = new SideBarService();
const contactService = new ContactService();
const utilityService = new UtilityService();

const refreshTableTimout = 300;

let stepTitles = ["Organization", "Tax Rates", "Payment", "Terms", "Employees", "Accounts", "Customers", "Suppliers", "Inventory", "Dashboard", "Launch"];

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
          if(result.data != undefined) {
            if( result.data.tcompanyinfo.length > 0 ){
              let data = result.data.tcompanyinfo[0];
              let cntConfirmedSteps = data.Address3 == "" ? 0 : parseInt(data.Address3);
              let bSetupFinished = cntConfirmedSteps == confirmStepCount ? true : false;
              localStorage.setItem("IS_SETUP_FINISHED", bSetupFinished); //data.IsSetUpWizard
              if(bSetupFinished == true) { // data.IsSetUpWizard
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

export const isSetupFinished  = async () => {
  const isFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
  if (isFinished == true || isFinished == "true") {
    return true;
  }
  return false;
}

function MakeNegative() {
  $("td").each(function () {
    if (
      $(this)
        .text()
        .indexOf("-" + Currency) >= 0
    )
      $(this).addClass("text-danger");
  });
}

const numberOfSteps = confirmStepCount + 1;


function setAlreadyLoaded(step, bool = false) {
  return localStorage.setItem(`SETUP_STEP_ALREADY-${step}`, bool);
}

function isAlreadyLoaded(step) {
  const string = localStorage.getItem(`SETUP_STEP_ALREADY-${step}`) || false;

  return string == "true" || string == true ? true : false;
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
  // Step 2 variables
  templateObject.taxRates = new ReactiveVar([]);
  // templateObject.taxRatesHeaders = new ReactiveVar([]);
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.defaultpurchasetaxcode = new ReactiveVar();
  templateObject.defaultsaletaxcode = new ReactiveVar();

  // Step 3 variables
  templateObject.paymentmethoddatatablerecords = new ReactiveVar([]);
  templateObject.paymentmethodtableheaderrecords = new ReactiveVar([]);
  templateObject.deptrecords = new ReactiveVar();
  templateObject.includeCreditCard = new ReactiveVar();
  templateObject.includeCreditCard.set(false);
  templateObject.includeAccountID = new ReactiveVar();
  templateObject.includeAccountID.set(false);
  templateObject.accountID = new ReactiveVar();
  // Step 4 variables
  templateObject.termdatatablerecords = new ReactiveVar([]);
  templateObject.termtableheaderrecords = new ReactiveVar([]);
  templateObject.include7Days = new ReactiveVar(false);
  templateObject.include30Days = new ReactiveVar(false);
  templateObject.includeCOD = new ReactiveVar(false);
  templateObject.includeEOM = new ReactiveVar(false);
  templateObject.includeEOMPlus = new ReactiveVar(false);
  templateObject.includeSalesDefault = new ReactiveVar(false);
  templateObject.includePurchaseDefault = new ReactiveVar(false);
  // Step 5 variables
  // templateObject.employeedatatablerecords = new ReactiveVar([]);
  templateObject.employeetableheaderrecords = new ReactiveVar([]);
  templateObject.selectedFile = new ReactiveVar();
  templateObject.currentEmployees = new ReactiveVar([]);
  templateObject.editableEmployee = new ReactiveVar();
  templateObject.empuserrecord = new ReactiveVar();

  // Step 6 variables
  templateObject.accountList = new ReactiveVar([]);
  templateObject.accountTypes = new ReactiveVar([]);

  templateObject.records = new ReactiveVar();
  templateObject.CleintName = new ReactiveVar();
  templateObject.Department = new ReactiveVar();
  templateObject.Date = new ReactiveVar();
  templateObject.DueDate = new ReactiveVar();
  templateObject.CreditNo = new ReactiveVar();
  templateObject.RefNo = new ReactiveVar();
  templateObject.Branding = new ReactiveVar();
  templateObject.Currency = new ReactiveVar();
  templateObject.Total = new ReactiveVar();
  templateObject.Subtotal = new ReactiveVar();
  templateObject.TotalTax = new ReactiveVar();
  templateObject.creditrecord = new ReactiveVar({});
  templateObject.taxrateobj = new ReactiveVar();
  templateObject.Accounts = new ReactiveVar([]);
  templateObject.CreditId = new ReactiveVar();
  templateObject.selectedCurrency = new ReactiveVar([]);
  templateObject.inputSelectedCurrency = new ReactiveVar([]);
  templateObject.currencySymbol = new ReactiveVar([]);
  templateObject.viarecords = new ReactiveVar();
  templateObject.termrecords = new ReactiveVar();
  templateObject.clientrecords = new ReactiveVar([]);
  templateObject.taxraterecords = new ReactiveVar([]);
  templateObject.uploadedFile = new ReactiveVar();
  templateObject.uploadedFiles = new ReactiveVar([]);
  templateObject.attachmentCount = new ReactiveVar();
  templateObject.address = new ReactiveVar();
  templateObject.abn = new ReactiveVar();
  templateObject.referenceNumber = new ReactiveVar();
  templateObject.statusrecords = new ReactiveVar([]);

  // Step 7 variables
  templateObject.customerList = new ReactiveVar([]);

  // Step 8 variables
  templateObject.supplierList = new ReactiveVar([]);

  // Step 9 variables
  templateObject.inventoryList = new ReactiveVar([]);

  templateObject.setCurrentStep = (stepId = 1) => {
    if (isNaN(stepId)) return false;
    let templateObject = Template.instance();
    templateObject.currentStep.set(stepId);
    return localStorage.setItem("VS1Cloud_SETUP_STEP", parseInt(stepId));
  }
});

Template.setup.onRendered(function () {
  LoadingOverlay.show();
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
      if( isStepConfirm == false ){
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
      active: ( getCurrentStep() == numberOfSteps) ? true : false,
      clickable: !isClickableStep(numberOfSteps),
      isConfirmed: ( remainingSteps == 0 ) ? true : false,
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
      if (isStepActive(i + 1) == true) {
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
    let dashboardArray = [];
    let data = await organisationService.getOrganisationDetail();
    let companyInfo = data.tcompanyinfo[0];

    let allStepsConfirmed = false;
    let confirmedSteps = getConfirmedSteps();
    let arrConfirmedSteps = JSON.parse(confirmedSteps);
    let cntConfirmedSteps = arrConfirmedSteps.length;
    if (cntConfirmedSteps == confirmStepCount)
      allStepsConfirmed = true;
    companyInfo.Address3 = cntConfirmedSteps.toString();

    await organisationService.saveOrganisationSetting({
      type: "TCompanyInfo",
      fields: companyInfo,
    });

    localStorage.setItem("IS_SETUP_FINISHED", allStepsConfirmed);

    // window.location.href = "/";
    FlowRouter.go("dashboard");
  };
  $( function() {
    $( ".resizablePopup" ).resizable();
  } );
  // Step 1 Render functionalities
  let countries = [];
  var countryService = new CountryService();

  // Step 2 Render functionalities

  // STEP 3
  // Step 4 Render functionalities
  let dataTableListTerm = [];
  let tableHeaderListTerm = [];
  templateObject.loadStep4Prefs = () => {
    Meteor.call(
      "readPrefMethod",
      localStorage.getItem("mycloudLogonID"),
      "termsList",
      function (error, result) {
        if (error) {
        } else {
          if (result) {
            for (let i = 0; i < result.customFields.length; i++) {
              let customcolumn = result.customFields;
              let columData = customcolumn[i].label;
              let columHeaderUpdate = customcolumn[i].thclass.replace(
                / /g,
                "."
              );
              let hiddenColumn = customcolumn[i].hidden;
              let columnClass = columHeaderUpdate.split(".")[1];
              let columnWidth = customcolumn[i].width;

              $("th." + columnClass + "").html(columData);
              $("th." + columnClass + "").css("width", "" + columnWidth + "px");
            }
          }
        }
      }
    );
  };

  templateObject.loadTerms = async (refresh = false) => {
    LoadingOverlay.show();
    let dataObject = await getVS1Data("TTermsVS1");
    let data =
      dataObject.length == 0 || refresh == true
        ? await taxRateService.getTermsVS1()
        : JSON.parse(dataObject[0].data);

    if (refresh) {
      await addVS1Data("TTermsVS1", JSON.stringify(dataObject));
    }

    for (let i = 0; i < data.ttermsvs1.length; i++) {
      if (data.ttermsvs1[i].IsDays == true && data.ttermsvs1[i].Days == 0) {
        setISCOD = true;
      } else {
        setISCOD = false;
      }
      var dataList = {
        id: data.ttermsvs1[i].Id || "",
        termname: data.ttermsvs1[i].TermsName || "",
        termdays: data.ttermsvs1[i].Days || 0,
        iscod: setISCOD || false,
        description: data.ttermsvs1[i].Description || "",
        iseom: data.ttermsvs1[i].IsEOM || "false",
        iseomplus: data.ttermsvs1[i].IsEOMPlus || "false",
        isPurchasedefault: data.ttermsvs1[i].isPurchasedefault || "false",
        isSalesdefault: data.ttermsvs1[i].isSalesdefault || "false",
      };

      dataTableListTerm.push(dataList);
    }

    await templateObject.termdatatablerecords.set(dataTableListTerm);

    if (await templateObject.termdatatablerecords.get()) {
      Meteor.call(
        "readPrefMethod",
        localStorage.getItem("mycloudLogonID"),
        "termsList",
        function (error, result) {
          if (error) {
          } else {
            if (result) {
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columHeaderUpdate = customcolumn[i].thclass.replace(
                  / /g,
                  "."
                );
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.split(".")[1];

                if (hiddenColumn == true) {
                  $("." + columnClass + "").addClass("hiddenColumn");
                  $("." + columnClass + "").removeClass("showColumn");
                } else if (hiddenColumn == false) {
                  $("." + columnClass + "").removeClass("hiddenColumn");
                  $("." + columnClass + "").addClass("showColumn");
                }
              }
            }
          }
        }
      );

      setTimeout(function () {
        MakeNegative();
      }, 100);

      if ($.fn.dataTable.isDataTable("#termsList")) {
        $("#termsList").DataTable().destroy();
      }


      setTimeout(function () {
        $("#termsList")
          .DataTable({

            columnDefs: [
              {
                orderable: false,
                targets: -1,
              },
            ],
            select: true,
            destroy: true,
            colReorder: true,
            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
              {
                extend: "csvHtml5",
                text: "",
                download: "open",
                className: "btntabletocsv hiddenColumn",
                filename: "termsList_" + moment().format(),
                orientation: "portrait",
                exportOptions: {
                  columns: ":visible",
                },
              },
              {
                extend: "print",
                download: "open",
                className: "btntabletopdf hiddenColumn",
                text: "",
                title: "Term List",
                filename: "termsList_" + moment().format(),
                exportOptions: {
                  columns: ":visible",
                },
              },
              {
                extend: "excelHtml5",
                title: "",
                download: "open",
                className: "btntabletoexcel hiddenColumn",
                filename: "termsList_" + moment().format(),
                orientation: "portrait",
                exportOptions: {
                  columns: ":visible",
                },
              },
            ],

            pageLength: 25,
            paging: true,

            info: true,
            responsive: true,
            "order": [0, 'asc' ],
            action: function () {
              $("#termsList").DataTable().ajax.reload();
            },
            fnDrawCallback: function (oSettings) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            },
          })
          .on("page", function () {
            setTimeout(function () {
              MakeNegative();
            }, 100);
            let draftRecord = templateObject.termdatatablerecords.get();
            templateObject.termdatatablerecords.set(draftRecord);
          })
          .on("column-reorder", function () {})
          .on("length.dt", function (e, settings, len) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });
      }, 300);
    }

    var columns = $("#termsList th");
    let sWidth = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if (v.className.includes("hiddenColumn")) {
        columVisible = false;
      }
      sWidth = v.style.width.replace("px", "");

      let datatablerecordObj = {
        sTitle: v.innerText || "",
        sWidth: sWidth || "",
        sIndex: v.cellIndex || "",
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderListTerm.push(datatablerecordObj);
    });
    templateObject.termtableheaderrecords.set(tableHeaderListTerm);
    $("div.dataTables_filter input").addClass("form-control form-control-sm");

    LoadingOverlay.hide();
  };

  templateObject.getTerms = function () {
    getVS1Data("TTermsVS1")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          taxRateService
            .getTermsVS1()
            .then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              let setISCOD = false;
              for (let i = 0; i < data.ttermsvs1.length; i++) {
                if (
                  data.ttermsvs1[i].IsDays == true &&
                  data.ttermsvs1[i].Days == 0
                ) {
                  setISCOD = true;
                } else {
                  setISCOD = false;
                }
                var dataList = {
                  id: data.ttermsvs1[i].Id || "",
                  termname: data.ttermsvs1[i].TermsName || "",
                  termdays: data.ttermsvs1[i].Days || 0,
                  iscod: setISCOD || false,
                  description: data.ttermsvs1[i].Description || "",
                  iseom: data.ttermsvs1[i].IsEOM || "false",
                  iseomplus: data.ttermsvs1[i].IsEOMPlus || "false",
                  isPurchasedefault:
                    data.ttermsvs1[i].isPurchasedefault || "false",
                  isSalesdefault: data.ttermsvs1[i].isSalesdefault || "false",
                };

                dataTableListTerm.push(dataList);
              }

              templateObject.termdatatablerecords.set(dataTableListTerm);

              if (templateObject.termdatatablerecords.get()) {
                Meteor.call(
                  "readPrefMethod",
                  localStorage.getItem("mycloudLogonID"),
                  "termsList",
                  function (error, result) {
                    if (error) {
                    } else {
                      if (result) {
                        for (let i = 0; i < result.customFields.length; i++) {
                          let customcolumn = result.customFields;
                          let columHeaderUpdate = customcolumn[
                            i
                          ].thclass.replace(/ /g, ".");
                          let hiddenColumn = customcolumn[i].hidden;
                          let columnClass = columHeaderUpdate.split(".")[1];

                          if (hiddenColumn == true) {
                            $("." + columnClass + "").addClass("hiddenColumn");
                            $("." + columnClass + "").removeClass("showColumn");
                          } else if (hiddenColumn == false) {
                            $("." + columnClass + "").removeClass(
                              "hiddenColumn"
                            );
                            $("." + columnClass + "").addClass("showColumn");
                          }
                        }
                      }
                    }
                  }
                );

                setTimeout(function () {
                  MakeNegative();
                }, 100);
              }

              if ($.fn.dataTable.isDataTable("#termsList")) {
                $("#termsList").DataTable().destroy();
              }

              LoadingOverlay.hide();
              setTimeout(function () {
                $("#termsList")
                  .DataTable({
                    columnDefs: [
                      {
                        orderable: false,
                        targets: -1,
                      },
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                      {
                        extend: "csvHtml5",
                        text: "",
                        download: "open",
                        className: "btntabletocsv hiddenColumn",
                        filename: "termsList_" + moment().format(),
                        orientation: "portrait",
                        exportOptions: {
                          columns: ":visible",
                        },
                      },
                      {
                        extend: "print",
                        download: "open",
                        className: "btntabletopdf hiddenColumn",
                        text: "",
                        title: "Term List",
                        filename: "termsList_" + moment().format(),
                        exportOptions: {
                          columns: ":visible",
                        },
                      },
                      {
                        extend: "excelHtml5",
                        title: "",
                        download: "open",
                        className: "btntabletoexcel hiddenColumn",
                        filename: "termsList_" + moment().format(),
                        orientation: "portrait",
                        exportOptions: {
                          columns: ":visible",
                        },
                      },
                    ],
                    pageLength: 25,
                    paging: true,

                    info: true,
                    responsive: true,
                    "order": [[ 3, 'asc' ], [ 0, 'asc' ]],
                    action: function () {
                      $("#termsList").DataTable().ajax.reload();
                    },
                    fnDrawCallback: function (oSettings) {
                      setTimeout(function () {
                        MakeNegative();
                      }, 100);
                    },
                  })
                  .on("page", function () {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                    let draftRecord = templateObject.termdatatablerecords.get();
                    templateObject.termdatatablerecords.set(draftRecord);
                  })
                  .on("column-reorder", function () {})
                  .on("length.dt", function (e, settings, len) {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  });
                LoadingOverlay.hide();
              }, 10);

              var columns = $("#termsList th");
              let sWidth = "";
              let columVisible = false;
              let sClass = "";
              $.each(columns, function (i, v) {
                if (v.hidden == false) {
                  columVisible = true;
                }
                if (v.className.includes("hiddenColumn")) {
                  columVisible = false;
                }
                sWidth = v.style.width.replace("px", "");

                let datatablerecordObj = {
                  sTitle: v.innerText || "",
                  sWidth: sWidth || "",
                  sIndex: v.cellIndex || "",
                  sVisible: columVisible || false,
                  sClass: v.className || "",
                };
                tableHeaderListTerm.push(datatablerecordObj);
              });
              templateObject.termtableheaderrecords.set(tableHeaderListTerm);
              $("div.dataTables_filter input").addClass(
                "form-control form-control-sm"
              );
            })
            .catch(function (err) {
              LoadingOverlay.hide();
            });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.ttermsvs1;
          let lineItems = [];
          let lineItemObj = {};
          let setISCOD = false;
          for (let i = 0; i < useData.length; i++) {
            if (useData[i].IsDays == true && useData[i].Days == 0) {
              setISCOD = true;
            } else {
              setISCOD = false;
            }
            var dataList = {
              id: useData[i].Id || "",
              termname: useData[i].TermsName || "",
              termdays: useData[i].Days || 0,
              iscod: setISCOD || false,
              description: useData[i].Description || "",
              iseom: useData[i].IsEOM || "false",
              iseomplus: useData[i].IsEOMPlus || "false",
              isPurchasedefault: useData[i].isPurchasedefault || "false",
              isSalesdefault: useData[i].isSalesdefault || "false",
            };

            dataTableListTerm.push(dataList);
          }

          templateObject.termdatatablerecords.set(dataTableListTerm);

          if (templateObject.termdatatablerecords.get()) {
            Meteor.call(
              "readPrefMethod",
              localStorage.getItem("mycloudLogonID"),
              "termsList",
              function (error, result) {
                if (error) {
                } else {
                  if (result) {
                    for (let i = 0; i < result.customFields.length; i++) {
                      let customcolumn = result.customFields;
                      let columData = customcolumn[i].label;
                      let columHeaderUpdate = customcolumn[i].thclass.replace(
                        / /g,
                        "."
                      );
                      let hiddenColumn = customcolumn[i].hidden;
                      let columnClass = columHeaderUpdate.split(".")[1];
                      let columnWidth = customcolumn[i].width;
                      let columnindex = customcolumn[i].index + 1;

                      if (hiddenColumn == true) {
                        $("." + columnClass + "").addClass("hiddenColumn");
                        $("." + columnClass + "").removeClass("showColumn");
                      } else if (hiddenColumn == false) {
                        $("." + columnClass + "").removeClass("hiddenColumn");
                        $("." + columnClass + "").addClass("showColumn");
                      }
                    }
                  }
                }
              }
            );

            setTimeout(function () {
              MakeNegative();
            }, 100);
          }

          LoadingOverlay.hide();
          setTimeout(function () {
            $("#termsList")
              .DataTable({
                columnDefs: [
                  {
                    orderable: false,
                    targets: -1,
                  },
                ],
                select: true,
                destroy: true,
                colReorder: true,
                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                  {
                    extend: "csvHtml5",
                    text: "",
                    download: "open",
                    className: "btntabletocsv hiddenColumn",
                    filename: "termsList_" + moment().format(),
                    orientation: "portrait",
                    exportOptions: {
                      columns: ":visible",
                    },
                  },
                  {
                    extend: "print",
                    download: "open",
                    className: "btntabletopdf hiddenColumn",
                    text: "",
                    title: "Term List",
                    filename: "termsList_" + moment().format(),
                    exportOptions: {
                      columns: ":visible",
                    },
                  },
                  {
                    extend: "excelHtml5",
                    title: "",
                    download: "open",
                    className: "btntabletoexcel hiddenColumn",
                    filename: "termsList_" + moment().format(),
                    orientation: "portrait",
                    exportOptions: {
                      columns: ":visible",
                    },
                  },
                ],

                pageLength: 25,
                paging: true,
                info: true,
                responsive: true,
                "order": [[ 3, 'asc' ], [ 0, 'asc' ]],
                action: function () {
                  $("#termsList").DataTable().ajax.reload();
                },
                fnDrawCallback: function (oSettings) {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                },
              })
              .on("page", function () {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
                let draftRecord = templateObject.termdatatablerecords.get();
                templateObject.termdatatablerecords.set(draftRecord);
              })
              .on("column-reorder", function () {})
              .on("length.dt", function (e, settings, len) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              });
            LoadingOverlay.hide();
          }, 10);

          var columns = $("#termsList th");
          let sTible = "";
          let sWidth = "";
          let sIndex = "";
          let sVisible = "";
          let columVisible = false;
          let sClass = "";
          $.each(columns, function (i, v) {
            if (v.hidden == false) {
              columVisible = true;
            }
            if (v.className.includes("hiddenColumn")) {
              columVisible = false;
            }
            sWidth = v.style.width.replace("px", "");

            let datatablerecordObj = {
              sTitle: v.innerText || "",
              sWidth: sWidth || "",
              sIndex: v.cellIndex || "",
              sVisible: columVisible || false,
              sClass: v.className || "",
            };
            tableHeaderListTerm.push(datatablerecordObj);
          });
          templateObject.termtableheaderrecords.set(tableHeaderListTerm);
          $("div.dataTables_filter input").addClass(
            "form-control form-control-sm"
          );
        }
      })
      .catch(function (err) {
        taxRateService
          .getTermsVS1()
          .then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            let setISCOD = false;
            for (let i = 0; i < data.ttermsvs1.length; i++) {
              if (
                data.ttermsvs1[i].IsDays == true &&
                data.ttermsvs1[i].Days == 0
              ) {
                setISCOD = true;
              } else {
                setISCOD = false;
              }
              var dataList = {
                id: data.ttermsvs1[i].Id || "",
                termname: data.ttermsvs1[i].TermsName || "",
                termdays: data.ttermsvs1[i].Days || 0,
                iscod: setISCOD || false,
                description: data.ttermsvs1[i].Description || "",
                iseom: data.ttermsvs1[i].IsEOM || "false",
                iseomplus: data.ttermsvs1[i].IsEOMPlus || "false",
                isPurchasedefault:
                  data.ttermsvs1[i].isPurchasedefault || "false",
                isSalesdefault: data.ttermsvs1[i].isSalesdefault || "false",
              };

              dataTableListTerm.push(dataList);
              //}
            }

            templateObject.termdatatablerecords.set(dataTableListTerm);

            if (templateObject.termdatatablerecords.get()) {
              Meteor.call(
                "readPrefMethod",
                localStorage.getItem("mycloudLogonID"),
                "termsList",
                function (error, result) {
                  if (error) {
                  } else {
                    if (result) {
                      for (let i = 0; i < result.customFields.length; i++) {
                        let customcolumn = result.customFields;
                        let columData = customcolumn[i].label;
                        let columHeaderUpdate = customcolumn[i].thclass.replace(
                          / /g,
                          "."
                        );
                        let hiddenColumn = customcolumn[i].hidden;
                        let columnClass = columHeaderUpdate.split(".")[1];
                        let columnWidth = customcolumn[i].width;
                        let columnindex = customcolumn[i].index + 1;

                        if (hiddenColumn == true) {
                          $("." + columnClass + "").addClass("hiddenColumn");
                          $("." + columnClass + "").removeClass("showColumn");
                        } else if (hiddenColumn == false) {
                          $("." + columnClass + "").removeClass("hiddenColumn");
                          $("." + columnClass + "").addClass("showColumn");
                        }
                      }
                    }
                  }
                }
              );

              setTimeout(function () {
                MakeNegative();
              }, 100);
            }

            LoadingOverlay.hide();
            setTimeout(function () {
              $("#termsList")
                .DataTable({
                  columnDefs: [
                    {
                      orderable: false,
                      targets: -1,
                    },
                  ],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                    {
                      extend: "csvHtml5",
                      text: "",
                      download: "open",
                      className: "btntabletocsv hiddenColumn",
                      filename: "termsList_" + moment().format(),
                      orientation: "portrait",
                      exportOptions: {
                        columns: ":visible",
                      },
                    },
                    {
                      extend: "print",
                      download: "open",
                      className: "btntabletopdf hiddenColumn",
                      text: "",
                      title: "Term List",
                      filename: "termsList_" + moment().format(),
                      exportOptions: {
                        columns: ":visible",
                      },
                    },
                    {
                      extend: "excelHtml5",
                      title: "",
                      download: "open",
                      className: "btntabletoexcel hiddenColumn",
                      filename: "termsList_" + moment().format(),
                      orientation: "portrait",
                      exportOptions: {
                        columns: ":visible",
                      },
                    },
                  ],
                  paging: false,
                  info: true,
                  responsive: true,
                  "order": [[ 3, 'asc' ], [ 0, 'asc' ]],
                  action: function () {
                    $("#termsList").DataTable().ajax.reload();
                  },
                  fnDrawCallback: function (oSettings) {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  },
                })
                .on("page", function () {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                  let draftRecord = templateObject.termdatatablerecords.get();
                  templateObject.termdatatablerecords.set(draftRecord);
                })
                .on("column-reorder", function () {})
                .on("length.dt", function (e, settings, len) {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                });
              LoadingOverlay.hide();
            }, 10);

            var columns = $("#termsList th");
            let sTible = "";
            let sWidth = "";
            let sIndex = "";
            let sVisible = "";
            let columVisible = false;
            let sClass = "";
            $.each(columns, function (i, v) {
              if (v.hidden == false) {
                columVisible = true;
              }
              if (v.className.includes("hiddenColumn")) {
                columVisible = false;
              }
              sWidth = v.style.width.replace("px", "");

              let datatablerecordObj = {
                sTitle: v.innerText || "",
                sWidth: sWidth || "",
                sIndex: v.cellIndex || "",
                sVisible: columVisible || false,
                sClass: v.className || "",
              };
              tableHeaderList.push(datatablerecordObj);
            });
            templateObject.termtableheaderrecords.set(tableHeaderList);
            $("div.dataTables_filter input").addClass(
              "form-control form-control-sm"
            );
          })
          .catch(function (err) {
            LoadingOverlay.hide();
          });
      });
  };


  $(document).on("click", ".table-remove-term", function () {
    event.stopPropagation();
    event.stopPropagation();
    var targetID = $(event.target).closest("tr").attr("id"); // table row ID
    $("#selectDeleteLineID").val(targetID);
    $("#deleteTermLineModal").modal("toggle");
  });

  // Step 5 Render functionalities
  const dataTableListEmployee = [];
  const tableHeaderListEmployee = [];

  templateObject.loadStep5Prefs = () => {
    if (FlowRouter.current().queryParams.success) {
      $(".btnRefreshEmployee").addClass("btnRefreshAlert");
    }
    Meteor.call(
      "readPrefMethod",
      localStorage.getItem("mycloudLogonID"),
      "tblEmployeelist",
      function (error, result) {
        if (error) {
        } else {
          if (result) {
            for (let i = 0; i < result.customFields.length; i++) {
              let customcolumn = result.customFields;
              let columData = customcolumn[i].label;
              let columHeaderUpdate = customcolumn[i].thclass.replace(
                / /g,
                "."
              );
              let hiddenColumn = customcolumn[i].hidden;
              let columnClass = columHeaderUpdate.split(".")[1];
              let columnWidth = customcolumn[i].width;
              $("th." + columnClass + "").html(columData);
              $("th." + columnClass + "").css("width", "" + columnWidth + "px");
            }
          }
        }
      }
    );
  };
  templateObject.loadEmployees = async (refresh = false) => {
    const sideBarService = new SideBarService();

    LoadingOverlay.show();
    let dataObject = await sideBarService.getAllEmployees("All");
    let employeeList = [];

    if (dataObject.temployee) {
      employeeList = Employee.fromList(dataObject.temployee);
    }

    await templateObject.currentEmployees.set(employeeList);



    if (await templateObject.currentEmployees.get()) {

      if ($.fn.dataTable.isDataTable("#employeeListTable")) {
        $("#employeeListTable").DataTable().destroy();
      }

      setTimeout(() => {
        $("#employeeListTable")
          .DataTable({

            columnDefs: [],
            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            select: true,
            destroy: refresh,
            colReorder: true,
            pageLength: 25,
            paging: true,
            info: true,
            responsive: true,
            "order": [1, 'asc' ],
            action: function () {
              $("#employeeListTable").DataTable().ajax.reload();
            },
            language: { search: "",searchPlaceholder: "Search List..." },
            fnInitComplete: function () {
              $(
                "<button class='btn btn-primary btnRefreshEmployees' type='button' id='btnRefreshEmployees' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
              ).insertAfter("#employeeListTable_filter");
            },
          })
          .on("page", function () {
            setTimeout(function () {
              MakeNegative();
            }, 100);
            let draftRecord = templateObject.currentEmployees.get();
            templateObject.currentEmployees.set(draftRecord);
          })
          .on("column-reorder", function () {})
          .on("length.dt", function (e, settings, len) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });
      }, 300);
    }

    LoadingOverlay.hide();
  };

  templateObject.getEmployeeProfileImageData = function (employeeName) {
    const contactService = new ContactService();
    contactService.getEmployeeProfileImageByName(employeeName).then((data) => {
      let employeeProfile = "";
      for (let i = 0; i < data.temployeepicture.length; i++) {
        if (data.temployeepicture[i].EmployeeName === employeeName) {
          employeeProfile = data.temployeepicture[i].EncodedPic;
          $(".imageUpload").attr(
            "src",
            "data:image/jpeg;base64," + employeeProfile
          );
          $(".cloudEmpImgID").val(data.temployeepicture[i].Id);
        }
      }
    });
  };

  // Step 6 Render functionalities
  let sideBarService = new SideBarService();
  let accountService = new AccountService();
  var splashArrayAccountList = new Array();
  var currentLoc = FlowRouter.current().route.path;
  let accBalance = 0;

  templateObject.loadAccountTypes = () => {
    let accountTypeList = [];
    getVS1Data("TAccountType")
      .then(function (dataObject) {
        if (dataObject.length === 0) {
          accountService.getAccountTypeCheck().then(function (data) {
            for (let i = 0; i < data.taccounttype.length; i++) {
              let accounttyperecordObj = {
                accounttypename: data.taccounttype[i].AccountTypeName || " ",
                description: data.taccounttype[i].OriginalDescription || " ",
              };
              accountTypeList.push(accounttyperecordObj);
            }
            templateObject.accountTypes.set(accountTypeList);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.taccounttype;

          for (let i = 0; i < useData.length; i++) {
            let accounttyperecordObj = {
              accounttypename: useData[i].AccountTypeName || " ",
              description: useData[i].OriginalDescription || " ",
            };
            accountTypeList.push(accounttyperecordObj);
          }
          templateObject.accountTypes.set(accountTypeList);
        }
      })
      .catch(function (err) {
        accountService.getAccountTypeCheck().then(function (data) {
          for (let i = 0; i < data.taccounttype.length; i++) {
            let accounttyperecordObj = {
              accounttypename: data.taccounttype[i].AccountTypeName || " ",
              description: data.taccounttype[i].OriginalDescription || " ",
            };
            accountTypeList.push(accounttyperecordObj);
          }
          templateObject.accountTypes.set(accountTypeList);
        });
      });
  };

  templateObject.loadAccountList = async () => {
    LoadingOverlay.show();
    let _accountList = [];
    let dataObject = await getVS1Data("TAccountVS1");
    if (dataObject.length === 0) {
      dataObject = await sideBarService.getAccountListVS1();
      await addVS1Data("TAccountVS1", JSON.stringify(dataObject));
    } else {
      dataObject = JSON.parse(dataObject[0].data);
    }
    if (dataObject.taccountvs1) {
      data = dataObject;

      let fullAccountTypeName = "";
      let accBalance = "";

      data.taccountvs1.forEach((account) => {
        if (!isNaN(account.fields.Balance)) {
          accBalance =
            utilityService.modifynegativeCurrencyFormat(
              account.fields.Balance
            ) || 0.0;
        } else {
          accBalance = Currency + "0.00";
        }
        var dataList = {
          id: account.fields.ID || "",
          accountname: account.fields.AccountName || "",
          description: account.fields.Description || "",
          accountnumber: account.fields.AccountNumber || "",
          accounttypename:
            fullAccountTypeName || account.fields.AccountTypeName,
          accounttypeshort: account.fields.AccountTypeName || "",
          taxcode: account.fields.TaxCode || "",
          bankaccountname: account.fields.BankAccountName || "",
          bankname: account.fields.BankName || "",
          bsb: account.fields.BSB || "",
          bankaccountnumber: account.fields.BankAccountNumber || "",
          swiftcode: account.fields.Extra || "",
          routingNo: account.BankCode || "",
          apcanumber: account.fields.BankNumber || "",
          balance: accBalance || 0.0,
          isheader: account.fields.IsHeader || false,
          cardnumber: account.fields.CarNumber || "",
          expirydate: account.fields.ExpiryDate || "",
          cvc: account.fields.CVC || "",
        };
        if (account.fields.Active != false) {
          _accountList.push(dataList);
        }
      });
      templateObject.accountList.set(_accountList);
    }

    if ($.fn.dataTable.isDataTable("#tblAccountOverview")) {
      $("#tblAccountOverview").DataTable().destroy();
    }

    setTimeout(() => {
      $("#tblAccountOverview")
        .DataTable({

          columnDefs: [
          ],
          select: true,
          destroy: true,
          colReorder: true,
          sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          pageLength: 25,
          paging: true,
          info: true,
          responsive: true,
          "order": [1, 'asc' ],
          action: function () {
            $("#tblAccountOverview").DataTable().ajax.reload();
          },
          fnDrawCallback: function (oSettings) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          },
        })
        .on("page", function () {
          setTimeout(function () {
            MakeNegative();
          }, 100);
          let draftRecord = templateObject.accountList.get();
          templateObject.accountList.set(draftRecord);
        })
        .on("column-reorder", function () {})
        .on("length.dt", function (e, settings, len) {
          setTimeout(function () {
            MakeNegative();
          }, 100);
        });
    }, refreshTableTimout);

    LoadingOverlay.hide();
  };

  templateObject.getAllAccountss = function () {
    getVS1Data("TAccountVS1")
      .then(function (dataObject) {
        if (dataObject.length === 0) {
          sideBarService.getAccountListVS1().then(function (data) {
            addVS1Data("TAccountVS1", JSON.stringify(data));
            for (let i = 0; i < data.taccountvs1.length; i++) {
              if (!isNaN(data.taccountvs1[i].fields.Balance)) {
                accBalance =
                  utilityService.modifynegativeCurrencyFormat(
                    data.taccountvs1[i].fields.Balance
                  ) || 0.0;
              } else {
                accBalance = Currency + "0.00";
              }
              var dataList = [
                data.taccountvs1[i].fields.AccountName || "-",
                data.taccountvs1[i].fields.Description || "",
                data.taccountvs1[i].fields.AccountNumber || "",
                data.taccountvs1[i].fields.AccountTypeName || "",
                accBalance,
                data.taccountvs1[i].fields.TaxCode || "",
                data.taccountvs1[i].fields.ID || "",
              ];
              if (currentLoc === "/billcard") {
                if (
                  data.taccountvs1[i].fields.AccountTypeName !== "AP" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "AR" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "CCARD" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "BANK"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (currentLoc === "/journalentrycard") {
                if (
                  data.taccountvs1[i].fields.AccountTypeName !== "AP" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "AR"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (currentLoc === "/chequecard") {
                if (
                  data.taccountvs1[i].fields.AccountTypeName === "EQUITY" ||
                  data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                  data.taccountvs1[i].fields.AccountTypeName === "CCARD" ||
                  data.taccountvs1[i].fields.AccountTypeName === "COGS" ||
                  data.taccountvs1[i].fields.AccountTypeName === "EXP" ||
                  data.taccountvs1[i].fields.AccountTypeName === "FIXASSET" ||
                  data.taccountvs1[i].fields.AccountTypeName === "INC" ||
                  data.taccountvs1[i].fields.AccountTypeName === "LTLIAB" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OASSET" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OCASSET" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OCLIAB" ||
                  data.taccountvs1[i].fields.AccountTypeName === "EXEXP" ||
                  data.taccountvs1[i].fields.AccountTypeName === "EXINC"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (
                currentLoc === "/paymentcard" ||
                currentLoc === "/supplierpaymentcard"
              ) {
                if (
                  data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                  data.taccountvs1[i].fields.AccountTypeName === "CCARD" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OCLIAB"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (
                currentLoc === "/bankrecon" ||
                currentLoc === "/newbankrecon"
              ) {
                if (
                  data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                  data.taccountvs1[i].fields.AccountTypeName === "CCARD"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else {
                splashArrayAccountList.push(dataList);
              }
            }
            if (splashArrayAccountList) {
              $("#tblAccount").dataTable({
                data: splashArrayAccountList,

                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [
                  {
                    className: "productName",
                    targets: [0],
                  },
                  {
                    className: "productDesc",
                    targets: [1],
                  },
                  {
                    className: "accountnumber",
                    targets: [2],
                  },
                  {
                    className: "salePrice",
                    targets: [3],
                  },
                  {
                    className: "prdqty text-right",
                    targets: [4],
                  },
                  {
                    className: "taxrate",
                    targets: [5],
                  },
                  {
                    className: "colAccountID hiddenColumn",
                    targets: [6],
                  },
                ],
                select: true,
                destroy: true,
                colReorder: true,
                paging: false,
                info: true,
                responsive: true,
                language: { search: "",searchPlaceholder: "Search List..." },
                fnInitComplete: function () {
                  $(
                    "<button class='btn btn-primary btnAddNewAccount' data-dismiss='modal' data-toggle='modal' data-target='#addAccountModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
                  ).insertAfter("#tblAccount_filter");
                  $(
                    "<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                  ).insertAfter("#tblAccount_filter");
                },
              });

              $("div.dataTables_filter input").addClass(
                "form-control form-control-sm"
              );
            }
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.taccountvs1;

          let records = [];
          let inventoryData = [];
          for (let i = 0; i < useData.length; i++) {
            if (!isNaN(useData[i].fields.Balance)) {
              accBalance =
                utilityService.modifynegativeCurrencyFormat(
                  useData[i].fields.Balance
                ) || 0.0;
            } else {
              accBalance = Currency + "0.00";
            }
            var dataList = [
              useData[i].fields.AccountName || "-",
              useData[i].fields.Description || "",
              useData[i].fields.AccountNumber || "",
              useData[i].fields.AccountTypeName || "",
              accBalance,
              useData[i].fields.TaxCode || "",
              useData[i].fields.ID || "",
            ];
            if (currentLoc === "/billcard") {
              if (
                useData[i].fields.AccountTypeName !== "AP" &&
                useData[i].fields.AccountTypeName !== "AR" &&
                useData[i].fields.AccountTypeName !== "CCARD" &&
                useData[i].fields.AccountTypeName !== "BANK"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else if (currentLoc === "/journalentrycard") {
              if (
                useData[i].fields.AccountTypeName !== "AP" &&
                useData[i].fields.AccountTypeName !== "AR"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else if (currentLoc === "/chequecard") {
              if (
                useData[i].fields.AccountTypeName === "EQUITY" ||
                useData[i].fields.AccountTypeName === "BANK" ||
                useData[i].fields.AccountTypeName === "CCARD" ||
                useData[i].fields.AccountTypeName === "COGS" ||
                useData[i].fields.AccountTypeName === "EXP" ||
                useData[i].fields.AccountTypeName === "FIXASSET" ||
                useData[i].fields.AccountTypeName === "INC" ||
                useData[i].fields.AccountTypeName === "LTLIAB" ||
                useData[i].fields.AccountTypeName === "OASSET" ||
                useData[i].fields.AccountTypeName === "OCASSET" ||
                useData[i].fields.AccountTypeName === "OCLIAB" ||
                useData[i].fields.AccountTypeName === "EXEXP" ||
                useData[i].fields.AccountTypeName === "EXINC"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else if (
              currentLoc === "/paymentcard" ||
              currentLoc === "/supplierpaymentcard"
            ) {
              if (
                useData[i].fields.AccountTypeName === "BANK" ||
                useData[i].fields.AccountTypeName === "CCARD" ||
                useData[i].fields.AccountTypeName === "OCLIAB"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else if (
              currentLoc === "/bankrecon" ||
              currentLoc === "/newbankrecon"
            ) {
              if (
                useData[i].fields.AccountTypeName === "BANK" ||
                useData[i].fields.AccountTypeName === "CCARD"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else {
              splashArrayAccountList.push(dataList);
            }
          }
          if (splashArrayAccountList) {
            $("#tblAccount").dataTable({
              data: splashArrayAccountList,

              sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
              paging: true,
              aaSorting: [],
              orderMulti: true,
              columnDefs: [
                {
                  className: "productName",
                  targets: [0],
                },
                {
                  className: "productDesc",
                  targets: [1],
                },
                {
                  className: "accountnumber",
                  targets: [2],
                },
                {
                  className: "salePrice",
                  targets: [3],
                },
                {
                  className: "prdqty text-right",
                  targets: [4],
                },
                {
                  className: "taxrate",
                  targets: [5],
                },
                {
                  className: "colAccountID hiddenColumn",
                  targets: [6],
                },
              ],
              colReorder: true,

              "order": [[ 3, 'asc' ], [ 0, 'asc' ]],

              paging: false,
              info: true,
              responsive: true,
              language: { search: "",searchPlaceholder: "Search List..." },
              fnInitComplete: function () {
                $(
                  "<button class='btn btn-primary btnAddNewAccount' data-dismiss='modal' data-toggle='modal' data-target='#addAccountModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
                ).insertAfter("#tblAccount_filter");
                $(
                  "<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                ).insertAfter("#tblAccount_filter");
              },
            });

            $("div.dataTables_filter input").addClass(
              "form-control form-control-sm"
            );
          }
        }
      })
      .catch(function (err) {
        sideBarService.getAccountListVS1().then(function (data) {
          let records = [];
          let inventoryData = [];
          for (let i = 0; i < data.taccountvs1.length; i++) {
            if (!isNaN(data.taccountvs1[i].fields.Balance)) {
              accBalance =
                utilityService.modifynegativeCurrencyFormat(
                  data.taccountvs1[i].fields.Balance
                ) || 0.0;
            } else {
              accBalance = Currency + "0.00";
            }
            var dataList = [
              data.taccountvs1[i].fields.AccountName || "-",
              data.taccountvs1[i].fields.Description || "",
              data.taccountvs1[i].fields.AccountNumber || "",
              data.taccountvs1[i].fields.AccountTypeName || "",
              accBalance,
              data.taccountvs1[i].fields.TaxCode || "",
              data.taccountvs1[i].fields.ID || "",
            ];
            if (currentLoc === "/billcard") {
              if (
                data.taccountvs1[i].fields.AccountTypeName !== "AP" &&
                data.taccountvs1[i].fields.AccountTypeName !== "AR" &&
                data.taccountvs1[i].fields.AccountTypeName !== "CCARD" &&
                data.taccountvs1[i].fields.AccountTypeName !== "BANK"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else if (currentLoc === "/journalentrycard") {
              if (
                data.taccountvs1[i].fields.AccountTypeName !== "AP" &&
                data.taccountvs1[i].fields.AccountTypeName !== "AR"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else if (currentLoc === "/chequecard") {
              if (
                data.taccountvs1[i].fields.AccountTypeName === "EQUITY" ||
                data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                data.taccountvs1[i].fields.AccountTypeName === "CCARD" ||
                data.taccountvs1[i].fields.AccountTypeName === "COGS" ||
                data.taccountvs1[i].fields.AccountTypeName === "EXP" ||
                data.taccountvs1[i].fields.AccountTypeName === "FIXASSET" ||
                data.taccountvs1[i].fields.AccountTypeName === "INC" ||
                data.taccountvs1[i].fields.AccountTypeName === "LTLIAB" ||
                data.taccountvs1[i].fields.AccountTypeName === "OASSET" ||
                data.taccountvs1[i].fields.AccountTypeName === "OCASSET" ||
                data.taccountvs1[i].fields.AccountTypeName === "OCLIAB" ||
                data.taccountvs1[i].fields.AccountTypeName === "EXEXP" ||
                data.taccountvs1[i].fields.AccountTypeName === "EXINC"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else if (
              currentLoc === "/paymentcard" ||
              currentLoc === "/supplierpaymentcard"
            ) {
              if (
                data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                data.taccountvs1[i].fields.AccountTypeName === "CCARD" ||
                data.taccountvs1[i].fields.AccountTypeName === "OCLIAB"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else if (
              currentLoc === "/bankrecon" ||
              currentLoc === "/newbankrecon"
            ) {
              if (
                data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                data.taccountvs1[i].fields.AccountTypeName === "CCARD"
              ) {
                splashArrayAccountList.push(dataList);
              }
            } else {
              splashArrayAccountList.push(dataList);
            }
          }

          if (splashArrayAccountList) {
            $("#tblAccount").dataTable({
              data: splashArrayAccountList,

              sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
              paging: true,
              aaSorting: [],
              orderMulti: true,
              columnDefs: [
                {
                  className: "productName",
                  targets: [0],
                },
                {
                  className: "productDesc",
                  targets: [1],
                },
                {
                  className: "accountnumber",
                  targets: [2],
                },
                {
                  className: "salePrice",
                  targets: [3],
                },
                {
                  className: "prdqty text-right",
                  targets: [4],
                },
                {
                  className: "taxrate",
                  targets: [5],
                },
                {
                  className: "colAccountID hiddenColumn",
                  targets: [6],
                },
              ],
              colReorder: true,

              "order": [[ 3, 'asc' ], [ 0, 'asc' ]],
              paging: false,
              info: true,
              responsive: true,
              language: { search: "",searchPlaceholder: "Search List..." },
              fnInitComplete: function () {
                $(
                  "<button class='btn btn-primary btnAddNewAccount' data-dismiss='modal' data-toggle='modal' data-target='#addAccountModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
                ).insertAfter("#tblAccount_filter");
                $(
                  "<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                ).insertAfter("#tblAccount_filter");
              },
            });

            $("div.dataTables_filter input").addClass(
              "form-control form-control-sm"
            );
          }
        });
      });
  };

  templateObject.loadAllTaxCodes = async (refresh = false) => {
    let dataObject = await getVS1Data("TTaxcodeVS1");
    let data =
      dataObject.length == 0 || refresh == true
        ? await productService.getTaxCodesVS1()
        : JSON.parse(dataObject[0].data);

    if (refresh) {
      await addVS1Data("TTaxcodeVS1", JSON.stringify(data));
    }

    let splashArrayTaxRateList = [];
    let taxCodesList = [];

    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
      let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
      var dataList = [
        data.ttaxcodevs1[i].Id || "",
        data.ttaxcodevs1[i].CodeName || "",
        data.ttaxcodevs1[i].Description || "-",
        taxRate || 0,
      ];

      let taxcoderecordObj = {
        codename: data.ttaxcodevs1[i].CodeName || " ",
        coderate: taxRate || " ",
      };

      taxCodesList.push(taxcoderecordObj);

      splashArrayTaxRateList.push(dataList);
    }
    templateObject.taxraterecords.set(taxCodesList);

    if (splashArrayTaxRateList) {

      if ($.fn.dataTable.isDataTable("#tblTaxRate")) {
        $("#tblTaxRate").DataTable().destroy();
      }

      $("#tblTaxRate").DataTable({
        data: splashArrayTaxRateList,
        sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        columnDefs: [
          {
            orderable: false,
            targets: 0,
          },
          {
            className: "taxName",
            targets: [1],
          },
          {
            className: "taxDesc",
            targets: [2],
          },
          {
            className: "taxRate text-right",
            targets: [3],
          },
        ],
        colReorder: true,
        paging: false,
        info: true,
        responsive: true,
        fnDrawCallback: function (oSettings) {
        },
        language: { search: "",searchPlaceholder: "Search List..." },
        fnInitComplete: function () {
          $(
            "<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
          ).insertAfter("#tblTaxRate_filter");
          $(
            "<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
          ).insertAfter("#tblTaxRate_filter");
        },
      });
    }
  };

  $("#tblAccountOverview tbody").on(
    "click",
    "tr .colAccountName, tr .colAccountName, tr .colDescription, tr .colAccountNo, tr .colType, tr .colTaxCode, tr .colBankAccountName, tr .colBSB, tr .colBankAccountNo, tr .colExtra, tr .colAPCANumber",
    function () {
      var listData = $(this).closest("tr").attr("id");
      var tabletaxtcode = $(event.target)
        .closest("tr")
        .find(".colTaxCode")
        .text();
      var accountName = $(event.target)
        .closest("tr")
        .find(".colAccountName")
        .text();

      if (listData) {
        $("#add-account-title").text("Edit Account Details");
        $("#edtAccountName").attr("readonly", true);
        $("#sltAccountType").attr("readonly", true);
        $("#sltAccountType").attr("disabled", "disabled");
        if (listData !== "") {
          listData = Number(listData);
          //accountService.getOneAccount(listData).then(function (data) {

          var accountid = listData || "";
          var accounttype =
            $(event.target)
              .closest("tr")
              .find(".colType")
              .attr("accounttype") || "";
          var accountname =
            $(event.target).closest("tr").find(".colAccountName").text() || "";
          var accountno =
            $(event.target).closest("tr").find(".colAccountNo").text() || "";
          var taxcode =
            $(event.target).closest("tr").find(".colTaxCode").text() || "";
          var accountdesc =
            $(event.target).closest("tr").find(".colDescription").text() || "";
          var bankaccountname =
            $(event.target).closest("tr").find(".colBankAccountName").text() ||
            "";
          var bankname =
            localStorage.getItem("vs1companyBankName") ||
            $(event.target).closest("tr").find(".colBankName").text() ||
            "";
          var bankbsb =
            $(event.target).closest("tr").find(".colBSB").text() || "";
          var bankacountno =
            $(event.target).closest("tr").find(".colBankAccountNo").text() ||
            "";

          var swiftCode =
            $(event.target).closest("tr").find(".colExtra").text() || "";
          var routingNo =
            $(event.target).closest("tr").find(".colAPCANumber").text() || "";

          var showTrans =
            $(event.target)
              .closest("tr")
              .find(".colAPCANumber")
              .attr("checkheader") || false;

          var cardnumber =
            $(event.target).closest("tr").find(".colCardNumber").text() || "";
          var cardexpiry =
            $(event.target).closest("tr").find(".colExpiryDate").text() || "";
          var cardcvc =
            $(event.target).closest("tr").find(".colCVC").text() || "";

          if (accounttype === "BANK") {
            $(".isBankAccount").removeClass("isNotBankAccount");
            $(".isCreditAccount").addClass("isNotCreditAccount");
          } else if (accounttype === "CCARD") {
            $(".isCreditAccount").removeClass("isNotCreditAccount");
            $(".isBankAccount").addClass("isNotBankAccount");
          } else {
            $(".isBankAccount").addClass("isNotBankAccount");
            $(".isCreditAccount").addClass("isNotCreditAccount");
          }

          $("#edtAccountID").val(accountid);
          $("#sltAccountType").val(accounttype);
          $("#edtAccountName").val(accountname);
          $("#edtAccountNo").val(accountno);
          $("#sltTaxCode").val(taxcode);
          $("#txaAccountDescription").val(accountdesc);
          $("#edtBankAccountName").val(bankaccountname);
          $("#edtBSB").val(bankbsb);
          $("#edtBankAccountNo").val(bankacountno);
          $("#swiftCode").val(swiftCode);
          $("#routingNo").val(routingNo);
          $("#edtBankName").val(bankname);

          $("#edtCardNumber").val(cardnumber);
          $("#edtExpiryDate").val(
            cardexpiry ? moment(cardexpiry).format("DD/MM/YYYY") : ""
          );
          $("#edtCvc").val(cardcvc);

          if (showTrans == "true") {
            $(".showOnTransactions").prop("checked", true);
          } else {
            $(".showOnTransactions").prop("checked", false);
          }
          $(this).closest("tr").attr("data-target", "#addNewAccount");
          $(this).closest("tr").attr("data-toggle", "modal");
        }
      }
    }
  );

  // Step 7 Render functionalities

  templateObject.loadDefaultCustomer = async (refresh = false) => {
    LoadingOverlay.show();
    let data = await sideBarService.getAllCustomersDataVS1("All");
    await addVS1Data("TCustomerVS1", JSON.stringify(data));

    let _customerList = [];
    let _customerListHeaders = [];
    for (let i = 0; i < data.tcustomervs1.length; i++) {
      let arBalance =
        utilityService.modifynegativeCurrencyFormat(
          data.tcustomervs1[i].fields.ARBalance
        ) || 0.0;
      let creditBalance =
        utilityService.modifynegativeCurrencyFormat(
          data.tcustomervs1[i].fields.CreditBalance
        ) || 0.0;
      let balance =
        utilityService.modifynegativeCurrencyFormat(
          data.tcustomervs1[i].fields.Balance
        ) || 0.0;
      let creditLimit =
        utilityService.modifynegativeCurrencyFormat(
          data.tcustomervs1[i].fields.CreditLimit
        ) || 0.0;
      let salesOrderBalance =
        utilityService.modifynegativeCurrencyFormat(
          data.tcustomervs1[i].fields.SalesOrderBalance
        ) || 0.0;
      var dataList = {
        id: data.tcustomervs1[i].fields.ID || "",
        company: data.tcustomervs1[i].fields.Companyname || "",
        contactname: data.tcustomervs1[i].fields.ContactName || "",
        phone: data.tcustomervs1[i].fields.Phone || "",
        arbalance: arBalance || 0.0,
        creditbalance: creditBalance || 0.0,
        balance: balance || 0.0,
        creditlimit: creditLimit || 0.0,
        salesorderbalance: salesOrderBalance || 0.0,
        email: data.tcustomervs1[i].fields.Email || "",
        job: data.tcustomervs1[i].fields.JobName || "",
        accountno: data.tcustomervs1[i].fields.AccountNo || "",
        clientno: data.tcustomervs1[i].fields.ClientNo || "",
        jobtitle: data.tcustomervs1[i].fields.JobTitle || "",
        notes: data.tcustomervs1[i].fields.Notes || "",
        country: data.tcustomervs1[i].fields.Country || "",
        firstname: data.tcustomervs1[i].fields.FirstName || "",
        lastname: data.tcustomervs1[i].fields.LastName || "",
        mobile: data.tcustomervs1[i].fields.Mobile || "",
        skype: data.tcustomervs1[i].fields.SkypeName || "",
        street: data.tcustomervs1[i].fields.Street || "",
        city: data.tcustomervs1[i].fields.Suburb || "",
        state: data.tcustomervs1[i].fields.State || "",
        postcode: data.tcustomervs1[i].fields.Postcode || "",
        taxcode: data.tcustomervs1[i].fields.TaxCodeName || "",
      };

      _customerList.push(dataList);
      //}
    }

    function MakeNegative() {
      $("td").each(function () {
        if (
          $(this)
            .text()
            .indexOf("-" + Currency) >= 0
        )
          $(this).addClass("text-danger");
      });
    }

    await templateObject.customerList.set(_customerList);

    if (await templateObject.customerList.get()) {
      Meteor.call(
        "readPrefMethod",
        localStorage.getItem("mycloudLogonID"),
        "tblCustomerlist",
        function (error, result) {
          if (error) {
          } else {
            if (result) {
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass.replace(
                  / /g,
                  "."
                );
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.split(".")[1];
                let columnWidth = customcolumn[i].width;
                let columnindex = customcolumn[i].index + 1;

                if (hiddenColumn == true) {
                  $("." + columnClass + "").addClass("hiddenColumn");
                  $("." + columnClass + "").removeClass("showColumn");
                } else if (hiddenColumn == false) {
                  $("." + columnClass + "").removeClass("hiddenColumn");
                  $("." + columnClass + "").addClass("showColumn");
                }
              }
            }
          }
        }
      );

      setTimeout(function () {
        MakeNegative();
      }, 100);

      //if (refresh) $("#tblCustomerlist").DataTable().destroy();

      if ($.fn.dataTable.isDataTable("#tblCustomerlist")) {
        $("#tblCustomerlist").DataTable().destroy();
      }

      setTimeout(() => {
        $("#tblCustomerlist")
          .DataTable({

            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            select: true,
            destroy: refresh,
            colReorder: true,
            pageLength: 25,
            paging: true,
            info: true,
            responsive: true,
            order: [1, "asc"],
            action: function () {
              $("#tblCustomerlist").DataTable().ajax.reload();
            },
            fnDrawCallback: function (oSettings) {
              setTimeout(function () {
                MakeNegative();
              }, 100);
            },
            language: { search: "",searchPlaceholder: "Search List..." },
            fnInitComplete: function () {
              $(
                "<button class='btn btn-primary btnRefreshCustomers' type='button' id='btnRefreshCustomers' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
              ).insertAfter("#tblCustomerlist_filter");
            },
          })
          .on("page", function () {
            setTimeout(function () {
              MakeNegative();
            }, 100);
            let draftRecord = templateObject.customerList.get();
            templateObject.customerList.set(draftRecord);
          })
          .on("column-reorder", function () {})
          .on("length.dt", function (e, settings, len) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });

        LoadingOverlay.hide();
      }, 300);
    }

    LoadingOverlay.hide();
    $("div.dataTables_filter input").addClass("form-control form-control-sm");
  };

  // Step 8 Render functionalities

  templateObject.loadSuppliers = async (refresh = false) => {
    LoadingOverlay.show();
    let data = await sideBarService.getAllSuppliersDataVS1("All"); // always load from database fresh data
    await addVS1Data("TSupplierVS1", JSON.stringify(data));

    let _supplierList = [];
    let _supplierListHeaers = [];

    if (data.tsuppliervs1) {
      data.tsuppliervs1.forEach((supplier) => {
        let arBalance =
          utilityService.modifynegativeCurrencyFormat(
            supplier.fields.APBalance
          ) || 0.0;
        let creditBalance =
          utilityService.modifynegativeCurrencyFormat(
            supplier.fields.ExcessAmount
          ) || 0.0;
        let balance =
          utilityService.modifynegativeCurrencyFormat(
            supplier.fields.Balance
          ) || 0.0;
        let creditLimit =
          utilityService.modifynegativeCurrencyFormat(
            supplier.fields.SupplierCreditLimit
          ) || 0.0;
        let salesOrderBalance =
          utilityService.modifynegativeCurrencyFormat(
            supplier.fields.Balance
          ) || 0.0;
        var dataList = {
          id: supplier.fields.ID || "",
          company: supplier.fields.ClientName || "",
          contactname: supplier.fields.ContactName || "",
          phone: supplier.fields.Phone || "",
          arbalance: arBalance || 0.0,
          creditbalance: creditBalance || 0.0,
          balance: balance || 0.0,
          creditlimit: creditLimit || 0.0,
          salesorderbalance: salesOrderBalance || 0.0,
          email: supplier.fields.Email || "",
          accountno: supplier.fields.AccountNo || "",
          clientno: supplier.fields.ClientNo || "",
          jobtitle: supplier.fields.JobTitle || "",
          notes: supplier.fields.Notes || "",
          country: supplier.fields.Country || "",
        };

        _supplierList.push(dataList);
      });
    }

    await templateObject.supplierList.set(_supplierList);

    if (await templateObject.supplierList.get()) {
      Meteor.call(
        "readPrefMethod",
        localStorage.getItem("mycloudLogonID"),
        "tblSupplierlist",
        function (error, result) {
          if (error) {
          } else {
            if (result) {
              for (let i = 0; i < result.customFields.length; i++) {
                let customcolumn = result.customFields;
                let columData = customcolumn[i].label;
                let columHeaderUpdate = customcolumn[i].thclass.replace(
                  / /g,
                  "."
                );
                let hiddenColumn = customcolumn[i].hidden;
                let columnClass = columHeaderUpdate.split(".")[1];
                let columnWidth = customcolumn[i].width;
                let columnindex = customcolumn[i].index + 1;

                if (hiddenColumn == true) {
                  $("." + columnClass + "").addClass("hiddenColumn");
                  $("." + columnClass + "").removeClass("showColumn");
                } else if (hiddenColumn == false) {
                  $("." + columnClass + "").removeClass("hiddenColumn");
                  $("." + columnClass + "").addClass("showColumn");
                }
              }
            }
          }
        }
      );

      setTimeout(function () {
        MakeNegative();
      }, 100);
      if ($.fn.dataTable.isDataTable("#tblSupplierlist")) {
        $("#tblSupplierlist").DataTable().destroy();
      }

      setTimeout(function () {
        $("#tblSupplierlist")
          .DataTable({
            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            select: true,
            destroy: refresh,
            colReorder: true,
            pageLength: 25,
            paging: true,
            info: true,
            responsive: true,
            order: [1, "asc"],
            action: function () {
              $("#tblSupplierlist").DataTable().ajax.reload();
            },
            fnDrawCallback: function (oSettings) {
              
              setTimeout(function () {
                MakeNegative();
              }, 100);
            },
            language: { search: "",searchPlaceholder: "Search List..." },
            fnInitComplete: function () {
              $(
                "<button class='btn btn-primary btnRefreshSuppliers' type='button' id='btnRefreshSuppliers' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
              ).insertAfter("#tblSupplierlist_filter");
            },
          })
          .on("page", function () {
            let draftRecord = templateObject.supplierList.get();
            templateObject.supplierList.set(draftRecord);
          })
          .on("column-reorder", function () {})
          .on("length.dt", function (e, settings, len) {
            $(".fullScreenSpin").css("display", "inline-block");
            let dataLenght = settings._iDisplayLength;
            if (dataLenght == -1) {
              if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                LoadingOverlay.hide();
              } else {
                sideBarService
                  .getAllSuppliersDataVS1("All", 1)
                  .then(function (dataNonBo) {
                    addVS1Data("TSupplierVS1", JSON.stringify(dataNonBo))
                      .then(function (datareturn) {
                        templateObject.resetData(dataNonBo);
                        LoadingOverlay.hide();
                      })
                      .catch(function (err) {
                        LoadingOverlay.hide();
                      });
                  })
                  .catch(function (err) {
                    LoadingOverlay.hide();
                  });
              }
            } else {
              if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                LoadingOverlay.hide();
              } else {
                sideBarService
                  .getAllSuppliersDataVS1(dataLenght, 0)
                  .then(function (dataNonBo) {
                    addVS1Data("TSupplierVS1", JSON.stringify(dataNonBo))
                      .then(function (datareturn) {
                        templateObject.resetData(dataNonBo);
                        LoadingOverlay.hide();
                      })
                      .catch(function (err) {
                        LoadingOverlay.hide();
                      });
                  })
                  .catch(function (err) {
                    LoadingOverlay.hide();
                  });
              }
            }
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });

        LoadingOverlay.hide();
      }, 300);

      LoadingOverlay.hide();
    }
    $("div.dataTables_filter input").addClass("form-control form-control-sm");
  };

  // Step 9 Render functionalities
  templateObject.loadInventory = async (refresh = false) => {
    LoadingOverlay.show();
    let _inventoryList = [];
    let data = await sideBarService.getNewProductListVS1("All");

    await addVS1Data("TProductVS1", JSON.stringify(data));

    if (data.tproductvs1) {
      departmentData = "All";

      data.tproductvs1.forEach((product) => {
        let availableQty = 0;
        let onBOOrder = 0;
        let onSOORDer = 0;

        if (product.fields.ProductClass != null) {
          for (let a = 0; a < product.fields.ProductClass.length; a++) {
            availableQty +=
              product.fields.ProductClass[a].fields.AvailableQuantity || 0;
          }
        }
        product.fields.AvailableQuantity = availableQty;
        product.fields.onBOOrder =
          product.fields.TotalQtyInStock - availableQty;
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
      //if (refresh) $("#InventoryTable").DataTable().destroy();

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
            language: { search: "",searchPlaceholder: "Search List..." },
            fnInitComplete: function () {
              $(
                "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
              ).insertAfter("#tblInventory_filter");
            },
          })
          .on("length.dt", function (e, settings, len) {
            $(".fullScreenSpin").css("display", "inline-block");
            let dataLenght = settings._iDisplayLength;
            // splashArrayProductList = [];
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
  /**
   * This function will lazy load the setup, in order to avoid any loading issues
   * @param {number} stepId
   * @returns
   */
  templateObject.lazyLoader = (stepId = 1) => {
    if (isAlreadyLoaded(stepId) == false) {
      switch (stepId) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          templateObject.getPaymentMethods();
          templateObject.loadStripe();
          break;
        case 4:
          templateObject.loadStep4Prefs();
          templateObject.loadTerms();
          break;
        case 5:
          templateObject.loadStep5Prefs();
          templateObject.loadEmployees();
          break;
        case 6:
          templateObject.loadAccountTypes();
          templateObject.loadAccountList();
          templateObject.loadAllTaxCodes();
          break;
        case 7:
          templateObject.loadDefaultCustomer();
          break;
        case 8:
          templateObject.loadSuppliers();
          break;
        case 9:
          templateObject.loadInventory();
          break;
        case 10:
          break;
        default:
        // code block
      }
      setAlreadyLoaded(stepId, true);
    }
  };

  templateObject.lazyLoader(currentStep);



});

function isStepActive(stepId) {
  let currentStepID = $(".setup-stepper .current a.gotToStepID").attr(
    "data-step-id"
  );
  if (stepId < currentStepID) {
    return true;
  } else {
    return false;
  }
}

function goToNextStep(
  stepId,
  isConfirmed = false,
  onStepChange = (stepId) => {}
) {
  isConfirmed == true ? addConfirmedStep(stepId) : addSkippedStep(stepId);
  stepId = stepId + 1;
  templateObject.setCurrentStep(stepId);
  $(".setup-step").removeClass("show");
  $(`.setup-step-${stepId}`).addClass("show");
  onStepChange(stepId);
}

Template.setup.events({
  "click #start-wizard": (e) => {
    let templateObject = Template.instance();
    $(`[data-step-id=1]`).parents("li").addClass("current");
    $(".first-page").css("display", "none");
    $(".main-setup").css("display", "flex");
    templateObject.setCurrentStep(1);
    templateObject.loadSteps();
  },
  "click .confirmBtn": (event, templateObject) => {
    LoadingOverlay.show();

    let stepId = parseInt($(event.currentTarget).attr("data-step-id"));
    goToNextStep(stepId, true, (step) => {
      templateObject.lazyLoader(step);
    });
    templateObject.loadSteps();
    window.scrollTo(0, 0);
    LoadingOverlay.hide();
  },
  "click .btnBack": (event, templateObject) => {
    playCancelAudio();
    setTimeout(function(){
      console.log("click back!")
      LoadingOverlay.show();
      let skippedSteps = templateObject.skippedSteps.get();
      let stepId = parseInt($(event.currentTarget).attr("data-step-id"));
      goToNextStep(stepId, false, (step) => {
        templateObject.lazyLoader(step);
      });
      if (!skippedSteps.includes(stepId)) skippedSteps.push(stepId);
      templateObject.skippedSteps.set(skippedSteps);
      templateObject.loadSteps();
      window.scrollTo(0, 0);
      LoadingOverlay.hide();
    }, delayTimeAfterSound);
  },
  "click .gotToStepID": (event ) => {
    const templateObj = Template.instance();
    const stepId = parseInt($(event.currentTarget).attr("data-step-id"));
    $(".setup-step").removeClass("show");
    $(`.setup-step-${stepId}`).addClass("show");
    $(`.setup-stepper li`).removeClass("current");
    $(`.setup-stepper li:nth-child(${stepId})`).addClass("current");
    templateObj.setCurrentStep(stepId);
    templateObj.loadSteps();
    templateObj.lazyLoader(stepId);
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



  // TODO: Step 2
  // Active Tax Rates

  "click .visiblePopupDiv": function () {
    setTimeout(() => {
      $('.modal-backdrop').addClass('giveAccess');
    }, 100);
  },
  "click .downloadHelpFile": function (event) {
    // event.preventDefault();
    $('#downloadHelpFileModal').modal('show');
    let iframeLink = $(event.target).attr('data-href');
    $('.customDownloadHelpIframe').attr('src', iframeLink);
    setTimeout(() => {
      $('.modal-backdrop').addClass('giveAccess');
    }, 100);
  },
  "click .chkDatatableTaxRate": function (event) {
    var columns = $("#taxRatesTable th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumnTaxRate")
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
  "click .resetTaxRateTable": function (event) {
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
          PrefName: "taxRatesList",
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
  "click .saveTaxRateTable": function (event) {
    let lineItems = [];
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumnTaxRate").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass =
        $tblrow.find(".divcolumnTaxRate").attr("valueupdate") || "";
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
          PrefName: "taxRatesList",
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
                PrefName: "taxRatesList",
                published: true,
                customFields: lineItems,
                updatedAt: new Date(),
              },
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsTaxRate").modal("toggle");
              } else {
                $("#btnOpenSettingsTaxRate").modal("toggle");
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
              PrefName: "taxRatesList",
              published: true,
              customFields: lineItems,
              createdAt: new Date(),
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsTaxRate").modal("toggle");
              } else {
                $("#btnOpenSettingsTaxRate").modal("toggle");
              }
            }
          );
        }
      }
    }
  },
  "blur .divcolumnTaxRate": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target)
      .closest("div.columnSettings")
      .attr("id");
    var datable = $("#taxRatesTable").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRangeTaxRate": function (event) {
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
      .find(".divcolumnTaxRate")
      .text();
    var datable = $("#taxRatesTable th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .btnOpenSettingsTaxRate": function (event) {
    let templateObject = Template.instance();
    var columns = $("#taxRatesTable th");

    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if (v.className.includes("hiddenColumn")) {
        columVisible = false;
      }
      sWidth = v.style.width.replace("px", "");

      let datatablerecordObj = {
        sTitle: v.innerText || "",
        sWidth: sWidth || "",
        sIndex: v.cellIndex || "",
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  "click .btnRefreshTaxRate": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    sideBarService
      .getTaxRateVS1()
      .then(function (dataReload) {
        addVS1Data("TTaxcodeVS1", JSON.stringify(dataReload))
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
  "click .btnAddNewTaxRate": function () {
    $("#newTaxRate").css("display", "block");
  },
  "click .btnCloseAddNewTax": function () {
    playCancelAudio();
    setTimeout(function(){
    $("#newTaxRate").css("display", "none");
    }, delayTimeAfterSound);
  },
  "click #saveStep2": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let purchasetaxcode = $("input[name=optradioP]:checked").val() || "";
    let salestaxcode = $("input[name=optradioS]:checked").val() || "";

    localStorage.setItem("ERPTaxCodePurchaseInc", purchasetaxcode || "");
    localStorage.setItem("ERPTaxCodeSalesInc", salestaxcode || "");
    getVS1Data("vscloudlogininfo")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          swal({
            title: "Default Tax Rate Successfully Changed",
            text: "",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {
              Meteor._reload.reload();
            } else {
              Meteor._reload.reload();
            }
          });
        } else {
          let loginDataArray = [];
          if (dataObject[0].EmployeeEmail === localStorage.getItem("mySession")) {
            loginDataArray = dataObject[0].data;

            loginDataArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc = purchasetaxcode;
            loginDataArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc = salestaxcode;
            addLoginData(loginDataArray).then(function (datareturnCheck) {
                LoadingOverlay.hide();
                swal({
                  title: "Default Tax Rate Successfully Changed",
                  text: "",
                  type: "success",
                  showCancelButton: false,
                  confirmButtonText: "OK",
                }).then((result) => {
                  // $(".setup-step").css("display", "none");
                  // $(`.setup-stepper li:nth-child(3)`).addClass("current");
                  // $(`.setup-stepper li:nth-child(2)`).removeClass("current");
                  // $(`.setup-stepper li:nth-child(2)`).addClass("completed");
                  // $(".setup-step-3").css("display", "block");
                  // let confirmedSteps =
                  //   localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") ||
                  //   "";
                  // localStorage.setItem(
                  //   "VS1Cloud_SETUP_CONFIRMED_STEPS",
                  //   confirmedSteps + "2,"
                  // );
                  // localStorage.setItem("VS1Cloud_SETUP_STEP", 3);
                });
              }).catch(function (err) {
                LoadingOverlay.hide();
                swal({
                  title: "Default Tax Rate Successfully Changed",
                  text: "",
                  type: "success",
                  showCancelButton: false,
                  confirmButtonText: "OK",
                }).then((result) => {
                  // $(".setup-step").css("display", "none");
                  // $(`.setup-stepper li:nth-child(3)`).addClass("current");
                  // $(`.setup-stepper li:nth-child(2)`).removeClass("current");
                  // $(`.setup-stepper li:nth-child(2)`).addClass("completed");
                  // $(".setup-step-3").css("display", "block");
                  // let confirmedSteps =
                  //   localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") ||
                  //   "";
                  // localStorage.setItem(
                  //   "VS1Cloud_SETUP_CONFIRMED_STEPS",
                  //   confirmedSteps + "2,"
                  // );
                  // localStorage.setItem("VS1Cloud_SETUP_STEP", 3);
                });
              });
          } else {
            LoadingOverlay.hide();
            swal({
              title: "Default Tax Rate Successfully Changed",
              text: "",
              type: "success",
              showCancelButton: false,
              confirmButtonText: "OK",
            }).then((result) => {
              // $(".setup-step").css("display", "none");
              // $(`.setup-stepper li:nth-child(3)`).addClass("current");
              // $(`.setup-stepper li:nth-child(2)`).removeClass("current");
              // $(`.setup-stepper li:nth-child(2)`).addClass("completed");
              // $(".setup-step-3").css("display", "block");
              // let confirmedSteps =
              //   localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || "";
              // localStorage.setItem(
              //   "VS1Cloud_SETUP_CONFIRMED_STEPS",
              //   confirmedSteps + "2,"
              // );
              // localStorage.setItem("VS1Cloud_SETUP_STEP", 3);
            });
          }
        }
      })
      .catch(function (err) {
        LoadingOverlay.hide();
        swal({
          title: "Default Tax Rate Successfully Changed",
          text: "",
          type: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          // $(".setup-step").css("display", "none");
          // $(`.setup-stepper li:nth-child(3)`).addClass("current");
          // $(`.setup-stepper li:nth-child(2)`).removeClass("current");
          // $(`.setup-stepper li:nth-child(2)`).addClass("completed");
          // $(".setup-step-3").css("display", "block");
          // let confirmedSteps =
          //   localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || "";
          // localStorage.setItem(
          //   "VS1Cloud_SETUP_CONFIRMED_STEPS",
          //   confirmedSteps + "2,"
          // );
          // localStorage.setItem("VS1Cloud_SETUP_STEP", 3);
        });
      });
  },
  "keydown #edtTaxRate": function (event) {
    if (
      $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (event.keyCode === 65 &&
        (event.ctrlKey === true || event.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (event.keyCode >= 35 && event.keyCode <= 40)
    ) {
      // let it happen, don't do anything
      return;
    }

    if (event.shiftKey == true) {
      event.preventDefault();
    }

    if (
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode == 8 ||
      event.keyCode == 9 ||
      event.keyCode == 37 ||
      event.keyCode == 39 ||
      event.keyCode == 46 ||
      event.keyCode == 190
    ) {
    } else {
      event.preventDefault();
    }
  },
  // TODO: Step 3
  // Payment method settings
 

  // TODO: Step 4
  // Term settings
  "click .chkDatatableTerm": function (event) {
    var columns = $("#termsList th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumnTerm")
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
  "click .resetTermTable": function (event) {
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
          PrefName: "termsList",
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
  "click .saveTermTable": function (event) {
    let lineItems = [];
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumnTerm").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumnTerm").attr("valueupdate") || "";
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
          PrefName: "termsList",
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
                PrefName: "termsList",
                published: true,
                customFields: lineItems,
                updatedAt: new Date(),
              },
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsTerm").modal("toggle");
              } else {
                $("#btnOpenSettingsTerm").modal("toggle");
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
              PrefName: "termsList",
              published: true,
              customFields: lineItems,
              createdAt: new Date(),
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsTerm").modal("toggle");
              } else {
                $("#btnOpenSettingsTerm").modal("toggle");
              }
            }
          );
        }
      }
    }
  },
  "blur .divcolumnTerm": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target)
      .closest("div.columnSettings")
      .attr("id");
    var datable = $("#termsList").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRangeTerm": function (event) {
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
      .find(".divcolumnTerm")
      .text();
    var datable = $("#termsList th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .btnOpenSettingsTerm": function (event) {
    let templateObject = Template.instance();
    var columns = $("#termsList th");

    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if (v.className.includes("hiddenColumn")) {
        columVisible = false;
      }
      sWidth = v.style.width.replace("px", "");

      let datatablerecordObj = {
        sTitle: v.innerText || "",
        sWidth: sWidth || "",
        sIndex: v.cellIndex || "",
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.termtableheaderrecords.set(tableHeaderList);
  },
  "click .btnRefreshTerm": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    sideBarService
      .getTermsVS1()
      .then(function (dataReload) {
        addVS1Data("TTermsVS1", JSON.stringify(dataReload))
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
  "click .btnDeleteTerms": function () {
    playDeleteAudio();
    let taxRateService = new TaxRateService();
    setTimeout(function(){
    let termsId = $("#selectDeleteLineID").val();
    let objDetails = {
      type: "TTerms",
      fields: {
        Id: parseInt(termsId),
        Active: false,
      },
    };

    taxRateService
      .saveTerms(objDetails)
      .then(function (objDetails) {
        sideBarService
          .getTermsVS1()
          .then(function (dataReload) {
            addVS1Data("TTermsVS1", JSON.stringify(dataReload))
              .then(function (datareturn) {
                Meteor._reload.reload();
              })
              .catch(function (err) {
                Meteor._reload.reload();
              });
          })
          .catch(function (err) {
            Meteor._reload.reload();
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
  "click .btnSaveTerms": function () {
    playSaveAudio();
    let taxRateService = new TaxRateService();
    setTimeout(function(){
    $(".fullScreenSpin").css("display", "inline-block");

    let termsID = $("#edtTermsID").val();
    let termsName = $("#edtName").val();
    let description = $("#edtDesc").val();
    let termdays = $("#edtDays").val();

    let isDays = false;
    let is30days = false;
    let isEOM = $("#addTermModal #isEOM").is(":checked");
    let isEOMPlus = $("#addTermModal #isEOMPlus").is(":checked");
    let days = 0;

    let isCustomerDefault = $("#addTermModal #chkCustomerDef").is(":checked");
    let isSupplierDefault = $("#addTermModal #chkSupplierDef").is(":checked");

    if (termdays.replace(/\s/g, "") != "") {
      isDays = true;
    } else {
      isDays = false;
    }

    let objDetails = "";
    if (termsName === "") {
      LoadingOverlay.hide();
      Bert.alert(
        "<strong>WARNING:</strong> Term Name cannot be blank!",
        "warning"
      );
      e.preventDefault();
    }

    if (termsID == "") {

      taxRateService
        .checkTermByName(termsName)
        .then(function (data) {
          termsID = data.tterms[0].Id;

          objDetails = {
            type: "TTerms",
            fields: {
              ID: parseInt(termsID),
              Active: true,
              //TermsName: termsName,
              Description: description,
              IsDays: isDays,
              IsEOM: isEOM,
              IsEOMPlus: isEOMPlus,
              isPurchasedefault: isSupplierDefault,
              isSalesdefault: isCustomerDefault,
              Days: termdays || 0,
              PublishOnVS1: true,
            },
          };

          taxRateService
            .saveTerms(objDetails)
            .then(function (objDetails) {
              sideBarService
                .getTermsVS1()
                .then(function (dataReload) {
                  addVS1Data("TTermsVS1", JSON.stringify(dataReload))
                    .then(function (datareturn) {
                      Meteor._reload.reload();
                    })
                    .catch(function (err) {
                      Meteor._reload.reload();
                    });
                })
                .catch(function (err) {
                  Meteor._reload.reload();
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
            type: "TTerms",
            fields: {
              Active: true,
              TermsName: termsName,
              Description: description,
              IsDays: isDays,
              IsEOM: isEOM,
              IsEOMPlus: isEOMPlus,
              isPurchasedefault: isSupplierDefault,
              isSalesdefault: isCustomerDefault,
              Days: termdays || 0,
              PublishOnVS1: true,
            },
          };

          taxRateService.saveTerms(objDetails).then(function (objResponse) {
              if( isSupplierDefault == true ||  isCustomerDefault == true ){
                updateObjDetails = {
                  type: "TTerms",
                  fields: {
                    ID: parseInt(objResponse.fields.ID),
                    isPurchasedefault: isSupplierDefault,
                    isSalesdefault: isCustomerDefault
                  },
                };
                taxRateService.saveTerms(updateObjDetails).then(function () {
                  sideBarService.getTermsVS1().then(function (dataReload) {
                    addVS1Data("TTermsVS1", JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    }).catch(function (err) {
                      Meteor._reload.reload();
                    });
                  }).catch(function (err) {
                    Meteor._reload.reload();
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
              sideBarService.getTermsVS1().then(function (dataReload) {
                  addVS1Data("TTermsVS1", JSON.stringify(dataReload)).then(function (datareturn) {
                      Meteor._reload.reload();
                    })
                    .catch(function (err) {
                      Meteor._reload.reload();
                    });
                })
                .catch(function (err) {
                  Meteor._reload.reload();
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
        type: "TTerms",
        fields: {
          ID: parseInt(termsID),
          TermsName: termsName,
          Description: description,
          IsDays: isDays,
          IsEOM: isEOM,
          IsEOMPlus: isEOMPlus,
          isPurchasedefault: isSupplierDefault,
          isSalesdefault: isCustomerDefault,
          Days: termdays || 0,
          PublishOnVS1: true,
        },
      };

      taxRateService
        .saveTerms(objDetails)
        .then(function (objDetails) {
          sideBarService
            .getTermsVS1()
            .then(function (dataReload) {
              addVS1Data("TTermsVS1", JSON.stringify(dataReload))
                .then(function (datareturn) {
                  Meteor._reload.reload();
                })
                .catch(function (err) {
                  Meteor._reload.reload();
                });
            })
            .catch(function (err) {
              Meteor._reload.reload();
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
  "click .btnAddTerms":  (e, templateObject) => {
    $("#add-terms-title").text("Add New Term ");
    $("#edtTermsID").val("");
    $("#edtName").val("");
    $("#edtName").prop("readonly", false);
    $("#edtDesc").val("");
    $("#edtDays").val("");

    $('#addTermModal #isEOM').prop('checked', false);
    $('#addTermModal #isEOMPlus').prop('checked', false);

    $('#addTermModal #chkCustomerDef').prop('checked', false);
    $('#addTermModal #chkSupplierDef').prop('checked', false);

    templateObject.include7Days.set(false);
    templateObject.includeCOD.set(false);
    templateObject.include30Days.set(false);
    templateObject.includeEOM.set(false);
    templateObject.includeEOMPlus.set(false);
  },
  "click .chkTerms": function (event) {
    var $box = $(event.target);

    if ($box.is(":checked")) {
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
  },
  "keydown #edtDays": function (event) {
    if (
      $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (event.keyCode === 65 &&
        (event.ctrlKey === true || event.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (event.keyCode >= 35 && event.keyCode <= 40)
    ) {
      // let it happen, don't do anything
      return;
    }

    if (event.shiftKey == true) {
      event.preventDefault();
    }

    if (
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode == 8 ||
      event.keyCode == 9 ||
      event.keyCode == 37 ||
      event.keyCode == 39 ||
      event.keyCode == 46 ||
      event.keyCode == 190
    ) {
    } else {
      event.preventDefault();
    }
  },
  "click #termsList tbody td.clickable": (event, templateObject) => {
    const tr = $(event.currentTarget).parent();
    var listData = tr.attr("id");
    var is7days = false;
    var is30days = false;
    var isEOM = false;
    var isEOMPlus = false;
    var isSalesDefault = false;
    var isPurchaseDefault = false;
    if (listData) {
      $("#add-terms-title").text("Edit Term ");
      if (listData !== "") {
        listData = Number(listData);

        var termsID = listData || "";
        var termsName = tr.find(".colName").text() || "";
        var description = tr.find(".colDescription").text() || "";
        var days = tr.find(".colIsDays").text() || 0;
        isEOM = tr.find(".colIsEOM .chkBox").is(":checked");
        isEOMPlus = tr.find(".colIsEOMPlus .chkBox").is(":checked");
        //let isDays = data.fields.IsDays || '';
        // if (tr.find(".colIsEOM .chkBox").is(":checked")) {
        //   isEOM = true;
        // }

        // if (tr.find(".colIsEOMPlus .chkBox").is(":checked")) {
        //   isEOMPlus = true;
        // }

        isSalesDefault = tr.find(".colCustomerDef .chkBox").is(":checked");
        isPurchaseDefault = tr.find(".colSupplierDef .chkBox").is(":checked");


        if (isEOM == true || isEOMPlus == true) {
          isDays = false;
        } else {
          isDays = true;
        }

        $("#edtTermsID").val(termsID);
        $("#edtName").val(termsName);
        $("#edtName").prop("readonly", true);
        $("#edtDesc").val(description);
        $("#edtDays").val(days);

        $('#addTermModal #isEOM').prop('checked', isEOM);
        $('#addTermModal #isEOMPlus').prop('checked', isEOMPlus);

        $('#addTermModal #chkCustomerDef').prop('checked', isSalesDefault);
        $('#addTermModal #chkSupplierDef').prop('checked', isPurchaseDefault);

        if (isDays == true && days == 0) {
          templateObject.includeCOD.set(true);
        } else {
          templateObject.includeCOD.set(false);
        }

        if (isDays == true && days == 30) {
          templateObject.include30Days.set(true);
        } else {
          templateObject.include30Days.set(false);
        }

        if (isEOM == true) {
          templateObject.includeEOM.set(true);
        } else {
          templateObject.includeEOM.set(false);
        }

        if (isEOMPlus == true) {
          templateObject.includeEOMPlus.set(true);
        } else {
          templateObject.includeEOMPlus.set(false);
        }

        if (isSalesDefault == true) {
          templateObject.includeSalesDefault.set(true);
        } else {
          templateObject.includeSalesDefault.set(false);
        }

        if (isPurchaseDefault == true) {
          templateObject.includePurchaseDefault.set(true);
        } else {
          templateObject.includePurchaseDefault.set(false);
        }

        //});

        // $(this).closest("tr").attr("data-target", "#myModal");
        // $(this).closest("tr").attr("data-toggle", "modal");

        $("#addTermModal").modal("toggle");
      }
    }
  },

  // TODO: Step 5
  "click .btnSaveEmpPop": (e) => {
    playSaveAudio();
    setTimeout(function(){
    $("#addEmployeeModal").modal("toggle");

    // const templateObject = Template.instance();
    // templateObject.loadEmployees(true);
  }, delayTimeAfterSound);
  },
  "click .edit-employees-js": (e) => {
    $("#addEmployeeModal").modal("toggle");
    let templateObject = Template.instance();
    LoadingOverlay.show();
    const employeeID = $(e.currentTarget).attr("id");
    if (!isNaN(employeeID)) {
      let employeeList = templateObject.currentEmployees.get();

      let data = employeeList.filter(
        (employee) => employee.fields.ID == employeeID
      );
      data = data[0];

      let editableEmployee = {
        id: data.fields.ID,
        lid: "Edit Employee",
        title: data.fields.Title || "",
        firstname: data.fields.FirstName || "",
        middlename: data.fields.MiddleName || "",
        lastname: data.fields.LastName || "",
        company: data.fields.EmployeeName || "",
        tfn: data.fields.TFN || "",
        priority: data.fields.CustFld5 || 0,
        color: data.fields.CustFld6 || "#00a3d3",
        email: data.fields.Email || "",
        phone: data.fields.Phone || "",
        mobile: data.fields.Mobile || "",
        fax: data.fields.FaxNumber || "",
        skype: data.fields.SkypeName || "",
        gender: data.fields.Sex || "",
        dob: data.fields.DOB
          ? moment(data.fields.DOB).format("DD/MM/YYYY")
          : "",
        startdate: data.fields.DateStarted
          ? moment(data.fields.DateStarted).format("DD/MM/YYYY")
          : "",
        datefinished: data.fields.DateFinished
          ? moment(data.fields.DateFinished).format("DD/MM/YYYY")
          : "",
        position: data.fields.Position || "",
        streetaddress: data.fields.Street || "",
        city: data.fields.Street2 || "",
        state: data.fields.State || "",
        postalcode: data.fields.PostCode || "",
        country: data.fields.Country || LoggedCountry,
        custfield1: data.fields.CustFld1 || "",
        custfield2: data.fields.CustFld2 || "",
        custfield3: data.fields.CustFld3 || "",
        custfield4: data.fields.CustFld4 || "",
        custfield14: data.fields.CustFld14 || "",
        website: "",
        notes: data.fields.Notes || "",
      };

      templateObject.editableEmployee.set(editableEmployee);
    }
    LoadingOverlay.hide();
  },
  "click #btnNewEmployee": (event) => {
    $("#addEmployeeModal").modal("toggle");

    let templateObject = Template.instance();
    LoadingOverlay.show();
    templateObject.editableEmployee.set(null);
    LoadingOverlay.hide();
  },
  "click .btnAddVS1User": function (event) {
    swal({
      title: "Is this an existing Employee?",
      text: "",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        swal("Please select the employee from the list below.", "", "info");
        $("#employeeListModal").modal("toggle");
        // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      } else if (result.dismiss === "cancel") {
        // FlowRouter.go("/employeescard?addvs1user=true");
        $("#addEmployeeModal").modal("toggle");
      }
    });
  },
  "click .chkDatatableEmployee": function (event) {
    var columns = $("#tblEmployeelist th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumnEmployee")
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
  "keyup #tblEmployeelist_filter input": function (event) {
    if ($(event.target).val() != "") {
      $(".btnRefreshEmployees").addClass("btnSearchAlert");
    } else {
      $(".btnRefreshEmployees").removeClass("btnSearchAlert");
    }
    if (event.keyCode == 13) {
      $(".btnRefreshEmployees").trigger("click");
    }
  },
  "click .btnRefreshEmployee": (event) => {
    let templateObject = Template.instance();
    templateObject.loadEmployees(true);
  },
  "click .resetEmployeeTable": function (event) {
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
          PrefName: "tblEmployeelist",
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
  "click .saveEmployeeTable": function (event) {
    let lineItems = [];
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumnEmployee").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass =
        $tblrow.find(".divcolumnEmployee").attr("valueupdate") || "";
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
          PrefName: "tblEmployeelist",
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
                PrefName: "tblEmployeelist",
                published: true,
                customFields: lineItems,
                updatedAt: new Date(),
              },
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsEmployee").modal("toggle");
              } else {
                $("#btnOpenSettingsEmployee").modal("toggle");
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
              PrefName: "tblEmployeelist",
              published: true,
              customFields: lineItems,
              createdAt: new Date(),
            },
            function (err, idTag) {
              if (err) {
                $("#btnOpenSettingsEmployee").modal("toggle");
              } else {
                $("#btnOpenSettingsEmployee").modal("toggle");
              }
            }
          );
        }
      }
    }
    $("#btnOpenSettingsEmployee").modal("toggle");
  },
  "blur .divcolumnEmployee": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target)
      .closest("div.columnSettings")
      .attr("id");
    var datable = $("#tblEmployeelist").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRangeEmployee": function (event) {
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
      .find(".divcolumnEmployee")
      .text();
    var datable = $("#tblEmployeelist th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .btnOpenSettingsEmployee": function (event) {
    let templateObject = Template.instance();
    var columns = $("#tblEmployeelist th");

    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if (v.className.includes("hiddenColumn")) {
        columVisible = false;
      }
      sWidth = v.style.width.replace("px", "");
      let datatablerecordObj = {
        sTitle: v.innerText || "",
        sWidth: sWidth || "",
        sIndex: v.cellIndex || "",
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.employeetableheaderrecords.set(tableHeaderList);
  },
  "click .exportbtnEmployee": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblEmployeelist_wrapper .dt-buttons .btntabletocsv").click();
    LoadingOverlay.hide();
  },
  "click .exportbtnExcelEmployee": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblEmployeelist_wrapper .dt-buttons .btntabletoexcel").click();
    LoadingOverlay.hide();
  },
  "click .printConfirmEmployee": function (event) {
    playPrintAudio();
    setTimeout(function(){
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblEmployeelist_wrapper .dt-buttons .btntabletopdf").click();
    LoadingOverlay.hide();
  }, delayTimeAfterSound);
  },
  "click .templateDownload-employee": (e, templateObject) => {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleEmployee" + ".csv";

    const employees = templateObject.currentEmployees.get();
    rows.push([
      "First Name",
      "Last Name",
      "Phone",
      "Mobile",
      "Email",
      "Skype",
      "Street",
      "City/Suburb",
      "State",
      "Post Code",
      "Country",
      "Gender",
    ]);

    employees.forEach((employee) => {
      rows.push([
        employee.fields.FirstName,
        employee.fields.LastName,
        employee.fields.Phone,
        employee.fields.Mobile,
        employee.fields.Email,
        employee.fields.SkypeName,
        employee.fields.Street,
        employee.fields.Suburb,
        employee.fields.State,
        employee.fields.PostCode,
        employee.fields.Country,
        employee.fields.Sex
      ]);
    });

    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .templateDownloadXLSX-employee": (e, templateObject) => {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleEmployee" + ".xls";

    const employees = templateObject.currentEmployees.get();
    rows.push([
      "First Name",
      "Last Name",
      "Phone",
      "Mobile",
      "Email",
      "Skype",
      "Street",
      "City/Suburb",
      "State",
      "Post Code",
      "Country",
      "Gender",
    ]);

    employees.forEach((employee) => {
      rows.push([
        employee.fields.FirstName,
        employee.fields.LastName,
        employee.fields.Phone,
        employee.fields.Mobile,
        employee.fields.Email,
        employee.fields.SkypeName,
        employee.fields.Street,
        employee.fields.Suburb,
        employee.fields.State,
        employee.fields.PostCode,
        employee.fields.Country,
        employee.fields.Sex
      ]);
    });


    utilityService.exportToCsv(rows, filename, "xls");
  },
  // "click .btnUploadFile": function (event) {
  //   $("#attachment-upload").val("");
  //   $(".file-name").text("");
  //   $("#attachment-upload").trigger("click");
  // },
  "click .btnUploadFile-employee": function (event) {
    $("#attachment-upload-employee").val("");
    $(".file-name").text("");
    $("#attachment-upload-employee").trigger("click");
  },
  "change #attachment-upload-employee": function (e) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload-employee")[0].files[0]["name"];
    var fileExtension = filename.split(".").pop().toLowerCase();
    var validExtensions = ["csv", "txt", "xlsx", "xls"];
    var validCSVExtensions = ["csv", "txt"];
    var validExcelExtensions = ["xlsx", "xls"];

    if (validExtensions.indexOf(fileExtension) == -1) {
      swal(
        "Invalid Format",
        "formats allowed are :" + validExtensions.join(", "),
        "error"
      );
      $(".file-name").text("");
      $(".btnImportEmployee").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnImportEmployee").removeAttr("disabled");
      } else {
        $(".btnImportEmployee").Attr("disabled");
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
        $(".btnImportEmployee").removeAttr("disabled");
      } else {
        $(".btnImportEmployee").Attr("disabled");
      }
    }
  },
  "click .btnImportEmployee": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let contactService = new ContactService();
    let objDetails;
    var saledateTime = new Date();
    //let empStartDate = new Date().format("YYYY-MM-DD");
    var empStartDate = moment(saledateTime).format("YYYY-MM-DD");
    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "First Name" &&
            results.data[0][1] == "Last Name" &&
            results.data[0][2] == "Phone" &&
            results.data[0][3] == "Mobile" &&
            results.data[0][4] == "Email" &&
            results.data[0][5] == "Skype" &&
            results.data[0][6] == "Street" &&
            (results.data[0][7] == "Street2" ||
              results.data[0][7] == "City/Suburb") &&
            results.data[0][8] == "State" &&
            results.data[0][9] == "Post Code" &&
            results.data[0][10] == "Country" &&
            results.data[0][11] == "Gender"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function () {
              // $('#importModal').modal('toggle');
              //Meteor._reload.reload();
              window.open("/employeelist?success=true", "_self");
            }, parseInt(dataLength));

            for (let i = 0; i < results.data.length - 1; i++) {
              objDetails = {
                type: "TEmployee",
                fields: {
                  FirstName: results.data[i + 1][0],
                  LastName: results.data[i + 1][1],
                  Phone: results.data[i + 1][2],
                  Mobile: results.data[i + 1][3],
                  DateStarted: empStartDate,
                  DOB: empStartDate,
                  Sex: results.data[i + 1][11] || "F",
                  Email: results.data[i + 1][4],
                  SkypeName: results.data[i + 1][5],
                  Street: results.data[i + 1][6],
                  Street2: results.data[i + 1][7],
                  Suburb: results.data[i + 1][7],
                  State: results.data[i + 1][8],
                  PostCode: results.data[i + 1][9],
                  Country: results.data[i + 1][10],
                },
              };
              if (results.data[i + 1][1]) {
                if (results.data[i + 1][1] !== "") {
                  contactService
                    .saveEmployee(objDetails)
                    .then(function (data) {
                      ///$('.fullScreenSpin').css('display','none');
                      //Meteor._reload.reload();
                    })
                    .catch(function (err) {
                      //$('.fullScreenSpin').css('display','none');
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
                    });
                }
              }
            }
          } else {
            LoadingOverlay.hide();
            swal(
              "Invalid Data Mapping fields ",
              "Please check that you are importing the correct file with the correct column headers.",
              "error"
            );
          }
        } else {
          LoadingOverlay.hide();
          swal(
            "Invalid Data Mapping fields ",
            "Please check that you are importing the correct file with the correct column headers.",
            "error"
          );
        }
      },
    });
  },
  "click #tblEmployeelistpop tr td": (e) => {
    $(e).preventDefault();
  },

  // TODO: Step 6
  "click .btnAddNewAccounts": function (event) {
    $("#add-account-title").text("Add New Account");
    $("#edtAccountID").val("");
    $("#sltAccountType").val("");
    $("#sltAccountType").removeAttr("readonly", true);
    $("#sltAccountType").removeAttr("disabled", "disabled");
    $("#edtAccountName").val("");
    $("#edtAccountName").attr("readonly", false);
    $("#edtAccountNo").val("");
    $("#sltTaxCode").val("NT" || "");
    $("#txaAccountDescription").val("");
    $("#edtBankAccountName").val("");
    $("#edtBSB").val("");
    $("#edtBankAccountNo").val("");
    $("#routingNo").val("");
    $("#edtBankName").val("");
    $("#swiftCode").val("");
    $(".showOnTransactions").prop("checked", false);
    $(".isBankAccount").addClass("isNotBankAccount");
    $(".isCreditAccount").addClass("isNotCreditAccount");
  },
  "click .btnRefreshAccount": function (event) {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    const customerList = [];
    const clientList = [];
    let salesOrderTable;
    var splashArray = [];
    var splashArrayAccountList = [];
    let utilityService = new UtilityService();
    const dataTableList = [];
    const tableHeaderList = [];
    let sideBarService = new SideBarService();
    let accountService = new AccountService();
    let dataSearchName = $("#tblAccount_filter input").val();
    var currentLoc = FlowRouter.current().route.path;
    if (dataSearchName.replace(/\s/g, "") !== "") {
      sideBarService
        .getAllAccountDataVS1ByName(dataSearchName)
        .then(function (data) {
          let lineItems = [];
          let lineItemObj = {};
          if (data.taccountvs1.length > 0) {
            for (let i = 0; i < data.taccountvs1.length; i++) {
              var dataList = [
                data.taccountvs1[i].fields.AccountName || "-",
                data.taccountvs1[i].fields.Description || "",
                data.taccountvs1[i].fields.AccountNumber || "",
                data.taccountvs1[i].fields.AccountTypeName || "",
                utilityService.modifynegativeCurrencyFormat(
                  Math.floor(data.taccountvs1[i].fields.Balance * 100) / 100
                ) || 0,
                data.taccountvs1[i].fields.TaxCode || "",
                data.taccountvs1[i].fields.ID || "",
              ];
              if (currentLoc === "/billcard") {
                if (
                  data.taccountvs1[i].fields.AccountTypeName !== "AP" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "AR" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "CCARD" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "BANK"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (currentLoc === "/journalentrycard") {
                if (
                  data.taccountvs1[i].fields.AccountTypeName !== "AP" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "AR"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (currentLoc === "/chequecard") {
                if (
                  data.taccountvs1[i].fields.AccountTypeName === "EQUITY" ||
                  data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                  data.taccountvs1[i].fields.AccountTypeName === "CCARD" ||
                  data.taccountvs1[i].fields.AccountTypeName === "COGS" ||
                  data.taccountvs1[i].fields.AccountTypeName === "EXP" ||
                  data.taccountvs1[i].fields.AccountTypeName === "FIXASSET" ||
                  data.taccountvs1[i].fields.AccountTypeName === "INC" ||
                  data.taccountvs1[i].fields.AccountTypeName === "LTLIAB" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OASSET" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OCASSET" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OCLIAB" ||
                  data.taccountvs1[i].fields.AccountTypeName === "EXEXP" ||
                  data.taccountvs1[i].fields.AccountTypeName === "EXINC"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (
                currentLoc === "/paymentcard" ||
                currentLoc === "/supplierpaymentcard"
              ) {
                if (
                  data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                  data.taccountvs1[i].fields.AccountTypeName === "CCARD" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OCLIAB"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (
                currentLoc === "/bankrecon" ||
                currentLoc === "/newbankrecon"
              ) {
                if (
                  data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                  data.taccountvs1[i].fields.AccountTypeName === "CCARD"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else {
                splashArrayAccountList.push(dataList);
              }
            }
            var datatable = $("#tblAccountlist").DataTable();
            datatable.clear();
            datatable.rows.add(splashArrayAccountList);
            datatable.draw(false);

            LoadingOverlay.hide();
          } else {
            LoadingOverlay.hide();
            $("#accountListModal").modal("toggle");
            swal({
              title: "Question",
              text: "Account does not exist, would you like to create it?",
              type: "question",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "No",
            }).then((result) => {
              if (result.value) {
                $("#addAccountModal").modal("toggle");
                $("#edtAccountName").val(dataSearchName);
              } else if (result.dismiss === "cancel") {
                $("#accountListModal").modal("toggle");
              }
            });
          }
        })
        .catch(function (err) {
          LoadingOverlay.hide();
        });
    } else {
      sideBarService
        .getAccountListVS1()
        .then(function (data) {
          let records = [];
          let inventoryData = [];
          for (let i = 0; i < data.taccountvs1.length; i++) {
            var dataList = [
              data.taccountvs1[i].fields.AccountName || "-",
              data.taccountvs1[i].fields.Description || "",
              data.taccountvs1[i].fields.AccountNumber || "",
              data.taccountvs1[i].fields.AccountTypeName || "",
              utilityService.modifynegativeCurrencyFormat(
                Math.floor(data.taccountvs1[i].fields.Balance * 100) / 100
              ),
              data.taccountvs1[i].fields.TaxCode || "",
              data.taccountvs1[i].fields.ID || "",
            ];

            splashArrayAccountList.push(dataList);
          }
          var datatable = $("#tblAccountlist").DataTable();
          datatable.clear();
          datatable.rows.add(splashArrayAccountList);
          datatable.draw(false);

          LoadingOverlay.hide();
        })
        .catch(function (err) {
          LoadingOverlay.hide();
        });
    }
  },
  "keyup #tblAccount_filter input": function (event) {
    if (event.keyCode === 13) {
      $(".btnRefreshAccount").trigger("click");
    }
  },
  "change #sltStatus": function () {
    let status = $("#sltStatus").find(":selected").val();
    if (status === "newstatus") {
      $("#statusModal").modal();
    }
  },
  "click .btnSaveStatus": function () {
    playSaveAudio();
    let clientService = new SalesBoardService();
    setTimeout(function(){
    $(".fullScreenSpin").css("display", "inline-block");

    let status = $("#status").val();
    let leadData = {
      type: "TLeadStatusType",
      fields: {
        TypeName: status,
        KeyValue: status,
      },
    };

    if (status !== "") {
      clientService
        .saveLeadStatus(leadData)
        .then(function (objDetails) {
          sideBarService
            .getAllLeadStatus()
            .then(function (dataUpdate) {
              addVS1Data("TLeadStatusType", JSON.stringify(dataUpdate))
                .then(function (datareturn) {
                  LoadingOverlay.hide();
                  let id = $(".printID").attr("id");
                  if (id !== "") {
                    window.open("/creditcard?id=" + id);
                  } else {
                    window.open("/creditcard");
                  }
                })
                .catch(function (err) {});
            })
            .catch(function (err) {
              window.open("/creditcard", "_self");
            });
        })
        .catch(function (err) {
          LoadingOverlay.hide();

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
    } else {
      LoadingOverlay.hide();
      swal({
        title: "Please Enter Status",
        text: "Status field cannot be empty",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Try Again",
      }).then((result) => {
        if (result.value) {
        } else if (result.dismiss === "cancel") {
        }
      });
    }
  }, delayTimeAfterSound);
  },
  "blur .lineMemo": function (event) {
    var targetID = $(event.target).closest("tr").attr("id");

    $("#" + targetID + " #lineMemo").text(
      $("#" + targetID + " .lineMemo").text()
    );
  },
  "blur .colAmount": function (event) {
    let templateObject = Template.instance();
    let taxcodeList = templateObject.taxraterecords.get();
    let utilityService = new UtilityService();
    var targetID = $(event.target).closest("tr").attr("id");
    if (!isNaN($(event.target).val())) {
      let inputUnitPrice = parseFloat($(event.target).val()) || 0;
      $(event.target).val(
        utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
      );
    } else {
      let inputUnitPrice =
        Number(
          $(event.target)
            .val()
            .replace(/[^0-9.-]+/g, "")
        ) || 0;

      $(event.target).val(
        utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
      );
    }
    let $tblrows = $("#tblCreditLine tbody tr");

    let $printrows = $(".credit_print tbody tr");

    if (
      $(".printID").attr("id") !== undefined ||
      $(".printID").attr("id") !== ""
    ) {
      $("#" + targetID + " #lineAmount").text(
        $("#" + targetID + " .colAmount").val()
      );
      $("#" + targetID + " #lineTaxCode").text(
        $("#" + targetID + " .lineTaxCode").text()
      );
    }

    let lineAmount = 0;
    let subGrandTotal = 0;
    let taxGrandTotal = 0;
    let taxGrandTotalPrint = 0;

    $tblrows.each(function (index) {
      var $tblrow = $(this);
      var amount = $tblrow.find(".colAmount").val() || "0";
      var taxcode = $tblrow.find(".lineTaxCode").text() || 0;
      var taxrateamount = 0;
      if (taxcodeList) {
        for (var i = 0; i < taxcodeList.length; i++) {
          if (taxcodeList[i].codename === taxcode) {
            taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
          }
        }
      }

      var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
      var taxTotal =
        parseFloat(amount.replace(/[^0-9.-]+/g, "")) *
        parseFloat(taxrateamount);
      $tblrow
        .find(".lineTaxAmount")
        .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
      if (!isNaN(subTotal)) {
        $tblrow
          .find(".colAmount")
          .val(utilityService.modifynegativeCurrencyFormat(subTotal));
        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
        document.getElementById("subtotal_total").innerHTML =
          utilityService.modifynegativeCurrencyFormat(subGrandTotal);
      }

      if (!isNaN(taxTotal)) {
        taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
        document.getElementById("subtotal_tax").innerHTML =
          utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
      }

      if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
        let GrandTotal = parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
        document.getElementById("grandTotal").innerHTML =
          utilityService.modifynegativeCurrencyFormat(GrandTotal);
        document.getElementById("balanceDue").innerHTML =
          utilityService.modifynegativeCurrencyFormat(GrandTotal);
        document.getElementById("totalBalanceDue").innerHTML =
          utilityService.modifynegativeCurrencyFormat(GrandTotal);
      }
    });

    if (
      $(".printID").attr("id") !== undefined ||
      $(".printID").attr("id") !== ""
    ) {
      $printrows.each(function (index) {
        var $printrows = $(this);
        var amount = $printrows.find("#lineAmount").text() || "0";
        var taxcode = $printrows.find("#lineTaxCode").text() || 0;

        var taxrateamount = 0;
        if (taxcodeList) {
          for (var i = 0; i < taxcodeList.length; i++) {
            if (taxcodeList[i].codename === taxcode) {
              taxrateamount =
                taxcodeList[i].coderate.replace("%", "") / 100 || 0;
            }
          }
        }

        var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
        var taxTotal =
          parseFloat(amount.replace(/[^0-9.-]+/g, "")) *
          parseFloat(taxrateamount);
        $printrows
          .find("#lineTaxAmount")
          .text(utilityService.modifynegativeCurrencyFormat(taxTotal));

        if (!isNaN(subTotal)) {
          $printrows
            .find("#lineAmt")
            .text(utilityService.modifynegativeCurrencyFormat(subTotal));
          subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
          document.getElementById("subtotal_totalPrint").innerHTML =
            $("#subtotal_total").text();
        }

        if (!isNaN(taxTotal)) {
          taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
        }
        if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
          let GrandTotal =
            parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
          document.getElementById("grandTotalPrint").innerHTML =
            $("#grandTotal").text();
          document.getElementById("totalBalanceDuePrint").innerHTML =
            $("#totalBalanceDue").text();
        }
      });
    }
  },
  "click #btnCustomFileds": function (event) {
    var x = document.getElementById("divCustomFields");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  },
  "click .lineAccountName": function (event) {
    $("#tblCreditLine tbody tr .lineAccountName").attr("data-toggle", "modal");
    $("#tblCreditLine tbody tr .lineAccountName").attr(
      "data-target",
      "#accountListModal"
    );
    var targetID = $(event.target).closest("tr").attr("id");
    $("#selectLineID").val(targetID);

    setTimeout(function () {
      $("#tblAccount_filter .form-control-sm").focus();
    }, 500);
  },
  "click #accountListModal #refreshpagelist": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    Meteor._reload.reload();
    templateObject.getAllAccountss();
  },
  "click .lineTaxRate": function (event) {
    $("#tblCreditLine tbody tr .lineTaxRate").attr("data-toggle", "modal");
    $("#tblCreditLine tbody tr .lineTaxRate").attr(
      "data-target",
      "#taxRateListModal"
    );
    var targetID = $(event.target).closest("tr").attr("id");
    $("#selectLineID").val(targetID);
  },
  "click .lineTaxCode": function (event) {
    $("#tblCreditLine tbody tr .lineTaxCode").attr("data-toggle", "modal");
    $("#tblCreditLine tbody tr .lineTaxCode").attr(
      "data-target",
      "#taxRateListModal"
    );
    var targetID = $(event.target).closest("tr").attr("id");
    $("#selectLineID").val(targetID);
  },
  "keydown .lineQty, keydown .lineUnitPrice, keydown .lineAmount": function (
    event
  ) {
    if (
      $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      (event.keyCode === 65 &&
        (event.ctrlKey === true || event.metaKey === true)) ||
      (event.keyCode >= 35 && event.keyCode <= 40)
    ) {
      return;
    }

    if (event.shiftKey === true) {
      event.preventDefault();
    }

    if (
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode === 8 ||
      event.keyCode === 9 ||
      event.keyCode === 37 ||
      event.keyCode === 39 ||
      event.keyCode === 46 ||
      event.keyCode === 190 ||
      event.keyCode === 189 ||
      event.keyCode === 109
    ) {
    } else {
      event.preventDefault();
    }
  },
  "click .chkAccountName": function (event) {
    if ($(event.target).is(":checked")) {
      $(".colAccountName").css("display", "table-cell");
      $(".colAccountName").css("padding", ".75rem");
      $(".colAccountName").css("vertical-align", "top");
    } else {
      $(".colAccountName").css("display", "none");
    }
  },
  "click .chkMemo": function (event) {
    if ($(event.target).is(":checked")) {
      $(".colMemo").css("display", "table-cell");
      $(".colMemo").css("padding", ".75rem");
      $(".colMemo").css("vertical-align", "top");
    } else {
      $(".colMemo").css("display", "none");
    }
  },
  "click .chkAmount": function (event) {
    if ($(event.target).is(":checked")) {
      $(".colAmount").css("display", "table-cell");
      $(".colAmount").css("padding", ".75rem");
      $(".colAmount").css("vertical-align", "top");
    } else {
      $(".colAmount").css("display", "none");
    }
  },
  "click .chkTaxRate": function (event) {
    if ($(event.target).is(":checked")) {
      $(".colTaxRate").css("display", "table-cell");
      $(".colTaxRate").css("padding", ".75rem");
      $(".colTaxRate").css("vertical-align", "top");
    } else {
      $(".colTaxRate").css("display", "none");
    }
  },
  "click .chkTaxCode": function (event) {
    if ($(event.target).is(":checked")) {
      $(".colTaxCode").css("display", "table-cell");
      $(".colTaxCode").css("padding", ".75rem");
      $(".colTaxCode").css("vertical-align", "top");
    } else {
      $(".colTaxCode").css("display", "none");
    }
  },
  "click .chkCustomField1": function (event) {
    if ($(event.target).is(":checked")) {
      $(".colCustomField1").css("display", "table-cell");
      $(".colCustomField1").css("padding", ".75rem");
      $(".colCustomField1").css("vertical-align", "top");
    } else {
      $(".colCustomField1").css("display", "none");
    }
  },
  "click .chkCustomField2": function (event) {
    if ($(event.target).is(":checked")) {
      $(".colCustomField2").css("display", "table-cell");
      $(".colCustomField2").css("padding", ".75rem");
      $(".colCustomField2").css("vertical-align", "top");
    } else {
      $(".colCustomField2").css("display", "none");
    }
  },
  "change .rngRangeAccountName": function (event) {
    let range = $(event.target).val();
    $(".spWidthAccountName").html(range + "%");
    $(".colAccountName").css("width", range + "%");
  },
  "change .rngRangeMemo": function (event) {
    let range = $(event.target).val();
    $(".spWidthMemo").html(range + "%");
    $(".colMemo").css("width", range + "%");
  },
  "change .rngRangeAmount": function (event) {
    let range = $(event.target).val();
    $(".spWidthAmount").html(range + "%");
    $(".colAmount").css("width", range + "%");
  },
  "change .rngRangeTaxRate": function (event) {
    let range = $(event.target).val();
    $(".spWidthTaxRate").html(range + "%");
    $(".colTaxRate").css("width", range + "%");
  },
  "change .rngRangeTaxCode": function (event) {
    let range = $(event.target).val();
    $(".spWidthTaxCode").html(range + "%");
    $(".colTaxCode").css("width", range + "%");
  },
  "change .rngRangeCustomField1": function (event) {
    let range = $(event.target).val();
    $(".spWidthCustomField1").html(range + "%");
    $(".colCustomField1").css("width", range + "%");
  },
  "change .rngRangeCustomField2": function (event) {
    let range = $(event.target).val();
    $(".spWidthCustomField2").html(range + "%");
    $(".colCustomField2").css("width", range + "%");
  },
  "blur .divcolumnAccount": function (event) {
    let columData = $(event.target).html();
    let columHeaderUpdate = $(event.target).attr("valueupdate");
    $("" + columHeaderUpdate + "").html(columData);
  },
  "click .btnSaveGridSettings": function (event) {
    playSaveAudio();
    setTimeout(function(){
    let lineItems = [];

    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumnAccount").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass =
        $tblrow.find(".divcolumnAccount").attr("valueupdate") || "";
      var colHidden = false;
      colHidden = !$tblrow.find(".custom-control-input").is(":checked");
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
          PrefName: "tblCreditLine",
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
                PrefGroup: "purchaseform",
                PrefName: "tblCreditLine",
                published: true,
                customFields: lineItems,
                updatedAt: new Date(),
              },
            },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
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
              PrefName: "tblCreditLine",
              published: true,
              customFields: lineItems,
              createdAt: new Date(),
            },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
              }
            }
          );
        }
      }
    }
    $("#myModal2").modal("toggle");
  }, delayTimeAfterSound);
  },
  "click .btnResetGridSettings": function (event) {
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
          PrefName: "tblCreditLine",
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
  "click .btnResetSettings": function (event) {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: localStorage.getItem("mycloudLogonID"),
      clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "creditcard",
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
    var validExcelExtensions = ["xlsx", "xls"];

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
      complete: function(results) {
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
                  setTimeout(function() {
                      // $('#importModal').modal('toggle');
                      Meteor._reload.reload();
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

                              // AssetAccount:results.data[i+1][0],
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
                                  .then(function(data) {
                                      //$('.fullScreenSpin').css('display','none');
                                      Meteor._reload.reload();
                                  })
                                  .catch(function(err) {
                                      //$('.fullScreenSpin').css('display','none');
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
                                              Meteor._reload.reload();
                                          }
                                      });
                                  });
                          }
                      }
                  }
              } else {
                  $(".fullScreenSpin").css("display", "none");
                  // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                  swal(
                      "Invalid Data Mapping fields ",
                      "Please check that you are importing the correct file with the correct column headers.",
                      "error"
                  );
              }
          } else {
              $(".fullScreenSpin").css("display", "none");
              // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
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
    var validExcelExtensions = ["xlsx", "xls"];

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
      complete: function(results) {
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
                  setTimeout(function() {
                      // $('#importModal').modal('toggle');
                      //Meteor._reload.reload();
                      sideBarService
                          .getAccountListVS1()
                          .then(function(dataReload) {
                              addVS1Data("TAccountVS1", JSON.stringify(dataReload))
                                  .then(function(datareturn) {
                                      Meteor._reload.reload();
                                  })
                                  .catch(function(err) {
                                      Meteor._reload.reload();
                                  });
                          })
                          .catch(function(err) {
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
                                  .then(function(data) {})
                                  .catch(function(err) {
                                      //$('.fullScreenSpin').css('display','none');
                                      swal({
                                          title: "Oooops...",
                                          text: err,
                                          type: "error",
                                          showCancelButton: false,
                                          confirmButtonText: "Try Again",
                                      }).then((result) => {
                                          if (result.value) {
                                              Meteor._reload.reload();
                                          } else if (result.dismiss === "cancel") {}
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
  // Customer Import functions
  "click .btnUploadFile-customer": function (event) {
    $("#attachment-upload-customer").val("");
    $(".file-name").text("");
    $("#attachment-upload-customer").trigger("click");
  },
  "change #attachment-upload-customer": function (e) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload-customer")[0].files[0]["name"];
    var fileExtension = filename.split(".").pop().toLowerCase();
    var validExtensions = ["csv", "txt", "xlsx", "xls"];
    var validCSVExtensions = ["csv", "txt"];
    var validExcelExtensions = ["xlsx", "xls"];

    if (validExtensions.indexOf(fileExtension) == -1) {
      swal(
        "Invalid Format",
        "formats allowed are :" + validExtensions.join(", "),
        "error"
      );
      $(".file-name").text("");
      $(".btnCustomerImport").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnCustomerImport").removeAttr("disabled");
      } else {
        $(".btnCustomerImport").Attr("disabled");
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
        $(".btnCustomerImport").removeAttr("disabled");
      } else {
        $(".btnCustomerImport").Attr("disabled");
      }
    }
  },
  "click .btnCustomerImport": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    Papa.parse(templateObject.selectedFile.get(), {
      complete: async function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "Company" &&
            results.data[0][1] == "First Name" &&
            results.data[0][2] == "Last Name" &&
            results.data[0][3] == "Phone" &&
            results.data[0][4] == "Mobile" &&
            results.data[0][5] == "Email" &&
            results.data[0][6] == "Skype" &&
            results.data[0][7] == "Street" &&
            results.data[0][8] == "City/Suburb" &&
            results.data[0][9] == "State" &&
            results.data[0][10] == "Post Code" &&
            results.data[0][11] == "Country" &&
            results.data[0][12] == "Tax Code"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function(){
              Meteor._reload.reload();
              $('.fullScreenSpin').css('display','none');
            },parseInt(dataLength));
            for (let i = 0; i < results.data.length - 1; i++) {
              let objDetails = {
                type: "TCustomerEx",
                fields: {
                  ClientName: results.data[i + 1][0]|| '',
                  FirstName: results.data[i + 1][1] || "",
                  LastName: results.data[i + 1][2] || "",
                  Phone: results.data[i + 1][3] || '',
                  Mobile: results.data[i + 1][4] || '',
                  Email: results.data[i + 1][5] || "",
                  SkypeName: results.data[i + 1][6] || "",
                  Street2: results.data[i + 1][7] || "",
                  Street2: results.data[i + 1][8] || "",
                  Suburb: results.data[i + 1][8] || "",
                  State: results.data[i + 1][9] || "",
                  PostCode: results.data[i + 1][10] || "",
                  Country: results.data[i + 1][11] || "",
                  TaxCodeName: results.data[i + 1][12] || "",
                  PublishOnVS1: true,
                  Active: true,
                },
              };

              if(results.data[i+1][0]){
                if(results.data[i+1][0] !== "") {
                    contactService.saveCustomer(objDetails).then(function (data) {
                        //$('.fullScreenSpin').css('display','none');
                        //Meteor._reload.reload();
                    }).catch(function (err) {
                        //$('.fullScreenSpin').css('display','none');
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {
                              Meteor._reload.reload();
                            }
                        });
                    });
                }
              }
            }
            LoadingOverlay.hide();
          } else {
            LoadingOverlay.hide();
            swal(
              "Invalid Data Mapping fields ",
              "Please check that you are importing the correct file with the correct column headers.",
              "error"
            );
          }
        } else {
          LoadingOverlay.hide();
          swal(
            "Invalid Data Mapping fields ",
            "Please check that you are importing the correct file with the correct column headers.",
            "error"
          );
        }
      },
    });
  },
  // Supplier import
  "click .new_attachment_btn_supplier": function (event) {
    $("#attachment-upload-supplier").val("");
    $(".file-name").text("");
    $("#attachment-upload-supplier").trigger("click");
  },

  "change #attachment-upload-supplier": async function (e) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload-supplier")[0].files[0]["name"];
    var fileExtension = filename.split(".").pop().toLowerCase();
    var validExtensions = ["csv", "txt", "xlsx", "xls"];
    var validCSVExtensions = ["csv", "txt"];
    var validExcelExtensions = ["xlsx", "xls"];

    if (validExtensions.indexOf(fileExtension) == -1) {
      swal(
        "Invalid Format",
        "formats allowed are :" + validExtensions.join(", "),
        "error"
      );
      $(".file-name").text("");
      $(".btnSupplierImport").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnSupplierImport").removeAttr("disabled");
      } else {
        $(".btnSupplierImport").Attr("disabled");
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
        $(".btnSupplierImport").removeAttr("disabled");
      } else {
        $(".btnSupplierImport").Attr("disabled");
      }
    }
  },
  'click .btnSupplierImport': function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();
    let objDetails;
    let firstName = '';
    let lastName = '';
    let taxCode = '';
    Papa.parse(templateObject.selectedFile.get(), {
        complete: function(results) {
            if (results.data.length > 0) {
                if ((results.data[0][0] == "Company") && (results.data[0][1] == "Phone") &&
                    (results.data[0][2] == "AR Balance") && (results.data[0][3] == "Credit balance") &&
                    (results.data[0][4] == "Balance") && (results.data[0][5] == "Credit limit") &&
                    (results.data[0][6] == "Order balance") && (results.data[0][7] == "Country") &&
                    (results.data[0][8] == "Notes")) {

                    let dataLength = results.data.length * 500;
                    setTimeout(function() {
                        window.open('/supplierlist?success=true', '_self');
                        $('.fullScreenSpin').css('display', 'none');
                    }, parseInt(dataLength));

                    for (let i = 0; i < results.data.length - 1; i++) {

                        objDetails = {
                            type: "TSupplier",
                            fields: {
                                ClientName: results.data[i + 1][0],
                                Phone: results.data[i + 1][1],
                                APBalance: results.data[i + 1][2],
                                ExcessAmount: results.data[i + 1][3],
                                Balance: results.data[i + 1][4],
                                SupplierCreditLimit: results.data[i + 1][4],
                                Country: results.data[i + 1][6],
                                Notes: results.data[i + 1][7],
                                PublishOnVS1: true
                            }
                        };
                        if (results.data[i + 1][1]) {
                            if (results.data[i + 1][1] !== "") {
                                contactService.saveSupplier(objDetails).then(function(data) {
                                    //$('.fullScreenSpin').css('display','none');
                                    //  Meteor._reload.reload();
                                }).catch(function(err) {
                                    //$('.fullScreenSpin').css('display','none');
                                    swal({ title: 'Oooops...', text: err, type: 'error', showCancelButton: false, confirmButtonText: 'Try Again' }).then((result) => {
                                        if (result.value) {
                                            window.open('/supplierlist?success=true', '_self');
                                        } else if (result.dismiss === 'cancel') {
                                            window.open('/supplierlist?success=true', '_self');
                                        }
                                    });
                                });
                            }
                        }
                    }

                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }
            } else {
                $('.fullScreenSpin').css('display', 'none');
                swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
            }


        }
    });
  },
  // Inventory import
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
        let tdtaxrate = $("#" + lineID + " .lineTaxRate").text();
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

      let saleCustField1 = $("#edtSaleCustField1").val();
      let saleCustField2 = $("#edtSaleCustField2").val();
      var url = FlowRouter.current().path;
      var getso_id = url.split("?id=");
      var currentCredit = getso_id[getso_id.length - 1];
      let uploadedItems = templateObject.uploadedFiles.get();
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
              .then(function (supplierEmailData) {});
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
    setTimeout(function(){
    const type = $(e.currentTarget).attr("data-target");
    if (type) {
      LoadingOverlay.show();
      jQuery(`${type} .dt-buttons .btntabletopdf`).click();
      LoadingOverlay.hide();
    }
  }, delayTimeAfterSound);
  },

  // STEP 6
  "click .setup-wizard .setup-step-6 .btnRefresh": (e, template) => {
    template.loadAccountList();
  },

  "click .setup-step-6 .templateDownload": (e, templateObject) => {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleAccounts" + ".csv";

    const customers = templateObject.accountList.get();
    rows.push([
      "Account Name",
      "Description",
      "Account No",
      "Type",
      "Balance",
      "Tax Code",
      "Bank Account Name",
      "BSB",
      "Bank Account No",
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.accountname,
        customer.description,
        customer.accountnumber,
        customer.accounttypename,
        customer.balance,
        customer.taxcode,
        customer.bankaccountname,
        customer.bsb,
        customer.bankaccountnumber
      ]);
    });


    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .setup-step-6 .templateDownloadXLSX": (e, templateObject) => {

    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleAccounts" + ".xls";

    const customers = templateObject.accountList.get();
    rows.push([
      "Account Name",
      "Description",
      "Account No",
      "Type",
      "Balance",
      "Tax Code",
      "Bank Account Name",
      "BSB",
      "Bank Account No",
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.accountname,
        customer.description,
        customer.accountnumber,
        customer.accounttypename,
        customer.balance,
        customer.taxcode,
        customer.bankaccountname,
        customer.bsb,
        customer.bankaccountnumber
      ]);
    });
    utilityService.exportToCsv(rows, filename, "xls");
  },

  // TODO: Step 7
  "click #btnNewCustomer": (e) => {
    const target = $(e.currentTarget).attr("data-toggle");
    $(target).modal("toggle");
  },
  "click #tblCustomerlist tbody tr": (e) => {
    const tr = $(e.currentTarget);
    var listData = tr.attr("id");
    var transactiontype = tr.attr("isjob");
    var url = FlowRouter.current().path;
  },
  "click .setup-step-7 .btnRefresh": (e) => {
    const templateObject = Template.instance();
    templateObject.loadDefaultCustomer(true);
    $(".modal.show").modal("hide");
  },

  "click .setup-step-7 .templateDownload": (e, templateObject) => {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleCustomers" + ".csv";

    const customers = templateObject.customerList.get();

    rows.push([
      "Company",
      "First Name",
      "Last Name",
      "Phone",
      "Mobile",
      "Email",
      "Skype",
      "Street",
      "City/Suburb",
      "State",
      "Post Code",
      "Country",
      "Tax Code"
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.company,
        customer.firstname,
        customer.lastname,
        customer.phone,
        customer.mobile,
        customer.skype,
        customer.street,
        customer.city,
        customer.state,
        customer.postcode,
        customer.country,
        customer.taxcode,
      ]);
    });
    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .setup-step-7 .templateDownloadXLSX": (e, templateObject) => {

    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleCustomers" + ".xls";

    const customers = templateObject.customerList.get();
    rows.push([
      "Company",
      "First Name",
      "Last Name",
      "Phone",
      "Mobile",
      "Email",
      "Skype",
      "Street",
      "City/Suburb",
      "State",
      "Post Code",
      "Country",
      "Tax Code"
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.company,
        customer.firstname,
        customer.lastname,
        customer.phone,
        customer.mobile,
        customer.skype,
        customer.street,
        customer.city,
        customer.state,
        customer.postcode,
        customer.country,
        customer.taxcode,
      ]);
    });
    utilityService.exportToCsv(rows, filename, "xls");
  },

  // TODO: Step 8
  "click #btnNewSupplier": (e) => {
    $($(e.currentTarget).attr("data-toggle")).modal("toggle");
  },
  "click #tblSupplierlist tbody tr": (e) => {},
  "click .setup-step-8 .btnRefresh": (e) => {
    const templateObject = Template.instance();
    templateObject.loadSuppliers(true);
    $(".modal.show").modal("hide");
  },

  "click .setup-step-8 .templateDownload": (e, templateObject) => {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleSupplier" + ".csv";

    const customers = templateObject.supplierList.get();

    rows.push([
      "Company",
      "Phone",
      "AR Balance",
      "Credit balance",
      "Balance",
      "Credit limit",
      "Order balance",
      "Country",
      "Notes",
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.company,
        customer.phone,
        customer.arbalance,
        customer.creditbalance,
        customer.balance,
        customer.creditlimit,
        customer.salesorderbalance,
        customer.country,
        customer.notes
      ]);
    });


    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .setup-step-8 .templateDownloadXLSX": (e, templateObject) => {

    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleSupplier" + ".xls";

    const customers = templateObject.supplierList.get();
    rows.push([
      "Company",
      "Phone",
      "AR Balance",
      "Credit balance",
      "Balance",
      "Credit limit",
      "Order balance",
      "Country",
      "Notes",
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.company,
        customer.phone,
        customer.arbalance,
        customer.creditbalance,
        customer.balance,
        customer.creditlimit,
        customer.salesorderbalance,
        customer.country,
        customer.notes
      ]);
    });
    utilityService.exportToCsv(rows, filename, "xls");
  },
  // TODO: Step 9
  "click .setup-step-9 .btnRefresh": (e) => {
    const templateObject = Template.instance();
    templateObject.loadInventory(true);
    $(".modal.show").modal("hide");
  },
  "click .setup-step-9 .templateDownload": function() {
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
  "click .setup-step-9 .templateDownloadXLSX": function(e) {
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

      //$('.lblCostInc').css('width','10.1%');
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
      //$('.lblCostEx').css('width','10%');
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

      //$('.lblPriceInc').css('width','10.1%');
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

      //$('.lblPriceEx').css('width','10%');
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
  datatablerecords: () => {
    return Template.instance()
      .datatablerecords.get()
      .sort(function (a, b) {
        if (a.codename == "NA") {
          return 1;
        } else if (b.codename == "NA") {
          return -1;
        }
        return a.codename.toUpperCase() > b.codename.toUpperCase() ? 1 : -1;
        // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
      });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  
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
  // Step 3 helpers
 
  // Step 4 helpers
  termdatatablerecords: () => {
    return Template.instance()
      .termdatatablerecords.get()
      .sort(function (a, b) {
        if (a.termname == "NA") {
          return 1;
        } else if (b.termname == "NA") {
          return -1;
        }
        return a.termname.toUpperCase() > b.termname.toUpperCase() ? 1 : -1;
      });
  },
  termtableheaderrecords: () => {
    return Template.instance().termtableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "termsList",
    });
  },
  include7Days: () => {
    return Template.instance().include7Days.get();
  },
  include30Days: () => {
    return Template.instance().include30Days.get();
  },
  includeCOD: () => {
    return Template.instance().includeCOD.get();
  },
  includeEOM: () => {
    return Template.instance().includeEOM.get();
  },
  includeEOMPlus: () => {
    return Template.instance().includeEOMPlus.get();
  },
  includeSalesDefault: () => {
    return Template.instance().includeSalesDefault.get();
  },
  includePurchaseDefault: () => {
    return Template.instance().includePurchaseDefault.get();
  },
  currentEmployees: () => {
    return Template.instance().currentEmployees.get();
  },
  employeetableheaderrecords: () => {
    return Template.instance().employeetableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblEmployeelist",
    });
  },
  editableEmployee: () => {
    return Template.instance().editableEmployee.get();
  },

  // Step 6 helpers
  bsbRegionName: () => {
    let bsbname = "Branch Code";
    if (localStorage.getItem("ERPLoggedCountry") === "Australia") {
      bsbname = "BSB";
    }
    return bsbname;
  },
  accountTypes: () => {
    return Template.instance()
      .accountTypes.get()
      .sort(function (a, b) {
        if (a.description === "NA") {
          return 1;
        } else if (b.description === "NA") {
          return -1;
        }
        return a.description.toUpperCase() > b.description.toUpperCase()
          ? 1
          : -1;
      });
  },
  accountList: () => {
    return Template.instance().accountList.get();
  },
  creditrecord: () => {
    return Template.instance().creditrecord.get();
  },
  viarecords: () => {
    return Template.instance()
      .viarecords.get()
      .sort(function (a, b) {
        if (a.shippingmethod === "NA") {
          return 1;
        } else if (b.shippingmethod === "NA") {
          return -1;
        }
        return a.shippingmethod.toUpperCase() > b.shippingmethod.toUpperCase()
          ? 1
          : -1;
      });
  },
  termrecords: () => {
    return Template.instance()
      .termrecords.get()
      .sort(function (a, b) {
        if (a.termsname === "NA") {
          return 1;
        } else if (b.termsname === "NA") {
          return -1;
        }
        return a.termsname.toUpperCase() > b.termsname.toUpperCase() ? 1 : -1;
      });
  },
  purchaseCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "creditcard",
    });
  },
  purchaseCloudGridPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblCreditLine",
    });
  },
  uploadedFiles: () => {
    return Template.instance().uploadedFiles.get();
  },
  attachmentCount: () => {
    return Template.instance().attachmentCount.get();
  },
  uploadedFile: () => {
    return Template.instance().uploadedFile.get();
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

  // Step 7 helpers

  customerList: () => {
    return Template.instance().customerList.get().sort(function (a, b) {
      if (a.company === "NA") {
        return 1;
      } else if (b.company === "NA") {
        return -1;
      }
      return a.company.toUpperCase() > b.company.toUpperCase()
        ? 1
        : -1;
    });
  },
  // customerListHeaders: () => {
  //   return Template.instance().customerListHeaders.get();
  // },
  // Step 8 helpers
  supplierList: () => {
    return Template.instance().supplierList.get();
  },
  // supplierListHeaders: () => {
  //   return Template.instance().customerListHeaders.get();
  // },

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