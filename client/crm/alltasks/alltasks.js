import { CRMService } from '../crm-service';
import '../../lib/global/indexdbstorage.js';
let crmService = new CRMService();

Template.alltasks.onCreated(function () {

  const templateObject = Template.instance();
  templateObject.allrecords = new ReactiveVar([]);
  templateObject.todayRecords = new ReactiveVar([]);
  templateObject.upcomingRecords = new ReactiveVar([]);
  templateObject.overdueRecords = new ReactiveVar([]);

  // $("#date-input, #dtRescheduleDate").datepicker({
  //   showOn: 'button',
  //   buttonText: 'Show Date',
  //   buttonImageOnly: true,
  //   buttonImage: '/img/imgCal2.png',
  //   constrainInput: false,
  //   dateFormat: 'd/mm/yy',
  //   showOtherMonths: true,
  //   selectOtherMonths: true,
  //   changeMonth: true,
  //   changeYear: true,
  //   yearRange: "-90:+10",
  // });

});

Template.alltasks.onRendered(function () {

  $("#date-input, #dtRescheduleDate").datepicker({
    showOn: 'button',
    buttonText: 'Show Date',
    buttonImageOnly: true,
    buttonImage: '/img/imgCal2.png',
    constrainInput: false,
    dateFormat: 'd/mm/yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });

  let templateObject = Template.instance();

  templateObject.getAllTaskList = function () {
    crmService.getTTodoTaskList().then(function (data) {

      if (data.ttodo && data.ttodo.length > 0) {

        let today = moment().format('YYYY-MM-DD');
        let allrecords = data.ttodo;
        let today_records = allrecords.filter(item => item.fields.ToDoByDate.substring(0, 10) == today);
        let upcoming_records = allrecords.filter(item => item.fields.ToDoByDate.substring(0, 10) > today);
        let overdue_records = allrecords.filter(item => item.fields.ToDoByDate.substring(0, 10) < today);

        $('.crm_all_count').text(allrecords.length);
        $('.crm_today_count').text(today_records.length);
        $('.crm_upcoming_count').text(upcoming_records.length);

        templateObject.allrecords.set(allrecords);
        templateObject.todayRecords.set(today_records);
        templateObject.upcomingRecords.set(upcoming_records);
        templateObject.overdueRecords.set(overdue_records);

      } else {
        $('.crm_all_count').text(0);
        $('.crm_today_count').text(0);
        $('.crm_upcoming_count').text(0);
      }

    }).catch(function (err) {

    });
  }

  templateObject.getAllTaskList();
});

Template.alltasks.events({
  'click .mainTaskCol': function (event) {
    $('#taskModal').modal('toggle');
  },
  'click .btnAddSubTask': function (event) {
    $(".newTaskRow").css("display", "inline-flex");
    $(".btnAddSubTask").css("display", "none");
  },
  'click .btnCancelAddTask': function (event) {
    $(".btnAddSubTask").css("display", "block");
    $(".newTaskRow").css("display", "none");
  }
});

Template.alltasks.helpers({
  overdueRecords: () => {
    return Template.instance().overdueRecords.get();
  },

  todayRecords: () => {
    return Template.instance().todayRecords.get();
  },

  upcomingRecords: () => {
    return Template.instance().upcomingRecords.get();
  },

  getTodoDate: (date) => {
    return moment(date).format('D MMM');
  },

  getTodayDate: (format) => {
    return moment().format(format);
  },
});
