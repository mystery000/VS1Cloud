// @ts-nocheck
import { ContactService } from "./contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../utility-service";
import { CountryService } from '../js/country-service';
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jQuery.print/jQuery.print.js';
import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
import { CRMService } from "../crm/crm-service";
import { Template } from 'meteor/templating';
import './addCustomer.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

const sideBarService = new SideBarService();
const utilityService = new UtilityService();
const crmService = new CRMService();
const contactService = new ContactService();
const countryService = new CountryService();


function MakeNegative() {
  $('td').each(function () {
    if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
  });
}


Template.customerscard.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar();
  templateObject.countryData = new ReactiveVar();
  templateObject.phoneCodeData = new ReactiveVar();
  templateObject.customerrecords = new ReactiveVar([]);
  templateObject.recentTrasactions = new ReactiveVar([]);
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.datatablerecordsjob = new ReactiveVar([]);
  templateObject.tableheaderrecordsjob = new ReactiveVar([]);
  templateObject.crmRecords = new ReactiveVar([]);
  templateObject.crmTableheaderRecords = new ReactiveVar([]);
  templateObject.preferredPaymentList = new ReactiveVar();
  templateObject.termsList = new ReactiveVar();
  templateObject.deliveryMethodList = new ReactiveVar();
  templateObject.clienttypeList = new ReactiveVar();
  templateObject.taxCodeList = new ReactiveVar();
  templateObject.taxraterecords = new ReactiveVar([]);
  templateObject.defaultsaletaxcode = new ReactiveVar();
  templateObject.defaultsaleterm = new ReactiveVar();
  templateObject.isJob = new ReactiveVar();
  templateObject.isJob.set(false);
  templateObject.isSameAddress = new ReactiveVar();
  templateObject.isSameAddress.set(false);
  templateObject.isJobSameAddress = new ReactiveVar();
  templateObject.isJobSameAddress.set(false);
  templateObject.all_projects = new ReactiveVar([]);
  templateObject.subTasks = new ReactiveVar([]);

  /* Attachments */
  templateObject.uploadedFile = new ReactiveVar();
  templateObject.uploadedFiles = new ReactiveVar([]);
  templateObject.attachmentCount = new ReactiveVar();
  templateObject.currentAttachLineID = new ReactiveVar();
  templateObject.uploadedFileJob = new ReactiveVar();
  templateObject.uploadedFilesJob = new ReactiveVar([]);
  templateObject.attachmentCountJob = new ReactiveVar();
  templateObject.uploadedFileJobNoPOP = new ReactiveVar();
  templateObject.uploadedFilesJobNoPOP = new ReactiveVar([]);
  templateObject.attachmentCountJobNoPOP = new ReactiveVar();
  templateObject.currentAttachLineIDJob = new ReactiveVar();
  templateObject.correspondences = new ReactiveVar([]);
  templateObject.active_projects = new ReactiveVar([]);
  templateObject.deleted_projects = new ReactiveVar([]);
  templateObject.favorite_projects = new ReactiveVar([]);
  templateObject.tprojectlist = new ReactiveVar([]);
  templateObject.taskrecords = new ReactiveVar([]);

  templateObject.checkedAppointments = new ReactiveVar(true);
  templateObject.checkedQuotes = new ReactiveVar();
  templateObject.checkedQuotes.set(false);
  templateObject.checkedSalesOrders = new ReactiveVar();
  templateObject.checkedSalesOrders.set(false);
  templateObject.checkedInvoices = new ReactiveVar();
  templateObject.checkedInvoices.set(true);
  templateObject.checkedSales = new ReactiveVar(false);

  templateObject.currentTab = new ReactiveVar("")
 let currentId = FlowRouter.current().queryParams;
  // Methods
  templateObject.updateTaskSchedule = function (id, date) {
    let due_date = "";
    let due_date_display = "No Date";
    if (date) {
      due_date = moment(date).format("YYYY-MM-DD hh:mm:ss");
      due_date_display = moment(due_date).format("dddd, Do MMMM");
    }
    $('#edit_task_modal_due_date').html(due_date_display)
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
        $(".fullScreenSpin").css("display", "none");
        $(".btnRefresh").addClass('btnSearchAlert');
      });
    }
  };

  templateObject.makeTaskTableRows = function (task_array) {
    let taskRows = new Array();
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
    task_array.forEach((item) => {
      if (item.fields.Completed) {
        completed = "checked";
        chk_complete = "chk_uncomplete";
      } else {
        completed = "";
        chk_complete = "chk_complete";
      }
      td0 = `
        <div class="custom-control custom-checkbox chkBox pointer no-modal "
          style="width:15px;margin-right: -6px;">
          <input class="custom-control-input chkBox chkComplete pointer ${chk_complete}" type="checkbox"
            id="formCheck-${item.fields.ID}" ${completed}>
          <label class="custom-control-label chkBox pointer ${chk_complete}" data-id="${item.fields.ID}"
            for="formCheck-${item.fields.ID}"></label>
        </div>`;

      tflag = `<i class="fas fa-flag task_modal_priority_${item.fields.priority}" data-id="${item.fields.ID}" aria-haspopup="true" aria-expanded="false"></i>`;

      // tempcode  need to add ContactName, AssignName fields to Tprojecttasks
      tcontact = item.fields.ContactName;

      if (item.fields.due_date == "" || item.fields.due_date == null) {
        td1 = "";
        td11 = "";
      } else {
        td11 = moment(item.fields.due_date).format("DD/MM/YYYY");
        td1 = `<label style="display:none;">${item.fields.due_date}</label>` + td11;

        let tdue_date = moment(item.fields.due_date).format("YYYY-MM-DD");
        if (tdue_date <= moment().format("YYYY-MM-DD")) {
          color_num = 3; // Red
        } else if (tdue_date > moment().format("YYYY-MM-DD") && tdue_date <= moment().add(2, "day").format("YYYY-MM-DD")) {
          color_num = 2; // Orange
        } else if (tdue_date > moment().add(2, "day").format("YYYY-MM-DD") && tdue_date <= moment().add(7, "day").format("YYYY-MM-DD")) {
          color_num = 0; // Green
        }

        td0 = `
        <div class="custom-control custom-checkbox chkBox pointer no-modal task_priority_${color_num}"
          style="width:15px;margin-right: -6px;${completed_style}">
          <input class="custom-control-input chkBox chkComplete pointer" type="checkbox"
            id="formCheck-${item.fields.ID}" ${completed}>
          <label class="custom-control-label chkBox pointer ${chk_complete}" data-id="${item.fields.ID}"
            for="formCheck-${item.fields.ID}"></label>
        </div>`;
      }

      td2 = item.fields.TaskName;
      td3 = item.fields.TaskDescription.length < 80 ? item.fields.TaskDescription : item.fields.TaskDescription.substring(0, 79) + "...";

      if (item.fields.TaskLabel) {
        if (item.fields.TaskLabel.fields) {
          td4 = `<span class="taskTag"><a class="taganchor filterByLabel" href="" data-id="${item.fields.TaskLabel.fields.ID}"><i class="fas fa-tag"
          style="margin-right: 5px; color:${item.fields.TaskLabel.fields.Color}" data-id="${item.fields.TaskLabel.fields.ID}"></i>${item.fields.TaskLabel.fields.TaskLabelName}</a></span>`;
          labelsForExcel = item.fields.TaskLabel.fields.TaskLabelName;
        } else {
          item.fields.TaskLabel.forEach((lbl) => {
            td4 += `<span class="taskTag"><a class="taganchor filterByLabel" href="" data-id="${lbl.fields.ID}"><i class="fas fa-tag"
            style="margin-right: 5px; color:${lbl.fields.Color}" data-id="${lbl.fields.ID}"></i>${lbl.fields.TaskLabelName}</a></span>`;
            labelsForExcel += lbl.fields.TaskLabelName + " ";
          });
        }
      } else {
        td4 = "";
      }

      projectName = item.fields.ProjectName;
      if (item.fields.ProjectName == "" || item.fields.ProjectName == "Default") {
        projectName = "";
      }

      let all_projects = templateObject.all_projects.get();
      let projectColor = 'transparent';
      if (item.fields.ProjectID != 0) {
        let projects = all_projects.filter(project => project.fields.ID == item.fields.ProjectID);
        if (projects.length && projects[0].fields.ProjectColour) {
          projectColor = projects[0].fields.ProjectColour;
        }
      }

      td5 = `
      <div style="display:flex; justify-content:center;">
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
              <i class="fas fa-couch text-primary no-modal" style="margin-right: 8px;"></i>templateObject Weekend
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
              title="Date format: DD/MM/YYYY" style="display:flex; margin: 6px 20px; margin-top: 0px; z-index: 99999;">
              <label style="margin-top: 6px; margin-right: 16px; width: 146px;">Select Date</label>
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
                  <i class="fas fa-flag no-modal taskDropSecondFlag task_modal_priority_0" data-toggle="tooltip"
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
        </div>
      </div>`;

      td6 = ``;
      if (item.fields.Active) {
        td6 = "";
      } else {
        td6 = "In-Active";
      }
      taskRows.push([
        tflag,
        tcontact,
        td1,
        td2,
        td3,
        td4,
        projectName,
        td6,
        item.fields.ID,
        color_num,
        labelsForExcel,
        item.fields.Completed,
        projectColor
      ]);
    });
    return taskRows;
  };

  templateObject.initSubtaskDatatable = function () {
    let splashArrayTaskList = templateObject.makeTaskTableRows(templateObject.subTasks.get());
    try {
      $("#tblSubtaskDatatable").DataTable({
        data: splashArrayTaskList,
        columnDefs: [
          {
            orderable: false,
            targets: 0,
            className: "colPriority openEditSubTaskModal hiddenColumn",
            createdCell: function (td, cellData, rowData, row, col) {
              $(td).closest("tr").attr("data-id", rowData[8]);
              $(td).attr("data-id", rowData[8]);
            },
            width: "100px",
          },
          {
            orderable: false,
            targets: 1,
            className: "colContact openEditSubTaskModal hiddenColumn",
            createdCell: function (td, cellData, rowData, row, col) {
              $(td).attr("data-id", rowData[8]);
            },
            width: "100px",
          },
          {
            targets: 2,
            className: "colSubDate openEditSubTaskModal",
            createdCell: function (td, cellData, rowData, row, col) {
              $(td).attr("data-id", rowData[8]);
            },
            width: "120px",
          },
          {
            targets: 3,
            className: "colSubTaskName openEditSubTaskModal",
            createdCell: function (td, cellData, rowData, row, col) {
              $(td).attr("data-id", rowData[9]);
            },
          },
          {
            targets: 4,
            className: "colTaskDesc openEditSubTaskModal hiddenColumn",
            createdCell: function (td, cellData, rowData, row, col) {
              $(td).attr("data-id", rowData[8]);
            },
          },
          {
            targets: 5,
            className: "colTaskLabels openEditSubTaskModal hiddenColumn",
            createdCell: function (td, cellData, rowData, row, col) {
              $(td).attr("data-id", rowData[8]);
            },
          },
          {
            targets: 6,
            className: "colTaskProjects openEditSubTaskModal hiddenColumn",
            createdCell: function (td, cellData, rowData, row, col) {
              $(td).attr("data-id", rowData[8]);
            },
          },
          {
            orderable: false,
            targets: 7,
            className: "colStatus openEditSubTaskModal",
            createdCell: function (td, cellData, rowData, row, col) {
              $(td).attr("data-id", rowData[8]);
            },
          },
        ],
        colReorder: {
          fixedColumnsLeft: 0,
        },
        sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        select: true,
        destroy: true,
        pageLength: initialDatatableLoad,
        lengthMenu: [
          [initialDatatableLoad, -1],
          [initialDatatableLoad, "All"],
        ],
        info: true,
        responsive: true,
        order: [
          [1, "desc"],
        ],
        action: function () {
          $("#tblSubtaskDatatable").DataTable().ajax.reload();
        },
      });

    } catch (error) { }
  }

  templateObject.getReferenceLetters = () => {
    getVS1Data('TCorrespondence').then(data => {
      if (data.length == 0) {
        sideBarService.getCorrespondences().then(dataObject => {
          addVS1Data('TCorrespondence', JSON.stringify(dataObject))
          let tempArray = [];
          if (dataObject.tcorrespondence.length > 0) {
            let temp = dataObject.tcorrespondence.filter(item => {
              return item.fields.EmployeeId == localStorage.getItem('mySessionEmployeeLoggedID')
            })
            for (let i = 0; i < temp.length; i++) {
              for (let j = i + 1; j < temp.length; j++) {
                if (temp[i].fields.Ref_Type == temp[j].fields.Ref_Type) {
                  temp[j].fields.dup = true
                }
              }
            }
            temp.map(item => {
              if (item.fields.EmployeeId == localStorage.getItem('mySessionEmployeeLoggedID') && item.fields.dup != true) {
                tempArray.push(item.fields)
              }
            })
          }
          templateObject.correspondences.set(tempArray)
        })
      } else {
        let dataObj = JSON.parse(data[0].data);
        let tempArray = [];
        if (dataObj.tcorrespondence.length > 0) {
          let temp = dataObj.tcorrespondence.filter(item => {
            return item.fields.EmployeeId == localStorage.getItem('mySessionEmployeeLoggedID')
          })

          for (let i = 0; i < temp.length; i++) {
            for (let j = i + 1; j < temp.length; j++) {
              if (temp[i].fields.Ref_Type == temp[j].fields.Ref_Type) {
                temp[j].fields.dup = true
              }
            }
          }
          temp.map(item => {
            if (item.fields.EmployeeId == localStorage.getItem('mySessionEmployeeLoggedID') && item.fields.dup != true) {
              tempArray.push(item.fields)
            }
          })
        }
        templateObject.correspondences.set(tempArray)
      }
    }).catch(function () {
      sideBarService.getCorrespondences().then(dataObject => {
        addVS1Data('TCorrespondence', JSON.stringify(dataObject));
        let tempArray = [];
        if (dataObject.tcorrespondence.length > 0) {
          let temp = dataObject.tcorrespondence.filter(item => {
            return item.fields.EmployeeId == localStorage.getItem('mySessionEmployeeLoggedID')
          })

          for (let i = 0; i < temp.length; i++) {
            for (let j = i + 1; j < temp.length; j++) {
              if (temp[i].fields.Ref_Type == temp[j].fields.Ref_Type) {
                temp[j].fields.dup = true
              }
            }
          }
          temp.map(item => {
            if (item.fields.EmployeeId == localStorage.getItem('mySessionEmployeeLoggedID') && item.fields.dup != true) {
              tempArray.push(item.fields)
            }
          })
        }
        templateObject.correspondences.set(tempArray)
      })
    })
  }

  templateObject.getAllJobsIds = function () {
    getVS1Data("TJobVS1")
    .then(res => {
      const jobData = JSON.parse(res[0].data)
      let latestJobId;
      if (jobData.tjobvs1.length) {
        latestJobId = jobData.tjobvs1[jobData.tjobvs1.length - 1].Id;
      } else {
        latestJobId = 0;
      }
      let newJobId = (latestJobId + 1);
      $('#addNewJobModal #edtJobNumber').val(newJobId);
    })
    .catch(() => {
      contactService.getJobIds().then(function (data) {
        let latestJobId;
        if (data.tjobvs1.length) {
          latestJobId = data.tjobvs1[data.tjobvs1.length - 1].Id;
        } else {
          latestJobId = 0;
        }
        let newJobId = (latestJobId + 1);
        $('#addNewJobModal #edtJobNumber').val(newJobId);
      }).catch(function (err) {
        $('#addNewJobModal #edtJobNumber').val('1');
      });
    })
  };

  templateObject.getAllTask = function (customerName = "") {
    getVS1Data("TCRMTaskList").then(async function (dataObject) {
      if (dataObject.length == 0) {
        crmService.getAllTasksByContactName(customerName).then(async function (data) {
          if (data.tprojecttasks.length > 0) {
            addVS1Data("TCRMTaskList", JSON.stringify(data));
            templateObject.taskrecords.set(data.tprojecttasks);
          }
        }).catch(function (err) {
        })
      } else {
        let data = JSON.parse(dataObject[0].data);
        let all_records = data.tprojecttasks;
        templateObject.taskrecords.set(all_records);
      }
    }).catch(function (err) {
      crmService.getAllTasksByContactName(customerName).then(async function (data) {
        if (data.tprojecttasks.length > 0) {
          addVS1Data("TCRMTaskList", JSON.stringify(data));
          templateObject.taskrecords.set(data.tprojecttasks);
        }
      }).catch(function (err) {
      })
    });
  };

  templateObject.getCountryData = function () {
    let countries = [];
    getVS1Data('TCountries').then(function (dataObject) {
      if (dataObject.length == 0) {
        sideBarService.getCountry().then((data) => {
          for (let i = 0; i < data.tcountries.length; i++) {
            countries.push(data.tcountries[i].Country)
          }
          countries.sort((a, b) => a.localeCompare(b));
          templateObject.countryData.set(countries);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tcountries;
        for (let i = 0; i < useData.length; i++) {
          countries.push(useData[i].Country)
        }
        countries.sort((a, b) => a.localeCompare(b));
        templateObject.countryData.set(countries);
      }
    }).catch(function (err) {
      sideBarService.getCountry().then((data) => {
        for (let i = 0; i < data.tcountries.length; i++) {
          countries.push(data.tcountries[i].Country)
        }
        countries.sort((a, b) => a.localeCompare(b));
        templateObject.countryData.set(countries);
      });
    });
    let dataPhone = countryService.getCountryJeyhun();
    templateObject.phoneCodeData.set(dataPhone);
  };

  function setPreferredPaymentList(data) {
    let preferredPayments = [];
    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
      preferredPayments.push(data.tpaymentmethodvs1[i].fields.PaymentMethodName)
    }
    templateObject.preferredPaymentList.set(preferredPayments);
  }

  templateObject.getPreferredPaymentList = function () {
    getVS1Data('TPaymentMethod').then(function (dataObject) {
      if (dataObject.length == 0) {
        contactService.getPaymentMethodDataVS1().then((data) => {
          setPreferredPaymentList(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setPreferredPaymentList(data);
      }
    }).catch(function (err) {
      contactService.getPaymentMethodDataVS1().then((data) => {
        setPreferredPaymentList(data);
      });
    });
  };

  function setTermsDataVS1(data) {
    let terms = [];
    for (let i = 0; i < data.ttermsvs1.length; i++) {
      terms.push(data.ttermsvs1[i].TermsName);
      if (data.ttermsvs1[i].isSalesdefault == true) {
        templateObject.defaultsaleterm.set(data.ttermsvs1[i].TermsName);
        if (JSON.stringify(currentId) != '{}') {
          if (currentId.id == "undefined") {
            $('#sltTerms').val(data.ttermsvs1[i].TermsName);
          }
        } else {
          $('#sltTerms').val(data.ttermsvs1[i].TermsName);
        }
        localStorage.setItem('ERPTermsSales', data.ttermsvs1[i].TermsName || "COD");
      }
    }
    templateObject.termsList.set(terms);
  }

  templateObject.getTermsList = function () {
    getVS1Data('TTermsVS1').then(function (dataObject) {
      if (dataObject.length == 0) {
        contactService.getTermDataVS1().then((data) => {
          setTermsDataVS1(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setTermsDataVS1(data);
      }
    }).catch(function (err) {
      contactService.getTermDataVS1().then((data) => {
        setTermsDataVS1(data);
      });
    });
  };

  function setShippingMethodData(data) {
    let deliveryMethods = [];
    for (let i = 0; i < data.tshippingmethod.length; i++) {
      deliveryMethods.push(data.tshippingmethod[i].ShippingMethod)
    }
    templateObject.deliveryMethodList.set(deliveryMethods);
  }

  templateObject.getDeliveryMethodList = function () {
    getVS1Data('TShippingMethod').then(function (dataObject) {
      if (dataObject.length == 0) {
        contactService.getShippingMethodData().then((data) => {
          setShippingMethodData(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setShippingMethodData(data);
      }
    }).catch(function (err) {
      contactService.getShippingMethodData().then((data) => {
        setShippingMethodData(data);
      });
    });
  };

  function setClientTypeList(data) {
    let clientType = [];
    for (let i = 0; i < data.tclienttype.length; i++) {
      clientType.push(data.tclienttype[i].fields.TypeName)
    }
    templateObject.clienttypeList.set(clientType);
  }

  templateObject.getClientTypeData = function () {
    getVS1Data('TClientType').then(function (dataObject) {
      if (dataObject.length == 0) {
        sideBarService.getClientTypeData().then((data) => {
          setClientTypeList(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setClientTypeList(data);
        $(".customerTypeSelect").attr('selectedIndex', 0);
      }
    }).catch(function (err) {
      sideBarService.getClientTypeData().then((data) => {
        setClientTypeList(data);
      });
    });

  };

  function setTaxCodesList(data) {
    const splashArrayTaxRateList = [];
    const taxCodesList = [];
    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
      let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
      const dataList = [
        data.ttaxcodevs1[i].Id || '',
        data.ttaxcodevs1[i].CodeName || '',
        data.ttaxcodevs1[i].Description || '-',
        taxRate || 0,
      ];
      let taxcoderecordObj = {
        codename: data.ttaxcodevs1[i].CodeName || ' ',
        coderate: taxRate || ' ',
      };
      taxCodesList.push(taxcoderecordObj);
      splashArrayTaxRateList.push(dataList);
    }
    templateObject.taxCodeList.set(taxCodesList);
    if (splashArrayTaxRateList) {
      $('#tblTaxRate').DataTable({
        data: splashArrayTaxRateList,
        sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        columnDefs: [{
          orderable: false,
          targets: 0
        }, {
          className: "taxName",
          "targets": [1]
        }, {
          className: "taxDesc",
          "targets": [2]
        }, {
          className: "taxRate text-right",
          "targets": [3]
        }],
        select: true,
        destroy: true,
        colReorder: true,
        pageLength: initialDatatableLoad,
        lengthMenu: [
          [initialDatatableLoad, -1],
          [initialDatatableLoad, "All"]
        ],
        info: true,
        responsive: true,
        "fnDrawCallback": function (oSettings) {
          // $('.dataTables_paginate').css('display', 'none');
        },
        "fnInitComplete": function () {
          $("<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblTaxRate_filter");
          $("<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_filter");
        }
      });
    }
  }

  templateObject.getTaxCodesList = function () {
    getVS1Data('TTaxcodeVS1').then(function (dataObject) {
      if (dataObject.length == 0) {
        contactService.getTaxCodesVS1().then(function (data) {
          setTaxCodesList(data);
        })
      } else {
        let data = JSON.parse(dataObject[0].data);
        setTaxCodesList(data);
      }
    }).catch(function (err) {
      contactService.getTaxCodesVS1().then(function (data) {
        setTaxCodesList(data);
      })
    });
  };

  function setOneCustomerDataEx(data) {
    let lineItemObj = {
      id: data.fields.ID || '',
      lid: 'Edit Customer',
      isjob: data.fields.IsJob || '',
      issupplier: data.fields.IsSupplier || false,
      iscustomer: data.fields.IsCustomer || false,
      company: data.fields.ClientName || '',
      email: data.fields.Email || '',
      title: data.fields.Title || '',
      firstname: data.fields.FirstName || '',
      middlename: data.fields.CUSTFLD10 || '',
      lastname: data.fields.LastName || '',
      tfn: '' || '',
      phone: data.fields.Phone || '',
      mobile: data.fields.Mobile || '',
      fax: data.fields.Faxnumber || '',
      skype: data.fields.SkypeName || '',
      website: data.fields.URL || '',
      shippingaddress: data.fields.Street || '',
      scity: data.fields.Street2 || '',
      ssuburb: data.fields.Suburb || '',
      sstate: data.fields.State || '',
      spostalcode: data.fields.Postcode || '',
      scountry: data.fields.Country || LoggedCountry,
      billingaddress: data.fields.BillStreet || '',
      bcity: data.fields.BillStreet2 || '',
      bsuburb: data.fields.Billsuburb || '',
      bstate: data.fields.BillState || '',
      bpostalcode: data.fields.BillPostcode || '',
      bcountry: data.fields.Billcountry || '',
      notes: data.fields.Notes || '',
      preferedpayment: data.fields.PaymentMethodName || '',
      terms: data.fields.TermsName || localStorage.getItem('ERPTermsSales'),
      deliverymethod: data.fields.ShippingMethodName || '',
      clienttype: data.fields.ClientTypeName || '',
      openingbalance: data.fields.RewardPointsOpeningBalance || 0.00,
      openingbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
      taxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
      custfield1: data.fields.CUSTFLD1 || '',
      custfield2: data.fields.CUSTFLD2 || '',
      custfield3: data.fields.CUSTFLD3 || '',
      custfield4: data.fields.CUSTFLD4 || '',
      status: data.fields.Status || '',
      rep: data.fields.RepName || '',
      source: data.fields.SourceName || '',
      salesQuota: data.fields.CUSTFLD12 || '',
      jobcompany: data.fields.ClientName || '',
      jobCompanyParent: data.fields.ClientName || '',
      jobemail: data.fields.Email || '',
      jobtitle: data.fields.Title || '',
      jobfirstname: data.fields.FirstName || '',
      jobmiddlename: data.fields.CUSTFLD10 || '',
      joblastname: data.fields.LastName || '',
      jobtfn: '' || '',
      jobphone: data.fields.Phone || '',
      jobmobile: data.fields.Mobile || '',
      jobfax: data.fields.Faxnumber || '',
      jobskype: data.fields.SkypeName || '',
      jobwebsite: data.fields.CUSTFLD9 || '',
      jobshippingaddress: data.fields.Street || '',
      jobscity: data.fields.Street2 || '',
      jobsstate: data.fields.State || '',
      jobspostalcode: data.fields.Postcode || '',
      jobscountry: data.fields.Country || LoggedCountry,
      jobbillingaddress: data.fields.BillStreet || '',
      jobbcity: data.fields.BillStreet2 || '',
      jobbstate: data.fields.BillState || '',
      jobbpostalcode: data.fields.BillPostcode || '',
      jobbcountry: data.fields.Billcountry || '',
      jobnotes: data.fields.Notes || '',
      jobpreferedpayment: data.fields.PaymentMethodName || '',
      jobterms: data.fields.TermsName || '',
      jobdeliverymethod: data.fields.ShippingMethodName || '',
      jobopeningbalance: data.fields.RewardPointsOpeningBalance || 0.00,
      jobopeningbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
      jobtaxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
      jobcustFld1: '' || '',
      jobcustFld2: '' || '',
      job_Title: '',
      jobName: '',
      jobNumber: '',
      jobRegistration: '',
      discount: data.fields.Discount || 0,
      jobclienttype: data.fields.ClientTypeName || '',
      ForeignExchangeCode: data.fields.ForeignExchangeCode || CountryAbbr,

    };
    templateObject.records.set(lineItemObj);
    $('#sltCurrency').val(data.fields.ForeignExchangeCode || CountryAbbr);

    if ((data.fields.Street == data.fields.BillStreet) && (data.fields.Street2 == data.fields.BillStreet2) &&
      (data.fields.State == data.fields.BillState) && (data.fields.Postcode == data.fields.Postcode) &&
      (data.fields.Country == data.fields.Billcountry)) {
      templateObject.isSameAddress.set(true);
      templateObject.isJobSameAddress.set(true);
    }

    /* START attachment */
    templateObject.attachmentCount.set(0);
    if (data.fields.Attachments) {
      if (data.fields.Attachments.length) {
        templateObject.attachmentCount.set(data.fields.Attachments.length);
        templateObject.uploadedFiles.set(data.fields.Attachments);
      }
    }
    /* END  attachment */
    templateObject.isJob.set(data.fields.IsJob);
    templateObject.getAllTask(data.fields.ClientName);
    $('#edtCustomerCompany').attr('readonly', true);
    $('#sltPreferredPayment').val(lineItemObj.preferedpayment);
    $('#sltTerms').val(lineItemObj.terms);
    $("#sltCurrency").val(lineItemObj.ForeignExchangeCode);
    $('#sltCustomerType').val(lineItemObj.clienttype);
    $('#sltTaxCode').val(lineItemObj.taxcode);
    $('#sltJobPreferredPayment').val(lineItemObj.jobpreferedpayment);
    $('#sltJobTerms').val(lineItemObj.jobterms);
    $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
    $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
    const rowCount = $('.results tbody tr').length;
    $('.counter').text(rowCount + ' items');
    setTab();
  }

  function setTab() {
    let currentId = FlowRouter.current().queryParams;
    if (FlowRouter.current().route.name != "customerscard") {
      currentId = "";
    }
    if (currentId.transTab == 'active') {
      $('.customerTab').removeClass('active');
      $('.transactionTab').trigger('click');
    } else if (currentId.transTab == 'crm') {
      $('.customerTab').removeClass('active');
      $('.crmTab').trigger('click');
    } else if (currentId.transTab == 'job') {
      $('.customerTab').removeClass('active');
      $('.jobTab').trigger('click');
    } else {
      $('.customerTab').addClass('active');
      $('.customerTab').trigger('click');
    }
  }

  templateObject.getEmployeeData = async (customerID) => {
    getVS1Data('TCustomerVS1').then(function (dataObject) {
      if (dataObject.length == 0) {
        contactService.getOneCustomerDataEx(customerID).then(function (data) {
          setOneCustomerDataEx(data);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        const customerData = data.tcustomervs1.find((udata) => udata.fields.ID == parseInt(customerID));
        if(customerData){
          setOneCustomerDataEx(customerData);
        } else {
          contactService.getOneCustomerDataEx(customerID).then(function (_data) {
            data.tcustomervs1.push(_data);
            addVS1Data('TCustomerVS1', JSON.stringify(data))
            setOneCustomerDataEx(_data);
          });
        }
      }
    }).catch(function (err) {
      contactService.getOneCustomerDataEx(customerID).then(function (data) {
        $('.fullScreenSpin').css('display', 'none');
        setOneCustomerDataEx(data);
      });
    });
  };

  templateObject.setInitialForEmptyCurrentID = async () => {
    let lineItemObj = {
      id: '',
      lid: 'Add Customer',
      company: '',
      email: '',
      title: '',
      firstname: '',
      middlename: '',
      lastname: '',
      tfn: '',
      phone: '',
      mobile: '',
      fax: '',
      skype: '',
      website: '',
      shippingaddress: '',
      scity: '',
      ssuburb: '',
      sstate: '',
      terms: loggedTermsSales || '',
      spostalcode: '',
      scountry: LoggedCountry || '',
      billingaddress: '',
      bcity: '',
      bsuburb: '',
      bstate: '',
      bpostalcode: '',
      bcountry: LoggedCountry || '',
      custfield1: '',
      custfield2: '',
      custfield3: '',
      custfield4: '',
      status: '',
      rep: '',
      source: '',
      salesQuota: 5000,
      jobbcountry: LoggedCountry || '',
      jobscountry: LoggedCountry || '',
      discount: 0
    };
    templateObject.records.set(lineItemObj);
    // templateObject.getTermsList();
    $('#edtCustomerCompany').attr('readonly', false);
    $('#sltPreferredPayment').val(lineItemObj.preferedpayment);
    $('#sltTerms').val(lineItemObj.terms);
    $("#sltCurrency").val(lineItemObj.ForeignExchangeCode);
    $('#sltCustomerType').val(lineItemObj.clienttype);
    $('#sltTaxCode').val(lineItemObj.taxcode);
    $('#sltJobPreferredPayment').val(lineItemObj.jobpreferedpayment);
    $('#sltJobTerms').val(lineItemObj.terms);
    $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
    $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
    $('.customerTypeSelect').append('<option value="newCust">Add Customer Type</option>');
    templateObject.isSameAddress.set(true);
    setTab();
    $('.fullScreenSpin').css('display', 'none');
  }

  templateObject.getEmployeeDataByName = function (customerID) {
    getVS1Data('TCustomerVS1').then(function (dataObject) {
      if (dataObject.length == 0) {
        contactService.getOneCustomerDataExByName(customerID).then(function (data) {
          setOneCustomerDataEx(data.tcustomer[0]);
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tcustomervs1;
        let added = false;
        for (let i = 0; i < useData.length; i++) {
          if (parseInt(useData[i].fields.ClientName) == parseInt(customerID)) {
            added = true;
            setOneCustomerDataEx(useData[i]);
            const rowCount = $('.results tbody tr').length;
            $('.counter').text(rowCount + ' items');
          }
        }
        if (!added) {
          contactService.getOneCustomerDataExByName(customerID).then(function (data) {
            setOneCustomerDataEx(data.tcustomer[0]);
          });
        }
      }
    }).catch(function (err) {
      contactService.getOneCustomerDataExByName(customerID).then(function (data) {
        $('.fullScreenSpin').css('display', 'none');
        setOneCustomerDataEx(data.tcustomer[0]);
      });
    });
  };

  templateObject.getCustomersList = function () {
    getVS1Data('TCustomerVS1').then(function (dataObject) {
      if (dataObject.length == 0) {
        contactService.getAllCustomerSideDataVS1().then(function (data) {
          templateObject.setAllCustomerSideDataVS1(data);
        }).catch(function (err) {
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.setAllCustomerSideDataVS1(data);
      }
    }).catch(function (err) {
      contactService.getAllCustomerSideDataVS1().then(function (data) {
        templateObject.setAllCustomerSideDataVS1(data);
      }).catch(function (err) {
      });
    });
  };

  templateObject.setAllCustomerSideDataVS1 = function (data) {
    const _lineItems = [];
    let currentId = FlowRouter.current().queryParams;
    for (let i = 0; i < data.tcustomervs1.length; i++) {
      let classname = '';
      if (!isNaN(currentId.id)) {
        if (data.tcustomervs1[i].fields.ID == parseInt(currentId.id)) {
          classname = 'currentSelect';
        }
      }
      if (!isNaN(currentId.jobid)) {
        if (data.tcustomervs1[i].fields.ID == parseInt(currentId.jobid)) {
          classname = 'currentSelect';
        }
      }
      const dataList = {
        id: data.tcustomervs1[i].fields.ID || '',
        company: data.tcustomervs1[i].fields.ClientName || '',
        isslectJob: data.tcustomervs1[i].fields.IsJob || false,
        classname: classname
      };
      _lineItems.push(dataList);
    }
    templateObject.customerrecords.set(_lineItems);
    // if (templateObject.customerrecords.get()) {
    //   setTimeout(function() {
    //     $('.counter').text(_lineItems.length + ' items');
    //   }, 100);
    // }
  }

});

Template.customerscard.onRendered(function () {
  $('.fullScreenSpin').css('display', 'inline-block');
  let templateObject = Template.instance();

  let currentId = FlowRouter.current().queryParams;
  if (FlowRouter.current().route.name != "customerscard") {
    currentId = "";
  }
  let customerID = '';
  let salestaxcode = '';
  Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), 'defaulttax', function (error, result) {
    if (error) {
      salestaxcode = loggedTaxCodeSalesInc;
      templateObject.defaultsaletaxcode.set(salestaxcode);
    } else {
      if (result) {
        salestaxcode = result.customFields[1].taxvalue || loggedTaxCodeSalesInc;
        templateObject.defaultsaletaxcode.set(salestaxcode);
      }
    }
  });

  $("#dtAsOf").datepicker({
    showOn: 'button',
    buttonText: 'Show Date',
    buttonImageOnly: true,
    buttonImage: '/img/imgCal2.png',
    dateFormat: 'dd/mm/yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });

  templateObject.getCountryData();
  templateObject.getPreferredPaymentList();
  templateObject.getTermsList();
  templateObject.getDeliveryMethodList();
  templateObject.getTaxCodesList();
  templateObject.getCustomersList();

  if (JSON.stringify(currentId) != '{}') {
    if (currentId.id == "undefined") {
      templateObject.setInitialForEmptyCurrentID();
    } else {
      if (!isNaN(currentId.id)) {
        customerID = currentId.id;
        templateObject.getEmployeeData(customerID);
        templateObject.getReferenceLetters();
      } else if ((currentId.name)) {
        customerID = currentId.name.replace(/%20/g, " ");
        templateObject.getEmployeeDataByName(customerID);
      } else if (!isNaN(currentId.jobid)) {
        customerID = currentId.jobid;
        templateObject.getEmployeeData(customerID);
      } else {
        templateObject.setInitialForEmptyCurrentID();
      }
    }
  } else {
    templateObject.setInitialForEmptyCurrentID();
  }

  $(document).ready(function () {
    setTimeout(function () {
    function setTermsVS1(data, termsDataName) {
      for (let i in data.ttermsvs1) {
        if (data.ttermsvs1.hasOwnProperty(i)) {
          if (data.ttermsvs1[i].TermsName == termsDataName) {
            $('#edtTermsID').val(data.ttermsvs1[i].Id);
            $('#edtDays').val(data.ttermsvs1[i].Days);
            $('#edtName').val(data.ttermsvs1[i].TermsName);
            $('#edtDesc').val(data.ttermsvs1[i].Description);
            if (data.ttermsvs1[i].IsEOM == true) {
              $('#isEOM').prop('checked', true);
            } else {
              $('#isEOM').prop('checked', false);
            }
            if (data.ttermsvs1[i].IsEOMPlus == true) {
              $('#isEOMPlus').prop('checked', true);
            } else {
              $('#isEOMPlus').prop('checked', false);
            }
            if (data.ttermsvs1[i].isSalesdefault == true) {
              localStorage.setItem('ERPTermsSales', data.ttermsvs1[i].TermsName || "COD");
              $('#chkCustomerDef').prop('checked', true);
            } else {
              $('#chkCustomerDef').prop('checked', false);
            }
            if (data.ttermsvs1[i].isPurchasedefault == true) {
              localStorage.setItem('ERPTermsPurchase', data.ttermsvs1[i].TermsName || "COD");
              $('#chkSupplierDef').prop('checked', true);
            } else {
              $('#chkSupplierDef').prop('checked', false);
            }
          }
        }
      }
      $('.fullScreenSpin').css('display', 'none');
      $('#newTermsModal').modal('toggle');
    }

    function editableTerms(e, $each, offset, termsDataName) {
      $('#edtTermsID').val('');
      if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
        $('#termsListModal').modal('toggle');
      } else {
        if (termsDataName.replace(/\s/g, '') !== '') {
          $('#termModalHeader').text('Edit Terms');
          getVS1Data('TTermsVS1').then(function (dataObject) { //edit to test indexdb
            if (dataObject.length == 0) {
              $('.fullScreenSpin').css('display', 'inline-block');
              sideBarService.getTermsVS1().then(function (data) {
                setTermsVS1(data, termsDataName);
              });
            } else {
              let data = JSON.parse(dataObject[0].data);
              setTermsVS1(data, termsDataName);
            }
          }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'inline-block');
            sideBarService.getTermsVS1().then(function (data) {
              setTermsVS1(data, termsDataName);
            });
          });
        } else {
          $('#termsListModal').modal();
          $('#termsList_filter .form-control-sm').focus();
          $('#termsList_filter .form-control-sm').val('');
          $('#termsList_filter .form-control-sm').trigger("input");
          // const datatable = $('#termsList').DataTable();
          // datatable.draw();
        }
      }
    }

    function setPaymentMethodDataVS1(data, paymentDataName) {
      for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
        if (data.tpaymentmethodvs1[i].fields.PaymentMethodName == paymentDataName) {
          $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
          $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
          if (data.tpaymentmethodvs1[i].fields.IsCreditCard == true) {
            $('#isformcreditcard').prop('checked', true);
          } else {
            $('#isformcreditcard').prop('checked', false);
          }
        }
      }
      $('.fullScreenSpin').css('display', 'none');
      $('#newPaymentMethodModal').modal('toggle');
    }

    function editablePreferredPayment(e, $each, offset, paymentDataName) {
      $('#edtPaymentMethodID').val('');
      if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
        $('#paymentMethodModal').modal('toggle');
      } else {
        if (paymentDataName.replace(/\s/g, '') !== '') {
          $('#paymentMethodHeader').text('Edit Payment Method');
          getVS1Data('TPaymentMethod').then(function (dataObject) {
            if (dataObject.length == 0) {
              $('.fullScreenSpin').css('display', 'inline-block');
              sideBarService.getPaymentMethodDataVS1().then(function (data) {
                setPaymentMethodDataVS1(data, paymentDataName);
              });
            } else {
              let data = JSON.parse(dataObject[0].data);
              setPaymentMethodDataVS1(data, paymentDataName);
            }
          }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'inline-block');
            sideBarService.getPaymentMethodDataVS1().then(function (data) {
              setPaymentMethodDataVS1(data, paymentDataName);
            });
          });
        } else {
          $('#paymentMethodModal').modal();
          $('#paymentmethodList_filter .form-control-sm').focus();
          $('#paymentmethodList_filter .form-control-sm').val('');
          $('#paymentmethodList_filter .form-control-sm').trigger("input");
          // var datatable = $('#paymentmethodList').DataTable();
          // datatable.draw();
        }
      }
    }

    function setClientType(data, clientTypeDataName) {
      for (let i in data.tclienttype) {
        if (data.tclienttype.hasOwnProperty(i)) {
          if (data.tclienttype[i].TypeName == clientTypeDataName) {
            $('#edtClientTypeID').val(data.tclienttype[i].Id);
            $('#edtClientTypeName').val(data.tclienttype[i].TypeName);
            $('#txaDescription').val(data.tclienttype[i].TypeDescription);
          }
        }
      }
      $('.fullScreenSpin').css('display', 'none');
      $('#myModalClientType').modal('toggle');
    }

    function editableCustomerType(e, $each, offset, clientTypeDataName) {
      $('#edtClientTypeID').val('');
      $('#edtClientTypeName').val('');
      $('#txaDescription').val('');
      $('#add-clienttype-title').text('Add Customer Type');
      if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
        $('#clienttypeListModal').modal('toggle');
      } else {
        if (clientTypeDataName.replace(/\s/g, '') !== '') {
          $('#add-clienttype-title').text('Edit Customer Type');
          getVS1Data('TClientType').then(function (dataObject) { //edit to test indexdb
            if (dataObject.length == 0) {
              $('.fullScreenSpin').css('display', 'inline-block');
              contactService.getClientType().then(function (data) {
                setClientType(data, clientTypeDataName);
              });
            } else {
              let data = JSON.parse(dataObject[0].data);
              setClientType(data, clientTypeDataName);
            }
          }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'inline-block');
            contactService.getClientType().then(function (data) {
              setClientType(data, clientTypeDataName);
            });
          });
        } else {
          $('#clienttypeListModal').modal();
          $('#termsList_filter .form-control-sm').focus();
          $('#termsList_filter .form-control-sm').val('');
          $('#termsList_filter .form-control-sm').trigger("input");
        }
      }
    }

    function setTaxRateData(data, taxRateDataName) {
      for (let i = 0; i < data.ttaxcodevs1.length; i++) {
        if (data.ttaxcodevs1[i].CodeName == taxRateDataName) {
          $("#edtTaxNamePop").attr("readonly", true);
          let taxRate = (
            data.ttaxcodevs1[i].Rate * 100
          ).toFixed(2);
          const taxRateID = data.ttaxcodevs1[i].Id || "";
          const taxRateName = data.ttaxcodevs1[i].CodeName || "";
          const taxRateDesc = data.ttaxcodevs1[i].Description || "";
          $("#edtTaxID").val(taxRateID);
          $("#edtTaxNamePop").val(taxRateName);
          $("#edtTaxRatePop").val(taxRate);
          $("#edtTaxDescPop").val(taxRateDesc);
          $("#newTaxRateModal").modal("toggle");
        }
      }
    }

    function editableTaxCode(e, $each, offset, taxRateDataName) {``
      $('#edtTaxID').val('');
      $('.taxcodepopheader').text('New Tax Rate');
      $('#edtTaxID').val('');
      $('#edtTaxNamePop').val('');
      $('#edtTaxRatePop').val('');
      $('#edtTaxDescPop').val('');
      $('#edtTaxNamePop').attr('readonly', false);
      if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
        $('#taxRateListModal').modal('toggle');
        $('#tblTaxRate_filter .form-control-sm').focus();
        $('#tblTaxRate_filter .form-control-sm').val('');
        $('#tblTaxRate_filter .form-control-sm').trigger("input");
      } else {
        if (taxRateDataName.replace(/\s/g, '') !== '') {
          $('.taxcodepopheader').text('Edit Tax Rate');
          getVS1Data('TTaxcodeVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
              sideBarService.getTaxCodesVS1().then(function (data) {
                setTaxRateData(data, taxRateDataName);
              }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
              });
            } else {
              let data = JSON.parse(dataObject[0].data);
              setTaxRateData(data, taxRateDataName);
            }
          }).catch(function (err) {
            sideBarService.getTaxCodesVS1().then(function (data) {
              setTaxRateData(data, taxRateDataName);
            }).catch(function (err) {
              $('.fullScreenSpin').css('display', 'none');
            });
          });
        } else {
          $('#taxRateListModal').modal('toggle');
          $('#tblTaxRate_filter .form-control-sm').focus();
          $('#tblTaxRate_filter .form-control-sm').val('');
          $('#tblTaxRate_filter .form-control-sm').trigger("input");
        }
      }
    }

    $('#sltTerms').editableSelect();
    $("#sltCurrency").editableSelect();
    $('#sltTerms').editableSelect().on('click.editable-select', function (e, li) {
      $('#selectLineID').val('sltTerms');
      let $each = $(this);
      let offset = $each.offset();
      const termsDataName = e.target.value || '';
      editableTerms(e, $each, offset, termsDataName);
    });
    $('#editCustomerTitle').select();
    $('#editCustomerTitle').editableSelect();

    $('#sltJobTerms').editableSelect();
    $('#sltJobTerms').editableSelect().on('click.editable-select', function (e, li) {
      $('#selectLineID').val('sltJobTerms');
      const $each = $(this);
      const offset = $each.offset();
      const termsDataName = e.target.value || '';
      editableTerms(e, $each, offset, termsDataName);
    });

    $('#sltPreferredPayment').editableSelect();
    $('#sltPreferredPayment').editableSelect().on('click.editable-select', function (e, li) {
      $('#selectPaymentMethodLineID').val('sltPreferredPayment');
      const $each = $(this);
      const offset = $each.offset();
      const paymentDataName = e.target.value || '';
      editablePreferredPayment(e, $each, offset, paymentDataName);
    });

    $('#sltJobPreferredPayment').editableSelect();
    $('#sltJobPreferredPayment').editableSelect().on('click.editable-select', function (e, li) {
      $('#selectPaymentMethodLineID').val('sltJobPreferredPayment');
      const $each = $(this);
      const offset = $each.offset();
      const paymentDataName = e.target.value || '';
      editablePreferredPayment(e, $each, offset, paymentDataName);
    });

    $('#sltCustomerType').editableSelect();
    $('#sltCustomerType').editableSelect().on('click.editable-select', function (e, li) {
      $('#selectLineID').val('sltCustomerType');
      const $each = $(this);
      const offset = $each.offset();
      const clientTypeDataName = e.target.value || '';
      editableCustomerType(e, $each, offset, clientTypeDataName);

    });

    $('#sltJobCustomerType').editableSelect();
    $('#sltJobCustomerType').editableSelect().on('click.editable-select', function (e, li) {
      $('#selectLineID').val('sltJobCustomerType');
      const $each = $(this);
      const offset = $each.offset();
      const clientTypeDataName = e.target.value || '';
      editableCustomerType(e, $each, offset, clientTypeDataName);
    });

    $('#sltTaxCode').editableSelect();
    $('#sltTaxCode').editableSelect().on('click.editable-select', function (e, li) {
      $('#selectLineID').val('sltTaxCode');
      const $each = $(this);
      const offset = $each.offset();
      const taxRateDataName = e.target.value || '';
      editableTaxCode(e, $each, offset, taxRateDataName);

    });

    $('#sltJobTaxCode').editableSelect();
    $('#sltJobTaxCode').editableSelect().on('click.editable-select', function (e, li) {
      $('#selectLineID').val('sltJobTaxCode');
      const $each = $(this);
      const offset = $each.offset();
      const taxRateDataName = e.target.value || '';
      editableTaxCode(e, $each, offset, taxRateDataName);
    });
    }, 3000);
  });

  $(document).on('click', '#editCustomerTitle', function (e, li) {
    const $earch = $(this);
    const offset = $earch.offset();
    if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
      $('#customerTitlePopModal').modal('toggle');
    } else {
      $('#customerTitlePopModal').modal();
    }
  });

  $(document).on("click", "#termsList tbody tr", function (e) {
    let selectedTermsDropdownID = $('#selectLineID').val() || 'sltTerms';
    $('#' + selectedTermsDropdownID + '').val($(this).find(".colTermName").text());
    $('#termsListModal').modal('toggle');
  });
  $(document).on("click", "#paymentmethodList tbody tr", function (e) {
    let selectedDropdownID = $('#selectPaymentMethodLineID').val() || 'sltPreferredPayment';
    $('#' + selectedDropdownID + '').val($(this).find(".colName").text());
    $('#paymentMethodModal').modal('toggle');
  });
  $(document).on("click", "#tblClienttypeList tbody tr", function (e) {
    let selectedClientTypeDropdownID = $('#selectLineID').val() || 'sltCustomerType';
    $('#' + selectedClientTypeDropdownID + '').val($(this).find(".colTypeName").text());
    $('#clienttypeListModal').modal('toggle');
  });
  $(document).on("click", "#tblTaxRate tbody tr", function (e) {
    let selectedTaxRateDropdownID = $('#selectLineID').val() || 'sltTaxCode';
    $('#' + selectedTaxRateDropdownID + '').val($(this).find(".taxName").text());
    $('#taxRateListModal').modal('toggle');
  });
  $(document).on("click", "#referenceLetterModal .btnSaveLetterTemp", function (e) {
    playSaveAudio();
    setTimeout(function () {
      if ($("input[name='refTemp']:checked").attr('value') == undefined || $("input[name='refTemp']:checked").attr('value') == null) {
        swal({
          title: 'Oooops...',
          text: "No email template has been set",
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Cancel'
        }).then((result) => {
          if (result.value) {
            $('#referenceLetterModal').modal('toggle');
          }
        });
      } else {
        let email = $('#edtCustomerEmail').val();
        let dataLabel = $("input[name='refTemp']:checked").attr('value');
        let dataSubject = $("input[name='refTemp']:checked").attr('data-subject');
        let dataMemo = $("input[name='refTemp']:checked").attr('data-memo');
        if (email && email != null && email != '') {
          document.location =
            "mailto:" + email + "?subject=" + dataSubject + "&body=" + dataMemo;
          sideBarService.getCorrespondences().then(dataObject => {
            let temp = {
              type: "TCorrespondence",
              fields: {
                Active: true,
                EmployeeId: localStorage.getItem('mySessionEmployeeLoggedID'),
                Ref_Type: dataLabel,
                MessageAsString: dataMemo,
                MessageFrom: localStorage.getItem('mySessionEmployee'),
                MessageId: dataObject.tcorrespondence.length.toString(),
                MessageTo: email,
                ReferenceTxt: dataSubject,
                Ref_Date: moment().format('YYYY-MM-DD'),
                Status: ""
              }
            }
            sideBarService.saveCorrespondence(temp).then(data => {
              sideBarService.getCorrespondences().then(dataUpdate => {
                addVS1Data('TCorrespondence', JSON.stringify(dataUpdate));
              })
              $('#referenceLetterModal').modal('toggle');
            })
          })
        } else {
          swal({
            title: 'Oooops...',
            text: "No user email has been set",
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Cancel'
          }).then((result) => {
            if (result.value) {
              $('#referenceLetterModal').modal('toggle');
            }
          });
        }
      }
    }, delayTimeAfterSound);
  });
  $(document).on('click', '#referenceLetterModal .btnAddLetter', function (e) {
    $('#addLetterTemplateModal').modal('toggle')
  });
  $(document).on('click', '#addLetterTemplateModal #save-correspondence', function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let correspondenceTemp = templateObject.correspondences.get()
    let tempLabel = $("#edtTemplateLbl").val();
    let tempSubject = $('#edtTemplateSubject').val();
    let tempContent = $("#edtTemplateContent").val();
    if (correspondenceTemp.length > 0) {
      let index = correspondenceTemp.findIndex(item => {
        return item.Ref_Type == tempLabel
      })
      if (index > 0) {
        swal({
          title: 'Oooops...',
          text: 'There is already a template labeled ' + tempLabel,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) { } else if (result.dismiss === 'cancel') { }
        });
        $('.fullScreenSpin').css('display', 'none');
      } else {
        sideBarService.getCorrespondences().then(dObject => {
          let temp = {
            Active: true,
            EmployeeId: localStorage.getItem('mySessionEmployeeLoggedID'),
            Ref_Type: tempLabel,
            MessageAsString: tempContent,
            MessageFrom: "",
            MessageId: dObject.tcorrespondence.length.toString(),
            MessageTo: "",
            ReferenceTxt: tempSubject,
            Ref_Date: moment().format('YYYY-MM-DD'),
            Status: ""
          }
          let objDetails = {
            type: 'TCorrespondence',
            fields: temp
          }
          sideBarService.saveCorrespondence(objDetails).then(data => {
            sideBarService.getCorrespondences().then(dataUpdate => {
              addVS1Data('TCorrespondence', JSON.stringify(dataUpdate)).then(function () {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                  title: 'Success',
                  text: 'Template has been saved successfully ',
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Continue'
                }).then((result) => {
                  if (result.value) {
                    $('#addLetterTemplateModal').modal('toggle')
                    templateObject.getReferenceLetters();
                  } else if (result.dismiss === 'cancel') { }
                });
              })
            }).catch(function () {
              $('.fullScreenSpin').css('display', 'none');
              swal({
                title: 'Oooops...',
                text: 'Something went wrong',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
              }).then((result) => {
                if (result.value) {
                  $('#addLetterTemplateModal').modal('toggle')
                } else if (result.dismiss === 'cancel') { }
              });
            })
          }).catch(function () {
            $('.fullScreenSpin').css('display', 'none');
            swal({
              title: 'Oooops...',
              text: 'Something went wrong',
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
            }).then((result) => {
              if (result.value) {
                $('#addLetterTemplateModal').modal('toggle')
              } else if (result.dismiss === 'cancel') { }
            });
          })
        })
      }
    } else {
      sideBarService.getCorrespondences().then(dObject => {
        let temp = {
          Active: true,
          EmployeeId: localStorage.getItem('mySessionEmployeeLoggedID'),
          Ref_Type: tempLabel,
          MessageAsString: tempContent,
          MessageFrom: "",
          MessageId: dObject.tcorrespondence.length.toString(),
          MessageTo: "",
          ReferenceTxt: tempSubject,
          Ref_Date: moment().format('YYYY-MM-DD'),
          Status: ""
        }
        let objDetails = {
          type: 'TCorrespondence',
          fields: temp
        }

        let array = [];
        array.push(objDetails)

        sideBarService.saveCorrespondence(objDetails).then(data => {
          sideBarService.getCorrespondences().then(function (dataUpdate) {
            addVS1Data('TCorrespondence', JSON.stringify(dataUpdate)).then(function () {
              $('.fullScreenSpin').css('display', 'none');
              swal({
                title: 'Success',
                text: 'Template has been saved successfully ',
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'Continue'
              }).then((result) => {
                if (result.value) {
                  $('#addLetterTemplateModal').modal('toggle')
                  templateObject.getReferenceLetters();

                } else if (result.dismiss === 'cancel') { }
              });
            }).catch(function (err) {
              $('.fullScreenSpin').css('display', 'none');
              swal({
                title: 'Oooops...',
                text: 'Something went wrong',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
              }).then((result) => {
                if (result.value) {
                  $('#addLetterTemplateModal').modal('toggle')
                } else if (result.dismiss === 'cancel') { }
              });
            })
          })
        }).catch(function () {
          swal({
            title: 'Oooops...',
            text: 'Something went wrong',
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
          }).then((result) => {
            if (result.value) {
              $('#addLetterTemplateModal').modal('toggle')
            } else if (result.dismiss === 'cancel') { }
          });
        })
      })

    }
  });
  $(document).on('click', '#tblEmployeelist tbody tr', function (event) {
    let value = $(this).find('.colEmployeeName').text();
    $('#leadRep').val(value);
    if ($('#employeeListCRMModal').hasClass('show')) {
      $('#employeeListCRMModal').modal('hide');
    }
  })
  $(document).on("click", "#tblStatusPopList tbody tr", function (e) {
    $('#leadStatus').val($(this).find(".colStatusName").text());
    $('#statusPopModal').modal('toggle');
    $('#tblStatusPopList_filter .form-control-sm').val('');
    setTimeout(function () {
      $('.btnRefreshStatus').trigger('click');
      $('.fullScreenSpin').css('display', 'none');
    }, 1000);
  });
  $(document).on('click', '#leadStatus', function (e, li) {
    const $earch = $(this);
    const offset = $earch.offset();
    $('#statusId').val('');
    const statusDataName = e.target.value || '';
    if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
      $('#statusPopModal').modal('toggle');
    } else {
      if (statusDataName.replace(/\s/g, '') != '') {
        $('#newStatusHeader').text('Edit Status');
        $('#newStatus').val(statusDataName);
        getVS1Data('TLeadStatusType').then(function (dataObject) {
          if (dataObject.length == 0) {
            $('.fullScreenSpin').css('display', 'inline-block');
            sideBarService.getAllLeadStatus().then(function (data) {
              for (let i in data.tleadstatustype) {
                if (data.tleadstatustype[i].TypeName === statusDataName) {
                  $('#statusId').val(data.tleadstatustype[i].Id);
                }
              }
              $('.fullScreenSpin').css('display', 'none');
              $('#newStatusPopModal').modal('toggle');
            });
          } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tleadstatustype;
            for (let i in useData) {
              if (useData[i].TypeName === statusDataName) {
                $('#statusId').val(useData[i].Id);
              }
            }
            $('.fullScreenSpin').css('display', 'none');
            $('#newStatusPopModal').modal('toggle');
          }
        }).catch(function (err) {
          $('.fullScreenSpin').css('display', 'inline-block');
          sideBarService.getAllLeadStatus().then(function (data) {
            for (let i in data.tleadstatustype) {
              if (data.tleadstatustype.hasOwnProperty(i)) {
                if (data.tleadstatustype[i].TypeName === statusDataName) {
                  $('#statusId').val(data.tleadstatustype[i].Id);
                }
              }
            }
            setTimeout(function () {
              $('.fullScreenSpin').css('display', 'none');
              $('#newStatusPopModal').modal('toggle');
            }, 200);
          });
        });
        setTimeout(function () {
          $('.fullScreenSpin').css('display', 'none');
          $('#newStatusPopModal').modal('toggle');
        }, 200);

      } else {
        $('#statusPopModal').modal();
        $('#tblStatusPopList_filter .form-control-sm').focus();
        $('#tblStatusPopList_filter .form-control-sm').val('');
        $('#tblStatusPopList_filter .form-control-sm').trigger("input");
      }
    }
  });
  $(document).on('click', '#leadRep', function (e, li) {
    if ($('#employeeListCRMModal').hasClass('show') == false) {
      $('#employeeListCRMModal').modal('show');
    }
  })

  $(document).on("click", "#tblTitleList tbody tr", function (e) {
    $('#editCustomerTitle').val($(this).find(".colTypeName").text());
    $('#customerTitlePopModal').modal('toggle');
  });

  $(document).on("click", "#tblCustomerCrmListWithDate tbody .dnd-moved .colDate, #tblCustomerCrmListWithDate tbody .dnd-moved .colType", function (e) {
    $(".editTaskDetailName").val($("#tblCustomerCrmListWithDate tbody .dnd-moved .colTaskName").html());
    $(".editTaskDetailDescription").val($("#tblCustomerCrmListWithDate tbody .dnd-moved .colTaskDesc").html());
    $("#taskmodalDuedate").val($("#tblCustomerCrmListWithDate tbody .dnd-moved #completeDate").val());
    $("#taskDetailModal").modal("toggle");
  });

  $(document).on("change", ".editTaskDetailName, .editTaskDetailDescription, #taskmodalDuedate", function (e) {
    $("#tblCustomerCrmListWithDate tbody .dnd-moved .colTaskName").html($(".editTaskDetailName").val());
    $("#tblCustomerCrmListWithDate tbody .dnd-moved .colTaskDesc").html($(".editTaskDetailDescription").val());
    $("#tblCustomerCrmListWithDate tbody .dnd-moved #completeDate").val($("#taskmodalDuedate").val());
  });

  let tokenid = "random";
  $(document).on("focusout", "#" + tokenid + " .colTaskName, #" + tokenid + " .colTaskDesc, #" + tokenid + " .colCompletedBy", function (e) {
    $(".editTaskDetailName").val($("#tblCustomerCrmListWithDate tbody .dnd-moved .colTaskName").html());
    $(".editTaskDetailDescription").val($("#tblCustomerCrmListWithDate tbody .dnd-moved .colTaskDesc").html());
    $("#taskmodalDuedate").val($("#tblCustomerCrmListWithDate tbody .dnd-moved #completeDate").val());
    if ($("#" + tokenid + " .colTaskName").html() != "" && $("#" + tokenid + " .colTaskDesc").html() != "" && $("#" + tokenid + " #completeDate").val() != "") {
      $("input.form-control-sm").focus();
      $(".btnSaveEditTask").trigger("click");
      $(".btnAddLineGroup button").attr("disabled", false);
      $(".btnCustomerTask").attr("disabled", false);
      $(".btnJobTask").attr("disabled", false);
    }
  });
});

Template.customerscard.events({
  'keyup .txtSearchCustomers': function (event) {
    if ($(event.target).val() != '') {
      $(".btnRefreshCustomers").addClass('btnSearchAlert');
    } else {
      $(".btnRefreshCustomers").removeClass('btnSearchAlert');
    }
    if (event.keyCode == 13) {
      $(".btnRefreshCustomers").trigger("click");
    }
  },
  'click .btnRefreshCustomers': async function (event) {
    let currentId = FlowRouter.current().queryParams;
    $('.fullScreenSpin').css('display', 'inline-block');
    let dataSearchName = $('.txtSearchCustomers').val() || '';
    if (dataSearchName.replace(/\s/g, '') != '') {
      sideBarService.getNewCustomerByNameOrID(dataSearchName).then(async function (data) {
        $(".btnRefreshCustomers").removeClass('btnSearchAlert');
        let lineItems = [];
        let lineItemObj = {};
        if (data.tcustomervs1.length > 0) {
          $("#tblCustomerSideList > tbody").empty();
          for (let i = 0; i < data.tcustomervs1.length; i++) {
            let classname = '';
            if (!isNaN(currentId.id)) {
              if (data.tcustomervs1[i].fields.ID == parseInt(currentId.id)) {
                classname = 'currentSelect';
              }
            }
            if (!isNaN(currentId.jobid)) {
              if (data.tcustomervs1[i].fields.ID == parseInt(currentId.jobid)) {
                classname = 'currentSelect';
              }
            }
            const dataList = {
              id: data.tcustomervs1[i].fields.ID || '',
              company: data.tcustomervs1[i].fields.ClientName || '',
              isslectJob: data.tcustomervs1[i].fields.IsJob || false,
              classname: classname
            };
            $(".tblCustomerSideList > tbody").append(
              ' <tr class="' + dataList.isslectJob + '" id="' + dataList.id + '" style="cursor: pointer;">' +
              '<td data-toggle="tooltip" data-bs-tooltip="" data-placement="bottom" title="' + dataList.company + '" id="' + dataList.id + '" class="' + dataList.isslectJob + ' ' + dataList.classname + '" >' + dataList.company + '</td>' +
              '</tr>');
            lineItems.push(dataList);
          }
          $('.counter').text(lineItems.length + ' items');
          $('.fullScreenSpin').css('display', 'none');
        } else {
          $('.fullScreenSpin').css('display', 'none');
        }
      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
      });
    } else {
      Meteor._reload.reload();
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .tblJoblist tbody tr': function (event) {
    var listData = $(event.target).closest('tr').attr('id');
    if (listData) {
      window.open('/customerscard?jobid=' + listData, '_self');
    }
  },
  'click #tblCustomerCrmListWithDate tbody tr': function (event) {
    const taskID = $(event.target).parent().attr('id');
    let colType = $(event.target).parent().find(".colType").text();
    if (taskID !== undefined && taskID !== "random") {
      if (colType == 'Task') {
        openEditTaskModals(taskID, "");
      } else if (colType == 'Appointment') {
        document.getElementById("updateID").value = taskID || 0;
        $("#event-modal").modal("toggle");
      }
    }
  },
  'click .tblCrmList tbody tr': function (event) {
    const taskID = $(event.target).parent().attr('id');
    let crmRecords = Template.instance().crmRecords.get();
    const currentRecordIndex = crmRecords.findIndex(item => item.id == taskID);
    let taskCategory = "";
    if (currentRecordIndex > -1) {
      taskCategory = crmRecords[currentRecordIndex].category;
    }
    if (taskID !== undefined) {
      if (taskCategory == 'task') {
        openEditTaskModals(taskID, "");
      } else if (taskCategory == 'appointment') {
        document.getElementById("updateID").value = taskID || 0;
        $("#event-modal").modal("toggle");
      }
    }
  },
  'click .openBalance': function (event) {
    let currentId = FlowRouter.current().queryParams.id || FlowRouter.current().queryParams.jobid || '';
    let customerName = $('#edtCustomerCompany').val() || $('#edtJobCustomerCompany').val() || '';
    if (customerName !== "") {
      if (customerName.indexOf('^') > 0) {
        customerName = customerName.split('^')[0]
      }
      window.open('/agedreceivables?contact=' + customerName + '&contactid=' + currentId, '_self');
    } else {
      window.open('/agedreceivables', '_self');
    }
  },
  'click #leadStatus': function (event) {
    $('#leadStatus').select();
    $('#leadStatus').editableSelect();
  },
  'click #leadRep': function (event) {
    $('#leadRep').select();
    $('#leadRep').editableSelect();
  },
  'click .btnReceiveCustomerPayment': async function (event) {
    let currentId = FlowRouter.current().queryParams.id || FlowRouter.current().queryParams.jobid || '';
    let customerName = $('#edtCustomerCompany').val() || $('#edtJobCustomerCompany').val() || '';
    if (customerName !== "") {
      if (customerName.indexOf('^') > 0) {
        customerName = customerName.split('^')[0]
      }
      await clearData('TAwaitingCustomerPayment');
      FlowRouter.go('/customerawaitingpayments?contact=' + customerName + '&contactid=' + currentId);
    }
  },
  'click .openBalancesummary': function (event) {
    let currentId = FlowRouter.current().queryParams.id || FlowRouter.current().queryParams.jobid || '';
    let customerName = $('#edtCustomerCompany').val() || $('#edtJobCustomerCompany').val() || '';
    if (customerName !== "") {
      if (customerName.indexOf('^') > 0) {
        customerName = customerName.split('^')[0]
      }
      window.open('/agedreceivablessummary?contact=' + customerName + '&contactid=' + currentId, '_self');
    } else {
      window.open('/agedreceivablessummary', '_self');
    }
  },
  'click #customerShipping-1': function (event) {
    if ($(event.target).is(':checked')) {
      $('.customerShipping-2').css('display', 'none');
    } else {
      $('.customerShipping-2').css('display', 'block');
    }
  },
  'click .btnBack': function (event) {
    playCancelAudio();
    setTimeout(function () {
      history.back(1);
    }, delayTimeAfterSound);
  },
  'click .btnSaveDept': function () {
    playSaveAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      let custType = $('#edtClientTypeName').val();
      let typeDesc = $('#txaDescription').val() || '';
      if (custType == '') {
        swal('Client Type name cannot be blank!', '', 'warning');
        $('.fullScreenSpin').css('display', 'none');
        e.preventDefault();
      } else {
        let objDetails = {
          type: "TClientType",
          fields: {
            TypeName: custType,
            TypeDescription: typeDesc,
          }
        };
        contactService.saveClientTypeData(objDetails).then(function (objDetails) {
          sideBarService.getClientTypeData().then(function (dataReload) {
            addVS1Data('TClientType', JSON.stringify(dataReload)).then(function (datareturn) {
              Meteor._reload.reload();
            }).catch(function (err) {
              Meteor._reload.reload();
            });
          }).catch(function (err) {
            Meteor._reload.reload();
          });
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
      }
    }, delayTimeAfterSound);
  },
  'click .btnSave': async function (e) {
    playSaveAudio();
    let templateObject = Template.instance();
    let uploadedItems = templateObject.uploadedFiles.get();
    setTimeout(async function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      let company = $('#edtCustomerCompany').val() || '';
      let email = $('#edtCustomerEmail').val() || '';
      let title = $('#editCustomerTitle').val() || '';
      let firstname = $('#edtFirstName').val() || '';
      let middlename = $('#edtMiddleName').val() || '';
      let lastname = $('#edtLastName').val() || '';
      let country = $('#sedtCountry').val() || '';
      let phone = $('#edtCustomerPhone').val() || '';
      let mobile = $('#edtCustomerMobile').val() || '';
      if (mobile != '') {
        mobile = contactService.changeDialFormat(mobile, country);
      }
      if (phone != '') {
        phone = contactService.changeDialFormat(phone, country);
      }
      let fax = $('#edtCustomerFax').val() || '';
      let skype = $('#edtCustomerSkypeID').val() || '';
      let website = $('#edtCustomerWebsite').val() || '';
      let streetAddress = $('#edtCustomerShippingAddress').val() || '';
      let city = $('#edtCustomerShippingCity').val() || '';
      let suburb = $('#edtCustomerShippingSuburb').val() || '';
      let state = $('#edtCustomerShippingState').val() || '';
      let postalcode = $('#edtCustomerShippingZIP').val() || '';

      let bstreetAddress = '';
      let bcity = '';
      let bstate = '';
      let bzipcode = '';
      let bcountry = '';
      let isSupplier = !!$('#chkSameAsSupplier').is(':checked');
      if ($('#chkSameAsShipping2').is(':checked')) {
        bstreetAddress = streetAddress;
        bcity = city;
        bstate = state;
        bzipcode = postalcode;
        bcountry = country;
      } else {
        bstreetAddress = $('#edtCustomerBillingAddress').val() || '';
        bcity = $('#edtCustomerBillingCity').val() || '';
        bstate = $('#edtCustomerBillingState').val() || '';
        bzipcode = $('#edtCustomerBillingZIP').val() || '';
        bcountry = $('#bedtCountry').val() || '';
      }
      let permanentDiscount = $('#edtCustomerCardDiscount').val() || 0;
      let sltPaymentMethodName = $('#sltPreferredPayment').val() || '';
      let sltTermsName = $('#sltTerms').val() || '';
      let sltShippingMethodName = '';
      let sltTaxCodeName = "";
      let isChecked = $(".chkTaxExempt").is(":checked");
      if (isChecked) {
        sltTaxCodeName = "NT";
      } else {
        sltTaxCodeName = $('#sltTaxCode').val() || '';
      }
      let notes = $('#txaNotes').val() || '';
      // add to custom field
      let custField1 = $('#edtCustomField1').val() || '';
      let custField2 = $('#edtCustomField2').val() || '';
      let custField3 = $('#edtCustomField3').val() || '';
      let custField4 = $('#edtCustomField4').val() || '';
      let customerType = $('#sltCustomerType').val() || '';

      let sourceName = $('#leadSource').val() || '';
      let repName = $('#leadRep').val() || '';
      let status = $('#leadStatus').val() || '';
      if (company == '') {
        $('.fullScreenSpin').css('display', 'none');
        swal({
          title: "Please provide the compamy name !",
          text: '',
          type: 'warning',
        }).then((result) => {
          if (result.value) {
            $('#edtCustomerCompany').focus();
          }
        });

        e.preventDefault();
        return false;
      }
      if (firstname == '') {
        $('.fullScreenSpin').css('display', 'none');
        swal({
          title: "Please provide the first name !",
          text: '',
          type: 'warning',
        }).then((result) => {
          if (result.value) {
            $('#edtFirstName').focus();
          }
        });
        e.preventDefault();
        return false;
      }
      if (lastname == '') {
        $('.fullScreenSpin').css('display', 'none');
        swal({
          title: "Please provide the last name !",
          text: '',
          type: 'warning',
        }).then((result) => {
          if (result.value) {
            $('#edtLastName').focus();
          }
        });
        e.preventDefault();
        return false;
      }
      if (sltTermsName == '') {
        $('.fullScreenSpin').css('display', 'none');
        $("#sltTerms").click();
        e.preventDefault();
      } else if (sltTaxCodeName == '') {
        $('.fullScreenSpin').css('display', 'none');
        $("#sltTaxCode").click();
        e.preventDefault();
      }

      const url = FlowRouter.current().path;
      const getemp_id = url.split('?id=');
      let currentEmployee = getemp_id[getemp_id.length - 1];
      let objDetails = '';
      let TCustomerID = 0;
      if (getemp_id[1]) {
        TCustomerID = parseInt(currentEmployee);
      } else {
        let checkCustData = await contactService.getCheckCustomersData(company) || '';
        if (checkCustData !== '') {
          if (checkCustData.tcustomer.length) {
            TCustomerID = checkCustData.tcustomer[0].Id;
          }
        }
      }
      objDetails = {
        type: "TCustomerEx",
        fields: {
          ID: TCustomerID,
          Title: title,
          ClientName: company,
          FirstName: firstname,
          MiddleName: middlename,
          CUSTFLD10: middlename,
          LastName: lastname,
          PublishOnVS1: true,
          Email: email,
          Phone: phone,
          Mobile: mobile,
          SkypeName: skype,
          Faxnumber: fax,
          ClientTypeName: customerType,
          Street: streetAddress,
          Street2: city,
          Suburb: suburb,
          State: state,
          PostCode: postalcode,
          Country: country,
          BillStreet: bstreetAddress,
          BillStreet2: bcity,
          BillState: bstate,
          BillPostCode: bzipcode,
          Billcountry: bcountry,
          IsSupplier: isSupplier,
          Notes: notes,
          URL: website,
          PaymentMethodName: sltPaymentMethodName,
          TermsName: sltTermsName,
          ShippingMethodName: sltShippingMethodName,
          TaxCodeName: sltTaxCodeName,
          Attachments: uploadedItems,
          CUSTFLD1: custField1,
          CUSTFLD2: custField2,
          CUSTFLD3: custField3,
          CUSTFLD4: custField4,
          Discount: parseFloat(permanentDiscount) || 0,
          Status: status,
          SourceName: sourceName,
          RepName: repName,
          ForeignExchangeCode: $("#sltCurrency").val(),
        }
      };
      contactService.saveCustomerEx(objDetails).then(function (objDetails) {

        if (localStorage.getItem("enteredURL") != null) {
          FlowRouter.go(localStorage.getItem("enteredURL"));
          localStorage.removeItem("enteredURL");
          return;
        }

        let customerSaveID = objDetails.fields.ID;
        if (customerSaveID) {
          sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function (dataReload) {
            addVS1Data('TCustomerVS1', JSON.stringify(dataReload)).then(function (datareturn) {
              window.open('/customerlist', '_self');
            }).catch(function (err) {
              window.open('/customerlist', '_self');
            });
          }).catch(function (err) {
            window.open('/customerlist', '_self');
          });
        }
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss == 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }, delayTimeAfterSound);
  },
  'click .btnSaveJob': function (event) {
    playSaveAudio();
    let templateObject = Template.instance();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      let companyParent = $('#edtParentJobCustomerCompany').val() || '';
      let addressValid = false;
      let emailJob = $('#edtJobCustomerEmail').val() || '';
      let titleJob = $('#edtJobTitle').val() || '';
      let firstnameJob = $('#edtJobFirstName').val() || '';
      let middlenameJob = $('#edtJobMiddleName').val() || '';
      let lastnameJob = $('#edtJobLastName').val() || '';
      let phoneJob = $('#edtJobCustomerPhone').val() || '';
      let mobileJob = $('#edtJobCustomerMobile').val() || '';
      let faxJob = $('#edtJobCustomerFax').val() || '';
      let skypeJob = $('#edtJobCustomerSkypeID').val() || '';
      let websiteJob = $('#edtJobCustomerWebsite').val() || '';

      let jobName = $('#edtJobName').val() || '';
      let jobNumber = $('#edtJobNumber').val() || '';
      let bstreetAddressJob = '';
      let bcityJob = '';
      let bstateJob = '';
      let bzipcodeJob = '';
      let bcountryJob = '';

      let streetAddressJob = '';
      let cityJob = '';
      let stateJob = '';
      let postalcodeJob = '';
      let countryJob = '';

      if ($('#chkJobSameAsShipping2').is(':checked')) {
        streetAddressJob = $('.tab-Job4 #edtJobCustomerShippingAddress').val();
        cityJob = $('.tab-Job4 #edtJobCustomerShippingCity').val();
        stateJob = $('.tab-Job4 #edtJobCustomerShippingState').val();
        postalcodeJob = $('.tab-Job4 #edtJobCustomerShippingZIP').val();
        countryJob = $('.tab-Job4 #sedtJobCountry').val();
        bstreetAddressJob = streetAddressJob;
        bcityJob = cityJob;
        bstateJob = stateJob;
        bzipcodeJob = postalcodeJob;
        bcountryJob = countryJob;
        addressValid = true;
      } else if ($('#chkJobSameAsShipping2NoPOP').is(':checked')) {
        streetAddressJob = $('#edtJobCustomerShippingAddress').val();
        cityJob = $('#edtJobCustomerShippingCity').val();
        stateJob = $('#edtJobCustomerShippingState').val();
        postalcodeJob = $('#edtJobCustomerShippingZIP').val();
        countryJob = $('#sedtJobCountry').val();
        bstreetAddressJob = streetAddressJob;
        bcityJob = cityJob;
        bstateJob = stateJob;
        bzipcodeJob = postalcodeJob;
        bcountryJob = countryJob;
      } else {
        bstreetAddressJob = $('#edtCustomerBillingAddress').val();
        bcityJob = $('#edtJobCustomerBillingCity').val();
        bstateJob = $('#edtJobCustomerBillingState').val();
        bzipcodeJob = $('#edtJobCustomerBillingZIP').val();
        bcountryJob = $('#sJobedtCountry').val();
      }

      let sltPaymentMethodNameJob = $('#sltJobPreferredPayment').val() || 'Cash';
      let sltTermsNameJob = $('#sltJobTerms').val() || '';
      let sltShippingMethodNameJob = ''; //$('#sltJobDeliveryMethod').val();
      let uploadedItemsJob = templateObject.uploadedFilesJob.get();
      let uploadedItemsJobNoPOP = templateObject.uploadedFilesJobNoPOP.get();
      let sltTaxCodeNameJob = "";
      let isChecked = $(".chkJobTaxExempt").is(":checked");
      if (isChecked) {
        sltTaxCodeNameJob = "NT";
      } else {
        sltTaxCodeNameJob = $('#sltJobTaxCode').val() || '';
      }

      let notesJob = $('#txaJobNotes').val() || '';
      let customerTypeJob = $('#sltJobCustomerType').val() || '';
      const url = FlowRouter.current().path;
      const getemp_id = url.split('?jobid=');
      let currentId = FlowRouter.current().queryParams;
      let objDetails = '';
      if (getemp_id[1]) {
        objDetails = {
          type: "TJobEx",
          fields: {
            ID: parseInt(currentId.jobid),
            Title: $('.jobTabEdit #edtJobTitle').val() || '',
            FirstName: $('.jobTabEdit #edtJobFirstName').val() || '',
            MiddleName: $('.jobTabEdit #edtJobMiddleName').val() || '',
            LastName: $('.jobTabEdit #edtJobLastName').val() || '',
            Email: $('.jobTabEdit #edtJobCustomerEmail').val() || '',
            Phone: $('.jobTabEdit #edtJobCustomerPhone').val() || '',
            Mobile: $('.jobTabEdit #edtJobCustomerMobile').val() || '',
            SkypeName: $('.jobTabEdit #edtJobCustomerSkypeID').val() || '',
            Street: streetAddressJob,
            Street2: cityJob,
            State: stateJob,
            PostCode: postalcodeJob,
            Country: $('.tab-Job4 #sedtJobCountry').val() || '',
            BillStreet: bstreetAddressJob,
            BillStreet2: bcityJob,
            BillState: bstateJob,
            BillPostCode: bzipcodeJob,
            Billcountry: bcountryJob,
            Notes: $('.tab-Job5 #txaJobNotes').val() || '',
            CUSTFLD9: $('.jobTabEdit #edtJobCustomerWebsite').val() || '',
            PaymentMethodName: sltPaymentMethodNameJob || '',
            TermsName: sltTermsNameJob || '',
            ClientTypeName: customerTypeJob || '',
            ShippingMethodName: sltShippingMethodNameJob || '',
            TaxCodeName: sltTaxCodeNameJob || '',
            Faxnumber: $('.jobTabEdit #edtJobCustomerFax').val() || '',
            JobNumber: parseInt($('.jobTabEdit #edtJobNumber').val()) || 0,
            Attachments: uploadedItemsJobNoPOP || ''
          }
        };
      } else {
        objDetails = {
          type: "TJobEx",
          fields: {
            Title: titleJob,
            ParentClientName: companyParent,
            ParentCustomerName: companyParent,
            FirstName: firstnameJob,
            MiddleName: middlenameJob,
            LastName: lastnameJob,
            Email: emailJob,
            Phone: phoneJob,
            Mobile: mobileJob,
            SkypeName: skypeJob,
            Street: streetAddressJob,
            Street2: cityJob,
            State: stateJob,
            PostCode: postalcodeJob,
            Country: countryJob,
            BillStreet: bstreetAddressJob,
            BillStreet2: bcityJob,
            BillState: bstateJob,
            BillPostCode: bzipcodeJob,
            Billcountry: bcountryJob,
            Notes: notesJob,
            CUSTFLD9: websiteJob,
            PaymentMethodName: sltPaymentMethodNameJob,
            TermsName: sltTermsNameJob,
            ClientTypeName: customerTypeJob,
            ShippingMethodName: sltShippingMethodNameJob,
            TaxCodeName: sltTaxCodeNameJob,
            Faxnumber: faxJob,
            JobName: jobName,
            JobNumber: parseFloat(jobNumber) || 0,
            Attachments: uploadedItemsJob
          }
        };
      }

      contactService.saveJobEx(objDetails).then(function (objDetails) {
        $('.modal-backdrop').css('display', 'none');
        sideBarService.getAllJobssDataVS1(initialBaseDataLoad, 0).then(function (dataReload) {
          addVS1Data('TJobVS1', JSON.stringify(dataReload)).then(function (datareturn) {
            FlowRouter.go('/joblist?success=true');
          }).catch(function (err) {
            FlowRouter.go('/joblist?success=true');
          });
        }).catch(function (err) {
          FlowRouter.go('/joblist?success=true');
        });
        sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function (dataReload) {
          addVS1Data('TCustomerVS1', JSON.stringify(dataReload)).then(function (datareturn) {

          }).catch(function (err) {

          });
        }).catch(function (err) {

        });

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
    }, delayTimeAfterSound);
  },
  'keyup .search': function (event) {
    const searchTerm = $(".search").val();
    const searchSplit = searchTerm.replace(/ /g, "'):containsi('");
    $.extend($.expr[':'], {
      'containsi': function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
      }
    });
    $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function (e) {
      $(this).attr('visible', 'false');
    });
    $(".results tbody tr:containsi('" + searchSplit + "')").each(function (e) {
      $(this).attr('visible', 'true');
    });
    const jobCount = $('.results tbody tr[visible="true"]').length;
    $('.counter').text(jobCount + ' items');
    if (jobCount == '0') { $('.no-result').show(); } else {
      $('.no-result').hide();
    }
    if (searchTerm == "") {
      $(".results tbody tr").each(function (e) {
        $(this).attr('visible', 'true');
        $('.no-result').hide();
      });
      var rowCount = $('.results tbody tr').length;
      $('.counter').text(rowCount + ' items');
    }

  },
  'click .tblCustomerSideList tbody tr': function (event) {
    const custLineID = $(event.target).attr('id');
    const custLineClass = $(event.target).attr('class');
    if (custLineID) {
      if (custLineClass == 'true') {
        window.open('/customerscard?jobid=' + custLineID, '_self');
      } else {
        window.open('/customerscard?id=' + custLineID, '_self');
      }
    }
  },
  'click .chkDatatable': function (event) {
    const columns = $('#tblTransactionlist th');
    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();
    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];
      if (v.innerText == columnDataValue) {
        if ($(event.target).is(':checked')) {
          $("." + replaceClass + "").css('display', 'table-cell');
          $("." + replaceClass + "").css('padding', '.75rem');
          $("." + replaceClass + "").css('vertical-align', 'top');
        } else {
          $("." + replaceClass + "").css('display', 'none');
        }
      }
    });
  },
  'click .resetTable': function (event) {
    Meteor._reload.reload();
  },
  'click .saveTable': function (event) {
    let lineItems = [];
    $('.columnSettings').each(function (index) {
      const $tblrow = $(this);
      const colTitle = $tblrow.find(".divcolumn").text() || '';
      const colWidth = $tblrow.find(".custom-range").val() || 0;
      const colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
      const colHidden = !$tblrow.find(".custom-control-input").is(':checked');
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass
      };
      lineItems.push(lineItemObj);
    });

    $('#myModal2').modal('toggle');
  },
  'blur .divcolumn': function (event) {
    let columData = $(event.target).text();
    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
    const datable = $('#tblTransactionlist').DataTable();
    const title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  'change .rngRange': function (event) {
    let range = $(event.target).val();
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    const datable = $('#tblTransactionlist th');
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css('width', range + 'px');
      }
    });
  },
  'click .btnOpenSettingsTransaction': function (event) {
    let templateObject = Template.instance();
    const columns = $('#tblTransactionlist th');
    const tableHeaderList = [];
    let sWidth = "";
    let columVisible = false;
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if ((v.className.includes("hiddenColumn"))) {
        columVisible = false;
      }
      sWidth = v.style.width.replace('px', "");
      let datatablerecordObj = {
        sTitle: v.innerText || '',
        sWidth: sWidth || '',
        sIndex: v.cellIndex || 0,
        sVisible: columVisible || false,
        sClass: v.className || ''
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  'click .btnOpenSettingsCrm': function (event) {
    let templateObject = Template.instance();
    const columns = $('#tblCrmList th');
    const tableHeaderList = [];
    let sWidth = "";
    let columVisible = false;
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if ((v.className.includes("hiddenColumn"))) {
        columVisible = false;
      }
      sWidth = v.style.width.replace('px', "");
      let datatablerecordObj = {
        sTitle: v.innerText || '',
        sWidth: sWidth || '',
        sIndex: v.cellIndex || 0,
        sVisible: columVisible || false,
        sClass: v.className || ''
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  'click #exportbtnTransaction': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletocsv').click();
    $('.fullScreenSpin').css('display', 'none');
  },
  'click #exportbtnCrm': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblCrmList_wrapper .dt-buttons .btntabletocsv').click();
    $('.fullScreenSpin').css('display', 'none');
  },
  'click #exportbtnJob': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblJoblist_wrapper .dt-buttons .btntabletocsv').click();
    $('.fullScreenSpin').css('display', 'none');
  },
  'click .printConfirmTransaction': function (event) {
    playPrintAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletopdf').click();
      $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
  },
  'click .printConfirmCrm': function (event) {
    playPrintAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      jQuery('#tblCrmList_wrapper .dt-buttons .btntabletopdf').click();
      $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
  },
  'click .printConfirmJob': function (event) {
    playPrintAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      jQuery('#tblJoblist_wrapper .dt-buttons .btntabletopdf').click();
      $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
  },
  'click .btnRefresh': function () {
    Meteor._reload.reload();
  },
  'click .btnRefreshTransaction': function () {
    let currentId = FlowRouter.current().queryParams;
    $('.fullScreenSpin').css('display', 'inline-block');
    sideBarService.getTTransactionListReport().then(function (data) {
      addVS1Data('TTransactionListReport', JSON.stringify(data)).then(function (datareturn) {
        if (!isNaN(currentId.jobid)) {
          window.open('/customerscard?jobid=' + currentId.jobid + '&transTab=active', '_self');
        }
        if (!isNaN(currentId.id)) {
          window.open('/customerscard?id=' + currentId.id + '&transTab=active', '_self');
        }
      }).catch(function (err) {
        if (!isNaN(currentId.jobid)) {
          window.open('/customerscard?jobid=' + currentId.jobid + '&transTab=active', '_self');
        }
        if (!isNaN(currentId.id)) {
          window.open('/customerscard?id=' + currentId.id + '&transTab=active', '_self');
        }
      });
    }).catch(function (err) {
      if (!isNaN(currentId.jobid)) {
        window.open('/customerscard?jobid=' + currentId.jobid + '&transTab=active', '_self');
      }
      if (!isNaN(currentId.id)) {
        window.open('/customerscard?id=' + currentId.id + '&transTab=active', '_self');
      }
    });
  },
  'click .btnRefreshJobDetails': function () {
    let currentId = FlowRouter.current().queryParams;
    $('.fullScreenSpin').css('display', 'inline-block');
    sideBarService.getAllJobssDataVS1(initialBaseDataLoad, 0).then(function (data) {
      addVS1Data('TJobVS1', JSON.stringify(data)).then(function (datareturn) {
        if (!isNaN(currentId.jobid)) {
          window.open('/customerscard?jobid=' + currentId.jobid + '&transTab=job', '_self');
        }

        if (!isNaN(currentId.id)) {
          window.open('/customerscard?id=' + currentId.id + '&transTab=job', '_self');
        }

      }).catch(function (err) {
        if (!isNaN(currentId.jobid)) {
          window.open('/customerscard?jobid=' + currentId.jobid + '&transTab=job', '_self');
        }

        if (!isNaN(currentId.id)) {
          window.open('/customerscard?id=' + currentId.id + '&transTab=job', '_self');
        }
      });
    }).catch(function (err) {
      if (!isNaN(currentId.jobid)) {
        window.open('/customerscard?jobid=' + currentId.jobid + '&transTab=job', '_self');
      }

      if (!isNaN(currentId.id)) {
        window.open('/customerscard?id=' + currentId.id + '&transTab=job', '_self');
      }
    });
  },
  'click .btnRefreshCrm': function () {
    let currentId = FlowRouter.current().queryParams;
    $('.fullScreenSpin').css('display', 'inline-block');
    sideBarService.getTProjectTasks().then(function (data) {
      addVS1Data('TProjectTasks', JSON.stringify(data)).then(function (datareturn) {
        if (!isNaN(currentId.jobid)) {
          window.open('/customerscard?jobid=' + currentId.jobid + '&transTab=crm', '_self');
        }
        if (!isNaN(currentId.id)) {
          window.open('/customerscard?id=' + currentId.id + '&transTab=crm', '_self');
        }
      }).catch(function (err) {
        if (!isNaN(currentId.jobid)) {
          window.open('/customerscard?jobid=' + currentId.jobid + '&transTab=crm', '_self');
        }
        if (!isNaN(currentId.id)) {
          window.open('/customerscard?id=' + currentId.id + '&transTab=crm', '_self');
        }
      });
    }).catch(function (err) {
      if (!isNaN(currentId.jobid)) {
        window.open('/customerscard?jobid=' + currentId.jobid + '&transTab=crm', '_self');
      }
      if (!isNaN(currentId.id)) {
        window.open('/customerscard?id=' + currentId.id + '&transTab=crm', '_self');
      }
    });
  },
  'click #formCheck-2': function () {
    if ($(event.target).is(':checked')) {
      $('#autoUpdate').css('display', 'none');
    } else {
      $('#autoUpdate').css('display', 'block');
    }
  },
  'click #formCheckJob-2': function (event) {
    if ($(event.target).is(':checked')) {
      $('#autoUpdateJob').css('display', 'none');
    } else {
      $('#autoUpdateJob').css('display', 'block');
    }
  },
  'click #activeChk': function (event) {
    if ($(event.target).is(':checked')) {
      $('#customerInfo').css('color', '#00A3D3');
    } else {
      $('#customerInfo').css('color', '#b7b9cc !important');
    }
  },
  'click #btnNewProject': function (event) {
    const x2 = document.getElementById("newProject");
    if (x2.style.display == "none") {
      x2.style.display = "block";
    } else {
      x2.style.display = "none";
    }
  },
  'keydown #custOpeningBalance, keydown #edtJobNumber, keydown #edtCustomerCardDiscount': function (event) {
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (event.keyCode == 65 && (event.ctrlKey == true || event.metaKey == true)) ||
      // Allow: home, end, left, right, down, up
      (event.keyCode >= 35 && event.keyCode <= 40)) {
      // let it happen, don't do anything
      return;
    }
    if (event.shiftKey == true) {
      event.preventDefault();
    }
    if ((event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode == 8 || event.keyCode == 9 ||
      event.keyCode == 37 || event.keyCode == 39 ||
      event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189) { } else {
      event.preventDefault();
    }
  },
  'click .new_attachment_btn': function (event) {
    $('#attachment-upload').trigger('click');
  },
  'click #formCheck-one': function (event) {
    if ($(event.target).is(':checked')) {
      $('.checkbox1div').css('display', 'block');
    } else {
      $('.checkbox1div').css('display', 'none');
    }
  },
  'click #formCheck-two': function (event) {
    if ($(event.target).is(':checked')) {
      $('.checkbox2div').css('display', 'block');
    } else {
      $('.checkbox2div').css('display', 'none');
    }
  },
  'click #formCheck-three': function (event) {
    if ($(event.target).is(':checked')) {
      $('.checkbox3div').css('display', 'block');
    } else {
      $('.checkbox3div').css('display', 'none');
    }
  },
  'click #formCheck-four': function (event) {
    if ($(event.target).is(':checked')) {
      $('.checkbox4div').css('display', 'block');
    } else {
      $('.checkbox4div').css('display', 'none');
    }
  },
  // add to custom field
  "click #edtSaleCustField1": function (e) {
    $("#clickedControl").val("one");
  },
  // add to custom field
  "click #edtSaleCustField2": function (e) {
    $("#clickedControl").val("two");
  },
  // add to custom field
  "click #edtSaleCustField3": function (e) {
    $("#clickedControl").val("three");
  },
  "click #edtSaleCustField4": function (e) {
    $("#clickedControl").val("four");
  },
  'click .btnOpenSettings': function (event) { },
  'click .btnSaveSettings': function (event) {
    playSaveAudio();
    setTimeout(function () {
      $('.lblCustomField1').html('');
      $('.lblCustomField2').html('');
      $('.lblCustomField3').html('');
      $('.lblCustomField4').html('');
      let getchkcustomField1 = true;
      let getchkcustomField2 = true;
      let getchkcustomField3 = true;
      let getchkcustomField4 = true;
      if ($('#formCheck-one').is(':checked')) {
        getchkcustomField1 = false;
      }
      if ($('#formCheck-two').is(':checked')) {
        getchkcustomField2 = false;
      }
      if ($('#formCheck-three').is(':checked')) {
        getchkcustomField3 = false;
      }
      if ($('#formCheck-four').is(':checked')) {
        getchkcustomField4 = false;
      }
      $('#customfieldModal').modal('toggle');
    }, delayTimeAfterSound);
  },
  'click .btnResetSettings': function (event) {
    let customerSaveID = FlowRouter.current().queryParams;
    if (!isNaN(customerSaveID.id)) {
      window.open('/customerscard?id=' + customerSaveID, '_self');
    } else if (!isNaN(customerSaveID.jobid)) {
      window.open('/customerscard?jobid=' + customerSaveID, '_self');
    } else {
      window.open('/customerscard', '_self');
    }
  },
  'change #attachment-upload': function (e) {
    let templateObj = Template.instance();
    let saveToTAttachment = false;
    let lineIDForAttachment = false;
    let uploadedFilesArray = templateObj.uploadedFiles.get();
    let myFiles = $('#attachment-upload')[0].files;
    let uploadData = utilityService.attachmentUploadTabs(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
    templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
    templateObj.attachmentCount.set(uploadData.totalAttachments);
  },
  'click .img_new_attachment_btn': function (event) {
    $('#img-attachment-upload').trigger('click');
  },
  'change #img-attachment-upload': function (e) {
    let templateObj = Template.instance();
    let saveToTAttachment = false;
    let lineIDForAttachment = false;
    let uploadedFilesArray = templateObj.uploadedFiles.get();
    let myFiles = $('#img-attachment-upload')[0].files;
    let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
    templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
    templateObj.attachmentCount.set(uploadData.totalAttachments);
  },
  'click .remove-attachment': function (event, ui) {
    let tempObj = Template.instance();
    let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
    if (tempObj.$("#confirm-action-" + attachmentID).length) {
      tempObj.$("#confirm-action-" + attachmentID).remove();
    } else {
      let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">' +
        'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
      tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
    }
    tempObj.$("#new-attachment2-tooltip").show();
  },
  'click .file-name': function (event) {
    let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
    let templateObj = Template.instance();
    let uploadedFiles = templateObj.uploadedFiles.get();
    $('#myModalAttachment').modal('hide');
    let previewFile = getPreviewFile(uploadedFiles, attachmentID);
    templateObj.uploadedFile.set(previewFile);
    $('#files_view').modal('show');
  },
  'click .confirm-delete-attachment': function (event, ui) {
    let tempObj = Template.instance();
    tempObj.$("#new-attachment2-tooltip").show();
    let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
    let uploadedArray = tempObj.uploadedFiles.get();
    let attachmentCount = tempObj.attachmentCount.get();
    $('#attachment-upload').val('');
    uploadedArray.splice(attachmentID, 1);
    tempObj.uploadedFiles.set(uploadedArray);
    attachmentCount--;
    if (attachmentCount == 0) {
      let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
      $('#file-display').html(elementToAdd);
    }
    tempObj.attachmentCount.set(attachmentCount);
    if (uploadedArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachmentTabs(uploadedArray);
    } else {
      $(".attchment-tooltip").show();
    }
  },
  'click .attachmentTab': function () {
    let templateInstance = Template.instance();
    let uploadedFileArray = templateInstance.uploadedFiles.get();
    if (uploadedFileArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachmentTabs(uploadedFileArray);
    } else {
      $(".attchment-tooltip").show();
    }
  },
  'click .new_attachment_btnJobPOP': function (event) {
    $('#attachment-uploadJobPOP').trigger('click');
  },
  'change #attachment-uploadJobPOP': function (e) {
    let templateObj = Template.instance();
    let saveToTAttachment = false;
    let lineIDForAttachment = false;
    let uploadedFilesArray = templateObj.uploadedFilesJob.get();
    let myFiles = $('#attachment-uploadJobPOP')[0].files;
    let uploadData = utilityService.attachmentUploadJob(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
    templateObj.uploadedFilesJob.set(uploadData.uploadedFilesArray);
    templateObj.attachmentCountJob.set(uploadData.totalAttachments);
  },
  'click .remove-attachmentJobPOP': function (event, ui) {
    let tempObj = Template.instance();
    let attachmentID = parseInt(event.target.id.split('remove-attachmentJobPOP-')[1]);
    if (tempObj.$("#confirm-actionJobPOP-" + attachmentID).length) {
      tempObj.$("#confirm-actionJobPOP-" + attachmentID).remove();
    } else {
      let actionElement = '<div class="confirm-actionJobPOP" id="confirm-actionJobPOP-' + attachmentID + '"><a class="confirm-delete-attachmentJobPOP btn btn-default" id="delete-attachmentJobPOP-' + attachmentID + '">' +
        'Delete</a><button class="save-to-libraryJobPOP btn btn-default">Remove & save to File Library</button></div>';
      tempObj.$('#attachment-nameJobPOP-' + attachmentID).append(actionElement);
    }
    tempObj.$("#new-attachment2-tooltipJobPOP").show();

  },
  'click .file-nameJobPOP': function (event) {
    let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-nameJobPOP-')[1]);
    let templateObj = Template.instance();
    let uploadedFiles = templateObj.uploadedFilesJob.get();
    $('#myModalAttachmentJobPOP').modal('hide');
    let previewFile = getPreviewFile(uploadedFiles, attachmentID);
    templateObj.uploadedFileJob.set(previewFile);
    $('#files_viewJobPOP').modal('show');
  },
  'click .confirm-delete-attachmentJobPOP': function (event, ui) {
    let tempObj = Template.instance();
    tempObj.$("#new-attachment2-tooltipJobPOP").show();
    let attachmentID = parseInt(event.target.id.split('delete-attachmentJobPOP-')[1]);
    let uploadedArray = tempObj.uploadedFilesJob.get();
    let attachmentCount = tempObj.attachmentCountJob.get();
    $('#attachment-uploadJobPOP').val('');
    uploadedArray.splice(attachmentID, 1);
    tempObj.uploadedFilesJob.set(uploadedArray);
    attachmentCount--;
    if (attachmentCount == 0) {
      let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
      $('#file-displayJobPOP').html(elementToAdd);
    }
    tempObj.attachmentCountJob.set(attachmentCount);
    if (uploadedArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachmentJob(uploadedArray);
    } else {
      $(".attchment-tooltipJobPOP").show();
    }
  },
  'click .attachmentTabJobPOP': function () {
    let templateInstance = Template.instance();
    let uploadedFileArray = templateInstance.uploadedFilesJob.get();
    if (uploadedFileArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachmentJob(uploadedFileArray);
    } else {
      $(".attchment-tooltipJobPOP").show();
    }
  },
  'click .new_attachment_btnJobNoPOP': function (event) {
    $('#attachment-uploadJobNoPOP').trigger('click');
  },
  'change #attachment-uploadJobNoPOP': function (e) {
    let templateObj = Template.instance();
    let saveToTAttachment = false;
    let lineIDForAttachment = false;
    let uploadedFilesArrayJob = templateObj.uploadedFilesJobNoPOP.get();
    let myFiles = $('#attachment-uploadJobNoPOP')[0].files;
    let uploadData = utilityService.attachmentUploadJobNoPOP(uploadedFilesArrayJob, myFiles, saveToTAttachment, lineIDForAttachment);
    templateObj.uploadedFilesJobNoPOP.set(uploadData.uploadedFilesArray);
    templateObj.attachmentCountJobNoPOP.set(uploadData.totalAttachments);
  },
  'click .remove-attachmentJobNoPOP': function (event, ui) {
    let tempObj = Template.instance();
    let attachmentID = parseInt(event.target.id.split('remove-attachmentJobNoPOP-')[1]);
    if (tempObj.$("#confirm-actionJobNoPOP-" + attachmentID).length) {
      tempObj.$("#confirm-actionJobNoPOP-" + attachmentID).remove();
    } else {
      let actionElement = '<div class="confirm-actionJobNoPOP" id="confirm-actionJobNoPOP-' + attachmentID + '"><a class="confirm-delete-attachmentJobNoPOP btn btn-default" id="delete-attachmentJobNoPOP-' + attachmentID + '">' +
        'Delete</a><button class="save-to-libraryJobNoPOP btn btn-default">Remove & save to File Library</button></div>';
      tempObj.$('#attachment-nameJobNoPOP-' + attachmentID).append(actionElement);
    }
    tempObj.$("#new-attachment2-tooltipJobNoPOP").show();
  },
  'click .file-nameJobNoPOP': function (event) {
    let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-nameJobNoPOP-')[1]);
    let templateObj = Template.instance();
    let uploadedFiles = templateObj.uploadedFilesJobNoPOP.get();
    let previewFile = getPreviewFile(uploadedFiles, attachmentID);
    templateObj.uploadedFileJobNoPOP.set(previewFile);
    $('#files_viewJobNoPOP').modal('show');
  },
  'click .confirm-delete-attachmentJobNoPOP': function (event, ui) {
    let tempObj = Template.instance();
    tempObj.$("#new-attachment2-tooltipJobNoPOP").show();
    let attachmentID = parseInt(event.target.id.split('delete-attachmentJobNoPOP-')[1]);
    let uploadedArray = tempObj.uploadedFilesJobNoPOP.get();
    let attachmentCount = tempObj.attachmentCountJobNoPOP.get();
    $('#attachment-uploadJobNoPOP').val('');
    uploadedArray.splice(attachmentID, 1);
    tempObj.uploadedFilesJobNoPOP.set(uploadedArray);
    attachmentCount--;
    if (attachmentCount == 0) {
      let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
      $('#file-displayJobNoPOP').html(elementToAdd);
    }
    tempObj.attachmentCountJobNoPOP.set(attachmentCount);
    if (uploadedArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachmentJobNoPOP(uploadedArray);
    } else {
      $(".attchment-tooltipJobNoPOP").show();
    }
  },
  'click .attachmentTabJobNoPOP': function () {
    let templateInstance = Template.instance();
    let uploadedFileArray = templateInstance.uploadedFilesJobNoPOP.get();
    if (uploadedFileArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachmentJobNoPOP(uploadedFileArray);
    } else {
      $(".attchment-tooltipJobNoPOP").show();
    }
  },
  'change .customerTypeSelect': function (event) {
    const custName = $('.customerTypeSelect').children("option:selected").val();
    if (custName == "newCust") {
      $('#myModalClientType').modal();
      $(this).prop("selected", false);
    }
  },
  'click #btnNewJob': function (event) {
    let templateObject = Template.instance();
    templateObject.getAllJobsIds();
  },
  'click .btnNewCustomer': function (event) {
    window.open('/customerscard', '_self');
  },
  'click .btnView': function (e) {
    const btnView = document.getElementById("btnView");
    const btnHide = document.getElementById("btnHide");
    const displayList = document.getElementById("displayList");
    if (displayList.style.display == "none") {
      displayList.style.display = "flex";
      $("#displayInfo").removeClass("col-12");
      $("#displayInfo").addClass("col-9");
      btnView.style.display = "none";
      btnHide.style.display = "flex";
    } else {
      displayList.style.display = "none";
      $("#displayInfo").removeClass("col-9");
      $("#displayInfo").addClass("col-12");
      btnView.style.display = "flex";
      btnHide.style.display = "none";
    }
  },
  'click .btnDeleteCustomer': function (event) {
    playDeleteAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');

      let currentId = FlowRouter.current().queryParams;
      let objDetails = '';
      if (!isNaN(currentId.id)) {
        let currentCustomer = parseInt(currentId.id);
        objDetails = {
          type: "TCustomerEx",
          fields: {
            ID: currentCustomer,
            Active: false
          }
        };
        contactService.saveCustomerEx(objDetails).then(function (objDetails) {
          FlowRouter.go('/customerlist?success=true');
        }).catch(function (err) {
          swal({
            title: 'Oooops...',
            text: err,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
          }).then((result) => {
            if (result.value) { } else if (result.dismiss == 'cancel') {

            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });
      } else {
        FlowRouter.go('/customerlist?success=true');
      }
      $('#deleteCustomerModal').modal('toggle');
    }, delayTimeAfterSound);
  },
  'click .btnCustomerTask, click .btnJobTask': function (event) {
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id) || !isNaN(currentId.jobid)) {
      let customerID = parseInt(currentId.id);
      $("#btnAddLine").trigger("click");
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnCustomerEmail': function (event) {
    playEmailAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      let currentId = FlowRouter.current().queryParams;
      if (!isNaN(currentId.id)) {
        let customerID = parseInt(currentId.id);
        $('#referenceLetterModal').modal('toggle');
        $('.fullScreenSpin').css('display', 'none');
      } else {
        $('.fullScreenSpin').css('display', 'none');
      }
    }, delayTimeAfterSound);
  },
  'click .btnCustomerAppointment': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id)) {
      let customerID = parseInt(currentId.id);
      FlowRouter.go('/appointments?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnCustomerQuote': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id)) {
      let customerID = parseInt(currentId.id);
      FlowRouter.go('/quotecard?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnCustomerSalesOrder': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id)) {
      let customerID = parseInt(currentId.id);
      FlowRouter.go('/salesordercard?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnCustomerInvoice': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id)) {
      let customerID = parseInt(currentId.id);
      FlowRouter.go('/invoicecard?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnCustomerRefund': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.id)) {
      let customerID = parseInt(currentId.id);
      FlowRouter.go('/refundcard?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnJobEmail': function (event) {
    playEmailAudio();
    setTimeout(function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      let currentId = FlowRouter.current().queryParams;
      if (!isNaN(currentId.jobid)) {
        let customerID = parseInt(currentId.jobid);
        FlowRouter.go('/crmoverview?customerid=' + customerID);
      } else {
        $('.fullScreenSpin').css('display', 'none');
      }
    }, delayTimeAfterSound);
  },
  'click .btnJobAppointment': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.jobid)) {
      let customerID = parseInt(currentId.jobid);
      FlowRouter.go('/appointments?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnJobQuote': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.jobid)) {
      let customerID = parseInt(currentId.jobid);
      FlowRouter.go('/quotecard?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnJobSalesOrder': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.jobid)) {
      let customerID = parseInt(currentId.jobid);
      FlowRouter.go('/salesordercard?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnJobInvoice': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.jobid)) {
      let customerID = parseInt(currentId.jobid);
      FlowRouter.go('/invoicecard?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  'click .btnJobRefund': function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let currentId = FlowRouter.current().queryParams;
    if (!isNaN(currentId.jobid)) {
      let customerID = parseInt(currentId.jobid);
      FlowRouter.go('/refundcard?customerid=' + customerID);
    } else {
      $('.fullScreenSpin').css('display', 'none');
    }
  },
  "click .btnSaveAddTask": function (e) {
    playSaveAudio();
    let templateObject = Template.instance();
    setTimeout(function () {
      let task_name = $("#add_task_name").val();
      let task_description = $("#add_task_description").val();
      let subTaskID = $("#txtCrmSubTaskID").val();

      let due_date = $(".crmEditDatepicker").val();
      due_date = due_date ? moment(due_date.split('/')[2] + '-' + due_date.split('/')[1] + '-' + due_date.split('/')[0]).format("YYYY-MM-DD hh:mm:ss") : moment().format("YYYY-MM-DD hh:mm:ss");

      let priority = 0;
      priority = $("#chkPriorityAdd1").prop("checked") ? 1 : $("#chkPriorityAdd2").prop("checked") ? 2 : $("#chkPriorityAdd3").prop("checked") ? 3 : 0;

      if (task_name === "") {
        swal("Task name is not entered!", "", "warning");
        return;
      }
      $(".fullScreenSpin").css("display", "inline-block");
      let projectID = $("#addProjectID").val() ? $("#addProjectID").val() : 11;
      projectID = $("#editProjectID").val() ? $("#editProjectID").val() : projectID;

      let selected_lbls = [];
      $("#addTaskLabelWrapper input:checked").each(function () {
        selected_lbls.push($(this).attr("name"));
      });

      let employeeID = localStorage.getItem("mySessionEmployeeLoggedID");
      let employeeName = localStorage.getItem("mySessionEmployee");

      let assignId = $('#assignedID').val();
      let assignName = $('#add_assigned_name').val();

      let contactID = $('#contactID').val();
      let contactName = $('#add_contact_name').val();
      let contactType = $('#contactType').val();
      let customerID = 0;
      let leadID = 0;
      let supplierID = 0;
      if (contactType == 'Customer') {
        customerID = contactID
      } else if (contactType == 'Lead') {
        leadID = contactID
      } else if (contactType == 'Supplier') {
        supplierID = contactID
      }

      let addObject = {
        TaskName: task_name,
        TaskDescription: task_description,
        Completed: false,
        ProjectID: projectID,
        due_date: due_date,
        priority: priority,
        EnteredByID: parseInt(employeeID),
        EnteredBy: employeeName,
        CustomerID: customerID,
        LeadID: leadID,
        SupplierID: supplierID,
        AssignID: assignId,
        AssignName: assignName,
        ContactName: contactName
      }

      if (subTaskID) {
        var objDetails = {
          type: "Tprojecttasks",
          fields: {
            ID: subTaskID,
            subtasks: [{
              type: "Tprojecttask_subtasks",
              fields: addObject,
            }]
          },
        };
      } else {
        var objDetails = {
          type: "Tprojecttasks",
          fields: addObject,
        };
      }

      crmService.saveNewTask(objDetails).then(function (res) {
        if (res.fields.ID) {
          if (moment(due_date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) { }

          $(".btnAddSubTask").css("display", "block");
          $(".newTaskRow").css("display", "none");
          $(".addTaskModal").css("display", "none");

          $("#chkPriorityAdd0").prop("checked", false);
          $("#chkPriorityAdd1").prop("checked", false);
          $("#chkPriorityAdd2").prop("checked", false);
          $("#chkPriorityAdd3").prop("checked", false);

          $("#newTaskModal").modal("hide");
          if (subTaskID) {
            crmService.getTaskDetail(subTaskID).then(function (data) {
              $(".fullScreenSpin").css("display", "none");
              if (data.fields.ID == subTaskID) {
                let selected_record = data.fields;

                if (selected_record.subtasks) {

                  let newSubTaskID = 0;
                  if (Array.isArray(selected_record.subtasks)) {
                    templateObject.subTasks.set(selected_record.subtasks)
                    newSubTaskID = selected_record.subtasks[selected_record.subtasks.length - 1].fields.ID
                  }

                  if (typeof selected_record.subtasks == 'object') {
                    let arr = [];
                    arr.push(selected_record.subtasks)
                    templateObject.subTasks.set(arr)
                    newSubTaskID = selected_record.subtasks.fields.ID

                  }

                  try {
                    // add labels to New task
                    // tempcode until api is updated
                    // current label and task is 1:1 relationship
                    selected_lbls.forEach((lbl) => {
                      crmService.updateLabel({
                        type: "Tprojecttask_TaskLabel",
                        fields: {
                          ID: lbl,
                          TaskID: newSubTaskID,
                        },
                      }).then(function (data) {
                        templateObject.getTProjectList();
                      });
                    });
                    // tempcode until api is updated
                  } catch (error) {
                    swal(error, "", "error");
                  }
                } else {
                  let sutTaskTable = $('#tblSubtaskDatatable').DataTable();
                  sutTaskTable.clear().draw();
                }

              }

            }).catch(function (err) {
              $(".fullScreenSpin").css("display", "none");
              swal(err, "", "error");
              return;
            });
          }
        }
        templateObject.getTProjectList();

        $(".btnRefresh").addClass('btnSearchAlert');

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
    }, delayTimeAfterSound);
  },
  "click #btnAddLine, click #btnAddLineTask": function (e) {
    let tokenid = "random";
    let currentDate = new Date();
    let completeDate = new Date();
    currentDate = moment(currentDate).subtract(-1, "days").format("DD/MM/YYYY");
    completeDate = moment(completeDate).subtract(-3, "days").format("DD/MM/YYYY");

    var rowData = `<tr class="dnd-moved" id="${tokenid}">
            <td class="colTaskId hiddenColumn dtr-control" tabindex="0">
                ${tokenid}
            </td>
            <td class="colDate">${currentDate}</td>
            <td class="colType">Task</td>
            <td class="colTaskName" contenteditable="true"></td>
            <td class="colTaskDesc" contenteditable="true"></td>
            <td class="colCompletedBy" style="padding:5px!important">
                <div class="input-group date" style="width: 160px;">
                    <input type="text" class="form-control" id="completeDate" name="completeDate" >
                    <div class="input-group-addon">
                        <span class="glyphicon glyphicon-th"></span>
                    </div>
                </div>
            </td>
            <td class="colCompleteTask" align="right">
                <span class="btnRemoveLine"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0" style="margin-top:0!important"><i class="fa fa-remove"></i></button></span>
            </td>
        </tr>`;

    $("#tblCustomerCrmListWithDate tbody").prepend(rowData);

    $("#completeDate").datepicker({
      showOn: "button",
      buttonText: "Show Date",
      buttonImageOnly: true,
      buttonImage: "/img/imgCal2.png",
      dateFormat: "dd/mm/yy",
      showOtherMonths: true,
      selectOtherMonths: true,
      changeMonth: true,
      changeYear: true,
      yearRange: "-90:+10",
      onSelect: function (formated, dates) {
      },
      onChangeMonthYear: function (year, month, inst) {
        // Set date to picker
        $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
      }
    });
    $("#completeDate").datepicker("setDate", completeDate);

    $(".btnAddLineGroup button").attr("disabled", true);
    $(".btnCustomerTask").attr("disabled", true);
    $(".btnJobTask").attr("disabled", true);

    $("#" + tokenid + " .colTaskName").focus();

    $("#frmEditTaskModal")[0].reset();
    $("#txtCrmTaskID").val("");
    $("#txtCrmProjectID").val("");
    $("#txtCrmSubTaskID").val("");
    $("#addProjectID").val("");
    $("#contactID").val("");
    $('#assignedID').val("");

    let url = FlowRouter.current().path;
    let getemp_id = url.split('?id=');
    let currentEmployee = getemp_id[getemp_id.length - 1];
    let TCustomerID = 0;
    if (getemp_id[1]) {
      TCustomerID = parseInt(currentEmployee);
    }
    else {
      getemp_id = url.split('?jobid=');
      currentEmployee = getemp_id[getemp_id.length - 1];
      if (getemp_id[1]) {
        TCustomerID = parseInt(currentEmployee);
      }
    }

    $("#contactID").val(TCustomerID);
    $('#contactType').val('Customer')
    $('#crmEditSelectLeadList').val($('#edtCustomerCompany').val());
    $('#contactEmailClient').val($('#edtCustomerEmail').val());
    $('#contactPhoneClient').val($('#edtCustomerPhone').val());
    $('#taskmodalDuedate').val(moment().format("DD/MM/YYYY"));
  },
  "click .btnRemoveLine": function (event) {
    $(event.target).closest("tr").remove();
    $(".btnAddLineGroup button").attr("disabled", false);
    $(".btnCustomerTask").attr("disabled", false);
    $(".btnJobTask").attr("disabled", false);
    event.preventDefault();
  },
  "click #customer_transctionList_invoices_toggle":function(event){
      let templateObject = Template.instance();
      let isChecked = $(event.target).is(':checked');
      if(isChecked){
          templateObject.checkedInvoices.set(true)
      }else{
          templateObject.checkedInvoices.set(false)
      }
  },
  "click #customer_transctionList_appointments_toggle":function(event){
      let templateObject = Template.instance();
      let isChecked = $(event.target).is(':checked');
      if(isChecked){
          templateObject.checkedAppointments.set(true)
      }else{
          templateObject.checkedAppointments.set(false)
      }
  },
  "click #customer_transctionList_quotes_toggle":function(event){
      let templateObject = Template.instance();
      let isChecked = $(event.target).is(':checked');
      if(isChecked){
          templateObject.checkedQuotes.set(true)
      }else{
          templateObject.checkedQuotes.set(false)
      }
  },
  "click #customer_transctionList_sales_orders_toggle":function(event){
      let templateObject = Template.instance();
      let isChecked = $(event.target).is(':checked');
      if(isChecked){
          templateObject.checkedSalesOrders.set(true)
      }else{
          templateObject.checkedSalesOrders.set(false)
      }
  },
  "change #customer_transctionList_sales_orders_toggle": function(event) {
    const templateObject = Template.instance();
    templateObject.checkedSales.set(event.target.checked)
  },
  "click .mainTab" : function(event) {
    const tabID = $(event.target).data('id');
    Template.instance().currentTab.set(tabID);
  }
});

Template.customerscard.helpers({
    record: () => {
      let temp = Template.instance().records.get();
      return temp;
    },
    phoneCodeList: () => {
        return Template.instance().phoneCodeData.get();
    },
    countryList: () => {
        return Template.instance().countryData.get();
    },
    correspondences: () => {
        return Template.instance().correspondences.get();
    },
    customerrecords: () => {
        return Template.instance().customerrecords.get().sort(function(a, b) {
            if (a.company == 'NA') {
                return 1;
            } else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.saledate == 'NA') {
                return 1;
            } else if (b.saledate == 'NA') {
                return -1;
            }
            return (a.saledate.toUpperCase() > b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecordsjob: () => {
        return Template.instance().datatablerecordsjob.get().sort(function(a, b) {
            if (a.company == 'NA') {
                return 1;
            } else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    tableheaderrecordsjob: () => {
        return Template.instance().tableheaderrecordsjob.get();
    },
    crmRecords: () => {
        return Template.instance().crmRecords.get().sort(function(a, b) {
            if (a.id == 'NA') {
                return 1;
            } else if (b.id == 'NA') {
                return -1;
            }
            return (a.id > b.id) ? 1 : -1;
        });
    },
    crmTableheaderRecords: () => {
        return Template.instance().crmTableheaderRecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: localStorage.getItem('mycloudLogonID'), PrefName: 'tblSalesOverview' });
    },
    currentdate: () => {
        let currentDate = new Date();
        return moment(currentDate).format("DD/MM/YYYY");
    },
    isJob: () => {
        let parentIsJob = Template.parentData(0).isJob;
        if (parentIsJob) {
            return parentIsJob
        } else {
            return Template.instance().isJob.get();
        }
    },
    preferredPaymentList: () => {
        return Template.instance().preferredPaymentList.get();
    },
    termsList: () => {
        return Template.instance().termsList.get();
    },
    deliveryMethodList: () => {
        return Template.instance().deliveryMethodList.get();
    },
    clienttypeList: () => {
        return Template.instance().clienttypeList.get().sort(function(a, b) {
            if (a == 'NA') {
                return 1;
            } else if (b == 'NA') {
                return -1;
            }
            return (a.toUpperCase() > b.toUpperCase()) ? 1 : -1;
        });
    },
    taxCodeList: () => {
        return Template.instance().taxCodeList.get();
    },
    uploadedFiles: () => {
        return Template.instance().uploadedFiles.get();
    },
    attachmentCount: () => {
        return Template.instance().attachmentCount.get();
    },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
    uploadedFilesJob: () => {
        return Template.instance().uploadedFilesJob.get();
    },
    attachmentCountJob: () => {
        return Template.instance().attachmentCountJob.get();
    },
    uploadedFileJob: () => {
        return Template.instance().uploadedFileJob.get();
    },
    uploadedFilesJobNoPOP: () => {
        return Template.instance().uploadedFilesJobNoPOP.get();
    },
    attachmentCountJobNoPOP: () => {
        return Template.instance().attachmentCountJobNoPOP.get();
    },
    uploadedFileJobNoPOP: () => {
        return Template.instance().uploadedFileJobNoPOP.get();
    },
    currentAttachLineID: () => {
        return Template.instance().currentAttachLineID.get();
    },
    contactCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: localStorage.getItem('mycloudLogonID'), PrefName: 'customerscard' });
    },
    isSameAddress: () => {
        return Template.instance().isSameAddress.get();
    },
    isJobSameAddress: () => {
        return Template.instance().isJobSameAddress.get();
    },
    isMobileDevices: () => {
        let isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }
        return isMobile;
    },
    setLeadStatus: (status) => status || 'Unqualified',
    formatPrice(amount) {
        let utilityService = new UtilityService();
        if (isNaN(amount) || !amount) {
            amount = (amount === undefined || amount === null || amount.length === 0) ? 0 : amount;
            amount = (amount) ? Number(amount.replace(/[^0-9.-]+/g, "")) : 0;
        }
        return utilityService.modifynegativeCurrencyFormat(amount) || 0.00;
    },
    checkedAppointments: () => {
        return Template.instance().checkedAppointments.get();
    },
    checkedQuotes: () => {
        return Template.instance().checkedQuotes.get();
    },
    checkedSalesOrders: () => {
        return Template.instance().checkedSalesOrders.get();
    },
    checkedInvoices: () => {
        return Template.instance().checkedInvoices.get();
    },
    checkedSales: () => {
      return Template.instance().checkedSales.get();
    },
    currentTab: () => {
      const tab = Template.instance().currentTab.get();
      if (tab == "") return "tab-2";
      return tab;
    }
});

Template.registerHelper('equals', function (a, b) {
  return a === b;
});
Template.registerHelper('notEquals', function (a, b) {
  return a != b;
});

function getPreviewFile(uploadedFiles, attachmentID) {
  let previewFile = {};
  let input = uploadedFiles[attachmentID].fields.Description;
  previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
  previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
  let type = uploadedFiles[attachmentID].fields.Description;
  if (type == 'application/pdf') {
    previewFile.class = 'pdf-class';
  } else if (type == 'application/msword' || type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    previewFile.class = 'docx-class';
  } else if (type == 'application/vnd.ms-excel' || type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    previewFile.class = 'excel-class';
  } else if (type == 'application/vnd.ms-powerpoint' || type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    previewFile.class = 'ppt-class';
  } else if (type == 'application/vnd.oasis.opendocument.formula' || type == 'text/csv' || type == 'text/plain' || type == 'text/rtf') {
    previewFile.class = 'txt-class';
  } else if (type == 'application/zip' || type == 'application/rar' || type == 'application/x-zip-compressed' || type == 'application/x-zip,application/x-7z-compressed') {
    previewFile.class = 'zip-class';
  } else {
    previewFile.class = 'default-class';
  }
  previewFile.image = type.split('/')[0] == 'image';
  return previewFile;
}


function removeAttachment(suffix, event) {
  let tempObj = Template.instance();
  let attachmentID = parseInt(event.target.id.split('remove-attachment' + suffix + '-')[1]);
  if (tempObj.$("#confirm-action" + suffix + "-" + attachmentID).length) {
    tempObj.$("#confirm-action" + suffix + "-" + attachmentID).remove();
  } else {
    let actionElement = '<div class="confirm-action' + suffix + '" id="confirm-action' + suffix + '-' + attachmentID + '"><a class="confirm-delete-attachment' + suffix + ' btn btn-default" id="delete-attachment' + suffix + '-' + attachmentID + '">' +
      'Delete</a><button class="save-to-library' + suffix + ' btn btn-default">Remove & save to File Library</button></div>';
    tempObj.$('#attachment-name' + suffix + '-' + attachmentID).append(actionElement);
  }
  tempObj.$("#new-attachment2-tooltip" + suffix).show();
}

function openEditTaskModals(id, type) {
  // let catg = e.target.dataset.catg;
  let templateObject = Template.instance();
  // $("#editProjectID").val("");

  $("#txtCrmSubTaskID").val(id);

  $(".fullScreenSpin").css("display", "inline-block");
  // get selected task detail via api
  getVS1Data("TCRMTaskList").then(async function (dataObject) {
    if (dataObject.length == 0) {
      // crmService.getAllTasksByContactName().then(async function(data) {
      //     if (data.tprojecttasks.length > 0) {
      //         addVS1Data("TCRMTaskList", JSON.stringify(data));
      //         templateObject.taskrecords.set(data.tprojecttasks);
      //     }
      // }).catch(function(err) {
      // })
    } else {
      let data = JSON.parse(dataObject[0].data);
      let taskrecords = data.tprojecttasks;
      for (var i = 0; i < taskrecords.length; i++) {
        if (taskrecords[i].fields.ID == id) {
          $(".fullScreenSpin").css("display", "none");
          let selected_record = taskrecords[i].fields;

          $("#txtCrmTaskID").val(selected_record.ID);
          $("#txtCrmProjectID").val(selected_record.ProjectID);
          $("#txtCommentsDescription").val("");

          $(".editTaskDetailName").val(selected_record.TaskName);
          $(".editTaskDetailDescription").val(selected_record.TaskDescription);
          // tempcode check if AssignedName is set in selected_record
          let employeeName = selected_record.AssignName ? selected_record.AssignName : localStorage.getItem("mySessionEmployee");
          let assignId = selected_record.AssignID ? selected_record.AssignID : localStorage.getItem("mySessionEmployeeLoggedID");
          $('#crmEditSelectEmployeeList').val(employeeName);
          $('#assignedID').val(assignId)
          contactService.getOneEmployeeDataEx(assignId).then(function (empDetailInfo) {
            $('#contactEmailUser').val(empDetailInfo.fields.Email);
            $('#contactPhoneUser').val(empDetailInfo.fields.Phone);
          }).catch(function (err) { });
          $("#contactEmailClient").val(selected_record.ContactEmail);
          $("#contactPhoneClient").val(selected_record.ContactPhone);
          $("#contactEmailUser").val(selected_record.AssignEmail);
          $("#contactPhoneUser").val(selected_record.AssignPhone);

          let colClientName = selected_record.ContactName;
          $('#crmEditSelectLeadList').val(colClientName);
          if (selected_record.CustomerID) {
            $('#contactID').val(selected_record.CustomerID)
            $('#contactType').val('Customer')

            if (selected_record.ContactEmail == "" && selected_record.ContactPhone == "") {
              contactService.getOneEmployeeDataEx(selected_record.CustomerID).then(function (empDetailInfo) {
                $('#contactEmailClient').val(empDetailInfo.fields.Email);
                $('#contactPhoneClient').val(empDetailInfo.fields.Phone);
              }).catch(function (err) {

              });
            }
          } else if (selected_record.LeadID) {
            $('#contactID').val(selected_record.LeadID)
            $('#contactType').val('Lead')

            if (selected_record.ContactEmail == "" && selected_record.ContactPhone == "") {
              contactService.getOneLeadDataEx(selected_record.LeadID).then(function (empDetailInfo) {
                $('#contactEmailClient').val(empDetailInfo.fields.Email);
                $('#contactPhoneClient').val(empDetailInfo.fields.Phone);
              }).catch(function (err) {

              });
            }
          } else {
            $('#contactID').val(selected_record.SupplierID)
            $('#contactType').val('Supplier')
            if (selected_record.SupplierID) {
              if (selected_record.ContactEmail == "" && selected_record.ContactPhone == "") {
                contactService.getOneSupplierDataEx(selected_record.SupplierID).then(function (empDetailInfo) {
                  $('#contactEmailClient').val(empDetailInfo.fields.Email);
                  $('#contactPhoneClient').val(empDetailInfo.fields.Phone);
                }).catch(function (err) {

                });
              }
            }
          }

          let projectName = selected_record.ProjectName == "Default" ? "All Tasks" : selected_record.ProjectName;

          if (selected_record.Completed) {
            $('#chkComplete_taskEdit').prop("checked", true);
          } else {
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

          $("#addProjectID").val(selected_record.ProjectID);
          $("#taskDetailModalCategoryLabel").val(projectName);

          $("#taskmodalNameLabel").html(selected_record.TaskName);
          $(".activityAdded").html("Added on " + moment(selected_record.MsTimeStamp).format("MMM D h:mm A"));
          let due_date = selected_record.due_date ? moment(selected_record.due_date).format("DD/MM/YYYY") : "";
          let date_component = due_date;

          $("#taskmodalDuedate").val(date_component);
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
                $(".taskModalActionLableDropdown").css("color", selected_record.TaskLabel.fields.Color);
            } else {
                selected_record.TaskLabel.forEach((lbl) => {
                    taskmodalLabels +=
                        `<span class="taskTag"><i class="fas fa-tag" style="color:${lbl.fields.Color};"></i><a class="taganchor filterByLabel" href="" data-id="${lbl.fields.ID}">` +
                        lbl.fields.TaskLabelName +
                        "</a></span> ";
                    $("#detail_label_" + lbl.fields.ID).prop("checked", true);
                    $(".taskModalActionLableDropdown").css("color", lbl.fields.Color);
                });
                taskmodalLabels = taskmodalLabels.slice(0, -2);
            }
          }
          else{
              $(".taskModalActionLableDropdown").css("color", "#858796");
          }          
          $("#taskmodalLabels").html(taskmodalLabels);
          let subtasks = "";
          if (selected_record.subtasks) {
            if (Array.isArray(selected_record.subtasks)) {
              templateObject.subTasks.set(selected_record.subtasks)
            }

            if (typeof selected_record.subtasks == 'object') {
              let arr = [];
              arr.push(selected_record.subtasks)
              templateObject.subTasks.set(arr)
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
            dateFormat: "dd/mm/yy",
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+10",
            onSelect: function (dateText, inst) {
              let task_id = inst.id;
              $(".crmDatepicker").val(dateText);

              templateObject.updateTaskSchedule(task_id, new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay));
            },
            onChangeMonthYear: function (year, month, inst) {
              // Set date to picker
              $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
            }
          });
          let currentDate = selected_record.due_date ? new Date(selected_record.due_date) : new Date();
          let begunDate = moment(currentDate).format("DD/MM/YYYY");
          $(".crmDatepicker").val(begunDate);

        }
      }
    }
  }).catch(function (err) {
    // crmService.getAllTasksByContactName().then(async function(data) {
    //     if (data.tprojecttasks.length > 0) {
    //         addVS1Data("TCRMTaskList", JSON.stringify(data));
    //         templateObject.taskrecords.set(data.tprojecttasks);
    //     }
    // }).catch(function(err) {
    // })
  });
}
