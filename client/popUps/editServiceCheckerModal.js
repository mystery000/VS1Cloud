import { ReactiveVar } from "meteor/reactive-var";
import { AccountService } from "../accounts/account-service";
import { OrganisationService } from "../js/organisation-service";
import { SideBarService } from "../js/sidebar-service";
import LoadingOverlay from "../LoadingOverlay";
import { TaxRateService } from "../settings/settings-service";

import { Template } from 'meteor/templating';
import './editServiceCheckerModal.html';
import { EditableService } from "/client/editable-service";

let sideBarService = new SideBarService();
let accountService = new AccountService();
let taxRateService = new TaxRateService();
let editableService = new EditableService();
let currentSubAccount

function generate() {
  let id = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return id;
}

function MakeNegative() {}

Template.editServiceCheckerModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.accountList = new ReactiveVar([]);
  templateObject.accountTypes = new ReactiveVar([]);
  templateObject.expenseCategories = new ReactiveVar([]);
  templateObject.taxRates = new ReactiveVar([]);  
});

Template.editServiceCheckerModal.onRendered(function () {
    let templateObject = Template.instance();
    
    $(document).ready(function () {
      setTimeout(function () {      
      }, 1000);
    });  
});

Template.editServiceCheckerModal.events({
  "click #openEftOptionsModal" : (e) => {
    $('.eftOptionsModal').modal();
  },

});

Template.editServiceCheckerModal.helpers({
  accountTypes: () => {
    return Template.instance()
      .accountTypes.get()
      .sort(function (a, b) {
        if (a.description === "NA") {
          return 1;
        } else if (b.description === "NA") {
          return -1;
        }
        return a.description.toUpperCase() > b.description.toUpperCase()
          ? 1
          : -1;
      });
  },
  taxraterecords: () => {
    return Template.instance()
      .taxraterecords.get()
      .sort(function (a, b) {
        if (a.description === "NA") {
          return 1;
        } else if (b.description === "NA") {
          return -1;
        }
        return a.description.toUpperCase() > b.description.toUpperCase()
          ? 1
          : -1;
      });
  },
  bsbRegionName: () => {
    let bsbname = "Branch Code";
    if (localStorage.getItem("ERPLoggedCountry") === "Australia") {
      bsbname = "BSB";
    }
    return bsbname;
  },
  expenseCategories: () => {
    return Template.instance().expenseCategories.get();
  },  
});
