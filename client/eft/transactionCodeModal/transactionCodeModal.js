import { ReactiveVar } from "meteor/reactive-var";
import {SideBarService} from "../../js/sidebar-service";

let sideBarService = new SideBarService();
Template.transactionCodeModal.onCreated(function () {
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
    {index: 1, label: "Transaction Code", class: "colTransactionCode", width: "300", active: true, display: true},
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.transactionCodeModal.onRendered(function () {
  let templateObject = Template.instance();

  let splashArrayTransactionCodeList = [['', 'Debit Items'], ['', 'Credit Items']]
  // $('#tblTransactionCode').dataTable({
  //   data: splashArrayTransactionCodeList,
  //   "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //   columnDefs: [
  //     { className: "transactionCodeId", "targets": [0] },
  //     { className: "transactionCode", "targets": [1] },
  //   ],
  //   select: true,
  //   destroy: true,
  //   colReorder: true,
  //   pageLength: initialDatatableLoad,
  //   lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
  //   info: true,
  //   responsive: true,
  //   "fnInitComplete": function () {
  //     $("<button class='btn btn-primary btnAddNewTransactionCode' data-dismiss='modal' data-toggle='modal' data-target='#addTransactionCodeModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblTransactionCode_filter");
  //     $("<button class='btn btn-primary btnRefreshTransactionCode' type='button' id='btnRefreshTransactionCode' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTransactionCode_filter");
  //   }
  // });

});

Template.transactionCodeModal.events({

});

Template.transactionCodeModal.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getTransactionCode;
  },

  searchAPI: function() {
    let sideBarService = new SideBarService();
    return sideBarService.getTransactionCode;
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
