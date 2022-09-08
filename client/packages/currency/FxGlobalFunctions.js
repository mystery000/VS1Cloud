import LoadingOverlay from "../../LoadingOverlay";
import {TaxRateService} from "../../settings/settings-service";

export default class FxGlobalFunctions {
  /**
     *
     */
  static async loadCurrency(ui, defaultCurrencyCode) {
    let taxRateService = new TaxRateService();

    //let ui = Template.instance();

    if ((await ui.currencyList.get().length) == 0) {
      LoadingOverlay.show();

      let _currencyList = [];
      const result = await taxRateService.getCurrencies();

      //taxRateService.getCurrencies().then((result) => {

      const data = result.tcurrency;

      for (let i = 0; i < data.length; i++) {
        // let taxRate = (data.tcurrency[i].fields.Rate * 100).toFixed(2) + '%';
        var dataList = {
          id: data[i].Id || "",
          code: data[i].Code || "-",
          currency: data[i].Currency || "NA",
          symbol: data[i].CurrencySymbol || "NA",
          buyrate: data[i].BuyRate || "-",
          sellrate: data[i].SellRate || "-",
          country: data[i].Country || "NA",
          description: data[i].CurrencyDesc || "-",
          ratelastmodified: data[i].RateLastModified || "-",
          active: data[i].Code == defaultCurrencyCode
            ? true
            : false // By default if AUD then true
            //active: false,
            // createdAt: new Date(data[i].MsTimeStamp) || "-",
            // formatedCreatedAt: formatDateToString(new Date(data[i].MsTimeStamp))
        };

        _currencyList.push(dataList);
        //}
      }
      _currencyList = _currencyList.sort((a, b) => {
        return a.currency.split("")[0].toLowerCase().localeCompare(b.currency.split("")[0].toLowerCase());
      });

      ui.currencyList.set(_currencyList);

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
}