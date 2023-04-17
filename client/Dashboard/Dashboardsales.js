import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import './dashboardsales.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.dashboardsales.onCreated(function() {
    this.loggedDb = new ReactiveVar("");
    const templateObject = Template.instance();
    templateObject.includeDashboard = new ReactiveVar();
    templateObject.includeDashboard.set(false);
});

Template.dashboardsales.onRendered(function() {
    let templateObject = Template.instance();
    let isDashboard = localStorage.getItem("CloudDashboardModule");
    if (isDashboard) {
        templateObject.includeDashboard.set(true);
    }    
});

Template.dashboardsales.events({
    
});

Template.dashboardsales.helpers({
    includeDashboard: () => {
        return Template.instance().includeDashboard.get();
    },
    loggedDb: function() {
        return Template.instance().loggedDb.get();
    },
    loggedCompany: () => {
        return localStorage.getItem("mySession") || "";
    },
});