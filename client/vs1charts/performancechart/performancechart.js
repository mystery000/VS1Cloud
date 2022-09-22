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
      var dateFrom = new Date();
      var dateTo = new Date();
      dateFrom.setMonth(curDate.getMonth() - 2);
      var pDateFrom = dateFrom.getFullYear() + '-' + ("0" + (dateFrom.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateFrom.getDate())).slice(-2);
      dateTo.setMonth(curDate.getMonth());
      var pDateTo = dateTo.getFullYear() + '-' + ("0" + (dateTo.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateTo.getDate())).slice(-2);
      let periodMonths = `1 Month`;
      let data = await reportService.getProfitandLossCompare(
        pDateFrom,
        pDateTo,
        false,
        periodMonths
      );
      let records = [];
      if (data.tprofitandlossperiodcomparereport) {
        let accountData = data.tprofitandlossperiodcomparereport;
        let accountType = "";
        let arrAccountTypes = ["TotalIncome", "GrossProfit", "NetIncome", "TotalCOGS"];
        var dataList = "";
        for (let i = 0; i < accountData.length; i++) {
          let accountTypeDesc = accountData[i]["AccountTypeDesc"].replace(/\s/g, "");
          if (arrAccountTypes.includes(accountTypeDesc)) {
            accountType = accountTypeDesc;
            let compPeriod = 2;
            let periodAmounts = [];
            let totalAmount = 0;
            for (let counter = 1; counter <= compPeriod; counter++) {
              totalAmount += accountData[i]["Amount_" + counter];
              let AmountEx = utilityService.modifynegativeCurrencyFormat(accountData[i]["Amount_" + counter]) || 0.0;
              let RealAmount = accountData[i]["Amount_" + counter] || 0;
              periodAmounts.push({
                decimalAmt: AmountEx,
                roundAmt: RealAmount,
              });
            }
            let totalAmountEx = utilityService.modifynegativeCurrencyFormat(totalAmount) || 0.0;
            let totalRealAmount = totalAmount || 0;
            if (accountData[i]["AccountHeaderOrder"].replace(/\s/g, "") == "" && accountType != "") {
              dataList = {
                id: accountData[i]["AccountID"] || "",
                accounttype: accountType || "",
                accounttypeshort: accountData[i]["AccountType"] || "",
                accountname: accountData[i]["AccountName"] || "",
                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                accountno: accountData[i]["AccountNo"] || "",
                totalamountex: "",
                totalRealAmountex: "",
                periodAmounts: "",
                name: $.trim(accountData[i]["AccountName"])
                  .split(" ")
                  .join("_"),
              };
            } else {
              dataList = {
                id: accountData[i]["AccountID"] || "",
                accounttype: accountType || "",
                accounttypeshort: accountData[i]["AccountType"] || "",
                accountname: accountData[i]["AccountName"] || "",
                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                accountno: accountData[i]["AccountNo"] || "",
                totalamountex: totalAmountEx || 0.0,
                periodAmounts: periodAmounts,
                totalRealAmountex: totalRealAmount,
                name: $.trim(accountData[i]["AccountName"])
                  .split(" ")
                  .join("_"),
                // totaltax: totalTax || 0.00
              };
            }

            if (accountData[i]["AccountType"].replace(/\s/g, "") == "" && accountType == "") {
            } else {
              if (dataList.totalRealAmountex !== 0) {
                records.push(dataList);
              }
            }
          }
        }
        var i=0;
        for (i=0; i<2; i++) {
          totalSales.push(records[0].periodAmounts[i].roundAmt);
          grossProfit.push(records[1].periodAmounts[i].roundAmt);
          totalExpense.push(records[0].periodAmounts[i].roundAmt - records[1].periodAmounts[i].roundAmt);
          totalNetIncome.push(records[2].periodAmounts[i].roundAmt);
          totalCOGS.push(records[3].periodAmounts[i].roundAmt);
        }
        for (i=0; i<2; i++) {
          grossProfitMg[i] = totalSales[i] - totalCOGS[i];
          netProfitMg[i] = totalSales[i] - totalExpense[i];
        }      
        templateObject.records.set(records);
      }

      
      var dateTo1 = new Date(curDate.getFullYear(), curDate.getMonth() - 1, 0);
      var dateTo2 = new Date(curDate.getFullYear(), curDate.getMonth(), 0);
      var loadDate1 = moment(dateTo1).format("YYYY-MM-DD");
      var loadDate2 = moment(dateTo2).format("YYYY-MM-DD");
      var loadDates = [];
      loadDates.push(loadDate1);
      loadDates.push(loadDate2);

      let TotalCurrentAsset_Liability = 0;
      let AccountTree = "";
      let totalEq = 0;
      let investRet = 0;

      for (var k=0; k<2; k++) {
        let data = await reportService.getBalanceSheetReport(loadDates[k]);
        if (data.balancesheetreport) {
          for (let i = 0, len = data.balancesheetreport.length; i < len; i++) {
            TotalCurrentAsset_Liability = data.balancesheetreport[i]["Total Current Asset & Liability"];
            AccountTree = data.balancesheetreport[i]["Account Tree"];
            
            if (AccountTree.replace(/\s/g, "") == "TotalCapital/Equity") {
              totalEq = TotalCurrentAsset_Liability;
              break;
            }
          }
          if (totalEq != 0) {
            investRet = totalNetIncome[k] / totalEq;
          }
          investRet = investRet.toFixed(2);
          investReturns[k] = investRet;
        }
      }
      [grossProfitMarginPerc1, netProfitMarginPerc1, returnOnInvestmentPerc1] = templateObject.calculatePercent([grossProfitMg[0], netProfitMg[0], investReturns[0]]);
      [grossProfitMarginPerc2, netProfitMarginPerc2, returnOnInvestmentPerc2] = templateObject.calculatePercent([grossProfitMg[1], netProfitMg[1], investReturns[1]]);
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
      console.log(err);
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

