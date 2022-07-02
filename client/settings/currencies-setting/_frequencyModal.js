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
import LoadingOverlay from "../../LoadingOverlay";
import { updateAllCurrencies } from "./currencies";
import CronSetting from "../../CronSetting";

let sideBarService = new SideBarService();
let taxRateService = new TaxRateService();

const employeeId = Session.get("mySessionEmployeeLoggedID");

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

    // console.log(fxUpdateObject);
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

  templateObject.saveShedule = async (e) => {
    function convertDayNumberToString(number) {
      let lastNumber = number.toString().slice(-1);
      let suffixe = "st";

      if (lastNumber == 1) {
        suffixe = "st";
      } else if (lastNumber == 2) {
        suffixe = "nd";
      } else if (lastNumber == 3) {
        suffixe = "rd";
      } else {
        suffixe = "th";
      }

      return number + suffixe;
    }

    LoadingOverlay.show();
    // updateAllCurrencies();

    let reportSchedule = {
      type: "TReportSchedules",
      fields: {
        Active: true,
        BeginFromOption: "",
        ContinueIndefinitely: true,
        EmployeeId: employeeId,
        Every: 1,
        EndDate: "",
        FormID: 2,
        LastEmaileddate: "",
        MonthDays: 0,
        StartDate: "",
        WeekDay: 1,
        NextDueDate: "",
      },
    };

    let cronSetting = new CronSetting({
      id: 1,
      employeeId: employeeId,
      startAt: new Date(),
      cronJob: () => updateAllCurrencies,
      type: fxUpdateObject.type,
    });

    /**
     * If monthly
     */
    if (fxUpdateObject instanceof MonthlyFrequencyModel) {
      console.log("TYPE: ", fxUpdateObject);
      let checkedMonths = [];
      document
        .querySelectorAll(".months-input-js input[type=checkbox]:checked")
        .forEach((element) => {
          // console.log(element.getAttribute("value"));
          checkedMonths.push(element.getAttribute("value"));
        });

      fxUpdateObject.ofMonths = checkedMonths;
      fxUpdateObject.everyDay = $("#sltDay").val();
      fxUpdateObject.startDate = $("#edtMonthlyStartDate").val();
      fxUpdateObject.startTime = $("#edtMonthlyStartTime").val();

      // Updating object
      reportSchedule.fields.MonthDays = checkedMonths.join(",");
      reportSchedule.fields.Frequency = "M";
      reportSchedule.fields.StartDate = fxUpdateObject.getDate();

      cronSetting.startAt = fxUpdateObject.getDate();
      cronSetting.months = checkedMonths;
      cronSetting.dayNumberOfMonth = convertDayNumberToString(
        fxUpdateObject.everyDay
      );

      //cronSetting.parsed = later.recur()
    } else if (fxUpdateObject instanceof WeeklyFrequencyModel) {
      console.log("TYPE: ", fxUpdateObject);

      const selectedDay = document.querySelector(
        ".weekly-input-js input[type=checkbox]:checked"
      ).value;

      fxUpdateObject.selectedDays = selectedDay;
      fxUpdateObject.everyWeeks = $("#weeklyEveryXWeeks").val();
      fxUpdateObject.startDate = $("#edtWeeklyStartDate").val();
      fxUpdateObject.startTime = $("#edtWeeklyStartTime").val();

      // Updating object
      reportSchedule.fields.Frequency = "W";
      reportSchedule.fields.WeekDay = parseInt(selectedDay);
      reportSchedule.fields.Every = fxUpdateObject.everyWeeks;
      reportSchedule.fields.StartDate = fxUpdateObject.getDate();

      // cronSetting.type = "Weekly";
      cronSetting.days = fxUpdateObject.selectedDays;
      cronSetting.every = fxUpdateObject.everyWeeks;
    } else if (fxUpdateObject instanceof DailyFrequencyModel) {
      console.log("TYPE: ", fxUpdateObject);

      reportSchedule.fields.Frequency = "D";

      reportSchedule.fields.SatAction = "P";
      reportSchedule.fields.SunAction = "P";
      reportSchedule.fields.Every = -1;
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

        reportSchedule.fields.SatAction = "D";
        reportSchedule.fields.SunAction = "D";

        cronSetting.days = selectedDays;
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
        fxUpdateObject.every = 1;

        reportSchedule.fields.Every = fxUpdateObject.every;

        cronSetting.every = 1;
        cronSetting.days = fxUpdateObject.weekDays;
      } else if ($("#dailyEvery").prop("checked")) {
        //console.log($("#dailyEvery").prop("checked"));
        fxUpdateObject.weekDays = null;
        fxUpdateObject.every = parseInt($("#dailyEveryXDays").val());

        reportSchedule.fields.Every = fxUpdateObject.every;

        cronSetting.every = fxUpdateObject.every;
      }

      fxUpdateObject.startDate = $("#edtDailyStartDate").val();
      fxUpdateObject.startTime = $("#edtDailyStartTime").val();

      reportSchedule.fields.StartDate = fxUpdateObject.getDate();

      cronSetting.startAt = fxUpdateObject.getDate();

      console.log(reportSchedule.fields.StartDate);
    } else if (fxUpdateObject instanceof OneTimeOnlyFrequencyModel) {
      console.log("TYPE: ", fxUpdateObject);

      fxUpdateObject.startDate = $("#edtDailyStartDate").val();
      fxUpdateObject.startTime = $("#edtDailyStartTime").val();

      reportSchedule.fields.Frequency = "";
      reportSchedule.fields.EndDate = fxUpdateObject.getDate();
    } else if (fxUpdateObject instanceof OnEventFrequencyModel) {
      console.log("TYPE: ", fxUpdateObject);

      fxUpdateObject.onLogin = $("#settingsOnLogon").prop("checked");
      fxUpdateObject.onLogout = $("#settingsOnLogout").prop("checked");
      reportSchedule.fields.Frequency = "";
    }

    cronSetting.buildParsedText();
    // console.log("Cron task: ", cronSetting);
    Meteor.call('addCurrencyCron', cronSetting, (error, result) => {
      LoadingOverlay.hide(0);

      if(result) {
        swal({
          title: "Success",
          text: "Fx update was scheduled successfully",
          type: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
        }).then(() => {
          window.open("/currenciessettings", "_self");
        });
      }

      if(error) {
        LoadingOverlay.hide(0);
        //console.log(e);
        swal({
          title: "Oooops...",
          text: "Couldn't save schedule",
          type: "error",
          showCancelButton: true,
          confirmButtonText: "Try Again",
        }).then((result) => {
          console.log(result);
          if (result.value) {
            $(".btnSaveFrequency").click();
            // Meteor._reload.reload();
          } else if (result.dismiss === "cancel") {
          }
        });
      }
    });
    // console.log("Report Schedule", reportSchedule);

    // try {
    //   // Save email settings
    //   // Meteor.call("addCurrencyCron", cronSetting);
    //   LoadingOverlay.hide(0);

    //   swal({
    //     title: "Success",
    //     text: "Fx update was scheduled successfully",
    //     type: "success",
    //     showCancelButton: false,
    //     confirmButtonText: "OK",
    //   }).then(() => {
    //     window.open("/currenciessettings", "_self");
    //   });
    // } catch (e) {
    //   LoadingOverlay.hide(0);
    //   //console.log(e);
    //   swal({
    //     title: "Oooops...",
    //     text: "Couldn't save schedule",
    //     type: "error",
    //     showCancelButton: true,
    //     confirmButtonText: "Try Again",
    //   }).then((result) => {
    //     console.log(result);
    //     if (result.value) {
    //       $(".btnSaveFrequency").click();
    //       // Meteor._reload.reload();
    //     } else if (result.dismiss === "cancel") {
    //     }
    //   });
    // }
    /**
     * Now we need to save the freqency object
     */

    addVS1Data("TCurrencyFrequencySettings", JSON.stringify(fxUpdateObject))
      .then(function (datareturn) {
        //location.reload(true);
        $("#frequencyModal").modal("hide");
      })
      .catch(function (err) {
        //location.reload(true);
      });
    // Meteor.call("addTask", reportSchedule.fields);
    // console.log(fxUpdateObject);
    LoadingOverlay.hide();
  };
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
    let templateObject = Template.instance();

    templateObject.saveShedule();
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
      // console.log(fxUpdateObject);
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
      // console.log(fxUpdateObject);
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
      // console.log(fxUpdateObject);
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
      // console.log(fxUpdateObject);
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
      // console.log(fxUpdateObject);
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
  "click .weeklySettings .chkBoxDays": function (event) {
    var checkboxes = document.querySelectorAll(".weeklySettings .chkBoxDays");
    checkboxes.forEach((item) => {
      if (item !== event.target) {
        item.checked = false;
      }
    });
  },
});
