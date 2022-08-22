import { ReportService } from "../../reports/report-service";
import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.balancesheetchart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.totalAgedReceivables = new ReactiveVar();
  templateObject.totalAgedPayables = new ReactiveVar();
  templateObject.totalNettAssets = new ReactiveVar();
  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();
});

Template.balancesheetchart.onRendered(()=>{
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

  let totalAgedReceivables = 0;
  let totalAgedPayables = 0;
  let totalNettAssets = 0;
  let GrandTotalAsset = 0;
  let GrandTotalLiability = 0;
  templateObject.getBalanceSheetReports = async (dateAsOf) => {
    let data = !localStorage.getItem("VS1BalanceSheet_Report1")
      ? await reportService.getBalanceSheetReport(dateAsOf)
      : JSON.parse(localStorage.getItem("VS1BalanceSheet_Report"));

    if (data.balancesheetreport) {
      
      for (let i = 0, len = data.balancesheetreport.length; i < len; i++) {
        let SubAccountTotal = data.balancesheetreport[i]["Sub Account Total"];
        let HeaderAccountTotal = data.balancesheetreport[i]["Header Account Total"];
        let TotalAsset_Liability = data.balancesheetreport[i]["Total Asset & Liability"];

        let AccountTree = data.balancesheetreport[i]["Account Tree"];
        if (AccountTree.replace(/\s/g, "") == "TotalAccountsReceivable") {
          totalAgedReceivables = HeaderAccountTotal;
        } else if (AccountTree.replace(/\s/g, "") == "TotalAccountsPayable") {
          totalAgedPayables = SubAccountTotal;
        } else if (AccountTree.replace(/\s/g, "") == "TOTALASSETS") {
          GrandTotalAsset = TotalAsset_Liability;
        } else if (AccountTree.replace(/\s/g, "") == "TOTALLIABILITIES&EQUITY") {
          GrandTotalLiability = TotalAsset_Liability;
        } else {

        }
      }
      totalNettAssets = GrandTotalAsset - GrandTotalLiability;

      templateObject.totalAgedReceivables.set(totalAgedReceivables);
      templateObject.totalAgedPayables.set(totalAgedPayables);
      templateObject.totalNettAssets.set(totalNettAssets);
      $(".spnTotalAgedReceivables").html(utilityService.modifynegativeCurrencyFormat(totalAgedReceivables));
      $(".spnTotalAgedPayables").html(utilityService.modifynegativeCurrencyFormat(totalAgedPayables));
      $(".spnTotalNettAssets").html(utilityService.modifynegativeCurrencyFormat(totalNettAssets));
    }
  };

  var curDate = new Date();
  var getLoadDate = moment(curDate).format("YYYY-MM-DD");
  templateObject.getBalanceSheetReports(getLoadDate);
});

Template.balancesheetchart.events({
});

Template.balancesheetchart.helpers({
  dateAsAt: () =>{
      return Template.instance().dateAsAt.get() || '-';
  },
  titleMonth1: () =>{
      return Template.instance().titleMonth1.get();
  },
  titleMonth2: () =>{
      return Template.instance().titleMonth2.get();
  },
  totalAgedReceivables: () =>{
      return Template.instance().totalAgedReceivables.get() || 0;
  },
  totalAgedPayables: () =>{
      return Template.instance().totalAgedPayables.get() || 0;
  },
  totalNettAssets: () =>{
      return Template.instance().totalNettAssets.get() || 0;
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


