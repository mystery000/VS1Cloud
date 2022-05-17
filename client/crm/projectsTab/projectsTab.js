Template.projectsTab.inheritsHelpersFrom('alltaskdatatable');
Template.projectsTab.inheritsEventsFrom('alltaskdatatable');
Template.projectsTab.inheritsHooksFrom('alltaskdatatable');

import { CRMService } from '../crm-service';
let crmService = new CRMService();

Template.projectsTab.events({

  'click .projectName': function (e) {
    let id = e.target.dataset.id;
    if (id) {
      FlowRouter.go('/projects?id=' + id);
      Meteor._reload.reload();
    }
  },

  'click .menuFilterslabels': function (e) {
    FlowRouter.go('/filterslabels');
  },

  // delete project
  'click .delete-project': function (e) {
    let id = $('#editProjectID').val();
    // let id = e.target.dataset.id;
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Active: false
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        // $('.projectName' + id).remove();
        templateObject.getTProjectList();
        $('#editCrmProject').modal('hide');
        $('#newProjectTasksModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('#editCrmProject').modal('hide');
        $('#newProjectTasksModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  // add to favorite project
  'click .add-favorite': function (e) {
    // let id = e.target.dataset.id;
    let id = $('#editProjectID').val();

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          AddToFavourite: true
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        // $('#li_favorite').css('display', 'block');
        templateObject.getTProjectList();
        $('#editCrmProject').modal('hide');
        $('#newProjectTasksModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('#editCrmProject').modal('hide');
        $('#newProjectTasksModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  // remove favorite project
  'click .remove-favorite': function (e) {
    // let id = e.target.dataset.id;
    let id = $('#editProjectID').val();
    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          AddToFavourite: false
        }
      };
      crmService.updateProject(objDetails).then(function (data) {
        templateObject.getTProjectList();
        $('#editCrmProject').modal('hide');
        $('#newProjectTasksModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('#editCrmProject').modal('hide');
        $('#newProjectTasksModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  // archive project
  'click .archive-project': function (e) {
    // let id = e.target.dataset.id;
    let id = $('#editProjectID').val();

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Archive: true
        }
      };
      let templateObject = Template.instance();

      crmService.updateProject(objDetails).then(function (data) {
        templateObject.getTProjectList();

        $('#editCrmProject').modal('hide');
        $('#newProjectTasksModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('#editCrmProject').modal('hide');
        $('#newProjectTasksModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  // unarchive project
  'click .unarchive-project': function (e) {
    // let id = e.target.dataset.id;
    let id = $('#editProjectID').val();

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      var objDetails = {
        type: "Tprojectlist",
        fields: {
          ID: id,
          Archive: false
        }
      };
      crmService.updateProject(objDetails).then(function (data) {

        templateObject.getTProjectList();

        $('#editCrmProject').modal('hide');
        $('#newProjectTasksModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
        });
        $('#editCrmProject').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  },


  // submit save new project
  // 'click .btnNewCrmProject': function (e) {
  //   let projectName = $('#crmProjectName').val();
  //   let projectColor = $('#crmProjectColor').val();
  //   let swtNewCrmProjectFavorite = $("#swtNewCrmProjectFavorite").prop("checked");

  //   if (projectName === '' || projectName === null) {
  //     swal('Project name is not entered!', '', 'warning');
  //     return;
  //   }

  //   $('.fullScreenSpin').css('display', 'inline-block');

  //   var objDetails = {
  //     type: "Tprojectlist",
  //     fields: {
  //       Active: true,
  //       ProjectName: projectName,
  //       ProjectColour: projectColor,
  //       AddToFavourite: swtNewCrmProjectFavorite
  //     }
  //   };
  //   let templateObject = Template.instance();

  //   crmService.updateProject(objDetails).then(function (data) {

  //     templateObject.getTProjectList();

  //     $('.fullScreenSpin').css('display', 'none');
  //     // Meteor._reload.reload();
  //   }).catch(function (err) {
  //     swal({
  //       title: 'Oooops...',
  //       text: err,
  //       type: 'error',
  //       showCancelButton: false,
  //       confirmButtonText: 'Try Again'
  //     }).then((result) => {
  //     });
  //     $('.fullScreenSpin').css('display', 'none');
  //   });
  // },

  // open edit modal
  'click .edit-project': function (e) {
    // let id = e.target.dataset.id;
    // let id = $('#editProjectID').val();

    // crmService.getTProjectDetail(id).then(function (data) {
    //   if (data.fields) {

    //     let projectName = data.fields.ProjectName;
    //     let ProjectColour = data.fields.ProjectColour;
    //     let AddToFavourite = data.fields.AddToFavourite;
    //     // missing color, favorite fields
    //     $('#editProjectID').val(id);
    //     $('#editCrmProjectName').val(projectName);
    //     $('#editCrmProjectColor').val(ProjectColour);
    //     if (AddToFavourite == true) {
    //       $("#swteditCrmProjectFavorite").prop("checked", true);
    //     } else {
    //       $("#swteditCrmProjectFavorite").prop("checked", false);
    //     }

    //   }

    // }).catch(function (err) { 
    // });
  },

  // submit edit project
  'click .btnEditCrmProject': function (e) {
    let id = $('#editProjectID').val();
    let projectName = $('#editCrmProjectName').val();
    let projectColor = $('#editCrmProjectColor').val();
    let swtNewCrmProjectFavorite = $("#swteditCrmProjectFavorite").prop("checked");

    // // tempcode
    // let projecttasks = e.target.dataset.projecttasks;
    // let projecttasks_count = '';
    // if (projecttasks != null && projecttasks != undefined && projecttasks != "undefined") {
    //   projecttasks_count = projecttasks.lentgh;
    // }
    // // tempcode

    if (id === '' || id === null) {
      swal('Project is not selected correctly', '', 'warning');
      return;
    }

    if (projectName === '' || projectName === null) {
      swal('Project name is not entered!', '', 'warning');
      return;
    }

    $('.fullScreenSpin').css('display', 'inline-block');

    var objDetails = {
      type: "Tprojectlist",
      fields: {
        ID: id,
        Active: true,
        ProjectName: projectName,
        ProjectColour: projectColor,
        AddToFavourite: swtNewCrmProjectFavorite
      }
    };
    let templateObject = Template.instance();

    crmService.updateProject(objDetails).then(function (data) {
      templateObject.getTProjectList();

      $('.fullScreenSpin').css('display', 'none');
      $('#editCrmProject').modal('hide');
      $('#newProjectTasksModal').modal('hide');
      // Meteor._reload.reload();
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
      $('#editCrmProject').modal('hide');
      $('#newProjectTasksModal').modal('hide');
    });
  },


  // submit duplicate project
  'click .duplicate-project': function (e) {

    let projectName = 'Copy of ' + e.target.dataset.name;
    let projectColor = e.target.dataset.color;
    let projecttasks = e.target.dataset.projecttasks;
    let projecttasks_count = '';
    if (projecttasks != null && projecttasks != undefined && projecttasks != "undefined") {
      projecttasks_count = projecttasks.lentgh;
    }

    $('.fullScreenSpin').css('display', 'inline-block');

    var objDetails = {
      type: "Tprojectlist",
      fields: {
        Active: true,
        ProjectName: projectName,
        ProjectColour: projectColor
      }
    };
    projectColor = projectColor == 0 ? 'gray' : projectColor;
    let templateObject = Template.instance();

    crmService.updateProject(objDetails).then(function (data) {

      templateObject.getTProjectList();

      $('#editCrmProject').modal('hide');
      $('.fullScreenSpin').css('display', 'none');
      // Meteor._reload.reload();
    }).catch(function (err) {
      swal({
        title: 'Oooops...',
        text: err,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Try Again'
      }).then((result) => {
      });
      $('#editCrmProject').modal('hide');
      $('.fullScreenSpin').css('display', 'none');
    });
  },

  // open task-project modal
  'click #tblNewProjectsDatatable tr': function (e) {
    $('#newProjectTasksModal').modal('toggle');
    let id = e.target.dataset.id;
    $('#editProjectID').val(id);

    if (id) {
      $('.fullScreenSpin').css('display', 'inline-block');

      crmService.getTProjectDetail(id).then(function (data) {
        $('.fullScreenSpin').css('display', 'none');
        if (data.fields.ID == id) {
          let selected_record = data.fields;

          let projectName = data.fields.ProjectName;
          let ProjectColour = data.fields.ProjectColour;
          let AddToFavourite = data.fields.AddToFavourite;
          // missing color, favorite fields
          $('#editProjectID').val(id);
          $('#editCrmProjectName').val(projectName);
          $('.editCrmProjectName').html(projectName);
          $('#editCrmProjectColor').val(ProjectColour);
          if (AddToFavourite == true) {
            $("#swteditCrmProjectFavorite").prop("checked", true);
          } else {
            $("#swteditCrmProjectFavorite").prop("checked", false);
          }

          // set task list
          let tr = '';
          let projecttasks = [];
          if (selected_record.projecttasks) {
            if (selected_record.projecttasks.fields == undefined) {
              projecttasks = selected_record.projecttasks;
            } else {
              projecttasks.push({ fields: selected_record.projecttasks })
            }

            let due_date = '';
            let description = '';
            let labels = '';
            let getTodayDate = moment().format('ddd');
            let getTomorrowDay = moment().add(1, 'day').format('ddd');
            let startDate = moment();
            let getNextMonday = moment(startDate).day(1 + 7).format('ddd MMM D');

            projecttasks.forEach(item => {
              due_date = item.fields.due_date ? moment(item.fields.due_date).format('DD/MM/YYYY') : '';
              description = item.fields.TaskDescription.length < 80 ? item.fields.TaskDescription : item.fields.TaskDescription.substring(0, 79) + '...';
              if (item.fields.TaskLabel) {
                if (item.fields.TaskLabel.fields) {
                  labels = `<span class="taskTag"><a class="taganchor" href=""><i class="fas fa-tag"
                    style="margin-right: 5px;"></i>${item.fields.TaskLabel.fields.TaskLabelName}</a></span>`;
                }
                else {
                  item.fields.TaskLabel.forEach(lbl => {
                    labels += `<span class="taskTag"><a class="taganchor" href=""><i class="fas fa-tag"
                  style="margin-right: 5px;"></i>${lbl.fields.TaskLabelName}</a></span>`;
                  });
                }
              }

              tr += `<tr class="dnd-moved" style="cursor: pointer;">
                <td contenteditable="false" class="colCompleteTask task_priority_${item.fields.priority}"
                  style="width: 2%;">
                  <div
                    class="custom-control custom-checkbox chkBox pointer no-modal task_priority_${item.fields.priority}"
                    style="width:15px;margin-right: -6px;">
                    <input class="custom-control-input chkBox chkComplete pointer" type="checkbox"
                      id="formCheck-${item.fields.ID}">
                    <label class="custom-control-label chkBox pointer chk_complete" data-id="${item.fields.ID}"
                      for="formCheck-${item.fields.ID}"></label>
                  </div>
                </td>
                <td contenteditable="false" class="openEditTaskModal colDate" data-id="${item.fields.ID}" data-catg="${projectName}">
                  ${due_date}</td>
                <td contenteditable="false" class="openEditTaskModal colTaskName" data-id="${item.fields.ID}" data-catg="${projectName}">
                  ${item.fields.TaskName}</td>
                <td contenteditable="false" class="openEditTaskModal colTaskDesc" data-id="${item.fields.ID}" data-catg="${projectName}">
                  ${description}
                </td>
                <td contenteditable="false" class="openEditTaskModal colTaskLabels" data-id="${item.fields.ID}" data-catg="${projectName}">
                  ${labels}
                </td>
                <td contenteditable="false" class="colTaskActions">
                  <div class="dropdown btnTaskTableAction">
                    <button type="button" class="btn btn-primary openEditTaskModal" data-id="${item.fields.ID}" data-catg="${projectName}"><i class="far fa-edit" style="width: 16px;"
                        data-id="${item.fields.ID}" data-catg="${projectName}"></i></button>
                  </div>

                  <div class="dropdown btnTaskTableAction">
                    <button type="button" class="btn btn-success" data-toggle="dropdown"><i
                        class="far fa-calendar"></i></button>
                    <div class="dropdown-menu dropdown-menu-right reschedule-dropdown-menu  no-modal"
                      aria-labelledby="dropdownMenuButton" style="width: 275px;">
                      <a class="dropdown-item no-modal setScheduleToday" href="#" data-id="${item.fields.ID}">
                        <i class="fas fa-calendar-day text-success no-modal"
                          style="margin-right: 8px;"></i>Today
                        <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                          ${getTodayDate}</div>
                      </a>
                      <a class="dropdown-item no-modal setScheduleTomorrow" href="#"
                        data-id="${item.fields.ID}">
                        <i class="fas fa-sun text-warning no-modal" style="margin-right: 8px;"></i>Tomorrow
                        <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                          ${getTomorrowDay}</div>
                      </a>
                      <a class="dropdown-item no-modal setScheduleWeekend" href="#"
                        data-id="${item.fields.ID}">
                        <i class="fas fa-couch text-primary no-modal" style="margin-right: 8px;"></i>This
                        Weekend
                        <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                          Sat</div>
                      </a>
                      <a class="dropdown-item no-modal setScheduleNexweek" href="#"
                        data-id="${item.fields.ID}">
                        <i class="fas fa-calendar-alt text-danger no-modal" style="margin-right: 8px;"></i>Next
                        Week
                        <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                          ${getNextMonday}
                        </div>
                      </a>
                      <a class="dropdown-item no-modal setScheduleNodate" href="#" data-id="${item.fields.ID}">
                        <i class="fas fa-ban text-secondary no-modal" style="margin-right: 8px;"></i>
                        No Date</a>
                      <div class="dropdown-divider no-modal"></div>
                      <div class="form-group no-modal" data-toggle="tooltip" data-placement="bottom"
                        title="Date format: DD/MM/YYYY" style="margin: 6px 20px; margin-top: 14px;">
                        <div class="input-group date no-modal" style="cursor: pointer;">
                          <input type="text" id="${item.fields.ID}" class="form-control crmDatepicker no-modal"
                            autocomplete="off">
                          <div class="input-group-addon no-modal">
                            <span class="glyphicon glyphicon-th no-modal" style="cursor: pointer;"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="dropdown btnTaskTableAction">
                    <button type="button" class="btn btn-warning openEditTaskModal" data-id="${item.fields.ID}" data-ttype="comment" data-catg="${projectName}"><i class="far fa-comment-alt" data-id="${item.fields.ID}"
                        data-ttype="comment" data-catg="${projectName}"></i></button>
                  </div>

                  <div class="dropdown btnTaskTableAction">
                    <button type="button" class="btn btn-secondary" data-toggle="dropdown"
                      data-placement="bottom" title="More task actions..."><i
                        class="fas fa-ellipsis-h"></i></button>
                    <div class="dropdown-menu dropdown-menu-right crmtaskdrop" id="">
                      <a class="dropdown-item no-modal openEditTaskModal" data-id="${item.fields.ID}" data-catg="${projectName}">
                        <i class="far fa-edit" style="margin-right: 8px;" data-id="${item.fields.ID}" data-catg="${projectName}"></i>Edit Task</a>

                      <div class="dropdown-divider"></div>

                      <div class="dropdown-item-wrap no-modal">
                        <div class="no-modal">
                          <div class="no-modal">
                            <span class="no-modal">Due Date</span>
                          </div>
                          <div class="no-modal" style="display: inline-flex;">
                            <i class="fa fa-calendar-check-o no-modal taskDropSecondMenu taskDropMenuToday setScheduleToday"
                              data-toggle="tooltip" data-placement="bottom" title="Today"
                              data-id="${item.fields.ID}"></i>
                            <i class="fa fa-sun-o no-modal taskDropSecondMenu taskDropMenuTomorrow setScheduleTomorrow"
                              data-toggle="tooltip" data-placement="bottom" title="Tomorrow"
                              data-id="${item.fields.ID}"></i>
                            <i class="fa fa-print no-modal taskDropSecondMenu taskDropMenuWeekend setScheduleWeekend"
                              data-toggle="tooltip" data-placement="bottom" title="This weekend"
                              data-id="${item.fields.ID}"></i>
                            <i class="fa fa-calendar-minus-o no-modal taskDropSecondMenu taskDropMenuNextweek setScheduleNexweek"
                              data-toggle="tooltip" data-placement="bottom" title="Next week"
                              data-id="${item.fields.ID}"></i>
                          </div>
                        </div>

                        <div class="no-modal">
                          <div class="no-modal">
                            <span class="no-modal">Priority</span>
                          </div>
                          <div class="no-modal" style="display: inline-flex;">
                            <i class="fas fa-flag no-modal taskDropSecondFlag taskOverdue" data-toggle="tooltip"
                              data-placement="bottom" title="Priority 1" data-priority="3"
                              data-id="${item.fields.ID}"></i>
                            <i class="fas fa-flag no-modal taskDropSecondFlag taskDropMenuTomorrow"
                              data-toggle="tooltip" data-placement="bottom" title="Priority 2" data-priority="2"
                              data-id="${item.fields.ID}"></i>
                            <i class="fas fa-flag no-modal taskDropSecondFlag taskDropMenuWeekend"
                              data-toggle="tooltip" data-placement="bottom" title="Priority 3" data-priority="1"
                              data-id="${item.fields.ID}"></i>
                            <i class="far fa-flag no-modal taskDropSecondFlag" data-toggle="tooltip"
                              data-placement="bottom" title="Priority 4" data-priority="0"
                              data-id="${item.fields.ID}"></i>
                          </div>
                        </div>
                      </div>

                      <div class="dropdown-divider"></div>

                      <a class="dropdown-item no-modal" data-id="${item.fields.ID}">
                        <i class="fa fa-clock-o" style="margin-right: 8px;"></i>Reminders</a>

                      <div class="dropdown-divider"></div>

                      <a class="dropdown-item no-modal" data-id="${item.fields.ID}">
                        <i class="fa fa-arrow-circle-right" style="margin-right: 8px;"></i>Move to Project</a>
                      <a class="dropdown-item duplicate-task no-modal" data-id="${item.fields.ID}">
                        <i class="fa fa-plus-square-o" style="margin-right: 8px;"
                          data-id="${item.fields.ID}"></i>Duplicate</a>

                      <div class="dropdown-divider"></div>

                      <a class="dropdown-item delete-task no-modal" data-id="${item.fields.ID}">
                        <i class="fas fa-trash-alt" style="margin-right: 8px;"
                          data-id="${item.fields.ID}"></i>Delete
                        Task</a>
                    </div>
                  </div>

                </td>
              </tr>`;
            });
          }

          $('#tblProjectTasksBody').html(tr);
        } else {
          swal('Cannot edit this project', '', 'warning');
          return;
        }

      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
        swal(err, '', 'error');
        return;
      });
    }
  },
});

Template.projectsTab.helpers({

  getProjectColor: (color) => {
    if (color == 0) {
      return 'gray';
    }
    return color;
  },

  getProjectCount: (tasks) => {
    if (tasks == null) {
      return '';
    } else if (tasks.fields != undefined) {
      return 1;
    } else {
      return tasks.lentgh;
    }
  },

  stringProjecttasks: (projecttasks) => {

  }

});
