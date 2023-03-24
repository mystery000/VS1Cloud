import { ReactiveVar } from "meteor/reactive-var";
import { FixedAssetService } from "../../fixedasset-service";
import { SideBarService } from "../../../js/sidebar-service";
import { UtilityService } from "../../../utility-service";
import "../../../lib/global/indexdbstorage.js";

import { Template } from 'meteor/templating';
import './fixedassetlistpop.html';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let fixedAssetService = new FixedAssetService();

Template.fixedassetlistpop.onCreated(function () {
});

Template.fixedassetlistpop.onRendered(function () {
});

Template.fixedassetlistpop.events({
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
});