import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import GlobalFunctions from "../../GlobalFunctions";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import Datehandler from "../../DateHandler";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import { Template } from 'meteor/templating';
import "./binlocations.html";

let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();
let defaultCurrencyCode = CountryAbbr;

const currentDate = new Date();

Template.binlocationslist.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.reportOptions = new ReactiveVar([]);
  FxGlobalFunctions.initVars(templateObject);
  templateObject.records = new ReactiveVar([]);
  templateObject.binlocationslistth = new ReactiveVar([]);
});
function MakeNegative() {
  $('td').each(function(){
      if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
  });
}

Template.binlocationslist.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  templateObject.init_reset_data = function () {
    let reset_data = [];
    reset_data = [
      { index: 1, label: 'Department', class: 'colDepartment', active: true, display: true, width: "150" },
      { index: 2, label: 'Bin Location', class: 'colLocation', active: true, display: true, width: "150" },
      { index: 3, label: 'Bin No', class: 'colBinNumber', active: true, display: true, width: "150" },
      { index: 4, label: 'Volume Available', class: 'colVolumeAvailable', active: true, display: true, width: "150" },
      { index: 5, label: 'Volume Used', class: 'colVolumeUsed', active: true, display: true, width: "150" },
      { index: 6, label: 'Volume Total', class: 'colVolumeTotal', active: true, display: true, width: "150" },
      { index: 7, label: 'BinID', class: 'colBinID', active: true, display: true, width: "150" },
      { index: 8, label: 'ClassID', class: 'colClassID', active: true, display: true, width: "150" },
      { index: 9, label: 'GlobalRef', class: 'colGlobalRef', active: true, display: true, width: "150" },
    ]

    templateObject.binlocationslistth.set(reset_data);
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
    getVS1Data('TProductBin').then(function (dataObject) {
      if (dataObject.length == 0) {
        reportService.getBinLocationReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
          await addVS1Data('TProductBin', JSON.stringify(data));
          templateObject.displayReportData(data);
        }).catch(function (err) {
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.displayReportData(data);
      }
    }).catch(function (err) {
      reportService.getBinLocationReport(dateFrom, dateTo, ignoreDate).then(async function (data) {
        await addVS1Data('TProductBin', JSON.stringify(data));
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
    // if (data.Params.Search.replace(/\s/g, "") == "") {
    //   deleteFilter = true;
    // } else {
    //   deleteFilter = false;
    // };
    for (let i = 0; i < data.tproductbin.length; i++) {
      var dataList = [
        data.tproductbin[i].fields.BinClassName || "",
        data.tproductbin[i].fields.BinLocation || "",
        data.tproductbin[i].fields.BinNumber || 0,
        data.tproductbin[i].fields.BinVolumeAvailable || 0,
        data.tproductbin[i].fields.BinVolumeUsed || 0,
        (data.tproductbin[i].fields.BinVolumeUsed - 0) + (data.tproductbin[i].fields.BinVolumeAvailable - 0),
        data.tproductbin[i].fields.ID || "",
        "",
        data.tproductbin[i].fields.GlobalRef || "",
      ];
      splashArrayReport.push(dataList);
    }
    splashArrayReport.sort(GlobalFunctions.sortFunction);

    let T_AccountName = "", j, customerProductReport = [];
    console.log(splashArrayReport);

    for(let i = 0 ; i < splashArrayReport.length ; i ++){
      if(T_AccountName != splashArrayReport[i][0]) {
        T_AccountName = splashArrayReport[i][0];
        customerProductReport.push([
          GlobalFunctions.generateSpan(`${T_AccountName}`, "table-cells text-bold"),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
      }
      T_AccountName = splashArrayReport[i][0];
      splashArrayReport[i][0] = "";

      splashArrayReport[i][1] = GlobalFunctions.generateSpan(splashArrayReport[i][1], 'table-cells');
      splashArrayReport[i][2] = GlobalFunctions.generateSpan(splashArrayReport[i][2], 'table-cells');
      splashArrayReport[i][3] = GlobalFunctions.generateSpan(splashArrayReport[i][3], 'text-success text-bold');
      splashArrayReport[i][4] = GlobalFunctions.generateSpan(splashArrayReport[i][4], 'text-success text-bold');
      splashArrayReport[i][5] = GlobalFunctions.generateSpan(splashArrayReport[i][5], 'text-success text-bold');
      splashArrayReport[i][6] = GlobalFunctions.generateSpan(splashArrayReport[i][6], 'table-cells');
      splashArrayReport[i][7] = GlobalFunctions.generateSpan(splashArrayReport[i][7], 'table-cells');

      customerProductReport.push(splashArrayReport[i]);
    }
    templateObject.records.set(customerProductReport);

    if (templateObject.records.get()) {
      setTimeout(function () {
        MakeNegative();
      }, 100);
    }
    //$('.fullScreenSpin').css('display','none');
  console.log(customerProductReport);
    setTimeout(function () {
      $('#tableExport').DataTable({
        data: customerProductReport,
        searching: false,
        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        columnDefs: [
          {
            targets: 0,
            className: "colDepartment",
          },
          {
            targets: 1,
            className: "colBinLocation"
          },
          {
            targets: 2,
            className: "colBinNo"
          },
          {
            targets: 3,
            className: "colVolumeAvailable",
          },
          {
            targets: 4,
            className: "colVolumeUsed",
          },
          {
            targets: 5,
            className: "colVolumeTotal",
          },
          {
            targets: 6,
            className: "colBinID",
          },
          {
            targets: 7,
            className: "colClassID",
          },
          {
            targets: 8,
            className: "colGlobalRef",
          },
          // {
          //   targets: 9,
          //   className: "colDiffIncByCost",
          // },
          // {
          //   targets: 10,
          //   className: "colDiffIncQuote",
          // },
          // {
          //   targets: 11,
          //   className: "colDiffIncByQuote",
          // },
          // {
          //   targets: 12,
          //   className: "colBackorders",
          // },
          // {
          //   targets: 13,
          //   className: "colAccountName",
          // },
          // {
          //   targets: 14,
          //   className: "colDebitEx"
          // },
          // {
          //   targets: 15,
          //   className: "colCreditEx"
          // },
          // {
          //   targets: 16,
          //   className: "colProfitpercent",
          // },
          // {
          //   targets: 17,
          //   className: "colDepartment",
          // },
          // {
          //   targets: 18,
          //   className: "colProduct",
          // },
          // {
          //   targets: 19,
          //   className: "colSubGroup",
          // },
          // {
          //   targets: 20,
          //   className: "colType",
          // },
          // {
          //   targets: 21,
          //   className: "colDept",
          // },
          // {
          //   targets: 22,
          //   className: "colArea",
          // },
          // {
          //   targets: 23,
          //   className: "colLandedCost",
          // },
          // {
          //   targets: 24,
          //   className: "colLatestcost",
          // },
          // {
          //   targets: 25,
          //   className: "colDiffIncLandedcost",
          // },
          // {
          //   targets: 26,
          //   className: "colDiffIncByLandedcost",
          // },
          // {
          //   targets: 27,
          //   className: "colDiffIncLatestcost"
          // },
          // {
          //   targets: 28,
          //   className: "colDiffIncByLatestcost"
          // },
          // {
          //   targets: 29,
          //   className: "colOrderd",
          // },
          // {
          //   targets: 30,
          //   className: "colShipped",
          // },
          // {
          //   targets: 31,
          //   className: "colBackOrdered",
          // },
          // {
          //   targets: 32,
          //   className: "colCUSTFLD1",
          // },
          // {
          //   targets: 33,
          //   className: "colCUSTFLD2",
          // },
          // {
          //   targets: 34,
          //   className: "colCUSTFLD3",
          // },
          // {
          //   targets: 35,
          //   className: "colCUSTFLD4",
          // },
          // {
          //   targets: 36,
          //   className: "colCUSTFLD5",
          // },
          // {
          //   targets: 37,
          //   className: "colCUSTFLD6",
          // },
          // {
          //   targets: 38,
          //   className: "colCUSTFLD7",
          // },
          // {
          //   targets: 39,
          //   className: "colCUSTFLD8",
          // },
          // {
          //   targets: 40,
          //   className: "colCUSTFLD9"
          // },
          // {
          //   targets: 41,
          //   className: "colCUSTFLD10"
          // },
          // {
          //   targets: 42,
          //   className: "colCUSTFLD11",
          // },
          // {
          //   targets: 43,
          //   className: "colCUSTFLD12",
          // },
          // {
          //   targets: 44,
          //   className: "colCUSTFLD13",
          // },
          // {
          //   targets: 45,
          //   className: "colCUSTFLD14",
          // },
          // {
          //   targets: 46,
          //   className: "colCUSTFLD15",
          // },
          // {
          //   targets: 47,
          //   className: "colProfitdoller",
          // },
          // {
          //   targets: 48,
          //   className: "colTransDate",
          // },
          // {
          //   targets: 49,
          //   className: "colSupplierID hiddenColumn",
          // },
        ],
        select: true,
        destroy: true,
        colReorder: true,
        pageLength: initialDatatableLoad,
        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
        info: true,
        responsive: false,
        "bsort": false,
        "order": [],
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

// Template.binlocationslist.onRendered(() => {
//   const templateObject = Template.instance();
//   LoadingOverlay.show();

//   reset_data = [
//     { index: 1, label: 'Department', class: 'colDepartment', active: true, display: true, width: "" },
//     { index: 2, label: 'Location', class: 'colLocation', active: true, display: true, width: "" },
//     { index: 3, label: 'Bin Number', class: 'colBinNumber', active: true, display: true, width: "" },
//     { index: 4, label: 'Volume Total', class: 'colVolumeTotal', active: true, display: true, width: "" },
//     { index: 5, label: 'Volume Used', class: 'colVolumeUsed', active: true, display: true, width: "" },
//     { index: 6, label: 'Volume Available', class: 'colVolumeAvailable', active: true, display: true, width: "" },
//     { index: 7, label: 'Active', class: 'colActive', active: true, display: true, width: "" },
//     { index: 8, label: 'GlobalRef', class: 'colGlobalRef', active: false, display: true, width: "" },
//     { index: 9, label: 'BinID', class: 'colBinID', active: false, display: true, width: "" },
//     { index: 10, label: 'ClassID', class: 'colClassID', active: false, display: true, width: "" },
//   ]
//   templateObject.binlocationslistth.set(reset_data);

//   templateObject.initDate = () => {
//     Datehandler.initOneMonth();
//   };
//   templateObject.setDateAs = ( dateFrom = null ) => {
//     templateObject.dateAsAt.set( ( dateFrom )? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY") )
//   };

//   templateObject.getBinLocationReportData = async function (dateFrom, dateTo, ignoreDate) {
//     $(".fullScreenSpin").css("display", "inline-block");
//     templateObject.setDateAs(dateFrom);
//     let data = [];
//     if (!localStorage.getItem('VS1BinLocations_Report')) {
//       const options = await templateObject.reportOptions.get();
//       let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
//       let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
//       let ignoreDate = options.ignoreDate || false;
//       data = await reportService.getBinLocationReport( dateFrom, dateTo, ignoreDate);
//       if( data.tproductbin.length > 0 ){
//         localStorage.setItem('VS1BinLocations_Report', JSON.stringify(data)||'');
//       }
//     }else{
//       data = JSON.parse(localStorage.getItem('VS1BinLocations_Report'));
//     }

//     let reportGroups = [];
//     if( data.tproductbin.length > 0 ){
//         for (const item of data.tproductbin) {
//             let isExist = reportGroups.filter((subitem) => {
//                 if( subitem.BinClassName == item.fields.BinClassName ){
//                     subitem.SubAccounts.push(item)
//                     return subitem
//                 }
//             });

//             if( isExist.length == 0 ){
//                 reportGroups.push({
//                     SubAccounts: [item],
//                     ...item.fields
//                 });
//             }
//         }
//     }
//     templateObject.records.set(reportGroups);
//     setTimeout(function() {
//         MakeNegative();
//     }, 1000);
//     $(".fullScreenSpin").css("display", "none");
//   }

//   templateObject.getBinLocationReportData(
//     GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
//     GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
//     false
//   );

//   templateObject.setDateAs( GlobalFunctions.convertYearMonthDay($('#dateFrom').val()) )


//   templateObject.initUploadedImage = () => {
//     let imageData = localStorage.getItem("Image");
//     if (imageData) {
//       $("#uploadedImage").attr("src", imageData);
//       $("#uploadedImage").attr("width", "50%");
//     }
//   };

//   templateObject.initDate();
//   templateObject.initUploadedImage();
//   LoadingOverlay.hide();
// });

Template.binlocationslist.events({
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
    localStorage.setItem("VS1BinLocations_Report", "");
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

    const filename = loggedCompany + "- Bin Location List" + ".csv";
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

    document.title = "Bin Location List";
    $(".printReport").print({
      title: "Bin Location List | " + loggedCompany,
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
  "click #ignoreDate":  (e, templateObject) => {
    localStorage.setItem("VS1BinLocations_Report", "");
    templateObject.getBinLocationReportData(
      null,
      null,
      true
    )
  },
  "change #dateTo, change #dateFrom": (e) => {
    let templateObject = Template.instance();
    localStorage.setItem("VS1BinLocations_Report", "");
    templateObject.getBinLocationReportData(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    )
  },
  ...Datehandler.getDateRangeEvents(),
});

Template.binlocationslist.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  binlocationslistth: () => {
    return Template.instance().binlocationslistth.get();
  },
  records: () => {
    return Template.instance().records.get();
  },
  isZeroValue(valueZero) {
    if (Math.sign(valueZero) !== 0) {
      return true;
    }
    return false;
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
    if (isMinus == true) amount = amount * -1; // Make it positive

    // get default currency symbol
    // let _defaultCurrency = currencyList.filter(
    //   (a) => a.Code == defaultCurrencyCode
    // )[0];

    //amount = amount.replace(_defaultCurrency.symbol, "");

    // amount =
    //   isNaN(amount) == true
    //     ? parseFloat(amount.substring(1))
    //     : parseFloat(amount);

    // Get the selected date
    let dateTo = $("#balancedate").val();
    const day = dateTo.split("/")[0];
    const m = dateTo.split("/")[1];
    const y = dateTo.split("/")[2];
    dateTo = new Date(y, m, day);
    dateTo.setMonth(dateTo.getMonth() - 1); // remove one month (because we added one before)

    // Filter by currency code
    currencyList = currencyList.filter((a) => a.Code == currencyData.code);

    // if(currencyList.length == 0) {
    //   currencyList = Template.instance().currencyList.get();
    //   currencyList = currencyList.filter((a) => a.Code == currencyData.code);
    // }

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
    //amount = amount + 0.36;
    amount = parseFloat(amount * rate); // Multiply by the rate
    amount = Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }); // Add commas

    // amount = amount.toLocaleString();

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
