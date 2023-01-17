import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "../../../lib/global/indexdbstorage.js";

Template.assetregisteroverview.onCreated(function () {
  const templateObject = Template.instance();
});

Template.assetregisteroverview.onRendered(function () {

});

Template.assetregisteroverview.events({
  "click button#btnNewAsset": function () {
    FlowRouter.go('/fixedassetcard');
  }
});

Template.assetregisteroverview.helpers({
});
