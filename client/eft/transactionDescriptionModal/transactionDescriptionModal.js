import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import './transactionDescriptionModal.html'
import {BankNameService} from "../../lib/global/bank-names";
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
    {index: 0, label: "ID", class: "colID", width: "30", active: true, display: true},
    {index: 1, label: "Transaction Description", class: "colTransactionDescription", width: "300", active: true, display: true},
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.transactionDescriptionModal.onRendered(function () {
  let templateObject = Template.instance();

  let splashArrayTransactionDescriptionList = [['', 'Payroll'], ['', 'Supplier'], ['', 'Insurance'], ['', 'Accounting']]
  // $('#tblTransactionDescription').dataTable({
  //   data: splashArrayTransactionDescriptionList,
  //   "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //   // paging: true,
  //   // "aaSorting": [],
  //   // "orderMulti": true,
  //   columnDefs: [
  //     { className: "productName", "targets": [0] },
  //     { className: "transactionDescription", "targets": [1] },
  //   ],
  //   select: true,
  //   destroy: true,
  //   colReorder: true,
  //   pageLength: initialDatatableLoad,
  //   lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
  //   info: true,
  //   responsive: true,
  //   "fnInitComplete": function () {
  //     $("<button class='btn btn-primary btnAddNewTransactionDescription' data-dismiss='modal' data-toggle='modal' data-target='#addTransactionDescriptionModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblTransactionDescription_filter");
  //     $("<button class='btn btn-primary btnRefreshTransactionDescription' type='button' id='btnRefreshTransactionDescription' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTransactionDescription_filter");
  //   }
  // });

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
