import { Meteor } from 'meteor/meteor'
FutureTasks = new Meteor.Collection('cron-jobs');


Meteor.startup(() => {
  const currentDate = new Date();

  FutureTasks.find().forEach(function(setting) {
    if (setting.startAt < currentDate) {
      Meteor.call('addCurrencyCron', setting);
    } else {
      Meteor.call('scheduleCron', setting);
    }
  });
  SyncedCron.start();
  /**
   * step 1 : We need to get the list of schedules
   * The future stasks
   */
  let futureCrons = [];


  /**
   * Step 2 : We need to check if their date is reached
   * if reached then run add the cron
   * else do nohing
   */

  /**
   * Step 3: Start
   */
  SyncedCron.start();
});

Meteor.methods({
  /**
   * This functions is going to run when the cron is running
   * @param {*} cronSetting
   */
   runCron: async (cronSetting, erpGet) => {
    console.log("Running cron job for user: " + cronSetting.employeeId);
    // await fetch("/cron/currency-update/" + cronSetting.employeeId);
    // We are testing with get request only but we need post request here
    // let app_url="https://sandboxdb.vs1cloud.com:4434/erpapi/TCurrency?ListType=Detail";
    // return await Meteor.http.call("GET", app_url, {
    //   headers: {
    //     "content-type":"application/json",
    //     "Accept":"application/json"
    //   },
    // });
    let apiUrl = 'https://' + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/erpapi/TCurrency?ListType=Detail';
    console.log(apiUrl);
    console.log("Running cron job for user: " + cronSetting.employeeId);
    /* My only fear is how do you pass the header details to this form? */
    /* Not diffuclt if you pass it from client to this place */
    let postHeaders = {
      "database": erpGet.ERPDatabase,
      "username": erpGet.ERPUsername,
      "password": erpGet.ERPPassword
      // "Access-Control-Allow-Origin": "*"
    };

    Meteor.http.call("GET", apiUrl, {
        // data: postData,
        headers: postHeaders,
    }, (error, result) => {
        if (error) {

        } else {
            console.log(result);
        }
    });

  },
  /**
   * This function will just add the cron job
   *
   * @param {Object} cronSetting
   * @returns
   */
  addCurrencyCron: (cronSetting,erpGet) => {
    const cronId = `currency-update-cron_${cronSetting.id}_${cronSetting.employeeId}`;
    SyncedCron.remove(cronId);

    return SyncedCron.add({
      name: cronId,
      schedule: function (parser) {
        const parsed = parser.text(cronSetting.toParse);
        return parser.text('every 2 minutes');;
      },
      job: () => {
        console.log(cronSetting.employeeId);
        Meteor.call("runCron", cronSetting, erpGet,  function(error, results) {
          console.log(results, error); //results.data should be a JSON object
        });
      },
    });
  },
  /**
   * This function will shcedule the cron job if the date is different from today (future date)
   *
   * @param {Object} cronSetting
   */
  scheduleCron: (cronSetting) => {
    FutureTasks.insert(cronSetting);
  }
});
