import "../../../lib/global/indexdbstorage.js";

let defaultCurrencyCode = CountryAbbr; // global variable "AUD"

Template.FxRateModal.onCreated(function () {
  const templateObject = Template.instance();
});

Template.FxRateModal.onRendered(function () {
  console.log("Fx Rate Modal");
  let templateObject = Template.instance();
});

Template.FxRateModal.events({});

Template.FxRateModal.helpers({
  isDefaultCurrency: (currencyData) => {
    //console.log(currencyData);
    return currencyData.code == defaultCurrencyCode
      ? "hidden"
      : "";
  },
});
