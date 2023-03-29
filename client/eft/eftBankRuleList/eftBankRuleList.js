import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random';
import { Template } from 'meteor/templating';
import './eftBankRuleList.html';
import {EftService} from "../eft-service";

let eftService = new EftService();

function getToggleElem(id, val) {
  return `<div class="custom-control custom-switch chkBox text-center">
    <input class="custom-control-input chkBox" name='${id}' type="radio" id="${id}" ${val ? "checked" : ""}>
    <label class="custom-control-label chkBox" for="${id}"></label>
  </div>`
}

Template.eftBankRuleList.onCreated(function () {
  let templateObject = Template.instance();
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.getDataTableList = function(data) {
      let dataList = [
        data[0],
        data[1],
        data[2],
        getToggleElem(`includebalancerecord${data[0]}`, data[3]),
        getToggleElem(`includenettotal${data[0]}`, data[4]),
        getToggleElem(`includecredittotal${data[0]}`, data[5]),
        getToggleElem(`includedebittotal${data[0]}`, data[6]),
      ];
      return dataList;
    }
  
    let headerStructure = [
      {index: 0, label: "#ID", class: "colID", width: "30", active: false, display: true},      
      {index: 1, label: "Bank Name", class: "colBankName", width: "300", active: true, display: true},
      {index: 2, label: "Description", class: "colBankDescription", width: "300", active: true, display: true},
      {index: 3, label: "Include Balance Record", class: "colIncludeBalanceRecord", width: "300", active: true, display: true},
      {index: 4, label: "Include Net Total", class: "colIncludeNetTotal", width: "300", active: true, display: true},
      {index: 5, label: "Include Credit Total", class: "colIncludeCreditTotal", width: "300", active: true, display: true},
      {index: 6, label: "Include Debit Total", class: "colIncludeDebitTotal", width: "300", active: true, display: true},
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.eftBankRuleList.onRendered(function () {

});

Template.eftBankRuleList.events({
    
});

Template.eftBankRuleList.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {    
    return eftService.getEftBankRuleList;
  },

  searchAPI: function() {    
    return eftService.getEftBankRuleList;
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
