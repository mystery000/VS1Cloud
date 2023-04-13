import { ContactService } from "../../contacts/contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { ProductService } from "../../product/product-service";
import { SMSService } from "../../js/sms-settings-service";
import { UtilityService } from "../../utility-service";
import "jquery-ui-dist/external/jquery/jquery";
import { SalesBoardService } from "../../js/sales-service";
import { AppointmentService } from "../../appointments/appointment-service";
import EmployeePayrollApi from "../../js/Api/EmployeePayrollApi";
//Calendar
import { Calendar } from "@fullcalendar/core";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { SideBarService } from "../../js/sidebar-service";
import "../../lib/global/indexdbstorage.js";
import ApiService from "../../js/Api/Module/ApiService";

import { Template } from 'meteor/templating';
import './calender.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let smsService = new SMSService();
let createAppointment = false;
let startAndStopAppointmentOnly = false;

Template.calender.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.appointmentrecords = new ReactiveVar([]);
    templateObject.eventdata = new ReactiveVar([]);
    templateObject.resourceAllocation = new ReactiveVar([]);
    templateObject.resourceJobs = new ReactiveVar([]);
    templateObject.resourceDates = new ReactiveVar([]);
    templateObject.weeksOfMonth = new ReactiveVar([]);
    templateObject.checkEmployee = new ReactiveVar([]);
    templateObject.calendarOptions = new ReactiveVar([]);
    templateObject.globalSettings = new ReactiveVar([]);
    templateObject.employeeOptions = new ReactiveVar([]);
    templateObject.repeatDays = new ReactiveVar([]);
    templateObject.checkRefresh = new ReactiveVar();
    templateObject.empDuration = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.defaultSMSSettings = new ReactiveVar();
    templateObject.includeAllProducts = new ReactiveVar();
    templateObject.includeAllProducts.set(true);
    templateObject.allnoninvproducts = new ReactiveVar([]);
    //templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.checkRefresh.set(false);
    templateObject.empID = new ReactiveVar();
    let dayObj = {
        saturday: 0,
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0
    };
    templateObject.repeatDays.set(dayObj);
    templateObject.toupdatelogid = new ReactiveVar();
    templateObject.createAppointment = new ReactiveVar();
    templateObject.createAppointment.set(false);

    templateObject.isAccessLevels = new ReactiveVar();
    templateObject.productFees = new ReactiveVar();
    templateObject.leaveemployeerecords = new ReactiveVar([]);

    templateObject.changedEvents = new ReactiveVar([]);
    templateObject.extraProductFees = new ReactiveVar([]);
    addVS1Data("TNewAppointment", JSON.stringify([]))
    addVS1Data("TNewLeaveRequest", JSON.stringify([]))
    templateObject.customerRecord = new ReactiveVar();
});

async function sendAppointmentEmail() {
    let customerEmailCheck = $(".customerEmail").is(":checked") ? true : false;
    let userEmailCheck = $(".userEmail").is(":checked") ? true : false;
    var emailText = $("#saveAppointmentSMSMessage").val()||'';
    // Send email to the customer

    if (customerEmailCheck == true) {
        let customerDataName = $("#customer").val();
        let customerEmail = "";
        let dataObject = await getVS1Data("TCustomerVS1");
        if (dataObject.length > 0) {
            let data = JSON.parse(dataObject[0].data);
            for (let i = 0; i < data.tcustomervs1.length; i++) {
                if (data.tcustomervs1[i].fields.Companyname === customerDataName) {
                    customerEmail = data.tcustomervs1[i].fields.Email;
                    break;
                }
            }
        }
        if (customerEmail) {
            let mailSubject = "Appointment Email";
            let mailFromName = localStorage.getItem("vs1companyName");
            let mailFrom = localStorage.getItem("VS1OrgEmail") || localStorage.getItem("VS1AdminUserName");
                var htmlmailBodyCustomer = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                    '    <tr>' +
                    '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                    '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                    '        </td>' +
                    '    </tr>' +
                    '    <tr>' +
                    '        <td style="padding: 40px 30px 40px 30px;">' +
                    '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                    // '                <tr>' +
                    // '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                    // '                        Hello there <span>' + customerDataName + '</span>,' +
                    // '                    </td>' +
                    // '                </tr>' +
                    '                <tr>' +
                    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                    '                        ' + emailText + '' +
                    '                    </td>' +
                    '                </tr>' +
                    '                <tr>' +
                    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                    '                        Kind regards,' +
                    '                        <br>' +
                    '                        ' + mailFromName + '' +
                    '                    </td>' +
                    '                </tr>' +
                    '            </table>' +
                    '        </td>' +
                    '    </tr>' +
                    '    <tr>' +
                    '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                    '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                    '                <tr>' +
                    '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                    '                        If you have any question, please do not hesitate to contact us.' +
                    '                    </td>' +
                    '                    <td align="right">' +
                    '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                    '                    </td>' +
                    '                </tr>' +
                    '            </table>' +
                    '        </td>' +
                    '    </tr>' +
                    '</table>';

            Meteor.call(
                "sendEmail", {
                    from: "" + mailFromName + " <" + mailFrom + ">",
                    to: customerEmail,
                    subject: mailSubject,
                    text: '',
                    html: htmlmailBodyCustomer,
                },
                function(error, result) {
                    if (error && error.error === "error") {
                        // window.open('/statementlist', '_self');
                    } else {
                        swal({
                            title: "SUCCESS",
                            text: "Email Sent To Customer ",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "OK",
                        });
                    }
                }
            );
        }
    }
    // Send email to the user
    if (userEmailCheck == true) {
        let employeeID = localStorage.getItem("mySessionEmployeeLoggedID");
        let employeeEmail = "";
        let employeeName = "";
        let dataObject = await getVS1Data("TEmployee");
        if (dataObject.length > 0) {
            dataObject.filter(function(arr) {
                let data = JSON.parse(arr.data)["temployee"];
                for (let i = 0; i < data.length; i++) {
                    if (employeeID == data[i].fields.ID) {
                        employeeEmail += data[i].fields.Email;
                        employeeName += data[i].fields.EmployeeName;
                        break;
                    }
                }
            });
        }
        if (employeeEmail) {
            let mailSubject = "Appointment Email";
            let mailFromName = localStorage.getItem("vs1companyName");
            let mailFrom = localStorage.getItem("VS1OrgEmail") || localStorage.getItem("VS1AdminUserName");

                var htmlmailBodyEmployee = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                    '    <tr>' +
                    '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                    '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                    '        </td>' +
                    '    </tr>' +
                    '    <tr>' +
                    '        <td style="padding: 40px 30px 40px 30px;">' +
                    '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                    // '                <tr>' +
                    // '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                    // '                        Hello there <span>' + employeeName + '</span>,' +
                    // '                    </td>' +
                    // '                </tr>' +
                    '                <tr>' +
                    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                    '                        ' + emailText + '' +
                    '                    </td>' +
                    '                </tr>' +
                    '                <tr>' +
                    '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                    '                        Kind regards,' +
                    '                        <br>' +
                    '                        ' + mailFromName + '' +
                    '                    </td>' +
                    '                </tr>' +
                    '            </table>' +
                    '        </td>' +
                    '    </tr>' +
                    '    <tr>' +
                    '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                    '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                    '                <tr>' +
                    '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                    '                        If you have any question, please do not hesitate to contact us.' +
                    '                    </td>' +
                    '                    <td align="right">' +
                    '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                    '                    </td>' +
                    '                </tr>' +
                    '            </table>' +
                    '        </td>' +
                    '    </tr>' +
                    '</table>';

            Meteor.call(
                "sendEmail", {
                    from: "" + mailFromName + " <" + mailFrom + ">",
                    to: employeeEmail,
                    subject: mailSubject,
                    text: '',
                    html: htmlmailBodyEmployee,
                },
                function(error, result) {
                    if (error && error.error === "error") {
                        // window.open('/statementlist', '_self');
                    } else {
                        swal({
                            title: "SUCCESS",
                            text: "Email Sent To User ",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "OK",
                        });
                    }
                }
            );
        }
    }
}

Template.calender.onRendered(function() {
    
    let seeOwnAppointments = localStorage.getItem('CloudAppointmentSeeOwnAppointmentsOnly__') || true;
    let templateObject = Template.instance();
    let tempObj = Template.instance();
    let contactService = new ContactService();
    let productService = new ProductService();
    let clientsService = new SalesBoardService();
    let appointmentService = new AppointmentService();
    let productList = [];
    const clientList = [];
    let eventData = [];
    let resourceChat = [];
    let resourceJob = [];
    let appointmentList = [];
    let allEmployees = [];
    let updateCalendarData = [];
    let calendarSettings = [];
    let prefObject = {};
    let globalSet = {};
    let launchAllocations = ""; 
    let calendar;
    $('#edtFrequencyDetail').css('display', 'none');
    $("#date-input,#edtWeeklyStartDate,#edtWeeklyFinishDate,#dtDueDate,#customdateone,#edtMonthlyStartDate,#edtMonthlyFinishDate,#edtDailyStartDate,#edtDailyFinishDate,#edtOneTimeOnlyDate").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        constrainInput: false,
        dateFormat: 'd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });

    getVS1Data("CloudAppointmentCreateAppointment").then(function(dataObject) {
        createAppointment = dataObject[0].data;
    }).catch(function(err) {});
    getVS1Data("CloudAppointmentStartStopAccessLevel").then(function(dataObject) {
        startAndStopAppointmentOnly = dataObject;
    }).catch(function(err) {});
    getVS1Data("CloudAppointmentAllocationLaunch").then(function(dataObject) {
        launchAllocations = dataObject;
    }).catch(function(err) {});

    function setHasFollowing(apptData,apptIdList){
        let cnt = 0;
        for (let i = 0; i < apptIdList.length; i++) {
            if (apptIdList[i].Id > apptData.fields.ID) {
                cnt++;
            }
        }
        if (cnt > 1) {
            $("#btn_follow2").css("display", "inline-block");
        } else {
            $("#btn_follow2").css("display", "none");
        }
    }

    templateObject.hasFollowings = async function() {
        var currentDate = new Date();
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        var objDetails = "";
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            var apptData = await appointmentService.getOneAppointmentdataEx(currentInvoice);
            getVS1Data("TAppointment").then(async function(dataObject) {
                if(dataObject.length == 0){
                    let appointmentService = new AppointmentService();
                    let apptIds = await appointmentService.getAllAppointmentListCount();
                    let apptIdList = apptIds.tappointmentex;
                    setHasFollowing(apptData,apptIdList)
                }else{
                    let apptIds = JSON.parse(dataObject[0].data);
                    let apptIdList = apptIds.tappointmentex;
                    setHasFollowing(apptData,apptIdList)
                }
            })
        }
    }
    templateObject.hasFollowings();

    let currentId = FlowRouter.current().context.hash;
    if (currentId == "allocationModal") {
        setTimeout(function() {
            $("#allocationModal").modal("show");
        }, 900);
    } else {
        if (launchAllocations == true) {
            setTimeout(function() {
                $("#allocationModal").modal("show");
            }, 900);
        }
    }
    if (startAndStopAppointmentOnly == true) {
        //$("#btnHold").prop("disabled", true);
    }

    if (FlowRouter.current().queryParams.leadid) {
        openAppointModalDirectly( FlowRouter.current().queryParams.leadid,templateObject,true);
    } else if (FlowRouter.current().queryParams.customerid) {
        openAppointModalDirectly(FlowRouter.current().queryParams.customerid,templateObject,true);
    } else if (FlowRouter.current().queryParams.supplierid) {
        openAppointModalDirectly(FlowRouter.current().queryParams.supplierid,templateObject,true);
    }

    templateObject.saveLeaveRequestLocalDB = async function() {
        const employeePayrolApis = new EmployeePayrollApi();
        // now we have to make the post request to save the data in database
        const employeePayrolEndpoint = employeePayrolApis.collection.findByName(employeePayrolApis.collectionNames.TLeavRequest);
        employeePayrolEndpoint.url.searchParams.append("ListType","'Detail'");
        const employeePayrolEndpointResponse = await employeePayrolEndpoint.fetch(); // here i should get from database all charts to be displayed

        if (employeePayrolEndpointResponse.ok == true) {
            const employeePayrolEndpointJsonResponse = await employeePayrolEndpointResponse.json();
            if (employeePayrolEndpointJsonResponse.tleavrequest.length) {
                await addVS1Data('TLeavRequest', JSON.stringify(employeePayrolEndpointJsonResponse))
            }
            return employeePayrolEndpointJsonResponse
        }
        return '';
    };

    function setEmployeeRecordsData(data){
        let lineItems = [];
        let lineItemObj = {};
        let totalUser = 0;
        let totAmount = 0;
        let totAmountOverDue = 0;

        for (let i = 0; i < data.temployee.length; i++) {
            let randomColor = Math.floor(Math.random() * 16777215).toString(16);
            if (randomColor.length < 6) {
                randomColor = randomColor + "6";
            }
            let selectedColor = "#" + randomColor;
            if (localStorage.getItem("mySessionEmployee") == data.temployee[i].fields.EmployeeName) {
                if (data.temployee[i].fields.CustFld8 == "false") {
                    templateObject.includeAllProducts.set(false);
                }
            }

            if (JSON.parse(JSON.parse(seeOwnAppointments)) == true) {
                if (data.temployee[i].fields.EmployeeName == localStorage.getItem("mySessionEmployee")) {
                    var dataList = {
                        id: data.temployee[i].fields.ID || "",
                        employeeName: data.temployee[i].fields.EmployeeName || "",
                        color: data.temployee[i].fields.CustFld6 || selectedColor,
                        priority: data.temployee[i].fields.CustFld5 || "0",
                        override: data.temployee[i].fields.CustFld14 || "false",
                        custFld7: data.temployee[i].fields.CustFld7 || "",
                        custFld8: data.temployee[i].fields.CustFld8 || "",
                    };
                    lineItems.push(dataList);
                    allEmployees.push(dataList);
                }
            } else {
                var dataList = {
                    id: data.temployee[i].fields.ID || "",
                    employeeName: data.temployee[i].fields.EmployeeName || "",
                    color: data.temployee[i].fields.CustFld6 || selectedColor,
                    priority: data.temployee[i].fields.CustFld5 || "0",
                    override: data.temployee[i].fields.CustFld14 || "false",
                    custFld7: data.temployee[i].fields.CustFld7 || "",
                    custFld8: data.temployee[i].fields.CustFld8 || "",
                };
                lineItems.push(dataList);
                allEmployees.push(dataList);
            }
        }
        lineItems.sort(function(a, b) {
            if (a.employeeName == "NA") {
                return 1;
            } else if (b.employeeName == "NA") {
                return -1;
            }
            return a.employeeName.toUpperCase() > b.employeeName.toUpperCase() ? 1 : -1;
        });
        templateObject.employeerecords.set(lineItems);

        if (templateObject.employeerecords.get()) {
            setTimeout(function() {
                $(".counter").text(lineItems.length + " items");
            }, 100);
        }
    }

    templateObject.getEmployeesList = async function() {
        let leaveArr = [];
        let data = []
        let dataObject = await getVS1Data('TLeavRequest')
        if (dataObject.length == 0) {
            data = await templateObject.saveLeaveRequestLocalDB();
        } else {
            data = JSON.parse(dataObject[0].data);
        }
        if (data.tleavrequest.length > 0) {
            data.tleavrequest.forEach((item) => {
                const fields = item.fields;
                if(fields.Status !== "Deleted" && fields.Active){
                    leaveArr.push(fields);
                }
            });
        }
        templateObject.leaveemployeerecords.set(leaveArr);

        getVS1Data("TEmployee").then(async function(dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllEmployeeSideData().then(function(data) {
                    setEmployeeRecordsData(data)
                }).catch(function(err) {});
            } else {
                let data = JSON.parse(dataObject[0].data);
                setEmployeeRecordsData(data)
            }
        }).catch(function(err) {
            contactService.getAllEmployeeSideData().then(function(data) {
                setEmployeeRecordsData(data)
            }).catch(function(err) {});
        });
    };
    templateObject.getEmployeesList();
    getVS1Data("TERPPreference").then(function(dataObject) {
        if (dataObject.length == 0) {
            appointmentService.getGlobalSettings().then(function(data) {
                setGlobalSettings(data);
            }).catch(function(err) {});
        } else {
            let data = JSON.parse(dataObject[0].data);
            setGlobalSettings(data);
        }
    }).catch(function(err) {
        appointmentService.getGlobalSettings().then(function(data) {
            setGlobalSettings(data);
        }).catch(function(err) {});
    });
    function setGlobalSettings(data) {
        templateObject.getAllAppointmentListData();
        let appEndTimeDataToLoad = "19:00";
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
                globalSet.apptStartTime = data.terppreference[g].Fieldvalue.split(" ")[0] || "08:00";
            } else if (data.terppreference[g].PrefName == "ApptEndtime") {
                if (data.terppreference[g].Fieldvalue.split(" ")[0] == "05:30") {
                    globalSet.apptEndTime = "17:00";
                    let timeSplit = globalSet.apptEndTime.split(":");
                    let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                    let appEndTimeDataToLoad = appEndTimeDataHours + ":" + timeSplit[1];
                    globalSet.apptEndTimeCal = appEndTimeDataToLoad || "19:30";
                } else {
                    globalSet.apptEndTime = data.terppreference[g].Fieldvalue.split(" ")[0];
                    let timeSplit = globalSet.apptEndTime.split(":");
                    let appEndTimeDataHours = parseInt(timeSplit[0]) + 2;
                    let appEndTimeDataToLoad = appEndTimeDataHours + ":" + timeSplit[1];
                    globalSet.apptEndTimeCal = appEndTimeDataToLoad || "17:00";
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
        $("#showSaturday").prop("checked", globalSet.showSat);
        $("#showSunday").prop("checked", globalSet.showSun);
        if (globalSet.showSat === false) {
            hideSat = "hidesaturday";
        }
        if (globalSet.showSun === false) {
            hideSun = "hidesunday";
        }
        if (globalSet.chargeTime) {
            $("#chargeTime").prepend("<option>" + globalSet.chargeTime + " Hour</option>");
        }

        if (globalSet.showApptDurationin) {
            $("#showTimeIn").prepend("<option selected>" + globalSet.showApptDurationin + " Hour</option>");
        }

        if (globalSet.DefaultApptDuration) {
            $("#defaultTime").prepend("<option selected>" + globalSet.DefaultApptDuration + " Hour</option>");
        }

        if (globalSet.apptStartTime) {
            $("#hoursFrom").val(globalSet.apptStartTime);
        }

        if (globalSet.apptEndTime) {
            $("#hoursTo").val(globalSet.apptEndTime);
        }
        templateObject.globalSettings.set(globalSet);

        if (globalSet.productID != "") {
            getVS1Data('TERPPreferenceExtra').then(function(dataObject) {
                if (dataObject.length == 0) {
                    sideBarService.getGlobalSettingsExtra().then(function(data) {
                        addVS1Data('TERPPreferenceExtra', JSON.stringify(data));
                        for (let p = 0; p < data.terppreferenceextra.length; p++) {
                            if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                                globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue;
                            }
                            $("#productlist").prepend('<option value="' + globalSet.id + '">' + globalSet.defaultProduct + '</option>');
                            $("#productlist")[0].options[0].selected = true;
                        }
                        templateObject.globalSettings.set(globalSet);
                    }).catch(function(err) {});
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    for (let p = 0; p < data.terppreferenceextra.length; p++) {
                        if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                            globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue;
                        }
                        $("#productlist").prepend('<option value="' + globalSet.id + '">' + globalSet.defaultProduct + '</option>');
                        $("#productlist")[0].options[0].selected = true;
                    }
                    templateObject.globalSettings.set(globalSet);
                }
            }).catch(function(err) {
                sideBarService.getGlobalSettingsExtra().then(function(data) {
                    addVS1Data('TERPPreferenceExtra', JSON.stringify(data));
                    for (let p = 0; p < data.terppreferenceextra.length; p++) {
                        if (data.terppreferenceextra[p].Prefname == "DefaultServiceProduct") {
                            globalSet.defaultProduct = data.terppreferenceextra[p].fieldValue;
                        }
                        $("#productlist").prepend('<option value="' + globalSet.id + '">' + globalSet.defaultProduct + '</option>');
                        $("#productlist")[0].options[0].selected = true;
                    }
                    templateObject.globalSettings.set(globalSet);
                }).catch(function(err) {});
            });
        } else {
            globalSet.defaultProduct = "";
            globalSet.id = "";
        }
    }

    const refreshPage = () => {
        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
            window.open(localStorage.getItem("appt_historypage"), "_self");
        } else {
            var url = FlowRouter.current().path;
            if(url === '/appointments'){
                window.open("/appointments", '_self');
            }else if(url === '/dashboardsalesmanager'){
                window.open("/dashboardsalesmanager", '_self');
            }else if(url === '/dashboardsales'){
                window.open("/dashboardsales", '_self');
            }else{
                window.open("/appointments", '_self');
            }
        }
    }

    templateObject.fetchAppointments = function() {
        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(dataUpdate) {
            addVS1Data("TAppointment", JSON.stringify(dataUpdate)).then(function(datareturn) {
                refreshPage();
            }).catch(function(err) {});
        }).catch(function(err) {
            refreshPage();
        });
    };

    const refreshButton = {
        refresh: {
            text: "Refresh",
            click: async function() {
                $(".fullScreenSpin").css("display", "inline-block");
                await templateObject.saveUpdatedEvents();
                templateObject.fetchAppointments();
            },
        },
    };
    const settingsModalButton = {
        settingsmodalbutton: {
            text: "",
            click: function() {
                $("#settingsModal").modal();
            }
        },
    };

    templateObject.saveUpdatedEvents = () => {
        new Promise(async(resolve,reject) => {
            localStorage.setItem("isFormUpdated", false);
            let updatedAppointmentEvents = await getVS1Data("TNewAppointment");
            let updatedLeaveRequestEvents = await getVS1Data("TNewLeaveRequest");
            let updatedTimeLogs = await getVS1Data("TAppointmentsTimeLog");
            if(updatedAppointmentEvents){
                let data = JSON.parse(updatedAppointmentEvents[0]?.data)
                if(data?.length !== 0){
                    for(var i = 0; i< data.length; i++){
                        let formattedEvent = {
                            type:data[i].type,
                            fields:{
                                Id:data[i].fields.Id,
                                StartTime:data[i].fields.StartTime,
                                EndTime:data[i].fields.EndTime,
                            }
                        }
                        await appointmentService.saveAppointment(formattedEvent);
                    }
                   let dataUpdate = await sideBarService.getAllAppointmentList(initialDataLoad, 0);
                    addVS1Data("TAppointment", JSON.stringify(dataUpdate));
                }
            }
            if(updatedLeaveRequestEvents){
                let data = JSON.parse(updatedLeaveRequestEvents[0]?.data)
                if(data?.length !== 0){
                    const employeePayrolApis = new EmployeePayrollApi();
                    const employeePayrolEndpoint = employeePayrolApis.collection.findByName(employeePayrolApis.collectionNames.TLeavRequest);
                    for(var i = 0; i< data.length; i++){
                        let formattedEvent = {
                            type:"TLeavRequest",
                            fields:data[i]
                        }
                        const ApiResponse = await employeePayrolEndpoint.fetch(null, {
                            method: "POST",
                            headers: ApiService.getPostHeaders(),
                            body: JSON.stringify(formattedEvent),
                        });
                        if (ApiResponse.ok == true) {
                            await templateObject.saveLeaveRequestLocalDB();
                        }
                    }
                }
            }
            if(updatedTimeLogs){
                if(updatedTimeLogs[0] && updatedTimeLogs[0].data){
                    let timeLogData = JSON.parse(updatedTimeLogs[0]?.data)
                    if(timeLogData?.length !== 0){
                        for(var i = 0; i< timeLogData.length; i++){
                            await appointmentService.saveTimeLog(timeLogData[i]);
                        }
                        let dataUpdate = await sideBarService.getAllAppointmentList(initialDataLoad, 0);
                        addVS1Data("TAppointment", JSON.stringify(dataUpdate));
                    }
                }
            }
            resolve('OK')
        })
    }

    templateObject.updateEvents = async (updatedEvent,isCreate,isLeave) => {
        localStorage.setItem("isFormUpdated", true);
        if(isCreate){
        }else{
            let events = templateObject.eventdata.get();
            if(events){
                if(isLeave){
                    let tempEvents = [...events];
                    if(tempEvents.length == 0){
                        tempEvents.push(updatedEvent.calendarData)
                    }else{
                        if(tempEvents.length !== 0){
                            let currentEventIndex = tempEvents?.findIndex((event) => event.id == updatedEvent.calendarData.id)
                            if(currentEventIndex > -1){
                                tempEvents[currentEventIndex] = updatedEvent.calendarData;
                            }else{
                                tempEvents.push(updatedEvent.calendarData)
                            }
                        }else{
                            tempEvents.push(updatedEvent.calendarData)
                        }
                    }
                    templateObject.eventdata.set(tempEvents);
                }else{
                    let formattedEvent = {
                        color: updatedEvent.fields.Color ||"",
                        description:updatedEvent.fields.Description ||"",
                        end:updatedEvent.fields.EndTime ||"",
                        id:updatedEvent.fields.Id?.toString() ||"",
                        start:updatedEvent.fields.StartTime ||"",
                        title:updatedEvent.fields.Title ||""
                    }
                    let tempEvents = [...events];
                    if(tempEvents.length == 0){
                        tempEvents.push(formattedEvent)
                    }else{
                        if(tempEvents.length !== 0){
                            let currentEventIndex = tempEvents?.findIndex((event) => event.id == updatedEvent.fields.Id.toString())
                            if(currentEventIndex > -1){
                                tempEvents[currentEventIndex] = formattedEvent;
                            }else{
                                tempEvents.push(formattedEvent)
                            }
                        }else{
                            tempEvents.push(formattedEvent)
                        }
                    }
                    templateObject.eventdata.set(tempEvents);
                }
            }
            if(isLeave){
                let tempNewLeaveRequestEvents = await getVS1Data("TNewLeaveRequest")
                if(tempNewLeaveRequestEvents){
                    if(tempNewLeaveRequestEvents.length == 0){
                        addVS1Data("TNewLeaveRequest", JSON.stringify(updatedEvent.apiData))
                    }else{
                        let data = JSON.parse(tempNewLeaveRequestEvents[0].data)
                        if(data.length !== 0){
                            let currentEventIndex = data?.findIndex((event) => event.fields.ID == updatedEvent.apiData.ID)
                            if(currentEventIndex > -1){
                                data[currentEventIndex] = updatedEvent.apiData;
                            }else{
                                data.push(updatedEvent.apiData)
                            }
                        }else{
                            data.push(updatedEvent.apiData)
                        }
                        addVS1Data("TNewLeaveRequest", JSON.stringify(data))
                    }
                }
            }else{
                let tempNewAppointmentEvents = await getVS1Data("TNewAppointment")
                if(tempNewAppointmentEvents){
                    if(tempNewAppointmentEvents.length == 0){
                        addVS1Data("TNewAppointment", JSON.stringify(updatedEvent))
                    }else{
                        let data = JSON.parse(tempNewAppointmentEvents[0].data)
                        if(data.length !== 0){
                            let currentEventIndex = data?.findIndex((event) => event.fields.Id == updatedEvent.fields.Id)
                            if(currentEventIndex > -1){
                                data[currentEventIndex] = updatedEvent;
                            }else{
                                data.push(updatedEvent)
                            }
                        }else{
                            data.push(updatedEvent)
                        }
                        addVS1Data("TNewAppointment", JSON.stringify(data))
                    }
                }
            }
        }
    }

    function evenDropAndResize(info){
        const pattern = /leave/;
        var leaveFlag = false;
        if (info.event._def.publicId != "") {
            $(".fullScreenSpin").css("display", "inline-block");
            if(pattern.test(info.event._def.publicId)){
                let leaveemployeerecords = templateObject.leaveemployeerecords.get();
                let splitId = info.event.id.split(":");
                let leaveID = splitId[2];
                let currentLeaveRequest = leaveemployeerecords.filter((item) => item.ID == leaveID);
                if(currentLeaveRequest && currentLeaveRequest.length !== 0){
                    const {
                        ID,
                        EmployeeID,
                        EmployeeName,
                        TypeOfRequest,
                        LeaveMethod,
                        Description,
                        PayPeriod,
                        Hours,
                        Status
                    } = currentLeaveRequest[0];
                    let eventColor = info.event._def.ui.backgroundColor || "";
                    let eventDescription = info.event._def.extendedProps.description || "";
                    let eventTitle = info.event._def.title
                    let dateStart = new Date(info.event.start);
                    let dateEnd = new Date(info.event.end);
                    let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                    let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                    let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                    let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ":" + ("0" + dateEnd.getMinutes()).toString().slice(-2);
                    
                    objectData = {
                        calendarData:{
                            id: info.event.id,
                            title: eventTitle,
                            start: startDate + " " + startTime + ":00" || "",
                            end: endDate + " " + endTime + ":00" || "",
                            description: eventDescription || "",
                            color: eventColor,
                        },
                        apiData:{
                            ID,
                            EmployeeID,
                            EmployeeName,
                            TypeOfRequest,
                            LeaveMethod,
                            Description,
                            StartDate: startDate + " " + startTime + ":00" || "",
                            EndDate: endDate + " " + endTime + ":00" || "",
                            PayPeriod,
                            Hours,
                            Status
                        }
                    }
                }
                templateObject.updateEvents(objectData,false,true)
            }else{
                let appointmentData = templateObject.appointmentrecords.get();
                let resourceData = templateObject.resourceAllocation.get();
                let eventDropID = info.event._def.publicId || "0";
                let eventColor = info.event._def.ui.backgroundColor || "";
                let eventDescription = info.event._def.extendedProps.description || "";
                let eventTitle = info.event._def.title
                let dateStart = new Date(info.event.start);
                let dateEnd = new Date(info.event.end);
                let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ":" + ("0" + dateEnd.getMinutes()).toString().slice(-2);
                let index = appointmentData.map(function(e) {
                        return e.id;
                    }).indexOf(parseInt(eventDropID));
                let resourceIndex = resourceData.map(function(e) {
                        return e.employeeName;
                    }).indexOf(appointmentData[index].employeename);
                var result = appointmentData.filter((apmt) => {
                    return apmt.id == eventDropID;
                });
                if (result.length > 0) {
                    objectData = {
                        type: "TAppointmentEx",
                        fields: {
                            Id: parseInt(eventDropID) || 0,
                            StartTime: startDate + " " + startTime + ":00" || "",
                            EndTime: endDate + " " + endTime + ":00" || "",
                            Description:eventDescription,
                            Color:eventColor,
                            Title:eventTitle
                        },
                    };
                    let nameid = appointmentData[index].employeename.replace(" ", "-");
                    $("#allocationTable tbody tr").each(function() {
                        if (this.id == appointmentData[index].employeename) {
                            $(this).attr("id", $(this).attr("id").replace(" ", "-"));
                        }
                    });
                    let job = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + eventDropID + '" style="margin:4px 0px; background-color: ' +
                        resourceData[resourceIndex].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                        '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' +
                        "" + '<p class="text-nowrap text-truncate" style="margin: 0px;">' + appointmentData[index].accountname + "</p>" +
                        "" + "</div>" + "" + "</div>";
                    let day = moment(startDate).format("dddd").toLowerCase();
                    appointmentData[index].startDate = startDate + " " + startTime;
                    appointmentData[index].endDate = endDate + " " + endTime;
                    templateObject.appointmentrecords.set(appointmentData);
                    $(".droppable #" + eventDropID).remove();
                    $("#" + nameid + " ." + day + " .droppable").append(job);
                    $("#allocationTable tbody tr").each(function() {
                        if (this.id == nameid) {
                            $(this).attr("id", $(this).attr("id").replace("-", " "));
                        }
                    });
                    templateObject.updateEvents(objectData,false,false)
                }
            }
            $(".fullScreenSpin").css("display", "none");
        }
    }

    function renderCalendarDropEvent(event){
        let draggedEmployeeID = templateObject.empID.get();
        let calendarData = templateObject.employeeOptions.get();
        let calendarSet = templateObject.globalSettings.get();
        let employees = templateObject.employeerecords.get();
        let overridesettings = employees.filter((employeeData) => {
            return employeeData.id == parseInt(draggedEmployeeID);
        });

        let empData = calendarData.filter((calendarOpt) => {
            return calendarOpt.EmployeeID == parseInt(draggedEmployeeID);
        });

        document.getElementById("frmAppointment").reset();
        $(".paused").hide();
        $("#btnHold").prop("disabled", false);
        $("#btnStartAppointment").prop("disabled", false);
        $("#btnStopAppointment").prop("disabled", false);
        $("#startTime").prop("disabled", false);
        $("#endTime").prop("disabled", false);
        $("#tActualStartTime").prop("disabled", false);
        $("#tActualEndTime").prop("disabled", false);
        $("#txtActualHoursSpent").prop("disabled", false);

        if (localStorage.getItem("CloudAppointmentStartStopAccessLevel") == true) {
            //$("#btnHold").prop("disabled", true);
        }
        document.getElementById("employee_name").value = event.draggedEl.innerText.replace(/[0-9]/g, "");
        var start = event.dateStr != "" ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
        document.getElementById("dtSODate").value = start;
        document.getElementById("dtSODate2").value = start;
        var startTime = moment(event.dateStr).format("HH:mm");
        document.getElementById("startTime").value = startTime;
        if (overridesettings[0].override == "false") {
            if (calendarSet.DefaultApptDuration) {
                var endTime = moment(startTime, "HH:mm").add(parseInt(calendarSet.DefaultApptDuration), "hours").format("HH:mm");
                document.getElementById("endTime").value = endTime;
                let hoursFormattedStartTime = templateObject.timeFormat(calendarSet.DefaultApptDuration) || "";
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
            } else {
                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), "HH:mm").format("HH:mm");
                var endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                document.getElementById("endTime").value = endTime;
                var hoursSpent = moment(appointmentHours, "hours").format("HH");
                let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
            }
            document.getElementById("product-list").value = calendarSet.defaultProduct || "";
            document.getElementById("product-list-1").value = calendarSet.defaultProduct || "";
            // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
            // $("#product-list")[0].options[0].selected = true;
        } else if (overridesettings[0].override == "true") {
            if (templateObject.empDuration.get() != "") {
                var endTime = moment(startTime, "HH:mm").add(parseInt(templateObject.empDuration.get()), "hours").format("HH:mm");
                document.getElementById("endTime").value = endTime;
                let hoursFormattedStartTime = templateObject.timeFormat(templateObject.empDuration.get()) || "";
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
            } else {
                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5),"HH:mm").format("HH:mm");
                var endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                document.getElementById("endTime").value = endTime;
                var hoursSpent = moment(appointmentHours, "hours").format("HH");
                let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
            }
            if (empData.length > 0) {
                document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                document.getElementById("product-list-1").value = empData[empData.length - 1].DefaultServiceProduct || "";
                // $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                // $("#product-list")[0].options[0].selected = true;
            } else {
                document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                document.getElementById("product-list-1").value = calendarSet.defaultProduct || "";
                // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                // $("#product-list")[0].options[0].selected = true;
            }
        } else {
            if (templateObject.empDuration.get() != "") {
                var endTime = moment(startTime, "HH:mm").add(parseInt(templateObject.empDuration.get()), "hours").format("HH:mm");
                document.getElementById("endTime").value = endTime;
                let hoursFormattedStartTime = templateObject.timeFormat(templateObject.empDuration.get()) || "";
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
            } else {
                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5),"HH:mm").format("HH:mm");
                var endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                document.getElementById("endTime").value = endTime;
                var hoursSpent = moment(appointmentHours, "hours").format("HH");
                let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
            }

            if (empData.length > 0) {
                document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                document.getElementById("product-list-1").value = empData[empData.length - 1].DefaultServiceProduct || "";
                // $('#product-list').prepend('<option value=' + empData[0].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                // $("#product-list")[0].options[0].selected = true;
            } else {
                document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                document.getElementById("product-list-1").value = calendarSet.defaultProduct || "";
                // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                // $("#product-list")[0].options[0].selected = true;
            }
        }

        var endTime = moment(document.getElementById("dtSODate2").value + " " + document.getElementById("endTime").value).format("DD/MM/YYYY HH:mm");
        var startTime = moment(document.getElementById("dtSODate2").value + " " + document.getElementById("startTime").value).format("DD/MM/YYYY HH:mm");
        templateObject.attachmentCount.set("");
        templateObject.uploadedFiles.set("");
        templateObject.uploadedFile.set("");

        if (FlowRouter.current().queryParams.leadid) {
            openAppointModalDirectly(FlowRouter.current().queryParams.leadid,templateObject);
        } else if (FlowRouter.current().queryParams.customerid) {
            openAppointModalDirectly(FlowRouter.current().queryParams.customerid,templateObject);
        } else if (FlowRouter.current().queryParams.supplierid) {
            openAppointModalDirectly(FlowRouter.current().queryParams.supplierid,templateObject);
        } else {
            let leaveemployeerecords = templateObject.leaveemployeerecords.get();
            var leaveFlag = false;
            let empID = $(event.draggedEl.childNodes[2].childNodes[5]).attr('id').split("_")[1];
            templateObject.empID.set(empID);
            leaveemployeerecords.forEach((item) => {
                if (item.EmployeeID == empID && new Date(event.dateStr) >= new Date(item.StartDate) && new Date(event.dateStr) <= new Date(item.EndDate)) {
                    swal(
                        "Employee is unavailable due to being on Leave",
                        "",
                        "warning"
                    );
                    leaveFlag = true;
                }
            });
            if (!leaveFlag) {
                $("#customerListModal").modal();
            }
        }
    }

    templateObject.renderCalendar = function(slotMin, slotMax, hideDays) {
        let calendarSet = templateObject.globalSettings.get();
        var calendarEl = document.getElementById("calendar");
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("YYYY-MM-DD");
        var calendar = new Calendar(calendarEl, {
            plugins: [
                interactionPlugin,
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                bootstrapPlugin,
            ],
            themeSystem: "bootstrap",
            initialView: "timeGridWeek",
            hiddenDays: hideDays, // hide Sunday and Saturday
            longPressDelay: 100,
            customButtons: {
                newappointment: {
                    text: "New Appointment",
                    click: function() {
                    },
                },
                appointments: {
                    text: "Appointment List",
                    click: function() {
                        FlowRouter.go("/appointmentlist");
                    },
                },
                allocation: {
                    text: "Allocations",
                    click: function() {
                        $("#allocationModal").modal('show');
                    },
                },
                ...refreshButton,
                ...settingsModalButton,
            },
            headerToolbar: {
                left: "prev,next today newappointment appointments allocation refresh",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,settingsmodalbutton",
            },
            buttonText: {
                today: "Today",
                dayGridMonth: "Month",
                timeGridWeek: "Week",
                timeGridDay: "Day"
            },
            slotMinTime: slotMin,
            slotMaxTime: slotMax,
            initialDate: begunDate,
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectMirror: true,
            dayHeaderFormat: function(date) {
                if (LoggedCountry == "United States") {
                    return (
                        moment(date.date.marker).format("ddd") + " " + moment(date.date.marker).format("MM/DD")
                    );
                } else {
                    return (
                        moment(date.date.marker).format("ddd") + " " + moment(date.date.marker).format("DD/MM")
                    );
                }
            },
            select: function(info) {
                $("#frmAppointment")[0].reset();
                templateObject.getAllProductData();
                $(".paused").hide();
                let dateStart = new Date(info.start);
                let dateStartForEndTime = new Date(info.start);
                let dateEnd = new Date(info.end);
                let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                dateStartForEndTime.setHours(dateStartForEndTime.getHours() + calendarSet.DefaultApptDuration || "02:00");
                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                document.getElementById("dtSODate").value = startDate;
                document.getElementById("dtSODate2").value = endDate;
                document.getElementById("startTime").value = startTime;
                document.getElementById("endTime").value = dateStartForEndTime;
                document.getElementById("employee_name").value = localStorage.getItem("mySessionEmployee");
                if (calendarSet.DefaultApptDuration) {
                    let hoursFormattedStartTime = templateObject.timeFormat(calendarSet.DefaultApptDuration) || "";
                    document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                } else {
                    let hours = templateObject.diff_hours(dateStart, dateStartForEndTime);
                    let hoursFormattedStartTime = templateObject.timeFormat(hours) || "";
                    document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                }
                templateObject.attachmentCount.set("");
                templateObject.uploadedFiles.set("");
                templateObject.uploadedFile.set("");
                if (FlowRouter.current().queryParams.leadid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.leadid,templateObject);
                } else if (FlowRouter.current().queryParams.customerid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.customerid,templateObject);
                } else if (FlowRouter.current().queryParams.supplierid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.supplierid,templateObject);
                } else {
                    $("#customerListModal").modal();
                }
            },
            eventClick: function(info) {
                initAppointmentForm();

                var hours = "0";
                var id = info.event.id;
                var appointmentData = templateObject.appointmentrecords.get();

                var result = appointmentData.filter((apmt) => {
                    return apmt.id == id;
                });
                if (result.length > 0) {
                    if (result[0].isPaused == "Paused") {
                        $(".paused").show();
                        $("#btnHold").prop("disabled", true);
                    } else {
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                    }

                    if (localStorage.getItem("CloudAppointmentStartStopAccessLevel") == true) {
                        //$("#btnHold").prop("disabled", true);
                    }

                    if (result[0].aEndTime != "" && templateObject.isAccessLevels.get() == false) {
                        $("#btnHold").prop("disabled", true);
                        $("#btnStartAppointment").prop("disabled", true);
                        $("#btnStopAppointment").prop("disabled", true);
                        $("#startTime").prop("disabled", true);
                        $("#endTime").prop("disabled", true);
                        $("#tActualStartTime").prop("disabled", true);
                        $("#tActualEndTime").prop("disabled", true);
                        $("#txtActualHoursSpent").prop("disabled", true);
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
                    templateObject.getAllProductData();
                    if (result[0].aStartTime != "" && result[0].aEndTime != "") {
                        var startTime = moment(result[0].aStartDate + " " + result[0].aStartTime);
                        var endTime = moment(result[0].aEndDate + " " + result[0].aEndTime);
                        var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                        hours = duration.asHours();
                    }

                    let hoursFormatted = templateObject.timeFormat(hours) || "";
                    let hoursFormattedStartTime = templateObject.timeFormat(result[0].totalHours) || "";
                    document.getElementById("aStartDate").value = result[0].aStartDate || "";
                    document.getElementById("updateID").value = result[0].id || 0;
                    document.getElementById("appID").value = result[0].id;
                    document.getElementById("customer").value = result[0].accountname;
                    document.getElementById("phone").value = result[0].phone;
                    document.getElementById("mobile").value = result[0].mobile.replace("+", "") || result[0].phone.replace("+", "") || "";
                    document.getElementById("state").value = result[0].state || "";
                    document.getElementById("address").value = result[0].street || "";
                    if (localStorage.getItem("CloudAppointmentNotes") == true) {
                        document.getElementById("txtNotes").value = result[0].notes;
                        document.getElementById("txtNotes-1").value = result[0].notes;
                    }
                    document.getElementById("suburb").value = result[0].suburb || "";
                    document.getElementById("zip").value = result[0].zip || "";
                    document.getElementById("country").value = result[0].country || "";
                    document.getElementById("product-list").value = result[0].product || "";
                    document.getElementById("product-list-1").value = result[0].product || "";
                    // if (result[0].product.replace(/\s/g, '') != "") {
                    //     $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');
                    //
                    // } else {
                    //     $('#product-list').prop('selectedIndex', -1);
                    // }
                    document.getElementById("employee_name").value = result[0].employeename;
                    document.getElementById("dtSODate").value = moment(result[0].startDate.split(" ")[0]).format("DD/MM/YYYY");
                    document.getElementById("dtSODate2").value = moment(result[0].endDate.split(" ")[0]).format("DD/MM/YYYY");
                    document.getElementById("startTime").value = result[0].startTime;
                    document.getElementById("endTime").value = result[0].endTime;
                    document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                    document.getElementById("tActualStartTime").value = result[0].aStartTime;
                    document.getElementById("tActualEndTime").value = result[0].aEndTime;
                    document.getElementById("txtActualHoursSpent").value = hoursFormatted || "";
                    templateObject.attachmentCount.set(0);
                    if (result[0].attachments) {
                        if (result.length) {
                            templateObject.attachmentCount.set(result[0].attachments.length);
                            templateObject.uploadedFiles.set(result[0].attachments);
                        }
                    } else {
                        templateObject.attachmentCount.set("");
                        templateObject.uploadedFiles.set("");
                        templateObject.uploadedFile.set("");
                    }

                    if (!$("#smsConfirmedFlag i.fa-check-circle").hasClass("d-none"))
                        $("#smsConfirmedFlag i.fa-check-circle").addClass("d-none");
                    if (!$("#smsConfirmedFlag i.fa-close").hasClass("d-none"))
                        $("#smsConfirmedFlag i.fa-close").addClass("d-none");
                    if (!$("#smsConfirmedFlag i.fa-question").hasClass("d-none"))
                        $("#smsConfirmedFlag i.fa-question").addClass("d-none");
                    if (!$("#smsConfirmedFlag i.fa-minus-circle").hasClass("d-none"))
                        $("#smsConfirmedFlag i.fa-minus-circle").addClass("d-none");
                    if (result[0].custFld13 === "Yes") {
                        if (result[0].custFld11 === "Yes") {
                            $("#smsConfirmedFlag i.fa-check-circle").removeClass("d-none");
                        } else {
                            if (result[0].custFld11 === "No") {
                                $("#smsConfirmedFlag i.fa-close").removeClass("d-none");
                            } else {
                                $("#smsConfirmedFlag i.fa-question").removeClass("d-none");
                            }
                        }
                    } else {
                        $("#smsConfirmedFlag i.fa-minus-circle").removeClass("d-none");
                    }

                    $("#event-modal").modal();
                    setTimeout(() => {
                        if (localStorage.getItem("smsCustomerAppt") == "false") {
                            $("#chkSMSCustomer").prop("checked", false);
                        }
                        if (localStorage.getItem("smsUserAppt") == "false") {
                            $("#chkSMSUser").prop("checked", false);
                        }
                        if (localStorage.getItem("emailCustomerAppt") == "false") {
                            $("#customerEmail").prop("checked", false);
                        }
                        if (localStorage.getItem("emailUserAppt") == "false") {
                            $("#userEmail").prop("checked", false);
                        }
                    }, 100);
                    // this.$body.addClass('modal-open');
                }
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            dayMaxEvents: true, // allow "more" link when too many events
            //Triggers modal once event is moved to another date within the calendar.
            eventDrop: function(info) {
                evenDropAndResize(info)
            },
            //Triggers modal once external object is dropped to calender.
            drop: function(event) {
                renderCalendarDropEvent(event)
            },

            events: templateObject.eventdata.get(),
            eventDidMount: function(info) {
                info.el.children[0].setAttribute("data-toggle", "tooltip");
                info.el.children[0].setAttribute("title", info.event.extendedProps.description);
                setTimeout(function() {
                    $('[data-toggle="tooltip"]').tooltip({ html: true });
                }, 500);
            },
            eventContent: function(event) {
                let title = document.createElement("p");
                if (event.event.title) {
                    title.innerHTML = event.timeText + " " + event.event.title;
                    title.style.backgroundColor = event.backgroundColor;
                    title.style.color = "#ffffff";
                    title.style.overflow = "hidden";
                } else {
                    title.innerHTML = event.timeText + " " + event.event.title;
                }

                let arrayOfDomNodes = [title];
                return {
                    domNodes: arrayOfDomNodes,
                };
            },
        });
        calendar.render();
        $('.fc-today-button').prop('disabled', false);

        setTimeout(() => {
            const child1 = document.querySelector(".fc-appointments-button");
            if (child1 != null) {
                const parent1 = child1.parentNode;
                $(parent1).css("min-width", 714).css("text-align", "center");
                $("#calendar .fc-toolbar-title").css("min-width", 275).css("text-align", "center").css("clear","both");
            }

            let url = window.location.href;
            if (url.indexOf("?id") > 1) {} else {
                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                    $("#employeeListModal").modal("show");
                }
            }
        }, 500);
    };

    templateObject.renderNormalCalendar = function() {
        let calendarSet = templateObject.globalSettings.get();
        let hideDays = "";
        let slotMin = "06:00:00";
        let slotMax = "21:00:00";
        if (calendarSet.showSat == false) {
            hideDays = [6];
        }
        if (calendarSet.apptStartTime) {
            slotMin = calendarSet.apptStartTime;
        }
        if (calendarSet.apptEndTime) {
            slotMax = calendarSet.apptEndTimeCal;
        }
        if (calendarSet.showSun == false) {
            hideDays = [0];
        }
        if (calendarSet.showSat == false && calendarSet.showSun == false) {
            hideDays = [0, 6];
        }

        var calendarEl = document.getElementById("calendar");
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("YYYY-MM-DD");
        calendar = new Calendar(calendarEl, {
            plugins: [
                interactionPlugin,
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                bootstrapPlugin,
            ],
            themeSystem: "bootstrap",
            initialView: "timeGridWeek",
            hiddenDays: hideDays, // hide Sunday and Saturday
            longPressDelay: 100,
            customButtons: {
                newappointment: {
                    text: "New Appointment",
                    click: function() {
                        $("#employeeListModal").modal("show");
                        $("#btnCopyOptions").attr("disabled", true);
                    },
                },
                appointments: {
                    text: "Appointment List",
                    click: function() {
                        FlowRouter.go("/appointmentlist");
                    },
                },
                allocation: {
                    text: "Allocations",
                    click: function() {
                        $("#allocationModal").modal('show');
                    },
                },
                ...refreshButton,
                ...settingsModalButton,
            },
            headerToolbar: {
                left: "prev,next today newappointment appointments allocation refresh",
                center: "",
                right: "dayGridMonth,timeGridWeek,timeGridDay,settingsmodalbutton",
            },
            buttonText: {
                today: "Today",
                dayGridMonth: "Month",
                timeGridWeek: "Week",
                timeGridDay: "Day"
            },
            slotMinTime: slotMin,
            slotMaxTime: slotMax,
            initialDate: begunDate,
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectMirror: true,
            dayHeaderFormat: function(date) {
                if (LoggedCountry == "United States") {
                    return (moment(date.date.marker).format("ddd") + " " + moment(date.date.marker).format("MM/DD"));
                } else {
                    return (moment(date.date.marker).format("ddd") + " " + moment(date.date.marker).format("DD/MM"));
                }
            },
            select: function(info) {
                $("#frmAppointment")[0].reset();
                $(".paused").hide();
                templateObject.getAllProductData();
                let calendarData = templateObject.employeeOptions.get();
                let calendarSet = templateObject.globalSettings.get();
                templateObject.empID.set(localStorage.getItem("mySessionEmployeeLoggedID"));

                let empData = calendarData.filter((calendarOpt) => {
                    return calendarOpt.EmployeeID == parseInt(templateObject.empID.get());
                });
                let dateStart = new Date(info.start);
                let dateStartForEndTime = new Date(info.start);
                let dateEnd = new Date(info.end);
                let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                dateStartForEndTime.setHours(dateStartForEndTime.getHours() + parseInt(calendarSet.DefaultApptDuration) || 2 );
                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                let endTime = ("0" + dateStartForEndTime.getHours()).toString().slice(-2) + ":" + ("0" + dateStartForEndTime.getMinutes()).toString().slice(-2);
                document.getElementById("dtSODate").value = startDate;
                document.getElementById("dtSODate2").value = endDate;
                document.getElementById("startTime").value = startTime;
                document.getElementById("endTime").value = endTime;
                document.getElementById("employee_name").value = localStorage.getItem("mySessionEmployee");
                if (calendarSet.DefaultApptDuration) {
                    let hoursFormattedStartTime = templateObject.timeFormat(calendarSet.DefaultApptDuration) || "";
                    document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                } else {
                    let hours = templateObject.diff_hours(dateStart, dateStartForEndTime);
                    let hoursFormattedStartTime = templateObject.timeFormat(hours) || "";
                    document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                }

                if (empData.length > 0) {
                    document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                    document.getElementById("product-list-1").value = empData[empData.length - 1].DefaultServiceProduct || "";
                    // $('#product-list').prepend('<option value=' + empData[0].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                    // $("#product-list")[0].options[0].selected = true;
                } else {
                    document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                    document.getElementById("product-list-1").value = calendarSet.defaultProduct || "";
                    // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                    // $("#product-list")[0].options[0].selected = true;
                }
                templateObject.attachmentCount.set("");
                templateObject.uploadedFiles.set("");
                templateObject.uploadedFile.set("");
                if (FlowRouter.current().queryParams.leadid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.leadid, templateObject);
                } else if (FlowRouter.current().queryParams.customerid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.customerid,templateObject);
                } else if (FlowRouter.current().queryParams.supplierid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.supplierid, templateObject);
                } else {
                     $("#appointmentLeaveConfirmModal").modal("toggle");
                    // $("#customerListModal").modal();
                }
            },
            eventClick: function(info) {
                initAppointmentForm();
                var hours = "0";
                var id = info.event.id;
                let getAllEmployeeData = templateObject.employeerecords.get() || "";
                var appointmentData = templateObject.appointmentrecords.get();

                var result = appointmentData.filter((apmt) => {
                    return apmt.id == id;
                });

                if (result.length > 0) {
                    var filterEmpData = getAllEmployeeData.filter((empdData) => {
                        return empdData.employeeName == result[0].employeename;
                    });
                    if (filterEmpData) {
                        if (filterEmpData[0].custFld8 == "false") {
                            templateObject.getAllSelectedProducts(filterEmpData[0].id);
                        } else {
                            templateObject.getAllProductData();
                        }
                    } else {
                        templateObject.getAllProductData();
                    }

                    if (result[0].isPaused == "Paused") {
                        $(".paused").show();
                        $("#btnHold").prop("disabled", true);
                    } else {
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                    }

                    if (localStorage.getItem("CloudAppointmentStartStopAccessLevel") == true) {
                        //$("#btnHold").prop("disabled", true);
                    }

                    if (result[0].aEndTime != "" && templateObject.isAccessLevels.get() == false) {
                        $("#btnHold").prop("disabled", true);
                        $("#btnStartAppointment").prop("disabled", true);
                        $("#btnStopAppointment").prop("disabled", true);
                        $("#startTime").prop("disabled", true);
                        $("#endTime").prop("disabled", true);
                        $("#tActualStartTime").prop("disabled", true);
                        $("#tActualEndTime").prop("disabled", true);
                        $("#txtActualHoursSpent").prop("disabled", true);
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
                    templateObject.getAllProductData();
                    if (result[0].aStartTime != "" && result[0].aEndTime != "") {
                        var startTime = moment(result[0].aStartDate + " " + result[0].aStartTime);
                        var endTime = moment(result[0].aEndDate + " " + result[0].aEndTime);
                        var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                        hours = duration.asHours();
                    }

                    let hoursFormatted = templateObject.timeFormat(hours) || "";
                    let hoursFormattedStartTime = templateObject.timeFormat(result[0].totalHours) || "";

                    document.getElementById("aStartDate").value = result[0].aStartDate || "";
                    document.getElementById("updateID").value = result[0].id || 0;
                    document.getElementById("appID").value = result[0].id;
                    document.getElementById("customer").value = result[0].accountname;
                    document.getElementById("phone").value = result[0].phone;
                    document.getElementById("mobile").value = result[0].mobile.replace("+", "") || result[0].phone.replace("+", "") || "";
                    document.getElementById("state").value = result[0].state || "";
                    document.getElementById("address").value = result[0].street || "";
                    if (localStorage.getItem("CloudAppointmentNotes") == true) {
                        document.getElementById("txtNotes").value = result[0].notes || "";
                        document.getElementById("txtNotes-1").value = result[0].notes || "";
                    }
                    document.getElementById("suburb").value = result[0].suburb;
                    document.getElementById("zip").value = result[0].zip;
                    document.getElementById("country").value = result[0].country;
                    document.getElementById("product-list").value = result[0].product || "";
                    document.getElementById("product-list-1").value = result[0].product || "";
                    $(".chkBox").prop("checked", false);
                    $(`.tblInventoryCheckbox .colChkBox`).closest('tr').removeClass('checkRowSelected');
                    if (result[0].extraProducts && result[0].extraProducts != "") {
                        let extraProducts = result[0].extraProducts.split(":");
                        let extraProductFees = [];
                        getVS1Data("TProductVS1").then(function(dataObject){
                            if (dataObject.length == 0) {
                                productService.getNewProductServiceListVS1().then(function(products) {
                                    extraProducts.forEach((item) => {
                                        $("#productCheck-" + item).prop("checked", true);
                                        products.tproductvs1.forEach((product) => {
                                            if (product.Id == item) {
                                                extraProductFees.push(product);
                                            }
                                            $("#productCheck-" + item).prop("checked", true);
                                            $("#productCheck-" + item).closest('tr').addClass('checkRowSelected');
                                        });
                                    });
                                    templateObject.extraProductFees.set(extraProductFees);
                                }).catch(function(err) {
                                });
                            }else{
                                let data = JSON.parse(dataObject[0].data);
                                extraProducts.forEach((item) => {
                                    $("#productCheck-" + item).prop("checked", true);
                                    data.tproductvs1.forEach((product) => {
                                        if (product.Id == item) {
                                            extraProductFees.push(product);
                                        }
                                        $("#productCheck-" + item).prop("checked", true);
                                        $("#productCheck-" + item).closest('tr').addClass('checkRowSelected');
                                    });
                                });
                                templateObject.extraProductFees.set(extraProductFees);
                            }
                        });
                        $(".addExtraProduct").removeClass("btn-primary").addClass("btn-success");
                    }

                    // if (result[0].product.replace(/\s/g, '') != "") {
                    //     $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');
                    //
                    // } else {
                    //     $('#product-list').prop('selectedIndex', -1);
                    // }
                    document.getElementById("employee_name").value = result[0].employeename;
                    document.getElementById("dtSODate").value = moment(result[0].startDate.split(" ")[0]).format("DD/MM/YYYY");
                    document.getElementById("dtSODate2").value = moment(result[0].endDate.split(" ")[0]).format("DD/MM/YYYY");
                    document.getElementById("startTime").value = result[0].startTime;
                    document.getElementById("endTime").value = result[0].endTime;
                    document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                    document.getElementById("tActualStartTime").value = result[0].aStartTime;
                    document.getElementById("tActualEndTime").value = result[0].aEndTime;
                    document.getElementById("txtActualHoursSpent").value = hoursFormatted || "";
                    templateObject.attachmentCount.set(0);
                    if (result[0].attachments) {
                        if (result.length) {
                            templateObject.attachmentCount.set(result[0].attachments.length);
                            templateObject.uploadedFiles.set(result[0].attachments);
                        }
                    } else {
                        templateObject.attachmentCount.set("");
                        templateObject.uploadedFiles.set("");
                        templateObject.uploadedFile.set("");
                    }
                    if (!$("#smsConfirmedFlag i.fa-check-circle").hasClass("d-none"))
                        $("#smsConfirmedFlag i.fa-check-circle").addClass("d-none");
                    if (!$("#smsConfirmedFlag i.fa-close").hasClass("d-none"))
                        $("#smsConfirmedFlag i.fa-close").addClass("d-none");
                    if (!$("#smsConfirmedFlag i.fa-question").hasClass("d-none"))
                        $("#smsConfirmedFlag i.fa-question").addClass("d-none");
                    if (!$("#smsConfirmedFlag i.fa-minus-circle").hasClass("d-none"))
                        $("#smsConfirmedFlag i.fa-minus-circle").addClass("d-none");
                    if (result[0].custFld13 === "Yes") {
                        if (result[0].custFld11 === "Yes") {
                            $("#smsConfirmedFlag i.fa-check-circle").removeClass("d-none");
                        } else {
                            if (result[0].custFld11 === "No") {
                                $("#smsConfirmedFlag i.fa-close").removeClass("d-none");
                            } else {
                                $("#smsConfirmedFlag i.fa-question").removeClass("d-none");
                            }
                        }
                    } else {
                        $("#smsConfirmedFlag i.fa-minus-circle").removeClass("d-none");
                    }

                    setTimeout(() => {
                        $("#btnCopyOptions").attr("disabled", false);
                        $("#event-modal").modal();
                        if (localStorage.getItem("smsCustomerAppt") == "false") {
                            $("#chkSMSCustomer").prop("checked", false);
                        }
                        if (localStorage.getItem("smsUserAppt") == "false") {
                            $("#chkSMSUser").prop("checked", false);
                        }
                        if (localStorage.getItem("emailCustomerAppt") == "false") {
                            $("#customerEmail").prop("checked", false);
                        }
                        if (localStorage.getItem("emailUserAppt") == "false") {
                            $("#userEmail").prop("checked", false);
                        }
                    }, 200);
                    // this.$body.addClass('modal-open');
                } else {
                    let splitId = id.split(":");
                    // FlowRouter.go("/employeescard?id=" + splitId[1]);
                    setTimeout(function() {
                        // $('.payrollTab').tab('show');
                        // $('a[href="#leave"]').tab('show');
                        // $('#removeLeaveRequestBtn').show();
                        let leaveemployeerecords = templateObject.leaveemployeerecords.get();
                        var getLeaveInfo = leaveemployeerecords.filter((leave) => {
                            return (splitId[2] == leave.ID);
                        });

                        if (getLeaveInfo.length > 0) {
                            // $('#removeLeaveRequestBtn').show();
                            $('#removeLeaveRequestBtn').css('visibility','initial');
                            $('#edtEmpID').val(getLeaveInfo[0].EmployeeID);
                            $('#edtLeaveRequestID').val(getLeaveInfo[0].ID);
                            $('#removeLeaveRequestBtn').data('id', getLeaveInfo[0].ID);
                            $('#edtLeaveTypeofRequestID').val(getLeaveInfo[0].TypeOfRequest);
                            $('#edtLeaveTypeofRequest').val(getLeaveInfo[0].LeaveMethod);
                            $('#edtEmployeeName').val(getLeaveInfo[0].EmployeeName);
                            $('#edtLeaveDescription').val(getLeaveInfo[0].Description);
                            $('#edtLeaveStartDate').val(moment(getLeaveInfo[0].StartDate).format('DD/MM/YYYY'));
                            $('#edtLeaveEndDate').val(moment(getLeaveInfo[0].EndDate).format('DD/MM/YYYY'));
                            $('#edtLeavePayPeriod').val(getLeaveInfo[0].PayPeriod);
                            $('#edtLeaveHours').val(getLeaveInfo[0].Hours);
                            setTimeout(function() {
                                $('#edtLeavePayStatus').val(getLeaveInfo[0].Status);
                            }, 200);
                            $('#newLeaveRequestLabel.edit-leave-title').removeClass('hide');
                            $('#newLeaveRequestLabel.new-leave-title').addClass('hide');
                            $('#newLeaveRequestModal').modal('show');
                        }
                        $('#newLeaveRequestModal').on('hidden.bs.modal', function(e) {
                            // window.open("/appointments", "_self");
                        });
                    }, 1000);
                }
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            dayMaxEvents: true, // allow "more" link when too many events
            //Triggers modal once event is moved to another date within the calendar.
            eventDrop: function(info) {
             evenDropAndResize(info)
            },
            //Triggers modal once external object is dropped to calender.
            drop: function(event) {
                renderCalendarDropEvent(event);
            },
            events: templateObject.eventdata.get(),
            eventDidMount: function(info) {
                // if (
                //     /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                //         navigator.userAgent
                //     )
                // ) {
                //     $(".fc-event-main p").css({
                //         "font-size": "12px",
                //     });
                //     //     $(info.el).tooltip({
                //     //         title: info.event.title.replaceAll('<br>', "\n"),
                //     //         placement: "top",
                //     //         trigger: "hover",
                //     //         container: "body"

                //     //     });
                // }
                info.el.children[0].setAttribute("data-toggle", "tooltip");
                info.el.children[0].setAttribute("title", info.event.extendedProps.description);
                setTimeout(function() {
                    $('[data-toggle="tooltip"]').tooltip({ html: true });
                }, 500);
            },
            eventContent: function(event) {
                let leaveemployeerecords = templateObject.leaveemployeerecords.get();
                let eventLeave  = [];
                let eventStatus = [];

                leaveemployeerecords.forEach((item) => {
                    eventLeave[item.EmployeeID]  = item.LeaveMethod;
                    eventStatus[item.EmployeeID] = item.Status;
                });

                let title = document.createElement("p");
                if (event.timeText != '') {
                    title.innerHTML = event.timeText + " " + event.event.title;
                    title.style.backgroundColor = event.backgroundColor;
                    title.style.color = "#ffffff";
                } else {
                    var empid = event.event._def.publicId.split(':')[1];
                    if(eventStatus[empid] == 'Awaiting' || eventStatus[empid] == 'Approved'){
                        $(title).append( "<div><p style='font-size:12px;'>" + event.event.title + "<br/>" + eventLeave[empid] + "<br/>Status : " + eventStatus[empid] + "</p></div>");
                        title.style.color = "#dddddd";
                    }
                }

                let arrayOfDomNodes = [title];
                return {
                    domNodes: arrayOfDomNodes,
                };
            },
            eventResize: function(info) {
               evenDropAndResize(info)
            }
        });

        calendar.render();

        $("#calendar .fc-header-toolbar div:nth-child(2)").html('<div class="input-group date" style="width: 200px; float:left;margin:auto;"><input type="text" class="form-control" id="appointmentDate" name="appointmentDate" value=""></div><div class="custom-control custom-switch" style="width:192px; float: right;margin: 8px auto;"><input class="custom-control-input" type="checkbox" name="chkmyAppointments" id="chkmyAppointments" style="cursor: pointer;" autocomplete="on" checked"><label class="custom-control-label" for="chkmyAppointments" style="cursor: pointer;">My Appointments</label></div>');
        $('.fc-today-button').prop('disabled', false);
        let draggableEl = document.getElementById("external-events-list");
        if(draggableEl){
            new Draggable(draggableEl, {
                itemSelector: ".fc-event",
                eventData: function(eventEl) {
                    $("#updateID").val("");
                    let employee = eventEl.textContent;
                    let empInit = employee.replace(/-?[0-9]*\.?[0-9]+/, "");
                    let employeeID = empInit.replace(/\D/g, "");
                    templateObject.empID.set(employeeID);
                    return {
                        title: eventEl.innerText,
                        duration: "0" + templateObject.empDuration.get() + ":00" || "01:00",
                    };
                },
            });
        }
        $("#appointmentDate").css("fontSize", "24px");
        $("#appointmentDate").css("padding", "0px");
        $("#appointmentDate").css("border", "0px");
        // $("#appointmentDate").css("margin-left", "20px");
        $("#appointmentDate").css("height", "40px");
        $("#appointmentDate").css("text-align", "center");
        $("#appointmentDate").css("cursor", "pointer");
        $("#appointmentDate").css("background-color", "white");
        $("#appointmentDate").css("outline", "none");
        $("#appointmentDate").datepicker({
            // showOn: "button",
            // buttonText: "Show Date",
            // buttonImageOnly: true,
            // buttonImage: "/img/imgCal2.png",
            dateFormat: "dd/mm/yy",
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+10",
            onSelect: function(formated, dates) {
                let gotoDate = new Date(formated.split("/")[2] + "-" + formated.split("/")[1] + "-" + formated.split("/")[0]);
                calendar.gotoDate(gotoDate);
            },
            onChangeMonthYear: function(year, month, inst) {
                // Set date to picker
                $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
                // Hide (close) the picker
                // $(this).datepicker('hide');
                // // Change ttrigger the on change function
                // $(this).trigger('change');
            }
        });

        $("#appointmentDate").val(moment(new Date()).format('DD/MM/YYYY'));

        if (JSON.parse(seeOwnAppointments) == true) {
            $('#chkmyAppointments').prop('checked', true);
        } else {
            $('#chkmyAppointments').prop('checked', false);
        }

        setTimeout(() => {
            const child1 = document.querySelector(".fc-appointments-button");
            const child2 = document.querySelector("#appointmentDate").parentNode;
            if (child1 != null) {
                const parent1 = child1.parentNode;
                $(parent1).css("min-width", 714).css("text-align", "center");
                $("#calendar .fc-toolbar-title").css("min-width", 275).css("text-align", "center");
                // $(child2.parentNode).css("min-width", 418);
                $(child2.parentNode).css("display","flex" ).css("flex-wrap",'wrap');
            }

            let url = window.location.href;
            if (url.indexOf("?id") > 1) {} else {
                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                    $("#employeeListModal").modal("show");
                }
            }
        }, 500);
    };

    const getWeeksInMonth = function(year, month) {
        const weeks = [];
        let firstDate = new Date(year, month, 1);
        let lastDate = new Date(year, month + 1, 0);
        let numDays = lastDate.getDate();
        let dayOfWeekCounter = firstDate.getDay();
        for (let date = 1; date <= numDays; date++) {
            if (dayOfWeekCounter === 0 || weeks.length === 0) {
                weeks.push([]);
            }
            weeks[weeks.length - 1].push(date);
            dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
        }
        let results = weeks.filter((w) => !!w.length).map((w) => ({
                start: w[0],
                end: w[w.length - 1],
                dates: w,
            }));
        if (results[0].dates.length < 7) {
            let lastDay = new Date(year, month, 0);
            let addDays = lastDay.getDate();
            let count = results[0].dates.length;
            while (count < 7) {
                results[0].dates.unshift(addDays);
                count++;
                addDays--;
            }
            results[0].start = results[0].dates[0];
            results[0].end = results[0].dates[6];
        }
        if (results[results.length - 1].dates.length < 7) {
            let addDays = 1;
            let count = results[results.length - 1].dates.length;
            while (count < 7) {
                results[results.length - 1].dates.push(addDays);
                count++;
                addDays++;
            }
            results[results.length - 1].start = results[results.length - 1].dates[0];
            results[results.length - 1].end = results[results.length - 1].dates[6];
        }
        return results;
    };

    templateObject.diff_hours = function(dt2, dt1) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        return Math.abs(diff);
    };

    document.getElementById('currentDate').value = moment().format('YYYY-MM-DD');

    const changeColumnColor = async function(day) {
        let dayOfWeek = moment(day).format("dddd");
        let dayInDigit = moment(day).format('DD');
        let dd = moment(document.getElementById('currentDate').value).format('DD');
        if (dayOfWeek == moment().format("dddd") && dayInDigit == dd) {
            $(document).on('DOMNodeInserted', function(e) {
                $("#allocationTable").find('tbody tr td.' + dayOfWeek.toLowerCase() + "").addClass("currentDay");
            });
        } else {
            $("#allocationTable tbody tr td." + dayOfWeek.toLocaleLowerCase()).removeClass("currentDay");
            $("#allocationTabletbody tr td." + dayOfWeek.toLocaleLowerCase()).css('background-color', '#fff');

        }
        setTimeout(function() {
            if ($('#showSaturday').is(":checked") && $('#showSunday').is(":checked")) {
                $('.draggable').addClass('cardWeeekend');
                $('.draggable').removeClass('cardHiddenWeekend');
                $('.draggable').removeClass('cardHiddenSundayOrSaturday');
            }
            if ($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == false) {
                $('.draggable').removeClass('cardWeeekend');
                $('.draggable').addClass('cardHiddenWeekend');
                $('.draggable').removeClass('cardHiddenSundayOrSaturday');
            }
            if (($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == true) || ($("#showSaturday").prop('checked') == true && $("#showSunday").prop('checked') == false)) {
                $('.draggable').removeClass('cardWeeekend');
                $('.draggable').removeClass('cardHiddenWeekend');
                $('.draggable').addClass('cardHiddenSundayOrSaturday');
            }
        }, 100);
    };

    templateObject.dateFormat = function(date) {
        const dateParts = date.split("/");
        const dateObject = dateParts[2] + '/' + ("0" + (dateParts[1] - 1)).toString().slice(-2) + '/' + dateParts[0];
        return dateObject;
    };

    templateObject.timeFormat = function(hours) {
        let decimalTime = parseFloat(hours).toFixed(2);
        decimalTime = decimalTime * 60 * 60;
        let hoursVal = Math.floor((decimalTime / (60 * 60)));
        decimalTime = decimalTime - (hoursVal * 60 * 60);
        let minutes = Math.abs(decimalTime / 60);
        decimalTime = decimalTime - (minutes * 60);
        hoursVal = ("0" + hoursVal).slice(-2);
        minutes = ("0" + Math.round(minutes)).slice(-2);
        return hoursVal + ":" + minutes;
    };

    function setAllEmployeeSideData(data) {
        let dataList;
        let lineItems = [];
        for (let i = 0; i < data.temployee.length; i++) {
            let randomColor = Math.floor(Math.random() * 16777215).toString(16);
            if (randomColor.length < 6) {
                randomColor = randomColor + '6';
            }
            let selectedColor = "#" + randomColor;
            if (data.temployee[i].fields.CustFld6 == "") {
                let objDetails = {
                    type: "TEmployeeEx",
                    fields: {
                        ID: data.temployee[i].fields.ID,
                        CustFld6: selectedColor,
                        Email: data.temployee[i].fields.Email || data.temployee[i].fields.FirstName.toLowerCase() + "@gmail.com",
                        Sex: data.temployee[i].fields.Sex || "M",
                        DateStarted: data.temployee[i].fields.DateStarted || moment().format('YYYY-MM-DD'),
                        DOB: data.temployee[i].fields.DOB || moment('2018-07-01').format('YYYY-MM-DD')
                    }
                };
                // contactService.saveEmployeeEx(objDetails).then(function (data) {
                //   sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function(dataEmployee) {
                //       addVS1Data('TEmployee', JSON.stringify(dataEmployee));
                //   });
                // });
            }
            if (localStorage.getItem("mySessionEmployee") == data.temployee[i].fields.EmployeeName) {
                if (data.temployee[i].fields.CustFld8 == "false") {
                    templateObject.includeAllProducts.set(false);
                }
            }
            if (JSON.parse(seeOwnAppointments) == true) {
                if (data.temployee[i].fields.EmployeeName == localStorage.getItem("mySessionEmployee")) {
                    dataList = {
                        id: data.temployee[i].fields.ID || "",
                        employeeName: data.temployee[i].fields.EmployeeName || "",
                        color: data.temployee[i].fields.CustFld6 || selectedColor,
                        priority: data.temployee[i].fields.CustFld5 || "0",
                        override: data.temployee[i].fields.CustFld14 || "false",
                        custFld7: data.temployee[i].fields.CustFld7 || "",
                        custFld8: data.temployee[i].fields.CustFld8 || ""
                    };
                    lineItems.push(dataList);
                    allEmployees.push(dataList);
                }
            } else {
                dataList = {
                    id: data.temployee[i].fields.ID || "",
                    employeeName: data.temployee[i].fields.EmployeeName || "",
                    color: data.temployee[i].fields.CustFld6 || selectedColor,
                    priority: data.temployee[i].fields.CustFld5 || "0",
                    override: data.temployee[i].fields.CustFld14 || "false",
                    custFld7: data.temployee[i].fields.CustFld7 || "",
                    custFld8: data.temployee[i].fields.CustFld8 || ""
                };
                lineItems.push(dataList);
                allEmployees.push(dataList);
            }
        }
        lineItems.sort(function(a, b) {
            if (a.employeeName == 'NA') {
                return 1;
            } else if (b.employeeName == 'NA') {
                return -1;
            }
            return (a.employeeName.toUpperCase() > b.employeeName.toUpperCase()) ? 1 : -1;
        });
        templateObject.employeerecords.set(lineItems);

        if (templateObject.employeerecords.get()) {
            setTimeout(function() {
                $('.counter').text(lineItems.length + ' items');
            }, 100);
        }
    }

    function drawProductTable(data){
        let productlist = [];
        let dataList = {};
        const splashArrayProductServiceListGet = [];
        let getallinvproducts = templateObject.allnoninvproducts.get();
        if (data.trepservices.length > 0) {
            for (let i = 0; i < data.trepservices.length; i++) {
                dataList = {
                    id: data.trepservices[i].Id || "",
                    productname: data.trepservices[i].ServiceDesc || "",
                    productcost: data.trepservices[i].Rate || 0.00
                };
                let checkServiceArray = getallinvproducts.filter(function(prodData) {
                    if (prodData[1] === data.trepservices[i].ServiceDesc) {
                        const prodservicedataList = [
                            prodData[0],
                            prodData[1] || "-",
                            prodData[2] || "",
                            prodData[3] || "",
                            prodData[4],
                            prodData[5],
                            prodData[6],
                            prodData[7] || "",
                            prodData[8] || "",
                            prodData[9] || null,
                            prodData[10]
                        ];
                        splashArrayProductServiceListGet.push(prodservicedataList);
                        return prodservicedataList || "";
                    }
                }) || "";
                productlist.push(dataList);
            }
            if (splashArrayProductServiceListGet) {
                let uniqueChars = [...new Set(splashArrayProductServiceListGet)];
                const datatable = $('#tblInventoryPayrollService').DataTable();
                datatable.clear();
                datatable.rows.add(uniqueChars);
                datatable.draw(false);
            }
            templateObject.datatablerecords.set(productlist);
        } else {
            templateObject.getAllProductData();
        }
    }
   
    templateObject.getAllSelectedProducts = function(employeeID) {
        templateObject.datatablerecords.set([]);
        //$('#product-list').editableSelect('clear');
        getVS1Data("TRepServices").then(function(dataObject){
            if (dataObject.length == 0) {
                sideBarService.getSelectedProducts(employeeID).then(function(data) {
                    addVS1Data("TRepServices", JSON.stringify(data));
                    drawProductTable(data)
                }).catch(function(err) {
                    templateObject.getAllProductData();
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                drawProductTable(data);
            }
        })
    };

    templateObject.getAllProductData = function() {
        productList = [];
        templateObject.datatablerecords.set([]);
        //  $('#product-list').editableSelect('clear');
        getVS1Data('TProductWeb').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getProductServiceListVS1(initialBaseDataLoad, 0).then(function(data) {
                    setProductServiceListVS1(data);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                setProductServiceListVS1(data);
            }
        }).catch(function(err) {
            sideBarService.getProductServiceListVS1(initialBaseDataLoad, 0).then(function(data) {
                setProductServiceListVS1(data);
            });
        });
    };

    function setProductServiceListVS1(data) {
        addVS1Data('TProductWeb', JSON.stringify(data));
        let dataList = {};
        const splashArrayProductServiceList = [];
        for (let i = 0; i < data.tproductvs1.length; i++) {
            dataList = {
                id: data.tproductvs1[i].fields.ID || "",
                productname: data.tproductvs1[i].fields.ProductName || ""
            }
            const prodservicedataList = [
                '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' + data.tproductvs1[i].fields.ID + '"><label class="custom-control-label chkBox pointer" for="formCheck-' + data.tproductvs1[i].fields.ID + '"></label></div>',
                data.tproductvs1[i].fields.ProductName || "-",
                data.tproductvs1[i].fields.SalesDescription || "",
                data.tproductvs1[i].fields.BARCODE || "",
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                data.tproductvs1[i].fields.TotalQtyInStock,
                data.tproductvs1[i].fields.TaxCodeSales || "",
                data.tproductvs1[i].fields.ID || "",
                JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) || null,
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
            ];
            splashArrayProductServiceList.push(prodservicedataList);
            //if (data.tproductvs1[i].ProductType != 'INV') {
            // $('#product-list').editableSelect('add', data.tproductvs1[i].ProductName);
            // $('#product-list').editableSelect('add', function(){
            //   $(this).text(data.tproductvs1[i].ProductName);
            //   $(this).attr("id", data.tproductvs1[i].SellQty1Price);
            // });
            productList.push(dataList);
            //  }
        }
        if (splashArrayProductServiceList) {
            templateObject.allnoninvproducts.set(splashArrayProductServiceList);
            $('#tblInventoryPayrollService').dataTable({
                data: splashArrayProductServiceList,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [{
                        className: "chkBox pointer hiddenColumn",
                        "orderable": false,
                        "targets": [0]
                    },
                    {
                        className: "productName",
                        "targets": [1]
                    }, {
                        className: "productDesc",
                        "targets": [2]
                    }, {
                        className: "colBarcode",
                        "targets": [3]
                    }, {
                        className: "costPrice text-right",
                        "targets": [4]
                    }, {
                        className: "salePrice text-right",
                        "targets": [5]
                    }, {
                        className: "prdqty text-right",
                        "targets": [6]
                    }, {
                        className: "taxrate",
                        "targets": [7]
                    }, {
                        className: "colProuctPOPID hiddenColumn",
                        "targets": [8]
                    }, {
                        className: "colExtraSellPrice hiddenColumn",
                        "targets": [9]
                    }, {
                        className: "salePriceInc hiddenColumn",
                        "targets": [10]
                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [
                    [1, "asc"]
                ],
                "fnDrawCallback": function(oSettings) {
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblInventoryPayrollService_ellipsis').addClass('disabled');
                },
                "fnInitComplete": function() {
                    $("<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>").insertAfter("#tblInventoryPayrollService_filter");
                    $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventoryPayrollService_filter");
                    $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventoryPayrollService_filter");
                }
            }).on('length.dt', function(e, settings, len) {

                let dataLenght = settings._iDisplayLength;
                // splashArrayProductList = [];
                if (dataLenght == -1) {
                    $('.fullScreenSpin').css('display', 'none');
                } else {
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                    }
                }
            });
            $('div.dataTables_filter input').addClass('form-control form-control-sm');
        }
        templateObject.datatablerecords.set(productList);
    }

    templateObject.getLeaveRequests = async function() {
        let result = false;
        const dataObject = await getVS1Data("TLeavRequest");
        if (dataObject.length != 0) {
            const data = JSON.parse(dataObject[0].data);
            if (data.tleavrequest.length > 0) {
                data.tleavrequest.forEach((item) => {
                    const fields = item.fields;
                    const parsedDate = utilityService.getStartDateWithSpecificFormat(fields.StartDate);
                    const appointmentDate = document.getElementById("dtSODate").value;
                    if (parsedDate === appointmentDate) {
                        result = true;
                    }
                });
            }
        }
        return result;
    };

    let hideSun = "";
    let hideSat = "";
    
    templateObject.getAllProductData();
    getVS1Data('TAppointmentPreferences').then(function(dataObject) {
        let employeeSettings = [];
        if (dataObject.length == 0) {
            appointmentService.getCalendarsettings().then(function(data) {
                if (data.tappointmentpreferences.length > 0) {
                    templateObject.employeeOptions.set(data.tappointmentpreferences);
                }
            }).catch(function(err) {});
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tappointmentpreferences;
            templateObject.employeeOptions.set(useData);
        }
    }).catch(function(err) {
        appointmentService.getCalendarsettings().then(function(data) {
            templateObject.employeeOptions.set(data.tappointmentpreferences);
        }).catch(function(err) {});
    });

    templateObject.getAllAppointmentListData = function() {
        getVS1Data("TAppointment").then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                    addVS1Data("TAppointment", JSON.stringify(data));
                    setAppointmentData(data);
                }).catch(function(err) {
                    setInitCalendarData();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                addVS1Data("TAppointment", JSON.stringify(data));
                setAppointmentData(data);
            }
        }).catch(function(err) {
            sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                addVS1Data("TAppointment", JSON.stringify(data));
                setAppointmentData(data);
            }).catch(function(err) {
                setInitCalendarData();
            });
        });
    };

    function renderAllocationCalendar(){
        const currentDate = moment();
        const dateCurrent = new Date();
        const weekStart = currentDate.clone().startOf('isoWeek').format("YYYY-MM-DD");
        const weekEnd = currentDate.clone().endOf('isoWeek').format("YYYY-MM-DD");
        const days = [];

        let weeksOfCurrentMonth = getWeeksInMonth(dateCurrent.getFullYear(), dateCurrent.getMonth());
        const weekResults = weeksOfCurrentMonth.filter(week => {
            return week.dates.includes(parseInt(moment(weekStart).format('DD')));
        });
        let currentDay = moment().format("dddd");
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

        for (let i = 0; i <= weekResults[0].dates.length; i++) {
            days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
        }
        $(".allocationHeaderDate h2").text(moment().format('MMM') + " " + moment(days[0]).format('DD') + ' - ' + moment(days[4]).format('DD') + ', ' + moment().format('YYYY'));
        $('.sunday').attr("id", moment(weekStart).subtract(1, 'days').format("YYYY-MM-DD"));
        $('.monday').attr("id", moment(weekStart).add(0, 'days').format("YYYY-MM-DD"));
        $('.tuesday').attr("id", moment(weekStart).add(1, 'days').format("YYYY-MM-DD"));
        $('.wednesday').attr("id", moment(weekStart).add(2, 'days').format("YYYY-MM-DD"));
        $('.thursday').attr("id", moment(weekStart).add(3, 'days').format("YYYY-MM-DD"));
        $('.friday').attr("id", moment(weekStart).add(4, 'days').format("YYYY-MM-DD"));
        $('.saturday').attr("id", moment(weekStart).add(5, 'days').format("YYYY-MM-DD"));

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
        if (currentDay == "Monday" && moment().format('DD') == moment($('thead tr th.monday').attr("id")).format('DD')) {
            $(document).on('DOMNodeInserted', function(e) {
                $("#allocationTable").find('tbody tr td.monday').addClass("currentDay");
            });
        }
        if (currentDay == "Tuesday" && moment().format('DD') == moment($('thead tr th.tuesday').attr("id")).format('DD')) {
            $(document).on('DOMNodeInserted', function(e) {
                $("#allocationTable").find('tbody tr td.tuesday').addClass("currentDay");
            });
        }
        if (currentDay == "Wednesday" && moment().format('DD') == moment($('thead tr th.wednesday').attr("id")).format('DD')) {
            $(document).on('DOMNodeInserted', function(e) {
                $("#allocationTable").find('tbody tr td.wednesday').addClass("currentDay");
            });
        }
        if (currentDay == "Thursday" && moment().format('DD') == moment($('thead tr th.thursday').attr("id")).format('DD')) {
            $(document).on('DOMNodeInserted', function(e) {
                $("#allocationTable").find('tbody tr td.thursday').addClass("currentDay");
            });
        }
        if (currentDay == "Friday" && moment().format('DD') == moment($('thead tr th.friday').attr("id")).format('DD')) {
            $(document).on('DOMNodeInserted', function(e) {
                $("#allocationTable").find('tbody tr td.friday').addClass("currentDay");
            });
        }
        if (currentDay == "Saturday" && moment().format('DD') == moment($('thead tr th.saturday').attr("id")).format('DD')) {
            $(document).on('DOMNodeInserted', function(e) {
                $("#allocationTable").find('tbody tr td.saturday').addClass("currentDay");
            });
        }
        if (currentDay == "Sunday" && moment().format('DD') == moment($('thead tr th.sunday').attr("id")).format('DD')) {
            $(document).on('DOMNodeInserted', function(e) {
                $("#allocationTable").find('tbody tr td.sunday').addClass("currentDay");
            });
        }
    }
    function initAppointmentForm(){
        $("#frmAppointment")[0].reset();
        $("#btnHold").prop("disabled", false);
        $("#btnStartAppointment").prop("disabled", false);
        $("#btnStopAppointment").prop("disabled", false);
        $("#startTime").prop("disabled", false);
        $("#endTime").prop("disabled", false);
        $("#tActualStartTime").prop("disabled", false);
        $("#tActualEndTime").prop("disabled", false);
        $("#txtActualHoursSpent").prop("disabled", false);
    }
    function setShowWeekendAllocationHeader(){
        $("#allocationTable .sunday").removeClass("hidesunday");
        $("#allocationTable .saturday").removeClass("hidesaturday");
        $("#allocationTable > thead > tr> th").addClass("fullWeek");
        $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
        $("#allocationTable > thead > tr> th").removeClass("cardHiddenSundayOrSaturday");

        $("#allocationTable > tbody > tr> td").addClass("fullWeek");
        $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
        $("#allocationTable > tbody > tr> td").removeClass("cardHiddenSundayOrSaturday");

        $("#allocationTable > tbody > tr> td > .card").addClass("cardFullWeek");
        $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
        $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenSundayOrSaturday");

    }

    function setNormalAllocationHeader(){
        $("#allocationTable .sunday").addClass("hidesunday");
        $("#allocationTable .saturday").addClass("hidesaturday");
        $("#allocationTable > thead > tr> th").addClass("fullWeek");
        $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
        $("#allocationTable > thead > tr> th").removeClass("cardHiddenSundayOrSaturday");

        $("#allocationTable > tbody > tr> td").addClass("fullWeek");
        $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
        $("#allocationTable > tbody > tr> td").removeClass("cardHiddenSundayOrSaturday");

        $("#allocationTable > tbody > tr> td > .card").addClass("cardFullWeek");
        $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
        $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenSundayOrSaturday");
    }
    function setAllocationTableHeader(withWeekend){
        $("#allocationTable > thead > tr> th").removeClass("fullWeek");
        if(withWeekend){
            $("#allocationTable > thead > tr> th").removeClass("cardHiddenWeekend");
            $("#allocationTable > thead > tr> th").addClass("cardHiddenSundayOrSaturday");
        } else{
            $("#allocationTable > thead > tr> th").addClass("cardHiddenWeekend");
        }

        $("#allocationTable > tbody > tr> td").removeClass("fullWeek");
        if(withWeekend){
            $("#allocationTable > tbody > tr> td").removeClass("cardHiddenWeekend");
            $("#allocationTable > tbody > tr> td").addClass("cardHiddenSundayOrSaturday");
        } else{
            $("#allocationTable > tbody > tr> td").addClass("cardHiddenWeekend");
        }

        $("#allocationTable > tbody > tr> td > .card").removeClass("cardFullWeek");
        if(withWeekend){
            $("#allocationTable > tbody > tr> td > .card").removeClass("cardHiddenWeekend");
            $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenSundayOrSaturday");
        } else{
            $("#allocationTable > tbody > tr> td > .card").addClass("cardHiddenWeekend");
        }
    }

    function setAppointmentData(data) {
        let result;
        let employeeColor;
        let jobs;
        let dataList;
       
        let appColor = '#00a3d3';
        let dataColor = "";
        let allEmp = templateObject.employeerecords.get();
        let mySessionEmployee = localStorage.getItem("mySessionEmployee");
        for (let i = 0; i < data.tappointmentex.length; i++) {
            let useData = data.tappointmentex[i];
            employeeColor = allEmp.filter(apmt => {
                return apmt.employeeName == useData.fields.TrainerName;
            });
            if (employeeColor.length > 0) {
                appColor = employeeColor[0].color || '#00a3d3';
            } else {
                appColor = '#00a3d3';
            }
            const appointment = {
                id: useData.fields.ID || "",
                sortdate: useData.fields.CreationDate ? moment(useData.fields.CreationDate).format("YYYY/MM/DD") : "",
                appointmentdate: useData.fields.CreationDate ? moment(useData.fields.CreationDate).format("DD/MM/YYYY") : "",
                accountname: useData.fields.ClientName || "",
                statementno: useData.fields.TrainerName || "",
                employeename: useData.fields.TrainerName || "",
                extraProducts: useData.fields.ExtraProducts || "",
                department: useData.fields.DeptClassName || "",
                phone: useData.fields.Phone || "",
                mobile: useData.fields.Mobile || "",
                suburb: useData.fields.Suburb || "",
                street: useData.fields.Street || "",
                state: useData.fields.State || "",
                country: useData.fields.Country || "",
                zip: useData.fields.Postcode || "",
                timelog: useData.fields.AppointmentsTimeLog || "",
                startTime: useData.fields.StartTime.split(" ")[1] || "",
                totalHours: useData.fields.TotalHours || 0,
                endTime: useData.fields.EndTime.split(" ")[1] || "",
                startDate: useData.fields.StartTime || "",
                endDate: useData.fields.EndTime || "",
                fromDate: useData.fields.Actual_EndTime ? moment(useData.fields.Actual_EndTime).format("DD/MM/YYYY") : "",
                openbalance: useData.fields.Actual_EndTime || "",
                aStartTime: useData.fields.Actual_StartTime.split(" ")[1] || "",
                aEndTime: useData.fields.Actual_EndTime.split(" ")[1] || "",
                aStartDate: useData.fields.Actual_StartTime.split(" ")[0] || "",
                aEndDate: useData.fields.Actual_EndTime.split(" ")[0] || "",
                actualHours: "",
                closebalance: "",
                rate: useData.fields.Rate || 1,
                product: useData.fields.ProductDesc || "",
                finished: useData.fields.Status || "",
                //employee: useData.EndTime != "" ? moment(useData.EndTime).format("DD/MM/YYYY") : useData.EndTime,
                notes: useData.fields.Notes || "",
                attachments: useData.fields.Attachments || "",
                isPaused: useData.fields.Othertxt || "",
                msRef: useData.fields.MsRef || "",
                custFld13: useData.fields.CUSTFLD13 || "",
                custFld11: useData.fields.CUSTFLD11 || "",
            };

            let surbub = useData.fields.Suburb || "";
            let zip = useData.fields.Postcode || "";
            let street = useData.fields.Street || "";
            let state = useData.fields.State || "";
            let country = useData.fields.Country || "";
            let getAddress = 'Client Name: ' + useData.fields.ClientName + '<br /> Address: ' + street + ',' + state + ',' + country + ',' + surbub + " " + zip;
            dataList = {
                id: useData.fields.ID.toString() || "",
                title: useData.fields.ClientName,
                start: useData.fields.StartTime || "",
                end: useData.fields.EndTime || "",
                description: getAddress,
                color: appColor
            };
            if (JSON.parse(seeOwnAppointments) == true) {
                if (data.tappointmentex[i].fields.TrainerName == localStorage.getItem("mySessionEmployee")) {
                    eventData.push(dataList);
                    appointmentList.push(appointment)
                }
            } else {
                eventData.push(dataList);
                appointmentList.push(appointment)
            }

        }
        let leaveemployeerecords = templateObject.leaveemployeerecords.get();
        for (let i = 0; i < leaveemployeerecords.length; i++) {
            employeeColor = allEmp.filter((apmt) => {
                return (apmt.id == leaveemployeerecords[i].EmployeeID);
            });

            if (employeeColor.length > 0) {
                appColor = employeeColor[0].color || "#00a3d3";
                leaveEmpName = employeeColor[0].employeeName;
            } else {
                appColor = "#00a3d3";
                leaveEmpName = "";
            }

            dataList = {
                id: "leave:" + leaveemployeerecords[i].EmployeeID + ":" + leaveemployeerecords[i].ID,
                title: leaveEmpName,
                start: leaveemployeerecords[i].StartDate || "",
                end: leaveemployeerecords[i].EndDate || "",
                description: leaveemployeerecords[i].Description || "",
                color: appColor,
            };
            eventData.push(dataList);
        }
        templateObject.appointmentrecords.set(appointmentList);
        templateObject.eventdata.set(eventData);

        updateCalendarData = eventData
        let url = window.location.href;
        if (url.indexOf('?id') > 1) {
            let url1 = new URL(window.location.href);
            let appID = url1.searchParams.get("id");
            $("#frmAppointment")[0].reset();
            $("#btnHold").prop("disabled", false);
            $("#btnStartAppointment").prop("disabled", false);
            $("#btnStopAppointment").prop("disabled", false);
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            $("#tActualStartTime").prop("disabled", false);
            $("#tActualEndTime").prop("disabled", false);
            $("#txtActualHoursSpent").prop("disabled", false);
            let hours = "0";
            const appointmentData = appointmentList;

            result = appointmentData.filter(apmt => {
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
                if (result[0].aStartTime != "" && result[0].aEndTime != "") {
                    const startTime = moment(result[0].startDate.split(" ")[0] + " " + result[0].aStartTime);
                    const endTime = moment(result[0].endDate.split(" ")[0] + " " + result[0].aEndTime);
                    const duration = moment.duration(moment(endTime).diff(moment(startTime)));
                    hours = duration.asHours();
                }

                document.getElementById("updateID").value = result[0].id || 0;
                document.getElementById("appID").value = result[0].id;
                document.getElementById("customer").value = result[0].accountname;
                document.getElementById("phone").value = result[0].phone;
                document.getElementById("mobile").value = result[0].mobile.replace("+", "") || result[0].phone.replace("+", "") || "";
                document.getElementById("state").value = result[0].state;
                document.getElementById("address").value = result[0].street;
                if (localStorage.getItem("CloudAppointmentNotes") == true) {
                    document.getElementById("txtNotes").value = result[0].notes;
                }
                document.getElementById("suburb").value = result[0].suburb;
                document.getElementById("zip").value = result[0].zip;
                document.getElementById("country").value = result[0].country;


                document.getElementById("product-list").value = result[0].product || "";
                // if (result[0].product.replace(/\s/g, "") != "") {
                //     $('#product-list').prepend('<option value="' + result[0].product + '" selected>' + result[0].product + '</option>');
                //
                // } else {
                //     $('#product-list').prop('selectedIndex', -1);
                // }

                document.getElementById("employee_name").value = result[0].employeename;
                document.getElementById("dtSODate").value = moment(result[0].startDate.split(" ")[0]).format("DD/MM/YYYY");
                document.getElementById("dtSODate2").value = moment(result[0].endDate.split(" ")[0]).format("DD/MM/YYYY");
                document.getElementById("startTime").value = result[0].startTime;
                document.getElementById("endTime").value = result[0].endTime;
                document.getElementById("txtBookedHoursSpent").value = result[0].totalHours;
                document.getElementById("tActualStartTime").value = result[0].aStartTime;
                document.getElementById("tActualEndTime").value = result[0].aEndTime;
                document.getElementById("txtActualHoursSpent").value = parseFloat(hours).toFixed(2) || "";

                if (!$("#smsConfirmedFlag i.fa-check-circle").hasClass("d-none")) $("#smsConfirmedFlag i.fa-check-circle").addClass("d-none");
                if (!$("#smsConfirmedFlag i.fa-close").hasClass("d-none")) $("#smsConfirmedFlag i.fa-close").addClass("d-none");
                if (!$("#smsConfirmedFlag i.fa-question").hasClass("d-none")) $("#smsConfirmedFlag i.fa-question").addClass("d-none");
                if (!$("#smsConfirmedFlag i.fa-minus-circle").hasClass("d-none")) $("#smsConfirmedFlag i.fa-minus-circle").addClass("d-none");
                if (result[0].custFld13 === "Yes") {
                    if (result[0].custFld11 === "Yes") {
                        $("#smsConfirmedFlag i.fa-check-circle").removeClass("d-none");
                    } else {
                        if (result[0].custFld11 === "No") {
                            $("#smsConfirmedFlag i.fa-close").removeClass("d-none");
                        } else {
                            $("#smsConfirmedFlag i.fa-question").removeClass("d-none");
                        }
                    }
                } else {
                    $("#smsConfirmedFlag i.fa-minus-circle").removeClass("d-none");
                }

                templateObject.attachmentCount.set(0);
                if (result[0].attachments) {
                    if (result.length) {
                        templateObject.attachmentCount.set(result[0].attachments.length);
                        templateObject.uploadedFiles.set(result[0].attachments);
                    }
                }
                $("#event-modal").modal();
                // this.$body.addClass('modal-open');
            }
        }
        setAllocationTableHeader(false);
        if (templateObject.eventdata.get()) {
            setTimeout(function() {
                templateObject.renderNormalCalendar();
            }, 1000);
        }

        const currentDate = moment();
        const dateCurrent = new Date();
        const weekStart = currentDate.clone().startOf('isoWeek').format("YYYY-MM-DD");
        const weekEnd = currentDate.clone().endOf('isoWeek').format("YYYY-MM-DD");
        const days = [];

        let weeksOfCurrentMonth = getWeeksInMonth(dateCurrent.getFullYear(), dateCurrent.getMonth());

        renderAllocationCalendar();

        templateObject.weeksOfMonth.set(weeksOfCurrentMonth);
        let startWeek = new Date(moment(weekStart).format('YYYY-MM-DD'));
        let endWeek = new Date(moment(weekEnd).format('YYYY-MM-DD'));
        //$('.fullScreenSpin').css('display', 'none');
        //if (allEmployees.length > 0) {
        for (let t = 0; t < data.tappointmentex.length; t++) {
            let date = new Date(data.tappointmentex[t].fields.StartTime.split(" ")[0]);
            let weekDay = moment(data.tappointmentex[t].fields.StartTime.split(" ")[0]).format("dddd");
            if (resourceChat.length > 0) {
                if (date >= startWeek && date <= endWeek) {
                    if (JSON.parse(seeOwnAppointments) == true) {
                        if (data.tappointmentex[t].fields.TrainerName == mySessionEmployee) {
                            let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                            if (!found) {
                                let resourceColor = templateObject.employeerecords.get();
                                result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                                });
                                let employeeColo = "'#00a3d3'";
                                if (result.length > 0) {
                                    employeeColor = result[0].color;
                                }
                                dataList = {
                                    id: data.tappointmentex[t].fields.ID,
                                    employeeName: data.tappointmentex[t].fields.TrainerName,
                                    color: employeeColor
                                };
                                resourceChat.push(dataList);
                                allEmp.push(dataList);
                            }
                            jobs = {
                                id: data.tappointmentex[t].fields.ID,
                                employeeName: data.tappointmentex[t].fields.TrainerName,
                                job: data.tappointmentex[t].fields.ClientName,
                                street: data.tappointmentex[t].fields.Street,
                                city: data.tappointmentex[t].fields.Surbub,
                                zip: data.tappointmentex[t].fields.Postcode,
                                day: weekDay,
                                date: data.tappointmentex[t].fields.StartTime.split(" ")[0],
                            };
                            resourceJob.push(jobs)
                        }
                    } else {
                        let found = resourceChat.some(emp => emp.employeeName == data.tappointmentex[t].fields.TrainerName);
                        if (!found) {
                            let resourceColor = templateObject.employeerecords.get();
                            result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                            });
                            let employeeColo = "'#00a3d3'";

                            if (result.length > 0) {
                                employeeColor = result[0].color;
                            }
                            dataList = {
                                id: data.tappointmentex[t].fields.ID,
                                employeeName: data.tappointmentex[t].fields.TrainerName,
                                color: employeeColor
                            };
                            resourceChat.push(dataList);
                            allEmp.push(dataList);
                        }
                        jobs = {
                            id: data.tappointmentex[t].fields.ID,
                            employeeName: data.tappointmentex[t].fields.TrainerName,
                            job: data.tappointmentex[t].fields.ClientName,
                            street: data.tappointmentex[t].fields.Street,
                            city: data.tappointmentex[t].fields.Surbub,
                            zip: data.tappointmentex[t].fields.Postcode,
                            day: weekDay,
                            date: data.tappointmentex[t].fields.StartTime.split(" ")[0],
                        };
                        resourceJob.push(jobs)
                    }
                }
            } else {
                if (date >= startWeek && date <= endWeek) {
                    if (JSON.parse(seeOwnAppointments) == true) {
                        if (data.tappointmentex[t].fields.TrainerName == localStorage.getItem("mySessionEmployee")) {
                            let resourceColor = templateObject.employeerecords.get();
                            result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                            });
                            let employeeColor = '#00a3d3';
                            if (result.length > 0) {
                                employeeColor = result[0].color || "";
                            }
                            dataList = {
                                id: data.tappointmentex[t].fields.ID,
                                employeeName: data.tappointmentex[t].fields.TrainerName,
                                color: employeeColor
                            };
                            jobs = {
                                id: data.tappointmentex[t].fields.ID,
                                employeeName: data.tappointmentex[t].fields.TrainerName,
                                job: data.tappointmentex[t].fields.ClientName,
                                street: data.tappointmentex[t].fields.Street,
                                city: data.tappointmentex[t].fields.Surbub,
                                zip: data.tappointmentex[t].fields.Postcode,
                                day: weekDay,
                                date: data.tappointmentex[t].fields.StartTime.split(" ")[0],
                            };
                            resourceJob.push(jobs)
                            resourceChat.push(dataList);
                            allEmp.push(dataList);
                        }
                    } else {
                        let resourceColor = templateObject.employeerecords.get();
                        result = resourceColor.filter(apmtColor => {
                            return apmtColor.employeeName == data.tappointmentex[t].fields.TrainerName
                        });
                        let employeeColor = '#00a3d3';
                        if (result.length > 0) {
                            employeeColor = result[0].color || "";
                        }
                        dataList = {
                            id: data.tappointmentex[t].fields.ID,
                            employeeName: data.tappointmentex[t].fields.TrainerName,
                            color: employeeColor
                        };
                        jobs = {
                            id: data.tappointmentex[t].fields.ID,
                            employeeName: data.tappointmentex[t].fields.TrainerName,
                            job: data.tappointmentex[t].fields.ClientName,
                            street: data.tappointmentex[t].fields.Street,
                            city: data.tappointmentex[t].fields.Surbub,
                            zip: data.tappointmentex[t].fields.Postcode,
                            day: weekDay,
                            date: data.tappointmentex[t].fields.StartTime.split(" ")[0],
                        };
                        resourceJob.push(jobs)
                        resourceChat.push(dataList);
                        allEmp.push(dataList);
                    }
                }
            }
        }
        // for (let i = 0; i < leaveemployeerecords.length; i++) {
        //     let date = new Date(leaveemployeerecords[i].StartDate.split(" ")[0]);
        //     let weekDay = moment(leaveemployeerecords[i].StartDate.split(" ")[0]).format("dddd");
        //     if (resourceChat.length > 0) {
        //         if (date >= startWeek && date <= endWeek) {
        //             let employeeColor = "'#00a3d3'";
        //             if (JSON.parse(seeOwnAppointments) == true) {
        //                 dataList = {
        //                     id: leaveemployeerecords[i].ID,
        //                     employeeName: leaveemployeerecords[i].EmployeeName,
        //                     color: employeeColor
        //                 };
        //                 resourceChat.push(dataList);
        //                 jobs = {
        //                     id: leaveemployeerecords[i].ID,
        //                     job: leaveemployeerecords[i].Description,
        //                     day: weekDay,
        //                 };
        //                 resourceJob.push(jobs)
        //             }else{
        //                 dataList = {
        //                     id: leaveemployeerecords[i].ID,
        //                     employeeName: leaveemployeerecords[i].EmployeeName,
        //                     color: employeeColor
        //                 };
        //                 resourceChat.push(dataList);
        //                 jobs = {
        //                     id: leaveemployeerecords[i].ID,
        //                     job: leaveemployeerecords[i].Description,
        //                     day: weekDay,
        //                 };
        //                 resourceJob.push(jobs)
        //             }
        //         } 
        //     }else{
        //         dataList = {
        //             id: leaveemployeerecords[i].ID,
        //             employeeName: leaveemployeerecords[i].EmployeeName,
        //             color: employeeColor
        //         };
        //         resourceChat.push(dataList);
        //         jobs = {
        //             id: leaveemployeerecords[i].ID,
        //             job: leaveemployeerecords[i].Description,
        //             day: weekDay,
        //         };
        //         resourceJob.push(jobs)
        //     }
        // }
        setTimeout(function() {
            let allEmployeesData = templateObject.employeerecords.get();
            for (let e = 0; e < allEmployeesData.length; e++) {
                let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                if (!found) {
                    const dataList = {
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
            let splashArrayMonday = [];
            let tuesdayRowData = [];
            let wednesdayRowData = [];
            let thursdayRowData = [];
            let fridayRowData = [];
            let saturdayRowData = [];
            let sundayRow = "";
            let mondayRow = "";
            let tuesdayRow = "";
            let wednesdayRow = "";
            let thursdayRow = "";
            let fridayRow = "";
            let saturdayRow = "";
            let tableRow = "";
            // let saturdayStatus = "";
            // let sundayStatus = "";
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
                        sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';
                        sundayRowData.push(sundayRow);
                    }
                    if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                        mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';
                        mondayRowData.push(mondayRow);
                    }
                    if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                        tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';
                        tuesdayRowData.push(tuesdayRow);
                    }
                    if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                        wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';
                        wednesdayRowData.push(wednesdayRow);
                    }
                    if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                        thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';
                        thursdayRowData.push(thursdayRow);
                    }
                    if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                        fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';
                        fridayRowData.push(fridayRow);
                    }
                    if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                        saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';
                        saturdayRowData.push(saturdayRow);
                    }
                }

                if ($('#showSaturday').is(":checked")) {
                    saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join("") + '</div></td>'
                } else {
                    saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join("") + '</div></td>'
                }

                if ($('#showSunday').is(":checked")) {
                    sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join("") + '</div></td>'
                } else {
                    sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join("") + '</div></td>'
                }

                tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + "" +
                    '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + "" +
                    sundayStatus + "" +
                    '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join("") + '</div></td>' + "" +
                    '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join("") + '</div></td>' + "" +
                    '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join("") + '</div></td>' + "" +
                    '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join("") + '</div></td>' + "" +
                    '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join("") + '</div></td>' + "" +
                    saturdayStatus + "" +
                    '</tr>';
                tableRowData.push(tableRow);

            }
            setTimeout(function () {
                $('#here_table table').append(tableRowData);
            }, 500);
            templateObject.employeerecords.set(allEmp);
            templateObject.resourceAllocation.set(resourceChat);
            templateObject.resourceJobs.set(resourceJob);
            templateObject.resourceDates.set(days);
            $('.fullScreenSpin').css('display', 'none');

            if ($('#showSaturday').is(":checked") && $('#showSunday').is(":checked")) {
                $('.draggable').addClass('cardWeeekend');
                $('.draggable').removeClass('cardHiddenWeekend');
                $('.draggable').removeClass('cardHiddenSundayOrSaturday');
            }
            if ($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == false) {
                $('.draggable').removeClass('cardWeeekend');
                $('.draggable').addClass('cardHiddenWeekend');
                $('.draggable').removeClass('cardHiddenSundayOrSaturday');
            }
            if (($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == true) || ($("#showSaturday").prop('checked') == true && $("#showSunday").prop('checked') == false)) {
                $('.draggable').removeClass('cardWeeekend');
                $('.draggable').removeClass('cardHiddenWeekend');
                $('.draggable').addClass('cardHiddenSundayOrSaturday');
            }
        }, 500);
    }

    function setInitCalendarData() {
        $('.fullScreenSpin').css('display', 'none');
        const calendarEl = document.getElementById("calendar");
        const currentDate = new Date();
        const begunDate = moment(currentDate).format("YYYY-MM-DD");
        $("#allocationTable .sunday").addClass("hidesunday");
        $("#allocationTable .saturday").addClass("hidesaturday");
        setAllocationTableHeader(false);

        //if(eventData.length > 0){
        const calendar = new Calendar(calendarEl, {
            plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
            themeSystem: "bootstrap",
            initialView: "dayGridMonth",
            hiddenDays: [0, 6], // hide Sunday and Saturday
            customButtons: {
                appointments: {
                    text: "Appointment List",
                    click: function() {
                        FlowRouter.go("/appointmentlist");
                    }
                },
                ...refreshButton
            },
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            initialDate: begunDate,
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectMirror: true,
            eventClick: function(arg) {
                let employeeName = arg.event._def.title;
                populateEmployDetails(employeeName);
                $("#event-modal").modal();
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            dayMaxEvents: true, // allow "more" link when too many events
            //Triggers modal once event is moved to another date within the calendar.
            dayHeaderFormat: function(date) {
                if (LoggedCountry == "United States") {
                    return moment(date.date.marker).format("ddd") + " " + moment(date.date.marker).format("MM/DD");
                } else {
                    return moment(date.date.marker).format("ddd") + " " + moment(date.date.marker).format("DD/MM");
                }
            },
            select: function(info) {
                $("#frmAppointment")[0].reset();
                $(".paused").hide();
                templateObject.getAllProductData();
                let dateStart = new Date(info.start);
                let dateStartForEndTime = new Date(info.start);
                let dateEnd = new Date(info.end);
                let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                dateStartForEndTime.setHours(dateStartForEndTime.getHours() + calendarSet.DefaultApptDuration || "02:00");
                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                let endTime = ("0" + dateStartForEndTime.getHours()).toString().slice(-2) + ":" + ("0" + dateStartForEndTime.getMinutes()).toString().slice(-2);
                document.getElementById("dtSODate").value = startDate;
                document.getElementById("dtSODate2").value = endDate;
                document.getElementById("startTime").value = startTime;
                document.getElementById("endTime").value = endTime;
                document.getElementById("employee_name").value = localStorage.getItem("mySessionEmployee");
                if (calendarSet.DefaultApptDuration) {
                    let hoursFormattedStartTime = templateObject.timeFormat(calendarSet.DefaultApptDuration) || "";
                    document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime
                } else {
                    let hours = templateObject.diff_hours(dateStart, dateStartForEndTime);
                    let hoursFormattedStartTime = templateObject.timeFormat(hours) || "";
                    document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                }
                templateObject.attachmentCount.set("");
                templateObject.uploadedFiles.set("");
                templateObject.uploadedFile.set("");
                if (FlowRouter.current().queryParams.leadid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.leadid, templateObject);
                } else if (FlowRouter.current().queryParams.customerid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.customerid, templateObject);
                } else if (FlowRouter.current().queryParams.supplierid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.supplierid, templateObject);
                } else {
                    // $("#customerListModal").modal();
                    $("#appointmentLeaveConfirmModal").modal("toggle");
                    // $("#appointmentDate").val(moment(info.start).format("DD/MM/YYYY"));
                    // calendar.gotoDate(info.start);
                    // $(".fc-timeGridDay-button").trigger("click");
                }
            },
            eventDrop: function(info) {
               evenDropAndResize(info)
            },
            //Triggers modal once external object is dropped to calender.
            drop: function(event) {
                let hoursSpent;
                let appointmentHours;
                let endTime;
                let draggedEmployeeID = templateObject.empID.get();
                let calendarData = templateObject.employeeOptions.get();
                let calendarSet = templateObject.globalSettings.get();
                let employees = templateObject.employeerecords.get();
                let overridesettings = employees.filter(employeeData => {
                    return employeeData.id == parseInt(draggedEmployeeID)
                });
                let empData = calendarData.filter(calendarOpt => {
                    return calendarOpt.EmployeeID == parseInt(draggedEmployeeID)
                });
                document.getElementById("frmAppointment").reset();
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
                $("#btnStartAppointment").prop("disabled", false);
                $("#btnStopAppointment").prop("disabled", false);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                $("#tActualStartTime").prop("disabled", false);
                $("#tActualEndTime").prop("disabled", false);
                $("#txtActualHoursSpent").prop("disabled", false);
                if (startAndStopAppointmentOnly == true) {
                    //$("#btnHold").prop("disabled", true);
                }
                document.getElementById("employee_name").value = event.draggedEl.innerText.replace(/[0-9]/g, "");
                const start = event.dateStr != "" ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                document.getElementById("dtSODate").value = start;
                document.getElementById("dtSODate2").value = start
                let startTime = moment(event.dateStr).format("HH:mm");
                document.getElementById("startTime").value = startTime;
                if (overridesettings[0].override == "false") {
                    if (calendarSet.DefaultApptDuration) {
                        endTime = moment(startTime, "HH:mm").add(parseInt(calendarSet.DefaultApptDuration), "hours").format("HH:mm");
                        document.getElementById("endTime").value = endTime;
                        let hoursFormattedStartTime = templateObject.timeFormat(calendarSet.DefaultApptDuration) || "";
                        document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                    } else {
                        appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), "HH:mm").format("HH:mm");
                        endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                        document.getElementById("endTime").value = endTime;
                        hoursSpent = moment(appointmentHours, "hours").format('HH');
                        let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                        document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                    }
                    document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                    // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                    // $("#product-list")[0].options[0].selected = true;
                } else if (overridesettings[0].override == "true") {
                    if (templateObject.empDuration.get() != "") {
                        endTime = moment(startTime, "HH:mm").add(parseInt(templateObject.empDuration.get()), "hours").format("HH:mm");
                        document.getElementById("endTime").value = endTime;
                        let hoursFormattedStartTime = templateObject.timeFormat(templateObject.empDuration.get()) || "";
                        document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                    } else {
                        appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), "HH:mm").format("HH:mm");
                        endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                        document.getElementById("endTime").value = endTime;
                        hoursSpent = moment(appointmentHours, "hours").format('HH');
                        let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                        document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                    }
                    if (empData.length > 0) {
                        document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                        // $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                        // $("#product-list")[0].options[0].selected = true;
                    } else {
                        document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                        // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                        // $("#product-list")[0].options[0].selected = true;
                    }
                } else {
                    if (templateObject.empDuration.get() != "") {
                        endTime = moment(startTime, "HH:mm").add(parseInt(templateObject.empDuration.get()), "hours").format("HH:mm");
                        document.getElementById("endTime").value = endTime;
                        let hoursFormattedStartTime = templateObject.timeFormat(templateObject.empDuration.get()) || "";
                        document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                    } else {
                        appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), "HH:mm").format("HH:mm");
                        endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                        document.getElementById("endTime").value = endTime;
                        hoursSpent = moment(appointmentHours, "hours").format('HH');
                        let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                        document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                    }
                    if (empData.length > 0) {
                        document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                        // $('#product-list').prepend('<option value=' + empData[0].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                        // $("#product-list")[0].options[0].selected = true;
                    } else {
                        document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                        // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                        // $("#product-list")[0].options[0].selected = true;
                    }
                }
                endTime = moment(document.getElementById("dtSODate2").value + " " + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                startTime = moment(document.getElementById("dtSODate2").value + " " + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                if (FlowRouter.current().queryParams.leadid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.leadid, templateObject);
                } else if (FlowRouter.current().queryParams.customerid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.customerid, templateObject);
                } else if (FlowRouter.current().queryParams.supplierid) {
                    openAppointModalDirectly(FlowRouter.current().queryParams.supplierid, templateObject);
                } else {
                    $("#customerListModal").modal();
                }
            },
            events: [],
            eventDidMount: function() {}
        });
        calendar.render();

        let draggableEl = document.getElementById('external-events-list');
        new Draggable(draggableEl, {
            itemSelector: '.fc-event',
            eventData: function(eventEl) {
                $('#updateID').val("");
                let employee = eventEl.textContent;
                let empInit = employee.replace(/-?[0-9]*\.?[0-9]+/, "");
                let employeeID = empInit.replace(/\D/g, "");
                templateObject.empID.set(employeeID);
                return {
                    title: eventEl.innerText,
                    duration: "0" + templateObject.empDuration.get() + ":00" || '01:00'
                };
            }
        });
    }

    // templateObject.getAllClients = function() {
    //     getVS1Data('TCustomerVS1').then(function(dataObject) {
    //         if (dataObject.length == 0) {
    //             setClientVS1(data);
    //         } else {
    //             let data = JSON.parse(dataObject[0].data);
    //             setClientVS1(data);
    //         }
    //     }).catch(function(err) {
    //         clientsService.getClientVS1().then(function(data) {
    //             setClientVS1(data);
    //         });
    //     });
    // };

    // function setClientVS1(data) {
    //     clientsService.getClientVS1().then(function(data) {
    //         for (let i in data.tcustomervs1) {
    //             if (data.tcustomervs1.hasOwnProperty(i)) {
    //                 let customerrecordObj = {
    //                     customerid: data.tcustomervs1[i].Id || " ",
    //                     customername: data.tcustomervs1[i].ClientName || " ",
    //                     customeremail: data.tcustomervs1[i].Email || " ",
    //                     street: data.tcustomervs1[i].Street.replace(/(?:\r\n|\r|\n)/g, ', ') || " ",
    //                     street2: data.tcustomervs1[i].Street2 || " ",
    //                     street3: data.tcustomervs1[i].Street3 || " ",
    //                     suburb: data.tcustomervs1[i].Suburb || data.tcustomervs1[i].Street2,
    //                     phone: data.tcustomervs1[i].Phone || " ",
    //                     statecode: data.tcustomervs1[i].State + " " + data.tcustomervs1[i].Postcode || " ",
    //                     country: data.tcustomervs1[i].Country || " ",
    //                     termsName: data.tcustomervs1[i].TermsName || ""
    //                 };
    //                 //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
    //                 clientList.push(customerrecordObj);
    //                 //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
    //             }
    //         }
    //         templateObject.clientrecords.set(clientList);
    //         templateObject.clientrecords.set(clientList.sort(function(a, b) {
    //             if (a.customername == 'NA') {
    //                 return 1;
    //             } else if (b.customername == 'NA') {
    //                 return -1;
    //             }
    //             return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
    //         }));

    //         for (let i = 0; i < clientList.length; i++) {
    //             //$('#customer').editableSelect('add', clientList[i].customername);
    //         }
    //     });
    // }
    // templateObject.getAllClients();
    //get employee data to auto fill data on new appointment
    function populateEmployDetails(employeeName) {
        document.getElementById("employee_name").value = employeeName;
    }

    function setOneCustomerData(data) {
        $('.fullScreenSpin').css('display', 'none');
        let lineItems = [];
        $('#add-customer-title').text('Edit Customer');
        let popCustomerID = data.fields.ID || "";
        let popCustomerName = data.fields.ClientName || "";
        let popCustomerEmail = data.fields.Email || "";
        let popCustomerTitle = data.fields.Title || "";
        let popCustomerFirstName = data.fields.FirstName || "";
        let popCustomerMiddleName = data.fields.CUSTFLD10 || "";
        let popCustomerLastName = data.fields.LastName || "";
        let popCustomertfn = "" || "";
        let popCustomerPhone = data.fields.Phone || "";
        let popCustomerMobile = data.fields.Mobile || "";
        let popCustomerFaxnumber = data.fields.Faxnumber || "";
        let popCustomerSkypeName = data.fields.SkypeName || "";
        let popCustomerURL = data.fields.URL || "";
        let popCustomerStreet = data.fields.Street || "";
        let popCustomerStreet2 = data.fields.Street2 || "";
        let popCustomerState = data.fields.State || "";
        let popCustomerPostcode = data.fields.Postcode || "";
        let popCustomerCountry = data.fields.Country || LoggedCountry;
        let popCustomerbillingaddress = data.fields.BillStreet || "";
        let popCustomerbcity = data.fields.BillStreet2 || "";
        let popCustomerbstate = data.fields.BillState || "";
        let popCustomerbpostalcode = data.fields.BillPostcode || "";
        let popCustomerbcountry = data.fields.Billcountry || LoggedCountry;
        let popCustomercustfield1 = data.fields.CUSTFLD1 || "";
        let popCustomercustfield2 = data.fields.CUSTFLD2 || "";
        let popCustomercustfield3 = data.fields.CUSTFLD3 || "";
        let popCustomercustfield4 = data.fields.CUSTFLD4 || "";
        let popCustomernotes = data.fields.Notes || "";
        let popCustomerpreferedpayment = data.fields.PaymentMethodName || "";
        let popCustomerterms = data.fields.TermsName || "";
        let popCustomerdeliverymethod = data.fields.ShippingMethodName || "";
        let popCustomeraccountnumber = data.fields.ClientNo || "";
        let popCustomerisContractor = data.fields.Contractor || false;
        let popCustomerissupplier = data.fields.IsSupplier || false;
        let popCustomeriscustomer = data.fields.IsCustomer || false;
        let popCustomerTaxCode = data.fields.TaxCodeName || "";
        let popCustomerDiscount = data.fields.Discount || 0;
        let popCustomerType = data.fields.ClientTypeName || "";
        //$('#edtCustomerCompany').attr('readonly', true);
        $('#edtCustomerCompany').val(popCustomerName);
        $('#edtCustomerPOPID').val(popCustomerID);
        $('#edtCustomerPOPEmail').val(popCustomerEmail);
        $('#edtTitle').val(popCustomerTitle);
        $('#edtFirstName').val(popCustomerFirstName);
        $('#edtMiddleName').val(popCustomerMiddleName);
        $('#edtLastName').val(popCustomerLastName);
        $('#edtCustomerPhone').val(popCustomerPhone);
        $('#edtCustomerMobile').val(popCustomerMobile);
        $('#edtCustomerFax').val(popCustomerFaxnumber);
        $('#edtCustomerSkypeID').val(popCustomerSkypeName);
        $('#edtCustomerWebsite').val(popCustomerURL);
        $('#edtCustomerShippingAddress').val(popCustomerStreet);
        $('#edtCustomerShippingCity').val(popCustomerStreet2);
        $('#edtCustomerShippingState').val(popCustomerState);
        $('#edtCustomerShippingZIP').val(popCustomerPostcode);
        $('#sedtCountry').val(popCustomerCountry);
        $('#txaNotes').val(popCustomernotes);
        $('#sltPreferedPayment').val(popCustomerpreferedpayment);
        $('#sltTermsPOP').val(popCustomerterms);
        $('#sltCustomerType').val(popCustomerType);
        $('#edtCustomerCardDiscount').val(popCustomerDiscount);
        $('#edtCustomeField1').val(popCustomercustfield1);
        $('#edtCustomeField2').val(popCustomercustfield2);
        $('#edtCustomeField3').val(popCustomercustfield3);
        $('#edtCustomeField4').val(popCustomercustfield4);
        $('#sltTaxCode').val(popCustomerTaxCode);
        if ((data.fields.Street == data.fields.BillStreet) && (data.fields.Street2 == data.fields.BillStreet2) &&
            (data.fields.State == data.fields.BillState) && (data.fields.Postcode == data.fields.BillPostcode) &&
            (data.fields.Country == data.fields.Billcountry)) {
            $('#chkSameAsShipping2').attr("checked", "checked");
        }
        if (data.fields.IsSupplier == true) {
            $('#chkSameAsSupplier').attr("checked", "checked");
        } else {
            $('#chkSameAsSupplier').removeAttr("checked");
        }
        let customerRecord = {
            id:popCustomerID,
            phone:popCustomerPhone,
            firstname:popCustomerFirstName,
            middlename: popCustomerMiddleName,
            lastname:popCustomerLastName,
            company:data.fields.Companyname || '',
            email: popCustomerEmail,
            title: popCustomerTitle,
            tfn: popCustomertfn,
            mobile: popCustomerMobile,
            fax: popCustomerFaxnumber,
            shippingaddress: popCustomerStreet,
            scity: popCustomerStreet2,
            sstate: popCustomerCountry,
            terms: '',
            spostalcode: popCustomerPostcode,
            scountry: popCustomerState,
            billingaddress: popCustomerbillingaddress,
            bcity: popCustomerbcity,
            bstate: popCustomerbstate,
            bpostalcode: popCustomerbpostalcode,
            bcountry: popCustomerCountry,
            custFld1: popCustomercustfield1,
            custFld2: popCustomercustfield2,
            jobbcountry: '',
            jobscountry: '',
            discount:0
        }
        templateObject.customerRecord.set(customerRecord);
        setTimeout(function() {
            $('#addCustomerModal').modal("show");
        }, 200);
    }

    $(document).ready(function() {
        $("#customer").editableSelect();
        $("#product-list").editableSelect();
        $("#product-list-1").editableSelect();
		$("#customer").editableSelect().on("click.editable-select", function(e, li) {
			var $earch = $(this);
			var offset = $earch.offset();
			$("#edtCustomerPOPID").val("");
			//$('#edtCustomerCompany').attr('readonly', false);
			var customerDataName = e.target.value || "";
			if (e.pageX > offset.left + $earch.width() - 8) {
				// X button 16px wide?
				if (FlowRouter.current().queryParams.leadid) {
					openAppointModalDirectly(FlowRouter.current().queryParams.leadid,templateObject);
				} else if (FlowRouter.current().queryParams.customerid) {
					openAppointModalDirectly(FlowRouter.current().queryParams.customerid,templateObject);
				} else if (FlowRouter.current().queryParams.supplierid) {
					openAppointModalDirectly(FlowRouter.current().queryParams.supplierid,templateObject);
				} else {
					$("#customerListModal").modal();
				}
				setTimeout(function() {
					$("#tblCustomerlist_filter .form-control-sm").focus();
					$("#tblCustomerlist_filter .form-control-sm").val("");
					$("#tblCustomerlist_filter .form-control-sm").trigger("input");
					var datatable = $("#tblCustomerlist").DataTable();
					//datatable.clear();
					//datatable.rows.add(splashArrayCustomerList);
					datatable.draw();
					$("#tblCustomerlist_filter .form-control-sm").trigger("input");
					//$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
				}, 500);
			} else {
				if (customerDataName.replace(/\s/g, "") != "") {
					//FlowRouter.go('/customerscard?name=' + e.target.value);
					$("#edtCustomerPOPID").val("");
					getVS1Data("TCustomerVS1").then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $(".fullScreenSpin").css("display", "inline-block");
                            sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                                setOneCustomerData(data.tcustomer[0])
                            }).catch(function(err) {
                                $(".fullScreenSpin").css("display", "none");
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            var added = false;
                            for (let i = 0; i < data.tcustomervs1.length; i++) {
                                if (data.tcustomervs1[i].fields.ClientName === customerDataName) {
                                    added = true;
                                    setOneCustomerData(data.tcustomervs1[i])
                                }
                            }
                            if (!added) {
                                $(".fullScreenSpin").css("display", "inline-block");
                                sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                                    setOneCustomerData(data.tcustomer[0])
                                }).catch(function(err) {
                                    $(".fullScreenSpin").css("display", "none");
                                });
                            }
                        }
                    }).catch(function(err) {
                    });
				} else {
					if (FlowRouter.current().queryParams.leadid) {
						openAppointModalDirectly(FlowRouter.current().queryParams.leadid,templateObject);
					} else if (FlowRouter.current().queryParams.customerid) {
						openAppointModalDirectly(FlowRouter.current().queryParams.customerid,templateObject);
					} else if (FlowRouter.current().queryParams.supplierid) {
						openAppointModalDirectly(FlowRouter.current().queryParams.supplierid,templateObject);
					} else {
						$("#customerListModal").modal();
					}
					setTimeout(function() {
						$("#tblCustomerlist_filter .form-control-sm").focus();
						$("#tblCustomerlist_filter .form-control-sm").val("");
						$("#tblCustomerlist_filter .form-control-sm").trigger("input");
						var datatable = $("#tblCustomerlist").DataTable();
						//datatable.clear();
						//datatable.rows.add(splashArrayCustomerList);
						datatable.draw();
						$("#tblCustomerlist_filter .form-control-sm").trigger("input");
						//$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
					}, 500);
				}
			}
			//let selectedCustomer = li.text();
			// var custName = li.text();
			// var newJob = clientList.filter(function (customer) {
			//     return customer.customername == custName;
			// });
			//
			// document.getElementById("customer").value = newJob[0].customername || '';
			// document.getElementById("phone").value = newJob[0].phone || '';
			// document.getElementById("mobile").value = newJob[0].phone || '';
			// document.getElementById("state").value = newJob[0].country || '';
			// document.getElementById("address").value = newJob[0].street || '';
			// // document.getElementById("txtNotes").value = $(this).find(".colNotes").text();
			// document.getElementById("suburb").value = newJob[0].suburb || '';
			// document.getElementById("zip").value = newJob[0].statecode || '0';
		});

		$("#product-list, #product-list-1").editableSelect().on("click.editable-select", function(e, li) {
			var $earch = $(this);
			var offset = $earch.offset();
			var productDataName = e.target.value || "";
			//var productDataID = el.context.value || '';
			// if(el){
			//   var productCostData = el.context.id || 0;
			//   $('#edtProductCost').val(productCostData);
			// }
			if (event.pageX > offset.left + $earch.width() - 10) {
				// X button 16px wide?
				$("#productListModal").modal("toggle");
				setTimeout(function() {
					$("#tblInventoryPayrollService_filter .form-control-sm").focus();
					$("#tblInventoryPayrollService_filter .form-control-sm").val("");
					$("#tblInventoryPayrollService_filter .form-control-sm").trigger(
						"input"
					);

					var datatable = $("#tblInventoryPayrollService").DataTable();
					datatable.draw();
					$("#tblInventoryPayrollService_filter .form-control-sm").trigger(
						"input"
					);
				}, 500);
			} else {
				// var productDataID = $(event.target).attr('prodid').replace(/\s/g, '') || '';
				if (productDataName.replace(/\s/g, "") != "") {
					//FlowRouter.go('/productview?prodname=' + $(event.target).text());
					let lineExtaSellItems = [];
					let lineExtaSellObj = {};
					$(".fullScreenSpin").css("display", "inline-block");
					getVS1Data("TProductWeb").then(function(dataObject) {
                        if (dataObject.length == 0) {
                            sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                                $(".fullScreenSpin").css("display", "none");
                                let lineItems = [];
                                let lineItemObj = {};
                                let currencySymbol = Currency;
                                let totalquantity = 0;
                                let productname = data.tproduct[0].fields.ProductName || "";
                                let productcode = data.tproduct[0].fields.PRODUCTCODE || "";
                                let productprintName = data.tproduct[0].fields.ProductPrintName || "";
                                let assetaccount = data.tproduct[0].fields.AssetAccount || "";
                                let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                                let cogsaccount = data.tproduct[0].fields.CogsAccount || "";
                                let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || "";
                                let purchasedescription = data.tproduct[0].fields.PurchaseDescription || "";
                                let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                                let incomeaccount = data.tproduct[0].fields.IncomeAccount || "";
                                let taxcodesales = data.tproduct[0].fields.TaxCodeSales || "";
                                let salesdescription = data.tproduct[0].fields.SalesDescription || "";
                                let active = data.tproduct[0].fields.Active;
                                let lockextrasell = data.tproduct[0].fields.LockExtraSell || "";
                                let customfield1 = data.tproduct[0].fields.CUSTFLD1 || "";
                                let customfield2 = data.tproduct[0].fields.CUSTFLD2 || "";
                                let barcode = data.tproduct[0].fields.BARCODE || "";
                                $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                                $("#add-product-title").text("Edit Product");
                                $("#edtproductname").val(productname);
                                $("#edtsellqty1price").val(sellqty1price);
                                $("#txasalesdescription").val(salesdescription);
                                $("#sltsalesacount").val(incomeaccount);
                                $("#slttaxcodesales").val(taxcodesales);
                                $("#edtbarcode").val(barcode);
                                $("#txapurchasedescription").val(purchasedescription);
                                $("#sltcogsaccount").val(cogsaccount);
                                $("#slttaxcodepurchase").val(taxcodepurchase);
                                $("#edtbuyqty1cost").val(buyqty1cost);

                                setTimeout(function() {
                                    $("#newProductModal").modal("show");
                                }, 500);
                            }).catch(function(err) {
                                $(".fullScreenSpin").css("display", "none");
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tproductvs1;
                            var added = false;

                            for (let i = 0; i < data.tproductvs1.length; i++) {
                                if (data.tproductvs1[i].fields.ProductName === productDataName) {
                                    added = true;
                                    $(".fullScreenSpin").css("display", "none");
                                    let lineItems = [];
                                    let lineItemObj = {};
                                    let currencySymbol = Currency;
                                    let totalquantity = 0;

                                    let productname = data.tproductvs1[i].fields.ProductName || "";
                                    let productcode = data.tproductvs1[i].fields.PRODUCTCODE || "";
                                    let productprintName = data.tproductvs1[i].fields.ProductPrintName || "";
                                    let assetaccount = data.tproductvs1[i].fields.AssetAccount || "";
                                    let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.BuyQty1Cost) || 0;
                                    let cogsaccount = data.tproductvs1[i].fields.CogsAccount || "";
                                    let taxcodepurchase = data.tproductvs1[i].fields.TaxCodePurchase || "";
                                    let purchasedescription = data.tproductvs1[i].fields.PurchaseDescription || "";
                                    let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.SellQty1Price) || 0;
                                    let incomeaccount = data.tproductvs1[i].fields.IncomeAccount || "";
                                    let taxcodesales = data.tproductvs1[i].fields.TaxCodeSales || "";
                                    let salesdescription = data.tproductvs1[i].fields.SalesDescription || "";
                                    let active = data.tproductvs1[i].fields.Active;
                                    let lockextrasell = data.tproductvs1[i].fields.LockExtraSell || "";
                                    let customfield1 = data.tproductvs1[i].fields.CUSTFLD1 || "";
                                    let customfield2 = data.tproductvs1[i].fields.CUSTFLD2 || "";
                                    let barcode = data.tproductvs1[i].fields.BARCODE || "";
                                    $("#selectProductID").val(data.tproductvs1[i].fields.ID).trigger("change");
                                    $("#add-product-title").text("Edit Product");
                                    $("#edtproductname").val(productname);
                                    $("#edtsellqty1price").val(sellqty1price);
                                    $("#txasalesdescription").val(salesdescription);
                                    $("#sltsalesacount").val(incomeaccount);
                                    $("#slttaxcodesales").val(taxcodesales);
                                    $("#edtbarcode").val(barcode);
                                    $("#txapurchasedescription").val(purchasedescription);
                                    $("#sltcogsaccount").val(cogsaccount);
                                    $("#slttaxcodepurchase").val(taxcodepurchase);
                                    $("#edtbuyqty1cost").val(buyqty1cost);

                                    setTimeout(function() {
                                        $("#newProductModal").modal("show");
                                    }, 500);
                                }
                            }
                            if (!added) {
                                sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                                    $(".fullScreenSpin").css("display", "none");
                                    let lineItems = [];
                                    let lineItemObj = {};
                                    let currencySymbol = Currency;
                                    let totalquantity = 0;
                                    let productname = data.tproduct[0].fields.ProductName || "";
                                    let productcode = data.tproduct[0].fields.PRODUCTCODE || "";
                                    let productprintName = data.tproduct[0].fields.ProductPrintName || "";
                                    let assetaccount = data.tproduct[0].fields.AssetAccount || "";
                                    let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                                    let cogsaccount = data.tproduct[0].fields.CogsAccount || "";
                                    let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || "";
                                    let purchasedescription = data.tproduct[0].fields.PurchaseDescription || "";
                                    let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                                    let incomeaccount = data.tproduct[0].fields.IncomeAccount || "";
                                    let taxcodesales = data.tproduct[0].fields.TaxCodeSales || "";
                                    let salesdescription = data.tproduct[0].fields.SalesDescription || "";
                                    let active = data.tproduct[0].fields.Active;
                                    let lockextrasell = data.tproduct[0].fields.LockExtraSell || "";
                                    let customfield1 = data.tproduct[0].fields.CUSTFLD1 || "";
                                    let customfield2 = data.tproduct[0].fields.CUSTFLD2 || "";
                                    let barcode = data.tproduct[0].fields.BARCODE || "";
                                    $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                                    $("#add-product-title").text("Edit Product");
                                    $("#edtproductname").val(productname);
                                    $("#edtsellqty1price").val(sellqty1price);
                                    $("#txasalesdescription").val(salesdescription);
                                    $("#sltsalesacount").val(incomeaccount);
                                    $("#slttaxcodesales").val(taxcodesales);
                                    $("#edtbarcode").val(barcode);
                                    $("#txapurchasedescription").val(purchasedescription);
                                    $("#sltcogsaccount").val(cogsaccount);
                                    $("#slttaxcodepurchase").val(taxcodepurchase);
                                    $("#edtbuyqty1cost").val(buyqty1cost);

                                    setTimeout(function() {
                                        $("#newProductModal").modal("show");
                                    }, 500);
                                }).catch(function(err) {
                                    $(".fullScreenSpin").css("display", "none");
                                });
                            }
                        }
                    }).catch(function(err) {
                        sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                            $(".fullScreenSpin").css("display", "none");
                            let lineItems = [];
                            let lineItemObj = {};
                            let currencySymbol = Currency;
                            let totalquantity = 0;
                            let productname = data.tproduct[0].fields.ProductName || "";
                            let productcode = data.tproduct[0].fields.PRODUCTCODE || "";
                            let productprintName = data.tproduct[0].fields.ProductPrintName || "";
                            let assetaccount = data.tproduct[0].fields.AssetAccount || "";
                            let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                            let cogsaccount = data.tproduct[0].fields.CogsAccount || "";
                            let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || "";
                            let purchasedescription = data.tproduct[0].fields.PurchaseDescription || "";
                            let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                            let incomeaccount = data.tproduct[0].fields.IncomeAccount || "";
                            let taxcodesales = data.tproduct[0].fields.TaxCodeSales || "";
                            let salesdescription = data.tproduct[0].fields.SalesDescription || "";
                            let active = data.tproduct[0].fields.Active;
                            let lockextrasell = data.tproduct[0].fields.LockExtraSell || "";
                            let customfield1 = data.tproduct[0].fields.CUSTFLD1 || "";
                            let customfield2 = data.tproduct[0].fields.CUSTFLD2 || "";
                            let barcode = data.tproduct[0].fields.BARCODE || "";
                            $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                            $("#add-product-title").text("Edit Product");
                            $("#edtproductname").val(productname);
                            $("#edtsellqty1price").val(sellqty1price);
                            $("#txasalesdescription").val(salesdescription);
                            $("#sltsalesacount").val(incomeaccount);
                            $("#slttaxcodesales").val(taxcodesales);
                            $("#edtbarcode").val(barcode);
                            $("#txapurchasedescription").val(purchasedescription);
                            $("#sltcogsaccount").val(cogsaccount);
                            $("#slttaxcodepurchase").val(taxcodepurchase);
                            $("#edtbuyqty1cost").val(buyqty1cost);

                            setTimeout(function() {
                                $("#newProductModal").modal("show");
                            }, 500);
                        }).catch(function(err) {
                            $(".fullScreenSpin").css("display", "none");
                        });
                    });

					setTimeout(function() {
						var begin_day_value = $("#event_begin_day").attr("value");
						$("#dtDateTo").datepicker({
                            showOn: "button",
                            buttonText: "Show Date",
                            buttonImageOnly: true,
                            buttonImage: "/img/imgCal2.png",
                            constrainInput: false,
                            dateFormat: "d/mm/yy",
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            changeMonth: true,
                            changeYear: true,
                            yearRange: "-90:+10",
                        })
                        .keyup(function(e) {
                            if (e.keyCode == 8 || e.keyCode == 46) {
                                $("#dtDateTo,#dtDateFrom").val("");
                            }
                        });

						$("#dtDateFrom").datepicker({
                            showOn: "button",
                            buttonText: "Show Date",
                            altField: "#dtDateFrom",
                            buttonImageOnly: true,
                            buttonImage: "/img/imgCal2.png",
                            constrainInput: false,
                            dateFormat: "d/mm/yy",
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            changeMonth: true,
                            changeYear: true,
                            yearRange: "-90:+10",
                        })
                        .keyup(function(e) {
                            if (e.keyCode == 8 || e.keyCode == 46) {
                                $("#dtDateTo,#dtDateFrom").val("");
                            }
                        });

						$(".ui-datepicker .ui-state-hihglight").removeClass("ui-state-highlight");
					}, 1000);
					//}

					templateObject.getProductClassQtyData = function() {
						productService.getOneProductClassQtyData(currentProductID).then(function(data) {
                            $(".fullScreenSpin").css("display", "none");
                            let qtylineItems = [];
                            let qtylineItemObj = {};
                            let currencySymbol = Currency;
                            let totaldeptquantity = 0;

                            for (let j in data.tproductclassquantity) {
                                qtylineItemObj = {
                                    department: data.tproductclassquantity[j].DepartmentName || "",
                                    quantity: data.tproductclassquantity[j].InStockQty || 0,
                                };
                                totaldeptquantity += data.tproductclassquantity[j].InStockQty;
                                qtylineItems.push(qtylineItemObj);
                            }
                            // $('#edttotalqtyinstock').val(totaldeptquantity);
                            templateObject.productqtyrecords.set(qtylineItems);
                            templateObject.totaldeptquantity.set(totaldeptquantity);
                        }).catch(function(err) {
                            $(".fullScreenSpin").css("display", "none");
                        });
					};

					//templateObject.getProductClassQtyData();
					//templateObject.getProductData();
				} else {
					$("#productListModal").modal("toggle");

					setTimeout(function() {
						$("#tblInventoryPayrollService_filter .form-control-sm").focus();
						$("#tblInventoryPayrollService_filter .form-control-sm").val("");
						$("#tblInventoryPayrollService_filter .form-control-sm").trigger("input");

						var datatable = $("#tblInventoryPayrollService").DataTable();
						datatable.draw();
						$("#tblInventoryPayrollService_filter .form-control-sm").trigger("input");
					}, 500);
				}
			}
		});
    });
    $(document).on("click", ".addExtraProduct", function(e) {
        $("#productListModal1").modal("toggle");
        setTimeout(function() {
            $("#tblInventoryCheckbox_filter .form-control-sm").focus();
            $("#tblInventoryCheckbox_filter .form-control-sm").val("");
            $("#tblInventoryCheckbox_filter .form-control-sm").trigger("input");
            var datatable = $("#tblInventoryCheckbox").DataTable();
            datatable.draw();
            $("#tblInventoryCheckbox_filter .form-control-sm").trigger("input");
        }, 500);
    });

    // function initCustomerModal() {
    //     if (FlowRouter.current().queryParams.leadid) {
    //         openAppointModalDirectly(FlowRouter.current().queryParams.leadid, templateObject);
    //     } else if (FlowRouter.current().queryParams.customerid) {
    //         openAppointModalDirectly(FlowRouter.current().queryParams.customerid, templateObject);
    //     } else if (FlowRouter.current().queryParams.supplierid) {
    //         openAppointModalDirectly(FlowRouter.current().queryParams.supplierid, templateObject);
    //     } else {
    //         $("#customerListModal").modal();
    //     }
    //     setTimeout(function() {
    //         $('#tblCustomerlist_filter .form-control-sm').focus();
    //         $('#tblCustomerlist_filter .form-control-sm').val("");
    //         $('#tblCustomerlist_filter .form-control-sm').trigger("input");
    //         const datatable = $('#tblCustomerlist').DataTable();
    //         //datatable.clear();
    //         //datatable.rows.add(splashArrayCustomerList);
    //         datatable.draw();
    //         $('#tblCustomerlist_filter .form-control-sm').trigger("input");
    //         //$('#tblCustomerlist').dataTable().fnFilter(" ").draw(false);
    //     }, 500);
    // }

    $('#product-list').editableSelect().on('click.editable-select', function(event, li) {
        const $each = $(this);
        const offset = $each.offset();
        const productDataName = e.target.value || "";
        //var productDataID = el.context.value || "";
        // if(el){
        //   var productCostData = el.context.id || 0;
        //   $('#edtProductCost').val(productCostData);
        // }
        if (event.pageX > offset.left + $each.width() - 10) { // X button 16px wide?
            $('#productListModal').modal('toggle');
            setTimeout(function() {
                $('#tblInventoryPayrollService_filter .form-control-sm').focus();
                $('#tblInventoryPayrollService_filter .form-control-sm').val("");
                $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");
                const datatable = $('#tblInventoryPayrollService').DataTable();
                datatable.draw();
                $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");
            }, 500);
        } else {
            // var productDataID = $(event.target).attr('prodid').replace(/\s/g, "") || "";
            if (productDataName.replace(/\s/g, "") != "") {
                //FlowRouter.go('/productview?prodname=' + $(event.target).text());
                let lineExtaSellItems = [];
                let lineExtaSellObj = {};

                getVS1Data('TProductWeb').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                            setOneProductData(data.tproduct[0]);
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tproductvs1;
                        let added = false;
                        for (let i = 0; i < data.tproductvs1.length; i++) {
                            if (data.tproductvs1[i].fields.ProductName === productDataName) {
                                added = true;
                                setOneProductData(data.tproductvs1[i]);
                            }
                        }
                        if (!added) {
                            sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                                setOneProductData(data.tproduct[0]);
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                }).catch(function(err) {
                    sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                        setOneProductData(data.tproduct[0]);
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                });
                setTimeout(function() {
                    var begin_day_value = $('#event_begin_day').attr('value');
                    $("#dtDateTo").datepicker({
                        showOn: 'button',
                        buttonText: 'Show Date',
                        buttonImageOnly: true,
                        buttonImage: '/img/imgCal2.png',
                        constrainInput: false,
                        dateFormat: 'd/mm/yy',
                        showOtherMonths: true,
                        selectOtherMonths: true,
                        changeMonth: true,
                        changeYear: true,
                        yearRange: "-90:+10",
                    }).keyup(function(e) {
                        if (e.keyCode == 8 || e.keyCode == 46) {
                            $("#dtDateTo,#dtDateFrom").val("");
                        }
                    });

                    $("#dtDateFrom").datepicker({
                        showOn: 'button',
                        buttonText: 'Show Date',
                        altField: "#dtDateFrom",
                        buttonImageOnly: true,
                        buttonImage: '/img/imgCal2.png',
                        constrainInput: false,
                        dateFormat: 'd/mm/yy',
                        showOtherMonths: true,
                        selectOtherMonths: true,
                        changeMonth: true,
                        changeYear: true,
                        yearRange: "-90:+10",
                    }).keyup(function(e) {
                        if (e.keyCode == 8 || e.keyCode == 46) {
                            $("#dtDateTo,#dtDateFrom").val("");
                        }
                    });
                    $(".ui-datepicker .ui-state-hihglight").removeClass("ui-state-highlight");
                }, 1000);
                //}
                /*
                templateObject.getProductClassQtyData = function () {
                    productService.getOneProductClassQtyData(currentProductID).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let qtylineItems = [];
                        let qtylineItemObj = {};
                        let currencySymbol = Currency;
                        let totaldeptquantity = 0;

                        for (let j in data.tproductclassquantity) {
                            qtylineItemObj = {
                                department: data.tproductclassquantity[j].DepartmentName || "",
                                quantity: data.tproductclassquantity[j].InStockQty || 0,
                            }
                            totaldeptquantity += data.tproductclassquantity[j].InStockQty;
                            qtylineItems.push(qtylineItemObj);
                        }
                        // $('#edttotalqtyinstock').val(totaldeptquantity);
                        templateObject.productqtyrecords.set(qtylineItems);
                        templateObject.totaldeptquantity.set(totaldeptquantity);

                    }).catch(function (err) {

                        $('.fullScreenSpin').css('display', 'none');
                    });

                }
                */
                //templateObject.getProductClassQtyData();
                //templateObject.getProductData();
            } else {
                $('#productListModal').modal('toggle');
                setTimeout(function() {
                    $('#tblInventoryPayrollService_filter .form-control-sm').focus();
                    $('#tblInventoryPayrollService_filter .form-control-sm').val("");
                    $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");
                    const datatable = $('#tblInventoryPayrollService').DataTable();
                    datatable.draw();
                    $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");
                }, 500);
            }
        }
    });

    function setOneProductData(data) {
        $('.fullScreenSpin').css('display', 'none');
        let lineItems = [];
        let lineItemObj = {};
        let currencySymbol = Currency;
        let totalquantity = 0;
        let productname = data.fields.ProductName || "";
        let productcode = data.fields.PRODUCTCODE || "";
        let productprintName = data.fields.ProductPrintName || "";
        let assetaccount = data.fields.AssetAccount || "";
        let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost) || 0;
        let cogsaccount = data.fields.CogsAccount || "";
        let taxcodepurchase = data.fields.TaxCodePurchase || "";
        let purchasedescription = data.fields.PurchaseDescription || "";
        let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price) || 0;
        let incomeaccount = data.fields.IncomeAccount || "";
        let taxcodesales = data.fields.TaxCodeSales || "";
        let salesdescription = data.fields.SalesDescription || "";
        let active = data.fields.Active;
        let lockextrasell = data.fields.LockExtraSell || "";
        let customfield1 = data.fields.CUSTFLD1 || "";
        let customfield2 = data.fields.CUSTFLD2 || "";
        let barcode = data.fields.BARCODE || "";
        $("#selectProductID").val(data.fields.ID).trigger("change");
        $('#add-product-title').text('Edit Product');
        $('#edtproductname').val(productname);
        $('#edtsellqty1price').val(sellqty1price);
        $('#txasalesdescription').val(salesdescription);
        $('#sltsalesacount').val(incomeaccount);
        $('#slttaxcodesales').val(taxcodesales);
        $('#edtbarcode').val(barcode);
        $('#txapurchasedescription').val(purchasedescription);
        $('#sltcogsaccount').val(cogsaccount);
        $('#slttaxcodepurchase').val(taxcodepurchase);
        $('#edtbuyqty1cost').val(buyqty1cost);
        setTimeout(function() {
            $('#newProductModal').modal("show");
        }, 500);
    }

    $(document).on("click", "#tblEmployeelist tbody tr", function(e) {
        let employeeName = $(this).find(".colEmployeeName").text() || '';
        //let employeeID = $(this).find(".colID").text() || '';
        let employeeID = $(this).attr("id") || '';
        templateObject.empID.set(employeeID);
        let draggedEmployeeID = templateObject.empID.get();
        let calendarData = templateObject.employeeOptions.get();
        let calendarSet = templateObject.globalSettings.get();
        let employees = templateObject.employeerecords.get();
        let overridesettings = employees.filter((employeeData) => {
            return employeeData.id == parseInt(draggedEmployeeID);
        });

        let empData = calendarData.filter((calendarOpt) => {
            return calendarOpt.EmployeeID == parseInt(draggedEmployeeID);
        });

        document.getElementById("frmAppointment").reset();
        $(".paused").hide();
        $("#btnHold").prop("disabled", false);
        $("#btnStartAppointment").prop("disabled", false);
        $("#btnStopAppointment").prop("disabled", false);
        $("#startTime").prop("disabled", false);
        $("#endTime").prop("disabled", false);
        $("#tActualStartTime").prop("disabled", false);
        $("#tActualEndTime").prop("disabled", false);
        $("#txtActualHoursSpent").prop("disabled", false);

        if (localStorage.getItem("CloudAppointmentStartStopAccessLevel") == true) {
            //$("#btnHold").prop("disabled", true);
        }
        if (overridesettings[0]?.override == "false") {
            document.getElementById("product-list").value = calendarSet.defaultProduct || "";
            document.getElementById("product-list-1").value = calendarSet.defaultProduct || "";
        } else if (overridesettings[0]?.override == "true") {
            if (empData.length > 0) {
                document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                document.getElementById("product-list-1").value = empData[empData.length - 1].DefaultServiceProduct || "";
            } else {
                document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                document.getElementById("product-list-1").value = calendarSet.defaultProduct || "";
            }
        } else {
            if (templateObject.empDuration.get() != "") {
                var endTime = moment(startTime, "HH:mm").add(parseInt(templateObject.empDuration.get()), "hours").format("HH:mm");
                document.getElementById("endTime").value = endTime;
                let hoursFormattedStartTime = templateObject.timeFormat(templateObject.empDuration.get()) || "";
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
            } else {
                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5),"HH:mm").format("HH:mm");
                var endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                document.getElementById("endTime").value = endTime;
                var hoursSpent = moment(appointmentHours, "hours").format("HH");
                let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
            }

            if (empData.length > 0) {
                document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                document.getElementById("product-list-1").value = empData[empData.length - 1].DefaultServiceProduct || "";
                // $('#product-list').prepend('<option value=' + empData[0].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                // $("#product-list")[0].options[0].selected = true;
            } else {
                document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                document.getElementById("product-list-1").value = calendarSet.defaultProduct || "";
                // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                // $("#product-list")[0].options[0].selected = true;
            }
        }

        $('#employee_name').val(employeeName);
        $('#employeeListModal').modal('toggle');
        $("#btnCopyOptions").attr("disabled", true);
        $("#event-modal").modal();
        setTimeout(() => {
            if (localStorage.getItem("smsCustomerAppt") == "false") {
                $("#chkSMSCustomer").prop("checked", false);
            }
            if (localStorage.getItem("smsUserAppt") == "false") {
                $("#chkSMSUser").prop("checked", false);
            }
            if (localStorage.getItem("emailCustomerAppt") == "false") {
                $("#customerEmail").prop("checked", false);
            }
            if (localStorage.getItem("emailUserAppt") == "false") {
                $("#userEmail").prop("checked", false);
            }
        }, 100);
    });

    /* On clik Inventory Line */
    $(document).on("click", "#tblInventoryPayrollService tbody tr", function(e) {
        const tableProductService = $(this);
        let lineProductName = tableProductService.find(".productName").text() || "";
        let lineProductDesc = tableProductService.find(".productDesc").text() || "";
        let lineProdCost = tableProductService.find(".costPrice").text() || 0;
        $('#product-list').val(lineProductName);
        $('#productListModal').modal('toggle');
        $('#tblInventoryPayrollService_filter .form-control-sm').val("");

        setTimeout(function() {
            //$('#tblCustomerlist_filter .form-control-sm').focus();
            $('.btnRefreshProduct').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    const getHours = function(start, end) {
        let hour = 0;
        hour = parseInt(start.split(":")[0]) - parseInt(end.split(":")[0]);
        const min = parseInt(start.split(":")[1]) + parseInt(end.split(":")[1]);
        let checkmin = parseInt(start.split(":")[1]) - parseInt(end.split(":")[1]);
        if (parseInt(start.split(":")[1]) > parseInt(end.split(":")[1])) {
            checkmin = parseInt(start.split(":")[1]) - parseInt(end.split(":")[1]);
        } else if (parseInt(end.split(":")[1]) > parseInt(start.split(":")[1])) {
            checkmin = parseInt(end.split(":")[1]) - parseInt(start.split(":")[1])
        }
        if (checkmin == 0) {
            hour += 1;
        } else if (checkmin > 0) {
            hour += 1;
        } else if (min == 60) {
            hour += 1;
        }
        return hour
    };

    if (startAndStopAppointmentOnly == true) {
        //$("#btnHold").prop("disabled", true);
    }

    // BEGIN DATE CODE
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
    const currentDate = new Date();
    const begunDate = moment(currentDate).format("DD/MM/YYYY");
    $('.formClassDate').val(begunDate);

    $(document).on("dblclick", "#tblEmployeeSideList tbody tr", function() {
        const listData = this.id;
        if (listData) {
            FlowRouter.go('/employeescard?id=' + listData);
        }
    });

    $(document).on("mouseenter", "#tblEmployeeSideList tbody tr", function() {
        let calOptions = templateObject.globalSettings.get();
        let calendarSet = templateObject.globalSettings.get();
        let draggedEmployeeID = templateObject.empID.get();
        let employee = templateObject.employeerecords.get();
        let overridesettings = employee.filter(employeeData => {
            return employeeData.id == parseInt(this.id);
        });
        let empData = templateObject.employeeOptions.get().filter(emp => {
            return emp.EmployeeID == parseInt(this.id);
        });
        if (overridesettings[0].override == "" || overridesettings[0].override == "false") {
            templateObject.empDuration.set(calOptions.DefaultApptDuration);
        } else {
            if (empData[empData.length - 1].DefaultApptDuration == 120) {
                templateObject.empDuration.set(2);
            } else {
                templateObject.empDuration.set(empData[empData.length - 1].DefaultApptDuration || '1');
            }
        }
    });

    $(document).on("click", ".appointmentCustomer #tblCustomerlist tbody tr", function(e) {
        let checkIncludeAllProducts = templateObject.includeAllProducts.get();
        let getAllEmployeeData = templateObject.employeerecords.get() || "";
        let getEmployeeID = templateObject.empID.get() || "";
        document.getElementById("customer").value = $(this).find(".colCompany").text();
        document.getElementById("phone").value = $(this).find(".colPhone").text();
        document.getElementById("mobile").value = $(this).find(".colMobile").text().replace("+", "");
        document.getElementById("state").value = $(this).find(".colState").text();
        document.getElementById("country").value = $(this).find(".colCountry").text();
        document.getElementById("address").value = $(this).find(".colStreetAddress").text().replace(/(?:\r\n|\r|\n)/g, ', ');
        if (localStorage.getItem("CloudAppointmentNotes") == true) {
            document.getElementById("txtNotes").value = $(this).find(".colNotes").text();
        }
        document.getElementById("suburb").value = $(this).find(".colCity").text();
        document.getElementById("zip").value = $(this).find(".colZipCode").text();
        if ($("#updateID").val() == "") {
            getVS1Data("TAppointment").then(function(dataObject) {
                if(dataObject.length == 0){
                    let appointmentService = new AppointmentService();
                    appointmentService.getAllAppointmentListCount().then(function(data) {
                        if (data.tappointmentex.length > 0) {
                            let max = 1;
                            for (let i = 0; i < data.tappointmentex.length; i++) {
                                if (data.tappointmentex[i].Id > max) {
                                    max = data.tappointmentex[i].Id;
                                }
                            }
                            document.getElementById("appID").value = max + 1;
                        } else {
                            document.getElementById("appID").value = 1;
                        }
                    });
                }else{
                    let data = JSON.parse(dataObject[0].data);
                    if (data.tappointmentex.length > 0) {
                        let max = 1;
                        for (let i = 0; i < data.tappointmentex.length; i++) {
                            if (data.tappointmentex[i].Id > max) {
                                max = data.tappointmentex[i].Id;
                            }
                        }
                        document.getElementById("appID").value = max + 1;
                    } else {
                        document.getElementById("appID").value = 1;
                    }
                }
            })
            if (getEmployeeID != "") {
                const filterEmpData = getAllEmployeeData.filter(empdData => {
                    return empdData.id == getEmployeeID;
                });
                if (filterEmpData) {
                    if (filterEmpData[0].custFld8 == "false") {
                        templateObject.getAllSelectedProducts(getEmployeeID);
                    } else {
                        templateObject.getAllProductData();
                    }
                } else {
                    templateObject.getAllProductData();
                }
            }
            // if(checkIncludeAllProducts ==  true){
            // templateObject.getAllProductData();
            // }else{
            //   if(getEmployeeID != ""){
            //     templateObject.getAllSelectedProducts(getEmployeeID);
            //   }else{
            //     templateObject.getAllProductData();
            //   }
            //
            // }

            //templateObject.getAllProductData();
        }
        $("#customerListModal").modal("hide");
        $("#event-modal").modal();
    });

    $(document).on("click", ".btnoptionsmodal", function(e) {
        templateObject.getAllProductData();
        $('#settingsModal').modal('toggle');
    });

    let dragged;
    let draggedTd;
    let draggedTr;
    /* events fired on the draggable target */
    document.addEventListener("drag", function(event) {
        //event.dataTransfer.setData('text/plain', event.target.id);
    }, false);

    document.addEventListener("dragstart", function(event) {
        // store a ref. on the dragged elem
        dragged = event.target;
        event.target.style.opacity = .5;
    }, false);

    document.addEventListener("dragend", function(event) {
        // reset the transparency
        event.target.style.opacity = "";
    }, false);

    /* events fired on the drop targets */
    document.addEventListener("dragover", function(event) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function(event) {
        // highlight potential drop target when the draggable element enters it
        if (event.target.className.includes("droppable")) {
            event.target.style.background = "#99ccff";
        }
    }, false);

    document.addEventListener("dragleave", function(event) {
        // reset background of potential drop target when the draggable element leaves it
        if (event.target.className.includes("droppable")) {
            event.target.style.background = "";
        }
    }, false);

    document.addEventListener("drop", function(event) {
        let appointmentService = new AppointmentService();
        event.preventDefault();
        draggedTd = $(event.target).closest('td');
        draggedTr = $(event.target).closest('tr');
        let getTdClass = $(event.target).closest('td').attr('class').toLowerCase();
        let allocDate = "";
        //$('#allocationTable').find('th').eq(draggedTd.index()).attr("id");
        if (getTdClass.includes('sunday')) {
            allocDate = $('#allocationTable').find('th.sunday').attr("id");
        } else if (getTdClass.includes('monday')) {
            allocDate = $('#allocationTable').find('th.monday').attr("id");
        } else if (getTdClass.includes('tuesday')) {
            allocDate = $('#allocationTable').find('th.tuesday').attr("id");
        } else if (getTdClass.includes('wednesday')) {
            allocDate = $('#allocationTable').find('th.wednesday').attr("id");
        } else if (getTdClass.includes('thursday')) {
            allocDate = $('#allocationTable').find('th.thursday').attr("id");
        } else if (getTdClass.includes('friday')) {
            allocDate = $('#allocationTable').find('th.friday').attr("id");
        } else if (getTdClass.includes('saturday')) {
            allocDate = $('#allocationTable').find('th.saturday').attr("id");
        }
        if (event.target.className.includes("droppable")) {
            event.target.style.background = "";
            dragged.parentNode.removeChild(dragged);
            event.target.appendChild(dragged);
        }
        const id = dragged.id;
        let employeeName = draggedTr.attr("id");
        const appointmentData = templateObject.appointmentrecords.get();
        const updateData = appointmentData.filter(apmt => {
            return apmt.id == id;
        });
        let index = appointmentData.map(function(e) {
            return e.id;
        }).indexOf(parseInt(id));
        let calendarSet = templateObject.globalSettings.get();
        let hideDays = "";
        let slotMin = "06:00:00";
        let slotMax = "21:00:00";
        if (calendarSet.showSat == false) {
            hideDays = [6];
        }
        if (calendarSet.apptStartTime) {
            slotMin = calendarSet.apptStartTime;
        }
        if (calendarSet.apptEndTime) {
            slotMax = calendarSet.apptEndTimeCal;
        }
        if (calendarSet.showSun == false) {
            hideDays = [0];
        }
        if (calendarSet.showSat == false && calendarSet.showSun == false) {
            hideDays = [0, 6];
        }
        if (updateData.length > 0) {
            let objectData = {
                type: "TAppointmentEx",
                fields: {
                    Id: parseInt(id) || 0,
                    StartTime: allocDate + " " + updateData[0].startDate.split(" ")[1] || "",
                    EndTime: allocDate + " " + updateData[0].endDate.split(" ")[1] || "",
                    TrainerName: employeeName || "",
                }
            };
            templateObject.updateEvents(objectData,false,false)
            // appointmentService.saveAppointment(objectData).then(function(data) {
                let calendarSet = templateObject.calendarOptions.get();
                appointmentList[index].employeename = employeeName;
                let eventIndex = updateCalendarData.map(function(e) {
                    return e.id;
                }).indexOf(id);
                updateCalendarData[eventIndex].start = allocDate + " " + updateCalendarData[eventIndex].start.split(" ")[1];
                updateCalendarData[eventIndex].end = allocDate + " " + updateCalendarData[eventIndex].end.split(" ")[1];
                appointmentData[index].startDate = allocDate + " " + updateCalendarData[eventIndex].start.split(" ")[1];
                appointmentData[index].endDate = allocDate + " " + updateCalendarData[eventIndex].end.split(" ")[1];
                templateObject.appointmentrecords.get(appointmentData);
                const calendarEl = document.getElementById("calendar");
                const currentDate = new Date();
                const begunDate = moment(currentDate).format("YYYY-MM-DD");
                //if(eventData.length > 0){
                const calendar = new Calendar(calendarEl, {
                    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin],
                    themeSystem: "bootstrap",
                    initialView: "dayGridMonth",
                    hiddenDays: hideDays, // hide Sunday and Saturday
                    customButtons: {
                        newappointment: {
                            text: "New Appointment",
                            click: function() {
                                // FlowRouter.go("/appointmentlist");
                            },
                        },
                        appointments: {
                            text: "Appointment List",
                            click: function() {
                                //window.open("/appointmentlist", '_self');
                                FlowRouter.go("/appointmentlist");
                            }
                        },
                        allocation: {
                            text: "Allocations",
                            click: function() {
                                $("#allocationModal").modal('show');
                            },
                        },
                        ...refreshButton,
                        ...settingsModalButton,
                    },
                    headerToolbar: {
                        left: "prev,next today newappointment appointments allocation refresh",
                        center: "",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,settingsmodalbutton",
                    },
                    slotMinTime: slotMin,
                    slotMaxTime: slotMax,
                    initialDate: begunDate,
                    navLinks: true, // can click day/week names to navigate views
                    selectable: true,
                    selectMirror: true,
                    dayHeaderFormat: function(date) {
                        if (LoggedCountry == "United States") {
                            return moment(date.date.marker).format("ddd") + " " + moment(date.date.marker).format("MM/DD");
                        } else {
                            return moment(date.date.marker).format("ddd") + " " + moment(date.date.marker).format("DD/MM");
                        }
                    },
                    select: function(info) {
                        $("#frmAppointment")[0].reset();
                        $(".paused").hide();
                        templateObject.getAllProductData();
                        let dateStart = new Date(info.start);
                        let dateStartForEndTime = new Date(info.start);
                        let dateEnd = new Date(info.end);
                        let startDate = ("0" + dateStart.getDate()).toString().slice(-2) + "/" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "/" + dateStart.getFullYear();
                        let endDate = ("0" + dateEnd.getDate()).toString().slice(-2) + "/" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "/" + dateEnd.getFullYear();
                        dateStartForEndTime.setHours(dateStartForEndTime.getHours() + calendarSet.DefaultApptDuration || "02:00");
                        let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                        let endTime = ("0" + dateStartForEndTime.getHours()).toString().slice(-2) + ":" + ("0" + dateStartForEndTime.getMinutes()).toString().slice(-2);
                        document.getElementById("dtSODate").value = startDate;
                        document.getElementById("dtSODate2").value = endDate;
                        document.getElementById("startTime").value = startTime;
                        document.getElementById("endTime").value = endTime;
                        document.getElementById("employee_name").value = localStorage.getItem("mySessionEmployee");
                        if (calendarSet.DefaultApptDuration) {
                            let hoursFormattedStartTime = templateObject.timeFormat(calendarSet.DefaultApptDuration) || "";
                            document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime
                        } else {
                            let hours = templateObject.diff_hours(dateStart, dateStartForEndTime);
                            let hoursFormattedStartTime = templateObject.timeFormat(hours) || "";
                            document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                        }
                        templateObject.attachmentCount.set("");
                        templateObject.uploadedFiles.set("");
                        templateObject.uploadedFile.set("");
                        if (FlowRouter.current().queryParams.leadid) {
                            openAppointModalDirectly(FlowRouter.current().queryParams.leadid, templateObject);
                        } else if (FlowRouter.current().queryParams.customerid) {
                            openAppointModalDirectly(FlowRouter.current().queryParams.customerid, templateObject);
                        } else if (FlowRouter.current().queryParams.supplierid) {
                            openAppointModalDirectly(FlowRouter.current().queryParams.supplierid, templateObject);
                        } else {
                            $("#appointmentLeaveConfirmModal").modal("toggle");
                        }
                    },
                    eventClick: function(info) {
                       initAppointmentForm();
                        var hours = "0";
                        var id = info.event.id;
                        var appointmentData = appointmentList;

                        var result = appointmentData.filter(apmt => {
                            return apmt.id == id
                        });
                        if (result.length > 0) {
                            templateObject.getAllProductData();
                            if (result[0].aStartTime != "" && result[0].aEndTime != "") {
                                var startTime = moment(result[0].aStartDate + " " + result[0].aStartTime);
                                var endTime = moment(result[0].aEndDate + " " + result[0].aEndTime);
                                var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                                hours = duration.asHours();
                            }

                            let hoursFormatted = templateObject.timeFormat(hours) || "";
                            let hoursFormattedStartTime = templateObject.timeFormat(result[0].totalHours) || "";

                            if (result[0].isPaused == "Paused") {
                                $(".paused").show();
                                $("#btnHold").prop("disabled", true);
                            } else {
                                $(".paused").hide();
                                $("#btnHold").prop("disabled", false);
                            }

                            if (startAndStopAppointmentOnly == true) {
                                //$("#btnHold").prop("disabled", true);
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
                            document.getElementById("aStartDate").value = result[0].aStartDate || "";
                            document.getElementById("updateID").value = result[0].id || 0;
                            document.getElementById("appID").value = result[0].id;
                            document.getElementById("customer").value = result[0].accountname;
                            document.getElementById("phone").value = result[0].phone;
                            document.getElementById("mobile").value = result[0].mobile.replace("+", "") || result[0].phone.replace("+", "") || "";
                            document.getElementById("state").value = result[0].state;
                            document.getElementById("address").value = result[0].street;
                            if (localStorage.getItem("CloudAppointmentNotes") == true) {
                                document.getElementById("txtNotes").value = result[0].notes;
                            }
                            document.getElementById("suburb").value = result[0].suburb;
                            document.getElementById("zip").value = result[0].zip;
                            document.getElementById("country").value = result[0].country;
                            //$('#product-list').prepend('<option value="' + result[0].product + '">' + result[0].product + '</option>');
                            document.getElementById("product-list").value = result[0].product || "";
                            document.getElementById("employee_name").value = result[0].employeename;
                            document.getElementById("dtSODate").value = result[0].startDate.split(" ")[0];
                            document.getElementById("dtSODate2").value = result[0].endDate.split(" ")[0];
                            document.getElementById("startTime").value = result[0].startTime;
                            document.getElementById("endTime").value = result[0].endTime;
                            document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                            document.getElementById("tActualStartTime").value = result[0].aStartTime;
                            document.getElementById("tActualEndTime").value = result[0].aEndTime;
                            document.getElementById("txtActualHoursSpent").value = hoursFormatted || "";

                            if (!$("#smsConfirmedFlag i.fa-check-circle").hasClass("d-none")) $("#smsConfirmedFlag i.fa-check-circle").addClass("d-none");
                            if (!$("#smsConfirmedFlag i.fa-close").hasClass("d-none")) $("#smsConfirmedFlag i.fa-close").addClass("d-none");
                            if (!$("#smsConfirmedFlag i.fa-question").hasClass("d-none")) $("#smsConfirmedFlag i.fa-question").addClass("d-none");
                            if (!$("#smsConfirmedFlag i.fa-minus-circle").hasClass("d-none")) $("#smsConfirmedFlag i.fa-minus-circle").addClass("d-none");
                            if (result[0].custFld13 === "Yes") {
                                if (result[0].custFld11 === "Yes") {
                                    $("#smsConfirmedFlag i.fa-check-circle").removeClass("d-none");
                                } else {
                                    if (result[0].custFld11 === "No") {
                                        $("#smsConfirmedFlag i.fa-close").removeClass("d-none");
                                    } else {
                                        $("#smsConfirmedFlag i.fa-question").removeClass("d-none");
                                    }
                                }
                            } else {
                                $("#smsConfirmedFlag i.fa-minus-circle").removeClass("d-none");
                            }

                            templateObject.attachmentCount.set(0);
                            if (result[0].attachments) {
                                if (result.length) {
                                    templateObject.attachmentCount.set(result[0].attachments.length);
                                    templateObject.uploadedFiles.set(result[0].attachments);
                                }
                            }
                            $("#event-modal").modal();
                            // this.$body.addClass('modal-open');
                        }
                    },
                    editable: true,
                    droppable: true, // this allows things to be dropped onto the calendar
                    dayMaxEvents: true, // allow "more" link when too many events
                    //Triggers modal once event is moved to another date within the calendar.
                    eventDrop: function(info) {
                        const pattern = /leave/;
                        if (info.event._def.publicId != "" && !pattern.test(info.event._def.publicId)) {
                            let appointmentData = templateObject.appointmentrecords.get();
                            let resourceData = templateObject.resourceAllocation.get();
                            let eventDropID = info.event._def.publicId || "0";
                            let dateStart = new Date(info.event.start);
                            let dateEnd = new Date(info.event.end);
                            let startDate = dateStart.getFullYear() + "-" + ("0" + (dateStart.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateStart.getDate()).toString().slice(-2);
                            let endDate = dateEnd.getFullYear() + "-" + ("0" + (dateEnd.getMonth() + 1)).toString().slice(-2) + "-" + ("0" + dateEnd.getDate()).toString().slice(-2);
                            let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                            let index = appointmentData.map(function(e) {
                                return e.id;
                            }).indexOf(parseInt(eventDropID));
                            let resourceIndex = resourceData.map(function(e) {
                                return e.employeeName;
                            }).indexOf(appointmentData[index].employeename);
                            if (result.length > 0) {
                                let objectData = {
                                    type: "TAppointmentEx",
                                    fields: {
                                        Id: parseInt(eventDropID) || 0,
                                        StartTime: startDate + " " + startTime + ":00" || "",
                                        EndTime: endDate + " " + endTime + ":00" || "",
                                    }
                                };
                                let nameid = appointmentData[index].employeename.replace(" ", "-");
                                $("#allocationTable tbody tr").attr("id", $("#allocationTable tbody tr").attr("id").replace(" ", "-"));
                                let job = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + eventDropID + '" style="margin:4px 0px; background-color: ' + resourceData[resourceIndex].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                                    '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                                    '<p class="text-nowrap text-truncate" style="margin: 0px;">' + appointmentData[index].accountname + '</p>' + "" +
                                    '</div>' + "" +
                                    '</div>';
                                let day = moment(startDate).format("dddd").toLowerCase();
                                appointmentService.saveAppointment(objectData).then(function(data) {
                                    appointmentData[index].startDate = startDate + " " + startTime;
                                    appointmentData[index].endDate = endDate + " " + endTime;
                                    templateObject.appointmentrecords.set(appointmentData);

                                    $("#" + nameid + " ." + day + " .droppable").append(job);
                                    $("#" + eventDropID).remove();
                                    $("#allocationTable tbody tr").attr("id", $("#allocationTable tbody tr").attr("id").replace("-", " "));
                                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(dataUpdate) {
                                        addVS1Data("TAppointment", JSON.stringify(dataUpdate)).then(function(datareturn) {
                                            window.open("/appointments", '_self');
                                        }).catch(function(err) {});
                                    }).catch(function(err) {
                                        window.open("/appointments", '_self');
                                    });
                                }).catch(function(err) {
                                    window.open("/appointments", '_self');
                                });
                            }
                        }

                    },
                    //Triggers modal once external object is dropped to calender.
                    drop: function(event) {
                        let draggedEmployeeID = templateObject.empID.get();
                        let calendarData = templateObject.employeeOptions.get();
                        let calendarSet = templateObject.globalSettings.get();
                        let employees = templateObject.employeerecords.get();
                        let overridesettings = employees.filter(employeeData => {
                            return employeeData.id == parseInt(draggedEmployeeID)
                        });

                        let empData = calendarData.filter(calendarOpt => {
                            return calendarOpt.EmployeeID == parseInt(draggedEmployeeID)
                        });
                        document.getElementById("frmAppointment").reset();
                        $(".paused").hide();
                        $("#btnHold").prop("disabled", false);
                        $("#btnStartAppointment").prop("disabled", false);
                        $("#btnStopAppointment").prop("disabled", false);
                        $("#startTime").prop("disabled", false);
                        $("#endTime").prop("disabled", false);
                        $("#tActualStartTime").prop("disabled", false);
                        $("#tActualEndTime").prop("disabled", false);
                        $("#txtActualHoursSpent").prop("disabled", false);
                        if (startAndStopAppointmentOnly == true) {
                            //$("#btnHold").prop("disabled", true);
                        }
                        document.getElementById("employee_name").value = event.draggedEl.innerText.replace(/[0-9]/g, "");
                        var start = event.dateStr != "" ? moment(event.dateStr).format("DD/MM/YYYY") : event.dateStr;
                        document.getElementById("dtSODate").value = start;
                        document.getElementById("dtSODate2").value = start;
                        var startTime = moment(event.dateStr).format("HH:mm");
                        document.getElementById("startTime").value = startTime;
                        if (overridesettings[0].override == "false") {
                            if (calendarSet.DefaultApptDuration) {
                                var endTime = moment(startTime, "HH:mm").add(parseInt(calendarSet.DefaultApptDuration), "hours").format("HH:mm");
                                document.getElementById("endTime").value = endTime;
                                let hoursFormattedStartTime = templateObject.timeFormat(calendarSet.DefaultApptDuration) || "";
                                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                            } else {
                                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), "HH:mm").format("HH:mm");
                                var endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                                document.getElementById("endTime").value = endTime;
                                var hoursSpent = moment(appointmentHours, "hours").format('HH');
                                let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                            }
                            document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                            // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                            // $("#product-list")[0].options[0].selected = true;
                        } else if (overridesettings[0].override == "true") {
                            if (templateObject.empDuration.get() != "") {
                                var endTime = moment(startTime, "HH:mm").add(parseInt(templateObject.empDuration.get()), "hours").format("HH:mm");
                                document.getElementById("endTime").value = endTime;
                                let hoursFormattedStartTime = templateObject.timeFormat(templateObject.empDuration.get()) || "";
                                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                            } else {
                                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), "HH:mm").format("HH:mm");
                                var endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                                document.getElementById("endTime").value = endTime;
                                var hoursSpent = moment(appointmentHours, "hours").format('HH');
                                let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                            }
                            if (empData.length > 0) {
                                document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                                // $('#product-list').prepend('<option value=' + empData[empData.length - 1].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                                // $("#product-list")[0].options[0].selected = true;
                            } else {
                                document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                                // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                                // $("#product-list")[0].options[0].selected = true;
                            }
                        } else {
                            if (templateObject.empDuration.get() != "") {
                                var endTime = moment(startTime, "HH:mm").add(parseInt(templateObject.empDuration.get()), "hours").format("HH:mm");
                                document.getElementById("endTime").value = endTime;
                                let hoursFormattedStartTime = templateObject.timeFormat(templateObject.empDuration.get()) || "";
                                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                            } else {
                                var appointmentHours = moment(event.dateStr.substr(event.dateStr.length - 5), "HH:mm").format("HH:mm");
                                var endTime = moment(startTime, "HH:mm").add(appointmentHours.substr(0, 2), "hours").format("HH:mm");
                                document.getElementById("endTime").value = endTime;
                                var hoursSpent = moment(appointmentHours, "hours").format('HH');
                                let hoursFormattedStartTime = templateObject.timeFormat(hoursSpent.replace(/^0+/, "")) || "";
                                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                            }

                            if (empData.length > 0) {
                                document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                                // $('#product-list').prepend('<option value=' + empData[0].Id + ' selected>' + empData[empData.length - 1].DefaultServiceProduct + '</option>');
                                // $("#product-list")[0].options[0].selected = true;
                            } else {
                                document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                                // $('#product-list').prepend('<option value=' + calendarSet.id + ' selected>' + calendarSet.defaultProduct + '</option>');
                                // $("#product-list")[0].options[0].selected = true;
                            }

                        }

                        var endTime = moment(document.getElementById("dtSODate2").value + " " + document.getElementById("endTime").value).format('DD/MM/YYYY HH:mm');
                        var startTime = moment(document.getElementById("dtSODate2").value + " " + document.getElementById("startTime").value).format('DD/MM/YYYY HH:mm');
                        if (FlowRouter.current().queryParams.leadid) {
                            openAppointModalDirectly(FlowRouter.current().queryParams.leadid, templateObject);
                        } else if (FlowRouter.current().queryParams.customerid) {
                            openAppointModalDirectly(FlowRouter.current().queryParams.customerid, templateObject);
                        } else if (FlowRouter.current().queryParams.supplierid) {
                            openAppointModalDirectly(FlowRouter.current().queryParams.supplierid, templateObject);
                        } else {
                            $("#customerListModal").modal();
                        }
                    },
                    events: eventData,
                    eventDidMount: function(event) {},
                    eventContent: function(event) {
                        let title = document.createElement('p');
                        if (event.event.title) {
                            title.setAttribute("data-toggle", "tooltip");
                            title.setAttribute("title", event.timeText + " " + event.event.title);
                            title.innerHTML = event.timeText + " " + event.event.title;
                            title.style.backgroundColor = event.backgroundColor;
                            title.style.color = "#ffffff";
                            title.style.overflow = "hidden";
                            setTimeout(function() {
                                $('[data-toggle="tooltip"]').tooltip({ html: true });
                            }, 500);
                        } else {
                            title.innerHTML = event.timeText + " " + event.event.title;
                        }

                        let arrayOfDomNodes = [title];
                        return {
                            domNodes: arrayOfDomNodes
                        }
                    }

                });
                calendar.render();
                // sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                //     addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {});
                // }).catch(function(err) {});
            // }).catch(function(err) {
            //     $('.fullScreenSpin').css('display', 'none');
            // });
        } else {}
    }, false);

    $(document).on("click", "#check-all", function() {
        const checkbox = document.querySelector("#check-all");
        if (checkbox.checked) {
            $(".notevent").prop('checked', true);
        } else {
            $(".notevent").prop('checked', false);
        }
    });

    $(document).ready(function() {
        $("#showSaturday").change(function() {
            const checkbox = document.querySelector("#showSunday");
            const checkboxSaturday = document.querySelector("#showSaturday");
            let calendarSet2 = templateObject.globalSettings.get();
            let slotMin = "06:00:00";
            let slotMax = "21:00:00";
            if (calendarSet2.apptStartTime) {
                slotMin = calendarSet2.apptStartTime;
            }
            if (calendarSet2.apptEndTime) {
                slotMax = calendarSet2.apptEndTimeCal;
            }
            if (checkbox.checked && (checkboxSaturday.checked)) {
                let hideDays = "";
                setShowWeekendAllocationHeader()
                setTimeout(function() {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else if (checkbox.checked) {
                let hideDays = [6];
                $("#allocationTable .sunday").removeClass("hidesunday");
                $("#allocationTable .saturday").addClass("hidesaturday");
                setAllocationTableHeader(true)
                setTimeout(function() {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else if (checkboxSaturday.checked) {
                let hideDays = [0];
                $("#allocationTable .sunday").addClass("hidesunday");
                $("#allocationTable .saturday").removeClass("hidesaturday");
                setAllocationTableHeader(true)
                setTimeout(function() {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else {
                let hideDays = [0, 6];
                setNormalAllocationHeader();
                setTimeout(function() {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            }
        });
        $("#showSunday").change(function() {
            const checkbox = document.querySelector("#showSunday");
            const checkboxSaturday = document.querySelector("#showSaturday");
            let calendarSet2 = templateObject.globalSettings.get();
            let slotMin = "06:00:00";
            let slotMax = "21:00:00";

            if (calendarSet2.apptStartTime) {
                slotMin = calendarSet2.apptStartTime;
            }
            if (calendarSet2.apptEndTime) {
                slotMax = calendarSet2.apptEndTimeCal;
            }
            if (checkbox.checked && (checkboxSaturday.checked)) {
                let hideDays = "";
                setShowWeekendAllocationHeader()
                setTimeout(function() {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else if (checkbox.checked) {
                let hideDays = [6];
                $("#allocationTable .sunday").removeClass("hidesunday");
                $("#allocationTable .saturday").addClass("hidesaturday");
                setAllocationTableHeader(true)
                setTimeout(function() {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else if (checkboxSaturday.checked) {
                let hideDays = [0];
                $("#allocationTable .sunday").addClass("hidesunday");
                $("#allocationTable .saturday").removeClass("hidesaturday");
                setAllocationTableHeader(true)
                setTimeout(function() {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            } else {
                let hideDays = [0, 6];
                setNormalAllocationHeader();
                setTimeout(function() {
                    templateObject.renderCalendar(slotMin, slotMax, hideDays);
                }, 50);
            }
        });
    });

    // TODO: Get SMS settings here
    
    const smsSettings = {
        twilioAccountId: "",
        twilioAccountToken: "",
        twilioTelephoneNumber: "",
        twilioMessagingServiceSid: "MGc1d8e049d83e164a6f206fbe73ce0e2f",
        headerAppointmentSMSMessage: "Sent from [Company Name]",
        startAppointmentSMSMessage: "Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we are on site and doing the following service [Product/Service].",
        saveAppointmentSMSMessage: "Hi [Customer Name], This is [Employee Name] from [Company Name] confirming that we are booked in to be at [Full Address] at [Booked Time] to do the following service [Product/Service]. Please reply with Yes to confirm this booking or No if you wish to cancel it.",
        stopAppointmentSMSMessage: "Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we have finished doing the following service [Product/Service]."
    };
    function setSMSSettings(data){
        for (let i = 0; i < data.length; i++) {
            if(data[i].Fieldvalue && data[i].Fieldvalue !== ""){
                switch (data[i].PrefName) {
                    case "VS1SMSID":
                        smsSettings.twilioAccountId = data[i].Fieldvalue;
                        break;
                    case "VS1SMSToken":
                        smsSettings.twilioAccountToken = data[i].Fieldvalue;
                        break;
                    case "VS1SMSPhone":
                        smsSettings.twilioTelephoneNumber = data[i].Fieldvalue;
                        break;
                    case "VS1HEADERSMSMSG":
                        smsSettings.headerAppointmentSMSMessage = data[i].Fieldvalue;
                        break;
                    case "VS1SAVESMSMSG":
                        smsSettings.saveAppointmentSMSMessage = data[i].Fieldvalue;
                        break;
                    case "VS1STARTSMSMSG":
                        smsSettings.startAppointmentSMSMessage = data[i].Fieldvalue;
                        break;
                    case "VS1STOPSMSMSG":
                        smsSettings.stopAppointmentSMSMessage = data[i].Fieldvalue;
                }
            }
        }
        templateObject.defaultSMSSettings.set(smsSettings);
    }

    getVS1Data("TERPPreference").then(function(dataObject) {
        if(dataObject.length == 0){
            smsService.getSMSSettings().then((result) => {
                if (result.terppreference.length > 0) {
                    setSMSSettings(result.terppreference)
                }
            }).catch((error) => {});
        }else{
            let data = JSON.parse(dataObject[0].data);
            if (data.terppreference.length > 0) {
                setSMSSettings(data.terppreference)
            }
        }
    })

    templateObject.sendSMSMessage = async function(type, phoneNumber) {
            return new Promise(async(resolve, reject) => {
                const smsSettings = templateObject.defaultSMSSettings.get();
                const companyName = localStorage.getItem('vs1companyName');
                const message = smsSettings.headerAppointmentSMSMessage.replace('[Company Name]', companyName) + " - " + $(`#${type}AppointmentSMSMessage`).val();
                const sendSMSResult = await new Promise((res, rej) => {
                    Meteor.call('sendSMS', smsSettings.twilioAccountId, smsSettings.twilioAccountToken, smsSettings.twilioTelephoneNumber, phoneNumber, message, function(error, result) {
                        if (error) rej(error);
                        res(result);
                    })
                });
                resolve(sendSMSResult);
                // var endpoint = 'https://api.twilio.com/2010-04-01/Accounts/' + smsSettings.twilioAccountId + '/SMS/Messages.json';
                // const message = $(`#${type}AppointmentSMSMessage`).val();
                // var data = {
                //     Body: message,
                //     MessagingServiceSid: smsSettings.twilioMessagingServiceSid,
                //     To: phoneNumber,
                //     From: smsSettings.twilioTelephoneNumber,
                // };
                // $.ajax(
                //     {
                //         method: 'POST',
                //         url: endpoint,
                //         data: data,
                //         dataType: 'json',
                //         contentType: 'application/x-www-form-urlencoded', // !
                //         beforeSend: function(xhr) {
                //             xhr.setRequestHeader("Authorization",
                //                 "Basic " + btoa(smsSettings.twilioAccountId + ":" + smsSettings.twilioAccountToken)
                //             );
                //         },
                //         success: function(data) {
                //             resolve({ success: true, sid: data.sid });
                //         },
                //         error: function(error) {
                //             resolve({ success: false, message: error.responseJSON.message });
                //         }
                //     }
                // );
            })
        }
        //TODO: Check SMS Settings and confirm if continue or go to SMS settings page
    const accessLevel = localStorage.getItem('CloudApptSMS');
    if (!accessLevel) {
        $('#chkSMSCustomer').prop('checked', false);
        $('#chkSMSUser').prop('checked', false);
        $('.chkSMSCustomer-container').addClass("d-none");
        $('.chkSMSCustomer-container').removeClass('d-xl-flex');
        $('.chkSMSUser-container').addClass("d-none");
        $('.chkSMSUser-container').removeClass('d-xl-flex');

        $('.btnStartIgnoreSMS').addClass("d-none");
        $('.btnSaveIgnoreSMS').addClass("d-none");
        $('.btnStopIgnoreSMS').addClass("d-none");
    }
    templateObject.checkSMSSettings = function() {
        const accessLevel = localStorage.getItem('CloudApptSMS');
        if (!accessLevel) {
            $('#chkSMSCustomer').prop('checked', false);
            $('#chkSMSUser').prop('checked', false);
            $('.chkSMSCustomer-container').addClass("d-none");
            $('.chkSMSCustomer-container').removeClass('d-xl-flex');
            $('.chkSMSUser-container').addClass("d-none");
            $('.chkSMSUser-container').removeClass('d-xl-flex');
        } else {
            const smsSettings = templateObject.defaultSMSSettings.get();
            const chkSMSCustomer = $('#chkSMSCustomer').prop('checked');
            const chkSMSUser = $('#chkSMSUser').prop('checked');
            if ((!smsSettings || smsSettings.twilioAccountId === "" ||
                    smsSettings.twilioAccountToken === "" ||
                    smsSettings.twilioTelephoneNumber === "") &&
                (chkSMSCustomer || chkSMSUser)) {
                swal({
                    title: 'No SMS Settings',
                    text: "Do you wish to setup SMS Confirmation?",
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Continue',
                    cancelButtonText: 'Go to SMS Settings'
                }).then((result) => {
                    if (result.value) {
                        $('#chkSMSCustomer').prop('checked', false);
                        $('#chkSMSUser').prop('checked', false);
                    } else if (result.dismiss === 'cancel') {
                        window.open('/smssettings', '_self');
                    } else {
                        window.open('/smssettings', '_self');
                    }
                });
            }
        }
    }
    setTimeout(() => {
        if ($('.fc-toolbar-chunk') && $('.fc-toolbar-chunk').length) {
            $('.fc-toolbar-chunk')[$('.fc-toolbar-chunk').length - 1].hidden = true;
        }
    }, 500);
    //templateObject.checkSMSSettings();
    $(document).ready(function() {
        $("#chkmyAppointments").attr('checked',true);
      });
    $(document).on("change", "#chkmyAppointments", function(e) {
        if (JSON.parse(seeOwnAppointments) == true) {
            seeOwnAppointments = false;
            Session.setPersistent('CloudAppointmentSeeOwnAppointmentsOnly__', false);
        } else {
            seeOwnAppointments = true;
            Session.setPersistent('CloudAppointmentSeeOwnAppointmentsOnly__', true);
        }
        allEmployees = [];
        eventData = [];
        appointmentList = [];
        templateObject.eventdata.set([])
        templateObject.getEmployeesList();
        setTimeout(() => {
            templateObject.getAllAppointmentListData();
        }, 500);
    });
    $(document).on("click", "#tblInventory tbody tr", async function() {
        $(".colProductName").removeClass("boldtablealertsborder");
        let selectLineID = $("#selectLineID").val();
        let taxcodeList = await templateObject.taxraterecords.get();
        var table = $(this);

        let lineTaxRate = "";

        if (selectLineID) {
            let lineProductId = table.find(".colProuctPOPID").text();
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();
            let lineUnitPrice = table.find(".salePrice").text();

            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == lineTaxRate) {
                        $("#" + selectLineID + " .lineTaxRate").text(
                            taxcodeList[i].coderate
                        );
                    }
                }
            }

            $("#" + selectLineID + " .lineProductName").val(lineProductName);
            // $('#' + selectLineID + " .lineProductName").attr("prodid", table.find(".colProuctPOPID").text());
            $("#" + selectLineID + " .lineProductDesc").text(lineProductDesc);
            // $("#" + selectLineID + " .lineOrdered").val(1);
            // $("#" + selectLineID + " .lineQty").val(1);
            $("#" + selectLineID + " .lineSalesPrice").text(lineUnitPrice);
            $("#" + selectLineID).attr("id", lineProductId);

            $("#productCheck-" + selectLineID).prop("checked", false);
            $("#productCheck-" + lineProductId).prop("checked", true);
            $(".addExtraProduct").removeClass("btn-primary").addClass("btn-success");

            $("#productListModal2").modal("toggle");
        }

        $("#tblInventory_filter .form-control-sm").val("");
        setTimeout(function() {
            //$('#tblCustomerlist_filter .form-control-sm').focus();
            $("#btnselProductFees").trigger("click");
            $(".fullScreenSpin").css("display", "none");
        }, 100);
    });
});

Template.calender.events({
    //  'click .holdPause': function (event) {
    //      swal({
    //                     title: 'Appointment Paused',
    //                     text: "Do you want to Continue the Appointment?",
    //                     type: 'question',
    //                     showCancelButton: true,
    //                     confirmButtonText: 'Continue Appointment'
    //                 }).then((result) => {
    //                     if (result.value) {
    //                         // let date1 = document.getElementById("dtSODate").value;
    //                         // let date2 = document.getElementById("dtSODate2").value;
    //                         // date1 = templateObject.dateFormat(date1);
    //                         // date2 = templateObject.dateFormat(date2);
    //                         // var endTime = new Date(date2 + " " + document.getElementById("tActualEndTime").value + ':00');
    //                         // var startTime = new Date(date1 + " " + document.getElementById("tActualStartTime").value + ':00');
    //                         // document.getElementById('txtActualHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
    //                         $("#btnStartAppointment").trigger("click");
    //                         //let id = document.getElementById("updateID");
    //                     } else if (result.dismiss === 'cancel') {
    //                         document.getElementById('tActualEndTime').value = "";
    //                         document.getElementById('txtActualHoursSpent').value = "0";
    //                     } else {
    //                         document.getElementById('tActualEndTime').value = "";
    //                         document.getElementById('txtActualHoursSpent').value = "0";
    //                     }
    //                 });

    // },
    'click #googleLink': function() {
        let street = $('#address').val() || "";
        let state = $('#state').val() || "";
        let country = $('#country').val() || "";
        let zip = $('#zip').val() || "";
        let googleLink = "https://maps.google.com/?q=" + street + "," + state + "," + country + ',' + zip;
        $("#googleLink").attr("href", googleLink).attr('target', '_blank');
    },
    'click #deleteAll': function() {
        var erpGet = erpDb();
        swal({
            title: 'Delete Appointment',
            text: "Are you sure you want to Delete this Appointment & the following Appointments??",
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                if ($("#updateID").val() != "") {
                    $('.fullScreenSpin').css('display', 'block');
                    let id = $("#updateID").val();
                    let data = {
                        Name: "VS1_DeleteAllAppts",
                        Params: {
                            AppointID: parseInt(id)
                        }
                    }
                    var myString = '"JsonIn"' + ":" + JSON.stringify(data);
                    var oPost = new XMLHttpRequest();
                    oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ":" + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_DeleteAllAppts"', true);
                    oPost.setRequestHeader("database", erpGet.ERPDatabase);
                    oPost.setRequestHeader("username", erpGet.ERPUsername);
                    oPost.setRequestHeader("password", erpGet.ERPPassword);
                    oPost.setRequestHeader("Accept", "application/json");
                    oPost.setRequestHeader("Accept", "application/html");
                    oPost.setRequestHeader("Content-type", "application/json");
                    // let objDataSave = '"JsonIn"' + ":" + JSON.stringify(selectClient);
                    oPost.send(myString);
                    oPost.onreadystatechange = function() {
                        if (oPost.readyState == 4 && oPost.status == 200) {
                            var myArrResponse = JSON.parse(oPost.responseText);
                            if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                                sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                    addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                        window.open("/appointments", '_self');
                                    }).catch(function(err) {
                                        window.open("/appointments", '_self');
                                    });
                                }).catch(function(err) {
                                    window.open("/appointments", '_self');
                                });
                            } else {
                                $('.modal-backdrop').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'Oops...',
                                    text: myArrResponse.ProcessLog.ResponseStatus,
                                    type: 'warning',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {} else if (result.dismiss === 'cancel') {}
                                });
                            }
                        } else if (oPost.readyState == 4 && oPost.status == 403) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {} else if (result.dismiss === 'cancel') {}
                            });
                        } else if (oPost.readyState == 4 && oPost.status == 406) {
                            $('.fullScreenSpin').css('display', 'none');
                            var ErrorResponse = oPost.getResponseHeader('errormessage');
                            var segError = ErrorResponse.split(":");

                            if ((segError[1]) == ' "Unable to lock object') {
                                swal({
                                    title: 'Oops...',
                                    text: oPost.getResponseHeader('errormessage'),
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {} else if (result.dismiss === 'cancel') {}
                                });
                            } else {
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'Oops...',
                                    text: oPost.getResponseHeader('errormessage'),
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {} else if (result.dismiss === 'cancel') {}
                                });
                            }

                        } else if (oPost.readyState == "") {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {} else if (result.dismiss === 'cancel') {}
                            });
                        }
                    }
                } else {
                    swal({
                        title: 'Oops...',
                        text: "Appointment Does Not Exist",
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {} else if (result.dismiss === 'cancel') {}
                    });
                }
            }
        })
    },
    'click .droppable': function(event) {
        let templateObject = Template.instance();
        let calOptions = templateObject.globalSettings.get();
        let calendarSet = templateObject.globalSettings.get();
        let getAllEmployeeData = templateObject.employeerecords.get() || "";
        $("#frmAppointment")[0].reset();
        let element = $(event.target);
        if (element.is("p") || element.is(".card-body")) {
            var id = parseInt($(event.target).closest('.card').attr("id"));
            var appointmentData = templateObject.appointmentrecords.get();
            var result = appointmentData.filter(apmt => {
                return apmt.id == id
            });
            let hours = 0;
            if (result.length > 0) {
                if (result[0].aStartTime != "" && result[0].aEndTime != "") {
                    var startTime = moment(result[0].startDate.split(" ")[0] + " " + result[0].aStartTime);
                    var endTime = moment(result[0].endDate.split(" ")[0] + " " + result[0].aEndTime);
                    var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                    hours = duration.asHours();
                }

                let hoursFormatted = templateObject.timeFormat(hours) || "";
                let hoursFormattedStartTime = templateObject.timeFormat(result[0].totalHours) || "";
                if (result[0].isPaused == "Paused") {
                    $(".paused").show();
                    $("#btnHold").prop("disabled", true);
                } else {
                    $(".paused").hide();
                    $("#btnHold").prop("disabled", false);
                }

                if (startAndStopAppointmentOnly == true) {
                    //$("#btnHold").prop("disabled", true);
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

                // $(".paused").hide();
                // $("#btnHold").prop("disabled", false);
                // $("#btnStartAppointment").prop("disabled", false)
                // $("#btnStopAppointment").prop("disabled", false);
                // $("#startTime").prop("disabled", false);
                // $("#endTime").prop("disabled", false);
                // $("#tActualStartTime").prop("disabled", false);
                // $("#tActualEndTime").prop("disabled", false);
                // $("#txtActualHoursSpent").prop("disabled", false);

                var resultEmpData = getAllEmployeeData.filter(empDataObj => {
                    return empDataObj.employeeName == result[0].employeename
                });
                if (resultEmpData) {
                    if (resultEmpData[0].custFld8 == "false") {
                        templateObject.getAllSelectedProducts(resultEmpData[0].id);
                    } else {
                        templateObject.getAllProductData();
                    }
                } else {
                    templateObject.getAllProductData();
                }
                document.getElementById("aStartDate").value = result[0].aStartDate || "";
                document.getElementById("updateID").value = result[0].id || 0;
                document.getElementById("appID").value = result[0].id;
                document.getElementById("customer").value = result[0].accountname;
                document.getElementById("phone").value = result[0].phone;
                document.getElementById("mobile").value = result[0].mobile.replace("+", "") || result[0].phone.replace("+", "") || "";
                document.getElementById("state").value = result[0].state || ""
                document.getElementById("address").value = result[0].street || ""
                if (localStorage.getItem("CloudAppointmentNotes") == true) {
                    document.getElementById("txtNotes").value = result[0].notes;
                }
                document.getElementById("suburb").value = result[0].suburb || "";
                document.getElementById("zip").value = result[0].zip || "";
                document.getElementById("country").value = result[0].country || "";


                document.getElementById("product-list").value = result[0].product || "";
                document.getElementById("employee_name").value = result[0].employeename;
                document.getElementById("dtSODate").value = moment(result[0].startDate.split(" ")[0]).format("DD/MM/YYYY");
                document.getElementById("dtSODate2").value = moment(result[0].endDate.split(" ")[0]).format("DD/MM/YYYY");
                document.getElementById("startTime").value = result[0].startTime;
                document.getElementById("endTime").value = result[0].endTime;
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                document.getElementById("tActualStartTime").value = result[0].aStartTime;
                document.getElementById("tActualEndTime").value = result[0].aEndTime;
                document.getElementById("txtActualHoursSpent").value = hoursFormatted || "";
                templateObject.attachmentCount.set(0);
                if (result[0].attachments) {
                    if (result.length) {
                        templateObject.attachmentCount.set(result[0].attachments.length);
                        templateObject.uploadedFiles.set(result[0].attachments);
                    }
                } else {
                    templateObject.attachmentCount.set("");
                    templateObject.uploadedFiles.set("");
                    templateObject.uploadedFile.set("")
                }

                if (!$("#smsConfirmedFlag i.fa-check-circle").hasClass("d-none")) $("#smsConfirmedFlag i.fa-check-circle").addClass("d-none");
                if (!$("#smsConfirmedFlag i.fa-close").hasClass("d-none")) $("#smsConfirmedFlag i.fa-close").addClass("d-none");
                if (!$("#smsConfirmedFlag i.fa-question").hasClass("d-none")) $("#smsConfirmedFlag i.fa-question").addClass("d-none");
                if (!$("#smsConfirmedFlag i.fa-minus-circle").hasClass("d-none")) $("#smsConfirmedFlag i.fa-minus-circle").addClass("d-none");
                if (result[0].custFld13 === "Yes") {
                    if (result[0].custFld11 === "Yes") {
                        $("#smsConfirmedFlag i.fa-check-circle").removeClass("d-none");
                    } else {
                        if (result[0].custFld11 === "No") {
                            $("#smsConfirmedFlag i.fa-close").removeClass("d-none");
                        } else {
                            $("#smsConfirmedFlag i.fa-question").removeClass("d-none");
                        }
                    }
                } else {
                    $("#smsConfirmedFlag i.fa-minus-circle").removeClass("d-none");
                }

                $("#event-modal").modal();
            }
        } else {
            let bookingDate = new Date();
            let startTime = ("0" + bookingDate.getHours()).slice(-2) + ":" + ("0" + bookingDate.getMinutes()).slice(-2);
            let defaultDuration = parseInt(calOptions.DefaultApptDuration) || 2;
            bookingDate.setHours(bookingDate.getHours() + defaultDuration);
            let endTime = ("0" + bookingDate.getHours()).slice(-2) + ":" + ("0" + bookingDate.getMinutes()).slice(-2);
            let name = $(event.target).closest('tr').attr("id");
            var date = $(event.target).closest('#allocationTable').find('th').eq($(event.target).closest('td').index()).attr("id");
            $("#dtSODate").val(moment(date).format("DD/MM/YYYY"));
            $("#dtSODate2").val(moment(date).format("DD/MM/YYYY"));
            let hoursFormatted = templateObject.timeFormat(defaultDuration) || "";
            $("#txtBookedHoursSpent").val(hoursFormatted);
            $("#startTime").val(startTime);
            $("#endTime").val(endTime);
            $("#employee_name").val(name);

            var resultEmpData = getAllEmployeeData.filter(empDataObj => {
                return empDataObj.employeeName == name
            });
            if (resultEmpData) {
                if (resultEmpData[0].custFld8 == "false") {
                    templateObject.getAllSelectedProducts(resultEmpData[0].id);
                } else {
                    templateObject.getAllProductData();
                }
            } else {
                templateObject.getAllProductData();
            }

            let empData = templateObject.employeeOptions.get().filter(emp => {
                return emp.EmployeeID == parseInt(resultEmpData[0].id);
            });

            if (resultEmpData[0].override == "false") {
                document.getElementById("product-list").value = calendarSet.defaultProduct || "";
            } else if (resultEmpData[0].override == "true") {
                let hoursFormattedStartTime;
                if (empData[empData.length - 1].DefaultApptDuration == 120) {
                    hoursFormattedStartTime = templateObject.timeFormat('2') || '2';
                } else {
                    //templateObject.empDuration.set(empData[empData.length - 1].DefaultApptDuration || '1');
                    hoursFormattedStartTime = templateObject.timeFormat(empData[empData.length - 1].DefaultApptDuration) || '1';
                }
                document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                endTime = moment(startTime, "HH:mm").add(parseInt(hoursFormattedStartTime), "hours").format("HH:mm");
                document.getElementById("endTime").value = endTime;
                if (empData.length > 0) {
                    document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                } else {
                    document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                }
            } else {
                if (calOptions.DefaultApptDuration) {
                    let hoursFormattedStartTime = templateObject.timeFormat(calOptions.DefaultApptDuration) || "";
                    document.getElementById("txtBookedHoursSpent").value = hoursFormattedStartTime;
                }
                if (empData.length > 0) {
                    document.getElementById("product-list").value = empData[empData.length - 1].DefaultServiceProduct || "";
                } else {
                    document.getElementById("product-list").value = calendarSet.defaultProduct || "";
                }
            }

            //document.getElementById("product-list").value = calOptions.defaultProduct || "";
            $(".paused").hide();
            $("#btnHold").prop("disabled", false);
            $("#btnStartAppointment").prop("disabled", false);
            $("#btnStopAppointment").prop("disabled", false);
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            $("#tActualStartTime").prop("disabled", false);
            $("#tActualEndTime").prop("disabled", false);
            $("#txtActualHoursSpent").prop("disabled", false);
            if (FlowRouter.current().queryParams.leadid) {
                openAppointModalDirectly(FlowRouter.current().queryParams.leadid, templateObject, 'lead');
            } else if (FlowRouter.current().queryParams.customerid) {
                openAppointModalDirectly(FlowRouter.current().queryParams.customerid, templateObject, 'customer');
            } else if (FlowRouter.current().queryParams.supplierid) {
                openAppointModalDirectly(FlowRouter.current().queryParams.supplierid, templateObject, 'supplier');
            } else {
                $("#customerListModal").modal();
            }
        }

    },
    'click .img_new_attachment_btn': function(event) {
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function(e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get() || [];
        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .file-name': function(event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();
        $('#myModalAttachment').modal("hide");
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        } else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        } else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        } else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        } else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        } else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal("show");

        return;
    },
    'click .closeModal': function(event) {
        $('#myModalAttachment').modal("hide");
    },
    'click .closeView': function(event) {
        $('#files_view').modal("hide");
    },
    'click .calendar .days li': function(event) {
        FlowRouter.go('/newappointments');
    },
    'change #frequency': function() {
        let templateObject = Template.instance();
        let period = $('#period').val();
        let frequency = parseInt($('#frequency').val());

        var date = new Date();
        // $('#occurrences').val(frequency);
        if (!isNaN(frequency)) {
            if (period.toLowerCase() == "days") {
                let dayObj = {
                    saturday: 0,
                    sunday: 0,
                    monday: 0,
                    tuesday: 0,
                    wednesday: 0,
                    thursday: 0,
                    friday: 0
                };
                templateObject.repeatDays.set(dayObj)
                $('.radioLabel').removeClass("day-active");
                $('.radioLabel').addClass("normal-day");
                $('.select-size').hide();
                $('.repeatOn').hide();
                date.setDate(date.getDate() + frequency);
                let newDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            } else if (period.toLowerCase() == "weeks") {
                $('.select-size').show();
                $('.repeatOn').show();
                let days = frequency * 7;
                date.setDate(date.getDate() + days);
                let newDate = ("0" + (date.getDate())).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            } else if (period.toLowerCase() == "months") {
                $('.select-size').show();
                $('.repeatOn').show();
                date.setDate(date.getMonth() + frequency);
                let newDate = ("0" + (date.getDate() + frequency)).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            }
        }
    },
    'change #period': function() {
        let templateObject = Template.instance();
        let period = $('#period').val();
        let frequency = parseInt($('#frequency').val());
        var date = new Date();
        if (!isNaN(frequency)) {
            if (period.toLowerCase() == "days") {
                $('#occurrences').val(frequency);
                let dayObj = {
                    saturday: 0,
                    sunday: 0,
                    monday: 0,
                    tuesday: 0,
                    wednesday: 0,
                    thursday: 0,
                    friday: 0
                };
                templateObject.repeatDays.set(dayObj)
                $('.radioLabel').removeClass("day-active");
                $('.radioLabel').addClass("normal-day");
                $('.select-size').hide();
                $('.repeatOn').hide();
                let newDate = ("0" + (date.getDate() + frequency)).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            } else if (period.toLowerCase() == "weeks") {
                $('.select-size').show();
                $('.repeatOn').show();
                let days = frequency * 7;
                date.setDate(date.getDate() + days);
                let newDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            } else if (period.toLowerCase() == "months") {
                $('.select-size').show();
                $('.repeatOn').show();
                let newDate = ("0" + (date.getDate() + frequency)).slice(-2) + "/" + ("0" + (date.getMonth() + (1 + frequency))).slice(-2) + "/" + date.getFullYear();
                $('#finalDate').val(newDate);
            }
        }
    },
    'click #btn_Attachment': function() {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        } else {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
            $(".attchment-tooltip").show();
        }
    },
    'click .new_attachment_btn': function(event) {
        $('#attachment-upload').trigger('click');
    },
    'change #attachment-upload': function(e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get() || [];
        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function(event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if (tempObj.$("#confirm-action-" + attachmentID).length) {
            tempObj.$("#confirm-action-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">' +
                'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();
    },
    'click .confirm-delete-attachment': function(event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val("");
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'change #formCheck-on': function() {
        if ($('#formCheck-on').is(":checked")) {
            $("#formCheck-after").prop("checked", false);
        }
    },
    'change #formCheck-after': function() {
        if ($('#formCheck-after').is(":checked")) {
            $("#formCheck-on").prop("checked", false);
        }
    },
    'click #copyappointment': function(event) {
        let date = new Date();
        $("#startDate").val(("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear());
        $("#endDate").val(("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear())
        $('#frmNewDate').modal();
        $('#frmOptions').modal("hide");
    },
    'click .radioLabel': function(event) {
        let templateObject = Template.instance();
        let daysObj = templateObject.repeatDays.get();
        let id = $(event.target).attr('for');
        let check = $(event.target).hasClass("day-active");
        if (check == true) {
            $(event.target).removeClass("day-active");
            $(event.target).addClass("normal-day");
            if (id == 'monday') {
                daysObj.monday = 0;
            } else if (id == 'tuesday') {
                daysObj.tuesday = 0;
            } else if (id == 'wednesday') {
                daysObj.wednesday = 0;
            } else if (id == 'thursday') {
                daysObj.thursday = 0;
            } else if (id == 'friday') {
                daysObj.friday = 0;
            } else if (id == 'saturday') {
                daysObj.saturday = 0;
            } else if (id == 'sunday') {
                daysObj.sunday = 0;
            }
            templateObject.repeatDays.set(daysObj);

        } else {
            $(event.target).removeClass("normal-day");
            $(event.target).addClass("day-active");
            if (id == 'monday') {
                daysObj.monday = 1;
            } else if (id == 'tuesday') {
                daysObj.tuesday = 1;
            } else if (id == 'wednesday') {
                daysObj.wednesday = 1;
            } else if (id == 'thursday') {
                daysObj.thursday = 1;
            } else if (id == 'friday') {
                daysObj.friday = 1;
            } else if (id == 'saturday') {
                daysObj.saturday = 1;
            } else if (id == 'sunday') {
                daysObj.sunday = 1;
            }
            templateObject.repeatDays.set(daysObj);
        }
    },
    'click #btnSaveRepeat': function() {
        playSaveAudio();
        let templateObject = Template.instance();
        let repeatDays = templateObject.repeatDays.get();
        let appointmentService = new AppointmentService();
        setTimeout(function() {
            $('.fullScreenSpin').css('display', 'inline-block');
            let days = [];
            let week_day = "";
            let frequency = parseInt($('#frequency').val()) || 1;
            let period = $('#period').val();
            if (period.toLowerCase() == "days") {
                period = 0;
            } else if (period.toLowerCase() == "weeks") {
                period = 1;
            } else if (period.toLowerCase() == "months") {
                period = 2;
            }

            if (repeatDays.sunday == 1) {
                days.push(0);
            }

            if (repeatDays.monday == 1) {
                days.push(1);
            }

            if (repeatDays.tuesday == 1) {
                days.push(2);
            }

            if (repeatDays.wednesday == 1) {
                days.push(3);
            }

            if (repeatDays.thursday == 1) {
                days.push(4);
            }

            if (repeatDays.friday == 1) {
                days.push(5);
            }

            if (repeatDays.saturday == 1) {
                days.push(6);
            }

            // if(days.length > 1){
            //     week_day = days;
            // } else if(days.length == 1){
            //     week_day = parseInt(days[0].toString());
            // } else{
            //         week_day = 0;
            // }
            let id = $('#updateID').val() || 0;
            var endDateGet = new Date($("#finalDate").datepicker("getDate"));
            var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
            let startDate = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
            let endDate = endDateGet.getFullYear() + "-" + ("0" + (endDateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + endDateGet.getDate()).slice(-2);
            var erpGet = erpDb();
            if (days.length > 0) {
                for (let x = 0; x < days.length; x++) {
                    let dayObj = {
                        Name: "VS1_RepeatAppointment",
                        Params: {
                            CloudUserName: erpGet.ERPUsername,
                            CloudPassword: erpGet.ERPPassword,
                            AppointID: parseInt(id),
                            Repeat_Frequency: frequency,
                            Repeat_Period: period,
                            Repeat_BaseDate: startDate,
                            Repeat_finalDateDate: endDate,
                            Repeat_Saturday: repeatDays.saturday,
                            Repeat_sunday: repeatDays.sunday,
                            Repeat_Monday: repeatDays.monday,
                            Repeat_Tuesday: repeatDays.tuesday,
                            Repeat_Wednesday: repeatDays.wednesday,
                            Repeat_Thursday: repeatDays.thursday,
                            Repeat_Friday: repeatDays.friday,
                            Repeat_holiday: 0,
                            Repeat_Weekday: parseInt(days[x].toString()),
                            Repeat_MonthOffset: 0
                        }
                    };
                    var myString = '"JsonIn"' + ":" + JSON.stringify(dayObj);
                    var oPost = new XMLHttpRequest();
                    oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ":" + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_RepeatAppointment"', true);
                    oPost.setRequestHeader("database", erpGet.ERPDatabase);
                    oPost.setRequestHeader("username", erpGet.ERPUsername);
                    oPost.setRequestHeader("password", erpGet.ERPPassword);
                    oPost.setRequestHeader("Accept", "application/json");
                    oPost.setRequestHeader("Accept", "application/html");
                    oPost.setRequestHeader("Content-type", "application/json");
                    oPost.send(myString);

                    oPost.onreadystatechange = function() {
                        if (oPost.readyState == 4 && oPost.status == 200) {
                            var myArrResponse = JSON.parse(oPost.responseText);
                            if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                                if (x == (days.length - 1)) {
                                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                        addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                            window.open("/appointments", '_self');
                                        }).catch(function(err) {
                                            window.open("/appointments", '_self');
                                        });
                                    }).catch(function(err) {
                                        window.open("/appointments", '_self');
                                    });
                                }
                            } else {
                                $('.modal-backdrop').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'Oops...',
                                    text: myArrResponse.ProcessLog.ResponseStatus,
                                    type: 'warning',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {} else if (result.dismiss === 'cancel') {}
                                });
                            }

                        } else if (oPost.readyState == 4 && oPost.status == 403) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {} else if (result.dismiss === 'cancel') {}
                            });
                        } else if (oPost.readyState == 4 && oPost.status == 406) {
                            $('.fullScreenSpin').css('display', 'none');
                            var ErrorResponse = oPost.getResponseHeader('errormessage');
                            var segError = ErrorResponse.split(":");

                            if ((segError[1]) == ' "Unable to lock object') {
                                swal({
                                    title: 'Oops...',
                                    text: oPost.getResponseHeader('errormessage'),
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {} else if (result.dismiss === 'cancel') {}
                                });
                            } else {
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'Oops...',
                                    text: oPost.getResponseHeader('errormessage'),
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {} else if (result.dismiss === 'cancel') {}
                                });
                            }
                        } else if (oPost.readyState == "") {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {} else if (result.dismiss === 'cancel') {}
                            });
                        }
                    }
                }
            } else {
                let dayObj = {
                    Name: "VS1_RepeatAppointment",
                    Params: {
                        CloudUserName: erpGet.ERPUsername,
                        CloudPassword: erpGet.ERPPassword,
                        AppointID: parseInt(id),
                        Repeat_Frequency: frequency,
                        Repeat_Period: period,
                        Repeat_BaseDate: startDate,
                        Repeat_finalDateDate: endDate,
                        Repeat_Saturday: repeatDays.saturday,
                        Repeat_sunday: repeatDays.sunday,
                        Repeat_Monday: repeatDays.monday,
                        Repeat_Tuesday: repeatDays.tuesday,
                        Repeat_Wednesday: repeatDays.wednesday,
                        Repeat_Thursday: repeatDays.thursday,
                        Repeat_Friday: repeatDays.friday,
                        Repeat_holiday: 0,
                        Repeat_Weekday: 0,
                        Repeat_MonthOffset: 0
                    }
                };
                var myString = '"JsonIn"' + ":" + JSON.stringify(dayObj);
                var oPost = new XMLHttpRequest();
                oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ":" + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_RepeatAppointment"', true);
                oPost.setRequestHeader("database", erpGet.ERPDatabase);
                oPost.setRequestHeader("username", erpGet.ERPUsername);
                oPost.setRequestHeader("password", erpGet.ERPPassword);
                oPost.setRequestHeader("Accept", "application/json");
                oPost.setRequestHeader("Accept", "application/html");
                oPost.setRequestHeader("Content-type", "application/json");
                // let objDataSave = '"JsonIn"' + ":" + JSON.stringify(selectClient);
                oPost.send(myString);
                oPost.onreadystatechange = function() {
                    if (oPost.readyState == 4 && oPost.status == 200) {
                        var myArrResponse = JSON.parse(oPost.responseText);
                        if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                            sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                    window.open("/appointments", '_self');
                                }).catch(function(err) {
                                    window.open("/appointments", '_self');
                                });
                            }).catch(function(err) {
                                window.open("/appointments", '_self');
                            });
                        } else {
                            $('.modal-backdrop').css('display', 'none');
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oops...',
                                text: myArrResponse.ProcessLog.ResponseStatus,
                                type: 'warning',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {} else if (result.dismiss === 'cancel') {}
                            });
                        }
                    } else if (oPost.readyState == 4 && oPost.status == 403) {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === 'cancel') {}
                        });
                    } else if (oPost.readyState == 4 && oPost.status == 406) {
                        $('.fullScreenSpin').css('display', 'none');
                        var ErrorResponse = oPost.getResponseHeader('errormessage');
                        var segError = ErrorResponse.split(":");

                        if ((segError[1]) == ' "Unable to lock object') {
                            swal({
                                title: 'Oops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {} else if (result.dismiss === 'cancel') {}
                            });
                        } else {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {} else if (result.dismiss === 'cancel') {}
                            });
                        }
                    } else if (oPost.readyState == "") {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === 'cancel') {}
                        });
                    }
                }
            }
        }, delayTimeAfterSound);
    },
    'click #createInvoice': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        const templateObject = Template.instance();
        let id = $('#updateID').val();
        if (id == "") {
            swal('Please Save Appointment Before Creating an Invoice For it', "", 'warning');
            $('.fullScreenSpin').css('display', 'none');
        } else {
            let obj = {
                AppointID: parseInt(id)
            };
            let JsonIn = {
                Params: {
                    AppointIDs: [obj]
                }
            };
            let appointmentService = new AppointmentService();
            var erpGet = erpDb();
            var oPost = new XMLHttpRequest();
            oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ":" + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_InvoiceAppt"', true);
            oPost.setRequestHeader("database", erpGet.ERPDatabase);
            oPost.setRequestHeader("username", erpGet.ERPUsername);
            oPost.setRequestHeader("password", erpGet.ERPPassword);
            oPost.setRequestHeader("Accept", "application/json");
            oPost.setRequestHeader("Accept", "application/html");
            oPost.setRequestHeader("Content-type", "application/json");
            // let objDataSave = '"JsonIn"' + ":" + JSON.stringify(selectClient);
            oPost.send(JSON.stringify(JsonIn));
            oPost.onreadystatechange = function() {
                if (oPost.readyState == 4 && oPost.status == 200) {
                    $('.fullScreenSpin').css('display', 'none');
                    var myArrResponse = JSON.parse(oPost.responseText);
                    if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                        let objectDataConverted = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(id),
                                Status: "Converted"
                            }
                        };
                        appointmentService.saveAppointment(objectDataConverted).then(function(data) {
                            $('.modal-backdrop').css('display', 'none');
                            FlowRouter.go('/invoicelist?success=true&apptId=' + parseInt(id));
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                        templateObject.getAllAppointmentDataOnConvert();
                    } else {
                        $('.modal-backdrop').css('display', 'none');
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oops...',
                            text: myArrResponse.ProcessLog.ResponseStatus,
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === 'cancel') {}
                        });
                    }
                } else if (oPost.readyState == 4 && oPost.status == 403) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {} else if (result.dismiss === 'cancel') {}
                    });
                } else if (oPost.readyState == 4 && oPost.status == 406) {
                    $('.fullScreenSpin').css('display', 'none');
                    var ErrorResponse = oPost.getResponseHeader('errormessage');
                    var segError = ErrorResponse.split(":");
                    if ((segError[1]) == ' "Unable to lock object') {
                        swal({
                            title: 'Oops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === 'cancel') {}
                        });
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === 'cancel') {}
                        });
                    }
                } else if (oPost.readyState == "") {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {} else if (result.dismiss === 'cancel') {}
                    });
                }
            }
        }
    },
    'click .btnAppointmentList': function(event) {
        $('.modal-backdrop').css('display', 'none');
        let id = $('#updateID').val();
        if (id) {
            FlowRouter.go('/appointmenttimelist?id=' + id);
        } else {
            swal({
                title: 'Appointment does not exist, create one first to view Appointment Timelist',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            });
        }
    },
    'click #prev': async function() {
        let templateObject = Template.instance();
        let changeAppointmentView = templateObject.appointmentrecords.get();

        let seeOwnAllocations = localStorage.getItem('CloudAppointmentSeeOwnAllocationsOnly') || false;
        let seeOwnAppointments = localStorage.getItem('CloudAppointmentSeeOwnAppointmentsOnly__') || true;
        //get current week monday date to use it to search week in month
        let weekDate = moment($('.saturday').attr("id")).format("YYYY/MM/DD");
        let weekendStartListener = "";

        //get weeks of the month from a template object
        let weeksOfThisMonth = templateObject.weeksOfMonth.get();
        //Since we have all weeks of the month we query the weeks of the month object for data to get current week
        var getSelectedWeek = weeksOfThisMonth.filter(weekend => {
            return weekend.dates.includes(parseInt(moment(weekDate).format('DD')));
        });

        let selectedWeekEnd = getSelectedWeek[0].end;
        if (getSelectedWeek.length < 2) {} else {
            selectedWeekEnd = getSelectedWeek[1].end;
        }
        //we then get index of the week in resource view so that we can use it to query the previous week
        let index = weeksOfThisMonth.map(function(e) {
            return e.end;
        }).indexOf(selectedWeekEnd);

        if (index == 0) {
            $('.btnPrev').attr('disabled', 'disabled');
        } else {
            $('.btnNext').removeAttr('disabled');
            let dayOfWeek = weeksOfThisMonth[index - 1].dates[0];

            let dayOfWeekEnd = weeksOfThisMonth[index - 1].dates[weeksOfThisMonth[index - 1].dates.length - 1];
            if (dayOfWeek < 10) {
                dayOfWeek = "0" + dayOfWeek;
            }
            let dayPrev = [];
            let getDate = new Date();
            if ((getDate.getMonth() - 1) == -1 && dayOfWeek != 1) {
                weekendStartListener = moment((getDate.getFullYear() - 1) + "-" + "12" + "-" + dayOfWeek).format('YYYY-MM-DD');
            } else {
                let year = getDate.getFullYear();
                if (getDate.getMonth() == 1) {
                    let leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
                    if (leapYear == true) {
                        dayOfWeek = 29;
                    } else {
                        dayOfWeek = 28;
                    }
                }
                weekendStartListener = moment(getDate.getFullYear() + "-" + ("0" + (getDate.getMonth() + 1)).slice(-2) + "-" + dayOfWeek).format('YYYY-MM-DD');
            }

            let weekendStart = moment(getDate.getFullYear() + "-" + ("0" + (getDate.getMonth() + 1)).slice(-2) + "-" + dayOfWeek).format('YYYY-MM-DD');

            if (index == 1 && dayOfWeek > dayOfWeekEnd) {
                weekendStart = moment(getDate.getFullYear() + "-" + ("0" + (getDate.getMonth())).slice(-2) + "-" + dayOfWeek).format('YYYY-MM-DD');
            }
            let startWeek = new Date(weekendStart);
            // if (index == 1 && moment(weekendStart).format("DD") != "01") {
            //     startWeek = new Date(weekendStartListener);
            // }
            let weekendEnd = moment(getDate.getFullYear() + "-" + ("0" + (getDate.getMonth() + 1)).slice(-2) + "-" + dayOfWeekEnd).format('YYYY-MM-DD');

            for (let i = 0; i <= weeksOfThisMonth[index - 1].dates.length; i++) {
                // if (index == 1 && moment(weekendStart).format("DD") != "01") {
                //     for (let t = 0; t < weeksOfThisMonth[index - 1].dates.length; t++) {
                //         if (weeksOfThisMonth[index - 1].dates[0] != 1) {
                //             dayPrev.push(moment(weekendStartListener).add(t, 'days').format("YYYY-MM-DD"));
                //         } else {
                //             dayPrev.push(moment(weekendStart).add(t, 'days').format("YYYY-MM-DD"));
                //         }
                //     }
                //     i = weeksOfThisMonth[index - 1].dates.length;
                // } else {
                dayPrev.push(moment(weekendStart).add(i, 'days').format("YYYY-MM-DD"));
                //}
            }
            let currentDay = moment().format('YYYY-MM-DD');
            templateObject.resourceDates.set(dayPrev);
            //fix the week day

            let endWeek = new Date(weekendEnd);
            let resourceChat = [];
            let resourceJob = [];
            for (let a = 0; a < changeAppointmentView.length; a++) {
                let weekDay = moment(changeAppointmentView[a].startDate.split(" ")[0]).format("dddd");
                let date = new Date(changeAppointmentView[a].startDate.split(" ")[0]);
                if (resourceChat.length > 0) {
                    if (date >= startWeek && date <= endWeek) {
                        if (JSON.parse(seeOwnAppointments) == true) {
                            if (changeAppointmentView[a].employeename == localStorage.getItem("mySessionEmployee")) {
                                let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                                if (!found) {
                                    let resourceColor = templateObject.employeerecords.get();
                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == changeAppointmentView[a].employeename
                                    });
                                    let employeeColor = '#00a3d3';
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '#00a3d3';
                                    }

                                    var dataList = {
                                        id: changeAppointmentView[a].id,
                                        employeeName: changeAppointmentView[a].employeename,
                                        color: employeeColor
                                    };
                                    resourceChat.push(dataList);
                                }
                                var jobs = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    job: changeAppointmentView[a].accountname,
                                    street: changeAppointmentView[a].street,
                                    city: changeAppointmentView[a].suburb,
                                    zip: changeAppointmentView[a].zip,
                                    day: weekDay,
                                    date: changeAppointmentView[a].startDate.split(" ")[0],
                                }

                                resourceJob.push(jobs)
                            }
                        } else {
                            let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                            if (!found) {
                                let resourceColor = templateObject.employeerecords.get();

                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == changeAppointmentView[a].employeename
                                });
                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '#00a3d3';
                                }

                                var dataList = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    color: employeeColor
                                };
                                resourceChat.push(dataList);
                            }
                            var jobs = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                job: changeAppointmentView[a].accountname,
                                street: changeAppointmentView[a].street,
                                city: changeAppointmentView[a].suburb,
                                zip: changeAppointmentView[a].zip,
                                day: weekDay,
                                date: changeAppointmentView[a].startDate.split(" ")[0],
                            }

                            resourceJob.push(jobs)
                        }
                    }
                } else {
                    if (date >= startWeek && date <= endWeek) {
                        if (JSON.parse(seeOwnAppointments) == true) {
                            if (changeAppointmentView[a].employeename == localStorage.getItem("mySessionEmployee")) {
                                let resourceColor = templateObject.employeerecords.get();
                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == changeAppointmentView[a].employeename
                                });
                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '#00a3d3';
                                }
                                var dataList = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    color: employeeColor
                                };
                                var jobs = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    job: changeAppointmentView[a].accountname,
                                    street: changeAppointmentView[a].street,
                                    city: changeAppointmentView[a].suburb,
                                    zip: changeAppointmentView[a].zip,
                                    day: weekDay,
                                    date: changeAppointmentView[a].startDate.split(" ")[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                            }
                        } else {
                            let resourceColor = templateObject.employeerecords.get();
                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == changeAppointmentView[a].employeename
                            });
                            let employeeColor = '#00a3d3';
                            if (result.length > 0) {
                                employeeColor = result[0].color || '#00a3d3';
                            }
                            var dataList = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                color: employeeColor
                            };
                            var jobs = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                job: changeAppointmentView[a].accountname,
                                street: changeAppointmentView[a].street,
                                city: changeAppointmentView[a].suburb,
                                zip: changeAppointmentView[a].zip,
                                day: weekDay,
                                date: changeAppointmentView[a].startDate.split(" ")[0],
                            }
                            resourceJob.push(jobs)
                            resourceChat.push(dataList);
                        }
                    }
                }
            }

            let allEmployeesData = templateObject.employeerecords.get();
            for (let e = 0; e < allEmployeesData.length; e++) {
                let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                if (!found) {
                    var dataList = {
                        id: "",
                        employeeName: allEmployeesData[e].employeeName,
                        color: ""
                    };
                    resourceChat.push(dataList);
                }
            }

            let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            $('#here_table').empty().append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
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

            let tableRowData = [];
            let sundayRowData = [];
            let mondayRowData = [];
            let splashArrayMonday = [];
            let tuesdayRowData = [];
            let wednesdayRowData = [];
            let thursdayRowData = [];
            let fridayRowData = [];
            let saturdayRowData = [];
            let sundayRow = "";
            let mondayRow = "";
            let tuesdayRow = "";
            let wednesdayRow = "";
            let thursdayRow = "";
            let fridayRow = "";
            let saturdayRow = "";
            let tableRow = "";
            // let saturdayStatus = "";
            // let sundayStatus = "";
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
                        sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';
                        sundayRowData.push(sundayRow);
                    }
                    if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                        mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        mondayRowData.push(mondayRow);
                    }

                    if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                        tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        tuesdayRowData.push(tuesdayRow);
                    }

                    if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {
                        wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        wednesdayRowData.push(wednesdayRow);
                    }

                    if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        thursdayRowData.push(thursdayRow);
                    }

                    if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        fridayRowData.push(fridayRow);
                    }

                    if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        saturdayRowData.push(saturdayRow);
                    }

                }

                if ($('#showSaturday').is(":checked")) {
                    saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join("") + '</div></td>'
                } else {
                    saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join("") + '</div></td>'
                }

                if ($('#showSunday').is(":checked")) {
                    sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join("") + '</div></td>'
                } else {
                    sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join("") + '</div></td>'
                }

                tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + "" +
                    '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + "" +
                    sundayStatus + "" +
                    '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join("") + '</div></td>' + "" +
                    '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join("") + '</div></td>' + "" +
                    '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join("") + '</div></td>' + "" +
                    '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join("") + '</div></td>' + "" +
                    '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join("") + '</div></td>' + "" +
                    saturdayStatus + "" +
                    '</tr>';
                tableRowData.push(tableRow);
            }
            $('#here_table table').append(tableRowData);

            $('.sunday').attr("id", dayPrev[0]);
            $('.monday').attr("id", dayPrev[1]);
            $('.tuesday').attr("id", dayPrev[2]);
            $('.wednesday').attr("id", dayPrev[3]);
            $('.thursday').attr("id", dayPrev[4]);
            $('.friday').attr("id", dayPrev[5]);
            $('.saturday').attr("id", dayPrev[6]);
            $(".dateMon").text(moment(dayPrev[1]).format("MM/DD"));
            $(".dateTue").text(moment(dayPrev[2]).format("MM/DD"));
            $(".dateWed").text(moment(dayPrev[3]).format("MM/DD"));
            $(".dateThu").text(moment(dayPrev[4]).format("MM/DD"));
            $(".dateFri").text(moment(dayPrev[5]).format("MM/DD"));
            $(".dateSat").text(moment(dayPrev[6]).format("MM/DD"));
            $(".dateSun").text(moment(dayPrev[0]).format("MM/DD"));
            if ((getDate.getMonth() - 1) == -1 && dayOfWeek != 1 && index == 0) {
                $(".allocationHeaderDate h2").text(Jan + " " + moment(dayPrev[1]).format('DD') + ' - ' + moment(dayPrev[5]).format('DD') + ', ' + moment().format('YYYY'));
            } else {

                if ($('#showSaturday').is(":checked") && $('#showSunday').is(":checked")) {
                    $(".allocationHeaderDate h2").text(moment(dayPrev[1]).format('MMM') + " " + moment(dayPrev[0]).format('DD') + ' - ' + moment(dayPrev[6]).format('DD') + ', ' + moment().format('YYYY'));
                }
                if ($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == false) {
                    $(".allocationHeaderDate h2").text(moment(dayPrev[1]).format('MMM') + " " + moment(dayPrev[1]).format('DD') + ' - ' + moment(dayPrev[5]).format('DD') + ', ' + moment().format('YYYY'));
                }
                if (($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == true)) {
                    $(".allocationHeaderDate h2").text(moment(dayPrev[1]).format('MMM') + " " + moment(dayPrev[0]).format('DD') + ' - ' + moment(dayPrev[5]).format('DD') + ', ' + moment().format('YYYY'));
                }
                if (($("#showSaturday").prop('checked') == true && $("#showSunday").prop('checked') == false)) {
                    $(".allocationHeaderDate h2").text(moment(dayPrev[1]).format('MMM') + " " + moment(dayPrev[1]).format('DD') + ' - ' + moment(dayPrev[6]).format('DD') + ', ' + moment().format('YYYY'));
                }
            }
            let day = moment().format("dddd");
            let resourceDate = $('thead tr th.' + day.toLowerCase()).attr("id");
            await changeColumnColor(resourceDate);
        }
    },
    'click #next': function() {
        let templateObject = Template.instance();
        let seeOwnAllocations = localStorage.getItem('CloudAppointmentSeeOwnAllocationsOnly') || false;
        let seeOwnAppointments = localStorage.getItem('CloudAppointmentSeeOwnAppointmentsOnly__') || true;
        let weekDate = moment($('.monday').attr("id")).format("YYYY/MM/DD");
        let weeksOfThisMonth = templateObject.weeksOfMonth.get();
        var getSelectedWeek = weeksOfThisMonth.filter(weekend => {
            return weekend.dates.includes(parseInt(moment(weekDate).format('DD')));
        });
        let index = weeksOfThisMonth.map(function(e) {
            return e.end;
        }).indexOf(getSelectedWeek[0].end);
        if (((index) === (weeksOfThisMonth.length - 1))) {
            $('.btnNext').attr('disabled', 'disabled');

        } else {
            $('.btnPrev').removeAttr('disabled');
            let dayOfWeek = weeksOfThisMonth[index + 1].dates[0];

            let dayOfWeekEnd = weeksOfThisMonth[index + 1].dates[weeksOfThisMonth[index + 1].dates.length - 1];
            if (dayOfWeek < 10) {
                dayOfWeek = "0" + dayOfWeek;
            }

            //let dayOfWeekListerner ="01";
            let dayNext = [];
            let getDate = new Date();
            let weekendStart = moment(getDate.getFullYear() + "-" + ("0" + (getDate.getMonth() + 1)).slice(-2) + "-" + dayOfWeek).format('YYYY-MM-DD');
            let weekendEnd = moment(getDate.getFullYear() + "-" + ("0" + (getDate.getMonth() + 1)).slice(-2) + "-" + dayOfWeekEnd).format('YYYY-MM-DD');
            let weekendEndListener = moment(getDate.getFullYear() + "-" + ("0" + (getDate.getMonth() + 2)).slice(-2) + "-" + dayOfWeekEnd).format('YYYY-MM-DD');
            let endWeek = new Date(weekendEnd);

            if ((index) === (weeksOfThisMonth.length - 2) && weeksOfThisMonth[index + 1].dates.includes(1)) {
                endWeek = new Date(weekendEndListener);
            }

            for (let i = 0; i <= weeksOfThisMonth[index + 1].dates.length; i++) {
                if ((index) === (weeksOfThisMonth.length - 2) && weeksOfThisMonth[index + 1].dates.includes(1)) {
                    for (let t = 0; t < weeksOfThisMonth[index + 1].dates.length; t++) {
                        dayNext.push(moment(weekendStart).add(t, 'days').format("YYYY-MM-DD"));
                    }
                    i = weeksOfThisMonth[index + 1].dates.length;
                } else {
                    dayNext.push(moment(weekendStart).add(i, 'days').format("YYYY-MM-DD"));
                }

            }

            // for (i = 0; i <= weeksOfThisMonth[index + 1].dates.length; i++) {
            //     dayNext.push(moment(weekendStart).add(i, 'days').format("YYYY-MM-DD"));
            // }
            let changeAppointmentView = templateObject.appointmentrecords.get();

            //fix the week day
            let startWeek = new Date(weekendStart);
            let resourceChat = [];
            let resourceJob = [];
            for (let a = 0; a < changeAppointmentView.length; a++) {
                let weekDay = moment(changeAppointmentView[a].startDate.split(" ")[0]).format("dddd");
                let date = new Date(changeAppointmentView[a].startDate.split(" ")[0]);

                if (resourceChat.length > 0) {
                    if (date >= startWeek && date <= endWeek) {
                        if (JSON.parse(seeOwnAppointments) == true) {
                            if (changeAppointmentView[a].employeename == localStorage.getItem("mySessionEmployee")) {
                                let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                                if (!found) {
                                    let resourceColor = templateObject.employeerecords.get();
                                    var result = resourceColor.filter(apmtColor => {
                                        return apmtColor.employeeName == changeAppointmentView[a].employeename
                                    });
                                    let employeeColor = '#00a3d3';
                                    if (result.length > 0) {
                                        employeeColor = result[0].color || '#00a3d3';
                                    }
                                    var dataList = {
                                        id: changeAppointmentView[a].id,
                                        employeeName: changeAppointmentView[a].employeename,
                                        color: employeeColor
                                    };
                                    resourceChat.push(dataList);
                                }
                                var jobs = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    job: changeAppointmentView[a].accountname,
                                    street: changeAppointmentView[a].street,
                                    city: changeAppointmentView[a].suburb,
                                    zip: changeAppointmentView[a].zip,
                                    day: weekDay,
                                    date: changeAppointmentView[a].startDate.split(" ")[0],
                                }
                                resourceJob.push(jobs)
                            }
                        } else {
                            let found = resourceChat.some(emp => emp.employeeName == changeAppointmentView[a].employeename);
                            if (!found) {
                                let resourceColor = templateObject.employeerecords.get();
                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == changeAppointmentView[a].employeename
                                });
                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '#00a3d3';
                                }
                                var dataList = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    color: employeeColor
                                };
                                resourceChat.push(dataList);
                            }
                            var jobs = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                job: changeAppointmentView[a].accountname,
                                street: changeAppointmentView[a].street,
                                city: changeAppointmentView[a].suburb,
                                zip: changeAppointmentView[a].zip,
                                day: weekDay,
                                date: changeAppointmentView[a].startDate.split(" ")[0],
                            }
                            resourceJob.push(jobs)
                        }
                    }
                } else {
                    if (date >= startWeek && date <= endWeek) {
                        if (JSON.parse(seeOwnAppointments) == true) {
                            if (changeAppointmentView[a].employeename == localStorage.getItem("mySessionEmployee")) {
                                let resourceColor = templateObject.employeerecords.get();
                                var result = resourceColor.filter(apmtColor => {
                                    return apmtColor.employeeName == changeAppointmentView[a].employeename
                                });
                                let employeeColor = '#00a3d3';
                                if (result.length > 0) {
                                    employeeColor = result[0].color || '#00a3d3';
                                }
                                var dataList = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    color: employeeColor
                                };
                                var jobs = {
                                    id: changeAppointmentView[a].id,
                                    employeeName: changeAppointmentView[a].employeename,
                                    job: changeAppointmentView[a].accountname,
                                    street: changeAppointmentView[a].street,
                                    city: changeAppointmentView[a].suburb,
                                    zip: changeAppointmentView[a].zip,
                                    day: weekDay,
                                    date: changeAppointmentView[a].startDate.split(" ")[0],
                                }
                                resourceJob.push(jobs)
                                resourceChat.push(dataList);
                            }
                        } else {
                            let resourceColor = templateObject.employeerecords.get();
                            var result = resourceColor.filter(apmtColor => {
                                return apmtColor.employeeName == changeAppointmentView[a].employeename
                            });
                            let employeeColor = '#00a3d3';
                            if (result.length > 0) {
                                employeeColor = result[0].color || '#00a3d3';
                            }
                            var dataList = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                color: employeeColor
                            };
                            var jobs = {
                                id: changeAppointmentView[a].id,
                                employeeName: changeAppointmentView[a].employeename,
                                job: changeAppointmentView[a].accountname,
                                street: changeAppointmentView[a].street,
                                city: changeAppointmentView[a].suburb,
                                zip: changeAppointmentView[a].zip,
                                day: weekDay,
                                date: changeAppointmentView[a].startDate.split(" ")[0],
                            }
                            resourceJob.push(jobs)
                            resourceChat.push(dataList);
                        }
                    }
                }
            }

            let allEmployeesData = templateObject.employeerecords.get();
            for (let e = 0; e < allEmployeesData.length; e++) {
                let found = resourceChat.some(emp => emp.employeeName == allEmployeesData[e].employeeName);
                if (!found) {
                    var dataList = {
                        id: "",
                        employeeName: allEmployeesData[e].employeeName,
                        color: ""
                    };
                    resourceChat.push(dataList);
                }
            }

            let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            $('#here_table').empty().append('<div class="table-responsive table-bordered"><table id="allocationTable" class="table table-bordered allocationTable">');
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

            let tableRowData = [];
            let sundayRowData = [];
            let mondayRowData = [];
            let splashArrayMonday = [];
            let tuesdayRowData = [];
            let wednesdayRowData = [];
            let thursdayRowData = [];
            let fridayRowData = [];
            let saturdayRowData = [];
            let sundayRow = "";
            let mondayRow = "";
            let tuesdayRow = "";
            let wednesdayRow = "";
            let thursdayRow = "";
            let fridayRow = "";
            let saturdayRow = "";
            let tableRow = "";
            // let saturdayStatus = "";
            // let sundayStatus = "";
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

                        sundayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';
                        sundayRowData.push(sundayRow);
                    }
                    if (resourceJob[j].day == 'Monday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        mondayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        mondayRowData.push(mondayRow);
                    }

                    if (resourceJob[j].day == 'Tuesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        tuesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        tuesdayRowData.push(tuesdayRow);
                    }

                    if (resourceJob[j].day == 'Wednesday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        wednesdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        wednesdayRowData.push(wednesdayRow);
                    }

                    if (resourceJob[j].day == 'Thursday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        thursdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        thursdayRowData.push(thursdayRow);
                    }

                    if (resourceJob[j].day == 'Friday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        fridayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        fridayRowData.push(fridayRow);
                    }

                    if (resourceJob[j].day == 'Saturday' && resourceJob[j].employeeName == resourceChat[r].employeeName) {

                        saturdayRow = '<div class="card draggable cardHiddenWeekend" draggable="true" id="' + resourceJob[j].id + '" style="margin:4px 0px; background-color: ' + resourceChat[r].color + '; border-radius: 5px; cursor: pointer;">' + "" +
                            '<div class="card-body cardBodyInner d-xl-flex justify-content-xl-center align-items-xl-center" style="color: rgb(255,255,255); height: 30px; padding: 10px;">' + "" +
                            '<p class="text-nowrap text-truncate" style="margin: 0px;">' + resourceJob[j].job + '</p>' + "" +
                            '</div>' + "" +
                            '</div>';

                        saturdayRowData.push(saturdayRow);
                    }

                }

                if ($('#showSaturday').is(":checked")) {
                    saturdayStatus = '<td class="fullWeek saturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join("") + '</div></td>'
                } else {
                    saturdayStatus = '<td class="fullWeek saturday hidesaturday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + saturdayRowData.join("") + '</div></td>'
                }

                if ($('#showSunday').is(":checked")) {
                    sundayStatus = '<td class="fullWeek sunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join("") + '</div></td>'
                } else {
                    sundayStatus = '<td class="fullWeek sunday hidesunday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + sundayRowData.join("") + '</div></td>'
                }

                tableRow = '<tr id="' + resourceChat[r].employeeName + '">' + "" +
                    '<td class="tdEmployeeName" style="overflow: hidden; white-space: nowrap; height: 110px; max-height: 110px; font-weight: 700;padding: 6px;">' + resourceChat[r].employeeName + '</td>' + "" +
                    sundayStatus + "" +
                    '<td class="fullWeek monday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + mondayRowData.join("") + '</div></td>' + "" +
                    '<td td class="fullWeek tuesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + tuesdayRowData.join("") + '</div></td>' + "" +
                    '<td class="fullWeek wednesday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + wednesdayRowData.join("") + '</div></td>' + "" +
                    '<td class="fullWeek thursday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + thursdayRowData.join("") + '</div></td>' + "" +
                    '<td td class="fullWeek friday" style="padding: 0px;"><div class="droppable" style="min-height: 110px; overflow: hidden; margin: 6px;">' + fridayRowData.join("") + '</div></td>' + "" +
                    saturdayStatus + "" +
                    '</tr>';
                tableRowData.push(tableRow);

            }
            $('#here_table table').append(tableRowData);

            $('.sunday').attr("id", dayNext[0]);
            $('.monday').attr("id", dayNext[1]);
            $('.tuesday').attr("id", dayNext[2]);
            $('.wednesday').attr("id", dayNext[3]);
            $('.thursday').attr("id", dayNext[4]);
            $('.friday').attr("id", dayNext[5]);
            $('.saturday').attr("id", dayNext[6]);

            $(".dateMon").text(moment(dayNext[1]).format("MM/DD"));
            $(".dateTue").text(moment(dayNext[2]).format("MM/DD"));
            $(".dateWed").text(moment(dayNext[3]).format("MM/DD"));
            $(".dateThu").text(moment(dayNext[4]).format("MM/DD"));
            $(".dateFri").text(moment(dayNext[5]).format("MM/DD"));
            $(".dateSat").text(moment(dayNext[6]).format("MM/DD"));
            $(".dateSun").text(moment(dayNext[0]).format("MM/DD"));

            if ($('#showSaturday').is(":checked") && $('#showSunday').is(":checked")) {
                $(".allocationHeaderDate h2").text(moment().format('MMM') + " " + moment(dayNext[0]).format('DD') + ' - ' + moment(dayNext[6]).format('DD') + ', ' + moment().format('YYYY'));
            }

            if ($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == false) {
                $(".allocationHeaderDate h2").text(moment().format('MMM') + " " + moment(dayNext[1]).format('DD') + ' - ' + moment(dayNext[5]).format('DD') + ', ' + moment().format('YYYY'));
            }

            if (($("#showSaturday").prop('checked') == false && $("#showSunday").prop('checked') == true)) {
                $(".allocationHeaderDate h2").text(moment().format('MMM') + " " + moment(dayNext[0]).format('DD') + ' - ' + moment(dayNext[5]).format('DD') + ', ' + moment().format('YYYY'));
            }

            if (($("#showSaturday").prop('checked') == true && $("#showSunday").prop('checked') == false)) {
                $(".allocationHeaderDate h2").text(moment().format('MMM') + " " + moment(dayNext[1]).format('DD') + ' - ' + moment(dayNext[6]).format('DD') + ', ' + moment().format('YYYY'));
            }

            // $(".allocationHeaderDate h2").text(moment().format('MMM') + " " + moment(dayNext[1]).format('DD') + ' - ' + moment(dayNext[5]).format('DD') + ', ' + moment().format('YYYY'));
            let day = moment().format("dddd");
            let resourceDate = $('thead tr th.' + day.toLowerCase()).attr("id");
            changeColumnColor(resourceDate);
        }
    },
    
    'click .checkclose': function() {
        const templateObject = Template.instance();
        if (templateObject.checkRefresh.get() == true || $('#updateID').val() == "") {
            var url = FlowRouter.current().path;
            if(url === '/appointments'){
                window.open("/appointments", '_self');
            }else if(url === '/dashboardsalesmanager'){
                window.open("/dashboardsalesmanager", '_self');
            }else if(url === '/dashboardsales'){
                window.open("/dashboardsales", '_self');
            }else{
                window.open("/appointments", '_self');
            }
        }
    },
 
    "click #btnStartAppointmentConfirm": async function() {
        let toUpdateID = "";
        const templateObject = Template.instance();
        var appointmentData = templateObject.appointmentrecords.get();
        let appointmentService = new AppointmentService();
        let notes = $("#txtNotes").val() || " ";
        let id = $("#updateID").val();
        var result = appointmentData.filter((apmt) => {
            return apmt.id == id;
        });
        let desc = "Job Continued";
        if (result.length > 0) {
            if (Array.isArray(result[0].timelog) && result[0].timelog != "") {
                toUpdateID = result[0].timelog[result[0].timelog.length - 1].fields.ID;
            } else {
                if (result[0].timelog != "") {
                    toUpdateID = result[0].timelog.fields.ID;
                } else {
                    desc = "Job Started";
                }
            }
            date = new Date();
            if ($("#tActualStartTime").val() != "" && result[0].isPaused == "Paused" ) {
                $(".fullScreenSpin").css("display", "inline-block");
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
                let startTime = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                let endTime = "";

                let timeLog = [];
                let obj = {
                    StartDatetime: startTime,
                    EndDatetime: endTime,
                    Description: desc,
                };
                if (obj.StartDatetime != "" && obj.EndDatetime != "") {
                    timeLog.push(obj);
                } else {
                    timeLog = "";
                }

                let objectData = "";
                objectData = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        AppointID: parseInt(result[0].id),
                        StartDatetime: obj.StartDatetime,
                        EndDatetime: obj.EndDatetime,
                        Description: obj.Description,
                    },
                };

                appointmentService.saveTimeLog(objectData).then(function(data) {
                        let endTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                        objectData1 = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(result[0].id),
                                Othertxt: "",
                                Notes: notes,
                            },
                        };
                        if (toUpdateID != "") {
                            objectData = {
                                type: "TAppointmentsTimeLog",
                                fields: {
                                    ID: toUpdateID,
                                    EndDatetime: endTime1,
                                },
                            };
                            if (result[0].timelog != "") {
                                appointmentService.saveTimeLog(objectData).then(function(data) {
                                    appointmentService.saveAppointment(objectData1).then(function(data1) {
                                        let index = appointmentData.map(function(e) {
                                                return e.id;
                                            })
                                            .indexOf(parseInt(result[0].id));
                                        appointmentData[index].isPaused = "";
                                        templateObject.appointmentrecords.set(appointmentData);
                                        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                            addVS1Data("TAppointment", JSON.stringify(data)).then(async(datareturn) => {
                                                $(".fullScreenSpin").css("display", "none");
                                                //TODO: Start Appointment SMS sent here
                                                const customerPhone = $("#mobile").val();
                                                const smsCustomer = $("#chkSMSCustomer").is(":checked");
                                                const smsUser = $("#chkSMSUser").is(":checked");
                                                const smsSettings = templateObject.defaultSMSSettings.get();
                                                let sendSMSRes = true;
                                                if ((smsCustomer || smsUser) && customerPhone != "0" && smsSettings.twilioAccountId) {
                                                    sendSMSRes = await templateObject.sendSMSMessage("start","+" + customerPhone.replace("+", ""));
                                                    if (!sendSMSRes.success) {
                                                        swal({
                                                            title: "Oops...",
                                                            text: sendSMSRes.message,
                                                            type: "error",
                                                            showCancelButton: false,
                                                            confirmButtonText: "Try again",
                                                        }).then((result) => {
                                                            if (result.value) {
                                                                $("#btnCloseStartAppointmentModal").trigger("click");
                                                            }
                                                        });
                                                    } else {
                                                        swal({
                                                            title: "SMS was sent successfully",
                                                            text: "SMS was sent successfully",
                                                            type: "success",
                                                            showCancelButton: false,
                                                            confirmButtonText: "Ok",
                                                        });
                                                        localStorage.setItem("smsId",sendSMSRes.sid);
                                                        $("#tActualStartTime").val(moment().startOf("hour").format("HH") + ":" + moment().startOf("minute").format("mm"));
                                                        $("#btnCloseStartAppointmentModal").trigger("click");
                                                        //$('#frmAppointment').trigger('submit');
                                                        templateObject.checkRefresh.set(true);
                                                    }
                                                } else {
                                                    //$("#tActualStartTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
                                                    $("#btnCloseStartAppointmentModal").trigger("click");
                                                    //$('#frmAppointment').trigger('submit');
                                                    swal({
                                                        title: "Job Started",
                                                        text: "Job Has Been Started",
                                                        type: "success",
                                                        showCancelButton: false,
                                                        confirmButtonText: "Ok",
                                                    }).then((result) => {
                                                        if (result.value) {} else {
                                                            // window.open('/appointments', '_self');
                                                        }
                                                    });
                                                    templateObject.checkRefresh.set(true);
                                                }
                                            }).catch(function(err) {
                                                swal({
                                                    title: "Oops...",
                                                    text: err,
                                                    type: "error",
                                                    showCancelButton: false,
                                                    confirmButtonText: "Try Again",
                                                }).then((result) => {
                                                    if (result.value) {
                                                        if (err === checkResponseError) {
                                                            window.open("/", "_self");
                                                        }
                                                    } else if (result.dismiss === "cancel") {}
                                                });
                                                $(".fullScreenSpin").css("display", "none");
                                            });
                                        }).catch(function(err) {
                                            swal({
                                                title: "Oops...",
                                                text: err,
                                                type: "error",
                                                showCancelButton: false,
                                                confirmButtonText: "Try Again",
                                            }).then((result) => {
                                                if (result.value) {
                                                    if (err === checkResponseError) {
                                                        window.open("/", "_self");
                                                    }
                                                } else if (result.dismiss === "cancel") {}
                                            });
                                            $(".fullScreenSpin").css("display", "none");
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        });
                                    }).catch(function(err) {
                                        swal({
                                            title: "Oops...",
                                            text: err,
                                            type: "error",
                                            showCancelButton: false,
                                            confirmButtonText: "Try Again",
                                        }).then((result) => {
                                            if (result.value) {
                                                if (err === checkResponseError) {
                                                    window.open("/", "_self");
                                                }
                                            } else if (result.dismiss === "cancel") {}
                                        });
                                        $(".fullScreenSpin").css("display", "none");
                                    });
                                });
                            } else {
                                appointmentService.saveAppointment(objectData1).then(function(data1) {
                                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                        addVS1Data("TAppointment", JSON.stringify(data)).then(async function(datareturn) {
                                            $(".fullScreenSpin").css("display", "none");
                                            //TODO: Start Appointment SMS sent here
                                            const customerPhone = $("#mobile").val();
                                            const smsCustomer = $("#chkSMSCustomer").is(":checked");
                                            const smsUser = $("#chkSMSUser").is(":checked");
                                            const smsSettings = templateObject.defaultSMSSettings.get();
                                            let sendSMSRes = true;
                                            if ((smsCustomer || smsUser) && customerPhone != "0" && smsSettings.twilioAccountId) {
                                                sendSMSRes = await templateObject.sendSMSMessage("start","+" + customerPhone.replace("+", ""));
                                                if (!sendSMSRes.success) {
                                                    swal({
                                                        title: "Oops...",
                                                        text: sendSMSRes.message,
                                                        type: "error",
                                                        showCancelButton: false,
                                                        confirmButtonText: "Try again",
                                                    }).then((result) => {
                                                        if (result.value) {
                                                            $("#startAppointmentModal").modal("hide");
                                                        }
                                                    });
                                                } else {
                                                    localStorage.setItem("smsId", sendSMSRes.sid);
                                                    swal({
                                                        title: "SMS was sent successfully",
                                                        text: "SMS was sent successfully",
                                                        type: "success",
                                                        showCancelButton: false,
                                                        confirmButtonText: "Ok",
                                                    });
                                                    $("#tActualStartTime").val(moment().startOf("hour").format("HH") + ":" + moment().startOf("minute").format("mm"));
                                                    $("#btnCloseStartAppointmentModal").trigger("click");
                                                    //$('#frmAppointment').trigger('submit');
                                                    templateObject.checkRefresh.set(true);
                                                }
                                            } else {
                                                $("#tActualStartTime").val(moment().startOf("hour").format("HH") + ":" + moment().startOf("minute").format("mm"));
                                                $("#btnCloseStartAppointmentModal").trigger("click");
                                                //$('#frmAppointment').trigger('submit');
                                                templateObject.checkRefresh.set(true);
                                            }
                                        }).catch(function(err) {
                                            swal({
                                                title: "Oops...",
                                                text: err,
                                                type: "error",
                                                showCancelButton: false,
                                                confirmButtonText: "Try Again",
                                            }).then((result) => {
                                                if (result.value) {
                                                    if (err === checkResponseError) {
                                                        window.open("/", "_self");
                                                    }
                                                } else if (result.dismiss === "cancel") {}
                                            });
                                            $(".fullScreenSpin").css("display", "none");
                                        });
                                    }).catch(function(err) {
                                        swal({
                                            title: "Oops...",
                                            text: err,
                                            type: "error",
                                            showCancelButton: false,
                                            confirmButtonText: "Try Again",
                                        }).then((result) => {
                                            if (result.value) {
                                                if (err === checkResponseError) {
                                                    window.open("/", "_self");
                                                }
                                            } else if (result.dismiss === "cancel") {}
                                        });
                                        $(".fullScreenSpin").css("display", "none");
                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                        } else {
                                            window.open("/appointments", "_self");
                                        }
                                    });
                                }).catch(function(err) {
                                    swal({
                                        title: "Oops...",
                                        text: err,
                                        type: "error",
                                        showCancelButton: false,
                                        confirmButtonText: "Try Again",
                                    }).then((result) => {
                                        if (result.value) {
                                            if (err === checkResponseError) {
                                                window.open("/", "_self");
                                            }
                                        } else if (result.dismiss === "cancel") {}
                                    });
                                    $(".fullScreenSpin").css("display", "none");
                                });
                            }
                        }
                    }).catch(function(err) {
                        swal({
                            title: "Oops...",
                            text: err,
                            type: "error",
                            showCancelButton: false,
                            confirmButtonText: "Try Again",
                        }).then((result) => {
                            if (result.value) {
                                if (err === checkResponseError) {
                                    window.open("/", "_self");
                                }
                            } else if (result.dismiss === "cancel") {}
                        });
                        $(".fullScreenSpin").css("display", "none");
                    });
            } else if (result[0].aStartTime == "") {
                $(".fullScreenSpin").css("display", "inline-block");
                document.getElementById("tActualStartTime").value = moment().startOf("hour").format("HH") + ":" + moment().startOf("minute").format("mm");
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
                let startTime = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                let endTime = "";

                let timeLog = [];
                let obj = {
                    StartDatetime: startTime,
                    EndDatetime: endTime,
                    Description: desc,
                };
                if (obj.StartDatetime != "" && obj.EndDatetime != "") {
                    timeLog.push(obj);
                } else {
                    timeLog = "";
                }

                let objectData = "";
                objectData = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        AppointID: parseInt(result[0].id),
                        StartDatetime: obj.StartDatetime,
                        EndDatetime: obj.EndDatetime,
                        Description: obj.Description,
                    },
                };

                appointmentService.saveTimeLog(objectData).then(function(data) {
                    let getReponseID = data.fields.ID || "";
                    templateObject.toupdatelogid.set(getReponseID);
                    let endTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                    objectData1 = {
                        type: "TAppointmentEx",
                        fields: {
                            Id: parseInt(result[0].id),
                            Actual_StartTime: startTime,
                            Othertxt: "",
                        },
                    };
                    appointmentService.saveAppointment(objectData1).then(function(data1) {
                        let index = appointmentData.map(function(e) {
                                return e.id;
                            })
                            .indexOf(parseInt(result[0].id));
                        appointmentData[index].aStartTime = startTime;
                        templateObject.appointmentrecords.set(appointmentData);
                        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                            addVS1Data("TAppointment", JSON.stringify(data)).then(async function(datareturn) {
                                $(".fullScreenSpin").css("display", "none");

                                //TODO: Start Appointment SMS sent here
                                const customerPhone = $("#mobile").val();
                                const smsCustomer = $("#chkSMSCustomer").is(":checked");
                                const smsUser = $("#chkSMSUser").is(":checked");
                                const smsSettings = templateObject.defaultSMSSettings.get();
                                let sendSMSRes = true;
                                if ((smsCustomer || smsUser) && customerPhone != "0" && smsSettings.twilioAccountId) {
                                    sendSMSRes = await templateObject.sendSMSMessage("start", "+" + customerPhone.replace("+", ""));
                                    if (!sendSMSRes.success) {
                                        swal({
                                            title: "Oops...",
                                            text: sendSMSRes.message,
                                            type: "error",
                                            showCancelButton: false,
                                            confirmButtonText: "Try again",
                                        }).then((result) => {
                                            if (result.value) {
                                                $("#startAppointmentModal").modal("hide");
                                            }
                                        });
                                    } else {
                                        localStorage.setItem("smsId", sendSMSRes.sid);
                                        swal({
                                            title: "SMS was sent successfully",
                                            text: "SMS was sent successfully",
                                            type: "success",
                                            showCancelButton: false,
                                            confirmButtonText: "Ok",
                                        });
                                        $("#tActualStartTime").val(moment().startOf("hour").format("HH") + ":" + moment().startOf("minute").format("mm"));
                                        $("#btnCloseStartAppointmentModal").trigger("click");
                                        //$('#frmAppointment').submit();
                                        templateObject.checkRefresh.set(true);
                                    }
                                } else {
                                    //$("#tActualStartTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
                                    $("#btnCloseStartAppointmentModal").trigger("click");
                                    //$('#frmAppointment').submit();
                                    swal({
                                        title: "Job Started",
                                        text: "Job Has Been Started",
                                        type: "success",
                                        showCancelButton: false,
                                        confirmButtonText: "Ok",
                                    }).then((result) => {
                                        if (result.value) {} else {
                                            // window.open('/appointments', '_self');
                                        }
                                    });
                                    templateObject.checkRefresh.set(true);
                                }
                            }).catch(function(err) {
                                swal({
                                    title: "Oops...",
                                    text: err,
                                    type: "error",
                                    showCancelButton: false,
                                    confirmButtonText: "Try Again",
                                }).then((result) => {
                                    if (result.value) {
                                        if (err === checkResponseError) {
                                            window.open("/", "_self");
                                        }
                                    } else if (result.dismiss === "cancel") {}
                                });
                                $(".fullScreenSpin").css("display", "none");
                            });
                        }).catch(function(err) {
                            swal({
                                title: "Oops...",
                                text: err,
                                type: "error",
                                showCancelButton: false,
                                confirmButtonText: "Try Again",
                            }).then((result) => {
                                if (result.value) {
                                    if (err === checkResponseError) {
                                        window.open("/", "_self");
                                    }
                                } else if (result.dismiss === "cancel") {}
                            });
                            $(".fullScreenSpin").css("display", "none");
                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                window.open(localStorage.getItem("appt_historypage"), "_self");
                            } else {
                                window.open("/appointments", "_self");
                            }
                        });
                    }).catch(function(err) {
                        swal({
                            title: "Oops...",
                            text: err,
                            type: "error",
                            showCancelButton: false,
                            confirmButtonText: "Try Again",
                        }).then((result) => {
                            if (result.value) {
                                if (err === checkResponseError) {
                                    window.open("/", "_self");
                                }
                            } else if (result.dismiss === "cancel") {}
                        });
                        $(".fullScreenSpin").css("display", "none");
                    });
                }).catch(function(err) {
                    swal({
                        title: "Oops...",
                        text: err,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try Again",
                    }).then((result) => {
                        if (result.value) {
                            if (err === checkResponseError) {
                                window.open("/", "_self");
                            }
                        } else if (result.dismiss === "cancel") {}
                    });
                    $(".fullScreenSpin").css("display", "none");
                });
            } else {
                //TODO: Start Appointment SMS sent here
                const customerPhone = $("#mobile").val();
                const smsCustomer = $("#chkSMSCustomer").is(":checked");
                const smsUser = $("#chkSMSUser").is(":checked");
                const smsSettings = templateObject.defaultSMSSettings.get();
                let sendSMSRes = true;
                if ((smsCustomer || smsUser) && customerPhone != "0" && smsSettings.twilioAccountId) {
                    sendSMSRes = await templateObject.sendSMSMessage("start", "+" + customerPhone.replace("+", ""));
                    if (!sendSMSRes.success) {
                        swal({
                            title: "Oops...",
                            text: sendSMSRes.message,
                            type: "error",
                            showCancelButton: false,
                            confirmButtonText: "Try again",
                        }).then((result) => {
                            if (result.value) {
                                $("#startAppointmentModal").modal("hide");
                            }
                        });
                    } else {
                        localStorage.setItem("smsId", sendSMSRes.sid);
                        swal({
                            title: "SMS was sent successfully",
                            text: "SMS was sent successfully",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                        });
                        $("#tActualStartTime").val(moment().startOf("hour").format("HH") + ":" + moment().startOf("minute").format("mm")
                        );
                        $("#btnCloseStartAppointmentModal").trigger("click");
                        //$('#frmAppointment').trigger('submit');
                    }
                } else {
                    //$("#tActualStartTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
                    $("#btnCloseStartAppointmentModal").trigger("click");
                    //$('#frmAppointment').trigger('submit');
                }
            }
        } else {
            //TODO: Start Appointment SMS sent here
            /*
                  if (createAppointment == false) {
                      $('.modal-backdrop').css('display', 'none');
                      $('.fullScreenSpin').css('display', 'none');
                      swal({
                          title: 'Oops...',
                          text: "You don't have access to create a new Appointment",
                          type: 'error',
                          showCancelButton: false,
                          confirmButtonText: 'OK'
                      }).then((result) => {
                          if (result.value) {}
                          else if (result.dismiss === 'cancel') {}
                      });
                      return false;
                  };*/

            const customerPhone = $("#mobile").val();
            const smsCustomer = $("#chkSMSCustomer").is(":checked");
            const smsUser = $("#chkSMSUser").is(":checked");
            const smsSettings = templateObject.defaultSMSSettings.get();
            let sendSMSRes = true;
            if ((smsCustomer || smsUser) && customerPhone != "0" && smsSettings.twilioAccountId) {
                sendSMSRes = await templateObject.sendSMSMessage("start","+" + customerPhone.replace("+", ""));
                if (!sendSMSRes.success) {
                    swal({
                        title: "Oops...",
                        text: sendSMSRes.message,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try again",
                    }).then((result) => {
                        if (result.value) {
                            $("#startAppointmentModal").modal("hide");
                        } else {
                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                window.open(localStorage.getItem("appt_historypage"), "_self");
                            } else {
                                window.open("/appointments", "_self");
                            }
                        }
                    });
                } else {
                    localStorage.setItem("smsId", sendSMSRes.sid);
                    swal({
                        title: "SMS was sent successfully",
                        text: "SMS was sent successfully",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                    });
                    $("#tActualStartTime").val(moment().startOf("hour").format("HH") + ":" + moment().startOf("minute").format("mm"));
                    $("#btnCloseStartAppointmentModal").trigger("click");
                    $("#btnAppointmentSubmit").click();
                }
            } else {
                $("#tActualStartTime").val(moment().startOf("hour").format("HH") + ":" + moment().startOf("minute").format("mm"));
                $("#btnCloseStartAppointmentModal").trigger("click");
                $("#btnAppointmentSubmit").click();
            }
        }
    },
    "click #btnStartAppointment": function() {
        const templateObject = Template.instance();

        let empID = templateObject.empID.get();
        let leaveemployeerecords = templateObject.leaveemployeerecords.get();
        var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
        var leaveFlag = false;
        leaveemployeerecords.forEach((item) => {
            if (item.EmployeeID == empID && startdateGet >= new Date(item.StartDate) && startdateGet <= new Date(item.EndDate)) {
                swal(
                    "Employee is unavailable due to being on Leave",
                    "",
                    "warning"
                );
                leaveFlag = true;
            }
        });
        if (!leaveFlag) {
            templateObject.checkSMSSettings();
            const smsCustomer = $("#chkSMSCustomer").is(":checked");
            const smsUser = $("#chkSMSUser").is(":checked");
            const customerPhone = $("#mobile").val();
            if (customerPhone === "" || customerPhone === "0") {
                if (smsCustomer || smsUser) {
                    swal({
                        title: "Invalid Phone Number",
                        text: "SMS messages won't be sent.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Continue",
                        cancelButtonText: "Cancel",
                    }).then((result) => {
                        if (result.value) {
                            $("#chkSMSCustomer").prop("checked", false);
                            $("#chkSMSUser").prop("checked", false);
                            $("#btnStartAppointmentConfirm").trigger("click");
                        }
                    });
                } else {
                    $("#btnStartAppointmentConfirm").trigger("click");
                }
            } else {
                const templateObject = Template.instance();
                const smsSettings = templateObject.defaultSMSSettings.get();
                if (smsCustomer || smsUser) {
                    if (!smsSettings || !smsSettings.twilioAccountId) {
                        swal({
                            title: "No SMS Settings",
                            text: "Do you wish to setup SMS Confirmation?",
                            type: "question",
                            showCancelButton: true,
                            confirmButtonText: "Continue",
                            cancelButtonText: "Go to SMS Settings",
                        }).then((result) => {
                            if (result.value) {
                                $("#chkSMSCustomer").prop("checked", false);
                                $("#chkSMSUser").prop("checked", false);
                                $("#btnStartAppointmentConfirm").trigger("click");
                            } else if (result.dismiss === "cancel") {
                                window.open("/smssettings", "_self");
                            } else {
                                window.open("/smssettings", "_self");
                            }
                        });
                    } else {
                        const templateObject = Template.instance();
                        $("#startAppointmentModal").modal("show");
                        const accountName = $("#customer").val();
                        const employeeName = $("#employee_name").val();
                        const companyName = localStorage.getItem("vs1companyName");
                        const productService = $("#product-list").val();
                        const startAppointmentSMS = templateObject.defaultSMSSettings.get().startAppointmentSMSMessage.replace("[Customer Name]", accountName)
                            .replace("[Employee Name]", employeeName)
                            .replace("[Company Name]", companyName)
                            .replace("[Product/Service]", productService);
                        $("#startAppointmentSMSMessage").val(startAppointmentSMS);
                    }
                } else {
                    //$("#tActualStartTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
                    $("#btnStartAppointmentConfirm").trigger("click");
                }
            }
        }
    },
    "click .btnStartIgnoreSMS": function() {
        $("#chkSMSCustomer").prop("checked", false);
        $("#chkSMSUser").prop("checked", false);
        $("#btnStartAppointmentConfirm").trigger("click");
    },
    "click #btnStopAppointment": function() {
        const templateObject = Template.instance();
        templateObject.checkSMSSettings();
        const smsCustomer = $("#chkSMSCustomer").is(":checked");
        const smsUser = $("#chkSMSUser").is(":checked");
        const customerPhone = $("#mobile").val();
        if (customerPhone === "" || customerPhone === "0") {
            if (smsCustomer || smsUser) {
                swal({
                    title: "Invalid Phone Number",
                    text: "SMS messages won't be sent.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Continue",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result.value) {
                        $("#chkSMSCustomer").prop("checked", false);
                        $("#chkSMSUser").prop("checked", false);
                        $("#btnEndActualTime").trigger("click");
                    }
                });
            } else $("#btnEndActualTime").trigger("click");
        } else {
            const templateObject = Template.instance();
            const smsSettings = templateObject.defaultSMSSettings.get();
            if (smsCustomer || smsUser) {
                if (!smsSettings || !smsSettings.twilioAccountId) {
                    swal({
                        title: "No SMS Settings",
                        text: "Do you wish to setup SMS Confirmation?",
                        type: "question",
                        showCancelButton: true,
                        confirmButtonText: "Continue",
                        cancelButtonText: "Go to SMS Settings",
                    }).then((result) => {
                        if (result.value) {
                            $("#chkSMSCustomer").prop("checked", false);
                            $("#chkSMSUser").prop("checked", false);
                            $("#btnEndActualTime").trigger("click");
                        } else if (result.dismiss === "cancel") {
                            window.open("/smssettings", "_self");
                        } else {
                            window.open("/smssettings", "_self");
                        }
                    });
                } else {
                    const templateObject = Template.instance();
                    $("#stopAppointmentModal").modal("show");
                    const accountName = $("#customer").val();
                    const employeeName = $("#employee_name").val();
                    const companyName = localStorage.getItem("vs1companyName");
                    const productService = $("#product-list").val();
                    const stopAppointmentSMS = templateObject.defaultSMSSettings.get().stopAppointmentSMSMessage.replace("[Customer Name]", accountName)
                        .replace("[Employee Name]", employeeName)
                        .replace("[Company Name]", companyName)
                        .replace("[Product/Service]", productService);
                    $("#stopAppointmentSMSMessage").val(stopAppointmentSMS);
                }
            } else {
                $("#btnEndActualTime").trigger("click");
            }
        }
    },
    'click .btnStopIgnoreSMS': function() {
        $('#chkSMSCustomer').prop('checked', false);
        $('#chkSMSUser').prop('checked', false);
        $('#btnEndActualTime').trigger('click');
    },
    "click #btnSaveAppointment": async function() {
        playSaveAudio();
        const templateObject = Template.instance();
        setTimeout(async function() {
            const isLeaveBooked = await templateObject.getLeaveRequests();
            if (isLeaveBooked === true) {
                swal("Appointments can't be booked against this Employee", "", "error");
                return;
            }

            let empID = templateObject.empID.get();
            let leaveemployeerecords = templateObject.leaveemployeerecords.get();
            var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
            var leaveFlag = false;
            leaveemployeerecords.forEach((item) => {
                if (item.EmployeeID == empID && startdateGet >= new Date(item.StartDate) && startdateGet <= new Date(item.EndDate)) {
                    swal(
                        "Employee is unavailable due to being on Leave",
                        "",
                        "warning"
                    );
                    leaveFlag = true;
                }
            });

            if (!leaveFlag) {
                templateObject.checkSMSSettings();
                const smsCustomer = $("#chkSMSCustomer").is(":checked");
                const smsUser = $("#chkSMSUser").is(":checked");
                const emailCustomer = $("#customerEmail").is(":checked");
                const emailUser = $("#userEmail").is(":checked");
                localStorage.setItem("smsCustomerAppt", smsCustomer);
                localStorage.setItem("smsUserAppt", smsUser);
                localStorage.setItem("emailCustomerAppt", emailCustomer);
                localStorage.setItem("emailUserAppt", emailUser);
                const customerPhone = $("#mobile").val();
                if (customerPhone === "" || customerPhone === "0") {
                    if (smsCustomer || smsUser) {
                        swal({
                            title: "Invalid Phone Number",
                            text: "SMS messages won't be sent.",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Continue",
                            cancelButtonText: "Cancel",
                        }).then((result) => {
                            if (result.value) {
                                $("#chkSMSCustomer").prop("checked", false);
                                $("#chkSMSUser").prop("checked", false);
                                $("#btnSaveAppointmentSubmit").trigger("click");
                            }
                        });
                    } else if ($("#tActualEndTime").val() == "" && (emailCustomer || emailUser)) {
                        $("#saveAppointmentModal").modal("show");
                        const accountName = $("#customer").val();
                        const employeeName = $("#employee_name").val();
                        const companyName = localStorage.getItem("vs1companyName");
                        const fullAddress = $("#address").val() + ", " + $("#suburb").val() + ", " + $("#state").val() + ", " + $("#country").val();
                        const bookedTime = $("#startTime").val() ? $("#startTime").val() : "";
                        const productService = $("#product-list").val();
                        const saveAppointmentSMS = templateObject.defaultSMSSettings.get().saveAppointmentSMSMessage.replace("[Customer Name]", accountName)
                            .replace("[Employee Name]", employeeName)
                            .replace("[Company Name]", companyName)
                            .replace("[Product/Service]", productService)
                            .replace("[Full Address]", fullAddress)
                            .replace("[Booked Time]", bookedTime);
                        $("#saveAppointmentSMSMessage").val(saveAppointmentSMS);
                    } else {
                        $("#btnSaveAppointmentSubmit").trigger("click");
                    }
                } else {
                    // const templateObject = Template.instance();
                    const smsSettings = templateObject.defaultSMSSettings.get();
                    if ($("#tActualEndTime").val() == "" && (smsCustomer || smsUser)) {
                        if (!smsSettings || !smsSettings.twilioAccountId) {
                            swal({
                                title: "No SMS Settings",
                                // text: "SMS messages won't be sent to Customer or User.",
                                text: "Do you wish to setup SMS Confirmation?",
                                type: "question",
                                // type: 'warning',
                                showCancelButton: true,
                                confirmButtonText: "Continue",
                                cancelButtonText: "Go to SMS Settings",
                            }).then((result) => {
                                if (result.value) {
                                    $("#chkSMSCustomer").prop("checked", false);
                                    $("#chkSMSUser").prop("checked", false);
                                    $("#btnStartAppointmentConfirm").trigger("click");
                                } else if (result.dismiss === "cancel") {
                                    window.open("/smssettings", "_self");
                                } else {
                                    window.open("/smssettings", "_self");
                                }
                            });
                        } else {
                            $("#saveAppointmentModal").modal("show");
                            const accountName = $("#customer").val();
                            const employeeName = $("#employee_name").val();
                            const companyName = localStorage.getItem("vs1companyName");
                            const fullAddress = $("#address").val() + ", " + $("#suburb").val() + ", " + $("#state").val() + ", " + $("#country").val();
                            const bookedTime = $("#startTime").val() ? $("#startTime").val() : "";
                            const productService = $("#product-list").val();
                            const saveAppointmentSMS = templateObject.defaultSMSSettings.get().saveAppointmentSMSMessage.replace("[Customer Name]", accountName)
                                .replace("[Employee Name]", employeeName)
                                .replace("[Company Name]", companyName)
                                .replace("[Product/Service]", productService)
                                .replace("[Full Address]", fullAddress)
                                .replace("[Booked Time]", bookedTime);
                            $("#saveAppointmentSMSMessage").val(saveAppointmentSMS);
                        }
                    } else if ($("#tActualEndTime").val() == "" && (emailCustomer || emailUser)) {
                        $("#saveAppointmentModal").modal("show");
                        const accountName = $("#customer").val();
                        const employeeName = $("#employee_name").val();
                        const companyName = localStorage.getItem("vs1companyName");
                        const fullAddress = $("#address").val() + ", " + $("#suburb").val() + ", " + $("#state").val() + ", " + $("#country").val();
                        const bookedTime = $("#startTime").val() ? $("#startTime").val() : "";
                        const productService = $("#product-list").val();
                        const saveAppointmentSMS = templateObject.defaultSMSSettings.get().saveAppointmentSMSMessage.replace("[Customer Name]", accountName)
                            .replace("[Employee Name]", employeeName)
                            .replace("[Company Name]", companyName)
                            .replace("[Product/Service]", productService)
                            .replace("[Full Address]", fullAddress)
                            .replace("[Booked Time]", bookedTime);
                        $("#saveAppointmentSMSMessage").val(saveAppointmentSMS);
                    } else {
                        $("#btnSaveAppointmentSubmit").trigger("click");
                    }
                }
            }
        }, delayTimeAfterSound);
    },
    'click .btnSaveIgnoreSMS': function() {
        playSaveAudio();
        setTimeout(async function() {
            $("#chkSMSCustomer").prop("checked", false);
            $("#chkSMSUser").prop("checked", false);
            let emailCustomer = $("#customerEmail").is(":checked");
            let emailUser = $("#userEmail").is(":checked");
            $("#saveAppointmentModal").modal("hide");
            $("#event-modal").modal("hide");
            if (emailCustomer || emailUser) {
                await sendAppointmentEmail();
                $("#btnAppointmentSubmit").click();
            } else {
                $("#btnAppointmentSubmit").click();
            }
        }, delayTimeAfterSound);
    },
    'click #btnCloseStopAppointmentModal': function() {
        $('#stopAppointmentModal').modal("hide");
    },
    'click #btnCloseStartAppointmentModal': function() {
        $('#startAppointmentModal').modal("hide");
    },
    'click #btnCloseSaveAppointmentModal': function() {
        $('#saveAppointmentModal').modal("hide");
    },
    "click #btnSaveAppointmentSubmit": async function(e) {
        e.preventDefault();
        const templateObject = Template.instance();
        const smsCustomer = $("#chkSMSCustomer").is(":checked");
        const smsUser = $("#chkSMSUser").is(":checked");
        const customerPhone = $("#mobile").val();
        var emailCustomer = $("#customerEmail").is(":checked");
        var emailUser = $("#userEmail").is(":checked");
        const smsSettings = templateObject.defaultSMSSettings.get();
        let sendSMSRes = true;
        /*
            if (createAppointment == false) {
                $('.modal-backdrop').css('display', 'none');
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Oops...',
                    text: "You don't have access to create a new Appointment",
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {}
                    else if (result.dismiss === 'cancel') {}
                });
                return false;
            };*/

        if ((smsCustomer || smsUser) && customerPhone != "0" && smsSettings.twilioAccountId) {
            sendSMSRes = await templateObject.sendSMSMessage("save","+" + customerPhone.replace("+", ""));
            if (!sendSMSRes.success) {
                swal({
                    title: "Oops...",
                    text: sendSMSRes.message,
                    type: "error",
                    showCancelButton: false,
                    confirmButtonText: "Try again",
                }).then((result) => {
                    if (result.value) {
                        $("#saveAppointmentModal").modal("hide");
                    } else {
                        // window.open('/appointments', '_self');
                    }
                });
            } else {
                localStorage.setItem("smsId", sendSMSRes.sid);
                $("#saveAppointmentModal").modal("hide");
                swal({
                    title: "SMS was sent successfully",
                    text: "SMS was sent successfully",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                }).then((result) => {
                    if (result.value) {
                        $("#event-modal").modal("hide");
                    } else {
                        // window.open('/appointments', '_self');
                    }
                });
                if (emailCustomer || emailUser) {
                    await sendAppointmentEmail();
                    $("#btnAppointmentSubmit").click();
                } else {
                    $("#btnAppointmentSubmit").click();
                }
            }
        } else {
			$("#event-modal").modal("hide");
            if (emailCustomer || emailUser) {
                await sendAppointmentEmail();
                $("#btnAppointmentSubmit").click();
            } else {
                $("#btnAppointmentSubmit").click();
            }
        }
    },
    'change #chkSMSCustomer': function() {
        if ($('#chkSMSCustomer').is(':checked')) {
            const templateObject = Template.instance();
            templateObject.checkSMSSettings();
        }
    },
    'change #chkSMSUser': function() {
        if ($('#chkSMSUser').is(':checked')) {
            const templateObject = Template.instance();
            templateObject.checkSMSSettings();
        }
    },
    'click #btnEndActualTime': function() {
        const templateObject = Template.instance();
        var appointmentData = templateObject.appointmentrecords.get();
        let id = $('#updateID').val();
        var result = appointmentData.filter(apmt => {
            return apmt.id == id
        });
        let paused = result[0].isPaused || ""
        if (paused == "Paused") {
            swal({
                title: "Can't Stop Job",
                text: 'This Job is Currently Paused, click "OK" to go back and click "Start" to Continue the Job',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok'
            })
        } else {
            if (document.getElementById("tActualStartTime").value == "") {} else {
                document.getElementById("tActualEndTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
                swal({
                    title: 'Stop Appointment',
                    text: "Once an appointment has ended, it cannot be restarted",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'End Appointment'
                }).then(async(result) => {
                    if (result.value) {
                        let date1 = document.getElementById("dtSODate").value;
                        let date2 = document.getElementById("dtSODate2").value;
                        date1 = templateObject.dateFormat(date1);
                        date2 = templateObject.dateFormat(date2);
                        var endTime = new Date(date2 + " " + document.getElementById("tActualEndTime").value + ':00');
                        var startTime = new Date(date1 + " " + document.getElementById("tActualStartTime").value + ':00');
                        document.getElementById('txtActualHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);

                        //TODO: Stop Appointment SMS sent here
                        const customerPhone = $('#mobile').val();
                        const smsCustomer = $('#chkSMSCustomer').is(':checked');
                        const smsUser = $('#chkSMSUser').is(':checked');
                        const smsSettings = templateObject.defaultSMSSettings.get();
                        let sendSMSRes = true;
                        if ((smsCustomer || smsUser) && customerPhone != "0" && smsSettings.twilioAccountId) {
                            sendSMSRes = await templateObject.sendSMSMessage('stop', '+' + customerPhone.replace('+', ""));
                            if (!sendSMSRes.success) {
                                swal({
                                    title: 'Oops...',
                                    text: sendSMSRes.message,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try again'
                                }).then((result) => {
                                    if (result.value) {
                                        $('#startAppointmentModal').modal("hide");
                                    }
                                });
                            } else {
                                localStorage.setItem('smsId', sendSMSRes.sid);
                                swal({
                                    title: 'SMS was sent successfully',
                                    text: "SMS was sent successfully",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'Ok'
                                });
                                $('#btnCloseStopAppointmentModal').trigger('click');
                                $("#btnAppointmentSubmit").click();
                            }
                        } else {
                            $('#btnCloseStopAppointmentModal').trigger('click');
                            $("#btnAppointmentSubmit").click();
                        }
                    } else if (result.dismiss === 'cancel') {
                        document.getElementById('tActualEndTime').value = "";
                        document.getElementById('txtActualHoursSpent').value = "0";
                    } else {
                        document.getElementById('tActualEndTime').value = "";
                        document.getElementById('txtActualHoursSpent').value = "0";
                    }
                });

            }
        }
    },
    "click #btnHold": function(event) {
        // if (localStorage.getItem('CloudAppointmentStartStopAccessLevel') == true) {
        //     swal({
        //         title: 'Oops...',
        //         text: 'You do not have access to put appointments "On Hold"',
        //         type: 'error',
        //         showCancelButton: false,
        //         confirmButtonText: 'OK'
        //     }).then((results) => {
        //         if (results.value) {}
        //         else if (results.dismiss === 'cancel') {}
        //     });
        // }else{
        if ($("#updateID").val() == "") {
            swal({
                title: "Oops...",
                text: "This Appointment hasn't been started. Please Save and then Start your Appointment before continuing.",
                type: "warning",
                showCancelButton: false,
                confirmButtonText: "Ok",
            });
        } else {
            $("#frmOnHoldModal").modal();
        }
        //}
    },
    'click #btnOptions': function(event) {
        if ($('#updateID').val() == "") {
            swal({
                title: 'Oops...',
                text: "This Appointment hasn't been saved. Please Save Appointment to use the 'Option' features",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok'
            })
        } else {
            $('#frmOptions').modal();
        }

    },
    'click #btnRepeatApp': function(event) {
        const templateObject = Template.instance();
        let dayObj = {
            saturday: 0,
            sunday: 0,
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0
        };
        templateObject.repeatDays.set(dayObj)
        $('.select-size').hide();
        $('.repeatOn').hide();
        $('#myModal2').modal();
    },
    'click #btnAppOptionsModal': function(event) {
        $('#frmOptions').modal("show");
    },
    'change #showSaturday1': function() {
        var checkbox = document.querySelector("#showSaturday");
        if (checkbox.checked) {} else {}

    },
    'change #showSunday1': function() {
        var checkbox = document.querySelector("#showSunday");
        if (checkbox.checked) {} else {}

    },
    // 'click #btnDelete': function(event) {
    //     let appointmentService = new AppointmentService();
    //     let id = document.getElementById('updateID').value || "0";
    //     swal({
    //         title: 'Delete Appointment',
    //         text: "Are you sure you want to delete Appointment?",
    //         type: 'question',
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes'
    //     }).then((result) => {
    //         if (result.value) {
    //             if (id == "0" || id == null) {
    //                 swal({
    //                     title: "Can't delete appointment, it does not exist",
    //                     text: "Can't delete appointment, it does not exist",
    //                     type: 'error',
    //                     showCancelButton: false,
    //                     confirmButtonText: 'Try Again'
    //                 });
    //             } else {
    //                 let objectData = {
    //                     type: "TAppointmentEx",
    //                     fields: {
    //                         Id: parseInt(id),
    //                         Active: false
    //                     }
    //                 }

    //                 appointmentService.saveAppointment(objectData).then(function(data) {
    //                     $("#event-modal").modal("hide");
    //                     sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(dataList) {
    //                         addVS1Data("TAppointment", JSON.stringify(dataList)).then(function(datareturn) {
    //                             setTimeout(function() {
    //                                 window.open("/appointments", '_self');
    //                             }, 500);
    //                         }).catch(function(err) {
    //                             window.open("/appointments", '_self');
    //                         })
    //                     }).catch(function(err) {
    //                         window.open("/appointments", '_self');
    //                     })

    //                 }).catch(function(err) {
    //                     $('.fullScreenSpin').css('display', 'none');
    //                 });
    //             }
    //         } else if (result.dismiss === 'cancel') {} else {}
    //     });

    // },

    "click #btnDelete": function() {
        $("#deleteLineModal").modal("toggle");
    },
    "click .btnDeleteAppointment": function() {
        playDeleteAudio();
        let appointmentService = new AppointmentService();
        setTimeout(function() {
            let id = document.getElementById("updateID").value || "0";
            swal({
                title: "Delete Appointment",
                text: "Are you sure you want to delete Appointment?",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
            }).then((result) => {
                if (result.value) {
                    $(".fullScreenSpin").css("display", "inline-block");
                    if (id == "0" || id == null) {
                        swal({
                            title: "Can't delete appointment, it does not exist",
                            text: "Can't delete appointment, it does not exist",
                            type: "error",
                            showCancelButton: false,
                            confirmButtonText: "Try Again",
                        });
                    } else {
                        let objectData = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(id),
                                Active: false,
                            },
                        };
                        appointmentService.saveAppointment(objectData).then(function() {
                            $("#event-modal").modal("hide");
                            sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(dataList) {
                                addVS1Data("TAppointment", JSON.stringify(dataList)).then(function() {
                                    setTimeout(function() {
                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                        } else {
                                            window.open("/appointments", "_self");
                                        }
                                    }, 500);
                                }).catch(function() {
                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                    } else {
                                        window.open("/appointments", "_self");
                                    }
                                });
                            }).catch(function() {
                                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                    window.open(localStorage.getItem("appt_historypage"), "_self");
                                } else {
                                    window.open("/appointments", "_self");
                                }
                            });
                        }).catch(function() {
                            $(".fullScreenSpin").css("display", "none");
                        });
                    }
                } else if (result.dismiss === "cancel") {} else {}
            });
        }, delayTimeAfterSound);
    },
    "click .btnDeleteFollowingAppointments": function() {
        playDeleteAudio();
        var erpGet = erpDb();
        setTimeout(function() {
            swal({
                title: "Delete Appointment",
                text: "Are you sure you want to delete this Appointment and the following Appointments?",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
            }).then((result) => {
                if (result.value) {
                    if ($("#updateID").val() != "") {
                        $(".fullScreenSpin").css("display", "block");
                        let id = $("#updateID").val();
                        let data = {
                            Name: "VS1_DeleteAllAppts",
                            Params: {
                                AppointID: parseInt(id),
                            },
                        };
                        var myString = '"JsonIn"' + ":" + JSON.stringify(data);
                        var oPost = new XMLHttpRequest();
                        oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ":" + erpGet.ERPPort + "/" + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_DeleteAllAppts"',true);
                        oPost.setRequestHeader("database", erpGet.ERPDatabase);
                        oPost.setRequestHeader("username", erpGet.ERPUsername);
                        oPost.setRequestHeader("password", erpGet.ERPPassword);
                        oPost.setRequestHeader("Accept", "application/json");
                        oPost.setRequestHeader("Accept", "application/html");
                        oPost.setRequestHeader("Content-type", "application/json");
                        // let objDataSave = '"JsonIn"' + ':' + JSON.stringify(selectClient);
                        oPost.send(myString);

                        oPost.onreadystatechange = function() {
                            if (oPost.readyState == 4 && oPost.status == 200) {
                                var myArrResponse = JSON.parse(oPost.responseText);
                                if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                        addVS1Data("TAppointment", JSON.stringify(data)).then(function() {
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        }).catch(function() {
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        });
                                    }).catch(function() {
                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                        } else {
                                            window.open("/appointments", "_self");
                                        }
                                    });
                                } else {
                                    $(".modal-backdrop").css("display", "none");
                                    $(".fullScreenSpin").css("display", "none");
                                    swal({
                                        title: "Oops...",
                                        text: myArrResponse.ProcessLog.ResponseStatus,
                                        type: "warning",
                                        showCancelButton: false,
                                        confirmButtonText: "Try Again",
                                    }).then((result) => {
                                        if (result.value) {} else if (result.dismiss === "cancel") {}
                                    });
                                }
                            } else if (oPost.readyState == 4 && oPost.status == 403) {
                                $(".fullScreenSpin").css("display", "none");
                                swal({
                                    title: "Oops...",
                                    text: oPost.getResponseHeader("errormessage"),
                                    type: "error",
                                    showCancelButton: false,
                                    confirmButtonText: "Try Again",
                                }).then((result) => {
                                    if (result.value) {} else if (result.dismiss === "cancel") {}
                                });
                            } else if (oPost.readyState == 4 && oPost.status == 406) {
                                $(".fullScreenSpin").css("display", "none");
                                var ErrorResponse = oPost.getResponseHeader("errormessage");
                                var segError = ErrorResponse.split(":");

                                if (segError[1] == ' "Unable to lock object') {
                                    swal({
                                        title: "Oops...",
                                        text: oPost.getResponseHeader("errormessage"),
                                        type: "error",
                                        showCancelButton: false,
                                        confirmButtonText: "Try Again",
                                    }).then((result) => {
                                        if (result.value) {} else if (result.dismiss === "cancel") {}
                                    });
                                } else {
                                    $(".fullScreenSpin").css("display", "none");
                                    swal({
                                        title: "Oops...",
                                        text: oPost.getResponseHeader("errormessage"),
                                        type: "error",
                                        showCancelButton: false,
                                        confirmButtonText: "Try Again",
                                    }).then((result) => {
                                        if (result.value) {} else if (result.dismiss === "cancel") {}
                                    });
                                }
                            } else if (oPost.readyState == "") {
                                $(".fullScreenSpin").css("display", "none");
                                swal({
                                    title: "Oops...",
                                    text: oPost.getResponseHeader("errormessage"),
                                    type: "error",
                                    showCancelButton: false,
                                    confirmButtonText: "Try Again",
                                }).then((result) => {
                                    if (result.value) {} else if (result.dismiss === "cancel") {}
                                });
                            }
                        };
                    } else {
                        swal({
                            title: "Oops...",
                            text: "Appointment Does Not Exist",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonText: "Try Again",
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === "cancel") {}
                        });
                    }
                }
            });
        }, delayTimeAfterSound);
    },
    "click #btnCreateInvoice": function() {
        $(".fullScreenSpin").css("display", "inline-block");
        const templateObject = Template.instance();
        let id = $("#updateID").val();
        if (id == "") {
            swal(
                "Please Save Appointment Before Creating an Invoice For it",
                "",
                "warning"
            );
            $(".fullScreenSpin").css("display", "none");
        } else {
            let obj = {
                AppointID: parseInt(id),
            };
            let JsonIn = {
                Name: "VS1_InvoiceAppt",
                Params: {
                    AppointIDs: [obj],
                },
            };
            let appointmentService = new AppointmentService();
            var erpGet = erpDb();
            var oPost = new XMLHttpRequest();
            oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ":" + erpGet.ERPPort + "/" + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_InvoiceAppt"',true);
            oPost.setRequestHeader("database", erpGet.ERPDatabase);
            oPost.setRequestHeader("username", erpGet.ERPUsername);
            oPost.setRequestHeader("password", erpGet.ERPPassword);
            oPost.setRequestHeader("Accept", "application/json");
            oPost.setRequestHeader("Accept", "application/html");
            oPost.setRequestHeader("Content-type", "application/json");
            // let objDataSave = '"JsonIn"' + ':' + JSON.stringify(selectClient);
            oPost.send(JSON.stringify(JsonIn));

            oPost.onreadystatechange = function() {
                if (oPost.readyState == 4 && oPost.status == 200) {
                    $(".fullScreenSpin").css("display", "none");
                    var myArrResponse = JSON.parse(oPost.responseText);
                    if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                        let objectDataConverted = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(id),
                                Status: "Converted",
                            },
                        };
                        appointmentService.saveAppointment(objectDataConverted).then(function() {
                            $(".modal-backdrop").css("display", "none");
                            FlowRouter.go("/invoicelist?success=true&apptId=" + parseInt(id));
                        }).catch(function() {
                            $(".fullScreenSpin").css("display", "none");
                        });
                        templateObject.getAllAppointmentDataOnConvert();
                    } else {
                        $(".modal-backdrop").css("display", "none");
                        $(".fullScreenSpin").css("display", "none");
                        swal({
                            title: "Oops...",
                            text: myArrResponse.ProcessLog.ResponseStatus,
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonText: "Try Again",
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === "cancel") {}
                        });
                    }
                } else if (oPost.readyState == 4 && oPost.status == 403) {
                    $(".fullScreenSpin").css("display", "none");
                    swal({
                        title: "Oops...",
                        text: oPost.getResponseHeader("errormessage"),
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try Again",
                    }).then((result) => {
                        if (result.value) {} else if (result.dismiss === "cancel") {}
                    });
                } else if (oPost.readyState == 4 && oPost.status == 406) {
                    $(".fullScreenSpin").css("display", "none");
                    var ErrorResponse = oPost.getResponseHeader("errormessage");
                    var segError = ErrorResponse.split(":");

                    if (segError[1] == ' "Unable to lock object') {
                        swal({
                            title: "Oops...",
                            text: oPost.getResponseHeader("errormessage"),
                            type: "error",
                            showCancelButton: false,
                            confirmButtonText: "Try Again",
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === "cancel") {}
                        });
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                        swal({
                            title: "Oops...",
                            text: oPost.getResponseHeader("errormessage"),
                            type: "error",
                            showCancelButton: false,
                            confirmButtonText: "Try Again",
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === "cancel") {}
                        });
                    }
                } else if (oPost.readyState == "") {
                    $(".fullScreenSpin").css("display", "none");
                    swal({
                        title: "Oops...",
                        text: oPost.getResponseHeader("errormessage"),
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try Again",
                    }).then((result) => {
                        if (result.value) {} else if (result.dismiss === "cancel") {}
                    });
                }
            };
        }
    },
    "click #btnCopyOptions": async function() {
        playCopyAudio();
        setTimeout(async function() {
            $("#basedOnFrequency").prop('checked', true);
            $('#edtFrequencyDetail').css('display', 'flex');
            $(".ofMonthList input[type=checkbox]").each(function() {
                $(this).prop('checked', false);
            });
            $(".selectDays input[type=checkbox]").each(function() {
                $(this).prop('checked', false);
            });
            // var url = FlowRouter.current().path;
            // var getso_id = url.split("?id=");
            // var currentAppt = getso_id[getso_id.length - 1];
            // if (getso_id[1]) {
            //     currentAppt = parseInt(currentAppt);
            //     var apptData = await appointmentService.getOneAppointmentdataEx(currentAppt);
            //     var selectedType = apptData.fields.CUSTFLD7;
            //     var frequencyVal = apptData.fields.CUSTFLD8;
            //     var startDate = apptData.fields.CUSTFLD9;
            //     var finishDate = apptData.fields.CUSTFLD10;
            //     var subStartDate = startDate.substring(0, 10);
            //     var subFinishDate = finishDate.substring(0, 10);
            //     var convertedStartDate = subStartDate ? subStartDate.split('-')[2] + '/' + subStartDate.split('-')[1] + '/' + subStartDate.split('-')[0] : '';
            //     var convertedFinishDate = subFinishDate ? subFinishDate.split('-')[2] + '/' + subFinishDate.split('-')[1] + '/' + subFinishDate.split('-')[0] : '';

            //     var arrFrequencyVal = frequencyVal.split("@");
            //     var radioFrequency = arrFrequencyVal[0];
            //     $("#" + radioFrequency).prop('checked', true);
            //     if (radioFrequency == "frequencyMonthly") {
            //         document.getElementById("monthlySettings").style.display = "block";
            //         document.getElementById("weeklySettings").style.display = "none";
            //         document.getElementById("dailySettings").style.display = "none";
            //         document.getElementById("oneTimeOnlySettings").style.display = "none";
            //         var monthDate = arrFrequencyVal[1];
            //         $("#sltDay").val('day' + monthDate);
            //         var ofMonths = arrFrequencyVal[2];
            //         var arrOfMonths = ofMonths.split(",");
            //         for (i = 0; i < arrOfMonths.length; i++) {
            //             $("#formCheck-" + arrOfMonths[i]).prop('checked', true);
            //         }
            //         $('#edtMonthlyStartDate').val(convertedStartDate);
            //         $('#edtMonthlyFinishDate').val(convertedFinishDate);
            //     } else if (radioFrequency == "frequencyWeekly") {
            //         document.getElementById("weeklySettings").style.display = "block";
            //         document.getElementById("monthlySettings").style.display = "none";
            //         document.getElementById("dailySettings").style.display = "none";
            //         document.getElementById("oneTimeOnlySettings").style.display = "none";
            //         var everyWeeks = arrFrequencyVal[1];
            //         $("#weeklyEveryXWeeks").val(everyWeeks);
            //         var selectDays = arrFrequencyVal[2];
            //         var arrSelectDays = selectDays.split(",");
            //         for (i = 0; i < arrSelectDays.length; i++) {
            //             if (parseInt(arrSelectDays[i]) == 0)
            //                 $("#formCheck-sunday").prop('checked', true);
            //             if (parseInt(arrSelectDays[i]) == 1)
            //                 $("#formCheck-monday").prop('checked', true);
            //             if (parseInt(arrSelectDays[i]) == 2)
            //                 $("#formCheck-tuesday").prop('checked', true);
            //             if (parseInt(arrSelectDays[i]) == 3)
            //                 $("#formCheck-wednesday").prop('checked', true);
            //             if (parseInt(arrSelectDays[i]) == 4)
            //                 $("#formCheck-thursday").prop('checked', true);
            //             if (parseInt(arrSelectDays[i]) == 5)
            //                 $("#formCheck-friday").prop('checked', true);
            //             if (parseInt(arrSelectDays[i]) == 6)
            //                 $("#formCheck-saturday").prop('checked', true);
            //         }
            //         $('#edtWeeklyStartDate').val(convertedStartDate);
            //         $('#edtWeeklyFinishDate').val(convertedFinishDate);
            //     } else if (radioFrequency == "frequencyDaily") {
            //         document.getElementById("dailySettings").style.display = "block";
            //         document.getElementById("monthlySettings").style.display = "none";
            //         document.getElementById("weeklySettings").style.display = "none";
            //         document.getElementById("oneTimeOnlySettings").style.display = "none";
            //         var dailyRadioOption = arrFrequencyVal[1];
            //         $("#" + dailyRadioOption).prop('checked', true);
            //         var everyDays = arrFrequencyVal[2];
            //         $("#dailyEveryXDays").val(everyDays);
            //         $('#edtDailyStartDate').val(convertedStartDate);
            //         $('#edtDailyFinishDate').val(convertedFinishDate);
            //     } else if (radioFrequency == "frequencyOnetimeonly") {
            //         document.getElementById("oneTimeOnlySettings").style.display = "block";
            //         document.getElementById("monthlySettings").style.display = "none";
            //         document.getElementById("weeklySettings").style.display = "none";
            //         document.getElementById("dailySettings").style.display = "none";
            //         $('#edtOneTimeOnlyDate').val(convertedStartDate);
            //         $('#edtOneTimeOnlyTimeError').css('display', 'none');
            //         $('#edtOneTimeOnlyDateError').css('display', 'none');
            //     }
            // }
            $("#copyFrequencyModal").modal("toggle");
        }, delayTimeAfterSound);
    },

    'click .btnAddAttachmentSave': function(event) {
        let appointmentService = new AppointmentService();
        let templateObject = Template.instance();
        let uploadedItems = templateObject.uploadedFiles.get();
        let id = document.getElementById('updateID').value || "0";
        $('.fullScreenSpin').css('display', 'inline-block');
        if (id == "0" || id == null) {
            // $("#event-modal").modal("hide");
            $('.fullScreenSpin').css('display', 'none');
            $('#myModalAttachment').modal("hide");
        } else {
            let objectData = {
                type: "TAppointmentEx",
                fields: {
                    Id: parseInt(id),
                    Attachments: uploadedItems
                }
            };

            appointmentService.saveAppointment(objectData).then(function(data) {
                $('#myModalAttachment').modal("hide");
                sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(dataList) {
                    addVS1Data("TAppointment", JSON.stringify(dataList)).then(function(datareturn) {
                        // setTimeout(function () {
                        $('.fullScreenSpin').css('display', 'none');
                        // }, 500);
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    })
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                })
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'change #startTime': function() {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date2 = document.getElementById("dtSODate2").value;
        date1 = templateObject.dateFormat(date1);
        date2 = templateObject.dateFormat(date2);
        var endTime = new Date(date2 + " " + document.getElementById("endTime").value + ':00');
        var startTime = new Date(date1 + " " + document.getElementById("startTime").value + ':00');
        if (date2 != "" && endTime > startTime) {
            let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
            document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours) || "";
        } else {}
    },
    'change #endTime': function() {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date2 = document.getElementById("dtSODate2").value;
        date1 = templateObject.dateFormat(date1);
        date2 = templateObject.dateFormat(date2);
        var endTime = new Date(date2 + " " + document.getElementById("endTime").value + ':00');
        var startTime = new Date(date1 + " " + document.getElementById("startTime").value + ':00');
        if (endTime > startTime) {
            let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
            document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours) || "";
        } else {}
    },
    'change #tActualStartTime': function() {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date2 = document.getElementById("dtSODate2").value;
        date1 = templateObject.dateFormat(date1);
        date2 = templateObject.dateFormat(date2);
        var endTime = new Date(date2 + " " + document.getElementById("tActualEndTime").value + ':00');
        var startTime = new Date(date1 + " " + document.getElementById("tActualStartTime").value + ':00');
        if (date2 != "" && endTime > startTime) {
            let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
            document.getElementById('txtActualHoursSpent').value = templateObject.timeFormat(hours) || "";
        } else {}
    },
    'change #tActualEndTime': function() {
        const templateObject = Template.instance();
        let date1 = document.getElementById("dtSODate").value;
        let date2 = document.getElementById("dtSODate2").value;
        date1 = templateObject.dateFormat(date1);
        date2 = templateObject.dateFormat(date2);
        var endTime = new Date(date2 + " " + document.getElementById("tActualEndTime").value + ':00');
        var startTime = new Date(date1 + " " + document.getElementById("tActualStartTime").value + ':00');
        if (endTime > startTime) {
            let hours = parseFloat(templateObject.diff_hours(endTime, startTime));
            document.getElementById('txtActualHoursSpent').value = templateObject.timeFormat(hours) || "";
        } else {}
    },
    'submit #appointmentOptions': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        event.preventDefault();

        let showSat = "F";
        let showSun = "F";
        if ($('#showSaturday').is(':checked')) {
            showSat = "T";
        }

        if ($('#showSunday').is(':checked')) {
            showSun = "T";
        }
        let settingID = "";
        let templateObject = Template.instance();
        var erpGet = erpDb();
        let showTimeFrom = $('#hoursFrom').val() || '08:00';
        let showTimeTo = $('#hoursTo').val() || '17:00';
        let defaultTime = $('#defaultTime').val().split(" ")[0] || '2';
        let showTimeIn = $('#showTimeIn').val().split(" ")[0] || '1';
        let defaultProduct = $('#productlist').children("option:selected").text() || "";
        let defaultProductID = $('#productlist').children("option:selected").val() || "";
        let date = new Date('2021-03-25 ' + showTimeTo);
        let chargeTime = $('#chargeTime').val().split(" ")[0];
        showTimeTo = date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
        let appointmentService = new AppointmentService();

        let objectData = "";
        objectData = {
            Name: "VS1_UpdateCompPref",
            Params: {
                CloudUserName: erpGet.ERPUsername,
                CloudPassword: erpGet.ERPPassword,
                CompanyPreferenceList: [{
                    "Name": "ShowSaturdayinApptCalendar",
                    "FieldValue": showSat
                }, {
                    "Name": "ShowSundayinApptCalendar",
                    "FieldValue": showSun
                }, {
                    "Name": "ApptStartTime",
                    "FieldValue": showTimeFrom
                }, {
                    "Name": "ApptEndTime",
                    "FieldValue": showTimeTo
                }, {
                    "Name": "DefaultApptDuration",
                    "FieldValue": defaultTime
                }, {
                    "Name": "ShowApptDurationin",
                    "FieldValue": showTimeIn
                }, {
                    "Name": "DefaultServiceProductID",
                    "FieldValue": defaultProductID
                }, {
                    "Name": "DefaultServiceProduct",
                    "FieldValue": defaultProduct
                }, {
                    "Name": "MinimumChargeAppointmentTime",
                    "FieldValue": chargeTime
                }]
            }
        };

        var myString = '"JsonIn"' + ":" + JSON.stringify(objectData);
        var oPost = new XMLHttpRequest();
        oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ":" + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_UpdateCompPref"', true);
        oPost.setRequestHeader("database", erpGet.ERPDatabase);
        oPost.setRequestHeader("username", erpGet.ERPUsername);
        oPost.setRequestHeader("password", erpGet.ERPPassword);
        oPost.setRequestHeader("Accept", "application/json");
        oPost.setRequestHeader("Accept", "application/html");
        oPost.setRequestHeader("Content-type", "application/json");
        // let objDataSave = '"JsonIn"' + ":" + JSON.stringify(selectClient);
        oPost.send(myString);

        oPost.onreadystatechange = function() {
                if (oPost.readyState == 4 && oPost.status == 200) {
                    var myArrResponse = JSON.parse(oPost.responseText);
                    if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                        sideBarService.getGlobalSettings().then(function(dataAppointmentExtra) {
                            addVS1Data('TERPPreferenceExtra', JSON.stringify(dataAppointmentExtra)).then(function(datareturn) {
                                //window.open("/appointments", '_self');
                            }).catch(function(err) {
                                //window.open("/appointments", '_self');
                            });
                        }).catch(function(err) {
                            //window.open("/appointments", '_self');
                        });

                        sideBarService.getGlobalSettings().then(function(dataAppointment) {
                            addVS1Data("TERPPreference", JSON.stringify(dataAppointment)).then(function(datareturn) {
                                window.open("/appointments", '_self');
                            }).catch(function(err) {
                                window.open("/appointments", '_self');
                            });
                        }).catch(function(err) {
                            window.open("/appointments", '_self');
                        });

                    } else {
                        $('.modal-backdrop').css('display', 'none');
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oops...',
                            text: myArrResponse.ProcessLog.ResponseStatus,
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === 'cancel') {}
                        });
                    }

                } else if (oPost.readyState == 4 && oPost.status == 403) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {} else if (result.dismiss === 'cancel') {}
                    });
                } else if (oPost.readyState == 4 && oPost.status == 406) {
                    $('.fullScreenSpin').css('display', 'none');
                    var ErrorResponse = oPost.getResponseHeader('errormessage');
                    var segError = ErrorResponse.split(":");

                    if ((segError[1]) == ' "Unable to lock object') {

                        swal({
                            title: 'Oops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === 'cancel') {}
                        });
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {} else if (result.dismiss === 'cancel') {}
                        });
                    }

                } else if (oPost.readyState == "") {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {} else if (result.dismiss === 'cancel') {}
                    });
                }

            }
            // appointmentService.saveAppointmentPreferences(objectData).then(function (data) {
            //     $('.fullScreenSpin').css('display', 'none');
            //     //window.open("/appointments", '_self');
            //     sideBarService.getAllAppointmentPredList().then(function (data) {
            //         addVS1Data('TAppointmentPreferences', JSON.stringify(data)).then(function (datareturn) {
            //             window.open("/appointments", '_self');
            //         }).catch(function (err) {
            //             window.open("/appointments", '_self');
            //         });
            //     }).catch(function (err) {
            //         window.open("/appointments", '_self');
            //     });
            // }).catch(function (err) {
            //     $('.fullScreenSpin').css('display', 'none');
            // });
    },
    'click #btnHold span': function(event) {
        if (startAndStopAppointmentOnly == true) {
            swal({
                title: 'Oops...',
                text: 'You do not have access to put appointments "On Hold"',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((results) => {
                if (results.value) {} else if (results.dismiss === 'cancel') {}
            });
        }
    },
    'click #btnDeleteDisbale span': function(event) {
        swal({
            title: 'Oops...',
            text: "You don't have access to delete appointment",
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK'
        }).then((results) => {
            if (results.value) {} else if (results.dismiss === 'cancel') {}
        });
    },
    'click #btnOptionsDisable span': function(event) {
        swal({
            title: 'Oops...',
            text: "You don't have access to appointment options",
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK'
        }).then((results) => {
            if (results.value) {} else if (results.dismiss === 'cancel') {}
        });
    },
    'click .btnPauseJob': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        templateObject = Template.instance();
        let appointmentService = new AppointmentService();
        var appointmentData = templateObject.appointmentrecords.get();
        let toUpdateLogID = templateObject.toupdatelogid.get();
        var result = appointmentData.filter(apmt => {
            return apmt.id == $('#updateID').val()
        });
        let toUpdateID = "";
        if (result.length > 0) {
            let type = "Break";
            if ($('#break').is(":checked")) {
                type = $('#break').val();
            } else if ($('#lunch').is(":checked")) {
                type = $('#lunch').val();
            } else if ($('#purchase').is(":checked")) {
                type = $('#purchase').val();
            } else {
                swal({
                    title: 'Please Select Option',
                    text: 'Please select Break, Lunch or Purchase Option',
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((results) => {
                    if (results.value) {} else if (results.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
                return false;
            }
            let date = new Date();
            let startTime = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
            let endTime = "";
            let startTime1 = result[0].aStartTime;
            let desc = $('#txtpause-notes').val() || "";
            if (startTime1 == "") {
                swal("Please note", "You can't pause a job that hasn't been started", 'info');
                $('.fullScreenSpin').css('display', 'none');
            } else if (startTime != "") {
                let timeLog = [];
                let obj = {
                    StartDatetime: startTime,
                    EndDatetime: endTime,
                    Description: desc
                };
                if (obj.StartDatetime != "" && obj.EndDatetime != "") {
                    timeLog.push(obj)
                } else {
                    timeLog = "";
                }

                let objectData = "";
                objectData = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        AppointID: parseInt(result[0].id),
                        StartDatetime: obj.StartDatetime,
                        EndDatetime: obj.EndDatetime,
                        Description: type + ":" + obj.Description
                    }
                };

                appointmentService.saveTimeLog(objectData).then(function(data) {
                    if (result[0].timelog != "") {
                        if (Array.isArray(result[0].timelog) && result[0].timelog != "") {
                            toUpdateID = result[0].timelog[result[0].timelog.length - 1].fields.ID;
                        } else {
                            toUpdateID = result[0].timelog.fields.ID;
                        }
                    } else {
                        toUpdateID = toUpdateLogID;
                    };
                    let endTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                    if (toUpdateID != "") {
                        objectData = {
                            type: "TAppointmentsTimeLog",
                            fields: {
                                ID: toUpdateID,
                                EndDatetime: endTime1,
                            }
                        };

                        let objectData1 = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(result[0].id),
                                Othertxt: "Paused"
                            }
                        };

                        appointmentService.saveTimeLog(objectData).then(function(data) {
                            appointmentService.saveAppointment(objectData1).then(function(data1) {
                                sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                    addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                        // window.open("/appointments", '_self');
                                        $('.fullScreenSpin').css('display', 'none');
                                    }).catch(function(err) {
                                        // window.open("/appointments", '_self');
                                        $('.fullScreenSpin').css('display', 'none');
                                    })
                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                    // window.open("/appointments", '_self');
                                })
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });

                        }).catch(function(err) {
                            swal({
                                title: 'Oops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) { if (err === checkResponseError) { window.open('/', '_self'); } } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    } else {
                        swal("Please note", "You can't pause a job that has been ended, start the Job again to pause it.", 'info');
                    }
                }).catch(function(err) {
                    swal({
                        title: 'Oops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) { if (err === checkResponseError) { window.open('/', '_self'); } } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            }
        } else {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Oops...',
                text: "This Appointment hasn't been started. Please Save and then Start your Appointment before continuing.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            })
        }
    },
    'change #lunch': function(event) {
        $('#break').prop('checked', false);
        $('#purchase').prop('checked', false);
    },
    'change #break': function(event) {
        $('#lunch').prop('checked', false);
        $('#purchase').prop('checked', false);
    },
    'change #purchase': function(event) {
        $('#break').prop('checked', false);
        $('#lunch').prop('checked', false);
    },
    'click #btnCopyAppointment': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        var frmAppointment = $("#frmAppointment")[0];
        templateObject = Template.instance();
        let appointmentService = new AppointmentService();
        var appointmentData = templateObject.appointmentrecords.get();
        let updateID = $('#updateID').val() || 0;

        event.preventDefault();
        if (updateID != 0) {
            let aStartDate = "";
            let aEndDate = "";
            let clientname = $('#customer').val() || "";
            let clientmobile = $('#mobile').val() || "0";
            let contact = $('#phone').val() || "0";
            let startTime = $('#startTime').val() || "";
            let endTime = $('#endTime').val() || "";
            let state = $('#state').val() || "";
            let country = $('#country').val() || "";
            let street = $('#address').val() || "";
            let zip = $('#zip').val() || "";
            let suburb = $('#suburb').val() || "";
            var endDateGet = new Date($("#startDate").datepicker("getDate"));
            var startdateGet = new Date($("#startDate").datepicker("getDate"));
            let startDate = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
            let endDate = endDateGet.getFullYear() + "-" + ("0" + (endDateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + endDateGet.getDate()).slice(-2);
            let employeeName = $('#employee_name').val().trim() || "";
            let id = "0";
            let notes = $('#txtNotes').val() || " ";
            let selectedProduct = $('#product-list').val() || "";
            let status = "Not Converted";
            // if (aStartTime != "" && aEndDate == "") {
            //     aEndDate = aStartDate;
            // }
            let obj = {};
            let date = new Date();
            let objectData = "";
            if (id == "0") {
                objectData = {
                    type: "TAppointmentEx",
                    fields: {
                        ClientName: clientname,
                        Mobile: clientmobile,
                        Phone: contact,
                        StartTime: startDate + " " + startTime,
                        EndTime: endDate + " " + endTime,
                        Street: street,
                        Suburb: suburb,
                        State: state,
                        Postcode: zip,
                        Country: country,
                        TrainerName: employeeName,
                        Notes: notes,
                        ProductDesc: selectedProduct,
                        Status: status
                    }
                };

                appointmentService.saveAppointment(objectData).then(function(data) {
                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                        addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                            window.open("/appointments", '_self');
                        }).catch(function(err) {
                            window.open("/appointments", '_self');
                        });
                    }).catch(function(err) {
                        window.open("/appointments", '_self');
                    });
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    })
                });
            }
        } else {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Invalid Appointment',
                text: "You Can't Copy An Invalid Appointment, Create a New One Instead",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok'
            })
        }
    },
    "submit form#frmAppointment": async function(event) {
        $(".fullScreenSpin").css("display", "inline-block");
        event.preventDefault();
        /*
            if (createAppointment == false) {
                $('.modal-backdrop').css('display', 'none');
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Oops...',
                    text: "You don't have access to create a new Appointment",
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {}
                    else if (result.dismiss === 'cancel') {}
                });
                return false;
            } */

        $("#btnselProductFees").trigger("click");
        var frmAppointment = $("#frmAppointment")[0];
        templateObject = Template.instance();
        let appointmentService = new AppointmentService();
        let contactService = new ContactService();
        var appointmentData = templateObject.appointmentrecords.get();
        let updateID = $("#updateID").val() || 0;
        let paused = "";
        let result = "";

        var formData = new FormData(frmAppointment);
        let aStartDate = "";
        let aEndDate = "";
        let savedStartDate = $("#aStartDate").val() || moment().format("YYYY-MM-DD");
        let clientname = formData.get("customer") || "";
        // const itl = templateObject.itl.get();
        let clientmobile = $("#mobile").val() ? $("#mobile").val() : "0";
        // let clientmobile = formData.get('mobile') || '0';
        let contact = formData.get("phone") || "0";
        let startTime = $("#startTime").val() + ":00" || "";
        let endTime = $("#endTime").val() + ":00" || "";
        let aStartTime = $("#tActualStartTime").val() || "";
        let aEndTime = $("#tActualEndTime").val() || "";
        let state = formData.get("state") || "";
        let country = formData.get("country") || "";
        let street = formData.get("address") || "";
        let zip = formData.get("zip") || "";
        let suburb = formData.get("suburb") || "";
        var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
        var endDateGet = new Date($("#dtSODate2").datepicker("getDate"));
        let startDate = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
        let endDate = endDateGet.getFullYear() + "-" + ("0" + (endDateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + endDateGet.getDate()).slice(-2);
        let employeeName = formData.get("employee_name").trim() || "";
        let id = formData.get("updateID") || "0";
        let notes = formData.get("txtNotes") || " ";
        // let selectedProduct = [];
        // let isAnySelected = $("input[name='appointment-products-checks']")
        //   .map(function () {
        //     return this.checked;
        //   })
        //   .toArray()
        //   .some((value) => value === true);
        // if (isAnySelected) {
        //   const selectedProducts = $(
        //     "input[name='appointment-products-checks']:checked"
        //   )
        //     .map(function () {
        //       return $(this).attr("id");
        //     })
        //     .toArray();
        //   if (selectedProducts.length !== 0) {
        //     selectedProduct.push($("#product-list").val());
        //     selectedProducts.map((item) => {
        //       selectedProduct.push(item.split("x")[1]);
        //     });
        //   }
        // } else {
        //   selectedProduct.push($("#product-list").val());
        // }
        let selectedProduct = $("#product-list").val() || "";
        let selectedExtraProduct = templateObject.productFees.get() || "";
        let hourlyRate = "";
        let status = "Not Converted";
        let uploadedItems = templateObject.uploadedFiles.get();
        // $(".fullScreenSpin").css("display", "inline-block");
        if (aStartTime != "") {
            aStartDate = savedStartDate + " " + aStartTime;
        } else {
            aStartDate = "";
        }

        if (aEndTime != "") {
            aEndDate = moment().format("YYYY-MM-DD") + " " + aEndTime;
        } else {
            aEndDate = "";
        }
        // if (aStartTime != "" && aEndDate == "") {
        //     aEndDate = aStartDate;
        // }
        let obj = {};
        let date = new Date();
        if (updateID) {
            result = appointmentData.filter((apmt) => {
                return apmt.id == $("#updateID").val();
            });
            hourlyRate = result[0].rate;
            if (result[0].aStartTime == "" && $("#tActualStartTime").val() != "") {
                obj = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        appointID: updateID,
                        StartDatetime: aStartDate,
                        EndDatetime: "",
                        Description: "Job Started",
                    },
                };
            } else if (result[0].aStartTime != "" && result[0].aEndTime == "" && $("#tActualEndTime").val() != "") {
                let startTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                obj = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        appointID: updateID,
                        StartDatetime: aStartDate,
                        EndDatetime: aEndDate,
                        Description: "Job Completed",
                    },
                };
            } else if (result[0].aEndTime != "") {
                aEndDate = moment().format("YYYY-MM-DD") + " " + aEndTime;
            }
        } else {
            if ($("#tActualStartTime").val() != "" && $("#tActualEndTime").val() != "") {
                obj = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        appointID: "",
                        StartDatetime: aStartDate,
                        EndDatetime: aEndDate,
                        Description: "Job Completed",
                    },
                };
            } else if ($("#tActualStartTime").val() != "") {
                obj = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        appointID: "",
                        StartDatetime: aStartDate,
                        EndDatetime: "",
                        Description: "Job Started",
                    },
                };
            }
        }

        let objectData = "";
        const messageSid = localStorage.getItem("smsId") || "";
        if (createAppointment == false) {
            if (id == "0") {
                $(".modal-backdrop").css("display", "none");
                $(".fullScreenSpin").css("display", "none");
                swal({
                    title: "Oops...",
                    text: "You don't have access to create a new Appointment",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.value) {} else if (result.dismiss === "cancel") {}
                });
                return false;
            } else {
                objectData = {
                    type: "TAppointmentEx",
                    fields: {
                        Id: parseInt(id),
                        ClientName: clientname,
                        Mobile: clientmobile,
                        Phone: contact,
                        StartTime: startDate + " " + startTime,
                        EndTime: endDate + " " + endTime,
                        FeedbackNotes: notes,
                        Street: street,
                        Suburb: suburb,
                        State: state,
                        Postcode: zip,
                        Country: country,
                        Actual_StartTime: aStartDate,
                        Actual_EndTime: aEndDate,
                        // TrainerName: employeeName,
                        Notes: notes,
                        ProductDesc: selectedProduct,
                        ExtraProducts: selectedExtraProduct,
                        Attachments: uploadedItems,
                        Status: status,
                        CUSTFLD12: messageSid || "",
                        CUSTFLD13: !!messageSid ? "Yes" : "No",
                        //   CustomerEmail: customerEmail,
                        //   UserEmail: userEmail
                    },
                };
                // templateObject.updateEvents(objectData,true,false)
                // $(".fullScreenSpin").css("display", "none");
                appointmentService.saveAppointment(objectData).then(function(data) {
                    let id = data.fields.ID;
                    let toUpdateID = "";
                    let updateData = "";
                    if (Object.keys(obj).length > 0) {
                        obj.fields.appointID = id;
                        appointmentService.saveTimeLog(obj).then(function(data1) {
                            if (obj.fields.Description == "Job Completed") {
                                let endTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                                if (result.length > 0) {
                                    if (Array.isArray(result[0].timelog) && result[0].timelog != "") {
                                        toUpdateID = result[0].timelog[result[0].timelog.length - 1].fields.ID;
                                    } else if (result[0].timelog != "") {
                                        toUpdateID = result[0].timelog.fields.ID;
                                    }
                                }
                                if (toUpdateID != "") {
                                    updateData = {
                                        type: "TAppointmentsTimeLog",
                                        fields: {
                                            ID: toUpdateID,
                                            EndDatetime: endTime1,
                                        },
                                    };
                                }
                                if (Object.keys(updateData).length > 0) {
                                    appointmentService.saveTimeLog(updateData).then(function(data) {
                                            sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                                addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                                        let data = "";
                                                        data = {
                                                            type: "TTimeSheetEntry",
                                                            fields: {
                                                                // "EntryDate":"2020-10-12 12:39:14",
                                                                TimeSheet: [{
                                                                    type: "TTimeSheet",
                                                                    fields: {
                                                                        EmployeeName: employeeName || "",
                                                                        // HourlyRate:50,
                                                                        LabourCost: parseFloat(hourlyRate) || 1,
                                                                        HourlyRate: parseFloat(hourlyRate) || 1,
                                                                        ServiceName: selectedProduct || "",
                                                                        Job: clientname || "",
                                                                        InvoiceNotes: "completed",
                                                                        Allowedit: true,
                                                                        // ChargeRate: 100,
                                                                        Hours: parseFloat($("#txtActualHoursSpent").val()) || 1,
                                                                        // OverheadRate: 90,
                                                                        Job: clientname || "",
                                                                        StartTime: aStartDate,
                                                                        EndTime: aEndDate,
                                                                        // ServiceName: "Test"|| '',
                                                                        TimeSheetClassName: "Default" || "",
                                                                        Notes: notes || "",
                                                                        // EntryDate: accountdesc|| ''
                                                                    },
                                                                }, ],
                                                                TypeName: "Payroll",
                                                                WhoEntered: localStorage.getItem("mySessionEmployee") || "",
                                                            },
                                                        };
                                                        contactService.saveTimeSheet(data).then(function(dataObj) {
                                                            sideBarService.getAllTimeSheetList().then(function(data) {
                                                                addVS1Data("TTimeSheet",JSON.stringify(data));
                                                                setTimeout(function() {
                                                                    window.open("/appointments","_self");
                                                                }, 500);
                                                            });
                                                        }).catch(function(err) {
                                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                                            } else {
                                                                window.open("/appointments", "_self");
                                                            }
                                                        });
                                                }).catch(function(err) {
                                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                                    } else {
                                                        window.open("/appointments", "_self");
                                                    }
                                                });
                                            }).catch(function(err) {
                                                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                    window.open(localStorage.getItem("appt_historypage"), "_self");
                                                } else {
                                                    window.open("/appointments", "_self");
                                                }
                                            });
                                        }).catch(function(err) {
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        });
                                } else {
                                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                        addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                                let data = "";
                                                data = {
                                                    type: "TTimeSheetEntry",
                                                    fields: {
                                                        // "EntryDate":"2020-10-12 12:39:14",
                                                        TimeSheet: [{
                                                            type: "TTimeSheet",
                                                            fields: {
                                                                EmployeeName: employeeName || "",
                                                                // HourlyRate:50,
                                                                LabourCost: parseFloat(hourlyRate) || 1,
                                                                HourlyRate: parseFloat(hourlyRate) || 1,
                                                                ServiceName: selectedProduct || "",
                                                                Job: clientname || "",
                                                                Allowedit: true,
                                                                InvoiceNotes: "completed",
                                                                // ChargeRate: 100,
                                                                Hours: parseFloat(
                                                                    $("#txtActualHoursSpent").val()
                                                                ) || 1,
                                                                // OverheadRate: 90,
                                                                Job: clientname || "",
                                                                StartTime: aStartDate,
                                                                EndTime: aEndDate,
                                                                // ServiceName: "Test"|| '',
                                                                TimeSheetClassName: "Default" || "",
                                                                Notes: notes || "",
                                                                // EntryDate: accountdesc|| ''
                                                            },
                                                        }, ],
                                                        TypeName: "Payroll",
                                                        WhoEntered: localStorage.getItem("mySessionEmployee") || "",
                                                    },
                                                };
                                            contactService.saveTimeSheet(data).then(function(dataObj) {
                                                sideBarService.getAllTimeSheetList().then(function(data) {
                                                    addVS1Data("TTimeSheet",JSON.stringify(data));
                                                    setTimeout(function() {
                                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                                        } else {
                                                            window.open("/appointments", "_self");
                                                        }
                                                    }, 500);
                                                });
                                            }).catch(function(err) {
                                                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                    window.open(localStorage.getItem("appt_historypage"), "_self");
                                                } else {
                                                    window.open("/appointments", "_self");
                                                }
                                            });
                                        }).catch(function(err) {
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        });
                                    }).catch(function(err) {
                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                        } else {
                                            window.open("/appointments", "_self");
                                        }
                                    });
                                }
                            } else {
                                sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                    addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                        setTimeout(function() {
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        }, 500);
                                    }).catch(function(err) {
                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                        } else {
                                            window.open("/appointments", "_self");
                                        }
                                    });
                                }).catch(function(err) {
                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                    } else {
                                        window.open("/appointments", "_self");
                                    }
                                });
                            }
                        }).catch(function(err) {
                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                window.open(localStorage.getItem("appt_historypage"), "_self");
                            } else {
                                window.open("/appointments", "_self");
                            }
                        });
                    } else {
                        //return false;
                        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                            addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                setTimeout(function() {
                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                    } else {
                                        window.open("/appointments", "_self");
                                    }
                                }, 500);
                            }).catch(function(err) {
                                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                    window.open(localStorage.getItem("appt_historypage"), "_self");
                                } else {
                                    window.open("/appointments", "_self");
                                }
                            });
                        }).catch(function(err) {
                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                window.open(localStorage.getItem("appt_historypage"), "_self");
                            } else {
                                window.open("/appointments", "_self");
                            }
                        });
                    }
                }).catch(function(err) {
                    $(".fullScreenSpin").css("display", "none");
                    swal({
                        title: "Oops...",
                        text: err,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try Again",
                    });
                });
            }
        } else {
            if (id == "0") {
                objectData = {
                    type: "TAppointmentEx",
                    fields: {
                        ClientName: clientname,
                        Mobile: clientmobile,
                        Phone: contact,
                        StartTime: startDate + " " + startTime,
                        EndTime: endDate + " " + endTime,
                        Street: street,
                        Suburb: suburb,
                        State: state,
                        Postcode: zip,
                        Country: country,
                        Actual_StartTime: aStartDate,
                        Actual_EndTime: aEndDate,
                        TrainerName: employeeName,
                        Notes: notes,
                        ProductDesc: selectedProduct,
                        ExtraProducts: selectedExtraProduct,
                        Attachments: uploadedItems,
                        Status: status,
                        CUSTFLD12: messageSid || "",
                        CUSTFLD13: !!messageSid ? "Yes" : "No",
                    },
                };
            } else {
                objectData = {
                    type: "TAppointmentEx",
                    fields: {
                        Id: parseInt(id),
                        ClientName: clientname,
                        Mobile: clientmobile,
                        Phone: contact,
                        StartTime: startDate + " " + startTime,
                        EndTime: endDate + " " + endTime,
                        FeedbackNotes: notes,
                        Street: street,
                        Suburb: suburb,
                        State: state,
                        Postcode: zip,
                        Country: country,
                        Actual_StartTime: aStartDate,
                        Actual_EndTime: aEndDate,
                        TrainerName: employeeName,
                        Notes: notes,
                        ProductDesc: selectedProduct,
                        ExtraProducts: selectedExtraProduct,
                        Attachments: uploadedItems,
                        Status: status,
                        CUSTFLD12: messageSid || "",
                        CUSTFLD13: !!messageSid ? "Yes" : "No",
                    },
                };
            }

            let url = new URL(window.location.href);
            let logid = url.searchParams.get("logid");

            if (logid != null && logid > 0) {
                obj = {
                    type: "TAppointmentsTimeLog",
                    fields: {
                        appointID: updateID,
                        ID: logid,
                        StartDatetime: aStartDate,
                        EndDatetime: aEndDate
                    },
                };

                if ($("#tActualStartTime").val() != "" && $("#tActualEndTime").val() != "") {
                    obj.fields.Description = "Job Completed";
                } else {
                    obj.fields.Description = "Job Started";
                }
                templateObject.updateTimeLogs(obj)
                $(".fullScreenSpin").css("display", "none");
                // appointmentService.saveTimeLog(obj).then(function(data) {
                //     sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                //         addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                //             if (obj.fields.Description == "Job Completed") {
                //                 let data = "";
                //                 data = {
                //                     type: "TTimeSheetEntry",
                //                     fields: {
                //                         // "EntryDate":"2020-10-12 12:39:14",
                //                         TimeSheet: [{
                //                             type: "TTimeSheet",
                //                             fields: {
                //                                 EmployeeName: employeeName || "",
                //                                 // HourlyRate:50,
                //                                 LabourCost: parseFloat(hourlyRate) || 1,
                //                                 HourlyRate: parseFloat(hourlyRate) || 1,
                //                                 ServiceName: selectedProduct || "",
                //                                 Job: clientname || "",
                //                                 InvoiceNotes: "completed",
                //                                 Allowedit: true,
                //                                 // ChargeRate: 100,
                //                                 Hours: parseFloat(
                //                                     $("#txtActualHoursSpent").val()
                //                                 ) || 1,
                //                                 // OverheadRate: 90,
                //                                 Job: clientname || "",
                //                                 StartTime: aStartDate,
                //                                 EndTime: aEndDate,
                //                                 // ServiceName: "Test"|| '',

                //                                 TimeSheetClassName: "Default" || "",
                //                                 Notes: notes || "",
                //                                 // EntryDate: accountdesc|| ''
                //                             },
                //                         }, ],
                //                         TypeName: "Payroll",
                //                         WhoEntered: localStorage.getItem("mySessionEmployee") || "",
                //                     },
                //                 };
                //                 contactService.saveTimeSheet(data).then(function(dataObj) {
                //                     sideBarService.getAllTimeSheetList().then(function(data) {
                //                             addVS1Data("TTimeSheet",JSON.stringify(data));
                //                             setTimeout(function() {
                //                                 if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                //                                     window.open(localStorage.getItem("appt_historypage"), "_self");
                //                                 } else {
                //                                     window.open("/appointments", "_self");
                //                                 }
                //                             }, 500);
                //                         });
                //                     }).catch(function(err) {
                //                         if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                //                             window.open(localStorage.getItem("appt_historypage"), "_self");
                //                         } else {
                //                             window.open("/appointments", "_self");
                //                         }
                //                     });
                //             } else {
                //                 if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                //                     window.open(localStorage.getItem("appt_historypage"), "_self");
                //                 } else {
                //                     window.open("/appointments", "_self");
                //                 }
                //             }
                //         }).catch(function(err) {
                //             if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                //                 window.open(localStorage.getItem("appt_historypage"), "_self");
                //             } else {
                //                 window.open("/appointments", "_self");
                //             }
                //         });
                //     }).catch(function(err) {
                //         if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                //             window.open(localStorage.getItem("appt_historypage"), "_self");
                //         } else {
                //             window.open("/appointments", "_self");
                //         }
                //     });
                // }).catch(function(err) {
                //     if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                //         window.open(localStorage.getItem("appt_historypage"), "_self");
                //     } else {
                //         window.open("/appointments", "_self");
                //     }
                // });
            } else {
                templateObject.updateEvents(objectData,true,false)
                $(".fullScreenSpin").css("display", "none");
                appointmentService.saveAppointment(objectData).then(function(data) {
                    let id = data.fields.ID;
                    let toUpdateID = "";
                    let updateData = "";
                    if (Object.keys(obj).length > 0) {
                        obj.fields.appointID = id;
                        appointmentService.saveTimeLog(obj).then(function(data1) {
                            if (obj.fields.Description == "Job Completed") {
                                let endTime1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                                if (result.length > 0) {
                                    if (Array.isArray(result[0].timelog) && result[0].timelog != "" ) {
                                        toUpdateID = result[0].timelog[result[0].timelog.length - 1].fields.ID;
                                    } else if (result[0].timelog != "") {
                                        toUpdateID = result[0].timelog.fields.ID;
                                    }
                                }
                                if (toUpdateID != "") {
                                    updateData = {
                                        type: "TAppointmentsTimeLog",
                                        fields: {
                                            ID: toUpdateID,
                                            EndDatetime: endTime1,
                                        },
                                    };
                                }
                                if (Object.keys(updateData).length > 0) {
                                    appointmentService.saveTimeLog(updateData).then(function(data) {
                                        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                            addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                                    let data = "";
                                                    data = {
                                                        type: "TTimeSheetEntry",
                                                        fields: {
                                                            // "EntryDate":"2020-10-12 12:39:14",
                                                            TimeSheet: [{
                                                                type: "TTimeSheet",
                                                                fields: {
                                                                    EmployeeName: employeeName || "",
                                                                    // HourlyRate:50,
                                                                    LabourCost: parseFloat(hourlyRate) || 1,
                                                                    HourlyRate: parseFloat(hourlyRate) || 1,
                                                                    ServiceName: selectedProduct || "",
                                                                    Job: clientname || "",
                                                                    InvoiceNotes: "completed",
                                                                    Allowedit: true,
                                                                    // ChargeRate: 100,
                                                                    Hours: parseFloat($("#txtActualHoursSpent").val()) || 1,
                                                                    // OverheadRate: 90,
                                                                    Job: clientname || "",
                                                                    StartTime: aStartDate,
                                                                    EndTime: aEndDate,
                                                                    // ServiceName: "Test"|| '',
                                                                    TimeSheetClassName: "Default" || "",
                                                                    Notes: notes || "",
                                                                    // EntryDate: accountdesc|| ''
                                                                },
                                                            }, ],
                                                            TypeName: "Payroll",
                                                            WhoEntered: localStorage.getItem("mySessionEmployee") || "",
                                                        },
                                                    };
                                                    contactService.saveTimeSheet(data).then(function(dataObj) {
                                                        sideBarService.getAllTimeSheetList().then(function(data) {
                                                            addVS1Data("TTimeSheet",JSON.stringify(data));
                                                            setTimeout(function() {
                                                                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                                    window.open(localStorage.getItem("appt_historypage"), "_self");
                                                                } else {
                                                                    window.open("/appointments", "_self");
                                                                }
                                                            }, 500);
                                                        });
                                                    }).catch(function(err) {
                                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                                        } else {
                                                            window.open("/appointments", "_self");
                                                        }
                                                    });
                                                }).catch(function(err) {
                                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                                    } else {
                                                        window.open("/appointments", "_self");
                                                    }
                                                });
                                            }).catch(function(err) {
                                                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                    window.open(localStorage.getItem("appt_historypage"), "_self");
                                                } else {
                                                    window.open("/appointments", "_self");
                                                }
                                            });
                                        }).catch(function(err) {
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        });
                                } else {
                                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                            addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                                    let data = "";
                                                    data = {
                                                        type: "TTimeSheetEntry",
                                                        fields: {
                                                            // "EntryDate":"2020-10-12 12:39:14",
                                                            TimeSheet: [{
                                                                type: "TTimeSheet",
                                                                fields: {
                                                                    EmployeeName: employeeName || "",
                                                                    // HourlyRate:50,
                                                                    LabourCost: parseFloat(hourlyRate) || 1,
                                                                    HourlyRate: parseFloat(hourlyRate) || 1,
                                                                    ServiceName: selectedProduct || "",
                                                                    Job: clientname || "",
                                                                    Allowedit: true,
                                                                    InvoiceNotes: "completed",
                                                                    // ChargeRate: 100,
                                                                    Hours: parseFloat(
                                                                        $("#txtActualHoursSpent").val()
                                                                    ) || 1,
                                                                    // OverheadRate: 90,
                                                                    Job: clientname || "",
                                                                    StartTime: aStartDate,
                                                                    EndTime: aEndDate,
                                                                    // ServiceName: "Test"|| '',
                                                                    TimeSheetClassName: "Default" || "",
                                                                    Notes: notes || "",
                                                                    // EntryDate: accountdesc|| ''
                                                                },
                                                            }, ],
                                                            TypeName: "Payroll",
                                                            WhoEntered: localStorage.getItem("mySessionEmployee") || "",
                                                        },
                                                    };
                                                    contactService.saveTimeSheet(data).then(function(dataObj) {
                                                            sideBarService.getAllTimeSheetList().then(function(data) {
                                                                    addVS1Data("TTimeSheet",JSON.stringify(data));
                                                                    setTimeout(function() {
                                                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                                                        } else {
                                                                            window.open("/appointments", "_self");
                                                                        }
                                                                    }, 500);
                                                                });
                                                        }).catch(function(err) {
                                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                                            } else {
                                                                window.open("/appointments", "_self");
                                                            }
                                                        });
                                                }).catch(function(err) {
                                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                                    } else {
                                                        window.open("/appointments", "_self");
                                                    }
                                                });
                                        }).catch(function(err) {
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        });
                                }
                            } else {
                                sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                        addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                                setTimeout(function() {
                                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                                    } else {
                                                        window.open("/appointments", "_self");
                                                    }
                                                }, 500);
                                            }).catch(function(err) {
                                                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                    window.open(localStorage.getItem("appt_historypage"), "_self");
                                                } else {
                                                    window.open("/appointments", "_self");
                                                }
                                            });
                                    }).catch(function(err) {
                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                        } else {
                                            window.open("/appointments", "_self");
                                        }
                                    });
                            }
                        }).catch(function(err) {
                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                window.open(localStorage.getItem("appt_historypage"), "_self");
                            } else {
                                window.open("/appointments", "_self");
                            }
                        });
                    } else {
                        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                            addVS1Data("TAppointment", JSON.stringify(data)).then(function(datareturn) {
                                setTimeout(function() {
                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                    } else {
                                        window.open("/appointments", "_self");
                                    }
                                }, 500);
                            }).catch(function(err) {
                                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                    window.open(localStorage.getItem("appt_historypage"), "_self");
                                } else {
                                    window.open("/appointments", "_self");
                                }
                            });
                        }).catch(function(err) {
                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                window.open(localStorage.getItem("appt_historypage"), "_self");
                            } else {
                                window.open("/appointments", "_self");
                            }
                        });
                    }
                }).catch(function(err) {
                    $(".fullScreenSpin").css("display", "none");
                    swal({
                        title: "Oops...",
                        text: err,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try Again",
                    });
                });
            }
        }
    },
    'keyup .search': function(event) {
        var searchTerm = $(".search").val();
        var listItem = $('.results tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('");

        $.extend($.expr[":"], {
            'containsi': function(elem, i, match, array) {
                return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function(e) {
            $(this).attr('visible', 'false');
        });

        $(".results tbody tr:containsi('" + searchSplit + "')").each(function(e) {
            $(this).attr('visible', 'true');
        });

        var jobCount = $('.results tbody tr[visible="true"]').length;
        $('.counter').text(jobCount + ' items');

        if (jobCount == "0") {
            $('.no-result').show();
        } else {
            $('.no-result').hide();
        }
        if (searchTerm === "") {
            $(".results tbody tr").each(function(e) {
                $(this).attr('visible', 'true');
                $('.no-result').hide();
            });

            //setTimeout(function () {
            var rowCount = $('.results tbody tr').length;
            $('.counter').text(rowCount + ' items');
            //}, 500);
        }
    },
    'click #sidebarToggleAppointments': function(event) {
        var newnav = document.getElementById("colEmployeeList");
        if (window.getComputedStyle(newnav).display === "none") {
            document.getElementById("colEmployeeList").style.display = "block";
            document.getElementById("colCalendar").style.width = "calc(100% - 325px)";
        } else {
            document.getElementById("colEmployeeList").style.display = "none";
            document.getElementById("colCalendar").style.width = "100vw";
        }
    },
    'click #chkmyAppointments': function(event) {
    },
    'click .btn-auto-save': async function(event) {
        let templateObject = Template.instance();
        await templateObject.saveUpdatedEvents();
        FlowRouter.reload();
    },
    'click .chkServiceCard': function() {
        //  templateObject = Template.instance();
        //  let productFees = templateObject.productFees.get();
        //  let productFeesID = $(event.target).attr('id').split("-")[1];
        //  if ($(event.target).prop('checked') == true) {
        //      productFees.push(productFeesID);
        //  } else {
        //      productFees.splice(productFees.indexOf(productFeesID), 1);
        //  }
        //  templateObject.productFees.set(productFees);
    },
    'click #btnselProductFees': function(event) {
        templateObject = Template.instance();

        let productFees = "";
        const productCards = $(".chkServiceCard");
        Array.prototype.forEach.call(productCards, (product) => {
            if ($(product).prop('checked') == true) {
                let productFeesID = $(product).attr('id').split("-")[1];
                if (productFees == "") {
                    productFees = productFeesID;
                } else {
                    productFees += ":" + productFeesID;
                }
            }
        });

        if (productFees != "") {
            $(".addExtraProduct").removeClass("btn-primary").addClass("btn-success");
        } else {
            $(".addExtraProduct").removeClass("btn-success").addClass("btn-primary");
        }

        templateObject.productFees.set(productFees);
    },
    "click #btnEndAppointment": async function() {
        const templateObject = Template.instance();
        var appointmentData = templateObject.appointmentrecords.get();
        let id = $("#updateID").val();
        var result = appointmentData.filter((apmt) => {
            return apmt.id == id;
        });

        document.getElementById("tActualEndTime").value = moment().startOf("hour").format("HH") + ":" + moment().startOf("minute").format("mm");

        let date1 = document.getElementById("dtSODate").value;
        let date2 = document.getElementById("dtSODate2").value;
        date1 = templateObject.dateFormat(date1);
        date2 = templateObject.dateFormat(date2);
        var endTime = new Date(date2 + " " + document.getElementById("tActualEndTime").value + ":00");
        var startTime = new Date(date1 + " " + document.getElementById("tActualStartTime").value + ":00");
        document.getElementById("txtActualHoursSpent").value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
        document.getElementById("txtNotes").value = document.getElementById("txtNotes-1").value;

        //TODO: Stop Appointment SMS sent here
        const customerPhone = $("#mobile").val();
        const smsCustomer = $("#chkSMSCustomer").is(":checked");
        const smsUser = $("#chkSMSUser").is(":checked");
        const smsSettings = templateObject.defaultSMSSettings.get();
        let sendSMSRes = true;
        if ((smsCustomer || smsUser) && customerPhone != "0" && smsSettings.twilioAccountId) {
            sendSMSRes = await templateObject.sendSMSMessage("stop","+" + customerPhone.replace("+", ""));
            if (!sendSMSRes.success) {
                swal({
                    title: "Oops...",
                    text: sendSMSRes.message,
                    type: "error",
                    showCancelButton: false,
                    confirmButtonText: "Try again",
                }).then((result) => {
                    if (result.value) {
                        $("#startAppointmentModal").modal("hide");
                    }
                });
            } else {
                localStorage.setItem("smsId", sendSMSRes.sid);
                swal({
                    title: "SMS was sent successfully",
                    text: "SMS was sent successfully",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                });
                $("#btnCloseStopAppointmentModal").trigger("click");
                $("#btnAppointmentSubmit").click();
            }
        } else {
            $("#btnCloseStopAppointmentModal").trigger("click");
            $("#btnAppointmentSubmit").click();
        }
    },
    "click #btnCreateAppointmentRequest": function(event){
        $("#appointmentLeaveConfirmModal").modal("hide");
        $("#customerListModal").modal();
    },
    "click #btnCreateLeaveRequest": function(event){
        $("#appointmentLeaveConfirmModal").modal("hide");
        let currentEmployeeName = localStorage.getItem("mySessionEmployee") || "";
        $('#edtEmployeeName').val(currentEmployeeName)
		$('#newLeaveRequestModal').modal('show');
    },
    "click .lineProductName, keydown .lineProductName": function(event) {
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();
        // $("#selectProductID").val("");
        var productDataName = $(event.target).val() || "";
        if (event.pageX > offset.left + $earch.width() - 10) {
            // X button 16px wide?
            $("#productListModal2").modal("toggle");
            var targetID = $(event.target).closest("tr").attr("id");
            $("#selectLineID").val(targetID);
            setTimeout(function() {
                $("#tblInventory_filter .form-control-sm").focus();
                $("#tblInventory_filter .form-control-sm").val("");
                $("#tblInventory_filter .form-control-sm").trigger("input");

                var datatable = $("#tblInventory").DataTable();
                datatable.draw();
                $("#tblInventory_filter .form-control-sm").trigger("input");
            }, 500);
        } else {
            if (productDataName.replace(/\s/g, "") != "") {
                var itemId = $(event.target).attr("itemid");
                window.open("/productview?id=" + itemId, "_self");
            } else {
                $("#productListModal2").modal("toggle");
                var targetID = $(event.target).closest("tr").attr("id");
                $("#selectLineID").val(targetID);
            }
        }
    },
});

Template.calender.helpers({
    employeerecords: () => {
        return Template.instance().employeerecords.get().sort(function(a, b) {
            if (a.employeeName == 'NA') {
                return 1;
            } else if (b.employeeName == 'NA') {
                return -1;
            }
            return (a.employeeName.toUpperCase() > b.employeeName.toUpperCase()) ? 1 : -1;
        }).sort(function(a, b) {
            // return (a.employeeName.toUpperCase() > b.employeeName.toUpperCase());
            if (a.priority == "" || a.priority == "0") {
                return 1;
            } else if (b.priority == "" || b.priority == "0") {
                return -1;
            }
            return (parseInt(a.priority) > parseInt(b.priority)) ? 1 : -1;
        });
    },
    calendarOptions: () => {
        return Template.instance().calendarOptions.get();
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.productname == 'NA') {
                return 1;
            } else if (b.productname == 'NA') {
                return -1;
            }
            return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
        });
    },
    clientrecords: () => {
        return Template.instance().clientrecords.get();
    },
    customerRecord: () => {
        return Template.instance().customerRecord.get();
    },
    resourceAllocation: () => {
        return Template.instance().resourceAllocation.get();
    },
    resourceJobs: () => {
        return Template.instance().resourceJobs.get();
    },
    resourceDates: () => {
        return Template.instance().resourceDates.get();
    },
    appointmentrecords: () => {
        return Template.instance().appointmentrecords.get();
    },
    accessOnHold: () => {
        return Template.instance().createAppointment || false;
    },
    accessStartStopOnly: () => {
        return localStorage.getItem("CloudAppointmentStartStopAccessLevel") || false;
    },
    addAttachment: () => {
        return localStorage.getItem("CloudAppointmentAddAttachment") || false;
    },
    addNotes: () => {
        return localStorage.getItem("CloudAppointmentNotes") || false;
    },
    uploadedFiles: () => {
        return Template.instance().uploadedFiles.get();
    },
    attachmentCount: () => {
        return Template.instance().attachmentCount.get();
    },
    createnewappointment: () => {
        return Template.instance().createAppointment || false;
    },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
    isMobileDevices: () => {
        var isMobile = false;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});

Template.registerHelper('and', (a, b) => {
    return a && b;
});

openAppointModalDirectly = (leadid, templateObject, auto = false) => {
    let contactService = new ContactService();
    $("#frmAppointment")[0].reset();
    // templateObject.getAllProductData();
    $(".paused").hide();
    if (FlowRouter.current().queryParams.leadid) {
        contactService.getOneLeadDataEx(leadid).then(function(data) {
            // return;
            //$("#updateID").val("");
            let checkIncludeAllProducts = templateObject.includeAllProducts.get();
            let getAllEmployeeData = templateObject.employeerecords.get() || "";
            let getEmployeeID = templateObject.empID.get() || "";
            document.getElementById("employee_name").value = localStorage.getItem("mySessionEmployee");
            document.getElementById("customer").value = data.fields.ClientName;
            document.getElementById("phone").value = data.fields.Phone;
            document.getElementById("mobile").value = data.fields.Mobile;
            document.getElementById("state").value = data.fields.State;
            document.getElementById("country").value = data.fields.Country;
            document.getElementById("address").value = data.fields.Street.replace(/(?:\r\n|\r|\n)/g,", ");
            if (localStorage.getItem("CloudAppointmentNotes") == true) {
                document.getElementById("txtNotes").value = data.fields.Notes;
                document.getElementById("txtNotes-1").value = data.fields.Notes;
            }
            document.getElementById("suburb").value = data.fields.Suburb;
            document.getElementById("zip").value = data.fields.Postcode;
            if (auto == true) {
                let dateStart = getRegalTime();
                let dateEnd = new Date(dateStart.getTime() + 2 * 3600 * 1000);
                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                document.getElementById("startTime").value = startTime;
                document.getElementById("endTime").value = endTime;
            }
            if ($("#updateID").val() == "") {
                let appointmentService = new AppointmentService();
                getVS1Data("TAppointment").then(function(dataObject) {
                    if(dataObject.length == 0){
                        let appointmentService = new AppointmentService();
                        appointmentService.getAllAppointmentListCount().then(function(data) {
                            if (data.tappointmentex.length > 0) {
                                let max = 1;
                                for (let i = 0; i < data.tappointmentex.length; i++) {
                                    if (data.tappointmentex[i].Id > max) {
                                        max = data.tappointmentex[i].Id;
                                    }
                                }
                                document.getElementById("appID").value = max + 1;
                            } else {
                                document.getElementById("appID").value = 1;
                            }
                        });
                    }else{
                        let data = JSON.parse(dataObject[0].data);
                        if (data.tappointmentex.length > 0) {
                            let max = 1;
                            for (let i = 0; i < data.tappointmentex.length; i++) {
                                if (data.tappointmentex[i].Id > max) {
                                    max = data.tappointmentex[i].Id;
                                }
                            }
                            document.getElementById("appID").value = max + 1;
                        } else {
                            document.getElementById("appID").value = 1;
                        }
                    }
                })
                if (getEmployeeID != "") {
                    var filterEmpData = getAllEmployeeData.filter((empdData) => {
                        return empdData.id == getEmployeeID;
                    });
                    if (filterEmpData) {
                        if (filterEmpData[0].custFld8 == "false") {
                            templateObject.getAllSelectedProducts(getEmployeeID);
                        } else {
                            templateObject.getAllProductData();
                        }
                    } else {
                        templateObject.getAllProductData();
                    }
                }
            }
            $("#customerListModal").modal("hide");
            $("#event-modal").modal();
            setTimeout(() => {
                if (localStorage.getItem("smsCustomerAppt") == "false") {
                    $("#chkSMSCustomer").prop("checked", false);
                }
                if (localStorage.getItem("smsUserAppt") == "false") {
                    $("#chkSMSUser").prop("checked", false);
                }
                if (localStorage.getItem("emailCustomerAppt") == "false") {
                    $("#customerEmail").prop("checked", false);
                }
                if (localStorage.getItem("emailUserAppt") == "false") {
                    $("#userEmail").prop("checked", false);
                }
            }, 100);
        });
    } else if (FlowRouter.current().queryParams.customerid) {
        contactService.getOneCustomerDataEx(leadid).then((data) => {
            let checkIncludeAllProducts = templateObject.includeAllProducts.get();
            let getAllEmployeeData = templateObject.employeerecords.get() || "";
            let getEmployeeID = templateObject.empID.get() || "";
            document.getElementById("employee_name").value = localStorage.getItem("mySessionEmployee");
            document.getElementById("customer").value = data.fields.ClientName;
            document.getElementById("phone").value = data.fields.Phone;
            document.getElementById("mobile").value = data.fields.Mobile;
            document.getElementById("state").value = data.fields.State;
            document.getElementById("country").value = data.fields.Country;
            document.getElementById("address").value = data.fields.Street.replace(/(?:\r\n|\r|\n)/g,", ");
            if (localStorage.getItem("CloudAppointmentNotes") == true) {
                document.getElementById("txtNotes").value = data.fields.Notes;
                document.getElementById("txtNotes-1").value = data.fields.Notes;
            }
            document.getElementById("suburb").value = data.fields.Suburb;
            document.getElementById("zip").value = data.fields.Postcode;
            if (auto == true) {
                let dateStart = getRegalTime();
                let dateEnd = new Date(dateStart.getTime() + 2 * 3600 * 1000);
                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                document.getElementById("startTime").value = startTime;
                document.getElementById("endTime").value = endTime;
            }
            if ($("#updateID").val() == "") {
                getVS1Data("TAppointment").then(function(dataObject) {
                    if(dataObject.length == 0){
                        let appointmentService = new AppointmentService();
                        appointmentService.getAllAppointmentListCount().then(function(data) {
                            if (data.tappointmentex.length > 0) {
                                let max = 1;
                                for (let i = 0; i < data.tappointmentex.length; i++) {
                                    if (data.tappointmentex[i].Id > max) {
                                        max = data.tappointmentex[i].Id;
                                    }
                                }
                                document.getElementById("appID").value = max + 1;
                            } else {
                                document.getElementById("appID").value = 1;
                            }
                        });
                    }else{
                        let data = JSON.parse(dataObject[0].data);
                        if (data.tappointmentex.length > 0) {
                            let max = 1;
                            for (let i = 0; i < data.tappointmentex.length; i++) {
                                if (data.tappointmentex[i].Id > max) {
                                    max = data.tappointmentex[i].Id;
                                }
                            }
                            document.getElementById("appID").value = max + 1;
                        } else {
                            document.getElementById("appID").value = 1;
                        }
                    }
                })
                if (getEmployeeID != "") {
                    var filterEmpData = getAllEmployeeData.filter((empdData) => {
                        return empdData.id == getEmployeeID;
                    });
                    if (filterEmpData) {
                        if (filterEmpData[0].custFld8 == "false") {
                            templateObject.getAllSelectedProducts(getEmployeeID);
                        } else {
                            templateObject.getAllProductData();
                        }
                    } else {
                        templateObject.getAllProductData();
                    }
                }
            }
            $("#customerListModal").modal("hide");
            $("#event-modal").modal();
            setTimeout(() => {
                if (localStorage.getItem("smsCustomerAppt") == "false") {
                    $("#chkSMSCustomer").prop("checked", false);
                }
                if (localStorage.getItem("smsUserAppt") == "false") {
                    $("#chkSMSUser").prop("checked", false);
                }
                if (localStorage.getItem("emailCustomerAppt") == "false") {
                    $("#customerEmail").prop("checked", false);
                }
                if (localStorage.getItem("emailUserAppt") == "false") {
                    $("#userEmail").prop("checked", false);
                }
            }, 100);
        });
    } else if (FlowRouter.current().queryParams.supplierid) {
        contactService.getOneSupplierDataEx(leadid).then((data) => {
            let checkIncludeAllProducts = templateObject.includeAllProducts.get();
            let getAllEmployeeData = templateObject.employeerecords.get() || "";
            let getEmployeeID = templateObject.empID.get() || "";
            document.getElementById("employee_name").value = localStorage.getItem("mySessionEmployee");
            document.getElementById("customer").value = data.fields.ClientName;
            document.getElementById("phone").value = data.fields.Phone;
            document.getElementById("mobile").value = data.fields.Mobile;
            document.getElementById("state").value = data.fields.State;
            document.getElementById("country").value = data.fields.Country;
            document.getElementById("address").value = data.fields.Street.replace(/(?:\r\n|\r|\n)/g,", ");
            if (localStorage.getItem("CloudAppointmentNotes") == true) {
                document.getElementById("txtNotes").value = data.fields.Notes;
                document.getElementById("txtNotes-1").value = data.fields.Notes;
            }
            document.getElementById("suburb").value = data.fields.Suburb;
            document.getElementById("zip").value = data.fields.Postcode;
            if (auto == true) {
                let dateStart = getRegalTime();
                let dateEnd = new Date(dateStart.getTime() + 2 * 3600 * 1000);
                let startTime = ("0" + dateStart.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                let endTime = ("0" + dateEnd.getHours()).toString().slice(-2) + ":" + ("0" + dateStart.getMinutes()).toString().slice(-2);
                document.getElementById("startTime").value = startTime;
                document.getElementById("endTime").value = endTime;
            }
            if ($("#updateID").val() == "") {
                getVS1Data("TAppointment").then(function(dataObject) {
                    if(dataObject.length == 0){
                        let appointmentService = new AppointmentService();
                        appointmentService.getAllAppointmentListCount().then(function(data) {
                            if (data.tappointmentex.length > 0) {
                                let max = 1;
                                for (let i = 0; i < data.tappointmentex.length; i++) {
                                    if (data.tappointmentex[i].Id > max) {
                                        max = data.tappointmentex[i].Id;
                                    }
                                }
                                document.getElementById("appID").value = max + 1;
                            } else {
                                document.getElementById("appID").value = 1;
                            }
                        });
                    }else{
                        let data = JSON.parse(dataObject[0].data);
                        if (data.tappointmentex.length > 0) {
                            let max = 1;
                            for (let i = 0; i < data.tappointmentex.length; i++) {
                                if (data.tappointmentex[i].Id > max) {
                                    max = data.tappointmentex[i].Id;
                                }
                            }
                            document.getElementById("appID").value = max + 1;
                        } else {
                            document.getElementById("appID").value = 1;
                        }
                    }
                })
                if (getEmployeeID != "") {
                    var filterEmpData = getAllEmployeeData.filter((empdData) => {
                        return empdData.id == getEmployeeID;
                    });
                    if (filterEmpData) {
                        if (filterEmpData[0].custFld8 == "false") {
                            templateObject.getAllSelectedProducts(getEmployeeID);
                        } else {
                            templateObject.getAllProductData();
                        }
                    } else {
                        templateObject.getAllProductData();
                    }
                }
            }
            $("#customerListModal").modal("hide");
            $("#event-modal").modal();
            setTimeout(() => {
                if (localStorage.getItem("smsCustomerAppt") == "false") {
                    $("#chkSMSCustomer").prop("checked", false);
                }
                if (localStorage.getItem("smsUserAppt") == "false") {
                    $("#chkSMSUser").prop("checked", false);
                }
                if (localStorage.getItem("emailCustomerAppt") == "false") {
                    $("#customerEmail").prop("checked", false);
                }
                if (localStorage.getItem("emailUserAppt") == "false") {
                    $("#userEmail").prop("checked", false);
                }
            }, 100);
        });
    }
};

const getRegalTime = ((date = new Date()) => {
    var coeff = 1000 * 60 * 60;
    return new Date(Math.round(date.getTime() / coeff) * coeff);
});
