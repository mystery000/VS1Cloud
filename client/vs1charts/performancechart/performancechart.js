import { ReportService } from "../../reports/report-service";
import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');

Template.performancechart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();

  templateObject.grossProfitMarginPerc1 = new ReactiveVar();
  templateObject.netProfitMarginPerc1 = new ReactiveVar();
  templateObject.returnOnInvestmentPerc1 = new ReactiveVar();
  templateObject.grossProfitMarginPerc2 = new ReactiveVar();
  templateObject.netProfitMarginPerc2 = new ReactiveVar();
  templateObject.returnOnInvestmentPerc2 = new ReactiveVar();
  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();
});

Template.performancechart.onRendered(()=>{
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

  let totalExpense = [];
  let totalCOGS = [];
  let totalSales = [];
  let totalNetIncome = [];
  let grossProfit = [];

  let grossProfitMarginPerc1 = 0;
  let netProfitMarginPerc1 = 0;
  let returnOnInvestmentPerc1 = 0;
  let grossProfitMarginPerc2 = 0;
  let netProfitMarginPerc2 = 0;
  let returnOnInvestmentPerc2 = 0;

  let grossProfitMg = [0, 0];
  let netProfitMg = [0, 0];
  let investReturns = [0, 0];

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
      if (fieldSelector == "spnReturnInvest" || fieldSelector == "spnReturnInvest2")
        $('.' + fieldSelector).html(fieldVal);
      else
        $('.' + fieldSelector).html(utilityService.modifynegativeCurrencyFormat(fieldVal));
    } else {
      if (fieldSelector == "spnReturnInvest" || fieldSelector == "spnReturnInvest2")
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

  templateObject.getPerformanceReports = async () => {
    try{
      var curDate = new Date();
      var dateAsOf = curDate.getFullYear() + '-' + ("0" + (curDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (curDate.getDate())).slice(-2);

      let data = await reportService.getCardDataReport(dateAsOf);
      if (data.tcarddatareport) {
        let resData = data.tcarddatareport[0];
        grossProfitMg[0] = resData.Perf_GrossMargin1;
        grossProfitMg[1] = resData.Perf_GrossMargin2;
        netProfitMg[0] = resData.Perf_NetMargin1;
        netProfitMg[1] = resData.Perf_NetMargin2;
        investReturns[0] = resData.Perf_ROI1;
        investReturns[1] = resData.Perf_ROI2;
      }

      let pArr = [];
      for (var i=0; i<2; i++) {
        pArr.push(grossProfitMg[i]);
        pArr.push(netProfitMg[i]);
        pArr.push(investReturns[i]);
      }
      let rArr = [];
      rArr = templateObject.calculatePercent(pArr);
      grossProfitMarginPerc1 = rArr[0];
      netProfitMarginPerc1 = rArr[1];
      returnOnInvestmentPerc1 = rArr[2];
      grossProfitMarginPerc2 = rArr[3];
      netProfitMarginPerc2 = rArr[4];
      returnOnInvestmentPerc2 = rArr[5];

      templateObject.grossProfitMarginPerc1.set(grossProfitMarginPerc1);
      templateObject.netProfitMarginPerc1.set(netProfitMarginPerc1);
      templateObject.returnOnInvestmentPerc1.set(returnOnInvestmentPerc1);
      templateObject.grossProfitMarginPerc2.set(grossProfitMarginPerc2);
      templateObject.netProfitMarginPerc2.set(netProfitMarginPerc2);
      templateObject.returnOnInvestmentPerc2.set(returnOnInvestmentPerc2);

      templateObject.setFieldValue(grossProfitMg[0], "spnGrossProfitMargin");
      templateObject.setFieldValue(netProfitMg[0], "spnNetProfitMargin");
      templateObject.setFieldValue(investReturns[0], "spnReturnInvest");
      templateObject.setFieldValue(grossProfitMg[1], "spnGrossProfitMargin2");
      templateObject.setFieldValue(netProfitMg[1], "spnNetProfitMargin2");
      templateObject.setFieldValue(investReturns[1], "spnReturnInvest2");

      templateObject.setFieldVariance(grossProfitMg[0], grossProfitMg[1], "spnGrossProfitMarginVariance", "divGrossProfitMarginVariance");
      templateObject.setFieldVariance(netProfitMg[0], netProfitMg[1], "spnNetProfitMarginVariance", "divNetProfitMarginVariance");
      templateObject.setFieldVariance(investReturns[0], investReturns[1], "spnReturnInvestVariance", "divReturnInvestVariance");
    } catch (err) {

    }
  };
  templateObject.getPerformanceReports();
});

Template.performancechart.events({
});

Template.performancechart.helpers({
  dateAsAt: () =>{
      return Template.instance().dateAsAt.get() || '-';
  },
  titleMonth1: () =>{
      return Template.instance().titleMonth1.get();
  },
  titleMonth2: () =>{
      return Template.instance().titleMonth2.get();
  },
  grossProfitMarginPerc1: () =>{
      return Template.instance().grossProfitMarginPerc1.get() || 0;
  },
  netProfitMarginPerc1: () =>{
      return Template.instance().netProfitMarginPerc1.get() || 0;
  },
  returnOnInvestmentPerc1: () =>{
      return Template.instance().returnOnInvestmentPerc1.get() || 0;
  },
  grossProfitMarginPerc2: () =>{
    return Template.instance().grossProfitMarginPerc2.get() || 0;
  },
  netProfitMarginPerc2: () =>{
    return Template.instance().netProfitMarginPerc2.get() || 0;
  },
  returnOnInvestmentPerc2: () =>{
    return Template.instance().returnOnInvestmentPerc2.get() || 0;
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
