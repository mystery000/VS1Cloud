import { Meteor } from 'meteor/meteor'
FutureTasks = new Meteor.Collection('cron-jobs');



Meteor.startup(() => {
  console.log("Currency Cron started");
  const currentDate = new Date();

  FutureTasks.find().forEach(function(setting) {
    console.log("setting", setting);
    // console.log(mail)
    // console.log(mail.date);
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

  console.log('CronJobs: ', futureCrons.length);

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
   runCron: async (cronSetting) => {
    console.log("Running cron job for user: " + cronSetting.employeeId);
    // await fetch("/cron/currency-update/" + cronSetting.employeeId);
    // We are testing with get request only but we need post request here
    let app_url="https://sandboxdb.vs1cloud.com:4434/erpapi/TCurrency?ListType=Detail";
    return await Meteor.http.call("GET", app_url, {
      headers: {
        "content-type":"application/json",
        "Accept":"application/json"
      },
    });
  },
  /**
   * This function will just add the cron job
   * 
   * @param {Object} cronSetting 
   * @returns 
   */
  addCurrencyCron: (cronSetting) => {
    console.log("Adding cron");
    const cronId = `currency-update-cron_${cronSetting.id}_${cronSetting.employeeId}`;
    SyncedCron.remove(cronId);

    return SyncedCron.add({
      name: cronId,
      schedule: function (parser) {
        const parsed = parser.text(cronSetting.toParse);
        console.log(parsed);
        return parsed;
      },
      job: () => {
        console.log(cronSetting.employeeId);
        Meteor.call("runCron", cronSetting,  function(error, results) {
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
    console.log("Scheduling cron");
    FutureTasks.insert(cronSetting);
  }
});
