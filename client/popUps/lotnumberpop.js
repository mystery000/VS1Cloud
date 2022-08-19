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
Template.lotnumberpop.onCreated(() => {});
Template.lotnumberpop.onRendered(() => {});
Template.lotnumberpop.helpers({});
Template.lotnumberpop.events({
    'click .btnLNSave': async function(event) {
        const lotNumber = $('#tblLotlist tbody tr td:nth-child(2) input').val();
        const expiryDate = $('#tblLotlist tbody tr td:last-child input').val();
        if (lotNumber && expiryDate) {
            const rowNumber = $('#lotNumberModal').attr('data-row');
            $(`#table tbody tr:nth-child(${rowNumber}) td.colSerialNo`).attr('data-lotnumber', lotNumber);
            $(`#table tbody tr:nth-child(${rowNumber}) td.colSerialNo`).attr('data-lotexpirydate', new Date(expiryDate).getTime());
        }
        $('#lotNumberModal').modal('hide');
    },
    'click .btnDelete': function() {
        const defaultRow = '<tr>' +
        '    <td rowspan="2"></td>' +
        '    <td colspan="3" class="text-center">Allocate Lot Numbers</td>' +
        '</tr>' +
        '<tr>' +
        '    <td class="text-start">#</td>' +
        '    <td class="text-start">Lot number</td>' +
        '    <td class="text-start">Expiry Date</td>' +
        '</tr>' +
        '<tr>' +
        '    <td></td>' +
        '    <td class="lotNo">*</td>' +
        '    <td class="lotNumber"><input type="text"/></td>' +
        '    <td class="lotExpiryDate"><input type="datetime-local"/></td>' +
        '</tr>';
        $('#tblLotlist tbody').html(defaultRow);
    },
});