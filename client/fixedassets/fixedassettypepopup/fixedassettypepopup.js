import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
// import { SideBarService } from "../../../js/sidebar-service";
import "../../lib/global/indexdbstorage.js";
import { UtilityService } from "../../utility-service.js";
import { FixedAssetService } from "../fixedasset-service.js";

let fixedAssetService = new FixedAssetService();
let utilityService = new UtilityService();

Template.fixedassettypepopup.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.custfields = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
  templateObject.convertedStatus = new ReactiveVar();

  templateObject.getDataTableList = function (data) {
    let linestatus = '';
    if(data.fields.Active == true){
      linestatus = "";
    }
    else if(data.fields.Active == false){
      linestatus = "In-Active";
    }
    const dataList = [
      data.fields.ID || "",
      data.fields.AssetTypeCode || "",
      data.fields.AssetTypeName || "",
      data.fields.Notes || "",
      linestatus
    ];
    return dataList;
  };

  templateObject.getExData = function (data) {
    let linestatus = '';
    if(data.fields.Active == true){
      linestatus = "";
    }
    else if(data.fields.Active == false){
      linestatus = "In-Active";
    }
    const dataList = [
      data.fields.ID || "",
      data.fields.AssetTypeCode || "",
      data.fields.AssetTypeName || "",
      data.fields.Notes || "",
      linestatus
    ];
    return dataList;
  };

  let headerStructure = [
    // { index: 0, label: '#Sort Date', class:'colSortDate', active: false, display: true, width: "20" },
    {
      index: 0,
      label: "ID",
      class: "colFixedID",
      active: false,
      display: true,
      width: "30",
    },
    {
      index: 1,
      label: "Asset Type Code",
      class: "colAssetCode",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 2,
      label: "Asset Type Name",
      class: "colAssetName",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 3,
      label: "Notes",
      class: "colNotes",
      active: true,
      display: true,
      width: "200",
    },
    {
      index: 4,
      label: "Status",
      class: "colStatus",
      active: true,
      display: true,
      width: "120",
    },
  ];
  templateObject.tableheaderrecords.set(headerStructure);
});

Template.fixedassettypepopup.onRendered(function () {});

Template.fixedassettypepopup.events({
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },
  "click button#btnNewAssetType": () => {
    $("div#createAssetType").modal("show");
  },
  "click button#btnCreateAssetType": () => {
    const templateObject = Template.instance();
    let newAssetType = {
      type: "TFixedAssetType",
      fields: {
        AssetTypeCode: $("input#edtAssetTypeCode").val(),
        AssetTypeName: $("input#edtAssetTypeName").val(),
        Notes: $("input#edtAssetTypeDescription").val(),
      },
    };
    fixedAssetService.saveTFixedAssetType(newAssetType).then((data) => {
      fixedAssetService
        .getFixedAssetTypes()
        .then(function (data) {
          addVS1Data("TFixedAssetType", JSON.stringify(data));
        })
        .catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
      $("div#createAssetType").modal("hide");
      $("div#fixedassettypepopup").modal("hide");
    });
  },
});

Template.fixedassettypepopup.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get();
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblFixedAssetType",
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
    return fixedAssetService.getFixedAssetTypes;
  },

  searchAPI: function () {
    return fixedAssetService.getFixedAssetType;
  },

  apiParams: function () {
    return [];
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
