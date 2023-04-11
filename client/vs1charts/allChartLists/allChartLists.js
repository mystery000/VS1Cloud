import { ReactiveVar, Reactive } from "meteor/reactive-var";
import "gauge-chart";

import resizableCharts from "../../js/Charts/resizableCharts";
import draggableCharts from "../../js/Charts/draggableCharts";
import '../../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';
import './allChartLists.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../bankaccountschart/bankaccountschart.html';
import '../monthlyprofitandloss/monthlyprofitandloss.html';
import '../profitandlosschart/profitandlosschart.js';
import '../resalescomparision/resalescomparision.html';
import '../expenses/expenseschart.html';
import '../accountslist/accountslistchart.html';
import '../mytaskswdiget/mytaskswidgetchart.html';

import '../top10Customers/dsm_top10Customers.html';
import '../../Dashboard/appointments-widget/dsm-appointments-widget.html';
import '../../Dashboard/appointments-widget/ds-appointments-widget.html';

import moment from "moment";
import { ChartService } from "../chart-service";
import { CardService } from "../card-service";
let _ = require("lodash");

let chartsPlaceList = {
    "Accounts_Overview": [
        "accountrevenuestreams",
        "profitandlosschart",
    ],

    "Contacts_Overview": [
        "top10Customers",
        "top10Suppliers",
        "activeEmployees",
    ],

    "Dashboard_Overview": [
        "bankaccountschart",
        "monthlyprofitandloss",
        "profitandlosschart",
        "resalescomparision",
        "expenseschart",
        "accountslistchart",
        "mytaskswidgetchart",
    ],

    "DSMCharts_Overview": [
        "mytaskswidgetchart",
        "dashboardManagerCharts",
        "dsmTop10Customers",
        "dsmAppointmentsWidget",
        "resalescomparision",
        "opportunitiesStatus",
        "dsmleadlistchart",
    ],

    "DSCharts_Overview": [
        "dashboardSalesCharts",
        "dsAppointmentsWidget",
        "dsleadlistchart",
        "mytaskswidgetchart",
    ],

    "Inventory_Overview": [
        "invstockonhandanddemand",
        "top10Suppliers",
    ],

    "Manufacturing_Overview": [
        "productionplannerChart"
    ],

    "Payroll_Overview": [
        "employeeDaysAbsent",
        "clockedOnEmployees",
        "employeesOnLeave"
    ],

    "Purchases_Overview": [
        "monthllyexpenses",
        "expensebreakdown",
    ],

    "Sales_Overview": [
        "quotedsalesorderinvoicedamounts",
        "top10Customers",
        "resalescomparision",
    ],

    "CRM_Overview": [
        "crmleadchart",
        // "resalescomparision"
    ],

    "All_Charts" :[
        "",
    ],
};

let chartService = new ChartService()
let cardService = new CardService()
let _chartGroup = "";
let _tabGroup = 0;


Template.allChartLists.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.chartList = new ReactiveVar([]);
    templateObject.updateChart = new ReactiveVar({update: false})
});

Template.allChartLists.onRendered(function() {
    const templateObject = Template.instance();
    _tabGroup = $("#connectedSortable").data("tabgroup");
    _chartGroup = $("#connectedSortable").data("chartgroup");       

    templateObject.deactivateDraggable = () => {
        draggableCharts.disable();
        resizableCharts.disable(); // this will disable charts resiable features
    };
    templateObject.activateDraggable = () => {
        draggableCharts.enable();
        resizableCharts.enable(); // this will enable charts resiable features
    };
    chartService.checkChartToDisplay(); // we run this so we load the correct charts to diplay
    templateObject.activateDraggable(); // this will enable charts resiable features

    $(document).on("change", "#dateFrom, #dateTo", () => {
        let dateFrom = $("#dateFrom").datepicker("getDate");
        $("#dateTo").datepicker("option", "minDate", dateFrom);
        let dateTo = $("#dateTo").datepicker("getDate");
        $("#dateFrom").datepicker("option", "maxDate", dateTo);   

        const from = $("#dateFrom").val().split('/');
        const to = $("#dateTo").val().split('/');

        templateObject.updateChart.set({
            update: true,
            dateFrom: `${from[2]}-${from[1]}-${from[0]}`,
            dateTo: `${to[2]}-${to[1]}-${to[0]}`,
        });
    })
});

Template.allChartLists.events({
    "change .chartShowOption": (e) => {
        // this will toggle the visibility of the widget        
    },
    "mouseover .card-header": (e) => {
        $(e.currentTarget).parent(".card").addClass("hovered");
    },
    "mouseleave .card-header": (e) => {
        $(e.currentTarget).parent(".card").removeClass("hovered");
    },
    "click .btnBatchUpdate": function() {
        $(".fullScreenSpin").css("display", "inline-block");
        batchUpdateCall();
    },
    "click .editchartsbtn": () => {        
        chartService.onEdit()
        cardService.onEdit()
    },
    "click .resetchartbtn": () => {        
        chartService.resetCharts()
        cardService.resetCards()
    },    
});

Template.allChartLists.helpers({
    updateChart: () => {
        return Template.instance().updateChart.get()
    },
    isaccountoverview: () => {
        const currentLoc = FlowRouter.current().route.path;
        let isAccountOverviewPage = false;
        if (currentLoc == "/accountsoverview" || currentLoc == "/dashboard") {
            isAccountOverviewPage = true;
        }
        return isAccountOverviewPage;
    },

    is_available_chart: (current, chart) => {
        if(current == 'All_Charts') return 1;
        return chartsPlaceList[current].includes(chart);
    },

    is_dashboard_check: (currentTemplate) => {
        return FlowRouter.current().path.includes(currentTemplate);
    },
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
