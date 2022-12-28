import { SideBarService } from '../../../js/sidebar-service'

import { AccountService } from "../../../accounts/account-service";
let sideBarService = new SideBarService();

Template.fixedassetcard.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
  templateObject.current_account_type = new ReactiveVar('');

  templateObject.edtCostAssetAccount = new ReactiveVar([]);
  templateObject.editBankAccount = new ReactiveVar([]);
  templateObject.edtDepreciationAssetAccount = new ReactiveVar([]);
  templateObject.edtDepreciationExpenseAccount = new ReactiveVar([]);
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
  $('#edtCostAssetAccount').editableSelect();
  $('#editBankAccount').editableSelect();
  $('#edtDepreciationAssetAccount').editableSelect();
  $('#edtDepreciationExpenseAccount').editableSelect();
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
});
Template.fixedassetcard.events({
  "click button.btnSave": function() {
    
  },
  "click button.btnBack": function() {
    FlowRouter.go('/fixedassetsoverview');
  },
  'click input#edtCostAssetAccount, keydown input#edtCostAssetAccount': function(event) {
    const templateObject = Template.instance();
    templateObject.current_account_type.set('edtCostAssetAccount');
    $('#accountListModal').modal('toggle');
  },
  'click input#editBankAccount, keydown input#editBankAccount': function(event) {
    const templateObject = Template.instance();
    templateObject.current_account_type.set('editBankAccount');
    $('#accountListModal').modal('toggle');
  },
  'click input#edtDepreciationAssetAccount, keydown input#edtDepreciationAssetAccount': function(event) {
    const templateObject = Template.instance();
    templateObject.current_account_type.set('edtDepreciationAssetAccount');
    $('#accountListModal').modal('toggle');
  },
  'click input#edtDepreciationExpenseAccount, keydown input#edtDepreciationExpenseAccount': function(event) {
    const templateObject = Template.instance();
    templateObject.current_account_type.set('edtDepreciationExpenseAccount');
    $('#accountListModal').modal('toggle');
  },
});