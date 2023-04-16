import {ReportService} from "../report-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js'
import GlobalFunctions from "../../GlobalFunctions";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import Datehandler from "../../DateHandler";

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './newagedpayables.html';
import '../reportcardtemp/reportcard.js'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


let _ = require('lodash');

let sideBarService = new SideBarService();
let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();

let defaultCurrencyCode = CountryAbbr;


Template.newagedpayables.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.transactiondatatablerecords = new ReactiveVar([]);
    templateObject.grandrecords = new ReactiveVar();
    templateObject.dateAsAt = new ReactiveVar();
    templateObject.deptrecords = new ReactiveVar();
    templateObject.agedpayablesth = new ReactiveVar([]);
    FxGlobalFunctions.initVars(templateObject);
    templateObject.reportOptions = new ReactiveVar();
    templateObject.displaysettings = new ReactiveVar();
    let reset_data = [
        { index: 0, label: '#', class:'colLineId', active: false, display: true, width: '0'},
        { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "300" },
        { index: 2, label: 'Type', class: 'colType', active: true, display: true, width: "100" },
        { index: 3, label: 'PO Number', class: 'colPONumber', active: true, display: true, width: "100" },
        { index: 4, label: 'Due Date', class: 'colDueDate', active: true, display: true, width: "100" },
        { index: 5, label: 'Amount Due', class: 'colAmountDue', active: true, display: true, width: "100", calc: true },
        { index: 6, label: 'Current', class: 'colCurrent', active: true, display: true, width: "100", calc: true },
        { index: 7, label: '1-30 Days', class: 'col130Days', active: true, display: true, width: "100", calc: true },
        { index: 8, label: '30-60 Days', class: 'col3060Days', active: true, display: true, width: "100", calc: true },
        { index: 9, label: '60-90 Days', class: 'col6090Days', active: true, display: true, width: "100", calc: true },
        { index: 10, label: '> 90 Days', class: 'col90Days', active: true, display: true, width: "100", calc: true },
    ]
    templateObject.displaysettings.set(reset_data);

    templateObject.getReportDataRecord = function(data) {
        var dataList = [];
        if(data!='') {
            dataList =  [
                data.Name || "",
                data.Type || "",
                data.PONumber || "",
                moment(data.DueDate).format('DD/MM/YYYY') || "",
                data.AmountDue || 0,
                data.Current || 0,
                data["30Days"] || 0,
                data["60Days"] || 0,
                data["90Days"] || 0,
                data["120Days"] || 0,
            ];
        }else {
            dataList = [
                "", "", "", "", 0, 0, 0, 0, 0, 0, 
            ]
        }
        return dataList;
    }

});

Template.newagedpayables.onRendered(() => {
  // const templateObject = Template.instance();
  // LoadingOverlay.show();

  // templateObject.init_reset_data = function () {
  //   let reset_data = [];
  
  // }
  // templateObject.init_reset_data();

  // await reportService.getBalanceSheetReport(dateAOsf) :

  // --------------------------------------------------------------------------------------------------
  // templateObject.initDate = () => {
  //   Datehandler.initOneMonth();
  // };
  // templateObject.setDateAs = (dateFrom = null) => {
  //   templateObject.dateAsAt.set((dateFrom) ? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
  // };
  // templateObject.initDate();

  // let date = new Date();
  // templateObject.currentYear.set(date.getFullYear());
  // templateObject.nextYear.set(date.getFullYear() + 1);
  // let currentMonth = moment(date).format("DD/MM/YYYY");
  // templateObject.currentMonth.set(currentMonth);

  // templateObject.setDateAs(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()));

    // let currenctURL = FlowRouter.current().queryParams;
    // let contactName = FlowRouter.current().queryParams.contact ||'';
    // let contactID = FlowRouter.current().queryParams.contactid ||'';

  // templateObject.getAgedPayablesData = async function (dateFrom, dateTo, ignoreDate, contactID) {

  //   templateObject.setDateAs(dateFrom);
  //   getVS1Data('TAPReport').then(function (dataObject) {
  //     if (dataObject.length == 0) {
  //       sideBarService.getTAPReportPage(dateFrom, dateTo, ignoreDate,contactID).then(async function (data) {
  //         await addVS1Data('TAPReport', JSON.stringify(data));
  //         templateObject.displayAgedPayablesData(data);
  //       }).catch(function (err) {
  //       });
  //     } else {
  //       let data = JSON.parse(dataObject[0].data);
  //       templateObject.displayAgedPayablesData(data);
  //     }
  //   }).catch(function (err) {
  //     sideBarService.getTAPReportPage(dateFrom, dateTo, ignoreDate,contactID).then(async function (data) {
  //       await addVS1Data('TAPReport', JSON.stringify(data));
  //       templateObject.displayAgedPayablesData(data);
  //     }).catch(function (err) {

  //     });
  //   });
  // }
  // let url = FlowRouter.current().path;
  // if (url.indexOf("?dateFrom") > 0) {
  //   url = new URL(window.location.href);
  //   var getDateFrom = url.searchParams.get("dateFrom");
  //   var getLoadDate = url.searchParams.get("dateTo");
  //   if( typeof getDateFrom === undefined || getDateFrom == "" || getDateFrom === null){
  //     let currentUrl = FlowRouter.current().queryParams;
  //     getDateFrom = currentUrl.dateFrom
  //     getLoadDate = currentUrl.dateTo
  //   }
  //   $("#dateFrom").datepicker('setDate', moment(getDateFrom).format('DD/MM/YYYY'));
  //   $("#dateTo").datepicker('setDate', moment(getLoadDate).format('DD/MM/YYYY'));
  // }

  // templateObject.getAgedPayablesData(
  //   GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
  //   GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
  //   false
  // );
  // templateObject.displayAgedPayablesData = async function (data) {
  //   var splashArrayAgedPayablesReport = new Array();
  //   let deleteFilter = false;
  //   if (data.Params.Search.replace(/\s/g, "") == "") {
  //     deleteFilter = true;
  //   } else {
  //     deleteFilter = false;
  //   };
  //   for (let i = 0; i < data.tapreport.length; i++) {
  //     var dataList = [
  //         data.tapreport[i].Name || "",
  //         data.tapreport[i].Type || "",
  //         data.tapreport[i].PONumber || "",
  //         data.tapreport[i].DueDate || "",
  //         data.tapreport[i].AmountDue || 0,
  //         data.tapreport[i].Current || 0,
  //         data.tapreport[i]["30Days"] || 0,
  //         data.tapreport[i]["60Days"] || 0,
  //         data.tapreport[i]["90Days"] || 0,
  //         data.tapreport[i]["120Days"] || 0,
  //     ];
  //     splashArrayAgedPayablesReport.push(dataList);
  //   }
  //     splashArrayAgedPayablesReport.sort(GlobalFunctions.sortFunction);

  //     let start;
  //     if(splashArrayAgedPayablesReport.length != 0) start = splashArrayAgedPayablesReport[0][0] || '';
  //     let sum, totalSum;
  //     sum = new Array(6);
  //     totalSum = new Array(6);

  //     let T_AccountName = start;
  //     let agedPayableList = [];
  //     agedPayableList.push([
  //         GlobalFunctions.generateSpan(T_AccountName, "table-cells text-bold"),
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         ""
  //     ]);
  //     let j;
  //     for(j = 0 ; j < 6; j ++)  sum[j] = 0, totalSum[j] = 0;
  //     for(let i = 0 ; i < splashArrayAgedPayablesReport.length ; i ++){
  //         if(start != splashArrayAgedPayablesReport[i][0]) {
  //             start = splashArrayAgedPayablesReport[i][0];
  //             for(j = 0 ; j < 6; j ++){
  //                 totalSum[j] += (sum[j] - 0);
  //                 sum[j] = sum[j] >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(sum[j]), "table-cells text-bold", "text-right listhr") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(sum[j]), "text-danger text-bold", "text-right listhr");
  //             }
  //             agedPayableList.push([
  //                 GlobalFunctions.generateSpan(`Total ${T_AccountName}`, "table-cells text-bold", "listhr"),
  //                 GlobalFunctions.generateSpan("","","listhr"),
  //                 GlobalFunctions.generateSpan("","","listhr"),
  //                 GlobalFunctions.generateSpan("","","listhr"),
  //                 sum[0],
  //                 sum[1],
  //                 sum[2],
  //                 sum[3],
  //                 sum[4],
  //                 sum[5],
  //             ]);
  //             agedPayableList.push([
  //                 GlobalFunctions.generateSpan(splashArrayAgedPayablesReport[i][0], "table-cells text-bold"),
  //                 "",
  //                 "",
  //                 "",
  //                 "",
  //                 "",
  //                 "",
  //                 "",
  //                 "",
  //                 ""
  //             ]);
  //             for(j = 0 ; j < 6; j ++) sum[j] = 0;
  //         }
  //         T_AccountName = splashArrayAgedPayablesReport[i][0];
  //         splashArrayAgedPayablesReport[i][0] = "";
  //         splashArrayAgedPayablesReport[i][1] = GlobalFunctions.generateSpan(splashArrayAgedPayablesReport[i][1], 'text-primary');
  //         splashArrayAgedPayablesReport[i][2] = GlobalFunctions.generateSpan(splashArrayAgedPayablesReport[i][2], 'text-primary');
  //         splashArrayAgedPayablesReport[i][3] = GlobalFunctions.generateSpan(GlobalFunctions.formatDate(splashArrayAgedPayablesReport[i][3]), 'text-primary');
  //         let tmp;
  //         for(j = 0 ; j < 6; j ++) {
  //             tmp = splashArrayAgedPayablesReport[i][4 + j] - 0;
  //             splashArrayAgedPayablesReport[i][4 + j] = (tmp >= 0) ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-success', "text-right") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(tmp), 'text-danger', "text-right");
  //             sum[j] += tmp;
  //         }
  //         agedPayableList.push(splashArrayAgedPayablesReport[i]);
  //     }
  //     for(j = 0 ; j < 6; j ++){
  //         totalSum[j] += sum[j] - 0;
  //         sum[j] = sum[j] >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(sum[j]), "table-cells text-bold", "text-right listhr") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(sum[j]), "text-danger text-bold", "text-right listhr");
  //     }
  //     agedPayableList.push([
  //         GlobalFunctions.generateSpan(`Total ${T_AccountName}`, 'table-cells text-bold', "listhr"),
  //         GlobalFunctions.generateSpan("","","listhr"),
  //         GlobalFunctions.generateSpan("","","listhr"),
  //         GlobalFunctions.generateSpan("","","listhr"),
  //         sum[0],
  //         sum[1],
  //         sum[2],
  //         sum[3],
  //         sum[4],
  //         sum[5],
  //     ]);
  //     for(j = 0 ; j < 6; j ++){
  //         totalSum[j] = totalSum[j] >= 0 ? GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(totalSum[j]), "table-cells text-bold", "text-right listhr") : GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(totalSum[j]), "text-danger text-bold", "text-right listhr");
  //     }
  //     agedPayableList.push([
  //         GlobalFunctions.generateSpan(`Grand Total`, 'table-cells text-bold', "listhr"),
  //         GlobalFunctions.generateSpan("","","listhr"),
  //         GlobalFunctions.generateSpan("","","listhr"),
  //         GlobalFunctions.generateSpan("","","listhr"),
  //         totalSum[0],
  //         totalSum[1],
  //         totalSum[2],
  //         totalSum[3],
  //         totalSum[4],
  //         totalSum[5],
  //     ]);
  //     templateObject.transactiondatatablerecords.set(agedPayableList);

  //     setTimeout(function () {
  //     $('#tableExport1').DataTable({
  //       data: agedPayableList,
  //       searching: false,
  //       "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //       columnDefs: [
  //           {
  //               targets: 0,
  //               className: "colName",
  //           },
  //           {
  //               targets: 1,
  //               className: "colType"
  //           },
  //           {
  //               targets: 2,
  //               className: "colPONumber"
  //           },
  //           {
  //               targets: 3,
  //               className: "colDueDate",
  //           },
  //           {
  //               targets: 4,
  //               className: "colAmoutDue",
  //           },
  //           {
  //               targets: 5,
  //               className: "colCurrent",
  //           },
  //           {
  //               targets: 6,
  //               className: "col30Days",
  //           },
  //           {
  //               targets: 7,
  //               className: "col60Days",
  //           },
  //           {
  //               targets: 8,
  //               className: "col90Days",
  //           },
  //           {
  //               targets: 9,
  //               className: "col120Days",
  //           },
  //       ],
  //       select: true,
  //       destroy: true,
  //       colReorder: true,
  //       pageLength: initialDatatableLoad,
  //       lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
  //       info: true,
  //       // responsive: true,
  //       "order": [],
  //       "bsort": false,
  //       action: function () {
  //         $('#tableExport').DataTable().ajax.reload();
  //       },
  //       "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
  //             if(aData[0] == GlobalFunctions.generateSpan(`Grand Total`, 'table-cells text-bold'))
  //                 $(nRow).addClass("grandtotal");
  //             else if(nRow != 0 && aData[6] == "")
  //                 $(nRow).addClass("totalhr");
  //       },
  //     }).on('column-reorder', function () {

  //     }).on('length.dt', function (e, settings, len) {

  //       $(".fullScreenSpin").css("display", "inline-block");
  //       let dataLenght = settings._iDisplayLength;
  //       if (dataLenght == -1) {
  //         if (settings.fnRecordsDisplay() > initialDatatableLoad) {
  //           $(".fullScreenSpin").css("display", "none");
  //         } else {
  //           $(".fullScreenSpin").css("display", "none");
  //         }
  //       } else {
  //         $(".fullScreenSpin").css("display", "none");
  //       }
  //     });
  //     $(".fullScreenSpin").css("display", "none");
  //   }, 0);

  //   $('div.dataTables_filter input').addClass('form-control form-control-sm');
  // }

  // LoadingOverlay.hide();
});
                                                                                                                                                                                                                                                                                                           
Template.newagedpayables.events({
    'click #btnSummary': function() {
        FlowRouter.go('/agedpayablessummary');
    },

    'click #tblAgedPayables tbody tr': function(event) {
      let targetCard = '';
      let type=$(event.target).closest('tr').find('.colType').text();
      type=type.toLowerCase().replace(/[^a-z]/g,'');
      if(type != '') {
        if(type == 'bill') {
          targetCard='billcard'
        } else if (type == 'supplierpayment') {
          targetCard='supplierpaymentcard'
        } else if (type == 'po') {
          targetCard='purchaseordercard'
        } else if (type == 'credit') {
          targetCard= 'creditcard'
        } 
        let id = $(event.target).closest('tr').find('.colPONumber').text();
        FlowRouter.go('/'+targetCard+'?id='+id);
      }
    }
    // 'click .chkDatatable': function (event) {
    //   let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
    //   if ($(event.target).is(':checked')) {
    //     $('.' + columnDataValue).addClass('showColumn');
    //     $('.' + columnDataValue).removeClass('hiddenColumn');
    //   } else {
    //     $('.' + columnDataValue).addClass('hiddenColumn');
    //     $('.' + columnDataValue).removeClass('showColumn');
    //   }
    // },
    // 'click .btnOpenReportSettings': () => {
    //   let templateObject = Template.instance();
    //   // let currenttranstablename = templateObject.data.tablename||";
    //   $(`thead tr th`).each(function (index) {
    //     var $tblrow = $(this);
    //     var colWidth = $tblrow.width() || 0;
    //     var colthClass = $tblrow.attr('data-class') || "";
    //     $('.rngRange' + colthClass).val(colWidth);
    //   });
    //   $('.' + templateObject.data.tablename + '_Modal').modal('toggle');
    // },
    // 'change .custom-range': async function (event) {
    //   //   const tableHandler = new TableHandler();
    //   let range = $(event.target).val() || 0;
    //   let colClassName = $(event.target).attr("valueclass");
    //   await $('.' + colClassName).css('width', range);
    //   //   await $('.colAccountTree').css('width', range);
    //   $('.dataTable').resizable();
    // },

      // Template.reportcard.filteredfunction(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      // GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      // false)
    // 'change #dateTo': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     templateObject.records.set('');
    //     templateObject.grandrecords.set('');
    //     setTimeout(function(){
    //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //     var dateTo = new Date($("#dateTo").datepicker("getDate"));

    //     let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //     let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

    //     //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    //     var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
    //     //templateObject.dateAsAt.set(formatDate);
    //     if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {
    //         templateObject.getAgedPayableReports('', '', true);
    //         templateObject.dateAsAt.set('Current Date');
    //     } else {
    //         templateObject.getAgedPayableReports(formatDateFrom, formatDateTo, false);
    //         templateObject.dateAsAt.set(formatDate);
    //     }
    //     },500);
    // },
    // 'change #dateFrom': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     templateObject.records.set('');
    //     templateObject.grandrecords.set('');
    //     setTimeout(function(){
    //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //     var dateTo = new Date($("#dateTo").datepicker("getDate"));

    //     let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //     let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

    //     //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    //     var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
    //     //templateObject.dateAsAt.set(formatDate);
    //     if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {
    //         templateObject.getAgedPayableReports('', '', true);
    //         templateObject.dateAsAt.set('Current Date');
    //     } else {
    //         templateObject.getAgedPayableReports(formatDateFrom, formatDateTo, false);
    //         templateObject.dateAsAt.set(formatDate);
    //     }
    //     },500);
    // },
    // 'click .btnRefresh': function () {
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     Meteor._reload.reload();
    // },
    // 'click td a': function (event) {
    //     let redirectid = $(event.target).closest('tr').attr('id');

    //     let transactiontype = $(event.target).closest('tr').attr('class'); ;

    //     if (redirectid && transactiontype) {
    //         if (transactiontype === 'Bill') {
    //             window.open('/billcard?id=' + redirectid, '_self');
    //         } else if (transactiontype === 'PO') {
    //             window.open('/purchaseordercard?id=' + redirectid, '_self');
    //         } else if (transactiontype === 'Credit') {
    //             window.open('/creditcard?id=' + redirectid, '_self');
    //         } else if (transactiontype === 'Supplier Payment') {
    //             window.open('/supplierpaymentcard?id=' + redirectid, '_self');
    //         }
    //     }
    //     // window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
    // },
    // 'click .btnPrintReport': function (event) {
    //     $('.fullScreenSpin').css('display', 'inline-block')
    //     playPrintAudio();
    //     setTimeout(async function(){
    //       let targetElement = document.getElementsByClassName('printReport')[0];
    //       targetElement.style.width = "210mm";
    //       targetElement.style.backgroundColor = "#ffffff";
    //       targetElement.style.padding = "20px";
    //       targetElement.style.height = "fit-content";
    //       targetElement.style.fontSize = "13.33px";
    //       targetElement.style.color = "#000000";
    //       targetElement.style.overflowX = "visible";
    //       let targetTds = $(targetElement).find('.table-responsive #tableExport.table td');
    //       let targetThs = $(targetElement).find('.table-responsive #tableExport.table th');
    //       for (let k = 0; k< targetTds.length; k++) {
    //           $(targetTds[k]).attr('style', 'min-width: 0px !important')
    //       }
    //       for (let j = 0; j< targetThs.length; j++) {
    //           $(targetThs[j]).attr('style', 'min-width: 0px !important')
    //       }

    //       let docTitle = "AgedPayables Report.pdf";


    //       var opt = {
    //           margin: 0,
    //           filename: docTitle,
    //           image: {
    //               type: 'jpeg',
    //               quality: 0.98
    //           },
    //           html2canvas: {
    //               scale: 2
    //           },
    //           jsPDF: {
    //               unit: 'in',
    //               format: 'a4',
    //               orientation: 'portrait'
    //           }
    //       };
    //       let source = targetElement;

    //       async function getAttachments () {
    //         return new Promise(async(resolve, reject)=> {
    //           html2pdf().set(opt).from(source).toPdf().output('datauristring').then(function(dataObject){
    //             let pdfObject = "";
    //             let base64data = dataObject.split(',')[1];
    //             pdfObject = {
    //               filename: docTitle,
    //               content: base64data,
    //               encoding: 'base64'
    //             }
    //             let attachments = [];
    //             attachments.push(pdfObject);
    //             resolve(attachments)
    //           })
    //         })
    //       }


    //       async function checkBasedOnType() {
    //         return new Promise(async(resolve, reject)=>{
    //           let values = [];
    //           let basedOnTypeStorages = Object.keys(localStorage);
    //           basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
    //               let employeeId = storage.split('_')[2];
    //               return storage.includes('BasedOnType_');
    //               // return storage.includes('BasedOnType_') && employeeId == localStorage.getItem('mySessionEmployeeLoggedID')
    //           });
    //           let i = basedOnTypeStorages.length;
    //           if (i > 0) {
    //               while (i--) {
    //                   values.push(localStorage.getItem(basedOnTypeStorages[i]));
    //               }
    //           }
    //           for (let j =0; j<values.length; j++) {
    //             let value = values[j]
    //             let reportData = JSON.parse(value);
    //             reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
    //             if (reportData.BasedOnType.includes("P")) {
    //                 if (reportData.FormID == 1) {
    //                     let formIds = reportData.FormIDs.split(',');
    //                     if (formIds.includes("6")) {
    //                         reportData.FormID = 6;
    //                         reportData.attachments = await getAttachments()
    //                         Meteor.call('sendNormalEmail', reportData);
    //                         resolve();
    //                     }
    //                 } else {
    //                     if (reportData.FormID == 6) {
    //                       reportData.attachments = await getAttachments();
    //                       Meteor.call('sendNormalEmail', reportData);
    //                       resolve();
    //                     }
    //                 }
    //             }
    //             if(j == values.length -1) {resolve()}
    //           }

    //         })
    //       }

    //       await checkBasedOnType()

    //       $('.fullScreenSpin').css('display', 'none');
    //       document.title = 'Aged Payables Report';
    //       $(".printReport").print({
    //           title: document.title + " | Aged Payables | " + loggedCompany,
    //           noPrintSelector: ".addSummaryEditor",
    //       });

    //       targetElement.style.width = "100%";
    //       targetElement.style.backgroundColor = "#ffffff";
    //       targetElement.style.padding = "0px";
    //       targetElement.style.fontSize = "1rem";
    //     }, delayTimeAfterSound);
    // },
    // 'click .btnExportReport': function () {
    //     $('.fullScreenSpin').css('display', 'inline-block');

    //     let utilityService = new UtilityService();
    //     let templateObject = Template.instance();
    //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //     var dateTo = new Date($("#dateTo").datepicker("getDate"));

    //     let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //     let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

    //     const filename = loggedCompany + ' - Aged Payables' + '.csv';
    //     utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
    //     let rows = [];
    //     // reportService.getAgedPayableDetailsData(formatDateFrom,formatDateTo,false).then(function (data) {
    //     //     if(data.tapreport){
    //     //         rows[0] = ['Contact','Type', 'PO No.', 'Due Date', 'Amount Due', 'Currenct', '1 - 30 Days', '30 - 60 Days', '60 - 90 Days', '> 90 Days'];
    //     //         data.tapreport.forEach(function (e, i) {
    //     //             rows.push([
    //     //               data.tapreport[i].Name,
    //     //               data.tapreport[i].Type,
    //     //               data.tapreport[i].PurchaseOrderID,
    //     //               data.tapreport[i].DueDate !=''? moment(data.tapreport[i].DueDate).format("DD/MM/YYYY"): data.tapreport[i].DueDate,
    //     //               utilityService.modifynegativeCurrencyFormat(data.tapreport[i].AmountDue) || '-',
    //     //               utilityService.modifynegativeCurrencyFormat(data.tapreport[i].Current) || '0.00',
    //     //               utilityService.modifynegativeCurrencyFormat(data.tapreport[i]["30Days"]) || '0.00',
    //     //               utilityService.modifynegativeCurrencyFormat(data.tapreport[i]["60Days"]) || '0.00',
    //     //               utilityService.modifynegativeCurrencyFormat(data.tapreport[i]["90Days"]) || '0.00',
    //     //               utilityService.modifynegativeCurrencyFormat(data.tapreport[i]["120Days"]) || '0.00']);
    //     //         });
    //     //         setTimeout(function () {
    //     //
    //     //             $('.fullScreenSpin').css('display','none');
    //     //         }, 1000);
    //     //     }
    //     //
    //     // });
    // },
    // "change .edtReportDates": async function () {
    //     $(".fullScreenSpin").css("display", "inline-block");
    //     localStorage.setItem('VS1AgedPayables_Report', '');
    //     let templateObject = Template.instance();
    //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //     var dateTo = new Date($("#dateTo").datepicker("getDate"));
    //     await templateObject.setReportOptions(false, dateFrom, dateTo);

    // },
    // "click #lastMonth": async function () {
    //     $(".fullScreenSpin").css("display", "inline-block");
    //     localStorage.setItem('VS1AgedPayables_Report', '');
    //     let templateObject = Template.instance();
    //     let fromDate = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
    //     let endDate = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
    //     await templateObject.setReportOptions(false, fromDate, endDate);

    // },
    // "click #lastQuarter": async function () {
    //     $(".fullScreenSpin").css("display", "inline-block");
    //     localStorage.setItem('VS1AgedPayables_Report', '');
    //     let templateObject = Template.instance();
    //     let fromDate = moment().subtract(1, "Q").startOf("Q").format("YYYY-MM-DD");
    //     let endDate = moment().subtract(1, "Q").endOf("Q").format("YYYY-MM-DD");
    //     await templateObject.setReportOptions(false, fromDate, endDate);

    // },
    // "click #last12Months": async function () {
    //     $(".fullScreenSpin").css("display", "inline-block");
    //     localStorage.setItem('VS1AgedPayables_Report', '');
    //     let templateObject = Template.instance();
    //     $("#dateFrom").attr("readonly", false);
    //     $("#dateTo").attr("readonly", false);
    //     var currentDate = new Date();
    //     var begunDate = moment(currentDate).format("DD/MM/YYYY");

    //     let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    //     let fromDateDay = currentDate.getDate();
    //     if (currentDate.getMonth() + 1 < 10) {
    //       fromDateMonth = "0" + (currentDate.getMonth() + 1);
    //     }
    //     if (currentDate.getDate() < 10) {
    //       fromDateDay = "0" + currentDate.getDate();
    //     }

    //     var fromDate = fromDateDay + "/" + fromDateMonth + "/" + Math.floor(currentDate.getFullYear() - 1);
    //     templateObject.dateAsAt.set(begunDate);
    //     $("#dateFrom").val(fromDate);
    //     $("#dateTo").val(begunDate);

    //     var currentDate2 = new Date();
    //     var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    //     let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + Math.floor(currentDate2.getMonth() + 1) + "-" + currentDate2.getDate();
    //     await templateObject.setReportOptions(false, getDateFrom, getLoadDate);

    // },
    // 'keyup #myInputSearch': function (event) {
    //     $('.table tbody tr').show();
    //     let searchItem = $(event.target).val();
    //     if (searchItem != '') {
    //         var value = searchItem.toLowerCase();
    //         $('.table tbody tr').each(function () {
    //             var found = 'false';
    //             $(this).each(function () {
    //                 if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
    //                     found = 'true';
    //                 }
    //             });
    //             if (found == 'true') {
    //                 $(this).show();
    //             } else {
    //                 $(this).hide();
    //             }
    //         });
    //     } else {
    //         $('.table tbody tr').show();
    //     }
    // },
    // 'blur #myInputSearch': function (event) {
    //     $('.table tbody tr').show();
    //     let searchItem = $(event.target).val();
    //     if (searchItem != '') {
    //         var value = searchItem.toLowerCase();
    //         $('.table tbody tr').each(function () {
    //             var found = 'false';
    //             $(this).each(function () {
    //                 if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
    //                     found = 'true';
    //                 }
    //             });
    //             if (found == 'true') {
    //                 $(this).show();
    //             } else {
    //                 $(this).hide();
    //             }
    //         });
    //     } else {
    //         $('.table tbody tr').show();
    //     }
    // },
    // "click #ignoreDate": function () {
    //     let templateObject = Template.instance();
    //     LoadingOverlay.show();
    //     localStorage.setItem("VS1AgedPayables_Report", "");
    //     $("#dateFrom").attr("readonly", true);
    //     $("#dateTo").attr("readonly", true);
    //     templateObject.getAgedPayablesData(null, null, true);
    //   },
    //   "change #dateTo, change #dateFrom": (e) => {
    //     let templateObject = Template.instance();
    //     LoadingOverlay.show();
    //     localStorage.setItem("VS1AgedPayables_Report", "");
    //     templateObject.getAgedPayablesData(
    //       GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
    //       GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
    //       false
    //     )
    //   },
    // ...Datehandler.getDateRangeEvents(),
    //  // CURRENCY MODULE
    // ...FxGlobalFunctions.getEvents(),
    ,
    

    "click [href='#noInfoFound']": function () {
        swal({
            title: 'Information',
            text: "No further information available on this column",
            type: 'warning',
            confirmButtonText: 'Ok'
          })
      }
});

Template.newagedpayables.helpers({
  displaysettings: ()=> {
    return Template.instance().displaysettings.get()
  },
  agedpayablesth: () => {
    return Template.instance().agedpayablesth.get();
  },
  transactiondatatablerecords: () => {
    return Template.instance().transactiondatatablerecords.get();
    //   .sort(function(a, b){
    //     if (a.accounttype == 'NA') {
    //   return 1;
    //       }
    //   else if (b.accounttype == 'NA') {
    //     return -1;
    //   }
    // return (a.accounttype.toUpperCase() > b.accounttype.toUpperCase()) ? 1 : -1;
    // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
    // });
  },
  redirectionType(item) {
    if(item.type === 'PO') {
      return '/purchaseordercard?id=' + item.Id;
    } else if (item.type === 'Supplier Payment') {
      return '/supplierpaymentcard?id=' + item.Id;
    } else if (item.type === 'Bill') {
      return '/billcard?id=' + item.Id;
    } else if (item.type === 'Credit') {
      return '/creditcard?id=' + item.Id;
    } else {
      return '#noInfoFound';
    }
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
    return Template.instance().deptrecords.get().sort(function (a, b) {
      if (a.department == "NA") {
        return 1;
      } else if (b.department == "NA") {
        return -1;
      }
      return a.department.toUpperCase() > b.department.toUpperCase()
        ? 1
        : -1;
    });
  },
  formatPriceWithDays(amountData, days) {
    let amount = amountData[days + 'Days'];
    let utilityService = new UtilityService();
    if (isNaN(amount)) {
      amount = amount === undefined || amount === null || amount.length === 0
        ? 0
        : amount;
      amount = amount
        ? Number(amount.replace(/[^0-9.-]+/g, ""))
        : 0;
    }
    return utilityService.modifynegativeCurrencyFormat(amount) || 0.0;
  },
  formatPrice(amount) {
    let utilityService = new UtilityService();
    if (isNaN(amount)) {
      amount = amount === undefined || amount === null || amount.length === 0
        ? 0
        : amount;
      amount = amount
        ? Number(amount.replace(/[^0-9.-]+/g, ""))
        : 0;
    }
    return utilityService.modifynegativeCurrencyFormat(amount) || 0.0;
  },
  formatDate: ( date ) => {
    return ( date )? moment(date).format("DD/MM/YYYY") : '';
    },
  // FX Module
  convertAmount: (amount = 0.00, currencyData, days = null) => {
    if(days != null) {
        amount = amount[days + 'Days'];
    }
    let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

    if (isNaN(amount)) {
      if (!amount || amount.trim() == "") {
        return '';
      }
      amount = utilityService.convertSubstringParseFloat(amount); // This will remove all currency symbol
    }
    // if (currencyData.code == defaultCurrencyCode) {
    //    default currency
    //   return amount;
    // }

    // Lets remove the minus character
    const isMinus = amount < 0;
    if (isMinus == true)
      amount = amount * -1; // make it positive for now

    //  get default currency symbol
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
    currencyList = currencyList.filter(a => a.Code == currencyData.code);

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

    let rate = currencyData.code == defaultCurrencyCode
      ? 1
      : firstElem.BuyRate; // Must used from tcurrecyhistory

    amount = parseFloat(amount * rate); // Multiply by the rate
    amount = Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }); // Add commas

    let convertedAmount = isMinus == true
      ? `- ${currencyData.symbol} ${amount}`
      : `${currencyData.symbol} ${amount}`;

    return convertedAmount;
  },
  count: array => {
    return array.length;
  },
  countActive: array => {
    if (array.length == 0) {
      return 0;
    }
    let activeArray = array.filter(c => c.active == true);
    return activeArray.length;
  },
  currencyList: () => {
    return Template.instance().currencyList.get();
  },
  isNegativeAmount(amount, days = null) {
    if(days != null && days != undefined) {
        amount = amount[days + 'Days'];
    }
    if (Math.sign(amount) === -1) {
      return true;
    }
    return false;
  },
  isOnlyDefaultActive() {
    const array = Template.instance().currencyList.get();
    if (array.length == 0) {
      return false;
    }
    let activeArray = array.filter(c => c.active == true);

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
    let activeArray = array.filter(c => c.active == true);

    return activeArray.length > 0;
  },
  isObject(variable) {
    return typeof variable === "object" && variable !== null;
  },
  currency: () => {
    return Currency;
  },
  getDays: (object, number = 30) => {
    return object[number + 'Days'];
  },

  datahandler: () => {
    let templateObject = Template.instance();
      return function (data) {
          let returnvalue = templateObject.getReportDataRecord(data);
        return returnvalue
    }
  },

  apiFunction: function() {
    return sideBarService.getTAPReportPage;
  },

  listParams: function() {
    return ['limitCount', 'limitFrom', 'dateFrom', 'dateTo', 'ignoreDate']
  },
  service: function () {
    return sideBarService
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
