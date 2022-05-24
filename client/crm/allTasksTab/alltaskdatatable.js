import { CRMService } from "../crm-service";
let crmService = new CRMService();

Template.alltaskdatatable.onCreated(function () {
  let templateObject = Template.instance();
  templateObject.alllabels = new ReactiveVar([]);
  templateObject.tprojectlist = new ReactiveVar([]);
  templateObject.allRecords = new ReactiveVar([]);
  templateObject.allWithCompletedRecords = new ReactiveVar([]);
  templateObject.todayRecords = new ReactiveVar([]);
  templateObject.upcomingRecords = new ReactiveVar([]);
  templateObject.overdueRecords = new ReactiveVar([]);
  templateObject.selected_id = new ReactiveVar(0);
  templateObject.task_id = new ReactiveVar(0);
  templateObject.project_id = new ReactiveVar(0);
  templateObject.selected_ttodo = new ReactiveVar("");
  templateObject.due_date = new ReactiveVar(null);

  templateObject.active_projects = new ReactiveVar([]);
  templateObject.deleted_projects = new ReactiveVar([]);
  templateObject.favorite_projects = new ReactiveVar([]);
});

Template.alltaskdatatable.onRendered(function () {
  let templateObject = Template.instance();
  templateObject.selected_id.set(0);
  templateObject.selected_ttodo.set(null);

  templateObject.updateTaskSchedule = function (id, date) {
    let due_date = "";
    if (date) {
      due_date = moment(date).format("YYYY-MM-DD hh:mm:ss");
    }

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: due_date,
      },
    };

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  };

  templateObject.initDatepicker = function () {
    $(".crmDatepicker").datepicker({
      showOn: "button",
      buttonText: "Show Date",
      buttonImageOnly: true,
      buttonImage: "/img/imgCal2.png",
      constrainInput: false,
      dateFormat: "yy/mm/dd",
      showOtherMonths: true,
      selectOtherMonths: true,
      changeMonth: true,
      changeYear: true,
      yearRange: "-90:+10",
      onSelect: function (dateText, inst) {
        // alert(dateText);
        let task_id = inst.id;
        templateObject.updateTaskSchedule(task_id, dateText);
      },
    });
    $(".crmEditDatepicker").datepicker({
      showOn: "button",
      buttonText: "Show Date",
      buttonImageOnly: true,
      buttonImage: "/img/imgCal2.png",
      constrainInput: false,
      dateFormat: "yy/mm/dd",
      showOtherMonths: true,
      selectOtherMonths: true,
      changeMonth: true,
      changeYear: true,
      yearRange: "-90:+10",
    });
  };

  templateObject.initTable = function () {
    $("#tblAllTaskDatatable").DataTable({
      columnDefs: [
        {
          orderable: false,
          targets: 0,
        },
        {
          orderable: false,
          targets: 5,
        },
      ],
      colReorder: {
        fixedColumnsLeft: 0,
      },
      sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      buttons: [
        {
          extend: "excelHtml5",
          text: "",
          download: "open",
          className: "btntabletocsv hiddenColumn",
          filename: "Task List" + moment().format(),
          orientation: "portrait",
          exportOptions: {
            columns: ":visible",
            format: {
              body: function (data, row, column) {
                if (data.includes("</span>")) {
                  var res = data.split("</span>");
                  data = res[1];
                }

                return column === 1 ? data.replace(/<.*?>/gi, "") : data;
              },
            },
          },
        },
        {
          extend: "print",
          download: "open",
          className: "btntabletopdf hiddenColumn",
          text: "",
          title: "Task List",
          filename: "Task List" + moment().format(),
          exportOptions: {
            columns: ":visible",
            stripHtml: false,
          },
        },
      ],
      select: true,
      destroy: true,
      colReorder: true,
      pageLength: initialDatatableLoad,
      lengthMenu: [
        [initialDatatableLoad, -1],
        [initialDatatableLoad, "All"],
      ],
      info: true,
      responsive: true,
      order: [
        [4, "desc"],
        [1, "desc"],
      ],
      action: function () {
        $("#tblAllTaskDatatable").DataTable().ajax.reload();
      },
      fnDrawCallback: function (oSettings) {
        setTimeout(function () {
          // MakeNegative();
        }, 100);
      },
      fnInitComplete: function () {
        $(
          "<button class='btn btn-primary btnSearchAllTask' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button><button class='btn btn-primary btnViewAllCompleted' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i><span id='lblViewAllCompleted'>View Completed</span></button>"
        ).insertAfter("#tblAllTaskDatatable_filter");
      },
    });

    $("#tblTodayTaskDatatable").DataTable({
      columnDefs: [
        {
          orderable: false,
          targets: 0,
        },
        {
          orderable: false,
          targets: 5,
        },
      ],
      colReorder: {
        fixedColumnsLeft: 0,
      },
      sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      buttons: [
        {
          extend: "excelHtml5",
          text: "",
          download: "open",
          className: "btntabletocsv hiddenColumn",
          filename: "Task List" + moment().format(),
          orientation: "portrait",
          exportOptions: {
            columns: ":visible",
            format: {
              body: function (data, row, column) {
                if (data.includes("</span>")) {
                  var res = data.split("</span>");
                  data = res[1];
                }

                return column === 1 ? data.replace(/<.*?>/gi, "") : data;
              },
            },
          },
        },
        {
          extend: "print",
          download: "open",
          className: "btntabletopdf hiddenColumn",
          text: "",
          title: "Task List",
          filename: "Task List" + moment().format(),
          exportOptions: {
            columns: ":visible",
            stripHtml: false,
          },
        },
      ],
      select: true,
      destroy: true,
      colReorder: true,
      pageLength: initialDatatableLoad,
      lengthMenu: [
        [initialDatatableLoad, -1],
        [initialDatatableLoad, "All"],
      ],
      info: true,
      responsive: true,
      order: [
        [4, "desc"],
        [1, "desc"],
      ],
      action: function () {
        $("#tblTodayTaskDatatable").DataTable().ajax.reload();
      },
      fnDrawCallback: function (oSettings) {
        setTimeout(function () {
          // MakeNegative();
        }, 100);
      },
      fnInitComplete: function () {
        $(
          "<button class='btn btn-primary btnSearchTodayTask' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button><button class='btn btn-primary btnViewTodayCompleted' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i><span id='lblViewTodayCompleted'>View Completed</span></button>"
        ).insertAfter("#tblTodayTaskDatatable_filter");
      },
    });

    $("#tblUpcomingTaskDatatable").DataTable({
      columnDefs: [
        {
          orderable: false,
          targets: 0,
        },
        {
          orderable: false,
          targets: 5,
        },
      ],
      colReorder: {
        fixedColumnsLeft: 0,
      },
      sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      buttons: [
        {
          extend: "excelHtml5",
          text: "",
          download: "open",
          className: "btntabletocsv hiddenColumn",
          filename: "Task List" + moment().format(),
          orientation: "portrait",
          exportOptions: {
            columns: ":visible",
            format: {
              body: function (data, row, column) {
                if (data.includes("</span>")) {
                  var res = data.split("</span>");
                  data = res[1];
                }

                return column === 1 ? data.replace(/<.*?>/gi, "") : data;
              },
            },
          },
        },
        {
          extend: "print",
          download: "open",
          className: "btntabletopdf hiddenColumn",
          text: "",
          title: "Task List",
          filename: "Task List" + moment().format(),
          exportOptions: {
            columns: ":visible",
            stripHtml: false,
          },
        },
      ],
      select: true,
      destroy: true,
      colReorder: true,
      pageLength: initialDatatableLoad,
      lengthMenu: [
        [initialDatatableLoad, -1],
        [initialDatatableLoad, "All"],
      ],
      info: true,
      responsive: true,
      order: [
        [4, "desc"],
        [1, "desc"],
      ],
      action: function () {
        $("#tblUpcomingTaskDatatable").DataTable().ajax.reload();
      },
      fnDrawCallback: function (oSettings) {
        setTimeout(function () {
          // MakeNegative();
        }, 100);
      },
      fnInitComplete: function () {
        $(
          "<button class='btn btn-primary btnSearchUpcoming' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button><button class='btn btn-primary btnViewUpcomingCompleted' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i><span id='lblViewUpcomingCompleted'>View Completed</span></button>"
        ).insertAfter("#tblUpcomingTaskDatatable_filter");
      },
    });
  };

  templateObject.getAllTaskList = function () {
    // $(".fullScreenSpin").css("display", "inline-block");

    crmService
      .getAllTaskList()
      .then(function (data) {
        if (data.tprojecttasks && data.tprojecttasks.length > 0) {
          let today = moment().format("YYYY-MM-DD");
          let all_records = data.tprojecttasks;
          // all_records = all_records.filter(item => item.fields.ProjectID == 11);
          templateObject.allWithCompletedRecords.set(all_records);

          all_records = all_records.filter(
            (item) => item.fields.Completed == false
          );

          let today_records = all_records.filter(
            (item) => item.fields.due_date.substring(0, 10) == today
          );
          let upcoming_records = all_records.filter(
            (item) => item.fields.due_date.substring(0, 10) > today
          );
          let overdue_records = all_records.filter(
            (item) =>
              !item.fields.due_date ||
              item.fields.due_date.substring(0, 10) < today
          );

          $(".crm_all_count").text(all_records.length);
          $(".crm_today_count").text(today_records.length);
          $(".crm_upcoming_count").text(upcoming_records.length);

          templateObject.allRecords.set(all_records);
          templateObject.todayRecords.set(today_records);
          templateObject.upcomingRecords.set(upcoming_records);
          templateObject.overdueRecords.set(overdue_records);

          // tempcode
          // let col1 = '';
          // let col2 = '';
          // let col3 = '';
          // let col4 = '';
          // let col5 = '';
          // let col6 = '';
          // var allTableDataList = [];
          // let record = []

          // allRecords.forEach(item => {
          //   col1 = `<div
          //     class="custom-control custom-checkbox chkBox pointer no-modal task_priority_${item.fields.priority}"
          //     style="width:15px;margin-right: -6px;">
          //     <input class="custom-control-input chkBox chkComplete pointer" type="checkbox"
          //       id="formCheck-${item.fields.ID}">
          //     <label class="custom-control-label chkBox pointer chk_complete" data-id="${item.fields.ID}"
          //       for="formCheck-${item.fields.ID}"></label>
          //     </div>`;
          //     col2=``;
          //     col3=``;
          //     col4=``;
          //     col5=``;
          //     col6=``;
          //   record = [col1, col2, col3, col4, col5, col6];
          //   allTableDataList.push(record);

          // });

          // // taskDataTable.ajax.reload();
          // taskDataTable.clear();
          // taskDataTable.rows.add(allTableDataList);
          // taskDataTable.draw(false);
          // tempcode

          setTimeout(() => {
            templateObject.initDatepicker();
          }, 500);

          // $(".fullScreenSpin").css("display", "none");
        } else {
          $(".crm_all_count").text(0);
          $(".crm_today_count").text(0);
          $(".crm_upcoming_count").text(0);
          // $(".fullScreenSpin").css("display", "none");
        }
      })
      .catch(function (err) {
        // $(".fullScreenSpin").css("display", "none");
      });
  };

  templateObject.getAllLabels = function () {
    crmService
      .getAllLabels()
      .then(function (data) {
        if (
          data.tprojecttask_tasklabel &&
          data.tprojecttask_tasklabel.length > 0
        ) {
          let alllabels = data.tprojecttask_tasklabel;
          templateObject.alllabels.set(alllabels);

          let label_dropdowns = "";
          alllabels.forEach((lbl) => {
            label_dropdowns += `<a class="dropdown-item"><i class="fas fa-tag text-primary" style="margin-right: 8px;"></i>${lbl.fields.TaskLabelName}
            <div style="width: 20%; float: right;">
              <div class="custom-control custom-checkbox chkBox pointer"
                style="width: 15px; float: right;">
                <input class="custom-control-input chkBox chkLabel pointer" type="checkbox"
                  id="detail_label_${lbl.fields.ID}" name="${lbl.fields.ID}" value="">
                <label class="custom-control-label chkBox pointer" for="detail_label_${lbl.fields.ID}"></label>
              </div>
            </div>
          </a>`;
          });
          $("#addTaskLabelWrapper").html(label_dropdowns);
          $(".addTaskLabelWrapper").html(label_dropdowns); // for detail modal

          // setTimeout(() => {
          //   templateObject.initLabelsTable();
          // }, 2000);
        } else {
          templateObject.alllabels.set([]);
        }
      })
      .catch(function (err) {});
  };

  templateObject.getTProjectList = function () {
    crmService
      .getTProjectList()
      .then(function (data) {
        if (data.tprojectlist && data.tprojectlist.length > 0) {
          let all_projects = data.tprojectlist;
          all_projects = all_projects.filter(
            (proj) => proj.fields.Active == true && proj.fields.ID != 11
          );

          let add_projectlist = `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="11" data-projectname="All Tasks"><i class="fas fa-inbox text-primary no-modal"
          style="margin-right: 8px;"></i>All Tasks</a>`;

          let tbodyMovetoProjectTable = `<tr><td></td><td>All Tasks</td></tr>`;

          let ProjectName = "";
          all_projects.forEach((proj) => {
            ProjectName =
              proj.fields.ProjectName.length > 26
                ? proj.fields.ProjectName.substring(0, 26) + "..."
                : proj.fields.ProjectName;

            add_projectlist += `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="${proj.fields.ID}" data-projectname="${proj.fields.ProjectName}"><i class="fas fa-circle no-modal" style="margin-right: 8px; color: ${proj.fields.ProjectColour};"></i>${ProjectName}</a>`;

            tbodyMovetoProjectTable += `<tr><td></td><td>${ProjectName}</td></tr>`;
          });
          $("#tbodyMovetoProjectTable").html(tbodyMovetoProjectTable);

          $("#goProjectWrapper").html(add_projectlist);
          $(".goProjectWrapper").html(add_projectlist);

          let active_projects = all_projects.filter(
            (project) => project.fields.Active == true
          );
          let deleted_projects = all_projects.filter(
            (project) => project.fields.Active == false
          );
          let favorite_projects = active_projects.filter(
            (project) => project.fields.AddToFavourite == true
          );

          templateObject.all_projects.set(all_projects);
          templateObject.active_projects.set(active_projects);
          templateObject.deleted_projects.set(deleted_projects);
          templateObject.favorite_projects.set(favorite_projects);

          $(".crm_project_count").html(active_projects.length);

          setTimeout(() => {
            // templateObject.initProjectsTable();
          }, 100);
        } else {
          templateObject.tprojectlist.set([]);
          $(".crm_project_count").html(0);
        }
      })
      .catch(function (err) {});
  };

  templateObject.getAllTaskList();
  // templateObject.getAllLabels();
  // templateObject.getTProjectList();

  setTimeout(() => {
    templateObject.initTable();
  }, 9000);
});

Template.alltaskdatatable.events({
  "click .btnAddSubTask": function (event) {
    $("#newTaskModal").modal("toggle");
  },

  "click .btnCancelAddTask": function (event) {
    $(".btnAddSubTask").css("display", "block");
    $(".newTaskRow").css("display", "none");
    $(".addTaskModal").css("display", "none");
  },

  // show edit name & description fields
  "click .rename-task": function (e) {
    $(".displayTaskNameDescription").css("display", "none");
    $(".editTaskNameDescription").css("display", "inline-block");

    $(".editTaskDetailName").val($("#taskmodalNameLabel").html());
    $(".editTaskDetailDescription").val($("#taskmodalDescription").html());
  },

  // complete task
  "click .chk_complete": function (e) {
    let id = e.target.dataset.id;
    if (id == "edit") id = $("#txtCrmTaskID").val();
    // handle complete process via api
    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        Completed: true,
      },
    };

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (objDetails) {
        // $('#ttodo_' + id).remove();
        $(".chkComplete").prop("checked", false);
        // recalculate count here
        templateObject.getAllTaskList();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  // delete task
  "click .delete-task": function (e) {
    let id = e.target.dataset.id;
    if (id == "edit") id = $("#txtCrmTaskID").val();
    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        Active: false,
      },
    };

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (objDetails) {
        // recalculate count here
        templateObject.getAllTaskList();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  // duplicate task
  "click .duplicate-task": function (e) {
    let templateObject = Template.instance();
    let id = e.target.dataset.id;
    let projectID = $("#editProjectID").val() ? $("#editProjectID").val() : 11;

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      crmService
        .getTaskDetail(id)
        .then(function (data) {
          $(".fullScreenSpin").css("display", "none");
          if (data.fields.ID == id) {
            let selected_record = data.fields;
            // handle complete process via api
            var objDetails = {
              type: "Tprojecttasks",
              fields: {
                TaskName: "Copy of " + selected_record.TaskName,
                TaskDescription: selected_record.TaskDescription,
                due_date: selected_record.due_date,
                priority: selected_record.priority,
                ProjectID: projectID,
                // TaskLabel: selected_record.TaskLabel,
                Completed: false,
              },
            };

            crmService
              .saveNewTask(objDetails)
              .then(function (data) {
                // recalculate count here
                templateObject.getAllTaskList();
                $(".fullScreenSpin").css("display", "none");
              })
              .catch(function (err) {
                $(".fullScreenSpin").css("display", "none");
                swal(err, "", "error");
                return;
              });
          } else {
            swal("Cannot duplicate this task", "", "warning");
            return;
          }
        })
        .catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
          swal(err, "", "error");
          return;
        });
    }
  },

  // set projectID in edit
  "click .setProjectIDEdit": function (e) {
    let projectID = e.target.dataset.projectid;
    $("#editProjectID").val(projectID);
  },

  // set projectID in add
  "click .setProjectIDAdd": function (e) {
    let projectid = e.target.dataset.projectid;
    let projectName = e.target.dataset.projectname;
    projectName =
      projectName.length > 26
        ? projectName.substring(0, 26) + "..."
        : projectName;

    $("#addProjectID").val(projectid);
    // $(".addTaskModalProjectName").html(projectName);
    $("#taskDetailModalCategoryLabel").html(
      `<i class="fas fa-inbox text-primary" style="margin-right: 5px;"></i>${projectName}`
    );

    let templateObject = Template.instance();
    let taskid = $("#txtCrmTaskID").val();

    if (taskid && projectid) {
      var objDetails = {
        type: "Tprojecttasks",
        fields: {
          ID: taskid,
          ProjectID: projectid,
        },
      };

      $(".fullScreenSpin").css("display", "inline-block");
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();

        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  // set priority in add
  "click .chkPriorityAdd": function (e) {
    let value = e.target.value;
    value = value == undefined ? 3 : value;

    $("#chkPriorityAdd0").prop("checked", false);
    $("#chkPriorityAdd1").prop("checked", false);
    $("#chkPriorityAdd2").prop("checked", false);
    $("#chkPriorityAdd3").prop("checked", false);
    $("#chkPriorityAdd" + value).prop("checked", true);

    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_3");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_2");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_1");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_0");
    $(".taskModalActionFlagDropdown").addClass("task_modal_priority_" + value);
  },

  // update task rename task
  "click .btnSaveEditTask": function (e) {
    let taskID = $("#txtCrmTaskID").val();
    if (taskID) {
      let selected_lbls = [];
      let unselected_lbls = [];
      $("#detailTaskLabelWrapper input:checked").each(function () {
        selected_lbls.push($(this).attr("name"));
      });
      $("#detailTaskLabelWrapper input:unchecked").each(function () {
        unselected_lbls.push($(this).attr("name"));
      });

      let editTaskDetailName = $(".editTaskDetailName").val();
      let editTaskDetailDescription = $(".editTaskDetailDescription").val();
      if (editTaskDetailName == "") {
        swal("Please endter the task name", "", "warning");
        return;
      }

      let templateObject = Template.instance();
      var objDetails = {
        type: "Tprojecttasks",
        fields: {
          ID: taskID,
          TaskName: editTaskDetailName,
          TaskDescription: editTaskDetailDescription,
        },
      };
      $(".fullScreenSpin").css("display", "inline-block");
      crmService.saveNewTask(objDetails).then(function (data) {
        $(".displayTaskNameDescription").css("display", "inline-block");
        $(".editTaskNameDescription").css("display", "none");
        $(".fullScreenSpin").css("display", "none");
      });

      // tempcode until api is updated
      selected_lbls.forEach((lbl) => {
        crmService
          .updateLabel({
            type: "Tprojecttask_TaskLabel",
            fields: {
              ID: lbl,
              TaskID: taskID,
            },
          })
          .then(function (data) {});
      });
      // unselected_lbls.forEach((lbl) => {
      //   crmService
      //     .updateLabel({
      //       type: "Tprojecttask_TaskLabel",
      //       fields: {
      //         ID: lbl,
      //         TaskID: 1,
      //       },
      //     })
      //     .then(function (data) {});
      // });

      setTimeout(() => {
        templateObject.getAllTaskList();
      }, 3000);
    }
  },

  // submit save new task add task
  "click .btnSaveAddTask": function (e) {
    let task_name = $("#add_task_name").val();
    let task_description = $("#add_task_description").val();
    let subTaskID = $("#txtCrmSubTaskID").val();
    let templateObject = Template.instance();

    let due_date = $(".crmEditDatepicker").val();
    due_date = due_date
      ? moment(due_date).format("YYYY-MM-DD hh:mm:ss")
      : moment().format("YYYY-MM-DD hh:mm:ss");

    let priority = 0;
    priority = $("#chkPriorityAdd1").prop("checked")
      ? 1
      : $("#chkPriorityAdd2").prop("checked")
      ? 2
      : $("#chkPriorityAdd3").prop("checked")
      ? 3
      : 0;

    if (task_name === "") {
      swal("Task name is not entered!", "", "warning");
      return;
    }
    $(".fullScreenSpin").css("display", "inline-block");
    let projectID = $("#addProjectID").val() ? $("#addProjectID").val() : 11;
    projectID = $("#editProjectID").val()
      ? $("#editProjectID").val()
      : projectID;

    let selected_lbls = [];
    $("#addTaskLabelWrapper input:checked").each(function () {
      selected_lbls.push($(this).attr("name"));
    });

    // tempcode
    // subtask api is not completed
    // label api is not completed
    if (subTaskID) {
      var objDetails = {
        type: "Tprojecttask_subtasks",
        fields: {
          TaskID: subTaskID,
          SubTaskName: task_name,
          SubTaskDescription: task_description,
          ProjectID: projectID,
          SubTaskDate: due_date,
          priority: priority,
        },
      };
    } else {
      var objDetails = {
        type: "Tprojecttasks",
        fields: {
          TaskName: task_name,
          TaskDescription: task_description,
          Completed: false,
          ProjectID: projectID,
          due_date: due_date,
          priority: priority,
        },
      };
    }

    crmService
      .saveNewTask(objDetails)
      .then(function (res) {
        if (res.fields.ID) {
          $(".btnAddSubTask").css("display", "block");
          $(".newTaskRow").css("display", "none");
          $(".addTaskModal").css("display", "none");

          $("#chkPriorityAdd0").prop("checked", false);
          $("#chkPriorityAdd1").prop("checked", false);
          $("#chkPriorityAdd2").prop("checked", false);
          $("#chkPriorityAdd3").prop("checked", false);

          // add labels to New task
          // tempcode until api is updated
          selected_lbls.forEach((lbl) => {
            crmService
              .updateLabel({
                type: "Tprojecttask_TaskLabel",
                fields: {
                  ID: lbl,
                  TaskID: res.fields.ID,
                },
              })
              .then(function (data) {});
          });

          //////////////////////////////
          setTimeout(() => {
            templateObject.getAllTaskList();
          }, 1000);
          $("#newTaskModal").modal("hide");
          $("#newProjectTasksModal").modal("hide");
        }

        $(".fullScreenSpin").css("display", "none");

        $("#add_task_name").val("");
        $("#add_task_description").val("");
      })
      .catch(function (err) {
        swal({
          title: "Oooops...",
          text: err,
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        }).then((result) => {});
        $(".fullScreenSpin").css("display", "none");
      });
  },

  // submit set schedule as today
  "click .setScheduleToday": function (e) {
    let id = e.target.dataset.id;

    let currentDate = new Date();
    let due_date = moment(currentDate).format("YYYY-MM-DD hh:mm:ss");

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: due_date,
      },
    };

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  // submit set schedule as tomorrow
  "click .setScheduleTomorrow": function (e) {
    let id = e.target.dataset.id;
    let tomorrow = moment().add(1, "day").format("YYYY-MM-DD hh:mm:ss");

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: tomorrow,
      },
    };

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  // submit set schedule as weekend
  "click .setScheduleWeekend": function (e) {
    let id = e.target.dataset.id;
    let weekend = moment().endOf("week").format("YYYY-MM-DD hh:mm:ss");

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: weekend,
      },
    };

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  // submit set schedule as next week
  "click .setScheduleNexweek": function (e) {
    let id = e.target.dataset.id;

    var startDate = moment();
    let next_monday = moment(startDate)
      .day(1 + 7)
      .format("YYYY-MM-DD hh:mm:ss");

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: next_monday,
      },
    };

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  // submit set schedule as no-date
  "click .setScheduleNodate": function (e) {
    let id = e.target.dataset.id;

    var objDetails = {
      type: "Tprojecttasks",
      fields: {
        ID: id,
        due_date: "",
      },
    };

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  // set due_date
  "click .setScheduleTodayAdd": function (e) {
    let due_date = moment().format("YYYY-MM-DD hh:mm:ss");
    $(".crmEditDatepicker").val(due_date);
  },

  // set due_date
  "click .setScheduleTomorrowAdd": function (e) {
    let due_date = moment().add(1, "day").format("YYYY-MM-DD hh:mm:ss");
    $(".crmEditDatepicker").val(due_date);
  },

  // set due_date
  "click .setScheduleWeekendAdd": function (e) {
    let due_date = moment().endOf("week").format("YYYY-MM-DD hh:mm:ss");
    $(".crmEditDatepicker").val(due_date);
  },

  // set due_date
  "click .setScheduleNexweekAdd": function (e) {
    var startDate = moment();
    let due_date = moment(startDate)
      .day(1 + 7)
      .format("YYYY-MM-DD hh:mm:ss");

    $(".crmEditDatepicker").val(due_date);
  },

  // set due_date
  "click .setScheduleNodateAdd": function (e) {
    $(".crmEditDatepicker").val(null);
  },

  // update priority
  "click .taskDropSecondFlag": function (e) {
    let id = e.target.dataset.id;
    let priority = e.target.dataset.priority;

    if (id && priority) {
      if (id == "edit") {
        id = $("#txtCrmTaskID").val();

        $("#chkPriority0").prop("checked", false);
        $("#chkPriority1").prop("checked", false);
        $("#chkPriority2").prop("checked", false);
        $("#chkPriority3").prop("checked", false);
        $("#chkPriority" + priority).prop("checked", true);

        $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_3");
        $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_2");
        $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_1");
        $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_0");
        $(".taskModalActionFlagDropdown").addClass(
          "task_modal_priority_" + priority
        );
      }
      var objDetails = {
        type: "Tprojecttasks",
        fields: {
          ID: id,
          priority: priority,
        },
      };

      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();

        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  "click .sectionOpened": function (event) {
    $(".sectionOpened").css("display", "none");
    $(".sectionClosed").css("display", "inline-flex");
    $(".sectionCol1").css("display", "none");
  },

  "click .sectionClosed": function (event) {
    $(".sectionOpened").css("display", "inline-flex");
    $(".sectionClosed").css("display", "none");
    $(".sectionCol1").css("display", "inline");
  },

  "click .btnNewFilter": function (event) {
    $("#newFilterModal").modal("toggle");
  },

  "click .btnNewLabel": function (event) {
    $("#newLabelModal").modal("toggle");
  },

  // view all completed task
  "click .btnViewAllCompleted": function (e) {
    let templateObject = Template.instance();
    let allCompletedRecords = templateObject.allWithCompletedRecords.get();

    let lblViewCompleted = $("#lblViewAllCompleted").html().trim();
    if (lblViewCompleted == "View Completed") {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == true
      );
      $("#lblViewAllCompleted").html("View Task");
    } else {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == false
      );
      $("#lblViewAllCompleted").html("View Completed");
    }

    templateObject.allRecords.set(allCompletedRecords);
  },

  // view today completed task
  "click .btnViewTodayCompleted": function (e) {
    e.stopImmediatePropagation();

    let templateObject = Template.instance();
    let allCompletedRecords = templateObject.allWithCompletedRecords.get();
    let today = moment().format("YYYY-MM-DD");
    allCompletedRecords = allCompletedRecords.filter(
      (item) => item.fields.due_date.substring(0, 10) == today
    );

    let lblViewCompleted = $("#lblViewTodayCompleted").html().trim();
    if (lblViewCompleted == "View Completed") {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == true
      );
      $("#lblViewTodayCompleted").html("View Task");
    } else {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == false
      );
      $("#lblViewTodayCompleted").html("View Completed");
    }

    templateObject.todayRecords.set(allCompletedRecords);
  },

  // view upcoming completed task
  "click .btnViewUpcomingCompleted": function (e) {
    e.stopImmediatePropagation();

    let templateObject = Template.instance();
    let allCompletedRecords = templateObject.allWithCompletedRecords.get();

    let today = moment().format("YYYY-MM-DD");
    allCompletedRecords = allCompletedRecords.filter(
      (item) => item.fields.due_date.substring(0, 10) > today
    );

    let lblViewCompleted = $("#lblViewUpcomingCompleted").html().trim();
    if (lblViewCompleted == "View Completed") {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == true
      );
      $("#lblViewUpcomingCompleted").html("View Task");
    } else {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == false
      );
      $("#lblViewUpcomingCompleted").html("View Completed");
    }

    templateObject.upcomingRecords.set(allCompletedRecords);
  },

  // submit save new project
  "click .btnSaveNewCrmProject": function (e) {
    let projectName = $("#crmProjectName").val();
    let projectColor = $("#crmProjectColor").val();
    let projectDescription = $("#crmProjectDescription").val();

    // let swtNewCrmProjectFavorite = $("#swtNewCrmProjectFavorite").prop(
    //   "checked"
    // );

    if (projectName === "" || projectName === null) {
      swal("Project name is not entered!", "", "warning");
      return;
    }

    $(".fullScreenSpin").css("display", "inline-block");

    var objDetails = {
      type: "Tprojectlist",
      fields: {
        Active: true,
        ProjectName: projectName,
        ProjectColour: projectColor,
        Description: projectDescription,
        // AddToFavourite: swtNewCrmProjectFavorite,
      },
    };
    let templateObject = Template.instance();

    crmService
      .updateProject(objDetails)
      .then(function (data) {
        templateObject.getTProjectList();

        $("#crmProjectName").val("");
        $("#crmProjectDescription").val("");
        $("#crmProjectColor").val("#000000");
        $("#swtNewCrmProjectFavorite").prop("checked", false);

        $("#newCrmProject").modal("hide");
        $(".fullScreenSpin").css("display", "none");

        $("#projectsTab-tab").click();
        // Meteor._reload.reload();
      })
      .catch(function (err) {
        swal({
          title: "Oooops...",
          text: err,
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        }).then((result) => {});
        $(".fullScreenSpin").css("display", "none");
      });
  },

  "click .movetoproject": function (e) {
    let taskid = e.target.dataset.id;
    let projectid = e.target.dataset.projectid;
    // $("#txtCrmTaskID").val(taskid);
    // $("#txtCrmProjectID").val(projectid);
    let templateObject = Template.instance();
    templateObject.task_id.set(taskid);
    templateObject.project_id.set(projectid);

    $(".fullScreenSpin").css("display", "inline-block");
    crmService.getTProjectList().then(function (data) {
      if (data.tprojectlist && data.tprojectlist.length > 0) {
        let all_projects = data.tprojectlist;
        all_projects = all_projects.filter(
          (proj) => proj.fields.Active == true && proj.fields.ID != 11
        );

        let checked = projectid == "11" ? "checked" : "";

        let tbodyMovetoProjectTable = `
        <tr class="trMovetoproject" data-id="11">
          <td style="width:30px;" data-id="11">
            <div class="custom-control custom-checkbox chkBox pointer chkMovetoproject"
              style="width:15px;margin-right: -6px;" data-id="11">
              <input class="custom-control-input chkBox pointer chkMovetoproject" type="checkbox"
                id="chkMovetoproject-11" ${checked} data-id="11">
              <label class="custom-control-label chkBox pointer" data-id="11"
                for="chkMovetoproject-11"></label>
            </div>
          </td>
          <td style="width:auto" data-id="11">All Tasks</td>
        </tr>`;

        let ProjectName = "";
        all_projects.forEach((proj) => {
          if (projectid == proj.fields.ID) {
            checked = "checked";
          } else {
            checked = "";
          }
          ProjectName =
            proj.fields.ProjectName.length > 40
              ? proj.fields.ProjectName.substring(0, 40) + "..."
              : proj.fields.ProjectName;

          tbodyMovetoProjectTable += `
          <tr class="trMovetoproject" data-id="${proj.fields.ID}">
            <td data-id="${proj.fields.ID}">
              <div class="custom-control custom-checkbox chkBox pointer chkMovetoproject"
                style="width:15px;margin-right: -6px;" data-id="${proj.fields.ID}">
                <input class="custom-control-input chkBox pointer chkMovetoproject" type="checkbox"
                  id="chkMovetoproject-${proj.fields.ID}" ${checked} data-id="${proj.fields.ID}">
                <label class="custom-control-label chkBox pointer" data-id="${proj.fields.ID}"
                  for="chkMovetoproject-${proj.fields.ID}"></label>
              </div>
            </td>
            <td data-id="${proj.fields.ID}">${ProjectName}</td>
          </tr>`;
        });
        $("#tbodyMovetoProjectTable").html(tbodyMovetoProjectTable);
        $(".fullScreenSpin").css("display", "none");
      }
    });

    $("#movetoprojectsmodal").modal();
  },

  "click .trMovetoproject": function (e) {
    let projectid = e.target.dataset.id;
    $(".chkMovetoproject").prop("checked", false);
    $("#chkMovetoproject-" + projectid).prop("checked", true);
    let templateObject = Template.instance();
    templateObject.project_id.set(projectid);
  },

  // submit move to project
  "click .btnMovetoproject": function (e) {
    let templateObject = Template.instance();
    let taskid = templateObject.task_id.get();
    let projectid = templateObject.project_id.get();

    if (taskid && projectid) {
      var objDetails = {
        type: "Tprojecttasks",
        fields: {
          ID: taskid,
          ProjectID: projectid,
        },
      };

      $(".fullScreenSpin").css("display", "inline-block");
      crmService.saveNewTask(objDetails).then(function (data) {
        templateObject.getAllTaskList();

        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  "click .add_label": function (e) {
    let labelid = e.target.dataset.id;
  },

  "click .detail_label": function (e) {
    let labelid = e.target.dataset.id;
  },
});

Template.alltaskdatatable.helpers({
  alllabels: () => {
    return Template.instance().alllabels.get();
  },
  allRecords: () => {
    return Template.instance().allRecords.get();
  },

  overdueRecords: () => {
    return Template.instance().overdueRecords.get();
  },

  todayRecords: () => {
    return Template.instance().todayRecords.get();
  },

  upcomingRecords: () => {
    return Template.instance().upcomingRecords.get();
  },

  getTodoDate: (date, format) => {
    if (date == "" || date == null) return "";
    return moment(date).format(format);

    if (moment().format("YYYY-MM-DD") == moment(date).format("YYYY-MM-DD")) {
      return "Today";
    } else if (
      moment().add(1, "day").format("YYYY-MM-DD") ==
      moment(date).format("YYYY-MM-DD")
    ) {
      return "Tomorrow";
    } else {
      return moment(date).format(format);
    }
  },

  getTaskStyleClass: (date) => {
    if (date == "" || date == null) return "taskNodate";
    if (moment().format("YYYY-MM-DD") == moment(date).format("YYYY-MM-DD")) {
      return "taskToday";
    } else if (
      moment().add(1, "day").format("YYYY-MM-DD") ==
      moment(date).format("YYYY-MM-DD")
    ) {
      return "taskTomorrow";
    } else if (
      moment().format("YYYY-MM-DD") > moment(date).format("YYYY-MM-DD")
    ) {
      return "taskOverdue";
    } else {
      return "taskUpcoming";
    }
  },

  getTodayDate: (format) => {
    return moment().format(format);
  },

  getTomorrowDay: () => {
    return moment().add(1, "day").format("ddd");
  },

  getNextMonday: () => {
    var startDate = moment();
    return moment(startDate)
      .day(1 + 7)
      .format("ddd MMM D");
  },

  getDescription: (description) => {
    return description.length < 80
      ? description
      : description.substring(0, 79) + "...";
  },

  getProjectName: (projectName) => {
    if (projectName == "" || projectName == "Default") {
      return "All Tasks";
    }
    return projectName;
  },

  getTaskLabel: (labels) => {
    if (labels == "" || labels == null) {
      return "";
    } else if (labels.type == undefined) {
      let label_string = "";
      labels.forEach((label) => {
        label_string += label.fields.TaskLabelName + ", ";
      });
      return label_string.slice(0, -2);
    } else {
      return labels.fields.TaskLabelName;
    }
  },

  active_projects: () => {
    return Template.instance().active_projects.get();
  },

  deleted_projects: () => {
    return Template.instance().deleted_projects.get();
  },

  favorite_projects: () => {
    return Template.instance().favorite_projects.get();
  },
});
