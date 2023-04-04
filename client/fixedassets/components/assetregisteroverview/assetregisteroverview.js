import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import "../../../lib/global/indexdbstorage.js";
import { FixedAssetService } from "../../fixedasset-service.js";
// let sideBarService = new SideBarService();
let fixedAssetService = new FixedAssetService();

Template.assetregisteroverview.onCreated(function () {
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
      data.PurchCost || "",
      data.SupplierName,
      data.CUSTDATE1 ? moment(data.CUSTDATE1).format("DD/MM/YYYY") : "",
      data.CUSTFLD7 || "",
      data.DepreciationStartDate ? moment(data.DepreciationStartDate).format("DD/MM/YYYY") : "",
      linestatus,
    ];
    return dataList;
  };

  templateObject.getExData = function (data) {
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
      data.PurchCost || "",
      data.SupplierName,
      data.CUSTDATE1 ? moment(data.CUSTDATE1).format("DD/MM/YYYY") : "",
      data.CUSTFLD7 || "",
      data.DepreciationStartDate ? moment(data.DepreciationStartDate).format("DD/MM/YYYY") : "",
      linestatus,
    ];
    return dataList;
  };

  let headerStructure = [
    // { index: 0, label: '#Sort Date', class:'colSortDate', active: false, display: true, width: "20" },
    {
      index: 0,
      label: "ID",
      class: "AssetRegisterId",
      active: false,
      display: true,
      width: "60",
    },
    {
      index: 1,
      label: "Asset Code",
      class: "RegisterAssetCode",
      active: true,
      display: true,
      width: "130",
    },
    {
      index: 2,
      label: "Asset Name",
      class: "RegisterAssetName",
      active: true,
      display: true,
      width: "150",
    },
    {
      index: 3,
      label: "Asset Description",
      class: "RegisterAssetDescription",
      active: true,
      display: true,
      width: "170",
    },
    {
      index: 4,
      label: "Asset Type",
      class: "RegisterAssetType",
      active: true,
      display: true,
      width: "130",
    },
    {
      index: 5,
      label: "Brand",
      class: "RegisterAssetBrand",
      active: true,
      display: true,
      width: "120",
    },
    {
      index: 6,
      label: "Model",
      class: "RegisterAssetModel",
      active: true,
      display: true,
      width: "90",
    },
    {
      index: 7,
      label: "Number",
      class: "RegisterAssetNumber",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 8,
      label: "Registration No",
      class: "RegisterAssetRegistrationNo",
      active: true,
      display: true,
      width: "160",
    },
    {
      index: 9,
      label: "Type",
      class: "RegisterAssetType",
      active: true,
      display: true,
      width: "80",
    },
    {
      index: 10,
      label: "Capacity Weight",
      class: "RegisterAssetCapacityWeight",
      active: true,
      display: true,
      width: "160",
    },
    {
      index: 11,
      label: "Capacity Volume",
      class: "RegisterAssetCapacityVolume",
      active: true,
      display: true,
      width: "160",
    },
    {
      index: 12,
      label: "Purchased Date",
      class: "RegisterAssetPurchasedDate",
      active: true,
      display: true,
      width: "160",
    },
    {
      index: 13,
      label: "Cost",
      class: "RegisterAssetCost",
      active: true,
      display: true,
      width: "100",
    },
    {
      index: 14,
      label: "Supplier",
      class: "RegisterAssetSupplier",
      active: true,
      display: true,
      width: "110",
    },
    {
      index: 15,
      label: "Registration Renewal Date",
      class: "RegisterAssetRegisterRenewDate",
      active: true,
      display: true,
      width: "250",
    },
    {
      index: 16,
      label: "Insurance Info",
      class: "RegisterAssetInsuranceInfo",
      active: true,
      display: true,
      width: "140",
    },
    {
      index: 17,
      label: "Depreciation Start Date",
      class: "RegisterAssetRenewDate",
      active: true,
      display: true,
      width: "250",
    },
    {
      index: 18,
      label: "Status",
      class: "AssetStatus",
      active: true,
      display: true,
      width: "120",
    },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.assetregisteroverview.onRendered(function () {
  $("#tblAssetRegisterList tbody").on("click", "tr", function () {
    var assetID = parseInt($(this).find(".AssetRegisterId").html());
    FlowRouter.go("/fixedassetcard?assetId=" + assetID);
  });
});

Template.assetregisteroverview.events({
  "click button#btnNewAsset": function () {
    FlowRouter.go("/fixedassetcard");
  },
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    fixedAssetService
      .getTFixedAssetsList()
      .then(function (data) {
        addVS1Data("TServiceLogList", JSON.stringify(data))
          .then(function (datareturn) {
            window.open("/assetregisteroverview", "_self");
          })
          .catch(function (err) {
            window.open("/assetregisteroverview", "_self");
          });
      })
      .catch(function (err) {
        window.open("/assetregisteroverview", "_self");
      });
  },
});

Template.assetregisteroverview.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get();
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblAssetRegisterList",
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
    return ["ID"];
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
});
