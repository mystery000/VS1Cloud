import {SalesBoardService} from '../js/sales-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {InvoiceService} from "../invoice/invoice-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import {OrganisationService} from '../js/organisation-service';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-editable-select';


import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './workorderList.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let accountService = new SalesBoardService();
Template.workorderlist.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
})

Template.workorderlist.onRendered (function() {
    const templateObject = Template.instance();

    // templateObject.getWorkorderRecords  =  async function(e) {
        

    //     async function getWorkorders() {
    //         return new Promise(async(resolve, reject)=>{
    //             getVS1Data('TVS1Workorder').then(function(dataObject){
    //                 if(dataObject.length == 0) {
    //                     resolve([])
    //                 } else {
    //                     let data = JSON.parse(dataObject[0].data);
    //                     resolve(data.tvs1workorder)
    //                 }
    //             }).catch(function(e){
    //                 resolve([])
    //             })
    //         })
    //     }
    //     let tempArray = await getWorkorders();
    //     templateObject.datatablerecords.set(tempArray);
        

    //     if (templateObject.datatablerecords.get()) {
    //         Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), 'tblWorkorderList', function (error, result) {
    //             if (error) {
    //             }
    //             else {
    //                 if (result) {
    //                     for (let i = 0; i < result.customFields.length; i++) {
    //                         let customcolumn = result.customFields;
    //                         let columData = customcolumn[i].label;
    //                         let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
    //                         let hiddenColumn = customcolumn[i].hidden;
    //                         let columnClass = columHeaderUpdate.split('.')[1];
    //                         let columnWidth = customcolumn[i].width;
    //                         let columnindex = customcolumn[i].index + 1;

    //                         if (hiddenColumn == true) {

    //                             $("." + columnClass + "").addClass('hiddenColumn');
    //                             $("." + columnClass + "").removeClass('showColumn');
    //                         } else if (hiddenColumn == false) {
    //                             $("." + columnClass + "").removeClass('hiddenColumn');
    //                             $("." + columnClass + "").addClass('showColumn');
    //                         }

    //                     }
    //                 }

    //             }
    //         });

    //         // setTimeout(function () {
    //         //     MakeNegative();
    //         // }, 100);

    //     }

    //     $('.fullScreenSpin').css('display', 'none');
    //     setTimeout(function () {
    //         $('#tblWorkorderList').DataTable({
    //             columnDefs: [{
    //                     type: 'date',
    //                     targets: 0
    //                 }
    //             ],
    //             "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    //             buttons: [{
    //                     extend: 'excelHtml5',
    //                     text: '',
    //                     download: 'open',
    //                     className: "btntabletocsv hiddenColumn",
    //                     filename: "Work order List excel - " + moment().format(),
    //                     orientation: 'portrait',
    //                     exportOptions: {
    //                         columns: ':visible',
    //                         format: {
    //                             body: function (data, row, column) {
    //                                 if (data.includes("</span>")) {
    //                                     var res = data.split("</span>");
    //                                     data = res[1];
    //                                 }

    //                                 return column === 1 ? data.replace(/<.*?>/ig, "") : data;

    //                             }
    //                         }
    //                     }
    //                 }, {
    //                     extend: 'print',
    //                     download: 'open',
    //                     className: "btntabletopdf hiddenColumn",
    //                     text: '',
    //                     title: 'Work Order List',
    //                     filename: "Work Order List - " + moment().format(),
    //                     exportOptions: {
    //                         columns: ':visible',
    //                         stripHtml: false
    //                     }
    //                 }
    //             ],
    //             select: true,
    //             destroy: true,
    //             colReorder: true,
    //             // bStateSave: true,
    //             // rowId: 0,
    //             pageLength: initialDatatableLoad,
    //             "bLengthChange": false,
    //             info: true,
    //             responsive: true,
    //             "order": [[ 0, "desc" ],[ 2, "desc" ]],
    //             action: function () {
    //                 $('#tblProcessOList').DataTable().ajax.reload();
    //             },
    //             "fnDrawCallback": function (oSettings) {
    //                 let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

    //                 $('.paginate_button.page-item').removeClass('disabled');
    //                 $('#tblWorkorderList_ellipsis').addClass('disabled');

    //                 if(oSettings._iDisplayLength == -1){
    //                 if(oSettings.fnRecordsDisplay() > 150){
    //                     $('.paginate_button.page-item.previous').addClass('disabled');
    //                     $('.paginate_button.page-item.next').addClass('disabled');
    //                 }
    //                 }else{

    //                 }
    //                 if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
    //                     $('.paginate_button.page-item.next').addClass('disabled');
    //                 }

    //                 $('.paginate_button.next:not(.disabled)', this.api().table().container())
    //                 .on('click', function(){
    //                     $('.fullScreenSpin').css('display','inline-block');
    //                     let dataLenght = oSettings._iDisplayLength;
    //                     // var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //                     // var dateTo = new Date($("#dateTo").datepicker("getDate"));

    //                     // let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //                     // let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
    //                     // if(data.Params.IgnoreDates == true){
    //                     // sideBarService.getAllTInvoiceListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                     //     getVS1Data('TInvoiceList').then(function (dataObjectold) {
    //                     //     if(dataObjectold.length == 0){

    //                     //     }else{
    //                     //         let dataOld = JSON.parse(dataObjectold[0].data);

    //                     //         var thirdaryData = $.merge($.merge([], dataObjectnew.tinvoicelist), dataOld.tinvoicelist);
    //                     //         let objCombineData = {
    //                     //         Params: dataOld.Params,
    //                     //         tinvoicelist:thirdaryData
    //                     //         }


    //                     //         addVS1Data('TInvoiceList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                     //             templateObject.resetData(objCombineData);
    //                     //         $('.fullScreenSpin').css('display','none');
    //                     //         }).catch(function (err) {
    //                     //         $('.fullScreenSpin').css('display','none');
    //                     //         });

    //                     //     }
    //                     //     }).catch(function (err) {

    //                     //     });

    //                     // }).catch(function(err) {
    //                     //     $('.fullScreenSpin').css('display','none');
    //                     // });
    //                     // }else{
    //                     // sideBarService.getAllTInvoiceListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                     // getVS1Data('TInvoiceList').then(function (dataObjectold) {
    //                     //     if(dataObjectold.length == 0){

    //                     //     }else{
    //                     //     let dataOld = JSON.parse(dataObjectold[0].data);

    //                     //     var thirdaryData = $.merge($.merge([], dataObjectnew.tinvoicelist), dataOld.tinvoicelist);
    //                     //     let objCombineData = {
    //                     //         Params: dataOld.Params,
    //                     //         tinvoicelist:thirdaryData
    //                     //     }


    //                     //         addVS1Data('TInvoiceList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                     //         templateObject.resetData(objCombineData);
    //                     //         $('.fullScreenSpin').css('display','none');
    //                     //         }).catch(function (err) {
    //                     //         $('.fullScreenSpin').css('display','none');
    //                     //         });

    //                     //     }
    //                     // }).catch(function (err) {

    //                     // });

    //                     // }).catch(function(err) {
    //                     // $('.fullScreenSpin').css('display','none');
    //                     // });
    //                     // }
    //                 });

    //                 // setTimeout(function () {
    //                 //     MakeNegative();
    //                 // }, 100);
    //             },
    //             "fnInitComplete": function () {
    //                 this.fnPageChange('last');
    //                 $("<button class='btn btn-primary btnRefreshProcessList' type='button' id='btnRefreshProcessList' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInvoicelist_filter");
    //                 $('.myvarFilterForm').appendTo(".colDateFilter");
    //             },
    //             // "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
    //             //     let countTableData = data.Params.Count || 0; //get count from API data

    //             //     return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
    //             // }

    //         }).on('page', function () {
    //             // setTimeout(function () {
    //             //     MakeNegative();
    //             // }, 100);
    //             let draftRecord = templateObject.datatablerecords.get();
    //             templateObject.datatablerecords.set(draftRecord);
    //         }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
    //             // setTimeout(function () {
    //             //     MakeNegative();
    //             // }, 100);
    //         });

    //         // $('#tblInvoicelist').DataTable().column( 0 ).visible( true );
    //         $('.fullScreenSpin').css('display', 'none');

    //     }, 0);

    //     var columns = $('#tblWorkorderList th');
    //     let sTible = "";
    //     let sWidth = "";
    //     let sIndex = "";
    //     let sVisible = "";
    //     let columVisible = false;
    //     let isCustomField = false;
    //     let sClass = "";
    //     $.each(columns, function (i, v) {
    //         if (v.hidden == false) {
    //             columVisible = true;
    //         }
    //         if ((v.className.includes("hiddenColumn"))) {
    //             columVisible = false;
    //         }

    //         if ((v.className.includes("customFieldColumn"))) {
    //             isCustomField = true;
    //         } else {
    //             isCustomField = false;
    //         }

    //         sWidth = v.style.width.replace('px', "");

    //         let datatablerecordObj = {
    //             custid: $(this).attr("custid") || 0,
    //             sTitle: v.innerText || '',
    //             sWidth: sWidth || '9',
    //             sIndex: v.cellIndex || '',
    //             sVisible: columVisible || false,
    //             sCustomField: isCustomField || false,
    //             sClass: v.className || ''
    //         };
    //         // tableHeaderList.push(datatablerecordObj);
    //     });
    //     // templateObject.tableheaderrecords.set(tableHeaderList);
    //     $('div.dataTables_filter input').addClass('form-control form-control-sm');
    //     $('#tblWorkorderList tbody').on('click', 'tr', function () {
    //         var listData = $(this).closest('tr').find('.colOrderNumber').text();
    //         var id = $(this).closest('tr').find('.colId').text();
    //         FlowRouter.go('/workordercard?id='+id)

    //     });

    //     // templateObject.getCustomFieldData();
    // }
    // templateObject.getWorkorderRecords();

 

});

Template.workorderlist.helpers ({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get();
    },
    selectedInventoryAssetAccount: () => {
        return Template.instance().selectedInventoryAssetAccount.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    }

})


Template.workorderlist.events({
    // 'click .chkDatatable' : function(event){
    //     var columns = $('#tblWorkorderList th');
    //     let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

    //     $.each(columns, function(i,v) {
    //         let className = v.classList;
    //         let replaceClass = className[1];

    //         if(v.innerText == columnDataValue){
    //             if($(event.target).is(':checked')){
    //                 $("."+replaceClass+"").css('display','table-cell');
    //                 $("."+replaceClass+"").css('padding','.75rem');
    //                 $("."+replaceClass+"").css('vertical-align','top');
    //             }else{
    //                 $("."+replaceClass+"").css('display','none');
    //             }
    //         }
    //     });
    // },
    // 'click .btnOpenSettings' : function(event){
    //     let templateObject = Template.instance();
    //     var columns = $('#tblWorkorderList th');

    //     const tableHeaderList = [];
    //     let sTible = "";
    //     let sWidth = "";
    //     let sIndex = "";
    //     let sVisible = "";
    //     let columVisible = false;
    //     let sClass = "";
    //     $.each(columns, function(i,v) {
    //         if(v.hidden == false){
    //             columVisible =  true;
    //         }
    //         if((v.className.includes("hiddenColumn"))){
    //             columVisible = false;
    //         }
    //         sWidth = v.style.width.replace('px', "");

    //         let datatablerecordObj = {
    //             custid: $(this).attr("custid") || 0,
    //             sTitle: v.innerText || '',
    //             sWidth: sWidth || '',
    //             sIndex: v.cellIndex || '',
    //             sVisible: columVisible || false,
    //             sClass: v.className || ''
    //         };
    //         tableHeaderList.push(datatablerecordObj);
    //     });
    //     templateObject.tableheaderrecords.set(tableHeaderList);
    // },

    // 'click .saveTable' : function(event) {
    //     let lineItems = [];
    //     let organisationService = new OrganisationService();
    //     let listType = 'ltWorkorderList';

    //     $(".fullScreenSpin").css("display", "inline-block");
    //     setTimeout(function() {
    //         $(".fullScreenSpin").css("display", "none");
    //         $("#myModal2").modal('toggle')
    //     }, 2000)
    //     // $('.displaySettings').each(function(index) {
    //     //     var $tblrow = $(this);
    //     //     var fieldID = $tblrow.attr("custid") || 0;
    //     //     var colTitle = $tblrow.find(".divcolumn").text() || '';
    //     //     var colWidth = $tblrow.find(".custom-range").val() || 0;
    //     //     var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
    //     //     var colHidden = false;
    //     //     if ($tblrow.find(".custom-control-input").is(':checked')) {
    //     //         colHidden = true;
    //     //     } else {
    //     //         colHidden = false;
    //     //     }
    //     //     let lineItemObj = {
    //     //         index: index,
    //     //         label: colTitle,
    //     //         hidden: colHidden,
    //     //         width: colWidth,
    //     //         thclass: colthClass
    //     //     }

    //     //     lineItems.push(lineItemObj);

    //     //     if(fieldID && parseInt(fieldID) != 0){
    //     //         objDetails1 = {
    //     //             type: "TCustomFieldList",
    //     //             fields: {
    //     //                 Active: colHidden,
    //     //                 ID: parseInt(fieldID),
    //     //                 Description: colTitle,
    //     //                 Width: colWidth
    //     //             },
    //     //         };
    //     //     } else {
    //     //         objDetails1 = {
    //     //             type: "TCustomFieldList",
    //     //             fields: {
    //     //                 Active: colHidden,
    //     //                 DataType: "ftString",
    //     //                 Description: colTitle,
    //     //                 ListType: listType,
    //     //                 Width: colWidth
    //     //             },
    //     //         };
    //     //     }

    //     //     organisationService.saveCustomField(objDetails1).then(function (objDetails) {
    //     //         $(".fullScreenSpin").css("display", "none");
    //     //         $('#myModal2').modal('hide');
    //     //       })
    //     //       .catch(function (err) {
    //     //         swal({
    //     //           title: "Oooops...",
    //     //           text: err,
    //     //           type: "error",
    //     //           showCancelButton: false,
    //     //           confirmButtonText: "Try Again",
    //     //         }).then((result) => {
    //     //           if (result.value) {
    //     //             $(".fullScreenSpin").css("display", "none");
    //     //           } else if (result.dismiss === "cancel") {
    //     //           }
    //     //           $('#myModal2').modal('hide');
    //     //         });
    //     //         $(".fullScreenSpin").css("display", "none");
    //     //         $('#myModal2').modal('hide');
    //     //       });
    //     // })
    // },

    //  // custom field displaysettings
    //  'click .resetTable' : function(event) {
    //     let templateObject = Template.instance();
    //     // let custFields = templateObject.custfields.get();
    //     // var datable = $('#tblquotelist').DataTable();
    //     let reset_data = [
    //         { label: 'ID', class: 'colId', active: true },
    //         { label: 'Order Number', class: 'colOrderNumber', active: true },
    //         { label: 'Customer', class: 'colCustomer', active: true },
    //         { label: 'PO Number', class: 'colPONumber', active: true },
    //         { label: 'Sale Date', class: 'colSaleDate', active: true },
    //         { label: 'Due Date', class: 'colDueDate', active: true },
    //     ];

    //     $('.displaySettings').each(function(index) {
    //       var $tblrow = $(this);
    //       $tblrow.find(".divcolumn").text(reset_data[index].label);
    //       $tblrow.find(".custom-control-input").prop('checked', reset_data[index].active);

    //       // var title = datable.column( index+1 ).header();
    //       var title = $('#tblWorkorderList').find('th').eq(index + 1);
    //       $(title).html(reset_data[index].label);

    //       if (reset_data[index].active) {
    //         $('.' + reset_data[index].class).css('display', 'table-cell');
    //         $('.' + reset_data[index].class).css('padding', '.75rem');
    //         $('.' + reset_data[index].class).css('vertical-align', 'top');
    //       } else {
    //         $('.' + reset_data[index].class).css('display', 'none');
    //       }

    //     });

    //   },



    'click .workorderList .btnRefresh': function(e) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        setTimeout(function () {
            // templateObject.getWorkorderRecords();
            window.open('/workorderlist', '_self');
            }, 3000);
        },

    //     'click .workorderList #exportbtn': function() {
    //         $('.fullScreenSpin').css('display', 'inline-block');
    //         jQuery('#tblWorkorderList_wrapper .dt-buttons .btntabletocsv').click();
    //         $('.fullScreenSpin').css('display', 'none');
    //     },

    //     'click .workorderList .printConfirm': function() {
    //         playPrintAudio();
    //         setTimeout(function(){
    //         $('.fullScreenSpin').css('display', 'inline-block');
    //         jQuery('#tblWorkorderList_wrapper .dt-buttons .btntabletopdf').click();
    //         $('.fullScreenSpin').css('display', 'none');
    //     }, delayTimeAfterSound);
    //     },

        'click .workorderList #btnNewWorkorder': function (e) {
            FlowRouter.go('/workordercard');
        },

        "keyup #tblWorkorderList_filter input": function (event) {
            if ($(event.target).val() != "") {
              $(".btnRefreshWorkorderList").addClass("btnSearchAlert");
            } else {
              $(".btnRefreshWorkorderList").removeClass("btnSearchAlert");
            }
            if (event.keyCode == 13) {
              $(".btnRefresh").trigger("click");
            }
          },

        "click .btnRefreshWorkorderList": function () {
            $(".workorderList .btnRefresh").trigger("click");
        },

        'click .exportbtn': function() {
            $('.fullScreenSpin').css('display', 'inline-block');
            $('#tblWorkorderList_wrapper .dt-buttons .btntabletoexcel').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
    
        },

        'click .printConfirm': function(event) {
            playPrintAudio();
            setTimeout(function(){
            $('.fullScreenSpin').css('display', 'inline-block');
            $('#tblWorkorderList_wrapper .dt-buttons .btntabletopdf').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, delayTimeAfterSound);
        },
        

})
