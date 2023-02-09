import "jquery/dist/jquery.min";
import "jQuery.print/jQuery.print.js";
import { jsPDF } from "jspdf";
import { ProductService } from "./product/product-service";
import { SideBarService } from "./js/sidebar-service";
import { TaxRateService } from "./settings/settings-service";
import { PurchaseBoardService } from "./js/purchase-service";

let productService = new ProductService();
let sideBarService = new SideBarService();
let taxRateService = new TaxRateService();
let purchaseService = new PurchaseBoardService();

export class EditableService {
  getAccountsByCategory = (accountType) => {
    $("#accountListModal").modal("toggle");
  };

  clickAccount = (e) => {
    var $earch = $(e.currentTarget);
    var offset = $earch.offset();
    var salesAccountDataName = e.target.value || "";
    var accountType = "INC";
    if (e.pageX > offset.left + $earch.width() - 8) {
      // X button 16px wide?
      this.getAccountsByCategory(accountType);
    } else {
      if (salesAccountDataName.replace(/\s/g, "") != "") {
        if (salesAccountDataName.replace(/\s/g, "") != "") {
          $("#add-account-title").text("Edit Account Details");
          getVS1Data("TAccountVS1")
            .then(function (dataObject) {
              if (dataObject.length == 0) {
                productService
                  .getAccountName()
                  .then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.taccountvs1.length; i++) {
                      if (data.taccountvs1[i].AccountName === salesAccountDataName) {
                        $("#edtAccountName").attr("readonly", true);
                        let taxCode = data.taccountvs1[i].TaxCode;
                        var accountID = data.taccountvs1[i].ID || "";
                        var acountName = data.taccountvs1[i].AccountName || "";
                        var accountNo = data.taccountvs1[i].AccountNumber || "";
                        var accountType = data.taccountvs1[i].AccountTypeName || "";
                        var accountDesc = data.taccountvs1[i].Description || "";
                        $("#edtAccountID").val(accountID);
                        $("#sltAccountType").val(accountType);
                        $("#edtAccountName").val(acountName);
                        $("#edtAccountNo").val(accountNo);
                        $("#sltTaxCode").val(taxCode);
                        $("#txaAccountDescription").val(accountDesc);
                        setTimeout(function () {
                          $("#addAccountModal").modal("toggle");
                        }, 100);
                      }
                    }
                  })
                  .catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $(".fullScreenSpin").css("display", "none");
                    // Meteor._reload.reload();
                  });
              } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.taccountvs1;
                let lineItems = [];
                let lineItemObj = {};
                $("#add-account-title").text("Edit Account Details");
                for (let i = 0; i < useData.length; i++) {
                  if (useData[i].fields.AccountName === salesAccountDataName) {
                    $("#edtAccountName").attr("readonly", true);
                    let taxCode = useData[i].fields.TaxCode;
                    var accountID = useData[i].fields.ID || "";
                    var acountName = useData[i].fields.AccountName || "";
                    var accountNo = useData[i].fields.AccountNumber || "";
                    var accountType = useData[i].fields.AccountTypeName || "";
                    var accountDesc = useData[i].fields.Description || "";
                    $("#edtAccountID").val(accountID);
                    $("#sltAccountType").val(accountType);
                    $("#edtAccountName").val(acountName);
                    $("#edtAccountNo").val(accountNo);
                    $("#sltTaxCode").val(taxCode);
                    $("#txaAccountDescription").val(accountDesc);
                    $("#addAccountModal").modal("toggle");
                    //}, 500);
                  }
                }
              }
            })
            .catch(function (err) {
              productService
                .getAccountName()
                .then(function (data) {
                  let lineItems = [];
                  let lineItemObj = {};
                  for (let i = 0; i < data.taccountvs1.length; i++) {
                    if (data.taccountvs1[i].AccountName === salesAccountDataName) {
                      $("#add-account-title").text("Edit Account Details");
                      let taxCode = data.taccountvs1[i].TaxCode;
                      var accountID = data.taccountvs1[i].ID || "";
                      var acountName = data.taccountvs1[i].AccountName || "";
                      var accountNo = data.taccountvs1[i].AccountNumber || "";
                      var accountType = data.taccountvs1[i].AccountTypeName || "";
                      var accountDesc = data.taccountvs1[i].Description || "";
                      $("#edtAccountID").val(accountID);
                      $("#sltAccountType").val(accountType);
                      $("#edtAccountName").val(acountName);
                      $("#edtAccountNo").val(accountNo);
                      $("#sltTaxCode").val(taxCode);
                      $("#txaAccountDescription").val(accountDesc);
                      setTimeout(function () {
                        $("#addAccountModal").modal("toggle");
                      }, 100);
                    }
                  }
                })
                .catch(function (err) {
                  // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                  $(".fullScreenSpin").css("display", "none");
                  // Meteor._reload.reload();
                });
            });
        } else {
          this.getAccountsByCategory(accountType);
        }
      } else {
        this.getAccountsByCategory(accountType);
      }
    }
  };

  clickSalesAccount = (e) => {
    $("#accSelected").val("sales");
    this.clickAccount(e);
  };

  clickInventoryAccount = (e) => {
    $("#accSelected").val("inventory");
    this.clickAccount(e);
  };

  clickCogsAccount = (e) => {
    $("#accSelected").val("cogs");
    this.clickAccount(e);
  };

  clickEdtCogsAccount = (e) => {
    $("#accSelected").val("bom-all");
    this.clickAccount(e);
  };

  clickEdtExpenseAccount = (e) => {
    $("#accSelected").val("bom-expense");
    this.clickAccount(e);
  };

  clickEdtOverheadCogsAccount = (e) => {
    $("#accSelected").val("bom-overhead-all");
    this.clickAccount(e);
  };

  clickEdtOverheadExpenseAccount = (e) => {
    $("#accSelected").val("bom-overhead-expense");
    this.clickAccount(e);
  };

  clickEdtWastageAccount = (e) => {
    $("#accSelected").val("bom-inventory");
    this.clickAccount(e);
  };

  clickUom = (e) => {
    var $earch = $(e.currentTarget);
    var offset = $earch.offset();
    var uomDataName = e.target.value || "";
    if (e.pageX > offset.left + $earch.width() - 8) {
      $("#UOMListModal").modal("show")
    } else {

    }
  }

  clickUomSales = (e) => {
    $("#uomSelected").val("sales");
    this.clickUom(e)
  };

  clickUomPurchase = (e) => {
    $("#uomSelected").val("purchase");
    this.clickUom(e)
  };

  clickTaxCodes = (e) => {
    var $earch = $(e.currentTarget);
    var offset = $earch.offset();
    var taxRateDataName = e.target.value || "";
    var taxCodePurchaseDataName = e.target.value || "";
    if (e.pageX > offset.left + $earch.width() - 8) {
      // X button 16px wide?
      $("#taxRateListModal").modal("toggle");
    } else {
      if (taxRateDataName.replace(/\s/g, "") != "") {
        $(".taxcodepopheader").text("Edit Tax Rate");
        getVS1Data("TTaxcodeVS1")
          .then(function (dataObject) {
            if (dataObject.length == 0) {
              purchaseService
                .getTaxCodesVS1()
                .then(function (data) {
                  let lineItems = [];
                  let lineItemObj = {};
                  for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                    if (data.ttaxcodevs1[i].CodeName === taxRateDataName) {
                      $("#edtTaxNamePop").attr("readonly", true);
                      let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                      var taxRateID = data.ttaxcodevs1[i].Id || "";
                      var taxRateName = data.ttaxcodevs1[i].CodeName || "";
                      var taxRateDesc = data.ttaxcodevs1[i].Description || "";
                      $("#edtTaxID").val(taxRateID);
                      $("#edtTaxNamePop").val(taxRateName);
                      $("#edtTaxRatePop").val(taxRate);
                      $("#edtTaxDescPop").val(taxRateDesc);
                      setTimeout(function () {
                        $("#newTaxRateModal").modal("toggle");
                      }, 100);
                    }
                  }
                })
                .catch(function (err) {
                  // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                  $(".fullScreenSpin").css("display", "none");
                  // Meteor._reload.reload();
                });
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.ttaxcodevs1;
              let lineItems = [];
              let lineItemObj = {};
              $(".taxcodepopheader").text("Edit Tax Rate");
              for (let i = 0; i < useData.length; i++) {
                if (useData[i].CodeName === taxRateDataName) {
                  $("#edtTaxNamePop").attr("readonly", true);
                  let taxRate = (useData[i].Rate * 100).toFixed(2);
                  var taxRateID = useData[i].Id || "";
                  var taxRateName = useData[i].CodeName || "";
                  var taxRateDesc = useData[i].Description || "";
                  $("#edtTaxID").val(taxRateID);
                  $("#edtTaxNamePop").val(taxRateName);
                  $("#edtTaxRatePop").val(taxRate);
                  $("#edtTaxDescPop").val(taxRateDesc);
                  //setTimeout(function() {
                  $("#newTaxRateModal").modal("toggle");
                  //}, 500);
                }
              }
            }
          })
          .catch(function (err) {
            purchaseService
              .getTaxCodesVS1()
              .then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                  if (data.ttaxcodevs1[i].CodeName === taxRateDataName) {
                    $("#edtTaxNamePop").attr("readonly", true);
                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                    var taxRateID = data.ttaxcodevs1[i].Id || "";
                    var taxRateName = data.ttaxcodevs1[i].CodeName || "";
                    var taxRateDesc = data.ttaxcodevs1[i].Description || "";
                    $("#edtTaxID").val(taxRateID);
                    $("#edtTaxNamePop").val(taxRateName);
                    $("#edtTaxRatePop").val(taxRate);
                    $("#edtTaxDescPop").val(taxRateDesc);
                    setTimeout(function () {
                      $("#newTaxRateModal").modal("toggle");
                    }, 100);
                  }
                }
              })
              .catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $(".fullScreenSpin").css("display", "none");
                // Meteor._reload.reload();
              });
          });
      } else {
        $("#taxRateListModal").modal("toggle");
      }
    }
  };

  clickTaxCodeSales = (e) => {
    $("#taxSelected").val("sales");
    this.clickTaxCodes(e)
  };

  clickTaxCodePurchase = (e) => {
    $("#taxSelected").val("purchase");
    this.clickTaxCodes(e)
  };

  clickBinNumber = (e) => {
    var $earch = $(e.currentTarget);
    var offset = $earch.offset();
    if (e.pageX > offset.left + $earch.width() - 8) {
      // X button 16px wide?
      $("#binNumberListModal").modal("toggle");
    } else {
      $("#addBinNumberModal").modal("toggle");
    }
  };

  clickCustomerType = (e) => {
    var $earch = $(e.currentTarget);
    var offset = $earch.offset();
    var custTypeDataName = e.target.value || "";
    if (e.pageX > offset.left + $earch.width() - 8) {
      // X button 16px wide?
      $("#customerTypeListModal").modal("toggle");
    } else {
      if (custTypeDataName.replace(/\s/g, "") != "") {
        $("#add-clienttype-title").text("Edit Customer Type");
        getVS1Data("TClientType")
          .then(function (dataObject) {
            if (dataObject.length == 0) {
              taxRateService
                .getClientType()
                .then(function (data) {
                  let lineItems = [];
                  let lineItemObj = {};
                  for (let i = 0; i < data.tclienttype.length; i++) {
                    if (data.tclienttype[i].TypeName === custTypeDataName) {
                      $("#edtClientTypeName").attr("readonly", true);
                      let typeName = data.tclienttype[i].TypeName;
                      var clientTypeID = data.tclienttype[i].ID || "";
                      var taxRateName = data.tclienttype[i].CodeName || "";
                      var clientTypeDesc = data.tclienttype[i].TypeDescription || "";
                      $("#edtClientTypeID").val(clientTypeID);
                      $("#edtClientTypeName").val(typeName);
                      $("#txaDescription").val(clientTypeDesc);
                      $("#typeID").val(clientTypeID);
                      setTimeout(function () {
                        $("#myModalClientType").modal("toggle");
                      }, 100);
                    }
                  }
                })
                .catch(function (err) {
                  // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                  $(".fullScreenSpin").css("display", "none");
                  // Meteor._reload.reload();
                });
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tclienttype;
              let lineItems = [];
              let lineItemObj = {};
              $("#add-clienttype-title").text("Edit Customer Type");
              for (let i = 0; i < useData.length; i++) {
                if (useData[i].fields.TypeName === custTypeDataName) {
                  $("#edtClientTypeName").attr("readonly", true);
                  let typeName = useData[i].fields.TypeName;
                  var clientTypeID = useData[i].fields.ID || "";
                  var taxRateName = useData[i].fields.CodeName || "";
                  var clientTypeDesc = useData[i].fields.TypeDescription || "";
                  $("#edtClientTypeID").val(clientTypeID);
                  $("#edtClientTypeName").val(typeName);
                  $("#txaDescription").val(clientTypeDesc);
                  $("#typeID").val(clientTypeID);
                  //setTimeout(function() {
                  $("#myModalClientType").modal("toggle");
                  //}, 500);
                }
              }
            }
          })
          .catch(function (err) {
            purchaseService
              .getTaxCodesVS1()
              .then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                  if (data.ttaxcodevs1[i].TypeName === custTypeDataName) {
                    let typeName = data.tclienttype[i].TypeName;
                    var clientTypeID = data.tclienttype[i].ID || "";
                    var taxRateName = data.tclienttype[i].CodeName || "";
                    var clientTypeDesc = data.tclienttype[i].TypeDescription || "";
                    $("#edtClientTypeID").val(clientTypeID);
                    $("#edtClientTypeName").val(typeName);
                    $("#txaDescription").val(clientTypeDesc);
                    $("#typeID").val(clientTypeID);
                    setTimeout(function () {
                      $("#myModalClientType").modal("toggle");
                    }, 100);
                  }
                }
              })
              .catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $(".fullScreenSpin").css("display", "none");
                // Meteor._reload.reload();
              });
          });
      } else {
        $("#customerTypeListModal").modal("toggle");
      }
    }
  }


}
