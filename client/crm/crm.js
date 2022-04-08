// import { ReactiveVar } from 'meteor/reactive-var';
// import { CoreService } from '../js/core-service';
// import { EmployeeProfileService } from "../js/profile-service";
// import { AccountService } from "../accounts/account-service";
// import { UtilityService } from "../utility-service";
// import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
// let sideBarService = new SideBarService();
// let utilityService = new UtilityService();

Template.crmoverview.onCreated(function () {

});

Template.crmoverview.onRendered(function () {

});

Template.crmoverview.events({
  "click #btnTaskList": function (event) {
    FlowRouter.go("/tasklist");
  },
});

Template.crmoverview.helpers({

});
