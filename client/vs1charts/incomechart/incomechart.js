import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.incomechart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.totalInvoiceCount = new ReactiveVar();
  templateObject.totalInvoiceValue = new ReactiveVar();
  templateObject.averageInvoiceValue = new ReactiveVar();
  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();
});

Template.incomechart.onRendered(()=>{
  const templateObject = Template.instance();
  let utilityService = new UtilityService();

  var currentDate = new Date();
  const monSml = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var currMonth1 = "", currMonth2 = "";
  if (currentDate.getMonth() == 0) {
    currMonth1 = monSml[10] + " " + (currentDate.getFullYear() - 1);
    currMonth2 = monSml[11] + " " + (currentDate.getFullYear() - 1);
  } else if (currentDate.getMonth() == 1) {
    currMonth1 = monSml[11] + " " + (currentDate.getFullYear() - 1);
    currMonth2 = monSml[0] + " " + currentDate.getFullYear();
  } else {
    currMonth1 = monSml[currentDate.getMonth() - 2] + " " + currentDate.getFullYear();
    currMonth2 = monSml[currentDate.getMonth() - 1] + " " + currentDate.getFullYear();
  }
  templateObject.titleMonth1.set(currMonth1);
  templateObject.titleMonth2.set(currMonth2);
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = (currentDate.getMonth() + 1);
  let fromDateDay = currentDate.getDate();
  if((currentDate.getMonth()+1) < 10){
    fromDateMonth = "0" + (currentDate.getMonth()+1);
  }
  if(currentDate.getDate() < 10){
    fromDateDay = "0" + currentDate.getDate();
  }
  templateObject.dateAsAt.set(begunDate);

  let outstandingInvAmt = localStorage.getItem('VS1OutstandingInvoiceAmt_dash') || 0;
  let outstandingInvQty = localStorage.getItem('VS1OutstandingInvoiceQty_dash') || 0;
  let overdueInvAmt = localStorage.getItem('VS1OverDueInvoiceAmt_dash') || 0;
  let overdueInvQty = localStorage.getItem('VS1OverDueInvoiceQty_dash') || 0;

  let totalInvQty = Number(outstandingInvQty) + Number(overdueInvQty);
  let totalInvAmt = Number(outstandingInvAmt) + Number(overdueInvAmt);
  let reportsDateFrom = localStorage.getItem('VS1ReportsDateFrom_dash') || "";
  let reportsDateTo = localStorage.getItem('VS1ReportsDateTo_dash') || "";
  let prd = 0;
  if (reportsDateFrom == "" || reportsDateTo == "") {
    prd = 6;
  } else {
    let monthFrom = reportsDateFrom.substring(5, 6);
    let monthTo = reportsDateTo.substring(5, 6);
    prd = Number(monthTo) - Number(monthFrom);
  }
  let averageInvAmt = totalInvAmt / prd;

  templateObject.totalInvoiceCount.set(totalInvQty);
  templateObject.averageInvoiceValue.set(averageInvAmt);
  templateObject.totalInvoiceValue.set(totalInvAmt);

  $('.spnTotalInvoiceCount').html(totalInvQty);
  $('.spnAverageInvoiceValue').html(utilityService.modifynegativeCurrencyFormat(averageInvAmt));
  $('.spnTotalInvoiceValue').html(utilityService.modifynegativeCurrencyFormat(totalInvAmt));
});

Template.incomechart.events({
});

Template.incomechart.helpers({
  dateAsAt: () =>{
      return Template.instance().dateAsAt.get() || '-';
  },
  titleMonth1: () =>{
      return Template.instance().titleMonth1.get();
  },
  titleMonth2: () =>{
      return Template.instance().titleMonth2.get();
  },
  totalInvoiceCount: () =>{
      return Template.instance().totalInvoiceCount.get() || 0;
  },
  averageInvoiceValue: () =>{
      return Template.instance().averageInvoiceValue.get() || 0;
  },
  totalInvoiceValue: () =>{
      return Template.instance().totalInvoiceValue.get() || 0;
  }
});

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.registerHelper('notEquals', function (a, b) {
  return a != b;
});

Template.registerHelper('containsequals', function (a, b) {
  return (a.indexOf(b) >= 0 );
});