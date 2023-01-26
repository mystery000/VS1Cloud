import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from "meteor/reactive-var";
import { FixedAssetService } from "../../fixedasset-service";
import { SideBarService } from "../../../js/sidebar-service";
import { UtilityService } from "../../../utility-service";
import "../../../lib/global/indexdbstorage.js";

import "./fixedAssetListTable.html";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let fixedAssetService = new FixedAssetService();

Template.fixedAssetListTable.onCreated(function () {
});

Template.fixedAssetListTable.onRendered(function () {
  $("#tblFixedAssetList tbody").on("click", "tr", function() {
    var assetID = $(this).attr("id");
    FlowRouter.go("/fixedassetcard?assetId=" + assetID );
  });
});

Template.fixedAssetListTable.events({
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    fixedAssetService.getTFixedAssetsList().then(function (data) {
      addVS1Data("TFixedAssets", JSON.stringify(data))
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