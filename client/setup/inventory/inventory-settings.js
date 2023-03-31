// @ts-nocheck
import './inventory-settings.html'
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
import { SideBarService } from "../../js/sidebar-service";

const utilityService = new UtilityService();
const contactService = new ContactService();
const sideBarService = new SideBarService();


Template.wizard_inventory.onCreated(function () {

  this.inventoryList = new ReactiveVar([]);
  this.loadInventory = async (refresh = false) => {
    LoadingOverlay.show();
    let _inventoryList = [];
    let data = await sideBarService.getNewProductListVS1("All");

    await addVS1Data("TProductVS1", JSON.stringify(data));

    if (data.tproductvs1) {
      departmentData = "All";

      data.tproductvs1.forEach((product) => {
        let availableQty = 0;
        let onSOORDer = 0;

        if (product.fields.ProductClass != null) {
          for (let a = 0; a < product.fields.ProductClass.length; a++) {
            availableQty +=
              product.fields.ProductClass[a].fields.AvailableQuantity || 0;
          }
        }
        product.fields.AvailableQuantity = availableQty;
        product.fields.onBOOrder = product.fields.TotalQtyInStock - availableQty;
        product.fields.onSOOrder = onSOORDer;

        (product.fields.CostPrice = utilityService.modifynegativeCurrencyFormat(
          Math.floor(product.fields.BuyQty1Cost * 100) / 100
        )),
          (product.fields.CostPriceInc =
            utilityService.modifynegativeCurrencyFormat(
              Math.floor(product.fields.BuyQty1CostInc * 100) / 100
            )),
          (product.fields.SellPrice =
            utilityService.modifynegativeCurrencyFormat(
              Math.floor(product.fields.SellQty1Price * 100) / 100
            )),
          (product.fields.SellPriceInc =
            utilityService.modifynegativeCurrencyFormat(
              Math.floor(product.fields.SellQty1PriceInc * 100) / 100
            )),
          _inventoryList.push({ ...product.fields });
      });
    }

    this.inventoryList.set(_inventoryList);

    if (this.inventoryList.get()) {
      if ($.fn.dataTable.isDataTable("#InventoryTable")) {
        $("#InventoryTable").DataTable().destroy();
      }

      setTimeout(function () {
        $("#InventoryTable")
          .dataTable({
            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            select: true,
            destroy: true,
            colReorder: true,
            pageLength: 25,
            paging: true,
            info: true,
            responsive: true,
            "order": [1, 'asc'],
            action: function () {
              $("#InventoryTable").DataTable().ajax.reload();
            },
            language: { search: "", searchPlaceholder: "Search List..." },
            fnInitComplete: function () {
              $(
                "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
              ).insertAfter("#tblInventory_filter");
            },
          })
          .on("length.dt", function (e, settings, len) {
            $(".fullScreenSpin").css("display", "inline-block");
            let dataLenght = settings._iDisplayLength;
            if (dataLenght == -1) {
              LoadingOverlay.hide();
            } else {
              if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                LoadingOverlay.hide();
              } else {
                LoadingOverlay.hide();
              }
            }
          });

        LoadingOverlay.hide();
        $("div.dataTables_filter input").addClass(
          "form-control form-control-sm"
        );
      }, refreshTableTimout);
    }
  };

  let templateObject = Template.instance();
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.getDataTableList = function(data) {
      let availableQty = data.AvailableQty||0;
      let checkIfSerialorLot;
        if(data.SNTracking == true){
            checkIfSerialorLot = '<i class="fas fa-plus-square text-success btnSNTracking"  style="font-size: 22px;" ></i>';
        }else if(data.batch == true){
            checkIfSerialorLot = '<i class="fas fa-plus-square text-success btnBatch"  style="font-size: 22px;" ></i>';
        }else{
            checkIfSerialorLot = '<i class="fas fa-plus-square text-success btnNoBatchorSerial"  style="font-size: 22px;" ></i>';
        }

      let onBOOrder;
      onBOOrder = data.TotalQtyInStock - availableQty;
        var dataList = [
            data.PARTSID || "",
            data.ProductName || "-",
            data.SalesDescription || "",
            availableQty,
            data.AllocatedSO||0,
            data.AllocatedBO||0,
            data.InStock,
            data.OnOrder,
            utilityService.modifynegativeCurrencyFormat(Math.floor(data.CostExA * 100) / 100),
            utilityService.modifynegativeCurrencyFormat(Math.floor(data.CostIncA * 100) /100),
            utilityService.modifynegativeCurrencyFormat(Math.floor(data.PriceExA * 100) / 100),
            utilityService.modifynegativeCurrencyFormat(Math.floor(data.PriceIncA * 100) /100),
            checkIfSerialorLot||'',
            data.BARCODE || "",
            "ALl",
            data.PurchaseDescription || "",
            data.CUSTFLD1 || "",
            data.CUSTFLD2 || "",
            data.Active ? "" : "In-Active",
        ];
        return dataList;
    }
  let headerStructure = [
      { index: 0, label: "#ID", class: "ProductID", width: "10", active: false, display: true },
      { index: 1, label: "Product Name", class: "ProductName", width: "200", active: true, display: true },
      { index: 2, label: "Sales Description", class: "SalesDescription", width: "300", active: true, display: true },
      { index: 3, label: "Available", class: "Available", width: "110", active: true, display: true },
      { index: 4, label: "On SO", class: "OnSO", width: "110", active: true, display: true },
      { index: 5, label: "On BO", class: "OnBO", width: "110", active: true, display: true },
      { index: 6, label: "In Stock", class: "InStock", width: "110", active: true, display: true },
      { index: 7, label: "On Order", class: "OnOrder", width: "110", active: true, display: true },
      { index: 8, label: "Cost Price (Ex)", class: "CostPrice", width: "110", active: false, display: true },
      { index: 9, label: "Cost Price (Inc)", class: "CostPriceInc", width: "110", active: true, display: true },
      { index: 10, label: "Sale Price (Ex)", class: "SalePrice", width: "110", active: false, display: true },
      { index: 11, label: "Sale Price (Inc)", class: "SalePriceInc", width: "110", active: true, display: true },
      { index: 12, label: "Serial/Lot No", class: "SerialNo", width: "124", active: false, display: true },
      { index: 13, label: "Barcode", class: "Barcode", width: "200", active: false, display: true },
      { index: 14, label: "Department", class: "Department", width: "110", active: false, display: true },
      { index: 15, label: "Purchase Description", class: "PurchaseDescription", width: "300", active: false, display: true },
      { index: 16, label: "Custom Field 1", class: "ProdCustField1", width: "100", active: false, display: true },
      { index: 17, label: "Custom Field 2", class: "ProdCustField2", width: "100", active: false, display: true },
      { index: 18, label: "Status", class: "colStatus", width: "120", active: true, display: true },
    ];
  templateObject.tableheaderrecords.set(headerStructure);

});

Template.wizard_inventory.onRendered(() => [

]);

Template.wizard_inventory.helpers({
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    apiFunction:function() {
        let sideBarService = new SideBarService();
        return sideBarService.getProductListVS1;
    },

    searchAPI: function() {
        let sideBarService = new SideBarService();
        return sideBarService.getProductListVS1;
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
        return ['limitCount', 'limitFrom', 'deleteFilter'];
    },
});