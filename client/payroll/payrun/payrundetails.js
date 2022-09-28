import {ReactiveVar} from "meteor/reactive-var";
import {CoreService} from "../../js/core-service";
import {UtilityService} from "../../utility-service";
import {ContactService} from "../../contacts/contact-service";
import {ProductService} from "../../product/product-service";
import {SideBarService} from "../../js/sidebar-service";
import "jquery-editable-select";
import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import moment from "moment";
import PayRun from "../../js/Api/Model/PayRun";
import LoadingOverlay from "../../LoadingOverlay";
import "../../lib/global/indexdbstorage";
import GlobalFunctions from "../../GlobalFunctions";
import Employee from "../../js/Api/Model/Employee";

let utilityService = new UtilityService();
let sideBarService = new SideBarService();

/**
 * 
 * @returns {Array} []
 */
const getPayRuns = () => {
  return JSON.parse(localStorage.getItem("TPayRunHistory")) || [];
}
const setPayRuns = (items) => {
  return localStorage.setItem("TPayRunHistory", JSON.stringify(items))
}

const setPayRun = () => {

}

const addPayRun = () => {

}

Template.payrundetails.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.calendarPeriod = new ReactiveVar([]);
  templateObject.payRunDetails = new ReactiveVar();
});

Template.payrundetails.onRendered(function () {
  const templateObject = Template.instance();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  $("#date-input,#dateTo,#dateFrom").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonImageOnly: true,
    buttonImage: "/img/imgCal2.png",
    dateFormat: "dd/mm/yy",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10"
  });

  //   setTimeout(function () {
  //     $("#tblPayRunDetails").DataTable({
  //       columnDefs: [
  //         {
  //           orderable: false,
  //           targets: -1
  //         }
  //       ],
  //       sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
  //       buttons: [
  //         {
  //           extend: "excelHtml5",
  //           text: "",
  //           download: "open",
  //           className: "btntabletocsv hiddenColumn",
  //           filename: "taxratelist_" + moment().format(),
  //           orientation: "portrait",
  //           exportOptions: {
  //             columns: ":visible"
  //           }
  //         }, {
  //           extend: "print",
  //           download: "open",
  //           className: "btntabletopdf hiddenColumn",
  //           text: "",
  //           title: "Tax Rate List",
  //           filename: "taxratelist_" + moment().format(),
  //           exportOptions: {
  //             columns: ":visible"
  //           }
  //         }
  //       ],
  //       select: true,
  //       destroy: true,
  //       colReorder: true,
  //       colReorder: {
  //         fixedColumnsRight: 1
  //       },
  //       lengthMenu: [
  //         [
  //           25, -1
  //         ],
  //         [
  //           25, "All"
  //         ]
  //       ],
  //        bStateSave: true,
  //        rowId: 0,
  //       paging: true,
  //       info: true,
  //       responsive: true,
  //       order: [
  //         [0, "asc"]
  //       ],
  //       action: function () {
  //         $("#tblPayRunDetails").DataTable().ajax.reload();
  //       },
  //       fnDrawCallback: function (oSettings) {
  //         setTimeout(function () {
  //           MakeNegative();
  //         }, 100);
  //       }
  //     }).on("page", function () {
  //       setTimeout(function () {
  //         MakeNegative();
  //       }, 100);
  //       let draftRecord = templateObject.datatablerecords.get();
  //       templateObject.datatablerecords.set(draftRecord);
  //     }).on("column-reorder", function () {}).on("length.dt", function (e, settings, len) {
  //       setTimeout(function () {
  //         MakeNegative();
  //       }, 100);
  //     });

  //     $(".fullScreenSpin").css("display", "none");
  //   }, 0);

  /**
     * Load the selected calendar data
     * from the url cid=??
     * This will load single calendar
     */
  templateObject.loadCalendar = async (id = null) => {
    let data = await CachedHttp.get(erpObject.TPayrollCalendars, async () => {
      return await sideBarService.getCalender(initialBaseDataLoad, 0);
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      validate: cachedResponse => {
        return true;
      }
    });

    data = data.response;

    let calendar = null;

    if (id) {
      calendar = data.tpayrollcalendars.find(calendar => calendar.fields.ID == id);
      if (calendar) {
        calendar = calendar.fields;

        return calendar;
      }
      return null;
    }
    return null;
  };

  /**
     * Load employees
     */
  const getPayHistoryOfEmployee = async (fromRemote = false, employeeId = null) => {
    let data = await CachedHttp.get(erpObject.TPayHistory, async () => {
      return await sideBarService.getAllPayHistoryDataVS1(initialBaseDataLoad, 0);
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      validate: cResponse => {
        return !fromRemote;
      }
    });

    data = data.response;

    let payHistoryOfEmployee = data.tpayhistory.filter(p => p.fields.Employeeid == employeeId);

    return payHistoryOfEmployee;
  };

  templateObject.loadEmployees = async () => {
    let data = await CachedHttp.get(erpObject.TEmployee, async () => {
      return await sideBarService.getAllEmployeesDataVS1(initialBaseDataLoad, 0);
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      validate: cachedResponse => {
        return true;
      }
    });

    data = data.response;

    let employees = Employee.fromList(data.temployee);

    await GlobalFunctions.asyncForEach(employees, async (employee, index, array) => {
      employee.PayHistory = await getPayHistoryOfEmployee(false, employee.fields.ID);
    });


    console.log("employee", employees);

    return employees;
  };

  /**
     * Supernnuation
     */

  templateObject.loadSuperAnnuationPerEmployee = async (employee) => {
    let superAnnuation = 123.0;

    return superAnnuation
  }

  templateObject.loadSuperAnnuations = async () => {
    let payRunDetails  =  templateObject.payRunDetails.get();

    payRunDetails.employees.forEach((e, index) => {
      payRunDetails.employees[index].superAnnuation = templateObject.loadSuperAnnuationPerEmployee(e);
    });

    templateObject.payRunDetails.set(payRunDetails)
  }

  /**
     * earnings
     */

  /**
     * Taxes
     */

  templateObject.loadPayRunData = async () => {
    LoadingOverlay.show();
    let payRunDetails = null;

    if (urlParams.has("cid")) {
      let payRunsHistory = JSON.parse(localStorage.getItem("TPayRunHistory")) || []; // we get the list and find
      payRunDetails = payRunsHistory.find(p => p.calendar.ID == urlParams.get("cid"));

      if (!payRunDetails) {
        const calendar = await templateObject.loadCalendar(urlParams.get("cid")); // single calendar
        const employees = await templateObject.loadEmployees();

        payRunDetails = new PayRun({
          stpFilling: PayRun.STPFilling.draft,
          calendar: calendar,
          employees: employees,
          netPay: 0.0,
          superAnnuation: 0.0,
          taxes: 0.0,
          earnings: 0.0
        });

    
        payRunsHistory.push( payRunDetails);
  
        localStorage.setItem("TPayRunHistory", JSON.stringify(payRunsHistory));
      } else {
        payRunDetails.employees = Employee.fromList(payRunDetails.employees);
      }
    }

    await GlobalFunctions.asyncForEach(payRunDetails.employees, async (employee, index) => {
      await employee.getEarnings();
      await templateObject.payRunDetails.set(payRunDetails);
      LoadingOverlay.hide();
    });
  
    console.log(payRunDetails.employees);
  
   // templateObject.loadSuperAnnuations();

    await templateObject.calculateTableTotal();
   
  };

  templateObject.calculateTableTotal = async () => {
    let payRunData = await templateObject.payRunDetails.get();

    payRunData.employees.forEach((employee) => {
      payRunData.earnings += employee.earningTotal;
      payRunData.taxes += employee.taxTotal;
      payRunData.netPay += employee.netPayTotal;
      payRunData.superAnnuation += employee.superAnnuationTotal;

    });






    templateObject.payRunDetails.set(payRunData);
  }

  /**
     * save to draft at page load
     */

  /**
     * Save to history function
     */

  templateObject.postPayRun = async () => {
    let newPayRunDetails = new PayRun(templateObject.payRunDetails.get());

    const toggleStatus = () => {
      return PayRun.STPFilling.overdue; // this should automatically done
    };

    newPayRunDetails.stpFilling = toggleStatus();

    templateObject.payRunDetails.set(newPayRunDetails);

    // Get from the list
    let payRunsHistory = getPayRuns(); // we get the list and find
    // let payRunDetails = payRunsHistory.find(p => p.calendar.ID == urlParams.get("cid"));

    const index = payRunsHistory.findIndex(p => p.calendar.ID == urlParams.get("cid"));
    payRunsHistory[index] = newPayRunDetails;

    localStorage.setItem("TPayRunHistory", JSON.stringify(payRunsHistory));

    window.location.href = "/payrolloverview";
  };

  /**
   * Delete the currency payrun
   */
  templateObject.deletePayRun = async () => {
    let payRuns = getPayRuns();
    const index = payRuns.findIndex(p => p.calendar.ID == urlParams.get("cid"));
    payRuns.splice(index, 1);

    setPayRuns(payRuns);

    window.location.href = "/payrolloverview";

  } 

  templateObject.loadPayRunData();
});

Template.payrundetails.events({
  "click .colPayRunDetailsFirstName": function (event) {
    $(".modal-backdrop").css("display", "none");
    FlowRouter.go("/payslip");
  },

  "click #chkEFT": function (event) {
    if ($("#chkEFT").is(":checked")) {
      $("#eftExportModal").modal("show");
    } else {
      $("#eftExportModal").modal("hide");
    }
  },
  "click .post-pay-run": (e, ui) => {
    ui.postPayRun();
  },
  'click .delete-payrun': (e, ui) => {
    ui.deletePayRun();
  }
});

Template.payrundetails.helpers({
  countEmployees: () => {
    const employees = (Template.instance().payRunDetails.get()).employees;
    return employees.length;
  },
  payRunDetails: () => {
    return Template.instance().payRunDetails.get();
  },
  PayRunStatus: status => {
    if (status == PayRun.STPFilling.notfilled) {
      return "Not filled";
    } else if (status == PayRun.STPFilling.draft) {
      return "Draft";
    } else if (status == PayRun.STPFilling.overdue) {
      return "Overdue";
    }
  },
  PaymentDateFormat: data => {
    if (data) {
      return moment(data).format("Do MMM YYYY");
    }
  },

  formatPrice : (amount) => GlobalFunctions.formatPrice(amount),
});
