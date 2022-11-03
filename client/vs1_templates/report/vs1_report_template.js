import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import TableHandler from '../../js/Table/TableHandler';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.vs1_report_template.inheritsHooksFrom('export_import_print_display_button');

Template.vs1_report_template.inheritsHelpersFrom('generalledger');
Template.vs1_report_template.inheritsEventsFrom('generalledger');
Template.vs1_report_template.inheritsHooksFrom('generalledger');

Template.vs1_report_template.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.tablename = new ReactiveVar();
    templateObject.tabledisplayname = new ReactiveVar();
});

Template.vs1_report_template.onRendered(function() {
  let templateObject = Template.instance();
  var url = FlowRouter.current().path;
  let currenttablename = "";
  let displaytablename = "";
  if (url.includes("/generalledger")) {
    currenttablename = "generalledger";
    displaytablename = "General Ledger";
  };
  templateObject.tablename.set(currenttablename);
  templateObject.tabledisplayname.set(displaytablename);

  //tableResize();
});

Template.vs1_report_template.events({

});

Template.vs1_report_template.helpers({
  loggedCompany: () => {
      return localStorage.getItem('mySession') || '';
  },
  tablename: () => {
      return Template.instance().tablename.get();
  },
  tabledisplayname: () => {
      return Template.instance().tabledisplayname.get();
  }
});
