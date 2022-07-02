Meteor.startup(() => {
  console.log("Currency Cron started");

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
