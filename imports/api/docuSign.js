import {Meteor} from 'meteor/meteor';
import requestSignDocument from "/imports/signdoc/docuSignHelper";
const pdf = require('html-pdf');

let html = '';

Meteor.methods({
    receiveHTMLChunk: function(chunk) {
        html += chunk;
    },
    'requestSign'(signerEmail, signerName, ccEmail, ccName) {

        requestSignDocument(signerEmail, signerName, ccEmail, ccName, html);

        html = '';


    }
});
