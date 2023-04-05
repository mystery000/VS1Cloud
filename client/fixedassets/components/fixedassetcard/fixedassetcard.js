import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from '../../../js/sidebar-service'

import { AccountService } from "../../../accounts/account-service";
import { FixedAssetService } from '../../fixedasset-service';
import './fixedassetcard.html';
import { Template } from 'meteor/templating';

let sideBarService = new SideBarService();
let fixedAssetService = new FixedAssetService();

Template.fixedassetcard.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.currency = new ReactiveVar('$');
  templateObject.currentAssetID = new ReactiveVar(0);
  templateObject.currentAssetName = new ReactiveVar('');
  templateObject.currentAssetCode = new ReactiveVar('');

  templateObject.allAcounts = new ReactiveVar([]);
  templateObject.edtDepreciationType = new ReactiveVar(0);
  templateObject.edtCostAssetAccount = new ReactiveVar(0);
  templateObject.editBankAccount = new ReactiveVar(0);
  templateObject.edtDepreciationAssetAccount = new ReactiveVar(0);
  templateObject.edtDepreciationExpenseAccount = new ReactiveVar(0);

  templateObject.edtDepreciationType2 = new ReactiveVar(0);
  templateObject.edtCostAssetAccount2 = new ReactiveVar(0);
  templateObject.editBankAccount2 = new ReactiveVar(0);
  templateObject.edtDepreciationAssetAccount2 = new ReactiveVar(0);
  templateObject.edtDepreciationExpenseAccount2 = new ReactiveVar(0);

  templateObject.edtSupplierId = new ReactiveVar(0);
  templateObject.edtDepartmentId = new ReactiveVar(0);
  templateObject.edtInsuranceById = new ReactiveVar(0);

  templateObject.chkEnterAmount = new ReactiveVar(true);
  templateObject.chkEnterAmount2 = new ReactiveVar(true);
  templateObject.chkDisposalAsset = new ReactiveVar(true);

  templateObject.deprecitationPlans = new ReactiveVar([]);
  templateObject.deprecitationPlans2 = new ReactiveVar([]);

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

  templateObject.inputFieldAry = new ReactiveVar({
    AssetCode: '', AssetName: '', Description: '', AssetType: '',
    Manufacture: '', BrandName: '', Model: '', AssetCondition: '', Colour: '', Size: '', Shape: '',
    WarrantyType: '',
    EstimatedValue: 'double', ReplacementCost: 'double', Status: '',
    PurchCost: 'number', SupplierName: '',
    LocationDescription: '',
    DisposalAccumDeprec: 'number', DisposalAccumDeprec2: 'number',
    DisposalBookValue: 'number', DisposalBookValue2: 'number',
    SalesPrice: 'number', SalesPrice2: 'number', Notes: '',
    Salvage: 'number', Salvage2: 'number',
    Life: 'number', Life2: 'number', BusinessUsePercent: 'number', BusinessUsePercent2: 'number',
  });
});

Template.fixedassetcard.onRendered(function () {
  const templateObject = Template.instance();
  $('#edtAssetType').editableSelect();
  $('#edtAssetType').editableSelect().on('click.editable-select', function (e, li) {
    $('#fixedAssetTypeListModal').modal('toggle');
  });

  $('#edtSupplierName').editableSelect();
  $('#edtSupplierName').editableSelect().on('click.editable-select', function (e, li) {
    $('#supplierListModal').modal('show');
    $('input#edtSupplierType').val('supplier');
  });

  $('#edtDepartmentName').editableSelect();
  $('#edtDepartmentName').editableSelect().on('click.editable-select', function (e, li) {
    $('#departmentModal').modal('show');
  });

  $('#edtInsuranceByName').editableSelect();
  $('#edtInsuranceByName').editableSelect().on('click.editable-select', function (e, li) {
    $('#supplierListModal').modal('show');
    $('input#edtSupplierType').val('insurance');
  });
  // $('#edtBoughtFrom').editableSelect();
  // $('#edtDepartment').editableSelect();
  $('#edtDepreciationType').editableSelect();
  $('#edtCostAssetAccount, #edtCostAssetAccount2').editableSelect();
  $('#editBankAccount, #editBankAccount2').editableSelect();
  $('#edtDepreciationAssetAccount, #edtDepreciationAssetAccount2').editableSelect();
  $('#edtDepreciationExpenseAccount, #edtDepreciationExpenseAccount2').editableSelect();

  $('#edtDepreciationType').editableSelect()
    .on('select.editable-select', function (e, li) {
      if (li) {
        templateObject.edtDepreciationType.set(parseInt(li.val() || 0));
        const val = parseInt(li.val() || 0);
        switch(val) {
          case 0:
            $('select#edtSalvageType').val(1);
            $('input#edtSalvage').val(0);
            break;
          case 1:
            $('select#edtSalvageType').val(1);
            break;
          case 2:
            $('input#edtSalvage').val(100);
            $('select#edtSalvageType').val(2);
            break;
        }
        templateObject.deprecitationPlans.set([]);
      }
    });

  $("#date-input, #edtDateofPurchase, #edtDateRegisterRenewal, #edtDepreciationStartDate, #edtInsuranceEndDate, #edtDateLastTest, #edtDateNextTest, #edtWarrantyExpiresDate, #edtDisposalDate2, #edtDisposalDate, #edtLastTestDate, #edtNextTestDate").datepicker({
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
    getVS1Data("TFixedAssetsList").then(function (dataObject) {
      if (dataObject.length === 0) {
        fixedAssetService.getTFixedAssetsList(25, 1).then(function (data) {
          addVS1Data('TFixedAssetsList', JSON.stringify(data))
          findFixedAssetByID(data, currentAssetID);
        });
      }
      else {
        const workData = JSON.parse(dataObject[0].data);
        findFixedAssetByID(workData, currentAssetID);
      }
    }).catch(function (err) {
      // fixedAssetService.getTFixedAssetsList().then(function (data) {
      //   addVS1Data('TFixedAssetsList', JSON.stringify(data));
      //   findFixedAssetByID(data, currentAsset);
      // }).catch(function (err) {
      //   $(".fullScreenSpin").css("display", "none");
      // });
    });
  }

  function findFixedAssetByID(data, assetID) {
    const assetData = data.tfixedassetslist.filter((asset) => asset.AssetID == assetID);
    if (assetData.length > 0) {
      const assetInfo = assetData[0];
      initializeCard(assetInfo);
    }
  }

  $(document).on("click", "#tblFixedAssetType tbody tr", function(e) {
    $('input#edtAssetType').val($(this).find('td.AssetName').html());
    $('#fixedAssetTypeListModal').modal('hide');
  });

  $(document).on("click", "#tblSupplierlist tbody tr", function(e) {
    const callType = $('input#edtSupplierType').find('.colID').text();
    if (callType === 'supplier') {
      $('input#edtSupplierName').val($(this).find('td.colCompany').html());
      templateObject.edtSupplierId.set(parseInt($(this).find('td.colID').html()));
    }
    if (callType === 'insurance') {
      $('input#edtInsuranceByName').val($(this).find('td.colCompany').html());
      templateObject.edtInsuranceById.set(parseInt($(this).find('td.colID').html()));
    }
    $('#supplierListModal').modal('hide');
  });

  $(document).on("click", "#departmentList tbody tr", function(e) {
    $('input#edtDepartmentName').val($(this).find('td.colDeptName').html());
    templateObject.edtDepartmentId.set(parseInt($(this).attr('id').html()));
    $('div#departmentModal').modal('hide');
  });

  $(document).on("click", "#tblAccountListPop tbody tr", function(e) {
    const accountName = $(this).find('td.colAccountName').html();
    const accountId = parseInt($(this).find('td.colAccountId').html());
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
      case 'edtCostAssetAccount2':
        templateObject.edtCostAssetAccount2.set(accountId);
        break;
      case 'editBankAccount2':
        templateObject.editBankAccount.set(accountId);
        break;
      case 'edtDepreciationAssetAccount2':
        templateObject.edtDepreciationAssetAccount2.set(accountId);
        break;
      case 'edtDepreciationExpenseAccount2':
        templateObject.edtDepreciationExpenseAccount2.set(accountId);
        break;
    }
    $('input#'+$('input#edtAccountType').val()).val(accountName);
    $('#accountListModal').modal('hide');
  });

  function initializeCard(assetInfo) {
    const allAccountsData = templateObject.allAcounts.get();
    templateObject.currentAssetName.set(assetInfo.AssetName);
    templateObject.currentAssetCode.set(assetInfo.AssetCode);

    $('input#edtNumber').val(assetInfo.CUSTFLD1);
    $('input#edtRegistrationNo').val(assetInfo.CUSTFLD2); // RegistrationNo
    $('input#edtType').val(assetInfo.CUSTFLD3);
    $('input#edtCapacityWeight').val(assetInfo.CUSTFLD4); // CapacityWeight
    $('input#edtCapacityVolume').val(assetInfo.CUSTFLD5); // CapacityVolumn
    // $("#edtDateRegisterRenewal").val(getDatePickerForm(assetInfo.CUSTDATE1)); // RegisterRenewal Date

    // -----------------Purchase Information-----------------
    $("#edtDateofPurchase").val(getDatePickerForm(assetInfo.PurchDate));
    $("#edtDepreciationStartDate").val(getDatePickerForm(assetInfo.DepreciationStartDate)); // Depeciation Start Date
    templateObject.edtSupplierId.set(assetInfo.SupplierID);
    templateObject.edtDepartmentId.set(assetInfo.PARTSID);
    $("#edtDepartmentName").val(assetInfo.PARTNAME);
    // -----------------
    $("#edtLastTestDate").val(getDatePickerForm(assetInfo.LastTestDate));
    $("#edtNextTestDate").val(getDatePickerForm(assetInfo.NextTestDate));

    $("#edtWarrantyExpiresDate").val(getDatePickerForm(assetInfo.WarrantyExpiresDate));
    $("#edtDisposalDate").val(getDatePickerForm(assetInfo.DisposalDate));
    $("#edtDisposalDate2").val(getDatePickerForm(assetInfo.DisposalDate2));

    // templateObject.chkDisposalAsset.set();

    Object.keys(templateObject.inputFieldAry.get()).map((fieldName) => {
      $("div#fixedAssetCardContainer #edt" + fieldName).val(assetInfo[fieldName]);
    });

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

    // -----------------Depreciation Information-----------------
    templateObject.edtDepreciationType2.set(assetInfo.DepreciationOption2); //Depreciation Type
    accountName = $("#edtDepreciationType2").parent().find("li[value="+assetInfo.DepreciationOption2+"]").html();
    $("#edtDepreciationType2").val(accountName);

    templateObject.edtCostAssetAccount2.set(assetInfo.FixedAssetCostAccountID2);
    accountName = allAccountsData.find((account) => account.id == assetInfo.FixedAssetCostAccountID2)['accountName'];
    $("#edtCostAssetAccount2").val(accountName);

    templateObject.editBankAccount2.set(assetInfo.CUSTFLD8); // FixedAssetBankAccountID
    accountName = allAccountsData.find((account) => account.id == assetInfo.CUSTFLD8)['accountName'];
    $("#editBankAccount2").val(accountName);

    templateObject.edtDepreciationAssetAccount2.set(assetInfo.FixedAssetDepreciationAccountID2); //FixedAssetDepreciationExpenseAccountID
    accountName = allAccountsData.find((account) => account.id == assetInfo.FixedAssetDepreciationAccountID2)['accountName'];
    $("#edtDepreciationAssetAccount2").val(accountName);

    templateObject.edtDepreciationExpenseAccount2.set(assetInfo.FixedAssetDepreciationAssetAccountID2);
    accountName = allAccountsData.find((account) => account.id == assetInfo.FixedAssetDepreciationAssetAccountID2)['accountName'];
    $("#edtDepreciationExpenseAccount2").val(accountName);

    $('select#edtSalvageType').val(assetInfo.SalvageType);
    $('select#edtSalvageType2').val(assetInfo.SalvageType2);

    // -----------------Insurance Information-----------------
    $('input#edtInsurancePolicy').val(assetInfo.InsurancePolicy);
    $("#edtInsuranceEndDate").val(getDatePickerForm(assetInfo.InsuredUntil)); // Insurance Until Date
    $('input#edtInsuranceByName').val(assetInfo.CUSTFLD7);
    templateObject.edtInsuranceById.set(assetInfo.InsuredBy);

    let planList = assetInfo.fixedassetsdepreciationdetails, depPlanList = [];
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

    planList = assetInfo.fixedassetsdepreciationdetails;
    depPlanList = [];

    for (i = 0; i < planList.length; i++) {
      const info = planList[i].fields;
      const plan = {
        year: info.Year,
        depreciation: info.Depreciation,
        accDepreciation: info.TotalDepreciation,
        bookValue: info.BookValue
      };
      depPlanList.push(plan);
    }
    templateObject.deprecitationPlans2.set(depPlanList);
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
    const depPlans = templateObject.deprecitationPlans.get(),
        depPlans2 = templateObject.deprecitationPlans.get(),
        planList = new Array(), planList2 = new Array();
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
    for (i = 0; i < depPlans2.length; i++) {
      const plan = {
        type: 'TFixedAssetsDepreciationDetails2',
        fields: {
          "Year": depPlans2[i].year.toString(),
          "Depreciation": depPlans2[i].depreciation,
          "TotalDepreciation": depPlans2[i].accDepreciation,
          "BookValue": depPlans2[i].bookValue
        }
      }
      planList2.push(plan);
    }
    let newFixedAsset = {
      "type":"TFixedAssets",
      "fields":{
        CUSTFLD1: $('input#edtNumber').val(),
        CUSTFLD2: $('input#edtRegistrationNo').val(),
        CUSTFLD3: $('input#edtType').val(),
        CUSTFLD4: $('input#edtCapacityWeight').val(),
        CUSTFLD5: $('input#edtCapacityVolume').val(),
        // CUSTDATE1: templateObject.getDateStr($("#edtDateRegisterRenewal").datepicker("getDate")),
        // purcahse info
        DepreciationStartDate: templateObject.getDateStr($("#edtDepreciationStartDate").datepicker("getDate")),
        PurchDate: templateObject.getDateStr($("#edtDateofPurchase").datepicker("getDate")),
        SupplierID: templateObject.edtSupplierId.get(),
        PARTSID: templateObject.edtDepartmentId.get(),
        PARTNAME: $('input#edtDepartmentName').val(),
        //
        LastTestDate: templateObject.getDateStr($("#edtLastTestDate").datepicker("getDate")),
        NextTestDate: templateObject.getDateStr($("#edtNextTestDate").datepicker("getDate")),

        WarrantyExpiresDate: templateObject.getDateStr($("#edtWarrantyExpiresDate").datepicker("getDate")),
        Disposal: templateObject.chkDisposalAsset.get(),
        DisposalDate: templateObject.getDateStr($("#edtDisposalDate").datepicker("getDate")),
        DisposalDate2: templateObject.getDateStr($("#edtDisposalDate2").datepicker("getDate")),
        // Insurance Info
        InsuredBy: templateObject.edtInsuranceById.get().toString(),
        CUSTFLD7: $('input#edtInsuranceByName').val(),
        InsurancePolicy: $('input#edtInsurancePolicy').val(),
        InsuredUntil: templateObject.getDateStr($("#edtInsuranceEndDate").datepicker("getDate")),

        DepreciationOption: templateObject.edtDepreciationType.get(),
        DepreciationOption2: templateObject.edtDepreciationType2.get(),
        FixedAssetCostAccountID: templateObject.edtCostAssetAccount.get(),
        FixedAssetCostAccountID2: templateObject.edtCostAssetAccount2.get(),
        // fixedassetsdepreciationdetails: planList,
        // fixedassetsdepreciationdetails2: planList2,
        CUSTFLD6: templateObject.editBankAccount.get().toString(),
        CUSTFLD8: templateObject.editBankAccount2.get().toString(),
        FixedAssetDepreciationAccountID: templateObject.edtDepreciationAssetAccount.get(),
        FixedAssetDepreciationAccountID2: templateObject.edtDepreciationAssetAccount2.get(),
        FixedAssetDepreciationAssetAccountID: templateObject.edtDepreciationExpenseAccount.get(),
        FixedAssetDepreciationAssetAccountID2: templateObject.edtDepreciationExpenseAccount2.get(),
        SalvageType: parseInt($('select#edtSalvageType').val()) || 0,
        SalvageType2: parseInt($('select#edtSalvageType2').val()) || 0,

        Active: true
      }
    };
    const inputFields = templateObject.inputFieldAry.get();
    Object.keys(inputFields).map((fieldName) => {
      switch (inputFields[fieldName]) {
        case 'double':
          newFixedAsset.fields[fieldName] = parseFloat($('div#fixedAssetCardContainer #edt'+fieldName).val());
          break;
        case 'number':
          newFixedAsset.fields[fieldName] = parseInt($('div#fixedAssetCardContainer #edt'+fieldName).val()) || 0;
          break;
        default:
          newFixedAsset.fields[fieldName] = $('div#fixedAssetCardContainer #edt'+fieldName).val();
          break;
      }
    });
    if (templateObject.currentAssetID.get() == 0) {
      fixedAssetService.saveTFixedAsset(newFixedAsset).then((data) => {
        fixedAssetService.getTFixedAssetsList().then(function (data) {
          addVS1Data('TFixedAssetsList', JSON.stringify(data));
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
          addVS1Data('TFixedAssetsList', JSON.stringify(data));
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

    const accumulateDepVal = parseInt($('input#edtAccumulatedDepreciation').val()) || 0;
    const yearEnding = parseInt($('input#edtForYearEnding').val()) || 0;


    const salvage = parseInt($('input#edtSalvage').val()) || 0;

    const startDate = new Date($("#edtDepreciationStartDate").datepicker("getDate"));
    let startYear = startDate.getFullYear();

    const life = parseInt($('input#edtLife').val()) || 1;
    const businessPercent = parseInt($('input#edtBusinessUsePercent').val()) || 100;

    const enterAmountFlag = templateObject.chkEnterAmount.get();
    const totalDepreciationVal = enterAmountFlag ? (salvage * businessPercent / 100) : accumulateDepVal;
    if (totalDepreciationVal == 0) {
      Bert.alert( '<strong>WARNING:</strong>Depreciation price is zero ', 'danger','fixed-top', 'fa-frown-o' );
      templateObject.deprecitationPlans.set([]);
      return;
    }
    if (!enterAmountFlag && yearEnding !== 0 && (yearEnding - startYear - life + 1) < 0) {
      Bert.alert( '<strong>WARNING:</strong>Depreciation Life is too longer to calculate ', 'danger','fixed-top', 'fa-frown-o' );
      templateObject.deprecitationPlans.set([]);
      return;
    }
    if (!enterAmountFlag && yearEnding !== 0) {
      startYear = yearEnding - life + 1;
    }

    let accValue = 0, plan = [];
    switch (depreciationType) {
      case 0: //No Depreciation
        templateObject.deprecitationPlans.set([]);
        break;
      case 1: //Straight Line Depreciation
        const yearDepreciation = totalDepreciationVal / life;
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
        let initalAmount = enterAmountFlag ? parseInt($('input#edtPurchCost').val() || 0) : accumulateDepVal;
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
  "click button.btnCalculate2": function () {
    const templateObject = Template.instance();
    const depreciationType = templateObject.edtDepreciationType2.get();

    const accumulateDepVal = parseInt($('input#edtAccumulatedDepreciation2').val()) || 0;
    const yearEnding = parseInt($('input#edtForYearEnding2').val()) || 0;


    const salvage = parseInt($('input#edtSalvage2').val()) || 0;

    const startDate = new Date($("#edtDepreciationStartDate").datepicker("getDate"));
    let startYear = startDate.getFullYear();

    const life = parseInt($('input#edtLife2').val()) || 1;
    const businessPercent = parseInt($('input#edtBusinessUsePercent2').val()) || 100;

    const enterAmountFlag = templateObject.chkEnterAmount2.get();
    const totalDepreciationVal = enterAmountFlag ? (salvage * businessPercent / 100) : accumulateDepVal;

    if (totalDepreciationVal == 0) {
      Bert.alert( '<strong>WARNING:</strong>Depreciation price is zero ', 'danger','fixed-top', 'fa-frown-o' );
      templateObject.deprecitationPlans2.set([]);
      return;
    }
    if (!enterAmountFlag && yearEnding !== 0 && (yearEnding - startYear - life + 1) < 0) {
      Bert.alert( '<strong>WARNING:</strong>Depreciation Life is too longer to calculate ', 'danger','fixed-top', 'fa-frown-o' );
      templateObject.deprecitationPlans2.set([]);
      return;
    }
    if (!enterAmountFlag && yearEnding !== 0) {
      startYear = yearEnding - life + 1;
    }

    let accValue = 0, plan = [];
    switch (depreciationType) {
      case 0: //No Depreciation
        templateObject.deprecitationPlans2.set([]);
        break;
      case 1: //Straight Line Depreciation
        const yearDepreciation = totalDepreciationVal / life;
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
        templateObject.deprecitationPlans2.set(plan);
        break;
      case 2: //Decling Balance
        let initalAmount = enterAmountFlag ? parseInt($('input#edtPurchCost').val() || 0) : accumulateDepVal;
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
        templateObject.deprecitationPlans2.set(plan);
        break;
    }
  },
  "click input#edtCostAssetAccount": function() {
    $('#accountListModal').modal('show');
    $('input#edtAccountType').val('edtCostAssetAccount');
  },
  "click input#editBankAccount": function() {
    $('#accountListModal').modal('show');
    $('input#edtAccountType').val('editBankAccount');
  },
  "click input#edtDepreciationAssetAccount": function() {
    $('#accountListModal').modal('show');
    $('input#edtAccountType').val('edtDepreciationAssetAccount');
  },
  "click input#edtDepreciationExpenseAccount": function() {
    $('#accountListModal').modal('show');
    $('input#edtAccountType').val('edtDepreciationExpenseAccount');
  },

  "click input#edtCostAssetAccount2": function() {
    $('#accountListModal').modal('show');
    $('input#edtAccountType').val('edtCostAssetAccount2');
  },
  "click input#editBankAccount2": function() {
    $('#accountListModal').modal('show');
    $('input#edtAccountType').val('editBankAccount2');
  },
  "click input#edtDepreciationAssetAccount2": function() {
    $('#accountListModal').modal('show');
    $('input#edtAccountType').val('edtDepreciationAssetAccount2');
  },
  "click input#edtDepreciationExpenseAccount2": function() {
    $('#accountListModal').modal('show');
    $('input#edtAccountType').val('edtDepreciationExpenseAccount2');
  },

  "click button#btnAddAttachment": function() {
    $('#myModalAttachment').modal('show');
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

  'change input#chkEnterAmount2': function(e) {
    const templateObject = Template.instance();
    const status = templateObject.chkEnterAmount2.get();
    templateObject.chkEnterAmount2.set(!status);
  },

  'change input#chkDisposalAsset': function(e) {
    const templateObject = Template.instance();
    const status = templateObject.chkDisposalAsset.get();
    templateObject.chkDisposalAsset.set(!status);
  },
});

Template.fixedassetcard.helpers({
  currency: () => {
    return Template.instance().currency.get();
  },
  chkEnterAmount: () => {
    return Template.instance().chkEnterAmount.get();
  },
  chkEnterAmount2: () => {
    return Template.instance().chkEnterAmount2.get();
  },
  chkDisposalAsset: () => {
    return Template.instance().chkDisposalAsset.get();
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
  },
  deprecitationPlans2:() => {
    return Template.instance().deprecitationPlans2.get();
  },
  assetID: () => {
    return Template.instance().currentAssetID.get();
  },
  assetName: () => {
    return Template.instance().currentAssetName.get();
  },
  assetCode: () => {
    return Template.instance().currentAssetCode.get();
  }
});
