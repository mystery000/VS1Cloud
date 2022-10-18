import {ContactService} from "../contacts/contact-service";
import {ReactiveVar} from "meteor/reactive-var";
import {CoreService} from "../js/core-service";
import {UtilityService} from "../utility-service";
import {ProductService} from "../product/product-service";
import XLSX from "xlsx";
import {SideBarService} from "../js/sidebar-service";
import "jquery-editable-select";
import draggableCharts from "../js/Charts/draggableCharts";
import resizableCharts from "../js/Charts/resizableCharts";
import Tvs1ChartDashboardPreference from "../js/Api/Model/Tvs1ChartDashboardPreference";
import ChartsApi from "../js/Api/ChartsApi";
import Tvs1chart from "../js/Api/Model/Tvs1Chart";
import ChartsEditor from "../js/Charts/ChartsEditor";
import Tvs1ChartDashboardPreferenceField from "../js/Api/Model/Tvs1ChartDashboardPreferenceField";
import ApiService from "../js/Api/Module/ApiService";
import LoadingOverlay from "../LoadingOverlay";
import PayRun from "../js/Api/Model/PayRun";
import CachedHttp from "../lib/global/CachedHttp";
import erpObject from "../lib/global/erp-objects";
import {EmployeeFields} from "../js/Api/Model/Employee";
import {map} from "jquery";
import GlobalFunctions from "../GlobalFunctions";
import moment from "moment";
import Datehandler from "../DateHandler";
import EmployeePayrollApi from "../js/Api/EmployeePayrollApi";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.payrollleave.onCreated(function () {
  this.leaveRequests = new ReactiveVar([]);
  this.leaveRequestFiltered = new ReactiveVar([]);
  this.employees = new ReactiveVar([]);
});

Template.payrollleave.onRendered(function () {
  this.loadLeaves = async () => {
    const employees = await this.employees.get();
    let data = await CachedHttp.get("TLeavRequest", async () => {
      const employeePayrolApis = new EmployeePayrollApi();
      // now we have to make the post request to save the data in database
      const employeePayrolEndpoint = employeePayrolApis.collection.findByName(employeePayrolApis.collectionNames.TLeavRequest);

      employeePayrolEndpoint.url.searchParams.append("ListType", "'Detail'");
      const employeePayrolEndpointResponse = await employeePayrolEndpoint.fetch(); // here i should get from database all charts to be displayed

      if (employeePayrolEndpointResponse.ok == true) {
        const employeePayrolEndpointJsonResponse = await employeePayrolEndpointResponse.json();
        return employeePayrolEndpointJsonResponse;
      }
      return null;
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      validate: cachedResponse => {
        return true;
      }
    });

    console.log(employees);
    const response = data.response;
    const leaves = response.tleavrequest.map(e => {
      return {
        ...e.fields,
        Employee: employees.find(employee => employee.ID == e.fields.EmployeeID),
        isApproved: e.fields.Status == "Approved"
      };
    });

    console.log("leaves", leaves);

    this.leaveRequests.set(leaves);
  };

  this.loadLeavesHistory = async (refreshTable = false) => {
    const leaves = this.leaveRequests.get();

    const currentDate = moment();
    let allPassedLeaves = leaves.filter(leave => moment(leave.StartDate).isBefore(currentDate));
    await this.leaveRequestFiltered.set(allPassedLeaves);
    if (refreshTable) 
      this.dataTableSetup(refreshTable);
    };
  
  this.loadLeavesToReview = async (refreshTable = false) => {
    const leaves = this.leaveRequests.get();
    const currentDate = moment();

    let allFutureLeaves = leaves.filter(leave => moment(leave.StartDate).isAfter(currentDate));
    let toReview = allFutureLeaves.filter(leave => leave.Status != "Approved");
    await this.leaveRequestFiltered.set(toReview);
    if (refreshTable) 
      this.dataTableSetup(refreshTable);
    };
  
  this.loadUpComingLeaves = async (refreshTable = false) => {
    const leaves = this.leaveRequests.get();
    const currentDate = moment();

    let allFutureLeaves = leaves.filter(leave => moment(leave.StartDate).isAfter(currentDate));
    let upComingLeaves = allFutureLeaves.filter(leave => leave.Status == "Approved");
    await this.leaveRequestFiltered.set(upComingLeaves);

    if (refreshTable) 
      this.dataTableSetup(refreshTable);
    };
  
  this.loadDefaultScreen = async () => {
    await this.loadLeavesToReview();
  };

  this.loadEmployees = async (refresh = false) => {
    let data = await CachedHttp.get(erpObject.TEmployee, async () => {
      return await new ContactService().getAllEmployees();
    }, {
      useIndexDb: true,
      fallBackToLocal: true,
      useLocalStorage: false,
      forceOverride: refresh,
      validate: cachedResponse => {
        return true;
      }
    });
    data = data.response;

    let employees = data.temployee.map(e => e.fields);

    this.employees.set(employees);
  };

  this.dataTableSetup = (destroy = false) => {
    if (destroy) {
      $("#tblPayleaveToReview").DataTable().destroy();
    }

    // $('#tblPayleaveToReview').DataTable();
    setTimeout(() => {
      $("#tblPayleaveToReview").DataTable({
        sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        buttons: [
          {
            extend: "csvHtml5",
            text: "",
            download: "open",
            className: "btntabletocsv hiddenColumn",
            filename: "joboverview_" + moment().format(),
            orientation: "portrait",
            exportOptions: {
              columns: ":visible"
            }
          }, {
            extend: "print",
            download: "open",
            className: "btntabletopdf hiddenColumn",
            text: "",
            title: "Customer List",
            filename: "Job List - " + moment().format(),
            exportOptions: {
              columns: ":visible",
              stripHtml: false
            }
          }, {
            extend: "excelHtml5",
            title: "",
            download: "open",
            className: "btntabletoexcel hiddenColumn",
            filename: "Job List - " + moment().format(),
            orientation: "portrait",
            exportOptions: {
              columns: ":visible"
            }
          }
        ],
        select: true,
        destroy: true,
        colReorder: true,
        // bStateSave: true,
        // rowId: 0,
        pageLength: initialDatatableLoad,
        lengthMenu: [
          [
            initialDatatableLoad, -1
          ],
          [
            initialDatatableLoad, "All"
          ]
        ],
        info: true,
        responsive: true,
        order: [
          [0, "asc"]
        ],
        action: function () {
          $("#tblJoblist").DataTable().ajax.reload();
        },
        fnDrawCallback: function (oSettings) {
          // setTimeout(function () {
          //   MakeNegative();
          // }, 100);
        },
        language: {
          search: "",
          searchPlaceholder: "Search List..."
        },
        fnInitComplete: function () {
          $("<button class='btn btn-primary btnRefreshJobs' type='button' id='btnRefreshJobs' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblJoblist_filter");
        }
      });
    }, 100);
  };

  this.editLeave = async (id) => {
    console.log('edit leave');

  }

  this.initPage = async () => {
    LoadingOverlay.show();

    await this.loadEmployees();
    await this.loadLeaves();
    await this.loadDefaultScreen();

    this.dataTableSetup();

    LoadingOverlay.hide();
  };

  this.initPage();
});

Template.payrollleave.events({
  "click #upcomingBtn": (e, ui) => {
    ui.loadUpComingLeaves(true);
  },
  "click #historyBtn": (e, ui) => {
    ui.loadLeavesHistory(true);
  },
  "click #toReviewBtn": (e, ui) => {
    ui.loadLeavesToReview(true);
  },
  "click #tblPayleaveToReview tbody tr": (e, ui) => {
    console.log(e);
    if(e.target.nodeName != "BUTTON" || e.target.nodeName != "A") {
      $('#newLeaveRequestModal').modal('show');
      const id = $(e.currentTarget).attr('leave-id');
      ui.editLeave(id);
    }
  }
});

Template.payrollleave.helpers({
  leaveRequests: () => {
    return Template.instance().leaveRequests.get();
  },
  leaveRequestFiltered: () => {
    return Template.instance().leaveRequestFiltered.get();
  },
  formatDate: date => moment(date).format("Do MMM YYYY")
});
