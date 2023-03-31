import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
import { AppointmentService } from '../../appointments/appointment-service';
import {Template} from 'meteor/templating';
import './employeeclockonoff.html';
import LoadingOverlay from "../../LoadingOverlay";
import { SideBarService } from "../../js/sidebar-service";

 


let utilityService = new UtilityService();
let sideBarService = new SideBarService();


Template.clockOnOff.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.employeerecords = new ReactiveVar([]);
  templateObject.jobsrecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.appointmentrecords = new ReactiveVar([]);
  templateObject.selectedFile = new ReactiveVar();
  templateObject.timesheetrecords = new ReactiveVar([]);
  
});

Template.clockOnOff.onRendered(function () {
  $('.fullScreenSpin').css('display', 'inline-block');
  let templateObject = Template.instance();
  let contactService = new ContactService();
  let appointmentService = new AppointmentService();
  let appointmentList = [];
  $(".formClassDate").datepicker({
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

  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  $('.formClassDate').val(begunDate);
  
  $('#employee_name').editableSelect();
  $('#employee_name').editableSelect().on('click.editable-select', function (e, li) {
    var $earch = $(this);
    var offset = $earch.offset();
    var employeeDataName = e.target.value || '';
    if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
        $('#employeeListPOPModal').modal();
        setTimeout(function () {
            $('#tblEmployeelist_filter .form-control-sm').focus();
            $('#tblEmployeelist_filter .form-control-sm').val('');
            $('#tblEmployeelist_filter .form-control-sm').trigger("input");
            var datatable = $('#tblEmployeelist').DataTable();
            //datatable.clear();
            //datatable.rows.add(splashArrayCustomerList);
            datatable.draw();
            $('#tblEmployeelist_filter .form-control-sm').trigger("input");
            //$('#tblEmployeelist').dataTable().fnFilter(' ').draw(false);
        }, 500);
    } else {          
      $('#employeeListPOPModal').modal();              
    }
  });

  $("#clockonoffModal").modal("show");
  
  $(document).on("click", "#tblEmployeelist tbody tr", function (e) {
    let employeeName = $(this).find(".colEmployeeName").text() || '';
    let employeeID = $(this).find(".colEmployeeNo").text() || '';
    $('#employee_name').val(employeeName);
    $('#employee_id').val(employeeID);
    $('#barcodeScanInput').prop("disabled", true);
    $('#employeeListPOPModal').modal('toggle');
  });

  document
    .querySelector("#barcodeScanInput")
    .addEventListener("keypress", function (e) {
      if (e.key == "Enter") {
        $("#btnDesktopSearch").trigger("click");
      }
    });

  //
  // Initializes jQuery Raty control
  //
  function initDataTableCtrl(container) {
    $('select', container).select2();
  }


  $("#employee_name").val(localStorage.getItem('mySessionEmployee'));
  const employeeList = [];
  const jobsList = [];
  const timesheetList = [];
  const dataTableList = [];
  const tableHeaderList = [];

  var today = moment().format('DD/MM/YYYY');
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = (currentDate.getMonth() + 1);
  let fromDateDay = currentDate.getDate();
  if ((currentDate.getMonth()+1) < 10) {
    fromDateMonth = "0" + (currentDate.getMonth()+1);
  }

  if (currentDate.getDate() < 10) {
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();


  templateObject.diff_hours = function (dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(diff);
  }

  templateObject.dateFormat = function (date) {
    var dateParts = date.split("/");
    var dateObject = dateParts[2] + '/' + ('0' + (dateParts[1] - 1)).toString().slice(-2) + '/' + dateParts[0];
    return dateObject;
  }
  Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), 'tblTimeSheet', function (error, result) {
    if (error) {

    } else {
      if (result) {

        for (let i = 0; i < result.customFields.length; i++) {
          let customcolumn = result.customFields;
          let columData = customcolumn[i].label;
          let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
          let hiddenColumn = customcolumn[i].hidden;
          let columnClass = columHeaderUpdate.split('.')[1];
          let columnWidth = customcolumn[i].width;

          $("th." + columnClass + "").html(columData);
          $("th." + columnClass + "").css('width', "" + columnWidth + "px");

        }
      }

    }
  });

  templateObject.timeToDecimal = function (time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  };

});

Template.clockOnOff.events({
  'click #btnClockOn': function () {
    const templateObject = Template.instance();
    $("#startTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
    let date = new Date();
    let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
    var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
    if (endTime > startTime) {
      document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    }
  },
  'click #btnClockOff': function () {
    const templateObject = Template.instance();
    let date = new Date();
    document.getElementById("endTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
    let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
    var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
    document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
  },
  'change #startTime': function () {
    const templateObject = Template.instance();
    let date = new Date();
    let date1 = ("0" + date.getDate()).toString().slice(-2) + "/" + ("0" + (date.getMonth() + 1)).toString().slice(-2) + "/" + date.getFullYear();
    var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
    if (endTime > startTime) {
      document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    } else {
    }
  },

  'change #endTime': function () {
    const templateObject = Template.instance();
    let date = new Date();
    let date1 = ("0" + date.getDate()).toString().slice(-2) + "/" + ("0" + (date.getMonth() + 1)).toString().slice(-2) + "/" + date.getFullYear();
    var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
    if (endTime > startTime) {
      document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    } else {
    }
  },
 
  
  'click .btnSaveTimeSheetOne': async function () {

    
    
    playSaveAudio();
   
     
    let templateObject = Template.instance();
    let contactService = new ContactService();
    
    setTimeout(async function(){
      
      $('.fullScreenSpin').css('display', 'inline-block'); 
      LoadingOverlay.show();
      let checkStatus = "";
      let checkStartTime = "";
      
     
      var employeeName = $("#employee_name").val();
      var startdateGet = new Date();
      var endDateGet = new Date();
      let date =
        startdateGet.getFullYear() +
        "-" +
        ("0" + (startdateGet.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + startdateGet.getDate()).slice(-2);
      let endDate =
        endDateGet.getFullYear() +
        "-" +
        ("0" + (endDateGet.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + endDateGet.getDate()).slice(-2);
      
      var startTime = $("#startTime").val() || "";
      var endTime = $("#endTime").val() || "";
      var edthour = $("#txtBookedHoursSpent").val() || "00:01";
      let hours = templateObject.timeToDecimal(edthour);
      var techNotes = $("#txtNotes").val() || "";
    
     
      let isPaused = checkStatus;
      let obj = {};
      let data = "";

      if (startTime != "") {
        startTime = date + " " + startTime;
      }

      if (endTime != "") {
        endTime = date + " " + endTime;
      }

      
      if (checkStartTime == "" && startTime == "") {
        $(".fullScreenSpin").css("display", "none");
        swal({
          title: "Oooops...",
          text: "You can't save this entry with no start time",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss == "cancel") {
          }
        });
        return false;
      }
      
      
        if ($("#startTime").val() != "" && $("#endTime").val() != "") {
          obj = {
            type: "TTimeLog",
            fields: {
              EmployeeID: localStorage.getItem("mySessionEmployeeLoggedID"),
              StartDatetime: startTime,
              EndDatetime: endTime,
              Product: '',
              Description: "Timesheet Started & Completed",
              EnteredBy: localStorage.getItem("mySessionEmployeeLoggedID"),
            },
          };
          isPaused = "completed";
        } else if ($("#startTime").val() != "" && $("#endTime").val() == "") {
          obj = {
            type: "TTimeLog",
            fields: {
              EmployeeID: localStorage.getItem("mySessionEmployeeLoggedID"),
              StartDatetime: startTime,
              EndDatetime: endTime,
              Product: '',
              Description: "Timesheet Started",
              EnteredBy: localStorage.getItem("mySessionEmployeeLoggedID"),
            },
          };
          isPaused = "";
        }

        data = {
          type: "TTimeSheetEntry",
          fields: {
            // "EntryDate":"2020-10-12 12:39:14",
            TimeSheet: [
              {
                type: "TTimeSheet",
                fields: {
                  EmployeeName: employeeName || "",
                  ServiceName: "",
                  HourlyRate:  0,
                  LabourCost: 1,
                  Allowedit: true,
                  Logs: obj,
                  TimeSheetDate: date,
                  StartTime: startTime,
                  EndTime: endTime,
                  Hours: hours || 0.016666666666666666,
                  // OverheadRate: 90,
                  Job: "",
                  // ServiceName: "Test"|| '',
                  TimeSheetClassName: "Default" || "",
                  Notes: techNotes || "",
                  InvoiceNotes: "Clocked On",
                  // EntryDate: accountdesc|| ''
                },
              },
            ],
            TypeName: "Payroll",
            WhoEntered: localStorage.getItem("mySessionEmployee") || "",
          },
        };
        
        contactService
          .saveTimeSheet(data)
          .then(function (dataReturnRes) {

            sideBarService.getAllTimeSheetList().then(function (data) {
              // Bert.alert(
              //   $("#employee_name").val() + " you are now Clocked On",
              //   "now-success"
              // );
              addVS1Data("TTimeSheet", JSON.stringify(data));

              $("#employeeStatusField").removeClass("statusOnHold");
              $("#employeeStatusField").removeClass("statusClockedOff");
              $("#employeeStatusField")
                .addClass("statusClockedOn")
                .text("Clocked On");
             
              $("#startTime").prop("disabled", true);
            
              swal($("#employee_name").val() + ' ClockOn data is saved', '', 'success');
              $("#clockOnOffModal").modal("hide");
          
              $(".fullScreenSpin").css("display", "none");
             
            });
          })
          .catch(function (err) {
            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
                // Meteor._reload.reload();
              } else if (result.dismiss == "cancel") {
              }
            });
            $(".fullScreenSpin").css("display", "none");
          });
      
  }, delayTimeAfterSound);
  },

  "click .btnDesktopSearch": function (e) {
    const templateObject = Template.instance();
    let contactService = new ContactService();
    let barcodeData = $("#barcodeScanInput").val();
    let empNo = barcodeData.replace(/^\D+/g, "");
    LoadingOverlay.show();
    if (barcodeData == "") {
      swal("Please enter the employee number", "", "warning");
      $(".fullScreenSpin").css("display", "none");
      e.preventDefault();
      return false;
    } else {
      contactService
        .getOneEmployeeDataEx(empNo)
        .then(function (data) {
          $(".fullScreenSpin").css("display", "none");
         
          if (Object.keys(data).length > 0) {
            $("#employee_name").val(data.fields.EmployeeName || "");
            $("#employee_id").val(data.fields.ID || "");
            $("#barcodeScanInput").val("");
            
            $("#edtProductCost").val(0);
            $("#updateID").val("");
            $("#startTime").val("");
            $("#endTime").val("");
            $("#txtBookedHoursSpent").val("");
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            $("#btnClockOn").prop("disabled", false);
            $("#btnHold").prop("disabled", false);
            $("#btnClockOff").prop("disabled", false);
            

            
          } else {
            swal("Employee Not Found", "", "warning");
          }
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: "Employee Not Found",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              // Meteor._reload.reload();
            } else if (result.dismiss == "cancel") {
            }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    }
  }
 
});

Template.clockOnOff.helpers({
  jobsrecords: () => {
    return Template.instance().jobsrecords.get().sort(function (a, b) {
      if (a.jobname == 'NA') {
        return 1;
      }
      else if (b.jobname == 'NA') {
        return -1;
      }
      return (a.jobname.toUpperCase() > b.jobname.toUpperCase()) ? 1 : -1;
    });
  },
  employeerecords: () => {
    return Template.instance().employeerecords.get().sort(function (a, b) {
      if (a.employeename == 'NA') {
        return 1;
      }
      else if (b.employeename == 'NA') {
        return -1;
      }
      return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
    });
  },
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function (a, b) {
      if (a.timesheetdate == 'NA') {
        return 1;
      }
      else if (b.timesheetdate == 'NA') {
        return -1;
      }
      return (a.timesheetdate.toUpperCase() > b.timesheetdate.toUpperCase()) ? 1 : -1;
    });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  loggedCompany: () => {
    return localStorage.getItem('mySession') || '';
  }
});
