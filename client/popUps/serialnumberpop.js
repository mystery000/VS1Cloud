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
import { ProductService } from "../product/product-service";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.serialnumberpop.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.serialnumberlist = new ReactiveVar();
});
Template.serialnumberpop.onRendered(() => {});
Template.serialnumberpop.helpers({});
Template.serialnumberpop.events({
    'keyup .lineSerialnumbers': function(event) {
        $('.serialNo').text('1');
    },
    'click .btnSNSave': function(event) {
        let startSerialnum = Number($('.lineSerialnumbers').text());
        let selectedunit = localStorage.getItem('productItem');
        console.log(startSerialnum, selectedunit);
    },
    'click .btnAutoFill': function(event) {
        let startSerialnum = Number($('.lineSerialnumbers').text());
        let selectedunit = localStorage.getItem('productItem');
        console.log(startSerialnum, selectedunit);
        if (startSerialnum == 0 || startSerialnum == "NaN" || startSerialnum == "") {
            swal('', 'You have to enter serial number correctly!', 'info');
            event.preventDefault();
            return false;
        } else {
            if (selectedunit == 1) {
                event.preventDefault();
                return false;
            } else {
                let shtml = '';
                shtml += `<tr><td rowspan="2"></td><td colspan="2" class="text-center">Allocate Serial Numbers</td></tr>
                <tr><td class="text-start">#</td><td class="text-start">Serial number</td></tr>
                `;
                for (let i = 0; i < selectedunit; i++) {
                    shtml += `
                    <tr><td></td><td>${Number(i)+1}</td><td>${Number(startSerialnum)+i}</td></tr>
                    `;
                }
                $('#tblSeriallist').html(shtml);
            }
        }
    }


});