import { ReportService } from "../../reports/report-service";
import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');

Template.balancesheetchart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.totalAgedReceivablesPerc1 = new ReactiveVar();
  templateObject.totalAgedPayablesPerc1 = new ReactiveVar();
  templateObject.totalNettAssetsPerc1 = new ReactiveVar();
  templateObject.totalAgedReceivablesPerc2 = new ReactiveVar();
  templateObject.totalAgedPayablesPerc2 = new ReactiveVar();
  templateObject.totalNettAssetsPerc2 = new ReactiveVar();
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

  let totalAgedReceivables = [0, 0];
  let totalAgedPayables = [0, 0];
  let totalNettAssets = [0, 0];
  let GrandTotalAsset = 0;
  let GrandTotalLiability = 0;

  let totalAgedReceivablesPerc1 = 0;
  let totalAgedPayablesPerc1 = 0;
  let totalNettAssetsPerc1 = 0;
  let totalAgedReceivablesPerc2 = 0;
  let totalAgedPayablesPerc2 = 0;
  let totalNettAssetsPerc2 = 0;

  let varianceRed = "#ff420e";
  let varianceGreen = "#579D1C;";

  templateObject.calculatePercent = function(ptotalAgedReceivables, ptotalAgedPayables, ptotalNettAssets) {
    var rtotalAgedReceivablesPerc = 0;
    var rtotalAgedPayablesPerc = 0;
    var rtotalNettAssetsPerc = 0;
    var maxValue = Math.max(Math.abs(ptotalAgedReceivables), Math.abs(ptotalAgedPayables), Math.abs(ptotalNettAssets));
    if (maxValue > 0) {
      rtotalAgedReceivablesPerc = Math.round(Math.abs(ptotalAgedReceivables) / maxValue * 100);
      if (rtotalAgedReceivablesPerc < 40)
        rtotalAgedReceivablesPerc = 40;
      rtotalAgedPayablesPerc = Math.round(Math.abs(ptotalAgedPayables) / maxValue * 100);
      if (rtotalAgedPayablesPerc < 40)
        rtotalAgedPayablesPerc = 40;
      rtotalNettAssetsPerc = Math.round(Math.abs(ptotalNettAssets) / maxValue * 100);
      if (rtotalNettAssetsPerc < 40)
        rtotalNettAssetsPerc = 40;
    }
    return [rtotalAgedReceivablesPerc, rtotalAgedPayablesPerc, rtotalNettAssetsPerc];
  }

  templateObject.setFieldValue = function(fieldVal, fieldSelector) {
    if (fieldVal >= 0) {
      $('.' + fieldSelector).html(utilityService.modifynegativeCurrencyFormat(fieldVal));
    } else {
      $('.' + fieldSelector).html('{' + utilityService.modifynegativeCurrencyFormat(Math.abs(fieldVal)) + '}');
      $('.' + fieldSelector).css('color', 'red');
    }
  }

  templateObject.setFieldVariance = function(fieldVal1, fieldVal2, fieldSelector, parentSelector) {
    var fieldVariance = 0;
    if (fieldVal1 == 0) {
      if (fieldVal2 > 0) {
        fieldVariance = 100;
        $('.' + parentSelector).css("backgroundColor", varianceGreen);
      } else if (fieldVal2 == 0) {
        fieldVariance = 0;
        $('.' + parentSelector).css("backgroundColor", varianceGreen);
      } else {
        fieldVariance = -100;
        $('.' + parentSelector).css("backgroundColor", varianceRed);
      }
    } else {
      if (fieldVal1 > 0)
      fieldVariance = (fieldVal2 - fieldVal1) / fieldVal1 * 100;
      else
        fieldVariance = (fieldVal2 - fieldVal1) / Math.abs(fieldVal1) * 100;
      if (fieldVariance >= 0)
        $('.' + parentSelector).css("backgroundColor", varianceGreen);
      else
        $('.' + parentSelector).css("backgroundColor", varianceRed);
    }
    $('.' + fieldSelector).html(fieldVariance.toFixed(1));
  }

  templateObject.getBalanceSheetReports = async () => {
    var curDate = new Date();
    var dateTo1 = new Date(curDate.getFullYear(), curDate.getMonth() - 1, 0);
    var dateTo2 = new Date(curDate.getFullYear(), curDate.getMonth(), 0);
    var loadDate1 = moment(dateTo1).format("YYYY-MM-DD");
    var loadDate2 = moment(dateTo2).format("YYYY-MM-DD");
    var loadDates = [];
    loadDates.push(loadDate1);
    loadDates.push(loadDate2);

    let SubAccountTotal = 0;
    let HeaderAccountTotal = 0;
    let TotalAsset_Liability = 0;
    let AccountTree = "";
    
    for (var k=0; k<2; k++) {
      let data = await reportService.getBalanceSheetReport(loadDates[k]);
      if (data.balancesheetreport) {      
        for (let i = 0, len = data.balancesheetreport.length; i < len; i++) {
          SubAccountTotal = data.balancesheetreport[i]["Sub Account Total"];
          HeaderAccountTotal = data.balancesheetreport[i]["Header Account Total"];
          TotalAsset_Liability = data.balancesheetreport[i]["Total Asset & Liability"];

          AccountTree = data.balancesheetreport[i]["Account Tree"];
          if (AccountTree.replace(/\s/g, "") == "TotalAccountsReceivable") {
            totalAgedReceivables[k] = HeaderAccountTotal;
          } else if (AccountTree.replace(/\s/g, "") == "TotalAccountsPayable") {
            totalAgedPayables[k] = SubAccountTotal;
          } else if (AccountTree.replace(/\s/g, "") == "TOTALASSETS") {
            GrandTotalAsset = TotalAsset_Liability;
          } else if (AccountTree.replace(/\s/g, "") == "TOTALLIABILITIES&EQUITY") {
            GrandTotalLiability = TotalAsset_Liability;
          } else {

          }
        }
        totalNettAssets[k] = GrandTotalAsset - GrandTotalLiability;
      }
    }
    [totalAgedReceivablesPerc1, totalAgedPayablesPerc1, totalNettAssetsPerc1] = templateObject.calculatePercent(totalAgedReceivables[0], totalAgedPayables[0], totalNettAssets[0]);
    [totalAgedReceivablesPerc2, totalAgedPayablesPerc2, totalNettAssetsPerc2] = templateObject.calculatePercent(totalAgedReceivables[1], totalAgedPayables[1], totalNettAssets[1]);
    
    templateObject.totalAgedReceivablesPerc1.set(totalAgedReceivablesPerc1);
    templateObject.totalAgedPayablesPerc1.set(totalAgedPayablesPerc1);
    templateObject.totalNettAssetsPerc1.set(totalNettAssetsPerc1);
    templateObject.totalAgedReceivablesPerc2.set(totalAgedReceivablesPerc2);
    templateObject.totalAgedPayablesPerc2.set(totalAgedPayablesPerc2);
    templateObject.totalNettAssetsPerc2.set(totalNettAssetsPerc2);

    templateObject.setFieldValue(totalAgedReceivables[0], "spnTotalAgedReceivables");
    templateObject.setFieldValue(totalAgedPayables[0], "spnTotalAgedPayables");
    templateObject.setFieldValue(totalNettAssets[0], "spnTotalNettAssets");
    templateObject.setFieldValue(totalAgedReceivables[1], "spnTotalAgedReceivables2");
    templateObject.setFieldValue(totalAgedPayables[1], "spnTotalAgedPayables2");
    templateObject.setFieldValue(totalNettAssets[1], "spnTotalNettAssets2");

    templateObject.setFieldVariance(totalAgedReceivables[0], totalAgedReceivables[1], "spnTotalAgedReceivablesVariance", "divTotalAgedReceivablesVariance");
    templateObject.setFieldVariance(totalAgedPayables[0], totalAgedPayables[1], "spnTotalAgedPayablesVariance", "divTotalAgedPayablesVariance");
    templateObject.setFieldVariance(totalNettAssets[0], totalNettAssets[1], "spnTotalNettAssetVariance", "divTotalNettAssetVariance");
  };
  templateObject.getBalanceSheetReports();
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
  totalAgedReceivablesPerc1: () =>{
      return Template.instance().totalAgedReceivablesPerc1.get() || 0;
  },
  totalAgedPayablesPerc1: () =>{
      return Template.instance().totalAgedPayablesPerc1.get() || 0;
  },
  totalNettAssetsPerc1: () =>{
      return Template.instance().totalNettAssetsPerc1.get() || 0;
  },
  totalAgedReceivablesPerc2: () =>{
      return Template.instance().totalAgedReceivablesPerc2.get() || 0;
  },
  totalAgedPayablesPerc2: () =>{
      return Template.instance().totalAgedPayablesPerc2.get() || 0;
  },
  totalNettAssetsPerc2: () =>{
      return Template.instance().totalNettAssetsPerc2.get() || 0;
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
