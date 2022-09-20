import {ReactiveVar} from "meteor/reactive-var";

Template.dashboardsales.onCreated(function () {
    this.loggedDb = new ReactiveVar("");
    const templateObject = Template.instance();
    templateObject.includeDashboard = new ReactiveVar();
    templateObject.includeDashboard.set(false);
});

Template.dashboardsales.onRendered(function () {
    let templateObject = Template.instance();
    let isDashboard = Session.get("CloudDashboardModule");
    if (isDashboard) {
        templateObject.includeDashboard.set(true);
    }
});

Template.dashboardsales.helpers({
    includeDashboard: () => {
        return Template.instance().includeDashboard.get();
    },
    loggedDb: function () {
        return Template.instance().loggedDb.get();
    },
    loggedCompany: () => {
        return localStorage.getItem("mySession") || "";
    },
});

// Listen to event to update reactive variable
Template.dashboardsales.events({
  
});