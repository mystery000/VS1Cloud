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
    var curDate = new Date();
    var dateTo1 = new Date(curDate.getFullYear(), curDate.getMonth() - 1, 0);
    var dateTo2 = new Date(curDate.getFullYear(), curDate.getMonth(), 0);
    
    var loadDate1 = moment(dateTo1).format("YYYY-MM-DD");
    var loadDate2 = moment(dateTo2).format("YYYY-MM-DD");
    var loadDates = [];
    loadDates.push(loadDate1);
    loadDates.push(loadDate2);

    var fromDates = [];
    var toDates = [];
    fromDates.push(dateTo1.getFullYear() + '-' + ("0" + (dateTo1.getMonth() + 1)).slice(-2) + '-' + "01");
    toDates.push(dateTo1.getFullYear() + '-' + ("0" + (dateTo1.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateTo1.getDate())).slice(-2));
    fromDates.push(dateTo2.getFullYear() + '-' + ("0" + (dateTo2.getMonth() + 1)).slice(-2) + '-' + "01");
    toDates.push(dateTo2.getFullYear() + '-' + ("0" + (dateTo2.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateTo2.getDate())).slice(-2));
    
    let SubAccountTotal = 0;
    let HeaderAccountTotal = 0;
    let TotalCurrentAsset_Liability = 0;
    let TotalAsset_Liability = 0;
    let AccountTree = "";

    let agedReceivables = 0;
    let agedPayables = 0;
    let cntPayment = 0;
    let dueDate = "";
    let paymentDate = "";
    let orderDate = "";
    let debtorDays = 0;
    let creditorDays = 0;
    let totalDebtorDays = 0;
    let totalCreditorDays = 0;
    var i = 0, k = 0, j = 0, m = 0, n = 0;
    for (k=0; k<2; k++) {
      agedReceivables = 0;
      agedPayables = 0;
      cntPayment = 0;
      dueDate = "";
      paymentDate = "";
      orderDate = "";
      debtorDays = 0;
      creditorDays = 0;
      let data1 = await reportService.getAgedReceivableDetailsSummaryData(fromDates[k], toDates[k], "false", '');
      let data2 = await reportService.getAgedPayableDetailsSummaryData(fromDates[k], toDates[k], "false", '');      
      let data = await reportService.getBalanceSheetReport(loadDates[k]);

      if (data1.tarreport) {
        for (i=0; i<data1.tarreport.length; i++) {
          agedReceivables += data1.tarreport[i].AmountDue;
          let data101 = await reportService.getAgedReceivableDetailsData(fromDates[k], toDates[k], "false", data1.tarreport[i].ClientID);
          if (data101.tarreport) {
            for (j=0; j<data101.tarreport.length; j++){
              dueDate = data101.tarreport[j].DueDate;
              let data102 = await salesService.getCheckPaymentDetailsByName(data101.tarreport[i].Printname);
              if (data102.tcustomerpayment) {
                for (m=0; m<data102.tcustomerpayment.length; m++){
                  paymentDate = data102.tcustomerpayment[m].fields.PaymentDate;
                }
              }
              cntPayment++;
              if (paymentDate == "")
                debtorDays = 0;
              else if (dueDate == "") 
                debtorDays = 0;
              else {
                let arrDate1 = paymentDate.split(" ");
                let strDate1 = arrDate1[0];
                let arrStrDate1 = strDate1.split("-");
                let date1 = new Date(arrStrDate1[0], arrStrDate1[1], arrStrDate1[2]);
                let arrDate2 = dueDate.split(" ");
                let strDate2 = arrDate2[0];
                let arrStrDate2 = strDate2.split("-");
                let date2 = new Date(arrStrDate2[0], arrStrDate2[1], arrStrDate2[2]);
                debtorDays = Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
                if (debtorDays < 0)
                  debtorDays = 0;
              }
              totalDebtorDays += debtorDays;
            }
          }
        }
      }
      if (cntPayment > 0)
        avgDebtors[k] = Math.round(totalDebtorDays / cntPayment);
      cntPayment = 0;
      if (data2.tarreport) {
        for (i=0; i<data2.tarreport.length; i++) {
          agedPayables += data2.tarreport[i].AmountDue;
          let data201 = await sideBarService.getTAPReportPage(fromDates[k], toDates[k], "false", data2.tarreport[i].ClientID);
          for (j=0; j<data201.tarreport.length; j++){
            dueDate = data201.tarreport[j].DueDate;
            let data202 = contactService.getAllTransListBySupplier(data201.tarreport[i].Printname);
            if (data202.tbillreport) {
              for (m=0; m<data202.tbillreport.length; m++){
                orderDate = data202.tbillreport[m].OrderDate;
              }
            }
            cntPayment++;
            if (orderDate == "")
              creditorDays = 0;
            else if (dueDate == "") 
              creditorDays = 0;
            else {
              let arrDate1 = orderDate.split(" ");
              let strDate1 = arrDate1[0];
              let arrStrDate1 = strDate1.split("-");
              let date1 = new Date(arrStrDate1[0], arrStrDate1[1], arrStrDate1[2]);
              let arrDate2 = dueDate.split(" ");
              let strDate2 = arrDate2[0];
              let arrStrDate2 = strDate2.split("-");
              let date2 = new Date(arrStrDate2[0], arrStrDate2[1], arrStrDate2[2]);
              creditorDays = Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
              if (creditorDays < 0)
                creditorDays = 0;
            }
            totalCreditorDays += creditorDays;
          }
        }
      }
      if (cntPayment > 0)
        avgCreditors[k] = Math.round(totalCreditorDays / cntPayment);
      shortTermCash[k] = agedReceivables - agedPayables;
      if (data.balancesheetreport) {
        for (i = 0, len = data.balancesheetreport.length; i < len; i++) {
          SubAccountTotal = data.balancesheetreport[i]["Sub Account Total"];
          HeaderAccountTotal = data.balancesheetreport[i]["Header Account Total"];
          TotalCurrentAsset_Liability = data.balancesheetreport[i]["Total Current Asset & Liability"];
          TotalAsset_Liability = data.balancesheetreport[i]["Total Asset & Liability"];

          AccountTree = data.balancesheetreport[i]["Account Tree"];
          if (AccountTree.replace(/\s/g, "") == "TotalCurrentAssets") {
            totalCurrentAsset = TotalCurrentAsset_Liability;
          } else if (AccountTree.replace(/\s/g, "") == "TotalCurrentLiabilities") {
            totalCurrentLiability = TotalCurrentAsset_Liability;
          } else if (AccountTree.replace(/\s/g, "") == "TotalOtherCurrentAsset") {
            totalOtherAsset = HeaderAccountTotal;
          } else if (AccountTree.replace(/\s/g, "") == "TotalOtherCurrentLiability") {
            totalOtherLiability = HeaderAccountTotal;
          } else {

          }
        }
        currentAsset[k] = totalCurrentAsset - totalCurrentLiability;
        termAsset[k] = totalOtherAsset - totalOtherLiability;
      }
    }

    [avgDebtorsPerc1, avgCreditorsPerc1, shortTermCashPerc1, currentAssetPerc1, termAssetPerc1] = templateObject.calculatePercent([avgDebtors[0], avgCreditors[0], shortTermCash[0], currentAsset[0], termAsset[0]]);
    [avgDebtorsPerc2, avgCreditorsPerc2, shortTermCashPerc2, currentAssetPerc2, termAssetPerc2] = templateObject.calculatePercent([avgDebtors[1], avgCreditors[1], shortTermCash[1], currentAsset[1], termAsset[1]]);

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

