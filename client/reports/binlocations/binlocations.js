import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";

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
});
function MakeNegative() {
  $('td').each(function(){
      if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
  });
}
Template.binlocationslist.onRendered(() => {
  const templateObject = Template.instance();
  LoadingOverlay.show();
  
  templateObject.initDate = () => {
    const currentDate = new Date();

    /**
     * This will init dates
     */
    let begunDate = moment(currentDate).format("DD/MM/YYYY");
    templateObject.dateAsAt.set(begunDate);

    let fromDateMonth = currentDate.getMonth() + 1;
    let fromDateDay = currentDate.getDate();
    if (currentDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }

    let prevMonth = moment().subtract(1, "months").format("MM");

    if (currentDate.getDate() < 10) {
      fromDateDay = "0" + currentDate.getDate();
    }
    // let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + ;
    var fromDate =
      fromDateDay + "/" + prevMonth + "/" + currentDate.getFullYear();

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

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    //--------- END OF DATE ---------------//
  };
  templateObject.setReportOptions = async function ( ignoreDate = true, formatDateFrom = new Date(),  formatDateTo = new Date() ) {
    let defaultOptions = templateObject.reportOptions.get();
    if (defaultOptions) {
      defaultOptions.fromDate = formatDateFrom;
      defaultOptions.toDate = formatDateTo;
      defaultOptions.ignoreDate = ignoreDate;
    } else {
      defaultOptions = {
        fromDate: moment().subtract(1, "months").format("YYYY-MM-DD"),
        toDate: moment().format("YYYY-MM-DD"),
        ignoreDate: true
      };
    }
    $('.edtReportDates').attr('disabled', false)
    if( ignoreDate == true ){
      $('.edtReportDates').attr('disabled', true)
    }
    $("#dateFrom").val(moment(defaultOptions.fromDate).format('DD/MM/YYYY'));
    $("#dateTo").val(moment(defaultOptions.toDate).format('DD/MM/YYYY'));
    await templateObject.reportOptions.set(defaultOptions);
    await templateObject.getBinLocationReportData();
  };

  templateObject.getBinLocationReportData = async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    
    let data = [];
    if (!localStorage.getItem('VS1BinLocations_Report')) {
      const options = await templateObject.reportOptions.get();
      let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
      let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
      let ignoreDate = options.ignoreDate || false;
      data = await reportService.getBinLocationReport( dateFrom, dateTo, ignoreDate);
      if( data.tproductbin.length > 0 ){
        localStorage.setItem('VS1BinLocations_Report', JSON.stringify(data)||'');
      }
    }else{
      data = JSON.parse(localStorage.getItem('VS1BinLocations_Report'));
    }
    
    let reportGroups = []; 
    if( data.tproductbin.length > 0 ){
        for (const item of data.tproductbin) {   
            let isExist = reportGroups.filter((subitem) => {
                if( subitem.BinClassName == item.fields.BinClassName ){
                    subitem.SubAccounts.push(item)
                    return subitem
                }
            });

            if( isExist.length == 0 ){
                reportGroups.push({
                    SubAccounts: [item],
                    ...item.fields
                });
            }
        }
    }
    templateObject.records.set(reportGroups);
    setTimeout(function() {
        MakeNegative();
    }, 1000);
    $(".fullScreenSpin").css("display", "none");
  }

  templateObject.setReportOptions();

  templateObject.initUploadedImage = () => {
    let imageData = localStorage.getItem("Image");
    if (imageData) {
      $("#uploadedImage").attr("src", imageData);
      $("#uploadedImage").attr("width", "50%");
    }
  };

  templateObject.initDate();
  templateObject.initUploadedImage();
  LoadingOverlay.hide();
});

Template.binlocationslist.events({
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
        employeeId == Session.get("mySessionEmployeeLoggedID")
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
  "change .edtReportDates": async function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    var dateFrom = moment(new Date($("#dateFrom").datepicker("getDate"))).format("DD/MM/YYYY");
    var dateTo = moment(new Date($("#dateFrom").datepicker("getDate"))).format("DD/MM/YYYY");
    localStorage.setItem('VS1BinLocations_Report', '');
    await templateObject.setReportOptions(false, dateFrom, dateTo);
    $(".fullScreenSpin").css("display", "none");
  },
  "click #lastMonth": async function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
    let endDate = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
    localStorage.setItem('VS1BinLocations_Report', '');
    await templateObject.setReportOptions(false, fromDate, endDate);
    $(".fullScreenSpin").css("display", "none");
  },
  "click #lastQuarter": async function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    let fromDate = moment().subtract(1, "Q").startOf("Q").format("YYYY-MM-DD");
    let endDate = moment().subtract(1, "Q").endOf("Q").format("YYYY-MM-DD");
    localStorage.setItem('VS1BinLocations_Report', '');
    await templateObject.setReportOptions(false, fromDate, endDate);
    $(".fullScreenSpin").css("display", "none");
  },
  "click #last12Months": async function () {
    $(".fullScreenSpin").css("display", "block");
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if (currentDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }
    if (currentDate.getDate() < 10) {
      fromDateDay = "0" + currentDate.getDate();
    }

    var fromDate = fromDateDay + "/" + fromDateMonth + "/" + Math.floor(currentDate.getFullYear() - 1);
    templateObject.dateAsAt.set(begunDate);
    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + Math.floor(currentDate2.getMonth() + 1) + "-" + currentDate2.getDate();
    localStorage.setItem('VS1BinLocations_Report', '');
    await templateObject.setReportOptions(false, getDateFrom, getLoadDate);
    $(".fullScreenSpin").css("display", "none");
  },
  "click #ignoreDate": async function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    templateObject.dateAsAt.set("Current Date");
    localStorage.setItem('VS1BinLocations_Report', '');
    await templateObject.setReportOptions(true);
    $(".fullScreenSpin").css("display", "none");
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
});

Template.binlocationslist.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
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
