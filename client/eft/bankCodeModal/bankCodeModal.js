import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import './bankCodeModal.html';
import {SideBarService} from "../../js/sidebar-service.js";

let sideBarService = new SideBarService();

Template.bankCodeModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.eftOptionsList = new ReactiveVar([]);

  const templateObject = Template.instance();

  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.getDataTableList = function(data) {
    let dataList = [
      data[0],
      data[1],
    ];
    return dataList;
  }

  let headerStructure = [
    { index: 0, label: 'Code Name', class: 'colAccountName', active: true, display: true, width: "150" },
    { index: 1, label: 'Description', class: 'colDescription', active: true, display: true, width: "300" },
  ];

  templateObject.tableheaderrecords.set(headerStructure);
});

Template.bankCodeModal.onRendered(function () {
  let templateObject = Template.instance();

  let splashArrayBankCodeList = [['CBA', 'Commonwealth Bank'], ['NAB', 'National Australian Bank'], ['WBC', 'Westpac Bank'], ['MQG', 'Macquarie Bank'], ['ANZ', 'Australia and New Zealand Banking Group'], ['BEN', 'Bendigo Bank'], ['BOQ', 'Bank of Queensland'], ['VUK', 'Virgin Money'], ['BFL', 'BSP Financial Group'], ['JDO', 'Judo Bank']]
  $('#tblBankCode').dataTable({
    data: splashArrayBankCodeList,
    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    columnDefs: [
      { className: "bankCode", "targets": [0] },
      { className: "bankDescription", "targets": [1] },
    ],
    select: true,
    destroy: true,
    colReorder: true,
    pageLength: initialDatatableLoad,
    lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
    info: true,
    responsive: true,
    "fnInitComplete": function () {
      $("<button class='btn btn-primary btnAddNewBankCode' data-dismiss='modal' data-toggle='modal' data-target='#addBankCodeModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblBankCode_filter");
      $("<button class='btn btn-primary btnRefreshBankCode' type='button' id='btnRefreshBankCode' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblBankCode_filter");
    }
  });

});

Template.bankCodeModal.events({

});

Template.bankCodeModal.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getBankCode;
  },

  searchAPI: function() {
    return sideBarService.getBankCode;
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
