import { CRMService } from '../crm-service';
import '../../lib/global/indexdbstorage.js';
import { valHooks } from 'jquery';
import { isNumber } from 'lodash';
let crmService = new CRMService();

Template.alltasks.onCreated(function () {

  let templateObject = Template.instance();
  templateObject.allrecords = new ReactiveVar([]);
  templateObject.todayRecords = new ReactiveVar([]);
  templateObject.upcomingRecords = new ReactiveVar([]);
  templateObject.overdueRecords = new ReactiveVar([]);
  templateObject.selected_id = new ReactiveVar(0);
  templateObject.selected_ttodo = new ReactiveVar('');
  templateObject.due_date = new ReactiveVar(null);

});

Template.alltasks.onRendered(function () {

  console.log('rendered...')
  $("#task_items_wrapper").sortable({
    handle: '.taskDrag',
    update: function (event, ui) {
      var sorted = $("#task_items_wrapper").sortable("serialize", { key: "sort" });
      var sortedIDs = $("#task_items_wrapper").sortable("toArray");

      let current_id = ui.item[0].id;
      // console.log('taskDrag update =>', sorted, sortedIDs, current_id, ui)
      let prev_id = ui.item[0].previousElementSibling.id;
      let next_id = ui.item[0].nextElementSibling.id;
      console.log('taskDrag update =>', sorted, sortedIDs, current_id, prev_id, next_id, ui)
    },
  });

  $(".hasDatepicker").datepicker({
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
  let currentDate = new Date();
  let begunDate = moment(currentDate).format("d/mm/yy");
  $('.hasDatepicker').val(begunDate);

  let templateObject = Template.instance();
  templateObject.selected_id.set(0);
  templateObject.selected_ttodo.set(null);

  templateObject.getAllTaskList = function () {
    crmService.getAllTaskList().then(function (data) {
      console.log('getAllTaskList==>', data)
      if (data.tprojecttasks && data.tprojecttasks.length > 0) {

        let today = moment().format('YYYY-MM-DD');
        let allrecords = data.tprojecttasks;

        // tempcode until fields are added in backend 
        // let allrecords = data.tprojecttasks.sort(function (a, b) {
        //   return (a.Recno < b.Recno) ? 1 : -1;
        // });

        let today_records = allrecords.filter(item => item.fields.MsTimeStamp.substring(0, 10) == today);
        let upcoming_records = allrecords.filter(item => item.fields.MsTimeStamp.substring(0, 10) > today);
        let overdue_records = allrecords.filter(item => item.fields.MsTimeStamp.substring(0, 10) < today);

        $('.crm_all_count').text(allrecords.length);
        $('.crm_today_count').text(today_records.length);
        $('.crm_upcoming_count').text(upcoming_records.length);

        templateObject.allrecords.set(allrecords);
        templateObject.todayRecords.set(today_records);
        templateObject.upcomingRecords.set(upcoming_records);
        templateObject.overdueRecords.set(overdue_records);
        templateObject.due_date.set(null);

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
    if (!event.target.classList.contains('no-modal')) {
      $('#taskModal').modal('toggle');
    }
  },

  'click .btnAddSubTask': function (event) {
    $(".newTaskRow").css("display", "inline-flex");
    $(".btnAddSubTask").css("display", "none");
  },

  'click .btnCancelAddTask': function (event) {
    $(".btnAddSubTask").css("display", "block");
    $(".newTaskRow").css("display", "none");
  },

  // complete task
  'click .chk_complete': function (e) {
    let id = e.target.dataset.id;
    // handle complete process via api
    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        Active: false
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (objDetails) {
        // $('#ttodo_' + id).remove();
        $('.chkComplete').prop('checked', false);
        // recalculate count here
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // open edit modal
  'click .ttodo-edit': function (e) {

    $(".btnAddSubTask").css("display", "block");
    $(".newTaskRow").css("display", "none");

    let id = e.target.dataset.id;
    let templateObject = Template.instance();
    let selected_id = templateObject.selected_id.get();
    let selected_ttodo = templateObject.selected_ttodo.get();

    $('.fullScreenSpin').css('display', 'inline-block');
    // get selected task detail via api
    crmService.getTaskDetail(id).then(function (data) {
      $('.fullScreenSpin').css('display', 'none');
      console.log('getTaskDetail=>', id, data, data.fields)
      if (data.fields.ID == id) {
        let selected_record = data.fields;
        console.log('open edit', id)

        let title = selected_record.TaskName;
        let description = selected_record.TaskDescription;
        let label = selected_record.TaskLabel;
        let due_date = selected_record.MsTimeStamp;

        let getTodayDate = moment().format('ddd');
        let getTomorrowDay = moment().add(1, 'day').format('ddd');
        let startDate = moment();
        let getNextMonday = moment(startDate).day(1 + 7).format('ddd MMM D');

        var edit_modal = `<div class="row editTaskRow no-modal">
            <div class="col-12">
              <div class="form-group">
                <input class="form-control no-modal" type="text" id="edit_task_name" name="" autocomplete="off" value="${title}">
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                <textarea class="form-control no-modal" rows="3" id="edit_task_description" name="" autocomplete="off">${description}</textarea>
              </div>
            </div>
            <div class="col-6" style="display: inline-flex;">
              <div class="dropdown taskDropdownSchedule">
                <button class="btn btn-primary dropdown-toggle btnSchedule" type="button" id=""
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="far fa-calendar-minus" style="margin-right: 8px;"></i>Schedule
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="width: 275px;">
                  <a class="dropdown-item no-modal setScheduleTodayAdd">
                    <i class="fas fa-calendar-day text-success no-modal" style="margin-right: 8px;"></i>Today
                    <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                      ${getTodayDate}</div>
                  </a>
                  <a class="dropdown-item no-modal setScheduleTomorrowAdd">
                    <i class="fas fa-sun text-warning no-modal" style="margin-right: 8px;"></i>Tomorrow
                    <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                      ${getTomorrowDay}</div>
                  </a>
                  <a class="dropdown-item no-modal setScheduleWeekendAdd">
                    <i class="fas fa-couch text-primary no-modal" style="margin-right: 8px;"></i>This Weekend
                    <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">Sat</div>
                  </a>
                  <a class="dropdown-item no-modal setScheduleNexweekAdd">
                    <i class="fas fa-calendar-alt text-danger no-modal" style="margin-right: 8px;"></i>Next Week
                    <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                      ${getNextMonday}
                    </div>
                  </a>
                  <a class="dropdown-item no-modal setScheduleNodateAdd">
                    <i class="fas fa-ban text-secondary no-modal" style="margin-right: 8px;"></i>
                    No Date</a>
                  <div class="dropdown-divider no-modal"></div>
                  <div class="form-group" data-toggle="tooltip" data-placement="bottom"
                    title="Date format: DD/MM/YYYY" style="margin: 6px 20px; margin-top: 14px;">
                    <div class="input-group date" style="cursor: pointer;">
                      <input type="text" class="form-control hasDatepicker" autocomplete="off" value="${due_date}"><img class="ui-datepicker-trigger"
                        src="/img/imgCal2.png" alt="Show Date" title="Show Date">
                      <div class="input-group-addon">
                        <span class="glyphicon glyphicon-th" style="cursor: pointer;"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
              <div class="dropdown taskDropdownFilter">
                <button class="btn btn-primary dropdown-toggle btnSchedule"
                  style="background-color: rgba(0,0,0,0);" type="button" id="" data-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
                  <span class="dropdownFilter"><i class="fas fa-inbox text-primary"
                      style="margin-right: 5px;"></i>All Tasks</span>
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="width: 275px;">
                  <a class="dropdown-item" href="#"><i class="fas fa-inbox text-primary"
                      style="margin-right: 8px;"></i>All Tasks</a>
                  <a class="dropdown-item" href="#"><i class="fas fa-circle"
                      style="margin-right: 8px; color: purple;"></i>Project #1</a>
                  <a class="dropdown-item dropdown-project-section" href="#"><i
                      class="far fa-folder-open text-primary" style="margin-right: 8px;"></i>Section
                    1</a>
                  <a class="dropdown-item dropdown-project-section" href="#"><i
                      class="far fa-folder-open text-primary" style="margin-right: 8px;"></i>Section
                    2</a>
    
                  <a class="dropdown-item" href="#"><i class="fas fa-circle"
                      style="margin-right: 8px; color: purple;"></i>Project #2</a>
                  <a class="dropdown-item dropdown-project-section" href="#"><i
                      class="far fa-folder-open text-primary" style="margin-right: 8px;"></i>Section
                    1</a>
                  <a class="dropdown-item dropdown-project-section" href="#"><i
                      class="far fa-folder-open text-primary" style="margin-right: 8px;"></i>Section
                    2</a>
                  <a class="dropdown-item dropdown-project-section" href="#"><i
                      class="far fa-folder-open text-primary" style="margin-right: 8px;"></i>Section
                    3</a>
    
                  <a class="dropdown-item" href="#"><i class="fas fa-circle"
                      style="margin-right: 8px; color: purple;"></i>Project #3</a>
                  <a class="dropdown-item dropdown-project-section" href="#"><i
                      class="far fa-folder-open text-primary" style="margin-right: 8px;"></i>Section
                    1</a>
                </div>
              </div>
            </div>
            <div class="col-6" style="display: inline-flex; justify-content: end;">
              <div class="dropdown">
                <i class="fas fa-tag taskModalAction taskModalActionDropdown dropdown-toggle"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                  title="Add label(s)..."></i>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton"
                  style="width: 200px;">
                  <a class="dropdown-item" href="#"><i class="fas fa-tag text-primary"
                      style="margin-right: 8px;"></i>[label 1]
                    <div style="width: 20%; float: right;">
                      <div class="custom-control custom-checkbox chkBox pointer"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkLabel pointer" type="checkbox"
                          id="label_1" value="">
                        <label class="custom-control-label chkBox pointer" for="label_1"></label>
                      </div>
                    </div>
                  </a>
                  <a class="dropdown-item" href="#"><i class="fas fa-tag text-primary"
                      style="margin-right: 8px;"></i>[label 2]
                    <div style="width: 20%; float: right;">
                      <div class="custom-control custom-checkbox chkBox pointer"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkLabel pointer" type="checkbox"
                          id="label_2" value="">
                        <label class="custom-control-label chkBox pointer" for="label_2"></label>
                      </div>
                    </div>
                  </a>
                  <a class="dropdown-item" href="#"><i class="fas fa-tag text-primary"
                      style="margin-right: 8px;"></i>[label 3]
                    <div style="width: 20%; float: right;">
                      <div class="custom-control custom-checkbox chkBox pointer"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkLabel pointer" type="checkbox"
                          id="label_3" value="">
                        <label class="custom-control-label chkBox pointer" for="label_3"></label>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div class="dropdown">
                <i class="far fa-flag taskModalAction taskModalActionDropdown dropdown-toggle"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                  title="Set the priority..."></i>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton"
                  style="width: 200px;">
                  <a class="dropdown-item text-danger" href="#"><i class="fas fa-tag"
                      style="margin-right: 8px;"></i>Priority 1
                    <div style="width: 20%; float: right;">
                      <div class="custom-control custom-checkbox chkBox pointer"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkPriority pointer" type="checkbox"
                          id="label_1" value="">
                        <label class="custom-control-label chkBox pointer" for="label_1"></label>
                      </div>
                    </div>
                  </a>
                  <a class="dropdown-item text-warning" href="#"><i class="fas fa-tag"
                      style="margin-right: 8px;"></i>Priority 2
                    <div style="width: 20%; float: right;">
                      <div class="custom-control custom-checkbox chkBox pointer"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkPriority pointer" type="checkbox"
                          id="label_1" value="">
                        <label class="custom-control-label chkBox pointer" for="label_1"></label>
                      </div>
                    </div>
                  </a>
                  <a class="dropdown-item text-primary" href="#"><i class="fas fa-tag"
                      style="margin-right: 8px;"></i>Priority 3
                    <div style="width: 20%; float: right;">
                      <div class="custom-control custom-checkbox chkBox pointer"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkPriority pointer" type="checkbox"
                          id="label_1" value="">
                        <label class="custom-control-label chkBox pointer" for="label_1"></label>
                      </div>
                    </div>
                  </a>
                  <a class="dropdown-item text-secondary" href="#"><i class="fas fa-tag"
                      style="margin-right: 8px;"></i>Priority 4
                    <div style="width: 20%; float: right;">
                      <div class="custom-control custom-checkbox chkBox pointer"
                        style="width: 15px; float: right;">
                        <input class="custom-control-input chkBox chkPriority pointer" type="checkbox"
                          id="label_1" value="">
                        <label class="custom-control-label chkBox pointer" for="label_1"></label>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <i class="far fa-bell taskModalAction" data-toggle="tooltip" data-placement="bottom"
                title="Add reminder(s)..."></i>
            </div>
            <div class="col-12" style="margin-top: 12px;">
              <button class="btn btn-success btnSaveEdit" type="button" style=""><i class="fa fa-save"
                  style="margin-right: 5px;"></i>Save</button>
              <button class="btn btn-secondary btnCancelEdit" type="button" style="margin-left: 8px;"><i
                  class="fa fa-close" style="margin-right: 5px;"></i>Cancel</button>
            </div>
          </div>`

        if (selected_id !== id) {
          // recover old record
          if (selected_id != 0 && selected_ttodo != null) {
            $('#ttodo_' + selected_id).html(selected_ttodo);
            $('#ttodo_' + selected_id).addClass('mainTaskCol');
          }
          // set new record
          templateObject.selected_ttodo.set($('#ttodo_' + id).html());
          templateObject.selected_id.set(id);
          $('#ttodo_' + id).removeClass('mainTaskCol');
          $('#ttodo_' + id).html(edit_modal);
        }

      } else {
        $('#ttodo_' + selected_id).addClass('mainTaskCol');
        templateObject.selected_id.set(0);
        templateObject.selected_ttodo.set(null);

        swal('Cannot edit this task', '', 'warning');
        return;
      }

    }).catch(function (err) {
      $('.fullScreenSpin').css('display', 'none');
      $('#ttodo_' + selected_id).addClass('mainTaskCol');
      templateObject.selected_id.set(0);
      templateObject.selected_ttodo.set(null);

      swal(err, '', 'error');
      return;
    });
  },

  // cancel edit
  'click .btnCancelEdit': function (e) {

    let selected_id = Template.instance().selected_id.get();
    let selected_ttodo = Template.instance().selected_ttodo.get();

    $('#ttodo_' + selected_id).addClass('mainTaskCol');
    $('#ttodo_' + selected_id).html(selected_ttodo);

    Template.instance().selected_id.set(0);
    Template.instance().selected_ttodo.set(null);

  },

  // submit edit
  'click .btnSaveEdit': function (e) {

    // let id = e.target.dataset.id;
    let templateObject = Template.instance();
    let selected_id = templateObject.selected_id.get();
    let selected_ttodo = templateObject.selected_ttodo.get();
    // tempcode. due_date should be nullable
    let due_date = templateObject.due_date.get() ? templateObject.due_date.get() : new Date();

    console.log('save edit', selected_id)

    // handle save process here
    let edit_task_name = $('#edit_task_name').val();
    let edit_task_description = $('#edit_task_description').val();

    if (edit_task_name === '') {
      swal('Task name is not entered!', '', 'warning');
      return;
    }
    $('.fullScreenSpin').css('display', 'inline-block');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: selected_id,
        TaskName: edit_task_name,
        TaskDescription: edit_task_description,
        MsTimeStamp: due_date
      }
    };

    crmService.saveNewTask(objDetails).then(function (objDetails) {
      if (objDetails.fields.ID) {

        let id = objDetails.fields.ID;
        $('#ttodo_' + id).addClass('mainTaskCol');
        $('#ttodo_' + id).html(selected_ttodo);

        $('#edit_task_name').val(edit_task_name);
        $('#edit_task_description').val(edit_task_description);

        edit_task_description = edit_task_description.length < 80 ? edit_task_description : edit_task_description.substring(0, 79) + '...'
        $('#ttodo_' + id + ' .taskName').html(edit_task_name);
        $('#ttodo_' + id + ' .taskDescription').html(edit_task_description);

        templateObject.getAllTaskList();
      }

      $('.fullScreenSpin').css('display', 'none');

    }).catch(function (err) {
      swal({
        title: 'Oooops...',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
      }).then((result) => {
        $('#ttodo_' + selected_id).addClass('mainTaskCol');
        $('#ttodo_' + selected_id).html(selected_ttodo);
      });
      $('.fullScreenSpin').css('display', 'none');
    });

    templateObject.selected_id.set(0);
    templateObject.selected_ttodo.set(null);

  },

  // submit save new task
  'click .btnSaveAddTask': function (e) {

    let task_name = $('#add_task_name').val();
    let task_description = $('#add_task_description').val();
    let templateObject = Template.instance();
    let due_date = templateObject.due_date.get() ? templateObject.due_date.get() : new Date();

    if (task_name === '') {
      swal('Task name is not entered!', '', 'warning');
      return;
    }
    $('.fullScreenSpin').css('display', 'inline-block');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        TaskName: task_name,
        TaskDescription: task_description,
        MsTimeStamp: due_date
      }
    };

    crmService.saveNewTask(objDetails).then(function (objDetails) {
      if (objDetails.fields.ID) {

        $(".btnAddSubTask").css("display", "block");
        $(".newTaskRow").css("display", "none");

        //////////////////////////////
        templateObject.getAllTaskList();
      }

      $('.fullScreenSpin').css('display', 'none');

      $('#add_task_name').val('');
      $('#add_task_description').val('');

    }).catch(function (err) {
      swal({
        title: 'Oooops...',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
      }).then((result) => {
      });
      $('.fullScreenSpin').css('display', 'none');
    });

  },

  // submit set schedule as today
  'click .setScheduleToday': function (e) {

    let id = e.target.dataset.id;

    let currentDate = new Date();

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        MsTimeStamp: currentDate
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // submit set schedule as tomorrow
  'click .setScheduleTomorrow': function (e) {

    let id = e.target.dataset.id;
    let tomorrow = moment().add(1, 'day').format('YYYY-MM-DD hh:mm:ss');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        MsTimeStamp: tomorrow
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // submit set schedule as weekend
  'click .setScheduleWeekend': function (e) {

    let id = e.target.dataset.id;
    let weekend = moment().endOf('week').format('YYYY-MM-DD hh:mm:ss');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        MsTimeStamp: weekend
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // submit set schedule as next week
  'click .setScheduleNexweek': function (e) {

    let id = e.target.dataset.id;

    var startDate = moment();
    let next_monday = moment(startDate).day(1 + 7).format('YYYY-MM-DD hh:mm:ss');

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        MsTimeStamp: next_monday
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // submit set schedule as no-date
  'click .setScheduleNodate': function (e) {

    let id = e.target.dataset.id;

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        MsTimeStamp: null
      }
    };

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $('.fullScreenSpin').css('display', 'none');
      });
    }

  },

  // set due_date
  'click .setScheduleTodayAdd': function (e) {

    let templateObject = Template.instance();
    console.log('setScheduleTodayAdd=>', templateObject.due_date.get())

    let due_date = moment().format('YYYY-MM-DD hh:mm:ss');
    templateObject.due_date.set(due_date)

  },

  // set due_date
  'click .setScheduleTomorrowAdd': function (e) {

    let templateObject = Template.instance();
    console.log('setScheduleTomorrowAdd=>', templateObject.due_date.get())

    let due_date = moment().add(1, 'day').format('YYYY-MM-DD hh:mm:ss');
    templateObject.due_date.set(due_date)

  },

  // set due_date
  'click .setScheduleWeekendAdd': function (e) {

    let templateObject = Template.instance();
    console.log('setScheduleWeekendAdd=>', templateObject.due_date.get())
    let due_date = moment().endOf('week').format('YYYY-MM-DD hh:mm:ss');
    templateObject.due_date.set(due_date)

  },

  // set due_date
  'click .setScheduleNexweekAdd': function (e) {

    let templateObject = Template.instance();
    console.log('setScheduleNexweekAdd=>', templateObject.due_date.get())

    var startDate = moment();
    let due_date = moment(startDate).day(1 + 7).format('YYYY-MM-DD hh:mm:ss');

    templateObject.due_date.set(due_date)

  },

  // set due_date
  'click .setScheduleNodateAdd': function (e) {

    let templateObject = Template.instance();
    templateObject.due_date.set(null)

  },

});

Template.alltasks.helpers({
  allrecords: () => {
    return Template.instance().allrecords.get();
  },

  overdueRecords: () => {
    // return Template.instance().overdueRecords.get().slice(0, 3);
    return Template.instance().overdueRecords.get();
  },

  todayRecords: () => {
    // return Template.instance().allrecords.get().slice(4, 6);
    return Template.instance().todayRecords.get();
  },

  upcomingRecords: () => {
    // return Template.instance().allrecords.get().slice(7, 9);
    return Template.instance().upcomingRecords.get();
  },

  getTodoDate: (date, format) => {
    if (moment().format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD')) {
      return 'Today';
    } else if (moment().add(1, 'day').format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD')) {
      return 'Tomorrow';
    } else {
      return moment(date).format(format);
    }
  },

  getTaskStyleClass: (date) => {
    if (moment().format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD')) {
      return 'taskToday';
    } else if (moment().add(1, 'day').format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD')) {
      return 'taskTomorrow';
    } else if (moment().format('YYYY-MM-DD') > moment(date).format('YYYY-MM-DD')) {
      return 'taskOverdue';
    } else {
      return 'taskUpcoming';
    }
  },

  getTodayDate: (format) => {
    return moment().format(format);
  },

  getTomorrowDay: () => {
    return moment().add(1, 'day').format('ddd');
  },

  getNextMonday: () => {
    var startDate = moment();
    return moment(startDate).day(1 + 7).format('ddd MMM D');
  },

  getDescription: (description) => {
    return description.length < 80 ? description : description.substring(0, 79) + '...'
  }
});
