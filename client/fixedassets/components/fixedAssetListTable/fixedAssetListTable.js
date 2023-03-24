import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from "meteor/reactive-var";
import { FixedAssetService } from "../../fixedasset-service";
import { SideBarService } from "../../../js/sidebar-service";
import { UtilityService } from "../../../utility-service";
import "../../../lib/global/indexdbstorage.js";
import { Template } from 'meteor/templating';

import "./fixedAssetListTable.html";
import moment from "moment";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let fixedAssetService = new FixedAssetService();

Template.fixedAssetListTable.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.tableheaderrecords = new ReactiveVar();
  templateObject.getDataTableList = function(data) {
    const dataList = [
      data.AssetID || "",
      data.AssetName || "",
      data.Colour || "",
      data.BrandName || "",
      data.Manufacture || "",
      data.Model || "",
      data.AssetCode || "",
      data.AssetType || "",
      data.Department || "",   // tempcode how to get department
      data.PurchDate ? moment(data.PurchDate).format("DD/MM/YYYY") : "",
      utilityService.modifynegativeCurrencyFormat(data.PurchCost) || 0.0,
      data.Serial || "",
      data.Qty || 0,
      data.AssetCondition || "",
      data.LocationDescription || "",
      data.Notes || "",
      data.Size || "",
      data.Shape || "",
      //data.Status || "",
      data.Active ? "" : "In-Active",
      data.BusinessUsePercent || 0.0,
      utilityService.modifynegativeCurrencyFormat(data.EstimatedValue) || 0.0,
      utilityService.modifynegativeCurrencyFormat(data.ReplacementCost) || 0.0,
      data.WarrantyType || "",
      data.WarrantyExpiresDate ? moment(data.WarrantyExpiresDate).format("DD/MM/YYYY") : "",
      data.InsuredBy || "",
      data.InsurancePolicy || "",
      data.InsuredUntil ? moment(data.InsuredUntil).format("DD/MM/YYYY") : "",
      //data.Active ? "" : "In-Active",
    ];
    return dataList;
  }

  let headerStructure = [
    { index: 0, label: '#ID', class: 'colFixedID', active: false, display: true, width: "30" },
    { index: 1, label: 'Asset Name', class: 'colAssetName', active: true, display: true, width: "80" },
    { index: 2, label: 'Colour', class: 'colColor', active: true, display: true, width: "40" },
    { index: 3, label: 'Brand Name', class: 'colBrandName', active: true, display: true, width: "40" },
    { index: 4, label: 'Manufacture', class: 'colManufacture', active: true, display: true, width: "40" },
    { index: 5, label: 'Model', class: 'colModel', active: true, display: true, width: "40" },
    { index: 6, label: 'Asset Code', class: 'colAssetCode', active: true, display: true, width: "50" },
    { index: 7, label: 'Asset Type', class: 'colAssetType', active: true, display: true, width: "50" },
    { index: 8, label: 'Department', class: 'colDepartment', active: true, display: true, width: "50" },
    { index: 9, label: 'Purch Date', class: 'colPurchDate', active: true, display: true, width: "80" },
    { index: 10, label: 'Purch Cost', class: 'colPurchCost', active: true, display: true, width: "80" },
    { index: 11, label: '#Serial', class: 'colSerial', active: false, display: true, width: "60" },
    { index: 12, label: 'Qty', class: 'colQty', active: true, display: true, width: "30" },
    { index: 13, label: 'Asset Condition', class: 'colAssetCondition', active: true, display: true, width: "60" },
    { index: 14, label: '#Location Description', class: 'colLocationDescription', active: false, display: true, width: "100" },
    { index: 15, label: '#Notes', class: 'colNotes', active: false, display: true, width: "100" },
    { index: 16, label: 'Size', class: 'colSize', active: true, display: true, width: "50" },
    { index: 17, label: 'Shape', class: 'colShape', active: true, display: true, width: "60" },
    { index: 18, label: 'Status', class: 'colStatus', active: true, display: true, width: "60" },
    { index: 19, label: 'Business Use(%)', class: 'colBusinessUse', active: true, display: true, width: "60" },
    { index: 20, label: 'Estimated Value', class: 'colEstimatedValue', active: true, display: true, width: "60" },
    { index: 21, label: 'Replacement Cost', class: 'colReplacementCost', active: true, display: true, width: "50" },
    { index: 22, label: '#Warranty Type', class: 'colWarrantyType', active: false, display: true, width: "50" },
    { index: 23, label: '#Warranty Expires Date', class: 'colWarrantyExpiresDate', active: false, display: true, width: "100" },
    { index: 24, label: '#Insured By', class: 'colInsuredBy', active: false, display: true, width: "80" },
    { index: 25, label: '#Insurance Policy', class: 'colInsurancePolicy', active: false, display: true, width: "80" },
    { index: 26, label: '#Insured Until', class: 'colInsuredUntil', active: false, display: true, width: "80" },
    //{ index: 27, label: 'Status', class: 'colStatus', active: true, display: true, width: "" },
  ];

  templateObject.tableheaderrecords.set(headerStructure);
});

Template.fixedAssetListTable.onRendered(function () {
  $("#tblFixedAssetList tbody").on("click", "tr", function() {
    var assetID = $(this).closest("tr").find(".colFixedID").text();
    FlowRouter.go("/fixedassetcard?assetId=" + assetID );
  });
});

Template.fixedAssetListTable.events({
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    fixedAssetService.getTFixedAssetsList().then(function (data) {
      addVS1Data("TFixedAssetsList", JSON.stringify(data))
        .then(function (datareturn) {
          Meteor._reload.reload();
        })
        .catch(function (err) {
          Meteor._reload.reload();
        });
    }).catch(function (err) {
      Meteor._reload.reload();
    });
  },

  "click #btnNewFixedAsset": function () {
    FlowRouter.go('/fixedassetcard');
  },

  "click #btnAssetCostReport": function () {
    FlowRouter.go('/assetcostreport');
  },

  "click #btnAssetRegister": function () {
    FlowRouter.go('/assetregisteroverview');
  },

  "click #btnServiceLogs": function () {
    FlowRouter.go('/serviceloglist');
  }
});

Template.fixedAssetListTable.helpers({
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },

  apiFunction:function() {
    let fixedAssetService = new FixedAssetService();
    return fixedAssetService.getTFixedAssetsList;
  },

  searchAPI: function() {
    return fixedAssetService.getTFixedAssetByNameOrID;
  },

  service: ()=>{
    let fixedAssetService = new FixedAssetService();
    return fixedAssetService;

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