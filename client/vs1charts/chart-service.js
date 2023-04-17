import { BaseService } from "../js/base-service.js";
import "gauge-chart";
import DashboardApi from "../js/Api/DashboardApi";
import Tvs1chart from "../js/Api/Model/Tvs1Chart";
import ChartHandler from "../js/Charts/ChartHandler";
import ApiService from "../js/Api/Module/ApiService";
import '../lib/global/indexdbstorage.js';

let my_tasksChart = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "My Tasks",
    ID: 902,
    _chartSlug: "dsmcharts__my_tasks",
  },
};

let salesQuotaChart1 = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Sales Quota 1",
    ID: 903,
    _chartSlug: "dsmcharts__sales_quota_1",
  },
};

let salesQuotaChart2 = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Sales Quota 2",
    ID: 904,
    _chartSlug: "dsmcharts__sales_quota_2",
  },
};

let salesQuotaChart3 = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Sales Quota 3",
    ID: 905,
    _chartSlug: "dsmcharts__sales_quota_3",
  },
};

let salesQuotaChart4 = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Sales Quota 4",
    ID: 906,
    _chartSlug: "dsmcharts__sales_quota_4",
  },
};

let salesQuotaChart5 = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Sales Quota 5",
    ID: 907,
    _chartSlug: "dsmcharts__sales_quota_5",
  },
};

let salesQuotaChart6 = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Sales Quota 6",
    ID: 908,
    _chartSlug: "dsmcharts__sales_quota_6",
  },
};

let dsmTop_10_customers = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Top 10 Customers",
    ID: 909,
    _chartSlug: "dsmcharts__top_10_customers",
  },
};

let dsmEmployee_sales_comparison = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Employee Sales Comparison",
    ID: 910,
    _chartSlug: "dsmcharts__employee_sales_comparison",
  },
};

let dsmAppointmentListChart = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Appointment List",
    ID: 911,
    _chartSlug: "dsmcharts__appointment_list",
  },
};

let dsmOpportunitiesStatusChart = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Opportunities Status",
    ID: 912,
    _chartSlug: "dsmcharts__opportunities_status",
  },
};

let dsmLeadListChart = {
  fields: {
    Active: true,
    ChartGroup: "DSMCharts",
    ChartName: "Lead List",
    ID: 913,
    _chartSlug: "dsmcharts__lead_list",
  },
};

let my_tasksChart1 = {
  fields: {
    Active: true,
    ChartGroup: "DSCharts",
    ChartName: "My Tasks",
    ID: 914,
    _chartSlug: "dscharts__my_tasks",
  },
};

let dsAppointmentListChart = {
  fields: {
    Active: true,
    ChartGroup: "DSCharts",
    ChartName: "Appointment List",
    ID: 915,
    _chartSlug: "dscharts__appointment_list",
  },
};

let performanceQuotaChart = {
  fields: {
    Active: true,
    ChartGroup: "DSCharts",
    ChartName: "Performance Quota",
    ID: 916,
    _chartSlug: "dscharts__performance_quota",
  },
};

let opportunitiesSourceChart = {
  fields: {
    Active: true,
    ChartGroup: "DSCharts",
    ChartName: "Opportunities Source",
    ID: 917,
    _chartSlug: "dscharts__opportunities_source",
  },
};

let dsLeadListChart = {
  fields: {
    Active: true,
    ChartGroup: "DSCharts",
    ChartName: "Lead List",
    ID: 1001,
    _chartSlug: "dscharts__lead_list",
  },
};

let accountListChart = {
  fields: {
    Active: true,
    ChartGroup: "Dashboard",
    ChartName: "Account List",
    ID: 1002,
    _chartSlug: "dashboard__account_list",
  },
};

let myTasksChart = {
  fields: {
    Active: true,
    ChartGroup: "Dashboard",
    ChartName: "My Tasks",
    ID: 1005,
    _chartSlug: "dashboard__mytaskschart",
  },
};

let myBankAccountschart = {
  fields: {
    Active: true,
    ChartGroup: "Dashboard",
    ChartName: "Bank Accountschart",
    ID: 1006,
    _chartSlug: "dashboard__bank_accountschart",
  },
};

let crmOverviewchart = {
  fields: {
    Active: true,
    ChartGroup: "CRM",
    ChartName: "CRM Overview",
    ID: 1010,
    _chartSlug: "crm__crm_overview",
  },
};

let exeCashChart = {
  fields: {
    Active: true,
    ChartGroup: "DashboardExe",
    ChartName: "Cash",
  },
};

let exeProfitabilityChart = {
  fields: {
    Active: true,
    ChartGroup: "DashboardExe",
    ChartName: "Profitability",
  },
};

let exePerformanceChart = {
  fields: {
    Active: true,
    ChartGroup: "DashboardExe",
    ChartName: "Performance",
  },
};

let exeBalanceSheetChart = {
  fields: {
    Active: true,
    ChartGroup: "DashboardExe",
    ChartName: "Balance Sheet",
  },
};

let exeIncomeChart = {
  fields: {
    Active: true,
    ChartGroup: "DashboardExe",
    ChartName: "Income",
  },
};

let exePositionChart = {
  fields: {
    Active: true,
    ChartGroup: "DashboardExe",
    ChartName: "Position",
  },
};

export class ChartService extends BaseService {
  async checkChartToDisplay() {
    let defaultChartList = [];
    let chartList = [];
    const dashboardApis = new DashboardApi(); // Load all dashboard APIS
    let _tabGroup = $("#connectedSortable").data("tabgroup")
    let dashboardpreferences = await getVS1Data("Tvs1dashboardpreferences");
    if (dashboardpreferences.length == 0) {
    } else {
      dashboardpreferences = JSON.parse(dashboardpreferences[0].data);
    }

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
        chartList.push(my_tasksChart);
        chartList.push(salesQuotaChart1);
        chartList.push(salesQuotaChart2);
        chartList.push(salesQuotaChart3);
        chartList.push(salesQuotaChart4);
        chartList.push(salesQuotaChart5);
        chartList.push(salesQuotaChart6);
        chartList.push(dsmTop_10_customers);
        chartList.push(dsmEmployee_sales_comparison);
        chartList.push(dsmAppointmentListChart);
        chartList.push(dsmOpportunitiesStatusChart);
        chartList.push(dsmLeadListChart);
        chartList.push(my_tasksChart1);
        chartList.push(dsAppointmentListChart);
        chartList.push(performanceQuotaChart);
        chartList.push(opportunitiesSourceChart);
        chartList.push(dsLeadListChart);
        chartList.push(accountListChart);
        chartList.push(myTasksChart);
        chartList.push(myBankAccountschart);
        chartList.push(crmOverviewchart);
        chartList.push(exeCashChart)
        chartList.push(exeProfitabilityChart)
        chartList.push(exePerformanceChart)
        chartList.push(exeBalanceSheetChart)
        chartList.push(exeIncomeChart)
        chartList.push(exePositionChart)
      }
    }

    if (chartList.length > 0) {      
      // Hide all charts
      $(".sortable-chart-widget-js").addClass("hideelement");
      // the goal here is to get the right names so it can be used for preferences
      setTimeout(() => {
        chartList.forEach((chart) => {
          chart.fields._chartSlug =
            chart.fields.ChartGroup.toLowerCase() +
            "__" +
            chart.fields.ChartName.toLowerCase().split(" ").join("_");
          $(`[key='${chart.fields._chartSlug}']`).addClass("chart-visibility");
          $(`[key='${chart.fields._chartSlug}']`).attr("pref-id", 0);
          $(`[key='${chart.fields._chartSlug}']`).attr(
            "chart-id",
            chart.fields.ID
          );
          // Default charts
          let defaultClass = $(`[key='${chart.fields._chartSlug}']`).attr(
            "data-default-class"
          );
          let defaultPosition = $(`[key='${chart.fields._chartSlug}']`).attr(
            "data-default-position"
          );
          let storeObj = null;
          if (localStorage.getItem(chart.fields._chartSlug))
            storeObj = JSON.parse(
              localStorage.getItem(chart.fields._chartSlug)
            );
          $(`[key='${chart.fields._chartSlug}']`).addClass(defaultClass);
          $(`[key='${chart.fields._chartSlug}']`).attr(
            "position",
            storeObj ? storeObj.position : defaultPosition
          );
          $(`[key='${chart.fields._chartSlug}']`).attr("width", "100%");
          $(`[key='${chart.fields._chartSlug}']`).css(
            "height",
            storeObj && storeObj.height && storeObj.height != 0
              ? storeObj.height + "px"
              : "auto"
          );
          $(`[key='${chart.fields._chartSlug}'] .ui-resizable`).css(
            "width",
            storeObj && storeObj.width && storeObj.width != 0
              ? storeObj.width + "px"
              : "100%"
          );
          $(`[key='${chart.fields._chartSlug}'] .ui-resizable`).css(
            "height",
            storeObj && storeObj.height && storeObj.height != 0
              ? storeObj.height + "px"
              : "auto"
          );
          let _chartGroup = $("#connectedSortable").data("chartgroup")          
          if (
            chart.fields.ChartGroup == _chartGroup &&
            chart.fields.Active == true
          ) {
            defaultChartList.push(chart.fields._chartSlug);
            $(`[key='${chart.fields._chartSlug}'] .chartShowOption`).prop(
              "checked",
              true
            );
            $(`[key='${chart.fields._chartSlug}']`).removeClass("hideelement");
            if (chart.fields._chartSlug == "accounts__profit_and_loss") {
              $(`[key='dashboard__profit_and_loss']`).removeClass(
                "hideelement"
              );
            }
            if (chart.fields._chartSlug == "sales__sales_overview") {
              $(`[key='contacts__top_10_customers']`).removeClass(
                "hideelement"
              );
              $(`[key='dashboard__employee_sales_comparison']`).removeClass(
                "hideelement"
              );
            }
            if (
              chart.fields._chartSlug == "inventory__stock_on_hand_and_demand"
            ) {
              $(`[key='contacts__top_10_supplies']`).removeClass("hideelement");
            }
            //Auto hide on Dashboard
            if (
              _chartGroup == "Dashboard" &&
              (chart.fields._chartSlug == "dashboard__monthly_earnings" ||
                chart.fields._chartSlug ==
                  "dashboard__quoted_amounts_/_invoiced_amounts")
            ) {
              $(`[key='${chart.fields._chartSlug}']`).addClass("hideelement");
            }
          } else {
            $(`[key='${chart.fields._chartSlug}'] .chartShowOption`).prop(
              "checked",
              false
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
            "chart-user-pref-is-hidden",
            !chart.fields.Active
          );
        });
      }, 0);
    }

    // Handle sorting
    setTimeout(() => {
      let $chartWrappper = $(".connectedChartSortable");
      $chartWrappper
        .find(".sortable-chart-widget-js")
        .sort(function (a, b) {
          return +a.getAttribute("position") - +b.getAttribute("position");
        })
        .appendTo($chartWrappper);
    }, 0);
  }

  async onEdit() {
    $(".btnchartdropdown").addClass("hideelement");
    $(".btnchartdropdown").removeClass("showelement");
    $(".sortable-chart-widget-js").removeClass("hideelement"); // display every charts
    $(".on-editor-change-mode").removeClass("hideelement");
    $(".on-editor-change-mode").addClass("showelement");    
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
    $(".charts .card").addClass("dimmedChart");   
  }

  async exitEdit() {
    $(".btnchartdropdown").removeClass("hideelement");
    $(".btnchartdropdown").addClass("showelement");
    $(".on-editor-change-mode").removeClass("showelement");
    $(".on-editor-change-mode").addClass("hideelement");
    $(".dimmedChart").removeClass("dimmedChart");
  }

  async saveCharts() {
    if ($(".chart-visibility").length === 0) return
    $(".fullScreenSpin").css("display", "inline-block");
    // await saveCharts();
    await this.exitEdit();
    // if( $(ui.item[0]).hasClass("editCharts") == false ){
    await ChartHandler.buildPositions();
    await ChartHandler.saveCharts();
    await ChartHandler.saveChartsInLocalDB();
    this.checkChartToDisplay();
    // }
    $(".fullScreenSpin").css("display", "none");
  }

  async cancelCharts() {
    if ($(".chart-visibility").length === 0) return
    $(".fullScreenSpin").css("display", "block");
    await this.exitEdit();    
    await this.checkChartToDisplay();
    $(".sortable-chart-widget-js").removeClass("editCharts");
    $(".fullScreenSpin").css("display", "none");
  }

  async resetCharts() {
    if ($(".chart-visibility").length === 0) return
    $(".fullScreenSpin").css("display", "block");
    await this.exitEdit();
    const dashboardApis = new DashboardApi(); // Load all dashboard APIS
    let _tabGroup = $("#connectedSortable").data("tabgroup");
    let employeeId = localStorage.getItem("mySessionEmployeeLoggedID");    
    const apiEndpoint = dashboardApis.collection.findByName(
      dashboardApis.collectionNames.Tvs1dashboardpreferences
    );
    let resetCharts = {
      type: "Tvs1dashboardpreferences",
      delete: true,
      fields: {
        EmployeeID: parseInt(employeeId),
        TabGroup: _tabGroup,
      },
    };
    try {
      const ApiResponse = await apiEndpoint.fetch(null, {
        method: "POST",
        headers: ApiService.getPostHeaders(),
        body: JSON.stringify(resetCharts),
      });
      if (ApiResponse.ok == true) {
        const jsonResponse = await ApiResponse.json();
        await ChartHandler.saveChartsInLocalDB();
        await this.checkChartToDisplay();
        $(".fullScreenSpin").css("display", "none");
      }
    } catch (error) {
      $(".fullScreenSpin").css("display", "none");
    }
  }
}
