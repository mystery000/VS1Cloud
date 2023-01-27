import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import JobSalesApi from "../../js/Api/JobSaleApi";
import CachedHttp from "../../lib/global/CachedHttp";
import GlobalFunctions from "../../GlobalFunctions";
import Datehandler from "../../DateHandler";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import { Template } from 'meteor/templating';
import "./jobsalessummary.html"

let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();


let defaultCurrencyCode = CountryAbbr;

Template.jobsalessummary.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();

  templateObject.transactiondatatablerecords = new ReactiveVar([]);
  templateObject.jobsalessummaryth = new ReactiveVar([]);


  FxGlobalFunctions.initVars(templateObject);
});

Template.jobsalessummary.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  templateObject.init_reset_data = function () {
    let reset_data = [];
    reset_data = [
      { index: 1, label: 'Customer', class: 'colCustomer', active: true, display: true, width: "100" },
      { index: 2, label: 'Job Customer', class: 'colJobCustomer', active: true, display: true, width: "150" },
      { index: 3, label: 'Job Number', class: 'colJobNumber', active: true, display: true, width: "100" },
      { index: 4, label: 'Job Name', class: 'colJobName', active: true, display: true, width: "100" },
      { index: 5, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
      { index: 6, label: 'Qty Shipped', class: 'colQtyShipped', active: true, display: true, width: "100" },
      { index: 7, label: 'Discount', class: 'colDiscount', active: true, display: true, width: "100" },
      { index: 8, label: 'Tax', class: 'colTax', active: true, display: true, width: "100" },
      { index: 9, label: 'Amount Ex', class: 'colAmountEx', active: true, display: true, width: "100" },
      { index: 10, label: 'Amount Inc', class: 'colAmountInc', active: true, display: true, width: "100" },
      { index: 11, label: 'DetailType', class: 'colDetailType', active: false, display: true, width: "100" },
      { index: 12, label: 'ParentClientID', class: 'colParentClientID', active: false, display: true, width: "100" },
      { index: 13, label: 'ClientID', class: 'colClientID', active: false, display: true, width: "100" },
    ]

    templateObject.jobsalessummaryth.set(reset_data);
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
    getVS1Data('TJobSalesSummary').then(function (dataObject) {
      if (dataObject.length == 0) {
        reportService.getJobSalesSummaryReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
          await addVS1Data('TJobSalesSummary', JSON.stringify(data));
          templateObject.displayReportData(data);
        }).catch(function (err) {
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.displayReportData(data);
      }
    }).catch(function (err) {
      reportService.getJobSalesSummaryReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
        await addVS1Data('TJobSalesSummary', JSON.stringify(data));
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
    if (data.Params.Search.replace(/\s/g, "") == "") {
      deleteFilter = true;
    } else {
      deleteFilter = false;
    };

    for (let i = 0; i < data.tjobsalessummary.length; i++) {
      var dataList = [
        data.tjobsalessummary[i].Customer || "",
        data.tjobsalessummary[i].JobCustomer || "",
        data.tjobsalessummary[i].CustomerJobNumber || "",
        data.tjobsalessummary[i].JobName || "",
        data.tjobsalessummary[i].ProductName || "",
        data.tjobsalessummary[i].QtyShipped || "",
        data.tjobsalessummary[i].TotalDiscount || "",
        data.tjobsalessummary[i].TotalTax || "",
        data.tjobsalessummary[i].TotalAmountEx || "",
        data.tjobsalessummary[i].TotalAmountInc || "",
        data.tjobsalessummary[i].DetailType || "",
        data.tjobsalessummary[i].ParentClientID || "",
        data.tjobsalessummary[i].ClientID || "",
      ];
      splashArrayReport.push(dataList);
      templateObject.transactiondatatablerecords.set(splashArrayReport);
    }


    if (templateObject.transactiondatatablerecords.get()) {
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
            className: "colCustomer",
          },
          {
            targets: 1,
            className: "colJobCustomer"
          },
          {
            targets: 2,
            className: "colJobNumber"
          },
          {
            targets: 3,
            className: "colJobName",
          },
          {
            targets: 4,
            className: "colProductID",
          },
          {
            targets: 5,
            className: "colQtyShipped",
          },
          {
            targets: 6,
            className: "colDiscount",
          },
          {
            targets: 7,
            className: "colTax",
          },
          {
            targets: 8,
            className: "colAmountEx",
          },
          {
            targets: 9,
            className: "colAmountInc",
          },
          {
            targets: 10,
            className: "colDetailType hiddenColumn",
          },
          {
            targets: 11,
            className: "colParentClientID hiddenColumn",
          },
          {
            targets: 12,
            className: "colClientID hiddenColumn",
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

// Template.jobsalessummary.onRendered(() => {

//   LoadingOverlay.show();
//   const templateObject = Template.instance();
//   // const jobSalesApi = new JobSalesApi();

//   let reset_data = [] ;
//   reset_data = [
//     { index: 1, label: 'Customer ID', class:'colCustomerID', active: true, display: true, width: "85" },
//     { index: 2, label: 'Contact Name', class:'colContactName', active: true, display: true, width: "85" },
//     { index: 3, label: 'Job Customer Name', class:'colJobCustomerName', active: true, display: true, width: "85" },
//     { index: 4, label: 'Job Name', class:'colJobName', active: true, display: true, width: "85" },
//     { index: 5, label: 'Sale Date Time', class:'colSaleDateTime', active: true, display: true, width: "85" },
//     { index: 6, label: 'Sale Total Ex', class:'colSaleTotalEx', active: true, display: true, width: "85" },
//     { index: 7, label: 'Sale Amount Inc', class:'colSaleAmountInc', active: true, display: true, width: "85" },
//     { index: 8, label: 'Sale Tax', class:'colSaleTax', active: true, display: true, width: "85" },
//     { index: 9, label: 'Sale Cust Field1', class:'colSaleCustField1', active: true, display: true, width: "85" },
//     { index: 10, label: 'Sale Cust Field2', class:'colSaleCustField2', active: true, display: true, width: "85" },
//     { index: 11, label: 'Sale Cust Field3', class:'colSaleCustField3', active: true, display: true, width: "85" },
//     { index: 12, label: 'Sale Cust Field4', class:'colSaleCustField4', active: true, display: true, width: "85" },
//     { index: 13, label: 'Sale Cust Field5', class:'colSaleCustField5', active: true, display: true, width: "85" },
//     { index: 14, label: 'Sale Cust Field6', class:'colSaleCustField6', active: true, display: true, width: "85" },
//     { index: 15, label: 'Sale Cust Field7', class:'colSaleCustField7', active: true, display: true, width: "85" },
//     { index: 16, label: 'Sale Cust Field8', class:'colSaleCustField8', active: true, display: true, width: "85" },
//     { index: 17, label: 'Sale Cust Field9', class:'colSaleCustField9', active: true, display: true, width: "85" },
//     { index: 18, label: 'Sale Cust Field10', class:'colSaleCustField10', active: true, display: true, width: "85" },
//     { index: 19, label: 'Product ID', class:'colProductID', active: true, display: true, width: "85" },
//     { index: 20, label: 'Uom Qty Shipped', class:'colUomQtyShipped', active: true, display: true, width: "85" },
//     { index: 21, label: 'Uom Name', class:'colUomName', active: true, display: true, width: "85" },
//     { index: 22, label: 'Amount Ex', class:'colAmountEx', active: true, display: true, width: "85" },
//     { index: 23, label: 'Amount Inc', class:'colAmountInc', active: true, display: true, width: "85" },
//     { index: 24, label: 'Amount Tax', class:'colAmountTax', active: true, display: true, width: "85" },
//     { index: 25, label: 'Tax Code', class:'colTaxCode', active: true, display: true, width: "85" },
//     { index: 26, label: 'Amount Discount', class:'colAmountDiscount', active: true, display: true, width: "85" },
//     { index: 27, label: 'Discount Per Unit', class:'colDiscountPerUnit', active: true, display: true, width: "85" },
//     { index: 28, label: 'DetailType', class:'colDetailType', active: false, display: true, width: "85" },
//     { index: 29, label: 'CustomerID', class:'colCustomerID', active: false, display: true, width: "85" },
//     { index: 30, label: 'ClientNo', class:'colClientNo', active: false, display: true, width: "85" },
//     { index: 31, label: 'CustomerType', class:'colCustomerType', active: false, display: true, width: "85" },
//     { index: 32, label: 'CustomerStreet', class:'colCustomerStreet', active: false, display: true, width: "85" },
//     { index: 33, label: 'CustomerStreet2', class:'colCustomerStreet2', active: false, display: true, width: "85" },
//     { index: 34, label: 'CustomerStreet3', class:'colCustomerStreet3', active: false, display: true, width: "85" },
//     { index: 35, label: 'Suburb', class:'colSuburb', active: false, display: true, width: "85" },
//     { index: 36, label: 'State', class:'colState', active: false, display: true, width: "85" },
//     { index: 37, label: 'CustomerPostcode', class:'colCustomerPostcode', active: false, display: true, width: "85" },
//     { index: 39, label: 'JobID', class:'colJobID', acticve: false, display: true, width: "85" },
//     { index: 40, label: 'JobClientNo', class:'colJobClientNo', active: false, display: true, width: "85" },
//     { index: 41, label: 'JobRegistration', class:'colJobRegistration', active: false, display: true, width: "85" },
//     { index: 42, label: 'JobNumber', class:'colJobNumber', active: false, display: true, width: "85" },
//     { index: 43, label: 'JobWarrantyPeriod', class:'colJobWarrantyPeriod', active: false, display: true, width: "85" },
//     { index: 44, label: 'JobNotes', class:'colJobNotes', active: false, display: true, width: "85" },
//     { index: 45, label: 'SaleCustomerName', class:'colSaleCustomerName', active: false, display: true, width: "85" },
//     { index: 46, label: 'SaleDate', class:'colSaleDate', active: false, display: true, width: "85" },
//     { index: 47, label: 'SaleDepartment', class:'colSaleDepartment', active: false, display: true, width: "85" },
//     { index: 48, label: 'SaleComments', class:'colSaleComments', active: false, display: true, width: "85" },
//     { index: 49, label: 'SaleTerms', class:'colSaleTerms', active: false, display: true, width: "85" },
//     { index: 50, label: 'SaleCustomerName', class:'colSaleCustomerName', active: false, display: true, width: "85" },
//     { index: 51, label: 'DocketNumber', class:'colDocketNumber', active: false, display: true, width: "85" },
//     { index: 52, label: 'MemoLine', class:'colMemoLine', active: false, display: true, width: "85" },
//     { index: 53, label: 'UomQtySold', class:'colUomQtySold', active: false, display: true, width: "85" },
//     { index: 54, label: 'UomQtyBackorder ', class:'colUomQtyBackorder', active: false, display: true, width: "85" },
//   ];

//   templateObject.jobsalessummaryth.set(reset_data);


//   templateObject.initDate = () => {
//     Datehandler.initOneMonth();
//   };

//   templateObject.initDate();

//   templateObject.setDateAs = ( dateFrom = null ) => {
//     templateObject.dateAsAt.set( ( dateFrom )? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY") )
//   };

//   templateObject.initUploadedImage = () => {
//     let imageData = localStorage.getItem("Image");
//     if (imageData) {
//       $("#uploadedImage").attr("src", imageData);
//       $("#uploadedImage").attr("width", "50%");
//     }
//   };

//   templateObject.loadReport = async (dateFrom, dateTo, ignoreDate = false) => {
//     templateObject.setDateAs(dateFrom);
//     LoadingOverlay.show();


//     let data = await CachedHttp.get(jobSalesApi.collectionNames.TJobSalesSummary, async () => {

//       let endPoint = jobSalesApi.collection.findByName(jobSalesApi.collectionNames.TJobSalesSummary);

//       endPoint.url.searchParams.set('IgnoreDates', ignoreDate);
//       endPoint.url.searchParams.set('ListType', "'Summary'");
//       endPoint.url.searchParams.set('DateFrom', '"' + dateFrom + '"');
//       endPoint.url.searchParams.set('DateTo', '"' + dateTo + '"');

//       const response = await endPoint.fetch();

//       if(response.ok) {
//         let data = await response.json();

//         return data;
//       }

//     }, {
//       requestParams: {
//         DateFrom: dateFrom,
//         DateTo: dateTo,
//         IgnoreDates: ignoreDate
//       },
//       useIndexDb: true,
//       useLocalStorage: false,
//       validate: (cachedResponse) => {
//         if (GlobalFunctions.isSameDay(cachedResponse.response.Params.DateFrom, dateFrom)
//         && GlobalFunctions.isSameDay(cachedResponse.response.Params.DateTo, dateTo)
//         && cachedResponse.response.Params.IgnoreDates == ignoreDate) {
//           return true;
//         }
//         return false;
//       }
//     });

//     if(data.response.tjobsalessummary) {
//       let records = [];
//       const array = data.response.tjobsalessummary;
//       let customers = _.groupBy(array, 'Customer');

//       for(let key in customers) {
//         records.push({
//           title: key || "Other",
//           entries: customers[key],
//           total: {}
//         });
//       }


//       templateObject.reportRecords.set(records);
//     }


//     LoadingOverlay.hide();

//   }



//   templateObject.initDate();
//   templateObject.setDateAs();
//   templateObject.initUploadedImage();


//   templateObject.loadReport(
//     GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
//     GlobalFunctions.convertYearMonthDay($('#dateTo').val())
//   );

//   LoadingOverlay.hide();
// });

Template.jobsalessummary.events({
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1JobSalesSummary_Report", "");
    Meteor._reload.reload();
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
'change .custom-range': async function(event) {
  //   const tableHandler = new TableHandler();
    let range = $(event.target).val()||0;
    let colClassName = $(event.target).attr("valueclass");
    await $('.' + colClassName).css('width', range);
  //   await $('.colAccountTree').css('width', range);
    $('.dataTable').resizable();
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

    const filename = loggedCompany + "- Job Sales Summary" + ".csv";
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

    document.title = "Job Sales Summary";
    $(".printReport").print({
      title: "Job Sales Summary | " + loggedCompany,
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
  // "click #lastMonth": function () {
  //   let templateObject = Template.instance();

  //   $("#dateFrom").attr("readonly", false);
  //   $("#dateTo").attr("readonly", false);
  //   var currentDate = new Date();

  //   var prevMonthLastDate = new Date(
  //     currentDate.getFullYear(),
  //     currentDate.getMonth(),
  //     0
  //   );
  //   var prevMonthFirstDate = new Date(
  //     currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1),
  //     (currentDate.getMonth() - 1 + 12) % 12,
  //     1
  //   );

  //   var formatDateComponent = function (dateComponent) {
  //     return (dateComponent < 10 ? "0" : "") + dateComponent;
  //   };

  //   var formatDate = function (date) {
  //     return (
  //       formatDateComponent(date.getDate()) +
  //       "/" +
  //       formatDateComponent(date.getMonth() + 1) +
  //       "/" +
  //       date.getFullYear()
  //     );
  //   };

  //   var formatDateERP = function (date) {
  //     return (
  //       date.getFullYear() +
  //       "-" +
  //       formatDateComponent(date.getMonth() + 1) +
  //       "-" +
  //       formatDateComponent(date.getDate())
  //     );
  //   };

  //   var fromDate = formatDate(prevMonthFirstDate);
  //   var toDate = formatDate(prevMonthLastDate);

  //   $("#dateFrom").val(fromDate);
  //   $("#dateTo").val(toDate);

  //   var getLoadDate = formatDateERP(prevMonthLastDate);
  //   let getDateFrom = formatDateERP(prevMonthFirstDate);
  //   templateObject.dateAsAt.set(fromDate);

  //   // templateObject.getGeneralLedgerReports(getDateFrom, getLoadDate, false);
  //   templateObject.loadReport(getDateFrom, getLoadDate, false);
  // },
  // "click #lastQuarter": function () {
  //   let templateObject = Template.instance();

  //   $("#dateFrom").attr("readonly", false);
  //   $("#dateTo").attr("readonly", false);
  //   var currentDate = new Date();
  //   var begunDate = moment(currentDate).format("DD/MM/YYYY");

  //   var begunDate = moment(currentDate).format("DD/MM/YYYY");
  //   function getQuarter(d) {
  //     d = d || new Date();
  //     var m = Math.floor(d.getMonth() / 3) + 2;
  //     return m > 4 ? m - 4 : m;
  //   }

  //   var quarterAdjustment = (moment().month() % 3) + 1;
  //   var lastQuarterEndDate = moment()
  //     .subtract({ months: quarterAdjustment })
  //     .endOf("month");
  //   var lastQuarterStartDate = lastQuarterEndDate
  //     .clone()
  //     .subtract({ months: 2 })
  //     .startOf("month");

  //   var lastQuarterStartDateFormat =
  //     moment(lastQuarterStartDate).format("DD/MM/YYYY");
  //   var lastQuarterEndDateFormat =
  //     moment(lastQuarterEndDate).format("DD/MM/YYYY");

  //   templateObject.dateAsAt.set(lastQuarterStartDateFormat);
  //   $("#dateFrom").val(lastQuarterStartDateFormat);
  //   $("#dateTo").val(lastQuarterEndDateFormat);

  //   let fromDateMonth = getQuarter(currentDate);
  //   var quarterMonth = getQuarter(currentDate);
  //   let fromDateDay = currentDate.getDate();

  //   var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
  //   let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
  //   // templateObject.getGeneralLedgerReports(getDateFrom, getLoadDate, false);
  //   templateObject.loadReport(getDateFrom, getLoadDate, false);
  // },
  // "click #last12Months": function () {
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

  //   var fromDate =
  //     fromDateDay +
  //     "/" +
  //     fromDateMonth +
  //     "/" +
  //     Math.floor(currentDate.getFullYear() - 1);
  //   templateObject.dateAsAt.set(begunDate);
  //   $("#dateFrom").val(fromDate);
  //   $("#dateTo").val(begunDate);

  //   var currentDate2 = new Date();
  //   var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
  //   let getDateFrom =
  //     Math.floor(currentDate2.getFullYear() - 1) +
  //     "-" +
  //     Math.floor(currentDate2.getMonth() + 1) +
  //     "-" +
  //     currentDate2.getDate();
  //   // templateObject.getGeneralLedgerReports(getDateFrom, getLoadDate, false);

  //   templateObject.loadReport(getDateFrom, getLoadDate, false);

  // },
  // "click #ignoreDate":  (e, ui) => {
  //   $("#dateFrom").attr("readonly", true);
  //   $("#dateTo").attr("readonly", true);
  //    ui.dateAsAt.set("Current Date");
  //   // templateObject.getGeneralLedgerReports("", "", true);
  //   ui.loadReport(null, null, true);
  // },

  // CURRENCY MODULE
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
  },
  "click #ignoreDate":  (e, templateObject) => {
    templateObject.loadReport(
      null,
      null,
      true
    )
  },
  "change #dateTo, change #dateFrom": (e) => {
    let templateObject = Template.instance();
    localStorage.setItem("VS1JobSalesSummary_Report", "");
    templateObject.loadReport(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    )
  },
  ...Datehandler.getDateRangeEvents(),
});

Template.jobsalessummary.helpers({

  redirectionType(item) {
    return '#noInfoFound';
  },
  transactiondatatablerecords: () => {
    return Template.instance().transactiondatatablerecords.get();
  },
  jobsalessummaryth: () => {
    return Template.instance().jobsalessummaryth.get();
  },
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
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
  isObject: (variable) => {
    return typeof variable === "object" && variable !== null;
  },
  currency: () => {
    return Currency;
  },


  formatPrice( amount){

    let utilityService = new UtilityService();
    if( isNaN( amount ) ){
        amount = ( amount === undefined || amount === null || amount.length === 0 ) ? 0 : amount;
        amount = ( amount )? Number(amount.replace(/[^0-9.-]+/g,"")): 0;
    }
      return utilityService.modifynegativeCurrencyFormat(amount)|| 0.00;
  },


  formatTax( amount){

    let utilityService = new UtilityService();
    if( isNaN( amount ) ){
        amount = ( amount === undefined || amount === null || amount.length === 0 ) ? 0 : amount;
        amount = ( amount )? Number(amount.replace(/[^0-9.-]+/g,"")): 0;
    }
      return amount + "%" || "0.00 %";
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
