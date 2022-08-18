import { ReportService } from "../../reports/report-service";
import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { template } from "lodash";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.performancechart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  
  templateObject.grossProfitMargin = new ReactiveVar();
  templateObject.netProfitMargin = new ReactiveVar();
  templateObject.returnOnInvestment = new ReactiveVar();
});

Template.performancechart.onRendered(()=>{
  const templateObject = Template.instance();
  let reportService = new ReportService();
  let utilityService = new UtilityService();
  
  let totalExpense = localStorage.getItem('VS1ProfitandLoss_ExpEx_dash') || 0;
  let totalCOGS = localStorage.getItem('VS1ProfitandLoss_COGSEx_dash') || 0;
  let totalSales = localStorage.getItem('VS1ProfitandLoss_IncomeEx_dash') || 0;
  let totalNetIncome = localStorage.getItem('VS1ProfitandLoss_netIncomeEx_dash') || 0;

  let grossProfitMg = (Number(totalSales) - Number(totalCOGS)) || 0;
  let netProfitMg = (Number(totalSales) - Number(totalExpense)) || 0;
  let totalEq = 0;
  let investReturn = 0;

  templateObject.getBalanceSheetReports = async (dateAsOf) => {
    let data = !localStorage.getItem("VS1BalanceSheet_Report1")
      ? await reportService.getBalanceSheetReport(dateAsOf)
      : JSON.parse(localStorage.getItem("VS1BalanceSheet_Report"));

    let records = [];
    if (data.balancesheetreport) {
      for (let i = 0, len = data.balancesheetreport.length; i < len; i++) {
        let TotalCurrentAsset_Liability = data.balancesheetreport[i]["Total Current Asset & Liability"];
        let AccountTree = data.balancesheetreport[i]["Account Tree"];
        
        if (AccountTree.replace(/\s/g, "") == "TotalCapital/Equity") {
          totalEq = TotalCurrentAsset_Liability;
          break;
        }
      }
      if (totalEq != 0) {
        investReturn = totalNetIncome / totalEq;
      }
      investReturn = investReturn.toFixed(2);
      templateObject.grossProfitMargin.set(grossProfitMg);
      templateObject.netProfitMargin.set(netProfitMg);
      templateObject.returnOnInvestment.set(investReturn);
      $(".spnGrossProfitMargin").html(utilityService.modifynegativeCurrencyFormat(grossProfitMg));
      $(".spnNetProfitMargin").html(utilityService.modifynegativeCurrencyFormat(netProfitMg));
      $(".spnReturnInvest").html(investReturn);
    }
  };

  var curDate = new Date();
  var getLoadDate = moment(curDate).format("YYYY-MM-DD");
  templateObject.getBalanceSheetReports(getLoadDate);

});

Template.performancechart.events({
});

Template.performancechart.helpers({
  dateAsAt: () =>{
      return Template.instance().dateAsAt.get() || '-';
  },
  grossProfitMargin: () =>{
      return Template.instance().grossProfitMargin.get() || 0;
  },
  netProfitMargin: () =>{
      return Template.instance().netProfitMargin.get() || 0;
  },
  returnOnInvestment: () =>{
      return Template.instance().returnOnInvestment.get() || 0;
  }
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

