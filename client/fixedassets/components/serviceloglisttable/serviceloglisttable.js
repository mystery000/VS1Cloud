import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ServiceLogService } from "../../servicelog-service";
import { SideBarService } from "../../../js/sidebar-service";
import "../../../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();
let serviceLogService = new ServiceLogService();

Template.serviceloglisttable.onCreated(function () {
  const templateObject = Template.instance();
});

Template.serviceloglisttable.onRendered(function () {
});

Template.serviceloglisttable.events({

  "click #btnNewServiceLog": function() {
    FlowRouter.go('/servicelogcard');
  }
});

Template.serviceloglisttable.helpers({
});
