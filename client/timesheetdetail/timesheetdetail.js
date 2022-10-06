import { ContactService } from "../contacts/contact-service";
import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
import XLSX from "xlsx";
import { SideBarService } from "../js/sidebar-service";
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
import { EmployeeFields } from "../js/Api/Model/Employee";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();


Template.timesheetdetail.onCreated(function () {
  this.timesheet = new ReactiveVar();
  this.timeSheetList = new ReactiveVar([]);
});

Template.timesheetdetail.onRendered(function () {


   this.loadTimeSheet = async () => {
    let id = FlowRouter.current().queryParams.tid;

    let data = await CachedHttp.get(erpObject.TTimeSheetEntry, async () => {
      return await (new ContactService()).getAllTimeSheetList();
    }, {
      useIndexDb: true, 
      useLocalStorage:false,
      fallBackToLocal: true,
      validate: (cachedResponse) => {
        return false;
      }
    });

    data = data.response;

    let timesheets = data.ttimesheet.map(t => t.fields);
    let timesheet = data.ttimesheet.find(o => o.ID == id)
    console.log('timesheets', timesheet);
 

   }

   this.loadTimeSheet();
    
});

Template.timesheetdetail.events({
  "click .btnAddNewLine": function () {
    $("#tblTimeSheetInner tbody").find('tr:last').prev().after(
        `<tr>
        <td>
         <select class="form-control">
             <option>Select</option>
         </select>
        </td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
        <td><button type="button" class="btn btn-danger btn-rounded btn-sm btnDeletePayslip" data-id="1" autocomplete="off"><i class="fa fa-remove"></i></button></td>
     </tr>
        `
    )
  },
  "click .btnDeleteRow": function (e) {
    $(e.target).parents('tr').remove();
  },
  
});

Template.timesheetdetail.helpers({
 
});
