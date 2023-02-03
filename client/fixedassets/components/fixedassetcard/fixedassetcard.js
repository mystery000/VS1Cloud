import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from '../../../js/sidebar-service'

import { AccountService } from "../../../accounts/account-service";
import { FixedAssetService } from '../../fixedasset-service';
import './fixedassetcard.html';
import { Template } from 'meteor/templating';

let sideBarService = new SideBarService();
let accountService = new AccountService();
let fixedAssetService = new FixedAssetService();

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
  templateObject.edtInsuranceById = new ReactiveVar(0);

  templateObject.chkEnterAmount = new ReactiveVar();
  templateObject.chkEnterAmount.set(true);

  templateObject.deprecitationPlans = new ReactiveVar([]);

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
    // templateObject.allAcounts.get().forEach((account) => {
    //   $('#edtCostAssetAccount').editableSelect('add', function(){
    //     $(this).val(account.id);
    //     $(this).text(account.accountName);
    //   });
    //   $('#editBankAccount').editableSelect('add', function(){
    //     $(this).val(account.id);
    //     $(this).text(account.accountName);
    //   });
    //   $('#edtDepreciationAssetAccount').editableSelect('add', function(){
    //     $(this).val(account.id);
    //     $(this).text(account.accountName);
    //   });
    //   $('#edtDepreciationExpenseAccount').editableSelect('add', function(){
    //     $(this).val(account.id);
    //     $(this).text(account.accountName);
    //   });
    // });
  }

  templateObject.getDateStr = function (dateVal) {
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
});

Template.fixedassetcard.onRendered(function () {
  const templateObject = Template.instance();
  $('#edtAssetType').editableSelect();
  $('#edtAssetType').editableSelect().on('click.editable-select', function (e, li) {
    // $('#selectLineID').val('sltJobTerms');
    // const $each = $(this);
    // const offset = $each.offset();
    // const assetTypeName = e.target.value || '';
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
        const val = parseInt(li.val() || 0);
        switch(val) {
          case 0:
            $('select#edtSalvageValueType').val(1);
            $('input#edtSalvageValue').val(0);
            break;
          case 1:
            $('select#edtSalvageValueType').val(1);
            break;
          case 2:
            $('select#edtSalvageValueType').val(2);
            break;
        }
        templateObject.deprecitationPlans.set([]);
      }
    });

  // $('#edtCostAssetAccount').editableSelect()
  //   .on('select.editable-select', function (e, li) {
  //     if (li) {
  //       templateObject.edtCostAssetAccount.set(parseInt(li.val() || 0));
  //     }
  //   });

  // $('#editBankAccount').editableSelect()
  //   .on('select.editable-select', function (e, li) {
  //     if (li) {
  //       templateObject.editBankAccount.set(parseInt(li.val() || 0));
  //     }
  //   });

  // $('#edtDepreciationAssetAccount').editableSelect()
  //   .on('select.editable-select', function (e, li) {
  //     if (li) {
  //       templateObject.edtDepreciationAssetAccount.set(parseInt(li.val() || 0));
  //     }
  //   });

  // $('#edtDepreciationExpenseAccount').editableSelect()
  //   .on('select.editable-select', function (e, li) {
  //     if (li) {
  //       templateObject.edtDepreciationExpenseAccount.set(parseInt(li.val() || 0));
  //     }
  //   });

  $("#date-input,#edtDateofPurchase, #edtDateRegisterRenewal, #edtDepreciationStartDate, #edtInsuranceEndDate").datepicker({
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
    getVS1Data("TFixedAssets").then(function (dataObject) {
      if (dataObject.length == 0) {
        fixedAssetService.getTFixedAssetByNameOrID(currentAssetID).then((data) => {
          const assetData = data.tfixedassets;
          if (assetData.length > 0) {
            const assetInfo = assetData[0].fields;
            initializeCard(assetInfo);
          }
          $(".fullScreenSpin").css("display", "none");
        }).catch((err) => {
          $(".fullScreenSpin").css("display", "none");
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        const assetData = data.tfixedassets.filter((asset) => asset.fields.ID == currentAssetID);
        if (assetData.length > 0) {
          const assetInfo = assetData[0].fields;
          initializeCard(assetInfo);
        }
      }
    }).catch(function (err) {
      fixedAssetService.getTFixedAssetByNameOrID(currentAssetID).then((data) => {
        const assetData = data.tfixedassets;
        if (assetData.length > 0) {
          const assetInfo = assetData[0].fields;
          initializeCard(assetInfo);
        }
      }).catch((err) => {
        $(".fullScreenSpin").css("display", "none");
      });;
    });
    
     
  }

  $(document).on("click", "#tblFixedAssetType tbody tr", function(e) {
    $('input#edtAssetType').val($(this).find('td.AssetName').html());
    $('#fixedAssetTypeListModal').modal('hide');
  });

  $(document).on("click", "#tblSupplierlist tbody tr", function(e) {
    const callType = $('input#edtSupplierType').val();
    if (callType === 'supplier') {
      $('input#edtSupplierName').val($(this).find('td.colCompany').html());
      templateObject.edtSupplierId.set(parseInt($(this).attr('id')));
    }
    if (callType === 'insurance') {
      $('input#edtInsuranceByName').val($(this).find('td.colCompany').html());
      templateObject.edtInsuranceById.set(parseInt($(this).attr('id')));
    }
    $('#supplierListModal').modal('hide');
  });

  $(document).on("click", "#tblAccountOverview tbody tr", function(e) {
    const accountName = $(this).find('td.colAccountName').html();
    const accountId = parseInt($(this).attr('id'));
    switch ($('input#edtAccountType').val()) {
      case 'edtCostAssetAccount':
        templateObject.edtCostAssetAccount.set(accountId);
        break;
      case 'editBankAccount':
        templateObject.editBankAccount.set(accountId);
        break;
      case 'edtDepreciationAssetAccount':
        templateObject.edtDepreciationAssetAccount.set(accountId);
        break;
      case 'edtDepreciationExpenseAccount':
        templateObject.edtDepreciationExpenseAccount.set(accountId);
        break;
    }
    $('input#'+$('input#edtAccountType').val()).val(accountName);
    $('#accountListModal').modal('hide');
  });

  function initializeCard(assetInfo) {
    const allAccountsData = templateObject.allAcounts.get();
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
    templateObject.edtSupplierId.set(assetInfo.SupplierID);
    $('input#edtSupplierName').val(assetInfo.SupplierName);

    // -----------------Purchase Information-----------------
    $("#edtDateofPurchase").val(getDatePickerForm(assetInfo.PurchDate));
    $('input#edtPurchCost').val(assetInfo.PurchCost);
    $("#edtDepreciationStartDate").val(getDatePickerForm(assetInfo.DepreciationStartDate)); // Depeciation Start Date

    // -----------------Depreciation Information-----------------
    templateObject.edtDepreciationType.set(assetInfo.DepreciationOption); //Depreciation Type
    let accountName = $("#edtDepreciationType").parent().find("li[value="+assetInfo.DepreciationOption+"]").html();
    $("#edtDepreciationType").val(accountName);

    templateObject.edtCostAssetAccount.set(assetInfo.FixedAssetCostAccountID);
    accountName = allAccountsData.find((account) => account.id == assetInfo.FixedAssetCostAccountID)['accountName'];
    $("#edtCostAssetAccount").val(accountName);

    templateObject.editBankAccount.set(assetInfo.CUSTFLD6); // FixedAssetBankAccountID
    accountName = allAccountsData.find((account) => account.id == assetInfo.CUSTFLD6)['accountName'];
    $("#editBankAccount").val(accountName);

    templateObject.edtDepreciationAssetAccount.set(assetInfo.FixedAssetDepreciationAccountID); //FixedAssetDepreciationExpenseAccountID
    accountName = allAccountsData.find((account) => account.id == assetInfo.FixedAssetDepreciationAccountID)['accountName'];
    $("#edtDepreciationAssetAccount").val(accountName);

    templateObject.edtDepreciationExpenseAccount.set(assetInfo.FixedAssetDepreciationAssetAccountID);
    accountName = allAccountsData.find((account) => account.id == assetInfo.FixedAssetDepreciationAssetAccountID)['accountName'];
    $("#edtDepreciationExpenseAccount").val(accountName);

    $('input#edtSalvageValue').val(assetInfo.Salvage);
    $('select#edtSalvageValueType').val(assetInfo.SalvageType);
    $('input#edtAssetLife').val(assetInfo.Life);
    $('input#edtBusinessUse').val(assetInfo.BusinessUsePercent);

    // -----------------Insurance Information-----------------
    $('input#edtInsurancePolicy').val(assetInfo.InsurancePolicy);
    $("#edtInsuranceEndDate").val(getDatePickerForm(assetInfo.InsuredUntil)); // Insurance Until Date
    $('input#edtInsuranceByName').val(assetInfo.CUSTFLD7);
    templateObject.edtInsuranceById.set(assetInfo.InsuredBy);

    const planList = assetInfo.fixedassetsdepreciationdetails1, depPlanList = [];
    for (let i = 0; i < planList.length; i++) {
      const info = planList[i].fields;
      const plan = {
        year: info.Year,
        depreciation: info.Depreciation,
        accDepreciation: info.TotalDepreciation,
        bookValue: info.BookValue
      };
      depPlanList.push(plan);
    }
    templateObject.deprecitationPlans.set(depPlanList);
  }
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
    const depPlans = templateObject.deprecitationPlans.get(), planList = [];
    for (let i = 0; i < depPlans.length; i++) {
      const plan = {
        type: 'TFixedAssetsDepreciationDetails1',
        fields: {
          "Year": depPlans[i].year.toString(),
          "Depreciation": depPlans[i].depreciation,
          "TotalDepreciation": depPlans[i].accDepreciation,
          "BookValue": depPlans[i].bookValue
        }
      }
      planList.push(plan);
    }
    let newFixedAsset = {
      "type":"TFixedAssets",
      "fields":{
        AssetCode: $('input#edtAssetCode').val(),
        AssetName: $('input#edtAssetName').val(),
        Description: $('input#edtAssetDescription').val(),
        AssetType: $('input#edtAssetType').val(),
        BrandName: $('input#edtBrand').val(),
        Model: $('input#edtModel').val(),
        CUSTFLD1: $('input#edtNumber').val(),
        CUSTFLD2: $('input#edtRegistrationNo').val(),
        CUSTFLD3: $('input#edtType').val(),
        CUSTFLD4: $('input#edtCapacityWeight').val(),
        CUSTFLD5: $('input#edtCapacityVolume').val(),
        CUSTDATE1: templateObject.getDateStr($("#edtDateRegisterRenewal").datepicker("getDate")),
        DepreciationStartDate: templateObject.getDateStr($("#edtDepreciationStartDate").datepicker("getDate")),
        PurchDate: templateObject.getDateStr($("#edtDateofPurchase").datepicker("getDate")), 
        PurchCost: parseInt($('input#edtPurchCost').val()) || 0, 
        SupplierID: templateObject.edtSupplierId.get(), 
        SupplierName: $('input#edtSupplierName').val(), 
        
        InsuredBy: templateObject.edtInsuranceById.get(),
        CUSTFLD7: $('input#edtInsuranceByName').val(),
        InsurancePolicy: $('input#edtInsurancePolicy').val(),
        InsuredUntil: templateObject.getDateStr($("#edtInsuranceEndDate").datepicker("getDate")),

        DepreciationOption: templateObject.edtDepreciationType.get(),
        FixedAssetCostAccountID: templateObject.edtCostAssetAccount.get(),
        fixedassetsdepreciationdetails1: planList,
        CUSTFLD6: templateObject.editBankAccount.get().toString(),
        FixedAssetDepreciationAccountID: templateObject.edtDepreciationAssetAccount.get(),
        FixedAssetDepreciationAssetAccountID: templateObject.edtDepreciationExpenseAccount.get(),
        Salvage: parseInt($('input#edtSalvageValue').val()) || 0,
        SalvageType: parseInt($('select#edtSalvageValueType').val()) || 0,
        Life: parseInt($('input#edtAssetLife').val()) || 1,
        BusinessUsePercent: parseInt($('input#edtBusinessUse').val()) || 100,
        Active: true
      }
    };
    
    if (templateObject.currentAssetID.get() == 0) {
      fixedAssetService.saveTFixedAsset(newFixedAsset).then((data) => {
        fixedAssetService.getTFixedAssetsList().then(function (data) {
          addVS1Data('TFixedAssets', JSON.stringify(data));
        }).catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
        FlowRouter.go('/fixedassetlist');
      })
      .catch((err) => {
      });
    } else {
      newFixedAsset.fields['ID'] = templateObject.currentAssetID.get();
      fixedAssetService.updateTFixedAsset(newFixedAsset).then((data) => {
        fixedAssetService.getTFixedAssetsList().then(function (data) {
          addVS1Data('TFixedAssets', JSON.stringify(data));
        }).catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
        FlowRouter.go('/fixedassetlist');
      })
      .catch((err) => {
      });
    }
  },
  "click button.btnBack": function() {
    FlowRouter.go('/fixedassetlist');
  },
  "click button.btnCalculate": function () {
    const templateObject = Template.instance();
    const depreciationType = templateObject.edtDepreciationType.get();
    const salvage = parseInt($('input#edtSalvageValue').val()) || 0;
    const startDate = new Date($("#edtDepreciationStartDate").datepicker("getDate"));
    const startYear = startDate.getFullYear();
    const life = parseInt($('input#edtAssetLife').val()) || 1;
    const businessPercent = parseInt($('input#edtBusinessUse').val()) || 100;
    if (salvage * businessPercent == 0) {
      Bert.alert( '<strong>WARNING:</strong>Salvage is zero ', 'danger','fixed-top', 'fa-frown-o' );
      templateObject.deprecitationPlans.set([]);
      return;
    }

    let accValue = 0, plan = [];
    switch (depreciationType) {
      case 0: //No Depreciation
        templateObject.deprecitationPlans.set([]);
        break;
      case 1: //Straight Line Depreciation
        const yearDepreciation = salvage * businessPercent / 100 / life;
        for (let i = 0; i < life; i++) {
          accValue += yearDepreciation;
          const yearPlan = {
            year: startYear + i,
            depreciation: yearDepreciation,
            accDepreciation: accValue,
            bookValue: accValue
          };
          plan.push(yearPlan);
        }
        templateObject.deprecitationPlans.set(plan);
        break;
      case 2: //Decling Balance
        let initalAmount = parseInt($('input#edtPurchCost').val() || 0);
        if (initalAmount !== 0) {
          for (let i = 0; i < life; i++) {
            accValue += initalAmount / salvage * 100;
            const yearPlan = {
              year: startYear + i,
              depreciation: initalAmount / salvage * 100,
              accDepreciation: accValue,
              bookValue: accValue
            };
            plan.push(yearPlan);
            initalAmount = initalAmount / salvage * 100;
          }
        }
        templateObject.deprecitationPlans.set(plan);
        break;
    }
  },
  "click input#edtSupplierName": function() {
    $('#supplierListModal').modal('show');
    $('input#edtSupplierType').val('supplier');
  },
  "click input#edtInsuranceByName": function() {
    $('#supplierListModal').modal('show');
    $('input#edtSupplierType').val('insurance');
  },
  "click input#edtCostAssetAccount": function() {
    $('#accountListModal').modal('show');
    $('#accountListModal button#btnRefreshList').hide();
    $('#accountListModal button#btnViewDeleted').hide();
    $('input#edtAccountType').val('edtCostAssetAccount');
  },
  "click input#editBankAccount": function() {
    $('#accountListModal').modal('show');
    $('#accountListModal button#btnRefreshList').hide();
    $('#accountListModal button#btnViewDeleted').hide();
    $('input#edtAccountType').val('editBankAccount');
  },
  "click input#edtDepreciationAssetAccount": function() {
    $('#accountListModal').modal('show');
    $('#accountListModal button#btnRefreshList').hide();
    $('#accountListModal button#btnViewDeleted').hide();
    $('input#edtAccountType').val('edtDepreciationAssetAccount');
  },
  "click input#edtDepreciationExpenseAccount": function() {
    $('#accountListModal').modal('show');
    $('#accountListModal button#btnRefreshList').hide();
    $('#accountListModal button#btnViewDeleted').hide();
    $('input#edtAccountType').val('edtDepreciationExpenseAccount');
  },
  // 'change select#edtCostAssetAccount': function(event) {
  //   Template.instance().edtCostAssetAccount.set(event.target.value);
  // },
  // 'change select#editBankAccount': function(event) {
  //   Template.instance().editBankAccount.set(event.target.value);
  // },
  // 'change select#edtDepreciationAssetAccount': function(event) {
  //   Template.instance().edtDepreciationAssetAccount.set(event.target.value);
  // },
  // 'change select#dtDepreciationExpenseAccount': function(event) {
  //   Template.instance().dtDepreciationExpenseAccount.set(event.target.value);
  // },
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
  deprecitationPlans:() => {
    return Template.instance().deprecitationPlans.get();
  }
});
