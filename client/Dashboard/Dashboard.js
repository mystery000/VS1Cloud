import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { DashBoardService } from "./dashboard-service";
import { UtilityService } from "../utility-service";
import { VS1ChartService } from "../vs1charts/vs1charts-service";

import "gauge-chart";

import DashboardApi from "../js/Api/DashboardApi";
import Tvs1chart from "../js/Api/Model/Tvs1Chart";
import resizableCharts from "../js/Charts/resizableCharts";
import ChartsEditor from "../js/Charts/ChartsEditor";
import draggableCharts from "../js/Charts/draggableCharts";
import Tvs1ChartDashboardPreference from "../js/Api/Model/Tvs1ChartDashboardPreference";
import Tvs1ChartDashboardPreferenceField from "../js/Api/Model/Tvs1ChartDashboardPreferenceField";
import ApiService from "../js/Api/Module/ApiService";

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

/**
 * Current User ID
 */
const employeeId = Session.get("mySessionEmployeeLoggedID");

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

    $("#resalecomparision").removeClass("hideelement");
    $("#quotedinvoicedamount").removeClass("hideelement");
    $("#expensechart").removeClass("hideelement");
    $("#monthlyprofitlossstatus").removeClass("hideelement");
    $("#resalecomparision").removeClass("hideelement");
    $("#showearningchat").removeClass("hideelement");

    $(".sortable-chart-widget-js").removeClass("hideelement"); // display every charts
    $(".on-editor-change-mode").removeClass("hidelement");
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

    $(".on-editor-change-mode").addClass("hidelement");
  }
);

/**
 * Build the positions of the widgets
 */
const buildPositions = async () => {
  const charts = $(".chart-visibility");

  for (let i = 0; i <= charts.length; i++) {
    $(charts[i]).attr("position", i);
  }
};

/**
 * This function will save the charts on the dashboard
 */
const saveCharts = async () => {
  /**
   * Lets load all API colections
   */
  const dashboardApis = new DashboardApi(); // Load all dashboard APIS
  buildPositions();

  const charts = $(".chart-visibility");
  console.log(charts);

  /**
   * @property {Tvs1ChartDashboardPreference[]}
   */
  let chartList = [];

  // now we have to make the post request to save the data in database

  chartList.forEach(async (chart) => {
    const chartData = new Tvs1ChartDashboardPreference({
      type: "Tvs1dashboardpreferences",
      fields: new Tvs1ChartDashboardPreferenceField({
        Active: $(chart).find(".on-editor-change-mode").attr("is-hidden"),
        ChartID: $(chart).attr("chart-id"),
        ID: $(chart).attr("pref-id"), // This is empty when it is the first time, but the next times it is filled
        EmployeeID: employeeId,
        Chartname: $(chart).attr("chart-name"),
        Position: $(chart).attr("position"),
        ChartGroup: "Dashboard",
      }),
    });
    console.log(chartData);

    const ApiResponse = await dashboardApis.collection
      .findByName(dashboardApis.collectionNames.Tvs1dashboardpreferences)
      .fetch(null, {
        method: "POST",
        headers: ApiService.getPostHeaders(),
        body: JSON.stringify(chartData),
      });

    if (ApiResponse.ok == true) {
      const jsonResponse = await ApiResponse.json();
      console.log(
        "Chart: " +
          chart.Chartname +
          " will be hidden ? " +
          !chart.fields.Active
      );
    }
  });
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
  let isDashboard = Session.get("CloudDashboardModule");
  if (isDashboard) {
    templateObject.includeDashboard.set(true);
  }

  // setTimeout(function () {
  //   $(".connectedSortable").sortable({
  //     connectWith: ".connectedSortable",
  //     placeholder: "portlet-placeholder ui-corner-all",
  //     stop: function (event, ui) {},
  //   });
  //   $(".portlet")
  //     .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
  //     .find(".portlet-header")
  //     .addClass("ui-widget-header ui-corner-all");

  //   $(".portlet-toggle").on("click", function () {
  //     var icon = $(this);
  //     icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
  //     icon.closest(".portlet").find(".portlet-content").toggle();
  //   });

  //   $(".portlet").resizable({
  //     handles: "e",
  //   });
  // }, 200);

  // templateObject.deactivateDraggable = function () {
  //   $("#col1,#col2")
  //     .sortable({
  //       disabled: true,
  //       connectWith: ".col-area",
  //       placeholder: "highlight",
  //       cursor: "grabbing",
  //       handle: ".card",
  //     })
  //     .disableSelection();
  // };
  // templateObject.activateDraggable = function () {
  //   $("#col1,#col2")
  //     .sortable({
  //       disabled: false,
  //       connectWith: ".col-area",
  //       placeholder: "highlight",
  //       cursor: "grabbing",
  //       handle: ".card",
  //     })
  //     .disableSelection();
  // };

  templateObject.hideChartElements = function () {
    $("#profitlosshide").addClass("hideelement");
    $("#profitlosshide").removeClass("showelement");

    $("#profitloss1hide").addClass("hideelement");
    $("#profitloss1hide").removeClass("showelement");

    $("#expenseshide").addClass("hideelement");
    $("#expenseshide").removeClass("showelement");

    $("#hidesales1").addClass("hideelement");
    $("#hidesales1").removeClass("showelement");

    $("#resalehide").addClass("hideelement");
    $("#resalehide").removeClass("showelement");

    $("#hideearnings").addClass("hideelement");
    $("#hideearnings").removeClass("showelement");

    var dimmedElements = document.getElementsByClassName("dimmedChart");
    while (dimmedElements.length > 0) {
      dimmedElements[0].classList.remove("dimmedChart");
    }
  };

  templateObject.showChartElements = function () {
    $("#profitlosshide").removeClass("hideelement");
    $("#profitlosshide").addClass("showelement");

    $("#profitloss1hide").removeClass("hideelement");
    $("#profitloss1hide").addClass("showelement");

    $("#expenseshide").removeClass("hideelement");
    $("#expenseshide").addClass("showelement");

    $("#hidesales1").removeClass("hideelement");
    $("#hidesales1").addClass("showelement");

    $("#resalehide").removeClass("hideelement");
    $("#resalehide").addClass("showelement");

    $("#hideearnings").removeClass("hideelement");
    $("#hideearnings").addClass("showelement");

    $(".card").addClass("dimmedChart");

    $(".py-2").removeClass("dimmedChart");
    // $('#profitlosschat').addClass('dimmedChart');
    // $('#showexpenseschat').addClass('dimmedChart');
    // $('#showsales1chat').addClass('dimmedChart');
    // $('#showresaleschat').addClass('dimmedChart');
    // $('#showearningschat').addClass('dimmedChart');
  };

  templateObject.checkChartToDisplay = async () => {
    const dashboardApis = new DashboardApi(); // Load all dashboard APIS
    let displayedCharts = 0;

    const allChartsEndpoint = dashboardApis.collection.findByName(
      dashboardApis.collectionNames.vs1charts
    );
    allChartsEndpoint.url.searchParams.append("ListType", "'Detail'");
    const allChartResponse = await allChartsEndpoint.fetch();

    if (allChartResponse.ok == true) {
      const allChartsJsonResponse = await allChartResponse.json();

      let chartList = Tvs1chart.fromList(
        allChartsJsonResponse.tvs1charts
      ).filter((chart) => {
        if (chart.fields.ChartGroup == "Dashboard") {
          return chart;
        }
      });
      //console.log(allChartResponse);
      //console.log(chartList);
      // the goal here is to get the right names so it can be used for preferences
      chartList.forEach((chart) => {
        //chart.fields.active = false; // Will set evething to false
        chart.fields._chartSlug =
          "tvs1dashboardpreferences__" +
          chart.fields.ChartName.toLowerCase().split(" ").join("_");

        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-id",
          chart.fields.ChartID
        );

        $(`[key='${chart.fields._chartSlug}']`).attr(
          "pref-id",
          chart.fields.ID
        );
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
    }

    // Now get user preferences
    const dashboardPreferencesEndpoint = dashboardApis.collection.findByName(
      dashboardApis.collectionNames.Tvs1dashboardpreferences
    );

    dashboardPreferencesEndpoint.url.searchParams.append(
      "ListType",
      "'Detail'"
    );
    dashboardPreferencesEndpoint.url.searchParams.append(
      "select",
      `[employeeID]=${employeeId}`
    );

    // this is the default list (hardcoded)
    let itemList = [
      "tvs1dashboardpreferences__monthyl_profit_and_loss",
      "tvs1dashboardpreferences__profit_and_loss",
      "tvs1dashboardpreferences__expenses",
      "tvs1dashboardpreferences__quoted_amounts_/_invoiced_amounts",
      "tvs1dashboardpreferences__monthly_earnings",
      "tvs1dashboardpreferences__employee_sales_comparison",
    ];

    const dashboardPreferencesEndpointResponse =
      await dashboardPreferencesEndpoint.fetch(); // here i should get from database all charts to be displayed

    if (dashboardPreferencesEndpointResponse.ok == true) {
      const dashboardPreferencesEndpointJsonResponse =
        await dashboardPreferencesEndpointResponse.json();

      console.log(dashboardPreferencesEndpointJsonResponse);

      let tvs1ChartDashboardPreference = Tvs1ChartDashboardPreference.fromList(
        dashboardPreferencesEndpointJsonResponse.tvs1dashboardpreferences
      ).filter((chart) => {
        if (chart.fields.ChartGroup == "Dashboard") {
          return chart;
        }
      });

      if (tvs1ChartDashboardPreference.length > 0) {
        // if charts to be displayed are specified
        tvs1ChartDashboardPreference.forEach((tvs1chart, index) => {
          //setTimeout(() => { // this is good to see how the charts are apearing or not
          // if (tvs1chart.fields.ChartGroup == "Dashboard") {
          const itemName =
            tvs1chart.type.toLowerCase() +
            "__" +
            tvs1chart.fields.Chartname.toLowerCase().split(" ").join("_"); // this is the new item name

          //localStorage.setItem(itemName, tvs1chart);
          console.log(itemName + " " + tvs1chart.fields.Active);

          if (itemList.includes(itemName) == true) {
            // If the item name exist
            $(`[key='${itemName}']`).attr("chart-id", tvs1chart.fields.Id);
            $(`[key='${itemName}']`).attr(
              "chart-group",
              tvs1chart.fields.chartGroup
            );
            $(`[key='${itemName}']`).addClass("chart-visibility");
            //$(`[key='${itemName}']`).attr('chart-id', tvs1chart.fields.Id);
            $(`[key='${itemName}'] .on-editor-change-mode`).attr(
              "chart-slug",
              itemName
            );

            if (tvs1chart.fields.Active == true) {
              $(`[key='${itemName}'] .on-editor-change-mode`).text("Hide");
              $(`[key='${itemName}'] .on-editor-change-mode`).attr(
                "is-hidden",
                "false"
              );

              $(`[key='${itemName}']`).removeClass("hideelement");
              //$(`[key='${itemName}']`).attr("is-hidden", false);
            } else {
              $(`[key='${itemName}']`).addClass("hideelement");
              $(`[key='${itemName}'] .on-editor-change-mode`).text("Show");
              // $(`[key='${itemName}']`).attr("is-hidden", true);
              $(`[key='${itemName}'] .on-editor-change-mode`).attr(
                "is-hidden",
                "true"
              );
            }
          }
          //}
          //}, index * 1000);
        });
      }

      displayedCharts = document.querySelectorAll(
        ".chart-visibility:not(.hideelement)"
      );
      console.log(displayedCharts);

      // if (displayedCharts.length == 0) {
      //   // this will show all by default
      //   console.log("No charts are being displayed, so show everything");
      //   itemList.forEach((item) => {
      //     $(`[key='${item}'] .on-editor-change-mode`).text("Hide");
      //     $(`[key='${item}'] .on-editor-change-mode`).attr("is-hidden", false);
      //     $(`[key='${item}'] .on-editor-change-mode`).attr("chart-slug", item);
      //     $(`[key='${item}']`).removeClass("hideelement");
      //     $(`[key='${item}']`).addClass("chart-visibility");
      //     // $(`[key='${item}']`).attr("is-hidden", false);
      //   });
      // }
    }
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
  // draggableCharts.enable();
  // resizableCharts.enable(); // this will enable charts resiable features
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
});

// Listen to event to update reactive variable
Template.dashboard.events({
  "click .on-editor-change-mode": (e) => {
    // this will toggle the visibility of the widget
    if ($(e.currentTarget).attr("is-hidden") == "true") {
      // console.log('was true');
      // $(e.currentTarget).parent(".chart-visibility").attr("is-hidden", 'false');
      // $(e.currentTarget).parent(".chart-visibility").addClass('hideelement');
      $(e.currentTarget).attr("is-hidden", "false");

      $(e.currentTarget).text("Hide");
    } else {
      // console.log('was false');
      // $(e.currentTarget).parent(".chart-visibility").attr("is-hidden", 'true');
      // $(e.currentTarget).parent(".chart-visibility").removeClass('hideelement');
      $(e.currentTarget).attr("is-hidden", "true");
      $(e.currentTarget).text("Show");
    }
  },
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },
  "click .btnBatchUpdate": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    batchUpdateCall();
  },
  "click .editchartsbtn": () => {
    $(".editcharts").trigger("click");
    chartsEditor.enable();

    const templateObject = Template.instance();
    templateObject.showChartElements();
  },
  // "click .editcharts": () => {
  //   chartsEditor.enable();

  //   const templateObject = Template.instance();
  //   templateObject.showChartElements();

  //   //templateObject.activateDraggable();
  // },

  "click #resetcharts": () => {
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

    // set everything to true
    localStorage.setItem("profitchat", true);
    localStorage.setItem("profitloss", true);
    localStorage.setItem("resaleschat", true);
    localStorage.setItem("quotedinvoicedchart", true);
    localStorage.setItem("earningschat", true);
    localStorage.setItem("expenseschart", true);

    templateObject.hideChartElements();
    templateObject.checkChartToDisplay();
    // templateObject.deactivateDraggable();
  },
  "click #btnCancel": function () {
    chartsEditor.disable();

    const templateObject = Template.instance();
    templateObject.hideChartElements();
    templateObject.checkChartToDisplay();

    //templateObject.deactivateDraggable();
  },

  "click #btnDone": function () {
    chartsEditor.disable();

    saveCharts();

    const templateObject = Template.instance();
    templateObject.hideChartElements();
    $("#btnDone").addClass("hideelement");
    $("#btnDone").removeClass("showelement");
    $("#btnCancel").addClass("hideelement");
    $("#btnCancel").removeClass("showelement");
    $("#editcharts").addClass("showelement");
    $("#editcharts").removeClass("hideelement");
    $(".btnchartdropdown").removeClass("hideelement");
    $(".btnchartdropdown").addClass("showelement");

    // //monthlyprofitloss
    // if (monthlyprofitlosschart == "true" || monthlyprofitlosschart == true) {
    //   localStorage.setItem("profitchat", true);
    //   $("#profitlosshide").text("Show");
    // } else {
    //   localStorage.setItem("profitchat", false);
    //   $("#profitlosshide").text("Hide");
    // }

    // if (profitlosschart == "true" || profitlosschart == true) {
    //   localStorage.setItem("profitloss", true);
    //   $("#profitloss1hide").text("Show");
    // } else {
    //   localStorage.setItem("profitloss", false);
    //   $("#profitloss1hide").text("Hide");
    // }

    // if (resalechart == "true" || resalechart == true) {
    //   localStorage.setItem("resaleschat", true);
    //   $("#resalehide").text("Show");
    // } else {
    //   $("#resalehide").text("Hide");
    //   localStorage.setItem("resaleschat", false);
    // }

    // if (quotedinvoicedchart == "true" || quotedinvoicedchart == true) {
    //   $("#hidesales1").text("Show");
    //   localStorage.setItem("quotedinvoicedchart", true);
    // } else {
    //   $("#hidesales1").text("Hide");
    //   localStorage.setItem("quotedinvoicedchart", false);
    // }

    // if (earningschart == "true" || earningschart == true) {
    //   localStorage.setItem("earningschat", true);
    //   $("#hideearnings").text("Show");
    // } else {
    //   $("#hideearnings").text("Hide");
    //   localStorage.setItem("earningschat", false);
    // }

    // if (expenseschart == "true" || expenseschart == true) {
    //   $("#expenseshide").text("Show");
    //   localStorage.setItem("expenseschart", true);
    // } else {
    //   $("#expenseshide").text("Hide");
    //   localStorage.setItem("expenseschart", false);
    // }

    // templateObject.deactivateDraggable();
    templateObject.checkChartToDisplay();
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
