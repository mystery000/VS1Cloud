import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import GlobalFunctions from "../../GlobalFunctions";
import Datehandler from "../../DateHandler";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import { Template } from 'meteor/templating';
import "./customersummaryreport.html";

let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();
let defaultCurrencyCode = CountryAbbr;

const currentDate = new Date();

Template.customersummaryreport.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.reportOptions = new ReactiveVar();
  templateObject.transactiondatatablerecords = new ReactiveVar([]);
  templateObject.customersummaryreportth = new ReactiveVar([]);

   // Currency related vars //
   FxGlobalFunctions.initVars(templateObject);

});
function MakeNegative() {
  $('td').each(function(){
      if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
  });
}

Template.customersummaryreport.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  templateObject.init_reset_data = function () {
    let reset_data = [];
    reset_data = [
      { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "200" },
      { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "150" },
      { index: 3, label: 'Rep', class: 'colRep', active: true, display: true, width: "100" },
      { index: 4, label: 'Type', class: 'colType', active: true, display: true, width: "100" },
      { index: 5, label: 'Invoice Number', class: 'colInvoiceNumber', active: true, display: true, width: "130" },
      { index: 6, label: 'SaleDate', class: 'colSaleDate', active: true, display: true, width: "160" },
      { index: 7, label: 'DueDate', class: 'colDueDate', active: true, display: true, width: "160" },
      { index: 8, label: 'Total Amount (Ex)', class: 'colTotalAEX', active: true, display: true, width: "150" },
      { index: 9, label: 'Total Amount (Inc)', class: 'colTotalAInc', active: true, display: true, width: "150" },
      { index: 10, label: 'Gross Profit', class: 'colGrossProfit', active: true, display: true, width: "100" },
      { index: 11, label: 'Margin', class: 'colMargin', active: false, display: true, width: "100" },
      { index: 12, label: 'Address', class: 'colAddress', active: true, display: true, width: "200" },
      { index: 13, label: 'Address 2', class: 'colAddress2', active: true, display: true, width: "200" },
      { index: 14, label: 'Suburb', class: 'colSuburb', active: true, display: true, width: "100" },
      { index: 15, label: 'Postcode', class: 'colPostcode', active: true, display: true, width: "100" },
      { index: 16, label: 'State', class: 'colState', active: true, display: true, width: "100" },
      { index: 17, label: 'FaxNumber', class: 'colFaxNumber', active: true, display: true, width: "100" },
      { index: 18, label: 'Sale ID', class: 'colSaleID', active: false, display: true, width: "100" },
      { index: 19, label: 'Customer ID', class: 'colCustomerID', active: false, display: true, width: "100" },
      { index: 20, label: 'Address 3', class: 'colAddress3', active: false, display: true, width: "200" },
      { index: 21, label: 'Country', class: 'colCountry', active: false, display: true, width: "100" },
      { index: 22, label: 'Details', class: 'colDetails', active: false, display: true, width: "100" },
      { index: 23, label: 'Client ID', class: 'colClientID', active: false, display: true, width: "100" },
      { index: 24, label: 'Markup', class: 'colMarkup', active: false, display: true, width: "100" },
      { index: 25, label: 'Last Sale Date', class: 'colLastSaleDate', active: false, display: true, width: "100" },
      { index: 26, label: 'Gross Profit(Ex)', class: 'colGrossProfitEx', active: false, display: true, width: "100" },
      { index: 27, label: 'Customer Type', class: 'colCustomerType', active: false, display: true, width: "100" },
      { index: 28, label: 'Email', class: 'colEmail', active: false, display: true, width: "100" },
      { index: 29, label: 'Total Cost', class: 'colTotalCost', active: false, display: true, width: "100" },
    ];
    templateObject.customersummaryreportth.set(reset_data);
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

  templateObject.getCustomerSummaryData = async function (dateFrom, dateTo, ignoreDate) {

    templateObject.setDateAs(dateFrom);
    getVS1Data('TCustomerSummaryReport').then(function (dataObject) {
      if (dataObject.length == 0) {
        reportService.getCustomerDetailReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
          await addVS1Data('TCustomerSummaryReport', JSON.stringify(data));
          templateObject.displayCustomerSummaryData(data);
        }).catch(function (err) {
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.displayCustomerSummaryData(data);
      }
    }).catch(function (err) {
      reportService.getCustomerDetailReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
        await addVS1Data('TCustomerSummaryReport', JSON.stringify(data));
        templateObject.displayCustomerSummaryData(data);
      }).catch(function (err) {

      });
    });
  }

  templateObject.getCustomerSummaryData(
    GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
    GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
    false
  );
  templateObject.displayCustomerSummaryData = async function (data) {
    var splashArrayCustomerSummaryReport = new Array();
    let deleteFilter = false;
    if (data.Params.Search.replace(/\s/g, "") == "") {
      deleteFilter = true;
    } else {
      deleteFilter = false;
    };
    for (let i = 0; i < data.tcustomersummaryreport.length; i++) {
      var dataList = [
        data.tcustomersummaryreport[i].Name || "",
        data.tcustomersummaryreport[i].Phone || "",
        data.tcustomersummaryreport[i].REP || "",
        data.tcustomersummaryreport[i].Type || "",
        data.tcustomersummaryreport[i]["Invoice Number"] || "",
        data.tcustomersummaryreport[i].SaleDate || "",
        data.tcustomersummaryreport[i].DueDate || "",
        data.tcustomersummaryreport[i]["Total Amount (Ex)"] || "",
        data.tcustomersummaryreport[i]["Total Amount (Inc)"] || "",
        data.tcustomersummaryreport[i]["Gross Profit"] || "",
        data.tcustomersummaryreport[i].Margin || "",
        data.tcustomersummaryreport[i].Address || "",
        data.tcustomersummaryreport[i]["Address 2"] || "",
        data.tcustomersummaryreport[i].Suburb || "",
        data.tcustomersummaryreport[i].Postcode || "",
        data.tcustomersummaryreport[i].State || "",
        data.tcustomersummaryreport[i].FaxNumber || "",
        data.tcustomersummaryreport[i].SaleID || "",
        data.tcustomersummaryreport[i].CustomerID || "",
        data.tcustomersummaryreport[i]["Address 3"] || "",
        data.tcustomersummaryreport[i].Country || "",
        data.tcustomersummaryreport[i].Details || "",
        data.tcustomersummaryreport[i].ClientID || "",
        data.tcustomersummaryreport[i].Markup || "",
        data.tcustomersummaryreport[i].LastSaleDate || "",
        data.tcustomersummaryreport[i]["Gross Profit(Ex)"] || "",
        data.tcustomersummaryreport[i].CustomerType || "",
        data.tcustomersummaryreport[i].EMAIL || "",
        data.tcustomersummaryreport[i]["Total Cost"] || "",
      ];
      splashArrayCustomerSummaryReport.push(dataList);
      templateObject.transactiondatatablerecords.set(splashArrayCustomerSummaryReport);
    }


    if (templateObject.transactiondatatablerecords.get()) {
      setTimeout(function () {
        MakeNegative();
      }, 100);
    }
    //$('.fullScreenSpin').css('display','none');

    setTimeout(function () {
      $('#tableExport').DataTable({
        data: splashArrayCustomerSummaryReport,
        searching: false,
        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        columnDefs: [
          {
            targets: 0,
            className: "colName",
          },
          {
            targets: 1,
            className: "colPhone"
          },
          {
            targets: 2,
            className: "colPhone"
          },
          {
            targets: 3,
            className: "colType",
          },
          {
            targets: 4,
            className: "colInvoiceNumber",
          },
          {
            targets: 5,
            className: "colSaleDate",
          },
          {
            targets: 6,
            className: "colDueDate",
          },
          {
            targets: 7,
            className: "colTotalAEX",
          },
          {
            targets: 8,
            className: "colTotalAInc",
          },
          {
            targets: 9,
            className: "colGrossProfit",
          },
          {
            targets: 10,
            className: "colMargin hiddenColumn",
          },
          {
            targets: 11,
            className: "colAddress",
          },
          {
            targets: 12,
            className: "colAddress2",
          },
          {
            targets: 13,
            className: "colSuburb",
          },
          {
            targets: 14,
            className: "colPostcode",
          },
          {
            targets: 15,
            className: "colState",
          },
          {
            targets: 16,
            className: "colFaxNumber",
          },
          {
            targets: 17,
            className: "colSaleID hiddenColumn",
          },
          {
            targets: 18,
            className: "colCustomerID hiddenColumn",
          },
          {
            targets: 19,
            className: "colAddress3 hiddenColumn",
          },
          {
            targets: 20,
            className: "colCountry hiddenColumn",
          },
          {
            targets: 21,
            className: "colDetails hiddenColumn",
          },
          {
            targets: 22,
            className: "colClientID hiddenColumn",
          },
          {
            targets: 23,
            className: "colMarkup hiddenColumn",
          },
          {
            targets: 24,
            className: "colLastSaleDate hiddenColumn",
          },
          {
            targets: 25,
            className: "colGrossProfitEx hiddenColumn",
          },
          {
            targets: 26,
            className: "colCustomerType hiddenColumn",
          },
          {
            targets: 27,
            className: "colEmail hiddenColumn",
          },
          {
            targets: 28,
            className: "colTotalCost hiddenColumn",
          },
        ],
        select: true,
        destroy: true,
        colReorder: true,
        pageLength: initialDatatableLoad,
        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
        info: true,
        // responsive: true,
        "order": [[1, "asc"]],
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
  // $("#tblgeneralledger tbody").on("click", "tr", function () {
  //   var listData = $(this).closest("tr").children('td').eq(8).text();
  //   var checkDeleted = $(this).closest("tr").find(".colStatus").text() || "";

  //   if (listData) {
  //     if (checkDeleted == "Deleted") {
  //       swal("You Cannot View This Transaction", "Because It Has Been Deleted", "info");
  //     } else {
  //       FlowRouter.go("/journalentrycard?id=" + listData);
  //     }
  //   }
  // });


  LoadingOverlay.hide();
});
// Template.customersummaryreport.onRendered(() => {
//   const templateObject = Template.instance();
//   LoadingOverlay.show();
//   templateObject.initDate = () => {
//     Datehandler.initOneMonth();
//   };


//   let reset_data = [
//     { index: 1, label: 'Name', class:'colName', active: true, display: true, width: "" },
//     { index: 2, label: 'Phone', class:'colPhone', active: true, display: true, width: "" },
//     { index: 3, label: 'Rep', class:'colRep', active: true, display: true, width: "" },
//     { index: 4, label: 'Type', class:'colType', active: true, display: true, width: "" },
//     { index: 5, label: 'Invoice Number', class:'colInvoiceNumber', active: true, display: true, width: "" },
//     { index: 6, label: 'SaleDate', class:'colSaleDate', active: true, display: true, width: "" },
//     { index: 7, label: 'DueDate', class:'colDueDate', active: true, display: true, width: "" },
//     { index: 8, label: 'Total Amount (Ex)', class:'colTotalAEX', active: true, display: true, width: "" },
//     { index: 9, label: 'Total Amount (Inc)', class:'colTotalAInc', active: true, display: true, width: "" },
//     { index: 10, label: 'Gross Profit', class:'colGrossProfit', active: true, display: true, width: "" },
//     { index: 11, label: 'Margin', class:'colMargin', active: true, display: true, width: "" },
//     { index: 12, label: 'Address', class:'colAddress', active: true, display: true, width: "" },
//     { index: 13, label: 'Address 2', class:'colAddress2', active: true, display: true, width: "" },
//     { index: 14, label: 'Suburb', class:'colSuburb', active: true, display: true, width: "" },
//     { index: 15, label: 'Postcode', class:'colPostcode', active: true, display: true, width: "" },
//     { index: 16, label: 'State', class:'colState', active: true, display: true, width: "" },
//     { index: 17, label: 'FaxNumber', class:'colFaxNumber', active: true, display: true, width: "" },
//     { index: 18, label: 'Sale ID', class:'colSaleID', active: false, display: true, width: "" },
//     { index: 19, label: 'Customer ID', class:'colCustomerID', active: false, display: true, width: "" },
//     { index: 20, label: 'Address 3', class:'colAddress3', active: false, display: true, width: "" },
//     { index: 21, label: 'Country', class:'colCountry', active: false, display: true, width: "" },
//     { index: 22, label: 'Details', class:'colDetails', active: false, display: true, width: "" },
//     { index: 23, label: 'Client ID', class:'colClientID', active: false, display: true, width: "" },
//     { index: 24, label: 'Markup', class:'colMarkup', active: false, display: true, width: "" },
//     { index: 25, label: 'Last Sale Date', class:'colLastSaleDate', active: false, display: true, width: "" },
//     { index: 26, label: 'Gross Profit(Ex)', class:'colGrossProfitEx', active: false, display: true, width: "" },
//     { index: 27, label: 'Customer Type', class:'colCustomerType', active: false, display: true, width: "" },
//     { index: 28, label: 'Email', class:'colEmail', active: false, display: true, width: "" },
//     { index: 29, label: 'Total Cost', class:'colTotalCost', active: false, display: true, width: "" },
//   ]
//   templateObject.customersummaryreportth.set(reset_data);


//   templateObject.setDateAs = ( dateFrom = null ) => {
//     templateObject.dateAsAt.set( ( dateFrom )? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY") )
//   };

//   templateObject.initDate();


//   templateObject.getCustomerDetailsHistory = async function (dateFrom, dateTo, ignoreDate) {
//     templateObject.setDateAs(dateFrom);
//     LoadingOverlay.show();
//     let data = [];
//     if (!localStorage.getItem('VS1CustomerSummary_Report')) {
//       data = await reportService.getCustomerDetailReport( dateFrom, dateTo, ignoreDate);
//       if( data.tcustomersummaryreport.length > 0 ){
//         localStorage.setItem('VS1CustomerSummary_Report', JSON.stringify(data)||'');
//       }
//     }else{
//       data = JSON.parse(localStorage.getItem('VS1CustomerSummary_Report'));
//     }

//     let reportData = [];
//     if( data.tcustomersummaryreport.length > 0 ){
//         let reportSummary = data.tcustomersummaryreport.map(el => {
//           let resultobj = {};
//           Object.entries(el).map(([key, val]) => {
//               resultobj[key.split(" ").join("_").replace(/\W+/g, '')] = val;
//               return resultobj;
//           })
//           return resultobj;
//         })

//       let reportGroups = [];
//       for (const item of reportSummary ) {
//         let isExist = reportGroups.filter((subitem) => {
//           if( subitem.EMAIL == item.EMAIL ){
//               subitem.SubAccounts.push(item)
//               return subitem
//           }
//         });

//         if( isExist.length == 0 ){
//           reportData.push({
//               Margin: 0,
//               ...item
//           });
//         }
//       $(".fullScreenSpin").css("display", "none");

//       }

//     }
//     templateObject.records.set(reportData);
//     LoadingOverlay.hide();
//   };

//   templateObject.getCustomerDetailsHistory(
//     GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
//     GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
//     false
//   );
//   templateObject.setDateAs( GlobalFunctions.convertYearMonthDay($('#dateFrom').val()) )
//   LoadingOverlay.hide();
// });

Template.customersummaryreport.events({
  "click #btnDetails": function () {
    FlowRouter.go("/customerdetailsreport");
  },

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

  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1CustomerSummary_Report", "");
    Meteor._reload.reload();
  },
  "click .btnSpreadSheetLink": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let utilityService = new UtilityService();
    const filename = "Customer Summary report result" + ".xlsx";
    utilityService.exportReportToSpreadSheet("tableExport", filename, "xlsx");
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

    const filename = loggedCompany + "- Customer Summary Report" + ".csv";
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

    document.title = "Customer Summary Report";
    $(".printReport").print({
      title: "Customer Summary Report | " + loggedCompany,
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
  "click #ignoreDate":  (e, templateObject) => {
    localStorage.setItem("VS1CustomerSummary_Report", "");
    templateObject.getCustomerDetailsHistory(null, null, true)
  },
  "change #dateTo, change #dateFrom": (e) => {
    let templateObject = Template.instance();
    localStorage.setItem("VS1CustomerSummary_Report", "");
    templateObject.getCustomerDetailsHistory(
      false,
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val())
    )
  },
  ...Datehandler.getDateRangeEvents(),
  // "change .edtReportDates": async function () {
  //   $(".fullScreenSpin").css("display", "block");
  //   localStorage.setItem('VS1CustomerSummary_Report', '');
  //   let templateObject = Template.instance();
  //   var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
  //   var dateTo = new Date($("#dateTo").datepicker("getDate"));
  //   await templateObject.setReportOptions(false, dateFrom, dateTo);
  //   // $(".fullScreenSpin").css("display", "none");
  // },
  // "click #lastMonth": async function () {
  //   $(".fullScreenSpin").css("display", "block");
  //   localStorage.setItem('VS1CustomerSummary_Report', '');
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
  //   await templateObject.setReportOptions(false, fromDate, endDate);
  //   // $(".fullScreenSpin").css("display", "none");
  // },
  // "click #lastQuarter": async function () {
  //   $(".fullScreenSpin").css("display", "block");
  //   localStorage.setItem('VS1CustomerSummary_Report', '');
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "Q").startOf("Q").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "Q").endOf("Q").format("YYYY-MM-DD");
  //   await templateObject.setReportOptions(false, fromDate, endDate);
  //   // $(".fullScreenSpin").css("display", "none");
  // },
  // "click #last12Months": async function () {
  //   $(".fullScreenSpin").css("display", "block");
  //   localStorage.setItem('VS1CustomerSummary_Report', '');
  //   let templateObject = Template.instance();
  //   $(".fullScreenSpin").css("display", "inline-block");
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
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   localStorage.setItem('VS1CustomerSummary_Report', '');
  //   let templateObject = Template.instance();
  //   templateObject.dateAsAt.set("Current Date");
  //   await templateObject.setReportOptions(true);
  //   // $(".fullScreenSpin").css("display", "none");
  // },

  // CURRENCY MODULE //
  ...FxGlobalFunctions.getEvents(),
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
  "click [href='#noInfoFound']": function () {
    swal({
        title: 'Information',
        text: "No further information available on this column",
        type: 'warning',
        confirmButtonText: 'Ok'
      })
  }
});

Template.customersummaryreport.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  customersummaryreportth: () => {
    return Template.instance().customersummaryreportth.get();
  },
  getSpaceKeyData( array, key ){
    return array[key] || ''
  },
  transactiondatatablerecords: () => {
    return Template.instance().transactiondatatablerecords.get();
  },
  redirectionType(value) {
    if(value.type === 'PO') {
      return '#noInfoFound';
      return '/purchaseordercard?id=' + value.SaleID;
    } else if (value.type === 'Invoice') {
      return '#noInfoFound';
      return '/invoicecard?id=' + value.SaleID;
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

  // FX Module //
  convertAmount: (amount, currencyData) => {
    let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

    if(isNaN(amount)) {
      if (!amount || amount.trim() == "") {
        return "";
      }
      amount = utilityService.convertSubstringParseFloat(amount); // This will remove all currency symbol
    }
    // if (currencyData.code == defaultCurrencyCode) {
    //   // default currency
    //   return amount;
    // }


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
  currencyList: () => {
    return Template.instance().currencyList.get();
  },
  isNegativeAmount(amount) {
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
