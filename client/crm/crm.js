import '../lib/global/indexdbstorage.js';

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
