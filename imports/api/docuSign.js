import {Meteor} from 'meteor/meteor';
import requestSignDocument from "/imports/signdoc/docuSignHelper";
const pdf = require('html-pdf');

let html = '';

Meteor.methods({
    receiveHTMLChunk: function(chunk) {
        html += chunk;
    },
    'requestSign'(signerEmail, signerName, ccEmail, ccName) {

        // pdf.create(html, { format: 'A4' }).toFile('/output.pdf', (err, res) => {
        //     html = '';
        //
        //     if (err) return console.log(err);
        //
        //     console.log(res);
        //
        //     requestSignDocument(signerEmail, signerName, ccEmail, ccName);
        // });
        //
        // html = '';

        requestSignDocument(signerEmail, signerName, ccEmail, ccName, html);

        html = '';


    }
});
