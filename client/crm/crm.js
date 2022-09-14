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

  ///////////////////////////////////////////////////
  $(".crmSelectLeadList").editableSelect();
  $(".crmSelectLeadList").editableSelect().on("click.editable-select", function (e, li) {
    $("#customerListModal").modal();
  });


  $(document).on("click", "#tblContactlist tbody tr", function (e) {
    var table = $(this);
    let colClientName = table.find(".colClientName").text();
    let colID = table.find(".colID").text();
    let colType = table.find(".colType").text();
    console.log(colClientName, colType, colID)

    if (colType == 'Lead' || colType == 'Customer' || colType == 'Supplier' || colType == 'Employee') {
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
                CreationDate = data.tprospect[i].fields.CreationDate ? data.tprospect[i].fields.CreationDate.substr(0, 10) : "";

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
    // swal({
    //   title: "Add Campaign",
    //   text: "Are you sure want to adda a new campaign?",
    //   type: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes",
    //   cancelButtonText: "No",
    // }).then((result) => {
    //   if (result.value) {
    //     $(".fullScreenSpin").css("display", "inline-block");
    //     try {
    //       var erpGet = erpDb();
    //       Meteor.call('createCampaign', erpGet, function (error, result) {
    //         console.log(error, result)
    //         if (error !== undefined) {
    //           swal("Something went wrong!", "", "error");
    //         } else {
    //           swal("New campaign is added successfully", "", "success");
    //         }
    //         $(".fullScreenSpin").css("display", "none");
    //       });
    //     } catch (error) {
    //       swal("Something went wrong!", "", "error");
    //       $(".fullScreenSpin").css("display", "none");
    //     }

    //   } else if (result.dismiss === "cancel") {
    //   } else {
    //   }
    // });

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
