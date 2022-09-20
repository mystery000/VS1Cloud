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

  let totalSales = [];
  let grossProfit = [];
  let totalExpense = [];
  let nettProfit = [];
  
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

  templateObject.calculatePercent = function(ptotalSales, pgrossProfit, ptotalExpense, pnettProfit) {
    var maxValue = Math.max(Math.abs(ptotalSales), Math.abs(pgrossProfit), Math.abs(ptotalExpense), Math.abs(pnettProfit));
    var rtotalSalesPerc = 0;
    var rgrossProfitPerc = 0;
    var rtotalExpensePerc = 0;
    var rnettProfitPerc = 0;
    if (maxValue > 0) {
      rtotalSalesPerc = Math.round(Math.abs(ptotalSales) / maxValue * 100);
      if (rtotalSalesPerc < 40)
        rtotalSalesPerc = 40;
      rgrossProfitPerc = Math.round(Math.abs(pgrossProfit) / maxValue * 100);
      if (rgrossProfitPerc < 40)
        rgrossProfitPerc = 40;
      rtotalExpensePerc = Math.round(Math.abs(ptotalExpense) / maxValue * 100);
      if (rtotalExpensePerc < 40)
        rtotalExpensePerc = 40;
      rnettProfitPerc = Math.round(Math.abs(pnettProfit) / maxValue * 100);
      if (rnettProfitPerc < 40)
        rnettProfitPerc = 40;
    }
    return [rtotalSalesPerc, rgrossProfitPerc, rtotalExpensePerc, rnettProfitPerc];
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
      var dateFrom = new Date();
      var dateTo = new Date();
      dateFrom.setMonth(currentDate.getMonth() - 2);
      var pDateFrom = dateFrom.getFullYear() + '-' + ("0" + (dateFrom.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateFrom.getDate())).slice(-2);
      dateTo.setMonth(currentDate.getMonth());
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
        let arrAccountTypes = ["TotalIncome", "GrossProfit", "NetIncome"];
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
        for (var i = 0; i < 2; i++) {
          totalSales.push(records[0].periodAmounts[i].roundAmt);
          grossProfit.push(records[1].periodAmounts[i].roundAmt);
          totalExpense.push(records[0].periodAmounts[i].roundAmt - records[1].periodAmounts[i].roundAmt);
          nettProfit.push(records[2].periodAmounts[i].roundAmt);
        }
        [totalSalesPerc1, grossProfitPerc1, totalExpensePerc1, nettProfitPerc1] = templateObject.calculatePercent(totalSales[0], grossProfit[0], totalExpense[0], nettProfit[0]);
        [totalSalesPerc2, grossProfitPerc2, totalExpensePerc2, nettProfitPerc2] = templateObject.calculatePercent(totalSales[1], grossProfit[1], totalExpense[1], nettProfit[1]);
        templateObject.records.set(records);
      }
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
      console.log(err);
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

