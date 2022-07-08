Meteor.startup(() => {
  console.log("Currency Cron started");
  const currentDate = new Date();

  /**
   * step 1 : We need to get the list of schedules
   * The future stasks
   */

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
});
