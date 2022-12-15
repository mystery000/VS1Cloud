import { ReactiveVar } from 'meteor/reactive-var';
import '../lib/global/erp-objects';
import '../lib/global/indexdbstorage.js';
import 'jquery-editable-select';
import { bankNameList } from "../lib/global/bank-names";
import { AccountService } from "../accounts/account-service";

let accountService = new AccountService();

function openBankAccountListModal(){
    $('#bankAccountListModal').modal();
    setTimeout(function () {
        $('#tblAccount_filter .form-control-sm').focus();
        $('#tblAccount_filter .form-control-sm').val('');
        $('#tblAccount_filter .form-control-sm').trigger("input");
        const datatable = $('#tblAccountlist').DataTable();
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

    if ((accounttype == "BANK")) {
        $('.isBankAccount').removeClass('isNotBankAccount');
        $('.isCreditAccount').addClass('isNotCreditAccount');
    }else if ((accounttype == "CCARD")) {
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

    if(showTrans == 'true'){
        $('.showOnTransactions').prop('checked', true);
    }else{
        $('.showOnTransactions').prop('checked', false);
    }

    setTimeout(function () {
        $('#addNewAccount').modal('show');
    }, 500);
}

Template.newbankrule.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.bankRuleData = new ReactiveVar([]);
    templateObject.bankNames = new ReactiveVar([]);
});

Template.newbankrule.onRendered(function() {
    const templateObject = Template.instance();
    templateObject.bankNames.set(bankNameList);
    templateObject.bankRuleData.set([]);
    $('#sltBankAccount').editableSelect();
    $('#sltBankAccount').editableSelect().on('click.editable-select', function (e, li) {
        const $each = $(this);
        const offset = $each.offset();
        let accountDataName = e.target.value ||'';
        if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
            openBankAccountListModal();
        }else{
            if(accountDataName.replace(/\s/g, '') != ''){
                getVS1Data('TAccountVS1').then(function (dataObject) {
                    if (dataObject.length == 0) {
                        setOneAccountByName(accountDataName);
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let added = false;
                        for (let a = 0; a < data.taccountvs1.length; a++) {
                            if((data.taccountvs1[a].fields.AccountName) == accountDataName){
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

    $(document).on("click", ".newbankrule #tblAccount tbody tr", function(e) {
        $(".colAccountName").removeClass('boldtablealertsborder');
        $(".colAccount").removeClass('boldtablealertsborder');
        const table = $(this);
        let accountname = table.find(".productName").text();
        let accountId = table.find(".colAccountID").text();
        $('#bankAccountListModal').modal('toggle');
        $('#sltBankAccount').val(accountname);
        $('#sltBankAccountID').val(accountId);
        $('#tblAccount_filter .form-control-sm').val('');
    });
});

Template.newbankrule.events({
    'change .lineColumn': function (event) {
        let dataId = $(event.currentTarget).data('id');
        let tmp = Template.instance().bankRuleData.get();
        tmp[dataId].column = $(event.currentTarget).val();
        Template.instance().bankRuleData.set(tmp);
    },
    'blur .lineOrder': function (event) {
        let dataId = $(event.currentTarget).data('id');
        let tmp = Template.instance().bankRuleData.get();
        let tmpValue = $(event.currentTarget).val();
        if (tmpValue > 0 && tmpValue <= tmp.length) {
            for (let index = 0; index < tmp.length; index++) {
                if (tmp[index].order == tmpValue) {
                    tmp[index].order = tmp[dataId].order
                    tmp[dataId].order = tmpValue
                    break
                }
            }
            tmp[dataId].order = tmpValue
        } else {
            $(event.currentTarget).val(tmp[dataId].order)
        }
        Template.instance().bankRuleData.set(tmp);
    },
    'click .btnRemove': function (event) {
        event.preventDefault();
        let dataId = $(event.currentTarget).data('id');
        let tmp = Template.instance().bankRuleData.get()
        tmp.splice(dataId, 1);
        Template.instance().bankRuleData.set(tmp);
    },
    'click #addLineColumn': function() {
        let noDataLine = null;
        noDataLine = $("#tblBankRule tbody #noData");
        if (noDataLine != null) {
            noDataLine.remove();
        }
        let a = Template.instance().bankRuleData.get()
        a.push({order: a.length + 1, column: ""})
        Template.instance().bankRuleData.set(a)
    },

    'click .btnSave': function (event) {
        playSaveAudio();
        setTimeout(function(){
            let tmp = Template.instance().bankRuleData.get()
            if (tmp.length === 0) {
                swal('Please add columns', '', 'error');
            } else {
                swal({
                    title: 'Bank Rule Successfully Saved',
                    text: "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                })
            }
        }, delayTimeAfterSound);
    },
});

Template.newbankrule.helpers({
    bankRuleData : () => {
        return Template.instance().bankRuleData.get();
    },
    bankNames: () => {
        return Template.instance()
          .bankNames.get()
          .sort(function (a, b) {
            return a.name > b.name ? 1 : -1;
          });
    },
    orderNumber: (val) => val + 1,
 });

