export default class FxApi {
  static ApiID = "webinfy166640657";
  static ApiKey = "peorsc7t96poaf2k8t1segj0u2";
  static encodedApiKey =
    "dXNldHdvMjY0MDk4ODI1OmM5bm42YjZoaHQxbmZlZ2hhZDVnbjNmZGVz";

  constructor() {
    console.log("Fx Api Loaded");
  }

  async getExchangeRate(to = "EUR", from = "AUD", amount = 1) {
    try {
      const response = await fetch(
        `https://xecdapi.xe.com/v1/convert_to.json/?to=${to}&from=${from}&amount=${amount}&inverse=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + FxApi.encodedApiKey,
          },
        }
      );

      if (response.status >= 200 && response.status <= 302) {
        let data = await response.json();

        const buyRate = data.from[0].mid;
        const sellRate = data.from[0].inverse;

        return {
          buy: buyRate,
          sell: sellRate,
        };
      } else {
        return {
          buy: 1,
          sell: 1,
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * This function should return the buy rate
   */
  async getBuyRate(to = "EUR", from = "AUD") {
    const response = await fetch(
      `https://xecdapi.xe.com/v1/convert_to.json/?to=${to}&from=${from}&amount=1&inverse=false`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + FxApi.encodedApiKey,
        },
      }
    );

    if (response.status >= 200 && response.status <= 302) {
      let data = await response.json();
      const rate = data.from[0].mid;
      return rate;
    }
  }

  async getSellRate(to = "EUR", from = "AUD") {
    const response = await fetch(
      `https://xecdapi.xe.com/v1/convert_to.json/?to=${to}&from=${from}&amount=1&inverse=true`,
      {
        // Authorization: `${FxApi.ApiID}:${FxApi.ApiKey}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + FxApi.encodedApiKey,
        },
      }
    );

    if (response.status >= 200 && response.status <= 302) {
      let data = await response.json();

      const rate = data.from[0].inverse;

      return rate;
    }
  }
}
