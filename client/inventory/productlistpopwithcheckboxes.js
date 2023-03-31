import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { DashBoardService } from "../Dashboard/dashboard-service";
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
import "../lib/global/erp-objects";
import "jquery-ui-dist/external/jquery/jquery";
import "jquery-ui-dist/jquery-ui";
import { Random } from "meteor/random";
import { jsPDF } from "jspdf";
import "jQuery.print/jQuery.print.js";
import { autoTable } from "jspdf-autotable";
import "jquery-editable-select";
import { SideBarService } from "../js/sidebar-service";
import "../lib/global/indexdbstorage.js";

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './productlistpopwithcheckboxes.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.productlistpopwithcheckboxes.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.InvoiceNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.invoicerecord = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.InvoiceId = new ReactiveVar();
    templateObject.selectedCurrency = new ReactiveVar([]);
    templateObject.inputSelectedCurrency = new ReactiveVar([]);
    templateObject.currencySymbol = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.termrecords = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);
    templateObject.record = new ReactiveVar({});
    templateObject.accountID = new ReactiveVar();
    templateObject.stripe_fee_method = new ReactiveVar();
    /* Attachments */
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();

    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();
    templateObject.statusrecords = new ReactiveVar([]);

    templateObject.includeBOnShippedQty = new ReactiveVar();
    templateObject.includeBOnShippedQty.set(true);
    templateObject.productextrasellrecords = new ReactiveVar([]);
});

Template.productlistpopwithcheckboxes.onRendered(function() {
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    const lineExtaSellItems = [];
    var currentLoc = FlowRouter.current().route.path;
    tempObj.getAllProducts = function() {
        getVS1Data("TProductQtyList")
            .then(function(dataObject) {
                if (dataObject.length == 0) {
                    sideBarService
                        .getNewProductListVS1(initialBaseDataLoad, 0)
                        .then(function(data) {
                            addVS1Data("TProductQtyList", JSON.stringify(data));
                            let records = [];
                            let inventoryData = [];

                            for (let i = 0; i < data.tproductqtylist.length; i++) {
                                if (data.tproductqtylist[i].Active == true) {
                                    linestatus = "";
                                } else if (data.tproductqtylist[i].Active == false) {
                                    linestatus = "In-Active";
                                };
                                costprice = utilityService.modifynegativeCurrencyFormat(
                                    Math.floor(data.tproductqtylist[i].BuyQTY1 * 100) / 100); //Cost Price
                                sellprice = utilityService.modifynegativeCurrencyFormat(
                                    Math.floor(data.tproductqtylist[i].SellQTY1 * 100) / 100); //Sell Price
                                if (data.tproductqtylist[i].ExtraSellPrice != null) {
                                    for (
                                        let e = 0; e < data.tproductqtylist[i].ExtraSellPrice.length; e++
                                    ) {
                                        let lineExtaSellObj = {
                                            clienttype: data.tproductqtylist[i].ExtraSellPrice[e]
                                                .ClientTypeName || "",
                                            productname: data.tproductqtylist[i].ExtraSellPrice[e]
                                                .ProductName ||
                                                data.tproductqtylist[i].ProductName,
                                            price: utilityService.modifynegativeCurrencyFormat(
                                                data.tproductqtylist[i].ExtraSellPrice[e]
                                                .Price1
                                            ) || 0,
                                            qtypercent: data.tproductqtylist[i].QtyPercent1 || 0,
                                        };
                                        lineExtaSellItems.push(lineExtaSellObj);
                                    }
                                }
                                var dataList = "";
                                if (currentLoc == "/purchaseordercard") {
                                    dataList = [
                                        '<div class="custom-control custom-switch chkBox pointer" style="width:15px;"><input name="appointment-products-checks" class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                                        data.tproductqtylist[i].PARTSID +
                                        "x" +
                                        data.tproductqtylist[i].ProductName +
                                        '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                                        data.tproductqtylist[i].PARTSID +
                                        "x" +
                                        data.tproductqtylist[i].ProductName +
                                        '"></label></div>',
                                        data.tproductqtylist[i].PARTSID || "",
                                        data.tproductqtylist[i].ProductName || "",
                                        data.tproductqtylist[i].SalesDescription || "",
                                        data.tproductqtylist[i].BARCODE || "",
                                        costprice,
                                        sellprice,
                                        data.tproductqtylist[i].InstockQty,
                                        data.tproductqtylist[i].PurchaseTaxcode || "",
                                        data.tproductqtylist[i].PRODUCTCODE || "",
                                        data.tproductqtylist[i].Ex_Works || null,
                                        linestatus
                                    ];
                                } else {
                                    dataList = [
                                        '<div class="custom-control custom-switch chkBox pointer" style="width:15px;"><input name="appointment-products-checks" class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="productCheck-' +
                                        data.tproductqtylist[i].PARTSID +
                                        '"><label class="custom-control-label chkBox pointer" for="productCheck-' +
                                        data.tproductqtylist[i].PARTSID +
                                        '"></label></div>',
                                        data.tproductqtylist[i].PARTSID || "",
                                        data.tproductqtylist[i].ProductName || "",
                                        data.tproductqtylist[i].SalesDescription || "",
                                        data.tproductqtylist[i].BARCODE || "",
                                        costprice,
                                        sellprice,
                                        data.tproductqtylist[i].InstockQty,
                                        data.tproductqtylist[i].PurchaseTaxcode || "",
                                        data.tproductqtylist[i].PRODUCTCODE || "",
                                        data.tproductqtylist[i].Ex_Works || null,
                                        linestatus
                                    ];
                                }

                                if (currentLoc == "/stockadjustmentcard") {
                                    if (data.tproductqtylist[i].PRODUCTGROUP == "INV") {
                                        splashArrayProductList.push(dataList);
                                    }
                                } else {
                                    splashArrayProductList.push(dataList);
                                }
                            }

                        });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tproductqtylist;
                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.tproductqtylist.length; i++) {
                        if (data.tproductqtylist[i].Active == true) {
                            linestatus = "";
                        } else if (data.tproductqtylist[i].Active == false) {
                            linestatus = "In-Active";
                        };
                        costprice = utilityService.modifynegativeCurrencyFormat(
                            Math.floor(data.tproductqtylist[i].BuyQty1Cost * 100) / 100); //Cost Price
                        sellprice = utilityService.modifynegativeCurrencyFormat(
                            Math.floor(data.tproductqtylist[i].SellQty1Price* 100) / 100); //Sell Price
                        if (data.tproductqtylist[i].ExtraSellPrice != null) {
                            for (
                                let e = 0; e < data.tproductqtylist[i].ExtraSellPrice.length; e++
                            ) {
                                let lineExtaSellObj = {
                                    clienttype: data.tproductqtylist[i].ExtraSellPrice[e]
                                        .ClientTypeName || "",
                                    productname: data.tproductqtylist[i].ExtraSellPrice[e]
                                        .ProductName || data.tproductqtylist[i].ProductName,
                                    price: utilityService.modifynegativeCurrencyFormat(
                                        data.tproductqtylist[i].ExtraSellPrice[e].Price1
                                    ) || 0,
                                    qtypercent: data.tproductqtylist[i].QtyPercent1 || 0,
                                };
                                lineExtaSellItems.push(lineExtaSellObj);
                            }
                        }

                        var dataList = "";
                        if (currentLoc == "/purchaseordercard") {
                            dataList = [
                                '<div class="custom-control custom-switch chkBox pointer" style="width:15px;"><input name="appointment-products-checks" class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                                data.tproductqtylist[i].PARTSID +
                                "x" +
                                data.tproductqtylist[i].ProductName +
                                '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                                data.tproductqtylist[i].PARTSID +
                                "x" +
                                data.tproductqtylist[i].ProductName +
                                '"></label></div>',
                                data.tproductqtylist[i].PARTSID || "",
                                data.tproductqtylist[i].ProductName || "",
                                data.tproductqtylist[i].SalesDescription || "",
                                data.tproductqtylist[i].BARCODE || "",
                                costprice,
                                sellprice,
                                data.tproductqtylist[i].InstockQty,
                                data.tproductqtylist[i].PurchaseTaxcode || "",
                                data.tproductqtylist[i].PRODUCTCODE || "",
                                data.tproductqtylist[i].Ex_Works || null,
                                linestatus
                            ];
                        } else {
                            dataList = [
                                '<div class="custom-control custom-switch chkBox pointer" style="width:15px;"><input name="appointment-products-checks" class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="productCheck-' +
                                data.tproductqtylist[i].PARTSID +
                                '"><label class="custom-control-label chkBox pointer" for="productCheck-' +
                                data.tproductqtylist[i].PARTSID +
                                '"></label></div>',
                                data.tproductqtylist[i].PARTSID || "",
                                data.tproductqtylist[i].ProductName || "",
                                data.tproductqtylist[i].SalesDescription || "",
                                data.tproductqtylist[i].BARCODE || "",
                                costprice,
                                sellprice,
                                data.tproductqtylist[i].InstockQty,
                                data.tproductqtylist[i].PurchaseTaxcode || "",
                                data.tproductqtylist[i].PRODUCTCODE || "",
                                data.tproductqtylist[i].Ex_Works || null,
                                linestatus
                            ];
                        }

                        // splashArrayProductList.push(dataList);
                        if (currentLoc == "/stockadjustmentcard") {
                            if (data.tproductqtylist[i].PRODUCTGROUP == "INV") {
                                splashArrayProductList.push(dataList);
                            }
                        } else {
                            splashArrayProductList.push(dataList);
                        }
                    }

                    tempObj.productextrasellrecords.set(lineExtaSellItems);

                }
            })
            .catch(function(err) {
                sideBarService
                    .getNewProductListVS1(initialBaseDataLoad, 0)
                    .then(function(data) {
                        addVS1Data("TProductQtyList", JSON.stringify(data));
                        let records = [];
                        let inventoryData = [];
                        let buyrate = 0.00;
                        let sellrate = 0.00;
                        let linestatus = '';



                        for (let i = 0; i < data.tproductqtylist.length; i++) {
                            if (data.tproductqtylist[i].Active == true) {
                                linestatus = "";
                            } else if (data.tproductqtylist[i].Active == false) {
                                linestatus = "In-Active";
                            };
                            chkBox = '<div class="custom-control custom-switch chkBox pointer" style="width:15px;"><input name="pointer" class="custom-control-input chkBox pointer" type="checkbox" id="formCheck-' + data.tproductqtylist[i].PARTSID + "x" + data.tproductqtylist[i].ProductName +
                            '"><label class="custom-control-label chkBox pointer" for="formCheck-' + data.tproductqtylist[i].PARTSID +
                            "x" + data.tproductqtylist[i].ProductName +
                            '"></label></div>'; //switchbox

                            costprice = utilityService.modifynegativeCurrencyFormat(
                                Math.floor(data.tproductqtylist[i].BuyQty1Cost * 100) / 100); //Cost Price
                            sellprice = utilityService.modifynegativeCurrencyFormat(
                                Math.floor(data.tproductqtylist[i].SellQty1Price* 100) / 100); //Sell Price

                            if (data.tproductqtylist[i].ExtraSellPrice != null) {
                                for (
                                    let e = 0; e < data.tproductqtylist[i].ExtraSellPrice.length; e++
                                ) {
                                    let lineExtaSellObj = {
                                        clienttype: data.tproductqtylist[i].ExtraSellPrice[e]
                                            .ClientTypeName || "",
                                        productname: data.tproductqtylist[i].ExtraSellPrice[e]
                                            .ProductName || data.tproductqtylist[i].ProductName,
                                        price: utilityService.modifynegativeCurrencyFormat(
                                            data.tproductqtylist[i].ExtraSellPrice[e]
                                            .Price1
                                        ) || 0,
                                        qtypercent: data.tproductqtylist[i].QtyPercent1 || 0,
                                    };
                                    lineExtaSellItems.push(lineExtaSellObj);
                                }
                            }
                            var dataList = "";

                            if (currentLoc == "/purchaseordercard") {
                                dataList = [
                                    chkBox,
                                    data.tproductqtylist[i].PARTSID || "",
                                    data.tproductqtylist[i].ProductName || "",
                                    data.tproductqtylist[i].SalesDescription || "",
                                    data.tproductqtylist[i].BARCODE || "",
                                    costprice,
                                    sellprice,
                                    data.tproductqtylist[i].InstockQty,
                                    data.tproductqtylist[i].PurchaseTaxcode || "",
                                    data.tproductqtylist[i].PRODUCTCODE || "",
                                    data.tproductqtylist[i].Ex_Works || null,
                                    linestatus
                                ];
                            } else {
                                dataList = [
                                    chkBox,
                                    data.tproductqtylist[i].PARTSID || "",
                                    data.tproductqtylist[i].ProductName || "",
                                    data.tproductqtylist[i].SalesDescription || "",
                                    data.tproductqtylist[i].BARCODE || "",
                                    costprice,
                                    sellprice,
                                    data.tproductqtylist[i].InstockQty,
                                    data.tproductqtylist[i].PurchaseTaxcode || "",
                                    data.tproductqtylist[i].PRODUCTCODE || "",
                                    data.tproductqtylist[i].Ex_Works || null,
                                    linestatus
                                ];
                            }

                            if (currentLoc == "/stockadjustmentcard") {
                                if (data.tproductqtylist[i].PRODUCTGROUP == "INV") {
                                    splashArrayProductList.push(dataList);
                                }
                            } else {
                                splashArrayProductList.push(dataList);
                            }
                        }

                    });
            });
    };

    //tempObj.getAllProducts();

    function onScanSuccessProdModal(decodedText, decodedResult) {
        var barcodeScannerProdModal = decodedText.toUpperCase();
        $("#scanBarcodeModalProduct").modal("toggle");
        if (barcodeScannerProdModal != "") {
            setTimeout(function() {
                $("#tblInventoryCheckbox_filter .form-control-sm").val(barcodeScannerProdModal);
                $("#tblInventoryCheckbox_filter .form-control-sm").trigger("input");
            }, 200);
        }
    }

    var html5QrcodeScannerProdModal = new Html5QrcodeScanner(
        "qr-reader-productmodal", {
            fps: 10,
            qrbox: 250,
            rememberLastUsedCamera: true,
        }
    );
    html5QrcodeScannerProdModal.render(onScanSuccessProdModal);


    // Set Focus
    // Event Listener for Modal Shown
    $( "#productListModal1" ).on('shown.bs.modal', function(){
        setTimeout(function() {
            $('#tblInventoryCheckbox_filter .form-control-sm').get(0).focus();
        }, 500);
    });
});

Template.productlistpopwithcheckboxes.events({
    "keyup #tblInventoryCheckbox_filter input": function(event) {
        if (event.keyCode == 13) {
            $(".btnRefreshProduct").trigger("click");
        }
    },
    "click .btnRefreshProduct": function(event) {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let productService = new ProductService();
        var currentLoc = FlowRouter.current().route.path;
        //let salesService = new SalesBoardService();
        let tableProductList;
        var splashArrayProductList = new Array();
        var splashArrayTaxRateList = new Array();
        const taxCodesList = [];
        const lineExtaSellItems = [];
        $(".fullScreenSpin").css("display", "inline-block");
        let dataSearchName = $("#tblInventoryCheckbox_filter input").val();
        if (dataSearchName.replace(/\s/g, "") != "") {
            sideBarService
                .getNewProductListVS1ByName(dataSearchName)
                .then(function(data) {
                    let records = [];

                    let inventoryData = [];
                    if (data.tproductqtylist.length > 0) {
                        for (let i = 0; i < data.tproductqtylist.length; i++) {
                            var dataList = "";
                            chkBox = '<div class="custom-control custom-switch chkBox pointer" style="width:15px;"><input name="pointer" class="custom-control-input chkBox pointer" type="checkbox" id="formCheck-' + data.tproductqtylist[i].PARTSID + "x" + data.tproductqtylist[i].PARTNAM +
                            '"><label class="custom-control-label chkBox pointer" for="formCheck-' + data.tproductqtylist[i].PARTSID +
                            "x" + data.tproductqtylist[i].PARTNAM +
                            '"></label></div>'; //switchbox

                            costprice = utilityService.modifynegativeCurrencyFormat(
                                Math.floor(data.tproductqtylist[i].BuyQTY1 * 100) / 100); //Cost Price
                            sellprice = utilityService.modifynegativeCurrencyFormat(
                                Math.floor(data.tproductqtylist[i].SellQTY1 * 100) / 100); //Sell Price
                            if (currentLoc == "/purchaseordercard") {
                                dataList = [
                                    '<div class="custom-control custom-switch chkBox pointer" style="width:15px;"><input name="appointment-products-checks" class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="productCheck-' +
                                    data.tproductqtylist[i].PARTSID +
                                    '"><label class="custom-control-label chkBox pointer" for="productCheck-' +
                                    data.tproductqtylist[i].PARTSID +
                                    '"></label></div>',
                                    data.tproductqtylist[i].PARTSID || "",
                                    data.tproductqtylist[i].ProductName || "",
                                    data.tproductqtylist[i].SalesDescription || "",
                                    data.tproductqtylist[i].BARCODE || "",
                                    costprice,
                                    sellprice,
                                    data.tproductqtylist[i].InstockQty,
                                    data.tproductqtylist[i].PurchaseTaxcode || "",
                                    data.tproductqtylist[i].PRODUCTCODE || "",
                                    data.tproductqtylist[i].Ex_Works || null,
                                    linestatus
                                ];
                            } else {
                                dataList = [
                                    '<div class="custom-control custom-switch chkBox pointer" style="width:15px;"><input name="appointment-products-checks" class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="productCheck-' +
                                    data.tproductqtylist[i].PARTSID +
                                    '"><label class="custom-control-label chkBox pointer" for="productCheck-' +
                                    data.tproductqtylist[i].PARTSID +
                                    '"></label></div>',
                                    data.tproductqtylist[i].PARTSID || "",
                                    data.tproductqtylist[i].ProductName || "",
                                    data.tproductqtylist[i].SalesDescription || "",
                                    data.tproductqtylist[i].BARCODE || "",
                                    costprice,
                                    sellprice,
                                    data.tproductqtylist[i].InstockQty,
                                    data.tproductqtylist[i].PurchaseTaxcode || "",
                                    data.tproductqtylist[i].PRODUCTCODE || "",
                                    data.tproductqtylist[i].Ex_Works || null,
                                    linestatus
                                ];
                            }

                            if (data.tproductqtylist[i].ExtraSellPrice != null) {
                                for (
                                    let e = 0; e < data.tproductqtylist[i].ExtraSellPrice.length; e++
                                ) {
                                    let lineExtaSellObj = {
                                        clienttype: data.tproductqtylist[i].ExtraSellPrice[e].ClientTypeName || "",
                                        productname: data.tproductqtylist[i].ExtraSellPrice[e].ProductName || data.tproductqtylist[i].ProductName,
                                        price: utilityService.modifynegativeCurrencyFormat(data.tproductqtylist[i].ExtraSellPrice[e].Price1) || 0,
                                    };
                                    lineExtaSellItems.push(lineExtaSellObj);
                                }
                            }
                            if (currentLoc == "/stockadjustmentcard") {
                                if (data.tproductqtylist[i].PRODUCTGROUP == "INV") {
                                    splashArrayProductList.push(dataList);
                                }
                            } else {
                                splashArrayProductList.push(dataList);
                            }
                        }
                        //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
                        $(".fullScreenSpin").css("display", "none");
                        if (splashArrayProductList) {
                            var datatable = $("#tblInventoryCheckbox").DataTable();
                            datatable.clear();
                            datatable.rows.add(splashArrayProductList);
                            datatable.draw(false);
                        }
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                        $("#productListModal").modal("toggle");
                        swal({
                            title: "Question",
                            text: "Product does not exist, would you like to create it?",
                            type: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes",
                            cancelButtonText: "No",
                        }).then((result) => {
                            if (result.value) {
                                $("#newProductModal").modal("toggle");
                                $("#edtproductname").val(dataSearchName);
                            } else if (result.dismiss === "cancel") {
                                $("#productListModal").modal("toggle");
                            }
                        });
                    }
                })
                .catch(function(err) {
                    $(".fullScreenSpin").css("display", "none");
                });
        } else {
            sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function(data) { addVS1Data("TProductQtyList", JSON.stringify(data));
                    let records = [];
                    let inventoryData = [];
                    let chkBox;
                    let costprice = 0.00;
                    let sellrate = 0.00;
                    let linestatus = '';
                    if(data.Params.Search.replace(/\s/g, "") == ""){
                      deleteFilter = true;
                    }else{
                      deleteFilter = false;
                    };

                    for (let i = 0; i < data.tproductqtylist.length; i++) {
                        var dataList = "";
                        if (data.tproductqtylist[i].Active == true) {
                            linestatus = "";
                        } else if (data.tproductqtylist[i].Active == false) {
                            linestatus = "In-Active";
                        };
                        chkBox = '<div class="custom-control custom-switch chkBox pointer" style="width:15px;"><input name="pointer" class="custom-control-input chkBox pointer" type="checkbox" id="formCheck-' + data.tproductqtylist[i].PARTSID + "x" + data.tproductqtylist[i].PARTNAM +
                        '"><label class="custom-control-label chkBox pointer" for="formCheck-' + data.tproductqtylist[i].PARTSID +
                        "x" + data.tproductqtylist[i].PARTNAM +
                        '"></label></div>'; //switchbox

                        costprice = utilityService.modifynegativeCurrencyFormat(
                            Math.floor(data.tproductqtylist[i].BuyQTY1 * 100) / 100); //Cost Price
                        sellprice = utilityService.modifynegativeCurrencyFormat(
                            Math.floor(data.tproductqtylist[i].SellQTY1 * 100) / 100); //Sell Price
                        if (currentLoc == "/purchaseordercard") {
                            dataList = [
                                chkBox,
                                data.tproductqtylist[i].PARTSID || "",
                                data.tproductqtylist[i].ProductName || "",
                                data.tproductqtylist[i].SalesDescription || "",
                                data.tproductqtylist[i].BARCODE || "",
                                costprice,
                                sellprice,
                                data.tproductqtylist[i].InstockQty,
                                data.tproductqtylist[i].PurchaseTaxcode || "",
                                data.tproductqtylist[i].PRODUCTCODE || "",
                                data.tproductqtylist[i].Ex_Works || null,
                                linestatus
                            ];
                        } else {
                            dataList = [
                                chkBox,
                                data.tproductqtylist[i].PARTSID || "",
                                data.tproductqtylist[i].ProductName || "",
                                data.tproductqtylist[i].SalesDescription || "",
                                data.tproductqtylist[i].BARCODE || "",
                                costprice,
                                sellprice,
                                data.tproductqtylist[i].InstockQty,
                                data.tproductqtylist[i].PurchaseTaxcode || "",
                                data.tproductqtylist[i].PRODUCTCODE || "",
                                data.tproductqtylist[i].Ex_Works || null,
                                linestatus
                            ];
                        }
                        if (data.tproductqtylist[i].ExtraSellPrice != null) {
                            for (
                                let e = 0; e < data.tproductqtylist[i].ExtraSellPrice.length; e++
                            ) {
                                let lineExtaSellObj = {
                                    clienttype: data.tproductqtylist[i].ExtraSellPrice[e].ClientTypeName || "",
                                    productname: data.tproductqtylist[i].ExtraSellPrice[e].ProductName || data.tproductqtylist[i].ProductName,
                                    price: utilityService.modifynegativeCurrencyFormat(data.tproductqtylist[i].ExtraSellPrice[e].Price1) || 0,
                                };
                                lineExtaSellItems.push(lineExtaSellObj);
                            }
                        }
                        if (currentLoc == "/stockadjustmentcard") {
                            if (data.tproductqtylist[i].PRODUCTGROUP == "INV") {
                                splashArrayProductList.push(dataList);
                            }
                        } else {
                            splashArrayProductList.push(dataList);
                        }
                    }
                    //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
                    $(".fullScreenSpin").css("display", "none");
                    if (splashArrayProductList) {
                        var datatable = $("#tblInventoryCheckbox").DataTable();
                        datatable.clear();
                        datatable.rows.add(splashArrayProductList);
                        datatable.draw(false);
                    }
                })
                .catch(function(err) {
                    $(".fullScreenSpin").css("display", "none");
                });
        }
    },
    "click #productListModal #refreshpagelist": function() {
        $(".fullScreenSpin").css("display", "inline-block");
        localStorage.setItem("VS1SalesProductList", "");
        let templateObject = Template.instance();
        Meteor._reload.reload();
        templateObject.getAllProducts();
    },
    "click .scanProdBarcodePOP": function(event) {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            $("#scanBarcodeModalProduct").modal("toggle");
        } else {
            Bert.alert(
                "<strong>Please Note:</strong> This function is only available on mobile devices!",
                "now-dangerorange"
            );
        }
    },
    "click .btnCloseProdModal": function(event) {
        $("#scanBarcodeModalProduct").modal("toggle");
    },
});
