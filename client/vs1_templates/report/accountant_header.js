import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { ReportService } from "../../reports/report-service";
import TableHandler from '../../js/Table/TableHandler';
import moment from 'moment';
import docusign from "docusign-esign";
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jQuery.print/jQuery.print.js';
import "../../lib/global/indexdbstorage.js";

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
    'click .btnDocusign': function() {
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
    }
});

Template.accountant_header.helpers({

});
