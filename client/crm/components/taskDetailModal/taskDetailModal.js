import { CRMService } from '../../crm-service';

import { Template } from 'meteor/templating';
import './taskDetailModal.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import moment from "moment";

let crmService = new CRMService();

Template.taskDetailModal.onCreated(function() {
    let templateObject = Template.instance();
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.getDataTableList = function (data) {
        var splashArrayLeadList = new Array();
        let lineItems = [];
        let lineItemObj = {};

        let td0, td1, tflag, td11, td2, td3, td4, td5, td6 = "",
            tcontact = "";
        let projectName = "";
        let labelsForExcel = "";
        let color_num = '100';

        let todayDate = moment().format("ddd");
        let tomorrowDay = moment().add(1, "day").format("ddd");
        let nextMonday = moment(moment()).day(1 + 7).format("ddd MMM D");

        let chk_complete, completed = "";
        let completed_style = "";

        // let linestatus = '';
        // if (data.Completed) {
        //     completed = "checked";
        //     chk_complete = "chk_uncomplete";
        //     // completed_style = "display:none;"
        // } else {
        //     completed = "";
        //     chk_complete = "chk_complete";
        // }

        // td0 = `<div class="custom-control custom-checkbox chkBox pointer no-modal "
        //     style="width:15px;margin-right: -6px;">
        //     <input class="custom-control-input chkBox chkComplete pointer ${chk_complete}" type="checkbox"
        //         id="formCheck-${data.ID}" ${completed}>
        //     <label class="custom-control-label chkBox pointer ${chk_complete}" data-id="${data.ID}"
        //         for="formCheck-${data.ID}"></label>
        //     </div>`;

        tflag = `<i class="fas fa-flag task_modal_priority_${data.priority}" data-id="${data.ID}" aria-haspopup="true" aria-expanded="false"></i>`;


        // if (data.due_date == "" || data.due_date == null) {
        //     td1 = "";
        //     td11 = "";
        // } else {
        //     td11 = moment(data.due_date).format("DD/MM/YYYY");
        //     td1 = `<label style="display:none;">${data.due_date}</label>` + td11;
        //
        //     let tdue_date = moment(data.due_date).format("YYYY-MM-DD");
        //     if (tdue_date <= moment().format("YYYY-MM-DD")) {
        //         color_num = 3; // Red
        //     } else if (tdue_date > moment().format("YYYY-MM-DD") && tdue_date <= moment().add(2, "day").format("YYYY-MM-DD")) {
        //         color_num = 2; // Orange
        //     } else if (tdue_date > moment().add(2, "day").format("YYYY-MM-DD") && tdue_date <= moment().add(7, "day").format("YYYY-MM-DD")) {
        //         color_num = 0; // Green
        //     }
        //
        //     td0 = `<div class="custom-control custom-checkbox chkBox pointer no-modal task_priority_${color_num}"
        //         style="width:15px;margin-right: -6px;${completed_style}">
        //         <input class="custom-control-input chkBox chkComplete pointer" type="checkbox"
        //             id="formCheck-${data.ID}" ${completed}>
        //         <label class="custom-control-label chkBox pointer ${chk_complete}" data-id="${data.ID}"
        //             for="formCheck-${data.ID}"></label>
        //         </div>`;
        // }


        projectName = data.ProjectName;
        if (data.ProjectName == "" || data.ProjectName == "Default") {
            projectName = "";
        }


        var dataList = [
            data.ID,
            tflag,
            data.ContactName,
            moment(data.due_date).format("DD/MM/YYYY"),
            data.TaskName,
            data.TaskDescription.length < 80 ? data.TaskDescription : data.TaskDescription.substring(0, 79) + "...",
            data.TaskName,
            projectName,
            data.Active ? "" : "In-Active",
            // data.ID,
            // color_num,
            // labelsForExcel,
            // data.Completed,
        ];

        return dataList;
    }
    let headerStructure = [
        { index: 0, label: 'ID', class: 'colID', active: false, display: true, width: "10" },
        { index: 1, label: '', class: 'colCompleteTask', active: true, display: true, width: "20" },
        { index: 2, label: 'Priority', class: 'colPriority no-modal', active: false, display: true, width: "100" },
        { index: 3, label: 'Date', class: 'colSubDate', active: true, display: true, width: "150" },
        { index: 4, label: 'Task', class: 'colSubTaskName', active: true, display: true, width: "100" },
        { index: 5, label: 'Description', class: 'colTaskDesc no-modal', active: true, display: true, width: "300" },
        { index: 6, label: 'Labels', class: 'colTaskLabels no-modal', active: false, display: true, width: "250" },
        { index: 7, label: 'Project', class: 'colTaskProjects no-modal', active: true, display: true, width: "100" },
        { index: 8, label: 'Status', class: 'colStatus no-modal', active: true, display: true, width: "120" },
    ]
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.taskDetailModal.onRendered(function() {
    let templateObject = Template.instance();
    $("#taskmodalDuedate").datepicker({
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

    $(".crmSelectLeadList").editableSelect();
    $(".crmSelectLeadList").editableSelect().on("click.editable-select", function(e, li) {
        $("#customerListCrmModal").modal();
    });
    $(".crmSelectEmployeeList").editableSelect();
    $(".crmSelectEmployeeList").editableSelect().on("click.editable-select", function(e, li) {
        $("#employeeListCRMModal").modal();
    });
    $(".taskDetailModalCategoryLabel").editableSelect();
    $(".taskDetailModalCategoryLabel").editableSelect().on("click.editable-select", function(e, li) {
        $("#projectListModal").modal();
    });

    templateObject.getInitTProjectList = function() {
        getVS1Data("TCRMProjectList").then(function(dataObject) {
            if (dataObject.length == 0) {
                templateObject.getTProjectList();
            } else {
                let data = JSON.parse(dataObject[0].data);
                if (data.tprojectlist && data.tprojectlist.length > 0) {
                    let tprojectlist = data.tprojectlist;

                    // var url = new URL(window.location.href);
                    // let employeeID = url.searchParams.get("id") ? url.searchParams.get("id") : '';

                    // if (employeeID) {
                    //     tprojectlist = tprojectlist.filter((proj) => proj.fields.Active == true && proj.fields.ID != 11 && proj.fields.EnteredBy == employeeID);
                    // } else {
                    tprojectlist = tprojectlist.filter((proj) => proj.fields.Active == true && proj.fields.ID != 11);
                    // }


                    let add_projectlist = `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="11" data-projectname="All Tasks"><i class="fas fa-inbox text-primary no-modal"
            style="margin-right: 8px;"></i>All Tasks</a>`;
                    let ProjectName = "";
                    tprojectlist.forEach((proj) => {
                        ProjectName = proj.fields.ProjectName.length > 26 ? proj.fields.ProjectName.substring(0, 26) + "..." : proj.fields.ProjectName;
                        add_projectlist += `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="${proj.fields.ID}" data-projectname="${proj.fields.ProjectName}"><i class="fas fa-circle no-modal" style="margin-right: 8px; color: ${proj.fields.ProjectColour};"></i>${ProjectName}</a>`;
                    });
                    $("#goProjectWrapper").html(add_projectlist);
                    $(".goProjectWrapper").html(add_projectlist);
                }
                else{

                }
            }
        }).catch(function(err) {
            templateObject.getTProjectList();
        });
    };

    templateObject.getTProjectList = function() {
        var url = FlowRouter.current().path;
        url = new URL(window.location.href);
        let employeeID = url.searchParams.get("id") ? url.searchParams.get("id") : '';

        crmService.getTProjectList(employeeID).then(function(data) {
            if (data.tprojectlist && data.tprojectlist.length > 0) {
                let tprojectlist = data.tprojectlist;
                tprojectlist = tprojectlist.filter((proj) => proj.fields.Active == true && proj.fields.ID != 11);

                let add_projectlist = `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="11" data-projectname="All Tasks"><i class="fas fa-inbox text-primary no-modal"
          style="margin-right: 8px;"></i>All Tasks</a>`;
                let ProjectName = "";
                tprojectlist.forEach((proj) => {
                    ProjectName = proj.fields.ProjectName.length > 26 ? proj.fields.ProjectName.substring(0, 26) + "..." : proj.fields.ProjectName;
                    add_projectlist += `<a class="dropdown-item setProjectIDAdd no-modal" data-projectid="${proj.fields.ID}" data-projectname="${proj.fields.ProjectName}"><i class="fas fa-circle no-modal" style="margin-right: 8px; color: ${proj.fields.ProjectColour};"></i>${ProjectName}</a>`;
                });
                $("#goProjectWrapper").html(add_projectlist);
                $(".goProjectWrapper").html(add_projectlist);
            }
            addVS1Data("TCRMProjectList", JSON.stringify(data));
        }).catch(function(err) {});
    };

    templateObject.getInitAllLabels = function() {
        getVS1Data("TCRMLabelList").then(function(dataObject) {
            if (dataObject.length == 0) {
                templateObject.getAllLabels();
            } else {
                let data = JSON.parse(dataObject[0].data);
                if (
                    data.tprojecttask_tasklabel &&
                    data.tprojecttask_tasklabel.length > 0
                ) {
                    let alllabels = data.tprojecttask_tasklabel;

                    let label_dropdowns = "";
                    let detail_label_dropdowns = "";
                    let labelName = "";
                    alllabels.forEach((lbl) => {
                        labelName =
                            lbl.fields.TaskLabelName.length < 20 ?
                            lbl.fields.TaskLabelName :
                            lbl.fields.TaskLabelName.substring(0, 19) + "...";

                        label_dropdowns += `<a class="dropdown-item add_label" data-id="${lbl.fields.ID}">
                            <i class="fas fa-tag" style="margin-right: 8px; color:${lbl.fields.Color};" data-id="${lbl.fields.ID}"></i>${labelName}
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
                            <i class="fas fa-tag" style="margin-right: 8px; color:${lbl.fields.Color};" data-id="${lbl.fields.ID}"></i>${labelName}
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
                }
            }
        }).catch(function(err) {
            templateObject.getAllLabels();
        });
    };

    templateObject.getAllLabels = function() {
        var url = FlowRouter.current().path;
        url = new URL(window.location.href);
        let employeeID = '';

        crmService.getAllLabels(employeeID).then(function(data) {
            if (
                data.tprojecttask_tasklabel &&
                data.tprojecttask_tasklabel.length > 0
            ) {
                let alllabels = data.tprojecttask_tasklabel;

                let label_dropdowns = "";
                let detail_label_dropdowns = "";
                let labelName = "";
                alllabels.forEach((lbl) => {
                    labelName =
                        lbl.fields.TaskLabelName.length < 20 ?
                        lbl.fields.TaskLabelName :
                        lbl.fields.TaskLabelName.substring(0, 19) + "...";

                    label_dropdowns += `<a class="dropdown-item add_label" data-id="${lbl.fields.ID}">
                        <i class="fas fa-tag" style="margin-right: 8px; color:${lbl.fields.Color};" data-id="${lbl.fields.ID}"></i>${labelName}
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
                        <i class="fas fa-tag" style="margin-right: 8px; color:${lbl.fields.Color};" data-id="${lbl.fields.ID}"></i>${labelName}
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
            }
            addVS1Data("TCRMLabelList", JSON.stringify(data));
        }).catch(function(err) {});
    };

    setTimeout(() => {
        // templateObject.getInitTProjectList();
        templateObject.getInitAllLabels();
    }, 500);
});

Template.taskDetailModal.events({
    // update task rename task
    "click .btnSaveEditTask": function(e) {
        playSaveAudio();
        let templateObject = Template.instance();
        setTimeout(function() {
            let taskID = $("#txtCrmTaskID").val();
            let selected_lbls = [];
            let unselected_lbls = [];
            $("#detailTaskLabelWrapper input:checked").each(function() {
                selected_lbls.push($(this).attr("name"));
            });
            // $("#detailTaskLabelWrapper input:unchecked").each(function() {
            //     unselected_lbls.push($(this).attr("name"));
            // });

            let editTaskDetailName = $(".editTaskDetailName").val();
            let editTaskDetailDescription = $(".editTaskDetailDescription").val();
            if (editTaskDetailName == "") {
                swal("Please endter the task name", "", "warning");
                return;
            }

            let assignId = $('#assignedID').val() || 0;
            let assignName = $('#crmEditSelectEmployeeList').val();
            let assignPhone = $('#contactPhoneUser').val();
            let assignEmail = $('#contactEmailUser').val();
            let contactID = $('#contactID').val() || 0;
            let contactName = $('#crmEditSelectLeadList').val();
            let contactPhone = $('#contactPhoneClient').val();
            let contactEmail = $('#contactEmailClient').val();

            let contactType = $('#contactType').val();
            let customerID = 0;
            let leadID = 0;
            let supplierID = 0;
            if (contactType == 'Customer') {
                customerID = contactID;
            } else if (contactType == 'Lead') {
                leadID = contactID;
            } else if (contactType == 'Supplier') {
                supplierID = contactID;
            }

            let projectID = $("#addProjectID").val() ? $("#addProjectID").val() : 11;
            projectID = $("#editProjectID").val() ? $("#editProjectID").val() : projectID;

            let projectName = $("#taskDetailModalCategoryLabel").val();
            let due_date = $("#taskmodalDuedate").val() ? new Date($("#taskmodalDuedate").datepicker("getDate")) : "";
            due_date = due_date != "" ? moment(due_date).format("YYYY-MM-DD") : "";

            let completed = $('#chkComplete_taskEdit').prop("checked");

            var objDetails = {
                type: "Tprojecttasks",
                fields: {
                    TaskName: editTaskDetailName,
                    TaskDescription: editTaskDetailDescription,
                    CustomerID: customerID,
                    LeadID: leadID,
                    SupplierID: supplierID,
                    AssignID: assignId,
                    AssignName: assignName,
                    AssignEmail: assignEmail,
                    AssignPhone: assignPhone,
                    ContactName: contactName,
                    ContactPhone: contactPhone,
                    ContactEmail: contactEmail,
                    ProjectID: projectID,
                    ProjectName: projectName,
                    Completed: completed,
                    due_date: due_date
                },
            };

            if (taskID) {
                objDetails.fields.ID = taskID;
                selected_lbls.forEach((lbl) => {
                    crmService
                        .updateLabel({
                            type: "Tprojecttask_TaskLabel",
                            fields: {
                                ID: lbl,
                                TaskID: taskID,
                            },
                        })
                        .then(function(data) {});
                });
            }

            $(".fullScreenSpin").css("display", "inline-block");

            crmService.saveNewTask(objDetails).then(function(data) {
                $(".btnRefresh").addClass('btnSearchAlert');
                crmService.getAllTaskList().then(async function(data) {
                    if (data.tprojecttasks && data.tprojecttasks.length > 0) {
                        await addVS1Data("TCRMTaskList", JSON.stringify(data));
                        $(".fullScreenSpin").css("display", "none");
                        if($("#btnRefreshList") != undefined){
                            $("#btnRefreshList").trigger("click");
                        }
                        // Meteor._reload.reload();
                    }
                }).catch(function(err) {
                    $(".fullScreenSpin").css("display", "none");
                });
                // setTimeout(() => {
                //     // templateObject.getAllTaskList();
                // }, 400);
            });
        }, delayTimeAfterSound);
    },

    "click .btnAddSubTask": function(event) {
        $("#newTaskModal").modal("toggle");
    },

    "click .delete-task": function(e) {
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
                    crmService.saveNewTask(objDetails).then(function(objDetails) {
                        // recalculate count here
                        $(".fullScreenSpin").css("display", "none");
                        crmService.getAllTaskList().then(async function(data) {
                            await addVS1Data("TCRMTaskList", JSON.stringify(data));
                            if($("#btnRefreshList") != undefined){
                                $("#btnRefreshList").trigger("click");
                            }
                        }).catch(function(err) {
                            $(".fullScreenSpin").css("display", "none");
                        });
                        $("#taskDetailModal").modal("hide");
                        // $("#newProjectTasksModal").modal("hide");
                    });
                } else if (result.dismiss === "cancel") {} else {}
            });
        }
    },
});

Template.taskDetailModal.helpers({
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: localStorage.getItem('mycloudLogonID'),
            PrefName: 'tblSubtaskDatatable'
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },

    apiFunction: function () {
        return crmService.getAllTasksList;
    },

    searchAPI: function () {
        return crmService.getAllTasksByName;
    },

    service: () => {
        return crmService;
    },

    datahandler: function () {
        let templateObject = Template.instance();
        return function (data) {
            let dataReturn = templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    exDataHandler: function () {
        let templateObject = Template.instance();
        return function (data) {
            let dataReturn = templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    apiParams: function () {
        return ['dateFrom', 'dateTo', 'ignoredate', 'deleteFilter'];
    },
});
