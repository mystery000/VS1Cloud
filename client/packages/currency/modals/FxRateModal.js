import "../../../lib/global/indexdbstorage.js";
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './FxRateModal.html';

let defaultCurrencyCode = CountryAbbr; // global variable "AUD"

Template.FxRateModal.onCreated(function () {
  const templateObject = Template.instance();
});

Template.FxRateModal.onRendered(function () {
  let templateObject = Template.instance();
});

Template.FxRateModal.events({});

Template.FxRateModal.helpers({
  isDefaultCurrency: (currencyData) => {
    return currencyData.code == defaultCurrencyCode? "hidden": "";
  },
});
