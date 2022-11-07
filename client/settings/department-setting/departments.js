import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.departmentSettings.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.roomrecords = new ReactiveVar([]);

    templateObject.departlist = new ReactiveVar([]);
});

Template.departmentSettings.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];


    function MakeNegative() {
        $('td').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.getAllEmployees = function () {

      getVS1Data('TEmployee').then(function (dataObject) {
        if(dataObject.length == 0){
          taxRateService.getEmployees().then(function (data) {
              let employeeList = [];
              for (let i = 0; i < data.temployee.length; i++) {

                  let dataObj = {
                      empID: data.temployee[i].Id || ' ',
                      employeename: data.temployee[i].EmployeeName || ' '
                  };
                  if(data.temployee[i].EmployeeName.replace(/\s/g, '') != ''){
                      employeeList.push(dataObj);
                  }
              }
              templateObject.employeerecords.set(employeeList);
          });
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.temployee;
        let employeeList = [];
        for (let i = 0; i < useData.length; i++) {

            let dataObj = {
                empID: useData[i].fields.ID || ' ',
                employeename: useData[i].fields.EmployeeName || ' '
            };
            if(useData[i].fields.EmployeeName.replace(/\s/g, '') != ''){
                employeeList.push(dataObj);
            }
        }
        templateObject.employeerecords.set(employeeList);

        }
        }).catch(function (err) {
          taxRateService.getEmployees().then(function (data) {
              let employeeList = [];
              for (let i = 0; i < data.temployee.length; i++) {

                  let dataObj = {
                      empID: data.temployee[i].Id || ' ',
                      employeename: data.temployee[i].EmployeeName || ' '
                  };
                  if(data.temployee[i].EmployeeName.replace(/\s/g, '') != ''){
                      employeeList.push(dataObj);
                  }
              }
              templateObject.employeerecords.set(employeeList);
          });
        });


    };
    templateObject.getAllEmployees();

//     templateObject.getRooms = function () {
//
//         taxRateService.getBins().then(function (data) {
//             let binList = [];
//             for (let i = 0; i < data.tproductbin.length; i++) {
//
//                 let dataObj = {
//                     roomid: data.tproductbin[i].BinNumber || ' ',
//                     roomname: data.tproductbin[i].BinLocation || ' '
//                 };
//                 if(data.tproductbin[i].BinLocation.replace(/\s/g, '') != ''){
//                     binList.push(dataObj);
//                 }
//
//             }
//             templateObject.roomrecords.set(binList);
//         });
//     };
//     templateObject.getRooms();
//
//     templateObject.getDeptList = function () {
//       getVS1Data('TDeptClass').then(function (dataObject) {
//         if(dataObject.length == 0){
//           taxRateService.getDepartment().then(function (data) {
//               let deptList = [];
//               for (let i = 0; i < data.tdeptclass.length; i++) {
//
//                   let dataObject = {
//                       departid: data.tdeptclass[i].Id || ' ',
//                       deptname: data.tdeptclass[i].DeptClassName || ' ',
//                   };
//
//                   if(data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != ''){
//                       deptList.push(dataObject);
//                   }
//
//               }
//               templateObject.departlist.set(deptList);
//           });
//         }else{
//         let data = JSON.parse(dataObject[0].data);
//         let useData = data.tdeptclass;
//         let deptList = [];
//         for (let i = 0; i < data.tdeptclass.length; i++) {
//
//             let dataObject = {
//                 departid: useData[i].Id || ' ',
//                 deptname: useData[i].DeptClassName || ' ',
//             };
//
//             if(data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != ''){
//                 deptList.push(dataObject);
//             }
//
//         }
//         templateObject.departlist.set(deptList);
//
//         }
//       }).catch(function (err) {
//         taxRateService.getDepartment().then(function (data) {
//             let deptList = [];
//             for (let i = 0; i < data.tdeptclass.length; i++) {
//
//                 let dataObject = {
//                     departid: data.tdeptclass[i].Id || ' ',
//                     deptname: data.tdeptclass[i].DeptClassName || ' ',
//                 };
//
//                 if(data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != ''){
//                     deptList.push(dataObject);
//                 }
//
//             }
//             templateObject.departlist.set(deptList);
//         });
//       });
//
//     };
//     templateObject.getDeptList();
//
//     templateObject.getTaxRates = function () {
//       getVS1Data('TDeptClass').then(function (dataObject) {
//         if(dataObject.length == 0){
//           taxRateService.getDepartment().then(function (data) {
//               let lineItems = [];
//               let lineItemObj = {};
//               for(let i=0; i<data.tdeptclass.length; i++){
//                   // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
//                   var dataList = {
//                       id: data.tdeptclass[i].Id || '',
//                       headDept: data.tdeptclass[i].DeptClassGroup || '-',
//                       departmentName: data.tdeptclass[i].DeptClassName || '-',
//                       description: data.tdeptclass[i].Description || '-',
//                       sitecode:data.tdeptclass[i].SiteCode || '-',
//                       status:data.tdeptclass[i].Active || 'false',
//
//
//                   };
//
//                   dataTableList.push(dataList);
//                   //}
//               }
//
//               templateObject.datatablerecords.set(dataTableList);
//
//               if(templateObject.datatablerecords.get()){
//
//                   Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'departmentList', function(error, result){
//                       if(error){
//
//                       }else{
//                           if(result){
//                               for (let i = 0; i < result.customFields.length; i++) {
//                                   let customcolumn = result.customFields;
//                                   let columData = customcolumn[i].label;
//                                   let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
//                                   let hiddenColumn = customcolumn[i].hidden;
//                                   let columnClass = columHeaderUpdate.split('.')[1];
//                                   let columnWidth = customcolumn[i].width;
//                                   let columnindex = customcolumn[i].index + 1;
//
//                                   if(hiddenColumn == true){
//
//                                       $("."+columnClass+"").addClass('hiddenColumn');
//                                       $("."+columnClass+"").removeClass('showColumn');
//                                   }else if(hiddenColumn == false){
//                                       $("."+columnClass+"").removeClass('hiddenColumn');
//                                       $("."+columnClass+"").addClass('showColumn');
//                                   }
//
//                               }
//                           }
//
//                       }
//                   });
//
//
//                   setTimeout(function () {
//                       MakeNegative();
//                   }, 100);
//               }
//
//               $('.fullScreenSpin').css('display','none');
//               setTimeout(function () {
//                   $('#departmentList').DataTable({
//                       columnDefs: [
//                           {type: 'date', targets: 0},
//                           { "orderable": false, "targets": -1 }
//                       ],
//                       "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
//                       buttons: [
//                           {
//                               extend: 'excelHtml5',
//                               text: '',
//                               download: 'open',
//                               className: "btntabletocsv hiddenColumn",
//                               filename: "departmentlist_"+ moment().format(),
//                               orientation:'portrait',
//                               exportOptions: {
//                                   columns: ':visible'
//                               }
//                           },{
//                               extend: 'print',
//                               download: 'open',
//                               className: "btntabletopdf hiddenColumn",
//                               text: '',
//                               title: 'Department List',
//                               filename: "departmentlist_"+ moment().format(),
//                               exportOptions: {
//                                   columns: ':visible'
//                               }
//                           }],
//                       select: true,
//                       destroy: true,
//                       colReorder: true,
//                       colReorder: {
//                           fixedColumnsRight: 1
//                       },
//                       // bStateSave: true,
//                       // rowId: 0,
//                       paging: false,
// //                      "scrollY": "400px",
// //                      "scrollCollapse": true,
//                       info: true,
//                       responsive: true,
//                       "order": [[ 0, "asc" ]],
//                       action: function () {
//                           $('#departmentList').DataTable().ajax.reload();
//                       },
//                       language: { search: "",searchPlaceholder: "Search List..." },
//                       "fnInitComplete": function() {
//                        this.fnPageChange('last');
//                          $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#departmentList_filter");
//
//                        $("<button class='btn btn-primary btnRefreshdepartmentList' type='button' id='btnRefreshdepartmentList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#departmentList_filter");
//                       },
//
//
//                       "fnDrawCallback": function (oSettings) {
//                           setTimeout(function () {
//                               MakeNegative();
//                           }, 100);
//                       },
//
//                   }).on('page', function () {
//                       setTimeout(function () {
//                           MakeNegative();
//                       }, 100);
//                       let draftRecord = templateObject.datatablerecords.get();
//                       templateObject.datatablerecords.set(draftRecord);
//                   }).on('column-reorder', function () {
//
//                   }).on( 'length.dt', function ( e, settings, len ) {
//                       setTimeout(function () {
//                           MakeNegative();
//                       }, 100);
//                   });
//
//                   // $('#departmentList').DataTable().column( 0 ).visible( true );
//                   $('.fullScreenSpin').css('display','none');
//               }, 0);
//
//               var columns = $('#departmentList th');
//               let sTible = "";
//               let sWidth = "";
//               let sIndex = "";
//               let sVisible = "";
//               let columVisible = false;
//               let sClass = "";
//               $.each(columns, function(i,v) {
//                   if(v.hidden == false){
//                       columVisible =  true;
//                   }
//                   if((v.className.includes("hiddenColumn"))){
//                       columVisible = false;
//                   }
//                   sWidth = v.style.width.replace('px', "");
//
//                   let datatablerecordObj = {
//                       sTitle: v.innerText || '',
//                       sWidth: sWidth || '',
//                       sIndex: v.cellIndex || '',
//                       sVisible: columVisible || false,
//                       sClass: v.className || ''
//                   };
//                   tableHeaderList.push(datatablerecordObj);
//               });
//               templateObject.tableheaderrecords.set(tableHeaderList);
//               $('div.dataTables_filter input').addClass('form-control form-control-sm');
//
//           }).catch(function (err) {
//               swal({
//                   title: 'Oooops...',
//                   text: err,
//                   type: 'error',
//                   showCancelButton: false,
//                   confirmButtonText: 'Try Again'
//               }).then((result) => {
//                   if (result.value) {
//                       Meteor._reload.reload();
//                   } else if (result.dismiss === 'cancel') {
//
//                   }
//               });
//               $('.fullScreenSpin').css('display','none');
//               // Meteor._reload.reload();
//           });
//         }else{
//         let data = JSON.parse(dataObject[0].data);
//         let useData = data.tdeptclass;
//         let lineItems = [];
//         let lineItemObj = {};
//         for(let i=0; i<useData.length; i++){
//             // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
//             var dataList = {
//                 id: useData[i].Id|| '',
//                 headDept: useData[i].DeptClassGroup || '-',
//                 departmentName: useData[i].DeptClassName || '-',
//                 description: useData[i].Description || '-',
//                 sitecode:useData[i].SiteCode || '-',
//                 status:useData[i].Active || 'false',
//
//
//             };
//
//             dataTableList.push(dataList);
//             //}
//         }
//
//         templateObject.datatablerecords.set(dataTableList);
//
//         if(templateObject.datatablerecords.get()){
//
//             Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'departmentList', function(error, result){
//                 if(error){
//
//                 }else{
//                     if(result){
//                         for (let i = 0; i < result.customFields.length; i++) {
//                             let customcolumn = result.customFields;
//                             let columData = customcolumn[i].label;
//                             let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
//                             let hiddenColumn = customcolumn[i].hidden;
//                             let columnClass = columHeaderUpdate.split('.')[1];
//                             let columnWidth = customcolumn[i].width;
//                             let columnindex = customcolumn[i].index + 1;
//
//                             if(hiddenColumn == true){
//
//                                 $("."+columnClass+"").addClass('hiddenColumn');
//                                 $("."+columnClass+"").removeClass('showColumn');
//                             }else if(hiddenColumn == false){
//                                 $("."+columnClass+"").removeClass('hiddenColumn');
//                                 $("."+columnClass+"").addClass('showColumn');
//                             }
//
//                         }
//                     }
//
//                 }
//             });
//
//
//             setTimeout(function () {
//                 MakeNegative();
//             }, 100);
//         }
//
//         $('.fullScreenSpin').css('display','none');
//         setTimeout(function () {
//             $('#departmentList').DataTable({
//                 columnDefs: [
//                     {type: 'date', targets: 0},
//                     { "orderable": false, "targets": -1 }
//                 ],
//                 "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
//                 buttons: [
//                     {
//                         extend: 'excelHtml5',
//                         text: '',
//                         download: 'open',
//                         className: "btntabletocsv hiddenColumn",
//                         filename: "departmentlist_"+ moment().format(),
//                         orientation:'portrait',
//                         exportOptions: {
//                             columns: ':visible'
//                         }
//                     },{
//                         extend: 'print',
//                         download: 'open',
//                         className: "btntabletopdf hiddenColumn",
//                         text: '',
//                         title: 'Department List',
//                         filename: "departmentlist_"+ moment().format(),
//                         exportOptions: {
//                             columns: ':visible'
//                         }
//                     }],
//                 select: true,
//                 destroy: true,
//                 colReorder: true,
//                 colReorder: {
//                     fixedColumnsRight: 1
//                 },
//                 // bStateSave: true,
//                 // rowId: 0,
//                 paging: false,
// //                "scrollY": "400px",
// //                "scrollCollapse": true,
//                 info: true,
//                 responsive: true,
//                 "order": [[ 0, "asc" ]],
//                 action: function () {
//                     $('#departmentList').DataTable().ajax.reload();
//                 },
//                 language: { search: "",searchPlaceholder: "Search List..." },
//                 "fnInitComplete": function() {
//                 	this.fnPageChange('last');
//                 	  $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#departmentList_filter");
//
//                 	$("<button class='btn btn-primary btnRefreshdepartmentList' type='button' id='btnRefreshdepartmentList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#departmentList_filter");
//                 },
//
//
//                 "fnDrawCallback": function (oSettings) {
//                     setTimeout(function () {
//                         MakeNegative();
//                     }, 100);
//                 },
//
//             }).on('page', function () {
//                 setTimeout(function () {
//                     MakeNegative();
//                 }, 100);
//                 let draftRecord = templateObject.datatablerecords.get();
//                 templateObject.datatablerecords.set(draftRecord);
//             }).on('column-reorder', function () {
//
//             }).on( 'length.dt', function ( e, settings, len ) {
//                 setTimeout(function () {
//                     MakeNegative();
//                 }, 100);
//             });
//
//             // $('#departmentList').DataTable().column( 0 ).visible( true );
//             $('.fullScreenSpin').css('display','none');
//         }, 0);
//
//         var columns = $('#departmentList th');
//         let sTible = "";
//         let sWidth = "";
//         let sIndex = "";
//         let sVisible = "";
//         let columVisible = false;
//         let sClass = "";
//         $.each(columns, function(i,v) {
//             if(v.hidden == false){
//                 columVisible =  true;
//             }
//             if((v.className.includes("hiddenColumn"))){
//                 columVisible = false;
//             }
//             sWidth = v.style.width.replace('px', "");
//
//             let datatablerecordObj = {
//                 sTitle: v.innerText || '',
//                 sWidth: sWidth || '',
//                 sIndex: v.cellIndex || '',
//                 sVisible: columVisible || false,
//                 sClass: v.className || ''
//             };
//             tableHeaderList.push(datatablerecordObj);
//         });
//         templateObject.tableheaderrecords.set(tableHeaderList);
//         $('div.dataTables_filter input').addClass('form-control form-control-sm');
//         }
//       }).catch(function (err) {
//         taxRateService.getDepartment().then(function (data) {
//             let lineItems = [];
//             let lineItemObj = {};
//             for(let i=0; i<data.tdeptclass.length; i++){
//                 // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
//                 var dataList = {
//                     id: data.tdeptclass[i].Id || '',
//                     headDept: data.tdeptclass[i].DeptClassGroup || '-',
//                     departmentName: data.tdeptclass[i].DeptClassName || '-',
//                     description: data.tdeptclass[i].Description || '-',
//                     sitecode:data.tdeptclass[i].SiteCode || '-',
//                     status:data.tdeptclass[i].Active || 'false',
//
//
//                 };
//
//                 dataTableList.push(dataList);
//                 //}
//             }
//
//             templateObject.datatablerecords.set(dataTableList);
//
//             if(templateObject.datatablerecords.get()){
//
//                 Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'departmentList', function(error, result){
//                     if(error){
//
//                     }else{
//                         if(result){
//                             for (let i = 0; i < result.customFields.length; i++) {
//                                 let customcolumn = result.customFields;
//                                 let columData = customcolumn[i].label;
//                                 let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
//                                 let hiddenColumn = customcolumn[i].hidden;
//                                 let columnClass = columHeaderUpdate.split('.')[1];
//                                 let columnWidth = customcolumn[i].width;
//                                 let columnindex = customcolumn[i].index + 1;
//
//                                 if(hiddenColumn == true){
//
//                                     $("."+columnClass+"").addClass('hiddenColumn');
//                                     $("."+columnClass+"").removeClass('showColumn');
//                                 }else if(hiddenColumn == false){
//                                     $("."+columnClass+"").removeClass('hiddenColumn');
//                                     $("."+columnClass+"").addClass('showColumn');
//                                 }
//
//                             }
//                         }
//
//                     }
//                 });
//
//
//                 setTimeout(function () {
//                     MakeNegative();
//                 }, 100);
//             }
//
//             $('.fullScreenSpin').css('display','none');
//             setTimeout(function () {
//                 $('#departmentList').DataTable({
//                     columnDefs: [
//                         {type: 'date', targets: 0},
//                         { "orderable": false, "targets": -1 }
//                     ],
//                     "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
//                     buttons: [
//                         {
//                             extend: 'excelHtml5',
//                             text: '',
//                             download: 'open',
//                             className: "btntabletocsv hiddenColumn",
//                             filename: "departmentlist_"+ moment().format(),
//                             orientation:'portrait',
//                             exportOptions: {
//                                 columns: ':visible'
//                             }
//                         },{
//                             extend: 'print',
//                             download: 'open',
//                             className: "btntabletopdf hiddenColumn",
//                             text: '',
//                             title: 'Department List',
//                             filename: "departmentlist_"+ moment().format(),
//                             exportOptions: {
//                                 columns: ':visible'
//                             }
//                         }],
//                     select: true,
//                     destroy: true,
//                     colReorder: true,
//                     colReorder: {
//                         fixedColumnsRight: 1
//                     },
//                     // bStateSave: true,
//                     // rowId: 0,
//                     paging: false,
// //                    "scrollY": "400px",
// //                    "scrollCollapse": true,
//                     info: true,
//                     responsive: true,
//                     "order": [[ 0, "asc" ]],
//                     action: function () {
//                         $('#departmentList').DataTable().ajax.reload();
//                     },
//                     language: { search: "",searchPlaceholder: "Search List..." },
//                     "fnInitComplete": function() {
//                     	this.fnPageChange('last');
//                     	  $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#departmentList_filter");
//
//                     	$("<button class='btn btn-primary btnRefreshdepartmentList' type='button' id='btnRefreshdepartmentList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#departmentList_filter");
//                     },
//
//
//
//                     "fnDrawCallback": function (oSettings) {
//                         setTimeout(function () {
//                             MakeNegative();
//                         }, 100);
//                     },
//
//                 }).on('page', function () {
//                     setTimeout(function () {
//                         MakeNegative();
//                     }, 100);
//                     let draftRecord = templateObject.datatablerecords.get();
//                     templateObject.datatablerecords.set(draftRecord);
//                 }).on('column-reorder', function () {
//
//                 }).on( 'length.dt', function ( e, settings, len ) {
//                     setTimeout(function () {
//                         MakeNegative();
//                     }, 100);
//                 });
//
//                 // $('#departmentList').DataTable().column( 0 ).visible( true );
//                 $('.fullScreenSpin').css('display','none');
//             }, 0);
//
//             var columns = $('#departmentList th');
//             let sTible = "";
//             let sWidth = "";
//             let sIndex = "";
//             let sVisible = "";
//             let columVisible = false;
//             let sClass = "";
//             $.each(columns, function(i,v) {
//                 if(v.hidden == false){
//                     columVisible =  true;
//                 }
//                 if((v.className.includes("hiddenColumn"))){
//                     columVisible = false;
//                 }
//                 sWidth = v.style.width.replace('px', "");
//
//                 let datatablerecordObj = {
//                     sTitle: v.innerText || '',
//                     sWidth: sWidth || '',
//                     sIndex: v.cellIndex || '',
//                     sVisible: columVisible || false,
//                     sClass: v.className || ''
//                 };
//                 tableHeaderList.push(datatablerecordObj);
//             });
//             templateObject.tableheaderrecords.set(tableHeaderList);
//             $('div.dataTables_filter input').addClass('form-control form-control-sm');
//
//         }).catch(function (err) {
//             swal({
//                 title: 'Oooops...',
//                 text: err,
//                 type: 'error',
//                 showCancelButton: false,
//                 confirmButtonText: 'Try Again'
//             }).then((result) => {
//                 if (result.value) {
//                     Meteor._reload.reload();
//                 } else if (result.dismiss === 'cancel') {
//
//                 }
//             });
//             $('.fullScreenSpin').css('display','none');
//             // Meteor._reload.reload();
//         });
//       });
//
//     }
//     templateObject.getTaxRates();
//
//     templateObject.getDepartments = function(){
//       getVS1Data('TDeptClass').then(function (dataObject) {
//         if(dataObject.length == 0){
//           taxRateService.getDepartment().then(function(data){
//               for(let i in data.tdeptclass){
//
//                   let deptrecordObj = {
//                       id: data.tdeptclass[i].Id || ' ',
//                       department: data.tdeptclass[i].DeptClassName || ' ',
//                   };
//
//                   deptrecords.push(deptrecordObj);
//                   templateObject.deptrecords.set(deptrecords);
//
//               }
//           });
//         }else{
//         let data = JSON.parse(dataObject[0].data);
//         let useData = data.tdeptclass;
//         for(let i in useData){
//
//             let deptrecordObj = {
//                 id: useData[i].Id || ' ',
//                 department: useData[i].DeptClassName || ' ',
//             };
//
//             deptrecords.push(deptrecordObj);
//             templateObject.deptrecords.set(deptrecords);
//
//         }
//
//         }
//       }).catch(function (err) {
//         taxRateService.getDepartment().then(function(data){
//             for(let i in data.tdeptclass){
//
//                 let deptrecordObj = {
//                     id: data.tdeptclass[i].Id || ' ',
//                     department: data.tdeptclass[i].DeptClassName || ' ',
//                 };
//
//                 deptrecords.push(deptrecordObj);
//                 templateObject.deptrecords.set(deptrecords);
//
//             }
//         });
//       });
//
//
//     }
//     templateObject.getDepartments();

    // $(document).on('click', '.table-remove', function() {
    //     event.stopPropagation();
    //     event.stopPropagation();
    //     var targetID = $(event.target).closest('tr').attr('id'); // table row ID
    //     $('#selectDeleteLineID').val(targetID);
    //     $('#deleteLineModal').modal('toggle');
    //     // if ($('.departmentList tbody>tr').length > 1) {
    //     // // if(confirm("Are you sure you want to delete this row?")) {
    //     // this.click;
    //     // $(this).closest('tr').remove();
    //     // //} else { }
    //     // event.preventDefault();
    //     // return false;
    //     // }
    // });

    $('#tblDepartmentList tbody').on( 'click', 'tr', function () {
        var listData = $(this).closest('tr').attr('id');
        if(listData){
            $('#add-dept-title').text('Edit Department');
            if (listData !== '') {
                listData = Number(listData);
                //taxRateService.getOneDepartment(listData).then(function (data) {

                    var deptID = listData || '';
                    //var headerDept = data.fields.DeptClassGroup || '';
                    var deptName = $(event.target).closest("tr").find(".colDeptName").text() || '';
                    var deptDesc = $(event.target).closest("tr").find(".colDescription").text() || '';
                    var siteCode = $(event.target).closest("tr").find(".colSiteCode").text() || '';
                    //data.fields.Rate || '';

                    //alert(deptDesc);

                    $('#edtDepartmentID').val(deptID);
                    //$('#sltDepartment').val(headerDept);
                    $('#edtDeptName').val(deptName);
                    $('#edtDeptName').prop('readonly', true);
                    $('#txaDescription').val(deptDesc);
                    $('#edtSiteCode').val(siteCode);

                $(this).closest('tr').attr('data-target', '#myModalDepartment');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });
});


Template.departmentSettings.events({
    'click #btnNewInvoice':function(event){
        // FlowRouter.go('/invoicecard');
    },
    "click .printConfirm": function (event) {
      $(".fullScreenSpin").css("display", "inline-block");
      jQuery("#tblDepartmentList_wrapper .dt-buttons .btntabletopdf").click();
      $(".fullScreenSpin").css("display", "none");
    },
    'click #exportbtn': function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblDepartmentList_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .btnRefresh': function () {
      $('.fullScreenSpin').css('display','inline-block');
      sideBarService.getDepartmentDataList(initialBaseDataLoad, 0,false).then(function (dataReload) {
          addVS1Data('TDepartment', JSON.stringify(dataReload)).then(function (datareturn) {
         location.reload(true);
          }).catch(function (err) {
             location.reload(true);
          });
      });
    },
    'click .btnAddNewDepart': function () {
        $('#newTaxRate').css('display','block');

    },
    'click .btnCloseAddNewDept': function () {
        playCancelAudio();
        setTimeout(function(){
        $('#newTaxRate').css('display','none');
        }, delayTimeAfterSound);
    },
    'click .btnDeleteDept': function () {
        playDeleteAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');
        let deptId = $('#edtDepartmentID').val();

        let objDetails = {
            type: "TDeptClass",
            fields: {
                Id: deptId,
                Active: false
            }
        };

        taxRateService.saveDepartment(objDetails).then(function (objDetails) {
            sideBarService.getDepartmentDataList(initialBaseDataLoad, 0,true).then(function (dataReload) {
                addVS1Data('TDepartment', JSON.stringify(dataReload)).then(function (datareturn) {
               Meteor._reload.reload();
            }).catch(function (err) {
               Meteor._reload.reload();
            });
        });

        }).catch(function (err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        });
    }, delayTimeAfterSound);
    },
    'click .btnSaveDept': function () {
        playSaveAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display','inline-block');
        
        let deptID = $('#edtDepartmentID').val()||0;
        //let headerDept = $('#sltDepartment').val();
        let deptName = $('#edtDeptName').val()||'';
        if (deptName === ''){
        swal('Department name cannot be blank!', '', 'warning');
        $('.fullScreenSpin').css('display','none');
        e.preventDefault();
        }

        let deptDesc = $('#txaDescription').val()||'';
        let siteCode = $('#edtSiteCode').val()||'';
        let checkDeptID ='';
        let objDetails = '';
        let objStSDetails = null;

        if (isModuleGreenTrack) {

            let sltMainContact = $('#sltMainContact').val();
            let stsMainContactNo = $('#stsMainContactNo').val();
            let stsLicenseNo = $('#stsLicenseNo').val();
            let sltDefaultRoomName = $('#sltDefaultRoom').val();
            var newbinnum = $("#sltDefaultRoom").find('option:selected').attr('mytagroom');
            objStSDetails = {
                type: "TStSClass",
                fields: {
                    DefaultBinLocation: sltDefaultRoomName || '',
                    DefaultBinNumber: newbinnum || '',
                    LicenseNumber: stsLicenseNo || '',
                    PrincipleContactName: sltMainContact || '',
                    PrincipleContactPhone: stsMainContactNo || ''
                }
            }
        }

        if (deptName === ''){
            Bert.alert('<strong>WARNING:</strong> Department Name cannot be blank!', 'warning');
            e.preventDefault();
        }

        if(deptID == ""){

            taxRateService.checkDepartmentByName(deptName).then(function (data) {
                deptID = data.tdeptclass[0].Id;
                objDetails = {
                    type: "TDeptClass",
                    fields: {
                        ID: parseInt(deptID)||0,
                        Active: true,
                        //DeptClassGroup: headerDept,
                        DeptClassName: deptName,
                        Description: deptDesc,
                        SiteCode: siteCode,
                        StSClass: objStSDetails
                    }
                };

                taxRateService.saveDepartment(objDetails).then(function (objDetails) {
                  sideBarService.getDepartment().then(function(dataReload) {
                      addVS1Data('TDeptClass',JSON.stringify(dataReload)).then(function (datareturn) {
                      location.reload(true);
                      }).catch(function (err) {
                        location.reload(true);
                      });
                  }).catch(function(err) {
                      location.reload(true);
                  });
                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            // Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display','none');
                });

            }).catch(function (err) {
                objDetails = {
                    type: "TDeptClass",
                    fields: {
                        Active: true,
                        DeptClassName: deptName,
                        Description: deptDesc,
                        SiteCode: siteCode,
                        StSClass: objStSDetails
                    }
                };

                taxRateService.saveDepartment(objDetails).then(function (objDetails) {
                  sideBarService.getDepartment().then(function(dataReload) {
                      addVS1Data('TDeptClass',JSON.stringify(dataReload)).then(function (datareturn) {
                      location.reload(true);
                      }).catch(function (err) {
                        location.reload(true);
                      });
                  }).catch(function(err) {
                      location.reload(true);
                  });
                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            // Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display','none');
                });
            });

        }else{
            objDetails = {
                type: "TDeptClass",
                fields: {
                    ID: parseInt(deptID),
                    Active: true,
                    //  DeptClassGroup: headerDept,
                    DeptClassName: deptName,
                    Description: deptDesc,
                    SiteCode: siteCode,
                    StSClass: objStSDetails
                }
            };

            taxRateService.saveDepartment(objDetails).then(function (objDetails) {
              sideBarService.getDepartment().then(function(dataReload) {
                  addVS1Data('TDeptClass',JSON.stringify(dataReload)).then(function (datareturn) {
                  location.reload(true);
                  }).catch(function (err) {
                    location.reload(true);
                  });
              }).catch(function(err) {
                  location.reload(true);
              });
            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display','none');
            });
        }
    }, delayTimeAfterSound);
    },
    'click .btnAddDept': function () {
        $('#add-dept-title').text('Add New Department');
        $('#edtDepartmentID').val('');
        $('#edtSiteCode').val('');
        $('#edtDeptName').val('');
        $('#edtDeptName').prop('readonly', false);
        $('#edtDeptDesc').val('');
    },
    'click .btnBack':function(event){
        playCancelAudio();
        event.preventDefault();
        setTimeout(function(){
        history.back(1);
        }, delayTimeAfterSound);
    },
    'keydown #edtSiteCode, keyup #edtSiteCode': function(event){
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {

        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {
            event.preventDefault();
        } else {
            //event.preventDefault();
        }

    },
    'blur #edtSiteCode': function(event){
        $(event.target).val($(event.target).val().toUpperCase());

    },
    'click .btnSaveRoom': function () {
        playSaveAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display','inline-block');

        var parentdept = $('#sltDepartmentList').val();
        var newroomname = $('#newRoomName').val();
        var newroomnum = $('#newRoomNum').val();


        let data = '';

        data = {
            type: "TProductBin",
            fields: {
                BinClassName: parentdept|| '',
                BinLocation: newroomname|| '',
                BinNumber: newroomnum|| ''
            }
        };


        taxRateService.saveRoom(data).then(function (data) {
            window.open('/departmentSettings','_self');
        }).catch(function (err) {

            $('.fullScreenSpin').css('display','none');
        });
    }, delayTimeAfterSound);
    },
});

Template.departmentSettings.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.headDept == 'NA') {
                return 1;
            }
            else if (b.headDept == 'NA') {
                return -1;
            }
            return (a.headDept.toUpperCase() > b.headDept.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'departmentList'});
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b){
            if (a.department == 'NA') {
                return 1;
            }
            else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    isModuleGreenTrack: () => {
        return isModuleGreenTrack;
    },
    listEmployees: () => {
        return Template.instance().employeerecords.get().sort(function(a, b){
            if (a.employeename == 'NA') {
                return 1;
            }
            else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    listBins: () => {
        return Template.instance().roomrecords.get().sort(function(a, b){
            if (a.roomname == 'NA') {
                return 1;
            }
            else if (b.roomname == 'NA') {
                return -1;
            }
            return (a.roomname.toUpperCase() > b.roomname.toUpperCase()) ? 1 : -1;
        });
    },
    listDept: () => {
        return Template.instance().departlist.get().sort(function(a, b){
            if (a.deptname == 'NA') {
                return 1;
            }
            else if (b.deptname == 'NA') {
                return -1;
            }
            return (a.deptname.toUpperCase() > b.deptname.toUpperCase()) ? 1 : -1;
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
