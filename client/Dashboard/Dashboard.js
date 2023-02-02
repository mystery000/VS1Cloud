import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { DashBoardService } from "./dashboard-service";
import { UtilityService } from "../utility-service";
import { VS1ChartService } from "../vs1charts/vs1charts-service";
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './dashboard.html';
import "gauge-chart";

let _ = require("lodash");
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
let monthlyprofitlosschart = localStorage.getItem("profitchat") || true;
let profitlosschart = localStorage.getItem("profitloss") || true;
let resalechart = localStorage.getItem("hideresalechat") || true;
let quotedinvoicedchart = localStorage.getItem("quotedinvoicedchart") || true;
let earningschart = localStorage.getItem("earningschat") || true;
let expenseschart = localStorage.getItem("expenseschart") || true;

let Charts = {
  monthlyProfitLoss: false,
  profitLoss: false,
  resale: false,
  quotedInvoiced: false,
  earnings: false,
  expenses: false,
};

Template.dashboard.onCreated(function () {
  this.loggedDb = new ReactiveVar("");
  const templateObject = Template.instance();
  templateObject.includeDashboard = new ReactiveVar();
  templateObject.includeDashboard.set(false);

  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();
});

Template.dashboard.onRendered(function () {

  let templateObject = Template.instance();
  let isDashboard = localStorage.getItem("CloudDashboardModule");
  if (isDashboard) {
    templateObject.includeDashboard.set(true);
  }

  const currentDate = new Date();
  let fromDate = moment().subtract(2, 'month').format('DD/MM/YYYY');
  let toDate = moment(currentDate).format("DD/MM/YYYY");

  setTimeout(function(){
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
          onChangeMonthYear: function(year, month, inst){
              // Set date to picker
              $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
              // Hide (close) the picker
              // $(this).datepicker('hide');
              // // Change ttrigger the on change function
              // $(this).trigger('change');
          }
      });
      let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
      let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
      let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
      if (urlParametersDateFrom) {
          if (urlParametersIgnoreDate == true) {
              $("#dateFrom").attr("readonly", true);
              $("#dateTo").attr("readonly", true);
          } else {
              let paramFromDate = urlParametersDateFrom != "" ? new Date(urlParametersDateFrom): urlParametersDateFrom;
              paramFromDate = moment(paramFromDate).format("DD/MM/YYYY");
              $("#dateFrom").val(paramFromDate);
              let paramToDate = urlParametersDateTo != ""? new Date(urlParametersDateTo): urlParametersDateTo;
              paramToDate = moment(paramToDate).format("DD/MM/YYYY");
              $("#dateTo").val(paramToDate);
          }
      } else {
          $("#dateFrom").val(fromDate);
          $("#dateTo").val(toDate);
      }
      if (urlParametersIgnoreDate == "true") {
          $("#dateFrom").val(null);
          $("#dateTo").val(null);
      }
      $('[data-toggle="tooltip"]').tooltip({html: true});
  },500);
});

Template.dashboard.helpers({
  includeDashboard: () => {
    const res = Template.instance().includeDashboard.get();
    return res;
  },
  loggedDb: function () {
    return Template.instance().loggedDb.get();
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
  lastBatchUpdate: () => {
    let transactionTableLastUpdated = "";
    var currentDate = new Date();
    if(localStorage.getItem('VS1TransTableUpdate')){
       transactionTableLastUpdated = moment(localStorage.getItem('VS1TransTableUpdate')).format("ddd MMM D, YYYY, hh:mm A");
    }else{
      transactionTableLastUpdated = moment(currentDate).format("ddd MMM D, YYYY, hh:mm A");
    }
    return transactionTableLastUpdated;
  },
});

// Listen to event to update reactive variable
Template.dashboard.events({
  "change #dateTo": function () {
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    const dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    const dateTo = new Date($("#dateTo").datepicker("getDate"));
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
    window.open("/dashboard?fromDate="+formatDateFrom+"&toDate="+formatDateTo, '_self');
},
"change #dateFrom": function () {
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    const dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    const dateTo = new Date($("#dateTo").datepicker("getDate"));
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
    window.open("/dashboard?fromDate="+formatDateFrom+"&toDate="+formatDateTo, '_self');
},
"click #today": function () {
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    const currentBeginDate = new Date();
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
        fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
        fromDateMonth = currentBeginDate.getMonth() + 1;
    }
    if (currentBeginDate.getDate() < 10) {
        fromDateDay = "0" + currentBeginDate.getDate();
    }
    const toDateERPFrom = currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    const toDateERPTo = currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    window.open("/dashboard?fromDate="+toDateERPFrom+"&toDate="+toDateERPTo, '_self');
},
"click #lastweek": function () {
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    const currentBeginDate = new Date();
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
        fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
        fromDateMonth = currentBeginDate.getMonth() + 1;
    }
    if (currentBeginDate.getDate() < 10) {
        fromDateDay = "0" + currentBeginDate.getDate();
    }
    const toDateERPFrom =
        currentBeginDate.getFullYear() +
        "-" +
        fromDateMonth +
        "-" +
        (fromDateDay - 7);
    const toDateERPTo = currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    window.open("/dashboard?fromDate="+toDateERPFrom+"&toDate="+toDateERPTo, '_self');
},
"click #lastMonth": function () {
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    const currentDate = new Date();
    const prevMonthLastDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
    );
    const prevMonthFirstDate = new Date(
        currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1),
        (currentDate.getMonth() - 1 + 12) % 12,
        1
    );
    const formatDateComponent = function (dateComponent) {
        return (dateComponent < 10 ? "0" : "") + dateComponent;
    };
    const formatDateERP = function (date) {
        return (
            date.getFullYear() +
            "-" +
            formatDateComponent(date.getMonth() + 1) +
            "-" +
            formatDateComponent(date.getDate())
        );
    };
    const getLoadDate = formatDateERP(prevMonthLastDate);
    const getDateFrom = formatDateERP(prevMonthFirstDate);
    window.open("/dashboard?fromDate="+getDateFrom+"&toDate="+getLoadDate, '_self');
},
"click #lastQuarter": function () {
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    const quarterAdjustment = (moment().month() % 3) + 1;
    const lastQuarterEndDate = moment()
        .subtract({
            months: quarterAdjustment,
        })
        .endOf("month");
    const lastQuarterStartDate = lastQuarterEndDate
        .clone()
        .subtract({
            months: 2,
        })
        .startOf("month");
    const getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
    const getDateFrom = moment(lastQuarterStartDate).format("YYYY-MM-DD");
    window.open("/dashboard?fromDate="+getDateFrom+"&toDate="+getLoadDate, '_self');
},
"click #last12Months": function () {
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    const currentDate = new Date();
    const toDate = moment(currentDate).format("YYYY-MM-DD");
    let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if (currentDate.getMonth() + 1 < 10) {
        fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }
    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }
    const fromDate = Math.floor(currentDate.getFullYear() - 1) + "-" + fromDateMonth + "-" + fromDateDay;
    window.open("/dashboard?fromDate="+fromDate+"&toDate="+toDate, '_self');
    // FlowRouter.go("/dashboardsalesmanager?fromDate="+fromDate+"&toDate="+toDate);
},
"click #ignoreDate": function () {
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    window.open("/dashboard?ignoredate="+true, '_self');
},
  "click .progressbarcheck": function () {
    var valeur = 0;
    $(".loadingbar")
      .css("width", valeur + "%")
      .attr("aria-valuenow", valeur);
    $("input:checked").each(function () {
      if ($(this).attr("value") > valeur) {
        valeur = $(this).attr("value");
      }
    });
    $(".loadingbar")
      .css("width", valeur + "%")
      .attr("aria-valuenow", valeur);
    $(".progressBarInner").text("Invoices " + valeur + "%");
  },
  'click .btnBatchUpdate': function () {
    $('.fullScreenSpin').css('display','inline-block');
      batchUpdateCall();
  },
  // "click #hideearnings": function () {
  //   let check = earningschart;
  //   if (check == "true" || check == true) {
  //     earningschart = false;
  //     $(".monthlyearningsedit").text("Show");
  //   } else {
  //     earningschart = true;
  //     $(".monthlyearningsedit").text("Hide");
  //   }
  // },
  // "click #expenseshide": function () {
  //   let check = expenseschart;
  //   if (check == "true" || check == true) {
  //     expenseschart = false;
  //     $(".expensesedit").text("Show");
  //     // localStorage.setItem("expenseschart",false);
  //   } else {
  //     $(".expensesedit").text("Hide");
  //     expenseschart = true;
  //     // localStorage.setItem("expenseschart",true);
  //   }
  // },
  // "click #profitloss1hide": function () {
  //   let check = profitlosschart;
  //   if (check == "true" || check == true) {
  //     profitlosschart = false;
  //     $(".profitlossedit").text("Show");
  //   } else {
  //     $(".profitlossedit").text("Hide");
  //     profitlosschart = true;
  //   }
  // },
  // "click #profitlosshide": function () {
  //   let check = monthlyprofitlosschart;
  //   if (check == "true" || check == true) {
  //     monthlyprofitlosschart = false;
  //     $(".monthlyprofilelossedit").text("Show");
  //   } else {
  //     $(".monthlyprofilelossedit").text("Hide");
  //     monthlyprofitlosschart = true;
  //   }
  // },

  // "click #resalehide": function () {
  //   let check = resalechart;
  //   if (check == "true" || check == true) {
  //     resalechart = false;
  //     $(".resalecomparisionedit").text("Show");
  //   } else {
  //     $(".resalecomparisionedit").text("Hide");
  //     resalechart = true;
  //   }
  // },

  // "click #hidesales1": function () {
  //   let check = quotedinvoicedchart;
  //   if (check == "true" || check == true) {
  //     quotedinvoicedchart = false;
  //     $(".quotedinvoicededit").text("Show");
  //   } else {
  //     $(".quotedinvoicededit").text("Hide");
  //     quotedinvoicedchart = true;
  //   }
  // },
});
