import { ContactService } from "../contacts/contact-service";
import { ReactiveVar } from "meteor/reactive-var";
import { UtilityService } from "../utility-service";
import "jquery-ui-dist/external/jquery/jquery";
import { SalesBoardService } from "../js/sales-service";
import { OrganisationService } from "../js/organisation-service";
import { AppointmentService } from "./appointment-service";
import EmployeePayrollApi from "../js/Api/EmployeePayrollApi";

// Damien
// For resizable
import _ from "lodash";
import ChartHandler from "../js/Charts/ChartHandler";
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
//


import { Random } from "meteor/random";
//Calendar
import { SideBarService } from "../js/sidebar-service";
import "../lib/global/indexdbstorage.js";


import { Template } from 'meteor/templating';
import './appointments.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '../overviews/Modal/newLeaveRequest.html';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.appointments.onCreated(function() {
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
    templateObject.useProductCostaspayRate = new ReactiveVar();
    templateObject.useProductCostaspayRate.set(false);
    templateObject.allnoninvproducts = new ReactiveVar([]);
    templateObject.textnote = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.productextrasellrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);
    //templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.displayfields = new ReactiveVar([]);
    templateObject.checkRefresh.set(false);
    templateObject.empID = new ReactiveVar();
    let dayObj = {
        saturday: 0,
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
    };
    templateObject.repeatDays.set(dayObj);
    templateObject.toupdatelogid = new ReactiveVar();
    templateObject.isAccessLevels = new ReactiveVar();
    templateObject.productFees = new ReactiveVar();
    templateObject.extraProductFees = new ReactiveVar([]);
    templateObject.leaveemployeerecords = new ReactiveVar([]);
});

Template.appointments.onRendered(function() {
    let seeOwnAppointments = localStorage.getItem('CloudAppointmentSeeOwnAppointmentsOnly__') || true;
    let templateObject = Template.instance();
    let tempObj = Template.instance();
    let contactService = new ContactService();
    let clientsService = new SalesBoardService();
    let appointmentService = new AppointmentService();
    let productList = [];
    const clientList = [];
    let allEmployees = [];
    let launchAllocations = localStorage.getItem("CloudAppointmentAllocationLaunch");

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

    templateObject.getDayNumber = function(day) {
        day = day.toLowerCase();
        if (day == "") {
            return;
        }
        if (day == "monday") {
            return 1;
        }
        if (day == "tuesday") {
            return 2;
        }
        if (day == "wednesday") {
            return 3;
        }
        if (day == "thursday") {
            return 4;
        }
        if (day == "friday") {
            return 5;
        }
        if (day == "saturday") {
            return 6;
        }
        if (day == "sunday") {
            return 0;
        }
    }
    templateObject.getMonths = function(startDate, endDate) {
        let dateone = "";
        let datetwo = "";
        if (startDate != "") {
            dateone = moment(startDate).format('M');
        }
        if (endDate != "") {
            datetwo = parseInt(moment(endDate).format('M')) + 1;
        }
        if (dateone != "" && datetwo != "") {
            for (let x = dateone; x < datetwo; x++) {
                if (x == 1) {
                    $("#formCheck-january").prop('checked', true);
                }
                if (x == 2) {
                    $("#formCheck-february").prop('checked', true);
                }
                if (x == 3) {
                    $("#formCheck-march").prop('checked', true);
                }
                if (x == 4) {
                    $("#formCheck-april").prop('checked', true);
                }
                if (x == 5) {
                    $("#formCheck-may").prop('checked', true);
                }
                if (x == 6) {
                    $("#formCheck-june").prop('checked', true);
                }
                if (x == 7) {
                    $("#formCheck-july").prop('checked', true);
                }
                if (x == 8) {
                    $("#formCheck-august").prop('checked', true);
                }
                if (x == 9) {
                    $("#formCheck-september").prop('checked', true);
                }
                if (x == 10) {
                    $("#formCheck-october").prop('checked', true);
                }
                if (x == 11) {
                    $("#formCheck-november").prop('checked', true);
                }
                if (x == 12) {
                    $("#formCheck-december").prop('checked', true);
                }
            }
        }
        if (dateone == "") {
            $("#formCheck-january").prop('checked', true);
        }
    }

    templateObject.hasFollowings = async function() {
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            var apptData = await appointmentService.getOneAppointmentdataEx(currentInvoice);
            getVS1Data("TAppointment").then(async function(dataObject) {
                if(dataObject.length == 0){
                    let appointmentService = new AppointmentService();
                    let apptIds = await appointmentService.getAllAppointmentListCount();
                    let apptIdList = apptIds.tappointmentex;
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
                }else{
                    let apptIds = JSON.parse(dataObject[0].data);
                    let apptIdList = apptIds.tappointmentex;
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
    if (localStorage.getItem("CloudAppointmentStartStopAccessLevel") == true) {
        //$("#btnHold").prop("disabled", true);
    }

    if (FlowRouter.current().queryParams.leadid) {
        openAppointModalDirectly(FlowRouter.current().queryParams.leadid,templateObject,true);
    } else if (FlowRouter.current().queryParams.customerid) {
        openAppointModalDirectly(FlowRouter.current().queryParams.customerid,templateObject,true);
    } else if (FlowRouter.current().queryParams.supplierid) {
        openAppointModalDirectly(FlowRouter.current().queryParams.supplierid,templateObject,true);
    }
	
	$(".fullScreenSpin").css("display", "inline-block");

    const refreshPage = () => {
        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
            window.open(localStorage.getItem("appt_historypage"), "_self");
        } else {
            window.open("/appointments", "_self");
        }
    }

    templateObject.fetchAppointments = function() {
        $(".fullScreenSpin").css("display", "inline-block");
        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(dataUpdate) {
			addVS1Data("TAppointment", JSON.stringify(dataUpdate)).then(function() {
				refreshPage();
			})
			.catch(function() {});
		})
		.catch(function() {
			refreshPage();
		});
    };

	templateObject.diff_hours = function(dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60 * 60;
        return Math.abs(diff);
    };

    document.getElementById("currentDate").value = moment().format("YYYY-MM-DD");
    changeColumnColor = async function(day) {
        let dayOfWeek = moment(day).format("dddd");
        let dayInDigit = moment(day).format("DD");
        let dd = moment(document.getElementById("currentDate").value).format("DD");
        if (dayOfWeek == moment().format("dddd") && dayInDigit == dd) {
            $(document).on("DOMNodeInserted", function() {
                $("#allocationTable")
                    .find("tbody tr td." + dayOfWeek.toLowerCase() + "")
                    .addClass("currentDay");
            });
        } else {
            $(
                "#allocationTable tbody tr td." + dayOfWeek.toLocaleLowerCase()
            ).removeClass("currentDay");
            $("#allocationTabletbody tr td." + dayOfWeek.toLocaleLowerCase()).css(
                "background-color",
                "#fff"
            );
        }
        setTimeout(function() {
            if (
                $("#showSaturday").is(":checked") &&
                $("#showSunday").is(":checked")
            ) {
                $(".draggable").addClass("cardWeeekend");
                $(".draggable").removeClass("cardHiddenWeekend");
                $(".draggable").removeClass("cardHiddenSundayOrSaturday");
            }

            if (
                $("#showSaturday").prop("checked") == false &&
                $("#showSunday").prop("checked") == false
            ) {
                $(".draggable").removeClass("cardWeeekend");
                $(".draggable").addClass("cardHiddenWeekend");
                $(".draggable").removeClass("cardHiddenSundayOrSaturday");
            }

            if (
                ($("#showSaturday").prop("checked") == false &&
                    $("#showSunday").prop("checked") == true) ||
                ($("#showSaturday").prop("checked") == true &&
                    $("#showSunday").prop("checked") == false)
            ) {
                $(".draggable").removeClass("cardWeeekend");
                $(".draggable").removeClass("cardHiddenWeekend");
                $(".draggable").addClass("cardHiddenSundayOrSaturday");
            }
        }, 100);
    };

    templateObject.dateFormat = function(date) {
        var dateParts = date.split("/");
        var dateObject =
            dateParts[2] +
            "/" +
            ("0" + (dateParts[1] - 1)).toString().slice(-2) +
            "/" +
            dateParts[0];
        return dateObject;
    };

    templateObject.timeToDecimal = function(time) {
        var hoursMinutes = time.split(/[.:]/);
        var hours = parseInt(hoursMinutes[0], 10);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes / 60;
    };

    templateObject.timeFormat = function(hours) {
        var decimalTime = parseFloat(hours).toFixed(2);
        decimalTime = decimalTime * 60 * 60;
        var hours = Math.floor(decimalTime / (60 * 60));
        decimalTime = decimalTime - hours * 60 * 60;
        var minutes = Math.abs(decimalTime / 60);
        decimalTime = decimalTime - minutes * 60;
        hours = ("0" + hours).slice(-2);
        minutes = ("0" + Math.round(minutes)).slice(-2);
        let time = hours + ":" + minutes;
        return time;
    };

    // templateObject.getLeaveRequests = async function() {
    //     let result = false;
    //     const dataObject = await getVS1Data("TLeavRequest");
    //     if (dataObject.length != 0) {
    //         const data = JSON.parse(dataObject[0].data);
    //         if (data.tleavrequest.length > 0) {
    //             data.tleavrequest.forEach((item) => {
    //                 const fields = item.fields;
    //                 const parsedDate = utilityService.getStartDateWithSpecificFormat(
    //                     fields.StartDate
    //                 );
    //                 const appointmentDate = document.getElementById("dtSODate").value;

    //                 if (parsedDate === appointmentDate) {
    //                     result = true;
    //                 }
    //             });
    //         }
    //     }
    //     return result;
    // };

    templateObject.saveLeaveRequestLocalDB = async function() {
        const employeePayrolApis = new EmployeePayrollApi();
        // now we have to make the post request to save the data in database
        const employeePayrolEndpoint = employeePayrolApis.collection.findByName(
            employeePayrolApis.collectionNames.TLeavRequest
        );

        employeePayrolEndpoint.url.searchParams.append(
            "ListType",
            "'Detail'"
        );
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
                leaveArr.push(fields);
            });
        }
        templateObject.leaveemployeerecords.set(leaveArr);

        getVS1Data("TEmployee").then(async function(dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllEmployeeSideData().then(function(data) {
                    let lineItems = [];

                    for (let i = 0; i < data.temployee.length; i++) {
                        let randomColor = Math.floor(Math.random() * 16777215).toString(
                            16
                        );

                        if (randomColor.length < 6) {
                            randomColor = randomColor + "6";
                        }
                        let selectedColor = "#" + randomColor;
                        if (localStorage.getItem("mySessionEmployee") == data.temployee[i].fields.EmployeeName) {
                            if (data.temployee[i].fields.CustFld8 == "false") {
                                templateObject.includeAllProducts.set(false);
                            }
                        }

                        if (JSON.parse(seeOwnAppointments) == true) {
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
                        return a.employeeName.toUpperCase() >
                            b.employeeName.toUpperCase() ?
                            1 :
                            -1;
                    });
                    templateObject.employeerecords.set(lineItems);

                    if (templateObject.employeerecords.get()) {
                        setTimeout(function() {
                            $(".counter").text(lineItems.length + " items");
                        }, 100);
                    }
                })
                .catch(function() {});
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.temployee;
                let lineItems = [];

                for (let i = 0; i < useData.length; i++) {
                    let randomColor = Math.floor(Math.random() * 16777215).toString(16);

                    if (randomColor.length < 6) {
                        randomColor = randomColor + "6";
                    }
                    let selectedColor = "#" + randomColor;
                    if (useData[i].fields.CustFld6 == "") {
                        objDetails = {
                            type: "TEmployeeEx",
                            fields: {
                                ID: useData[i].fields.ID,
                                CustFld6: selectedColor,
                                Email: useData[i].fields.Email ||
                                    useData[i].fields.FirstName.toLowerCase() + "@gmail.com",
                                Sex: useData[i].fields.Sex || "M",
                                DateStarted: useData[i].fields.DateStarted ||
                                    moment().format("YYYY-MM-DD"),
                                DOB: useData[i].fields.DOB ||
                                    moment("2018-07-01").format("YYYY-MM-DD"),
                            },
                        };

                        contactService
                            .saveEmployeeEx(objDetails)
                            .then(function() {});
                    }

                    if (
                        localStorage.getItem("mySessionEmployee") == useData[i].fields.EmployeeName
                    ) {
                        if (useData[i].fields.CustFld8 == "false") {
                            templateObject.includeAllProducts.set(false);
                        }
                    }

                    if (JSON.parse(seeOwnAppointments) == true) {
                        if (
                            useData[i].fields.EmployeeName ==
                            localStorage.getItem("mySessionEmployee")
                        ) {
                            var dataList = {
                                id: useData[i].fields.ID || "",
                                employeeName: useData[i].fields.EmployeeName || "",
                                color: useData[i].fields.CustFld6 || selectedColor,
                                priority: useData[i].fields.CustFld5 || "0",
                                override: useData[i].fields.CustFld14 || "false",
                                custFld7: useData[i].fields.CustFld7 || "",
                                custFld8: useData[i].fields.CustFld8 || "",
                            };
                            lineItems.push(dataList);
                        }
                    } else {
                        var dataList = {
                            id: useData[i].fields.ID || "",
                            employeeName: useData[i].fields.EmployeeName || "",
                            color: useData[i].fields.CustFld6 || selectedColor,
                            priority: useData[i].fields.CustFld5 || "0",
                            override: useData[i].fields.CustFld14 || "false",
                            custFld7: useData[i].fields.CustFld7 || "",
                            custFld8: useData[i].fields.CustFld8 || "",
                        };
                        lineItems.push(dataList);
                    }
                }
                lineItems.sort(function(a, b) {
                    if (a.employeeName == "NA") {
                        return 1;
                    } else if (b.employeeName == "NA") {
                        return -1;
                    }
                    return a.employeeName.toUpperCase() > b.employeeName.toUpperCase() ?
                        1 :
                        -1;
                });
                templateObject.employeerecords.set(lineItems);

                if (templateObject.employeerecords.get()) {
                    setTimeout(function() {
                        $(".counter").text(lineItems.length + " items");
                    }, 100);
                }
            }
        })
        .catch(function() {
            contactService
                .getAllEmployeeSideData()
                .then(function(data) {
                    let lineItems = [];

                    for (let i = 0; i < data.temployee.length; i++) {
                        let randomColor = Math.floor(Math.random() * 16777215).toString(
                            16
                        );

                        if (randomColor.length < 6) {
                            randomColor = randomColor + "6";
                        }
                        let selectedColor = "#" + randomColor;
                        if (
                            localStorage.getItem("mySessionEmployee") ==
                            data.temployee[i].fields.EmployeeName
                        ) {
                            if (useData[i].fields.CustFld8 == "false") {
                                templateObject.includeAllProducts.set(false);
                            }
                        }
                        if (JSON.parse(seeOwnAppointments) == true) {
                            if (
                                data.temployee[i].fields.EmployeeName ==
                                localStorage.getItem("mySessionEmployee")
                            ) {
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
                        }
                    }
                    lineItems.sort(function(a, b) {
                        if (a.employeeName == "NA") {
                            return 1;
                        } else if (b.employeeName == "NA") {
                            return -1;
                        }
                        return a.employeeName.toUpperCase() > b.employeeName.toUpperCase() ?
                            1 :
                            -1;
                    });
                    templateObject.employeerecords.set(lineItems);

                    if (templateObject.employeerecords.get()) {
                        setTimeout(function() {
                            $(".counter").text(lineItems.length + " items");
                        }, 100);
                    }
                })
                .catch(function() {});
        });
    };

    templateObject.getAllSelectedProducts = function(employeeID) {
        let productlist = [];
        templateObject.datatablerecords.set([]);
        var splashArrayProductServiceListGet = [];
        //$('#product-list').editableSelect('clear');
        getVS1Data("TRepServices").then(function(dataObject){
            if (dataObject.length == 0) {
            sideBarService.getSelectedProducts(employeeID).then(function(data) {
                addVS1Data("TRepServices", JSON.stringify(data));
                var dataList = {};
                let getallinvproducts = templateObject.allnoninvproducts.get();
                if (data.trepservices.length > 0) {
                    for (let i = 0; i < data.trepservices.length; i++) {
                        dataList = {
                            id: data.trepservices[i].Id || "",
                            productname: data.trepservices[i].ServiceDesc || "",
                            productcost: data.trepservices[i].Rate || 0.0,
                        };

                        productlist.push(dataList);
                    }
                    if (splashArrayProductServiceListGet) {
                        let uniqueChars = [...new Set(splashArrayProductServiceListGet)];
                        var datatable = $("#tblInventoryPayrollService").DataTable();
                        datatable.clear();
                        datatable.rows.add(uniqueChars);
                        datatable.draw(false);
                    }

                    templateObject.datatablerecords.set(productlist);
                } else {
                    templateObject.getAllProductData();
                }
            })
            .catch(function() {
                templateObject.getAllProductData();
            });
            }else{
                let data = JSON.parse(dataObject[0].data);
                var dataList = {};
                let getallinvproducts = templateObject.allnoninvproducts.get();
                if (data.trepservices.length > 0) {
                    for (let i = 0; i < data.trepservices.length; i++) {
                        dataList = {
                            id: data.trepservices[i].Id || "",
                            productname: data.trepservices[i].ServiceDesc || "",
                            productcost: data.trepservices[i].Rate || 0.0,
                        };

                        productlist.push(dataList);
                    }
                    if (splashArrayProductServiceListGet) {
                        let uniqueChars = [...new Set(splashArrayProductServiceListGet)];
                        var datatable = $("#tblInventoryPayrollService").DataTable();
                        datatable.clear();
                        datatable.rows.add(uniqueChars);
                        datatable.draw(false);
                    }

                    templateObject.datatablerecords.set(productlist);
                } else {
                    templateObject.getAllProductData();
                }
            }
        }).catch(function() {
            sideBarService.getSelectedProducts(employeeID).then(function(data) {
                addVS1Data("TRepServices", JSON.stringify(data));
                var dataList = {};
                let getallinvproducts = templateObject.allnoninvproducts.get();
                if (data.trepservices.length > 0) {
                    for (let i = 0; i < data.trepservices.length; i++) {
                        dataList = {
                            id: data.trepservices[i].Id || "",
                            productname: data.trepservices[i].ServiceDesc || "",
                            productcost: data.trepservices[i].Rate || 0.0,
                        };

                        productlist.push(dataList);
                    }
                    if (splashArrayProductServiceListGet) {
                        let uniqueChars = [...new Set(splashArrayProductServiceListGet)];
                        var datatable = $("#tblInventoryPayrollService").DataTable();
                        datatable.clear();
                        datatable.rows.add(uniqueChars);
                        datatable.draw(false);
                    }

                    templateObject.datatablerecords.set(productlist);
                } else {
                    templateObject.getAllProductData();
                }
            })
            .catch(function() {
                templateObject.getAllProductData();
            });
        })

    };

    templateObject.getAllProductData = function() {
        productList = [];
        templateObject.datatablerecords.set([]);
        var splashArrayProductServiceList = new Array();
        //  $('#product-list').editableSelect('clear');
        getVS1Data("TProductWeb").then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getProductServiceListVS1(initialBaseDataLoad, 0).then(function(data) {
                    addVS1Data("TProductWeb", JSON.stringify(data));
                    var dataList = {};
                    for (let i = 0; i < data.tproductvs1.length; i++) {
                        dataList = {
                            id: data.tproductvs1[i].fields.ID || "",
                            productname: data.tproductvs1[i].fields.ProductName || "",
                        };

                        var prodservicedataList = [
                            '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                            data.tproductvs1[i].fields.ID +
                            '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                            data.tproductvs1[i].fields.ID +
                            '"></label></div>',
                            data.tproductvs1[i].fields.ProductName || "-",
                            data.tproductvs1[i].fields.SalesDescription || "",
                            data.tproductvs1[i].fields.BARCODE || "",
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) /100),
                            data.tproductvs1[i].fields.TotalQtyInStock,
                            data.tproductvs1[i].fields.TaxCodeSales || "",
                            data.tproductvs1[i].fields.ID || "",
                            JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
                            null,

                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100),
                        ];

                        splashArrayProductServiceList.push(prodservicedataList);

                        //if (data.tproductvs1[i].ProductType != 'INV') {
                        // $('#product-list').editableSelect('add', data.tproductvs1[i].ProductName);
                        // $('#product-list').editableSelect('add', function(){
                        //   $(this).text(data.tproductvs1[i].ProductName);
                        //   $(this).attr('id', data.tproductvs1[i].SellQty1Price);
                        // });
                        productList.push(dataList);
                        //  }
                    }

                    if (splashArrayProductServiceList) {
                        templateObject.allnoninvproducts.set(
                            splashArrayProductServiceList
                        );
                        $("#tblInventoryPayrollService")
                            .dataTable({
                                data: splashArrayProductServiceList,

                                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                                columnDefs: [{
                                        className: "chkBox pointer hiddenColumn",
                                        orderable: false,
                                        targets: [0],
                                    },
                                    {
                                        className: "productName",
                                        targets: [1],
                                    },
                                    {
                                        className: "productDesc",
                                        targets: [2],
                                    },
                                    {
                                        className: "colBarcode",
                                        targets: [3],
                                    },
                                    {
                                        className: "costPrice text-right",
                                        targets: [4],
                                    },
                                    {
                                        className: "salePrice text-right",
                                        targets: [5],
                                    },
                                    {
                                        className: "prdqty text-right",
                                        targets: [6],
                                    },
                                    {
                                        className: "taxrate",
                                        targets: [7],
                                    },
                                    {
                                        className: "colProuctPOPID hiddenColumn",
                                        targets: [8],
                                    },
                                    {
                                        className: "colExtraSellPrice hiddenColumn",
                                        targets: [9],
                                    },
                                    {
                                        className: "salePriceInc hiddenColumn",
                                        targets: [10],
                                    },
                                ],
                                select: true,
                                destroy: true,
                                colReorder: true,
                                pageLength: initialDatatableLoad,
                                lengthMenu: [
                                    [initialDatatableLoad, -1],
                                    [initialDatatableLoad, "All"],
                                ],
                                info: true,
                                responsive: true,
                                order: [
                                    [1, "asc"]
                                ],
                                fnDrawCallback: function() {
                                    $(".paginate_button.page-item").removeClass("disabled");
                                    $("#tblInventoryPayrollService_ellipsis").addClass(
                                        "disabled"
                                    );
                                },
                                fnInitComplete: function() {
                                    $(
                                        "<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>"
                                    ).insertAfter("#tblInventoryPayrollService_filter");
                                    $(
                                        "<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
                                    ).insertAfter("#tblInventoryPayrollService_filter");
                                    $(
                                        "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                                    ).insertAfter("#tblInventoryPayrollService_filter");
                                },
                            })
                            .on("length.dt", function(e, settings) {
                                $(".fullScreenSpin").css("display", "inline-block");
                                let dataLenght = settings._iDisplayLength;
                                // splashArrayProductList = [];
                                if (dataLenght == -1) {
                                    $(".fullScreenSpin").css("display", "none");
                                } else {
                                    if (
                                        settings.fnRecordsDisplay() >= settings._iDisplayLength
                                    ) {
                                        $(".fullScreenSpin").css("display", "none");
                                    } else {
                                        $(".fullScreenSpin").css("display", "none");
                                    }
                                }
                            });

                        $("div.dataTables_filter input").addClass(
                            "form-control form-control-sm"
                        );
                    }

                    templateObject.datatablerecords.set(productList);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;
                var dataList = {};
                for (let i = 0; i < useData.length; i++) {
                    dataList = {
                        id: useData[i].fields.ID || "",
                        productname: useData[i].fields.ProductName || "",
                    };

                    var prodservicedataList = [
                        '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                        data.tproductvs1[i].fields.ID +
                        '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                        data.tproductvs1[i].fields.ID +
                        '"></label></div>',
                        data.tproductvs1[i].fields.ProductName || "-",
                        data.tproductvs1[i].fields.SalesDescription || "",
                        data.tproductvs1[i].fields.BARCODE || "",
                        utilityService.modifynegativeCurrencyFormat(
                            Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100
                        ),
                        utilityService.modifynegativeCurrencyFormat(
                            Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100
                        ),
                        data.tproductvs1[i].fields.TotalQtyInStock,
                        data.tproductvs1[i].fields.TaxCodeSales || "",
                        data.tproductvs1[i].fields.ID || "",
                        JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) || null,

                        utilityService.modifynegativeCurrencyFormat(
                            Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) /
                            100
                        ),
                    ];

                    splashArrayProductServiceList.push(prodservicedataList);
                    // $('#product-list').editableSelect('add', useData[i].fields.ProductName);
                    // $('#product-list').editableSelect('add', function(){
                    //   $(this).val(useData[i].fields.ID);
                    //   $(this).text(useData[i].fields.ProductName);
                    //   $(this).attr('id', useData[i].fields.SellQty1Price);
                    // });
                    //if (useData[i].fields.ProductType != 'INV') {
                    productList.push(dataList);
                    //}
                }

                if (splashArrayProductServiceList) {
                    templateObject.allnoninvproducts.set(splashArrayProductServiceList);
                    $("#tblInventoryPayrollService")
                        .dataTable({
                            data: splashArrayProductServiceList,

                            sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                            columnDefs: [{
                                    className: "chkBox pointer hiddenColumn",
                                    orderable: false,
                                    targets: [0],
                                },
                                {
                                    className: "productName",
                                    targets: [1],
                                },
                                {
                                    className: "productDesc",
                                    targets: [2],
                                },
                                {
                                    className: "colBarcode",
                                    targets: [3],
                                },
                                {
                                    className: "costPrice text-right",
                                    targets: [4],
                                },
                                {
                                    className: "salePrice text-right",
                                    targets: [5],
                                },
                                {
                                    className: "prdqty text-right",
                                    targets: [6],
                                },
                                {
                                    className: "taxrate",
                                    targets: [7],
                                },
                                {
                                    className: "colProuctPOPID hiddenColumn",
                                    targets: [8],
                                },
                                {
                                    className: "colExtraSellPrice hiddenColumn",
                                    targets: [9],
                                },
                                {
                                    className: "salePriceInc hiddenColumn",
                                    targets: [10],
                                },
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"],
                            ],
                            info: true,
                            responsive: true,
                            order: [
                                [1, "asc"]
                            ],
                            fnDrawCallback: function() {
                                $(".paginate_button.page-item").removeClass("disabled");
                                $("#tblInventoryPayrollService_ellipsis").addClass(
                                    "disabled"
                                );
                            },
                            fnInitComplete: function() {
                                $(
                                    "<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>"
                                ).insertAfter("#tblInventoryPayrollService_filter");
                                $(
                                    "<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
                                ).insertAfter("#tblInventoryPayrollService_filter");
                                $(
                                    "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                                ).insertAfter("#tblInventoryPayrollService_filter");
                            },
                        })
                        .on("length.dt", function(e, settings) {
                            $(".fullScreenSpin").css("display", "inline-block");
                            let dataLenght = settings._iDisplayLength;
                            // splashArrayProductList = [];
                            if (dataLenght == -1) {
                                $(".fullScreenSpin").css("display", "none");
                            } else {
                                if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                                    $(".fullScreenSpin").css("display", "none");
                                } else {
                                    $(".fullScreenSpin").css("display", "none");
                                }
                            }
                        });

                    $("div.dataTables_filter input").addClass(
                        "form-control form-control-sm"
                    );
                }
                templateObject.datatablerecords.set(productList);
            }
        })
        .catch(function() {
            sideBarService
                .getProductServiceListVS1(initialBaseDataLoad, 0)
                .then(function(data) {
                    addVS1Data("TProductWeb", JSON.stringify(data));
                    var dataList = {};
                    for (let i = 0; i < data.tproductvs1.length; i++) {
                        dataList = {
                            id: data.tproductvs1[i].fields.ID || "",
                            productname: data.tproductvs1[i].fields.ProductName || "",
                        };

                        var prodservicedataList = [
                            '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                            data.tproductvs1[i].fields.ID +
                            '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                            data.tproductvs1[i].fields.ID +
                            '"></label></div>',
                            data.tproductvs1[i].fields.ProductName || "-",
                            data.tproductvs1[i].fields.SalesDescription || "",
                            data.tproductvs1[i].fields.BARCODE || "",
                            utilityService.modifynegativeCurrencyFormat(
                                Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100
                            ),
                            utilityService.modifynegativeCurrencyFormat(
                                Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) /
                                100
                            ),
                            data.tproductvs1[i].fields.TotalQtyInStock,
                            data.tproductvs1[i].fields.TaxCodeSales || "",
                            data.tproductvs1[i].fields.ID || "",
                            JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
                            null,

                            utilityService.modifynegativeCurrencyFormat(
                                Math.floor(
                                    data.tproductvs1[i].fields.SellQty1PriceInc * 100
                                ) / 100
                            ),
                        ];

                        splashArrayProductServiceList.push(prodservicedataList);

                        //if (data.tproductvs1[i].ProductType != 'INV') {
                        // $('#product-list').editableSelect('add', data.tproductvs1[i].ProductName);
                        // $('#product-list').editableSelect('add', function(){
                        //   $(this).text(data.tproductvs1[i].ProductName);
                        //   $(this).attr('id', data.tproductvs1[i].SellQty1Price);
                        // });
                        productList.push(dataList);
                        //  }
                    }

                    if (splashArrayProductServiceList) {
                        templateObject.allnoninvproducts.set(
                            splashArrayProductServiceList
                        );
                        $("#tblInventoryPayrollService")
                            .dataTable({
                                data: splashArrayProductServiceList,

                                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                                columnDefs: [{
                                        className: "chkBox pointer hiddenColumn",
                                        orderable: false,
                                        targets: [0],
                                    },
                                    {
                                        className: "productName",
                                        targets: [1],
                                    },
                                    {
                                        className: "productDesc",
                                        targets: [2],
                                    },
                                    {
                                        className: "colBarcode",
                                        targets: [3],
                                    },
                                    {
                                        className: "costPrice text-right",
                                        targets: [4],
                                    },
                                    {
                                        className: "salePrice text-right",
                                        targets: [5],
                                    },
                                    {
                                        className: "prdqty text-right",
                                        targets: [6],
                                    },
                                    {
                                        className: "taxrate",
                                        targets: [7],
                                    },
                                    {
                                        className: "colProuctPOPID hiddenColumn",
                                        targets: [8],
                                    },
                                    {
                                        className: "colExtraSellPrice hiddenColumn",
                                        targets: [9],
                                    },
                                    {
                                        className: "salePriceInc hiddenColumn",
                                        targets: [10],
                                    },
                                ],
                                select: true,
                                destroy: true,
                                colReorder: true,
                                pageLength: initialDatatableLoad,
                                lengthMenu: [
                                    [initialDatatableLoad, -1],
                                    [initialDatatableLoad, "All"],
                                ],
                                info: true,
                                responsive: true,
                                order: [
                                    [1, "asc"]
                                ],
                                fnDrawCallback: function() {
                                    $(".paginate_button.page-item").removeClass("disabled");
                                    $("#tblInventoryPayrollService_ellipsis").addClass(
                                        "disabled"
                                    );
                                },
                                fnInitComplete: function() {
                                    $(
                                        "<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>"
                                    ).insertAfter("#tblInventoryPayrollService_filter");
                                    $(
                                        "<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>"
                                    ).insertAfter("#tblInventoryPayrollService_filter");
                                    $(
                                        "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                                    ).insertAfter("#tblInventoryPayrollService_filter");
                                },
                            })
                            .on("length.dt", function(e, settings) {
                                $(".fullScreenSpin").css("display", "inline-block");
                                let dataLenght = settings._iDisplayLength;
                                // splashArrayProductList = [];
                                if (dataLenght == -1) {
                                    $(".fullScreenSpin").css("display", "none");
                                } else {
                                    if (
                                        settings.fnRecordsDisplay() >= settings._iDisplayLength
                                    ) {
                                        $(".fullScreenSpin").css("display", "none");
                                    } else {
                                        $(".fullScreenSpin").css("display", "none");
                                    }
                                }
                            });

                        $("div.dataTables_filter input").addClass(
                            "form-control form-control-sm"
                        );
                    }

                    templateObject.datatablerecords.set(productList);
                });
        });
    };

    templateObject.getEmployeesList();
    templateObject.getAllProductData();
    getVS1Data("TAppointmentPreferences").then(function(dataObject) {
        if (dataObject.length == 0) {
            appointmentService.getCalendarsettings().then(function(data) {
                if (data.tappointmentpreferences.length > 0) {
                    templateObject.employeeOptions.set(data.tappointmentpreferences);
                }
            })
            .catch(function() {});
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tappointmentpreferences;
            templateObject.employeeOptions.set(useData);
        }
    })
    .catch(function() {
        appointmentService.getCalendarsettings().then(function(data) {
                templateObject.employeeOptions.set(data.tappointmentpreferences);
        })
        .catch(function() {});
    });

    templateObject.getAllClients = function() {
        getVS1Data("TCustomerVS1").then(function(dataObject) {
			if (dataObject.length == 0) {
				clientsService.getClientVS1().then(function(data) {
					templateObject.setAllClientsData(data)
				});
			} else {
				let data = JSON.parse(dataObject[0].data);
				templateObject.setAllClientsData(data);
			}
		})
		.catch(function() {
			clientsService.getClientVS1().then(function(data) {
				templateObject.setAllClientsData(data)
			});
		});
    };

	templateObject.setAllClientsData = function(data){
		for (let i in data.tcustomervs1) {
			let customerrecordObj = {
				customerid: data.tcustomervs1[i].Id || " ",
				customername: data.tcustomervs1[i].ClientName || " ",
				customeremail: data.tcustomervs1[i].Email || " ",
				street: data.tcustomervs1[i].Street.replace(/(?:\r\n|\r|\n)/g,", ") || " ",
				street2: data.tcustomervs1[i].Street2 || " ",
				street3: data.tcustomervs1[i].Street3 || " ",
				suburb: data.tcustomervs1[i].Suburb || data.tcustomervs1[i].Street2,
				phone: data.tcustomervs1[i].Phone || " ",
				statecode: data.tcustomervs1[i].State + " " + data.tcustomervs1[i].Postcode || " ",
				country: data.tcustomervs1[i].Country || " ",
				termsName: data.tcustomervs1[i].TermsName || "",
			};
			//clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
			clientList.push(customerrecordObj);

			//$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
		}
		templateObject.clientrecords.set(clientList);
		templateObject.clientrecords.set(
			clientList.sort(function(a, b) {
				if (a.customername == "NA") {
					return 1;
				} else if (b.customername == "NA") {
					return -1;
				}
				return a.customername.toUpperCase() >
					b.customername.toUpperCase() ?
					1 :
					-1;
			})
		);

		for (var i = 0; i < clientList.length; i++) {
			//$('#customer').editableSelect('add', clientList[i].customername);
		}
	}

    templateObject.updateEvents = async (updatedEvent) => {
        let tempEvents = await getVS1Data("TNewAppointment")
        localStorage.setItem("isFormUpdated", true);
        if(tempEvents.length == 0){
            addVS1Data("TNewAppointment", JSON.stringify(updatedEvent))
        }else{
            let data = JSON.parse(tempEvents[0].data)
            if(data.length === 0){
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

    templateObject.updateTimeLogs = async (updatedTimeLog) => {
        let tempTimeLogs = await getVS1Data("TAppointmentsTimeLog")
        localStorage.setItem("isFormUpdated", true);
        if(tempTimeLogs.length == 0){
            addVS1Data("TAppointmentsTimeLog", JSON.stringify(updatedTimeLog))
        }else{
            let data = JSON.parse(tempTimeLogs[0].data)
            if(data.length === 0){
                let currentTimeLogIndex = data?.findIndex((event) => event.fields.Id == updatedTimeLog.fields.Id)
                if(currentTimeLogIndex > -1){
                    data[currentTimeLogIndex] = updatedTimeLog;
                }else{
                    data.push(updatedTimeLog)
                }
            }else{
                data.push(updatedTimeLog)
            }
            addVS1Data("TAppointmentsTimeLog", JSON.stringify(data))
        }
    }

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

    getHours = function(start, end) {
        var hour = 0;
        hour = parseInt(start.split(":")[0]) - parseInt(end.split(":")[0]);
        var min = parseInt(start.split(":")[1]) + parseInt(end.split(":")[1]);
        var checkmin = parseInt(start.split(":")[1]) - parseInt(end.split(":")[1]);
        if (parseInt(start.split(":")[1]) > parseInt(end.split(":")[1])) {
            checkmin = parseInt(start.split(":")[1]) - parseInt(end.split(":")[1]);
        } else if (parseInt(end.split(":")[1]) > parseInt(start.split(":")[1])) {
            checkmin = parseInt(end.split(":")[1]) - parseInt(start.split(":")[1]);
        }

        if (checkmin == 0) {
            hour += 1;
        } else if (checkmin > 0) {
            hour += 1;
        } else if (min == 60) {
            hour += 1;
        }
        return hour;
    };

    if (localStorage.getItem("CloudAppointmentStartStopAccessLevel") == true) {
        //$("#btnHold").prop("disabled", true);
    }

    // BEGIN DATE CODE
    $(".formClassDate").datepicker({
        showOn: "button",
        buttonText: "Show Date",
        buttonImageOnly: true,
        buttonImage: "/img/imgCal2.png",
        dateFormat: "dd/mm/yy",
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    $(".formClassDate").val(begunDate);

    $(document).on("dblclick", "#tblEmployeeSideList tbody tr", function() {
        var listData = this.id;
        if (listData) {
            FlowRouter.go("/employeescard?id=" + listData);
        }
    });
    $(document).on("click", ".btnoptionsmodal", function() {
        templateObject.getAllProductData();
        $("#settingsModal").modal("toggle");
    });

    var dragged;
    /* events fired on the draggable target */
    document.addEventListener("drag", function() {
            //event.dataTransfer.setData('text/plain', event.target.id);
        },
        false
    );

    document.addEventListener("dragstart",function(event) {
            // store a ref. on the dragged elem
            dragged = event.target;

            event.target.style.opacity = 0.5;
        },
        false
    );

    document.addEventListener(
        "dragend",
        function(event) {
            // reset the transparency
            event.target.style.opacity = "";
        },
        false
    );

    /* events fired on the drop targets */
    document.addEventListener(
        "dragover",
        function(event) {
            // prevent default to allow drop
            event.preventDefault();
        },
        false
    );

    document.addEventListener(
        "dragenter",
        function(event) {
            // highlight potential drop target when the draggable element enters it
            if (event.target.className.includes("droppable")) {
                event.target.style.background = "#99ccff";
            }
        },
        false
    );

    document.addEventListener(
        "dragleave",
        function(event) {
            // reset background of potential drop target when the draggable element leaves it
            if (event.target.className.includes("droppable")) {
                event.target.style.background = "";
            }
        },
        false
    );

	$(document).on("click", "#check-all", function() {
        var checkbox = document.querySelector("#check-all");
        if (checkbox.checked) {
            $(".notevent").prop("checked", true);
        } else {
            $(".notevent").prop("checked", false);
        }
    });

	templateObject.sendSMSMessage = async function(type, phoneNumber) {
        return new Promise(async(resolve) => {
            const smsSettings = templateObject.defaultSMSSettings.get();
            const companyName = localStorage.getItem("vs1companyName");
            const message =
                smsSettings.headerAppointmentSMSMessage.replace(
                    "[Company Name]",
                    companyName
                ) +
                " - " +
                $(`#${type}AppointmentSMSMessage`).val();
            const sendSMSResult = await new Promise((res, rej) => {
                Meteor.call(
                    "sendSMS",
                    smsSettings.twilioAccountId,
                    smsSettings.twilioAccountToken,
                    smsSettings.twilioTelephoneNumber,
                    phoneNumber,
                    message,
                    function(error, result) {
                        if (error) rej(error);
                        res(result);
                    }
                );
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
        });
    };
    //TODO: Check SMS Settings and confirm if continue or go to SMS settings page
    const accessLevel = localStorage.getItem("CloudApptSMS");
    if (!accessLevel) {
        $("#chkSMSCustomer").prop("checked", false);
        $("#chkSMSUser").prop("checked", false);
        $(".chkSMSCustomer-container").addClass("d-none");
        $(".chkSMSCustomer-container").removeClass("d-xl-flex");
        $(".chkSMSUser-container").addClass("d-none");
        $(".chkSMSUser-container").removeClass("d-xl-flex");

        $(".btnStartIgnoreSMS").addClass("d-none");
        $(".btnSaveIgnoreSMS").addClass("d-none");
        $(".btnStopIgnoreSMS").addClass("d-none");
    }

    function initCustomFieldDisplaySettings(data, listType) {
        let custFields = [];
        let customData = {};
        let reset_data = [];

        if (localStorage.getItem("CloudSalesQtyOnly")) {
            reset_data = [
                { label: "Product Name", class: "colProductName", active: true },
                { label: "Description", class: "colDescription", active: true },
                { label: "Qty", class: "colQty", active: true },
                { label: "Ordered", class: "colOrdered", active: false },
                { label: "Shipped", class: "colShipped", active: false },
                { label: "BO", class: "colBO", active: false },
                { label: "Unit Price (Ex)", class: "colUnitPrice", active: true },
                { label: "Unit Price (Inc)", class: "colUnitPriceInc", active: false },
                { label: "Disc %", class: "colDiscount", active: true },
                { label: "Cost Price", class: "colCostPrice", active: false },
                {
                    label: "SalesLines CustField1",
                    class: "colSalesLinesCustField1",
                    active: false,
                },
                { label: "Tax Rate", class: "colTaxRate", active: false },
                { label: "Tax Code", class: "colTaxCode", active: true },
                { label: "Tax Amt", class: "colTaxAmount", active: true },
                { label: "Serial/Lot No", class: "colSerialNo", active: true },
                { label: "Amount (Ex)", class: "colAmount", active: true },
                { label: "Amount (Inc)", class: "colAmountInc", active: false },
                { label: "Units", class: "colUOM", active: false },
            ];
        } else {
            reset_data = [
                { label: "Product Name", class: "colProductName", active: true },
                { label: "Description", class: "colDescription", active: true },
                { label: "Qty", class: "colQty", active: false },
                { label: "Ordered", class: "colOrdered", active: true },
                { label: "Shipped", class: "colShipped", active: true },
                { label: "BO", class: "colBO", active: true },
                { label: "Unit Price (Ex)", class: "colUnitPrice", active: true },
                { label: "Unit Price (Inc)", class: "colUnitPriceInc", active: false },
                { label: "Disc %", class: "colDiscount", active: true },
                { label: "Cost Price", class: "colCostPrice", active: false },
                {
                    label: "SalesLines CustField1",
                    class: "colSalesLinesCustField1",
                    active: false,
                },
                { label: "Tax Rate", class: "colTaxRate", active: false },
                { label: "Tax Code", class: "colTaxCode", active: true },
                { label: "Tax Amt", class: "colTaxAmount", active: true },
                { label: "Serial/Lot No", class: "colSerialNo", active: true },
                { label: "Amount (Ex)", class: "colAmount", active: true },
                { label: "Amount (Inc)", class: "colAmountInc", active: false },
                { label: "Units", class: "colUOM", active: false },
            ];
        }
        let customFieldCount = reset_data.length;

        // tempcode
        for (let r = 0; r < customFieldCount; r++) {
            customData = {
                active: reset_data[r].active,
                id: "",
                custfieldlabel: reset_data[r].label,
                datatype: "",
                isempty: true,
                iscombo: false,
            };
            custFields.push(customData);
        }
        tempObj.displayfields.set(custFields);
        return;
    }
    // initCustomFieldDisplaySettings("", "ltSaleslines");
    tempObj.getAllCustomFieldDisplaySettings = function() {
        let listType = "ltSaleslines"; // tempcode until InvoiceLines is added on backend
        try {
            getVS1Data("TltSaleslines").then(function(dataObject) {
                if (dataObject.length == 0) {
                    sideBarService.getAllCustomFieldsWithQuery(listType).then(function(data) {
						initCustomFieldDisplaySettings(data, listType);
						addVS1Data("TltSaleslines", JSON.stringify(data));
					});
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    if (data.tcustomfieldlist.length == 0) {
                        sideBarService.getAllCustomFieldsWithQuery(listType).then(function(data) {
							initCustomFieldDisplaySettings(data, listType);
							addVS1Data("TltSaleslines", JSON.stringify(data));
						});
                    } else {
                        initCustomFieldDisplaySettings(data, listType);
                        sideBarService.getAllCustomFieldsWithQuery(listType).then(function(data) {
							addVS1Data("TltSaleslines", JSON.stringify(data));
						});
                    }
                }
            });
        } catch (error) {}
    };

    tempObj.resizableFunction = () => {
        let storeObj = JSON.parse(localStorage.getItem("appointment-card-0"));

        if(storeObj && storeObj.width){
            let width1 = storeObj.width;

            $("#colEmployeeList").width(parseInt(width1));
            // $("#colEmployeeList").height(parseInt(height1));
        }

        storeObj = JSON.parse(localStorage.getItem("appointment-card-1"));

        if(storeObj && storeObj.width){
            let width2 = storeObj.width;

            $("#colCalendar").width(parseInt(width2));
            // $("#colCalendar").height(parseInt(height2));
        }

        setTimeout(() => {
            $(".portlet").resizable({
                disabled: false,
                minHeight: 200,
                minWidth: 250,
                // aspectRatio: 1.5 / 1
                handles: "e,s",
                stop: async (event, ui) => {

                    // add custom class to manage spacing


                    /**
                     * Build the positions of the widgets
                     */
                    if ($(ui.element[0]).parents(".sortable-chart-widget-js").hasClass("editCharts") == false) {

                        // ChartHandler.buildPositions();
                        // await ChartHandler.saveChart(
                        //     $(ui.element[0]).parents(".sortable-chart-widget-js")
                        // );

                    }
                },
                resize: function (event, ui) {
                    let chartHeight = ui.size.height;
                    let chartWidth = ui.size.width;

                    $(ui.element[0])
                        .parents(".sortable-chart-widget-js")
                        .removeClass("col-md-6 col-md-8 col-md-4"); // when you'll star resizing, it will remove its size
                    // if ($(ui.element[0]).parents(".sortable-chart-widget-js").attr("key") != "purchases__expenses_breakdown") {
                    $(ui.element[0])
                        .parents(".sortable-chart-widget-js")
                        .addClass("resizeAfterChart");
                    $(ui.element[0]).parents(".sortable-chart-widget-js").css("width", "auto");
                    $(ui.element[0]).parents(".sortable-chart-widget-js").css("flex", "none");

                    // Restrict width more than 100
                    if (ChartHandler.calculateWidth(ui.element[0]) >= 100) {
                        $(this).resizable("option", "maxWidth", ui.size.width);
                    }
                    // Resctrict height screen size.
                    if (ChartHandler.calculateHeight(ui.element[0]) >= 100) {
                        $(this).resizable("option", "maxHeight", ui.size.height);
                    }

                    // resize all highcharts
                    try {
                        const allHighCharts = $('.ds-highcharts');
                        _.each(allHighCharts, chartElement => {
                            const index = $(chartElement).data('highcharts-chart');
                            let highChart = highCharts.charts[index];
                            if (highChart) {
                                highChart.reflow();
                            }
                        });
                    } catch (e) {

                    }

                    // will not apply on Expenses breakdown
                    $(ui.element[0]).parents(".sortable-chart-widget-js").css("width", chartWidth);
                    // $(ui.element[0]).parents(".sortable-chart-widget-js").css("height", chartHeight);

                    if (localStorage.getItem($(ui.element[0]).parents(".sortable-chart-widget-js").attr('chart-slug'))) {
                        let storeObj = JSON.parse(localStorage.getItem($(ui.element[0]).parents(".sortable-chart-widget-js").attr('chart-slug')))
                        localStorage.setItem($(ui.element[0]).parents(".sortable-chart-widget-js").attr('chart-slug'), JSON.stringify({
                            position: storeObj.position,
                            width: chartWidth,
                            height: chartHeight
                        }));
                    } else {
                        localStorage.setItem($(ui.element[0]).parents(".sortable-chart-widget-js").attr('chart-slug'), JSON.stringify({
                            position: $(ui.element[0]).parents(".sortable-chart-widget-js").attr("position"),
                            width: chartWidth,
                            height: chartHeight
                        }));
                    }

                    let id = ui.element[0].id;
                    if(id == 'newcardb1'){
                        $("#colCalendar").css("flex", "1");
                        $("#colCalendar").css("width", "0");
                        $("#newcardb2").css("width", "auto");
                    }else{
                        $("#colEmployeeList").css("flex", "1");
                        $("#colEmployeeList").css("width", "0");
                        $("#newcardb1").css("width", "auto");
                    }
                },
            });
        }, 200);
    }

    tempObj.resizableFunction();

    $(document).on("change", "#chkmyAppointments", function() {
        if (JSON.parse(seeOwnAppointments) == true) {
            localStorage.setItem('CloudAppointmentSeeOwnAppointmentsOnly__', false);
        } else {
            localStorage.setItem('CloudAppointmentSeeOwnAppointmentsOnly__', true);
        }
        // FlowRouter.go('/dashboardsalesmanager', '_self');
        // Meteor._reload.reload();
        setTimeout(() => {
            location.reload();
        }, 200);
        // FlowRouter.reload();
    });
});

Template.appointments.events({
    'click input[name="frequencyRadio"]': function(event) {
        if (event.target.id == "frequencyMonthly") {
            document.getElementById("monthlySettings").style.display = "block";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else if (event.target.id == "frequencyWeekly") {
            document.getElementById("weeklySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else if (event.target.id == "frequencyDaily") {
            document.getElementById("dailySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else if (event.target.id == "frequencyOnetimeonly") {
            document.getElementById("oneTimeOnlySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
        } else {
            $("#copyFrequencyModal").modal('toggle');
        }
    },
    'click input[name="settingsMonthlyRadio"]': function(event) {
        if (event.target.id == "settingsMonthlyEvery") {
            $('.settingsMonthlyEveryOccurence').attr('disabled', false);
            $('.settingsMonthlyDayOfWeek').attr('disabled', false);
            $('.settingsMonthlySpecDay').attr('disabled', true);
        } else if (event.target.id == "settingsMonthlyDay") {
            $('.settingsMonthlySpecDay').attr('disabled', false);
            $('.settingsMonthlyEveryOccurence').attr('disabled', true);
            $('.settingsMonthlyDayOfWeek').attr('disabled', true);
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    'click input[name="dailyRadio"]': function(event) {
        if (event.target.id == "dailyEveryDay") {
            $('.dailyEveryXDays').attr('disabled', true);
        } else if (event.target.id == "dailyWeekdays") {
            $('.dailyEveryXDays').attr('disabled', true);
        } else if (event.target.id == "dailyEvery") {
            $('.dailyEveryXDays').attr('disabled', false);
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    // display settings
    "click .chkProductName": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colProductName").css("display", "table-cell");
            $(".colProductName").css("padding", ".75rem");
            $(".colProductName").css("vertical-align", "top");
        } else {
            $(".colProductName").css("display", "none");
        }
    },
    "click .chkDescription": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colDescription").css("display", "table-cell");
            $(".colDescription").css("padding", ".75rem");
            $(".colDescription").css("vertical-align", "top");
        } else {
            $(".colDescription").css("display", "none");
        }
    },
    "click .chkQty": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colQty").css("display", "table-cell");
            $(".colQty").css("padding", ".75rem");
            $(".colQty").css("vertical-align", "top");
        } else {
            $(".colQty").css("display", "none");
        }
    },
    "click .chkBackOrder": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colBO").css("display", "table-cell");
            $(".colBO").css("padding", ".75rem");
            $(".colBO").css("vertical-align", "top");
        } else {
            $(".colBO").css("display", "none");
        }
    },
    "click .chkShipped": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colShipped").css("display", "table-cell");
            $(".colShipped").css("padding", ".75rem");
            $(".colShipped").css("vertical-align", "top");
        } else {
            $(".colShipped").css("display", "none");
        }
    },
    "click .chkOrdered": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colOrdered").css("display", "table-cell");
            $(".colOrdered").css("padding", ".75rem");
            $(".colOrdered").css("vertical-align", "top");
        } else {
            $(".colOrdered").css("display", "none");
        }
    },

    "click .chkCostPrice": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colCostPrice").css("display", "table-cell");
            $(".colCostPrice").css("padding", ".75rem");
            $(".colCostPrice").css("vertical-align", "top");
        } else {
            $(".colCostPrice").css("display", "none");
        }
    },
    "click .chkSalesLinesCustField1": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colSalesLinesCustField1").css("display", "table-cell");
            $(".colSalesLinesCustField1").css("padding", ".75rem");
            $(".colSalesLinesCustField1").css("vertical-align", "top");
        } else {
            $(".colSalesLinesCustField1").css("display", "none");
        }
    },
    "click .chkTaxRate": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colTaxRate").css("display", "table-cell");
            $(".colTaxRate").css("padding", ".75rem");
            $(".colTaxRate").css("vertical-align", "top");
        } else {
            $(".colTaxRate").css("display", "none");
        }
    },
    "click .chkUnits": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colUOM").css("display", "table-cell");
            $(".colUOM").css("padding", ".75rem");
            $(".colUOM").css("vertical-align", "top");
        } else {
            $(".colUOM").css("display", "none");
        }
    },
    "click .chkTaxCode": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colTaxCode").css("display", "table-cell");
            $(".colTaxCode").css("padding", ".75rem");
            $(".colTaxCode").css("vertical-align", "top");
        } else {
            $(".colTaxCode").css("display", "none");
        }
    },

    "click .chkTaxAmount": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colTaxAmount").css("display", "table-cell");
            $(".colTaxAmount").css("padding", ".75rem");
            $(".colTaxAmount").css("vertical-align", "top");
        } else {
            $(".colTaxAmount").css("display", "none");
        }
    },

    "click .chkAmount": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colAmount").css("display", "table-cell");
            $(".colAmount").css("padding", ".75rem");
            $(".colAmount").css("vertical-align", "top");

            $(".chkAmountInc").prop("checked", false);
            $(".colAmountInc").css("display", "none");
        } else {
            $(".colAmount").css("display", "none");

            $(".chkAmountInc").prop("checked", true);
            $(".colAmountInc").css("display", "table-cell");
            $(".colAmountInc").css("padding", ".75rem");
            $(".colAmountInc").css("vertical-align", "top");
        }
    },
    "click .chkAmountInc": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colAmountInc").css("display", "table-cell");
            $(".colAmountInc").css("padding", ".75rem");
            $(".colAmountInc").css("vertical-align", "top");

            $(".chkAmount").prop("checked", false);
            $(".colAmount").css("display", "none");
        } else {
            $(".colAmountInc").css("display", "none");

            $(".chkAmount").prop("checked", true);
            $(".colAmount").css("display", "table-cell");
            $(".colAmount").css("padding", ".75rem");
            $(".colAmount").css("vertical-align", "top");
        }
    },

    "click .chkUnitPrice": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colUnitPrice").css("display", "table-cell");
            $(".colUnitPrice").css("padding", ".75rem");
            $(".colUnitPrice").css("vertical-align", "top");

            $(".chkUnitPriceInc").prop("checked", false);
            $(".colUnitPriceInc").css("display", "none");
        } else {
            $(".colUnitPrice").css("display", "none");

            $(".chkUnitPriceInc").prop("checked", true);
            $(".colUnitPriceInc").css("display", "table-cell");
            $(".colUnitPriceInc").css("padding", ".75rem");
            $(".colUnitPriceInc").css("vertical-align", "top");
        }
    },
    "click .chkUnitPriceInc": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colUnitPriceInc").css("display", "table-cell");
            $(".colUnitPriceInc").css("padding", ".75rem");
            $(".colUnitPriceInc").css("vertical-align", "top");

            $(".chkUnitPrice").prop("checked", false);
            $(".colUnitPrice").css("display", "none");
        } else {
            $(".colUnitPriceInc").css("display", "none");

            $(".chkUnitPrice").prop("checked", true);
            $(".colUnitPrice").css("display", "table-cell");
            $(".colUnitPrice").css("padding", ".75rem");
            $(".colUnitPrice").css("vertical-align", "top");
        }
    },

    "click .chkDiscount": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colDiscount").css("display", "table-cell");
            $(".colDiscount").css("padding", ".75rem");
            $(".colDiscount").css("vertical-align", "top");
        } else {
            $(".colDiscount").css("display", "none");
        }
    },
    "click .chkSerialNo": function(event) {
        if ($(event.target).is(":checked")) {
            $(".colSerialNo").css("display", "table-cell");
            $(".colSerialNo").css("padding", ".75rem");
            $(".colSerialNo").css("vertical-align", "top");
        } else {
            $(".colSerialNo").css("display", "none");
        }
    },
    // display settings

    "change .rngRangeProductName": function(event) {
        let range = $(event.target).val();
        $(".spWidthProductName").html(range + "%");
        $(".colProductName").css("width", range + "%");
    },
    "change .rngRangeDescription": function(event) {
        let range = $(event.target).val();
        $(".spWidthDescription").html(range + "%");
        $(".colDescription").css("width", range + "%");
    },
    "change .rngRangeQty": function(event) {
        let range = $(event.target).val();
        $(".spWidthQty").html(range + "%");
        $(".colQty").css("width", range + "%");
    },
    "change .rngRangeUnitPrice": function(event) {
        let range = $(event.target).val();
        $(".spWidthUnitPrice").html(range + "%");
        $(".colUnitPrice").css("width", range + "%");
    },
    "change .rngRangeTaxRate": function(event) {
        let range = $(event.target).val();
        $(".spWidthTaxRate").html(range + "%");
        $(".colTaxRate").css("width", range + "%");
    },
    "change .rngRangeAmountInc": function(event) {
        let range = $(event.target).val();
        //$(".spWidthAmount").html(range + '%');
        $(".colAmountInc").css("width", range + "%");
    },
    "change .rngRangeAmountEx": function(event) {
        let range = $(event.target).val();
        //$(".spWidthAmount").html(range + '%');
        $(".colAmountEx").css("width", range + "%");
    },
    "change .rngRangeTaxAmount": function(event) {
        let range = $(event.target).val();
        //$(".spWidthAmount").html(range + '%');
        $(".colTaxAmount").css("width", range + "%");
    },
    "change .rngRangeDiscount": function(event) {
        let range = $(event.target).val();
        $(".colDiscount").css("width", range + "%");
    },
    "change .rngRangeSerialLot": function(event) {
        let range = $(event.target).val();
        $(".colSerialNo").css("width", range + "%");
    },
    "change .rngRangeTaxCode": function(event) {
        let range = $(event.target).val();
        $(".colTaxCode").css("width", range + "%");
    },
    "change .rngRangeCostPrice": function(event) {
        let range = $(event.target).val();
        $(".spWidthCostPrice").html(range + "%");
        $(".colCostPrice").css("width", range + "%");
    },
    "change .rngRangeSalesLinesCustField1": function(event) {
        let range = $(event.target).val();
        $(".spWidthSalesLinesCustField1").html(range + "%");
        $(".colSalesLinesCustField1").css("width", range + "%");
    },
    "change .rngRangeUnits": function(event) {
        let range = $(event.target).val();
        // $(".spWidthAmount").html(range + '%');
        $(".colUOM").css("width", range + "%");
    },
    "blur .divcolumn": function(event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);
    },

    // custom field displaysettings
    "click .btnSaveGridSettings": function() {
        playSaveAudio();
        let lineItems = [];
        let organisationService = new OrganisationService();

        $(".fullScreenSpin").css("display", "inline-block");

        $(".displaySettings").each(function(index) {
            var $tblrow = $(this);
            var fieldID = $tblrow.attr("custid") || 0;
            var colTitle = $tblrow.find(".divcolumn").text() || "";
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(":checked")) {
                colHidden = true;
            } else {
                colHidden = false;
            }
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass,
            };

            lineItems.push(lineItemObj);

            if (fieldID) {
                objDetails1 = {
                    type: "TCustomFieldList",
                    fields: {
                        Active: colHidden,
                        ID: parseInt(fieldID),
                        Description: colTitle,
                    },
                };
            } else {
                objDetails1 = {
                    type: "TCustomFieldList",
                    fields: {
                        Active: colHidden,
                        DataType: "ftString",
                        Description: colTitle,
                        ListType: "ltSalesLines", // tempcode until InvoiceLines is added on backend
                    },
                };
            }

            organisationService
                .saveCustomField(objDetails1)
                .then(function() {
                    $(".fullScreenSpin").css("display", "none");
                    $("#myModal2").modal("hide");
                })
                .catch(function() {
                    $(".fullScreenSpin").css("display", "none");
                    $("#myModal2").modal("hide");
                });
        });

        setTimeout(() => {
            // tempcode until InvoiceLines is added on backend
            sideBarService
                .getAllCustomFieldsWithQuery("ltSalesLines")
                .then(function(data) {
                    addVS1Data("TltSaleslines", JSON.stringify(data));
                });
        }, 8000);
    },

    // custom field displaysettings
    "click .btnResetGridSettings": async function() {
        let templateObject = Template.instance();
        let reset_data = [];
        if (localStorage.getItem("CloudSalesQtyOnly")) {
            reset_data = [
                { label: "Product Name", class: "colProductName", active: true },
                { label: "Description", class: "colDescription", active: true },
                { label: "Qty", class: "colQty", active: true },
                // { label: 'Ordered', class: 'colOrdered', active: false },
                // { label: 'Shipped', class: 'colShipped', active: false },
                // { label: 'BO', class: 'colBO', active: false },
                { label: "Unit Price (Ex)", class: "colUnitPrice", active: true },
                { label: "Unit Price (Inc)", class: "colUnitPriceInc", active: false },
                { label: "Disc %", class: "colDiscount", active: true },
                { label: "Cost Price", class: "colCostPrice", active: false },
                {
                    label: "SalesLines CustField1",
                    class: "colSalesLinesCustField1",
                    active: false,
                },
                { label: "Tax Rate", class: "colTaxRate", active: false },
                { label: "Tax Code", class: "colTaxCode", active: true },
                { label: "Tax Amt", class: "colTaxAmount", active: true },
                { label: "Serial/Lot No", class: "colSerialNo", active: true },
                { label: "Amount (Ex)", class: "colAmount", active: true },
                { label: "Amount (Inc)", class: "colAmountInc", active: false },
                { label: "Units", class: "colUOM", active: false },
            ];
        } else {
            reset_data = [
                { label: "Product Name", class: "colProductName", active: true },
                { label: "Description", class: "colDescription", active: true },
                // { label: 'Qty', class: 'colQty', active: false },
                { label: "Ordered", class: "colOrdered", active: true },
                { label: "Shipped", class: "colShipped", active: true },
                { label: "BO", class: "colBO", active: true },
                { label: "Unit Price (Ex)", class: "colUnitPrice", active: true },
                { label: "Unit Price (Inc)", class: "colUnitPriceInc", active: false },
                { label: "Disc %", class: "colDiscount", active: true },
                { label: "Cost Price", class: "colCostPrice", active: false },
                {
                    label: "SalesLines CustField1",
                    class: "colSalesLinesCustField1",
                    active: false,
                },
                { label: "Tax Rate", class: "colTaxRate", active: false },
                { label: "Tax Code", class: "colTaxCode", active: true },
                { label: "Tax Amt", class: "colTaxAmount", active: true },
                { label: "Serial/Lot No", class: "colSerialNo", active: true },
                { label: "Amount (Ex)", class: "colAmount", active: true },
                { label: "Amount (Inc)", class: "colAmountInc", active: false },
                { label: "Units", class: "colUOM", active: false },
            ];
        }
        var datable = $("#tblInvoiceLine");
        var datable = $("#tblInvoiceLine").DataTable();

        for (let r = 0; r < reset_data.length; r++) {
            customData = {
                active: reset_data[r].active,
                id: 0,
                custfieldlabel: reset_data[r].label,
                datatype: "",
                isempty: false,
                iscombo: false,
                dropdown: null,
            };
            custFields.push(customData);
        }
        $(".displaySettings").each(function(index) {
            var $tblrow = $(this);
            $tblrow.find(".divcolumn").text(reset_data[index].label);
            $tblrow
                .find(".custom-control-input")
                .prop("checked", reset_data[index].active);

            // var title = datable.column( index ).header();
            var title = $("#tblInvoiceLine").find("th").eq(index);
            $(title).html(reset_data[index].label);

            if (reset_data[index].active) {
                $("." + reset_data[index].class).css("display", "table-cell");
                $("." + reset_data[index].class).css("padding", ".75rem");
                $("." + reset_data[index].class).css("vertical-align", "top");
            } else {
                $("." + reset_data[index].class).css("display", "none");
            }
        });
    },

    "click .btnResetSettings": function() {
      Meteor._reload.reload();
    },
	"click .img_new_attachment_btn": function() {
        $("#img-attachment-upload").trigger("click");
    },
    "click .closeView": function() {
        $("#files_view").modal("hide");
    },
    "click .calendar .days li": function() {
        FlowRouter.go("/newappointments");
    },
    "click #btnCloseStartAppointmentModal": function() {
        $("#startAppointmentModal").modal("hide");
    },
    "click #btnCloseSaveAppointmentModal": function() {
        $("#saveAppointmentModal").modal("hide");
    },"change #chkSMSCustomer": function() {
        if ($("#chkSMSCustomer").is(":checked")) {
            const templateObject = Template.instance();
            templateObject.checkSMSSettings();
        }
    },
    "change #chkSMSUser": function() {
        if ($("#chkSMSUser").is(":checked")) {
            const templateObject = Template.instance();
            templateObject.checkSMSSettings();
        }
    },"click #btnCloseStopAppointment": function() {
        document.getElementById("tActualEndTime").value = "";
        document.getElementById("txtActualHoursSpent").value = "0";
    },"change #showSaturday1": function() {
        var checkbox = document.querySelector("#showSaturday");
        if (checkbox.checked) {} else {}
    },
    "change #showSunday1": function() {
        var checkbox = document.querySelector("#showSunday");
        if (checkbox.checked) {} else {}
    },
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

                        appointmentService
                            .saveAppointment(objectData)
                            .then(function() {
                                $("#event-modal").modal("hide");
                                sideBarService
                                    .getAllAppointmentList(initialDataLoad, 0)
                                    .then(function(dataList) {
                                        addVS1Data("TAppointment", JSON.stringify(dataList))
                                            .then(function() {
                                                setTimeout(function() {
                                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                                    } else {
                                                        window.open("/appointments", "_self");
                                                    }
                                                }, 500);
                                            })
                                            .catch(function() {
                                                if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                    window.open(localStorage.getItem("appt_historypage"), "_self");
                                                } else {
                                                    window.open("/appointments", "_self");
                                                }
                                            });
                                    })
                                    .catch(function() {
                                        if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                            window.open(localStorage.getItem("appt_historypage"), "_self");
                                        } else {
                                            window.open("/appointments", "_self");
                                        }
                                    });
                            })
                            .catch(function() {
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
                        oPost.open(
                            "POST",
                            URLRequest +
                            erpGet.ERPIPAddress +
                            ":" +
                            erpGet.ERPPort +
                            "/" +
                            'erpapi/VS1_Cloud_Task/Method?Name="VS1_DeleteAllAppts"',
                            true
                        );
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
                                    sideBarService
                                        .getAllAppointmentList(initialDataLoad, 0)
                                        .then(function(data) {
                                            addVS1Data("TAppointment", JSON.stringify(data))
                                                .then(function() {
                                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                                    } else {
                                                        window.open("/appointments", "_self");
                                                    }
                                                })
                                                .catch(function() {
                                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                                    } else {
                                                        window.open("/appointments", "_self");
                                                    }
                                                });
                                        })
                                        .catch(function() {
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
            oPost.open(
                "POST",
                URLRequest +
                erpGet.ERPIPAddress +
                ":" +
                erpGet.ERPPort +
                "/" +
                'erpapi/VS1_Cloud_Task/Method?Name="VS1_InvoiceAppt"',
                true
            );
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
                        appointmentService
                            .saveAppointment(objectDataConverted)
                            .then(function() {
                                $(".modal-backdrop").css("display", "none");
                                FlowRouter.go(
                                    "/invoicelist?success=true&apptId=" + parseInt(id)
                                );
                            })
                            .catch(function() {
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
    'click .btnSaveFrequency': async function() {
        playSaveAudio();
        let templateObject = Template.instance();
        // let selectedType = '';
        let frequencyVal = '';
        let startDate = '';
        let finishDate = '';
        let convertedStartDate = '';
        let convertedFinishDate = '';
        let sDate = '';
        let fDate = '';
        let monthDate = '';
        let ofMonths = '';
        let isFirst = true;
        let everyWeeks = '';
        let selectDays = '';
        let dailyRadioOption = '';
        let everyDays = '';

        // const basedOnTypes = $('#basedOnSettings input.basedOnSettings');
        // let basedOnTypeAttr = '';
        let basedOnTypeAttr = 'F,';

        var erpGet = erpDb();
        let sDate2 = '';
        let fDate2 = '';

        setTimeout(async function() {
            // basedOnTypes.each(function () {
            //   if ($(this).prop('checked')) {
            //     selectedType = $(this).attr('id');
            //     if (selectedType === "basedOnFrequency") { basedOnTypeAttr += 'F,'}
            //     if (selectedType === "basedOnPrint") { basedOnTypeTexts += 'On Print, '; basedOnTypeAttr += 'P,'; }
            //     if (selectedType === "basedOnSave") { basedOnTypeTexts += 'On Save, '; basedOnTypeAttr += 'S,'; }
            //     if (selectedType === "basedOnTransactionDate") { basedOnTypeTexts += 'On Transaction Date, '; basedOnTypeAttr += 'T,'; }
            //     if (selectedType === "basedOnDueDate") { basedOnTypeTexts += 'On Due Date, '; basedOnTypeAttr += 'D,'; }
            //     if (selectedType === "basedOnOutstanding") { basedOnTypeTexts += 'If Outstanding, '; basedOnTypeAttr += 'O,'; }
            //     if (selectedType === "basedOnEvent") {
            //       if ($('#settingsOnEvents').prop('checked')) { basedOnTypeTexts += 'On Event(On Logon), '; basedOnTypeAttr += 'EN,'; }
            //       if ($('#settingsOnLogout').prop('checked')) { basedOnTypeTexts += 'On Event(On Logout), '; basedOnTypeAttr += 'EU,'; }
            //     }
            //   }
            // });
            // if (basedOnTypeTexts != '') basedOnTypeTexts = basedOnTypeTexts.slice(0, -2);
            // if (basedOnTypeAttr != '') basedOnTypeAttr = basedOnTypeAttr.slice(0, -1);

            let radioFrequency = $('input[type=radio][name=frequencyRadio]:checked').attr('id');
            frequencyVal = radioFrequency + '@';
            const values = basedOnTypeAttr.split(',');
            if (values.includes('F')) {
                if (radioFrequency == "frequencyMonthly") {
                    isFirst = true;
                    monthDate = $("#sltDay").val().replace('day', '');
                    $(".ofMonthList input[type=checkbox]:checked").each(function() {
                        ofMonths += isFirst ? $(this).val() : ',' + $(this).val();
                        isFirst = false;
                    });
                    startDate = $('#edtMonthlyStartDate').val();
                    finishDate = $('#edtMonthlyFinishDate').val();
                    frequencyVal += monthDate + '@' + ofMonths;
                } else if (radioFrequency == "frequencyWeekly") {
                    isFirst = true;
                    everyWeeks = $("#weeklyEveryXWeeks").val();
                    let sDay = -1;
                    $(".selectDays input[type=checkbox]:checked").each(function() {
                        sDay = templateObject.getDayNumber($(this).val());
                        selectDays += isFirst ? sDay : ',' + sDay;
                        isFirst = false;
                    });
                    startDate = $('#edtWeeklyStartDate').val();
                    finishDate = $('#edtWeeklyFinishDate').val();
                    frequencyVal += everyWeeks + '@' + selectDays;
                } else if (radioFrequency == "frequencyDaily") {
                    dailyRadioOption = $('#dailySettings input[type=radio]:checked').attr('id');
                    everyDays = $("#dailyEveryXDays").val();
                    startDate = $('#edtDailyStartDate').val();
                    finishDate = $('#edtDailyFinishDate').val();
                    frequencyVal += dailyRadioOption + '@' + everyDays;
                } else if (radioFrequency == "frequencyOnetimeonly") {
                    startDate = $('#edtOneTimeOnlyDate').val();
                    finishDate = $('#edtOneTimeOnlyDate').val();
                    $('#edtOneTimeOnlyTimeError').css('display', 'none');
                    $('#edtOneTimeOnlyDateError').css('display', 'none');
                    frequencyVal = radioFrequency;
                }
            }
            $('#copyFrequencyModal').modal('toggle');
            convertedStartDate = startDate ? startDate.split('/')[2] + '-' + startDate.split('/')[1] + '-' + startDate.split('/')[0] : '';
            convertedFinishDate = finishDate ? finishDate.split('/')[2] + '-' + finishDate.split('/')[1] + '-' + finishDate.split('/')[0] : '';
            sDate = convertedStartDate ? moment(convertedStartDate + ' ' + copyStartTime).format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm");
            fDate = convertedFinishDate ? moment(convertedFinishDate + ' ' + copyStartTime).format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm");
            sDate2 = convertedStartDate ? moment(convertedStartDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
            fDate2 = convertedFinishDate ? moment(convertedFinishDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
            $(".fullScreenSpin").css("display", "inline-block");

            var currentAppt = $("#appID").val();
            currentAppt = parseInt(currentAppt);
            // objDetails = {
            //     type: "TAppointmentEx",
            //     fields: {
            //         ID: currentAppt,
            //         TypeOfBasedOn: selectedType,
            //         FrequenctyValues: frequencyVal,
            //         CopyStartDate: sDate2,
            //         CopyFinishDate: fDate2,
            //     }
            // };
            // var result = await appointmentService.saveAppointment(objDetails);
            let period = ""; // 0
            let days = [];
            let i = 0;
            let frequency2 = 0;
            let weekdayObj = {
                saturday: 0,
                sunday: 0,
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
            };
            let repeatMonths = [];
            let repeatDates = [];
            if (radioFrequency == "frequencyDaily" || radioFrequency == "frequencyOnetimeonly") {
                period = "Daily"; // 0
                if (radioFrequency == "frequencyDaily") {
                    frequency2 = parseInt(everyDays);
                    if (dailyRadioOption == "dailyEveryDay") {
                        for (i = 0; i < 7; i++) {
                            days.push(i);
                        }
                    }
                    if (dailyRadioOption == "dailyWeekdays") {
                        for (i = 1; i < 6; i++) {
                            days.push(i);
                        }
                    }
                    if (dailyRadioOption == "dailyEvery") {

                    }
                } else {
                    repeatDates.push({
                        "Dates": sDate2
                    })
                    frequency2 = 1;
                }
            }
            if (radioFrequency == "frequencyWeekly") {
                period = "Weekly"; // 1
                frequency2 = parseInt(everyWeeks);
                let arrSelectDays = selectDays.split(",");
                for (i = 0; i < arrSelectDays.length; i++) {
                    days.push(arrSelectDays[i]);
                    if (parseInt(arrSelectDays[i]) == 0)
                        weekdayObj.sunday = 1;
                    if (parseInt(arrSelectDays[i]) == 1)
                        weekdayObj.monday = 1;
                    if (parseInt(arrSelectDays[i]) == 2)
                        weekdayObj.tuesday = 1;
                    if (parseInt(arrSelectDays[i]) == 3)
                        weekdayObj.wednesday = 1;
                    if (parseInt(arrSelectDays[i]) == 4)
                        weekdayObj.thursday = 1;
                    if (parseInt(arrSelectDays[i]) == 5)
                        weekdayObj.friday = 1;
                    if (parseInt(arrSelectDays[i]) == 6)
                        weekdayObj.saturday = 1;
                }
            }
            if (radioFrequency == "frequencyMonthly") {
                period = "Monthly"; // 0
                repeatMonths = convertStrMonthToNum(ofMonths);
                repeatDates = getRepeatDates(sDate2, fDate2, repeatMonths, monthDate);
                frequency2 = parseInt(monthDate);
            }

            if (days.length > 0) {
                for (let x = 0; x < days.length; x++) {
                    let dayObj = {
                        Name: "VS1_RepeatAppointment",
                        Params: {
                            CloudUserName: erpGet.ERPUsername,
                            CloudPassword: erpGet.ERPPassword,
                            AppointID: currentAppt,
                            Repeat_Frequency: frequency2,
                            Repeat_Period: period,
                            Repeat_BaseDate: sDate2,
                            Repeat_finalDateDate: fDate2,
                            Repeat_Saturday: weekdayObj.saturday,
                            Repeat_Sunday: weekdayObj.sunday,
                            Repeat_Monday: weekdayObj.monday,
                            Repeat_Tuesday: weekdayObj.tuesday,
                            Repeat_Wednesday: weekdayObj.wednesday,
                            Repeat_Thursday: weekdayObj.thursday,
                            Repeat_Friday: weekdayObj.friday,
                            Repeat_Holiday: 0,
                            Repeat_Weekday: parseInt(days[x].toString()),
                            Repeat_MonthOffset: 0,
                        },
                    };
                    var myString = '"JsonIn"' + ":" + JSON.stringify(dayObj);
                    var oPost = new XMLHttpRequest();
                    oPost.open(
                        "POST",
                        URLRequest +
                        erpGet.ERPIPAddress +
                        ":" +
                        erpGet.ERPPort +
                        "/" +
                        'erpapi/VS1_Cloud_Task/Method?Name="VS1_RepeatAppointment"',
                        true
                    );
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
                                if (x == days.length - 1) {
                                    sideBarService
                                        .getAllAppointmentList(initialDataLoad, 0)
                                        .then(function(data) {
                                            addVS1Data("TAppointment", JSON.stringify(data))
                                                .then(function() {
                                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                                    } else {
                                                        window.open("/appointments", "_self");
                                                    }
                                                })
                                                .catch(function() {
                                                    if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                        window.open(localStorage.getItem("appt_historypage"), "_self");
                                                    } else {
                                                        window.open("/appointments", "_self");
                                                    }
                                                });
                                        })
                                        .catch(function() {
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        });
                                }
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
            } else {
                let dayObj = {};
                if (radioFrequency == "frequencyOnetimeonly" || radioFrequency == "frequencyMonthly") {
                    dayObj = {
                        Name: "VS1_RepeatAppointment",
                        Params: {
                            CloudUserName: erpGet.ERPUsername,
                            CloudPassword: erpGet.ERPPassword,
                            AppointID: currentAppt,
                            Repeat_Dates: repeatDates,
                            Repeat_Frequency: frequency2,
                            Repeat_Period: period,
                            Repeat_BaseDate: sDate2,
                            Repeat_finalDateDate: fDate2,
                            Repeat_Saturday: weekdayObj.saturday,
                            Repeat_Sunday: weekdayObj.sunday,
                            Repeat_Monday: weekdayObj.monday,
                            Repeat_Tuesday: weekdayObj.tuesday,
                            Repeat_Wednesday: weekdayObj.wednesday,
                            Repeat_Thursday: weekdayObj.thursday,
                            Repeat_Friday: weekdayObj.friday,
                            Repeat_Holiday: 0,
                            Repeat_Weekday: 0,
                            Repeat_MonthOffset: 0,
                        },
                    };
                } else {
                    dayObj = {
                        Name: "VS1_RepeatAppointment",
                        Params: {
                            CloudUserName: erpGet.ERPUsername,
                            CloudPassword: erpGet.ERPPassword,
                            AppointID: currentAppt,
                            Repeat_Frequency: frequency2,
                            Repeat_Period: period,
                            Repeat_BaseDate: sDate2,
                            Repeat_finalDateDate: fDate2,
                            Repeat_Saturday: weekdayObj.saturday,
                            Repeat_Sunday: weekdayObj.sunday,
                            Repeat_Monday: weekdayObj.monday,
                            Repeat_Tuesday: weekdayObj.tuesday,
                            Repeat_Wednesday: weekdayObj.wednesday,
                            Repeat_Thursday: weekdayObj.thursday,
                            Repeat_Friday: weekdayObj.friday,
                            Repeat_Holiday: 0,
                            Repeat_Weekday: 0,
                            Repeat_MonthOffset: 0,
                        },
                    };
                }
                var myString = '"JsonIn"' + ":" + JSON.stringify(dayObj);
                var oPost = new XMLHttpRequest();
                oPost.open(
                    "POST",
                    URLRequest +
                    erpGet.ERPIPAddress +
                    ":" +
                    erpGet.ERPPort +
                    "/" +
                    'erpapi/VS1_Cloud_Task/Method?Name="VS1_RepeatAppointment"',
                    true
                );
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
                            sideBarService
                                .getAllAppointmentList(initialDataLoad, 0)
                                .then(function(data) {
                                    addVS1Data("TAppointment", JSON.stringify(data))
                                        .then(function() {
                                            window.open("/appointments", "_self");
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        })
                                        .catch(function() {
                                            if (localStorage.getItem("appt_historypage") != undefined && localStorage.getItem("appt_historypage") != "") {
                                                window.open(localStorage.getItem("appt_historypage"), "_self");
                                            } else {
                                                window.open("/appointments", "_self");
                                            }
                                        });
                                })
                                .catch(function() {
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
            }
            FlowRouter.go("/appointmentlist");
            $('.modal-backdrop').css('display', 'none');
        }, delayTimeAfterSound);
    },
    "click .btnAddAttachmentSave": function() {
        let appointmentService = new AppointmentService();
        let templateObject = Template.instance();
        let uploadedItems = templateObject.uploadedFiles.get();
        let id = document.getElementById("updateID").value || "0";
        $(".fullScreenSpin").css("display", "inline-block");
        if (id == "0" || id == null) {
            // $('#event-modal').modal('hide');
            $(".fullScreenSpin").css("display", "none");
            $("#myModalAttachment").modal("hide");
        } else {
            let objectData = {
                type: "TAppointmentEx",
                fields: {
                    Id: parseInt(id),
                    Attachments: uploadedItems,
                },
            };

            appointmentService
                .saveAppointment(objectData)
                .then(function() {
                    $("#myModalAttachment").modal("hide");
                    sideBarService
                        .getAllAppointmentList(initialDataLoad, 0)
                        .then(function(dataList) {
                            addVS1Data("TAppointment", JSON.stringify(dataList))
                                .then(function() {
                                    // setTimeout(function () {
                                    $(".fullScreenSpin").css("display", "none");
                                    // }, 500);
                                })
                                .catch(function() {
                                    $(".fullScreenSpin").css("display", "none");
                                });
                        })
                        .catch(function() {
                            $(".fullScreenSpin").css("display", "none");
                        });
                })
                .catch(function() {
                    $(".fullScreenSpin").css("display", "none");
                });
        }

        //});
    },
    "click #btnDeleteDisbale span": function() {
        swal({
            title: "Oops...",
            text: "You don't have access to delete appointment",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
        }).then((results) => {
            if (results.value) {} else if (results.dismiss === "cancel") {}
        });
    },
    "click #btnOptionsDisable span": function() {
        swal({
            title: "Oops...",
            text: "You don't have access to appointment options",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
        }).then((results) => {
            if (results.value) {} else if (results.dismiss === "cancel") {}
        });
    },
    "click #btnCreateInvoiceDisable span": function() {
        swal({
            title: "Oops...",
            text: "You don't have access to create invoice",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
        }).then((results) => {
            if (results.value) {} else if (results.dismiss === "cancel") {}
        });
    },
    "click #btnCopyOptionsDisable span": function() {
        swal({
            title: "Oops...",
            text: "You don't have access to copy appointment",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
        }).then((results) => {
            if (results.value) {} else if (results.dismiss === "cancel") {}
        });
    },
    "change #lunch": function() {
        $("#break").prop("checked", false);
        $("#purchase").prop("checked", false);
    },
    "change #break": function() {
        $("#lunch").prop("checked", false);
        $("#purchase").prop("checked", false);
    },
    "change #purchase": function() {
        $("#break").prop("checked", false);
        $("#lunch").prop("checked", false);
    },
   'click .addLeaveEmp': function(event) {
        templateObject = Template.instance();
        let empID = $(event.currentTarget).attr('id').split("_")[1];
        templateObject.empID.set(empID);
        // swal({
        //     title: "Leave Settings",
        //     text: "Do you wish to create leave for this employee?",
        //     type: "question",
        //     showCancelButton: true,
        //     confirmButtonText: "Ok",
        //     cancelButtonText: "Cancel",
        // }).then((result) => {
        //     if (result.value) {
        //     }
        // });
        setTimeout(function() {
            $("#edtEmpID").val(empID);
            $('#removeLeaveRequestBtn').hide();
            $('#newLeaveRequestModal').modal('show');
            $('#newLeaveRequestModal').on('hidden.bs.modal', function() {
                window.open("/appointments", "_self");
            });
        }, 500);
    },
    // 'click .chkServiceCard': function() {
        //  templateObject = Template.instance();
        //  let productFees = templateObject.productFees.get();
        //  let productFeesID = $(event.target).attr('id').split("-")[1];
        //  if ($(event.target).prop('checked') == true) {
        //      productFees.push(productFeesID);
        //  } else {
        //      productFees.splice(productFees.indexOf(productFeesID), 1);
        //  }
        //  templateObject.productFees.set(productFees);
    // },
   "click .btnRemove": function(event) {
        var targetID = $(event.target).closest("tr").attr("id");
        // if ($("#tblExtraProducts tbody>tr").length > 1) {
        $(event.target).closest("tr").remove();
        $("#productCheck-" + targetID).prop("checked", false);
        event.preventDefault();
        // }
        setTimeout(function() {
            $("#btnselProductFees").trigger("click");
        }, 100);
    },
    "click #addRow": () => {
        let tokenid = Random.id();
        var rowData = `<tr class="dnd-moved" id="${tokenid}">
            <td class="thProductName">
                <input class="es-input highlightSelect lineProductName" type="search">
            </td>
            <td class="lineProductDesc colDescription"></td>
            <td class="thCostPrice hiddenColumn" style="text-align: left!important;"></td>
            <td class="thSalesPrice lineSalesPrice" style="text-align: left!important;"></td>
            <td class="thQty hiddenColumn">Quantity</td>
            <td class="thTax hiddenColumn" style="text-align: left!important;">Tax Rate</td>
            <td>
                <span class="table-remove btnRemove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i
                class="fa fa-remove"></i></button></span>
            </td>
            <td class="thExtraSellPrice hiddenColumn">Prouct ID</td>
        </tr>`;

        // rowData.attr("id", tokenid);
        $("#tblExtraProducts tbody").append(rowData);
        setTimeout(function() {
            $("#" + tokenid + " .lineProductName").trigger("click");
        }, 200);
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

Template.appointments.helpers({
    employeerecords: () => {
        return Template.instance()
            .employeerecords.get()
            .sort(function(a, b) {
                if (a.employeeName == "NA") {
                    return 1;
                } else if (b.employeeName == "NA") {
                    return -1;
                }
                return a.employeeName.toUpperCase() > b.employeeName.toUpperCase() ?
                    1 :
                    -1;
            })
            .sort(function(a, b) {
                // return (a.employeeName.toUpperCase() > b.employeeName.toUpperCase());
                if (a.priority == "" || a.priority == "0") {
                    return 1;
                } else if (b.priority == "" || b.priority == "0") {
                    return -1;
                }

                return parseInt(a.priority) > parseInt(b.priority) ? 1 : -1;
            });
    },
    calendarOptions: () => {
        return Template.instance().calendarOptions.get();
    },
    datatablerecords: () => {
        return Template.instance()
            .datatablerecords.get()
            .sort(function(a, b) {
                if (a.productname == "NA") {
                    return 1;
                } else if (b.productname == "NA") {
                    return -1;
                }
                return a.productname.toUpperCase() > b.productname.toUpperCase() ?
                    1 :
                    -1;
            });
    },
    clientrecords: () => {
        return Template.instance().clientrecords.get();
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
        return localStorage.getItem("CloudAppointmentCreateAppointment") || false;
    },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
    isMobileDevices: () => {
        var isMobile = false;
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
                navigator.userAgent
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                navigator.userAgent.substr(0, 4)
            )
        ) {
            isMobile = true;
        }

        return isMobile;
    },
    // custom field displaysettings
    displayfields: () => {
        return Template.instance().displayfields.get();
    },
    extraProductFees: () => {
        return Template.instance().extraProductFees.get();
    },
});

Template.registerHelper("equals", function(a, b) {
    return a === b;
});

Template.registerHelper("and", (a, b) => {
    return a && b;
});

getRegalTime = (date = new Date()) => {
    var coeff = 1000 * 60 * 60;
    return new Date(Math.round(date.getTime() / coeff) * coeff);
};
