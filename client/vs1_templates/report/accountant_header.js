import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { ReportService } from "../../reports/report-service";

import { Template } from 'meteor/templating';
import './accountant_header.html';
import {Meteor} from "meteor/meteor";

let sideBarService = new SideBarService();
let reportService = new ReportService();
let utilityService = new UtilityService();

Template.accountant_header.onCreated(function() {

});

Template.accountant_header.onRendered(function() {

});

Template.accountant_header.events({
    // Alex: Add for Docusign start
    'click .btnDocusign': function() {
<<<<<<< HEAD
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

        let signerEmail = 'dev@vs1cloud.com';
        let signerName = 'Dev VS1Cloud';
        let ccEmail = 'babybear1280@proton.me';
        let ccName = 'Phillips';

        let chunkSize = 5 * 1024 * 1024; // 5 MB
        let html = document.getElementById("printReport").outerHTML;
        let chunks = [];

        for (let i = 0; i < html.length; i += chunkSize) {
            chunks.push(html.substring(i, i + chunkSize));
        }

        const sendChunk = (index) => {
            Meteor.call('receiveHTMLChunk', chunks[index], function(error) {
                if (error) {
                    console.error(error);
                } else {
                    if (index + 1 < chunks.length) {
                        sendChunk(index + 1);
                    } else {
                        Meteor.call('requestSign', signerEmail, signerName, ccEmail, ccName);
                    }
                }
            });
        };

        sendChunk(0);
=======
        $('#signerEmail').val('');
        $('#signerName').val('');
        $('#envelopModal').modal('show');
    },
    'click #btnSendEnvelop': function() {
        let signerEmail = $('#signerEmail').val();
        let signerName = $('#signerName').val();

        $('.fullScreenSpin').css('display', 'inline-block');
        let element = document.getElementById('printReport');
        let html = `
            <!DOCTYPE html>
            <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                  
                  @media print {
                    *, :after, :before {
                         box-sizing: border-box; 
                    }
                    .row {
                        display: flex; flex-wrap: wrap; margin-right: -0.75rem; margin-left: -0.75rem;
                    }
                    .col {
                        flex-basis: 0; flex-grow: 1; max-width: 100%; position: relative; width: 100%; padding-right: 1.75rem; padding-left: 0.75rem padding-top: 1.75rem, padding-bottom: 1.75rem;
                    }
                    .pagebreak {
                        padding: 30px;
                    }
                  }
                  </style>
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
>>>>>>> 1bd64683b42064efbd9608579d35590409191a78
    }
    // Alex: Add for Docusign end
});

Template.accountant_header.helpers({

});
