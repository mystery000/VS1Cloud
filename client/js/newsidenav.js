import { Template } from 'meteor/templating';

import { AccessLevelService } from './accesslevel-service.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { ProductService } from "../product/product-service.js";
import { UtilityService } from "../utility-service.js";
import { SideBarService } from '../js/sidebar-service.js';
import { OrganisationService } from "../js/organisation-service";

import '../lib/global/indexdbstorage.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '../Navigation/newsidenav.html';

const productService = new ProductService();
const sideBarService = new SideBarService();
const organisationService = new OrganisationService();

Template.newsidenav.onCreated(function () {
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
  sideBarService.getVS1MenuConfig().then((data) => {
    if (data.tpreference && !!data.tpreference.length) {
      const latestAction = data.tpreference[data.tpreference.length - 1];
      const menuItem = JSON.parse(latestAction.PrefValue);
      if (menuItem.Location === "TopMenu") {
        templateObject.sideBarPositionClass.set('top');
        $('#sidebar').addClass('top');
        $('#bodyContainer').addClass('top');
        $('#sidebarToggleBtn .text').text('Side');
      } else {
        templateObject.sideBarPositionClass.set('side');
        $('#sidebar').removeClass('top');
        $('#bodyContainer').removeClass('top');
        $('#sidebarToggleBtn .text').text('Top');
      }
    } else {
      templateObject.sideBarPositionClass.set('side');
      $('#sidebar').removeClass('top');
      $('#bodyContainer').removeClass('top');
      $('#sidebarToggleBtn .text').text('Top');
    }
  });
  $(document).ready(function () {
    var erpGet = erpDb();
    var LoggedDB = erpGet.ERPDatabase;
    var loc = FlowRouter.current().path;
  });
});
Template.newsidenav.onRendered(function () {
  // var countObjectTimes = 0;
  // let allDataToLoad = 93;
  // let progressPercentage = 0;
  let templateObject = Template.instance();

  let vS1FormAccessDetail = localStorage.getItem('VS1FormAccessDetail');
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
  let cloudPackage = localStorage.getItem('vs1cloudlicenselevel');
  // here get menu bar preference from local storage and set menubarPositionClass
  // let isMenuBarSide = localStorage.getItem('menubarpreference')
  if (cloudPackage == "PLUS") {
    templateObject.isSNTrackChecked.set(true);
  } else {
    templateObject.isSNTrackChecked.set(false);
  }

  function MyPopper(button, popper) {
    this.timer = null;
    this.bounder = $('#popperBounder');
    this.button = $(button);
    this.popper = $(popper).clone().appendTo(this.bounder);
    this.popper.hover(() => {
      clearTimeout(this.timer);
    }, () => {
      this.timer = setTimeout(() => {
        this.timer = null;
        this.hidePopper();
      }, 1500);
    });

    this.arrow = $('<div class="popper-arrow"></div>').appendTo(this.popper);
  }
  MyPopper.prototype.createInstance = function () {
    this.instance = Popper.createPopper(this.button[0], this.popper[0], {
      placement: "bottom", //preferred placement of popper
      modifiers: [{
        name: "offset", //offsets popper from the reference/button
        options: {
          offset: [0, 8]
        }
      },
      {
        name: "flip", //flips popper with allowed placements
        options: {
          allowedAutoPlacements: ["right", "left", "top", "bottom"],
          rootBoundary: "viewport"
        }
      },
      {
        name: 'preventOverflow',
        options: {
          boundary: this.bounder[0],
        },
      },
      ]
    });
  }
  MyPopper.prototype.destroyInstance = function () {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }
  MyPopper.prototype.showPopper = function () {
    this.popper.addClass('popper-popup');
    this.popper.attr("show-popper", "");
    this.arrow.attr("data-popper-arrow", "");
    this.createInstance();
  }
  MyPopper.prototype.hidePopper = function () {
    this.popper.removeClass('popper-popup');
    this.popper.removeClass('show');
    this.popper.removeAttr("show-popper");
    this.arrow.removeAttr("data-popper-arrow");
    this.destroyInstance();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  MyPopper.prototype.togglePopper = function () {
    if (this.popper[0].hasAttribute("show-popper")) {
      this.hidePopper();
    } else {
      this.showPopper();
    }
  }
  const poppers = [];

  function init() {
    $('body #sidebar .components > li').each((index, li) => {
      const ul = $(li).find('> div')[0];
      if (ul) {
        const a = $(li).find('> a')[0];
        a.popper = new MyPopper(a, ul);
        poppers.push(a.popper);
      }
    })
    $('body').on('mouseover', '.top #sidebar .components > li > a', function (e) {
      if (e.currentTarget.popper) {
        poppers.forEach(popper => e.currentTarget.popper !== popper && popper.hidePopper());
        e.currentTarget.popper.showPopper();
        if (e.currentTarget.popper.timer) clearTimeout(e.currentTarget.popper.timer);
        e.currentTarget.popper.timer = setTimeout(() => {
          e.currentTarget.popper.hidePopper();
        }, 1500);
      }
    })
    $('#colContent').on('click', function () {
      poppers.forEach(popper => popper.hidePopper());
    })
  }
  setTimeout(() => {
    init();
  }, 2000);

  templateObject.getSetSideNavFocus = function () {

    setTimeout(function () {
      var currentLoc = FlowRouter.current().route.path;

      if (localStorage.getItem("ERPLoggedCountry") == "Australia") {
        $("#sidenavbasreturnlist").parent().show();
        $("#sidenavbasreturn").parent().show();
        $("#sidenavvatreturnlist").parent().hide();
        $("#sidenavvatreturn").parent().hide();
      } else if (localStorage.getItem("ERPLoggedCountry") == "South Africa") {
        $("#sidenavbasreturnlist").parent().hide();
        $("#sidenavbasreturn").parent().hide();
        $("#sidenavvatreturnlist").parent().show();
        $("#sidenavvatreturn").parent().show();
      }

      if (currentLoc == "/dashboard") {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').addClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        // $('.collapse').collapse('hide');
      } else if (currentLoc == "/dashboardexe") {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').addClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if (currentLoc == "/dashboardsalesmanager" || currentLoc == "/dashboardsales") {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
        if (currentLoc == "/dashboardsales") {
          $('#sidenavdashbaordsales').addClass('active');
          $('#sidenavdashbaordsalesmanager').removeClass('active');
        } else {
          $('#sidenavdashbaordsalesmanager').addClass('active');
          $('#sidenavdashbaordsales').removeClass('active');
        }
      } else if (currentLoc == "/dashboardmy") {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordmy').addClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/appointments") || (currentLoc == "/appointmentlist") || (currentLoc == "/appointmenttimelist")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavappointment').addClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake ').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/accountsoverview") || (currentLoc == "/journalentrylist") ||
        (currentLoc == "/journalentrycard")) {
        $('#sidenavaccounts').addClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/bankingoverview") || (currentLoc == "/chequelist") ||
        (currentLoc == "/chequecard") || (currentLoc == "/reconciliation") ||
        (currentLoc == "/reconciliationlist") || (currentLoc == "/bankrecon") || (currentLoc == "/depositcard") || (currentLoc == "/depositlist")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').addClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/contactoverview") ||
        (currentLoc == "/employeelist") || (currentLoc == "/employeescard") ||
        (currentLoc == "/customerlist") || (currentLoc == "/customerscard") ||
        (currentLoc == "/supplierlist") || (currentLoc == "/supplierscard") ||
        (currentLoc == "/joblist")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment ').removeClass('active');
        $('#sidenavcontacts').addClass('active');
        $('#sidenavcrm ').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake ').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/crmoverview") || (currentLoc == "/tasklist")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').addClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/inventorylist") || (currentLoc == '/productview') ||
      (currentLoc == "/stockadjustmentcard") ||
      (currentLoc == "/stockadjustmentoverview") || (currentLoc == "/productlist") ||
      (currentLoc == "/stocktransfercard") || (currentLoc == "/stocktransferlist") ||
      (currentLoc == "/serialnumberlist") || (currentLoc == "/lotnumberlist")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').addClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/paymentoverview") ||
        (currentLoc == "/customerawaitingpayments") || (currentLoc == "/customerpayment") ||
        (currentLoc == "/supplierawaitingpurchaseorder") || (currentLoc == "/supplierawaitingbills") ||
        (currentLoc == "/supplierpayment") || (currentLoc == "/paymentcard") ||
        (currentLoc == "/supplierpaymentcard")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').addClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if (currentLoc == "/receiptsoverview") {
        $('#sidenavreceipt').addClass('active');
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/purchasesoverview") ||
        (currentLoc == "/purchaseorderlist") || (currentLoc == "/purchaseordercard") ||
        (currentLoc == "/billlist") || (currentLoc == "/billcard") ||
        (currentLoc == "/creditlist") || (currentLoc == "/creditcard") ||
        (currentLoc == "/purchaseorderlistBO")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').addClass('active');
        $('#sidenavreports, #sidenavreports').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/allreports") ||
        (currentLoc == "/balancesheetreport") || (currentLoc == "/balancetransactionlist") ||
        (currentLoc == "/cashsummaryreport") || (currentLoc == "/newprofitandloss") ||
        (currentLoc == "/agedreceivables") || (currentLoc == "/agedpayables") ||
        (currentLoc == "/trialbalancereport") || (currentLoc == "/1099report") ||
        (currentLoc == "/agedreceivablessummary") || (currentLoc == "/salesreport") ||
        (currentLoc == "/generalledger") || (currentLoc == "/trialbalance") ||
        (currentLoc == "/statementlist") || (currentLoc == "/purchasesreport") ||
        (currentLoc == "/productsalesreport") || (currentLoc == "/salessummaryreport") ||
        (currentLoc == "/taxsummaryreport") || (currentLoc == "/purchasesummaryreport") ||
        (currentLoc == "/agedpayablessummary") || (currentLoc == "/accountant")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').addClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/salesoverview") ||
        (currentLoc == "/quotecard") || (currentLoc == "/quoteslist") ||
        (currentLoc == "/salesordercard") || (currentLoc == "/salesorderslist") ||
        (currentLoc == "/invoicecard") || (currentLoc == "/refundcard") ||
        (currentLoc == "/invoicelist") || (currentLoc == "/refundlist") || (currentLoc == "/invoicelistBO")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').addClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/settings") ||
        (currentLoc == "/accesslevel") || (currentLoc == "/companyappsettings") || (currentLoc == "/organisationsettings") ||
        (currentLoc == "/taxratesettings") || (currentLoc == "/subtaxsettings") || (currentLoc == "/currenciessettings") ||
        (currentLoc == "/departmentSettings") || (currentLoc == "/termsettings") ||
        (currentLoc == "/paymentmethodSettings")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord ').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').addClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        // $('.collapse').collapse('hide');
      } else if ((currentLoc == "/timesheet") || (currentLoc == "/adpapi") ||
        (currentLoc == "/squareapi") || (currentLoc == "/employeetimeclock") || (currentLoc == "/payrolloverview")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').addClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/stsdashboard") || (currentLoc == "/stsplants") ||
        (currentLoc == "/stsharvests") || (currentLoc == "/stspackages") ||
        (currentLoc == "/ststransfers") || (currentLoc == "/stsoverviews") ||
        (currentLoc == "/stssettings")
      ) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment ').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm ').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake ').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').addClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/vs1shipping")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('.collapse').collapse('hide');
        $('#sidenavfixedAssets').removeClass('active');
        $('#sidenavshipping').addClass('active');
      } else if ((currentLoc == '/manufacturingoverview')||(currentLoc == "/processlist") || (currentLoc == '/workordercard') || (currentLoc == '/workorderlist') || (currentLoc == '/bomlist') || (currentLoc == '/bomsetupcard') || (currentLoc == '/productionplanner')) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').addClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').removeClass('active');
        $('.collapse').collapse('hide');
      } else if ((currentLoc == "/fixedassetsoverview") || (currentLoc == "/fixedassetlist") || (currentLoc == "/serviceloglist")) {
        $('#sidenavaccounts').removeClass('active');
        $('#sidenavbanking').removeClass('active');
        $('#sidenavdashbaord').removeClass('active');
        $('#sidenavdashbaordexe').removeClass('active');
        $('#sidenavdashbaordsales').removeClass('active');
        $('#sidenavdashbaordsalesmanager').removeClass('active');
        $('#sidenavdashbaordmy').removeClass('active');
        $('#sidenavmanufacturing').removeClass('active');
        $('#sidenavappointment').removeClass('active');
        $('#sidenavcontacts').removeClass('active');
        $('#sidenavcrm').removeClass('active');
        $('#sidenavinventory').removeClass('active');
        $('#sidenavpayments').removeClass('active');
        $('#sidenavpurchases').removeClass('active');
        $('#sidenavreports, #sidenavreports2').removeClass('active');
        $('#sidenavsales').removeClass('active');
        $('#sidenavsettings').removeClass('active');
        $('#sidenavstocktake').removeClass('active');
        $('#sidenavpayroll').removeClass('active');
        $('#sidenavseedtosale').removeClass('active');
        $('#sidenavshipping').removeClass('active');
        $('#sidenavreceipt').removeClass('active');
        $('#sidenavfixedAssets').addClass('active');
        // $('.collapse').collapse('hide');
      }
    }, 50);
  }

  templateObject.getSetSideNavFocus();

  let sidePanelSettings = localStorage.getItem('sidePanelSettings');
  if (sidePanelSettings === "openNav") {
    $(".active_page_content").css("text-align", "right");
  } else {
    $(".active_page_content").css("text-align", "inherit");
  }

  if (isSidePanel) {
    $("html").addClass("hasSideBar");
    $("body").addClass("hasSideBar");
  }

  if (LoggedDB !== null) {
    if (JSON.parse(isDashboard)) {
      templateObject.includeDashboard.set(true);
    }
    if (JSON.parse(isMain)) {
      templateObject.includeMain.set(true);
    }
    if (JSON.parse(isInventory)) {
      templateObject.includeInventory.set(true);
    }
    if (JSON.parse(isManufacturing)) {
      templateObject.includeManufacturing.set(true);
    }
    if (JSON.parse(isAccessLevels)) {
      templateObject.includeAccessLevels.set(true);
    }
    if (JSON.parse(isShipping)) {
      templateObject.includeShipping.set(true);
    }
    if (JSON.parse(isStockTransfer)) {
      templateObject.includeStockTransfer.set(true);
    }

    if (JSON.parse(isStockAdjustment)) {
      templateObject.includeStockAdjustment.set(true);
    }
    if (JSON.parse(isStockTake)) {
      templateObject.includeStockTake.set(true);
    }
    if (JSON.parse(isSales)) {
      templateObject.includeSales.set(true);
    }
    if (JSON.parse(isPurchases)) {
      templateObject.includePurchases.set(true);
    }

    if (JSON.parse(isExpenseClaims)) {
      templateObject.includeExpenseClaims.set(true);
    }

    if (JSON.parse(isFixedAssets)) {
      templateObject.includeFixedAssets.set(true);
    }

    if (JSON.parse(isPayments)) {
      templateObject.includePayments.set(true);
    }

    if (JSON.parse(isContacts)) {
      templateObject.includeContacts.set(true);
    }

    if (JSON.parse(isAccounts)) {
      templateObject.includeAccounts.set(true);
    }

    if (JSON.parse(isReports)) {
      templateObject.includeReports.set(true);
    }

    if (JSON.parse(isSettings)) {
      templateObject.includeSettings.set(true);
    }

    if (JSON.parse(isSeedToSale)) {
      templateObject.includeSeedToSale.set(true);
    }
    if (JSON.parse(isBanking)) {
      templateObject.includeBanking.set(true);
    }

    if (JSON.parse(isPayroll)) {
      templateObject.includePayroll.set(true);
    }

    if (JSON.parse(isTimesheetEntry)) {
      templateObject.includeTimesheetEntry.set(true);
    }

    if (JSON.parse(isClockOnOff)) {
      templateObject.includeClockOnOff.set(true);
    }

    if (!(isTimesheetEntry) && !(isClockOnOff)) {
      templateObject.includePayroll.set(false);
    }

    if (!(isTimesheetEntry) && !(isShowTimesheet) && !(isTimesheetCreate) && !(isEditTimesheetHours) && (isClockOnOff)) {
      templateObject.includePayrollClockOnOffOnly.set(true);
      templateObject.includePayroll.set(false);
    }

    if (JSON.parse(isAppointmentScheduling)) {
      templateObject.includeAppointmentScheduling.set(true);
    }

    if (JSON.parse(isSidePanel)) {
      templateObject.isCloudSidePanelMenu.set(true);
      $("html").addClass("hasSideBar");
    }
    if (JSON.parse(isTopPanel)) {
      templateObject.isCloudTopPanelMenu.set(true);
    }

    if (JSON.parse(isCRM)) {
      templateObject.isCRM.set(true);
    }
    if (JSON.parse(isProductList)) {
      templateObject.isProductList.set(true);
    }
    if (JSON.parse(isNewProduct)) {
      templateObject.isNewProduct.set(true);
    }
    if (JSON.parse(isNewStockTransfer)) {
      templateObject.isNewStockTransfer.set(true);
    }
    if (JSON.parse(isExportProduct)) {
      templateObject.isExportProduct.set(true);
    }
    if (JSON.parse(isImportProduct)) {
      templateObject.isImportProduct.set(true);
    }
    if (JSON.parse(isStockonHandDemandChart)) {
      templateObject.isStockonHandDemandChart.set(true);
    }
    if (JSON.parse(isAppointmentSMS)) {
      templateObject.isAppointmentSMS.set(true);
    }
    if (JSON.parse(isSerialNumberList)) {
      templateObject.isSerialNumberList.set(true);
    }
  }

  let sidePanelToggle = localStorage.getItem('sidePanelToggle');
  if (launchAllocations) {
    $('#allocationModal').css('dispay', 'none');
    setTimeout(function () {
      $('#allocationModal').addClass('killAllocationPOP');
    }, 800);

  }

  let isGreenTrack = localStorage.getItem('isGreenTrack') || false;

  if (isGreenTrack == true) {
    $(".navbar").css("background-color", "#00a969");


    $(".collapse").css("background-color", "#3ddc97");
    $(".show").css("background-color", "#3ddc97");
    $("#collapse-0").css("background-color", "#3ddc97");
    $("#collapse-1").css("background-color", "#3ddc97");
    $("#collapse-2").css("background-color", "#3ddc97");
    $("#collapse-3").css("background-color", "#3ddc97");
    $("#collapse-4").css("background-color", "#3ddc97");
    $("#collapse-5").css("background-color", "#3ddc97");
    $("#collapse-6").css("background-color", "#3ddc97");
    $("#collapse-7").css("background-color", "#3ddc97");
    $("#collapse-8").css("background-color", "#3ddc97");
    $("#collapse-9").css("background-color", "#3ddc97");
    $("#collapse-10").css("background-color", "#3ddc97");
    $("#collapse-11").css("background-color", "#3ddc97");
    $("#collapse-12").css("background-color", "#3ddc97");

    $('.container-fluid .fa-bars').css("color", "#3ddc97");
    $('.btn-link').css("color", "#3ddc97");
    $('.input-group-append .btn-primary').css("background-color", "#3ddc97");
    $('.input-group-append .btn-primary').css("border-color", "#3ddc97");

    $(document).ready(function () {
      let checkGreenTrack = localStorage.getItem('isGreenTrack') || false;
      if (checkGreenTrack) {
        document.title = 'GreenTrack';
        $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/greentrackIcon.png">');
      } else {
        document.title = 'VS1 Cloud';
        $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">');
      }

    });
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

  if (sidePanelToggle) {
    if (sidePanelToggle === "toggled") {
      $("#sidenavbar").addClass("toggled");
    } else {
      $("#sidenavbar").removeClass("toggled");
    }
  }

  let isBalanceSheet = localStorage.getItem('cloudBalanceSheet');
  let isProfitLoss = localStorage.getItem('cloudProfitLoss');
  let isAgedReceivables = localStorage.getItem('cloudAgedReceivables');
  let isAgedReceivablesSummary = localStorage.getItem('cloudAgedReceivablesSummary');
  let isProductSalesReport = localStorage.getItem('cloudProductSalesReport');
  let isSalesReport = localStorage.getItem('cloudSalesReport');
  let isSalesSummaryReport = localStorage.getItem('cloudSalesSummaryReport');
  let isGeneralLedger = localStorage.getItem('cloudGeneralLedger');
  let isTaxSummaryReport = localStorage.getItem('cloudTaxSummaryReport');
  let isTrialBalance = localStorage.getItem('cloudTrialBalance');
  let is1099Transaction = localStorage.getItem('cloud1099Transaction');
  let isAgedPayables = localStorage.getItem('cloudAgedPayables');
  let isAgedPayablesSummary = localStorage.getItem('cloudAgedPayablesSummary');
  let isPurchaseReport = localStorage.getItem('cloudPurchaseReport');
  let isPurchaseSummaryReport = localStorage.getItem('cloudPurchaseSummaryReport');
  let isPrintStatement = localStorage.getItem('cloudPrintStatement');

  if (isProfitLoss == true) {
    templateObject.isProfitLoss.set(true);
  }
  if (isBalanceSheet == true) {
    templateObject.isBalanceSheet.set(true);
  }
  if (isAgedReceivables == true) {
    templateObject.isAgedReceivables.set(true);
  }
  if (isAgedReceivablesSummary == true) {
    templateObject.isAgedReceivablesSummary.set(true);
  }
  if (isProductSalesReport == true) {
    templateObject.isProductSalesReport.set(true);
  }
  if (isSalesReport == true) {
    templateObject.isSalesReport.set(true);
  }
  if (isSalesSummaryReport == true) {
    templateObject.isSalesSummaryReport.set(true);
  }
  if (isGeneralLedger == true) {
    templateObject.isGeneralLedger.set(true);
  }
  if (isTaxSummaryReport == true) {
    templateObject.isTaxSummaryReport.set(true);
  }
  if (isTrialBalance == true) {
    templateObject.isTrialBalance.set(true);
  }
  if (is1099Transaction == true) {
    templateObject.is1099Transaction.set(true);
  }
  if (isAgedPayables == true) {
    templateObject.isAgedPayables.set(true);
  }
  if (isAgedPayablesSummary == true) {
    templateObject.isAgedPayablesSummary.set(true);
  }
  if (isPurchaseReport == true) {
    templateObject.isPurchaseReport.set(true);
  }
  if (isPurchaseSummaryReport == true) {
    templateObject.isPurchaseSummaryReport.set(true);
  }
  if (isPrintStatement == true) {
    templateObject.isPrintStatement.set(true);
  }
});
Template.newsidenav.events({
  'click #sidebarToggleBtn': function (event) {

    let payload = "";
    let employeeId = parseInt(localStorage.getItem('mySessionEmployeeLoggedID')) || 0;
    if ($('#sidebar').hasClass("top")) {
      payload = {
        Name: "VS1_EmployeeAccess",
        Params: {
          VS1EmployeeAccessList: [{
            EmployeeId: parseInt(localStorage.getItem('mySessionEmployeeLoggedID')) || 0,
            formID: 7256,
            Access: 1
          }]
        }
      };
      sideBarService.updateVS1MenuConfig('SideMenu',employeeId)
      $('#sidebar').removeClass('top');
      $('#bodyContainer').removeClass('top');
      $('#sidebarToggleBtn .text').text('Top');
    } else {
      payload = {
        Name: "VS1_EmployeeAccess",
        Params: {
          VS1EmployeeAccessList: [{
            EmployeeId: parseInt(localStorage.getItem('mySessionEmployeeLoggedID')) || 0,
            formID: 7256,
            Access: 6
          }]
        }
      };
      sideBarService.updateVS1MenuConfig('TopMenu',employeeId)
      $('#sidebar').addClass('top');
      $('#bodyContainer').addClass('top');
      $('#sidebarToggleBtn .text').text('Side');
    }
    var erpGet = erpDb();
    var oPost = new XMLHttpRequest();

    oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_EmployeeAccess"', true);
    oPost.setRequestHeader("database", erpGet.ERPDatabase);
    oPost.setRequestHeader("username", erpGet.ERPUsername);
    oPost.setRequestHeader("password", erpGet.ERPPassword);
    oPost.setRequestHeader("Accept", "application/json");
    oPost.setRequestHeader("Accept", "application/html");
    oPost.setRequestHeader("Content-type", "application/json");
    var myString = '"JsonIn"' + ':' + JSON.stringify(payload);
    oPost.send(myString);
    oPost.onreadystatechange = function () {
      if (oPost.readyState == 4 && oPost.status == 200) {

      }
    }
  },
  'click #sidenavaccessLevel': function (event) {
    window.open('#', '_self');
  },

  // 'mouseenter .accountsLi': function(event) {
  //     $('#accountsSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .accountsLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .appointmentsLi': function(event) {
  //     $('#appointmentsSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .appointmentsLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .bankingLi': function(event) {
  //     $('#bankingSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .bankingLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .contactsLi': function(event) {
  //     $('#contactsSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .contactsLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .inventoryLi': function(event) {
  //     $('#inventorySubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .inventoryLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .paymentsLi': function(event) {
  //     $('#paymentsSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .paymentsLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .payrollLi': function(event) {
  //     $('#payrollSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .payrollLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .purchasesLi': function(event) {
  //     $('#purchasesSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .purchasesLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .reportsLi': function(event) {
  //     $('#reportsSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .reportsLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .salesLi': function(event) {
  //     $('#salesSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .salesLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .seedtosaleLi': function(event) {
  //     $('#seedToSaleSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .seedtosaleLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  // 'mouseenter .settingsLi': function(event) {
  //     $('#settingsSubmenu').collapse('show');
  //     $('#appointmentsSubmenu').collapse('hide');
  //     $('#bankingSubmenu').collapse('hide');
  //     $('#contactsSubmenu').collapse('hide');
  //     $('#inventorySubmenu').collapse('hide');
  //     $('#paymentsSubmenu').collapse('hide');
  //     $('#payrollSubmenu').collapse('hide');
  //     $('#purchasesSubmenu').collapse('hide');
  //     $('#reportsSubmenu').collapse('hide');
  //     $('#salesSubmenu').collapse('hide');
  //     $('#seedToSaleSubmenu').collapse('hide');
  //     $('#settingsSubmenu').collapse('hide');
  // },
  // 'mouseleave .settingsLi': function(event) {
  //     $('.collapse').collapse('hide');
  // },
  'click .sidenavaccounts': function (event) {
    event.preventDefault();
    FlowRouter.go('/accountsoverview');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();

  },
  'click #sidenavnewaccounts': function (event) {
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            if (FlowRouter.current().path == "/accountsoverview") {
              $('#addNewAccount').modal('show');
            } else {
              window.open('/accountsoverview#newaccount', '_self');
            }
          }
        });
      } else {
        if (FlowRouter.current().path == "/accountsoverview") {
          $('#addNewAccount').modal('show');
        } else {
          window.open('/accountsoverview#newaccount', '_self');
        }
      }
    } else {
      if (FlowRouter.current().path == "/accountsoverview") {
        $('#addNewAccount').modal('show');
      } else {
        window.open('/accountsoverview#newaccount', '_self');
      }
    }
  },
  'click #sidenavallocation': function (event) {

    if (FlowRouter.current().path == "/appointments") {
      $('#allocationModal').modal('show');
    } else {
      FlowRouter.go('/appointments#allocationModal');

    }
  },
  'click #sidenavpayroll': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').removeClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
  },
  'click .sidenavpayroll': function (event) {

    event.preventDefault();
    FlowRouter.go('/payrolloverview');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavPayEmployees': function (event) {

    event.preventDefault();
    FlowRouter.go('/payrun');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavbasreturnlist': function (event) {
    event.preventDefault();
    FlowRouter.go('/basreturnlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavbasreturn': function (event) {
    event.preventDefault();
    FlowRouter.go('/basreturn');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavvatreturnlist': function (event) {
    event.preventDefault();
    FlowRouter.go('/vatreturnlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavvatreturn': function (event) {
    event.preventDefault();
    FlowRouter.go('/vatreturn');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavjournalentry': function (event) {

    event.preventDefault();
    FlowRouter.go('/journalentrylist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewjournalentry': function (event) {

    event.preventDefault();
    FlowRouter.go('/journalentrycard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavbanking': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').removeClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
  },
  'click .sidenavbanking': function (event) {

    event.preventDefault();
    FlowRouter.go('/bankingoverview');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavcheque': function (event) {

    event.preventDefault();
    FlowRouter.go('/chequelist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavreconciliation': function (event) {

    event.preventDefault();
    FlowRouter.go('/reconciliationlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavbankreconciliation': function (event) {
    window.open('/bankrecon', '_self');
  },
  'click #sidenaveft': function (event) {
    window.open('/eft', '_self');
  },
  'click #sidenavnewreconcile': function (event) {

    event.preventDefault();
    FlowRouter.go('/reconciliation');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewcheque': function (event) {

    event.preventDefault();
    FlowRouter.go('/chequecard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavbalancesheet': function (event) {

    event.preventDefault();
    FlowRouter.go('/balancesheetreport');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidebarToggle': function (event) {
    var sideBarPanel = $("#sidenavbar").attr("class");

    if (sideBarPanel.indexOf("toggled") >= 0) {

      localStorage.setItem('sidePanelToggle', "toggled");
      $("#sidenavbar").addClass("toggled");

    } else {

      localStorage.setItem('sidePanelToggle', "");
      ("#sidenavbar").removeClass("toggled");

    }



  },
  'click #sidenavcontacts': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').removeClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    // $('#contactsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
  },
  'click .sidenavcontacts': function (event) {

    event.preventDefault();
    FlowRouter.go('/contactoverview');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavdashbaord': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').removeClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/dashboard');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/dashboard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/dashboard');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #sidenavdashbaordexe': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').removeClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/dashboardexe');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/dashboardexe');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/dashboardexe');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #sidenavdashbaordsalesmanager': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').removeClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/dashboardsalesmanager');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/dashboardsalesmanager');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/dashboardsalesmanager');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #sidenavdashbaordsales': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').removeClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/dashboardsales');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/dashboardsales');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/dashboardsales');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #sidenavdashbaordmy': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').removeClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/dashboardmy');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/dashboardmy');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/dashboardmy');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #sidenavappointment': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').removeClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
  },
  'click .sidenavappointment': function (event) {
    event.preventDefault();
    FlowRouter.go('/appointments');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavappointmentList': function (event) {

    event.preventDefault();
    FlowRouter.go('/appointmentlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavappointmenttimeList': function (event) {

    event.preventDefault();
    FlowRouter.go('/appointmenttimelist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavemployeesGreenTrack': function (event) {

    event.preventDefault();
    FlowRouter.go('/employeelist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavfixedassets': function (event) {
    window.open('#', '_self');
  },
  'click #sidenavinventory': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.manufacturingLi').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').removeClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#manufacturingSubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
  },
  'click .sidenavinventory': function (event) {

    event.preventDefault();
    FlowRouter.go('/inventorylist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewinventory': function (event) {

    event.preventDefault();
    FlowRouter.go('/productview');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavmain': function (event) {
    window.open('#', '_self');
  },
  'click #sidenavmanufacturing': function (event) {
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            $('.accountsLi').addClass('opacityNotActive');
            $('.appointmentsLi').addClass('opacityNotActive');
            $('.bankingLi').addClass('opacityNotActive');
            $('.contactsLi').addClass('opacityNotActive');
            $('.dashboardLi').addClass('opacityNotActive');
            $('.dashboardLiExe').addClass('opacityNotActive');
            $('.dashboardLiSales').addClass('opacityNotActive');
            $('.dashboardLiSalesManager').addClass('opacityNotActive');
            $('.manufacturingLi').removeClass('opacityNotActive');
            $('.gsemployeesLi').addClass('opacityNotActive');
            $('.inventoryLi').addClass('opacityNotActive');
            $('.paymentsLi').addClass('opacityNotActive');
            $('.payrollLi').addClass('opacityNotActive');
            $('.purchasesLi').addClass('opacityNotActive');
            $('.reportsLi').addClass('opacityNotActive');
            $('.reportsLi2').addClass('opacityNotActive');
            $('.salesLi').addClass('opacityNotActive');
            $('.seedtosaleLi').addClass('opacityNotActive');
            $('.settingsLi').addClass('opacityNotActive');
            $('.logoutLi').addClass('opacityNotActive');
            $('#accountsSubmenu').collapse('hide');
            $('#appointmentsSubmenu').collapse('hide');
            $('#bankingSubmenu').collapse('hide');
            $('#contactsSubmenu').collapse('hide');
            $('#inventorySubmenu').collapse('hide');
            $('#paymentsSubmenu').collapse('hide');
            $('#payrollSubmenu').collapse('hide');
            $('#purchasesSubmenu').collapse('hide');
            $('#reportsSubmenu').collapse('hide');
            $('#salesSubmenu').collapse('hide');
            $('#seedToSaleSubmenu').collapse('hide');
            $('#settingsSubmenu').collapse('hide');
          }
        });
      } else {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.dashboardLiExe').addClass('opacityNotActive');
        $('.dashboardLiSales').addClass('opacityNotActive');
        $('.dashboardLiSalesManager').addClass('opacityNotActive');
        $('.manufacturingLi').removeClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
      }
    } else {
      $('.accountsLi').addClass('opacityNotActive');
      $('.appointmentsLi').addClass('opacityNotActive');
      $('.bankingLi').addClass('opacityNotActive');
      $('.contactsLi').addClass('opacityNotActive');
      $('.dashboardLi').addClass('opacityNotActive');
      $('.dashboardLiExe').addClass('opacityNotActive');
      $('.dashboardLiSales').addClass('opacityNotActive');
      $('.dashboardLiSalesManager').addClass('opacityNotActive');
      $('.manufacturingLi').removeClass('opacityNotActive');
      $('.gsemployeesLi').addClass('opacityNotActive');
      $('.inventoryLi').addClass('opacityNotActive');
      $('.paymentsLi').addClass('opacityNotActive');
      $('.payrollLi').addClass('opacityNotActive');
      $('.purchasesLi').addClass('opacityNotActive');
      $('.reportsLi').addClass('opacityNotActive');
      $('.reportsLi2').addClass('opacityNotActive');
      $('.salesLi').addClass('opacityNotActive');
      $('.seedtosaleLi').addClass('opacityNotActive');
      $('.settingsLi').addClass('opacityNotActive');
      $('.logoutLi').addClass('opacityNotActive');
      $('#accountsSubmenu').collapse('hide');
      $('#appointmentsSubmenu').collapse('hide');
      $('#bankingSubmenu').collapse('hide');
      $('#contactsSubmenu').collapse('hide');
      $('#inventorySubmenu').collapse('hide');
      $('#paymentsSubmenu').collapse('hide');
      $('#payrollSubmenu').collapse('hide');
      $('#purchasesSubmenu').collapse('hide');
      $('#reportsSubmenu').collapse('hide');
      $('#salesSubmenu').collapse('hide');
      $('#seedToSaleSubmenu').collapse('hide');
      $('#settingsSubmenu').collapse('hide');
    }
  },
  'click #sidenavpayments': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').removeClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
  },
  'click #sidenavprocesses': function (event) {
    event.preventDefault();
    FlowRouter.go('/processlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavbomList': function (event) {
    event.preventDefault();
    FlowRouter.go('/bomlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavmobileapp': function (event) {
    event.preventDefault();
    FlowRouter.go('/mobileapp');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewworkorder': function (event) {
    event.preventDefault();
    FlowRouter.go('/workordercard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewworkorderlist': function (event) {
    event.preventDefault();
    FlowRouter.go('/workorderlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavproductionplanner': function (event) {
    event.preventDefault();
    FlowRouter.go('/productionplanner');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click .sidenavpayments': function (event) {
    event.preventDefault();
    FlowRouter.go('/paymentoverview');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavpurchases': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').removeClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    // $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
  },
  'click .sidenavpurchases': function (event) {
    event.preventDefault();
    FlowRouter.go('/purchasesoverview');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavreports, #sidenavreports2': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').removeClass('opacityNotActive');
    $('.reportsLi2').removeClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    // $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
    event.preventDefault();
    FlowRouter.go('/allreports');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenav1099report': function (event) {
    event.preventDefault();
    FlowRouter.go('/1099report');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavagedpayables': function (event) {
    event.preventDefault();
    FlowRouter.go('/agedpayables');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavagedpayablessummary': function (event) {
    event.preventDefault();
    FlowRouter.go('/agedpayablessummary');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavagedreceivables': function (event) {
    event.preventDefault();
    FlowRouter.go('/agedreceivables');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavagedreceivablessummary': function (event) {
    event.preventDefault();
    FlowRouter.go('/agedreceivablessummary');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavbalancesheetreport': function (event) {
    event.preventDefault();
    FlowRouter.go('/balancesheetreport');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavgeneralledger': function (event) {
    event.preventDefault();
    FlowRouter.go('/generalledger');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavstatementlist': function (event) {
    event.preventDefault();
    FlowRouter.go('/statementlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavstatementlist2': function (event) {
    event.preventDefault();
    FlowRouter.go('/statementlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavprofitlossreport': function (event) {
    event.preventDefault();
    FlowRouter.go('/newprofitandloss');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavpurchasesreport': function (event) {
    event.preventDefault();
    FlowRouter.go('/purchasesreport');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavpurchasesummaryreport': function (event) {
    event.preventDefault();
    FlowRouter.go('/purchasesummaryreport');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavproductsalesreport': function (event) {
    event.preventDefault();
    FlowRouter.go('/productsalesreport');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavsalesreport': function (event) {
    event.preventDefault();
    FlowRouter.go('/salesreport');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavsalessummaryreport': function (event) {
    event.preventDefault();
    FlowRouter.go('/salessummaryreport');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavtaxsummaryreport': function (event) {
    event.preventDefault();
    FlowRouter.go('/taxsummaryreport');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavtrialbalance': function (event) {
    event.preventDefault();
    FlowRouter.go('/trialbalance');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click .sidenavreports': function (event) {
    event.preventDefault();
    FlowRouter.go('/allreports');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavsales': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').removeClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    // $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
  },
  'click .sidenavsales': function (event) {
    event.preventDefault();
    FlowRouter.go('/salesoverview');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click .sidenavsettings': function (event) {
    event.preventDefault();
    FlowRouter.go('/settings');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavstockadjust': function (event) {
    event.preventDefault();
    FlowRouter.go('/stockadjustmentoverview');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavstocktransfer': function (event) {
    event.preventDefault();
    FlowRouter.go('/stocktransferlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenaveproductlist': function (event) {
    event.preventDefault();
    FlowRouter.go('/productlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenaveserialnumberlist': function (event) {
    event.preventDefault();
    FlowRouter.go('/serialnumberlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavelotnumberlist': function (event) {
    event.preventDefault();
    FlowRouter.go('/lotnumberlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewstockadjust': function (event) {
    //window.open('/stockadjustmentcard', '_self');
    event.preventDefault();
    FlowRouter.go('/stockadjustmentcard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewstocktransfer': function (event) {
    //window.open('/stocktransfercard', '_self');
    event.preventDefault();
    FlowRouter.go('/stocktransfercard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavcustomers': function (event) {
    event.preventDefault();
    FlowRouter.go('/customerlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavemployees': function (event) {
    event.preventDefault();
    FlowRouter.go('/employeelist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavjobs': function (event) {
    event.preventDefault();
    FlowRouter.go('/joblist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavcontactleads': function (event) {
    event.preventDefault();
    FlowRouter.go('/leadlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavsuppliers': function (event) {
    event.preventDefault();
    FlowRouter.go('/supplierlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewcustomers': function (event) {
    if (FlowRouter.current().path === "/customerscard") {
      window.open('/customerscard', '_self');
    } else {
      event.preventDefault();
      FlowRouter.go('/customerscard');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #sidenavnewemployees': function (event) {
    if (FlowRouter.current().path === "/employeescard") {
      window.open('/employeescard', '_self');
    } else {
      event.preventDefault();
      FlowRouter.go('/employeescard');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #sidenavnewleads': function (event) {
    if (FlowRouter.current().path === "/leadscard") {
      window.open('/leadscard', '_self');
    } else {
      event.preventDefault();
      FlowRouter.go('/leadscard');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #sidenavnewsuppliers': function (event) {
    if (FlowRouter.current().path === "/supplierscard") {
      window.open('/supplierscard', '_self');
    } else {
      event.preventDefault();
      FlowRouter.go('/supplierscard');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #sidenavawaitingCP': function (event) {
    event.preventDefault();
    FlowRouter.go('/customerawaitingpayments');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavawaitingSPPO': function (event) {
    event.preventDefault();
    FlowRouter.go('/supplierawaitingpurchaseorder');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavawaitingSPBill': function (event) {
    event.preventDefault();
    FlowRouter.go('/supplierawaitingbills');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavcustomerP': function (event) {
    event.preventDefault();
    FlowRouter.go('/customerpayment');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewcustomerP': function (event) {
    event.preventDefault();
    FlowRouter.go('/paymentcard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavsupplierP': function (event) {
    event.preventDefault();
    FlowRouter.go('/supplierpayment');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewsupplierP': function (event) {
    event.preventDefault();
    FlowRouter.go('/supplierpaymentcard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavBill': function (event) {
    event.preventDefault();
    FlowRouter.go('/billlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavCredit': function (event) {
    event.preventDefault();
    FlowRouter.go('/creditlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavPurchaseOrder': function (event) {
    event.preventDefault();
    FlowRouter.go('/purchaseorderlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavPurchaseOrderBO': function (event) {
    event.preventDefault();
    FlowRouter.go('/purchaseorderlistBO');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewBill': function (event) {
    event.preventDefault();
    FlowRouter.go('/billcard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewCredit': function (event) {
    event.preventDefault();
    FlowRouter.go('/creditcard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewPO': function (event) {
    event.preventDefault();
    FlowRouter.go('/purchaseordercard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavInvoice': function (event) {
    event.preventDefault();
    FlowRouter.go('/invoicelist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavRefund': function (event) {
    event.preventDefault();
    FlowRouter.go('/refundlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavInvoiceEmail': function (event) {
    event.preventDefault();
    FlowRouter.go('/invoiceemail');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavInvoiceBO': function (event) {
    event.preventDefault();
    FlowRouter.go('/invoicelistBO');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavQuote': function (event) {
    event.preventDefault();
    FlowRouter.go('/quoteslist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavSalesOrder': function (event) {
    event.preventDefault();
    FlowRouter.go('/salesorderslist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewInvoice': function (event) {
    event.preventDefault();
    FlowRouter.go('/invoicecard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewQuote': function (event) {
    event.preventDefault();
    FlowRouter.go('/quotecard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewRefund': function (event) {
    event.preventDefault();
    FlowRouter.go('/refundcard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewSO': function (event) {
    event.preventDefault();
    FlowRouter.go('/salesordercard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavaccesslevel': function (event) {
    window.open('/accesslevel', '_self');
  },
  'click #sidenavcompanyappsettings': function (event) {
    window.open('/companyappsettings', '_self');
  },
  'click #organisationsettings': function (event) {
    window.open('/organisationsettings', '_self');
  },
  'click #backuprestore': function (event) {
    window.open('/backuprestore', '_self');
  },
  'click #clienttypesettings': function (event) {
    window.open('/clienttypesettings', '_self');
  },
  'click #leadstatussettings': function (event) {
    window.open('/leadstatussettings', '_self');
  },
  'click #edIntegrations': function (event) {
    window.open('/edi-integrations', '_self');
  },
  'click #emailsettings': function (event) {
    window.open('/emailsettings', '_self');
  },
  'click #payrollrules': function (event) {
    window.open('/payrollrules', '_self');
  },
  'click #templatesettings': function (event) {
    window.open('/templatesettings', '_self');
  },
  'click #setup': function (event) {
    window.open('/setup', '_self');
  },
  'click #subscriptionSettings': function (event) {
    window.open('/subscriptionSettings', '_self');
  },
  'click #uomSettings': function (event) {
    window.open('/uomSettings', '_self');
  },
  'click #sidenavInventorySettings': function (event) {
    window.open('/inventorySettings', '_self');
  },
  'click #sidenavcurrenciesSettings': function (event) {
    event.preventDefault();
    FlowRouter.go('/currenciessettings');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavdepartmentSettings': function (event) {
    event.preventDefault();
    FlowRouter.go('/departmentSettings');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavorganisationsettings': function (event) {
    event.preventDefault();
    FlowRouter.go('/organisationsettings');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavpaymentmethodSettings': function (event) {
    event.preventDefault();
    FlowRouter.go('/paymentmethodSettings');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavtaxratesettings': function (event) {
    event.preventDefault();
    FlowRouter.go('/taxratesettings');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavtermsettings': function (event) {
    event.preventDefault();
    FlowRouter.go('/termsettings');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavtimesheet': function (event) {
    event.preventDefault();
    FlowRouter.go('/timesheet');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavtimeclock': function (event) {
    if (FlowRouter.current().path == "/payrolloverview") {
      $("#btnClockOnOff").trigger("click");
    } else {
      window.open('/payrolloverview#clockOnOff', '_self');
    }
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavseedtosale': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').removeClass('opacityNotActive');
    $('.settingsLi').addClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    // $('#seedToSaleSubmenu').collapse('hide');
    $('#settingsSubmenu').collapse('hide');
  },
  'click .sidenavseedtosale': function (event) {
    FlowRouter.go('/stsdashboard');
  },
  'click #sidenavPlants': function (event) {
    window.open('/stsplants', '_self');
  },
  'click #sidenavHarvest': function (event) {
    window.open('/stsharvests', '_self');
  },
  'click #sidenavPackages': function (event) {
    window.open('/stspackages', '_self');
  },
  'click #sidenavTransfers': function (event) {
    window.open('/ststransfers', '_self');
  },
  'click #sidenavOverviews': function (event) {
    window.open('/stsoverviews', '_self');
  },
  'click #sidenavSettings': function (event) {
    $('.accountsLi').addClass('opacityNotActive');
    $('.appointmentsLi').addClass('opacityNotActive');
    $('.bankingLi').addClass('opacityNotActive');
    $('.contactsLi').addClass('opacityNotActive');
    $('.dashboardLi').addClass('opacityNotActive');
    $('.dashboardLiExe').addClass('opacityNotActive');
    $('.dashboardLiSales').addClass('opacityNotActive');
    $('.dashboardLiSalesManager').addClass('opacityNotActive');
    $('.gsemployeesLi').addClass('opacityNotActive');
    $('.inventoryLi').addClass('opacityNotActive');
    $('.paymentsLi').addClass('opacityNotActive');
    $('.payrollLi').addClass('opacityNotActive');
    $('.purchasesLi').addClass('opacityNotActive');
    $('.reportsLi').addClass('opacityNotActive');
    $('.reportsLi2').addClass('opacityNotActive');
    $('.salesLi').addClass('opacityNotActive');
    $('.seedtosaleLi').addClass('opacityNotActive');
    $('.settingsLi').removeClass('opacityNotActive');
    $('.logoutLi').addClass('opacityNotActive');
    $('#accountsSubmenu').collapse('hide');
    $('#appointmentsSubmenu').collapse('hide');
    $('#bankingSubmenu').collapse('hide');
    $('#contactsSubmenu').collapse('hide');
    $('#inventorySubmenu').collapse('hide');
    $('#paymentsSubmenu').collapse('hide');
    $('#payrollSubmenu').collapse('hide');
    $('#purchasesSubmenu').collapse('hide');
    $('#reportsSubmenu').collapse('hide');
    $('#salesSubmenu').collapse('hide');
    $('#seedToSaleSubmenu').collapse('hide');
    // $('#settingsSubmenu').collapse('hide');
    window.open('/stssettings', '_self');
  },
  'click #sidenavdepositlist': function (event) {
    event.preventDefault();
    FlowRouter.go('/depositlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavnewdeposit': function (event) {
    event.preventDefault();
    FlowRouter.go('/depositcard');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavshipping': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/vs1shipping');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/vs1shipping');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/vs1shipping');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click #closeCloudSidePanelMenu': function (event) {
    let templateObject = Template.instance();
    let empLoggedID = localStorage.getItem('mySessionEmployeeLoggedID');
    let accesslevelService = new AccessLevelService();
    let isSidePanel = false;
    let sidePanelID = localStorage.getItem('CloudSidePanelMenuID');
    let sidePanelFormID = localStorage.getItem('CloudSidePanelMenuFormID');

    let data = {
      type: "TEmployeeFormAccess",
      fields: {
        ID: sidePanelID,
        EmployeeId: empLoggedID,
        AccessLevel: 6,
        FormId: sidePanelFormID
      }
    }

    accesslevelService.saveEmpAccess(data).then(function (data) {
      localStorage.setItem('CloudSidePanelMenu', isSidePanel);

      Meteor._reload.reload();
    }).catch(function (err) {
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

        }
      });

    });

  },

  'click .accountsLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/accountsoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/accountsoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/accountsoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .appointmentsLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/appointments');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/appointments');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/appointments');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .bankingLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/bankingoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/bankingoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/bankingoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .contactsLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/contactoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/contactoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/contactoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .crmLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/crmoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/crmoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/crmoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .sidenavleads': function (event) {
    event.preventDefault();
    FlowRouter.go('/leadlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavprojects': function (event) {
    event.preventDefault();
    if (FlowRouter.current().path == "/crmoverview") {
      $(".menu_project").trigger("click");
    } else {
      window.open('/crmoverview#projectsTab-tab', '_self');
    }
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidecampaignlist': function (event) {
    event.preventDefault();
    FlowRouter.go('/campaign-list');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavmailchimp': function (event) {
    event.preventDefault();
    if (FlowRouter.current().path == "/crmoverview") {
      $('#crmMailchimpModal').modal();
    } else {
      window.open('/crmoverview#btnMailchimp', '_self');
    }
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click .inventoryLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/inventorylist');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/inventorylist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/inventorylist');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .manufacturingLiHeader': function(event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/manufacturingoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/manufacturingoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/manufacturingoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .paymentsLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/paymentoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/paymentoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/paymentoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .payrollLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/payrolloverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/payrolloverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/payrolloverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .receiptLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/receiptsoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/receiptsoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/receiptsoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .purchasesLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/purchasesoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/purchasesoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/purchasesoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .reportsLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/allreports');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/allreports');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/allreports');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .reportsLi2Header': function (event) {
    event.preventDefault();
    FlowRouter.go('/allreports');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click #sidenavAccountant': function (event) {
    event.preventDefault();
    FlowRouter.go('/accountant');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click .salesLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/salesoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/salesoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/salesoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .seedtosaleLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/stsdashboard');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/stsdashboard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/stsdashboard');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .settingsLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/settings');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/settings');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/settings');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },

  'click .fixedAssetsLiHeader': function (event) {
    event.preventDefault();
    var url = window.location.pathname;
    if (url == "/bankrecon") {
      let reconHoldState = localStorage.getItem("reconHoldState") || "false";
      if (reconHoldState == "true") {
        swal({
          title: "Select OK to place Reconciliation On Hold",
          text: "You must Hold the Reconciliation to save the flagged items",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            $("#btnHold").trigger("click");
            localStorage.setItem("reconHoldState", "false");
          } else {
            FlowRouter.go('/fixedassetsoverview');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
          }
        });
      } else {
        FlowRouter.go('/fixedassetsoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
      }
    } else {
      FlowRouter.go('/fixedassetsoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    }
  },
  'click .sidenavfixedassets': function (event) {
    event.preventDefault();
    FlowRouter.go('/fixedassetlist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },
  'click .sidenavservicelogs': function (event) {
    event.preventDefault();
    FlowRouter.go('/serviceloglist');
    let templateObject = Template.instance();
    templateObject.getSetSideNavFocus();
  },

});
Template.newsidenav.helpers({
  sideBarPositionClass: () => {
    return Template.instance().sideBarPositionClass.get() || 'top';
  },
  includeDashboard: () => {
    return Template.instance().includeDashboard.get();
  },
  includeMain: () => {
    return Template.instance().includeMain.get();
  },
  includeInventory: () => {
    return Template.instance().includeInventory.get();
  },
  includeManufacturing: () => {
    return Template.instance().includeManufacturing.get();
  },
  includeAccessLevels: () => {
    return Template.instance().includeAccessLevels.get();
  },
  includeShipping: () => {
    return Template.instance().includeShipping.get();
  },
  includeStockTransfer: () => {
    return Template.instance().includeStockTransfer.get();
  },
  includeStockAdjustment: () => {
    return Template.instance().includeStockAdjustment.get();
  },
  includeStockTake: () => {
    return Template.instance().includeStockTake.get();
  },
  includeSales: () => {
    return Template.instance().includeSales.get();
  },
  isCloudSidePanelMenu: () => {
    return Template.instance().isCloudSidePanelMenu.get();
  },
  isCloudTopPanelMenu: () => {
    return Template.instance().isCloudTopPanelMenu.get();
  },
  includePurchases: () => {
    return Template.instance().includePurchases.get();
  },
  includeExpenseClaims: () => {
    return Template.instance().includeExpenseClaims.get();
  },
  includeFixedAssets: () => {
    return Template.instance().includeFixedAssets.get();
  },
  includePayments: () => {
    return Template.instance().includePayments.get();
  },
  includeContacts: () => {
    return Template.instance().includeContacts.get();
  },
  includeAccounts: () => {
    return Template.instance().includeAccounts.get();
  },
  includeReports: () => {
    return Template.instance().includeReports.get();
  },
  includeSettings: () => {
    return Template.instance().includeSettings.get();
  },
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
  isBalanceSheet: function () {
    return Template.instance().isBalanceSheet.get();
  },
  isProfitLoss: function () {
    return Template.instance().isProfitLoss.get();
  },
  isAgedReceivables: function () {
    return Template.instance().isAgedReceivables.get();
  },
  isAgedReceivablesSummary: function () {
    return Template.instance().isAgedReceivablesSummary.get();
  },
  isProductSalesReport: function () {
    return Template.instance().isProductSalesReport.get();
  },
  isSalesReport: function () {
    return Template.instance().isSalesReport.get();
  },
  isSalesSummaryReport: function () {
    return Template.instance().isSalesSummaryReport.get();
  },
  isGeneralLedger: function () {
    return Template.instance().isGeneralLedger.get();
  },
  isTaxSummaryReport: function () {
    return Template.instance().isTaxSummaryReport.get();
  },
  isTrialBalance: function () {
    return Template.instance().isTrialBalance.get();
  },
  is1099Transaction: function () {
    return Template.instance().is1099Transaction.get();
  },
  isAgedPayables: function () {
    return Template.instance().isAgedPayables.get();
  },
  isAgedPayablesSummary: function () {
    return Template.instance().isAgedPayablesSummary.get();
  },
  isPurchaseReport: function () {
    return Template.instance().isPurchaseReport.get();
  },
  isPurchaseSummaryReport: function () {
    return Template.instance().isPurchaseSummaryReport.get();
  },
  isPrintStatement: function () {
    return Template.instance().isPrintStatement.get();
  },
  isFavorite: function () {
    let isBalanceSheet = Template.instance().isBalanceSheet.get();
    let isProfitLoss = Template.instance().isProfitLoss.get();
    let isAgedReceivables = Template.instance().isAgedReceivables.get();
    let isAgedReceivablesSummary = Template.instance().isAgedReceivablesSummary.get();
    let isProductSalesReport = Template.instance().isProductSalesReport.get();
    let isSalesReport = Template.instance().isSalesReport.get();
    let isSalesSummaryReport = Template.instance().isSalesSummaryReport.get();
    let isGeneralLedger = Template.instance().isGeneralLedger.get();
    let isTaxSummaryReport = Template.instance().isTaxSummaryReport.get();
    let isTrialBalance = Template.instance().isTrialBalance.get();
    let is1099Transaction = Template.instance().is1099Transaction.get();
    let isAgedPayables = Template.instance().isAgedPayables.get();
    let isAgedPayablesSummary = Template.instance().isAgedPayablesSummary.get();
    let isPurchaseReport = Template.instance().isPurchaseReport.get();
    let isPurchaseSummaryReport = Template.instance().isPurchaseSummaryReport.get();
    let isPrintStatement = Template.instance().isPrintStatement.get();
    let isShowFavorite = false;

    if (isBalanceSheet || isProfitLoss || isAgedReceivables || isProductSalesReport || isSalesReport || isSalesSummaryReport ||
      isGeneralLedger || isTaxSummaryReport || isTrialBalance || is1099Transaction || isAgedPayables ||
      isPurchaseReport || isPurchaseSummaryReport || isPrintStatement || isAgedReceivablesSummary || isAgedPayablesSummary) {
      isShowFavorite = true;
    }
    return isShowFavorite;
  },
  isGreenTrack: function () {
    let checkGreenTrack = localStorage.getItem('isGreenTrack') || false;

    return checkGreenTrack;
  },
  includeSeedToSale: () => {
    return Template.instance().includeSeedToSale.get();
  },
  includeAppointmentScheduling: () => {
    return Template.instance().includeAppointmentScheduling.get();
  },
  includeBanking: () => {
    return Template.instance().includeBanking.get();
  },
  includePayroll: () => {
    return Template.instance().includePayroll.get();
  },
  includePayrollClockOnOffOnly: () => {
    return Template.instance().includePayrollClockOnOffOnly.get();
  },
  includeTimesheetEntry: () => {
    return Template.instance().includeTimesheetEntry.get();
  },
  includeClockOnOff: () => {
    return Template.instance().includeClockOnOff.get();
  },
  checkFXCurrency: () => {
    return localStorage.getItem('CloudUseForeignLicence');
  },
  showTimesheet: () => {
    return localStorage.getItem('CloudShowTimesheet') || false;
  },
  isSNTrackChecked: () => {
    return Template.instance().isSNTrackChecked.get();
  },
  includeCRM: () => {
    return Template.instance().isCRM.get();
  },
  isProductList: () => {
    return Template.instance().isProductList.get();
  },
  isNewProduct: () => {
    return Template.instance().isNewProduct.get();
  },
  isNewStockTransfer: () => {
    return Template.instance().isNewStockTransfer.get();
  },
  isExportProduct: () => {
    return Template.instance().isExportProduct.get();
  },
  isImportProduct: () => {
    return Template.instance().isImportProduct.get();
  },
  isStockonHandDemandChart: () => {
    return Template.instance().isStockonHandDemandChart.get();
  },
  isAppointmentSMS: () => {
    return Template.instance().isAppointmentSMS.get();
  }
});
