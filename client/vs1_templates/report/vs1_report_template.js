import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { ReportService } from "../../reports/report-service";
import TableHandler from '../../js/Table/TableHandler';
import moment from 'moment';
let sideBarService = new SideBarService();
let reportService = new ReportService();
let utilityService = new UtilityService();
Template.vs1_report_template.inheritsHooksFrom('export_import_print_display_button');

// Template.vs1_report_template.inheritsHelpersFrom('generalledger');
// Template.vs1_report_template.inheritsEventsFrom('generalledger');
// Template.vs1_report_template.inheritsHooksFrom('generalledger');

Template.vs1_report_template.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.tablename = new ReactiveVar();
    templateObject.tabledisplayname = new ReactiveVar();
    templateObject.transactiondatatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();
    templateObject.report_displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
    // templateObject.dateAsAt = new ReactiveVar();
});

Template.vs1_report_template.onRendered(function() {
  let templateObject = Template.instance();

  templateObject.initUploadedImage = () => {
    let imageData = localStorage.getItem("Image");
    if (imageData) {
      $("#uploadedImage").attr("src", imageData);
      $("#uploadedImage").attr("width", "50%");
    }
  };

  templateObject.initUploadedImage();

  var url = FlowRouter.current().path;
  let currenttablename = "";
  let displaytablename = "";
  if (url.includes("/generalledger")) {
    currenttablename = "generalledger";
    displaytablename = "General Ledger";
  };
  templateObject.tablename.set(currenttablename);
  templateObject.tabledisplayname.set(displaytablename);

  // set initial table rest_data
  templateObject.init_reset_data = function(){
    let reset_data = [];
    switch (currenttablename) {
      case "generalledger":
        reset_data = [
          { index: 0, label: 'Account Name', class:'colAccountName', active: true, display: true, width: "10" },
          { index: 1, label: 'Account No', class:'colAccountNo', active: true, display: true, width: "10" },
          { index: 2, label: 'Date', class:'colDate', active: true, display: true, width: "10" },
          { index: 3, label: 'Client Name', class:'colClientName', active: true, display: true, width: "10" },
          { index: 4, label: 'Type', class:'colType', active: true, display: true, width: "10" },
          { index: 5, label: 'Debits', class:'colDebits', active: true, display: true, width: "10" },
          { index: 6, label: 'Credit', class:'colCredit', active: true, display: true, width: "10" },
          { index: 7, label: 'Amount', class:'colAmount', active: true, display: true, width: "10" },
        ];
      break;
    }
    templateObject.reset_data.set(reset_data);
  }
  // templateObject.init_reset_data();

  // custom field displaysettings

  templateObject.initCustomFieldDisplaySettings = function(data, listType){
    //function initCustomFieldDisplaySettings(data, listType) {
      let templateObject = Template.instance();
      let reset_data = templateObject.reset_data.get();
      templateObject.showCustomFieldDisplaySettings(reset_data);

      try {

        getVS1Data("VS1_Customize").then(function (dataObject) {
          if (dataObject.length == 0) {
            sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')), listType).then(function (data) {
                reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
                templateObject.showCustomFieldDisplaySettings(reset_data);
            }).catch(function (err) {
            });
          } else {
            let data = JSON.parse(dataObject[0].data);
            if(data.ProcessLog.Obj.CustomLayout.length > 0){
             for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
               if(data.ProcessLog.Obj.CustomLayout[i].TableName == listType){
                 reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
                 templateObject.showCustomFieldDisplaySettings(reset_data);
               }
             }
           };
          }
        });

      } catch (error) {
      }
      return;
    }
    templateObject.showCustomFieldDisplaySettings = async function(reset_data){
    //function showCustomFieldDisplaySettings(reset_data) {
      let custFields = [];
      let customData = {};
      let customFieldCount = reset_data.length;

      for (let r = 0; r < customFieldCount; r++) {
        customData = {
          active: reset_data[r].active,
          id: reset_data[r].index,
          custfieldlabel: reset_data[r].label,
          class: reset_data[r].class,
          display: reset_data[r].display,
          width: reset_data[r].width ? reset_data[r].width : ''
        };

        if(reset_data[r].active == true){
          $('#'+currenttablename+' .'+reset_data[r].class).removeClass('hiddenColumn');
        }else if(reset_data[r].active == false){
          $('#'+currenttablename+' .'+reset_data[r].class).addClass('hiddenColumn');
        };
        custFields.push(customData);
      }
      await templateObject.report_displayfields.set(custFields);
      $('.dataTable').resizable();
    }
    // templateObject.initCustomFieldDisplaySettings("", currenttablename);

    templateObject.resetData = function (dataVal) {
        location.reload();
    };

  //tableResize();
});

Template.vs1_report_template.events({
  // "change .edtReportDates": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
  //   var dateTo = new Date($("#dateTo").datepicker("getDate"));
  //   templateObject.dateAsAt.set(moment(dateFrom, "DD/MM/YYYY").format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get()
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports(dateFrom, dateTo, false);
  //   }
  // },
  // "click #ignoreDate": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
  //   var dateTo = new Date($("#dateTo").datepicker("getDate"));
  //   templateObject.dateAsAt.set(moment().format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports(dateFrom, dateTo, true);
  //   }
  // },
  // "click #today": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   let dateFrom = moment().format("DD/MM/YYYY");
  //   let dateTo = moment().format("DD/MM/YYYY");
  //   templateObject.dateAsAt.set(dateFrom);
  //   $("#dateFrom").val(dateFrom);
  //   $("#dateTo").val(dateTo);
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports(moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), false);
  //   }
  // },
  // "click #thisweek": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   let dateFrom = moment().startOf('week');
  //   let dateTo = moment().endOf('week');
  //   templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
  //   }
  // },
  // "click #thisMonth": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   let dateFrom = moment().startOf('month');
  //   let dateTo = moment().endOf('month');
  //   templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
  //   }
  // },
  // "click #thisQuarter": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   let dateFrom = moment().startOf("Q");
  //   let dateTo = moment().endOf("Q");
  //   templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
  //   }
  // },
  // "click #thisfinancialyear": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   let dateFrom = moment().startOf('year');
  //   let dateTo = moment();
  //   templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
  //   }
  // },
  // "click #previousweek": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   let dateFrom = moment().subtract(1, "week").startOf('week');
  //   let dateTo = moment().subtract(1, "week").endOf('week');
  //   templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
  //   }
  // },
  // "click #previousmonth": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   let dateFrom = moment().subtract(1, "month").startOf('month');
  //   let dateTo = moment().subtract(1, "month").endOf('month');
  //   templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
  //   }
  // },
  // "click #previousquarter": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   let dateFrom = moment().subtract(1, "Q").startOf("Q");
  //   let dateTo = moment().subtract(1, "Q").endOf("Q");
  //   templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
  //   }
  // },
  // "click #previousfinancialyear": async function () {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   let dateFrom = null;
  //   let dateTo = null;
  //   if (moment().quarter() == 4) {
  //     dateFrom = moment().subtract(1, "year").month("July").startOf("month");
  //     dateTo = moment().month("June").endOf("month");
  //   } else {
  //     dateFrom = moment().subtract(2, "year").month("July").startOf("month");
  //     dateTo = moment().subtract(1, "year").month("June").endOf("month");
  //   }
  //   templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
  //   $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
  //   let currenttablename = templateObject.tabledisplayname.get();
  //   if(currenttablename == "General Ledger"){
  //     localStorage.setItem('VS1GeneralLedger_Report', '');
  //     await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
  //   }
  // },
});

Template.vs1_report_template.helpers({
  loggedCompany: () => {
      return localStorage.getItem('mySession') || '';
  },
  // tablename: () => {
  //     return Template.instance().tablename.get();
  // },
  // tabledisplayname: () => {
  //     return Template.instance().tabledisplayname.get();
  // },
  report_displayfields: () => {
    return Template.instance().report_displayfields.get();
  },
  // dateAsAt: () => {
  //   return Template.instance().dateAsAt.get() || "-";
  // },
});
