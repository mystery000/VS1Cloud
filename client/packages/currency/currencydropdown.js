import { TaxRateService } from "../../settings/settings-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../js/sidebar-service";
import "../../lib/global/indexdbstorage.js";
import FxGlobalFunctions from "./FxGlobalFunctions";
import { Template } from 'meteor/templating';
import './currencydropdown.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();

Template.currencydropdown.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.currencyData = new ReactiveVar();
});



Template.currencydropdown.onRendered(function () {
  let taxRateService = new TaxRateService();
  const currencyData = [];
  let templateObject = Template.instance();
  templateObject.getCurrencies = async function () {
    let currencyData = [];
    let dataObject = await getVS1Data("TCurrencyList");
    if (dataObject.length == 0) {
      taxRateService.getCurrencies().then(function (data) {
        for (let i in data.tcurrencylist) {
          let currencyObj = {
            id: data.tcurrencylist[i].CurrencyID || "",
            currency: data.tcurrencylist[i].Currency || "",
            currencySellRate: data.tcurrencylist[i].SellRate || "",
            currencyBuyRate: data.tcurrencylist[i].BuyRate || "",
            currencyCode: data.tcurrencylist[i].Code || "",
            currencySymbol: data.tcurrencylist[i].CurrencySymbol || "",
          };

          currencyData.push(currencyObj);
        }
        templateObject.currencyData.set(currencyData);
      });
    } else {
      let data = JSON.parse(dataObject[0].data);
      let useData = data.tcurrencylist;
      for (let i in useData) {
        let currencyObj = {
          id: data.tcurrencylist[i].CurrencyID || "",
          currency: data.tcurrencylist[i].Currency || "",
          currencySellRate: data.tcurrencylist[i].SellRate || "",
          currencyBuyRate: data.tcurrencylist[i].BuyRate || "",
          currencyCode: data.tcurrencylist[i].Code || "",
          currencySymbol: data.tcurrencylist[i].CurrencySymbol || "",
        };

        currencyData.push(currencyObj)
      }
      templateObject.currencyData.set(currencyData);
    }
  }
  if (FlowRouter.current().queryParams.id) {
  } else {
    setTimeout(function () {
      $(".sltCurrency").val(CountryAbbr);
    }, 200);
  }
  templateObject.getCurrencies();
});

Template.currencydropdown.helpers({
  currencyData: () => {
    return Template.instance()
      .currencyData.get()
      .sort(function (a, b) {
        if (a.currency == "NA") {
          return 1;
        } else if (b.currency == "NA") {
          return -1;
        }
        return a.currency.toUpperCase() > b.currency.toUpperCase() ? 1 : -1;
      });
  },
  currency: () => {
    return CountryAbbr;
  },
  isCurrencyEnable: () => FxGlobalFunctions.isCurrencyEnabled(),
  checkLabel : () => {
    if(FlowRouter.current().path.includes("customerscard")) return 'Foreign Currency';
    else if(FlowRouter.current().path.includes("supplierscard")) return 'Foreign Currency';
    return 'Currency';
  }
});
