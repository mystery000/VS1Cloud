import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import './transactionDescriptionModal.html'
import {SideBarService} from "../../js/sidebar-service";

let sideBarService = new SideBarService();
Template.transactionDescriptionModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.eftOptionsList = new ReactiveVar([]);

  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.getDataTableList = function(data) {
    let dataList = [
      data[0],
      data[1]
    ];
    return dataList;
  }

  let headerStructure = [
    {index: 0, label: "#ID", class: "colID", width: "30", active: false, display: true},
    {index: 1, label: "Transaction Description", class: "colTransactionDescription", width: "300", active: true, display: true},
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.transactionDescriptionModal.onRendered(function () {
});

Template.transactionDescriptionModal.events({

});

Template.transactionDescriptionModal.helpers({

  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getTransactionDescription;
  },

  searchAPI: function() {
    let sideBarService = new SideBarService();
    return sideBarService.getTransactionDescription;
  },

  service: ()=>{
    let sideBarService = new SideBarService();
    return sideBarService;

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
