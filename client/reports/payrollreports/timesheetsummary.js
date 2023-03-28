import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import Datehandler from "../../DateHandler";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import GlobalFunctions from "../../GlobalFunctions";
import { Template } from 'meteor/templating';
import "./timesheetsummary.html";

let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();
let defaultCurrencyCode = CountryAbbr;

const currentDate = new Date();

Template.timesheetsummary.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.reportOptions = new ReactiveVar([]);
  templateObject.records = new ReactiveVar([]);
  templateObject.timesheetsummaryth = new ReactiveVar([]);
});

Template.timesheetsummary.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  let reset_data = [
    { index: 1, label: 'Employee', class: 'colEntryDate', active: true, display: true, width: "120" },
    { index: 2, label: 'Date', class: 'colType', active: true, display: true, width: "120" },
    { index: 3, label: 'Hours', class: 'colEnteredby', active: true, display: true, width: "120" },
    { index: 4, label: 'Overtime', class: 'colJob', active: true, display: true, width: "120" },
    { index: 5, label: 'Double', class: 'colTimesheetDate', active: true, display: true, width: "120" },
    { index: 6, label: 'Additional', class: 'colHours', active: true, display: true, width: "120" },
    { index: 7, label: 'Tips', class: 'colActive', active: true, display: true, width: "120" },
    // { index: 8, label: 'Total', class: 'colTotal', active: false, display: true, width: "85" },
    // { index: 9, label: 'Employee Name', class: 'colEmployee', active: false, display: true, width: "85" },
    // { index: 10, label: 'Labour Cost', class: 'colLabourCost', active: false, display: true, width: "85" },
    // { index: 11, label: 'Department Name', class: 'colDepartmentName', active: false, display: true, width: "85" },
    // { index: 12, label: 'Service Name', class: 'colServiceName', active: false, display: true, width: "85" },
    // { index: 13, label: 'Service Date', class: 'colServiceDate', active: false, display: true, width: "85" },
    // { index: 14, label: 'Charge Rate', class: 'colChargeRate', active: false, display: true, width: "85" },
    // { index: 15, label: 'Product ID', class: 'colProductID', active: false, display: true, width: "85" },
    // { index: 16, label: 'Product Description', class: 'colProductDescription', active: false, display: true, width: "85" },
    // { index: 17, label: 'Use Time Cost', class: 'colUseTimeCost', active: false, display: true, width: "85" },
    // { index: 18, label: 'Tax', class: 'colTax', active: false, display: true, width: "85" },
    // { index: 19, label: 'Pay Rate Type Name', class: 'colPayRateTypeName', active: false, display: true, width: "85" },
    // { index: 20, label: 'Hourly Rate', class: 'colHourlyRate', active: false, display: true, width: "85" },
    // { index: 21, label: 'Super Inc', class: 'colSuperInc', active: false, display: true, width: "85" },
    // { index: 22, label: 'Super Amount', class: 'colSuperAmount', active: false, display: true, width: "85" },
    // { index: 23, label: 'Notes', class: 'colNotes', active: false, display: true, width: "85" },
    // { index: 24, label: 'Qty', class: 'colQty', active: false, display: true, width: "85" },
    // { index: 25, label: 'Equipment', class: 'colEquipment', active: false, display: true, width: "85" },
    // { index: 26, label: 'Total Service Charge', class: 'colTotalServiceCharge', active: false, display: true, width: "85" },
    // { index: 27, label: 'Timesheet Entry ID', class: 'colTimesheetEntryID', active: false, display: true, width: "85" },
    // { index: 28, label: 'Repair #', class: 'colRepair', active: false, display: true, width: "85" },
    // { index: 29, label: 'Area', class: 'colArea', active: false, display: true, width: "85" },
    // { index: 30, label: 'ContactName', class: 'colContactName', active: false, display: true, width: "85" },
  ]
  templateObject.timesheetsummaryth.set(reset_data);


  templateObject.initDate = () => {
    Datehandler.initOneMonth();
  };

  templateObject.setDateAs = ( dateFrom = null ) => {
    templateObject.dateAsAt.set( ( dateFrom )? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY") )
  };

  templateObject.initUploadedImage = () => {
    let imageData = localStorage.getItem("Image");
    if (imageData) {
      $("#uploadedImage").attr("src", imageData);
      $("#uploadedImage").attr("width", "50%");
    }
  };

  templateObject.getTimeSheetEntry = async function (  dateFrom, dateTo, ignoreDate ) {
    LoadingOverlay.show();
    let data = [];
    templateObject.setDateAs( dateFrom );
    if (!localStorage.getItem('VS1TimesheetSummary_Report')) {
      data = await reportService.getTimeSheetEntry( dateFrom, dateTo, ignoreDate, '1 month');
      if( data.ttimesheetentry.length > 0 ){
        localStorage.setItem('VS1TimesheetSummary_Report', JSON.stringify(data)||'');
      }
    }else{
      data = JSON.parse(localStorage.getItem('VS1TimesheetSummary_Report'));
    }
    const result = new Array();
    if(data){
      data.ttimesheetentry.map((subitem) => {
        if(subitem.fields && subitem.fields.TimeSheet) {
          subitem.fields.TimeSheet.map((y) => {
            let index = result.findIndex(x => x.EmployeeName == y.fields.EmployeeName)
            if(index == -1) {
              result.push({ EmployeeName:y.fields.EmployeeName, records: [y]})
            } else {
              result[index].records.push(y)
            }
          });
        }
      });
      
    }
    templateObject.records.set(result);    
    LoadingOverlay.hide();

  };
  

  templateObject.initDate();
  templateObject.initUploadedImage();
  templateObject.getTimeSheetEntry(
    GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
    GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
    false
  );
  templateObject.setDateAs( GlobalFunctions.convertYearMonthDay($('#dateFrom').val()) )
  LoadingOverlay.hide();
});

Template.timesheetsummary.events({
  'click .chkDatatable': function(event) {
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
    if ($(event.target).is(':checked')) {
      $('.'+columnDataValue).addClass('showColumn');
      $('.'+columnDataValue).removeClass('hiddenColumn');
    } else {
      $('.'+columnDataValue).addClass('hiddenColumn');
      $('.'+columnDataValue).removeClass('showColumn');
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
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1TimesheetSummary_Report", "");
    Meteor._reload.reload();
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

    const filename = loggedCompany + "- Timesheet Summary Report" + ".csv";
    utilityService.exportReportToCsvTable("tableExport", filename, "csv");
    let rows = []; 
  },
  "click .btnPrintReport": function (event) {
    playPrintAudio();
    setTimeout(function(){
    let values = [];
    let basedOnTypeStorages = Object.keys(localStorage);
    basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
      let employeeId = storage.split("_")[2];
      return (
        storage.includes("BasedOnType_") &&
        employeeId == localStorage.getItem("mySessionEmployeeLoggedID")
      );
    });
    let i = basedOnTypeStorages.length;
    if (i > 0) {
      while (i--) {
        values.push(localStorage.getItem(basedOnTypeStorages[i]));
      }
    }
    values.forEach((value) => {
      let reportData = JSON.parse(value);
      reportData.HostURL = $(location).attr("protocal")
        ? $(location).attr("protocal") + "://" + $(location).attr("hostname")
        : "http://" + $(location).attr("hostname");
      if (reportData.BasedOnType.includes("P")) {
        if (reportData.FormID == 1) {
          let formIds = reportData.FormIDs.split(",");
          if (formIds.includes("225")) {
            reportData.FormID = 225;
            Meteor.call("sendNormalEmail", reportData);
          }
        } else {
          if (reportData.FormID == 225)
            Meteor.call("sendNormalEmail", reportData);
        }
      }
    });

    document.title = "Timesheet Summary Report";
    $(".printReport").print({
      title: "Timesheet Summary Report | " + loggedCompany,
      noPrintSelector: ".addSummaryEditor",
    });
  }, delayTimeAfterSound);
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
  // "change .edtReportDates": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   localStorage.setItem('VS1TimesheetSummary_Report', '');
  //   let templateObject = Template.instance();
  //   var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
  //   var dateTo = new Date($("#dateTo").datepicker("getDate"));
  //   await templateObject.setReportOptions(false, dateFrom, dateTo);
  //   $(".fullScreenSpin").css("display", "none");
  // },
  // "click #lastMonth": async function () {
  //   // $(".fullScreenSpin").css("display", "inline-block");
  //   // localStorage.setItem('VS1TimesheetSummary_Report', '');
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
  //   await templateObject.setReportOptions(false, fromDate, endDate);
   
  // },
  // "click #lastQuarter": async function () {
  //   // $(".fullScreenSpin").css("display", "inline-block");
  //   // localStorage.setItem('VS1TimesheetSummary_Report', '');
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "Q").startOf("Q").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "Q").endOf("Q").format("YYYY-MM-DD");
  //   await templateObject.setReportOptions(false, fromDate, endDate);
  //   // $(".fullScreenSpin").css("display", "none");
  // },
  // "click #last12Months": async function () {
  //   // $(".fullScreenSpin").css("display", "inline-block");
  //   // localStorage.setItem('VS1TimesheetSummary_Report', '');
  //   let templateObject = Template.instance();
  //   $("#dateFrom").attr("readonly", false);
  //   $("#dateTo").attr("readonly", false);
  //   var currentDate = new Date();
  //   var begunDate = moment(currentDate).format("DD/MM/YYYY");

  //   let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
  //   let fromDateDay = currentDate.getDate();
  //   if (currentDate.getMonth() + 1 < 10) {
  //     fromDateMonth = "0" + (currentDate.getMonth() + 1);
  //   }
  //   if (currentDate.getDate() < 10) {
  //     fromDateDay = "0" + currentDate.getDate();
  //   }

  //   var fromDate = fromDateDay + "/" + fromDateMonth + "/" + Math.floor(currentDate.getFullYear() - 1);
  //   templateObject.dateAsAt.set(begunDate);
  //   $("#dateFrom").val(fromDate);
  //   $("#dateTo").val(begunDate);

  //   var currentDate2 = new Date();
  //   var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
  //   let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + Math.floor(currentDate2.getMonth() + 1) + "-" + currentDate2.getDate();
  //   await templateObject.setReportOptions(false, getDateFrom, getLoadDate);
  //   // $(".fullScreenSpin").css("display", "none");
  // },
  // "click #ignoreDate": async function () {
  //   // $(".fullScreenSpin").css("display", "inline-block");
  //   // localStorage.setItem('VS1TimesheetSummary_Report', '');
  //   let templateObject = Template.instance();
  //   templateObject.dateAsAt.set("Current Date");
  //   await templateObject.setReportOptions(true);
  //   // $(".fullScreenSpin").css("display", "none");
  // },
  "click #ignoreDate": function () {
    let templateObject = Template.instance();
    LoadingOverlay.show();
    localStorage.setItem("VS1TimesheetSummary_Report", "");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.getTimeSheetEntry(null, null, true);
  },
  "change #dateTo, change #dateFrom": (e) => {
    let templateObject = Template.instance();
    LoadingOverlay.show();
    localStorage.setItem("VS1TimesheetSummary_Report", "");
    templateObject.getTimeSheetEntry(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()), 
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    )
  },
  "click [href='#noInfoFound']": function () {
    swal({
        title: 'Information',
        text: "No further information available on this column",
        type: 'warning',
        confirmButtonText: 'Ok'
      })
  },
  ...Datehandler.getDateRangeEvents(),
  ...FxGlobalFunctions.getEvents()
});

Template.timesheetsummary.helpers({
  timesheetsummaryth: () => {
    return Template.instance().timesheetsummaryth.get();
  },
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  records: () => {
    return Template.instance().records.get();
  },
  redirectionType(item) {
    if(item.fields.MsTimeStamp === 'PO') {
      return '/purchaseordercard?id=' + item.Id;
    } else {
      return '#noInfoFound';
    }
  },
  formatPrice( amount ){
      let utilityService = new UtilityService();
      if( isNaN( amount ) ){
          amount = ( amount === undefined || amount === null || amount.length === 0 ) ? 0 : amount;
          amount = ( amount )? Number(amount.replace(/[^0-9.-]+/g,"")): 0;
      }
      return utilityService.modifynegativeCurrencyFormat(amount)|| 0.00;
  },
  formatDate: ( date ) => {
      return ( date )? moment(date).format("DD/MM/YYYY") : '';
  },
  currency: () => {
    return Currency;
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
