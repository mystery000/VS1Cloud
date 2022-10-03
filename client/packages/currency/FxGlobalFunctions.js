import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import LoadingOverlay from "../../LoadingOverlay";
import {TaxRateService} from "../../settings/settings-service";

export default class FxGlobalFunctions {
  /**
     *
     * Call this in the onCreated method of blaze template
     *
     * @param {BlazeTemplate} templateObject
     */
  static initVars(templateObject) {
    templateObject.currencyList = new ReactiveVar([]);
    templateObject.activeCurrencyList = new ReactiveVar([]);
    templateObject.tcurrencyratehistory = new ReactiveVar([]);
  }

  static async loadDefaultCurrencyForReport(defaultCurrencyCode = "AUD") {
    $("#sltCurrency").attr("disabled", true);
    $(".exchange-rate-js").attr("disabled", true);
    $("#exchange_rate").attr("disabled", true);
    const currency = await FxGlobalFunctions.loadDefaultCurrency(defaultCurrencyCode);
    const currencyCode = currency.Code;
    const currencySymbol = currency.CurrencySymbol || "$";
    const currencyRate = (
      $(".currency-js").attr("type") == "buy"
      ? currency.BuyRate
      : currency.SellRate) || 1; // We can make this dynamic
    if( $("#sltCurrency").val() == "" ){
      $("#sltCurrency").val(currencyCode);
      $("#sltCurrency").attr("currency-symbol", currencySymbol);
      $("#exchange_rate").val(currencyRate);      
      $(".exchange-rate-js").val(currencyRate);
    }
    $("#sltCurrency").attr("disabled", false);
    $(".exchange-rate-js").attr("disabled", false);
  }

  static async loadDefaultCurrency(defaultCurrencyCode = "AUD") {
    let data = await CachedHttp.get(erpObject.TCurrency, async () => {
      return await new TaxRateService().getCurrencies();
    }, {
      usIndexDb: true,
      useLocalStorage: false,
      fallBackToLocal: true,
      validate: cachedResponse => {
        return false;
      }
    });

    data = data.response.tcurrency;
    return data.find(currency => currency.Code == defaultCurrencyCode);
  }

  /**
     *
     */
  static async loadCurrency(ui, defaultCurrencyCode) {
    let taxRateService = new TaxRateService();

    //let ui = Template.instance();

    if ((await ui.currencyList.get().length) == 0) {
      LoadingOverlay.show();

      const result = await taxRateService.getCurrencies();

      let currencies = result.tcurrency.map(currency => {
        return {
          ...currency,
          id: currency.Id || "",
          code: currency.Code || "-",
          currency: currency.Currency || "NA",
          symbol: currency.CurrencySymbol || "NA",
          buyrate: currency.BuyRate || "-",
          sellrate: currency.SellRate || "-",
          country: currency.Country || "NA",
          description: currency.CurrencyDesc || "-",
          ratelastmodified: currency.RateLastModified || "-",
          active: currency.Code == defaultCurrencyCode
            ? true
            : false
        };
      });

      currencies = currencies.sort((a, b) => {
        return a.currency.split("")[0].toLowerCase().localeCompare(b.currency.split("")[0].toLowerCase());
      });

      ui.currencyList.set(currencies);

      //   await loadCurrencyHistory(ui);
      await this.loadCurrencyHistory(ui);
      LoadingOverlay.hide();
      //});
    }
  }

  static async loadCurrencyHistory(ui) {
    let taxRateService = new TaxRateService();
    let result = await taxRateService.getCurrencyHistory();
    const data = result.tcurrencyratehistory;
    ui.tcurrencyratehistory.set(data);
    LoadingOverlay.hide();
  }

  static handleChangedCurrency(currency = "AUD", defaultCurrencyCode) {
    if(currency != defaultCurrencyCode) {
      $("#sltCurrency").trigger('change');
    }
  }

  /**
   * 
   * This will all events of Fx Module
   * 
   * @returns 
   */
  static getEvents() {
    return {
      "click .fx-rate-btn": async (e, ui) => {
        await FxGlobalFunctions.loadCurrency(ui, CountryAbbr);
      },
    }
  }
}