const listAid = 'bc36c79985';
const apikey = 'fdaeb86ecef07dfd9e7bb401a5bd9262-us12';
const listAurl = 'https://us12.api.mailchimp.com/3.0/lists/' + listAid + '/members';


Meteor.startup(function () {
  if (Meteor.isServer) {

    SyncedCron.start();
  }

});

Meteor.methods({

  MCNewUser: function (email, firstname = '') {

    let data = {
      "email_address": email,
      "status": "subscribed",
      "merge_fields": { "FNAME": firstname }
    };

    MCApi('POST', listAurl, data);
  },

  //this is our API function call
  MCApi: function (method, apiUrl, data) {

    let options = { 'auth': apikey };
    options['data'] = data || '';

    // try…catch allows you to handle errors properly
    try {
      var response = HTTP.call(method, apiUrl, options).data;
    } catch (error) {
      console.log(error);
      Meteor.defer(function () {
        var text = JSON.stringify(error);
        Email.send({
          from: data.email_address,
          to: 'bluestars088@gmail.com',
          subject: 'API Error encountered - Mailchimp',
          text: text
        });
      });

      return error;
    }
  },

});
