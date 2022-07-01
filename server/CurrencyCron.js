
Meteor.startup(() => {
  console.log("Currency Cron started");


  SyncedCron.start();
});

Meteor.methods({
  addCurrencyCron: (cronSetting) => {
    const cronId = `currency-update-cron_${cronSetting.id}_${cronSetting.employeId}`;
    if (cronSetting.active) {
      SyncedCron.remove(cronId);
    }

    SyncedCron.add({
      name: cronId,
      schedule: function (parser) {
        return parser.text(cronSetting.toParse);
      },
      job: () =>  cronSetting.cronJob,
    });
  },
});
