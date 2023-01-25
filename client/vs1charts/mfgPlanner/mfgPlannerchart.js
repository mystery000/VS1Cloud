import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../js/sidebar-service";
import { UtilityService } from "../../utility-service";

import { Template } from 'meteor/templating';
import './mfgPlannerchart.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let _ = require("lodash");

Template.mfgPlannerChart.onCreated(function () {
  let templateObject = Template.instance();
  templateObject.productionplannerdata = new ReactiveVar([]);

});

Template.mfgPlannerChart.onRendered(function () {
  const templateObject = Template.instance();

  setTimeout((()=>{
    $('#calendar').render();
  }))
}),200;


Template.mfgPlannerChart.helpers({
    
    salesCloudPreferenceRec: () => {
      return CloudPreference.findOne({
        userid: localStorage.getItem("mycloudLogonID"),
        PrefName: "tblPayHistorylist",
      });
    },
    loggedCompany: () => {
      return localStorage.getItem("mySession") || "";
    },
  });
  