import LoadingOverlay from "../../LoadingOverlay";


export default class GlobalReportListeners {
  static getFxListeners(defaultCurrencyCode) {
    return {
      // CURRENCY MODULE
      "click .fx-rate-btn": async e => {
        await loadCurrency();
        //loadCurrencyHistory();
      },
      "click .currency-modal-save": (e, templateObject) => {
        //$(e.currentTarget).parentsUntil(".modal").modal("hide");
        LoadingOverlay.show();

        // Get all currency list
        let _currencyList = templateObject.currencyList.get();

        // Get all selected currencies
        const currencySelected = $(".currency-selector-js:checked");
        let _currencySelectedList = [];
        if (currencySelected.length > 0) {
          $.each(currencySelected, (index, e) => {
            const sellRate = $(e).attr("sell-rate");
            const buyRate = $(e).attr("buy-rate");
            const currencyCode = $(e).attr("currency");
            const currencyId = $(e).attr("currency-id");
            let _currency = _currencyList.find(c => c.id == currencyId);
            _currency.active = true;
            _currencySelectedList.push(_currency);
          });
        } else {
          let _currency = _currencyList.find(c => c.code == defaultCurrencyCode);
          _currency.active = true;
          _currencySelectedList.push(_currency);
        }

        _currencyList.forEach((value, index) => {
          if (_currencySelectedList.some(c => c.id == _currencyList[index].id)) {
            _currencyList[index].active = _currencySelectedList.find(c => c.id == _currencyList[index].id).active;
          } else {
            _currencyList[index].active = false;
          }
        });

        _currencyList = _currencyList.sort((a, b) => {
          if (a.code == defaultCurrencyCode) {
            return -1;
          }
          return 1;
        });

        // templateObject.activeCurrencyList.set(_activeCurrencyList);
        templateObject.currencyList.set(_currencyList);

        LoadingOverlay.hide();
      }
    };
  }
}