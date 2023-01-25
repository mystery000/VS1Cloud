import './accounts-settings.html'
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
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

Template.wizard_accounts.onCreated(() => {
  const templateObject = Template.instance();
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

  templateObject.loadAccountTypes = () => {
    let accountTypeList = [];
    getVS1Data("TAccountType")
      .then(function (dataObject) {
        if (dataObject.length === 0) {
          accountService.getAccountTypeCheck().then(function (data) {
            for (let i = 0; i < data.taccounttype.length; i++) {
              let accounttyperecordObj = {
                accounttypename: data.taccounttype[i].AccountTypeName || " ",
                description: data.taccounttype[i].OriginalDescription || " ",
              };
              accountTypeList.push(accounttyperecordObj);
            }
            templateObject.accountTypes.set(accountTypeList);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.taccounttype;

          for (let i = 0; i < useData.length; i++) {
            let accounttyperecordObj = {
              accounttypename: useData[i].AccountTypeName || " ",
              description: useData[i].OriginalDescription || " ",
            };
            accountTypeList.push(accounttyperecordObj);
          }
          templateObject.accountTypes.set(accountTypeList);
        }
      })
      .catch(function (err) {
        accountService.getAccountTypeCheck().then(function (data) {
          for (let i = 0; i < data.taccounttype.length; i++) {
            let accounttyperecordObj = {
              accounttypename: data.taccounttype[i].AccountTypeName || " ",
              description: data.taccounttype[i].OriginalDescription || " ",
            };
            accountTypeList.push(accounttyperecordObj);
          }
          templateObject.accountTypes.set(accountTypeList);
        });
      });
  };

  templateObject.loadAccountList = async () => {
    LoadingOverlay.show();
    let _accountList = [];
    let dataObject = await getVS1Data("TAccountVS1");
    if (dataObject.length === 0) {
      dataObject = await sideBarService.getAccountListVS1();
      await addVS1Data("TAccountVS1", JSON.stringify(dataObject));
    } else {
      dataObject = JSON.parse(dataObject[0].data);
    }
    if (dataObject.taccountvs1) {
      data = dataObject;

      let fullAccountTypeName = "";
      let accBalance = "";

      data.taccountvs1.forEach((account) => {
        if (!isNaN(account.fields.Balance)) {
          accBalance =
            utilityService.modifynegativeCurrencyFormat(
              account.fields.Balance
            ) || 0.0;
        } else {
          accBalance = Currency + "0.00";
        }
        var dataList = {
          id: account.fields.ID || "",
          accountname: account.fields.AccountName || "",
          description: account.fields.Description || "",
          accountnumber: account.fields.AccountNumber || "",
          accounttypename:
            fullAccountTypeName || account.fields.AccountTypeName,
          accounttypeshort: account.fields.AccountTypeName || "",
          taxcode: account.fields.TaxCode || "",
          bankaccountname: account.fields.BankAccountName || "",
          bankname: account.fields.BankName || "",
          bsb: account.fields.BSB || "",
          bankaccountnumber: account.fields.BankAccountNumber || "",
          swiftcode: account.fields.Extra || "",
          routingNo: account.BankCode || "",
          apcanumber: account.fields.BankNumber || "",
          balance: accBalance || 0.0,
          isheader: account.fields.IsHeader || false,
          cardnumber: account.fields.CarNumber || "",
          expirydate: account.fields.ExpiryDate || "",
          cvc: account.fields.CVC || "",
        };
        if (account.fields.Active != false) {
          _accountList.push(dataList);
        }
      });
      templateObject.accountList.set(_accountList);
    }

    if ($.fn.dataTable.isDataTable("#tblAccountOverview")) {
      $("#tblAccountOverview").DataTable().destroy();
    }

    setTimeout(() => {
      $("#tblAccountOverview")
        .DataTable({

          columnDefs: [
          ],
          select: true,
          destroy: true,
          colReorder: true,
          sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          pageLength: 25,
          paging: true,
          info: true,
          responsive: true,
          "order": [1, 'asc' ],
          action: function () {
            $("#tblAccountOverview").DataTable().ajax.reload();
          },
          fnDrawCallback: function (oSettings) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          },
        })
        .on("page", function () {
          setTimeout(function () {
            MakeNegative();
          }, 100);
          let draftRecord = templateObject.accountList.get();
          templateObject.accountList.set(draftRecord);
        })
        .on("column-reorder", function () {})
        .on("length.dt", function (e, settings, len) {
          setTimeout(function () {
            MakeNegative();
          }, 100);
        });
    }, refreshTableTimout);

    LoadingOverlay.hide();
  };

  templateObject.loadAllTaxCodes = async (refresh = false) => {
    let dataObject = await getVS1Data("TTaxcodeVS1");
    let data =
      dataObject.length == 0 || refresh == true
        ? await productService.getTaxCodesVS1()
        : JSON.parse(dataObject[0].data);

    if (refresh) {
      await addVS1Data("TTaxcodeVS1", JSON.stringify(data));
    }

    let splashArrayTaxRateList = [];
    let taxCodesList = [];

    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
      let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
      var dataList = [
        data.ttaxcodevs1[i].Id || "",
        data.ttaxcodevs1[i].CodeName || "",
        data.ttaxcodevs1[i].Description || "-",
        taxRate || 0,
      ];

      let taxcoderecordObj = {
        codename: data.ttaxcodevs1[i].CodeName || " ",
        coderate: taxRate || " ",
      };

      taxCodesList.push(taxcoderecordObj);

      splashArrayTaxRateList.push(dataList);
    }
    templateObject.taxraterecords.set(taxCodesList);

    if (splashArrayTaxRateList) {

      if ($.fn.dataTable.isDataTable("#tblTaxRate")) {
        $("#tblTaxRate").DataTable().destroy();
      }

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
        paging: false,
        info: true,
        responsive: true,
        fnDrawCallback: function (oSettings) {
        },
        language: { search: "",searchPlaceholder: "Search List..." },
        fnInitComplete: function () {
          $(
            "<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
          ).insertAfter("#tblTaxRate_filter");
          $(
            "<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
          ).insertAfter("#tblTaxRate_filter");
        },
      });
    }
  };
})

Template.wizard_accounts.onRendered(() => {

  const templateObject = Template.instance();
  templateObject.loadAccountTypes();
  templateObject.loadAccountList();
  templateObject.loadAllTaxCodes();

  $("#tblAccountOverview tbody").on(
    "click",
    "tr .colAccountName, tr .colAccountName, tr .colDescription, tr .colAccountNo, tr .colType, tr .colTaxCode, tr .colBankAccountName, tr .colBSB, tr .colBankAccountNo, tr .colExtra, tr .colAPCANumber",
    function (event) {
      var listData = $(this).closest("tr").attr("id");
      if (listData) {
        $("#add-account-title").text("Edit Account Details");
        $("#edtAccountName").attr("readonly", true);
        $("#sltAccountType").attr("readonly", true);
        $("#sltAccountType").attr("disabled", "disabled");
        if (listData !== "") {
          listData = Number(listData);
          var accountid = listData || "";
          var accounttype =
            $(event.target)
              .closest("tr")
              .find(".colType")
              .attr("accounttype") || "";
          var accountname =
            $(event.target).closest("tr").find(".colAccountName").text() || "";
          var accountno =
            $(event.target).closest("tr").find(".colAccountNo").text() || "";
          var taxcode =
            $(event.target).closest("tr").find(".colTaxCode").text() || "";
          var accountdesc =
            $(event.target).closest("tr").find(".colDescription").text() || "";
          var bankaccountname =
            $(event.target).closest("tr").find(".colBankAccountName").text() ||
            "";
          var bankname =
            localStorage.getItem("vs1companyBankName") ||
            $(event.target).closest("tr").find(".colBankName").text() ||
            "";
          var bankbsb =
            $(event.target).closest("tr").find(".colBSB").text() || "";
          var bankacountno =
            $(event.target).closest("tr").find(".colBankAccountNo").text() ||
            "";

          var swiftCode =
            $(event.target).closest("tr").find(".colExtra").text() || "";
          var routingNo =
            $(event.target).closest("tr").find(".colAPCANumber").text() || "";

          var showTrans =
            $(event.target)
              .closest("tr")
              .find(".colAPCANumber")
              .attr("checkheader") || false;

          var cardnumber =
            $(event.target).closest("tr").find(".colCardNumber").text() || "";
          var cardexpiry =
            $(event.target).closest("tr").find(".colExpiryDate").text() || "";
          var cardcvc =
            $(event.target).closest("tr").find(".colCVC").text() || "";

          if (accounttype === "BANK") {
            $(".isBankAccount").removeClass("isNotBankAccount");
            $(".isCreditAccount").addClass("isNotCreditAccount");
          } else if (accounttype === "CCARD") {
            $(".isCreditAccount").removeClass("isNotCreditAccount");
            $(".isBankAccount").addClass("isNotBankAccount");
          } else {
            $(".isBankAccount").addClass("isNotBankAccount");
            $(".isCreditAccount").addClass("isNotCreditAccount");
          }

          $("#edtAccountID").val(accountid);
          $("#sltAccountType").val(accounttype);
          $("#edtAccountName").val(accountname);
          $("#edtAccountNo").val(accountno);
          $("#sltTaxCode").val(taxcode);
          $("#txaAccountDescription").val(accountdesc);
          $("#edtBankAccountName").val(bankaccountname);
          $("#edtBSB").val(bankbsb);
          $("#edtBankAccountNo").val(bankacountno);
          $("#swiftCode").val(swiftCode);
          $("#routingNo").val(routingNo);
          $("#edtBankName").val(bankname);

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
          $(this).closest("tr").attr("data-target", "#addNewAccount");
          $(this).closest("tr").attr("data-toggle", "modal");
        }
      }
    }
  );


})

Template.wizard_accounts.events({
  "click .btnAddNewAccounts"(event) {
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
    $(".isBankAccount").addClass("isNotBankAccount");
    $(".isCreditAccount").addClass("isNotCreditAccount");
  },
  "click .btnRefreshAccount"(event) {
    $(".fullScreenSpin").css("display", "inline-block");
    var splashArrayAccountList = [];
    let dataSearchName = $("#tblAccount_filter input").val();
    var currentLoc = FlowRouter.current().route.path;
    if (dataSearchName.replace(/\s/g, "") !== "") {
      sideBarService
        .getAllAccountDataVS1ByName(dataSearchName)
        .then(function (data) {
          if (data.taccountvs1.length > 0) {
            for (let i = 0; i < data.taccountvs1.length; i++) {
              var dataList = [
                data.taccountvs1[i].fields.AccountName || "-",
                data.taccountvs1[i].fields.Description || "",
                data.taccountvs1[i].fields.AccountNumber || "",
                data.taccountvs1[i].fields.AccountTypeName || "",
                utilityService.modifynegativeCurrencyFormat(
                  Math.floor(data.taccountvs1[i].fields.Balance * 100) / 100
                ) || 0,
                data.taccountvs1[i].fields.TaxCode || "",
                data.taccountvs1[i].fields.ID || "",
              ];
              if (currentLoc === "/billcard") {
                if (
                  data.taccountvs1[i].fields.AccountTypeName !== "AP" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "AR" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "CCARD" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "BANK"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (currentLoc === "/journalentrycard") {
                if (
                  data.taccountvs1[i].fields.AccountTypeName !== "AP" &&
                  data.taccountvs1[i].fields.AccountTypeName !== "AR"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (currentLoc === "/chequecard") {
                if (
                  data.taccountvs1[i].fields.AccountTypeName === "EQUITY" ||
                  data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                  data.taccountvs1[i].fields.AccountTypeName === "CCARD" ||
                  data.taccountvs1[i].fields.AccountTypeName === "COGS" ||
                  data.taccountvs1[i].fields.AccountTypeName === "EXP" ||
                  data.taccountvs1[i].fields.AccountTypeName === "FIXASSET" ||
                  data.taccountvs1[i].fields.AccountTypeName === "INC" ||
                  data.taccountvs1[i].fields.AccountTypeName === "LTLIAB" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OASSET" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OCASSET" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OCLIAB" ||
                  data.taccountvs1[i].fields.AccountTypeName === "EXEXP" ||
                  data.taccountvs1[i].fields.AccountTypeName === "EXINC"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (
                currentLoc === "/paymentcard" ||
                currentLoc === "/supplierpaymentcard"
              ) {
                if (
                  data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                  data.taccountvs1[i].fields.AccountTypeName === "CCARD" ||
                  data.taccountvs1[i].fields.AccountTypeName === "OCLIAB"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else if (
                currentLoc === "/bankrecon" ||
                currentLoc === "/newbankrecon"
              ) {
                if (
                  data.taccountvs1[i].fields.AccountTypeName === "BANK" ||
                  data.taccountvs1[i].fields.AccountTypeName === "CCARD"
                ) {
                  splashArrayAccountList.push(dataList);
                }
              } else {
                splashArrayAccountList.push(dataList);
              }
            }
            var datatable = $("#tblAccountlist").DataTable();
            datatable.clear();
            datatable.rows.add(splashArrayAccountList);
            datatable.draw(false);

            LoadingOverlay.hide();
          } else {
            LoadingOverlay.hide();
            $("#accountListModal").modal("toggle");
            swal({
              title: "Question",
              text: "Account does not exist, would you like to create it?",
              type: "question",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "No",
            }).then((result) => {
              if (result.value) {
                $("#addAccountModal").modal("toggle");
                $("#edtAccountName").val(dataSearchName);
              } else if (result.dismiss === "cancel") {
                $("#accountListModal").modal("toggle");
              }
            });
          }
        })
        .catch(function (err) {
          LoadingOverlay.hide();
        });
    } else {
      sideBarService
        .getAccountListVS1()
        .then(function (data) {
          for (let i = 0; i < data.taccountvs1.length; i++) {
            var dataList = [
              data.taccountvs1[i].fields.AccountName || "-",
              data.taccountvs1[i].fields.Description || "",
              data.taccountvs1[i].fields.AccountNumber || "",
              data.taccountvs1[i].fields.AccountTypeName || "",
              utilityService.modifynegativeCurrencyFormat(
                Math.floor(data.taccountvs1[i].fields.Balance * 100) / 100
              ),
              data.taccountvs1[i].fields.TaxCode || "",
              data.taccountvs1[i].fields.ID || "",
            ];

            splashArrayAccountList.push(dataList);
          }
          var datatable = $("#tblAccountlist").DataTable();
          datatable.clear();
          datatable.rows.add(splashArrayAccountList);
          datatable.draw(false);

          LoadingOverlay.hide();
        })
        .catch(function (err) {
          LoadingOverlay.hide();
        });
    }
  },
  "keyup #tblAccount_filter input"(event) {
    if (event.keyCode === 13) {
      $(".btnRefreshAccount").trigger("click");
    }
  },
  "change #sltStatus"(event) {
    let status = $("#sltStatus").find(":selected").val();
    if (status === "newstatus") {
      $("#statusModal").modal();
    }
  },
  "click .btnSaveStatus"() {
    playSaveAudio();
    setTimeout(function(){
      $(".fullScreenSpin").css("display", "inline-block");

      let status = $("#status").val();
      let leadData = {
        type: "TLeadStatusType",
        fields: {
          TypeName: status,
          KeyValue: status,
        },
      };

      if (status !== "") {
        clientService
          .saveLeadStatus(leadData)
          .then(function (objDetails) {
            sideBarService
              .getAllLeadStatus()
              .then(function (dataUpdate) {
                addVS1Data("TLeadStatusType", JSON.stringify(dataUpdate))
                  .then(function (datareturn) {
                    LoadingOverlay.hide();
                    let id = $(".printID").attr("id");
                    if (id !== "") {
                      window.open("/creditcard?id=" + id);
                    } else {
                      window.open("/creditcard");
                    }
                  })
                  .catch(function (err) {});
              })
              .catch(function (err) {
                window.open("/creditcard", "_self");
              });
          })
          .catch(function (err) {
            LoadingOverlay.hide();

            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
              } else if (result.dismiss === "cancel") {
              }
            });

            LoadingOverlay.hide();
          });
      } else {
        LoadingOverlay.hide();
        swal({
          title: "Please Enter Status",
          text: "Status field cannot be empty",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.value) {
          } else if (result.dismiss === "cancel") {
          }
        });
      }
    }, delayTimeAfterSound);
  },
  "blur .lineMemo"(event) {
    var targetID = $(event.target).closest("tr").attr("id");
    $("#" + targetID + " #lineMemo").text(
      $("#" + targetID + " .lineMemo").text()
    );
  },
  "blur .colAmount"(event) {
    let templateObject = Template.instance();
    let taxcodeList = templateObject.taxraterecords.get();
    let utilityService = new UtilityService();
    var targetID = $(event.target).closest("tr").attr("id");
    if (!isNaN($(event.target).val())) {
      let inputUnitPrice = parseFloat($(event.target).val()) || 0;
      $(event.target).val(
        utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
      );
    } else {
      let inputUnitPrice =
        Number(
          $(event.target)
            .val()
            .replace(/[^0-9.-]+/g, "")
        ) || 0;

      $(event.target).val(
        utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
      );
    }
    let $tblrows = $("#tblCreditLine tbody tr");

    let $printrows = $(".credit_print tbody tr");

    if (
      $(".printID").attr("id") !== undefined ||
      $(".printID").attr("id") !== ""
    ) {
      $("#" + targetID + " #lineAmount").text(
        $("#" + targetID + " .colAmount").val()
      );
      $("#" + targetID + " #lineTaxCode").text(
        $("#" + targetID + " .lineTaxCode").text()
      );
    }

    let lineAmount = 0;
    let subGrandTotal = 0;
    let taxGrandTotal = 0;
    let taxGrandTotalPrint = 0;

    $tblrows.each(function (index) {
      var $tblrow = $(this);
      var amount = $tblrow.find(".colAmount").val() || "0";
      var taxcode = $tblrow.find(".lineTaxCode").text() || 0;
      var taxrateamount = 0;
      if (taxcodeList) {
        for (var i = 0; i < taxcodeList.length; i++) {
          if (taxcodeList[i].codename === taxcode) {
            taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
          }
        }
      }

      var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
      var taxTotal =
        parseFloat(amount.replace(/[^0-9.-]+/g, "")) *
        parseFloat(taxrateamount);
      $tblrow
        .find(".lineTaxAmount")
        .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
      if (!isNaN(subTotal)) {
        $tblrow
          .find(".colAmount")
          .val(utilityService.modifynegativeCurrencyFormat(subTotal));
        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
        document.getElementById("subtotal_total").innerHTML =
          utilityService.modifynegativeCurrencyFormat(subGrandTotal);
      }

      if (!isNaN(taxTotal)) {
        taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
        document.getElementById("subtotal_tax").innerHTML =
          utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
      }

      if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
        let GrandTotal = parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
        document.getElementById("grandTotal").innerHTML =
          utilityService.modifynegativeCurrencyFormat(GrandTotal);
        document.getElementById("balanceDue").innerHTML =
          utilityService.modifynegativeCurrencyFormat(GrandTotal);
        document.getElementById("totalBalanceDue").innerHTML =
          utilityService.modifynegativeCurrencyFormat(GrandTotal);
      }
    });

    if (
      $(".printID").attr("id") !== undefined ||
      $(".printID").attr("id") !== ""
    ) {
      $printrows.each(function (index) {
        var $printrows = $(this);
        var amount = $printrows.find("#lineAmount").text() || "0";
        var taxcode = $printrows.find("#lineTaxCode").text() || 0;

        var taxrateamount = 0;
        if (taxcodeList) {
          for (var i = 0; i < taxcodeList.length; i++) {
            if (taxcodeList[i].codename === taxcode) {
              taxrateamount =
                taxcodeList[i].coderate.replace("%", "") / 100 || 0;
            }
          }
        }

        var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
        var taxTotal =
          parseFloat(amount.replace(/[^0-9.-]+/g, "")) *
          parseFloat(taxrateamount);
        $printrows
          .find("#lineTaxAmount")
          .text(utilityService.modifynegativeCurrencyFormat(taxTotal));

        if (!isNaN(subTotal)) {
          $printrows
            .find("#lineAmt")
            .text(utilityService.modifynegativeCurrencyFormat(subTotal));
          subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
          document.getElementById("subtotal_totalPrint").innerHTML =
            $("#subtotal_total").text();
        }

        if (!isNaN(taxTotal)) {
          taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
        }
        if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
          let GrandTotal =
            parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
          document.getElementById("grandTotalPrint").innerHTML =
            $("#grandTotal").text();
          document.getElementById("totalBalanceDuePrint").innerHTML =
            $("#totalBalanceDue").text();
        }
      });
    }
  },
  "click #btnCustomFileds"(event) {
    var x = document.getElementById("divCustomFields");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  },
  "click .lineAccountName"(event) {
    $("#tblCreditLine tbody tr .lineAccountName").attr("data-toggle", "modal");
    $("#tblCreditLine tbody tr .lineAccountName").attr(
      "data-target",
      "#accountListModal"
    );
    var targetID = $(event.target).closest("tr").attr("id");
    $("#selectLineID").val(targetID);

    setTimeout(function () {
      $("#tblAccount_filter .form-control-sm").focus();
    }, 500);
  },
  "click #accountListModal #refreshpagelist"() {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    templateObject.getAllAccountss();
  },
  "click .lineTaxRate"(event) {
    $("#tblCreditLine tbody tr .lineTaxRate").attr("data-toggle", "modal");
    $("#tblCreditLine tbody tr .lineTaxRate").attr(
      "data-target",
      "#taxRateListModal"
    );
    var targetID = $(event.target).closest("tr").attr("id");
    $("#selectLineID").val(targetID);
  },
  "click .lineTaxCode"(event) {
    $("#tblCreditLine tbody tr .lineTaxCode").attr("data-toggle", "modal");
    $("#tblCreditLine tbody tr .lineTaxCode").attr(
      "data-target",
      "#taxRateListModal"
    );
    var targetID = $(event.target).closest("tr").attr("id");
    $("#selectLineID").val(targetID);
  },
  "keydown .lineQty, keydown .lineUnitPrice, keydown .lineAmount"(event) {
    if (
      $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      (event.keyCode === 65 &&
        (event.ctrlKey === true || event.metaKey === true)) ||
      (event.keyCode >= 35 && event.keyCode <= 40)
    ) {
      return;
    }

    if (event.shiftKey === true) {
      event.preventDefault();
    }
    if (
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode === 8 ||
      event.keyCode === 9 ||
      event.keyCode === 37 ||
      event.keyCode === 39 ||
      event.keyCode === 46 ||
      event.keyCode === 190 ||
      event.keyCode === 189 ||
      event.keyCode === 109
    ) {
    } else {
      event.preventDefault();
    }
  },
  "click .chkAccountName"(event) {
    if ($(event.target).is(":checked")) {
      $(".colAccountName").css("display", "table-cell");
      $(".colAccountName").css("padding", ".75rem");
      $(".colAccountName").css("vertical-align", "top");
    } else {
      $(".colAccountName").css("display", "none");
    }
  },
  "click .chkMemo"(event) {
    if ($(event.target).is(":checked")) {
      $(".colMemo").css("display", "table-cell");
      $(".colMemo").css("padding", ".75rem");
      $(".colMemo").css("vertical-align", "top");
    } else {
      $(".colMemo").css("display", "none");
    }
  },
  "click .chkAmount"(event) {
    if ($(event.target).is(":checked")) {
      $(".colAmount").css("display", "table-cell");
      $(".colAmount").css("padding", ".75rem");
      $(".colAmount").css("vertical-align", "top");
    } else {
      $(".colAmount").css("display", "none");
    }
  },
  "click .chkTaxRate"(event) {
    if ($(event.target).is(":checked")) {
      $(".colTaxRate").css("display", "table-cell");
      $(".colTaxRate").css("padding", ".75rem");
      $(".colTaxRate").css("vertical-align", "top");
    } else {
      $(".colTaxRate").css("display", "none");
    }
  },
  "click .chkTaxCode"(event) {
    if ($(event.target).is(":checked")) {
      $(".colTaxCode").css("display", "table-cell");
      $(".colTaxCode").css("padding", ".75rem");
      $(".colTaxCode").css("vertical-align", "top");
    } else {
      $(".colTaxCode").css("display", "none");
    }
  },
  "click .chkCustomField1"(event) {
    if ($(event.target).is(":checked")) {
      $(".colCustomField1").css("display", "table-cell");
      $(".colCustomField1").css("padding", ".75rem");
      $(".colCustomField1").css("vertical-align", "top");
    } else {
      $(".colCustomField1").css("display", "none");
    }
  },
  "click .chkCustomField2"(event) {
    if ($(event.target).is(":checked")) {
      $(".colCustomField2").css("display", "table-cell");
      $(".colCustomField2").css("padding", ".75rem");
      $(".colCustomField2").css("vertical-align", "top");
    } else {
      $(".colCustomField2").css("display", "none");
    }
  },
  "change .rngRangeAccountName"(event) {
    let range = $(event.target).val();
    $(".spWidthAccountName").html(range + "%");
    $(".colAccountName").css("width", range + "%");
  },
  "change .rngRangeMemo"(event) {
    let range = $(event.target).val();
    $(".spWidthMemo").html(range + "%");
    $(".colMemo").css("width", range + "%");
  },
  "change .rngRangeAmount"(event) {
    let range = $(event.target).val();
    $(".spWidthAmount").html(range + "%");
    $(".colAmount").css("width", range + "%");
  },
  "change .rngRangeTaxRate"(event) {
    let range = $(event.target).val();
    $(".spWidthTaxRate").html(range + "%");
    $(".colTaxRate").css("width", range + "%");
  },
  "change .rngRangeTaxCode"(event) {
    let range = $(event.target).val();
    $(".spWidthTaxCode").html(range + "%");
    $(".colTaxCode").css("width", range + "%");
  },
  "change .rngRangeCustomField1"(event) {
    let range = $(event.target).val();
    $(".spWidthCustomField1").html(range + "%");
    $(".colCustomField1").css("width", range + "%");
  },
  "change .rngRangeCustomField2"(event) {
    let range = $(event.target).val();
    $(".spWidthCustomField2").html(range + "%");
    $(".colCustomField2").css("width", range + "%");
  },
  "blur .divcolumnAccount"(event) {
    let columData = $(event.target).html();
    let columHeaderUpdate = $(event.target).attr("valueupdate");
    $("" + columHeaderUpdate + "").html(columData);
  },
  "click .btnSaveGridSettings"(event) {
    playSaveAudio();
    setTimeout(function(){
      let lineItems = [];

      $(".columnSettings").each(function (index) {
        var $tblrow = $(this);
        var colTitle = $tblrow.find(".divcolumnAccount").text() || "";
        var colWidth = $tblrow.find(".custom-range").val() || 0;
        var colthClass =
          $tblrow.find(".divcolumnAccount").attr("valueupdate") || "";
        var colHidden = false;
        colHidden = !$tblrow.find(".custom-control-input").is(":checked");
        let lineItemObj = {
          index: index,
          label: colTitle,
          hidden: colHidden,
          width: colWidth,
          thclass: colthClass,
        };

        lineItems.push(lineItemObj);
      });

      var getcurrentCloudDetails = CloudUser.findOne({
        _id: localStorage.getItem("mycloudLogonID"),
        clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
      });
      if (getcurrentCloudDetails) {
        if (getcurrentCloudDetails._id.length > 0) {
          var clientID = getcurrentCloudDetails._id;
          var clientUsername = getcurrentCloudDetails.cloudUsername;
          var clientEmail = getcurrentCloudDetails.cloudEmail;
          var checkPrefDetails = CloudPreference.findOne({
            userid: clientID,
            PrefName: "tblCreditLine",
          });
          if (checkPrefDetails) {
            CloudPreference.update(
              {
                _id: checkPrefDetails._id,
              },
              {
                $set: {
                  userid: clientID,
                  username: clientUsername,
                  useremail: clientEmail,
                  PrefGroup: "purchaseform",
                  PrefName: "tblCreditLine",
                  published: true,
                  customFields: lineItems,
                  updatedAt: new Date(),
                },
              },
              function (err, idTag) {
                if (err) {
                  $("#myModal2").modal("toggle");
                } else {
                  $("#myModal2").modal("toggle");
                }
              }
            );
          } else {
            CloudPreference.insert(
              {
                userid: clientID,
                username: clientUsername,
                useremail: clientEmail,
                PrefGroup: "purchaseform",
                PrefName: "tblCreditLine",
                published: true,
                customFields: lineItems,
                createdAt: new Date(),
              },
              function (err, idTag) {
                if (err) {
                  $("#myModal2").modal("toggle");
                } else {
                  $("#myModal2").modal("toggle");
                }
              }
            );
          }
        }
      }
      $("#myModal2").modal("toggle");
    }, delayTimeAfterSound);
  },
  "click .btnResetGridSettings"(event) {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: localStorage.getItem("mycloudLogonID"),
      clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "tblCreditLine",
        });
        if (checkPrefDetails) {
          CloudPreference.remove(
            {
              _id: checkPrefDetails._id,
            },
            function (err, idTag) {
              if (err) {
              } else {
                Meteor._reload.reload();
              }
            }
          );
        }
      }
    }
  },
  "click .btnResetSettings"(event) {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: localStorage.getItem("mycloudLogonID"),
      clouddatabaseID: localStorage.getItem("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "creditcard",
        });
        if (checkPrefDetails) {
          CloudPreference.remove(
            {
              _id: checkPrefDetails._id,
            },
            function (err, idTag) {
              if (err) {
              } else {
                // Meteor._reload.reload();
              }
            }
          );
        }
      }
    }
  },
  "click .setup-wizard .setup-step-6 .btnRefresh": (e, template) => {
    template.loadAccountList();
  },
  "click .setup-step-6 .templateDownload": (e, templateObject) => {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleAccounts" + ".csv";

    const customers = templateObject.accountList.get();
    rows.push([
      "Account Name",
      "Description",
      "Account No",
      "Type",
      "Balance",
      "Tax Code",
      "Bank Account Name",
      "BSB",
      "Bank Account No",
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.accountname,
        customer.description,
        customer.accountnumber,
        customer.accounttypename,
        customer.balance,
        customer.taxcode,
        customer.bankaccountname,
        customer.bsb,
        customer.bankaccountnumber
      ]);
    });


    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .setup-step-6 .templateDownloadXLSX": (e, templateObject) => {

    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleAccounts" + ".xls";

    const customers = templateObject.accountList.get();
    rows.push([
      "Account Name",
      "Description",
      "Account No",
      "Type",
      "Balance",
      "Tax Code",
      "Bank Account Name",
      "BSB",
      "Bank Account No",
    ]);

    customers.forEach((customer) => {
      rows.push([
        customer.accountname,
        customer.description,
        customer.accountnumber,
        customer.accounttypename,
        customer.balance,
        customer.taxcode,
        customer.bankaccountname,
        customer.bsb,
        customer.bankaccountnumber
      ]);
    });
    utilityService.exportToCsv(rows, filename, "xls");
  },
})

Template.wizard_accounts.helpers({
  bsbRegionName: () => {
    let bsbname = "Branch Code";
    if (localStorage.getItem("ERPLoggedCountry") === "Australia") {
      bsbname = "BSB";
    }
    return bsbname;
  },
  accountTypes: () => {
    return Template.instance()
      .accountTypes.get()
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
  accountList: () => {
    return Template.instance().accountList.get();
  },
  creditrecord: () => {
    return Template.instance().creditrecord.get();
  },
  viarecords: () => {
    return Template.instance()
      .viarecords.get()
      .sort(function (a, b) {
        if (a.shippingmethod === "NA") {
          return 1;
        } else if (b.shippingmethod === "NA") {
          return -1;
        }
        return a.shippingmethod.toUpperCase() > b.shippingmethod.toUpperCase()
          ? 1
          : -1;
      });
  },
  termrecords: () => {
    return Template.instance()
      .termrecords.get()
      .sort(function (a, b) {
        if (a.termsname === "NA") {
          return 1;
        } else if (b.termsname === "NA") {
          return -1;
        }
        return a.termsname.toUpperCase() > b.termsname.toUpperCase() ? 1 : -1;
      });
  },
  purchaseCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "creditcard",
    });
  },
  purchaseCloudGridPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblCreditLine",
    });
  },
  uploadedFiles: () => {
    return Template.instance().uploadedFiles.get();
  },
  attachmentCount: () => {
    return Template.instance().attachmentCount.get();
  },
  uploadedFile: () => {
    return Template.instance().uploadedFile.get();
  },
})