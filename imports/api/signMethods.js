import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import requestSignDocument from '../eSignature/requestSignDoc'

Meteor.methods({
    'document.requestSign'(signerEmail, signerName, docFile) {
        requestSignDocument(signerEmail, signerName, docFile);
    },
});