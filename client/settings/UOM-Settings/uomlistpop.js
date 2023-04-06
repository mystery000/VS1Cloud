import {TaxRateService} from "../settings-service";
import {ReactiveVar} from 'meteor/reactive-var';
import {SideBarService} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

import { Template } from 'meteor/templating';
import './uomlistpop.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
Template.uomlistpop.inheritsHooksFrom('non_transactional_list');
Template.uomlistpop.onCreated(function() {
  const templateObject = Template.instance();

  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.getDataTableList = function(data) {
    let tdPurchaseDef = "";
    let linestatus = "";
    let tdCustomerDef = ""; //isSalesdefault
    let tdSupplierDef = ""; //isPurchasedefault
    let tdUseforAutoSplitQtyinSales = ""; //UseforAutoSplitQtyinSales
    if (data.Active == true) {
      linestatus = "";
    } else if (data.Active == false) {
      linestatus = "In-Active";
    }

    //Check if Sales defaultis checked
    if (data.SalesDefault == true) {
      tdSupplierDef =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtSalesDefault-' +
          data.UnitID +
          '" checked><label class="custom-control-label chkBox" for="swtSalesDefault-' +
          data.UnitID +
          '"></label></div>';
    } else {
      tdSupplierDef =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtSalesDefault-' +
          data.UnitID +
          '"><label class="custom-control-label chkBox" for="swtSalesDefault-' +
          data.UnitID +
          '"></label></div>';
    }
    //Check if Purchase default is checked
    if (data.PurchasesDefault == true) {
      tdPurchaseDef =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' +
          data.UnitID +
          '" checked><label class="custom-control-label chkBox" for="swtPurchaseDefault-' +
          data.UnitID +
          '"></label></div>';
    } else {
      tdPurchaseDef =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' +
          data.UnitID +
          '"><label class="custom-control-label chkBox" for="swtPurchaseDefault-' +
          data.UnitID +
          '"></label></div>';
    }

    //Check if UseforAutoSplitQtyinSales is checked
    if (data.UseforAutoSplitQtyinSales == true) {
      tdUseforAutoSplitQtyinSales =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' +
          data.UnitID +
          '" checked><label class="custom-control-label chkBox" for="swtPurchaseDefault-' +
          data.UnitID +
          '"></label></div>';
    } else {
      tdUseforAutoSplitQtyinSales =
          '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="swtPurchaseDefault-' +
          data.UnitID +
          '"><label class="custom-control-label chkBox" for="swtPurchaseDefault-' +
          data.UnitID +
          '"></label></div>';
    }

    var dataList = [
      data.UnitID || "",
      data.UOMName || data.UnitName || "",
      data.UnitDescription || "",
      data.UnitProductKeyName || "",
      data.BaseUnitName || "",
      data.BaseUnitID || "",
      data.PartID || "",
      data.Multiplier || 0,
      tdSupplierDef,
      tdPurchaseDef,
      data.Weight || 0,
      data.NoOfBoxes || 0,
      data.Height || 0,
      data.Width || 0,
      data.Length || 0,
      data.Volume || 0,
      linestatus,
      tdUseforAutoSplitQtyinSales,
    ];
    return dataList;
  }

  let headerStructure = [
    { index: 0, label: '#ID', class: 'colUOMID', active: false, display: true, width: "10" },
    { index: 1, label: 'Unit Name', class: 'colUOMName', active: true, display: true, width: "100" },
    { index: 2, label: 'Description', class: 'colUOMDesc', active: true, display: true, width: "200" },
    { index: 3, label: 'Product Name', class: 'colUOMProduct', active: false, display: true, width: "250" },
    { index: 4, label: 'Base Unit Name', class: 'colUOMBaseUnitName', active: false, display: true, width: "150" },
    { index: 5, label: 'Base Unit ID', class: 'colUOMBaseUnitID', active: false, display: true, width: "100" },
    { index: 6, label: 'Part ID', class: 'colUOMPartID', active: false, display: true, width: "100" },
    { index: 7, label: 'Unit Multiplier', class: 'colUOMMultiplier', active: true, display: true, width: "140" },
    { index: 8, label: 'Sale Default', class: 'colUOMSalesDefault', active: true, display: true, width: "140" },
    { index: 9, label: 'Purchase Default', class: 'colUOMPurchaseDefault', active: true, display: true, width: "170" },
    { index: 10, label: 'Weight', class: 'colUOMWeight', active: false, display: true, width: "100" },
    { index: 11, label: 'No of Boxes', class: 'colUOMNoOfBoxes', active: false, display: true, width: "120" },
    { index: 12, label: 'Height', class: 'colUOMHeight', active: false, display: true, width: "100" },
    { index: 13, label: 'Width', class: 'colUOMWidth', active: false, display: true, width: "100" },
    { index: 14, label: 'Length', class: 'colUOMLength', active: false, display: true, width: "100" },
    { index: 15, label: 'Volume', class: 'colUOMVolume', active: false, display: true, width: "100" },
    { index: 16, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
    { index: 17, label: 'Qty in Sales', class: 'colQtyinSales', active: false, display: true, width: "150" },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.uomlistpop.onRendered(function() {

});

Template.uomlistpop.events({

});

Template.uomlistpop.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getUOMDataList;
  },

  searchAPI: function() {
    return sideBarService.getUOMVS1ByName;
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
  tablename: () => {
    let templateObject = Template.instance();
    let selCustID = templateObject.data.custid ? templateObject.data.custid:'';
    return 'tblUOMList'+selCustID;
  },
});
