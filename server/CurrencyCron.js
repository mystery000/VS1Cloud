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
  // console.log("Running _updateCurrencies");
  //let _currencies = [];
  // await asyncForEach(currencies, async (currency, index) => {
  //   await _updateCurrency(currency, (_currency) => {
  //     if(_currency) {
  //       //console.log("Currency updated", _currency);
  //       _currencies.push(_currency);
  //     }
  //   });
  // });

  FxApi.getAllRates('*', "AUD", 1, (result) => {
    if(result) {
      //console.log("type", typeof result);
      //result = JSON.stringify(result);
      //console.log("stirng " ,JSON.parse(JSON.stringify(result.to)));
      //console.log("currencies", currencies);
      Meteor.wrapAsync(_updateRates)(currencies, result.to, erpGet);
      // let _currencies = _updateRates(currencies, result.to);
      // callback(_currencies);
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
  if(dbCurrencies) {
    
    // for (let index = 0; index < dbCurrencies.length; index++) {
    //   await callback(array[index], index, array);
    // }

    // await asyncForEach(dbCurrencies, async (currency, index) => {
    //   const fxCurrencyRates = FxCurrencies.find((fxCurrency) => fxCurrency.quotecurrency == currency.fields.Code);
    //   if(fxCurrencyRates) {
    //     dbCurrencies[index].fields.BuyRate = fxCurrencyRates.mid;
    //     dbCurrencies[index].fields.SellRate = fxCurrencyRates.inverse;
    //   }
    // }).then(() => {
    //   callback(dbCurrencies);
    // });
    // return new Promise(function (resolve, reject) {
      dbCurrencies.forEach((dbCurrency, index) => {
        const fxCurrencyRates = FxCurrencies.find((fxCurrency) => fxCurrency.quotecurrency == dbCurrency.fields.Code);
        if(fxCurrencyRates) {
          // dbCurrencies[index].fields.BuyRate = fxCurrencyRates.mid;
          // dbCurrencies[index].fields.SellRate = fxCurrencyRates.inverse;
          dbCurrency.fields.BuyRate = fxCurrencyRates.mid;
          dbCurrency.fields.SellRate = fxCurrencyRates.inverse;
          // save funciton here
          // console.log( 'dbCurrency', dbCurrency )
          Meteor.wrapAsync(_saveCurrency)(dbCurrency, erpGet);
        }
      });
    // })
  }
  // console.log("db currencies", dbCurrencies);
  // console.log("db currencies lenght", dbCurrencies.length);
}

async function _updateCurrency(currency, callback = (currency) => {}) {
  //console.log("Updating currency", currency.fields.Code);
  // await FxApi.getExchangeRate(currency.fields.Code, "AUD", 1, (response) => {
  //   if (response) {
  //     currency.fields.BuyRate = parseFloat(response.buy);
  //     currency.fields.SellRate = parseFloat(response.sell);
  //     callback(currency);
  //   }
  // });

  await FxApi.getAllRates("*", "AUD", 1, (result) => {
    console.log('result', result);
  });


  callback()
}

/**
 * This functions will save one currency
 * @param {*} currency
 */
async function _saveCurrency(currency, erpGet) {
  console.log('Saving currency: ', currency.fields.Code, " BuyRate: ", currency.fields.BuyRate , " SellRate: ", currency.fields.SellRate);
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
      } else {
        console.log(result);
      }
    }
  );
}

/**
 * This functions will save all currencies
 * @param {*} currencies
 * @param {*} erpGet
 */
async function _saveCurrencies(currencies = [], erpGet) {
  console.log("Running _saveCurrencies");
 
  // console.log("saving currency: ", currencies.length);

  /**
   * 1st way to save currencies. We save one per one
   * This method should be avoided
   */
  if (currencies) {
    console.log("Currencies to be saved: ", currencies.length);
    // console.log(currencies);
    //console.log("Currency: ", currencies[0].fields.Code);

    await asyncForEach(currencies, async (currency, index) => {
      if(currencies[index]) {
        //console.log("Saving currency", currency.fields.Code);
        await _saveCurrency(currency, erpGet);
      }
    });
  }

  /**
   * We should save everything in one single request.
   */
}

const cronRun = (cronSetting, erpGet, cb) => {
  console.log('running cron fuctions');
  // _getCurrencies(erpGet, (error, response) => {
  //   if (error) {
  //     console.log("error", error);
  //   } else if (response.data) {
  //     _updateCurrencies(response.data.tcurrency, (currencies) => {
      
  //       if (currencies) {
  //         console.log("Time to save currencies", currencies.length);
  //         _saveCurrencies(currencies, erpGet);
  //       }
  //     });
  //   }
  // });
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
    try {
      let response = Meteor.wrapAsync(_getCurrencies)( erpGet );
      if (response.data) {
        Meteor.wrapAsync(_updateCurrencies)(response.data.tcurrency, erpGet);
        // console.log('currencies', currencies)
        // _updateCurrencies(response.data.tcurrency, (currencies) => {
        
        //     if (currencies) {
        //       console.log("Time to save currencies", currencies.length);
        //       _saveCurrencies(currencies, erpGet);
        //     }
        //   });
      }
    } catch (error) {
      console.log('error', error)
    }
    // return Meteor.wrapAsync(cronRun)(cronSetting, erpGet);

    // cronRun(cronSetting, erpGet, (error, result) => {});
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
