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
var autofilled = false;
Template.serialnumberpop.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.serialnumberlist = new ReactiveVar();
});
Template.serialnumberpop.onRendered(() => {});
Template.serialnumberpop.helpers({});
Template.serialnumberpop.events({
    'keyup #first-serial-number': function(event) {
        $('.serialNo').text('1');
    },
    'click .btnSNSave': async function(event) {
        const numbers = $('#tblSeriallist tbody tr td:last-child');
        let newNumberList = [];
        numbers.each((key, serialEl) => {
            if (key === 0 || key === 1) return;
            const serialNumber = $(serialEl).text();
            newNumberList.push(serialNumber);
        });
        if (newNumberList.length) {
            const rowNumber = $('#serialNumberModal').attr('data-row');
            $(`table tbody tr:nth-child(${rowNumber}) td.colSerialNo`).attr('data-serialnumbers', newNumberList.join(','));
        }
        $('#serialNumberModal').modal('hide');
    },
    'click .btnDelete': function() {
        autofilled = false;
        $(`table tbody tr:nth-child(${rowNumber}) td.colSerialNo`).attr('data-serialnumbers', '');
        const defaultRow = '<tr>' +
        '    <td rowspan="2"></td>' +
        '    <td colspan="2" class="text-center">Allocate Serial Numbers</td>' +
        '</tr>' +
        '<tr>' +
        '    <td class="text-start">#</td>' +
        '    <td class="text-start">Serial number</td>' +
        '</tr>' +
        '<tr>' +
        '    <td></td>' +
        '    <td class="serialNo">*</td>' +
        '    <td><input id="first-serial-number" type="text"/></td>' +
        '</tr>';
        $('#tblSeriallist tbody').html(defaultRow);
    },
    'click .btnAutoFill': async function(event) {
        let startSerialnum = Number($('#first-serial-number').val());
        let selectedunit = localStorage.getItem('productItem');
        if (!autofilled) {
            if (startSerialnum == 0 || typeof startSerialnum == "NaN" || startSerialnum == "") {
                swal('', 'You have to enter serial number correctly!', 'info');
                event.preventDefault();
                return false;
            } else {
                autofilled = true;
                if (selectedunit == 1) {
                    event.preventDefault();
                    return false;
                } else {
                    const serialList = await sideBarService.getAllSerialNumber();
                    const serialNumberList = serialList.tserialnumberlistcurrentreport.map(serial => serial.SerialNumber);
                    let existSameNumber = false;
                    for (let i = 0; i < selectedunit; i++) {
                        if (serialNumberList.includes((Number(startSerialnum)+i).toString())) {
                            existSameNumber = true;
                            break;
                        }
                    }
                    if (existSameNumber) {
                        swal('', 'One or more than serial numbers already existed! Please try to change serial numbers.', 'error');
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
        }
    }
});
