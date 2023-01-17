import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { SideBarService } from '../../../js/sidebar-service'

import { AccountService } from "../../../accounts/account-service";
import { FixedAssetService } from '../../fixedasset-service';
import './fixedassetcard.html';
import { template } from 'lodash';

let sideBarService = new SideBarService();
let accountService = new AccountService();
let fixedassetSercie = new FixedAssetService();

Template.fixedassetcard.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.current_account_type = new ReactiveVar('');

  templateObject.allAcounts = new ReactiveVar([]);
  templateObject.edtDepreciationType = new ReactiveVar(0);

  templateObject.edtCostAssetAccount = new ReactiveVar(0);
  templateObject.editBankAccount = new ReactiveVar(0);
  templateObject.edtDepreciationAssetAccount = new ReactiveVar(0);
  templateObject.edtDepreciationExpenseAccount = new ReactiveVar(0);

  templateObject.chkEnterAmount = new ReactiveVar();
  templateObject.chkEnterAmount.set(true);

  templateObject.getAllAccountss = function() {
    getVS1Data('TAccountVS1').then(function(dataObject) {
        if (dataObject.length === 0) {
          sideBarService.getAccountListVS1().then(function(data) {
            setAccounts(data.taccountvs1);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          setAccounts(data.taccountvs1);
        }
    }).catch(function(err) {
        sideBarService.getAccountListVS1().then(function(data) {
          setAccounts(data.taccountvs1);
        });
    });
  };
  templateObject.getAllAccountss();

  function setAccounts(data) {
    let records = [];
    for (let i = 0; i < data.length; i++) {
      var dataList = {
        id: data[i].fields.ID || '',
        accountName: data[i].fields.AccountName || '-',
        description: data[i].fields.Description || '',
        accountNumber: data[i].fields.AccountNumber || '',
        accountTypeName: data[i].fields.AccountTypeName || '',
        accountTaxCode: data[i].fields.TaxCode || '',
        isHeader: data[i].fields.IsHeader || false,
      };
      records.push(dataList);
    }
    templateObject.allAcounts.set(records);
    templateObject.allAcounts.get().forEach((account) => {
      $('#edtCostAssetAccount').editableSelect('add', function(){
        $(this).val(account.id);
        $(this).text(account.accountName);
      });
      $('#editBankAccount').editableSelect('add', function(){
        $(this).val(account.id);
        $(this).text(account.accountName);
      });
      $('#edtDepreciationAssetAccount').editableSelect('add', function(){
        $(this).val(account.id);
        $(this).text(account.accountName);
      });
      $('#edtDepreciationExpenseAccount').editableSelect('add', function(){
        $(this).val(account.id);
        $(this).text(account.accountName);
      });
    });
  }


});

Template.fixedassetcard.onRendered(function () {
  const templateObject = Template.instance();
  $('#edtAssetType').editableSelect();
  $('#edtAssetType').editableSelect().on('click.editable-select', function (e, li) {
    $('#selectLineID').val('sltJobTerms');
    const $each = $(this);
    const offset = $each.offset();
    const assetTypeName = e.target.value || '';
    // editableAssetType(e, $each, offset, assetTypeName);
    $('#fixedAssetTypeListModal').modal('toggle');
  });
  
  // $('#edtBoughtFrom').editableSelect();
  // $('#edtDepartment').editableSelect();
  $('#edtDepreciationType').editableSelect();
  $('#edtCostAssetAccount').editableSelect();
  $('#editBankAccount').editableSelect();
  $('#edtDepreciationAssetAccount').editableSelect();
  $('#edtDepreciationExpenseAccount').editableSelect();

  $('#edtDepreciationType').editableSelect()
    .on('select.editable-select', function (e, li) {
      if (li) {
        templateObject.edtDepreciationType.set(parseInt(li.val() || 0));
      }
    });

  $('#edtCostAssetAccount').editableSelect()
    .on('select.editable-select', function (e, li) {
      if (li) {
        templateObject.edtCostAssetAccount.set(parseInt(li.val() || 0));
      }
    });

  $('#editBankAccount').editableSelect()
    .on('select.editable-select', function (e, li) {
      if (li) {
        templateObject.editBankAccount.set(parseInt(li.val() || 0));
      }
    });

  $('#edtDepreciationAssetAccount').editableSelect()
    .on('select.editable-select', function (e, li) {
      if (li) {
        templateObject.edtDepreciationAssetAccount.set(parseInt(li.val() || 0));
      }
    });
    
  $('#edtDepreciationExpenseAccount').editableSelect()
    .on('select.editable-select', function (e, li) {
      if (li) {
        templateObject.edtDepreciationExpenseAccount.set(parseInt(li.val() || 0));
      }
    });

  $("#date-input,#edtDateofPurchase, #edtDateRegisterRenewal, #edtDepreciationStartDate").datepicker({
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

  $(document).on("click", "#tblAccount tbody tr", function(e) {
    // $(".colAccountName").removeClass('boldtablealertsborder');
    let selectLineID = $('#selectLineID').val();
    let accountId = $(this).find('td.colAccountID').html();
    let accountName = $(this).find('td.productName').html();
    // let taxcodeList = templateObject.taxraterecords.get();
    templateObject[templateObject.current_account_type.get()].set(accountName);
    var table = $(this);
    $("input#"+templateObject.current_account_type.get()).val(accountName);

    $('#accountListModal').modal('toggle');
  });
  $(document).on("click", "#tblFixedassettypelist tbody tr", function(e) {
    $('input#edtAssetType').val($(this).find('td.AssetName').html());
    $('#fixedAssetTypeListModal').modal('hide');
  });
});
Template.fixedassetcard.events({
  "click button.btnSave": function() {
    const templateObject = Template.instance();
    let newFixedAsset = {
      "type":"TFixedAssets",
      "fields":{
        AssetCode: $('input#edtAssetCode').val(),
        AssetName: $('input#edtAssetName').val(),
        Description: $('input#edtAssetDescription').val(),
        AssetType: $('input#edtAssetType').val(),
        BrandName: $('input#edtBrand').val(),
        Model: $('input#edtModel').val(), //
        CUSTFLD1: $('input#edtNumber').val(), // Number
        CUSTFLD2: $('input#edtRegistrationNo').val(), // RegistrationNo
        CUSTFLD3: $('input#edtType').val(), // Type
        CUSTFLD4: $('input#edtCapacityWeight').val(), // CapacityWeight
        CUSTFLD5: $('input#edtCapacityVolume').val(), // CapacityVolumn
        CUSTDATE1: getDateStr($("#edtDateRegisterRenewal").datepicker("getDate")), // RegisterRenewal Date
        DepreciationStartDate: getDateStr($("#edtDepreciationStartDate").datepicker("getDate")), // DateRenewal Date
        PurchDate: getDateStr($("#edtDateofPurchase").datepicker("getDate")), //
        PurchCost: parseInt($('input#edtPurchCost').val()) || 0, //
        // SupplierID: $('input#edtModel').val(), //
        // InsuranceInfo: $('input#edtInsuranceInfo').val(), //

        // -----------------Depreciation Information
        DepreciationOption: templateObject.edtDepreciationType.get(), //Depreciation Type
        FixedAssetCostAccountID: templateObject.edtCostAssetAccount.get(),
  
        CUSTFLD6: templateObject.editBankAccount.get().toString(), // FixedAssetBankAccountID: , //ClearingAccountID
        FixedAssetDepreciationAccountID: templateObject.edtDepreciationAssetAccount.get(), //FixedAssetDepreciationExpenseAccountID
        FixedAssetDepreciationAssetAccountID: templateObject.edtDepreciationExpenseAccount.get(),
        Salvage: parseInt($('input#edtSalvageValue').val()) || 0,
        SalvageType: parseInt($('select#edtSalvageValueType').val()) || 0,
        life: parseInt($('input#edtAssetLife').val()) || 0,
        BusinessUsePercent: parseInt($('input#edtBusinessUse').val()) || 0,
        Active: true
      }
    };

    function getDateStr(dateVal) {
      if (!dateVal)
        return '';
      const dateObj = new Date(dateVal);
      var hh = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
      var min = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
      var ss = dateObj.getSeconds() < 10 ? "0" + dateObj.getSeconds() : dateObj.getSeconds();
      return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate() + " " + hh + ":" + min + ":" + ss;
    };

    fixedassetSercie.saveTFixedAsset(newFixedAsset).then((data) => {
      fixedassetSercie.getTFixedAssetsList().then(function (data) {
        addVS1Data('TFixedAssets', JSON.stringify(data));
      }).catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
      });
    })
    .catch((err) => {
      // console.log(err);
    });
  },
  "click button.btnBack": function() {
    FlowRouter.go('/fixedassetsoverview');
  },
  'change select#edtCostAssetAccount': function(event) {
    Template.instance().edtCostAssetAccount.set(event.target.value);
  },
  'change select#editBankAccount': function(event) {
    Template.instance().editBankAccount.set(event.target.value);
  },
  'change select#edtDepreciationAssetAccount': function(event) {
    Template.instance().edtDepreciationAssetAccount.set(event.target.value);
  },
  'change select#dtDepreciationExpenseAccount': function(event) {
    Template.instance().dtDepreciationExpenseAccount.set(event.target.value);
  },
  'change input#chkEnterAmount': function(e) {
    const templateObject = Template.instance();
    const status = templateObject.chkEnterAmount.get();
    templateObject.chkEnterAmount.set(!status);
  },
});

Template.fixedassetcard.helpers({
  chkEnterAmount: () => {
    return Template.instance().chkEnterAmount.get();
  },
  edtCostAssetAccount: () => {
    return Template.instance().allAcounts.get();
  },
  editBankAccount: () => {
    return Template.instance().allAcounts.get().filter(account => account.accountTypeName.toLowerCase() == 'bank');
  },
  edtDepreciationAssetAccount: () => {
    return Template.instance().allAcounts.get();
  },
  edtDepreciationExpenseAccount: () => {
    return Template.instance().allAcounts.get().filter(account => account.accountTypeName.toLowerCase() == 'exp');
  },
});
