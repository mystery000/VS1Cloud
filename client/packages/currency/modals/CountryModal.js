import { TaxRateService } from "../../../settings/settings-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../../js/sidebar-service";
import "../../../lib/global/indexdbstorage.js";
import { CountryService } from "../../../js/country-service";
let sideBarService = new SideBarService();

Template.CountryModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.countryData = new ReactiveVar();
});

Template.CountryModal.onRendered(function () {
  console.log("Country widget");
  let templateObject = Template.instance();

  var countryService = new CountryService();
  let countries = [];

  templateObject.getCountryData = function () {
    getVS1Data("TCountries")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          countryService.getCountry().then((data) => {
            for (let i = 0; i < data.tcountries.length; i++) {
              countries.push(data.tcountries[i].Country);
            }
            countries = _.sortBy(countries);
            templateObject.countryData.set(countries);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tcountries;
          for (let i = 0; i < useData.length; i++) {
            countries.push(useData[i].Country);
          }
          countries = _.sortBy(countries);
          templateObject.countryData.set(countries);
        }
      })
      .catch(function (err) {
        countryService.getCountry().then((data) => {
          for (let i = 0; i < data.tcountries.length; i++) {
            countries.push(data.tcountries[i].Country);
          }
          countries = _.sortBy(countries);
          templateObject.countryData.set(countries);
        });
      });

    // console.log(countries);
  };
  templateObject.getCountryData();
});

Template.CountryModal.events({
  "keyup #searchCountry": (e) => {
    const ariaControls = $(e.currentTarget).attr("aria-controls");
    const searchedValue = $(e.currentTarget).val().trim().toLowerCase();

    if (!searchedValue) {
      //   console.log("search is empty");
      $(`#${ariaControls} tbody tr td`).css("display", "");
    } else {
      /**
       * Search
       */
      $(`#${ariaControls} tbody tr`).each((index, element) => {
        const _value = $(element).find("td").text().toLowerCase();
        $(element).css(
          "display",
          _value.includes(searchedValue) == true ? "" : "none"
        );
      });
    }
  },
  "click #tblCountryPopList tbody tr": (e) => {
    $("#searchCountry").val('');
    const listContainerNode = $("#searchCountry").attr("aria-controls");
    $(`#${listContainerNode} tbody tr`).css("display", "");

    const countryName = $(e.currentTarget).attr("value");

    //    console.log($(e.target).parent('.modal'));
    //    console.log($(e.currentTarget).parents('.modal'));
    //    console.log(countryName);

    $("#sedtCountry").val(countryName);
    $("#sedtCountry").attr("value", countryName);
    $("#sedtCountry").trigger("change");

    $(e.currentTarget).parents(".modal").modal("hide");
  },
});

Template.CountryModal.helpers({
  isCurrencyEnable: () => {
    return Session.get("CloudUseForeignLicence");
  },
  countryList: () => {
    return Template.instance().countryData.get();
  },
});
