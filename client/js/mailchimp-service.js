import { HTTP } from "meteor/http";
import { BaseService } from '../js/base-service.js';

export class MailchimpService extends BaseService {
  constructor() {
    super();
    this.url = 'https://us12.api.mailchimp.com/3.0/';
    this.listAid = 'bc36c79985';
    this.apikey = 'fdaeb86ecef07dfd9e7bb401a5bd9262-us12';
  }

  createNewUser(email, firstname = '') {

    let data = {
      "email_address": email,
      "status": "subscribed",
      "merge_fields": { "FNAME": firstname }
    };

    let listAurl = this.url + 'lists/' + this.listAid + '/members';
    this.callMailchimpApi('POST', listAurl, data);
  };

  callMailchimpApi(method, apiUrl, data) {

    let options = { 'auth': 'Authorization:' + this.apikey };

    try {
      // if (Meteor.isServer) {
      //   const response = HTTP.call(method, apiUrl, options).data;
      //   console.log('response', response);
      // }

      let promise = new Promise(function (resolve, reject) {
        HTTP.post(apiUrl, { headers: options, data: data }, function (err, response) {
          if (err) {
            reject(response);
          } else {
            resolve(response);
          }
        });
      });
      return promise;

    } catch (error) {
      console.log(error);
      return error;
    }
  };
}
