import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ServiceLogService } from "../../servicelog-service";
import { SideBarService } from "../../../js/sidebar-service";
import "../../../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();
let serviceLogService = new ServiceLogService();

Template.serviceloglisttable.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
});

Template.serviceloglisttable.onRendered(function () {
  // $(".fullScreenSpin").css("display", "inline-block");
  // let templateObject = Template.instance();

  // // set initial table rest_data
  // templateObject.init_reset_data = function () {
  //   let reset_data = [
  //     { index: 0, label: 'ID', class: 'LogId', active: false, display: false, width: "0" },
  //     { index: 1, label: 'Asset Code', class: 'AssetCode', active: true, display: true, width: "" },
  //     { index: 2, label: 'Asset Name', class: 'AssetName', active: true, display: true, width: "" },
  //     { index: 3, label: 'Service Type', class: 'ServiceType', active: true, display: true, width: "" },
  //     { index: 4, label: 'Service Date', class: 'ServiceDate', active: true, display: true, width: "" },
  //     { index: 5, label: 'Service Provider', class: 'ServiceProvider', active: true, display: true, width: "" },
  //     { index: 6, label: 'Next Service Due Date', class: 'ServiceDueDate', active: true, display: true, width: "" },
  //     { index: 7, label: 'Status', class: 'ServiceStatus', active: true, display: true, width: "" },
  //   ];

  //   let templateObject = Template.instance();
  //   templateObject.reset_data.set(reset_data);
  // }
  // templateObject.init_reset_data();
  // // set initial table rest_data

  // // custom field displaysettings
  // templateObject.initCustomFieldDisplaySettings = function (listType) {
  //   let reset_data = templateObject.reset_data.get();
  //   showCustomFieldDisplaySettings(reset_data);

  //   try {
  //     getVS1Data("VS1_Customize").then(function (dataObject) {
  //       if (dataObject.length == 0) {
  //         sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), listType).then(function (data) {
  //           reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
  //           showCustomFieldDisplaySettings(reset_data);
  //         }).catch(function (err) {
  //         });
  //       } else {
  //         let data = JSON.parse(dataObject[0].data);
  //         if(data.ProcessLog.Obj.CustomLayout.length > 0){
  //          for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
  //            if(data.ProcessLog.Obj.CustomLayout[i].TableName == listType){
  //              reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
  //              showCustomFieldDisplaySettings(reset_data);
  //            }
  //          }
  //        };
  //         // handle process here
  //       }
  //     });
  //   } catch (error) {
  //   }
  //   return;
  // }

  // function showCustomFieldDisplaySettings(reset_data) {
  //   let custFields = [];
  //   let customData = {};
  //   let customFieldCount = reset_data.length;

  //   for (let r = 0; r < customFieldCount; r++) {
  //     customData = {
  //       active: reset_data[r].active,
  //       id: reset_data[r].index,
  //       custfieldlabel: reset_data[r].label,
  //       class: reset_data[r].class,
  //       display: reset_data[r].display,
  //       width: reset_data[r].width ? reset_data[r].width : ''
  //     };
  //     custFields.push(customData);
  //   }
  //   templateObject.displayfields.set(custFields);
  // }

  // templateObject.initCustomFieldDisplaySettings("tblServiceLogList");
  // // set initial table rest_data  //
  // templateObject.getServiceLogList = function () {
  //   getVS1Data("TServiceLogList").then(function (dataObject) {
  //     if (dataObject.length == 0) {
  //       serviceLogService.getServiceLogList().then(function (data) {
  //         templateObject.setServiceLogList(data);
  //       }).catch(function (err) {
  //         $(".fullScreenSpin").css("display", "none");
  //       });
  //     } else {
  //       let data = JSON.parse(dataObject[0].data);
  //       setServiceLogList(data);
  //     }
  //   }).catch(function (err) {
  //     serviceLogService.getServiceLogList().then(function (data) {
  //       templateObject.setServiceLogList(data);
  //     }).catch(function (err) {
  //       $(".fullScreenSpin").css("display", "none");
  //     });
  //   });
  // };

  // $(".fullScreenSpin").css("display", "inline-block");
  // templateObject.getServiceLogList();

  // templateObject.setServiceLogList = function (data) {
  //   addVS1Data('TServiceLogList', JSON.stringify(data));
  //   const dataTableList = [];

  //   for (const log of data.tserviceloglist) {
  //     const dataList = {
  //       id: log.ServiceID || "",
  //       assetID: log.AssetID || 0,
  //       assetCode: log.AssetCode || "",
  //       assetName: log.AssetName || "",
  //       // serviceType: log.fields.ServiceType || "",
  //       serviceDate: log.ServiceDate || "",
  //       serviceProvider: log.ServiceProvider || "",
  //       nextServiceDate: log.NextServiceDate || "",
  //       nextServiceHours: log.HoursForNextService || 0,
  //       nextServiceKms: log.KmsForNextService || 0,
  //       serviceNotes: log.ServiceNotes || "",
  //       status: log.Done || "",
  //     };
  //     dataTableList.push(dataList);
  //   }

  //   templateObject.datatablerecords.set(dataTableList);

  //   $(".fullScreenSpin").css("display", "none");
  //   setTimeout(function () {
  //     $("#tblServiceLogList").DataTable({
  //       columnDefs: [
  //       ],
  //       select: true,
  //       destroy: true,
  //       colReorder: true,
  //       sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //       buttons: [{
  //         extend: "csvHtml5",
  //         text: "",
  //         download: "open",
  //         className: "btntabletocsv hiddenColumn",
  //         filename: "FixedAssetsOverview__" + moment().format(),
  //         orientation: "portrait",
  //         exportOptions: {
  //           columns: ":visible",
  //         },
  //       },
  //       {
  //         extend: "print",
  //         download: "open",
  //         className: "btntabletopdf hiddenColumn",
  //         text: "",
  //         title: "Accounts Overview",
  //         filename: "Accounts Overview_" + moment().format(),
  //         exportOptions: {
  //           columns: ":visible",
  //         },
  //       },
  //       {
  //         extend: "excelHtml5",
  //         title: "",
  //         download: "open",
  //         className: "btntabletoexcel hiddenColumn",
  //         filename: "FixedAssetsOverview__" + moment().format(),
  //         orientation: "portrait",
  //         exportOptions: {
  //           columns: ":visible",
  //         },
  //       },
  //       ],
  //       pageLength: initialDatatableLoad,
  //       lengthMenu: [
  //         [initialDatatableLoad, -1],
  //         [initialDatatableLoad, "All"],
  //       ],
  //       info: true,
  //       responsive: true,
  //       order: [
  //         [0, "asc"]
  //       ],
  //       // "aaSorting": [[1,'desc']],
  //       action: function () {
  //         $("#tblServiceLogList").DataTable().ajax.reload();
  //       },
  //       language: { search: "", searchPlaceholder: "Search List..." },
  //       fnDrawCallback: function (oSettings) {
  //       },
  //       fnInitComplete: function () {
  //         $(
  //           "<button class='btn btn-primary btnSearchFixedAccount' type='button' id='btnSearchFixedAccount' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
  //         ).insertAfter("#tblServiceLogList_filter");
  //       },
  //     })
  //       .on("page", function () {
  //         let draftRecord = templateObject.datatablerecords.get();
  //         templateObject.datatablerecords.set(draftRecord);
  //       })
  //       .on("column-reorder", function () { })
  //       .on("length.dt", function (e, settings, len) {
  //       });
  //   }, 10);
  // }

});

Template.serviceloglisttable.events({

  "click #btnNewServiceLog": function() {
    FlowRouter.go('/servicelogcard');
  }
});

Template.serviceloglisttable.helpers({
  // datatablerecords: () => {
  //   return Template.instance().datatablerecords.get().sort(function (a, b) {
  //     if (a.assetCode === "NA") {
  //       return 1;
  //     } else if (b.assetCode === "NA") {
  //       return -1;
  //     }
  //     return a.assetCode.toUpperCase() > b.assetCode.toUpperCase() ? 1 : -1;
  //   });
  // },
  // // custom fields displaysettings
  // displayfields: () => {
  //   return Template.instance().displayfields.get();
  // },
});
