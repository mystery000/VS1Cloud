import { ReactiveVar } from "meteor/reactive-var";
import { BankNameList } from "../../lib/global/bank-names";
import {BankNameService} from "../../lib/global/bank-names";
import { Template } from 'meteor/templating';
import './bankNameModal.html';
import moment from "moment";
import {SideBarService} from "../../js/sidebar-service";

let bankNameService = new BankNameService();
Template.bankNameModal.onCreated(function () {
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
    {index: 0, label: "Account Name", class: "colBankName", width: "100", active: true, display: true},
    {index: 1, label: "Description", class: "colDescription", width: "300", active: true, display: true},
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.bankNameModal.onRendered(function () {
  // let templateObject = Template.instance();
  //
  // let splashArrayBankNameList = BankNameList;
  //
  // $('#tblBankName').dataTable({
  //   data: splashArrayBankNameList,
  //   "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //   columnDefs: [
  //     { className: "bankName", "targets": [0] },
  //     { className: "bankDescription", "targets": [1] },
  //   ],
  //   select: true,
  //   search: true,
  //   destroy: true,
  //   colReorder: true,
  //   pageLength: initialDatatableLoad,
  //   lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
  //   info: true,
  //   responsive: true,
  //   language: { search: "",searchPlaceholder: "Search List..." },
  //   "fnInitComplete": function () {
  //     $("<button class='btn btn-primary btnAddNewBankName' data-dismiss='modal' data-toggle='modal' data-target='#addBankNameModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblBankName_filter");
  //     $("<button class='btn btn-primary btnRefreshBankName' type='button' id='btnRefreshBankName' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblBankName_filter");
  //   }
  // });
});


Template.bankNameModal.events({
  "click .btnCancelEftBankName": (e) => {
      $('#bankNameModal').modal('hide');
  },

});

Template.bankNameModal.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {
    let bankNameService = new BankNameService();
    return bankNameService.getBankNameList;
  },

  searchAPI: function() {
    return bankNameService.getBankNameList;
  },

  service: ()=>{
    let bankNameService = new BankNameService();
    return bankNameService;

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
