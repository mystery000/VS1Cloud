import {
    ReactiveVar
} from 'meteor/reactive-var';
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

import { Template } from 'meteor/templating';
import './availablelotnumberpop.html';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var autofilled = false;
Template.availablelotnumberpop.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.lotnumberlist = new ReactiveVar();
});
Template.availablelotnumberpop.onRendered(async () => {
    $(document).on('click', '.lot-no-row', function() {
        const activeNumber = $('.lot-no-row.active').length;
        const productItems = localStorage.getItem('productItem');
        if (parseInt(activeNumber) < parseInt(productItems)) {
            $(this).toggleClass('active');
        } else {
            if ($(this).hasClass('active')) {
                $(this).toggleClass('active');
            } else {
                swal('', 'You should select within the number of shipped products.', 'warning');
            }
        }
    });

    // Damien
    // Set focus when open account list modal
    $( "#availableLotNumberModal" ).on('shown.bs.modal', function(){
        setTimeout(function() {
            $('#tblAvailableLotCheckbox_filter .form-control-sm').get(0).focus();
        }, 500);
    });
});
Template.availablelotnumberpop.helpers({});
Template.availablelotnumberpop.events({
    'click .btnSNSave': async function(event) {
        const activeNumber = $('#tblAvailableLotCheckbox input.chkServiceCard');
        const expiryDates = $('#tblAvailableLotCheckbox tbody tr td:nth-child(4)');
        let newNumberList = [];
        let newExpiryDateList = [];
        activeNumber.each((key, serialchk) => {
            if($(serialchk).is(':checked')){
                newNumberList.push($(serialchk).closest("tr").find(".colLot").html());
            }            
        });
        expiryDates.each((key, lotExpiryEl) => {
            const lotExpiryDate = $(lotExpiryEl).text();
            newExpiryDateList.push(lotExpiryDate);
        });
        if (newNumberList.length === 0) {
            swal('', 'You didn\'t select any lot numbers', 'warning');
        } else {
            // let shtml = '';
            // shtml += `<tr><td rowspan="2"></td><td colspan="2" class="text-center">Available Lot Numbers</td></tr>
            // <tr><td class="text-start">#</td><td class="text-start">Lot number</td></tr>
            // `;
            // for (let i = 0; i < newNumberList.length; i++) {
            //     shtml += `
            //     <tr><td></td><td>${Number(i)+1}</td><td contenteditable="true" class="lineLotnumbers">${newNumberList[i]}</td></tr>
            //     `;
            // }
            // $('#tblLotlist').html(shtml);

            const rowNumber = $('#availableLotNumberModal').attr('data-row');
            $(`table tbody tr:nth-child(${rowNumber}) td.colSerialNo`).attr('data-lotnumbers', newNumberList.join(','));
            $(`table tbody tr:nth-child(${rowNumber}) td.colSerialNo`).attr('data-expirydates', newExpiryDateList.join(','));
            $('#availableLotNumberModal').modal('hide');
        }

        $('#availableLotNumberModal').modal('hide');
    }
});
