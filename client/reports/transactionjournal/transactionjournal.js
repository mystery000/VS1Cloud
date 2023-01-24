import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import Datehandler from "../../DateHandler";
import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import GlobalFunctions from "../../GlobalFunctions";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from "meteor/templating";
import './transactionjournal.html';
let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();
let defaultCurrencyCode = CountryAbbr;

const currentDate = new Date();

Template.transactionjournallist.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.reportOptions = new ReactiveVar([]);
  FxGlobalFunctions.initVars(templateObject);
  templateObject.records = new ReactiveVar([]);
  templateObject.transactionjournallistth = new ReactiveVar([]);
});
function MakeNegative() {
  $('td').each(function () {
    if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
  });
}
Template.transactionjournallist.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();

  let reset_data = [
    { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
    { index: 2, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "100" },
    { index: 3, label: 'Type', class: 'colType', active: true, display: true, width: "100" },
    { index: 4, label: 'Debits (Ex)', class: 'colDebitsEx', active: true, display: true, width: "100" },
    { index: 5, label: 'Debits (Inc)', class: 'colDebitsInc', active: true, display: true, width: "100" },
    { index: 6, label: 'Credits (Ex)', class: 'colCreditsEx', active: true, display: true, width: "100" },
    { index: 7, label: 'Credits (Inc)', class: 'colCreditsInc', active: true, display: true, width: "100" },
    { index: 8, label: 'Global Ref', class: 'colGlobalRef', active: true, display: true, width: "100" },
    { index: 9, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
    { index: 10, label: 'Client Name', class: 'colClientName', active: false, display: true, width: "100" },
    { index: 11, label: 'Account Number', class: 'colAccountName', active: false, display: true, width: "100" },
    { index: 12, label: 'Tax Code', class: 'colTaxCode', active: false, display: true, width: "100" },
    { index: 13, label: 'Product Desc', class: 'colProductDesc', active: false, display: true, width: "100" },
    { index: 14, label: 'Account Type', class: 'colAccuntType', active: false, display: true, width: "100" },
    { index: 15, label: 'Trans Time Stamp', class: 'colTransTimeStamp', active: false, display: true, width: "100" },
    { index: 16, label: 'Employee Name', class: 'colEmployeeName', active: false, display: true, width: "100" },
    { index: 17, label: 'Department', class: 'colDepartment', active: false, display: true, width: "100" },
    { index: 18, label: 'Memo', class: 'colMemo', active: false, display: true, width: "100" },
    { index: 19, label: 'Reference No', class: 'colReferencNo', active: false, display: true, width: "100" },
    { index: 20, label: 'FixedAssetId', class: 'colfixedAssetID', active: false, display: true, width: "100" },
  ];
  templateObject.transactionjournallistth.set(reset_data);

  templateObject.initDate = () => {
    Datehandler.initOneMonth();
    templateObject.dateAsAt.set("Current Date");
    // const currentDate = new Date();

    // /**
    //  * This will init dates
    //  */
    // let begunDate = moment(currentDate).format("DD/MM/YYYY");
    // templateObject.dateAsAt.set(begunDate);

    // let fromDateMonth = currentDate.getMonth() + 1;
    // let fromDateDay = currentDate.getDate();
    // if (currentDate.getMonth() + 1 < 10) {
    //   fromDateMonth = "0" + (currentDate.getMonth() + 1);
    // }

    // let prevMonth = moment().subtract(1, "months").format("MM");

    // if (currentDate.getDate() < 10) {
    //   fromDateDay = "0" + currentDate.getDate();
    // }
    // // let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + ;
    // var fromDate =
    //   fromDateDay + "/" + prevMonth + "/" + currentDate.getFullYear();

    // $("#date-input,#dateTo,#dateFrom").datepicker({
    //   showOn: "button",
    //   buttonText: "Show Date",
    //   buttonImageOnly: true,
    //   buttonImage: "/img/imgCal2.png",
    //   dateFormat: "dd/mm/yy",
    //   showOtherMonths: true,
    //   selectOtherMonths: true,
    //   changeMonth: true,
    //   changeYear: true,
    //   yearRange: "-90:+10",
    //   onChangeMonthYear: function (year, month, inst) {
    //     // Set date to picker
    //     $(this).datepicker(
    //       "setDate",
    //       new Date(year, inst.selectedMonth, inst.selectedDay)
    //     );
    //     // Hide (close) the picker
    //     // $(this).datepicker('hide');
    //     // // Change ttrigger the on change function
    //     // $(this).trigger('change');
    //   },
    // });

    // $("#dateFrom").val(fromDate);
    // $("#dateTo").val(begunDate);

    // //--------- END OF DATE ---------------//
  };
  templateObject.setReportOptions = async function (ignoreDate = false, formatDateFrom = new Date(), formatDateTo = new Date()) {
    let defaultOptions = templateObject.reportOptions.get();
    if (defaultOptions) {
      defaultOptions.fromDate = formatDateFrom;
      defaultOptions.toDate = formatDateTo;
      defaultOptions.ignoreDate = ignoreDate;
    } else {
      defaultOptions = {
        fromDate: moment().subtract(1, "months").format("YYYY-MM-DD"),
        toDate: moment().format("YYYY-MM-DD"),
        ignoreDate: false
      };
    }
    $('.edtReportDates').attr('disabled', false)
    if (ignoreDate == true) {
      $('.edtReportDates').attr('disabled', true);
      templateObject.dateAsAt.set("Current Date");
    }
    $("#dateFrom").val(moment(defaultOptions.fromDate).format('DD/MM/YYYY'));
    $("#dateTo").val(moment(defaultOptions.toDate).format('DD/MM/YYYY'));
    await templateObject.reportOptions.set(defaultOptions);
    await templateObject.loadReport(
      GlobalFunctions.convertYearMonthDay($("#dateFrom").val()),
      GlobalFunctions.convertYearMonthDay($("#dateTo").val()),
      defaultOptions.ignoreDate
    );
  };

  templateObject.loadReport = async (dateFrom = null, dateTo = null, ignoreDate = false) => {
    LoadingOverlay.show();
    // let data = [];
    // if (!localStorage.getItem('VS1TransactionJournal_Report')) {
    //   const options = await templateObject.reportOptions.get();
    //   let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    //   let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    //   let ignoreDate = options.ignoreDate || false;
    //   data = await reportService.getTransactionJournalReport( dateFrom, dateTo, ignoreDate);
    //   if( data.ttransactionlistreport.length > 0 ){
    //     localStorage.setItem('VS1TransactionJournal_Report', JSON.stringify(data)||'');
    //   }
    // }else{
    //   data = JSON.parse(localStorage.getItem('VS1TransactionJournal_Report'));
    // }

    let data = await CachedHttp.get(erpObject.TTransactionListReport, async () => {
      return await reportService.getTransactionJournalReport(dateFrom, dateTo, ignoreDate);
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      validate: (cachedResponse) => {
        return false;
      }
    });

    data = data.response;

    let reportGroups = [];
    if (data.ttransactionlistreport.length > 0) {
      for (const item of data.ttransactionlistreport) {
        let isExist = reportGroups.filter((subitem) => {
          if (subitem.ACCOUNTID == item.ACCOUNTID) {
            subitem.SubAccounts.push(item)
            return subitem
          }
        });

        if (isExist.length == 0) {
          reportGroups.push({
            SubAccounts: [item],
            ...item
          });
        }
      }
    }
    templateObject.records.set(reportGroups);
    if (templateObject.records.get()) {
      setTimeout(function () {
        $("td a").each(function () {
          if ($(this).text().indexOf("-" + Currency) >= 0) {
            $(this).addClass("text-danger");
            $(this).removeClass("fgrblue");
          }
        });
        $("td").each(function () {
          if ($(this).text().indexOf("-" + Currency) >= 0) {
            $(this).addClass("text-danger");
            $(this).removeClass("fgrblue");
          }
        });
        $(".fullScreenSpin").css("display", "none");
      }, 1000);
    }
    $(".fullScreenSpin").css("display", "none");
  }


  templateObject.initUploadedImage = () => {
    // let imageData = localStorage.getItem("Image");
    let imageData;
    getVS1Data("Image").then(function (dataObject) {
      imageData =JSON.parse(dataObject[0]).data;
    })
    if (imageData) {
      $("#uploadedImage").attr("src", imageData);
      $("#uploadedImage").attr("width", "50%");
    }
  };

  templateObject.initDate();
  templateObject.initUploadedImage();
  //templateObject.setReportOptions();

  templateObject.loadReport(
    GlobalFunctions.convertYearMonthDay($("#dateFrom").val()),
    GlobalFunctions.convertYearMonthDay($("#dateTo").val()),
    false
  );
  LoadingOverlay.hide();
});

Template.transactionjournallist.events({
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
  "click .btnRefresh": function () {
    LoadingOverlay.show();
    localStorage.setItem("VS1BinLocations_Report", "");
    Meteor._reload.reload();
  },
  "click .btnExportReport": function () {
    LoadingOverlay.show();
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
  "change .edtReportDates": async (e, templateObject) => {
    // LoadingOverlay.show();
    // localStorage.setItem('VS1TransactionJournal_Report', '');
    //let templateObject = Template.instance();
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));
    await templateObject.setReportOptions(false, dateFrom, dateTo);
    // templateObject.loadReport(
    //   GlobalFunctions.convertYearMonthDay($("#dateFrom").val()),
    //   GlobalFunctions.convertYearMonthDay($("#dateTo").val()),
    //   defaultOptions.ignoreDate
    // );
  },
  // "click #lastMonth": async function () {
  //   LoadingOverlay.show();
  //   localStorage.setItem('VS1TransactionJournal_Report', '');
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
  //   await templateObject.setReportOptions(false, fromDate, endDate);
  // },
  // "click #lastQuarter": async function () {
  //   LoadingOverlay.show();
  //   localStorage.setItem('VS1TransactionJournal_Report', '');
  //   let templateObject = Template.instance();
  //   let fromDate = moment().subtract(1, "Q").startOf("Q").format("YYYY-MM-DD");
  //   let endDate = moment().subtract(1, "Q").endOf("Q").format("YYYY-MM-DD");
  //   await templateObject.setReportOptions(false, fromDate, endDate);
  // },
  // "click #last12Months": async function () {
  //   LoadingOverlay.show();
  //   localStorage.setItem('VS1TransactionJournal_Report', '');
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
  // },
  "click #ignoreDate": (e, templateObject) => {
    localStorage.setItem("VS1TransactionJournal_Report", "");
    LoadingOverlay.show();
    // localStorage.setItem('VS1TransactionJournal_Report', '');
    // let templateObject = Template.instance();
    templateObject.dateAsAt.set("Current Date");
    //await templateObject.setReportOptions(true);
    $('#dateFrom').attr('readonly', true);
    $('#dateTo').attr('readonly', true);
    templateObject.loadReport(null, null, true);
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
  },


  /**
   * This is the new way to handle any modification on the date fields
   */
  "change #dateTo, change #dateFrom": (e, templateObject) => {
    localStorage.setItem("VS1TransactionJournal_Report", "");
    templateObject.loadReport(
      GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
      GlobalFunctions.convertYearMonthDay($('#dateTo').val()),
      false
    );
  },
  ...Datehandler.getDateRangeEvents()
});

Template.transactionjournallist.helpers({
  transactionjournallistth: () => {
    return Template.instance().transactionjournallistth.get();
  },
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
  },
  records: () => {
    return Template.instance().records.get();
  },
  redirectionType(item) {
    if (item.AccountType === 'PO') {
      return '/purchaseordercard?id=' + item.ACCOUNTID;
    } else {
      return '#noInfoFound';
    }
  },
  isZeroValue(valueZero) {
    if (Math.sign(valueZero) !== 0) {
      return true;
    }
    return false;
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

  formatPrice(amount) {

    let utilityService = new UtilityService();
    if (isNaN(amount)) {
      amount = (amount === undefined || amount === null || amount.length === 0) ? 0 : amount;
      amount = (amount) ? Number(amount.replace(/[^0-9.-]+/g, "")) : 0;
    }
    return utilityService.modifynegativeCurrencyFormat(amount) || 0.00;
  },
  formatTax(amount) {

    if (isNaN(amount)) {
      amount = (amount === undefined || amount === null || amount.length === 0) ? 0 : amount;
      amount = (amount) ? Number(amount.replace(/[^0-9.-]+/g, "")) : 0;
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
