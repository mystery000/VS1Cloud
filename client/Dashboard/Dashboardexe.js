import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { DashBoardService } from "./dashboard-service";
import { UtilityService } from "../utility-service";
import { VS1ChartService } from "../vs1charts/vs1charts-service";

import "gauge-chart";

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
  let templateObject = Template.instance();
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
    const res = Template.instance().includeDashboard.get();
    return res;
  },
  loggedDb: function () {
    return Template.instance().loggedDb.get();
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
  titleDE: () => {
    const res = Template.instance().titleDE.get();
    return res;
  }
});

// Listen to event to update reactive variable
Template.dashboardexe.events({
  
});
