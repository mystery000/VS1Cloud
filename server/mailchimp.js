const listAid = 'bc36c79985';
const apikey = 'fdaeb86ecef07dfd9e7bb401a5bd9262-us12';


Meteor.startup(function () {
  if (Meteor.isServer) {

    SyncedCron.start();
  }

});

Meteor.methods({

  createListMember: function (email, firstname = '', lastname = '') {

    let data = {
      "email_address": email,
      "status": "subscribed",
      "merge_fields": { "FNAME": firstname, "LNAME": lastname }
      // "tags": [tag]
    };

    const apiregion = apikey.split('-')[1];
    const listAurl = 'https://' + apiregion + '.api.mailchimp.com/3.0/lists/' + listAid + '/members';
    console.log(listAurl)
    Meteor.call('MCApi', 'POST', listAurl, data, function (error, result) { });
  },

  // call mailchimp api
  MCApi: function (method, apiUrl, data) {

    let options = { 'auth': 'Authorization:' + apikey };
    options['data'] = data || '';

    try {
      var response = HTTP.call(method, apiUrl, options).data;
    } catch (error) {
      console.log(error);
      Meteor.defer(function () {
        Email.send({
          from: data.email_address,
          to: 'bluestars088@gmail.com',
          subject: 'API Error encountered - Mailchimp',
          text: error
        });
      });

      return error;
    }
  },

});
