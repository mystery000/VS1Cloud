import moment from "moment";
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './daterangedropdownoption.html';
Template.daterangedropdownoption.inheritsHooksFrom('daterangedropdownoption');
Template.daterangedropdownoption.inheritsHooksFrom('daterangefromto_trans');
Template.daterangedropdownoption.onCreated(function(){
});

Template.daterangedropdownoption.onRendered(function() {
  var today = moment().format("DD/MM/YYYY");
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = currentDate.getMonth() + 1;
  let fromDateDay = currentDate.getDate();
  if (currentDate.getMonth() + 1 < 10) {
    fromDateMonth = "0" + (currentDate.getMonth() + 1);
  }

  let prevMonth = moment().subtract(1, 'months').format('MM')
  if (currentDate.getDate() < 10) {
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate = fromDateDay + "/" + prevMonth + "/" + currentDate.getFullYear();
  $(".dateTo,.dateFrom").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonClass: "btnImageSelect",
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
      $(this).datepicker("setDate",
        new Date(year, inst.selectedMonth, inst.selectedDay)
      );
    },
  });

  $(".dateFrom").val(fromDate);
  $(".dateTo").val(begunDate);
});

Template.daterangedropdownoption.events({
  'click .ignoreDate': function() {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', true);
      $('.dateTo').attr('readonly', true);
  },
  'click .today': function () {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);
      var currentBeginDate = new Date();
      var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
      let fromDateMonth = (currentBeginDate.getMonth() + 1);
      let fromDateDay = currentBeginDate.getDate();
      if((currentBeginDate.getMonth()+1) < 10){
          fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
      }else{
        fromDateMonth = (currentBeginDate.getMonth()+1);
      }

      if(currentBeginDate.getDate() < 10){
          fromDateDay = "0" + currentBeginDate.getDate();
      }
      var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
      var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);

      var toDateDisplayFrom = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
      var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();

      $(".dateFrom").val(toDateDisplayFrom).trigger('change');
      $(".dateTo").val(toDateDisplayTo).trigger('change');
  },
  'click .thisweek': function () {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);
      var currentBeginDate = new Date();
      var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
      let fromDateMonth = (currentBeginDate.getMonth() + 1);
      let fromDateDay = currentBeginDate.getDate();
      if((currentBeginDate.getMonth()+1) < 10){
          fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
      }else{
        fromDateMonth = (currentBeginDate.getMonth()+1);
      }

      if(currentBeginDate.getDate() < 10){
          fromDateDay = "0" + currentBeginDate.getDate();
      }
      var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay - 7);
      var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);

      var toDateDisplayFrom = (fromDateDay -7)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
      var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();

      $(".dateFrom").val(toDateDisplayFrom).trigger('change');
      $(".dateTo").val(toDateDisplayTo).trigger('change');
  },
  'click .thisMonth': function() {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);
      var currentDate = new Date();

      var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);
      var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), ((currentDate.getMonth() - 1 + 12) % 12)+1, 1);

      var formatDateComponent = function(dateComponent) {
        return (dateComponent < 10 ? '0' : '') + dateComponent;
      };

      var formatDate = function(date) {
        return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
      };

      var formatDateERP = function(date) {
        return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
      };


      var fromDate = formatDate(prevMonthFirstDate);
      var toDate = formatDate(prevMonthLastDate);

      $(".dateFrom").val(fromDate).trigger('change');
      $(".dateTo").val(toDate).trigger('change');
  },
  'click .thisQuarter': function() {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);

      var thisQuarterStartDateFormat =  moment().startOf("Q").format("DD/MM/YYYY");
      var thisQuarterEndDateFormat = moment().endOf("Q").format("DD/MM/YYYY");

      $(".dateFrom").val(thisQuarterStartDateFormat).trigger('change');
      $(".dateTo").val(thisQuarterEndDateFormat).trigger('change');
  },
  'click .thisfinancialyear': function() {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      function getQuarter(d) {
          d = d || new Date();
          var m = Math.floor(d.getMonth() / 3) + 2;
          return m > 4 ? m - 4 : m;
      }

      var quarterAdjustment = (moment().month() % 3) + 1;
      var lastQuarterEndDate = moment().subtract({
          months: quarterAdjustment
      }).endOf('month');
      var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
          months: 2
      }).startOf('month');

      var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
      var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");


      $(".dateFrom").val(lastQuarterStartDateFormat).trigger('change');
      $(".dateTo").val(lastQuarterEndDateFormat).trigger('change');
  },
  'click .thisQuarter': function() {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
      let fromDateDay = currentDate.getDate();
      if ((currentDate.getMonth() + 1) < 10) {
          fromDateMonth = "0" + (currentDate.getMonth() + 1);
      }
      if (currentDate.getDate() < 10) {
          fromDateDay = "0" + currentDate.getDate();
      }

      var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
      $(".dateFrom").val(fromDate).trigger('change');
      $(".dateTo").val(begunDate).trigger('change');

  },
  'click .previousweek': function () {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);
      var currentBeginDate = new Date();
      var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
      let fromDateMonth = (currentBeginDate.getMonth() + 1);
      let fromDateDay = currentBeginDate.getDate();
      if((currentBeginDate.getMonth()+1) < 10){
          fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
      }else{
        fromDateMonth = (currentBeginDate.getMonth()+1);
      }

      if(currentBeginDate.getDate() < 10){
          fromDateDay = "0" + currentBeginDate.getDate();
      }
      var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay - 7);
      var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);

      var toDateDisplayFrom = (fromDateDay -7)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
      var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();

      $(".dateFrom").val(toDateDisplayFrom).trigger('change');
      $(".dateTo").val(toDateDisplayTo).trigger('change');
  },
  'click .previousmonth': function() {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);
      var currentDate = new Date();

      var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);

      var formatDateComponent = function(dateComponent) {
        return (dateComponent < 10 ? '0' : '') + dateComponent;
      };

      var formatDate = function(date) {
        return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
      };

      var formatDateERP = function(date) {
        return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
      };


      var fromDate = formatDate(prevMonthFirstDate);
      var toDate = formatDate(prevMonthLastDate);

      $(".dateFrom").val(fromDate).trigger('change');
      $(".dateTo").val(toDate).trigger('change');

  },
  'click .previousquarter': function() {
      let templateObject = Template.instance();
      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      function getQuarter(d) {
          d = d || new Date();
          var m = Math.floor(d.getMonth() / 3) + 2;
          return m > 4 ? m - 4 : m;
      }

      var quarterAdjustment = (moment().month() % 3) + 1;
      var lastQuarterEndDate = moment().subtract({
          months: quarterAdjustment
      }).endOf('month');
      var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
          months: 2
      }).startOf('month');

      var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
      var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");


      $(".dateFrom").val(lastQuarterStartDateFormat).trigger('change');
      $(".dateTo").val(lastQuarterEndDateFormat).trigger('change');
  },
  'click .previousfinancialyear': function() {
      let templateObject = Template.instance();

      $('.dateFrom').attr('readonly', false);
      $('.dateTo').attr('readonly', false);
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
      let fromDateDay = currentDate.getDate();
      if ((currentDate.getMonth() + 1) < 10) {
          fromDateMonth = "0" + (currentDate.getMonth() + 1);
      }
      if (currentDate.getDate() < 10) {
          fromDateDay = "0" + currentDate.getDate();
      }

      var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
      $(".dateFrom").val(fromDate).trigger('change');
      $(".dateTo").val(begunDate).trigger('change');
  },
});

Template.daterangedropdownoption.helpers({
});
