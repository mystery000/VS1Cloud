import {ReactiveVar} from "meteor/reactive-var";
import {AccountService} from "../../accounts/account-service";
import {OrganisationService} from "../../js/organisation-service";
import {SideBarService} from "../../js/sidebar-service";
import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import LoadingOverlay from "../../LoadingOverlay";
import {TaxRateService} from "../../settings/settings-service";
import {UtilityService} from "../../utility-service";

let utilityService = new UtilityService();
let sideBarService = new SideBarService();
let accountService = new AccountService();
let taxRateService = new TaxRateService();
let organisationService = new OrganisationService();

Template.AddPayRunModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.calendarPeriods = new ReactiveVar([]);

  templateObject.AppTableModalData = new ReactiveVar();
});

Template.AddPayRunModal.onRendered(() => {
  const templateObject = Template.instance();

  templateObject.loadPayRuns = async () => {
    LoadingOverlay.show();

    let list = [];
    let data = await CachedHttp.get(erpObject.TPayrollCalendars, async () => {
      return await sideBarService.getCalender(initialBaseDataLoad, 0);
    }, {
      useIndexDb: true,
      useLocalStorage: false,
      validate: cachedResponse => {
        return false;
      }
    });

    data = data.response;

    // data.tpayrollcalendars.forEach(element => {
    //   list.push(element.fields);
    // });
    let splashArrayCalenderList = [];

    for (let i = 0; i < data.tpayrollcalendars.length; i++) {
      var dataListAllowance = [
        data.tpayrollcalendars[i].fields.ID || "",
        data.tpayrollcalendars[i].fields.PayrollCalendarName || "",
        data.tpayrollcalendars[i].fields.PayrollCalendarPayPeriod || "",
        moment(data.tpayrollcalendars[i].fields.PayrollCalendarStartDate).format("DD/MM/YYYY") || "",
        moment(data.tpayrollcalendars[i].fields.PayrollCalendarFirstPaymentDate).format("DD/MM/YYYY") || "",
        '<td contenteditable="false" class="colDeleteCalenders"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
      ];

      splashArrayCalenderList.push(dataListAllowance);
    }
    setTimeout(function () {
      $("#tblPayCalendars").DataTable({
        data: splashArrayCalenderList,
        sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        columnDefs: [
          {
            className: "colCalenderID hiddenColumn",
            targets: [0]
          }, {
            className: "colPayCalendarName",
            targets: [1]
          }, {
            className: "colPayPeriod",
            targets: [2]
          }, {
            className: "colNextPayPeriod",
            targets: [3]
          }, {
            className: "colNextPaymentDate",
            targets: [4]
          }, {
            className: "colDeleteCalenders",
            orderable: false,
            targets: -1
          }
        ],
        select: true,
        destroy: true,
        colReorder: true,
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
          $("#tblPayCalendars").DataTable().ajax.reload();
        },
        fnDrawCallback: function (oSettings) {
          $(".paginate_button.page-item").removeClass("disabled");
          $("#tblPayCalendars_ellipsis").addClass("disabled");
          if (oSettings._iDisplayLength == -1) {
            if (oSettings.fnRecordsDisplay() > 150) {}
          } else {}
          if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
            $(".paginate_button.page-item.next").addClass("disabled");
          }

          $(".paginate_button.next:not(.disabled)", this.api().table().container()).on("click", function () {
            $(".fullScreenSpin").css("display", "inline-block");
            var splashArrayCalenderListDupp = new Array();
            let dataLenght = oSettings._iDisplayLength;
            let customerSearch = $("#tblPayCalendars_filter input").val();

            sideBarService.getCalender(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
              for (let i = 0; i < data.tpayrollcalendars.length; i++) {
                var dataListAllowance = [
                  data.tpayrollcalendars[i].fields.ID || "",
                  data.tpayrollcalendars[i].fields.PayrollCalendarName || "",
                  data.tpayrollcalendars[i].fields.PayrollCalendarPayPeriod || "",
                  moment(data.tpayrollcalendars[i].fields.PayrollCalendarStartDate).format("DD/MM/YYYY") || "",
                  moment(data.tpayrollcalendars[i].fields.PayrollCalendarFirstPaymentDate).format("DD/MM/YYYY") || "",
                  '<td contenteditable="false" class="colDeleteCalenders"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArrayCalenderList.push(dataListAllowance);
              }

              let uniqueChars = [...new Set(splashArrayCalenderList)];
              var datatable = $("#tblPayCalendars").DataTable();
              datatable.clear();
              datatable.rows.add(uniqueChars);
              datatable.draw(false);
              setTimeout(function () {
                $("#tblPayCalendars").dataTable().fnPageChange("last");
              }, 400);

              LoadingOverlay.hide();
            }).catch(function (err) {
              LoadingOverlay.hide();
            });
          });
          setTimeout(function () {
            MakeNegative();
          }, 100);
        },
        fnInitComplete: function () {
          $("<button class='btn btn-primary btnAddNewpaycalender' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblPayCalendars_filter");
          $("<button class='btn btn-primary btnRefreshCalender' type='button' id='btnRefreshAllowance' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#ttblPayCalendars_filter");
        }
      }).on("page", function () {
        setTimeout(function () {
          MakeNegative();
        }, 100);
      }).on("column-reorder", function () {}).on("length.dt", function (e, settings, len) {
        //$('.fullScreenSpin').css('display', 'inline-block');
        let dataLenght = settings._iDisplayLength;
        splashArrayCalenderList = [];
        if (dataLenght == -1) {
          LoadingOverlay.hide();
        } else {
          if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
            LoadingOverlay.hide();
          } else {
            sideBarService.getCalender(dataLenght, 0).then(function (dataNonBo) {
              addVS1Data("TPayrollCalendars", JSON.stringify(dataNonBo)).then(function (datareturn) {
                templateObject.resetData(dataNonBo);
                LoadingOverlay.hide();
              }).catch(function (err) {
                LoadingOverlay.hide();
              });
            }).catch(function (err) {
              LoadingOverlay.hide();
            });
          }
        }
        setTimeout(function () {
          MakeNegative();
        }, 100);
      });
    }, 0);

    $("div.dataTables_filter input").addClass("form-control form-control-sm");

    $("#AppTableModal").modal("show");
    LoadingOverlay.hide();
  };

  $(document).on("click", ".colDeleteCalenders", function (event) {
    event.stopPropagation();
    let targetID = $(event.target).closest("tr").find(".colCalenderID").text() || 0; // table row ID

    let calenderName = $(this).closest("tr").find(".colPayCalendarName").text() || "";

    $("#selectColDeleteLineID").val(targetID);
    $("#selectCalenderName").val(targetID);
    $("#deleteCalenderLineModal").modal("toggle");
  });

  //templateObject.loadPayRuns();
});

Template.AddPayRunModal.events({
  "click .selectAPayRun": (e, ui) => {
    console.log(e);
    ui.loadPayRuns();
    //$('#AppTableModal').modal("show");
  },
  "click .btnPayRunNext": event => {
    $(".modal-backdrop").css("display", "none");
    FlowRouter.go("/payrundetails");
  },

});

Template.AddPayRunModal.helpers({
  getCalendar: () => {
    return Template.instance().calendarPeriods.get();
  },
  AppTableModalData: () => {
    return Template.instance().AppTableModalData.get();
  }
});
