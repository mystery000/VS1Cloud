import { ReactiveVar } from "meteor/reactive-var";
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);

Template.myTasksWidget.onCreated(function () {
  this.loggedDb = new ReactiveVar("");
  const templateObject = Template.instance();
  templateObject.todayTasks = new ReactiveVar([]);
});

Template.myTasksWidget.onRendered(function () {
  let templateObject = Template.instance();

  templateObject.getInitialAllTaskList = function () {
    getVS1Data("TCRMTaskList").then(function (dataObject) {
      if (dataObject.length == 0) {
        templateObject.getAllTaskList();
      } else {
        let data = JSON.parse(dataObject[0].data);
        let today = moment().format("YYYY-MM-DD");
        let all_records = data.tprojecttasks;

        var url = FlowRouter.current().path;
        url = new URL(window.location.href);
        let employeeID = url.searchParams.get("id") ? url.searchParams.get("id") : '';
        if (employeeID) {
          all_records = all_records.filter(item => item.fields.EnteredBy == employeeID);
        }

        all_records = all_records.filter((item) => item.fields.Completed == false);
        let today_records = all_records.filter((item) => item.fields.due_date.substring(0, 10) == today);
        templateObject.todayTasks.set(today_records);
      }
    }).catch(function (err) {
        console.log('$$err', err);
      templateObject.getAllTaskList();
    });
  };

  templateObject.getAllTaskList = function () {
    var url = FlowRouter.current().path;
    url = new URL(window.location.href);
    let employeeID = url.searchParams.get("id") ? url.searchParams.get("id") : '';

    crmService.getAllTaskList(employeeID).then(function (data) {
      if (data.tprojecttasks && data.tprojecttasks.length > 0) {
        let today = moment().format("YYYY-MM-DD");
        let all_records = data.tprojecttasks;
        // all_records = all_records.filter(item => item.fields.ProjectID == 11);
        templateObject.allWithCompletedRecords.set(all_records);

        all_records = all_records.filter((item) => item.fields.Completed == false);
        let today_records = all_records.filter((item) => item.fields.due_date.substring(0, 10) == today);
        templateObject.todayTasks.set(today_records);

      }
      $(".fullScreenSpin").css("display", "none");
    }).catch(function (err) {
      $(".fullScreenSpin").css("display", "none");
    });
  };

  templateObject.getInitialAllTaskList();
});

Template.myTasksWidget.helpers({
    todayTasks: () => Template.instance().todayTasks.get()
});

// Listen to event to update reactive variable
Template.myTasksWidget.events({
  
});