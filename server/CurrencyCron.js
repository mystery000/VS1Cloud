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
  let cronList = [];

  console.log('CronJobs: ', cronList.length);

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
        cronSetting.cronJob();
      },
    });
  },
  scheduleCron: (cronSetting) => {
    console.log("Scheduling cron");
    FutureTasks.insert(cronSetting);
  }
});
