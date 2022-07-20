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
          // dbCurrencies[index].fields.BuyRate = fxCurrencyRates.mid;
          // dbCurrencies[index].fields.SellRate = fxCurrencyRates.inverse;
          dbCurrency.fields.BuyRate = fxCurrencyRates.mid;
          dbCurrency.fields.SellRate = fxCurrencyRates.inverse;
          // save funciton here
         
          _currencies.push(dbCurrency);
        
        }
      });

      //console.log(_currencies);
      Meteor.wrapAsync(_saveCurrency)({
        type: "TCurrency",
        objects: _currencies
      }, erpGet);
  }
  
}

/**
 * This functions will save one currency
 * @param {*} currency
 */
async function _saveCurrency(currency, erpGet) {
  //console.log('Saving currency: ', currency.fields.Code, " BuyRate: ", currency.fields.BuyRate , " SellRate: ", currency.fields.SellRate);
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
        console.log("Error: ", error);
      } else {
        console.log("Result: ", result);
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
      console.log('error', error)
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
