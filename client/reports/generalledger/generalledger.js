import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import GlobalFunctions from "../../GlobalFunctions";
import moment from "moment";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import Datehandler from "../../DateHandler";
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './generalledger.html';

let defaultCurrencyCode = CountryAbbr; // global variable "AUD"


let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();

Template.generalledger.inheritsHelpersFrom('vs1_report_template');
// Template.generalledger.inheritsEventsFrom('vs1_report_template');
// Template.generalledger.inheritsHooksFrom('vs1_report_template');

Template.generalledger.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.transactiondatatablerecords = new ReactiveVar([]);
  templateObject.grandrecords = new ReactiveVar();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();
  templateObject.generalledgerth = new ReactiveVar([]);

  FxGlobalFunctions.initVars(templateObject);

  templateObject.reportOptions = new ReactiveVar([]);
});

// Template.generalledger.onRendered(() => {
//   LoadingOverlay.show();
//   const templateObject = Template.instance();
//   let taxRateService = new TaxRateService();
//   let utilityService = new UtilityService();

//   templateObject.init_reset_data = function () {
//     let reset_data = [];
//     reset_data = [
//       { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "85" },
//       { index: 2, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "110" },
//       { index: 3, label: 'Type', class: 'colType', active: true, display: true, width: "85" },
//       { index: 4, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "120" },
//       { index: 5, label: 'Product Description', class: 'colCredit', active: true, display: true, width: "150" },
//       { index: 6, label: 'Department', class: 'colDepartment', active: true, display: true, width: "100" },
//       { index: 7, label: 'Debits (Ex)', class: 'colDebitsEx', active: true, display: true, width: "120" },
//       { index: 8, label: 'Credits (Ex)', class: 'colCreditEx', active: true, display: true, width: "120" },
//       { index: 9, label: 'Client Name', class: 'colProductDescription', active: true, display: true, width: "120" },
//       { index: 10, label: 'Rep Name', class: 'colRepName', active: true, display: true, width: "85" },
//       { index: 11, label: 'Debits (Inc)', class: 'colDebitsInc', active: true, display: true, width: "120" },
//       { index: 12, label: 'Credits (Inc)', class: 'colCreditInc', active: true, display: true, width: "120" },
//       { index: 13, label: 'Amount (Ex)', class: 'colAmountEx', active: true, display: true, width: "120" },
//       { index: 14, label: 'Amount (Inc)', class: 'colAmountInc', active: true, display: true, width: "120" },
//       { index: 15, label: 'Accounts', class: 'colAccounts', active: false, display: true, width: "85" },
//       { index: 16, label: 'Global Ref', class: 'colGlobalRef', active: false, display: true, width: "85" },
//       { index: 17, label: 'Account Number', class: 'colAccountNo', active: false, display: true, width: "140" },
//       { index: 18, label: 'Tax Code', class: 'colTaxCode', active: false, display: true, width: "150" },
//       { index: 19, label: 'Tax Rate', class: 'colTaxRate', active: false, display: true, width: "85" },
//       { index: 20, label: 'Class ID', class: 'colClassID', active: false, display: true, width: "85" },
//       { index: 21, label: 'Sale ID', class: 'colSaleID', active: false, display: true, width: "85" },
//       { index: 22, label: 'Purchase Order ID', class: 'colPurchaseOrderID', active: false, display: true, width: "85" },
//       { index: 23, label: 'Payment ID', class: 'colPaymentID', active: false, display: true, width: "85" },
//       { index: 24, label: 'Details', class: 'colDetails', active: false, display: true, width: "85" },
//       { index: 25, label: 'Account ID', class: 'colAccountID', active: false, display: true, width: "85" },
//       { index: 26, label: 'FixedAsset ID', class: 'colFixedAssetID', active: false, display: true, width: "85" },
//       { index: 27, label: 'Check Number', class: 'colCheckNumber', active: false, display: true, width: "85" },
//       { index: 28, label: 'Memo', class: 'colMemo', active: false, display: true, width: "85" },
//       { index: 29, label: 'Ref No', class: 'colRefNo', active: false, display: true, width: "85" },
//       { index: 30, label: 'PrepaymentID', class: 'colPrepaymentID', active: false, display: true, width: "85" },
//     ];

//     templateObject.generalledgerth.set(reset_data);
//   }
//   templateObject.init_reset_data();

//   // var data = Template.parentData(function (data) {return data instanceof MyDocument;});
//   // let salesOrderTable;
//   // var splashArray = new Array();
//   // var today = moment().format("DD/MM/YYYY");
//   // var currentDate = new Date();
//   // var begunDate = moment(currentDate).format("DD/MM/YYYY");
//   // let fromDateMonth = currentDate.getMonth() + 1;
//   // let fromDateDay = currentDate.getDate();
//   // if (currentDate.getMonth() + 1 < 10) {
//   //   fromDateMonth = "0" + (currentDate.getMonth() + 1);
//   // }

//   // let imageData = localStorage.getItem("Image");
//   // if (imageData) {
//   //   $("#uploadedImage").attr("src", imageData);
//   //   $("#uploadedImage").attr("width", "50%");
//   // }

//   // let prevMonth = moment().subtract(1, 'months').format('MM')



//   // if (currentDate.getDate() < 10) {
//   //   fromDateDay = "0" + currentDate.getDate();
//   // }
//   // let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + ;
//   // var fromDate =
//   //   fromDateDay + "/" + prevMonth + "/" + currentDate.getFullYear();
//   const dataTableList = [];
//   const deptrecords = [];
//   // $("#date-input,#dateTo,#dateFrom").datepicker({
//   //   showOn: "button",
//   //   buttonText: "Show Date",
//   //   buttonImageOnly: true,
//   //   buttonImage: "/img/imgCal2.png",
//   //   dateFormat: "dd/mm/yy",
//   //   showOtherMonths: true,
//   //   selectOtherMonths: true,
//   //   changeMonth: true,
//   //   changeYear: true,
//   //   yearRange: "-90:+10",
//   //   onChangeMonthYear: function (year, month, inst) {
//   //     // Set date to picker
//   //     $(this).datepicker(
//   //       "setDate",
//   //       new Date(year, inst.selectedMonth, inst.selectedDay)
//   //     );
//   //     // Hide (close) the picker
//   //     // $(this).datepicker('hide');
//   //     // // Change ttrigger the on change function
//   //     // $(this).trigger('change');
//   //   },
//   // });

//   // $("#dateFrom").val(fromDate);
//   // $("#dateTo").val(begunDate);

//   templateObject.initDate = () => {
//     Datehandler.initOneMonth();
//   };

//   templateObject.initDate();

//   templateObject.setDateAs = (dateFrom = null) => {
//     templateObject.dateAsAt.set((dateFrom) ? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
//   };

//   templateObject.getGeneralLedgerReports = function (dateFrom, dateTo, ignoreDate) {

//     templateObject.setDateAs(dateFrom);

//     if (!localStorage.getItem("VS1GeneralLedger_Report")) {
//       LoadingOverlay.show();
//       reportService.getGeneralLedgerDetailsData(dateFrom, dateTo, ignoreDate).then(function (data) {
//         let totalRecord = [];
//         let grandtotalRecord = [];
//         if (data.tgeneralledgerreport.length) {
//           localStorage.setItem("VS1GeneralLedger_Report", JSON.stringify(data) || "");
//           let records = [];
//           let allRecords = [];
//           let current = [];

//           let totalNetAssets = 0;
//           let GrandTotalLiability = 0;
//           let GrandTotalAsset = 0;
//           let incArr = [];
//           let cogsArr = [];
//           let expArr = [];
//           let accountData = data.tgeneralledgerreport;
//           let accountType = "";
//           for (let i = 0; i < accountData.length; i++) {
//             let recordObj = {};
//             recordObj.Id = data.tgeneralledgerreport[i].PURCHASEORDERID;
//             recordObj.AccountName = data.tgeneralledgerreport[i].ACCOUNTNAME;
//             recordObj.paymentId = data.tgeneralledgerreport[i].PAYMENTID;
//             recordObj.saleId = data.tgeneralledgerreport[i].SALEID;
//             recordObj.type = data.tgeneralledgerreport[i].TYPE;
//             recordObj.cheqNumber = data.tgeneralledgerreport[i].CHEQUENUMBER;
//             recordObj.dataArr = [
//               "",
//               data.tgeneralledgerreport[i].ACCOUNTNUMBER,

//               // data.tgeneralledgerreport[i].MEMO || "-",
//               // moment(data.tgeneralledgerreport[i].DATE).format("DD MMM YYYY") || '-',
//               data.tgeneralledgerreport[i].DATE != "" ? moment(data.tgeneralledgerreport[i].DATE).format("DD/MM/YYYY") : data.tgeneralledgerreport[i].DATE,
//               data.tgeneralledgerreport[i]["CLIENT NAME"],
//               data.tgeneralledgerreport[i].TYPE,
//               // utilityService.modifynegativeCurrencyFormat(
//               //   data.tgeneralledgerreport[i].AMOUNTINC
//               // ) || "-",
//               // // utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i].Current) || '-',
//               // utilityService.modifynegativeCurrencyFormat(
//               //   data.tgeneralledgerreport[i].DEBITSEX
//               // ) || "-",
//               // utilityService.modifynegativeCurrencyFormat(
//               //   data.tgeneralledgerreport[i].CREDITSEX
//               // ) || "-",
//               // utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i].Current) || '-',
//               {
//                 type: "amount",
//                 value: utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i].DEBITSEX) || "-",
//                 amount: data.tgeneralledgerreport[i].DEBITSEX || "-",
//               },
//               {
//                 type: "amount",
//                 value: utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i].CREDITSEX) || "-",
//                 amount: data.tgeneralledgerreport[i].CREDITSEX || "-",
//               },
//               {
//                 type: "amount",
//                 value: utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i].AMOUNTINC) || "-",
//                 amount: data.tgeneralledgerreport[i].AMOUNTINC || "-",
//               },
//               // utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i]["60-90Days"]) || '-',
//               // utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i][">90Days"]) || '-',

//               //
//             ];
//             //
//             //   if((data.tgeneralledgerreport[i].AmountDue != 0) || (data.tgeneralledgerreport[i].Current != 0)
//             //   || (data.tgeneralledgerreport[i]["1-30Days"] != 0) || (data.tgeneralledgerreport[i]["30-60Days"] != 0)
//             // || (data.tgeneralledgerreport[i]["60-90Days"] != 0) || (data.tgeneralledgerreport[i][">90Days"] != 0)){
//             //
//             //   }

//             records.push(recordObj);
//           }
//           records = _.sortBy(records, "AccountName");
//           records = _.groupBy(records, "AccountName");

//           for (let key in records) {
//             let obj = [{ key: key }, { data: records[key] }];
//             allRecords.push(obj);
//           }

//           let iterator = 0;
//           for (let i = 0; i < allRecords.length; i++) {
//             let amountduetotal = 0;
//             let Currenttotal = 0;
//             let lessTnMonth = 0;
//             let oneMonth = 0;
//             let twoMonth = 0;
//             let threeMonth = 0;
//             let Older = 0;
//             const currencyLength = Currency.length;
//             for (let k = 0; k < allRecords[i][1].data.length; k++) {
//               // amountduetotal = amountduetotal + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[4]);
//               Currenttotal = Currenttotal + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[5].value);
//               oneMonth = oneMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[6].value);
//               twoMonth = twoMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[7].value);
//             }
//             let val = [
//               "Total " + allRecords[i][0].key + "",
//               "",
//               "",
//               "",
//               "",
//               // "",

//               // utilityService.modifynegativeCurrencyFormat(Currenttotal),
//               // utilityService.modifynegativeCurrencyFormat(oneMonth),
//               // utilityService.modifynegativeCurrencyFormat(twoMonth),
//               { type: "amount", value: utilityService.modifynegativeCurrencyFormat(Currenttotal), amount: Currenttotal, },
//               { type: "amount", value: utilityService.modifynegativeCurrencyFormat(oneMonth), amount: oneMonth, },
//               { type: "amount", value: utilityService.modifynegativeCurrencyFormat(twoMonth), amount: twoMonth, },
//             ];
//             current.push(val);
//           }

//           //grandtotalRecord
//           let grandamountduetotal = 0;
//           let grandCurrenttotal = 0;
//           let grandlessTnMonth = 0;
//           let grandoneMonth = 0;
//           let grandtwoMonth = 0;
//           let grandthreeMonth = 0;
//           let grandOlder = 0;

//           for (let n = 0; n < current.length; n++) {
//             const grandcurrencyLength = Currency.length;
//             grandtwoMonth = grandtwoMonth + utilityService.convertSubstringParseFloat(current[n][5].value);
//             grandthreeMonth = grandthreeMonth + utilityService.convertSubstringParseFloat(current[n][6].value);
//             grandOlder = grandOlder + utilityService.convertSubstringParseFloat(current[n][7].value);
//           }

//           let grandval = [
//             "Grand Total " + "",
//             "",
//             "",
//             "",
//             "",
//             // "",
//             // utilityService.modifynegativeCurrencyFormat(grandtwoMonth),
//             // utilityService.modifynegativeCurrencyFormat(grandthreeMonth),
//             // utilityService.modifynegativeCurrencyFormat(grandOlder),

//             {
//               type: "amount",
//               value:
//                 utilityService.modifynegativeCurrencyFormat(grandthreeMonth),
//               amount: grandthreeMonth,
//             },
//             {
//               type: "amount",
//               value: utilityService.modifynegativeCurrencyFormat(grandOlder),
//               amount: grandOlder,
//             },
//             {
//               type: "amount",
//               value:
//                 utilityService.modifynegativeCurrencyFormat(grandtwoMonth),
//               amount: grandtwoMonth,
//             },
//           ];

//           for (let key in records) {
//             let dataArr = current[iterator];
//             let obj = [
//               { key: key },
//               { data: records[key] },
//               { total: [{ dataArr: dataArr }] },
//             ];
//             totalRecord.push(obj);
//             iterator += 1;
//           }

//           templateObject.records.set(totalRecord);
//           templateObject.grandrecords.set(grandval);

//           if (templateObject.records.get()) {
//             setTimeout(function () {
//               $("td a").each(function () {
//                 if (
//                   $(this)
//                     .text()
//                     .indexOf("-" + Currency) >= 0
//                 )
//                   $(this).addClass("text-danger");
//               });
//               $("td").each(function () {
//                 if (
//                   $(this)
//                     .text()
//                     .indexOf("-" + Currency) >= 0
//                 )
//                   $(this).addClass("text-danger");
//               });

//               $("td").each(function () {
//                 let lineValue = $(this).first().text()[0];
//                 if (lineValue != undefined) {
//                   if (lineValue.indexOf(Currency) >= 0)
//                     $(this).addClass("text-right");
//                 }
//               });

//               $("td").each(function () {
//                 if (
//                   $(this)
//                     .first()
//                     .text()
//                     .indexOf("-" + Currency) >= 0
//                 )
//                   $(this).addClass("text-right");
//               });

//               $(".fullScreenSpin").css("display", "none");
//             }, 100);
//           }
//         } else {
//           let records = [];
//           let recordObj = {};
//           recordObj.Id = "";
//           recordObj.type = "";
//           recordObj.AccountName = " ";
//           recordObj.dataArr = [
//             "-",
//             "-",
//             "-",
//             "-",
//             "-",
//             "-",
//             "-",
//             "-",
//             "-",
//             // "-",
//           ];

//           records.push(recordObj);
//           templateObject.records.set(records);
//           templateObject.grandrecords.set("");
//         }
//         LoadingOverlay.hide();
//       }).catch(function (err) {
//         LoadingOverlay.hide();
//       });
//     } else {
//       LoadingOverlay.show();
//       let data = JSON.parse(localStorage.getItem("VS1GeneralLedger_Report"));
//       let totalRecord = [];
//       let grandtotalRecord = [];

//       if (data.tgeneralledgerreport.length) {
//         let records = [];
//         let allRecords = [];
//         let current = [];

//         let totalNetAssets = 0;
//         let GrandTotalLiability = 0;
//         let GrandTotalAsset = 0;
//         let incArr = [];
//         let cogsArr = [];
//         let expArr = [];
//         let accountData = data.tgeneralledgerreport;
//         let accountType = "";
//         for (let i = 0; i < accountData.length; i++) {
//           let recordObj = {};
//           recordObj.Id = data.tgeneralledgerreport[i].PURCHASEORDERID;
//           recordObj.AccountName = data.tgeneralledgerreport[i].ACCOUNTNAME;
//           recordObj.paymentId = data.tgeneralledgerreport[i].PAYMENTID;
//           recordObj.saleId = data.tgeneralledgerreport[i].SALEID;
//           recordObj.cheqNumber = data.tgeneralledgerreport[i].CHEQUENUMBER;
//           recordObj.type = data.tgeneralledgerreport[i].TYPE;

//           recordObj.dataArr = [
//             "",
//             data.tgeneralledgerreport[i].ACCOUNTNUMBER,

//             // data.tgeneralledgerreport[i].MEMO || "-",
//             // moment(data.tgeneralledgerreport[i].DATE).format("DD MMM YYYY") || '-',
//             data.tgeneralledgerreport[i].DATE != ""
//               ? moment(data.tgeneralledgerreport[i].DATE).format("DD/MM/YYYY")
//               : data.tgeneralledgerreport[i].DATE,
//             data.tgeneralledgerreport[i]["CLIENT NAME"],
//             data.tgeneralledgerreport[i].TYPE,
//             // utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i].Current) || '-',
//             {
//               type: "amount",
//               value:
//                 utilityService.modifynegativeCurrencyFormat(
//                   data.tgeneralledgerreport[i].DEBITSEX
//                 ) || "-",
//               amount: data.tgeneralledgerreport[i].DEBITSEX || "-",
//             },
//             {
//               type: "amount",
//               value:
//                 utilityService.modifynegativeCurrencyFormat(
//                   data.tgeneralledgerreport[i].CREDITSEX
//                 ) || "-",
//               amount: data.tgeneralledgerreport[i].CREDITSEX || "-",
//             },
//             {
//               type: "amount",
//               value:
//                 utilityService.modifynegativeCurrencyFormat(
//                   data.tgeneralledgerreport[i].AMOUNTINC
//                 ) || "-",
//               amount: data.tgeneralledgerreport[i].AMOUNTINC || "-",
//             },

//             // utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i]["60-90Days"]) || '-',
//             // utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i][">90Days"]) || '-',

//             //
//           ];
//           //
//           //   if((data.tgeneralledgerreport[i].AmountDue != 0) || (data.tgeneralledgerreport[i].Current != 0)
//           //   || (data.tgeneralledgerreport[i]["1-30Days"] != 0) || (data.tgeneralledgerreport[i]["30-60Days"] != 0)
//           // || (data.tgeneralledgerreport[i]["60-90Days"] != 0) || (data.tgeneralledgerreport[i][">90Days"] != 0)){
//           //
//           //   }

//           records.push(recordObj);

//         }
//         records = _.sortBy(records, "AccountName");
//         records = _.groupBy(records, "AccountName");

//         for (let key in records) {
//           let obj = [{ key: key }, { data: records[key] }];
//           allRecords.push(obj);
//         }

//         let iterator = 0;
//         for (let i = 0; i < allRecords.length; i++) {
//           let amountduetotal = 0;
//           let Currenttotal = 0;
//           let lessTnMonth = 0;
//           let oneMonth = 0;
//           let twoMonth = 0;
//           let threeMonth = 0;
//           let Older = 0;
//           const currencyLength = Currency.length;
//           for (let k = 0; k < allRecords[i][1].data.length; k++) {
//             // amountduetotal = amountduetotal + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[4]);
//             Currenttotal = Currenttotal + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[5].value);
//             oneMonth = oneMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[6].value);
//             twoMonth = twoMonth + utilityService.convertSubstringParseFloat(allRecords[i][1].data[k].dataArr[7].value);
//           }
//           let val = [
//             "Total " + allRecords[i][0].key + "",
//             "",
//             "",
//             "",
//             "",
//             // "",

//             {
//               type: "amount",
//               value: utilityService.modifynegativeCurrencyFormat(Currenttotal),
//               amount: Currenttotal,
//             },
//             {
//               type: "amount",
//               value: utilityService.modifynegativeCurrencyFormat(oneMonth),
//               amount: oneMonth,
//             },
//             {
//               type: "amount",
//               value: utilityService.modifynegativeCurrencyFormat(twoMonth),
//               amount: twoMonth,
//             },
//           ];
//           current.push(val);
//         }

//         //grandtotalRecord
//         let grandamountduetotal = 0;
//         let grandCurrenttotal = 0;
//         let grandlessTnMonth = 0;
//         let grandoneMonth = 0;
//         let grandtwoMonth = 0;
//         let grandthreeMonth = 0;
//         let grandOlder = 0;

//         for (let n = 0; n < current.length; n++) {
//           const grandcurrencyLength = Currency.length;
//           grandtwoMonth = grandtwoMonth + utilityService.convertSubstringParseFloat(current[n][5].value);
//           grandthreeMonth = grandthreeMonth + utilityService.convertSubstringParseFloat(current[n][6].value);
//           grandOlder = grandOlder + utilityService.convertSubstringParseFloat(current[n][7].value);
//         }

//         let grandval = [
//           "Grand Total " + "",
//           "",
//           "",
//           "",
//           "",
//           // "",

//           {
//             type: "amount",
//             value: utilityService.modifynegativeCurrencyFormat(grandtwoMonth),
//             amount: grandtwoMonth,
//           },
//           {
//             type: "amount",
//             value: utilityService.modifynegativeCurrencyFormat(grandthreeMonth),
//             amount: grandthreeMonth,
//           },
//           {
//             type: "amount",
//             value: utilityService.modifynegativeCurrencyFormat(grandOlder),
//             amount: grandOlder,
//           },
//         ];

//         for (let key in records) {
//           let dataArr = current[iterator];
//           let obj = [
//             { key: key },
//             { data: records[key] },
//             { total: [{ dataArr: dataArr }] },
//           ];
//           totalRecord.push(obj);
//           iterator += 1;
//         }


//         templateObject.records.set(totalRecord);
//         templateObject.grandrecords.set(grandval);

//         if (templateObject.records.get()) {
//           setTimeout(function () {
//             $("td a").each(function () {
//               if (
//                 $(this)
//                   .text()
//                   .indexOf("-" + Currency) >= 0
//               )
//                 $(this).addClass("text-danger");
//             });
//             $("td").each(function () {
//               if (
//                 $(this)
//                   .text()
//                   .indexOf("-" + Currency) >= 0
//               )
//                 $(this).addClass("text-danger");
//             });

//             $("td").each(function () {
//               let lineValue = $(this).first().text()[0];
//               if (lineValue != undefined) {
//                 if (lineValue.indexOf(Currency) >= 0)
//                   $(this).addClass("text-right");
//               }
//             });

//             $("td").each(function () {
//               if (
//                 $(this)
//                   .first()
//                   .text()
//                   .indexOf("-" + Currency) >= 0
//               )
//                 $(this).addClass("text-right");
//             });

//             $(".fullScreenSpin").css("display", "none");
//           }, 100);
//         }
//       } else {
//         let records = [];
//         let recordObj = {};
//         recordObj.Id = "";
//         recordObj.type = "";
//         recordObj.AccountName = " ";
//         recordObj.dataArr = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];

//         records.push(recordObj);
//         templateObject.records.set(records);

//         $(".fullScreenSpin").css("display", "none");
//         templateObject.grandrecords.set("");
//       }
//       LoadingOverlay.hide();
//     }
//   };

//   templateObject.getGeneralLedgerReports(
//     GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
//     GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
//     false
//   );

//   templateObject.setDateAs(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()))

//   templateObject.getDepartments = function () {
//     reportService.getDepartment().then(function (data) {
//       for (let i in data.tdeptclass) {
//         let deptrecordObj = {
//           id: data.tdeptclass[i].Id || " ",
//           department: data.tdeptclass[i].DeptClassName || " ",
//         };

//         deptrecords.push(deptrecordObj);
//         templateObject.deptrecords.set(deptrecords);
//       }
//     });
//   };
//   // templateObject.getAllProductData();
//   templateObject.getDepartments();

// });

Template.generalledger.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  templateObject.init_reset_data = function () {
    let reset_data = [];
    reset_data = [
      { index: 1, label: 'Account ID', class: 'colAccountID', active: true, display: true, width: "155" },
      { index: 2, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "110" },
      { index: 3, label: 'Account Number', class: 'colAccountNo', active: true, display: true, width: "85" },
      { index: 4, label: 'Accounts', class: 'colAccounts', active: false, display: true, width: "85" },
      { index: 5, label: 'Amount (Inc)', class: 'colAmountInc', active: false, display: true, width: "120" },
      { index: 6, label: 'Cheque Number', class: 'colChequeNumber', active: false, display: true, width: "85" },
      { index: 7, label: 'Department', class: 'colDepartment', active: false, display: true, width: "100" },
      { index: 8, label: 'Class ID', class: 'colClassID', active: false, display: true, width: "85" },
      { index: 9, label: 'Client Name', class: 'colProductDescription', active: false, display: true, width: "120" },
      { index: 12, label: 'Date', class: 'colDate', active: true, display: true, width: "85" },
      { index: 10, label: 'Credits (Ex)', class: 'colCreditEx', active: true, display: true, width: "85" },
      { index: 11, label: 'Credits (Inc)', class: 'colCreditInc', active: false, display: true, width: "85" },
      { index: 13, label: 'Debits (Ex)', class: 'colDebitsEx', active: true, display: true, width: "85" },
      { index: 14, label: 'Amount (Ex)', class: 'colAmountEx', active: true, display: true, width: "85" },
      { index: 15, label: 'Debits (Inc)', class: 'colDebitsInc', active: false, display: true, width: "85" },
      { index: 16, label: 'Details', class: 'colDetails', active: false, display: true, width: "85" },
      { index: 17, label: 'FixedAsset ID', class: 'colFixedAssetID', active: false, display: true, width: "85" },
      { index: 18, label: 'Global Ref', class: 'colGlobalRef', active: true, display: true, width: "85" },
      { index: 19, label: 'ID', class: 'colID', active: false, display: true, width: "50" },
      { index: 20, label: 'Memo', class: 'colMemo', active: false, display: true, width: "85" },
      { index: 21, label: 'Payment ID', class: 'colPaymentID', active: false, display: true, width: "85" },
      { index: 22, label: 'PrepaymentID', class: 'colPrepaymentID', active: false, display: true, width: "85" },
      { index: 23, label: 'Product Description', class: 'colCredit', active: true, display: true, width: "150" },
      { index: 24, label: 'Product ID', class: 'colProductID', active: false, display: true, width: "120" },
      { index: 25, label: 'Purchase Order ID', class: 'colPurchaseOrderID', active: true, display: true, width: "150" },
      { index: 26, label: 'Ref No', class: 'colRefNo', active: false, display: true, width: "85" },
      { index: 27, label: 'Rep Name', class: 'colRepName', active: true, display: true, width: "85" },
      { index: 28, label: 'Sale ID', class: 'colSaleID', active: false, display: true, width: "85" },
      { index: 29, label: 'Tax Code', class: 'colTaxCode', active: false, display: true, width: "150" },
      { index: 30, label: 'Tax Rate', class: 'colTaxRate', active: false, display: true, width: "85" },
      { index: 31, label: 'Type', class: 'colType', active: true, display: true, width: "85" },
    ];
    templateObject.generalledgerth.set(reset_data);
  }
  templateObject.init_reset_data();

  // await reportService.getBalanceSheetReport(dateAOsf) :

  // --------------------------------------------------------------------------------------------------
  templateObject.initDate = () => {
    Datehandler.initOneMonth();
  };
  templateObject.setDateAs = (dateFrom = null) => {
    templateObject.dateAsAt.set((dateFrom) ? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
  };
  templateObject.initDate();

  // let date = new Date();
  // templateObject.currentYear.set(date.getFullYear());
  // templateObject.nextYear.set(date.getFullYear() + 1);
  // let currentMonth = moment(date).format("DD/MM/YYYY");
  // templateObject.currentMonth.set(currentMonth);

  // templateObject.setDateAs(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()));

  templateObject.getGeneralLedgerData = async function (dateFrom, dateTo, ignoreDate) {

    templateObject.setDateAs(dateFrom);
    getVS1Data('TGeneralLedgerReport').then(function (dataObject) {
      if (dataObject.length == 0) {
        reportService.getGeneralLedgerDetailsData(dateFrom, dateTo, ignoreDate).then(async function (data) {
          await addVS1Data('TGeneralLedgerReport', JSON.stringify(data));
          templateObject.displayGeneralLedgerData(data);
        }).catch(function (err) {
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.displayGeneralLedgerData(data);
      }
    }).catch(function (err) {
      reportService.getGeneralLedgerDetailsData(dateFrom, dateTo, ignoreDate).then(async function (data) {
        await addVS1Data('TGeneralLedgerReport', JSON.stringify(data));
        templateObject.displayGeneralLedgerData(data);
      }).catch(function (err) {

      });
    });
  }

  templateObject.getGeneralLedgerData(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
  );
  templateObject.displayGeneralLedgerData = async function (data) {
    var splashArrayBalanceSheetReport = new Array();
    let deleteFilter = false;
    if (data.Params.Search.replace(/\s/g, "") == "") {
      deleteFilter = true;
    } else {
      deleteFilter = false;
    };

    for (let i = 0; i < data.tgeneralledgerreport.length; i++) {
      var dataList = [
        data.tgeneralledgerreport[i].ACCOUNTID || "",
        data.tgeneralledgerreport[i].ACCOUNTNAME || "",
        data.tgeneralledgerreport[i].ACCOUNTNUMBER || "",
        data.tgeneralledgerreport[i].ACCOUNTS || "",
        data.tgeneralledgerreport[i].AMOUNTINC || "",
        data.tgeneralledgerreport[i].CHEQUENUMBER || "",
        data.tgeneralledgerreport[i].CLASS || "",
        data.tgeneralledgerreport[i].CLASSID || "",
        data.tgeneralledgerreport[i]["CLIENT NAME"] || "",
        data.tgeneralledgerreport[i].DATE || "",
        data.tgeneralledgerreport[i].CREDITSEX || "",
        data.tgeneralledgerreport[i].CREDITSINC || "",
        data.tgeneralledgerreport[i].DEBITSEX || "",
        data.tgeneralledgerreport[i].AMOUNTEX || "",
        data.tgeneralledgerreport[i].DEBITSINC || "",
        data.tgeneralledgerreport[i].DETAILS || "",
        data.tgeneralledgerreport[i].FIXEDASSETID || "",
        data.tgeneralledgerreport[i].GLOBALREF || "",
        data.tgeneralledgerreport[i].ID || "",
        data.tgeneralledgerreport[i].MEMO || "",
        data.tgeneralledgerreport[i].PAYMENTID || "",
        data.tgeneralledgerreport[i].PREPAYMENTID || "",
        data.tgeneralledgerreport[i].PRODUCTDESCRIPTION || "",
        data.tgeneralledgerreport[i].PRODUCTNAME || "",
        data.tgeneralledgerreport[i].PURCHASEORDERID || "",
        data.tgeneralledgerreport[i].REFERENCENO || "",
        data.tgeneralledgerreport[i].REPNAME || "",
        data.tgeneralledgerreport[i].SALEID || "",
        data.tgeneralledgerreport[i].TAXCODE || "",
        data.tgeneralledgerreport[i].TAXRATE || "",
        data.tgeneralledgerreport[i].TYPE || "",

      ];
      splashArrayBalanceSheetReport.push(dataList);
    }
    //Xiao Jang fixed
    splashArrayBalanceSheetReport.sort(sortFunction);
    function sortFunction(a, b) {
      if (a[0] === b[0]) {
        return 0;
      } else {
        return (a[0] < b[0]) ? -1 : 1;
      }
    }
    let start = splashArrayBalanceSheetReport[0][0], credit = 0, debit = 0, total = 0;
    let accString = splashArrayBalanceSheetReport[0][0];
    let T_AccountName = splashArrayBalanceSheetReport[0][1];
    let balanceSheetReport = [];
    balanceSheetReport.push([
      splashArrayBalanceSheetReport[0][0],
      T_AccountName,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ]);
    for(let i = 0 ; i < splashArrayBalanceSheetReport.length ; i ++){
      if(start != splashArrayBalanceSheetReport[i][0]) {
        start = splashArrayBalanceSheetReport[i][0];
        credit = credit.toFixed(2);
        debit = debit.toFixed(2);
        total = total.toFixed(2);
        credit = credit >= 0 ? `<span class='text-primary fw-bold'>${credit}</span>` : `<span class='text-danger fw-bold'>${credit}</span>`;
        debit = debit >= 0 ? `<span class='text-primary fw-bold'>${debit}</span>` : `<span class='text-danger fw-bold'>${debit}</span>`;
        total = total >= 0 ? `<span class='text-primary fw-bold'>${total}</span>` : `<span class='text-danger fw-bold'>${total}</span>`;
        balanceSheetReport.push([
          splashArrayBalanceSheetReport[i-1][0],
          `Total ${T_AccountName}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          credit,
          "",
          debit,
          total,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ]);
        balanceSheetReport.push([
          splashArrayBalanceSheetReport[i][0],
          splashArrayBalanceSheetReport[i][1],
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ]);
        credit = 0, debit = 0, total = 0;
      }
      T_AccountName = splashArrayBalanceSheetReport[i][1];
      splashArrayBalanceSheetReport[i][1] = "";
      if(splashArrayBalanceSheetReport[i][10] != "" || splashArrayBalanceSheetReport[i][12] != "") {
        balanceSheetReport.push(splashArrayBalanceSheetReport[i]);
        let tmp;
        tmp = splashArrayBalanceSheetReport[i][10] - 0;
        credit += tmp; //credit
        splashArrayBalanceSheetReport[i][10] = (tmp >= 0) ? `<span class="text-primary">${tmp}</span>` : `<span class="text-danger">${tmp}</span>`;

        tmp = splashArrayBalanceSheetReport[i][12] - 0;
        debit += tmp; //debit
        splashArrayBalanceSheetReport[i][12] = (tmp >= 0) ? `<span class="text-primary">${tmp}</span>` : `<span class="text-danger">${tmp}</span>`;

        tmp = splashArrayBalanceSheetReport[i][13] - 0;
        total += tmp; //total
        splashArrayBalanceSheetReport[i][13] = (tmp >= 0) ? `<span class="text-primary">${tmp}</span>` : `<span class="text-danger">${tmp}</span>`;
      }
    }
    // templateObject.transactiondatatablerecords.set(splashArrayBalanceSheetReport);
    templateObject.transactiondatatablerecords.set(balanceSheetReport);
    splashArrayBalanceSheetReport = balanceSheetReport;
    if (templateObject.transactiondatatablerecords.get()) {
      setTimeout(function () {
        MakeNegative();
      }, 100);
    }

    setTimeout(function () {
      $('#tblgeneralledger').DataTable({
        data: splashArrayBalanceSheetReport,
        searching: false,
        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        columnDefs: [
          {
            targets: 0,
            className: "colAccountID hiddenColumn",
          },
          {
            targets: 1,
            className: "colAccountName"
          },
          {
            targets: 2,
            className: "colAccountNo"
          },
          {
            targets: 3,
            className: "colAccounts hiddenColumn",
          },

          {
            targets: 4,
            className: "colAmountInc hiddenColumn",
          },
          {
            targets: 5,
            className: "colChequeNumber hiddenColumn",
          },
          {
            targets: 6,
            className: "colDepartment hiddenColumn",
          },
          {
            targets: 7,
            className: "colClassID hiddenColumn",
          },
          {
            targets: 8,
            className: "colProductDescription hiddenColumn",
          },
          {
            targets: 9,
            className: "colDate",
          },
          {
            targets: 10,
            className: "colCreditEx",
          },
          {
            targets: 11,
            className: "colCreditInc hiddenColumn",
          },
          {
            targets: 12,
            className: "colDebitsEx",
          },
          {
            targets: 13,
            className: "colAmountEx",
          },
          {
            targets: 14,
            className: "colDebitsInc hiddenColumn",
          },
          {
            targets: 15,
            className: "colDetails hiddenColumn",
          },
          {
            targets: 16,
            className: "colFixedAssetID hiddenColumn",
          },
          {
            targets: 17,
            className: "colGlobalRef hiddenColumn",
          },
          {
            targets: 18,
            className: "colID hiddenColumn",
          },
          {
            targets: 19,
            className: "colMemo hiddenColumn",
          },
          {
            targets: 20,
            className: "colPaymentID hiddenColumn",
          },
          {
            targets: 21,
            className: "colPrepaymentID hiddenColumn",
          },
          {
            targets: 22,
            className: "colCredit hiddenColumn",
          },
          {
            targets: 23,
            className: "colProductID hiddenColumn",
          },
          {
            targets: 24,
            className: "colPurchaseOrderID hiddenColumn",
          },
          {
            targets: 25,
            className: "colRefNo hiddenColumn",
          },
          {
            targets: 26,
            className: "colRepName hiddenColumn",
          },
          {
            targets: 27,
            className: "colSaleID hiddenColumn",
          },
          {
            targets: 28,
            className: "colTaxCode hiddenColumn",
          },
          {
            targets: 29,
            className: "colTaxRate hiddenColumn",
          },
          {
            targets: 30,
            className: "colType hiddenColumn",
          },
        ],
        select: true,
        destroy: true,
        colReorder: true,
        pageLength: initialDatatableLoad,
        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
        info: true,
        // responsive: true,
        //"order": [[1, "asc"]],
        action: function () {
          $('#' + currenttablename).DataTable().ajax.reload();
        },

      }).on('page', function () {
        setTimeout(function () {
          MakeNegative();
        }, 100);
      }).on('column-reorder', function () {

      }).on('length.dt', function (e, settings, len) {

        $(".fullScreenSpin").css("display", "inline-block");
        let dataLenght = settings._iDisplayLength;
        if (dataLenght == -1) {
          if (settings.fnRecordsDisplay() > initialDatatableLoad) {
            $(".fullScreenSpin").css("display", "none");
          } else {
            $(".fullScreenSpin").css("display", "none");
          }
        } else {
          $(".fullScreenSpin").css("display", "none");
        }
        setTimeout(function () {
          MakeNegative();
        }, 100);
      });
      $(".fullScreenSpin").css("display", "none");
    }, 0);

    $('div.dataTables_filter input').addClass('form-control form-control-sm');
  }


  // ------------------------------------------------------------------------------------------------------
  $("#tblgeneralledger tbody").on("click", "tr", function () {
    var listData = $(this).closest("tr").children('td').eq(8).text();
    var checkDeleted = $(this).closest("tr").find(".colStatus").text() || "";

    if (listData) {
      if (checkDeleted == "Deleted") {
        swal("You Cannot View This Transaction", "Because It Has Been Deleted", "info");
      } else {
        FlowRouter.go("/journalentrycard?id=" + listData);
      }
    }
  });


  LoadingOverlay.hide();
});


Template.generalledger.events({

  'click .chkDatatable': function (event) {
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
    if ($(event.target).is(':checked')) {
      $('.' + columnDataValue).addClass('showColumn');
      $('.' + columnDataValue).removeClass('hiddenColumn');
    } else {
      $('.' + columnDataValue).addClass('hiddenColumn');
      $('.' + columnDataValue).removeClass('showColumn');
    }
  },

  'click .btnOpenReportSettings': () => {
    let templateObject = Template.instance();
    // let currenttranstablename = templateObject.data.tablename||";
    $(`thead tr th`).each(function (index) {
      var $tblrow = $(this);
      var colWidth = $tblrow.width() || 0;
      var colthClass = $tblrow.attr('data-class') || "";
      $('.rngRange' + colthClass).val(colWidth);
    });
    $('.' + templateObject.data.tablename + '_Modal').modal('toggle');
  },
  'change .custom-range': async function (event) {
    //   const tableHandler = new TableHandler();
    let range = $(event.target).val() || 0;
    let colClassName = $(event.target).attr("valueclass");
    await $('.' + colClassName).css('width', range);
    //   await $('.colAccountTree').css('width', range);
    $('.dataTable').resizable();
  },
  "click .currency-modal-save": (e) => {
    //$(e.currentTarget).parentsUntil(".modal").modal("hide");
    LoadingOverlay.show();

    let templateObject = Template.instance();

    // Get all currency list
    let _currencyList = templateObject.currencyList.get();

    // Get all selected currencies
    const currencySelected = $(".currency-selector-js:checked");
    let _currencySelectedList = [];
    if (currencySelected.length > 0) {
      $.each(currencySelected, (index, e) => {
        const sellRate = $(e).attr("sell-rate");
        const buyRate = $(e).attr("buy-rate");
        const currencyCode = $(e).attr("currency");
        const currencyId = $(e).attr("currency-id");
        let _currency = _currencyList.find((c) => c.id == currencyId);
        _currency.active = true;
        _currencySelectedList.push(_currency);
      });
    } else {
      let _currency = _currencyList.find((c) => c.code == defaultCurrencyCode);
      _currency.active = true;
      _currencySelectedList.push(_currency);
    }



    _currencyList.forEach((value, index) => {
      if (_currencySelectedList.some((c) => c.id == _currencyList[index].id)) {
        _currencyList[index].active = _currencySelectedList.find(
            (c) => c.id == _currencyList[index].id
        ).active;
      } else {
        _currencyList[index].active = false;
      }
    });

    _currencyList = _currencyList.sort((a, b) => {
      if (a.code == defaultCurrencyCode) {
        return -1;
      }
      return 1;
    });

    // templateObject.activeCurrencyList.set(_activeCurrencyList);
    templateObject.currencyList.set(_currencyList);

    LoadingOverlay.hide();
  },
  // "click td": async function (event) {
  //   let accountName = $(event.target).parent().children('td').eq(1).text();
  //   // let toDate = moment($("#dateTo").val())
  //   //   .clone()
  //   //   .endOf("month")
  //   //   .format("YYYY-MM-DD");
  //   // let fromDate = moment($("#dateFrom").val())
  //   //   .clone()
  //   //   .startOf("year")
  //   //   .format("YYYY-MM-DD");
  //   let toDate = $("#dateTo").val().replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$2-$1");
  //   let fromDate = $("#dateFrom").val().replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$2-$1");
  //   //Session.setPersistent('showHeader',true);
  //   await clearData("TAccountRunningBalanceReport");
  //   window.open(
  //     "/balancetransactionlist?accountName=" +
  //     accountName +
  //     "&toDate=" +
  //     toDate +
  //     "&fromDate=" +
  //     fromDate +
  //     "&isTabItem=" +
  //     false,
  //     "_self"
  //   );
  // },

  "click #dropdownDateRang": function (e) {
    let dateRangeID = e.target.id;
    $("#btnSltDateRange").addClass("selectedDateRangeBtnMod");
    $("#selectedDateRange").show();
    if (dateRangeID == "thisMonth") {
      document.getElementById("selectedDateRange").value = "This Month";
    } else if (dateRangeID == "thisQuarter") {
      document.getElementById("selectedDateRange").value = "This Quarter";
    } else if (dateRangeID == "thisFinYear") {
      document.getElementById("selectedDateRange").value =
          "This Financial Year";
    } else if (dateRangeID == "lastMonth") {
      document.getElementById("selectedDateRange").value = "Last Month";
    } else if (dateRangeID == "lastQuarter") {
      document.getElementById("selectedDateRange").value = "Last Quarter";
    } else if (dateRangeID == "lastFinYear") {
      document.getElementById("selectedDateRange").value =
          "Last Financial Year";
    } else if (dateRangeID == "monthToDate") {
      document.getElementById("selectedDateRange").value = "Month to Date";
    } else if (dateRangeID == "quarterToDate") {
      document.getElementById("selectedDateRange").value = "Quarter to Date";
    } else if (dateRangeID == "finYearToDate") {
      document.getElementById("selectedDateRange").value = "Year to Date";
    }
  },
  "click #ignoreDate": (e, templateObject) => {
    localStorage.setItem("VS1GeneralLedger_Report", "");
    templateObject.getGeneralLedgerReports(
        null,
        null,
        true
    )
  },
  "change #dateTo, change #dateFrom": (e) => {
    let templateObject = Template.instance();
    localStorage.setItem("VS1GeneralLedger_Report", "");
    templateObject.getGeneralLedgerReports(
        GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
        GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
        false
    )
  },
  ...Datehandler.getDateRangeEvents(),
  // "change #dateTo": function () {
  //   let templateObject = Template.instance();
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   $("#dateFrom").attr("readonly", false);
  //   $("#dateTo").attr("readonly", false);
  //   templateObject.records.set("");
  //   templateObject.grandrecords.set("");
  //   setTimeout(function () {
  //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
  //     var dateTo = new Date($("#dateTo").datepicker("getDate"));

  //     let formatDateFrom =
  //       dateFrom.getFullYear() +
  //       "-" +
  //       (dateFrom.getMonth() + 1) +
  //       "-" +
  //       dateFrom.getDate();
  //     let formatDateTo =
  //       dateTo.getFullYear() +
  //       "-" +
  //       (dateTo.getMonth() + 1) +
  //       "-" +
  //       dateTo.getDate();

  //     //templateObject.getGeneralLedgerReports(formatDateFrom,formatDateTo,false);
  //     var formatDate =
  //       dateTo.getDate() +
  //       "/" +
  //       (dateTo.getMonth() + 1) +
  //       "/" +
  //       dateTo.getFullYear();
  //     //templateObject.dateAsAt.set(formatDate);
  //     if (
  //       $("#dateFrom").val().replace(/\s/g, "") == "" &&
  //       $("#dateFrom").val().replace(/\s/g, "") == ""
  //     ) {
  //       templateObject.getGeneralLedgerReports("", "", true);
  //       templateObject.dateAsAt.set("Current Date");
  //     } else {
  //       templateObject.getGeneralLedgerReports(
  //         formatDateFrom,
  //         formatDateTo,
  //         false
  //       );
  //       templateObject.dateAsAt.set(formatDate);
  //     }
  //   }, 500);
  // },
  // "change #dateFrom": function () {
  //   let templateObject = Template.instance();
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   $("#dateFrom").attr("readonly", false);
  //   $("#dateTo").attr("readonly", false);
  //   templateObject.records.set("");
  //   templateObject.grandrecords.set("");
  //   setTimeout(function () {
  //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
  //     var dateTo = new Date($("#dateTo").datepicker("getDate"));

  //     let formatDateFrom =
  //       dateFrom.getFullYear() +
  //       "-" +
  //       (dateFrom.getMonth() + 1) +
  //       "-" +
  //       dateFrom.getDate();
  //     let formatDateTo =
  //       dateTo.getFullYear() +
  //       "-" +
  //       (dateTo.getMonth() + 1) +
  //       "-" +
  //       dateTo.getDate();

  //     //templateObject.getGeneralLedgerReports(formatDateFrom,formatDateTo,false);
  //     var formatDate =
  //       dateTo.getDate() +
  //       "/" +
  //       (dateTo.getMonth() + 1) +
  //       "/" +
  //       dateTo.getFullYear();
  //     //templateObject.dateAsAt.set(formatDate);
  //     if (
  //       $("#dateFrom").val().replace(/\s/g, "") == "" &&
  //       $("#dateFrom").val().replace(/\s/g, "") == ""
  //     ) {
  //       templateObject.getGeneralLedgerReports("", "", true);
  //       templateObject.dateAsAt.set("Current Date");
  //     } else {
  //       templateObject.getGeneralLedgerReports(
  //         formatDateFrom,
  //         formatDateTo,
  //         false
  //       );
  //       templateObject.dateAsAt.set(formatDate);
  //     }
  //   }, 500);
  // },
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1GeneralLedger_Report", "");
    Meteor._reload.reload();
  },
  // "click td a": function (event) {
  //   let redirectid = $(event.target).closest("tr").attr("id");

  //   let transactiontype = $(event.target).closest("tr").attr("class");

  //   if (redirectid && transactiontype) {
  //     if (transactiontype === "Bill") {
  //       window.open("/billcard?id=" + redirectid, "_self");
  //     } else if (transactiontype === "PO") {
  //       window.open("/purchaseordercard?id=" + redirectid, "_self");
  //     } else if (transactiontype === "Credit") {
  //       window.open("/creditcard?id=" + redirectid, "_self");
  //     } else if (transactiontype === "Supplier Payment") {
  //       window.open("/supplierpaymentcard?id=" + redirectid, "_self");
  //     }
  //   }
  //   // window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
  // },
  // "click .btnPrintReport": function (event) {
  //   $('.fullScreenSpin').css('display', 'inline-block')
  //   playPrintAudio();
  //   setTimeout(async function () {

  //     let targetElement = document.getElementsByClassName('printReport')[0];
  //     targetElement.style.width = "210mm";
  //     targetElement.style.backgroundColor = "#ffffff";
  //     targetElement.style.padding = "20px";
  //     targetElement.style.height = "fit-content";
  //     targetElement.style.fontSize = "13.33px";
  //     targetElement.style.color = "#000000";
  //     targetElement.style.overflowX = "visible";
  //     let targetTds = $(targetElement).find('.table-responsive #tableExportDetailDiv.table td');
  //     let targetThs = $(targetElement).find('.table-responsive #tableExportDetailDiv.table th');
  //     for (let k = 0; k < targetTds.length; k++) {
  //       $(targetTds[k]).attr('style', 'min-width: 0px !important')
  //     }
  //     for (let j = 0; j < targetThs.length; j++) {
  //       $(targetThs[j]).attr('style', 'min-width: 0px !important')
  //     }

  //     let docTitle = "General Ledger.pdf";


  //     var opt = {
  //       margin: 0,
  //       filename: docTitle,
  //       image: {
  //         type: 'jpeg',
  //         quality: 0.98
  //       },
  //       html2canvas: {
  //         scale: 2
  //       },
  //       jsPDF: {
  //         unit: 'in',
  //         format: 'a4',
  //         orientation: 'portrait'
  //       }
  //     };
  //     let source = targetElement;

  //     async function getAttachments() {
  //       return new Promise(async (resolve, reject) => {
  //         html2pdf().set(opt).from(source).toPdf().output('datauristring').then(function (dataObject) {
  //           let pdfObject = "";
  //           let base64data = dataObject.split(',')[1];
  //           pdfObject = {
  //             filename: docTitle,
  //             content: base64data,
  //             encoding: 'base64'
  //           }
  //           let attachments = [];
  //           attachments.push(pdfObject);
  //           resolve(attachments)
  //         })
  //       })
  //     }

  //     async function checkBasedOnType() {
  //       return new Promise(async (resolve, reject) => {
  //         let values = [];
  //         let basedOnTypeStorages = Object.keys(localStorage);
  //         basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
  //           let employeeId = storage.split("_")[2];
  //           return (
  //             // storage.includes("BasedOnType_") && employeeId == localStorage.getItem("mySessionEmployeeLoggedID")
  //             storage.includes("BasedOnType_")
  //           );
  //         });
  //         let i = basedOnTypeStorages.length;
  //         if (i > 0) {
  //           while (i--) {
  //             values.push(localStorage.getItem(basedOnTypeStorages[i]));
  //           }
  //         }
  //         for (let j = 0; j < values.length; j++) {
  //           let value = values[j];
  //           let reportData = JSON.parse(value);
  //           reportData.HostURL = $(location).attr("protocal")
  //             ? $(location).attr("protocal") + "://" + $(location).attr("hostname")
  //             : "http://" + $(location).attr("hostname");
  //           if (reportData.BasedOnType.includes("P")) {
  //             if (reportData.FormID == 1) {
  //               let formIds = reportData.FormIDs.split(",");
  //               if (formIds.includes("225")) {
  //                 reportData.FormID = 225;
  //                 reportData.attachments = await getAttachments()
  //                 Meteor.call("sendNormalEmail", reportData);
  //                 resolve()
  //               }
  //             } else {
  //               if (reportData.FormID == 225) {
  //                 reportData.attachments = await getAttachments();
  //                 Meteor.call("sendNormalEmail", reportData);
  //                 resolve()
  //               }
  //             }
  //           }
  //           if (j == values.length - 1) { resolve() }
  //         }
  //       })
  //     }
  //     await checkBasedOnType();

  //     $('.fullScreenSpin').css('display', 'none');
  //     document.title = "General Ledger Report";
  //     $(".printReport").print({
  //       title: "General Ledger | " + loggedCompany,
  //       noPrintSelector: ".addSummaryEditor",
  //     });
  //     targetElement.style.width = "100%";
  //     targetElement.style.backgroundColor = "#ffffff";
  //     targetElement.style.padding = "0px";
  //     targetElement.style.fontSize = "1rem";
  //   }, delayTimeAfterSound);
  // },
  "click .btnPrintReport": function (event) {
    playPrintAudio();
    setTimeout(function () {
      $("a").attr("href", "/");
      document.title = "Balance Sheet Report";
      $(".printReport").print({
        title: document.title + " | Balance Sheet | " + loggedCompany,
        noPrintSelector: ".addSummaryEditor",
        mediaPrint: false,
      });

      setTimeout(function () {
        $("a").attr("href", "#");
      }, 100);
    }, delayTimeAfterSound);
  },
  "click .btnExportReport": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let utilityService = new UtilityService();
    let templateObject = Template.instance();
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));

    let formatDateFrom =
        dateFrom.getFullYear() +
        "-" +
        (dateFrom.getMonth() + 1) +
        "-" +
        dateFrom.getDate();
    let formatDateTo =
        dateTo.getFullYear() +
        "-" +
        (dateTo.getMonth() + 1) +
        "-" +
        dateTo.getDate();

    const filename = loggedCompany + "-General Ledger" + ".csv";
    utilityService.exportReportToCsvTable("tblgeneralledger", filename, "csv");
    let rows = [];
    // reportService.getGeneralLedgerDetailsData(formatDateFrom,formatDateTo,false).then(function (data) {
    //     if(data.tgeneralledgerreport){
    //         rows[0] = ['Account Name','Type', 'No.', 'Client Name', 'Memo', 'Amount', 'Debits', 'Credit'];
    //         data.tgeneralledgerreport.forEach(function (e, i) {
    //             rows.push([
    //               data.tgeneralledgerreport[i].ACCOUNTNAME,
    //               data.tgeneralledgerreport[i].TYPE,
    //               data.tgeneralledgerreport[i].ID,
    //               data.tgeneralledgerreport[i]["CLIENT NAME"],
    //               data.tgeneralledgerreport[i].MEMO,
    //               data.tgeneralledgerreport[i].DATE !=''? moment(data.tgeneralledgerreport[i].DATE).format("DD/MM/YYYY"): data.tgeneralledgerreport[i].DATE,
    //               utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i].AMOUNTINC) || '0.00',
    //               utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i].DEBITSEX) || '0.00',
    //               utilityService.modifynegativeCurrencyFormat(data.tgeneralledgerreport[i].CREDITSEX) || '0.00']);
    //         });
    //         setTimeout(function () {
    //             utilityService.exportReportToCsv(rows, filename, 'xls');
    //             $('.fullScreenSpin').css('display','none');
    //         }, 1000);
    //     }
    //
    // });
  },
  "keyup #myInputSearch": function (event) {
    $(".table tbody tr").show();
    let searchItem = $(event.target).val();
    if (searchItem != "") {
      var value = searchItem.toLowerCase();
      $(".table tbody tr").each(function () {
        var found = "false";
        $(this).each(function () {
          if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            found = "true";
          }
        });
        if (found == "true") {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    } else {
      $(".table tbody tr").show();
    }
  },
  "blur #myInputSearch": function (event) {
    $(".table tbody tr").show();
    let searchItem = $(event.target).val();
    if (searchItem != "") {
      var value = searchItem.toLowerCase();
      $(".table tbody tr").each(function () {
        var found = "false";
        $(this).each(function () {
          if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            found = "true";
          }
        });
        if (found == "true") {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    } else {
      $(".table tbody tr").show();
    }
  },
  ...FxGlobalFunctions.getEvents(),
  "click [href='#noInfoFound']": function () {
    swal({
      title: 'Information',
      text: "No further information available on this column",
      type: 'warning',
      confirmButtonText: 'Ok'
    })
  },
});

Template.generalledger.helpers({
  convertAmount: (amount, currencyData) => {
    let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory


    if (!amount || amount.trim() == "") {
      return "";
    }
    if (currencyData.code == defaultCurrencyCode) {
      // default currency
      return amount;
    }

    amount = utilityService.convertSubstringParseFloat(amount); // This will remove all currency symbol

    // Lets remove the minus character
    const isMinus = amount < 0;
    if (isMinus == true) amount = amount * -1; // make it positive for now

    // // get default currency symbol
    // let _defaultCurrency = currencyList.filter(
    //   (a) => a.Code == defaultCurrencyCode
    // )[0];

    // amount = amount.replace(_defaultCurrency.symbol, "");


    // amount =
    //   isNaN(amount) == true
    //     ? parseFloat(amount.substring(1))
    //     : parseFloat(amount);



    // Get the selected date
    let dateTo = $("#dateTo").val();
    const day = dateTo.split("/")[0];
    const m = dateTo.split("/")[1];
    const y = dateTo.split("/")[2];
    dateTo = new Date(y, m, day);
    dateTo.setMonth(dateTo.getMonth() - 1); // remove one month (because we added one before)


    // Filter by currency code
    currencyList = currencyList.filter((a) => a.Code == currencyData.code);

    // Sort by the closest date
    currencyList = currencyList.sort((a, b) => {
      a = GlobalFunctions.timestampToDate(a.MsTimeStamp);
      a.setHours(0);
      a.setMinutes(0);
      a.setSeconds(0);

      b = GlobalFunctions.timestampToDate(b.MsTimeStamp);
      b.setHours(0);
      b.setMinutes(0);
      b.setSeconds(0);

      var distancea = Math.abs(dateTo - a);
      var distanceb = Math.abs(dateTo - b);
      return distancea - distanceb; // sort a before b when the distance is smaller

      // const adate= new Date(a.MsTimeStamp);
      // const bdate = new Date(b.MsTimeStamp);

      // if(adate < bdate) {
      //   return 1;
      // }
      // return -1;
    });

    const [firstElem] = currencyList; // Get the firest element of the array which is the closest to that date



    let rate = currencyData.code == defaultCurrencyCode ? 1 : firstElem.BuyRate; // Must used from tcurrecyhistory




    amount = parseFloat(amount * rate); // Multiply by the rate
    amount = Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }); // Add commas

    let convertedAmount =
        isMinus == true
            ? `- ${currencyData.symbol} ${amount}`
            : `${currencyData.symbol} ${amount}`;


    return convertedAmount;
  },
  count: (array) => {
    return array.length;
  },
  countActive: (array) => {
    if (array.length == 0) {
      return 0;
    }
    let activeArray = array.filter((c) => c.active == true);
    return activeArray.length;
  },
  currencyColumnSize: (count) => {
    let siz = count > 0 ? count * 130 : 90;
    return siz;          //column size auto per 85px
  },
  isNegativeAmount(amount) {
    if (Math.sign(amount) === -1) {

      return true;
    }
    return false;
  },
  redirectionType(item) {
    if (item.type === 'PO') {
      return '/purchaseordercard?id=' + item.Id;
    } else if (item.type === 'Invoice') {
      return '/invoicecard?id=' + item.saleId;
    } else if (item.type === 'Bill') {
      return '/billcard?id=' + item.Id;
    } else if (item.type === 'Cheque') {
      return '/chequecard?id=' + item.Id;
    } else if (item.type === 'Un-Invoiced PO') {
      return '/purchaseordercard?id=' + item.Id;
    } else if (item.type === 'Supplier Payment') {
      return '/supplierpaymentcard?id=' + item.paymentId;
    } else if (item.type === 'Customer Payment') {
      return '/paymentcard?id=' + item.paymentId;
    } else if (item.type === 'Refund') {
      return 'refundcard?id=' + item.saleId;
    } else if (item.type === 'Closing Date Summary') {
      return '#noInfoFound';
    } else if (item.type === 'Stock Transfer') {
      return '#noInfoFound';
    } else if (item.type === 'Stock Adjustment') {
      return '/stockadjustmentcard?id=' + item.paymentId;
    } else if (item.type === 'Fixed Asset Depreciation') {
      return '#noInfoFound';
    } else if (item.type === 'Cash Sale') {
      return '#noInfoFound';
    } else if (item.type === 'Journal Entry') {
      return '#noInfoFound';
    } else if (item.type === 'Payroll Accrued Leave') {
      return '#noInfoFound';
    } else if (item.type === 'Payroll Nett Wages') {
      return '#noInfoFound';
    } else if (item.type === 'Payroll PAYG Tax') {
      return '#noInfoFound';
    } else if (item.type === 'Payroll Superannuation') {
      return '#noInfoFound';
    } else {
      return '#noInfoFound';
    }
  },
  isOnlyDefaultActive() {
    const array = Template.instance().currencyList.get();
    if (array.length == 0) {
      return false;
    }
    let activeArray = array.filter((c) => c.active == true);

    if (activeArray.length == 1) {

      if (activeArray[0].code == defaultCurrencyCode) {
        return !true;
      } else {
        return !false;
      }
    } else {
      return !false;
    }
  },
  isCurrencyListActive() {
    const array = Template.instance().currencyList.get();
    let activeArray = array.filter((c) => c.active == true);

    return activeArray.length > 0;
  },
  isObject(variable) {
    return typeof variable === "object" && variable !== null;
  },
  transactiondatatablerecords: () => {
    return Template.instance().transactiondatatablerecords.get();
  },

  generalledgerth: () => {
    return Template.instance().generalledgerth.get();
  },

  grandrecords: () => {
    return Template.instance().grandrecords.get();
  },
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  companyname: () => {
    return loggedCompany;
  },
  deptrecords: () => {
    return Template.instance()
        .deptrecords.get()
    // .sort(function (a, b) {
    //   if (a.department == "NA") {
    //     return 1;
    //   } else if (b.department == "NA") {
    //     return -1;
    //   }
    //   return a.department.toUpperCase() > b.department.toUpperCase() ? 1 : -1;
    // });
  },
});
Template.registerHelper("equals", function (a, b) {
  return a === b;
});

Template.registerHelper("notEquals", function (a, b) {
  return a != b;
});

Template.registerHelper("containsequals", function (a, b) {
  return a.indexOf(b) >= 0;
});
