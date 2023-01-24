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
import '../../lib/global/indexdbstorage.js';
import TableHandler from '../../js/Table/TableHandler';
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './transaction_list.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '../../lib/global/globalfunction';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let contactService = new ContactService();
let productService = new ProductService();
let manufacturingService = new ManufacturingService();
let crmService = new CRMService();
let reportService = new ReportService();

import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import PayrollSettingsOvertimes from "../../js/Api/Model/PayrollSettingsOvertimes";


Template.transaction_list.inheritsHooksFrom('export_import_print_display_button');

Template.transaction_list.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.transactiondatatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();
    templateObject.trans_displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
    templateObject.tablename = new ReactiveVar();
    templateObject.currentproductID = new ReactiveVar();
    templateObject.currenttype = new ReactiveVar();
});

Template.transaction_list.onRendered(function() {
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
        if (currenttablename == "tblBankingOverview") {
            reset_data = [
                { index: 0, label: "id", class: "SortDate", width: "0", active: false, display: false },
                { index: 1, label: "Date", class: "PaymentDate", width: "80", active: true, display: true },
                { index: 2, label: "Trans ID", class: "AccountId", width: "80", active: true, display: true },
                { index: 3, label: "Account", class: "BankAccount", width: "100", active: true, display: true },
                { index: 4, label: "Type", class: "Type", width: "120", active: true, display: true },
                { index: 5, label: "Amount", class: "PaymentAmount", width: "80", active: true, display: true },
                { index: 6, label: "Amount (Inc)", class: "DebitEx", width: "120", active: true, display: true },
                { index: 7, label: "Department", class: "Department", width: "80", active: true, display: true },
                { index: 8, label: "Chq Ref No", class: "chqrefno", width: "110", active: false, display: true },
                { index: 9, label: "Comments", class: "Notes", width: "", active: true, display: true },
            ];
        }
        templateObject.reset_data.set(reset_data);
    }
    templateObject.init_reset_data();

    // set initial table rest_data
    templateObject.initCustomFieldDisplaySettings = function(data, listType) {
        let templateObject = Template.instance();
        let reset_data = templateObject.reset_data.get();
        templateObject.showCustomFieldDisplaySettings(reset_data);
    }

    templateObject.showCustomFieldDisplaySettings = async function(reset_data) {
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
        await templateObject.trans_displayfields.set(custFields);
        $('.dataTable').resizable();
    }
    templateObject.initCustomFieldDisplaySettings("", currenttablename);


    var today = moment().format('DD/MM/YYYY');
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if ((currentDate.getMonth()+1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth()+1);
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

    templateObject.resetData = function(dataVal) {
        location.reload();
    };

    //Banking Overview Data
    templateObject.getBankingOverviewData = async function(viewdeleted) {
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

        getVS1Data('TBankAccountReport').then(function(dataObject) {

            if (dataObject.length == 0) {
                sideBarService.getAllBankAccountDetails(prevMonth11Date,toDate, true,initialReportLoad,0).then(function(data) {
                    addVS1Data('TBankAccountReport', JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    let lineID = "";
                    for (let i = 0; i < data.tbankaccountreport.length; i++) {
                        let amount = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Amount) || 0.00;
                        let amountInc = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Amountinc) || 0.00;
                        let creditEx = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalCreditInc) || 0.00;
                        let openningBalance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].OpeningBalanceInc) || 0.00;
                        let closingBalance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].ClosingBalanceInc) || 0.00;
                        let accountType = data.tbankaccountreport[i].Type || '';
                        // Currency+''+data.tbankaccountreport[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        // let balance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Balance)|| 0.00;
                        // let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalPaid)|| 0.00;
                        // let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalBalance)|| 0.00;
                        if (data.tbankaccountreport[i].Type == "Un-Invoiced PO") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "PO") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "Invoice") {
                            lineID = data.tbankaccountreport[i].SaleID;
                        } else if (data.tbankaccountreport[i].Type == "Credit") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "Supplier Payment") {
                            lineID = data.tbankaccountreport[i].PaymentID;
                        } else if (data.tbankaccountreport[i].Type == "Bill") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "Customer Payment") {
                            lineID = data.tbankaccountreport[i].PaymentID;
                        } else if (data.tbankaccountreport[i].Type == "Journal Entry") {
                            lineID = data.tbankaccountreport[i].SaleID;
                        } else if (data.tbankaccountreport[i].Type == "UnInvoiced SO") {
                            lineID = data.tbankaccountreport[i].SaleID;
                        } else if (data.tbankaccountreport[i].Type == "Cheque") {
                            if (localStorage.getItem('ERPLoggedCountry') == "Australia") {
                                accountType = "Cheque";
                            } else if (localStorage.getItem('ERPLoggedCountry') == "United States of America") {
                                accountType = "Check";
                            } else {
                                accountType = "Cheque";
                            }

                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        } else if (data.tbankaccountreport[i].Type == "Check") {
                            lineID = data.tbankaccountreport[i].PurchaseOrderID;
                        }else {
                            lineID = data.tbankaccountreport[i].TransID;
                        }

                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tbankaccountreport;

                        var dataList = [
                            useData[i].Date != '' ? moment(useData[i].Date).format("YYYY/MM/DD") : useData[i].Date,
                            '<span style="display:none;">' + (useData[i].Date != '' ? moment(useData[i].Date).format("YYYY/MM/DD") : useData[i].Date).toString() + '</span>' +
                                (useData[i].Date != '' ? moment(useData[i].Date).format("DD/MM/YYYY") : useData[i].Date).toString(),
                            lineID || '',
                            useData[i].AccountName || '',
                            accountType || '',
                            amount || 0.00,
                            amountInc || 0.00,
                            useData[i].ClassName || '',
                            useData[i].ChqRefNo || '',
                            useData[i].Notes || '',
                            // creditex: creditEx || 0.00,
                            // customername: useData[i].ClientName || '',
                            // openingbalance: openningBalance || 0.00,
                            // closingbalance: closingBalance || 0.00,
                            // accountnumber: useData[i].AccountNumber || '',
                            // accounttype: useData[i].AccountType || '',
                            // balance: balance || 0.00,
                            // receiptno: useData[i].ReceiptNo || '',
                            // jobname: useData[i].jobname || '',
                            // paymentmethod: useData[i].PaymentMethod || '',
                        ];

                        if (data.tbankaccountreport[i].Type.replace(/\s/g, '') != "") {
                            dataTableList.push(dataList);
                        }

                    }


                    //awaitingpaymentCount
                    templateObject.datatablerecords.set(dataTableList);
                    if (templateObject.datatablerecords.get()) {


                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    }

                    let trans_displayfields = templateObject.trans_displayfields.get();

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function() {
                        $('#tblBankingOverview').DataTable({
                            // dom: 'lBfrtip',
                            data: dataTableList,
                            columnDefs: [
                                {
                                    targets: 0,
                                    className: "colSortDate hiddenColumn",
                                    type: "date"
                                },
                                {
                                    targets: 1,
                                    className: trans_displayfields[1].active == true ? "colPaymentDate" : "colPaymentDate hiddenColumn",
                                    createdCell: function(td, cellData, rowData, row, col) {
                                        $(td).closest("tr").attr("id", rowData[2]);
                                        $(td).closest("tr").addClass("dnd-moved");
                                    }
                                },
                                {
                                    targets: 2,
                                    className: trans_displayfields[2].active == true ? "colAccountId" : "colAccountId hiddenColumn",
                                },
                                {
                                    targets: 3,
                                    className: trans_displayfields[3].active == true ? "colBankAccount" : "colBankAccount hiddenColumn",
                                },
                                {
                                    targets: 4,
                                    className: trans_displayfields[4].active == true ? "colType" : "colType hiddenColumn",
                                },
                                {
                                    targets: 5,
                                    className: trans_displayfields[5].active == true ? "colPaymentAmount" : "colPaymentAmount hiddenColumn",
                                },
                                {
                                    targets: 6,
                                    className: trans_displayfields[6].active == true ? "colDebitEx" : "colDebitEx hiddenColumn",
                                },
                                {
                                    targets: 7,
                                    className: trans_displayfields[7].active == true ? "colDepartment" : "colDepartment hiddenColumn",
                                },
                                {
                                    targets: 8,
                                    className: trans_displayfields[8].active == true ? "colchqrefno" : "colchqrefno hiddenColumn",
                                },
                                {
                                    targets: 9,
                                    className: trans_displayfields[9].active == true ? "colNotes" : "colNotes hiddenColumn",
                                },

                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Banking Overview - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Payment Overview',
                                filename: "Banking Overview - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                                {
                                    extend: 'excelHtml5',
                                    title: '',
                                    download: 'open',
                                    className: "btntabletoexcel hiddenColumn",
                                    filename: "Banking Overview - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialReportDatatableLoad,
                            "bLengthChange": false,
                            lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[ 0, "desc" ],[ 2, "desc" ]],
                            // "aaSorting": [[1,'desc']],
                            action: function() {
                                $('#tblBankingOverview').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                                $('.paginate_button.page-item').removeClass('disabled');
                                $('#tblBankingOverview_ellipsis').addClass('disabled');

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
                                    .on('click', function () {
                                        $('.fullScreenSpin').css('display', 'inline-block');
                                        let dataLenght = oSettings._iDisplayLength;

                                        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                                        var dateTo = new Date($("#dateTo").datepicker("getDate"));

                                        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                                        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                                        if(data.Params.IgnoreDates == true){
                                            sideBarService.getAllBankAccountDetails(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                                getVS1Data('TBankAccountReport').then(function (dataObjectold) {
                                                    if (dataObjectold.length == 0) {}
                                                    else {
                                                        let dataOld = JSON.parse(dataObjectold[0].data);
                                                        var thirdaryData = $.merge($.merge([], dataObjectnew.tbankaccountreport), dataOld.tbankaccountreport);
                                                        let objCombineData = {
                                                            Params: dataOld.Params,
                                                            tbankaccountreport: thirdaryData
                                                        }

                                                        addVS1Data('TBankAccountReport', JSON.stringify(objCombineData)).then(function (datareturn) {
                                                            templateObject.resetData(objCombineData);
                                                            $('.fullScreenSpin').css('display', 'none');
                                                        }).catch(function (err) {
                                                            $('.fullScreenSpin').css('display', 'none');
                                                        });

                                                    }
                                                }).catch(function (err) {});

                                            }).catch(function (err) {
                                                $('.fullScreenSpin').css('display', 'none');
                                            });
                                        }else{
                                            sideBarService.getAllBankAccountDetails(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                                getVS1Data('TBankAccountReport').then(function (dataObjectold) {
                                                    if (dataObjectold.length == 0) {}
                                                    else {
                                                        let dataOld = JSON.parse(dataObjectold[0].data);
                                                        var thirdaryData = $.merge($.merge([], dataObjectnew.tbankaccountreport), dataOld.tbankaccountreport);
                                                        let objCombineData = {
                                                            Params: dataOld.Params,
                                                            tbankaccountreport: thirdaryData
                                                        }

                                                        addVS1Data('TBankAccountReport', JSON.stringify(objCombineData)).then(function (datareturn) {
                                                            templateObject.resetData(objCombineData);
                                                            $('.fullScreenSpin').css('display', 'none');
                                                        }).catch(function (err) {
                                                            $('.fullScreenSpin').css('display', 'none');
                                                        });

                                                    }
                                                }).catch(function (err) {});

                                            }).catch(function (err) {
                                                $('.fullScreenSpin').css('display', 'none');
                                            });
                                        }
                                    });

                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
                            language: { search: "",searchPlaceholder: "Search List..." },
                            "fnInitComplete": function () {
                                this.fnPageChange('last');
                                if(data.Params.Search.replace(/\s/g, "") == ""){
                                    $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblBankingOverview_filter");
                                }else{
                                    $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblBankingOverview_filter");
                                }
                                $("<button class='btn btn-primary btnRefreshBankingOverview' type='button' id='btnRefreshBankingOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblBankingOverview_filter");

                                $('.myvarFilterForm').appendTo(".colDateFilter");
                            },
                            "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                                let countTableData = data.Params.Count || 0; //get count from API data

                                return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                            }

                        }).on('page', function() {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);

                        }).on('column-reorder', function() {

                        });
                        $('.fullScreenSpin').css('display', 'none');

                    }, 0);

                    var columns = $('#tblBankingOverview th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function(i, v) {
                        if (v.hidden == false) {
                            columVisible = true;
                        }
                        if ((v.className.includes("hiddenColumn"))) {
                            columVisible = false;
                        }
                        sWidth = v.style.width.replace('px', "");

                        let datatablerecordObj = {
                            sTitle: v.innerText || '',
                            sWidth: sWidth || '',
                            sIndex: v.cellIndex || 0,
                            sVisible: columVisible || false,
                            sClass: v.className || ''
                        };
                        tableHeaderList.push(datatablerecordObj);
                    });
                    templateObject.tableheaderrecords.set(tableHeaderList);
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    $('#tblBankingOverview tbody').on('click', 'tr', function() {
                        var listData = $(this).closest('tr').attr('id');
                        var transactiontype = $(event.target).closest("tr").find(".colType").text();
                        if ((listData) && (transactiontype)) {
                            if (transactiontype == "Un-Invoiced PO") {
                                FlowRouter.go('/purchaseordercard?id=' + listData);
                            } else if (transactiontype == "PO") {
                                FlowRouter.go('/purchaseordercard?id=' + listData);
                            } else if (transactiontype == "Invoice") {
                                FlowRouter.go('/invoicecard?id=' + listData);
                            } else if (transactiontype == "Credit") {
                                FlowRouter.go('/creditcard?id=' + listData);
                            } else if (transactiontype == "Supplier Payment") {
                                FlowRouter.go('/supplierpaymentcard?id=' + listData);
                            } else if (transactiontype == "Bill") {
                                FlowRouter.go('/billcard?id=' + listData);
                            } else if (transactiontype == "Customer Payment") {
                                FlowRouter.go('/paymentcard?id=' + listData);
                            } else if (transactiontype == "Journal Entry") {
                                FlowRouter.go('/journalentrycard?id=' + listData);
                            } else if (transactiontype == "UnInvoiced SO") {
                                FlowRouter.go('/salesordercard?id=' + listData);
                            } else if (transactiontype == "Cheque") {
                                FlowRouter.go('/chequecard?id=' + listData);
                            } else if (transactiontype == "Check") {
                                FlowRouter.go('/chequecard?id=' + listData);
                            } else if (transactiontype == "Deposit Entry") {
                                FlowRouter.go('/depositcard?id=' + listData);
                            }else {
                                FlowRouter.go('/chequelist');
                            }

                        }
                    });

                }).catch(function(err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tbankaccountreport;
                if(data.Params.IgnoreDates == true){
                    $('#dateFrom').attr('readonly', true);
                    $('#dateTo').attr('readonly', true);
                    //FlowRouter.go('/bankingoverview?ignoredate=true');
                }else{
                    $('#dateFrom').attr('readonly', false);
                    $('#dateTo').attr('readonly', false);
                    $("#dateFrom").val(data.Params.DateFrom !=''? moment(data.Params.DateFrom).format("DD/MM/YYYY"): data.Params.DateFrom);
                    $("#dateTo").val(data.Params.DateTo !=''? moment(data.Params.DateTo).format("DD/MM/YYYY"): data.Params.DateTo);
                }
                let lineItems = [];
                let lineItemObj = {};
                let lineID = "";
                for (let i = 0; i < useData.length; i++) {
                    let amount = utilityService.modifynegativeCurrencyFormat(useData[i].Amount) || 0.00;
                    let amountInc = utilityService.modifynegativeCurrencyFormat(useData[i].Amountinc) || 0.00;
                    let creditEx = utilityService.modifynegativeCurrencyFormat(useData[i].TotalCreditInc) || 0.00;
                    let openningBalance = utilityService.modifynegativeCurrencyFormat(useData[i].OpeningBalanceInc) || 0.00;
                    let closingBalance = utilityService.modifynegativeCurrencyFormat(useData[i].ClosingBalanceInc) || 0.00;
                    let accountType = useData[i].Type || '';
                    // Currency+''+data.tbankaccountreport[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    // let balance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Balance)|| 0.00;
                    // let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalPaid)|| 0.00;
                    // let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalBalance)|| 0.00;
                    if (useData[i].Type == "Un-Invoiced PO") {
                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "PO") {
                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "Invoice") {
                        lineID = useData[i].SaleID;
                    } else if (useData[i].Type == "Credit") {
                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "Supplier Payment") {
                        lineID = useData[i].PaymentID;
                    } else if (useData[i].Type == "Bill") {
                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "Customer Payment") {
                        lineID = useData[i].PaymentID;
                    } else if (useData[i].Type == "Journal Entry") {
                        lineID = useData[i].SaleID;
                    } else if (useData[i].Type == "UnInvoiced SO") {
                        lineID = useData[i].SaleID;
                    } else if (data.tbankaccountreport[i].Type == "Cheque") {
                        if (localStorage.getItem('ERPLoggedCountry') == "Australia") {
                            accountType = "Cheque";
                        } else if (localStorage.getItem('ERPLoggedCountry') == "United States of America") {
                            accountType = "Check";
                        } else {
                            accountType = "Cheque";
                        }

                        lineID = useData[i].PurchaseOrderID;
                    } else if (useData[i].Type == "Check") {
                        lineID = useData[i].PurchaseOrderID;
                    }else {
                        lineID = useData[i].TransID;
                    }


                    var dataList = [
                        useData[i].Date != '' ? moment(useData[i].Date).format("YYYY/MM/DD") : useData[i].Date,
                        '<span style="display:none;">' + (useData[i].Date != '' ? moment(useData[i].Date).format("YYYY/MM/DD") : useData[i].Date).toString() + '</span>' +
                            (useData[i].Date != '' ? moment(useData[i].Date).format("DD/MM/YYYY") : useData[i].Date).toString(),
                        lineID || '',
                        useData[i].AccountName || '',
                        accountType || '',
                        amount || 0.00,
                        amountInc || 0.00,
                        useData[i].ClassName || '',
                        useData[i].ChqRefNo || '',
                        useData[i].Notes || '',
                        // creditex: creditEx || 0.00,
                        // customername: useData[i].ClientName || '',
                        // openingbalance: openningBalance || 0.00,
                        // closingbalance: closingBalance || 0.00,
                        // accountnumber: useData[i].AccountNumber || '',
                        // accounttype: useData[i].AccountType || '',
                        // balance: balance || 0.00,
                        // receiptno: useData[i].ReceiptNo || '',
                        // jobname: useData[i].jobname || '',
                        // paymentmethod: useData[i].PaymentMethod || '',
                    ];
                    if (useData[i].Type.replace(/\s/g, '') != "") {
                        dataTableList.push(dataList);
                    }

                }


                //awaitingpaymentCount
                templateObject.datatablerecords.set(dataTableList);
                if (templateObject.datatablerecords.get()) {

                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                let trans_displayfields = templateObject.trans_displayfields.get();

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblBankingOverview').DataTable({
                        // dom: 'lBfrtip',
                        //data: dataTableList,
                        data: dataTableList,
                        columnDefs: [
                            {
                                targets: 0,
                                className: "colSortDate hiddenColumn",
                                width: "100px",
                            },
                            {
                                targets: 1,
                                className: trans_displayfields[1].active == true ? "colPaymentDate" : "colPaymentDate hiddenColumn",
                                width: "100px",
                                createdCell: function(td, cellData, rowData, row, col) {
                                    $(td).closest("tr").attr("id", rowData[2]);
                                    $(td).closest("tr").addClass("dnd-moved");
                                }
                            },
                            {
                                targets: 2,
                                className: trans_displayfields[2].active == true ? "colAccountId" : "colAccountId hiddenColumn",
                                width: "100px",
                            },
                            {
                                targets: 3,
                                className: trans_displayfields[3].active == true ? "colBankAccount" : "colBankAccount hiddenColumn",
                                width: "100px",
                            },
                            {
                                targets: 4,
                                className: trans_displayfields[4].active == true ? "colType" : "colType hiddenColumn",
                                width: "100px",
                            },
                            {
                                targets: 5,
                                className: trans_displayfields[5].active == true ? "colPaymentAmount" : "colPaymentAmount hiddenColumn",
                                width: "100px",
                            },
                            {
                                targets: 6,
                                className: trans_displayfields[6].active == true ? "colDebitEx" : "colDebitEx hiddenColumn",
                                width: "100px",
                            },
                            {
                                targets: 7,
                                className: trans_displayfields[7].active == true ? "colDepartment" : "colDepartment hiddenColumn",
                                width: "100px",
                            },
                            {
                                targets: 8,
                                className: trans_displayfields[8].active == true ? "colchqrefno" : "colchqrefno hiddenColumn",
                                width: "100px",
                            },
                            {
                                targets: 9,
                                className: trans_displayfields[9].active == true ? "colNotes" : "colNotes hiddenColumn",
                                width: "100px",
                            },
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'csvHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Banking Overview - " + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Payment Overview',
                            filename: "Banking Overview - " + moment().format(),
                            exportOptions: {
                                columns: ':visible'
                            }
                        },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Banking Overview - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        // "aaSorting": [[1,'desc']],
                        action: function() {
                            $('#tblBankingOverview').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblBankingOverview_ellipsis').addClass('disabled');

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
                                .on('click', function () {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    let dataLenght = oSettings._iDisplayLength;

                                    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                                    var dateTo = new Date($("#dateTo").datepicker("getDate"));

                                    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                                    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                                    if(data.Params.IgnoreDates == true){
                                        sideBarService.getAllBankAccountDetails(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                            getVS1Data('TBankAccountReport').then(function (dataObjectold) {
                                                if (dataObjectold.length == 0) {}
                                                else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tbankaccountreport), dataOld.tbankaccountreport);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tbankaccountreport: thirdaryData
                                                    }

                                                    addVS1Data('TBankAccountReport', JSON.stringify(objCombineData)).then(function (datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function (err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function (err) {});

                                        }).catch(function (err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    }else{
                                        sideBarService.getAllBankAccountDetails(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                            getVS1Data('TBankAccountReport').then(function (dataObjectold) {
                                                if (dataObjectold.length == 0) {}
                                                else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tbankaccountreport), dataOld.tbankaccountreport);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tbankaccountreport: thirdaryData
                                                    }

                                                    addVS1Data('TBankAccountReport', JSON.stringify(objCombineData)).then(function (datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function (err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function (err) {});

                                        }).catch(function (err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    }
                                });

                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        language: { search: "",searchPlaceholder: "Search List..." },
                        "fnInitComplete": function () {
                            this.fnPageChange('last');
                            if(data.Params.Search.replace(/\s/g, "") == ""){
                                $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblBankingOverview_filter");
                            }else{
                                $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblBankingOverview_filter");
                            }
                            $("<button class='btn btn-primary btnRefreshBankingOverview' type='button' id='btnRefreshBankingOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblBankingOverview_filter");

                            $('.myvarFilterForm').appendTo(".colDateFilter");
                        },
                        "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                            let countTableData = data.Params.Count || 0; //get count from API data

                            return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                        }

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);

                    }).on('column-reorder', function() {

                    });
                    $('.fullScreenSpin').css('display', 'none');

                }, 0);

                var columns = $('#tblBankingOverview th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || 0,
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblBankingOverview tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    if ((listData) && (transactiontype)) {
                        if (transactiontype == "Un-Invoiced PO") {
                            FlowRouter.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype == "PO") {
                            FlowRouter.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype == "Invoice") {
                            FlowRouter.go('/invoicecard?id=' + listData);
                        } else if (transactiontype == "Credit") {
                            FlowRouter.go('/creditcard?id=' + listData);
                        } else if (transactiontype == "Supplier Payment") {
                            FlowRouter.go('/supplierpaymentcard?id=' + listData);
                        } else if (transactiontype == "Bill") {
                            FlowRouter.go('/billcard?id=' + listData);
                        } else if (transactiontype == "Customer Payment") {
                            FlowRouter.go('/paymentcard?id=' + listData);
                        } else if (transactiontype == "Journal Entry") {
                            FlowRouter.go('/journalentrycard?id=' + listData);
                        } else if (transactiontype == "UnInvoiced SO") {
                            FlowRouter.go('/salesordercard?id=' + listData);
                        } else if (transactiontype == "Cheque") {
                            FlowRouter.go('/chequecard?id=' + listData);
                        } else if (transactiontype == "Check") {
                            FlowRouter.go('/chequecard?id=' + listData);
                        } else if (transactiontype == "Deposit Entry") {
                            FlowRouter.go('/depositcard?id=' + listData);
                        } else {
                            FlowRouter.go('/chequelist');
                        }

                    }
                });


            }
        }).catch(function(err) {
            sideBarService.getAllBankAccountDetails(prevMonth11Date,toDate, true,initialReportLoad,0,viewdeleted).then(function(data) {
                addVS1Data('TBankAccountReport', JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                let lineID = "";
                for (let i = 0; i < data.tbankaccountreport.length; i++) {
                    let amount = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Amount) || 0.00;
                    let amountInc = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Amountinc) || 0.00;
                    let creditEx = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalCreditInc) || 0.00;
                    let openningBalance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].OpeningBalanceInc) || 0.00;
                    let closingBalance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].ClosingBalanceInc) || 0.00;
                    let accountType = data.tbankaccountreport[i].Type || '';
                    // Currency+''+data.tbankaccountreport[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    // let balance = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].Balance)|| 0.00;
                    // let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalPaid)|| 0.00;
                    // let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbankaccountreport[i].TotalBalance)|| 0.00;
                    if (data.tbankaccountreport[i].Type == "Un-Invoiced PO") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "PO") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "Invoice") {
                        lineID = data.tbankaccountreport[i].SaleID;
                    } else if (data.tbankaccountreport[i].Type == "Credit") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "Supplier Payment") {
                        lineID = data.tbankaccountreport[i].PaymentID;
                    } else if (data.tbankaccountreport[i].Type == "Bill") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "Customer Payment") {
                        lineID = data.tbankaccountreport[i].PaymentID;
                    } else if (data.tbankaccountreport[i].Type == "Journal Entry") {
                        lineID = data.tbankaccountreport[i].SaleID;
                    } else if (data.tbankaccountreport[i].Type == "UnInvoiced SO") {
                        lineID = data.tbankaccountreport[i].SaleID;
                    } else if (data.tbankaccountreport[i].Type == "Cheque") {
                        if (localStorage.getItem('ERPLoggedCountry') == "Australia") {
                            accountType = "Cheque";
                        } else if (localStorage.getItem('ERPLoggedCountry') == "United States of America") {
                            accountType = "Check";
                        } else {
                            accountType = "Cheque";
                        }

                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    } else if (data.tbankaccountreport[i].Type == "Check") {
                        lineID = data.tbankaccountreport[i].PurchaseOrderID;
                    }else {
                        lineID = data.tbankaccountreport[i].TransID;
                    }

                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tbankaccountreport;

                    var dataList = [
                        useData[i].Date != '' ? moment(useData[i].Date).format("YYYY/MM/DD") : useData[i].Date,
                        useData[i].Date != '' ? moment(useData[i].Date).format("DD/MM/YYYY") : useData[i].Date,
                        lineID || '',
                        useData[i].AccountName || '',
                        accountType || '',
                        amount || 0.00,
                        amountInc || 0.00,
                        useData[i].ClassName || '',
                        useData[i].ChqRefNo || '',
                        useData[i].Notes || '',
                        // creditex: creditEx || 0.00,
                        // customername: useData[i].ClientName || '',
                        // openingbalance: openningBalance || 0.00,
                        // closingbalance: closingBalance || 0.00,
                        // accountnumber: useData[i].AccountNumber || '',
                        // accounttype: useData[i].AccountType || '',
                        // balance: balance || 0.00,
                        // receiptno: useData[i].ReceiptNo || '',
                        // jobname: useData[i].jobname || '',
                        // paymentmethod: useData[i].PaymentMethod || '',
                    ];
                    if (data.tbankaccountreport[i].Type.replace(/\s/g, '') != "") {
                        dataTableList.push(dataList);
                    }

                }


                //awaitingpaymentCount
                templateObject.datatablerecords.set(dataTableList);
                if (templateObject.datatablerecords.get()) {


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                let trans_displayfields = templateObject.trans_displayfields.get();

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblBankingOverview').DataTable({
                        // dom: 'lBfrtip',
                        data: dataTableList,
                        columnDefs: [
                            {
                                targets: 0,
                                className: "colSortDate hiddenColumn",
                                type: "date"
                            },
                            {
                                targets: 1,
                                className: trans_displayfields[1].active == true ? "colPaymentDate" : "colPaymentDate hiddenColumn",
                                createdCell: function(td, cellData, rowData, row, col) {
                                    $(td).closest("tr").attr("id", rowData[2]);
                                    $(td).closest("tr").addClass("dnd-moved");
                                }
                            },
                            {
                                targets: 2,
                                className: trans_displayfields[2].active == true ? "colAccountId" : "colAccountId hiddenColumn",
                            },
                            {
                                targets: 3,
                                className: trans_displayfields[3].active == true ? "colBankAccount" : "colBankAccount hiddenColumn",
                            },
                            {
                                targets: 4,
                                className: trans_displayfields[4].active == true ? "colType" : "colType hiddenColumn",
                            },
                            {
                                targets: 5,
                                className: trans_displayfields[5].active == true ? "colPaymentAmount" : "colPaymentAmount hiddenColumn",
                            },
                            {
                                targets: 6,
                                className: trans_displayfields[6].active == true ? "colDebitEx" : "colDebitEx hiddenColumn",
                            },
                            {
                                targets: 7,
                                className: trans_displayfields[7].active == true ? "colDepartment" : "colDepartment hiddenColumn",
                            },
                            {
                                targets: 8,
                                className: trans_displayfields[8].active == true ? "colchqrefno" : "colchqrefno hiddenColumn",
                            },
                            {
                                targets: 9,
                                className: trans_displayfields[9].active == true ? "colNotes" : "colNotes hiddenColumn",
                            },
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'csvHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Banking Overview - " + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Payment Overview',
                            filename: "Banking Overview - " + moment().format(),
                            exportOptions: {
                                columns: ':visible'
                            }
                        },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Banking Overview - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        // "aaSorting": [[1,'desc']],
                        action: function() {
                            $('#tblBankingOverview').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblBankingOverview_ellipsis').addClass('disabled');

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
                                .on('click', function () {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    let dataLenght = oSettings._iDisplayLength;

                                    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                                    var dateTo = new Date($("#dateTo").datepicker("getDate"));

                                    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                                    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                                    if(data.Params.IgnoreDates == true){
                                        sideBarService.getAllBankAccountDetails(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                            getVS1Data('TBankAccountReport').then(function (dataObjectold) {
                                                if (dataObjectold.length == 0) {}
                                                else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tbankaccountreport), dataOld.tbankaccountreport);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tbankaccountreport: thirdaryData
                                                    }

                                                    addVS1Data('TBankAccountReport', JSON.stringify(objCombineData)).then(function (datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function (err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function (err) {});

                                        }).catch(function (err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    }else{
                                        sideBarService.getAllBankAccountDetails(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                            getVS1Data('TBankAccountReport').then(function (dataObjectold) {
                                                if (dataObjectold.length == 0) {}
                                                else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tbankaccountreport), dataOld.tbankaccountreport);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tbankaccountreport: thirdaryData
                                                    }

                                                    addVS1Data('TBankAccountReport', JSON.stringify(objCombineData)).then(function (datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function (err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function (err) {});

                                        }).catch(function (err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    }
                                });

                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        language: { search: "",searchPlaceholder: "Search List..." },
                        "fnInitComplete": function () {
                            this.fnPageChange('last');
                            if(data.Params.Search.replace(/\s/g, "") == ""){
                                $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblBankingOverview_filter");
                            }else{
                                $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblBankingOverview_filter");
                            }
                            $("<button class='btn btn-primary btnRefreshBankingOverview' type='button' id='btnRefreshBankingOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblBankingOverview_filter");

                            $('.myvarFilterForm').appendTo(".colDateFilter");
                        },
                        "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                            let countTableData = data.Params.Count || 0; //get count from API data

                            return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                        }

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);

                    }).on('column-reorder', function() {

                    });
                    $('.fullScreenSpin').css('display', 'none');

                }, 0);

                var columns = $('#tblBankingOverview th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || 0,
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblBankingOverview tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    if ((listData) && (transactiontype)) {
                        if (transactiontype == "Un-Invoiced PO") {
                            FlowRouter.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype == "PO") {
                            FlowRouter.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype == "Invoice") {
                            FlowRouter.go('/invoicecard?id=' + listData);
                        } else if (transactiontype == "Credit") {
                            FlowRouter.go('/creditcard?id=' + listData);
                        } else if (transactiontype == "Supplier Payment") {
                            FlowRouter.go('/supplierpaymentcard?id=' + listData);
                        } else if (transactiontype == "Bill") {
                            FlowRouter.go('/billcard?id=' + listData);
                        } else if (transactiontype == "Customer Payment") {
                            FlowRouter.go('/paymentcard?id=' + listData);
                        } else if (transactiontype == "Journal Entry") {
                            FlowRouter.go('/journalentrycard?id=' + listData);
                        } else if (transactiontype == "UnInvoiced SO") {
                            FlowRouter.go('/salesordercard?id=' + listData);
                        } else if (transactiontype == "Cheque") {
                            FlowRouter.go('/chequecard?id=' + listData);
                        } else if (transactiontype == "Check") {
                            FlowRouter.go('/chequecard?id=' + listData);
                        } else if (transactiontype == "Deposit Entry") {
                            FlowRouter.go('/depositcard?id=' + listData);
                        }else {
                            FlowRouter.go('/chequelist');
                        }

                    }
                });

            }).catch(function(err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });
        //$(".fullScreenSpin").css("display", "none");
    }

    templateObject.getAllFilterbankingData = function (fromDate,toDate, ignoreDate) {
        sideBarService.getAllBankAccountDetails(fromDate,toDate, ignoreDate,initialReportLoad,0).then(function(data) {

            addVS1Data('TBankAccountReport',JSON.stringify(data)).then(function (datareturn) {
                window.open('/bankingoverview?toDate=' + toDate + '&fromDate=' + fromDate + '&ignoredate='+ignoreDate,'_self');
            }).catch(function (err) {
                location.reload();
            });

        }).catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            templateObject.datatablerecords.set('');
            $('.fullScreenSpin').css('display','none');
            // Meteor._reload.reload();
        });
    }

    let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
    let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
    let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
    if(urlParametersDateFrom){
        if(urlParametersIgnoreDate == true){
            $('#dateFrom').attr('readonly', true);
            $('#dateTo').attr('readonly', true);
        }else{

            $("#dateFrom").val(urlParametersDateFrom !=''? moment(urlParametersDateFrom).format("DD/MM/YYYY"): urlParametersDateFrom);
            $("#dateTo").val(urlParametersDateTo !=''? moment(urlParametersDateTo).format("DD/MM/YYYY"): urlParametersDateTo);
        }
    }
    //tableResize();

    //Check URL to make right call.
    if (currenttablename == "tblBankingOverview") {
        templateObject.getBankingOverviewData("");
    }
    tableResize();

    $(document).on("click", "#btnRefreshList", function(e) {
        const datefrom = $("#dateFrom").val();
        const dateto = $("#dateTo").val();

    });

});

Template.transaction_list.events({
    "click .btnViewDeleted": async function(e) {
        $(".fullScreenSpin").css("display", "inline-block");
        e.stopImmediatePropagation();
        const templateObject = Template.instance();
        let currenttablename = await templateObject.tablename.get() || '';
        $('.btnViewDeleted').css('display', 'none');
        $('.btnHideDeleted').css('display', 'inline-block');

        if (currenttablename == "tblBankingOverview") {
            await clearData('TBankAccountReport');
            templateObject.getBankingOverviewData();
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

        if (currenttablename == "tblBankingOverview") {
            await clearData('TBankAccountReport');
            templateObject.getBankingOverviewData();
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

Template.transaction_list.helpers({
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
    trans_displayfields: () => {
        return Template.instance().trans_displayfields.get();
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get();
    },
    tablename: () => {
        return Template.instance().tablename.get();
    }
});
