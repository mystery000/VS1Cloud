import { SalesBoardService } from '../../js/sales-service';
import '../../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

import './new_rate_pop.html';

let sideBarService = new SideBarService();

Template.newratepop.onCreated(() => {});
Template.newratepop.onRendered(() => {});
Template.newratepop.helpers({});
Template.newratepop.events({
    'click .btnSaveStatus': function() {
        playSaveAudio();
        let clientService = new SalesBoardService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');
        
        let rateName = $('#newRate').val();
        leadData = {
            type: 'TLeadStatusType',
            fields: {
                rate: rateName,
                Active: true
            }
        };
        if (rateName != "") {
        } else {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Please Enter Status',
                text: "Status field cannot be empty",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {}
                else if (result.dismiss === 'cancel') {}
            });
        }
    }, delayTimeAfterSound);
    },
    'keydown #quantity': function (event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) != -1 ||
            (event.keyCode == 65 && (event.ctrlKey == true || event.metaKey == true)) ||
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            return;
        }
        if (event.shiftKey == true) {
            event.preventDefault();
        }
        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {

        }
        else {
            event.preventDefault();
        }
    },
});
