import {TaxRateService} from "../settings-service";
import {ReactiveVar} from 'meteor/reactive-var';
import {SideBarService} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

import { Template } from 'meteor/templating';
import './uomlistpop.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
Template.uomlistpop.inheritsHooksFrom('non_transactional_list');
Template.uomlistpop.onCreated(function() {
  const templateObject = Template.instance();

  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.getDataTableList = function(data) {
    let tdPurchaseDef = "";
    let linestatus = "";
    let tdCustomerDef = ""; //isSalesdefault
    let tdSupplierDef = ""; //isPurchasedefault
    let tdUseforAutoSplitQtyinSales = ""; //UseforAutoSplitQtyinSales
    if (data.Active == true) {
      linestatus = "";
    } else if (data.Active == false) {
      linestatus = "In-Active";
    }

    //Check if Sales defaultis checked
    if (data.SalesDefault == true) {
      tdSupplierDef =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtSalesDefault-' +
          data.UnitID +
          '" checked><label class="custom-control-label chkBox" for="swtSalesDefault-' +
          data.UnitID +
          '"></label></div>';
    } else {
      tdSupplierDef =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtSalesDefault-' +
          data.UnitID +
          '"><label class="custom-control-label chkBox" for="swtSalesDefault-' +
          data.UnitID +
          '"></label></div>';
    }
    //Check if Purchase default is checked
    if (data.PurchasesDefault == true) {
      tdPurchaseDef =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' +
          data.UnitID +
          '" checked><label class="custom-control-label chkBox" for="swtPurchaseDefault-' +
          data.UnitID +
          '"></label></div>';
    } else {
      tdPurchaseDef =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' +
          data.UnitID +
          '"><label class="custom-control-label chkBox" for="swtPurchaseDefault-' +
          data.UnitID +
          '"></label></div>';
    }

    //Check if UseforAutoSplitQtyinSales is checked
    if (data.UseforAutoSplitQtyinSales == true) {
      tdUseforAutoSplitQtyinSales =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' +
          data.UnitID +
          '" checked><label class="custom-control-label chkBox" for="swtPurchaseDefault-' +
          data.UnitID +
          '"></label></div>';
    } else {
      tdUseforAutoSplitQtyinSales =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' +
          data.UnitID +
          '"><label class="custom-control-label chkBox" for="swtPurchaseDefault-' +
          data.UnitID +
          '"></label></div>';
    }

    var dataList = [
      data.UnitID || "",
      data.UOMName || data.UnitName || "",
      data.UnitDescription || "",
      data.UnitProductKeyName || "",
      data.BaseUnitName || "",
      data.BaseUnitID || "",
      data.PartID || "",
      data.Multiplier || 0,
      tdSupplierDef,
      tdPurchaseDef,
      data.Weight || 0,
      data.NoOfBoxes || 0,
      data.Height || 0,
      data.Width || 0,
      data.Length || 0,
      data.Volume || 0,
      linestatus,
      tdUseforAutoSplitQtyinSales,
    ];
    return dataList;
  }

  let headerStructure = [
    { index: 0, label: '#ID', class: 'colUOMID', active: false, display: true, width: "10" },
    { index: 1, label: 'Unit Name', class: 'colUOMName', active: true, display: true, width: "100" },
    { index: 2, label: 'Description', class: 'colUOMDesc', active: true, display: true, width: "200" },
    { index: 3, label: 'Product Name', class: 'colUOMProduct', active: false, display: true, width: "250" },
    { index: 4, label: 'Base Unit Name', class: 'colUOMBaseUnitName', active: false, display: true, width: "150" },
    { index: 5, label: 'Base Unit ID', class: 'colUOMBaseUnitID', active: false, display: true, width: "100" },
    { index: 6, label: 'Part ID', class: 'colUOMPartID', active: false, display: true, width: "100" },
    { index: 7, label: 'Unit Multiplier', class: 'colUOMMultiplier', active: true, display: true, width: "140" },
    { index: 8, label: 'Sale Default', class: 'colUOMSalesDefault', active: true, display: true, width: "140" },
    { index: 9, label: 'Purchase Default', class: 'colUOMPurchaseDefault', active: true, display: true, width: "170" },
    { index: 10, label: 'Weight', class: 'colUOMWeight', active: false, display: true, width: "100" },
    { index: 11, label: 'No of Boxes', class: 'colUOMNoOfBoxes', active: false, display: true, width: "120" },
    { index: 12, label: 'Height', class: 'colUOMHeight', active: false, display: true, width: "100" },
    { index: 13, label: 'Width', class: 'colUOMWidth', active: false, display: true, width: "100" },
    { index: 14, label: 'Length', class: 'colUOMLength', active: false, display: true, width: "100" },
    { index: 15, label: 'Volume', class: 'colUOMVolume', active: false, display: true, width: "100" },
    { index: 16, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
    { index: 17, label: 'Qty in Sales', class: 'colQtyinSales', active: false, display: true, width: "150" },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.uomlistpop.onRendered(function() {
//   let templateObject = Template.instance();
//   let taxRateService = new TaxRateService();
//   const dataTableList = [];
//   const tableHeaderList = [];

//   var splashArrayUOMList = new Array();

//   templateObject.getAllUOMs = function () {
//       getVS1Data('TUnitOfMeasureList').then(function (dataObject) {
//           if (dataObject.length == 0) {
//               sideBarService.getUOMVS1().then(function (data) {
//                 addVS1Data('TUnitOfMeasureList',JSON.stringify(data));
//                   let records = [];
//                   let inventoryData = [];
//                   for (let i = 0; i < data.tunitofmeasure.length; i++) {
//                       var dataListUOM = [
//                           data.tunitofmeasure[i].fields.ID || "",
//                           data.tunitofmeasure[i].fields.UOMName || "",
//                           data.tunitofmeasure[i].fields.UnitDescription || "",
//                           data.tunitofmeasure[i].fields.ProductName || "",
//                           data.tunitofmeasure[i].fields.Multiplier || 0,
//                           data.tunitofmeasure[i].fields.SalesDefault || false,
//                           data.tunitofmeasure[i].fields.PurchasesDefault || false,
//                           data.tunitofmeasure[i].fields.Weight || 0,
//                           data.tunitofmeasure[i].fields.NoOfBoxes || 0,
//                           data.tunitofmeasure[i].fields.Height || 0,
//                           data.tunitofmeasure[i].fields.Width || 0,
//                           data.tunitofmeasure[i].fields.Length || 0,
//                           data.tunitofmeasure[i].fields.Volume || 0
//                       ];

//                       splashArrayUOMList.push(dataListUOM);
//                   }

//                   if (splashArrayUOMList) {
//                       $('#tblUOMList').DataTable({
//                           data: splashArrayUOMList,
//                           "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
//                           select: true,
//                           destroy: true,
//                           colReorder: true,
//                           columnDefs: [{
//                                   orderable: false,
//                                   className: "colUOMID",
//                                   targets: 0
//                               }, {
//                                   className: "colUOMName",
//                                   "targets": [1]
//                               }, {
//                                   className: "colUOMDesc",
//                                   "targets": [2]
//                               }, {
//                                   className: "colUOMProduct",
//                                   "targets": [3]
//                               }, {
//                                   className: "colUOMMultiplier",
//                                   "targets": [4]
//                               }, {
//                                   className: "colUOMSalesDefault",
//                                   "targets": [5]
//                               }, {
//                                   className: "colUOMPurchaseDefault",
//                                   "targets": [6]
//                               }, {
//                                   className: "colUOMWeight text-right",
//                                   "targets": [7]
//                               }, {
//                                   className: "colUOMNoOfBoxes text-right",
//                                   "targets": [8]
//                               }
//                           ],
//                           pageLength: initialDatatableLoad,
//                           lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
//                           info: true,
//                           responsive: true,
//                           "fnDrawCallback": function (oSettings) {
//                               // $('.dataTables_paginate').css('display', 'none');
//                           },
//                           language: { search: "",searchPlaceholder: "Search List..." },
//                           "fnInitComplete": function () {
//                             // $("<button class='btn btn-primary btnAddNewUOM' data-dismiss='modal' data-toggle='modal' data-target='#newUOMModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblUOMList_filter");
//                             $("<button class='btn btn-primary btnRefreshUOM' type='button' id='btnRefreshUOM' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblUOMList_filter");
//                           }

//                       });
//                   }
//               })
//           } else {
//               let data = JSON.parse(dataObject[0].data);
//               let useData = data.tunitofmeasure;
//               let records = [];
//               let inventoryData = [];
//               for (let i = 0; i < data.tunitofmeasure.length; i++) {
//                   var dataListUOM = [
//                     data.tunitofmeasure[i].fields.ID || '',
//                     data.tunitofmeasure[i].fields.UOMName || '',
//                     data.tunitofmeasure[i].fields.Description || '-',
//                     data.tunitofmeasure[i].fields.ProductName || '',
//                     data.tunitofmeasure[i].fields.Multiplier || 0,
//                     data.tunitofmeasure[i].fields.SalesDefault || false,
//                     data.tunitofmeasure[i].fields.PurchasesDefault || false,
//                     data.tunitofmeasure[i].fields.Weight || 0,
//                     data.tunitofmeasure[i].fields.NoOfBoxes || 0,
//                     data.tunitofmeasure[i].fields.Height || 0,
//                     data.tunitofmeasure[i].fields.Width || 0,
//                     data.tunitofmeasure[i].fields.Length || 0,
//                     data.tunitofmeasure[i].fields.Volume || 0
//                   ];


//                   splashArrayUOMList.push(dataListUOM);
//               }
//               if (splashArrayUOMList) {
//                   $('#tblUOMList').DataTable({
//                       data: splashArrayUOMList,
//                       "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
//                       select: true,
//                       destroy: true,
//                       colReorder: true,
//                       columnDefs: [{
//                               orderable: false,
//                               className: "colUOMID",
//                               targets: 0
//                           }, {
//                               className: "colUOMName",
//                               "targets": [1]
//                           }, {
//                               className: "colUOMDesc",
//                               "targets": [2]
//                           }, {
//                               className: "colUOMProduct",
//                               "targets": [3]
//                           }, {
//                               className: "colUOMMultiplier",
//                               "targets": [4]
//                           }, {
//                               className: "colUOMSalesDefault",
//                               "targets": [5]
//                           }, {
//                               className: "colUOMPurchaseDefault",
//                               "targets": [6]
//                           }, {
//                               className: "colUOMWeight text-right",
//                               "targets": [7]
//                           }, {
//                               className: "colUOMNoOfBoxes text-right",
//                               "targets": [8]
//                           }
//                       ],
//                       pageLength: initialDatatableLoad,
//                       lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
//                       info: true,
//                       responsive: true,
//                       "fnDrawCallback": function (oSettings) {
//                           // $('.dataTables_paginate').css('display', 'none');
//                       },
//                       language: { search: "",searchPlaceholder: "Search List..." },
//                       "fnInitComplete": function () {
//                         // $("<button class='btn btn-primary btnAddNewUOM' data-dismiss='modal' data-toggle='modal' data-target='#newUOMModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblUOMList_filter");
//                         $("<button class='btn btn-primary btnRefreshUOM' type='button' id='btnRefreshUOM' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblUOMList_filter");
//                       }

//                   });
//               }
//           }
//       }).catch(function (err) {
//           sideBarService.getUOMVS1().then(function (data) {
//             addVS1Data('TUnitOfMeasureList',JSON.stringify(data));
//               let records = [];
//               let inventoryData = [];
//               for (let i = 0; i < data.tunitofmeasure.length; i++) {
//                   var dataListUOM = [
//                     data.tunitofmeasure[i].fields.ID || '',
//                     data.tunitofmeasure[i].fields.UOMName || '',
//                     data.tunitofmeasure[i].fields.Description || '-',
//                     data.tunitofmeasure[i].fields.ProductName || '',
//                     data.tunitofmeasure[i].fields.Multiplier || 0,
//                     data.tunitofmeasure[i].fields.SalesDefault || false,
//                     data.tunitofmeasure[i].fields.PurchasesDefault || false,
//                     data.tunitofmeasure[i].fields.Weight || 0,
//                     data.tunitofmeasure[i].fields.NoOfBoxes || 0
//                   ];

//                   splashArrayUOMList.push(dataListUOM);
//               }

//               if (splashArrayUOMList) {
//                   $('#tblUOMList').DataTable({
//                       data: splashArrayUOMList,
//                       "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
//                       select: true,
//                       destroy: true,
//                       colReorder: true,
//                       columnDefs: [{
//                               orderable: false,
//                               className: "colUOMID",
//                               targets: 0
//                           }, {
//                               className: "colUOMName",
//                               "targets": [1]
//                           }, {
//                               className: "colUOMDesc",
//                               "targets": [2]
//                           }, {
//                               className: "colUOMProduct",
//                               "targets": [3]
//                           }, {
//                               className: "colUOMMultiplier",
//                               "targets": [4]
//                           }, {
//                               className: "colUOMSalesDefault",
//                               "targets": [5]
//                           }, {
//                               className: "colUOMPurchaseDefault",
//                               "targets": [6]
//                           }, {
//                               className: "colUOMWeight text-right",
//                               "targets": [7]
//                           }, {
//                               className: "colUOMNoOfBoxes text-right",
//                               "targets": [8]
//                           }
//                       ],
//                       pageLength: initialDatatableLoad,
//                       lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
//                       info: true,
//                       responsive: true,
//                       "fnDrawCallback": function (oSettings) {
//                           // $('.dataTables_paginate').css('display', 'none');
//                       },
//                       language: { search: "",searchPlaceholder: "Search List..." },
//                       "fnInitComplete": function () {
//                         // $("<button class='btn btn-primary btnAddNewUOM' data-dismiss='modal' data-toggle='modal' data-target='#newUOMModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblUOMList_filter");
//                         $("<button class='btn btn-primary btnRefreshUOM' type='button' id='btnRefreshUOM' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblUOMList_filter");
//                       }

//                   });
//               }
//           })
//       });

//   };
//   templateObject.getAllUOMs();

});

Template.uomlistpop.events({
//   'click .btnRefreshUOM': function (event) {
//       let templateObject = Template.instance();
//       $('.fullScreenSpin').css('display', 'inline-block');
//       const customerList = [];
//       const clientList = [];
//       let salesOrderTable;
//       var splashArray = new Array();
//       var splashArrayUOMList = new Array();
//       const dataTableList = [];
//       const tableHeaderList = [];
//       let sideBarService = new SideBarService();
//       let taxRateService = new TaxRateService();
//       let dataSearchName = $('#tblUOMList_filter input').val();
//       var currentLoc = FlowRouter.current().route.path;
//       if (dataSearchName.replace(/\s/g, '') != '') {
//           sideBarService.getUOMVS1ByName(dataSearchName).then(function (data) {
//               let lineItems = [];
//               let lineItemObj = {};
//               if (data.tunitofmeasure.length > 0) {
//                 for (let i = 0; i < data.tunitofmeasure.length; i++) {
//                     var dataList = [
//                       data.tunitofmeasure[i].fields.ID || '',
//                       data.tunitofmeasure[i].fields.UOMName || '',
//                       data.tunitofmeasure[i].fields.Description || '-',
//                       data.tunitofmeasure[i].fields.ProductName || '',
//                       data.tunitofmeasure[i].fields.Multiplier || 0,
//                       data.tunitofmeasure[i].fields.SalesDefault || false,
//                       data.tunitofmeasure[i].fields.PurchasesDefault || false,
//                       data.tunitofmeasure[i].fields.Weight || 0,
//                       data.tunitofmeasure[i].fields.NoOfBoxes || 0
//                     ];

//                     splashArrayUOMList.push(dataList);
//                 }

//                   var datatable = $('#tblUOMList').DataTable();
//                   datatable.clear();
//                   datatable.rows.add(splashArrayUOMList);
//                   datatable.draw(false);

//                   $('.fullScreenSpin').css('display', 'none');
//               } else {

//                   $('.fullScreenSpin').css('display', 'none');
//                    $('#UOMListModal').modal('toggle');
//                   swal({
//                       title: 'Question',
//                       text: "Tax Code does not exist, would you like to create it?",
//                       type: 'question',
//                       showCancelButton: true,
//                       confirmButtonText: 'Yes',
//                       cancelButtonText: 'No'
//                   }).then((result) => {
//                       if (result.value) {
//                           $('#newUOMModal').modal('toggle');
//                           $('#edtTaxNamePop').val(dataSearchName);
//                       } else if (result.dismiss === 'cancel') {
//                           $('#newUOMModal').modal('toggle');
//                       }
//                   });

//               }

//           }).catch(function (err) {
//               $('.fullScreenSpin').css('display', 'none');
//           });
//       } else {
//         sideBarService.getUOMVS1().then(function(data) {

//                 let records = [];
//                 let inventoryData = [];
//                 for (let i = 0; i < data.tunitofmeasure.length; i++) {
//                     var dataList = [
//                       data.tunitofmeasure[i].fields.ID || '',
//                       data.tunitofmeasure[i].fields.UOMName || '',
//                       data.tunitofmeasure[i].fields.Description || '-',
//                       data.tunitofmeasure[i].fields.ProductName || '',
//                       data.tunitofmeasure[i].fields.Multiplier || 0,
//                       data.tunitofmeasure[i].fields.SalesDefault || false,
//                       data.tunitofmeasure[i].fields.PurchasesDefault || false,
//                       data.tunitofmeasure[i].fields.Weight || 0,
//                       data.tunitofmeasure[i].fields.NoOfBoxes || 0
//                     ];

//                     splashArrayUOMList.push(dataList);
//                 }
//       var datatable = $('#tblUOMList').DataTable();
//             datatable.clear();
//             datatable.rows.add(splashArrayUOMList);
//             datatable.draw(false);

//             $('.fullScreenSpin').css('display', 'none');
//             }).catch(function (err) {
//               $('.fullScreenSpin').css('display', 'none');
//           });
//       }
//   },
//   'keyup #tblUOMList_filter input': function (event) {
//     if (event.keyCode == 13) {
//        $(".btnRefreshUOM").trigger("click");
//     }
//   }
});

Template.uomlistpop.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getUOMDataList;
  },

  searchAPI: function() {
    return sideBarService.getUOMVS1ByName;
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
    return ['limitCount', 'limitFrom', 'deleteFilter'];
  },
});

