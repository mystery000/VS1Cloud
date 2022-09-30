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

  let totalAgedReceivablesPerc1 = 0;
  let totalAgedPayablesPerc1 = 0;
  let totalNettAssetsPerc1 = 0;
  let totalAgedReceivablesPerc2 = 0;
  let totalAgedPayablesPerc2 = 0;
  let totalNettAssetsPerc2 = 0;

  let varianceRed = "#ff420e";
  let varianceGreen = "#579D1C;";
  let minPerc = 40;

  templateObject.calculatePercent = function(pArrVal) {
    var rArrVal = [];
    var rArrAbs = [];
    var i = 0;
    for (i=0; i<pArrVal.length; i++) {
      rArrVal.push(minPerc);
    }
    for (i=0; i<pArrVal.length; i++){
      rArrAbs.push(Math.abs(pArrVal[i]));
    }
    var maxValue = Math.max(...rArrAbs);
    if (maxValue > 0) {
      for (i=0; i<pArrVal.length; i++){
        rArrVal[i] = Math.round(rArrAbs[i] / maxValue * 100);
        if (rArrVal[i] < minPerc)
          rArrVal[i] = minPerc;
      }
    }
    return rArrVal;
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
    try{
      var curDate = new Date();
      var dateAsOf = curDate.getFullYear() + '-' + ("0" + (curDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (curDate.getDate())).slice(-2);

      let data = await reportService.getCardDataReport(dateAsOf);
      if (data.tcarddatareport) {
        let resData = data.tcarddatareport[0];
        totalAgedReceivables[0] = resData.Bal_Debtors1;
        totalAgedReceivables[1] = resData.Bal_Debtors2;
        totalAgedPayables[0] = resData.Bal_Creditors1;
        totalAgedPayables[1] = resData.Bal_Creditors2;
        totalNettAssets[0] = resData.Bal_NetAsset1;
        totalNettAssets[1] = resData.Bal_NetAsset2;
      }

      let pArr = [];
      for (var i=0; i<2; i++) {
        pArr.push(totalAgedReceivables[i]);
        pArr.push(totalAgedPayables[i]);
        pArr.push(totalNettAssets[i]);
      }
      let rArr = [];
      rArr = templateObject.calculatePercent(pArr);
      totalAgedReceivablesPerc1 = rArr[0];
      totalAgedPayablesPerc1 = rArr[1];
      totalNettAssetsPerc1 = rArr[2];
      totalAgedReceivablesPerc2 = rArr[3];
      totalAgedPayablesPerc2 = rArr[4];
      totalNettAssetsPerc2 = rArr[5];

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
    } catch (err) {

    }
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
