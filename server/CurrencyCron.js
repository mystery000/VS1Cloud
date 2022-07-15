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

  FutureTasks.find().forEach(function (setting) {
    if (setting.startAt < currentDate) {
      Meteor.call("addCurrencyCron", setting);
    } else {
      Meteor.call("scheduleCron", setting);
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
        console.log("_getCurrencies", "error");
        // console.log("error", error);
        cb(error, null);
      } else {
        console.log("_getCurrencies", "success");
        cb(null, result);
        // console.log("result",result);
      }
    });
  } catch(e) {
    console.log(e);
  }
}

async function _updateCurrencies(currencies, cb = (currencies) => {}) {
  console.log("Running _updateCurrencies");
  await asyncForEach(currencies, async (currency, index) => {
   
    currencies[index] = await _updateCurrency(currency);
  });
  cb(currencies);
  return currencies;
}

async function _updateCurrency(currency) {
  console.log("Updating currency", currency.fields.Code);
  const response = await FxApi.getExchangeRate(currency.fields.Code);
  if(response) {
    currency.fields.BuyRate = response.buy;
    currency.fields.SellRate = response.sell;
    return currency;
  }
}

const cronRun = (cronSetting, erpGet, cb) => {
  _getCurrencies(erpGet, (error, response) => {
    if(error) {
      console.log("error", error);
    } else if(response.data) {
      _updateCurrencies(response.data.tcurrency, (currencies) => {
        console.log("Time to save currencies");
      });
    }
  });
};

Meteor.methods({
  /**
   * This function is going to simply hit the client side URL
   * It will hit the URL but wont work since the client side has be done.
   */
  updateCurrenciesFromClient: (cronSetting, erpGet) => {
    const apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/erpapi/TCurrency?ListType=Detail`;
    const _headers = {
      database: erpGet.ERPDatabase,
      username: erpGet.ERPUsername,
      password: erpGet.ERPPassword,
      // url: apiUrl,
    };

    /**
     * Here we GET all tCurrency of the currency user
     */
    Meteor.http.call(
      "POST",
      "http://localhost:7000/cron/currency-update/" + cronSetting.employeeId,
      {
        headers: _headers,
        body: {
          cronSetting: cronSetting,
          //url: apiUrl,
        },
      },
      (error, result) => {
        if (error) {
          console.log("error");
        } else {
          console.log("result");
          console.log(result);
        }
      }
    );
  },
  // /**
  //  * Here we load only currencies
  //  * @param {CronSetting} cronSetting
  //  * @param {Object} erpGet
  //  * @param {CallableFunction} cb
  //  */
  // getCurrencies: (cronSetting, erpGet, cb) => {
  //   console.log("Running cron job for user: " + cronSetting.employeeId);
  //   const apiUrl = `https://${erpGet.ERPIPAddress}:${erpGet.ERPPort}/erpapi/TCurrency?ListType=Detail`;
  //   /* My only fear is how do you pass the header details to this form? */
  //   /* Not diffuclt if you pass it from client to this place */
  //   const _headers = {
  //     database: erpGet.ERPDatabase,
  //     username: erpGet.ERPUsername,
  //     password: erpGet.ERPPassword,
  //     // "Access-Control-Allow-Origin": "*"
  //   };

  //   /**
  //    * Here we GET all tCurrency of the currency user
  //    */
  //   Meteor.http.call(
  //     "GET",
  //     apiUrl,
  //     { headers: _headers },
  //     (error, result) => {
  //       if (error) {
  //         console.log("error");
  //         cb(error, null);
  //       } else {
  //         console.log("result");
  //         // console.log(result);
  //         cb(null, result);
  //       }
  //     }
  //   );
  // },

  // /**
  //  *
  //  * @param {Object} currencies
  //  * @param {CallableFunction} onFinishedCallback
  //  */
  // updateCurrencies: async (currencies, onFinishedCallback = (currencies) => {}) => {
  //   /**
  //    * First we update the list of currencies
  //    */
  //   await asyncForEach(currencies, async (currency, index) => {
  //     console.log("currency", index, currency.fields.Code);
  //     //currencies[index] = await Meteor.call("updateCurrency", currency);
  //   });
  //   await onFinishedCallback(currencies);
  // },
  // updateCurrency: async (currency) => {
  //   console.log("updating currency", currency.fields.Code);
  //   /**
  //    * We need to make an API call to get the object
  //    */
  //   const response = await FxApi.getExchangeRate(
  //     currency.fields.Code,
  //     "AUD",
  //     1
  //   );

  //   currency.fields.BuyRate = response.buy;
  //   currency.fields.SellRate = response.sell;

  //   return currency;

  //   // return currency;
  // },
  // saveCurrencies: async (currencies = [], erpGet) => {
  //   let apiUrl =
  //     "https://" +
  //     erpGet.ERPIPAddress +
  //     ":" +
  //     erpGet.ERPPort +
  //     "/erpapi/TCurrency?ListType=Detail";

  //   let postHeaders = {
  //     database: erpGet.ERPDatabase,
  //     username: erpGet.ERPUsername,
  //     password: erpGet.ERPPassword,
  //     // "Access-Control-Allow-Origin": "*"
  //   };

  //   // console.log("saving currency: ", currencies.length);

  //   /**
  //    * Here we will save ht big object list
  //    */
  //   Meteor.http.call(
  //     "POST",
  //     apiUrl,
  //     {
  //       data: currencies,
  //       headers: postHeaders,
  //     },
  //     (error, result) => {
  //       if (error) {
  //       } else {
  //         console.log(result);
  //       }
  //     }
  //   );
  // },
  /**
   * This functions is going to run when the cron is running
   * @param {*} cronSetting
   */
  runCron: async (cronSetting, erpGet) => {
    // await fetch("/cron/currency-update/" + cronSetting.employeeId);
    // We are testing with get request only but we need post request here
    // let app_url="https://sandboxdb.vs1cloud.com:4434/erpapi/TCurrency?ListType=Detail";
    // return await Meteor.http.call("GET", app_url, {
    //   headers: {
    //     "content-type":"application/json",
    //     "Accept":"application/json"
    //   },
    // });

    // /**
    //  * now we need to loop and update each objects
    //  */
    // Meteor.call("getCurrencies", cronSetting, erpGet, function (error, result) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log(result);
    //     console.log("get currencies success");

    //   }
    // });

    cronRun(cronSetting, erpGet, (error, result) => {});
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
        return parser.text("every 2 minutes");
      },
      job: () => {
        // console.log(cronSetting.employeeId);
        Meteor.call("runCron", cronSetting, erpGet, function (error, results) {
          // console.log(results, error); //results.data should be a JSON object
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
