import { ReportService } from "../../reports/report-service";
import { SalesBoardService } from '../../js/sales-service';
import {ContactService} from "../../contacts/contact-service";
import { SideBarService } from '../../js/sidebar-service';
import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { template } from "lodash";
let _ = require('lodash');

Template.positionchart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.avgDebtorsPerc1 = new ReactiveVar();
  templateObject.avgCreditorsPerc1 = new ReactiveVar();
  templateObject.shortTermCashPerc1 = new ReactiveVar();
  templateObject.currentAssetPerc1 = new ReactiveVar();
  templateObject.termAssetPerc1 = new ReactiveVar();
  templateObject.avgDebtorsPerc2 = new ReactiveVar();
  templateObject.avgCreditorsPerc2 = new ReactiveVar();
  templateObject.shortTermCashPerc2 = new ReactiveVar();
  templateObject.currentAssetPerc2 = new ReactiveVar();
  templateObject.termAssetPerc2 = new ReactiveVar();
  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();
});

Template.positionchart.onRendered(()=>{
  const templateObject = Template.instance();
  let salesService = new SalesBoardService();
  let contactService = new ContactService();
  let sideBarService = new SideBarService();
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

  let avgDebtors = [0, 0];
  let avgCreditors = [0, 0];
  let shortTermCash = [0, 0];
  let currentAsset = [0, 0];
  let termAsset = [0, 0];

  let totalCurrentAsset = 0;
  let totalCurrentLiability = 0;
  let totalOtherAsset = 0;
  let totalOtherLiability = 0;

  let avgDebtorsPerc1 = 0;
  let avgCreditorsPerc1 = 0;
  let shortTermCashPerc1 = 0;
  let currentAssetPerc1 = 0;
  let termAssetPerc1 = 0;
  let avgDebtorsPerc2 = 0;
  let avgCreditorsPerc2 = 0;
  let shortTermCashPerc2 = 0;
  let currentAssetPerc2 = 0;
  let termAssetPerc2 = 0;

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
      if (fieldSelector == "spnAverageDebtors" || fieldSelector == "spnAverageDebtors2" || fieldSelector == "spnAverageCreditors" || fieldSelector == "spnAverageCreditors2")
        $('.' + fieldSelector).html(fieldVal);
      else
        $('.' + fieldSelector).html(utilityService.modifynegativeCurrencyFormat(fieldVal));
    } else {
      if (fieldSelector == "spnAverageDebtors" || fieldSelector == "spnAverageDebtors2" || fieldSelector == "spnAverageCreditors" || fieldSelector == "spnAverageCreditors2")
        $('.' + fieldSelector).html(Math.abs(fieldVal));
      else
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

  templateObject.getPositionReports = async () => {
    try{
      var curDate = new Date();
      var dateAsOf = curDate.getFullYear() + '-' + ("0" + (curDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (curDate.getDate())).slice(-2);

      let data = await reportService.getCardDataReport(dateAsOf);
      if (data.tcarddatareport) {
        let resData = data.tcarddatareport[0];
        avgDebtors[0] = resData.Pos_AvgDebtDays1;
        avgDebtors[1] = resData.Pos_AvgDebtDays2;
        avgCreditors[0] = resData.Pos_AvgCredDays1;
        avgCreditors[1] = resData.Pos_AvgCredDays2;
        shortTermCash[0] = resData.Pos_CashForecast1;
        shortTermCash[1] = resData.Pos_CashForecast2;
        currentAsset[0] = resData.Pos_AssetToLiab1;
        currentAsset[1] = resData.Pos_AssetToLiab2;
        termAsset[0] = resData.Sheet_AssetToLiab1;
        termAsset[1] = resData.Sheet_AssetToLiab2;
      }

      let pArr = [];
      for (var i=0; i<2; i++) {
        pArr.push(avgDebtors[i]);
        pArr.push(avgCreditors[i]);
        pArr.push(shortTermCash[i]);
        pArr.push(currentAsset[i]);
        pArr.push(termAsset[i]);
      }
      let rArr = [];
      rArr = templateObject.calculatePercent(pArr);
      avgDebtorsPerc1 = rArr[0];
      avgCreditorsPerc1 = rArr[1];
      shortTermCashPerc1 = rArr[2];
      currentAssetPerc1 = rArr[3];
      termAssetPerc1 = rArr[4];
      avgDebtorsPerc2 = rArr[5];
      avgCreditorsPerc2 = rArr[6];
      shortTermCashPerc2 = rArr[7];
      currentAssetPerc2 = rArr[8];
      termAssetPerc2 = rArr[9];

      templateObject.avgDebtorsPerc1.set(avgDebtorsPerc1);
      templateObject.avgCreditorsPerc1.set(avgCreditorsPerc1);
      templateObject.shortTermCashPerc1.set(shortTermCashPerc1);
      templateObject.currentAssetPerc1.set(currentAssetPerc1);
      templateObject.termAssetPerc1.set(termAssetPerc1);
      templateObject.avgDebtorsPerc2.set(avgDebtorsPerc2);
      templateObject.avgCreditorsPerc2.set(avgCreditorsPerc2);
      templateObject.shortTermCashPerc2.set(shortTermCashPerc2);
      templateObject.currentAssetPerc2.set(currentAssetPerc2);
      templateObject.termAssetPerc2.set(termAssetPerc2);

      templateObject.setFieldValue(avgDebtors[0], "spnAverageDebtors");
      templateObject.setFieldValue(avgCreditors[0], "spnAverageCreditors");
      templateObject.setFieldValue(shortTermCash[0], "spnShortTermCash");
      templateObject.setFieldValue(currentAsset[0], "spnCurrentAsset");
      templateObject.setFieldValue(termAsset[0], "spnTermAsset");
      templateObject.setFieldValue(avgDebtors[1], "spnAverageDebtors2");
      templateObject.setFieldValue(avgCreditors[1], "spnAverageCreditors2");
      templateObject.setFieldValue(shortTermCash[1], "spnShortTermCash2");
      templateObject.setFieldValue(currentAsset[1], "spnCurrentAsset2");
      templateObject.setFieldValue(termAsset[1], "spnTermAsset2");

      templateObject.setFieldVariance(avgDebtors[0], avgDebtors[1], "spnAverageDebtorsVariance", "divAverageDebtorsVariance");
      templateObject.setFieldVariance(avgCreditors[0], avgCreditors[1], "spnAverageCreditorsVariance", "divAverageCreditorsVariance");
      templateObject.setFieldVariance(shortTermCash[0], shortTermCash[1], "spnShortTermCashVariance", "divShortTermCashVariance");
      templateObject.setFieldVariance(currentAsset[0], currentAsset[1], "spnCurrentAssetVariance", "divCurrentAssetVariance");
      templateObject.setFieldVariance(termAsset[0], termAsset[1], "spnTermAssetVariance", "divTermAssetVariance");
    } catch (err) {

    }
  };
  templateObject.getPositionReports();
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
  avgDebtorsPerc1: () =>{
    return Template.instance().avgDebtorsPerc1.get() || 0;
  },
  avgCreditorsPerc1: () =>{
    return Template.instance().avgCreditorsPerc1.get() || 0;
  },
  shortTermCashPerc1: () =>{
    return Template.instance().shortTermCashPerc1.get() || 0;
  },
  currentAssetPerc1: () =>{
    return Template.instance().currentAssetPerc1.get() || 0;
  },
  termAssetPerc1: () =>{
    return Template.instance().termAssetPerc1.get() || 0;
  },
  avgDebtorsPerc2: () =>{
    return Template.instance().avgDebtorsPerc2.get() || 0;
  },
  avgCreditorsPerc2: () =>{
    return Template.instance().avgCreditorsPerc2.get() || 0;
  },
  shortTermCashPerc2: () =>{
    return Template.instance().shortTermCashPerc2.get() || 0;
  },
  currentAssetPerc2: () =>{
    return Template.instance().currentAssetPerc2.get() || 0;
  },
  termAssetPerc2: () =>{
    return Template.instance().termAssetPerc2.get() || 0;
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
