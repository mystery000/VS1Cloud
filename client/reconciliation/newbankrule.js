import { ReactiveVar } from "meteor/reactive-var";
import "../lib/global/erp-objects";
import "../lib/global/indexdbstorage.js";
import "jquery-editable-select";
import { bankNameList } from "../lib/global/bank-names";
import { AccountService } from "../accounts/account-service";
import LoadingOverlay from "../LoadingOverlay";
import { Template } from "meteor/templating";
import "./newbankrule.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import Datehandler from "../DateHandler.js"
import GlobalFunctions from "../GlobalFunctions.js";
let accountService = new AccountService();
const successSaveCb = () => {
  playSaveAudio();
  swal({
    title: "Bank Rule Successfully Saved",
    text: "",
    type: "success",
    showCancelButton: false,
    confirmButtonText: "OK",
  });

  if (localStorage.getItem("enteredURL") != null) {
    FlowRouter.go(localStorage.getItem("enteredURL"));
    localStorage.removeItem("enteredURL");
    return;
  }
  FlowRouter.go('/bankrulelist');
};

const errorSaveCb = (err) => {
  swal("Something went wrong", "", "error");
};

function openBankAccountListModal() {
  $("#bankAccountListModal").modal();
  setTimeout(function () {
    $("#tblAccount_filter .form-control-sm").focus();
    $("#tblAccount_filter .form-control-sm").val("");
    $("#tblAccount_filter .form-control-sm").trigger("input");
    const datatable = $("#tblAccountlist").DataTable();
    datatable.draw();
    $("#tblAccountlist_filter .form-control-sm").trigger("input");
  }, 500);
}

function setOneAccountByName(accountDataName) {
  accountService
    .getOneAccountByName(accountDataName)
    .then(function (data) {
      setBankAccountData(data);
    })
    .catch(function (err) {
      $(".fullScreenSpin").css("display", "none");
    });
}

function setBankAccountData(data, i = 0) {
  let fullAccountTypeName = "";
  $("#add-account-title").text("Edit Account Details");
  $("#edtAccountName").attr("readonly", true);
  $("#sltAccountType").attr("readonly", true);
  $("#sltAccountType").attr("disabled", "disabled");
  const accountid = data.taccountvs1[i].fields.ID || "";
  const accounttype =
    fullAccountTypeName || data.taccountvs1[i].fields.AccountTypeName;
  const accountname = data.taccountvs1[i].fields.AccountName || "";
  const accountno = data.taccountvs1[i].fields.AccountNumber || "";
  const taxcode = data.taccountvs1[i].fields.TaxCode || "";
  const accountdesc = data.taccountvs1[i].fields.Description || "";
  const bankaccountname = data.taccountvs1[i].fields.BankAccountName || "";
  const bankbsb = data.taccountvs1[i].fields.BSB || "";
  const bankacountno = data.taccountvs1[i].fields.BankAccountNumber || "";
  const swiftCode = data.taccountvs1[i].fields.Extra || "";
  const routingNo = data.taccountvs1[i].fields.BankCode || "";
  const showTrans = data.taccountvs1[i].fields.IsHeader || false;
  const cardnumber = data.taccountvs1[i].fields.CarNumber || "";
  const cardcvc = data.taccountvs1[i].fields.CVC || "";
  const cardexpiry = data.taccountvs1[i].fields.ExpiryDate || "";

  if (accounttype == "BANK") {
    $(".isBankAccount").removeClass("isNotBankAccount");
    $(".isCreditAccount").addClass("isNotCreditAccount");
  } else if (accounttype == "CCARD") {
    $(".isCreditAccount").removeClass("isNotCreditAccount");
    $(".isBankAccount").addClass("isNotBankAccount");
  } else {
    $(".isBankAccount").addClass("isNotBankAccount");
    $(".isCreditAccount").addClass("isNotCreditAccount");
  }

  $("#edtAccountID").val(accountid);
  $("#sltAccountType").val(accounttype);
  $("#sltAccountType").append(
    '<option value="' +
      accounttype +
      '" selected="selected">' +
      accounttype +
      "</option>"
  );
  $("#edtAccountName").val(accountname);
  $("#edtAccountNo").val(accountno);
  $("#sltTaxCode").val(taxcode);
  $("#txaAccountDescription").val(accountdesc);
  $("#edtBankAccountName").val(bankaccountname);
  $("#edtBSB").val(bankbsb);
  $("#edtBankAccountNo").val(bankacountno);
  $("#swiftCode").val(swiftCode);
  $("#routingNo").val(routingNo);
  $("#edtBankName").val(localStorage.getItem("vs1companyBankName") || "");

  $("#edtCardNumber").val(cardnumber);
  $("#edtExpiryDate").val(
    cardexpiry ? moment(cardexpiry).format("DD/MM/YYYY") : ""
  );
  $("#edtCvc").val(cardcvc);

  if (showTrans == "true") {
    $(".showOnTransactions").prop("checked", true);
  } else {
    $(".showOnTransactions").prop("checked", false);
  }

  setTimeout(function () {
    $("#addNewAccount").modal("show");
  }, 500);
}

Template.newbankrule.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.bankRuleData = new ReactiveVar([]);
  templateObject.bankNames = new ReactiveVar([]);
  templateObject.bankDescription = new ReactiveVar();
  templateObject.importData = new ReactiveVar([]);
});

Template.newbankrule.onRendered(function () {
  const templateObject = Template.instance();
  templateObject.bankNames.set(bankNameList);
  templateObject.bankRuleData.set([]);
  $("#bankAccountName").editableSelect();
  $("#bankAccountName")
    .editableSelect()
    .on("click.editable-select", function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();
      var bankName = e.target.value || "";

      if (e.pageX > offset.left + $earch.width() - 8) {
        $("#bankNameModal").modal("show");
        $(".fullScreenSpin").css("display", "none");

      } else {
        if (bankName.replace(/\s/g, "") != "") {
          $("#bankNameModal").modal("show");
        } else {
          $("#bankNameModal").modal("show");
        }
      }
    });
    $(document).on("click", "#tblBankName tbody tr", function (e) {
      var table = $(this);
      let BankName = table.find(".colBankName").text();
      let BankDescription = table.find(".colDescription").text();
      let BankID = $('#tblBankName tr').index(this);
      templateObject.bankDescription.set(BankDescription);
      $('#bankNameModal').modal('hide');
      $('#bankAccountName').val(BankName);
      $('#bankAccountID').val(BankID);
    });

  if (FlowRouter.current().queryParams.bankaccountname) {
    let accountname = FlowRouter.current().queryParams.bankaccountname;
    let accountId = FlowRouter.current().queryParams.bankaccountid;
    $("#bankAccountName").val(accountname);
    $("#bankAccountID").val(accountId);
    getVS1Data("VS1_BankRule")
      .then(function (dataObject) {
        if (dataObject.length) {
          let data = JSON.parse(dataObject[0].data);
          for(let i = 0 ; i < data.vs1_bankrule.length; i ++)
            if(data.vs1_bankrule.bankname == accountname)
              return templateObject.bankRuleData.set(data.vs1_bankrule[i].bankname);
        }
      })
      .catch(function (err) {
        errorSaveCb(err);
      });
  }

  if (
    FlowRouter.current().queryParams.preview &&
    FlowRouter.current().queryParams.bankaccountname ===
      $("#bankAccountName").val()
  ) {
    let tmp = localStorage.getItem("BankStatement");
    if (tmp) {
      let tmpData = JSON.parse(tmp);
      templateObject.importData.set(tmpData);
      if (tmpData[0] && tmpData[0].length)
        templateObject.bankRuleData.set(
          tmpData[0].map((item, index) => ({ column: item, order: index + 1 }))
        );
    }
  }


  // Damien
  // Set focus when open account list modal
  $( "#bankNameModal" ).on('shown.bs.modal', function(){
    setTimeout(function() {
      $('#tblBankName_filter .form-control-sm').get(0).focus();
    }, 500);
  });
});

Template.newbankrule.events({
  "change .lineColumn": function (event) {
    let dataId = $(event.currentTarget).data("id");
    let tmp = Template.instance().bankRuleData.get();
    tmp[dataId].column = $(event.currentTarget).val();
    Template.instance().bankRuleData.set(tmp);
  },
  "blur .lineOrder": function (event) {
    let dataId = $(event.currentTarget).data("id");
    let tmp = Template.instance().bankRuleData.get();
    let tmpValue = $(event.currentTarget).val();
    if (tmpValue > 0 && tmpValue <= tmp.length) {
      for (let index = 0; index < tmp.length; index++) {
        if (tmp[index].order == tmpValue) {
          tmp[index].order = tmp[dataId].order;
          tmp[dataId].order = tmpValue;
          break;
        }
      }
      tmp[dataId].order = tmpValue;
    } else {
      $(event.currentTarget).val(tmp[dataId].order);
    }
    Template.instance().bankRuleData.set(tmp);
  },
  "click .btnRemove": function (event) {
    event.preventDefault();
    let dataId = $(event.currentTarget).data("id");
    let tmp = Template.instance().bankRuleData.get();
    tmp.splice(dataId, 1);
    Template.instance().bankRuleData.set(tmp);
  },
  "click #addLineColumn": function () {
    let noDataLine = null;
    noDataLine = $("#tblBankRule tbody #noData");
    if (noDataLine != null) {
      noDataLine.remove();
    }
    let tmp = Template.instance().bankRuleData.get();
    for (let index = 0; index < tmp.length + 1; index++) {
      if (tmp.findIndex((item) => item.order == index + 1) === -1) {
        tmp.push({ order: index + 1, column: "" });
        Template.instance().bankRuleData.set(tmp);
        break;
      }
    }
  },

  "click .btnSave": function (event) {
    let bankRuleData = Template.instance().bankRuleData.get();
    if (bankRuleData.length === 0) {
      swal("Please add columns", "", "error");
    } else if ($("#bankAccountName").val() === "") {
      swal("Please select bank account", "", "error");
    } else {
      let accountName = $("#bankAccountName").val();
      let bankID = $("#bankAccountID").val();
      let bankDescription = document.getElementById('tblBankName').rows[bankID].cells[1].innerHTML;
      let today = new Date();
      let saveData = {
        bankname: accountName,
        description: bankDescription,
        bankRuleData: bankRuleData,
        date: GlobalFunctions.formatDate(today),
      };
      getVS1Data("VS1_BankRule")
        .then(function (dataObject) {
          if (dataObject.length == 0) {
            addVS1Data("VS1_BankRule", JSON.stringify({vs1_bankrule: [saveData]}))
              .then(function (datareturn) {
                successSaveCb();
              })
              .catch(function (err) {
                errorSaveCb(err);
              });
          } else {
            let data = JSON.parse(dataObject[0].data);
            if(data.vs1_bankrule.length == undefined)
              data = {vs1_bankrule: [data]};
            data.vs1_bankrule.push(saveData);
            addVS1Data("VS1_BankRule", JSON.stringify(data))
              .then(function (datareturn) {
                successSaveCb();
              })
              .catch(function (err) {
                errorSaveCb(err);
              });
          }
        })
        .catch(function (err) {
          errorSaveCb(err);
        });
    }
  },

  "click .btnBack": function (event) {
    playCancelAudio();
    event.preventDefault();
    setTimeout(function () {
      history.back(1);
    }, delayTimeAfterSound);
  },
});

Template.newbankrule.helpers({
  bankRuleData: () => {
    return Template.instance().bankRuleData.get();
  },
  bankNames: () => {
    return Template.instance()
      .bankNames.get()
      .sort(function (a, b) {
        return a.name > b.name ? 1 : -1;
      });
  },
  previewColumn: () =>
    [...Template.instance().bankRuleData.get()].sort((a, b) =>
      a.order > b.order ? 1 : -1
    ),
  previewData: () => {
    let tmpCol = Template.instance().bankRuleData.get();
    let tmpData = [];
    let tmpImport = Template.instance().importData.get();
    for (let rowIndex = 1; rowIndex < tmpImport.length; rowIndex++) {
      let tmpRow = [];
      for (let colIndex = 0; colIndex < tmpCol.length; colIndex++) {
        let matchIndex = tmpCol.findIndex((item) => item.order == colIndex + 1);
        tmpRow.push(matchIndex === -1 ? null : tmpImport[rowIndex][matchIndex]);
      }
      tmpData.push(tmpRow);
    }
    return tmpData;
  },
});
