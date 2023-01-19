import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "../../../lib/global/indexdbstorage.js";

Template.assetregisteroverview.onCreated(function () {
  const templateObject = Template.instance();
});

Template.assetregisteroverview.onRendered(function () {
  $("#tblAssetRegisterList tbody").on("click", "tr", function() {
    var assetID = $(this).attr("id");
    FlowRouter.go("/fixedassetcard?assetId=" + assetID );
  });
});

Template.assetregisteroverview.events({
  "click button#btnNewAsset": function () {
    FlowRouter.go('/fixedassetcard');
  }
});

Template.assetregisteroverview.helpers({
});
