import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import './processListPopup.html';
import { ManufacturingService } from './manufacturing-service';
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.processlistpopup.onCreated(function (e) {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.getDataTableList = function (data) {
    let linestatus = '';
    if(data.fields.Active == true){
      linestatus = "";
    }
    else if(data.fields.Active == false){
      linestatus = "In-Active";
    }
    let dataList = [
      data.fields.ID || "",
      data.fields.KeyValue || "",
      data.fields.Description || "",
      data.fields.DailyHours || "",
      Currency + data.fields.HourlyLabourCost || 0,
      data.fields.COGS || "",
      data.fields.ExpenseAccount || "",
      Currency + data.fields.OHourlyCost || 0,
      data.fields.OCOGS || "",
      data.fields.OExpense || "",
      Currency + data.fields.TotalHourlyCost || 0,
      data.fields.Wastage || "",
      linestatus
    ];
    // let dataList = [];
    return dataList;
  };

  let headerStructure = [
    {
      index: 0,
      label: "ID",
      class: "colProcessId",
      active: false,
      display: true,
      width: "30",
    },
    {
      index: 1,
      label: "Name",
      class: "colName",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 2,
      label: "Description",
      class: "colDescription",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 3,
      label: "Daily Hours",
      class: "colDailyHours",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 4,
      label: "Hourly Labour Cost",
      class: "colHourlyLabourCost",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 5,
      label: "Cost of Goods Sold",
      class: "colCOGS",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 6,
      label: "Expense Account",
      class: "colExpense",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 7,
      label: "Hourly Overhead Cost",
      class: "colHourlyOverheadCost",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 8,
      label: "Cost of Goods Sold(Overhead)",
      class: "colOverGOGS",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 9,
      label: "Expense Account(Overhead)",
      class: "colOverExpense",
      active: true,
      display: true,
      width: "120",
    },
    {
      index: 10,
      label: "Total Hourly Costs",
      class: "colTotalHourlyCosts",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 11,
      label: "Inventory Asset Wastage",
      class: "colWastage",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 11,
      label: "Status",
      class: "colStatus",
      active: true,
      display: true,
      width: "120",
    },
  ];

  templateObject.tableheaderrecords.set(headerStructure);
});

Template.processlistpopup.onRendered(function (e) {
  const templateObject = Template.instance();
  // let splashArrayProcessList = [];
  // templateObject.getProcessList = function(e) {
  //     // let tempArray = localStorage.getItem('TProcesses');
  //     // templateObject.datatablerecords.set(tempArray?JSON.parse(tempArray): []);
  //     $('.fullScreenSpin').css('display', 'inline-block');

  //     // getVS1Data('TProcessStep').then(function(dataObject){
  //     //     if(dataObject.length == 0) {
  //     //         manufacturingService.getAllProcessData().then(function(data){
  //     //             addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn){}).catch(function(err){})
  //     //             templateObject.datatablerecords.set(data.tprocessstep);
  //     //             if(templateObject.datatablerecords.get()) {
  //     //                 let temp = templateObject.datatablerecords.get();
  //     //                 temp.map(process => {
  //     //                     let dataListProcess = [
  //     //                         process.fields.KeyValue || '',
  //     //                         process.fields.Description || '',
  //     //                         process.fields.DailyHours || 0,
  //     //                         process.fields.TotalHourlyCost || 0.00,
  //     //                         process.fields.Wastage || '',
  //     //                     ];
  //     //                     splashArrayProcessList.push(dataListProcess);
  //     //                 })

  //     //                 setTimeout(function () {
  //     //                     $('#tblProcessPopList').DataTable({
  //     //                         data: splashArrayProcessList,
  //     //                         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //     //                         columnDefs: [
  //     //                             {
  //     //                                 className: "colProcessName",
  //     //                                 "targets": [0]
  //     //                             },
  //     //                             {
  //     //                                 className: "colDescription",
  //     //                                 "targets": [1]
  //     //                             }, {
  //     //                                 className: "colDailyHours",
  //     //                                 "targets": [2]
  //     //                             }, {
  //     //                                 className: "colTotalHourlyCosts",
  //     //                                 "targets": [3]
  //     //                             }, {
  //     //                                 className: "colWastage",
  //     //                                 "targets": [4]
  //     //                             }
  //     //                         ],
  //     //                         select: true,
  //     //                         destroy: true,
  //     //                         colReorder: true,
  //     //                         pageLength: initialDatatableLoad,
  //     //                         lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
  //     //                         info: true,
  //     //                         responsive: true,
  //     //                         "order": [[1, "asc"]],
  //     //                         action: function () {
  //     //                             $('#tblProcessPopList').DataTable().ajax.reload();
  //     //                         },
  //     //                         "fnDrawCallback": function (oSettings) {
  //     //                             $('.paginate_button.page-item').removeClass('disabled');
  //     //                             $('#tblProcessPopList_ellipsis').addClass('disabled');
  //     //                             if (oSettings._iDisplayLength == -1) {
  //     //                                 if (oSettings.fnRecordsDisplay() > 150) {

  //     //                                 }
  //     //                             } else {

  //     //                             }
  //     //                             if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
  //     //                                 $('.paginate_button.page-item.next').addClass('disabled');
  //     //                             }
  //     //                             setTimeout(function () {
  //     //                                 // MakeNegative();
  //     //                             }, 100);
  //     //                         },
  //     //                         "fnInitComplete": function (oSettings) {
  //     //                             $("<button class='btn btn-primary btnAddNewProcess' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i>New Process</button>").insertAfter("#tblProcessPopList_filter");
  //     //                             $("<button class='btn btn-primary btnRefreshProcess' type='button' id='btnRefreshProcess' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblProcessPopList_filter");

  //     //                             // let urlParametersPage = FlowRouter.current().queryParams.page;
  //     //                             // if (urlParametersPage) {
  //     //                             //     this.fnPageChange('last');
  //     //                             // }

  //     //                         }

  //     //                     }).on('page', function () {
  //     //                         setTimeout(function () {
  //     //                             // MakeNegative();
  //     //                         }, 100);
  //     //                         let draftRecord = templateObject.custdatatablerecords.get();
  //     //                         templateObject.custdatatablerecords.set(draftRecord);
  //     //                         $('.fullScreenSpin').css('display', 'none')
  //     //                     }).on('column-reorder', function () {

  //     //                     }).on('length.dt', function (e, settings, len) {
  //     //                     $('.fullScreenSpin').css('display', 'inline-block');
  //     //                     let dataLenght = settings._iDisplayLength;
  //     //                     if (dataLenght == -1) {
  //     //                         $('.fullScreenSpin').css('display', 'none');
  //     //                     }else{
  //     //                         if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
  //     //                             $('.fullScreenSpin').css('display', 'none');
  //     //                         } else {

  //     //                             $('.fullScreenSpin').css('display', 'none');
  //     //                         }

  //     //                     }

  //     //                     });
  //     //                     $('.fullScreenSpin').css('display', 'none')
  //     //                 }, 1000);
  //     //             }
  //     //         })
  //     //     }else {
  //     //         let data = JSON.parse(dataObject[0].data);
  //     //         templateObject.datatablerecords.set(data.tprocessstep);
  //     //         if(templateObject.datatablerecords.get()) {
  //     //             let temp = templateObject.datatablerecords.get();
  //     //             temp.map(process => {
  //     //                 let dataListProcess = [
  //     //                     process.fields.KeyValue || '',
  //     //                     process.fields.Description || '',
  //     //                     process.fields.DailyHours || 0,
  //     //                     process.fields.TotalHourlyCost || 0.00,
  //     //                     process.fields.Wastage || '',
  //     //                 ];
  //     //                 splashArrayProcessList.push(dataListProcess);
  //     //             })

  //     //             setTimeout(function () {
  //     //                 $('#tblProcessPopList').DataTable({
  //     //                     data: splashArrayProcessList,
  //     //                     "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //     //                     columnDefs: [
  //     //                         {
  //     //                             className: "colProcessName",
  //     //                             "targets": [0]
  //     //                         },
  //     //                         {
  //     //                             className: "colDescription",
  //     //                             "targets": [1]
  //     //                         }, {
  //     //                             className: "colDailyHours",
  //     //                             "targets": [2]
  //     //                         }, {
  //     //                             className: "colTotalHourlyCosts",
  //     //                             "targets": [3]
  //     //                         }, {
  //     //                             className: "colWastage",
  //     //                             "targets": [4]
  //     //                         }
  //     //                     ],
  //     //                     select: true,
  //     //                     destroy: true,
  //     //                     colReorder: true,
  //     //                     pageLength: initialDatatableLoad,
  //     //                     lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
  //     //                     info: true,
  //     //                     responsive: true,
  //     //                     "order": [[1, "asc"]],
  //     //                     action: function () {
  //     //                         $('#tblProcessPopList').DataTable().ajax.reload();
  //     //                     },
  //     //                     "fnDrawCallback": function (oSettings) {
  //     //                         $('.paginate_button.page-item').removeClass('disabled');
  //     //                         $('#tblProcessPopList_ellipsis').addClass('disabled');
  //     //                         if (oSettings._iDisplayLength == -1) {
  //     //                             if (oSettings.fnRecordsDisplay() > 150) {

  //     //                             }
  //     //                         } else {

  //     //                         }
  //     //                         if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
  //     //                             $('.paginate_button.page-item.next').addClass('disabled');
  //     //                         }
  //     //                         setTimeout(function () {
  //     //                             // MakeNegative();

  //     //                         }, 100);
  //     //                     },
  //     //                     "fnInitComplete": function (oSettings) {
  //     //                         $("<button class='btn btn-primary btnAddNewProcess' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i>New Process</button>").insertAfter("#tblProcessPopList_filter");
  //     //                         $("<button class='btn btn-primary btnRefreshProcess' type='button' id='btnRefreshProcess' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblProcessPopList_filter");
  //     //                         // let urlParametersPage = FlowRouter.current().queryParams.page;
  //     //                         // if (urlParametersPage) {
  //     //                         //     this.fnPageChange('last');
  //     //                         // }

  //     //                     }

  //     //                 }).on('page', function () {
  //     //                     setTimeout(function () {
  //     //                         // MakeNegative();
  //     //                     }, 100);
  //     //                     let draftRecord = templateObject.custdatatablerecords.get();
  //     //                     templateObject.custdatatablerecords.set(draftRecord);
  //     //                     $('.fullScreenSpin').css('display', 'none')
  //     //                 }).on('column-reorder', function () {

  //     //                 }).on('length.dt', function (e, settings, len) {
  //     //                 $('.fullScreenSpin').css('display', 'inline-block');
  //     //                 let dataLenght = settings._iDisplayLength;
  //     //                 if (dataLenght == -1) {
  //     //                     $('.fullScreenSpin').css('display', 'none');
  //     //                 }else{
  //     //                     if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
  //     //                         $('.fullScreenSpin').css('display', 'none');
  //     //                     } else {

  //     //                         $('.fullScreenSpin').css('display', 'none');
  //     //                     }

  //     //                 }

  //     //                 });
  //     //                 $('.fullScreenSpin').css('display', 'none')
  //     //             }, 1000);
  //     //         }
  //     //     }
  //     // }).catch(function(error) {
  //     //     manufacturingService.getAllProcessData().then(function(data){
  //     //         addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn){}).catch(function(err){})
  //     //         templateObject.datatablerecords.set(data.tprocessstep);
  //     //         if(templateObject.datatablerecords.get()) {
  //     //             let temp = templateObject.datatablerecords.get();
  //     //             temp.map(process => {
  //     //                 let dataListProcess = [
  //     //                     process.fields.KeyValue || '',
  //     //                     process.fields.Description || '',
  //     //                     process.fields.DailyHours || 0,
  //     //                     process.fields.TotalHourlyCost || 0.00,
  //     //                     process.fields.Wastage || '',
  //     //                 ];
  //     //                 splashArrayProcessList.push(dataListProcess);
  //     //             })

  //     //             setTimeout(function () {
  //     //                 $('#tblProcessPopList').DataTable({
  //     //                     data: splashArrayProcessList,
  //     //                     "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //     //                     columnDefs: [
  //     //                         {
  //     //                             className: "colProcessName",
  //     //                             "targets": [0]
  //     //                         },
  //     //                         {
  //     //                             className: "colDescription",
  //     //                             "targets": [1]
  //     //                         }, {
  //     //                             className: "colDailyHours",
  //     //                             "targets": [2]
  //     //                         }, {
  //     //                             className: "colTotalHourlyCosts",
  //     //                             "targets": [3]
  //     //                         }, {
  //     //                             className: "colWastage",
  //     //                             "targets": [4]
  //     //                         }
  //     //                     ],
  //     //                     select: true,
  //     //                     destroy: true,
  //     //                     colReorder: true,
  //     //                     pageLength: initialDatatableLoad,
  //     //                     lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
  //     //                     info: true,
  //     //                     responsive: true,
  //     //                     "order": [[1, "asc"]],
  //     //                     action: function () {
  //     //                         $('#tblProcessPopList').DataTable().ajax.reload();
  //     //                     },
  //     //                     "fnDrawCallback": function (oSettings) {
  //     //                         $('.paginate_button.page-item').removeClass('disabled');
  //     //                         $('#tblProcessPopList_ellipsis').addClass('disabled');
  //     //                         if (oSettings._iDisplayLength == -1) {
  //     //                             if (oSettings.fnRecordsDisplay() > 150) {

  //     //                             }
  //     //                         } else {

  //     //                         }
  //     //                         if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
  //     //                             $('.paginate_button.page-item.next').addClass('disabled');
  //     //                         }
  //     //                         setTimeout(function () {
  //     //                             // MakeNegative();
  //     //                         }, 100);
  //     //                     },
  //     //                     "fnInitComplete": function (oSettings) {
  //     //                         $("<button class='btn btn-primary btnAddNewProcess' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i>New Process</button>").insertAfter("#tblProcessPopList_filter");
  //     //                         $("<button class='btn btn-primary btnRefreshProcess' type='button' id='btnRefreshProcess' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblProcessPopList_filter");

  //     //                         // let urlParametersPage = FlowRouter.current().queryParams.page;
  //     //                         // if (urlParametersPage) {
  //     //                         //     this.fnPageChange('last');
  //     //                         // }

  //     //                     }

  //     //                 }).on('page', function () {
  //     //                     setTimeout(function () {
  //     //                         // MakeNegative();
  //     //                     }, 100);
  //     //                     let draftRecord = templateObject.custdatatablerecords.get();
  //     //                     templateObject.custdatatablerecords.set(draftRecord);
  //     //                     $('.fullScreenSpin').css('display', 'none')
  //     //                 }).on('column-reorder', function () {

  //     //                 }).on('length.dt', function (e, settings, len) {
  //     //                 $('.fullScreenSpin').css('display', 'inline-block');
  //     //                 let dataLenght = settings._iDisplayLength;
  //     //                 if (dataLenght == -1) {
  //     //                     $('.fullScreenSpin').css('display', 'none');
  //     //                 }else{
  //     //                     if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
  //     //                         $('.fullScreenSpin').css('display', 'none');
  //     //                     } else {

  //     //                         $('.fullScreenSpin').css('display', 'none');
  //     //                     }

  //     //                 }

  //     //                 });
  //     //                 $('.fullScreenSpin').css('display', 'none')
  //     //             }, 1000);
  //     //         }
  //     //     }).catch(function(err){
  //     //         swal("Something went wrong!", "", "error");
  //     //     })
  //     // })

  // }
  // templateObject.getProcessList();
});

Template.processlistpopup.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get();
  },
  selectedInventoryAssetAccount: () => {
    return Template.instance().selectedInventoryAssetAccount.get();
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction: function () {
    let manufacturingService = new ManufacturingService();
    return manufacturingService.getAllProcessData;
  },

  searchAPI: function () {
    let manufacturingService = new ManufacturingService();
    return manufacturingService.getProcessByName;
  },

  service: () => {
    let manufacturingService = new ManufacturingService();
    return manufacturingService;
  },

  datahandler: function () {
    let templateObject = Template.instance();
    return function (data) {
      let dataReturn = templateObject.getDataTableList(data);
      return dataReturn;
    };
  },

  exDataHandler: function () {
    let templateObject = Template.instance();
    return function (data) {
      let dataReturn = templateObject.getDataTableList(data);
      return dataReturn;
    };
  },

  apiParams: () => {
    return ["limitCount", "limitFrom", "deleteFilter"];
  },
  talbename : () => {
    let templateObject = Template.instance();
    return 'tblProcessList' + templateObject.data.custid;
  }
});

Template.processlistpopup.events({
  "click .btnAddNewProcess": function (event) {
    $("#processListModal").modal("toggle");
    $("#newProcessModal").modal("toggle");
  },
  "click #tblProcessList tbody tr": function (e) {
    var listData = $(e.target).closest("tr").attr('id');
    FlowRouter.go("/processcard?id=" + listData);
  },
});
