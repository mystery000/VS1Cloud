import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { ReportService } from "../../reports/report-service";

import { Template } from 'meteor/templating';
import './accountant_header.html';

let sideBarService = new SideBarService();
let reportService = new ReportService();
let utilityService = new UtilityService();

Template.accountant_header.onCreated(function() {

});

Template.accountant_header.onRendered(function() {

});

Template.accountant_header.events({
    'click .btnDocusign': function() {
        $('#signerEmail').val('');
        $('#signerName').val('');
        $('#envelopModal').modal('show');
    },
    'click #btnSendEnvelop': function() {
        let signerEmail = $('#signerEmail').val();
        let signerName = $('#signerName').val();

        $('.fullScreenSpin').css('display', 'inline-block');
        var opt = {
            margin: 0.8,
            filename: 'accountant-company.pdf',
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: {
                after: [".pagebreak"]
            }
        };
        let element = document.getElementById('printReport');
        let html = `
            <!DOCTYPE html>
            <html>
                <head>
                  <meta charset="UTF-8">
                </head>
                <body style="font-family:sans-serif;margin-left:2em;">
                ${element.innerHTML}
                </body>
            </html>
          `;
        Meteor.call('document.requestSign', signerEmail, signerName, html);

        setTimeout(() => {
            $('.fullScreenSpin').css('display', 'none');
            $('#envelopModal').modal('hide');
        }, 2000);
    }
});

Template.accountant_header.helpers({

});