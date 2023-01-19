import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { SideBarService } from "../../../js/sidebar-service";
import "../../../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();

Template.serviceloglisttable.onCreated(function () {
});
Template.serviceloglisttable.onRendered(function () {
  $("#tblServiceLogList tbody").on("click", "tr", function() {
    var ID = $(this).attr("id");
    FlowRouter.go("/servicelogcard?id=" + ID );
  });
});
Template.serviceloglisttable.events({

  "click #btnNewServiceLog": function() {
    FlowRouter.go('/servicelogcard');
  }
});