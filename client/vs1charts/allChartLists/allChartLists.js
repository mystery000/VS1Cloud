import { ReactiveVar, Reactive } from "meteor/reactive-var";
import { ReactiveDict } from 'meteor/reactive-dict'
import "gauge-chart";

import DashboardApi from "../../js/Api/DashboardApi";
import Tvs1chart from "../../js/Api/Model/Tvs1Chart";
import resizableCharts from "../../js/Charts/resizableCharts";
import ChartsEditor from "../../js/Charts/ChartsEditor";
import ChartHandler from "../../js/Charts/ChartHandler";
import draggableCharts from "../../js/Charts/draggableCharts";
import Tvs1ChartDashboardPreference from "../../js/Api/Model/Tvs1ChartDashboardPreference";
import Tvs1ChartDashboardPreferenceField from "../../js/Api/Model/Tvs1ChartDashboardPreferenceField";
import ApiService from "../../js/Api/Module/ApiService";
import '../../lib/global/indexdbstorage.js';
import { SideBarService } from "../../js/sidebar-service";
import { ContactService } from "../../contacts/contact-service";
import { Session } from 'meteor/session';
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

let sideBarService = new SideBarService();
const contactService = new ContactService();
/**
 * Current User ID
 */
const employeeId = localStorage.getItem("mySessionEmployeeLoggedID");
var _chartGroup = "";
var _tabGroup = 0;
const chartsEditor = new ChartsEditor(
    () => {
        $("#resetcharts").removeClass("hideelement").addClass("showelement"); // This will show the reset charts button

        $("#btnDone").addClass("showelement");
        $("#btnDone").removeClass("hideelement");
        $("#btnCancel").addClass("showelement");
        $("#btnCancel").removeClass("hideelement");
        $("#editcharts").addClass("hideelement");
        $("#editcharts").removeClass("showelement");
        $(".btnchartdropdown").addClass("hideelement");
        $(".btnchartdropdown").removeClass("showelement");

        // $("#resalecomparision").removeClass("hideelement");
        // $("#quotedinvoicedamount").removeClass("hideelement");
        // $("#expensechart").removeClass("hideelement");
        // $("#monthlyprofitlossstatus").removeClass("hideelement");
        // $("#resalecomparision").removeClass("hideelement");
        // $("#showearningchat").removeClass("hideelement");

        $(".sortable-chart-widget-js").removeClass("hideelement"); // display every charts
        $(".on-editor-change-mode").removeClass("hideelement");
        $(".on-editor-change-mode").addClass("showelement");
    },
    () => {
        $("#resetcharts").addClass("hideelement").removeClass("showelement"); // this will hide it back
        $("#btnDone").addClass("hideelement");
        $("#btnDone").removeClass("showelement");
        $("#btnCancel").addClass("hideelement");
        $("#btnCancel").removeClass("showelement");
        $("#editcharts").addClass("showelement");
        $("#editcharts").removeClass("hideelement");
        $(".btnchartdropdown").removeClass("hideelement");
        $(".btnchartdropdown").addClass("showelement");

        $(".on-editor-change-mode").removeClass("showelement");
        $(".on-editor-change-mode").addClass("hideelement");
    }
);

/**
 * This function will save the charts on the dashboard
 */
async function saveCharts() {
    /**
     * Lets load all API colections
     */
    const dashboardApis = new DashboardApi(); // Load all dashboard APIS
    ChartHandler.buildPositions();
    const charts = $(".chart-visibility.editCharts");
    /**
     * @property {Tvs1ChartDashboardPreference[]}
     */
    let chartList = [];
    // now we have to make the post request to save the data in database
    const apiEndpoint = dashboardApis.collection.findByName(
        dashboardApis.collectionNames.Tvs1dashboardpreferences
    );

    let dashboardpreferences = await getVS1Data('Tvs1dashboardpreferences');
    dashboardpreferences = JSON.parse(dashboardpreferences[0].data);
    if (dashboardpreferences.length) {
        dashboardpreferences.forEach((chart) => {
            if (chart.fields != undefined && chart.fields.TabGroup != _tabGroup) {
                chartList.push(chart);
            }
        });
    }

    Array.prototype.forEach.call(charts, (chart) => {
        chartList.push(
            new Tvs1ChartDashboardPreference({
                type: "Tvs1dashboardpreferences",
                fields: new Tvs1ChartDashboardPreferenceField({
                    Active: $(chart).find(".on-editor-change-mode").attr("is-hidden") == true ||
                        $(chart).find(".on-editor-change-mode").attr("is-hidden") == "true" ?
                        false : true,
                    ChartID: parseInt($(chart).attr("chart-id")),
                    ID: parseInt($(chart).attr("pref-id")),
                    EmployeeID: employeeId,
                    ChartName: $(chart).attr("chart-name"),
                    Position: parseInt($(chart).attr("position")),
                    ChartGroup: $(chart).attr("chart-group"),
                    TabGroup: parseInt(_tabGroup),
                    ChartWidth: ChartHandler.calculateWidth(chart),
                    ChartHeight: ChartHandler.calculateHeight(chart),
                }),
            })
        );
    });
    // for (const _chart of chartList) {
    let chartJSON = {
        type: "Tvs1dashboardpreferences",
        objects: chartList
    };

    if (chartList.length > 0) {
        await addVS1Data('Tvs1dashboardpreferences', JSON.stringify(chartList));
    }

    const ApiResponse = await apiEndpoint.fetch(null, {
        method: "POST",
        headers: ApiService.getPostHeaders(),
        body: JSON.stringify(chartJSON),
    });
    if (ApiResponse.ok == true) {
        const jsonResponse = await ApiResponse.json();
    }
    // }
}

Template.allChartLists.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.chartList = new ReactiveVar([]);
    templateObject.updateChart = new ReactiveVar({update: false})
});

Template.allChartLists.onRendered(function() {
    const templateObject = Template.instance();
    _tabGroup = $("#connectedSortable").data("tabgroup");
    _chartGroup = $("#connectedSortable").data("chartgroup");

    templateObject.hideChartElements = () => {
        // on edit mode false
        // $(".on-editor-change-mode").removeClass("showelement");
        // $(".on-editor-change-mode").addClass("hideelement");
        const dimmedElements = document.getElementsByClassName("dimmedChart");
        while (dimmedElements.length > 0) {
            dimmedElements[0].classList.remove("dimmedChart");
        }
    };
    templateObject.showChartElements = function() {
        // on edit mode true
        // $(".on-editor-change-mode").addClass("showelement");
        // $(".on-editor-change-mode").removeClass("hideelement");
        $('.sortable-chart-widget-js').removeClass("col-md-12 col-md-8 col-md-6 col-md-4");
        $('.sortable-chart-widget-js').addClass("editCharts");
        $('.sortable-chart-widget-js').each(function() {
            let className = $(this).data('default-class');
            $(this).addClass(className);
            $(this).find('.portlet').addClass('minHeight100');
        });
        if ($('.fc-dayGridMonth-button').length > 0) {
            $('.fc-dayGridMonth-button').trigger('click');
        }
        $(".card").addClass("dimmedChart");
        $(".py-2").removeClass("dimmedChart");
    };
    templateObject.checkChartToDisplay = async() => {
        let defaultChartList = [];
        let chartList = [];
        const dashboardApis = new DashboardApi(); // Load all dashboard APIS
        let displayedCharts = 0;

        let dashboardpreferences = await getVS1Data('Tvs1dashboardpreferences');
        if (dashboardpreferences.length == 0) {} else {
            dashboardpreferences = JSON.parse(dashboardpreferences[0].data);
        };

        if (dashboardpreferences.length) {
            dashboardpreferences.forEach((chart) => {
                if (chart.fields != undefined && chart.fields.TabGroup == _tabGroup) {
                    chartList.push(chart);
                }
            });
        }

        if (chartList.length == 0) {
            chartList = await ChartHandler.getTvs1charts();
            if (chartList.length == 0) {
                // Fetching data from API
                const allChartsEndpoint = dashboardApis.collection.findByName(
                    dashboardApis.collectionNames.vs1charts
                );
                allChartsEndpoint.url.searchParams.append("ListType", "'Detail'");
                const allChartResponse = await allChartsEndpoint.fetch();
                if (allChartResponse.ok == true) {
                    const allChartsJsonResponse = await allChartResponse.json();
                    chartList = Tvs1chart.fromList(allChartsJsonResponse.tvs1charts);
                }
            }
            if (chartList.length > 0) {
                let my_tasksChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "My Tasks",
                        ID: 902,
                        _chartSlug: "dsmcharts__my_tasks"
                    }
                };
                chartList.push(my_tasksChart);
                let salesQuotaChart1 = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Sales Quota 1",
                        ID: 903,
                        _chartSlug: "dsmcharts__sales_quota_1"
                    }
                };
                chartList.push(salesQuotaChart1);
                let salesQuotaChart2 = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Sales Quota 2",
                        ID: 904,
                        _chartSlug: "dsmcharts__sales_quota_2"
                    }
                };
                chartList.push(salesQuotaChart2);
                let salesQuotaChart3 = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Sales Quota 3",
                        ID: 905,
                        _chartSlug: "dsmcharts__sales_quota_3"
                    }
                };
                chartList.push(salesQuotaChart3);
                let salesQuotaChart4 = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Sales Quota 4",
                        ID: 906,
                        _chartSlug: "dsmcharts__sales_quota_4"
                    }
                };
                chartList.push(salesQuotaChart4);
                let salesQuotaChart5 = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Sales Quota 5",
                        ID: 907,
                        _chartSlug: "dsmcharts__sales_quota_5"
                    }
                };
                chartList.push(salesQuotaChart5);
                let salesQuotaChart6 = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Sales Quota 6",
                        ID: 908,
                        _chartSlug: "dsmcharts__sales_quota_6"
                    }
                };
                chartList.push(salesQuotaChart6);
                let dsmTop_10_customers = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Top 10 Customers",
                        ID: 909,
                        _chartSlug: "dsmcharts__top_10_customers"
                    }
                };
                chartList.push(dsmTop_10_customers);
                let dsmEmployee_sales_comparison = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Employee Sales Comparison",
                        ID: 910,
                        _chartSlug: "dsmcharts__employee_sales_comparison"
                    }
                };
                chartList.push(dsmEmployee_sales_comparison);
                let dsmAppointmentListChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Appointment List",
                        ID: 911,
                        _chartSlug: "dsmcharts__appointment_list"
                    }
                };
                chartList.push(dsmAppointmentListChart);
                let dsmOpportunitiesStatusChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Opportunities Status",
                        ID: 912,
                        _chartSlug: "dsmcharts__opportunities_status"
                    }
                };
                chartList.push(dsmOpportunitiesStatusChart);
                let dsmLeadListChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSMCharts",
                        ChartName: "Lead List",
                        ID: 913,
                        _chartSlug: "dsmcharts__lead_list"
                    }
                };
                chartList.push(dsmLeadListChart);
                let my_tasksChart1 = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSCharts",
                        ChartName: "My Tasks",
                        ID: 914,
                        _chartSlug: "dscharts__my_tasks"
                    }
                };
                chartList.push(my_tasksChart1);
                let dsAppointmentListChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSCharts",
                        ChartName: "Appointment List",
                        ID: 915,
                        _chartSlug: "dscharts__appointment_list"
                    }
                };
                chartList.push(dsAppointmentListChart);
                let performanceQuotaChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSCharts",
                        ChartName: "Performance Quota",
                        ID: 916,
                        _chartSlug: "dscharts__performance_quota"
                    }
                };
                chartList.push(performanceQuotaChart);
                let opportunitiesSourceChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSCharts",
                        ChartName: "Opportunities Source",
                        ID: 917,
                        _chartSlug: "dscharts__opportunities_source"
                    }
                };
                chartList.push(opportunitiesSourceChart);
                let dsLeadListChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "DSCharts",
                        ChartName: "Lead List",
                        ID: 1001,
                        _chartSlug: "dscharts__lead_list"
                    }
                };
                chartList.push(dsLeadListChart);
                let accountListChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "Dashboard",
                        ChartName: "Account List",
                        ID: 1002,
                        _chartSlug: "dashboard__account_list"
                    }
                };
                chartList.push(accountListChart);

                let myTasksChart = {
                    fields: {
                        Active: true,
                        ChartGroup: "Dashboard",
                        ChartName: "My Tasks",
                        ID: 1005,
                        _chartSlug: "dashboard__mytaskschart"
                    }
                };
                chartList.push(myTasksChart);

                let myBankAccountschart = {
                    fields: {
                        Active: true,
                        ChartGroup: "Dashboard",
                        ChartName: "Bank Accountschart",
                        ID: 1006,
                        _chartSlug: "dashboard__bank_accountschart"
                    }
                };
                chartList.push(myBankAccountschart);

                let crmOverviewchart = {
                    fields: {
                        Active: true,
                        ChartGroup: "CRM",
                        ChartName: "CRM Overview",
                        ID: 1010,
                        _chartSlug: "crm__crm_overview"
                    }
                };
                chartList.push(crmOverviewchart);
            }
        }

        if (chartList.length > 0) {
            templateObject.chartList.set(chartList);
            // Hide all charts
            $('.sortable-chart-widget-js').addClass("hideelement");
            // the goal here is to get the right names so it can be used for preferences
            setTimeout(() => {
                chartList.forEach((chart) => {
                    chart.fields._chartSlug = chart.fields.ChartGroup.toLowerCase() + "__" + chart.fields.ChartName.toLowerCase().split(" ").join("_");
                    $(`[key='${chart.fields._chartSlug}']`).addClass("chart-visibility");
                    $(`[key='${chart.fields._chartSlug}']`).attr("pref-id", 0);
                    $(`[key='${chart.fields._chartSlug}']`).attr("chart-id", chart.fields.ID);
                    // Default charts
                    let defaultClass = $(`[key='${chart.fields._chartSlug}']`).attr('data-default-class');
                    let defaultPosition = $(`[key='${chart.fields._chartSlug}']`).attr('data-default-position');
                    let storeObj = null;
                    if (localStorage.getItem(chart.fields._chartSlug))
                        storeObj = JSON.parse(localStorage.getItem(chart.fields._chartSlug));
                    $(`[key='${chart.fields._chartSlug}']`).addClass(defaultClass);
                    $(`[key='${chart.fields._chartSlug}']`).attr('position', storeObj ? storeObj.position : defaultPosition);
                    $(`[key='${chart.fields._chartSlug}']`).attr('width', '100%');
                    $(`[key='${chart.fields._chartSlug}']`).css('height', storeObj && storeObj.height && storeObj.height != 0 ? storeObj.height + "px" : "auto");
                    $(`[key='${chart.fields._chartSlug}'] .ui-resizable`).css(
                        "width",
                        storeObj && storeObj.width && storeObj.width != 0 ? storeObj.width + "px" : "100%"
                    );
                    $(`[key='${chart.fields._chartSlug}'] .ui-resizable`).css(
                        "height",
                        storeObj && storeObj.height && storeObj.height != 0 ? storeObj.height + "px" : "auto"
                    );
                    if (chart.fields.ChartGroup == _chartGroup && chart.fields.Active == true) {
                        defaultChartList.push(chart.fields._chartSlug);
                        $(`[key='${chart.fields._chartSlug}'] .on-editor-change-mode`).html(
                            "<i class='far fa-eye'></i>"
                        );
                        $(`[key='${chart.fields._chartSlug}'] .on-editor-change-mode`).attr(
                            "is-hidden",
                            "false"
                        );
                        $(`[key='${chart.fields._chartSlug}']`).removeClass("hideelement");
                        if (chart.fields._chartSlug == 'accounts__profit_and_loss') {
                            $(`[key='dashboard__profit_and_loss']`).removeClass("hideelement");
                        }
                        if (chart.fields._chartSlug == 'sales__sales_overview') {
                            $(`[key='contacts__top_10_customers']`).removeClass("hideelement");
                            $(`[key='dashboard__employee_sales_comparison']`).removeClass("hideelement");
                        }
                        if (chart.fields._chartSlug == 'inventory__stock_on_hand_and_demand') {
                            $(`[key='contacts__top_10_supplies']`).removeClass("hideelement");
                        }
                        //Auto hide on Dashboard
                        if (_chartGroup == 'Dashboard' && (chart.fields._chartSlug == 'dashboard__monthly_earnings' || chart.fields._chartSlug == 'dashboard__quoted_amounts_/_invoiced_amounts')) {
                            $(`[key='${chart.fields._chartSlug}']`).addClass("hideelement");
                        }
                    } else {
                        $(`[key='${chart.fields._chartSlug}'] .on-editor-change-mode`).html(
                            "<i class='far fa-eye-slash'></i>"
                        );
                        $(`[key='${chart.fields._chartSlug}'] .on-editor-change-mode`).attr(
                            "is-hidden",
                            "true"
                        );
                    }
                    // $(`[key='${chart.fields._chartSlug}']`).attr(
                    //   "pref-id",
                    //   chart.fields.ID
                    // );
                    $(`[key='${chart.fields._chartSlug}']`).attr(
                        "chart-slug",
                        chart.fields._chartSlug
                    );
                    $(`[key='${chart.fields._chartSlug}']`).attr(
                        "chart-group",
                        chart.fields.ChartGroup
                    );
                    $(`[key='${chart.fields._chartSlug}']`).attr(
                        "chart-name",
                        chart.fields.ChartName
                    );
                    $(`[key='${chart.fields._chartSlug}']`).attr(
                        "chart-active",
                        chart.fields.Active
                    );
                    $(`[key='${chart.fields._chartSlug}']`).attr(
                        "chart-user-pref-is-hidden", !chart.fields.Active
                    );
                });
            }, 0);
        }

        // Handle sorting
        setTimeout(() => {
            let $chartWrappper = $(".connectedChartSortable");
            $chartWrappper
                .find(".sortable-chart-widget-js")
                .sort(function(a, b) {
                    return +a.getAttribute("position") - +b.getAttribute("position");
                })
                .appendTo($chartWrappper);
        }, 0)
    };
    templateObject.deactivateDraggable = () => {
        draggableCharts.disable();
        resizableCharts.disable(); // this will disable charts resiable features
    };
    templateObject.activateDraggable = () => {
        draggableCharts.enable();
        resizableCharts.enable(); // this will enable charts resiable features
    };
    templateObject.checkChartToDisplay(); // we run this so we load the correct charts to diplay
    templateObject.activateDraggable(); // this will enable charts resiable features

    // Define the new date picker for charts 
    let previousDate = moment(new Date()).subtract(reportsloadMonths, 'months').format("DD/MM/YYYY");
    let currentDate = moment(new Date()).format("DD/MM/YYYY");
    $("#dateFrom_charts").val(previousDate);
    $("#dateTo_charts").val(currentDate);
    $("#dateTo_charts, #dateFrom_charts").datepicker({
        showOn: "button",
        buttonText: "Show Date",
        buttonImageOnly: true,
        buttonImage: "/img/imgCal2.png",
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd/mm/yy",
        yearRange: "-90:+10",
        minDate: "-6M",
        maxDate: "+0D",
        onSelect: function(selectedDate) {
            let dateFrom = $("#dateFrom_charts").datepicker("getDate");
            $("#dateTo_charts").datepicker("option", "minDate", dateFrom);
            let dateTo = $("#dateTo_charts").datepicker("getDate");
            $("#dateFrom_charts").datepicker("option", "maxDate", dateTo);   

            const from = $("#dateFrom_charts").val().split('/');
            const to = $("#dateTo_charts").val().split('/');

            templateObject.updateChart.set({
                update: true,
                dateFrom: `${from[2]}-${from[1]}-${from[0]}`,
                dateTo: `${to[2]}-${to[1]}-${to[0]}`,
            });
        }
    }) 
});

Template.allChartLists.events({

    "click .on-editor-change-mode": (e) => {
        // this will toggle the visibility of the widget
        if ($(e.currentTarget).attr("is-hidden") == "true") {
            $(e.currentTarget).attr("is-hidden", "false");
            $(e.currentTarget).html("<i class='far fa-eye'></i>");
        } else {
            $(e.currentTarget).attr("is-hidden", "true");
            $(e.currentTarget).html("<i class='far fa-eye-slash'></i>");
        }
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
    "click .editchartsbtn": async function() {      
        let isEditable = false;
        const templateObject = Template.instance();
        const defaultDashboardOptions = require('../../popUps/dashboardoptions.json');
        const defaultOptions = [...defaultDashboardOptions];
        const employeeID = localStorage.getItem('mySessionEmployeeLoggedID');
        await contactService.getOneEmployeeDataEx(employeeID).then(function (data) {   
            const dsOption = data.fields.CustFld11 || "All";
            isEditable = defaultOptions.find(opt => opt.name == dsOption).isshowdefault;
        });
        if(isEditable){
            $(".editcharts").trigger("click");
            chartsEditor.enable();       
            templateObject.showChartElements();
        }
    },
    "click .resetchartbtn": async(event) => {
        event.preventDefault();
        $(".fullScreenSpin").css("display", "block");
        chartsEditor.disable();
        const templateObject = Template.instance();
        $("#btnDone").addClass("hideelement");
        $("#btnDone").removeClass("showelement");
        $("#btnCancel").addClass("hideelement");
        $("#btnCancel").removeClass("showelement");
        $("#editcharts").addClass("showelement");
        $("#editcharts").removeClass("hideelement");
        $(".btnchartdropdown").removeClass("hideelement");
        $(".btnchartdropdown").addClass("showelement");
        const dashboardApis = new DashboardApi(); // Load all dashboard APIS
        let _tabGroup = $("#connectedSortable").data("tabgroup");
        let employeeId = localStorage.getItem("mySessionEmployeeLoggedID");
        templateObject.hideChartElements();
        const apiEndpoint = dashboardApis.collection.findByName(
            dashboardApis.collectionNames.Tvs1dashboardpreferences
        );
        let resetCharts = {
            type: "Tvs1dashboardpreferences",
            delete: true,
            fields: {
                EmployeeID: parseInt(employeeId),
                TabGroup: _tabGroup,
            }
        }
        try {
            const ApiResponse = await apiEndpoint.fetch(null, {
                method: "POST",
                headers: ApiService.getPostHeaders(),
                body: JSON.stringify(resetCharts),
            });
            if (ApiResponse.ok == true) {
                const jsonResponse = await ApiResponse.json();
                await ChartHandler.saveChartsInLocalDB();
                await templateObject.checkChartToDisplay();
                $(".fullScreenSpin").css("display", "none");
            }
        } catch (error) {
            $(".fullScreenSpin").css("display", "none");
        }
        // templateObject.deactivateDraggable();
    },
    "click #btnCancel": async() => {
        playCancelAudio();
        const templateObject = Template.instance();
        setTimeout(async function() {
            $(".fullScreenSpin").css("display", "block");
            chartsEditor.disable();         
            await templateObject.hideChartElements();
            await templateObject.checkChartToDisplay();
            $('.sortable-chart-widget-js').removeClass("editCharts");
            $(".fullScreenSpin").css("display", "none");
            //templateObject.deactivateDraggable();
        }, delayTimeAfterSound);
    },
    "click #btnDone": async() => {
        playSaveAudio();
        let templateObject = Template.instance();
        setTimeout(async function() {
            $(".fullScreenSpin").css("display", "inline-block");
            await saveCharts();
            await chartsEditor.disable();
            await templateObject.hideChartElements();
            templateObject.checkChartToDisplay();
            $(".fullScreenSpin").css("display", "none");
            Meteor_reload.reload();
        }, delayTimeAfterSound);
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
