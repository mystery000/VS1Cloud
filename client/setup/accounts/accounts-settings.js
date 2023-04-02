import './accounts-settings.html'
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
import { UtilityService } from "../../utility-service";
import { SideBarService } from "../../js/sidebar-service";
import { AccountService } from "../../accounts/account-service";
import { ProductService } from "../../product/product-service";
import { SalesBoardService } from '../../js/sales-service';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

const sideBarService = new SideBarService();
const accountService = new AccountService();
const utilityService = new UtilityService();
const productService = new ProductService();
const clientService = new SalesBoardService();

// function MakeNegative() {
//   $("td").each(function () {
//     if (
//       $(this)
//         .text()
//         .indexOf("-" + Currency) >= 0
//     )
//       $(this).addClass("text-danger");
//   });
// }




Template.wizard_accounts.onCreated(() => {
  const templateObject = Template.instance();
  // Template.wizard_accounts.inheritsEventsFrom('non_transactional_list');
  // Template.wizard_accounts.inheritsHelpersFrom('non_transactional_list');
  templateObject.accountList = new ReactiveVar([]);
  templateObject.accountTypes = new ReactiveVar([]);

  templateObject.records = new ReactiveVar();
  templateObject.CleintName = new ReactiveVar();
  templateObject.Department = new ReactiveVar();
  templateObject.Date = new ReactiveVar();
  templateObject.DueDate = new ReactiveVar();
  templateObject.CreditNo = new ReactiveVar();
  templateObject.RefNo = new ReactiveVar();
  templateObject.Branding = new ReactiveVar();
  templateObject.Currency = new ReactiveVar();
  templateObject.Total = new ReactiveVar();
  templateObject.Subtotal = new ReactiveVar();
  templateObject.TotalTax = new ReactiveVar();
  templateObject.creditrecord = new ReactiveVar({});
  templateObject.taxrateobj = new ReactiveVar();
  templateObject.Accounts = new ReactiveVar([]);
  templateObject.CreditId = new ReactiveVar();
  templateObject.selectedCurrency = new ReactiveVar([]);
  templateObject.inputSelectedCurrency = new ReactiveVar([]);
  templateObject.currencySymbol = new ReactiveVar([]);
  templateObject.viarecords = new ReactiveVar();
  templateObject.termrecords = new ReactiveVar();
  templateObject.clientrecords = new ReactiveVar([]);
  templateObject.taxraterecords = new ReactiveVar([]);
  templateObject.uploadedFile = new ReactiveVar();
  templateObject.uploadedFiles = new ReactiveVar([]);
  templateObject.attachmentCount = new ReactiveVar();
  templateObject.address = new ReactiveVar();
  templateObject.abn = new ReactiveVar();
  templateObject.referenceNumber = new ReactiveVar();
  templateObject.statusrecords = new ReactiveVar([]);
  templateObject.statusrecords = new ReactiveVar([]);
  templateObject.transactiondatatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.getDataTableList = function(data) {
    let accBalance;
    if (!isNaN(data.Balance)) {
        accBalance = utilityService.modifynegativeCurrencyFormat(data.Balance) || 0.0;
    } else {
        accBalance = Currency + "0.00";
    }
    if (data.ReceiptCategory && data.ReceiptCategory != '') {
        usedCategories.push(data.fields);
    }
    let linestatus = '';
    if (data.Active == true) {
        linestatus = "";
    } else if (data.Active == false) {
        linestatus = "In-Active";
    };
    var dataList = [
        data.AccountID || "",
        data.AccountName || "",
        data.Description || "",
        data.AccountNumber || "",
        data.AccountType || "",
        accBalance || '',
        data.TaxCode || '',
        data.BankName || '',
        data.BankAccountName || '',
        data.BSB || '',
        data.BankAccountNumber || "",
        data.CarNumber || "",
        moment(data.ExpiryDate).format("DD/MM/YYYY") || "",
        data.CVC || "",
        data.Extra || "",
        data.BankNumber || "",
        data.IsHeader || false,
        data.AllowExpenseClaim || false,
        data.ReceiptCategory || "",
        linestatus,
        data.Level1 || "",
        data.Level2 || "",
        data.Level3 || "",
    ];
    return dataList;
}

let headerStructure = [
    { index: 0, label: '#ID', class: 'colAccountId', active: false, display: true, width: "60" },
    { index: 1, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "60" },
    { index: 2, label: 'Description', class: 'colDescription', active: true, display: true, width: "60" },
    { index: 3, label: 'Account No', class: 'colAccountNo', active: true, display: true, width: "60" },
    { index: 4, label: 'Type', class: 'colType', active: true, display: true, width: "60" },
    { index: 5, label: 'Balance', class: 'colBalance', active: true, display: true, width: "60" },
    { index: 6, label: '#Tax Code', class: 'colTaxCode', active: false, display: true, width: "60" },
    { index: 7, label: '#Bank Name', class: 'colBankName', active: false, display: true, width: "60" },
    { index: 8, label: 'Bank Acc Name', class: 'colBankAccountName', active: true, display: true, width: "60" },
    { index: 9, label: 'BSB', class: 'colBSB', active: true, display: true, width: "60" },
    { index: 10, label: 'Bank Acc No', class: 'colBankAccountNo', active: true, display: true, width: "60" },
    { index: 11, label: '#Card Number', class: 'colCardNumber', active: false, display: true, width: "60" },
    { index: 12, label: '#Expiry Date', class: 'colExpiryDate', active: false, display: true, width: "60" },
    { index: 13, label: '#CVC', class: 'colCVC', active: false, display: true, width: "60" },
    { index: 14, label: '#Swift Code', class: 'colExtra', active: false, display: true, width: "60" },
    { index: 15, label: '#Routing Number', class: 'colAPCANumber', active: false, display: true, width: "60" },
    { index: 16, label: '#Header', class: 'colIsHeader', active: false, display: true, width: "60" },
    { index: 17, label: '#Use Receipt Claim', class: 'colUseReceiptClaim', active: false, display: true, width: "60" },
    { index: 18, label: '#Category', class: 'colExpenseCategory', active: false, display: true, width: "60" },
    { index: 19, label: 'Status', class: 'colStatus', active: true, display: true, width: "60" },
    { index: 20, label: '#Level1', class: 'colLevel1', active: false, display: true, width: "60" },
    { index: 21, label: '#Level2', class: 'colLevel2', active: false, display: true, width: "60" },
    { index: 22, label: '#Level3', class: 'colLevel3', active: false, display: true, width: "60" },
];
templateObject.tableheaderrecords.set(headerStructure);
})

Template.wizard_accounts.onRendered(() => {
  const templateObject = Template.instance();
  templateObject.loadAccountTypes();
  templateObject.loadAccountList();
  templateObject.loadAllTaxCodes();

  // $("#tblAccountOverview tbody").on(
  //   "click",
  //   "tr .colAccountName, tr .colAccountName, tr .colDescription, tr .colAccountNo, tr .colType, tr .colTaxCode, tr .colBankAccountName, tr .colBSB, tr .colBankAccountNo, tr .colExtra, tr .colAPCANumber",
  //   function (event) {
  //     var listData = $(this).closest("tr").attr("id");
  //     if (listData) {
  //       $("#add-account-title").text("Edit Account Details");
  //       $("#edtAccountName").attr("readonly", true);
  //       $("#sltAccountType").attr("readonly", true);
  //       $("#sltAccountType").attr("disabled", "disabled");
  //       if (listData !== "") {
  //         listData = Number(listData);
  //         var accountid = listData || "";
  //         var accounttype =
  //           $(event.target)
  //             .closest("tr")
  //             .find(".colType")
  //             .attr("accounttype") || "";
  //         var accountname =
  //           $(event.target).closest("tr").find(".colAccountName").text() || "";
  //         var accountno =
  //           $(event.target).closest("tr").find(".colAccountNo").text() || "";
  //         var taxcode =
  //           $(event.target).closest("tr").find(".colTaxCode").text() || "";
  //         var accountdesc =
  //           $(event.target).closest("tr").find(".colDescription").text() || "";
  //         var bankaccountname =
  //           $(event.target).closest("tr").find(".colBankAccountName").text() ||
  //           "";
  //         var bankname =
  //           localStorage.getItem("vs1companyBankName") ||
  //           $(event.target).closest("tr").find(".colBankName").text() ||
  //           "";
  //         var bankbsb =
  //           $(event.target).closest("tr").find(".colBSB").text() || "";
  //         var bankacountno =
  //           $(event.target).closest("tr").find(".colBankAccountNo").text() ||
  //           "";

  //         var swiftCode =
  //           $(event.target).closest("tr").find(".colExtra").text() || "";
  //         var routingNo =
  //           $(event.target).closest("tr").find(".colAPCANumber").text() || "";

  //         var showTrans =
  //           $(event.target)
  //             .closest("tr")
  //             .find(".colAPCANumber")
  //             .attr("checkheader") || false;

  //         var cardnumber =
  //           $(event.target).closest("tr").find(".colCardNumber").text() || "";
  //         var cardexpiry =
  //           $(event.target).closest("tr").find(".colExpiryDate").text() || "";
  //         var cardcvc =
  //           $(event.target).closest("tr").find(".colCVC").text() || "";

  //         if (accounttype === "BANK") {
  //           $(".isBankAccount").removeClass("isNotBankAccount");
  //           $(".isCreditAccount").addClass("isNotCreditAccount");
  //         } else if (accounttype === "CCARD") {
  //           $(".isCreditAccount").removeClass("isNotCreditAccount");
  //           $(".isBankAccount").addClass("isNotBankAccount");
  //         } else {
  //           $(".isBankAccount").addClass("isNotBankAccount");
  //           $(".isCreditAccount").addClass("isNotCreditAccount");
  //         }

  //         $("#edtAccountID").val(accountid);
  //         $("#sltAccountType").val(accounttype);
  //         $("#edtAccountName").val(accountname);
  //         $("#edtAccountNo").val(accountno);
  //         $("#sltTaxCode").val(taxcode);
  //         $("#txaAccountDescription").val(accountdesc);
  //         $("#edtBankAccountName").val(bankaccountname);
  //         $("#edtBSB").val(bankbsb);
  //         $("#edtBankAccountNo").val(bankacountno);
  //         $("#swiftCode").val(swiftCode);
  //         $("#routingNo").val(routingNo);
  //         $("#edtBankName").val(bankname);

  //         $("#edtCardNumber").val(cardnumber);
  //         $("#edtExpiryDate").val(
  //           cardexpiry ? moment(cardexpiry).format("DD/MM/YYYY") : ""
  //         );
  //         $("#edtCvc").val(cardcvc);

  //         if (showTrans == "true") {
  //           $(".showOnTransactions").prop("checked", true);
  //         } else {
  //           $(".showOnTransactions").prop("checked", false);
  //         }
  //         $(this).closest("tr").attr("data-target", "#addNewAccount");
  //         $(this).closest("tr").attr("data-toggle", "modal");
  //       }
  //     }
  //   }
  // );

  // $(".btnAddNewAccounts").on('click', (event) => {
  //   $("#add-account-title").text("Add New Account");
  //   $("#edtAccountID").val("");
  //   $("#sltAccountType").val("");
  //   $("#sltAccountType").removeAttr("readonly", true);
  //   $("#sltAccountType").removeAttr("disabled", "disabled");
  //   $("#edtAccountName").val("");
  //   $("#edtAccountName").attr("readonly", false);
  //   $("#edtAccountNo").val("");
  //   $("#sltTaxCode").val("NT" || "");
  //   $("#txaAccountDescription").val("");
  //   $("#edtBankAccountName").val("");
  //   $("#edtBSB").val("");
  //   $("#edtBankAccountNo").val("");
  //   $("#routingNo").val("");
  //   $("#edtBankName").val("");
  //   $("#swiftCode").val("");
  //   $(".showOnTransactions").prop("checked", false);
  //   $(".isBankAccount").addClass("isNotBankAccount");
  //   $(".isCreditAccount").addClass("isNotCreditAccount");
  // })
 

  // $("#tblAccountOverview_filter input").on('keyup', (event) => {
  //   if (event.keyCode === 13) {
  //     $(".btnRefreshAccount").trigger("click");
  //   }
  // })


  // $("#sltStatus").on('change', (event) => {
  //   let status = $("#sltStatus").find(":selected").val();
  //   if (status === "newstatus") {
  //     $("#statusModal").modal();
  //   }
  // })

  // $(".btnSaveStatus").on('click', (event) => {
  //   playSaveAudio();
  //   setTimeout(function(){
  //     $(".fullScreenSpin").css("display", "inline-block");

  //     let status = $("#status").val();
  //     let leadData = {
  //       type: "TLeadStatusType",
  //       fields: {
  //         TypeName: status,
  //         KeyValue: status,
  //       },
  //     };

  //     if (status !== "") {
  //       clientService
  //         .saveLeadStatus(leadData)
  //         .then(function (objDetails) {
  //           sideBarService
  //             .getAllLeadStatus()
  //             .then(function (dataUpdate) {
  //               addVS1Data("TLeadStatusType", JSON.stringify(dataUpdate))
  //                 .then(function (datareturn) {
  //                   LoadingOverlay.hide();
  //                   let id = $(".printID").attr("id");
  //                   if (id !== "") {
  //                     window.open("/creditcard?id=" + id);
  //                   } else {
  //                     window.open("/creditcard");
  //                   }
  //                 })
  //                 .catch(function (err) {});
  //             })
  //             .catch(function (err) {
  //               window.open("/creditcard", "_self");
  //             });
  //         })
  //         .catch(function (err) {
  //           LoadingOverlay.hide();

  //           swal({
  //             title: "Oooops...",
  //             text: err,
  //             type: "error",
  //             showCancelButton: false,
  //             confirmButtonText: "Try Again",
  //           }).then((result) => {
  //             if (result.value) {
  //             } else if (result.dismiss === "cancel") {
  //             }
  //           });

  //           LoadingOverlay.hide();
  //         });
  //     } else {
  //       LoadingOverlay.hide();
  //       swal({
  //         title: "Please Enter Status",
  //         text: "Status field cannot be empty",
  //         type: "warning",
  //         showCancelButton: false,
  //         confirmButtonText: "Try Again",
  //       }).then((result) => {
  //         if (result.value) {
  //         } else if (result.dismiss === "cancel") {
  //         }
  //       });
  //     }
  //   }, delayTimeAfterSound);
  // })

  // $('.lineMemo').on('blur', (event) => {
  //   var targetID = $(event.target).closest("tr").attr("id");
  //   $("#" + targetID + " #lineMemo").text(
  //     $("#" + targetID + " .lineMemo").text()
  //   );
  // })

  // $('.colAmount').on('blur', (event) => {
  //   let templateObject = Template.instance();
  //   let taxcodeList = templateObject.taxraterecords.get();
  //   let utilityService = new UtilityService();
  //   var targetID = $(event.target).closest("tr").attr("id");
  //   if (!isNaN($(event.target).val())) {
  //     let inputUnitPrice = parseFloat($(event.target).val()) || 0;
  //     $(event.target).val(
  //       utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
  //     );
  //   } else {
  //     let inputUnitPrice =
  //       Number(
  //         $(event.target)
  //           .val()
  //           .replace(/[^0-9.-]+/g, "")
  //       ) || 0;

  //     $(event.target).val(
  //       utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
  //     );
  //   }
  //   let $tblrows = $("#tblCreditLine tbody tr");

  //   let $printrows = $(".credit_print tbody tr");

  //   if (
  //     $(".printID").attr("id") !== undefined ||
  //     $(".printID").attr("id") !== ""
  //   ) {
  //     $("#" + targetID + " #lineAmount").text(
  //       $("#" + targetID + " .colAmount").val()
  //     );
  //     $("#" + targetID + " #lineTaxCode").text(
  //       $("#" + targetID + " .lineTaxCode").text()
  //     );
  //   }

  //   let subGrandTotal = 0;
  //   let taxGrandTotal = 0;
  //   let taxGrandTotalPrint = 0;

  //   $tblrows.each(function (index) {
  //     var $tblrow = $(this);
  //     var amount = $tblrow.find(".colAmount").val() || "0";
  //     var taxcode = $tblrow.find(".lineTaxCode").text() || 0;
  //     var taxrateamount = 0;
  //     if (taxcodeList) {
  //       for (var i = 0; i < taxcodeList.length; i++) {
  //         if (taxcodeList[i].codename === taxcode) {
  //           taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
  //         }
  //       }
  //     }

  //     var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
  //     var taxTotal =
  //       parseFloat(amount.replace(/[^0-9.-]+/g, "")) *
  //       parseFloat(taxrateamount);
  //     $tblrow
  //       .find(".lineTaxAmount")
  //       .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
  //     if (!isNaN(subTotal)) {
  //       $tblrow
  //         .find(".colAmount")
  //         .val(utilityService.modifynegativeCurrencyFormat(subTotal));
  //       subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
  //       document.getElementById("subtotal_total").innerHTML =
  //         utilityService.modifynegativeCurrencyFormat(subGrandTotal);
  //     }

  //     if (!isNaN(taxTotal)) {
  //       taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
  //       document.getElementById("subtotal_tax").innerHTML =
  //         utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
  //     }

  //     if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
  //       let GrandTotal = parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
  //       document.getElementById("grandTotal").innerHTML =
  //         utilityService.modifynegativeCurrencyFormat(GrandTotal);
  //       document.getElementById("balanceDue").innerHTML =
  //         utilityService.modifynegativeCurrencyFormat(GrandTotal);
  //       document.getElementById("totalBalanceDue").innerHTML =
  //         utilityService.modifynegativeCurrencyFormat(GrandTotal);
  //     }
  //   });

  //   if ($(".printID").attr("id") !== undefined || $(".printID").attr("id") !== "") {
  //     $printrows.each(function (index) {
  //       var $printrows = $(this);
  //       var amount = $printrows.find("#lineAmount").text() || "0";
  //       var taxcode = $printrows.find("#lineTaxCode").text() || 0;

  //       var taxrateamount = 0;
  //       if (taxcodeList) {
  //         for (var i = 0; i < taxcodeList.length; i++) {
  //           if (taxcodeList[i].codename === taxcode) {
  //             taxrateamount =
  //               taxcodeList[i].coderate.replace("%", "") / 100 || 0;
  //           }
  //         }
  //       }

  //       var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
  //       var taxTotal =
  //         parseFloat(amount.replace(/[^0-9.-]+/g, "")) *
  //         parseFloat(taxrateamount);
  //       $printrows
  //         .find("#lineTaxAmount")
  //         .text(utilityService.modifynegativeCurrencyFormat(taxTotal));

  //       if (!isNaN(subTotal)) {
  //         $printrows
  //           .find("#lineAmt")
  //           .text(utilityService.modifynegativeCurrencyFormat(subTotal));
  //         subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
  //         document.getElementById("subtotal_totalPrint").innerHTML =
  //           $("#subtotal_total").text();
  //       }

  //       if (!isNaN(taxTotal)) {
  //         taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
  //       }
  //       if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
  //         let GrandTotal =
  //           parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
  //         document.getElementById("grandTotalPrint").innerHTML =
  //           $("#grandTotal").text();
  //         document.getElementById("totalBalanceDuePrint").innerHTML =
  //           $("#totalBalanceDue").text();
  //       }
  //     });
  //   }
  // })

  // $('#btnCustomFileds').on('click', (event) => {
  //   var x = document.getElementById("divCustomFields");
  //   if (x.style.display === "none") {
  //     x.style.display = "block";
  //   } else {
  //     x.style.display = "none";
  //   }
  // })

  // $(".lineAccountName").on('click', (event) => {
  //   $("#tblCreditLine tbody tr .lineAccountName").attr("data-toggle", "modal");
  //   $("#tblCreditLine tbody tr .lineAccountName").attr(
  //     "data-target",
  //     "#accountListModal"
  //   );
  //   var targetID = $(event.target).closest("tr").attr("id");
  //   $("#selectLineID").val(targetID);

  //   setTimeout(function () {
  //     $("#tblAccount_filter .form-control-sm").focus();
  //   }, 500);
  // })

  // $("#accountListModal #refreshpagelist").on('click', () => {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   let templateObject = Template.instance();
  //   templateObject.getAllAccountss();
  // })

  // $(".lineTaxRate").on('click', (event) => {
  //   $("#tblCreditLine tbody tr .lineTaxRate").attr("data-toggle", "modal");
  //   $("#tblCreditLine tbody tr .lineTaxRate").attr(
  //     "data-target",
  //     "#taxRateListModal"
  //   );
  //   var targetID = $(event.target).closest("tr").attr("id");
  //   $("#selectLineID").val(targetID);
  // })

  // $(".lineTaxCode").on("click", (event) => {
  //   $("#tblCreditLine tbody tr .lineTaxCode").attr("data-toggle", "modal");
  //   $("#tblCreditLine tbody tr .lineTaxCode").attr(
  //     "data-target",
  //     "#taxRateListModal"
  //   );
  //   var targetID = $(event.target).closest("tr").attr("id");
  //   $("#selectLineID").val(targetID);
  // })


  // $('.lineQty, keydown .lineUnitPrice, keydown .lineAmount').on('keydown', (event) => {
  //   if (
  //     $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
  //     (event.keyCode === 65 &&
  //       (event.ctrlKey === true || event.metaKey === true)) ||
  //     (event.keyCode >= 35 && event.keyCode <= 40)
  //   ) {
  //     return;
  //   }

  //   if (event.shiftKey === true) {
  //     event.preventDefault();
  //   }
  //   if (
  //     (event.keyCode >= 48 && event.keyCode <= 57) ||
  //     (event.keyCode >= 96 && event.keyCode <= 105) ||
  //     event.keyCode === 8 ||
  //     event.keyCode === 9 ||
  //     event.keyCode === 37 ||
  //     event.keyCode === 39 ||
  //     event.keyCode === 46 ||
  //     event.keyCode === 190 ||
  //     event.keyCode === 189 ||
  //     event.keyCode === 109
  //   ) {
  //   } else {
  //     event.preventDefault();
  //   }
  // })

  // $(".chkAccountName").on("click", (event) => {
  //   if ($(event.target).is(":checked")) {
  //     $(".colAccountName").css("display", "table-cell");
  //     $(".colAccountName").css("padding", ".75rem");
  //     $(".colAccountName").css("vertical-align", "top");
  //   } else {
  //     $(".colAccountName").css("display", "none");
  //   }
  // })

  // $('.chkMemo').on('click', (event) => {
  //   if ($(event.target).is(":checked")) {
  //     $(".colMemo").css("display", "table-cell");
  //     $(".colMemo").css("padding", ".75rem");
  //     $(".colMemo").css("vertical-align", "top");
  //   } else {
  //     $(".colMemo").css("display", "none");
  //   }
  // })

  // $(".chkAmount").on("click", (event) => {
  //   if ($(event.target).is(":checked")) {
  //     $(".colAmount").css("display", "table-cell");
  //     $(".colAmount").css("padding", ".75rem");
  //     $(".colAmount").css("vertical-align", "top");
  //   } else {
  //     $(".colAmount").css("display", "none");
  //   }
  // })

  // $(".chkTaxRate").on('click', (event) => {
  //   if ($(event.target).is(":checked")) {
  //     $(".colTaxRate").css("display", "table-cell");
  //     $(".colTaxRate").css("padding", ".75rem");
  //     $(".colTaxRate").css("vertical-align", "top");
  //   } else {
  //     $(".colTaxRate").css("display", "none");
  //   }
  // })
  // $(".chkTaxCode").on("click", (event) => {
  //   if ($(event.target).is(":checked")) {
  //     $(".colTaxCode").css("display", "table-cell");
  //     $(".colTaxCode").css("padding", ".75rem");
  //     $(".colTaxCode").css("vertical-align", "top");
  //   } else {
  //     $(".colTaxCode").css("display", "none");
  //   }
  // })

  // $(".chkCustomField1").on("click", (event) => {
  //   if ($(event.target).is(":checked")) {
  //     $(".colCustomField1").css("display", "table-cell");
  //     $(".colCustomField1").css("padding", ".75rem");
  //     $(".colCustomField1").css("vertical-align", "top");
  //   } else {
  //     $(".colCustomField1").css("display", "none");
  //   }
  // })

  // $(".chkCustomField2").on('click', (event) => {
  //   if ($(event.target).is(":checked")) {
  //     $(".colCustomField2").css("display", "table-cell");
  //     $(".colCustomField2").css("padding", ".75rem");
  //     $(".colCustomField2").css("vertical-align", "top");
  //   } else {
  //     $(".colCustomField2").css("display", "none");
  //   }
  // })

  // $(".rngRangeAccountName").on('change', (event) => {
  //   let range = $(event.target).val();
  //   $(".spWidthAccountName").html(range + "%");
  //   $(".colAccountName").css("width", range + "%");
  // })


  // $(".rngRangeMemo").on('change', (event) => {
  //   let range = $(event.target).val();
  //   $(".spWidthMemo").html(range + "%");
  //   $(".colMemo").css("width", range + "%");
  // })

  // $(".rngRangeAmount").on("change", (event) => {
  //   let range = $(event.target).val();
  //   $(".spWidthAmount").html(range + "%");
  //   $(".colAmount").css("width", range + "%");
  // })
  // $(".rngRangeTaxRate").on('change', (event) => {
  //   let range = $(event.target).val();
  //   $(".spWidthTaxRate").html(range + "%");
  //   $(".colTaxRate").css("width", range + "%");
  // })
  // $('.rngRangeTaxCode').on("change", (event) => {
  //   let range = $(event.target).val();
  //   $(".spWidthTaxCode").html(range + "%");
  //   $(".colTaxCode").css("width", range + "%");
  // })

  // $(".rngRangeCustomField1").on('change', (event) => {
  //   let range = $(event.target).val();
  //   $(".spWidthCustomField1").html(range + "%");
  //   $(".colCustomField1").css("width", range + "%");
  // })

  // $(".rngRangeCustomField2").on('change', (event) => {
  //   let range = $(event.target).val();
  //   $(".spWidthCustomField2").html(range + "%");
  //   $(".colCustomField2").css("width", range + "%");
  // })

  // $(".divcolumnAccount").on('blur', (event) => {
  //   let columData = $(event.target).html();
  //   let columHeaderUpdate = $(event.target).attr("valueupdate");
  //   $("" + columHeaderUpdate + "").html(columData);
  // })

  // $(".btnSaveGridSettings").on('click', (event) => {
  //   playSaveAudio();
  //   setTimeout(function(){
  //     let lineItems = [];

  //     $(".columnSettings").each(function (index) {
  //       var $tblrow = $(this);
  //       var colTitle = $tblrow.find(".divcolumnAccount").text() || "";
  //       var colWidth = $tblrow.find(".custom-range").val() || 0;
  //       var colthClass =
  //         $tblrow.find(".divcolumnAccount").attr("valueupdate") || "";
  //       var colHidden = false;
  //       colHidden = !$tblrow.find(".custom-control-input").is(":checked");
  //       let lineItemObj = {
  //         index: index,
  //         label: colTitle,
  //         hidden: colHidden,
  //         width: colWidth,
  //         thclass: colthClass,
  //       };

  //       lineItems.push(lineItemObj);
  //     });

  //     var getcurrentCloudDetails = CloudUser.findOne({
  //       _id: localStorage.getItem("mycloudLogonID"),
  //       clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
  //     });
  //     if (getcurrentCloudDetails) {
  //       if (getcurrentCloudDetails._id.length > 0) {
  //         var clientID = getcurrentCloudDetails._id;
  //         var clientUsername = getcurrentCloudDetails.cloudUsername;
  //         var clientEmail = getcurrentCloudDetails.cloudEmail;
  //         var checkPrefDetails = CloudPreference.findOne({
  //           userid: clientID,
  //           PrefName: "tblCreditLine",
  //         });
  //         if (checkPrefDetails) {
  //           CloudPreference.update(
  //             {
  //               _id: checkPrefDetails._id,
  //             },
  //             {
  //               $set: {
  //                 userid: clientID,
  //                 username: clientUsername,
  //                 useremail: clientEmail,
  //                 PrefGroup: "purchaseform",
  //                 PrefName: "tblCreditLine",
  //                 published: true,
  //                 customFields: lineItems,
  //                 updatedAt: new Date(),
  //               },
  //             },
  //             function (err, idTag) {
  //               if (err) {
  //                 $("#myModal2").modal("toggle");
  //               } else {
  //                 $("#myModal2").modal("toggle");
  //               }
  //             }
  //           );
  //         } else {
  //           CloudPreference.insert(
  //             {
  //               userid: clientID,
  //               username: clientUsername,
  //               useremail: clientEmail,
  //               PrefGroup: "purchaseform",
  //               PrefName: "tblCreditLine",
  //               published: true,
  //               customFields: lineItems,
  //               createdAt: new Date(),
  //             },
  //             function (err, idTag) {
  //               if (err) {
  //                 $("#myModal2").modal("toggle");
  //               } else {
  //                 $("#myModal2").modal("toggle");
  //               }
  //             }
  //           );
  //         }
  //       }
  //     }
  //     $("#myModal2").modal("toggle");
  //   }, delayTimeAfterSound);
  // })

  // $(".btnResetGridSettings").on('click', (event) => {
  //   var getcurrentCloudDetails = CloudUser.findOne({
  //     _id: localStorage.getItem("mycloudLogonID"),
  //     clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
  //   });
  //   if (getcurrentCloudDetails) {
  //     if (getcurrentCloudDetails._id.length > 0) {
  //       var clientID = getcurrentCloudDetails._id;
  //       var checkPrefDetails = CloudPreference.findOne({
  //         userid: clientID,
  //         PrefName: "tblCreditLine",
  //       });
  //       if (checkPrefDetails) {
  //         CloudPreference.remove(
  //           {
  //             _id: checkPrefDetails._id,
  //           },
  //           function (err, idTag) {
  //             if (err) {
  //             } else {
  //               Meteor._reload.reload();
  //             }
  //           }
  //         );
  //       }
  //     }
  //   }
  // })

  // $(".btnResetSettings").on("click", (event) => {
  //   var getcurrentCloudDetails = CloudUser.findOne({
  //     _id: localStorage.getItem("mycloudLogonID"),
  //     clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
  //   });
  //   if (getcurrentCloudDetails) {
  //     if (getcurrentCloudDetails._id.length > 0) {
  //       var clientID = getcurrentCloudDetails._id;
  //       var checkPrefDetails = CloudPreference.findOne({
  //         userid: clientID,
  //         PrefName: "creditcard",
  //       });
  //       if (checkPrefDetails) {
  //         CloudPreference.remove(
  //           {
  //             _id: checkPrefDetails._id,
  //           },
  //           function (err, idTag) {
  //             if (err) {
  //             } else {
  //               // Meteor._reload.reload();
  //             }
  //           }
  //         );
  //       }
  //     }
  //   }
  // })

  // $("#btnRefreshAccount").on('click', () => {
  //   $(".fullScreenSpin").css("display", "inline-block");
  //   location.reload();
  // })
  
})

Template.wizard_accounts.events({
  
  "click .btnRefreshList": function () {
      $(".btnRefresh").trigger("click");
  },
  "click .btnRefresh": function() {
      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();

      sideBarService.getAccountListVS1().then(function(data) {
              addVS1Data("TAccountVS1", JSON.stringify(data)).then(function(datareturn) {
                sideBarService.getAllTAccountVS1List(initialBaseDataLoad, 0,false).then(function(dataAccount) {
                        addVS1Data("TAccountVS1List", JSON.stringify(dataAccount)).then(function(datareturn) {
                                //window.open("/accountsoverview", "_self");
                            }).catch(function(err) {
                                //window.open("/accountsoverview", "_self");
                            });
                    }).catch(function(err) {
                        //window.open("/accountsoverview", "_self");
                    });
                  }).catch(function(err) {
                      //window.open("/accountsoverview", "_self");
                  });
          }).catch(function(err) {
              //window.open("/accountsoverview", "_self");
          });
  },
  
  "click .btnAddNewAccounts": function() {
      $("#add-account-title").text("Add New Account");
      $("#edtAccountID").val("");
      $("#sltAccountType").val("");
      $("#sltAccountType").removeAttr("readonly", true);
      $("#sltAccountType").removeAttr("disabled", "disabled");
      $("#edtAccountName").val("");
      $("#edtAccountName").attr("readonly", false);
      $("#edtAccountNo").val("");
      $("#sltTaxCode").val("NT" || "");
      $("#txaAccountDescription").val("");
      $("#edtBankAccountName").val("");
      $("#edtBSB").val("");
      $("#edtBankAccountNo").val("");
      $("#routingNo").val("");
      $("#edtBankName").val("");
      $("#swiftCode").val("");
      $(".showOnTransactions").prop("checked", false);
      $(".useReceiptClaim").prop("checked", false);
      $("#expenseCategory").val("");
      // let availableCategories = Template.instance().availableCategories.get();
      // let cateogoryHtml = "";
      // availableCategories.forEach(function(item) {
      //     cateogoryHtml += '<option value="' + item + '">' + item + '</option>';
      // });
      // $("#expenseCategory").empty();
      // $("#expenseCategory").append(cateogoryHtml);
      // if (cateogoryHtml == "") {
      //     $("#expenseCategory").attr("readonly", true);
      //     $("#expenseCategory").attr("disabled", "disabled");
      // } else {
      //     $("#expenseCategory").removeAttr("readonly", true);
      //     $("#expenseCategory").removeAttr("disabled", "disabled");
      // }
      $(".isBankAccount").addClass("isNotBankAccount");
      $(".isCreditAccount").addClass("isNotCreditAccount");
  },
  "click .templateDownload": function() {
      let utilityService = new UtilityService();
      let rows = [];
      const filename = "SampleAccounts" + ".csv";
      rows[0] = [
          "Account Name",
          "Description",
          "Account No",
          "Type",
          "Balance",
          "Tax Code",
          "Bank Acc Name",
          "BSB",
          "Bank Acc No",
      ];
      rows[1] = [
          "Test Act",
          "Description 1",
          "12345",
          "AP",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[2] = [
          "Test Act 2",
          "Description 2",
          "5678",
          "AR",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[3] = [
          "Test Act 3 ",
          "Description 3",
          "6754",
          "EQUITY",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[4] = [
          "Test Act 4",
          "Description 4",
          "34567",
          "BANK",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[5] = [
          "Test Act 5",
          "Description 5",
          "8954",
          "COGS",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[6] = [
          "Test Act 6",
          "Description 6",
          "2346",
          "CCARD",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[7] = [
          "Test Act 7",
          "Description 7",
          "985454",
          "EXP",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[8] = [
          "Test Act 8",
          "Description 8",
          "34567",
          "FIXASSET",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[9] = [
          "Test Act 9",
          "Description 9",
          "9755",
          "INC",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[10] = [
          "Test Act 10",
          "Description 10",
          "8765",
          "LTLIAB",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[11] = [
          "Test Act 11",
          "Description 11",
          "7658",
          "OASSET",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[12] = [
          "Test Act 12",
          "Description 12",
          "6548",
          "OCASSET",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[13] = [
          "Test Act 13",
          "Description 13",
          "5678",
          "OCLIAB",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[14] = [
          "Test Act 14",
          "Description 14",
          "4761",
          "EXEXP",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      rows[15] = [
          "Test Act 15",
          "Description 15",
          "3456",
          "EXINC",
          "0.00",
          "NT",
          "",
          "",
          "",
      ];
      utilityService.exportToCsv(rows, filename, "csv");
  },

  "click .templateDownloadXLSX": function(e) {
      e.preventDefault(); //stop the browser from following
      window.location.href = "sample_imports/SampleAccounts.xlsx";
  },
  "click .btnUploadFile": function(event) {
      $("#attachment-upload").val("");
      $(".file-name").text("");
      // $(".btnImport").removeAttr("disabled");
      $("#attachment-upload").trigger("click");
  },
  "change #attachment-upload": function(e) {
      let templateObj = Template.instance();
      var filename = $("#attachment-upload")[0].files[0]["name"];
      var fileExtension = filename.split(".").pop().toLowerCase();
      var validExtensions = ["csv", "txt", "xlsx"];
      var validCSVExtensions = ["csv", "txt"];
      var validExcelExtensions = ["xlsx", "xls"];

      if (validExtensions.indexOf(fileExtension) == -1) {
          swal(
              "Invalid Format",
              "formats allowed are :" + validExtensions.join(", "),
              "error"
          );
          $(".file-name").text("");
          $(".btnImport").Attr("disabled");
      } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
          $(".file-name").text(filename);
          let selectedFile = event.target.files[0];

          templateObj.selectedFile.set(selectedFile);
          if ($(".file-name").text() != "") {
              $(".btnImport").removeAttr("disabled");
          } else {
              $(".btnImport").Attr("disabled");
          }
      } else if (fileExtension == "xlsx") {
          $(".file-name").text(filename);
          let selectedFile = event.target.files[0];
          var oFileIn;
          var oFile = selectedFile;
          var sFilename = oFile.name;
          // Create A File Reader HTML5
          var reader = new FileReader();

          // Ready The Event For When A File Gets Selected
          reader.onload = function(e) {
              var data = e.target.result;
              data = new Uint8Array(data);
              var workbook = XLSX.read(data, {
                  type: "array",
              });

              var result = {};
              workbook.SheetNames.forEach(function(sheetName) {
                  var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                      header: 1,
                  });
                  var sCSV = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                  templateObj.selectedFile.set(sCSV);

                  if (roa.length) result[sheetName] = roa;
              });
              // see the result, caution: it works after reader event is done.
          };
          reader.readAsArrayBuffer(oFile);

          if ($(".file-name").text() != "") {
              $(".btnImport").removeAttr("disabled");
          } else {
              $(".btnImport").Attr("disabled");
          }
      }
  },
  "click .btnImport": function() {
      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      let accountService = new AccountService();
      let objDetails;
      var filename = $("#attachment-upload")[0].files[0]["name"];
      var fileType = filename.split(".").pop().toLowerCase();

      if (fileType == "csv" || fileType == "txt" || fileType == "xlsx") {
          Papa.parse(templateObject.selectedFile.get(), {
              complete: function(results) {
                  if (results.data.length > 0) {
                      if (
                          results.data[0][0] == "Account Name" &&
                          results.data[0][1] == "Description" &&
                          results.data[0][2] == "Account No" &&
                          results.data[0][3] == "Type" &&
                          results.data[0][4] == "Balance" &&
                          results.data[0][5] == "Tax Code" &&
                          results.data[0][6] == "Bank Acc Name" &&
                          results.data[0][7] == "BSB" &&
                          results.data[0][8] == "Bank Acc No"
                      ) {
                          let dataLength = results.data.length * 500;
                          setTimeout(function() {
                              // $('#importModal').modal('toggle');
                              //Meteor._reload.reload();
                              sideBarService
                                  .getAccountListVS1()
                                  .then(function(dataReload) {
                                      addVS1Data("TAccountVS1", JSON.stringify(dataReload))
                                          .then(function(datareturn) {
                                              window.open("/accountsoverview", "_self");
                                          })
                                          .catch(function(err) {
                                              window.open("/accountsoverview", "_self");
                                          });
                                  })
                                  .catch(function(err) {
                                      window.open("/accountsoverview", "_self");
                                  });
                          }, parseInt(dataLength));
                          for (let i = 0; i < results.data.length - 1; i++) {
                              objDetails = {
                                  type: "TAccount",
                                  fields: {
                                      Active: true,
                                      AccountName: results.data[i + 1][0],
                                      Description: results.data[i + 1][1],
                                      AccountNumber: results.data[i + 1][2],
                                      AccountTypeName: results.data[i + 1][3],
                                      Balance: Number(
                                          results.data[i + 1][4].replace(/[^0-9.-]+/g, "")
                                      ) || 0,
                                      TaxCode: results.data[i + 1][5],
                                      BankAccountName: results.data[i + 1][6],
                                      BSB: results.data[i + 1][7],
                                      BankAccountNumber: results.data[i + 1][8],
                                      PublishOnVS1: true,
                                  },
                              };
                              if (results.data[i + 1][1]) {
                                  if (results.data[i + 1][1] !== "") {
                                      accountService
                                          .saveAccount(objDetails)
                                          .then(function(data) {})
                                          .catch(function(err) {
                                              //$('.fullScreenSpin').css('display','none');
                                              swal({
                                                  title: "Oooops...",
                                                  text: err,
                                                  type: "error",
                                                  showCancelButton: false,
                                                  confirmButtonText: "Try Again",
                                              }).then((result) => {
                                                  if (result.value) {
                                                      Meteor._reload.reload();
                                                  } else if (result.dismiss === "cancel") {}
                                              });
                                          });
                                  }
                              }
                          }
                      } else {
                          $(".fullScreenSpin").css("display", "none");
                          swal(
                              "Invalid Data Mapping fields ",
                              "Please check that you are importing the correct file with the correct column headers.",
                              "error"
                          );
                      }
                  } else {
                      $(".fullScreenSpin").css("display", "none");
                      swal(
                          "Invalid Data Mapping fields ",
                          "Please check that you are importing the correct file with the correct column headers.",
                          "error"
                      );
                  }
              },
          });
      } else {}
  },
  "click .btnDeleteAccount": function() {
      playDeleteAudio();
      let templateObject = Template.instance();
      let accountService = new AccountService();
      swal({
          title: "Delete Account",
          text: "Are you sure you want to Delete Account?",
          type: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
      }).then((result) => {
          if (result.value) {
              $(".fullScreenSpin").css("display", "inline-block");
              let accountID = $("#edtAccountID").val();
              if (accountID === "") {
                  window.open("/accountsoverview", "_self");
              } else {
                  let data = {
                      type: "TAccount",
                      fields: {
                          ID: accountID,
                          Active: false,
                      },
                  };

                  accountService
                      .saveAccount(data)
                      .then(function(data) {
                          sideBarService
                              .getAccountListVS1()
                              .then(function(dataReload) {
                                  addVS1Data("TAccountVS1", JSON.stringify(dataReload))
                                      .then(function(datareturn) {
                                          window.open("/accountsoverview", "_self");
                                      })
                                      .catch(function(err) {
                                          window.open("/accountsoverview", "_self");
                                      });
                              })
                              .catch(function(err) {
                                  window.open("/accountsoverview", "_self");
                              });
                      })
                      .catch(function(err) {
                          swal({
                              title: "Oooops...",
                              text: err,
                              type: "error",
                              showCancelButton: false,
                              confirmButtonText: "Try Again",
                          }).then((result) => {
                              if (result.value) {
                                  Meteor._reload.reload();
                              } else if (result.dismiss === "cancel") {}
                          });
                          $(".fullScreenSpin").css("display", "none");
                      });
              }
          } else {}
      });
  },
  'click #tblCategory tbody tr': function(e) {
      let category = $(e.target).closest('tr').find(".colReceiptCategory").text() || '';
      let accountName = $(e.target).closest('tr').find(".colAccountName").text() || '';
      let accountID = $(e.target).closest('tr').find(".colAccountID").text() || '';

      $('#expenseCategory').val(category);
      $('#categoryAccountID').val(accountID);
      $('#categoryAccountName').val(accountName);

      $('#categoryListModal').modal('toggle');
  },
  'click .btnRefreshCategoryAccount': function(event) {
      $('.fullScreenSpin').css('display', 'inline-block');
      const splashArrayAccountList = [];
      let receiptService = new ReceiptService();
      let sideBarService = new SideBarService();
      let dataSearchName = $('#tblCategory_filter input').val();
      let categories = [];
      if (dataSearchName.replace(/\s/g, '') !== '') {
          receiptService.getSearchReceiptCategoryByName(dataSearchName).then(function(data) {
              if (data.treceiptcategory.length > 0) {
                  for (let i in data.treceiptcategory) {
                      if (data.treceiptcategory.hasOwnProperty(i)) {
                          categories.push(data.treceiptcategory[i].fields.CategoryName);
                      }
                  }
                  let usedCategories = [];
                  sideBarService.getAccountListVS1().then(function(data) {
                      if (data.taccountvs1.length > 0) {
                          for (let i = 0; i < data.taccountvs1.length; i++) {
                              if (data.taccountvs1[i].fields.ReceiptCategory && data.taccountvs1[i].fields.ReceiptCategory != '') {
                                  usedCategories.push(data.taccountvs1[i].fields);
                              }
                          }
                          usedCategories = [...new Set(usedCategories)];
                          categories.forEach((citem, j) => {
                              let cdataList = null;
                              let match = usedCategories.filter((item) => (item.ReceiptCategory == citem));
                              if (match.length > 0) {
                                  let temp = match[0];
                                  cdataList = [
                                      citem,
                                      temp.AccountName || '',
                                      temp.Description || '',
                                      temp.AccountNumber || '',
                                      temp.TaxCode || '',
                                      temp.ID || ''
                                  ];
                              } else {
                                  cdataList = [
                                      citem,
                                      '',
                                      '',
                                      '',
                                      '',
                                      ''
                                  ];
                              }
                              splashArrayAccountList.push(cdataList);
                          });
                          const datatable = $('#tblCategory').DataTable();
                          datatable.clear();
                          datatable.rows.add(splashArrayAccountList);
                          datatable.draw(false);
                      }
                      $('.fullScreenSpin').css('display', 'none');
                  }).catch(function(err) {
                      $('.fullScreenSpin').css('display', 'none');
                  })
              } else {
                  $('.fullScreenSpin').css('display', 'none');
                  $('#categoryListModal').modal('toggle');
                  swal({
                      title: 'Question',
                      text: "Category does not exist, would you like to create it?",
                      type: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'Yes',
                      cancelButtonText: 'No'
                  }).then((result) => {
                      if (result.value) {
                          $('#addReceiptCategoryModal').modal('toggle');
                          $('#edtReceiptCategoryName').val(dataSearchName);
                      } else if (result.dismiss === 'cancel') {
                          $('#categoryListModal').modal('toggle');
                      }
                  });
              }
          }).catch(function(err) {
              $('.fullScreenSpin').css('display', 'none');
          });
      } else {
          sideBarService.getReceiptCategory().then(function(data) {
              if (data.treceiptcategory.length > 0) {
                  for (let i in data.treceiptcategory) {
                      if (data.treceiptcategory.hasOwnProperty(i)) {
                          categories.push(data.treceiptcategory[i].CategoryName);
                      }
                  }
                  let usedCategories = [];
                  sideBarService.getAccountListVS1().then(function(data) {
                      if (data.taccountvs1.length > 0) {
                          for (let i = 0; i < data.taccountvs1.length; i++) {
                              if (data.taccountvs1[i].fields.ReceiptCategory && data.taccountvs1[i].fields.ReceiptCategory != '') {
                                  usedCategories.push(data.taccountvs1[i].fields);
                              }
                          }
                          usedCategories = [...new Set(usedCategories)];
                          categories.forEach((citem, j) => {
                              let cdataList = null;
                              let match = usedCategories.filter((item) => (item.ReceiptCategory == citem));
                              if (match.length > 0) {
                                  let temp = match[0];
                                  cdataList = [
                                      citem,
                                      temp.AccountName || '',
                                      temp.Description || '',
                                      temp.AccountNumber || '',
                                      temp.TaxCode || '',
                                      temp.ID || ''
                                  ];
                              } else {
                                  cdataList = [
                                      citem,
                                      '',
                                      '',
                                      '',
                                      '',
                                      ''
                                  ];
                              }
                              splashArrayAccountList.push(cdataList);
                          });
                          const datatable = $('#tblCategory').DataTable();
                          datatable.clear();
                          datatable.rows.add(splashArrayAccountList);
                          datatable.draw(false);
                          $('.fullScreenSpin').css('display', 'none');
                      }
                  }).catch(function(err) {
                      $('.fullScreenSpin').css('display', 'none');
                  })
              }
              $('.fullScreenSpin').css('display', 'none');
          }).catch(function(err) {
              $('.fullScreenSpin').css('display', 'none');
          });
      }
  },
  "click .btnViewDeleted": async function(e) {
      $(".fullScreenSpin").css("display", "inline-block");
      e.stopImmediatePropagation();
      const templateObject = Template.instance();
      await clearData('TAccountVS1List');
      templateObject.getAccountsOverviewData(true);
  },
  "click .btnHideDeleted": async function(e) {
      $(".fullScreenSpin").css("display", "inline-block");
      e.stopImmediatePropagation();
      let templateObject = Template.instance();
      await clearData('TAccountVS1List');
      templateObject.getAccountsOverviewData(false);
  },
});


Template.wizard_accounts.helpers({
  
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function(a, b) {
        if (a.accountname === "NA") {
            return 1;
        } else if (b.accountname === "NA") {
            return -1;
        }
        return a.accountname.toUpperCase() > b.accountname.toUpperCase() ? 1 : -1;
    });
},
bsbRegionName: () => {
    let bsbname = "Branch Code";
    if (localStorage.getItem("ERPLoggedCountry") === "Australia") {
        bsbname = "BSB";
    }
    return bsbname;
},
tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
},
salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
        userid: localStorage.getItem("mycloudLogonID"),
        PrefName: "tblAccountOverview",
    });
},
taxraterecords: () => {
    return Template.instance().taxraterecords.get().sort(function(a, b) {
        if (a.description === "NA") {
            return 1;
        } else if (b.description === "NA") {
            return -1;
        }
        return a.description.toUpperCase() > b.description.toUpperCase() ? 1 : -1;
    });
},
isBankAccount: () => {
    return Template.instance().isBankAccount.get();
},
loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
},
lastBatchUpdate: () => {
    let transactionTableLastUpdated = "";
    var currentDate = new Date();
    if (localStorage.getItem('VS1TransTableUpdate')) {
        transactionTableLastUpdated = moment(localStorage.getItem('VS1TransTableUpdate')).format("ddd MMM D, YYYY, hh:mm A");
    } else {
        transactionTableLastUpdated = moment(currentDate).format("ddd MMM D, YYYY, hh:mm A");
    }
    return transactionTableLastUpdated;
},
isSetupFinished: () => {
    return Template.instance().setupFinished.get();
},
getSkippedSteps() {
    let setupUrl = localStorage.getItem("VS1Cloud_SETUP_SKIPPED_STEP") || JSON.stringify().split();
    return setupUrl[1];
},

// custom fields displaysettings
displayfields: () => {
  return Template.instance().displayfields.get();
},
treeColumnHeader: () => {
    return Template.instance().treeColumnHeader.get();
},

apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getAllTAccountVS1List;
},

searchAPI: function() {
    return sideBarService.getAllTAccountVS1List;
},

service: ()=>{
    let sideBarService = new SideBarService();
    return sideBarService;

},

datahandler: function () {
    let templateObject = Template.instance();
    return function(data) {
        let dataReturn =  templateObject.getDataTableList(data)
        return dataReturn
    }
},

exDataHandler: function() {
    let templateObject = Template.instance();
    return function(data) {
        let dataReturn =  templateObject.getDataTableList(data)
        return dataReturn
    }
},

apiParams: function() {
    return ["limitCount", "limitFrom", "deleteFilter", "typeFilter", "useReceiptClaim"];
},
})