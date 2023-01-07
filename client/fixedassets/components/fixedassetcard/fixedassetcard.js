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
  templateObject.edtCostAssetAccount = new ReactiveVar();
  templateObject.editBankAccount = new ReactiveVar();
  templateObject.edtDepreciationAssetAccount = new ReactiveVar();
  templateObject.edtDepreciationExpenseAccount = new ReactiveVar();
  templateObject.chkEnterAmount = new ReactiveVar();
  templateObject.chkEnterAmount.set(true);

  templateObject.getAllAccountss = function() {
    getVS1Data('TAccountVS1').then(function(dataObject) {
        if (dataObject.length === 0) {
          sideBarService.getAccountListVS1().then(function(data) {
            filterAccounts(data.taccountvs1);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          filterAccounts(data.taccountvs1);
        }
    }).catch(function(err) {
        sideBarService.getAccountListVS1().then(function(data) {
          filterAccounts(data.taccountvs1);
        });
    });
  };
  templateObject.getAllAccountss();

  function filterAccounts(data) {
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
    editableAssetType(e, $each, offset, assetTypeName);
  });

  $('#edtBoughtFrom').editableSelect();
  $('#edtDepartment').editableSelect();
  $('#edtDepreciationType').editableSelect();
  //depreciation account setting
  // $('#edtCostAssetAccount').editableSelect();
  // $('#editBankAccount').editableSelect();
  // $('#edtDepreciationAssetAccount').editableSelect();
  // $('#edtDepreciationExpenseAccount').editableSelect();
  $('#edtSalvageValueType').editableSelect();

  $("#date-input,#edtDateofPurchase, #edtDateRegisterRenewal, #edtDateRenewal, #edtDescriptionStartDate, #edtNextTimeDate, #edtLastTimeDate").datepicker({
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

  function editableAssetType(e, $each, offset, assetTypeName) {
    $('#fixedAssetTypeListModal').modal('toggle');
  }
  $(document).on("click", "#tblAccount tbody tr", function(e) {
    // $(".colAccountName").removeClass('boldtablealertsborder');
    let selectLineID = $('#selectLineID').val();
    let accountId = $(this).find('td.colAccountID').html();
    let accountName = $(this).find('td.productName').html();
    // console.log(accountId, templateObject.current_account_type);
    // let taxcodeList = templateObject.taxraterecords.get();
    templateObject[templateObject.current_account_type.get()].set(accountName);
    var table = $(this);
    $("input#"+templateObject.current_account_type.get()).val(accountName);

    $('#accountListModal').modal('toggle');
  });
  $(document).on("click", "#tblFixedassettypelist tbody tr", function(e) {
    console.log($(this).find('td.AssetName').html());
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
        Model: '', //
        // Number: '',
        // RegistrationNo: '',
        // Type:'',
        // CapacityWeight: '',
        // CapacityVolumn: '',
        PurchDate: '', //
        PurchCost: '', //
        SupplierID: '', // 
        RenewalDate:'',
        InsuranceInfo: '', //?
        // RenewalDate: '',

        // -----------------Depreciation Information
        DepreciationOption: '', //Depreciation Type
        FixedAssetCostAccountID: '',
        // FixedAssetBankAccountID: '', //ClearingAccountID
        FixedAssetDepreciationAccountID: '', //FixedAssetDepreciationExpenseAccountID
        FixedAssetDepreciationAssetAccountID: '',
        Salvage: '',
        SalvageType: '',
        life: '',
        BusinessUsePercent: '',
        


        Active: true
      }
    };
    console.log(newFixedAsset);
    // fixedassetSercie.saveTFixedAsset(newFixedAsset);
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
    console.log(status);
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