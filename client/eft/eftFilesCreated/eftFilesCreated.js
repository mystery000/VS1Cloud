import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random';
import { Template } from 'meteor/templating';
import './eftFilesCreated.html';
import {EftService} from "../eft-service";

let eftService = new EftService();

Template.eftFilesCreated.onCreated(function () {
  let templateObject = Template.instance();
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.getDataTableList = function(data) {
      let dataList = data;
      return dataList;
    }
  
    let headerStructure = [
      {index: 0, label: "#ID", class: "colID", width: "30", active: false, display: true},
      {index: 1, label: "Account", class: "colAccount", width: "300", active: true, display: true},
      {index: 2, label: "Bank Name", class: "colBankName", width: "300", active: true, display: true},
      {index: 3, label: "Processing Date", class: "colProcessingDate", width: "300", active: true, display: true},
      {index: 4, label: "Name of User", class: "colNameOfUser", width: "300", active: true, display: true},
      {index: 5, label: "Transaction Description", class: "colTransactionDescription", width: "300", active: true, display: true},
      {index: 6, label: "#Status", class: "colStatus", width: "300", active: false, display: true},
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.eftFilesCreated.onRendered(function () {

});

Template.eftFilesCreated.events({
  'click .btnEftBankRuleList': function(event) {
    FlowRouter.go('/eftbankrulelist');
  },
  'click .btnEftCreateNewFile': function(event) {
      FlowRouter.go('/eft');
  },
  'click .btnEftNewBankRule': function(event) {
      FlowRouter.go('/eftnewbankrule');
  },
});

Template.eftFilesCreated.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {    
    return eftService.getEftFilesCreated;
  },

  searchAPI: function() {    
    return eftService.getEftFilesCreated;
  },

  service: ()=>{    
    return eftService;
  },

  datahandler: function () {
    let templateObject = Template.instance();
    return function(data) {
      let dataReturn =  templateObject.getDataTableList(data)
      return dataReturn
    }
  },

  exDataHandler: function() {
    let templateObject = Template.instance();
    return function(data) {
      let dataReturn =  templateObject.getDataTableList(data)
      return dataReturn
    }
  },

  apiParams: function() {
    return [];
  },
});
