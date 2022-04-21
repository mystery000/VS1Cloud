import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { ReconService } from "./recon-service";
import { UtilityService } from "../utility-service";
import '../lib/global/erp-objects';
import XLSX from 'xlsx';
import 'jquery-editable-select';
import { AccountService } from "../accounts/account-service";
import { ProductService } from "../product/product-service";
let utilityService = new UtilityService();

Template.newbankrecon.onCreated(function() {
    const templateObject = Template.instance();

    templateObject.accountnamerecords = new ReactiveVar();
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

    setTimeout(function() {
        $(document).ready(function() {


        });

    }, 500);
});

Template.newbankrecon.onRendered(function() {

    const templateObject = Template.instance();
    let reconService = new ReconService();
    let productService = new ProductService();

    let page_number = (FlowRouter.current().queryParams.page !== undefined && parseInt(FlowRouter.current().queryParams.page) > 0)?FlowRouter.current().queryParams.page:1;
    templateObject.page_number.set(page_number);
    templateObject.sort.set((FlowRouter.current().queryParams.sort !== undefined && FlowRouter.current().queryParams.sort !== '')?FlowRouter.current().queryParams.sort:'');
    templateObject.sort_param.set((Template.instance().sort.get() !== '')?'&sort='+Template.instance().sort.get():'');
    let page_limit = 10;
    let page_total = 0;

    const taxCodesList = [];
    const accountTypeList = [];
    var splashArrayTaxRateList = [];
    let accountnamerecords = [];

    let bankaccountid = Session.get('bankaccountid') || '';
    let bankaccountname = Session.get('bankaccountname') || '';
    let statementDate = localStorage.getItem('statementdate')|| '';
    let selectedAccountFlag = '';

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
                    templateObject.getBankTransactionData(bankaccountid, statementDate, false);
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

    templateObject.getBankTransactionData = function (accountId, statementDate, ignoreDate) {
        let reconData = [];
        ignoreDate = true;
        $('.fullScreenSpin').css('display', 'inline-block');
        reconService.getToBeReconciledDeposit(accountId, statementDate, ignoreDate).then(function(data) {
            if (data.ttobereconcileddeposit.length > 0) {
                for (let i = 0; i < data.ttobereconcileddeposit.length; i++ ) {
                    let depositamount = data.ttobereconcileddeposit[i].Amount;
                    let reconciledepositObj = {
                        SortDate: data.ttobereconcileddeposit[i].DepositDate !== '' ? moment(data.ttobereconcileddeposit[i].DepositDate).format("YYYY-MM-DD") : data.ttobereconcileddeposit[i].DepositDate,
                        ReconDate: data.ttobereconcileddeposit[i].DepositDate !== '' ? moment(data.ttobereconcileddeposit[i].DepositDate).format("DD/MM/YYYY") : data.ttobereconcileddeposit[i].DepositDate,
                        CompanyName: data.ttobereconcileddeposit[i].CompanyName || ' ',
                        PaymentType: data.ttobereconcileddeposit[i].Notes || ' ',
                        Amount: depositamount,
                        DepositID: data.ttobereconcileddeposit[i].DepositID || ' ',
                        ReferenceNo: data.ttobereconcileddeposit[i].ReferenceNo || ' ',
                        Seqno: data.ttobereconcileddeposit[i].Seqno || 0,
                        PaymentID: data.ttobereconcileddeposit[i].PaymentID || 0,
                        DepositLineID: data.ttobereconcileddeposit[i].DepositLineID || 0,
                        CusID: data.ttobereconcileddeposit[i].CusID || 0,
                        StatementLineID: data.ttobereconcileddeposit[i].StatementLineID || 0,
                        StatementTransactionDate: data.ttobereconcileddeposit[i].StatementTransactionDate !== '' ? moment(data.ttobereconcileddeposit[i].StatementTransactionDate).format("DD/MM/YYYY") : data.ttobereconcileddeposit[i].StatementTransactionDate,
                        StatementAmount: data.ttobereconcileddeposit[i].StatementAmount || 0.00,
                        StatementDescription: data.ttobereconcileddeposit[i].StatementDescription || ' ',
                        deporwith: 'spent',
                        matched: data.ttobereconcileddeposit[i].Amount === data.ttobereconcileddeposit[i].StatementAmount,
                        spentDepositAmount: utilityService.modifynegativeCurrencyFormat(data.ttobereconcileddeposit[i].StatementAmount),
                        receivedDepositAmount: utilityService.modifynegativeCurrencyFormat(0),
                        spentWithdrawAmount: utilityService.modifynegativeCurrencyFormat(depositamount),
                        receivedWithdrawAmount: utilityService.modifynegativeCurrencyFormat(0),
                    };
                    if (data.ttobereconcileddeposit[i].Seqno !== 0) {
                        reconData.push(reconciledepositObj);
                    }
                }
            }
            reconService.getToBeReconciledWithdrawal(accountId, statementDate, ignoreDate).then(function(data) {
                if (data.ttobereconciledwithdrawal.length > 0) {
                    for (let j = 0; j < data.ttobereconciledwithdrawal.length; j++ ) {
                        let withdrawalamount = data.ttobereconciledwithdrawal[j].Amount;
                        let reconcilewithdrawalObj = {
                            SortDate: data.ttobereconciledwithdrawal[j].DepositDate !== '' ? moment(data.ttobereconciledwithdrawal[j].DepositDate).format("YYYY-MM-DD") : data.ttobereconciledwithdrawal[i].DepositDate,
                            ReconDate: data.ttobereconciledwithdrawal[j].DepositDate !== '' ? moment(data.ttobereconciledwithdrawal[j].DepositDate).format("DD/MM/YYYY") : data.ttobereconciledwithdrawal[j].DepositDate,
                            CompanyName: data.ttobereconciledwithdrawal[j].CompanyName || ' ',
                            PaymentType: data.ttobereconciledwithdrawal[j].Notes || ' ',
                            Amount: withdrawalamount,
                            DepositID: data.ttobereconciledwithdrawal[j].DepositID || ' ',
                            ReferenceNo: data.ttobereconciledwithdrawal[j].ReferenceNo || ' ',
                            Seqno: data.ttobereconciledwithdrawal[j].Seqno || 0,
                            PaymentID: data.ttobereconciledwithdrawal[j].PaymentID || 0,
                            DepositLineID: data.ttobereconciledwithdrawal[j].DepositLineID || 0,
                            CusID: data.ttobereconciledwithdrawal[j].CusID || 0,
                            StatementLineID: data.ttobereconciledwithdrawal[j].StatementLineID || 0,
                            StatementTransactionDate: data.ttobereconciledwithdrawal[j].StatementTransactionDate !== '' ? moment(data.ttobereconciledwithdrawal[j].StatementTransactionDate).format("DD/MM/YYYY") : data.ttobereconciledwithdrawal[j].StatementTransactionDate,
                            StatementAmount: data.ttobereconciledwithdrawal[j].StatementAmount || 0.00,
                            StatementDescription: data.ttobereconciledwithdrawal[j].StatementDescription || ' ',
                            deporwith: 'received',
                            matched: data.ttobereconciledwithdrawal[j].Amount === data.ttobereconciledwithdrawal[j].StatementAmount,
                            spentDepositAmount: utilityService.modifynegativeCurrencyFormat(0),
                            receivedDepositAmount: utilityService.modifynegativeCurrencyFormat(data.ttobereconciledwithdrawal[j].StatementAmount),
                            spentWithdrawAmount: utilityService.modifynegativeCurrencyFormat(0),
                            receivedWithdrawAmount: utilityService.modifynegativeCurrencyFormat(withdrawalamount),
                        };
                        if (data.ttobereconciledwithdrawal[j].Seqno !== 0) {
                            reconData.push(reconcilewithdrawalObj);
                        }
                    }
                    page_total = reconData.length;
                    templateObject.page_total.set(page_total);
                    let page_cnt = Math.ceil(page_total/page_limit);
                    templateObject.page_count.set(page_cnt);
                    let page_list = Array.from({length: page_cnt}, (_, i) => i + 1);
                    templateObject.page_list.set(page_list);
                    let page_arr = [];
                    let sort = templateObject.sort.get();
                    if (sort === "ascDepositSpent") {
                        page_arr = sortBankTransactionData(reconData, 'spentDepositAmount', false);
                        templateObject.fa_sortDepositSpent.set('fa-sort-asc');
                        templateObject.fa_sortDepositReceived.set('fa-sort');
                        templateObject.fa_sortWithdrawSpent.set('fa-sort');
                        templateObject.fa_sortWithdrawReceived.set('fa-sort');
                    } else if (sort === "descDepositSpent") {
                        page_arr = sortBankTransactionData(reconData, 'spentDepositAmount', true);
                        templateObject.fa_sortDepositSpent.set('fa-sort-desc');
                        templateObject.fa_sortDepositReceived.set('fa-sort');
                        templateObject.fa_sortWithdrawSpent.set('fa-sort');
                        templateObject.fa_sortWithdrawReceived.set('fa-sort');
                    } else if (sort === "ascDepositReceived") {
                        page_arr = sortBankTransactionData(reconData, 'receivedDepositAmount', false);
                        templateObject.fa_sortDepositSpent.set('fa-sort');
                        templateObject.fa_sortDepositReceived.set('fa-sort-asc');
                        templateObject.fa_sortWithdrawSpent.set('fa-sort');
                        templateObject.fa_sortWithdrawReceived.set('fa-sort');
                    } else if (sort === "descDepositReceived") {
                        page_arr = sortBankTransactionData(reconData, 'receivedDepositAmount', true);
                        templateObject.fa_sortDepositSpent.set('fa-sort');
                        templateObject.fa_sortDepositReceived.set('fa-sort-desc');
                        templateObject.fa_sortWithdrawSpent.set('fa-sort');
                        templateObject.fa_sortWithdrawReceived.set('fa-sort');
                    } else if (sort === "ascWithdrawSpent") {
                        page_arr = sortBankTransactionData(reconData, 'spentWithdrawAmount', false);
                        templateObject.fa_sortDepositSpent.set('fa-sort');
                        templateObject.fa_sortDepositReceived.set('fa-sort');
                        templateObject.fa_sortWithdrawSpent.set('fa-sort-asc');
                        templateObject.fa_sortWithdrawReceived.set('fa-sort');
                    } else if (sort === "descWithdrawSpent") {
                        page_arr = sortBankTransactionData(reconData, 'spentWithdrawAmount', true);
                        templateObject.fa_sortDepositSpent.set('fa-sort');
                        templateObject.fa_sortDepositReceived.set('fa-sort');
                        templateObject.fa_sortWithdrawSpent.set('fa-sort-desc');
                        templateObject.fa_sortWithdrawReceived.set('fa-sort');
                    } else if (sort === "ascWithdrawReceived") {
                        page_arr = sortBankTransactionData(reconData, 'receivedWithdrawAmount', false);
                        templateObject.fa_sortDepositSpent.set('fa-sort');
                        templateObject.fa_sortDepositReceived.set('fa-sort');
                        templateObject.fa_sortWithdrawSpent.set('fa-sort');
                        templateObject.fa_sortWithdrawReceived.set('fa-sort-asc');
                    } else if (sort === "descWithdrawReceived") {
                        page_arr = sortBankTransactionData(reconData, 'receivedWithdrawAmount', true);
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
                    defineTabpanelEvent();
                }
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });

            if (templateObject.bankTransactionData.get()) {
                setTimeout(function() {
                }, 0);
            } else {
                setTimeout(function() {
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);
            }
            $('.fullScreenSpin').css('display', 'none');
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    };

    function sortBankTransactionData(array, key, desc=true) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            if (key === 'SortDate') {
                x = new Date(x);
                y = new Date(y);
            }
            if (key === 'spentDepositAmount' || key === 'receivedDepositAmount' || key === 'spentWithdrawAmount' || key === 'receivedWithdrawAmount') {
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
            var counter = 0;
            var openBal = 0;
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
                        // openBal = data.treconciliation[data.treconciliation.length - 1].CloseBalance;
                    }
                    //}
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
                $('.openingbalance').val(utilityService.modifynegativeCurrencyFormat(openBal) || 0);
                $('.vs1cloudBalance').text(utilityService.modifynegativeCurrencyFormat(openBal) || 0);
            } else {
                $('.openingbalance').val(Currency + '0');
                $('.vs1cloudBalance').text(Currency + '0');

            }
            // $('#openingbalance2').val(utilityService.modifynegativeCurrencyFormat(openBal));
        }).catch(function(err) {
            $('.openingbalance').val(Currency + '0');
            $('.fullScreenSpin').css('display', 'none');
        });
    };

    setTimeout(function () {
        templateObject.getAccountNames();
        templateObject.getAllTaxCodes();
    }, 500);

    $('#bankAccountName').editableSelect();
    $('#bankAccountName').editableSelect().on('click.editable-select', function (e, li) {
        var $each = $(this);
        var offset = $each.offset();
        let accountService = new AccountService();
        var accountDataName = e.target.value ||'';
        selectedAccountFlag = 'ForBank';

        if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
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
        } else {
            if(accountDataName.replace(/\s/g, '') !== ''){
                getVS1Data('TAccountVS1').then(function (dataObject) {
                    if (dataObject.length === 0) {
                        accountService.getOneAccountByName(accountDataName).then(function (data) {
                            setBankAccountData(data);
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display','none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        var added=false;
                        for (let a = 0; a < data.taccountvs1.length; a++) {
                            if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                                added = true;
                                setBankAccountData(data, a);
                            }
                        }
                        if(!added) {
                            accountService.getOneAccountByName(accountDataName).then(function (data) {
                                setBankAccountData(data);
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display','none');
                            });
                        }
                    }
                }).catch(function (err) {
                    accountService.getOneAccountByName(accountDataName).then(function (data) {
                        setBankAccountData(data);
                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display','none');
                    });
                });
                $('#bankAccountListModal').modal('toggle');
            }else{
                $('#selectLineID').val('');
                $('#bankAccountListModal').modal();
                setTimeout(function () {
                    $('#tblAccount_filter .form-control-sm').focus();
                    $('#tblAccount_filter .form-control-sm').val('');
                    $('#tblAccount_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblSupplierlist').DataTable();
                    datatable.draw();
                    $('#tblAccount_filter .form-control-sm').trigger("input");
                }, 500);
            }
        }
    });
    function setBankAccountData(data, i = 0) {
        let fullAccountTypeName = '';
        $('#add-account-title').text('Edit Account Details');
        $('#edtAccountName').attr('readonly', true);
        $('#sltAccountType').attr('readonly', true);
        $('#sltAccountType').attr('disabled', 'disabled');
        if (accountTypeList) {
            for (var h = 0; h < accountTypeList.length; h++) {
                if (data.taccountvs1[i].fields.AccountTypeName === accountTypeList[h].accounttypename) {
                    fullAccountTypeName = accountTypeList[h].description || '';
                }
            }
        }
        var accountid = data.taccountvs1[i].fields.ID || '';
        var accounttype = fullAccountTypeName || data.taccountvs1[i].fields.AccountTypeName;
        var accountname = data.taccountvs1[i].fields.AccountName || '';
        var accountno = data.taccountvs1[i].fields.AccountNumber || '';
        var taxcode = data.taccountvs1[i].fields.TaxCode || '';
        var accountdesc = data.taccountvs1[i].fields.Description || '';
        var bankaccountname = data.taccountvs1[i].fields.BankAccountName || '';
        var bankbsb = data.taccountvs1[i].fields.BSB || '';
        var bankacountno = data.taccountvs1[i].fields.BankAccountNumber || '';

        var swiftCode = data.taccountvs1[i].fields.Extra || '';
        var routingNo = data.taccountvs1[i].fields.BankCode || '';

        var showTrans = data.taccountvs1[i].fields.IsHeader || false;

        var cardnumber = data.taccountvs1[i].fields.CarNumber || '';
        var cardcvc = data.taccountvs1[i].fields.CVC || '';
        var cardexpiry = data.taccountvs1[i].fields.ExpiryDate || '';

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

    function setTaxRateData(data) {
        let lineItems = [];
        let lineItemObj = {};
        for (let i = 0; i < data.ttaxcodevs1.length; i++) {
            if (data.ttaxcodevs1[i].CodeName === taxRateDataName) {
                $("#edtTaxNamePop").attr("readonly", true);
                let taxRate = (
                    data.ttaxcodevs1[i].Rate * 100
                ).toFixed(2);
                var taxRateID = data.ttaxcodevs1[i].Id || "";
                var taxRateName = data.ttaxcodevs1[i].CodeName || "";
                var taxRateDesc =
                    data.ttaxcodevs1[i].Description || "";
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

    function defineTabpanelEvent() {
        templateObject.bankTransactionData.get().forEach(function(item, index) {
            
            $('#ctaxRate_'+item.DepositLineID).editableSelect();
            $('#ctaxRate_'+item.DepositLineID).editableSelect().on("click.editable-select", function (e, li) {
                var $each = $(this);
                var taxSelected = "sales";
                var offset = $each.offset();
                var taxRateDataName = e.target.value || "";
                if (e.pageX > offset.left + $each.width() - 8) {
                    // X button 16px wide?
                    $("#taxRateListModal").modal("toggle");
                } else {
                    if (taxRateDataName.replace(/\s/g, "") !== "") {
                        $(".taxcodepopheader").text("Edit Tax Rate");
                        getVS1Data("TTaxcodeVS1").then(function (dataObject) {
                            if (dataObject.length === 0) {
                                purchaseService.getTaxCodesVS1().then(function (data) {
                                    setTaxRateData(data);
                                })
                                    .catch(function (err) {
                                        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                                        $(".fullScreenSpin").css("display", "none");
                                        // Meteor._reload.reload();
                                    });
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                $(".taxcodepopheader").text("Edit Tax Rate");
                                setTaxRateData(data);
                            }
                        })
                            .catch(function (err) {
                                purchaseService.getTaxCodesVS1().then(function (data) {
                                    setTaxRateData(data);
                                })
                                    .catch(function (err) {
                                        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                                        $(".fullScreenSpin").css("display", "none");
                                        // Meteor._reload.reload();
                                    });
                            });
                    } else {
                        $("#taxRateListModal").modal("toggle");
                    }
                }
            });
            $('#what_'+item.DepositLineID).editableSelect();
            $('#what_'+item.DepositLineID).editableSelect().on('click.editable-select', function (e, li) {
                var $each = $(this);
                console.log('what_'+item.DepositLineID);
                var offset = $each.offset();
                let accountService = new AccountService();
                var accountDataName = e.target.value ||'';
                selectedAccountFlag = 'ForTransaction';

                if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
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
                }else{
                    if(accountDataName.replace(/\s/g, '') !== ''){
                        getVS1Data('TAccountVS1').then(function (dataObject) {
                            if (dataObject.length === 0) {
                                accountService.getOneAccountByName(accountDataName).then(function (data) {
                                    setBankAccountData(data);
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display','none');
                                });
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                var added=false;
                                for (let a = 0; a < data.taccountvs1.length; a++) {
                                    if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                                        added = true;
                                        setBankAccountData(data, a);
                                    }
                                }
                                if(!added) {
                                    accountService.getOneAccountByName(accountDataName).then(function (data) {
                                        setBankAccountData(data);
                                    }).catch(function (err) {
                                        $('.fullScreenSpin').css('display','none');
                                    });
                                }
                            }
                        }).catch(function (err) {
                            accountService.getOneAccountByName(accountDataName).then(function (data) {
                                setBankAccountData(data);
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display','none');
                            });
                        });
                        $('#addAccountModal').modal('toggle');
                    }else{
                        $('#selectLineID').val('');
                        $('#bankAccountListModal').modal();
                        setTimeout(function () {
                            $('#tblAccount_filter .form-control-sm').focus();
                            $('#tblAccount_filter .form-control-sm').val('');
                            $('#tblAccount_filter .form-control-sm').trigger("input");
                            var datatable = $('#tblSupplierlist').DataTable();
                            datatable.draw();
                            $('#tblAccount_filter .form-control-sm').trigger("input");
                        }, 500);
                    }
                }
            });
        })
    }

    $(document).on("click", ".newbankrecon #tblAccount tbody tr", function(e) {
        $(".colAccountName").removeClass('boldtablealertsborder');
        $(".colAccount").removeClass('boldtablealertsborder');
        var table = $(this);
        if (selectedAccountFlag === 'ForBank') {
            let accountname = table.find(".productName").text();
            let accountId = table.find(".colAccountID").text();
            $('#bankAccountListModal').modal('toggle');
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
            } else {

            }
        } else if (selectedAccountFlag === 'ForTransaction') {
            let selectLineID = $('#selectLineID').val();
            let $tblrows = $("#tblDepositEntryLine tbody tr");
            if(selectLineID){
                let lineProductName = table.find(".productName").text();
                let lineProductDesc = table.find(".productDesc").text();
                let lineAccoutNo = table.find(".accountnumber").text();

                $('#'+selectLineID+" .lineAccountName").val(lineProductName);
                $('#transactionAccountListModal').modal('toggle');

                $(".colAccount").removeClass('boldtablealertsborder');
            }else{
                let accountname = table.find(".productName").text();
                $('#transactionAccountListModal').modal('toggle');
                $('#transactionAccountName').val(accountname);
                if($tblrows.find(".lineAccountName").val() === ''){
                    $tblrows.find(".colAccount").addClass('boldtablealertsborder');
                }
            }
        }

        $('#tblAccount_filter .form-control-sm').val('');
        // setTimeout(function () {
        //     $('.btnRefreshAccount').trigger('click');
        //     $('.fullScreenSpin').css('display', 'none');
        // }, 1000);
    });

    $(document).on("click", "#tblTaxRate tbody tr", function (e) {
        let selectedTaxRateDropdownID = $('#selectLineID').val() || 'transactionTaxRate';
        $('#'+selectedTaxRateDropdownID+'').val($(this).find(".taxName").text());
        $('#taxRateListModal').modal('toggle');
    });
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
        let prev_page = (Template.instance().page_number.get() <= 1)? 1: Template.instance().page_number.get() - 1;
        window.open('/newbankrecon?page='+prev_page+sort, '_self');
    },
    'click .btnPageNext': function() {
        let sort = (Template.instance().sort.get() !== '')?'&sort='+Template.instance().sort.get():'';
        let next_page = (Template.instance().page_number.get() >= Template.instance().page_count.get())? Template.instance().page_count.get(): Template.instance().page_number.get() + 1;
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
    }
});
