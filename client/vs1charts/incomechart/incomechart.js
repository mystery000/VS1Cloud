import { ReportService } from "../../reports/report-service";
import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');

Template.incomechart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();

  templateObject.totalInvoiceCountPerc1 = new ReactiveVar();
  templateObject.totalInvoiceValuePerc1 = new ReactiveVar();
  templateObject.averageInvoiceValuePerc1 = new ReactiveVar();
  templateObject.totalInvoiceCountPerc2 = new ReactiveVar();
  templateObject.totalInvoiceValuePerc2 = new ReactiveVar();
  templateObject.averageInvoiceValuePerc2 = new ReactiveVar();
  
});

Template.incomechart.onRendered(()=>{
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

  let totalInvoiceCount = [0, 0];
  let totalInvoiceValue = [0, 0];
  let averageInvoiceValue = [0, 0];
  let totalInvoiceCountPerc1 = 0;
  let totalInvoiceValuePerc1 = 0;
  let averageInvoiceValuePerc1 = 0;
  let totalInvoiceCountPerc2 = 0;
  let totalInvoiceValuePerc2 = 0;
  let averageInvoiceValuePerc2 = 0;

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
      if (fieldSelector == "spnTotalInvoiceCount" || fieldSelector == "spnTotalInvoiceCount2")
        $('.' + fieldSelector).html(fieldVal);
      else
        $('.' + fieldSelector).html(utilityService.modifynegativeCurrencyFormat(fieldVal));
    } else {
      if (fieldSelector == "spnTotalInvoiceCount" || fieldSelector == "spnTotalInvoiceCount2")
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

  templateObject.getIncomeReports = async () => {
    try{
      var curDate = new Date();
      var dateAsOf = curDate.getFullYear() + '-' + ("0" + (curDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (curDate.getDate())).slice(-2);
      
      let data = await reportService.getCardDataReport(dateAsOf);
      if (data.tcarddatareport) {
        let resData = data.tcarddatareport[0];
        totalInvoiceCount[0] = resData.Income_Invoices1;
        totalInvoiceCount[1] = resData.Income_Invoices2;
        totalInvoiceValue[0] = resData.Income_Total1;
        totalInvoiceValue[1] = resData.Income_Total2;
        averageInvoiceValue[0] = resData.Income_Average1;
        averageInvoiceValue[1] = resData.Income_Average2;
      }

      let pArr = [];
      for (var i=0; i<2; i++) {
        pArr.push(totalInvoiceCount[i]);
        pArr.push(totalInvoiceValue[i]);
        pArr.push(averageInvoiceValue[i]);
      }
      let rArr = [];
      rArr = templateObject.calculatePercent(pArr);
      totalInvoiceCountPerc1 = rArr[0];
      totalInvoiceValuePerc1 = rArr[1];
      averageInvoiceValuePerc1 = rArr[2];
      totalInvoiceCountPerc2 = rArr[3];
      totalInvoiceValuePerc2 = rArr[4];
      averageInvoiceValuePerc2 = rArr[5];

      templateObject.totalInvoiceCountPerc1.set(totalInvoiceCountPerc1);
      templateObject.averageInvoiceValuePerc1.set(averageInvoiceValuePerc1);
      templateObject.totalInvoiceValuePerc1.set(totalInvoiceValuePerc1);
      templateObject.totalInvoiceCountPerc2.set(totalInvoiceCountPerc2);
      templateObject.averageInvoiceValuePerc2.set(averageInvoiceValuePerc2);
      templateObject.totalInvoiceValuePerc2.set(totalInvoiceValuePerc2);

      templateObject.setFieldValue(totalInvoiceCount[0], "spnTotalInvoiceCount");
      templateObject.setFieldValue(averageInvoiceValue[0], "spnAverageInvoiceValue");
      templateObject.setFieldValue(totalInvoiceValue[0], "spnTotalInvoiceValue");
      templateObject.setFieldValue(totalInvoiceCount[1], "spnTotalInvoiceCount2");
      templateObject.setFieldValue(averageInvoiceValue[1], "spnAverageInvoiceValue2");
      templateObject.setFieldValue(totalInvoiceValue[1], "spnTotalInvoiceValue2");

      templateObject.setFieldVariance(totalInvoiceCount[0], totalInvoiceCount[1], "spnTotalInvoiceCountVariance", "divTotalInvoiceCountVariance");
      templateObject.setFieldVariance(averageInvoiceValue[0], averageInvoiceValue[1], "spnAverageInvoiceValueVariance", "divAverageInvoiceValueVariance");
      templateObject.setFieldVariance(totalInvoiceValue[0], totalInvoiceValue[1], "spnTotalInvoiceValueVariance", "divTotalInvoiceValueVariance");
    } catch (err) {
      console.log(err);
    }  
  };

  templateObject.getIncomeReports();

  // let outstandingInvAmt = localStorage.getItem('VS1OutstandingInvoiceAmt_dash') || 0;
  // let outstandingInvQty = localStorage.getItem('VS1OutstandingInvoiceQty_dash') || 0;
  // let overdueInvAmt = localStorage.getItem('VS1OverDueInvoiceAmt_dash') || 0;
  // let overdueInvQty = localStorage.getItem('VS1OverDueInvoiceQty_dash') || 0;

  // let totalInvQty = Number(outstandingInvQty) + Number(overdueInvQty);
  // let totalInvAmt = Number(outstandingInvAmt) + Number(overdueInvAmt);
  // let reportsDateFrom = localStorage.getItem('VS1ReportsDateFrom_dash') || "";
  // let reportsDateTo = localStorage.getItem('VS1ReportsDateTo_dash') || "";
  // let prd = 0;
  // if (reportsDateFrom == "" || reportsDateTo == "") {
  //   prd = 6;
  // } else {
  //   let monthFrom = reportsDateFrom.substring(5, 6);
  //   let monthTo = reportsDateTo.substring(5, 6);
  //   prd = Number(monthTo) - Number(monthFrom);
  // }
  // let averageInvAmt = totalInvAmt / prd;

  // templateObject.totalInvoiceCount.set(totalInvQty);
  // templateObject.averageInvoiceValue.set(averageInvAmt);
  // templateObject.totalInvoiceValue.set(totalInvAmt);

  // $('.spnTotalInvoiceCount').html(totalInvQty);
  // $('.spnAverageInvoiceValue').html(utilityService.modifynegativeCurrencyFormat(averageInvAmt));
  // $('.spnTotalInvoiceValue').html(utilityService.modifynegativeCurrencyFormat(totalInvAmt));
});

Template.incomechart.events({
});

Template.incomechart.helpers({
  dateAsAt: () =>{
      return Template.instance().dateAsAt.get() || '-';
  },
  titleMonth1: () =>{
      return Template.instance().titleMonth1.get();
  },
  titleMonth2: () =>{
      return Template.instance().titleMonth2.get();
  },
  totalInvoiceCountPerc1: () =>{
      return Template.instance().totalInvoiceCountPerc1.get() || 0;
  },
  averageInvoiceValuePerc1: () =>{
      return Template.instance().averageInvoiceValuePerc1.get() || 0;
  },
  totalInvoiceValuePerc1: () =>{
      return Template.instance().totalInvoiceValuePerc1.get() || 0;
  },
  totalInvoiceCountPerc2: () =>{
      return Template.instance().totalInvoiceCountPerc2.get() || 0;
  },
  averageInvoiceValuePerc2: () =>{
      return Template.instance().averageInvoiceValuePerc2.get() || 0;
  },
  totalInvoiceValuePerc2: () =>{
      return Template.instance().totalInvoiceValuePerc2.get() || 0;
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