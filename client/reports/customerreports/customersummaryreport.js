import { ReportService } from "../report-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import LoadingOverlay from "../../LoadingOverlay";

let reportService = new ReportService();
let utilityService = new UtilityService();

const currentDate = new Date();

Template.customersummaryreport.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.dateAsAt = new ReactiveVar();
});

Template.customersummaryreport.onRendered(() => {
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

Template.customersummaryreport.events({
  "click #btnDetails": function () {
    FlowRouter.go("/customerdetailsreport");
  },
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1CustomerSummary_Report", "");
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

    const filename = loggedCompany + "- Customer Summary Report" + ".csv";
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

    document.title = "Customer Summary Report";
    $(".printReport").print({
      title: "Customer Summary Report | " + loggedCompany,
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
  "click #lastMonth": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1GeneralLedger_Report", "");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();

    var prevMonthLastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    var prevMonthFirstDate = new Date(
      currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1),
      (currentDate.getMonth() - 1 + 12) % 12,
      1
    );

    var formatDateComponent = function (dateComponent) {
      return (dateComponent < 10 ? "0" : "") + dateComponent;
    };

    var formatDate = function (date) {
      return (
        formatDateComponent(date.getDate()) +
        "/" +
        formatDateComponent(date.getMonth() + 1) +
        "/" +
        date.getFullYear()
      );
    };

    var formatDateERP = function (date) {
      return (
        date.getFullYear() +
        "-" +
        formatDateComponent(date.getMonth() + 1) +
        "-" +
        formatDateComponent(date.getDate())
      );
    };

    var fromDate = formatDate(prevMonthFirstDate);
    var toDate = formatDate(prevMonthLastDate);

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(toDate);

    var getLoadDate = formatDateERP(prevMonthLastDate);
    let getDateFrom = formatDateERP(prevMonthFirstDate);
    templateObject.dateAsAt.set(fromDate);

    // templateObject.getGeneralLedgerReports(getDateFrom, getLoadDate, false);
  },
  "click #lastQuarter": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1GeneralLedger_Report", "");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
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
    $("#dateFrom").val(lastQuarterStartDateFormat);
    $("#dateTo").val(lastQuarterEndDateFormat);

    let fromDateMonth = getQuarter(currentDate);
    var quarterMonth = getQuarter(currentDate);
    let fromDateDay = currentDate.getDate();

    var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
    let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
    // templateObject.getGeneralLedgerReports(getDateFrom, getLoadDate, false);
  },
  "click #last12Months": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1GeneralLedger_Report", "");
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

    var fromDate =
      fromDateDay +
      "/" +
      fromDateMonth +
      "/" +
      Math.floor(currentDate.getFullYear() - 1);
    templateObject.dateAsAt.set(begunDate);
    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom =
      Math.floor(currentDate2.getFullYear() - 1) +
      "-" +
      Math.floor(currentDate2.getMonth() + 1) +
      "-" +
      currentDate2.getDate();
    // templateObject.getGeneralLedgerReports(getDateFrom, getLoadDate, false);
  },
  "click #ignoreDate": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1GeneralLedger_Report", "");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.dateAsAt.set("Current Date");
    // templateObject.getGeneralLedgerReports("", "", true);
  },
});

Template.customersummaryreport.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
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
