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
import {ReportService} from "../reports/report-service";
import EmployeePayrollApi from "../js/Api/EmployeePayrollApi";
import moment from "moment";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.timesheetdetail.onCreated(function () {
  this.timesheet = new ReactiveVar();
  this.timeSheetList = new ReactiveVar([]);
  this.employee = new ReactiveVar();
  this.earnings = new ReactiveVar([]);

  this.earningLines = new ReactiveVar([]);
  this.earningDays = new ReactiveVar([]);
  this.earningOptions = new ReactiveVar([]);

});

Template.timesheetdetail.onRendered(function () {
  this.loadTimeSheet = async () => {
    let id = FlowRouter.current().queryParams.tid;

    let data = await CachedHttp.get(erpObject.TTimeSheetEntry, async () => {
      return await new ContactService().getAllTimeSheetList();
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      fallBackToLocal: true,
      validate: cachedResponse => {
        return false;
      }
    });
    data = data.response;

    let timesheets = data.ttimesheet.map(t => t.fields);
    timesheets.forEach((t, index) => {
      if (t.Status == "") {
        t.Status = "Draft";
      }
    });
    let timesheet = timesheets.find(o => o.ID == id);

    console.log("timsheet", timesheet);
    this.timesheet.set(timesheet);
  };

  this.loadEmployee = async () => {
    let timesheet = await this.timesheet.get();

    let data = await CachedHttp.get(erpObject.TEmployee, async () => {
      return await new ContactService().getAllEmployees();
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      fallBackToLocal: true,
      validate: cachedResponse => {
        return true;
      }
    });

    data = data.response;
    let employees = data.temployee.map(e => e.fields);

    const selectedEmployee = employees.find(e => e.EmployeeName == timesheet.EmployeeName);
    this.employee.set(selectedEmployee);

    console.log("employees", employees);
    console.log("employee", selectedEmployee);
  };

  /**
   * Here we load earnings of this employee
   * 
   * @param {integer} employeeID 
   * @returns 
   */
  this.getEarnings = async (employeeID = null) => {
    let data = await CachedHttp.get(erpObject.TPayTemplateEarningLine, async () => {
      const employeePayrolApis = new EmployeePayrollApi();
      const employeePayrolEndpoint = employeePayrolApis.collection.findByName(employeePayrolApis.collectionNames.TPayTemplateEarningLine);
      employeePayrolEndpoint.url.searchParams.append("ListType", "'Detail'");

      const response = await employeePayrolEndpoint.fetch();
      if (response.ok == true) {
        return await response.json();
      }
      return null;
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      validate: cachedResponse => {
        return false;
      }
    });

    data = data.response.tpaytemplateearningline.map(earning => earning.fields);
    if (employeeID) {
      data = data.filter(item => parseInt(item.EmployeeID) == parseInt(employeeID));
    }

    data = _.groupBy(data, 'EarningRate')

    console.log('earnings', data);

    this.earnings.set(data);
    return data;
  };


  this.calculateThisWeek = async () => {
    const timesheet = await this.timesheet.get();

    const endDate = moment(timesheet.TimeSheetDate);
    const aWeekAgo = moment(timesheet.TimeSheetDate).subtract('1', "week");
    console.log('endfate', endDate, aWeekAgo);

    let date = moment(timesheet.TimeSheetDate).subtract('1', "week");
    let days = [];
    let i = 0;
    while(date.isBefore(endDate) == true) {
      date = aWeekAgo.add('1', 'day');
      days.push({
        index: i,
        dateObject: date,
        date: date.format('ddd DD MMM'),
      });
      i++;
    }

    this.earningDays.set(days);

    console.log(days);



  }

  //  this.loadTimeSheetEntry = async () => {
  //   let data = await CachedHttp.get(erpObject.TTimeSheetEntry, async () => {
  //     return await (new ReportService()).getTimeSheetEntry();
  //   }, {
  //     useIndexDb: true,
  //     useLocalStorage: false,
  //     fallBackToLocal: true,
  //     validate: (cachedResponse) => {
  //       return true;  Shouldn't return hard codedly, but only if the data is ok
  //     }
  //   });

  //   data = data.response;

  //   console.log("data", data);

  //  }

  this.duplicateFirstLine = () => {
      let template = document.querySelector('#tblTimeSheetInner tbody tr.template');
      let clonedTr = template.cloneNode(true);
      clonedTr.removeAttribute('class');
      $("#tblTimeSheetInner tbody").find("tr:last").prev().after(clonedTr);
  }

  this.loadEarningSelector = async () => {

    let options =  [
      {
        value : "Ordinary Time Earnings",
        text : "Ordinary Time Earnings",
      }, {
        value: "Overtime Earnings",
        text: "Overtime Earnings"
      }
    ];

    await this.earningOptions.set(options);

    $('#tblEarnigRatesList').DataTable();
  }

  this.buildNewObject = () => {
    // Here we will build the object to save

    const trs = $('#tblTimeSheetInner').find('tr');

    trs.each((index, tr) => {
      let totalHours = 0;

     const inputs = tr.find('.hours');

     inputs.each((_index, input) => {
        totalHours += parseFloat(input.val() || 0);
     });



    })
  }

  this.approveTimeSheet = async () => {
    console.log('Aprove timsheet');
  }


  this.cancelTimeSheet = async () => {
    console.log('Cancel timsheet');
  }


  this.darftTimeSheet = async () => {
    console.log('Draft timsheet');
  }


  this.deleteTimeSheet = async () => {
    console.log('Delete timsheet');
  }





  this.initPage = async () => {
    
    LoadingOverlay.show();
    await this.loadTimeSheet();
    await this.loadEmployee();

    const employee = await this.employee.get();
    await this.getEarnings(employee.ID);

    await this.calculateThisWeek();

    await this.loadEarningSelector();

    setTimeout(() => {
      this.duplicateFirstLine();
    })
  
    LoadingOverlay.hide();
  };
  this.initPage();
});

Template.timesheetdetail.events({
  "click .btnAddNewLine": function (e, ui) {
    // $("#tblTimeSheetInner tbody").find("tr:last").prev().after(`<tr>
    //     <td>
    //      <select class="form-control">
    //          <option>Select</option>
    //          <option value="Ordinary Time Earnings">Ordinary Time Earnings</option>
    //          <option value="Overtime Earnings">Overtime Earnings</option>
    //      </select>
    //     </td>
    //     <td>0.00</td>
    //     <td>0.00</td>
    //     <td>0.00</td>
    //     <td>0.00</td>
    //     <td>0.00</td>
    //     <td>0.00</td>
    //     <td>0.00</td>
    //     <td>0.00</td>
    //     <td><button type="button" class="btn btn-danger btn-rounded btn-sm btnDeletePayslip" data-id="1" autocomplete="off"><i class="fa fa-remove"></i></button></td>
    //  </tr>
    //     `);



    ui.duplicateFirstLine();
  },
  "click .btnDeleteRow": function (e) {
    $(e.target).parents("tr").remove();
  },

  "click #tblTimeSheetInner tbody .select-rate-js": (e, ui) => {
    $(e.currentTarget).addClass('selector-target'); // This is used to know where to paste data later
    $("#select-rate-modal").modal("toggle");
  },

  "click #tblEarnigRatesList tbody tr": (e, ui) => {
    const selectedEarning = $(e.currentTarget).find('td:first').text();
    $("#select-rate-modal").modal("toggle");
    $('.selector-target').val(selectedEarning);
    $('.selector-target').removeClass('selector-target');
  },

  "click .approve-timesheet": (e, ui) => {
    ui.approveTimeSheet();
  },
  'click .delete-timesheet': (e, ui) => {
    ui.deleteTimeSheet();
  },
  "click .save-draft": (e, ui) => {
    ui.darftTimeSheet();
  },
  "click .cancel-timesheet": (e, ui) => {
    ui.cancelTimeSheet();
  }
});

Template.timesheetdetail.helpers({
  formatDate: date => {
    return moment(date).format("D MMM YYYY");
  },
  timesheet: () => {
    return Template.instance().timesheet.get();
  },
  employee: () => {
    return Template.instance().employee.get();
  },
  earningDays: () => {
    return Template.instance().earningDays.get();
  },
  earningOptions: () => {
    return Template.instance().earningOptions.get();
  }
});
