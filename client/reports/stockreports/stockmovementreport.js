import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import GlobalFunctions from "../../GlobalFunctions";
import moment from "moment";
import Datehandler from "../../DateHandler";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import { Template } from 'meteor/templating';
import "./stockmovementreport.html";


let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();

let defaultCurrencyCode = CountryAbbr;

Template.stockmovementreport.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.reportOptions = new ReactiveVar([]);
  templateObject.records = new ReactiveVar([]);

  // Currency related vars //
  templateObject.currencyList = new ReactiveVar([]);
  templateObject.activeCurrencyList = new ReactiveVar([]);
  templateObject.tcurrencyratehistory = new ReactiveVar([]);
  templateObject.stockmovementreportth = new ReactiveVar([]);
});

function MakeNegative() {
  $('td').each(function () {
    if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
  });
}

Template.stockmovementreport.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  templateObject.init_reset_data = function () {
    let reset_data = [];
    reset_data = [
      { index: 1, label: 'Product', class: 'colProductID', active: true, display: true, width: "200" },
      { index: 2, label: 'Trans Date', class: 'colTrType', active: true, display: true, width: "100" },
      { index: 3, label: 'Trans Type', class: 'colTrNo', active: true, display: true, width: "100" },
      { index: 4, label: 'Trans No', class: 'colOpening', active: true, display: true, width: "100" },
      { index: 5, label: 'Opening Qty', class: 'colCurrent', active: true, display: true, width: "100" },
      { index: 6, label: 'Trans Qty', class: 'colRunning', active: true, display: true, width: "100" },
      { index: 7, label: 'Running Qty', class: 'colAvUnitCost', active: true, display: true, width: "100" },
      { index: 8, label: 'Unit Cost', class: 'colAvTotalCost text-right', active: true, display: true, width: "100" },
      { index: 9, label: 'Total Cost', class: 'colAmUnitCost text-right', active: true, display: true, width: "100" },
    ]
    templateObject.stockmovementreportth.set(reset_data);
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

  templateObject.getReportData = async function (dateFrom, dateTo, ignoreDate) {

    templateObject.setDateAs(dateFrom);
    getVS1Data('TProductMovementList').then(function (dataObject) {
      if (dataObject.length == 0) {
        reportService.getStockMovementReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
          await addVS1Data('TProductMovementList', JSON.stringify(data));
          templateObject.displayReportData(data);
        }).catch(function (err) {
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.displayReportData(data);
      }
    }).catch(function (err) {
      reportService.getStockMovementReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
        await addVS1Data('TProductMovementList', JSON.stringify(data));
        templateObject.displayReportData(data);
      }).catch(function (err) {

      });
    });
  }

  templateObject.getReportData(
    GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
    GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
    false
  );
  templateObject.displayReportData = async function (data) {
    var splashArrayReport = new Array();
    let deleteFilter = false;

    for (let i = 0; i < data.tstockmovement.length; i++) {
      var dataList = [
        GlobalFunctions.generateSpan(data.tstockmovement[i].fields.Lines[0].fields.ProductName, "table-cells text-bold"),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ];
      splashArrayReport.push(dataList);
      for (let j = 0; j < 1; j++){
        let tmp = data.tstockmovement[i].fields.Lines[j].fields.Qty;
        dataList = [
          "",
          GlobalFunctions.generateSpan(GlobalFunctions.formatDate(data.tstockmovement[i].fields.Lines[j].fields.TransDate), "text-primary"),
          "",
          "",
          tmp > 0 ? GlobalFunctions.generateSpan(tmp, "text-primary") : GlobalFunctions.generateSpan(tmp, "text-danger"),
          tmp > 0 ? GlobalFunctions.generateSpan(tmp, "text-primary") : GlobalFunctions.generateSpan(tmp, "text-danger"),
          tmp > 0 ? GlobalFunctions.generateSpan(tmp, "text-primary") : GlobalFunctions.generateSpan(tmp, "text-danger"),
          GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(data.tstockmovement[i].fields.Lines[j].fields.Cost), "text-primary", "text-right"),
          GlobalFunctions.generateSpan(GlobalFunctions.showCurrency(""), "text-primary", "text-right"),
        ];
        splashArrayReport.push(dataList);
      }
      templateObject.records.set(splashArrayReport);
    }


    if (templateObject.records.get()) {
      setTimeout(function () {
        MakeNegative();
      }, 100);
    }
    //$('.fullScreenSpin').css('display','none');

    setTimeout(function () {
      $('#tableExport').DataTable({
        data: splashArrayReport,
        searching: false,
        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        columnDefs: [
          {
            targets: 0,
            className: "colCompanyName",
          },
          {
            targets: 1,
            className: "colJobName"
          },
          {
            targets: 2,
            className: "colJobNumber"
          },
          {
            targets: 3,
            className: "colTxnType",
          },
          {
            targets: 4,
            className: "colTxnNo",
          },
          {
            targets: 5,
            className: "colCostEx",
          },
          {
            targets: 6,
            className: "colIncomeEx",
          },
          {
            targets: 7,
            className: "colQuotedEx",
          },
          {
            targets: 8,
            className: "colDiffIncCost",
          },
          {
            targets: 9,
            className: "colDiffIncByCost",
          },
          {
            targets: 10,
            className: "colDiffIncQuote",
          },
          {
            targets: 11,
            className: "colDiffIncByQuote",
          },
          {
            targets: 12,
            className: "colBackorders",
          },
          {
            targets: 13,
            className: "colAccountName",
          },
          {
            targets: 14,
            className: "colDebitEx"
          },
          {
            targets: 15,
            className: "colCreditEx"
          },
          {
            targets: 16,
            className: "colProfitpercent",
          },
          {
            targets: 17,
            className: "colDepartment",
          },
          {
            targets: 18,
            className: "colProduct",
          },
          {
            targets: 19,
            className: "colSubGroup",
          },
          {
            targets: 20,
            className: "colType",
          },
          {
            targets: 21,
            className: "colDept",
          },
          {
            targets: 22,
            className: "colArea",
          },
          {
            targets: 23,
            className: "colLandedCost",
          },
          {
            targets: 24,
            className: "colLatestcost",
          },
          {
            targets: 25,
            className: "colDiffIncLandedcost",
          },
          {
            targets: 26,
            className: "colDiffIncByLandedcost",
          },
          {
            targets: 27,
            className: "colDiffIncLatestcost"
          },
          {
            targets: 28,
            className: "colDiffIncByLatestcost"
          },
          {
            targets: 29,
            className: "colOrderd",
          },
          {
            targets: 30,
            className: "colShipped",
          },
          {
            targets: 31,
            className: "colBackOrdered",
          },
          {
            targets: 32,
            className: "colCUSTFLD1",
          },
          {
            targets: 33,
            className: "colCUSTFLD2",
          },
          {
            targets: 34,
            className: "colCUSTFLD3",
          },
          {
            targets: 35,
            className: "colCUSTFLD4",
          },
          {
            targets: 36,
            className: "colCUSTFLD5",
          },
          {
            targets: 37,
            className: "colCUSTFLD6",
          },
          {
            targets: 38,
            className: "colCUSTFLD7",
          },
          {
            targets: 39,
            className: "colCUSTFLD8",
          },
          {
            targets: 40,
            className: "colCUSTFLD9"
          },
          {
            targets: 41,
            className: "colCUSTFLD10"
          },
          {
            targets: 42,
            className: "colCUSTFLD11",
          },
          {
            targets: 43,
            className: "colCUSTFLD12",
          },
          {
            targets: 44,
            className: "colCUSTFLD13",
          },
          {
            targets: 45,
            className: "colCUSTFLD14",
          },
          {
            targets: 46,
            className: "colCUSTFLD15",
          },
          {
            targets: 47,
            className: "colProfitdoller",
          },
          {
            targets: 48,
            className: "colTransDate",
          },
          {
            targets: 49,
            className: "colSupplierID hiddenColumn",
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
          $('#tableExport').DataTable().ajax.reload();
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

// Template.stockmovementreport.onRendered(() => {
//   const templateObject = Template.instance();
//   LoadingOverlay.show();

//   let reset_data = [
//     { index: 1, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "" },
//     { index: 2, label: 'Transaction Type', class: 'colTrType', active: true, display: true, width: "" },
//     { index: 3, label: 'Transaction No', class: 'colTrNo', active: true, display: true, width: "" },
//     { index: 4, label: 'Quantity Opening', class: 'colOpening', active: true, display: true, width: "" },
//     { index: 5, label: 'Quantity Current', class: 'colCurrent', active: true, display: true, width: "" },
//     { index: 6, label: 'Quantity Running', class: 'colRunning', active: true, display: true, width: "" },
//     { index: 7, label: 'Average Unit Cost', class: 'colAvUnitCost', active: true, display: true, width: "" },
//     { index: 8, label: 'Average Total Cost', class: 'colAvTotalCost', active: true, display: true, width: "" },
//     { index: 9, label: 'Amount(Ex) Unit Cost', class: 'colAmUnitCost', active: true, display: true, width: "" },
//     { index: 10, label: 'Amount(Ex) Total Cost', class: 'colAmTotalCost', active: true, display: true, width: "" },
//     { index: 11, label: 'Department Name', class: 'colDepartmentName', active: false, display: true, width: "" },
//     { index: 12, label: 'TransDate', class: 'colTransDate', active: false, display: true, width: "" },
//     { index: 13, label: 'Actual Date', class: 'colActualDate', active: false, display: true, width: "" },
//     { index: 14, label: 'Sub Group', class: 'colSubGroup', active: false, display: true, width: "" },
//     { index: 15, label: 'Type', class: 'colType', active: false, display: true, width: "" },
//     { index: 16, label: 'Dept', class: 'colDept', active: false, display: true, width: "" },
//   ]
//   templateObject.stockmovementreportth.set(reset_data);

//   templateObject.initDate = () => {
//     Datehandler.initOneMonth();
//   };


//   templateObject.setDateAs = (dateFrom = null) => {
//     templateObject.dateAsAt.set((dateFrom) ? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
//   };
//   templateObject.getStockMovementReportData = async function (dateFrom, dateTo, ignoreDate) {
//     templateObject.setDateAs(dateFrom);
//     $(".fullScreenSpin").css("display", "inline-block");
//     let data = [];
//     if (!localStorage.getItem('VS1StockMovement_Report')) {
//       const options = await templateObject.reportOptions.get();
//       let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
//       let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
//       let ignoreDate = options.ignoreDate || false;
//       data = await reportService.getStockMovementReport(dateFrom, dateTo, ignoreDate);
//       if (data.tproductmovementlist.length > 0) {
//         localStorage.setItem('VS1StockMovement_Report', JSON.stringify(data) || '');
//       }
//     } else {
//       data = JSON.parse(localStorage.getItem('VS1StockMovement_Report'));
//     }
//     let movementReport = [];
//     if (data.tproductmovementlist.length > 0) {
//       let reportGroups = [];
//       for (const item of data.tproductmovementlist) {
//         let isExist = reportGroups.filter((subitem) => {
//           if (subitem.ID == item.ProductID) {
//             subitem.SubAccounts.push(item)
//             return subitem
//           }
//         });

//         if (isExist.length == 0) {
//           if (item.TranstypeDesc != 'Opening Balance') {
//             reportGroups.push({
//               ID: item.ProductID,
//               ProductName: item.ProductName,
//               SubAccounts: [item],
//               TotalRunningQty: 0,
//               TotalCurrentQty: 0,
//               TotalUnitCost: 0
//             });
//           }
//         }
//       }

//       movementReport = reportGroups.filter((item) => {
//         let TotalRunningQty = 0;
//         let TotalCurrentQty = 0;
//         let TotalUnitCost = 0;
//         item.SubAccounts.map((subitem) => {
//           TotalRunningQty += subitem.Qty;
//           TotalCurrentQty += subitem.Qty;
//           TotalUnitCost += subitem.Cost;
//         });
//         item.SubAccounts.sort(function (a, b) {
//           return new Date(b.TransactionDate) - new Date(a.TransactionDate);
//         });
//         item.TotalRunningQty = TotalRunningQty;
//         item.TotalCurrentQty = TotalCurrentQty;
//         item.TotalUnitCost = TotalUnitCost;
//         return item;
//       });
//     }
//     templateObject.records.set(movementReport);
//     setTimeout(function () {
//       MakeNegative();
//     }, 1000);
//     $(".fullScreenSpin").css("display", "none");
//   }


//   templateObject.initUploadedImage = () => {
//     let imageData = localStorage.getItem("Image");
//     if (imageData) {
//       $("#uploadedImage").attr("src", imageData);
//       $("#uploadedImage").attr("width", "50%");
//     }
//   };

//   templateObject.getStockMovementReportData(
//     GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
//     GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
//     false
//   );

//   templateObject.setDateAs(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()))


//   templateObject.initDate();
//   templateObject.initUploadedImage();
//   LoadingOverlay.hide();
// });

Template.stockmovementreport.events({
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
  "click .btnRefresh": async function () {
    // $(".fullScreenSpin").css("display", "inline-block");
    // localStorage.setItem("VS1StockMovement_Report", "");
    // Meteor._reload.reload();
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    const options = await templateObject.reportOptions.get();
    let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    let ignoreDate = options.ignoreDate || false;
    localStorage.setItem('VS1StockMovement_Report', '');
    await templateObject.setReportOptions(ignoreDate, dateFrom, dateTo);
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

    const filename = loggedCompany + "- Stock Movement Report" + ".csv";
    utilityService.exportReportToCsvTable("tableExport", filename, "csv");
    let rows = [];
  },
  "click .btnPrintReport": function (event) {
    playPrintAudio();
    setTimeout(function () {
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

      document.title = "Stock Movement Report";
      $(".printReport").print({
        title: "Stock Movement Report | " + loggedCompany,
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
  "change .edtReportDates": async function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));
    localStorage.setItem('VS1StockMovement_Report', '');
  },
  // "click #lastMonth": async function () {
  //   $(".fullScreenSpin").css("display", "block");
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
  //   localStorage.setItem('VS1StockMovement_Report', '');
  //   await templateObject.setReportOptions(false, fromDate, endDate);
  //   templateObject.dateAsAt.set($('#dateTo').val());
  // },
  // "click #lastQuarter": async function () {
  //   $(".fullScreenSpin").css("display", "block");
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "Q").startOf("Q").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "Q").endOf("Q").format("YYYY-MM-DD");
  //   localStorage.setItem('VS1StockMovement_Report', '');
  //   await templateObject.setReportOptions(false, fromDate, endDate);
  //   templateObject.dateAsAt.set($('#dateTo').val());
  // },
  // "click #last12Months": async function () {
  //   $(".fullScreenSpin").css("display", "block");
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
  //   localStorage.setItem('VS1StockMovement_Report', '');
  //   await templateObject.setReportOptions(false, getDateFrom, getLoadDate);
  //   templateObject.dateAsAt.set($('#dateTo').val());
  // },
  // "click #ignoreDate": async function () {
  //   let templateObject = Template.instance();
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   templateObject.dateAsAt.set("Current Date");
  //   localStorage.setItem('VS1StockMovement_Report', '');
  //   await templateObject.setReportOptions(true);
  // },
  "click #ignoreDate": (e, templateObject) => {
    localStorage.setItem("VS1StockMovement_Report", "");
    templateObject.getStockMovementReportData(
      null,
      null,
      true
    )
  },
  "change #dateTo, change #dateFrom": (e) => {
    let templateObject = Template.instance();
    localStorage.setItem("VS1StockMovement_Report", "");
    templateObject.getStockMovementReportData(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    )
  },
  ...Datehandler.getDateRangeEvents(),
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

Template.stockmovementreport.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  stockmovementreportth: () => {
    return Template.instance().stockmovementreportth.get();
  },
  records: () => {
    return Template.instance().records.get();
  },
  redirectionType(item) {
    if (item.TranstypeDesc === 'Purchase Order') {
      return '/purchaseordercard?id=' + item.TransactionNo;
    } else if (item.TranstypeDesc === 'Invoice') {
      return '/invoicecard?id=' + item.TransactionNo;
    } else if (item.TranstypeDesc === 'Refund') {
      return 'refundcard?id=' + item.TransactionNo;
    } else if (item.TranstypeDesc === 'Stock Adjustment') {
      return '#noInfoFound';
      return '/stockadjustmentcard?id=' + item.TransactionNo;
    } else if (item.TranstypeDesc === 'Sales Order') {
      return '/salesordercard?id=' + item.TransactionNo;
    } else if (item.TranstypeDesc === 'Sales Order (Man)') {
      return '/salesordercard?id=' + item.TransactionNo;
    } else if (item.TranstypeDesc === 'Opening Balance') {
      return '#noInfoFound';
    } else if (item.TranstypeDesc === 'TMergedSalesLines') {
      return '#noInfoFound';
    } else if (item.TranstypeDesc === 'Seed To Sale') {
      return '#noInfoFound';
    } else if (item.TranstypeDesc === 'Cash Sale') {
      return '#noInfoFound';
    } else if (item.TranstypeDesc === 'POS') {
      return '#noInfoFound';
    } else if (item.TranstypeDesc === 'Return Authority') {
      return '#noInfoFound';
    } else if (item.TranstypeDesc === 'Stock Transfer') {
      return '#noInfoFound';
    } else if (item.TranstypeDesc === 'Repairs') {
      return '#noInfoFound';
    } else if (item.TranstypeDesc === 'Layby') {
      return '#noInfoFound';
    } else {
      return '#noInfoFound';
    }
  },
  formatPrice(amount) {
    let utilityService = new UtilityService();
    if (isNaN(amount)) {
      amount = (amount === undefined || amount === null || amount.length === 0) ? 0 : amount;
      amount = (amount) ? Number(amount.replace(/[^0-9.-]+/g, "")) : 0;
    }
    return utilityService.modifynegativeCurrencyFormat(amount) || 0.00;
  },
  checkZero(value) {
    return (value == 0) ? '' : value;
  },
  formatDate: (date) => {
    return (date) ? moment(date).format("YYYY/MM/DD") : '';
  },

  // FX Module //
  convertAmount: (amount, currencyData) => {
    let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

    if (isNaN(amount)) {
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
