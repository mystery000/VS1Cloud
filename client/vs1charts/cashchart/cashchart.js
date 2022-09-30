import { ReportService } from "../../reports/report-service";
import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');

Template.cashchart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();

  templateObject.cashReceivedPerc1 = new ReactiveVar();
  templateObject.cashSpentPerc1 = new ReactiveVar();
  templateObject.cashSurplusPerc1 = new ReactiveVar();
  templateObject.bankBalancePerc1 = new ReactiveVar();
  templateObject.cashReceivedPerc2 = new ReactiveVar();
  templateObject.cashSpentPerc2 = new ReactiveVar();
  templateObject.cashSurplusPerc2 = new ReactiveVar();
  templateObject.bankBalancePerc2 = new ReactiveVar();
});

Template.cashchart.onRendered(()=>{
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

  let cashReceived = [0, 0];
  let cashSpent = [0, 0];
  let cashSurplus = [0, 0];
  let bankBalance = [0, 0];

  let cashReceivedPerc1 = 0;
  let cashSpentPerc1 = 0;
  let cashSurplusPerc1 = 0;
  let bankBalancePerc1 = 0;
  let cashReceivedPerc2 = 0;
  let cashSpentPerc2 = 0;
  let cashSurplusPerc2 = 0;
  let bankBalancePerc2 = 0;

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

  templateObject.getCashReports = async () => {
    try{
      var curDate = new Date();
      var dateAsOf = curDate.getFullYear() + '-' + ("0" + (curDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (curDate.getDate())).slice(-2);

      let data = await reportService.getCardDataReport(dateAsOf);
      if (data.tcarddatareport) {
        let resData = data.tcarddatareport[0];
        cashReceived[0] = resData.Cash_Received1;
        cashReceived[1] = resData.Cash_Received2;
        cashSpent[0] = resData.Cash_Spent1;
        cashSpent[1] = resData.Cash_Spent2;
        cashSurplus[0] = resData.Cash_Surplus1;
        cashSurplus[1] = resData.Cash_Surplus2;
        bankBalance[0] = resData.Cash_Balance1;
        bankBalance[1] = resData.Cash_Balance2;
      }

      let pArr = [];
      for (var i=0; i<2; i++) {
        pArr.push(cashReceived[i]);
        pArr.push(cashSpent[i]);
        pArr.push(cashSurplus[i]);
        pArr.push(bankBalance[i]);
      }
      let rArr = [];
      rArr = templateObject.calculatePercent(pArr);
      cashReceivedPerc1 = rArr[0];
      cashSpentPerc1 = rArr[1];
      cashSurplusPerc1 = rArr[2];
      bankBalancePerc1 = rArr[3];
      cashReceivedPerc2 = rArr[4];
      cashSpentPerc2 = rArr[5];
      cashSurplusPerc2 = rArr[6];
      bankBalancePerc2 = rArr[7];

      templateObject.cashReceivedPerc1.set(cashReceivedPerc1);
      templateObject.cashSpentPerc1.set(cashSpentPerc1);
      templateObject.cashSurplusPerc1.set(cashSurplusPerc1);
      templateObject.bankBalancePerc1.set(bankBalancePerc1);
      templateObject.cashReceivedPerc2.set(cashReceivedPerc2);
      templateObject.cashSpentPerc2.set(cashSpentPerc2);
      templateObject.cashSurplusPerc2.set(cashSurplusPerc2);
      templateObject.bankBalancePerc2.set(bankBalancePerc2);

      templateObject.setFieldValue(cashReceived[0], "spnCashReceived");
      templateObject.setFieldValue(cashSpent[0], "spnCashSpent");
      templateObject.setFieldValue(cashSurplus[0], "spnCashSurplus");
      templateObject.setFieldValue(bankBalance[0], "spnBankBalance");
      templateObject.setFieldValue(cashReceived[1], "spnCashReceived2");
      templateObject.setFieldValue(cashSpent[1], "spnCashSpent2");
      templateObject.setFieldValue(cashSurplus[1], "spnCashSurplus2");
      templateObject.setFieldValue(bankBalance[1], "spnBankBalance2");

      templateObject.setFieldVariance(cashReceived[0], cashReceived[1], "spnCashReceivedVariance", "divCashReceivedVariance");
      templateObject.setFieldVariance(cashSpent[0], cashSpent[1], "spnCashSpentVariance", "divCashSpentVariance");
      templateObject.setFieldVariance(cashSurplus[0], cashSurplus[1], "spnCashSurplusVariance", "divCashSurplusVariance");
      templateObject.setFieldVariance(bankBalance[0], bankBalance[1], "spnBankBalanceVariance", "divBankBalanceVariance");
    } catch (err) {

    }
  };
  templateObject.getCashReports();
});

Template.cashchart.events({
});

Template.cashchart.helpers({
  titleMonth1: () =>{
    return Template.instance().titleMonth1.get();
  },
  titleMonth2: () =>{
    return Template.instance().titleMonth2.get();
  },
  cashReceivedPerc1: () =>{
    return Template.instance().cashReceivedPerc1.get() || 0;
  },
  cashSpentPerc1: () =>{
    return Template.instance().cashSpentPerc1.get() || 0;
  },
  cashSurplusPerc1: () =>{
    return Template.instance().cashSurplusPerc1.get() || 0;
  },
  bankBalancePerc1: () =>{
    return Template.instance().bankBalancePerc1.get() || 0;
  },
  cashReceivedPerc2: () =>{
    return Template.instance().cashReceivedPerc2.get() || 0;
  },
  cashSpentPerc2: () =>{
    return Template.instance().cashSpentPerc2.get() || 0;
  },
  cashSurplusPerc2: () =>{
    return Template.instance().cashSurplusPerc2.get() || 0;
  },
  bankBalancePerc2: () =>{
    return Template.instance().bankBalancePerc2.get() || 0;
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
