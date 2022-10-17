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
  this.leaveRequest = new ReactiveVar([]);

  this.leaveRequestToReview = new ReactiveVar([]);
  this.leaveRequestUpComming = new ReactiveVar([]);

  this.leaveRequestHistory = new ReactiveVar([]);
});

Template.payrollleave.onRendered(function () {
  console.log("payroll leave");
  this.loadLeaves = async () => {
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

    const response = data.response;
    const leaves = response.tleavrequest.map(e => e.fields);

    console.log('leaves', leaves);

    this.leaveRequest.set(leaves);


    const currentDate = moment();
    let allFutureLeaves = leaves.filter(leave => moment(leave.StartDate).isAfter(currentDate));
    let allPassedLeaves = leaves.filter(leave => moment(leave.StartDate).isBefore(currentDate));
    let toReview = allFutureLeaves.filter(leave => leave.Status != "Approved");
    let upComingLeaves = allFutureLeaves.filter(leave => leave.Status == "Approved");
    await this.leaveRequestUpComming.set(upComingLeaves);
    await this.leaveRequestToReview.set(toReview);
    await this.leaveRequestHistory.set(allPassedLeaves);
  };


  this.initPage = async () => {
    LoadingOverlay.show();

    await this.loadLeaves();



    LoadingOverlay.hide();
  };


  this.initPage();
});

Template.payrollleave.events({});

Template.payrollleave.helpers({
  leaveRequestToReview: () => {
    return Template.instance().leaveRequestToReview.get();
  },
  leaveRequestUpComming: () => {
    return Template.instance().leaveRequestUpComming.get();
  },
  leaveRequestHistory: () => {
    return Template.instance().leaveRequestHistory.get();
  }
});
