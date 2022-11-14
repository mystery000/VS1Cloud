import { PurchaseBoardService } from '../js/purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { DashBoardService } from "../Dashboard/dashboard-service";
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
import { AccountService } from "../accounts/account-service";
import { ReportService } from "../reports/report-service";
import { OrganisationService } from '../js/organisation-service';
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { Random } from 'meteor/random';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import { autoTable } from 'jspdf-autotable';
import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let reportService = new ReportService();
let organisationService = new OrganisationService();
var times = 0;

Template.basreturn.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.BillNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.record = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.BillId = new ReactiveVar();
    templateObject.selectedCurrency = new ReactiveVar([]);
    templateObject.inputSelectedCurrency = new ReactiveVar([]);
    templateObject.currencySymbol = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.termrecords = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);


    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();

    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();

    templateObject.statusrecords = new ReactiveVar([]);

    templateObject.totalCredit = new ReactiveVar();
    templateObject.totalCredit.set(Currency + '0.00');
    templateObject.totalDebit = new ReactiveVar();
    templateObject.totalDebit.set(Currency + '0.00');

    templateObject.totalCreditInc = new ReactiveVar();
    templateObject.totalCreditInc.set(Currency + '0.00');
    templateObject.totalDebitInc = new ReactiveVar();
    templateObject.totalDebitInc.set(Currency + '0.00');
    templateObject.currencyList = new ReactiveVar([]);



    templateObject.taxRateList = new ReactiveVar([]);
    templateObject.accountsSummaryListT2 = new ReactiveVar([]);
    templateObject.accountsSummaryListT2_2 = new ReactiveVar([]);
    templateObject.accountsSummaryListT3 = new ReactiveVar([]);
    templateObject.taxSummaryListT1 = new ReactiveVar([]);
    templateObject.taxSummaryListT3 = new ReactiveVar([]);
    templateObject.accountsList = new ReactiveVar([]);
    templateObject.availableCategories = new ReactiveVar([]);
    templateObject.pageTitle = new ReactiveVar();
    templateObject.getId = new ReactiveVar();
    templateObject.reasonT4 = new ReactiveVar([]);
    templateObject.reasonF4 = new ReactiveVar([]);
    templateObject.basreturnData = new ReactiveVar([]);
});

Template.basreturn.onRendered(function() {
    let templateObject = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let accountService = new AccountService();
    let purchaseService = new PurchaseBoardService();
    let taxRateList = new Array();
    let categories = [];
    let categoryAccountList = [];
    let usedCategories = [];
    const accountTypeList = [];
    const dataTableList = [];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let reasonT4 = [
        { val: "T4-1", title: "Mergers, acquisitions and takeovers" },
        { val: "T4-2", title: "Cessation of business activity" },
        { val: "T4-3", title: "Expected utilisation of losses of a revenue or capital nature" },
        { val: "T4-4", title: "Significant (abnormal) transactions affecting income or expenses" },
        { val: "T4-5", title: "Change in trading conditions affecting income or expenses" },
        { val: "T4-6", title: "Domestic or foreign financial market changes" },
        { val: "T4-7", title: "Change in investment strategies or policies" },
        { val: "T4-8", title: "Change in product mix" },
        { val: "T4-9", title: "Business expansion or contraction" },
        { val: "T4-10", title: "Change in entity structure" },
        { val: "T4-11", title: "Internal or external restructuring of business activity" },
        { val: "T4-12", title: "Change in any legislation" },
        { val: "T4-13", title: "Change in profit margin" },
    ];

    let reasonF4 = [
        { val: "F4-1", title: "Benefits ceased/reduced and salary increased" },
        { val: "F4-2", title: "Benefits ceased/reduced and no compensation to employees" },
        { val: "F4-3", title: "Fewer employees" },
        { val: "F4-4", title: "Increase in employee contribution" },
        { val: "F4-5", title: "Section 65J rebate now claimed" },
        { val: "F4-6", title: "Liquidation, receiver/manager appointed" },
        { val: "F4-7", title: "None of the above" },
    ];

    templateObject.reasonT4.set(reasonT4);
    templateObject.reasonF4.set(reasonF4);

    // accountService
    //     .getBASReturnDetail()
    //     .then(function(data) {
    //     })
    //     .catch(function(err) {
    //         // Bert.alert('<strong>' + err + '</strong>!', 'danger');
    //         $(".fullScreenSpin").css("display", "none");
    //         // Meteor._reload.reload();
    //     });

    templateObject.getAllBasReturnData = function() {

        var url = FlowRouter.current().path;
        var getid = "";
        if (url.indexOf('?id=') > 0) {
            getid = url.split('?id=');
            if (getid[1]) {
                getid = getid[1];
            } else {
                getid = "";
            }
        }

        getVS1Data('TBASReturn').then(function(dataObject) {
            if (dataObject.length == 0) {
                // sideBarService.getTJournalEntryListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function(data) {
                //     let lineItems = [];
                //     let lineItemObj = {};
                //     addVS1Data('TJournalEntryList', JSON.stringify(data));
                //     if (data.Params.IgnoreDates == true) {
                //         $('#dateFrom').attr('readonly', true);
                //         $('#dateTo').attr('readonly', true);
                //         //FlowRouter.go('/journalentrylist?ignoredate=true');
                //     } else {
                //         $('#dateFrom').attr('readonly', false);
                //         $('#dateTo').attr('readonly', false);
                //         $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                //         $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                //     }
                //     for (let i = 0; i < data.tjournalentrylist.length; i++) {
                //         let totalDebitAmount = utilityService.modifynegativeCurrencyFormat(data.tjournalentrylist[i].DebitAmount) || 0.00;
                //         let totalCreditAmount = utilityService.modifynegativeCurrencyFormat(data.tjournalentrylist[i].CreditAmount) || 0.00;
                //         // Currency+''+data.tjournalentry[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                //         let totalTaxAmount = utilityService.modifynegativeCurrencyFormat(data.tjournalentrylist[i].TaxAmount) || 0.00;
                //         let orderstatus = data.tjournalentrylist[i].Deleted || '';
                //         if (data.tjournalentrylist[i].Deleted == true) {
                //             orderstatus = "Deleted";
                //         } else if (data.tjournalentrylist[i].IsOnHOLD == true) {
                //             orderstatus = "On Hold";
                //         } else if (data.tjournalentrylist[i].Reconciled == true) {
                //             orderstatus = "Rec";
                //         }

                //         var dataList = {
                //             id: data.tjournalentrylist[i].GJID || '',
                //             employee: data.tjournalentrylist[i].EmployeeName || '',
                //             sortdate: data.tjournalentrylist[i].TransactionDate != '' ? moment(data.tjournalentrylist[i].TransactionDate).format("YYYY/MM/DD") : data.tjournalentrylist[i].TransactionDate,
                //             transactiondate: data.tjournalentrylist[i].TransactionDate != '' ? moment(data.tjournalentrylist[i].TransactionDate).format("DD/MM/YYYY") : data.tjournalentrylist[i].TransactionDate,
                //             accountname: data.tjournalentrylist[i].AccountName || '',
                //             department: data.tjournalentrylist[i].ClassName || '',
                //             entryno: data.tjournalentrylist[i].GJID || '',
                //             debitamount: totalDebitAmount || 0.00,
                //             creditamount: totalCreditAmount || 0.00,
                //             taxamount: totalTaxAmount || 0.00,
                //             orderstatus: orderstatus || '',
                //             accountno: data.tjournalentrylist[i].AccountNumber || '',
                //             employeename: data.tjournalentrylist[i].EmployeeName || '',

                //             memo: data.tjournalentrylist[i].Memo || '',
                //         };
                //         dataTableList.push(dataList);
                //         templateObject.basreturnData.set(dataTableList);
                //     }

                //     $('.fullScreenSpin').css('display', 'none');
                // }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
                // });
            } else {
                let data = JSON.parse(dataObject[0].data);
                for (let i = 0; i < data.length; i++) {
                    var dataList = {
                        basnumber: data[i].basNumber || '',
                        description: data[i].description || '',
                        accountingMethod: data[i].accountingMethod,
                        tab1datemethod: (data[i].basReturnTab1.datemethod == "q") ? "Quarterly" : "Monthly",
                        tab1startDate: (data[i].basReturnTab1.startDate == "0000-00-00") ? "" : data[i].basReturnTab1.startDate,
                        tab1endDate: (data[i].basReturnTab1.startDate == "0000-00-00") ? "" : data[i].basReturnTab1.endDate,
                        tab2datemethod: (data[i].basReturnTab2.datemethod == "q") ? "Quarterly" : "Monthly",
                        tab2startDate: (data[i].basReturnTab2.startDate == "0000-00-00") ? "" : data[i].basReturnTab2.startDate,
                        tab2endDate: (data[i].basReturnTab2.startDate == "0000-00-00") ? "" : data[i].basReturnTab2.endDate,
                        tab2datemethod2: (data[i].basReturnTab2.datemethod_2 == "q") ? "Quarterly" : "Monthly",
                        tab2startDate2: (data[i].basReturnTab2.startDate_2 == "0000-00-00") ? "" : data[i].basReturnTab2.startDate_2,
                        tab2endDate2: (data[i].basReturnTab2.startDate_2 == "0000-00-00") ? "" : data[i].basReturnTab2.endDate_2,
                        tab3datemethod: (data[i].basReturnTab3.datemethod == "q") ? "Quarterly" : "Monthly",
                        tab3startDate: (data[i].basReturnTab3.startDate == "0000-00-00") ? "" : data[i].basReturnTab3.startDate,
                        tab3endDate: (data[i].basReturnTab3.startDate == "0000-00-00") ? "" : data[i].basReturnTab3.endDate,
                    };
                    dataTableList.push(dataList);

                    if (getid == "") {
                        if (i == 0) {
                            if (dataList.accountingMethod == "Accrual") {
                                $("#accountingmethod1").prop('checked', true);
                                $("#accountingmethod2").prop('checked', false);
                            } else {
                                $("#accountingmethod1").prop('checked', false);
                                $("#accountingmethod2").prop('checked', true);
                            }

                            if (dataList.tab1datemethod == "Quarterly") {
                                $("#datemethod1").prop('checked', true);
                                $("#datemethod2").prop('checked', false);
                            } else {
                                $("#datemethod1").prop('checked', false);
                                $("#datemethod2").prop('checked', true);
                            }

                            if (dataList.tab2datemethod == "Quarterly") {
                                $("#datemethod1-t2").prop('checked', true);
                                $("#datemethod2-t2").prop('checked', false);
                            } else {
                                $("#datemethod1-t2").prop('checked', false);
                                $("#datemethod2-t2").prop('checked', true);
                            }

                            if (dataList.tab2datemethod2 == "Quarterly") {
                                $("#datemethod1-t2-2").prop('checked', true);
                                $("#datemethod2-t2-2").prop('checked', false);
                            } else {
                                $("#datemethod1-t2-2").prop('checked', false);
                                $("#datemethod2-t2-2").prop('checked', true);
                            }

                            if (dataList.tab3datemethod == "Quarterly") {
                                $("#datemethod1-t3").prop('checked', true);
                                $("#datemethod2-t3").prop('checked', false);
                            } else {
                                $("#datemethod1-t3").prop('checked', false);
                                $("#datemethod2-t3").prop('checked', true);
                            }
                        }
                        if ($("#previousStartDate").val() == "" && dataList.tab1startDate != "" && dataList.tab1endDate != "") {
                            $("#previousStartDate").val(dataList.tab1startDate);
                            $("#previousEndDate").val(dataList.tab1endDate);

                            var fromDate = new Date(dataList.tab1endDate.split("-")[0], parseInt(dataList.tab1endDate.split("-")[1]), 1);
                            fromDate = moment(fromDate).format("YYYY-MM-DD");
                            $("#beginmonthlydate").val(fromDate.split("-")[1] + "-01");
                            $("#currentyear").val(fromDate.split("-")[0]);
                            if ($("#datemethod1").prop('checked') == true) {
                                var endMonth = Math.ceil(parseInt(fromDate.split("-")[1]) / 3) * 3;
                                toDate = new Date(fromDate.split("-")[0], (parseInt(endMonth)), 0);
                                toDate = moment(toDate).format("YYYY-MM-DD");
                                $("#endDate").val(toDate);
                            } else {
                                var endMonth = parseInt(fromDate.split("-")[1]);
                                toDate = new Date(fromDate.split("-")[0], (parseInt(endMonth)), 0);
                                toDate = moment(toDate).format("YYYY-MM-DD");
                                $("#endDate").val(toDate);
                            }
                        }
                        if ($("#previousStartDate-t2").val() == "" && dataList.tab2startDate != "" && dataList.tab2endDate != "") {
                            $("#previousStartDate-t2").val(dataList.tab2startDate);
                            $("#previousEndDate-t2").val(dataList.tab2endDate);

                            var fromDate = new Date(dataList.tab2endDate.split("-")[0], parseInt(dataList.tab2endDate.split("-")[1]), 1);
                            fromDate = moment(fromDate).format("YYYY-MM-DD");
                            $("#beginmonthlydate-t2").val(fromDate.split("-")[1] + "-01");
                            $("#currentyear-t2").val(fromDate.split("-")[0]);
                            if ($("#datemethod1-t2").prop('checked') == true) {
                                var endMonth = Math.ceil(parseInt(fromDate.split("-")[1]) / 3) * 3;
                                toDate = new Date(fromDate.split("-")[0], (parseInt(endMonth)), 0);
                                toDate = moment(toDate).format("YYYY-MM-DD");
                                $("#endDate-t2").val(toDate);
                            } else {
                                var endMonth = parseInt(fromDate.split("-")[1]);
                                toDate = new Date(fromDate.split("-")[0], (parseInt(endMonth)), 0);
                                toDate = moment(toDate).format("YYYY-MM-DD");
                                $("#endDate-t2").val(toDate);
                            }
                        }
                        if ($("#previousStartDate-t2-2").val() == "" && dataList.tab2startDate2 != "" && dataList.tab2endDate2 != "") {
                            $("#previousStartDate-t2-2").val(dataList.tab2startDate2);
                            $("#previousEndDate-t2-2").val(dataList.tab2endDate2);

                            var fromDate = new Date(dataList.tab2endDate2.split("-")[0], parseInt(dataList.tab2endDate2.split("-")[1]), 1);
                            fromDate = moment(fromDate).format("YYYY-MM-DD");
                            $("#beginmonthlydate-t2-2").val(fromDate.split("-")[1] + "-01");
                            $("#currentyear-t2-2").val(fromDate.split("-")[0]);
                            if ($("#datemethod1-t2-2").prop('checked') == true) {
                                var endMonth = Math.ceil(parseInt(fromDate.split("-")[1]) / 3) * 3;
                                toDate = new Date(fromDate.split("-")[0], (parseInt(endMonth)), 0);
                                toDate = moment(toDate).format("YYYY-MM-DD");
                                $("#endDate-t2-2").val(toDate);
                            } else {
                                var endMonth = parseInt(fromDate.split("-")[1]);
                                toDate = new Date(fromDate.split("-")[0], (parseInt(endMonth)), 0);
                                toDate = moment(toDate).format("YYYY-MM-DD");
                                $("#endDate-t2-2").val(toDate);
                            }
                        }
                        if ($("#previousStartDate-t3").val() == "" && dataList.tab3startDate != "" && dataList.tab3endDate != "") {
                            $("#previousStartDate-t3").val(dataList.tab3startDate);
                            $("#previousEndDate-t3").val(dataList.tab3endDate);

                            var fromDate = new Date(dataList.tab3endDate.split("-")[0], parseInt(dataList.tab3endDate.split("-")[1]), 1);
                            fromDate = moment(fromDate).format("YYYY-MM-DD");
                            $("#beginmonthlydate-t3").val(fromDate.split("-")[1] + "-01");
                            $("#currentyear-t3").val(fromDate.split("-")[0]);
                            if ($("#datemethod1-t3").prop('checked') == true) {
                                var endMonth = Math.ceil(parseInt(fromDate.split("-")[1]) / 3) * 3;
                                toDate = new Date(fromDate.split("-")[0], (parseInt(endMonth)), 0);
                                toDate = moment(toDate).format("YYYY-MM-DD");
                                $("#endDate-t3").val(toDate);
                            } else {
                                var endMonth = parseInt(fromDate.split("-")[1]);
                                toDate = new Date(fromDate.split("-")[0], (parseInt(endMonth)), 0);
                                toDate = moment(toDate).format("YYYY-MM-DD");
                                $("#endDate-t3").val(toDate);
                            }
                        }
                    } else {
                        if (getid > dataList.basnumber) {
                            if ($("#previousStartDate").val() == "" && dataList.tab1startDate != "" && dataList.tab1endDate != "") {
                                $("#previousStartDate").val(dataList.tab1startDate);
                                $("#previousEndDate").val(dataList.tab1endDate);
                            }
                            if ($("#previousStartDate-t2").val() == "" && dataList.tab2startDate != "" && dataList.tab2endDate != "") {
                                $("#previousStartDate-t2").val(dataList.tab2startDate);
                                $("#previousEndDate-t2").val(dataList.tab2endDate);
                            }
                            if ($("#previousStartDate-t2-2").val() == "" && dataList.tab2startDate2 != "" && dataList.tab2endDate2 != "") {
                                $("#previousStartDate-t2-2").val(dataList.tab2startDate2);
                                $("#previousEndDate-t2-2").val(dataList.tab2endDate2);
                            }
                            if ($("#previousStartDate-t3").val() == "" && dataList.tab3startDate != "" && dataList.tab3endDate != "") {
                                $("#previousStartDate-t3").val(dataList.tab3startDate);
                                $("#previousEndDate-t3").val(dataList.tab3endDate);
                            }
                        }
                    }
                }
                templateObject.basreturnData.set(dataTableList);

                $('.fullScreenSpin').css('display', 'none');
            }
        }).catch(function(err) {
            // sideBarService.getTJournalEntryListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function(data) {
            //     let lineItems = [];
            //     let lineItemObj = {};
            //     addVS1Data('TJournalEntryList', JSON.stringify(data));
            //     if (data.Params.IgnoreDates == true) {
            //         $('#dateFrom').attr('readonly', true);
            //         $('#dateTo').attr('readonly', true);
            //         //FlowRouter.go('/journalentrylist?ignoredate=true');
            //     } else {
            //         $('#dateFrom').attr('readonly', false);
            //         $('#dateTo').attr('readonly', false);
            //         $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
            //         $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
            //     }
            //     for (let i = 0; i < data.tjournalentrylist.length; i++) {
            //         let totalDebitAmount = utilityService.modifynegativeCurrencyFormat(data.tjournalentrylist[i].DebitAmount) || 0.00;
            //         let totalCreditAmount = utilityService.modifynegativeCurrencyFormat(data.tjournalentrylist[i].CreditAmount) || 0.00;
            //         // Currency+''+data.tjournalentry[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
            //         let totalTaxAmount = utilityService.modifynegativeCurrencyFormat(data.tjournalentrylist[i].TaxAmount) || 0.00;
            //         let orderstatus = data.tjournalentrylist[i].Deleted || '';
            //         if (data.tjournalentrylist[i].Deleted == true) {
            //             orderstatus = "Deleted";
            //         } else if (data.tjournalentrylist[i].IsOnHOLD == true) {
            //             orderstatus = "On Hold";
            //         } else if (data.tjournalentrylist[i].Reconciled == true) {
            //             orderstatus = "Rec";
            //         }

            //         var dataList = {
            //             id: data.tjournalentrylist[i].GJID || '',
            //             employee: data.tjournalentrylist[i].EmployeeName || '',
            //             sortdate: data.tjournalentrylist[i].TransactionDate != '' ? moment(data.tjournalentrylist[i].TransactionDate).format("YYYY/MM/DD") : data.tjournalentrylist[i].TransactionDate,
            //             transactiondate: data.tjournalentrylist[i].TransactionDate != '' ? moment(data.tjournalentrylist[i].TransactionDate).format("DD/MM/YYYY") : data.tjournalentrylist[i].TransactionDate,
            //             accountname: data.tjournalentrylist[i].AccountName || '',
            //             department: data.tjournalentrylist[i].ClassName || '',
            //             entryno: data.tjournalentrylist[i].GJID || '',
            //             debitamount: totalDebitAmount || 0.00,
            //             creditamount: totalCreditAmount || 0.00,
            //             taxamount: totalTaxAmount || 0.00,
            //             orderstatus: orderstatus || '',
            //             accountno: data.tjournalentrylist[i].AccountNumber || '',
            //             employeename: data.tjournalentrylist[i].EmployeeName || '',

            //             memo: data.tjournalentrylist[i].Memo || '',
            //         };
            //         dataTableList.push(dataList);
            //         templateObject.datatablerecords.set(dataTableList);
            //     }

            //     if (templateObject.datatablerecords.get()) {
            //         setTimeout(function() {
            //             MakeNegative();
            //         }, 100);
            //     }

            //     $('.fullScreenSpin').css('display', 'none');
            // }).catch(function(err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display', 'none');
            // Meteor._reload.reload();
            // });
        });
    }
    templateObject.getAllBasReturnData();

    templateObject.getReceiptCategoryList = function() {
        getVS1Data('TReceiptCategory').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getReceiptCategory().then(function(data) {
                    setReceiptCategory(data);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                setReceiptCategory(data);
            }
        }).catch(function(err) {
            sideBarService.getReceiptCategory().then(function(data) {
                setReceiptCategory(data);
            });
        });
    };

    function setReceiptCategory(data) {
        for (let i in data.treceiptcategory) {
            if (data.treceiptcategory.hasOwnProperty(i)) {
                if (data.treceiptcategory[i].CategoryName != "") {
                    categories.push(data.treceiptcategory[i].CategoryName);
                }
            }
        }

        $('.fullScreenSpin').css('display', 'none');
        // templateObject.getAccountLists();
    }
    templateObject.getReceiptCategoryList();

    function MakeNegative() {
        var TDs = document.getElementsByTagName("td");
        for (var i = 0; i < TDs.length; i++) {
            var temp = TDs[i];
            if (temp.firstChild.nodeValue.indexOf("-" + Currency) === 0) {
                temp.className = "colBalance text-danger";
            }
        }
    }

    templateObject.getTaxSummaryReports = function(dateFrom, dateTo, ignoreDate, tabType = "t1") {
        reportService.getTaxSummaryData(dateFrom, dateTo, ignoreDate).then(function(data) {
            if (data.ttaxsummaryreport.length) {
                const taxSummaryReport = data.ttaxsummaryreport;

                reportService.getTaxCodesDetailVS1().then(function(data) {
                    const taxCodesDetail = data.ttaxcodevs1;
                    let mainReportRecords = [];
                    let subReportRecords = [];

                    for (let i = 0; i < taxSummaryReport.length; i++) {
                        let inputsexpurchases = utilityService.modifynegativeCurrencyFormat(taxSummaryReport[i].INPUT_AmountEx) || 0;
                        let inputsincpurchases = utilityService.modifynegativeCurrencyFormat(taxSummaryReport[i].INPUT_AmountInc) || 0;
                        let outputexsales = utilityService.modifynegativeCurrencyFormat(taxSummaryReport[i].OUTPUT_AmountEx) || 0;
                        let outputincsales = utilityService.modifynegativeCurrencyFormat(taxSummaryReport[i].OUTPUT_AmountInc) || 0;
                        let totalnet = utilityService.modifynegativeCurrencyFormat(taxSummaryReport[i].TotalNet) || 0;
                        let totaltax = utilityService.modifynegativeCurrencyFormat(taxSummaryReport[i].TotalTax) || 0;
                        let totaltax1 = utilityService.modifynegativeCurrencyFormat(taxSummaryReport[i].TotalTax1) || 0;
                        const mainReportData = {
                            id: taxSummaryReport[i].ID || '',
                            taxcode: taxSummaryReport[i].TaxCode || '',
                            clientid: taxSummaryReport[i].ClientID || '',
                            inputsexpurchases: inputsexpurchases,
                            inputsincpurchases: inputsincpurchases,
                            outputexsales: outputexsales,
                            outputincsales: outputincsales,
                            totalnet: totalnet || 0.00,
                            totaltax: totaltax || 0.00,
                            totaltaxdigit: taxSummaryReport[i].TotalTax || 0,
                            totaltax1: totaltax1 || 0.00,
                            taxrate: (taxSummaryReport[i].TaxRate * 100).toFixed(2) + '%' || 0,
                            taxrate2: (taxSummaryReport[i].TaxRate * 100).toFixed(2) || 0
                        };

                        mainReportRecords.push(mainReportData);

                        const taxDetail = taxCodesDetail.find((v) => v.CodeName === taxSummaryReport[i].TaxCode);
                        if (taxDetail && taxDetail.Lines) {
                            for (let j = 0; j < taxDetail.Lines.length; j++) {
                                const tax = (utilityService.convertSubstringParseFloat(inputsexpurchases) - utilityService.convertSubstringParseFloat(outputexsales)) * taxDetail.Lines[j].Percentage / 100.0;
                                const subReportData = {
                                    id: taxSummaryReport[i].ID || '',
                                    taxcode: taxSummaryReport[i].TaxCode || '',
                                    subtaxcode: taxDetail.Lines[j].SubTaxCode || '',
                                    clientid: '',
                                    inputsexpurchases: inputsexpurchases,
                                    inputsincpurchases: inputsincpurchases,
                                    outputexsales: outputexsales,
                                    outputincsales: outputincsales,
                                    totalnet: totalnet || 0.00,
                                    totaltax: utilityService.modifynegativeCurrencyFormat(Math.abs(tax)) || 0.00,
                                    totaltax1: utilityService.modifynegativeCurrencyFormat(tax) || 0.00,
                                    taxrate: (taxDetail.Lines[j].Percentage).toFixed(2) + '%' || 0,
                                    taxrate2: (taxDetail.Lines[j].Percentage).toFixed(2) || 0
                                };
                                subReportRecords.push(subReportData);
                            }
                        }
                    }

                    mainReportRecords = _.sortBy(mainReportRecords, 'taxcode');
                    subReportRecords = _.sortBy(subReportRecords, 'subtaxcode');

                    if (tabType == "t1") {
                        templateObject.taxSummaryListT1.set(mainReportRecords);
                        templateObject.selTaxList(1);
                        templateObject.selTaxList(2);
                        templateObject.selTaxList(3);
                        templateObject.selTaxList(4);
                        templateObject.selTaxList(7);
                        templateObject.selTaxList(10);
                        templateObject.selTaxList(11);
                        templateObject.selTaxList(13);
                        templateObject.selTaxList(14);
                        templateObject.selTaxList(15);
                        templateObject.selTaxList(18);

                        var gst5cost = parseFloat($("#gst3cost").val()) + parseFloat($("#gst4cost").val());
                        $("#gst5cost").val(gst5cost);
                        $("#prt_gst5cost").html("$" + gst5cost);
                        var gst6cost = parseFloat($("#gst1cost").val()) + parseFloat($("#gst2cost").val()) + gst5cost;
                        $("#gst6cost").val(gst6cost);
                        $("#prt_gst6cost").html("$" + gst6cost);
                        var gst8cost = parseFloat($("#gst7cost").val()) + gst6cost;
                        $("#gst8cost").val(gst8cost);
                        $("#prt_gst8cost").html("$" + gst8cost);
                        var gst9cost = gst8cost / 11;
                        $("#gst9cost").val(gst9cost.toFixed(2));
                        $("#prt_gst9cost").html("$" + gst9cost.toFixed(2));
                        $("#debits1cost").val(gst9cost.toFixed(2));
                        $("#prt_gst21cost").html("$" + gst9cost.toFixed(2));
                        $("#prt_gst23cost").html("$" + gst9cost.toFixed(2));
                        $("#prt_debits1cost").html("$" + gst9cost.toFixed(2));
                        let debits2A = gst9cost + parseFloat($("#debits2cost").val()) + parseFloat($("#debits3cost").val());
                        $("#debits4cost").val(debits2A.toFixed(2));
                        $("#prt_debits4cost").html("$" + debits2A.toFixed(2));
                        var gst12cost = parseFloat($("#gst10cost").val()) + parseFloat($("#gst11cost").val());
                        $("#gst12cost").val(gst12cost);
                        $("#prt_gst12cost").html("$" + gst12cost);
                        var gst16cost = parseFloat($("#gst13cost").val()) + parseFloat($("#gst14cost").val()) + parseFloat($("#gst15cost").val());
                        $("#gst16cost").val(gst16cost);
                        $("#prt_gst16cost").html("$" + gst16cost);
                        var gst17cost = gst12cost + gst16cost;
                        $("#gst17cost").val(gst17cost);
                        $("#prt_gst17cost").html("$" + gst17cost);
                        var gst19cost = parseFloat($("#gst18cost").val()) + gst17cost;
                        $("#gst19cost").val(gst19cost);
                        $("#prt_gst19cost").html("$" + gst19cost);
                        var gst20cost = gst19cost / 11;
                        $("#gst20cost").val(gst20cost.toFixed(2));
                        $("#prt_gst20cost").html("$" + gst20cost.toFixed(2));
                        $("#credits1cost").val(gst20cost.toFixed(2));
                        $("#prt_credits1cost").html("$" + gst20cost.toFixed(2));
                        let credits2B = gst20cost + parseFloat($("#credits2cost").val()) + parseFloat($("#credits3cost").val()) + parseFloat($("#credits4cost").val());
                        $("#credits5cost").val(credits2B.toFixed(2));
                        $("#prt_credits5cost").html("$" + credits2B.toFixed(2));
                        let debits3 = debits2A - credits2B;
                        $("#debits5cost").val(debits3.toFixed(2));
                        $("#prt_debits5cost").html("$" + debits3.toFixed(2));
                        let credits8B = parseFloat($("#credits5cost").val()) + parseFloat($("#credits6cost").val()) + parseFloat($("#credits7cost").val()) + parseFloat($("#credits8cost").val());
                        $("#credits9cost").val(credits8B.toFixed(2));
                        $("#prt_credits9cost").html("$" + credits8B.toFixed(2));
                        let debits8A = parseFloat($("#debits1cost").val()) + parseFloat($("#debits6cost").val()) + parseFloat($("#debits7cost").val()) + parseFloat($("#debits9cost").val());
                        $("#debits10cost").val(debits8A.toFixed(2));
                        $("#prt_debits10cost").html("$" + debits8A.toFixed(2));
                        let debits9 = debits8A - parseFloat($("#credits9cost").val());
                        $("#debits11cost").val(debits9.toFixed(2));
                        $("#prt_debits11cost").html("$" + debits9.toFixed(2));
                    } else if (tabType == "t3") {
                        templateObject.taxSummaryListT3.set(mainReportRecords);
                        templateObject.sel3TaxList(1);
                        templateObject.sel3TaxList(2);
                        templateObject.sel3TaxList(3);
                        templateObject.sel3TaxList(4);
                        templateObject.sel3TaxList(5);
                    }
                });
            }

            $('.fullScreenSpin').css('display', 'none');

        }).catch(function(err) {
            if (tabType == "t1") {
                templateObject.taxSummaryListT1.set([]);
            } else if (tabType == "t3") {
                templateObject.taxSummaryListT3.set([]);
            }

            $('.fullScreenSpin').css('display', 'none');
        });
    };

    templateObject.getAccountsSummaryReports = function(dateFrom, dateTo, tabType) {
        reportService.getBalanceSheetRedirectRangeData(dateFrom, dateTo, 1000, 0).then(function(data) {
            if (data.taccountrunningbalancereport.length) {
                const accountsSummaryReport = data.taccountrunningbalancereport;
                let accountsReportRecords = [];

                for (let i = 0; i < accountsSummaryReport.length; i++) {
                    const mainReportData = {
                        AccountID: accountsSummaryReport[i].AccountID || '',
                        AccountName: accountsSummaryReport[i].AccountName || '',
                        AccountNumber: accountsSummaryReport[i].AccountNumber || '',
                        AccountType: accountsSummaryReport[i].AccountType || '',
                        clientname: accountsSummaryReport[i].clientname || '',
                        Type: accountsSummaryReport[i].Type || '',
                        debit: accountsSummaryReport[i].TotalDebitEx || 0.00,
                        credit: accountsSummaryReport[i].TotalCreditEx || 0.00,
                        balance: accountsSummaryReport[i].Balance || 0.00,
                        openingbalance: accountsSummaryReport[i].OpeningBalanceEx || 0.00,
                        closingbalance: accountsSummaryReport[i].ClosingBalanceEx || 0.00
                    };

                    accountsReportRecords.push(mainReportData);
                }

                accountsReportRecords = _.sortBy(accountsReportRecords, 'AccountName');

                if (tabType == "t2") {
                    templateObject.accountsSummaryListT2.set(accountsReportRecords);
                    templateObject.selAccountant(1);
                    templateObject.selAccountant(2);
                    templateObject.selAccountant(3);
                    templateObject.selAccountant(4);
                } else if (tabType == "t2-2") {
                    templateObject.accountsSummaryListT2_2.set(accountsReportRecords);
                    templateObject.selAccountant_2(5);
                } else if (tabType == "t3") {
                    templateObject.accountsSummaryListT3.set(accountsReportRecords);
                    templateObject.sel3Accountant(1);
                }
            }

            $('.fullScreenSpin').css('display', 'none');

        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
            templateObject.accountsSummaryListT2.set([]);
            templateObject.accountsSummaryListT2_2.set([]);
            templateObject.accountsSummaryListT3.set([]);
        });
    };

    templateObject.getTaxrateList = function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        getVS1Data("TTaxcodeVS1").then(function(dataObject) {
                if (dataObject.length === 0) {
                    productService.getTaxCodesVS1().then(function(data) {
                        for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                            if (data.ttaxcodevs1[i].RegionName == "Australia") {
                                let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                                var dataList = {
                                    Id: data.ttaxcodevs1[i].Id || '',
                                    CodeName: data.ttaxcodevs1[i].CodeName || '',
                                    Description: data.ttaxcodevs1[i].Description || '-',
                                    TaxRate: taxRate || 0,
                                };
                                taxRateList.push(dataList);
                            }
                        }
                        templateObject.taxRateList.set(taxRateList);

                        setTimeout(function() {
                            if (taxRateList.length > 0) {
                                $(".tblTaxRate").DataTable({
                                        // data: splashArrayTaxRateList,
                                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                        columnDefs: [{
                                                orderable: false,
                                                targets: 0
                                            },
                                            {
                                                className: "colCodeName",
                                                "targets": [1]
                                            },
                                            {
                                                className: "colDescription",
                                                "targets": [2]
                                            },
                                            {
                                                className: "colTaxRate text-right",
                                                "targets": [3]
                                            }
                                        ],
                                        select: true,
                                        destroy: true,
                                        colReorder: true,
                                        pageLength: initialDatatableLoad,
                                        lengthMenu: [
                                            [initialDatatableLoad, -1],
                                            [initialDatatableLoad, "All"],
                                        ],
                                        info: true,
                                        responsive: true,
                                        order: [
                                            [0, "asc"]
                                        ],
                                        action: function() {
                                            $(".tblTaxRate").DataTable().ajax.reload();
                                        },
                                        fnDrawCallback: function(oSettings) {
                                            // $('.dataTables_paginate').css('display', 'none');
                                        },
                                        language: { search: "", searchPlaceholder: "Search List..." },
                                        fnInitComplete: function() {},
                                    })
                                    .on("page", function() {
                                        // setTimeout(function() {
                                        //     MakeNegative();
                                        // }, 100);
                                        let draftRecord = templateObject.taxRateList.get();
                                        templateObject.taxRateList.set(draftRecord);
                                    })
                                    .on("column-reorder", function() {})
                                    .on("length.dt", function(e, settings, len) {
                                        // setTimeout(function() {
                                        //     MakeNegative();
                                        // }, 100);
                                    });;
                                $("<button class='btn btn-primary btnRefreshTaxcode' type='button' id='btnRefreshTaxcode' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_wrapper .dataTables_filter");
                            }
                        }, 10);
                        $('.fullScreenSpin').css('display', 'none');
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.ttaxcodevs1;
                    for (let i = 0; i < useData.length; i++) {
                        if (useData[i].RegionName == "Australia") {
                            let taxRate = (useData[i].Rate * 100).toFixed(2);
                            var dataList = {
                                Id: useData[i].Id || '',
                                CodeName: useData[i].CodeName || '',
                                Description: useData[i].Description || '-',
                                TaxRate: taxRate || 0,
                            };

                            taxRateList.push(dataList);
                        }
                    }
                    templateObject.taxRateList.set(taxRateList);

                    setTimeout(function() {
                        if (taxRateList.length > 0) {
                            $(".tblTaxRate").DataTable({
                                    // data: splashArrayTaxRateList,
                                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                    columnDefs: [{
                                            orderable: false,
                                            targets: 0
                                        },
                                        {
                                            className: "colCodeName",
                                            "targets": [1]
                                        },
                                        {
                                            className: "colDescription",
                                            "targets": [2]
                                        },
                                        {
                                            className: "colTaxRate text-right",
                                            "targets": [3]
                                        }
                                    ],
                                    select: true,
                                    destroy: true,
                                    colReorder: true,
                                    pageLength: initialDatatableLoad,
                                    lengthMenu: [
                                        [initialDatatableLoad, -1],
                                        [initialDatatableLoad, "All"],
                                    ],
                                    info: true,
                                    responsive: true,
                                    order: [
                                        [0, "asc"]
                                    ],
                                    action: function() {
                                        $(".tblTaxRate").DataTable().ajax.reload();
                                    },
                                    fnDrawCallback: function(oSettings) {
                                        // $('.dataTables_paginate').css('display', 'none');
                                    },
                                    language: { search: "", searchPlaceholder: "Search List..." },
                                    fnInitComplete: function() {},
                                })
                                .on("page", function() {
                                    // setTimeout(function() {
                                    //     MakeNegative();
                                    // }, 100);
                                    let draftRecord = templateObject.taxRateList.get();
                                    templateObject.taxRateList.set(draftRecord);
                                })
                                .on("column-reorder", function() {})
                                .on("length.dt", function(e, settings, len) {
                                    // setTimeout(function() {
                                    //     MakeNegative();
                                    // }, 100);
                                });;
                            $("<button class='btn btn-primary btnRefreshTaxcode' type='button' id='btnRefreshTaxcode' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_wrapper .dataTables_filter");
                        }
                    }, 10);
                    $('.fullScreenSpin').css('display', 'none');
                }
            })
            .catch(function(err) {
                productService.getTaxCodesVS1().then(function(data) {
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        if (data.ttaxcodevs1[i].RegionName == "Australia") {
                            let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                            var dataList = {
                                Id: data.ttaxcodevs1[i].Id || '',
                                CodeName: data.ttaxcodevs1[i].CodeName || '',
                                Description: data.ttaxcodevs1[i].Description || '-',
                                TaxRate: taxRate || 0,
                            };

                            taxRateList.push(dataList);
                        }
                    }
                    templateObject.taxRateList.set(taxRateList);

                    setTimeout(function() {
                        if (taxRateList.length > 0) {
                            $(".tblTaxRate").DataTable({
                                    // data: splashArrayTaxRateList,
                                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                    columnDefs: [{
                                            orderable: false,
                                            targets: 0
                                        },
                                        {
                                            className: "colCodeName",
                                            "targets": [1]
                                        },
                                        {
                                            className: "colDescription",
                                            "targets": [2]
                                        },
                                        {
                                            className: "colTaxRate text-right",
                                            "targets": [3]
                                        }
                                    ],
                                    select: true,
                                    destroy: true,
                                    colReorder: true,
                                    pageLength: initialDatatableLoad,
                                    lengthMenu: [
                                        [initialDatatableLoad, -1],
                                        [initialDatatableLoad, "All"],
                                    ],
                                    info: true,
                                    responsive: true,
                                    order: [
                                        [0, "asc"]
                                    ],
                                    action: function() {
                                        $(".tblTaxRate").DataTable().ajax.reload();
                                    },
                                    fnDrawCallback: function(oSettings) {
                                        // $('.dataTables_paginate').css('display', 'none');
                                    },
                                    language: { search: "", searchPlaceholder: "Search List..." },
                                    fnInitComplete: function() {},
                                })
                                .on("page", function() {
                                    // setTimeout(function() {
                                    //     MakeNegative();
                                    // }, 100);
                                    let draftRecord = templateObject.taxRateList.get();
                                    templateObject.taxRateList.set(draftRecord);
                                })
                                .on("column-reorder", function() {})
                                .on("length.dt", function(e, settings, len) {
                                    // setTimeout(function() {
                                    //     MakeNegative();
                                    // }, 100);
                                });;
                            $("<button class='btn btn-primary btnRefreshTaxcode' type='button' id='btnRefreshTaxcode' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_wrapper .dataTables_filter");
                        }
                    }, 10);
                });
            });
    }

    templateObject.getTaxrateList();

    templateObject.getAccountLists = function() {
        getVS1Data("TAccountVS1")
            .then(function(dataObject) {
                if (dataObject.length == 0) {
                    accountService
                        .getAccountListVS1()
                        .then(function(data) {
                            setAccountListVS1(data);
                        })
                        .catch(function(err) {
                            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                            $(".fullScreenSpin").css("display", "none");
                            // Meteor._reload.reload();
                        });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    setAccountListVS1(data, true);
                }
            })
            .catch(function(err) {
                accountService
                    .getAccountListVS1()
                    .then(function(data) {
                        setAccountListVS1(data);
                    })
                    .catch(function(err) {
                        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                        $(".fullScreenSpin").css("display", "none");
                        // Meteor._reload.reload();
                    });
            });
    };

    function setAccountListVS1(data, isField = false) {

        //addVS1Data('TAccountVS1', JSON.stringify(data));
        let lineItems = [];
        let lineItemObj = {};
        let fullAccountTypeName = "";
        let accBalance = "";
        dataTableList = [];

        for (let i = 0; i < data.taccountvs1.length; i++) {
            let lineData = data.taccountvs1[i];
            if (isField) {
                lineData = data.taccountvs1[i].fields;
            }
            if (accountTypeList) {
                for (var j = 0; j < accountTypeList.length; j++) {
                    if (
                        lineData.AccountTypeName ===
                        accountTypeList[j].accounttypename
                    ) {
                        fullAccountTypeName = accountTypeList[j].description || "";
                    }
                }
            }

            if (!isNaN(lineData.Balance)) {
                accBalance = utilityService.modifynegativeCurrencyFormat(lineData.Balance) || 0.0;
            } else {
                accBalance = Currency + "0.00";
            }
            if (data.taccountvs1[i].fields.ReceiptCategory && data.taccountvs1[i].fields.ReceiptCategory != '') {
                usedCategories.push(data.taccountvs1[i].fields);
            }

            var dataList = {
                id: lineData.ID || lineData.Id || "",
                accountname: lineData.AccountName || "",
                description: lineData.Description || "",
                accountnumber: lineData.AccountNumber || "",
                accounttypename: fullAccountTypeName || lineData.AccountTypeName,
                accounttypeshort: lineData.AccountTypeName || "",
                taxcode: lineData.TaxCode || "",
                bankaccountname: lineData.BankAccountName || "",
                bankname: lineData.BankName || "",
                bsb: lineData.BSB || "",
                bankaccountnumber: lineData.BankAccountNumber || "",
                swiftcode: lineData.Extra || "",
                routingNo: lineData.BankCode || "",
                apcanumber: lineData.BankNumber || "",
                balanceNumber: lineData.Balance || 0.0,
                balance: accBalance || 0.0,
                isheader: lineData.IsHeader || false,
                cardnumber: lineData.CarNumber || "",
                expirydate: lineData.ExpiryDate || "",
                cvc: lineData.CVC || "",
                useReceiptClaim: lineData.AllowExpenseClaim || false,
                expenseCategory: lineData.AccountGroup || ""
            };
            dataTableList.push(dataList);
        }

        usedCategories = [...new Set(usedCategories)];
        let availableCategories = categories.filter((item) => !usedCategories.includes(item));
        templateObject.availableCategories.set(availableCategories);
        templateObject.accountsList.set(dataTableList);

        categories.forEach((citem, j) => {
            let cdataList = null;
            let match = usedCategories.filter((item) => (item.ReceiptCategory == citem));
            if (match.length > 0) {
                let temp = match[0];
                cdataList = [
                    citem,
                    temp.AccountName || '',
                    temp.Description || '',
                    temp.AccountNumber || '',
                    temp.TaxCode || '',
                    temp.ID || ''
                ];
            } else {
                cdataList = [
                    citem,
                    '',
                    '',
                    '',
                    '',
                    ''
                ];
            }
            categoryAccountList.push(cdataList);
        });

        if (templateObject.accountsList.get()) {
            setTimeout(function() {
                MakeNegative();
            }, 100);
        }

        $(".fullScreenSpin").css("display", "none");
        setTimeout(function() {
            if (categoryAccountList.length > 0) {
                $('#tblCategory').dataTable({
                    data: categoryAccountList,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    paging: true,
                    "aaSorting": [],
                    "orderMulti": true,
                    columnDefs: [
                        { className: "colReceiptCategory", "targets": [0] },
                        { className: "colAccountName", "targets": [1] },
                        { className: "colAccountDesc", "targets": [2] },
                        { className: "colAccountNumber", "targets": [3] },
                        { className: "colTaxCode", "targets": [4] },
                        { className: "colAccountID hiddenColumn", "targets": [5] }
                    ],
                    // select: true,
                    // destroy: true,
                    colReorder: true,
                    "order": [
                        [0, "asc"]
                    ],
                    pageLength: initialDatatableLoad,
                    lengthMenu: [
                        [initialDatatableLoad, -1],
                        [initialDatatableLoad, "All"]
                    ],
                    info: true,
                    responsive: true,
                    "fnInitComplete": function() {
                        $("<button class='btn btn-primary btnAddNewReceiptCategory' data-dismiss='modal' data-toggle='modal' data-target='#addReceiptCategoryModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblCategory_filter");
                        $("<button class='btn btn-primary btnRefreshCategoryAccount' type='button' id='btnRefreshCategoryAccount' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCategory_filter");
                    }
                });
            }

            $(".tblAccountOverview")
                .DataTable({
                    columnDefs: [
                        // { type: 'currency', targets: 4 }
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [{
                            extend: "csvHtml5",
                            text: "",
                            download: "open",
                            className: "btntabletocsv hiddenColumn",
                            filename: "accountoverview_" + moment().format(),
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
                            title: "Accounts Overview",
                            filename: "Accounts Overview_" + moment().format(),
                            exportOptions: {
                                columns: ":visible",
                            },
                        },
                        {
                            extend: "excelHtml5",
                            title: "",
                            download: "open",
                            className: "btntabletoexcel hiddenColumn",
                            filename: "accountoverview_" + moment().format(),
                            orientation: "portrait",
                            exportOptions: {
                                columns: ":visible",
                            },
                        },
                    ],
                    pageLength: initialDatatableLoad,
                    lengthMenu: [
                        [initialDatatableLoad, -1],
                        [initialDatatableLoad, "All"],
                    ],
                    info: true,
                    responsive: true,
                    order: [
                        [0, "asc"]
                    ],
                    action: function() {
                        $(".tblAccountOverview").DataTable().ajax.reload();
                    },
                    fnDrawCallback: function(oSettings) {
                        // setTimeout(function() {
                        //     MakeNegative();
                        // }, 100);
                    },
                    fnInitComplete: function() {},
                })
                .on("page", function() {
                    // setTimeout(function() {
                    //     MakeNegative();
                    // }, 100);
                    let draftRecord = templateObject.datatablerecords.get();
                    templateObject.datatablerecords.set(draftRecord);
                })
                .on("column-reorder", function() {})
                .on("length.dt", function(e, settings, len) {
                    // setTimeout(function() {
                    //     MakeNegative();
                    // }, 100);
                });

            $("<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAccountOverview_wrapper .dataTables_filter");
        }, 50);

        var columns = $("#tblAccountOverview th");
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden === false) {
                columVisible = true;
            }
            if (v.className.includes("hiddenColumn")) {
                columVisible = false;
            }
            sWidth = v.style.width.replace("px", "");

            let datatablerecordObj = {
                sTitle: v.innerText || "",
                sWidth: sWidth || "",
                sIndex: v.cellIndex || "",
                sVisible: columVisible || false,
                sClass: v.className || "",
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $("div.dataTables_filter input").addClass(
            "form-control form-control-sm"
        );
    }

    templateObject.getAccountLists();

    templateObject.selTaxList = function(pan) {
        let taxRateList = templateObject.taxRateList.get();
        let taxSummaryList = templateObject.taxSummaryListT1.get();

        var total_tax = 0;
        for (var i = 0; i < taxRateList.length; i++) {
            if ($("#t-" + pan + "-" + taxRateList[i].Id).prop('checked') == true) {
                for (var j = 0; j < taxSummaryList.length; j++) {
                    if (taxRateList[i].CodeName == taxSummaryList[j].taxcode) {
                        total_tax += parseFloat(taxSummaryList[j].totaltaxdigit);
                    }
                }
            }
        }
        $("#gst" + pan + "cost").val(total_tax.toFixed(2));
        $("#prt_gst" + pan + "cost").html("$" + total_tax.toFixed(2));
        $(".prt_gst" + pan + "cost").html("$" + total_tax.toFixed(2));
    };

    templateObject.selAccountant = function(pan) {
        let accountsList = templateObject.accountsList.get();
        let accountsSummaryList = templateObject.accountsSummaryListT2.get();

        var total_amounts = 0;
        for (var i = 0; i < accountsList.length; i++) {
            if ($("#f-" + pan + "-" + accountsList[i].id).prop('checked') == true) {
                for (var j = 0; j < accountsSummaryList.length; j++) {
                    if (accountsList[i].accountname == accountsSummaryList[j].AccountName) {
                        total_amounts += parseFloat(accountsSummaryList[j].balance);
                    }
                }
            }
        }

        $("#accounts" + pan + "cost").val(total_amounts.toFixed(2));
        $("#prt_accounts" + pan + "cost").html("$" + total_amounts.toFixed(2));

        if (pan == 2 || pan == 3 || pan == 4) {
            let debits4 = parseFloat($("#accounts2cost").val()) + parseFloat($("#accounts3cost").val()) + parseFloat($("#accounts4cost").val());
            $("#debits6cost").val(debits4.toFixed(2));
            $("#prt_accounts2+3+4cost").html("$" + debits4.toFixed(2));
            $("#prt_debits6cost").html("$" + debits4.toFixed(2));
            let debits8A = parseFloat($("#debits1cost").val()) + parseFloat($("#debits6cost").val()) + parseFloat($("#debits7cost").val()) + parseFloat($("#debits9cost").val());
            $("#debits10cost").val(debits8A.toFixed(2));
            $("#prt_debits10cost").html("$" + debits8A.toFixed(2));
            let debits9 = debits8A - parseFloat($("#credits9cost").val());
            $("#debits11cost").val(debits9.toFixed(2));
            $("#prt_debits11cost").html("$" + debits9.toFixed(2));
        }

        // if (pan == 5) {
        //     $("#debits7cost").val(total_amounts.toFixed(2));
        //     $("#prt_debits7cost").html("$" + total_amounts.toFixed(2));
        //     let debits8A = parseFloat($("#debits1cost").val()) + parseFloat($("#debits6cost").val()) + parseFloat($("#debits7cost").val()) + parseFloat($("#debits9cost").val());
        //     $("#debits10cost").val(debits8A.toFixed(2));
        //     $("#prt_debits10cost").html("$" + debits8A.toFixed(2));
        //     let debits9 = debits8A - parseFloat($("#credits9cost").val());
        //     $("#debits11cost").val(debits9.toFixed(2));
        //     $("#prt_debits11cost").html("$" + debits9.toFixed(2));
        // }
    };

    templateObject.selAccountant_2 = function(pan) {
        let accountsList = templateObject.accountsList.get();
        let accountsSummaryList = templateObject.accountsSummaryListT2_2.get();
        var total_amounts = 0;
        for (var i = 0; i < accountsList.length; i++) {
            if ($("#f-" + pan + "-" + accountsList[i].id).prop('checked') == true) {
                for (var j = 0; j < accountsSummaryList.length; j++) {
                    if (accountsList[i].accountname == accountsSummaryList[j].AccountName) {
                        total_amounts += parseFloat(accountsSummaryList[j].balance);
                    }
                }
            }
        }

        $("#accounts" + pan + "cost").val(total_amounts.toFixed(2));
        $("#prt_accounts" + pan + "cost").html("$" + total_amounts.toFixed(2));

        $("#debits7cost").val(total_amounts.toFixed(2));
        $("#prt_accountsT7cost").html("$" + total_amounts.toFixed(2));
        $("#prt_accountsT11cost").html("$" + total_amounts.toFixed(2));
        $("#prt_debits7cost").html("$" + total_amounts.toFixed(2));
        let debits8A = parseFloat($("#debits1cost").val()) + parseFloat($("#debits6cost").val()) + parseFloat($("#debits7cost").val()) + parseFloat($("#debits9cost").val());
        $("#debits10cost").val(debits8A.toFixed(2));
        $("#prt_debits10cost").html("$" + debits8A.toFixed(2));
        let debits9 = debits8A - parseFloat($("#credits9cost").val());
        $("#debits11cost").val(debits9.toFixed(2));
        $("#prt_debits11cost").html("$" + debits9.toFixed(2));
    };

    templateObject.sel3TaxList = function(pan) {
        let taxRateList = templateObject.taxRateList.get();
        let taxSummaryList = templateObject.taxSummaryListT3.get();

        var total_tax = 0;
        for (var i = 0; i < taxRateList.length; i++) {
            if ($("#t3-" + pan + "-" + taxRateList[i].Id).prop('checked') == true) {
                for (var j = 0; j < taxSummaryList.length; j++) {
                    if (taxRateList[i].CodeName == taxSummaryList[j].taxcode) {
                        total_tax += parseFloat(taxSummaryList[j].totaltaxdigit);
                    }
                }
            }
        }

        $("#t3taxcodes" + pan + "cost").val(total_tax.toFixed(2));
        $("#prt_t3taxcodes" + pan + "cost").html("$" + total_tax.toFixed(2));

        if (pan == 1) {
            $("#debits2cost").val(total_tax.toFixed(2));
            $("#prt_debits2cost").html("$" + total_tax.toFixed(2));
            let debits2A = total_tax + parseFloat($("#debits1cost").val()) + parseFloat($("#debits3cost").val());
            $("#debits4cost").val(debits2A.toFixed(2));
            $("#prt_debits4cost").html("$" + debits2A.toFixed(2));
        }
        if (pan == 2) {
            $("#debits3cost").val(total_tax.toFixed(2));
            $("#prt_debits3cost").html("$" + total_tax.toFixed(2));
            let debits2A = total_tax + parseFloat($("#debits1cost").val()) + parseFloat($("#debits2cost").val());
            $("#debits4cost").val(debits2A.toFixed(2));
            $("#prt_debits4cost").html("$" + debits2A.toFixed(2));
        }
        if (pan == 3) {
            $("#credits2cost").val(total_tax.toFixed(2));
            $("#prt_credits2cost").html("$" + total_tax.toFixed(2));
            let credits2B = total_tax + parseFloat($("#credits1cost").val()) + parseFloat($("#credits3cost").val()) + parseFloat($("#credits4cost").val());
            $("#credits5cost").val(credits2B.toFixed(2));
            $("#prt_credits5cost").html("$" + credits2B.toFixed(2));
            let credits8B = parseFloat($("#credits5cost").val()) + parseFloat($("#credits6cost").val()) + parseFloat($("#credits7cost").val()) + parseFloat($("#credits8cost").val());
            $("#credits9cost").val(credits8B.toFixed(2));
            $("#prt_credits9cost").html("$" + credits8B.toFixed(2));
            let debits9 = parseFloat($("#debits10cost").val()) - parseFloat($("#credits9cost").val());
            $("#debits11cost").val(debits9.toFixed(2));
            $("#prt_debits11cost").html("$" + debits9.toFixed(2));
        }
        if (pan == 4) {
            $("#credits3cost").val(total_tax.toFixed(2));
            $("#prt_credits3cost").html("$" + total_tax.toFixed(2));
            let credits2B = total_tax + parseFloat($("#credits1cost").val()) + parseFloat($("#credits2cost").val()) + parseFloat($("#credits4cost").val());
            $("#credits5cost").val(credits2B.toFixed(2));
            $("#prt_credits5cost").html("$" + credits2B.toFixed(2));
            let credits8B = parseFloat($("#credits5cost").val()) + parseFloat($("#credits6cost").val()) + parseFloat($("#credits7cost").val()) + parseFloat($("#credits8cost").val());
            $("#credits9cost").val(credits8B.toFixed(2));
            $("#prt_credits9cost").html("$" + credits8B.toFixed(2));
            let debits9 = parseFloat($("#debits10cost").val()) - parseFloat($("#credits9cost").val());
            $("#debits11cost").val(debits9.toFixed(2));
            $("#prt_debits11cost").html("$" + debits9.toFixed(2));
        }
        if (pan == 5) {
            $("#credits4cost").val(total_tax.toFixed(2));
            $("#prt_credits4cost").html("$" + total_tax.toFixed(2));
            let credits2B = total_tax + parseFloat($("#credits1cost").val()) + parseFloat($("#credits2cost").val()) + parseFloat($("#credits3cost").val());
            $("#credits5cost").val(credits2B.toFixed(2));
            $("#prt_credits5cost").html("$" + credits2B.toFixed(2));
            let credits8B = parseFloat($("#credits5cost").val()) + parseFloat($("#credits6cost").val()) + parseFloat($("#credits7cost").val()) + parseFloat($("#credits8cost").val());
            $("#credits9cost").val(credits8B.toFixed(2));
            $("#prt_credits9cost").html("$" + credits8B.toFixed(2));
            let debits9 = parseFloat($("#debits10cost").val()) - parseFloat($("#credits9cost").val());
            $("#debits11cost").val(debits9.toFixed(2));
            $("#prt_debits11cost").html("$" + debits9.toFixed(2));
        }
    };

    templateObject.sel3Accountant = function(pan) {
        let accountsList = templateObject.accountsList.get();
        let accountsSummaryList = templateObject.accountsSummaryListT3.get();

        var total_amounts = 0;
        for (var i = 0; i < accountsList.length; i++) {
            if ($("#f3-" + pan + "-" + accountsList[i].id).prop('checked') == true) {
                for (var j = 0; j < accountsSummaryList.length; j++) {
                    if (accountsList[i].accountname == accountsSummaryList[j].AccountName) {
                        total_amounts += parseFloat(accountsSummaryList[j].balance);
                    }
                }
            }
        }

        $("#t3accounts" + pan + "cost").val(total_amounts.toFixed(2));
        $("#prt_t3accounts" + pan + "cost").html("$" + total_amounts.toFixed(2));

        $("#credits8cost").val(total_amounts.toFixed(2));
        $("#prt_credits8cost").html("$" + total_amounts.toFixed(2));
    };

    $('#sltDepartment').editableSelect();

    $('#sltDepartment').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var deptDataName = e.target.value || '';
            $('#edtDepartmentID').val('');
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#departmentModal').modal('toggle');
            } else {
                if (deptDataName.replace(/\s/g, '') != '') {
                    $('#newDeptHeader').text('Edit Department');

                    getVS1Data('TDeptClass').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getDepartment().then(function(data) {
                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                    if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                        $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                        $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                        $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                        $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newDepartmentModal').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tdeptclass;
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                    $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                    $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                    $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getDepartment().then(function(data) {
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                    $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                    $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                    $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        });
                    });
                } else {
                    $('#departmentModal').modal();
                    setTimeout(function() {
                        $('#departmentList_filter .form-control-sm').focus();
                        $('#departmentList_filter .form-control-sm').val('');
                        $('#departmentList_filter .form-control-sm').trigger("input");
                        var datatable = $('#departmentList').DataTable();
                        datatable.draw();
                        $('#departmentList_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }
        });

    setTimeout(function() {
        $(document).ready(function() {
            $('.fullScreenSpin').css('display', 'inline-block');
            organisationService.getOrganisationDetail().then(function(data) {
                let mainData = data.tcompanyinfo[0];
                $("#prt_companyName").html(mainData.CompanyName);
                $("#prt_companyAddress").html(mainData.Address);
                $("#prt_companyCity").html(mainData.City);
                $("#prt_companyZipState").html(mainData.PoState + " " + mainData.Postcode);
                $("#prt_companyPhoneNumber").html(mainData.PhoneNumber);
            });
            var url = FlowRouter.current().path;
            if (url.indexOf('?id=') > 0) {
                var getid = url.split('?id=');

                if (getid[1]) {
                    templateObject.getId.set(getid[1]);
                    templateObject.pageTitle.set("Edit BAS Return");

                    getVS1Data('TBASReturn').then(function(dataObject) {
                        if (dataObject.length > 0) {
                            let data = JSON.parse(dataObject[0].data);
                            for (let i = 0; i < data.length; i++) {
                                if (getid[1] == data[i].basNumber) {
                                    let taxRateList = templateObject.taxRateList.get();
                                    let accountsList = templateObject.accountsList.get();

                                    $("#description").val(data[i].description);
                                    $("#sltDepartment").val(data[i].departmentId);
                                    if (data[i].departmentId == "") {
                                        $("#allDepart").prop('checked', true);
                                    } else {
                                        $("#allDepart").prop('checked', false);
                                    }
                                    if (data[i].accountingMethod == "Accrual") {
                                        $("#accountingmethod1").prop('checked', true);
                                        $("#accountingmethod2").prop('checked', false);
                                    } else {
                                        $("#accountingmethod1").prop('checked', false);
                                        $("#accountingmethod2").prop('checked', true);
                                    }
                                    $("#prt_accountingMethod").html(data[i].accountingMethod);
                                    let tab1startDate = data[i].basReturnTab1.startDate.split("-");
                                    let endDate = (data[i].basReturnTab1.endDate != "" && data[i].basReturnTab1.endDate != "0000-00-00") ? data[i].basReturnTab1.endDate : "";
                                    if (data[i].basReturnTab1.datemethod == "q") {
                                        $("#datemethod1").prop('checked', true);
                                        $("#datemethod2").prop('checked', false);
                                    } else {
                                        $("#datemethod1").prop('checked', false);
                                        $("#datemethod2").prop('checked', true);
                                    }
                                    $("#beginmonthlydate").val(tab1startDate[1] + "-" + tab1startDate[2]);
                                    $("#currentyear").val(tab1startDate[0]);
                                    $("#endDate").val(endDate);
                                    $("#prt_beginningDate").html(months[parseInt(tab1startDate[1]) - 1] + " " + tab1startDate[0]);
                                    $("#gst1cost").val(data[i].basReturnTab1.tab1G1.amount);
                                    $(".prt_gst1cost").html("$" + data[i].basReturnTab1.tab1G1.amount);
                                    $("#gst2cost").val(data[i].basReturnTab1.tab1G2.amount);
                                    $("#prt_gst2cost").html("$" + data[i].basReturnTab1.tab1G2.amount);
                                    $("#gst3cost").val(data[i].basReturnTab1.tab1G3.amount);
                                    $("#prt_gst3cost").html("$" + data[i].basReturnTab1.tab1G3.amount);
                                    $("#gst4cost").val(data[i].basReturnTab1.tab1G4.amount);
                                    // $("#prt_gst4cost").html("$" + data[i].basReturnTab1.tab1G4.amount);
                                    $("#gst5cost").val(data[i].basReturnTab1.tab1G5.amount);
                                    // $("#prt_gst5cost").html("$" + data[i].basReturnTab1.tab1G5.amount);
                                    $("#gst6cost").val(data[i].basReturnTab1.tab1G6.amount);
                                    // $("#prt_gst6cost").html("$" + data[i].basReturnTab1.tab1G6.amount);
                                    $("#gst7cost").val(data[i].basReturnTab1.tab1G7.amount);
                                    // $("#prt_gst7cost").html("$" + data[i].basReturnTab1.tab1G7.amount);
                                    $("#gst8cost").val(data[i].basReturnTab1.tab1G8.amount);
                                    // $("#prt_gst8cost").html("$" + data[i].basReturnTab1.tab1G8.amount);
                                    $("#gst9cost").val(data[i].basReturnTab1.tab1G9.amount);
                                    // $("#prt_gst9cost").html("$" + data[i].basReturnTab1.tab1G9.amount);
                                    $("#gst10cost").val(data[i].basReturnTab1.tab1G10.amount);
                                    $("#prt_gst10cost").html("$" + data[i].basReturnTab1.tab1G10.amount);
                                    $("#gst11cost").val(data[i].basReturnTab1.tab1G11.amount);
                                    $("#prt_gst11cost").html("$" + data[i].basReturnTab1.tab1G11.amount);
                                    $("#gst12cost").val(data[i].basReturnTab1.tab1G12.amount);
                                    // $("#prt_gst12cost").html("$" + data[i].basReturnTab1.tab1G12.amount);
                                    $("#gst13cost").val(data[i].basReturnTab1.tab1G13.amount);
                                    // $("#prt_gst13cost").html("$" + data[i].basReturnTab1.tab1G13.amount);
                                    $("#gst14cost").val(data[i].basReturnTab1.tab1G14.amount);
                                    // $("#prt_gst14cost").html("$" + data[i].basReturnTab1.tab1G14.amount);
                                    $("#gst15cost").val(data[i].basReturnTab1.tab1G15.amount);
                                    // $("#prt_gst15cost").html("$" + data[i].basReturnTab1.tab1G15.amount);
                                    $("#gst16cost").val(data[i].basReturnTab1.tab1G16.amount);
                                    // $("#prt_gst16cost").html("$" + data[i].basReturnTab1.tab1G16.amount);
                                    $("#gst17cost").val(data[i].basReturnTab1.tab1G17.amount);
                                    // $("#prt_gst17cost").html("$" + data[i].basReturnTab1.tab1G17.amount);
                                    $("#gst18cost").val(data[i].basReturnTab1.tab1G18.amount);
                                    // $("#prt_gst18cost").html("$" + data[i].basReturnTab1.tab1G18.amount);
                                    $("#gst19cost").val(data[i].basReturnTab1.tab1G19.amount);
                                    // $("#prt_gst19cost").html("$" + data[i].basReturnTab1.tab1G19.amount);
                                    $("#gst20cost").val(data[i].basReturnTab1.tab1G20.amount);
                                    // $("#prt_gst20cost").html("$" + data[i].basReturnTab1.tab1G20.amount);
                                    // for (var i = 0; i < taxRateList.length; i++) {
                                    data[i].basReturnTab1.tab1G1.taxcodes.forEach((item, j) => {
                                        $("#t-1-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G2.taxcodes.forEach((item, j) => {
                                        $("#t-2-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G3.taxcodes.forEach((item, j) => {
                                        $("#t-3-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G4.taxcodes.forEach((item, j) => {
                                        $("#t-4-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G7.taxcodes.forEach((item, j) => {
                                        $("#t-7-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G10.taxcodes.forEach((item, j) => {
                                        $("#t-10-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G11.taxcodes.forEach((item, j) => {
                                        $("#t-11-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G13.taxcodes.forEach((item, j) => {
                                        $("#t-13-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G14.taxcodes.forEach((item, j) => {
                                        $("#t-14-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G15.taxcodes.forEach((item, j) => {
                                        $("#t-15-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab1.tab1G18.taxcodes.forEach((item, j) => {
                                        $("#t-18-" + item).prop('checked', true);
                                    });
                                    // }
                                    let tab2startDate = data[i].basReturnTab2.startDate.split("-");
                                    let tab2endDate = (data[i].basReturnTab2.endDate != "" && data[i].basReturnTab2.endDate != "0000-00-00") ? data[i].basReturnTab2.endDate : "";
                                    if (data[i].basReturnTab2.datemethod == "q") {
                                        $("#datemethod1-t2").prop('checked', true);
                                        $("#datemethod2-t2").prop('checked', false);
                                    } else {
                                        $("#datemethod1-t2").prop('checked', false);
                                        $("#datemethod2-t2").prop('checked', true);
                                    }
                                    $("#beginmonthlydate-t2").val(tab2startDate[1] + "-" + tab2startDate[2]);
                                    $("#currentyear-t2").val(tab2startDate[0]);
                                    $("#endDate-t2").val(tab2endDate);
                                    // $("#prt_beginningDateT2").html(data[i].basReturnTab2.startDate);
                                    let tab2startDate2 = data[i].basReturnTab2.startDate_2.split("-");
                                    let tab2endDate2 = (data[i].basReturnTab2.endDate_2 != "" && data[i].basReturnTab2.endDate_2 != "0000-00-00") ? data[i].basReturnTab2.endDate_2 : "";
                                    if (data[i].basReturnTab2.datemethod_2 == "q") {
                                        $("#datemethod1-t2-2").prop('checked', true);
                                        $("#datemethod2-t2-2").prop('checked', false);
                                    } else {
                                        $("#datemethod1-t2-2").prop('checked', false);
                                        $("#datemethod2-t2-2").prop('checked', true);
                                    }
                                    $("#beginmonthlydate-t2-2").val(tab2startDate2[1] + "-" + tab2startDate2[2]);
                                    $("#currentyear-t2-2").val(tab2startDate2[0]);
                                    $("#endDate-t2-2").val(tab2endDate2);
                                    // $("#prt_beginningDateT2-2").html(data[i].basReturnTab2.startDate_2);
                                    $("#accounts1cost").val(data[i].basReturnTab2.tab2W1.amount);
                                    $("#prt_accounts1cost").html("$" + data[i].basReturnTab2.tab2W1.amount);
                                    $("#accounts2cost").val(data[i].basReturnTab2.tab2W2.amount);
                                    $("#prt_accounts2cost").html("$" + data[i].basReturnTab2.tab2W2.amount);
                                    $("#accounts3cost").val(data[i].basReturnTab2.tab2W3.amount);
                                    $("#prt_accounts3cost").html("$" + data[i].basReturnTab2.tab2W3.amount);
                                    $("#accounts4cost").val(data[i].basReturnTab2.tab2W4.amount);
                                    $("#prt_accounts4cost").html("$" + data[i].basReturnTab2.tab2W4.amount);
                                    $("#accounts5cost").val(data[i].basReturnTab2.tab2T1.amount);
                                    $("#prt_accountsT1cost").html("$" + data[i].basReturnTab2.tab2T1.amount);
                                    $("#accounts6cost").val(data[i].basReturnTab2.tab2T2.amount);
                                    $("#prt_accountsT2cost").html(data[i].basReturnTab2.tab2T2.amount + "%");
                                    $("#accounts7cost").val(data[i].basReturnTab2.tab2T3.amount);
                                    $("#prt_accountsT3cost").html(data[i].basReturnTab2.tab2T3.amount + "%");
                                    $("#reasonT4").val(data[i].basReturnTab2.tab2T4.reason);
                                    templateObject.reasonT4.get().forEach((item, j) => {
                                        if (item.val == data[i].basReturnTab2.tab2T4.reason) {
                                            $(".prt_reasonT4").html(item.title);
                                        }
                                    });
                                    $("#accounts9cost").val(data[i].basReturnTab2.tab2F1.amount);
                                    $("#prt_accounts9cost").html("$" + data[i].basReturnTab2.tab2F1.amount);
                                    $("#accounts10cost").val(data[i].basReturnTab2.tab2F2.amount);
                                    $("#prt_accounts10cost").html("$" + data[i].basReturnTab2.tab2F2.amount);
                                    $("#accounts11cost").val(data[i].basReturnTab2.tab2F3.amount);
                                    $("#prt_accounts11cost").html("$" + data[i].basReturnTab2.tab2F3.amount);
                                    $("#reasonF4").val(data[i].basReturnTab2.tab2F4.reason);
                                    templateObject.reasonF4.get().forEach((item, j) => {
                                        if (item.val == data[i].basReturnTab2.tab2F4.reason) {
                                            $("#prt_reasonF4").html(item.title);
                                        }
                                    });
                                    data[i].basReturnTab2.tab2W1.accounts.forEach((item, j) => {
                                        $("#f-1-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab2.tab2W2.accounts.forEach((item, j) => {
                                        $("#f-2-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab2.tab2W3.accounts.forEach((item, j) => {
                                        $("#f-3-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab2.tab2W4.accounts.forEach((item, j) => {
                                        $("#f-4-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab2.tab2T1.accounts.forEach((item, j) => {
                                        $("#f-5-" + item).prop('checked', true);
                                    });
                                    let tab3startDate = data[i].basReturnTab3.startDate.split("-");
                                    let tab3endDate = (data[i].basReturnTab3.endDate != "" && data[i].basReturnTab3.endDate != "0000-00-00") ? data[i].basReturnTab3.endDate : "";
                                    if (data[i].basReturnTab3.datemethod == "q") {
                                        $("#datemethod1-t3").prop('checked', true);
                                        $("#datemethod2-t3").prop('checked', false);
                                    } else {
                                        $("#datemethod1-t3").prop('checked', false);
                                        $("#datemethod2-t3").prop('checked', true);
                                    }
                                    $("#beginmonthlydate-t3").val(tab3startDate[1] + "-" + tab3startDate[2]);
                                    $("#currentyear-t3").val(tab3startDate[0]);
                                    $("#endDate-t3").val(tab3endDate);
                                    // $("#prt_beginningDateT3").html(data[i].basReturnTab3.startDate);
                                    $("#t3taxcodes1cost").val(data[i].basReturnTab3.tab31C.amount);
                                    $("#prt_t3taxcodes1cost").html("$" + data[i].basReturnTab3.tab31C.amount);
                                    $("#t3taxcodes2cost").val(data[i].basReturnTab3.tab31E.amount);
                                    $("#prt_t3taxcodes2cost").html("$" + data[i].basReturnTab3.tab31E.amount);
                                    $("#t3taxcodes3cost").val(data[i].basReturnTab3.tab31D.amount);
                                    $("#prt_t3taxcodes3cost").html("$" + data[i].basReturnTab3.tab31D.amount);
                                    $("#t3taxcodes4cost").val(data[i].basReturnTab3.tab31F.amount);
                                    $("#prt_t3taxcodes4cost").html("$" + data[i].basReturnTab3.tab31F.amount);
                                    $("#t3taxcodes5cost").val(data[i].basReturnTab3.tab31G.amount);
                                    $("#prt_t3taxcodes5cost").html("$" + data[i].basReturnTab3.tab31G.amount);
                                    $("#t3accounts1cost").val(data[i].basReturnTab3.tab37D.amount);
                                    $("#prt_t3accounts1cost").html("$" + data[i].basReturnTab3.tab37D.amount);
                                    data[i].basReturnTab3.tab31C.taxcodes.forEach((item, j) => {
                                        $("#t3-1-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab3.tab31E.taxcodes.forEach((item, j) => {
                                        $("#t3-2-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab3.tab31D.taxcodes.forEach((item, j) => {
                                        $("#t3-3-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab3.tab31F.taxcodes.forEach((item, j) => {
                                        $("#t3-4-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab3.tab31G.taxcodes.forEach((item, j) => {
                                        $("#t3-5-" + item).prop('checked', true);
                                    });
                                    data[i].basReturnTab3.tab37D.accounts.forEach((item, j) => {
                                        $("#f3-1-" + item).prop('checked', true);
                                    });
                                    $("#debits1cost").val(data[i].basReturnTab4.tab41A.amount);
                                    $("#prt_gst21cost").html("$" + data[i].basReturnTab4.tab41A.amount);
                                    $("#prt_gst23cost").html("$" + data[i].basReturnTab4.tab41A.amount);
                                    $("#prt_debits1cost").html("$" + data[i].basReturnTab4.tab41A.amount);
                                    $("#debits2cost").val(data[i].basReturnTab4.tab41C.amount);
                                    $("#prt_debits2cost").html("$" + data[i].basReturnTab4.tab41C.amount);
                                    $("#debits3cost").val(data[i].basReturnTab4.tab41E.amount);
                                    $("#prt_debits3cost").html("$" + data[i].basReturnTab4.tab41E.amount);
                                    $("#debits4cost").val(data[i].basReturnTab4.tab42A.amount);
                                    $("#prt_debits4cost").html("$" + data[i].basReturnTab4.tab42A.amount);
                                    $("#debits5cost").val(data[i].basReturnTab4.tab43.amount);
                                    $("#prt_debits5cost").html("$" + data[i].basReturnTab4.tab43.amount);
                                    $("#debits6cost").val(data[i].basReturnTab4.tab44.amount);
                                    $("#prt_accounts2+3+4cost").html("$" + data[i].basReturnTab4.tab44.amount);
                                    $("#prt_debits6cost").html("$" + data[i].basReturnTab4.tab44.amount);
                                    $("#debits7cost").val(data[i].basReturnTab4.tab45A.amount);
                                    $("#prt_accountsT7cost").html("$" + data[i].basReturnTab4.tab45A.amount);
                                    $("#prt_accountsT11cost").html("$" + data[i].basReturnTab4.tab45A.amount);
                                    $("#prt_debits7cost").html("$" + data[i].basReturnTab4.tab45A.amount);
                                    $("#debits8cost").val(data[i].basReturnTab4.tab46A.amount);
                                    $("#prt_debits8cost").html("$" + data[i].basReturnTab4.tab46A.amount);
                                    $("#debits9cost").val(data[i].basReturnTab4.tab47.amount);
                                    $("#prt_debits9cost").html("$" + data[i].basReturnTab4.tab47.amount);
                                    $("#debits10cost").val(data[i].basReturnTab4.tab48A.amount);
                                    $("#prt_debits10cost").html("$" + data[i].basReturnTab4.tab48A.amount);
                                    $("#debits11cost").val(data[i].basReturnTab4.tab49.amount);
                                    $("#prt_debits11cost").html("$" + data[i].basReturnTab4.tab49.amount);
                                    $("#credits1cost").val(data[i].basReturnTab4.tab41B.amount);
                                    $("#prt_credits1cost").html("$" + data[i].basReturnTab4.tab41B.amount);
                                    $("#credits2cost").val(data[i].basReturnTab4.tab41D.amount);
                                    $("#prt_credits2cost").html("$" + data[i].basReturnTab4.tab41D.amount);
                                    $("#credits3cost").val(data[i].basReturnTab4.tab41F.amount);
                                    $("#prt_credits3cost").html("$" + data[i].basReturnTab4.tab41F.amount);
                                    $("#credits4cost").val(data[i].basReturnTab4.tab41G.amount);
                                    $("#prt_credits4cost").html("$" + data[i].basReturnTab4.tab41G.amount);
                                    $("#credits5cost").val(data[i].basReturnTab4.tab42B.amount);
                                    $("#prt_credits5cost").html("$" + data[i].basReturnTab4.tab42B.amount);
                                    $("#credits6cost").val(data[i].basReturnTab4.tab45B.amount);
                                    $("#prt_credits6cost").html("$" + data[i].basReturnTab4.tab45B.amount);
                                    $("#credits7cost").val(data[i].basReturnTab4.tab46B.amount);
                                    $("#prt_credits7cost").html("$" + data[i].basReturnTab4.tab46B.amount);
                                    $("#credits8cost").val(data[i].basReturnTab4.tab47D.amount);
                                    $("#prt_credits8cost").html("$" + data[i].basReturnTab4.tab47D.amount);
                                    $("#credits9cost").val(data[i].basReturnTab4.tab48B.amount);
                                    $("#prt_credits9cost").html("$" + data[i].basReturnTab4.tab48B.amount);
                                }
                            }
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }
            } else {
                templateObject.pageTitle.set("New BAS Return");
            }

            $(document).on("click", "#basreturnCategory1", function(e) {
                if ($("#basreturnCategory1").prop('checked') == true) {
                    document.getElementById("gst1").setAttribute("href", "#gst1option");
                    document.getElementById("gst2").setAttribute("href", "#gst2option");
                    document.getElementById("gst3").setAttribute("href", "#gst3option");
                    document.getElementById("gst4").setAttribute("href", "#gst4option");
                    document.getElementById("gst7").setAttribute("href", "#gst7option");
                    document.getElementById("gst10").setAttribute("href", "#gst10option");
                    document.getElementById("gst11").setAttribute("href", "#gst11option");
                    document.getElementById("gst13").setAttribute("href", "#gst13option");
                    document.getElementById("gst14").setAttribute("href", "#gst14option");
                    document.getElementById("gst15").setAttribute("href", "#gst15option");
                    document.getElementById("gst18").setAttribute("href", "#gst18option");
                } else {
                    document.getElementById("gst1").setAttribute("href", "#");
                    document.getElementById("gst2").setAttribute("href", "#");
                    document.getElementById("gst3").setAttribute("href", "#");
                    document.getElementById("gst4").setAttribute("href", "#");
                    document.getElementById("gst7").setAttribute("href", "#");
                    document.getElementById("gst10").setAttribute("href", "#");
                    document.getElementById("gst11").setAttribute("href", "#");
                    document.getElementById("gst13").setAttribute("href", "#");
                    document.getElementById("gst14").setAttribute("href", "#");
                    document.getElementById("gst15").setAttribute("href", "#");
                    document.getElementById("gst18").setAttribute("href", "#");
                }
            });

            $(document).on("click", "#basreturnCategory2", function(e) {
                if ($("#basreturnCategory2").prop('checked') == true) {
                    document.getElementById("accounts1").setAttribute("href", "#accounts1option");
                    document.getElementById("accounts2").setAttribute("href", "#accounts2option");
                    document.getElementById("accounts3").setAttribute("href", "#accounts3option");
                    document.getElementById("accounts4").setAttribute("href", "#accounts4option");
                } else {
                    document.getElementById("accounts1").setAttribute("href", "#");
                    document.getElementById("accounts2").setAttribute("href", "#");
                    document.getElementById("accounts3").setAttribute("href", "#");
                    document.getElementById("accounts4").setAttribute("href", "#");
                }
            });

            $(document).on("click", "#basreturnCategory3", function(e) {
                if ($("#basreturnCategory3").prop('checked') == true) {
                    document.getElementById("accounts5").setAttribute("href", "#accounts5option");
                    $("#accounts6cost").removeAttr("disabled");
                    $("#accounts7cost").removeAttr("disabled");
                    $("#reasonT4").removeAttr("disabled");
                    $("#accounts9cost").removeAttr("disabled");
                    $("#accounts10cost").removeAttr("disabled");
                    $("#accounts11cost").removeAttr("disabled");
                    $("#reasonF4").removeAttr("disabled");
                } else {
                    document.getElementById("accounts5").setAttribute("href", "#");
                    $("#accounts6cost").attr("disabled", "disabled");
                    $("#accounts7cost").attr("disabled", "disabled");
                    $("#reasonT4").attr("disabled", "disabled");
                    $("#accounts9cost").attr("disabled", "disabled");
                    $("#accounts10cost").attr("disabled", "disabled");
                    $("#accounts11cost").attr("disabled", "disabled");
                    $("#reasonF4").attr("disabled", "disabled");
                }
            });

            $(document).on("click", "#basreturnCategory4", function(e) {
                if ($("#basreturnCategory4").prop('checked') == true) {
                    document.getElementById("t3taxcodes1").setAttribute("href", "#t3taxcodes1option");
                    document.getElementById("t3taxcodes2").setAttribute("href", "#t3taxcodes2option");
                    document.getElementById("t3taxcodes3").setAttribute("href", "#t3taxcodes3option");
                    document.getElementById("t3taxcodes4").setAttribute("href", "#t3taxcodes4option");
                    document.getElementById("t3taxcodes5").setAttribute("href", "#t3taxcodes5option");
                    document.getElementById("t3accounts1").setAttribute("href", "#t3accounts1option");
                } else {
                    document.getElementById("t3taxcodes1").setAttribute("href", "#");
                    document.getElementById("t3taxcodes2").setAttribute("href", "#");
                    document.getElementById("t3taxcodes3").setAttribute("href", "#");
                    document.getElementById("t3taxcodes4").setAttribute("href", "#");
                    document.getElementById("t3taxcodes5").setAttribute("href", "#");
                    document.getElementById("t3accounts1").setAttribute("href", "#");
                }
            });
        });
    }, 500);

    $(document).on("click", "#departmentList tbody tr", function(e) {
        $('#sltDepartment').val($(this).find(".colDeptName").text());
        $('#departmentModal').modal('toggle');
        $("#allDepart").prop('checked', false);
    });
});

Template.basreturn.helpers({
    years: () => {
        let currentDate = new Date();
        let years = [];
        for (var i = currentDate.getFullYear(); i >= 2020; i--) {
            years.push(i);
        }
        return years;
    },
    taxRateList: () => {
        return Template.instance().taxRateList.get();
    },
    gstPanList: () => {
        let gstArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        return gstArray;
    },
    accountsPanList: () => {
        let accountsArray = [1, 2, 3, 4, 5];
        return accountsArray;
    },
    taxcodesPanListT3: () => {
        let taxcodesArray = [1, 2, 3, 4, 5];
        return taxcodesArray;
    },
    accountsList: () => {
        return Template.instance()
            .accountsList.get()
            .sort(function(a, b) {
                if (a.accountname === "NA") {
                    return 1;
                } else if (b.accountname === "NA") {
                    return -1;
                }
                return a.accountname.toUpperCase() > b.accountname.toUpperCase() ?
                    1 :
                    -1;
            });
    },
    pageTitle: () => {
        return Template.instance().pageTitle.get();
    },
    reasonT4: () => {
        return Template.instance().reasonT4.get();
    },
    reasonF4: () => {
        return Template.instance().reasonF4.get();
    },






    record: () => {
        return Template.instance().record.get();
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    termrecords: () => {
        return Template.instance().termrecords.get().sort(function(a, b) {
            if (a.termsname == 'NA') {
                return 1;
            } else if (b.termsname == 'NA') {
                return -1;
            }
            return (a.termsname.toUpperCase() > b.termsname.toUpperCase()) ? 1 : -1;
        });
    },
    purchaseCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'journalentrycard'
        });
    },
    purchaseCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblJournalEntryLine'
        });
    },
    uploadedFiles: () => {
        return Template.instance().uploadedFiles.get();
    },
    attachmentCount: () => {
        return Template.instance().attachmentCount.get();
    },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
    statusrecords: () => {
        return Template.instance().statusrecords.get().sort(function(a, b) {
            if (a.orderstatus == 'NA') {
                return 1;
            } else if (b.orderstatus == 'NA') {
                return -1;
            }
            return (a.orderstatus.toUpperCase() > b.orderstatus.toUpperCase()) ? 1 : -1;
        });
    },
    totalCredit: () => {
        return Template.instance().totalCredit.get();
    },
    totalDebit: () => {
        return Template.instance().totalDebit.get();
    },
    totalCreditInc: () => {
        return Template.instance().totalCreditInc.get();
    },
    totalDebitInc: () => {
        return Template.instance().totalDebitInc.get();
    },
    companyaddress1: () => {
        return Session.get('vs1companyaddress1');
    },
    companyaddress2: () => {
        return Session.get('vs1companyaddress2');
    },
    city: () => {
        return Session.get('vs1companyCity');
    },
    state: () => {
        return Session.get('companyState');
    },
    poBox: () => {
        return Session.get('vs1companyPOBox');
    },
    companyphone: () => {
        return Session.get('vs1companyPhone');
    },
    companyabn: () => {
        return Session.get('vs1companyABN');
    },
    organizationname: () => {
        return Session.get('vs1companyName');
    },
    organizationurl: () => {
        return Session.get('vs1companyURL');
    },
    isMobileDevices: () => {
        var isMobile = false;

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    },
    isCurrencyEnable: () => {
        return Session.get('CloudUseForeignLicence');
    }
});

Template.basreturn.events({
    "click #loadBasOption": (e) => {
        if ($("#allDepart").prop('checked') == false && $('#sltDepartment').val() == "") {
            swal('Department cannot be blank!', '', 'warning');
        } else {
            $("#basoptionmodal").modal("toggle");
        }
    },
    // "click #allDepart": (e) => {
    //     if ($("#allDepart").prop('checked') == true) {
    //         $("#sltDepartment").attr("disabled", "disabled");
    //     } else {
    //         $("#sltDepartment").removeAttr("disabled");
    //     }
    // },
    "click #datemethod1": (e) => {

    },
    "click #datemethod2": (e) => {

    },
    "click #datemethod1-t2": (e) => {

    },
    "click #datemethod2-t2": (e) => {

    },
    "click #datemethod1-t2-2": (e) => {

    },
    "click #datemethod2-t2-2": (e) => {

    },
    "click #datemethod1-t3": (e) => {

    },
    "click #datemethod2-t3": (e) => {

    },
    'click #datemethod1, click #datemethod2, change #beginmonthlydate, change #currentyear': function(event) {
        let toDate = new Date();
        toDate = moment(toDate).format("YYYY-MM-DD");

        if ($("#datemethod1").prop('checked') == true) {
            if ($("#beginmonthlydate").val() != "" && $("#currentyear").val() != "" && $("#beginmonthlydate").val() != null && $("#currentyear").val() != null) {
                var endMonth = Math.ceil(parseInt($("#beginmonthlydate").val().split("-")[0]) / 3) * 3;
                toDate = new Date($("#currentyear").val(), (parseInt(endMonth)), 0);
                toDate = moment(toDate).format("YYYY-MM-DD");
                $("#endDate").val(toDate);
            }
        } else {
            if ($("#beginmonthlydate").val() != "" && $("#currentyear").val() != "" && $("#beginmonthlydate").val() != null && $("#currentyear").val() != null) {
                var endMonth = parseInt($("#beginmonthlydate").val().split("-")[0]);
                toDate = new Date($("#currentyear").val(), (parseInt(endMonth)), 0);
                toDate = moment(toDate).format("YYYY-MM-DD");
                $("#endDate").val(toDate);
            }
        }
    },
    'click #datemethod1-t2, click #datemethod2-t2, change #beginmonthlydate-t2, change #currentyear-t2': function(event) {
        let toDate = new Date();
        toDate = moment(toDate).format("YYYY-MM-DD");

        if ($("#datemethod1-t2").prop('checked') == true) {
            if ($("#beginmonthlydate-t2").val() != "" && $("#currentyear-t2").val() != "" && $("#beginmonthlydate-t2").val() != null && $("#currentyear-t2").val() != null) {
                var endMonth = Math.ceil(parseInt($("#beginmonthlydate-t2").val().split("-")[0]) / 3) * 3;
                toDate = new Date($("#currentyear-t2").val(), (parseInt(endMonth)), 0);
                toDate = moment(toDate).format("YYYY-MM-DD");
                $("#endDate-t2").val(toDate);
            }
        } else {
            if ($("#beginmonthlydate-t2").val() != "" && $("#currentyear-t2").val() != "" && $("#beginmonthlydate-t2").val() != null && $("#currentyear-t2").val() != null) {
                var endMonth = parseInt($("#beginmonthlydate-t2").val().split("-")[0]);
                toDate = new Date($("#currentyear-t2").val(), (parseInt(endMonth)), 0);
                toDate = moment(toDate).format("YYYY-MM-DD");
                $("#endDate-t2").val(toDate);
            }
        }
    },
    'click #datemethod1-t2-2, click #datemethod2-t2-2, change #beginmonthlydate-t2-2, change #currentyear-t2-2': function(event) {
        let toDate = new Date();
        toDate = moment(toDate).format("YYYY-MM-DD");

        if ($("#datemethod1-t2-2").prop('checked') == true) {
            if ($("#beginmonthlydate-t2-2").val() != "" && $("#currentyear-t2-2").val() != "" && $("#beginmonthlydate-t2-2").val() != null && $("#currentyear-t2-2").val() != null) {
                var endMonth = Math.ceil(parseInt($("#beginmonthlydate-t2-2").val().split("-")[0]) / 3) * 3;
                toDate = new Date($("#currentyear-t2-2").val(), (parseInt(endMonth)), 0);
                toDate = moment(toDate).format("YYYY-MM-DD");
                $("#endDate-t2-2").val(toDate);
            }
        } else {
            if ($("#beginmonthlydate-t2-2").val() != "" && $("#currentyear-t2-2").val() != "" && $("#beginmonthlydate-t2-2").val() != null && $("#currentyear-t2-2").val() != null) {
                var endMonth = parseInt($("#beginmonthlydate-t2-2").val().split("-")[0]);
                toDate = new Date($("#currentyear-t2-2").val(), (parseInt(endMonth)), 0);
                toDate = moment(toDate).format("YYYY-MM-DD");
                $("#endDate-t2-2").val(toDate);
            }
        }
    },
    'click #datemethod1-t3, click #datemethod2-t3, change #beginmonthlydate-t3, change #currentyear-t3': function(event) {
        let toDate = new Date();
        toDate = moment(toDate).format("YYYY-MM-DD");

        if ($("#datemethod1-t3").prop('checked') == true) {
            if ($("#beginmonthlydate-t3").val() != "" && $("#currentyear-t3").val() != "" && $("#beginmonthlydate-t3").val() != null && $("#currentyear-t3").val() != null) {
                var endMonth = Math.ceil(parseInt($("#beginmonthlydate-t3").val().split("-")[0]) / 3) * 3;
                toDate = new Date($("#currentyear-t3").val(), (parseInt(endMonth)), 0);
                toDate = moment(toDate).format("YYYY-MM-DD");
                $("#endDate-t3").val(toDate);
            }
        } else {
            if ($("#beginmonthlydate-t3").val() != "" && $("#currentyear-t3").val() != "" && $("#beginmonthlydate-t3").val() != null && $("#currentyear-t3").val() != null) {
                var endMonth = parseInt($("#beginmonthlydate-t3").val().split("-")[0]);
                toDate = new Date($("#currentyear-t3").val(), (parseInt(endMonth)), 0);
                toDate = moment(toDate).format("YYYY-MM-DD");
                $("#endDate-t3").val(toDate);
            }
        }
    },
    'click .btnselTaxList': function(event) {
        const templateObject = Template.instance();

        let gstPanID = $(event.target).attr('id').split("-")[1];
        Template.instance().selTaxList(gstPanID);

        var gst5cost = parseFloat($("#gst3cost").val()) + parseFloat($("#gst4cost").val());
        $("#gst5cost").val(gst5cost);
        $("#prt_gst5cost").html("$" + gst5cost);
        var gst6cost = parseFloat($("#gst1cost").val()) + parseFloat($("#gst2cost").val()) + gst5cost;
        $("#gst6cost").val(gst6cost);
        $("#prt_gst6cost").html("$" + gst6cost);
        var gst8cost = parseFloat($("#gst7cost").val()) + gst6cost;
        $("#gst8cost").val(gst8cost);
        $("#prt_gst8cost").html("$" + gst8cost);
        var gst9cost = gst8cost / 11;
        $("#gst9cost").val(gst9cost.toFixed(2));
        $("#prt_gst9cost").html("$" + gst9cost.toFixed(2));
        $("#debits1cost").val(gst9cost.toFixed(2));
        $("#prt_gst21cost").html("$" + gst9cost.toFixed(2));
        $("#prt_gst23cost").html("$" + gst9cost.toFixed(2));
        $("#prt_debits1cost").html("$" + gst9cost.toFixed(2));
        let debits2A = gst9cost + parseFloat($("#debits2cost").val()) + parseFloat($("#debits3cost").val());
        $("#debits4cost").val(debits2A.toFixed(2));
        $("#prt_debits4cost").html("$" + debits2A.toFixed(2));
        var gst12cost = parseFloat($("#gst10cost").val()) + parseFloat($("#gst11cost").val());
        $("#gst12cost").val(gst12cost);
        $("#prt_gst12cost").html("$" + gst12cost);
        var gst16cost = parseFloat($("#gst13cost").val()) + parseFloat($("#gst14cost").val()) + parseFloat($("#gst15cost").val());
        $("#gst16cost").val(gst16cost);
        $("#prt_gst16cost").html("$" + gst16cost);
        var gst17cost = gst12cost + gst16cost;
        $("#gst17cost").val(gst17cost);
        $("#prt_gst17cost").html("$" + gst17cost);
        var gst19cost = parseFloat($("#gst18cost").val()) + gst17cost;
        $("#gst19cost").val(gst19cost);
        $("#prt_gst19cost").html("$" + gst19cost);
        var gst20cost = gst19cost / 11;
        $("#gst20cost").val(gst20cost.toFixed(2));
        $("#prt_gst20cost").html("$" + gst20cost.toFixed(2));
        $("#credits1cost").val(gst20cost.toFixed(2));
        $("#prt_credits1cost").html("$" + gst20cost.toFixed(2));
        let credits2B = gst20cost + parseFloat($("#credits2cost").val()) + parseFloat($("#credits3cost").val()) + parseFloat($("#credits4cost").val());
        $("#credits5cost").val(credits2B.toFixed(2));
        $("#prt_credits5cost").html("$" + credits2B.toFixed(2));
        let debits3 = debits2A - credits2B;
        $("#debits5cost").val(debits3.toFixed(2));
        $("#prt_debits5cost").html("$" + debits3.toFixed(2));
        let credits8B = parseFloat($("#credits5cost").val()) + parseFloat($("#credits6cost").val()) + parseFloat($("#credits7cost").val()) + parseFloat($("#credits8cost").val());
        $("#credits9cost").val(credits8B.toFixed(2));
        $("#prt_credits9cost").html("$" + credits8B.toFixed(2));
        let debits8A = parseFloat($("#debits1cost").val()) + parseFloat($("#debits6cost").val()) + parseFloat($("#debits7cost").val()) + parseFloat($("#debits9cost").val());
        $("#debits10cost").val(debits8A.toFixed(2));
        $("#prt_debits10cost").html("$" + debits8A.toFixed(2));
        let debits9 = debits8A - parseFloat($("#credits9cost").val());
        $("#debits11cost").val(debits9.toFixed(2));
        $("#prt_debits11cost").html("$" + debits9.toFixed(2));

        $("#gst" + gstPanID + "option").modal("toggle");
    },
    'click .btnselAccountant': function(event) {
        const templateObject = Template.instance();

        let accountsPanID = $(event.target).attr('id').split("-")[1];
        if (accountsPanID == 5) {
            templateObject.selAccountant_2(accountsPanID);
        } else {
            templateObject.selAccountant(accountsPanID);
        }


        $("#accounts" + accountsPanID + "option").modal("toggle");
    },
    'click .btnsel3TaxList': function(event) {
        const templateObject = Template.instance();

        let taxcodesPanID = $(event.target).attr('id').split("-")[1];
        templateObject.sel3TaxList(taxcodesPanID);

        $("#t3taxcodes" + taxcodesPanID + "option").modal("toggle");
    },
    'click .btnsel3Accountant': function(event) {
        const templateObject = Template.instance();

        let accountsPanID = $(event.target).attr('id').split("-")[1];
        templateObject.sel3Accountant(accountsPanID);

        $("#t3accounts" + accountsPanID + "option").modal("toggle");
    },
    'keyup #accounts9cost, keyup #accounts10cost, keyup #accounts11cost': function(event) {
        let debits6A = parseFloat($("#accounts9cost").val()) + parseFloat($("#accounts10cost").val()) + parseFloat($("#accounts11cost").val());
        $("#debits8cost").val(debits6A.toFixed(2));
        $("#prt_debits8cost").html("$" + debits6A.toFixed(2));
    },
    'keyup #debits9cost': function(event) {
        let debits8A = parseFloat($("#debits1cost").val()) + parseFloat($("#debits6cost").val()) + parseFloat($("#debits7cost").val()) + parseFloat($("#debits9cost").val());
        $("#debits10cost").val(debits8A.toFixed(2));
        $("#prt_debits10cost").html("$" + debits8A.toFixed(2));
        let debits9 = debits8A - parseFloat($("#credits9cost").val());
        $("#debits11cost").val(debits9.toFixed(2));
        $("#prt_debits11cost").html("$" + debits9.toFixed(2));
    },
    'keyup #credits6cost, keyup #credits7cost': function(event) {
        let credits8B = parseFloat($("#credits5cost").val()) + parseFloat($("#credits6cost").val()) + parseFloat($("#credits7cost").val()) + parseFloat($("#credits8cost").val());
        $("#credits9cost").val(credits8B.toFixed(2));
        $("#prt_credits9cost").html("$" + credits8B.toFixed(2));
        let debits8A = parseFloat($("#debits1cost").val()) + parseFloat($("#debits6cost").val()) + parseFloat($("#debits7cost").val()) + parseFloat($("#debits9cost").val());
        $("#debits10cost").val(debits8A.toFixed(2));
        $("#prt_debits10cost").html("$" + debits8A.toFixed(2));
        let debits9 = parseFloat($("#debits10cost").val()) - parseFloat($("#credits9cost").val());
        $("#debits11cost").val(debits9.toFixed(2));
        $("#prt_debits11cost").html("$" + debits9.toFixed(2));
    },
    'dblclick .transactionView': function(event) {
        const templateObject = Template.instance();
        let getID = $(event.target).attr('id');

        if (parseFloat($("#" + getID).val()) > 0) {
            if (!templateObject.getId.get()) {
                swal({
                    title: 'BAS Return Details',
                    text: "You must save it to go to the BAS Return Details page.\r\nDo you want to save the data?",
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.value) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let taxRateList = templateObject.taxRateList.get();
                        let accountsList = templateObject.accountsList.get();


                        let dataArray = [];
                        let description = $('#description').val();
                        let departmentId = $('#sltDepartment').val();
                        let accountingMethod = "Accrual";
                        if ($("#accountingmethod1").prop('checked') == true) {
                            accountingMethod = "Accrual";
                        } else {
                            accountingMethod = "Cash";
                        }
                        let datemethod = "q";
                        let startDate = "0000-00-00";
                        let endDate = "0000-00-00";
                        if ($("#datemethod1").prop('checked') == true) {
                            datemethod = "q";
                        } else {
                            datemethod = "m";
                        }
                        if ($("#beginmonthlydate").val() != "" && $("#currentyear").val() != "" && $("#beginmonthlydate").val() != null && $("#currentyear").val() != null) {
                            startDate = new Date($("#currentyear").val() + "-" + $("#beginmonthlydate").val());
                            startDate = moment(startDate).format("YYYY-MM-DD");
                            endDate = $("#endDate").val();
                        }

                        let gst1cost = $('#gst1cost').val();
                        let gst2cost = $('#gst2cost').val();
                        let gst3cost = $('#gst3cost').val();
                        let gst4cost = $('#gst4cost').val();
                        let gst5cost = $('#gst5cost').val();
                        let gst6cost = $('#gst6cost').val();
                        let gst7cost = $('#gst7cost').val();
                        let gst8cost = $('#gst8cost').val();
                        let gst9cost = $('#gst9cost').val();
                        let gst10cost = $('#gst10cost').val();
                        let gst11cost = $('#gst11cost').val();
                        let gst12cost = $('#gst12cost').val();
                        let gst13cost = $('#gst13cost').val();
                        let gst14cost = $('#gst14cost').val();
                        let gst15cost = $('#gst15cost').val();
                        let gst16cost = $('#gst16cost').val();
                        let gst17cost = $('#gst17cost').val();
                        let gst18cost = $('#gst18cost').val();
                        let gst19cost = $('#gst19cost').val();
                        let gst20cost = $('#gst20cost').val();
                        let gst1taxcodes = [];
                        let gst2taxcodes = [];
                        let gst3taxcodes = [];
                        let gst4taxcodes = [];
                        let gst7taxcodes = [];
                        let gst10taxcodes = [];
                        let gst11taxcodes = [];
                        let gst13taxcodes = [];
                        let gst14taxcodes = [];
                        let gst15taxcodes = [];
                        let gst18taxcodes = [];
                        let t3taxcodes1 = [];
                        let t3taxcodes2 = [];
                        let t3taxcodes3 = [];
                        let t3taxcodes4 = [];
                        let t3taxcodes5 = [];
                        for (var i = 0; i < taxRateList.length; i++) {
                            if ($("#t-1-" + taxRateList[i].Id).prop('checked') == true) {
                                gst1taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-2-" + taxRateList[i].Id).prop('checked') == true) {
                                gst2taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-3-" + taxRateList[i].Id).prop('checked') == true) {
                                gst3taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-4-" + taxRateList[i].Id).prop('checked') == true) {
                                gst4taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-7-" + taxRateList[i].Id).prop('checked') == true) {
                                gst7taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-10-" + taxRateList[i].Id).prop('checked') == true) {
                                gst10taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-11-" + taxRateList[i].Id).prop('checked') == true) {
                                gst11taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-13-" + taxRateList[i].Id).prop('checked') == true) {
                                gst13taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-14-" + taxRateList[i].Id).prop('checked') == true) {
                                gst14taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-15-" + taxRateList[i].Id).prop('checked') == true) {
                                gst15taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t-18-" + taxRateList[i].Id).prop('checked') == true) {
                                gst18taxcodes.push(taxRateList[i].Id)
                            } else if ($("#t3-1-" + taxRateList[i].Id).prop('checked') == true) {
                                t3taxcodes1.push(taxRateList[i].Id)
                            } else if ($("#t3-2-" + taxRateList[i].Id).prop('checked') == true) {
                                t3taxcodes2.push(taxRateList[i].Id)
                            } else if ($("#t3-3-" + taxRateList[i].Id).prop('checked') == true) {
                                t3taxcodes3.push(taxRateList[i].Id)
                            } else if ($("#t3-4-" + taxRateList[i].Id).prop('checked') == true) {
                                t3taxcodes4.push(taxRateList[i].Id)
                            } else if ($("#t3-5-" + taxRateList[i].Id).prop('checked') == true) {
                                t3taxcodes5.push(taxRateList[i].Id)
                            }
                        }
                        let datemethodT2 = "q";
                        let startDateT2 = "0000-00-00";
                        var endDateT2 = "0000-00-00";
                        if ($("#datemethod1-t2").prop('checked') == true) {
                            datemethodT2 = "q";
                        } else {
                            datemethodT2 = "m";
                        }
                        if ($("#beginmonthlydate-t2").val() != "" && $("#currentyear-t2").val() != "" && $("#beginmonthlydate-t2").val() != null && $("#currentyear-t2").val() != null) {
                            startDateT2 = new Date($("#currentyear-t2").val() + "-" + $("#beginmonthlydate-t2").val());
                            startDateT2 = moment(startDateT2).format("YYYY-MM-DD");
                            endDateT2 = $("#endDate-t2").val();
                        }
                        let datemethodT2_2 = "q";
                        let startDateT2_2 = "0000-00-00";
                        var endDateT2_2 = "0000-00-00";
                        if ($("#datemethod1-t2-2").prop('checked') == true) {
                            datemethodT2_2 = "q";
                        } else {
                            datemethodT2_2 = "m";
                        }
                        if ($("#beginmonthlydate-t2-2").val() != "" && $("#currentyear-t2-2").val() != "" && $("#beginmonthlydate-t2-2").val() != null && $("#currentyear-t2-2").val() != null) {
                            startDateT2_2 = new Date($("#currentyear-t2-2").val() + "-" + $("#beginmonthlydate-t2-2").val());
                            startDateT2_2 = moment(startDateT2_2).format("YYYY-MM-DD");
                            endDateT2_2 = $("#endDate-t2-2").val();
                        }
                        let accounts1cost = $('#accounts1cost').val();
                        let accounts2cost = $('#accounts2cost').val();
                        let accounts3cost = $('#accounts3cost').val();
                        let accounts4cost = $('#accounts4cost').val();
                        let accounts5cost = $('#accounts5cost').val();
                        let accounts6cost = $('#accounts6cost').val();
                        let accounts7cost = $('#accounts7cost').val();
                        let reasonT4 = $('#reasonT4').val();
                        let accounts9cost = $('#accounts9cost').val();
                        let accounts10cost = $('#accounts10cost').val();
                        let accounts11cost = $('#accounts11cost').val();
                        let reasonF4 = $('#reasonF4').val();
                        let accounts1 = [];
                        let accounts2 = [];
                        let accounts3 = [];
                        let accounts4 = [];
                        let accounts5 = [];
                        let t3accounts1 = [];
                        for (var i = 0; i < accountsList.length; i++) {
                            if ($("#f-1-" + accountsList[i].id).prop('checked') == true) {
                                accounts1.push(accountsList[i].id)
                            }
                            if ($("#f-2-" + accountsList[i].id).prop('checked') == true) {
                                accounts2.push(accountsList[i].id)
                            }
                            if ($("#f-3-" + accountsList[i].id).prop('checked') == true) {
                                accounts3.push(accountsList[i].id)
                            }
                            if ($("#f-4-" + accountsList[i].id).prop('checked') == true) {
                                accounts4.push(accountsList[i].id)
                            }
                            if ($("#f-5-" + accountsList[i].id).prop('checked') == true) {
                                accounts5.push(accountsList[i].id)
                            }
                            if ($("#f3-1-" + accountsList[i].id).prop('checked') == true) {
                                t3accounts1.push(accountsList[i].id)
                            }
                        }
                        let datemethodT3 = "q";
                        let startDateT3 = "0000-00-00";
                        var endDateT3 = "0000-00-00";
                        if ($("#datemethod1-t3").prop('checked') == true) {
                            datemethodT3 = "q";
                        } else {
                            datemethodT3 = "m";
                        }
                        if ($("#beginmonthlydate-t3").val() != "" && $("#currentyear-t3").val() != "" && $("#beginmonthlydate-t3").val() != null && $("#currentyear-t3").val() != null) {
                            startDateT3 = new Date($("#currentyear-t3").val() + "-" + $("#beginmonthlydate-t3").val());
                            startDateT3 = moment(startDateT3).format("YYYY-MM-DD");
                            endDateT3 = $("#endDate-t3").val();
                        }
                        let t3taxcodes1cost = $('#t3taxcodes1cost').val();
                        let t3taxcodes2cost = $('#t3taxcodes2cost').val();
                        let t3taxcodes3cost = $('#t3taxcodes3cost').val();
                        let t3taxcodes4cost = $('#t3taxcodes4cost').val();
                        let t3taxcodes5cost = $('#t3taxcodes5cost').val();
                        let t3accounts1cost = $('#t3accounts1cost').val();
                        let debits1cost = $('#debits1cost').val();
                        let debits2cost = $('#debits2cost').val();
                        let debits3cost = $('#debits3cost').val();
                        let debits4cost = $('#debits4cost').val();
                        let debits5cost = $('#debits5cost').val();
                        let debits6cost = $('#debits6cost').val();
                        let debits7cost = $('#debits7cost').val();
                        let debits8cost = $('#debits8cost').val();
                        let debits9cost = $('#debits9cost').val();
                        let debits10cost = $('#debits10cost').val();
                        let debits11cost = $('#debits11cost').val();
                        let credits1cost = $('#credits1cost').val();
                        let credits2cost = $('#credits2cost').val();
                        let credits3cost = $('#credits3cost').val();
                        let credits4cost = $('#credits4cost').val();
                        let credits5cost = $('#credits5cost').val();
                        let credits6cost = $('#credits6cost').val();
                        let credits7cost = $('#credits7cost').val();
                        let credits8cost = $('#credits8cost').val();
                        let credits9cost = $('#credits9cost').val();

                        if (description == "") {
                            swal('BAS Return Description cannot be blank!', '', 'warning');
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            getVS1Data('TBASReturn').then(function(dataObject) {
                                if (dataObject.length > 0) {
                                    dataArray = JSON.parse(dataObject[0].data);
                                }
                            });

                            setTimeout(function() {
                                let basnumber = (dataArray.length) ? (parseInt(dataArray[0].basNumber) + 1) : 1;
                                let jsonObj = {
                                    basNumber: basnumber,
                                    description: description,
                                    departmentId: departmentId,
                                    accountingMethod: accountingMethod,
                                    basReturnTab1: {
                                        datemethod: datemethod,
                                        startDate: startDate,
                                        endDate: endDate,
                                        tab1G1: {
                                            amount: gst1cost,
                                            taxcodes: gst1taxcodes
                                        },
                                        tab1G2: {
                                            amount: gst2cost,
                                            taxcodes: gst2taxcodes
                                        },
                                        tab1G3: {
                                            amount: gst3cost,
                                            taxcodes: gst3taxcodes
                                        },
                                        tab1G4: {
                                            amount: gst4cost,
                                            taxcodes: gst4taxcodes
                                        },
                                        tab1G5: {
                                            amount: gst5cost,
                                        },
                                        tab1G6: {
                                            amount: gst6cost,
                                        },
                                        tab1G7: {
                                            amount: gst7cost,
                                            taxcodes: gst7taxcodes
                                        },
                                        tab1G8: {
                                            amount: gst8cost,
                                        },
                                        tab1G9: {
                                            amount: gst9cost,
                                        },
                                        tab1G10: {
                                            amount: gst10cost,
                                            taxcodes: gst10taxcodes
                                        },
                                        tab1G11: {
                                            amount: gst11cost,
                                            taxcodes: gst11taxcodes
                                        },
                                        tab1G12: {
                                            amount: gst12cost,
                                        },
                                        tab1G13: {
                                            amount: gst13cost,
                                            taxcodes: gst13taxcodes
                                        },
                                        tab1G14: {
                                            amount: gst14cost,
                                            taxcodes: gst14taxcodes
                                        },
                                        tab1G15: {
                                            amount: gst15cost,
                                            taxcodes: gst15taxcodes
                                        },
                                        tab1G16: {
                                            amount: gst16cost,
                                        },
                                        tab1G17: {
                                            amount: gst17cost,
                                        },
                                        tab1G18: {
                                            amount: gst18cost,
                                            taxcodes: gst18taxcodes
                                        },
                                        tab1G19: {
                                            amount: gst19cost,
                                        },
                                        tab1G20: {
                                            amount: gst20cost,
                                        },
                                    },
                                    basReturnTab2: {
                                        datemethod: datemethodT2,
                                        startDate: startDateT2,
                                        endDate: endDateT2,
                                        datemethod_2: datemethodT2_2,
                                        startDate_2: startDateT2_2,
                                        endDate_2: endDateT2_2,
                                        tab2W1: {
                                            amount: accounts1cost,
                                            accounts: accounts1
                                        },
                                        tab2W2: {
                                            amount: accounts2cost,
                                            accounts: accounts2
                                        },
                                        tab2W3: {
                                            amount: accounts3cost,
                                            accounts: accounts3
                                        },
                                        tab2W4: {
                                            amount: accounts4cost,
                                            accounts: accounts4
                                        },
                                        tab2T1: {
                                            amount: accounts5cost,
                                            accounts: accounts5
                                        },
                                        tab2T2: {
                                            amount: accounts6cost
                                        },
                                        tab2T3: {
                                            amount: accounts7cost
                                        },
                                        tab2T4: {
                                            reason: reasonT4
                                        },
                                        tab2F1: {
                                            amount: accounts9cost
                                        },
                                        tab2F2: {
                                            amount: accounts10cost
                                        },
                                        tab2F3: {
                                            amount: accounts11cost
                                        },
                                        tab2F4: {
                                            reason: reasonF4
                                        },
                                    },
                                    basReturnTab3: {
                                        datemethod: datemethodT3,
                                        startDate: startDateT3,
                                        endDate: endDateT3,
                                        tab31C: {
                                            amount: t3taxcodes1cost,
                                            taxcodes: t3taxcodes1
                                        },
                                        tab31E: {
                                            amount: t3taxcodes2cost,
                                            taxcodes: t3taxcodes2
                                        },
                                        tab31D: {
                                            amount: t3taxcodes3cost,
                                            taxcodes: t3taxcodes3
                                        },
                                        tab31F: {
                                            amount: t3taxcodes4cost,
                                            taxcodes: t3taxcodes4
                                        },
                                        tab31G: {
                                            amount: t3taxcodes5cost,
                                            taxcodes: t3taxcodes5
                                        },
                                        tab37D: {
                                            amount: t3accounts1cost,
                                            accounts: t3accounts1
                                        },
                                    },
                                    basReturnTab4: {
                                        tab41A: {
                                            amount: debits1cost
                                        },
                                        tab41C: {
                                            amount: debits2cost
                                        },
                                        tab41E: {
                                            amount: debits3cost
                                        },
                                        tab42A: {
                                            amount: debits4cost
                                        },
                                        tab43: {
                                            amount: debits5cost
                                        },
                                        tab44: {
                                            amount: debits6cost
                                        },
                                        tab45A: {
                                            amount: debits7cost
                                        },
                                        tab46A: {
                                            amount: debits8cost
                                        },
                                        tab47: {
                                            amount: debits9cost
                                        },
                                        tab48A: {
                                            amount: debits10cost
                                        },
                                        tab49: {
                                            amount: debits11cost
                                        },
                                        tab41B: {
                                            amount: credits1cost
                                        },
                                        tab41D: {
                                            amount: credits2cost
                                        },
                                        tab41F: {
                                            amount: credits3cost
                                        },
                                        tab41G: {
                                            amount: credits4cost
                                        },
                                        tab42B: {
                                            amount: credits5cost
                                        },
                                        tab45B: {
                                            amount: credits6cost
                                        },
                                        tab46B: {
                                            amount: credits7cost
                                        },
                                        tab47D: {
                                            amount: credits8cost
                                        },
                                        tab48B: {
                                            amount: credits9cost
                                        },
                                    }
                                }

                                if (templateObject.getId.get()) {
                                    dataArray.forEach((item, j) => {
                                        if (item.basNumber == templateObject.getId.get()) {
                                            dataArray[j] = jsonObj;
                                            dataArray[j].basNumber = templateObject.getId.get();
                                        }
                                    });
                                } else {
                                    dataArray.unshift(jsonObj);
                                }

                                templateObject.getId.set(basnumber);

                                addVS1Data('TBASReturn', JSON.stringify(dataArray)).then(function(datareturn) {
                                    if (getID == "gst1cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G1");
                                    } else if (getID == "gst2cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G2");
                                    } else if (getID == "gst3cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G3");
                                    } else if (getID == "gst4cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G4");
                                    } else if (getID == "gst7cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G7");
                                    } else if (getID == "gst10cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G10");
                                    } else if (getID == "gst11cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G11");
                                    } else if (getID == "gst13cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G13");
                                    } else if (getID == "gst14cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G14");
                                    } else if (getID == "gst15cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G15");
                                    } else if (getID == "gst18cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G18");
                                    } else if (getID == "accounts1cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=W1");
                                    } else if (getID == "accounts2cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=W2");
                                    } else if (getID == "accounts3cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=W3");
                                    } else if (getID == "accounts4cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=W4");
                                    } else if (getID == "accounts5cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=T1");
                                    } else if (getID == "t3taxcodes1cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1C");
                                    } else if (getID == "t3taxcodes2cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1E");
                                    } else if (getID == "t3taxcodes3cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1D");
                                    } else if (getID == "t3taxcodes4cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1F");
                                    } else if (getID == "t3taxcodes5cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1G");
                                    } else if (getID == "t3accounts1cost") {
                                        FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=7D");
                                    }
                                    $('.fullScreenSpin').css('display', 'none');
                                    // FlowRouter.go('/basreturnlist');
                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }, 500);
                        }
                    } else {}
                });
            } else {
                if (getID == "gst1cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G1");
                } else if (getID == "gst2cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G2");
                } else if (getID == "gst3cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G3");
                } else if (getID == "gst4cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G4");
                } else if (getID == "gst7cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G7");
                } else if (getID == "gst10cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G10");
                } else if (getID == "gst11cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G11");
                } else if (getID == "gst13cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G13");
                } else if (getID == "gst14cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G14");
                } else if (getID == "gst15cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G15");
                } else if (getID == "gst18cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=G18");
                } else if (getID == "accounts1cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=W1");
                } else if (getID == "accounts2cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=W2");
                } else if (getID == "accounts3cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=W3");
                } else if (getID == "accounts4cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=W4");
                } else if (getID == "accounts5cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=T1");
                } else if (getID == "t3taxcodes1cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1C");
                } else if (getID == "t3taxcodes2cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1E");
                } else if (getID == "t3taxcodes3cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1D");
                } else if (getID == "t3taxcodes4cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1F");
                } else if (getID == "t3taxcodes5cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=1G");
                } else if (getID == "t3accounts1cost") {
                    FlowRouter.go("/basreturntransactionlist?basreturnid=" + templateObject.getId.get() + "&transactionitem=7D");
                }
            }
        }
    },



    'click .btnRefresh': function(event) {
        let templateObject = Template.instance();
        let fromDate = "0000-00-00";
        let toDate = new Date();
        toDate = moment(toDate).format("YYYY-MM-DD");

        $('.fullScreenSpin').css('display', 'inline-block');
        if ($("#beginmonthlydate").val() != "" && $("#currentyear").val() != "" && $("#beginmonthlydate").val() != null && $("#currentyear").val() != null) {
            fromDate = new Date($("#currentyear").val() + "-" + $("#beginmonthlydate").val());
            fromDate = moment(fromDate).format("YYYY-MM-DD");
            toDate = $("#endDate").val();
            templateObject.getTaxSummaryReports(fromDate, toDate, false, "t1");
        }
        if ($("#beginmonthlydate-t2").val() != "" && $("#currentyear-t2").val() != "" && $("#beginmonthlydate-t2").val() != null && $("#currentyear-t2").val() != null) {
            fromDate = new Date($("#currentyear-t2").val() + "-" + $("#beginmonthlydate-t2").val());
            fromDate = moment(fromDate).format("YYYY-MM-DD");
            toDate = $("#endDate-t2").val();
            templateObject.getAccountsSummaryReports(fromDate, toDate, 't2');
        }
        if ($("#beginmonthlydate-t2-2").val() != "" && $("#currentyear-t2-2").val() != "" && $("#beginmonthlydate-t2-2").val() != null && $("#currentyear-t2-2").val() != null) {
            fromDate = new Date($("#currentyear-t2-2").val() + "-" + $("#beginmonthlydate-t2-2").val());
            fromDate = moment(fromDate).format("YYYY-MM-DD");
            toDate = $("#endDate-t2-2").val();
            templateObject.getAccountsSummaryReports(fromDate, toDate, 't2-2');
        }
        if ($("#beginmonthlydate-t3").val() != "" && $("#currentyear-t3").val() != "" && $("#beginmonthlydate-t3").val() != null && $("#currentyear-t3").val() != null) {
            fromDate = new Date($("#currentyear-t3").val() + "-" + $("#beginmonthlydate-t3").val());
            fromDate = moment(fromDate).format("YYYY-MM-DD");
            toDate = $("#endDate-t3").val();
            templateObject.getTaxSummaryReports(fromDate, toDate, false, "t3");
            templateObject.getAccountsSummaryReports(fromDate, toDate, 't3');
        }
    },
    'click .printConfirm': function(event) {
        playPrintAudio();
        setTimeout(function() {
            $(".printBASReturn").show();
            $("a").attr("href", "/");
            document.title = "BAS Return";
            $(".printBASReturn").print({
                title: document.title + " | " + loggedCompany,
                noPrintSelector: ".addSummaryEditor",
                mediaPrint: false,
            });

            setTimeout(function() {
                $("a").attr("href", "#");
                $(".printBASReturn").hide();
            }, 100);
        }, delayTimeAfterSound);
    },
    'click .btnRemove': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectDeleteLineID').val(targetID);

        times++;

        if (times == 1) {
            $('#deleteLineModal').modal('toggle');
        } else {
            if ($('#tblJournalEntryLine tbody>tr').length > 1) {
                this.click;
                $(event.target).closest('tr').remove();
                event.preventDefault();
                let $tblrows = $("#tblJournalEntryLine tbody tr");

                let lineAmount = 0;
                let subGrandTotal = 0;
                let taxGrandTotal = 0;


                return false;

            } else {
                $('#deleteLineModal').modal('toggle');
            }
        }
    },
    'click .btnDelete': function(event) {
        playDeleteAudio();
        let templateObject = Template.instance();
        setTimeout(function() {


            if (templateObject.getId.get()) {
                swal({
                    title: 'Delete BAS Return',
                    text: "Are you sure you want to Delete this BAS Return?",
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.value) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        getVS1Data('TBASReturn').then(function(dataObject) {
                            if (dataObject.length > 0) {
                                let dataArray = JSON.parse(dataObject[0].data);
                                dataArray.forEach((item, j) => {
                                    if (item.basNumber == templateObject.getId.get()) {
                                        dataArray.splice(j, 1);
                                    }
                                });
                                addVS1Data('TBASReturn', JSON.stringify(dataArray)).then(function(datareturn) {
                                    FlowRouter.go('/basreturnlist');
                                    $('.modal-backdrop').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                }).catch(function(err) {
                                    swal({
                                        title: 'Oooops...',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) { if (err === checkResponseError) { window.open('/', '_self'); } } else if (result.dismiss === 'cancel') {

                                        }
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }
                        });
                    } else {}
                });
            }
        }, delayTimeAfterSound);
    },
    'click .btnSaveSettings': function(event) {
        playSaveAudio();
        setTimeout(function() {
            $('#myModal4').modal('toggle');
        }, delayTimeAfterSound);
    },
    'click .btnSave': function(event) {
        let templateObject = Template.instance();
        playSaveAudio();
        setTimeout(function() {
            $('.fullScreenSpin').css('display', 'inline-block');
            let taxRateList = templateObject.taxRateList.get();
            let accountsList = templateObject.accountsList.get();

            let dataArray = [];
            let description = $('#description').val();
            let departmentId = "all";
            if ($("#allDepart").prop('checked') == false) {
                departmentId = $('#sltDepartment').val();
            }
            let accountingMethod = "Accrual";
            if ($("#accountingmethod1").prop('checked') == true) {
                accountingMethod = "Accrual";
            } else {
                accountingMethod = "Cash";
            }
            let datemethod = "q";
            let startDate = "0000-00-00";
            let endDate = "0000-00-00";
            if ($("#datemethod1").prop('checked') == true) {
                datemethod = "q";
            } else {
                datemethod = "m";
            }
            if ($("#beginmonthlydate").val() != "" && $("#currentyear").val() != "" && $("#beginmonthlydate").val() != null && $("#currentyear").val() != null) {
                startDate = new Date($("#currentyear").val() + "-" + $("#beginmonthlydate").val());
                startDate = moment(startDate).format("YYYY-MM-DD");
                endDate = $("#endDate").val();
            }
            let gst1cost = $('#gst1cost').val();
            let gst2cost = $('#gst2cost').val();
            let gst3cost = $('#gst3cost').val();
            let gst4cost = $('#gst4cost').val();
            let gst5cost = $('#gst5cost').val();
            let gst6cost = $('#gst6cost').val();
            let gst7cost = $('#gst7cost').val();
            let gst8cost = $('#gst8cost').val();
            let gst9cost = $('#gst9cost').val();
            let gst10cost = $('#gst10cost').val();
            let gst11cost = $('#gst11cost').val();
            let gst12cost = $('#gst12cost').val();
            let gst13cost = $('#gst13cost').val();
            let gst14cost = $('#gst14cost').val();
            let gst15cost = $('#gst15cost').val();
            let gst16cost = $('#gst16cost').val();
            let gst17cost = $('#gst17cost').val();
            let gst18cost = $('#gst18cost').val();
            let gst19cost = $('#gst19cost').val();
            let gst20cost = $('#gst20cost').val();
            let gst1taxcodes = [];
            let gst2taxcodes = [];
            let gst3taxcodes = [];
            let gst4taxcodes = [];
            let gst7taxcodes = [];
            let gst10taxcodes = [];
            let gst11taxcodes = [];
            let gst13taxcodes = [];
            let gst14taxcodes = [];
            let gst15taxcodes = [];
            let gst18taxcodes = [];
            let t3taxcodes1 = [];
            let t3taxcodes2 = [];
            let t3taxcodes3 = [];
            let t3taxcodes4 = [];
            let t3taxcodes5 = [];
            for (var i = 0; i < taxRateList.length; i++) {
                if ($("#t-1-" + taxRateList[i].Id).prop('checked') == true) {
                    gst1taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-2-" + taxRateList[i].Id).prop('checked') == true) {
                    gst2taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-3-" + taxRateList[i].Id).prop('checked') == true) {
                    gst3taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-4-" + taxRateList[i].Id).prop('checked') == true) {
                    gst4taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-7-" + taxRateList[i].Id).prop('checked') == true) {
                    gst7taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-10-" + taxRateList[i].Id).prop('checked') == true) {
                    gst10taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-11-" + taxRateList[i].Id).prop('checked') == true) {
                    gst11taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-13-" + taxRateList[i].Id).prop('checked') == true) {
                    gst13taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-14-" + taxRateList[i].Id).prop('checked') == true) {
                    gst14taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-15-" + taxRateList[i].Id).prop('checked') == true) {
                    gst15taxcodes.push(taxRateList[i].Id)
                } else if ($("#t-18-" + taxRateList[i].Id).prop('checked') == true) {
                    gst18taxcodes.push(taxRateList[i].Id)
                } else if ($("#t3-1-" + taxRateList[i].Id).prop('checked') == true) {
                    t3taxcodes1.push(taxRateList[i].Id)
                } else if ($("#t3-2-" + taxRateList[i].Id).prop('checked') == true) {
                    t3taxcodes2.push(taxRateList[i].Id)
                } else if ($("#t3-3-" + taxRateList[i].Id).prop('checked') == true) {
                    t3taxcodes3.push(taxRateList[i].Id)
                } else if ($("#t3-4-" + taxRateList[i].Id).prop('checked') == true) {
                    t3taxcodes4.push(taxRateList[i].Id)
                } else if ($("#t3-5-" + taxRateList[i].Id).prop('checked') == true) {
                    t3taxcodes5.push(taxRateList[i].Id)
                }
            }
            let datemethodT2 = "q";
            let startDateT2 = "0000-00-00";
            let endDateT2 = "0000-00-00";
            if ($("#datemethod1-t2").prop('checked') == true) {
                datemethodT2 = "q";
            } else {
                datemethodT2 = "m";
            }
            if ($("#beginmonthlydate-t2").val() != "" && $("#currentyear-t2").val() != "" && $("#beginmonthlydate-t2").val() != null && $("#currentyear-t2").val() != null) {
                startDateT2 = new Date($("#currentyear-t2").val() + "-" + $("#beginmonthlydate-t2").val());
                startDateT2 = moment(startDateT2).format("YYYY-MM-DD");
                endDateT2 = $("#endDate-t2").val();
            }
            let datemethodT2_2 = "q";
            let startDateT2_2 = "0000-00-00";
            let endDateT2_2 = "0000-00-00";
            if ($("#datemethod1-t2-2").prop('checked') == true) {
                datemethodT2_2 = "q";
            } else {
                datemethodT2_2 = "m";
            }
            if ($("#beginmonthlydate-t2-2").val() != "" && $("#currentyear-t2-2").val() != "" && $("#beginmonthlydate-t2-2").val() != null && $("#currentyear-t2-2").val() != null) {
                startDateT2_2 = new Date($("#currentyear-t2-2").val() + "-" + $("#beginmonthlydate-t2-2").val());
                startDateT2_2 = moment(startDateT2_2).format("YYYY-MM-DD");
                endDateT2_2 = $("#endDate-t2-2").val();
            }
            let accounts1cost = $('#accounts1cost').val();
            let accounts2cost = $('#accounts2cost').val();
            let accounts3cost = $('#accounts3cost').val();
            let accounts4cost = $('#accounts4cost').val();
            let accounts5cost = $('#accounts5cost').val();
            let accounts6cost = $('#accounts6cost').val();
            let accounts7cost = $('#accounts7cost').val();
            let reasonT4 = $('#reasonT4').val();
            let accounts9cost = $('#accounts9cost').val();
            let accounts10cost = $('#accounts10cost').val();
            let accounts11cost = $('#accounts11cost').val();
            let reasonF4 = $('#reasonF4').val();
            let accounts1 = [];
            let accounts2 = [];
            let accounts3 = [];
            let accounts4 = [];
            let accounts5 = [];
            let t3accounts1 = [];
            for (var i = 0; i < accountsList.length; i++) {
                if ($("#f-1-" + accountsList[i].id).prop('checked') == true) {
                    accounts1.push(accountsList[i].id)
                }
                if ($("#f-2-" + accountsList[i].id).prop('checked') == true) {
                    accounts2.push(accountsList[i].id)
                }
                if ($("#f-3-" + accountsList[i].id).prop('checked') == true) {
                    accounts3.push(accountsList[i].id)
                }
                if ($("#f-4-" + accountsList[i].id).prop('checked') == true) {
                    accounts4.push(accountsList[i].id)
                }
                if ($("#f-5-" + accountsList[i].id).prop('checked') == true) {
                    accounts5.push(accountsList[i].id)
                }
                if ($("#f3-1-" + accountsList[i].id).prop('checked') == true) {
                    t3accounts1.push(accountsList[i].id)
                }
            }
            let datemethodT3 = "q";
            let startDateT3 = "0000-00-00";
            var endDateT3 = "0000-00-00";
            if ($("#datemethod1-t3").prop('checked') == true) {
                datemethodT3 = "q";
            } else {
                datemethodT3 = "m";
            }
            if ($("#beginmonthlydate-t3").val() != "" && $("#currentyear-t3").val() != "" && $("#beginmonthlydate-t3").val() != null && $("#currentyear-t3").val() != null) {
                startDateT3 = new Date($("#currentyear-t3").val() + "-" + $("#beginmonthlydate-t3").val());
                startDateT3 = moment(startDateT3).format("YYYY-MM-DD");
                endDateT3 = $("#endDate-t3").val();
            }
            let t3taxcodes1cost = $('#t3taxcodes1cost').val();
            let t3taxcodes2cost = $('#t3taxcodes2cost').val();
            let t3taxcodes3cost = $('#t3taxcodes3cost').val();
            let t3taxcodes4cost = $('#t3taxcodes4cost').val();
            let t3taxcodes5cost = $('#t3taxcodes5cost').val();
            let t3accounts1cost = $('#t3accounts1cost').val();
            let debits1cost = $('#debits1cost').val();
            let debits2cost = $('#debits2cost').val();
            let debits3cost = $('#debits3cost').val();
            let debits4cost = $('#debits4cost').val();
            let debits5cost = $('#debits5cost').val();
            let debits6cost = $('#debits6cost').val();
            let debits7cost = $('#debits7cost').val();
            let debits8cost = $('#debits8cost').val();
            let debits9cost = $('#debits9cost').val();
            let debits10cost = $('#debits10cost').val();
            let debits11cost = $('#debits11cost').val();
            let credits1cost = $('#credits1cost').val();
            let credits2cost = $('#credits2cost').val();
            let credits3cost = $('#credits3cost').val();
            let credits4cost = $('#credits4cost').val();
            let credits5cost = $('#credits5cost').val();
            let credits6cost = $('#credits6cost').val();
            let credits7cost = $('#credits7cost').val();
            let credits8cost = $('#credits8cost').val();
            let credits9cost = $('#credits9cost').val();

            if (description === '') {
                // Bert.alert('<strong>WARNING:</strong> BAS Return Description cannot be blank!', 'warning');
                swal('BAS Return Description cannot be blank!', '', 'warning');
                $('.fullScreenSpin').css('display', 'none');
            } else {
                getVS1Data('TBASReturn').then(function(dataObject) {
                    if (dataObject.length > 0) {
                        dataArray = JSON.parse(dataObject[0].data);
                    }
                });

                setTimeout(function() {
                    let basnumber = (dataArray.length) ? (parseInt(dataArray[0].basNumber) + 1) : 1;
                    let jsonObj = {
                        basNumber: basnumber,
                        description: description,
                        departmentId: departmentId,
                        accountingMethod: accountingMethod,
                        basReturnTab1: {
                            datemethod: datemethod,
                            startDate: startDate,
                            endDate: endDate,
                            tab1G1: {
                                amount: gst1cost,
                                taxcodes: gst1taxcodes
                            },
                            tab1G2: {
                                amount: gst2cost,
                                taxcodes: gst2taxcodes
                            },
                            tab1G3: {
                                amount: gst3cost,
                                taxcodes: gst3taxcodes
                            },
                            tab1G4: {
                                amount: gst4cost,
                                taxcodes: gst4taxcodes
                            },
                            tab1G5: {
                                amount: gst5cost,
                            },
                            tab1G6: {
                                amount: gst6cost,
                            },
                            tab1G7: {
                                amount: gst7cost,
                                taxcodes: gst7taxcodes
                            },
                            tab1G8: {
                                amount: gst8cost,
                            },
                            tab1G9: {
                                amount: gst9cost,
                            },
                            tab1G10: {
                                amount: gst10cost,
                                taxcodes: gst10taxcodes
                            },
                            tab1G11: {
                                amount: gst11cost,
                                taxcodes: gst11taxcodes
                            },
                            tab1G12: {
                                amount: gst12cost,
                            },
                            tab1G13: {
                                amount: gst13cost,
                                taxcodes: gst13taxcodes
                            },
                            tab1G14: {
                                amount: gst14cost,
                                taxcodes: gst14taxcodes
                            },
                            tab1G15: {
                                amount: gst15cost,
                                taxcodes: gst15taxcodes
                            },
                            tab1G16: {
                                amount: gst16cost,
                            },
                            tab1G17: {
                                amount: gst17cost,
                            },
                            tab1G18: {
                                amount: gst18cost,
                                taxcodes: gst18taxcodes
                            },
                            tab1G19: {
                                amount: gst19cost,
                            },
                            tab1G20: {
                                amount: gst20cost,
                            },
                        },
                        basReturnTab2: {
                            datemethod: datemethodT2,
                            startDate: startDateT2,
                            endDate: endDateT2,
                            datemethod_2: datemethodT2_2,
                            startDate_2: startDateT2_2,
                            endDate_2: endDateT2_2,
                            tab2W1: {
                                amount: accounts1cost,
                                accounts: accounts1
                            },
                            tab2W2: {
                                amount: accounts2cost,
                                accounts: accounts2
                            },
                            tab2W3: {
                                amount: accounts3cost,
                                accounts: accounts3
                            },
                            tab2W4: {
                                amount: accounts4cost,
                                accounts: accounts4
                            },
                            tab2T1: {
                                amount: accounts5cost,
                                accounts: accounts5
                            },
                            tab2T2: {
                                amount: accounts6cost
                            },
                            tab2T3: {
                                amount: accounts7cost
                            },
                            tab2T4: {
                                reason: reasonT4
                            },
                            tab2F1: {
                                amount: accounts9cost
                            },
                            tab2F2: {
                                amount: accounts10cost
                            },
                            tab2F3: {
                                amount: accounts11cost
                            },
                            tab2F4: {
                                reason: reasonF4
                            },
                        },
                        basReturnTab3: {
                            datemethod: datemethodT3,
                            startDate: startDateT3,
                            endDate: endDateT3,
                            tab31C: {
                                amount: t3taxcodes1cost,
                                taxcodes: t3taxcodes1
                            },
                            tab31E: {
                                amount: t3taxcodes2cost,
                                taxcodes: t3taxcodes2
                            },
                            tab31D: {
                                amount: t3taxcodes3cost,
                                taxcodes: t3taxcodes3
                            },
                            tab31F: {
                                amount: t3taxcodes4cost,
                                taxcodes: t3taxcodes4
                            },
                            tab31G: {
                                amount: t3taxcodes5cost,
                                taxcodes: t3taxcodes5
                            },
                            tab37D: {
                                amount: t3accounts1cost,
                                accounts: t3accounts1
                            },
                        },
                        basReturnTab4: {
                            tab41A: {
                                amount: debits1cost
                            },
                            tab41C: {
                                amount: debits2cost
                            },
                            tab41E: {
                                amount: debits3cost
                            },
                            tab42A: {
                                amount: debits4cost
                            },
                            tab43: {
                                amount: debits5cost
                            },
                            tab44: {
                                amount: debits6cost
                            },
                            tab45A: {
                                amount: debits7cost
                            },
                            tab46A: {
                                amount: debits8cost
                            },
                            tab47: {
                                amount: debits9cost
                            },
                            tab48A: {
                                amount: debits10cost
                            },
                            tab49: {
                                amount: debits11cost
                            },
                            tab41B: {
                                amount: credits1cost
                            },
                            tab41D: {
                                amount: credits2cost
                            },
                            tab41F: {
                                amount: credits3cost
                            },
                            tab41G: {
                                amount: credits4cost
                            },
                            tab42B: {
                                amount: credits5cost
                            },
                            tab45B: {
                                amount: credits6cost
                            },
                            tab46B: {
                                amount: credits7cost
                            },
                            tab47D: {
                                amount: credits8cost
                            },
                            tab48B: {
                                amount: credits9cost
                            },
                        }
                    }

                    if (templateObject.getId.get()) {
                        dataArray.forEach((item, j) => {
                            if (item.basNumber == templateObject.getId.get()) {
                                dataArray[j] = jsonObj;
                                dataArray[j].basNumber = templateObject.getId.get();
                            }
                        });
                    } else {
                        dataArray.unshift(jsonObj);
                    }

                    addVS1Data('TBASReturn', JSON.stringify(dataArray)).then(function(datareturn) {
                        $('.fullScreenSpin').css('display', 'none');
                        FlowRouter.go('/basreturnlist');
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }, 500);
            }
        }, delayTimeAfterSound);
    },
    'click .chkcolAccountName': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colAccountName').css('display', 'table-cell');
            $('.colAccountName').css('padding', '.75rem');
            $('.colAccountName').css('vertical-align', 'top');
        } else {
            $('.colAccountName').css('display', 'none');
        }
    },
    'click .chkcolAccountNo': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colAccountNo').css('display', 'table-cell');
            $('.colAccountNo').css('padding', '.75rem');
            $('.colAccountNo').css('vertical-align', 'top');
        } else {
            $('.colAccountNo').css('display', 'none');
        }
    },
    'click .chkcolMemo': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colMemo').css('display', 'table-cell');
            $('.colMemo').css('padding', '.75rem');
            $('.colMemo').css('vertical-align', 'top');
        } else {
            $('.colMemo').css('display', 'none');
        }
    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);
    },
    'click .btnSaveGridSettings': function(event) {
        playSaveAudio();
        setTimeout(function() {
            let lineItems = [];

            $('.columnSettings').each(function(index) {
                var $tblrow = $(this);
                var colTitle = $tblrow.find(".divcolumn").text() || '';
                var colWidth = $tblrow.find(".custom-range").val() || 0;
                var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
                var colHidden = false;
                if ($tblrow.find(".custom-control-input").is(':checked')) {
                    colHidden = false;
                } else {
                    colHidden = true;
                }
                let lineItemObj = {
                    index: index,
                    label: colTitle,
                    hidden: colHidden,
                    width: colWidth,
                    thclass: colthClass
                }

                lineItems.push(lineItemObj);
            });

            var getcurrentCloudDetails = CloudUser.findOne({
                _id: Session.get('mycloudLogonID'),
                clouddatabaseID: Session.get('mycloudLogonDBID')
            });

            if (getcurrentCloudDetails) {
                if (getcurrentCloudDetails._id.length > 0) {
                    var clientID = getcurrentCloudDetails._id;
                    var clientUsername = getcurrentCloudDetails.cloudUsername;
                    var clientEmail = getcurrentCloudDetails.cloudEmail;
                    var checkPrefDetails = CloudPreference.findOne({
                        userid: clientID,
                        PrefName: 'tblJournalEntryLine'
                    });
                    if (checkPrefDetails) {
                        CloudPreference.update({
                            _id: checkPrefDetails._id
                        }, {
                            $set: {
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'purchaseform',
                                PrefName: 'tblJournalEntryLine',
                                published: true,
                                customFields: lineItems,
                                updatedAt: new Date()
                            }
                        }, function(err, idTag) {
                            if (err) {
                                $('#myModal2').modal('toggle');

                            } else {
                                $('#myModal2').modal('toggle');


                            }
                        });

                    } else {
                        CloudPreference.insert({
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'purchaseform',
                            PrefName: 'tblJournalEntryLine',
                            published: true,
                            customFields: lineItems,
                            createdAt: new Date()
                        }, function(err, idTag) {
                            if (err) {
                                $('#myModal2').modal('toggle');

                            } else {
                                $('#myModal2').modal('toggle');


                            }
                        });

                    }
                }
            }
            $('#myModal2').modal('toggle');
        }, delayTimeAfterSound);
    },
    'click .btnResetGridSettings': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'tblJournalEntryLine'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .btnResetSettings': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'journalentrycard'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .btnBack': function(event) {
        playCancelAudio();
        event.preventDefault();
        setTimeout(function() {
            history.back(1);
        }, delayTimeAfterSound);
    }

});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});