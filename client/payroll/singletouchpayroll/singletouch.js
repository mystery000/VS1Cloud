import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../../js/core-service';
import {
    UtilityService
} from "../../utility-service";
import {
    ContactService
} from "../../contacts/contact-service";
import {
    ProductService
} from "../../product/product-service";
import {
    SideBarService
} from '../../js/sidebar-service';
import 'jquery-editable-select';
import CachedHttp from '../../lib/global/CachedHttp';
import erpObject from '../../lib/global/erp-objects';
import index from "magento-api-rest";
import {Template} from 'meteor/templating';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import './singletouch.html';
let utilityService = new UtilityService();
let sideBarService = new SideBarService();

Template.singletouch.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.custfields = new ReactiveVar([]);
    templateObject.displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
});

Template.singletouch.onRendered(function() {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let contactService = new ContactService();
    const dataTableList = [];
    const tableHeaderList = [];
    var splashArraySTPList = new Array();

    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    }
    $('#tblSingleTouchPayroll tbody').on( 'click', 'tr', function () {
        const listData = $(this).closest('tr').attr('id');
        if(listData){
            FlowRouter.go('/singletouchpayroll?id=' + listData);
        }
    });
    checkSetupFinished();
    // function init_reset_data() {
    //     let reset_data = [
    //         { index: 0, label: "SortDate", class: "SortDate", active: false, display: false, width: "0" },
    //         { index: 1, label: "ID", class: "ID", active: true, display: true, width: "" },
    //         { index: 2, label: "Date", class: "Date", active: true, display: true, width: "" },
    //         { index: 3, label: "Earnings", class: "Earnings", active: true, display: true, width: "" },
    //         { index: 4, label: "PAYG", class: "PAYG", active: true, display: true, width: "" },
    //         { index: 5, label: "Supperannuation", class: "Supperannuation", active: true, display: true, width: "" },
    //         { index: 6, label: "Net Pay", class: "NetPay", active: true, display: true, width: "" },
    //         { index: 7, label: "Status", class: "Status", active: true, display: true, width: "" },
    //     ];
    //     let templateObject = Template.instance();
    //     templateObject.reset_data.set(reset_data);
    // }
    // init_reset_data();
    //
    // templateObject.initCustomFieldDisplaySettings = function(data, listType){
    //     let templateObject = Template.instance();
    //     let reset_data = templateObject.reset_data.get();
    //     showCustomFieldDisplaySettings(reset_data);
    //
    //     try {
    //         getVS1Data("VS1_Customize").then(function (dataObject) {
    //             if(dataObject.length == 0){
    //                 sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), listType).then(function (data) {
    //                     // reset_data = data.ProcessLog.CustomLayout.Columns;
    //                     reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
    //                     showCustomFieldDisplaySettings(reset_data);
    //                 }).catch(function (err) {
    //                 });
    //             } else {
    //                 let data = JSON.parse(dataObject[0].data);
    //                 if(data.ProcessLog.Obj.CustomLayout.lenth > 0){
    //                     for(let i=0; i<data.ProcessLog.Obj.CustomLayout.lenth; i++){
    //                         if(data.ProcessLog.Obj.CustomLayout[i].TableName == listType){
    //                             reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
    //                             showCustomFieldDisplaySettings(reset_data);
    //                         }
    //                     }
    //                 }
    //             }
    //         })
    //     } catch (error) {
    //
    //     }
    //
    // }
    // function showCustomFieldDisplaySettings(reset_data) {
    //     let custFields = [];
    //     let customData = [];
    //     let customFieldCount = reset_data.length;
    //
    //     for (let i=0; i< customFieldCount; i++){
    //         customData = {
    //             active: reset_data[i].active,
    //             id: reset_data[i].index,
    //             custfieldlabel: reset_data[i].label,
    //             class: reset_data[i].class,
    //             display: reset_data[i].display,
    //             width: reset_data[i].width ? reset_data[i].width : '',
    //         }
    //         custFields.push(customData);
    //     }
    //     templateObject.displayfields.set(custFields);
    // }
    //
    // templateObject.initCustomFieldDisplaySettings("", "tblAllSingleTouchPayroll");
    //
    // templateObject.resetData = function(dataVal) {
    //     location.reload();
    // }
    //
    // templateObject.getSTPData = async  function() {
    //     getVS1Data('TSTPVS1').then(function (dataObject) {
    //         if(dataObject.length == 0){
    //             sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(async function (data) {
    //                 await addVS1Data('TSTPVS1', JSON.stringify(data));
    //                 templateObject.displaySTPData(data);
    //             }).catch(function (err) {
    //
    //             });
    //         } else {
    //             let data = JSON.parse(dataObject[0].data);
    //             templateObject.displaySTPData(data);
    //         }
    //     }).catch(function (err) {
    //         sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(async function (data) {
    //             await addVS1Data('TSTPVS1', JSON.stringify(data));
    //             templateObject.displaySTPData(data);
    //         }).catch(function (err) {
    //
    //         });
    //     })
    // }
    // templateObject.displaySTPData = async function(data){
    //     if (FlowRouter.current().route.path == "/singletouch"){
    //         $('.fullScreenSpin').css('display','none');
    //     }
    //     for(let i=0; i<data.tstpvs1.length;i++){
    //         var datalist = {
    //             id: data.tstpvs1[i].ID || '',
    //             date: data.tstpvs1[i].date || '',
    //             earnings: data.tstpvs1[i].earnings || '',
    //             payg: data.tstpvs1[i].payg || '',
    //             supperannuation: data.tstpvs1[i].supperannuation || '',
    //             netpay: data.tstpvs1[i].netpay || '',
    //             status: data.tstpvs1[i].status || '',
    //         }
    //         dataTableList.push(datalist);
    //         let mobile = contactService.changeMobileFormat(data.tstpvs1[i].fields.Mobile);
    //
    //         var dataListSTP = [
    //             data.tstpvs1[i].fields.ID || '',
    //             data.tstpvs1[i].fields.date || '',
    //             data.tstpvs1[i].fields.earnings || '',
    //             data.tstpvs1[i].fields.payg || '',
    //             data.tstpvs1[i].fields.supperannuation || '',
    //             data.tstpvs1[i].fields.netpay || '',
    //             data.tstpvs1[i].fields.status || '',
    //         ]
    //         splashArraySTPList.push(dataListSTP);
    //     }
    // }


    // custom field display settings
    // const dataTableList = [];
    //
    // var today = moment().format("DD/MM/YYYY");
    // var currentDate = new Date();
    // var begunDate = moment(currentDate).format("DD/MM/YYYY");
    // let fromDateMonth = currentDate.getMonth() + 1;
    // let fromDateDay = currentDate.getDate();
    // if (currentDate.getMonth() + 1 < 10) {
    //     fromDateMonth = "0" + (currentDate.getMonth() + 1);
    // }
    //
    // if (currentDate.getDate() < 10) {
    //     fromDateDay = "0" + currentDate.getDate();
    // }
    // var fromDate =
    //     fromDateDay + "/" + fromDateMonth + "/" + currentDate.getFullYear();

    // $("#date-input,#dateTo,#dateFrom").datepicker({
    //     showOn: 'button',
    //     buttonText: 'Show Date',
    //     buttonImageOnly: true,
    //     buttonImage: '/img/imgCal2.png',
    //     dateFormat: 'dd/mm/yy',
    //     showOtherMonths: true,
    //     selectOtherMonths: true,
    //     changeMonth: true,
    //     changeYear: true,
    //     yearRange: "-90:+10",
    //     onChangeMonthYear: function(year, month, inst){
    //         // Set date to picker
    //         $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
    //         // Hide (close) the picker
    //         // $(this).datepicker('hide');
    //         // // Change ttrigger the on change function
    //         // $(this).trigger('change');
    //     }
    // });
    // $("#dateFrom").val(fromDate);
    // $("#dateTo").val(begunDate);
    // if (FlowRouter.current().queryParams.success) {
    //     $(".btnRefresh").addClass("btnRefreshAlert");
    // }
    // templateObject.resetData = function (dataVal) {
    //     location.reload();
    // };
    // function MakeNegative() {
    //     $('td').each(function () {
    //         if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
    //     });
    // };
    // templateObject.datatablerecords.set(dataTableList);
    // if(templateObject.datatablerecords.get()){
    //     setTimeout(function () {
    //         MakeNegative()
    //     }, 100)
    // }


    // setTimeout(function() {
    //     $('#tblAllSingleTouchPayroll').DataTable({
    //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    //         buttons: [{
    //             extend: 'excelHtml5',
    //             text: '',
    //             download: 'open',
    //             className: "btntabletocsv hiddenColumn",
    //             filename: "taxratelist_" + moment().format(),
    //             orientation: 'portrait',
    //             exportOptions: {
    //                 columns: ':visible'
    //             }
    //         }, {
    //             extend: 'print',
    //             download: 'open',
    //             className: "btntabletopdf hiddenColumn",
    //             text: '',
    //             title: 'Tax Rate List',
    //             filename: "taxratelist_" + moment().format(),
    //             exportOptions: {
    //                 columns: ':visible'
    //             }
    //         }],
    //         select: true,
    //         destroy: true,
    //         colReorder: true,
    //         // colReorder: {
    //         //     fixedColumnsRight: 1
    //         // },
    //         lengthMenu: [
    //             [25, -1],
    //             [25, "All"]
    //         ],
    //         // bStateSave: true,
    //         // rowId: 0,
    //         paging: true,
    //         info: true,
    //         responsive: true,
    //         "order": [
    //             [0, "asc"]
    //         ],
    //         action: function() {
    //             $('#tblAllSingleTouchPayroll').DataTable().ajax.reload();
    //         },
    //         "fnDrawCallback": function(oSettings) {
    //             setTimeout(function() {
    //                 MakeNegative();
    //             }, 100);
    //         },
    //
    //     }).on('page', function() {
    //         setTimeout(function() {
    //             MakeNegative();
    //         }, 100);
    //         let draftRecord = templateObject.datatablerecords.get();
    //         templateObject.datatablerecords.set(draftRecord);
    //     }).on('column-reorder', function() {
    //
    //     }).on('length.dt', function(e, settings, len) {
    //         setTimeout(function() {
    //             MakeNegative();
    //         }, 100);
    //     });
    //
    //     $('.fullScreenSpin').css('display', 'none');
    // }, 0);

//     setTimeout(function() {
//         $('#tblPayRunHistory').DataTable({
//             columnDefs: [{
//                 "orderable": false,
//                 "targets": -1
//             }],
//             "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
//             buttons: [{
//                 extend: 'excelHtml5',
//                 text: '',
//                 download: 'open',
//                 className: "btntabletocsv hiddenColumn",
//                 filename: "taxratelist_" + moment().format(),
//                 orientation: 'portrait',
//                 exportOptions: {
//                     columns: ':visible'
//                 }
//             }, {
//                 extend: 'print',
//                 download: 'open',
//                 className: "btntabletopdf hiddenColumn",
//                 text: '',
//                 title: 'Tax Rate List',
//                 filename: "taxratelist_" + moment().format(),
//                 exportOptions: {
//                     columns: ':visible'
//                 }
//             }],
//             select: true,
//             destroy: true,
//             colReorder: true,
//             colReorder: {
//                 fixedColumnsRight: 1
//             },
//             lengthMenu: [
//                 [25, -1],
//                 [25, "All"]
//             ],
//             // bStateSave: true,
//             // rowId: 0,
//             paging: true,
//             info: true,
//             responsive: true,
//             "order": [
//                 [0, "asc"]
//             ],
//             action: function() {
//                 $('#tblPayRunHistory').DataTable().ajax.reload();
//             },
//             "fnDrawCallback": function(oSettings) {
//                 setTimeout(function() {
//                     MakeNegative();
//                 }, 100);
//             },
//
//         }).on('page', function() {
//             setTimeout(function() {
//                 MakeNegative();
//             }, 100);
//             let draftRecord = templateObject.datatablerecords.get();
//             templateObject.datatablerecords.set(draftRecord);
//         }).on('column-reorder', function() {
//
//         }).on('length.dt', function(e, settings, len) {
//             setTimeout(function() {
//                 MakeNegative();
//             }, 100);
//         });
//
//         $('.fullScreenSpin').css('display', 'none');
//     }, 0);
//
//     setTimeout(function() {
//         $('#tblPayRunList').DataTable({
//             columnDefs: [{
//                 "orderable": false,
//                 "targets": -1
//             }],
//             "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
//             buttons: [{
//                 extend: 'excelHtml5',
//                 text: '',
//                 download: 'open',
//                 className: "btntabletocsv hiddenColumn",
//                 filename: "taxratelist_" + moment().format(),
//                 orientation: 'portrait',
//                 exportOptions: {
//                     columns: ':visible'
//                 }
//             }, {
//                 extend: 'print',
//                 download: 'open',
//                 className: "btntabletopdf hiddenColumn",
//                 text: '',
//                 title: 'Tax Rate List',
//                 filename: "taxratelist_" + moment().format(),
//                 exportOptions: {
//                     columns: ':visible'
//                 }
//             }],
//             select: true,
//             destroy: true,
//             colReorder: true,
//             colReorder: {
//                 fixedColumnsRight: 1
//             },
//             lengthMenu: [
//                 [25, -1],
//                 [25, "All"]
//             ],
//             // bStateSave: true,
//             // rowId: 0,
//             paging: true,
//             info: true,
//             responsive: true,
//             "order": [
//                 [0, "asc"]
//             ],
//             action: function() {
//                 $('#tblPayRunList').DataTable().ajax.reload();
//             },
//             "fnDrawCallback": function(oSettings) {
//                 setTimeout(function() {
//                     MakeNegative();
//                 }, 100);
//             },
//
//         }).on('page', function() {
//             setTimeout(function() {
//                 MakeNegative();
//             }, 100);
//             let draftRecord = templateObject.datatablerecords.get();
//             templateObject.datatablerecords.set(draftRecord);
//         }).on('column-reorder', function() {
//
//         }).on('length.dt', function(e, settings, len) {
//             setTimeout(function() {
//                 MakeNegative();
//             }, 100);
//         });
//
//         $('.fullScreenSpin').css('display', 'none');
//     }, 0);
//
//
//     templateObject.loadSingleTouch = async () => {
//         let data = await CachedHttp.get();
//
//     }
//
});

Template.singletouch.events({
    'click .btnPayRunNext': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/payrundetails');
    },
    'click .btnSingleTouchPayroll': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/singletouchpayroll');
    },
    'click #payrun100': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/singletouchpayroll');
    }

});

Template.singletouch.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            } else if (b.company == 'NA'){
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        })
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    displayfields: () => {
        return Template.instance().displayfields.get();
    },
});
