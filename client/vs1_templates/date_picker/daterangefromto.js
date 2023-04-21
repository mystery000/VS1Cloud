import Datehandler from "../../DateHandler";
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './daterangefromto_report.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
Template.daterangefromto.inheritsHooksFrom('daterangedropdownoption');
Template.daterangefromto.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.singleDateReport = new ReactiveVar();
});

Template.daterangefromto.onRendered(function() {
  const templateObject = Template.instance();
  templateObject.initDate = () => {
    // Datehandler.initOneMonth();
      Datehandler.initHalfYear();
  };

  var url = FlowRouter.current().path;
  templateObject.loadDateRange = () => {
    templateObject.singleDateReport.set(false);    
    if( url.includes("/balancesheetreport") || url.includes("/exeprofitabilityreport") ||  url.includes("/executivesummaryreport") || url.includes("/exebalancesheetreport") || url.includes("/execashreport") || url.includes("/exeincomereport") ||  url.includes("/exeperformancereport") || url.includes("/exepositionreport")) {
      templateObject.singleDateReport.set(true);
    } 
  }
  templateObject.initDate();
  templateObject.loadDateRange();

});

Template.daterangefromto.events({

});

Template.daterangefromto.helpers({
  singleDateReport: () => {
    return Template.instance().singleDateReport.get();
  },
});
