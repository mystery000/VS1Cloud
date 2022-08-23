import { ReportService } from "../../reports/report-service";
import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.positionchart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.avgDebtors = new ReactiveVar();
  templateObject.avgCreditors = new ReactiveVar();
  templateObject.shortTermCash = new ReactiveVar();
  templateObject.currentAsset = new ReactiveVar();
  templateObject.termAsset = new ReactiveVar();
  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();
});

Template.positionchart.onRendered(()=>{
  const templateObject = Template.instance();
  let reportService = new ReportService();
  let utilityService = new UtilityService();

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
        let TotalCurrentAsset_Liability = data.balancesheetreport[i]["Total Current Asset & Liability"];
        let TotalAsset_Liability = data.balancesheetreport[i]["Total Asset & Liability"];

        let AccountTree = data.balancesheetreport[i]["Account Tree"];
        if (AccountTree.replace(/\s/g, "") == "TotalCurrentAssets") {
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
      
      currentAsset = totalCurrentAsset - totalCurrentLiability;
      termAsset = totalOtherAsset - totalOtherLiability;

      templateObject.avgDebtors.set(avgDebtors);
      templateObject.avgCreditors.set(avgCreditors);
      templateObject.shortTermCash.set(shortTermCash);
      templateObject.currentAsset.set(currentAsset);
      templateObject.termAsset.set(termAsset);

      $(".spnAverageDebtors").html(utilityService.modifynegativeCurrencyFormat(avgDebtors));
      $(".spnAverageCreditors").html(utilityService.modifynegativeCurrencyFormat(avgCreditors));
      $(".shortTermCash").html(utilityService.modifynegativeCurrencyFormat(shortTermCash));
      $(".spnCurrentAsset").html(utilityService.modifynegativeCurrencyFormat(currentAsset));
      $(".spnTermAsset").html(utilityService.modifynegativeCurrencyFormat(termAsset));
    }
  };

  var curDate = new Date();
  var getLoadDate = moment(curDate).format("YYYY-MM-DD");
  templateObject.getBalanceSheetReports(getLoadDate);
});

Template.positionchart.events({
});

Template.positionchart.helpers({
  dateAsAt: () =>{
      return Template.instance().dateAsAt.get() || '-';
  },
  titleMonth1: () =>{
      return Template.instance().titleMonth1.get();
  },
  titleMonth2: () =>{
      return Template.instance().titleMonth2.get();
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

