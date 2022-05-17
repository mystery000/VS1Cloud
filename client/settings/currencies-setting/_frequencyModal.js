import { TaxRateService } from "../settings-service";
import { ReactiveVar } from "meteor/reactive-var";
import { CountryService } from "../../js/country-service";
import { SideBarService } from "../../js/sidebar-service";
import { HTTP } from "meteor/http";
import "../../lib/global/indexdbstorage.js";
import FxSettingsEditor from "../fxupdate/FxSettingsEditor";
import FxUpdateSetting, {
  FxFrequencyDaily,
} from "../fxupdate/Model/FxUpdateSetting";
let sideBarService = new SideBarService();

let fxUpdateObject;

let FxEditorSetting = new FxSettingsEditor({
  onEditEnabled: () => {
    // This is the default object to build when you click here
    fxUpdateObject = new FxUpdateSetting({
      transactionType: "daily",
      frequency: new FxFrequencyDaily({
        days: "*",
        every: "1",
        startTime: "08:00:00",
        startDate: "",
      }),
    });

    console.log(fxUpdateObject);
  },
  onEditDisabled: () => {
    fxUpdateObject = null;
  },
  onCanceled: () => {
    console.log("canceled edit mode");
  },
  onSaved: () => {
    console.log("on Saved");
  },
});

Template._frequencyModal.onCreated(function () {
  const templateObject = Template.instance();
});

Template._frequencyModal.onRendered(function () {
  let templateObject = Template.instance();
  console.log("Frequency modal initiated");

  /**
   * We'll load the default data on open
   */
//   $("#frequencyModal").on('shown.bs.modal', (e) => {
//     console.log("Showing modal");
//   })
});

Template._frequencyModal.events({
  // 'click .btnFxupdate' : function(event){
  //     $("#frequencyModal").modal('toggle');
  //     // FlowRouter.go('/settings/fx-update'); old wrong code
  //   },

  'shown.bs.modal #frequencyModal': (e) => {
      console.log('test');
  },
  'click input[name="frequencyRadio"]': (event) => {
    if (event.target.id == "frequencyMonthly") {
      document.getElementById("monthlySettings").style.display = "block";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
      document.getElementById("onEventSettings").style.display = "none";

      // fxUpdateObject.frequency = new FxFrequencyMonthly({
      //     everyDay: "month",
      //     ofMonths: []
      // });
      // console.log(fxUpdateObject);
    } else if (event.target.id == "frequencyWeekly") {
      document.getElementById("weeklySettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
      document.getElementById("onEventSettings").style.display = "none";
    } else if (event.target.id == "frequencyDaily") {
      document.getElementById("dailySettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
      document.getElementById("onEventSettings").style.display = "none";
    } else if (event.target.id == "frequencyOnetimeonly") {
      document.getElementById("oneTimeOnlySettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("onEventSettings").style.display = "none";
    } else if (event.target.id == "frequencyOnevent") {
      document.getElementById("onEventSettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
    } else {
      $("#frequencyModal").modal("toggle");
    }
  },
  'click input[name="settingsMonthlyRadio"]': (event) => {
    if (event.target.id == "settingsMonthlyEvery") {
      $(".settingsMonthlyEveryOccurence").attr("disabled", false);
      $(".settingsMonthlyDayOfWeek").attr("disabled", false);
      $(".settingsMonthlySpecDay").attr("disabled", true);
    } else if (event.target.id == "settingsMonthlyDay") {
      $(".settingsMonthlySpecDay").attr("disabled", false);
      $(".settingsMonthlyEveryOccurence").attr("disabled", true);
      $(".settingsMonthlyDayOfWeek").attr("disabled", true);
    } else {
      $("#frequencyModal").modal("toggle");
    }
  },
  'click input[name="dailyRadio"]': (event) => {
    if (event.target.id == "dailyEveryDay") {
      $(".dailyEveryXDays").attr("disabled", true);
    } else if (event.target.id == "dailyWeekdays") {
      $(".dailyEveryXDays").attr("disabled", true);
    } else if (event.target.id == "dailyEvery") {
      $(".dailyEveryXDays").attr("disabled", false);
    } else {
      $("#frequencyModal").modal("toggle");
    }
  },
});
