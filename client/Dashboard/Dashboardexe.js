import { ReactiveVar } from "meteor/reactive-var";
import resizableCharts from "../js/Charts/resizableCharts";
import draggableCharts from "../js/Charts/draggableCharts";
import ChartsEditor from "../js/Charts/ChartsEditor";
import "gauge-chart";

let chartList2 = [
  {
    fields: {
      chartKey: "dashboardexe_cash",
      isActive: 1,
    }
  },
  {
    fields: {
      chartKey: "dashboardexe_profitability",
      isActive: 1,
    }
  },
  {
    fields: {
      chartKey: "dashboardexe_performance",
      isActive: 1,
    }
  },
  {
    fields: {
      chartKey: "dashboardexe_balancesheet",
      isActive: 1,
    }
  },
  {
    fields: {
      chartKey: "dashboardexe_income",
      isActive: 1,
    }
  },
  {
    fields: {
      chartKey: "dashboardexe_position",
      isActive: 1,
    }
  },
];
let arrChartKey = ["dashboardexe_cash", "dashboardexe_profitability", "dashboardexe_performance", "dashboardexe_balancesheet", "dashboardexe_income", "dashboardexe_position"];
let arrChartActive = [1, 1, 1, 1, 1, 1];
let curChartActive = [];
localStorage.setItem("arrChartActive", JSON.stringify(arrChartActive));
const chartsEditor = new ChartsEditor(
  () => {
    $("#resetcharts2").removeClass("hideelement").addClass("showelement"); // This will show the reset charts button
    $("#btnDone2").addClass("showelement");
    $("#btnDone2").removeClass("hideelement");
    $("#btnCancel2").addClass("showelement");
    $("#btnCancel2").removeClass("hideelement");
    $("#btnReset2").addClass("showelement");
    $("#btnReset2").removeClass("hideelement");
    $(".btnchartdropdown").addClass("hideelement");
    $(".btnchartdropdown").removeClass("showelement");

    $(".sortable-chart-widget-js").removeClass("hideelement"); // display every charts
    $(".on-editor-change-mode").removeClass("hideelement");
    $(".on-editor-change-mode").addClass("showelement");
  },
  () => {
    $("#resetcharts2").addClass("hideelement").removeClass("showelement"); // this will hide it back
    $("#btnDone2").addClass("hideelement");
    $("#btnDone2").removeClass("showelement");
    $("#btnCancel2").addClass("hideelement");
    $("#btnCancel2").removeClass("showelement");
    $("#btnReset2").addClass("hideelement");
    $("#btnReset2").removeClass("showelement");
    $(".btnchartdropdown").removeClass("hideelement");
    $(".btnchartdropdown").addClass("showelement");

    $(".on-editor-change-mode").removeClass("showelement");
    $(".on-editor-change-mode").addClass("hideelement");
  }
);

Template.dashboardexe.onCreated(function () {
  this.loggedDb = new ReactiveVar("");
  const templateObject = Template.instance();
  templateObject.includeDashboard = new ReactiveVar();
  templateObject.includeDashboard.set(false);

  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();
  templateObject.titleDE = new ReactiveVar();
});

Template.dashboardexe.onRendered(function () {
  const templateObject = Template.instance();
  templateObject.checkChartToDisplay = () => {
    for (var i=0; i<curChartActive.length; i++) {
      if (curChartActive[i] == 1) {
        $(`[key='${arrChartKey[i]}']`).show();
      } else {
        $(`[key='${arrChartKey[i]}']`).hide();
      }
    }
    // if ($(`[key='dashboardexe_cash'] .on-editor-change-mode`).attr("is-hidden") == "true") { 
    // }
  };
  templateObject.hideChartElements = () => {
    // on edit mode false
    // $(".on-editor-change-mode").removeClass("showelement");
    // $(".on-editor-change-mode").addClass("hideelement");

    var dimmedElements = document.getElementsByClassName("dimmedChart");
    while (dimmedElements.length > 0) {
      dimmedElements[0].classList.remove("dimmedChart");
    }
  };
  templateObject.showChartElements = function () {
    // on edit mode true
    // $(".on-editor-change-mode").addClass("showelement");
    // $(".on-editor-change-mode").removeClass("hideelement");
    $('.sortable-chart-widget-js').removeClass("col-md-8 col-md-6 col-md-4");
    $('.sortable-chart-widget-js').addClass("editCharts");
    $('.sortable-chart-widget-js').each(function(){
      let className = $(this).data('default-class');
      $(this).addClass(className);
      $(this).show();
    });
    $(".card").addClass("dimmedChart");
  };
  templateObject.deactivateDraggable = () => {
    draggableCharts.disable();
    resizableCharts.disable(); // this will disable charts resiable features
  };
  templateObject.activateDraggable = () => {
    draggableCharts.enable();
    resizableCharts.enable(); // this will enable charts resiable features
  };
  templateObject.activateDraggable(); // this will enable charts resiable features
  let isDashboard = Session.get("CloudDashboardModule");
  if (isDashboard) {
    templateObject.includeDashboard.set(true);
  }
  var currentDate = new Date();
  const monSml2 = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var currMonth = monSml2[currentDate.getMonth()] + " " + currentDate.getFullYear();
  templateObject.titleDE.set(currMonth);
  
});

Template.dashboardexe.helpers({
  includeDashboard: () => {
    return Template.instance().includeDashboard.get();
  },
  loggedDb: function () {
    return Template.instance().loggedDb.get();
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
  titleDE: () => {
    return Template.instance().titleDE.get();
  }
});

// Listen to event to update reactive variable
Template.dashboardexe.events({
  "click .on-editor-change-mode": (e) => {
    // this will toggle the visibility of the widget
    var curChartKey = $(e.currentTarget).parents('.sortable-chart-widget-js').attr('key');
    var keyIdx = arrChartKey.indexOf(curChartKey);
    if ($(e.currentTarget).attr("is-hidden") == "true") {
      $(e.currentTarget).attr("is-hidden", "false");
      $(e.currentTarget).html("<i class='far fa-eye'></i>");
      curChartActive[keyIdx] = 1;
    } else {
      $(e.currentTarget).attr("is-hidden", "true");
      $(e.currentTarget).html("<i class='far fa-eye-slash'></i>");
      curChartActive[keyIdx] = 0;
    }
  },
  "click .editchartsbtn2": () => {
    $(".editcharts").trigger("click");
    chartsEditor.enable();
    const templateObject = Template.instance();
    curChartActive = JSON.parse(localStorage.getItem("arrChartActive"));
    templateObject.showChartElements();
  },
  "click #btnReset2": ( event ) => {
    event.preventDefault();
    $(".fullScreenSpin").css("display", "block");
    chartsEditor.disable();
    const templateObject = Template.instance();

    $("#btnDone2").addClass("hideelement");
    $("#btnDone2").removeClass("showelement");
    $("#btnCancel2").addClass("hideelement");
    $("#btnCancel2").removeClass("showelement");
    $("#btnReset2").addClass("hideelement");
    $("#btnReset2").removeClass("showelement");
    $(".btnchartdropdown").removeClass("hideelement");
    $(".btnchartdropdown").addClass("showelement");

    localStorage.setItem("arrChartActive", JSON.stringify(arrChartActive));
    templateObject.checkChartToDisplay();
  },
  "click #btnCancel2": () => {
    $(".fullScreenSpin").css("display", "block");
    chartsEditor.disable();
    const templateObject = Template.instance();
    templateObject.hideChartElements();
    $('.sortable-chart-widget-js').removeClass("editCharts");
    $(".fullScreenSpin").css("display", "none");
    //templateObject.deactivateDraggable();
  },

  "click #btnDone2": () => {
    const templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "block");
    chartsEditor.disable();
    templateObject.hideChartElements();
    $(".fullScreenSpin").css("display", "none");
    localStorage.setItem("arrChartActive", JSON.stringify(curChartActive));
    templateObject.checkChartToDisplay();
  },
});
