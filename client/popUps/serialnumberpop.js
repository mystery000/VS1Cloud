import {
    SalesBoardService
} from '../js/sales-service';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    UtilityService
} from "../utility-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.serialnumberpop.onCreated(() => {});
Template.serialnumberpop.onRendered(() => {});
Template.serialnumberpop.helpers({});
Template.serialnumberpop.events({
    'keyup .lineSerialnumbers': function(event) {
        $('.serialNo').text('1');
    },
    'click .btnSNSave': function(event) {
        let startSerialnum = Number($('.lineSerialnumbers').text());
        let selectedunit = localStorage.getItem('productItem');
        console.log("Serial Numbers:", startSerialnum, "No:", Number(selectedunit));
    }
});
