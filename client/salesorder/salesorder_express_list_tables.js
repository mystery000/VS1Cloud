// import "../js/new_salesorder";
import '../lib/global/indexdbstorage.js';
import { ReactiveVar } from 'meteor/reactive-var';
import {UtilityService} from "../utility-service";
import {SalesBoardService} from '../js/sales-service';
import { SideBarService } from '../js/sidebar-service';
import {AccountService} from "../accounts/account-service";
import { Template } from 'meteor/templating';
import "./salesorder_list.html";
import LoadingOverlay from "../LoadingOverlay";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.salesorderslist.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.custfields = new ReactiveVar([]);
    templateObject.displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
    templateObject.convertedStatus = new ReactiveVar();

    templateObject.getDataTableList = function(data){
      let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.TotalAmount)|| 0.00;
      let totalTax = utilityService.modifynegativeCurrencyFormat(data.TotalTax) || 0.00;
      // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
      let totalAmount = utilityService.modifynegativeCurrencyFormat(data.TotalAmountInc)|| 0.00;
      let totalPaid = utilityService.modifynegativeCurrencyFormat(data.Payment)|| 0.00;
      let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.Balance)|| 0.00;
      let salestatus = data.QuoteStatus || '';
      if(data.Deleted == true){
        salestatus = "Deleted";
      }else if(data.CustomerName == ''){
        salestatus = "Deleted";
      };
      let dataList = [
          '<span style="display:none;">'+(data.SaleDate !=''? moment(data.SaleDate).format("YYYY/MM/DD"): data.SaleDate)+'</span>'+(data.SaleDate !=''? moment(data.SaleDate).format("DD/MM/YYYY"): data.SaleDate),
          data.SaleID || '',
          '<span style="display:none;">'+(data.DueDate !=''? moment(data.DueDate).format("YYYY/MM/DD"): data.DueDate)+'</span>'+(data.DueDate !=''? moment(data.DueDate).format("DD/MM/YYYY"): data.DueDate),
          data.CustomerName || '',
          totalAmountEx || 0.00,
          totalTax || 0.00,
          totalAmount || 0.00,
          data.EmployeeName || '',
          data.Converted? 'Converted': 'Unconverted',
          data.Comments || '',
          data.SaleCustField1 || '',
          data.SaleCustField2 || '',
          data.SaleCustField3 || '',
          salestatus || '',
      ];
      return dataList;
    }

    templateObject.getExData = function(data){
      let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount) || 0.00;
      let totalTax = utilityService.modifynegativeCurrencyFormat(data.fields.TotalTax) || 0.00;
      // Currency+''+data.fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
      let totalAmount = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc) || 0.00;
      let totalPaid = utilityService.modifynegativeCurrencyFormat(data.fields.TotalPaid) || 0.00;
      let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance) || 0.00;
      let salestatus = data.fields.SalesStatus || '';
      if(data.fields.Deleted == true){
        salestatus = "Deleted";
      }else if(data.fields.CustomerName == ''){
        salestatus = "Deleted";
      };
      var dataList = [
        // data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("YYYY/MM/DD") : data.fields.SaleDate,
        data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : data.fields.SaleDate,
        data.fields.ID || '',
        data.fields.DueDate != '' ? moment(data.fields.DueDate).format("DD/MM/YYYY") : data.fields.DueDate,
        data.fields.CustomerName || '',
        totalAmountEx || 0.00,
        totalTax || 0.00,
        totalAmount || 0.00,
        data.fields.EmployeeName || '',
        data.fields.Converted? 'Converted': 'Unconverted',
        data.fields.Comments || '',
          salestatus || '',
      ];
      return dataList
    }

    let headerStructure = [
    // { index: 0, label: '#Sort Date', class:'colSortDate', active: false, display: true, width: "20" },
    { index: 0, label: "Sale Date", class: "colSaleDate", active: true, display: true, width: "100" },
    { index: 1, label: "Sales No.", class: "colSalesNo", active: true, display: true, width: "80" },
    { index: 2, label: "Due Date", class: "colDueDate", active: true, display: true, width: "100" },
    { index: 3, label: "Customer", class: "colCustomer", active: true, display: true, width: "180" },
    { index: 4, label: "Amount (Ex)", class: "colAmountEx", active: true, display: true, width: "100" },
    { index: 5, label: "Tax", class: "colTax", active: true, display: true, width: "100" },
    { index: 6, label: "Amount (Inc)", class: "colAmount", active: true, display: true, width: "100" },
    { index: 7, label: "Employee", class: "colEmployee", active: true, display: true, width: "100" },
    { index: 8, label: "Converted", class: "colConverted", active: true, display: true, width: "100" },
    { index: 9, label: "Comments", class: "colComments", active: true, display: true, width: "300" },
    { index: 10, label: "Status", class: "colStatus", active: true, display: true, width: "100" },
  ];
  templateObject.tableheaderrecords.set(headerStructure);


    // templateObject.loadCustomFields = async() => {
      let custFields = [];
      let customFieldCount = 3; // customfield tempcode
      let customData = {};
      let displayfields = headerStructure;
      /*
      sideBarService.getAllCustomFields().then(function (data) {
        let custIndex = 0;
        for (let x = 0; x < data.tcustomfieldlist.length; x++) {
          if (data.tcustomfieldlist[x].fields.ListType == 'ltSales') {

            customData = {
              index: displayfields.length+ custIndex,
              active: data.tcustomfieldlist[x].fields.Active || false,
              id: parseInt(data.tcustomfieldlist[x].fields.ID) || 0,
              label: data.tcustomfieldlist[x].fields.Description || "",
              class: "custfield" + x,
              display: true,
              width: "100"
            };
            custIndex++
            custFields.push(customData);
          }
        }

        if (custFields.length < customFieldCount) {
          let remainder = customFieldCount - custFields.length;
          let getRemCustomFields = parseInt(custFields.length);
          // count = count + remainder;
          for (let r = 0; r < remainder; r++) {
            getRemCustomFields++;
            customData = {
              index: displayfields.length + r,
              active: false,
              id: "",
              label: "Custom Field " + getRemCustomFields,
              class: "custfield" + r + customFields.length,
              display: true,
              width: "120"
            };
            // count++;
            custFields.push(customData);
          }
        }

        displayfields = displayfields.concat(custFields);
        templateObject.custfields.set(custFields);
        // setTimeout(() => {
          templateObject.tableheaderrecords.set(displayfields);
        // }, 500);

      })
      */
    // }

    // templateObject.initPage = async () => {
    //   LoadingOverlay.show();
    //    await templateObject.loadCustomFields();
    //   //  templateObject.getAllSalesOrderData();

    //   LoadingOverlay.hide();
    // }
    // templateObject.initPage();
});

Template.salesorderslist.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    templateObject.convertedStatus.set(FlowRouter.current().queryParams.converted == 'true' ? "Converted" : "Unconverted");


    let accountService = new AccountService();
    let salesService = new SalesBoardService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];


    var today = moment().format('DD/MM/YYYY');
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if ((currentDate.getMonth() + 1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }

    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }
    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

    $("#date-input,#dateTo,#dateFrom").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        dateFormat: 'dd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
        onChangeMonthYear: function(year, month, inst){
        // Set date to picker
        $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
        // Hide (close) the picker
        // $(this).datepicker('hide');
        // // Change ttrigger the on change function
        // $(this).trigger('change');
       }
    });

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);



    templateObject.resetData = function (dataVal) {
      if(FlowRouter.current().queryParams.converted){
        if(FlowRouter.current().queryParams.converted === true) {
          location.reload();
        }else{
          location.reload();
        }
      }else {
        location.reload();
      }
    }




    // templateObject.getAllSalesOrderData = function () {
    //   var currentBeginDate = new Date();
    //   var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    //   let fromDateMonth = (currentBeginDate.getMonth() + 1);
    //   let fromDateDay = currentBeginDate.getDate();
    //   if ((currentBeginDate.getMonth() + 1) < 10) {
    //       fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    //   } else {
    //       fromDateMonth = (currentBeginDate.getMonth() + 1);
    //   }

    //   if (currentBeginDate.getDate() < 10) {
    //       fromDateDay = "0" + currentBeginDate.getDate();
    //   }
    //   var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
    //   let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

    //     getVS1Data('TSalesOrderList').then(function (dataObject) {
    //         if(dataObject.length == 0){
    //             sideBarService.getAllTSalesOrderListData(prevMonth11Date,toDate, true,initialReportLoad,0).then(function (data) {
    //                 let lineItems = [];
    //                 let lineItemObj = {};
    //                 addVS1Data('TSalesOrderList',JSON.stringify(data));
    //                 if (data.Params.IgnoreDates == true) {
    //                     $('#dateFrom').attr('readonly', true);
    //                     $('#dateTo').attr('readonly', true);
    //                 } else {
    //                   $('#dateFrom').attr('readonly', false);
    //                   $('#dateTo').attr('readonly', false);
    //                     $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
    //                     $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
    //                 }
    //                 for(let i=0; i<data.tsalesorderlist.length; i++){
    //                     let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalAmount)|| 0.00;
    //                     let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalTax) || 0.00;
    //                     // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
    //                     let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalAmountInc)|| 0.00;
    //                     let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].Payment)|| 0.00;
    //                     let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].Balance)|| 0.00;
    //                     let salestatus = data.tsalesorderlist[i].QuoteStatus || '';
    //                     if(data.tsalesorderlist[i].Deleted == true){
    //                       salestatus = "Deleted";
    //                     }else if(data.tsalesorderlist[i].CustomerName == ''){
    //                       salestatus = "Deleted";
    //                     };
    //                     var dataList = {
    //                         id: data.tsalesorderlist[i].SaleID || '',
    //                         employee:data.tsalesorderlist[i].EmployeeName || '',
    //                         sortdate: data.tsalesorderlist[i].SaleDate !=''? moment(data.tsalesorderlist[i].SaleDate).format("YYYY/MM/DD"): data.tsalesorderlist[i].SaleDate,
    //                         saledate: data.tsalesorderlist[i].SaleDate !=''? moment(data.tsalesorderlist[i].SaleDate).format("DD/MM/YYYY"): data.tsalesorderlist[i].SaleDate,
    //                         duedate: data.tsalesorderlist[i].DueDate !=''? moment(data.tsalesorderlist[i].DueDate).format("DD/MM/YYYY"): data.tsalesorderlist[i].DueDate,
    //                         customername: data.tsalesorderlist[i].CustomerName || '',
    //                         totalamountex: totalAmountEx || 0.00,
    //                         totaltax: totalTax || 0.00,
    //                         totalamount: totalAmount || 0.00,
    //                         totalpaid: totalPaid || 0.00,
    //                         totaloustanding: totalOutstanding || 0.00,
    //                         salestatus: salestatus || '',
    //                         custfield1: data.tsalesorderlist[i].SaleCustField1 || '',
    //                         custfield2: data.tsalesorderlist[i].SaleCustField2 || '',
    //                         custfield3: data.tsalesorderlist[i].SaleCustField3 || '',
    //                         comments: data.tsalesorderlist[i].Comments || '',
    //                         isConverted: data.tsalesorderlist[i].Converted
    //                     };

    //                     //if(data.tsalesorderex[i].fields.Deleted == false && data.tsalesorderex[i].fields.CustomerName.replace(/\s/g, '') != ''){
    //                         dataTableList.push(dataList);
    //                     //}

    //                     //}
    //                 }

    //                 templateObject.datatablerecords.set(dataTableList);

    //                 if(templateObject.datatablerecords.get()){


    //                     setTimeout(function () {
    //                         MakeNegative();
    //                     }, 100);
    //                 }

    //                 $('.fullScreenSpin').css('display','none');
    //                 setTimeout(function () {
    //                     $('#tblSalesOrderlist').DataTable({
    //                         columnDefs: [
    //                             {type: 'date', targets: 0}
    //                         ],
    //                         select: true,
    //                         destroy: true,
    //                         colReorder: true,
    //                         "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    //                         buttons: [
    //                             {
    //                                 extend: 'excelHtml5',
    //                                 text: '',
    //                                 download: 'open',
    //                                 className: "btntabletocsv hiddenColumn",
    //                                 filename: "Sales Order List - "+ moment().format(),
    //                                 orientation:'portrait',
    //                                 exportOptions: {
    //                                     columns: ':visible',
    //                                     format: {
    //                                         body: function ( data, row, column ) {
    //                                             if(data.includes("</span>")){
    //                                                 var res = data.split("</span>");
    //                                                 data = res[1];
    //                                             }

    //                                             return column === 1 ? data.replace(/<.*?>/ig, ""): data;

    //                                         }
    //                                     }
    //                                 }
    //                             },{
    //                                 extend: 'print',
    //                                 download: 'open',
    //                                 className: "btntabletopdf hiddenColumn",
    //                                 text: '',
    //                                 title: 'Sales Order List',
    //                                 filename: "Sales Order List - "+ moment().format(),
    //                                 exportOptions: {
    //                                     columns: ':visible',
    //                                     stripHtml: false
    //                                 }
    //                             }],
    //                         //bStateSave: true,
    //                         //rowId: 0,
    //                         pageLength: initialDatatableLoad,
    //                         "bLengthChange": false,
    //                         info: true,
    //                         "order": [[ 0, "desc" ],[ 2, "desc" ]],
    //                         responsive: true,
    //                         action: function () {
    //                             $('#tblSalesOrderlist').DataTable().ajax.reload();
    //                         },
    //                         "fnDrawCallback": function (oSettings) {
    //                           let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

    //                           $('.paginate_button.page-item').removeClass('disabled');
    //                           $('#tblquotelist_ellipsis').addClass('disabled');

    //                           if(oSettings._iDisplayLength == -1){
    //                             if(oSettings.fnRecordsDisplay() > 150){
    //                               $('.paginate_button.page-item.previous').addClass('disabled');
    //                               $('.paginate_button.page-item.next').addClass('disabled');
    //                             }
    //                           }else{

    //                           }
    //                           if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
    //                               $('.paginate_button.page-item.next').addClass('disabled');
    //                           }

    //                           $('.paginate_button.next:not(.disabled)', this.api().table().container())
    //                            .on('click', function(){
    //                              $('.fullScreenSpin').css('display','inline-block');
    //                              let dataLenght = oSettings._iDisplayLength;
    //                              var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //                              var dateTo = new Date($("#dateTo").datepicker("getDate"));

    //                              let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //                              let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
    //                              if(data.Params.IgnoreDates == true){
    //                                sideBarService.getAllTSalesOrderListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                                  getVS1Data('TSalesOrderList').then(function (dataObjectold) {
    //                                    if(dataObjectold.length == 0){

    //                                    }else{
    //                                      let dataOld = JSON.parse(dataObjectold[0].data);

    //                                      var thirdaryData = $.merge($.merge([], dataObjectnew.tsalesorderlist), dataOld.tsalesorderlist);
    //                                      let objCombineData = {
    //                                        Params: dataOld.Params,
    //                                        tsalesorderlist:thirdaryData
    //                                      }


    //                                        addVS1Data('TSalesOrderList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                                          templateObject.resetData(objCombineData);
    //                                        $('.fullScreenSpin').css('display','none');
    //                                        }).catch(function (err) {
    //                                        $('.fullScreenSpin').css('display','none');
    //                                        });

    //                                    }
    //                                   }).catch(function (err) {

    //                                   });

    //                                }).catch(function(err) {
    //                                  $('.fullScreenSpin').css('display','none');
    //                                });
    //                              }else{
    //                              sideBarService.getAllTSalesOrderListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                                getVS1Data('TSalesOrderList').then(function (dataObjectold) {
    //                                  if(dataObjectold.length == 0){

    //                                  }else{
    //                                    let dataOld = JSON.parse(dataObjectold[0].data);

    //                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tsalesorderlist), dataOld.tsalesorderlist);
    //                                    let objCombineData = {
    //                                      Params: dataOld.Params,
    //                                      tsalesorderlist:thirdaryData
    //                                    }


    //                                      addVS1Data('TSalesOrderList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                                        templateObject.resetData(objCombineData);
    //                                      $('.fullScreenSpin').css('display','none');
    //                                      }).catch(function (err) {
    //                                      $('.fullScreenSpin').css('display','none');
    //                                      });

    //                                  }
    //                                 }).catch(function (err) {

    //                                 });

    //                              }).catch(function(err) {
    //                                $('.fullScreenSpin').css('display','none');
    //                              });
    //                            }

    //                            });

    //                             setTimeout(function () {
    //                                 MakeNegative();
    //                             }, 100);
    //                         },
    //                         language: { search: "",searchPlaceholder: "Search List..." },
    //                         "fnInitComplete": function () {
    //                           this.fnPageChange('last');
    //                           if(data.Params.Search.replace(/\s/g, "") == ""){
    //                             $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblSalesOrderlist_filter");
    //                           }else{
    //                             $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblSalesOrderlist_filter");
    //                           };
    //                          $("<button class='btn btn-primary btnRefreshSOList' type='button' id='btnRefreshSOList' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSalesOrderlist_filter");
    //                          $('.myvarFilterForm').appendTo(".colDateFilter");
    //                      },
    //                      "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
    //                        let countTableData = data.Params.Count || 0; //get count from API data

    //                          return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
    //                      }

    //                     }).on('page', function () {
    //                         setTimeout(function () {
    //                             MakeNegative();
    //                         }, 100);
    //                         let draftRecord = templateObject.datatablerecords.get();
    //                         templateObject.datatablerecords.set(draftRecord);
    //                     }).on('column-reorder', function () {

    //                     }).on( 'length.dt', function ( e, settings, len ) {
    //                         setTimeout(function () {
    //                             MakeNegative();
    //                         }, 100);
    //                     });

    //                     // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
    //                     $('.fullScreenSpin').css('display','none');

    //                 }, 0);

    //                 $('div.dataTables_filter input').addClass('form-control form-control-sm');
    //                 $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
    //                     var listData = $(this).closest('tr').attr('id');
    //                     var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
    //                     if(listData){
    //                       if(checkDeleted == "Deleted"){
    //                         swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
    //                       }else{
    //                         FlowRouter.go('/salesordercard?id=' + listData);
    //                       }
    //                     }
    //                 });

    //             }).catch(function (err) {
    //                 // Bert.alert('<strong>' + err + '</strong>!', 'danger');
    //                 $('.fullScreenSpin').css('display','none');
    //                 // Meteor._reload.reload();
    //             });
    //             templateObject.getCustomFieldData();
    //         }
    //     })

    // }

    // templateObject.getAllSalesOrderFilterData = function (converted) {
    //   var currentBeginDate = new Date();
    //   var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    //   let fromDateMonth = (currentBeginDate.getMonth() + 1);
    //   let fromDateDay = currentBeginDate.getDate();
    //   if ((currentBeginDate.getMonth() + 1) < 10) {
    //       fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    //   } else {
    //       fromDateMonth = (currentBeginDate.getMonth() + 1);
    //   }

    //   if (currentBeginDate.getDate() < 10) {
    //       fromDateDay = "0" + currentBeginDate.getDate();
    //   }
    //   var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
    //   let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

    //     getVS1Data('TSalesOrderFilterList').then(function (dataObject) {
    //         if(dataObject.length == 0){
    //             sideBarService.getAllTSalesOrderListFilterData(converted,prevMonth11Date,toDate, true,initialReportLoad,0).then(function (data) {
    //                 let lineItems = [];
    //                 let lineItemObj = {};
    //                 addVS1Data('TSalesOrderFilterList',JSON.stringify(data));
    //                 if (data.Params.IgnoreDates == true) {
    //                     $('#dateFrom').attr('readonly', true);
    //                     $('#dateTo').attr('readonly', true);
    //                     if (FlowRouter.current().queryParams.converted == 'true') {
    //                       FlowRouter.go('/salesorderslist?converted=true');
    //                     }else {
    //                       FlowRouter.go('/salesorderslist?converted=false');
    //                     }
    //                 } else {
    //                     $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
    //                     $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
    //                 }
    //                 for(let i=0; i<data.tsalesorderlist.length; i++){
    //                     let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalAmount)|| 0.00;
    //                     let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalTax) || 0.00;
    //                     // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
    //                     let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalAmountInc)|| 0.00;
    //                     let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].Payment)|| 0.00;
    //                     let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].Balance)|| 0.00;
    //                     let salestatus = data.tsalesorderlist[i].QuoteStatus || '';
    //                     if(data.tsalesorderlist[i].Deleted == true){
    //                       salestatus = "Deleted";
    //                     }else if(data.tsalesorderlist[i].CustomerName == ''){
    //                       salestatus = "Deleted";
    //                     };
    //                     var dataList = {
    //                         id: data.tsalesorderlist[i].SaleID || '',
    //                         employee:data.tsalesorderlist[i].EmployeeName || '',
    //                         sortdate: data.tsalesorderlist[i].SaleDate !=''? moment(data.tsalesorderlist[i].SaleDate).format("YYYY/MM/DD"): data.tsalesorderlist[i].SaleDate,
    //                         saledate: data.tsalesorderlist[i].SaleDate !=''? moment(data.tsalesorderlist[i].SaleDate).format("DD/MM/YYYY"): data.tsalesorderlist[i].SaleDate,
    //                         duedate: data.tsalesorderlist[i].DueDate !=''? moment(data.tsalesorderlist[i].DueDate).format("DD/MM/YYYY"): data.tsalesorderlist[i].DueDate,
    //                         customername: data.tsalesorderlist[i].CustomerName || '',
    //                         totalamountex: totalAmountEx || 0.00,
    //                         totaltax: totalTax || 0.00,
    //                         totalamount: totalAmount || 0.00,
    //                         totalpaid: totalPaid || 0.00,
    //                         totaloustanding: totalOutstanding || 0.00,
    //                         salestatus: salestatus || '',
    //                         custfield1: data.tsalesorderlist[i].SaleCustField1 || '',
    //                         custfield2: data.tsalesorderlist[i].SaleCustField2 || '',
    //                         custfield3: data.tsalesorderlist[i].SaleCustField3 || '',
    //                         comments: data.tsalesorderlist[i].Comments || '',
    //                         isConverted: data.tsalesorderlist[i].Converted
    //                     };

    //                     //if(data.tsalesorderex[i].fields.Deleted == false && data.tsalesorderex[i].fields.CustomerName.replace(/\s/g, '') != ''){
    //                         dataTableList.push(dataList);
    //                     //}

    //                     //}
    //                 }

    //                 templateObject.datatablerecords.set(dataTableList);

    //                 if(templateObject.datatablerecords.get()){
    //                     setTimeout(function () {
    //                         MakeNegative();
    //                     }, 100);
    //                 }

    //                 $('.fullScreenSpin').css('display','none');
    //                 setTimeout(function () {
    //                     $('#tblSalesOrderlist').DataTable({
    //                         columnDefs: [
    //                             {type: 'date', targets: 0}
    //                         ],
    //                         select: true,
    //                         destroy: true,
    //                         colReorder: true,
    //                         "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    //                         buttons: [
    //                             {
    //                                 extend: 'excelHtml5',
    //                                 text: '',
    //                                 download: 'open',
    //                                 className: "btntabletocsv hiddenColumn",
    //                                 filename: "Sales Order List - "+ moment().format(),
    //                                 orientation:'portrait',
    //                                 exportOptions: {
    //                                     columns: ':visible',
    //                                     format: {
    //                                         body: function ( data, row, column ) {
    //                                             if(data.includes("</span>")){
    //                                                 var res = data.split("</span>");
    //                                                 data = res[1];
    //                                             }

    //                                             return column === 1 ? data.replace(/<.*?>/ig, ""): data;

    //                                         }
    //                                     }
    //                                 }
    //                             },{
    //                                 extend: 'print',
    //                                 download: 'open',
    //                                 className: "btntabletopdf hiddenColumn",
    //                                 text: '',
    //                                 title: 'Sales Order List',
    //                                 filename: "Sales Order List - "+ moment().format(),
    //                                 exportOptions: {
    //                                     columns: ':visible',
    //                                     stripHtml: false
    //                                 }
    //                             }],
    //                         //bStateSave: true,
    //                         //rowId: 0,
    //                         pageLength: initialDatatableLoad,
    //                         "bLengthChange": false,
    //                         info: true,
    //                         "order": [[ 0, "desc" ],[ 2, "desc" ]],
    //                         responsive: true,
    //                         action: function () {
    //                             $('#tblSalesOrderlist').DataTable().ajax.reload();
    //                         },
    //                         "fnDrawCallback": function (oSettings) {
    //                           let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

    //                           $('.paginate_button.page-item').removeClass('disabled');
    //                           $('#tblquotelist_ellipsis').addClass('disabled');

    //                           if(oSettings._iDisplayLength == -1){
    //                             if(oSettings.fnRecordsDisplay() > 150){
    //                               $('.paginate_button.page-item.previous').addClass('disabled');
    //                               $('.paginate_button.page-item.next').addClass('disabled');
    //                             }
    //                           }else{

    //                           }
    //                           if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
    //                               $('.paginate_button.page-item.next').addClass('disabled');
    //                           }

    //                           $('.paginate_button.next:not(.disabled)', this.api().table().container())
    //                            .on('click', function(){
    //                              $('.fullScreenSpin').css('display','inline-block');
    //                              let dataLenght = oSettings._iDisplayLength;
    //                              var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //                              var dateTo = new Date($("#dateTo").datepicker("getDate"));

    //                              let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //                              let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
    //                              if(data.Params.IgnoreDates == true){
    //                                sideBarService.getAllTSalesOrderListFilterData(converted,formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                                  getVS1Data('TSalesOrderFilterList').then(function (dataObjectold) {
    //                                    if(dataObjectold.length == 0){

    //                                    }else{
    //                                      let dataOld = JSON.parse(dataObjectold[0].data);

    //                                      var thirdaryData = $.merge($.merge([], dataObjectnew.tsalesorderlist), dataOld.tsalesorderlist);
    //                                      let objCombineData = {
    //                                        Params: dataOld.Params,
    //                                        tsalesorderlist:thirdaryData
    //                                      }


    //                                        addVS1Data('TSalesOrderFilterList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                                          templateObject.resetData(objCombineData);
    //                                        $('.fullScreenSpin').css('display','none');
    //                                        }).catch(function (err) {
    //                                        $('.fullScreenSpin').css('display','none');
    //                                        });

    //                                    }
    //                                   }).catch(function (err) {

    //                                   });

    //                                }).catch(function(err) {
    //                                  $('.fullScreenSpin').css('display','none');
    //                                });
    //                              }else{
    //                              sideBarService.getAllTSalesOrderListFilterData(converted,formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                                getVS1Data('TSalesOrderFilterList').then(function (dataObjectold) {
    //                                  if(dataObjectold.length == 0){

    //                                  }else{
    //                                    let dataOld = JSON.parse(dataObjectold[0].data);

    //                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tsalesorderlist), dataOld.tsalesorderlist);
    //                                    let objCombineData = {
    //                                      Params: dataOld.Params,
    //                                      tsalesorderlist:thirdaryData
    //                                    }


    //                                      addVS1Data('TSalesOrderFilterList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                                        templateObject.resetData(objCombineData);
    //                                      $('.fullScreenSpin').css('display','none');
    //                                      }).catch(function (err) {
    //                                      $('.fullScreenSpin').css('display','none');
    //                                      });

    //                                  }
    //                                 }).catch(function (err) {

    //                                 });

    //                              }).catch(function(err) {
    //                                $('.fullScreenSpin').css('display','none');
    //                              });
    //                            }

    //                            });

    //                             setTimeout(function () {
    //                                 MakeNegative();
    //                             }, 100);
    //                         },
    //                         language: { search: "",searchPlaceholder: "Search List..." },
    //                         "fnInitComplete": function () {
    //                           this.fnPageChange('last');
    //                           if(data.Params.Search.replace(/\s/g, "") == ""){
    //                             $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblSalesOrderlist_filter");
    //                           }else{
    //                             $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblSalesOrderlist_filter");
    //                           };
    //                          $("<button class='btn btn-primary btnRefreshSOList' type='button' id='btnRefreshSOList' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSalesOrderlist_filter");
    //                          $('.myvarFilterForm').appendTo(".colDateFilter");
    //                      },
    //                      "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
    //                        let countTableData = data.Params.Count || 0; //get count from API data

    //                          return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
    //                      }

    //                     }).on('page', function () {
    //                         setTimeout(function () {
    //                             MakeNegative();
    //                         }, 100);
    //                         let draftRecord = templateObject.datatablerecords.get();
    //                         templateObject.datatablerecords.set(draftRecord);
    //                     }).on('column-reorder', function () {

    //                     }).on( 'length.dt', function ( e, settings, len ) {
    //                         setTimeout(function () {
    //                             MakeNegative();
    //                         }, 100);
    //                     });

    //                     // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
    //                     $('.fullScreenSpin').css('display','none');

    //                 }, 0);

    //                 $('div.dataTables_filter input').addClass('form-control form-control-sm');
    //                 $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
    //                     var listData = $(this).closest('tr').attr('id');
    //                     var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
    //                     if(listData){
    //                       if(checkDeleted == "Deleted"){
    //                         swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
    //                       }else{
    //                         FlowRouter.go('/salesordercard?id=' + listData);
    //                       }
    //                     }
    //                 });

    //             }).catch(function (err) {
    //                 // Bert.alert('<strong>' + err + '</strong>!', 'danger');
    //                 $('.fullScreenSpin').css('display','none');
    //                 // Meteor._reload.reload();
    //             });
    //         }else{
    //             let data = JSON.parse(dataObject[0].data);
    //             let useData = data.tsalesorderlist;
    //             let lineItems = [];
    //             let lineItemObj = {};
    //             if (data.Params.IgnoreDates == true) {
    //                 $('#dateFrom').attr('readonly', true);
    //                 $('#dateTo').attr('readonly', true);
    //                 if (FlowRouter.current().queryParams.converted == 'true') {
    //                   FlowRouter.go('/salesorderslist?converted=true');
    //                 }else {
    //                   FlowRouter.go('/salesorderslist?converted=false');
    //                 }
    //             } else {
    //                 $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
    //                 $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
    //             }
    //             for(let i=0; i<data.tsalesorderlist.length; i++){
    //                 let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalAmount)|| 0.00;
    //                 let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalTax) || 0.00;
    //                 // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
    //                 let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalAmountInc)|| 0.00;
    //                 let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].Payment)|| 0.00;
    //                 let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].Balance)|| 0.00;
    //                 let salestatus = data.tsalesorderlist[i].QuoteStatus || '';
    //                 if(data.tsalesorderlist[i].Deleted == true){
    //                   salestatus = "Deleted";
    //                 }else if(data.tsalesorderlist[i].CustomerName == ''){
    //                   salestatus = "Deleted";
    //                 };
    //                 var dataList = {
    //                     id: data.tsalesorderlist[i].SaleID || '',
    //                     employee:data.tsalesorderlist[i].EmployeeName || '',
    //                     sortdate: data.tsalesorderlist[i].SaleDate !=''? moment(data.tsalesorderlist[i].SaleDate).format("YYYY/MM/DD"): data.tsalesorderlist[i].SaleDate,
    //                     saledate: data.tsalesorderlist[i].SaleDate !=''? moment(data.tsalesorderlist[i].SaleDate).format("DD/MM/YYYY"): data.tsalesorderlist[i].SaleDate,
    //                     duedate: data.tsalesorderlist[i].DueDate !=''? moment(data.tsalesorderlist[i].DueDate).format("DD/MM/YYYY"): data.tsalesorderlist[i].DueDate,
    //                     customername: data.tsalesorderlist[i].CustomerName || '',
    //                     totalamountex: totalAmountEx || 0.00,
    //                     totaltax: totalTax || 0.00,
    //                     totalamount: totalAmount || 0.00,
    //                     totalpaid: totalPaid || 0.00,
    //                     totaloustanding: totalOutstanding || 0.00,
    //                     salestatus: salestatus || '',
    //                     custfield1: data.tsalesorderlist[i].SaleCustField1 || '',
    //                     custfield2: data.tsalesorderlist[i].SaleCustField2 || '',
    //                     comments: data.tsalesorderlist[i].Comments || '',
    //                     isConverted: data.tsalesorderlist[i].Converted
    //                 };

    //                 //if(data.tsalesorderex[i].fields.Deleted == false && data.tsalesorderex[i].fields.CustomerName.replace(/\s/g, '') != ''){
    //                     dataTableList.push(dataList);
    //                 //}

    //                 //}
    //             }

    //             templateObject.datatablerecords.set(dataTableList);

    //             if(templateObject.datatablerecords.get()){
    //                 setTimeout(function () {
    //                     MakeNegative();
    //                 }, 100);
    //             }

    //             $('.fullScreenSpin').css('display','none');
    //             setTimeout(function () {
    //                 $('#tblSalesOrderlist').DataTable({
    //                     columnDefs: [
    //                         {type: 'date', targets: 0}
    //                     ],
    //                     select: true,
    //                     destroy: true,
    //                     colReorder: true,
    //                     "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    //                     buttons: [
    //                         {
    //                             extend: 'excelHtml5',
    //                             text: '',
    //                             download: 'open',
    //                             className: "btntabletocsv hiddenColumn",
    //                             filename: "Sales Order List - "+ moment().format(),
    //                             orientation:'portrait',
    //                             exportOptions: {
    //                                 columns: ':visible',
    //                                 format: {
    //                                     body: function ( data, row, column ) {
    //                                         if(data.includes("</span>")){
    //                                             var res = data.split("</span>");
    //                                             data = res[1];
    //                                         }

    //                                         return column === 1 ? data.replace(/<.*?>/ig, ""): data;

    //                                     }
    //                                 }
    //                             }
    //                         },{
    //                             extend: 'print',
    //                             download: 'open',
    //                             className: "btntabletopdf hiddenColumn",
    //                             text: '',
    //                             title: 'Sales Order List',
    //                             filename: "Sales Order List - "+ moment().format(),
    //                             exportOptions: {
    //                                 columns: ':visible',
    //                                 stripHtml: false
    //                             }
    //                         }],
    //                     //bStateSave: true,
    //                     //rowId: 0,
    //                     pageLength: initialDatatableLoad,
    //                     "bLengthChange": false,
    //                     info: true,
    //                     "order": [[ 0, "desc" ],[ 2, "desc" ]],
    //                     responsive: true,
    //                     action: function () {
    //                         $('#tblSalesOrderlist').DataTable().ajax.reload();
    //                     },
    //                     "fnDrawCallback": function (oSettings) {
    //                       let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

    //                       $('.paginate_button.page-item').removeClass('disabled');
    //                       $('#tblquotelist_ellipsis').addClass('disabled');

    //                       if(oSettings._iDisplayLength == -1){
    //                         if(oSettings.fnRecordsDisplay() > 150){
    //                           $('.paginate_button.page-item.previous').addClass('disabled');
    //                           $('.paginate_button.page-item.next').addClass('disabled');
    //                         }
    //                       }else{

    //                       }
    //                       if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
    //                           $('.paginate_button.page-item.next').addClass('disabled');
    //                       }

    //                       $('.paginate_button.next:not(.disabled)', this.api().table().container())
    //                        .on('click', function(){
    //                          $('.fullScreenSpin').css('display','inline-block');
    //                          let dataLenght = oSettings._iDisplayLength;
    //                          var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //                          var dateTo = new Date($("#dateTo").datepicker("getDate"));

    //                          let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //                          let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
    //                          if(data.Params.IgnoreDates == true){
    //                            sideBarService.getAllTSalesOrderListFilterData(converted,formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                              getVS1Data('TSalesOrderFilterList').then(function (dataObjectold) {
    //                                if(dataObjectold.length == 0){

    //                                }else{
    //                                  let dataOld = JSON.parse(dataObjectold[0].data);

    //                                  var thirdaryData = $.merge($.merge([], dataObjectnew.tsalesorderlist), dataOld.tsalesorderlist);
    //                                  let objCombineData = {
    //                                    Params: dataOld.Params,
    //                                    tsalesorderlist:thirdaryData
    //                                  }


    //                                    addVS1Data('TSalesOrderFilterList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                                      templateObject.resetData(objCombineData);
    //                                    $('.fullScreenSpin').css('display','none');
    //                                    }).catch(function (err) {
    //                                    $('.fullScreenSpin').css('display','none');
    //                                    });

    //                                }
    //                               }).catch(function (err) {

    //                               });

    //                            }).catch(function(err) {
    //                              $('.fullScreenSpin').css('display','none');
    //                            });
    //                          }else{
    //                          sideBarService.getAllTSalesOrderListFilterData(converted,formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                            getVS1Data('TSalesOrderFilterList').then(function (dataObjectold) {
    //                              if(dataObjectold.length == 0){

    //                              }else{
    //                                let dataOld = JSON.parse(dataObjectold[0].data);

    //                                var thirdaryData = $.merge($.merge([], dataObjectnew.tsalesorderlist), dataOld.tsalesorderlist);
    //                                let objCombineData = {
    //                                  Params: dataOld.Params,
    //                                  tsalesorderlist:thirdaryData
    //                                }


    //                                  addVS1Data('TSalesOrderFilterList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                                    templateObject.resetData(objCombineData);
    //                                  $('.fullScreenSpin').css('display','none');
    //                                  }).catch(function (err) {
    //                                  $('.fullScreenSpin').css('display','none');
    //                                  });

    //                              }
    //                             }).catch(function (err) {

    //                             });

    //                          }).catch(function(err) {
    //                            $('.fullScreenSpin').css('display','none');
    //                          });
    //                        }

    //                        });

    //                         setTimeout(function () {
    //                             MakeNegative();
    //                         }, 100);
    //                     },
    //                     language: { search: "",searchPlaceholder: "Search List..." },
    //                     "fnInitComplete": function () {
    //                       this.fnPageChange('last');
    //                       if(data.Params.Search.replace(/\s/g, "") == ""){
    //                         $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblSalesOrderlist_filter");
    //                       }else{
    //                         $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblSalesOrderlist_filter");
    //                       };
    //                      $("<button class='btn btn-primary btnRefreshSOList' type='button' id='btnRefreshSOList' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSalesOrderlist_filter");
    //                      $('.myvarFilterForm').appendTo(".colDateFilter");
    //                  },
    //                  "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
    //                    let countTableData = data.Params.Count || 0; //get count from API data

    //                      return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
    //                  }

    //                 }).on('page', function () {
    //                     setTimeout(function () {
    //                         MakeNegative();
    //                     }, 100);
    //                     let draftRecord = templateObject.datatablerecords.get();
    //                     templateObject.datatablerecords.set(draftRecord);
    //                 }).on('column-reorder', function () {

    //                 }).on( 'length.dt', function ( e, settings, len ) {
    //                     setTimeout(function () {
    //                         MakeNegative();
    //                     }, 100);
    //                 });

    //                 // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
    //                 $('.fullScreenSpin').css('display','none');

    //             }, 0);

    //             $('div.dataTables_filter input').addClass('form-control form-control-sm');
    //             $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
    //                 var listData = $(this).closest('tr').attr('id');
    //                 var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
    //                 if(listData){
    //                   if(checkDeleted == "Deleted"){
    //                     swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
    //                   }else{
    //                     FlowRouter.go('/salesordercard?id=' + listData);
    //                   }
    //                 }
    //             });

    //         templateObject.getCustomFieldData();
    //       }
    //     }).catch(function (err) {

    //       sideBarService.getAllTSalesOrderListFilterData(converted,prevMonth11Date,toDate, true,initialReportLoad,0).then(function (data) {
    //           let lineItems = [];
    //           let lineItemObj = {};
    //           addVS1Data('TSalesOrderFilterList',JSON.stringify(data));
    //           if (data.Params.IgnoreDates == true) {
    //               $('#dateFrom').attr('readonly', true);
    //               $('#dateTo').attr('readonly', true);
    //               if (FlowRouter.current().queryParams.converted == 'true') {
    //                 FlowRouter.go('/salesorderslist?converted=true');
    //               }else {
    //                 FlowRouter.go('/salesorderslist?converted=false');
    //               }
    //           } else {
    //               $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
    //               $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
    //           }
    //           for(let i=0; i<data.tsalesorderlist.length; i++){
    //               let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalAmount)|| 0.00;
    //               let totalTax = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalTax) || 0.00;
    //               // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
    //               let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].TotalAmountInc)|| 0.00;
    //               let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].Payment)|| 0.00;
    //               let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsalesorderlist[i].Balance)|| 0.00;
    //               let salestatus = data.tsalesorderlist[i].QuoteStatus || '';
    //               if(data.tsalesorderlist[i].Deleted == true){
    //                 salestatus = "Deleted";
    //               }else if(data.tsalesorderlist[i].CustomerName == ''){
    //                 salestatus = "Deleted";
    //               };
    //               var dataList = {
    //                   id: data.tsalesorderlist[i].SaleID || '',
    //                   employee:data.tsalesorderlist[i].EmployeeName || '',
    //                   sortdate: data.tsalesorderlist[i].SaleDate !=''? moment(data.tsalesorderlist[i].SaleDate).format("YYYY/MM/DD"): data.tsalesorderlist[i].SaleDate,
    //                   saledate: data.tsalesorderlist[i].SaleDate !=''? moment(data.tsalesorderlist[i].SaleDate).format("DD/MM/YYYY"): data.tsalesorderlist[i].SaleDate,
    //                   duedate: data.tsalesorderlist[i].DueDate !=''? moment(data.tsalesorderlist[i].DueDate).format("DD/MM/YYYY"): data.tsalesorderlist[i].DueDate,
    //                   customername: data.tsalesorderlist[i].CustomerName || '',
    //                   totalamountex: totalAmountEx || 0.00,
    //                   totaltax: totalTax || 0.00,
    //                   totalamount: totalAmount || 0.00,
    //                   totalpaid: totalPaid || 0.00,
    //                   totaloustanding: totalOutstanding || 0.00,
    //                   salestatus: salestatus || '',
    //                   custfield1: data.tsalesorderlist[i].SaleCustField1 || '',
    //                   custfield2: data.tsalesorderlist[i].SaleCustField2 || '',
    //                   custfield3: data.tsalesorderlist[i].SaleCustField3 || '',
    //                   comments: data.tsalesorderlist[i].Comments || '',
    //                   isConverted: data.tsalesorderlist[i].Converted
    //               };

    //               //if(data.tsalesorderex[i].fields.Deleted == false && data.tsalesorderex[i].fields.CustomerName.replace(/\s/g, '') != ''){
    //                   dataTableList.push(dataList);
    //               //}

    //               //}
    //           }

    //           templateObject.datatablerecords.set(dataTableList);

    //           if(templateObject.datatablerecords.get()){
    //               setTimeout(function () {
    //                   MakeNegative();
    //               }, 100);
    //           }

    //           $('.fullScreenSpin').css('display','none');
    //           setTimeout(function () {
    //               $('#tblSalesOrderlist').DataTable({
    //                   columnDefs: [
    //                       {type: 'date', targets: 0}
    //                   ],
    //                   select: true,
    //                   destroy: true,
    //                   colReorder: true,
    //                   "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    //                   buttons: [
    //                       {
    //                           extend: 'excelHtml5',
    //                           text: '',
    //                           download: 'open',
    //                           className: "btntabletocsv hiddenColumn",
    //                           filename: "Sales Order List - "+ moment().format(),
    //                           orientation:'portrait',
    //                           exportOptions: {
    //                               columns: ':visible',
    //                               format: {
    //                                   body: function ( data, row, column ) {
    //                                       if(data.includes("</span>")){
    //                                           var res = data.split("</span>");
    //                                           data = res[1];
    //                                       }

    //                                       return column === 1 ? data.replace(/<.*?>/ig, ""): data;

    //                                   }
    //                               }
    //                           }
    //                       },{
    //                           extend: 'print',
    //                           download: 'open',
    //                           className: "btntabletopdf hiddenColumn",
    //                           text: '',
    //                           title: 'Sales Order List',
    //                           filename: "Sales Order List - "+ moment().format(),
    //                           exportOptions: {
    //                               columns: ':visible',
    //                               stripHtml: false
    //                           }
    //                       }],
    //                   //bStateSave: true,
    //                   //rowId: 0,
    //                   pageLength: initialDatatableLoad,
    //                   "bLengthChange": false,
    //                   info: true,
    //                   "order": [[ 0, "desc" ],[ 2, "desc" ]],
    //                   responsive: true,
    //                   action: function () {
    //                       $('#tblSalesOrderlist').DataTable().ajax.reload();
    //                   },
    //                   "fnDrawCallback": function (oSettings) {
    //                     let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

    //                     $('.paginate_button.page-item').removeClass('disabled');
    //                     $('#tblquotelist_ellipsis').addClass('disabled');

    //                     if(oSettings._iDisplayLength == -1){
    //                       if(oSettings.fnRecordsDisplay() > 150){
    //                         $('.paginate_button.page-item.previous').addClass('disabled');
    //                         $('.paginate_button.page-item.next').addClass('disabled');
    //                       }
    //                     }else{

    //                     }
    //                     if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
    //                         $('.paginate_button.page-item.next').addClass('disabled');
    //                     }

    //                     $('.paginate_button.next:not(.disabled)', this.api().table().container())
    //                      .on('click', function(){
    //                        $('.fullScreenSpin').css('display','inline-block');
    //                        let dataLenght = oSettings._iDisplayLength;
    //                        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //                        var dateTo = new Date($("#dateTo").datepicker("getDate"));

    //                        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //                        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
    //                        if(data.Params.IgnoreDates == true){
    //                          sideBarService.getAllTSalesOrderListFilterData(converted,formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                            getVS1Data('TSalesOrderFilterList').then(function (dataObjectold) {
    //                              if(dataObjectold.length == 0){

    //                              }else{
    //                                let dataOld = JSON.parse(dataObjectold[0].data);

    //                                var thirdaryData = $.merge($.merge([], dataObjectnew.tsalesorderlist), dataOld.tsalesorderlist);
    //                                let objCombineData = {
    //                                  Params: dataOld.Params,
    //                                  tsalesorderlist:thirdaryData
    //                                }


    //                                  addVS1Data('TSalesOrderFilterList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                                    templateObject.resetData(objCombineData);
    //                                  $('.fullScreenSpin').css('display','none');
    //                                  }).catch(function (err) {
    //                                  $('.fullScreenSpin').css('display','none');
    //                                  });

    //                              }
    //                             }).catch(function (err) {

    //                             });

    //                          }).catch(function(err) {
    //                            $('.fullScreenSpin').css('display','none');
    //                          });
    //                        }else{
    //                        sideBarService.getAllTSalesOrderListFilterData(converted,formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
    //                          getVS1Data('TSalesOrderFilterList').then(function (dataObjectold) {
    //                            if(dataObjectold.length == 0){

    //                            }else{
    //                              let dataOld = JSON.parse(dataObjectold[0].data);

    //                              var thirdaryData = $.merge($.merge([], dataObjectnew.tsalesorderlist), dataOld.tsalesorderlist);
    //                              let objCombineData = {
    //                                Params: dataOld.Params,
    //                                tsalesorderlist:thirdaryData
    //                              }


    //                                addVS1Data('TSalesOrderFilterList',JSON.stringify(objCombineData)).then(function (datareturn) {
    //                                  templateObject.resetData(objCombineData);
    //                                $('.fullScreenSpin').css('display','none');
    //                                }).catch(function (err) {
    //                                $('.fullScreenSpin').css('display','none');
    //                                });

    //                            }
    //                           }).catch(function (err) {

    //                           });

    //                        }).catch(function(err) {
    //                          $('.fullScreenSpin').css('display','none');
    //                        });
    //                      }

    //                      });

    //                       setTimeout(function () {
    //                           MakeNegative();
    //                       }, 100);
    //                   },
    //                   language: { search: "",searchPlaceholder: "Search List..." },
    //                   "fnInitComplete": function () {
    //                     this.fnPageChange('last');
    //                     if(data.Params.Search.replace(/\s/g, "") == ""){
    //                       $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblSalesOrderlist_filter");
    //                     }else{
    //                       $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblSalesOrderlist_filter");
    //                     };
    //                    $("<button class='btn btn-primary btnRefreshSOList' type='button' id='btnRefreshSOList' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSalesOrderlist_filter");
    //                    $('.myvarFilterForm').appendTo(".colDateFilter");
    //                },
    //                "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
    //                  let countTableData = data.Params.Count || 0; //get count from API data

    //                    return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
    //                }

    //               }).on('page', function () {
    //                   setTimeout(function () {
    //                       MakeNegative();
    //                   }, 100);
    //                   let draftRecord = templateObject.datatablerecords.get();
    //                   templateObject.datatablerecords.set(draftRecord);
    //               }).on('column-reorder', function () {

    //               }).on( 'length.dt', function ( e, settings, len ) {
    //                   setTimeout(function () {
    //                       MakeNegative();
    //                   }, 100);
    //               });

    //               // $('#tblSalesOrderlist').DataTable().column( 0 ).visible( true );
    //               $('.fullScreenSpin').css('display','none');

    //           }, 0);

    //           $('div.dataTables_filter input').addClass('form-control form-control-sm');
    //           $('#tblSalesOrderlist tbody').on( 'click', 'tr', function () {
    //               var listData = $(this).closest('tr').attr('id');
    //               var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
    //               if(listData){
    //                 if(checkDeleted == "Deleted"){
    //                   swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
    //                 }else{
    //                   FlowRouter.go('/salesordercard?id=' + listData);
    //                 }
    //               }
    //           });
    //           templateObject.getCustomFieldData();

    //       }).catch(function (err) {
    //           // Bert.alert('<strong>' + err + '</strong>!', 'danger');
    //           $('.fullScreenSpin').css('display','none');
    //           // Meteor._reload.reload();
    //       });
    //     });

    // }

    // if (FlowRouter.current().queryParams.converted) {
    //   if(FlowRouter.current().queryParams.page){

    //   }else{
    //   clearData('TSalesOrderFilterList');
    //   }
    //   setTimeout(function () {
    //     let checkConverted = FlowRouter.current().queryParams.converted || false;
    //     templateObject.getAllSalesOrderFilterData(checkConverted);
    //   }, 500);
    // }else{
    // templateObject.getAllSalesOrderData();
    // }

    // custom field displaysettings
    // templateObject.getCustomFieldData = function() {
    //   return;
    // }

    // templateObject.getAllFilterSalesOrderData = function(fromDate, toDate, ignoreDate) {
    //     sideBarService.getAllTSalesOrderListData(fromDate, toDate, ignoreDate,initialReportLoad,0).then(function(data) {
    //         addVS1Data('TSalesOrderList', JSON.stringify(data)).then(function(datareturn) {
    //             location.reload();
    //         }).catch(function(err) {
    //             location.reload();
    //         });
    //     }).catch(function(err) {
    //         $('.fullScreenSpin').css('display', 'none');
    //     });
    // }

    // let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
    // let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
    // let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
    // if (urlParametersDateFrom) {
    //     if (urlParametersIgnoreDate == true) {
    //         $('#dateFrom').attr('readonly', true);
    //         $('#dateTo').attr('readonly', true);
    //     } else {

    //         $("#dateFrom").val(urlParametersDateFrom != '' ? moment(urlParametersDateFrom).format("DD/MM/YYYY") : urlParametersDateFrom);
    //         $("#dateTo").val(urlParametersDateTo != '' ? moment(urlParametersDateTo).format("DD/MM/YYYY") : urlParametersDateTo);
    //     }
    // }
    // tableResize();
    // templateObject.initPage = async () => {
    //   LoadingOverlay.show();
    //    await templateObject.loadCustomFields();
    //   //  templateObject.getAllSalesOrderData();

    //   LoadingOverlay.hide();
    // }
    // templateObject.initPage();

});


Template.salesorderslist.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:localStorage.getItem('mycloudLogonID'),PrefName:'tblSalesOrderlist'});
    },
    // custom fields displaysettings
    custfields: () => {
      return Template.instance().custfields.get();
    },

    // custom fields displaysettings
    displayfields: () => {
      return Template.instance().displayfields.get();
    },

    convertedStatus: () => {
      return Template.instance().convertedStatus.get()
    },

    apiFunction:function() { // do not use arrow function
      return sideBarService.getAllTSalesOrderListData
    },

    searchAPI: function() {
      return sideBarService.getNewSalesOrderByNameOrID
    },

    apiParams: function() {
      return ['dateFrom', 'dateTo', 'ignoredate', 'limitCount', 'limitFrom', 'deleteFilter'];
    },

    service: ()=>{
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
        let dataReturn = templateObject.getExData(data);
        return dataReturn
      }
    }
});

Template.salesorderslist.events({
  'click #tblSalesOrderlist tbody tr': function (event) {
    var listData = $(event.target).closest('tr').find('td.colSalesNo').text();
    var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
    if(listData){
      if(checkDeleted == "Deleted"){
        swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
      }else{
        FlowRouter.go('/salesordercard?id=' + listData);
      }
    }
  },
  'click #btnNewSalesOrder':function(event){
      FlowRouter.go('/salesordercard');
  },

  'change .rngRange' : function(event){
      let range = $(event.target).val();
      $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

      let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
      let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
      var datable = $('#tblSalesOrderlist th');
      $.each(datable, function(i,v) {

          if(v.innerText == columnDataValue){
              let className = v.className;
              let replaceClass = className.replace(/ /g, ".");
              $("."+replaceClass+"").css('width',range+'px');

          }
      });

  },

  // 'click .printConfirm' : function(event){
  //   playPrintAudio();
  //   setTimeout(function(){
  //     let values = [];
  //     let basedOnTypeStorages = Object.keys(localStorage);
  //     basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
  //         let employeeId = storage.split('_')[2];
  //         return storage.includes('BasedOnType_') && employeeId == localStorage.getItem('mySessionEmployeeLoggedID')
  //     });
  //     let i = basedOnTypeStorages.length;
  //     if (i > 0) {
  //         while (i--) {
  //             values.push(localStorage.getItem(basedOnTypeStorages[i]));
  //         }
  //     }
  //     values.forEach(value => {
  //         let reportData = JSON.parse(value);
  //         reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
  //         if (reportData.BasedOnType.includes("P")) {
  //             if (reportData.FormID == 1) {
  //                 let formIds = reportData.FormIDs.split(',');
  //                 if (formIds.includes("77")) {
  //                     reportData.FormID = 77;
  //                     Meteor.call('sendNormalEmail', reportData);
  //                 }
  //             } else {
  //                 if (reportData.FormID == 77)
  //                     Meteor.call('sendNormalEmail', reportData);
  //             }
  //         }
  //     });

  //     $('.fullScreenSpin').css('display','inline-block');
  //     jQuery('#tblSalesOrderlist_wrapper .dt-buttons .btntabletopdf').click();
  //     $('.fullScreenSpin').css('display','none');
  //   }, delayTimeAfterSound);
  // },
  'click .btnRefresh': function () {
      $('.fullScreenSpin').css('display','inline-block');
      var currentBeginDate = new Date();
     var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
     let fromDateMonth = (currentBeginDate.getMonth() + 1);
     let fromDateDay = currentBeginDate.getDate();
     if((currentBeginDate.getMonth()+1) < 10){
         fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
     }else{
       fromDateMonth = (currentBeginDate.getMonth()+1);
     }

     if(currentBeginDate.getDate() < 10){
         fromDateDay = "0" + currentBeginDate.getDate();
     }
     var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
     let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
      let templateObject = Template.instance();

      sideBarService.getAllSalesOrderList(initialDataLoad,0).then(function(data) {
          addVS1Data('TSalesOrderEx',JSON.stringify(data)).then(function (datareturn) {

          }).catch(function (err) {

          });
      }).catch(function(err) {

      });

      sideBarService.getAllTSalesOrderListData(prevMonth11Date,toDate, true,initialReportLoad,0).then(function(dataSaleOrder) {
          addVS1Data('TSalesOrderList',JSON.stringify(dataSaleOrder)).then(function (datareturn) {
            sideBarService.getSalesListData(prevMonth11Date, toDate, false, initialReportLoad, 0).then(function (dataSales) {
                addVS1Data("TSalesList", JSON.stringify(dataSales)).then(function (datareturn) {
                  window.open('/salesorderslist','_self');
                  }).catch(function (err) {
                    window.open('/salesorderslist','_self');
                  });
              }).catch(function (err) {
                window.open('/salesorderslist','_self');
              });
          }).catch(function (err) {
            window.open('/salesorderslist','_self');
          });
      }).catch(function(err) {
          window.open('/salesorderslist','_self');
      });


  },

});
