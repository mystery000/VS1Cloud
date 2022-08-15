const mailchimp = require('@mailchimp/mailchimp_marketing');

Meteor.startup(function () {
});

Meteor.methods({

  createListMembers: async function (erpGet, supplier = 0, customer = 0, employee = 0) {

    const responseHandler = (response) => {
      if (response === undefined) {
        let getResponse = "You have lost internet connection, please log out and log back in.";
        return getResponse;
      } else {
        if (response.statusCode === 200) {
          try {
            var content = JSON.parse(response.content);
            return content;
          } catch (e) { }
        } else if (response.statusCode === 401) {

        } else {
          return response.headers.errormessage;
        }
      }
    }

    const addMultipleMembers = async (membersList, apikey, listId) => {
      try {
        const apiregion = apikey.split('-')[1];
        mailchimp.setConfig({
          apiKey: apikey,
          server: apiregion,
        });

        const response = await mailchimp.lists.batchListMembers(listId, {
          // skip_duplicate_check: false,
          members: membersList,
          // members: memberDetails,
          update_existing: true
        });
        return response;

      }
      catch (err) {
        console.log(err)
        return err;
      }
    }

    const getApikeyFromVS1 = (erpGet, _headers) => {
      var apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/${erpGet.ERPApi}/TERPPreference?select=[PrefName]="VS1MailchimpApiKey" or [PrefName]="VS1MailchimpAudienceID"&PropertyList=PrefName,Fieldvalue`;
      const promise = new Promise(function (resolve, reject) {
        HTTP.get(apiUrl, { headers: _headers }, function (err, response) {
          const data = responseHandler(response);

          let mailchimpSettings = {
            mailchimpApiKey: '',
            mailchimpAudienceID: ''
          };

          if (err || !data) {
            reject(mailchimpSettings);
          }
          if (data) {
            for (let i = 0; i < data.terppreference.length; i++) {
              switch (data.terppreference[i].PrefName) {
                case "VS1MailchimpApiKey": mailchimpSettings.mailchimpApiKey = data.terppreference[i].Fieldvalue || mailchimpSettings.mailchimpApiKey; break;
                case "VS1MailchimpAudienceID": mailchimpSettings.mailchimpAudienceID = data.terppreference[i].Fieldvalue || mailchimpSettings.mailchimpAudienceID; break;
              }
            }
            resolve(mailchimpSettings);
          }
        });
      });
      return promise;
    }

    const getContactsFromVS1 = (erpGet, _headers, type) => {
      var apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/${erpGet.ERPApi}/TCustomerVS1?ListType=Detail`;
      switch (type) {
        case 'tcustomervs1':
          apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/${erpGet.ERPApi}/TCustomerVS1?ListType=Detail`;
          break;
        case 'temployee':
          apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/${erpGet.ERPApi}/TEmployee?ListType=Detail`;
          break;
        case 'tsuppliervs1':
          apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/${erpGet.ERPApi}/TSupplierVS1?ListType=Detail`;
          break;
        default:
          break;
      }
      const promise = new Promise(function (resolve, reject) {
        HTTP.get(apiUrl, { headers: _headers }, function (err, response) {
          const data = responseHandler(response);
          if (err || !data) {
            reject([]);
          }
          if (data) {
            const membersList = [];
            data[type].forEach(member => {
              if (member.fields.Email) {
                // let duplicated = membersList.filter(item => item.email_address.toLowerCase() === member.fields.Email.toLowerCase() && item.email_address.toLowerCase().includes("email.com"));
                // if (duplicated.length < 1) {
                let memberDetails = {
                  email_address: member.fields.Email,
                  email_type: 'html',
                  status: 'subscribed',
                  merge_fields: {
                    FNAME: member.fields.FirstName,
                    LNAME: member.fields.LastName,
                  }
                }
                membersList.push(memberDetails);
                // }
              }
            });
            resolve(membersList);
          }
        });
      });
      return promise;
    }

    const _headers = {
      database: erpGet.ERPDatabase,
      username: erpGet.ERPUsername,
      password: erpGet.ERPPassword,
    };

    let membersLists = [];
    let temp = [];
    if (customer === 'on') {
      temp = await getContactsFromVS1(erpGet, _headers, 'tcustomervs1');
      if (temp.length > 0) {
        membersLists = [...membersLists, ...temp];
      }
    }

    if (employee === 'on') {
      temp = await getContactsFromVS1(erpGet, _headers, 'temployee');
      if (temp.length > 0) {
        membersLists = [...membersLists, ...temp];
      }
    }

    if (supplier === 'on') {
      temp = await getContactsFromVS1(erpGet, _headers, 'tsuppliervs1');
      if (temp.length > 0) {
        membersLists = [...membersLists, ...temp];
      }
    }

    if (membersLists.length > 0) {
      const apiKyes = await getApikeyFromVS1(erpGet, _headers);

      const apikey = apiKyes.mailchimpApiKey;
      const listId = apiKyes.mailchimpAudienceID;

      const uniqueIds = [];

      const unique = membersLists.filter(element => {
        const isDuplicate = uniqueIds.includes(element.email_address) || element.email_address.toLowerCase().includes("email.com");

        if (!isDuplicate) {
          uniqueIds.push(element.email_address);
          return true;
        }

        return false;
      });

      addMultipleMembers(unique, apikey, listId);
    }

    return 'ok';

  },

  getCampaignOpenReports: async function (erpGet, email = '') {
    const responseHandler = (response) => {
      if (response === undefined) {
        let getResponse = "You have lost internet connection, please log out and log back in.";
        return getResponse;
      } else {
        if (response.statusCode === 200) {
          try {
            var content = JSON.parse(response.content);
            return content;
          } catch (e) { }
        } else if (response.statusCode === 401) {

        } else {
          return response.headers.errormessage;
        }
      }
    }

    const getApikeyFromVS1 = (erpGet, _headers) => {
      var apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/${erpGet.ERPApi}/TERPPreference?select=[PrefName]="VS1MailchimpApiKey" or [PrefName]="VS1MailchimpAudienceID" or [PrefName]="VS1MailchimpCampaignID"&PropertyList=PrefName,Fieldvalue`;
      const promise = new Promise(function (resolve, reject) {
        HTTP.get(apiUrl, { headers: _headers }, function (err, response) {
          const data = responseHandler(response);

          let mailchimpSettings = {
            mailchimpApiKey: '',
            mailchimpAudienceID: '',
            mailchimpCampaignID: ''
          };

          if (err || !data) {
            reject(mailchimpSettings);
          }
          if (data) {
            for (let i = 0; i < data.terppreference.length; i++) {
              switch (data.terppreference[i].PrefName) {
                case "VS1MailchimpApiKey": mailchimpSettings.mailchimpApiKey = data.terppreference[i].Fieldvalue || mailchimpSettings.mailchimpApiKey; break;
                case "VS1MailchimpAudienceID": mailchimpSettings.mailchimpAudienceID = data.terppreference[i].Fieldvalue || mailchimpSettings.mailchimpAudienceID; break;
                case "VS1MailchimpCampaignID": mailchimpSettings.mailchimpCampaignID = data.terppreference[i].Fieldvalue || mailchimpSettings.mailchimpCampaignID; break;
              }
            }
            resolve(mailchimpSettings);
          }
        });
      });
      return promise;
    }

    try {
      const _headers = {
        database: erpGet.ERPDatabase,
        username: erpGet.ERPUsername,
        password: erpGet.ERPPassword,
      };

      const apiKyes = await getApikeyFromVS1(erpGet, _headers);

      const apikey = apiKyes.mailchimpApiKey;
      // tempcode until backend add mailchimpCampaignID
      // const campaignId = 'b28d9f0a1a';
      const campaignId = apiKyes.mailchimpCampaignID;


      const apiregion = apikey.split('-')[1];
      mailchimp.setConfig({
        apiKey: apikey,
        server: apiregion,
      });

      email = email ? email : erpGet.ERPUsername;

      // this is fetching first campaign id from all campaign list
      // const campaigns = await mailchimp.campaigns.list();
      // const campaignId = campaigns.campaigns[0].id;

      let response = await mailchimp.reports.getCampaignOpenDetails(campaignId);

      // response = response.members.filter(member => member.email_address === email);
      response = response.members;

      // // tempcode this can be used if backend install crypto-js
      // const subscriber_hash = CryptoJS.MD5(email.toLowerCase());
      // const response = await client.reports.getSubscriberInfoForOpenedCampaign(
      //   campaignId,
      //   subscriber_hash
      // );

      return response;

    }
    catch (err) {
      console.log(err)
      return [];
    }

  }

  // // this is not using @mailchimp package. for reference
  // createListMember: function (email, firstname = '', lastname = '') {

  //   let data = {
  //     "email_address": email,
  //     "status": "subscribed",
  //     "merge_fields": { "FNAME": firstname, "LNAME": lastname }
  //     // "tags": [tag]
  //   };

  //   const apiregion = apikey.split('-')[1];
  //   const listAurl = 'https://' + apiregion + '.api.mailchimp.com/3.0/lists/' + listId + '/members';
  //   Meteor.call('MCApi', 'POST', listAurl, data, function (error, result) { });
  // },

  // // call mailchimp api
  // MCApi: function (method, apiUrl, data) {

  //   let options = { 'auth': 'Authorization:' + apikey };
  //   options['data'] = data || '';

  //   try {
  //     var response = HTTP.call(method, apiUrl, options).data;
  //   } catch (error) {
  //     Meteor.defer(function () {
  //       Email.send({
  //         from: data.email_address,
  //         to: 'bluestars088@gmail.com',
  //         subject: 'API Error encountered - Mailchimp',
  //         text: error
  //       });
  //     });

  //     return error;
  //   }
  // },

});
