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

Template.vs1_report_template.inheritsHelpersFrom('generalledger');
Template.vs1_report_template.inheritsEventsFrom('generalledger');
Template.vs1_report_template.inheritsHooksFrom('generalledger');

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
    templateObject.dateAsAt = new ReactiveVar();
});

Template.vs1_report_template.onRendered(function() {
  let templateObject = Template.instance();

  // Load Date
  $("#date-input,#dateTo,#dateFrom").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonImageOnly: true,
    buttonImage: "/img/imgCal2.png",
    dateFormat: "dd/mm/yy",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
    onChangeMonthYear: function (year, month, inst) {
      // Set date to picker
      $(this).datepicker(
        "setDate",
        new Date(year, inst.selectedMonth, inst.selectedDay)
      );
      // Hide (close) the picker
      // $(this).datepicker('hide');
      // // Change ttrigger the on change function
      // $(this).trigger('change');
    },
  });
  $("#dateFrom").val(moment().subtract(1, "months").format("DD/MM/YYYY"));
  $("#dateTo").val(moment().format("DD/MM/YYYY"));
  templateObject.dateAsAt.set(moment().subtract(1, "months").format("DD/MM/YYYY"));

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
  templateObject.init_reset_data();

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
    templateObject.initCustomFieldDisplaySettings("", currenttablename);

    templateObject.resetData = function (dataVal) {
        location.reload();
    };

    templateObject.getGeneralLedgerReports = async function (dateFrom= new Date(), dateTo= new Date(), ignoreDate = true) {
      let data = {};
      if (!localStorage.getItem("VS1GeneralLedger_Report1")) {
        data = await reportService.getGeneralLedgerDetailsData(dateFrom, dateTo, ignoreDate);
        //localStorage.setItem("VS1GeneralLedger_Report",JSON.stringify(data) || "");
      } else {
        data = JSON.parse(localStorage.getItem("VS1GeneralLedger_Report"));
      }
      let allRecords = [];
      if (data.tgeneralledgerreport.length) {
        let records = [];
        let accountData = data.tgeneralledgerreport;
        for (let i = 0; i < accountData.length; i++) {
          if( records[data.tgeneralledgerreport[i].ACCOUNTID] === undefined ){
            records[data.tgeneralledgerreport[i].ACCOUNTID] = {
              Name: data.tgeneralledgerreport[i].ACCOUNTNAME,
              List: []
            };
            allRecords.push([
              data.tgeneralledgerreport[i].ACCOUNTNAME,
              "",
              "",
              "",
              "",
              "",
              "",
              ""
            ])
          }else{
            allRecords.push([
              "",
              data.tgeneralledgerreport[i].ACCOUNTNUMBER,
              data.tgeneralledgerreport[i].DATE != ""
              ? moment(data.tgeneralledgerreport[i].DATE).format("DD/MM/YYYY")
              : data.tgeneralledgerreport[i].DATE,
              data.tgeneralledgerreport[i]["CLIENT NAME"],
              data.tgeneralledgerreport[i].TYPE,
              utilityService.modifynegativeCurrencyFormat(
                data.tgeneralledgerreport[i].DEBITSEX
              ) || "-",
              utilityService.modifynegativeCurrencyFormat(
                data.tgeneralledgerreport[i].CREDITSEX
              ) || "-",
              utilityService.modifynegativeCurrencyFormat(
                data.tgeneralledgerreport[i].AMOUNTINC
              ) || "-",
            ])
          }
        }
      }
      setTimeout(function () {
        //$('#'+currenttablename).removeClass('hiddenColumn');
        $('#'+currenttablename).DataTable({
            data: allRecords,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            columnDefs: [
                {
                  targets: 0,
                  className: "colAccountName",
                  width: "10px",
                },
                {
                  targets: 1,
                  className: "colAccountNo",
                  width: "200px",
                },
                {
                  targets: 2,
                  className: "colDate",
                },
                {
                  targets: 3,
                  className: "colClientName",
                },
                {
                  targets: 4,
                  className: "colType",
                  width: "100px",
                },
                {
                  targets: 5,
                  className: "colDebits",
                  width: "100px",
                },
                {
                  targets: 6,
                  className: "colCredit",
                  width: "100px",
                },
                {
                  targets: 7,
                  className: "colAmount",
                  width: "100px",
                }
            ],
            ordering: false,
            select: true,
            destroy: true,
            // colReorder: true,
            paging: false,
            // pageLength: 100,
            // lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
            info: true,
            responsive: true,
            action: function () {
                $('#'+currenttablename).DataTable().ajax.reload();
            },
            language: { search: "",searchPlaceholder: "Search List..." }

        });
        $(".fullScreenSpin").css("display", "none");
      }, 0);

      if (templateObject.records.get()) {
        setTimeout(function () {
          $("td a").each(function () {
            if (
              $(this)
                .text()
                .indexOf("-" + Currency) >= 0
            )
              $(this).addClass("text-danger");
          });
          $("td").each(function () {
            if (
              $(this)
                .text()
                .indexOf("-" + Currency) >= 0
            )
              $(this).addClass("text-danger");
          });

          $("td").each(function () {
            let lineValue = $(this).first().text()[0];
            if (lineValue != undefined) {
              if (lineValue.indexOf(Currency) >= 0)
                $(this).addClass("text-right");
            }
          });

          $("td").each(function () {
            if (
              $(this)
                .first()
                .text()
                .indexOf("-" + Currency) >= 0
            )
              $(this).addClass("text-right");
          });

          $(".fullScreenSpin").css("display", "none");
        }, 100);
      }
      $(".fullScreenSpin").css("display", "none");
    };

    //Check URL to make right call.
    if(currenttablename == "generalledger"){
      templateObject.getGeneralLedgerReports();
    }

  //tableResize();
});

Template.vs1_report_template.events({
  "change .edtReportDates": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));
    templateObject.dateAsAt.set(moment(dateFrom, "DD/MM/YYYY").format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get()
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports(dateFrom, dateTo, false);
    }
  },
  "click #ignoreDate": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));
    templateObject.dateAsAt.set(moment().format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports(dateFrom, dateTo, true);
    }
  },
  "click #today": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let dateFrom = moment().format("DD/MM/YYYY");
    let dateTo = moment().format("DD/MM/YYYY");
    templateObject.dateAsAt.set(dateFrom);
    $("#dateFrom").val(dateFrom);
    $("#dateTo").val(dateTo);
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports(moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), false);
    }
  },
  "click #thisweek": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let dateFrom = moment().startOf('week');
    let dateTo = moment().endOf('week');
    templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
    $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
    $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
    }
  },
  "click #thisMonth": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let dateFrom = moment().startOf('month');
    let dateTo = moment().endOf('month');
    templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
    $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
    $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
    }
  },
  "click #thisQuarter": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let dateFrom = moment().startOf("Q");
    let dateTo = moment().endOf("Q");
    templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
    $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
    $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
    }
  },
  "click #thisfinancialyear": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let dateFrom = moment().startOf('year');
    let dateTo = moment();
    templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
    $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
    $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
    }
  },
  "click #previousweek": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let dateFrom = moment().subtract(1, "week").startOf('week');
    let dateTo = moment().subtract(1, "week").endOf('week');
    templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
    $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
    $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
    }
  },
  "click #previousmonth": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let dateFrom = moment().subtract(1, "month").startOf('month');
    let dateTo = moment().subtract(1, "month").endOf('month');
    templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
    $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
    $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
    }
  },
  "click #previousquarter": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let dateFrom = moment().subtract(1, "Q").startOf("Q");
    let dateTo = moment().subtract(1, "Q").endOf("Q");
    templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
    $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
    $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
    }
  },
  "click #previousfinancialyear": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let dateFrom = null;
    let dateTo = null;
    if (moment().quarter() == 4) {
      dateFrom = moment().subtract(1, "year").month("July").startOf("month");
      dateTo = moment().month("June").endOf("month");
    } else {
      dateFrom = moment().subtract(2, "year").month("July").startOf("month");
      dateTo = moment().subtract(1, "year").month("June").endOf("month");
    }
    templateObject.dateAsAt.set(dateFrom.format("DD/MM/YYYY"));
    $("#dateFrom").val(dateFrom.format("DD/MM/YYYY"));
    $("#dateTo").val(dateTo.format("DD/MM/YYYY"));
    let currenttablename = templateObject.tabledisplayname.get();
    if(currenttablename == "General Ledger"){
      localStorage.setItem('VS1GeneralLedger_Report', '');
      await templateObject.getGeneralLedgerReports( dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), false);
    }
  },
});

Template.vs1_report_template.helpers({
  loggedCompany: () => {
      return localStorage.getItem('mySession') || '';
  },
  tablename: () => {
      return Template.instance().tablename.get();
  },
  tabledisplayname: () => {
      return Template.instance().tabledisplayname.get();
  },
  report_displayfields: () => {
    return Template.instance().report_displayfields.get();
  },
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
});
