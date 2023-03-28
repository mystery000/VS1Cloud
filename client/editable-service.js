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
        let $earch = $(e.currentTarget);
        let offset = $earch.offset();
        let salesAccountDataName = e.target.value || "";
        let accountType = "INC";
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
                                        for (
                                            let i = 0;
                                            i < data.taccountvs1.length;
                                            i++
                                        ) {
                                            if (
                                                data.taccountvs1[i]
                                                    .AccountName ===
                                                salesAccountDataName
                                            ) {
                                                $("#edtAccountName").attr(
                                                    "readonly",
                                                    true
                                                );
                                                let taxCode =
                                                    data.taccountvs1[i].TaxCode;
                                                let accountID =
                                                    data.taccountvs1[i].ID ||
                                                    "";
                                                let acountName =
                                                    data.taccountvs1[i]
                                                        .AccountName || "";
                                                let accountNo =
                                                    data.taccountvs1[i]
                                                        .AccountNumber || "";
                                                let accountType =
                                                    data.taccountvs1[i]
                                                        .AccountTypeName || "";
                                                let accountDesc =
                                                    data.taccountvs1[i]
                                                        .Description || "";
                                                $("#edtAccountID").val(
                                                    accountID
                                                );
                                                $("#sltAccountType").val(
                                                    accountType
                                                );
                                                $("#edtAccountName").val(
                                                    acountName
                                                );
                                                $("#edtAccountNo").val(
                                                    accountNo
                                                );
                                                $("#sltTaxCode").val(taxCode);
                                                $("#txaAccountDescription").val(
                                                    accountDesc
                                                );
                                                setTimeout(function () {
                                                    $("#addAccountModal").modal(
                                                        "toggle"
                                                    );
                                                }, 100);
                                            }
                                        }
                                    })
                                    .catch(function (err) {
                                        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                                        $(".fullScreenSpin").css(
                                            "display",
                                            "none"
                                        );
                                        // Meteor._reload.reload();
                                    });
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                let useData = data.taccountvs1;
                                let lineItems = [];
                                let lineItemObj = {};
                                $("#add-account-title").text(
                                    "Edit Account Details"
                                );
                                for (let i = 0; i < useData.length; i++) {
                                    if (
                                        useData[i].fields.AccountName ===
                                        salesAccountDataName
                                    ) {
                                        $("#edtAccountName").attr(
                                            "readonly",
                                            true
                                        );
                                        let taxCode = useData[i].fields.TaxCode;
                                        let accountID =
                                            useData[i].fields.ID || "";
                                        let acountName =
                                            useData[i].fields.AccountName || "";
                                        let accountNo =
                                            useData[i].fields.AccountNumber ||
                                            "";
                                        let accountType =
                                            useData[i].fields.AccountTypeName ||
                                            "";
                                        let accountDesc =
                                            useData[i].fields.Description || "";
                                        $("#edtAccountID").val(accountID);
                                        $("#sltAccountType").val(accountType);
                                        $("#edtAccountName").val(acountName);
                                        $("#edtAccountNo").val(accountNo);
                                        $("#sltTaxCode").val(taxCode);
                                        $("#txaAccountDescription").val(
                                            accountDesc
                                        );
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
                                    for (
                                        let i = 0;
                                        i < data.taccountvs1.length;
                                        i++
                                    ) {
                                        if (
                                            data.taccountvs1[i].AccountName ===
                                            salesAccountDataName
                                        ) {
                                            $("#add-account-title").text(
                                                "Edit Account Details"
                                            );
                                            let taxCode =
                                                data.taccountvs1[i].TaxCode;
                                            let accountID =
                                                data.taccountvs1[i].ID || "";
                                            let acountName =
                                                data.taccountvs1[i]
                                                    .AccountName || "";
                                            let accountNo =
                                                data.taccountvs1[i]
                                                    .AccountNumber || "";
                                            let accountType =
                                                data.taccountvs1[i]
                                                    .AccountTypeName || "";
                                            let accountDesc =
                                                data.taccountvs1[i]
                                                    .Description || "";
                                            $("#edtAccountID").val(accountID);
                                            $("#sltAccountType").val(
                                                accountType
                                            );
                                            $("#edtAccountName").val(
                                                acountName
                                            );
                                            $("#edtAccountNo").val(accountNo);
                                            $("#sltTaxCode").val(taxCode);
                                            $("#txaAccountDescription").val(
                                                accountDesc
                                            );
                                            setTimeout(function () {
                                                $("#addAccountModal").modal(
                                                    "toggle"
                                                );
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
        let $earch = $(e.currentTarget);
        let offset = $earch.offset();
        let uomDataName = e.target.value || "";
        if (e.pageX > offset.left + $earch.width() - 8) {
            $("#UOMListModal").modal("show");
        } else {
        }
    };

    clickUomSales = (e) => {
        $("#uomSelected").val("sales");
        this.clickUom(e);
    };

    clickUomPurchase = (e) => {
        $("#uomSelected").val("purchase");
        this.clickUom(e);
    };

    clickTaxCodes = (e) => {
        let $earch = $(e.currentTarget);
        let offset = $earch.offset();
        let taxRateDataName = e.target.value || "";
        let taxCodePurchaseDataName = e.target.value || "";
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
                                    for (
                                        let i = 0;
                                        i < data.ttaxcodevs1.length;
                                        i++
                                    ) {
                                        if (
                                            data.ttaxcodevs1[i].CodeName ===
                                            taxRateDataName
                                        ) {
                                            $("#edtTaxNamePop").attr(
                                                "readonly",
                                                true
                                            );
                                            let taxRate = (
                                                data.ttaxcodevs1[i].Rate * 100
                                            ).toFixed(2);
                                            let taxRateID =
                                                data.ttaxcodevs1[i].Id || "";
                                            let taxRateName =
                                                data.ttaxcodevs1[i].CodeName ||
                                                "";
                                            let taxRateDesc =
                                                data.ttaxcodevs1[i]
                                                    .Description || "";
                                            $("#edtTaxID").val(taxRateID);
                                            $("#edtTaxNamePop").val(
                                                taxRateName
                                            );
                                            $("#edtTaxRatePop").val(taxRate);
                                            $("#edtTaxDescPop").val(
                                                taxRateDesc
                                            );
                                            setTimeout(function () {
                                                $("#newTaxRateModal").modal(
                                                    "toggle"
                                                );
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
                                    let taxRate = (
                                        useData[i].Rate * 100
                                    ).toFixed(2);
                                    let taxRateID = useData[i].Id || "";
                                    let taxRateName = useData[i].CodeName || "";
                                    let taxRateDesc =
                                        useData[i].Description || "";
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
                                for (
                                    let i = 0;
                                    i < data.ttaxcodevs1.length;
                                    i++
                                ) {
                                    if (
                                        data.ttaxcodevs1[i].CodeName ===
                                        taxRateDataName
                                    ) {
                                        $("#edtTaxNamePop").attr(
                                            "readonly",
                                            true
                                        );
                                        let taxRate = (
                                            data.ttaxcodevs1[i].Rate * 100
                                        ).toFixed(2);
                                        let taxRateID =
                                            data.ttaxcodevs1[i].Id || "";
                                        let taxRateName =
                                            data.ttaxcodevs1[i].CodeName || "";
                                        let taxRateDesc =
                                            data.ttaxcodevs1[i].Description ||
                                            "";
                                        $("#edtTaxID").val(taxRateID);
                                        $("#edtTaxNamePop").val(taxRateName);
                                        $("#edtTaxRatePop").val(taxRate);
                                        $("#edtTaxDescPop").val(taxRateDesc);
                                        setTimeout(function () {
                                            $("#newTaxRateModal").modal(
                                                "toggle"
                                            );
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
        this.clickTaxCodes(e);
    };

    clickTaxCodePurchase = (e) => {
        $("#taxSelected").val("purchase");
        this.clickTaxCodes(e);
    };

    clickBinNumber = (e) => {
        let $earch = $(e.currentTarget);
        let offset = $earch.offset();
        if (e.pageX > offset.left + $earch.width() - 8) {
            // X button 16px wide?
            $("#binNumberListModal").modal("toggle");
        } else {
            $("#addBinNumberModal").modal("toggle");
        }
    };

    clickCustomerType = (e) => {
        let $earch = $(e.currentTarget);
        let offset = $earch.offset();
        let custTypeDataName = e.target.value || "";
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
                                    for (
                                        let i = 0;
                                        i < data.tclienttype.length;
                                        i++
                                    ) {
                                        if (
                                            data.tclienttype[i].TypeName ===
                                            custTypeDataName
                                        ) {
                                            $("#edtClientTypeName").attr(
                                                "readonly",
                                                true
                                            );
                                            let typeName =
                                                data.tclienttype[i].TypeName;
                                            let clientTypeID =
                                                data.tclienttype[i].ID || "";
                                            let taxRateName =
                                                data.tclienttype[i].CodeName ||
                                                "";
                                            let clientTypeDesc =
                                                data.tclienttype[i]
                                                    .TypeDescription || "";
                                            $("#edtClientTypeID").val(
                                                clientTypeID
                                            );
                                            $("#edtClientTypeName").val(
                                                typeName
                                            );
                                            $("#txaDescription").val(
                                                clientTypeDesc
                                            );
                                            $("#typeID").val(clientTypeID);
                                            setTimeout(function () {
                                                $("#myModalClientType").modal(
                                                    "toggle"
                                                );
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
                            $("#add-clienttype-title").text(
                                "Edit Customer Type"
                            );
                            for (let i = 0; i < useData.length; i++) {
                                if (
                                    useData[i].fields.TypeName ===
                                    custTypeDataName
                                ) {
                                    $("#edtClientTypeName").attr(
                                        "readonly",
                                        true
                                    );
                                    let typeName = useData[i].fields.TypeName;
                                    let clientTypeID =
                                        useData[i].fields.ID || "";
                                    let taxRateName =
                                        useData[i].fields.CodeName || "";
                                    let clientTypeDesc =
                                        useData[i].fields.TypeDescription || "";
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
                                for (
                                    let i = 0;
                                    i < data.ttaxcodevs1.length;
                                    i++
                                ) {
                                    if (
                                        data.ttaxcodevs1[i].TypeName ===
                                        custTypeDataName
                                    ) {
                                        let typeName =
                                            data.tclienttype[i].TypeName;
                                        let clientTypeID =
                                            data.tclienttype[i].ID || "";
                                        let taxRateName =
                                            data.tclienttype[i].CodeName || "";
                                        let clientTypeDesc =
                                            data.tclienttype[i]
                                                .TypeDescription || "";
                                        $("#edtClientTypeID").val(clientTypeID);
                                        $("#edtClientTypeName").val(typeName);
                                        $("#txaDescription").val(
                                            clientTypeDesc
                                        );
                                        $("#typeID").val(clientTypeID);
                                        setTimeout(function () {
                                            $("#myModalClientType").modal(
                                                "toggle"
                                            );
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
    };

    clickAccountant = (e) => {
      let $earch = $(e.currentTarget);
      let offset = $earch.offset();
      $("#edtSupplierPOPID").val("");
      let supplierDataName = e.target.value || "";      
      if (e.pageX > offset.left + $earch.width() - 8) {
          // X button 16px wide?
          $("#supplierListModal").modal();
          setTimeout(function () {
              $("#tblSupplierlist_filter .form-control-sm").focus();
              $("#tblSupplierlist_filter .form-control-sm").val("");
              $("#tblSupplierlist_filter .form-control-sm").trigger("input");
              let datatable = $("#tblSupplierlist").DataTable();
              datatable.draw();
              $("#tblSupplierlist_filter .form-control-sm").trigger("input");
          }, 500);
      } else {
        if (supplierDataName.replace(/\s/g, "") != "") {
          getVS1Data("TSupplierVS1")
            .then(function (dataObject) {
                if (dataObject.length == 0) {
                    $(".fullScreenSpin").css("display", "inline-block");
                    sideBarService
                        .getOneSupplierDataExByName(supplierDataName)
                        .then(function (data) {
                            $(".fullScreenSpin").css("display", "none");
                            let lineItems = [];

                            $("#add-supplier-title").text(
                                "Edit Supplier"
                            );
                            let popSupplierID =
                                data.tsupplier[0].fields.ID || "";
                            let popSupplierName =
                                data.tsupplier[0].fields.ClientName ||
                                "";
                            let popSupplierEmail =
                                data.tsupplier[0].fields.Email || "";
                            let popSupplierTitle =
                                data.tsupplier[0].fields.Title || "";
                            let popSupplierFirstName =
                                data.tsupplier[0].fields.FirstName ||
                                "";
                            let popSupplierMiddleName =
                                data.tsupplier[0].fields.CUSTFLD10 ||
                                "";
                            let popSupplierLastName =
                                data.tsupplier[0].fields.LastName || "";
                            let popSuppliertfn = "" || "";
                            let popSupplierPhone =
                                data.tsupplier[0].fields.Phone || "";
                            let popSupplierMobile =
                                data.tsupplier[0].fields.Mobile || "";
                            let popSupplierFaxnumber =
                                data.tsupplier[0].fields.Faxnumber ||
                                "";
                            let popSupplierSkypeName =
                                data.tsupplier[0].fields.SkypeName ||
                                "";
                            let popSupplierURL =
                                data.tsupplier[0].fields.URL || "";
                            let popSupplierStreet =
                                data.tsupplier[0].fields.Street || "";
                            let popSupplierStreet2 =
                                data.tsupplier[0].fields.Street2 || "";
                            let popSupplierState =
                                data.tsupplier[0].fields.State || "";
                            let popSupplierPostcode =
                                data.tsupplier[0].fields.Postcode || "";
                            let popSupplierCountry =
                                data.tsupplier[0].fields.Country ||
                                LoggedCountry;
                            let popSupplierbillingaddress =
                                data.tsupplier[0].fields.BillStreet ||
                                "";
                            let popSupplierbcity =
                                data.tsupplier[0].fields.BillStreet2 ||
                                "";
                            let popSupplierbstate =
                                data.tsupplier[0].fields.BillState ||
                                "";
                            let popSupplierbpostalcode =
                                data.tsupplier[0].fields.BillPostcode ||
                                "";
                            let popSupplierbcountry =
                                data.tsupplier[0].fields.Billcountry ||
                                LoggedCountry;
                            let popSuppliercustfield1 =
                                data.tsupplier[0].fields.CUSTFLD1 || "";
                            let popSuppliercustfield2 =
                                data.tsupplier[0].fields.CUSTFLD2 || "";
                            let popSuppliercustfield3 =
                                data.tsupplier[0].fields.CUSTFLD3 || "";
                            let popSuppliercustfield4 =
                                data.tsupplier[0].fields.CUSTFLD4 || "";
                            let popSuppliernotes =
                                data.tsupplier[0].fields.Notes || "";
                            let popSupplierpreferedpayment =
                                data.tsupplier[0].fields
                                    .PaymentMethodName || "";
                            let popSupplierterms =
                                data.tsupplier[0].fields.TermsName ||
                                "";
                            let popSupplierdeliverymethod =
                                data.tsupplier[0].fields
                                    .ShippingMethodName || "";
                            let popSupplieraccountnumber =
                                data.tsupplier[0].fields.ClientNo || "";
                            let popSupplierisContractor =
                                data.tsupplier[0].fields.Contractor ||
                                false;
                            let popSupplierissupplier =
                                data.tsupplier[0].fields.IsSupplier ||
                                false;
                            let popSupplieriscustomer =
                                data.tsupplier[0].fields.IsCustomer ||
                                false;

                            $("#edtSupplierCompany").val(
                                popSupplierName
                            );
                            $("#edtSupplierPOPID").val(popSupplierID);
                            $("#edtSupplierCompanyEmail").val(
                                popSupplierEmail
                            );
                            $("#edtSupplierTitle").val(
                                popSupplierTitle
                            );
                            $("#edtSupplierFirstName").val(
                                popSupplierFirstName
                            );
                            $("#edtSupplierMiddleName").val(
                                popSupplierMiddleName
                            );
                            $("#edtSupplierLastName").val(
                                popSupplierLastName
                            );
                            $("#edtSupplierPhone").val(
                                popSupplierPhone
                            );
                            $("#edtSupplierMobile").val(
                                popSupplierMobile
                            );
                            $("#edtSupplierFax").val(
                                popSupplierFaxnumber
                            );
                            $("#edtSupplierSkypeID").val(
                                popSupplierSkypeName
                            );
                            $("#edtSupplierWebsite").val(
                                popSupplierURL
                            );
                            $("#edtSupplierShippingAddress").val(
                                popSupplierStreet
                            );
                            $("#edtSupplierShippingCity").val(
                                popSupplierStreet2
                            );
                            $("#edtSupplierShippingState").val(
                                popSupplierState
                            );
                            $("#edtSupplierShippingZIP").val(
                                popSupplierPostcode
                            );
                            $("#sedtCountry").val(popSupplierCountry);
                            $("#txaNotes").val(popSuppliernotes);
                            $("#sltPreferedPayment").val(
                                popSupplierpreferedpayment
                            );
                            $("#sltTerms").val(popSupplierterms);
                            $("#suppAccountNo").val(
                                popSupplieraccountnumber
                            );
                            $("#edtCustomeField1").val(
                                popSuppliercustfield1
                            );
                            $("#edtCustomeField2").val(
                                popSuppliercustfield2
                            );
                            $("#edtCustomeField3").val(
                                popSuppliercustfield3
                            );
                            $("#edtCustomeField4").val(
                                popSuppliercustfield4
                            );

                            if (
                                data.tsupplier[0].fields.Street ==
                                    data.tsupplier[0].fields
                                        .BillStreet &&
                                data.tsupplier[0].fields.Street2 ==
                                    data.tsupplier[0].fields
                                        .BillStreet2 &&
                                data.tsupplier[0].fields.State ==
                                    data.tsupplier[0].fields
                                        .BillState &&
                                data.tsupplier[0].fields.Postcode ==
                                    data.tsupplier[0].fields.Postcode &&
                                data.tsupplier[0].fields.Country ==
                                    data.tsupplier[0].fields.Billcountry
                            ) {
                                //templateObject.isSameAddress.set(true);
                                $("#chkSameAsShipping").attr(
                                    "checked",
                                    "checked"
                                );
                            }
                            if (
                                data.tsupplier[0].fields.Contractor ==
                                true
                            ) {
                                // $('#isformcontractor')
                                $("#isformcontractor").attr(
                                    "checked",
                                    "checked"
                                );
                            } else {
                                $("#isformcontractor").removeAttr(
                                    "checked"
                                );
                            }

                            setTimeout(function () {
                                $("#addSupplierModal").modal("show");
                            }, 200);
                        })
                        .catch(function (err) {
                            $(".fullScreenSpin").css("display", "none");
                        });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tsuppliervs1;
                    let added = false;
                    for (let i = 0; i < data.tsuppliervs1.length; i++) {
                        if (
                            data.tsuppliervs1[i].fields.ClientName ===
                            supplierDataName
                        ) {
                            added = true;
                            $(".fullScreenSpin").css("display", "none");
                            let lineItems = [];
                            $("#add-supplier-title").text(
                                "Edit Supplier"
                            );
                            let popSupplierID =
                                data.tsuppliervs1[i].fields.ID || "";
                            let popSupplierName =
                                data.tsuppliervs1[i].fields
                                    .ClientName || "";
                            let popSupplierEmail =
                                data.tsuppliervs1[i].fields.Email || "";
                            let popSupplierTitle =
                                data.tsuppliervs1[i].fields.Title || "";
                            let popSupplierFirstName =
                                data.tsuppliervs1[i].fields.FirstName ||
                                "";
                            let popSupplierMiddleName =
                                data.tsuppliervs1[i].fields.CUSTFLD10 ||
                                "";
                            let popSupplierLastName =
                                data.tsuppliervs1[i].fields.LastName ||
                                "";
                            let popSuppliertfn = "" || "";
                            let popSupplierPhone =
                                data.tsuppliervs1[i].fields.Phone || "";
                            let popSupplierMobile =
                                data.tsuppliervs1[i].fields.Mobile ||
                                "";
                            let popSupplierFaxnumber =
                                data.tsuppliervs1[i].fields.Faxnumber ||
                                "";
                            let popSupplierSkypeName =
                                data.tsuppliervs1[i].fields.SkypeName ||
                                "";
                            let popSupplierURL =
                                data.tsuppliervs1[i].fields.URL || "";
                            let popSupplierStreet =
                                data.tsuppliervs1[i].fields.Street ||
                                "";
                            let popSupplierStreet2 =
                                data.tsuppliervs1[i].fields.Street2 ||
                                "";
                            let popSupplierState =
                                data.tsuppliervs1[i].fields.State || "";
                            let popSupplierPostcode =
                                data.tsuppliervs1[i].fields.Postcode ||
                                "";
                            let popSupplierCountry =
                                data.tsuppliervs1[i].fields.Country ||
                                LoggedCountry;
                            let popSupplierbillingaddress =
                                data.tsuppliervs1[i].fields
                                    .BillStreet || "";
                            let popSupplierbcity =
                                data.tsuppliervs1[i].fields
                                    .BillStreet2 || "";
                            let popSupplierbstate =
                                data.tsuppliervs1[i].fields.BillState ||
                                "";
                            let popSupplierbpostalcode =
                                data.tsuppliervs1[i].fields
                                    .BillPostcode || "";
                            let popSupplierbcountry =
                                data.tsuppliervs1[i].fields
                                    .Billcountry || LoggedCountry;
                            let popSuppliercustfield1 =
                                data.tsuppliervs1[i].fields.CUSTFLD1 ||
                                "";
                            let popSuppliercustfield2 =
                                data.tsuppliervs1[i].fields.CUSTFLD2 ||
                                "";
                            let popSuppliercustfield3 =
                                data.tsuppliervs1[i].fields.CUSTFLD3 ||
                                "";
                            let popSuppliercustfield4 =
                                data.tsuppliervs1[i].fields.CUSTFLD4 ||
                                "";
                            let popSuppliernotes =
                                data.tsuppliervs1[i].fields.Notes || "";
                            let popSupplierpreferedpayment =
                                data.tsuppliervs1[i].fields
                                    .PaymentMethodName || "";
                            let popSupplierterms =
                                data.tsuppliervs1[i].fields.TermsName ||
                                "";
                            let popSupplierdeliverymethod =
                                data.tsuppliervs1[i].fields
                                    .ShippingMethodName || "";
                            let popSupplieraccountnumber =
                                data.tsuppliervs1[i].fields.ClientNo ||
                                "";
                            let popSupplierisContractor =
                                data.tsuppliervs1[i].fields
                                    .Contractor || false;
                            let popSupplierissupplier =
                                data.tsuppliervs1[i].fields
                                    .IsSupplier || false;
                            let popSupplieriscustomer =
                                data.tsuppliervs1[i].fields
                                    .IsCustomer || false;

                            $("#edtSupplierCompany").val(
                                popSupplierName
                            );
                            $("#edtSupplierPOPID").val(popSupplierID);
                            $("#edtSupplierCompanyEmail").val(
                                popSupplierEmail
                            );
                            $("#edtSupplierTitle").val(
                                popSupplierTitle
                            );
                            $("#edtSupplierFirstName").val(
                                popSupplierFirstName
                            );
                            $("#edtSupplierMiddleName").val(
                                popSupplierMiddleName
                            );
                            $("#edtSupplierLastName").val(
                                popSupplierLastName
                            );
                            $("#edtSupplierPhone").val(
                                popSupplierPhone
                            );
                            $("#edtSupplierMobile").val(
                                popSupplierMobile
                            );
                            $("#edtSupplierFax").val(
                                popSupplierFaxnumber
                            );
                            $("#edtSupplierSkypeID").val(
                                popSupplierSkypeName
                            );
                            $("#edtSupplierWebsite").val(
                                popSupplierURL
                            );
                            $("#edtSupplierShippingAddress").val(
                                popSupplierStreet
                            );
                            $("#edtSupplierShippingCity").val(
                                popSupplierStreet2
                            );
                            $("#edtSupplierShippingState").val(
                                popSupplierState
                            );
                            $("#edtSupplierShippingZIP").val(
                                popSupplierPostcode
                            );
                            $("#sedtCountry").val(popSupplierCountry);
                            $("#txaNotes").val(popSuppliernotes);
                            $("#sltPreferedPayment").val(
                                popSupplierpreferedpayment
                            );
                            $("#sltTerms").val(popSupplierterms);
                            $("#suppAccountNo").val(
                                popSupplieraccountnumber
                            );
                            $("#edtCustomeField1").val(
                                popSuppliercustfield1
                            );
                            $("#edtCustomeField2").val(
                                popSuppliercustfield2
                            );
                            $("#edtCustomeField3").val(
                                popSuppliercustfield3
                            );
                            $("#edtCustomeField4").val(
                                popSuppliercustfield4
                            );

                            if (
                                data.tsuppliervs1[i].fields.Street ==
                                    data.tsuppliervs1[i].fields
                                        .BillStreet &&
                                data.tsuppliervs1[i].fields.Street2 ==
                                    data.tsuppliervs1[i].fields
                                        .BillStreet2 &&
                                data.tsuppliervs1[i].fields.State ==
                                    data.tsuppliervs1[i].fields
                                        .BillState &&
                                data.tsuppliervs1[i].fields.Postcode ==
                                    data.tsuppliervs1[i].fields
                                        .Postcode &&
                                data.tsuppliervs1[i].fields.Country ==
                                    data.tsuppliervs1[i].fields
                                        .Billcountry
                            ) {
                                //templateObject.isSameAddress.set(true);
                                $("#chkSameAsShipping").attr(
                                    "checked",
                                    "checked"
                                );
                            }
                            if (
                                data.tsuppliervs1[i].fields
                                    .Contractor == true
                            ) {
                                // $('#isformcontractor')
                                $("#isformcontractor").attr(
                                    "checked",
                                    "checked"
                                );
                            } else {
                                $("#isformcontractor").removeAttr(
                                    "checked"
                                );
                            }

                            setTimeout(function () {
                                $("#addSupplierModal").modal("show");
                            }, 200);
                        }
                    }

                    if (!added) {
                        $(".fullScreenSpin").css(
                            "display",
                            "inline-block"
                        );
                        sideBarService
                            .getOneSupplierDataExByName(
                                supplierDataName
                            )
                            .then(function (data) {
                                $(".fullScreenSpin").css(
                                    "display",
                                    "none"
                                );
                                let lineItems = [];

                                $("#add-supplier-title").text(
                                    "Edit Supplier"
                                );
                                let popSupplierID =
                                    data.tsupplier[0].fields.ID || "";
                                let popSupplierName =
                                    data.tsupplier[0].fields
                                        .ClientName || "";
                                let popSupplierEmail =
                                    data.tsupplier[0].fields.Email ||
                                    "";
                                let popSupplierTitle =
                                    data.tsupplier[0].fields.Title ||
                                    "";
                                let popSupplierFirstName =
                                    data.tsupplier[0].fields
                                        .FirstName || "";
                                let popSupplierMiddleName =
                                    data.tsupplier[0].fields
                                        .CUSTFLD10 || "";
                                let popSupplierLastName =
                                    data.tsupplier[0].fields.LastName ||
                                    "";
                                let popSuppliertfn = "" || "";
                                let popSupplierPhone =
                                    data.tsupplier[0].fields.Phone ||
                                    "";
                                let popSupplierMobile =
                                    data.tsupplier[0].fields.Mobile ||
                                    "";
                                let popSupplierFaxnumber =
                                    data.tsupplier[0].fields
                                        .Faxnumber || "";
                                let popSupplierSkypeName =
                                    data.tsupplier[0].fields
                                        .SkypeName || "";
                                let popSupplierURL =
                                    data.tsupplier[0].fields.URL || "";
                                let popSupplierStreet =
                                    data.tsupplier[0].fields.Street ||
                                    "";
                                let popSupplierStreet2 =
                                    data.tsupplier[0].fields.Street2 ||
                                    "";
                                let popSupplierState =
                                    data.tsupplier[0].fields.State ||
                                    "";
                                let popSupplierPostcode =
                                    data.tsupplier[0].fields.Postcode ||
                                    "";
                                let popSupplierCountry =
                                    data.tsupplier[0].fields.Country ||
                                    LoggedCountry;
                                let popSupplierbillingaddress =
                                    data.tsupplier[0].fields
                                        .BillStreet || "";
                                let popSupplierbcity =
                                    data.tsupplier[0].fields
                                        .BillStreet2 || "";
                                let popSupplierbstate =
                                    data.tsupplier[0].fields
                                        .BillState || "";
                                let popSupplierbpostalcode =
                                    data.tsupplier[0].fields
                                        .BillPostcode || "";
                                let popSupplierbcountry =
                                    data.tsupplier[0].fields
                                        .Billcountry || LoggedCountry;
                                let popSuppliercustfield1 =
                                    data.tsupplier[0].fields.CUSTFLD1 ||
                                    "";
                                let popSuppliercustfield2 =
                                    data.tsupplier[0].fields.CUSTFLD2 ||
                                    "";
                                let popSuppliercustfield3 =
                                    data.tsupplier[0].fields.CUSTFLD3 ||
                                    "";
                                let popSuppliercustfield4 =
                                    data.tsupplier[0].fields.CUSTFLD4 ||
                                    "";
                                let popSuppliernotes =
                                    data.tsupplier[0].fields.Notes ||
                                    "";
                                let popSupplierpreferedpayment =
                                    data.tsupplier[0].fields
                                        .PaymentMethodName || "";
                                let popSupplierterms =
                                    data.tsupplier[0].fields
                                        .TermsName || "";
                                let popSupplierdeliverymethod =
                                    data.tsupplier[0].fields
                                        .ShippingMethodName || "";
                                let popSupplieraccountnumber =
                                    data.tsupplier[0].fields.ClientNo ||
                                    "";
                                let popSupplierisContractor =
                                    data.tsupplier[0].fields
                                        .Contractor || false;
                                let popSupplierissupplier =
                                    data.tsupplier[0].fields
                                        .IsSupplier || false;
                                let popSupplieriscustomer =
                                    data.tsupplier[0].fields
                                        .IsCustomer || false;

                                $("#edtSupplierCompany").val(
                                    popSupplierName
                                );
                                $("#edtSupplierPOPID").val(
                                    popSupplierID
                                );
                                $("#edtSupplierCompanyEmail").val(
                                    popSupplierEmail
                                );
                                $("#edtSupplierTitle").val(
                                    popSupplierTitle
                                );
                                $("#edtSupplierFirstName").val(
                                    popSupplierFirstName
                                );
                                $("#edtSupplierMiddleName").val(
                                    popSupplierMiddleName
                                );
                                $("#edtSupplierLastName").val(
                                    popSupplierLastName
                                );
                                $("#edtSupplierPhone").val(
                                    popSupplierPhone
                                );
                                $("#edtSupplierMobile").val(
                                    popSupplierMobile
                                );
                                $("#edtSupplierFax").val(
                                    popSupplierFaxnumber
                                );
                                $("#edtSupplierSkypeID").val(
                                    popSupplierSkypeName
                                );
                                $("#edtSupplierWebsite").val(
                                    popSupplierURL
                                );
                                $("#edtSupplierShippingAddress").val(
                                    popSupplierStreet
                                );
                                $("#edtSupplierShippingCity").val(
                                    popSupplierStreet2
                                );
                                $("#edtSupplierShippingState").val(
                                    popSupplierState
                                );
                                $("#edtSupplierShippingZIP").val(
                                    popSupplierPostcode
                                );
                                $("#sedtCountry").val(
                                    popSupplierCountry
                                );
                                $("#txaNotes").val(popSuppliernotes);
                                $("#sltPreferedPayment").val(
                                    popSupplierpreferedpayment
                                );
                                $("#sltTerms").val(popSupplierterms);
                                $("#suppAccountNo").val(
                                    popSupplieraccountnumber
                                );
                                $("#edtCustomeField1").val(
                                    popSuppliercustfield1
                                );
                                $("#edtCustomeField2").val(
                                    popSuppliercustfield2
                                );
                                $("#edtCustomeField3").val(
                                    popSuppliercustfield3
                                );
                                $("#edtCustomeField4").val(
                                    popSuppliercustfield4
                                );

                                if (
                                    data.tsupplier[0].fields.Street ==
                                        data.tsupplier[0].fields
                                            .BillStreet &&
                                    data.tsupplier[0].fields.Street2 ==
                                        data.tsupplier[0].fields
                                            .BillStreet2 &&
                                    data.tsupplier[0].fields.State ==
                                        data.tsupplier[0].fields
                                            .BillState &&
                                    data.tsupplier[0].fields.Postcode ==
                                        data.tsupplier[0].fields
                                            .Postcode &&
                                    data.tsupplier[0].fields.Country ==
                                        data.tsupplier[0].fields
                                            .Billcountry
                                ) {
                                    //templateObject.isSameAddress.set(true);
                                    $("#chkSameAsShipping").attr(
                                        "checked",
                                        "checked"
                                    );
                                }
                                if (
                                    data.tsupplier[0].fields
                                        .Contractor == true
                                ) {
                                    // $('#isformcontractor')
                                    $("#isformcontractor").attr(
                                        "checked",
                                        "checked"
                                    );
                                } else {
                                    $("#isformcontractor").removeAttr(
                                        "checked"
                                    );
                                }

                                setTimeout(function () {
                                    $("#addSupplierModal").modal(
                                        "show"
                                    );
                                }, 200);
                            })
                            .catch(function (err) {
                                $(".fullScreenSpin").css(
                                    "display",
                                    "none"
                                );
                            });
                    }
                }
            })
            .catch(function (err) {
                sideBarService
                    .getOneSupplierDataExByName(supplierDataName)
                    .then(function (data) {
                        $(".fullScreenSpin").css("display", "none");
                        let lineItems = [];

                        $("#add-supplier-title").text("Edit Supplier");
                        let popSupplierID =
                            data.tsupplier[0].fields.ID || "";
                        let popSupplierName =
                            data.tsupplier[0].fields.ClientName || "";
                        let popSupplierEmail =
                            data.tsupplier[0].fields.Email || "";
                        let popSupplierTitle =
                            data.tsupplier[0].fields.Title || "";
                        let popSupplierFirstName =
                            data.tsupplier[0].fields.FirstName || "";
                        let popSupplierMiddleName =
                            data.tsupplier[0].fields.CUSTFLD10 || "";
                        let popSupplierLastName =
                            data.tsupplier[0].fields.LastName || "";
                        let popSuppliertfn = "" || "";
                        let popSupplierPhone =
                            data.tsupplier[0].fields.Phone || "";
                        let popSupplierMobile =
                            data.tsupplier[0].fields.Mobile || "";
                        let popSupplierFaxnumber =
                            data.tsupplier[0].fields.Faxnumber || "";
                        let popSupplierSkypeName =
                            data.tsupplier[0].fields.SkypeName || "";
                        let popSupplierURL =
                            data.tsupplier[0].fields.URL || "";
                        let popSupplierStreet =
                            data.tsupplier[0].fields.Street || "";
                        let popSupplierStreet2 =
                            data.tsupplier[0].fields.Street2 || "";
                        let popSupplierState =
                            data.tsupplier[0].fields.State || "";
                        let popSupplierPostcode =
                            data.tsupplier[0].fields.Postcode || "";
                        let popSupplierCountry =
                            data.tsupplier[0].fields.Country ||
                            LoggedCountry;
                        let popSupplierbillingaddress =
                            data.tsupplier[0].fields.BillStreet || "";
                        let popSupplierbcity =
                            data.tsupplier[0].fields.BillStreet2 || "";
                        let popSupplierbstate =
                            data.tsupplier[0].fields.BillState || "";
                        let popSupplierbpostalcode =
                            data.tsupplier[0].fields.BillPostcode || "";
                        let popSupplierbcountry =
                            data.tsupplier[0].fields.Billcountry ||
                            LoggedCountry;
                        let popSuppliercustfield1 =
                            data.tsupplier[0].fields.CUSTFLD1 || "";
                        let popSuppliercustfield2 =
                            data.tsupplier[0].fields.CUSTFLD2 || "";
                        let popSuppliercustfield3 =
                            data.tsupplier[0].fields.CUSTFLD3 || "";
                        let popSuppliercustfield4 =
                            data.tsupplier[0].fields.CUSTFLD4 || "";
                        let popSuppliernotes =
                            data.tsupplier[0].fields.Notes || "";
                        let popSupplierpreferedpayment =
                            data.tsupplier[0].fields
                                .PaymentMethodName || "";
                        let popSupplierterms =
                            data.tsupplier[0].fields.TermsName || "";
                        let popSupplierdeliverymethod =
                            data.tsupplier[0].fields
                                .ShippingMethodName || "";
                        let popSupplieraccountnumber =
                            data.tsupplier[0].fields.ClientNo || "";
                        let popSupplierisContractor =
                            data.tsupplier[0].fields.Contractor ||
                            false;
                        let popSupplierissupplier =
                            data.tsupplier[0].fields.IsSupplier ||
                            false;
                        let popSupplieriscustomer =
                            data.tsupplier[0].fields.IsCustomer ||
                            false;

                        $("#edtSupplierCompany").val(popSupplierName);
                        $("#edtSupplierPOPID").val(popSupplierID);
                        $("#edtSupplierCompanyEmail").val(
                            popSupplierEmail
                        );
                        $("#edtSupplierTitle").val(popSupplierTitle);
                        $("#edtSupplierFirstName").val(
                            popSupplierFirstName
                        );
                        $("#edtSupplierMiddleName").val(
                            popSupplierMiddleName
                        );
                        $("#edtSupplierLastName").val(
                            popSupplierLastName
                        );
                        $("#edtSupplierPhone").val(popSupplierPhone);
                        $("#edtSupplierMobile").val(popSupplierMobile);
                        $("#edtSupplierFax").val(popSupplierFaxnumber);
                        $("#edtSupplierSkypeID").val(
                            popSupplierSkypeName
                        );
                        $("#edtSupplierWebsite").val(popSupplierURL);
                        $("#edtSupplierShippingAddress").val(
                            popSupplierStreet
                        );
                        $("#edtSupplierShippingCity").val(
                            popSupplierStreet2
                        );
                        $("#edtSupplierShippingState").val(
                            popSupplierState
                        );
                        $("#edtSupplierShippingZIP").val(
                            popSupplierPostcode
                        );
                        $("#sedtCountry").val(popSupplierCountry);
                        $("#txaNotes").val(popSuppliernotes);
                        $("#sltPreferedPayment").val(
                            popSupplierpreferedpayment
                        );
                        $("#sltTerms").val(popSupplierterms);
                        $("#suppAccountNo").val(
                            popSupplieraccountnumber
                        );
                        $("#edtCustomeField1").val(
                            popSuppliercustfield1
                        );
                        $("#edtCustomeField2").val(
                            popSuppliercustfield2
                        );
                        $("#edtCustomeField3").val(
                            popSuppliercustfield3
                        );
                        $("#edtCustomeField4").val(
                            popSuppliercustfield4
                        );

                        if (
                            data.tsupplier[0].fields.Street ==
                                data.tsupplier[0].fields.BillStreet &&
                            data.tsupplier[0].fields.Street2 ==
                                data.tsupplier[0].fields.BillStreet2 &&
                            data.tsupplier[0].fields.State ==
                                data.tsupplier[0].fields.BillState &&
                            data.tsupplier[0].fields.Postcode ==
                                data.tsupplier[0].fields.Postcode &&
                            data.tsupplier[0].fields.Country ==
                                data.tsupplier[0].fields.Billcountry
                        ) {
                            //templateObject.isSameAddress.set(true);
                            $("#chkSameAsShipping").attr(
                                "checked",
                                "checked"
                            );
                        }
                        if (
                            data.tsupplier[0].fields.Contractor == true
                        ) {
                            // $('#isformcontractor')
                            $("#isformcontractor").attr(
                                "checked",
                                "checked"
                            );
                        } else {
                            $("#isformcontractor").removeAttr(
                                "checked"
                            );
                        }

                        setTimeout(function () {
                            $("#addSupplierModal").modal("show");
                        }, 200);
                    })
                    .catch(function (err) {
                        $(".fullScreenSpin").css("display", "none");
                    });
            });
            //FlowRouter.go('/supplierscard?name=' + e.target.value);
        } else {
          $("#supplierListModal").modal();
          setTimeout(function () {
              $("#tblSupplierlist_filter .form-control-sm").focus();
              $("#tblSupplierlist_filter .form-control-sm").val("");
              $("#tblSupplierlist_filter .form-control-sm").trigger(
                  "input"
              );
              let datatable = $("#tblSupplierlist").DataTable();
              datatable.draw();
              $("#tblSupplierlist_filter .form-control-sm").trigger(
                  "input"
              );
          }, 500);
        }
      }
    };

    clickDepartment = (e) => {
        let $earch = $(e.currentTarget);
        let offset = $earch.offset();
        var deptDataName = e.target.value || "";
        if (e.pageX > offset.left + $earch.width() - 8) {
            $("#myModalDepartment").modal("toggle");
        }
        else {
            if (deptDataName.replace(/\s/g, "") != "") {
                $("#newDeptHeader").text("Edit Department");
                getVS1Data("TDeptClass")
                    .then(function (dataObject) {
                        if (dataObject.length == 0) {
                            $(".fullScreenSpin").css("display", "inline-block");
                            sideBarService.getDepartment().then(function (data) {
                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                    if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                        $("#edtDepartmentID").val(data.tdeptclass[i].Id);
                                        $("#edtNewDeptName").val(data.tdeptclass[i].DeptClassName);
                                        $("#edtSiteCode").val(data.tdeptclass[i].SiteCode);
                                        $("#edtDeptDesc").val(data.tdeptclass[i].Description);
                                    }
                                }
                                setTimeout(function () {
                                    $(".fullScreenSpin").css("display", "none");
                                    $("#newDepartmentModal").modal("toggle");
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                console.log(data.tdeptclass[i].DeptClassName);
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $("#edtDepartmentID").val(data.tdeptclass[i].Id);
                                    $("#edtNewDeptName").val(data.tdeptclass[i].DeptClassName);
                                    $("#edtSiteCode").val(data.tdeptclass[i].SiteCode);
                                    $("#edtDeptDesc").val(data.tdeptclass[i].Description);
                                    break;
                                }
                            }
                            $(".fullScreenSpin").css("display", "none");
                            $("#newDepartmentModal").modal("toggle");
                        }
                    })
                    .catch(function (err) {
                        $(".fullScreenSpin").css("display", "inline-block");
                        sideBarService.getDepartment().then(function (data) {
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $("#edtDepartmentID").val(data.tdeptclass[i].Id);
                                    $("#edtNewDeptName").val(data.tdeptclass[i].DeptClassName);
                                    $("#edtSiteCode").val(data.tdeptclass[i].SiteCode);
                                    $("#edtDeptDesc").val(data.tdeptclass[i].Description);
                                    break;
                                }
                            }
                            $(".fullScreenSpin").css("display", "none");
                            $("#newDepartmentModal").modal("toggle");
                        });
                    });
            } else {
                $("#myModalDepartment").modal();
                setTimeout(function () {
                    $("#departmentList_filter .form-control-sm").focus();
                    $("#departmentList_filter .form-control-sm").val("");
                    $("#departmentList_filter .form-control-sm").trigger("input");
                    $("#departmentList_filter .form-control-sm").trigger("input");
                }, 500);
            }
        }
    };
}
