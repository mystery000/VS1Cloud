import { ReactiveVar } from "meteor/reactive-var";
import { AppointmentService } from '../appointments/appointment-service';
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
const GaugeChart = require('gauge-chart');
import { Calendar } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { SideBarService } from '../js/sidebar-service';

import "gauge-chart";

let sideBarService = new SideBarService();

Template.dashboardsales.onCreated(function () {
  this.loggedDb = new ReactiveVar("");
  const templateObject = Template.instance();
  templateObject.includeDashboard = new ReactiveVar();
  templateObject.globalSettings = new ReactiveVar([]);
  templateObject.eventdata = new ReactiveVar([]);
  templateObject.includeDashboard.set(false);

  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();
});

Template.dashboardsales.onRendered(function () {
  let templateObject = Template.instance();
  let appointmentService = new AppointmentService();
  let eventData = [];
  let globalSet = {};
  let isDashboard = Session.get("CloudDashboardModule");
  if (isDashboard) {
    templateObject.includeDashboard.set(true);
  }

  templateObject.getAllAppointmentListData = function () {
    getVS1Data('TAppointment').then(function (dataObject) {
        if (dataObject.length == 0) {
            sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function (data) {
                addVS1Data('TAppointment', JSON.stringify(data));
                $('.fullScreenSpin').css('display', 'inline-block');
                let appColor = '#00a3d3';
                let dataColor = '';
                let allEmp = templateObject.employeerecords.get();
                for (let i = 0; i < data.tappointmentex.length; i++) {

                    var employeeColor = allEmp.filter(apmt => {
                        return apmt.employeeName == data.tappointmentex[i].fields.TrainerName;
                    });

                    if (employeeColor.length > 0) {
                        appColor = employeeColor[0].color || '#00a3d3';
                    } else {
                        appColor = '#00a3d3';
                    }
                    var appointment = {
                        id: data.tappointmentex[i].fields.ID || '',
                        sortdate: data.tappointmentex[i].fields.CreationDate ? moment(data.tappointmentex[i].fields.CreationDate).format("YYYY/MM/DD") : "",
                        appointmentdate: data.tappointmentex[i].fields.CreationDate ? moment(data.tappointmentex[i].fields.CreationDate).format("DD/MM/YYYY") : "",
                        accountname: data.tappointmentex[i].fields.ClientName || '',
                        statementno: data.tappointmentex[i].fields.TrainerName || '',
                        employeename: data.tappointmentex[i].fields.TrainerName || '',
                        department: data.tappointmentex[i].fields.DeptClassName || '',
                        phone: data.tappointmentex[i].fields.Phone || '',
                        mobile: data.tappointmentex[i].fields.Mobile || '',
                        suburb: data.tappointmentex[i].fields.Suburb || '',
                        street: data.tappointmentex[i].fields.Street || '',
                        state: data.tappointmentex[i].fields.State || '',
                        country: data.tappointmentex[i].fields.Country || '',
                        zip: data.tappointmentex[i].fields.Postcode || '',
                        timelog: data.tappointmentex[i].fields.AppointmentsTimeLog || '',
                        startTime: data.tappointmentex[i].fields.StartTime.split(' ')[1] || '',
                        totalHours: data.tappointmentex[i].fields.TotalHours || 0,
                        endTime: data.tappointmentex[i].fields.EndTime.split(' ')[1] || '',
                        startDate: data.tappointmentex[i].fields.StartTime || '',
                        endDate: data.tappointmentex[i].fields.EndTime || '',
                        fromDate: data.tappointmentex[i].fields.Actual_EndTime ? moment(data.tappointmentex[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                        openbalance: data.tappointmentex[i].fields.Actual_EndTime || '',
                        aStartTime: data.tappointmentex[i].fields.Actual_StartTime.split(' ')[1] || '',
                        aEndTime: data.tappointmentex[i].fields.Actual_EndTime.split(' ')[1] || '',
                        aStartDate: data.tappointmentex[i].fields.Actual_StartTime.split(' ')[0] || '',
                        aEndDate: data.tappointmentex[i].fields.Actual_EndTime.split(' ')[0] || '',
                        actualHours: '',
                        closebalance: '',
                        rate: data.tappointmentex[i].fields.Rate || 1,
                        product: data.tappointmentex[i].fields.ProductDesc || '',
                        finished: data.tappointmentex[i].fields.Status || '',
                        //employee: data.tappointmentex[i].EndTime != '' ? moment(data.tappointmentex[i].EndTime).format("DD/MM/YYYY") : data.tappointmentex[i].EndTime,
                        notes: data.tappointmentex[i].fields.Notes || '',
                        attachments: data.tappointmentex[i].fields.Attachments || '',
                        isPaused: data.tappointmentex[i].fields.Othertxt || '',
                        msRef: data.tappointmentex[i].fields.MsRef || '',
                        custFld13: data.tappointmentex[i].fields.CUSTFLD13 || '',
                        custFld11: data.tappointmentex[i].fields.CUSTFLD11 || '',
                    };

                    let surbub = data.tappointmentex[i].fields.Suburb || '';
                    let zip = data.tappointmentex[i].fields.Postcode || '';
                    let street = data.tappointmentex[i].fields.Street || '';
                    let state = data.tappointmentex[i].fields.State || '';
                    let getAddress = data.tappointmentex[i].fields.ClientName + ',' + street + ',' + state + ',' + surbub + ' ' + zip;
                    var dataList = {
                        id: data.tappointmentex[i].fields.ID.toString() || '',
                        title: data.tappointmentex[i].fields.TrainerName + '<br>' + data.tappointmentex[i].fields.ClientName + '<br>' + street + '<br>' + surbub + '<br>' + state + ' ' + zip,
                        start: data.tappointmentex[i].fields.StartTime || '',
                        end: data.tappointmentex[i].fields.EndTime || '',
                        description: data.tappointmentex[i].fields.Notes || '',
                        color: appColor
                    };
                    if (seeOwnAppointments == true) {
                        if (data.tappointmentex[i].fields.TrainerName == Session.get('mySessionEmployee')) {
                            eventData.push(dataList);
                            appointmentList.push(appointment)
                        }
                    } else {
                        eventData.push(dataList);
                        appointmentList.push(appointment)
                    }

                }
                templateObject.appointmentrecords.set(appointmentList);
                templateObject.eventdata.set(eventData);

                updateCalendarData = eventData
                    let url = window.location.href;
                if (url.indexOf('?id') > 1) {
                    url1 = new URL(window.location.href);
                    let appID = url1.searchParams.get("id");
                    $('#frmAppointment')[0].reset();
                    $("#btnHold").prop("disabled", false);
                    $("#btnStartAppointment").prop("disabled", false);
                    $("#btnStopAppointment").prop("disabled", false);
                    $("#startTime").prop("disabled", false);
                    $("#endTime").prop("disabled", false);
                    $("#tActualStartTime").prop("disabled", false);
                    $("#tActualEndTime").prop("disabled", false);
                    $("#txtActualHoursSpent").prop("disabled", false);
                    var hours = '0';
                    var appointmentData = appointmentList;

                    var result = appointmentData.filter(apmt => {
                        return apmt.id == appID
                    });

                    if (result.length > 0) {
                        templateObject.getAllProductData();
                        if (result[0].isPaused == "Paused") {
                            $(".paused").show();
                            $("#btnHold").prop("disabled", true);
                        } else {
                            $(".paused").hide();
                            $("#btnHold").prop("disabled", false);
                        }

                        if (result[0].aEndTime != "") {
                            $("#btnHold").prop("disabled", true);
                            $("#btnStartAppointment").prop("disabled", true);
                            $("#btnStopAppointment").prop("disabled", true);
                            $("#startTime").prop("disabled", true);
                            $("#endTime").prop("disabled", true);
                            $("#tActualStartTime").prop("disabled", true);
                            $("#tActualEndTime").prop("disabled", true);
                            $("#txtActualHoursSpent").prop("disabled", true);
                        }
                        if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                            var startTime = moment(result[0].startDate.split(' ')[0] + ' ' + result[0].aStartTime);
                            var endTime = moment(result[0].endDate.split(' ')[0] + ' ' + result[0].aEndTime);
                            var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                            hours = duration.asHours();
                        }

                        document.getElementById("updateID").value = result[0].id || 0;
                        document.getElementById("appID").value = result[0].id;
                        document.getElementById("customer").value = result[0].accountname;
                        document.getElementById("phone").value = result[0].phone;
                        document.getElementById("mobile").value = result[0].mobile.replace("+", "") || result[0].phone.replace("+", "") || '';
                        document.getElementById("state").value = result[0].state;
                        document.getElementById("address").value = result[0].street;
                        if (Session.get('CloudAppointmentNotes') == true) {
                            document.getElementById("txtNotes").value = result[0].notes;
                        }
                        document.getElementById("suburb").value = result[0].suburb;
                        document.getElementById("zip").value = result[0].zip;
                        document.getElementById("country").value = result[0].country;


                        document.getElementById("product-list").value = result[0].product || '';
                        // if (result[0].product.replace(/\s/g, '') != "") {
                        //     $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');
                        //
                        // } else {
                        //     $('#product-list').prop('selectedIndex', -1);
                        // }

                        document.getElementById("employee_name").value = result[0].employeename;
                        document.getElementById("dtSODate").value = moment(result[0].startDate.split(' ')[0]).format('DD/MM/YYYY');
                        document.getElementById("dtSODate2").value = moment(result[0].endDate.split(' ')[0]).format('DD/MM/YYYY');
                        document.getElementById("startTime").value = result[0].startTime;
                        document.getElementById("endTime").value = result[0].endTime;
                        document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                        document.getElementById("tActualStartTime").value = result[0].aStartTime;
                        document.getElementById("tActualEndTime").value = result[0].aEndTime;
                        document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';

                        if (!$("#smsConfirmedFlag i.fa-check-circle").hasClass('d-none')) $("#smsConfirmedFlag i.fa-check-circle").addClass('d-none');
                        if (!$("#smsConfirmedFlag i.fa-close").hasClass('d-none')) $("#smsConfirmedFlag i.fa-close").addClass('d-none');
                        if (!$("#smsConfirmedFlag i.fa-question").hasClass('d-none')) $("#smsConfirmedFlag i.fa-question").addClass('d-none');
                        if (!$("#smsConfirmedFlag i.fa-minus-circle").hasClass('d-none')) $("#smsConfirmedFlag i.fa-minus-circle").addClass('d-none');
                        if (result[0].custFld13 === "Yes") {
                            if (result[0].custFld11 === "Yes") {
                                $("#smsConfirmedFlag i.fa-check-circle").removeClass('d-none');
                            } else {
                                if (result[0].custFld11 === "No") {
                                    $("#smsConfirmedFlag i.fa-close").removeClass('d-none');
                                } else {
                                    $("#smsConfirmedFlag i.fa-question").removeClass('d-none');
                                }
                            }
                        } else {
                            $("#smsConfirmedFlag i.fa-minus-circle").removeClass('d-none');
                        }

                        templateObject.attachmentCount.set(0);
                        if (result[0].attachments) {
                            if (result.length) {
                                templateObject.attachmentCount.set(result[0].attachments.length);
                                templateObject.uploadedFiles.set(result[0].attachments);
                            }
                        }
                        $('#event-modal').modal();
                        // this.$body.addClass('modal-open');
                    }
                }
                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
                if (templateObject.eventdata.get()) {
                  setTimeout(function () {
                    templateObject.renderNormalCalendar();
                  }, 200);
                }

                var currentDate = moment();
                var dateCurrent = new Date();
                var weekStart = currentDate.clone().startOf('isoWeek').format("YYYY-MM-DD");
                var weekEnd = currentDate.clone().endOf('isoWeek').format("YYYY-MM-DD");
                var days = [];

                let weeksOfCurrentMonth = getWeeksInMonth(dateCurrent.getFullYear(), dateCurrent.getMonth());
                var weekResults = weeksOfCurrentMonth.filter(week => {
                    return week.dates.includes(parseInt(moment(weekStart).format('DD')));
                });
                let currentDay = moment().format('dddd');
                let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                $('#here_table').append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
                $('#here_table table').append('<thead> <tr style="background-color: #EDEDED;">');
                $('#here_table thead tr').append('<th class="employeeName"></th>');

                for (let w = 0; w < daysOfTheWeek.length; w++) {
                    if (daysOfTheWeek[w] === "Sunday") {
                        if ($('#showSunday').is(":checked")) {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                        } else {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                        }

                    } else if (daysOfTheWeek[w] === "Saturday") {
                        if ($('#showSaturday').is(":checked")) {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                        } else {
                            $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                        }
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="date' + daysOfTheWeek[w].substring(0, 3) + '"></span></th>');
                    }
                }

                $('#here_table').append('</tr ></thead >');
                for (i = 0; i <= weekResults[0].dates.length; i++) {
                    days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
                }
                $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[0]).format('DD') + ' - ' + moment(days[4]).format('DD') + ', ' + moment().format('YYYY'));
                $('.sunday').attr('id', moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));
                $('.monday').attr('id', moment(weekStart).add(0, 'days').format("YYYY-MM-DD"));
                $('.tuesday').attr('id', moment(weekStart).add(1, 'days').format("YYYY-MM-DD"));
                $('.wednesday').attr('id', moment(weekStart).add(2, 'days').format("YYYY-MM-DD"));
                $('.thursday').attr('id', moment(weekStart).add(3, 'days').format("YYYY-MM-DD"));
                $('.friday').attr('id', moment(weekStart).add(4, 'days').format("YYYY-MM-DD"));
                $('.saturday').attr('id', moment(weekStart).add(5, 'days').format("YYYY-MM-DD"));

                if (LoggedCountry == "United States") {
                    $(".dateMon").text(moment(weekStart).add(0, 'days').format("MM/DD"));
                    $(".dateTue").text(moment(weekStart).add(1, 'days').format("MM/DD"));
                    $(".dateWed").text(moment(weekStart).add(2, 'days').format("MM/DD"));
                    $(".dateThu").text(moment(weekStart).add(3, 'days').format("MM/DD"));
                    $(".dateFri").text(moment(weekStart).add(4, 'days').format("MM/DD"));
                    $(".dateSat").text(moment(weekStart).add(5, 'days').format("MM/DD"));
                    $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("MM-DD"));
                } else {
                    $(".dateMon").text(moment(weekStart).add(0, 'days').format("DD/MM"));
                    $(".dateTue").text(moment(weekStart).add(1, 'days').format("DD/MM"));
                    $(".dateWed").text(moment(weekStart).add(2, 'days').format("DD/MM"));
                    $(".dateThu").text(moment(weekStart).add(3, 'days').format("DD/MM"));
                    $(".dateFri").text(moment(weekStart).add(4, 'days').format("DD/MM"));
                    $(".dateSat").text(moment(weekStart).add(5, 'days').format("DD/MM"));
                    $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("DD/MM"));
                }

                if (currentDay == "Monday" && moment().format('DD') == moment($('thead tr th.monday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.monday').addClass("currentDay");
                    });

                }

                if (currentDay == "Tuesday" && moment().format('DD') == moment($('thead tr th.tuesday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.tuesday').addClass("currentDay");
                    });

                }

                if (currentDay == "Wednesday" && moment().format('DD') == moment($('thead tr th.wednesday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.wednesday').addClass("currentDay");
                    });

                }

                if (currentDay == "Thursday" && moment().format('DD') == moment($('thead tr th.thursday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.thursday').addClass("currentDay");
                    });
                }

                if (currentDay == "Friday" && moment().format('DD') == moment($('thead tr th.friday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.friday').addClass("currentDay");
                    });

                }

                if (currentDay == "Saturday" && moment().format('DD') == moment($('thead tr th.saturday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.saturday').addClass("currentDay");
                    });

                }

                if (currentDay == "Sunday" && moment().format('DD') == moment($('thead tr th.sunday').attr('id')).format('DD')) {
                    $(document).on('DOMNodeInserted', function (e) {
                        $("#allocationTable").find('tbody tr td.sunday').addClass("currentDay");
                    });

                }

                templateObject.weeksOfMonth.set(weeksOfCurrentMonth);

                startWeek = new Date(moment(weekStart).format('YYYY-MM-DD'));

                endWeek = new Date(moment(weekEnd).format('YYYY-MM-DD'));

                //$('.fullScreenSpin').css('display', 'none');
                //if (allEmployees.length > 0) {
                for (let t = 0; t < data.tappointmentex.length; t++) {
                    let date = new Date(data.tappointmentex[t].fields.StartTime.split(' ')[0]);
                    weekDay = moment(data.tappointmentex[t].fields.StartTime.split(' ')[0]).format('dddd');

                    if (resourceChat.length > 0) {
                        if (date >= startWeek && date <= endWeek) {
                            if (seeOwnAppointments == true) {
                                if (data.tappointmentex[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                    let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                                    if (!found) {
                                        resourceColor = templateObject.employeerecords.get();

                                        var result = resourceColor.filter(apmtColor => {
                                            return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                        });
                                        let employeeColo = "'#00a3d3'";

                                        if (result.length > 0) {
                                            employeeColor = result[0].color;
                                        }

                                        var dataList = {
                                            id: data.tappointmentex[t].fields.ID,
                                            employeeName: data.tappointmentex[t].fields.TrainerName,
                                            color: employeeColor
                                        };
                                        resourceChat.push(dataList);
                                        allEmp.push(dataList);
                                    }
                                    var jobs = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        job: data.tappointmentex[t].fields.ClientName,
                                        street: data.tappointmentex[t].fields.Street,
                                        city: data.tappointmentex[t].fields.Surbub,
                                        zip: data.tappointmentex[t].fields.Postcode,
                                        day: weekDay,
                                        date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                    }

                                    resourceJob.push(jobs)
                                }
                            } else {
                                let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                                if (!found) {
                                    resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                    });
                                    let employeeColo = "'#00a3d3'";

                                    if (result.length > 0) {
                                        employeeColor = result[0].color;
                                    }

                                    var dataList = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        color: employeeColor
                                    };
                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                                var jobs = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    job: data.tappointmentex[t].fields.ClientName,
                                    street: data.tappointmentex[t].fields.Street,
                                    city: data.tappointmentex[t].fields.Surbub,
                                    zip: data.tappointmentex[t].fields.Postcode,
                                    day: weekDay,
                                    date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                }

                                resourceJob.push(jobs)

                            }
                        }
                    } else {
                        if (date >= startWeek && date <= endWeek) {
                            if (seeOwnAppointments == true) {
                                if (data.tappointmentex[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                    resourceColor = resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                    });
                                    let employeeColor = '#00a3d3';
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '';
                                    }

                                    var dataList = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        color: employeeColor
                                    };

                                    var jobs = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        job: data.tappointmentex[t].fields.ClientName,
                                        street: data.tappointmentex[t].fields.Street,
                                        city: data.tappointmentex[t].fields.Surbub,
                                        zip: data.tappointmentex[t].fields.Postcode,
                                        day: weekDay,
                                        date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                    }
                                    resourceJob.push(jobs)
                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                            } else {
                                resourceColor = resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                });
                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '';
                                }

                                var dataList = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    color: employeeColor
                                };

                                var jobs = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    job: data.tappointmentex[t].fields.ClientName,
                                    street: data.tappointmentex[t].fields.Street,
                                    city: data.tappointmentex[t].fields.Surbub,
                                    zip: data.tappointmentex[t].fields.Postcode,
                                    day: weekDay,
                                    date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                                allEmp.push(dataList);
                            }
                        }
                    }

                }

                setTimeout(function () {
                    let allEmployeesData = templateObject.employeerecords.get();
                    for (let e = 0; e < allEmployeesData.length; e++) {
                        let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                        if (!found) {
                            var dataList = {
                                id: allEmployeesData[e].id,
                                employeeName: allEmployeesData[e].employeeName,
                                color: allEmployeesData[e].color
                            };

                            resourceChat.push(dataList);
                            //allEmp.push(dataList);
                        }
                    }

                    let tableRowData = [];
                    let sundayRowData = [];
                    let mondayRowData = [];
                    var splashArrayMonday = new Array();
                    let tuesdayRowData = [];
                    let wednesdayRowData = [];
                    let thursdayRowData = [];
                    let fridayRowData = [];
                    let saturdayRowData = [];
                    let sundayRow = '';
                    let mondayRow = '';
                    let tuesdayRow = '';
                    let wednesdayRow = '';
                    let thursdayRow = '';
                    let fridayRow = '';
                    let saturdayRow = '';
                    let tableRow = '';
                    let saturdayStatus = '';
                    let sundayStatus = '';
                    for (let r = 0; r < resourceChat.length; r++) {

                        sundayRowData = [];
                        mondayRowData = [];
                        tuesdayRowData = [];
                        wednesdayRowData = [];
                        thursdayRowData = [];
                        fridayRowData = [];
                        saturdayRowData = [];
                        for (let j = 0; j < resourceJob.length; j++) {

                            if (resourceJob[j].day == 'Sunday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';
                                sundayRowData.push(sundayRow);
                            }
                            if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                mondayRowData.push(mondayRow);
                            }

                            if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                tuesdayRowData.push(tuesdayRow);
                            }

                            if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                wednesdayRowData.push(wednesdayRow);
                            }

                            if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                thursdayRowData.push(thursdayRow);
                            }

                            if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                fridayRowData.push(fridayRow);
                            }

                            if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                                saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                    '</div>' + '' +
                                    '</div>';

                                saturdayRowData.push(saturdayRow);
                            }

                        }

                        if ($('#showSaturday').is(":checked")) {
                            saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                        } else {
                            saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                        }

                        if ($('#showSunday').is(":checked")) {
                            sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                        } else {
                            sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                        }

                        tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                            '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                            sundayStatus + '' +
                            '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                            '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                            '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                            saturdayStatus + '' +
                            '</tr>';
                        tableRowData.push(tableRow);

                    }
                    //setTimeout(function () {
                    $('#here_table table').append(tableRowData);
                  //}, 500);
                    //templateObject.employeerecords.set(allEmp);
                    templateObject.resourceAllocation.set(resourceChat);
                    templateObject.resourceJobs.set(resourceJob);
                    templateObject.resourceDates.set(days);
                    $('.fullScreenSpin').css('display', 'none');

                      if ($('#showSaturday').is(":checked") && $('#showSunday').is(":checked")) {
                        $('.draggable').addClass('cardWeeekend');
                        $('.draggable').removeClass('cardHiddenWeekend');
                        $('.draggable').removeClass('cardHiddenSundayOrSaturday');
                      }

                      if($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == false){
                        $('.draggable').removeClass('cardWeeekend');
                        $('.draggable').addClass('cardHiddenWeekend');
                        $('.draggable').removeClass('cardHiddenSundayOrSaturday');
                      }

                      if(($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == true) || ($("#showSaturday").prop('checked') == true && $("#showSunday").prop('checked') == false)){
                        $('.draggable').removeClass('cardWeeekend');
                        $('.draggable').removeClass('cardHiddenWeekend');
                        $('.draggable').addClass('cardHiddenSundayOrSaturday');
                      }
                }, 500);

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
                var calendarEl = document.getElementById('calendar');
                var currentDate = new Date();
                var begunDate = moment(currentDate).format("YYYY-MM-DD");
                $("#allocationTable .sunday").addClass("hidesunday");
                $("#allocationTable .saturday").addClass("hidesaturday");
                $("#allocationTable > thead > tr> th").removeClass("fullWeek");
                $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
                $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

                $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
                $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");

                //if(eventData.length > 0){
                var calendar = new Calendar(calendarEl, {
                    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                    themeSystem: 'bootstrap',
                    initialView: 'dayGridMonth',
                    hiddenDays: [0, 6], // hide Sunday and Saturday
                    customButtons: {
                        appointments: {
                            text: 'Appointment List',
                            click: function () {
                                //window.open('/appointmentlist', '_self');
                                FlowRouter.go('/appointmentlist');
                            }
                        },
                        ...refreshButton
                    },
                    headerToolbar: {
                        left: 'prev,next appointments refresh',
                        center: 'title'
                    },
                    initialDate: begunDate,
                    navLinks: true, // can click day/week names to navigate views
                    selectable: true,
                    selectMirror: true,
                    eventClick: function (arg) {
                        employeeName = arg.event._def.title;
                        populateEmployDetails(employeeName);
                        $('#event-modal').modal();
                    },
                    editable: false,
                    droppable: false, // this allows things to be dropped onto the calendar
                    dayMaxEvents: true, // allow "more" link when too many events
                    //Triggers modal once event is moved to another date within the calendar.
                    dayHeaderFormat: function (date) {
                        if (LoggedCountry == "United States") {
                            return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('MM/DD');
                        } else {
                            return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('DD/MM');
                        }

                    },
                    select: function (info) {
                      FlowRouter.go('/appointments');
                    },
                    events: [],
                    eventDidMount: function () {}
                });
                calendar.render();

                let draggableEl = document.getElementById('external-events-list');
                new Draggable(draggableEl, {
                    itemSelector: '.fc-event',
                    eventData: function (eventEl) {
                        $('#updateID').val("");
                        let employee = eventEl.textContent;
                        let empInit = employee.replace(/-?[0-9]*\.?[0-9]+/, '');
                        let employeeID = empInit.replace(/\D/g, '');
                        templateObject.empID.set(employeeID);
                        return {
                            title: eventEl.innerText,
                            duration: "0" + templateObject.empDuration.get() + ":00" || '01:00'
                        };
                    }
                });
                //}


            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tappointmentex;
            $('.fullScreenSpin').css('display', 'none');
            let appColor = '#00a3d3';
            let dataColor = '';
            let allEmp = templateObject.employeerecords.get();
            for (let i = 0; i < useData.length; i++) {
                var employeeColor = allEmp.filter(apmt => {
                    //appointmentList.employeename = employeeName;
                    return apmt.employeeName == useData[i].fields.TrainerName;
                });

                if (employeeColor.length > 0) {
                    appColor = employeeColor[0].color || '#00a3d3';
                } else {
                    appColor = '#00a3d3';
                }
                var appointment = {
                    id: useData[i].fields.ID || '',
                    sortdate: useData[i].fields.CreationDate ? moment(useData[i].fields.CreationDate).format("YYYY/MM/DD") : "",
                    appointmentdate: useData[i].fields.CreationDate ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : "",
                    accountname: useData[i].fields.ClientName || '',
                    statementno: useData[i].fields.TrainerName || '',
                    employeename: useData[i].fields.TrainerName || '',
                    department: useData[i].fields.DeptClassName || '',
                    phone: useData[i].fields.Phone || '',
                    mobile: useData[i].fields.Mobile || '',
                    suburb: useData[i].fields.Suburb || '',
                    street: useData[i].fields.Street || '',
                    state: useData[i].fields.State || '',
                    country: useData[i].fields.Country || '',
                    zip: useData[i].fields.Postcode || '',
                    timelog: useData[i].fields.AppointmentsTimeLog || '',
                    startTime: useData[i].fields.StartTime.split(' ')[1] || '',
                    totalHours: useData[i].fields.TotalHours || 0,
                    endTime: useData[i].fields.EndTime.split(' ')[1] || '',
                    startDate: useData[i].fields.StartTime || '',
                    endDate: useData[i].fields.EndTime || '',
                    fromDate: useData[i].fields.Actual_EndTime ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                    openbalance: useData[i].fields.Actual_EndTime || '',
                    aStartTime: useData[i].fields.Actual_StartTime.split(' ')[1] || '',
                    aEndTime: useData[i].fields.Actual_EndTime.split(' ')[1] || '',
                    aStartDate: useData[i].fields.Actual_StartTime.split(' ')[0] || '',
                    aEndDate: useData[i].fields.Actual_EndTime.split(' ')[0] || '',
                    actualHours: '',
                    closebalance: '',
                    rate: useData[i].fields.Rate || 1,
                    product: useData[i].fields.ProductDesc || '',
                    finished: useData[i].fields.Status || '',
                    //employee: useData[i].fields.EndTime != '' ? moment(useData[i].fields.EndTime).format("DD/MM/YYYY") : useData[i].fields.EndTime,
                    attachments: useData[i].fields.Attachments || '',
                    notes: useData[i].fields.Notes || '',
                    isPaused: useData[i].fields.Othertxt || '',
                    msRef: useData[i].fields.MsRef || '',
                    custFld13: data.tappointmentex[i].fields.CUSTFLD13 || '',
                    custFld11: data.tappointmentex[i].fields.CUSTFLD11 || '',
                };

                let surbub = useData[i].fields.Suburb || '';
                let zip = useData[i].fields.Postcode || '';
                let street = useData[i].fields.Street || '';
                let state = useData[i].fields.State || '';
                let getAddress = useData[i].fields.ClientName + ',' + street + ',' + state + ',' + surbub + ' ' + zip;
                var dataList = {
                    id: useData[i].fields.ID.toString() || '',
                    title: useData[i].fields.TrainerName + '<br>' + useData[i].fields.ClientName + '<br>' + street + '<br>' + surbub + '<br>' + state + ' ' + zip,
                    start: useData[i].fields.StartTime || '',
                    end: useData[i].fields.EndTime || '',
                    description: useData[i].fields.Notes || '',
                    color: appColor
                };
                if (seeOwnAppointments == true) {
                    if (useData[i].fields.TrainerName == Session.get('mySessionEmployee')) {
                        eventData.push(dataList);
                        appointmentList.push(appointment)
                    }
                } else {
                    eventData.push(dataList);
                    appointmentList.push(appointment)
                }
            }
            templateObject.appointmentrecords.set(appointmentList);
            templateObject.eventdata.set(eventData);
            updateCalendarData = eventData
                let url = window.location.href;
            if (url.indexOf('?id') > 1) {
                url1 = new URL(window.location.href);
                let appID = url1.searchParams.get("id");
                $('#frmAppointment')[0].reset();
                $("#btnHold").prop("disabled", false);
                $("#btnStartAppointment").prop("disabled", false);
                $("#btnStopAppointment").prop("disabled", false);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                $("#tActualStartTime").prop("disabled", false);
                $("#tActualEndTime").prop("disabled", false);
                $("#txtActualHoursSpent").prop("disabled", false);
                var hours = '0';
                var appointmentData = appointmentList;

                var result = appointmentData.filter(apmt => {
                    return apmt.id == appID
                });

                if (result.length > 0) {
                    templateObject.getAllProductData();
                    if (result[0].isPaused == "Paused") {
                        $(".paused").show();
                        $("#btnHold").prop("disabled", true);
                    } else {
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                    }

                    if (result[0].aEndTime != "") {
                        $("#btnHold").prop("disabled", true);
                        $("#btnStartAppointment").prop("disabled", true);
                        $("#btnStopAppointment").prop("disabled", true);
                        $("#startTime").prop("disabled", true);
                        $("#endTime").prop("disabled", true);
                        $("#tActualStartTime").prop("disabled", true);
                        $("#tActualEndTime").prop("disabled", true);
                        $("#txtActualHoursSpent").prop("disabled", true);
                    }
                    if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                        var startTime = moment(result[0].startDate.split(' ')[0] + ' ' + result[0].aStartTime);
                        var endTime = moment(result[0].endDate.split(' ')[0] + ' ' + result[0].aEndTime);
                        var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                        hours = duration.asHours();
                    }

                    document.getElementById("updateID").value = result[0].id || 0;
                    document.getElementById("appID").value = result[0].id;
                    document.getElementById("customer").value = result[0].accountname;
                    document.getElementById("phone").value = result[0].phone;
                    document.getElementById("mobile").value = result[0].mobile.replace("+", "") || result[0].phone.replace("+", "") || '';
                    document.getElementById("state").value = result[0].state;
                    document.getElementById("address").value = result[0].street;
                    if (Session.get('CloudAppointmentNotes') == true) {
                        document.getElementById("txtNotes").value = result[0].notes;
                    }
                    document.getElementById("suburb").value = result[0].suburb;
                    document.getElementById("zip").value = result[0].zip;
                    document.getElementById("country").value = result[0].country;

                    document.getElementById("product-list").value = result[0].product || '';
                    // if (result[0].product.replace(/\s/g, '') != "") {
                    //
                    //     $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');
                    //
                    // } else {
                    //     $('#product-list').prop('selectedIndex', -1);
                    // }
                    document.getElementById("employee_name").value = result[0].employeename;
                    document.getElementById("dtSODate").value = moment(result[0].startDate.split(' ')[0]).format('DD/MM/YYYY');
                    document.getElementById("dtSODate2").value = moment(result[0].endDate.split(' ')[0]).format('DD/MM/YYYY');
                    document.getElementById("startTime").value = result[0].startTime;
                    document.getElementById("endTime").value = result[0].endTime;
                    document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                    document.getElementById("tActualStartTime").value = result[0].aStartTime;
                    document.getElementById("tActualEndTime").value = result[0].aEndTime;
                    document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';

                    if (!$("#smsConfirmedFlag i.fa-check-circle").hasClass('d-none')) $("#smsConfirmedFlag i.fa-check-circle").addClass('d-none');
                    if (!$("#smsConfirmedFlag i.fa-close").hasClass('d-none')) $("#smsConfirmedFlag i.fa-close").addClass('d-none');
                    if (!$("#smsConfirmedFlag i.fa-question").hasClass('d-none')) $("#smsConfirmedFlag i.fa-question").addClass('d-none');
                    if (!$("#smsConfirmedFlag i.fa-minus-circle").hasClass('d-none')) $("#smsConfirmedFlag i.fa-minus-circle").addClass('d-none');
                    if (result[0].custFld13 === "Yes") {
                        if (result[0].custFld11 === "Yes") {
                            $("#smsConfirmedFlag i.fa-check-circle").removeClass('d-none');
                        } else {
                            if (result[0].custFld11 === "No") {
                                $("#smsConfirmedFlag i.fa-close").removeClass('d-none');
                            } else {
                                $("#smsConfirmedFlag i.fa-question").removeClass('d-none');
                            }
                        }
                    } else {
                        $("#smsConfirmedFlag i.fa-minus-circle").removeClass('d-none');
                    }

                    templateObject.attachmentCount.set(0);
                    if (result[0].attachments) {
                        if (result.length) {
                            templateObject.attachmentCount.set(result[0].attachments.length);
                            templateObject.uploadedFiles.set(result[0].attachments);
                        }
                    }
                    $('#event-modal').modal();
                    // this.$body.addClass('modal-open');
                }
            }

            $("#allocationTable > thead > tr> th").removeClass("fullWeek");
            $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

            $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
            $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

            $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
            $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
            templateObject.renderNormalCalendar();
            var currentDate = moment();
            var dateCurrent = new Date();
            var weekStart = currentDate.clone().startOf('week').format("YYYY-MM-DD");
            var weekEnd = currentDate.clone().endOf('week').format("YYYY-MM-DD");

            var days = [];

            let weeksOfCurrentMonth = getWeeksInMonth(dateCurrent.getFullYear(), dateCurrent.getMonth());
            var weekResults = weeksOfCurrentMonth.filter(week => {
                return week.dates.includes(parseInt(moment(weekStart).format('DD')));
            });
            let currentDay = moment().format('dddd');
            let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            $('#here_table').append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
            $('#here_table table').append('<thead> <tr style="background-color: #EDEDED;">');
            $('#here_table thead tr').append('<th class="employeeName"></th>');

            for (let w = 0; w < daysOfTheWeek.length; w++) {
                if (daysOfTheWeek[w] === "Sunday") {
                    if ($('#showSunday').is(":checked")) {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    }

                } else if (daysOfTheWeek[w] === "Saturday") {
                    if ($('#showSaturday').is(":checked")) {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                    }
                } else {
                    $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="date' + daysOfTheWeek[w].substring(0, 3) + '"></span></th>');
                }

            }
            $('#here_table').append('</tr ></thead >');

            for (i = 0; i <= weekResults[0].dates.length; i++) {
                days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
            }
            //$(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[0]).format('DD') + ' - ' + moment(days[4]).format('DD') + ', ' + moment().format('YYYY'));
            if ($('#showSaturday').is(":checked") && $('#showSunday').is(":checked")) {
              $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[0]).format('DD') + ' - ' + moment(days[6]).format('DD') + ', ' + moment().format('YYYY'));
            }

            if($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == false){
              $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[1]).format('DD') + ' - ' + moment(days[5]).format('DD') + ', ' + moment().format('YYYY'));
            }

            if(($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == true)){
              $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[0]).format('DD') + ' - ' + moment(days[5]).format('DD') + ', ' + moment().format('YYYY'));
            }

            if(($("#showSaturday").prop('checked') == true && $("#showSunday").prop('checked') == false)){
              $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[1]).format('DD') + ' - ' + moment(days[6]).format('DD') + ', ' + moment().format('YYYY'));
            }


            //$('.sunday').attr('id', moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));
            $('.sunday').attr('id', moment(weekStart).add(0, 'days').format("YYYY-MM-DD"));
            $('.monday').attr('id', moment(weekStart).add(1, 'days').format("YYYY-MM-DD"));
            $('.tuesday').attr('id', moment(weekStart).add(2, 'days').format("YYYY-MM-DD"));
            $('.wednesday').attr('id', moment(weekStart).add(3, 'days').format("YYYY-MM-DD"));
            $('.thursday').attr('id', moment(weekStart).add(4, 'days').format("YYYY-MM-DD"));
            $('.friday').attr('id', moment(weekStart).add(5, 'days').format("YYYY-MM-DD"));
            $('.saturday').attr('id', moment(weekStart).add(6, 'days').format("YYYY-MM-DD"));

            if (LoggedCountry == "United States") {
                $(".dateSun").text(moment(weekStart).add(0, 'days').format("MM/DD"));
                $(".dateMon").text(moment(weekStart).add(1, 'days').format("MM/DD"));
                $(".dateTue").text(moment(weekStart).add(2, 'days').format("MM/DD"));
                $(".dateWed").text(moment(weekStart).add(3, 'days').format("MM/DD"));
                $(".dateThu").text(moment(weekStart).add(4, 'days').format("MM/DD"));
                $(".dateFri").text(moment(weekStart).add(5, 'days').format("MM/DD"));
                $(".dateSat").text(moment(weekStart).add(6, 'days').format("MM/DD"));
                //$(".dateSun").text(moment(weekStart).subtract(1, 'days').format("MM-DD"));
            } else {
                $(".dateSun").text(moment(weekStart).add(0, 'days').format("DD/MM"));
                $(".dateMon").text(moment(weekStart).add(1, 'days').format("DD/MM"));
                $(".dateTue").text(moment(weekStart).add(2, 'days').format("DD/MM"));
                $(".dateWed").text(moment(weekStart).add(3, 'days').format("DD/MM"));
                $(".dateThu").text(moment(weekStart).add(4, 'days').format("DD/MM"));
                $(".dateFri").text(moment(weekStart).add(5, 'days').format("DD/MM"));
                $(".dateSat").text(moment(weekStart).add(6, 'days').format("DD/MM"));
                //$(".dateSun").text(moment(weekStart).subtract(1, 'days').format("DD/MM"));
            }

            if (currentDay == "Monday" && moment().format('DD') == moment($('thead tr th.monday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.monday').addClass("currentDay");
                });

            }

            if (currentDay == "Tuesday" && moment().format('DD') == moment($('thead tr th.tuesday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.tuesday').addClass("currentDay");
                });

            }

            if (currentDay == "Wednesday" && moment().format('DD') == moment($('thead tr th.wednesday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.wednesday').addClass("currentDay");
                });

            }

            if (currentDay == "Thursday" && moment().format('DD') == moment($('thead tr th.thursday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.thursday').addClass("currentDay");
                });
            }

            if (currentDay == "Friday" && moment().format('DD') == moment($('thead tr th.friday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.friday').addClass("currentDay");
                });

            }

            if (currentDay == "Saturday" && moment().format('DD') == moment($('thead tr th.saturday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.saturday').addClass("currentDay");
                });

            }

            if (currentDay == "Sunday" && moment().format('DD') == moment($('thead tr th.sunday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.sunday').addClass("currentDay");
                });

            }

            templateObject.weeksOfMonth.set(weeksOfCurrentMonth);

            startWeek = new Date(moment(weekStart).format('YYYY-MM-DD'));

            endWeek = new Date(moment(weekEnd).format('YYYY-MM-DD'));

            //$('.fullScreenSpin').css('display', 'none');
            //if (allEmployees.length > 0) {

            for (let t = 0; t < useData.length; t++) {
                let date = new Date(useData[t].fields.StartTime.split(' ')[0]);
                weekDay = moment(useData[t].fields.StartTime.split(' ')[0]).format('dddd');
                if (resourceChat.length > 0) {
                    if (date >= startWeek && date <= endWeek) {
                        if (seeOwnAppointments == true) {
                            if (useData[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                let found = resourceChat.some(emp => emp.employeeName == useData[t].fields.TrainerName);
                                if (!found) {
                                    resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == useData[t].fields.TrainerName
                                    });
                                    let employeeColor = '#00a3d3';
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '';
                                    }

                                    var dataList = {
                                        id: useData[t].fields.ID,
                                        employeeName: useData[t].fields.TrainerName,
                                        color: employeeColor
                                    };

                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                                var jobs = {
                                    id: useData[t].fields.ID,
                                    employeeName: useData[t].fields.TrainerName,
                                    job: useData[t].fields.ClientName,
                                    street: useData[t].fields.Street,
                                    city: useData[t].fields.Surbub,
                                    zip: useData[t].fields.Postcode,
                                    day: weekDay,
                                    date: useData[t].fields.StartTime.split(' ')[0],
                                }

                                resourceJob.push(jobs)
                            }
                        } else {
                            let found = resourceChat.some(emp => emp.employeeName == useData[t].fields.TrainerName);
                            if (!found) {
                                resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == useData[t].fields.TrainerName
                                });
                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '';
                                }

                                var dataList = {
                                    id: useData[t].fields.ID,
                                    employeeName: useData[t].fields.TrainerName,
                                    color: employeeColor
                                };

                                resourceChat.push(dataList);
                                allEmp.push(dataList);
                            }
                            var jobs = {
                                id: useData[t].fields.ID,
                                employeeName: useData[t].fields.TrainerName,
                                job: useData[t].fields.ClientName,
                                street: useData[t].fields.Street,
                                city: useData[t].fields.Surbub,
                                zip: useData[t].fields.Postcode,
                                day: weekDay,
                                date: useData[t].fields.StartTime.split(' ')[0],
                            }

                            resourceJob.push(jobs)

                        }
                    }

                } else {

                    if (date >= startWeek && date <= endWeek) {
                        if (seeOwnAppointments == true) {
                            if (useData[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                resourceColor = resourceColor = templateObject.employeerecords.get();
                                let employeeColor = '#00a3d3';
                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == useData[t].fields.TrainerName
                                });
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '';
                                }
                                var dataList = {
                                    id: useData[t].fields.ID,
                                    employeeName: useData[t].fields.TrainerName,
                                    color: employeeColor
                                };

                                var jobs = {
                                    id: useData[t].fields.ID,
                                    employeeName: useData[t].fields.TrainerName,
                                    job: useData[t].fields.ClientName,
                                    street: useData[t].fields.Street,
                                    city: useData[t].fields.Surbub,
                                    zip: useData[t].fields.Postcode,
                                    day: weekDay,
                                    date: useData[t].fields.StartTime.split(' ')[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                                allEmp.push(dataList);
                            }
                        } else {
                            resourceColor = resourceColor = templateObject.employeerecords.get();
                            let employeeColor = '#00a3d3';
                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == useData[t].fields.TrainerName
                            });
                            if (result.length > 0) {
                                employeeColor = result[0].color || '';
                            }
                            var dataList = {
                                id: useData[t].fields.ID,
                                employeeName: useData[t].fields.TrainerName,
                                color: employeeColor
                            };

                            var jobs = {
                                id: useData[t].fields.ID,
                                employeeName: useData[t].fields.TrainerName,
                                job: useData[t].fields.ClientName,
                                street: useData[t].fields.Street,
                                city: useData[t].fields.Surbub,
                                zip: useData[t].fields.Postcode,
                                day: weekDay,
                                date: useData[t].fields.StartTime.split(' ')[0],
                            }
                            resourceJob.push(jobs)
                            resourceChat.push(dataList);
                            allEmp.push(dataList);
                        }
                    }
                }

            }

            setTimeout(function () {
                let allEmployeesData = templateObject.employeerecords.get();
                for (let e = 0; e < allEmployeesData.length; e++) {
                    let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                    if (!found) {
                        var dataList = {
                            id: allEmployeesData[e].id,
                            employeeName: allEmployeesData[e].employeeName,
                            color: allEmployeesData[e].color
                        };
                        resourceChat.push(dataList);
                        //allEmp.push(dataList);
                    }
                }

                let tableRowData = [];
                let sundayRowData = [];
                let mondayRowData = [];
                var splashArrayMonday = new Array();
                let tuesdayRowData = [];
                let wednesdayRowData = [];
                let thursdayRowData = [];
                let fridayRowData = [];
                let saturdayRowData = [];
                let sundayRow = '';
                let mondayRow = '';
                let tuesdayRow = '';
                let wednesdayRow = '';
                let thursdayRow = '';
                let fridayRow = '';
                let saturdayRow = '';
                let tableRow = '';
                let saturdayStatus = '';
                let sundayStatus = '';
                for (let r = 0; r < resourceChat.length; r++) {

                    sundayRowData = [];
                    mondayRowData = [];
                    tuesdayRowData = [];
                    wednesdayRowData = [];
                    thursdayRowData = [];
                    fridayRowData = [];
                    saturdayRowData = [];
                    for (let j = 0; j < resourceJob.length; j++) {

                        if (resourceJob[j].day == 'Sunday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';
                            sundayRowData.push(sundayRow);
                        }
                        if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            mondayRowData.push(mondayRow);
                        }

                        if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            tuesdayRowData.push(tuesdayRow);
                        }

                        if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            wednesdayRowData.push(wednesdayRow);
                        }

                        if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            thursdayRowData.push(thursdayRow);
                        }

                        if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            fridayRowData.push(fridayRow);
                        }

                        if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                            saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';
                            saturdayRowData.push(saturdayRow);
                        }

                    }

                    if ($('#showSaturday').is(":checked")) {
                        saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                    } else {
                        saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                    }

                    if ($('#showSunday').is(":checked")) {
                        sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                    } else {
                        sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                    }

                    tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                        '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                        sundayStatus + '' +
                        '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                        '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                        '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                        '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                        '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                        saturdayStatus + '' +
                        '</tr>';

                    tableRowData.push(tableRow);

                }
                $('#here_table table').append(tableRowData);
                //templateObject.employeerecords.set(allEmp);
                templateObject.resourceAllocation.set(resourceChat);
                templateObject.resourceJobs.set(resourceJob);
                templateObject.resourceDates.set(days);

                if ($('#showSaturday').is(":checked") && $('#showSunday').is(":checked")) {
                  $('.draggable').addClass('cardWeeekend');
                  $('.draggable').removeClass('cardHiddenWeekend');
                  $('.draggable').removeClass('cardHiddenSundayOrSaturday');
                }

                if($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == false){
                  $('.draggable').removeClass('cardWeeekend');
                  $('.draggable').addClass('cardHiddenWeekend');
                  $('.draggable').removeClass('cardHiddenSundayOrSaturday');
                }

                if(($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == true) || ($("#showSaturday").prop('checked') == true && $("#showSunday").prop('checked') == false)){
                  $('.draggable').removeClass('cardWeeekend');
                  $('.draggable').removeClass('cardHiddenWeekend');
                  $('.draggable').addClass('cardHiddenSundayOrSaturday');
                }
                $('.fullScreenSpin').css('display', 'none');
            }, 0);

        }
    }).catch(function (err) {
        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function (data) {
            addVS1Data('TAppointment', JSON.stringify(data));
            $('.fullScreenSpin').css('display', 'inline-block');
            let appColor = '';
            let dataColor = '';
            let allEmp = templateObject.employeerecords.get();

            for (let i = 0; i < data.tappointmentex.length; i++) {

                var employeeColor = allEmp.filter(apmt => {
                    return apmt.employeeName == data.tappointmentex[i].fields.TrainerName;
                });

                if (employeeColor.length > 0) {
                    appColor = employeeColor[0].color || '#00a3d3';
                } else {
                    appColor = '#00a3d3';
                }
                var appointment = {
                    id: data.tappointmentex[i].fields.ID || '',
                    sortdate: data.tappointmentex[i].fields.CreationDate ? moment(data.tappointmentex[i].fields.CreationDate).format("YYYY/MM/DD") : "",
                    appointmentdate: data.tappointmentex[i].fields.CreationDate ? moment(data.tappointmentex[i].fields.CreationDate).format("DD/MM/YYYY") : "",
                    accountname: data.tappointmentex[i].fields.ClientName || '',
                    statementno: data.tappointmentex[i].fields.TrainerName || '',
                    employeename: data.tappointmentex[i].fields.TrainerName || '',
                    department: data.tappointmentex[i].fields.DeptClassName || '',
                    phone: data.tappointmentex[i].fields.Phone || '',
                    mobile: data.tappointmentex[i].fields.Mobile || '',
                    suburb: data.tappointmentex[i].fields.Suburb || '',
                    street: data.tappointmentex[i].fields.Street || '',
                    state: data.tappointmentex[i].fields.State || '',
                    country: data.tappointmentex[i].fields.Country || '',
                    zip: data.tappointmentex[i].fields.Postcode || '',
                    timelog: data.tappointmentex[i].fields.AppointmentsTimeLog || '',
                    startTime: data.tappointmentex[i].fields.StartTime.split(' ')[1] || '',
                    totalHours: data.tappointmentex[i].fields.TotalHours || 0,
                    endTime: data.tappointmentex[i].fields.EndTime.split(' ')[1] || '',
                    startDate: data.tappointmentex[i].fields.StartTime || '',
                    endDate: data.tappointmentex[i].fields.EndTime || '',
                    fromDate: data.tappointmentex[i].fields.Actual_EndTime ? moment(data.tappointmentex[i].fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                    openbalance: data.tappointmentex[i].fields.Actual_EndTime || '',
                    aStartTime: data.tappointmentex[i].fields.Actual_StartTime.split(' ')[1] || '',
                    aEndTime: data.tappointmentex[i].fields.Actual_EndTime.split(' ')[1] || '',
                    aStartDate: data.tappointmentex[i].fields.Actual_StartTime.split(' ')[0] || '',
                    aEndDate: data.tappointmentex[i].fields.Actual_EndTime.split(' ')[0] || '',
                    actualHours: '',
                    closebalance: '',
                    rate: data.tappointmentex[i].fields.Rate || 1,
                    product: data.tappointmentex[i].fields.ProductDesc || '',
                    finished: data.tappointmentex[i].fields.Status || '',
                    //employee: data.tappointmentex[i].EndTime != '' ? moment(data.tappointmentex[i].EndTime).format("DD/MM/YYYY") : data.tappointmentex[i].EndTime,
                    notes: data.tappointmentex[i].fields.Notes || '',
                    attachments: data.tappointmentex[i].fields.Attachments || '',
                    isPaused: data.tappointmentex[i].fields.Othertxt || '',
                    msRef: data.tappointmentex[i].fields.MsRef || '',
                    custFld13: data.tappointmentex[i].fields.CUSTFLD13 || '',
                    custFld11: data.tappointmentex[i].fields.CUSTFLD11 || '',
                };

                let surbub = data.tappointmentex[i].fields.Suburb || '';
                let zip = data.tappointmentex[i].fields.Postcode || '';
                let street = data.tappointmentex[i].fields.Street || '';
                let state = data.tappointmentex[i].fields.State || '';
                let getAddress = data.tappointmentex[i].fields.ClientName + ',' + street + ',' + state + ',' + surbub + ' ' + zip;
                var dataList = {
                    id: data.tappointmentex[i].fields.ID.toString() || '',
                    title: data.tappointmentex[i].fields.TrainerName + '<br>' + data.tappointmentex[i].fields.ClientName + '<br>' + street + '<br>' + surbub + '<br>' + state + ' ' + zip,
                    start: data.tappointmentex[i].fields.StartTime || '',
                    end: data.tappointmentex[i].fields.EndTime || '',
                    description: data.tappointmentex[i].fields.Notes || '',
                    color: appColor
                };
                if (seeOwnAppointments == true) {
                    if (data.tappointmentex[i].fields.TrainerName == Session.get('mySessionEmployee')) {
                        eventData.push(dataList);
                        appointmentList.push(appointment)
                    }
                } else {
                    eventData.push(dataList);
                    appointmentList.push(appointment)
                }

            }
            templateObject.appointmentrecords.set(appointmentList);
            templateObject.eventdata.set(eventData);

            updateCalendarData = eventData
                let url = window.location.href;
            if (url.indexOf('?id') > 1) {
                url1 = new URL(window.location.href);
                let appID = url1.searchParams.get("id");
                $('#frmAppointment')[0].reset();
                $("#btnHold").prop("disabled", false);
                $("#btnStartAppointment").prop("disabled", false);
                $("#btnStopAppointment").prop("disabled", false);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                $("#tActualStartTime").prop("disabled", false);
                $("#tActualEndTime").prop("disabled", false);
                $("#txtActualHoursSpent").prop("disabled", false);
                var hours = '0';
                var appointmentData = appointmentList;

                var result = appointmentData.filter(apmt => {
                    return apmt.id == appID
                });
                if (result.length > 0) {
                    templateObject.getAllProductData();
                    if (result[0].isPaused == "Paused") {
                        $(".paused").show();
                        $("#btnHold").prop("disabled", true);
                    } else {
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                    }

                    if (result[0].aEndTime != "") {
                        $("#btnHold").prop("disabled", true);
                        $("#btnStartAppointment").prop("disabled", true);
                        $("#btnStopAppointment").prop("disabled", true);
                        $("#startTime").prop("disabled", true);
                        $("#endTime").prop("disabled", true);
                        $("#tActualStartTime").prop("disabled", true);
                        $("#tActualEndTime").prop("disabled", true);
                        $("#txtActualHoursSpent").prop("disabled", true);
                    }
                    if (result[0].aStartTime != '' && result[0].aEndTime != '') {
                        var startTime = moment(result[0].startDate.split(' ')[0] + ' ' + result[0].aStartTime);
                        var endTime = moment(result[0].endDate.split(' ')[0] + ' ' + result[0].aEndTime);
                        var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                        hours = duration.asHours();
                    }

                    document.getElementById("updateID").value = result[0].id || 0;
                    document.getElementById("appID").value = result[0].id;
                    document.getElementById("customer").value = result[0].accountname;
                    document.getElementById("phone").value = result[0].phone;
                    document.getElementById("mobile").value = result[0].mobile.replace("+", "") || result[0].phone.replace("+", "") || '';
                    document.getElementById("state").value = result[0].state;
                    document.getElementById("address").value = result[0].street;
                    if (Session.get('CloudAppointmentNotes') == true) {
                        document.getElementById("txtNotes").value = result[0].notes;
                    }
                    document.getElementById("suburb").value = result[0].suburb;
                    document.getElementById("zip").value = result[0].zip;
                    document.getElementById("country").value = result[0].country;
                    document.getElementById("product-list").value = result[0].product || '';
                    // if (result[0].product.replace(/\s/g, '') != "") {
                    //     $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');
                    //
                    // } else {
                    //     $('#product-list').prop('selectedIndex', -1);
                    // }
                    document.getElementById("employee_name").value = result[0].employeename;
                    document.getElementById("dtSODate").value = moment(result[0].startDate.split(' ')[0]).format('DD/MM/YYYY');
                    document.getElementById("dtSODate2").value = moment(result[0].endDate.split(' ')[0]).format('DD/MM/YYYY');
                    document.getElementById("startTime").value = result[0].startTime;
                    document.getElementById("endTime").value = result[0].endTime;
                    document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                    document.getElementById("tActualStartTime").value = result[0].aStartTime;
                    document.getElementById("tActualEndTime").value = result[0].aEndTime;
                    document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || '';

                    if (!$("#smsConfirmedFlag i.fa-check-circle").hasClass('d-none')) $("#smsConfirmedFlag i.fa-check-circle").addClass('d-none');
                    if (!$("#smsConfirmedFlag i.fa-close").hasClass('d-none')) $("#smsConfirmedFlag i.fa-close").addClass('d-none');
                    if (!$("#smsConfirmedFlag i.fa-question").hasClass('d-none')) $("#smsConfirmedFlag i.fa-question").addClass('d-none');
                    if (!$("#smsConfirmedFlag i.fa-minus-circle").hasClass('d-none')) $("#smsConfirmedFlag i.fa-minus-circle").addClass('d-none');
                    if (result[0].custFld13 === "Yes") {
                        if (result[0].custFld11 === "Yes") {
                            $("#smsConfirmedFlag i.fa-check-circle").removeClass('d-none');
                        } else {
                            if (result[0].custFld11 === "No") {
                                $("#smsConfirmedFlag i.fa-close").removeClass('d-none');
                            } else {
                                $("#smsConfirmedFlag i.fa-question").removeClass('d-none');
                            }
                        }
                    } else {
                        $("#smsConfirmedFlag i.fa-minus-circle").removeClass('d-none');
                    }

                    templateObject.attachmentCount.set(0);
                    if (result[0].attachments) {
                        if (result.length) {
                            templateObject.attachmentCount.set(result[0].attachments.length);
                            templateObject.uploadedFiles.set(result[0].attachments);
                        }
                    }
                    $('#event-modal').modal();
                    // this.$body.addClass('modal-open');
                }
            }
            $("#allocationTable > thead > tr> th").removeClass("fullWeek");
            $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

            $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
            $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

            $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
            $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
            if (templateObject.eventdata.get()) {
                templateObject.renderNormalCalendar();
            }

            var currentDate = moment();
            var dateCurrent = new Date();
            var weekStart = currentDate.clone().startOf('isoWeek').format("YYYY-MM-DD");
            var weekEnd = currentDate.clone().endOf('isoWeek').format("YYYY-MM-DD");
            var days = [];

            let weeksOfCurrentMonth = getWeeksInMonth(dateCurrent.getFullYear(), dateCurrent.getMonth());
            var weekResults = weeksOfCurrentMonth.filter(week => {
                return week.dates.includes(parseInt(moment(weekStart).format('DD')));
            });
            let currentDay = moment().format('dddd');
            let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            $('#here_table').append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
            $('#here_table table').append('<thead> <tr style="background-color: #EDEDED;">');
            $('#here_table thead tr').append('<th class="employeeName"></th>');

            for (let w = 0; w < daysOfTheWeek.length; w++) {
                if (daysOfTheWeek[w] === "Sunday") {
                    if ($('#showSunday').is(":checked")) {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesunday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSun"></span></th>');
                    }

                } else if (daysOfTheWeek[w] === "Saturday") {
                    if ($('#showSaturday').is(":checked")) {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                    } else {
                        $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + ' hidesaturday">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="dateSat"></span></th>');
                    }
                } else {
                    $('#here_table thead tr').append('<th style="padding: 6px;" id="" class="fullWeek ' + daysOfTheWeek[w].toLowerCase() + '">' + daysOfTheWeek[w].substring(0, 3) + ' <span class="date' + daysOfTheWeek[w].substring(0, 3) + '"></span></th>');
                }
            }

            $('#here_table').append('</tr ></thead >');
            for (i = 0; i <= weekResults[0].dates.length; i++) {
                days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
            }
            $(".allocationHeaderDate h2").text(moment().format('MMM') + ' ' + moment(days[0]).format('DD') + ' - ' + moment(days[4]).format('DD') + ', ' + moment().format('YYYY'));
            $('.sunday').attr('id', moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));
            $('.monday').attr('id', moment(weekStart).add(0, 'days').format("YYYY-MM-DD"));
            $('.tuesday').attr('id', moment(weekStart).add(1, 'days').format("YYYY-MM-DD"));
            $('.wednesday').attr('id', moment(weekStart).add(2, 'days').format("YYYY-MM-DD"));
            $('.thursday').attr('id', moment(weekStart).add(3, 'days').format("YYYY-MM-DD"));
            $('.friday').attr('id', moment(weekStart).add(4, 'days').format("YYYY-MM-DD"));
            $('.saturday').attr('id', moment(weekStart).add(5, 'days').format("YYYY-MM-DD"));

            if (LoggedCountry == "United States") {
                $(".dateSun").text(moment(weekStart).add(0, 'days').format("MM/DD"));
                $(".dateMon").text(moment(weekStart).add(1, 'days').format("MM/DD"));
                $(".dateTue").text(moment(weekStart).add(2, 'days').format("MM/DD"));
                $(".dateWed").text(moment(weekStart).add(3, 'days').format("MM/DD"));
                $(".dateThu").text(moment(weekStart).add(4, 'days').format("MM/DD"));
                $(".dateFri").text(moment(weekStart).add(5, 'days').format("MM/DD"));
                $(".dateSat").text(moment(weekStart).add(6, 'days').format("MM/DD"));
                // $(".dateSun").text(moment(weekStart).subtract(1, 'days').format("MM-DD"));
            } else {
                $(".dateSun").text(moment(weekStart).add(0, 'days').format("DD/MM"));
                $(".dateMon").text(moment(weekStart).add(1, 'days').format("DD/MM"));
                $(".dateTue").text(moment(weekStart).add(2, 'days').format("DD/MM"));
                $(".dateWed").text(moment(weekStart).add(3, 'days').format("DD/MM"));
                $(".dateThu").text(moment(weekStart).add(4, 'days').format("DD/MM"));
                $(".dateFri").text(moment(weekStart).add(5, 'days').format("DD/MM"));
                $(".dateSat").text(moment(weekStart).add(6, 'days').format("DD/MM"));
                //$(".dateSun").text(moment(weekStart).subtract(1, 'days').format("DD/MM"));
            }

            if (currentDay == "Monday" && moment().format('DD') == moment($('thead tr th.monday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.monday').addClass("currentDay");
                });

            }

            if (currentDay == "Tuesday" && moment().format('DD') == moment($('thead tr th.tuesday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.tuesday').addClass("currentDay");
                });

            }

            if (currentDay == "Wednesday" && moment().format('DD') == moment($('thead tr th.wednesday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.wednesday').addClass("currentDay");
                });

            }

            if (currentDay == "Thursday" && moment().format('DD') == moment($('thead tr th.thursday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.thursday').addClass("currentDay");
                });
            }

            if (currentDay == "Friday" && moment().format('DD') == moment($('thead tr th.friday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.friday').addClass("currentDay");
                });

            }

            if (currentDay == "Saturday" && moment().format('DD') == moment($('thead tr th.saturday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.saturday').addClass("currentDay");
                });

            }

            if (currentDay == "Sunday" && moment().format('DD') == moment($('thead tr th.sunday').attr('id')).format('DD')) {
                $(document).on('DOMNodeInserted', function (e) {
                    $("#allocationTable").find('tbody tr td.sunday').addClass("currentDay");
                });

            }

            templateObject.weeksOfMonth.set(weeksOfCurrentMonth);

            startWeek = new Date(moment(weekStart).format('YYYY-MM-DD'));

            endWeek = new Date(moment(weekEnd).format('YYYY-MM-DD'));

            //$('.fullScreenSpin').css('display', 'none');
            //if (allEmployees.length > 0) {
            for (let t = 0; t < data.tappointmentex.length; t++) {
                let date = new Date(data.tappointmentex[t].fields.StartTime.split(' ')[0]);
                weekDay = moment(data.tappointmentex[t].fields.StartTime.split(' ')[0]).format('dddd');

                if (resourceChat.length > 0) {
                    if (date >= startWeek && date <= endWeek) {
                        if (seeOwnAppointments == true) {
                            if (data.tappointmentex[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                                if (!found) {
                                    resourceColor = templateObject.employeerecords.get();

                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                    });
                                    let employeeColo = "'#00a3d3'";

                                    if (result.length > 0) {
                                        employeeColor = result[0].color;
                                    }

                                    var dataList = {
                                        id: data.tappointmentex[t].fields.ID,
                                        employeeName: data.tappointmentex[t].fields.TrainerName,
                                        color: employeeColor
                                    };
                                    resourceChat.push(dataList);
                                    allEmp.push(dataList);
                                }
                                var jobs = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    job: data.tappointmentex[t].fields.ClientName,
                                    street: data.tappointmentex[t].fields.Street,
                                    city: data.tappointmentex[t].fields.Surbub,
                                    zip: data.tappointmentex[t].fields.Postcode,
                                    day: weekDay,
                                    date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                }

                                resourceJob.push(jobs)
                            }
                        } else {
                            let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                            if (!found) {
                                resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                });
                                let employeeColo = "'#00a3d3'";

                                if (result.length > 0) {
                                    employeeColor = result[0].color;
                                }

                                var dataList = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    color: employeeColor
                                };
                                resourceChat.push(dataList);
                                allEmp.push(dataList);
                            }
                            var jobs = {
                                id: data.tappointmentex[t].fields.ID,
                                employeeName: data.tappointmentex[t].fields.TrainerName,
                                job: data.tappointmentex[t].fields.ClientName,
                                street: data.tappointmentex[t].fields.Street,
                                city: data.tappointmentex[t].fields.Surbub,
                                zip: data.tappointmentex[t].fields.Postcode,
                                day: weekDay,
                                date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                            }

                            resourceJob.push(jobs)

                        }
                    }
                } else {
                    if (date >= startWeek && date <= endWeek) {
                        if (seeOwnAppointments == true) {
                            if (data.tappointmentex[t].fields.TrainerName == Session.get('mySessionEmployee')) {
                                resourceColor = resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                });
                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '';
                                }

                                var dataList = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    color: employeeColor
                                };

                                var jobs = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    job: data.tappointmentex[t].fields.ClientName,
                                    street: data.tappointmentex[t].fields.Street,
                                    city: data.tappointmentex[t].fields.Surbub,
                                    zip: data.tappointmentex[t].fields.Postcode,
                                    day: weekDay,
                                    date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                                allEmp.push(dataList);
                            }
                        } else {
                            resourceColor = resourceColor = templateObject.employeerecords.get();

                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                            });
                            let employeeColor = '#00a3d3';
                            if (result.length > 0) {
                                employeeColor = result[0].color || '';
                            }

                            var dataList = {
                                id: data.tappointmentex[t].fields.ID,
                                employeeName: data.tappointmentex[t].fields.TrainerName,
                                color: employeeColor
                            };

                            var jobs = {
                                id: data.tappointmentex[t].fields.ID,
                                employeeName: data.tappointmentex[t].fields.TrainerName,
                                job: data.tappointmentex[t].fields.ClientName,
                                street: data.tappointmentex[t].fields.Street,
                                city: data.tappointmentex[t].fields.Surbub,
                                zip: data.tappointmentex[t].fields.Postcode,
                                day: weekDay,
                                date: data.tappointmentex[t].fields.StartTime.split(' ')[0],
                            }
                            resourceJob.push(jobs)
                            resourceChat.push(dataList);
                            allEmp.push(dataList);
                        }
                    }
                }

            }

            setTimeout(function () {
                let allEmployeesData = templateObject.employeerecords.get();
                for (let e = 0; e < allEmployeesData.length; e++) {
                    let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                    if (!found) {
                        var dataList = {
                            id: allEmployeesData[e].id,
                            employeeName: allEmployeesData[e].employeeName,
                            color: allEmployeesData[e].color
                        };

                        resourceChat.push(dataList);
                        //allEmp.push(dataList);
                    }
                }

                let tableRowData = [];
                let sundayRowData = [];
                let mondayRowData = [];
                var splashArrayMonday = new Array();
                let tuesdayRowData = [];
                let wednesdayRowData = [];
                let thursdayRowData = [];
                let fridayRowData = [];
                let saturdayRowData = [];
                let sundayRow = '';
                let mondayRow = '';
                let tuesdayRow = '';
                let wednesdayRow = '';
                let thursdayRow = '';
                let fridayRow = '';
                let saturdayRow = '';
                let tableRow = '';
                let saturdayStatus = '';
                let sundayStatus = '';
                for (let r = 0; r < resourceChat.length; r++) {

                    sundayRowData = [];
                    mondayRowData = [];
                    tuesdayRowData = [];
                    wednesdayRowData = [];
                    thursdayRowData = [];
                    fridayRowData = [];
                    saturdayRowData = [];
                    for (let j = 0; j < resourceJob.length; j++) {

                        if (resourceJob[j].day == 'Sunday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';
                            sundayRowData.push(sundayRow);
                        }
                        if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            mondayRowData.push(mondayRow);
                        }

                        if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            tuesdayRowData.push(tuesdayRow);
                        }

                        if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            wednesdayRowData.push(wednesdayRow);
                        }

                        if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            thursdayRowData.push(thursdayRow);
                        }

                        if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            fridayRowData.push(fridayRow);
                        }

                        if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                            saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + '' +
                                '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + '' +
                                '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + '' +
                                '</div>' + '' +
                                '</div>';

                            saturdayRowData.push(saturdayRow);
                        }

                    }

                    if ($('#showSaturday').is(":checked")) {
                        saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                    } else {
                        saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join('') + '</div></td>'
                    }

                    if ($('#showSunday').is(":checked")) {
                        sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                    } else {
                        sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join('') + '</div></td>'
                    }

                    tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + '' +
                        '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + '' +
                        sundayStatus + '' +
                        '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join('') + '</div></td>' + '' +
                        '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join('') + '</div></td>' + '' +
                        '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join('') + '</div></td>' + '' +
                        '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join('') + '</div></td>' + '' +
                        '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join('') + '</div></td>' + '' +
                        saturdayStatus + '' +
                        '</tr>';
                    tableRowData.push(tableRow);

                }
                $('#here_table table').append(tableRowData);
                //templateObject.employeerecords.set(allEmp);
                templateObject.resourceAllocation.set(resourceChat);
                templateObject.resourceJobs.set(resourceJob);
                templateObject.resourceDates.set(days);
                if ($('#showSaturday').is(":checked") && $('#showSunday').is(":checked")) {
                  $('.draggable').addClass('cardWeeekend');
                  $('.draggable').removeClass('cardHiddenWeekend');
                  $('.draggable').removeClass('cardHiddenSundayOrSaturday');
                }

                if($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == false){
                  $('.draggable').removeClass('cardWeeekend');
                  $('.draggable').addClass('cardHiddenWeekend');
                  $('.draggable').removeClass('cardHiddenSundayOrSaturday');
                }

                if(($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == true) || ($("#showSaturday").prop('checked') == true && $("#showSunday").prop('checked') == false)){
                  $('.draggable').removeClass('cardWeeekend');
                  $('.draggable').removeClass('cardHiddenWeekend');
                  $('.draggable').addClass('cardHiddenSundayOrSaturday');
                }
                $('.fullScreenSpin').css('display', 'none');
            }, 500);

        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
            var calendarEl = document.getElementById('calendar');
            var currentDate = new Date();
            var begunDate = moment(currentDate).format("YYYY-MM-DD");
            $("#allocationTable .sunday").addClass("hidesunday");
            $("#allocationTable .saturday").addClass("hidesaturday");
            $("#allocationTable > thead > tr> th").removeClass("fullWeek");
            $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");

            $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
            $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");

            $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
            $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");

            //if(eventData.length > 0){
            var calendar = new Calendar(calendarEl, {
                plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                themeSystem: 'bootstrap',
                initialView: 'dayGridMonth',
                hiddenDays: [0, 6], // hide Sunday and Saturday
                customButtons: {
                    appointments: {
                        text: 'Appointment List',
                        click: function () {
                            //window.open('/appointmentlist', '_self');
                            FlowRouter.go('/appointmentlist');
                        }
                    },
                    ...refreshButton
                },
                headerToolbar: {
                    left: 'prev,next appointments refresh',
                    center: 'title'
                },
                initialDate: begunDate,
                navLinks: true, // can click day/week names to navigate views
                selectable: true,
                selectMirror: true,
                eventClick: function (arg) {
                    employeeName = arg.event._def.title;
                    populateEmployDetails(employeeName);
                    $('#event-modal').modal();
                },
                editable: false,
                droppable: false, // this allows things to be dropped onto the calendar
                dayMaxEvents: true, // allow "more" link when too many events
                //Triggers modal once event is moved to another date within the calendar.
                dayHeaderFormat: function (date) {
                    if (LoggedCountry == "United States") {
                        return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('MM/DD');
                    } else {
                        return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('DD/MM');
                    }

                },
                select: function (info) {
                  FlowRouter.go('/appointments');
                },
                events: [],
                eventDidMount: function () {}
            });
            calendar.render();

            let draggableEl = document.getElementById('external-events-list');
            new Draggable(draggableEl, {
                itemSelector: '.fc-event',
                eventData: function (eventEl) {
                    $('#updateID').val("");
                    let employee = eventEl.textContent;
                    let empInit = employee.replace(/-?[0-9]*\.?[0-9]+/, '');
                    let employeeID = empInit.replace(/\D/g, '');
                    templateObject.empID.set(employeeID);
                    return {
                        title: eventEl.innerText,
                        duration: "0" + templateObject.empDuration.get() + ":00" || '01:00'
                    };
                }
            });
            //}


        });
    });

  };

  getVS1Data('TERPPreference').then(function (dataObject) {
    if (dataObject.length == 0) {
        appointmentService.getGlobalSettings().then(function (data) {
            templateObject.getAllAppointmentListData();
            let appEndTimeDataToLoad = '19:00';
            globalSet.defaultProduct = "";
            globalSet.id = "";
            for (let g = 0; g < data.terppreference.length; g++) {
                if (data.terppreference[g].PrefName == "ShowSundayinApptCalendar") {
                    if (data.terppreference[g].Fieldvalue == "F") {
                        globalSet.showSun = false;
                    } else if (data.terppreference[g].Fieldvalue == "T") {
                        globalSet.showSun = true;
                    } else {
                        globalSet.showSun = false;
                    }
                } else if (data.terppreference[g].PrefName == "ShowSaturdayinApptCalendar") {
                    if (data.terppreference[g].Fieldvalue == "F") {
                        globalSet.showSat = false;
                    } else if (data.terppreference[g].Fieldvalue == "T") {
                        globalSet.showSat = true;
                    } else {
                        globalSet.showSat = false;
                    }

                } else if (data.terppreference[g].PrefName == "ApptStartTime") {
                    globalSet.apptStartTime = data.terppreference[g].Fieldvalue.split(' ')[0] || "08:00";
                } else if (data.terppreference[g].PrefName == "ApptEndtime") {
                    if (data.terppreference[g].Fieldvalue.split(' ')[0] == '05:30') {
                        globalSet.apptEndTime = "17:00";
                        let timeSplit = globalSet.apptEndTime.split(':');
                        let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                        let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                        globalSet.apptEndTimeCal = appEndTimeDataToLoad || '19:30';
                    } else {
                        globalSet.apptEndTime = data.terppreference[g].Fieldvalue.split(' ')[0];
                        let timeSplit = globalSet.apptEndTime.split(':');
                        let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                        let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                        globalSet.apptEndTimeCal = appEndTimeDataToLoad || '17:00';
                        globalSet.apptEndTime = data.terppreference[g].Fieldvalue || "17:00";
                    }
                } else if (data.terppreference[g].PrefName == "DefaultApptDuration") {
                    if (data.terppreference[g].Fieldvalue == "120") {
                        globalSet.DefaultApptDuration = 2;
                    } else {
                        globalSet.DefaultApptDuration = data.terppreference[g].Fieldvalue || 2;
                    }
                } else if (data.terppreference[g].PrefName == "DefaultServiceProductID") {
                    globalSet.productID = data.terppreference[g].Fieldvalue;
                } else if (data.terppreference[g].PrefName == "ShowApptDurationin") {
                    if (data.terppreference[g].Fieldvalue == "60") {
                        globalSet.showApptDurationin = 1;
                    } else {
                        globalSet.showApptDurationin = data.terppreference[g].Fieldvalue || 1;
                    }

                } else if (data.terppreference[g].PrefName == "MinimumChargeAppointmentTime") {
                    globalSet.chargeTime = data.terppreference[g].Fieldvalue;
                } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                    globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
                } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                    globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
                }
            }

            $("#showSaturday").prop('checked', globalSet.showSat);
            $("#showSunday").prop('checked', globalSet.showSun);
            if (globalSet.showSat === false) {
                hideSat = "hidesaturday";
            }

            if (globalSet.showSun === false) {
                hideSun = "hidesunday";
            }

            if (globalSet.chargeTime) {
                $('#chargeTime').prepend('<option>' + globalSet.chargeTime + ' Hour</option>');
            }

            if (globalSet.showApptDurationin) {
                $('#showTimeIn').prepend('<option selected>' + globalSet.showApptDurationin + ' Hour</option>');
            }

            if (globalSet.DefaultApptDuration) {
                $('#defaultTime').prepend('<option selected>' + globalSet.DefaultApptDuration + ' Hour</option>');
            }

            if (globalSet.apptStartTime) {
                $('#hoursFrom').val(globalSet.apptStartTime);
            }

            if (globalSet.apptEndTime) {
                $('#hoursTo').val(globalSet.apptEndTime);
            }
            templateObject.globalSettings.set(globalSet);

            if (globalSet.productID != "") {
                appointmentService.getGlobalSettingsExtra().then(function (data) {
                    for (let p = 0; p < data.terppreferenceextra.length; p++) {
                        if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                            globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue
                        }

                        $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                        $("#productlist")[0].options[0].selected = true;
                    }
                    templateObject.globalSettings.set(globalSet);
                })
            } else {
                globalSet.defaultProduct = "";
                globalSet.id = "";
            }
        }).catch(function (err) {});
    } else {
        let data = JSON.parse(dataObject[0].data);
        templateObject.getAllAppointmentListData();
        let appEndTimeDataToLoad = '19:00';
        globalSet.defaultProduct = "";
        globalSet.id = "";
        for (let g = 0; g < data.terppreference.length; g++) {
            if (data.terppreference[g].PrefName == "ShowSundayinApptCalendar") {
                if (data.terppreference[g].Fieldvalue == "F") {
                    globalSet.showSun = false;
                } else if (data.terppreference[g].Fieldvalue == "T") {
                    globalSet.showSun = true;
                } else {
                    globalSet.showSun = false;
                }
            } else if (data.terppreference[g].PrefName == "ShowSaturdayinApptCalendar") {
                if (data.terppreference[g].Fieldvalue == "F") {
                    globalSet.showSat = false;
                } else if (data.terppreference[g].Fieldvalue == "T") {
                    globalSet.showSat = true;
                } else {
                    globalSet.showSat = false;
                }

            } else if (data.terppreference[g].PrefName == "ApptStartTime") {
                globalSet.apptStartTime = data.terppreference[g].Fieldvalue.split(' ')[0] || "08:00";
            } else if (data.terppreference[g].PrefName == "ApptEndtime") {
                if (data.terppreference[g].Fieldvalue.split(' ')[0] == '05:30') {
                    globalSet.apptEndTime = "17:00";
                    let timeSplit = globalSet.apptEndTime.split(':');
                    let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                    let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                    globalSet.apptEndTimeCal = appEndTimeDataToLoad || '19:30';
                } else {
                    globalSet.apptEndTime = data.terppreference[g].Fieldvalue.split(' ')[0];
                    let timeSplit = globalSet.apptEndTime.split(':');
                    let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                    let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                    globalSet.apptEndTimeCal = appEndTimeDataToLoad || '17:00';
                    globalSet.apptEndTime = data.terppreference[g].Fieldvalue || "17:00";
                }
            } else if (data.terppreference[g].PrefName == "DefaultApptDuration") {
                if (data.terppreference[g].Fieldvalue == "120") {
                    globalSet.DefaultApptDuration = 2;
                } else {
                    globalSet.DefaultApptDuration = data.terppreference[g].Fieldvalue || 2;
                }
            } else if (data.terppreference[g].PrefName == "DefaultServiceProductID") {
                globalSet.productID = data.terppreference[g].Fieldvalue;
            } else if (data.terppreference[g].PrefName == "ShowApptDurationin") {
                if (data.terppreference[g].Fieldvalue == "60") {
                    globalSet.showApptDurationin = 1;
                } else {
                    globalSet.showApptDurationin = data.terppreference[g].Fieldvalue || 1;
                }

            } else if (data.terppreference[g].PrefName == "MinimumChargeAppointmentTime") {
                globalSet.chargeTime = data.terppreference[g].Fieldvalue;
            } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
            } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
            }
        }

        $("#showSaturday").prop('checked', globalSet.showSat);
        $("#showSunday").prop('checked', globalSet.showSun);
        if (globalSet.showSat === false) {
            hideSat = "hidesaturday";
        }
        if (globalSet.showSun === false) {
            hideSun = "hidesunday";
        }
        if (globalSet.chargeTime) {
            $('#chargeTime').prepend('<option>' + globalSet.chargeTime + ' Hour</option>');
        }
        if (globalSet.showApptDurationin) {
            $('#showTimeIn').prepend('<option selected>' + globalSet.showApptDurationin + ' Hour</option>');
        }
        if (globalSet.DefaultApptDuration) {
            $('#defaultTime').prepend('<option selected>' + globalSet.DefaultApptDuration + ' Hour</option>');
        }
        if (globalSet.apptStartTime) {
            $('#hoursFrom').val(globalSet.apptStartTime);
        }
        if (globalSet.apptEndTime) {
            $('#hoursTo').val(globalSet.apptEndTime);
        }
        templateObject.globalSettings.set(globalSet);

        if (globalSet.productID != "") {
            getVS1Data('TERPPreferenceExtra').then(function (dataObjectExtra) {
                if (dataObjectExtra.length == 0) {
                    appointmentService.getGlobalSettingsExtra().then(function (data) {
                        for (let p = 0; p < data.terppreferenceextra.length; p++) {
                            if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                                globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue
                            }

                            $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                            $("#productlist")[0].options[0].selected = true;
                        }
                        templateObject.globalSettings.set(globalSet);
                    })
                } else {
                    let dataExtra = JSON.parse(dataObjectExtra[0].data);
                    for (let p = 0; p < dataExtra.terppreferenceextra.length; p++) {
                        if (dataExtra.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                            globalSet.defaultProduct = dataExtra.terppreferenceextra[p].fieldValue
                        }

                        $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                        $("#productlist")[0].options[0].selected = true;
                    }
                    templateObject.globalSettings.set(globalSet);
                }
            }).catch(function (err) {
                appointmentService.getGlobalSettingsExtra().then(function (data) {
                    for (let p = 0; p < data.terppreferenceextra.length; p++) {
                        if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                            globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue
                        }

                        $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                        $("#productlist")[0].options[0].selected = true;
                    }
                    templateObject.globalSettings.set(globalSet);
                })
            })
        } else {
            globalSet.defaultProduct = "";
            globalSet.id = "";
        }
    }
  }).catch(function (err) {
    console.log('$$err', err);
    appointmentService.getGlobalSettings().then(function (data) {
        templateObject.getAllAppointmentListData();
        let appEndTimeDataToLoad = '19:00';
        globalSet.defaultProduct = "";
        globalSet.id = "";
        for (let g = 0; g < data.terppreference.length; g++) {
            if (data.terppreference[g].PrefName == "ShowSundayinApptCalendar") {
                if (data.terppreference[g].Fieldvalue == "F") {
                    globalSet.showSun = false;
                } else if (data.terppreference[g].Fieldvalue == "T") {
                    globalSet.showSun = true;
                } else {
                    globalSet.showSun = false;
                }
            } else if (data.terppreference[g].PrefName == "ShowSaturdayinApptCalendar") {
                if (data.terppreference[g].Fieldvalue == "F") {
                    globalSet.showSat = false;
                } else if (data.terppreference[g].Fieldvalue == "T") {
                    globalSet.showSat = true;
                } else {
                    globalSet.showSat = false;
                }

            } else if (data.terppreference[g].PrefName == "ApptStartTime") {
                globalSet.apptStartTime = data.terppreference[g].Fieldvalue.split(' ')[0] || "08:00";
            } else if (data.terppreference[g].PrefName == "ApptEndtime") {
                if (data.terppreference[g].Fieldvalue.split(' ')[0] == '05:30') {
                    globalSet.apptEndTime = "17:00";
                    let timeSplit = globalSet.apptEndTime.split(':');
                    let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                    let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                    globalSet.apptEndTimeCal = appEndTimeDataToLoad || '19:30';
                } else {
                    globalSet.apptEndTime = data.terppreference[g].Fieldvalue.split(' ')[0];
                    let timeSplit = globalSet.apptEndTime.split(':');
                    let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                    let appEndTimeDataToLoad = appEndTimeDataHours + ':' + timeSplit[1];
                    globalSet.apptEndTimeCal = appEndTimeDataToLoad || '17:00';
                    globalSet.apptEndTime = data.terppreference[g].Fieldvalue || "17:00";
                }
            } else if (data.terppreference[g].PrefName == "DefaultApptDuration") {
                if (data.terppreference[g].Fieldvalue == "120") {
                    globalSet.DefaultApptDuration = 2;
                } else {
                    globalSet.DefaultApptDuration = data.terppreference[g].Fieldvalue || 2;
                }
            } else if (data.terppreference[g].PrefName == "DefaultServiceProductID") {
                globalSet.productID = data.terppreference[g].Fieldvalue;
            } else if (data.terppreference[g].PrefName == "ShowApptDurationin") {
                if (data.terppreference[g].Fieldvalue == "60") {
                    globalSet.showApptDurationin = 1;
                } else {
                    globalSet.showApptDurationin = data.terppreference[g].Fieldvalue || 1;
                }

            } else if (data.terppreference[g].PrefName == "MinimumChargeAppointmentTime") {
                globalSet.chargeTime = data.terppreference[g].Fieldvalue;
            } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
            } else if (data.terppreference[g].PrefName == "RoundApptDurationTo") {
                globalSet.RoundApptDurationTo = data.terppreference[g].Fieldvalue;
            }
        }

        $("#showSaturday").prop('checked', globalSet.showSat);
        $("#showSunday").prop('checked', globalSet.showSun);
        if (globalSet.showSat === false) {
            hideSat = "hidesaturday";
        }

        if (globalSet.showSun === false) {
            hideSun = "hidesunday";
        }

        if (globalSet.chargeTime) {
            $('#chargeTime').prepend('<option>' + globalSet.chargeTime + ' Hour</option>');
        }

        if (globalSet.showApptDurationin) {
            $('#showTimeIn').prepend('<option selected>' + globalSet.showApptDurationin + ' Hour</option>');
        }

        if (globalSet.DefaultApptDuration) {
            $('#defaultTime').prepend('<option selected>' + globalSet.DefaultApptDuration + ' Hour</option>');
        }

        if (globalSet.apptStartTime) {
            $('#hoursFrom').val(globalSet.apptStartTime);
        }

        if (globalSet.apptEndTime) {
            $('#hoursTo').val(globalSet.apptEndTime);
        }
        templateObject.globalSettings.set(globalSet);

        if (globalSet.productID != "") {
            appointmentService.getGlobalSettingsExtra().then(function (data) {
                for (let p = 0; p < data.terppreferenceextra.length; p++) {
                    if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                        globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue
                    }

                    $('#productlist').prepend('<option value=' + globalSet.id + '>' + globalSet.defaultProduct + '</option>');
                    $("#productlist")[0].options[0].selected = true;
                }
                templateObject.globalSettings.set(globalSet);
            })
        } else {
            globalSet.defaultProduct = "";
            globalSet.id = "";
        }
    }).catch(function (err) {});
  });
  
  function renderSPMEmployeeChart() {
    highCharts.chart('spd-employee-chart', {
      series: [{
          name: 'Employees',
          data: [101, 202, 303, 404, 505, 606]
          
      }],
      chart: {
          type: 'column'
      },
      title: {
          text: ''
      },
      subtitle: {
          text:
              'Discount Given By Employees'
      },
      xAxis: {
          categories: ['Employee 1', 'Employee 2', 'Employee 3', 'Employee 4', 'Employee 5', 'Employee 6']
      },
      yAxis: {
          allowDecimals: false,
          title: {
              text: ''
          }
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.series.name + '</b><br/>' +
                  this.point.y;
          }
      }
    });
  }

  function renderSPDCharts() {
    renderSPMEmployeeChart();
    // Properties of the gauge
    let gaugeOptions = {
      hasNeedle: true,
      needleValue: 20,
      needleColor: 'gray',
      needleUpdateSpeed: 1000,
      arcColors: ['#FE4619', '#F6961D', '#ECDB21', '#AEE12B', '#69D72D', 'lightgray'],
      arcLabels: ['200k', '400k', '600k', '800k'],
      arcDelimiters: [20, 40, 60, 80],
      rangeLabel: ['0', '100'],
      centralLabel: '',
    }
    // Drawing and updating the chart
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area1'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area2'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area3'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area4'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area5'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area6'), 400, gaugeOptions).updateNeedle(50);
  }
  setTimeout(() => renderSPDCharts(), 500);

  templateObject.fetchAppointments = function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function (dataUpdate) {
        addVS1Data('TAppointment', JSON.stringify(dataUpdate)).then(function (datareturn) {
            refreshPage();
        }).catch(function (err) {});
    }).catch(function (err) {
        refreshPage();
    });
  }

  const refreshButton = {
    refresh: {
        text: 'Refresh',
        click: function(){
            templateObject.fetchAppointments();
        }
    }
  }

  templateObject.renderCalendar = function (slotMin, slotMax, hideDays) {
    let calendarSet = templateObject.globalSettings.get();
    var calendarEl = document.getElementById('calendar');
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("YYYY-MM-DD");
    var calendar = new Calendar(calendarEl, {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
        themeSystem: 'bootstrap',
        initialView: 'dayGridMonth',
        hiddenDays: hideDays, // hide Sunday and Saturday
        longPressDelay: 100,
        customButtons: {
            appointments: {
                text: 'Appointment List',
                click: function () {
                    //window.open('/appointmentlist', '_self');
                    FlowRouter.go('/appointmentlist');
                }
            },
            ...refreshButton
        },
        headerToolbar: {
            left: 'prev,next appointments refresh',
            center: 'title'
        },
        slotMinTime: slotMin,
        slotMaxTime: slotMax,
        initialDate: begunDate,
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectMirror: true,
        dayHeaderFormat: function (date) {
            if (LoggedCountry == "United States") {
                return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('MM/DD');
            } else {
                return moment(date.date.marker).format('ddd') + ' ' + moment(date.date.marker).format('DD/MM');
            }

        },
        select: function (info) {
          FlowRouter.go('/appointments');
        },
        eventClick: function (info) {
          FlowRouter.go('/appointments');
        },
        editable: true,
        droppable: false, // this allows things to be dropped onto the calendar
        dayMaxEvents: true, // allow "more" link when too many events
        events: templateObject.eventdata.get(),
        eventDidMount: function (info) {},
        eventContent: function (event) {
            let title = document.createElement('p');
            if (event.event.title) {
                title.innerHTML = event.timeText + ' ' + event.event.title;
                title.style.backgroundColor = event.backgroundColor;
                title.style.color = "#ffffff";
            } else {
                title.innerHTML = event.timeText + ' ' + event.event.title;
            }

            let arrayOfDomNodes = [title]
            return {
                domNodes: arrayOfDomNodes
            }
        }

    });
    calendar.render();
  }
  setTimeout(() => templateObject.renderCalendar("06:00:00", "21:00:00", ''), 1000);
});

Template.dashboardsales.helpers({
  includeDashboard: () => {
    const res = Template.instance().includeDashboard.get();
    return res;
  },
  loggedDb: function () {
    return Template.instance().loggedDb.get();
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
});

// Listen to event to update reactive variable
Template.dashboardsales.events({
  
});



