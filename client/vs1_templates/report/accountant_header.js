import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { ReportService } from "../../reports/report-service";
import TableHandler from '../../js/Table/TableHandler';
import moment from 'moment';
// import docusign from "docusign-esign";
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jQuery.print/jQuery.print.js';
import "../../lib/global/indexdbstorage.js";

import { Template } from 'meteor/templating';
import './accountant_header.html';

let sideBarService = new SideBarService();
let reportService = new ReportService();
let utilityService = new UtilityService();

Template.accountant_header.onCreated(function(){
    
});

Template.accountant_header.onRendered(function() {
    
});

Template.accountant_header.events({
  'click .btnDocusign':  function () {
    window.open('http://localhost:5000/', '_blank');
  }
});

Template.accountant_header.helpers({
  
});
