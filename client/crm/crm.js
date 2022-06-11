import "../lib/global/indexdbstorage.js";

import { CRMService } from "./crm-service";
import { ContactService } from "../contacts/contact-service";
let crmService = new CRMService();

Template.crmoverview.onCreated(function () {
  let templateObject = Template.instance();
  templateObject.crmtaskmitem = new ReactiveVar("all");
  templateObject.currentTabID = new ReactiveVar("allTasks-tab");
  templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.crmoverview.onRendered(function () {
  const templateObject = Template.instance();
  const contactService = new ContactService();
  let currentId = FlowRouter.current().queryParams.id;
  currentId = currentId ? currentId : "all";
  templateObject.crmtaskmitem.set(currentId);
  templateObject.currentTabID.set("allTasks-tab");

  function getCustomerData(customerID) {
    getVS1Data("TCustomerVS1")
      .then(function (dataObject) {
        if (dataObject.length === 0) {
          contactService.getOneCustomerDataEx(customerID).then(function (data) {
            setCustomerByID(data);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tcustomervs1;
          let added = false;
          for (let i = 0; i < useData.length; i++) {
            if (parseInt(useData[i].fields.ID) === parseInt(customerID)) {
              added = true;
              setCustomerByID(useData[i]);
            }
          }
          if (!added) {
            contactService
              .getOneCustomerDataEx(customerID)
              .then(function (data) {
                setCustomerByID(data);
              });
          }
        }
      })
      .catch(function (err) {
        contactService.getOneCustomerDataEx(customerID).then(function (data) {
          $(".fullScreenSpin").css("display", "none");
          setCustomerByID(data);
        });
      });
  }
  function getSupplierData(customerID) {
    getVS1Data("TSupplierVS1")
      .then(function (dataObject) {
        if (dataObject.length === 0) {
          contactService.getOneSupplierDataEx(customerID).then(function (data) {
            setCustomerByID(data);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tsuppliervs1;
          let added = false;
          for (let i = 0; i < useData.length; i++) {
            if (parseInt(useData[i].fields.ID) === parseInt(customerID)) {
              added = true;
              setCustomerByID(useData[i]);
            }
          }
          if (!added) {
            contactService
              .getOneSupplierDataEx(customerID)
              .then(function (data) {
                setCustomerByID(data);
              });
          }
        }
      })
      .catch(function (err) {
        contactService.getOneSupplierDataEx(customerID).then(function (data) {
          $(".fullScreenSpin").css("display", "none");
          setCustomerByID(data);
        });
      });
  }
  function getLeadData(leadID) {
    getVS1Data("TProspectVS1")
      .then(function (dataObject) {
        if (dataObject.length === 0) {
          contactService.getOneLeadDataEx(leadID).then(function (data) {
            setCustomerByID(data);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tprospectvs1;
          let added = false;
          for (let i = 0; i < useData.length; i++) {
            if (parseInt(useData[i].fields.ID) === parseInt(leadID)) {
              added = true;
              setCustomerByID(useData[i]);
            }
          }
          if (!added) {
            contactService.getOneLeadDataEx(leadID).then(function (data) {
              setCustomerByID(data);
            });
          }
        }
      })
      .catch(function (err) {
        contactService.getOneLeadDataEx(leadID).then(function (data) {
          $(".fullScreenSpin").css("display", "none");
          setCustomerByID(data);
        });
      });
  }
  function setCustomerByID(data) {
    $("#add_task_name").val(data.fields.ClientName);
    $("#editProjectID").val("");
    $("#txtCrmSubTaskID").val("");

    $(".addTaskModalProjectName").html("All Tasks");
    $(".lblAddTaskSchedule").html("Schedule");

    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_3");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_2");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_1");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_0");

    // uncheck all labels
    $(".chkAddLabel").prop("checked", false);

    $("#newTaskModal").modal("toggle");
  }
  if (FlowRouter.current().queryParams.customerid) {
    getCustomerData(FlowRouter.current().queryParams.customerid);
  }
  if (FlowRouter.current().queryParams.leadid) {
    getLeadData(FlowRouter.current().queryParams.leadid);
  }
  if (FlowRouter.current().queryParams.supplierid) {
    getSupplierData(FlowRouter.current().queryParams.supplierid);
  }
  if (FlowRouter.current().queryParams.taskid && FlowRouter.current().queryParams.taskid !== "undefined") {
    let type = "";
    openEditTaskModal(FlowRouter.current().queryParams.taskid, type);
  }
});

Template.crmoverview.events({
  "click .menuTasklist": function (e) {
    Template.instance().crmtaskmitem.set("all");
  },

  "click .menuTasktoday": function (e) {
    Template.instance().crmtaskmitem.set("today");
  },

  "click .menuTaskupcoming": function (e) {
    Template.instance().crmtaskmitem.set("upcoming");
  },

  // open new task modal
  "click .btnNewTask": function (e) {
    $("#editProjectID").val("");
    $("#txtCrmSubTaskID").val("");

    $(".addTaskModalProjectName").html("All Tasks");
    $(".lblAddTaskSchedule").html("Schedule");

    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_3");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_2");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_1");
    $(".taskModalActionFlagDropdown").removeClass("task_modal_priority_0");

    // uncheck all labels
    $(".chkAddLabel").prop("checked", false);

    $("#newTaskModal").modal("toggle");
  },

  "click .detail_label": function (e) {
    e.stopPropagation();
  },

  "click .add_label": function (e) {
    e.stopPropagation();
  },

  // open task detail modal
  "click .openEditTaskModal": function (e) {
    if (!e.target.classList.contains("no-modal")) {

      let id = e.target.dataset.id;
      let type = e.target.dataset.ttype;
      openEditTaskModal(id, type);
    }
  },

  // add comment
  "click .btnCrmAddComment": function (e) {
    let taskID = $("#txtCrmTaskID").val();
    let projectID = $("#txtCrmProjectID").val();
    let comment = $("#txtCommentsDescription").val();

    let employeeID = Session.get("mySessionEmployeeLoggedID");
    let employeeName = Session.get("mySessionEmployee");

    var objDetails = {
      type: "Tprojecttask_comments",
      fields: {
        TaskID: taskID,
        ProjectID: projectID,
        EnteredByID: employeeID,
        EnteredBy: employeeName,
        CommentsDescription: comment,
      },
    };

    if (taskID != "" && projectID != "" && comment != "") {
      $(".fullScreenSpin").css("display", "inline-block");
      crmService
        .saveComment(objDetails)
        .then(function (objDetails) {
          if (objDetails.fields.ID) {
            $("#txtCommentsDescription").val("");

            let commentUserArry = employeeName.toUpperCase().split(" ");
            let commentUser =
              commentUserArry.length > 1
                ? commentUserArry[0].charAt(0) + commentUserArry[1].charAt(0)
                : commentUserArry[0].charAt(0);

            let comment_date = moment().format("MMM D h:mm A");

            let new_comment = `
            <div class="col-12 taskComment" style="padding: 16px 32px;" id="taskComment_${objDetails.fields.ID}">
              <div class="row commentRow">
                <div class="col-1">
                  <div class="commentUser">${commentUser}</div>
                </div>
                <div class="col-11" style="padding-top:4px; padding-left: 24px;">
                  <div class="row">
                    <div>
                      <span class="commenterName">${employeeName}</span>
                      <span class="commentDateTime">${comment_date}</span>
                    </div>
                  </div>
                  <div class="row">
                    <span class="commentText">${comment}</span>
                  </div>
                </div>
              </div>
            </div>
            `;
            $(".task-comment-row").append(new_comment);
          }

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
          $(".fullScreenSpin").css("display", "none");
        });
    }
  },

  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    crmService
      .getAllTaskList()
      .then(function (data) {
        addVS1Data("TCRMTaskList", JSON.stringify(data));
        crmService
          .getTProjectList()
          .then(function (data) {
            addVS1Data("TCRMProjectList", JSON.stringify(data));
            crmService
              .getAllLabels()
              .then(function (data) {
                addVS1Data("TCRMLabelList", JSON.stringify(data));
                Meteor._reload.reload();
              })
              .catch(function (err) {
                Meteor._reload.reload();
              });
          })
          .catch(function (err) {
            Meteor._reload.reload();
          });
      })
      .catch(function (err) {
        Meteor._reload.reload();
      });
  },

  // "click .btnSearchCrm": function () {
  //   Meteor._reload.reload();
  // },

  "click .btnOpenSettings": function (event) {
    let currentTabID = Template.instance().currentTabID.get();
    let tableName = "";

    switch (currentTabID) {
      case "todayTab-tab":
        tableName = "tblTodayTaskDatatable";
        break;
      case "upcomingTab-tab":
        tableName = "tblUpcomingTaskDatatable";
        break;
      case "projectsTab-tab":
        tableName = "tblNewProjectsDatatable";
        break;
      case "filterLabelsTab-tab":
        tableName = "tblLabels";
        break;
      default:
        tableName = "tblAllTaskDatatable";
        break;
    }

    let templateObject = Template.instance();
    // var columns = $("#" + tableName + " th");
    var columns = $("#" + tableName).find("th");
    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if (v.className.includes("hiddenColumn")) {
        columVisible = false;
      }
      sWidth = v.style.width.replace("px", "");
      // tempcode
      // columVisible = false;
      // tempcode

      let datatablerecordObj = {
        sTitle: v.innerText || "",
        sWidth: sWidth || "",
        sIndex: v.cellIndex || "0",
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderList.push(datatablerecordObj);
    });

    templateObject.tableheaderrecords.set(tableHeaderList);

    setTimeout(() => {
      tableHeaderList.forEach((element) => {
        $("#chkSalesNo-" + element.sIndex).prop("checked", element.sVisible);
      });
    }, 500);
  },

  "click .chkDatatable": function (event) {
    let currentTabID = Template.instance().currentTabID.get();
    let tableName = "";

    switch (currentTabID) {
      case "todayTab-tab":
        tableName = "tblTodayTaskDatatable";
        break;
      case "upcomingTab-tab":
        tableName = "tblUpcomingTaskDatatable";
        break;
      case "projectsTab-tab":
        tableName = "tblNewProjectsDatatable";
        break;
      case "filterLabelsTab-tab":
        tableName = "tblLabels";
        break;
      default:
        tableName = "tblAllTaskDatatable";
        break;
    }

    var columns = $("#" + tableName).find("th");
    // var columns = $("#" + tableName + " th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumn")
      .text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
        if ($(event.target).is(":checked")) {
          $("#" + tableName)
            .find("." + replaceClass + "")
            .css("display", "table-cell");
          $("#" + tableName)
            .find("." + replaceClass + "")
            .removeClass("hiddenColumn");
          $("#" + tableName)
            .find("." + replaceClass + "")
            .css("padding", ".75rem");
          $("#" + tableName)
            .find("." + replaceClass + "")
            .css("vertical-align", "top");
        } else {
          // $("#" + tableName)
          //   .find("." + replaceClass + "")
          //   .css("display", "none");
          $("#" + tableName)
            .find("." + replaceClass + "")
            .addClass("hiddenColumn");
        }
      }
    });
  },

  "click .saveTable": function (event) {
    let currentTabID = Template.instance().currentTabID.get();
    let tableName = "";

    switch (currentTabID) {
      case "todayTab-tab":
        tableName = "tblTodayTaskDatatable";
        break;
      case "upcomingTab-tab":
        tableName = "tblUpcomingTaskDatatable";
        break;
      case "projectsTab-tab":
        tableName = "tblNewProjectsDatatable";
        break;
      case "filterLabelsTab-tab":
        tableName = "tblLabels";
        break;
      default:
        tableName = "tblAllTaskDatatable";
        break;
    }

    let lineItems = [];
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(":checked")) {
        colHidden = false;
      } else {
        colHidden = true;
      }
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass,
      };

      lineItems.push(lineItemObj);
    });

    var getcurrentCloudDetails = CloudUser.findOne({
      _id: Session.get("mycloudLogonID"),
      clouddatabaseID: Session.get("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: tableName,
        });
        if (checkPrefDetails) {
          CloudPreference.update(
            { _id: checkPrefDetails._id },
            {
              $set: {
                userid: clientID,
                username: clientUsername,
                useremail: clientEmail,
                PrefGroup: "salesform",
                PrefName: tableName,
                published: true,
                customFields: lineItems,
                updatedAt: new Date(),
              },
            },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
              }
            }
          );
        } else {
          CloudPreference.insert(
            {
              userid: clientID,
              username: clientUsername,
              useremail: clientEmail,
              PrefGroup: "salesform",
              PrefName: tableName,
              published: true,
              customFields: lineItems,
              createdAt: new Date(),
            },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
              }
            }
          );
        }
      }
    }
    $("#myModal2").modal("toggle");
  },

  "click .resetTable": function (event) {
    let currentTabID = Template.instance().currentTabID.get();
    let tableName = "";

    switch (currentTabID) {
      case "todayTab-tab":
        tableName = "tblTodayTaskDatatable";
        break;
      case "upcomingTab-tab":
        tableName = "tblUpcomingTaskDatatable";
        break;
      case "projectsTab-tab":
        tableName = "tblNewProjectsDatatable";
        break;
      case "filterLabelsTab-tab":
        tableName = "tblLabels";
        break;
      default:
        tableName = "tblAllTaskDatatable";
        break;
    }

    var getcurrentCloudDetails = CloudUser.findOne({
      _id: Session.get("mycloudLogonID"),
      clouddatabaseID: Session.get("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: tableName,
        });
        if (checkPrefDetails) {
          CloudPreference.remove(
            { _id: checkPrefDetails._id },
            function (err, idTag) {
              if (err) {
              } else {
                Meteor._reload.reload();
              }
            }
          );
        }
      }
    }
  },

  "click #exportbtn": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let currentTabID = Template.instance().currentTabID.get();

    switch (currentTabID) {
      case "todayTab-tab":
        jQuery(
          "#tblTodayTaskDatatable_wrapper .dt-buttons .btntabletocsv"
        ).click();
        break;
      case "upcomingTab-tab":
        jQuery(
          "#tblUpcomingTaskDatatable_wrapper .dt-buttons .btntabletocsv"
        ).click();
        break;
      case "projectsTab-tab":
        jQuery(
          "#tblNewProjectsDatatable_wrapper .dt-buttons .btntabletocsv"
        ).click();
        break;
      case "filterLabelsTab-tab":
        jQuery("#tblLabels_wrapper .dt-buttons .btntabletocsv").click();
        break;
      default:
        jQuery(
          "#tblAllTaskDatatable_wrapper .dt-buttons .btntabletocsv"
        ).click();
        break;
    }

    $(".fullScreenSpin").css("display", "none");
  },

  "click .printConfirm": function (event) {
    let currentTabID = Template.instance().currentTabID.get();

    $(".fullScreenSpin").css("display", "inline-block");
    switch (currentTabID) {
      case "todayTab-tab":
        jQuery(
          "#tblTodayTaskDatatable_wrapper .dt-buttons .btntabletopdf"
        ).click();
        break;
      case "upcomingTab-tab":
        jQuery(
          "#tblUpcomingTaskDatatable_wrapper .dt-buttons .btntabletopdf"
        ).click();
        break;
      case "projectsTab-tab":
        jQuery(
          "#tblNewProjectsDatatable_wrapper .dt-buttons .btntabletopdf"
        ).click();
        break;
      case "filterLabelsTab-tab":
        jQuery("#tblLabels_wrapper .dt-buttons .btntabletopdf").click();
        break;
      default:
        jQuery(
          "#tblAllTaskDatatable_wrapper .dt-buttons .btntabletopdf"
        ).click();
        break;
    }

    $(".fullScreenSpin").css("display", "none");
  },

  "click #myAllTablesTab": function (e) {
    Template.instance().currentTabID.set(e.target.id);
  },

  "click .btnMailchimp": function (e) {
    swal(
      "You are not set up yet, do you wish to create an account with Mail Chimp",
      "",
      "warning"
    );
    return;
  },
});

Template.crmoverview.helpers({
  crmtaskmitem: () => {
    return Template.instance().crmtaskmitem.get();
  },
  isAllTasks: () => {
    return Template.instance().crmtaskmitem.get() === "all";
  },
  isTaskToday: () => {
    return Template.instance().crmtaskmitem.get() === "today";
  },
  isTaskUpcoming: () => {
    return Template.instance().crmtaskmitem.get() === "upcoming";
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  currentTabID: () => {
    return Template.instance().currentTabID.get();
  },
});

function openEditTaskModal(id, type) {
  // let catg = e.target.dataset.catg;
  // let templateObject = Template.instance();
  // $("#editProjectID").val("");
  $("#txtCrmSubTaskID").val(id);

  $(".fullScreenSpin").css("display", "inline-block");
  // get selected task detail via api
  crmService
      .getTaskDetail(id)
      .then(function (data) {
        $(".fullScreenSpin").css("display", "none");
        if (data.fields.ID == id) {
          let selected_record = data.fields;

          $("#txtCrmTaskID").val(selected_record.ID);
          $("#txtCrmProjectID").val(selected_record.ProjectID);
          $("#txtCommentsDescription").val("");

          $(".editTaskDetailName").val(selected_record.TaskName);
          $(".editTaskDetailDescription").val(
              selected_record.TaskDescription
          );

          let projectName =
              selected_record.ProjectName == "Default"
                  ? "All Tasks"
                  : selected_record.ProjectName;

          let catg = "";
          let today = moment().format("YYYY-MM-DD");
          if (selected_record.due_date) {
            if (selected_record.due_date.substring(0, 10) == today) {
              catg =
                  `<i class="fas fa-calendar-day text-primary" style="margin-right: 5px;"></i>` +
                  "<span class='text-primary'>" +
                  projectName +
                  "</span>";
              $(".taskDueDate").css("color", "#00a3d3");
            } else if (selected_record.due_date.substring(0, 10) > today) {
              catg =
                  `<i class="fas fa-calendar-alt text-danger" style="margin-right: 5px;"></i>` +
                  "<span class='text-danger'>" +
                  projectName +
                  "</span>";
              $(".taskDueDate").css("color", "#1cc88a");
            } else if (selected_record.due_date.substring(0, 10) < today) {
              // catg =
              //   `<i class="fas fa-inbox text-warning" style="margin-right: 5px;"></i>` +
              //   "<span class='text-warning'>Overdue</span>";
              // $(".taskDueDate").css("color", "#e74a3b");
              catg =
                  `<i class="fas fa-inbox text-success" style="margin-right: 5px;"></i>` +
                  "<span class='text-success'>" +
                  projectName +
                  "</span>";
              $(".taskDueDate").css("color", "#1cc88a");
            } else {
              catg =
                  `<i class="fas fa-inbox text-success" style="margin-right: 5px;"></i>` +
                  "<span class='text-success'>" +
                  projectName +
                  "</span>";
              $(".taskDueDate").css("color", "#1cc88a");
            }
          } else {
            catg =
                `<i class="fas fa-inbox text-success" style="margin-right: 5px;"></i>` +
                "<span class='text-success'>" +
                projectName +
                "</span>";
            $(".taskDueDate").css("color", "#1cc88a");
          }

          $(".taskLocation").html(
              `<a class="taganchor">
                ${catg}
              </a>`
          );

          $("#taskmodalNameLabel").html(selected_record.TaskName);
          $(".activityAdded").html(
              "Added on " +
              moment(selected_record.MsTimeStamp).format("MMM D h:mm A")
          );
          let due_date = selected_record.due_date
              ? moment(selected_record.due_date).format("D MMM")
              : "No Date";
          $("#taskmodalDuedate").html(due_date);
          $("#taskmodalDescription").html(selected_record.TaskDescription);

          $("#chkComplete_taskEditLabel").removeClass("task_priority_0");
          $("#chkComplete_taskEditLabel").removeClass("task_priority_1");
          $("#chkComplete_taskEditLabel").removeClass("task_priority_2");
          $("#chkComplete_taskEditLabel").removeClass("task_priority_3");
          $("#chkComplete_taskEditLabel").addClass(
              "task_priority_" + selected_record.priority
          );

          let taskmodalLabels = "";
          $(".chkDetailLabel").prop("checked", false);
          if (selected_record.TaskLabel) {
            if (selected_record.TaskLabel.fields != undefined) {
              taskmodalLabels =
                  `<a class="taganchor filterByLabel" href="" data-id="${selected_record.TaskLabel.fields.ID}">` +
                  selected_record.TaskLabel.fields.TaskLabelName +
                  "</a>";
              $("#detail_label_" + selected_record.TaskLabel.fields.ID).prop(
                  "checked",
                  true
              );
            } else {
              selected_record.TaskLabel.forEach((lbl) => {
                taskmodalLabels +=
                    `<a class="taganchor filterByLabel" href="" data-id="${lbl.fields.ID}">` +
                    lbl.fields.TaskLabelName +
                    "</a>, ";
                $("#detail_label_" + lbl.fields.ID).prop("checked", true);
              });
              taskmodalLabels = taskmodalLabels.slice(0, -2);
            }
          }
          if (taskmodalLabels != "") {
            taskmodalLabels =
                '<span class="taskTag"><i class="fas fa-tag"></i>' +
                taskmodalLabels +
                "</span>";
          }
          $("#taskmodalLabels").html(taskmodalLabels);

          let subtasks = "";
          if (selected_record.subtasks) {
            if (selected_record.subtasks.fields != undefined) {
              let subtask = selected_record.subtasks.fields;
              let sub_due_date = subtask.SubTaskDate
                  ? moment(subtask.SubTaskDate).format("D MMM")
                  : "";
              subtasks += `<div class="col-12 taskCol subtaskCol" id="subtask_${subtask.ID}">
                <div class="row justify-content-between">
                  <div style="display: inline-flex;">
                    <i class="fas fa-grip-vertical taskActionButton taskDrag"></i>
                    <div class="custom-control custom-checkbox chkBox pointer"
                      style="width: 15px; margin: 4px;">
                      <input class="custom-control-input chkBox pointer task_priority_${subtask.priority}" type="checkbox"
                        id="subtaskitem_${subtask.ID}" value="">
                      <label class="custom-control-label chkBox pointer" for="subtaskitem_${subtask.ID}"></label>
                    </div>
                    <span class="taskName">${subtask.SubTaskName}</span>
                  </div>
                  <div style="display: inline-flex;">
                    <i class="far fa-edit taskActionButton" data-toggle="tooltip" data-placement="bottom"
                      title="Edit task..."></i>
                    <i class="far fa-calendar-plus taskActionButton" data-toggle="tooltip"
                      data-placement="bottom" title="Set due date..."></i>
                    <i class="far fa-comment-alt taskActionButton" data-toggle="tooltip" data-placement="bottom"
                      title="Comment on task..."></i>
                    <i class="fas fa-ellipsis-h taskActionButton" data-toggle="tooltip" data-placement="bottom"
                      title="More Options"></i>
                  </div>
                </div>
                <div class="row justify-content-between">
                </div>
                <div class="row justify-content-between">
                  <div class="dueDateTags" style="display: inline-flex;">
                    <span class="taskDueDate"><i class="far fa-calendar-plus"
                        style="margin-right: 5px;"></i>${sub_due_date}</span>
                    <span class="taskTag"><a class="taganchor" href=""></a></span>
                  </div>
                  <div style="display: inline-flex;"> 
                  </div>
                </div>
                <hr />
              </div>`;
            } else {
              selected_record.subtasks.forEach((item) => {
                let subtask = item.fields;
                let sub_due_date = subtask.SubTaskDate
                    ? moment(subtask.SubTaskDate).format("D MMM")
                    : "";
                subtasks += `<div class="col-12 taskCol subtaskCol" id="subtask_${subtask.ID}">
                  <div class="row justify-content-between">
                    <div style="display: inline-flex;">
                      <i class="fas fa-grip-vertical taskActionButton taskDrag"></i>
                      <div class="custom-control custom-checkbox chkBox pointer"
                        style="width: 15px; margin: 4px;">
                        <input class="custom-control-input chkBox chkPaymentCard pointer" type="checkbox"
                          id="subtaskitem_${subtask.ID}" value="">
                        <label class="custom-control-label chkBox pointer" for="subtaskitem_${subtask.ID}"></label>
                      </div>
                      <span class="taskName">${subtask.SubTaskName}</span>
                    </div>
                    <div style="display: inline-flex;">
                      <i class="far fa-edit taskActionButton" data-toggle="tooltip" data-placement="bottom"
                        title="Edit task..."></i>
                      <i class="far fa-calendar-plus taskActionButton" data-toggle="tooltip"
                        data-placement="bottom" title="Set due date..."></i>
                      <i class="far fa-comment-alt taskActionButton" data-toggle="tooltip" data-placement="bottom"
                        title="Comment on task..."></i>
                      <i class="fas fa-ellipsis-h taskActionButton" data-toggle="tooltip" data-placement="bottom"
                        title="More Options"></i>
                    </div>
                  </div>
                  <div class="row justify-content-between">
                  </div>
                  <div class="row justify-content-between">
                    <div class="dueDateTags" style="display: inline-flex;">
                      <span class="taskDueDate taskOverdue"><i class="far fa-calendar-plus"
                          style="margin-right: 5px;"></i>${sub_due_date}</span>
                      <span class="taskTag"><a class="taganchor" href=""></a></span>
                    </div>
                    <div style="display: inline-flex;"> 
                    </div>
                  </div>
                  <hr />
                </div>`;
              });
            }
          }
          $(".subtask-row").html(subtasks);

          let comments = "";
          if (selected_record.comments) {
            if (selected_record.comments.fields != undefined) {
              let comment = selected_record.comments.fields;
              let comment_date = comment.CommentsDate
                  ? moment(comment.CommentsDate).format("MMM D h:mm A")
                  : "";
              let commentUserArry =
                  comment.EnteredBy.toUpperCase().split(" ");
              let commentUser =
                  commentUserArry.length > 1
                      ? commentUserArry[0].charAt(0) +
                      commentUserArry[1].charAt(0)
                      : commentUserArry[0].charAt(0);
              comments = `
                <div class="col-12 taskComment" style="padding: 16px 32px;" id="taskComment_${comment.ID}">
                  <div class="row commentRow">
                    <div class="col-1">
                      <div class="commentUser">${commentUser}</div>
                    </div>
                    <div class="col-11" style="padding-top:4px; padding-left: 24px;">
                      <div class="row">
                        <div>
                          <span class="commenterName">${comment.EnteredBy}</span>
                          <span class="commentDateTime">${comment_date}</span>
                        </div>
                      </div>
                      <div class="row">
                        <span class="commentText">${comment.CommentsDescription}</span>
                      </div>
                    </div>
                  </div>
                </div>
                `;
            } else {
              selected_record.comments.forEach((item) => {
                let comment = item.fields;
                let comment_date = comment.CommentsDate
                    ? moment(comment.CommentsDate).format("MMM D h:mm A")
                    : "";
                let commentUserArry =
                    comment.EnteredBy.toUpperCase().split(" ");
                let commentUser =
                    commentUserArry.length > 1
                        ? commentUserArry[0].charAt(0) +
                        commentUserArry[1].charAt(0)
                        : commentUserArry[0].charAt(0);
                comments += `
                  <div class="col-12 taskComment" style="padding: 16px 32px;" id="taskComment_${comment.ID}">
                    <div class="row commentRow">
                      <div class="col-1">
                        <div class="commentUser">${commentUser}</div>
                      </div>
                      <div class="col-11" style="padding-top:4px; padding-left: 24px;">
                        <div class="row">
                          <div>
                            <span class="commenterName">${comment.EnteredBy}</span>
                            <span class="commentDateTime">${comment_date}</span>
                          </div>
                        </div>
                        <div class="row">
                          <span class="commentText">${comment.CommentsDescription}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  `;
              });
            }
          }
          $(".task-comment-row").html(comments);

          let activities = "";
          if (selected_record.activity) {
            if (selected_record.activity.fields != undefined) {
              let activity = selected_record.activity.fields;
              let day = "";
              if (
                  moment().format("YYYY-MM-DD") ==
                  moment(activity.ActivityDateStartd).format("YYYY-MM-DD")
              ) {
                day = " ‧ Today";
              } else if (
                  moment().add(-1, "day").format("YYYY-MM-DD") ==
                  moment(activity.ActivityDateStartd).format("YYYY-MM-DD")
              ) {
                day = " . Yesterday";
              }
              let activityDate =
                  moment(activity.ActivityDateStartd).format("MMM D") +
                  day +
                  " . " +
                  moment(activity.ActivityDateStartd).format("ddd");

              let commentUserArry =
                  activity.EnteredBy.toUpperCase().split(" ");
              let commentUser =
                  commentUserArry.length > 1
                      ? commentUserArry[0].charAt(0) +
                      commentUserArry[1].charAt(0)
                      : commentUserArry[0].charAt(0);

              activities = `
                <div class="row" style="padding: 16px;">
                  <div class="col-12">
                    <span class="activityDate">${activityDate}</span>
                  </div>
                  <hr style="width: 100%; margin: 8px 16px;" />
                  <div class="col-1">
                    <div class="commentUser">${commentUser}</div>
                  </div>
                  <div class="col-11" style="padding-top: 4px; padding-left: 24px;">
                    <div class="row">
                      <span class="activityName">${
                  activity.EnteredBy
              } </span> <span class="activityAction">${
                  activity.ActivityName
              } </span>  
                    </div>
                    <div class="row">
                      <span class="activityComment">${
                  activity.ActivityDescription
              }</span>
                    </div>
                    <div class="row">
                      <span class="activityTime">${moment(
                  activity.ActivityDateStartd
              ).format("h:mm A")}</span>
                    </div>
                  </div>
                  <hr style="width: 100%; margin: 16px;" />
                </div>
                `;
            } else {
              selected_record.activity.forEach((item) => {
                let activity = item.fields;
                let day = "";
                if (
                    moment().format("YYYY-MM-DD") ==
                    moment(activity.ActivityDateStartd).format("YYYY-MM-DD")
                ) {
                  day = " ‧ Today";
                } else if (
                    moment().add(-1, "day").format("YYYY-MM-DD") ==
                    moment(activity.ActivityDateStartd).format("YYYY-MM-DD")
                ) {
                  day = " . Yesterday";
                }
                let activityDate =
                    moment(activity.ActivityDateStartd).format("MMM D") +
                    day +
                    " . " +
                    moment(activity.ActivityDateStartd).format("ddd");

                let commentUserArry =
                    activity.EnteredBy.toUpperCase().split(" ");
                let commentUser =
                    commentUserArry.length > 1
                        ? commentUserArry[0].charAt(0) +
                        commentUserArry[1].charAt(0)
                        : commentUserArry[0].charAt(0);

                activities = `
                  <div class="row" style="padding: 16px;">
                    <div class="col-12">
                      <span class="activityDate">${activityDate}</span>
                    </div>
                    <hr style="width: 100%; margin: 8px 16px;" />
                    <div class="col-1">
                      <div class="commentUser">${commentUser}</div>
                    </div>
                    <div class="col-11" style="padding-top: 4px; padding-left: 24px;">
                      <div class="row">
                        <span class="activityName">${
                    activity.EnteredBy
                } </span> <span class="activityAction">${
                    activity.ActivityName
                } </span>  
                      </div>
                      <div class="row">
                        <span class="activityComment">${
                    activity.ActivityDescription
                }</span>
                      </div>
                      <div class="row">
                        <span class="activityTime">${moment(
                    activity.ActivityDateStartd
                ).format("h:mm A")}</span>
                      </div>
                    </div>
                    <hr style="width: 100%; margin: 16px;" />
                  </div>
                  `;
              });
            }
          }
          $(".task-activity-row").html(activities);

          if (type == "comment") {
            $("#nav-comments-tab").click();
          } else {
            $("#nav-subtasks-tab").click();
          }

          $("#chkPriority0").prop("checked", false);
          $("#chkPriority1").prop("checked", false);
          $("#chkPriority2").prop("checked", false);
          $("#chkPriority3").prop("checked", false);
          $("#chkPriority" + selected_record.priority).prop("checked", true);

          $(".taskModalActionFlagDropdown").removeClass(
              "task_modal_priority_3"
          );
          $(".taskModalActionFlagDropdown").removeClass(
              "task_modal_priority_2"
          );
          $(".taskModalActionFlagDropdown").removeClass(
              "task_modal_priority_1"
          );
          $(".taskModalActionFlagDropdown").removeClass(
              "task_modal_priority_0"
          );
          $(".taskModalActionFlagDropdown").addClass(
              "task_modal_priority_" + selected_record.priority
          );

          $("#taskDetailModal").modal("toggle");
        } else {
          swal("Cannot edit this task", "", "warning");
          return;
        }
      })
  .catch(function (err) {
      $(".fullScreenSpin").css("display", "none");

      swal(err, "", "error");
      return;
  });
}
