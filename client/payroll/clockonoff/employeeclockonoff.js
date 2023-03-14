import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
import { AppointmentService } from '../../appointments/appointment-service';
import {Template} from 'meteor/templating';
import './employeeclockonoff.html';
let utilityService = new UtilityService();
Template.clockOnOff.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.employeerecords = new ReactiveVar([]);
  templateObject.jobsrecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.appointmentrecords = new ReactiveVar([]);
  templateObject.selectedFile = new ReactiveVar();
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
  
  $(document).ready(function () {
    $("#clockonoffModal").modal("show");
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

});

Template.clockOnOff.events({
  'click .chkDatatable': function (event) {
    var columns = $('#tblTimeSheet th');
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
    let date1 = document.getElementById("dtSODate").value;
    let date = new Date();
    if (date1 == "") {
      date1 = ("0" + date.getDate()).toString().slice(-2) + "/" + ("0" + (date.getMonth() + 1)).toString().slice(-2) + "/" + date.getFullYear();
    } else {
      date1 = templateObject.dateFormat(date1);
    }
    var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
    if (endTime > startTime) {
      document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    } else {

    }
  },
  'change #endTime': function () {
    const templateObject = Template.instance();
    let date1 = document.getElementById("dtSODate").value;
    let date = new Date();
    if (date1 == "") {
      date1 = ("0" + date.getDate()).toString().slice(-2) + "/" + ("0" + (date.getMonth() + 1)).toString().slice(-2) + "/" + date.getFullYear();
    } else {
      date1 = templateObject.dateFormat(date1);
    }
    var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value + ':00');
    var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value + ':00');
    if (endTime > startTime) {
      document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    } else {

    }
  },
  'click .resetTable': function (event) {
    var getcurrentCloudDetails = CloudUser.findOne({ _id: localStorage.getItem('mycloudLogonID'), clouddatabaseID: localStorage.getItem('mycloudLogonDBID') });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblTimeSheet' });
        if (checkPrefDetails) {
          CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
            if (err) {

            } else {
              Meteor._reload.reload();
            }
          });

        }
      }
    }
  },
  'click .saveTable': function (event) {
    let lineItems = [];
    //let datatable =$('#tblTimeSheet').DataTable();
    $('.columnSettings').each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text() || '';
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(':checked')) {
        colHidden = false;
      } else {
        colHidden = true;
      }
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass
      }

      lineItems.push(lineItemObj);
    });
    var getcurrentCloudDetails = CloudUser.findOne({ _id: localStorage.getItem('mycloudLogonID'), clouddatabaseID: localStorage.getItem('mycloudLogonDBID') });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblTimeSheet' });
        if (checkPrefDetails) {
          CloudPreference.update({ _id: checkPrefDetails._id }, {
            $set: {
              userid: clientID, username: clientUsername, useremail: clientEmail,
              PrefGroup: 'salesform', PrefName: 'tblTimeSheet', published: true,
              customFields: lineItems,
              updatedAt: new Date()
            }
          }, function (err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');
            }
          });

        } else {
          CloudPreference.insert({
            userid: clientID, username: clientUsername, useremail: clientEmail,
            PrefGroup: 'salesform', PrefName: 'tblTimeSheet', published: true,
            customFields: lineItems,
            createdAt: new Date()
          }, function (err, idTag) {
            if (err) {
              $('#myModal2').modal('toggle');
            } else {
              $('#myModal2').modal('toggle');

            }
          });

        }
      }
    }
    $('#myModal2').modal('toggle');
    //Meteor._reload.reload();
  },
  'blur .divcolumn': function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

    var datable = $('#tblTimeSheet').DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);

  },
  'change .rngRange': function (event) {
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $('#tblTimeSheet th');
    $.each(datable, function (i, v) {

      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css('width', range + 'px');

      }
    });

  },
  'click .btnOpenSettings': function (event) {
    let templateObject = Template.instance();
    var columns = $('#tblTimeSheet th');

    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
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
        sIndex: v.cellIndex || '',
        sVisible: columVisible || false,
        sClass: v.className || ''
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  'click .exportbtn': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletocsv').click();
    $('.fullScreenSpin').css('display', 'none');
  },
  'click .exportbtnExcel': function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletoexcel').click();
    $('.fullScreenSpin').css('display', 'none');
  },
  'click .btnRefresh': function () {
    //Meteor._reload.reload();
    window.open('/timesheet', '_self');
  },
  'click .btnSaveTimeSheet': function () {
    playSaveAudio();
    let templateObject = Template.instance();
    let contactService = new ContactService();
    setTimeout(function(){
    $('.fullScreenSpin').css('display', 'inline-block');
    //let timesheetID = $('#edtTimesheetID').val();
    var employeeName = $('.employee_name').val();
    var jobName = $('#sltJob').val();
    var edthourlyRate = $('.hourly_rate').val() || 0;
    var edthour = $('#txtBookedHoursSpent').val() || 0;
    var techNotes = $('#txtNotes').val() || '';
    // var taxcode = $('#sltTaxCode').val();
    // var accountdesc = $('#txaAccountDescription').val();
    // var bankaccountname = $('#edtBankAccountName').val();
    // var bankbsb = $('#edtBSB').val();
    // var bankacountno = $('#edtBankAccountNo').val();
    // let isBankAccount = templateObject.isBankAccount.get();
    let data = '';
      data = {
        type: "TTimeSheetEntry",
        fields: {
          // "EntryDate":"2020-10-12 12:39:14",
          TimeSheet: [{
            type: "TTimeSheet",
            fields: {
              EmployeeName: employeeName || '',
              // HourlyRate:50,
              LabourCost: parseFloat(edthourlyRate) || 0,
              Allowedit: true,
              // ChargeRate: 100,
              Hours: parseInt(edthour) || 0,
              // OverheadRate: 90,
              Job: jobName || '',
              // ServiceName: "Test"|| '',
              TimeSheetClassName: "Default" || '',
              Notes: techNotes || ''
              // EntryDate: accountdesc|| ''
            }
          }],
          "TypeName": "Payroll",
          "WhoEntered": localStorage.getItem('mySessionEmployee') || ""
        }
      };
      contactService.saveTimeSheet(data).then(function (data) {
        window.open('/employeetimeclock', '_self');
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
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });



      contactService.saveTimeSheetUpdate(data).then(function (data) {
        window.open('/employeetimeclock', '_self');
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
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }, delayTimeAfterSound);
  },
  'click .btnAddNewAccounts': function () {

    $('#add-account-title').text('Add New Account');
    $('#edtAccountID').val('');
    $('#sltAccountType').val('');
    $('#sltAccountType').removeAttr('readonly', true);
    $('#sltAccountType').removeAttr('disabled', 'disabled');
    $('#edtAccountName').val('');
    $('#edtAccountName').attr('readonly', false);
    $('#edtAccountNo').val('');
    $('#sltTaxCode').val(loggedTaxCodePurchaseInc || '');
    $('#txaAccountDescription').val('');
    $('#edtBankAccountName').val('');
    $('#edtBSB').val('');
    $('#edtBankAccountNo').val('');
  },
  'click .printConfirm': function (event) {
    playPrintAudio();
    setTimeout(function(){
    $('.fullScreenSpin').css('display', 'inline-block');
    jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletopdf').click();
    $('.fullScreenSpin').css('display', 'none');
  }, delayTimeAfterSound);
  },
  'click .btnDeleteTimeSheet': function () {
    playDeleteAudio();
    let templateObject = Template.instance();
    let contactService = new ContactService();
    setTimeout(function(){
    $('.fullScreenSpin').css('display', 'inline-block');
    
    let timesheetID = $('#edtTimesheetID').val();

    if (timesheetID == "") {
      window.open('/timesheet', '_self');
    } else {
      data = {
        type: "TTimeSheet",
        fields: {
          ID: timesheetID,
          Active: false,
        }
      };

      contactService.saveTimeSheetUpdate(data).then(function (data) {
        window.open('/timesheet', '_self');
      }).catch(function (err) {
        swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.fullScreenSpin').css('display', 'none');
      });
    }
  }, delayTimeAfterSound);
  },
  'blur .cashamount': function (event) {
    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
    let utilityService = new UtilityService();
    if (!isNaN($(event.target).val())) {
      $(event.target).val(Currency + '' + inputUnitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }));
    } else {
      let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));
      //parseFloat(parseFloat($.trim($(event.target).text().substring(Currency.length).replace(",", ""))) || 0);
      $(event.target).val(Currency + '' + inputUnitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0);
      //$('.lineUnitPrice').text();

    }
  },
  'blur .colRate, keyup .colRate, change .colRate': function (event) {
    let templateObject = Template.instance();
    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
    let utilityService = new UtilityService();
    let totalvalue = 0;
    let totalGrossPay = 0;
    let totalRegular = 0;
    let totalOvertime = 0;
    let totalDouble = 0;
    $(event.target).closest("tr").find("span.colRateSpan").text($(event.target).val());
    // .closest('span').find('.colRateSpan').html($(event.target).val());
    $('.colRate').each(function () {
      var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
      totalvalue = totalvalue + chkbidwithLine;
    });

    $('.tblTimeSheet tbody tr').each(function () {
      var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
      var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
      var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
      var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
      var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
      var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
      var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g, "")) || 0;

      totalRegular = (rateValue * regHourValue) || 0;
      totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
      totalDouble = ((rateValue * 2) * doubleeValue) || 0;
      totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue + cashtipsValue) || 0;
      $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
    });
    $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

  },
  'blur .colRegHours, keyup .colRegHours, change .colRegHours': function (event) {
    let templateObject = Template.instance();
    let inputUnitPrice = parseInt($(event.target).val()) || 0;
    let utilityService = new UtilityService();
    let totalvalue = 0;

    $('.colRegHours').each(function () {
      var chkbidwithLine = Number($(this).val()) || 0;
      totalvalue = totalvalue + chkbidwithLine;
    });

    $('.tblTimeSheet tbody tr').each(function () {
      var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
      var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
      var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
      var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
      var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
      var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
      var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g, "")) || 0;

      totalRegular = (rateValue * regHourValue) || 0;
      totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
      totalDouble = ((rateValue * 2) * doubleeValue) || 0;
      totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue + cashtipsValue) || 0;
      $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
    });
    $('.lblSumHour').text(totalvalue || 0);

  },
  'blur .colOvertime, keyup .colOvertime, change .colOvertime': function (event) {
    let templateObject = Template.instance();
    let inputUnitPrice = parseInt($(event.target).val()) || 0;
    let utilityService = new UtilityService();
    let totalvalue = 0;

    $('.colOvertime').each(function () {
      var chkbidwithLine = Number($(this).val()) || 0;
      totalvalue = totalvalue + chkbidwithLine;
    });

    $('.tblTimeSheet tbody tr').each(function () {
      var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
      var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
      var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
      var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
      var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
      var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
      var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g, "")) || 0;

      totalRegular = (rateValue * regHourValue) || 0;
      totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
      totalDouble = ((rateValue * 2) * doubleeValue) || 0;
      totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue + cashtipsValue) || 0;
      $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
    });
    $('.lblSumOvertime').text(totalvalue || 0);

  },
  'blur .colDouble, keyup .colDouble, change .colDouble': function (event) {
    let templateObject = Template.instance();
    let inputUnitPrice = parseInt($(event.target).val()) || 0;
    let utilityService = new UtilityService();
    let totalvalue = 0;

    $('.colDouble').each(function () {
      var chkbidwithLine = Number($(this).val()) || 0;
      totalvalue = totalvalue + chkbidwithLine;
    });

    $('.tblTimeSheet tbody tr').each(function () {
      var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
      var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
      var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
      var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
      var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
      var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
      var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g, "")) || 0;

      totalRegular = (rateValue * regHourValue) || 0;
      totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
      totalDouble = ((rateValue * 2) * doubleeValue) || 0;
      totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue + cashtipsValue) || 0;
      $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
    });
    $('.lblSumDouble').text(totalvalue || 0);

  },
  'blur .colAdditional, keyup .colAdditional, change .colAdditional': function (event) {
    let templateObject = Template.instance();
    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
    let utilityService = new UtilityService();
    let totalvalue = 0;

    $('.colAdditional').each(function () {
      var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
      totalvalue = totalvalue + chkbidwithLine;
    });

    $('.tblTimeSheet tbody tr').each(function () {
      var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
      var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
      var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
      var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
      var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
      var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
      var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g, "")) || 0;

      totalRegular = (rateValue * regHourValue) || 0;
      totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
      totalDouble = ((rateValue * 2) * doubleeValue) || 0;
      totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue + cashtipsValue) || 0;
      $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
    });
    $('.lblSumAdditions').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

  },
  'blur .colPaycheckTips, keyup .colPaycheckTips, change .colPaycheckTips': function (event) {
    let templateObject = Template.instance();
    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
    let utilityService = new UtilityService();
    let totalvalue = 0;

    $('.colPaycheckTips').each(function () {
      var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
      totalvalue = totalvalue + chkbidwithLine;
    });

    $('.tblTimeSheet tbody tr').each(function () {
      var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
      var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
      var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
      var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
      var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
      var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
      var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g, "")) || 0;

      totalRegular = (rateValue * regHourValue) || 0;
      totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
      totalDouble = ((rateValue * 2) * doubleeValue) || 0;
      totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue + cashtipsValue) || 0;
      $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
    });
    $('.lblSumPaytips').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

  },
  'blur .colCashTips, keyup .colCashTips, change .colCashTips': function (event) {
    let templateObject = Template.instance();
    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
    let utilityService = new UtilityService();
    let totalvalue = 0;

    $('.colCashTips').each(function () {
      var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
      totalvalue = totalvalue + chkbidwithLine;
    });

    $('.tblTimeSheet tbody tr').each(function () {
      var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
      var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
      var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
      var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
      var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
      var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
      var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g, "")) || 0;

      totalRegular = (rateValue * regHourValue) || 0;
      totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
      totalDouble = ((rateValue * 2) * doubleeValue) || 0;
      totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue + cashtipsValue) || 0;
      $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
    });
    $('.lblSumCashtips').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

  },
  'blur .colGrossPay, keyup .colGrossPay, change .colGrossPay': function (event) {
    let templateObject = Template.instance();
    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
    let utilityService = new UtilityService();
    let totalvalue = 0;

    $('.colGrossPay').each(function () {
      var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
      totalvalue = totalvalue + chkbidwithLine;
    });

    $('.tblTimeSheet tbody tr').each(function () {
      var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
      var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
      var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
      var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
      var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
      var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
      var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g, "")) || 0;

      totalRegular = (rateValue * regHourValue) || 0;
      totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
      totalDouble = ((rateValue * 2) * doubleeValue) || 0;
      totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue + cashtipsValue) || 0;
      $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
    });
    $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

  },
  'keydown .cashamount': function (event) {
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
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
      event.keyCode == 46 || event.keyCode == 190) {
    } else {
      event.preventDefault();
    }
  },
  // 'click .btnEditTimeSheet': function (event) {
  //     var targetID = $(event.target).closest('tr').attr('id'); // table row ID
  //     $('#edtTimesheetID').val(targetID);
  // }
  // ,
  'click #btnNewTimeSheet': function (event) {
    $('#edtTimesheetID').val('');
    $('#add-timesheet-title').text('New Timesheet');
    $('.sltEmployee').val('');
    $('.sltJob').val('');
    $('.lineEditHourlyRate').val('');
    $('.lineEditHour').val('');
    $('.lineEditTechNotes').val('');
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
