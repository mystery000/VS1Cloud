import { TaxRateService } from "../../../settings/settings-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../../js/sidebar-service";
import "../../../lib/global/indexdbstorage.js";
import { CountryService } from "../../../js/country-service";
import FxGlobalFunctions from "../FxGlobalFunctions";

import { Template } from 'meteor/templating';
import './CountryModal.html';

let sideBarService = new SideBarService();

Template.CountryModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.currencies = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.countryData = new ReactiveVar();
  templateObject.selectedFile = new ReactiveVar();
  templateObject.getDataTableList = function(data) {
    let linestatus = '';
    if (data.Active == true) {
      linestatus = "";
    } else if (data.Active == false) {
      linestatus = "In-Active";
    }
    let dataList = [
      data.Country || "",
      data.CountryID || ""
    ];
    return dataList;
  }

  let headerStructure = [
    { index: 0, label: 'Country', class: 'colCountry', active: true, display: true, width: "200" },
    { index: 1, label: 'Country ID', class: 'colCountryID', active: false, display: true, width: "100" },
  ];

  templateObject.tableheaderrecords.set(headerStructure);
});

Template.CountryModal.onRendered(function () {
  let templateObject = Template.instance();

  var countryService = new CountryService();
  let countries = [];

  // templateObject.getCountryData = function () {
  //   getVS1Data("TCountries").then(function (dataObject) {
  //       if (dataObject.length == 0) {
  //         countryService.getCountry().then((data) => {
  //           for (let i = 0; i < data.tcountries.length; i++) {
  //             countries.push(data.tcountries[i].Country);
  //           }
  //           countries.sort((a, b) => a.localeCompare(b));
  //           templateObject.countryData.set(countries);
  //         });
  //       } else {
  //         let data = JSON.parse(dataObject[0].data);
  //         let useData = data.tcountries;
  //         for (let i = 0; i < useData.length; i++) {
  //           countries.push(useData[i].Country);
  //         }
  //         countries.sort((a, b) => a.localeCompare(b));
  //         templateObject.countryData.set(countries);
  //       }
  //     }).catch(function (err) {
  //       countryService.getCountry().then((data) => {
  //         for (let i = 0; i < data.tcountries.length; i++) {
  //           countries.push(data.tcountries[i].Country);
  //         }
  //         countries.sort((a, b) => a.localeCompare(b));
  //         templateObject.countryData.set(countries);
  //       });
  //     });

  // };
  // templateObject.getCountryData();
});

Template.CountryModal.events({
  "keyup #searchCountry": (e) => {
    let ariaControls = $(e.currentTarget).attr("aria-controls");
    let searchedValue = $(e.currentTarget).val().trim().toLowerCase();

    if (!searchedValue) {
      $(`#${ariaControls} tbody tr td`).css("display", "");
    } else {
      /**
       * Search
       */
      $(`#${ariaControls} tbody tr`).each((index, element) => {
        let _value = $(element).find("td").text().toLowerCase();
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

    // let countryName = $(e.currentTarget).attr("value");
    const countryName = $(e.currentTarget).find("td").text();
    
    //console.log("////////////",countryName)
    $(e.currentTarget).parents(".modal").modal("hide");
    
    $("#sedtCountry").val(countryName);
    $("#sedtCountry").attr("value", countryName);
    $("#sedtCountry").trigger("change");

    $("#editCountry").val(countryName);
    $("#editCountry").attr("value", countryName);
    //$("#editCountry").trigger("change");
  },
});

Template.CountryModal.helpers({
  isCurrencyEnable: () => FxGlobalFunctions.isCurrencyEnabled(),
  countryList: () => {
    return Template.instance().countryData.get();
  },
  datatablerecords : () => {
    return Template.instance().datatablerecords.get();
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  apiFunction:function() {
    let sideBarService = new SideBarService();
    return sideBarService.getCountry;
  },
  searchAPI: function() {
    return sideBarService.getCountry;
  },
  service: ()=>{
    let sideBarService = new SideBarService();
    return sideBarService;

  },
  datahandler: function () {
    let templateObject = Template.instance();
    return function(data) {
      let dataReturn =  templateObject.getDataTableList(data)
      return dataReturn
    }
  },
  exDataHandler: function() {
    let templateObject = Template.instance();
    return function(data) {
      let dataReturn =  templateObject.getDataTableList(data)
      return dataReturn
    }
  },

  apiParams: function() {
    return ['limitCount', 'limitFrom', 'deleteFilter'];
  },

});
