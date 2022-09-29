import { Meteor } from "meteor/meteor";

class FxApi {
  static ApiID = "zuusoft547505136";
  static ApiKey = "jkupm6cmhafko2jm7hbodgonur";
  static encodedApiKey =
    "eXl5dXV1dXV1eXV5dXl1eTU0ODg0MDU4NzozMXNldXFrMTRkdGZyczZjc2FzbWIzanIyMQ==";

  constructor() {}

  /**
   *
   * @param {String} to
   * @param {String} from
   * @param {float} amount
   * @returns {Promise<{buy: float, sell: float}>}
   */
  async getExchangeRate(
    to = "EUR",
    from = "AUD",
    amount = 1,
    callback = (response) => {}
  ) {
    // const response = await fetch(`https://xecdapi.xe.com/v1/convert_to.json/?to=${to}&from=${from}&amount=${amount}&inverse=true`, {
    //   // data: postData,
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Basic " + FxApi.encodedApiKey,
    //   },
    // });

    // if (response.status >= 200 && response.status <= 302) {
    //   let data = await response.json();

    //   const buyRate = data.from[0].mid;
    //   const sellRate = data.from[0].inverse;

    //   callback({
    //     buy: buyRate,
    //     sell: sellRate,
    //   });
    // } else {
    //   callback({
    //     buy: 1.21,
    //     sell: 1.19,
    //   });
    // }

    Meteor.http.get(
      `https://xecdapi.xe.com/v1/convert_to.json/?to=${to}&from=${from}&amount=${amount}&inverse=true`,
      {
        // data: postData,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + FxApi.encodedApiKey,
        },
      },
      (error, response) => {
        if (error) {
          callback({
            buy: 1.21,
            sell: 1.19,
          });
        } else {
          if (response.status >= 200 && response.status <= 302) {
            let data = response.data;

            const buyRate = data.from[0].mid;
            const sellRate = data.from[0].inverse;

            callback({
              buy: buyRate,
              sell: sellRate,
            });
          } else {
            callback({
              buy: 1.21,
              sell: 1.19,
            });
          }
        }
      }
    );
  }

  async getAllRates(
    to = "*",
    from = "AUD",
    amount = 1,
    callback = (result) => {}
  ) {
    Meteor.http.get(
      `https://xecdapi.xe.com/v1/convert_from.json/?to=${to}&from=${from}&amount=${amount}&inverse=true`,
      {
        // data: postData,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + FxApi.encodedApiKey,
        },
      },
      (error, response) => {
        if (error) {
          callback(null);
        } else {
          if (response.data.to) {
            let data = response.data;

            callback(data);
            return data;
          } else {
            callback(null);
          }
          return null;
        }
      }
    );
  }

  getRate(currency = "AUD", rateList = []) {
    let _rate = 0;

    rateList.forEach((rate, index) => {
      if (index == currency) {
        _rate = rate;
      }
    });

    return _rate;
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

export default FxApi = new FxApi();
