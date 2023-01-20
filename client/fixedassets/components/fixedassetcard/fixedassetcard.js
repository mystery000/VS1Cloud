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
  templateObject.currentAssetID = new ReactiveVar(0);

  templateObject.allAcounts = new ReactiveVar([]);
  templateObject.edtDepreciationType = new ReactiveVar(0);

  templateObject.edtCostAssetAccount = new ReactiveVar(0);
  templateObject.editBankAccount = new ReactiveVar(0);
  templateObject.edtDepreciationAssetAccount = new ReactiveVar(0);
  templateObject.edtDepreciationExpenseAccount = new ReactiveVar(0);

  templateObject.edtSupplierId = new ReactiveVar(0);

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

  let currentAssetID = parseInt(FlowRouter.current().queryParams.assetId || '0');
  templateObject.currentAssetID.set(currentAssetID);

  if (currentAssetID > 0) {
    fixedassetSercie.getTFixedAssetByNameOrID(currentAssetID).then((data) => {
      const assetData = data.tfixedassets;
      if (assetData.length > 0) {
        const assetInfo = assetData[0].fields;
        $('input#edtAssetCode').val(assetInfo.AssetCode);
        $('input#edtAssetName').val(assetInfo.AssetName);
        $('input#edtAssetDescription').val(assetInfo.Description);
        $('input#edtAssetType').val(assetInfo.AssetType);
        $('input#edtBrand').val(assetInfo.BrandName);
        $('input#edtModel').val(assetInfo.Model);
        $('input#edtNumber').val(assetInfo.CUSTFLD1);
        $('input#edtRegistrationNo').val(assetInfo.CUSTFLD2); // RegistrationNo
        $('input#edtType').val(assetInfo.CUSTFLD3);
        $('input#edtCapacityWeight').val(assetInfo.CUSTFLD4); // CapacityWeight
        $('input#edtCapacityVolume').val(assetInfo.CUSTFLD5); // CapacityVolumn
        $("#edtDateRegisterRenewal").val(getDatePickerForm(assetInfo.CUSTDATE1)); // RegisterRenewal Date
        $("#edtDepreciationStartDate").val(getDatePickerForm(assetInfo.DepreciationStartDate)); // DateRenewal Date
        $("#edtDateofPurchase").val(getDatePickerForm(assetInfo.PurchDate));//
        $('input#edtPurchCost').val(assetInfo.PurchCost); //
        templateObject.edtSupplierId.set(assetInfo.SupplierID);
        $('input#edtSupplierName').val(assetInfo.SupplierName);
        // InsuranceInfo: $('input#edtInsuranceInfo').val(), //

        // -----------------Depreciation Information
        templateObject.edtDepreciationType.set(assetInfo.DepreciationOption); //Depreciation Type
        let accountName = $("#edtDepreciationType").parent().find("li[value="+assetInfo.DepreciationOption+"]").html();
        $("#edtDepreciationType").val(accountName);

        templateObject.edtCostAssetAccount.set(assetInfo.FixedAssetCostAccountID);
        accountName = $("#edtCostAssetAccount").parent().find("li[value="+assetInfo.FixedAssetCostAccountID+"]").html();
        $("#edtCostAssetAccount").val(accountName);

        templateObject.editBankAccount.set(assetInfo.CUSTFLD6); // FixedAssetBankAccountID
        accountName = $("#editBankAccount").parent().find("li[value="+assetInfo.CUSTFLD6+"]").html();
        $("#editBankAccount").val(accountName);

        templateObject.edtDepreciationAssetAccount.set(assetInfo.FixedAssetDepreciationAccountID); //FixedAssetDepreciationExpenseAccountID
        accountName = $("#edtDepreciationAssetAccount").parent().find("li[value="+assetInfo.FixedAssetDepreciationAccountID+"]").html();
        $("#edtDepreciationAssetAccount").val(accountName);

        templateObject.edtDepreciationExpenseAccount.set(assetInfo.FixedAssetDepreciationAssetAccountID);
        accountName = $("#edtDepreciationExpenseAccount").parent().find("li[value="+assetInfo.FixedAssetDepreciationAssetAccountID+"]").html();
        $("#edtDepreciationExpenseAccount").val(accountName);

        $('input#edtSalvageValue').val(assetInfo.Salvage);
        $('select#edtSalvageValueType').val(assetInfo.SalvageType);
        $('input#edtAssetLife').val(assetInfo.life);
        $('input#edtBusinessUse').val(assetInfo.BusinessUsePercent);
      }
    });
  }

  $(document).on("click", "#tblFixedAssetType tbody tr", function(e) {
    $('input#edtAssetType').val($(this).find('td.AssetName').html());
    $('#fixedAssetTypeListModal').modal('hide');
  });

  $(document).on("click", "#tblSupplierlist tbody tr", function(e) {
    $('input#edtSupplierName').val($(this).find('td.colCompany').html());
    templateObject.edtSupplierId.set(parseInt($(this).attr('id')));
    $('#supplierListModal').modal('hide');
  });

  function getDatePickerForm(dateStr) {
    const date = new Date(dateStr);
    let year = date.getFullYear();
    let month = date.getMonth() < 9 ? '0'+(date.getMonth()+1) : (date.getMonth()+1);
    let day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
    if (year && month && day)
      return day+"/"+month+"/"+year;
    else
      return '';
  }
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
        SupplierID: templateObject.edtSupplierId.get(), //
        SupplierName: $('input#edtSupplierName').val(), //
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
      var month = dateObj.getMonth() < 9? "0" + (dateObj.getMonth()+1) : (dateObj.getMonth()+1);
      var date = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
      return dateObj.getFullYear() + "-" + month + "-" + date + " " + hh + ":" + min + ":" + ss;
    };

    if (templateObject.currentAssetID.get() == 0) {
      fixedassetSercie.saveTFixedAsset(newFixedAsset).then((data) => {
        fixedassetSercie.getTFixedAssetsList().then(function (data) {
          addVS1Data('TFixedAssets', JSON.stringify(data));
        }).catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
        FlowRouter.go('/fixedassetsoverview');
      })
      .catch((err) => {
      });
    } else {
      newFixedAsset.fields['ID'] = templateObject.currentAssetID.get();
      fixedassetSercie.updateTFixedAsset(newFixedAsset).then((data) => {
        fixedassetSercie.getTFixedAssetsList().then(function (data) {
          addVS1Data('TFixedAssets', JSON.stringify(data));
        }).catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
        FlowRouter.go('/fixedassetsoverview');
      })
      .catch((err) => {
      });
    }
  },
  "click button.btnBack": function() {
    FlowRouter.go('/fixedassetsoverview');
  },
  "click input#edtSupplierName": function() {
    $('#supplierListModal').modal('show');
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
