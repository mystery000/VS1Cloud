import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import GlobalFunctions from "../../GlobalFunctions";
import Datehandler from "../../DateHandler";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";

const reportService = new ReportService();
const utilityService = new UtilityService();
const taxRateService = new TaxRateService();
let defaultCurrencyCode = CountryAbbr;

const currentDate = new Date();

Template.customerdetailsreport.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.reportOptions = new ReactiveVar([]);
  templateObject.transactiondatatablerecords = new ReactiveVar([]);
  templateObject.customerdetailsreportth = new ReactiveVar([]);

  // Currency related vars //
  FxGlobalFunctions.initVars(templateObject);

});

function MakeNegative() {
  $('td').each(function(){
      if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
  });
}

Template.customerdetailsreport.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  templateObject.init_reset_data = function () {
    let reset_data = [];
    reset_data = [
      { index: 1, label: 'Company Name', class:'colCompanyName', active: true, display: true, width: "85" },
      { index: 2, label: 'Rep', class:'colRep', active: true, display: true, width: "85" },
      { index: 3, label: 'Discount Type', class:'colDiscountType', active: true, display: true, width: "85" },
      { index: 4, label: 'Discount', class:'colDiscount', active: true, display: true, width: "85" },
      { index: 5, label: 'Special Discount', class:'colSpecialDiscount', active: true, display: true, width: "85" },
      { index: 6, label: 'Orig Price', class:'colOrigPrice', active: true, display: true, width: "85" },
      { index: 7, label: 'Line Price', class:'colLinePrice', active: true, display: true, width: "85" },
      { index: 8, label: 'Product ID', class:'colProductID', active: true, display: true, width: "85" },
      { index: 9, label: 'Description', class:'colDescription', active: true, display: true, width: "85" },
      { index: 10, label: 'Sub Group', class:'colSubGroup', active: true, display: true, width: "85" },
      { index: 11, label: 'Type', class:'colType', active: true, display: true, width: "85" },
      { index: 12, label: 'Dept', class:'colDept', active: true, display: true, width: "85" },
      { index: 13, label: 'Customer ID', class:'colCustomerID', active: false, display: true, width: "85" },
      { index: 14, label: 'Password', class:'colPassword', active: false, display: true, width: "85" },
      { index: 15, label: 'Test', class:'colTest', active: false, display: true, width: "85" },
      { index: 16, label: 'Birthday', class:'colBirthday', active: false, display: true, width: "85" },
    ];
    templateObject.customerdetailsreportth.set(reset_data);
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

  templateObject.getCustomerDetailsData = async function (dateFrom, dateTo, ignoreDate) {

    templateObject.setDateAs(dateFrom);
    getVS1Data('TCustomerDetailsReport').then(function (dataObject) {
      if (dataObject.length == 0) {
        reportService.getCustomerDetails(dateFrom, dateTo, ignoreDate).then(async function (data) {
          await addVS1Data('TCustomerDetailsReport', JSON.stringify(data));
          templateObject.displayCustomerDetailsData(data);
          console.log("normal: ", data);
        }).catch(function (err) {
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.displayCustomerDetailsData(data);
      }
    }).catch(function (err) {
      reportService.getCustomerDetails(dateFrom, dateTo, ignoreDate).then(async function (data) {
        console.log("error: ", data);
        await addVS1Data('TCustomerDetailsReport', JSON.stringify(data));
        templateObject.displayCustomerDetailsData(data);
      }).catch(function (err) {

      });
    });
  }

  templateObject.getCustomerDetailsData(
    GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
    GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
    false
  );
  templateObject.displayCustomerDetailsData = async function (data) {
    var splashArrayCustomerDetailsReport = new Array();
    let deleteFilter = false;
    if (data.Params.Search.replace(/\s/g, "") == "") {
      deleteFilter = true;
    } else {
      deleteFilter = false;
    };

    for (let i = 0; i < data.tcustomersummaryreport.length; i++) {
      var dataList = [
        data.tcustomersummaryreport[i].ACCOUNTID || "",
        data.tcustomersummaryreport[i].ACCOUNTNAME || "",
        data.tcustomersummaryreport[i].ACCOUNTNUMBER || "",
        data.tcustomersummaryreport[i].ACCOUNTS || "",
        data.tcustomersummaryreport[i].AMOUNTEX || "",
        data.tcustomersummaryreport[i].AMOUNTINC || "",
        data.tcustomersummaryreport[i].CHEQUENUMBER || "",
        data.tcustomersummaryreport[i].CLASS || "",
        data.tcustomersummaryreport[i].CLASSID || "",
        data.tcustomersummaryreport[i]["CLIENT NAME"] || "",
        data.tcustomersummaryreport[i].CREDITSEX || "",
        data.tcustomersummaryreport[i].CREDITSINC || "",
        data.tcustomersummaryreport[i].DATE || "",
        data.tcustomersummaryreport[i].DEBITSEX || "",
        data.tcustomersummaryreport[i].DEBITSINC || "",
        data.tcustomersummaryreport[i].DETAILS || "",
        data.tcustomersummaryreport[i].FIXEDASSETID || "",
        data.tcustomersummaryreport[i].GLOBALREF || "",
        data.tcustomersummaryreport[i].ID || "",
        data.tcustomersummaryreport[i].MEMO || "",
        data.tcustomersummaryreport[i].PAYMENTID || "",
        data.tcustomersummaryreport[i].PREPAYMENTID || "",
        data.tcustomersummaryreport[i].PRODUCTDESCRIPTION || "",
        data.tcustomersummaryreport[i].PRODUCTNAME || "",
        data.tcustomersummaryreport[i].PURCHASEORDERID || "",
        data.tcustomersummaryreport[i].REFERENCENO || "",
        data.tcustomersummaryreport[i].REPNAME || "",
        data.tcustomersummaryreport[i].SALEID || "",
        data.tcustomersummaryreport[i].TAXCODE || "",
        data.tcustomersummaryreport[i].TAXRATE || "",
        data.tcustomersummaryreport[i].TYPE || "",

      ];
      splashArrayCustomerDetailsReport.push(dataList);
      templateObject.transactiondatatablerecords.set(splashArrayCustomerDetailsReport);
    }


    if (templateObject.transactiondatatablerecords.get()) {
      setTimeout(function () {
        MakeNegative();
      }, 100);
    }
    console.log(splashArrayCustomerDetailsReport);
    //$('.fullScreenSpin').css('display','none');

    setTimeout(function () {
      $('#tableExport').DataTable({
        data: splashArrayCustomerDetailsReport,
        searching: false,
        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        columnDefs: [
          {
            targets: 0,
            className: "colAccountID",
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
            className: "colAmountEx hiddenColumn",
          },
          {
            targets: 5,
            className: "colAmountInc hiddenColumn",
          },
          {
            targets: 6,
            className: "colChequeNumber hiddenColumn",
          },
          {
            targets: 7,
            className: "colDepartment",
          },
          {
            targets: 8,
            className: "colClassID",
          },
          {
            targets: 9,
            className: "colProductDescription",
          },
          {
            targets: 10,
            className: "colCreditEx hiddenColumn",
          },
          {
            targets: 11,
            className: "colCreditInc hiddenColumn",
          },
          {
            targets: 12,
            className: "colDate",
          },
          {
            targets: 13,
            className: "colDebitsEx hiddenColumn",
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
            className: "colGlobalRef",
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
            className: "colCredit",
          },
          {
            targets: 23,
            className: "colProductID hiddenColumn",
          },
          {
            targets: 24,
            className: "colPurchaseOrderID",
          },
          {
            targets: 25,
            className: "colRefNo hiddenColumn",
          },
          {
            targets: 26,
            className: "colRepName",
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
            className: "colType",
          },
        ],
        select: true,
        destroy: true,
        colReorder: true,
        pageLength: initialDatatableLoad,
        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
        info: true,
        responsive: true,
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

// Template.customerdetailsreport.onRendered(() => {
//   LoadingOverlay.show();
//   const templateObject = Template.instance();

//   let taxRateService = new TaxRateService();
//   let utilityService = new UtilityService();
  
//   templateObject.initDate = () => {
//     Datehandler.initOneMonth();
//   };

//   templateObject.setDateAs = ( dateFrom = null ) => {
//     templateObject.dateAsAt.set( ( dateFrom )? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY") )
//   };

//   templateObject.getCustomerDetailReportData = async function ( dateFrom, dateTo, ignoreDate ) {
//     LoadingOverlay.show();
//     templateObject.setDateAs( dateFrom );

//     let reset_data = [
//       { index: 1, label: 'Company Name', class:'colCompanyName', active: true, display: true, width: "85" },
//       { index: 2, label: 'Rep', class:'colRep', active: true, display: true, width: "85" },
//       { index: 3, label: 'Discount Type', class:'colDiscountType', active: true, display: true, width: "85" },
//       { index: 4, label: 'Discount', class:'colDiscount', active: true, display: true, width: "85" },
//       { index: 5, label: 'Special Discount', class:'colSpecialDiscount', active: true, display: true, width: "85" },
//       { index: 6, label: 'Orig Price', class:'colOrigPrice', active: true, display: true, width: "85" },
//       { index: 7, label: 'Line Price', class:'colLinePrice', active: true, display: true, width: "85" },
//       { index: 8, label: 'Product ID', class:'colProductID', active: true, display: true, width: "85" },
//       { index: 9, label: 'Description', class:'colDescription', active: true, display: true, width: "85" },
//       { index: 10, label: 'Sub Group', class:'colSubGroup', active: true, display: true, width: "85" },
//       { index: 11, label: 'Type', class:'colType', active: true, display: true, width: "85" },
//       { index: 12, label: 'Dept', class:'colDept', active: true, display: true, width: "85" },
//       { index: 13, label: 'Customer ID', class:'colCustomerID', active: false, display: true, width: "85" },
//       { index: 14, label: 'Password', class:'colPassword', active: false, display: true, width: "85" },
//       { index: 15, label: 'Test', class:'colTest', active: false, display: true, width: "85" },
//       { index: 16, label: 'Birthday', class:'colBirthday', active: false, display: true, width: "85" },
//     ];

//     templateObject.customerdetailsreportth.set(reset_data);


//     let data = [];
//     if (!localStorage.getItem('VS1CustomerDetails_Report')) {
//     data = await reportService.getCustomerDetailReport( dateFrom, dateTo, ignoreDate);
//       if( data.tcustomersummaryreport.length > 0 ){
//         localStorage.setItem('VS1CustomerDetails_Report', JSON.stringify(data)||'');
//       }
//     }else{
//       data = JSON.parse(localStorage.getItem('VS1CustomerDetails_Report'));
//     }
//     console.log(data);
//     let reportData = [];
//     if( data.tcustomersummaryreport.length > 0 ){
//         let reportGroups = []; 
        
//         let reportSummary = data.tcustomersummaryreport.map(el => {
//           let resultobj = {};
//           Object.entries(el).map(([key, val]) => {      
//               resultobj[key.split(" ").join("_").replace(/\W+/g, '')] = val;
//               return resultobj;
//           })
//           return resultobj;
//         })

//         for (const item of reportSummary) {   
//             let isExist = reportGroups.filter((subitem) => {
//                 if( subitem.EMAIL == item.EMAIL ){
//                   subitem.SubAccounts.push(item)
//                   return subitem
//                 }
//             });

//             if( isExist.length == 0 ){
//               reportGroups.push({
//                   SubAccounts: [item],
//                   TotalEx: 0,
//                   TotalInc: 0,
//                   TotalGrossProfit: 0,
//                   ...item
//               });
//             }
//         }

//         reportData = reportGroups.filter((item) => {
//             let TotalEx = 0;
//             let TotalInc = 0;
//             let TotalGrossProfit = 0;
//             item.SubAccounts.map((subitem) => {
//               TotalEx += subitem['Total_Amount_Ex'];
//               TotalInc += subitem['Total_Amount_Inc'];
//               TotalGrossProfit += subitem['Gross_Profit'];
//             });
//             item.TotalEx = TotalEx;
//             item.TotalInc = TotalInc;
//             item.TotalGrossProfit = TotalGrossProfit;
//             return item;
//         });        
//     }

//     templateObject.records.set(reportData);
//     LoadingOverlay.hide();
//     setTimeout(function() {
//         MakeNegative();
//     }, 1000);
//   }

//   /**
//    * This function will load
//    * @param {*} dateFrom
//    * @param {*} dateTo
//    * @param {*} ignoreDate
//    */
//   // templateObject.getReport = async (dateFrom, dateTo, ignoreDate = false) => {
//   //   LoadingOverlay.show();
//   //   let dataObj = await reportService.getCustomerDetails(
//   //     dateFrom,
//   //     dateTo,
//   //     ignoreDate
//   //   );

//   //   LoadingOverlay.hide();
//   // };

  

//   templateObject.initDate();
//   templateObject.getCustomerDetailReportData(
//     GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
//     GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
//     false
//   );
//   templateObject.setDateAs( GlobalFunctions.convertYearMonthDay($('#dateFrom').val()) )
//   // templateObject.getReport(
//   //   `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`,
//   //   moment(currentDate).format("YYYY-MM-DD")
//   // );
//   LoadingOverlay.hide();
// });

Template.customerdetailsreport.events({
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
  "click #ignoreDate":  (e, templateObject) => {
    localStorage.setItem("VS1CustomerDetails_Report", "");
    templateObject.getCustomerDetailReportData(
      null,
      null,
      true
    )
  },
  "change #dateTo, change #dateFrom": (e) => {
    let templateObject = Template.instance();
    localStorage.setItem("VS1CustomerDetails_Report", "");
    templateObject.getCustomerDetailReportData(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    )
  },
  ...Datehandler.getDateRangeEvents(),
  "click #btnSummary": function () {
    FlowRouter.go("/customersummaryreport");
  },
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1CustomerDetails_Report", "");
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

    const filename = loggedCompany + "- Customer Details Report" + ".csv";
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

    document.title = "Customer Details Report";
    $(".printReport").print({
      title: "Customer Details Report | " + loggedCompany,
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
  "click [href='#noInfoFound']": function () {
    swal({
        title: 'Information',
        text: "No further information available on this column",
        type: 'warning',
        confirmButtonText: 'Ok'
      })
  }
});

Template.customerdetailsreport.helpers({
  checkEmptySubAccount: ( item ) => {
    if( item.Total_Amount_Ex == 0 && item.Total_Amount_Inc == 0 && item.Gross_Profit == 0 ){
        return false
    }
    return true
  },
  customerdetailsreportth: () => {
    return Template.instance().customerdetailsreportth.get();
  },
  checkEmpty: ( item ) => {
    if( item.TotalEx == 0 && item.TotalInc == 0 && item.TotalGrossProfit == 0 ){
        return false
    }
    return true
  },
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  getSpaceKeyData( array, key ){
    return array[key] || ''
  },
  transactiondatatablerecords: () => {
    return Template.instance().transactiondatatablerecords.get();
  },
  redirectionType(item) {
    // return '/customerscard?id=' + item.SaleID;
    if(item.type === 'PO') {
      return '#noInfoFound';
      return '/customerscard?id=' + item.SaleID;
    } else if (item.type === 'Invoice') {
      return '#noInfoFound';
      return '/invoicecard?id=' + item.SaleID;
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
    let dateTo = $("#dateTo") ? $("#dateTo").val() : null;
    const day = dateTo != null ? dateTo.split("/")[0] : (new Date()).getDate();
    const m = dateTo != null ? dateTo.split("/")[1] : (new Date()).getMonth();
    const y = dateTo != null ? dateTo.split("/")[2] : (new Date()).getFullYear();
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
