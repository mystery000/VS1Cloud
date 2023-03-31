import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { DashBoardService } from "../Dashboard/dashboard-service";
import { UtilityService } from "../utility-service";
import {ProductService} from "../product/product-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { Random } from 'meteor/random';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import { autoTable } from 'jspdf-autotable';
import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './payrollproductlistpop.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.payrollproductlistpop.onCreated(() => {
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
    templateObject.stripe_fee_method = new ReactiveVar()
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
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.getDataTableList = function(data) {
      console.log('data ~~~~~~~~~~~~~~~~1', data);
        let dataList = [
            '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.fields.ID+'"></label></div>',
            data.ProductName || '-',  
            data.SalesDescription || '',
            data.BARCODE || '',
            utilityService.modifynegativeCurrencyFormat(Math.floor(data.BuyQty1Cost * 100) / 100),
            utilityService.modifynegativeCurrencyFormat(Math.floor(data.SellQty1Price * 100) / 100),
            data.TotalQtyInStock,
            data.TaxCodeSales || '',
            data.ID || '',
            JSON.stringify(data.ExtraSellPrice)||null,
            utilityService.modifynegativeCurrencyFormat(Math.floor(data.SellQty1PriceInc * 100) / 100)
        ];
        return dataList;
    }

    let headerStructure = [
        { index: 0, label: "", class: "colChkBox", active: false, display: true, width: "0" },
        { index: 1, label: "Product Name", class: "colProductName", active: true, display: true, width: "50" },
        { index: 2, label: "Sales Description", class: "colSalesDescription", active: true, display: true, width: "150" },
        { index: 3, label: "Barcode", class: "colBarcode", active: true, display: true, width: "70" },
        { index: 4, label: "Cost Price", class: "colCostPrice text-right", active: true, display: true, width: "100" },
        { index: 5, label: "Sales Price", class: "colSalesPrice text-right", active: true, display: true, width: "100" },
        { index: 6, label: "Quantity", class: "colQuantity text-right", active: true, display: true, width: "100" },
        { index: 7, label: "Tax Rate", class: "colTaxRate", active: true, display: true, width: "100" },
        { index: 8, label: "Product ID", class: "colProductPODID", active: false, display: true, width: "100" },
        { index: 9, label: "Extra Sell Price", class: "colExtraSellPrice", active: false, display: true, width: "100" },
        { index: 10, label: "Sale Price Inc", class: "colSalePriceInc", active: false, display: true, width: "100" },
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.payrollproductlistpop.onRendered(function () {
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    const lineExtaSellItems = [];
    var currentLoc = FlowRouter.current().route.path;
    
    function onScanSuccessProdModal(decodedText, decodedResult) {
        var barcodeScannerProdModal = decodedText.toUpperCase();
        $('#scanBarcodeModalProduct').modal('toggle');
        if (barcodeScannerProdModal != '') {
            setTimeout(function() {
              $('#tblInventoryPayrollService .form-control-sm').val(barcodeScannerProdModal);
              $('#tblInventoryPayrollService .form-control-sm').trigger("input");
            }, 200);


        }
    }


    var html5QrcodeScannerProdModal = new Html5QrcodeScanner(
        "qr-reader-productmodal", {
            fps: 10,
            qrbox: 250,
            rememberLastUsedCamera: true
        });
    html5QrcodeScannerProdModal.render(onScanSuccessProdModal);
    tableResize();
});

Template.payrollproductlistpop.events({
  'keyup #tblInventoryPayrollService_filter input': function (event) {
    if (event.keyCode == 13) {
       $(".btnRefreshProduct").trigger("click");
    }
  },
  'click .btnRefreshProduct':function(event){
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
    $('.fullScreenSpin').css('display', 'inline-block');
    let dataSearchName = $('#tblInventoryPayrollService_filter input').val();
    if(dataSearchName.replace(/\s/g, '') != ''){
    sideBarService.getProductServiceListVS1ByName(dataSearchName).then(function (data) {
        let records = [];

        let inventoryData = [];
        if(data.tproductvs1.length > 0){
        for (let i = 0; i < data.tproductvs1.length; i++) {
            var dataList = [
                '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                data.tproductvs1[i].fields.ProductName || '-',
                data.tproductvs1[i].fields.SalesDescription || '',
                data.tproductvs1[i].fields.BARCODE || '',
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                data.tproductvs1[i].fields.TotalQtyInStock,
                data.tproductvs1[i].fields.TaxCodeSales || '',
                data.tproductvs1[i].fields.ID || '',
                JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
            ];

            if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                    let lineExtaSellObj = {
                        clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                        productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                        price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                    };
                    lineExtaSellItems.push(lineExtaSellObj);

                }
            }

              splashArrayProductList.push(dataList);

        }
        //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
        $('.fullScreenSpin').css('display', 'none');
        if (splashArrayProductList) {
          var datatable = $('#tblInventoryPayrollService').DataTable();
          datatable.clear();
          datatable.rows.add(splashArrayProductList);
          datatable.draw(false);

        }
        }else{
          $('.fullScreenSpin').css('display', 'none');
          $('#productListModal').modal('toggle');
          swal({
          title: 'Question',
          text: "Product does not exist, would you like to create it?",
          type: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
          }).then((result) => {
          if (result.value) {
            $('#newProductModal').modal('toggle');
            $('#edtproductname').val(dataSearchName);
          } else if (result.dismiss === 'cancel') {
            $('#productListModal').modal('toggle');
          }
          });
        }
    }).catch(function (err) {
      $('.fullScreenSpin').css('display', 'none');
    });
  }else{
    sideBarService.getProductServiceListVS1(initialBaseDataLoad,0).then(function (data) {
          let records = [];
          let inventoryData = [];
          for (let i = 0; i < data.tproductvs1.length; i++) {
              var dataList = [
                  '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                  data.tproductvs1[i].fields.ProductName || '-',
                  data.tproductvs1[i].fields.SalesDescription || '',
                  data.tproductvs1[i].fields.BARCODE || '',
                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                  data.tproductvs1[i].fields.TotalQtyInStock,
                  data.tproductvs1[i].fields.TaxCodeSales || '',
                  data.tproductvs1[i].fields.ID || '',
                  JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
              ];

              if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                  for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                      let lineExtaSellObj = {
                          clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                          productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                          price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                      };
                      lineExtaSellItems.push(lineExtaSellObj);

                  }
              }

                splashArrayProductList.push(dataList);

          }
          //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
          $('.fullScreenSpin').css('display', 'none');
          if (splashArrayProductList) {
            var datatable = $('#tblInventoryPayrollService').DataTable();
            datatable.clear();
            datatable.rows.add(splashArrayProductList);
            datatable.draw(false);


          }
      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
      });
  }
  },
  
  'click .scanProdBarcodePOP': function(event) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#scanBarcodeModalProduct').modal('toggle');
      } else {
        swal({
            title: "Please Note:",
            text: 'This function is only available on mobile devices!',
            type: 'warning',
        }).then((result) => {

        });
      }
  },
  'click .btnCloseProdModal': function(event) {
      $('#scanBarcodeModalProduct').modal('toggle');
  }
});

Template.payrollproductlistpop.helpers({
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    apiFunction:function() { // do not use arrow function
        return sideBarService.getProductQTYServiceListVS1
    },

    apiParams: function() {
        return ['dateFrom', 'dateTo', 'ignoredate', 'limitCount', 'limitFrom', 'deleteFilter'];
    },

    service: ()=>{
        return sideBarService;
    },

    datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },
});
