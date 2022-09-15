import { ReportService } from "../report-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import GlobalFunctions from "../../GlobalFunctions";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
let _ = require('lodash');
let defaultCurrencyCode = CountryAbbr; // global variable "AUD"
let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();

Template.executivesummaryreport.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();

  templateObject.totalSales = new ReactiveVar();
  templateObject.grossProfit = new ReactiveVar();
  templateObject.totalExpenses = new ReactiveVar();
  templateObject.nettProfit = new ReactiveVar();

  templateObject.totalAgedReceivables = new ReactiveVar();
  templateObject.totalAgedPayables = new ReactiveVar();
  templateObject.totalNettAssets = new ReactiveVar();

  templateObject.totalInvoiceCount = new ReactiveVar();
  templateObject.totalInvoiceValue = new ReactiveVar();
  templateObject.averageInvoiceValue = new ReactiveVar();

  templateObject.grossProfitMargin = new ReactiveVar();
  templateObject.netProfitMargin = new ReactiveVar();
  templateObject.returnOnInvestment = new ReactiveVar();

  templateObject.avgDebtors = new ReactiveVar();
  templateObject.avgCreditors = new ReactiveVar();
  templateObject.shortTermCash = new ReactiveVar();
  templateObject.currentAsset = new ReactiveVar();
  templateObject.termAsset = new ReactiveVar();

  templateObject.currencyRecord = new ReactiveVar([]);
  templateObject.currencyList = new ReactiveVar([]);
  templateObject.activeCurrencyList = new ReactiveVar([]);
  templateObject.tcurrencyratehistory = new ReactiveVar([]);
});

Template.executivesummaryreport.onRendered(() => {
  const templateObject = Template.instance();

  var currentDate = new Date();
  const monSml = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var currMonth1 = "", currMonth2 = "";
  if (currentDate.getMonth() == 0) {
    currMonth1 = monSml[10] + " " + (currentDate.getFullYear() - 1);
    currMonth2 = monSml[11] + " " + (currentDate.getFullYear() - 1);
  } else if (currentDate.getMonth() == 1) {
    currMonth1 = monSml[11] + " " + (currentDate.getFullYear() - 1);
    currMonth2 = monSml[0] + " " + currentDate.getFullYear();
  } else {
    currMonth1 = monSml[currentDate.getMonth() - 2] + " " + currentDate.getFullYear();
    currMonth2 = monSml[currentDate.getMonth() - 1] + " " + currentDate.getFullYear();
  }
  templateObject.titleMonth1.set(currMonth1);
  templateObject.titleMonth2.set(currMonth2);

  let totalExpense = localStorage.getItem('VS1ProfitandLoss_ExpEx_dash') || 0;
  let totalCOGS = localStorage.getItem('VS1ProfitandLoss_COGSEx_dash') || 0;
  let totalSales = localStorage.getItem('VS1ProfitandLoss_IncomeEx_dash') || 0;
  let totalNetIncome = localStorage.getItem('VS1ProfitandLoss_netIncomeEx_dash') || 0;
  let sumTotalExpense = (Number(totalExpense) + Number(totalCOGS)) || 0;
  let grossProfit = (Number(totalSales) + Number(totalExpense) + Number(totalCOGS)) || 0;
  templateObject.totalSales.set(utilityService.modifynegativeCurrencyFormat(totalSales));
  templateObject.grossProfit.set(utilityService.modifynegativeCurrencyFormat(grossProfit));
  templateObject.totalExpenses.set(utilityService.modifynegativeCurrencyFormat(Math.abs(sumTotalExpense)));
  templateObject.nettProfit.set(utilityService.modifynegativeCurrencyFormat(totalNetIncome));

  let outstandingInvAmt = localStorage.getItem('VS1OutstandingInvoiceAmt_dash') || 0;
  let outstandingInvQty = localStorage.getItem('VS1OutstandingInvoiceQty_dash') || 0;
  let overdueInvAmt = localStorage.getItem('VS1OverDueInvoiceAmt_dash') || 0;
  let overdueInvQty = localStorage.getItem('VS1OverDueInvoiceQty_dash') || 0;

  let totalInvQty = Number(outstandingInvQty) + Number(overdueInvQty);
  let totalInvAmt = Number(outstandingInvAmt) + Number(overdueInvAmt);
  let reportsDateFrom = localStorage.getItem('VS1ReportsDateFrom_dash') || "";
  let reportsDateTo = localStorage.getItem('VS1ReportsDateTo_dash') || "";
  let prd = 0;
  if (reportsDateFrom == "" || reportsDateTo == "") {
    prd = 6;
  } else {
    let monthFrom = reportsDateFrom.substring(5, 6);
    let monthTo = reportsDateTo.substring(5, 6);
    prd = Number(monthTo) - Number(monthFrom);
  }
  let averageInvAmt = totalInvAmt / prd;

  templateObject.totalInvoiceCount.set(totalInvQty);
  templateObject.averageInvoiceValue.set(utilityService.modifynegativeCurrencyFormat(averageInvAmt));
  templateObject.totalInvoiceValue.set(utilityService.modifynegativeCurrencyFormat(totalInvAmt));

  let totalAgedReceivables = 0;
  let totalAgedPayables = 0;
  let totalNettAssets = 0;
  let GrandTotalAsset = 0;
  let GrandTotalLiability = 0;

  let grossProfitMg = (Number(totalSales) - Number(totalCOGS)) || 0;
  let netProfitMg = (Number(totalSales) - Number(totalExpense)) || 0;
  let totalEq = 0;
  let investReturn = 0;

  let avgDebtors = 0;
  let avgCreditors = 0;
  let shortTermCash = 0;
  let currentAsset = 0;
  let termAsset = 0;
  let totalCurrentAsset = 0;
  let totalCurrentLiability = 0;
  let totalOtherAsset = 0;
  let totalOtherLiability = 0;

  templateObject.getBalanceSheetReports = async (dateAsOf) => {
    let data = !localStorage.getItem("VS1BalanceSheet_Report1")
      ? await reportService.getBalanceSheetReport(dateAsOf)
      : JSON.parse(localStorage.getItem("VS1BalanceSheet_Report"));

    if (data.balancesheetreport) {
      
      for (let i = 0, len = data.balancesheetreport.length; i < len; i++) {
        let SubAccountTotal = data.balancesheetreport[i]["Sub Account Total"];
        let HeaderAccountTotal = data.balancesheetreport[i]["Header Account Total"];
        let TotalAsset_Liability = data.balancesheetreport[i]["Total Asset & Liability"];
        let TotalCurrentAsset_Liability = data.balancesheetreport[i]["Total Current Asset & Liability"];
        
        let AccountTree = data.balancesheetreport[i]["Account Tree"];
        if (AccountTree.replace(/\s/g, "") == "TotalAccountsReceivable") {
          totalAgedReceivables = HeaderAccountTotal;
        } else if (AccountTree.replace(/\s/g, "") == "TotalAccountsPayable") {
          totalAgedPayables = SubAccountTotal;
        } else if (AccountTree.replace(/\s/g, "") == "TOTALASSETS") {
          GrandTotalAsset = TotalAsset_Liability;
        } else if (AccountTree.replace(/\s/g, "") == "TOTALLIABILITIES&EQUITY") {
          GrandTotalLiability = TotalAsset_Liability;
        } else if (AccountTree.replace(/\s/g, "") == "TotalCapital/Equity") {
          totalEq = TotalCurrentAsset_Liability;
        } else if (AccountTree.replace(/\s/g, "") == "TotalCurrentAssets") {
          totalCurrentAsset = TotalCurrentAsset_Liability;
        } else if (AccountTree.replace(/\s/g, "") == "TotalCurrentLiabilities") {
          totalCurrentLiability = TotalCurrentAsset_Liability;
        } else if (AccountTree.replace(/\s/g, "") == "TotalOtherCurrentAsset") {
          totalOtherAsset = HeaderAccountTotal;
        } else if (AccountTree.replace(/\s/g, "") == "TotalOtherCurrentLiability") {
          totalOtherLiability = HeaderAccountTotal;
        } else {

        }
      }
      totalNettAssets = GrandTotalAsset - GrandTotalLiability;

      templateObject.totalAgedReceivables.set(utilityService.modifynegativeCurrencyFormat(totalAgedReceivables));
      templateObject.totalAgedPayables.set(utilityService.modifynegativeCurrencyFormat(totalAgedPayables));
      templateObject.totalNettAssets.set(utilityService.modifynegativeCurrencyFormat(totalNettAssets));
      
      if (totalEq != 0) {
        investReturn = totalNetIncome / totalEq;
      }
      investReturn = investReturn.toFixed(2);
      templateObject.grossProfitMargin.set(utilityService.modifynegativeCurrencyFormat(grossProfitMg));
      templateObject.netProfitMargin.set(utilityService.modifynegativeCurrencyFormat(netProfitMg));
      templateObject.returnOnInvestment.set(investReturn);

      currentAsset = totalCurrentAsset - totalCurrentLiability;
      termAsset = totalOtherAsset - totalOtherLiability;

      templateObject.avgDebtors.set(utilityService.modifynegativeCurrencyFormat(avgDebtors));
      templateObject.avgCreditors.set(utilityService.modifynegativeCurrencyFormat(avgCreditors));
      templateObject.shortTermCash.set(utilityService.modifynegativeCurrencyFormat(shortTermCash));
      templateObject.currentAsset.set(utilityService.modifynegativeCurrencyFormat(currentAsset));
      templateObject.termAsset.set(utilityService.modifynegativeCurrencyFormat(termAsset));
    }
  };

  var curDate = new Date();
  var getLoadDate = moment(curDate).format("YYYY-MM-DD");
  templateObject.getBalanceSheetReports(getLoadDate);

  templateObject.loadCurrency = async() => {
    await loadCurrency();
  };
  //templateObject.loadCurrency();

  templateObject.loadCurrencyHistory = async() => {
    await loadCurrencyHistory();
  };
  //templateObject.loadCurrencyHistory();
});

Template.executivesummaryreport.events({
  "click .btnPrintReport": function(event) {
    $("a").attr("href", "/");
    document.title = "Executive Summary Report";
    $(".printReport").print({
        title: document.title + " | ExecutiveSummary | " + loggedCompany,
        noPrintSelector: ".addSummaryEditor",
        mediaPrint: false,
    });

    setTimeout(function() {
        $("a").attr("href", "#");
    }, 100);
  },
  "click .btnExportReport": function() {
    $(".fullScreenSpin").css("display", "inline-block");
    let utilityService = new UtilityService();
    const filename = loggedCompany + "-ExecutiveSummary" + ".csv";
    utilityService.exportReportToCsvTable("tableExport", filename, "csv");
  },
  "click .fx-rate-btn": async(e) => {
    await loadCurrency();
    //loadCurrencyHistory();
},
});

Template.executivesummaryreport.helpers({
  dateAsAt: () =>{
      return Template.instance().dateAsAt.get() || '-';
  },
  titleMonth1: () =>{
      return Template.instance().titleMonth1.get();
  },
  titleMonth2: () =>{
      return Template.instance().titleMonth2.get();
  },
  totalSales: () =>{
      return Template.instance().totalSales.get() || 0;
  },
  grossProfit: () =>{
      return Template.instance().grossProfit.get() || 0;
  },
  totalExpenses: () =>{
      return Template.instance().totalExpenses.get() || 0;
  },
  nettProfit: () =>{
      return Template.instance().nettProfit.get() || 0;
  },
  totalAgedReceivables: () =>{
      return Template.instance().totalAgedReceivables.get() || 0;
  },
  totalAgedPayables: () =>{
      return Template.instance().totalAgedPayables.get() || 0;
  },
  totalNettAssets: () =>{
      return Template.instance().totalNettAssets.get() || 0;
  },
  totalInvoiceCount: () =>{
      return Template.instance().totalInvoiceCount.get() || 0;
  },
  averageInvoiceValue: () =>{
      return Template.instance().averageInvoiceValue.get() || 0;
  },
  totalInvoiceValue: () =>{
      return Template.instance().totalInvoiceValue.get() || 0;
  },
  grossProfitMargin: () =>{
      return Template.instance().grossProfitMargin.get() || 0;
  },
  netProfitMargin: () =>{
      return Template.instance().netProfitMargin.get() || 0;
  },
  returnOnInvestment: () =>{
      return Template.instance().returnOnInvestment.get() || 0;
  },
  avgDebtors: () =>{
      return Template.instance().avgDebtors.get() || 0;
  },
  avgCreditors: () =>{
      return Template.instance().avgCreditors.get() || 0;
  },
  shortTermCash: () =>{
      return Template.instance().shortTermCash.get() || 0;
  },
  currentAsset: () =>{
      return Template.instance().currentAsset.get() || 0;
  },
  termAsset: () =>{
      return Template.instance().termAsset.get() || 0;
  },
  currencyList: () => {
    return Template.instance().currencyList.get();
  },
  isCurrencyListActive() {
    const array = Template.instance().currencyList.get();
    let activeArray = array.filter((c) => c.active == true);

    return activeArray.length > 0;
  },
  currency: () => {
    return Currency;
  },
  currencyRecord: () => {
    return Template.instance().currencyRecord.get();
  },
});
Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('notEquals', function (a, b) {
    return a != b;
});

Template.registerHelper('containsequals', function (a, b) {
    return (a.indexOf(b) >= 0 );
});

async function loadCurrency() {
  let templateObject = Template.instance();

  if ((await templateObject.currencyList.get().length) == 0) {
      LoadingOverlay.show();

      let _currencyList = [];
      const result = await taxRateService.getCurrencies();

      //taxRateService.getCurrencies().then((result) => {

      const data = result.tcurrency;

      for (let i = 0; i < data.length; i++) {
          // let taxRate = (data.tcurrency[i].fields.Rate * 100).toFixed(2) + '%';
          var dataList = {
              id: data[i].Id || "",
              code: data[i].Code || "-",
              currency: data[i].Currency || "NA",
              symbol: data[i].CurrencySymbol || "NA",
              buyrate: data[i].BuyRate || "-",
              sellrate: data[i].SellRate || "-",
              country: data[i].Country || "NA",
              description: data[i].CurrencyDesc || "-",
              ratelastmodified: data[i].RateLastModified || "-",
              active: data[i].Code == defaultCurrencyCode ? true : false, // By default if AUD then true
              //active: false,
              // createdAt: new Date(data[i].MsTimeStamp) || "-",
              // formatedCreatedAt: formatDateToString(new Date(data[i].MsTimeStamp))
          };

          _currencyList.push(dataList);
          //}
      }
      _currencyList = _currencyList.sort((a, b) => {
          return a.currency
              .split("")[0]
              .toLowerCase()
              .localeCompare(b.currency.split("")[0].toLowerCase());
      });

      templateObject.currencyList.set(_currencyList);

      await loadCurrencyHistory(templateObject);
      LoadingOverlay.hide();
      //});
  }
}

async function loadCurrencyHistory(templateObject) {
  let result = await taxRateService.getCurrencyHistory();
  const data = result.tcurrencyratehistory;
  templateObject.tcurrencyratehistory.set(data);
  LoadingOverlay.hide();
}