import { PurchaseBoardService } from '../js/purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { DashBoardService } from "../Dashboard/dashboard-service";
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
import { AccountService } from "../accounts/account-service";
import { ReportService } from "../reports/report-service";
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
    templateObject.accountsSummaryList = new ReactiveVar([]);
    templateObject.taxSummaryList = new ReactiveVar([]);
    templateObject.accountsList = new ReactiveVar([]);
    templateObject.availableCategories = new ReactiveVar([]);
    templateObject.pageTitle = new ReactiveVar();
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

    $(document).ready(function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        getVS1Data('TBasReturn').then(function(dataObject) {
            if (dataObject.length > 0) {
                console.log("dataObject", dataObject);
            }
        }).catch(function(err) {
            console.log("err", err);
            $('.fullScreenSpin').css('display', 'none');
        });
    });

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
        templateObject.getAccountLists();
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

    templateObject.getTaxSummaryReports = function(dateFrom, dateTo, ignoreDate) {
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

                    templateObject.taxSummaryList.set(mainReportRecords);
                });
            }

            $('.fullScreenSpin').css('display', 'none');

        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    };

    templateObject.getAccountsSummaryReports = function(dateFrom, dateTo) {
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

                templateObject.accountsSummaryList.set(accountsReportRecords);
            }

            $('.fullScreenSpin').css('display', 'none');

        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    };

    templateObject.getTaxrateList = function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        getVS1Data("TTaxcodeVS1").then(function(dataObject) {
                if (dataObject.length === 0) {
                    productService.getTaxCodesVS1().then(function(data) {
                        for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                            let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                            var dataList = {
                                Id: data.ttaxcodevs1[i].Id || '',
                                CodeName: data.ttaxcodevs1[i].CodeName || '',
                                Description: data.ttaxcodevs1[i].Description || '-',
                                TaxRate: taxRate || 0,
                            };
                            taxRateList.push(dataList);
                            templateObject.taxRateList.set(taxRateList);
                        }
                        $('.fullScreenSpin').css('display', 'none');
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.ttaxcodevs1;
                    for (let i = 0; i < useData.length; i++) {
                        let taxRate = (useData[i].Rate * 100).toFixed(2);
                        var dataList = {
                            Id: useData[i].Id || '',
                            CodeName: useData[i].CodeName || '',
                            Description: useData[i].Description || '-',
                            TaxRate: taxRate || 0,
                        };

                        taxRateList.push(dataList);
                        templateObject.taxRateList.set(taxRateList);
                    }
                }
            })
            .catch(function(err) {
                productService.getTaxCodesVS1().then(function(data) {
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                        var dataList = {
                            Id: data.ttaxcodevs1[i].Id || '',
                            CodeName: data.ttaxcodevs1[i].CodeName || '',
                            Description: data.ttaxcodevs1[i].Description || '-',
                            TaxRate: taxRate || 0,
                        };

                        taxRateList.push(dataList);
                        templateObject.taxRateList.set(taxRateList);
                    }
                });
            });
    }

    setTimeout(function() {
        templateObject.getTaxrateList();
    }, 500);

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

            $("#tblAccountOverview")
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
                        $("#tblAccountOverview").DataTable().ajax.reload();
                    },
                    fnDrawCallback: function(oSettings) {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    },
                    fnInitComplete: function() {
                        $(
                            "<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                        ).insertAfter("#tblAccountOverview_filter");
                    },
                })
                .on("page", function() {
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                    let draftRecord = templateObject.accountsList.get();
                    templateObject.accountsList.set(draftRecord);
                })
                .on("column-reorder", function() {})
                .on("length.dt", function(e, settings, len) {
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                });
            // $('.fullScreenSpin').css('display','none');
        }, 10);

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
        let taxSummaryList = templateObject.taxSummaryList.get();

        console.log("taxSummaryList", taxSummaryList);

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

        $("#gst" + pan + "cost").val(total_tax);
    };

    templateObject.selAccountant = function(pan) {
        let accountsList = templateObject.accountsList.get();
        let accountsSummaryList = templateObject.accountsSummaryList.get();

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

        $("#accounts" + pan + "cost").val(total_amounts);
    };

    templateObject.sel3TaxList = function(pan) {
        let taxRateList = templateObject.taxRateList.get();
        let taxSummaryList = templateObject.taxSummaryList.get();

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

        $("#t3taxcodes" + pan + "cost").val(total_tax);
    };

    templateObject.sel3Accountant = function(pan) {
        let accountsList = templateObject.accountsList.get();
        let accountsSummaryList = templateObject.accountsSummaryList.get();

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

        $("#t3accounts" + pan + "cost").val(total_amounts);
    };

    var url = FlowRouter.current().path;
    if (url.indexOf('?id=') > 0) {
        var getid = url.split('?id=');

        if (getid[1]) {
            templateObject.pageTitle.set("Edit BAS Return");
        }
    } else {
        templateObject.pageTitle.set("New BAS Return");
    }

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

    $(document).on("click", "#departmentList tbody tr", function(e) {
        $('#sltDepartment').val($(this).find(".colDeptName").text());
        $('#departmentModal').modal('toggle');
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
    "click #allDepart": (e) => {
        if ($("#allDepart").prop('checked') == true) {
            $("#sltDepartment").attr("disabled", "disabled");
        } else {
            $("#sltDepartment").removeAttr("disabled");
        }
    },
    "click #datemethod1": (e) => {
        $("#beginquarterlydate").css("display", "block");
        $("#beginmonthlydate").css("display", "none");
    },
    "click #datemethod2": (e) => {
        $("#beginquarterlydate").css("display", "none");
        $("#beginmonthlydate").css("display", "block");
    },
    "click #datemethod1-t2": (e) => {
        $("#beginquarterlydate-t2").css("display", "block");
        $("#beginmonthlydate-t2").css("display", "none");
    },
    "click #datemethod2-t2": (e) => {
        $("#beginquarterlydate-t2").css("display", "none");
        $("#beginmonthlydate-t2").css("display", "block");
    },
    "click #datemethod1-t2-2": (e) => {
        $("#beginquarterlydate-t2-2").css("display", "block");
        $("#beginmonthlydate-t2-2").css("display", "none");
    },
    "click #datemethod2-t2-2": (e) => {
        $("#beginquarterlydate-t2-2").css("display", "none");
        $("#beginmonthlydate-t2-2").css("display", "block");
    },
    "click #datemethod1-t3": (e) => {
        $("#beginquarterlydate-t3").css("display", "block");
        $("#beginmonthlydate-t3").css("display", "none");
    },
    "click #datemethod2-t3": (e) => {
        $("#beginquarterlydate-t3").css("display", "none");
        $("#beginmonthlydate-t3").css("display", "block");
    },
    'change #beginquarterlydate, change #beginmonthlydate, change #currentyear': function(event) {
        let templateObject = Template.instance();
        let fromDate = "0000-00-00";
        let toDate = new Date();
        toDate = moment(toDate).format("YYYY-MM-DD");

        if ($("#datemethod1").prop('checked') == true) {
            if ($("#beginquarterlydate").val() != "" && $("#currentyear").val() != "") {
                $('.fullScreenSpin').css('display', 'inline-block');
                fromDate = new Date($("#currentyear").val() + "-" + $("#beginquarterlydate").val());
                fromDate = moment(fromDate).format("YYYY-MM-DD");
                Template.instance().getTaxSummaryReports(fromDate, toDate, false);

                setTimeout(() => {
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

                    var gst5cost = parseFloat($("#gst3cost").val()) + parseFloat($("#gst3cost").val());
                    $("#gst5cost").val(gst5cost);
                    var gst6cost = parseFloat($("#gst1cost").val()) + parseFloat($("#gst2cost").val()) + gst5cost;
                    $("#gst6cost").val(gst6cost);
                    var gst8cost = parseFloat($("#gst7cost").val()) + gst6cost;
                    $("#gst8cost").val(gst8cost);
                    var gst9cost = gst8cost / 11;
                    $("#gst9cost").val(gst9cost.toFixed(2));
                    var gst12cost = parseFloat($("#gst10cost").val()) + parseFloat($("#gst11cost").val());
                    $("#gst12cost").val(gst12cost);
                    var gst16cost = parseFloat($("#gst13cost").val()) + parseFloat($("#gst14cost").val()) + parseFloat($("#gst15cost").val());
                    $("#gst16cost").val(gst16cost);
                    var gst17cost = gst12cost + gst16cost;
                    $("#gst17cost").val(gst17cost);
                    var gst19cost = parseFloat($("#gst18cost").val()) + gst17cost;
                    $("#gst19cost").val(gst19cost);
                    var gst20cost = gst19cost / 11;
                    $("#gst20cost").val(gst20cost.toFixed(2));
                }, 3000);
            }
        } else {
            if ($("#beginmonthlydate").val() != "" && $("#currentyear").val() != "") {
                $('.fullScreenSpin').css('display', 'inline-block');
                fromDate = new Date($("#currentyear").val() + "-" + $("#beginmonthlydate").val());
                fromDate = moment(fromDate).format("YYYY-MM-DD");
                Template.instance().getTaxSummaryReports(fromDate, toDate, false);

                setTimeout(() => {
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

                    var gst5cost = parseFloat($("#gst3cost").val()) + parseFloat($("#gst3cost").val());
                    $("#gst5cost").val(gst5cost);
                    var gst6cost = parseFloat($("#gst1cost").val()) + parseFloat($("#gst2cost").val()) + gst5cost;
                    $("#gst6cost").val(gst6cost);
                    var gst8cost = parseFloat($("#gst7cost").val()) + gst6cost;
                    $("#gst8cost").val(gst8cost);
                    var gst9cost = gst8cost / 11;
                    $("#gst9cost").val(gst9cost.toFixed(2));
                    var gst12cost = parseFloat($("#gst10cost").val()) + parseFloat($("#gst11cost").val());
                    $("#gst12cost").val(gst12cost);
                    var gst16cost = parseFloat($("#gst13cost").val()) + parseFloat($("#gst14cost").val()) + parseFloat($("#gst15cost").val());
                    $("#gst16cost").val(gst16cost);
                    var gst17cost = gst12cost + gst16cost;
                    $("#gst17cost").val(gst17cost);
                    var gst19cost = parseFloat($("#gst18cost").val()) + gst17cost;
                    $("#gst19cost").val(gst19cost);
                    var gst20cost = gst19cost / 11;
                    $("#gst20cost").val(gst20cost.toFixed(2));
                }, 3000);
            }
        }
    },
    'change #beginquarterlydate-t2, change #beginmonthlydate-t2, change #currentyear-t2': function(event) {
        let templateObject = Template.instance();
        let fromDate = "0000-00-00";
        let toDate = new Date();
        toDate = moment(toDate).format("YYYY-MM-DD");

        if ($("#datemethod1-t2").prop('checked') == true) {
            if ($("#beginquarterlydate-t2").val() != "" && $("#currentyear-t2").val() != "") {
                $('.fullScreenSpin').css('display', 'inline-block');
                fromDate = new Date($("#currentyear-t2").val() + "-" + $("#beginquarterlydate-t2").val());
                fromDate = moment(fromDate).format("YYYY-MM-DD");
                Template.instance().getAccountsSummaryReports(fromDate, toDate);

                setTimeout(() => {
                    templateObject.selAccountant(1);
                    templateObject.selAccountant(2);
                    templateObject.selAccountant(3);
                    templateObject.selAccountant(4);
                    templateObject.selAccountant(5);
                }, 2000);
            }
        } else {
            if ($("#beginmonthlydate-t2").val() != "" && $("#currentyear-t2").val() != "") {
                $('.fullScreenSpin').css('display', 'inline-block');
                fromDate = new Date($("#currentyear-t2").val() + "-" + $("#beginmonthlydate-t2").val());
                fromDate = moment(fromDate).format("YYYY-MM-DD");
                Template.instance().getAccountsSummaryReports(fromDate, toDate);

                setTimeout(() => {
                    templateObject.selAccountant(1);
                    templateObject.selAccountant(2);
                    templateObject.selAccountant(3);
                    templateObject.selAccountant(4);
                    templateObject.selAccountant(5);
                }, 2000);
            }
        }
    },
    'change #beginquarterlydate-t3, change #beginmonthlydate-t3, change #currentyear-t3': function(event) {
        let templateObject = Template.instance();
        let fromDate = "0000-00-00";
        let toDate = new Date();
        toDate = moment(toDate).format("YYYY-MM-DD");

        if ($("#datemethod1-t3").prop('checked') == true) {
            if ($("#beginquarterlydate-t3").val() != "" && $("#currentyear-t3").val() != "") {
                $('.fullScreenSpin').css('display', 'inline-block');
                fromDate = new Date($("#currentyear-t3").val() + "-" + $("#beginquarterlydate-t3").val());
                fromDate = moment(fromDate).format("YYYY-MM-DD");
                Template.instance().getTaxSummaryReports(fromDate, toDate, false);
                Template.instance().getAccountsSummaryReports(fromDate, toDate);

                setTimeout(() => {
                    templateObject.sel3TaxList(1);
                    templateObject.sel3TaxList(2);
                    templateObject.sel3TaxList(3);
                    templateObject.sel3TaxList(4);
                    templateObject.sel3TaxList(5);
                    templateObject.sel3Accountant(1);
                }, 3000);
            }
        } else {
            if ($("#beginmonthlydate-t3").val() != "" && $("#currentyear-t3").val() != "") {
                $('.fullScreenSpin').css('display', 'inline-block');
                fromDate = new Date($("#currentyear-t3").val() + "-" + $("#beginmonthlydate-t3").val());
                fromDate = moment(fromDate).format("YYYY-MM-DD");
                Template.instance().getTaxSummaryReports(fromDate, toDate, false);
                Template.instance().getAccountsSummaryReports(fromDate, toDate);

                setTimeout(() => {
                    templateObject.sel3TaxList(1);
                    templateObject.sel3TaxList(2);
                    templateObject.sel3TaxList(3);
                    templateObject.sel3TaxList(4);
                    templateObject.sel3TaxList(5);
                    templateObject.sel3Accountant(1);
                }, 3000);
            }
        }
    },
    'click .btnselTaxList': function(event) {
        const templateObject = Template.instance();

        let gstPanID = $(event.target).attr('id').split("-")[1];
        Template.instance().selTaxList(gstPanID);

        var gst5cost = parseFloat($("#gst3cost").val()) + parseFloat($("#gst3cost").val());
        $("#gst5cost").val(gst5cost);
        var gst6cost = parseFloat($("#gst1cost").val()) + parseFloat($("#gst2cost").val()) + gst5cost;
        $("#gst6cost").val(gst6cost);
        var gst8cost = parseFloat($("#gst7cost").val()) + gst6cost;
        $("#gst8cost").val(gst8cost);
        var gst9cost = gst8cost / 11;
        $("#gst9cost").val(gst9cost.toFixed(2));
        var gst12cost = parseFloat($("#gst10cost").val()) + parseFloat($("#gst11cost").val());
        $("#gst12cost").val(gst12cost);
        var gst16cost = parseFloat($("#gst13cost").val()) + parseFloat($("#gst14cost").val()) + parseFloat($("#gst15cost").val());
        $("#gst16cost").val(gst16cost);
        var gst17cost = gst12cost + gst16cost;
        $("#gst17cost").val(gst17cost);
        var gst19cost = parseFloat($("#gst18cost").val()) + gst17cost;
        $("#gst19cost").val(gst19cost);
        var gst20cost = gst19cost / 11;
        $("#gst20cost").val(gst20cost.toFixed(2));

        $("#gst" + gstPanID + "option").modal("toggle");
    },
    'click .btnselAccountant': function(event) {
        const templateObject = Template.instance();

        let accountsPanID = $(event.target).attr('id').split("-")[1];
        templateObject.selAccountant(accountsPanID);

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





    "click #tblCurrencyPopList tbody tr": (e) => {
        const rateType = $(".currency-js").attr("type"); // String "buy" | "sell"

        const currencyCode = $(e.currentTarget).find(".colCode").text();
        const currencyRate =
            rateType == "buy" ?
            $(e.currentTarget).find(".colBuyRate").text() :
            $(e.currentTarget).find(".colSellRate").text();

        $("#sltCurrency").val(currencyCode);
        $("#sltCurrency").trigger("change");
        $("#exchange_rate").val(currencyRate);
        $("#exchange_rate").trigger("change");
        $("#currencyModal").modal("toggle");

        $("#tblCurrencyPopList_filter .form-control-sm").val("");

        setTimeout(function() {
            $(".btnRefreshCurrency").trigger("click");
            $(".fullScreenSpin").css("display", "none");
        }, 1000);
    },
    'click #sltCurrency': function(event) {
        $('#currencyModal').modal('toggle');
    },
    'click #edtSupplierName': function(event) {
        $('#edtSupplierName').select();
        $('#edtSupplierName').editableSelect();
    },
    'click .th.colCreditExCheck': function(event) {
        $('.colCreditExCheck').addClass('hiddenColumn');
        $('.colCreditExCheck').removeClass('showColumn');

        $('.colCreditIncCheck').addClass('showColumn');
        $('.colCreditIncCheck').removeClass('hiddenColumn');
    },
    'click .th.colCreditIncCheck': function(event) {
        $('.colCreditIncCheck').addClass('hiddenColumn');
        $('.colCreditIncCheck').removeClass('showColumn');

        $('.colCreditExCheck').addClass('showColumn');
        $('.colCreditExCheck').removeClass('hiddenColumn');
    },
    'click .th.colDebitExCheck': function(event) {
        $('.colDebitExCheck').addClass('hiddenColumn');
        $('.colDebitExCheck').removeClass('showColumn');

        $('.colDebitIncCheck').addClass('showColumn');
        $('.colDebitIncCheck').removeClass('hiddenColumn');
    },
    'click .th.colDebitIncCheck': function(event) {
        $('.colDebitIncCheck').addClass('hiddenColumn');
        $('.colDebitIncCheck').removeClass('showColumn');

        $('.colDebitExCheck').addClass('showColumn');
        $('.colDebitExCheck').removeClass('hiddenColumn');
    },
    'blur .lineCreditExChange': function(event) {

        if (!isNaN($(event.target).val())) {
            let inputCreditEx = parseFloat($(event.target).val());
            $(event.target).val(Currency + '' + inputCreditEx.toLocaleString(undefined, { minimumFractionDigits: 2 }));
        } else {
            let inputCreditEx = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));

            $(event.target).val(Currency + '' + inputCreditEx.toLocaleString(undefined, { minimumFractionDigits: 2 }) || Currency + '0');
        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        let inputCredit = parseFloat($(event.target).val()) || 0;
        if (!isNaN($(event.target).val())) {
            $(event.target).val(Currency + '' + inputCredit.toLocaleString(undefined, { minimumFractionDigits: 2 }) || Currency + '0');
        } else {
            let inputCredit = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));

            $(event.target).val(Currency + '' + inputCredit.toLocaleString(undefined, { minimumFractionDigits: 2 }) || Currency + '0');
        }

        let $tblrows = $("#tblJournalEntryLine tbody tr");


        var targetID = $(event.target).closest('tr').attr('id');
        if ($(event.target).val().replace(/[^0-9.-]+/g, "") != 0) {
            $('#' + targetID + " .lineDebitEx").val(Currency + '0.00');
            $('#' + targetID + " .lineDebitInc").val(Currency + '0.00');
        }
        let nextRowID = $(event.target).closest('tr').next('tr').attr("id");
        let inputCreditData = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
        $('#' + nextRowID + " .lineDebitExChange").val(utilityService.modifynegativeCurrencyFormat(inputCreditData)).trigger('change');
        let lineAmount = 0;
        let subGrandCreditTotal = 0;
        let subGrandDebitTotal = 0;

        let subGrandCreditTotalInc = 0;
        let subGrandDebitTotalInc = 0;
        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var taxcode = $tblrow.find(".lineTaxCode").val() || 0;
            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }



            var credit = $tblrow.find(".lineCreditEx").val() || Currency + '0';
            var debit = $tblrow.find(".lineDebitEx").val() || Currency + '0';
            var subTotalCredit = Number(credit.replace(/[^0-9.-]+/g, "")) || 0;
            var subTotalDebit = Number(debit.replace(/[^0-9.-]+/g, "")) || 0;

            var taxTotalCredit = parseFloat(credit.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) || 0;
            var taxTotalDebit = parseFloat(debit.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) || 0;
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalCredit));
            if (!isNaN(subTotalCredit)) {
                let totalCreditInc = (parseFloat(subTotalCredit)) + (parseFloat(taxTotalCredit)) || 0;
                $tblrow.find('.lineCreditIncChange').val(utilityService.modifynegativeCurrencyFormat(totalCreditInc.toFixed(2)));
                subGrandCreditTotal += isNaN(subTotalCredit) ? 0 : subTotalCredit;
                subGrandCreditTotalInc += isNaN(totalCreditInc) ? 0 : totalCreditInc;
            };
            if (!isNaN(subTotalDebit)) {
                let totalDebitInc = (parseFloat(subTotalDebit)) + (parseFloat(taxTotalDebit)) || 0;
                $tblrow.find('.lineDebitIncChange').val(utilityService.modifynegativeCurrencyFormat(totalDebitInc.toFixed(2)));
                subGrandDebitTotal += isNaN(subTotalDebit) ? 0 : subTotalDebit;
                subGrandDebitTotalInc += isNaN(totalDebitInc) ? 0 : totalDebitInc;
            };

        });
        templateObject.totalCredit.set(utilityService.modifynegativeCurrencyFormat(subGrandCreditTotal));
        templateObject.totalDebit.set(utilityService.modifynegativeCurrencyFormat(subGrandDebitTotal));

        templateObject.totalCreditInc.set(utilityService.modifynegativeCurrencyFormat(subGrandCreditTotalInc));
        templateObject.totalDebitInc.set(utilityService.modifynegativeCurrencyFormat(subGrandDebitTotalInc));

    },
    'blur .lineDebitExChange': function(event) {

        if (!isNaN($(event.target).val())) {
            let inputDebitEx = parseFloat($(event.target).val());
            $(event.target).val(Currency + '' + inputDebitEx.toLocaleString(undefined, { minimumFractionDigits: 2 }));
        } else {
            let inputDebitEx = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));

            $(event.target).val(Currency + '' + inputDebitEx.toLocaleString(undefined, { minimumFractionDigits: 2 }) || Currency + '0');
        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        let inputCredit = parseFloat($('.lineDebitEx').val()) || 0;
        if (!isNaN($('.lineDebitEx').val())) {
            $(event.target).val(Currency + '' + inputCredit.toLocaleString(undefined, { minimumFractionDigits: 2 }) || Currency + '0');
        } else {
            let inputCredit = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));

            $(event.target).val(Currency + '' + inputCredit.toLocaleString(undefined, { minimumFractionDigits: 2 }) || Currency + '0');
        }

        let $tblrows = $("#tblJournalEntryLine tbody tr");
        var targetID = $(event.target).closest('tr').attr('id');
        if ($(event.target).val().replace(/[^0-9.-]+/g, "") != 0) {
            $('#' + targetID + " .lineCreditEx").val(Currency + '0.00');
            $('#' + targetID + " .lineCreditInc").val(Currency + '0.00');
        }


        let nextRowID = $(event.target).closest('tr').next('tr').attr("id");
        let inputDebitData = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
        $('#' + nextRowID + " .lineCreditExChange").val(utilityService.modifynegativeCurrencyFormat(inputDebitData)).trigger('change');

        let lineAmount = 0;
        let subGrandCreditTotal = 0;
        let subGrandDebitTotal = 0;
        let subGrandCreditTotalInc = 0;
        let subGrandDebitTotalInc = 0;
        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var taxcode = $tblrow.find(".lineTaxCode").val() || 0;
            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }
            var credit = $tblrow.find(".lineCreditEx").val() || Currency + '0';
            var debit = $tblrow.find(".lineDebitEx").val() || Currency + '0';
            var subTotalCredit = Number(credit.replace(/[^0-9.-]+/g, "")) || 0;
            var subTotalDebit = Number(debit.replace(/[^0-9.-]+/g, "")) || 0;

            var taxTotalCredit = parseFloat(credit.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) || 0;
            var taxTotalDebit = parseFloat(debit.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) || 0;
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalDebit));

            if (!isNaN(subTotalCredit)) {
                let totalCreditInc = (parseFloat(subTotalCredit)) + (parseFloat(taxTotalCredit)) || 0;
                $tblrow.find('.lineCreditIncChange').val(utilityService.modifynegativeCurrencyFormat(totalCreditInc.toFixed(2)));
                subGrandCreditTotal += isNaN(subTotalCredit) ? 0 : subTotalCredit;
                subGrandCreditTotalInc += isNaN(totalCreditInc) ? 0 : totalCreditInc;
            }
            if (!isNaN(subTotalDebit)) {
                let totalDebitInc = (parseFloat(subTotalDebit)) + (parseFloat(taxTotalDebit)) || 0;
                $tblrow.find('.lineDebitIncChange').val(utilityService.modifynegativeCurrencyFormat(totalDebitInc.toFixed(2)));
                subGrandDebitTotal += isNaN(subTotalDebit) ? 0 : subTotalDebit;
                subGrandDebitTotalInc += isNaN(totalDebitInc) ? 0 : totalDebitInc;
            }

        });
        templateObject.totalCredit.set(utilityService.modifynegativeCurrencyFormat(subGrandCreditTotal));
        templateObject.totalDebit.set(utilityService.modifynegativeCurrencyFormat(subGrandDebitTotal));

        templateObject.totalCreditInc.set(utilityService.modifynegativeCurrencyFormat(subGrandCreditTotalInc));
        templateObject.totalDebitInc.set(utilityService.modifynegativeCurrencyFormat(subGrandDebitTotalInc));

    },
    'blur .lineCreditIncChange': function(event) {

        if (!isNaN($(event.target).val())) {
            let inputCreditEx = parseFloat($(event.target).val());
            $(event.target).val(Currency + '' + inputCreditEx.toLocaleString(undefined, {
                minimumFractionDigits: 2
            }));
        } else {
            let inputCreditEx = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));

            $(event.target).val(Currency + '' + inputCreditEx.toLocaleString(undefined, {
                minimumFractionDigits: 2
            }) || Currency + '0');
        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        let inputCredit = parseFloat($(event.target).val()) || 0;
        if (!isNaN($(event.target).val())) {
            $(event.target).val(Currency + '' + inputCredit.toLocaleString(undefined, {
                minimumFractionDigits: 2
            }) || Currency + '0');
        } else {
            let inputCredit = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));

            $(event.target).val(Currency + '' + inputCredit.toLocaleString(undefined, {
                minimumFractionDigits: 2
            }) || Currency + '0');
        }

        let $tblrows = $("#tblJournalEntryLine tbody tr");
        var targetID = $(event.target).closest('tr').attr('id');
        if ($(event.target).val().replace(/[^0-9.-]+/g, "") != 0) {
            $('#' + targetID + " .lineDebitEx").val(Currency + '0.00');
            $('#' + targetID + " .lineDebitInc").val(Currency + '0.00');
        }

        let nextRowID = $(event.target).closest('tr').next('tr').attr("id");
        let inputCreditData = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
        $('#' + nextRowID + " .lineDebitIncChange").val(utilityService.modifynegativeCurrencyFormat(inputCreditData)).trigger('change');

        let lineAmount = 0;
        let subGrandCreditTotal = 0;
        let subGrandDebitTotal = 0;

        let subGrandCreditTotalInc = 0;
        let subGrandDebitTotalInc = 0;
        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var taxcode = $tblrow.find(".lineTaxCode").val() || 0;
            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate;
                    }
                }
            }



            var credit = $tblrow.find(".lineCreditInc").val() || Currency + '0';
            var debit = $tblrow.find(".lineDebitInc").val() || Currency + '0';
            let taxRateAmountCalc = (parseFloat(taxrateamount) + 100) / 100;
            var subTotalCredit = (Number(credit.replace(/[^0-9.-]+/g, "")) / (taxRateAmountCalc)) || Currency + '0';
            var subTotalDebit = (Number(debit.replace(/[^0-9.-]+/g, "")) / (taxRateAmountCalc)) || Currency + '0';
            var taxTotalCredit = parseFloat(credit.replace(/[^0-9.-]+/g, "")) - parseFloat(subTotalCredit) || 0;
            var taxTotalDebit = parseFloat(debit.replace(/[^0-9.-]+/g, "")) - parseFloat(subTotalDebit) || 0;
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalCredit));
            if (!isNaN(subTotalCredit)) {
                $tblrow.find('.lineCreditExChange').val(utilityService.modifynegativeCurrencyFormat(subTotalCredit.toFixed(2)));
                let totalCreditInc = (parseFloat(subTotalCredit)) + (parseFloat(taxTotalCredit)) || 0;
                $tblrow.find('.lineCreditIncChange').val(utilityService.modifynegativeCurrencyFormat(totalCreditInc.toFixed(2)));
                subGrandCreditTotal += isNaN(subTotalCredit) ? 0 : subTotalCredit;
                subGrandCreditTotalInc += isNaN(totalCreditInc) ? 0 : totalCreditInc;
            };
            if (!isNaN(subTotalDebit)) {
                $tblrow.find('.lineDebitExChange').val(utilityService.modifynegativeCurrencyFormat(subTotalDebit.toFixed(2)));
                let totalDebitInc = (parseFloat(subTotalDebit)) + (parseFloat(taxTotalDebit)) || 0;
                $tblrow.find('.lineDebitIncChange').val(utilityService.modifynegativeCurrencyFormat(totalDebitInc.toFixed(2)));
                subGrandDebitTotal += isNaN(subTotalDebit) ? 0 : subTotalDebit;
                subGrandDebitTotalInc += isNaN(totalDebitInc) ? 0 : totalDebitInc;
            };

        });
        templateObject.totalCredit.set(utilityService.modifynegativeCurrencyFormat(subGrandCreditTotal));
        templateObject.totalDebit.set(utilityService.modifynegativeCurrencyFormat(subGrandDebitTotal));

        templateObject.totalCreditInc.set(utilityService.modifynegativeCurrencyFormat(subGrandCreditTotalInc));
        templateObject.totalDebitInc.set(utilityService.modifynegativeCurrencyFormat(subGrandDebitTotalInc));

    },
    'blur .lineDebitIncChange': function(event) {

        if (!isNaN($(event.target).val())) {
            let inputDebitEx = parseFloat($(event.target).val());
            $(event.target).val(Currency + '' + inputDebitEx.toLocaleString(undefined, { minimumFractionDigits: 2 }));
        } else {
            let inputDebitEx = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));

            $(event.target).val(Currency + '' + inputDebitEx.toLocaleString(undefined, { minimumFractionDigits: 2 }) || Currency + '0');
        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        let inputCredit = parseFloat($(event.target).val()) || 0;
        if (!isNaN($(event.target).val())) {
            $(event.target).val(Currency + '' + inputCredit.toLocaleString(undefined, { minimumFractionDigits: 2 }) || Currency + '0');
        } else {
            let inputCredit = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));

            $(event.target).val(Currency + '' + inputCredit.toLocaleString(undefined, { minimumFractionDigits: 2 }) || Currency + '0');
        }

        let $tblrows = $("#tblJournalEntryLine tbody tr");
        var targetID = $(event.target).closest('tr').attr('id');
        if ($(event.target).val().replace(/[^0-9.-]+/g, "") != 0) {
            $('#' + targetID + " .lineCreditEx").val(Currency + '0.00');
            $('#' + targetID + " .lineCreditInc").val(Currency + '0.00');
        }

        let nextRowID = $(event.target).closest('tr').next('tr').attr("id");
        let inputDebitData = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
        $('#' + nextRowID + " .lineCreditExChange").val(utilityService.modifynegativeCurrencyFormat(inputDebitData)).trigger('change');


        let lineAmount = 0;
        let subGrandCreditTotal = 0;
        let subGrandDebitTotal = 0;
        let subGrandCreditTotalInc = 0;
        let subGrandDebitTotalInc = 0;
        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var taxcode = $tblrow.find(".lineTaxCode").val() || 0;
            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate;
                    }
                }
            }
            var credit = $tblrow.find(".lineCreditInc").val() || Currency + '0';
            var debit = $tblrow.find(".lineDebitInc").val() || Currency + '0';

            let taxRateAmountCalc = (parseFloat(taxrateamount) + 100) / 100;

            var subTotalCredit = (Number(credit.replace(/[^0-9.-]+/g, "")) / (taxRateAmountCalc)) || Currency + '0';
            var subTotalDebit = (Number(debit.replace(/[^0-9.-]+/g, "")) / (taxRateAmountCalc)) || Currency + '0';

            var taxTotalCredit = parseFloat(credit.replace(/[^0-9.-]+/g, "")) - parseFloat(subTotalCredit) || 0;
            var taxTotalDebit = parseFloat(debit.replace(/[^0-9.-]+/g, "")) - parseFloat(subTotalDebit) || 0;
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalDebit));

            if (!isNaN(subTotalCredit)) {
                $tblrow.find('.lineCreditExChange').val(utilityService.modifynegativeCurrencyFormat(subTotalCredit.toFixed(2)));
                let totalCreditInc = (parseFloat(subTotalCredit)) + (parseFloat(taxTotalCredit)) || 0;
                $tblrow.find('.lineCreditIncChange').val(utilityService.modifynegativeCurrencyFormat(totalCreditInc.toFixed(2)));
                subGrandCreditTotal += isNaN(subTotalCredit) ? 0 : subTotalCredit;
                subGrandCreditTotalInc += isNaN(totalCreditInc) ? 0 : totalCreditInc;
            }
            if (!isNaN(subTotalDebit)) {
                $tblrow.find('.lineDebitExChange').val(utilityService.modifynegativeCurrencyFormat(subTotalDebit.toFixed(2)));
                let totalDebitInc = (parseFloat(subTotalDebit)) + (parseFloat(taxTotalDebit)) || 0;
                $tblrow.find('.lineDebitIncChange').val(utilityService.modifynegativeCurrencyFormat(totalDebitInc.toFixed(2)));
                subGrandDebitTotal += isNaN(subTotalDebit) ? 0 : subTotalDebit;
                subGrandDebitTotalInc += isNaN(totalDebitInc) ? 0 : totalDebitInc;
            }

        });
        templateObject.totalCredit.set(utilityService.modifynegativeCurrencyFormat(subGrandCreditTotal));
        templateObject.totalDebit.set(utilityService.modifynegativeCurrencyFormat(subGrandDebitTotal));

        templateObject.totalCreditInc.set(utilityService.modifynegativeCurrencyFormat(subGrandCreditTotalInc));
        templateObject.totalDebitInc.set(utilityService.modifynegativeCurrencyFormat(subGrandDebitTotalInc));

    },
    'click #btnCustomFileds': function(event) {
        var x = document.getElementById("divCustomFields");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    'click .lineAccountName, keydown .lineAccountName': function(event) {
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();
        $('#edtAccountID').val('');
        $('#add-account-title').text('Add New Account');
        // let suppliername = $('#edtSupplierName').val();
        let accountService = new AccountService();
        const accountTypeList = [];

        var accountDataName = $(event.target).val() || '';
        if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
            $('#accountListModal').modal('toggle');
            var targetID = $(event.target).closest('tr').attr('id');
            $('#selectLineID').val(targetID);
            setTimeout(function() {
                $('#tblAccount_filter .form-control-sm').focus();
                $('#tblAccount_filter .form-control-sm').val('');
                $('#tblAccount_filter .form-control-sm').trigger("input");

                var datatable = $('#tblInventory').DataTable();
                datatable.draw();
                $('#tblAccount_filter .form-control-sm').trigger("input");

            }, 500);
        } else {
            if (accountDataName.replace(/\s/g, '') != '') {
                getVS1Data('TAccountVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        accountService.getOneAccountByName(accountDataName).then(function(data) {
                            let lineItems = [];
                            let lineItemObj = {};
                            let fullAccountTypeName = '';
                            let accBalance = '';
                            $('#add-account-title').text('Edit Account Details');
                            $('#edtAccountName').attr('readonly', true);
                            $('#sltAccountType').attr('readonly', true);
                            $('#sltAccountType').attr('disabled', 'disabled');
                            if (accountTypeList) {
                                for (var h = 0; h < accountTypeList.length; h++) {

                                    if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                        fullAccountTypeName = accountTypeList[h].description || '';

                                    }
                                }

                            }

                            var accountid = data.taccountvs1[0].fields.ID || '';
                            var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                            var accountname = data.taccountvs1[0].fields.AccountName || '';
                            var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                            var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                            var accountdesc = data.taccountvs1[0].fields.Description || '';
                            var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                            var bankbsb = data.taccountvs1[0].fields.BSB || '';
                            var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                            var swiftCode = data.taccountvs1[0].fields.Extra || '';
                            var routingNo = data.taccountvs1[0].fields.BankCode || '';

                            var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                            var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                            var cardcvc = data.taccountvs1[0].fields.CVC || '';
                            var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                            if ((accounttype === "BANK")) {
                                $('.isBankAccount').removeClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            } else if ((accounttype === "CCARD")) {
                                $('.isCreditAccount').removeClass('isNotCreditAccount');
                                $('.isBankAccount').addClass('isNotBankAccount');
                            } else {
                                $('.isBankAccount').addClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            }

                            $('#edtAccountID').val(accountid);
                            $('#sltAccountType').val(accounttype);
                            $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                            $('#edtAccountName').val(accountname);
                            $('#edtAccountNo').val(accountno);
                            $('#sltTaxCode').val(taxcode);
                            $('#txaAccountDescription').val(accountdesc);
                            $('#edtBankAccountName').val(bankaccountname);
                            $('#edtBSB').val(bankbsb);
                            $('#edtBankAccountNo').val(bankacountno);
                            $('#swiftCode').val(swiftCode);
                            $('#routingNo').val(routingNo);
                            $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                            $('#edtCardNumber').val(cardnumber);
                            $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                            $('#edtCvc').val(cardcvc);

                            if (showTrans == 'true') {
                                $('.showOnTransactions').prop('checked', true);
                            } else {
                                $('.showOnTransactions').prop('checked', false);
                            }

                            setTimeout(function() {
                                $('#addNewAccount').modal('show');
                            }, 500);

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.taccountvs1;
                        var added = false;
                        let lineItems = [];
                        let lineItemObj = {};
                        let fullAccountTypeName = '';
                        let accBalance = '';
                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');
                        for (let a = 0; a < data.taccountvs1.length; a++) {

                            if ((data.taccountvs1[a].fields.AccountName) === accountDataName) {
                                added = true;
                                if (accountTypeList) {
                                    for (var h = 0; h < accountTypeList.length; h++) {

                                        if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                            fullAccountTypeName = accountTypeList[h].description || '';

                                        }
                                    }

                                }



                                var accountid = data.taccountvs1[a].fields.ID || '';
                                var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                                var accountname = data.taccountvs1[a].fields.AccountName || '';
                                var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                                var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                                var accountdesc = data.taccountvs1[a].fields.Description || '';
                                var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                                var bankbsb = data.taccountvs1[a].fields.BSB || '';
                                var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                                var swiftCode = data.taccountvs1[a].fields.Extra || '';
                                var routingNo = data.taccountvs1[a].BankCode || '';

                                var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                                var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                                var cardcvc = data.taccountvs1[a].fields.CVC || '';
                                var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

                                if ((accounttype === "BANK")) {
                                    $('.isBankAccount').removeClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                } else if ((accounttype === "CCARD")) {
                                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                } else {
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                }

                                $('#edtAccountID').val(accountid);
                                $('#sltAccountType').val(accounttype);
                                $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                                $('#edtAccountName').val(accountname);
                                $('#edtAccountNo').val(accountno);
                                $('#sltTaxCode').val(taxcode);
                                $('#txaAccountDescription').val(accountdesc);
                                $('#edtBankAccountName').val(bankaccountname);
                                $('#edtBSB').val(bankbsb);
                                $('#edtBankAccountNo').val(bankacountno);
                                $('#swiftCode').val(swiftCode);
                                $('#routingNo').val(routingNo);
                                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                                $('#edtCardNumber').val(cardnumber);
                                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                                $('#edtCvc').val(cardcvc);

                                if (showTrans == 'true') {
                                    $('.showOnTransactions').prop('checked', true);
                                } else {
                                    $('.showOnTransactions').prop('checked', false);
                                }

                                setTimeout(function() {
                                    $('#addNewAccount').modal('show');
                                }, 500);

                            }
                        }
                        if (!added) {
                            accountService.getOneAccountByName(accountDataName).then(function(data) {
                                let lineItems = [];
                                let lineItemObj = {};
                                let fullAccountTypeName = '';
                                let accBalance = '';
                                $('#add-account-title').text('Edit Account Details');
                                $('#edtAccountName').attr('readonly', true);
                                $('#sltAccountType').attr('readonly', true);
                                $('#sltAccountType').attr('disabled', 'disabled');
                                if (accountTypeList) {
                                    for (var h = 0; h < accountTypeList.length; h++) {

                                        if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                            fullAccountTypeName = accountTypeList[h].description || '';

                                        }
                                    }

                                }

                                var accountid = data.taccountvs1[0].fields.ID || '';
                                var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                                var accountname = data.taccountvs1[0].fields.AccountName || '';
                                var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                                var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                                var accountdesc = data.taccountvs1[0].fields.Description || '';
                                var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                                var bankbsb = data.taccountvs1[0].fields.BSB || '';
                                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                                var swiftCode = data.taccountvs1[0].fields.Extra || '';
                                var routingNo = data.taccountvs1[0].fields.BankCode || '';

                                var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                                var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                                var cardcvc = data.taccountvs1[0].fields.CVC || '';
                                var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                                if ((accounttype === "BANK")) {
                                    $('.isBankAccount').removeClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                } else if ((accounttype === "CCARD")) {
                                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                } else {
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                }

                                $('#edtAccountID').val(accountid);
                                $('#sltAccountType').val(accounttype);
                                $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                                $('#edtAccountName').val(accountname);
                                $('#edtAccountNo').val(accountno);
                                $('#sltTaxCode').val(taxcode);
                                $('#txaAccountDescription').val(accountdesc);
                                $('#edtBankAccountName').val(bankaccountname);
                                $('#edtBSB').val(bankbsb);
                                $('#edtBankAccountNo').val(bankacountno);
                                $('#swiftCode').val(swiftCode);
                                $('#routingNo').val(routingNo);
                                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                                $('#edtCardNumber').val(cardnumber);
                                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                                $('#edtCvc').val(cardcvc);

                                if (showTrans == 'true') {
                                    $('.showOnTransactions').prop('checked', true);
                                } else {
                                    $('.showOnTransactions').prop('checked', false);
                                }

                                setTimeout(function() {
                                    $('#addNewAccount').modal('show');
                                }, 500);

                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }

                    }
                }).catch(function(err) {
                    accountService.getOneAccountByName(accountDataName).then(function(data) {
                        let lineItems = [];
                        let lineItemObj = {};
                        let fullAccountTypeName = '';
                        let accBalance = '';
                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');
                        if (accountTypeList) {
                            for (var h = 0; h < accountTypeList.length; h++) {

                                if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                    fullAccountTypeName = accountTypeList[h].description || '';

                                }
                            }

                        }

                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                        var cardcvc = data.taccountvs1[0].fields.CVC || '';
                        var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                        if ((accounttype === "BANK")) {
                            $('.isBankAccount').removeClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        } else if ((accounttype === "CCARD")) {
                            $('.isCreditAccount').removeClass('isNotCreditAccount');
                            $('.isBankAccount').addClass('isNotBankAccount');
                        } else {
                            $('.isBankAccount').addClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }

                        $('#edtAccountID').val(accountid);
                        $('#sltAccountType').val(accounttype);
                        $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                        $('#edtAccountName').val(accountname);
                        $('#edtAccountNo').val(accountno);
                        $('#sltTaxCode').val(taxcode);
                        $('#txaAccountDescription').val(accountdesc);
                        $('#edtBankAccountName').val(bankaccountname);
                        $('#edtBSB').val(bankbsb);
                        $('#edtBankAccountNo').val(bankacountno);
                        $('#swiftCode').val(swiftCode);
                        $('#routingNo').val(routingNo);
                        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                        $('#edtCardNumber').val(cardnumber);
                        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                        $('#edtCvc').val(cardcvc);

                        if (showTrans == 'true') {
                            $('.showOnTransactions').prop('checked', true);
                        } else {
                            $('.showOnTransactions').prop('checked', false);
                        }

                        setTimeout(function() {
                            $('#addNewAccount').modal('show');
                        }, 500);

                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });

                });
                $('#addAccountModal').modal('toggle');
            } else {
                $('#accountListModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
                setTimeout(function() {
                    $('#tblAccount_filter .form-control-sm').focus();
                    $('#tblAccount_filter .form-control-sm').val('');
                    $('#tblAccount_filter .form-control-sm').trigger("input");

                    var datatable = $('#tblInventory').DataTable();
                    datatable.draw();
                    $('#tblAccount_filter .form-control-sm').trigger("input");

                }, 500);
            }
        }
    },
    'click #accountListModal #refreshpagelist': function() {
        Meteor._reload.reload();
    },
    'click .lineTaxRate': function(event) {
        $('#tblJournalEntryLine tbody tr .lineTaxRate').attr("data-toggle", "modal");
        $('#tblJournalEntryLine tbody tr .lineTaxRate').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .lineTaxCode, keydown .lineTaxCode': function(event) {
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();
        $('#edtTaxID').val('');
        $('.taxcodepopheader').text('New Tax Rate');
        $('#edtTaxID').val('');
        $('#edtTaxNamePop').val('');
        $('#edtTaxRatePop').val('');
        $('#edtTaxDescPop').val('');
        $('#edtTaxNamePop').attr('readonly', false);
        let purchaseService = new PurchaseBoardService();
        var taxRateDataName = $(event.target).val() || '';
        if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
            $('#taxRateListModal').modal('toggle');
            var targetID = $(event.target).closest('tr').attr('id');
            $('#selectLineID').val(targetID);
            setTimeout(function() {
                $('#tblTaxRate_filter .form-control-sm').focus();
                $('#tblTaxRate_filter .form-control-sm').val('');
                $('#tblTaxRate_filter .form-control-sm').trigger("input");

                var datatable = $('#tblTaxRate').DataTable();
                datatable.draw();
                $('#tblTaxRate_filter .form-control-sm').trigger("input");

            }, 500);
        } else {
            if (taxRateDataName.replace(/\s/g, '') != '') {

                getVS1Data('TTaxcodeVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        purchaseService.getTaxCodesVS1().then(function(data) {
                            let lineItems = [];
                            let lineItemObj = {};
                            for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                                if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                                    $('#edtTaxNamePop').attr('readonly', true);
                                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                                    var taxRateID = data.ttaxcodevs1[i].Id || '';
                                    var taxRateName = data.ttaxcodevs1[i].CodeName || '';
                                    var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                                    $('#edtTaxID').val(taxRateID);
                                    $('#edtTaxNamePop').val(taxRateName);
                                    $('#edtTaxRatePop').val(taxRate);
                                    $('#edtTaxDescPop').val(taxRateDesc);
                                    setTimeout(function() {
                                        $('#newTaxRateModal').modal('toggle');
                                    }, 100);
                                }
                            }
                        }).catch(function(err) {
                            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                            $('.fullScreenSpin').css('display', 'none');
                            // Meteor._reload.reload();
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.ttaxcodevs1;
                        let lineItems = [];
                        let lineItemObj = {};
                        $('.taxcodepopheader').text('Edit Tax Rate');
                        for (let i = 0; i < useData.length; i++) {

                            if ((useData[i].CodeName) === taxRateDataName) {
                                $('#edtTaxNamePop').attr('readonly', true);
                                let taxRate = (useData[i].Rate * 100).toFixed(2);
                                var taxRateID = useData[i].Id || '';
                                var taxRateName = useData[i].CodeName || '';
                                var taxRateDesc = useData[i].Description || '';
                                $('#edtTaxID').val(taxRateID);
                                $('#edtTaxNamePop').val(taxRateName);
                                $('#edtTaxRatePop').val(taxRate);
                                $('#edtTaxDescPop').val(taxRateDesc);
                                //setTimeout(function() {
                                $('#newTaxRateModal').modal('toggle');
                                //}, 500);
                            }
                        }
                    }
                }).catch(function(err) {
                    purchaseService.getTaxCodesVS1().then(function(data) {
                        let lineItems = [];
                        let lineItemObj = {};
                        for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                            if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                                $('#edtTaxNamePop').attr('readonly', true);
                                let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                                var taxRateID = data.ttaxcodevs1[i].Id || '';
                                var taxRateName = data.ttaxcodevs1[i].CodeName || '';
                                var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                                $('#edtTaxID').val(taxRateID);
                                $('#edtTaxNamePop').val(taxRateName);
                                $('#edtTaxRatePop').val(taxRate);
                                $('#edtTaxDescPop').val(taxRateDesc);
                                setTimeout(function() {
                                    $('#newTaxRateModal').modal('toggle');
                                }, 100);
                            }
                        }
                    }).catch(function(err) {
                        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                        $('.fullScreenSpin').css('display', 'none');
                        // Meteor._reload.reload();
                    });
                });
            } else {
                $('#taxRateListModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
                setTimeout(function() {
                    $('#tblTaxRate_filter .form-control-sm').focus();
                    $('#tblTaxRate_filter .form-control-sm').val('');
                    $('#tblTaxRate_filter .form-control-sm').trigger("input");

                    var datatable = $('#tblTaxRate').DataTable();
                    datatable.draw();
                    $('#tblTaxRate_filter .form-control-sm').trigger("input");

                }, 500);
            }
        }
    },
    'click .printConfirm': function(event) {
        $('#html-2-pdfwrapper').css('display', 'block');


        exportSalesToPdf();

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

        // let templateObject = Template.instance();
        // let purchaseService = new PurchaseBoardService();
        // swal({
        //     title: 'Delete Journal Entry',
        //     text: "Are you sure you want to Delete this Journal Entry?",
        //     type: 'info',
        //     showCancelButton: true,
        //     confirmButtonText: 'Yes'
        // }).then((result) => {
        //     if (result.value) {
        //         $('.fullScreenSpin').css('display', 'inline-block');
        //         var url = FlowRouter.current().path;
        //         var getso_id = url.split('?id=');
        //         var currentInvoice = getso_id[getso_id.length - 1];
        //         var objDetails = '';
        //         if (getso_id[1]) {
        //             currentInvoice = parseInt(currentInvoice);
        //             var objDetails = {
        //                 type: "TJournalEntry",
        //                 fields: {
        //                     ID: currentInvoice,
        //                     Deleted: true
        //                 }
        //             };

        //             purchaseService.saveJournalEnrtry(objDetails).then(function(objDetails) {
        //                 FlowRouter.go('/journalentrylist?success=true');
        //                 $('.modal-backdrop').css('display', 'none');
        //             }).catch(function(err) {
        //                 if (err === 'Error: "Unable to lock object: "') {
        //                     swal({
        //                         title: 'This Journal Entry has already been reconciled.',
        //                         text: 'Please delete the Bank Reconciliation in order to edit/delete this Journal Entry',
        //                         type: 'error',
        //                         showCancelButton: false,
        //                         confirmButtonText: 'Try Again'
        //                     }).then((result) => {
        //                         if (result.value) {
        //                             FlowRouter.go('/journalentrylist');
        //                         } else if (result.dismiss === 'cancel') {

        //                         }
        //                     });
        //                 } else {
        //                     swal({
        //                         title: 'Oooops...',
        //                         text: err,
        //                         type: 'error',
        //                         showCancelButton: false,
        //                         confirmButtonText: 'Try Again'
        //                     }).then((result) => {
        //                         if (result.value) { if (err === checkResponseError) { window.open('/', '_self'); } } else if (result.dismiss === 'cancel') {

        //                         }
        //                     });
        //                 }
        //                 $('.fullScreenSpin').css('display', 'none');
        //             });
        //         } else {
        //             FlowRouter.go('/journalentrylist?success=true');
        //             $('.modal-backdrop').css('display', 'none');
        //         }
        //     } else {}

        // });
    },
    'click .btnSaveSettings': function(event) {

        $('#myModal4').modal('toggle');
    },
    'click .btnSave': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        templateObject = Template.instance();
        let taxRateList = templateObject.taxRateList.get();
        let accountsList = templateObject.accountsList.get();

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
        if ($("#datemethod1").prop('checked') == true) {
            datemethod = "q";
            if ($("#beginquarterlydate").val() != "" && $("#currentyear").val() != "") {
                startDate = new Date($("#currentyear").val() + "-" + $("#beginquarterlydate").val());
                startDate = moment(startDate).format("YYYY-MM-DD");
            }
        } else {
            datemethod = "m";
            if ($("#beginmonthlydate").val() != "" && $("#currentyear").val() != "") {
                startDate = new Date($("#currentyear").val() + "-" + $("#beginmonthlydate").val());
                startDate = moment(startDate).format("YYYY-MM-DD");
            }
        }
        var endDate = new Date();
        endDate = moment(endDate).format("YYYY-MM-DD");
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
        if ($("#datemethod1-t2").prop('checked') == true) {
            datemethodT2 = "q";
            if ($("#beginquarterlydate-t2").val() != "" && $("#currentyear-t2").val() != "") {
                startDateT2 = new Date($("#currentyear-t2").val() + "-" + $("#beginquarterlydate-t2").val());
                startDateT2 = moment(startDateT2).format("YYYY-MM-DD");
            }
        } else {
            datemethodT2 = "m";
            if ($("#beginmonthlydate-t2").val() != "" && $("#currentyear-t2").val() != "") {
                startDateT2 = new Date($("#currentyear-t2").val() + "-" + $("#beginmonthlydate-t2").val());
                startDateT2 = moment(startDateT2).format("YYYY-MM-DD");
            }
        }
        var endDateT2 = new Date();
        endDateT2 = moment(endDate).format("YYYY-MM-DD");
        let datemethodT2_2 = "q";
        let startDateT2_2 = "0000-00-00";
        if ($("#datemethod1-t2-2").prop('checked') == true) {
            datemethodT2_2 = "q";
            if ($("#beginquarterlydate-t2-2").val() != "" && $("#currentyear-t2-2").val() != "") {
                startDateT2_2 = new Date($("#currentyear-t2-2").val() + "-" + $("#beginquarterlydate-t2-2").val());
                startDateT2_2 = moment(startDateT2_2).format("YYYY-MM-DD");
            }
        } else {
            datemethodT2_2 = "m";
            if ($("#beginmonthlydate-t2-2").val() != "" && $("#currentyear-t2-2").val() != "") {
                startDateT2_2 = new Date($("#currentyear-t2-2").val() + "-" + $("#beginmonthlydate-t2-2").val());
                startDateT2_2 = moment(startDateT2_2).format("YYYY-MM-DD");
            }
        }
        var endDateT2_2 = new Date();
        endDateT2_2 = moment(endDate).format("YYYY-MM-DD");
        let accounts1cost = $('#accounts1cost').val();
        let accounts2cost = $('#accounts2cost').val();
        let accounts3cost = $('#accounts3cost').val();
        let accounts4cost = $('#accounts4cost').val();
        let accounts5cost = $('#accounts5cost').val();
        let accounts6cost = $('#accounts6cost').val();
        let accounts7cost = $('#accounts7cost').val();
        let accounts8cost = $('#accounts8cost').val();
        let accounts9cost = $('#accounts9cost').val();
        let accounts10cost = $('#accounts10cost').val();
        let accounts11cost = $('#accounts11cost').val();
        let accounts12cost = $('#accounts12cost').val();
        let accounts1 = [];
        let accounts2 = [];
        let accounts3 = [];
        let accounts4 = [];
        let accounts5 = [];
        let t3accounts1 = [];
        for (var i = 0; i < accountsList.length; i++) {
            if ($("#f-1-" + accountsList[i].id).prop('checked') == true) {
                accounts1.push(accountsList[i].Id)
            } else if ($("#f-2-" + accountsList[i].id).prop('checked') == true) {
                accounts2.push(accountsList[i].Id)
            } else if ($("#f-3-" + accountsList[i].id).prop('checked') == true) {
                accounts3.push(accountsList[i].Id)
            } else if ($("#f-4-" + accountsList[i].id).prop('checked') == true) {
                accounts4.push(accountsList[i].Id)
            } else if ($("#f-5-" + accountsList[i].id).prop('checked') == true) {
                accounts5.push(accountsList[i].Id)
            } else if ($("#f3-1-" + accountsList[i].id).prop('checked') == true) {
                t3accounts1.push(accountsList[i].Id)
            }
        }
        let datemethodT3 = "q";
        let startDateT3 = "0000-00-00";
        if ($("#datemethod1-t3").prop('checked') == true) {
            datemethodT2 = "q";
            if ($("#beginquarterlydate-t3").val() != "" && $("#currentyear-t3").val() != "") {
                startDateT3 = new Date($("#currentyear-t3").val() + "-" + $("#beginquarterlydate-t3").val());
                startDateT3 = moment(startDateT3).format("YYYY-MM-DD");
            }
        } else {
            datemethodT3 = "m";
            if ($("#beginmonthlydate-t3").val() != "" && $("#currentyear-t3").val() != "") {
                startDateT3 = new Date($("#currentyear-t3").val() + "-" + $("#beginmonthlydate-t3").val());
                startDateT3 = moment(startDateT3).format("YYYY-MM-DD");
            }
        }
        var endDateT3 = new Date();
        endDateT3 = moment(endDate).format("YYYY-MM-DD");
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
            $('.fullScreenSpin').css('display', 'none');
            Bert.alert('<strong>WARNING:</strong> BAS Return Description cannot be blank!', 'warning');
            e.preventDefault();
        } else {
            let dataArray = [];
            getVS1Data('TBasReturn').then(function(dataObject) {
                if (dataObject.length > 0) {
                    dataArray = JSON.parse(dataObject[0].data);
                }
            });

            setTimeout(function() {
                let jsonObj = {
                    barNumber: (dataArray.length + 1),
                    description: description,
                    departmentId: departmentId,
                    accountingMethod: accountingMethod,
                    basReturnTab1: {
                        datemethod: datemethod,
                        startDate: startDate,
                        endDate: endDate,
                        tab1B1: {
                            amount: gst1cost,
                            taxcodes: gst1taxcodes
                        },
                        tab1B2: {
                            amount: gst2cost,
                            taxcodes: gst2taxcodes
                        },
                        tab1B3: {
                            amount: gst3cost,
                            taxcodes: gst3taxcodes
                        },
                        tab1B4: {
                            amount: gst4cost,
                            taxcodes: gst4taxcodes
                        },
                        tab1B5: {
                            amount: gst5cost,
                        },
                        tab1B6: {
                            amount: gst6cost,
                        },
                        tab1B7: {
                            amount: gst7cost,
                            taxcodes: gst7taxcodes
                        },
                        tab1B8: {
                            amount: gst8cost,
                        },
                        tab1B9: {
                            amount: gst9cost,
                        },
                        tab1B10: {
                            amount: gst10cost,
                            taxcodes: gst10taxcodes
                        },
                        tab1B11: {
                            amount: gst11cost,
                            taxcodes: gst11taxcodes
                        },
                        tab1B12: {
                            amount: gst12cost,
                        },
                        tab1B13: {
                            amount: gst13cost,
                            taxcodes: gst13taxcodes
                        },
                        tab1B14: {
                            amount: gst14cost,
                            taxcodes: gst14taxcodes
                        },
                        tab1B15: {
                            amount: gst15cost,
                            taxcodes: gst15taxcodes
                        },
                        tab1B16: {
                            amount: gst16cost,
                        },
                        tab1B17: {
                            amount: gst17cost,
                        },
                        tab1B18: {
                            amount: gst18cost,
                            taxcodes: gst18taxcodes
                        },
                        tab1B19: {
                            amount: gst19cost,
                        },
                        tab1B20: {
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
                            amount: accounts8cost
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
                            amount: accounts12cost
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

                dataArray.unshift(jsonObj);
                addVS1Data('TBasReturn', JSON.stringify(dataArray)).then(function(datareturn) {
                    $('.fullScreenSpin').css('display', 'none');
                    FlowRouter.go('/basreturnlist');
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }, 200);
        }



        // let templateObject = Template.instance();
        // let department = $('#sltDepartment').val();
        // let headMemo = $('#txaMemo').val();
        // let purchaseService = new PurchaseBoardService();

        // if (getso_id[1]) {
        //     var lineID = this.id;
        //     let tdaccount = $('#' + lineID + " .lineAccountName").val();
        //     let tdaccountNo = $('#' + lineID + " .lineAccountNo").text();
        //     let tddmemo = $('#' + lineID + " .lineMemo").text();
        //     let tdcreditex = $('#' + lineID + " .lineCreditInc").val();
        //     let tddebitex = $('#' + lineID + " .lineDebitInc").val();
        //     let erpLineID = $('#' + lineID + " .lineAccountName").attr('lineid');

        //     tdtaxCode = tdtaxCode = $('#' + lineID + " .lineTaxCode").val() || loggedTaxCodePurchaseInc;


        //     if (tdaccount != "") {

        //         lineItemObjForm = {
        //             type: "TJournalEntryLines",
        //             fields: {
        //                 ID: parseInt(erpLineID) || 0,
        //                 AccountName: tdaccount || '',

        //                 Memo: tddmemo || headMemo,
        //                 TaxCode: tdtaxCode || '',
        //                 CreditAmountInc: parseFloat(tdcreditex.replace(/[^0-9.-]+/g, "")) || 0,

        //                 DebitAmountInc: parseFloat(tddebitex.replace(/[^0-9.-]+/g, "")) || 0,

        //                 DeptName: department || defaultDept,

        //                 EmployeeName: Session.get('mySessionEmployee')
        //             }
        //         };
        //         lineItemsForm.push(lineItemObjForm);
        //         splashLineArray.push(lineItemObjForm);
        //     }

        //     currentBill = parseInt(currentBill);
        //     objDetails = {
        //         type: "TJournalEntry",
        //         fields: {
        //             ID: currentBill,
        //             TransactionNo: entryNo,
        //             Lines: splashLineArray,
        //             TransactionDate: transDate,
        //             Memo: headMemo
        //         }
        //     };
        // }
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
    'click .chkcolCreditEx': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colCreditEx').css('display', 'table-cell');
            $('.colCreditEx').css('padding', '.75rem');
            $('.colCreditEx').css('vertical-align', 'top');
        } else {
            $('.colCreditEx').css('display', 'none');
        }
    },
    'click .chkcolDebitEx': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colDebitEx').css('display', 'table-cell');
            $('.colDebitEx').css('padding', '.75rem');
            $('.colDebitEx').css('vertical-align', 'top');
        } else {
            $('.colDebitEx').css('display', 'none');
        }
    },
    'change .rngRangeAccountName': function(event) {

        let range = $(event.target).val();
        $(".spWidthAccountName").html(range + '%');
        $('.colAccountName').css('width', range + '%');

    },
    'change .rngRangeAccountNo': function(event) {

        let range = $(event.target).val();
        $(".spWidthAccountNo").html(range + '%');
        $('.colAccountNo').css('width', range + '%');

    },
    'change .rngRangeMemo': function(event) {

        let range = $(event.target).val();
        $(".spWidthMemo").html(range + '%');
        $('.colMemo').css('width', range + '%');

    },
    'change .rngRangeCreditEx': function(event) {

        let range = $(event.target).val();
        $(".spWidthCreditEx").html(range + '%');
        $('.colCreditEx').css('width', range + '%');

    },
    'change .rngRangeDebitEx': function(event) {

        let range = $(event.target).val();
        $(".spWidthDebitEx").html(range + '%');
        $('.colDebitEx').css('width', range + '%');

    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);

    },
    'click .btnSaveGridSettings': function(event) {
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
    'click .new_attachment_btn': function(event) {
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function(e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .img_new_attachment_btn': function(event) {
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function(e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function(event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if (tempObj.$("#confirm-action-" + attachmentID).length) {
            tempObj.$("#confirm-action-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">' +
                'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .file-name': function(event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();
        $('#myModalAttachment').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        } else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        } else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        } else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        } else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        } else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');

        return;
    },
    'click .confirm-delete-attachment': function(event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .save-to-library': function(event, ui) {
        $('.confirm-delete-attachment').trigger('click');
    },
    'click #btn_Attachment': function() {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);


    }

});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});