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
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.payrollleave.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.datatablerecords1 = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.timesheetrecords = new ReactiveVar([]);
  templateObject.jobsrecords = new ReactiveVar([]);
  templateObject.selectedFile = new ReactiveVar();
});

Template.payrollleave.onRendered(function () {
  // $('#tblPayleaveToReview').DataTable();
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
      setTimeout(function () {
        MakeNegative();
      }, 100);
    },
    language: {
      search: "",
      searchPlaceholder: "Search List..."
    },
    fnInitComplete: function () {
      $("<button class='btn btn-primary btnRefreshJobs' type='button' id='btnRefreshJobs' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblJoblist_filter");
    }
  });
});

Template.payrollleave.events({});

Template.payrollleave.helpers({});
