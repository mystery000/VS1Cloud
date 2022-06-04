import { ReactiveVar } from 'meteor/reactive-var';
import { ReconService } from "./recon-service";
import { UtilityService } from "../utility-service";
import '../lib/global/erp-objects';
import '../lib/global/indexdbstorage.js';
import 'jquery-editable-select';
import { AccountService } from "../accounts/account-service";
import { ProductService } from "../product/product-service";
import { PurchaseBoardService } from "../js/purchase-service";
import { SideBarService } from '../js/sidebar-service';
import { YodleeService } from '../js/yodlee-service';
import { Random } from 'meteor/random';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let yodleeService = new YodleeService();

let selectedLineID = null;
let selectedYodleeID = null;
let selectedAccountFlag = '';
let selectedTaxFlag = '';
let selectedCustomerFlag = '';

Template.newbankrecon.onCreated(function() {
    const templateObject = Template.instance();

    templateObject.accountnamerecords = new ReactiveVar();
    templateObject.lastTransactionDate = new ReactiveVar();
    templateObject.page_number = new ReactiveVar();
    templateObject.page_total = new ReactiveVar();
    templateObject.page_count = new ReactiveVar();
    templateObject.page_list = new ReactiveVar([]);
    templateObject.sort = new ReactiveVar();
    templateObject.sort_param = new ReactiveVar();
    templateObject.fa_sortDepositSpent = new ReactiveVar();
    templateObject.fa_sortDepositReceived = new ReactiveVar();
    templateObject.fa_sortWithdrawSpent = new ReactiveVar();
    templateObject.fa_sortWithdrawReceived = new ReactiveVar();
    templateObject.bankTransactionData = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);
    templateObject.clientrecords = new ReactiveVar();
    templateObject.baselinedata = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.newbankrecon.onRendered(function() {

    const templateObject = Template.instance();
    let reconService = new ReconService();
    let productService = new ProductService();
    let purchaseService = new PurchaseBoardService();
    let accountService = new AccountService();

    let page_number = (FlowRouter.current().queryParams.page !== undefined && parseInt(FlowRouter.current().queryParams.page) > 0)?FlowRouter.current().queryParams.page:1;
    templateObject.page_number.set(page_number);
    templateObject.sort.set((FlowRouter.current().queryParams.sort !== undefined && FlowRouter.current().queryParams.sort !== '')?FlowRouter.current().queryParams.sort:'');
    templateObject.sort_param.set((Template.instance().sort.get() !== '')?'&sort='+Template.instance().sort.get():'');
    let page_limit = 10;
    let page_total = 0;

    const taxCodesList = [];
    const splashArrayTaxRateList = [];
    let accountnamerecords = [];

    let bankaccountid = Session.get('bankaccountid') || '';
    let bankaccountname = Session.get('bankaccountname') || '';
    let statementDate = localStorage.getItem('statementdate')|| '';
    let selectedDepositID = null;

    templateObject.getAccountNames = function() {
        reconService.getAccountNameVS1().then(function(data) {
            if (data.taccountvs1.length > 0) {
                for (let i = 0; i < data.taccountvs1.length; i++) {
                    let accountnamerecordObj = {
                        accountid: data.taccountvs1[i].Id || ' ',
                        accountname: data.taccountvs1[i].AccountName || ' '
                    };
                    if ((data.taccountvs1[i].AccountTypeName === 'BANK') || (data.taccountvs1[i].AccountTypeName === 'CCARD')) {
                        accountnamerecords.push(accountnamerecordObj);
                        templateObject.accountnamerecords.set(accountnamerecords);
                    }
                }
            }
            // Session - set account dropdown BEGIN
            setTimeout(function() {
                if (bankaccountid !== '') {
                    $('#bankAccountID').val(bankaccountid);
                    $('#bankAccountName').val(bankaccountname);

                    templateObject.getOpenBalance(bankaccountname);
                    templateObject.getBankTransactionData(bankaccountid, statementDate, true);
                }else{
                    $('.fullScreenSpin').css('display', 'none');
                }
            }, 10);

            // Session - set account dropdown END
            // $('.fullScreenSpin').css('display', 'none');
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    };

    templateObject.getAllTaxCodes = function () {
        getVS1Data("TTaxcodeVS1")
            .then(function (dataObject) {
                if (dataObject.length === 0) {
                    productService.getTaxCodesVS1().then(function (data) {
                        setTaxCodeModal(data);
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    setTaxCodeModal(data);
                }
            })
            .catch(function (err) {
                productService.getTaxCodesVS1().then(function (data) {
                    setTaxCodeModal(data);
                });
            });
    };
    function setTaxCodeModal(data) {
        let useData = data.ttaxcodevs1;
        // let records = [];
        // let inventoryData = [];
        for (let i = 0; i < useData.length; i++) {
            let taxRate = (useData[i].Rate * 100).toFixed(2);
            var dataList = [
                useData[i].Id || "",
                useData[i].CodeName || "",
                useData[i].Description || "-",
                taxRate || 0,
            ];
            let taxcoderecordObj = {
                codename: useData[i].CodeName || " ",
                coderate: taxRate || " ",
            };
            taxCodesList.push(taxcoderecordObj);
            splashArrayTaxRateList.push(dataList);
        }
        templateObject.taxraterecords.set(taxCodesList);
        if (splashArrayTaxRateList) {
            $("#tblTaxRate").DataTable({
                data: splashArrayTaxRateList,
                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                columnDefs: [
                    {
                        orderable: false,
                        targets: 0,
                    },
                    {
                        className: "taxName",
                        targets: [1],
                    },
                    {
                        className: "taxDesc",
                        targets: [2],
                    },
                    {
                        className: "taxRate text-right",
                        targets: [3],
                    },
                ],
                colReorder: true,

                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"],
                ],
                info: true,
                responsive: true,
                fnDrawCallback: function (oSettings) {
                    // $('.dataTables_paginate').css('display', 'none');
                },
                fnInitComplete: function () {
                    $(
                        "<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>"
                    ).insertAfter("#tblTaxRate_filter");
                    $(
                        "<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                    ).insertAfter("#tblTaxRate_filter");
                },
            });
        }
    }

    templateObject.getAllClients = function () {
        getVS1Data('TCustomerVS1').then(function (dataObject) {
            if (dataObject.length === 0) {
                sideBarService.getClientVS1().then(function (data) {
                    setClientList(data.tcustomervs1);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;
                setClientList(useData);
            }
        }).catch(function (err) {
            sideBarService.getClientVS1().then(function (data) {
                setClientList(data.tcustomervs1);
            });
        });
    };
    function setClientList (data) {
        let clientList = [];
        for (let i in data) {
            if (data.hasOwnProperty(i)) {
                let customerrecordObj = {
                    customerid: data[i].fields.CallPriority || ' ',
                    firstname: data[i].fields.FirstName || '',
                    lastname: data[i].fields.LastName || '',
                    customername: data[i].fields.ClientName || ' ',
                    customeremail: data[i].fields.Email || ' ',
                    street: data[i].fields.Street || ' ',
                    street2: data[i].fields.Street2 || ' ',
                    street3: data[i].fields.Street3 || ' ',
                    suburb: data[i].fields.Suburb || ' ',
                    statecode: data[i].fields.State + ' ' + data[i].fields.Postcode || ' ',
                    country: data[i].fields.Country || ' ',
                    termsName: data[i].fields.TermsName || '',
                    taxCode: data[i].fields.TaxCodeName || 'E',
                    clienttypename: data[i].fields.ClientTypeName || 'Default',
                    discount: data[i].fields.Discount || 0,
                };
                clientList.push(customerrecordObj);
            }

        }
        templateObject.clientrecords.set(clientList);
        for (let i = 0; i < clientList.length; i++) {
            //$('#edtCustomerName').editableSelect('add', clientList[i].customername);
        }
    }

    templateObject.getBankTransactionData = function (accountId, statementDate, ignoreDate) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let reconData = [];
        let yodleeFromDate = null;
        if (ignoreDate) {
            yodleeFromDate = '2000-01-01';
        } else {
            yodleeFromDate = statementDate;
        }
        let yodleeData = [];
        const client_id = "KESAGIh3yF3Z220TwoYeMDJKgsRXSSk4";
        const secret = "TqDOhdMCOYHJq1se";
        const user_name = "sbMem5f85b3fb4145c1";

        yodleeService.getAccessToken(user_name, client_id, secret).then(function(data) {
            let access_token = data.token.accessToken;
            let depositVS1Data = [];
            let withdrawalVS1Data = [];
            const yodleeAccountID = getYodleeAccountID(accountId);
            yodleeService.getTransactionData(access_token, yodleeFromDate).then(function(data) {
                // console.log(data);
                let lastTransactionDate = '1899-12-31';
                for (let i = 0; i < data.transaction.length; i++ ) {
                    if (yodleeAccountID === data.transaction[i].accountId && (data.transaction[i].baseType === 'DEBIT' || data.transaction[i].baseType === 'CREDIT')) {
                        let description = '';
                        if (data.transaction[i].description) {
                            if (data.transaction[i].description.simple) {
                                description += data.transaction[i].description.simple;
                            }
                            if (data.transaction[i].description.original) {
                                description += data.transaction[i].description.original;
                            }
                        }
                        // let yodleeTransactionDate = data.transaction[i].date !== '' ? moment(data.transaction[i].date).format("DD/MM/YYYY") : data.transaction[i].date;
                        let yodleeTransactionDate = data.transaction[i].transactionDate !== '' ? moment(data.transaction[i].transactionDate).format("DD/MM/YYYY") : data.transaction[i].transactionDate;
                        let yodleeDate = data.transaction[i].transactionDate !== '' ? moment(data.transaction[i].transactionDate).format("YYYY-MM-DD") : data.transaction[i].transactionDate;
                        let deporwith = '';
                        let spentYodleeAmount = 0;
                        let receivedYodleeAmount = 0;
                        if (data.transaction[i].baseType === 'DEBIT') {
                            deporwith = 'spent';
                            spentYodleeAmount = data.transaction[i].amount.amount;
                        } else {
                            deporwith = 'received';
                            receivedYodleeAmount = data.transaction[i].amount.amount;
                        }
                        if (yodleeTransactionDate > yodleeDate) {
                            lastTransactionDate = yodleeTransactionDate;
                        }
                        let yodleeObject = {
                            SortDate: yodleeDate,
                            YodleeDate: yodleeTransactionDate,
                            VS1Date: '',
                            CompanyName: '',
                            PaymentType: '',
                            Amount: 0,
                            DepositID: '',
                            ReferenceNo: '',
                            Seqno: 0,
                            PaymentID: 0,
                            DepositLineID: 0,
                            CusID: 0,
                            YodleeAccountID: data.transaction[i].accountId || 0,
                            YodleeLineID: data.transaction[i].id || 0,
                            YodleeTransactionDate: yodleeTransactionDate,
                            YodleeAmount: data.transaction[i].amount.amount,
                            YodleeDescription: description,
                            YodleeBaseType: data.transaction[i].baseType || '',
                            YodleeCategory: data.transaction[i].category || '',
                            YodleeCategoryType: data.transaction[i].categoryType || '',
                            YodleeCheckNumber: data.transaction[i].checkNumber || '',
                            YodleeType: data.transaction[i].type || '',
                            deporwith: deporwith,
                            matched: false,
                            spentYodleeAmount: utilityService.modifynegativeCurrencyFormat(spentYodleeAmount),
                            receivedYodleeAmount: utilityService.modifynegativeCurrencyFormat(receivedYodleeAmount),
                            spentVS1Amount: utilityService.modifynegativeCurrencyFormat(0),
                            receivedVS1Amount: utilityService.modifynegativeCurrencyFormat(0),
                        };
                        yodleeData.push(yodleeObject);
                    }
                }
                templateObject.lastTransactionDate.set(lastTransactionDate);
                reconService.getToBeReconciledDeposit(accountId, statementDate, ignoreDate).then(function(data) {
                    // data = {
                    //     "ttobereconcileddeposit":[
                    //         {
                    //             "Amount" : 2500,
                    //             "DepositDate": '2022-04-28',
                    //             "CompanyName": 'Yuga',
                    //             "Notes": '',
                    //             "DepositID": 115,
                    //             "ReferenceNo": 'ac-78',
                    //             "Seqno": 333,
                    //             "PaymentID": 115,
                    //             "DepositLineID": 115,
                    //             "CusID": 3,
                    //             "StatementLineID": 15,
                    //             "StatementTransactionDate": '2022-04-17',
                    //             "StatementAmount": 1500,
                    //             "StatementDescription": 'Manual'
                    //         },
                    //         {
                    //             "Amount" : 700,
                    //             "DepositDate": '2022-05-02',
                    //             "CompanyName": 'Yuga',
                    //             "Notes": '',
                    //             "DepositID": 116,
                    //             "ReferenceNo": 'ac-78',
                    //             "Seqno": 333,
                    //             "PaymentID": 116,
                    //             "DepositLineID": 116,
                    //             "CusID": 3,
                    //             "StatementLineID": 15,
                    //             "StatementTransactionDate": '2022-04-17',
                    //             "StatementAmount": 700,
                    //             "StatementDescription": 'Manual'
                    //         }
                    //     ]
                    // };
                    if (data.ttobereconcileddeposit.length > 0) {
                        for (let i = 0; i < data.ttobereconcileddeposit.length; i++ ) {
                            let depositamount = data.ttobereconcileddeposit[i].Amount;
                            let reconciledepositObj = {
                                VS1Date: data.ttobereconcileddeposit[i].DepositDate !== '' ? moment(data.ttobereconcileddeposit[i].DepositDate).format("DD/MM/YYYY") : data.ttobereconcileddeposit[i].DepositDate,
                                CompanyName: data.ttobereconcileddeposit[i].CompanyName || ' ',
                                PaymentType: data.ttobereconcileddeposit[i].Notes || ' ',
                                Amount: data.ttobereconcileddeposit[i].Amount,
                                DepositID: data.ttobereconcileddeposit[i].DepositID || ' ',
                                ReferenceNo: data.ttobereconcileddeposit[i].ReferenceNo || ' ',
                                Seqno: data.ttobereconcileddeposit[i].Seqno || 0,
                                PaymentID: data.ttobereconcileddeposit[i].PaymentID || 0,
                                DepositLineID: data.ttobereconcileddeposit[i].DepositLineID || 0,
                                CusID: data.ttobereconcileddeposit[i].CusID || 0,
                                StatementLineID: data.ttobereconcileddeposit[i].StatementLineID || 0,
                                StatementTransactionDate: data.ttobereconcileddeposit[i].StatementTransactionDate !== '' ? moment(data.ttobereconcileddeposit[i].StatementTransactionDate).format("DD/MM/YYYY") : data.ttobereconcileddeposit[i].StatementTransactionDate,
                                StatementAmount: data.ttobereconcileddeposit[i].StatementAmount,
                                StatementDescription: data.ttobereconcileddeposit[i].StatementDescription || ' ',
                                deporwith: 'received',
                                spentVS1Amount: utilityService.modifynegativeCurrencyFormat(0),
                                receivedVS1Amount: utilityService.modifynegativeCurrencyFormat(data.ttobereconcileddeposit[i].Amount),
                            };
                            depositVS1Data.push(reconciledepositObj);
                        }
                    }
                    reconService.getToBeReconciledWithdrawal(accountId, statementDate, ignoreDate).then(function(data) {
                        if (data.ttobereconciledwithdrawal.length > 0) {
                            for (let j = 0; j < data.ttobereconciledwithdrawal.length; j++ ) {
                                let withdrawalamount = data.ttobereconciledwithdrawal[j].Amount;
                                let reconcilewithdrawalObj = {
                                    VS1Date: data.ttobereconciledwithdrawal[j].DepositDate !== '' ? moment(data.ttobereconciledwithdrawal[j].DepositDate).format("DD/MM/YYYY") : data.ttobereconciledwithdrawal[j].DepositDate,
                                    CompanyName: data.ttobereconciledwithdrawal[j].CompanyName || ' ',
                                    PaymentType: data.ttobereconciledwithdrawal[j].Notes || ' ',
                                    Amount: data.ttobereconciledwithdrawal[j].Amount,
                                    DepositID: data.ttobereconciledwithdrawal[j].DepositID || ' ',
                                    ReferenceNo: data.ttobereconciledwithdrawal[j].ReferenceNo || ' ',
                                    Seqno: data.ttobereconciledwithdrawal[j].Seqno || 0,
                                    PaymentID: data.ttobereconciledwithdrawal[j].PaymentID || 0,
                                    DepositLineID: data.ttobereconciledwithdrawal[j].DepositLineID || 0,
                                    CusID: data.ttobereconciledwithdrawal[j].CusID || 0,
                                    StatementLineID: data.ttobereconciledwithdrawal[j].StatementLineID || 0,
                                    StatementTransactionDate: data.ttobereconciledwithdrawal[j].StatementTransactionDate !== '' ? moment(data.ttobereconciledwithdrawal[j].StatementTransactionDate).format("DD/MM/YYYY") : data.ttobereconciledwithdrawal[j].StatementTransactionDate,
                                    StatementAmount: data.ttobereconciledwithdrawal[j].StatementAmount,
                                    StatementDescription: data.ttobereconciledwithdrawal[j].StatementDescription || ' ',
                                    deporwith: 'spent',
                                    spentVS1Amount: utilityService.modifynegativeCurrencyFormat(data.ttobereconciledwithdrawal[j].Amount),
                                    receivedVS1Amount: utilityService.modifynegativeCurrencyFormat(0),
                                };
                                withdrawalVS1Data.push(reconcilewithdrawalObj);
                            }
                        }
                        if (yodleeData.length > 0) {
                            for (let k = 0; k < yodleeData.length; k++ ) {
                                let VS1Date = ''; let CompanyName = ''; let PaymentType = ''; let Amount = 0; let DepositID = 0;
                                let ReferenceNo = ''; let Seqno = 0; let PaymentID = 0; let DepositLineID = 0; let CusID = 0;
                                let spentVS1Amount = 0; let receivedVS1Amount = 0;
                                let VS1Data = null; let matched = false;
                                if (yodleeData[k].deporwith === 'received' && depositVS1Data.length > 0) {
                                    for (let j = 0; j < depositVS1Data.length; j++ ) {
                                        if (yodleeData[k].YodleeDescription === depositVS1Data[j].Notes) {
                                            VS1Data = depositVS1Data[j];
                                        }
                                    }
                                }
                                if (yodleeData[k].deporwith === 'spent' && withdrawalVS1Data.length > 0) {
                                    for (let i = 0; i < withdrawalVS1Data.length; i++ ) {
                                        if (yodleeData[k].YodleeDescription === withdrawalVS1Data[i].StatementDescription) {
                                            VS1Data = withdrawalVS1Data[i];
                                        }
                                    }
                                }
                                if (VS1Data) {
                                    VS1Date = VS1Data.VS1Date;
                                    CompanyName = VS1Data.CompanyName;
                                    PaymentType = VS1Data.PaymentType;
                                    Amount = VS1Data.Amount;
                                    DepositID = VS1Data.DepositID;
                                    ReferenceNo = VS1Data.ReferenceNo;
                                    Seqno = VS1Data.Seqno;
                                    PaymentID = VS1Data.PaymentID;
                                    DepositLineID = VS1Data.DepositLineID;
                                    CusID = VS1Data.CusID;
                                    spentVS1Amount = VS1Data.spentVS1Amount;
                                    receivedVS1Amount = VS1Data.receivedVS1Amount;
                                    matched = yodleeData[k].YodleeAmount === VS1Data.Amount;
                                }
                                let reconObject = {
                                    SortDate: yodleeData[k].SortDate,
                                    YodleeDate: yodleeData[k].YodleeDate,
                                    VS1Date: VS1Date,
                                    CompanyName: CompanyName,
                                    PaymentType: PaymentType,
                                    Amount: Amount,
                                    DepositID: DepositID,
                                    ReferenceNo: ReferenceNo,
                                    Seqno: Seqno,
                                    PaymentID: PaymentID,
                                    DepositLineID: DepositLineID,
                                    CusID: CusID,
                                    YodleeAccountID: yodleeData[k].YodleeAccountID,
                                    YodleeLineID: yodleeData[k].YodleeLineID,
                                    YodleeTransactionDate: yodleeData[k].YodleeTransactionDate,
                                    YodleeAmount: yodleeData[k].YodleeAmount,
                                    YodleeDescription: yodleeData[k].YodleeDescription,
                                    YodleeBaseType: yodleeData[k].YodleeBaseType,
                                    YodleeCategory: yodleeData[k].YodleeCategory,
                                    YodleeCategoryType: yodleeData[k].YodleeCategoryType,
                                    YodleeCheckNumber: yodleeData[k].YodleeCheckNumber,
                                    YodleeType: yodleeData[k].YodleeType,
                                    deporwith: yodleeData[k].deporwith,
                                    matched: matched,
                                    spentYodleeAmount: yodleeData[k].spentYodleeAmount,
                                    receivedYodleeAmount: yodleeData[k].receivedYodleeAmount,
                                    spentVS1Amount: spentVS1Amount,
                                    receivedVS1Amount: receivedVS1Amount,
                                };
                                reconData.push(reconObject);
                            }
                        }
                        // console.log(reconData);
                        setBankTransactionData(reconData);
                    }).catch(function(err) {
                        setBankTransactionData(reconData);
                    });
                    $('.fullScreenSpin').css('display', 'none');
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
            yodleeService.getAccountData(access_token, yodleeAccountID).then(function(data) {
                for (let i = 0; i < data.account.length; i++ ) {
                    let yodleeBalance = data.account[0].currentBalance.amount;
                    let yodleeProviderAccountId = data.account[0].providerAccountId;
                    let yodleeAccountName = data.account[0].accountName;
                    $('.yodleeBalance').text(utilityService.modifynegativeCurrencyFormat(yodleeBalance));
                }
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    };
    function setBankTransactionData(reconData) {
        page_total = reconData.length;
        templateObject.page_total.set(page_total);
        let page_cnt = Math.ceil(page_total/page_limit);
        templateObject.page_count.set(page_cnt);
        let page_list = Array.from({length: page_cnt}, (_, i) => i + 1);
        templateObject.page_list.set(page_list);
        let page_arr = [];
        let sort = templateObject.sort.get();
        if (sort === "ascDepositSpent") {
            page_arr = sortBankTransactionData(reconData, 'spentYodleeAmount', false);
            templateObject.fa_sortDepositSpent.set('fa-sort-asc');
            templateObject.fa_sortDepositReceived.set('fa-sort');
            templateObject.fa_sortWithdrawSpent.set('fa-sort');
            templateObject.fa_sortWithdrawReceived.set('fa-sort');
        } else if (sort === "descDepositSpent") {
            page_arr = sortBankTransactionData(reconData, 'spentYodleeAmount', true);
            templateObject.fa_sortDepositSpent.set('fa-sort-desc');
            templateObject.fa_sortDepositReceived.set('fa-sort');
            templateObject.fa_sortWithdrawSpent.set('fa-sort');
            templateObject.fa_sortWithdrawReceived.set('fa-sort');
        } else if (sort === "ascDepositReceived") {
            page_arr = sortBankTransactionData(reconData, 'receivedYodleeAmount', false);
            templateObject.fa_sortDepositSpent.set('fa-sort');
            templateObject.fa_sortDepositReceived.set('fa-sort-asc');
            templateObject.fa_sortWithdrawSpent.set('fa-sort');
            templateObject.fa_sortWithdrawReceived.set('fa-sort');
        } else if (sort === "descDepositReceived") {
            page_arr = sortBankTransactionData(reconData, 'receivedYodleeAmount', true);
            templateObject.fa_sortDepositSpent.set('fa-sort');
            templateObject.fa_sortDepositReceived.set('fa-sort-desc');
            templateObject.fa_sortWithdrawSpent.set('fa-sort');
            templateObject.fa_sortWithdrawReceived.set('fa-sort');
        } else if (sort === "ascWithdrawSpent") {
            page_arr = sortBankTransactionData(reconData, 'spentVS1Amount', false);
            templateObject.fa_sortDepositSpent.set('fa-sort');
            templateObject.fa_sortDepositReceived.set('fa-sort');
            templateObject.fa_sortWithdrawSpent.set('fa-sort-asc');
            templateObject.fa_sortWithdrawReceived.set('fa-sort');
        } else if (sort === "descWithdrawSpent") {
            page_arr = sortBankTransactionData(reconData, 'spentVS1Amount', true);
            templateObject.fa_sortDepositSpent.set('fa-sort');
            templateObject.fa_sortDepositReceived.set('fa-sort');
            templateObject.fa_sortWithdrawSpent.set('fa-sort-desc');
            templateObject.fa_sortWithdrawReceived.set('fa-sort');
        } else if (sort === "ascWithdrawReceived") {
            page_arr = sortBankTransactionData(reconData, 'receivedVS1Amount', false);
            templateObject.fa_sortDepositSpent.set('fa-sort');
            templateObject.fa_sortDepositReceived.set('fa-sort');
            templateObject.fa_sortWithdrawSpent.set('fa-sort');
            templateObject.fa_sortWithdrawReceived.set('fa-sort-asc');
        } else if (sort === "descWithdrawReceived") {
            page_arr = sortBankTransactionData(reconData, 'receivedVS1Amount', true);
            templateObject.fa_sortDepositSpent.set('fa-sort');
            templateObject.fa_sortDepositReceived.set('fa-sort');
            templateObject.fa_sortWithdrawSpent.set('fa-sort');
            templateObject.fa_sortWithdrawReceived.set('fa-sort-desc');
        } else {
            page_arr = sortBankTransactionData(reconData, 'SortDate');
            templateObject.fa_sortDepositSpent.set('fa-sort');
            templateObject.fa_sortDepositReceived.set('fa-sort');
            templateObject.fa_sortWithdrawSpent.set('fa-sort');
            templateObject.fa_sortWithdrawReceived.set('fa-sort');
        }
        page_arr = page_arr.slice((page_number-1)*page_limit, page_number*page_limit);
        let thirdaryData = $.merge($.merge([], templateObject.bankTransactionData.get()), page_arr);
        templateObject.bankTransactionData.set(thirdaryData);
        if (templateObject.bankTransactionData.get().length > 0) {
            setTimeout(function() {
                defineTabpanelEvent();
            }, 500);
        }
    }
    function getYodleeAccountID(accountID) {
        let yodleeAccountID = 12187126;
        return yodleeAccountID;
    }
    function sortBankTransactionData(array, key, desc=true) {
        return array.sort(function(a, b) {
            let x = a[key];
            let y = b[key];
            if (key === 'SortDate') {
                x = new Date(x);
                y = new Date(y);
            }
            if (key === 'spentYodleeAmount' || key === 'receivedYodleeAmount' || key === 'spentVS1Amount' || key === 'receivedVS1Amount') {
                x = parseFloat(utilityService.substringMethod(x));
                y = parseFloat(utilityService.substringMethod(y));
            }
            if (!desc)
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            else
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

    templateObject.getOpenBalance = function(bankAccount) {
        reconService.getReconciliationBalance(bankAccount).then(function(data) {
            let openBal = 0;
            let dataArray = [];
            if (data.treconciliation.length) {
                for (let k = 0; k < data.treconciliation.length; k++ ) {
                    //if(data.treconciliation[k].CloseBalance > 0){
                    if (data.treconciliation[k].AccountName === bankAccount) {
                        // counter++;
                        let objData = {
                            Id: data.treconciliation[k].Id,
                            AccountName: data.treconciliation[k].AccountName,
                            CloseBalance: data.treconciliation[k].CloseBalance||0,
                            OpenBalance: data.treconciliation[k].OpenBalance||0,
                            OnHold: data.treconciliation[k].OnHold
                        };
                        dataArray.push(objData);
                        if (FlowRouter.current().queryParams.id) {} else {
                            if (data.treconciliation[k].OnHold === true) {
                                Session.setPersistent('bankaccountid', data.treconciliation[k].AccountID);
                                Session.setPersistent('bankaccountname', data.treconciliation[k].AccountName);
                            }
                        }
                    }
                }
                if (dataArray.length === 0) {
                    openBal = 0;
                } else {
                    for (let j in dataArray) {
                        if(dataArray[dataArray.length - 1].OnHold === true){
                            openBal = dataArray[dataArray.length - 1].OpenBalance;
                        }else{
                            openBal = dataArray[dataArray.length - 1].CloseBalance;
                        }
                    }
                }
                $('.vs1cloudBalance').text(utilityService.modifynegativeCurrencyFormat(openBal));
            } else {
                $('.vs1cloudBalance').text(utilityService.modifynegativeCurrencyFormat(openBal));

            }
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    };

    setTimeout(function () {
        templateObject.getAccountNames();
        templateObject.getAllTaxCodes();
        templateObject.getAllClients();
    }, 100);

    $('#bankAccountName').editableSelect();
    $('#bankAccountName').editableSelect().on('click.editable-select', function (e, li) {
        const $each = $(this);
        const offset = $each.offset();
        const accountDataName = e.target.value || '';
        selectedAccountFlag = 'ForBank';

        if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
            openBankAccountListModal();
        } else {
            if(accountDataName.replace(/\s/g, '') !== ''){
                getVS1Data('TAccountVS1').then(function (dataObject) {
                    if (dataObject.length === 0) {
                        setOneAccountByName(accountDataName);
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let added = false;
                        for (let a = 0; a < data.taccountvs1.length; a++) {
                            if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                                added = true;
                                setBankAccountData(data, a);
                            }
                        }
                        if(!added) {
                            setOneAccountByName(accountDataName);
                        }
                    }
                }).catch(function (err) {
                    setOneAccountByName(accountDataName);
                });
                $('#bankAccountListModal').modal('toggle');
            }else{
                openBankAccountListModal();
            }
        }
    });

    function openBankAccountListModal(){
        $('#selectLineID').val('');
        $('#bankAccountListModal').modal();
        setTimeout(function () {
            $('#tblAccount_filter .form-control-sm').focus();
            $('#tblAccount_filter .form-control-sm').val('');
            $('#tblAccount_filter .form-control-sm').trigger("input");
            var datatable = $('#tblAccountlist').DataTable();
            datatable.draw();
            $('#tblAccountlist_filter .form-control-sm').trigger("input");
        }, 500);
    }
    function setOneAccountByName(accountDataName) {
        accountService.getOneAccountByName(accountDataName).then(function (data) {
            setBankAccountData(data);
        }).catch(function (err) {
            $('.fullScreenSpin').css('display','none');
        });
    }
    function setBankAccountData(data, i = 0) {
        let fullAccountTypeName = '';
        $('#add-account-title').text('Edit Account Details');
        $('#edtAccountName').attr('readonly', true);
        $('#sltAccountType').attr('readonly', true);
        $('#sltAccountType').attr('disabled', 'disabled');
        const accountid = data.taccountvs1[i].fields.ID || '';
        const accounttype = fullAccountTypeName || data.taccountvs1[i].fields.AccountTypeName;
        const accountname = data.taccountvs1[i].fields.AccountName || '';
        const accountno = data.taccountvs1[i].fields.AccountNumber || '';
        const taxcode = data.taccountvs1[i].fields.TaxCode || '';
        const accountdesc = data.taccountvs1[i].fields.Description || '';
        const bankaccountname = data.taccountvs1[i].fields.BankAccountName || '';
        const bankbsb = data.taccountvs1[i].fields.BSB || '';
        const bankacountno = data.taccountvs1[i].fields.BankAccountNumber || '';
        const swiftCode = data.taccountvs1[i].fields.Extra || '';
        const routingNo = data.taccountvs1[i].fields.BankCode || '';
        const showTrans = data.taccountvs1[i].fields.IsHeader || false;
        const cardnumber = data.taccountvs1[i].fields.CarNumber || '';
        const cardcvc = data.taccountvs1[i].fields.CVC || '';
        const cardexpiry = data.taccountvs1[i].fields.ExpiryDate || '';

        if ((accounttype === "BANK")) {
            $('.isBankAccount').removeClass('isNotBankAccount');
            $('.isCreditAccount').addClass('isNotCreditAccount');
        }else if ((accounttype === "CCARD")) {
            $('.isCreditAccount').removeClass('isNotCreditAccount');
            $('.isBankAccount').addClass('isNotBankAccount');
        } else {
            $('.isBankAccount').addClass('isNotBankAccount');
            $('.isCreditAccount').addClass('isNotCreditAccount');
        }

        $('#edtAccountID').val(accountid);
        $('#sltAccountType').val(accounttype);
        $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
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

        if(showTrans === 'true'){
            $('.showOnTransactions').prop('checked', true);
        }else{
            $('.showOnTransactions').prop('checked', false);
        }

        setTimeout(function () {
            $('#addNewAccount').modal('show');
        }, 500);
    }

    function defineTabpanelEvent() {
        templateObject.bankTransactionData.get().forEach(function(item, index) {
            $('#ctaxRate_'+item.YodleeLineID).editableSelect();
            $('#ctaxRate_'+item.YodleeLineID).editableSelect().on("click.editable-select", function (e, li) {
                const $each = $(this);
                const offset = $each.offset();
                const taxRateDataName = e.target.value || "";
                selectedDepositID = item.YodleeLineID;
                selectedTaxFlag = 'ForTab';
                if (e.pageX > offset.left + $each.width() - 8) {
                    // X button 16px wide?
                    $("#taxRateListModal").modal("toggle");
                } else {
                    if (taxRateDataName.replace(/\s/g, "") !== "") {
                        $(".taxcodepopheader").text("Edit Tax Rate");
                        getVS1Data("TTaxcodeVS1").then(function (dataObject) {
                            if (dataObject.length === 0) {
                                setTaxCodeVS1(taxRateDataName);
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                $(".taxcodepopheader").text("Edit Tax Rate");
                                setTaxRateData(data, taxRateDataName);
                            }
                        }).catch(function (err) {
                            setTaxCodeVS1(taxRateDataName);
                        });
                    } else {
                        $("#taxRateListModal").modal("toggle");
                    }
                }
            });
            $('#what_'+item.YodleeLineID).editableSelect();
            $('#what_'+item.YodleeLineID).editableSelect().on('click.editable-select', function (e, li) {
                selectedDepositID = item.YodleeLineID;
                selectedCustomerFlag = 'ForTab';
                const $each = $(this);
                const offset = $each.offset();
                $('#edtCustomerPOPID').val('');
                //$('#edtCustomerCompany').attr('readonly', false);
                const customerDataName = e.target.value || '';
                if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
                    openCustomerModal();
                } else {
                    if (customerDataName.replace(/\s/g, '') !== '') {
                        //FlowRouter.go('/customerscard?name=' + e.target.value);
                        $('#edtCustomerPOPID').val('');
                        getVS1Data('TCustomerVS1').then(function (dataObject) {
                            if (dataObject.length === 0) {
                                setOneCustomerDataExByName(customerDataName);
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                let useData = data.tcustomervs1;
                                let added = false;
                                for (let i = 0; i < useData.length; i++) {
                                    if (useData[i].fields.ClientName === customerDataName) {
                                        setCustomerModal(useData[i]);
                                    }
                                }
                                if (!added) {
                                    setOneCustomerDataExByName(customerDataName);
                                }
                            }
                        }).catch(function (err) {
                            setOneCustomerDataExByName(customerDataName);
                        });
                    } else {
                        openCustomerModal();
                    }
                }

            });
            $('#transferAccount_'+item.YodleeLineID).editableSelect();
            $('#transferAccount_'+item.YodleeLineID).editableSelect().on('click.editable-select', function (e, li) {
                const $each = $(this);
                const offset = $each.offset();
                let accountDataName = e.target.value ||'';
                selectedAccountFlag = 'ForTransfer';
                selectedDepositID = item.YodleeLineID;
                if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
                    openBankAccountListModal();
                }else{
                    if(accountDataName.replace(/\s/g, '') !== ''){
                        getVS1Data('TAccountVS1').then(function (dataObject) {
                            if (dataObject.length === 0) {
                                setOneAccountByName(accountDataName);
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                let added = false;
                                for (let a = 0; a < data.taccountvs1.length; a++) {
                                    if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                                        added = true;
                                        setBankAccountData(data, a);
                                    }
                                }
                                if(!added) {
                                    setOneAccountByName(accountDataName);
                                }
                            }
                        }).catch(function (err) {
                            setOneAccountByName(accountDataName);
                        });
                        $('#addAccountModal').modal('toggle');
                    }else{
                        openBankAccountListModal();
                    }
                }
            });
            $('#btnAddDetail_'+item.YodleeLineID).on('click', function(e, li) {
                let who = $('#who_'+item.YodleeLineID).val();
                who = (who !== '')?who:item.YodleeDescription;
                let amount = item.YodleeAmount;
                let dateIn = item.SortDate;
                selectedYodleeID = item.YodleeLineID;
                $('#matchNav_'+item.YodleeLineID+' a.nav-link').addClass('active');
                $('#createNav_'+item.YodleeLineID+' a.nav-link').removeClass('active');
                $('#createNav_'+item.YodleeLineID).hide();
                $('#transferNav_'+item.YodleeLineID).hide();
                $('#discussNav_'+item.YodleeLineID+' a.nav-link').removeClass('active');
                $('#btnFindMatchNav_'+item.YodleeLineID).hide();
                $('#match_'+item.YodleeLineID).addClass('show');
                $('#match_'+item.YodleeLineID).addClass('active');
                $('#create_'+item.YodleeLineID).removeClass('show');
                $('#create_'+item.YodleeLineID).removeClass('active');
                $('#match_'+item.YodleeLineID+' .textFindMatch').show();
                $('#match_'+item.YodleeLineID+' .btnFindMatch').hide();
                $('#divLineDetail_'+item.YodleeLineID).show();
                setTransactionDetail(amount, dateIn, who, item.deporwith);
            });
            $('#btnFindMatch_'+item.YodleeLineID).on('click', function(e, li) {
                FlowRouter.go('/bankrecon?id='+item.YodleeLineID);
            });
            $('#btnMoreDetail_'+item.YodleeLineID).on('click', function(e, li) {
                $('#mdTransactionDate').text(item.YodleeTransactionDate);
                $('#mdCategory').text(item.YodleeCategory);
                $('#mdCategoryType').text(item.YodleeCategoryType);
                $('#mdDescription').text(item.YodleeDescription);
                $('#mdTransactionAmount').text(item.YodleeAmount);
                $('#mdTransactionType').text(item.YodleeBaseType);
                $('#mdChequeNo').text(item.YodleeCheckNumber);
                $('#mdType').text(item.YodleeType);
                $('#moreDetailModal').modal('show');
            });
            $('#btnDeleteLine_'+item.YodleeLineID).on('click', function(e, li) {
                $('#divLine_'+item.YodleeLineID).hide();
            });
        })
    }

    function setTransactionDetail(Amount, DateIn, Who, DepOrWith) {
        if (selectedYodleeID !== null) {
            let clientDetail = templateObject.clientrecords.get().filter(customer => {
                return customer.customername === $('#whatID_'+selectedYodleeID).val();
            });
            clientDetail = clientDetail[0];
            let discountAmount = (clientDetail !== undefined)? Amount*clientDetail.discount/100: 0;
            let taxCodeDetail = templateObject.taxraterecords.get().filter(taxcode => {
                return taxcode.codename === $('#ctaxRateID_'+selectedYodleeID).val();
            });
            taxCodeDetail = taxCodeDetail[0];
            let taxAmount = (taxCodeDetail !== undefined)?Amount*taxCodeDetail.coderate/100:0;
            selectedLineID = 'firstLine';
            // let basedataObj = {
            //     lineID: selectedLineID,
            //     product: '',
            //     description: $('#why_'+selectedYodleeID).val() || '',
            //     quantity: 1,
            //     unitPrice: utilityService.modifynegativeCurrencyFormat(Amount),
            //     unitPriceInc: utilityService.modifynegativeCurrencyFormat(parseFloat(Amount) + taxAmount),
            //     subtotal: utilityService.modifynegativeCurrencyFormat(Amount),
            //     account: (clientDetail !== undefined)? clientDetail.customername:'',
            //     discountPercent: utilityService.modifynegativeCurrencyFormat(discountAmount),
            //     taxrate: (taxCodeDetail !== undefined)? taxCodeDetail.codename:'',
            //     taxAmount: utilityService.modifynegativeCurrencyFormat(taxAmount),
            //     amount: parseFloat(Amount),
            //     totalAmount: utilityService.modifynegativeCurrencyFormat(parseFloat(Amount) - discountAmount),
            //     totalAmountInc: utilityService.modifynegativeCurrencyFormat(parseFloat(Amount) - discountAmount + taxAmount)
            // };
            let accountName = (clientDetail !== undefined)? clientDetail.customername:'';
            let taxrateName = (taxCodeDetail !== undefined)? taxCodeDetail.codename:'';

            $('#divLineDetail_'+selectedYodleeID+' #labelPaymentType').text(DepOrWith==='spent'?'Spent as':'Received as');
            $('#divLineDetail_'+selectedYodleeID+' #labelWho').text(DepOrWith==='spent'?'To':'From');
            $('#divLineDetail_'+selectedYodleeID+' #FromWho').val(Who);
            let dateIn_val = (DateIn !=='')? moment(DateIn).format("DD/MM/YYYY"): DateIn;
            $('#divLineDetail_'+selectedYodleeID+' #DateIn').val(dateIn_val);
            $('#divLineDetail_'+selectedYodleeID+' #TotalAmount').val(Amount);
            $('#divLineDetail_'+selectedYodleeID+' #textSORBottom').text(DepOrWith==='spent'?'spent - Spent':'received - Received');
            $('#divLineDetail_'+selectedYodleeID+' #totalBottom1').text(utilityService.modifynegativeCurrencyFormat(Amount));
            $('#divLineDetail_'+selectedYodleeID+' #totalBottom2').text(utilityService.modifynegativeCurrencyFormat(Amount));

            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineProductName').val('');
            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineProductDesc').val($('#why_'+selectedYodleeID).val());
            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineQty').val(1);
            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineUnitPrice').val(utilityService.modifynegativeCurrencyFormat(Amount));
            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineSubTotal').val(utilityService.modifynegativeCurrencyFormat(Amount));
            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineAccountName').val(accountName);
            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineDiscount').val(utilityService.modifynegativeCurrencyFormat(discountAmount));
            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineTaxRate').val(taxrateName);
            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineTaxAmount').val(utilityService.modifynegativeCurrencyFormat(taxAmount));
            $('#divLineDetail_'+selectedYodleeID+' #firstLine .lineAmount').val(utilityService.modifynegativeCurrencyFormat(parseFloat(Amount) - discountAmount));

            setTimeout(function () {
                setCalculated();
                $('#' + selectedLineID + " .btnRemove").hide();
            }, 1000);
        }
    }

    $(document).on("click", ".newbankrecon #tblAccount tbody tr", function(e) {
        $(".colAccountName").removeClass('boldtablealertsborder');
        $(".colAccount").removeClass('boldtablealertsborder');
        const table = $(this);
        let accountname = table.find(".productName").text();
        let accountId = table.find(".colAccountID").text();
        $('#bankAccountListModal').modal('toggle');
        if (selectedAccountFlag === 'ForBank') {
            $('#bankAccountName').val(accountname);
            $('#bankAccountID').val(accountId);
            if (accountId !== "") {
                bankaccountid = accountId;
                bankaccountname = accountname;
                if (bankaccountid !== Session.get('bankaccountid')) {
                    setTimeout(function () {
                        Session.setPersistent('bankaccountid', accountId);
                        Session.setPersistent('bankaccountname', accountname);
                        window.open('/newbankrecon', '_self');
                    }, 1000);
                }
            }
        } else if (selectedAccountFlag === 'ForTransfer') {
            if (accountId !== "") {
                $('#transferAccount_'+selectedDepositID).val(accountname);
            }
        }
        $('#tblAccount_filter .form-control-sm').val('');
    });
    $(document).on("click", "#tblCustomerlist tbody tr", function (e) {
        $('#customerListModal').modal('toggle');
        if (selectedCustomerFlag === "ForTab") {
            // $('#whatID_'+selectedDepositID).val(parseInt($(this).find(".colID").text()));
            $('#whatID_'+selectedDepositID).val($(this).find(".colCompany").text());
            $('#what_'+selectedDepositID).val($(this).find(".colCompany").text());
        } else {
            if (selectLineID) {
                let lineAccountName = $(this).find(".colCompany").text();
                $('#divLineDetail_'+selectedYodleeID+' #' + selectLineID + " .lineAccountName").val(lineAccountName);
            }
            setCalculated();
        }
    });
    $(document).on("click", "#tblTaxRate tbody tr", function (e) {
        $('#taxRateListModal').modal('toggle');
        if (selectedTaxFlag === "ForTab") {
            // $('#ctaxRateID_'+selectedDepositID).val(parseInt($(this).find(".sorting_1").text()));
            $('#ctaxRateID_' + selectedDepositID).val($(this).find(".taxName").text());
            $('#ctaxRate_' + selectedDepositID).val($(this).find(".taxName").text());
        } else {
            if (selectLineID) {
                let lineTaxRate = $(this).find(".taxRate").text();
                $('#divLineDetail_'+selectedYodleeID+' #' + selectLineID + " .lineTaxRate").val(lineTaxRate);
            }
            setCalculated();
        }
    });
    $(document).on("click", "#tblInventory tbody tr", function (e) {
        $(".colProductName").removeClass('boldtablealertsborder');
        const trow = $(this);
        if (selectedYodleeID && selectLineID) {
            let lineProductName = trow.find(".productName").text();
            let lineProductDesc = trow.find(".productDesc").val();
            let lineUnitPrice = trow.find(".salePrice").val();
            $('#divLineDetail_'+selectedYodleeID+' #' + selectLineID + " .lineProductName").val(lineProductName);
            $('#divLineDetail_'+selectedYodleeID+' #' + selectLineID + " .lineProductDesc").val(lineProductDesc);
            $('#divLineDetail_'+selectedYodleeID+' #' + selectLineID + " .lineQty").val(1);
            $('#divLineDetail_'+selectedYodleeID+' #' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);
            $('#productListModal').modal('toggle');
        }
        setCalculated();
    });

    $("#DateIn").datepicker({
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
    });

    function setCalculated() {
        let taxcodeList = templateObject.taxraterecords.get();
        let customerList = templateObject.clientrecords.get();
        setCalculated2(taxcodeList, customerList)
    }
});

Template.newbankrecon.events({
    'click .btnReconTransactionDetail': function() {
        FlowRouter.go('/recontransactiondetail');
        // window.open('/recontransactiondetail', '_self');
    },
    'click .btnPageStart': function() {
        let sort = Template.instance().sort_param.get();
        window.open('/newbankrecon?page=1'+sort, '_self');
    },
    'click .btnPageEnd': function() {
        let sort = (Template.instance().sort.get() !== '')?'&sort='+Template.instance().sort.get():'';
        window.open('/newbankrecon?page='+Template.instance().page_count.get()+sort, '_self');
    },
    'click .btnPagePrev': function() {
        let sort = (Template.instance().sort.get() !== '')?'&sort='+Template.instance().sort.get():'';
        let prev_page = (Template.instance().page_number.get() <= 1)? 1: parseInt(Template.instance().page_number.get()) - 1;
        window.open('/newbankrecon?page='+prev_page+sort, '_self');
    },
    'click .btnPageNext': function() {
        let sort = (Template.instance().sort.get() !== '')?'&sort='+Template.instance().sort.get():'';
        let next_page = (Template.instance().page_number.get() >= Template.instance().page_count.get())? Template.instance().page_count.get(): parseInt(Template.instance().page_number.get()) + 1;
        window.open('/newbankrecon?page='+next_page+sort, '_self');
    },
    'click .sortDepositSpent': function() {
        let sort = '';
        if (Template.instance().sort.get() === "descDepositSpent") {
            sort = "ascDepositSpent";
        } else {
            sort = "descDepositSpent";
        }
        window.open('/newbankrecon?sort='+sort, '_self');
    },
    'click .sortDepositReceived': function() {
        let sort = '';
        if (Template.instance().sort.get() === "descDepositReceived") {
            sort = "ascDepositReceived";
        } else {
            sort = "descDepositReceived";
        }
        window.open('/newbankrecon?sort='+sort, '_self');
    },
    'click .sortWithdrawSpent': function() {
        let sort = '';
        if (Template.instance().sort.get() === "descWithdrawSpent") {
            sort = "ascWithdrawSpent";
        } else {
            sort = "descWithdrawSpent";
        }
        window.open('/newbankrecon?sort='+sort, '_self');
    },
    'click .sortWithdrawReceived': function() {
        let sort = '';
        if (Template.instance().sort.get() === "descWithdrawReceived") {
            sort = "ascWithdrawReceived";
        } else {
            sort = "descWithdrawReceived";
        }
        window.open('/newbankrecon?sort='+sort, '_self');
    },
    'click .lineProductName, keydown .lineProductName': function (event) {
        selectedLineID = $(event.target).closest('tr').attr('id');
        const $each = $(event.currentTarget);
        const offset = $each.offset();
        $("#selectProductID").val('');
        const productDataName = $(event.target).val() || '';
        if (event.pageX > offset.left + $each.width() - 10) { // X button 16px wide?
            openProductListModal();
        } else {
            if (productDataName.replace(/\s/g, '') !== '') {
                $('.fullScreenSpin').css('display', 'inline-block');
                getVS1Data('TProductVS1').then(function (dataObject) {
                    if (dataObject.length === 0) {
                        setOneProductDataByName(productDataName);
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let added = false;
                        for (let i = 0; i < data.tproductvs1.length; i++) {
                            if (data.tproductvs1[i].fields.ProductName === productDataName) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                setProductNewModal(data.tproductvs1[i]);
                                setTimeout(function () {
                                    $('#newProductModal').modal('show');
                                }, 500);
                            }
                        }
                        if (!added) {
                            setOneProductDataByName(productDataName);
                        }
                    }
                }).catch(function (err) {
                    setOneProductDataByName(productDataName);
                });
                setTimeout(function () {
                    // WangYan: where are these element - dtDateTo, dtDateFrom
                    $("#dtDateTo").datepicker({
                        showOn: 'button',
                        buttonText: 'Show Date',
                        buttonImageOnly: true,
                        buttonImage: '/img/imgCal2.png',
                        constrainInput: false,
                        dateFormat: 'd/mm/yy',
                        showOtherMonths: true,
                        selectOtherMonths: true,
                        changeMonth: true,
                        changeYear: true,
                        yearRange: "-90:+10",
                    }).keyup(function (e) {
                        if (e.keyCode === 8 || e.keyCode === 46) {
                            $("#dtDateTo,#dtDateFrom").val('');
                        }
                    });

                    $("#dtDateFrom").datepicker({
                        showOn: 'button',
                        buttonText: 'Show Date',
                        altField: "#dtDateFrom",
                        buttonImageOnly: true,
                        buttonImage: '/img/imgCal2.png',
                        constrainInput: false,
                        dateFormat: 'd/mm/yy',
                        showOtherMonths: true,
                        selectOtherMonths: true,
                        changeMonth: true,
                        changeYear: true,
                        yearRange: "-90:+10",
                    }).keyup(function (e) {
                        if (e.keyCode === 8 || e.keyCode === 46) {
                            $("#dtDateTo,#dtDateFrom").val('');
                        }
                    });

                    $(".ui-datepicker .ui-state-hihglight").removeClass("ui-state-highlight");

                }, 1000);
            } else {
                openProductListModal();
            }
        }
    },
    'click .lineAccountName, keydown .lineAccountName': function (event) {
        selectedCustomerFlag = "ForDetail";
        selectedLineID = $(event.target).closest('tr').attr('id');
        const $each = $(event.currentTarget);
        const offset = $each.offset();
        $('#edtCustomerPOPID').val('');
        //$('#edtCustomerCompany').attr('readonly', false);
        const customerDataName = event.target.value || '';
        if (event.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
            openCustomerModal();
        } else {
            if (customerDataName.replace(/\s/g, '') !== '') {
                //FlowRouter.go('/customerscard?name=' + e.target.value);
                $('#edtCustomerPOPID').val('');
                getVS1Data('TCustomerVS1').then(function (dataObject) {
                    if (dataObject.length === 0) {
                        setOneCustomerDataExByName(customerDataName);
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tcustomervs1;
                        let added = false;
                        for (let i = 0; i < useData.length; i++) {
                            if (useData[i].fields.ClientName === customerDataName) {
                                setCustomerModal(useData[i]);
                            }
                        }
                        if (!added) {
                            setOneCustomerDataExByName(customerDataName);
                        }
                    }
                }).catch(function (err) {
                    setOneCustomerDataExByName(customerDataName);
                });
            } else {
                openCustomerModal();
            }
        }
    },
    'click .lineTaxRate, keydown .lineTaxRate': function (event) {
        selectedTaxFlag = "ForDetail";
        selectedLineID = $(event.target).closest('tr').attr('id');
        const $each = $(event.currentTarget);
        const offset = $each.offset();
        const taxRateDataName = event.target.value || "";
        if (event.pageX > offset.left + $each.width() - 8) {
            // X button 16px wide?
            $("#taxRateListModal").modal("toggle");
        } else {
            if (taxRateDataName.replace(/\s/g, "") !== "") {
                $(".taxcodepopheader").text("Edit Tax Rate");
                getVS1Data("TTaxcodeVS1").then(function (dataObject) {
                    if (dataObject.length === 0) {
                        setTaxCodeVS1(taxRateDataName);
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        $(".taxcodepopheader").text("Edit Tax Rate");
                        setTaxRateData(data, taxRateDataName);
                    }
                }).catch(function (err) {
                    setTaxCodeVS1(taxRateDataName);
                });
            } else {
                $("#taxRateListModal").modal("toggle");
            }
        }
    },
    'keydown .lineQty, keydown .lineUnitPrice': function (event) {
        selectedLineID = $(event.target).closest('tr').attr('id');
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            return;
        }
        if (event.shiftKey === true) {
            event.preventDefault();
        }
        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode === 8 || event.keyCode === 9 ||
            event.keyCode === 37 || event.keyCode === 39 ||
            event.keyCode === 46 || event.keyCode === 190 || event.keyCode === 189 || event.keyCode === 109) {

        }
        else {
            event.preventDefault();
        }
    },
    'change .lineQty': function (event) {
        selectedLineID = $(event.target).closest('tr').attr('id');
        const templateObject = Template.instance();
        let qty = parseInt($(event.target).val()) || 0;
        $(event.target).val(qty);
        let taxcodeList = templateObject.taxraterecords.get();
        let customerList = templateObject.clientrecords.get();
        setCalculated2(taxcodeList, customerList);
    },
    'change .lineUnitPrice': function (event) {
        selectedLineID = $(event.target).closest('tr').attr('id');
        const templateObject = Template.instance();
        let inputUnitPrice = 0;
        if (!isNaN($(event.target).val())) {
            inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        }
        let taxcodeList = templateObject.taxraterecords.get();
        let customerList = templateObject.clientrecords.get();
        setCalculated2(taxcodeList, customerList);
    },
    'click .btnRemove': function (event) {
        selectedLineID = null;
        let templateObject = Template.instance();
        $(event.target).closest('tr').remove();
        event.preventDefault();
        let taxcodeList = templateObject.taxraterecords.get();
        let customerList = templateObject.clientrecords.get();
        setCalculated2(taxcodeList, customerList);
    },
    'click #btnCancel': function() {
        selectedYodleeID = null;
        $('match_'+selectedYodleeID+' .textFindMatch').hide();
        $('match_'+selectedYodleeID+' .btnFindMatch').show();
        $('#divLineDetail_'+selectedYodleeID).hide();
    },
    'click #addLine': function() {
        if (selectedYodleeID) {
            const rowData = $("#divLineDetail_"+selectedYodleeID+" #tblrecontransactiondetail tbody>tr:last").clone(true);
            let tokenid = Random.id();
            $(".lineProductName", rowData).val("");
            $(".lineProductDesc", rowData).val("");
            $(".lineQty", rowData).val("");
            $(".lineAccountName", rowData).val("");
            $(".lineUnitPrice", rowData).val("");
            $(".lineAmount", rowData).text("");
            $(".lineSubTotal", rowData).text("");
            $(".lineTaxRate", rowData).val("");
            $(".lineTaxAmount", rowData).text("");
            $(".lineDiscount", rowData).text("");
            $(".btnRemove", rowData).show();
            rowData.attr('id', tokenid);
            $("#divLineDetail_"+selectedYodleeID+" #tblrecontransactiondetail tbody").append(rowData);
            setTimeout(function () {
                $("#divLineDetail_"+selectedYodleeID+" #" + tokenid + " .lineProductName").trigger('click');
            }, 200);
        }
    },
    'click #btnSave': function (event) {
        let match_total = parseFloat($("#TotalAmount").val());
        let grand_total =  Number($(".grand_total").text().replace(/[^0-9.-]+/g, "")) || 0;
        if (match_total !== grand_total) {
            swal('The totals do not match.', '', 'error');
            $("#TotalAmount").focus();
            return false;
        }
        let reconType = "";
        if (DepOrWith === "spent") {
            reconType = "TReconciliationDepositLines";
        } else if (DepOrWith === "received") {
            reconType = "TReconciliationWithdrawalLines";
        } else {
            return false;
        }
        $('.fullScreenSpin').css('display', 'inline-block');
        let lineItems = [];
        let lineItemsObj = {};
        $('#tblrecontransactiondetail > tbody > tr').each(function () {
            let lineID = this.id;
            let lineProductDesc = $('#' + lineID + " .lineProductDesc").val();
            let lineAccountName = $('#' + lineID + " .lineAccountName").val();
            let lineAmount = $('#' + lineID + " .lineAmount").text();
            lineAmount = Number(lineAmount.replace(/[^0-9.-]+/g, "")) || 0;
            let refText = $('#reference').val();

            let dateIn = $("#DateIn").val() || '';
            let splitwithdepositdate = dateIn.split("/");
            let withYear = splitwithdepositdate[2];
            let withMonth = splitwithdepositdate[1];
            let withDay = splitwithdepositdate[0];
            let formatWithDate = withYear + "-" + withMonth + "-" + withDay;

            lineItemsObj = {
                type: reconType,
                fields: {
                    AccountName: BankAccountName || '',
                    Amount: lineAmount,
                    BankStatementLineID: 0, //Hardcoded for now
                    ClientName: lineAccountName || '',
                    DepositDate: formatWithDate + " 00:00:00" || '',
                    Deposited: true,
                    DepositLineID: parseInt(YodleeID) || 0,
                    Notes: lineProductDesc || '',
                    Payee: lineAccountName || '',
                    PaymentID: parseInt(PaymentID) || 0,
                    // Reconciled: true,
                    Reconciled: false,
                    Reference: refText || ''
                }
            };
            lineItems.push(lineItemsObj);
        });

        // Pulling initial variables BEGIN
        let deptname = "Default"; //Set to Default as it isn't used for recons
        let employeename = Session.get('mySessionEmployee');
        const notes = ''; //pending addition of notes field
        const openbalance = 0;
        let closebalance = 0;
        const statementno = '';
        let recondate = DateIn;
        // Pulling initial variables END

        let objDetails = {};
        if (DepOrWith === "spent") {
            objDetails = {
                type: "TReconciliation",
                fields: {
                    // ID: parseInt(YodleeID) || 0,
                    AccountName: BankAccountName || '',
                    CloseBalance: closebalance,
                    Deleted: false,
                    DepositLines: lineItems || '',
                    DeptName: deptname || '',
                    EmployeeName: employeename || '',
                    Finished: false,
                    Notes: notes || '',
                    OnHold: true,
                    OpenBalance: openbalance,
                    ReconciliationDate: recondate,
                    StatementNo: statementno || '0',
                    WithdrawalLines: ''
                }
            };

        } else {
            objDetails = {
                type: "TReconciliation",
                fields: {
                    // ID: parseInt(YodleeID) || 0,
                    AccountName: BankAccountName || '',
                    CloseBalance: closebalance,
                    Deleted: false,
                    DepositLines: '',
                    DeptName: deptname || '',
                    EmployeeName: employeename || '',
                    Finished: false,
                    Notes: notes || '',
                    OnHold: true,
                    OpenBalance: openbalance,
                    ReconciliationDate: recondate,
                    StatementNo: statementno || '0',
                    WithdrawalLines: lineItems || ''
                }
            };
        }
        reconService.saveReconciliation(objDetails).then(function(data) {
            FlowRouter.go('/newbankrecon');
        }).catch(function(err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                else if (result.dismiss === 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        });
    },
});

Template.newbankrecon.helpers({
    accountnamerecords: () => {
        return Template.instance().accountnamerecords.get().sort(function(a, b) {
            if (a.accountname === 'NA') {
                return 1;
            } else if (b.accountname === 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    taxraterecords: () => {
        return Template.instance()
            .taxraterecords.get()
            .sort(function (a, b) {
                if (a.description === "NA") {
                    return 1;
                } else if (b.description === "NA") {
                    return -1;
                }
                return a.description.toUpperCase() > b.description.toUpperCase()
                    ? 1
                    : -1;
            });
    },
    bankTransactionData: () => {
        return Template.instance().bankTransactionData.get();
    },
    lastTransactionDate: () => {
        return Template.instance().lastTransactionDate.get();
    },
    page_number: () => {
        return Template.instance().page_number.get();
    },
    page_total: () => {
        return Template.instance().page_total.get();
    },
    page_count: () => {
        return Template.instance().page_count.get();
    },
    page_list: () => {
        return Template.instance().page_list.get();
    },
    sort: () => {
        return Template.instance().sort.get();
    },
    sort_param: () => {
        return Template.instance().sort_param.get();
    },
    fa_sortDepositSpent: () => {
        return Template.instance().fa_sortDepositSpent.get();
    },
    fa_sortDepositReceived: () => {
        return Template.instance().fa_sortDepositReceived.get();
    },
    fa_sortWithdrawSpent: () => {
        return Template.instance().fa_sortWithdrawSpent.get();
    },
    fa_sortWithdrawReceived: () => {
        return Template.instance().fa_sortWithdrawReceived.get();
    },
    baselinedata : () => {
        return Template.instance().baselinedata.get();
    },
});

function openProductListModal() {
    $('#productListModal').modal('toggle');
    setTimeout(function () {
        $('#tblInventory_filter .form-control-sm').focus();
        $('#tblInventory_filter .form-control-sm').val('');
        $('#tblInventory_filter .form-control-sm').trigger("input");
        const datatable = $('#tblInventory').DataTable();
        datatable.draw();
        $('#tblInventory_filter .form-control-sm').trigger("input");
    }, 500);
}
function setOneProductDataByName(productDataName) {
    sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
        $('.fullScreenSpin').css('display', 'none');
        setProductNewModal(data.tproduct[0]);
        setTimeout(function () {
            $('#newProductModal').modal('show');
        }, 500);
    }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
    });
}
function setProductNewModal(productInfo) {
    let lineItems = [];
    let lineItemObj = {};
    let currencySymbol = Currency;
    let totalquantity = 0;
    let productname = productInfo.fields.ProductName || '';
    let productcode = productInfo.fields.PRODUCTCODE || '';
    let productprintName = productInfo.fields.ProductPrintName || '';
    let assetaccount = productInfo.fields.AssetAccount || '';
    let buyqty1cost = utilityService.modifynegativeCurrencyFormat(productInfo.fields.BuyQty1Cost) || 0;
    let cogsaccount = productInfo.fields.CogsAccount || '';
    let taxcodepurchase = productInfo.fields.TaxCodePurchase || '';
    let purchasedescription = productInfo.fields.PurchaseDescription || '';
    let sellqty1price = utilityService.modifynegativeCurrencyFormat(productInfo.fields.SellQty1Price) || 0;
    let incomeaccount = productInfo.fields.IncomeAccount || '';
    let taxcodesales = productInfo.fields.TaxCodeSales || '';
    let salesdescription = productInfo.fields.SalesDescription || '';
    let active = productInfo.fields.Active;
    let lockextrasell = productInfo.fields.LockExtraSell || '';
    let customfield1 = productInfo.fields.CUSTFLD1 || '';
    let customfield2 = productInfo.fields.CUSTFLD2 || '';
    let barcode = productInfo.fields.BARCODE || '';
    $("#selectProductID").val(productInfo.fields.ID).trigger("change");
    $('#add-product-title').text('Edit Product');
    $('#edtproductname').val(productname);
    $('#edtsellqty1price').val(sellqty1price);
    $('#txasalesdescription').val(salesdescription);
    $('#sltsalesacount').val(incomeaccount);
    $('#slttaxcodesales').val(taxcodesales);
    $('#edtbarcode').val(barcode);
    $('#txapurchasedescription').val(purchasedescription);
    $('#sltcogsaccount').val(cogsaccount);
    $('#slttaxcodepurchase').val(taxcodepurchase);
    $('#edtbuyqty1cost').val(buyqty1cost);
}

function openCustomerModal() {
    $('#customerListModal').modal();
    setTimeout(function () {
        $('#tblCustomerlist_filter .form-control-sm').focus();
        $('#tblCustomerlist_filter .form-control-sm').val('');
        $('#tblCustomerlist_filter .form-control-sm').trigger("input");
        const datatable = $('#tblCustomerlist').DataTable();
        //datatable.clear();
        //datatable.rows.add(splashArrayCustomerList);
        datatable.draw();
        $('#tblCustomerlist_filter .form-control-sm').trigger("input");
        //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
    }, 500);
}
function setOneCustomerDataExByName(customerDataName) {
    $('.fullScreenSpin').css('display', 'inline-block');
    sideBarService.getOneCustomerDataExByName(customerDataName).then(function (data) {
        $('.fullScreenSpin').css('display', 'none');
        setCustomerModal(data.tcustomer[0]);
    }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
    });
}
function setCustomerModal(data) {
    $('.fullScreenSpin').css('display', 'none');
    let lineItems = [];
    $('#add-customer-title').text('Edit Customer');
    let popCustomerID = data.fields.ID || '';
    let popCustomerName = data.fields.ClientName || '';
    let popCustomerEmail = data.fields.Email || '';
    let popCustomerTitle = data.fields.Title || '';
    let popCustomerFirstName = data.fields.FirstName || '';
    let popCustomerMiddleName = data.fields.CUSTFLD10 || '';
    let popCustomerLastName = data.fields.LastName || '';
    let popCustomertfn = '' || '';
    let popCustomerPhone = data.fields.Phone || '';
    let popCustomerMobile = data.fields.Mobile || '';
    let popCustomerFaxnumber = data.fields.Faxnumber || '';
    let popCustomerSkypeName = data.fields.SkypeName || '';
    let popCustomerURL = data.fields.URL || '';
    let popCustomerStreet = data.fields.Street || '';
    let popCustomerStreet2 = data.fields.Street2 || '';
    let popCustomerState = data.fields.State || '';
    let popCustomerPostcode = data.fields.Postcode || '';
    let popCustomerCountry = data.fields.Country || LoggedCountry;
    let popCustomerbillingaddress = data.fields.BillStreet || '';
    let popCustomerbcity = data.fields.BillStreet2 || '';
    let popCustomerbstate = data.fields.BillState || '';
    let popCustomerbpostalcode = data.fields.BillPostcode || '';
    let popCustomerbcountry = data.fields.Billcountry || LoggedCountry;
    let popCustomercustfield1 = data.fields.CUSTFLD1 || '';
    let popCustomercustfield2 = data.fields.CUSTFLD2 || '';
    let popCustomercustfield3 = data.fields.CUSTFLD3 || '';
    let popCustomercustfield4 = data.fields.CUSTFLD4 || '';
    let popCustomernotes = data.fields.Notes || '';
    let popCustomerpreferedpayment = data.fields.PaymentMethodName || '';
    let popCustomerterms = data.fields.TermsName || '';
    let popCustomerdeliverymethod = data.fields.ShippingMethodName || '';
    let popCustomeraccountnumber = data.fields.ClientNo || '';
    let popCustomerisContractor = data.fields.Contractor || false;
    let popCustomerissupplier = data.fields.IsSupplier || false;
    let popCustomeriscustomer = data.fields.IsCustomer || false;
    let popCustomerTaxCode = data.fields.TaxCodeName || '';
    let popCustomerDiscount = data.fields.Discount || 0;
    let popCustomerType = data.fields.ClientTypeName || '';
    //$('#edtCustomerCompany').attr('readonly', true);
    $('#edtCustomerCompany').val(popCustomerName);
    $('#edtCustomerPOPID').val(popCustomerID);
    $('#edtCustomerPOPEmail').val(popCustomerEmail);
    $('#edtTitle').val(popCustomerTitle);
    $('#edtFirstName').val(popCustomerFirstName);
    $('#edtMiddleName').val(popCustomerMiddleName);
    $('#edtLastName').val(popCustomerLastName);
    $('#edtCustomerPhone').val(popCustomerPhone);
    $('#edtCustomerMobile').val(popCustomerMobile);
    $('#edtCustomerFax').val(popCustomerFaxnumber);
    $('#edtCustomerSkypeID').val(popCustomerSkypeName);
    $('#edtCustomerWebsite').val(popCustomerURL);
    $('#edtCustomerShippingAddress').val(popCustomerStreet);
    $('#edtCustomerShippingCity').val(popCustomerStreet2);
    $('#edtCustomerShippingState').val(popCustomerState);
    $('#edtCustomerShippingZIP').val(popCustomerPostcode);
    $('#sedtCountry').val(popCustomerCountry);
    $('#txaNotes').val(popCustomernotes);
    $('#sltPreferedPayment').val(popCustomerpreferedpayment);
    $('#sltTermsPOP').val(popCustomerterms);
    $('#sltCustomerType').val(popCustomerType);
    $('#edtCustomerCardDiscount').val(popCustomerDiscount);
    $('#edtCustomeField1').val(popCustomercustfield1);
    $('#edtCustomeField2').val(popCustomercustfield2);
    $('#edtCustomeField3').val(popCustomercustfield3);
    $('#edtCustomeField4').val(popCustomercustfield4);

    $('#sltTaxCode').val(popCustomerTaxCode);

    if ((data.fields.Street === data.fields.BillStreet) && (data.fields.Street2 === data.fields.BillStreet2) &&
        (data.fields.State === data.fields.BillState) && (data.fields.Postcode === data.fields.BillPostcode) &&
        (data.fields.Country === data.fields.Billcountry)) {
        $('#chkSameAsShipping2').attr("checked", "checked");
    }

    if (data.fields.IsSupplier === true) {
        // $('#isformcontractor')
        $('#chkSameAsSupplier').attr("checked", "checked");
    } else {
        $('#chkSameAsSupplier').removeAttr("checked");
    }

    setTimeout(function () {
        $('#addCustomerModal').modal('show');
    }, 200);
}

function setTaxCodeVS1(taxRateDataName) {
    purchaseService.getTaxCodesVS1().then(function (data) {
        setTaxRateData(data, taxRateDataName);
    }).catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
        $(".fullScreenSpin").css("display", "none");
        // Meteor._reload.reload();
    });
}
function setTaxRateData(data, taxRateDataName) {
    let lineItems = [];
    let lineItemObj = {};
    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
        if (data.ttaxcodevs1[i].CodeName === taxRateDataName) {
            $("#edtTaxNamePop").attr("readonly", true);
            let taxRate = (
                data.ttaxcodevs1[i].Rate * 100
            ).toFixed(2);
            const taxRateID = data.ttaxcodevs1[i].Id || "";
            const taxRateName = data.ttaxcodevs1[i].CodeName || "";
            const taxRateDesc = data.ttaxcodevs1[i].Description || "";
            $("#edtTaxID").val(taxRateID);
            $("#edtTaxNamePop").val(taxRateName);
            $("#edtTaxRatePop").val(taxRate);
            $("#edtTaxDescPop").val(taxRateDesc);
            setTimeout(function () {
                $("#newTaxRateModal").modal("toggle");
            }, 100);
        }
    }
}

function setCalculated2(taxcodeList, customerList) {
    let $tblrows = $('#divLineDetail_'+selectedYodleeID+' #tblrecontransactiondetail tbody tr');
    let lineAmount = 0;
    let subTotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;
    let grandTotal = 0;
    if (selectedYodleeID && selectedLineID) {
        let lineQty = parseInt($('#divLineDetail_'+selectedYodleeID+' #' + selectedLineID + ' .lineQty').val());
        let lineUnitPrice = $('#divLineDetail_'+selectedYodleeID+' #' + selectedLineID + ' .lineUnitPrice').val();
        lineUnitPrice = Number(lineUnitPrice.replace(/[^0-9.-]+/g, "")) || 0;
        $('#divLineDetail_'+selectedYodleeID+' #' + selectedLineID + " .lineSubTotal").text(utilityService.modifynegativeCurrencyFormat(lineQty * lineUnitPrice));
        let lineTaxRate = $('#divLineDetail_'+selectedYodleeID+' #' + selectedLineID + " .lineTaxRate").val();
        let lineTaxRateVal = 0;
        if (lineTaxRate !== "") {
            for (let i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename === lineTaxRate) {
                    lineTaxRateVal = taxcodeList[i].coderate;
                }
            }
        }
        // let lineUnitPriceInc = lineUnitPrice + lineUnitPrice * lineTaxRateVal /100;
        // $('#' + selectedLineID + " .lineUnitPriceInc").text(utilityService.modifynegativeCurrencyFormat(lineUnitPriceInc));
        let lineTaxAmount = lineQty * lineUnitPrice * lineTaxRateVal /100;
        $('#divLineDetail_'+selectedYodleeID+' #' + selectedLineID + " .lineTaxAmount").text(utilityService.modifynegativeCurrencyFormat(lineTaxAmount));
        let lineAccountName = $('#divLineDetail_'+selectedYodleeID+' #' + selectedLineID + " .lineAccountName").val();
        let lineDiscountRate = 0;
        if (lineAccountName !== "") {
            let customerDetail = customerList.filter(customer => {
                return customer.customername === lineAccountName
            });
            customerDetail = customerDetail[0];
            lineDiscountRate = customerDetail.discount;
        }
        let lineDiscount = (lineQty * lineUnitPrice + lineTaxAmount) * lineDiscountRate/100;
        $('#divLineDetail_'+selectedYodleeID+' #' + selectedLineID + " .lineDiscount").text(utilityService.modifynegativeCurrencyFormat(lineDiscount));
        lineAmount = lineQty * lineUnitPrice + lineTaxAmount - lineDiscount;
        $('#divLineDetail_'+selectedYodleeID+' #' + selectedLineID + " .lineAmount").text(utilityService.modifynegativeCurrencyFormat(lineAmount));
    }

    $tblrows.each(function (index) {
        const $tblrow = $(this);
        let lineSubTotal = $tblrow.find(".lineSubTotal").text();
        lineSubTotal = Number(lineSubTotal.replace(/[^0-9.-]+/g, "")) || 0;
        let lineTaxAmount = $tblrow.find(".lineTaxAmount").text();
        lineTaxAmount = Number(lineTaxAmount.replace(/[^0-9.-]+/g, "")) || 0;
        let lineDiscount = $tblrow.find(".lineDiscount").text();
        lineDiscount = Number(lineDiscount.replace(/[^0-9.-]+/g, "")) || 0;
        let lineAmount = $tblrow.find(".lineAmount").text();
        lineAmount = Number(lineAmount.replace(/[^0-9.-]+/g, "")) || 0;

        subTotal += lineSubTotal;
        taxTotal += lineTaxAmount;
        discountTotal += lineDiscount;
        grandTotal += lineAmount;
    });
    $(".sub_total").text(utilityService.modifynegativeCurrencyFormat(subTotal));
    $(".tax_total").text(utilityService.modifynegativeCurrencyFormat(taxTotal));
    $(".discount_total").text(utilityService.modifynegativeCurrencyFormat(discountTotal));
    $(".grand_total").text(utilityService.modifynegativeCurrencyFormat(grandTotal));
}

// function connectYodlee() {
//     let fastLinkURL = "https://fl4.sandbox.yodlee.com/authenticate/restserver/fastlink"; // Fastlink URL
//
//
//     // let fastLinkConfigName = urlvalue.searchParams.get("fastlinkconfigname");
//     yodleeService.getAccessToken(user_name, client_id, secret).then(function(data) {
//         let access_token = data.token.accessToken;
//     }).catch(function (err) {
//         return null;
//     });
//     // (function (window) {
//     //     //Open FastLink
//     //    // window.fastlink.open({
//     //         //     fastLinkURL: fastLinkURL,
//     //         //     accessToken: 'Bearer ' + data.token.accessToken,
//     //         //     params: {
//     //         //         configName: 'Verification'
//     //         //     },
//     //         //     onSuccess: function (data) {
//     //         //         // will be called on success. For list of possible message, refer to onSuccess(data) Method.
//     //         //         console.log(data);
//     //         //         //window.alert(JSON.data.sites[0]);
//     //         //         //window.alert(JSON.data.sites[1]);
//     //         //
//     //         //     },
//     //         //     onError: function (data) {
//     //         //         // will be called on error. For list of possible message, refer to onError(data) Method.
//     //         //         console.log(data);
//     //         //     },
//     //         //     onClose: function (data) {
//     //         //         // will be called called to close FastLink. For list of possible message, refer to onClose(data) Method.
//     //         //         //window.alert(JSON.stringify(data));
//     //         //         console.log(data);
//     //         //         //window.fastlink.close();
//     //         //
//     //         //     },
//     //         //     onEvent: function (data) {
//     //         //         // will be called on intermittent status update.
//     //         //         console.log(data);
//     //         //     }
//     //         // },
//     //         // 'container-fastlink');
//     //     // let fastLinkConfigName = urlvalue.searchParams.get("fastlinkconfigname");
//     // }(window));
// }
// function getYodleeTransactionData(token) {
//     yodleeService.getAccessToken(user_name, client_id, secret).then(function(data) {
//         let access_token = data.token.accessToken;
//         yodleeService.getTransactionData(access_token, '2021-08-01').then(function(data) {
//             return data;
//         }).catch(function(err) {
//             return null;
//         });
//     }).catch(function (err) {
//         return null;
//     });
// }
