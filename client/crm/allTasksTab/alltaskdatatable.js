import "../../lib/global/indexdbstorage.js";
import { CRMService } from "../crm-service";
let crmService = new CRMService();

Template.alltaskdatatable.onCreated(function () {
  let templateObject = Template.instance();
  // templateObject.tprojectlist = new ReactiveVar([]);
  templateObject.allRecords = new ReactiveVar([]);
  templateObject.allWithCompletedRecords = new ReactiveVar([]);
  templateObject.todayRecords = new ReactiveVar([]);
  templateObject.upcomingRecords = new ReactiveVar([]);

  templateObject.allRecordsArray = new ReactiveVar([]);
  templateObject.todayRecordsArray = new ReactiveVar([]);
  templateObject.upcomingRecordsArray = new ReactiveVar([]);

  templateObject.overdueRecords = new ReactiveVar([]);
  templateObject.selected_id = new ReactiveVar(0);
  templateObject.task_id = new ReactiveVar(0);
  templateObject.project_id = new ReactiveVar(0);
  templateObject.selected_ttodo = new ReactiveVar("");
  templateObject.due_date = new ReactiveVar(null);

  templateObject.view_all_task_completed = new ReactiveVar("NO");
  templateObject.view_today_task_completed = new ReactiveVar("NO");
  templateObject.view_uncoming_task_completed = new ReactiveVar("NO");
  templateObject.view_project_completed = new ReactiveVar("NO");

  // projects tab
  templateObject.tprojectlist = new ReactiveVar([]);
  templateObject.all_projects = new ReactiveVar([]);
  templateObject.active_projects = new ReactiveVar([]);
  templateObject.deleted_projects = new ReactiveVar([]);
  templateObject.favorite_projects = new ReactiveVar([]);
  templateObject.projecttasks = new ReactiveVar([]);
  templateObject.active_projecttasks = new ReactiveVar([]);
  templateObject.view_projecttasks_completed = new ReactiveVar("NO");
  // projects tab

  // labels tab
  templateObject.alllabels = new ReactiveVar([]);
  templateObject.allfilters = new ReactiveVar([]);
  // labels tab
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
  };

  // initialize 3 tasks datatable
  templateObject.initTable = function () {
    let splashArrayTaskList = templateObject.makeTaskTableRows(
      templateObject.allRecords.get()
    );
    let view_all_task_completed = templateObject.view_all_task_completed.get();
    let btnFilterName =
      view_all_task_completed == "NO" ? "View Completed" : "Hide Completed";

    $("#tblAllTaskDatatable").DataTable({
      data: splashArrayTaskList,
      columnDefs: [
        {
          orderable: false,
          targets: 0,
          className: "colCompleteTask",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).closest("tr").attr("data-id", rowData[6]);
            $(td).attr("data-id", rowData[6]);
            $(td).addClass("task_priority_" + rowData[7]);
          },
          width: "18px",
        },
        {
          targets: 1,
          className: "colDate openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
          width: "120px",
        },
        {
          targets: 2,
          className: "colTaskName openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          targets: 3,
          className: "colTaskDesc openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          targets: 4,
          className: "colTaskLabels",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          orderable: false,
          targets: 5,
          className: "colTaskActions",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
          width: "150px",
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
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 0 || idx == 5) {
                return false;
              }
              return true;
            },
            format: {
              body: function (data, row, column) {
                let col_lbl = "";
                let lbl = "";
                if (data.includes("</span>")) {
                  var res = data.split("</span>");
                  res.forEach((element) => {
                    lbl = element.split("</i>");
                    if (lbl[1] != undefined) {
                      col_lbl += lbl[1].replace("</a>", "") + ", ";
                    }
                  });
                } else {
                  col_lbl = data;
                }

                return column === 1
                  ? col_lbl.replace(/<.*?>/gi, "").slice(0, -1)
                  : col_lbl.slice(0, -1);
              },
            },
            stripHtml: false,
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
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 0 || idx == 5) {
                return false;
              }
              return true;
            },
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
          "<button class='btn btn-primary btnSearchCrm' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button><button class='btn btn-primary btnViewAllCompleted' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i><span id='lblViewAllCompleted'>" +
            btnFilterName +
            "</span></button>"
        ).insertAfter("#tblAllTaskDatatable_filter");
      },
    });

    let todayTaskArray = templateObject.makeTaskTableRows(
      templateObject.todayRecords.get()
    );
    let view_today_task_completed =
      templateObject.view_today_task_completed.get();
    btnFilterName =
      view_today_task_completed == "NO" ? "View Completed" : "Hide Completed";
    $("#tblTodayTaskDatatable").DataTable({
      data: todayTaskArray,
      columnDefs: [
        {
          orderable: false,
          targets: 0,
          className: "colCompleteTask",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).closest("tr").attr("data-id", rowData[6]);
            $(td).attr("data-id", rowData[6]);
            $(td).addClass("task_priority_" + rowData[7]);
          },
          width: "18px",
        },
        {
          targets: 1,
          className: "colDate openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
          width: "120px",
        },
        {
          targets: 2,
          className: "colTaskName openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          targets: 3,
          className: "colTaskDesc openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          targets: 4,
          className: "colTaskLabels",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          orderable: false,
          targets: 5,
          className: "colTaskActions",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
          width: "150px",
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
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 0 || idx == 5) {
                return false;
              }
              return true;
            },
            format: {
              body: function (data, row, column) {
                let col_lbl = "";
                let lbl = "";
                if (data.includes("</span>")) {
                  var res = data.split("</span>");
                  res.forEach((element) => {
                    lbl = element.split("</i>");
                    if (lbl[1] != undefined) {
                      col_lbl += lbl[1].replace("</a>", "") + ", ";
                    }
                  });
                } else {
                  col_lbl = data;
                }

                return column === 1
                  ? col_lbl.replace(/<.*?>/gi, "").slice(0, -1)
                  : col_lbl.slice(0, -1);
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
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 0 || idx == 5) {
                return false;
              }
              return true;
            },
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
          "<button class='btn btn-primary btnSearchCrm' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button><button class='btn btn-primary btnViewTodayCompleted' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i><span id='lblViewTodayCompleted'>" +
            btnFilterName +
            "</span></button>"
        ).insertAfter("#tblTodayTaskDatatable_filter");
      },
    });

    let upcomingTaskArray = templateObject.makeTaskTableRows(
      templateObject.upcomingRecords.get()
    );
    let view_uncoming_task_completed =
      templateObject.view_uncoming_task_completed.get();
    btnFilterName =
      view_uncoming_task_completed == "NO"
        ? "View Completed"
        : "Hide Completed";
    $("#tblUpcomingTaskDatatable").DataTable({
      data: upcomingTaskArray,
      columnDefs: [
        {
          orderable: false,
          targets: 0,
          className: "colCompleteTask",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).closest("tr").attr("data-id", rowData[6]);
            $(td).attr("data-id", rowData[6]);
            $(td).addClass("task_priority_" + rowData[7]);
          },
          width: "18px",
        },
        {
          targets: 1,
          className: "colDate openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
          width: "120px",
        },
        {
          targets: 2,
          className: "colTaskName openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          targets: 3,
          className: "colTaskDesc openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          targets: 4,
          className: "colTaskLabels",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          orderable: false,
          targets: 5,
          className: "colTaskActions",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
          width: "150px",
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
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 0 || idx == 5) {
                return false;
              }
              return true;
            },
            format: {
              body: function (data, row, column) {
                let col_lbl = "";
                let lbl = "";
                if (data.includes("</span>")) {
                  var res = data.split("</span>");
                  res.forEach((element) => {
                    lbl = element.split("</i>");
                    if (lbl[1] != undefined) {
                      col_lbl += lbl[1].replace("</a>", "") + ", ";
                    }
                  });
                } else {
                  col_lbl = data;
                }

                return column === 1
                  ? col_lbl.replace(/<.*?>/gi, "").slice(0, -1)
                  : col_lbl.slice(0, -1);
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
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 0 || idx == 5) {
                return false;
              }
              return true;
            },
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
          "<button class='btn btn-primary btnSearchCrm' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button><button class='btn btn-primary btnViewUpcomingCompleted' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i><span id='lblViewUpcomingCompleted'>" +
            btnFilterName +
            "</span></button>"
        ).insertAfter("#tblUpcomingTaskDatatable_filter");
      },
    });

    // if project task modal is opened,
    // initialize projecttask table
    let id = $("#editProjectID").val();
    if (id) {
      crmService
        .getTProjectDetail(id)
        .then(function (data) {
          $(".fullScreenSpin").css("display", "none");
          if (data.fields.ID == id) {
            let selected_record = data.fields;

            // set task list
            let active_projecttasks = [];
            let projecttasks = [];
            if (selected_record.projecttasks) {
              if (selected_record.projecttasks.fields == undefined) {
                projecttasks = selected_record.projecttasks;
              } else {
                projecttasks.push(selected_record.projecttasks);
              }

              active_projecttasks = projecttasks.filter(
                (item) =>
                  item.fields.Active == true && item.fields.Completed == false
              );
            }
            templateObject.projecttasks.set(projecttasks);
            templateObject.active_projecttasks.set(active_projecttasks);

            templateObject.initProjectTasksTable();
          } else {
            return;
          }
        })
        .catch(function (err) {
          swal(err, "", "error");
          return;
        });
    }

    setTimeout(() => {
      templateObject.initDatepicker();
    }, 500);
  };

  templateObject.getInitialAllTaskList = function () {
    $(".fullScreenSpin").css("display", "inline-block");
    getVS1Data("TCRMTaskList")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          templateObject.getAllTaskList();
        } else {
          let data = JSON.parse(dataObject[0].data);
          let today = moment().format("YYYY-MM-DD");
          let all_records = data.tprojecttasks;
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

          setTimeout(() => {
            templateObject.initTable();
          }, 1000);

          $(".fullScreenSpin").css("display", "none");
        }
      })
      .catch(function (err) {
        templateObject.getAllTaskList();
      });
  };

  templateObject.getAllTaskList = function () {
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

          setTimeout(() => {
            templateObject.initTable();
          }, 500);

          addVS1Data("TCRMTaskList", JSON.stringify(data));
        } else {
          $(".crm_all_count").text(0);
          $(".crm_today_count").text(0);
          $(".crm_upcoming_count").text(0);
        }
        $(".fullScreenSpin").css("display", "none");
      })
      .catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
      });
  };

  templateObject.getInitialAllTaskList();

  templateObject.makeTaskTableRows = function (task_array) {
    let taskRows = new Array();
    let td0 = (td1 = td2 = td3 = td4 = td5 = "");
    let projectName = "";
    let labelsForExcel = "";

    let todayDate = moment().format("ddd");
    let tomorrowDay = moment().add(1, "day").format("ddd");
    let nextMonday = moment(moment())
      .day(1 + 7)
      .format("ddd MMM D");

    task_array.forEach((item) => {
      td0 = `
        <div class="custom-control custom-checkbox chkBox pointer no-modal task_priority_${item.fields.priority}"
          style="width:15px;margin-right: -6px;">
          <input class="custom-control-input chkBox chkComplete pointer" type="checkbox"
            id="formCheck-${item.fields.ID}">
          <label class="custom-control-label chkBox pointer chk_complete" data-id="${item.fields.ID}"
            for="formCheck-${item.fields.ID}"></label>
        </div>`;

      if (item.fields.due_date == "" || item.fields.due_date == null) {
        td1 = "";
      } else {
        td1 = moment(item.fields.due_date).format("DD/MM/YYYY");
      }

      td2 = item.fields.TaskName;
      td3 =
        item.fields.TaskDescription.length < 80
          ? item.fields.TaskDescription
          : item.fields.TaskDescription.substring(0, 79) + "...";

      if (item.fields.TaskLabel) {
        if (item.fields.TaskLabel.fields) {
          td4 = `<span class="taskTag"><a class="taganchor filterByLabel" href="" data-id="${item.fields.TaskLabel.fields.ID}"><i class="fas fa-tag"
          style="margin-right: 5px;" data-id="${item.fields.TaskLabel.fields.ID}"></i>${item.fields.TaskLabel.fields.TaskLabelName}</a></span>`;
          labelsForExcel = item.fields.TaskLabel.fields.TaskLabelName;
        } else {
          item.fields.TaskLabel.forEach((lbl) => {
            td4 += `<span class="taskTag"><a class="taganchor filterByLabel" href="" data-id="${lbl.fields.ID}"><i class="fas fa-tag"
            style="margin-right: 5px;" data-id="${lbl.fields.ID}"></i>${lbl.fields.TaskLabelName}</a></span>`;
            labelsForExcel += lbl.fields.TaskLabelName + " ";
          });
        }
      } else {
        td4 = "";
      }

      if (
        item.fields.ProjectName == "" ||
        item.fields.ProjectName == "Default"
      ) {
        projectName = "All Tasks";
      }
      projectName = item.fields.ProjectName;

      td5 = `
        <div class="dropdown btnTaskTableAction">
          <button type="button" class="btn btn-primary openEditTaskModal" data-id="${item.fields.ID}"
            data-catg="${projectName}" title="Edit Task"><i
              class="far fa-edit" style="width: 16px;" data-id="${item.fields.ID}"
              data-catg="${projectName}"></i></button>
        </div>

        <div class="dropdown btnTaskTableAction">
          <button type="button" class="btn btn-success" data-toggle="dropdown"><i
              class="far fa-calendar" title="Reschedule Task"></i></button>
          <div class="dropdown-menu dropdown-menu-right reschedule-dropdown-menu  no-modal"
            aria-labelledby="dropdownMenuButton" style="width: 275px;">
            <a class="dropdown-item no-modal setScheduleToday" href="#" data-id="${item.fields.ID}">
              <i class="fas fa-calendar-day text-success no-modal"
                style="margin-right: 8px;"></i>Today
              <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                ${todayDate}</div>
            </a>
            <a class="dropdown-item no-modal setScheduleTomorrow" href="#"
              data-id="${item.fields.ID}">
              <i class="fas fa-sun text-warning no-modal" style="margin-right: 8px;"></i>Tomorrow
              <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                ${tomorrowDay}</div>
            </a>
            <a class="dropdown-item no-modal setScheduleWeekend" href="#"
              data-id="${item.fields.ID}">
              <i class="fas fa-couch text-primary no-modal" style="margin-right: 8px;"></i>This Weekend
              <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                Sat</div>
            </a>
            <a class="dropdown-item no-modal setScheduleNexweek" href="#"
              data-id="${item.fields.ID}">
              <i class="fas fa-calendar-alt text-danger no-modal" style="margin-right: 8px;"></i>Next Week
              <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
                ${nextMonday}
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
          <button type="button" class="btn btn-warning openEditTaskModal" data-id="${item.fields.ID}"
            data-ttype="comment" data-catg="${projectName}"
            title="Add a Comment"><i class="far fa-comment-alt" data-id="${item.fields.ID}"
              data-ttype="comment"
              data-catg="${projectName}"></i></button>
        </div>

        <div class="dropdown btnTaskTableAction">
          <button type="button" class="btn btn-secondary" data-toggle="dropdown"
            data-placement="bottom" title="More Options"><i class="fas fa-ellipsis-h"></i></button>
          <div class="dropdown-menu dropdown-menu-right crmtaskdrop" id="">
            <a class="dropdown-item openEditTaskModal" data-id="${item.fields.ID}"
              data-catg="${projectName}">
              <i class="far fa-edit" style="margin-right: 8px;" data-id="${item.fields.ID}"
                data-catg="${projectName}"></i>Edit
              Task</a>

            <div class="dropdown-divider"></div>

            <div class="dropdown-item-wrap no-modal"> 
              <div class="no-modal">
                <div class="no-modal">
                  <span class="no-modal">Priority</span>
                </div>
                <div class="no-modal" style="display: inline-flex;">
                  <i class="fas fa-flag no-modal taskDropSecondFlag task_modal_priority_3" style="padding-left: 8px;" data-toggle="tooltip"
                    data-placement="bottom" title="Priority 1" data-priority="3"
                    data-id="${item.fields.ID}"></i>
                  <i class="fas fa-flag no-modal taskDropSecondFlag task_modal_priority_2"
                    data-toggle="tooltip" data-placement="bottom" title="Priority 2" data-priority="2"
                    data-id="${item.fields.ID}"></i>
                  <i class="fas fa-flag no-modal taskDropSecondFlag task_modal_priority_1"
                    data-toggle="tooltip" data-placement="bottom" title="Priority 3" data-priority="1"
                    data-id="${item.fields.ID}"></i>
                  <i class="far fa-flag no-modal taskDropSecondFlag task_modal_priority_0" data-toggle="tooltip"
                    data-placement="bottom" title="Priority 4" data-priority="0"
                    data-id="${item.fields.ID}"></i>
                </div> 
              </div>
            </div>

            <div class="dropdown-divider"></div> 

            <a class="dropdown-item no-modal movetoproject" data-id="${item.fields.ID}"
              data-projectid="${item.fields.ProjectID}">
              <i class="fa fa-arrow-circle-right" style="margin-right: 8px;"
                data-id="${item.fields.ID}" data-projectid="${item.fields.ProjectID}"></i>Move to
              Project</a>
            <a class="dropdown-item duplicate-task no-modal" data-id="${item.fields.ID}">
              <i class="fa fa-plus-square-o" style="margin-right: 8px;"
                data-id="${item.fields.ID}"></i>Duplicate</a>

            <div class="dropdown-divider"></div>

            <a class="dropdown-item delete-task no-modal" data-id="${item.fields.ID}">
              <i class="fas fa-trash-alt" style="margin-right: 8px;"
                data-id="${item.fields.ID}"></i>Delete
              Task</a>
          </div>
        </div>`;
      taskRows.push([
        td0,
        td1,
        td2,
        td3,
        td4,
        td5,
        item.fields.ID,
        item.fields.priority,
        labelsForExcel,
      ]);
    });
    return taskRows;
  };

  // labels tab --------------
  templateObject.getInitAllLabels = function () {
    getVS1Data("TCRMLabelList")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          templateObject.getAllLabels();
        } else {
          let data = JSON.parse(dataObject[0].data);
          if (
            data.tprojecttask_tasklabel &&
            data.tprojecttask_tasklabel.length > 0
          ) {
            let alllabels = data.tprojecttask_tasklabel;
            templateObject.alllabels.set(alllabels);

            let label_dropdowns = "";
            let detail_label_dropdowns = "";
            let labelName = "";
            alllabels.forEach((lbl) => {
              labelName =
                lbl.fields.TaskLabelName.length < 20
                  ? lbl.fields.TaskLabelName
                  : lbl.fields.TaskLabelName.substring(0, 19) + "...";

              label_dropdowns += `<a class="dropdown-item add_label" data-id="${lbl.fields.ID}">
              <i class="fas fa-tag text-primary" style="margin-right: 8px;" data-id="${lbl.fields.ID}"></i>${labelName}
                <div style="width: 20%; float: right;" data-id="${lbl.fields.ID}">
                  <div class="custom-control custom-checkbox chkBox pointer"
                    style="width: 15px; float: right;" data-id="${lbl.fields.ID}">
                    <input class="custom-control-input chkBox chkAddLabel pointer" type="checkbox"
                      id="add_label_${lbl.fields.ID}" name="${lbl.fields.ID}" value="" data-id="${lbl.fields.ID}">
                    <label class="custom-control-label chkBox pointer" for="add_label_${lbl.fields.ID}" data-id="${lbl.fields.ID}"></label>
                  </div>
                </div>
              </a>`;
              detail_label_dropdowns += `<a class="dropdown-item detail_label" data-id="${lbl.fields.ID}">
              <i class="fas fa-tag text-primary" style="margin-right: 8px;" data-id="${lbl.fields.ID}"></i>${labelName}
                <div style="width: 20%; float: right;" data-id="${lbl.fields.ID}">
                  <div class="custom-control custom-checkbox chkBox pointer"
                    style="width: 15px; float: right;" data-id="${lbl.fields.ID}">
                    <input class="custom-control-input chkBox chkDetailLabel pointer" type="checkbox"
                      id="detail_label_${lbl.fields.ID}" name="${lbl.fields.ID}" value="" data-id="${lbl.fields.ID}">
                    <label class="custom-control-label chkBox pointer" for="detail_label_${lbl.fields.ID}" data-id="${lbl.fields.ID}"></label>
                  </div>
                </div>
              </a>`;
            });
            $("#addTaskLabelWrapper").html(label_dropdowns);
            $(".detailTaskLabelWrapper").html(detail_label_dropdowns);
            templateObject.initLabelsTable();
          } else {
            templateObject.initLabelsTable();
            templateObject.alllabels.set([]);
          }
        }
      })
      .catch(function (err) {
        templateObject.getAllLabels();
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
          let detail_label_dropdowns = "";
          let labelName = "";
          alllabels.forEach((lbl) => {
            labelName =
              lbl.fields.TaskLabelName.length < 20
                ? lbl.fields.TaskLabelName
                : lbl.fields.TaskLabelName.substring(0, 19) + "...";

            label_dropdowns += `<a class="dropdown-item add_label" data-id="${lbl.fields.ID}">
            <i class="fas fa-tag text-primary" style="margin-right: 8px;" data-id="${lbl.fields.ID}"></i>${labelName}
              <div style="width: 20%; float: right;" data-id="${lbl.fields.ID}">
                <div class="custom-control custom-checkbox chkBox pointer"
                  style="width: 15px; float: right;" data-id="${lbl.fields.ID}">
                  <input class="custom-control-input chkBox chkAddLabel pointer" type="checkbox"
                    id="add_label_${lbl.fields.ID}" name="${lbl.fields.ID}" value="" data-id="${lbl.fields.ID}">
                  <label class="custom-control-label chkBox pointer" for="add_label_${lbl.fields.ID}" data-id="${lbl.fields.ID}"></label>
                </div>
              </div>
            </a>`;
            detail_label_dropdowns += `<a class="dropdown-item detail_label" data-id="${lbl.fields.ID}">
            <i class="fas fa-tag text-primary" style="margin-right: 8px;" data-id="${lbl.fields.ID}"></i>${labelName}
              <div style="width: 20%; float: right;" data-id="${lbl.fields.ID}">
                <div class="custom-control custom-checkbox chkBox pointer"
                  style="width: 15px; float: right;" data-id="${lbl.fields.ID}">
                  <input class="custom-control-input chkBox chkDetailLabel pointer" type="checkbox"
                    id="detail_label_${lbl.fields.ID}" name="${lbl.fields.ID}" value="" data-id="${lbl.fields.ID}">
                  <label class="custom-control-label chkBox pointer" for="detail_label_${lbl.fields.ID}" data-id="${lbl.fields.ID}"></label>
                </div>
              </div>
            </a>`;
          });
          $("#addTaskLabelWrapper").html(label_dropdowns);
          $(".detailTaskLabelWrapper").html(detail_label_dropdowns);
          templateObject.initLabelsTable();
        } else {
          templateObject.initLabelsTable();
          templateObject.alllabels.set([]);
        }
        addVS1Data("TCRMLabelList", JSON.stringify(data));
      })
      .catch(function (err) {});
  };

  templateObject.initLabelsTable = function () {
    let labelArray = templateObject.makeLabelTableRows(
      templateObject.alllabels.get()
    );

    $("#tblLabels").DataTable({
      data: labelArray,
      columnDefs: [
        {
          targets: 0,
          className: "colLabelCreatedDate",
        },
        {
          targets: 1,
          className: "colLabel",
        },
        {
          orderable: false,
          targets: 2,
          className: "colLabelActions",
        },
      ],
      sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      buttons: [
        {
          extend: "excelHtml5",
          text: "",
          download: "open",
          className: "btntabletocsv hiddenColumn",
          filename: "Label List" + moment().format(),
          orientation: "portrait",
          exportOptions: {
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 2) {
                return false;
              }
              return true;
            },
          },
        },
        {
          extend: "print",
          download: "open",
          className: "btntabletopdf hiddenColumn",
          text: "",
          title: "Label List",
          filename: "Label List" + moment().format(),
          exportOptions: {
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 2) {
                return false;
              }
              return true;
            },
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
      order: [[1, "desc"]],
      action: function () {
        $("#tblLabels").DataTable().ajax.reload();
      },
      fnInitComplete: function () {
        $(
          "<button class='btn btn-primary btnNewLabel' type='button' id='btnNewLabel' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus' style='margin-right: 5px'></i>New Label</button>"
        ).insertAfter("#tblLabels_filter");
        $(
          "<button class='btn btn-primary btnSearchCrm' type='button' id='btnRefreshLabels' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
        ).insertAfter("#tblLabels_filter");
      },
    });
  };

  templateObject.getInitAllLabels();

  templateObject.makeLabelTableRows = function (task_array) {
    let taskRows = new Array();
    let td0 = (td1 = td2 = "");

    task_array.forEach((item) => {
      td0 = moment(item.fields.MsTimeStamp).format("DD/MM/YYYY");
      td1 = item.fields.TaskLabelName;
      td2 = `
        <div class="dropdown btnLabelActions" title="Edit Label">
            <button type="button" class="btn btn-primary btnEditLabel" data-id="${item.fields.ID}"><i
                class="far fa-edit" style="width: 16px;" data-id="${item.fields.ID}"></i></button>
          </div>
          <div class="dropdown btnLabelActions" title="Delete Label">
            <button type="button" class="btn btn-danger btnDeleteLabel" data-id="${item.fields.ID}"><i
                class="far fa-trash-alt" style="width: 16px;" data-id="${item.fields.ID}"></i>
            </button>
        </div>`;
      taskRows.push([td0, td1, td2]);
    });
    return taskRows;
  };
  // labels tab ----------------- //

  // projects tab -------------------
  templateObject.getInitTProjectList = function () {
    getVS1Data("TCRMProjectList")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          templateObject.getTProjectList();
        } else {
          let data = JSON.parse(dataObject[0].data);
          if (data.tprojectlist && data.tprojectlist.length > 0) {
            let tprojectlist = data.tprojectlist;
            let all_projects = data.tprojectlist;

            tprojectlist = tprojectlist.filter(
              (proj) => proj.fields.Active == true && proj.fields.ID != 11
            );
            all_projects = all_projects.filter((proj) => proj.fields.ID != 11);
            templateObject.all_projects.set(all_projects);

            let add_projectlist = `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="11" data-projectname="All Tasks"><i class="fas fa-inbox text-primary no-modal"
            style="margin-right: 8px;"></i>All Tasks</a>`;
            let ProjectName = "";
            tprojectlist.forEach((proj) => {
              ProjectName =
                proj.fields.ProjectName.length > 26
                  ? proj.fields.ProjectName.substring(0, 26) + "..."
                  : proj.fields.ProjectName;
              add_projectlist += `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="${proj.fields.ID}" data-projectname="${proj.fields.ProjectName}"><i class="fas fa-circle no-modal" style="margin-right: 8px; color: ${proj.fields.ProjectColour};"></i>${ProjectName}</a>`;
            });
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

            templateObject.active_projects.set(active_projects);
            templateObject.deleted_projects.set(deleted_projects);
            templateObject.favorite_projects.set(favorite_projects);

            $(".crm_project_count").html(active_projects.length);

            setTimeout(() => {
              templateObject.initProjectsTable();
            }, 100);
          } else {
            templateObject.tprojectlist.set([]);
            $(".crm_project_count").html(0);
          }
        }
      })
      .catch(function (err) {
        templateObject.getTProjectList();
      });
  };

  templateObject.getTProjectList = function () {
    crmService
      .getTProjectList()
      .then(function (data) {
        if (data.tprojectlist && data.tprojectlist.length > 0) {
          let tprojectlist = data.tprojectlist;
          let all_projects = data.tprojectlist;

          tprojectlist = tprojectlist.filter(
            (proj) => proj.fields.Active == true && proj.fields.ID != 11
          );
          all_projects = all_projects.filter((proj) => proj.fields.ID != 11);
          templateObject.all_projects.set(all_projects);

          let add_projectlist = `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="11" data-projectname="All Tasks"><i class="fas fa-inbox text-primary no-modal"
          style="margin-right: 8px;"></i>All Tasks</a>`;
          let ProjectName = "";
          tprojectlist.forEach((proj) => {
            ProjectName =
              proj.fields.ProjectName.length > 26
                ? proj.fields.ProjectName.substring(0, 26) + "..."
                : proj.fields.ProjectName;
            add_projectlist += `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="${proj.fields.ID}" data-projectname="${proj.fields.ProjectName}"><i class="fas fa-circle no-modal" style="margin-right: 8px; color: ${proj.fields.ProjectColour};"></i>${ProjectName}</a>`;
          });
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

          templateObject.active_projects.set(active_projects);
          templateObject.deleted_projects.set(deleted_projects);
          templateObject.favorite_projects.set(favorite_projects);

          $(".crm_project_count").html(active_projects.length);

          setTimeout(() => {
            templateObject.initProjectsTable();
          }, 100);
        } else {
          templateObject.tprojectlist.set([]);
          $(".crm_project_count").html(0);
        }
        addVS1Data("TCRMProjectList", JSON.stringify(data));
      })
      .catch(function (err) {});
  };

  templateObject.initProjectsTable = function () {
    let projectArray = templateObject.makeProjectTableRows(
      templateObject.active_projects.get()
    );
    let view_project_completed = templateObject.view_project_completed.get();
    btnFilterName =
      view_project_completed == "NO" ? "View All" : "Hide Deleted";

    $("#tblNewProjectsDatatable").DataTable({
      data: projectArray,
      columnDefs: [
        {
          orderable: false,
          targets: 0,
          className: "colPrjectDate",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).closest("tr").attr("data-id", rowData[5]);
            $(td).attr("data-id", rowData[5]);
          },
        },
        {
          targets: 1,
          className: "colProjectName",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[5]);
          },
        },
        {
          targets: 2,
          className: "colProjectDesc",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[5]);
          },
        },
        {
          targets: 3,
          className: "colProjectStatus",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[5]);
          },
        },
        {
          targets: 4,
          className: "colProjectDesc",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[5]);
            if (!rowData[6]) {
              $(td).addClass("task_priority_3");
              $(td).css("color", "white");
            }
          },
        },
      ],
      sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      buttons: [
        {
          extend: "excelHtml5",
          text: "",
          download: "open",
          className: "btntabletocsv hiddenColumn",
          filename: "Project List" + moment().format(),
          orientation: "portrait",
          exportOptions: {
            columns: ":visible",
            format: {
              body: function (data, row, column) {
                if (Number.isInteger(data)) {
                  data = data.toString();
                }
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
          title: "Project List",
          filename: "Project List" + moment().format(),
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
      order: [[0, "desc"]],
      action: function () {
        $("#tblProjectsDatatable").DataTable().ajax.reload();
      },
      fnInitComplete: function () {
        $(
          "<button class='btn btn-primary btnSearchCrm' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button><button class='btn btn-primary btnViewProjectCompleted' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='far fa-check-circle' style='margin-right: 5px'></i><span id='lblViewProjectCompleted'>" +
            btnFilterName +
            "</span></button>"
        ).insertAfter("#tblNewProjectsDatatable_filter");
      },
    });
  };

  templateObject.getInitTProjectList();

  templateObject.makeProjectTableRows = function (task_array) {
    let taskRows = new Array();
    let td0 = (td1 = td2 = td3 = td4 = "");
    let projectStatus = "";
    let taskCount = "";

    task_array.forEach((item) => {
      if (item.fields.Active) {
        projectStatus = "Active";
      } else {
        projectStatus = "Deleted";
      }
      if (item.fields.projecttasks == null) {
        taskCount = "";
      } else if (Array.isArray(item.fields.projecttasks) == true) {
        taskCount = item.fields.projecttasks.filter(
          (tk) => tk.fields.Active == true && tk.fields.Completed == false
        ).length;
      } else {
        taskCount = item.fields.projecttasks.fields.Active == true ? 1 : 0;
      }

      td0 =
        `<span style="display: none;">{{item.fields.ProjectStatedon}}</span>` +
        moment(item.fields.MsTimeStamp).format("DD/MM/YYYY");
      td1 = item.fields.ProjectName;
      td2 = item.fields.Description;
      td3 = projectStatus;
      td4 = taskCount;
      taskRows.push([
        td0,
        td1,
        td2,
        td3,
        td4,
        item.fields.ID,
        item.fields.Active,
      ]);
    });
    return taskRows;
  };

  templateObject.initProjectTasksTable = function () {
    let splashArrayTaskList = templateObject.makeTaskTableRows(
      templateObject.active_projecttasks.get()
    );

    let view_projecttasks_completed =
      templateObject.view_projecttasks_completed.get();
    btnFilterName =
      view_projecttasks_completed == "NO"
        ? "Show Completed Tasks"
        : "Hide Completed Tasks";
    $(".lblShowCompletedTaskOnProject").html(btnFilterName);

    $("#tblProjectTasks").DataTable({
      data: splashArrayTaskList,
      columnDefs: [
        {
          orderable: false,
          targets: 0,
          className: "colCompleteTask",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).closest("tr").attr("data-id", rowData[6]);
            $(td).attr("data-id", rowData[6]);
            $(td).addClass("task_priority_" + rowData[7]);
          },
          width: "18px",
        },
        {
          targets: 1,
          className: "colDate openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
          width: "120px",
        },
        {
          targets: 2,
          className: "colTaskName openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          targets: 3,
          className: "colTaskDesc openEditTaskModal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          targets: 4,
          className: "colTaskLabels",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
        },
        {
          orderable: false,
          targets: 5,
          className: "colTaskActions",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("data-id", rowData[6]);
          },
          width: "150px",
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
          filename: "Project List" + moment().format(),
          orientation: "portrait",
          exportOptions: {
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 0 || idx == 5) {
                return false;
              }
              return true;
            },
          },
        },
        {
          extend: "print",
          download: "open",
          className: "btntabletopdf hiddenColumn",
          text: "",
          title: "Project List",
          filename: "Project List" + moment().format(),
          exportOptions: {
            // columns: ":visible",
            columns: function (idx, data, node) {
              if (idx == 0 || idx == 5) {
                return false;
              }
              return true;
            },
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
        $("#tblProjectTasks").DataTable().ajax.reload();
      },
      fnInitComplete: function () {
        $(
          "<button class='btn btn-primary btnSearchCrm' type='button' id='btnRefreshProjectTasks' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
        ).insertAfter("#tblProjectTasks_filter");
      },
    });
  };
  // projects tab ------------------- //

  setTimeout(() => {
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
      onSelect: function (dateText, inst) {
        $(".lblAddTaskSchedule").html(moment(dateText).format("YYYY-MM-DD"));
      },
    });
  }, 1000);
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
        templateObject.getTProjectList();
        // $("#newProjectTasksModal").modal("hide");

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

    let templateObject = Template.instance();
    if (id) {
      swal({
        title: "Delete Task",
        text: "Are you sure want to delete this task?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          $(".fullScreenSpin").css("display", "inline-block");
          crmService.saveNewTask(objDetails).then(function (objDetails) {
            // recalculate count here
            templateObject.getAllTaskList();
            templateObject.getTProjectList();
            $(".fullScreenSpin").css("display", "none");
            $("#taskDetailModal").modal("hide");
            // $("#newProjectTasksModal").modal("hide");
          });
        } else if (result.dismiss === "cancel") {
        } else {
        }
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
                templateObject.getTProjectList();
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
    $(".addTaskModalProjectName").html(projectName);
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
        // $(".displayTaskNameDescription").css("display", "inline-block");
        // $(".editTaskNameDescription").css("display", "none");
        $(".fullScreenSpin").css("display", "none");

        setTimeout(() => {
          templateObject.getAllTaskList();
        }, 1000);
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
          if (
            moment(due_date).format("YYYY-MM-DD") ==
            moment().format("YYYY-MM-DD")
          ) {
          }

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
            templateObject.getTProjectList();
          }, 500);
          $("#newTaskModal").modal("hide");
          // $("#newProjectTasksModal").modal("hide");
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
    $(".lblAddTaskSchedule").html("Today");
  },

  // set due_date
  "click .setScheduleTomorrowAdd": function (e) {
    let due_date = moment().add(1, "day").format("YYYY-MM-DD hh:mm:ss");
    $(".crmEditDatepicker").val(due_date);
    $(".lblAddTaskSchedule").html("Tomorrow");
  },

  // set due_date
  "click .setScheduleWeekendAdd": function (e) {
    let due_date = moment().endOf("week").format("YYYY-MM-DD hh:mm:ss");
    $(".crmEditDatepicker").val(due_date);
    $(".lblAddTaskSchedule").html(moment(due_date).format("YYYY-MM-DD"));
  },

  // set due_date
  "click .setScheduleNexweekAdd": function (e) {
    var startDate = moment();
    let due_date = moment(startDate)
      .day(1 + 7)
      .format("YYYY-MM-DD hh:mm:ss");

    $(".crmEditDatepicker").val(due_date);
    $(".lblAddTaskSchedule").html(moment(due_date).format("YYYY-MM-DD"));
  },

  // set due_date
  "click .setScheduleNodateAdd": function (e) {
    $(".crmEditDatepicker").val(null);
    $(".lblAddTaskSchedule").html("No Date");
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
    let view_all_task_completed = templateObject.view_all_task_completed.get();

    if (view_all_task_completed == "NO") {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == true
      );
      templateObject.view_all_task_completed.set("YES");
    } else {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == false
      );
      templateObject.view_all_task_completed.set("NO");
    }

    templateObject.allRecords.set(allCompletedRecords);
    templateObject.initTable();
  },

  // view today completed task
  "click .btnViewTodayCompleted": function (e) {
    e.stopImmediatePropagation();

    let templateObject = Template.instance();
    let allCompletedRecords = templateObject.allWithCompletedRecords.get();
    let view_today_task_completed =
      templateObject.view_today_task_completed.get();

    let today = moment().format("YYYY-MM-DD");
    allCompletedRecords = allCompletedRecords.filter(
      (item) => item.fields.due_date.substring(0, 10) == today
    );

    if (view_today_task_completed == "NO") {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == true
      );
      templateObject.view_today_task_completed.set("YES");
    } else {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == false
      );
      templateObject.view_today_task_completed.set("NO");
    }

    templateObject.todayRecords.set(allCompletedRecords);
    templateObject.initTable();
  },

  // view upcoming completed task
  "click .btnViewUpcomingCompleted": function (e) {
    e.stopImmediatePropagation();

    let templateObject = Template.instance();
    let allCompletedRecords = templateObject.allWithCompletedRecords.get();
    let view_uncoming_task_completed =
      templateObject.view_uncoming_task_completed.get();

    let today = moment().format("YYYY-MM-DD");
    allCompletedRecords = allCompletedRecords.filter(
      (item) => item.fields.due_date.substring(0, 10) > today
    );

    if (view_uncoming_task_completed == "NO") {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == true
      );
      templateObject.view_uncoming_task_completed.set("YES");
    } else {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Completed == false
      );
      templateObject.view_uncoming_task_completed.set("NO");
    }

    templateObject.upcomingRecords.set(allCompletedRecords);
    templateObject.initTable();
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
        templateObject.getTProjectList();

        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  "click .filterByLabel": function (e) {
    let labelid = e.target.dataset.id;
    let templateObject = Template.instance();
    let allCompletedRecords = templateObject.allWithCompletedRecords.get();

    if (labelid) {
      $("#taskDetailModal").modal("hide");

      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.TaskLabel != null
      );

      let filterRecord1 = allCompletedRecords.filter(
        (item) =>
          Array.isArray(item.fields.TaskLabel) == false &&
          item.fields.TaskLabel.fields.ID == labelid
      );

      let filterRecord2 = allCompletedRecords.filter(
        (item) => Array.isArray(item.fields.TaskLabel) == true
      );
      filterRecord2 = filterRecord2.filter((item) => {
        lbls = item.fields.TaskLabel;
        return lbls.filter((lbl) => lbl.fields.ID == 14).length > 0;
      });

      let filterRecord = filterRecord1.concat(filterRecord2);

      $("#allTasks-tab").click();
      templateObject.allRecords.set(filterRecord);
      templateObject.initTable();
    }
  },

  // projects tab ------------
  "click .projectName": function (e) {
    let id = e.target.dataset.id;
    if (id) {
      FlowRouter.go("/projects?id=" + id);
      Meteor._reload.reload();
    }
  },

  "click .menuFilterslabels": function (e) {
    FlowRouter.go("/filterslabels");
  },

  // delete project
  "click .delete-project": function (e) {
    let id = $("#editProjectID").val();
    // let id = e.target.dataset.id;
    if (id) {
      let templateObject = Template.instance();
      swal({
        title: "Delete Project",
        text: "Are you sure want to delete this project?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          $(".fullScreenSpin").css("display", "inline-block");
          var objDetails = {
            type: "Tprojectlist",
            fields: {
              ID: id,
              Active: false,
            },
          };
          crmService
            .updateProject(objDetails)
            .then(function (data) {
              // $(".projectRow" + id).remove();
              templateObject.getTProjectList();
              $("#editProjectID").val("");

              $("#editCrmProject").modal("hide");
              $("#newProjectTasksModal").modal("hide");
              $(".fullScreenSpin").css("display", "none");
            })
            .catch(function (err) {
              swal({
                title: "Oooops...",
                text: err,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Try Again",
              }).then((result) => {});
              $("#editCrmProject").modal("hide");
              $("#newProjectTasksModal").modal("hide");
              $(".fullScreenSpin").css("display", "none");
            });
        } else if (result.dismiss === "cancel") {
        } else {
        }
      });
    }
  },

  // submit edit project
  "click .btnEditCrmProject": function (e) {
    let id = $("#editProjectID").val();
    let projectName = $("#editCrmProjectName").val();
    let projectColor = $("#editCrmProjectColor").val();
    let projectDescription = $("#editCrmProjectDescription").val();
    // let swtNewCrmProjectFavorite = $("#swteditCrmProjectFavorite").prop(
    //   "checked"
    // );

    if (id === "" || id === null) {
      swal("Project is not selected correctly", "", "warning");
      return;
    }

    if (projectName === "" || projectName === null) {
      swal("Project name is not entered!", "", "warning");
      return;
    }

    $(".fullScreenSpin").css("display", "inline-block");

    var objDetails = {
      type: "Tprojectlist",
      fields: {
        ID: id,
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

        $(".fullScreenSpin").css("display", "none");
        $("#editCrmProject").modal("hide");
        $("#newProjectTasksModal").modal("hide");
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
        $("#editCrmProject").modal("hide");
        $("#newProjectTasksModal").modal("hide");
      });
  },

  // submit duplicate project
  "click .duplicate-project": function (e) {
    let projectName = "Copy of " + e.target.dataset.name;
    let projectColor = e.target.dataset.color;
    let projecttasks = e.target.dataset.projecttasks;
    let projecttasks_count = "";
    if (
      projecttasks != null &&
      projecttasks != undefined &&
      projecttasks != "undefined"
    ) {
      projecttasks_count = projecttasks.lentgh;
    }

    $(".fullScreenSpin").css("display", "inline-block");

    var objDetails = {
      type: "Tprojectlist",
      fields: {
        Active: true,
        ProjectName: projectName,
        ProjectColour: projectColor,
      },
    };
    projectColor = projectColor == 0 ? "gray" : projectColor;
    let templateObject = Template.instance();

    crmService
      .updateProject(objDetails)
      .then(function (data) {
        templateObject.getTProjectList();

        $("#editCrmProject").modal("hide");
        $(".fullScreenSpin").css("display", "none");
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
        $("#editCrmProject").modal("hide");
        $(".fullScreenSpin").css("display", "none");
      });
  },

  // open task-project modal in projects table
  "click #tblNewProjectsDatatable tbody tr": function (e) {
    $("#newProjectTasksModal").modal("toggle");
    let id = e.target.dataset.id;
    $("#editProjectID").val(id);
    let templateObject = Template.instance();

    if (id) {
      $(".fullScreenSpin").css("display", "inline-block");
      let active_projecttasks = [];
      templateObject.view_projecttasks_completed.set("NO");

      crmService
        .getTProjectDetail(id)
        .then(function (data) {
          $(".fullScreenSpin").css("display", "none");
          if (data.fields.ID == id) {
            let selected_record = data.fields;

            let projectName = data.fields.ProjectName;
            let ProjectColour = data.fields.ProjectColour;
            let ProjectDescription = data.fields.Description;

            $("#editProjectID").val(id);
            $("#editCrmProjectName").val(projectName);
            $(".editCrmProjectName").html(projectName);
            $("#editCrmProjectColor").val(ProjectColour);
            $("#editCrmProjectDescription").val(ProjectDescription);

            // set task list
            let projecttasks = [];
            if (selected_record.projecttasks) {
              if (selected_record.projecttasks.fields == undefined) {
                projecttasks = selected_record.projecttasks;
              } else {
                projecttasks.push(selected_record.projecttasks);
              }

              active_projecttasks = projecttasks.filter(
                (item) =>
                  item.fields.Active == true && item.fields.Completed == false
              );
            }
            templateObject.projecttasks.set(projecttasks);
            templateObject.active_projecttasks.set(active_projecttasks);

            // $("#tblProjectTasksBody").html(tr);
            templateObject.initProjectTasksTable();
          } else {
            swal("Cannot edit this project", "", "warning");
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

  // open new task modal
  "click .addTaskOnProject": function (e) {
    // $("#editProjectID").val("");
    $("#txtCrmSubTaskID").val("");
    $(".lblAddTaskSchedule").html("Schedule");

    // uncheck all labels
    $(".chkAddLabel").prop("checked", false);

    $("#newTaskModal").modal("toggle");

    let projectName = $(".editCrmProjectName").html()
      ? $(".editCrmProjectName").html().length > 26
        ? $(".editCrmProjectName").html().substring(0, 26) + "..."
        : $(".editCrmProjectName").html()
      : "All Task";
    $(".addTaskModalProjectName").html(projectName);

    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_3");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_2");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_1");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_0");
  },

  // view all project including delete
  "click .btnViewProjectCompleted": function (e) {
    let templateObject = Template.instance();
    let all_projects = templateObject.all_projects.get();
    let view_project_completed = templateObject.view_project_completed.get();

    if (view_project_completed == "NO") {
      templateObject.view_project_completed.set("YES");
    } else {
      all_projects = all_projects.filter(
        (project) => project.fields.Active == true
      );
      templateObject.view_project_completed.set("NO");
    }

    templateObject.active_projects.set(all_projects);
    templateObject.initProjectsTable();
  },

  // show completed tasks on project task modal
  "click .showCompletedTaskOnProject": function (e) {
    let templateObject = Template.instance();
    let allCompletedRecords = templateObject.projecttasks.get();
    let view_projecttasks_completed =
      templateObject.view_projecttasks_completed.get();

    // show completed task
    if (view_projecttasks_completed == "NO") {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Active == true && item.fields.Completed == true
      );
      templateObject.view_projecttasks_completed.set("YES");
    } else {
      allCompletedRecords = allCompletedRecords.filter(
        (item) => item.fields.Active == true && item.fields.Completed == false
      );
      templateObject.view_projecttasks_completed.set("NO");
    }

    templateObject.active_projecttasks.set(allCompletedRecords);
    templateObject.initProjectTasksTable();
  },
  // projects tab--------------- //

  // labels tab ---------------
  "click .btnEditLabel": function (e) {
    let id = e.target.dataset.id;
    if (id) {
      $("#editLabelID").val(id);

      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.getOneLabel(id).then(function (obj) {
        $("#editLabelName").val(obj.fields.TaskLabelName);
        // $('#editLabelColor').val();

        $("#editLabelModal").modal("toggle");

        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  "click .btnAddNewLabel": function (e) {
    let labelName = $("#newLabelName").val();
    let labelColor = $("#newLabelColor").val();

    if (labelName == "") {
      swal("Please put the Label Name", "", "warning");
      return;
    }

    var objDetails = {
      type: "Tprojecttask_TaskLabel",
      fields: {
        TaskLabelName: labelName,
        TaskID: 1, // tempcode. it should be removed after api is updated
      },
    };

    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    crmService.updateLabel(objDetails).then(function (objDetails) {
      templateObject.getAllLabels();
      $("#newLabelModal").modal("hide");

      $("#newLabelName").val("");
      $("#newLabelColor").val("#000000");
      $(".fullScreenSpin").css("display", "none");
    });
  },

  "click .btnSaveEditLabel": function (e) {
    let id = $("#editLabelID").val();
    let labelName = $("#editLabelName").val();
    let labelColor = $("#editLabelColor").val();

    if (labelName == "") {
      swal("Please put the Label Name", "", "warning");
      return;
    }

    if (id) {
      var objDetails = {
        type: "Tprojecttask_TaskLabel",
        fields: {
          ID: id,
          TaskLabelName: labelName,
        },
      };

      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.updateLabel(objDetails).then(function (objDetails) {
        templateObject.getAllLabels();
        $("#editLabelModal").modal("hide");
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  "click .btnDeleteLabel": function (e) {
    let id = e.target.dataset.id;

    if (id) {
      var objDetails = {
        type: "Tprojecttask_TaskLabel",
        fields: {
          ID: id,
          Active: false,
        },
      };

      $(".fullScreenSpin").css("display", "inline-block");
      let templateObject = Template.instance();
      crmService.updateLabel(objDetails).then(function (objDetails) {
        templateObject.getAllLabels();
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },
  // labels tab ---------------
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

  // projects tab ------------------
  active_projects: () => {
    return Template.instance().active_projects.get();
  },

  deleted_projects: () => {
    return Template.instance().deleted_projects.get();
  },

  favorite_projects: () => {
    return Template.instance().favorite_projects.get();
  },

  getProjectColor: (color) => {
    if (color == 0) {
      return "gray";
    }
    return color;
  },

  getProjectCount: (tasks) => {
    if (tasks == null) {
      return "";
    } else if (Array.isArray(tasks) == true) {
      return tasks.length;
    } else {
      return 1;
    }
  },

  getProjectStatus: (status) => {
    if (status) {
      return "Active";
    } else {
      return "Deleted";
    }
  },
  // projects tab ------------------
});
