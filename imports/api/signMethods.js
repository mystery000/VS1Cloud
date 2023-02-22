import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import requestSignDocument from '../eSignature/requestSignDoc'
const pdf = require('html-pdf');
const path = require('path');

Meteor.methods({
    'document.requestSign'(signerEmail, signerName, html) {

        pdf.create(html, { format: 'Letter', height: 'Infinity' }).toFile('./tmpDocs/output.pdf', (err, res) => {

            if (err) return console.log(err);

            requestSignDocument(signerEmail, signerName);
        });


        // requestSignDocument(signerEmail, signerName, html);
    },
});