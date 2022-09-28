import {TaxRateService} from "../settings-service";

class FxApi {
  static ApiID = "zuusoft547505136";
  static ApiKey = "jkupm6cmhafko2jm7hbodgonur";
  static encodedApiKey =  "eXl5dXV1dXV1eXV5dXl1eTU0ODg0MDU4NzozMXNldXFrMTRkdGZyczZjc2FzbWIzanIyMQ==";

  constructor() {}

  /**
     *
     * @param {String} to
     * @param {String} from
     * @param {float} amount
     * @returns {Promise<{buy: float, sell: float}>}
     */
  async getExchangeRate(to = "EUR", from = "AUD", amount = 1) {
    try {
      const response = await fetch(`https://xecdapi.xe.com/v1/convert_to.json/?to=${to}&from=${from}&amount=${amount}&inverse=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + FxApi.encodedApiKey
        }
      });

      if (response.status >= 200 && response.status <= 302) {
        let data = await response.json();

        const buyRate = data.from[0].mid;
        const sellRate = data.from[0].inverse;

        return {buy: buyRate, sell: sellRate};
      } else {
        return {buy: 1, sell: 1};
      }
    } catch (e) {}
  }

  /**
     * This function should return the buy rate
     */
  async getBuyRate(to = "EUR", from = "AUD") {
    const response = await fetch(`https://xecdapi.xe.com/v1/convert_to.json/?to=${to}&from=${from}&amount=1&inverse=false`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + FxApi.encodedApiKey
      }
    });

    if (response.status >= 200 && response.status <= 302) {
      let data = await response.json();
      const rate = data.from[0].mid;
      return rate;
    }
  }

  async getSellRate(to = "EUR", from = "AUD") {
    const response = await fetch(`https://xecdapi.xe.com/v1/convert_to.json/?to=${to}&from=${from}&amount=1&inverse=true`, {
      // Authorization: `${FxApi.ApiID}:${FxApi.ApiKey}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + FxApi.encodedApiKey
      }
    });

    if (response.status >= 200 && response.status <= 302) {
      let data = await response.json();

      const rate = data.from[0].inverse;

      return rate;
    }
  }

  async getAllRates({
    to = "*",
    from = "AUD",
    amount = 1,
    callback = result => {}
  }) {
    const response = await fetch(`https://xecdapi.xe.com/v1/convert_from.json/?to=${to}&from=${from}&amount=${amount}&inverse=true`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + FxApi.encodedApiKey
      }
    });

    if (response.status == 200) {
      const data = await response.json();
      callback(data);
      return data;
    } else {
      callback(null);
      return null;
    }
  }

  findBuyRate(from = "AUD", xelist = [], onNull = 1.23) {
    let rate = xelist.find(xeCurrency => xeCurrency.quotecurrency == from);
    return rate
      ? rate.mid
      : onNull;
  }

  findSellRate(from = "AUD", xelist = [], onNull = 1.23) {
    let rate = xelist.find(xeCurrency => xeCurrency.quotecurrency == from);
    return rate
      ? rate.inverse
      : onNull;
  }

  async saveCurrencies(currencies, callback = (response = null, error = null) => {}) {
    let taxRateService = new TaxRateService();

    try {
      const response = await taxRateService.saveCurrencies({
        type: "TCurrency",
        objects: currencies
      });

      callback(response);
    } catch (error) {
      callback(null, error);
    }
  }
}

export default FxApi = new FxApi();