import { ReactiveVar } from "meteor/reactive-var";
import {CRMService} from "../../crm/crm-service";
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);

let crmService = new CRMService();

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
                let url = FlowRouter.current().path;
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
            templateObject.getAllTaskList();
        });
    };

    templateObject.getAllTaskList = function () {
        let url = FlowRouter.current().path;
        url = new URL(window.location.href);
        let employeeID = url.searchParams.get("id") ? url.searchParams.get("id") : '';
        if (employeeID == '') {
            // employeeID = Session.get('mySessionEmployeeLoggedID');
            employeeID = Session.get('mySessionEmployee');
        }
        let task_list = [];
        crmService.getAllTaskList(employeeID).then(function (data) {
            if (data.tprojecttasks && data.tprojecttasks.length > 0) {
                let all_records = data.tprojecttasks;
                all_records = all_records.filter((item) => item.fields.Completed == false);
                for (let i = 0; i < all_records.length; i++) {
                    let strPriority = "";
                    let priority = all_records[i].fields.priority;
                    if (priority === 3) {
                        strPriority = "Urgent";
                    } else if (priority === 2) {
                        strPriority = "High";
                    } else if (priority === 1) {
                        strPriority = "Normal";
                    } else {
                        strPriority = "Low";
                    }
                    const pdata = {
                        id: all_records[i].fields.ID,
                        taskName: all_records[i].fields.TaskName,
                        description: all_records[i].fields.TaskDescription,
                        dueDate: all_records[i].fields.due_date.substring(0, 10),
                        priority: strPriority,
                    }
                    task_list.push(pdata);
                }
                task_list = sortArray(task_list, 'dueDate');
                templateObject.todayTasks.set(task_list.slice(0, 5));
            }
            $(".fullScreenSpin").css("display", "none");
        }).catch(function (err) {
            $(".fullScreenSpin").css("display", "none");
        });
    };
    // templateObject.getInitialAllTaskList();
    templateObject.getAllTaskList();
});

Template.myTasksWidget.helpers({
    todayTasks: () => Template.instance().todayTasks.get()
});

// Listen to event to update reactive variable
Template.myTasksWidget.events({
    "click .taskline": (e) => {
        let task_id = $(e.currentTarget).attr("taskid");
        FlowRouter.go('/crmoverview?taskid='+task_id);
    },
});

function sortArray(array, key, desc=true) {
    return array.sort(function(a, b) {
        let x = a[key];
        let y = b[key];
        if (key == 'dueDate') {
            x = new Date(x);
            y = new Date(y);
        }
        if (!desc)
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        else
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}
