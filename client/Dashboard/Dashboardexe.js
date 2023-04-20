import { ReactiveVar } from "meteor/reactive-var";
import { ReportService } from "../reports/report-service";
import { UtilityService } from "../utility-service";
import LoadingOverlay from "../LoadingOverlay";
import DashboardApi from "../js/Api/DashboardApi";
import resizableCharts from "../js/Charts/resizableCharts";
import ChartsEditor from "../js/Charts/ChartsEditor";
import ChartHandler from "../js/Charts/ChartHandler";
import draggableCharts from "../js/Charts/draggableCharts";
import Tvs1ChartDashboardPreference from "../js/Api/Model/Tvs1ChartDashboardPreference";
import Tvs1ChartDashboardPreferenceField from "../js/Api/Model/Tvs1ChartDashboardPreferenceField";
import ApiService from "../js/Api/Module/ApiService";
import '../lib/global/indexdbstorage.js';
import 'jQuery.print/jQuery.print.js';
import "gauge-chart";

import { Template } from 'meteor/templating';
import './dashboardexe.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Tvs1chart from "../js/Api/Model/Tvs1Chart";
import { ChartService } from "../vs1charts/chart-service";
import { CardService } from "../vs1charts/card-service";

let _ = require("lodash");

let arrChartKey = ["dashboardexe__cash", "dashboardexe__profitability", "dashboardexe__performance", "dashboardexe__balance_sheet", "dashboardexe__income", "dashboardexe__position"];
let arrChartActive = [1, 1, 1, 1, 1, 1];
let curChartActive = [];
localStorage.setItem("arrChartActive", JSON.stringify(arrChartActive));

let chartService = new ChartService
let cardService = new CardService


Template.dashboardexe.onCreated(function() {
    this.loggedDb = new ReactiveVar("");
    const templateObject = Template.instance();
    templateObject.includeDashboard = new ReactiveVar();
    templateObject.includeDashboard.set(false);

    templateObject.titleDE = new ReactiveVar();
    templateObject.titleMonth1 = new ReactiveVar();
    templateObject.titleMonth2 = new ReactiveVar();
    // Cash Panel
    templateObject.cashReceivedPerc1 = new ReactiveVar();
    templateObject.cashSpentPerc1 = new ReactiveVar();
    templateObject.cashSurplusPerc1 = new ReactiveVar();
    templateObject.bankBalancePerc1 = new ReactiveVar();
    templateObject.cashReceivedPerc2 = new ReactiveVar();
    templateObject.cashSpentPerc2 = new ReactiveVar();
    templateObject.cashSurplusPerc2 = new ReactiveVar();
    templateObject.bankBalancePerc2 = new ReactiveVar();
    // Profitability Panel
    templateObject.totalSalesPerc1 = new ReactiveVar();
    templateObject.grossProfitPerc1 = new ReactiveVar();
    templateObject.totalExpensePerc1 = new ReactiveVar();
    templateObject.nettProfitPerc1 = new ReactiveVar();
    templateObject.totalSalesPerc2 = new ReactiveVar();
    templateObject.grossProfitPerc2 = new ReactiveVar();
    templateObject.totalExpensePerc2 = new ReactiveVar();
    templateObject.nettProfitPerc2 = new ReactiveVar();
    // Performance Panel
    templateObject.grossProfitMarginPerc1 = new ReactiveVar();
    templateObject.netProfitMarginPerc1 = new ReactiveVar();
    templateObject.returnOnInvestmentPerc1 = new ReactiveVar();
    templateObject.grossProfitMarginPerc2 = new ReactiveVar();
    templateObject.netProfitMarginPerc2 = new ReactiveVar();
    templateObject.returnOnInvestmentPerc2 = new ReactiveVar();
    // Balance Sheet Panel
    templateObject.totalAgedReceivablesPerc1 = new ReactiveVar();
    templateObject.totalAgedPayablesPerc1 = new ReactiveVar();
    templateObject.totalNettAssetsPerc1 = new ReactiveVar();
    templateObject.totalAgedReceivablesPerc2 = new ReactiveVar();
    templateObject.totalAgedPayablesPerc2 = new ReactiveVar();
    templateObject.totalNettAssetsPerc2 = new ReactiveVar();
    // Income Panel
    templateObject.totalInvoiceCountPerc1 = new ReactiveVar();
    templateObject.totalInvoiceValuePerc1 = new ReactiveVar();
    templateObject.averageInvoiceValuePerc1 = new ReactiveVar();
    templateObject.totalInvoiceCountPerc2 = new ReactiveVar();
    templateObject.totalInvoiceValuePerc2 = new ReactiveVar();
    templateObject.averageInvoiceValuePerc2 = new ReactiveVar();
    // Position Panel
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
});

Template.dashboardexe.onRendered(function() {
    const templateObject = Template.instance();
    // fix
    let isDashboard = localStorage.getItem("CloudDashboardModule");
    if (isDashboard) {
        templateObject.includeDashboard.set(true);
    }

    //-fix 12.22
    let _tabGroup = $("#connectedSortable").data("tabgroup");
    let _chartGroup = $("#connectedSortable").data("chartgroup");
    // if (_chartGroup == undefined)
    //   _chartGroup = "DashboardExe";

    let reportService = new ReportService();
    let utilityService = new UtilityService();
    // let currentDate = new Date();

    let varianceRed = "#ff420e";
    let varianceGreen = "#1cc88a"; //#579d1c
    let panelLeftYellow = "#f7c544"; //#1cc88a
    let panelRightBlue = "#00a3d3";
    let minPerc = 0;

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

    let grossProfitMargin = [0, 0];
    let netProfitMargin = [0, 0];
    let returnOnInvestment = [0, 0];
    let grossProfitMarginPerc1 = 0;
    let netProfitMarginPerc1 = 0;
    let returnOnInvestmentPerc1 = 0;
    let grossProfitMarginPerc2 = 0;
    let netProfitMarginPerc2 = 0;
    let returnOnInvestmentPerc2 = 0;

    let totalAgedReceivables = [0, 0];
    let totalAgedPayables = [0, 0];
    let totalNettAssets = [0, 0];
    let totalAgedReceivablesPerc1 = 0;
    let totalAgedPayablesPerc1 = 0;
    let totalNettAssetsPerc1 = 0;
    let totalAgedReceivablesPerc2 = 0;
    let totalAgedPayablesPerc2 = 0;
    let totalNettAssetsPerc2 = 0;

    let totalInvoiceCount = [0, 0];
    let totalInvoiceValue = [0, 0];
    let averageInvoiceValue = [0, 0];
    let totalInvoiceCountPerc1 = 0;
    let totalInvoiceValuePerc1 = 0;
    let averageInvoiceValuePerc1 = 0;
    let totalInvoiceCountPerc2 = 0;
    let totalInvoiceValuePerc2 = 0;
    let averageInvoiceValuePerc2 = 0;

    let avgDebtors = [0, 0];
    let avgCreditors = [0, 0];
    let shortTermCash = [0, 0];
    let currentAsset = [0, 0];
    let termAsset = [0, 0];
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

    templateObject.setTitleDE = () => {
        templateObject.titleDE.set(moment($("#dateTo").val(), "DD/MM/YYYY").format("MMMM YYYY"));
    }

    templateObject.setMonthsOnHeader = () => {
        templateObject.titleMonth1.set(moment($("#dateFrom").val(), "DD/MM/YYYY").format("MMM YYYY"));
        templateObject.titleMonth2.set(moment($("#dateTo").val(), "DD/MM/YYYY").format("MMM YYYY"));
    }

    templateObject.deactivateDraggable = () => {
        draggableCharts.disable();
        resizableCharts.disable(); // this will disable charts resiable features
    };

    templateObject.activateDraggable = () => {
        draggableCharts.enable();
        resizableCharts.enable(); // this will enable charts resiable features
    };

    templateObject.calculatePercent = function(pArrVal) {
        var rArrVal = [];
        var rArrAbs = [];
        var i = 0;
        for (i = 0; i < pArrVal.length; i++) {
            rArrVal.push(minPerc);
        }
        for (i = 0; i < pArrVal.length; i++) {
            rArrAbs.push(Math.abs(pArrVal[i]));
        }
        var maxValue = Math.max(...rArrAbs);
        if (maxValue > 0) {
            for (i = 0; i < pArrVal.length; i++) {
                rArrVal[i] = rArrAbs[i] / maxValue * 100;
            }
        }
        return rArrVal;
    }

    templateObject.setFieldValue = function(fieldVal, fieldSelector, fieldSide) {
        if (fieldVal >= 0) {
            $('.' + fieldSelector).html(utilityService.modifynegativeCurrencyFormat(fieldVal));
            if (fieldSelector == "spnReturnInvest" || fieldSelector == "spnReturnInvest2" || fieldSelector == "spnTotalInvoiceCount" || fieldSelector == "spnTotalInvoiceCount2" || fieldSelector == "spnAverageDebtors" || fieldSelector == "spnAverageDebtors2" || fieldSelector == "spnAverageCreditors" || fieldSelector == "spnAverageCreditors2")
                $('.' + fieldSelector).html(fieldVal);
            else
                $('.' + fieldSelector).html(utilityService.modifynegativeCurrencyFormat(fieldVal));
            if (fieldSide == "left") {
                $('.panelLeftSpan1.' + fieldSelector).css('color', panelLeftYellow);
                $('.panelLeftSpan2.' + fieldSelector).css('color', 'white');
            }
            if (fieldSide == "right") {
                $('.panelRightSpan1.' + fieldSelector).css('color', panelRightBlue);
                $('.panelRightSpan2.' + fieldSelector).css('color', 'white');
            }
        } else {
            $('.' + fieldSelector).html('{' + utilityService.modifynegativeCurrencyFormat(Math.abs(fieldVal)) + '}');
            if (fieldSelector == "spnReturnInvest" || fieldSelector == "spnReturnInvest2" || fieldSelector == "spnTotalInvoiceCount" || fieldSelector == "spnTotalInvoiceCount2" || fieldSelector == "spnAverageDebtors" || fieldSelector == "spnAverageDebtors2" || fieldSelector == "spnAverageCreditors" || fieldSelector == "spnAverageCreditors2")
                $('.' + fieldSelector).html(Math.abs(fieldVal));
            else
                $('.' + fieldSelector).html('{' + utilityService.modifynegativeCurrencyFormat(Math.abs(fieldVal)) + '}');
            $('.' + fieldSelector).css('color', 'red');
        }
    }

    templateObject.setFieldVariance = function(fieldVal1, fieldVal2, fieldSelector, parentSelector) {
        var fieldVariance = 0;
        if (fieldVal1 == 0 && fieldVal2 == 0) {
            fieldVariance = 0;
        } else if (fieldVal1 == 0) {
            fieldVariance = fieldVal2;
        } else if (fieldVal2 == 0) {
            fieldVariance = (-1) * fieldVal1;
        } else {
            // if (fieldVal2 >= fieldVal1) {
            //   fieldVariance = (fieldVal2 / fieldVal1) * 100;
            // } else {
            //   fieldVariance = (fieldVal1 / fieldVal2) * (-100);
            // }
            if (fieldVal1 > 0 && fieldVal2 > 0) {
                fieldVariance = (fieldVal2 / fieldVal1) * 100;
            }
            if (fieldVal1 > 0 && fieldVal2 < 0) {
                fieldVariance = (Math.abs(fieldVal2) / fieldVal1) * 100;
            }
            if (fieldVal1 < 0 && fieldVal2 > 0) {
                fieldVariance = (Math.abs(fieldVal1) / fieldVal2) * 100;
            }
            if (fieldVal1 < 0 && fieldVal2 < 0) {
                fieldVariance = (fieldVal2 / fieldVal1) * 100;
            }
        }
        if (fieldVariance == 0) {
            $('.' + parentSelector).css("backgroundColor", varianceGreen);
        } else if (fieldVariance > 0) {
            $('.' + parentSelector).css("backgroundColor", varianceGreen);
            // if (fieldSelector == "spnCashSpentVariance" || fieldSelector == "spnTotalExpenseVariance" || fieldSelector == "spnTotalAgedPayablesVariance")
            //   $('.' + parentSelector).css("backgroundColor", varianceRed);
            // else
            //   $('.' + parentSelector).css("backgroundColor", varianceGreen);
        } else {
            $('.' + parentSelector).css("backgroundColor", varianceRed);
            // if (fieldSelector == "spnCashSpentVariance" || fieldSelector == "spnTotalExpenseVariance" || fieldSelector == "spnTotalAgedPayablesVariance")
            //   $('.' + parentSelector).css("backgroundColor", varianceGreen);
            // else
            //   $('.' + parentSelector).css("backgroundColor", varianceRed);
        }
        // if (fieldSelector == "spnCashSpentVariance" || fieldSelector == "spnTotalExpenseVariance" || fieldSelector == "spnTotalAgedPayablesVariance") {
        //   fieldVariance = (-1) * fieldVariance;
        // }
        $('.' + fieldSelector).html(fieldVariance.toFixed(2));
    }

    templateObject.getDashboardExecutiveData = async(dateAsOf, dateChanged) => {
        //LoadingOverlay.show();
        try {
            let data = await reportService.getCardDataReport(dateAsOf);
            if (data.tdashboardexecdata1) {
                let resData = data.tdashboardexecdata1[0];

                cashReceived[0] = parseFloat(resData.Cash_Received1);
                cashReceived[1] = parseFloat(resData.Cash_Received2);
                cashSpent[0] = parseFloat(resData.Cash_Spent1);
                cashSpent[1] = parseFloat(resData.Cash_Spent2);
                cashSurplus[0] = parseFloat(resData.Cash_Surplus1);
                cashSurplus[1] = parseFloat(resData.Cash_Surplus2);
                bankBalance[0] = parseFloat(resData.Cash_Balance1);
                bankBalance[1] = parseFloat(resData.Cash_Balance2);

                totalSales[0] = parseFloat(resData.Prof_Income1);
                totalSales[1] = parseFloat(resData.Prof_Income2);
                grossProfit[0] = parseFloat(resData.Prof_Gross1);
                grossProfit[1] = parseFloat(resData.Prof_Gross2);
                totalExpense[0] = parseFloat(resData.Prof_Expenses1);
                totalExpense[1] = parseFloat(resData.Prof_Expenses2);
                nettProfit[0] = parseFloat(resData.Prof_Net1);
                nettProfit[1] = parseFloat(resData.Prof_Net2);

                grossProfitMargin[0] = parseFloat(resData.Perf_GrossMargin1);
                grossProfitMargin[1] = parseFloat(resData.Perf_GrossMargin2);
                netProfitMargin[0] = parseFloat(resData.Perf_NetMargin1);
                netProfitMargin[1] = parseFloat(resData.Perf_NetMargin2);
                returnOnInvestment[0] = parseFloat(resData.Perf_ROI1);
                returnOnInvestment[1] = parseFloat(resData.Perf_ROI2);

                totalAgedReceivables[0] = parseFloat(resData.Bal_Debtors1);
                totalAgedReceivables[1] = parseFloat(resData.Bal_Debtors2);
                totalAgedPayables[0] = parseFloat(resData.Bal_Creditors1);
                totalAgedPayables[1] = parseFloat(resData.Bal_Creditors2);
                totalNettAssets[0] = parseFloat(resData.Bal_NetAsset1);
                totalNettAssets[1] = parseFloat(resData.Bal_NetAsset2);

                totalInvoiceCount[0] = parseInt(resData.Income_Invoices1);
                totalInvoiceCount[1] = parseInt(resData.Income_Invoices2);
                totalInvoiceValue[0] = parseFloat(resData.Income_Total1);
                totalInvoiceValue[1] = parseFloat(resData.Income_Total2);
                averageInvoiceValue[0] = parseFloat(resData.Income_Average1);
                averageInvoiceValue[1] = parseFloat(resData.Income_Average2);

                avgDebtors[0] = parseInt(resData.Pos_AvgDebtDays1);
                avgDebtors[1] = parseInt(resData.Pos_AvgDebtDays2);
                avgCreditors[0] = parseInt(resData.Pos_AvgCredDays1);
                avgCreditors[1] = parseInt(resData.Pos_AvgCredDays2);
                shortTermCash[0] = parseFloat(resData.Pos_CashForecast1);
                shortTermCash[1] = parseFloat(resData.Pos_CashForecast2);
                currentAsset[0] = parseFloat(resData.Pos_AssetToLiab1);
                currentAsset[1] = parseFloat(resData.Pos_AssetToLiab2);
                termAsset[0] = parseFloat(resData.Sheet_AssetToLiab1);
                termAsset[1] = parseFloat(resData.Sheet_AssetToLiab2);
            }

            let pArr = [];
            let rArr = [];
            let i = 0;

            for (i = 0; i < 2; i++) {
                pArr.push(cashReceived[i]);
                pArr.push(cashSpent[i]);
                pArr.push(cashSurplus[i]);
                pArr.push(bankBalance[i]);
            }
            rArr = templateObject.calculatePercent(pArr);
            cashReceivedPerc1 = rArr[0];
            cashSpentPerc1 = rArr[1];
            cashSurplusPerc1 = rArr[2];
            bankBalancePerc1 = rArr[3];
            cashReceivedPerc2 = rArr[4];
            cashSpentPerc2 = rArr[5];
            cashSurplusPerc2 = rArr[6];
            bankBalancePerc2 = rArr[7];

            pArr = [];
            for (i = 0; i < 2; i++) {
                pArr.push(totalSales[i]);
                pArr.push(grossProfit[i]);
                pArr.push(totalExpense[i]);
                pArr.push(nettProfit[i]);
            }
            rArr = templateObject.calculatePercent(pArr);
            totalSalesPerc1 = rArr[0];
            grossProfitPerc1 = rArr[1];
            totalExpensePerc1 = rArr[2];
            nettProfitPerc1 = rArr[3];
            totalSalesPerc2 = rArr[4];
            grossProfitPerc2 = rArr[5];
            totalExpensePerc2 = rArr[6];
            nettProfitPerc2 = rArr[7];

            pArr = [];
            for (i = 0; i < 2; i++) {
                pArr.push(grossProfitMargin[i]);
                pArr.push(netProfitMargin[i]);
                pArr.push(returnOnInvestment[i]);
            }
            rArr = templateObject.calculatePercent(pArr);
            grossProfitMarginPerc1 = rArr[0];
            netProfitMarginPerc1 = rArr[1];
            returnOnInvestmentPerc1 = rArr[2];
            grossProfitMarginPerc2 = rArr[3];
            netProfitMarginPerc2 = rArr[4];
            returnOnInvestmentPerc2 = rArr[5];

            pArr = [];
            for (i = 0; i < 2; i++) {
                pArr.push(totalAgedReceivables[i]);
                pArr.push(totalAgedPayables[i]);
                pArr.push(totalNettAssets[i]);
            }
            rArr = templateObject.calculatePercent(pArr);
            totalAgedReceivablesPerc1 = rArr[0];
            totalAgedPayablesPerc1 = rArr[1];
            totalNettAssetsPerc1 = rArr[2];
            totalAgedReceivablesPerc2 = rArr[3];
            totalAgedPayablesPerc2 = rArr[4];
            totalNettAssetsPerc2 = rArr[5];

            pArr = [];
            for (i = 0; i < 2; i++) {
                pArr.push(totalInvoiceCount[i]);
            }
            rArr = templateObject.calculatePercent(pArr);
            totalInvoiceCountPerc1 = rArr[0];
            totalInvoiceCountPerc2 = rArr[1];

            pArr = [];
            for (i = 0; i < 2; i++) {
                pArr.push(totalInvoiceValue[i]);
                pArr.push(averageInvoiceValue[i]);
            }
            rArr = templateObject.calculatePercent(pArr);
            totalInvoiceValuePerc1 = rArr[0];
            averageInvoiceValuePerc1 = rArr[1];
            totalInvoiceValuePerc2 = rArr[2];
            averageInvoiceValuePerc2 = rArr[3];

            pArr = [];
            for (i = 0; i < 2; i++) {
                pArr.push(avgDebtors[i]);
                pArr.push(avgCreditors[i]);
            }
            rArr = templateObject.calculatePercent(pArr);
            avgDebtorsPerc1 = rArr[0];
            avgCreditorsPerc1 = rArr[1];
            avgDebtorsPerc2 = rArr[2];
            avgCreditorsPerc2 = rArr[3];

            pArr = [];
            for (i = 0; i < 2; i++) {
                pArr.push(shortTermCash[i]);
                pArr.push(currentAsset[i]);
                pArr.push(termAsset[i]);
            }
            rArr = templateObject.calculatePercent(pArr);
            shortTermCashPerc1 = rArr[0];
            currentAssetPerc1 = rArr[1];
            termAssetPerc1 = rArr[2];
            shortTermCashPerc2 = rArr[3];
            currentAssetPerc2 = rArr[4];
            termAssetPerc2 = rArr[5];

            templateObject.cashReceivedPerc1.set(cashReceivedPerc1);
            templateObject.cashSpentPerc1.set(cashSpentPerc1);
            templateObject.cashSurplusPerc1.set(cashSurplusPerc1);
            templateObject.bankBalancePerc1.set(bankBalancePerc1);
            templateObject.cashReceivedPerc2.set(cashReceivedPerc2);
            templateObject.cashSpentPerc2.set(cashSpentPerc2);
            templateObject.cashSurplusPerc2.set(cashSurplusPerc2);
            templateObject.bankBalancePerc2.set(bankBalancePerc2);
            templateObject.setFieldValue(cashReceived[0], "spnCashReceived", "left");
            templateObject.setFieldValue(cashSpent[0], "spnCashSpent", "left");
            templateObject.setFieldValue(cashSurplus[0], "spnCashSurplus", "left");
            templateObject.setFieldValue(bankBalance[0], "spnBankBalance", "left");
            templateObject.setFieldValue(cashReceived[1], "spnCashReceived2", "right");
            templateObject.setFieldValue(cashSpent[1], "spnCashSpent2", "right");
            templateObject.setFieldValue(cashSurplus[1], "spnCashSurplus2", "right");
            templateObject.setFieldValue(bankBalance[1], "spnBankBalance2", "right");
            templateObject.setFieldVariance(cashReceived[0], cashReceived[1], "spnCashReceivedVariance", "divCashReceivedVariance");
            templateObject.setFieldVariance(cashSpent[0], cashSpent[1], "spnCashSpentVariance", "divCashSpentVariance");
            templateObject.setFieldVariance(cashSurplus[0], cashSurplus[1], "spnCashSurplusVariance", "divCashSurplusVariance");
            templateObject.setFieldVariance(bankBalance[0], bankBalance[1], "spnBankBalanceVariance", "divBankBalanceVariance");

            templateObject.totalSalesPerc1.set(totalSalesPerc1);
            templateObject.grossProfitPerc1.set(grossProfitPerc1);
            templateObject.totalExpensePerc1.set(totalExpensePerc1);
            templateObject.nettProfitPerc1.set(nettProfitPerc1);
            templateObject.totalSalesPerc2.set(totalSalesPerc2);
            templateObject.grossProfitPerc2.set(grossProfitPerc2);
            templateObject.totalExpensePerc2.set(totalExpensePerc2);
            templateObject.nettProfitPerc2.set(nettProfitPerc2);
            templateObject.setFieldValue(totalSales[0], "spnTotalSales", "left");
            templateObject.setFieldValue(grossProfit[0], "spnGrossProfit", "left");
            templateObject.setFieldValue(totalExpense[0], "spnTotalExpense", "left");
            templateObject.setFieldValue(nettProfit[0], "spnTotalnetincome", "left");
            templateObject.setFieldValue(totalSales[1], "spnTotalSales2", "right");
            templateObject.setFieldValue(grossProfit[1], "spnGrossProfit2", "right");
            templateObject.setFieldValue(totalExpense[1], "spnTotalExpense2", "right");
            templateObject.setFieldValue(nettProfit[1], "spnTotalnetincome2", "right");
            templateObject.setFieldVariance(totalSales[0], totalSales[1], "spnTotalSalesVariance", "divTotalSalesVariance");
            templateObject.setFieldVariance(grossProfit[0], grossProfit[1], "spnGrossProfitVariance", "divGrossProfitVariance");
            templateObject.setFieldVariance(totalExpense[0], totalExpense[1], "spnTotalExpenseVariance", "divTotalExpenseVariance");
            templateObject.setFieldVariance(nettProfit[0], nettProfit[1], "spnNettProfitVariance", "divNettProfitVariance");

            templateObject.grossProfitMarginPerc1.set(grossProfitMarginPerc1);
            templateObject.netProfitMarginPerc1.set(netProfitMarginPerc1);
            templateObject.returnOnInvestmentPerc1.set(returnOnInvestmentPerc1);
            templateObject.grossProfitMarginPerc2.set(grossProfitMarginPerc2);
            templateObject.netProfitMarginPerc2.set(netProfitMarginPerc2);
            templateObject.returnOnInvestmentPerc2.set(returnOnInvestmentPerc2);
            templateObject.setFieldValue(grossProfitMargin[0], "spnGrossProfitMargin", "left");
            templateObject.setFieldValue(netProfitMargin[0], "spnNetProfitMargin", "left");
            templateObject.setFieldValue(returnOnInvestment[0], "spnReturnInvest", "left");
            templateObject.setFieldValue(grossProfitMargin[1], "spnGrossProfitMargin2", "right");
            templateObject.setFieldValue(netProfitMargin[1], "spnNetProfitMargin2", "right");
            templateObject.setFieldValue(returnOnInvestment[1], "spnReturnInvest2", "right");
            templateObject.setFieldVariance(grossProfitMargin[0], grossProfitMargin[1], "spnGrossProfitMarginVariance", "divGrossProfitMarginVariance");
            templateObject.setFieldVariance(netProfitMargin[0], netProfitMargin[1], "spnNetProfitMarginVariance", "divNetProfitMarginVariance");
            templateObject.setFieldVariance(returnOnInvestment[0], returnOnInvestment[1], "spnReturnInvestVariance", "divReturnInvestVariance");

            templateObject.totalAgedReceivablesPerc1.set(totalAgedReceivablesPerc1);
            templateObject.totalAgedPayablesPerc1.set(totalAgedPayablesPerc1);
            templateObject.totalNettAssetsPerc1.set(totalNettAssetsPerc1);
            templateObject.totalAgedReceivablesPerc2.set(totalAgedReceivablesPerc2);
            templateObject.totalAgedPayablesPerc2.set(totalAgedPayablesPerc2);
            templateObject.totalNettAssetsPerc2.set(totalNettAssetsPerc2);
            templateObject.setFieldValue(totalAgedReceivables[0], "spnTotalAgedReceivables", "left");
            templateObject.setFieldValue(totalAgedPayables[0], "spnTotalAgedPayables", "left");
            templateObject.setFieldValue(totalNettAssets[0], "spnTotalNettAssets", "left");
            templateObject.setFieldValue(totalAgedReceivables[1], "spnTotalAgedReceivables2", "right");
            templateObject.setFieldValue(totalAgedPayables[1], "spnTotalAgedPayables2", "right");
            templateObject.setFieldValue(totalNettAssets[1], "spnTotalNettAssets2", "right");
            templateObject.setFieldVariance(totalAgedReceivables[0], totalAgedReceivables[1], "spnTotalAgedReceivablesVariance", "divTotalAgedReceivablesVariance");
            templateObject.setFieldVariance(totalAgedPayables[0], totalAgedPayables[1], "spnTotalAgedPayablesVariance", "divTotalAgedPayablesVariance");
            templateObject.setFieldVariance(totalNettAssets[0], totalNettAssets[1], "spnTotalNettAssetVariance", "divTotalNettAssetVariance");

            templateObject.totalInvoiceCountPerc1.set(totalInvoiceCountPerc1);
            templateObject.averageInvoiceValuePerc1.set(averageInvoiceValuePerc1);
            templateObject.totalInvoiceValuePerc1.set(totalInvoiceValuePerc1);
            templateObject.totalInvoiceCountPerc2.set(totalInvoiceCountPerc2);
            templateObject.averageInvoiceValuePerc2.set(averageInvoiceValuePerc2);
            templateObject.totalInvoiceValuePerc2.set(totalInvoiceValuePerc2);
            templateObject.setFieldValue(totalInvoiceCount[0], "spnTotalInvoiceCount", "left");
            templateObject.setFieldValue(averageInvoiceValue[0], "spnAverageInvoiceValue", "left");
            templateObject.setFieldValue(totalInvoiceValue[0], "spnTotalInvoiceValue", "left");
            templateObject.setFieldValue(totalInvoiceCount[1], "spnTotalInvoiceCount2", "right");
            templateObject.setFieldValue(averageInvoiceValue[1], "spnAverageInvoiceValue2", "right");
            templateObject.setFieldValue(totalInvoiceValue[1], "spnTotalInvoiceValue2", "right");
            templateObject.setFieldVariance(totalInvoiceCount[0], totalInvoiceCount[1], "spnTotalInvoiceCountVariance", "divTotalInvoiceCountVariance");
            templateObject.setFieldVariance(averageInvoiceValue[0], averageInvoiceValue[1], "spnAverageInvoiceValueVariance", "divAverageInvoiceValueVariance");
            templateObject.setFieldVariance(totalInvoiceValue[0], totalInvoiceValue[1], "spnTotalInvoiceValueVariance", "divTotalInvoiceValueVariance");

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
            templateObject.setFieldValue(avgDebtors[0], "spnAverageDebtors", "left");
            templateObject.setFieldValue(avgCreditors[0], "spnAverageCreditors", "left");
            templateObject.setFieldValue(shortTermCash[0], "spnShortTermCash", "left");
            templateObject.setFieldValue(currentAsset[0], "spnCurrentAsset", "left");
            templateObject.setFieldValue(termAsset[0], "spnTermAsset", "left");
            templateObject.setFieldValue(avgDebtors[1], "spnAverageDebtors2", "right");
            templateObject.setFieldValue(avgCreditors[1], "spnAverageCreditors2", "right");
            templateObject.setFieldValue(shortTermCash[1], "spnShortTermCash2", "right");
            templateObject.setFieldValue(currentAsset[1], "spnCurrentAsset2", "right");
            templateObject.setFieldValue(termAsset[1], "spnTermAsset2", "right");
            templateObject.setFieldVariance(avgDebtors[0], avgDebtors[1], "spnAverageDebtorsVariance", "divAverageDebtorsVariance");
            templateObject.setFieldVariance(avgCreditors[0], avgCreditors[1], "spnAverageCreditorsVariance", "divAverageCreditorsVariance");
            templateObject.setFieldVariance(shortTermCash[0], shortTermCash[1], "spnShortTermCashVariance", "divShortTermCashVariance");
            templateObject.setFieldVariance(currentAsset[0], currentAsset[1], "spnCurrentAssetVariance", "divCurrentAssetVariance");
            templateObject.setFieldVariance(termAsset[0], termAsset[1], "spnTermAssetVariance", "divTermAssetVariance");
        } catch (err) {}
        LoadingOverlay.hide();
    }
    const currentDate = new Date()
    templateObject.setTitleDE();
    templateObject.setMonthsOnHeader();
    var dateAsOf = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
    templateObject.getDashboardExecutiveData(dateAsOf, false);
    chartService.checkChartToDisplay(); // we run this so we load the correct charts to diplay
    templateObject.activateDraggable(); // this will enable charts resiable features
    $(document).on("change", "#dateFrom, #dateTo", () => {
        templateObject.setTitleDE();
        templateObject.setMonthsOnHeader();
    })
});

Template.dashboardexe.helpers({
    includeDashboard: () => {
        return Template.instance().includeDashboard.get();
    },
    loggedCompany: () => {
        return localStorage.getItem("mySession") || "";
    },
    titleDE: () => {
        return Template.instance().titleDE.get();
    },
    titleMonth1: () => {
        return Template.instance().titleMonth1.get();
    },
    titleMonth2: () => {
        return Template.instance().titleMonth2.get();
    },

    cashReceivedPerc1: () => {
        return Template.instance().cashReceivedPerc1.get() || 0;
    },
    cashSpentPerc1: () => {
        return Template.instance().cashSpentPerc1.get() || 0;
    },
    cashSurplusPerc1: () => {
        return Template.instance().cashSurplusPerc1.get() || 0;
    },
    bankBalancePerc1: () => {
        return Template.instance().bankBalancePerc1.get() || 0;
    },
    cashReceivedPerc2: () => {
        return Template.instance().cashReceivedPerc2.get() || 0;
    },
    cashSpentPerc2: () => {
        return Template.instance().cashSpentPerc2.get() || 0;
    },
    cashSurplusPerc2: () => {
        return Template.instance().cashSurplusPerc2.get() || 0;
    },
    bankBalancePerc2: () => {
        return Template.instance().bankBalancePerc2.get() || 0;
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
    },

    grossProfitMarginPerc1: () => {
        return Template.instance().grossProfitMarginPerc1.get() || 0;
    },
    netProfitMarginPerc1: () => {
        return Template.instance().netProfitMarginPerc1.get() || 0;
    },
    returnOnInvestmentPerc1: () => {
        return Template.instance().returnOnInvestmentPerc1.get() || 0;
    },
    grossProfitMarginPerc2: () => {
        return Template.instance().grossProfitMarginPerc2.get() || 0;
    },
    netProfitMarginPerc2: () => {
        return Template.instance().netProfitMarginPerc2.get() || 0;
    },
    returnOnInvestmentPerc2: () => {
        return Template.instance().returnOnInvestmentPerc2.get() || 0;
    },

    totalAgedReceivablesPerc1: () => {
        return Template.instance().totalAgedReceivablesPerc1.get() || 0;
    },
    totalAgedPayablesPerc1: () => {
        return Template.instance().totalAgedPayablesPerc1.get() || 0;
    },
    totalNettAssetsPerc1: () => {
        return Template.instance().totalNettAssetsPerc1.get() || 0;
    },
    totalAgedReceivablesPerc2: () => {
        return Template.instance().totalAgedReceivablesPerc2.get() || 0;
    },
    totalAgedPayablesPerc2: () => {
        return Template.instance().totalAgedPayablesPerc2.get() || 0;
    },
    totalNettAssetsPerc2: () => {
        return Template.instance().totalNettAssetsPerc2.get() || 0;
    },

    totalInvoiceCountPerc1: () => {
        return Template.instance().totalInvoiceCountPerc1.get() || 0;
    },
    averageInvoiceValuePerc1: () => {
        return Template.instance().averageInvoiceValuePerc1.get() || 0;
    },
    totalInvoiceValuePerc1: () => {
        return Template.instance().totalInvoiceValuePerc1.get() || 0;
    },
    totalInvoiceCountPerc2: () => {
        return Template.instance().totalInvoiceCountPerc2.get() || 0;
    },
    averageInvoiceValuePerc2: () => {
        return Template.instance().averageInvoiceValuePerc2.get() || 0;
    },
    totalInvoiceValuePerc2: () => {
        return Template.instance().totalInvoiceValuePerc2.get() || 0;
    },

    avgDebtorsPerc1: () => {
        return Template.instance().avgDebtorsPerc1.get() || 0;
    },
    avgCreditorsPerc1: () => {
        return Template.instance().avgCreditorsPerc1.get() || 0;
    },
    shortTermCashPerc1: () => {
        return Template.instance().shortTermCashPerc1.get() || 0;
    },
    currentAssetPerc1: () => {
        return Template.instance().currentAssetPerc1.get() || 0;
    },
    termAssetPerc1: () => {
        return Template.instance().termAssetPerc1.get() || 0;
    },
    avgDebtorsPerc2: () => {
        return Template.instance().avgDebtorsPerc2.get() || 0;
    },
    avgCreditorsPerc2: () => {
        return Template.instance().avgCreditorsPerc2.get() || 0;
    },
    shortTermCashPerc2: () => {
        return Template.instance().shortTermCashPerc2.get() || 0;
    },
    currentAssetPerc2: () => {
        return Template.instance().currentAssetPerc2.get() || 0;
    },
    termAssetPerc2: () => {
        return Template.instance().termAssetPerc2.get() || 0;
    }
});

// Listen to event to update reactive variable
Template.dashboardexe.events({
    "change .balancedate": function() {
        let templateObject = Template.instance();
        LoadingOverlay.show();
        let balanceDate = $("#balancedate").val();
        let arrDate = balanceDate.split("/");
        // let formatBalDate = moment(balanceDate).format("YYYY-MM-DD");
        let formatBalDate = arrDate[2] + "-" + arrDate[1] + "-" + arrDate[0];
        templateObject.setTitleDE(arrDate[2], eval(arrDate[1]) - 1, arrDate[0]);
        templateObject.setMonthsOnHeader(arrDate[2], eval(arrDate[1]) - 1, arrDate[0]);
        templateObject.getDashboardExecutiveData(formatBalDate, true);
        LoadingOverlay.hide();
    },
    "click .panelFieldDiv": (e) => {
        let reportURL = $(e.currentTarget).attr("data-ppanel");
        let balanceDate = $("#balancedate").val();
        let arrDate = balanceDate.split("/");
        let formatBalDate = arrDate[2] + "-" + arrDate[1] + "-" + arrDate[0];
        location.href = '/' + reportURL + '?viewDate="' + formatBalDate + '"';
    },    
    "click .editchartsbtn": () => {
        chartService.onEdit()
        cardService.onEdit()
    },
    "click .resetchartbtn": () => {        
        chartService.resetCharts()
        cardService.resetCards()
    }, 
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});

Template.registerHelper('notEquals', function(a, b) {
    return a != b;
});

Template.registerHelper('containsequals', function(a, b) {
    return (a.indexOf(b) >= 0);
});