import { ReportService } from "../../reports/report-service";
import { VS1ChartService } from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import { UtilityService } from "../../utility-service";
let _ = require('lodash');

Template.profitabilitychart.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.totalSalesPerc1 = new ReactiveVar();
  templateObject.grossProfitPerc1 = new ReactiveVar();
  templateObject.totalExpensePerc1 = new ReactiveVar();
  templateObject.nettProfitPerc1 = new ReactiveVar();
  templateObject.totalSalesPerc2 = new ReactiveVar();
  templateObject.grossProfitPerc2 = new ReactiveVar();
  templateObject.totalExpensePerc2 = new ReactiveVar();
  templateObject.nettProfitPerc2 = new ReactiveVar();
  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();
});

Template.profitabilitychart.onRendered(() => {
  const templateObject = Template.instance();
  let utilityService = new UtilityService();
  let reportService = new ReportService();

  var currentDate = new Date();
  const monSml = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

  let totalSales = [0, 0];
  let grossProfit = [0, 0];
  let totalExpense = [0, 0];
  let nettProfit = [0, 0];

  let totalSalesPerc1 = 0;
  let grossProfitPerc1 = 0;
  let totalExpensePerc1 = 0;
  let nettProfitPerc1 = 0;
  let totalSalesPerc2 = 0;
  let grossProfitPerc2 = 0;
  let totalExpensePerc2 = 0;
  let nettProfitPerc2 = 0;

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
        if (fieldSelector == "spnTotalExpenseVariance")
          $('.' + parentSelector).css("backgroundColor", varianceRed);
        else
          $('.' + parentSelector).css("backgroundColor", varianceGreen);
      } else if (fieldVal2 == 0) {
        fieldVariance = 0;
        $('.' + parentSelector).css("backgroundColor", varianceGreen);
      } else {
        fieldVariance = -100;
        if (fieldSelector == "spnTotalExpenseVariance")
          $('.' + parentSelector).css("backgroundColor", varianceGreen);
        else
          $('.' + parentSelector).css("backgroundColor", varianceRed);
      }
    } else {
      if (fieldVal1 > 0)
      fieldVariance = (fieldVal2 - fieldVal1) / fieldVal1 * 100;
      else
        fieldVariance = (fieldVal2 - fieldVal1) / Math.abs(fieldVal1) * 100;
      if (fieldVariance >= 0)
        if (fieldSelector == "spnTotalExpenseVariance")
          $('.' + parentSelector).css("backgroundColor", varianceRed);
        else
          $('.' + parentSelector).css("backgroundColor", varianceGreen);
      else
        if (fieldSelector == "spnTotalExpenseVariance")
          $('.' + parentSelector).css("backgroundColor", varianceGreen);
        else
          $('.' + parentSelector).css("backgroundColor", varianceRed);
    }
    $('.' + fieldSelector).html(fieldVariance.toFixed(1));
  }

  templateObject.getValuesForProfitability = async function () {
    try {
      var curDate = new Date();
      var dateAsOf = curDate.getFullYear() + '-' + ("0" + (curDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (curDate.getDate())).slice(-2);

      let data = await reportService.getCardDataReport(dateAsOf);
      if (data.tcarddatareport) {
        let resData = data.tcarddatareport[0];
        totalSales[0] = resData.Prof_Income1;
        totalSales[1] = resData.Prof_Income2;
        grossProfit[0] = resData.Prof_Gross1;
        grossProfit[1] = resData.Prof_Gross2;
        totalExpense[0] = resData.Prof_Expenses1;
        totalExpense[1] = resData.Prof_Expenses2;
        nettProfit[0] = resData.Prof_Net1;
        nettProfit[1] = resData.Prof_Net2;
      }

      let pArr = [];
      for (var i=0; i<2; i++) {
        pArr.push(totalSales[i]);
        pArr.push(grossProfit[i]);
        pArr.push(totalExpense[i]);
        pArr.push(nettProfit[i]);
      }
      let rArr = [];
      rArr = templateObject.calculatePercent(pArr);
      totalSalesPerc1 = rArr[0];
      grossProfitPerc1 = rArr[1];
      totalExpensePerc1 = rArr[2];
      nettProfitPerc1 = rArr[3];
      totalSalesPerc2 = rArr[4];
      grossProfitPerc2 = rArr[5];
      totalExpensePerc2 = rArr[6];
      nettProfitPerc2 = rArr[7];

      templateObject.totalSalesPerc1.set(totalSalesPerc1);
      templateObject.grossProfitPerc1.set(grossProfitPerc1);
      templateObject.totalExpensePerc1.set(totalExpensePerc1);
      templateObject.nettProfitPerc1.set(nettProfitPerc1);
      templateObject.totalSalesPerc2.set(totalSalesPerc2);
      templateObject.grossProfitPerc2.set(grossProfitPerc2);
      templateObject.totalExpensePerc2.set(totalExpensePerc2);
      templateObject.nettProfitPerc2.set(nettProfitPerc2);

      templateObject.setFieldValue(totalSales[0], "spnTotalSales");
      templateObject.setFieldValue(grossProfit[0], "spnGrossProfit");
      templateObject.setFieldValue(totalExpense[0], "spnTotalExpense");
      templateObject.setFieldValue(nettProfit[0], "spnTotalnetincome");
      templateObject.setFieldValue(totalSales[1], "spnTotalSales2");
      templateObject.setFieldValue(grossProfit[1], "spnGrossProfit2");
      templateObject.setFieldValue(totalExpense[1], "spnTotalExpense2");
      templateObject.setFieldValue(nettProfit[1], "spnTotalnetincome2");

      templateObject.setFieldVariance(totalSales[0], totalSales[1], "spnTotalSalesVariance", "divTotalSalesVariance");
      templateObject.setFieldVariance(grossProfit[0], grossProfit[1], "spnGrossProfitVariance", "divGrossProfitVariance");
      templateObject.setFieldVariance(totalExpense[0], totalExpense[1], "spnTotalExpenseVariance", "divTotalExpenseVariance");
      templateObject.setFieldVariance(nettProfit[0], nettProfit[1], "spnNettProfitVariance", "divNettProfitVariance");
    } catch (err) {

    }
  }
  templateObject.getValuesForProfitability();
});

Template.profitabilitychart.events({

});

Template.profitabilitychart.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || '-';
  },
  titleMonth1: () => {
    return Template.instance().titleMonth1.get();
  },
  titleMonth2: () => {
    return Template.instance().titleMonth2.get();
  },
  totalSalesPerc1: () => {
    return Template.instance().totalSalesPerc1.get() || 0;
  },
  grossProfitPerc1: () => {
    return Template.instance().grossProfitPerc1.get() || 0;
  },
  totalExpensePerc1: () => {
    return Template.instance().totalExpensePerc1.get() || 0;
  },
  nettProfitPerc1: () => {
    return Template.instance().nettProfitPerc1.get() || 0;
  },
  totalSalesPerc2: () => {
    return Template.instance().totalSalesPerc2.get() || 0;
  },
  grossProfitPerc2: () => {
    return Template.instance().grossProfitPerc2.get() || 0;
  },
  totalExpensePerc2: () => {
    return Template.instance().totalExpensePerc2.get() || 0;
  },
  nettProfitPerc2: () => {
    return Template.instance().nettProfitPerc2.get() || 0;
  }
});
Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.registerHelper('notEquals', function (a, b) {
  return a != b;
});

Template.registerHelper('containsequals', function (a, b) {
  return (a.indexOf(b) >= 0);
});
