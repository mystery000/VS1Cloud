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
  runCron: async (cronSetting) => {
    await fetch("/cron/currency-update/" + cronSetting.employeeId);
  },
  /**
   * This function will just add the cron job
   *
   * @param {Object} cronSetting
   * @returns
   */
  addCurrencyCron: (cronSetting) => {
    const cronId = `currency-update-cron_${cronSetting.id}_${cronSetting.employeeId}`;
    SyncedCron.remove(cronId);

    return SyncedCron.add({
      name: cronId,
      schedule: function (parser) {
        const parsed = parser.text(cronSetting.toParse);
        return parsed;
      },
      job: () => {
        Meteor.call('runCron', cronSetting);
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
