import "../lib/global/indexdbstorage.js";

import { CRMService } from "./crm-service";
import { ContactService } from "../contacts/contact-service";
let crmService = new CRMService();

Template.crmoverview.onCreated(function () {
  let templateObject = Template.instance();
  templateObject.crmtaskmitem = new ReactiveVar("all");
  templateObject.currentTabID = new ReactiveVar("allTasks-tab");
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.tprojectlist = new ReactiveVar([]);
  templateObject.all_projects = new ReactiveVar([]);
});

Template.crmoverview.onRendered(function () {
  const templateObject = Template.instance();
  const contactService = new ContactService();
  let currentId = FlowRouter.current().queryParams.id;
  currentId = currentId ? currentId : "all";
  templateObject.crmtaskmitem.set(currentId);
  templateObject.currentTabID.set("allTasks-tab");

  function getCustomerData(customerID) {
    getVS1Data("TCustomerVS1").then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getOneCustomerDataEx(customerID).then(function (data) {
          setCustomerByID(data, 'Customer');
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tcustomervs1;
        let added = false;
        for (let i = 0; i < useData.length; i++) {
          if (parseInt(useData[i].fields.ID) === parseInt(customerID)) {
            added = true;
            setCustomerByID(useData[i], 'Customer');
          }
        }
        if (!added) {
          contactService
            .getOneCustomerDataEx(customerID)
            .then(function (data) {
              setCustomerByID(data, 'Customer');
            });
        }
      }
    }).catch(function (err) {
      contactService.getOneCustomerDataEx(customerID).then(function (data) {
        $(".fullScreenSpin").css("display", "none");
        setCustomerByID(data, 'Customer');
      });
    });
  }
  function getSupplierData(customerID) {
    getVS1Data("TSupplierVS1").then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getOneSupplierDataEx(customerID).then(function (data) {
          setCustomerByID(data, 'Supplier');
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tsuppliervs1;
        let added = false;
        for (let i = 0; i < useData.length; i++) {
          if (parseInt(useData[i].fields.ID) === parseInt(customerID)) {
            added = true;
            setCustomerByID(useData[i], 'Supplier');
          }
        }
        if (!added) {
          contactService
            .getOneSupplierDataEx(customerID)
            .then(function (data) {
              setCustomerByID(data, 'Supplier');
            });
        }
      }
    }).catch(function (err) {
      contactService.getOneSupplierDataEx(customerID).then(function (data) {
        $(".fullScreenSpin").css("display", "none");
        setCustomerByID(data, 'Supplier');
      });
    });
  }
  function getLeadData(leadID) {
    getVS1Data("TProspectEx").then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getOneLeadDataEx(leadID).then(function (data) {
          setCustomerByID(data, 'Lead');
        });

      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tprospectvs1;
        let added = false;
        for (let i = 0; i < useData.length; i++) {
          if (parseInt(useData[i].fields.ID) === parseInt(leadID)) {
            added = true;
            setCustomerByID(useData[i], 'Lead');
          }
        }
        if (!added) {
          contactService.getOneLeadDataEx(leadID).then(function (data) {
            setCustomerByID(data, 'Lead');
          });
        }
      }
    }).catch(function (err) {
      contactService.getOneLeadDataEx(leadID).then(function (data) {
        $(".fullScreenSpin").css("display", "none");
        setCustomerByID(data, 'Lead');
      });
    });
  }
  function setCustomerByID(data, type) {
    // $("#add_task_name").val(data.fields.ClientName);
    const $select = document.querySelector('#add_contact_name');
    $select.value = data.fields.ClientName
    $('#contactID').val(data.fields.ID)
    $('#contactType').val(type)

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

  templateObject.getInitTProjectList = function () {
    getVS1Data("TCRMProjectList").then(function (dataObject) {
      if (dataObject.length == 0) {
        templateObject.getTProjectList();
      } else {
        let data = JSON.parse(dataObject[0].data);
        if (data.tprojectlist && data.tprojectlist.length > 0) {
          let tprojectlist = data.tprojectlist;
          let all_projects = data.tprojectlist;

          const url = new URL(window.location.href);
          let employeeID = url.searchParams.get("id") ? url.searchParams.get("id") : '';

          if (employeeID) {
            all_projects = all_projects.filter((proj) => proj.fields.ID != 11 && proj.fields.EnteredBy == employeeID);
            tprojectlist = tprojectlist.filter((proj) => proj.fields.Active == true && proj.fields.ID != 11 && proj.fields.EnteredBy == employeeID);
          } else {
            all_projects = all_projects.filter((proj) => proj.fields.ID != 11);
            tprojectlist = tprojectlist.filter((proj) => proj.fields.Active == true && proj.fields.ID != 11);
          }
          templateObject.all_projects.set(all_projects);

          let add_projectlist = `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="11" data-projectname="All Tasks"><i class="fas fa-inbox text-primary no-modal"
            style="margin-right: 8px;"></i>All Tasks</a>`;
          let ProjectName = "";
          tprojectlist.forEach((proj) => {
            ProjectName = proj.fields.ProjectName.length > 26 ? proj.fields.ProjectName.substring(0, 26) + "..." : proj.fields.ProjectName;
            add_projectlist += `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="${proj.fields.ID}" data-projectname="${proj.fields.ProjectName}"><i class="fas fa-circle no-modal" style="margin-right: 8px; color: ${proj.fields.ProjectColour};"></i>${ProjectName}</a>`;
          });
          $("#goProjectWrapper").html(add_projectlist);
          $(".goProjectWrapper").html(add_projectlist);

          let active_projects = all_projects.filter((project) => project.fields.Active == true);
          let deleted_projects = all_projects.filter((project) => project.fields.Active == false);
          let favorite_projects = active_projects.filter((project) => project.fields.AddToFavourite == true);

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
    }).catch(function (err) {
      templateObject.getTProjectList();
    });
  };
  templateObject.getTProjectList = function () {
    let url = FlowRouter.current().path;
    url = new URL(window.location.href);
    let employeeID = url.searchParams.get("id") ? url.searchParams.get("id") : '';

    crmService.getTProjectList(employeeID).then(function (data) {
      if (data.tprojectlist && data.tprojectlist.length > 0) {
        let tprojectlist = data.tprojectlist;
        let all_projects = data.tprojectlist;

        tprojectlist = tprojectlist.filter((proj) => proj.fields.Active == true && proj.fields.ID != 11);
        all_projects = all_projects.filter((proj) => proj.fields.ID != 11);
        templateObject.all_projects.set(all_projects);

        let add_projectlist = `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="11" data-projectname="All Tasks"><i class="fas fa-inbox text-primary no-modal"
          style="margin-right: 8px;"></i>All Tasks</a>`;
        let ProjectName = "";
        tprojectlist.forEach((proj) => {
          ProjectName = proj.fields.ProjectName.length > 26 ? proj.fields.ProjectName.substring(0, 26) + "..." : proj.fields.ProjectName;
          add_projectlist += `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="${proj.fields.ID}" data-projectname="${proj.fields.ProjectName}"><i class="fas fa-circle no-modal" style="margin-right: 8px; color: ${proj.fields.ProjectColour};"></i>${ProjectName}</a>`;
        });
        $("#goProjectWrapper").html(add_projectlist);
        $(".goProjectWrapper").html(add_projectlist);

        let active_projects = all_projects.filter((project) => project.fields.Active == true);
        let deleted_projects = all_projects.filter((project) => project.fields.Active == false);
        let favorite_projects = active_projects.filter((project) => project.fields.AddToFavourite == true);

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
    }).catch(function (err) { });
  };

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
    $(".fullScreenSpin").css("display", "inline-block");
    openEditTaskModal(FlowRouter.current().queryParams.taskid, type);
  }

  ///////////////////////////////////////////////////
  $(".crmSelectLeadList").editableSelect();
  $(".crmSelectLeadList").editableSelect().on("click.editable-select", function (e, li) {
    $("#customerListModal").modal();
  });

  $(".crmSelectEmployeeList").editableSelect();
  $(".crmSelectEmployeeList").editableSelect().on("click.editable-select", function (e, li) {
    $("#employeeListModal").modal();
  });


  $(document).on("click", "#tblContactlist tbody tr", function (e) {
    var table = $(this);
    let colClientName = table.find(".colClientName").text();
    let colID = table.find(".colID").text();
    let colType = table.find(".colType").text();

    if (colType == 'Lead' || colType == 'Customer' || colType == 'Supplier' || colType == 'Employee' || colType == 'Customer / Supplier') {
      colType = colType == 'Customer / Supplier' ? 'Customer' : colType;
      $('#customerListModal').modal('toggle');

      // for add modal
      $('#add_contact_name').val(colClientName);
      // for edit modal
      $('#crmSelectLeadList').val(colClientName);

      $('#contactID').val(colID)
      $('#contactType').val(colType)
    } else {
      swal("Please select valid type of contact", "", "error");
      return false;
    }

  });

  $(document).on("click", "#tblEmployeelist tbody tr", function (e) {
    var table = $(this);
    let colEmployeeName = table.find(".colEmployeeName").text();
    let colID = table.find(".colID").text(); 
 
    $('#employeeListModal').modal('toggle');

    // for add modal
    $('#add_assigned_name').val(colEmployeeName);
    // for edit modal
    $('#crmSelectEmployeeList').val(colEmployeeName);

    $('#assignedID').val(colID) 
  });
  ///////////////////////////////////////////////////

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
      crmService.saveComment(objDetails).then(function (objDetails) {
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
      }).catch(function (err) {
        swal({
          title: "Oooops...",
          text: err,
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        }).then((result) => { });
        $(".fullScreenSpin").css("display", "none");
      });
    }
  },

  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");

    crmService.getAllTaskList().then(function (data) {
      addVS1Data("TCRMTaskList", JSON.stringify(data));
      crmService.getTProjectList().then(function (data) {
        addVS1Data("TCRMProjectList", JSON.stringify(data));
        crmService.getAllLabels().then(function (data) {
          addVS1Data("TCRMLabelList", JSON.stringify(data));

          crmService.getAllLeads(dateFrom).then(function (data) {
            let bar_records = [];
            let pie_records = [];
            if (data.tprospect.length) {

              let accountData = data.tprospect;
              for (let i = 0; i < accountData.length; i++) {
                let recordObj = {};
                recordObj.Id = data.tprospect[i].fields.ID;
                let CreationDate = data.tprospect[i].fields.CreationDate ? data.tprospect[i].fields.CreationDate.substr(0, 10) : "";

                recordObj.CreationDateSort = CreationDate ? CreationDate : "-";
                recordObj.CreationDate = CreationDate ? getModdayOfCurrentWeek(CreationDate) + "~" : "-";
                bar_records.push(recordObj);

                let pieRecordObj = {};
                pieRecordObj.Id = data.tprospect[i].fields.ID;
                pieRecordObj.SourceName = data.tprospect[i].fields.SourceName ? data.tprospect[i].fields.SourceName : "-";
                pie_records.push(pieRecordObj);
              }

              bar_records = _.sortBy(bar_records, 'CreationDateSort');
              bar_records = _.groupBy(bar_records, 'CreationDate');

              pie_records = _.sortBy(pie_records, 'SourceName');
              pie_records = _.groupBy(pie_records, 'SourceName');

            } else {
              let recordObj = {};
              recordObj.Id = '';
              recordObj.CreationDate = '-';

              let pieRecordObj = {};
              pieRecordObj.Id = '';
              pieRecordObj.SourceName = '-';

              bar_records.push(recordObj);
              pie_records.push(pieRecordObj);
            }

            addVS1Data("TCRMLeadBarChart", JSON.stringify(bar_records));
            addVS1Data("TCRMLeadPieChart", JSON.stringify(pie_records));
            window.history.pushState('name', '', 'crmoverview');
            Meteor._reload.reload();
          }).catch(function (err) {
            window.history.pushState('name', '', 'crmoverview');
            Meteor._reload.reload();
          });

        }).catch(function (err) {
          window.history.pushState('name', '', 'crmoverview');
          Meteor._reload.reload();
        });
      }).catch(function (err) {
        window.history.pushState('name', '', 'crmoverview');
        Meteor._reload.reload();
      });
    }).catch(function (err) {
      window.history.pushState('name', '', 'crmoverview');
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
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
        if ($(event.target).is(":checked")) {
          $("#" + tableName).find("." + replaceClass + "").css("display", "table-cell");
          $("#" + tableName).find("." + replaceClass + "").removeClass("hiddenColumn");
          $("#" + tableName).find("." + replaceClass + "").css("padding", ".75rem");
          $("#" + tableName).find("." + replaceClass + "").css("vertical-align", "top");
        } else {
          // $("#" + tableName)
          //   .find("." + replaceClass + "")
          //   .css("display", "none");
          $("#" + tableName).find("." + replaceClass + "").addClass("hiddenColumn");
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
        jQuery("#tblTodayTaskDatatable_wrapper .dt-buttons .btntabletocsv").click();
        break;
      case "upcomingTab-tab":
        jQuery("#tblUpcomingTaskDatatable_wrapper .dt-buttons .btntabletocsv").click();
        break;
      case "projectsTab-tab":
        jQuery("#tblNewProjectsDatatable_wrapper .dt-buttons .btntabletocsv").click();
        break;
      case "filterLabelsTab-tab":
        jQuery("#tblLabels_wrapper .dt-buttons .btntabletocsv").click();
        break;
      default:
        jQuery("#tblAllTaskDatatable_wrapper .dt-buttons .btntabletocsv").click();
        break;
    }

    $(".fullScreenSpin").css("display", "none");
  },

  "click .printConfirm": function (event) {
    let currentTabID = Template.instance().currentTabID.get();

    $(".fullScreenSpin").css("display", "inline-block");
    switch (currentTabID) {
      case "todayTab-tab":
        jQuery("#tblTodayTaskDatatable_wrapper .dt-buttons .btntabletopdf").click();
        break;
      case "upcomingTab-tab":
        jQuery("#tblUpcomingTaskDatatable_wrapper .dt-buttons .btntabletopdf").click();
        break;
      case "projectsTab-tab":
        jQuery("#tblNewProjectsDatatable_wrapper .dt-buttons .btntabletopdf").click();
        break;
      case "filterLabelsTab-tab":
        jQuery("#tblLabels_wrapper .dt-buttons .btntabletopdf").click();
        break;
      default:
        jQuery("#tblAllTaskDatatable_wrapper .dt-buttons .btntabletopdf").click();
        break;
    }

    $(".fullScreenSpin").css("display", "none");
  },

  "click #myAllTablesTab": function (e) {
    Template.instance().currentTabID.set(e.target.id);
  },

  "click #btn_send_to_mailchimp": function (e) {
    let isCustomer = "off";
    let isSupplier = "off";
    let isEmployee = "off";
    if ($('#chk_customer').is(":checked")) {
      isCustomer = "on";
    }
    if ($('#chk_supplier').is(":checked")) {
      isSupplier = "on";
    }
    if ($('#chk_employee').is(":checked")) {
      isEmployee = "on";
    }
    $(".fullScreenSpin").css("display", "inline-block");
    try {
      var erpGet = erpDb();
      Meteor.call('createListMembers', erpGet, isSupplier, isCustomer, isEmployee, function (error, result) {
        if (error !== undefined) {
          swal("Something went wrong!", "", "error");
        } else {
          swal("Contacts are added to Mail Chimp successfully", "", "success");
        }
        $(".fullScreenSpin").css("display", "none");
      });
    } catch (error) {
      swal("Something went wrong!", "", "error");
      $(".fullScreenSpin").css("display", "none");
    }
  },

  "click #btnAddCampaign": function (e) {


    $('#crmMailchimpAddCampaignModal').modal();
    return;
  },

  "click .btnMailchimp": function (e) {
    $('#crmMailchimpModal').modal();
    return;
  },

  "click #btnCorrespondence": function (e) {
    FlowRouter.go("/correspondence-list");
    return;
  },

  "click #btnCampaign": function (e) {
    FlowRouter.go("/campaign-list");
    return;
  },

  "click .menu_all_task": function (e) {
    $('#allTasks-tab').click();
    $('#crm_header_title').html('All Tasks');
  },

  "click .menu_today": function (e) {
    $('#todayTab-tab').click();
    $('#crm_header_title').html('Today Tasks');
  },

  "click .menu_upcoming": function (e) {
    $('#upcomingTab-tab').click();
    $('#crm_header_title').html('Upcoming Tasks');
  },

  "click .menu_project": function (e) {
    $('#projectsTab-tab').click();
    $('#crm_header_title').html('Projects');
  },

  "click .menu_label": function (e) {
    $('#filterLabelsTab-tab').click();
    $('#crm_header_title').html('Labels');
  },

  "click #sidenavcrm": function (e) {
    FlowRouter.go("/crmoverview");
    Meteor._reload.reload();
  }

});

Template.crmoverview.helpers({
  crmtaskmitem: () => {
    return Template.instance().crmtaskmitem.get();
  },
  // isAllTasks: () => {
  //   return Template.instance().crmtaskmitem.get() === "all";
  // },
  // isTaskToday: () => {
  //   return Template.instance().crmtaskmitem.get() === "today";
  // },
  // isTaskUpcoming: () => {
  //   return Template.instance().crmtaskmitem.get() === "upcoming";
  // },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  currentTabID: () => {
    return Template.instance().currentTabID.get();
  },
});

function openEditTaskModal(id, type) {
  // let catg = e.target.dataset.catg;
  let templateObject = Template.instance();
  // $("#editProjectID").val("");

  $("#txtCrmSubTaskID").val(id);

  $(".fullScreenSpin").css("display", "inline-block");
  // get selected task detail via api
  crmService.getTaskDetail(id).then(function (data) {
    if (data.fields.ID == id) {
      let selected_record = data.fields; 

      $("#txtCrmTaskID").val(selected_record.ID);
      $("#txtCrmProjectID").val(selected_record.ProjectID);
      $("#txtCommentsDescription").val("");

      $(".editTaskDetailName").val(selected_record.TaskName);
      $(".editTaskDetailDescription").val(selected_record.TaskDescription);

      let projectName = selected_record.ProjectName == "Default" ? "All Tasks" : selected_record.ProjectName;

      if (selected_record.Completed) {
        $('#lblComplete_taskEditLabel').removeClass('chk_complete');
        $('#lblComplete_taskEditLabel').addClass('chk_uncomplete');
        $('#chkComplete_taskEdit').removeClass('chk_complete');
        $('#chkComplete_taskEdit').addClass('chk_uncomplete');
        $('#chkComplete_taskEdit').prop("checked", true);
      } else {
        $('#lblComplete_taskEditLabel').removeClass('chk_uncomplete');
        $('#lblComplete_taskEditLabel').addClass('chk_complete');
        $('#chkComplete_taskEdit').removeClass('chk_uncomplete');
        $('#chkComplete_taskEdit').addClass('chk_complete');
        $('#chkComplete_taskEdit').prop("checked", false);
      }

      let all_projects = templateObject.all_projects.get();
      let projectColorStyle = '';
      if (selected_record.ProjectID != 0) {
        let projects = all_projects.filter(project => project.fields.ID == selected_record.ProjectID);
        if (projects.length && projects[0].fields.ProjectColour) {
          projectColorStyle = 'color: ' + projects[0].fields.ProjectColour + ' !important';
        }
      }

      let catg = "";
      let today = moment().format("YYYY-MM-DD");
      if (selected_record.due_date) {
        if (selected_record.due_date.substring(0, 10) == today) {
          catg =
              `<i class="fas fa-calendar-day text-primary" style="margin-right: 5px; ${projectColorStyle}"></i>` +
              "<span class='text-primary' style='" + projectColorStyle + "'>" +
              projectName +
              "</span>";
          $(".taskDueDate").css("color", "#00a3d3");
        } else if (selected_record.due_date.substring(0, 10) > today) {
          catg =
              `<i class="fas fa-calendar-alt text-danger" style="margin-right: 5px; ${projectColorStyle}"></i>` +
              "<span class='text-danger' style='" + projectColorStyle + "'>" +
              projectName +
              "</span>";
          $(".taskDueDate").css("color", "#1cc88a");
        } else if (selected_record.due_date.substring(0, 10) < today) {
          // catg =
          //   `<i class="fas fa-inbox text-warning" style="margin-right: 5px;"></i>` +
          //   "<span class='text-warning'>Overdue</span>";
          // $(".taskDueDate").css("color", "#e74a3b");
          catg =
              `<i class="fas fa-inbox text-success" style="margin-right: 5px; ${projectColorStyle}"></i>` +
              "<span class='text-success' style='" + projectColorStyle + "'>" +
              projectName +
              "</span>";
          $(".taskDueDate").css("color", "#1cc88a");
        } else {
          catg =
              `<i class="fas fa-inbox text-success" style="margin-right: 5px; ${projectColorStyle}"></i>` +
              "<span class='text-success' style='" + projectColorStyle + "'>" +
              projectName +
              "</span>";
          $(".taskDueDate").css("color", "#1cc88a");
        }
      } else {
        catg =
            `<i class="fas fa-inbox text-success" style="margin-right: 5px; ${projectColorStyle}"></i>` +
            "<span class='text-success' style='" + projectColorStyle + "'>" +
            projectName +
            "</span>";
        $(".taskDueDate").css("color", "#1cc88a");
      }

      $(".taskLocation").html(
          `<a class="taganchor">
                ${catg}
              </a>`
      );

      if(projectName) {
        $('.taskDetailProjectName').show();
      } else {
        $('.taskDetailProjectName').hide();
      }

      $("#taskmodalNameLabel").html(selected_record.TaskName);
      $(".activityAdded").html("Added on " + moment(selected_record.MsTimeStamp).format("MMM D h:mm A"));
      let due_date = selected_record.due_date ? moment(selected_record.due_date).format("D MMM") : "No Date";


      let todayDate = moment().format("ddd");
      let tomorrowDay = moment().add(1, "day").format("ddd");
      let nextMonday = moment(moment()).day(1 + 7).format("ddd MMM D");
      let date_component = ` <div class="dropdown btnTaskTableAction">
        <div data-toggle="dropdown" title="Reschedule Task" style="cursor:pointer;">
          <i class="far fa-calendar-plus" style="margin-right: 5px;"></i>
          <span id="edit_task_modal_due_date">${due_date}</span>
        </div>
        <div class="dropdown-menu dropdown-menu-right reschedule-dropdown-menu  no-modal"
          aria-labelledby="dropdownMenuButton" style="width: 275px;">
          <a class="dropdown-item no-modal setScheduleToday" href="#" data-id="${selected_record.ID}">
            <i class="fas fa-calendar-day text-success no-modal"
              style="margin-right: 8px;"></i>Today
            <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
              ${todayDate}</div>
          </a>
          <a class="dropdown-item no-modal setScheduleTomorrow" href="#"
            data-id="${selected_record.ID}">
            <i class="fas fa-sun text-warning no-modal" style="margin-right: 8px;"></i>Tomorrow
            <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
              ${tomorrowDay}</div>
          </a>
          <a class="dropdown-item no-modal setScheduleWeekend" href="#"
            data-id="${selected_record.ID}">
            <i class="fas fa-couch text-primary no-modal" style="margin-right: 8px;"></i>This Weekend
            <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
              Sat</div>
          </a>
          <a class="dropdown-item no-modal setScheduleNexweek" href="#"
            data-id="${selected_record.ID}">
            <i class="fas fa-calendar-alt text-danger no-modal" style="margin-right: 8px;"></i>Next Week
            <div class="float-right no-modal" style="width: 40%; text-align: end; color: #858796;">
              ${nextMonday}
            </div>
          </a>
          <a class="dropdown-item no-modal setScheduleNodate" href="#" data-id="${selected_record.ID}">
            <i class="fas fa-ban text-secondary no-modal" style="margin-right: 8px;"></i>
            No Date</a>
          <div class="dropdown-divider no-modal"></div>
          <div class="form-group no-modal" data-toggle="tooltip" data-placement="bottom"
            title="Date format: DD/MM/YYYY" style="margin: 6px 20px; margin-top: 14px;">
            <div class="input-group date no-modal" style="cursor: pointer;">
              <input type="text" id="${selected_record.ID}" class="form-control crmDatepicker no-modal"
                autocomplete="off">
              <div class="input-group-addon no-modal">
                <span class="glyphicon glyphicon-th no-modal" style="cursor: pointer;"></span>
              </div>
            </div>
          </div>
        </div>
      </div>`;

      // $("#taskmodalDuedate").html(due_date);
      $("#taskmodalDuedate").html(date_component);
      $("#taskmodalDescription").html(selected_record.TaskDescription);

      $("#chkComplete_taskEditLabel").removeClass("task_priority_0");
      $("#chkComplete_taskEditLabel").removeClass("task_priority_1");
      $("#chkComplete_taskEditLabel").removeClass("task_priority_2");
      $("#chkComplete_taskEditLabel").removeClass("task_priority_3");
      $("#chkComplete_taskEditLabel").addClass("task_priority_" + selected_record.priority);

      let taskmodalLabels = "";
      $(".chkDetailLabel").prop("checked", false);
      if (selected_record.TaskLabel) {
        if (selected_record.TaskLabel.fields != undefined) {
          taskmodalLabels =
              `<span class="taskTag"><i class="fas fa-tag" style="color:${selected_record.TaskLabel.fields.Color};"></i><a class="taganchor filterByLabel" href="" data-id="${selected_record.TaskLabel.fields.ID}">` +
              selected_record.TaskLabel.fields.TaskLabelName +
              "</a></span>";
          $("#detail_label_" + selected_record.TaskLabel.fields.ID).prop(
              "checked",
              true
          );
        } else {
          selected_record.TaskLabel.forEach((lbl) => {
            taskmodalLabels +=
                `<span class="taskTag"><i class="fas fa-tag" style="color:${lbl.fields.Color};"></i><a class="taganchor filterByLabel" href="" data-id="${lbl.fields.ID}">` +
                lbl.fields.TaskLabelName +
                "</a></span> ";
            $("#detail_label_" + lbl.fields.ID).prop("checked", true);
          });
          taskmodalLabels = taskmodalLabels.slice(0, -2);
        }
      }
      // if (taskmodalLabels != "") {
      //   taskmodalLabels =
      //     '<span class="taskTag"><i class="fas fa-tag"></i>' +
      //     taskmodalLabels +
      //     "</span>";
      // }
      $("#taskmodalLabels").html(taskmodalLabels);
      let subtasks = "";
      if (selected_record.subtasks) {
        if (Array.isArray(selected_record.subtasks)) {
          templateObject.subTasks.set(selected_record.subtasks)
          templateObject.initSubtaskDatatable();
        }

        if (typeof selected_record.subtasks == 'object') {
          let arr = [];
          arr.push(selected_record.subtasks)
          templateObject.subTasks.set(arr)
          templateObject.initSubtaskDatatable();
        }
      } else {
        let sutTaskTable = $('#tblSubtaskDatatable').DataTable();
        sutTaskTable.clear().draw();
      }

      let comments = "";
      if (selected_record.comments) {
        if (selected_record.comments.fields != undefined) {
          let comment = selected_record.comments.fields;
          let comment_date = comment.CommentsDate ? moment(comment.CommentsDate).format("MMM D h:mm A") : "";
          let commentUserArry = comment.EnteredBy.toUpperCase().split(" ");
          let commentUser = commentUserArry.length > 1 ? commentUserArry[0].charAt(0) + commentUserArry[1].charAt(0) : commentUserArry[0].charAt(0);
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
            let comment_date = comment.CommentsDate ? moment(comment.CommentsDate).format("MMM D h:mm A") : "";
            let commentUserArry = comment.EnteredBy.toUpperCase().split(" ");
            let commentUser = commentUserArry.length > 1 ? commentUserArry[0].charAt(0) + commentUserArry[1].charAt(0) : commentUserArry[0].charAt(0);
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
          if (moment().format("YYYY-MM-DD") == moment(activity.ActivityDateStartd).format("YYYY-MM-DD")) {
            day = " ‧ Today";
          } else if (moment().add(-1, "day").format("YYYY-MM-DD") == moment(activity.ActivityDateStartd).format("YYYY-MM-DD")) {
            day = " . Yesterday";
          }
          let activityDate = moment(activity.ActivityDateStartd).format("MMM D") + day + " . " + moment(activity.ActivityDateStartd).format("ddd");

          let commentUserArry = activity.EnteredBy.toUpperCase().split(" ");
          let commentUser = commentUserArry.length > 1 ? commentUserArry[0].charAt(0) + commentUserArry[1].charAt(0) : commentUserArry[0].charAt(0);

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
                      <span class="activityName">${activity.EnteredBy
          } </span> <span class="activityAction">${activity.ActivityName
          } </span>
                    </div>
                    <div class="row">
                      <span class="activityComment">${activity.ActivityDescription
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
            if (moment().format("YYYY-MM-DD") == moment(activity.ActivityDateStartd).format("YYYY-MM-DD")) {
              day = " ‧ Today";
            } else if (moment().add(-1, "day").format("YYYY-MM-DD") == moment(activity.ActivityDateStartd).format("YYYY-MM-DD")) {
              day = " . Yesterday";
            }
            let activityDate = moment(activity.ActivityDateStartd).format("MMM D") + day + " . " + moment(activity.ActivityDateStartd).format("ddd");

            let commentUserArry = activity.EnteredBy.toUpperCase().split(" ");
            let commentUser = commentUserArry.length > 1 ? commentUserArry[0].charAt(0) + commentUserArry[1].charAt(0) : commentUserArry[0].charAt(0);

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
                        <span class="activityName">${activity.EnteredBy
            } </span> <span class="activityAction">${activity.ActivityName
            } </span>
                      </div>
                      <div class="row">
                        <span class="activityComment">${activity.ActivityDescription
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
          let task_id = inst.id;
          templateObject.updateTaskSchedule(task_id, dateText);
        },
      });
      let currentDate = new Date();
      let begunDate = moment(currentDate).format("DD/MM/YYYY");
      $(".crmDatepicker").val(begunDate);


      let contactID = 0;
      let contactType = '';
      if (selected_record.CustomerID) {
        contactID = selected_record.CustomerID;
        contactType = 'Customer';
      } else if (selected_record.SupplierID) {
        contactID = selected_record.SupplierID;
        contactType = 'Supplier';
      } else if (selected_record.LeadID) {
        contactID = selected_record.LeadID;
        contactType = 'Lead';
      }
      getContactData(contactID, contactType);
      $(".fullScreenSpin").css("display", "none");

    } else {
      swal("Cannot edit this task", "", "warning");
      return;
    }
  }).catch(function (err) {
    $(".fullScreenSpin").css("display", "none");

    swal(err, "", "error");
    return;
  });
}
function getContactData(contactID, contactType) {
  if (contactType == 'Customer') {
    getVS1Data("TCustomerVS1").then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getOneCustomerDataEx(contactID).then(function (data) {
          setContactDataToDetail(data, contactType);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tcustomervs1;
        for (let i = 0; i < useData.length; i++) {
          if (parseInt(useData[i].fields.ID) === parseInt(contactID)) {
            setContactDataToDetail(useData[i], contactType);
          }
        }
      }
    }).catch(function (err) {
      contactService.getOneCustomerDataEx(contactID).then(function (data) {
        setContactDataToDetail(data, contactType);
      });
    });
  } else if (contactType == 'Supplier') {
    getVS1Data("TSupplierVS1").then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getOneSupplierDataEx(contactID).then(function (data) {
          setContactDataToDetail(data, contactType);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tsuppliervs1;
        for (let i = 0; i < useData.length; i++) {
          if (parseInt(useData[i].fields.ID) === parseInt(contactID)) {
            setContactDataToDetail(useData[i], contactType);
          }
        }
      }
    }).catch(function (err) {
      contactService.getOneSupplierDataEx(contactID).then(function (data) {
        setContactDataToDetail(data, contactType);
      });
    });
  } else if (contactType == 'Lead') {
    getVS1Data("TProspectEx").then(function (dataObject) {
      if (dataObject.length === 0) {
        contactService.getOneLeadDataEx(contactID).then(function (data) {
          setContactDataToDetail(data, contactType);
        });

      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tprospectvs1;
        for (let i = 0; i < useData.length; i++) {
          if (parseInt(useData[i].fields.ID) === parseInt(contactID)) {
            setContactDataToDetail(useData[i], contactType);
          }
        }
      }
    }).catch(function (err) {
      contactService.getOneLeadDataEx(contactID).then(function (data) {
        setContactDataToDetail(data, contactType);
      });
    });
  } else {
    $('#crmSelectLeadList').val('');
    $('#contactID').val('')
    $('#contactType').val('')
  }
  return;
}
function setContactDataToDetail(data, contactType) {
  $('#crmSelectLeadList').val(data.fields.ClientName);
  $('#contactID').val(data.fields.ID)
  $('#contactType').val(contactType)
}
