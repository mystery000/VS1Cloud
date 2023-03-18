import { PurchaseBoardService } from '../js/purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { UtilityService } from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./cheque_list.html";
import moment from "moment";
import {CRMService} from "../crm/crm-service";


let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.chequelist.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.getDataTableList = function(data) {
        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.TotalAmount) || 0.00;
        let totalTax = utilityService.modifynegativeCurrencyFormat(data.TotalTax) || 0.00;
        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.TotalAmountInc) || 0.00;
        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.Balance) || 0.00;
        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.Payment) || 0.00;

        if(data.TotalAmount > 0 && data.TotalAmount != 0){
            totalAmountEx = utilityService.modifynegativeCurrencyFormat(-Math.abs(data.TotalAmount)) || 0.00;
        }else{
            totalAmountEx = utilityService.modifynegativeCurrencyFormat(Math.abs(data.TotalAmount)) || 0.00;
        }

        if(data.TotalTax > 0 && data.TotalTax != 0){
            totalTax = utilityService.modifynegativeCurrencyFormat(-Math.abs(data.TotalTax)) || 0.00;
        }else{
            totalTax = utilityService.modifynegativeCurrencyFormat(Math.abs(data.TotalTax)) || 0.00;
        }


        if(data.TotalAmountInc > 0 && data.TotalAmountInc != 0){
            totalAmount = utilityService.modifynegativeCurrencyFormat(-Math.abs(data.TotalAmountInc)) || 0.00;
        }else{
            totalAmount = utilityService.modifynegativeCurrencyFormat(Math.abs(data.TotalAmountInc)) || 0.00;
        }


        if(data.Balance > 0 && data.Balance != 0){
            totalOutstanding = utilityService.modifynegativeCurrencyFormat(-Math.abs(data.Balance)) || 0.00;
        }else{
            totalOutstanding = utilityService.modifynegativeCurrencyFormat(Math.abs(data.Balance)) || 0.00;
        }


        let orderstatus = data.OrderStatus || '';
        if (data.Deleted == true){
            orderstatus = "Deleted";
        } else if (data.SupplierName == ''){
            orderstatus = "Deleted";
        }
        const dataList = [
            //data.OrderDate != '' ? moment(data.OrderDate).format("YYYY/MM/DD") : data.OrderDate,
            `<span style="display:none;">{{item.sortdate}}</span>${data.OrderDate != '' ? moment(data.OrderDate).format("DD/MM/YYYY") : data.OrderDate}`,
            data.PurchaseOrderID || '',
            data.Account || '',
            data.InvoiceNumber || '',
            data.SupplierName || '',
            data.RefNo || '',
            data.Shipping || '',
            data.ForeignExchangeCode || '',
            totalAmountEx || 0.00,
            totalTax || 0.00,
            totalAmount || 0.00,
            totalPaid || 0.00,
            totalOutstanding || 0.00,
            data.Deleted ? "Deleted" : "",
            '' || '',
            '' || '',
            data.Employee || '',
            data.Comments || '',
        ];
        return dataList;
    }

    let headerStructure = [
        //{ index: , label: 'ID', class:'colID', active: false, display: false, width: "0" },
        { index: 0, label: "Order Date", class: "colOrderDate", active: true, display: true, width: "100" },
        { index: 1, label: "ID", class: "colChequeID", active: true, display: true, width: "100" },
        { index: 2, label: "Bank Account", class: "colBankAccount", active: true, display: true, width: "100" },
        { index: 3, label: "PurchaseNo", class: "colPurchaseNo", active: true, display: true, width: "100" },
        { index: 4, label: "Supplier", class: "colSupplier", active: true, display: true, width: "100" },
        { index: 5, label: "Reference", class: "colReference", active: true, display: true, width: "100" },
        { index: 6, label: "Via", class: "colVia", active: true, display: true, width: "100" },
        { index: 7, label: "Currency", class: "colCurrency", active: true, display: true, width: "100" },
        { index: 8, label: "AmountEx", class: "colAmountEx", active: true, display: true, width: "100" },
        { index: 9, label: "Tax", class: "colTax", active: true, display: true, width: "100" },
        { index: 10, label: "Amount", class: "colAmount", active: true, display: true, width: "100" },
        { index: 11, label: "Paid", class: "colPaid", active: true, display: true, width: "100" },
        { index: 12, label: "Outstanding", class: "colOutstanding", active: true, display: true, width: "100" },
        { index: 13, label: "Status", class: "colStatus", active: true, display: true, width: "100" },
        { index: 14, label: "PurchaseCustField1", class: "colPurchaseCustField1", active: false, display: true, width: "100" },
        { index: 15, label: "PurchaseCustField2", class: "colPurchaseCustField2", active: false, display: true, width: "100" },
        { index: 16, label: "Employee", class: "colEmployee", active: false, display: true, width: "100" },
        { index: 17, label: "Comments", class: "colComments", active: true, display: true, width: "100" },
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.chequelist.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let purchaseService = new PurchaseBoardService();
    const supplierList = [];
    let billTable;
    const splashArray = [];
    const dataTableList = [];
    const tableHeaderList = [];
    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    }

    const today = moment().format('DD/MM/YYYY');
    const currentDate = new Date();
    const begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if ((currentDate.getMonth()+1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth()+1);
    }

    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }

    templateObject.getAllFilterChequeData = function (fromDate,toDate, ignoreDate) {
      sideBarService.getAllChequeListData(fromDate,toDate, ignoreDate,initialReportLoad,0).then(function(data) {

        addVS1Data('TChequeList',JSON.stringify(data)).then(function (datareturn) {
            location.reload();
        }).catch(function (err) {
          location.reload();
        });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                templateObject.datatablerecords.set('');
                $('.fullScreenSpin').css('display','none');
                // Meteor._reload.reload();
            });
    };

    $('#tblchequelist tbody').on('click', 'tr', function() {
        var listData = $(this).closest('tr').find('.colChequeID').text() || '';
        var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
        if (listData) {
            if(checkDeleted == "Deleted"){
                swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
            }else{
                FlowRouter.go('/chequecard?id=' + listData);

            }
        }
    });
});

Template.chequelist.events({

    'click #btnNewCheque': function(event) {
        FlowRouter.go('/chequecard');
    },
    'click .btnRefreshCheque': function (event) {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let tableProductList;
        const dataTableList = [];
        var splashArrayInvoiceList = new Array();
        const lineExtaSellItems = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        let dataSearchName = $('#tblchequelist_filter input').val();
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getNewChequeByNameOrID(dataSearchName).then(function (data) {
              $(".btnRefreshCheque").removeClass('btnSearchAlert');
                let lineItems = [];
                let lineItemObj = {};
                if (data.tchequeex.length > 0) {
                   for (let i = 0; i < data.tchequeex.length; i++) {
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalAmount) || 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalTax) || 0.00;
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalAmountInc) || 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalPaid) || 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tchequeex[i].fields.TotalBalance) || 0.00;
                        let orderstatus = data.tchequeex[i].fields.OrderStatus || '';
                        if(data.tchequeex[i].fields.Deleted == true){
                          orderstatus = "Deleted";
                        }else if(data.tchequeex[i].fields.CustomerName == ''){
                          orderstatus = "Deleted";
                        };
                        var dataList = {
                            id: data.tchequeex[i].fields.ID || '',
                            employee: data.tchequeex[i].fields.EmployeeName || '',
                            accountname: data.tchequeex[i].fields.GLAccountName || '',
                            sortdate: data.tchequeex[i].fields.OrderDate != '' ? moment(data.tchequeex[i].fields.OrderDate).format("YYYY/MM/DD") : data.tchequeex[i].fields.OrderDate,
                            orderdate: data.tchequeex[i].fields.OrderDate != '' ? moment(data.tchequeex[i].fields.OrderDate).format("DD/MM/YYYY") : data.tchequeex[i].fields.OrderDate,
                            suppliername: data.tchequeex[i].fields.SupplierName || '',
                            chequeNumber: data.tchequeex[i].fields.SupplierInvoiceNumber || '',
                            reference: data.tchequelist[i].fields.RefNo || '',
                            via: data.tchequelist[i].fields.Shipping || '',
                            currency: data.tchequelist[i].fields.ForeignExchangeCode || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            orderstatus: orderstatus || '',
                            custfield1: '' || '',
                            custfield2: '' || '',
                            comments: data.tchequeex[i].fields.Comments || '',
                        };
                        if(data.tchequeex[i].fields.Deleted == false){
                        splashArrayInvoiceList.push(dataList);
                        }

                    }
                    templateObject.datatablerecords.set(splashArrayInvoiceList);

                    let item = templateObject.datatablerecords.get();
                    $('.fullScreenSpin').css('display', 'none');
                    if (splashArrayInvoiceList) {
                        var datatable = $('#tblchequelist').DataTable();
                        $("#tblchequelist > tbody").empty();
                        for (let x = 0; x < item.length; x++) {
                            $("#tblchequelist > tbody").append(
                                ' <tr class="dnd-moved" id="' + item[x].id + '" style="cursor: pointer;">' +
                                '<td contenteditable="false" class="colSortDate hiddenColumn">' + item[x].sortdate + '</td>' +
                                '<td contenteditable="false" class="colOrderDate" ><span style="display:none;">' + item[x].orderdate + '</span>' + item[x].orderdate + '</td>' +
                                '<td contenteditable="false" class="colChequeID">' + item[x].id + '</td>' +
                                '<td contenteditable="false" class="colBankAccount" >' + item[x].accountname + '</td>' +
                                '<td contenteditable="false" class="colPurchaseNo">' + item[x].chequeNumber + '</td>' +
                                '<td contenteditable="false" class="colSupplier">' + item[x].suppliername + '</td>' +
                                '<td contenteditable="false" class="colReference">' + item[x].reference + '</td>' +
                                '<td contenteditable="false" class="colVia">' + item[x].via + '</td>' +
                                '<td contenteditable="false" class="colCurrency">' + item[x].currency + '</td>' +
                                '<td contenteditable="false" class="colAmountEx" style="text-align: right!important;">' + item[x].totalamountex + '</td>' +
                                '<td contenteditable="false" class="colTax" style="text-align: right!important;">' + item[x].totaltax + '</td>' +
                                '<td contenteditable="false" class="colAmount" style="text-align: right!important;">' + item[x].totalamount + '</td>' +
                                '<td contenteditable="false" class="colPaid" style="text-align: right!important;">' + item[x].totalpaid + '</td>' +
                                '<td contenteditable="false" class="colBalanceOutstanding" style="text-align: right!important;"">' + item[x].totaloustanding + '</td>' +
                                '<td contenteditable="false" class="colStatus">' + item[x].orderstatus + '</td>' +
                                '<td contenteditable="false" class="colPurchaseCustField1 hiddenColumn">' + item[x].custfield1 + '</td>' +
                                '<td contenteditable="false" class="colPurchaseCustField2 hiddenColumn">' + item[x].custfield2 + '</td>' +
                                '<td contenteditable="false" class="colComments">' + item[x].comments + '</td>' +
                                '</tr>');

                        }
                        $('.dataTables_info').html('Showing 1 to ' + data.tchequeex.length + ' of ' + data.tchequeex.length + ' entries');
                        setTimeout(function() {
                            makeNegativeGlobal();
                        }, 100);
                    }

                } else {
                    $('.fullScreenSpin').css('display', 'none');

                    swal({
                        title: 'Question',
                        text: "Cheque does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            FlowRouter.go('/chequecard');
                        } else if (result.dismiss === 'cancel') {
                            //$('#productListModal').modal('toggle');
                        }
                    });
                }
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {

            $(".btnRefresh").trigger("click");
        }
    },

    'keyup #tblchequelist_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshCheque").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshCheque").removeClass('btnSearchAlert');
          }
          if (event.keyCode == 13) {
             $(".btnRefreshCheque").trigger("click");
          }
        },
    // 'click .resetTable': function(event) {
    //   Meteor._reload.reload();
    // },
    // 'click .saveTable': function(event) {
    //     let lineItems = [];
    //     $('.columnSettings').each(function(index) {
    //         const $tblrow = $(this);
    //         const colTitle = $tblrow.find(".divcolumn").text() || '';
    //         const colWidth = $tblrow.find(".custom-range").val() || 0;
    //         const colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
    //         let colHidden = false;
    //         colHidden = !$tblrow.find(".custom-control-input").is(':checked');
    //         let lineItemObj = {
    //             index: index,
    //             label: colTitle,
    //             hidden: colHidden,
    //             width: colWidth,
    //             thclass: colthClass
    //         };
    //         lineItems.push(lineItemObj);
    //     });
    //
    //     $('#myModal2').modal('toggle');
    // },
    // 'blur .divcolumn': function(event) {
    //     let columData = $(event.target).text();
    //     let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
    //     var datable = $('#tblchequelist').DataTable();
    //     var title = datable.column(columnDatanIndex).header();
    //     $(title).html(columData);
    //
    // },
    // 'change .rngRange': function(event) {
    //     let range = $(event.target).val();
    //     let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    //     const datable = $('#tblchequelist th');
    //     $.each(datable, function(i, v) {
    //         if (v.innerText == columnDataValue) {
    //             let className = v.className;
    //             let replaceClass = className.replace(/ /g, ".");
    //             $("." + replaceClass + "").css('width', range + 'px');
    //
    //         }
    //     });
    // },
    // 'click .btnOpenSettings': function(event) {
    //     let templateObject = Template.instance();
    //     const columns = $('#tblchequelist th');
    //     const tableHeaderList = [];
    //     let sTible = "";
    //     let sWidth = "";
    //     let sIndex = "";
    //     let sVisible = "";
    //     let columVisible = false;
    //     let sClass = "";
    //     $.each(columns, function(i, v) {
    //         if (v.hidden == false) {
    //             columVisible = true;
    //         }
    //         if ((v.className.includes("hiddenColumn"))) {
    //             columVisible = false;
    //         }
    //         sWidth = v.style.width.replace('px', "");
    //         let datatablerecordObj = {
    //             sTitle: v.innerText || '',
    //             sWidth: sWidth || '',
    //             sIndex: v.cellIndex || 0,
    //             sVisible: columVisible || false,
    //             sClass: v.className || ''
    //         };
    //         tableHeaderList.push(datatablerecordObj);
    //     });
    //     templateObject.tableheaderrecords.set(tableHeaderList);
    // },
    'click #exportbtn': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblchequelist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        const currentBeginDate = new Date();
        const begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if((currentBeginDate.getMonth()+1) < 10){
            fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
        } else {
            fromDateMonth = (currentBeginDate.getMonth()+1);
        }
        if(currentBeginDate.getDate() < 10){
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        const toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

        sideBarService.getAllPurchasesList(prevMonth11Date,toDate, true,initialReportLoad,0).then(function(data) {
            addVS1Data('TPurchasesList',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });
        sideBarService.getAllChequeListData(prevMonth11Date,toDate, true,initialReportLoad,0).then(function(dataCheque) {
            addVS1Data('TChequeList', JSON.stringify(dataCheque)).then(function(datareturn) {
              sideBarService.getAllChequeList(initialDataLoad,0).then(function(data) {
                  addVS1Data('TCheque', JSON.stringify(data)).then(function(datareturn) {
                      window.open('/chequelist', '_self');
                  }).catch(function(err) {
                     window.open('/chequelist', '_self');
                  });
              }).catch(function(err) {
                  window.open('/chequelist', '_self');
              });
            }).catch(function(err) {
              sideBarService.getAllChequeList(initialDataLoad,0).then(function(data) {
                  addVS1Data('TCheque', JSON.stringify(data)).then(function(datareturn) {
                      window.open('/chequelist', '_self');
                  }).catch(function(err) {
                     window.open('/chequelist', '_self');
                  });
              }).catch(function(err) {
                  window.open('/chequelist', '_self');
              });
            });
        }).catch(function(err) {
            window.open('/chequelist', '_self');
        });
    },
    'change #dateTo': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        setTimeout(function(){
            const dateFrom = new Date($("#dateFrom").datepicker("getDate"));
            const dateTo = new Date($("#dateTo").datepicker("getDate"));

            let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
            let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
            //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
            const formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
            //templateObject.dateAsAt.set(formatDate);
            if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

            } else {
              templateObject.getAllFilterChequeData(formatDateFrom,formatDateTo, false);
            }
        },500);
    },
    'change #dateFrom': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        setTimeout(function(){
            const dateFrom = new Date($("#dateFrom").datepicker("getDate"));
            const dateTo = new Date($("#dateTo").datepicker("getDate"));
            let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
            let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
            //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
            const formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
            //templateObject.dateAsAt.set(formatDate);
            if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

            } else {
                templateObject.getAllFilterChequeData(formatDateFrom,formatDateTo, false);
            }
        },500);
    },
    'click #today': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentBeginDate = new Date();
        const begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if((currentBeginDate.getMonth()+1) < 10){
            fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
        } else {
          fromDateMonth = (currentBeginDate.getMonth()+1);
        }
        if(currentBeginDate.getDate() < 10){
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        const toDateERPFrom = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        const toDateERPTo = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        const toDateDisplayFrom = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        const toDateDisplayTo = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterChequeData(toDateERPFrom,toDateERPTo, false);
    },
    'click #lastweek': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentBeginDate = new Date();
        const begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if((currentBeginDate.getMonth()+1) < 10){
            fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
        } else {
          fromDateMonth = (currentBeginDate.getMonth()+1);
        }
        if(currentBeginDate.getDate() < 10){
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        const toDateERPFrom = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay - 7);
        const toDateERPTo = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        const toDateDisplayFrom = (fromDateDay - 7) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        const toDateDisplayTo = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterChequeData(toDateERPFrom,toDateERPTo, false);
    },
    'click #lastMonth': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentDate = new Date();
        const prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);
        const formatDateComponent = function (dateComponent) {
            return (dateComponent < 10 ? '0' : '') + dateComponent;
        };
        const formatDate = function (date) {
            return formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };
        const formatDateERP = function (date) {
            return date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };
        const fromDate = formatDate(prevMonthFirstDate);
        const toDate = formatDate(prevMonthLastDate);
        $("#dateFrom").val(fromDate);
        $("#dateTo").val(toDate);
        const getLoadDate = formatDateERP(prevMonthLastDate);
        let getDateFrom = formatDateERP(prevMonthFirstDate);
        templateObject.getAllFilterChequeData(getDateFrom,getLoadDate, false);
    },
    'click #lastQuarter': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentDate = new Date();
        const begunDate = moment(currentDate).format("DD/MM/YYYY");
        function getQuarter(d) {
            d = d || new Date();
            const m = Math.floor(d.getMonth() / 3) + 2;
            return m > 4 ? m - 4 : m;
        }
        const quarterAdjustment = (moment().month() % 3) + 1;
        const lastQuarterEndDate = moment().subtract({
            months: quarterAdjustment
        }).endOf('month');
        const lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
            months: 2
        }).startOf('month');
        const lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
        const lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");
        $("#dateFrom").val(lastQuarterStartDateFormat);
        $("#dateTo").val(lastQuarterEndDateFormat);
        let fromDateMonth = getQuarter(currentDate);
        const quarterMonth = getQuarter(currentDate);
        let fromDateDay = currentDate.getDate();
        const getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
        let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
        templateObject.getAllFilterChequeData(getDateFrom,getLoadDate, false);
    },
    'click #last12Months': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        const currentDate = new Date();
        const begunDate = moment(currentDate).format("DD/MM/YYYY");
        let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
        let fromDateDay = currentDate.getDate();
        if ((currentDate.getMonth()+1) < 10) {
            fromDateMonth = "0" + (currentDate.getMonth()+1);
        }
        if (currentDate.getDate() < 10) {
            fromDateDay = "0" + currentDate.getDate();
        }

        const fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
        $("#dateFrom").val(fromDate);
        $("#dateTo").val(begunDate);

        const currentDate2 = new Date();
        let fromDateMonth2;
        if ((currentDate2.getMonth()+1) < 10) {
            fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
        }
        let fromDateDay2;
        if (currentDate2.getDate() < 10) {
            fromDateDay2 = "0" + currentDate2.getDate();
        }
        const getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
        templateObject.getAllFilterChequeData(getDateFrom,getLoadDate, false);
    },
    'click #ignoreDate': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
        templateObject.getAllFilterChequeData('', '', true);
    },
    'click .printConfirm': function(event) {
        playPrintAudio();
        setTimeout(function(){
        let values = [];
        let basedOnTypeStorages = Object.keys(localStorage);
        basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
            let employeeId = storage.split('_')[2];
            return storage.includes('BasedOnType_') && employeeId == localStorage.getItem('mySessionEmployeeLoggedID')
        });
        let i = basedOnTypeStorages.length;
        if (i > 0) {
            while (i--) {
                values.push(localStorage.getItem(basedOnTypeStorages[i]));
            }
        }
        values.forEach(value => {
            let reportData = JSON.parse(value);
            reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
            if (reportData.BasedOnType.includes("P")) {
                if (reportData.FormID == 1) {
                    let formIds = reportData.FormIDs.split(',');
                    if (formIds.includes("18")) {
                        reportData.FormID = 18;
                        Meteor.call('sendNormalEmail', reportData);
                    }
                } else {
                    if (reportData.FormID == 18)
                        Meteor.call('sendNormalEmail', reportData);
                }
            }
        });

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblchequelist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
    }

});

Template.chequelist.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.orderdate == 'NA') {
                return 1;
            } else if (b.orderdate == 'NA') {
                return -1;
            }
            return (a.orderdate.toUpperCase() > b.orderdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    purchasesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: localStorage.getItem('mycloudLogonID'), PrefName: 'tblchequelist' });
    },
    formname: () => {
        return chequeSpelling;
    },

    apiFunction:function() {
        let sideBarService = new SideBarService();
        return sideBarService.getAllChequeListData;
    },

    searchAPI: function() {
        return sideBarService.getAllChequeListData;
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
        return ["dateFrom", "dateTo", "ignoredate", "limitCount", "limitFrom", "deleteFilter"];
    },
});
Template.registerHelper('equals', function(a, b) {
    return a === b;
});
