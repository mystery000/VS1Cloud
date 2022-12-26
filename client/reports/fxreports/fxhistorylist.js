import { ReportService } from "../report-service";
import 'jQuery.print/jQuery.print.js';
import { UtilityService } from "../../utility-service";
import GlobalFunctions from "../../GlobalFunctions";

let reportService = new ReportService();
let utilityService = new UtilityService();

Template.fxhistorylist.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.dateAsAt = new ReactiveVar();
    templateObject.fxhistorylistth = new ReactiveVar([]);

});

Template.fxhistorylist.onRendered(() => {
    const templateObject = Template.instance();
    let imageData = (localStorage.getItem("Image"));
    let begunDate = moment().format("DD/MM/YYYY");
    if (imageData) {
        $('#uploadedImage').attr('src', imageData);
        $('#uploadedImage').attr('width', '50%');
    }

    let reset_data = [
        { index: 1, label: 'Company', class:'colCompany', active: true, display: true, width: "" },
        { index: 2, label: 'Currency', class:'colCurrency', active: true, display: true, width: "" },
        { index: 3, label: 'Code', class:'colCode', active: true, display: true, width: "" },
        { index: 4, label: 'Buy Rate', class:'colBuyRate', active: true, display: true, width: "" },
        { index: 5, label: 'Sell Rate', class:'colSellRate', active: true, display: true, width: "" },
        { index: 6, label: 'Rate Last Modified', class:'colRateLastModified', active: true, display: true, width: "" },
        { index: 7, label: 'Active', class:'colActive', active: true, display: true, width: "" },
        { index: 8, label: 'Global Ref', class:'colGlobalRef', active: false, display: true, width: "" },
        { index: 9, label: 'Currency Symbol', class:'colCurrencySymbol', active: false, display: true, width: "" },
        { index: 10, label: 'Currency ID', class:'colCurrencyID', active: false, display: true, width: "" },
        { index: 11, label: 'Edited Flag', class:'colEditedFlag', active: false, display: true, width: "" },
      ];

      templateObject.fxhistorylistth.set(reset_data);

    templateObject.setDateAs = ( dateFrom = null ) => {
        templateObject.dateAsAt.set( ( dateFrom )? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY") )
    };
    templateObject.setDateAs(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()));

    // $("#date-input,#dateTo,#dateFrom").datepicker({
    //     showOn: 'button',
    //     buttonText: 'Show Date',
    //     buttonImageOnly: true,
    //     buttonImage: '/img/imgCal2.png',
    //     dateFormat: 'dd/mm/yy',
    //     showOtherMonths: true,
    //     selectOtherMonths: true,
    //     changeMonth: true,
    //     changeYear: true,
    //     yearRange: "-90:+10",
    //     onChangeMonthYear: function(year, month, inst) {
    //         $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
    //     }
    // });

    // $("#dateFrom").val(fromDate);
    // $("#dateTo").val(begunDate);
});

Template.fxhistorylist.events({
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
         $('.'+templateObject.data.tablename+'_Modal').modal('toggle');
      },
      'change .custom-range': async function(event) {
      //   const tableHandler = new TableHandler();
        let range = $(event.target).val()||0;
        let colClassName = $(event.target).attr("valueclass");
        await $('.' + colClassName).css('width', range);
      //   await $('.colAccountTree').css('width', range);
        $('.dataTable').resizable();
      },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        localStorage.setItem('VS1FXHistoryList_Report', '');
        Meteor._reload.reload();
    },
    'click .btnExportReport': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let utilityService = new UtilityService();
        let templateObject = Template.instance();
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

        const filename = loggedCompany + '- Foreign Exchange History List' + '.csv';
        utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
        let rows = [];
    },
    'click .btnPrintReport': function(event) {
        playPrintAudio();
        setTimeout(function(){
        let values = [];
        let basedOnTypeStorages = Object.keys(localStorage);
        basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
            let employeeId = storage.split('_')[2];
            return storage.includes('BasedOnType_') && employeeId == Session.get('mySessionEmployeeLoggedID')
        });
        let i = basedOnTypeStorages.length;
        if (i > 0) {
            while (i--) {
                values.push(localStorage.getItem(basedOnTypeStorages[i]));
            }
        }
        values.forEach(value => {
            let reportData = JSON.parse(value);
            reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
            if (reportData.BasedOnType.includes("P")) {
                if (reportData.FormID == 1) {
                    let formIds = reportData.FormIDs.split(',');
                    if (formIds.includes("225")) {
                        reportData.FormID = 225;
                        Meteor.call('sendNormalEmail', reportData);
                    }
                } else {
                    if (reportData.FormID == 225)
                        Meteor.call('sendNormalEmail', reportData);
                }
            }
        });

        document.title = 'Foreign Exchange History List';
        $(".printReport").print({
            title: "Foreign Exchange History List | " + loggedCompany,
            noPrintSelector: ".addSummaryEditor"
        });
    }, delayTimeAfterSound);
    },
    'keyup #myInputSearch': function(event) {
        $('.table tbody tr').show();
        let searchItem = $(event.target).val();
        if (searchItem != '') {
            var value = searchItem.toLowerCase();
            $('.table tbody tr').each(function() {
                var found = 'false';
                $(this).each(function() {
                    if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                        found = 'true';
                    }
                });
                if (found == 'true') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $('.table tbody tr').show();
        }
    },
    'blur #myInputSearch': function(event) {
        $('.table tbody tr').show();
        let searchItem = $(event.target).val();
        if (searchItem != '') {
            var value = searchItem.toLowerCase();
            $('.table tbody tr').each(function() {
                var found = 'false';
                $(this).each(function() {
                    if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                        found = 'true';
                    }
                });
                if (found == 'true') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $('.table tbody tr').show();
        }
    }
});

Template.fxhistorylist.helpers({
    dateAsAt: () =>{
        return Template.instance().dateAsAt.get() || '-';
    },
    fxhistorylistth: () => {
        return Template.instance().fxhistorylistth.get();
    }
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
