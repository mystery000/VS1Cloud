import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import GlobalFunctions from "../../GlobalFunctions";

let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();
let defaultCurrencyCode = CountryAbbr;

const currentDate = new Date();

Template.customerdetailsreport.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.reportOptions = new ReactiveVar([]);
  templateObject.records = new ReactiveVar([]);

  // Currency related vars //
  templateObject.currencyList = new ReactiveVar([]);
  templateObject.activeCurrencyList = new ReactiveVar([]);
  templateObject.tcurrencyratehistory = new ReactiveVar([]);
});

function MakeNegative() {
  $('td').each(function(){
      if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
  });
}

Template.customerdetailsreport.onRendered(() => {
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
    var fromDate = fromDateDay + "/" + prevMonth + "/" + currentDate.getFullYear();

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
    await templateObject.getCustomerDetailReportData();
  };

  templateObject.getCustomerDetailReportData = async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let data = [];
    if (!localStorage.getItem('VS1CustomerDetails_Report')) {
      const options = await templateObject.reportOptions.get();
    let dateFrom = moment(options.fromDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    let dateTo = moment(options.toDate).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD");
    let ignoreDate = options.ignoreDate || false;
    data = await reportService.getCustomerDetailReport( dateFrom, dateTo, ignoreDate);
      if( data.tcustomersummaryreport.length > 0 ){
        localStorage.setItem('VS1CustomerDetails_Report', JSON.stringify(data)||'');
      }
    }else{
      data = JSON.parse(localStorage.getItem('VS1CustomerDetails_Report'));
    }
    
    let reportData = [];
    if( data.tcustomersummaryreport.length > 0 ){
        let reportGroups = []; 
        
        let reportSummary = data.tcustomersummaryreport.map(el => {
          let resultobj = {};
          Object.entries(el).map(([key, val]) => {      
              resultobj[key.split(" ").join("_").replace(/\W+/g, '')] = val;
              return resultobj;
          })
          return resultobj;
        })

        for (const item of reportSummary) {   
            let isExist = reportGroups.filter((subitem) => {
                if( subitem.EMAIL == item.EMAIL ){
                  subitem.SubAccounts.push(item)
                  return subitem
                }
            });

            if( isExist.length == 0 ){
              reportGroups.push({
                  SubAccounts: [item],
                  TotalEx: 0,
                  TotalInc: 0,
                  TotalGrossProfit: 0,
                  ...item
              });
            }
        }

        reportData = reportGroups.filter((item) => {
            let TotalEx = 0;
            let TotalInc = 0;
            let TotalGrossProfit = 0;
            item.SubAccounts.map((subitem) => {
              TotalEx += subitem['Total_Amount_Ex'];
              TotalInc += subitem['Total_Amount_Inc'];
              TotalGrossProfit += subitem['Gross_Profit'];
            });
            item.TotalEx = TotalEx;
            item.TotalInc = TotalInc;
            item.TotalGrossProfit = TotalGrossProfit;
            return item;
        });        
    }

    templateObject.records.set(reportData);
    $(".fullScreenSpin").css("display", "none");
    setTimeout(function() {
        MakeNegative();
    }, 1000);
  }

  templateObject.setReportOptions();

  templateObject.initUploadedImage = () => {
    let imageData = localStorage.getItem("Image");
    if (imageData) {
      $("#uploadedImage").attr("src", imageData);
      $("#uploadedImage").attr("width", "50%");
    }
  };

  /**
   * This function will load
   * @param {*} dateFrom
   * @param {*} dateTo
   * @param {*} ignoreDate
   */
  // templateObject.getReport = async (dateFrom, dateTo, ignoreDate = false) => {
  //   LoadingOverlay.show();
  //   let dataObj = await reportService.getCustomerDetails(
  //     dateFrom,
  //     dateTo,
  //     ignoreDate
  //   );

  //   LoadingOverlay.hide();
  // };

  
  /**
   * Step 1 : We need to get currencies (TCurrency) so we show or hide sub collumns
   * So we have a showable list of currencies to toggle
   */

   templateObject.loadCurrency = async () => {
    await loadCurrency();
  };

  //templateObject.loadCurrency();

  templateObject.loadCurrencyHistory = async () => {
    await loadCurrencyHistory();
  };

  //templateObject.loadCurrencyHistory();

  templateObject.initDate();
  templateObject.initUploadedImage();
  // templateObject.getReport(
  //   `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`,
  //   moment(currentDate).format("YYYY-MM-DD")
  // );
  LoadingOverlay.hide();
});

Template.customerdetailsreport.events({
  "change .balancedate": function() {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    let balanceDate = templateObject.$("#balancedate").val();
    let formatBalDate = moment(balanceDate).format("YYYY-MM-DD");
    localStorage.setItem("VS1CustomerDetails_Report", "");
    templateObject.getBalanceSheetReports(formatBalDate);
    var formatDate = moment(balanceDate).format("DD MMM YYYY");
    templateObject.dateAsAt.set(formatDate);
  },
  "click .lastMonth": function() {
      let templateObject = Template.instance();
      $(".fullScreenSpin").css("display", "inline-block");
      var dateTo = new Date($("#balancedate").datepicker("getDate"));
      //if(dateTo.getMonth()+1)
      localStorage.setItem("VS1CustomerDetails_Report", "");
      let formatDateTo =
          dateTo.getFullYear() + "-" + dateTo.getMonth() + "-" + dateTo.getDate();
      templateObject.getBalanceSheetReports(formatDateTo);

      let fromDateMonth = dateTo.getMonth();
      let fromDateDay = dateTo.getDate();

      if (dateTo.getMonth() + 1 < 10) {
          fromDateMonth = "0" + dateTo.getMonth();
      }

      if (dateTo.getDate() < 10) {
          fromDateDay = "0" + dateTo.getDate();
      }
      var formatDate =
          fromDateDay + "/" + fromDateMonth + "/" + dateTo.getFullYear();
      templateObject.dateAsAt.set(formatDate);
      $("#balancedate").val(formatDate);
  },
  "click #lastQuarter": function() {
      let templateObject = Template.instance();
      $(".fullScreenSpin").css("display", "inline-block");
      localStorage.setItem("VS1CustomerDetails_Report", "");
      $("#balancedate").attr("readonly", false);
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      function getQuarter(d) {
          d = d || new Date();
          var m = Math.floor(d.getMonth() / 3) + 2;
          return m > 4 ? m - 4 : m;
      }

      var quarterAdjustment = (moment().month() % 3) + 1;
      var lastQuarterEndDate = moment()
          .subtract({ months: quarterAdjustment })
          .endOf("month");
      var lastQuarterStartDate = lastQuarterEndDate
          .clone()
          .subtract({ months: 2 })
          .startOf("month");

      var lastQuarterStartDateFormat =
          moment(lastQuarterStartDate).format("DD/MM/YYYY");
      var lastQuarterEndDateFormat =
          moment(lastQuarterEndDate).format("DD/MM/YYYY");

      templateObject.dateAsAt.set(lastQuarterStartDateFormat);
      $("#balancedate").val(lastQuarterStartDateFormat);

      let fromDateMonth = getQuarter(currentDate);
      var quarterMonth = getQuarter(currentDate);
      let fromDateDay = currentDate.getDate();

      var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
      let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
      templateObject.getBalanceSheetReports(getDateFrom);
  },
  "click #last12Months": function() {
      let templateObject = Template.instance();
      $(".fullScreenSpin").css("display", "inline-block");
      localStorage.setItem("VS1CustomerDetails_Report", "");
      $("#balancedate").attr("readonly", false);
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

      var fromDate =
          fromDateDay +
          "/" +
          fromDateMonth +
          "/" +
          Math.floor(currentDate.getFullYear() - 1);
      templateObject.dateAsAt.set(begunDate);
      $("#balancedate").val(lastQuarterStartDateFormat);

      var currentDate2 = new Date();
      var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
      let getDateFrom =
          Math.floor(currentDate2.getFullYear() - 1) +
          "-" +
          Math.floor(currentDate2.getMonth() + 1) +
          "-" +
          currentDate2.getDate();
      templateObject.getBalanceSheetReports(getDateFrom);
  },
  "click #ignoreDate": function() {
      let templateObject = Template.instance();
      $(".fullScreenSpin").css("display", "inline-block");
      localStorage.setItem("VS1CustomerDetails_Report", "");
      $("#balancedate").attr("readonly", true);
      templateObject.dateAsAt.set("Current Date");
      templateObject.getBalanceSheetReports("", "", true);
  },
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

    document.title = "Customer Details Report";
    $(".printReport").print({
      title: "Customer Details Report | " + loggedCompany,
      noPrintSelector: ".addSummaryEditor",
    });
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
  "click .fx-rate-btn": async (e) => {
    await loadCurrency();
    //loadCurrencyHistory();
  },
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

Template.customerdetailsreport.helpers({
  checkEmptySubAccount: ( item ) => {
    if( item.Total_Amount_Ex == 0 && item.Total_Amount_Inc == 0 && item.Gross_Profit == 0 ){
        return false
    }
    return true
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
  records: () => {
    return Template.instance().records.get();
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

/**
 *
 */
async function loadCurrency() {
  let templateObject = Template.instance();

  if ((await templateObject.currencyList.get().length) == 0) {
    LoadingOverlay.show();

    let _currencyList = [];
    const result = await taxRateService.getCurrencies();

    //taxRateService.getCurrencies().then((result) => {

    const data = result.tcurrency;

    for (let i = 0; i < data.length; i++) {
      // let taxRate = (data.tcurrency[i].fields.Rate * 100).toFixed(2) + '%';
      var dataList = {
        id: data[i].Id || "",
        code: data[i].Code || "-",
        currency: data[i].Currency || "NA",
        symbol: data[i].CurrencySymbol || "NA",
        buyrate: data[i].BuyRate || "-",
        sellrate: data[i].SellRate || "-",
        country: data[i].Country || "NA",
        description: data[i].CurrencyDesc || "-",
        ratelastmodified: data[i].RateLastModified || "-",
        active: data[i].Code == defaultCurrencyCode ? true : false, // By default if AUD then true
        //active: false,
        // createdAt: new Date(data[i].MsTimeStamp) || "-",
        // formatedCreatedAt: formatDateToString(new Date(data[i].MsTimeStamp))
      };

      _currencyList.push(dataList);
      //}
    }
    _currencyList = _currencyList.sort((a, b) => {
      return a.currency
        .split("")[0]
        .toLowerCase()
        .localeCompare(b.currency.split("")[0].toLowerCase());
    });

    templateObject.currencyList.set(_currencyList);

    await loadCurrencyHistory(templateObject);
    LoadingOverlay.hide();
    //});
  }
}

async function loadCurrencyHistory(templateObject) {
  let result = await taxRateService.getCurrencyHistory();
  const data = result.tcurrencyratehistory;
  templateObject.tcurrencyratehistory.set(data);
  LoadingOverlay.hide();
}
