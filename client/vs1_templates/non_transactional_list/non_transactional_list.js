import { ContactService } from "../../contacts/contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import XLSX from 'xlsx';
import { SideBarService } from '../../js/sidebar-service';
import { ProductService } from '../../product/product-service';
import { ManufacturingService } from "../../manufacture/manufacturing-service";
import { CRMService } from "../../crm/crm-service";
import { ReportService } from "../../reports/report-service";
import { FixedAssetService } from "../../fixedassets/fixedasset-service";
import '../../lib/global/indexdbstorage.js';
import TableHandler from '../../js/Table/TableHandler';
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './non_transactional_list.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let contactService = new ContactService();
let productService = new ProductService();
let manufacturingService = new ManufacturingService();
let crmService = new CRMService();
let reportService = new ReportService();
let fixedAssetService = new FixedAssetService();

import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import PayrollSettingsOvertimes from "../../js/Api/Model/PayrollSettingsOvertimes";


Template.non_transactional_list.inheritsHooksFrom('export_import_print_display_button');

Template.non_transactional_list.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.transactiondatatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();
    templateObject.non_trans_displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
    templateObject.tablename = new ReactiveVar();
    templateObject.currentproductID = new ReactiveVar();
    templateObject.currenttype = new ReactiveVar();

    templateObject.autorun(() => {
        // /*added by sobura
        const curdata = Template.currentData();
        let currentProductID = curdata.productID || "";
        templateObject.currentproductID.set(currentProductID);
        let currenttype = curdata.type || "";
        templateObject.currenttype.set(currenttype);
        
        templateObject.getAllProductRecentTransactions = async function(deptname) {
        // templateObject.initCustomFieldDisplaySettings("", currenttablename);
            getVS1Data('T_VS1_Report_Productmovement').then(function(dataObject) {
                let need_API = true;
                if(dataObject.length > 0)
                {
                    let data = JSON.parse(dataObject[0].data);
                    for(let i=0;i<data.t_vs1_report_productmovement.length;i++){
                        let data_productID = data.t_vs1_report_productmovement[i].ProductID;
                        
                        if(parseInt(currentProductID) == data_productID){
                            need_API = false;
                            break;
                        }
                    }
                }
                if(currentProductID){
                    if(need_API){
                        productService.getProductRecentTransactionsAll(currentProductID).then(function(data) {
                        addVS1Data("T_VS1_Report_Productmovement", JSON.stringify(data));
                        templateObject.displayAllProductRecentTransactions(data,deptname)
                    });
                    }
                    else
                    {
                        let data = JSON.parse(dataObject[0].data);
                        templateObject.displayAllProductRecentTransactions(data,deptname);
                    }
                }
            });
        };
        templateObject.displayAllProductRecentTransactions = function(data,deptname) {
                let currentProductID = templateObject.currentproductID.get();
                let recentTransList = new Array();
                for (let i = 0; i < data.t_vs1_report_productmovement.length; i++) {
                    // let recentTranObject = {
                    //     date: data.t_vs1_report_productmovement[i].TransactionDate != '' ? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY") : data.t_vs1_report_productmovement[i].TransactionDate,
                    //     type: data.t_vs1_report_productmovement[i].TranstypeDesc,
                    //     transactionno: data.t_vs1_report_productmovement[i].TransactionNo,
                    //     reference: data.t_vs1_report_productmovement[i].TransactionNo,
                    //     quantity: data.t_vs1_report_productmovement[i].Qty,
                    //     unitPrice: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].Price),
                    //     total: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].TotalPrice)
                    // };
                    if(parseInt(currentProductID) == data.t_vs1_report_productmovement[i].ProductID && (deptname === "all" || deptname === data.t_vs1_report_productmovement[i].TranstypeDesc)){
                        let recentTranObject = [
                            data.t_vs1_report_productmovement[i].TransactionDate != '' ? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY") : data.t_vs1_report_productmovement[i].TransactionDate,
                            data.t_vs1_report_productmovement[i].TranstypeDesc,
                            data.t_vs1_report_productmovement[i].TransactionNo,
                            data.t_vs1_report_productmovement[i].Qty,
                            utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].Price),
                            utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].TotalPrice)
                        ];
                        recentTransList.push(recentTranObject);
                    }
                }
                let columnData = [];
                let displayfields = templateObject.non_trans_displayfields.get();
                if( displayfields.length > 0 ){
                    displayfields.forEach(function( item ){
                        columnData.push({
                            className: ( item.active )? item.class : `col${item.class} hiddenColumn`,
                            targets: [item.id],
                        })
                    });
                }
                templateObject.transactiondatatablerecords.set(recentTransList);
                let currenttablename = templateObject.tablename.get();
                setTimeout(function() {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    $('#' + currenttablename).DataTable({
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        data:recentTransList,
                        columnDefs: columnData,
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [[0, "desc"],[3, "desc"]],
                        action: function() {
                            $('#productrecentlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
                            //if(checkurlIgnoreDate == 'true'){

                            //}else{
                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblPaymentOverview_ellipsis').addClass('disabled');

                            if (oSettings._iDisplayLength == -1) {
                                if (oSettings.fnRecordsDisplay() > 150) {
                                    $('.paginate_button.page-item.previous').addClass('disabled');
                                    $('.paginate_button.page-item.next').addClass('disabled');
                                }
                            } else {}
                            if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                $('.paginate_button.page-item.next').addClass('disabled');
                            }
                            $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                .on('click', function() {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    let dataLenght = oSettings._iDisplayLength;

                                    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                                    var dateTo = new Date($("#dateTo").datepicker("getDate"));

                                    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                                    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                                    if(data.Params.IgnoreDates == true){
                                        sideBarService.getTPaymentList(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                                            getVS1Data('TPaymentList').then(function(dataObjectold) {
                                                if (dataObjectold.length == 0) {} else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tpaymentlist: thirdaryData
                                                    }

                                                    addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function(err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function(err) {});

                                        }).catch(function(err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    } else {
                                        sideBarService.getTPaymentList(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                                            getVS1Data('TPaymentList').then(function(dataObjectold) {
                                                if (dataObjectold.length == 0) {} else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tpaymentlist: thirdaryData
                                                    }

                                                    addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function(err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function(err) {});

                                        }).catch(function(err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });

                                    }

                                });

                            //}
                            setTimeout(function() {
                                // MakeNegative();
                            }, 100);
                        },

                    }).on('page', function() {}).on('column-reorder', function() {});
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                $('#productrecentlist tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

                    if ((listData) && (transactiontype)) {
                        if (transactiontype === 'Quote') {
                            window.open('/quotecard?id=' + listData, '_self');
                        } else if (transactiontype === 'Sales Order') {
                            window.open('/salesordercard?id=' + listData, '_self');
                        } else if (transactiontype === 'Invoice') {
                            window.open('/invoicecard?id=' + listData, '_self');
                        } else if (transactiontype === 'Purchase Order') {
                            window.open('/purchaseordercard?id=' + listData, '_self');
                        } else if (transactiontype === 'Bill') {
                            //window.open('/billcard?id=' + listData,'_self');
                        } else if (transactiontype === 'Credit') {
                            //window.open('/creditcard?id=' + listData,'_self');
                        }

                    }
                });

                // $('.product_recent_trans').css('display', 'block');
                // $([document.documentElement, document.body]).animate({
                //     scrollTop: $(".product_recent_trans").offset().top
                // }, 2000);
                $('.fullScreenSpin').css('display', 'none');
            // }).catch(function(err) {

            //     $('.fullScreenSpin').css('display', 'none');
            //     $('.product_recent_trans').css('display', 'block');
            //     $([document.documentElement, document.body]).animate({
            //         scrollTop: $(".product_recent_trans").offset().top
            //     }, 2000);

            //     //Bert.alert('<strong>' + err + '</strong>!', 'deleting products failed');
            // });
        // });
            // Meteor.render(Template.non_transactional_list);
            // templateObject.getAllProductRecentTransactions(currenttype);

        }
        templateObject.getAllProductRecentTransactions(currenttype);
        //added by sobura*/
    });
});

Template.non_transactional_list.onRendered(function() {
    let templateObject = Template.instance();
    const customerList = [];
    let usedCategories = [];
    let salesOrderTable;
    var splashArray = new Array();
    var splashArrayCustomerList = new Array();
    const lineCustomerItems = [];
    const dataTableList = [];
    const tableHeaderList = [];

    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    };

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });

        $("td.colStatus").each(function() {
            if ($(this).text() == "In-Active") $(this).addClass("text-deleted");
            if ($(this).text() == "Deleted") $(this).addClass("text-deleted");
            if ($(this).text() == "Full") $(this).addClass("text-fullyPaid");
            if ($(this).text() == "Part") $(this).addClass("text-partialPaid");
            if ($(this).text() == "Rec") $(this).addClass("text-reconciled");

        });
    };

    var url = FlowRouter.current().path;
    let currenttablename = templateObject.data.tablename || "";
    
    
    templateObject.tablename.set(currenttablename);
    let currentproductID = templateObject.data.productID || "";
    templateObject.currentproductID.set(currentproductID);
    let currenttype = templateObject.data.type || "";
    templateObject.currenttype.set(currenttype);
    


    // set initial table rest_data
    templateObject.init_reset_data = function() {
        let reset_data = [];
        if (currenttablename == "tblcontactoverview") {
            reset_data = [
                { index: 0, label: '', class: 'chkBox', active: false, display: true, width: "10" },
                { index: 1, label: '#ID', class: 'colContactID', active: false, display: true, width: "10" },
                { index: 2, label: 'Contact Name', class: 'colClientName', active: true, display: true, width: "200" },
                { index: 3, label: 'Type', class: 'colType', active: true, display: true, width: "130" },
                { index: 4, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
                { index: 5, label: 'Mobile', class: 'colMobile', active: false, display: true, width: "95" },
                { index: 6, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "90" },
                { index: 7, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "110" },
                { index: 8, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
                { index: 9, label: 'Credit Limit', class: 'colCreditLimit', active: false, display: true, width: "90" },
                { index: 10, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "120" },
                { index: 11, label: 'Email', class: 'colEmail', active: false, display: true, width: "200" },
                { index: 12, label: 'Custom Field 1', class: 'colCustFld1', active: false, display: true, width: "120" },
                { index: 13, label: 'Custom Field 2', class: 'colCustFld2', active: false, display: true, width: "120" },
                { index: 14, label: 'Address', class: 'colAddress', active: true, display: true, width: "" },
                { index: 15, label: 'City/Suburb', class: 'colSuburb', active: false, display: true, width: "120" },
                { index: 16, label: 'State', class: 'colState', active: false, display: true, width: "120" },
                { index: 17, label: 'Postcode', class: 'colPostcode', active: false, display: true, width: "80" },
                { index: 18, label: 'Country', class: 'colCountry', active: false, display: true, width: "200" },
                { index: 19, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
            ];
        } else if (currenttablename == 'tblContactlist') {
            reset_data = [
                { index: 0, label: '', class: 'chkBox', active: true, display: true, width: "10" },
                { index: 1, label: '#ID', class: 'colContactID', active: false, display: true, width: "10" },
                { index: 2, label: 'Contact Name', class: 'colClientName', active: true, display: true, width: "200" },
                { index: 3, label: 'Type', class: 'colType', active: true, display: true, width: "130" },
                { index: 4, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
                { index: 5, label: 'Mobile', class: 'colMobile', active: false, display: true, width: "95" },
                { index: 6, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "90" },
                { index: 7, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "110" },
                { index: 8, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
                { index: 9, label: 'Credit Limit', class: 'colCreditLimit', active: false, display: true, width: "90" },
                { index: 10, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "120" },
                { index: 11, label: 'Email', class: 'colEmail', active: true, display: true, width: "200" },
                { index: 12, label: 'Custom Field 1', class: 'colCustFld1', active: false, display: true, width: "120" },
                { index: 13, label: 'Custom Field 2', class: 'colCustFld2', active: false, display: true, width: "120" },
                { index: 14, label: 'Address', class: 'colAddress', active: true, display: true, width: "" },
                { index: 15, label: 'City/Suburb', class: 'colSuburb', active: false, display: true, width: "120" },
                { index: 16, label: 'State', class: 'colState', active: false, display: true, width: "120" },
                { index: 17, label: 'Postcode', class: 'colPostcode', active: false, display: true, width: "80" },
                { index: 18, label: 'Country', class: 'colCountry', active: false, display: true, width: "200" },
                { index: 19, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
            ];
        } else if (currenttablename == "tblEmployeelist") {
            reset_data = [
                { index: 0, label: 'Emp #', class: 'colEmployeeNo', active: false, display: true, width: "10" },
                { index: 1, label: 'Employee Name', class: 'colEmployeeName', active: true, display: true, width: "200" },
                { index: 2, label: 'First Name', class: 'colFirstName', active: true, display: true, width: "100" },
                { index: 3, label: 'Last Name', class: 'colLastName', active: true, display: true, width: "100" },
                { index: 4, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
                { index: 5, label: 'Mobile', class: 'colMobile', active: false, display: true, width: "95" },
                { index: 6, label: 'Email', class: 'colEmail', active: true, display: true, width: "200" },
                { index: 7, label: 'Department', class: 'colDepartment', active: true, display: true, width: "80" },
                { index: 8, label: 'Custom Field 1', class: 'colCustFld1', active: false, display: true, width: "120" },
                { index: 9, label: 'Custom Field 2', class: 'colCustFld2', active: false, display: true, width: "120" },
                { index: 10, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
                { index: 11, label: 'Address', class: 'colAddress', active: true, display: true, width: "" },
                { index: 12, label: 'City/Suburb', class: 'colSuburb', active: false, display: true, width: "120" },
                { index: 13, label: 'State', class: 'colState', active: false, display: true, width: "120" },
                { index: 14, label: 'Postcode', class: 'colPostcode', active: false, display: true, width: "80" },
                { index: 15, label: 'Country', class: 'colCountry', active: false, display: true, width: "200" },
            ];
        } else if (currenttablename == "tblAccountOverview" || currenttablename == "tblDashboardAccountChartList" || currenttablename == "tblInventoryAccountList" || currenttablename == "tblExpenseAccountList") {
            let bsbname = "Branch Code";
            if (localStorage.getItem("ERPLoggedCountry") === "Australia") {
                bsbname = "BSB";
            }
            if (currenttablename == "tblAccountOverview" ||currenttablename == "tblInventoryAccountList" || currenttablename == "tblExpenseAccountList") {
                reset_data = [
                    { index: 0, label: '#ID', class: 'AccountId', active: false, display: true, width: "10" },
                    { index: 1, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "200" },
                    { index: 2, label: 'Description', class: 'colDescription', active: true, display: true, width: "" },
                    { index: 3, label: 'Account No', class: 'colAccountNo', active: true, display: true, width: "90" },
                    { index: 4, label: 'Type', class: 'colType', active: true, display: true, width: "60" },
                    { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
                    { index: 6, label: 'Tax Code', class: 'colTaxCode', active: true, display: true, width: "80" },
                    { index: 7, label: 'Bank Name', class: 'colBankName', active: false, display: true, width: "120" },
                    { index: 8, label: 'Bank Acc Name', class: 'colBankAccountName', active: true, display: true, width: "120" },
                    { index: 9, label: bsbname, class: 'colBSB', active: true, display: true, width: "95" },
                    { index: 10, label: 'Bank Acc No', class: 'colBankAccountNo', active: true, display: true, width: "120" },
                    { index: 11, label: 'Card Number', class: 'colCardNumber', active: false, display: true, width: "120" },
                    { index: 12, label: 'Expiry Date', class: 'colExpiryDate', active: false, display: true, width: "60" },
                    { index: 13, label: 'CVC', class: 'colCVC', active: false, display: true, width: "60" },
                    { index: 14, label: 'Swift Code', class: 'colExtra', active: false, display: true, width: "80" },
                    { index: 15, label: 'Routing Number', class: 'colAPCANumber', active: false, display: true, width: "120" },
                    { index: 16, label: 'Header', class: 'colIsHeader', active: false, display: true, width: "60" },
                    { index: 17, label: 'Use Receipt Claim', class: 'colUseReceiptClaim', active: false, display: true, width: "60" },
                    { index: 18, label: 'Category', class: 'colExpenseCategory', active: false, display: true, width: "80" },
                    { index: 19, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
                    { index: 20, label: 'Level1', class: 'colLevel1', active: false, display: true, width: "80" },
                    { index: 21, label: 'Level2', class: 'colLevel2', active: false, display: true, width: "80" },
                    { index: 22, label: 'Level3', class: 'colLevel3', active: false, display: true, width: "80" },

                    // { index: 1, label: 'Account Name', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 2, label: 'Description', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 3, label: 'Account Tree', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 4, label: 'Balance', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 5, label: 'Total Balance', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 6, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 7, label: 'Bank Account Name', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 8, label: 'BSB', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 9, label: 'Bank Acc No', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 10, label: 'Tax Code', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 11, label: 'Tax Code Description', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 12, label: 'Active', class:'colAccountName', active: false, display: true, width: "" },

                    // { index: 13, label: 'Account No', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 14, label: 'Account Group', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 15, label: 'Bank Number', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 19, label: 'Level4', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 20, label: 'Budget Accountno', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 21, label: 'Full Account Name', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 22, label: 'Sort Order', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 23, label: 'Allow Expense Claim?', class:'colAccountName', active: false, display: true, width: "" },
                ];
            } else {
                reset_data = [
                    { index: 0, label: '#ID', class: 'AccountId', active: false, display: true, width: "10" },
                    { index: 1, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "200" },
                    { index: 2, label: 'Description', class: 'colDescription', active: true, display: true, width: "" },
                    { index: 3, label: 'Account No', class: 'colAccountNo', active: true, display: true, width: "90" },
                    { index: 4, label: 'Type', class: 'colType', active: true, display: true, width: "60" },
                    { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
                    { index: 6, label: 'Tax Code', class: 'colTaxCode', active: true, display: true, width: "80" },
                    { index: 7, label: 'Bank Name', class: 'colBankName', active: false, display: true, width: "120" },
                    { index: 8, label: 'Bank Acc Name', class: 'colBankAccountName', active: true, display: true, width: "120" },
                    { index: 9, label: bsbname, class: 'colBSB', active: true, display: true, width: "95" },
                    { index: 10, label: 'Bank Acc No', class: 'colBankAccountNo', active: true, display: true, width: "120" },
                    { index: 11, label: 'Card Number', class: 'colCardNumber', active: false, display: true, width: "120" },
                    { index: 12, label: 'Expiry Date', class: 'colExpiryDate', active: false, display: true, width: "60" },
                    { index: 13, label: 'CVC', class: 'colCVC', active: false, display: true, width: "60" },
                    { index: 14, label: 'Swift Code', class: 'colExtra', active: false, display: true, width: "80" },
                    { index: 15, label: 'Routing Number', class: 'colAPCANumber', active: false, display: true, width: "120" },
                    { index: 16, label: 'Header', class: 'colIsHeader', active: false, display: true, width: "60" },
                    { index: 17, label: 'Use Receipt Claim', class: 'colUseReceiptClaim', active: false, display: true, width: "60" },
                    { index: 18, label: 'Category', class: 'colExpenseCategory', active: false, display: true, width: "80" },
                    { index: 19, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },

                    // { index: 1, label: 'Account Name', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 2, label: 'Description', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 3, label: 'Account Tree', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 4, label: 'Balance', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 5, label: 'Total Balance', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 6, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 7, label: 'Bank Account Name', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 8, label: 'BSB', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 9, label: 'Bank Acc No', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 10, label: 'Tax Code', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 11, label: 'Tax Code Description', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 12, label: 'Active', class:'colAccountName', active: false, display: true, width: "" },

                    // { index: 13, label: 'Account No', class:'colAccountName', active: true, display: true, width: "" },
                    // { index: 14, label: 'Account Group', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 15, label: 'Bank Number', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 19, label: 'Level4', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 20, label: 'Budget Accountno', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 21, label: 'Full Account Name', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 22, label: 'Sort Order', class:'colAccountName', active: false, display: true, width: "" },
                    // { index: 23, label: 'Allow Expense Claim?', class:'colAccountName', active: false, display: true, width: "" },
                ];
            }
        } else if (currenttablename == "tblClienttypeList") { //Do Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colClientTypeID', active: false, display: true, width: "10" },
                { index: 1, label: 'Type Name', class: 'colTypeName', active: true, display: true, width: "200" },
                { index: 2, label: 'Description', class: 'colDescription', active: true, display: true, width: "" },
                { index: 3, label: 'Credit Limit', class: 'colCreditLimit', active: false, display: true, width: "200" },
                { index: 4, label: 'Default Accounts', class: 'colDefaultAccount', active: false, display: true, width: "200" },
                { index: 5, label: 'Grace Period', class: 'colGracePeriodtus', active: false, display: true, width: "100" },
                { index: 6, label: 'Default Discount', class: 'colDefaultDiscount', active: true, display: true, width: "200" },
                { index: 7, label: 'Terms', class: 'colTerms', active: true, display: true, width: "200" },
                { index: 8, label: 'Preferred Payment Method', class: 'colPreferedPaymentMethod', active: true, display: true, width: "300" },
                { index: 9, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
            ];
        } else if (currenttablename == "tblLeadStatusList") { //Done Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colLeadStatusID', active: false, display: true, width: "10" },
                { index: 1, label: 'Type Code', class: 'colLeadTypeCode', active: false, display: true, width: "200" },
                { index: 2, label: 'Lead Status Name', class: 'colStatusName', active: true, display: true, width: "200" },
                { index: 3, label: 'Description', class: 'colDescription', active: true, display: true, width: "" },
                { index: 4, label: 'Is Default', class: 'colIsDefault', active: false, display: true, width: "100" },
                { index: 5, label: 'Expected Quantity per Month', class: 'colQuantity', active: true, display: true, width: "250" },
                { index: 6, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
            ];
        } else if (currenttablename == "tblDepartmentList") { //Done Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colDeptID', active: false, display: true, width: "10" },
                { index: 1, label: 'Department Name', class: 'colDeptClassName', active: true, display: true, width: "200" },
                { index: 2, label: 'Description', class: 'colDescription', active: true, display: true, width: "" },
                { index: 3, label: 'Header Department', class: 'colHeaderDept', active: false, display: true, width: "250" },
                { index: 4, label: 'Full Department Name', class: 'colFullDeptName', active: false, display: true, width: "250" },
                { index: 5, label: 'Department Tree', class: 'colDeptTree', active: false, display: true, width: "250" },
                { index: 6, label: 'Site Code', class: 'colSiteCode', active: true, display: true, width: "100" },
                { index: 7, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
            ];
        } else if (currenttablename == "tblPaymentMethodList") { //Done Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colPayMethodID', active: false, display: true, width: "10" },
                { index: 1, label: 'Payment Method Name', class: 'colName', active: true, display: true, width: "" },
                { index: 2, label: 'Is Credit Card', class: 'colIsCreditCard', active: true, display: true, width: "105" },
                { index: 3, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
            ];
        } else if (currenttablename == "tblTermsList") { //Do Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colTermsID', active: false, display: true, width: "10" },
                { index: 1, label: 'Term Name', class: 'colName', active: true, display: true, width: "150" },
                { index: 2, label: 'Terms Amount', class: 'colTermsAmount', active: true, display: true, width: "120" },
                { index: 3, label: 'EOM', class: 'colIsEOM', active: true, display: true, width: "50" },
                { index: 4, label: 'EOM Plus', class: 'colIsEOMPlus', active: true, display: true, width: "80" },
                { index: 5, label: 'Description', class: 'colDescription', active: true, display: true, width: "" },
                { index: 6, label: 'Customer Default', class: 'colCustomerDef', active: true, display: true, width: "130" },
                { index: 7, label: 'Supplier Default', class: 'colSupplierDef', active: true, display: true, width: "130" },
                { index: 8, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
                { index: 9, label: 'Is Progress Payment', class: 'colIsProgressPayment', active: false, display: true, width: "200" },
                { index: 10, label: 'Required', class: 'colRequired', active: false, display: true, width: "100" },
                { index: 11, label: 'Early Payment Discount', class: 'colEarlyPayDiscount', active: false, display: true, width: "200" },
                { index: 12, label: 'Early Payment Days', class: 'colEarlyPay', active: false, display: true, width: "150" },
                { index: 13, label: 'Payment Type', class: 'colProgressPayType', active: false, display: true, width: "150" },
                { index: 14, label: 'Payment Duration', class: 'colProgressPayDuration', active: false, display: true, width: "100" },
                { index: 15, label: 'Pay On Sale Date', class: 'colPayOnSale', active: false, display: true, width: "150" },
            ];
        } else if (currenttablename == "tblUOMList") { //Do Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colUOMID', active: false, display: true, width: "10" },
                { index: 1, label: 'Unit Name', class: 'colUOMName', active: true, display: true, width: "200" },
                { index: 2, label: 'Description', class: 'colUOMDesc', active: true, display: true, width: "" },
                { index: 3, label: 'Product Name', class: 'colUOMProduct', active: true, display: true, width: "250" },
                { index: 4, label: 'Base Unit Name', class: 'colUOMBaseUnitName', active: false, display: true, width: "150" },
                { index: 5, label: 'Base Unit ID', class: 'colUOMBaseUnitID', active: false, display: true, width: "100" },
                { index: 6, label: 'Part ID', class: 'colUOMPartID', active: false, display: true, width: "100" },
                { index: 7, label: 'Unit Multiplier', class: 'colUOMMultiplier', active: true, display: true, width: "140" },
                { index: 8, label: 'Sale Default', class: 'colUOMSalesDefault', active: true, display: true, width: "140" },
                { index: 9, label: 'Purchase Default', class: 'colUOMPurchaseDefault', active: true, display: true, width: "170" },
                { index: 10, label: 'Weight', class: 'colUOMWeight', active: true, display: true, width: "100" },
                { index: 11, label: 'No of Boxes', class: 'colUOMNoOfBoxes', active: true, display: true, width: "120" },
                { index: 12, label: 'Height', class: 'colUOMHeight', active: true, display: true, width: "100" },
                { index: 13, label: 'Width', class: 'colUOMWidth', active: true, display: true, width: "100" },
                { index: 14, label: 'Length', class: 'colUOMLength', active: true, display: true, width: "100" },
                { index: 15, label: 'Volume', class: 'colUOMVolume', active: true, display: true, width: "100" },
                { index: 16, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
                { index: 17, label: 'Qty in Sales', class: 'colQtyinSales', active: false, display: true, width: "150" },
            ];
        } else if (currenttablename == "tblBOMList") { //Do Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colPayMethodID', active: false, display: true },
                { index: 1, label: 'Product Name', class: 'colName', active: true, display: true },
                { index: 2, label: 'Product Description', class: 'colDescription', active: true, display: true },
                { index: 3, label: 'Process', class: 'colProcess', active: true, display: true },
                { index: 4, label: 'Stock Count', class: 'colStockCount', active: true, display: true },
                { index: 5, label: 'raws', class: 'colRaws', active: true, display: true },
                { index: 6, label: 'attachments', class: 'colAttachments', active: true, display: true }
            ];
        } else if (currenttablename == "tblSupplierlist") { //Done Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colSupplierID', active: false, display: true, width: "10" },
                { index: 1, label: 'Company', class: 'colCompany', active: true, display: true, width: "200" },
                { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
                { index: 3, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "90" },
                { index: 4, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "110" },
                { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
                { index: 6, label: 'Credit Limit', class: 'colCreditLimit', active: false, display: true, width: "90" },
                { index: 7, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "120" },
                { index: 8, label: 'Email', class: 'colEmail', active: false, display: true, width: "200" },
                { index: 9, label: 'Account No', class: 'colAccountNo', active: false, display: true, width: "200" },
                { index: 10, label: 'Client Number', class: 'colClientNo', active: false, display: true, width: "120" },
                { index: 11, label: 'Job Title', class: 'colJobTitle', active: false, display: true, width: "120" },
                { index: 12, label: 'Custom Field 1', class: 'colCustomField1', active: false, display: true, width: "120" },
                { index: 13, label: 'Custom Field 2', class: 'colCustomField2', active: false, display: true, width: "120" },
                { index: 14, label: 'City/Suburb', class: 'colSuburb', active: false, display: true, width: "120" },
                { index: 15, label: 'State', class: 'colState', active: false, display: true, width: "120" },
                { index: 16, label: 'Post Code', class: 'colPostcode', active: false, display: true, width: "80" },
                { index: 17, label: 'Country', class: 'colCountry', active: false, display: true, width: "200" },
                { index: 18, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
                { index: 19, label: 'Comments', class: 'colNotes', active: true, display: true, width: "" },
            ];
        } else if (currenttablename == "tblLeadlist") { //Done Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colLeadId', active: false, display: true, width: "10" },
                { index: 1, label: 'Company', class: 'colCompany', active: true, display: true, width: "200" },
                { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
                { index: 3, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "90" },
                { index: 4, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "110" },
                { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
                { index: 6, label: 'Credit Limit', class: 'colCreditLimit', active: false, display: true, width: "90" },
                { index: 7, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "120" },
                { index: 8, label: 'Email', class: 'colEmail', active: false, display: true, width: "200" },
                { index: 9, label: 'Account No', class: 'colAccountNo', active: false, display: true, width: "200" },
                { index: 10, label: 'Client Number', class: 'colClientNo', active: false, display: true, width: "120" },
                { index: 11, label: 'Job Title', class: 'colJobTitle', active: false, display: true, width: "120" },
                { index: 12, label: 'Custom Field 1', class: 'colCustomField1', active: false, display: true, width: "120" },
                { index: 13, label: 'Custom Field 2', class: 'colCustomField2', active: false, display: true, width: "120" },
                { index: 14, label: 'Address', class: 'colAddress', active: true, display: true, width: "" },
                { index: 15, label: 'City/Suburb', class: 'colSuburb', active: false, display: true, width: "120" },
                { index: 16, label: 'State', class: 'colState', active: false, display: true, width: "120" },
                { index: 17, label: 'Post Code', class: 'colPostcode', active: false, display: true, width: "80" },
                { index: 18, label: 'Country', class: 'colCountry', active: false, display: true, width: "200" },
                { index: 19, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
                { index: 20, label: 'Comments', class: 'colNotes', active: true, display: true, width: "" },
            ];
        } else if (currenttablename == "tblCurrencyList") { //Done Something Here
            reset_data = [
                { index: 0, label: '#ID', class: 'colCurrencyID', active: false, display: true, width: "10" },
                { index: 1, label: 'Code', class: 'colCode', active: true, display: true, width: "50" },
                { index: 2, label: 'Currency', class: 'colCurrency', active: true, display: true, width: "100" },
                { index: 3, label: 'Symbol', class: 'colCurrencySymbol', active: true, display: true, width: "100" },
                { index: 4, label: 'Buy Rate', class: 'colBuyRate', active: true, display: true, width: "100" },
                { index: 5, label: 'Sell Rate', class: 'colSellRate', active: true, display: true, width: "100" },
                { index: 6, label: 'Country', class: 'colCountry', active: true, display: true, width: "200" },
                { index: 7, label: 'Rate Last Modified', class: 'colRateLastModified', active: false, display: true, width: "200" },
                { index: 8, label: 'Description', class: 'colDescription', active: true, display: true, width: "" },
                { index: 10, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
                { index: 11, label: 'Fixed Rate', class: 'colFixedRate', active: false, display: true, width: "100" },
                { index: 12, label: 'Upper Variation', class: 'colUpperVariation', active: false, display: true, width: "150" },
                { index: 13, label: 'Lower Variation', class: 'colLowerVariation', active: false, display: true, width: "150" },
                { index: 14, label: 'Trigger Price Variation', class: 'colTriggerPriceVariation', active: false, display: true, width: "250" },
                { index: 15, label: 'Country ID', class: 'colCountryID', active: false, display: true, width: "100" },
            ];
        } else if (currenttablename === "tblTitleList") {
            reset_data = [
                { index: 0, label: '#ID', class: '', active: false, display: true, width: "10" },
                { index: 1, label: 'Title', class: 'colTitleName', active: true, display: true, width: "150" },
                { index: 2, label: 'Active', class: 'chkBox', active: true, display: true, width: "50" },
            ];
        } else if (currenttablename == 'tblProcessList') {
            reset_data = [
                { index: 0, label: '#ID', class: 'colProcessId', active: false, display: true, width: "10" },
                { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "100" },
                { index: 2, label: 'Description', class: 'colDescription', active: true, display: true, width: "200" },
                { index: 3, label: 'Daily Hours', class: 'colDailyHours', active: true, display: true, width: "100" },
                { index: 4, label: 'Hourly Labour Cost', class: 'colHourlyLabourCost', active: true, display: true, width: "100" },
                { index: 5, label: 'Cost of Goods Sold', class: 'colCOGS', active: true, display: true, width: "200" },
                { index: 6, label: 'Expense Account', class: 'colExpense', active: true, display: true, width: "200" },
                { index: 7, label: 'Hourly Overhead Cost', class: 'colHourlyOverheadCost', active: true, display: true, width: "100" },
                { index: 8, label: 'Cost of Goods Sold(Overhead)', class: 'colOverGOGS', active: true, display: true, width: "200" },
                { index: 9, label: 'Expense Account(Overhead)', class: 'colOverExpense', active: true, display: true, width: "120" },
                { index: 10, label: 'Total Hourly Costs', class: 'colTotalHourlyCosts', active: true, display: true, width: "100" },
                { index: 11, label: 'Inventory Asset Wastage', class: 'colWastage', active: true, display: true, width: "200" }
            ];
        } else if (currenttablename == "tblSupplierTransactionList") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colSortDate', active: false, display: true, width: "" },
                { index: 1, label: 'Order Date', class: 'colOrderDate', active: true, display: true, width: "" },
                { index: 2, label: 'P/O No.', class: 'colPurchaseNo', active: true, display: true, width: "" },
                { index: 3, label: 'Supplier', class: 'colSupplier', active: true, display: true, width: "" },
                { index: 4, label: 'Amount (Ex)', class: 'colAmountEx', active: true, display: true, width: "" },
                { index: 5, label: 'Tax', class: 'colTax', active: true, display: true, width: "" },
                { index: 6, label: 'Amount', class: 'colAmount', active: true, display: true, width: "" },
                { index: 7, label: 'Paid', class: 'colPaid', active: true, display: true, width: "" },
                { index: 8, label: 'Balance Outstanding', class: 'colBalanceOutstanding', active: true, display: true, width: "" },
                { index: 9, label: 'Type', class: 'colStatus', active: true, display: true, width: "" },
                { index: 9, label: 'Custom Field 1', class: 'colPurchaseCustField1', active: false, display: true, width: "" },
                { index: 9, label: 'Custom Field 2', class: 'colPurchaseCustField2', active: false, display: true, width: "" },
                { index: 9, label: 'Employee', class: 'colEmployee', active: false, display: true, width: "" },
                { index: 9, label: 'Comments', class: 'colComments', active: true, display: true, width: "" },
            ];
        } else if (currenttablename === "tblCustomerTransactionList") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colSortDate', active: false, display: true, width: "10" },
                { index: 1, label: 'Company', class: 'colCompany', active: true, display: true, width: "200" },
                { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
                { index: 3, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "80" },
                { index: 4, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "80" },
                { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
                { index: 6, label: 'Credit Limit', class: 'colCreditLimit', active: true, display: true, width: "80" },
                { index: 7, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "80" },
                { index: 8, label: 'Country', class: 'colCountry', active: true, display: true, width: "100" },
                { index: 9, label: 'Email', class: 'colEmail', active: false, display: true, width: "" },
                { index: 10, label: 'Account No', class: 'colAccountNo', active: false, display: true, width: "100" },
                { index: 11, label: 'Custom Field 1', class: 'colClientNo', active: false, display: true, width: "" },
                { index: 12, label: 'Custom Field 2', class: 'colJobTitle', active: false, display: true, width: "" },
                { index: 13, label: 'Notes', class: 'colNotes', active: true, display: true, width: "100" },
            ];
        } else if (currenttablename === "tblCustomerJobDetailsList") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colSortDate', active: false, display: true, width: "10" },
                { index: 1, label: 'Company', class: 'colCompany', active: true, display: true, width: "200" },
                { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95" },
                { index: 3, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "80" },
                { index: 4, label: 'Credit Balance', class: 'colCreditBalance', active: true, display: true, width: "80" },
                { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "80" },
                { index: 6, label: 'Credit Limit', class: 'colCreditLimit', active: true, display: true, width: "80" },
                { index: 7, label: 'Order Balance', class: 'colSalesOrderBalance', active: true, display: true, width: "80" },
                { index: 8, label: 'Country', class: 'colCountry', active: true, display: true, width: "100" },
                { index: 9, label: 'Email', class: 'colEmail', active: false, display: true, width: "" },
                { index: 10, label: 'Account No', class: 'colAccountNo', active: false, display: true, width: "100" },
                { index: 11, label: 'Custom Field 1', class: 'colClientNo', active: false, display: true, width: "" },
                { index: 12, label: 'Custom Field 2', class: 'colJobTitle', active: false, display: true, width: "" },
                { index: 13, label: 'Notes', class: 'colNotes', active: true, display: true, width: "100" },
            ];
        } else if (currenttablename === "tblEmployeeTransactionList") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colSortDate', active: false, display: true, width: "10" },
                { index: 1, label: 'Sale Date', class: 'colSaleDate', active: true, display: true, width: "40" },
                { index: 2, label: 'Sales No.', class: 'colSalesNo', active: true, display: true, width: "40" },
                { index: 3, label: 'Customer', class: 'colCustomer', active: true, display: true, width: "100" },
                { index: 4, label: 'Amount (Ex)', class: 'colAmountEx', active: true, display: true, width: "40" },
                { index: 5, label: 'Tax', class: 'colTax', active: true, display: true, width: "40" },
                { index: 6, label: 'Amount', class: 'colAmount', active: true, display: true, width: "40" },
                { index: 7, label: 'Paid', class: 'colPaid', active: true, display: true, width: "40" },
                { index: 8, label: 'Balance Outstanding', class: 'colBalanceOutstanding', active: true, display: true, width: "40" },
                { index: 9, label: 'Status', class: 'colStatus', active: false, display: true, width: "" },
                { index: 10, label: 'Custom Field 1', class: 'colSaleCustField1', active: false, display: true, width: "" },
                { index: 11, label: 'Custom Field 2', class: 'colSaleCustField2', active: false, display: true, width: "" },
                { index: 12, label: 'Employee', class: 'colEmployee', active: false, display: true, width: "" },
                { index: 13, label: 'Comments', class: 'colComments', active: false, display: true, width: "" },
            ];
        } else if (currenttablename === "tblLeadCrmList") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colTaskId', active: false, display: true, width: "" },
                { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
                { index: 2, label: 'Task', class: 'colTaskName', active: true, display: true, width: "150" },
                { index: 3, label: 'Description', class: 'colTaskDesc', active: true, display: true, width: "250" },
                { index: 4, label: 'Completed By', class: 'colTaskLabels', active: true, display: true, width: "100" },
                { index: 5, label: '', class: 'colCompleteTask', active: true, display: true, width: "100" },
            ]
        } else if (currenttablename === "tblCustomerCrmList") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colTaskId', active: false, display: true, width: "" },
                { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
                { index: 2, label: 'Task', class: 'colTaskName', active: true, display: true, width: "150" },
                { index: 3, label: 'Description', class: 'colTaskDesc', active: true, display: true, width: "250" },
                { index: 4, label: 'Completed By', class: 'colTaskLabels', active: true, display: true, width: "100" },
                { index: 5, label: '', class: 'colCompleteTask', active: true, display: true, width: "100" },
            ]
        } else if (currenttablename === "tblSupplierCrmList") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colTaskId', active: false, display: true, width: "" },
                { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
                { index: 2, label: 'Task', class: 'colTaskName', active: true, display: true, width: "150" },
                { index: 3, label: 'Description', class: 'colTaskDesc', active: true, display: true, width: "250" },
                { index: 4, label: 'Completed By', class: 'colTaskLabels', active: true, display: true, width: "100" },
                { index: 5, label: '', class: 'colCompleteTask', active: true, display: true, width: "100" },
            ]
        } else if (currenttablename === "tblLeadCrmListWithDate") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colTaskId', active: false, display: true, width: "" },
                { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
                { index: 2, label: 'Action', class: 'colType', active: true, display: true, width: "100" },
                { index: 3, label: 'Name', class: 'colTaskName', active: true, display: true, width: "150" },
                { index: 4, label: 'Description', class: 'colTaskDesc', active: true, display: true, width: "250" },
                { index: 5, label: 'Completed By', class: 'colTaskLabels', active: true, display: true, width: "100" },
                { index: 6, label: '', class: 'colCompleteTask', active: true, display: true, width: "100" },
            ]
        } else if (currenttablename === "tblCustomerCrmListWithDate") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colTaskId', active: false, display: true, width: "" },
                { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
                { index: 2, label: 'Action', class: 'colType', active: true, display: true, width: "100" },
                { index: 3, label: 'Name', class: 'colTaskName', active: true, display: true, width: "150" },
                { index: 4, label: 'Description', class: 'colTaskDesc', active: true, display: true, width: "250" },
                { index: 5, label: 'Completed By', class: 'colTaskLabels', active: true, display: true, width: "100" },
                { index: 6, label: '', class: 'colCompleteTask', active: true, display: true, width: "100" },
            ]
        } else if (currenttablename === "tblSupplierCrmListWithDate") {
            reset_data = [
                { index: 0, label: '#ID', class: 'colTaskId', active: false, display: true, width: "" },
                { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
                { index: 2, label: 'Action', class: 'colType', active: true, display: true, width: "100" },
                { index: 3, label: 'Name', class: 'colTaskName', active: true, display: true, width: "150" },
                { index: 4, label: 'Description', class: 'colTaskDesc', active: true, display: true, width: "250" },
                { index: 5, label: 'Completed By', class: 'colTaskLabels', active: true, display: true, width: "100" },
                { index: 6, label: '', class: 'colCompleteTask', active: true, display: true, width: "100" },
            ]
        } else if (currenttablename === "tblSingleTouchPayroll") {
            reset_data = [
                { index: 0, label: "#ID", class: "colTaskID", active: false, display: true, width: "" },
                { index: 1, label: "Date", class: "colDate", active: true, display: true, width: "" },
                { index: 2, label: "Earnings", class: "colEarnings", active: true, display: true, width: "" },
                { index: 3, label: "PAYG", class: "colPayg", active: true, display: true, width: "" },
                { index: 4, label: "Supperannuation", class: "colSupperannuation", active: true, display: true, width: "" },
                { index: 5, label: "Net Pay", class: "colNetPay", active: true, display: true, width: "" },
                { index: 6, label: "Status", class: "colStatus", active: true, display: true, width: "" },
            ]
        } else if (currenttablename === "tblRatePopList"){
            reset_data = [
                { index: 0, label: "#ID", class: "colRateID", active: false, display: true, width: "10" },
                { index: 1, label: "Name", class: "colRateName", active: true, display: true, width: "300" },
            ]
        } else if (currenttablename === "tblRateTypeList"){
            reset_data = [
                { index: 0, label: "#ID", class: "colRateTypeID", active: false, display: true, width: "10" },
                { index: 1, label: "Description", class: "thDescription", active: true, display: true, width: "300" },
            ]
        } else if (currenttablename === "tblOverTimeSheet"){
            reset_data = [
                { index: 0, label: "#ID", class: "colOverTimeSheetID", active: false, display: true, width: "10" },
                { index: 1, label: "Rate", class: "colRate", active: true, display: true, width: "500" },
                { index: 2, label: "Rule", class: "colRateRule", active: true, display: true, width: "500" },
                { index: 3, label: "hourly Multiplier", class: "colHourlyAmount", active: true, display: true, width: "500" },
            ]
        } else if(currenttablename === "productrecentlist"){
            reset_data = [
                { index: 0, label: "Date", class: "Date", active: true, display: true, width: "80" },
                { index: 1, label: "Type", class: "Type", active: true, display: true, width: "130" },
                { index: 2, label: "Ref", class: "Ref", active: true, display: true, width: "30" },
                { index: 3, label: "Qty", class: "Qty", active: true, display: true, width: "30" },
                { index: 4, label: "Unit Price", class: "UnitPrice", active: true, display: true, width: "80" },
                { index: 5, label: "Total", class: "Total", active: true, display: true, width: "80" },
            ]
        } else if(currenttablename === "tblInventoryOverview"){

            reset_data = [
                { index: 0, label: "#ID", class: "ProductID", width: "30", active: false, display: true },
                { index: 1, label: "Product Name", class: "ProductName", width: "200", active: true, display: true },
                { index: 2, label: "Sales Description", class: "SalesDescription", width: "", active: true, display: true },
                { index: 3, label: "Available", class: "Available", width: "70", active: true, display: true },
                { index: 4, label: "On SO", class: "OnSO", width: "60", active: true, display: true },
                { index: 5, label: "On BO", class: "OnBO", width: "60", active: true, display: true },
                { index: 6, label: "In Stock", class: "InStock", width: "65", active: true, display: true },
                { index: 7, label: "On Order", class: "OnOrder", width: "72", active: true, display: true },
                { index: 8, label: "Cost Price (Ex)", class: "CostPrice", width: "135", active: false, display: true },
                { index: 9, label: "Cost Price (Inc)", class: "CostPriceInc", width: "135", active: true, display: true },
                { index: 10, label: "Sale Price (Ex)", class: "SalePrice", width: "135", active: false, display: true },
                { index: 11, label: "Sale Price (Inc)", class: "SalePriceInc", width: "135", active: true, display: true },
                { index: 12, label: "Serial/Lot No", class: "SerialNo", width: "124", active: false, display: true },
                { index: 13, label: "Barcode", class: "Barcode", width: "80", active: false, display: true },
                { index: 14, label: "Department", class: "Departmentth", width: "100", active: false, display: true },
                { index: 15, label: "Purchase Description", class: "PurchaseDescription", width: "", active: false, display: true },
                { index: 16, label: "Custom Field 1", class: "ProdCustField1", width: "", active: false, display: true },
                { index: 17, label: "Custom Field 2", class: "ProdCustField2", width: "", active: false, display: true },
              ];
              
        } else if(currenttablename === "tblBASReturnList"){
            reset_data = [
                { index: 0, label: "BAS Number", class: "colBasNumber", width: "80", active: true, display: true },
                { index: 1, label: "Description", class: "colBasName", width: "250", active: true, display: true },
                { index: 2, label: "GST\nPeriod", class: "t1Period", width: "100", active: true, display: true },
                { index: 3, label: "GST\nFrom", class: "t1From", width: "120", active: true, display: true },
                { index: 4, label: "GST\nTo", class: "t1To", width: "120", active: true, display: true },
                { index: 5, label: "Withheld\nPeriod", class: "t2Period", width: "100", active: true, display: true },
                { index: 6, label: "Withheld\nFrom", class: "t2From", width: "120", active: true, display: true },
                { index: 7, label: "Withheld\nTo", class: "t2To", width: "120", active: true, display: true },
                { index: 8, label: "instalment\nPeriod", class: "t3Period", width: "100", active: true, display: true },
                { index: 9, label: "instalment\nFrom", class: "t3From", width: "120", active: true, display: true },
                { index: 10, label: "instalment\nTo", class: "t3To", width: "120", active: true, display: true },
              ];
        } else if(currenttablename === "tblVATReturnList"){
            reset_data = [
                { index: 0, label: "VAT Number", class: "colVatNumber", width: "80", active: true, display: true },
                { index: 1, label: "Description", class: "colBasName", width: "250", active: true, display: true },
                { index: 2, label: "OUTPUT TAX\nPeriod", class: "t1Period", width: "100", active: true, display: true },
                { index: 3, label: "OUTPUT TAX\nFrom", class: "t1From", width: "120", active: true, display: true },
                { index: 4, label: "OUTPUT TAX\nTo", class: "t1To", width: "120", active: true, display: true },
                { index: 5, label: "INPUT TAX\nPeriod", class: "t2Period", width: "100", active: true, display: true },
                { index: 6, label: "INPUT TAX\nFrom", class: "t2From", width: "120", active: true, display: true },
                { index: 7, label: "INPUT TAX\nTo", class: "t2To", width: "120", active: true, display: true },
                { index: 8, label: "REFUND\nPeriod", class: "t3Period", width: "100", active: true, display: true },
                { index: 9, label: "REFUND\nFrom", class: "t3From", width: "120", active: true, display: true },
                { index: 10, label: "REFUND\nTo", class: "t3To", width: "120", active: true, display: true },
            ];
        } else if(currenttablename === "tblServiceLogList"){
          reset_data = [
            { index: 0, label: 'ID', class: 'LogId', active: true, display: true, width: "0" },
            { index: 1, label: 'Asset Code', class: 'AssetCode', active: true, display: true, width: "" },
            { index: 2, label: 'Asset Name', class: 'AssetName', active: true, display: true, width: "" },
            { index: 3, label: 'Service Type', class: 'ServiceType', active: true, display: true, width: "" },
            { index: 4, label: 'Service Date', class: 'ServiceDate', active: true, display: true, width: "" },
            { index: 5, label: 'Service Provider', class: 'ServiceProvider', active: true, display: true, width: "" },
            { index: 6, label: 'Next Service Due Date', class: 'ServiceDueDate', active: true, display: true, width: "" },
            { index: 7, label: 'Status', class: 'ServiceStatus', active: true, display: true, width: "" },
          ];
        } else if(currenttablename === "tblAssetRegisterList"){
          reset_data = [
            { index: 0, label: 'ID', class: 'AssetRegisterId', active: true, display: true, width: "0"},
            { index: 1, label: 'Asset Code', class: 'RegisterAssetCode', active: true, display: true, width: ""},
            { index: 2, label: 'Asset Name', class: 'RegisterAssetName', active: true, display: true, width: "" },
            { index: 3, label: 'Asset Description', class: 'RegisterAssetDescription', active: true, display: true, width: ""},
            { index: 4, label: 'Asset Type', class: 'RegisterAssetType', active: true, display: true, width: "" },
            { index: 5, label: 'Brand', class: 'RegisterAssetBrand', active: true, display: true, width: "" },
            { index: 6, label: 'Model', class: 'RegisterAssetModel', active: true, display: true, width: "" },
            { index: 7, label: 'Number', class: 'RegisterAssetNumber', active: true, display: true, width: "" },
            { index: 8, label: 'Registration No', class: 'RegisterAssetRegistrationNo', active: true, display: true, width: "" },
            { index: 9, label: 'Type', class: 'RegisterAssetType', active: true, display: true, width: "" },
            { index: 10, label: 'Capacity Weight', class: 'RegisterAssetCapacityWeight', active: true, display: true, width: "" },
            { index: 11, label: 'Capacity Volume', class: 'RegisterAssetCapacityVolume', active: true, display: true, width: "" },
            { index: 12, label: 'Purchased Date', class: 'RegisterAssetPurchasedDate', active: true, display: true, width: "" },
            { index: 13, label: 'Cost', class: 'RegisterAssetCost', active: true, display: true, width: "" },
            { index: 14, label: 'Supplier', class: 'RegisterAssetSupplier', active: true, display: true, width: "" },
            { index: 15, label: 'Registration Renewal Date', class: 'RegisterAssetRegisterRenewDate', active: true, display: true, width: "" },
            { index: 16, label: 'Insurance Info', class: 'RegisterAssetInsuranceInfo', active: true, display: true, width: "" },
            { index: 17, label: 'Depreciation Start Date', class: 'RegisterAssetRenewDate', active: true, display: true, width: "" },
          ];
        }
        templateObject.reset_data.set(reset_data);
    }
    templateObject.init_reset_data();

    // set initial table rest_data
    templateObject.initCustomFieldDisplaySettings = function(data, listType) {
        //function initCustomFieldDisplaySettings(data, listType) {
        let templateObject = Template.instance();
        let reset_data = templateObject.reset_data.get();
        templateObject.showCustomFieldDisplaySettings(reset_data);
        
        // try {
        //     getVS1Data("VS1_Customize").then(function(dataObject) {
        //         if (dataObject.length == 0) {
        //             sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), listType).then(function(data) {
        //                 reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
        //                 templateObject.showCustomFieldDisplaySettings(reset_data);
        //             }).catch(function(err) {});
        //         } else {
        //             let data = JSON.parse(dataObject[0].data);
        //             if (data.ProcessLog.Obj != undefined && data.ProcessLog.Obj.CustomLayout.length > 0) {
        //                 for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
        //                     if (data.ProcessLog.Obj.CustomLayout[i].TableName == listType && listType != "tblAccountOverview") {
        //                         reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
        //                         templateObject.showCustomFieldDisplaySettings(reset_data);
        //                     }
        //                 }
        //             };
        //         }
        //     });

        // } catch (error) {

        // }
        // return;
    }
    templateObject.showCustomFieldDisplaySettings = async function(reset_data) {
        //function showCustomFieldDisplaySettings(reset_data) {
        let custFields = [];
        let customData = {};
        let customFieldCount = reset_data.length;
        for (let r = 0; r < customFieldCount; r++) {
            customData = {
                active: reset_data[r].active,
                id: reset_data[r].index,
                custfieldlabel: reset_data[r].label,
                class: reset_data[r].class,
                display: reset_data[r].display,
                width: reset_data[r].width ? reset_data[r].width : ''
            };
            let currentTable = document.getElementById(currenttablename)
            if (reset_data[r].active == true) {
                if(currentTable){
                    $('#' + currenttablename + ' .' + reset_data[r].class).removeClass('hiddenColumn');
                }
            } else if (reset_data[r].active == false) {
                if(currentTable){
                    $('#' + currenttablename + ' .' + reset_data[r].class).addClass('hiddenColumn');
                }
            };
            custFields.push(customData);
        }
        await templateObject.non_trans_displayfields.set(custFields);
        $('.dataTable').resizable();
    }
    templateObject.initCustomFieldDisplaySettings("", currenttablename);

    templateObject.resetData = function(dataVal) {
        location.reload();
    };

    //Contact Overview Data
    templateObject.getContactOverviewData = async function(deleteFilter = false) {
        var customerpage = 0;
        getVS1Data('TERPCombinedContactsVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
                    templateObject.displayContactOverviewData(data);
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayContactOverviewData(data);
            }
        }).catch(function(err) {
            sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
                templateObject.displayContactOverviewData(data);
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayContactOverviewData = async function(data) {
        var splashArrayContactOverview = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let clienttype = "";
        let isprospect = false;
        let iscustomer = false;
        let isEmployee = false;
        let issupplier = false;
        let deleteFilter = false;
        let isSingleTouchPayroll = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {
            isprospect = data.terpcombinedcontactsvs1[i].isprospect;
            iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
            isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
            issupplier = data.terpcombinedcontactsvs1[i].issupplier;

            if (isprospect == true && iscustomer == true && isEmployee == true && issupplier == true) {
                clienttype = "Customer / Employee / Supplier";
            } else if (isprospect == true && iscustomer == true && issupplier == true) {
                clienttype = "Customer / Supplier";
            } else if (iscustomer == true && issupplier == true) {
                clienttype = "Customer / Supplier";
            } else if (iscustomer == true) {
                if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0) {
                    clienttype = "Job";
                } else {
                    clienttype = "Customer";
                }
            } else if (isEmployee == true) {
                clienttype = "Employee";
            } else if (issupplier == true) {
                clienttype = "Supplier";
            } else if (isprospect == true) {
                clienttype = "Lead";
            } else {
                clienttype = " ";
            }

            let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance) || 0.0;
            let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.0;
            let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance) || 0.0;
            let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit) || 0.0;
            let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance) || 0.0;
            if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
                arBalance = Currency + "0.00";
            }

            if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
                creditBalance = Currency + "0.00";
            }
            if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
                balance = Currency + "0.00";
            }
            if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
                creditLimit = Currency + "0.00";
            }

            if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
                salesOrderBalance = Currency + "0.00";
            }

            let linestatus = '';
            if (data.terpcombinedcontactsvs1[i].Active == true) {
                linestatus = "";
            } else if (data.terpcombinedcontactsvs1[i].Active == false) {
                linestatus = "In-Active";
            };


            var dataList = [
                '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' + data.terpcombinedcontactsvs1[i].ID + '-' + clienttype + '"><label class="custom-control-label chkBox pointer" for="formCheck-' + data.terpcombinedcontactsvs1[i].ID + '-' + clienttype + '"></label></div>',
                data.terpcombinedcontactsvs1[i].ID || "",
                data.terpcombinedcontactsvs1[i].name || "",
                clienttype || "",
                data.terpcombinedcontactsvs1[i].phone || "",
                data.terpcombinedcontactsvs1[i].mobile || "",
                arBalance || 0.0,
                creditBalance || 0.0,
                balance || 0.0,
                creditLimit || 0.0,
                salesOrderBalance || 0.0,
                data.terpcombinedcontactsvs1[i].email || "",
                data.terpcombinedcontactsvs1[i].CUSTFLD1 || "",
                data.terpcombinedcontactsvs1[i].CUSTFLD2 || "",
                data.terpcombinedcontactsvs1[i].street || "",
                data.terpcombinedcontactsvs1[i].suburb || "",
                data.terpcombinedcontactsvs1[i].state || "",
                data.terpcombinedcontactsvs1[i].postcode || "",
                "",
                linestatus,
            ];



            //if (data.terpcombinedcontactsvs1[i].name.replace(/\s/g, "") !== "") {
            splashArrayContactOverview.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayContactOverview);

        }


        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayContactOverview,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: currenttablename == 'tblContactlist' ? "chkBox pointer" : "chkBox pointer hiddenColumn",
                        orderable: false,
                        width: "10px"
                    },
                    {
                        targets: 1,
                        className: "colContactID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[1]);
                            $(td).closest("tr").attr("isjob", rowData[3]);
                        }
                    },
                    {
                        targets: 2,
                        className: "colClientName",
                        width: "200px",
                    },
                    {
                        targets: 3,
                        className: "colType",
                        width: "130px",
                    },
                    {
                        targets: 4,
                        className: "colPhone",
                        width: "95px",
                    },
                    {
                        targets: 5,
                        className: "colMobile hiddenColumn",
                        width: "95px",
                    },
                    {
                        targets: 6,
                        className: "colARBalance text-right",
                        width: "90px",
                    },
                    {
                        targets: 7,
                        className: "colCreditBalance text-right",
                        width: "110px",
                    },
                    {
                        targets: 8,
                        className: "colBalance text-right",
                        width: "110px",
                    },
                    {
                        targets: 9,
                        className: "colCreditLimit hiddenColumn text-right",
                        width: "90px",
                    },
                    {
                        targets: 10,
                        className: "colSalesOrderBalance text-right",
                        width: "120px",
                    },
                    {
                        targets: 11,
                        className: currenttablename == 'tblContactlist' ? "colEmail" : "colEmail hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 12,
                        className: "colCustFld1 hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 13,
                        className: "colCustFld2 hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 14,
                        className: "colAddress"
                    },
                    {
                        targets: 15,
                        className: "colSuburb hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 16,
                        className: "colState hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 17,
                        className: "colPostcode hiddenColumn",
                        width: "80px",
                    },
                    {
                        targets: 18,
                        className: "colCountry hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 19,
                        className: "colStatus",
                        width: "100px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Contact Overview",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Contact Overview',
                        filename: "Contact Overview",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Contact Overview",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                // "autoWidth": false,
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getAllContactCombineVS1(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.terpcombinedcontactsvs1.length; j++) {
                                isprospect = dataObjectnew.terpcombinedcontactsvs1[j].isprospect;
                                iscustomer = dataObjectnew.terpcombinedcontactsvs1[j].iscustomer;
                                isEmployee = dataObjectnew.terpcombinedcontactsvs1[j].isEmployee;
                                issupplier = dataObjectnew.terpcombinedcontactsvs1[j].issupplier;

                                if (isprospect == true && iscustomer == true && isEmployee == true && issupplier == true) {
                                    clienttype = "Customer / Employee / Supplier";
                                } else if (isprospect == true && iscustomer == true && issupplier == true) {
                                    clienttype = "Customer / Supplier";
                                } else if (iscustomer == true && issupplier == true) {
                                    clienttype = "Customer / Supplier";
                                } else if (iscustomer == true) {
                                    if (dataObjectnew.terpcombinedcontactsvs1[j].name.toLowerCase().indexOf("^") >= 0) {
                                        clienttype = "Job";
                                    } else {
                                        clienttype = "Customer";
                                    }
                                } else if (isEmployee == true) {
                                    clienttype = "Employee";
                                } else if (issupplier == true) {
                                    clienttype = "Supplier";
                                } else if (isprospect == true) {
                                    clienttype = "Lead";
                                } else {
                                    clienttype = " ";
                                }

                                let linestatus = '';
                                if (dataObjectnew.terpcombinedcontactsvs1[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.terpcombinedcontactsvs1[j].Active == false) {
                                    linestatus = "In-Active";
                                };

                                let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance) || 0.0;
                                let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance) || 0.0;
                                let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].Balance) || 0.0;
                                let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit) || 0.0;
                                let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance) || 0.0;
                                if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance)) {
                                    arBalance = Currency + "0.00";
                                }

                                if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance)) {
                                    creditBalance = Currency + "0.00";
                                }
                                if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].Balance)) {
                                    balance = Currency + "0.00";
                                }
                                if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit)) {
                                    creditLimit = Currency + "0.00";
                                }

                                if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance)) {
                                    salesOrderBalance = Currency + "0.00";
                                }

                                var dataListContactDupp = [
                                    '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' + dataObjectnew.terpcombinedcontactsvs1[j].ID + '-' + clienttype + '"><label class="custom-control-label chkBox pointer" for="formCheck-' + dataObjectnew.terpcombinedcontactsvs1[j].ID + '-' + clienttype + '"></label></div>',
                                    dataObjectnew.terpcombinedcontactsvs1[j].ID || "",
                                    dataObjectnew.terpcombinedcontactsvs1[j].name || "",
                                    clienttype || "",
                                    dataObjectnew.terpcombinedcontactsvs1[j].phone || "",
                                    dataObjectnew.terpcombinedcontactsvs1[j].mobile || "",
                                    arBalance || 0.0,
                                    creditBalance || 0.0,
                                    balance || 0.0,
                                    creditLimit || 0.0,
                                    salesOrderBalance || 0.0,
                                    dataObjectnew.terpcombinedcontactsvs1[j].email || "",
                                    dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD1 || "",
                                    dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD2 || "",
                                    dataObjectnew.terpcombinedcontactsvs1[j].street || "",
                                    dataObjectnew.terpcombinedcontactsvs1[j].suburb || "",
                                    dataObjectnew.terpcombinedcontactsvs1[j].state || "",
                                    dataObjectnew.terpcombinedcontactsvs1[j].postcode || "",
                                    "",
                                    linestatus
                                ];

                                splashArrayContactOverview.push(dataListContactDupp);
                                //}
                            }
                            let uniqueChars = [...new Set(splashArrayContactOverview)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshContactOverview' type='button' id='btnRefreshContactOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

      setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Employee List Data
    templateObject.getEmployeeListData = async function(deleteFilter = false) {
        var customerpage = 0;
        getVS1Data('TEmployeeList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllTEmployeeList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TEmployeeList', JSON.stringify(data));
                    templateObject.displayEmployeeListData(data);
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayEmployeeListData(data);
            }
        }).catch(function(err) {
            sideBarService.getAllTEmployeeList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TEmployeeList', JSON.stringify(data));
                templateObject.displayEmployeeListData(data);
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayEmployeeListData = async function(data) {
        var splashArrayEmployeeList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.temployeelist.length; i++) {
            let mobile = "";
            //sideBarService.changeDialFormat(data.temployeelist[i].Mobile, data.temployeelist[i].Country);
            let linestatus = '';
            if (data.temployeelist[i].Active == true) {
                linestatus = "";
            } else if (data.temployeelist[i].Active == false) {
                linestatus = "In-Active";
            };
            var dataList = [
                data.temployeelist[i].EmployeeID || "",
                data.temployeelist[i].EmployeeName || "",
                data.temployeelist[i].FirstName || "",
                data.temployeelist[i].LastName || "",
                data.temployeelist[i].Phone || "",
                data.temployeelist[i].Mobile || '',
                data.temployeelist[i].Email || '',
                data.temployeelist[i].DefaultClassName || '',
                data.temployeelist[i].CustFld1 || '',
                data.temployeelist[i].CustFld2 || '',
                linestatus,
                data.temployeelist[i].Street || "",
                data.temployeelist[i].Street2 || "",
                data.temployeelist[i].State || "",
                data.temployeelist[i].Postcode || "",
                data.temployeelist[i].Country || "",
            ];

            //if (data.temployeelist[i].EmployeeName.replace(/\s/g, "") !== "") {
            splashArrayEmployeeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayEmployeeList);
            //}

            //}
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayEmployeeList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colEmployeeNo colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colEmployeeName",
                        width: "200px",
                    },
                    {
                        targets: 2,
                        className: "colFirstName",
                        width: "85px",
                    },
                    {
                        targets: 3,
                        className: "colLastName",
                        width: "85px",
                    },
                    {
                        targets: 4,
                        className: "colPhone",
                        width: "95px",
                    },
                    {
                        targets: 5,
                        className: "colMobile hiddenColumn",
                        width: "95px",
                    },
                    {
                        targets: 6,
                        className: "colEmail",
                        width: "200px",
                    },
                    {
                        targets: 7,
                        className: "colDepartment hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 8,
                        className: "colCustFld1 hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 9,
                        className: "colCustFld2 hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 10,
                        className: "colStatus",
                        width: "100px",
                    },
                    {
                        targets: 11,
                        className: "colAddress colStreetAddress"
                    },
                    {
                        targets: 12,
                        className: "colCity colSuburb hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 13,
                        className: "colState hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 14,
                        className: "colPostcode colZipCode hiddenColumn",
                        width: "80px",
                    },
                    {
                        targets: 15,
                        className: "colCountry hiddenColumn",
                        width: "200px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Employee List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Employee List',
                        filename: "Employee List",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Employee List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getAllTEmployeeList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.temployeelist.length; j++) {
                                let mobile = sideBarService.changeDialFormat(dataObjectnew.temployeelist[j].Mobile, dataObjectnew.temployeelist[j].Country);
                                let linestatus = '';
                                if (dataObjectnew.temployeelist[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.temployeelist[j].Active == false) {
                                    linestatus = "In-Active";
                                };


                                var dataListDupp = [
                                    dataObjectnew.temployeelist[j].EmployeeID || "",
                                    dataObjectnew.temployeelist[j].EmployeeName || "",
                                    dataObjectnew.temployeelist[j].FirstName || "",
                                    dataObjectnew.temployeelist[j].LastName || "",
                                    dataObjectnew.temployeelist[j].Phone || "",
                                    mobile || '',
                                    dataObjectnew.temployeelist[j].Email || '',
                                    dataObjectnew.temployeelist[j].DefaultClassName || '',
                                    dataObjectnew.temployeelist[j].CustFld1 || '',
                                    dataObjectnew.temployeelist[j].CustFld2 || '',
                                    linestatus,
                                    dataObjectnew.temployeelist[j].Street || "",
                                    dataObjectnew.temployeelist[j].Street2 || "",
                                    dataObjectnew.temployeelist[j].State || "",
                                    dataObjectnew.temployeelist[j].Postcode || "",
                                    dataObjectnew.temployeelist[j].Country || "",
                                ];

                                splashArrayEmployeeList.push(dataListDupp);
                                //}
                            }
                            let uniqueChars = [...new Set(splashArrayEmployeeList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Accounts Overview List Data
    templateObject.getAccountsOverviewData = async function(deleteFilter = false, typeFilter = 'all') {
        var customerpage = 0;
        getVS1Data('TAccountVS1List').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllTAccountVS1List(initialBaseDataLoad, 0, deleteFilter, typeFilter).then(async function(data) {
                    if(typeFilter == 'all') {
                        await addVS1Data('TAccountVS1List', JSON.stringify(data));
                    }
                    templateObject.displayAccountsOverviewListData(data);
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                if(typeFilter != 'all') {
                    sideBarService.getAllTAccountVS1List(initialBaseDataLoad, 0, deleteFilter, typeFilter).then(async function(data) {
                        templateObject.displayAccountsOverviewListData(data);
                    })                
                }else {
                    templateObject.displayAccountsOverviewListData(data);
                }
            }
        }).catch(function(err) {
            sideBarService.getAllTAccountVS1List(initialBaseDataLoad, 0, deleteFilter, typeFilter).then(async function(data) {
                if(typeFilter == 'all') {
                    await addVS1Data('TAccountVS1List', JSON.stringify(data));
                }
                templateObject.displayAccountsOverviewListData(data);
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayAccountsOverviewListData = async function(data) {
        var splashArrayAccountsOverview = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let fullAccountTypeName = "";
        let accBalance = "";
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.taccountvs1list.length; i++) {
            if (!isNaN(data.taccountvs1list[i].Balance)) {
                accBalance = utilityService.modifynegativeCurrencyFormat(data.taccountvs1list[i].Balance) || 0.0;
            } else {
                accBalance = Currency + "0.00";
            }
            if (data.taccountvs1list[i].ReceiptCategory && data.taccountvs1list[i].ReceiptCategory != '') {
                usedCategories.push(data.taccountvs1list[i].fields);
            }
            let linestatus = '';
            if (data.taccountvs1list[i].Active == true) {
                linestatus = "";
            } else if (data.taccountvs1list[i].Active == false) {
                linestatus = "In-Active";
            };
            var dataList = [
                data.taccountvs1list[i].AccountID || "",
                data.taccountvs1list[i].AccountName || "",
                data.taccountvs1list[i].Description || "",
                data.taccountvs1list[i].AccountNumber || "",
                data.taccountvs1list[i].AccountType || "",
                accBalance || '',
                data.taccountvs1list[i].TaxCode || '',
                data.taccountvs1list[i].BankName || '',
                data.taccountvs1list[i].BankAccountName || '',
                data.taccountvs1list[i].BSB || '',
                data.taccountvs1list[i].BankAccountNumber || "",
                data.taccountvs1list[i].CarNumber || "",
                data.taccountvs1list[i].ExpiryDate || "",
                data.taccountvs1list[i].CVC || "",
                data.taccountvs1list[i].Extra || "",
                data.taccountvs1list[i].BankNumber || "",
                data.taccountvs1list[i].IsHeader || false,
                data.taccountvs1list[i].AllowExpenseClaim || false,
                data.taccountvs1list[i].ReceiptCategory || "",
                linestatus,
                data.taccountvs1list[i].Level1 || "",
                data.taccountvs1list[i].Level2 || "",
                data.taccountvs1list[i].Level3 || "",
            ];

            splashArrayAccountsOverview.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayAccountsOverview);

        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayAccountsOverview,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colAccountId colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colAccountName",
                        width: "200px",
                    },
                    {
                        targets: 2,
                        className: "colDescription"
                    },
                    {
                        targets: 3,
                        className: "colAccountNo",
                        width: "90px",
                    },
                    {
                        targets: 4,
                        className: "colType",
                        width: "60px",
                    },
                    {
                        targets: 5,
                        className: "colBalance text-right",
                        width: "80px",
                    },
                    {
                        targets: 6,
                        className: "colTaxCode",
                        width: "80px",
                    },
                    {
                        targets: 7,
                        className: "colBankName hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 8,
                        className: "colBankAccountName",
                        width: "120px",
                    },
                    {
                        targets: 9,
                        className: "colBSB",
                        width: "95px",
                    },
                    {
                        targets: 10,
                        className: "colBankAccountNo",
                        width: "120px",
                    },
                    {
                        targets: 11,
                        className: "colCardNumber hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 12,
                        className: "colExpiryDate hiddenColumn",
                        width: "60px",
                    },
                    {
                        targets: 13,
                        className: "colCVC hiddenColumn",
                        width: "60px",
                    },
                    {
                        targets: 14,
                        className: "colExtra hiddenColumn",
                        width: "80px",
                    },
                    {
                        targets: 15,
                        className: "colAPCANumber hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 16,
                        className: "colIsHeader hiddenColumn",
                        width: "60px",
                    },
                    {
                        targets: 17,
                        className: "colUseReceiptClaim hiddenColumn",
                        width: "60px",
                    },
                    {
                        targets: 18,
                        className: "colExpenseCategory hiddenColumn",
                        width: "80px",
                    },
                    {
                        targets: 19,
                        className: "colStatus",
                        width: "100px",
                    },
                    {
                        targets: 20,
                        className: "colLevel1 hiddenColumn",
                        width: "60px",
                    },
                    {
                        targets: 21,
                        className: "colLevel2 hiddenColumn",
                        width: "60px",
                    },
                    {
                        targets: 22,
                        className: "colLevel3 hiddenColumn",
                        width: "60px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Accounts Overview",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Accounts Overview',
                        filename: "Accounts Overview",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Accounts Overview",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getAllTAccountVS1List(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.taccountvs1list.length; j++) {
                                if (!isNaN(dataObjectnew.taccountvs1list[j].Balance)) {
                                    accBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.taccountvs1list[j].Balance) || 0.0;
                                } else {
                                    accBalance = Currency + "0.00";
                                }
                                if (dataObjectnew.taccountvs1list[j].ReceiptCategory && dataObjectnew.taccountvs1list[j].ReceiptCategory != '') {
                                    usedCategories.push(dataObjectnew.taccountvs1list[j].fields);
                                }
                                let linestatus = '';
                                if (dataObjectnew.taccountvs1list[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.taccountvs1list[j].Active == false) {
                                    linestatus = "In-Active";
                                };


                                var dataListDupp = [
                                    dataObjectnew.taccountvs1list[j].AccountID || "",
                                    dataObjectnew.taccountvs1list[j].AccountName || "",
                                    dataObjectnew.taccountvs1list[j].Description || "",
                                    dataObjectnew.taccountvs1list[j].AccountNumber || "",
                                    dataObjectnew.taccountvs1list[j].AccountType || "",
                                    accBalance || '',
                                    dataObjectnew.taccountvs1list[j].TaxCode || '',
                                    dataObjectnew.taccountvs1list[j].BankName || '',
                                    dataObjectnew.taccountvs1list[j].BankAccountName || '',
                                    dataObjectnew.taccountvs1list[j].BSB || '',
                                    dataObjectnew.taccountvs1list[j].BankAccountNumber || "",
                                    dataObjectnew.taccountvs1list[j].CarNumber || "",
                                    dataObjectnew.taccountvs1list[j].ExpiryDate || "",
                                    dataObjectnew.taccountvs1list[j].CVC || "",
                                    dataObjectnew.taccountvs1list[j].Extra || "",
                                    dataObjectnew.taccountvs1list[j].BankNumber || "",
                                    dataObjectnew.taccountvs1list[j].IsHeader || false,
                                    dataObjectnew.taccountvs1list[j].AllowExpenseClaim || false,
                                    dataObjectnew.taccountvs1list[j].ReceiptCategory || "",
                                    linestatus,
                                ];

                                splashArrayAccountsOverview.push(dataListDupp);
                                //}
                            }
                            let uniqueChars = [...new Set(splashArrayAccountsOverview)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Do Something Here
    //InventoryOverview Data
    templateObject.getAllProductData = async function(deptname) {
        await templateObject.initCustomFieldDisplaySettings("", "tblInventoryOverview");
        getVS1Data("TProductList").then(function(dataObject) {
            
                if (dataObject.length == 0) {
                    sideBarService.getProductListVS1(initialBaseDataLoad, 0).then(function(data) {
                            addVS1Data("TProductList", JSON.stringify(data));
                            templateObject.displayAllProductData(data,deptname);
                            // addVS1Data('TProductVS1',JSON.stringify(data));
                            //localStorage.setItem('VS1ProductList', JSON.stringify(data)||'');
                        });
                            
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    templateObject.displayAllProductData(data,deptname);
                }
            });
    };

    templateObject.displayAllProductData = async function(data,deptname) {
        let dataTableList = new Array();
        let splashArrayProductList = new Array();

        let lineItems = [];
        let lineItemObj = {};
        let departmentData = "";
        let departmentDataLoad = "";
        let prodQtyData = 0;
        let prodQtyDataLoad = 0;
        let deptStatus = "";
        let checkIfSerialorLot = '';
        //let getDepartmentData = templateObject.productdeptrecords.get();
        var dataList = {};
        //if((deptname == 'undefined') || (deptname == 'All')){
        departmentData = "All";
        for (let i = 0; i < data.tproductlist.length; i++) {
          let availableQty = data.tproductlist[i].AvailableQty||0;
          let onBOOrder = 0;
          if(data.tproductlist[i].SNTracking == true){
            checkIfSerialorLot = '<i class="fas fa-plus-square text-success btnSNTracking"  style="font-size: 22px;" ></i>';
          }else if(data.tproductlist[i].batch == true){
            checkIfSerialorLot = '<i class="fas fa-plus-square text-success btnBatch"  style="font-size: 22px;" ></i>';
          }else{
            checkIfSerialorLot = '<i class="fas fa-plus-square text-success btnNoBatchorSerial"  style="font-size: 22px;" ></i>';
          }

           onBOOrder = data.tproductlist[i].TotalQtyInStock - availableQty;
            var dataList = [
                data.tproductlist[i].PARTSID || "",
                data.tproductlist[i].PARTNAME || "-",
                data.tproductlist[i].PARTSDESCRIPTION || "",
                availableQty,
                data.tproductlist[i].SOBOQty||0,
                data.tproductlist[i].POBOQty||0,
                data.tproductlist[i].InstockQty,
                data.tproductlist[i].AllocatedBOQty,
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductlist[i].COST1 * 100) / 100),
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductlist[i].COSTINC1 * 100) /100),
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductlist[i].PRICE1 * 100) / 100),
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductlist[i].PRICEINC1 * 100) /100),
                checkIfSerialorLot||'',
                data.tproductlist[i].BARCODE || "",
                departmentData,
                data.tproductlist[i].PURCHASEDESC || "",
                data.tproductlist[i].CUSTFLD1 || "",
                data.tproductlist[i].CUSTFLD2 || "",
            ];
            splashArrayProductList.push(dataList);
            dataTableList.push(dataList);
        }
        

        templateObject.transactiondatatablerecords.set(dataTableList);
        // templateObject.datatablebackuprecords.set(dataTableList);


        // localStorage.setItem('VS1ProductList', splashArrayProd);

        if (templateObject.transactiondatatablerecords.get()) {

            setTimeout(function() {
                MakeNegative();
            }, 100);
        }

        $(".fullScreenSpin").css("display", "none");
        setTimeout(function() {
            let columnData = [];
            let displayfields = templateObject.non_trans_displayfields.get();
            if( displayfields.length > 0 ){
                displayfields.forEach(function( item ){
                    columnData.push({
                        className: ( item.active )? item.class : `col${item.class} hiddenColumn`,
                        targets: [item.id],
                    })
                });
            }
            $("#" + currenttablename).dataTable({
                
                data: splashArrayProductList,
                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: columnData,
                  select: true,
                  destroy: true,
                  colReorder: true,
                  buttons: [{
                          extend: "excelHtml5",
                          text: "",
                          download: "open",
                          className: "btntabletocsv hiddenColumn",
                          filename: "inventory_" + moment().format(),
                          orientation: "portrait",
                          exportOptions: {
                              columns: ":visible",
                          },
                      },
                      {
                          extend: "print",
                          download: "open",
                          className: "btntabletopdf hiddenColumn",
                          text: "",
                          title: "Inventory List",
                          filename: "inventory_" + moment().format(),
                          exportOptions: {
                              columns: ":visible",
                          },
                      },
                  ],
                  // bStateSave: true,
                  // rowId: 0,
                  // paging: false,
                  // "scrollY": "800px",
                  // "scrollCollapse": true,
                  pageLength: initialBaseDataLoad,
                  lengthMenu: [
                      [initialBaseDataLoad, -1],
                      [initialBaseDataLoad, "All"],
                  ],
                  info: true,
                  responsive: true,
                  order: [
                      [1, "asc"] // modified by matthias
                  ],
                  action: function() {
                      $("#tblInventoryOverview").DataTable().ajax.reload();
                  },
                  fnDrawCallback: function(oSettings) {
                      $(".paginate_button.page-item").removeClass("disabled");
                      $("#tblInventoryOverview_ellipsis").addClass("disabled");
                      if (oSettings._iDisplayLength == -1) {
                          if (oSettings.fnRecordsDisplay() > 150) {}
                          $(".fullScreenSpin").css("display", "inline-block");
                          setTimeout(function() {
                              $(".fullScreenSpin").css("display", "none");
                          }, 100);
                      } else {}
                      if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                          $(".paginate_button.page-item.next").addClass("disabled");
                      }

                      $(".paginate_button.next:not(.disabled)",this.api().table().container()).on("click", function() {
                          $(".fullScreenSpin").css("display", "inline-block");
                          let dataLenght = oSettings._iDisplayLength;
                          let customerSearch = $("#tblInventoryOverview_filter input").val();
                          sideBarService.getProductListVS1(initialDatatableLoad,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                            getVS1Data("TProductList").then(function (dataObjectold) {
                                if (dataObjectold.length == 0) {
                                } else {
                                  let dataOld = JSON.parse(dataObjectold[0].data);

                                  var thirdaryData = $.merge($.merge([],dataObjectnew.tproductlist),dataOld.tproductlist);
                                  let objCombineData = {
                                    Params: dataOld.Params,
                                    tproductlist: thirdaryData,
                                  };

                                  addVS1Data("TProductList",JSON.stringify(objCombineData)).then(function (datareturn) {
                                      templateObject.resetData(objCombineData);
                                      $(".fullScreenSpin").css("display", "none");
                                    }).catch(function (err) {
                                      $(".fullScreenSpin").css("display", "none");
                                    });
                                }
                            }).catch(function (err) {});

                          }).catch(function(err) {
                              $(".fullScreenSpin").css("display", "none");
                          });
                         });
                      setTimeout(function() {
                          MakeNegative();
                      }, 100);
                  },
                  language: { search: "",searchPlaceholder: "Search List..." },
                  fnInitComplete: function() {
                    let urlParametersPage = FlowRouter.current().queryParams.page;
                    if (urlParametersPage) {
                      this.fnPageChange("last");
                    };
                      $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                      ).insertAfter("#tblInventoryOverview_filter");
                  },
                  "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                      return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                  },
              }).on("length.dt", function(e, settings, len) {
                  $(".fullScreenSpin").css("display", "inline-block");
                  let dataLenght = settings._iDisplayLength;
                  // splashArrayProductList = [];
                  if (dataLenght == -1) {
                      $(".fullScreenSpin").css("display", "none");
                  } else {
                      if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                          $(".fullScreenSpin").css("display", "none");
                      } else {
                          $(".fullScreenSpin").css("display", "none");
                      }
                  }
              });

            $(".fullScreenSpin").css("display", "none");
            $("div.dataTables_filter input").addClass(
                "form-control form-control-sm"
            );
        }, 0);
    // }).catch(function(err) {
    //     // Bert.alert('<strong>' + err + '</strong>!', 'danger');
        $(".fullScreenSpin").css("display", "none");
        // Meteor._reload.reload();
    };

    //Recent Transaction All Data
    templateObject.getAllProductRecentTransactions = async function(deptname) {
        templateObject.initCustomFieldDisplaySettings("", currenttablename);
        getVS1Data('T_VS1_Report_Productmovement').then(function(dataObject) {
            if(dataObject.length == 0){
                productService.getProductRecentTransactionsAll(currentproductID).then(function(data) {
                addVS1Data("T_VS1_Report_Productmovement", JSON.stringify(data));
                templateObject.displayAllProductRecentTransactions(data,deptname)
            });
            }
            else
            {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayAllProductRecentTransactions(data,deptname);
            }
        });
    };
    templateObject.displayAllProductRecentTransactions = function(data,deptname) {
            let recentTransList = new Array();
            for (let i = 0; i < data.t_vs1_report_productmovement.length; i++) {
                // let recentTranObject = {
                //     date: data.t_vs1_report_productmovement[i].TransactionDate != '' ? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY") : data.t_vs1_report_productmovement[i].TransactionDate,
                //     type: data.t_vs1_report_productmovement[i].TranstypeDesc,
                //     transactionno: data.t_vs1_report_productmovement[i].TransactionNo,
                //     reference: data.t_vs1_report_productmovement[i].TransactionNo,
                //     quantity: data.t_vs1_report_productmovement[i].Qty,
                //     unitPrice: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].Price),
                //     total: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].TotalPrice)
                // };
                if(deptname === "all" || deptname === data.t_vs1_report_productmovement[i].TranstypeDesc){
                    let recentTranObject = [
                        data.t_vs1_report_productmovement[i].TransactionDate != '' ? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY") : data.t_vs1_report_productmovement[i].TransactionDate,
                        data.t_vs1_report_productmovement[i].TranstypeDesc,
                        data.t_vs1_report_productmovement[i].TransactionNo,
                        data.t_vs1_report_productmovement[i].Qty,
                        utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].Price),
                        utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].TotalPrice)
                    ];
                    recentTransList.push(recentTranObject);
                }
            }
            let columnData = [];
            let displayfields = templateObject.non_trans_displayfields.get();
            if( displayfields.length > 0 ){
                displayfields.forEach(function( item ){
                    columnData.push({
                        className: ( item.active )? item.class : `col${item.class} hiddenColumn`,
                        targets: [item.id],
                    })
                });
            }

            templateObject.transactiondatatablerecords.set(recentTransList);
            setTimeout(function() {
                $('.fullScreenSpin').css('display', 'inline-block');
                $('#' + currenttablename).DataTable({
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    data:recentTransList,
                    columnDefs: columnData,
                    select: true,
                    destroy: true,
                    colReorder: true,
                    // bStateSave: true,
                    // rowId: 0,
                    pageLength: initialDatatableLoad,
                    lengthMenu: [
                        [initialDatatableLoad, -1],
                        [initialDatatableLoad, "All"]
                    ],
                    info: true,
                    responsive: true,
                    "order": [[0, "desc"],[3, "desc"]],
                    action: function() {
                        $('#productrecentlist').DataTable().ajax.reload();
                    },
                    "fnDrawCallback": function(oSettings) {
                        let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
                        //if(checkurlIgnoreDate == 'true'){

                        //}else{
                        $('.paginate_button.page-item').removeClass('disabled');
                        $('#tblPaymentOverview_ellipsis').addClass('disabled');

                        if (oSettings._iDisplayLength == -1) {
                            if (oSettings.fnRecordsDisplay() > 150) {
                                $('.paginate_button.page-item.previous').addClass('disabled');
                                $('.paginate_button.page-item.next').addClass('disabled');
                            }
                        } else {}
                        if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                            $('.paginate_button.page-item.next').addClass('disabled');
                        }
                        $('.paginate_button.next:not(.disabled)', this.api().table().container())
                            .on('click', function() {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                let dataLenght = oSettings._iDisplayLength;

                                var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                                var dateTo = new Date($("#dateTo").datepicker("getDate"));

                                let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                                let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                                if(data.Params.IgnoreDates == true){
                                    sideBarService.getTPaymentList(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                                        getVS1Data('TPaymentList').then(function(dataObjectold) {
                                            if (dataObjectold.length == 0) {} else {
                                                let dataOld = JSON.parse(dataObjectold[0].data);
                                                var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                let objCombineData = {
                                                    Params: dataOld.Params,
                                                    tpaymentlist: thirdaryData
                                                }

                                                addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                    templateObject.resetData(objCombineData);
                                                    $('.fullScreenSpin').css('display', 'none');
                                                }).catch(function(err) {
                                                    $('.fullScreenSpin').css('display', 'none');
                                                });

                                            }
                                        }).catch(function(err) {});

                                    }).catch(function(err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                } else {
                                    sideBarService.getTPaymentList(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                                        getVS1Data('TPaymentList').then(function(dataObjectold) {
                                            if (dataObjectold.length == 0) {} else {
                                                let dataOld = JSON.parse(dataObjectold[0].data);
                                                var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                let objCombineData = {
                                                    Params: dataOld.Params,
                                                    tpaymentlist: thirdaryData
                                                }

                                                addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                    templateObject.resetData(objCombineData);
                                                    $('.fullScreenSpin').css('display', 'none');
                                                }).catch(function(err) {
                                                    $('.fullScreenSpin').css('display', 'none');
                                                });

                                            }
                                        }).catch(function(err) {});

                                    }).catch(function(err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });

                                }

                            });

                        //}
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    },

                }).on('page', function() {}).on('column-reorder', function() {});
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('.fullScreenSpin').css('display', 'none');
            }, 0);

            $('#productrecentlist tbody').on('click', 'tr', function() {
                var listData = $(this).closest('tr').attr('id');
                var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

                if ((listData) && (transactiontype)) {
                    if (transactiontype === 'Quote') {
                        window.open('/quotecard?id=' + listData, '_self');
                    } else if (transactiontype === 'Sales Order') {
                        window.open('/salesordercard?id=' + listData, '_self');
                    } else if (transactiontype === 'Invoice') {
                        window.open('/invoicecard?id=' + listData, '_self');
                    } else if (transactiontype === 'Purchase Order') {
                        window.open('/purchaseordercard?id=' + listData, '_self');
                    } else if (transactiontype === 'Bill') {
                        //window.open('/billcard?id=' + listData,'_self');
                    } else if (transactiontype === 'Credit') {
                        //window.open('/creditcard?id=' + listData,'_self');
                    }

                }
            });

            // $('.product_recent_trans').css('display', 'block');
            // $([document.documentElement, document.body]).animate({
            //     scrollTop: $(".product_recent_trans").offset().top
            // }, 2000);
            $('.fullScreenSpin').css('display', 'none');
        // }).catch(function(err) {

        //     $('.fullScreenSpin').css('display', 'none');
        //     $('.product_recent_trans').css('display', 'block');
        //     $([document.documentElement, document.body]).animate({
        //         scrollTop: $(".product_recent_trans").offset().top
        //     }, 2000);

        //     //Bert.alert('<strong>' + err + '</strong>!', 'deleting products failed');
        // });
    // });

    };
    
    //Recent Sales Order Data
    templateObject.getAllSOListData = async function() {
        templateObject.initCustomFieldDisplaySettings("",currenttablename);
        getVS1Data("TSalesOrderList").then(function(dataObject) {
            
                if (dataObject.length == 0) {
                    sideBarService.getProductRecentTransactionsAll(initialBaseDataLoad, 0).then(function(data) {
                            addVS1Data("TSalesOrderList", JSON.stringify(data));
                            templateObject.displayAllSOListData(data);
                            
                        });
                            
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    templateObject.displayAllSOListData(data);
                }
            });
    }
    templateObject.displayAllSOListData = async function(data) {
        let recentTransList = [];
        for (let i = 0; i < data.t_vs1_report_productmovement.length; i++) {
            let recentTranObject = {
                date: data.t_vs1_report_productmovement[i].TransactionDate != '' ? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY") : data.t_vs1_report_productmovement[i].TransactionDate,
                type: data.t_vs1_report_productmovement[i].TranstypeDesc,
                transactionno: data.t_vs1_report_productmovement[i].TransactionNo,
                reference: data.t_vs1_report_productmovement[i].TransactionNo,
                quantity: data.t_vs1_report_productmovement[i].Qty,
                unitPrice: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].Price),
                total: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].TotalPrice)
            };
            recentTransList.push(recentTranObject);
        }

        setTimeout(function() {
            $('#productrecentlist').DataTable({
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                data : data,
                select: true,
                destroy: true,
                colReorder: true,
                // bStateSave: true,
                // rowId: 0,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [[0, "desc"],[3, "desc"]],
                action: function() {
                    $('#productrecentlist').DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
                    //if(checkurlIgnoreDate == 'true'){

                    //}else{
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblPaymentOverview_ellipsis').addClass('disabled');

                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {
                            $('.paginate_button.page-item.previous').addClass('disabled');
                            $('.paginate_button.page-item.next').addClass('disabled');
                        }
                    } else {}
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }
                    $('.paginate_button.next:not(.disabled)', this.api().table().container())
                        .on('click', function() {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            let dataLenght = oSettings._iDisplayLength;

                            var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                            var dateTo = new Date($("#dateTo").datepicker("getDate"));

                            let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                            let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                            if(data.Params.IgnoreDates == true){
                                sideBarService.getTPaymentList(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                                    getVS1Data('TPaymentList').then(function(dataObjectold) {
                                        if (dataObjectold.length == 0) {} else {
                                            let dataOld = JSON.parse(dataObjectold[0].data);
                                            var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                            let objCombineData = {
                                                Params: dataOld.Params,
                                                tpaymentlist: thirdaryData
                                            }

                                            addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                templateObject.resetData(objCombineData);
                                                $('.fullScreenSpin').css('display', 'none');
                                            }).catch(function(err) {
                                                $('.fullScreenSpin').css('display', 'none');
                                            });

                                        }
                                    }).catch(function(err) {});

                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            } else {
                                sideBarService.getTPaymentList(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                                    getVS1Data('TPaymentList').then(function(dataObjectold) {
                                        if (dataObjectold.length == 0) {} else {
                                            let dataOld = JSON.parse(dataObjectold[0].data);
                                            var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                            let objCombineData = {
                                                Params: dataOld.Params,
                                                tpaymentlist: thirdaryData
                                            }

                                            addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                templateObject.resetData(objCombineData);
                                                $('.fullScreenSpin').css('display', 'none');
                                            }).catch(function(err) {
                                                $('.fullScreenSpin').css('display', 'none');
                                            });

                                        }
                                    }).catch(function(err) {});

                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });

                            }

                        });

                    //}
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },

            }).on('page', function() {}).on('column-reorder', function() {});
            $('div.dataTables_filter input').addClass('form-control form-control-sm');
            $('.fullScreenSpin').css('display', 'none');
        }, 0);

        $('#productrecentlist tbody').on('click', 'tr', function() {
            var listData = $(this).closest('tr').attr('id');
            var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

            if ((listData) && (transactiontype)) {
                if (transactiontype === 'Quote') {
                    window.open('/quotecard?id=' + listData, '_self');
                } else if (transactiontype === 'Sales Order') {
                    window.open('/salesordercard?id=' + listData, '_self');
                } else if (transactiontype === 'Invoice') {
                    window.open('/invoicecard?id=' + listData, '_self');
                } else if (transactiontype === 'Purchase Order') {
                    window.open('/purchaseordercard?id=' + listData, '_self');
                } else if (transactiontype === 'Bill') {
                    //window.open('/billcard?id=' + listData,'_self');
                } else if (transactiontype === 'Credit') {
                    //window.open('/creditcard?id=' + listData,'_self');
                }

            }
        });

        $('.product_recent_trans').css('display', 'block');
        $([document.documentElement, document.body]).animate({
            scrollTop: $(".product_recent_trans").offset().top
        }, 2000);
        $('.fullScreenSpin').css('display', 'none');
    // }).catch(function(err) {

    //     $('.fullScreenSpin').css('display', 'none');
    //     $('.product_recent_trans').css('display', 'block');
    //     $([document.documentElement, document.body]).animate({
    //         scrollTop: $(".product_recent_trans").offset().top
    //     }, 2000);
    }

    //Supplier List Data
    templateObject.getSupplierListData = async function(deleteFilter = false) {
        var customerpage = 0;
        getVS1Data('TSupplierVS1List').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllSuppliersDataVS1List(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TSupplierVS1List', JSON.stringify(data));
                    templateObject.displaySuppliersListData(data);
                }).catch(function(err) {
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displaySuppliersListData(data);
            }
        }).catch(function(err) {
            sideBarService.getAllSuppliersDataVS1List(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TSupplierVS1List', JSON.stringify(data));
                templateObject.displaySuppliersListData(data);
            }).catch(function(err) {

            });
        });
    }
    templateObject.displaySuppliersListData = async function(data) {
        var splashArraySuppliersList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.tsuppliervs1list.length; i++) {
            let mobile = "";
            //sideBarService.changeDialFormat(data.temployeelist[i].Mobile, data.temployeelist[i].Country);
            let linestatus = '';
            if (data.tsuppliervs1list[i].Active == true) {
                linestatus = "";
            } else if (data.tsuppliervs1list[i].Active == false) {
                linestatus = "In-Active";
            };

            let arBalance = utilityService.modifynegativeCurrencyFormat(data.tsuppliervs1list[i].ARBalance) || 0.00;
            let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tsuppliervs1list[i].ExcessAmount) || 0.00;
            let balance = utilityService.modifynegativeCurrencyFormat(data.tsuppliervs1list[i].Balance) || 0.00;
            let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tsuppliervs1list[i].SupplierCreditLimit) || 0.00;
            let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tsuppliervs1list[i].Balance) || 0.00;

            var dataList = [
                data.tsuppliervs1list[i].ClientID || '',
                data.tsuppliervs1list[i].Company || '',
                data.tsuppliervs1list[i].Phone || '',
                arBalance || 0.00,
                creditBalance || 0.00,
                balance || 0.00,
                creditLimit || 0.00,
                salesOrderBalance || 0.00,
                data.tsuppliervs1list[i].Email || '',
                data.tsuppliervs1list[i].AccountNo || '',
                data.tsuppliervs1list[i].ClientNo || '',
                data.tsuppliervs1list[i].JobTitle || '',
                data.tsuppliervs1list[i].CUSTFLD1 || '',
                data.tsuppliervs1list[i].CUSTFLD2 || '',
                data.tsuppliervs1list[i].Suburb || '',
                data.tsuppliervs1list[i].POState || '',
                data.tsuppliervs1list[i].Postcode || '',
                data.tsuppliervs1list[i].Country || '',
                linestatus,
                data.tsuppliervs1list[i].Notes || '',
            ];
            splashArraySuppliersList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArraySuppliersList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArraySuppliersList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colSupplierID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colCompany",
                        width: "200px",
                    },
                    {
                        targets: 2,
                        className: "colPhone",
                        width: "95px",
                    },
                    {
                        targets: 3,
                        className: "colARBalance text-right",
                        width: "90px",
                    },
                    {
                        targets: 4,
                        className: "colCreditBalance text-right",
                        width: "110px",
                    },
                    {
                        targets: 5,
                        className: "colBalance text-right",
                        width: "80px",
                    },
                    {
                        targets: 6,
                        className: "colCreditLimit text-right hiddenColumn",
                        width: "90px",
                    },
                    {
                        targets: 7,
                        className: "colSalesOrderBalance text-right",
                        width: "120px",
                    },
                    {
                        targets: 8,
                        className: "colEmail hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 9,
                        className: "colAccountNo hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 10,
                        className: "colClientNo hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 11,
                        className: "colJobTitle hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 12,
                        className: "colCustomField1 hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 13,
                        className: "colCustomField2 hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 14,
                        className: "colSuburb hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 15,
                        className: "colState hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 16,
                        className: "colPostcode hiddenColumn",
                        width: "80px",
                    },
                    {
                        targets: 17,
                        className: "colCountry hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 18,
                        className: "colStatus",
                        width: "100px",
                    },
                    {
                        targets: 19,
                        className: "colNotes",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Suppliers List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Suppliers List',
                        filename: "Suppliers List",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Suppliers List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getAllSuppliersDataVS1List(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.tsuppliervs1list.length; j++) {

                                let linestatus = '';
                                if (dataObjectnew.tsuppliervs1list[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.tsuppliervs1list[j].Active == false) {
                                    linestatus = "In-Active";
                                };

                                let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tsuppliervs1list[j].ARBalance) || 0.00;
                                let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tsuppliervs1list[j].ExcessAmount) || 0.00;
                                let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tsuppliervs1list[j].Balance) || 0.00;
                                let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tsuppliervs1list[j].SupplierCreditLimit) || 0.00;
                                let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tsuppliervs1list[j].Balance) || 0.00;

                                var dataListDupp = [
                                    dataObjectnew.tsuppliervs1list[j].ClientID || '',
                                    dataObjectnew.tsuppliervs1list[j].Company || '',
                                    dataObjectnew.tsuppliervs1list[j].Phone || '',
                                    arBalance || 0.00,
                                    creditBalance || 0.00,
                                    balance || 0.00,
                                    creditLimit || 0.00,
                                    salesOrderBalance || 0.00,
                                    dataObjectnew.tsuppliervs1list[j].Email || '',
                                    dataObjectnew.tsuppliervs1list[j].AccountNo || '',
                                    dataObjectnew.tsuppliervs1list[j].ClientNo || '',
                                    dataObjectnew.tsuppliervs1list[j].JobTitle || '',
                                    dataObjectnew.tsuppliervs1list[j].CUSTFLD1 || '',
                                    dataObjectnew.tsuppliervs1list[j].CUSTFLD2 || '',
                                    dataObjectnew.tsuppliervs1list[j].Suburb || '',
                                    dataObjectnew.tsuppliervs1list[j].POState || '',
                                    dataObjectnew.tsuppliervs1list[j].Postcode || '',
                                    dataObjectnew.tsuppliervs1list[j].Country || '',
                                    linestatus,
                                    dataObjectnew.tsuppliervs1list[j].Notes || '',
                                ];

                                splashArraySuppliersList.push(dataListDupp);
                            }
                            let uniqueChars = [...new Set(splashArraySuppliersList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Lead List Data
    templateObject.getLeadListData = async function(deleteFilter = false) {
        var customerpage = 0;
        getVS1Data('TProspectList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllLeadDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TProspectList', JSON.stringify(data));
                    templateObject.displayLeadListData(data);
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayLeadListData(data);
            }
        }).catch(function(err) {
            sideBarService.getAllLeadDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TProspectList', JSON.stringify(data));
                templateObject.displayLeadListData(data);
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayLeadListData = async function(data) {
        var splashArrayLeadList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.tprospectlist.length; i++) {
            let linestatus = '';
            if (data.tprospectlist[i].Active == true) {
                linestatus = "";
            } else if (data.tprospectlist[i].Active == false) {
                linestatus = "In-Active";
            };

            let larBalance = utilityService.modifynegativeCurrencyFormat(data.tprospectlist[i].ARBalance) || 0.00;
            let lcreditBalance = utilityService.modifynegativeCurrencyFormat(data.tprospectlist[i].ExcessAmount) || 0.00;
            let lbalance = utilityService.modifynegativeCurrencyFormat(data.tprospectlist[i].Balance) || 0.00;
            let lcreditLimit = utilityService.modifynegativeCurrencyFormat(data.tprospectlist[i].SupplierCreditLimit) || 0.00;
            let lsalesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tprospectlist[i].Balance) || 0.00;

            var dataList = [
                data.tprospectlist[i].ClientID || '',
                data.tprospectlist[i].Company || '',
                data.tprospectlist[i].Phone || '',
                larBalance || 0.00,
                lcreditBalance || 0.00,
                lbalance || 0.00,
                lcreditLimit || 0.00,
                lsalesOrderBalance || 0.00,
                data.tprospectlist[i].Email || '',
                data.tprospectlist[i].AccountNo || '',
                data.tprospectlist[i].ClientNo || '',
                data.tprospectlist[i].JobTitle || '',
                data.tprospectlist[i].CUSTFLD1 || '',
                data.tprospectlist[i].CUSTFLD2 || '',
                data.tprospectlist[i].Street || '',
                data.tprospectlist[i].Suburb || '',
                data.tprospectlist[i].POState || '',
                data.tprospectlist[i].Postcode || '',
                data.tprospectlist[i].Country || '',
                linestatus,
                data.tprospectlist[i].Notes || '',
            ];
            splashArrayLeadList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayLeadList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayLeadList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colLeadId colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colCompany",
                        width: "200px",
                    },
                    {
                        targets: 2,
                        className: "colPhone",
                        width: "95px",
                    },
                    {
                        targets: 3,
                        className: "colARBalance text-right",
                        width: "90px",
                    },
                    {
                        targets: 4,
                        className: "colCreditBalance text-right",
                        width: "110px",
                    },
                    {
                        targets: 5,
                        className: "colBalance text-right",
                        width: "80px",
                    },
                    {
                        targets: 6,
                        className: "colCreditLimit text-right hiddenColumn",
                        width: "90px",
                    },
                    {
                        targets: 7,
                        className: "colSalesOrderBalance text-right",
                        width: "120px",
                    },
                    {
                        targets: 8,
                        className: "colEmail hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 9,
                        className: "colAccountNo hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 10,
                        className: "colClientNo hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 11,
                        className: "colJobTitle hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 12,
                        className: "colCustomField1 hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 13,
                        className: "colCustomField2 hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 14,
                        className: "colAddress",
                    },
                    {
                        targets: 15,
                        className: "colSuburb hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 16,
                        className: "colState hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 17,
                        className: "colPostcode hiddenColumn",
                        width: "80px",
                    },
                    {
                        targets: 18,
                        className: "colCountry hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 19,
                        className: "colStatus",
                        width: "100px",
                    },
                    {
                        targets: 20,
                        className: "colNotes",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Lead List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Lead List',
                        filename: "Lead List",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Lead List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getAllLeadDataList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.tprospectlist.length; j++) {

                                let linestatus = '';
                                if (dataObjectnew.tprospectlist[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.tprospectlist[j].Active == false) {
                                    linestatus = "In-Active";
                                };

                                let larBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tprospectlist[j].ARBalance) || 0.00;
                                let lcreditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tprospectlist[j].ExcessAmount) || 0.00;
                                let lbalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tprospectlist[j].Balance) || 0.00;
                                let lcreditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tprospectlist[j].SupplierCreditLimit) || 0.00;
                                let lsalesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tprospectlist[j].Balance) || 0.00;

                                var dataListDupp = [
                                    dataObjectnew.tprospectlist[j].ClientID || '',
                                    dataObjectnew.tprospectlist[j].Company || '',
                                    dataObjectnew.tprospectlist[j].Phone || '',
                                    larBalance || 0.00,
                                    lcreditBalance || 0.00,
                                    lbalance || 0.00,
                                    lcreditLimit || 0.00,
                                    lsalesOrderBalance || 0.00,
                                    dataObjectnew.tprospectlist[j].Email || '',
                                    dataObjectnew.tprospectlist[j].AccountNo || '',
                                    dataObjectnew.tprospectlist[j].ClientNo || '',
                                    dataObjectnew.tprospectlist[j].JobTitle || '',
                                    dataObjectnew.tprospectlist[j].CUSTFLD1 || '',
                                    dataObjectnew.tprospectlist[j].CUSTFLD2 || '',
                                    dataObjectnew.tprospectlist[j].Street || '',
                                    dataObjectnew.tprospectlist[j].Suburb || '',
                                    dataObjectnew.tprospectlist[j].POState || '',
                                    dataObjectnew.tprospectlist[j].Postcode || '',
                                    dataObjectnew.tprospectlist[j].Country || '',
                                    linestatus,
                                    dataObjectnew.tprospectlist[j].Notes || '',
                                ];

                                splashArrayLeadList.push(dataListDupp);

                            }
                            let uniqueChars = [...new Set(splashArrayLeadList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Client Type List Data
    templateObject.getClientTypeListData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        var customerpage = 0;
        getVS1Data('TClientTypeList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getClientTypeDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TClientTypeList', JSON.stringify(data));
                    templateObject.displayClientTypeListData(data); //Call this function to display data on the table
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayClientTypeListData(data); //Call this function to display data on the table
            }
        }).catch(function(err) {
            sideBarService.getClientTypeDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TClientTypeList', JSON.stringify(data));
                templateObject.displayClientTypeListData(data); //Call this function to display data on the table
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayClientTypeListData = async function(data) {
        var splashArrayClientTypeList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        // if(data.Params.Search.replace(/\s/g, "") == ""){
        //   deleteFilter = true;
        // }else{
        //   deleteFilter = false;
        // };
        for (let i = 0; i < data.tclienttype.length; i++) {
            let mobile = "";
            //sideBarService.changeDialFormat(data.temployeelist[i].Mobile, data.temployeelist[i].Country);
            let linestatus = '';
            if (data.tclienttype[i].fields.Active == true) {
                linestatus = "";
            } else if (data.tclienttype[i].fields.Active == false) {
                linestatus = "In-Active";
            };
            var dataList = [
                data.tclienttype[i].fields.ID || "",
                data.tclienttype[i].fields.TypeName || "",
                data.tclienttype[i].fields.TypeDescription || "",
                data.tclienttype[i].fields.CreditLimit || 0.0,
                data.tclienttype[i].fields.DefaultPostAccount || "",
                data.tclienttype[i].fields.GracePeriod || "",
                data.tclienttype[i].fields.TermsName || "", //need to be replaced with Default Discount
                data.tclienttype[i].fields.TermsName || "",
                data.tclienttype[i].fields.TermsName || "", // need to be replaced with prefered payment method
                linestatus,
            ];

            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);

        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colClientTypeID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colTypeName",
                        width: "200px",
                    },
                    {
                        targets: 2,
                        className: "colDescription",
                    },
                    {
                        targets: 3,
                        className: "colCreditLimit hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 4,
                        className: "colDefaultAccount hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 5,
                        className: "colGracePeriod hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 6,
                        className: "colDefaultDiscount",
                        width: "200px",
                    },
                    {
                        targets: 7,
                        className: "colTerms",
                        width: "200px",
                    },
                    {
                        targets: 8,
                        className: "colPreferedPaymentMethod",
                        width: "300px",
                    },
                    {
                        targets: 9,
                        className: "colStatus",
                        width: "100px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getClientTypeDataList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.tclienttype.fields.length; j++) {
                                let mobile = sideBarService.changeDialFormat(dataObjectnew.tclienttype[j].fields.Mobile, dataObjectnew.tclienttype[j].fields.Country);
                                let linestatus = '';
                                if (dataObjectnew.tclienttype[j].fields.Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.tclienttype[j].fields.Active == false) {
                                    linestatus = "In-Active";
                                };

                                var dataListDupp = [
                                    dataObjectnew.tclienttype[j].fields.ID || "",
                                    dataObjectnew.tclienttype[j].fields.TypeName || "",
                                    dataObjectnew.tclienttype[j].fields.TypeDescription || "",
                                    dataObjectnew.tclienttype[j].fields.CreditLimit || 0.0,
                                    dataObjectnew.tclienttype[j].fields.DefaultPostAccount || "",
                                    dataObjectnew.tclienttype[j].fields.GracePeriod || "",
                                    dataObjectnew.tclienttype[j].fields.TermsName || "", //Need to be replaced with Default Discount
                                    dataObjectnew.tclienttype[j].fields.TermsName || "",
                                    dataObjectnew.tclienttype[j].fields.TermsName || "", // Need to be replaced with Prefered payment method.
                                    linestatus
                                ];

                                splashArrayClientTypeList.push(dataListDupp);
                            }
                            let uniqueChars = [...new Set(splashArrayClientTypeList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    // let countTableData = data.Params.Count || 0; //get count from API data
                    //
                    // return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Lead Status List Data
    templateObject.getLeadStatusListData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        var customerpage = 0;
        getVS1Data('TLeadStatusTypeList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getLeadStatusDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TLeadStatusTypeList', JSON.stringify(data));
                    templateObject.displayLeadStatusListData(data); //Call this function to display data on the table
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayLeadStatusListData(data); //Call this function to display data on the table
            }
        }).catch(function(err) {
            sideBarService.getLeadStatusDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TLeadStatusTypeList', JSON.stringify(data));
                templateObject.displayLeadStatusListData(data); //Call this function to display data on the table
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayLeadStatusListData = async function(data) {
        var splashArrayLeadStatusList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        let isDefault = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.tleadstatustypelist.length; i++) {
            let mobile = "";
            //sideBarService.changeDialFormat(data.temployeelist[i].Mobile, data.temployeelist[i].Country);
            if (data.tleadstatustypelist[i].IsDefault == true) {
                isDefault = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.tleadstatustypelist[i].ID + '" checked><label class="custom-control-label chkBox" for="iseomplus-' + data.tleadstatustypelist[i].ID + '"></label></div>';
            } else {
                isDefault = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.tleadstatustypelist[i].ID + '"><label class="custom-control-label chkBox" for="iseomplus-' + data.tleadstatustypelist[i].ID + '"></label></div>';
            };
            let linestatus = '';
            if (data.tleadstatustypelist[i].Active == true) {
                linestatus = "";
            } else if (data.tleadstatustypelist[i].Active == false) {
                linestatus = "In-Active";
            };
            let eqpm = Number(data.tleadstatustypelist[i].EQPM);
            var dataList = [
                data.tleadstatustypelist[i].ID || "",
                data.tleadstatustypelist[i].TypeCode || "",
                data.tleadstatustypelist[i].Name || "",
                data.tleadstatustypelist[i].Description || "",
                isDefault,
                utilityService.negativeNumberFormat(eqpm) || 0,
                linestatus
            ];

            splashArrayLeadStatusList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayLeadStatusList);

        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayLeadStatusList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colLeadStatusID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colLeadTypeCode hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 2,
                        className: "colStatusName",
                        width: "200px",
                    },
                    {
                        targets: 3,
                        className: "colDescription",
                    },
                    {
                        targets: 4,
                        className: "colIsDefault hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 5,
                        className: "colQuantity",
                        width: "250px",
                    },
                    {
                        targets: 6,
                        className: "colStatus",
                        width: "100px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Lead Status Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Lead Status Settings',
                        filename: "Lead Status Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Lead Status Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getLeadStatusDataList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {
                            let isDefault = false;
                            for (let j = 0; j < dataObjectnew.tleadstatustypelist.length; j++) {

                                if (dataObjectnew.tleadstatustypelist[j].IsDefault == true) {
                                    isDefault = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="' + dataObjectnew.tleadstatustypelist[j].ID + '" checked><label class="custom-control-label chkBox" for="' + dataObjectnew.tleadstatustypelist[j].ID + '"></label></div>';
                                } else {
                                    isDefault = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="' + dataObjectnew.tleadstatustypelist[j].ID + '"><label class="custom-control-label chkBox" for="' + dataObjectnew.tleadstatustypelist[j].ID + '"></label></div>';
                                };

                                let linestatus = '';
                                if (dataObjectnew.tleadstatustypelist[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.tleadstatustypelist[j].Active == false) {
                                    linestatus = "In-Active";
                                };


                                var dataListDupp = [
                                    dataObjectnew.tleadstatustypelist[i].ID || "",
                                    dataObjectnew.tleadstatustypelist[i].TypeCode || "",
                                    dataObjectnew.tleadstatustypelist[i].Name || "",
                                    dataObjectnew.tleadstatustypelist[i].Description || "",
                                    isDefault,
                                    utilityService.negativeNumberFormat(eqpm) || 0,
                                    linestatus
                                ];

                                splashArrayLeadStatusList.push(dataListDupp);
                                //}
                            }
                            let uniqueChars = [...new Set(splashArrayLeadStatusList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {

                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalLeadStatus' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');

                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Department List Data
    templateObject.getDepartmentData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        var customerpage = 0;
        getVS1Data('TDeptClassList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getDepartmentDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TDeptClassList', JSON.stringify(data));
                    templateObject.displayDepartmentListData(data); //Call this function to display data on the table
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayDepartmentListData(data); //Call this function to display data on the table
            }
        }).catch(function(err) {
            sideBarService.getDepartmentDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TDeptClassList', JSON.stringify(data));
                templateObject.displayDepartmentListData(data); //Call this function to display data on the table
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayDepartmentListData = async function(data) {
        var splashArrayDepartmentList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.tdeptclasslist.length; i++) {
            let mobile = "";
            let linestatus = '';
            let deptFName = '';
            if (data.tdeptclasslist[i].Active == true) {
                linestatus = "";
            } else if (data.tdeptclasslist[i].Active == false) {
                linestatus = "In-Active";
            };

            var dataList = [
                data.tdeptclasslist[i].ClassID || "",
                data.tdeptclasslist[i].ClassName || "",
                data.tdeptclasslist[i].Description || "",
                data.tdeptclasslist[i].ClassGroup || "",
                data.tdeptclasslist[i].ClassName,
                data.tdeptclasslist[i].Level1 || "",
                data.tdeptclasslist[i].SiteCode || "",
                linestatus
            ];

            splashArrayDepartmentList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayDepartmentList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayDepartmentList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colDeptID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colDeptName",
                        width: "200px",
                    },
                    {
                        targets: 2,
                        className: "colDescription",
                    },
                    {
                        targets: 3,
                        className: "colHeaderDept hiddenColumn",
                        width: "250px",
                    },
                    {
                        targets: 4,
                        className: "colFullDeptName hiddenColumn",
                        width: "250px",
                    },
                    {
                        targets: 5,
                        className: "colDeptTree hiddenColumn",
                        width: "250px",
                    },
                    {
                        targets: 6,
                        className: "colSiteCode",
                    },
                    {
                        targets: 7,
                        className: "colStatus",
                        width: "100px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Department Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Department Settings',
                        filename: "Department Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Department Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getDepartmentDataList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {
                            for (let j = 0; j < dataObjectnew.tdeptclasslist.length; j++) {
                                let deptFName = '';
                                let linestatus = '';
                                if (dataObjectnew.tdeptclasslist[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.tdeptclasslist[j].Active == false) {
                                    linestatus = "In-Active";
                                };
                                var dataListDupp = [
                                    dataObjectnew.tdeptclasslist[j].ID || "",
                                    dataObjectnew.tdeptclasslist[j].ClassName || "",
                                    dataObjectnew.tdeptclasslist[j].Description || "",
                                    dataObjectnew.tdeptclasslist[j].ClassGroup || "",
                                    dataObjectnew.tdeptclasslist[j].ClassName,
                                    dataObjectnew.tdeptclasslist[j].Level1 || "",
                                    dataObjectnew.tdeptclasslist[j].SiteCode || "",
                                    linestatus
                                ];

                                splashArrayDepartmentList.push(dataListDupp);
                            }
                            let uniqueChars = [...new Set(splashArrayDepartmentList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalDepartment' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Payment Method List Data
    templateObject.getPaymentMethodData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        var customerpage = 0;
        getVS1Data('TPaymentMethodList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getPaymentMethodDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TPaymentMethodList', JSON.stringify(data));
                    templateObject.displayPaymentMethodListData(data); //Call this function to display data on the table
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayPaymentMethodListData(data); //Call this function to display data on the table
            }
        }).catch(function(err) {
            sideBarService.getPaymentMethodDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TPaymentMethodList', JSON.stringify(data));
                templateObject.displayPaymentMethodListData(data); //Call this function to display data on the table
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayPaymentMethodListData = async function(data) {
        var splashArrayPaymentMethodList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.tpaymentmethodlist.length; i++) {

            let linestatus = '';
            if (data.tpaymentmethodlist[i].Active == true) {
                linestatus = "";
            } else if (data.tpaymentmethodlist[i].Active == false) {
                linestatus = "In-Active";
            };
            let tdIsCreditCard = '';

            if (data.tpaymentmethodlist[i].IsCreditCard == true) {
                tdIsCreditCard = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-' + data.tpaymentmethodlist[i].PayMethodID + '" checked><label class="custom-control-label chkBox" for="iscreditcard-' + data.tpaymentmethodlist[i].PayMethodID + '"></label></div>';
            } else {
                tdIsCreditCard = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-' + data.tpaymentmethodlist[i].PayMethodID + '"><label class="custom-control-label chkBox" for="iscreditcard-' + data.tpaymentmethodlist[i].PayMethodID + '"></label></div>';
            };
            var dataList = [
                data.tpaymentmethodlist[i].PayMethodID || "",
                data.tpaymentmethodlist[i].Name || "",
                tdIsCreditCard,
                linestatus,
            ];

            splashArrayPaymentMethodList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayPaymentMethodList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayPaymentMethodList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colPayMethodID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colName",
                    },
                    {
                        targets: 2,
                        className: "colIsCreditCard",
                        width: "105px",
                    },
                    {
                        targets: 3,
                        className: "colStatus",
                        width: "100px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Payment Method Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Payment Method  Settings',
                        filename: "Payment Method Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Payment Method Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getAllTPaymentMethodList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.tpaymentmethodlist.length; j++) {
                                let linestatus = '';
                                if (dataObjectnew.tpaymentmethodlist[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.tpaymentmethodlist[j].Active == false) {
                                    linestatus = "In-Active";
                                };
                                if (dataObjectnew.tpaymentmethodlist[i].IsCreditCard == true) {
                                    tdIsCreditCard = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-' + dataObjectnew.tpaymentmethodlist[j].PayMethodID + '" checked><label class="custom-control-label chkBox" for="iscreditcard-' + data.tpaymentmethodlist[j].PayMethodID + '"></label></div>';
                                } else {
                                    tdIsCreditCard = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-' + dataObjectnew.tpaymentmethodlist[j].PayMethodID + '"><label class="custom-control-label chkBox" for="iscreditcard-' + dataObjectnew.tpaymentmethodlist[j].PayMethodID + '"></label></div>';
                                };

                                var dataListDupp = [
                                    dataObjectnew.tpaymentmethodlist[j].ID || "",
                                    dataObjectnew.tpaymentmethodlist[j].Name || "",
                                    tdIsCreditCard,
                                    linestatus
                                ];

                                splashArrayPaymentMethodList.push(dataListDupp);
                            }
                            let uniqueChars = [...new Set(splashArrayPaymentMethodList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalPaymentMethod' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Terms List Data
    templateObject.getTermsData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        var customerpage = 0;
        getVS1Data('TTermsVS1List').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getTermsDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TTermsVS1List', JSON.stringify(data));
                    templateObject.displayTermsListData(data); //Call this function to display data on the table
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayTermsListData(data); //Call this function to display data on the table
            }
        }).catch(function(err) {
            sideBarService.getTermsDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TTermsVS1List', JSON.stringify(data));
                templateObject.displayTermsListData(data); //Call this function to display data on the table
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayTermsListData = async function(data) {
        var splashArrayTermsList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.ttermsvs1list.length; i++) {
            let mobile = "";
            //sideBarService.changeDialFormat(data.temployeelist[i].Mobile, data.temployeelist[i].Country);
            let linestatus = '';
            if (data.ttermsvs1list[i].Active == true) {
                linestatus = "";
            } else if (data.ttermsvs1list[i].Active == false) {
                linestatus = "In-Active";
            };
            let tdEOM = '';
            let tdEOMPlus = '';
            let tdCustomerDef = ''; //isSalesdefault
            let tdSupplierDef = ''; //isPurchasedefault
            let tdProgressPayment = ''; //isProgressPayment
            let tdRequired = ''; //Required
            let tdEarlyPayDiscount = ''; //EarlyPaymentDiscount
            let tdEarlyPay = ''; //EarlyPayment
            let tdProgressPayType = ''; //ProgressPayType
            let tdProgressPayDuration = ''; //ProgressPayDuration
            let tdPayOnSale = ''; //PayOnSale

            //Check if EOM is checked
            if (data.ttermsvs1list[i].IsEOM == true) {
                tdEOM = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseom-' + data.ttermsvs1list[i].ID + '" checked><label class="custom-control-label chkBox" for="iseom-' + data.ttermsvs1list[i].ID + '"></label></div>';
            } else {
                tdEOM = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseom-' + data.ttermsvs1list[i].ID + '"><label class="custom-control-label chkBox" for="iseom-' + data.ttermsvs1list[i].ID + '"></label></div>';
            }
            //Check if EOM Plus is checked
            if (data.ttermsvs1list[i].IsEOMPlus == true) {
                tdEOMPlus = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.ttermsvs1list[i].ID + '" checked><label class="custom-control-label chkBox" for="iseomplus-' + data.ttermsvs1list[i].ID + '"></label></div>';
            } else {
                tdEOMPlus = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.ttermsvs1list[i].ID + '"><label class="custom-control-label chkBox" for="iseomplus-' + data.ttermsvs1list[i].ID + '"></label></div>';
            }
            //Check if Customer Default is checked // //isSalesdefault
            if (data.ttermsvs1list[i].isSalesdefault == true) {
                tdCustomerDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isSalesdefault-' + data.ttermsvs1list[i].ID + '" checked><label class="custom-control-label chkBox" for="isSalesdefault-' + data.ttermsvs1list[i].ID + '"></label></div>';
            } else {
                tdCustomerDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isSalesdefault-' + data.ttermsvs1list[i].ID + '"><label class="custom-control-label chkBox" for="isSalesdefault-' + data.ttermsvs1list[i].ID + '"></label></div>';
            }
            //Check if Supplier Default is checked // isPurchasedefault
            if (data.ttermsvs1list[i].isPurchasedefault == true) {
                tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isPurchasedefault-' + data.ttermsvs1list[i].ID + '" checked><label class="custom-control-label chkBox" for="isPurchasedefault-' + data.ttermsvs1list[i].ID + '"></label></div>';
            } else {
                tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.ttermsvs1list[i].ID + '"><label class="custom-control-label chkBox" for="isPurchasedefault-' + data.ttermsvs1list[i].ID + '"></label></div>';
            }
            //Check if is progress payment is checked
            if (data.ttermsvs1list[i].IsProgressPayment == true) {
                tdProgressPayment = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="IsProgressPayment-' + data.ttermsvs1list[i].ID + '" checked><label class="custom-control-label chkBox" for="IsProgressPayment-' + data.ttermsvs1list[i].ID + '"></label></div>';
            } else {
                tdProgressPayment = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="IsProgressPayment-' + data.ttermsvs1list[i].ID + '"><label class="custom-control-label chkBox" for="IsProgressPayment-' + data.ttermsvs1list[i].ID + '"></label></div>';
            }
            //Check if Required is checked
            if (data.ttermsvs1list[i].Required == true) {
                tdRequired = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="Required-' + data.ttermsvs1list[i].ID + '" checked><label class="custom-control-label chkBox" for="Required-' + data.ttermsvs1list[i].ID + '"></label></div>';
            } else {
                tdRequired = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="Required-' + data.ttermsvs1list[i].ID + '"><label class="custom-control-label chkBox" for="Required-' + data.ttermsvs1list[i].ID + '"></label></div>';
            }

            //Check if ProgressPaymentfirstPayonSaleDate is checked
            if (data.ttermsvs1list[i].ProgressPaymentfirstPayonSaleDate == true) {
                tdPayOnSale = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="ProgressPaymentfirstPayonSaleDate-' + data.ttermsvs1list[i].ID + '" checked><label class="custom-control-label chkBox" for="ProgressPaymentfirstPayonSaleDate-' + data.ttermsvs1list[i].ID + '"></label></div>';
            } else {
                tdPayOnSale = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="ProgressPaymentfirstPayonSaleDate-' + data.ttermsvs1list[i].ID + '"><label class="custom-control-label chkBox" for="ProgressPaymentfirstPayonSaleDate-' + data.ttermsvs1list[i].ID + '"></label></div>';
            };

            var dataList = [
                data.ttermsvs1list[i].ID || "",
                data.ttermsvs1list[i].Terms || "",
                data.ttermsvs1list[i].TermsAmount || "",
                tdEOM,
                tdEOMPlus,
                data.ttermsvs1list[i].Description || "",
                tdCustomerDef,
                tdSupplierDef,
                linestatus,
                tdProgressPayment,
                tdRequired,
                data.ttermsvs1list[i].EarlyPaymentDiscount || 0.00,
                data.ttermsvs1list[i].EarlyPaymentDays || 0.00,
                data.ttermsvs1list[i].ProgressPaymentType || "",
                data.ttermsvs1list[i].ProgressPaymentDuration || 0.00,
                data.ttermsvs1list[i].ProgressPaymentInstallments || 0.00,
                data.ttermsvs1list[i].ProgressPaymentfirstPayonSaleDate || 0.00,
            ];

            splashArrayTermsList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayTermsList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayTermsList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colTermsID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colName",
                        width: "150px",
                    },
                    {
                        targets: 2,
                        className: "colTermsAmount",
                        width: "120px",
                    },
                    {
                        targets: 3,
                        className: "colIsEOM",
                        width: "50px",
                    },
                    {
                        targets: 4,
                        className: "colIsEOMPlus",
                        width: "80px",
                    },
                    {
                        targets: 5,
                        className: "colDescription",
                    },
                    {
                        targets: 6,
                        className: "colCustomerDef",
                        width: "130px",
                    },
                    {
                        targets: 7,
                        className: "colSupplierDef",
                        width: "125px",
                    },
                    {
                        targets: 8,
                        className: "colStatus",
                        width: "100px",
                    },
                    {
                        targets: 9,
                        className: "colIsProgressPayment hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 10,
                        className: "colRequired hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 11,
                        className: "colEarlyPayDiscount hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 12,
                        className: "colEarlyPay hiddenColumn",
                        width: "150px",
                    },
                    {
                        targets: 13,
                        className: "colProgressPayType hiddenColumn",
                        width: "150px",
                    },
                    {
                        targets: 14,
                        className: "colProgressPayDuration hiddenColumn",
                        width: "150px",
                    },
                    {
                        targets: 15,
                        className: "colPayOnSale hiddenColumn",
                        width: "150px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Terms Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Terms Settings',
                        filename: "Terms Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Terms Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getTermsDataList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.ttermsvs1list.length; j++) {
                                let linestatus = '';
                                if (dataObjectnew.ttermsvs1list[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.ttermsvs1list[j].Active == false) {
                                    linestatus = "In-Active";
                                };

                                //Check if EOM is checked
                                if (dataObjectnew.ttermsvs1list[j].IsEOM == true) {
                                    tdEOM = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseom-' + dataObjectnew.ttermsvs1list[j].ID + '" checked><label class="custom-control-label chkBox" for="iseom-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                } else {
                                    tdEOM = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseom-' + dataObjectnew.ttermsvs1list[j].ID + '"><label class="custom-control-label chkBox" for="iseom-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                }
                                //Check if EOM Plus is checked
                                if (dataObjectnew.ttermsvs1list[j].IsEOMPlus == true) {
                                    tdEOMPlus = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + dataObjectnew.ttermsvs1list[j].ID + '" checked><label class="custom-control-label chkBox" for="iseomplus-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                } else {
                                    tdEOMPlus = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + dataObjectnew.ttermsvs1list[j].ID + '"><label class="custom-control-label chkBox" for="iseomplus-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                }
                                //Check if Customer Default is checked // //isSalesdefault
                                if (dataObjectnew.ttermsvs1list[j].isSalesdefault == true) {
                                    tdCustomerDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isSalesdefault-' + dataObjectnew.ttermsvs1list[j].ID + '" checked><label class="custom-control-label chkBox" for="isSalesdefault-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                } else {
                                    tdCustomerDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isSalesdefault-' + dataObjectnew.ttermsvs1list[j].ID + '"><label class="custom-control-label chkBox" for="isSalesdefault-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                }
                                //Check if Supplier Default is checked // isPurchasedefault
                                if (dataObjectnew.ttermsvs1list[j].isPurchasedefault == true) {
                                    tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isPurchasedefault-' + dataObjectnew.ttermsvs1list[j].ID + '" checked><label class="custom-control-label chkBox" for="isPurchasedefault-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                } else {
                                    tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + dataObjectnew.ttermsvs1list[j].ID + '"><label class="custom-control-label chkBox" for="isPurchasedefault-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                }

                                //Check if is progress payment is checked
                                if (dataObjectnew.ttermsvs1list[j].IsProgressPayment == true) {
                                    tdProgressPayment = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="IsProgressPayment-' + dataObjectnew.ttermsvs1list[j].ID + '" checked><label class="custom-control-label chkBox" for="IsProgressPayment-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                } else {
                                    tdProgressPayment = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="IsProgressPayment-' + dataObjectnew.ttermsvs1list[j].ID + '"><label class="custom-control-label chkBox" for="IsProgressPayment-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                }
                                //Check if Required is checked
                                if (dataObjectnew.ttermsvs1list[j].Required == true) {
                                    tdRequired = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="Required-' + dataObjectnew.ttermsvs1list[j].ID + '" checked><label class="custom-control-label chkBox" for="Required-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                } else {
                                    tdRequired = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="Required-' + dataObjectnew.ttermsvs1list[j].ID + '"><label class="custom-control-label chkBox" for="Required-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                }

                                //Check if ProgressPaymentfirstPayonSaleDate is checked
                                if (dataObjectnew.ttermsvs1list[j].ProgressPaymentfirstPayonSaleDate == true) {
                                    tdPayOnSale = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="ProgressPaymentfirstPayonSaleDate-' + dataObjectnew.ttermsvs1list[j].ID + '" checked><label class="custom-control-label chkBox" for="ProgressPaymentfirstPayonSaleDate-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                } else {
                                    tdPayOnSale = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="ProgressPaymentfirstPayonSaleDate-' + dataObjectnew.ttermsvs1list[j].ID + '"><label class="custom-control-label chkBox" for="ProgressPaymentfirstPayonSaleDate-' + dataObjectnew.ttermsvs1list[j].ID + '"></label></div>';
                                }

                                var dataListDupp = [
                                    dataObjectnew.ttermsvs1list[j].ID || "",
                                    dataObjectnew.ttermsvs1list[j].Terms || "",
                                    dataObjectnew.ttermsvs1list[j].TermsAmount || "",
                                    tdEOM,
                                    tdEOMPlus,
                                    dataObjectnew.ttermsvs1list[j].Description || "",
                                    tdCustomerDef,
                                    tdSupplierDef,
                                    linestatus,
                                    tdProgressPayment,
                                    tdRequired,
                                    data.ttermsvs1list[j].EarlyPaymentDiscount || 0.00,
                                    data.ttermsvs1list[j].EarlyPaymentDays || 0.00,
                                    data.ttermsvs1list[j].ProgressPaymentType || "",
                                    data.ttermsvs1list[j].ProgressPaymentDuration || 0.00,
                                    data.ttermsvs1list[j].ProgressPaymentInstallments || 0.00,
                                    data.ttermsvs1list[j].ProgressPaymentfirstPayonSaleDate || 0.00
                                ];

                                splashArrayTermsList.push(dataListDupp);
                                //}
                            }
                            let uniqueChars = [...new Set(splashArrayTermsList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalTerms' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //UOM List Data
    templateObject.getUOMListData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        var customerpage = 0;
        getVS1Data('TUnitOfMeasureList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getUOMDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TUnitOfMeasureList', JSON.stringify(data));
                    templateObject.displayUOMListData(data); //Call this function to display data on the table
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayUOMListData(data); //Call this function to display data on the table
            }
        }).catch(function(err) {
            sideBarService.getUOMDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TUnitOfMeasureList', JSON.stringify(data));
                templateObject.displayUOMListData(data); //Call this function to display data on the table
            }).catch(function(err) {

            });
        });
    }
    templateObject.displayUOMListData = async function(data) {
        var splashArrayUOMList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.tunitofmeasurelist.length; i++) {
            let mobile = "";
            let linestatus = '';
            let tdCustomerDef = ''; //isSalesdefault
            let tdSupplierDef = ''; //isPurchasedefault
            let tdUseforAutoSplitQtyinSales = ''; //UseforAutoSplitQtyinSales
            if (data.tunitofmeasurelist[i].Active == true) {
                linestatus = "";
            } else if (data.tunitofmeasurelist[i].Active == false) {
                linestatus = "In-Active";
            };

            //Check if Sales defaultis checked
            if (data.tunitofmeasurelist[i].SalesDefault == true) {
                tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtSalesDefault-' + data.tunitofmeasurelist[i].ID + '" checked><label class="custom-control-label chkBox" for="swtSalesDefault-' + data.tunitofmeasurelist[i].ID + '"></label></div>';
            } else {
                tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtSalesDefault-' + data.tunitofmeasurelist[i].ID + '"><label class="custom-control-label chkBox" for="swtSalesDefault-' + data.tunitofmeasurelist[i].ID + '"></label></div>';
            }
            //Check if Purchase default is checked
            if (data.tunitofmeasurelist[i].PurchasesDefault == true) {
                tdPurchaseDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' + data.tunitofmeasurelist[i].ID + '" checked><label class="custom-control-label chkBox" for="swtPurchaseDefault-' + data.tunitofmeasurelist[i].ID + '"></label></div>';
            } else {
                tdPurchaseDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' + data.tunitofmeasurelist[i].ID + '"><label class="custom-control-label chkBox" for="swtPurchaseDefault-' + data.tunitofmeasurelist[i].ID + '"></label></div>';
            }

            //Check if UseforAutoSplitQtyinSales is checked
            if (data.tunitofmeasurelist[i].UseforAutoSplitQtyinSales == true) {
                tdUseforAutoSplitQtyinSales = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' + data.tunitofmeasurelist[i].ID + '" checked><label class="custom-control-label chkBox" for="swtPurchaseDefault-' + data.tunitofmeasurelist[i].ID + '"></label></div>';
            } else {
                tdUseforAutoSplitQtyinSales = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' + data.tunitofmeasurelist[i].ID + '"><label class="custom-control-label chkBox" for="swtPurchaseDefault-' + data.tunitofmeasurelist[i].ID + '"></label></div>';
            }

            var dataList = [
                data.tunitofmeasurelist[i].ID || '',
                data.tunitofmeasurelist[i].UnitName || '',
                data.tunitofmeasurelist[i].UnitDescription || '',
                data.tunitofmeasurelist[i].UnitProductKeyName || '',
                data.tunitofmeasurelist[i].BaseUnitName || '',
                data.tunitofmeasurelist[i].BaseUnitID || '',
                data.tunitofmeasurelist[i].PartID || '',
                data.tunitofmeasurelist[i].Multiplier || 0,
                tdSupplierDef,
                tdPurchaseDef,
                data.tunitofmeasurelist[i].Weight || 0,
                data.tunitofmeasurelist[i].NoOfBoxes || 0,
                data.tunitofmeasurelist[i].Height || 0,
                data.tunitofmeasurelist[i].Width || 0,
                data.tunitofmeasurelist[i].Length || 0,
                data.tunitofmeasurelist[i].Volume || 0,
                linestatus,
                tdUseforAutoSplitQtyinSales
            ];
            splashArrayUOMList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayUOMList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayUOMList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colUOMID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colUOMName",
                        width: "200px",
                    }, {
                        targets: 2,
                        className: "colUOMDesc",
                    }, {
                        targets: 3,
                        className: "colUOMProduct",
                        width: "250px",
                    }, {
                        targets: 4,
                        className: "colUOMBaseUnitName hiddenColumn",
                        width: "150px",
                    }, {
                        targets: 5,
                        className: "colUOMBaseUnitID hiddenColumn",
                        width: "100px",
                    }, {
                        targets: 6,
                        className: "colUOMPartID hiddenColumn",
                        width: "100px",
                    }, {
                        targets: 7,
                        className: "colUOMMultiplier",
                        width: "140px",
                    }, {
                        targets: 8,
                        className: "colUOMSalesDefault",
                        width: "140px",
                    }, {
                        targets: 9,
                        className: "colUOMPurchaseDefault",
                        width: "170px",
                    }, {
                        targets: 10,
                        className: "colUOMWeight",
                        width: "120px",
                    }, {
                        targets: 11,
                        className: "colUOMNoOfBoxes",
                        width: "100px",
                    }, {
                        targets: 12,
                        className: "colUOMHeight",
                        width: "100px",
                    }, {
                        targets: 13,
                        className: "colUOMWidth",
                        width: "100px",
                    }, {
                        targets: 14,
                        className: "colUOMLength",
                        width: "100px",
                    }, {
                        targets: 15,
                        className: "colUOMVolume",
                        width: "100px",
                    }, {
                        targets: 16,
                        className: "colStatus",
                        width: "100px",
                    }, {
                        targets: 17,
                        className: "colQtyinSales hiddenColumn",
                        width: "150px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Units of Measure Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Units of Measure Settings',
                        filename: "Units of Measure Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Units of Measure Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();
                        let linestatus = '';
                        let tdCustomerDef = ''; //isSalesdefault
                        let tdSupplierDef = ''; //isPurchasedefault
                        let tdUseforAutoSplitQtyinSales = ''; //UseforAutoSplitQtyinSales
                        sideBarService.getUOMDataList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.tunitofmeasurelist.length; j++) {

                                if (dataObjectnew.tunitofmeasurelist[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.tunitofmeasurelist[j].Active == false) {
                                    linestatus = "In-Active";
                                }

                                //Check if Sales defaultis checked
                                if (dataObjectnew.tunitofmeasurelist[j].SalesDefault == true) {
                                    tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtSalesDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '" checked><label class="custom-control-label chkBox" for="swtSalesDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '"></label></div>';
                                } else {
                                    tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtSalesDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '"><label class="custom-control-label chkBox" for="swtSalesDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '"></label></div>';
                                }
                                //Check if Purchase default is checked
                                if (dataObjectnew.tunitofmeasurelist[j].PurchasesDefault == true) {
                                    tdPurchaseDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '" checked><label class="custom-control-label chkBox" for="swtPurchaseDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '"></label></div>';
                                } else {
                                    tdPurchaseDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '"><label class="custom-control-label chkBox" for="swtPurchaseDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '"></label></div>';
                                }

                                //Check if UseforAutoSplitQtyinSales is checked
                                if (dataObjectnew.tunitofmeasurelist[j].UseforAutoSplitQtyinSales == true) {
                                    tdUseforAutoSplitQtyinSales = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '" checked><label class="custom-control-label chkBox" for="swtPurchaseDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '"></label></div>';
                                } else {
                                    tdUseforAutoSplitQtyinSales = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '"><label class="custom-control-label chkBox" for="swtPurchaseDefault-' + dataObjectnew.tunitofmeasurelist[j].ID + '"></label></div>';
                                }

                                var dataListDupp = [
                                    dataObjectnew.tunitofmeasurelist[j].ID || '',
                                    dataObjectnew.tunitofmeasurelist[j].UnitName || '',
                                    dataObjectnew.tunitofmeasurelist[j].UnitDescription || '',
                                    dataObjectnew.tunitofmeasurelist[j].UnitProductKeyName || '',
                                    dataObjectnew.tunitofmeasurelist[j].BaseUnitName || '',
                                    dataObjectnew.tunitofmeasurelist[j].BaseUnitID || '',
                                    dataObjectnew.tunitofmeasurelist[j].PartID || '',
                                    dataObjectnew.tunitofmeasurelist[j].Multiplier || 0,
                                    tdSupplierDef,
                                    tdPurchaseDef,
                                    dataObjectnew.tunitofmeasurelist[j].Weight || 0,
                                    dataObjectnew.tunitofmeasurelist[j].NoOfBoxes || 0,
                                    dataObjectnew.tunitofmeasurelist[j].Height || 0,
                                    dataObjectnew.tunitofmeasurelist[j].Width || 0,
                                    dataObjectnew.tunitofmeasurelist[j].Length || 0,
                                    dataObjectnew.tunitofmeasurelist[j].Volume || 0,
                                    linestatus,
                                    tdUseforAutoSplitQtyinSales
                                ];

                                splashArrayUOMList.push(dataListDupp);
                            }

                            let uniqueChars = [...new Set(splashArrayUOMList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newUomModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getBOMListData = async function() {
        var customerpage = 0;
        getVS1Data('TProcTree').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getAllBOMProducts(initialBaseDataLoad, 0).then(async function (data) {
                    await addVS1Data('TProcTree', JSON.stringify(data));
                    templateObject.displayBOMListData(data.tproctree); //Call this function to display data on the table
                }).catch(function (err) {
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayBOMListData(data.tproctree); //Call this function to display data on the table
            }
        }).catch(function (err) {
          productService.getAllBOMProducts(initialBaseDataLoad, 0).then(async function (data) {
              await addVS1Data('TProcTree', JSON.stringify(data));
              templateObject.displayBOMListData(data.tproctree); //Call this function to display data on the table
          }).catch(function (err) {
          });
        });
        // let bomProducts = [];
        // let tempArray = localStorage.getItem('TProcTree');
        // bomProducts = tempArray ? JSON.parse(tempArray) : [];
        // templateObject.displayBOMListData(bomProducts)

    }
    templateObject.displayBOMListData = async function(bomProducts) {
        var splashArrayBOMList = new Array();
        let lineItems = [];
        let lineItemObj = {};


        for (let i = 0; i < bomProducts.length; i++) {
            // for (let i = 0; i < data.tproctree.length; i++) {
            //sideBarService.changeDialFormat(data.temployeelist[i].Mobile, data.temployeelist[i].Country);
            let subs = bomProducts[i].fields.Details != '' ?JSON.parse(bomProducts[i].fields.Details)||[] : [];
            let rawName = "";
            if(subs.length > 0) {
                for (let j = 0; j < subs.length; j++) {
                    if (j == 0) { rawName += subs[j].productName } else { rawName += ", " + subs[j].productName }
                }
            }

            var dataList = [
                bomProducts[i].fields.ID || "1",
                bomProducts[i].fields.Caption || "", //product name -- should be changed on TProcTree
                bomProducts[i].fields.Description || "",
                bomProducts[i].fields.Info || "",
                bomProducts[i].fields.TotalQtyOriginal || 0,
                // bomProducts[i].fields.subs || [],
                rawName || '',
                bomProducts[i].fields.Value == '' ? 'No Attachment' : JSON.parse(bomProducts[i].fields.Value).length.toString() + " attachments"
            ];

            splashArrayBOMList.push(dataList);

            templateObject.transactiondatatablerecords.set(splashArrayBOMList);

        }


        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }

        // if (templateObject.transactiondatatablerecords.get()) {
        //     setTimeout(function () {
        //         MakeNegative();
        //     }, 100);
        // }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayBOMList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colBOMID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colProductName",
                        // width: "150px",
                    },
                    {
                        targets: 2,
                        className: "colProcess",
                        // width: "100px",
                    },
                    {
                        targets: 3,
                        className: "colRaws",
                        // width: "50px",
                    },
                    {
                        targets: 4,
                        className: "colAttachments",
                        // width: "80px",
                    }


                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "BOM product structures",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'BOM Product Structure',
                        filename: "BOM Product Structure",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "BOM Product Structure",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {


                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    // if(deleteFilter){
                    //   $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#'+currenttablename+'_filter');
                    // }else{
                    //   $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#'+currenttablename+'_filter');
                    // }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    //let countTableData = data.Params.Count || 0; //get count from API data

                    //return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    //Currency List Data
    templateObject.getCurrencyListData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        var customerpage = 0;
        getVS1Data('TCurrencyList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getCurrencyDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TCurrencyList', JSON.stringify(data));
                    templateObject.displayCurrencyListData(data); //Call this function to display data on the table
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayCurrencyListData(data); //Call this function to display data on the table
            }
        }).catch(function(err) {
            sideBarService.getCurrencyDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TCurrencyList', JSON.stringify(data));
                templateObject.displayCurrencyListData(data); //Call this function to display data on the table
            }).catch(function(err) {

            });
        });
    }



    templateObject.displayCurrencyListData = async function(data) {
        var splashArrayCurrencyList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.tcurrencylist.length; i++) {
            let linestatus = '';
            if (data.tcurrencylist[i].Active == true) {
                linestatus = "";
            } else if (data.tcurrencylist[i].Active == false) {
                linestatus = "In-Active";
            }

            var dataList = [
                data.tcurrencylist[i].CurrencyID || "",
                data.tcurrencylist[i].Code || "",
                data.tcurrencylist[i].Currency || "",
                data.tcurrencylist[i].CurrencySymbol || "",
                data.tcurrencylist[i].BuyRate || 0.00,
                data.tcurrencylist[i].SellRate || 0.00,
                data.tcurrencylist[i].Country || "",
                data.tcurrencylist[i].RateLastModified || "",
                data.tcurrencylist[i].CurrencyDesc || "",
                linestatus,
                data.tcurrencylist[i].FixedRate || 0.00,
                data.tcurrencylist[i].UpperVariation || 0.00,
                data.tcurrencylist[i].LowerVariation || 0.00,
                data.tcurrencylist[i].TriggerPriceVariation || 0.00,
                data.tcurrencylist[i].CountryID || ""
            ];

            splashArrayCurrencyList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayCurrencyList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        //$('.fullScreenSpin').css('display','none');
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayCurrencyList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colCurrencyID colID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colCode",
                        width: "100px",
                    },
                    {
                        targets: 2,
                        className: "colCurrency",
                        width: "100px",
                    },
                    {
                        targets: 3,
                        className: "colCurrencySymbol",
                        width: "100px",
                    },
                    {
                        targets: 4,
                        className: "colBuyRate text-right",
                        width: "100px",
                    },
                    {
                        targets: 5,
                        className: "colSellRate text-right",
                        width: "100px",
                    },
                    {
                        targets: 6,
                        className: "colCountry",
                        width: "200px",
                    },
                    {
                        targets: 7,
                        className: "colRateLastModified hiddenColumn",
                        width: "200px",
                    },
                    {
                        targets: 8,
                        className: "colDescription",
                    },
                    {
                        targets: 9,
                        className: "colStatus",
                        width: "100px",
                    },
                    {
                        targets: 10,
                        className: "colFixedRate hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 11,
                        className: "colUpperVariation hiddenColumn",
                        width: "150px",
                    },
                    {
                        targets: 12,
                        className: "colLowerVariation hiddenColumn",
                        width: "150px",
                    },
                    {
                        targets: 13,
                        className: "colTriggerPriceVariation hiddenColumn",
                        width: "250px",
                    },
                    {
                        targets: 14,
                        className: "colCountryID hiddenColumn",
                        width: "100px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Currency Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Currency Settings',
                        filename: "Currency Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Currency Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getCurrencyDataList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {
                            for (let j = 0; j < dataObjectnew.tcurrencylist.length; j++) {
                                let linestatus = '';
                                if (dataObjectnew.tcurrencylist[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.tcurrencylist[j].Active == false) {
                                    linestatus = "In-Active";
                                }

                                var dataListDupp = [
                                    dataObjectnew.tcurrencylist[j].Code || "",
                                    dataObjectnew.tcurrencylist[j].Currency || "",
                                    dataObjectnew.tcurrencylist[j].CurrencySymbol || "",
                                    dataObjectnew.tcurrencylist[j].BuyRate || 0.00,
                                    dataObjectnew.tcurrencylist[j].SellRate || 0.00,
                                    dataObjectnew.tcurrencylist[j].Country || "",
                                    dataObjectnew.tcurrencylist[j].RateLastModified || "",
                                    dataObjectnew.tcurrencylist[j].CurrencyDesc || "",
                                    linestatus,
                                    data.tcurrencylist[j].FixedRate || 0.00,
                                    data.tcurrencylist[j].UpperVariation || 0.00,
                                    data.tcurrencylist[j].LowerVariation || 0.00,
                                    data.tcurrencylist[j].TriggerPriceVariation || 0.00,
                                    data.tcurrencylist[j].CountryID || ""
                                ];

                                splashArrayCurrencyList.push(dataListDupp);
                            }
                            let uniqueChars = [...new Set(splashArrayCurrencyList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newCurrencyModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (data.Params.Search.replace(/\s/g, "") == "") {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getTitleListData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        let data = {}
        templateObject.displayTitleListData(data); //Call this function to display data on the table
    }

    templateObject.displayTitleListData = async function(data) {
        var splashArrayTitleList = [
            [1, "Mr", '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="s-active-1"><label class="custom-control-label chkBox" for="s-active-1"></label></div>', ],
            [2, "Mrs", '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="s-active-1"><label class="custom-control-label chkBox" for="s-active-1"></label></div>'],
            [3, "MIss", '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="s-active-1"><label class="custom-control-label chkBox" for="s-active-1"></label></div>'],
            [4, "Ms", '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="s-active-1"><label class="custom-control-label chkBox" for="s-active-1"></label></div>'],
        ];
        let deleteFilter = false;
        templateObject.transactiondatatablerecords.set(splashArrayTitleList)
            if(templateObject.transactiondatatablerecords.get()) {
              setTimeout(function () {
                  MakeNegative();
              }, 100);
            }
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayTitleList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colTypeName",
                        width: "200px",
                    },
                    {
                        targets: 2,
                        className: "chkBox pointer",
                        width: "20px",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    // let countTableData = data.Params.Count || 0; //get count from API data
                    //
                    // return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }


    templateObject.getRateListData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        let data = {}
        templateObject.displayRateListData(data); //Call this function to display data on the table
    }

    templateObject.displayRateListData = async function(data) {
        var splashArrayRateList = [
            [1, "Normal"],
            [2, "Time & Half"],
            [3, "Double Time"],
            [4, "Weekend"],
        ];
        let deleteFilter = false;
        templateObject.transactiondatatablerecords.set(splashArrayRateList)
            if(templateObject.transactiondatatablerecords.get()) {
              setTimeout(function () {
                  MakeNegative();
              }, 100);
            }
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayRateList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colRateName",
                        width: "300px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    // let countTableData = data.Params.Count || 0; //get count from API data
                    //
                    // return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

        $('div.dataTables_filter input').addClass('form-control form-control-sm');
    }

    templateObject.getRateTypeListData = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        let refresh = false;
        let data = await CachedHttp.get(erpObject.TPayRateType, async () => {
            return await sideBarService.getRateTypes(initialBaseDataLoad, 0);
        }, {
            forceOverride: refresh,
            fallBackToLocal: true,
        });
        const response = data.response;
    
        data =  response.tpayratetype ? response.tpayratetype.map(e => e.fields) : null;
        templateObject.displayRateTypeListData(data); //Call this function to display data on the table
    }

    templateObject.displayRateTypeListData = async function(data) {
        var splashArrayRateList = new Array();
        for (let i = 0; i < data.length; i++) {
            var dataList = [
                data[i].id || "",
                data[i].Description || "",
            ];
            splashArrayRateList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayRateList);
        }
        let deleteFilter = false;
            if(templateObject.transactiondatatablerecords.get()) {
              setTimeout(function () {
                  MakeNegative();
              }, 100);
            }
        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayRateList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colRateTypeID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colRateName",
                        width: "300px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    // let countTableData = data.Params.Count || 0; //get count from API data
                    //
                    // return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

        $('div.dataTables_filter input').addClass('form-control form-control-sm');
    }

    templateObject.getOverTimeSheets = async function(deleteFilter = false) { //GET Data here from Web API or IndexDB
        let overtimesData = await getVS1Data(erpObject.TPayrollSettingOvertimes);
        let overtimes = overtimesData.length > 0 ? JSON.parse(overtimesData[0].data) : [];
        // This part is handling the auto add of default values in the list
        let defaultOvertimes = PayrollSettingsOvertimes.getDefaults();
        defaultOvertimes.forEach((defaultOvertime) => {
            // if doesnt exist, just add it
            if(!overtimes.some(overtime => overtime.rule == defaultOvertime.rule)) {
                if(defaultOvertime.searchByRuleName == true) {
                }
                overtimes.push(defaultOvertime);
            };
        })
        templateObject.displayOverTimeSheetListData(overtimes); //Call this function to display data on the table
    }

    templateObject.displayOverTimeSheetListData = async function(data) {
        var splashArrayOverTimeSheetList = new Array();
        for (let i = 0; i < data.length; i++) {
            var dataList = [
                data[i].id || "",
                data[i].rate || "",
                data[i].rule || "",
                data[i].hourlyMultiplier || "",
            ];
            splashArrayOverTimeSheetList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayOverTimeSheetList);
        }
        let deleteFilter = false;
        if(templateObject.transactiondatatablerecords.get()) {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        }
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayOverTimeSheetList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colOverTimeSheetID hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colRate",
                        width: "300px",
                    },
                    {
                        targets: 2,
                        className: "colRateRule",
                        width: "500px",
                    },
                    {
                        targets: 3,
                        className: "colHourlyAmount",
                        width: "150px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    // let countTableData = data.Params.Count || 0; //get count from API data
                    //
                    // return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

        $('div.dataTables_filter input').addClass('form-control form-control-sm');
    }


    templateObject.getProcessListData = async function() {
        getVS1Data('TProcessStep').then(function(dataObject) {
            if (dataObject.length == 0) {
                manufacturingService.getAllProcessData(initialBaseDataLoad, 0).then(async function(data) {
                    await addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn) {
                        templateObject.displayProcessListData(data)
                    })
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayProcessListData(data)
            }
        }).catch(function(e) {
            manufacturingService.getAllProcessData(initialBaseDataLoad, 0).then(async function(data) {
                await addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn) {
                    templateObject.displayProcessListData(data)
                })
            })
        })
    }


    templateObject.displayProcessListData = async function(data) {
        var splashArrayProcessList = new Array();
        for (let i = 0; i < data.tprocessstep.length; i++) {
            var dataList = [
                data.tprocessstep[i].fields.ID || "",
                data.tprocessstep[i].fields.KeyValue || "",
                data.tprocessstep[i].fields.Description || "",
                data.tprocessstep[i].fields.DailyHours || "",
                Currency + data.tprocessstep[i].fields.HourlyLabourCost || 0,
                data.tprocessstep[i].fields.COGS || "",
                data.tprocessstep[i].fields.ExpenseAccount || "",
                Currency + data.tprocessstep[i].fields.OHourlyCost || 0,
                data.tprocessstep[i].fields.OCOGS || "",
                data.tprocessstep[i].fields.OExpense || "",
                Currency + data.tprocessstep[i].fields.TotalHourlyCost || 0,
                data.tprocessstep[i].fields.Wastage || "",
            ]
            splashArrayProcessList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayProcessList)
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }

        setTimeout(function() {
            //$('#'+currenttablename).removeClass('hiddenColumn');
            $('#' + currenttablename).DataTable({
                data: splashArrayProcessList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colProcessId hiddenColumn",
                        width: "10px"
                    },
                    {
                        targets: 1,
                        className: "colName",
                        width: "100px",
                    },
                    {
                        targets: 2,
                        className: "colDescription",
                        width: "200px",
                    },
                    {
                        targets: 3,
                        className: "colDailyHours",
                        width: "100px",
                    },
                    {
                        targets: 4,
                        className: "colHourlyLabourCost",
                        width: "100px",
                    },
                    {
                        targets: 5,
                        className: "colCOGS",
                        width: "200px",
                    },
                    {
                        targets: 6,
                        className: "colExpense",
                        width: "200px",
                    },
                    {
                        targets: 7,
                        className: "colHourlyOverheadCost",
                        width: "100px",
                    },
                    {
                        targets: 8,
                        className: "colOverCOGS",
                        width: "200px",
                    },
                    {
                        targets: 9,
                        className: "colOverExpense",
                        width: "200px",
                    },
                    {
                        targets: 10,
                        className: "colTotalHourlyCosts",
                        width: "100px",
                    },
                    {
                        targets: 11,
                        className: "colWastage",
                        width: "200px",
                    }
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Process List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Process List',
                        filename: "Process List",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Process List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                // "autoWidth": false,
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        manufacturingService.getAllProcessData(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.tprocessstep.length; j++) {
                                var dataListProcessDupp = [
                                    dataObjectnew.tprocessstep[i].fields.ID || "",
                                    dataObjectnew.tprocessstep[i].fields.KeyValue || "",
                                    dataObjectnew.tprocessstep[i].fields.Description || "",
                                    dataObjectnew.tprocessstep[i].fields.DailyHours || "",
                                    Currency + dataObjectnew.tprocessstep[i].fields.HourlyLabourCost || 0,
                                    dataObjectnew.tprocessstep[i].fields.COGS || "",
                                    dataObjectnew.tprocessstep[i].fields.ExpenseAccount || "",
                                    Currency + dataObjectnew.tprocessstep[i].fields.OHourlyCost || 0,
                                    dataObjectnew.tprocessstep[i].fields.OCOGS || "",
                                    dataObjectnew.tprocessstep[i].fields.OExpense || "",
                                    Currency + dataObjectnew.tprocessstep[i].fields.TotalHourlyCost || 0,
                                    dataObjectnew.tprocessstep[i].fields.Wastage || "",
                                ];

                                splashArrayProcessList.push(dataListProcessDupp);
                                //}
                            }
                            let uniqueChars = [...new Set(splashArrayProcessList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {

                    $("<button class='btn btn-primary btnRefreshProcessList' type='button' id='btnRefreshProcessList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.tprocessstep.length || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);


    }

    templateObject.getSupplierTransactionListData = function() {
        let supplierName = $('#edtSupplierCompany').val();
        getVS1Data('TbillReport').then(function(dataObject) {
            if (dataObject.length === 0) {
                contactService.getAllTransListBySupplier(supplierName).then(function(data) {
                    templateObject.displaySupplierTransactionListData(data, supplierName);
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displaySupplierTransactionListData(data, supplierName);
            }
        }).catch(function(err) {
            contactService.getAllTransListBySupplier(supplierName).then(function(data) {
                templateObject.displaySupplierTransactionListData(data, supplierName);
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        });

    };
    templateObject.displaySupplierTransactionListData = function(data, supplierName) {
        let dataTableListJob = [];
        for (let i = 0; i < data.tbillreport.length; i++) {
            let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Amount (Ex)']) || 0.00;
            let totalTax = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Tax']) || 0.00;
            let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Amount (Inc)']) || 0.00;
            let amountPaidCalc = data.tbillreport[i]['Total Amount (Inc)'] - data.tbillreport[i].Balance;
            let totalPaid = utilityService.modifynegativeCurrencyFormat(amountPaidCalc) || 0.00;
            let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
            const dataList = {
                id: data.tbillreport[i].PurchaseOrderID || '',
                employee: data.tbillreport[i].Contact || '',
                sortdate: data.tbillreport[i].OrderDate !== '' ? moment(data.tbillreport[i].OrderDate).format("YYYY/MM/DD") : data.tbillreport[i].OrderDate,
                orderdate: data.tbillreport[i].OrderDate !== '' ? moment(data.tbillreport[i].OrderDate).format("DD/MM/YYYY") : data.tbillreport[i].OrderDate,
                suppliername: data.tbillreport[i].Company || '',
                totalamountex: totalAmountEx || 0.00,
                totaltax: totalTax || 0.00,
                totalamount: totalAmount || 0.00,
                totalpaid: totalPaid || 0.00,
                totaloustanding: totalOutstanding || 0.00,
                orderstatus: '',
                type: data.tbillreport[i].Type || '',
                custfield1: data.tbillreport[i].Phone || '',
                custfield2: data.tbillreport[i].InvoiceNumber || '',
                comments: data.tbillreport[i].Comments || '',
            };
            if (data.tbillreport[i].Company === supplierName) {
                dataTableListJob.push(dataList);
            }
        }
        var splashArrayClientTypeList = new Array();
        let deleteFilter = false;
        for (let i = 0; i < dataTableListJob.length; i++) {
            var dataList = [
                dataTableListJob[i].id,
                dataTableListJob[i].orderdate,
                dataTableListJob[i].id,
                dataTableListJob[i].suppliername,
                dataTableListJob[i].totalamountex,
                dataTableListJob[i].totaltax,
                dataTableListJob[i].totalamount,
                dataTableListJob[i].totalpaid,
                dataTableListJob[i].totaloustanding,
                dataTableListJob[i].type,
                dataTableListJob[i].custfield1,
                dataTableListJob[i].custfield2,
                dataTableListJob[i].employee,
                dataTableListJob[i].comments,
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        // splashArrayClientTypeList =[[1,'company1','company1','company1','company1','company1','company1','company1','company1','company1','company1','company1','company1','company1',]]
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colSortDate hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colOrderDate",
                        width: "",
                    },
                    {
                        targets: 2,
                        className: "colPurchaseNo",
                        width: "",
                    },
                    {
                        targets: 3,
                        className: "colSupplier",
                        width: "",
                    },
                    {
                        targets: 4,
                        className: "colAmountEx",
                        width: "",
                    },
                    {
                        targets: 5,
                        className: "colTax",
                        width: "",
                    },
                    {
                        targets: 6,
                        className: "colAmount",
                        width: "",
                    },
                    {
                        targets: 7,
                        className: "colPaid",
                        width: "",
                    },
                    {
                        targets: 8,
                        className: "colBalanceOutstanding",
                        width: "",
                    },
                    {
                        targets: 9,
                        className: "colStatus",
                        width: "",
                    },
                    {
                        targets: 10,
                        className: "colPurchaseCustField1 hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 11,
                        className: "colPurchaseCustField2 hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 12,
                        className: "colEmployee hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 13,
                        className: "colComments",
                        width: "",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getCustomerTransactionListData = function() {
        let customerName = $('#edtCustomerCompany').val() || $('#edtJobCustomerCompany').val() || '';
        getVS1Data('TJobVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllJobListByCustomer(customerName).then(function(data) {
                    templateObject.displayCustomerTransactionListData(data, customerName);
                    addVS1Data('TJobVS1',JSON.stringify(data));
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayCustomerTransactionListData(data, customerName);
            }
        }).catch(function(err) {
            contactService.getAllJobListByCustomer(customerName).then(function(data) {
                templateObject.displayCustomerTransactionListData(data, customerName);
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        });
    }

    templateObject.displayCustomerTransactionListData = function(data, customerName) {
        let dataTableListJob = [];
        for (let i = 0; i < data.tjobvs1.length; i++) {
            let arBalance = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.ARBalance) || 0.00;
            let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.CreditBalance) || 0.00;
            let balance = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.Balance) || 0.00;
            let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.CreditLimit) || 0.00;
            let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.SalesOrderBalance) || 0.00;
            const dataListJob = {
                id: data.tjobvs1[i].fields.Id || '',
                company: data.tjobvs1[i].fields.ClientName || '',
                contactname: data.tjobvs1[i].fields.ContactName || '',
                phone: data.tjobvs1[i].fields.Phone || '',
                arbalance: arBalance || 0.00,
                creditbalance: creditBalance || 0.00,
                balance: balance || 0.00,
                creditlimit: creditLimit || 0.00,
                salesorderbalance: salesOrderBalance || 0.00,
                email: data.tjobvs1[i].fields.Email || '',
                accountno: data.tjobvs1[i].fields.AccountNo || '',
                clientno: data.tjobvs1[i].fields.ClientNo || '',
                jobtitle: data.tjobvs1[i].fields.JobTitle || '',
                notes: data.tjobvs1[i].fields.Notes || '',
                country: data.tjobvs1[i].fields.Country || LoggedCountry
            };
            if (customerName == data.tjobvs1[i].fields.ParentCustomerName) {
                dataTableListJob.push(dataListJob);
            }
        }
        var splashArrayClientTypeList = new Array();
        let deleteFilter = false;
        for (let i = 0; i < dataTableListJob.length; i++) {
            var dataList = [
                data[i].id,
                data[i].company,
                data[i].phone,
                data[i].arbalance,
                data[i].creditbalance,
                data[i].balance,
                data[i].creditlimit,
                data[i].salesorderbalance,
                data[i].country,
                data[i].email,
                data[i].accountno,
                data[i].clientno,
                data[i].jobtitle,
                data[i].notes,
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        // splashArrayClientTypeList =[[1,'company1','company1','company1','company1','company1','company1','company1','company1','company1','company1','company1','company1','company1',]]
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colTaskId hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colCompany",
                        width: "100px",
                    },
                    {
                        targets: 2,
                        className: "colPhone",
                        width: "50px",
                    },
                    {
                        targets: 3,
                        className: "colARBalance",
                        width: "40px",
                    },
                    {
                        targets: 4,
                        className: "colCreditBalance",
                        width: "40px",
                    },
                    {
                        targets: 5,
                        className: "colBalance",
                        width: "40px",
                    },
                    {
                        targets: 6,
                        className: "colCreditLimit",
                        width: "40px",
                    },
                    {
                        targets: 7,
                        className: "colSalesOrderBalance",
                        width: "40px",
                    },
                    {
                        targets: 8,
                        className: "colCountry",
                        width: "50px",
                    },
                    {
                        targets: 9,
                        className: "colEmail hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 10,
                        className: "colAccountNo hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 11,
                        className: "colClientNo hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 12,
                        className: "colJobTitle hiddenColumn",
                        width: "50px",
                    },
                    {
                        targets: 13,
                        className: "colNotes",
                        width: "",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getCustomerJobDetailsListData = function() {
        let customerName = $('#edtCustomerCompany').val() || $('#edtJobCustomerCompany').val() || '';
        getVS1Data('TJobVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllJobListByCustomer(customerName).then(function(data) {
                    templateObject.displayCustomerJobDetailsListData(data, customerName);
                    addVS1Data('TJobVS1',JSON.stringify(data));
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayCustomerJobDetailsListData(data, customerName);
            }
        }).catch(function(err) {
            contactService.getAllJobListByCustomer(customerName).then(function(data) {
                templateObject.displayCustomerJobDetailsListData(data, customerName);
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        });
    }

    templateObject.displayCustomerJobDetailsListData = function(data, customerName) {
        let dataTableListJob = [];
        for (let i = 0; i < data.tjobvs1.length; i++) {
            let arBalance = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.ARBalance) || 0.00;
            let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.CreditBalance) || 0.00;
            let balance = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.Balance) || 0.00;
            let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.CreditLimit) || 0.00;
            let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tjobvs1[i].fields.SalesOrderBalance) || 0.00;
            const dataListJob = {
                id: data.tjobvs1[i].fields.ID || '',
                company: data.tjobvs1[i].fields.ClientName || '',
                contactname: data.tjobvs1[i].fields.ContactName || '',
                phone: data.tjobvs1[i].fields.Phone || '',
                arbalance: arBalance || 0.00,
                creditbalance: creditBalance || 0.00,
                balance: balance || 0.00,
                creditlimit: creditLimit || 0.00,
                salesorderbalance: salesOrderBalance || 0.00,
                email: data.tjobvs1[i].fields.Email || '',
                accountno: data.tjobvs1[i].fields.AccountNo || '',
                clientno: data.tjobvs1[i].fields.ClientNo || '',
                jobtitle: data.tjobvs1[i].fields.JobTitle || '',
                notes: data.tjobvs1[i].fields.Notes || '',
                country: data.tjobvs1[i].fields.Country || LoggedCountry
            };
            if (customerName == data.tjobvs1[i].fields.ParentCustomerName) {
                dataTableListJob.push(dataListJob);
            }
        }
        var splashArrayClientTypeList = new Array();
        let deleteFilter = false;
        for (let i = 0; i < dataTableListJob.length; i++) {
            var dataList = [
                data[i].id,
                data[i].company,
                data[i].phone,
                data[i].arbalance,
                data[i].creditbalance,
                data[i].balance,
                data[i].creditlimit,
                data[i].salesorderbalance,
                data[i].country,
                data[i].email,
                data[i].accountno,
                data[i].clientno,
                data[i].jobtitle,
                data[i].notes,
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        // splashArrayClientTypeList =[[1,'company1','company1','company1','company1','company1','company1','company1','company1','company1','company1','company1','company1','company1',]]
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colTaskId hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colCompany",
                        width: "100px",
                    },
                    {
                        targets: 2,
                        className: "colPhone",
                        width: "50px",
                    },
                    {
                        targets: 3,
                        className: "colARBalance",
                        width: "40px",
                    },
                    {
                        targets: 4,
                        className: "colCreditBalance",
                        width: "40px",
                    },
                    {
                        targets: 5,
                        className: "colBalance",
                        width: "40px",
                    },
                    {
                        targets: 6,
                        className: "colCreditLimit",
                        width: "40px",
                    },
                    {
                        targets: 7,
                        className: "colSalesOrderBalance",
                        width: "40px",
                    },
                    {
                        targets: 8,
                        className: "colCountry",
                        width: "50px",
                    },
                    {
                        targets: 9,
                        className: "colEmail hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 10,
                        className: "colAccountNo hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 11,
                        className: "colClientNo hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 12,
                        className: "colJobTitle hiddenColumn",
                        width: "50px",
                    },
                    {
                        targets: 13,
                        className: "colNotes",
                        width: "",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);
       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getEmployeeTransactionListData = function() {
        let employeeName = $('#edtCustomerCompany').val();
        let dataTableList = [];
        getVS1Data('TInvoiceEx').then(function(dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllInvoiceListByEmployee(employeeName).then(function(data) {
                    for (let i = 0; i < data.tinvoice.length; i++) {
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalAmount) || 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalTax) || 0.00;
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalAmountInc) || 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalPaid) || 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalBalance) || 0.00;
                        var dataList = {
                            id: data.tinvoice[i].Id || '',
                            employee: data.tinvoice[i].EmployeeName || '',
                            sortdate: data.tinvoice[i].SaleDate != '' ? moment(data.tinvoice[i].SaleDate).format("YYYY/MM/DD") : data.tinvoice[i].SaleDate,
                            saledate: data.tinvoice[i].SaleDate != '' ? moment(data.tinvoice[i].SaleDate).format("DD/MM/YYYY") : data.tinvoice[i].SaleDate,
                            customername: data.tinvoice[i].CustomerName || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            salestatus: data.tinvoice[i].SalesStatus || '',
                            custfield1: data.tinvoice[i].SaleCustField1 || '',
                            custfield2: data.tinvoice[i].SaleCustField2 || '',
                            comments: data.tinvoice[i].Comments || '',
                        };
                        dataTableList.push(dataList);
                    }
                    templateObject.displayEmployeeTransactionListData(dataTableList);
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tinvoiceex;
                for (let i = 0; i < useData.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmount) || 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalTax) || 0.00;
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmountInc) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalPaid) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalBalance) || 0.00;
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        employee: useData[i].fields.EmployeeName || '',
                        sortdate: useData[i].fields.SaleDate != '' ? moment(useData[i].fields.SaleDate).format("YYYY/MM/DD") : useData[i].fields.SaleDate,
                        saledate: useData[i].fields.SaleDate != '' ? moment(useData[i].fields.SaleDate).format("DD/MM/YYYY") : useData[i].fields.SaleDate,
                        customername: useData[i].fields.CustomerName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        salestatus: useData[i].fields.SalesStatus || '',
                        custfield1: useData[i].fields.SaleCustField1 || '',
                        custfield2: useData[i].fields.SaleCustField2 || '',
                        comments: useData[i].fields.Comments || '',
                    };
                    dataTableList.push(dataList);
                }
                templateObject.displayEmployeeTransactionListData(dataTableList);
            }
        }).catch(function(err) {
            contactService.getAllInvoiceListByEmployee(employeeName).then(function(data) {
                for (let i = 0; i < data.tinvoice.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalAmount) || 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalTax) || 0.00;
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalAmountInc) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalPaid) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalBalance) || 0.00;
                    const dataList = {
                        id: data.tinvoice[i].Id || '',
                        employee: data.tinvoice[i].EmployeeName || '',
                        sortdate: data.tinvoice[i].SaleDate != '' ? moment(data.tinvoice[i].SaleDate).format("YYYY/MM/DD") : data.tinvoice[i].SaleDate,
                        saledate: data.tinvoice[i].SaleDate != '' ? moment(data.tinvoice[i].SaleDate).format("DD/MM/YYYY") : data.tinvoice[i].SaleDate,
                        customername: data.tinvoice[i].CustomerName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        salestatus: data.tinvoice[i].SalesStatus || '',
                        custfield1: data.tinvoice[i].SaleCustField1 || '',
                        custfield2: data.tinvoice[i].SaleCustField2 || '',
                        comments: data.tinvoice[i].Comments || '',
                    };
                    dataTableList.push(dataList);
                }
                templateObject.displayEmployeeTransactionListData(dataTableList);
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        });
    }
    templateObject.displayEmployeeTransactionListData = function(data) {
        var splashArrayClientTypeList = new Array();
        let deleteFilter = false;
        for (let i = 0; i < data.length; i++) {
            var dataList = [
                data[i].id || "",
                data[i].sortdate || "",
                data[i].saledate || "",
                data[i].id || "",
                data[i].customername || "",
                data[i].totalamountex || "",
                data[i].totaltax || "",
                data[i].totalamount || "",
                data[i].totalpaid || "",
                data[i].totaloustanding || "",
                data[i].salestatus || "",
                data[i].custfield1 || "",
                data[i].custfield2 || "",
                data[i].employee || "",
                data[i].comments || "",
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colSaleDate",
                        width: "40px",
                    },
                    {
                        targets: 2,
                        className: "colSalesNo",
                        width: "40px",
                    },
                    {
                        targets: 3,
                        className: "colCustomer",
                        width: "100px",
                    },
                    {
                        targets: 4,
                        className: "colAmountEx",
                        width: "40px",
                    },
                    {
                        targets: 5,
                        className: "colTax",
                        width: "40px",
                    },
                    {
                        targets: 6,
                        className: "colAmount",
                        width: "40px",
                    },
                    {
                        targets: 7,
                        className: "colPaid",
                        width: "40px",
                    },
                    {
                        targets: 8,
                        className: "colBalanceOutstanding",
                        width: "40px",
                    },
                    {
                        targets: 9,
                        className: "colStatus hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 10,
                        className: "colSaleCustField1 hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 11,
                        className: "colSaleCustField2 hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 12,
                        className: "colEmployee hiddenColumn",
                        width: "",
                    },
                    {
                        targets: 13,
                        className: "colComments hiddenColumn",
                        width: "",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }
    templateObject.getLeadCrmListData = function() {
        let dataTableList = [];
        let customerName = $('#edtLeadEmployeeName').val();
        crmService.getAllTasksByContactName(customerName).then(async function(data) {
            if (data.tprojecttasks.length > 0) {
                for (let i = 0; i < data.tprojecttasks.length; i++) {
                    let taskLabel = data.tprojecttasks[i].fields.TaskLabel;
                    let taskLabelArray = [];
                    if (taskLabel !== null) {
                        if (taskLabel.length === undefined || taskLabel.length === 0) {
                            taskLabelArray.push(taskLabel.fields);
                        } else {
                            for (let j = 0; j < taskLabel.length; j++) {
                                taskLabelArray.push(taskLabel[j].fields);
                            }
                        }
                    }
                    let taskDescription = data.tprojecttasks[i].fields.TaskDescription || '';
                    taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";
                    const dataList = {
                        id: data.tprojecttasks[i].fields.ID || 0,
                        priority: data.tprojecttasks[i].fields.priority || 0,
                        date: data.tprojecttasks[i].fields.due_date !== '' ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : '',
                        taskName: 'Task',
                        projectID: data.tprojecttasks[i].fields.ProjectID || '',
                        projectName: data.tprojecttasks[i].fields.ProjectName || '',
                        description: taskDescription,
                        labels: taskLabelArray,
                        category: 'task',
                        completed: data.tprojecttasks[i].fields.Completed,
                        completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                    };
                    dataTableList.push(dataList);
                }
            }
            await getAppointments();
        }).catch(function(err) {
            getAppointments();
        })

        async function getAppointments() {
            crmService.getAllAppointments(customerName).then(async function(dataObj) {
                if (dataObj.tappointmentex.length > 0) {
                    dataObj.tappointmentex.map(data => {
                        let obj = {
                            id: data.fields.ID,
                            priority: 0,
                            date: data.fields.StartTime !== '' ? moment(data.fields.StartTime).format("DD/MM/YYYY") : '',
                            taskName: 'Appointment',
                            projectID: data.fields.ProjectID || '',
                            projectName: '',
                            description: '',
                            labels: '',
                            category: 'appointment',
                            completed: data.fields.Actual_EndTime ? true : false,
                            completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                        }
                        dataTableList.push(obj);
                    })
                }
                await getEmails();
            }).catch(function(error) {
                getEmails();
            })
        }
        async function getEmails() {
            sideBarService.getCorrespondences().then(dataReturn => {
                    let totalCorrespondences = dataReturn.tcorrespondence;
                    totalCorrespondences = totalCorrespondences.filter(item => {
                        return item.fields.MessageTo == $('#edtLeadEmail').val()
                    })
                    if (totalCorrespondences.length > 0 && $('#edtLeadEmail').val() != '') {
                        totalCorrespondences.map(item => {
                            let labels = [];
                            labels.push(item.fields.Ref_Type)
                            let obj = {
                                id: item.fields.MessageId ? parseInt(item.fields.MessageId) : 999999,
                                priority: 0,
                                date: item.fields.Ref_Date !== '' ? moment(item.fields.Ref_Date).format('DD/MM/YYYY') : '',
                                taskName: 'Email',
                                projectID: '',
                                projectName: '',
                                description: '',
                                labels: '',
                                category: 'email',
                                completed: false,
                                completedby: "",
                            }
                            dataTableList.push(obj)
                        })
                    }
                    try {
                        dataTableList.sort((a, b) => {
                            new Date(a.date) - new Date(b.date)
                        })
                    } catch (error) {}
                    templateObject.displayLeadCrmListData(dataTableList)
                })
                .catch((err) => {
                    $('.fullScreenSpin').css('display', 'none');
                })
        }
    }

    templateObject.displayLeadCrmListData = function(data) {
        var splashArrayClientTypeList = new Array();
        let deleteFilter = false;
        for (let i = 0; i < data.length; i++) {
            var dataList = [
                data[i].id || "",
                data[i].date || "",
                data[i].taskName || "",
                data[i].description || "",
                data[i].completedby || "",
                data[i].completed ? "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit' checked='checked'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>" :
                "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>"
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colDate",
                        width: "100px",
                    },
                    {
                        targets: 2,
                        className: "colTaskName",
                        width: "150px",
                    },
                    {
                        targets: 3,
                        className: "colTaskDesc",
                        width: "250px",
                    },
                    {
                        targets: 4,
                        className: "colCompletedBy",
                        width: "100px",
                    },
                    {
                        targets: 5,
                        className: "colCompleteTask",
                        width: "100px",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getLeadCrmListDataWithDate = function(deleteFilter = false, datefrom="", dateto="") {
        let dataTableList = [];
        let customerName = $('#edtLeadEmployeeName').val();

        let fromDate = datefrom == "" ? moment().subtract(2, 'month').format('DD/MM/YYYY') : datefrom;
        let toDate = dateto == "" ? moment().format("DD/MM/YYYY") : dateto;

        fromDate = new Date(fromDate.split("/")[2]+"-"+fromDate.split("/")[1]+"-"+fromDate.split("/")[0]+" 00:00:01");
        toDate = new Date(toDate.split("/")[2]+"-"+toDate.split("/")[1]+"-"+toDate.split("/")[0]+" 23:59:59");

        getVS1Data("TCRMTaskList").then(async function(dataObject) {
            if (dataObject.length == 0) {
                crmService.getAllTasksByContactName(customerName).then(async function(data) {
                    if (data.tprojecttasks.length > 0) {
                        addVS1Data("TCRMTaskList", JSON.stringify(data));
                        for (let i = 0; i < data.tprojecttasks.length; i++) {
                            let sort_date = data.tprojecttasks[i].fields.MsTimeStamp == "" ? "1770-01-01" : data.tprojecttasks[i].fields.MsTimeStamp;
                            sort_date = new Date(sort_date);
                            if (sort_date >= fromDate && sort_date <= toDate ) {
                                let taskLabel = data.tprojecttasks[i].fields.TaskLabel;
                                let taskLabelArray = [];
                                if (taskLabel !== null) {
                                    if (taskLabel.length === undefined || taskLabel.length === 0) {
                                        taskLabelArray.push(taskLabel.fields);
                                    } else {
                                        for (let j = 0; j < taskLabel.length; j++) {
                                            taskLabelArray.push(taskLabel[j].fields);
                                        }
                                    }
                                }
                                let taskDescription = data.tprojecttasks[i].fields.TaskDescription || '';
                                taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

                                if (deleteFilter == false) {
                                    if (!data.tprojecttasks[i].fields.Completed) {
                                        const dataList = {
                                            id: data.tprojecttasks[i].fields.ID || 0,
                                            priority: data.tprojecttasks[i].fields.priority || 0,
                                            date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                            taskName: data.tprojecttasks[i].fields.TaskName || '',
                                            projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                            projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                            description: taskDescription,
                                            labels: taskLabelArray,
                                            category: 'Task',
                                            completed: data.tprojecttasks[i].fields.Completed,
                                            completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                        };
                                        dataTableList.push(dataList);
                                    }
                                } else {
                                    const dataList = {
                                        id: data.tprojecttasks[i].fields.ID || 0,
                                        priority: data.tprojecttasks[i].fields.priority || 0,
                                        date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                        taskName: data.tprojecttasks[i].fields.TaskName || '',
                                        projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                        projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                        description: taskDescription,
                                        labels: taskLabelArray,
                                        category: 'Task',
                                        completed: data.tprojecttasks[i].fields.Completed,
                                        completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                    };
                                    dataTableList.push(dataList);
                                }
                            }
                        }
                    }
                    await getAppointments(deleteFilter);
                }).catch(function(err) {
                    getAppointments(deleteFilter);
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let all_records = data.tprojecttasks;
                
                for (let i = 0; i < all_records.length; i++) {
                    let sort_date = all_records[i].fields.MsTimeStamp == "" ? "1770-01-01" : all_records[i].fields.MsTimeStamp;
                    sort_date = new Date(sort_date);
                    if (all_records[i].fields.ContactName == customerName && due_date >= fromDate && due_date <= toDate ) {
                        let taskLabel = all_records[i].fields.TaskLabel;
                        let taskLabelArray = [];
                        if (taskLabel !== null) {
                            if (taskLabel.length === undefined || taskLabel.length === 0) {
                                taskLabelArray.push(taskLabel.fields);
                            } else {
                                for (let j = 0; j < taskLabel.length; j++) {
                                    taskLabelArray.push(taskLabel[j].fields);
                                }
                            }
                        }
                        let taskDescription = all_records[i].fields.TaskDescription || '';
                        taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

                        if (deleteFilter == false) {
                            if (!all_records[i].fields.Completed) {
                                const dataList = {
                                    id: all_records[i].fields.ID || 0,
                                    priority: all_records[i].fields.priority || 0,
                                    date: all_records[i].fields.MsTimeStamp !== '' ? moment(all_records[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                    taskName: all_records[i].fields.TaskName || '',
                                    projectID: all_records[i].fields.ProjectID || '',
                                    projectName: all_records[i].fields.ProjectName || '',
                                    description: taskDescription,
                                    labels: taskLabelArray,
                                    category: 'Task',
                                    completed: all_records[i].fields.Completed,
                                    completedby: all_records[i].fields.due_date ? moment(all_records[i].fields.due_date).format("DD/MM/YYYY") : "",
                                };
                                dataTableList.push(dataList);
                            }
                        } else {
                            const dataList = {
                                id: all_records[i].fields.ID || 0,
                                priority: all_records[i].fields.priority || 0,
                                date: all_records[i].fields.MsTimeStamp !== '' ? moment(all_records[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                taskName: all_records[i].fields.TaskName || '',
                                projectID: all_records[i].fields.ProjectID || '',
                                projectName: all_records[i].fields.ProjectName || '',
                                description: taskDescription,
                                labels: taskLabelArray,
                                category: 'Task',
                                completed: all_records[i].fields.Completed,
                                completedby: all_records[i].fields.due_date ? moment(all_records[i].fields.due_date).format("DD/MM/YYYY") : "",
                            };
                            dataTableList.push(dataList);
                        }
                    }
                }
                await getAppointments(deleteFilter);
            }
        }).catch(function(err) {
            crmService.getAllTasksByContactName(customerName).then(async function(data) {
                if (data.tprojecttasks.length > 0) {
                    addVS1Data("TCRMTaskList", JSON.stringify(data));
                    for (let i = 0; i < data.tprojecttasks.length; i++) {
                        let sort_date = data.tprojecttasks[i].fields.MsTimeStamp == "" ? "1770-01-01" : data.tprojecttasks[i].fields.MsTimeStamp;
                            sort_date = new Date(sort_date);
                        if (due_date >= fromDate && due_date <= toDate ) {
                            let taskLabel = data.tprojecttasks[i].fields.TaskLabel;
                            let taskLabelArray = [];
                            if (taskLabel !== null) {
                                if (taskLabel.length === undefined || taskLabel.length === 0) {
                                    taskLabelArray.push(taskLabel.fields);
                                } else {
                                    for (let j = 0; j < taskLabel.length; j++) {
                                        taskLabelArray.push(taskLabel[j].fields);
                                    }
                                }
                            }
                            let taskDescription = data.tprojecttasks[i].fields.TaskDescription || '';
                            taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

                            if (deleteFilter == false) {
                                if (!data.tprojecttasks[i].fields.Completed) {
                                    const dataList = {
                                        id: data.tprojecttasks[i].fields.ID || 0,
                                        priority: data.tprojecttasks[i].fields.priority || 0,
                                        date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                        taskName: data.tprojecttasks[i].fields.TaskName || '',
                                        projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                        projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                        description: taskDescription,
                                        labels: taskLabelArray,
                                        category: 'Task',
                                        completed: data.tprojecttasks[i].fields.Completed,
                                        completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                    };
                                    dataTableList.push(dataList);
                                }
                            } else {
                                const dataList = {
                                    id: data.tprojecttasks[i].fields.ID || 0,
                                    priority: data.tprojecttasks[i].fields.priority || 0,
                                    date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                    taskName: data.tprojecttasks[i].fields.TaskName || '',
                                    projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                    projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                    description: taskDescription,
                                    labels: taskLabelArray,
                                    category: 'Task',
                                    completed: data.tprojecttasks[i].fields.Completed,
                                    completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                };
                                dataTableList.push(dataList);
                            }
                        }
                    }
                }
                await getAppointments(deleteFilter);
            }).catch(function(err) {
                getAppointments(deleteFilter);
            })
        });

        async function getAppointments(deleteFilter = false) {
            getVS1Data("TAppointment").then(async function(dataObject) {
                if (dataObject.length == 0) {
                    crmService.getAllAppointments(customerName).then(async function(dataObj) {
                        if (dataObj.tappointmentex.length > 0) {
                            addVS1Data("TAppointment", JSON.stringify(dataObj));
                            dataObj.tappointmentex.map(data => {
                                let creationDate = data.fields.CreationDate == "" ? "1770-01-01" : data.fields.CreationDate;
                                creationDate = new Date(creationDate);
                                if(creationDate >= fromDate && creationDate <= toDate){
                                    if (!deleteFilter) {
                                        if (data.fields.Actual_EndTime == "") {
                                            let obj = {
                                                id: data.fields.ID,
                                                priority: 0,
                                                date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                                taskName: '',
                                                projectID: data.fields.ProjectID || '',
                                                projectName: '',
                                                description: '',
                                                labels: '',
                                                category: 'Appointment',
                                                completed: data.fields.Actual_EndTime ? true : false,
                                                completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                            }
                                            dataTableList.push(obj);
                                        }
                                    } else {
                                        let obj = {
                                            id: data.fields.ID,
                                            priority: 0,
                                            date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                            taskName: '',
                                            projectID: data.fields.ProjectID || '',
                                            projectName: '',
                                            description: '',
                                            labels: '',
                                            category: 'Appointment',
                                            completed: data.fields.Actual_EndTime ? true : false,
                                            completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                        }
                                        dataTableList.push(obj);
                                    }
                                }
                            })
                        }
                        await getEmails(deleteFilter);
                    }).catch(function(error) {
                        getEmails(deleteFilter);
                    })
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tappointmentex;
                    for (let i = 0; i < useData.length; i++) {
                        let creationDate = useData[i].fields.CreationDate == "" ? "1770-01-01" : useData[i].fields.CreationDate;
                        creationDate = new Date(creationDate);
                        if (useData[i].fields.ClientName == customerName && creationDate >= fromDate && creationDate <= toDate) {
                            if (!deleteFilter) {
                                if (useData[i].fields.Actual_EndTime == "") {
                                    let obj = {
                                        id: useData[i].fields.ID,
                                        priority: 0,
                                        date: useData[i].fields.CreationDate !== '' ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : '',
                                        taskName: '',
                                        projectID: useData[i].fields.ProjectID || '',
                                        projectName: '',
                                        description: useData[i].fields.Notes || '',
                                        labels: '',
                                        category: 'Appointment',
                                        completed: useData[i].fields.Actual_EndTime ? true : false,
                                        completedby: useData[i].fields.Actual_EndTime ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                    }
                                    dataTableList.push(obj);
                                }
                            } else {
                                let obj = {
                                    id: useData[i].fields.ID,
                                    priority: 0,
                                    date: useData[i].fields.CreationDate !== '' ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : '',
                                    taskName: '',
                                    projectID: useData[i].fields.ProjectID || '',
                                    projectName: '',
                                    description: useData[i].fields.Notes || '',
                                    labels: '',
                                    category: 'Appointment',
                                    completed: useData[i].fields.Actual_EndTime ? true : false,
                                    completedby: useData[i].fields.Actual_EndTime ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                }
                                dataTableList.push(obj);
                            }
                        }
                    }
                    if (dataTableList.length == 0) {
                        crmService.getAllAppointments(customerName).then(async function(dataObj) {
                            if (dataObj.tappointmentex.length > 0) {
                                addVS1Data("TAppointment", JSON.stringify(dataObj));
                                dataObj.tappointmentex.map(data => {
                                    let creationDate = data.fields.CreationDate == "" ? "1770-01-01" : data.fields.CreationDate;
                                    creationDate = new Date(creationDate);
                                    if(creationDate >= fromDate && creationDate <= toDate){
                                        if (!deleteFilter) {
                                            if (data.fields.Actual_EndTime == "") {
                                                let obj = {
                                                    id: data.fields.ID,
                                                    priority: 0,
                                                    date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                                    taskName: '',
                                                    projectID: data.fields.ProjectID || '',
                                                    projectName: '',
                                                    description: data.fields.Notes || '',
                                                    labels: '',
                                                    category: 'Appointment',
                                                    completed: data.fields.Actual_EndTime ? true : false,
                                                    completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                                }
                                                dataTableList.push(obj);
                                            }
                                        } else {
                                            let obj = {
                                                id: data.fields.ID,
                                                priority: 0,
                                                date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                                taskName: '',
                                                projectID: data.fields.ProjectID || '',
                                                projectName: '',
                                                description: data.fields.Notes || '',
                                                labels: '',
                                                category: 'Appointment',
                                                completed: data.fields.Actual_EndTime ? true : false,
                                                completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                            }
                                            dataTableList.push(obj);
                                        }
                                    }
                                })
                            }
                            await getEmails(deleteFilter);
                        }).catch(function(error) {
                            getEmails(deleteFilter);
                        })
                    } else {
                        await getEmails(deleteFilter);
                    }
                }
            }).catch(function(err) {
                crmService.getAllAppointments(customerName).then(async function(dataObj) {
                    if (dataObj.tappointmentex.length > 0) {
                        addVS1Data("TAppointment", JSON.stringify(dataObj));
                        dataObj.tappointmentex.map(data => {
                            let creationDate = data.fields.CreationDate == "" ? "1770-01-01" : data.fields.CreationDate;
                            creationDate = new Date(creationDate);
                            if(creationDate >= fromDate && creationDate <= toDate){
                                if (!deleteFilter) {
                                    if (data.fields.Actual_EndTime == "") {
                                        let obj = {
                                            id: data.fields.ID,
                                            priority: 0,
                                            date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                            taskName: '',
                                            projectID: data.fields.ProjectID || '',
                                            projectName: '',
                                            description: data.fields.Notes || '',
                                            labels: '',
                                            category: 'Appointment',
                                            completed: data.fields.Actual_EndTime ? true : false,
                                            completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                        }
                                        dataTableList.push(obj);
                                    }
                                } else {
                                    let obj = {
                                        id: data.fields.ID,
                                        priority: 0,
                                        date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                        taskName: '',
                                        projectID: data.fields.ProjectID || '',
                                        projectName: '',
                                        description: data.fields.Notes || '',
                                        labels: '',
                                        category: 'Appointment',
                                        completed: data.fields.Actual_EndTime ? true : false,
                                        completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                    }
                                    dataTableList.push(obj);
                                }
                            }
                        })
                    }
                    await getEmails(deleteFilter);
                }).catch(function(error) {
                    getEmails(deleteFilter);
                })
            });
        }
        async function getEmails(deleteFilter = false) {
            getVS1Data('TCorrespondence').then(data => {
                if (data.length == 0) {
                    sideBarService.getCorrespondences().then(dataReturn => {
                        let totalCorrespondences = dataReturn.tcorrespondence;
                        totalCorrespondences = totalCorrespondences.filter(item => {
                            return item.fields.MessageTo == $('#edtLeadEmail').val()
                        })
                        if (totalCorrespondences.length > 0 && $('#edtLeadEmail').val() != '') {
                            addVS1Data("TCorrespondence", JSON.stringify(data));
                            totalCorrespondences.map(item => {
                                let ref_Date = item.fields.Ref_Date == "" ? "1770-01-01" : item.fields.Ref_Date;
                                ref_Date = new Date(ref_Date);

                                if (ref_Date >= fromDate && ref_Date <= toDate ) {
                                    let labels = [];
                                    labels.push(item.fields.Ref_Type)
                                    let obj = {
                                        id: item.fields.MessageId ? parseInt(item.fields.MessageId) : 999999,
                                        priority: 0,
                                        date: item.fields.Ref_Date !== '' ? moment(item.fields.Ref_Date).format('DD/MM/YYYY') : '',
                                        taskName: '',
                                        projectID: '',
                                        projectName: '',
                                        description: '',
                                        labels: '',
                                        category: 'Email',
                                        completed: false,
                                        completedby: "",
                                    }
                                    dataTableList.push(obj)
                                }
                            })
                        }
                        try {
                            dataTableList.sort((a, b) => {
                                return new Date(b.date.split("/")[2]+"-"+b.date.split("/")[1]+"-"+b.date.split("/")[0]) - new Date(a.date.split("/")[2]+"-"+a.date.split("/")[1]+"-"+a.date.split("/")[0])
                            })
                        } catch (error) {}
                        templateObject.displayLeadCrmListDataWithDate(dataTableList, deleteFilter, moment(fromDate).format("DD/MM/YYYY"), moment(toDate).format("DD/MM/YYYY"))
                    }).catch((err) => {
                        $('.fullScreenSpin').css('display', 'none');
                    })
                } else {
                    let dataObj = JSON.parse(data[0].data);
                    if (dataObj.tcorrespondence.length > 0) {
                        for (let i = 0; i < dataObj.tcorrespondence.length; i++) {
                            let ref_Date = dataObj.tcorrespondence[i].fields.Ref_Date == "" ? "1770-01-01" : dataObj.tcorrespondence[i].fields.Ref_Date;
                            ref_Date = new Date(ref_Date);
                            if (dataObj.tcorrespondence[i].fields.MessageTo == $('#edtLeadEmail').val() && ref_Date >= fromDate && ref_Date <= toDate) {
                                let labels = [];
                                labels.push(dataObj.tcorrespondence[i].fields.Ref_Type)
                                let obj = {
                                    id: dataObj.tcorrespondence[i].fields.MessageId ? parseInt(dataObj.tcorrespondence[i].fields.MessageId) : 999999,
                                    priority: 0,
                                    date: dataObj.tcorrespondence[i].fields.Ref_Date !== '' ? moment(dataObj.tcorrespondence[i].fields.Ref_Date).format('DD/MM/YYYY') : '',
                                    taskName: '',
                                    projectID: '',
                                    projectName: '',
                                    description: '',
                                    labels: '',
                                    category: 'Email',
                                    completed: false,
                                    completedby: "",
                                }
                                dataTableList.push(obj)
                            }
                        }
                        try {
                            dataTableList.sort((a, b) => {
                                return new Date(b.date.split("/")[2]+"-"+b.date.split("/")[1]+"-"+b.date.split("/")[0]) - new Date(a.date.split("/")[2]+"-"+a.date.split("/")[1]+"-"+a.date.split("/")[0])
                            })
                        } catch (error) {}
                        templateObject.displayLeadCrmListDataWithDate(dataTableList, deleteFilter, moment(fromDate).format("DD/MM/YYYY"), moment(toDate).format("DD/MM/YYYY"))
                    }
                }
            }).catch(function(err) {
                sideBarService.getCorrespondences().then(dataReturn => {
                    let totalCorrespondences = dataReturn.tcorrespondence;
                    totalCorrespondences = totalCorrespondences.filter(item => {
                        return item.fields.MessageTo == $('#edtLeadEmail').val()
                    })
                    if (totalCorrespondences.length > 0 && $('#edtLeadEmail').val() != '') {
                        addVS1Data("TCorrespondence", JSON.stringify(dataReturn));
                        totalCorrespondences.map(item => {
                            let ref_Date = item.fields.Ref_Date == "" ? "1770-01-01" : item.fields.Ref_Date;
                            ref_Date = new Date(ref_Date);
                            if (ref_Date >= fromDate && ref_Date <= toDate ) {
                                let labels = [];
                                labels.push(item.fields.Ref_Type)
                                let obj = {
                                    id: item.fields.MessageId ? parseInt(item.fields.MessageId) : 999999,
                                    priority: 0,
                                    date: item.fields.Ref_Date !== '' ? moment(item.fields.Ref_Date).format('DD/MM/YYYY') : '',
                                    taskName: '',
                                    projectID: '',
                                    projectName: '',
                                    description: '',
                                    labels: '',
                                    category: 'Email',
                                    completed: false,
                                    completedby: "",
                                }
                                dataTableList.push(obj)
                            }
                        })
                    }
                    try {
                        dataTableList.sort((a, b) => {
                            return new Date(b.date.split("/")[2]+"-"+b.date.split("/")[1]+"-"+b.date.split("/")[0]) - new Date(a.date.split("/")[2]+"-"+a.date.split("/")[1]+"-"+a.date.split("/")[0])
                        })
                    } catch (error) {}
                    templateObject.displayLeadCrmListDataWithDate(dataTableList, deleteFilter, moment(fromDate).format("DD/MM/YYYY"), moment(toDate).format("DD/MM/YYYY"))
                }).catch((err) => {
                    $('.fullScreenSpin').css('display', 'none');
                })
            });
        }
    }

    templateObject.displayLeadCrmListDataWithDate = function(data, deleteFilter = false, fromDate="", toDate="") {
        var splashArrayClientTypeList = new Array();
        for (let i = 0; i < data.length; i++) {
            var dataList = [
                data[i].id || "",
                data[i].date || "",
                data[i].category || "",
                data[i].taskName || "",
                data[i].description || "",
                data[i].completedby || "",
                data[i].completed ? "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit' checked='checked'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>" :
                "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>"
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                sDom: "<'row'><'row'<'col-sm-12 col-lg-7'f><'col-sm-12 col-lg-5 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colDate",
                        width: "15%",
                    },
                    {
                        targets: 2,
                        className: "colType",
                        width: "15%",
                    },
                    {
                        targets: 3,
                        className: "colTaskName",
                        width: "20%",
                    },
                    {
                        targets: 4,
                        className: "colTaskDesc",
                        width: "35%",
                    },
                    {
                        targets: 5,
                        className: "colCompletedBy",
                        width: "15%",
                    },
                    {
                        targets: 6,
                        className: "colCompleteTask",
                        width: "15%",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    // [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    // $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    $(`<div class="btn-group btnNav btnAddLineGroup" style="height:35px">
                        <button type="button" class="btn btn-primary btnAddLine" id="btnAddLine" style="margin-right: 0px;"><i class='fas fa-plus'></i></button>
                        <button class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false" type="button"></button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item btnAddLineTask pointer" id="btnAddLineTask">+ Task</a>
                        </div>
                    </div>`).insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');

                    var html = `<div class="col float-right d-sm-flex d-xl-flex justify-content-sm-end align-items-sm-center justify-content-xl-end align-items-xl-end myvarFilterForm">
                        <div class="form-group" style="margin: 12px; margin-top: 0px; display: inline-flex;">
                            <label style="margin-top: 8px; margin-right: 12px;">From</label>
                            <div class="input-group date" style="width: 160px;">
                                <input type="text" class="form-control" id="dateFrom" name="dateFrom" >
                                <div class="input-group-addon">
                                    <span class="glyphicon glyphicon-th"></span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" style="margin: 12px; margin-right: 0px; margin-top: 0px; display: inline-flex;">
                            <label style="margin-top: 8px; margin-right: 12px;">To</label>
                            <div class="input-group date" style="width: 160px;">
                                <input type="text" class="form-control" id="dateTo" name="dateTo" >
                                <div class="input-group-addon">
                                    <span class="glyphicon glyphicon-th"></span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    setTimeout(function() {
                        $(".colDateFilter").html(html);
                        $("#dateFrom, #dateTo").datepicker({
                            showOn: "button",
                            buttonText: "Show Date",
                            buttonImageOnly: true,
                            buttonImage: "/img/imgCal2.png",
                            dateFormat: "dd/mm/yy",
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            changeMonth: true,
                            changeYear: true,
                            yearRange: "-90:+10",
                            onSelect: function(formated, dates) {
                                const datefrom = $("#dateFrom").val();
                                const dateto = $("#dateTo").val();
                                templateObject.getLeadCrmListDataWithDate(false, datefrom, dateto);
                            },
                            onChangeMonthYear: function(year, month, inst) {
                                // Set date to picker
                                $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
                                // Hide (close) the picker
                                // $(this).datepicker('hide');
                                // // Change ttrigger the on change function
                                // $(this).trigger('change');
                            }
                        });
                        $("#dateFrom").val(fromDate);
                        $("#dateTo").val(toDate);
                    }, 100);
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getCustomerCrmListData = function(){
        let dataTableList = [];
        let customerName = $('#edtCustomerCompany').val();
        crmService.getAllTasksByContactName(customerName).then(async function(data) {
          if (data.tprojecttasks.length > 0) {
              for (let i = 0; i < data.tprojecttasks.length; i++) {
                  let taskLabel = data.tprojecttasks[i].fields.TaskLabel;
                  let taskLabelArray = [];
                  if (taskLabel !== null) {
                      if (taskLabel.length === undefined || taskLabel.length === 0) {
                          taskLabelArray.push(taskLabel.fields);
                      } else {
                          for (let j = 0; j < taskLabel.length; j++) {
                              taskLabelArray.push(taskLabel[j].fields);
                          }
                      }
                  }
                  let taskDescription = data.tprojecttasks[i].fields.TaskDescription || '';
                  taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";
                  const dataList = {
                      id: data.tprojecttasks[i].fields.ID || 0,
                      priority: data.tprojecttasks[i].fields.priority || 0,
                      date: data.tprojecttasks[i].fields.due_date !== '' ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : '',
                      taskName: 'Task',
                      projectID: data.tprojecttasks[i].fields.ProjectID || '',
                      projectName: data.tprojecttasks[i].fields.ProjectName || '',
                      description: taskDescription,
                      labels: taskLabelArray,
                      category: 'task',
                      completed: data.tprojecttasks[i].fields.Completed,
                      completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                  };
                  dataTableList.push(dataList);
              }
          }
          await getAppointments();
      }).catch(function(err) {
          getAppointments();
      })

        async function getAppointments() {
          crmService.getAllAppointments(customerName).then(async function(dataObj) {
              if (dataObj.tappointmentex.length > 0) {
                  dataObj.tappointmentex.map(data => {
                      let obj = {
                          id: data.fields.ID,
                          priority: 0,
                          date: data.fields.StartTime !== '' ? moment(data.fields.StartTime).format("DD/MM/YYYY") : '',
                          taskName: 'Appointment',
                          projectID: data.fields.ProjectID || '',
                          projectName: '',
                          description: '',
                          labels: '',
                          category: 'appointment',
                          completed: data.fields.Actual_EndTime ? true : false,
                          completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                        }
                      dataTableList.push(obj);
                  })
              }
              await getEmails();
          }).catch(function(error) {
              getEmails();
          })
        }
        async function getEmails() {
          sideBarService.getCorrespondences().then(dataReturn => {
            let totalCorrespondences = dataReturn.tcorrespondence;
            totalCorrespondences = totalCorrespondences.filter(item => {
                return item.fields.MessageTo == $('#edtCustomerEmail').val()
            })
            if (totalCorrespondences.length > 0 && $('#edtCustomerEmail').val() != '') {
                totalCorrespondences.map(item => {
                    let labels = [];
                    labels.push(item.fields.Ref_Type)
                    let obj = {
                        id: item.fields.MessageId ? parseInt(item.fields.MessageId) : 999999,
                        priority: 0,
                        date: item.fields.Ref_Date !== '' ? moment(item.fields.Ref_Date).format('DD/MM/YYYY') : '',
                        taskName: 'Email',
                        projectID: '',
                        projectName: '',
                        description: '',
                        labels: '',
                        category: 'email',
                        completed: false,
                        completedby: "",
                    }
                    dataTableList.push(obj)
                })
            }
            try {
                dataTableList.sort((a, b) => {
                    new Date(a.date) - new Date(b.date)
                })
            } catch (error) {}
            templateObject.displayCustomerCrmListData(dataTableList)
        })
        .catch((err) => {
            $('.fullScreenSpin').css('display', 'none');
        })
        }
      }


    templateObject.displayCustomerCrmListData = function(data, deleteFilter = false) {
        var splashArrayClientTypeList = new Array();
        for (let i = 0; i < data.length; i++) {
            var dataList = [
                data[i].id || "",
                data[i].date || "",
                data[i].taskName || "",
                data[i].description || "",
                data[i].completedby || "",
                data[i].completed ? "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit' checked='checked'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>" :
                "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>"
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }
        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colDate",
                        width: "15%",
                    },
                    {
                        targets: 2,
                        className: "colTaskName",
                        width: "20%",
                    },
                    {
                        targets: 3,
                        className: "colTaskDesc",
                        width: "35%",
                    },
                    {
                        targets: 4,
                        className: "colCompletedBy",
                        width: "15%",
                    },
                    {
                        targets: 5,
                        className: "colCompleteTask",
                        width: "15%",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Completed</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Completed</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getCustomerCrmListDataWithDate = function(deleteFilter = false, datefrom="", dateto="") {
        let dataTableList = [];
        let customerName = $('#edtCustomerCompany').val();

        let fromDate = datefrom == "" ? moment().subtract(2, 'month').format('DD/MM/YYYY') : datefrom;
        let toDate = dateto == "" ? moment().format("DD/MM/YYYY") : dateto;
        
        fromDate = new Date(fromDate.split("/")[2]+"-"+fromDate.split("/")[1]+"-"+fromDate.split("/")[0]+" 00:00:01");
        toDate = new Date(toDate.split("/")[2]+"-"+toDate.split("/")[1]+"-"+toDate.split("/")[0]+" 23:59:59");
        
        getVS1Data("TCRMTaskList").then(async function(dataObject) {
            if (dataObject.length == 0) {
                crmService.getAllTasksByContactName(customerName).then(async function(data) {
                    if (data.tprojecttasks.length > 0) {
                        addVS1Data("TCRMTaskList", JSON.stringify(data));
                        for (let i = 0; i < data.tprojecttasks.length; i++) {
                            let sort_date = data.tprojecttasks[i].fields.MsTimeStamp == "" ? "1770-01-01" : data.tprojecttasks[i].fields.MsTimeStamp;
                            sort_date = new Date(sort_date);
                            if (sort_date >= fromDate && sort_date <= toDate ) {
                                let taskLabel = data.tprojecttasks[i].fields.TaskLabel;
                                let taskLabelArray = [];
                                if (taskLabel !== null) {
                                    if (taskLabel.length === undefined || taskLabel.length === 0) {
                                        taskLabelArray.push(taskLabel.fields);
                                    } else {
                                        for (let j = 0; j < taskLabel.length; j++) {
                                            taskLabelArray.push(taskLabel[j].fields);
                                        }
                                    }
                                }
                                let taskDescription = data.tprojecttasks[i].fields.TaskDescription || '';
                                taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

                                if (deleteFilter == false) {
                                    if (!data.tprojecttasks[i].fields.Completed) {
                                        const dataList = {
                                            id: data.tprojecttasks[i].fields.ID || 0,
                                            priority: data.tprojecttasks[i].fields.priority || 0,
                                            date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                            taskName: data.tprojecttasks[i].fields.TaskName || '',
                                            projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                            projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                            description: taskDescription,
                                            labels: taskLabelArray,
                                            category: 'Task',
                                            completed: data.tprojecttasks[i].fields.Completed,
                                            completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                        };
                                        dataTableList.push(dataList);
                                    }
                                } else {
                                    const dataList = {
                                        id: data.tprojecttasks[i].fields.ID || 0,
                                        priority: data.tprojecttasks[i].fields.priority || 0,
                                        date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                        taskName: data.tprojecttasks[i].fields.TaskName || '',
                                        projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                        projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                        description: taskDescription,
                                        labels: taskLabelArray,
                                        category: 'Task',
                                        completed: data.tprojecttasks[i].fields.Completed,
                                        completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                    };
                                    dataTableList.push(dataList);
                                }
                            }
                        }
                    }
                    await getAppointments(deleteFilter);
                }).catch(function(err) {
                    getAppointments(deleteFilter);
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let all_records = data.tprojecttasks;
                for (let i = 0; i < all_records.length; i++) {
                    let sort_date = all_records[i].fields.MsTimeStamp == "" ? "1770-01-01" : all_records[i].fields.MsTimeStamp;
                    sort_date = new Date(sort_date);
                    if (all_records[i].fields.ContactName == customerName && sort_date >= fromDate && sort_date <= toDate ) {
                        let taskLabel = all_records[i].fields.TaskLabel;
                        let taskLabelArray = [];
                        if (taskLabel !== null) {
                            if (taskLabel.length === undefined || taskLabel.length === 0) {
                                taskLabelArray.push(taskLabel.fields);
                            } else {
                                for (let j = 0; j < taskLabel.length; j++) {
                                    taskLabelArray.push(taskLabel[j].fields);
                                }
                            }
                        }
                        let taskDescription = all_records[i].fields.TaskDescription || '';
                        taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

                        if (deleteFilter == false) {
                            if (!all_records[i].fields.Completed) {
                                const dataList = {
                                    id: all_records[i].fields.ID || 0,
                                    priority: all_records[i].fields.priority || 0,
                                    date: all_records[i].fields.MsTimeStamp !== '' ? moment(all_records[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                    taskName: all_records[i].fields.TaskName || '',
                                    projectID: all_records[i].fields.ProjectID || '',
                                    projectName: all_records[i].fields.ProjectName || '',
                                    description: taskDescription,
                                    labels: taskLabelArray,
                                    category: 'Task',
                                    completed: all_records[i].fields.Completed,
                                    completedby: all_records[i].fields.due_date ? moment(all_records[i].fields.due_date).format("DD/MM/YYYY") : "",
                                };
                                dataTableList.push(dataList);
                            }
                        } else {
                            const dataList = {
                                id: all_records[i].fields.ID || 0,
                                priority: all_records[i].fields.priority || 0,
                                date: all_records[i].fields.MsTimeStamp !== '' ? moment(all_records[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                taskName: all_records[i].fields.TaskName || '',
                                projectID: all_records[i].fields.ProjectID || '',
                                projectName: all_records[i].fields.ProjectName || '',
                                description: taskDescription,
                                labels: taskLabelArray,
                                category: 'Task',
                                completed: all_records[i].fields.Completed,
                                completedby: all_records[i].fields.due_date ? moment(all_records[i].fields.due_date).format("DD/MM/YYYY") : "",
                            };
                            dataTableList.push(dataList);
                        }
                    }
                }
                await getAppointments(deleteFilter);
            }
        }).catch(function(err) {
            crmService.getAllTasksByContactName(customerName).then(async function(data) {
                if (data.tprojecttasks.length > 0) {
                    addVS1Data("TCRMTaskList", JSON.stringify(data));
                    for (let i = 0; i < data.tprojecttasks.length; i++) {
                        let sort_date = data.tprojecttasks[i].fields.MsTimeStamp == "" ? "1770-01-01" : data.tprojecttasks[i].fields.MsTimeStamp;
                        sort_date = new Date(sort_date);
                        if (sort_date >= fromDate && sort_date <= toDate ) {
                            let taskLabel = data.tprojecttasks[i].fields.TaskLabel;
                            let taskLabelArray = [];
                            if (taskLabel !== null) {
                                if (taskLabel.length === undefined || taskLabel.length === 0) {
                                    taskLabelArray.push(taskLabel.fields);
                                } else {
                                    for (let j = 0; j < taskLabel.length; j++) {
                                        taskLabelArray.push(taskLabel[j].fields);
                                    }
                                }
                            }
                            let taskDescription = data.tprojecttasks[i].fields.TaskDescription || '';
                            taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

                            if (deleteFilter == false) {
                                if (!data.tprojecttasks[i].fields.Completed) {
                                    const dataList = {
                                        id: data.tprojecttasks[i].fields.ID || 0,
                                        priority: data.tprojecttasks[i].fields.priority || 0,
                                        date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                        taskName: data.tprojecttasks[i].fields.TaskName || '',
                                        projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                        projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                        description: taskDescription,
                                        labels: taskLabelArray,
                                        category: 'Task',
                                        completed: data.tprojecttasks[i].fields.Completed,
                                        completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                    };
                                    dataTableList.push(dataList);
                                }
                            } else {
                                const dataList = {
                                    id: data.tprojecttasks[i].fields.ID || 0,
                                    priority: data.tprojecttasks[i].fields.priority || 0,
                                    date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                    taskName: data.tprojecttasks[i].fields.TaskName || '',
                                    projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                    projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                    description: taskDescription,
                                    labels: taskLabelArray,
                                    category: 'Task',
                                    completed: data.tprojecttasks[i].fields.Completed,
                                    completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                };
                                dataTableList.push(dataList);
                            }
                        }
                    }
                }
                await getAppointments(deleteFilter);
            }).catch(function(err) {
                getAppointments(deleteFilter);
            })
        });

        async function getAppointments(deleteFilter = false) {
            getVS1Data("TAppointment").then(async function(dataObject) {
                if (dataObject.length == 0) {
                    crmService.getAllAppointments(customerName).then(async function(dataObj) {
                        if (dataObj.tappointmentex.length > 0) {
                            addVS1Data("TAppointment", JSON.stringify(dataObj));
                            dataObj.tappointmentex.map(data => {
                                let creationDate = data.fields.CreationDate == "" ? "1770-01-01" : data.fields.CreationDate;
                                creationDate = new Date(creationDate);
                                if(creationDate >= fromDate && creationDate <= toDate){
                                    if (!deleteFilter) {
                                        if (data.fields.Actual_EndTime == "") {
                                            let obj = {
                                                id: data.fields.ID,
                                                priority: 0,
                                                date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                                taskName: '',
                                                projectID: data.fields.ProjectID || '',
                                                projectName: '',
                                                description: data.fields.Notes || '',
                                                labels: '',
                                                category: 'Appointment',
                                                completed: data.fields.Actual_EndTime ? true : false,
                                                completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                            }
                                            dataTableList.push(obj);
                                        }
                                    } else {
                                        let obj = {
                                            id: data.fields.ID,
                                            priority: 0,
                                            date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                            taskName: '',
                                            projectID: data.fields.ProjectID || '',
                                            projectName: '',
                                            description: data.fields.Notes || '',
                                            labels: '',
                                            category: 'Appointment',
                                            completed: data.fields.Actual_EndTime ? true : false,
                                            completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                        }
                                        dataTableList.push(obj);
                                    }
                                }
                            })
                        }
                        await getEmails(deleteFilter);
                    }).catch(function(error) {
                        getEmails(deleteFilter);
                    })
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tappointmentex;
                    for (let i = 0; i < useData.length; i++) {
                        let creationDate = useData[i].fields.CreationDate == "" ? "1770-01-01" : useData[i].fields.CreationDate;
                        creationDate = new Date(creationDate);
                        if (useData[i].fields.ClientName == customerName && creationDate >= fromDate && creationDate <= toDate) {
                            if (!deleteFilter) {
                                if (useData[i].fields.Actual_EndTime == "") {
                                    let obj = {
                                        id: useData[i].fields.ID,
                                        priority: 0,
                                        date: useData[i].fields.CreationDate !== '' ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : '',
                                        taskName: '',
                                        projectID: useData[i].fields.ProjectID || '',
                                        projectName: '',
                                        description: useData[i].fields.Notes || '',
                                        labels: '',
                                        category: 'Appointment',
                                        completed: useData[i].fields.Actual_EndTime ? true : false,
                                        completedby: useData[i].fields.Actual_EndTime ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                    }
                                    dataTableList.push(obj);
                                }
                            } else {
                                let obj = {
                                    id: useData[i].fields.ID,
                                    priority: 0,
                                    date: useData[i].fields.CreationDate !== '' ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : '',
                                    taskName: '',
                                    projectID: useData[i].fields.ProjectID || '',
                                    projectName: '',
                                    description: useData[i].fields.Notes || '',
                                    labels: '',
                                    category: 'Appointment',
                                    completed: useData[i].fields.Actual_EndTime ? true : false,
                                    completedby: useData[i].fields.Actual_EndTime ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                }
                                dataTableList.push(obj);
                            }
                        }
                    }
                    if (dataTableList.length == 0) {
                        crmService.getAllAppointments(customerName).then(async function(dataObj) {
                            if (dataObj.tappointmentex.length > 0) {
                                addVS1Data("TAppointment", JSON.stringify(dataObj));
                                dataObj.tappointmentex.map(data => {
                                    let creationDate = data.fields.CreationDate == "" ? "1770-01-01" : data.fields.CreationDate;
                                    creationDate = new Date(creationDate);
                                    if(creationDate >= fromDate && creationDate <= toDate){
                                        if (!deleteFilter) {
                                            if (data.fields.Actual_EndTime == "") {
                                                let obj = {
                                                    id: data.fields.ID,
                                                    priority: 0,
                                                    date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                                    taskName: '',
                                                    projectID: data.fields.ProjectID || '',
                                                    projectName: '',
                                                    description: data.fields.Notes || '',
                                                    labels: '',
                                                    category: 'Appointment',
                                                    completed: data.fields.Actual_EndTime ? true : false,
                                                    completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                                }
                                                dataTableList.push(obj);
                                            }
                                        } else {
                                            let obj = {
                                                id: data.fields.ID,
                                                priority: 0,
                                                date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                                taskName: '',
                                                projectID: data.fields.ProjectID || '',
                                                projectName: '',
                                                description: data.fields.Notes || '',
                                                labels: '',
                                                category: 'Appointment',
                                                completed: data.fields.Actual_EndTime ? true : false,
                                                completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                            }
                                            dataTableList.push(obj);
                                        }
                                    }
                                })
                            }
                            await getEmails(deleteFilter);
                        }).catch(function(error) {
                            getEmails(deleteFilter);
                        })
                    } else {
                        await getEmails(deleteFilter);
                    }
                }
            }).catch(function(err) {
                crmService.getAllAppointments(customerName).then(async function(dataObj) {
                    if (dataObj.tappointmentex.length > 0) {
                        addVS1Data("TAppointment", JSON.stringify(dataObj));
                        dataObj.tappointmentex.map(data => {
                            let creationDate = data.fields.CreationDate == "" ? "1770-01-01" : data.fields.CreationDate;
                            creationDate = new Date(creationDate);
                            if(creationDate >= fromDate && creationDate <= toDate){
                                if (!deleteFilter) {
                                    if (data.fields.Actual_EndTime == "") {
                                        let obj = {
                                            id: data.fields.ID,
                                            priority: 0,
                                            date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                            taskName: '',
                                            projectID: data.fields.ProjectID || '',
                                            projectName: '',
                                            description: data.fields.Notes || '',
                                            labels: '',
                                            category: 'Appointment',
                                            completed: data.fields.Actual_EndTime ? true : false,
                                            completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                        }
                                        dataTableList.push(obj);
                                    }
                                } else {
                                    let obj = {
                                        id: data.fields.ID,
                                        priority: 0,
                                        date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                        taskName: '',
                                        projectID: data.fields.ProjectID || '',
                                        projectName: '',
                                        description: data.fields.Notes || '',
                                        labels: '',
                                        category: 'Appointment',
                                        completed: data.fields.Actual_EndTime ? true : false,
                                        completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                    }
                                    dataTableList.push(obj);
                                }
                            }
                        })
                    }
                    await getEmails(deleteFilter);
                }).catch(function(error) {
                    getEmails(deleteFilter);
                })
            });
        }
        async function getEmails(deleteFilter = false) {
            getVS1Data('TCorrespondence').then(data => {
                if (data.length == 0) {
                    sideBarService.getCorrespondences().then(dataReturn => {
                        let totalCorrespondences = dataReturn.tcorrespondence;
                        totalCorrespondences = totalCorrespondences.filter(item => {
                            return item.fields.MessageTo == $('#edtCustomerEmail').val()
                        })
                        if (totalCorrespondences.length > 0 && $('#edtCustomerEmail').val() != '') {
                            addVS1Data("TCorrespondence", JSON.stringify(dataReturn));
                            totalCorrespondences.map(item => {
                                let ref_Date = item.fields.Ref_Date == "" ? "1770-01-01" : item.fields.Ref_Date;
                                ref_Date = new Date(ref_Date);

                                if (ref_Date >= fromDate && ref_Date <= toDate ) {
                                    let labels = [];
                                    labels.push(item.fields.Ref_Type)
                                    let obj = {
                                        id: item.fields.MessageId ? parseInt(item.fields.MessageId) : 999999,
                                        priority: 0,
                                        date: item.fields.Ref_Date !== '' ? moment(item.fields.Ref_Date).format('DD/MM/YYYY') : '',
                                        taskName: '',
                                        projectID: '',
                                        projectName: '',
                                        description: '',
                                        labels: '',
                                        category: 'Email',
                                        completed: false,
                                        completedby: "",
                                    }
                                    dataTableList.push(obj)
                                }
                            })
                        }
                        try {
                            dataTableList.sort((a, b) => {
                                return new Date(b.date.split("/")[2]+"-"+b.date.split("/")[1]+"-"+b.date.split("/")[0]) - new Date(a.date.split("/")[2]+"-"+a.date.split("/")[1]+"-"+a.date.split("/")[0])
                            })
                        } catch (error) {}
                        templateObject.displayCustomerCrmListDataWithDate(dataTableList, deleteFilter, moment(fromDate).format("DD/MM/YYYY"), moment(toDate).format("DD/MM/YYYY"))
                    }).catch((err) => {
                        $('.fullScreenSpin').css('display', 'none');
                    })
                } else {
                    let dataObj = JSON.parse(data[0].data);
                    if (dataObj.tcorrespondence.length > 0) {
                        for (let i = 0; i < dataObj.tcorrespondence.length; i++) {
                            let ref_Date = dataObj.tcorrespondence[i].fields.Ref_Date == "" ? "1770-01-01" : dataObj.tcorrespondence[i].fields.Ref_Date;
                            ref_Date = new Date(ref_Date);
                            if (dataObj.tcorrespondence[i].fields.MessageTo == $('#edtCustomerEmail').val() && ref_Date >= fromDate && ref_Date <= toDate) {
                                let labels = [];
                                labels.push(dataObj.tcorrespondence[i].fields.Ref_Type)
                                let obj = {
                                    id: dataObj.tcorrespondence[i].fields.MessageId ? parseInt(dataObj.tcorrespondence[i].fields.MessageId) : 999999,
                                    priority: 0,
                                    date: dataObj.tcorrespondence[i].fields.Ref_Date !== '' ? moment(dataObj.tcorrespondence[i].fields.Ref_Date).format('DD/MM/YYYY') : '',
                                    taskName: '',
                                    projectID: '',
                                    projectName: '',
                                    description: '',
                                    labels: '',
                                    category: 'Email',
                                    completed: false,
                                    completedby: "",
                                }
                                dataTableList.push(obj)
                            }
                        }
                    }
                    try {
                        dataTableList.sort((a, b) => {
                            return new Date(b.date.split("/")[2]+"-"+b.date.split("/")[1]+"-"+b.date.split("/")[0]) - new Date(a.date.split("/")[2]+"-"+a.date.split("/")[1]+"-"+a.date.split("/")[0])
                        })
                    } catch (error) {}
                    templateObject.displayCustomerCrmListDataWithDate(dataTableList, deleteFilter, moment(fromDate).format("DD/MM/YYYY"), moment(toDate).format("DD/MM/YYYY"))
                }
            }).catch(function(err) {
                sideBarService.getCorrespondences().then(dataReturn => {
                    let totalCorrespondences = dataReturn.tcorrespondence;
                    totalCorrespondences = totalCorrespondences.filter(item => {
                        return item.fields.MessageTo == $('#edtCustomerEmail').val()
                    })
                    if (totalCorrespondences.length > 0 && $('#edtCustomerEmail').val() != '') {
                        addVS1Data("TCorrespondence", JSON.stringify(dataReturn));
                        totalCorrespondences.map(item => {
                            let ref_Date = item.fields.Ref_Date == "" ? "1770-01-01" : item.fields.Ref_Date;
                            ref_Date = new Date(ref_Date);
                            if (ref_Date >= fromDate && ref_Date <= toDate ) {
                                let labels = [];
                                labels.push(item.fields.Ref_Type)
                                let obj = {
                                    id: item.fields.MessageId ? parseInt(item.fields.MessageId) : 999999,
                                    priority: 0,
                                    date: item.fields.Ref_Date !== '' ? moment(item.fields.Ref_Date).format('DD/MM/YYYY') : '',
                                    taskName: '',
                                    projectID: '',
                                    projectName: '',
                                    description: '',
                                    labels: '',
                                    category: 'Email',
                                    completed: false,
                                    completedby: "",
                                }
                                dataTableList.push(obj)
                            }
                        })
                    }
                    try {
                        dataTableList.sort((a, b) => {
                            return new Date(b.date.split("/")[2]+"-"+b.date.split("/")[1]+"-"+b.date.split("/")[0]) - new Date(a.date.split("/")[2]+"-"+a.date.split("/")[1]+"-"+a.date.split("/")[0])
                        })
                    } catch (error) {}
                    templateObject.displayCustomerCrmListDataWithDate(dataTableList, deleteFilter, moment(fromDate).format("DD/MM/YYYY"), moment(toDate).format("DD/MM/YYYY"))
                }).catch((err) => {
                    $('.fullScreenSpin').css('display', 'none');
                })
            });
        }
    }

    templateObject.displayCustomerCrmListDataWithDate = function(data, deleteFilter = false, fromDate="", toDate="") {
        var splashArrayClientTypeList = new Array();
        for (let i = 0; i < data.length; i++) {
            var dataList = [
                data[i].id || "",
                data[i].date || "",
                data[i].category || "",
                data[i].taskName || "",
                data[i].description || "",
                data[i].completedby || "",
                data[i].completed ? "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit' checked='checked'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>" :
                "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>"
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                sDom: "<'row'><'row'<'col-sm-12 col-lg-7'f><'col-sm-12 col-lg-5 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colDate",
                        width: "15%",
                        orderable: false,
                    },
                    {
                        targets: 2,
                        className: "colType",
                        width: "15%",
                    },
                    {
                        targets: 3,
                        className: "colTaskName",
                        width: "20%",
                    },
                    {
                        targets: 4,
                        className: "colTaskDesc",
                        width: "35%",
                    },
                    {
                        targets: 5,
                        className: "colCompletedBy",
                        width: "15%",
                        orderable: false,
                    },
                    {
                        targets: 6,
                        className: "colCompleteTask",
                        width: "15%",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                bLengthChange: false,
                "order": [
                    // [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    // $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    $(`<div class="btn-group btnNav btnAddLineGroup" style="height:35px">
                        <button type="button" class="btn btn-primary btnAddLine" id="btnAddLine" style="margin-right: 0px;"><i class='fas fa-plus'></i></button>
                        <button class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false" type="button"></button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item btnAddLineTask pointer" id="btnAddLineTask">+ Task</a>
                        </div>
                    </div>`).insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Completed</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Completed</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');

                    var html = `<div class="col float-right d-sm-flex d-xl-flex justify-content-sm-end align-items-sm-center justify-content-xl-end align-items-xl-end myvarFilterForm">
                        <div class="form-group" style="margin: 12px; margin-top: 0px; display: inline-flex;">
                            <label style="margin-top: 8px; margin-right: 12px;">From</label>
                            <div class="input-group date" style="width: 160px;">
                                <input type="text" class="form-control" id="dateFrom" name="dateFrom" >
                                <div class="input-group-addon">
                                    <span class="glyphicon glyphicon-th"></span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" style="margin: 12px; margin-right: 0px; margin-top: 0px; display: inline-flex;">
                            <label style="margin-top: 8px; margin-right: 12px;">To</label>
                            <div class="input-group date" style="width: 160px;">
                                <input type="text" class="form-control" id="dateTo" name="dateTo" >
                                <div class="input-group-addon">
                                    <span class="glyphicon glyphicon-th"></span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    setTimeout(function() {
                        $(".colDateFilter").html(html);
                        $("#dateFrom, #dateTo").datepicker({
                            showOn: "button",
                            buttonText: "Show Date",
                            buttonImageOnly: true,
                            buttonImage: "/img/imgCal2.png",
                            dateFormat: "dd/mm/yy",
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            changeMonth: true,
                            changeYear: true,
                            yearRange: "-90:+10",
                            onSelect: function(formated, dates) {
                                const datefrom = $("#dateFrom").val();
                                const dateto = $("#dateTo").val();
                                templateObject.getCustomerCrmListDataWithDate(false, datefrom, dateto);
                            },
                            onChangeMonthYear: function(year, month, inst) {
                                // Set date to picker
                                $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
                                // Hide (close) the picker
                                // $(this).datepicker('hide');
                                // // Change ttrigger the on change function
                                // $(this).trigger('change');
                            }
                        });
                        $("#dateFrom").val(fromDate);
                        $("#dateTo").val(toDate);

                        $(document).on("click", "#btnRefreshList", function(e) {
                            const datefrom = $("#dateFrom").val();
                            const dateto = $("#dateTo").val();
                            templateObject.getCustomerCrmListDataWithDate(false, datefrom, dateto);
                        });
                    }, 100);
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getSupplierCrmListData = function() {
        let dataTableList = [];
        let customerName = $('#edtSupplierCompany').val();
        crmService.getAllTasksByContactName(customerName).then(async function(data) {
            if (data.tprojecttasks.length > 0) {
                for (let i = 0; i < data.tprojecttasks.length; i++) {
                    let taskLabel = data.tprojecttasks[i].fields.TaskLabel;
                    let taskLabelArray = [];
                    if (taskLabel !== null) {
                        if (taskLabel.length === undefined || taskLabel.length === 0) {
                            taskLabelArray.push(taskLabel.fields);
                        } else {
                            for (let j = 0; j < taskLabel.length; j++) {
                                taskLabelArray.push(taskLabel[j].fields);
                            }
                        }
                    }
                    let taskDescription = data.tprojecttasks[i].fields.TaskDescription || '';
                    taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";
                    const dataList = {
                        id: data.tprojecttasks[i].fields.ID || 0,
                        priority: data.tprojecttasks[i].fields.priority || 0,
                        date: data.tprojecttasks[i].fields.due_date !== '' ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : '',
                        taskName: 'Task',
                        projectID: data.tprojecttasks[i].fields.ProjectID || '',
                        projectName: data.tprojecttasks[i].fields.ProjectName || '',
                        description: taskDescription,
                        labels: taskLabelArray,
                        category: 'task',
                        completed: data.tprojecttasks[i].fields.Completed,
                        completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                    };
                    dataTableList.push(dataList);
                }
            }
            await getAppointments();
        }).catch(function(err) {
            getAppointments();
        })

        async function getAppointments() {
            crmService.getAllAppointments(customerName).then(async function(dataObj) {
                if (dataObj.tappointmentex.length > 0) {
                    dataObj.tappointmentex.map(data => {
                        let obj = {
                            id: data.fields.ID,
                            priority: 0,
                            date: data.fields.StartTime !== '' ? moment(data.fields.StartTime).format("DD/MM/YYYY") : '',
                            taskName: 'Appointment',
                            projectID: data.fields.ProjectID || '',
                            projectName: '',
                            description: '',
                            labels: '',
                            category: 'appointment',
                            completed: data.fields.Actual_EndTime ? true : false,
                            completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                        }
                        dataTableList.push(obj);
                    })
                }
                await getEmails();
            }).catch(function(error) {
                getEmails();
            })
        }
        async function getEmails() {
            sideBarService.getCorrespondences().then(dataReturn => {
                    let totalCorrespondences = dataReturn.tcorrespondence;
                    totalCorrespondences = totalCorrespondences.filter(item => {
                        return item.fields.MessageTo == $('#edtSupplierCompanyEmail').val()
                    })
                    if (totalCorrespondences.length > 0 && $('#edtSupplierCompanyEmail').val() != '') {
                        totalCorrespondences.map(item => {
                            let labels = [];
                            labels.push(item.fields.Ref_Type)
                            let obj = {
                                id: item.fields.MessageId ? parseInt(item.fields.MessageId) : 999999,
                                priority: 0,
                                date: item.fields.Ref_Date !== '' ? moment(item.fields.Ref_Date).format('DD/MM/YYYY') : '',
                                taskName: 'Email',
                                projectID: '',
                                projectName: '',
                                description: '',
                                labels: '',
                                category: 'email',
                                completed: false,
                                completedby: "",
                            }
                            dataTableList.push(obj)
                        })
                    }
                    try {
                        dataTableList.sort((a, b) => {
                            new Date(a.date) - new Date(b.date)
                        })
                    } catch (error) {}
                    templateObject.displaySupplierCrmListData(dataTableList)
                })
                .catch((err) => {
                    $('.fullScreenSpin').css('display', 'none');
                })
        }
    }

    templateObject.displaySupplierCrmListData = function(data) {
        var splashArrayClientTypeList = new Array();
        let deleteFilter = false;
        for (let i = 0; i < data.length; i++) {
            var dataList = [
                data[i].id || "",
                data[i].date || "",
                data[i].taskName || "",
                data[i].description || "",
                data[i].completedby || "",
                data[i].completed ? "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit' checked='checked'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>" :
                "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>"
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colDate",
                        width: "100px",
                    },
                    {
                        targets: 2,
                        className: "colTaskName",
                        width: "150px",
                    },
                    {
                        targets: 3,
                        className: "colTaskDesc",
                        width: "250px",
                    },
                    {
                        targets: 4,
                        className: "colCompletedBy",
                        width: "100px",
                    },
                    {
                        targets: 5,
                        className: "colCompleteTask",
                        width: "100px",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getSupplierCrmListDataWithDate = function(deleteFilter = false, datefrom="", dateto="") {
        let dataTableList = [];
        let customerName = $('#edtSupplierCompany').val();

        let fromDate = datefrom == "" ? moment().subtract(2, 'month').format('DD/MM/YYYY') : datefrom;
        let toDate = dateto == "" ? moment().format("DD/MM/YYYY") : dateto;

        fromDate = new Date(fromDate.split("/")[2]+"-"+fromDate.split("/")[1]+"-"+fromDate.split("/")[0]+" 00:00:01");
        toDate = new Date(toDate.split("/")[2]+"-"+toDate.split("/")[1]+"-"+toDate.split("/")[0]+" 23:59:59");

        getVS1Data("TCRMTaskList").then(async function(dataObject) {
            if (dataObject.length == 0) {
                crmService.getAllTasksByContactName(customerName).then(async function(data) {
                    if (data.tprojecttasks.length > 0) {
                        addVS1Data("TCRMTaskList", JSON.stringify(data));
                        for (let i = 0; i < data.tprojecttasks.length; i++) {
                            let sort_date = data.tprojecttasks[i].fields.MsTimeStamp == "" ? "1770-01-01" : data.tprojecttasks[i].fields.MsTimeStamp;
                            sort_date = new Date(sort_date);
                            if (sort_date >= fromDate && sort_date <= toDate ) {
                                let taskLabel = data.tprojecttasks[i].fields.TaskLabel;
                                let taskLabelArray = [];
                                if (taskLabel !== null) {
                                    if (taskLabel.length === undefined || taskLabel.length === 0) {
                                        taskLabelArray.push(taskLabel.fields);
                                    } else {
                                        for (let j = 0; j < taskLabel.length; j++) {
                                            taskLabelArray.push(taskLabel[j].fields);
                                        }
                                    }
                                }
                                let taskDescription = data.tprojecttasks[i].fields.TaskDescription || '';
                                taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

                                if (deleteFilter == false) {
                                    if (!data.tprojecttasks[i].fields.Completed) {
                                        const dataList = {
                                            id: data.tprojecttasks[i].fields.ID || 0,
                                            priority: data.tprojecttasks[i].fields.priority || 0,
                                            date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                            taskName: data.tprojecttasks[i].fields.TaskName || '',
                                            projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                            projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                            description: taskDescription,
                                            labels: taskLabelArray,
                                            category: 'Task',
                                            completed: data.tprojecttasks[i].fields.Completed,
                                            completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                        };
                                        dataTableList.push(dataList);
                                    }
                                } else {
                                    const dataList = {
                                        id: data.tprojecttasks[i].fields.ID || 0,
                                        priority: data.tprojecttasks[i].fields.priority || 0,
                                        date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                        taskName: data.tprojecttasks[i].fields.TaskName || '',
                                        projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                        projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                        description: taskDescription,
                                        labels: taskLabelArray,
                                        category: 'Task',
                                        completed: data.tprojecttasks[i].fields.Completed,
                                        completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                    };
                                    dataTableList.push(dataList);
                                }
                            }
                        }
                    }
                    await getAppointments();
                }).catch(function(err) {
                    getAppointments();
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let all_records = data.tprojecttasks;

                for (let i = 0; i < all_records.length; i++) {
                    let sort_date = all_records[i].fields.MsTimeStamp == "" ? "1770-01-01" : all_records[i].fields.MsTimeStamp;
                    sort_date = new Date(sort_date);
                    if (all_records[i].fields.ContactName == customerName && sort_date >= fromDate && sort_date <= toDate ) {
                        let taskLabel = all_records[i].fields.TaskLabel;
                        let taskLabelArray = [];
                        if (taskLabel !== null) {
                            if (taskLabel.length === undefined || taskLabel.length === 0) {
                                taskLabelArray.push(taskLabel.fields);
                            } else {
                                for (let j = 0; j < taskLabel.length; j++) {
                                    taskLabelArray.push(taskLabel[j].fields);
                                }
                            }
                        }
                        let taskDescription = all_records[i].fields.TaskDescription || '';
                        taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

                        if (deleteFilter == false) {
                            if (!all_records[i].fields.Completed) {
                                const dataList = {
                                    id: all_records[i].fields.ID || 0,
                                    priority: all_records[i].fields.priority || 0,
                                    date: all_records[i].fields.MsTimeStamp !== '' ? moment(all_records[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                    taskName: all_records[i].fields.TaskName || '',
                                    projectID: all_records[i].fields.ProjectID || '',
                                    projectName: all_records[i].fields.ProjectName || '',
                                    description: taskDescription,
                                    labels: taskLabelArray,
                                    category: 'Task',
                                    completed: all_records[i].fields.Completed,
                                    completedby: all_records[i].fields.due_date ? moment(all_records[i].fields.due_date).format("DD/MM/YYYY") : "",
                                };
                                dataTableList.push(dataList);
                            }
                        } else {
                            const dataList = {
                                id: all_records[i].fields.ID || 0,
                                priority: all_records[i].fields.priority || 0,
                                date: all_records[i].fields.MsTimeStamp !== '' ? moment(all_records[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                taskName: all_records[i].fields.TaskName || '',
                                projectID: all_records[i].fields.ProjectID || '',
                                projectName: all_records[i].fields.ProjectName || '',
                                description: taskDescription,
                                labels: taskLabelArray,
                                category: 'Task',
                                completed: all_records[i].fields.Completed,
                                completedby: all_records[i].fields.due_date ? moment(all_records[i].fields.due_date).format("DD/MM/YYYY") : "",
                            };
                            dataTableList.push(dataList);
                        }
                    }
                }
                await getAppointments(deleteFilter);
            }
        }).catch(function(err) {
            crmService.getAllTasksByContactName(customerName).then(async function(data) {
                if (data.tprojecttasks.length > 0) {
                    addVS1Data("TCRMTaskList", JSON.stringify(data));
                    for (let i = 0; i < data.tprojecttasks.length; i++) {
                        let sort_date = data.tprojecttasks[i].fields.MsTimeStamp == "" ? "1770-01-01" : data.tprojecttasks[i].fields.MsTimeStamp;
                        sort_date = new Date(sort_date);
                        if (sort_date >= fromDate && sort_date <= toDate ) {
                            let taskLabel = data.tprojecttasks[i].fields.TaskLabel;
                            let taskLabelArray = [];
                            if (taskLabel !== null) {
                                if (taskLabel.length === undefined || taskLabel.length === 0) {
                                    taskLabelArray.push(taskLabel.fields);
                                } else {
                                    for (let j = 0; j < taskLabel.length; j++) {
                                        taskLabelArray.push(taskLabel[j].fields);
                                    }
                                }
                            }
                            let taskDescription = data.tprojecttasks[i].fields.TaskDescription || '';
                            taskDescription = taskDescription.length < 50 ? taskDescription : taskDescription.substring(0, 49) + "...";

                            if (deleteFilter == false) {
                                if (!data.tprojecttasks[i].fields.Completed) {
                                    const dataList = {
                                        id: data.tprojecttasks[i].fields.ID || 0,
                                        priority: data.tprojecttasks[i].fields.priority || 0,
                                        date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                        taskName: data.tprojecttasks[i].fields.TaskName || '',
                                        projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                        projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                        description: taskDescription,
                                        labels: taskLabelArray,
                                        category: 'Task',
                                        completed: data.tprojecttasks[i].fields.Completed,
                                        completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                    };
                                    dataTableList.push(dataList);
                                }
                            } else {
                                const dataList = {
                                    id: data.tprojecttasks[i].fields.ID || 0,
                                    priority: data.tprojecttasks[i].fields.priority || 0,
                                    date: data.tprojecttasks[i].fields.MsTimeStamp !== '' ? moment(data.tprojecttasks[i].fields.MsTimeStamp).format("DD/MM/YYYY") : '',
                                    taskName: data.tprojecttasks[i].fields.TaskName || '',
                                    projectID: data.tprojecttasks[i].fields.ProjectID || '',
                                    projectName: data.tprojecttasks[i].fields.ProjectName || '',
                                    description: taskDescription,
                                    labels: taskLabelArray,
                                    category: 'Task',
                                    completed: data.tprojecttasks[i].fields.Completed,
                                    completedby: data.tprojecttasks[i].fields.due_date ? moment(data.tprojecttasks[i].fields.due_date).format("DD/MM/YYYY") : "",
                                };
                                dataTableList.push(dataList);
                            }
                        }
                    }
                }
                await getAppointments(deleteFilter);
            }).catch(function(err) {
                getAppointments(deleteFilter);
            })
        });

        async function getAppointments(deleteFilter = false) {
            getVS1Data("TAppointment").then(async function(dataObject) {
                if (dataObject.length == 0) {
                    crmService.getAllAppointments(customerName).then(async function(dataObj) {
                        if (dataObj.tappointmentex.length > 0) {
                            addVS1Data("TAppointment", JSON.stringify(dataObj));
                            dataObj.tappointmentex.map(data => {
                                let creationDate = data.fields.CreationDate == "" ? "1770-01-01" : data.fields.CreationDate;
                                creationDate = new Date(creationDate);
                                if(creationDate >= fromDate && creationDate <= toDate){
                                    if (!deleteFilter) {
                                        if (data.fields.Actual_EndTime == "") {
                                            let obj = {
                                                id: data.fields.ID,
                                                priority: 0,
                                                date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                                taskName: '',
                                                projectID: data.fields.ProjectID || '',
                                                projectName: '',
                                                description: data.fields.Notes || '',
                                                labels: '',
                                                category: 'Appointment',
                                                completed: data.fields.Actual_EndTime ? true : false,
                                                completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                            }
                                            dataTableList.push(obj);
                                        }
                                    } else {
                                        let obj = {
                                            id: data.fields.ID,
                                            priority: 0,
                                            date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                            taskName: '',
                                            projectID: data.fields.ProjectID || '',
                                            projectName: '',
                                            description: data.fields.Notes || '',
                                            labels: '',
                                            category: 'Appointment',
                                            completed: data.fields.Actual_EndTime ? true : false,
                                            completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                        }
                                        dataTableList.push(obj);
                                    }
                                }
                            })
                        }
                        await getEmails(deleteFilter);
                    }).catch(function(error) {
                        getEmails(deleteFilter);
                    })
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tappointmentex;
                    for (let i = 0; i < useData.length; i++) {
                        let creationDate = useData[i].fields.CreationDate == "" ? "1770-01-01" : useData[i].fields.CreationDate;
                        creationDate = new Date(creationDate);
                        if (useData[i].fields.ClientName == customerName && creationDate >= fromDate && creationDate <= toDate) {
                            if (!deleteFilter) {
                                if (useData[i].fields.Actual_EndTime == "") {
                                    let obj = {
                                        id: useData[i].fields.ID,
                                        priority: 0,
                                        date: useData[i].fields.CreationDate !== '' ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : '',
                                        taskName: '',
                                        projectID: useData[i].fields.ProjectID || '',
                                        projectName: '',
                                        description: useData[i].fields.Notes || '',
                                        labels: '',
                                        category: 'Appointment',
                                        completed: useData[i].fields.Actual_EndTime ? true : false,
                                        completedby: useData[i].fields.Actual_EndTime ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                    }
                                    dataTableList.push(obj);
                                }
                            } else {
                                let obj = {
                                    id: useData[i].fields.ID,
                                    priority: 0,
                                    date: useData[i].fields.CreationDate !== '' ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : '',
                                    taskName: '',
                                    projectID: useData[i].fields.ProjectID || '',
                                    projectName: '',
                                    description: useData[i].fields.Notes || '',
                                    labels: '',
                                    category: 'Appointment',
                                    completed: useData[i].fields.Actual_EndTime ? true : false,
                                    completedby: useData[i].fields.Actual_EndTime ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                }
                                dataTableList.push(obj);
                            }
                        }
                    }
                    if (dataTableList.length == 0) {
                        crmService.getAllAppointments(customerName).then(async function(dataObj) {
                            if (dataObj.tappointmentex.length > 0) {
                                addVS1Data("TAppointment", JSON.stringify(dataObj));
                                dataObj.tappointmentex.map(data => {
                                    let creationDate = data.fields.CreationDate == "" ? "1770-01-01" : data.fields.CreationDate;
                                    creationDate = new Date(creationDate);
                                    if(creationDate >= fromDate && creationDate <= toDate){
                                        if (!deleteFilter) {
                                            if (data.fields.Actual_EndTime == "") {
                                                let obj = {
                                                    id: data.fields.ID,
                                                    priority: 0,
                                                    date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                                    taskName: '',
                                                    projectID: data.fields.ProjectID || '',
                                                    projectName: '',
                                                    description: data.fields.Notes || '',
                                                    labels: '',
                                                    category: 'Appointment',
                                                    completed: data.fields.Actual_EndTime ? true : false,
                                                    completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                                }
                                                dataTableList.push(obj);
                                            }
                                        } else {
                                            let obj = {
                                                id: data.fields.ID,
                                                priority: 0,
                                                date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                                taskName: '',
                                                projectID: data.fields.ProjectID || '',
                                                projectName: '',
                                                description: data.fields.Notes || '',
                                                labels: '',
                                                category: 'Appointment',
                                                completed: data.fields.Actual_EndTime ? true : false,
                                                completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                            }
                                            dataTableList.push(obj);
                                        }
                                    }
                                })
                            }
                            await getEmails(deleteFilter);
                        }).catch(function(error) {
                            getEmails(deleteFilter);
                        })
                    } else {
                        await getEmails(deleteFilter);
                    }
                }
            }).catch(function(err) {
                crmService.getAllAppointments(customerName).then(async function(dataObj) {
                    if (dataObj.tappointmentex.length > 0) {
                        addVS1Data("TAppointment", JSON.stringify(dataObj));
                        dataObj.tappointmentex.map(data => {
                            let creationDate = data.fields.CreationDate == "" ? "1770-01-01" : data.fields.CreationDate;
                            creationDate = new Date(creationDate);
                            if(creationDate >= fromDate && creationDate <= toDate){
                                if (!deleteFilter) {
                                    if (data.fields.Actual_EndTime == "") {
                                        let obj = {
                                            id: data.fields.ID,
                                            priority: 0,
                                            date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                            taskName: '',
                                            projectID: data.fields.ProjectID || '',
                                            projectName: '',
                                            description: data.fields.Notes || '',
                                            labels: '',
                                            category: 'Appointment',
                                            completed: data.fields.Actual_EndTime ? true : false,
                                            completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                        }
                                        dataTableList.push(obj);
                                    }
                                } else {
                                    let obj = {
                                        id: data.fields.ID,
                                        priority: 0,
                                        date: data.fields.CreationDate !== '' ? moment(data.fields.CreationDate).format("DD/MM/YYYY") : '',
                                        taskName: '',
                                        projectID: data.fields.ProjectID || '',
                                        projectName: '',
                                        description: data.fields.Notes || '',
                                        labels: '',
                                        category: 'Appointment',
                                        completed: data.fields.Actual_EndTime ? true : false,
                                        completedby: data.fields.Actual_EndTime ? moment(data.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                                    }
                                    dataTableList.push(obj);
                                }
                            }
                        })
                    }
                    await getEmails(deleteFilter);
                }).catch(function(error) {
                    getEmails(deleteFilter);
                })
            });
        }
        async function getEmails(deleteFilter = false) {
            getVS1Data('TCorrespondence').then(data => {
                if (data.length == 0) {
                    sideBarService.getCorrespondences().then(dataReturn => {
                        let totalCorrespondences = dataReturn.tcorrespondence;
                        totalCorrespondences = totalCorrespondences.filter(item => {
                            return item.fields.MessageTo == $('#edtSupplierCompanyEmail').val()
                        })
                        if (totalCorrespondences.length > 0 && $('#edtSupplierCompanyEmail').val() != '') {
                            addVS1Data("TCorrespondence", JSON.stringify(dataReturn));
                            totalCorrespondences.map(item => {
                                let ref_Date = item.fields.Ref_Date == "" ? "1770-01-01" : item.fields.Ref_Date;
                                ref_Date = new Date(ref_Date);

                                if (ref_Date >= fromDate && ref_Date <= toDate ) {
                                    let labels = [];
                                    labels.push(item.fields.Ref_Type)
                                    let obj = {
                                        id: item.fields.MessageId ? parseInt(item.fields.MessageId) : 999999,
                                        priority: 0,
                                        date: item.fields.Ref_Date !== '' ? moment(item.fields.Ref_Date).format('DD/MM/YYYY') : '',
                                        taskName: '',
                                        projectID: '',
                                        projectName: '',
                                        description: '',
                                        labels: '',
                                        category: 'Email',
                                        completed: false,
                                        completedby: "",
                                    }
                                    dataTableList.push(obj)
                                }
                            })
                        }
                        try {
                            dataTableList.sort((a, b) => {
                                return new Date(b.date.split("/")[2]+"-"+b.date.split("/")[1]+"-"+b.date.split("/")[0]) - new Date(a.date.split("/")[2]+"-"+a.date.split("/")[1]+"-"+a.date.split("/")[0])
                            })
                        } catch (error) {}
                        templateObject.displaySupplierCrmListDataWithDate(dataTableList, deleteFilter, moment(fromDate).format("DD/MM/YYYY"), moment(toDate).format("DD/MM/YYYY"))
                    }).catch((err) => {
                        $('.fullScreenSpin').css('display', 'none');
                    })
                } else {
                    let dataObj = JSON.parse(data[0].data);
                    if (dataObj.tcorrespondence.length > 0) {
                        for (let i = 0; i < dataObj.tcorrespondence.length; i++) {
                            let ref_Date = dataObj.tcorrespondence[i].fields.Ref_Date == "" ? "1770-01-01" : dataObj.tcorrespondence[i].fields.Ref_Date;
                            ref_Date = new Date(ref_Date);
                            if (dataObj.tcorrespondence[i].fields.MessageTo == $('#edtSupplierCompanyEmail').val() && ref_Date >= fromDate && ref_Date <= toDate) {
                                let labels = [];
                                labels.push(dataObj.tcorrespondence[i].fields.Ref_Type)
                                let obj = {
                                    id: dataObj.tcorrespondence[i].fields.MessageId ? parseInt(dataObj.tcorrespondence[i].fields.MessageId) : 999999,
                                    priority: 0,
                                    date: dataObj.tcorrespondence[i].fields.Ref_Date !== '' ? moment(dataObj.tcorrespondence[i].fields.Ref_Date).format('DD/MM/YYYY') : '',
                                    taskName: '',
                                    projectID: '',
                                    projectName: '',
                                    description: '',
                                    labels: '',
                                    category: 'Email',
                                    completed: false,
                                    completedby: "",
                                }
                                dataTableList.push(obj)
                            }
                        }
                    }
                    try {
                        dataTableList.sort((a, b) => {
                            return new Date(b.date.split("/")[2]+"-"+b.date.split("/")[1]+"-"+b.date.split("/")[0]) - new Date(a.date.split("/")[2]+"-"+a.date.split("/")[1]+"-"+a.date.split("/")[0])
                        })
                    } catch (error) {}
                    templateObject.displaySupplierCrmListDataWithDate(dataTableList, deleteFilter, moment(fromDate).format("DD/MM/YYYY"), moment(toDate).format("DD/MM/YYYY"))
                }
            }).catch(function(err) {
                sideBarService.getCorrespondences().then(dataReturn => {
                    let totalCorrespondences = dataReturn.tcorrespondence;
                    totalCorrespondences = totalCorrespondences.filter(item => {
                        return item.fields.MessageTo == $('#edtSupplierCompanyEmail').val()
                    })
                    if (totalCorrespondences.length > 0 && $('#edtSupplierCompanyEmail').val() != '') {
                        addVS1Data("TCorrespondence", JSON.stringify(dataReturn));
                        totalCorrespondences.map(item => {
                            let ref_Date = item.fields.Ref_Date == "" ? "1770-01-01" : item.fields.Ref_Date;
                            ref_Date = new Date(ref_Date);
                            if (ref_Date >= fromDate && ref_Date <= toDate ) {
                                let labels = [];
                                labels.push(item.fields.Ref_Type)
                                let obj = {
                                    id: item.fields.MessageId ? parseInt(item.fields.MessageId) : 999999,
                                    priority: 0,
                                    date: item.fields.Ref_Date !== '' ? moment(item.fields.Ref_Date).format('DD/MM/YYYY') : '',
                                    taskName: '',
                                    projectID: '',
                                    projectName: '',
                                    description: '',
                                    labels: '',
                                    category: 'Email',
                                    completed: false,
                                    completedby: "",
                                }
                                dataTableList.push(obj)
                            }
                        })
                    }
                    try {
                        dataTableList.sort((a, b) => {
                            return new Date(b.date.split("/")[2]+"-"+b.date.split("/")[1]+"-"+b.date.split("/")[0]) - new Date(a.date.split("/")[2]+"-"+a.date.split("/")[1]+"-"+a.date.split("/")[0])
                        })
                    } catch (error) {}
                    templateObject.displaySupplierCrmListDataWithDate(dataTableList, deleteFilter, moment(fromDate).format("DD/MM/YYYY"), moment(toDate).format("DD/MM/YYYY"))
                }).catch((err) => {
                    $('.fullScreenSpin').css('display', 'none');
                })
            });
        }
    }

    templateObject.displaySupplierCrmListDataWithDate = function(data, deleteFilter = false, fromDate="", toDate="") {
        var splashArrayClientTypeList = new Array();
        for (let i = 0; i < data.length; i++) {
            var dataList = [
                data[i].id || "",
                data[i].date || "",
                data[i].category || "",
                data[i].taskName || "",
                data[i].description || "",
                data[i].completedby || "",
                data[i].completed ? "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit' checked='checked'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>" :
                "<div class='custom-control custom-switch' style='cursor: pointer;'><input class='custom-control-input additionalModule chkComplete pointer' type='checkbox' id=chkCompleted_" + data[i].id + "name='Additional' style='cursor: pointer;' additionalqty='1' autocomplete='off' data-id='edit'><label class='custom-control-label' for='chkCompleted_" + data[i].id + "style='cursor: pointer; max-width: 200px;' data-id='edit'>Completed</label></div>"
            ];
            splashArrayClientTypeList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayClientTypeList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayClientTypeList,
                sDom: "<'row'><'row'<'col-sm-12 col-lg-7'f><'col-sm-12 col-lg-5 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "hiddenColumn",
                        width: "10px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colDate",
                        width: "15%",
                    },
                    {
                        targets: 2,
                        className: "colType",
                        width: "15%",
                    },
                    {
                        targets: 3,
                        className: "colTaskName",
                        width: "20%",
                    },
                    {
                        targets: 4,
                        className: "colTaskDesc",
                        width: "35%",
                    },
                    {
                        targets: 5,
                        className: "colCompletedBy",
                        width: "15%",
                    },
                    {
                        targets: 6,
                        className: "colCompleteTask",
                        width: "15%",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Customer Type Settings',
                        filename: "Customer Type Settings",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Customer Type Settings",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    // [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataTableList = [];
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search List..." },
                "fnInitComplete": function(oSettings) {
                    // $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter('#' + currenttablename + '_filter');
                    $(`<div class="btn-group btnNav btnAddLineGroup" style="height:35px">
                        <button type="button" class="btn btn-primary btnAddLine" id="btnAddLine" style="margin-right: 0px;"><i class='fas fa-plus'></i></button>
                        <button class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false" type="button"></button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item btnAddLineTask pointer" id="btnAddLineTask">+ Task</a>
                        </div>
                    </div>`).insertAfter('#' + currenttablename + '_filter');
                    if (deleteFilter) {
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Completed</button>").insertAfter('#' + currenttablename + '_filter');
                    } else {
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Completed</button>").insertAfter('#' + currenttablename + '_filter');
                    }
                    $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');

                    var html = `<div class="col float-right d-sm-flex d-xl-flex justify-content-sm-end align-items-sm-center justify-content-xl-end align-items-xl-end myvarFilterForm">
                        <div class="form-group" style="margin: 12px; margin-top: 0px; display: inline-flex;">
                            <label style="margin-top: 8px; margin-right: 12px;">From</label>
                            <div class="input-group date" style="width: 160px;">
                                <input type="text" class="form-control" id="dateFrom" name="dateFrom" >
                                <div class="input-group-addon">
                                    <span class="glyphicon glyphicon-th"></span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" style="margin: 12px; margin-right: 0px; margin-top: 0px; display: inline-flex;">
                            <label style="margin-top: 8px; margin-right: 12px;">To</label>
                            <div class="input-group date" style="width: 160px;">
                                <input type="text" class="form-control" id="dateTo" name="dateTo" >
                                <div class="input-group-addon">
                                    <span class="glyphicon glyphicon-th"></span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    setTimeout(function() {
                        $(".colDateFilter").html(html);
                        $("#dateFrom, #dateTo").datepicker({
                            showOn: "button",
                            buttonText: "Show Date",
                            buttonImageOnly: true,
                            buttonImage: "/img/imgCal2.png",
                            dateFormat: "dd/mm/yy",
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            changeMonth: true,
                            changeYear: true,
                            yearRange: "-90:+10",
                            onSelect: function(formated, dates) {
                                const datefrom = $("#dateFrom").val();
                                const dateto = $("#dateTo").val();
                                templateObject.getSupplierCrmListDataWithDate(false, datefrom, dateto);
                            },
                            onChangeMonthYear: function(year, month, inst) {
                                // Set date to picker
                                $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
                                // Hide (close) the picker
                                // $(this).datepicker('hide');
                                // // Change ttrigger the on change function
                                // $(this).trigger('change');
                            }
                        });
                        $("#dateFrom").val(fromDate);
                        $("#dateTo").val(toDate);
                    }, 100);
                },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {}
            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getSTPListData = async function(deleteFilter = false) {
        var customerpage = 0;
        getVS1Data('TSTPayrollList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllLeadDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                    await addVS1Data('TSTPayrollList', JSON.stringify(data));
                    templateObject.displaySTPListData(data);
                }).catch(function(err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displaySTPListData(data);
            }
        }).catch(function(err) {
            sideBarService.getAllLeadDataList(initialBaseDataLoad, 0, deleteFilter).then(async function(data) {
                await addVS1Data('TSTPayrollList', JSON.stringify(data));
                templateObject.displaySTPListData(data);
            }).catch(function(err) {

            });
        });
    }
    templateObject.displaySTPListData = async function(data) {
        var splashArrayLeadList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };

        for (let i = 0; i < data.tstpayrolllist.length; i++) {
            let linestatus = '';
            if (data.tstpayrolllist[i].Active == true) {
                linestatus = "";
            } else if (data.tstpayrolllist[i].Active == false) {
                linestatus = "In-Active";
            };

            var dataList = [
                data.tstpayrolllist[i].ClientID || '',
                data.tstpayrolllist[i].Date || '',
                data.tstpayrolllist[i].Earnings || '',
                data.tstpayrolllist[i].Payg || '',
                data.tstpayrolllist[i].Supperannuation || '',
                data.tstpayrolllist[i].NetPay || '',
                data.tstpayrolllist[i].Status || '',
                linestatus,
            ];
            splashArrayLeadList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayLeadList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayLeadList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                    targets: 0,
                    className: "colLeadId colID hiddenColumn",
                    width: "10px",
                    createdCell: function(td, cellData, rowData, row, col) {
                        $(td).closest("tr").attr("id", rowData[0]);
                    }
                },
                    {
                        targets: 1,
                        className: "colTaskID",
                        width: "200px",
                    },
                    {
                        targets: 2,
                        className: "colDate",
                        width: "95px",
                    },
                    {
                        targets: 3,
                        className: "colEarnings",
                        width: "90px",
                    },
                    {
                        targets: 4,
                        className: "colPayg",
                        width: "110px",
                    },
                    {
                        targets: 5,
                        className: "colSupperannuation",
                        width: "80px",
                    },
                    {
                        targets: 6,
                        className: "colNetPay",
                        width: "90px",
                    },
                    {
                        targets: 7,
                        className: "colStatus",
                        width: "90px",
                    },
                ],
                buttons: [{
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "STP List",
                    orientation: 'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                }, {
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'STP List',
                    filename: "STP List",
                    exportOptions: {
                        columns: ':visible',
                        stripHtml: false
                    }
                },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "STP List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        //var splashArrayCustomerListDupp = new Array();
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $('#' + currenttablename + '_filter input').val();

                        sideBarService.getAllLeadDataList(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                            for (let j = 0; j < dataObjectnew.tstpayrolllist.length; j++) {

                                let linestatus = '';
                                if (dataObjectnew.tstpayrolllist[j].Active == true) {
                                    linestatus = "";
                                } else if (dataObjectnew.tstpayrolllist[j].Active == false) {
                                    linestatus = "In-Active";
                                };

                                var dataListDupp = [
                                    data.tstpayrolllist[j].ClientID || '',
                                    data.tstpayrolllist[j].Date || '',
                                    data.tstpayrolllist[j].Earnings || '',
                                    data.tstpayrolllist[j].Payg || '',
                                    data.tstpayrolllist[j].Supperannuation || '',
                                    data.tstpayrolllist[j].NetPay || '',
                                    data.tstpayrolllist[j].Status || '',
                                    linestatus,
                                ];

                                splashArrayLeadList.push(dataListDupp);

                            }
                            let uniqueChars = [...new Set(splashArrayLeadList)];
                            templateObject.transactiondatatablerecords.set(uniqueChars);
                            var datatable = $('#' + currenttablename).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function() {
                                $('#' + currenttablename).dataTable().fnPageChange('last');
                            }, 400);

                            $('.fullScreenSpin').css('display', 'none');

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search ST Payroll..." },
                // "fnInitComplete": function(oSettings) {
                //     if (data.Params.Search.replace(/\s/g, "") == "") {
                //         $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                //     } else {
                //         $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                //     }
                //     $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                // },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.Params.Count || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getBasReturnData = function() {
        let dataTableList = [];
        let months = [];
        months["January"] = "01";
        months["February"] = "02";
        months["March"] = "03";
        months["April"] = "04";
        months["May"] = "05";
        months["June"] = "06";
        months["July"] = "07";
        months["August"] = "08";
        months["September"] = "09";
        months["October"] = "10";
        months["November"] = "11";
        months["December"] = "12";
        $(".fullScreenSpin").css("display", "inline-block");
        getVS1Data('TBASReturn').then(function(dataObject) {
            if (dataObject.length == 0) {
                reportService.getAllBASReturn().then(function(data) {
                    addVS1Data("TBASReturn", JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {});
                    for (let i = 0; i < data.tbasreturn.length; i++) {
                        let tab1startDate = "";
                        let tab1endDate = "";
                        let tab2startDate = "";
                        let tab2endDate = "";
                        let tab3startDate = "";
                        let tab3endDate = "";
                        let tab4startDate = "";
                        let tab4endDate = "";
                        if (data.tbasreturn[i].fields.Tab1_Year > 0 && data.tbasreturn[i].fields.Tab1_Month != "") {
                            tab1startDate = data.tbasreturn[i].fields.Tab1_Year + "-" + months[data.tbasreturn[i].fields.Tab1_Month] + "-01";
                            var endMonth = (data.tbasreturn[i].fields.Tab1_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab1_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab1_Month]);
                            tab1endDate = new Date(data.tbasreturn[i].fields.Tab1_Year, (parseInt(endMonth)), 0);
                            tab1endDate = moment(tab1endDate).format("YYYY-MM-DD");
                        }
                        if (data.tbasreturn[i].fields.Tab2_Year > 0 && data.tbasreturn[i].fields.Tab2_Month != "") {
                            tab2startDate = data.tbasreturn[i].fields.Tab2_Year + "-" + months[data.tbasreturn[i].fields.Tab2_Month] + "-01";
                            var endMonth = (data.tbasreturn[i].fields.Tab2_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab2_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab2_Month]);
                            tab2endDate = new Date(data.tbasreturn[i].fields.Tab2_Year, (parseInt(endMonth)), 0);
                            tab2endDate = moment(tab2endDate).format("YYYY-MM-DD");
                        }
                        if (data.tbasreturn[i].fields.Tab3_Year > 0 && data.tbasreturn[i].fields.Tab3_Month != "") {
                            tab3startDate = data.tbasreturn[i].fields.Tab3_Year + "-" + months[data.tbasreturn[i].fields.Tab3_Month] + "-01";
                            var endMonth = (data.tbasreturn[i].fields.Tab3_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab3_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab3_Month]);
                            tab3endDate = new Date(data.tbasreturn[i].fields.Tab3_Year, (parseInt(endMonth)), 0);
                            tab3endDate = moment(tab3endDate).format("YYYY-MM-DD");
                        }
                        if (data.tbasreturn[i].fields.Tab4_Year > 0 && data.tbasreturn[i].fields.Tab4_Month != "") {
                            tab4startDate = data.tbasreturn[i].fields.Tab4_Year + "-" + months[data.tbasreturn[i].fields.Tab4_Month] + "-01";
                            var endMonth = (data.tbasreturn[i].fields.Tab4_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab4_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab4_Month]);
                            tab4endDate = new Date(data.tbasreturn[i].fields.Tab4_Year, (parseInt(endMonth)), 0);
                            tab4endDate = moment(tab4endDate).format("YYYY-MM-DD");
                        }

                        var dataList = {
                            basnumber: data.tbasreturn[i].fields.ID || '',
                            description: data.tbasreturn[i].fields.BasSheetDesc || '',
                            tab1datemethod: data.tbasreturn[i].fields.Tab1_Type,
                            tab1startDate: tab1startDate,
                            tab1endDate: tab1endDate,
                            tab2datemethod: (tab2startDate != "" && tab2endDate != "") ? data.tbasreturn[i].fields.Tab2_Type : "",
                            tab2startDate: tab2startDate,
                            tab2endDate: tab2endDate,
                            tab2datemethod2: (tab3startDate != "" && tab3endDate != "") ? data.tbasreturn[i].fields.Tab3_Type : "",
                            tab2startDate2: tab3startDate,
                            tab2endDate2: tab3endDate,
                            tab3datemethod: (tab4startDate != "" && tab4endDate != "") ? data.tbasreturn[i].fields.Tab4_Type : "",
                            tab3startDate: tab4startDate,
                            tab3endDate: tab4endDate,
                        };
                        dataTableList.push(dataList);
                    }
                    templateObject.displayBasReturnData(dataTableList);
                    $('.fullScreenSpin').css('display', 'none');
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                for (let i = 0; i < data.tbasreturn.length; i++) {
                    let tab1startDate = "";
                    let tab1endDate = "";
                    let tab2startDate = "";
                    let tab2endDate = "";
                    let tab3startDate = "";
                    let tab3endDate = "";
                    let tab4startDate = "";
                    let tab4endDate = "";
                    if (data.tbasreturn[i].fields.Tab1_Year > 0 && data.tbasreturn[i].fields.Tab1_Month != "") {
                        tab1startDate = data.tbasreturn[i].fields.Tab1_Year + "-" + months[data.tbasreturn[i].fields.Tab1_Month] + "-01";
                        var endMonth = (data.tbasreturn[i].fields.Tab1_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab1_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab1_Month]);
                        tab1endDate = new Date(data.tbasreturn[i].fields.Tab1_Year, (parseInt(endMonth)), 0);
                        tab1endDate = moment(tab1endDate).format("YYYY-MM-DD");
                    }
                    if (data.tbasreturn[i].fields.Tab2_Year > 0 && data.tbasreturn[i].fields.Tab2_Month != "") {
                        tab2startDate = data.tbasreturn[i].fields.Tab2_Year + "-" + months[data.tbasreturn[i].fields.Tab2_Month] + "-01";
                        var endMonth = (data.tbasreturn[i].fields.Tab2_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab2_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab2_Month]);
                        tab2endDate = new Date(data.tbasreturn[i].fields.Tab2_Year, (parseInt(endMonth)), 0);
                        tab2endDate = moment(tab2endDate).format("YYYY-MM-DD");
                    }
                    if (data.tbasreturn[i].fields.Tab3_Year > 0 && data.tbasreturn[i].fields.Tab3_Month != "") {
                        tab3startDate = data.tbasreturn[i].fields.Tab3_Year + "-" + months[data.tbasreturn[i].fields.Tab3_Month] + "-01";
                        var endMonth = (data.tbasreturn[i].fields.Tab3_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab3_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab3_Month]);
                        tab3endDate = new Date(data.tbasreturn[i].fields.Tab3_Year, (parseInt(endMonth)), 0);
                        tab3endDate = moment(tab3endDate).format("YYYY-MM-DD");
                    }
                    if (data.tbasreturn[i].fields.Tab4_Year > 0 && data.tbasreturn[i].fields.Tab4_Month != "") {
                        tab4startDate = data.tbasreturn[i].fields.Tab4_Year + "-" + months[data.tbasreturn[i].fields.Tab4_Month] + "-01";
                        var endMonth = (data.tbasreturn[i].fields.Tab4_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab4_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab4_Month]);
                        tab4endDate = new Date(data.tbasreturn[i].fields.Tab4_Year, (parseInt(endMonth)), 0);
                        tab4endDate = moment(tab4endDate).format("YYYY-MM-DD");
                    }
                    var dataList = {
                        basnumber: data.tbasreturn[i].fields.ID || '',
                        description: data.tbasreturn[i].fields.BasSheetDesc || '',
                        tab1datemethod: data.tbasreturn[i].fields.Tab1_Type,
                        tab1startDate: tab1startDate,
                        tab1endDate: tab1endDate,
                        tab2datemethod: data.tbasreturn[i].fields.Tab2_Type,
                        tab2startDate: tab2startDate,
                        tab2endDate: tab2endDate,
                        tab2datemethod2: data.tbasreturn[i].fields.Tab3_Type,
                        tab2startDate2: tab3startDate,
                        tab2endDate2: tab3endDate,
                        tab3datemethod: data.tbasreturn[i].fields.Tab4_Type,
                        tab3startDate: tab4startDate,
                        tab3endDate: tab4endDate,
                    };
                    dataTableList.push(dataList);
                }
                templateObject.displayBasReturnData(dataTableList);
                $('.fullScreenSpin').css('display', 'none');
            }
        }).catch(function(err) {
            reportService.getAllBASReturn().then(function(data) {
                addVS1Data("TBASReturn", JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {});
                for (let i = 0; i < data.tbasreturn.length; i++) {
                    let tab1startDate = "";
                    let tab1endDate = "";
                    let tab2startDate = "";
                    let tab2endDate = "";
                    let tab3startDate = "";
                    let tab3endDate = "";
                    let tab4startDate = "";
                    let tab4endDate = "";
                    if (data.tbasreturn[i].fields.Tab1_Year > 0 && data.tbasreturn[i].fields.Tab1_Month != "") {
                        tab1startDate = data.tbasreturn[i].fields.Tab1_Year + "-" + months[data.tbasreturn[i].fields.Tab1_Month] + "-01";
                        var endMonth = (data.tbasreturn[i].fields.Tab1_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab1_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab1_Month]);
                        tab1endDate = new Date(data.tbasreturn[i].fields.Tab1_Year, (parseInt(endMonth)), 0);
                        tab1endDate = moment(tab1endDate).format("YYYY-MM-DD");
                    }
                    if (data.tbasreturn[i].fields.Tab2_Year > 0 && data.tbasreturn[i].fields.Tab2_Month != "") {
                        tab2startDate = data.tbasreturn[i].fields.Tab2_Year + "-" + months[data.tbasreturn[i].fields.Tab2_Month] + "-01";
                        var endMonth = (data.tbasreturn[i].fields.Tab2_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab2_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab2_Month]);
                        tab2endDate = new Date(data.tbasreturn[i].fields.Tab2_Year, (parseInt(endMonth)), 0);
                        tab2endDate = moment(tab2endDate).format("YYYY-MM-DD");
                    }
                    if (data.tbasreturn[i].fields.Tab3_Year > 0 && data.tbasreturn[i].fields.Tab3_Month != "") {
                        tab3startDate = data.tbasreturn[i].fields.Tab3_Year + "-" + months[data.tbasreturn[i].fields.Tab3_Month] + "-01";
                        var endMonth = (data.tbasreturn[i].fields.Tab3_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab3_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab3_Month]);
                        tab3endDate = new Date(data.tbasreturn[i].fields.Tab3_Year, (parseInt(endMonth)), 0);
                        tab3endDate = moment(tab3endDate).format("YYYY-MM-DD");
                    }
                    if (data.tbasreturn[i].fields.Tab4_Year > 0 && data.tbasreturn[i].fields.Tab4_Month != "") {
                        tab4startDate = data.tbasreturn[i].fields.Tab4_Year + "-" + months[data.tbasreturn[i].fields.Tab4_Month] + "-01";
                        var endMonth = (data.tbasreturn[i].fields.Tab4_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tbasreturn[i].fields.Tab4_Month]) / 3) * 3) : (months[data.tbasreturn[i].fields.Tab4_Month]);
                        tab4endDate = new Date(data.tbasreturn[i].fields.Tab4_Year, (parseInt(endMonth)), 0);
                        tab4endDate = moment(tab4endDate).format("YYYY-MM-DD");
                    }

                    var dataList = {
                        basnumber: data.tbasreturn[i].fields.ID || '',
                        description: data.tbasreturn[i].fields.BasSheetDesc || '',
                        tab1datemethod: data.tbasreturn[i].fields.Tab1_Type,
                        tab1startDate: tab1startDate,
                        tab1endDate: tab1endDate,
                        tab2datemethod: (tab2startDate != "" && tab2endDate != "") ? data.tbasreturn[i].fields.Tab2_Type : "",
                        tab2startDate: tab2startDate,
                        tab2endDate: tab2endDate,
                        tab2datemethod2: (tab3startDate != "" && tab3endDate != "") ? data.tbasreturn[i].fields.Tab3_Type : "",
                        tab2startDate2: tab3startDate,
                        tab2endDate2: tab3endDate,
                        tab3datemethod: (tab4startDate != "" && tab4endDate != "") ? data.tbasreturn[i].fields.Tab4_Type : "",
                        tab3startDate: tab4startDate,
                        tab3endDate: tab4endDate,
                    };
                    dataTableList.push(dataList);
                }
                templateObject.displayBasReturnData(dataTableList);
                $('.fullScreenSpin').css('display', 'none');
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        });
    }

    templateObject.displayBasReturnData = async function(data){
        var splashArrayLeadList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        // if (data.Params.Search.replace(/\s/g, "") == "") {
        //     deleteFilter = true;
        // } else {
        //     deleteFilter = false;
        // };

        for (let i = 0; i < data.length; i++) {
            let linestatus = '';
            // if (data[i].Active == true) {
            //     linestatus = "";
            // } else if (data[i].Active == false) {
            //     linestatus = "In-Active";
            // };

            var dataList = [
                data[i].basnumber || '',
                data[i].description || '',
                data[i].tab1datemethod || '',
                data[i].tab1startDate || '',
                data[i].tab1endDate || '',
                data[i].tab2datemethod || '',
                data[i].tab2startDate || '',
                data[i].tab2endDate || '',
                data[i].tab2datemethod2 || '',
                data[i].tab2startDate2 || '',
                data[i].tab2endDate2 || '',
            ];
            splashArrayLeadList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayLeadList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayLeadList,
                "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colBasNumber",
                        width: "80px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colBasName",
                        width: "250px",
                    },
                    {
                        targets: 2,
                        className: "t1Period",
                        width: "100px",
                    },
                    {
                        targets: 3,
                        className: "t1From",
                        width: "120px",
                    },
                    {
                        targets: 4,
                        className: "t1To",
                        width: "120px",
                    },
                    {
                        targets: 5,
                        className: "t2Period",
                        width: "100px",
                    },
                    {
                        targets: 6,
                        className: "t2From",
                        width: "120px",
                    },
                    {
                        targets: 7,
                        className: "t2To",
                        width: "120px",
                    },
                    {
                        targets: 8,
                        className: "t3Period",
                        width: "100px",
                    },
                    {
                        targets: 9,
                        className: "t3From",
                        width: "120px",
                    },
                    {
                        targets: 10,
                        className: "t3To",
                        width: "120px",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "STP List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'STP List',
                        filename: "STP List",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "STP List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search ST Payroll..." },
                // "fnInitComplete": function(oSettings) {
                //     if (data.Params.Search.replace(/\s/g, "") == "") {
                //         $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                //     } else {
                //         $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                //     }
                //     $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                // },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.length || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);
       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }

    templateObject.getVatReturnData = function() {
        let dataTableList = [];
        let months = [];
        months["January"] = "01";
        months["February"] = "02";
        months["March"] = "03";
        months["April"] = "04";
        months["May"] = "05";
        months["June"] = "06";
        months["July"] = "07";
        months["August"] = "08";
        months["September"] = "09";
        months["October"] = "10";
        months["November"] = "11";
        months["December"] = "12";
        $(".fullScreenSpin").css("display", "inline-block");
        getVS1Data('TVATReturn').then(function(dataObject) {
            if (dataObject.length == 0) {
                reportService.getAllVATReturn().then(function(data) {
                    addVS1Data("TVATReturn", JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {});
                    for (let i = 0; i < data.tvatreturn.length; i++) {
                        let tab1startDate = "";
                        let tab1endDate = "";
                        let tab2startDate = "";
                        let tab2endDate = "";
                        let tab3startDate = "";
                        let tab3endDate = "";
                        if (data.tvatreturn[i].fields.Tab1_Year > 0 && data.tvatreturn[i].fields.Tab1_Month != "") {
                            tab1startDate = data.tvatreturn[i].fields.Tab1_Year + "-" + months[data.tvatreturn[i].fields.Tab1_Month] + "-01";
                            var endMonth = (data.tvatreturn[i].fields.Tab1_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tvatreturn[i].fields.Tab1_Month]) / 3) * 3) : (months[data.tvatreturn[i].fields.Tab1_Month]);
                            tab1endDate = new Date(data.tvatreturn[i].fields.Tab1_Year, (parseInt(endMonth)), 0);
                            tab1endDate = moment(tab1endDate).format("YYYY-MM-DD");
                        }
                        if (data.tvatreturn[i].fields.Tab2_Year > 0 && data.tvatreturn[i].fields.Tab2_Month != "") {
                            tab2startDate = data.tvatreturn[i].fields.Tab2_Year + "-" + months[data.tvatreturn[i].fields.Tab2_Month] + "-01";
                            var endMonth = (data.tvatreturn[i].fields.Tab2_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tvatreturn[i].fields.Tab2_Month]) / 3) * 3) : (months[data.tvatreturn[i].fields.Tab2_Month]);
                            tab2endDate = new Date(data.tvatreturn[i].fields.Tab2_Year, (parseInt(endMonth)), 0);
                            tab2endDate = moment(tab2endDate).format("YYYY-MM-DD");
                        }
                        if (data.tvatreturn[i].fields.Tab3_Year > 0 && data.tvatreturn[i].fields.Tab3_Month != "") {
                            tab3startDate = data.tvatreturn[i].fields.Tab3_Year + "-" + months[data.tvatreturn[i].fields.Tab3_Month] + "-01";
                            var endMonth = (data.tvatreturn[i].fields.Tab3_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tvatreturn[i].fields.Tab3_Month]) / 3) * 3) : (months[data.tvatreturn[i].fields.Tab3_Month]);
                            tab3endDate = new Date(data.tvatreturn[i].fields.Tab3_Year, (parseInt(endMonth)), 0);
                            tab3endDate = moment(tab3endDate).format("YYYY-MM-DD");
                        }
       
                        var dataList = {
                            basnumber: data.tvatreturn[i].fields.ID || '',
                            description: data.tvatreturn[i].fields.VatSheetDesc || '',
                            tab1datemethod: data.tvatreturn[i].fields.Tab1_Type,
                            tab1startDate: tab1startDate,
                            tab1endDate: tab1endDate,
                            tab2datemethod: (tab2startDate != "" && tab2endDate != "") ? data.tvatreturn[i].fields.Tab2_Type : "",
                            tab2startDate: tab2startDate,
                            tab2endDate: tab2endDate,
                            tab3datemethod: (tab3startDate != "" && tab3endDate != "") ? data.tvatreturn[i].fields.Tab3_Type : "",
                            tab3startDate: tab4startDate,
                            tab3endDate: tab4endDate,
                        };
                        dataTableList.push(dataList);
                    }
                    templateObject.displayVatReturnData(dataTableList);
                    $('.fullScreenSpin').css('display', 'none');
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                for (let i = 0; i < data.tvatreturn.length; i++) {
                    let tab1startDate = "";
                    let tab1endDate = "";
                    let tab2startDate = "";
                    let tab2endDate = "";
                    let tab3startDate = "";
                    let tab3endDate = "";
                    if (data.tvatreturns[i].fields.Tab1_Year > 0 && data.tvatreturns[i].fields.Tab1_Month != "") {
                        tab1startDate = data.tvatreturns[i].fields.Tab1_Year + "-" + months[data.tvatreturns[i].fields.Tab1_Month] + "-01";
                        var endMonth = (data.tvatreturns[i].fields.Tab1_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tvatreturns[i].fields.Tab1_Month]) / 3) * 3) : (months[data.tvatreturns[i].fields.Tab1_Month]);
                        tab1endDate = new Date(data.tvatreturns[i].fields.Tab1_Year, (parseInt(endMonth)), 0);
                        tab1endDate = moment(tab1endDate).format("YYYY-MM-DD");
                    }
                    if (data.tvatreturns[i].fields.Tab2_Year > 0 && data.tvatreturn[i].fields.Tab2_Month != "") {
                        tab2startDate = data.tvatreturns[i].fields.Tab2_Year + "-" + months[data.tvatreturns[i].fields.Tab2_Month] + "-01";
                        var endMonth = (data.tvatreturns[i].fields.Tab2_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tvatreturns[i].fields.Tab2_Month]) / 3) * 3) : (months[data.tvatreturns[i].fields.Tab2_Month]);
                        tab2endDate = new Date(data.tvatreturns[i].fields.Tab2_Year, (parseInt(endMonth)), 0);
                        tab2endDate = moment(tab2endDate).format("YYYY-MM-DD");
                    }
                    if (data.tvatreturns[i].fields.Tab3_Year > 0 && data.tvatreturns[i].fields.Tab3_Month != "") {
                        tab3startDate = data.tvatreturns[i].fields.Tab3_Year + "-" + months[data.tvatreturns[i].fields.Tab3_Month] + "-01";
                        var endMonth = (data.tvatreturns[i].fields.Tab3_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tvatreturns[i].fields.Tab3_Month]) / 3) * 3) : (months[data.tvatreturns[i].fields.Tab3_Month]);
                        tab3endDate = new Date(data.tvatreturns[i].fields.Tab3_Year, (parseInt(endMonth)), 0);
                        tab3endDate = moment(tab3endDate).format("YYYY-MM-DD");
                    }
                    var dataList = {
                        basnumber: data.tvatreturns[i].fields.ID || '',
                        description: data.tvatreturns[i].fields.BasSheetDesc || '',
                        tab1datemethod: data.tvatreturns[i].fields.Tab1_Type,
                        tab1startDate: tab1startDate,
                        tab1endDate: tab1endDate,
                        tab2datemethod: data.tvatreturns[i].fields.Tab2_Type,
                        tab2startDate: tab2startDate,
                        tab2endDate: tab2endDate,
                        tab3datemethod: data.tvatreturns[i].fields.Tab3_Type,
                        tab3startDate: tab3startDate,
                        tab3endDate: tab3endDate,
                    };
                    dataTableList.push(dataList);
                }
                templateObject.displayVatReturnData(dataTableList);
                $('.fullScreenSpin').css('display', 'none');
            }
        }).catch(function(err) {
            reportService.getAllVATReturn().then(function(data) {
                addVS1Data("TVATReturn", JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {});
                for (let i = 0; i < data.tvatreturn.length; i++) {
                    let tab1startDate = "";
                    let tab1endDate = "";
                    let tab2startDate = "";
                    let tab2endDate = "";
                    let tab3startDate = "";
                    let tab3endDate = "";
                    if (data.tvatreturn[i].fields.Tab1_Year > 0 && data.tvatreturn[i].fields.Tab1_Month != "") {
                        tab1startDate = data.tvatreturn[i].fields.Tab1_Year + "-" + months[data.tvatreturn[i].fields.Tab1_Month] + "-01";
                        var endMonth = (data.tvatreturn[i].fields.Tab1_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tvatreturn[i].fields.Tab1_Month]) / 3) * 3) : (months[data.tvatreturn[i].fields.Tab1_Month]);
                        tab1endDate = new Date(data.tvatreturn[i].fields.Tab1_Year, (parseInt(endMonth)), 0);
                        tab1endDate = moment(tab1endDate).format("YYYY-MM-DD");
                    }
                    if (data.tvatreturn[i].fields.Tab2_Year > 0 && data.tvatreturn[i].fields.Tab2_Month != "") {
                        tab2startDate = data.tvatreturn[i].fields.Tab2_Year + "-" + months[data.tvatreturn[i].fields.Tab2_Month] + "-01";
                        var endMonth = (data.tvatreturn[i].fields.Tab2_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tvatreturn[i].fields.Tab2_Month]) / 3) * 3) : (months[data.tvatreturn[i].fields.Tab2_Month]);
                        tab2endDate = new Date(data.tvatreturn[i].fields.Tab2_Year, (parseInt(endMonth)), 0);
                        tab2endDate = moment(tab2endDate).format("YYYY-MM-DD");
                    }
                    if (data.tvatreturn[i].fields.Tab3_Year > 0 && data.tvatreturn[i].fields.Tab3_Month != "") {
                        tab3startDate = data.tvatreturn[i].fields.Tab3_Year + "-" + months[data.tvatreturn[i].fields.Tab3_Month] + "-01";
                        var endMonth = (data.tvatreturn[i].fields.Tab3_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.tvatreturn[i].fields.Tab3_Month]) / 3) * 3) : (months[data.tvatreturn[i].fields.Tab3_Month]);
                        tab3endDate = new Date(data.tvatreturn[i].fields.Tab3_Year, (parseInt(endMonth)), 0);
                        tab3endDate = moment(tab3endDate).format("YYYY-MM-DD");
                    }
   
                    var dataList = {
                        basnumber: data.tvatreturn[i].fields.ID || '',
                        description: data.tvatreturn[i].fields.VatSheetDesc || '',
                        tab1datemethod: data.tvatreturn[i].fields.Tab1_Type,
                        tab1startDate: tab1startDate,
                        tab1endDate: tab1endDate,
                        tab2datemethod: (tab2startDate != "" && tab2endDate != "") ? data.tvatreturn[i].fields.Tab2_Type : "",
                        tab2startDate: tab2startDate,
                        tab2endDate: tab2endDate,
                        tab3datemethod: (tab3startDate != "" && tab3endDate != "") ? data.tvatreturn[i].fields.Tab3_Type : "",
                        tab3startDate: tab4startDate,
                        tab3endDate: tab4endDate,
                    };
                    dataTableList.push(dataList);
                }
                templateObject.displayVatReturnData(dataTableList);
                $('.fullScreenSpin').css('display', 'none');
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        });
    }

    templateObject.displayVatReturnData = async function(data){
        var splashArrayLeadList = new Array();
        let lineItems = [];
        let lineItemObj = {};
        let deleteFilter = false;
        // if (data.Params.Search.replace(/\s/g, "") == "") {
        //     deleteFilter = true;
        // } else {
        //     deleteFilter = false;
        // };

        for (let i = 0; i < data.length; i++) {
            let linestatus = '';
            // if (data[i].Active == true) {
            //     linestatus = "";
            // } else if (data[i].Active == false) {
            //     linestatus = "In-Active";
            // };

            var dataList = [
                data[i].vatnumber || '',
                data[i].description || '',
                data[i].tab1datemethod || '',
                data[i].tab1startDate || '',
                data[i].tab1endDate || '',
                data[i].tab2datemethod || '',
                data[i].tab2startDate || '',
                data[i].tab2endDate || '',
                data[i].tab3datemethod || '',
                data[i].tab3startDate || '',
                data[i].tab3endDate || '',
            ];
            splashArrayLeadList.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayLeadList);
        }

        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            $('#' + currenttablename).DataTable({
                data: splashArrayLeadList,
                "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        targets: 0,
                        className: "colVatNumber",
                        width: "80px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        targets: 1,
                        className: "colVatName",
                        width: "250px",
                    },
                    {
                        targets: 2,
                        className: "t1Period",
                        width: "100px",
                    },
                    {
                        targets: 3,
                        className: "t1From",
                        width: "120px",
                    },
                    {
                        targets: 4,
                        className: "t1To",
                        width: "120px",
                    },
                    {
                        targets: 5,
                        className: "t2Period",
                        width: "100px",
                    },
                    {
                        targets: 6,
                        className: "t2From",
                        width: "120px",
                    },
                    {
                        targets: 7,
                        className: "t2To",
                        width: "120px",
                    },
                    {
                        targets: 8,
                        className: "t3Period",
                        width: "100px",
                    },
                    {
                        targets: 9,
                        className: "t3From",
                        width: "120px",
                    },
                    {
                        targets: 10,
                        className: "t3To",
                        width: "120px",
                    },
                ],
                buttons: [{
                        extend: 'csvHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "STP List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'STP List',
                        filename: "STP List",
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "STP List",
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }

                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                action: function() {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#' + currenttablename + '_ellipsis').addClass('disabled');
                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {

                        }
                    } else {

                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                    });
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "", searchPlaceholder: "Search ST Payroll..." },
                // "fnInitComplete": function(oSettings) {
                //     if (data.Params.Search.replace(/\s/g, "") == "") {
                //         $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                //     } else {
                //         $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                //     }
                //     $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
                // },
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data.length || 0; //get count from API data

                    return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                }

            }).on('page', function() {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function() {

            }).on('length.dt', function(e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);
       setTimeout(function() {$('div.dataTables_filter input').addClass('form-control form-control-sm');}, 0);
    }
    // Get ServiceLogList
    templateObject.getServiceLogData = function () {
      getVS1Data("TServiceLogList").then(function (dataObject) {
        if (dataObject.length == 0) {
          fixedAssetService.getServiceLogList().then(function (data) {
            templateObject.setServiceLogList(data);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          templateObject.setServiceLogList(data);
        }
      }).catch(function (err) {
        fixedAssetService.getServiceLogList().then(function (data) {
            templateObject.setServiceLogList(data);
          });
      });
    };
    
    templateObject.setServiceLogList = function (data) {
      addVS1Data('TServiceLogList', JSON.stringify(data));
      const dataTableList = new Array();;
  
      for (const log of data.tserviceloglist) {
        const dataList = [
          log.ServiceID || "",
          log.AssetCode || "",
          log.AssetName || "",
          log.ServiceType || "",
          log.ServiceDate || "",
          log.ServiceProvider || "",
          log.NextServiceDate || "",
          log.Done ? 'Completed' : 'Pending',
        ];
        dataTableList.push(dataList);
      }
      templateObject.transactiondatatablerecords.set(dataTableList);

      if (templateObject.transactiondatatablerecords.get()) {
        setTimeout(function() {
            MakeNegative();
        }, 100);
      }

      setTimeout(function() {
        $('#' + currenttablename).DataTable({
            data: dataTableList,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            columnDefs: [
              {
                  targets: 0,
                  className: "colServiceLogID",
                  width: "10px",
                  createdCell: function(td, cellData, rowData, row, col) {
                    $(td).closest("tr").attr("id", rowData[0]);
                  }
              },
              {
                  targets: 1,
                  className: "assetCode",
                  width: "200px",
              },
              {
                  targets: 2,
                  className: "assetName",
                  width: "200px",
              },
              {
                  targets: 3,
                  className: "serviceType",
                  width: "150px",
              },
              {
                  targets: 4,
                  className: "serviceDate",
                  width: "150px",
              },
              {
                  targets: 5,
                  className: "serviceProvider",
                  width: "150px",
              },
              {
                  targets: 6,
                  className: "nextServiceDate",
                  width: "150px",
              },
              {
                  targets: 7,
                  className: "status",
                  width: "150px",
              }
            ],
            buttons: [
              {
                extend: 'csvHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "Customer Type Settings",
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
              }, {
                  extend: 'print',
                  download: 'open',
                  className: "btntabletopdf hiddenColumn",
                  text: '',
                  title: 'Customer Type Settings',
                  filename: "Customer Type Settings",
                  exportOptions: {
                      columns: ':visible',
                      stripHtml: false
                  }
              },
              {
                  extend: 'excelHtml5',
                  title: '',
                  download: 'open',
                  className: "btntabletoexcel hiddenColumn",
                  filename: "Customer Type Settings",
                  orientation: 'portrait',
                  exportOptions: {
                      columns: ':visible'
                  }

              }
            ],
            select: true,
            destroy: true,
            colReorder: true,
            pageLength: initialDatatableLoad,
            lengthMenu: [
                [initialDatatableLoad, -1],
                [initialDatatableLoad, "All"]
            ],
            info: true,
            responsive: true,
            "order": [
                [1, "asc"]
            ],
            action: function() {
                $('#' + currenttablename).DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
              $('.paginate_button.page-item').removeClass('disabled');
              $('#' + currenttablename + '_ellipsis').addClass('disabled');
              if (oSettings._iDisplayLength == -1) {
                  if (oSettings.fnRecordsDisplay() > 150) {

                  }
              } else {

              }
              if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                  $('.paginate_button.page-item.next').addClass('disabled');
              }

              $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                  $('.fullScreenSpin').css('display', 'inline-block');
                  //var splashArrayCustomerListDupp = new Array();
                  let dataLenght = oSettings._iDisplayLength;
                  let customerSearch = $('#' + currenttablename + '_filter input').val();

                  // sideBarService.getAllTAccountVS1List(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                  //     for (let j = 0; j < dataObjectnew.taccountvs1list.length; j++) {
                  //         if (!isNaN(dataObjectnew.taccountvs1list[j].Balance)) {
                  //             accBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.taccountvs1list[j].Balance) || 0.0;
                  //         } else {
                  //             accBalance = Currency + "0.00";
                  //         }
                  //         if (dataObjectnew.taccountvs1list[j].ReceiptCategory && dataObjectnew.taccountvs1list[j].ReceiptCategory != '') {
                  //             usedCategories.push(dataObjectnew.taccountvs1list[j].fields);
                  //         }
                  //         let linestatus = '';
                  //         if (dataObjectnew.taccountvs1list[j].Active == true) {
                  //             linestatus = "";
                  //         } else if (dataObjectnew.taccountvs1list[j].Active == false) {
                  //             linestatus = "In-Active";
                  //         };


                  //         var dataListDupp = [
                  //             dataObjectnew.taccountvs1list[j].AccountID || "",
                  //             dataObjectnew.taccountvs1list[j].AccountName || "",
                  //             dataObjectnew.taccountvs1list[j].Description || "",
                  //             dataObjectnew.taccountvs1list[j].AccountNumber || "",
                  //             dataObjectnew.taccountvs1list[j].AccountType || "",
                  //             accBalance || '',
                  //             dataObjectnew.taccountvs1list[j].TaxCode || '',
                  //             dataObjectnew.taccountvs1list[j].BankName || '',
                  //             dataObjectnew.taccountvs1list[j].BankAccountName || '',
                  //             dataObjectnew.taccountvs1list[j].BSB || '',
                  //             dataObjectnew.taccountvs1list[j].BankAccountNumber || "",
                  //             dataObjectnew.taccountvs1list[j].CarNumber || "",
                  //             dataObjectnew.taccountvs1list[j].ExpiryDate || "",
                  //             dataObjectnew.taccountvs1list[j].CVC || "",
                  //             dataObjectnew.taccountvs1list[j].Extra || "",
                  //             dataObjectnew.taccountvs1list[j].BankNumber || "",
                  //             dataObjectnew.taccountvs1list[j].IsHeader || false,
                  //             dataObjectnew.taccountvs1list[j].AllowExpenseClaim || false,
                  //             dataObjectnew.taccountvs1list[j].ReceiptCategory || "",
                  //             linestatus,
                  //         ];

                  //         splashArrayAccountsOverview.push(dataListDupp);
                  //         //}
                  //     }
                  //     let uniqueChars = [...new Set(splashArrayAccountsOverview)];
                  //     templateObject.transactiondatatablerecords.set(uniqueChars);
                  //     var datatable = $('#' + currenttablename).DataTable();
                  //     datatable.clear();
                  //     datatable.rows.add(uniqueChars);
                  //     datatable.draw(false);
                  //     setTimeout(function() {
                  //         $('#' + currenttablename).dataTable().fnPageChange('last');
                  //     }, 400);

                  //     $('.fullScreenSpin').css('display', 'none');

                  // }).catch(function(err) {
                  //     $('.fullScreenSpin').css('display', 'none');
                  // });

              });
              setTimeout(function() {
                  MakeNegative();
              }, 100);
            },
            language: { search: "", searchPlaceholder: "Search List..." },
            "fnInitComplete": function(oSettings) {
                // if (deleteFilter) {
                //     $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                // } else {
                //     $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                // }
                // $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
            },
            "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                // let countTableData = data.Params.Count || 0; //get count from API data
                //
                // return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
            }

        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }).on('column-reorder', function() {

        }).on('length.dt', function(e, settings, len) {

            $(".fullScreenSpin").css("display", "inline-block");
            let dataLenght = settings._iDisplayLength;
            if (dataLenght == -1) {
                if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                    $(".fullScreenSpin").css("display", "none");
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
            } else {
                $(".fullScreenSpin").css("display", "none");
            }
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });
        $(".fullScreenSpin").css("display", "none");
    }, 0);

    $('div.dataTables_filter input').addClass('form-control form-control-sm');
    };

    // Get AssetRegisterList
    templateObject.getAssetRegisterData = function () {
      getVS1Data("TFixedAssets").then(function (dataObject) {
        if (dataObject.length == 0) {
          fixedAssetService.getTFixedAssetsList().then(function (data) {
            templateObject.setAssetRegisterList(data);
          }).catch(function (err) {
            $(".fullScreenSpin").css("display", "none");
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          templateObject.setAssetRegisterList(data);
        }
      }).catch(function (err) {
        fixedAssetService.getTFixedAssetsList().then(function (data) {
          templateObject.setAssetRegisterList(data);
        }).catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
      });
    };
    
    templateObject.setAssetRegisterList = function (data) {
      addVS1Data('TFixedAssets', JSON.stringify(data));
      const dataTableList = new Array();
      for (const asset of data.tfixedassets) {
        const dataList = [
          asset.fields.ID || "",
          asset.fields.AssetCode || "",
          asset.fields.AssetName || "",
          asset.fields.Description || "",
          asset.fields.AssetType || "",
          asset.fields.BrandName || "",
          asset.fields.Model || "",
          asset.fields.CUSTFLD1 || "",
          asset.fields.CUSTFLD2 || "",
          asset.fields.CUSTFLD3 || "",
          asset.fields.CUSTFLD4 || "",
          asset.fields.CUSTFLD5 || "",
          asset.fields.PurchDate ? moment(asset.fields.PurchDate).format("DD/MM/YYYY") : "",
          asset.fields.PurchCost || "",
          "",
          asset.fields.CUSTDATE1 ? moment(asset.fields.CUSTDATE1).format("DD/MM/YYYY") : "",
          '',
          asset.fields.DepreciationStartDate ? moment(asset.fields.DepreciationStartDate).format("DD/MM/YYYY") : ""
        ];
        dataTableList.push(dataList);
      }
      $(".fullScreenSpin").css("display", "none");
      templateObject.transactiondatatablerecords.set(dataTableList);

      if (templateObject.transactiondatatablerecords.get()) {
        setTimeout(function() {
            MakeNegative();
        }, 100);
      }
      let columnData = [];
      let displayfields = templateObject.non_trans_displayfields.get();
      if( displayfields.length > 0 ){
          displayfields.forEach(function( item ){
            if (item.id == 0) {
              columnData.push({
                className: ( item.display )? item.class : `col${item.class} hiddenColumn`,
                targets: item.id,
                width: "10px",
                createdCell: function(td, cellData, rowData, row, col) {
                  $(td).closest("tr").attr("id", rowData[0]);
                }
              })
            }
            else {
              columnData.push({
                  className: ( item.display )? item.class : `col${item.class} hiddenColumn`,
                  targets: item.id,
              })
            }
          });
      }
      setTimeout(function() {
        $('#' + currenttablename).DataTable({
            data: dataTableList,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            columnDefs: columnData,
            buttons: [
              // {
              //   extend: 'csvHtml5',
              //   text: '',
              //   download: 'open',
              //   className: "btntabletocsv hiddenColumn",
              //   filename: "Customer Type Settings",
              //   orientation: 'portrait',
              //   exportOptions: {
              //       columns: ':visible'
              //   }
              // }, {
              //     extend: 'print',
              //     download: 'open',
              //     className: "btntabletopdf hiddenColumn",
              //     text: '',
              //     title: 'Customer Type Settings',
              //     filename: "Customer Type Settings",
              //     exportOptions: {
              //         columns: ':visible',
              //         stripHtml: false
              //     }
              // },
              // {
              //     extend: 'excelHtml5',
              //     title: '',
              //     download: 'open',
              //     className: "btntabletoexcel hiddenColumn",
              //     filename: "Customer Type Settings",
              //     orientation: 'portrait',
              //     exportOptions: {
              //         columns: ':visible'
              //     }

              // }
            ],
            select: true,
            destroy: true,
            colReorder: true,
            pageLength: initialDatatableLoad,
            lengthMenu: [
                [initialDatatableLoad, -1],
                [initialDatatableLoad, "All"]
            ],
            info: true,
            responsive: true,
            "order": [
                [1, "asc"]
            ],
            action: function() {
                $('#' + currenttablename).DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
              $('.paginate_button.page-item').removeClass('disabled');
              $('#' + currenttablename + '_ellipsis').addClass('disabled');
              if (oSettings._iDisplayLength == -1) {
                  if (oSettings.fnRecordsDisplay() > 150) {

                  }
              } else {

              }
              if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                  $('.paginate_button.page-item.next').addClass('disabled');
              }

              $('.paginate_button.next:not(.disabled)', this.api().table().container()).on('click', function() {
                  $('.fullScreenSpin').css('display', 'inline-block');
                  //var splashArrayCustomerListDupp = new Array();
                  let dataLenght = oSettings._iDisplayLength;
                  let customerSearch = $('#' + currenttablename + '_filter input').val();

                  // sideBarService.getAllTAccountVS1List(initialDatatableLoad, oSettings.fnRecordsDisplay(), deleteFilter).then(function(dataObjectnew) {

                  //     for (let j = 0; j < dataObjectnew.taccountvs1list.length; j++) {
                  //         if (!isNaN(dataObjectnew.taccountvs1list[j].Balance)) {
                  //             accBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.taccountvs1list[j].Balance) || 0.0;
                  //         } else {
                  //             accBalance = Currency + "0.00";
                  //         }
                  //         if (dataObjectnew.taccountvs1list[j].ReceiptCategory && dataObjectnew.taccountvs1list[j].ReceiptCategory != '') {
                  //             usedCategories.push(dataObjectnew.taccountvs1list[j].fields);
                  //         }
                  //         let linestatus = '';
                  //         if (dataObjectnew.taccountvs1list[j].Active == true) {
                  //             linestatus = "";
                  //         } else if (dataObjectnew.taccountvs1list[j].Active == false) {
                  //             linestatus = "In-Active";
                  //         };


                  //         var dataListDupp = [
                  //             dataObjectnew.taccountvs1list[j].AccountID || "",
                  //             dataObjectnew.taccountvs1list[j].AccountName || "",
                  //             dataObjectnew.taccountvs1list[j].Description || "",
                  //             dataObjectnew.taccountvs1list[j].AccountNumber || "",
                  //             dataObjectnew.taccountvs1list[j].AccountType || "",
                  //             accBalance || '',
                  //             dataObjectnew.taccountvs1list[j].TaxCode || '',
                  //             dataObjectnew.taccountvs1list[j].BankName || '',
                  //             dataObjectnew.taccountvs1list[j].BankAccountName || '',
                  //             dataObjectnew.taccountvs1list[j].BSB || '',
                  //             dataObjectnew.taccountvs1list[j].BankAccountNumber || "",
                  //             dataObjectnew.taccountvs1list[j].CarNumber || "",
                  //             dataObjectnew.taccountvs1list[j].ExpiryDate || "",
                  //             dataObjectnew.taccountvs1list[j].CVC || "",
                  //             dataObjectnew.taccountvs1list[j].Extra || "",
                  //             dataObjectnew.taccountvs1list[j].BankNumber || "",
                  //             dataObjectnew.taccountvs1list[j].IsHeader || false,
                  //             dataObjectnew.taccountvs1list[j].AllowExpenseClaim || false,
                  //             dataObjectnew.taccountvs1list[j].ReceiptCategory || "",
                  //             linestatus,
                  //         ];

                  //         splashArrayAccountsOverview.push(dataListDupp);
                  //         //}
                  //     }
                  //     let uniqueChars = [...new Set(splashArrayAccountsOverview)];
                  //     templateObject.transactiondatatablerecords.set(uniqueChars);
                  //     var datatable = $('#' + currenttablename).DataTable();
                  //     datatable.clear();
                  //     datatable.rows.add(uniqueChars);
                  //     datatable.draw(false);
                  //     setTimeout(function() {
                  //         $('#' + currenttablename).dataTable().fnPageChange('last');
                  //     }, 400);

                  //     $('.fullScreenSpin').css('display', 'none');

                  // }).catch(function(err) {
                  //     $('.fullScreenSpin').css('display', 'none');
                  // });

              });
              setTimeout(function() {
                  MakeNegative();
              }, 100);
            },
            language: { search: "", searchPlaceholder: "Search List..." },
            "fnInitComplete": function(oSettings) {
                // if (deleteFilter) {
                //     $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                // } else {
                //     $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View In-Active</button>").insertAfter('#' + currenttablename + '_filter');
                // }
                // $("<button class='btn btn-primary btnRefreshList' type='button' id='btnRefreshList' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter('#' + currenttablename + '_filter');
            },
            "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                // let countTableData = data.Params.Count || 0; //get count from API data
                //
                // return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
            }

        }).on('page', function() {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }).on('column-reorder', function() {

        }).on('length.dt', function(e, settings, len) {

            $(".fullScreenSpin").css("display", "inline-block");
            let dataLenght = settings._iDisplayLength;
            if (dataLenght == -1) {
                if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                    $(".fullScreenSpin").css("display", "none");
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
            } else {
                $(".fullScreenSpin").css("display", "none");
            }
            setTimeout(function() {
                MakeNegative();
            }, 100);
        });
        $(".fullScreenSpin").css("display", "none");
      } , 0);
      $('div.dataTables_filter input').addClass('form-control form-control-sm');
    };
  //Check URL to make right call.
  if (currenttablename == "tblcontactoverview" || currenttablename == "tblContactlist") {
      templateObject.getContactOverviewData();
  } else if (currenttablename == "tblEmployeelist") {
      templateObject.getEmployeeListData();
  } else if (currenttablename == "tblAccountOverview" || currenttablename == "tblDashboardAccountChartList") {
      templateObject.getAccountsOverviewData();
  } else if (currenttablename == "tblClienttypeList") {
      templateObject.getClientTypeListData();
  } else if (currenttablename == "tblLeadStatusList") {
      templateObject.getLeadStatusListData();
  } else if (currenttablename == "tblDepartmentList") {
      templateObject.getDepartmentData();
  } else if (currenttablename == "tblPaymentMethodList") {
      templateObject.getPaymentMethodData();
  } else if (currenttablename == "tblTermsList") {
      templateObject.getTermsData();
  } else if (currenttablename == "tblUOMList") {
      templateObject.getUOMListData();
  } else if (currenttablename == "tblBOMList") {
      templateObject.getBOMListData();
  } else if (currenttablename == "tblSupplierlist") {
      templateObject.getSupplierListData();
  } else if (currenttablename == "tblLeadlist") {
      templateObject.getLeadListData();
  } else if (currenttablename == "tblCurrencyList") {
      templateObject.getCurrencyListData();
  } else if (currenttablename === "tblTitleList") {
      templateObject.getTitleListData();
  } else if (currenttablename == 'tblProcessList') {
      templateObject.getProcessListData();
  } else if (currenttablename == "tblSupplierTransactionList") {
      templateObject.getSupplierTransactionListData();
  } else if (currenttablename == "tblCustomerTransactionList") {
      templateObject.getCustomerTransactionListData();
  } else if (currenttablename === "tblCustomerJobDetailsList") {
      templateObject.getCustomerJobDetailsListData();
  } else if (currenttablename === "tblEmployeeTransactionList") {
      templateObject.getEmployeeTransactionListData();
  } else if (currenttablename === "tblLeadCrmList") {
      templateObject.getLeadCrmListData();
  } else if (currenttablename === "tblCustomerCrmList") {
      // $("#dateFrom").val(moment().subtract(2, 'month').format('DD/MM/YYYY'));
      // $("#dateTo").val(moment().format('DD/MM/YYYY'));
      // const datefrom = $("#dateFrom").val();
      // const dateto = $("#dateTo").val();
      templateObject.getCustomerCrmListData();
      // templateObject.getCustomerCrmListData(false, datefrom, dateto);
  } else if (currenttablename === "tblSupplierCrmList") {
      templateObject.getSupplierCrmListData();
  } else if (currenttablename === "tblSingleTouchPayroll") {
      templateObject.getSTPListData();
  } else if (currenttablename === "tblLeadCrmListWithDate") {
      $("#dateFrom").val(moment().subtract(2, 'month').format('DD/MM/YYYY'));
      $("#dateTo").val(moment().format('DD/MM/YYYY'));
      const datefrom = $("#dateFrom").val();
      const dateto = $("#dateTo").val();
      templateObject.getLeadCrmListDataWithDate(false, datefrom, dateto);
  } else if (currenttablename === "tblCustomerCrmListWithDate") {
      $("#dateFrom").val(moment().subtract(2, 'month').format('DD/MM/YYYY'));
      $("#dateTo").val(moment().format('DD/MM/YYYY'));
      const datefrom = $("#dateFrom").val();
      const dateto = $("#dateTo").val();
      templateObject.getCustomerCrmListDataWithDate(false, datefrom, dateto);
  } else if (currenttablename === "tblSupplierCrmListWithDate") {
      $("#dateFrom").val(moment().subtract(2, 'month').format('DD/MM/YYYY'));
      $("#dateTo").val(moment().format('DD/MM/YYYY'));
      const datefrom = $("#dateFrom").val();
      const dateto = $("#dateTo").val();
      templateObject.getSupplierCrmListDataWithDate(false, datefrom, dateto);
  } else if (currenttablename === "tblRatePopList"){
      templateObject.getRateListData();
  }else if (currenttablename === "tblRateTypeList"){
      templateObject.getRateTypeListData();
  }else if (currenttablename === "tblOverTimeSheet"){
      templateObject.getOverTimeSheets();
  }else if( currenttablename === "productrecentlist"){
      templateObject.getAllProductRecentTransactions(currenttype);
  }else if(currenttablename === "tblInventoryOverview"){
      templateObject.getAllProductData("All");
  }else if(currenttablename === "tblTransactionSOList"){
      templateObject.getAllSOListData();
  } else if (currenttablename == "tblBASReturnList") {
      templateObject.getBasReturnData();
  } else if (currenttablename == "tblVATReturnList") {
      templateObject.getVatReturnData();
  } else if (currenttablename == "tblServiceLogList") {
    templateObject.getServiceLogData();
  } else if (currenttablename == "tblAssetRegisterList") {
    templateObject.getAssetRegisterData();
  }
  tableResize();
});

Template.non_transactional_list.events({
    "click .btnViewDeleted": async function(e) {
        $(".fullScreenSpin").css("display", "inline-block");
        e.stopImmediatePropagation();
        const templateObject = Template.instance();
        let currenttablename = await templateObject.tablename.get() || '';
        $('.btnViewDeleted').css('display', 'none');
        $('.btnHideDeleted').css('display', 'inline-block');

        if (currenttablename == "tblcontactoverview" || currenttablename == "tblContactlist") {
            await clearData('TERPCombinedContactsVS1');
            templateObject.getContactOverviewData(true);
        } else if (currenttablename == "tblEmployeelist") {
            await clearData('TEmployeeList');
            templateObject.getEmployeeListData(true);
        } else if (currenttablename == "tblAccountOverview" || currenttablename == "tblDashboardAccountChartList") {
            await clearData('TAccountVS1List');
            templateObject.getAccountsOverviewData(true);
        } else if (currenttablename == "tblClienttypeList") {
            await clearData('TClientTypeList');
            templateObject.getClientTypeListData(true);
        } else if (currenttablename == "tblLeadStatusList") {
            await clearData('TLeadStatusTypeList');
            templateObject.getLeadStatusListData(true);
        } else if (currenttablename == "tblDepartmentList") {
            await clearData('TDeptClassList');
            templateObject.getDepartmentData(true);
        } else if (currenttablename == "tblPaymentMethodList") {
            await clearData('TPaymentList');
            templateObject.getPaymentMethodData(true);
        } else if (currenttablename == "tblTermsList") {
            await clearData('TTermsVS1List');
            templateObject.getTermsData(true);
        } else if (currenttablename == "tblUOMList") {
            await clearData('TUOMList');
            templateObject.getUOMListData(true);
        } else if (currenttablename == "tblSupplierlist") {
            await clearData('TSupplierVS1List');
            templateObject.getSupplierListData(true);
        } else if (currenttablename == "tblLeadlist") {
            await clearData('TProspectList');
            templateObject.getLeadListData(true);
        } else if (currenttablename == "tblCurrencyList") {
            await clearData('TCurrency');
            templateObject.getCurrencyListData(true);
        } else if (currenttablename === "tblTitleList") {
            templateObject.getTitleListData(true);
        } else if (currenttablename == 'tblProcessList') {
            await clearData('TProcessStep');
            templateObject.getProcessListData(true);
        } else if (currenttablename == "tblSupplierTransactionList") {
            // await clearData('T')
            templateObject.getSupplierTransactionListData(true);
        } else if (currenttablename == "tblCustomerTransactionList") {
            templateObject.getCustomerTransactionListData(true);
        } else if (currenttablename === "tblCustomerJobDetailsList") {
            templateObject.getCustomerJobDetailsListData(true);
        } else if (currenttablename === "tblEmployeeTransactionList") {
            templateObject.getEmployeeTransactionListData(true);
        } else if (currenttablename === "tblLeadCrmList") {
            templateObject.getLeadCrmListData(true);
        } else if (currenttablename === "tblCustomerCrmList") {
            // const datefrom = $("#dateFrom").val();
            // const dateto = $("#dateTo").val();
            templateObject.getCustomerCrmListData(true);
            // templateObject.getCustomerCrmListData(true, datefrom, dateto);
        } else if (currenttablename === "tblSupplierCrmList") {
            templateObject.getSupplierCrmListData(true);
        } else if (currenttablename === "tblSingleTouchPayroll") {
            await clearData('TSTPayrollList');
            templateObject.getSTPListData();
        } else if (currenttablename === "tblLeadCrmListWithDate") {
            const datefrom = $("#dateFrom").val();
            const dateto = $("#dateTo").val();
            templateObject.getLeadCrmListDataWithDate(false, datefrom, dateto);
        } else if (currenttablename === "tblCustomerCrmListWithDate") {
            const datefrom = $("#dateFrom").val();
            const dateto = $("#dateTo").val();
            templateObject.getCustomerCrmListDataWithDate(false, datefrom, dateto);
        } else if (currenttablename === "tblSupplierCrmListWithDate") {
            const datefrom = $("#dateFrom").val();
            const dateto = $("#dateTo").val();
            templateObject.getSupplierCrmListDataWithDate(false, datefrom, dateto);
        } else if (currenttablename === "tblRatePopList"){
            templateObject.getRateListData(true);
        } else if (currenttablename === "tblRateTypeList"){
            templateObject.getRateTypeListData(true);
        }else if (currenttablename === "tblOverTimeSheet"){
            templateObject.getOverTimeSheets(true);
        }else if(currenttablename === "tblInventoryOverview"){
            await clearData('TProductList');
            templateObject.getAllProductData();
        }else if(currenttablename === 'tblTransactionSOList'){
            await clearData('TSalesOrderList');
            templateObject.getAllSOListData();
        }

    },
    "click .btnHideDeleted": async function(e) {
        $(".fullScreenSpin").css("display", "inline-block");
        e.stopImmediatePropagation();
        let templateObject = Template.instance();
        let currenttablename = await templateObject.tablename.get() || '';

        // var datatable = $(`#${currenttablename}`).DataTable();
        // datatable.clear();
        // datatable.draw(false);
        $('.btnHideDeleted').css('display', 'none');
        $('.btnViewDeleted').css('display', 'inline-block');

        if (currenttablename == "tblcontactoverview" || currenttablename == "tblContactlist") {
            await clearData('TERPCombinedContactsVS1');
            templateObject.getContactOverviewData(false);
        } else if (currenttablename == "tblEmployeelist") {
            await clearData('TEmployeeList');
            templateObject.getEmployeeListData(false);
        } else if (currenttablename == "tblAccountOverview" || currenttablename == "tblDashboardAccountChartList") {
            await clearData('TAccountVS1List');
            templateObject.getAccountsOverviewData(false);
        } else if (currenttablename == "tblClienttypeList") {
            await clearData('TClientTypeList');
            templateObject.getClientTypeListData(false);
        } else if (currenttablename == "tblLeadStatusList") {
            await clearData('TLeadStatusTypeList');
            templateObject.getLeadStatusListData(false);
        } else if (currenttablename == "tblDepartmentList") {
            await clearData('TDeptClassList');
            templateObject.getDepartmentData(false);
        } else if (currenttablename == "tblPaymentMethodList") {
            await clearData('TPaymentMethodList');
            templateObject.getPaymentMethodListData(false);
        } else if (currenttablename == "tblTermsList") {
            await clearData('TTermsVS1List');
            templateObject.getTermsData(false);
        } else if (currenttablename == "tblUOMList") {
            await clearData('TUOMList');
            templateObject.getUOMListData(false);
        } else if (currenttablename == "tblSupplierlist") {
            await clearData('TSupplierVS1List');
            templateObject.getSupplierListData(false);
        } else if (currenttablename == "tblLeadlist") {
            await clearData('TProspectList');
            templateObject.getLeadListData(false);
        } else if (currenttablename == "tblCurrencyList") {
            await clearData('TCurrency');
            templateObject.getCurrencyListData(false);
        } else if (currenttablename === "tblTitleList") {
            templateObject.getTitleListData(false);
        } else if (currenttablename === "tblSupplierTransactionList") {
            templateObject.getSupplierTransactionListData(false);
        } else if (currenttablename === "tblCustomerTransactionList") {
            templateObject.getCustomerTransactionListData(false);
        } else if (currenttablename === "tblCustomerJobDetailsList") {
            templateObject.getCustomerJobDetailsListData(false);
        } else if (currenttablename === "tblEmployeeTransactionList") {
            templateObject.getEmployeeTransactionListData(false);
        } else if (currenttablename === "tblLeadCrmList") {
            templateObject.getLeadCrmListData(false);
        } else if (currenttablename === "tblCustomerCrmList") {
            // const datefrom = $("#dateFrom").val();
            // const dateto = $("#dateTo").val();
            templateObject.getCustomerCrmListData(false);
            // templateObject.getCustomerCrmListData(false, datefrom, dateto);
        } else if (currenttablename === "tblSupplierCrmList") {
            templateObject.getSupplierCrmListData(false)
        } else if (currenttablename === "tblSingleTouchPayroll") {
            await clearData('TSTPayrollList');
            templateObject.getSTPListData();
        } else if (currenttablename === "tblLeadCrmListWithDate") {
            const datefrom = $("#dateFrom").val();
            const dateto = $("#dateTo").val();
            templateObject.getLeadCrmListDataWithDate(false, datefrom, dateto);
        } else if (currenttablename === "tblCustomerCrmListWithDate") {
            const datefrom = $("#dateFrom").val();
            const dateto = $("#dateTo").val();
            templateObject.getCustomerCrmListDataWithDate(false, datefrom, dateto);
        } else if (currenttablename === "tblSupplierCrmListWithDate") {
            const datefrom = $("#dateFrom").val();
            const dateto = $("#dateTo").val();
            templateObject.getSupplierCrmListDataWithDate(false, datefrom, dateto);
        } else if(currenttablename === "tblRatePopList"){
            templateObject.getRateListData(false);
        } else if(currenttablename === "tblRateTypeList"){
            templateObject.getRateTypeListData(false);
        } else if (currenttablename === "tblOverTimeSheet"){
            templateObject.getOverTimeSheets(false);
        }

    },
    'change .custom-range': async function(event) {
        const tableHandler = new TableHandler();
        let range = $(event.target).val() || 0;
        let colClassName = $(event.target).attr("valueclass");
        await $('.' + colClassName).css('width', range);
        $('.dataTable').resizable();
    },
    'click .chkDatatable': function(event) {
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
        if ($(event.target).is(':checked')) {
            $('.' + columnDataValue).addClass('showColumn');
            $('.' + columnDataValue).removeClass('hiddenColumn');
        } else {
            $('.' + columnDataValue).addClass('hiddenColumn');
            $('.' + columnDataValue).removeClass('showColumn');
        }
    },
    "blur .divcolumn": async function(event) {
        const templateObject = Template.instance();
        let columData = $(event.target).text();
        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr("custid");
        let currenttablename = await templateObject.tablename.get() || '';
        var datable = $('#' + currenttablename).DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);
    },
    'click .resetTable': async function(event) {
        let templateObject = Template.instance();
        let reset_data = templateObject.reset_data.get();
        let currenttablename = await templateObject.tablename.get() || '';
        //reset_data[9].display = false;
        reset_data = reset_data.filter(redata => redata.display);
        $(".displaySettings").each(function(index) {
            let $tblrow = $(this);
            $tblrow.find(".divcolumn").text(reset_data[index].label);
            $tblrow.find(".custom-control-input").prop("checked", reset_data[index].active);

            let title = $('#' + currenttablename).find("th").eq(index);
            $(title).html(reset_data[index].label);

            if (reset_data[index].active) {
                $('.' + reset_data[index].class).addClass('showColumn');
                $('.' + reset_data[index].class).removeClass('hiddenColumn');
            } else {
                $('.' + reset_data[index].class).addClass('hiddenColumn');
                $('.' + reset_data[index].class).removeClass('showColumn');
            }
            $(".rngRange" + reset_data[index].class).val(reset_data[index].width);
            $("." + reset_data[index].class).css('width', reset_data[index].width);
        });
    },
    "click .saveTable": async function(event) {
        let lineItems = [];
        $(".fullScreenSpin").css("display", "inline-block");

        $(".displaySettings").each(function(index) {
            var $tblrow = $(this);
            var fieldID = $tblrow.attr("custid") || 0;
            var colTitle = $tblrow.find(".divcolumn").text() || "";
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(":checked")) {
                colHidden = true;
            } else {
                colHidden = false;
            }
            let lineItemObj = {
                index: parseInt(fieldID),
                label: colTitle,
                active: colHidden,
                width: parseInt(colWidth),
                class: colthClass,
                display: true
            };

            lineItems.push(lineItemObj);
        });

        let templateObject = Template.instance();
        let reset_data = templateObject.reset_data.get();
        reset_data = reset_data.filter(redata => redata.display == false);
        lineItems.push(...reset_data);
        lineItems.sort((a, b) => a.index - b.index);
        let erpGet = erpDb();
        let tableName = await templateObject.tablename.get() || '';
        let employeeId = parseInt(localStorage.getItem('mySessionEmployeeLoggedID')) || 0;
        let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);

        if (added) {
            sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), '').then(function(dataCustomize) {
                addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
            }).catch(function(err) {});
            $(".fullScreenSpin").css("display", "none");
            swal({
                title: 'SUCCESS',
                text: "Display settings is updated!",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.value) {
                    $('#' + tableName + '_Modal').modal('hide');
                }
            });
        } else {
            $(".fullScreenSpin").css("display", "none");
        }

    },
    "click .exportbtn": async function() {
        $(".fullScreenSpin").css("display", "inline-block");
        let currenttablename = await templateObject.tablename.get() || '';
        jQuery('#' + currenttablename + '_wrapper .dt-buttons .btntabletocsv').click();
        $(".fullScreenSpin").css("display", "none");
    },
    "click .printConfirm": async function(event) {
        $(".fullScreenSpin").css("display", "inline-block");
        let currenttablename = await templateObject.tablename.get() || '';
        jQuery('#' + currenttablename + '_wrapper .dt-buttons .btntabletopdf').click();
        $(".fullScreenSpin").css("display", "none");
    },
    // "change #dateFrom, change #dateTo": function() {
    //     let templateObject = Template.instance();

    // },
});

Template.non_transactional_list.helpers({
    transactiondatatablerecords: () => {
        return Template.instance().transactiondatatablerecords.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: localStorage.getItem('mycloudLogonID'),
            PrefName: Template.instance().tablename.get()
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },
    showSetupFinishedAlert: () => {
        let setupFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
        if (setupFinished == true || setupFinished == "true") {
            return false;
        } else {
            return true;
        }
    },
    non_trans_displayfields: () => {
        return Template.instance().non_trans_displayfields.get();
    },
    tablename: () => {
        return Template.instance().tablename.get();
    }
});
