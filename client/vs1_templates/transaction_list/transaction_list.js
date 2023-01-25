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
import '../../lib/global/globalfunction.js';

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
import PayRun from "../../js/Api/Model/PayRun";
import PayRunHandler from "../../js/ObjectManager/PayRunHandler";
let payRunHandler = new PayRunHandler();

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
        }else if(currenttablename === "tblPayRunHistory"){
            reset_data = [
                { index: 0, label: 'ID', class: 'colPayRunHistoryID', active: false, display: true, width: "" },
                { index: 1, label: 'Calendar', class: 'colPayRunCalendar', active: true, display: true, width: "100" },
                { index: 2, label: 'Period', class: 'colPayRunPeriod', active: true, display: true, width: "100" },
                { index: 3, label: 'Payment Date', class: 'colPayRunPaymentDate', active: true, display: true, width: "150" },
                { index: 4, label: 'Wages', class: 'colPayRunWages', active: true, display: true, width: "150" },
                { index: 5, label: 'Tax', class: 'colPayRunTax', active: true, display: true, width: "100" },
                { index: 6, label: 'Super', class: 'colPayRunSuper', active: true, display: true, width: "100" },
                { index: 7, label: 'Net Pay', class: 'colPayRunNetPay', active: true, display: true, width: "100" },
            ]
        }else if(currenttablename === "tblPayleaveToReview"){
            reset_data = [
                { index: 0, label: 'ID', class: 'colPayrollLeaveID', active: false, display: true, width: "" },
                { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "100" },
                { index: 2, label: 'Type', class: 'colType', active: true, display: true, width: "100" },
                { index: 3, label: 'Date', class: 'colDate', active: true, display: true, width: "150" },
                { index: 4, label: 'Description', class: 'colDescription', active: true, display: true, width: "150" },
                { index: 5, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
            ]
        }else if(currenttablename === "tblTimeSheet"){
           reset_data = [
                { index: 0, label: 'ID', class: 'colID', active: true, display: true, width: "100" },
                { index: 1, label: 'Employee', class: 'colName', active: true, display: true, width: "100" },
                { index: 2, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
                { index: 3, label: 'Job', class: 'colJob', active: true, display: true, width: "150" },
                { index: 4, label: 'Product', class: 'colRate', active: true, display: true, width: "150" },
                { index: 5, label: 'HiddenHours', class: 'colRegHours hiddenColumn', active: false, display: true, width: "100" },
                { index: 6, label: 'Hours', class: 'colRegHoursOne', active: true, display: true, width: "100" },
                { index: 7, label: 'Overtime', class: 'colOvertime', active: true, display: true, width: "100" },
                { index: 8, label: 'Double', class: 'colDouble', active: true, display: true, width: "100" },
                { index: 9, label: 'Additional', class: 'colAdditional', active: true, display: true, width: "100" },
                { index: 10, label: 'Tips', class: 'colPaycheckTips', active: true, display: true, width: "100" },
                { index: 11, label: 'Technical Notes', class: 'colNotes', active: true, display: true, width: "100" },
                { index: 12, label: 'Break', class: 'colDescription', active: true, display: true, width: "100" },
                { index: 13, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
                { index: 14, label: 'Invoiced', class: 'colInvoiced hiddenColumn', active: false, display: true, width: "100" },
                { index: 15, label: 'Hourly Rate', class: 'colHourlyrate hiddenColumn', active: false, display: true, width: "100" },
                { index: 16, label: 'View', class: 'colView', active: true, display: true, width: "100" },
            ]
        } else if (currenttablename === "tblchequelist") {
            reset_data = [
                { index: 0, label: 'ID', class:'ID', active: false, display: true, width: "0" },
                { index: 1, label: "Order Date", class: "OrderDate", active: true, display: true, width: "" },
                { index: 2, label: "#ID", class: "ChequeID", active: true, display: true, width: "" },
                { index: 3, label: "Bank Account", class: "BankAccount", active: true, display: true, width: "" },
                { index: 4, label: "Company", class: "Supplier", active: true, display: true, width: "" },
                { index: 5, label: "Reference", class: "Reference", active: true, display: true, width: "" },
                { index: 6, label: "Via", class: "Via", active: true, display: true, width: "" },
                { index: 7, label: "Currency", class: "Currency", active: true, display: true, width: "" },
                { index: 8, label: "AmountEx", class: "Amount", active: true, display: true, width: "" },
                { index: 9, label: "Paid", class: "Paid", active: true, display: true, width: "" },
                { index: 10, label: "Outstanding", class: "Outstanding", active: true, display: true, width: "" },
                { index: 11, label: "Status", class: "Status", active: true, display: true, width: "" },
                { index: 12, label: "PurchaseCustField1", class: "Custom Field 1", active: false, display: true, width: "" },
                { index: 13, label: "PurchaseCustField2", class: "Custom Field 2", active: false, display: true, width: "" },
                { index: 14, label: "Employee", class: "Employee", active: false, display: true, width: "" },
                { index: 15, label: "Comments", class: "Comments", active: false, display: true, width: "" },
                { index: 16, label: "Comments", class: "Comments", active: false, display: true, width: "" },
                { index: 17, label: "Comments", class: "Comments", active: false, display: true, width: "" },
                { index: 18, label: "Comments", class: "Comments", active: false, display: true, width: "" },
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
        if (listType === "tblBankingOverview" || listType === "tblchequelist") {
            try {
              getVS1Data("VS1_Customize").then(function (dataObject) {
                if (dataObject.length == 0) {
                  sideBarService
                    .getNewCustomFieldsWithQuery(
                      parseInt(
                        localStorage.getItem("mySessionEmployeeLoggedID")
                      ),
                      listType
                    )
                    .then(function (data) {
                      // reset_data = data.ProcessLog.CustomLayout.Columns;
                      reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
                      templateObject.showCustomFieldDisplaySettings(reset_data);
                    })
                    .catch(function (err) {});
                } else {
                  let data = JSON.parse(dataObject[0].data);
                  if (data.ProcessLog.Obj.CustomLayout.length > 0) {
                    for (
                      let i = 0;
                      i < data.ProcessLog.Obj.CustomLayout.length;
                      i++
                    ) {
                      if (
                        data.ProcessLog.Obj.CustomLayout[i].TableName ==
                        listType
                      ) {
                        reset_data =
                          data.ProcessLog.Obj.CustomLayout[i].Columns;
                        templateObject.showCustomFieldDisplaySettings(
                          reset_data
                        );
                      }
                    }
                  }
                  // handle process here
                }
              });
            } catch (error) {}
        }
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
                    $(`#${currenttablename} .${reset_data[r].class}`).removeClass('hiddenColumn');
                }
            } else if (reset_data[r].active == false) {
                if(currentTable){
                    $(`#${currenttablename} .${reset_data[r].class}`).addClass('hiddenColumn');
                }
            };
            custFields.push(customData);
        }
        await templateObject.trans_displayfields.set(custFields);
        $('.dataTable').resizable();
    }
    templateObject.initCustomFieldDisplaySettings("", currenttablename);

    let currentDate = new Date();
    let begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if ((currentDate.getMonth()+1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth()+1);
    }

    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }
    let fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();
    let toDate = currentDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
    let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

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
                                    width: "120px",
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
                                width: "120px",
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
                                width: "120px",
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

    templateObject.getPayRunHistoryData = function(){
        getVS1Data('TPayRunHistory').then(async function (dataObject) {
            if (dataObject.length == 0) {
                let data = await CachedHttp.get(erpObject.TPayRunHistory, async () => {
                    return await payRunHandler.loadFromLocal();
                  }, {
                    forceOverride: false,
                    validate: (cachedResponse) => {
                      return true;
                    }
                  });

                data = data.response;
                const payRuns = PayRun.fromList(data);
                await addVS1Data('TPayRunHistory', JSON.stringify(payRuns));
                templateObject.displayPayRunHistory(payRuns);
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayPayRunHistory(data);
            }
        }).catch(async function (err) {
            let data = await CachedHttp.get(erpObject.TPayRunHistory, async () => {
                return await payRunHandler.loadFromLocal();
              }, {
                forceOverride: false,
                validate: (cachedResponse) => {
                  return true;
                }
              });

            data = data.response;
            const payRuns = PayRun.fromList(data);
            await addVS1Data('TPayRunHistory', JSON.stringify(payRuns));
            templateObject.displayPayRunHistory(payRuns);
        });
    }

    templateObject.displayPayRunHistory = function(payRunsHistory){
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

        let lineItems = [];
        let lineItemObj = {};
        let lineID = "";
        let splashArrayPayRunHistory = new Array();
        let data = payRunsHistory.filter(p => p.stpFilling == PayRun.STPFilling.draft);
        for (let i = 0; i < data.length; i++) {
            var dataPayRunHistory = [
                data[i].calendar.ID || "",
                data[i].calendar.PayrollCalendarName || "",
                data[i].calendar.PayrollCalendarPayPeriod || "",
                moment(data[i].calendar.PayrollCalendarFirstPaymentDate).format("Do MMM YYYY") || "",
                data[i].wages || "",
                data[i].taxes || "",
                data[i].superAnnuation || "",
                data[i].calendar.netPay || "",
              ];
            splashArrayPayRunHistory.push(dataPayRunHistory);
        }
        templateObject.datatablerecords.set(splashArrayPayRunHistory);
        if (templateObject.datatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            $('#tblPayRunHistory').DataTable({
                data: splashArrayPayRunHistory,
                columnDefs: [
                    {
                        className: "colPayRunHistoryID hiddenColumn",
                        targets:0,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        className: "colPayRunCalendar",
                        targets: 1,
                        width:'100px'
                    },
                    {
                        className: "colPayRunPeriod",
                        targets: 2,
                        width:'100px'
                    },
                    {
                        className: "colPayRunPaymentDate",
                        targets: 3,
                        width:'100px'
                    },
                    {
                        className: "colPayRunWages",
                        targets: 4,
                        width:'100px'
                    },
                    {
                        className: "colPayRunTax",
                        targets: 5,
                        width:'100px'
                    },
                    {
                        className: "colPayRunSuper",
                        targets: 6,
                        width:'100px'
                    },
                    {
                        className: "colPayRunNetPay",
                        targets: 7,
                        width:'100px'
                    },
                ],
                "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [{
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "Pay Run History - " + moment().format(),
                    orientation: 'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                }, {
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Pay Run History',
                    filename: "Pay Run History - " + moment().format(),
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Pay Run History - " + moment().format(),
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialReportDatatableLoad,
                "bLengthChange": false,
                lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                info: true,
                responsive: true,
                "order": [[ 0, "desc" ],[ 2, "desc" ]],
                action: function() {
                    $('#tblPayRunHistory').DataTable().ajax.reload();
                },
                "fnDrawCallback": function (oSettings) {
                    let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblPayRunHistory_ellipsis').addClass('disabled');

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
                            }else{
                            }
                        });

                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "",searchPlaceholder: "Search List..." },
                "fnInitComplete": function () {
                    this.fnPageChange('last');
                    if(data?.Params?.Search?.replace(/\s/g, "") == ""){
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblPayRunHistory_filter");
                    }else{
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblPayRunHistory_filter");
                    }
                    $("<button class='btn btn-primary btnRefreshBankingOverview' type='button' id='btnRefreshPayRunHistory' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblPayRunHistory_filter");
                    $('.myvarFilterForm').appendTo(".colDateFilter");
                },
                "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data?.Params?.Count || 0; //get count from API data

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

        var columns = $('#tblPayRunHistory th');
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
    }
    templateObject.getPayrollLeaveData = function(){
        getVS1Data('TLeavRequest').then(async function (dataObject) {
            if (dataObject.length == 0) {
                let data = await CachedHttp.get(erpObject.TLeavRequest, async () => {
                    return await payRunHandler.loadFromLocal();
                  }, {
                    forceOverride: false,
                    validate: (cachedResponse) => {
                      return true;
                    }
                  });

                data = data.response;
                const payRuns = PayRun.fromList(data);
                await addVS1Data('TLeavRequest', JSON.stringify(payRuns));
                templateObject.displayPayrollLeaveData(payRuns);
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayPayrollLeaveData(data);
            }
        }).catch(async function (err) {
            let data = await CachedHttp.get(erpObject.TLeavRequest, async () => {
                return await payRunHandler.loadFromLocal();
              }, {
                forceOverride: false,
                validate: (cachedResponse) => {
                  return true;
                }
              });

            data = data.response;
            const payRuns = PayRun.fromList(data);
            await addVS1Data('TLeavRequest', JSON.stringify(payRuns));
            templateObject.displayPayrollLeaveData(payRuns);
        });
    }

    templateObject.displayPayrollLeaveData = function(payRunsHistory){
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

        let lineItems = [];
        let lineItemObj = {};
        let lineID = "";
        let splashArrayPayRunHistory = new Array();
        let data = payRunsHistory.filter(p => p.stpFilling == PayRun.STPFilling.draft);
        for (let i = 0; i < data.length; i++) {
            var dataPayRunHistory = [
                data[i].fields.ID || "",
                data[i].fields.LeaveType || "",
                data[i].fields.LeaveCalcMethod || "",
                data[i].fields.HoursAccruedAnnually || "",
                data[i].fields.HoursAccruedAnnuallyFullTimeEmp || "",
              ];
            splashArrayPayRunHistory.push(dataPayRunHistory);
        }
        templateObject.datatablerecords.set(splashArrayPayRunHistory);
        if (templateObject.datatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            $('#tblPayleaveToReview').DataTable({
                data: splashArrayPayRunHistory,
                columnDefs: [
                    {
                        className: "colPayrollLeaveID hiddenColumn",
                        targets:0,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        className: "colName",
                        targets: 1,
                        width:'100px'
                    },
                    {
                        className: "colType",
                        targets: 2,
                        width:'100px'
                    },
                    {
                        className: "colDate",
                        targets: 3,
                        width:'100px'
                    },
                    {
                        className: "colDescription",
                        targets: 4,
                        width:'100px'
                    },
                    {
                        className: "colStatus",
                        targets: 5,
                        width:'100px'
                    }
                ],
                "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [{
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "Pay Leave To Review - " + moment().format(),
                    orientation: 'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                }, {
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Pay Leave To Review',
                    filename: "Pay Leave To Review - " + moment().format(),
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Pay Leave To Review - " + moment().format(),
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialReportDatatableLoad,
                "bLengthChange": false,
                lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                info: true,
                responsive: true,
                "order": [[ 0, "desc" ],[ 2, "desc" ]],
                action: function() {
                    $('#tblPayleaveToReview').DataTable().ajax.reload();
                },
                "fnDrawCallback": function (oSettings) {
                    let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblPayleaveToReview_ellipsis').addClass('disabled');

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
                            }else{
                            }
                        });

                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "",searchPlaceholder: "Search List..." },
                "fnInitComplete": function () {
                    this.fnPageChange('last');
                    if(data?.Params?.Search?.replace(/\s/g, "") == ""){
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblPayleaveToReview_filter");
                    }else{
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblPayleaveToReview_filter");
                    }
                    $("<button class='btn btn-primary btnRefreshPayLeaveToReview' type='button' id='btnRefreshPayLeaveToReview' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblPayleaveToReview_filter");

                    $('.myvarFilterForm').appendTo(".colDateFilter");
                },
                "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data?.Params?.Count || 0; //get count from API data

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

        var columns = $('#tblPayleaveToReview th');
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
    }

    templateObject.getTimeSheetListData = function(){
        getVS1Data('TTimeSheet').then(async function (dataObject) {
            if (dataObject.length == 0) {
                let data = await CachedHttp.get(erpObject.TTimeSheet, async() => {
                    return await sideBarService.getAllTimeSheetList();
                }, {
                    useIndexDb: true,
                    useLocalStorage: false,
                    fallBackToLocal: true,
                    forceOverride: refresh,
                    validate: cachedResponse => {
                        return true;
                    }
                });
                await addVS1Data('TTimeSheet', JSON.stringify(data));
                templateObject.displayTimeSheetListData(data);
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayTimeSheetListData(data);
            }
        }).catch(async function (err) {
            let data = await CachedHttp.get(erpObject.TTimeSheet, async() => {
                return await sideBarService.getAllTimeSheetList();
            }, {
                useIndexDb: true,
                useLocalStorage: false,
                fallBackToLocal: true,
                forceOverride: refresh,
                validate: cachedResponse => {
                    return true;
                }
            });
            await addVS1Data('TTimeSheet', JSON.stringify(data));
            templateObject.displayTimeSheetListData(data);
        });
    }

    templateObject.displayTimeSheetListData = function(data){
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

        let lineItems = [];
        let lineItemObj = {};
        let lineID = "";
        let splashArrayTimeSheetList = new Array();
        for (let t = 0; t < data.ttimesheet.length; t++) {
            var dataTimeSheet = [
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
                data.ttimesheet[t].fields.ID || "",
              ];
            splashArrayTimeSheetList.push(dataTimeSheet);
        }
        templateObject.datatablerecords.set(splashArrayTimeSheetList);
        if (templateObject.datatablerecords.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }
        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function() {
            $('#tblTimeSheet').DataTable({
                data: splashArrayTimeSheetList,
                columnDefs: [
                    {
                        className: "colID",
                        targets:0,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[0]);
                        }
                    },
                    {
                        className: "colName",
                        targets: 1,
                        width:'100px'
                    },
                    {
                        className: "colDate",
                        targets: 2,
                        width:'100px'
                    },
                    {
                        className: "colJob",
                        targets: 3,
                        width:'100px'
                    },
                    {
                        className: "colRate",
                        targets: 4,
                        width:'100px'
                    },
                    {
                        className: "colRegHours hiddenColumn",
                        targets: 5,
                        width:'100px'
                    },
                    {
                        className: "colRegHoursOne",
                        targets: 6,
                        width:'100px'
                    },
                    {
                        className: "colOvertime",
                        targets: 7,
                        width:'100px'
                    },
                    {
                        className: "colDouble",
                        targets: 8,
                        width:'100px'
                    },
                    {
                        className: "colAdditional",
                        targets: 9,
                        width:'100px'
                    },
                    {
                        className: "colPaycheckTips",
                        targets: 10,
                        width:'100px'
                    },
                    {
                        className: "colNotes",
                        targets: 11,
                        width:'100px'
                    },
                    {
                        className: "colDescription",
                        targets: 12,
                        width:'100px'
                    },
                    {
                        className: "colStatus",
                        targets: 13,
                        width:'100px'
                    },
                    {
                        className: "colInvoiced hiddenColumn",
                        targets: 14,
                        width:'100px'
                    },
                    {
                        className: "colHourlyrate hiddenColumn",
                        targets: 15,
                        width:'100px'
                    },
                    {
                        className: "colView",
                        targets: 16,
                        width:'100px'
                    },
                ],
                "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [{
                    extend: 'csvHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: "Pay Leave To Review - " + moment().format(),
                    orientation: 'portrait',
                    exportOptions: {
                        columns: ':visible'
                    }
                }, {
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Pay Leave To Review',
                    filename: "Pay Leave To Review - " + moment().format(),
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                    {
                        extend: 'excelHtml5',
                        title: '',
                        download: 'open',
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Pay Leave To Review - " + moment().format(),
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialReportDatatableLoad,
                "bLengthChange": false,
                lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                info: true,
                responsive: true,
                "order": [[ 0, "desc" ],[ 2, "desc" ]],
                action: function() {
                    $('#tblTimeSheet').DataTable().ajax.reload();
                },
                "fnDrawCallback": function (oSettings) {
                    let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblTimeSheet_ellipsis').addClass('disabled');

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
                            }else{
                            }
                        });

                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                },
                language: { search: "",searchPlaceholder: "Search List..." },
                "fnInitComplete": function () {
                    this.fnPageChange('last');
                    if(data?.Params?.Search?.replace(/\s/g, "") == ""){
                        $("<button class='btn btn-danger btnHideDeleted' type='button' id='btnHideDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i>Hide Deleted</button>").insertAfter("#tblTimeSheet_filter");
                    }else{
                        $("<button class='btn btn-primary btnViewDeleted' type='button' id='btnViewDeleted' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fa fa-trash' style='margin-right: 5px'></i>View Deleted</button>").insertAfter("#tblTimeSheet_filter");
                    }
                    $("<button class='btn btn-primary btnRefreshTimeSheet' type='button' id='btnRefreshTimeSheet' style='padding: 4px 10px; font-size: 16px; margin-left: 14px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTimeSheet_filter");

                    $('.myvarFilterForm').appendTo(".colDateFilter");
                },
                "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                    let countTableData = data?.Params?.Count || 0; //get count from API data

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

        var columns = $('#tblTimeSheet th');
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
    }

    templateObject.getChequeListData = function() {
        getVS1Data('TChequeList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllChequeListData(prevMonth11Date,toDate, true,initialReportLoad,0).then(function(data) {
                    templateObject.displayChequeListData(data);
                }).catch(function(err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayChequeListData(data);
            }
        }).catch(function(err) {
            sideBarService.getAllChequeListData(prevMonth11Date,toDate, true,initialReportLoad,0).then(function(data) {
                templateObject.displayChequeListData(data);
            }).catch(function(err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });
    };

    templateObject.displayChequeListData = function (data) {
        addVS1Data('TChequeList',JSON.stringify(data));
        if (data.Params.IgnoreDates == true) {
            $('#dateFrom').attr('readonly', true);
            $('#dateTo').attr('readonly', true);

        } else {
            $('#dateFrom').attr('readonly', false);
            $('#dateTo').attr('readonly', false);
            $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
            $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
        }
        for (let i = 0; i < data.tchequelist.length; i++) {
            let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalAmount) || 0.00;
            let totalTax = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalTax) || 0.00;
            let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].TotalAmountInc) || 0.00;
            let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].Balance) || 0.00;
            let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tchequelist[i].Payment) || 0.00;

              if(data.tchequelist[i].TotalAmount > 0 && data.tchequelist[i].TotalAmount != 0){
                totalAmountEx = utilityService.modifynegativeCurrencyFormat(-Math.abs(data.tchequelist[i].TotalAmount)) || 0.00;
              }else{
                totalAmountEx = utilityService.modifynegativeCurrencyFormat(Math.abs(data.tchequelist[i].TotalAmount)) || 0.00;
              }

              if(data.tchequelist[i].TotalTax > 0 && data.tchequelist[i].TotalTax != 0){
                totalTax = utilityService.modifynegativeCurrencyFormat(-Math.abs(data.tchequelist[i].TotalTax)) || 0.00;
              }else{
                totalTax = utilityService.modifynegativeCurrencyFormat(Math.abs(data.tchequelist[i].TotalTax)) || 0.00;
              }


              if(data.tchequelist[i].TotalAmountInc > 0 && data.tchequelist[i].TotalAmountInc != 0){
                totalAmount = utilityService.modifynegativeCurrencyFormat(-Math.abs(data.tchequelist[i].TotalAmountInc)) || 0.00;
              }else{
                totalAmount = utilityService.modifynegativeCurrencyFormat(Math.abs(data.tchequelist[i].TotalAmountInc)) || 0.00;
              }


              if(data.tchequelist[i].Balance > 0 && data.tchequelist[i].Balance != 0){
                totalOutstanding = utilityService.modifynegativeCurrencyFormat(-Math.abs(data.tchequelist[i].Balance)) || 0.00;
              }else{
                totalOutstanding = utilityService.modifynegativeCurrencyFormat(Math.abs(data.tchequelist[i].Balance)) || 0.00;
              }


            let orderstatus = data.tchequelist[i].OrderStatus || '';
            if (data.tchequelist[i].Deleted == true){
                orderstatus = "Deleted";
            } else if (data.tchequelist[i].SupplierName == ''){
                orderstatus = "Deleted";
            }
            const dataList = [
                data.tchequelist[i].OrderDate != '' ? moment(data.tchequelist[i].OrderDate).format("YYYY/MM/DD") : data.tchequelist[i].OrderDate,
                `<span style="display:none;">{{item.sortdate}}</span>${data.tchequelist[i].OrderDate != '' ? moment(data.tchequelist[i].OrderDate).format("DD/MM/YYYY") : data.tchequelist[i].OrderDate}`,
                data.tchequelist[i].PurchaseOrderID || '',
                data.tchequelist[i].Account || '',
                data.tchequelist[i].InvoiceNumber || '',
                data.tchequelist[i].SupplierName || '',
                data.tchequelist[i].RefNo || '',
                data.tchequelist[i].Shipping || '',
                data.tchequelist[i].ForeignExchangeCode || '',
                totalAmountEx || 0.00,
                totalTax || 0.00,
                totalAmount || 0.00,
                totalPaid || 0.00,
                totalOutstanding || 0.00,
                orderstatus || '',
                '' || '',
                '' || '',
                data.tchequelist[i].Employee || '',
                data.tchequelist[i].Comments || '',
            ];
            if (orderstatus != "Deleted") {
                dataTableList.push(dataList);
            }

        }
        templateObject.datatablerecords.set(dataTableList);

        if (templateObject.datatablerecords.get()) {

            setTimeout(function() {
                MakeNegative();
            }, 100);
        }

        let trans_displayfields = templateObject.trans_displayfields.get();
        console.log('here', trans_displayfields)
        setTimeout(function() {
            $('.fullScreenSpin').css('display', 'none');
            $('#tblchequelist').DataTable({
                data: dataTableList,
                columnDefs: [
                    {
                        targets: 0,
                        className: "colSortDate hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 1,
                        className: trans_displayfields[1].active == true ? "colOrderDate" : "colOrderDate hiddenColumn",
                        width: "100px",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).closest("tr").attr("id", rowData[2]);
                            $(td).closest("tr").addClass("dnd-moved");
                        }
                    },
                    {
                        targets: 2,
                        className: trans_displayfields[2].active == true ? "colChequeID" : "colChequeID hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 3,
                        className: trans_displayfields[3].active == true ? "colBankAccount" : "colBankAccount hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 4,
                        className: trans_displayfields[4].active == true ? "colPurchaseNo" : "colPurchaseNo hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 5,
                        className: trans_displayfields[5].active == true ? "colSupplier" : "colSupplier hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 6,
                        className: trans_displayfields[6].active == true ? "colReference" : "colReference hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 7,
                        className: trans_displayfields[7].active == true ? "colVia" : "colVia hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 8,
                        className: trans_displayfields[8].active == true ? "colCurrency" : "colCurrency hiddenColumn",
                        width: "120px",
                    },
                    {
                        targets: 9,
                        className: trans_displayfields[9].active == true ? "colAmountEx" : "colAmountEx hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 10,
                        className: trans_displayfields[10].active == true ? "colTax" : "colTax hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 11,
                        className: trans_displayfields[11].active == true ? "colAmount" : "colAmount hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 12,
                        className: trans_displayfields[12].active == true ? "colPaid" : "colPaid hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 13,
                        className: trans_displayfields[13].active == true ? "colBalanceOutstanding" : "colBalanceOutstanding hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 14,
                        className: trans_displayfields[14].active == true ? "colStatus" : "colStatus hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 15,
                        className: trans_displayfields[15].active == true ? "colPurchaseCustField1" : "colPurchaseCustField1 hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 16,
                        className: trans_displayfields[16].active == true ? "colPurchaseCustField2" : "colPurchaseCustField2 hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 17,
                        className: trans_displayfields[17].active == true ? "colEmployee" : "colEmployee hiddenColumn",
                        width: "100px",
                    },
                    {
                        targets: 18,
                        className: trans_displayfields[18].active == true ? "colComments" : "colComments hiddenColumn",
                        width: "100px",
                    },
                ],
              "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [{
                    extend: 'excelHtml5',
                    text: '',
                    download: 'open',
                    className: "btntabletocsv hiddenColumn",
                    filename: chequeSpelling+" "+"List - " + moment().format(),
                    orientation: 'portrait',
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            body: function ( data, row, column ) {
                                if(data.includes("</span>")){
                                    var res = data.split("</span>");
                                    data = res[1];
                                }

                                return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                            }
                        }
                    }
                }, {
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: chequeSpelling,
                    filename: chequeSpelling+" "+"List - " + moment().format(),
                    exportOptions: {
                        columns: ':visible',
                        stripHtml: false
                    }
                }],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialReportDatatableLoad,
                "bLengthChange": false,
                lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                info: true,
                responsive: true,
                "order": [[ 0, "desc" ],[ 2, "desc" ]],
                action: function() {
                    $('#tblchequelist').DataTable().ajax.reload();
                },
                "fnDrawCallback": function (oSettings) {
                    let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblchequelist_ellipsis').addClass('disabled');

                    if(oSettings._iDisplayLength == -1){
                        if(oSettings.fnRecordsDisplay() > 150){
                            $('.paginate_button.page-item.previous').addClass('disabled');
                            $('.paginate_button.page-item.next').addClass('disabled');
                        }
                    }else{

                    }
                    if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container())
                        .on('click', function(){
                            $('.fullScreenSpin').css('display','inline-block');
                            let dataLenght = oSettings._iDisplayLength;
                            const dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                            const dateTo = new Date($("#dateTo").datepicker("getDate"));

                            let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                            let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                            if(data.Params.IgnoreDates == true){
                                sideBarService.getAllChequeListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                    getVS1Data('TChequeList').then(function (dataObjectold) {
                                        if(dataObjectold.length == 0){

                                        }else{
                                            let dataOld = JSON.parse(dataObjectold[0].data);

                                            const thirdaryData = $.merge($.merge([], dataObjectnew.tchequelist), dataOld.tchequelist);
                                            let objCombineData = {
                                                Params: dataOld.Params,
                                                tchequelist:thirdaryData
                                            };


                                            addVS1Data('TChequeList',JSON.stringify(objCombineData)).then(function (datareturn) {

                                                templateObject.resetData(objCombineData);
                                                $('.fullScreenSpin').css('display','none');
                                            }).catch(function (err) {
                                                $('.fullScreenSpin').css('display','none');
                                            });

                                        }
                                    }).catch(function (err) {

                                    });

                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display','none');
                                });
                            }else{
                                sideBarService.getAllChequeListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                    getVS1Data('TChequeList').then(function (dataObjectold) {
                                        if(dataObjectold.length == 0){

                                        }else{
                                            let dataOld = JSON.parse(dataObjectold[0].data);

                                            var thirdaryData = $.merge($.merge([], dataObjectnew.tchequelist), dataOld.tchequelist);
                                            let objCombineData = {
                                                Params: dataOld.Params,
                                                tchequelist:thirdaryData
                                            }


                                            addVS1Data('TChequeList',JSON.stringify(objCombineData)).then(function (datareturn) {

                                                templateObject.resetData(objCombineData);
                                                $('.fullScreenSpin').css('display','none');
                                            }).catch(function (err) {
                                                $('.fullScreenSpin').css('display','none');
                                            });

                                        }
                                    }).catch(function (err) {

                                    });

                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display','none');
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
                    $("<button class='btn btn-primary btnRefreshCheque' type='button' id='btnRefreshCheque' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblchequelist_filter");
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

        const columns = $('#tblchequelist th');
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
        $('#tblchequelist tbody').on('click', 'tr', function() {
            var listData = $(this).closest('tr').attr('id');
            var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
            if (listData) {
                if(checkDeleted == "Deleted"){
                    swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
                }else{
                    FlowRouter.go('/chequecard?id=' + listData);

                }
            }
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
    } else if (currenttablename === "tblPayRunHistory"){
        templateObject.getPayRunHistoryData("");
    }else if (currenttablename === "tblPayleaveToReview"){
        templateObject.getPayrollLeaveData("");
    }else if (currenttablename === "tblTimeSheet"){
        templateObject.getTimeSheetListData()
    } else if (currenttablename === "tblchequelist") {
        templateObject.getChequeListData()
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
    'click .chkDatatable': async function(event) {
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');

        let range = $('.rngRange' +  columnDataValue).val() || 0;
        await $('.' + columnDataValue).css('width', range);
        $('.dataTable').resizable();

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
        //console.log("display", Template.instance().trans_displayfields.get());
        return Template.instance().trans_displayfields.get();
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get();
    },
    tablename: () => {
        return Template.instance().tablename.get();
    }
});
