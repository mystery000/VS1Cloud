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
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import "./productlistpop.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.productlistpop.onCreated(() => {
  const templateObject = Template.instance();
  // templateObject.records = new ReactiveVar();
  // templateObject.CleintName = new ReactiveVar();
  // templateObject.Department = new ReactiveVar();
  // templateObject.Date = new ReactiveVar();
  // templateObject.DueDate = new ReactiveVar();
  // templateObject.InvoiceNo = new ReactiveVar();
  // templateObject.RefNo = new ReactiveVar();
  // templateObject.Branding = new ReactiveVar();
  // templateObject.Currency = new ReactiveVar();
  // templateObject.Total = new ReactiveVar();
  // templateObject.Subtotal = new ReactiveVar();
  // templateObject.TotalTax = new ReactiveVar();
  // templateObject.invoicerecord = new ReactiveVar({});
  // templateObject.taxrateobj = new ReactiveVar();
  // templateObject.Accounts = new ReactiveVar([]);
  // templateObject.InvoiceId = new ReactiveVar();
  // templateObject.selectedCurrency = new ReactiveVar([]);
  // templateObject.inputSelectedCurrency = new ReactiveVar([]);
  // templateObject.currencySymbol = new ReactiveVar([]);
  // templateObject.deptrecords = new ReactiveVar();
  // templateObject.termrecords = new ReactiveVar();
  // templateObject.clientrecords = new ReactiveVar([]);
  // templateObject.taxraterecords = new ReactiveVar([]);
  // templateObject.record = new ReactiveVar({});
  // templateObject.accountID = new ReactiveVar();
  // templateObject.stripe_fee_method = new ReactiveVar()
  // /* Attachments */
  // templateObject.uploadedFile = new ReactiveVar();
  // templateObject.uploadedFiles = new ReactiveVar([]);
  // templateObject.attachmentCount = new ReactiveVar();

  // templateObject.address = new ReactiveVar();
  // templateObject.abn = new ReactiveVar();
  // templateObject.referenceNumber = new ReactiveVar();
  // templateObject.statusrecords = new ReactiveVar([]);

  // templateObject.includeBOnShippedQty = new ReactiveVar();
  // templateObject.includeBOnShippedQty.set(true);
  // templateObject.productextrasellrecords = new ReactiveVar([]);
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.custfields = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);

  templateObject.getDataTableList = function (data) {
    var currentLoc = FlowRouter.current().route.path;
    let linestatus = '';
    if(!data.fields) data.fields = data;
    if(data.fields.Active == true){
      linestatus = "";
    }
    else if(data.fields.Active == false){
      linestatus = "In-Active";
    }
    if (currentLoc == "/purchaseordercard") {
      dataList = [
        data.fields.ProductName || "-",
        data.fields.SalesDescription || "",
        data.fields.BARCODE || "",
        utilityService.modifynegativeCurrencyFormat(          Math.floor(data.fields.BuyQty1Cost * 100) / 100        ),
        utilityService.modifynegativeCurrencyFormat(          Math.floor(data.fields.SellQty1Price * 100) / 100        ),
        data.fields.TotalQtyInStock,
        data.fields.TaxCodePurchase || "",
        data.fields.ID || "",
        JSON.stringify(data.fields.ExtraSellPrice) || null,
        linestatus
      ];
    } else {
      dataList = [
        data.fields.ProductName || "-",
        data.fields.SalesDescription || "",
        data.fields.BARCODE || "",
        utilityService.modifynegativeCurrencyFormat(          Math.floor(data.fields.BuyQty1Cost * 100) / 100        ),
        utilityService.modifynegativeCurrencyFormat(          Math.floor(data.fields.SellQty1Price * 100) / 100        ),
        data.fields.TotalQtyInStock,
        data.fields.TaxCodeSales || "",
        data.fields.ID || "",
        JSON.stringify(data.fields.ExtraSellPrice) || null,
        linestatus
      ];
    }

      if (currentLoc == "/stockadjustmentcard") {
        if (data.fields.ProductType == "INV") {
          return dataList;
        } else {
          return [];
        }
      } else {
        return dataList;
      }
    } else {
      if(data.Active == true){
        linestatus = "";
      }
      else if(data.Active == false){
        linestatus = "In-Active";
      }
      if (currentLoc == "/purchaseordercard") {
        dataList = [
          data.ProductName || "-",
          data.SalesDescription || "",
          data.BARCODE || "",
          utilityService.modifynegativeCurrencyFormat(          Math.floor(data.BuyQty1Cost * 100) / 100        ),
          utilityService.modifynegativeCurrencyFormat(          Math.floor(data.SellQty1Price * 100) / 100        ),
          data.TotalQtyInStock,
          data.TaxCodePurchase || "",
          data.ID || "",
          JSON.stringify(data.ExtraSellPrice) || null,
          linestatus
        ];
      } else {
        dataList = [
          data.ProductName || "-",
          data.SalesDescription || "",
          data.BARCODE || "",
          utilityService.modifynegativeCurrencyFormat(          Math.floor(data.BuyQty1Cost * 100) / 100        ),
          utilityService.modifynegativeCurrencyFormat(          Math.floor(data.SellQty1Price * 100) / 100        ),
          data.TotalQtyInStock,
          data.TaxCodeSales || "",
          data.ID || "",
          JSON.stringify(data.ExtraSellPrice) || null,
          linestatus
        ];
      }

      if (currentLoc == "/stockadjustmentcard") {
        if (data.ProductType == "INV") {
          return dataList;
        } else {
          return [];
        }
      } else {
        return dataList;
      }
    }

  };

  templateObject.getExData = function (data) {
    var currentLoc = FlowRouter.current().route.path;
    let linestatus = '';
    if(data.fields.Active == true){
      linestatus = "";
    }
    else if(data.fields.Active == false){
      linestatus = "In-Active";
    }
    if (currentLoc == "/purchaseordercard") {
      dataList = [
        data.fields.ProductName || "-",
        data.fields.SalesDescription || "",
        data.fields.BARCODE || "",
        utilityService.modifynegativeCurrencyFormat(          Math.floor(data.fields.BuyQty1Cost * 100) / 100        ),
        utilityService.modifynegativeCurrencyFormat(          Math.floor(data.fields.SellQty1Price * 100) / 100        ),
        data.fields.TotalQtyInStock,
        data.fields.TaxCodePurchase || "",
        data.fields.ID || "",
        JSON.stringify(data.fields.ExtraSellPrice) || null,
        linestatus,
      ];
    } else {
      dataList = [
        data.fields.ProductName || "-",
        data.fields.SalesDescription || "",
        data.fields.BARCODE || "",
        utilityService.modifynegativeCurrencyFormat(          Math.floor(data.fields.BuyQty1Cost * 100) / 100        ),
        utilityService.modifynegativeCurrencyFormat(          Math.floor(data.fields.SellQty1Price * 100) / 100        ),
        data.fields.TotalQtyInStock,
        data.fields.TaxCodeSales || "",
        data.fields.ID || "",
        JSON.stringify(data.fields.ExtraSellPrice) || null,
        linestatus,
      ];
    }

    if (currentLoc == "/stockadjustmentcard") {
      if (data.fields.ProductType == "INV") {
        return dataList;
      }
    } else {
      return dataList;
    }
  };

  let headerStructure = [
    // { index: 0, label: '#Sort Date', class:'colSortDate', active: false, display: true, width: "20" },
    {
      index: 0,
      label: "Product Name",
      class: "colproductName",
      active: true,
      display: true,
      width: "150",
    },
    {
      index: 1,
      label: "Sales Description",
      class: "colproductDesc",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 2,
      label: "Barcoder",
      class: "colcolBarcode",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 3,
      label: "Cost Price",
      class: "colcostPrice text-right",
      active: true,
      display: true,
      width: "80",
    },
    {
      index: 4,
      label: "Sale Price",
      class: "colsalePrice text-right",
      active: true,
      display: true,
      width: "80",
    },
    {
      index: 5,
      label: "Quantity",
      class: "colprdqty text-right",
      active: true,
      display: true,
      width: "80",
    },
    {
      index: 6,
      label: "Tax Rate",
      class: "coltaxrate",
      active: true,
      display: true,
      width: "80",
    },
    {
      index: 7,
      label: "POP ID",
      class: "colProuctPOPID",
      active: false,
      display: true,
      width: "100",
    },
    {
      index: 8,
      label: "ExSellPrice",
      class: "colExtraSellPrice",
      active: false,
      display: true,
      width: "100",
    },
    {
        index: 9,
        label: "Status",
        class: "colStatus",
        active: true,
        display: true,
        width: "120",
      },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.productlistpop.onRendered(function () {
  let tempObj = Template.instance();
  let utilityService = new UtilityService();
  var splashArrayProductList = new Array();
  var splashArrayTaxRateList = new Array();
  const taxCodesList = [];
  const lineExtaSellItems = [];
  var currentLoc = FlowRouter.current().route.path;
  //   tempObj.getAllProducts = function () {
  //     getVS1Data("TProductVS1")
  //       .then(function (dataObject) {
  //         if (dataObject.length == 0) {
  //           sideBarService
  //             .getNewProductListVS1(initialBaseDataLoad, 0)
  //             .then(function (data) {
  //               addVS1Data("TProductVS1", JSON.stringify(data));
  //               let records = [];
  //               let inventoryData = [];
  //               for (let i = 0; i < data.tproductvs1.length; i++) {
  //                 if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
  //                   for (
  //                     let e = 0;
  //                     e < data.tproductvs1[i].fields.ExtraSellPrice.length;
  //                     e++
  //                   ) {
  //                     let lineExtaSellObj = {
  //                       clienttype:
  //                         data.tproductvs1[i].fields.ExtraSellPrice[e].fields
  //                           .ClientTypeName || "",
  //                       productname:
  //                         data.tproductvs1[i].fields.ExtraSellPrice[e].fields
  //                           .ProductName ||
  //                         data.tproductvs1[i].fields.ProductName,
  //                       price:
  //                         utilityService.modifynegativeCurrencyFormat(
  //                           data.tproductvs1[i].fields.ExtraSellPrice[e].fields
  //                             .Price1
  //                         ) || 0,
  //                       qtypercent: data.tproductvs1[i].fields.QtyPercent1 || 0,
  //                     };
  //                     lineExtaSellItems.push(lineExtaSellObj);
  //                   }
  //                 }
  //                 var dataList = "";
  //                 if (currentLoc == "/purchaseordercard") {
  //                   dataList = [
  //                     data.tproductvs1[i].fields.ProductName || "-",
  //                     data.tproductvs1[i].fields.SalesDescription || "",
  //                     data.tproductvs1[i].fields.BARCODE || "",
  //                     utilityService.modifynegativeCurrencyFormat(
  //                       Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) /
  //                         100
  //                     ),
  //                     utilityService.modifynegativeCurrencyFormat(
  //                       Math.floor(
  //                         data.tproductvs1[i].fields.SellQty1Price * 100
  //                       ) / 100
  //                     ),
  //                     data.tproductvs1[i].fields.TotalQtyInStock,
  //                     data.tproductvs1[i].fields.TaxCodePurchase || "",
  //                     data.tproductvs1[i].fields.ID || "",
  //                     JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
  //                       null,
  //                   ];
  //                 } else {
  //                   dataList = [
  //                     data.tproductvs1[i].fields.ProductName || "-",
  //                     data.tproductvs1[i].fields.SalesDescription || "",
  //                     data.tproductvs1[i].fields.BARCODE || "",
  //                     utilityService.modifynegativeCurrencyFormat(
  //                       Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) /
  //                         100
  //                     ),
  //                     utilityService.modifynegativeCurrencyFormat(
  //                       Math.floor(
  //                         data.tproductvs1[i].fields.SellQty1Price * 100
  //                       ) / 100
  //                     ),
  //                     data.tproductvs1[i].fields.TotalQtyInStock,
  //                     data.tproductvs1[i].fields.TaxCodeSales || "",
  //                     data.tproductvs1[i].fields.ID || "",
  //                     JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
  //                       null,
  //                   ];
  //                 }

  //                 if (currentLoc == "/stockadjustmentcard") {
  //                   if (data.tproductvs1[i].fields.ProductType == "INV") {
  //                     splashArrayProductList.push(dataList);
  //                   }
  //                 } else {
  //                   splashArrayProductList.push(dataList);
  //                 }
  //               }
  //               //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

  //               if (splashArrayProductList) {
  //                 $("#tblInventory").dataTable({
  //                   data: splashArrayProductList,
  //                   sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

  //                   columnDefs: [
  //                     {
  //                       className: "productName",
  //                       targets: [0],
  //                     },
  //                     {
  //                       className: "productDesc",
  //                       targets: [1],
  //                     },
  //                     {
  //                       className: "colBarcode",
  //                       targets: [2],
  //                     },
  //                     {
  //                       className: "costPrice text-right",
  //                       targets: [3],
  //                     },
  //                     {
  //                       className: "salePrice text-right",
  //                       targets: [4],
  //                     },
  //                     {
  //                       className: "prdqty text-right",
  //                       targets: [5],
  //                     },
  //                     {
  //                       className: "taxrate",
  //                       targets: [6],
  //                     },
  //                     {
  //                       className: "colProuctPOPID hiddenColumn",
  //                       targets: [7],
  //                     },
  //                     {
  //                       className: "colExtraSellPrice hiddenColumn",
  //                       targets: [8],
  //                     },
  //                   ],
  //                   select: true,
  //                   destroy: true,
  //                   colReorder: true,
  //                   lengthMenu: [
  //                     [initialBaseDataLoad, -1],
  //                     [initialBaseDataLoad, "All"],
  //                   ],
  //                   info: true,
  //                   responsive: true,
  //                   fnDrawCallback: function (oSettings) {
  //                     // $('.dataTables_paginate').css('display', 'none');
  //                   },
  //                   language: { search: "", searchPlaceholder: "Search List..." },
  //                   fnInitComplete: function () {
  //                     $(
  //                       "<a class='btn btn-primary scanProdBarcodePOP' href='' id='scanProdBarcodePOP' role='button' style='margin-left: 12px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>"
  //                     ).insertAfter("#tblInventory_filter");
  //                     $(
  //                       "<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
  //                     ).insertAfter("#tblInventory_filter");
  //                     $(
  //                       "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
  //                     ).insertAfter("#tblInventory_filter");
  //                   },
  //                 });

  //                 $("div.dataTables_filter input").addClass(
  //                   "form-control form-control-sm"
  //                 );
  //               }
  //             });
  //         } else {
  //           let data = JSON.parse(dataObject[0].data);
  //           let useData = data.tproductvs1;
  //           let records = [];
  //           let inventoryData = [];
  //           for (let i = 0; i < data.tproductvs1.length; i++) {
  //             if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
  //               for (
  //                 let e = 0;
  //                 e < data.tproductvs1[i].fields.ExtraSellPrice.length;
  //                 e++
  //               ) {
  //                 let lineExtaSellObj = {
  //                   clienttype:
  //                     data.tproductvs1[i].fields.ExtraSellPrice[e].fields
  //                       .ClientTypeName || "",
  //                   productname:
  //                     data.tproductvs1[i].fields.ExtraSellPrice[e].fields
  //                       .ProductName || data.tproductvs1[i].fields.ProductName,
  //                   price:
  //                     utilityService.modifynegativeCurrencyFormat(
  //                       data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1
  //                     ) || 0,
  //                   qtypercent: data.tproductvs1[i].fields.QtyPercent1 || 0,
  //                 };
  //                 lineExtaSellItems.push(lineExtaSellObj);
  //               }
  //             }

  //             var dataList = "";
  //             if (currentLoc == "/purchaseordercard") {
  //               dataList = [
  //                 data.tproductvs1[i].fields.ProductName || "-",
  //                 data.tproductvs1[i].fields.SalesDescription || "",
  //                 data.tproductvs1[i].fields.BARCODE || "",
  //                 utilityService.modifynegativeCurrencyFormat(
  //                   Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100
  //                 ),
  //                 utilityService.modifynegativeCurrencyFormat(
  //                   Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) /
  //                     100
  //                 ),
  //                 data.tproductvs1[i].fields.TotalQtyInStock,
  //                 data.tproductvs1[i].fields.TaxCodePurchase || "",
  //                 data.tproductvs1[i].fields.ID || "",
  //                 JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
  //                   null,
  //               ];
  //             } else {
  //               dataList = [
  //                 data.tproductvs1[i].fields.ProductName || "-",
  //                 data.tproductvs1[i].fields.SalesDescription || "",
  //                 data.tproductvs1[i].fields.BARCODE || "",
  //                 utilityService.modifynegativeCurrencyFormat(
  //                   Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100
  //                 ),
  //                 utilityService.modifynegativeCurrencyFormat(
  //                   Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) /
  //                     100
  //                 ),
  //                 data.tproductvs1[i].fields.TotalQtyInStock,
  //                 data.tproductvs1[i].fields.TaxCodeSales || "",
  //                 data.tproductvs1[i].fields.ID || "",
  //                 JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
  //                   null,
  //               ];
  //             }

  //             // splashArrayProductList.push(dataList);
  //             if (currentLoc == "/stockadjustmentcard") {
  //               if (data.tproductvs1[i].fields.ProductType == "INV") {
  //                 splashArrayProductList.push(dataList);
  //               }
  //             } else {
  //               splashArrayProductList.push(dataList);
  //             }
  //           }

  //           tempObj.productextrasellrecords.set(lineExtaSellItems);
  //           //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

  //           if (splashArrayProductList) {
  //             $("#tblInventory")
  //               .dataTable({
  //                 data: splashArrayProductList,

  //                 sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

  //                 columnDefs: [
  //                   {
  //                     className: "productName",
  //                     targets: [0],
  //                   },
  //                   {
  //                     className: "productDesc",
  //                     targets: [1],
  //                   },
  //                   {
  //                     className: "colBarcode",
  //                     targets: [2],
  //                   },
  //                   {
  //                     className: "costPrice text-right",
  //                     targets: [3],
  //                   },
  //                   {
  //                     className: "salePrice text-right",
  //                     targets: [4],
  //                   },
  //                   {
  //                     className: "prdqty text-right",
  //                     targets: [5],
  //                   },
  //                   {
  //                     className: "taxrate",
  //                     targets: [6],
  //                   },
  //                   {
  //                     className: "colProuctPOPID hiddenColumn",
  //                     targets: [7],
  //                   },
  //                   {
  //                     className: "colExtraSellPrice hiddenColumn",
  //                     targets: [8],
  //                   },
  //                 ],
  //                 select: true,
  //                 destroy: true,
  //                 colReorder: true,
  //                 pageLength: initialDatatableLoad,
  //                 lengthMenu: [
  //                   [initialDatatableLoad, -1],
  //                   [initialDatatableLoad, "All"],
  //                 ],
  //                 info: true,
  //                 responsive: true,
  //                 fnDrawCallback: function (oSettings) {
  //                   $(".paginate_button.page-item").removeClass("disabled");
  //                   $("#tblInventory_ellipsis").addClass("disabled");
  //                   if (oSettings._iDisplayLength == -1) {
  //                     if (oSettings.fnRecordsDisplay() > 150) {
  //                     }
  //                   } else {
  //                   }
  //                   if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
  //                     $(".paginate_button.page-item.next").addClass("disabled");
  //                   }

  //                   $(
  //                     ".paginate_button.next:not(.disabled)",
  //                     this.api().table().container()
  //                   ).on("click", function () {
  //                     $(".fullScreenSpin").css("display", "inline-block");
  //                     let dataLenght = oSettings._iDisplayLength;
  //                     let customerSearch = $("#tblInventory_filter input").val();

  //                     sideBarService
  //                       .getNewProductListVS1(
  //                         initialDatatableLoad,
  //                         oSettings.fnRecordsDisplay()
  //                       )
  //                       .then(function (dataObjectnew) {
  //                         for (
  //                           let i = 0;
  //                           i < dataObjectnew.tproductvs1.length;
  //                           i++
  //                         ) {
  //                           var dataListDupp = "";

  //                           if (currentLoc == "/purchaseordercard") {
  //                             dataListDupp = [
  //                               data.tproductvs1[i].fields.ProductName || "-",
  //                               data.tproductvs1[i].fields.SalesDescription || "",
  //                               data.tproductvs1[i].fields.BARCODE || "",
  //                               utilityService.modifynegativeCurrencyFormat(
  //                                 Math.floor(
  //                                   data.tproductvs1[i].fields.BuyQty1Cost * 100
  //                                 ) / 100
  //                               ),
  //                               utilityService.modifynegativeCurrencyFormat(
  //                                 Math.floor(
  //                                   data.tproductvs1[i].fields.SellQty1Price * 100
  //                                 ) / 100
  //                               ),
  //                               data.tproductvs1[i].fields.TotalQtyInStock,
  //                               data.tproductvs1[i].fields.TaxCodePurchase || "",
  //                               data.tproductvs1[i].fields.ID || "",
  //                               JSON.stringify(
  //                                 data.tproductvs1[i].fields.ExtraSellPrice
  //                               ) || null,
  //                             ];
  //                           } else {
  //                             dataListDupp = [
  //                               data.tproductvs1[i].fields.ProductName || "-",
  //                               data.tproductvs1[i].fields.SalesDescription || "",
  //                               data.tproductvs1[i].fields.BARCODE || "",
  //                               utilityService.modifynegativeCurrencyFormat(
  //                                 Math.floor(
  //                                   data.tproductvs1[i].fields.BuyQty1Cost * 100
  //                                 ) / 100
  //                               ),
  //                               utilityService.modifynegativeCurrencyFormat(
  //                                 Math.floor(
  //                                   data.tproductvs1[i].fields.SellQty1Price * 100
  //                                 ) / 100
  //                               ),
  //                               data.tproductvs1[i].fields.TotalQtyInStock,
  //                               data.tproductvs1[i].fields.TaxCodeSales || "",
  //                               data.tproductvs1[i].fields.ID || "",
  //                               JSON.stringify(
  //                                 data.tproductvs1[i].fields.ExtraSellPrice
  //                               ) || null,
  //                             ];
  //                           }

  //                           if (currentLoc == "/stockadjustmentcard") {
  //                             if (
  //                               data.tproductvs1[i].fields.ProductType == "INV"
  //                             ) {
  //                               splashArrayProductList.push(dataListDupp);
  //                             }
  //                           } else {
  //                             splashArrayProductList.push(dataListDupp);
  //                           }
  //                         }

  //                         let uniqueChars = [...new Set(splashArrayProductList)];
  //                         // var datatable = $('#tblInventory').DataTable();
  //                         // datatable.clear();
  //                         // datatable.rows.add(uniqueChars);
  //                         // datatable.draw(false);
  //                         // setTimeout(function () {
  //                         //   $("#tblInventory").dataTable().fnPageChange('last');
  //                         // }, 400);

  //                         $(".fullScreenSpin").css("display", "none");
  //                       })
  //                       .catch(function (err) {
  //                         $(".fullScreenSpin").css("display", "none");
  //                       });
  //                   });
  //                   // setTimeout(function () {
  //                   //     MakeNegative();
  //                   // }, 100);
  //                 },
  //                 language: { search: "", searchPlaceholder: "Search List..." },
  //                 fnInitComplete: function () {
  //                   $(
  //                     "<a class='btn btn-primary scanProdBarcodePOP' href='' id='scanProdBarcodePOP' role='button' style='margin-left: 12px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>"
  //                   ).insertAfter("#tblInventory_filter");
  //                   $(
  //                     "<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
  //                   ).insertAfter("#tblInventory_filter");
  //                   $(
  //                     "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
  //                   ).insertAfter("#tblInventory_filter");
  //                 },
  //               })
  //               .on("length.dt", function (e, settings, len) {
  //                 $(".fullScreenSpin").css("display", "inline-block");
  //                 let dataLenght = settings._iDisplayLength;
  //                 // splashArrayProductList = [];
  //                 if (dataLenght == -1) {
  //                   $(".fullScreenSpin").css("display", "none");
  //                 } else {
  //                   if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
  //                     $(".fullScreenSpin").css("display", "none");
  //                   } else {
  //                     $(".fullScreenSpin").css("display", "none");
  //                   }
  //                 }
  //               });

  //             $("div.dataTables_filter input").addClass(
  //               "form-control form-control-sm"
  //             );
  //           }
  //         }
  //       })
  //       .catch(function (err) {
  //         sideBarService
  //           .getNewProductListVS1(initialBaseDataLoad, 0)
  //           .then(function (data) {
  //             addVS1Data("TProductVS1", JSON.stringify(data));
  //             let records = [];
  //             let inventoryData = [];
  //             for (let i = 0; i < data.tproductvs1.length; i++) {
  //               if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
  //                 for (
  //                   let e = 0;
  //                   e < data.tproductvs1[i].fields.ExtraSellPrice.length;
  //                   e++
  //                 ) {
  //                   let lineExtaSellObj = {
  //                     clienttype:
  //                       data.tproductvs1[i].fields.ExtraSellPrice[e].fields
  //                         .ClientTypeName || "",
  //                     productname:
  //                       data.tproductvs1[i].fields.ExtraSellPrice[e].fields
  //                         .ProductName || data.tproductvs1[i].fields.ProductName,
  //                     price:
  //                       utilityService.modifynegativeCurrencyFormat(
  //                         data.tproductvs1[i].fields.ExtraSellPrice[e].fields
  //                           .Price1
  //                       ) || 0,
  //                     qtypercent: data.tproductvs1[i].fields.QtyPercent1 || 0,
  //                   };
  //                   lineExtaSellItems.push(lineExtaSellObj);
  //                 }
  //               }
  //               var dataList = "";

  //               if (currentLoc == "/purchaseordercard") {
  //                 dataList = [
  //                   data.tproductvs1[i].fields.ProductName || "-",
  //                   data.tproductvs1[i].fields.SalesDescription || "",
  //                   data.tproductvs1[i].fields.BARCODE || "",
  //                   utilityService.modifynegativeCurrencyFormat(
  //                     Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) /
  //                       100
  //                   ),
  //                   utilityService.modifynegativeCurrencyFormat(
  //                     Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) /
  //                       100
  //                   ),
  //                   data.tproductvs1[i].fields.TotalQtyInStock,
  //                   data.tproductvs1[i].fields.TaxCodePurchase || "",
  //                   data.tproductvs1[i].fields.ID || "",
  //                   JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
  //                     null,
  //                 ];
  //               } else {
  //                 dataList = [
  //                   data.tproductvs1[i].fields.ProductName || "-",
  //                   data.tproductvs1[i].fields.SalesDescription || "",
  //                   data.tproductvs1[i].fields.BARCODE || "",
  //                   utilityService.modifynegativeCurrencyFormat(
  //                     Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) /
  //                       100
  //                   ),
  //                   utilityService.modifynegativeCurrencyFormat(
  //                     Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) /
  //                       100
  //                   ),
  //                   data.tproductvs1[i].fields.TotalQtyInStock,
  //                   data.tproductvs1[i].fields.TaxCodeSales || "",
  //                   data.tproductvs1[i].fields.ID || "",
  //                   JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
  //                     null,
  //                 ];
  //               }

  //               if (currentLoc == "/stockadjustmentcard") {
  //                 if (data.tproductvs1[i].fields.ProductType == "INV") {
  //                   splashArrayProductList.push(dataList);
  //                 }
  //               } else {
  //                 splashArrayProductList.push(dataList);
  //               }
  //             }
  //             //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

  //             if (splashArrayProductList) {
  //               $("#tblInventory").dataTable({
  //                 data: splashArrayProductList,
  //                 sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //                 columnDefs: [
  //                   {
  //                     className: "productName",
  //                     targets: [0],
  //                   },
  //                   {
  //                     className: "productDesc",
  //                     targets: [1],
  //                   },
  //                   {
  //                     className: "colBarcode",
  //                     targets: [2],
  //                   },
  //                   {
  //                     className: "costPrice text-right",
  //                     targets: [3],
  //                   },
  //                   {
  //                     className: "salePrice text-right",
  //                     targets: [4],
  //                   },
  //                   {
  //                     className: "prdqty text-right",
  //                     targets: [5],
  //                   },
  //                   {
  //                     className: "taxrate",
  //                     targets: [6],
  //                   },
  //                   {
  //                     className: "colProuctPOPID hiddenColumn",
  //                     targets: [7],
  //                   },
  //                   {
  //                     className: "colExtraSellPrice hiddenColumn",
  //                     targets: [8],
  //                   },
  //                 ],
  //                 select: true,
  //                 destroy: true,
  //                 colReorder: true,
  //                 lengthMenu: [
  //                   [initialBaseDataLoad, -1],
  //                   [initialBaseDataLoad, "All"],
  //                 ],
  //                 info: true,
  //                 responsive: true,
  //                 order: [[0, "asc"]],
  //                 fnDrawCallback: function (oSettings) {
  //                   // $('.dataTables_paginate').css('display', 'none');
  //                 },
  //                 language: { search: "", searchPlaceholder: "Search List..." },
  //                 fnInitComplete: function () {
  //                   $(
  //                     "<a class='btn btn-primary scanProdBarcodePOP' href='' id='scanProdBarcodePOP' role='button' style='margin-left: 12px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>"
  //                   ).insertAfter("#tblInventory_filter");
  //                   $(
  //                     "<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
  //                   ).insertAfter("#tblInventory_filter");
  //                   $(
  //                     "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
  //                   ).insertAfter("#tblInventory_filter");
  //                 },
  //               });

  //               $("div.dataTables_filter input").addClass(
  //                 "form-control form-control-sm"
  //               );
  //             }
  //           });
  //       });
  //   };

  //   tempObj.getAllProducts();

  function onScanSuccessProdModal(decodedText, decodedResult) {
    var barcodeScannerProdModal = decodedText.toUpperCase();
    $("#scanBarcodeModalProduct").modal("toggle");
    if (barcodeScannerProdModal != "") {
      setTimeout(function () {
        $("#tblInventory_filter .form-control-sm").val(barcodeScannerProdModal);
        $("#tblInventory_filter .form-control-sm").trigger("input");
      }, 200);
    }
  }

  var html5QrcodeScannerProdModal = new Html5QrcodeScanner(
    "qr-reader-productmodal",
    {
      fps: 10,
      qrbox: 250,
      rememberLastUsedCamera: true,
    }
  );
  html5QrcodeScannerProdModal.render(onScanSuccessProdModal);
});

Template.productlistpop.events({
  "keyup #tblInventory_filter input": function (event) {
    if (event.keyCode == 13) {
      $(".btnRefreshProduct").trigger("click");
    }
  },
  'click .btnNewProduct': function (){
        $('div#newProductModal').modal('show');
    },
  "click .btnRefreshProduct": function (event) {
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
    let dataSearchName = $("#tblInventory_filter input").val();
    if (dataSearchName.replace(/\s/g, "") != "") {
      sideBarService
        .getNewProductListVS1ByName(dataSearchName)
        .then(function (data) {
          let records = [];

          let inventoryData = [];
          if (data.tproductvs1.length > 0) {
            for (let i = 0; i < data.tproductvs1.length; i++) {
              var dataList = "";
              if (currentLoc == "/purchaseordercard") {
                dataList = [

                    data.tproductvs1[i].fields.ProductName || '-',
                    data.tproductvs1[i].fields.SalesDescription || '',
                    data.tproductvs1[i].fields.BARCODE || '',
                    utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                    utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                    data.tproductvs1[i].fields.TotalQtyInStock,
                    data.tproductvs1[i].fields.TaxCodePurchase || '',
                    data.tproductvs1[i].fields.ID || '',
                    JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                ];
               }else{
                 dataList = [

                     data.tproductvs1[i].fields.ProductName || '-',
                     data.tproductvs1[i].fields.SalesDescription || '',
                     data.tproductvs1[i].fields.BARCODE || '',
                     utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                     utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                     data.tproductvs1[i].fields.TotalQtyInStock,
                     data.tproductvs1[i].fields.TaxCodeSales || '',
                     data.tproductvs1[i].fields.ID || '',
                     JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,
                 ];
               }

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
              if (currentLoc == "/stockadjustmentcard") {
                if (data.tproductvs1[i].fields.ProductType == "INV") {
                  splashArrayProductList.push(dataList);
                }
              } else {
                splashArrayProductList.push(dataList);
              }
            }
            //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
            $(".fullScreenSpin").css("display", "none");
            if (splashArrayProductList) {
              var datatable = $("#tblInventory").DataTable();
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
        .catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
    } else {
      sideBarService
    sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
      addVS1Data('TProductVS1',JSON.stringify(data));
          let records = [];
          let inventoryData = [];
          for (let i = 0; i < data.tproductvs1.length; i++) {
            var dataList = "";

              if (currentLoc == "/purchaseordercard"){
                dataList = [

                    data.tproductvs1[i].fields.ProductName || '-',
                    data.tproductvs1[i].fields.SalesDescription || '',
                    data.tproductvs1[i].fields.BARCODE || '',
                    utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                    utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                    data.tproductvs1[i].fields.TotalQtyInStock,
                    data.tproductvs1[i].fields.TaxCodePurchase || '',
                    data.tproductvs1[i].fields.ID || '',
                    JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                ];
               }else{
                 dataList = [

                     data.tproductvs1[i].fields.ProductName || '-',
                     data.tproductvs1[i].fields.SalesDescription || '',
                     data.tproductvs1[i].fields.BARCODE || '',
                     utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                     utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                     data.tproductvs1[i].fields.TotalQtyInStock,
                     data.tproductvs1[i].fields.TaxCodeSales || '',
                     data.tproductvs1[i].fields.ID || '',
                     JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                 ];
               }
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
              if (currentLoc == "/stockadjustmentcard"){
                if (data.tproductvs1[i].fields.ProductType == "INV") {
                splashArrayProductList.push(dataList);
              }
            } else {
              splashArrayProductList.push(dataList);
            }
          }
          //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
          $(".fullScreenSpin").css("display", "none");
          if (splashArrayProductList) {
            // var datatable = $('#tblInventory').DataTable();
            // datatable.clear();
            // datatable.rows.add(splashArrayProductList);
            // datatable.draw(false);
          }
        })
        .catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
    }
  },
  "click #productListModal #refreshpagelist": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    localStorage.setItem("VS1SalesProductList", "");
    let templateObject = Template.instance();
    Meteor._reload.reload();
    templateObject.getAllProducts();
  },
  "click .scanProdServiceBarcodePOP": function (event) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      $("#scanBarcodeModalProduct").modal("toggle");
    } else {
      swal({
        title: "Please Note:",
        text: "This function is only available on mobile devices!",
        type: "warning",
      }).then((result) => {});
    }
  },
  "click .btnCloseProdModal": function (event) {
    $("#scanBarcodeModalProduct").modal("toggle");
  },
});

Template.productlistpop.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get();
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblInventory",
    });
  },
  // custom fields displaysettings
  custfields: () => {
    return Template.instance().custfields.get();
  },

  // custom fields displaysettings
  displayfields: () => {
    return Template.instance().displayfields.get();
  },

  convertedStatus: () => {
    return Template.instance().convertedStatus.get();
  },

  apiFunction: function () {
    // do not use arrow function
    return sideBarService.getNewProductListVS1;
  },

  searchAPI: function () {
    return sideBarService.getNewProductListVS1ByName;
  },

  apiParams: function () {
    return [
      "limitCount",
      "limitFrom",
      "deleteFilter",
    ];
  },

  service: () => {
    return sideBarService;
  },

  datahandler: function () {
    let templateObject = Template.instance();
    return function (data) {
      let dataReturn = templateObject.getDataTableList(data);
      return dataReturn;
    };
  },

  exDataHandler: function () {
    let templateObject = Template.instance();
    return function (data) {
      let dataReturn = templateObject.getExData(data);
      return dataReturn;
    };
  },
});
