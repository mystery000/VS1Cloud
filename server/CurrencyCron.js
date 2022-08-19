import { Meteor, fetch } from "meteor/meteor";
import CronSetting from "./Currency/CronSetting";
import FxApi from "./Currency/FxApi";
FutureTasks = new Meteor.Collection("cron-jobs");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

Meteor.startup(() => {
  const currentDate = new Date();


  // /**
  //  * We first need to find saved crons
  //  */
  // FutureTasks.find().forEach(function (setting) {

  //   // then we compare the dates,
  //   if (setting.startAt < currentDate) {
  //     // we came to the day when we have to add the cron job to start starting from now
  //     Meteor.call("addCurrencyCron", setting);
  //   } else {
  //     // we havent came to the execution date, so we'll be scheduling it again
  //     Meteor.call("scheduleCron", setting);
  //   }
  // });
  // SyncedCron.start();



  /**
   * step 1 : We need to get the list of schedules
   * The future stasks
   */
  let futureCrons = FutureTasks.find() || [];

  

  /**
   * Step 2 : We need to check if their date is reached
   * if reached then run add the cron
   * else do nohing
   */

   futureCrons.forEach(function (setting) {
    // then we compare the dates,
    if (setting.startAt < currentDate) {
      // we came to the day when we have to add the cron job to start starting from now
      Meteor.call("addCurrencyCron", setting);
    } else {
      // we havent came to the execution date, so we'll be scheduling it again
      Meteor.call("scheduleCron", setting);
    }
  });

  /**
   * Step 3: Start
   */
  SyncedCron.start();
});

async function _getCurrencies(erpGet, cb = (error, result) => {}) {
  const apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/erpapi/TCurrency?ListType=Detail`;
  const _headers = {
    database: erpGet.ERPDatabase,
    username: erpGet.ERPUsername,
    password: erpGet.ERPPassword,
    // url: apiUrl,
  };

  try {
    /**
     * Here we GET all tCurrency of the currency user
     */
    Meteor.http.call("GET", apiUrl, { headers: _headers }, (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    });
  } catch (error) {
    cb(error, null);
  }
}

async function _updateCurrencies(currencies = [], erpGet, callback = (currencies = []) => {}) {
  FxApi.getAllRates('*', "AUD", 1, (result) => {
    if(result) {
      Meteor.wrapAsync(_updateRates)(currencies, result.to, erpGet);
    }
  });
}

/**
 * This function will simply update rates from db
 * with one call API to FX
 *
 * @param {*} dbCurrencies
 * @param {*} FxCurrencies
 * @returns
 */
function _updateRates(dbCurrencies = [], FxCurrencies = [], erpGet, callback = (currencies = []) => {}) {
  let _currencies = [];
  if(dbCurrencies) {


      dbCurrencies.forEach((dbCurrency, index) => {
        const fxCurrencyRates = FxCurrencies.find((fxCurrency) => fxCurrency.quotecurrency == dbCurrency.fields.Code);

        if(fxCurrencyRates) {
          dbCurrency.fields.BuyRate = fxCurrencyRates.mid;
          dbCurrency.fields.SellRate = fxCurrencyRates.inverse;
          _currencies.push(dbCurrency);
        }
      });


      Meteor.wrapAsync(_saveCurrency)({
        type: "TCurrency",
        objects: _currencies
      }, erpGet, (error, result) => {
        if(error) {
         
        } else {
         
        }
      });
  }

}

/**
 * This functions will save one currency
 * @param {*} currency
 */
async function _saveCurrency(currency, erpGet, cb = (error, result) => {}) {
  const apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/erpapi/TCurrency`;
  const _headers = {
    database: erpGet.ERPDatabase,
    username: erpGet.ERPUsername,
    password: erpGet.ERPPassword,
    // url: apiUrl,
  };

  /**
   * Here we will save ht big object list
   */
  Meteor.http.call(
    "POST",
    apiUrl,
    {
      data: currency,
      headers: _headers,
    },
    (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
}


Meteor.methods({
  /**
   * This functions is going to run when the cron is running
   * @param {*} cronSetting
   */
  runCron: async (cronSetting, erpGet) => {

    try {
      let response = Meteor.wrapAsync(_getCurrencies)( erpGet );
      if (response.data) {
        Meteor.wrapAsync(_updateCurrencies)(response.data.tcurrency, erpGet);
      }
    } catch (error) {
    }

  },
  /**
   * This function will just add the cron job
   *
   * @param {Object} cronSetting
   * @returns
   */
  addCurrencyCron: (cronSetting, erpGet) => {
    const cronId = `currency-update-cron_${cronSetting.id}_${cronSetting.employeeId}`;
    SyncedCron.remove(cronId);

    return SyncedCron.add({
      name: cronId,
      schedule: function (parser) {
       
       const parsed = parser.text(cronSetting.toParse);
        // const parsed = parser.text("every 2 minutes");
        return parsed;
  
      },
      job: () => {
        Meteor.call("runCron", cronSetting, erpGet, function (error, results) {
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
  },
});
