import { ReactiveVar } from "meteor/reactive-var";

import { FixedAssetService } from "../../fixedasset-service";
import "../../../lib/global/indexdbstorage.js";

import { Template } from "meteor/templating";
import "./fixedassetlistpop.html";

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { UtilityService } from "../../../utility-service";
let fixedAssetService = new FixedAssetService();
let utilityService = new UtilityService();
Template.fixedassetlistpop.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.custfields = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
  templateObject.convertedStatus = new ReactiveVar();

  templateObject.getDataTableList = function (data) {
    let linestatus = '';
    if(data.Active == true){
      linestatus = "";
    }
    else if(data.Active == false){
      linestatus = "In-Active";
    }
    const dataList = [
      data.AssetID || "",
      data.AssetCode || "",
      data.AssetName || "",
      data.Description || "",
      data.AssetType || "",
      data.BrandName || "",
      data.Model || "",
      data.CUSTFLD1 || "",
      data.CUSTFLD2 || "",
      data.CUSTFLD3 || "",
      data.CUSTFLD4 || "",
      data.CUSTFLD5 || "",
      data.PurchDate ? moment(data.PurchDate).format("DD/MM/YYYY") : "",
      utilityService.modifynegativeCurrencyFormat(data.PurchCost) || 0.0,
      data.SupplierName,
      data.CUSTDATE1 ? moment(data.CUSTDATE1).format("DD/MM/YYYY") : "",
      data.CUSTFLD7 || "",
      data.DepreciationStartDate
        ? moment(data.DepreciationStartDate).format("DD/MM/YYYY")
        : "",
      linestatus
    ];
    return dataList;
  };

  templateObject.getExData = function (data) {
    const dataList = [
      data.AssetID || "",
      data.AssetCode || "",
      data.AssetName || "",
      data.Description || "",
      data.AssetType || "",
      data.BrandName || "",
      data.Model || "",
      data.CUSTFLD1 || "",
      data.CUSTFLD2 || "",
      data.CUSTFLD3 || "",
      data.CUSTFLD4 || "",
      data.CUSTFLD5 || "",
      data.PurchDate ? moment(data.PurchDate).format("DD/MM/YYYY") : "",
      utilityService.modifynegativeCurrencyFormat(data.PurchCost) || 0.0,
      data.SupplierName,
      data.CUSTDATE1 ? moment(data.CUSTDATE1).format("DD/MM/YYYY") : "",
      data.CUSTFLD7 || "",
      data.DepreciationStartDate
        ? moment(data.DepreciationStartDate).format("DD/MM/YYYY")
        : "",
      linestatus
    ];
    return dataList;
  };

  let headerStructure = [
    // { index: 0, label: '#Sort Date', class:'colSortDate', active: false, display: true, width: "20" },
    {
      index: 0,
      label: "ID",
      class: "colAssetRegisterId",
      active: false,
      display: true,
      width: "10",
    },
    {
      index: 1,
      label: "Asset Code",
      class: "colRegisterAssetCode",
      active: true,
      display: true,
      width: "130",
    },
    {
      index: 2,
      label: "Asset Name",
      class: "colRegisterAssetName",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 3,
      label: "Asset Description",
      class: "colRegisterAssetDescription",
      active: true,
      display: true,
      width: "170",
    },
    {
      index: 4,
      label: "Asset Type",
      class: "colRegisterAssetType",
      active: true,
      display: true,
      width: "130",
    },
    {
      index: 5,
      label: "Brand",
      class: "colRegisterAssetBrand",
      active: true,
      display: true,
      width: "120",
    },
    {
      index: 6,
      label: "Model",
      class: "colRegisterAssetModel",
      active: true,
      display: true,
      width: "90",
    },
    {
      index: 7,
      label: "Number",
      class: "colRegisterAssetNumber",
      active: false,
      display: true,
      width: "100",
    },
    {
      index: 8,
      label: "Registration No",
      class: "colRegisterAssetRegistrationNo",
      active: false,
      display: true,
      width: "50",
    },
    {
      index: 9,
      label: "Type",
      class: "colRegisterAssetType",
      active: false,
      display: true,
      width: "80",
    },
    {
      index: 10,
      label: "Capacity Weight",
      class: "colRegisterAssetCapacityWeight",
      active: false,
      display: true,
      width: "60",
    },
    {
      index: 11,
      label: "Capacity Volume",
      class: "colRegisterAssetCapacityVolume",
      active: false,
      display: true,
      width: "60",
    },
    {
      index: 12,
      label: "Purchased Date",
      class: "colRegisterAssetPurchasedDate",
      active: false,
      display: true,
      width: "80",
    },
    {
      index: 13,
      label: "Cost",
      class: "colRegisterAssetCost",
      active: true,
      display: true,
      width: "110",
    },
    {
      index: 14,
      label: "Supplier",
      class: "colRegisterAssetSupplier",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 15,
      label: "Registration Renewal Date",
      class: "colRegisterAssetRegisterRenewDate",
      active: true,
      display: true,
      width: "80",
    },
    {
      index: 16,
      label: "Insurance Info",
      class: "colRegisterAssetInsuranceInfo",
      active: false,
      display: true,
      width: "140",
    },
    {
      index: 17,
      label: "Depreciation Start Date",
      class: "colRegisterAssetRenewDate",
      active: false,
      display: true,
      width: "80",
    },
    {
      index: 18,
      label: "Status",
      class: "colAssetStatus",
      active: true,
      display: true,
      width: "120",
    },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.fixedassetlistpop.onRendered(function () {
  // $("#tblFixedAssetList tbody").on("click", "tr", function () {
  //   var assetID = parseInt($(this).find(".AssetRegisterId").html());
  //   FlowRouter.go("/fixedassetcard?assetId=" + assetID);
  // });
});

Template.fixedassetlistpop.events({
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    fixedAssetService
      .getTFixedAssetsList()
      .then(function (data) {
        addVS1Data("TFixedAssetsList", JSON.stringify(data))
          .then(function (datareturn) {
            window.location.reload();
            // Meteor._reload.reload();
          })
          .catch(function (err) {
            // Meteor._reload.reload();
            window.location.reload();
          });
      })
      .catch(function (err) {
        // Meteor._reload.reload();
        window.location.reload();
      });
  },
  "click .btnNewFixedAsset" : function(){
    $('div#fixedassetlistpopModal').modal('toggle');
    FlowRouter.go("/fixedassetcard");
  },
  
});

Template.fixedassetlistpop.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get();
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblFixedAssetList",
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
    return fixedAssetService.getTFixedAssetsList;
  },

  searchAPI: function () {
    return fixedAssetService.getTFixedAssetByNameOrID;
  },

  apiParams: function () {
    return ["limitCount", "limitFrom", "deleteFilter"];
  },

  service: () => {
    return fixedAssetService;
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

  tablename : function() {
    let templateObject = Template.instance();
    return 'tblFixedAssetList' + templateObject.data.custid;
  }
});
