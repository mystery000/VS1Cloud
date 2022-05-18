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
import {
  DailyFrequencyModel,
  MonthlyFrequencyModel,
  OneTimeOnlyFrequencyModel,
  OnEventFrequencyModel,
  WeeklyFrequencyModel,
} from "./Model/FrequencyModel";
let sideBarService = new SideBarService();

let currentDate = new Date();
let currentFormatedDate =
  currentDate.getDay() +
  "/" +
  currentDate.getMonth() +
  "/" +
  currentDate.getFullYear();

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
        startDate: currentFormatedDate,
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

  templateObject.assignFrequency = function (frequency) {
    if (frequency == "Weekly") {
      $("#frequencyWeekly").prop("checked", true);
      $("#frequencyMonthly").prop("checked", false);
      $("#frequencyDaily").prop("checked", false);
      $("#frequencyOnetimeonly").prop("checked", false);
      $("#frequencyOnevent").prop("checked", false);
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "block";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
    }

    if (frequency == "Daily") {
      $("#frequencyDaily").prop("checked", true);
      $("#frequencyWeekly").prop("checked", false);
      $("#frequencyMonthly").prop("checked", false);
      $("#frequencyOnetimeonly").prop("checked", false);
      $("#frequencyOnevent").prop("checked", false);
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "block";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
    }

    if (frequency == "Monthly") {
      $("#frequencyMonthly").prop("checked", true);
      $("#frequencyDaily").prop("checked", false);
      $("#frequencyWeekly").prop("checked", false);
      $("#frequencyOnetimeonly").prop("checked", false);
      $("#frequencyOnevent").prop("checked", false);
      document.getElementById("monthlySettings").style.display = "block";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
    }
  };

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
  //   "change #dailyWeekdays": (e) => {
  //     if (e.checked == true) {
  //       console.log("checked");
  //     } else {
  //       console.log("unchecked");
  //       console.log($("#week-days-js input[type=checkbox]"));
  //       $("#week-days-js input[type=checkbox]").attr("disabled", true);
  //     }
  //   },
  "change input[name=dailyRadio]": (e) => {
    $(".week-days-js input[type=checkbox].chkBoxDays").attr(
      "disabled",
      $(e.currentTarget).attr("data-value") == "week-days" ? false : true
    );
  },
  "shown.bs.modal #frequencyModal": (e) => {
    let templateObject = Template.instance();

    /**
     * Loading default values
     */
    document.querySelector("#frequencyDaily").click();

    // $("#frequencyDaily").prop('checked', true);
    // templateObject.assignFrequency("Daily");
    // $("#edtDailyStartTime").val("08:00:00");
    // $("#edtDailyStartDate").val(currentFormatedDate);

    console.log("Modal is open");
  },
  "click .btnSaveFrequency": (e) => {
    /**
     * If monthly
     */
    if (fxUpdateObject instanceof MonthlyFrequencyModel) {
      let checkedMonths = [];
      document
        .querySelectorAll(".months-input-js input[type=checkbox]:checked")
        .forEach((element) => {
          // console.log(element.getAttribute("value"));
          checkedMonths.push(element.getAttribute("value"));
        });

      fxUpdateObject.ofMonths = checkedMonths;
      fxUpdateObject.everyDay = $("#settingsMonthlySpecDay").val();
      fxUpdateObject.startDate = $("#edtMonthlyStartDate").val();
      fxUpdateObject.startTime = $("#edtMonthlyStartTime").val();
    } else if (fxUpdateObject instanceof WeeklyFrequencyModel) {
      let selectedDays = [];
      document
        .querySelectorAll(".weekly-input-js input[type=checkbox]:checked")
        .forEach((element) => {
          selectedDays.push(element.getAttribute("value"));
        });

      fxUpdateObject.selectedDays = selectedDays;
      fxUpdateObject.everyWeeks = $("#weeklyEveryXWeeks").val();
      fxUpdateObject.startDate = $("#edtWeeklyStartDate").val();
      fxUpdateObject.startTime = $("#edtWeeklyStartTime").val();
    } else if (fxUpdateObject instanceof DailyFrequencyModel) {
      if ($("#dailyWeekdays").prop("checked")) {
        console.log("checked");
        let selectedDays = [];
        document
          .querySelectorAll(".daily-input-js input[type=checkbox]:checked")
          .forEach((element) => {
            selectedDays.push(element.getAttribute("value"));
          });

        fxUpdateObject.weekDays = selectedDays;
        fxUpdateObject.every = null;
      } else if ($("#dailyEveryDay").prop("checked")) {
        //console.log($("#dailyEveryDay").prop("checked"));
        /**
         * Here we set all days manually
         */
        fxUpdateObject.weekDays = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];
        fxUpdateObject.every = null;
      } else if ($("#dailyEvery").prop("checked")) {
        //console.log($("#dailyEvery").prop("checked"));
        fxUpdateObject.weekDays = null;
        fxUpdateObject.every = $("#dailyEveryXDays").val();
      }

      fxUpdateObject.startDate = $("#edtDailyStartDate").val();
      fxUpdateObject.startTime = $("#edtDailyStartTime").val();
    } else if (fxUpdateObject instanceof OneTimeOnlyFrequencyModel) {
      fxUpdateObject.startDate = $("#edtDailyStartDate").val();
      fxUpdateObject.startTime = $("#edtDailyStartTime").val();
    } else if (fxUpdateObject instanceof OnEventFrequencyModel) {
    }

    console.log(fxUpdateObject);
  },
  'click input[name="frequencyRadio"]': (event) => {
    if (event.target.id == "frequencyMonthly") {
      document.getElementById("monthlySettings").style.display = "block";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
      document.getElementById("onEventSettings").style.display = "none";

      fxUpdateObject = new MonthlyFrequencyModel({
        startDate: currentDate.toISOString().substring(0, 10),
        startTime: "08:00:00",
      });

      $("#edtMonthlyStartTime").val(fxUpdateObject.startTime);
      $("#edtMonthlyStartDate").val(fxUpdateObject.startDate);
      console.log(fxUpdateObject);
    } else if (event.target.id == "frequencyWeekly") {
      document.getElementById("weeklySettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
      document.getElementById("onEventSettings").style.display = "none";

      fxUpdateObject = new WeeklyFrequencyModel({
        startDate: currentDate.toISOString().substring(0, 10),
        startTime: "08:00:00",
      });

      $("#edtWeeklyStartTime").val(fxUpdateObject.startTime);
      $("#edtWeeklyStartDate").val(fxUpdateObject.startDate);
      console.log(fxUpdateObject);
    } else if (event.target.id == "frequencyDaily") {
      document.getElementById("dailySettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
      document.getElementById("onEventSettings").style.display = "none";

      fxUpdateObject = new DailyFrequencyModel({
        startDate: currentDate.toISOString().substring(0, 10),
        startTime: "08:00:00",
      });

      $("#edtDailyStartTime").val(fxUpdateObject.startTime);
      $("#edtDailyStartDate").val(fxUpdateObject.startDate);
      console.log(fxUpdateObject);
    } else if (event.target.id == "frequencyOnetimeonly") {
      document.getElementById("oneTimeOnlySettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("onEventSettings").style.display = "none";

      fxUpdateObject = new OneTimeOnlyFrequencyModel({
        startDate: currentDate.toISOString().substring(0, 10),
        startTime: "08:00:00",
      });

      $("#edtOneTimeOnlyTime").val(fxUpdateObject.startTime);
      $("#edtOneTimeOnlyDate").val(fxUpdateObject.startDate);
      console.log(fxUpdateObject);
    } else if (event.target.id == "frequencyOnevent") {
      document.getElementById("onEventSettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";

      fxUpdateObject = new OnEventFrequencyModel({
        onLogin: $("#settingsOnLogon").prop("checked"),
        onLogout: $("#settingsOnLogout").prop("checked"),
      });
      console.log(fxUpdateObject);
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
