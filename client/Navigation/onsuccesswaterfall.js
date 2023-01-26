import { Template } from 'meteor/templating';

import { AccessLevelService } from '../js/accesslevel-service.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { ProductService } from "../product/product-service.js";
import { UtilityService } from "../utility-service.js";
import { SideBarService } from '../js/sidebar-service.js';
import { OrganisationService } from "../js/organisation-service";

import '../lib/global/indexdbstorage.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './onsuccesswaterfall.html';

const productService = new ProductService();
const sideBarService = new SideBarService();
const organisationService = new OrganisationService();

Template.onsuccesswaterfall.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.sideBarPositionClass = new ReactiveVar();
  templateObject.sideBarPositionClass.set('top');
  templateObject.includeDashboard = new ReactiveVar();
  templateObject.includeDashboard.set(false);
  templateObject.includeMain = new ReactiveVar();
  templateObject.includeMain.set(false);
  templateObject.includeInventory = new ReactiveVar();
  templateObject.includeInventory.set(false);
  templateObject.includeManufacturing = new ReactiveVar();
  templateObject.includeManufacturing.set(false);
  templateObject.includeAccessLevels = new ReactiveVar();
  templateObject.includeAccessLevels.set(false);
  templateObject.includeShipping = new ReactiveVar();
  templateObject.includeShipping.set(false);
  templateObject.includeStockTransfer = new ReactiveVar();
  templateObject.includeStockTransfer.set(false);
  templateObject.includeStockAdjustment = new ReactiveVar();
  templateObject.includeStockAdjustment.set(false);
  templateObject.includeStockTake = new ReactiveVar();
  templateObject.includeStockTake.set(false);
  templateObject.includeSales = new ReactiveVar();
  templateObject.includeSales.set(false);
  templateObject.includeExpenseClaims = new ReactiveVar();
  templateObject.includeExpenseClaims.set(false);
  templateObject.includeFixedAssets = new ReactiveVar();
  templateObject.includeFixedAssets.set(false);
  templateObject.includePurchases = new ReactiveVar();
  templateObject.includePurchases.set(false);

  templateObject.includePayments = new ReactiveVar();
  templateObject.includePayments.set(false);
  templateObject.includeContacts = new ReactiveVar();
  templateObject.includeContacts.set(false);
  templateObject.includeAccounts = new ReactiveVar();
  templateObject.includeAccounts.set(false);
  templateObject.includeReports = new ReactiveVar();
  templateObject.includeReports.set(false);
  templateObject.includeSettings = new ReactiveVar();
  templateObject.includeSettings.set(false);

  templateObject.includeSeedToSale = new ReactiveVar();
  templateObject.includeSeedToSale.set(false);
  templateObject.includeBanking = new ReactiveVar();
  templateObject.includeBanking.set(false);
  templateObject.includePayroll = new ReactiveVar();
  templateObject.includePayroll.set(false);

  templateObject.includePayrollClockOnOffOnly = new ReactiveVar();
  templateObject.includePayrollClockOnOffOnly.set(false);

  templateObject.includeTimesheetEntry = new ReactiveVar();
  templateObject.includeTimesheetEntry.set(false);
  templateObject.includeClockOnOff = new ReactiveVar();
  templateObject.includeClockOnOff.set(false);

  templateObject.isCloudSidePanelMenu = new ReactiveVar();
  templateObject.isCloudSidePanelMenu.set(false);
  templateObject.isCloudTopPanelMenu = new ReactiveVar();
  templateObject.isCloudTopPanelMenu.set(false);

  templateObject.includeAppointmentScheduling = new ReactiveVar();
  templateObject.includeAppointmentScheduling.set(false);

  templateObject.isBalanceSheet = new ReactiveVar();
  templateObject.isBalanceSheet.set(false);
  templateObject.isProfitLoss = new ReactiveVar();
  templateObject.isProfitLoss.set(false);
  templateObject.isAgedReceivables = new ReactiveVar();
  templateObject.isAgedReceivables.set(false);
  templateObject.isAgedReceivablesSummary = new ReactiveVar();
  templateObject.isAgedReceivablesSummary.set(false);
  templateObject.isProductSalesReport = new ReactiveVar();
  templateObject.isProductSalesReport.set(false);
  templateObject.isSalesReport = new ReactiveVar();
  templateObject.isSalesReport.set(false);
  templateObject.isSalesSummaryReport = new ReactiveVar();
  templateObject.isSalesSummaryReport.set(false);
  templateObject.isGeneralLedger = new ReactiveVar();
  templateObject.isGeneralLedger.set(false);
  templateObject.isTaxSummaryReport = new ReactiveVar();
  templateObject.isTaxSummaryReport.set(false);
  templateObject.isTrialBalance = new ReactiveVar();
  templateObject.isTrialBalance.set(false);
  templateObject.is1099Transaction = new ReactiveVar();
  templateObject.is1099Transaction.set(false);
  templateObject.isAgedPayables = new ReactiveVar();
  templateObject.isAgedPayables.set(false);
  templateObject.isAgedPayablesSummary = new ReactiveVar();
  templateObject.isAgedPayablesSummary.set(false);
  templateObject.isPurchaseReport = new ReactiveVar();
  templateObject.isPurchaseReport.set(false);
  templateObject.isPurchaseSummaryReport = new ReactiveVar();
  templateObject.isPurchaseSummaryReport.set(false);
  templateObject.isPrintStatement = new ReactiveVar();
  templateObject.isPrintStatement.set(false);
  templateObject.isSNTrackChecked = new ReactiveVar();
  templateObject.isSNTrackChecked.set(false);

  templateObject.isCRM = new ReactiveVar();
  templateObject.isCRM.set(false);
  templateObject.isProductList = new ReactiveVar();
  templateObject.isProductList.set(false);
  templateObject.isNewProduct = new ReactiveVar();
  templateObject.isNewProduct.set(false);
  templateObject.isNewStockTransfer = new ReactiveVar();
  templateObject.isNewStockTransfer.set(false);
  templateObject.isExportProduct = new ReactiveVar();
  templateObject.isExportProduct.set(false);
  templateObject.isImportProduct = new ReactiveVar();
  templateObject.isImportProduct.set(false);
  templateObject.isStockonHandDemandChart = new ReactiveVar();
  templateObject.isStockonHandDemandChart.set(false);
  templateObject.isAppointmentSMS = new ReactiveVar();
  templateObject.isAppointmentSMS.set(false);

  templateObject.isSerialNumberList = new ReactiveVar();
  templateObject.isSerialNumberList.set(false);

  $(document).ready(function () {
    var erpGet = erpDb();
    var LoggedDB = erpGet.ERPDatabase;
    var loc = FlowRouter.current().path;
  });
});
Template.onsuccesswaterfall.onRendered(function () {
  var countObjectTimes = 0;
  let allDataToLoad = 78;
  let progressPercentage = 0;
  let templateObject = Template.instance();

  let isDashboard = localStorage.getItem('CloudDashboardModule');
  let isMain = localStorage.getItem('CloudMainModule');
  let isInventory = localStorage.getItem('CloudInventoryModule');
  let isManufacturing = localStorage.getItem('CloudManufacturingModule');
  let isAccessLevels = localStorage.getItem('CloudAccessLevelsModule');
  let isShipping = localStorage.getItem('CloudShippingModule');
  let isStockTransfer = localStorage.getItem('CloudStockTransferModule');
  let isStockAdjustment = localStorage.getItem('CloudStockAdjustmentModule');
  let isStockTake = localStorage.getItem('CloudStockTakeModule');
  let isSales = localStorage.getItem('CloudSalesModule');
  let isPurchases = localStorage.getItem('CloudPurchasesModule');
  let isExpenseClaims = localStorage.getItem('CloudExpenseClaimsModule');
  let isFixedAssets = localStorage.getItem('CloudFixedAssetsModule');

  let isPayments = localStorage.getItem('CloudPaymentsModule');
  let isContacts = localStorage.getItem('CloudContactsModule');

  let isAccounts = localStorage.getItem('CloudAccountsModule');
  let isReports = localStorage.getItem('CloudReportsModule');
  let isSettings = localStorage.getItem('CloudSettingsModule');

  let isSeedToSale = localStorage.getItem('CloudSeedToSaleModule');
  let isBanking = localStorage.getItem('CloudBankingModule');
  let isPayroll = localStorage.getItem('CloudPayrollModule');
  let isTimesheetEntry = localStorage.getItem('CloudTimesheetEntry');
  let isShowTimesheet = localStorage.getItem('CloudShowTimesheet');
  let isTimesheetCreate = localStorage.getItem('CloudCreateTimesheet');
  let isEditTimesheetHours = localStorage.getItem('CloudEditTimesheetHours');
  let isClockOnOff = localStorage.getItem('CloudClockOnOff');

  let isSidePanel = localStorage.getItem('CloudSidePanelMenu');
  let isTopPanel = localStorage.getItem('CloudTopPanelMenu');

  let isAppointmentScheduling = localStorage.getItem('CloudAppointmentSchedulingModule');
  let isAllocationLaunch = localStorage.getItem('CloudAppointmentAllocationLaunch');
  let isCurrencyEnable = localStorage.getItem('CloudUseForeignLicence');
  let isAppointmentLaunch = localStorage.getItem('CloudAppointmentAppointmentLaunch');

  let launchAllocations = localStorage.getItem('CloudAppointmentAllocationLaunch');

  let isCRM = localStorage.getItem('CloudCRM');
  let isProductList = localStorage.getItem('CloudProdList');
  let isNewProduct = localStorage.getItem('CloudNewProd');
  let isNewStockTransfer = localStorage.getItem('CloudNewStockTransfer');
  let isExportProduct = localStorage.getItem('CloudExportProd');
  let isImportProduct = localStorage.getItem('CloudImportProd');
  let isStockonHandDemandChart = localStorage.getItem('CloudStockOnHand');
  let isAppointmentSMS = localStorage.getItem('CloudApptSMS');

  let isSerialNumberList = localStorage.getItem('CloudShowSerial') || false;

  var erpGet = erpDb();
  var LoggedDB = erpGet.ERPDatabase;
  var LoggedUser = localStorage.getItem('mySession');
  // here get menu bar preference from local storage and set menubarPositionClass

  let loggedUserEventFired = (localStorage.getItem('LoggedUserEventFired') == "true");
  if (loggedUserEventFired) {
    $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
    $('.headerprogressbar').addClass('headerprogressbarShow');
    $('.headerprogressbar').removeClass('headerprogressbarHidden');
    sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), '').then(function (dataCustomize) {
      addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
    });
    getVS1Data('Tvs1charts').then(function (dataObject) {
      if (dataObject.length == 0) {
        sideBarService.getTvs1charts().then(function (data) {
          addVS1Data('Tvs1charts', JSON.stringify(data));
        }).catch(function (err) {

        });
      }
    });
    getVS1Data('Tvs1dashboardpreferences').then(function (dataObject) {
      if (dataObject.length == 0) {
        sideBarService.getTvs1dashboardpreferences().then(function (data) {
          addVS1Data('Tvs1dashboardpreferences', JSON.stringify(data));
        }).catch(function (err) {

        });
      }
    });


    getVS1Data('TCustomFieldList').then(function (dataObject) {
      if (dataObject.length == 0) {
        sideBarService.getAllCustomFields().then(function (data) {
          addVS1Data('TCustomFieldList', JSON.stringify(data));
        }).catch(function (err) {

        });
      }
    });
    getVS1Data('TAppUser').then(function (dataObject) {
      if (dataObject.length == 0) {
        $('#headerprogressLabelFirst').css('display', 'block');
        sideBarService.getCurrentLoggedUser().then(function (data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          $(".progressBarInner").text(Math.round(progressPercentage) + "%");
          $(".progressName").text("App User ");
          if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
            if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            } else {
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          } else if (Math.round(progressPercentage) >= 100) {
            $('.checkmarkwrapper').removeClass("hide");
            templateObject.dashboardRedirectOnLogin();
          }
          addVS1Data('TAppUser', JSON.stringify(data));
          $("<span class='process'>App User Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function (err) {
          $('.process').addClass('killProgressBar');
          if (launchAllocations) {
            setTimeout(function () {
              $('.allocationModal').removeClass('killAllocationPOP');
            }, 800);
          }
        });
      } else {
        let getTimeStamp = dataObject[0].timestamp.split(' ');
        if (getTimeStamp) {
          if (loggedUserEventFired) {
            if (getTimeStamp[0] != currenctTodayDate) {
              sideBarService.getCurrentLoggedUser().then(function (data) {
                addVS1Data('TAppUser', JSON.stringify(data));
              }).catch(function (err) {
                $('.process').addClass('killProgressBar');
                if (launchAllocations) {
                  setTimeout(function () {
                    $('.allocationModal').removeClass('killAllocationPOP');
                  }, 800);
                }
              });
              $('.loadingbar').css('width', 100 + '%').attr('aria-valuenow', 100);
              $(".headerprogressLabel").text("All Your Information Loaded");
              $(".progressBarInner").text("" + Math.round(100) + "%");
              $('.checkmarkwrapper').removeClass("hide");
              $('.process').addClass('killProgressBar');
              if (launchAllocations) {
                setTimeout(function () {
                  $('.allocationModal').removeClass('killAllocationPOP');
                }, 800);
              }
              setTimeout(function () {
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
                templateObject.dashboardRedirectOnLogin();
                if (launchAllocations) {
                  setTimeout(function () {
                    $('.allocationModal').removeClass('killAllocationPOP');
                  }, 800);
                }
              }, 300);
            } else {
              $('.loadingbar').css('width', 100 + '%').attr('aria-valuenow', 100);
              $(".headerprogressLabel").text("All Your Information Loaded");
              $(".progressBarInner").text("" + Math.round(100) + "%");
              $('.checkmarkwrapper').removeClass("hide");
              $('.process').addClass('killProgressBar');
              if (launchAllocations) {
                setTimeout(function () {
                  $('.allocationModal').removeClass('killAllocationPOP');
                }, 800);
              }
              setTimeout(function () {
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
                templateObject.dashboardRedirectOnLogin();
                if (launchAllocations) {
                  setTimeout(function () {
                    $('.allocationModal').removeClass('killAllocationPOP');
                  }, 800);
                }
              }, 300);
            }
          }
        }
      }
    }).catch(function (err) {
      sideBarService.getCurrentLoggedUser().then(function (data) {
        countObjectTimes++;
        progressPercentage = (countObjectTimes * 100) / allDataToLoad;
        $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
        $(".progressBarInner").text(Math.round(progressPercentage) + "%");
        $(".progressName").text("App User ");
        if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
          if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          } else {
            $('.headerprogressbar').addClass('headerprogressbarShow');
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          }

        } else if (Math.round(progressPercentage) >= 100) {
          $('.checkmarkwrapper').removeClass("hide");
          templateObject.dashboardRedirectOnLogin();
        }
        addVS1Data('TAppUser', JSON.stringify(data));
        $("<span class='process'>App User Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {
        $('.process').addClass('killProgressBar');
        if (launchAllocations) {
          setTimeout(function () {
            $('.allocationModal').removeClass('killAllocationPOP');
          }, 800);
        }
      });
    });
  } else {
    setTimeout(function () {
      $('.allocationModal').removeClass('killAllocationPOP');
      $('.headerprogressbar').addClass('headerprogressbarHidden');
      templateObject.dashboardRedirectOnLogin();
    }, 800);

  }

  let currentDate = new Date();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();
  let month = (currentDate.getMonth() + 1);
  let days = currentDate.getDate();

  if ((currentDate.getMonth() + 1) < 10) {
    month = "0" + (currentDate.getMonth() + 1);
  }

  if (currentDate.getDate() < 10) {
    days = "0" + currentDate.getDate();
  }
  let currenctTodayDate = currentDate.getFullYear() + "-" + month + "-" + days;

  var splashArrayProd = new Array();

  var currentBeginDate = new Date();
  var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
  let fromDateMonth = (currentBeginDate.getMonth() + 1);

  let fromDateDay = currentBeginDate.getDate();
  if ((currentBeginDate.getMonth() + 1) < 10) {
    fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
  } else {
    fromDateMonth = (currentBeginDate.getMonth() + 1);
  }


  if (currentBeginDate.getDate() < 10) {
    fromDateDay = "0" + currentBeginDate.getDate();
  }
  var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
  let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");


  templateObject.getAllAccountsData = function () {
    sideBarService.getAccountListVS1().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Accounts ");

      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }

      //localStorage.setItem('VS1AccountList', JSON.stringify(data) || '');
      addVS1Data('TAccountVS1', JSON.stringify(data));
      $("<span class='process'>Accounts Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");

    }).catch(function (err) {
    });
    sideBarService.getReceiptCategory().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Receipt Category ");

      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }

      addVS1Data('TReceiptCategory', JSON.stringify(data));
      $("<span class='process'>Receipt Category Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");

    }).catch(function (err) {
    });
    sideBarService.getAllTAccountVS1List(initialBaseDataLoad, 0, false).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Account List ");

      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }

      //localStorage.setItem('VS1AccountList', JSON.stringify(data) || '');
      addVS1Data('TAccountVS1List', JSON.stringify(data));
      $("<span class='process'>Account List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");

    }).catch(function (err) {

    });

    organisationService.getOrganisationDetail()
    .then(dataListRet => {
      addVS1Data('TCompanyInfo', JSON.stringify(dataListRet));
    })
  }

  templateObject.getAllProductData = function () {
    sideBarService.getProductListVS1(initialBaseDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Product List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TProductList', JSON.stringify(data));
      $("<span class='process'>Product List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllRecentTransactions = function () {
    productService.getProductRecentTransactionsAll("all").then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Product List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('T_VS1_Report_Productmovement', JSON.stringify(data));
      $("<span class='process'>Product Movement List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllProductServiceData = function () {
    sideBarService.getProductServiceListVS1(initialBaseDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Non-Inventory Products "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Non-Inventory Products ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TProductWeb', JSON.stringify(data));
      $("<span class='process'>Non-Inventory Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllCustomersData = function () {
    sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Customers "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Customers ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1CustomerList', JSON.stringify(data) || '');
      addVS1Data('TCustomerVS1', JSON.stringify(data));
      $("<span class='process'>Customers Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });


    sideBarService.getAllLeads(initialBaseDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Customers "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Leads ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1CustomerList', JSON.stringify(data) || '');
      addVS1Data('TProspectEx', JSON.stringify(data));
      $("<span class='process'>Leads Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllSuppliersData = function () {
    sideBarService.getAllSuppliersDataVS1(initialBaseDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Suppliers "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Suppliers ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1SupplierList', JSON.stringify(data) || '');
      addVS1Data('TSupplierVS1', JSON.stringify(data));
      $("<span class='process'>Suppliers Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllTaxCodeData = function () {
    sideBarService.getTaxRateVS1().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Tax Code "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Tax Code ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TaxCodeList', JSON.stringify(data) || '');
      addVS1Data('TTaxcodeVS1', JSON.stringify(data));
      $("<span class='process'>Tax Codes Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getSubTaxCode().then(function (dataReload) {
      addVS1Data('TSubTaxVS1', JSON.stringify(dataReload));
    }).catch(function (err) {

    });
  }

  templateObject.getAllCRMData = function () {
    sideBarService.getAllTaskList().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Task List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TCRMTaskList', JSON.stringify(data));
      $("<span class='process'>Task List <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });


    sideBarService.getTProjectList().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Project List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TCRMProjectList', JSON.stringify(data));
      $("<span class='process'>Project List <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllLabels().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Task Label List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TCRMLabelList', JSON.stringify(data));
      $("<span class='process'>Task Label List <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

  }

  templateObject.getAllTermsData = function () {
    sideBarService.getTermsVS1().then(function (data) {

      for (let i in data.ttermsvs1) {

        if (data.ttermsvs1[i].isSalesdefault == true) {
          localStorage.setItem('ERPTermsSales', data.ttermsvs1[i].TermsName || "COD");
        }

        if (data.ttermsvs1[i].isPurchasedefault == true) {
          localStorage.setItem('ERPTermsPurchase', data.ttermsvs1[i].TermsName || "COD");
        }

      }

      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Terms "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Terms ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TermsList', JSON.stringify(data) || '');
      addVS1Data('TTermsVS1', JSON.stringify(data));
      $("<span class='process'>Terms Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllDepartmentData = function () {
    sideBarService.getDepartment().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Departments "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Departments ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1DepartmentList', JSON.stringify(data) || '');
      addVS1Data('TDeptClass', JSON.stringify(data));
      $("<span class='process'>Departments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllCurrencyData = function () {
    sideBarService.getCurrencies().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Currency "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Currency ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1CurrencyList', JSON.stringify(data) || '');
      addVS1Data('TCurrency', JSON.stringify(data));
      $("<span class='process'>Currencies Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getTCountriesData = function () {
    sideBarService.getCountry().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Countries "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Countries ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TCountries', JSON.stringify(data));
      $("<span class='process'>Countries Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getTPaymentMethodData = function () {
    sideBarService.getPaymentMethodDataVS1().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Payment Method "+valeur+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Payment Method ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TPaymentMethod', JSON.stringify(data));
      $("<span class='process'>Payment Methods Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getTClientTypeData = function () {
    sideBarService.getClientTypeData().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Client Type "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Client Type ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TClientType', JSON.stringify(data));
      $("<span class='process'>Client Types Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllLeadStatusData = function () {
    sideBarService.getAllLeadStatus().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Lead Status Type "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Lead Status Type ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1LeadStatusList', JSON.stringify(data) || '');
      addVS1Data('TLeadStatusType', JSON.stringify(data));
      $("<span class='process'>Statuses Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllShippingMethodData = function () {
    sideBarService.getShippingMethodData().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Shipping Method "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Shipping Method ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1ShippingMethodList', JSON.stringify(data) || '');
      addVS1Data('TShippingMethod', JSON.stringify(data));
      $("<span class='process'>Shipping Methods Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllAccountTypeData = function () {
    sideBarService.getAccountTypesToAddNew().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Account Type "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Account Type ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1AccountTypeList', JSON.stringify(data) || '');
      addVS1Data('TAccountType', JSON.stringify(data));
      $("<span class='process'>Account Types Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllERPFormData = function () {
    sideBarService.getCloudTERPForm().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Account Type "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Access Level Forms ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1AccountTypeList', JSON.stringify(data) || '');
      addVS1Data('TERPForm', JSON.stringify(data));
      $("<span class='process'>Access Level Forms Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllEmployeeFormAccessDetailData = function () {
    sideBarService.getEmpFormAccessDetail().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Account Type "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Employee Access Forms ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1AccountTypeList', JSON.stringify(data) || '');
      addVS1Data('TEmployeeFormAccessDetail', JSON.stringify(data));
      $("<span class='process'>Employee Access Forms Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllERPCombinedContactsData = function () {
    // sideBarService.getAllContactCombineVS1(initialDataLoad, 0).then(function(data) {
    sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Contacts "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Contacts ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1ERPCombinedContactsList', JSON.stringify(data) || '');
      addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
      $("<span class='process'>Contacts Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllEmployeeData = function () {
    sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Employee "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Employee ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1EmployeeList', JSON.stringify(data) || '');
      addVS1Data('TEmployee', JSON.stringify(data));
      $("<span class='process'>Employees Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllJournalEntryLineData = function () {
    sideBarService.getAllJournalEnrtryLinesList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Journal Entry Lines "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Journal Entry Lines ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1JournalEntryLineList', JSON.stringify(data) || '');
      addVS1Data('TJournalEntryLines', JSON.stringify(data));
      $("<span class='process'>Journal Entries Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getTJournalEntryListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Journal Entry List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
      addVS1Data('TJournalEntryList', JSON.stringify(data));
      $("<span class='process'>Journal Entry List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllBankAccountReportData = function () {

    sideBarService.getAllBankAccountDetails(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Bank Account Report ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
      addVS1Data('TBankAccountReport', JSON.stringify(data));
      $("<span class='process'>Bank Account Reports Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllTTransactionListReportData = function () {
    // sideBarService.getTTransactionListReport('').then(function(data) {
    //     addVS1Data('TTransactionListReport',JSON.stringify(data));
    // }).catch(function(err) {
    //
    // });
  }

  templateObject.getAllInvoiceListData = function () {

    sideBarService.getAllTInvoiceListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Invoice List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TInvoiceList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Invoice List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllRefundListData = function () {
    sideBarService.getAllRefundList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Refund Sale "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Refunds ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TRefundSale', JSON.stringify(data));
      $("<span class='process'>Refunds Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllTRefundSaleListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Refund List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TRefundSaleList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Refund List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllBackOrderInvoicetData = function () {
    sideBarService.getAllBackOrderInvoiceList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text(" Invoice BO "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Invoice BO ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TInvoiceBackOrder', JSON.stringify(data));
      $("<span class='process'>Invoice BO Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllTSalesBackOrderReportData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Sales BO Report");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TSalesBackOrderReport', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Sales BO Report Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllSalesOrderExListData = function () {
    sideBarService.getAllSalesOrderList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Sales Order "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Sales Order ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TSalesOrderEx', JSON.stringify(data));
      $("<span class='process'>Sales Orders Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllTPurchaseOrderData = function () {
    sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Purchase Order ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TPurchaseOrderList', JSON.stringify(data) || '');
      addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
      $("<span class='process'>Purchase Orders Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllTPurchaseOrderListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Purchase Order List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TPurchaseOrderList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Purchase Order List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllTReconcilationData = function () {

    sideBarService.getAllReconcilationList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Reconciliation ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TReconciliation', JSON.stringify(data));
      $("<span class='process'>Reconciliations Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllTReconcilationListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Reconciliation List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TReconciliationList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Reconciliation List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllTbillReportData = function () {

    sideBarService.getAllPurchaseOrderListAll(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bill Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Bill Report ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TbillReport', JSON.stringify(data) || '');
      addVS1Data('TbillReport', JSON.stringify(data));
      $("<span class='process'>Bill Reports Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

  }

  templateObject.getAllPurchasesData = function () {


    sideBarService.getAllPurchasesList(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bill Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Purchase Overview ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TbillReport', JSON.stringify(data) || '');
      addVS1Data('TPurchasesList', JSON.stringify(data));
      $("<span class='process'>Purchase Overview Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllAwaitingSupplierPaymentData = function () {

    sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, true, initialReportLoad, 0, '').then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Awaiting Supplier Payment "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Awaiting Supplier Payment ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TbillReport', JSON.stringify(data) || '');
      addVS1Data('TAwaitingSupplierPayment', JSON.stringify(data));
      $("<span class='process'>Awaiting Supplier Payments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllAwaitingCustomerPaymentData = function () {

    sideBarService.getAllAwaitingCustomerPayment(prevMonth11Date, toDate, true, initialReportLoad, 0, '').then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Awaiting Supplier Payment "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Awaiting Customer Payment ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TbillReport', JSON.stringify(data) || '');
      addVS1Data('TAwaitingCustomerPayment', JSON.stringify(data));
      $("<span class='process'>Awaiting Customer Payments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllTChequeData = function () {
    sideBarService.getAllChequeList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Cheque "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text(chequeSpelling);
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TChequeList', JSON.stringify(data) || '');
      addVS1Data('TCheque', JSON.stringify(data));
      $("<span class='process'>" + chequeSpelling + " Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllChequeListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text(chequeSpelling + " List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TChequeList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'> " + chequeSpelling + " List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllTProductStocknSalePeriodReportData = function () {

    sideBarService.getProductStocknSaleReportData(prevMonth11Date, toDate, false).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Product Stock & Sale Period Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Product Stock & Sale Period Report ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TProductStocknSalePeriodReport', JSON.stringify(data));
      $("<span class='process'>Product Stock & Sales Reports Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllAppUserData = function () {
    sideBarService.getCurrentLoggedUser().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("App User "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("App User ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TAppUserList', JSON.stringify(data) || '');
      addVS1Data('TAppUser', JSON.stringify(data));
      $("<span class='process'>App User Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllTJobVS1Data = function () {
    sideBarService.getAllJobssDataVS1(initialBaseDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Job "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Job ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TJobVS1List', JSON.stringify(data) || '');
      addVS1Data('TJobVS1', JSON.stringify(data));
      $("<span class='process'>Jobs Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllTStockAdjustEntryData = function () {
    if (isStockAdjustment) {
      sideBarService.getAllStockAdjustEntry(initialDataLoad, 0).then(function (data) {
        countObjectTimes++;
        progressPercentage = (countObjectTimes * 100) / allDataToLoad;
        $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
        //$(".progressBarInner").text("Stock Adjust Entry "+Math.round(progressPercentage)+"%");
        $(".progressBarInner").text(Math.round(progressPercentage) + "%");
        $(".progressName").text("Stock Adjust Entry ");
        if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
          if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          } else {
            $('.headerprogressbar').addClass('headerprogressbarShow');
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          }

        } else if (Math.round(progressPercentage) >= 100) {
          $('.checkmarkwrapper').removeClass("hide");
          templateObject.dashboardRedirectOnLogin();
        }
        addVS1Data('TStockAdjustEntry', JSON.stringify(data));
        $("<span class='process'>Stock Adjustment Entries Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });
    } else {
      allDataToLoad = allDataToLoad - 1;
    }
  }

  templateObject.getAllTStockTransferEntryData = function () {
    if (isStockTransfer) {
      sideBarService.getAllStockTransferEntry(initialDataLoad, 0).then(function (data) {
        countObjectTimes++;
        progressPercentage = (countObjectTimes * 100) / allDataToLoad;
        $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
        //$(".progressBarInner").text("Stock Transfer Entry "+Math.round(progressPercentage)+"%");
        $(".progressBarInner").text(Math.round(progressPercentage) + "%");
        $(".progressName").text("Stock Transfer Entry ");
        if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
          if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          } else {
            $('.headerprogressbar').addClass('headerprogressbarShow');
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          }

        } else if (Math.round(progressPercentage) >= 100) {
          $('.checkmarkwrapper').removeClass("hide");
          templateObject.dashboardRedirectOnLogin();
        }
        addVS1Data('TStockTransferEntry', JSON.stringify(data));
        $("<span class='process'>Stock Transfer Entries Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });
    } else {
      allDataToLoad = allDataToLoad - 1;
    }
  }

  templateObject.getAllTQuoteData = function () {
    sideBarService.getAllQuoteList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Quote "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Quote ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TQuoteList', JSON.stringify(data) || '');
      addVS1Data('TQuote', JSON.stringify(data));
      $("<span class='process'>Quotes Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllTQuoteListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Quote List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TQuoteList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Quote List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllTBillExData = function () {
    sideBarService.getAllBillListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Bill List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TBillList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Bill List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllTCreditData = function () {
    sideBarService.getAllCreditList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Credit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Credit ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TCredit', JSON.stringify(data));
      $("<span class='process'>Credits Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getTCreditListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Credit List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
      addVS1Data('TCreditList', JSON.stringify(data));
      $("<span class='process'>Credit List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllTpurchaseOrderBackOrderData = function () {

    sideBarService.getAllTPurchasesBackOrderReportData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Purchase BO Report");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TPurchasesBackOrderReport', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Purchase BO Report Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllTSalesListData = function () {


    sideBarService.getSalesListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Sales List "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Sales List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TSalesList', JSON.stringify(data) || '');
      addVS1Data('TSalesList', JSON.stringify(data));
      $("<span class='process'>Sales List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllTSalesOrderListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Sales Order List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TSalesOrderList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Sales Order List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getAllAppointmentData = function () {
    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Appointment "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Appointment ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TAppointment', JSON.stringify(data));
      $("<span class='process'>Appointments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getTAppointmentListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Appointment List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
      addVS1Data('TAppointmentList', JSON.stringify(data));
      $("<span class='process'>Appointment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

  }
  templateObject.getAllAppointmentListData = function () {
    sideBarService.getTAppointmentListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Appointment List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
      addVS1Data('TAppointmentList', JSON.stringify(data));
      $("<span class='process'>Appointment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }
  templateObject.getAllTERPPreferenceData = function () {
    sideBarService.getGlobalSettings().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("ERP Preference "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Preference ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TERPPreference', JSON.stringify(data));
      $("<span class='process'>Preferences Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }


  templateObject.getAllTERPPreferenceExtraData = function () {
    sideBarService.getGlobalSettingsExtra().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("ERP Preference Extra "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Preference Extra ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //  }


      addVS1Data('TERPPreferenceExtra', JSON.stringify(data));
      $("<span class='process'>Extra Preferences Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllAppointmentPrefData = function () {
    sideBarService.getAllAppointmentPredList().then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Appointment Preferences "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Appointment Preferences ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TAppointmentPreferences', JSON.stringify(data));
      $("<span class='process'>Appointment Preferences Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getTPaymentListData = function () {

    sideBarService.getTPaymentList(prevMonth11Date, toDate, true, initialReportLoad, 0, '').then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Payment List "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Payment List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TPaymentList', JSON.stringify(data));
      $("<span class='process'>Payment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getTARReportData = function () {

    sideBarService.getTARReport(prevMonth11Date, toDate, false).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("AR Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("AR Report ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TARReport', JSON.stringify(data));
      $("<span class='process'>AR Report Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAgedReceivableDetailsSummaryData(prevMonth11Date, toDate, true, '').then(function (data) {
      localStorage.setItem("VS1AgedReceivableSummary_Report", JSON.stringify(data) || "");
      localStorage.setItem("VS1AgedReceivableSummary_Card", JSON.stringify(data) || "");
    });
  }

  templateObject.getTAPReportData = function () {

    sideBarService.getTAPReport(prevMonth11Date, toDate, false).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("AP Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("AP Report ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TAPReport', JSON.stringify(data));
      $("<span class='process'>AP Report Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAgedPayableDetailsSummaryData(prevMonth11Date, toDate, true, '').then(function (data) {
      localStorage.setItem("VS1AgedPayablesSummary_Report", JSON.stringify(data) || "");
      localStorage.setItem("VS1AgedPayablesSummary_Card", JSON.stringify(data) || "");
    });
  }

  templateObject.getTCustomerPaymentData = function () {
    sideBarService.getTCustomerPaymentList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Customer Payment "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Customer Payment ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TCustomerPayment', JSON.stringify(data));
      $("<span class='process'>Customer Payments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllTCustomerPaymentListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Customer Payment List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TCustomerPaymentList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Customer Payment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }


  templateObject.getTSupplierPaymentData = function () {
    sideBarService.getTSupplierPaymentList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Supplier Payment "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Supplier Payment ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TSupplierPayment', JSON.stringify(data));
      $("<span class='process'>Supplier Payments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });

    sideBarService.getAllTSupplierPaymentListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Supplier Payment List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TSupplierPaymentList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Supplier Payment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });
  }

  templateObject.getTStatementListData = function () {
    sideBarService.getAllCustomerStatementData(prevMonth11Date, toDate, false).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Statement List "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Statement List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TStatementList', JSON.stringify(data));
      $("<span class='process'>Statement List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getTVS1BankDepositData = function () {
    sideBarService.getAllTVS1BankDepositData(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Bank Deposit ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TVS1BankDeposit', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Bank Deposits Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });

    sideBarService.getAllTBankDepositListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Bank Deposit List");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TBankDepositList', JSON.stringify(data)).then(function (datareturn) {
        $("<span class='process'>Bank Deposit List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function (err) {

      });

    }).catch(function (err) {

    });

  }

  templateObject.getAllTimeSheetData = function () {
    sideBarService.getAllTimeSheetList(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Timesheets ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TTimeSheet', JSON.stringify(data));
      $("<span class='process'>Timesheets Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllPayRunData = function () {
    sideBarService.getAllPayRunDataVS1(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Pay Run List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TPayRun', JSON.stringify(data));
      $("<span class='process'>Pay Run Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }
  templateObject.getAllPayHistoryData = function () {
    sideBarService.getAllPayHistoryDataVS1(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Pay History List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TPayHistory', JSON.stringify(data));
      $("<span class='process'>Pay History Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllAllowanceData = function () {
    sideBarService.getAllowance(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Allowance List ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TAllowance', JSON.stringify(data));
      $("<span class='process'>Allowances Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  templateObject.getAllEmployeepaysettingsData = function () {
    sideBarService.getAllEmployeePaySettings(initialDataLoad, 0).then(function (data) {
      countObjectTimes++;
      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
      //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
      $(".progressName").text("Employee Pay Settings ");
      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        } else {
          $('.headerprogressbar').addClass('headerprogressbarShow');
          $('.headerprogressbar').removeClass('headerprogressbarHidden');
        }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      addVS1Data('TEmployeepaysettings', JSON.stringify(data));
      $("<span class='process'>Employee Pay Settings Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

    templateObject.getAllTExpenseClaimExData = function() {
        sideBarService.getAllExpenseCliamExDataVS1().then(function(data) {
            countObjectTimes++;
            progressPercentage = (countObjectTimes * 100) / allDataToLoad;
            $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
            //$(".progressBarInner").text("Job "+Math.round(progressPercentage)+"%");
            $(".progressBarInner").text(Math.round(progressPercentage) + "%");
            $(".progressName").text("Receipt Claim ");
            if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                } else {
                    $('.headerprogressbar').addClass('headerprogressbarShow');
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

      } else if (Math.round(progressPercentage) >= 100) {
        $('.checkmarkwrapper').removeClass("hide");
        templateObject.dashboardRedirectOnLogin();
      }
      //localStorage.setItem('VS1TJobVS1List', JSON.stringify(data) || '');
      addVS1Data('TExpenseClaim', JSON.stringify(data));
      $("<span class='process'>Receipt Claim Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
    }).catch(function (err) {

    });
  }

  /* Start Here */
  if (loggedUserEventFired) {
    templateObject.getFollowedAllObjectPull = function () {
      setTimeout(function () {
        if (isPayments) {
          getVS1Data('TStatementList').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getTStatementListData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getTStatementListData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getTStatementListData();
          });

        }
        if (isBanking) {
          getVS1Data('TVS1BankDeposit').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getTVS1BankDepositData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getTVS1BankDepositData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getTVS1BankDepositData();
          });

        }
        if (isPayroll) {
          getVS1Data('TTimeSheet').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTimeSheetData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllTimeSheetData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllTimeSheetData();
          });

          // getVS1Data('TPayRun').then(function(dataObject) {
          //     if (dataObject.length == 0) {
          //         templateObject.getAllPayRunData();
          //     } else {
          //         let getTimeStamp = dataObject[0].timestamp.split(' ');
          //         if (getTimeStamp) {
          //             if (loggedUserEventFired) {
          //                 if (getTimeStamp[0] != currenctTodayDate) {
          //                     templateObject.getAllPayRunData();
          //                 }
          //             }
          //         }
          //     }
          // }).catch(function(err) {
          //     templateObject.getAllPayRunData();
          // });

          getVS1Data('TPayHistory').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllPayHistoryData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllPayHistoryData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllPayHistoryData();
          });

          getVS1Data('TAllowance').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllAllowanceData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllAllowanceData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllAllowanceData();
          });

          getVS1Data('TEmployeepaysettings').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllEmployeepaysettingsData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllEmployeepaysettingsData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllEmployeepaysettingsData();
          });

        }
        if (isAccounts) {
          getVS1Data('TJournalEntryLines').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllJournalEntryLineData();
            } else {
              let data = JSON.parse(dataObject[0].data);
              if (data.tjournalentrylines) {
                templateObject.getAllJournalEntryLineData();
              } else {
              }
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllJournalEntryLineData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllJournalEntryLineData();
          });
        }
        if (isBanking) {
          getVS1Data('TReconciliation').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTReconcilationData();
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.treconciliation;
              if (useData.length > 0) {
                if (useData[0].Id) {
                  templateObject.getAllTReconcilationData();
                }
              } else {
                templateObject.getAllTReconcilationData();
              }
            }
          }).catch(function (err) {
            templateObject.getAllTReconcilationData();
          });
        }
        if (isExpenseClaims) {
          getVS1Data('TExpenseClaim').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTExpenseClaimExData();
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.texpenseclaimex;
              if (useData.length > 0) {
                if (useData[0].Id) {
                  templateObject.getAllTExpenseClaimExData();
                }
              } else {
                templateObject.getAllTExpenseClaimExData();
              }
            }
          }).catch(function (err) {
            templateObject.getAllTExpenseClaimExData();
          });
        }
        if (isInventory) {
          getVS1Data('TStockAdjustEntry').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTStockAdjustEntryData();
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tstockadjustentry;
              if (useData.length > 0) {
                if (useData[0].Id) {
                  templateObject.getAllTStockAdjustEntryData();
                } else {
                  let getTimeStamp = dataObject[0].timestamp.split(' ');
                  if (getTimeStamp) {
                    if (loggedUserEventFired) {
                      if (getTimeStamp[0] != currenctTodayDate) {
                        templateObject.getAllTStockAdjustEntryData();
                      }
                    }
                  }
                }
              } else {
                templateObject.getAllTStockAdjustEntryData();
              }
            }
          }).catch(function (err) {
            templateObject.getAllTStockAdjustEntryData();
          });
        }

        if (isReports) {
          getVS1Data('TARReport').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getTARReportData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getTARReportData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getTARReportData();
          });

          getVS1Data('TAPReport').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getTAPReportData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getTAPReportData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getTAPReportData();
          });
        }
        if (isPayments) {
          getVS1Data('TPaymentList').then(function (dataObject) {

            if (dataObject.length == 0) {
              templateObject.getTPaymentListData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getTPaymentListData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getTPaymentListData();
          });

          getVS1Data('TSupplierPayment').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getTSupplierPaymentData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getTSupplierPaymentData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getTSupplierPaymentData();
          });

          getVS1Data('TCustomerPayment').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getTCustomerPaymentData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getTCustomerPaymentData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getTCustomerPaymentData();
          });

          getVS1Data('TAwaitingSupplierPayment').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllAwaitingSupplierPaymentData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllAwaitingSupplierPaymentData();
          });

          getVS1Data('TAwaitingCustomerPayment').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllAwaitingCustomerPaymentData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllAwaitingCustomerPaymentData();
          });
        }
        if (isBanking) {
          getVS1Data('TBankAccountReport').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllBankAccountReportData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllBankAccountReportData();
          });
        }
        if (isContacts) {
          getVS1Data('TTransactionListReport').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTTransactionListReportData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllTTransactionListReportData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllTTransactionListReportData();
          });
        }
        if (progressPercentage == 0) {
          $('.loadingbar').css('width', 100 + '%').attr('aria-valuenow', 100);
          $(".headerprogressLabel").text("All Your Information Loaded");
          $(".progressBarInner").text("" + Math.round(100) + "%");
          $('.checkmarkwrapper').removeClass("hide");
          $('.process').addClass('killProgressBar');
          if (launchAllocations) {
            setTimeout(function () {
              $('.allocationModal').removeClass('killAllocationPOP');
            }, 800);
          }
          setTimeout(function () {
            $('.headerprogressbar').removeClass('headerprogressbarShow');
            $('.headerprogressbar').addClass('headerprogressbarHidden');
            templateObject.dashboardRedirectOnLogin();
            if (launchAllocations) {
              setTimeout(function () {
                $('.allocationModal').removeClass('killAllocationPOP');
              }, 800);
            }
          }, 300);
          templateObject.dashboardRedirectOnLogin();
        }
      }, 300);

      setTimeout(function () {
        $('.loadingbar').css('width', 100 + '%').attr('aria-valuenow', 100);
        $(".progressBarInner").text("" + Math.round(100) + "%");
        $('.checkmarkwrapper').removeClass("hide");
        $('.process').addClass('killProgressBar');
        if (launchAllocations) {
          setTimeout(function () {
            $('.allocationModal').removeClass('killAllocationPOP');
          }, 800);

        }
        setTimeout(function () {
          $('.headerprogressbar').removeClass('headerprogressbarShow');
          $('.headerprogressbar').addClass('headerprogressbarHidden');
          templateObject.dashboardRedirectOnLogin();
          if (launchAllocations) {
            setTimeout(function () {
              $('.allocationModal').removeClass('killAllocationPOP');
            }, 800);
          }
        }, 5000);
      }, 40000);

    }

    //Followed by Bill Details
    templateObject.getFollowedBillDetailsPull = function () {
      setTimeout(function () {
        if (isPurchases) {

          getVS1Data('TCredit').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTCreditData();
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tcredit;
              if (useData.length > 0) {
                if (useData[0].Id) {
                  templateObject.getAllTCreditData();
                } else {
                  let getTimeStamp = dataObject[0].timestamp.split(' ');
                  if (getTimeStamp) {
                    if (loggedUserEventFired) {
                      if (getTimeStamp[0] != currenctTodayDate) {
                        templateObject.getAllTCreditData();
                      }
                    }
                  }
                }
              } else {
                templateObject.getAllTCreditData();
              }


            }
          }).catch(function (err) {
            templateObject.getAllTCreditData();
          });

          getVS1Data('TbillReport').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTbillReportData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllTbillReportData();
          });

          getVS1Data('TPurchasesList').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllPurchasesData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllPurchasesData();
          });

          getVS1Data('TBillEx').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTBillExData();
              sideBarService.getAllBillExList(initialDataLoad, 0).then(function (data) {
                countObjectTimes++;
                progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                //$(".progressBarInner").text("Bill "+Math.round(progressPercentage)+"%");
                $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                $(".progressName").text("Bill ");
                if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                  if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  } else {
                    $('.headerprogressbar').addClass('headerprogressbarShow');
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  }

                } else if (Math.round(progressPercentage) >= 100) {
                  $('.checkmarkwrapper').removeClass("hide");
                  templateObject.dashboardRedirectOnLogin();
                }
                addVS1Data('TBillEx', JSON.stringify(data));
                $("<span class='process'>Bills Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                templateObject.getFollowedAllObjectPull();
              }).catch(function (err) {
                templateObject.getFollowedAllObjectPull();
              });
            } else {
              let data = JSON.parse(dataObject[0].data);

              let useData = data.tbillex;
              if (useData.length > 0) {
                if (useData[0].Id) {
                  sideBarService.getAllBillExList(initialDataLoad, 0).then(function (data) {
                    countObjectTimes++;
                    progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                    $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                    //$(".progressBarInner").text("Bill "+Math.round(progressPercentage)+"%");
                    $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                    $(".progressName").text("Bill ");
                    if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                      if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                      } else {
                        $('.headerprogressbar').addClass('headerprogressbarShow');
                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                      }

                    } else if (Math.round(progressPercentage) >= 100) {
                      $('.checkmarkwrapper').removeClass("hide");
                      templateObject.dashboardRedirectOnLogin();
                    }
                    addVS1Data('TBillEx', JSON.stringify(data));
                    $("<span class='process'>Bills Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                    templateObject.getFollowedAllObjectPull();
                  }).catch(function (err) {
                    templateObject.getFollowedAllObjectPull();
                  });
                } else {
                  let getTimeStamp = dataObject[0].timestamp.split(' ');
                  if (getTimeStamp) {
                    if (loggedUserEventFired) {
                      if (getTimeStamp[0] != currenctTodayDate) {
                        sideBarService.getAllBillExList(initialDataLoad, 0).then(function (data) {
                          countObjectTimes++;
                          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                          //$(".progressBarInner").text("Bill "+Math.round(progressPercentage)+"%");
                          $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                          $(".progressName").text("Bill ");
                          if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                            if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            } else {
                              $('.headerprogressbar').addClass('headerprogressbarShow');
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            }

                          } else if (Math.round(progressPercentage) >= 100) {
                            $('.checkmarkwrapper').removeClass("hide");
                            templateObject.dashboardRedirectOnLogin();
                          }
                          addVS1Data('TBillEx', JSON.stringify(data));
                          $("<span class='process'>Bills Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                          templateObject.getFollowedAllObjectPull();
                        }).catch(function (err) {
                          templateObject.getFollowedAllObjectPull();
                        });
                      } else {
                        templateObject.getFollowedAllObjectPull();
                      }
                    }
                  }
                }
              } else {
                templateObject.getFollowedAllObjectPull();
              }


            }
          }).catch(function (err) {
            templateObject.getAllTBillExData();
            sideBarService.getAllBillExList(initialDataLoad, 0).then(function (data) {
              countObjectTimes++;
              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
              //$(".progressBarInner").text("Bill "+Math.round(progressPercentage)+"%");
              $(".progressBarInner").text(Math.round(progressPercentage) + "%");
              $(".progressName").text("Bill ");
              if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                } else {
                  $('.headerprogressbar').addClass('headerprogressbarShow');
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

              } else if (Math.round(progressPercentage) >= 100) {
                $('.checkmarkwrapper').removeClass("hide");
                templateObject.dashboardRedirectOnLogin();
              }
              addVS1Data('TBillEx', JSON.stringify(data));
              $("<span class='process'>Bills Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
              templateObject.getFollowedAllObjectPull();
            }).catch(function (err) {
              templateObject.getFollowedAllObjectPull();
            });
          });

        }
        setTimeout(function () {
          if (isBanking) {
            getVS1Data('TCheque').then(function (dataObject) {
              if (dataObject.length == 0) {
                templateObject.getAllTChequeData();
              } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tchequeex;
                if (useData.length > 0) {
                  if (useData[0].Id) {
                    templateObject.getAllTChequeData();
                  } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                      if (loggedUserEventFired) {
                        if (getTimeStamp[0] != currenctTodayDate) {
                          templateObject.getAllTChequeData();
                        }
                      }
                    }
                  }
                } else {
                  templateObject.getAllTChequeData();
                }
              }
            }).catch(function (err) {
              templateObject.getAllTChequeData();
            });

          }
        }, 2000);
      }, 2000);

    }

    //Followed by Purchase Details
    templateObject.getFollowedPurchaseDetailsPull = function () {
      setTimeout(function () {
        if (isPurchases) {
          getVS1Data('TPurchaseOrderEx').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTPurchaseOrderData();
              sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function (data) {
                countObjectTimes++;
                progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
                $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                $(".progressName").text("Purchase Order ");
                if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                  if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  } else {
                    $('.headerprogressbar').addClass('headerprogressbarShow');
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  }

                } else if (Math.round(progressPercentage) >= 100) {
                  $('.checkmarkwrapper').removeClass("hide");
                  templateObject.dashboardRedirectOnLogin();
                }
                addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
                $("<span class='process'>Purchase Orders Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                //templateObject.getFollowedAllObjectPull();
                templateObject.getFollowedBillDetailsPull();
              }).catch(function (err) {
                //templateObject.getFollowedAllObjectPull();
                templateObject.getFollowedBillDetailsPull();
              });
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tpurchaseorderex;
              if (useData[0].Id) {
                sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function (data) {
                  countObjectTimes++;
                  progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                  $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                  //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
                  $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                  $(".progressName").text("Purchase Order ");
                  if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                    if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                      $('.headerprogressbar').removeClass('headerprogressbarHidden');
                    } else {
                      $('.headerprogressbar').addClass('headerprogressbarShow');
                      $('.headerprogressbar').removeClass('headerprogressbarHidden');
                    }

                  } else if (Math.round(progressPercentage) >= 100) {
                    $('.checkmarkwrapper').removeClass("hide");
                    templateObject.dashboardRedirectOnLogin();
                  }
                  addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
                  $("<span class='process'>Purchase Order Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                  //templateObject.getFollowedAllObjectPull();
                  templateObject.getFollowedBillDetailsPull();
                }).catch(function (err) {
                  //templateObject.getFollowedAllObjectPull();
                  templateObject.getFollowedBillDetailsPull();
                });
              } else {
                let getTimeStamp = dataObject[0].timestamp.split(' ');
                if (getTimeStamp) {
                  if (loggedUserEventFired) {
                    if (getTimeStamp[0] != currenctTodayDate) {
                      sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function (data) {
                        countObjectTimes++;
                        progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                        $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                        //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
                        $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                        $(".progressName").text("Purchase Order ");
                        if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                          if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                            $('.headerprogressbar').removeClass('headerprogressbarHidden');
                          } else {
                            $('.headerprogressbar').addClass('headerprogressbarShow');
                            $('.headerprogressbar').removeClass('headerprogressbarHidden');
                          }

                        } else if (Math.round(progressPercentage) >= 100) {
                          $('.checkmarkwrapper').removeClass("hide");
                          templateObject.dashboardRedirectOnLogin();
                        }
                        addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
                        $("<span class='process'>Purchase Order Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                        //templateObject.getFollowedAllObjectPull();
                        templateObject.getFollowedBillDetailsPull();
                      }).catch(function (err) {
                        //templateObject.getFollowedAllObjectPull();
                        templateObject.getFollowedBillDetailsPull();
                      });
                    } else {
                      templateObject.getFollowedBillDetailsPull();
                    }
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllTPurchaseOrderData();
            sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function (data) {
              countObjectTimes++;
              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
              //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
              $(".progressBarInner").text(Math.round(progressPercentage) + "%");
              $(".progressName").text("Purchase Order ");
              if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                } else {
                  $('.headerprogressbar').addClass('headerprogressbarShow');
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

              } else if (Math.round(progressPercentage) >= 100) {
                $('.checkmarkwrapper').removeClass("hide");
                templateObject.dashboardRedirectOnLogin();
              }
              addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
              $("<span class='process'>Purchase Order Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
              //templateObject.getFollowedAllObjectPull();
              templateObject.getFollowedBillDetailsPull();
            }).catch(function (err) {
              //templateObject.getFollowedAllObjectPull();
              templateObject.getFollowedBillDetailsPull();

            });
          });


          getVS1Data('TpurchaseOrderBackOrder').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTpurchaseOrderBackOrderData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllTpurchaseOrderBackOrderData();
          });
        } else {
          templateObject.getFollowedAllObjectPull();
          if (isBanking) {
            getVS1Data('TCheque').then(function (dataObject) {
              if (dataObject.length == 0) {
                templateObject.getAllTChequeData();
              } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tchequeex;
                if (useData.length > 0) {
                  if (useData[0].Id) {
                    templateObject.getAllTChequeData();
                  } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                      if (loggedUserEventFired) {
                        if (getTimeStamp[0] != currenctTodayDate) {
                          templateObject.getAllTChequeData();
                        }
                      }
                    }
                  }
                } else {
                  templateObject.getAllTChequeData();
                }
              }
            }).catch(function (err) {
              templateObject.getAllTChequeData();
            });

          }
          //templateObject.getFollowedBillDetailsPull();
        }


      }, 300);

    }
    /* Quick Objects*/
    templateObject.getFollowedQuickDataDetailsPull = function () {
      setTimeout(function () {
        if (isSettings) {
          getVS1Data('TTaxcodeVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTaxCodeData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllTaxCodeData();
          });
        }
        if (isSettings) {
          getVS1Data('TTermsVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTermsData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllTermsData();
          });
        }
        if (isSettings) {
          getVS1Data('TDeptClass').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllDepartmentData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllDepartmentData();
          });
        }
        if (isCurrencyEnable) {
          if ((!isSettings) && (!isSales)) {

          } else {
            getVS1Data('TCurrency').then(function (dataObject) {
              if (dataObject.length == 0) {
                templateObject.getAllCurrencyData();
              } else { }
            }).catch(function (err) {
              templateObject.getAllCurrencyData();
            });
          }
        }

        if (isSettings) {
          getVS1Data('TCountries').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getTCountriesData();
            } else { }
          }).catch(function (err) {
            templateObject.getTCountriesData();
          });
        } else {
          if (isContacts) {
            getVS1Data('TCountries').then(function (dataObject) {
              if (dataObject.length == 0) {
                templateObject.getTCountriesData();
              } else { }
            }).catch(function (err) {
              templateObject.getTCountriesData();
            });
          }
        }

        if (isSettings) {
          getVS1Data('TPaymentMethod').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getTPaymentMethodData();
            } else { }
          }).catch(function (err) {
            templateObject.getTPaymentMethodData();
          });
        }

        if ((!isContacts) || (!isInventory)) {

        } else {
          getVS1Data('TClientType').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getTClientTypeData();
            } else { }
          }).catch(function (err) {
            templateObject.getTClientTypeData();
          });

        }

        if (isSales) {
          getVS1Data('TLeadStatusType').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllLeadStatusData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllLeadStatusData();
          });
        }
        if (isContacts) {
          getVS1Data('TShippingMethod').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllShippingMethodData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllShippingMethodData();
          });
        }
        if (isAccounts) {
          getVS1Data('TAccountType').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllAccountTypeData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllAccountTypeData();
          });
        }

        if (isSettings) {
          getVS1Data('TERPForm').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllERPFormData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllERPFormData();
          });

          getVS1Data('TEmployeeFormAccessDetail').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllEmployeeFormAccessDetailData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllEmployeeFormAccessDetailData();
          });
        }

        if (isAppointmentScheduling) {
          if (isContacts) {

          } else {
            templateObject.getAllEmployeeData();
          }

          getVS1Data('TAppointment').then(function (dataObject) {
            if (dataObject.length == 0) {
              sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function (data) {
                countObjectTimes++;
                progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                //$(".progressBarInner").text("Appointment "+Math.round(progressPercentage)+"%");
                $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                $(".progressName").text("Appointment ");
                if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                  if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  } else {
                    $('.headerprogressbar').addClass('headerprogressbarShow');
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  }

                } else if (Math.round(progressPercentage) >= 100) {
                  $('.checkmarkwrapper').removeClass("hide");
                  templateObject.dashboardRedirectOnLogin();
                }
                addVS1Data('TAppointment', JSON.stringify(data));
                $("<span class='process'>Appointments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");

                setTimeout(function () {
                  templateObject.getFollowedPurchaseDetailsPull();
                  templateObject.getAllAppointmentListData();
                }, 1000);
              }).catch(function (err) {
                setTimeout(function () {
                  templateObject.getFollowedPurchaseDetailsPull();
                  templateObject.getAllAppointmentListData();
                }, 1000);
              });

            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function (data) {
                      countObjectTimes++;
                      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                      //$(".progressBarInner").text("Appointment "+Math.round(progressPercentage)+"%");
                      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                      $(".progressName").text("Appointment ");
                      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        } else {
                          $('.headerprogressbar').addClass('headerprogressbarShow');
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }

                      } else if (Math.round(progressPercentage) >= 100) {
                        $('.checkmarkwrapper').removeClass("hide");
                        templateObject.dashboardRedirectOnLogin();
                      }
                      addVS1Data('TAppointment', JSON.stringify(data));
                      $("<span class='process'>Appointments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                      setTimeout(function () {
                        templateObject.getFollowedPurchaseDetailsPull();
                        templateObject.getAllAppointmentListData();
                      }, 1000);
                    }).catch(function (err) {
                      setTimeout(function () {
                        templateObject.getFollowedPurchaseDetailsPull();
                        templateObject.getAllAppointmentListData();
                      }, 1000);
                    });
                  } else {
                    setTimeout(function () {
                      templateObject.getFollowedPurchaseDetailsPull();
                      templateObject.getAllAppointmentListData();
                    }, 1000);
                  }
                }
              }
            }
          }).catch(function (err) {
            sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function (data) {
              countObjectTimes++;
              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
              //$(".progressBarInner").text("Appointment "+Math.round(progressPercentage)+"%");
              $(".progressBarInner").text(Math.round(progressPercentage) + "%");
              $(".progressName").text("Appointment ");
              if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                } else {
                  $('.headerprogressbar').addClass('headerprogressbarShow');
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

              } else if (Math.round(progressPercentage) >= 100) {
                $('.checkmarkwrapper').removeClass("hide");
                templateObject.dashboardRedirectOnLogin();
              }
              addVS1Data('TAppointment', JSON.stringify(data));
              $("<span class='process'>Appointments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
              setTimeout(function () {
                templateObject.getFollowedPurchaseDetailsPull();
                templateObject.getAllAppointmentListData();
              }, 1000);
            }).catch(function (err) {
              setTimeout(function () {
                templateObject.getFollowedPurchaseDetailsPull();
                templateObject.getAllAppointmentListData();
              }, 1000);
            });
          });
          getVS1Data('TAppointmentPreferences').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllAppointmentPrefData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllAppointmentPrefData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllAppointmentPrefData();
          });

          getVS1Data('TERPPreference').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTERPPreferenceData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllTERPPreferenceData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllTERPPreferenceData();
          });

          getVS1Data('TERPPreferenceExtra').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTERPPreferenceExtraData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllTERPPreferenceExtraData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllTERPPreferenceExtraData();
          });
        } else {
          setTimeout(function () {
            templateObject.getFollowedPurchaseDetailsPull();
          }, 1000);
        }

      }, 300);
    }
    /* End Quick Objects */


    //Followed By Sales Details
    templateObject.getFollowedSalesDetailsPull = function () {
      setTimeout(function () {
        if (isCRM) {
          getVS1Data('TCRMTaskList').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllCRMData();
            } else { }
          }).catch(function (err) {
            templateObject.getAllCRMData();
          });
        }

        if (isSales) {
          getVS1Data('TSalesList').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTSalesListData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllTSalesListData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllTSalesListData();
          });

          getVS1Data('TInvoiceEx').then(function (dataObject) {
            if (dataObject.length == 0) {
              sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function (data) {
                countObjectTimes++;
                progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                //$(".progressBarInner").text("Invoice "+Math.round(progressPercentage)+"%");
                $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                $(".progressName").text("Invoice ");
                if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                  if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  } else {
                    $('.headerprogressbar').addClass('headerprogressbarShow');
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  }

                } else if (Math.round(progressPercentage) >= 100) {
                  $('.checkmarkwrapper').removeClass("hide");
                  templateObject.dashboardRedirectOnLogin();
                }
                addVS1Data('TInvoiceEx', JSON.stringify(data));
                $("<span class='process'>Invoices Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                templateObject.getFollowedQuickDataDetailsPull();
              }).catch(function (err) {
                templateObject.getFollowedQuickDataDetailsPull();
              });
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tinvoiceex;
              if (useData[0].Id) {
                sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function (data) {
                  countObjectTimes++;
                  progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                  $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                  //$(".progressBarInner").text("Invoice "+Math.round(progressPercentage)+"%");
                  $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                  $(".progressName").text("Invoice ");
                  if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                    if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                      $('.headerprogressbar').removeClass('headerprogressbarHidden');
                    } else {
                      $('.headerprogressbar').addClass('headerprogressbarShow');
                      $('.headerprogressbar').removeClass('headerprogressbarHidden');
                    }

                  } else if (Math.round(progressPercentage) >= 100) {
                    $('.checkmarkwrapper').removeClass("hide");
                    templateObject.dashboardRedirectOnLogin();
                  }
                  addVS1Data('TInvoiceEx', JSON.stringify(data));
                  $("<span class='process'>Invoices Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                  //setTimeout(function() {
                  templateObject.getFollowedQuickDataDetailsPull();
                  //}, 300);
                }).catch(function (err) {
                  //setTimeout(function() {
                  templateObject.getFollowedQuickDataDetailsPull();
                  //}, 300);
                });
              } else {

                let getTimeStamp = dataObject[0].timestamp.split(' ');
                if (getTimeStamp) {
                  if (loggedUserEventFired) {
                    if (getTimeStamp[0] != currenctTodayDate) {
                      sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function (data) {
                        countObjectTimes++;
                        progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                        $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                        //$(".progressBarInner").text("Invoice "+Math.round(progressPercentage)+"%");
                        $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                        $(".progressName").text("Invoice ");
                        if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                          if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                            $('.headerprogressbar').removeClass('headerprogressbarHidden');
                          } else {
                            $('.headerprogressbar').addClass('headerprogressbarShow');
                            $('.headerprogressbar').removeClass('headerprogressbarHidden');
                          }

                        } else if (Math.round(progressPercentage) >= 100) {
                          $('.checkmarkwrapper').removeClass("hide");
                          templateObject.dashboardRedirectOnLogin();
                        }
                        addVS1Data('TInvoiceEx', JSON.stringify(data));
                        $("<span class='process'>Invoices Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                        //setTimeout(function() {
                        templateObject.getFollowedQuickDataDetailsPull();
                        //  }, 300);
                      }).catch(function (err) {
                        //setTimeout(function() {
                        templateObject.getFollowedQuickDataDetailsPull();
                        //}, 300);
                      });
                    } else {
                      templateObject.getFollowedQuickDataDetailsPull();
                    }
                  }
                }

              }
            }
          }).catch(function (err) {
            sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function (data) {
              countObjectTimes++;
              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
              //$(".progressBarInner").text("Invoice "+Math.round(progressPercentage)+"%");
              $(".progressBarInner").text(Math.round(progressPercentage) + "%");
              $(".progressName").text("Invoice ");
              if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                } else {
                  $('.headerprogressbar').addClass('headerprogressbarShow');
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

              } else if (Math.round(progressPercentage) >= 100) {
                $('.checkmarkwrapper').removeClass("hide");
                templateObject.dashboardRedirectOnLogin();
              }
              addVS1Data('TInvoiceEx', JSON.stringify(data));
              $("<span class='process'>Invoices Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
              //setTimeout(function() {
              templateObject.getFollowedQuickDataDetailsPull();
              //}, 300);
            }).catch(function (err) {
              //setTimeout(function() {
              templateObject.getFollowedQuickDataDetailsPull();
              //}, 300);
            });
          });
          templateObject.getAllInvoiceListData();
          getVS1Data('TSalesOrderEx').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllSalesOrderExListData();
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tsalesorderex;
              if (useData[0].Id) {
                templateObject.getAllSalesOrderExListData();
              } else {
                let getTimeStamp = dataObject[0].timestamp.split(' ');
                if (getTimeStamp) {
                  if (loggedUserEventFired) {
                    if (getTimeStamp[0] != currenctTodayDate) {
                      templateObject.getAllSalesOrderExListData();
                    }
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllSalesOrderExListData();
          });

          getVS1Data('TRefundSale').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllRefundListData();
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.trefundsale;
              if (useData[0].Id) {
                templateObject.getAllRefundListData();
              } else {
                let getTimeStamp = dataObject[0].timestamp.split(' ');
                if (getTimeStamp) {
                  if (loggedUserEventFired) {
                    if (getTimeStamp[0] != currenctTodayDate) {
                      templateObject.getAllRefundListData();
                    }
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllRefundListData();
          });


          // getVS1Data('BackOrderSalesList').then(function(dataObject) {
          //     if (dataObject.length == 0) {
          //         templateObject.getAllBOInvoiceListData();
          //     } else {}
          // }).catch(function(err) {
          //     templateObject.getAllBOInvoiceListData();
          // });

          getVS1Data('TQuote').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTQuoteData();
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tquoteex;
              if (useData.length > 0) {
                if (useData[0].Id) {
                  templateObject.getAllTQuoteData();
                } else {
                  let getTimeStamp = dataObject[0].timestamp.split(' ');
                  if (getTimeStamp) {
                    if (loggedUserEventFired) {
                      if (getTimeStamp[0] != currenctTodayDate) {
                        templateObject.getAllTQuoteData();
                      }
                    }
                  }
                }
              } else {
                templateObject.getAllTQuoteData();
              }


            }
          }).catch(function (err) {
            templateObject.getAllTQuoteData();
          });

        } else {
          templateObject.getFollowedQuickDataDetailsPull();
        }

        if (isShipping) {
          getVS1Data('TInvoiceBackOrder').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllBackOrderInvoicetData();
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tinvoicebackorder;
              if (useData[0].Id) {
                templateObject.getAllBackOrderInvoicetData();
              } else {
                let getTimeStamp = dataObject[0].timestamp.split(' ');
                if (getTimeStamp) {
                  if (loggedUserEventFired) {
                    if (getTimeStamp[0] != currenctTodayDate) {
                      templateObject.getAllBackOrderInvoicetData();
                    }
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllBackOrderInvoicetData();
          });
        } else {
          allDataToLoad = allDataToLoad - 1;
        }

      }, 300);
    }


    //Followed By Contact Details
    templateObject.getFollowedContactDetailsPull = function () {
      setTimeout(function () {
        if (isContacts) {
          var currentBeginDate = new Date();
          var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
          let fromDateMonth = (currentBeginDate.getMonth() + 1)
          let fromDateDay = currentBeginDate.getDate();
          if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
          } else {
            fromDateMonth = (currentBeginDate.getMonth() + 1);
          }

          if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
          }
          var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
          let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
          getVS1Data('TERPCombinedContactsVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
              sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0).then(function (data) {
                // sideBarService.getAllContactCombineVS1(initialDataLoad, 0).then(function(data) {
                countObjectTimes++;
                progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                //$(".progressBarInner").text("Contacts "+Math.round(progressPercentage)+"%");
                $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                $(".progressName").text("Contacts ");
                if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                  if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  } else {
                    $('.headerprogressbar').addClass('headerprogressbarShow');
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  }

                } else if (Math.round(progressPercentage) >= 100) {
                  $('.checkmarkwrapper').removeClass("hide");
                  templateObject.dashboardRedirectOnLogin();
                }
                addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
                $("<span class='process'>Contacts Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                templateObject.getFollowedSalesDetailsPull();
              }).catch(function (err) {
                templateObject.getFollowedSalesDetailsPull();
              });
            } else {
              templateObject.getFollowedSalesDetailsPull();
            }
          }).catch(function (err) {
            sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0).then(function (data) {
              // sideBarService.getAllContactCombineVS1(initialDataLoad, 0).then(function(data) {
              countObjectTimes++;
              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
              //$(".progressBarInner").text("Contacts "+Math.round(progressPercentage)+"%");
              $(".progressBarInner").text(Math.round(progressPercentage) + "%");
              $(".progressName").text("Contacts ");
              if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                } else {
                  $('.headerprogressbar').addClass('headerprogressbarShow');
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

              } else if (Math.round(progressPercentage) >= 100) {
                $('.checkmarkwrapper').removeClass("hide");
                templateObject.dashboardRedirectOnLogin();
              }
              addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
              $("<span class='process'>Contacts Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
              templateObject.getFollowedSalesDetailsPull();
            }).catch(function (err) {
              templateObject.getFollowedSalesDetailsPull();
            });
          });

          getVS1Data('TCustomerVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllCustomersData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllCustomersData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllCustomersData();
          });

          getVS1Data('TJobVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTJobVS1Data();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllTJobVS1Data();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllTJobVS1Data();
          });

          getVS1Data('TSupplierVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllSuppliersData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllSuppliersData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllSuppliersData();
          });

          getVS1Data('TEmployee').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllEmployeeData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllEmployeeData();
                  }
                }
              }
            }
          }).catch(function (err) {
            templateObject.getAllEmployeeData();
          });
        } else {
          templateObject.getFollowedSalesDetailsPull();
        }

      }, 250);
    }

    //If launching Appoing. Don't worry about the rest
    if (isAppointmentLaunch) {
      if (isAppointmentScheduling) {

        getVS1Data('TAppointment').then(function (dataObject) {
          if (dataObject.length == 0) {
            templateObject.getAllAppointmentData();
          } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
              if (loggedUserEventFired) {
                if (getTimeStamp[0] != currenctTodayDate) {
                  templateObject.getAllAppointmentData();
                }
              }
            }
          }
        }).catch(function (err) {
          templateObject.getAllAppointmentData();
        });

        getVS1Data('TAppointmentPreferences').then(function (dataObject) {
          if (dataObject.length == 0) {
            templateObject.getAllAppointmentPrefData();
          } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
              if (loggedUserEventFired) {
                if (getTimeStamp[0] != currenctTodayDate) {
                  templateObject.getAllAppointmentPrefData();
                }
              }
            }
          }
        }).catch(function (err) {
          templateObject.getAllAppointmentPrefData();
        });

        getVS1Data('TERPPreference').then(function (dataObject) {
          if (dataObject.length == 0) {
            templateObject.getAllTERPPreferenceData();
          } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
              if (loggedUserEventFired) {
                if (getTimeStamp[0] != currenctTodayDate) {
                  templateObject.getAllTERPPreferenceData();
                }
              }
            }
          }
        }).catch(function (err) {
          templateObject.getAllTERPPreferenceData();
        });

        getVS1Data('TERPPreferenceExtra').then(function (dataObject) {
          if (dataObject.length == 0) {
            templateObject.getAllTERPPreferenceExtraData();
          } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
              if (loggedUserEventFired) {
                if (getTimeStamp[0] != currenctTodayDate) {
                  templateObject.getAllTERPPreferenceExtraData();
                }
              }
            }
          }
        }).catch(function (err) {
          templateObject.getAllTERPPreferenceExtraData();
        });
      }
      setTimeout(function () {
        if (isInventory) {
          if (isPayroll || isAppointmentScheduling) {
            getVS1Data('TProductWeb').then(function (dataObject) {
              if (dataObject.length == 0) {
                templateObject.getAllProductServiceData();
              } else {
                let getTimeStamp = dataObject[0].timestamp.split(' ');
                if (getTimeStamp) {
                  if (loggedUserEventFired) {
                    if (getTimeStamp[0] != currenctTodayDate) {
                      templateObject.getAllProductServiceData();
                    }
                  }
                }

              }
            }).catch(function (err) {
              templateObject.getAllProductServiceData();
            });
          }
          getVS1Data('TProductVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
              sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (data) {
                countObjectTimes++;
                progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
                $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                $(".progressName").text("Product ");
                if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                  if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  } else {
                    $('.headerprogressbar').addClass('headerprogressbarShow');
                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                  }

                } else if (Math.round(progressPercentage) >= 100) {
                  $('.checkmarkwrapper').removeClass("hide");
                  templateObject.dashboardRedirectOnLogin();
                }
                addVS1Data('TProductVS1', JSON.stringify(data));
                $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                templateObject.getFollowedContactDetailsPull();
              }).catch(function (err) {
                templateObject.getFollowedContactDetailsPull();
              });
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (data) {
                      countObjectTimes++;
                      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                      //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
                      $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                      $(".progressName").text("Product ");
                      if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                        if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        } else {
                          $('.headerprogressbar').addClass('headerprogressbarShow');
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }

                      } else if (Math.round(progressPercentage) >= 100) {
                        $('.checkmarkwrapper').removeClass("hide");
                        templateObject.dashboardRedirectOnLogin();
                      }
                      addVS1Data('TProductVS1', JSON.stringify(data));
                      $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                      templateObject.getFollowedContactDetailsPull();
                    }).catch(function (err) {
                      templateObject.getFollowedContactDetailsPull();
                    });
                  } else {
                    templateObject.getFollowedContactDetailsPull();
                  }
                }
              }
            }
          }).catch(function (err) {
            sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (data) {
              countObjectTimes++;
              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
              //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
              $(".progressBarInner").text(Math.round(progressPercentage) + "%");
              $(".progressName").text("Product ");
              if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                } else {
                  $('.headerprogressbar').addClass('headerprogressbarShow');
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

              } else if (Math.round(progressPercentage) >= 100) {
                $('.checkmarkwrapper').removeClass("hide");
                templateObject.dashboardRedirectOnLogin();
              }
              addVS1Data('TProductVS1', JSON.stringify(data));
              $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
              templateObject.getFollowedContactDetailsPull();
            }).catch(function (err) {
              templateObject.getFollowedContactDetailsPull();
            });
          });
          templateObject.getAllProductData();

          getVS1Data('T_VS1_Report_Productmovement').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllRecentTransactions();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllRecentTransactions();
                  }
                }
              }

            }
          }).catch(function (err) {
            templateObject.getAllRecentTransactions();
          });
          getVS1Data('TProductStocknSalePeriodReport').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTProductStocknSalePeriodReportData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllTProductStocknSalePeriodReportData();
                  }
                }
              }

            }
          }).catch(function (err) {
            templateObject.getAllTProductStocknSalePeriodReportData();
          });

          getVS1Data('TStockTransferEntry').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllTStockTransferEntryData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllTStockTransferEntryData();
                  }
                }
              }

            }
          }).catch(function (err) {
            templateObject.getAllTProductStocknSalePeriodReportData();
          });
        } else {
          sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (data) {
            countObjectTimes++;
            progressPercentage = (countObjectTimes * 100) / allDataToLoad;
            $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
            //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
            $(".progressBarInner").text(Math.round(progressPercentage) + "%");
            $(".progressName").text("Product ");
            if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
              if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                $('.headerprogressbar').removeClass('headerprogressbarHidden');
              } else {
                $('.headerprogressbar').addClass('headerprogressbarShow');
                $('.headerprogressbar').removeClass('headerprogressbarHidden');
              }

            } else if (Math.round(progressPercentage) >= 100) {
              $('.checkmarkwrapper').removeClass("hide");
              templateObject.dashboardRedirectOnLogin();
            }
            addVS1Data('TProductVS1', JSON.stringify(data));
            $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            templateObject.getFollowedContactDetailsPull();
          }).catch(function (err) {
            templateObject.getFollowedContactDetailsPull();
          });
        }
      }, 1000);
    } else {
      if (isAccounts) {
        getVS1Data('TAccountVS1').then(function (dataObject) {
          if (dataObject.length == 0) {
            templateObject.getAllAccountsData();
          } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
              if (loggedUserEventFired) {
                if (getTimeStamp[0] != currenctTodayDate) {
                  templateObject.getAllAccountsData();
                }
              }
            }
          }
        }).catch(function (err) {
          templateObject.getAllAccountsData();
        });
      }
      if (isInventory) {
        if (isPayroll || isAppointmentScheduling) {
          getVS1Data('TProductWeb').then(function (dataObject) {
            if (dataObject.length == 0) {
              templateObject.getAllProductServiceData();
            } else {
              let getTimeStamp = dataObject[0].timestamp.split(' ');
              if (getTimeStamp) {
                if (loggedUserEventFired) {
                  if (getTimeStamp[0] != currenctTodayDate) {
                    templateObject.getAllProductServiceData();
                  }
                }
              }

            }
          }).catch(function (err) {
            templateObject.getAllProductServiceData();
          });
        }
        getVS1Data('TProductVS1').then(function (dataObject) {
          if (dataObject.length == 0) {
            sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (data) {
              countObjectTimes++;
              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
              //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
              $(".progressBarInner").text(Math.round(progressPercentage) + "%");
              $(".progressName").text("Product ");
              if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                } else {
                  $('.headerprogressbar').addClass('headerprogressbarShow');
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

              } else if (Math.round(progressPercentage) >= 100) {
                $('.checkmarkwrapper').removeClass("hide");
                templateObject.dashboardRedirectOnLogin();
              }
              addVS1Data('TProductVS1', JSON.stringify(data));
              $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
              templateObject.getFollowedContactDetailsPull();
            }).catch(function (err) {
              templateObject.getFollowedContactDetailsPull();
            });
          } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
              if (loggedUserEventFired) {
                if (getTimeStamp[0] != currenctTodayDate) {
                  sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (data) {
                    countObjectTimes++;
                    progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                    $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                    //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
                    $(".progressBarInner").text(Math.round(progressPercentage) + "%");
                    $(".progressName").text("Product ");
                    if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
                      if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                      } else {
                        $('.headerprogressbar').addClass('headerprogressbarShow');
                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                      }

                    } else if (Math.round(progressPercentage) >= 100) {
                      $('.checkmarkwrapper').removeClass("hide");
                      templateObject.dashboardRedirectOnLogin();
                    }
                    addVS1Data('TProductVS1', JSON.stringify(data));
                    $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                    templateObject.getFollowedContactDetailsPull();
                  }).catch(function (err) {
                    templateObject.getFollowedContactDetailsPull();
                  });
                } else {
                  templateObject.getFollowedContactDetailsPull();
                }
              }
            }
          }
        }).catch(function (err) {
          sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (data) {
            countObjectTimes++;
            progressPercentage = (countObjectTimes * 100) / allDataToLoad;
            $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
            //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
            $(".progressBarInner").text(Math.round(progressPercentage) + "%");
            $(".progressName").text("Product ");
            if ((progressPercentage > 0) && (Math.round(progressPercentage) != 100)) {
              if ($('.headerprogressbar').hasClass("headerprogressbarShow")) {
                $('.headerprogressbar').removeClass('headerprogressbarHidden');
              } else {
                $('.headerprogressbar').addClass('headerprogressbarShow');
                $('.headerprogressbar').removeClass('headerprogressbarHidden');
              }

            } else if (Math.round(progressPercentage) >= 100) {
              $('.checkmarkwrapper').removeClass("hide");
              templateObject.dashboardRedirectOnLogin();
            }
            addVS1Data('TProductVS1', JSON.stringify(data));
            $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            templateObject.getFollowedContactDetailsPull();
          }).catch(function (err) {
            templateObject.getFollowedContactDetailsPull();
          });
        });
        templateObject.getAllProductData();

        getVS1Data('T_VS1_Report_Productmovement').then(function (dataObject) {
          if (dataObject.length == 0) {
            templateObject.getAllRecentTransactions();
          } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
              if (loggedUserEventFired) {
                if (getTimeStamp[0] != currenctTodayDate) {
                  templateObject.getAllRecentTransactions();
                }
              }
            }

          }
        }).catch(function (err) {
          templateObject.getAllRecentTransactions();
        });

        getVS1Data('TProductStocknSalePeriodReport').then(function (dataObject) {
          if (dataObject.length == 0) {
            templateObject.getAllTProductStocknSalePeriodReportData();
          } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
              if (loggedUserEventFired) {
                if (getTimeStamp[0] != currenctTodayDate) {
                  templateObject.getAllTProductStocknSalePeriodReportData();
                }
              }
            }

          }
        }).catch(function (err) {
          templateObject.getAllTProductStocknSalePeriodReportData();
        });

        getVS1Data('TStockTransferEntry').then(function (dataObject) {
          if (dataObject.length == 0) {
            templateObject.getAllTStockTransferEntryData();
          } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
              if (loggedUserEventFired) {
                if (getTimeStamp[0] != currenctTodayDate) {
                  templateObject.getAllTStockTransferEntryData();
                }
              }
            }

          }
        }).catch(function (err) {
          templateObject.getAllTProductStocknSalePeriodReportData();
        });
      } else {
        templateObject.getFollowedContactDetailsPull();
      }
    }
  }

  setTimeout(function () {
    localStorage.setItem('LoggedUserEventFired', false);
  }, 2500);


    templateObject.dashboardRedirectOnLogin = async function() {
    let dataReturnRes = await getVS1Data('VS1_Dashboard');

    if (dataReturnRes.length > 0) {
      let vs1DashboardData = JSON.parse(dataReturnRes[0].data);
      if(vs1DashboardData.ProcessLog.TUser.LoginDefault == "Accounts"){
        FlowRouter.go('/dashboard');
      }else if(vs1DashboardData.ProcessLog.TUser.LoginDefault == "Executive"){
        FlowRouter.go('/dashboardexe');
      }else if(vs1DashboardData.ProcessLog.TUser.LoginDefault == "Marketing"){
        FlowRouter.go('/dashboardsalesmanager');
      }else if(vs1DashboardData.ProcessLog.TUser.LoginDefault == "Sales"){
        FlowRouter.go('/dashboardsales');
      }else if(vs1DashboardData.ProcessLog.TUser.LoginDefault == "Sales Manager"){
        FlowRouter.go('/dashboardsalesmanager');
      }else{
        if (isAppointmentScheduling == true) {
            if (isAllocationLaunch == true) {
              FlowRouter.go('/appointments#allocationModal');
            } else if (isAppointmentLaunch == true) {
               FlowRouter.go('/appointments');
            } else {
               FlowRouter.go('/dashboard');
            }
        } else {
           FlowRouter.go('/dashboard');
        };
      }
    }else{
        if (isAppointmentScheduling == true) {
          if (isAllocationLaunch == true) {
            FlowRouter.go('/appointments#allocationModal');
          } else if (isAppointmentLaunch == true) {
             FlowRouter.go('/appointments');
          } else {
             FlowRouter.go('/dashboard');
          }
      } else {
         FlowRouter.go('/dashboard');
      };
    }
  };
    // templateObject.dashboardRedirectOnLogin();
});

Template.onsuccesswaterfall.helpers({
  formname: () => {
    let chequeSpelling = "";
    if (localStorage.getItem('ERPLoggedCountry') == "Australia") {
      chequeSpelling = "Cheque";
    } else if (localStorage.getItem('ERPLoggedCountry') == "United States of America") {
      chequeSpelling = "Check";
    } else {
      chequeSpelling = "Cheque";
    }
    return chequeSpelling;
  },
  loggedFirstName: () => {
      const loggedEmployeedName1 = localStorage.getItem('vs1LoggedEmployeeName').split(" ");
      return loggedEmployeedName1;
  }
});
