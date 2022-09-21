import {
    TaxRateService
} from "../settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CountryService
} from '../../js/country-service';
import {
    SideBarService
} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { startOfDay } from "@fullcalendar/core";
import { AccountService } from "../../accounts/account-service";
import { UtilityService } from "../../utility-service";
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { jsPDF } from "jspdf";
import 'jQuery.print/jQuery.print.js';
let sideBarService = new SideBarService();

Template.emailsettings.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.originScheduleData = new ReactiveVar([]);
    templateObject.employeescheduledrecord = new ReactiveVar([]);
    templateObject.essentialemployeescheduledrecord = new ReactiveVar([]);
    templateObject.formsData = new ReactiveVar([]);
    templateObject.essentialReportSchedules = new ReactiveVar([]);
    templateObject.invoicerecords = new ReactiveVar([]);
    templateObject.correspondences = new ReactiveVar([]);
    templateObject.isAdd = new ReactiveVar(true);
    templateObject.selectedRowID = new ReactiveVar();
    templateObject.formsData.set(
        [
            {
                id: 6,
                name: "Aged Payables"
            },
            {
                id: 134,
                name: "Aged Receivables"
            },
            {
                id: 12,
                name: "Bills"
            },
            {
                id: 21,
                name: "Credits"
            },
            {
                id: 225,
                name: "General Ledger"
            },
            {
                id: 18,
                name: "Cheque"
            },
            {
                id: 1,
                name: "Grouped Reports"
            },
            {
                id: 61,
                name: "Customer Payments"
            },
            {
                id: 54,
                name: "Invoices"
            },
            {
                id: 177,
                name: "Print Statements"
            },
            {
                id: 1464,
                name: "Product Sales Report"
            },
            {
                id: 129,
                name: "Profit and Loss"
            },
            {
                id: 69,
                name: "Purchase Orders"
            },
            {
                id: 70,
                name: "Purchase Report"
            },
            {
                id: 1364,
                name: "Purchase Summary Report"
            },
            {
                id: 71,
                name: "Quotes"
            },
            {
                id: 74,
                name: "Refunds"
            },
            {
                id: 77,
                name: "Sales Orders"
            },
            {
                id: 68,
                name: "Sales Report"
            },
            {
                id: 17544,
                name: "Statements"
            },
            {
                id: 94,
                name: "Supplier Payments"
            },
            {
                id: 278,
                name: "Tax Summary Report"
            },
            {
                id: 140,
                name: "Trial Balance"
            },
        ]
    );
});

Template.emailsettings.onRendered(function () {


    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];

    var countryService = new CountryService();
    let countries = [];
    let employeeScheduledRecord = [];
    let essentailEmployeeScheduledRecord = [];

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'currencyLists', function (error, result) {
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



    function MakeNegative() {
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    $("#date-input,#edtWeeklyStartDate,#dtDueDate,#customdateone,#edtMonthlyStartDate,#edtDailyStartDate,#edtOneTimeOnlyDate").datepicker({
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
    templateObject.assignFrequency = function (frequency) {
        if (frequency == "Weekly") {
            $("#frequencyWeekly").prop('checked', true);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "block";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

        if (frequency == "Daily") {
            $("#frequencyDaily").prop('checked', true);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "block";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

        if (frequency == "Monthly") {
            $("#frequencyMonthly").prop('checked', true);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "block";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

    }

    templateObject.getDayNumber = function (day) {
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

    templateObject.getMonths = function (startDate, endDate) {
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





    templateObject.getDayName = function (day) {
        if (day == 1 || day == 0) {
            $("#formCheck-monday").prop('checked', true);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 2) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', true);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 3) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', true);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 4) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', true);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 5) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', true);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 6) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', true);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 7) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', true);
        }

    }
    templateObject.assignSettings = function (setting) {
        if (setting == "W") {
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $('#frequencyWeekly').trigger('click');
        }

        if (setting == "D") {
            $("#frequencyDaily").trigger('click');
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
        }

        if (setting == "M") {
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $('#frequencyMonthly').prop('checked', false);
        }

        if (setting == "T") {
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").trigger('click');
            $('#frequencyMonthly').prop('checked', false);
        }

    }
    templateObject.getScheduleInfo = function () {
        getVS1Data('TReportSchedules').then(function(dataObject){
            if(dataObject.length > 0) {
                let data = JSON.parse(dataObject[0].data);
                let empData = data.treportschedules;
                templateObject.originScheduleData.set(data.treportschedules);
                var empDataCurr = '';
                $.grep(templateObject.formsData.get(), function (n) {
                    let recipients = [];
                    let recipientIds = [];
                    let formIds = [];
                    empData = empData.filter(emp => emp.fields.Active);
                    for (let i = 0; i < empData.length; i++) {
                        if ((n.id == '1' && empData[i].fields.BeginFromOption === "S") || (n.id == empData[i].fields.FormID && empData[i].fields.BeginFromOption !== "S")) {
                            if (!recipients.includes(empData[i].fields.EmployeeEmailID)) {
                                recipients.push(empData[i].fields.EmployeeEmailID);
                                recipientIds.push(empData[i].fields.EmployeeId);
                            }
                            if (n.id == '1' && empData[i].fields.BeginFromOption === "S") formIds.push(empData[i].fields.FormID);
                            const startDate = empData[i].fields.StartDate.split(' ')[0];
                            const startTime = empData[i].fields.StartDate.split(' ')[1];
    
                            //TODO: Getting BasedOnType from localstorage
                            let basedOnTypeData = localStorage.getItem(`BasedOnType_${n.id}_${empData[i].fields.EmployeeId}`);
                            let basedOnType = basedOnTypeData ? JSON.parse(basedOnTypeData).BasedOnType : '';
                            let basedOnTypeText = '';
                            if (basedOnType.split(',').includes('P')) basedOnTypeText += 'On Print, ';
                            if (basedOnType.split(',').includes('S')) basedOnTypeText += 'On Save, ';
                            if (basedOnType.split(',').includes('T')) basedOnTypeText += 'On Transaction Date, ';
                            if (basedOnType.split(',').includes('D')) basedOnTypeText += 'On Due Date, ';
                            if (basedOnType.split(',').includes('O')) basedOnTypeText += 'If Outstanding, ';
                            if (basedOnType.split(',').includes('EN') || basedOnType.split(',').includes('EU')) {
                                if (basedOnType.split(',').includes('EN')) basedOnTypeText += 'On Event(On Logon), ';
                                if (basedOnType.split(',').includes('EU')) basedOnTypeText += 'On Event(On Logout), ';
                            }
                            if (basedOnTypeText != '') basedOnTypeText = ', ' + basedOnTypeText.slice(0, -2);
    
                            empDataCurr = {
                                employeeid: recipientIds.join('; ') || '',
                                every: empData[i].fields.Every || '',
                                formID: n.id || '',
                                employeeEmailID: recipients.join('; ') || '',
                                formname: n.name || '',
                                basedOnType: basedOnType,
                                basedOnTypeText: basedOnTypeText,
                                frequency: empData[i].fields.Frequency || '',
                                frequencyType: empData[i].fields.FrequencyType || '',
                                id: empData[i].fields.ID || '',
                                monthDays: empData[i].fields.MonthDays || '',
                                nextDueDate: empData[i].fields.NextDueDate || '',
                                startDate: startDate.split('-')[2] + '/' + startDate.split('-')[1] + '/' + startDate.split('-')[0] || '',
                                startTime: startTime.split(':')[0] + ':' + startTime.split(':')[1] || '',
                                weekDay: empData[i].fields.WeekDay || '',
                                satAction: empData[i].fields.SatAction || '',
                                sunAction: empData[i].fields.SunAction || '',
                                beginFromOption: empData[i].fields.BeginFromOption || '',
                                formIDs: formIds.join('; '),
                            };
                            if (recipients.length === 1 && formIds.length === 1) employeeScheduledRecord.push(empDataCurr);
                            else {
                                employeeScheduledRecord = [...employeeScheduledRecord.filter(schedule => schedule.formID != n.id), empDataCurr];
                            }
                        }
                    }
                    empDataCurr = {
                        employeeid: '',
                        employeeEmailID: '',
                        every: '',
                        formID: n.id || '',
                        formname: n.name || '',
                        frequency: '',
                        frequencyType: '',
                        monthDays: '',
                        nextDueDate: '',
                        startDate: '',
                        startTime: '',
                        weekDay: '',
                        satAction: '',
                        sunAction: '',
                        beginFromOption: '',
                        formIDs: '',
                        basedOnType: '',
                        basedOnTypeText: '',
                    }
    
                    let found = employeeScheduledRecord.some(checkdata => checkdata.formID == n.id);
                    if (!found) {
                        employeeScheduledRecord.push(empDataCurr);
                    }
                });
    
                // Initialize Grouped Reports Modal
                const groupedReportData = employeeScheduledRecord.filter(schedule => schedule.formID == '1');
                if (groupedReportData.length === 1) {
                    const formIds = groupedReportData[0].formIDs.split('; ');
                    for (let i = 0; i < formIds.length; i++) {
                        $("#groupedReports-" + formIds[i] + ' .star').prop('checked', true);
                    }
                }
    
                $('.fullScreenSpin').css('display', 'none');
                templateObject.employeescheduledrecord.set(employeeScheduledRecord);
    
                if (templateObject.employeescheduledrecord.get()) {
                    setTimeout(function () {
                        $('#tblAutomatedEmails').DataTable({
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "taxratelist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Tax Rate List',
                                filename: "taxratelist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            colReorder: {
                                fixedColumnsRight: 1
                            },
                            lengthMenu: [
                                [50, -1],
                                [50, "All"]
                            ],
                            // bStateSave: true,
                            // rowId: 0,
                            paging: true,
                            info: true,
                            responsive: true,
                            "order": [
                                [0, "asc"]
                            ],
                            action: function () {
                                $('#currencyLists').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
    
                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.employeescheduledrecord.get();
                            templateObject.employeescheduledrecord.set(draftRecord);
                        }).on('column-reorder', function () {
    
                        }).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });
    
                        // $('#currencyLists').DataTable().column( 0 ).visible( true );
                        // $('.fullScreenSpin').css('display', 'none');
                    }, 500);
                    setTimeout(function () {
                        $('#tblEssentialAutomatedEmails').DataTable({
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "taxratelist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Tax Rate List',
                                filename: "taxratelist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            colReorder: {
                                fixedColumnsRight: 1
                            },
                            lengthMenu: [
                                [50, -1],
                                [50, "All"]
                            ],
                            // bStateSave: true,
                            // rowId: 0,
                            paging: false,
                            info: false,
                            responsive: true,
                            searching: false,
                            "order": [
                                [0, "asc"]
                            ],
                            action: function () {
                                $('#tblEssentialAutomatedEmails').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
    
                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.employeescheduledrecord.get();
                            templateObject.employeescheduledrecord.set(draftRecord);
                        }).on('column-reorder', function () {
    
                        }).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });
    
                        // $('#currencyLists').DataTable().column( 0 ).visible( true );
                        // $('.fullScreenSpin').css('display', 'none');
                    }, 500);
                }
            }else {
                taxRateService.getScheduleSettings().then(function (data) {
                    let empData = data.treportschedules;
                    templateObject.originScheduleData.set(data.treportschedules);
                    var empDataCurr = '';
                    $.grep(templateObject.formsData.get(), function (n) {
                        let recipients = [];
                        let recipientIds = [];
                        let formIds = [];
                        empData = empData.filter(emp => emp.fields.Active);
                        for (let i = 0; i < empData.length; i++) {
                            if ((n.id == '1' && empData[i].fields.BeginFromOption === "S") || (n.id == empData[i].fields.FormID && empData[i].fields.BeginFromOption !== "S")) {
                                if (!recipients.includes(empData[i].fields.EmployeeEmailID)) {
                                    recipients.push(empData[i].fields.EmployeeEmailID);
                                    recipientIds.push(empData[i].fields.EmployeeId);
                                }
                                if (n.id == '1' && empData[i].fields.BeginFromOption === "S") formIds.push(empData[i].fields.FormID);
                                const startDate = empData[i].fields.StartDate.split(' ')[0];
                                const startTime = empData[i].fields.StartDate.split(' ')[1];
        
                                //TODO: Getting BasedOnType from localstorage
                                let basedOnTypeData = localStorage.getItem(`BasedOnType_${n.id}_${empData[i].fields.EmployeeId}`);
                                let basedOnType = basedOnTypeData ? JSON.parse(basedOnTypeData).BasedOnType : '';
                                let basedOnTypeText = '';
                                if (basedOnType.split(',').includes('P')) basedOnTypeText += 'On Print, ';
                                if (basedOnType.split(',').includes('S')) basedOnTypeText += 'On Save, ';
                                if (basedOnType.split(',').includes('T')) basedOnTypeText += 'On Transaction Date, ';
                                if (basedOnType.split(',').includes('D')) basedOnTypeText += 'On Due Date, ';
                                if (basedOnType.split(',').includes('O')) basedOnTypeText += 'If Outstanding, ';
                                if (basedOnType.split(',').includes('EN') || basedOnType.split(',').includes('EU')) {
                                    if (basedOnType.split(',').includes('EN')) basedOnTypeText += 'On Event(On Logon), ';
                                    if (basedOnType.split(',').includes('EU')) basedOnTypeText += 'On Event(On Logout), ';
                                }
                                // if (basedOnTypeText != '') basedOnTypeText = ', ' + basedOnTypeText.slice(0, -2);
                                if (basedOnTypeText != '') basedOnTypeText = basedOnTypeText.slice(0, -2);
        
                                empDataCurr = {
                                    employeeid: recipientIds.join('; ') || '',
                                    every: empData[i].fields.Every || '',
                                    formID: n.id || '',
                                    employeeEmailID: recipients.join('; ') || '',
                                    formname: n.name || '',
                                    basedOnType: basedOnType,
                                    basedOnTypeText: basedOnTypeText,
                                    frequency: empData[i].fields.Frequency || '',
                                    frequencyType: empData[i].fields.FrequencyType || '',
                                    id: empData[i].fields.ID || '',
                                    monthDays: empData[i].fields.MonthDays || '',
                                    nextDueDate: empData[i].fields.NextDueDate || '',
                                    startDate: startDate.split('-')[2] + '/' + startDate.split('-')[1] + '/' + startDate.split('-')[0] || '',
                                    startTime: startTime.split(':')[0] + ':' + startTime.split(':')[1] || '',
                                    weekDay: empData[i].fields.WeekDay || '',
                                    satAction: empData[i].fields.SatAction || '',
                                    sunAction: empData[i].fields.SunAction || '',
                                    beginFromOption: empData[i].fields.BeginFromOption || '',
                                    formIDs: formIds.join('; '),
                                };
                                if (recipients.length === 1 && formIds.length === 1) employeeScheduledRecord.push(empDataCurr);
                                else {
                                    employeeScheduledRecord = [...employeeScheduledRecord.filter(schedule => schedule.formID != n.id), empDataCurr];
                                }
                            }
                        }
                        empDataCurr = {
                            employeeid: '',
                            employeeEmailID: '',
                            every: '',
                            formID: n.id || '',
                            formname: n.name || '',
                            frequency: '',
                            frequencyType: '',
                            monthDays: '',
                            nextDueDate: '',
                            startDate: '',
                            startTime: '',
                            weekDay: '',
                            satAction: '',
                            sunAction: '',
                            beginFromOption: '',
                            formIDs: '',
                            basedOnType: '',
                            basedOnTypeText: '',
                        }
        
                        let found = employeeScheduledRecord.some(checkdata => checkdata.formID == n.id);
                        if (!found) {
                            employeeScheduledRecord.push(empDataCurr);
                        }
                    });
        
                    // Initialize Grouped Reports Modal
                    const groupedReportData = employeeScheduledRecord.filter(schedule => schedule.formID == '1');
                    if (groupedReportData.length === 1) {
                        const formIds = groupedReportData[0].formIDs.split('; ');
                        for (let i = 0; i < formIds.length; i++) {
                            $("#groupedReports-" + formIds[i] + ' .star').prop('checked', true);
                        }
                    }
        
                    $('.fullScreenSpin').css('display', 'none');
                    templateObject.employeescheduledrecord.set(employeeScheduledRecord);
        
                    if (templateObject.employeescheduledrecord.get()) {
                        setTimeout(function () {
                            $('#tblAutomatedEmails').DataTable({
                                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                buttons: [{
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "taxratelist_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Tax Rate List',
                                    filename: "taxratelist_" + moment().format(),
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }],
                                select: true,
                                destroy: true,
                                colReorder: true,
                                colReorder: {
                                    fixedColumnsRight: 1
                                },
                                lengthMenu: [
                                    [50, -1],
                                    [50, "All"]
                                ],
                                // bStateSave: true,
                                // rowId: 0,
                                paging: true,
                                info: true,
                                responsive: true,
                                "order": [
                                    [0, "asc"]
                                ],
                                action: function () {
                                    $('#currencyLists').DataTable().ajax.reload();
                                },
                                "fnDrawCallback": function (oSettings) {
                                    setTimeout(function () {
                                        MakeNegative();
                                    }, 100);
                                },
        
                            }).on('page', function () {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                                let draftRecord = templateObject.employeescheduledrecord.get();
                                templateObject.employeescheduledrecord.set(draftRecord);
                            }).on('column-reorder', function () {
        
                            }).on('length.dt', function (e, settings, len) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            });
        
                            // $('#currencyLists').DataTable().column( 0 ).visible( true );
                            // $('.fullScreenSpin').css('display', 'none');
                        }, 500);
                        setTimeout(function () {
                            $('#tblEssentialAutomatedEmails').DataTable({
                                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                buttons: [{
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "taxratelist_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Tax Rate List',
                                    filename: "taxratelist_" + moment().format(),
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }],
                                select: true,
                                destroy: true,
                                colReorder: true,
                                colReorder: {
                                    fixedColumnsRight: 1
                                },
                                lengthMenu: [
                                    [50, -1],
                                    [50, "All"]
                                ],
                                // bStateSave: true,
                                // rowId: 0,
                                paging: false,
                                info: false,
                                responsive: true,
                                searching: false,
                                "order": [
                                    [0, "asc"]
                                ],
                                action: function () {
                                    $('#tblEssentialAutomatedEmails').DataTable().ajax.reload();
                                },
                                "fnDrawCallback": function (oSettings) {
                                    setTimeout(function () {
                                        MakeNegative();
                                    }, 100);
                                },
        
                            }).on('page', function () {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                                let draftRecord = templateObject.employeescheduledrecord.get();
                                templateObject.employeescheduledrecord.set(draftRecord);
                            }).on('column-reorder', function () {
        
                            }).on('length.dt', function (e, settings, len) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            });
        
                            // $('#currencyLists').DataTable().column( 0 ).visible( true );
                            // $('.fullScreenSpin').css('display', 'none');
                        }, 500);
                    }
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
                        } else if (result.dismiss === 'cancel') { }
                    });
                    $('.fullScreenSpin').css('display', 'none');
        
                });
            }
        }).catch(function(err) {
            taxRateService.getScheduleSettings().then(function (data) {
                let empData = data.treportschedules;
                templateObject.originScheduleData.set(data.treportschedules);
                var empDataCurr = '';
                $.grep(templateObject.formsData.get(), function (n) {
                    let recipients = [];
                    let recipientIds = [];
                    let formIds = [];
                    empData = empData.filter(emp => emp.fields.Active);
                    for (let i = 0; i < empData.length; i++) {
                        if ((n.id == '1' && empData[i].fields.BeginFromOption === "S") || (n.id == empData[i].fields.FormID && empData[i].fields.BeginFromOption !== "S")) {
                            if (!recipients.includes(empData[i].fields.EmployeeEmailID)) {
                                recipients.push(empData[i].fields.EmployeeEmailID);
                                recipientIds.push(empData[i].fields.EmployeeId);
                            }
                            if (n.id == '1' && empData[i].fields.BeginFromOption === "S") formIds.push(empData[i].fields.FormID);
                            const startDate = empData[i].fields.StartDate.split(' ')[0];
                            const startTime = empData[i].fields.StartDate.split(' ')[1];
    
                            //TODO: Getting BasedOnType from localstorage
                            let basedOnTypeData = localStorage.getItem(`BasedOnType_${n.id}_${empData[i].fields.EmployeeId}`);
                            let basedOnType = basedOnTypeData ? JSON.parse(basedOnTypeData).BasedOnType : '';
                            let basedOnTypeText = '';
                            if (basedOnType.split(',').includes('P')) basedOnTypeText += 'On Print, ';
                            if (basedOnType.split(',').includes('S')) basedOnTypeText += 'On Save, ';
                            if (basedOnType.split(',').includes('T')) basedOnTypeText += 'On Transaction Date, ';
                            if (basedOnType.split(',').includes('D')) basedOnTypeText += 'On Due Date, ';
                            if (basedOnType.split(',').includes('O')) basedOnTypeText += 'If Outstanding, ';
                            if (basedOnType.split(',').includes('EN') || basedOnType.split(',').includes('EU')) {
                                if (basedOnType.split(',').includes('EN')) basedOnTypeText += 'On Event(On Logon), ';
                                if (basedOnType.split(',').includes('EU')) basedOnTypeText += 'On Event(On Logout), ';
                            }
                            if (basedOnTypeText != '') basedOnTypeText = basedOnTypeText.slice(0, -2);
                            // if (basedOnTypeText != '') basedOnTypeText = ', ' + basedOnTypeText.slice(0, -2);
    
                            empDataCurr = {
                                employeeid: recipientIds.join('; ') || '',
                                every: empData[i].fields.Every || '',
                                formID: n.id || '',
                                employeeEmailID: recipients.join('; ') || '',
                                formname: n.name || '',
                                basedOnType: basedOnType,
                                basedOnTypeText: basedOnTypeText,
                                frequency: empData[i].fields.Frequency || '',
                                frequencyType: empData[i].fields.Frequency || '',
                                id: empData[i].fields.ID || '',
                                monthDays: empData[i].fields.MonthDays || '',
                                nextDueDate: empData[i].fields.NextDueDate || '',
                                startDate: startDate.split('-')[2] + '/' + startDate.split('-')[1] + '/' + startDate.split('-')[0] || '',
                                startTime: startTime.split(':')[0] + ':' + startTime.split(':')[1] || '',
                                weekDay: empData[i].fields.WeekDay || '',
                                satAction: empData[i].fields.SatAction || '',
                                sunAction: empData[i].fields.SunAction || '',
                                beginFromOption: empData[i].fields.BeginFromOption || '',
                                formIDs: formIds.join('; '),
                            };
                            if (recipients.length === 1 && formIds.length === 1) employeeScheduledRecord.push(empDataCurr);
                            else {
                                employeeScheduledRecord = [...employeeScheduledRecord.filter(schedule => schedule.formID != n.id), empDataCurr];
                            }
                        }
                    }
                    empDataCurr = {
                        employeeid: '',
                        employeeEmailID: '',
                        every: '',
                        formID: n.id || '',
                        formname: n.name || '',
                        frequency: '',
                        frequencyType: '',
                        monthDays: '',
                        nextDueDate: '',
                        startDate: '',
                        startTime: '',
                        weekDay: '',
                        satAction: '',
                        sunAction: '',
                        beginFromOption: '',
                        formIDs: '',
                        basedOnType: '',
                        basedOnTypeText: '',
                    }
    
                    let found = employeeScheduledRecord.some(checkdata => checkdata.formID == n.id);
                    if (!found) {
                        employeeScheduledRecord.push(empDataCurr);
                    }
                });
    
                // Initialize Grouped Reports Modal
                const groupedReportData = employeeScheduledRecord.filter(schedule => schedule.formID == '1');
                if (groupedReportData.length === 1) {
                    const formIds = groupedReportData[0].formIDs.split('; ');
                    for (let i = 0; i < formIds.length; i++) {
                        $("#groupedReports-" + formIds[i] + ' .star').prop('checked', true);
                    }
                }
    
                $('.fullScreenSpin').css('display', 'none');
                templateObject.employeescheduledrecord.set(employeeScheduledRecord);
    
                if (templateObject.employeescheduledrecord.get()) {
                    setTimeout(function () {
                        $('#tblAutomatedEmails').DataTable({
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "taxratelist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Tax Rate List',
                                filename: "taxratelist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            colReorder: {
                                fixedColumnsRight: 1
                            },
                            lengthMenu: [
                                [50, -1],
                                [50, "All"]
                            ],
                            // bStateSave: true,
                            // rowId: 0,
                            paging: true,
                            info: true,
                            responsive: true,
                            "order": [
                                [0, "asc"]
                            ],
                            action: function () {
                                $('#currencyLists').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
    
                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.employeescheduledrecord.get();
                            templateObject.employeescheduledrecord.set(draftRecord);
                        }).on('column-reorder', function () {
    
                        }).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });
    
                        // $('#currencyLists').DataTable().column( 0 ).visible( true );
                        // $('.fullScreenSpin').css('display', 'none');
                    }, 500);
                    setTimeout(function () {
                        $('#tblEssentialAutomatedEmails').DataTable({
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "taxratelist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Tax Rate List',
                                filename: "taxratelist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            colReorder: {
                                fixedColumnsRight: 1
                            },
                            lengthMenu: [
                                [50, -1],
                                [50, "All"]
                            ],
                            // bStateSave: true,
                            // rowId: 0,
                            paging: false,
                            info: false,
                            responsive: true,
                            searching: false,
                            "order": [
                                [0, "asc"]
                            ],
                            action: function () {
                                $('#tblEssentialAutomatedEmails').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
    
                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.employeescheduledrecord.get();
                            templateObject.employeescheduledrecord.set(draftRecord);
                        }).on('column-reorder', function () {
    
                        }).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });
    
                        // $('#currencyLists').DataTable().column( 0 ).visible( true );
                        // $('.fullScreenSpin').css('display', 'none');
                    }, 500);
                }
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
                    } else if (result.dismiss === 'cancel') { }
                });
                $('.fullScreenSpin').css('display', 'none');
    
            });
        })
    }

    templateObject.getScheduleInfo();

    // templateObject.getCorrespondence = () => {
    //     let temp = localStorage.getItem('correspondence');
    //     templateObject.correspondences.set(temp ? JSON.parse(temp) : [])
    // }


    templateObject.getCorrespondence = () => {
        // let temp = localStorage.getItem('correspondence');
        getVS1Data('TCorrespondence').then(function (dataObject) {
            if(dataObject.length > 0) {
                let data = JSON.parse(dataObject[0].data);
                let temp = data.tcorrespondence.filter(item=>{
                    return item.fields.EmployeeId == Session.get('mySessionEmployeeLoggedID')
                })
                let tempArray = [];
                // for(let i = 0; i< temp.length; i++) {
                //     for (let j = i+1; j< temp.length; j++ ) {
                //         if(temp[i].fields.Ref_Type == temp[j].fields.Ref_Type) {
                //             temp[j].fields.dup = true
                //         }
                //     }
                // }
                temp.map(item=>{
                    if(item.fields.EmployeeId == Session.get('mySessionEmployeeLoggedID') && item.fields.MessageTo == '') {
                        tempArray.push(item.fields)
                    }
                })
                templateObject.correspondences.set(tempArray)
            } else {
                sideBarService.getCorrespondences().then(dataObject=>{
                    addVS1Data('TCorrespondence', JSON.stringify(dataObject))
                    let tempArray = [];
                    if(dataObject.tcorrespondence.length > 0) {
                        let temp = dataObject.tcorrespondence.filter(item=>{
                            return item.fields.EmployeeId == Session.get('mySessionEmployeeLoggedID')
                        })
        
                        // for(let i = 0; i< temp.length; i++) {
                        //     for (let j = i+1; j< temp.length; j++ ) {
                        //         if(temp[i].fields.Ref_Type == temp[j].fields.Ref_Type) {
                        //             temp[j].fields.dup = true
                        //         }
                        //     }
                        // }
                        
                        temp.map(item=>{
                            if(item.fields.EmployeeId == Session.get('mySessionEmployeeLoggedID') && item.fields.MessageTo == '') {
                                tempArray.push(item.fields)
                            }
                        })
                    }
                    templateObject.correspondences.set(tempArray)
                })
            }
        }).catch(function (){
            sideBarService.getCorrespondences().then(dataObject => {
                let tempArray = [];
                if(dataObject.tcorrespondence.length > 0) {
                    let temp = dataObject.tcorrespondence.filter(item=>{
                        return item.fields.EmployeeId == Session.get('mySessionEmployeeLoggedID')
                    })
    
                    // for(let i = 0; i< temp.length; i++) {
                    //     for (let j = i+1; j< temp.length; j++ ) {
                    //         if(temp[i].fields.Ref_Type == temp[j].fields.Ref_Type) {
                    //             temp[j].fields.dup = true
                    //         }
                    //     }
                    // }
                    
                    temp.map(item=>{
                        if(item.fields.EmployeeId == Session.get('mySessionEmployeeLoggedID') && item.fields.MessageTo == '') {
                            tempArray.push(item.fields)
                        }
                    })
                }
                templateObject.correspondences.set(tempArray)
            })
        })

    }

    templateObject.getCorrespondence();

    $('#tblContactlist tbody').on('click', 'td:not(.chkBox)', function () {
        //var tableCustomer = $(this);
        let selectDataID = $('#customerSelectLineID').val() || '';
        let listData = $(this).closest('tr').find('.colEmail').text() || "";
        let customerId = $(this).closest('tr').find('.colID').text();
        $('#customerListModal').modal('toggle');

        $('#' + selectDataID).val(listData);
        $('#' + selectDataID).attr('data-ids', customerId);
        //$('#'+selectLineID+" .lineAccountName").val('');
    });



    templateObject.saveSchedules = async (settings, isEssential) => {
        let utilityService = new UtilityService();
        return new Promise(async (resolve, reject) => {

            //TODO: Remove all BasedOnType localstorage variables(No need this part in production mode)
            let basedOnTypeStorages = Object.keys(localStorage);
            basedOnTypeStorages = basedOnTypeStorages.filter((storage) => storage.includes('BasedOnType_'));
            basedOnTypeStorages.forEach(storage => {
                let formId = storage.split('_')[1];
                let essentialIDs = ['1', '54', '177', '129'];
                if(isEssential) {
                    if(essentialIDs.includes(formId.toString())) {
                        localStorage.removeItem(storage)
                    }
                } else {
                    if(essentialIDs.includes(formId.toString()) == false) {
                        localStorage.removeItem(storage)
                    }
                }
            });

            const oldSettings = templateObject.originScheduleData.get();
            // Filter old settings according to the types of email setting(Essential one or Automated one)
            if (!isEssential) {
                oldSettings = oldSettings.filter(oldSetting => oldSetting.fields.FormID != 54 && oldSetting.fields.FormID != 177 && oldSetting.fields.FormID != 129);
            }

            try {
                let promise = settings.map(async (setting) => {
                    const formID = $(setting).attr('data-id');
                    const formName = $(setting).find('.sorting_1').text();
                    const frequencyEl = $(setting).find('#edtFrequency');
                    const sendEl = $(setting).find('#edtBasedOn');
                    let recipientIds = $(setting).find('input.edtRecipients').attr('data-ids');
                    let recipients = $(setting).find('input.edtRecipients').val();
                    // Check if this setting has got recipients
                    let basedOnType = frequencyEl.attr('data-basedontype');
                    if (!!recipients) {
                        let attachments = [];
                        let e = jQuery.Event('click');
                        let targetElement = [];
                        let docTitle = 'VS1 Report.pdf';
                        let parentElement = "";

                        if (formID == 129) {
                            parentElement = document.getElementById('profitTemp');
                        }
                        if (formID == 6) {
                            parentElement = document.getElementById('agedPayablesTemp');
                        }
                        if (formID == 134) {
                            parentElement = document.getElementById('agedReceivableTemp');
                        }
                        if (formID == 225) {
                            parentElement = document.getElementById('generalLedgerTemp');
                        }
                        if (formID == 1464) {
                            parentElement = document.getElementById('productSalesReportTemp');
                        }
                        if (formID == 70) {
                            parentElement = document.getElementById('purchaseReportTemp');
                        }
                        if (formID == 1364) {
                            parentElement = document.getElementById('purchaseSummaryTemp');
                        }
                        if (formID == 68) {
                            parentElement = document.getElementById('salesReportTemp');
                        }
                        if (formID == 278) {
                            parentElement = document.getElementById('taxSummaryReportTemp');
                        }
                        if (formID == 140) {
                            parentElement = document.getElementById('trialBalanceTemp');
                        }
                        if (formID == 54) {
                            parentElement = document.getElementById('invoicePDFTemp');
                        }
                        if (formID == 177 || formID == 17544) {
                            parentElement = document.getElementById('statementPDFTemp');
                        }
                        if (formID == 12) {
                            parentElement = document.getElementById('billPDFTemp');
                        }
                        if (formID == 18) {
                            parentElement = document.getElementById('chequePDFTemp');
                        }
                        if (formID == 21) {
                            parentElement = document.getElementById('creditPDFTemp');
                        }

                        if (formID == 61) {
                            parentElement = document.getElementById('paymentsPDFTemp');
                        }
                        if (formID == 69) {
                            parentElement = document.getElementById('purchaseOrderPDFTemp');
                        }

                        if (formID == 71) {
                            parentElement = document.getElementById('quotePDFTemp');
                        }

                        if (formID == 74) {
                            parentElement = document.getElementById('refundPDFTemp')
                        }

                        if (formID == 77) {
                            parentElement = document.getElementById('salesorderPDFTemp')
                        }

                        if (formID == 94) {
                            parentElement = document.getElementById('supplierpaymentPDFTemp')
                        }

                        if (formID != 1) {
                            targetElement = parentElement.getElementsByClassName('printReport');
                        } else {
                            targetElement = [];
                            // const groupedReports = $('#groupedReportsModal .star:checked').map( ()=> { return $(this) }).get();
                            let groupedReportsModal = document.getElementById('groupedReportsModal');
                            let groupedReports = groupedReportsModal.getElementsByClassName('star');
                            let temp = [];
                            for (let i = 0; i < groupedReports.length; i++) {
                                if (groupedReports[i].checked) {
                                    temp.push(groupedReports[i])
                                }
                            }
                            groupedReports = temp;
                            // const groupedReports = $('#groupedReportsModal .star:checked').map( ()=> { return $(this) }).get();
                            let formIDs = [];
                            groupedReports.map(async (groupedReport) => {
                                formIDs.push(parseInt($(groupedReport).closest('tr').attr('id').replace('groupedReports-', '')));
                            });
                            let printwrappers = document.getElementsByClassName('print-wrapper');
                            let parenetElements = [];
                            formIDs.map(id => {
                                parenetElements.push(document.getElementsByClassName('print-wrapper-' + id)[0]);
                            })
                            parenetElements.map(parentelement => {
                                let children = parentelement.getElementsByClassName('printReport');


                                for (let j = 0; j < children.length; j++) {
                                    targetElement.push(children[j]);
                                }
                            })

                        }

                        function getAttachments() {
                            return new Promise(async (resolve, reject) => {
                                if (targetElement && targetElement != null && targetElement != "" && targetElement.length != 0) {
                                    let transIDs = ['54', '177', '12', '18', '21', '61', '69', '71', '74', '77', '17544', '94'];
                                    // for ( let i = 0;  i< 10; i++ ) {
                                    for (let i = 0; i < targetElement.length; i++) {
                                        if (transIDs.includes(formID.toString()) == false) {
                                            targetElement[i].style.display = "block";
                                            targetElement[i].style.width = "210mm";
                                            targetElement[i].style.backgroundColor = "#ffffff";
                                            targetElement[i].style.padding = "20px";
                                            targetElement[i].style.height = "297mm";
                                            targetElement[i].style.fontSize = "13.33px";
                                            targetElement[i].style.color = "#000000";
                                            targetElement[i].style.overflowX = "visible";
                                            let targetTds = $(targetElement[i]).find('.table-responsive .table td');
                                            let targetThs = $(targetElement[i]).find('.table-responsive .table th');
                                            for (let i = 0; i< targetTds.length; i++) {
                                                $(targetTds[i]).css('min-width', '0px')
                                            }
                                            for (let j = 0; j< targetThs.length; j++) {
                                                $(targetThs[j]).css('min-width', '0px')
                                            }
                                        } else {
                                        }

                                        var opt = {
                                            margin: 0,
                                            filename: docTitle,
                                            image: {
                                                type: 'jpeg',
                                                quality: 0.98
                                            },
                                            html2canvas: {
                                                scale: 2
                                            },
                                            jsPDF: {
                                                unit: 'in',
                                                format: 'a4',
                                                orientation: 'portrait'
                                            }
                                        };
                                        let source = targetElement[i];


                                        await (async () => {
                                            return new Promise((resolve, reject) => {
                                                html2pdf().set(opt).from(source).toPdf().output('datauristring').then((dataObject) => {
                                                    let pdfObject = "";
                                                    let base64data = dataObject.split(',')[1];
                                                    pdfObject = {
                                                        filename: 'vs1cloud report.pdf',
                                                        content: base64data,
                                                        encoding: 'base64'
                                                    };
                                                    let tDate = '';
                                                    let dDate = '';
                                                    if (transIDs.includes(formID.toString()) == true && formID != 177) {
                                                        tDate = source.querySelector('#saleDate').innerHTML;
                                                        dDate = source.querySelector('#duedate').innerHTML;
                                                    }
                                                    // attachments.push(pdfObject);
                                                    attachments.push({
                                                        tDate: tDate,
                                                        dDate: dDate,
                                                        pdfObject:pdfObject
                                                    })
                                                    resolve()
                                                });
                                            })
                                        })()
                                    }
                                    resolve()

                                } else if (targetElement.length == 0) {
                                    resolve();
                                }
                            })
                        }
                        await getAttachments()
                        if (typeof recipientIds == 'string') {
                            recipientIds = recipientIds.split('; ');
                        }

                        if (typeof recipients == 'string') {
                            recipients = recipients.split('; ');
                        }
                        let saveSettingPromises = recipientIds.map(async (recipientId, index) => {
                            const starttime = frequencyEl.attr('data-starttime');

                            const startdate = frequencyEl.attr('data-startdate');

                            const convertedStartDate = startdate ? startdate.split('/')[2] + '-' + startdate.split('/')[1] + '-' + startdate.split('/')[0] : '';

                            const sDate = startdate ? moment(convertedStartDate + ' ' + starttime).format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm");

                            const frequencyName = frequencyEl.text() != '' ? frequencyEl.text().split(',')[0] : '';

                            let documents = [];
                            attachments.map(attachment =>{
                                documents.push(attachment.pdfObject)
                            })

                            let objDetail = {
                                type: "TReportSchedules",
                                fields: {
                                    Active: true,
                                    BeginFromOption: "",
                                    ContinueIndefinitely: true,
                                    EmployeeId: parseInt(recipientId),
                                    Every: 1,
                                    EndDate: "",
                                    FormID: parseInt(formID),
                                    LastEmaileddate: "",
                                    MonthDays: 0,
                                    StartDate: sDate,
                                    WeekDay: 1,
                                    NextDueDate: '',
                                    // attachments: attachments,
                                }
                            };

                            let transIDs = ['54', '177', '12', '18', '21', '61', '69', '71', '74', '77', '17544', '94'];
                            if(transIDs.includes(formID.toString()) == true) {
                                attachments.map ((attachment, attachIndex) => {
                                    async function checkBasedOnType() {
                                    let currentTime = new Date()
                                    let transTime = new Date(attachment.tDate)
                                    let dueTime = new Date(attachment.dDate)

                                    let attaches = [];
                                    attaches.push(attachment.pdfObject)

                                    let object = {
                                        type: "TReportSchedules",
                                        fields: {
                                            Active: true,
                                            BeginFromOption: "",
                                            ContinueIndefinitely: true,
                                            EmployeeId: recipientId + '_' + (attachIndex + 1),
                                            Every: 1,
                                            EndDate: "",
                                            FormID: parseInt(formID),
                                            LastEmaileddate: "",
                                            MonthDays: 0,
                                            StartDate: sDate,
                                            WeekDay: 1,
                                            NextDueDate: '',
                                            FrequencyType: '',
                                            Frequency: '',
                                            attachments: attaches,
                                            FormName: formName,
                                            EmployeeEmail: recipients[index],
                                            HostURL: $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname'),
                                            Offset: new Date().getTimezoneOffset()
                                        }
                                    }

                                    if(basedOnType.includes('T') == true && attachment.tDate != '') {
                                        object.fields.StartDate = moment(transTime).format("YYYY-MM-DD HH:mm");
                                        object.fields.EndDate = moment(transTime).format("YYYY-MM-DD HH:mm");
                                        // object.fields.EndDate = object.fields.StartDate;
                                        const nextDueDate = await new Promise((resolve, reject) => {
                                            Meteor.call('calculateNextDate', object.fields, (error, result) => {
                                                if (error) return reject(error);
                                                resolve(result);
                                            });
                                        });
                                        object.fields.NextDueDate = nextDueDate;
                                        object.fields.EmployeeId = object.fields.EmployeeId + '_T'
                                        Meteor.call('addTask', object.fields);
                                    }

                                    if(basedOnType.includes('D') == true && attachment.dDate != '') {
                                        object.fields.StartDate = moment(dueTime).format("YYYY-MM-DD HH:mm");
                                        object.fields.EndDate = moment(dueTime).format("YYYY-MM-DD HH:mm");
                                        // object.fields.StartDate = dueTime;
                                        // object.fields.EndDate = object.fields.StartDate;
                                        const nextDueDate = await new Promise((resolve, reject) => {
                                            Meteor.call('calculateNextDate', object.fields, (error, result) => {
                                                if (error) return reject(error);
                                                resolve(result);
                                            });
                                        });
                                        object.fields.NextDueDate = nextDueDate;
                                        object.fields.EmployeeId = object.fields.EmployeeId.replace('_T', '') + '_D'
                                        Meteor.call('addTask', object.fields);
                                    }

                                    if(basedOnType.includes('O') && attachment.dDate != '' && currentTime.getTime() > dueTime.getTime()) {
                                        object.fields.StartDate = moment(transTime).format("YYYY-MM-DD HH:mm");
                                        Meteor.call('sendNormalEmail', object.fields);
                                    }
                                    }

                                    checkBasedOnType();


                                })
                            }


                            if (frequencyName === "Monthly") {
                                const monthDate = frequencyEl.attr('data-monthdate') ? parseInt(frequencyEl.attr('data-monthdate').replace('day', '')) : 0;
                                const ofMonths = frequencyEl.attr('data-ofMonths');
                                // objDetail.fields.ExtraOption = ofMonths;
                                objDetail.fields.MonthDays = monthDate;
                                objDetail.fields.Frequency = "M";
                                objDetail.fields.FrequencyType  = 'M';
                            } else if (frequencyName === "Weekly") {
                                const selectdays = frequencyEl.attr("data-selectdays");
                                const everyweeks = frequencyEl.attr("data-everyweeks");
                                objDetail.fields.Frequency = "W";
                                objDetail.fields.FrequencyType = 'W';
                                objDetail.fields.WeekDay = parseInt(selectdays);
                                if (everyweeks) objDetail.fields.Every = parseInt(everyweeks);
                            } else if (frequencyName === "Daily") {
                                objDetail.fields.Frequency = "D";
                                objDetail.fields.FrequencyType = 'D';
                                const dailyradiooption = frequencyEl.attr("data-dailyradiooption");
                                const everydays = frequencyEl.attr("data-everydays");
                                // objDetail.fields.ExtraOption = dailyradiooption;
                                objDetail.fields.SatAction = "P";
                                objDetail.fields.SunAction = "P";
                                objDetail.fields.Every = -1;
                                if (dailyradiooption === 'dailyWeekdays') {
                                    objDetail.fields.SatAction = "D";
                                    objDetail.fields.SunAction = "D";
                                }
                                if (dailyradiooption === 'dailyEvery' && everydays) objDetail.fields.Every = parseInt(everydays);
                            } else if (frequencyName === "One Time Only") {
                                objDetail.fields.EndDate = sDate;
                                objDetail.fields.Frequency = "";
                                objDetail.fields.FrequencyType = 'O';
                            } else {
                                objDetail.fields.FrequencyType = '';
                                objDetail.fields.Active = false;
                            }

                            if (formID == '1') {
                                // if report type is Grouped Reports....

                                let groupedReportsModal = document.getElementById('groupedReportsModal');
                                let groupedReports = groupedReportsModal.getElementsByClassName('star');
                                let temp = [];
                                for (let i = 0; i < groupedReports.length; i++) {
                                    if (groupedReports[i].checked) {
                                        temp.push(groupedReports[i])
                                    }
                                }
                                groupedReports = temp;

                                let formIDs = [];
                                groupedReports.map(async (groupedReport) => {
                                    formIDs.push(parseInt($(groupedReport).closest('tr').attr('id').replace('groupedReports-', '')));
                                    oldSettings = oldSettings.filter(oldSetting => {
                                        return oldSetting.fields.FormID != parseInt($(groupedReport).closest('tr').attr('id').replace('groupedReports-', ''))
                                            || oldSetting.fields.EmployeeId != parseInt(recipientId);
                                    });
                                });

                                // Add synced cron job here
                                objDetail.fields.FormIDs = formIDs.join(',');
                                objDetail.fields.FormID = 1;
                                objDetail.fields.FormName = formName;
                                objDetail.fields.EmployeeEmail = recipients[index];
                                objDetail.fields.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://localhost:3000';
                                objDetail.fields.attachments = documents;
                                //TODO: Set basedon type here
                                localStorage.setItem(`BasedOnType_${objDetail.fields.FormID}_${objDetail.fields.EmployeeId}`, JSON.stringify({
                                    ...objDetail.fields,
                                    BasedOnType: basedOnType,
                                }));

                                objDetail.fields.Offset = new Date().getTimezoneOffset();
                                const nextDueDate = await new Promise((resolve, reject) => {
                                    Meteor.call('calculateNextDate', objDetail.fields, (error, result) => {
                                        if (error) return reject(error);
                                        resolve(result);
                                    });
                                });
                                objDetail.fields.NextDueDate = nextDueDate;
                                // objDetail.fields.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
                                Meteor.call('addTask', objDetail.fields);
                            } else {
                                const oldSetting = oldSettings.filter((setting) => setting.fields.FormID == parseInt(formID) && setting.fields.EmployeeId == parseInt(recipientId));
                                oldSettings = oldSettings.filter((setting) => setting.fields.FormID != parseInt(formID) || setting.fields.EmployeeId != recipientId);
                                if (oldSetting.length && oldSetting[0].fields.ID) objDetail.fields.ID = oldSetting[0].fields.ID; // Confirm if this setting is inserted or updated
                                try {
                                    // Save email settings
                                    await taxRateService.saveScheduleSettings(objDetail).then(dataReturn=>{
                                        taxRateService.getScheduleSettings().then(dataUpdate => {
                                            addVS1Data('TReportSchedules', JSON.stringify(dataUpdate)).then(()=>{})
                                        })
                                    });
                                } catch (e) {
                                }
                                objDetail.fields.attachments = [];

                                objDetail.fields.Offset = new Date().getTimezoneOffset();

                                const nextDueDate = await new Promise((resolve, reject) => {
                                    Meteor.call('calculateNextDate', objDetail.fields, (error, result) => {
                                        if (error) return reject(error);
                                        resolve(result);
                                    });
                                });
                                objDetail.fields.NextDueDate = nextDueDate;


                                // Add synced cron job here
                                objDetail.fields.FormName = formName;
                                objDetail.fields.EmployeeEmail = recipients[index];
                                objDetail.fields.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://localhost:3000';
                                //TODO: Set basedon type here
                                localStorage.setItem(`BasedOnType_${objDetail.fields.FormID}_${objDetail.fields.EmployeeId}`, JSON.stringify({
                                    ...objDetail.fields,
                                    BasedOnType: basedOnType,
                                }));

                                objDetail.fields.attachments = documents;
                                // objDetail.fields.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
                                Meteor.call('addTask', objDetail.fields);
                            }
                        });
                        await Promise.all(saveSettingPromises);
                    }
                });
                await Promise.all(promise);

                let promise1 = oldSettings.map(async setting => {
                    if ((isEssential && (setting.fields.BeginFromOption == "S" || setting.fields.FormID == 1 ||setting.fields.FormID == 54
                        || setting.fields.FormID == 177 || setting.fields.FormID == 129)) || (!isEssential
                            && setting.fields.BeginFromOption != "S" && setting.fields.FormID != 54
                            && setting.fields.FormID != 177 && setting.fields.FormID != 129)) {
                        // Remove all
                        setting.fields.Active = false;
                        Meteor.call('addTask', setting.fields);
                        const saveResult = await taxRateService.saveScheduleSettings({
                            type: "TReportSchedules",
                            fields: {
                                Active: false,
                                ID: setting.fields.ID
                            }
                        }).then(dataReturn=>{
                            taxRateService.getScheduleSettings().then(dataUpdate => {
                                addVS1Data('TReportSchedules', JSON.stringify(dataUpdate))
                            })
                        });
                        //TODO: Set basedon type here
                        localStorage.removeItem(`BasedOnType_${setting.fields.FormID}_${setting.fields.EmployeeId}`);
                    }
                });
                await Promise.all(promise1);
                resolve({ success: true, message: '' });
            } catch (error) {
                resolve({ success: false, message: 'Something went wrong. Please try again later.' });
                if (typeof error !== 'string') error = error.message;

            }
        });
    }

    templateObject.saveGroupedReports = async function () {
        try {
            const oldSettings = templateObject.originScheduleData.get();
            // Filter old settings according to the types of email setting(Essential one or Automated one)
            // oldSettings = oldSettings.filter(oldSetting => oldSetting.fields.BeginFromOption === "S");
            const groupedReports = $('#groupedReportsModal .star:checked').map(function () { return $(this) }).get();
            const formID = $('#automated1').attr('data-id');
            const frequencyEl = $('#automated1').find('#edtFrequency');
            const sendEl = $('#automated1').find('#edtBasedOn');
            let recipientIds = $('#automated1').find('input.edtRecipients').attr('data-ids');
            if (!!recipientIds) {
                recipientIds = recipientIds.split('; ');
                let savePromise = recipientIds.map(async (recipientId) => {
                    const starttime = frequencyEl.attr('data-starttime');
                    const startdate = frequencyEl.attr('data-startdate');
                    const convertedStartDate = startdate ? startdate.split('/')[2] + '-' + startdate.split('/')[1] + '-' + startdate.split('/')[0] : '';
                    const sDate = startdate ? moment(convertedStartDate + ' ' + starttime).format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm");

                    const frequencyName = frequencyEl.text() != '' ? frequencyEl.text().split(',')[0] : '';
                    let objDetail = {
                        type: "TReportSchedules",
                        fields: {
                            Active: true,
                            BeginFromOption: "",
                            ContinueIndefinitely: true,
                            EmployeeId: parseInt(recipientId),
                            Every: 1,
                            EndDate: "",
                            FormID: parseInt(formID),
                            LastEmaileddate: "",
                            MonthDays: 0,
                            StartDate: sDate,
                            WeekDay: 1,
                            NextDueDate: '',
                        }
                    };

                    if (frequencyName === "Monthly") {
                        const monthDate = frequencyEl.attr('data-monthdate') ? parseInt(frequencyEl.attr('data-monthdate').replace('day', '')) : 0;
                        const ofMonths = frequencyEl.attr('data-ofMonths');
                        // objDetail.fields.ExtraOption = ofMonths;
                        objDetail.fields.MonthDays = monthDate;
                        objDetail.fields.Frequency = "M";
                        objDetail.fields.FrequencyType = "M";
                    } else if (frequencyName === "Weekly") {
                        const selectdays = frequencyEl.attr("data-selectdays");
                        const everyweeks = frequencyEl.attr("data-everyweeks");
                        objDetail.fields.Frequency = "W";
                        objDetail.fields.FrequencyType = "W";
                        objDetail.fields.WeekDay = parseInt(selectdays);
                        if (everyweeks) objDetail.fields.Every = parseInt(everyweeks);
                    } else if (frequencyName === "Daily") {
                        objDetail.fields.Frequency = "D";
                        objDetail.fields.FrequencyType = "D";
                        const dailyradiooption = frequencyEl.attr("data-dailyradiooption");
                        const everydays = frequencyEl.attr("data-everydays");
                        // objDetail.fields.ExtraOption = dailyradiooption;
                        objDetail.fields.SatAction = "P";
                        objDetail.fields.SunAction = "P";
                        objDetail.fields.Every = -1;
                        if (dailyradiooption === 'dailyWeekdays') {
                            objDetail.fields.SatAction = "D";
                            objDetail.fields.SunAction = "D";
                        }
                        if (dailyradiooption === 'dailyEvery' && everydays) objDetail.fields.Every = parseInt(everydays);
                    } else if (frequencyName === "One Time Only") {
                        objDetail.fields.EndDate = sDate;
                        objDetail.fields.Frequency = "";
                        objDetail.fields.FrequencyType = "O";
                    } else {
                        objDetail.fields.FrequencyType = '';
                        objDetail.fields.Active = false;
                    }
                    let promises = groupedReports.map(async (groupedReport) => {
                        objDetail.fields.FormID = parseInt($(groupedReport).closest('tr').attr('id').replace('groupedReports-', ''));
                        objDetail.fields.ISEmpty = true;

                        const oldSetting = oldSettings.filter((setting) => {
                            return setting.fields.FormID == $(groupedReport).closest('tr').attr('id').replace('groupedReports-', '') && setting.fields.EmployeeId == parseInt(recipientId)
                        });
                        oldSettings = oldSettings.filter((setting) => {
                            return setting.fields.FormID != $(groupedReport).closest('tr').attr('id').replace('groupedReports-', '') || setting.fields.EmployeeId != parseInt(recipientId)
                        });
                        if (oldSetting.length && oldSetting[0].fields.ID) objDetail.fields.ID = oldSetting[0].fields.ID; // Confirm if this setting is inserted or updated
                        else delete objDetail.fields.ID;

                        // const sendName = sendEl.text();

                        //TODO: Add employee email field
                        // objDetail.fields.EmployeeEmail = recipients[i];

                        // Get next due date for email scheduling
                        // const nextDueDate = await new Promise((resolve, reject) => {
                        //     Meteor.call('calculateNextDate', objDetail.fields, (error, result) => {
                        //         if (error) return reject(error);
                        //         resolve(result);
                        //     });
                        // });

                        // objDetail.fields.NextDueDate = nextDueDate;
                        objDetail.fields.BeginFromOption = "S";

                        // Save email settings
                        await taxRateService.saveScheduleSettings(objDetail).then(dataReturn=>{
                            taxRateService.getScheduleSettings().then(dataUpdate => {
                                addVS1Data('TReportSchedules', JSON.stringify(dataUpdate))
                            })
                        });
                    });
                    await Promise.all(promises);
                    let removeSetting = oldSettings.map(async (setting) => {
                        if (setting.fields.BeginFromOption === "S") {
                            await taxRateService.saveScheduleSettings({
                                type: "TReportSchedules",
                                fields: {
                                    Active: false,
                                    ID: setting.fields.ID
                                }
                            }).then(dataReturn=>{
                                taxRateService.getScheduleSettings().then(dataUpdate => {
                                    addVS1Data('TReportSchedules', JSON.stringify(dataUpdate))
                                })
                            })
                        }
                    });
                    await Promise.all(removeSetting);
                });
                await Promise.all(savePromise);
                return { success: true };
            } else {
                return { success: true };
            }
        } catch (e) {
            return { success: false, message: 'Something went wrong. Please try again later.' };
        }
    }


    $(document).on('click', '#tblCorrespondence tr', function(e) {
        let tempLabel = $(e.target).closest('tr').find('.colLabel').text();
        let tempSubject  = $(e.target).closest('tr').find('.colSubject').text();
        let tempMemo  = $(e.target).closest('tr').find('.colTemplateContent').text();
        let tempId = $(e.target).closest('tr').find('.colID').text();
        templateObject.isAdd.set(false);
        templateObject.selectedRowID.set(tempId);
        $('#addLetterTemplateModal').modal();
        $('#edtTemplateLbl').val(tempLabel);
        $('#edtTemplateSubject').val(tempSubject);
        $('#edtTemplateContent').val(tempMemo);
    })

    $(document).on('click', '#tblCorrespondence tr .btn-remove-raw', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.fullScreenSpin').css('display', 'inline-block');
        let tempId = $(e.target).closest('tr').find('.colID').text();
        let correspondenceTemp = templateObject.correspondences.get();
        let index = correspondenceTemp.findIndex(item => {
            return item.MessageId == tempId;
        })
        if(index > -1) {
            let objDetail = correspondenceTemp[index];
            objDetail.Active = false;
            let objectData = {
                type: "TCorrespondence",
                fields: objDetail
            }
            sideBarService.saveCorrespondence(objectData).then(function() {
                sideBarService.getCorrespondences().then(function(dataUpdate){
                    addVS1Data('TCorrespondence', JSON.stringify(dataUpdate)).then(function() {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Success',
                            text: 'Template has been removed successfully ',
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'Continue'
                        }).then((result) => {
                            if (result.value) {
                                templateObject.getCorrespondence();
                            } else if (result.dismiss === 'cancel') { }
                        });
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    })
                })
            }).catch(function(error) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Ooops',
                    text: 'Template has not been removed',
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Continue'
                }).then((result) => {
                    if (result.value) {
                        templateObject.getCorrespondence();
                    } else if (result.dismiss === 'cancel') { }
                });
            })
        }

    })
});

Template.emailsettings.events({
    'click .btnSelectContact': async function (event) {
        let selectDataID = $('#customerSelectLineID').val() || '';
        var tblContactService = $(".tblContactlist").dataTable();

        let datacontactList = [];
        let datacontractIDList = [];
        $(".chkServiceCard:checked", tblContactService.fnGetNodes()).each(function () {
            let contactEmail = $(this).closest('tr').find('.colEmail').text() || '';
            let contactID = $(this).closest('tr').find('.colID').text() || '';
            if (contactEmail.replace(/\s/g, '') != '') {
                datacontactList.push(contactEmail);
            }
            datacontractIDList.push(contactID);
        });
        $('#' + selectDataID).val(datacontactList.join("; "));
        $('#' + selectDataID).attr('data-ids', datacontractIDList.join("; "));
        $('#customerListModal').modal('toggle');
    },
    'click #swtAllCustomers': function () {
        const recipientList = $('#tblContactlist tbody tr');
        for (let i = 0; i < recipientList.length; i++) {
            if ($(recipientList[i]).find('td.colType').text().includes('Customer'))
                $(recipientList[i]).find('.chkServiceCard').prop('checked', event.target.checked);
        }
    },
    'click #swtAllEmployees': function () {
        const recipientList = $('#tblContactlist tbody tr');
        for (let i = 0; i < recipientList.length; i++) {
            if ($(recipientList[i]).find('td.colType').text().includes('Employee'))
                $(recipientList[i]).find('.chkServiceCard').prop('checked', event.target.checked);
        }
    },
    'click #swtAllSuppliers': function () {
        const recipientList = $('#tblContactlist tbody tr');
        for (let i = 0; i < recipientList.length; i++) {
            if ($(recipientList[i]).find('td.colType').text().includes('Supplier'))
                $(recipientList[i]).find('.chkServiceCard').prop('checked', event.target.checked);
        }
    },
    'click .btnSaveFrequency': function () {
        // let taxRateService = new TaxRateService();
        let templateObject = Template.instance();
        // let startTime = "";
        // let startDate = "";
        // let date = "";
        // let frequency = ""
        // let every = 0;
        // let monthDays = 0;
        // let weekDay = 0;
        // let id = $('#frequencyid').val() || '';
        // let employeeID = Session.get('mySessionEmployeeLoggedID');

        // TODO: BasedOnType saving on frequency modal
        const basedOnTypes = $('#basedOnSettings input.basedOnSettings');
        let basedOnTypeTexts = '';
        let basedOnTypeAttr = '';
        basedOnTypes.each(function () {
            if ($(this).prop('checked')) {
                const selectedType = $(this).attr('id');
                if (selectedType === "basedOnFrequency") { basedOnTypeAttr += 'F,'}
                if (selectedType === "basedOnPrint") { basedOnTypeTexts += 'On Print, '; basedOnTypeAttr += 'P,'; }
                if (selectedType === "basedOnSave") { basedOnTypeTexts += 'On Save, '; basedOnTypeAttr += 'S,'; }
                if (selectedType === "basedOnTransactionDate") { basedOnTypeTexts += 'On Transaction Date, '; basedOnTypeAttr += 'T,'; }
                if (selectedType === "basedOnDueDate") { basedOnTypeTexts += 'On Due Date, '; basedOnTypeAttr += 'D,'; }
                if (selectedType === "basedOnOutstanding") { basedOnTypeTexts += 'If Outstanding, '; basedOnTypeAttr += 'O,'; }
                if (selectedType === "basedOnEvent") {
                    if ($('#settingsOnEvents').prop('checked')) { basedOnTypeTexts += 'On Event(On Logon), '; basedOnTypeAttr += 'EN,'; }
                    if ($('#settingsOnLogout').prop('checked')) { basedOnTypeTexts += 'On Event(On Logout), '; basedOnTypeAttr += 'EU,'; }
                }
            }
        });
        if (basedOnTypeTexts != '') basedOnTypeTexts = basedOnTypeTexts.slice(0, -2);
        if (basedOnTypeAttr != '') basedOnTypeAttr = basedOnTypeAttr.slice(0, -1);

        let formId = parseInt($("#formid").val());
        let radioFrequency = $('input[type=radio][name=frequencyRadio]:checked').attr('id');

        $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-basedontype', basedOnTypeAttr);

        const values = basedOnTypeAttr.split(',');
        if(values.includes('F')) {
            if (radioFrequency == "frequencyMonthly") {
                const monthDate = $("#sltDay").val().replace('day', '');
                const ofMonths = '';
                let isFirst = true;
                $(".ofMonthList input[type=checkbox]:checked").each(function () {
                    ofMonths += isFirst ? $(this).val() : ',' + $(this).val();
                    isFirst = false;
                });
                const startTime = $('#edtMonthlyStartTime').val();
                const startDate = $('#edtMonthlyStartDate').val();
    
                setTimeout(function () {
                    if (basedOnTypeTexts != '') $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("Monthly, " + basedOnTypeTexts);
                    else $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("Monthly");
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-monthDate', monthDate);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-ofMonths', ofMonths);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                    $("#frequencyModal").modal('toggle');
                }, 100);
            } else if (radioFrequency == "frequencyWeekly") {
                const everyWeeks = $("#weeklyEveryXWeeks").val();
                const selectDays = $(".selectDays input[type=checkbox]:checked").val();
                selectDays = templateObject.getDayNumber(selectDays);
                const startTime = $('#edtWeeklyStartTime').val();
                const startDate = $('#edtWeeklyStartDate').val();
                setTimeout(function () {
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-selectDays', selectDays);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-everyWeeks', everyWeeks);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                    if (basedOnTypeTexts != '') $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("Weekly, " + basedOnTypeTexts);
                    else $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("Weekly");
                    $("#frequencyModal").modal('toggle');
                }, 100);
            } else if (radioFrequency == "frequencyDaily") {
                const dailyRadioOption = $('#dailySettings input[type=radio]:checked').attr('id');
                const everyDays = $("#dailyEveryXDays").val();
                const startTime = $('#edtDailyStartTime').val();
                const startDate = $('#edtDailyStartDate').val();
                setTimeout(function () {
                    if (basedOnTypeTexts != '') $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("Daily, " + basedOnTypeTexts);
                    else $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("Daily");
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-dailyRadioOption', dailyRadioOption);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-everydays', everyDays);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                    $("#frequencyModal").modal('toggle');
                }, 100);
            } else if (radioFrequency == "frequencyOnetimeonly") {
                const startTime = $('#edtOneTimeOnlyTime').val();
                const startDate = $('#edtOneTimeOnlyDate').val();
    
                $('#edtOneTimeOnlyTimeError').css('display', 'none');
                $('#edtOneTimeOnlyDateError').css('display', 'none');
                setTimeout(function () {
                    if (basedOnTypeTexts != '') $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("One Time Only, " + basedOnTypeTexts);
                    else $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("One Time Only");
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                    $("#frequencyModal").modal('toggle');
                }, 100);
            } else {
                $("#frequencyModal").modal('toggle');
            }
        }else {
            if (basedOnTypeTexts != '') $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text(basedOnTypeTexts);
            else $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text('')
            $('#frequencyModal').modal('toggle');
        }
    },
    'click .dnd-moved': (e) => {
        localStorage.setItem('transactiontype', e.currentTarget.getAttribute('id'));
    },
    'click #emailsetting-essential': async function () {
        const templateObject = Template.instance();
        const essentialSettings = $('#tblEssentialAutomatedEmails tbody tr').map(function () { return $(this) }).get();
        $('.fullScreenSpin').css('display', 'inline-block');

        const saveResult = await templateObject.saveSchedules(essentialSettings, true);
        const saveGroupResult = await templateObject.saveGroupedReports();


        if (saveResult.success && saveGroupResult.success)
            swal({
                title: 'Success',
                text: "Automated Email Settings (Essentials) were scheduled successfully",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                window.open('/emailsettings', '_self');
            });
        else {
            swal({
                title: 'Oooops...',
                text: 'Something went wrong! Please try again later.',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                window.open('/emailsettings', '_self');
            });
        }
        $('.fullScreenSpin').css('display', 'none');
    },
    'click #emailsetting-normal': async function () {
        const templateObject = Template.instance();
        const normalSettings = $('#tblAutomatedEmails tbody tr').map(function () { return $(this) }).get();
        $('.fullScreenSpin').css('display', 'inline-block');

        const saveResult = await templateObject.saveSchedules(normalSettings, false);

        if (saveResult.success) {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Success',
                text: 'Normal Email Settings were scheduled successfully',
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                window.open('/emailsettings', '_self');
            });
        } else {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Oooops...',
                text: 'Something went wrong! Please try again later.----1',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                window.open('/emailsettings', '_self');
            });
        }


    },
    'click .chkBoxDays': function (event) {
        var checkboxes = document.querySelectorAll('.chkBoxDays');
        checkboxes.forEach((item) => {
            if (item !== event.target) {
                item.checked = false
            }
        });
    },
    'click #edtFrequency': function (event) {
        let templateObject = Template.instance();
        let scheduleData = templateObject.employeescheduledrecord.get();
        let formId = $(event.target).closest("tr").attr("data-id");


        $("#formid").val(formId);
        // Initialize all options
        const $radioFrequencyType = $('input[name="frequencyRadio"]');
        $radioFrequencyType.filter('[id=frequencyMonthly]').trigger('click');
        $('.ofMonthList input[type="checkbox"]').prop('checked', false);
        $('#sltDay').val('day1');
        $('#edtMonthlyStartTime').val('');
        $('#edtMonthlyStartDate').val('');
        $('.chkBoxDays').prop('checked', false);
        $('#formCheck-monday').prop('checked', true);
        $('#weeklyEveryXWeeks').val('');
        $('#dailyEveryDay').prop('checked', true);
        $('#dailyEveryXDays').val('');
        $('#settingsOnLogon').prop('checked', true);

        $('.colSettings').css('display', 'none'); // Hide all left-settings part

        $('#edtFrequencyDetail').css('display', 'none');
        $('#basedOnSettingsTitle').css('border-top-width', '0px');

        const frequencyType = $(event.target).html().split(',')[0];
        const startDate = $(event.target).attr('data-startdate') ? $(event.target).attr('data-startdate') : '';
        const startTime = $(event.target).attr('data-starttime') ? $(event.target).attr('data-starttime') : '';
        if (frequencyType === 'Monthly') {
            $radioFrequencyType.filter('[id=frequencyMonthly]').trigger('click');
            const monthDay = $(event.target).attr('data-monthdate') ? 'day' + $(event.target).attr('data-monthdate') : 'day1';
            // const months = $(event.target).attr('data-ofmonths') ? $(event.target).attr('data-ofmonths').split(',') : [];
            $('#sltDay').val(monthDay);
            // const monthCheckboxes = $('.ofMonthList input[type="checkbox"]');
            // for(let i = 0; i < monthCheckboxes.length; i++) {
            //     if (months.includes($(monthCheckboxes[i]).attr('value'))) $(monthCheckboxes[i]).prop('checked', true);
            //     else $(monthCheckboxes[i]).prop('checked', false);
            // };
            $('#edtMonthlyStartDate').val(startDate);
            $('#edtMonthlyStartTime').val(startTime);
            $('#monthlySettings').css('display', 'block');
        } else if (frequencyType === 'Weekly') {
            $radioFrequencyType.filter('[id=frequencyWeekly]').trigger('click');
            let selectedDay = $(event.target).attr('data-selectdays');
            if (selectedDay == 0) selectedDay = 'sunday';
            else if (selectedDay == 1) selectedDay = 'monday';
            else if (selectedDay == 2) selectedDay = 'tuesday';
            else if (selectedDay == 3) selectedDay = 'wednesday';
            else if (selectedDay == 4) selectedDay = 'thursday';
            else if (selectedDay == 5) selectedDay = 'friday';
            else if (selectedDay == 6) selectedDay = 'saturday';
            const everyWeeks = $(event.target).attr('data-everyweeks') ? $(event.target).attr('data-everyweeks') : '1';
            const weekdayCheckboxes = $('.chkBoxDays');
            for (let i = 0; i < weekdayCheckboxes.length; i++) {
                if (selectedDay === $(weekdayCheckboxes[i]).val()) $(weekdayCheckboxes[i]).prop('checked', true);
                else $(weekdayCheckboxes[i]).prop('checked', false);
            }
            $('#weeklyEveryXWeeks').val(everyWeeks);
            $('#edtWeeklyStartDate').val(startDate);
            $('#edtWeeklyStartTime').val(startTime);
            $('#weeklySettings').css('display', 'block');
        } else if (frequencyType === 'Daily') {
            $radioFrequencyType.filter('[id=frequencyDaily]').trigger('click');
            const everyDays = $(event.target).attr('data-everydays') ? $(event.target).attr('data-everydays') : '';
            const satAction = $(event.target).attr('data-sataction') ? $(event.target).attr('data-sataction') : '';
            const sunAction = $(event.target).attr('data-sunaction') ? $(event.target).attr('data-sunaction') : '';
            if (everyDays === '-1' && satAction === 'P' && sunAction === 'P') {
                $('#dailyEveryDay').trigger('click');
            } else if (everyDays === '-1' && satAction === 'D' && sunAction === 'D') {
                $('#dailyWeekdays').trigger('click');
            } else if (everyDays !== '-1') {
                $('#dailyEvery').trigger('click');
                $('#dailyEveryXDays').val(everyDays);
                $('#dailyEveryXDays').prop('disabled', false);
            }
            $('#edtDailyStartDate').val(startDate);
            $('#edtDailyStartTime').val(startTime);
            $('#dailySettings').css('display', 'block');
        } else if (frequencyType === 'One Time Only') {
            $('#edtOneTimeOnlyDate').val(startDate);
            $('#edtOneTimeOnlyTime').val(startTime);
            $radioFrequencyType.filter('[id=frequencyOnetimeonly]').trigger('click');
            $('#oneTimeOnlySettings').css('display', 'block');
        } else {
            $('#monthlySettings').css('display', 'block');
        }

        // Set basedontype checkboxes with attr - data-basedontype
        const basedOnTypeData = $(event.target).attr('data-basedontype');
        if (basedOnTypeData && basedOnTypeData != '') {
            const values = basedOnTypeData.split(',');
            $('#onEventSettings').css('display', 'none');
            $('#edtFrequencyDetail').css('display', 'none');
            $('#basedOnFrequency').prop('checked', false);
            $('#basedOnPrint').prop('checked', false);
            $('#basedOnSave').prop('checked', false);
            $('#basedOnTransactionDate').prop('checked', false);
            $('#basedOnDueDate').prop('checked', false);
            $('#basedOnEvent').prop('checked', false)
            if (values.includes('F')) {$('#basedOnFrequency').prop('checked', true); $('#edtFrequencyDetail').css('display', 'flex'); $('#basedOnSettingTitle').css('border-top')}
            if (values.includes('P')) $('#basedOnPrint').prop('checked', true);
            if (values.includes('S')) $('#basedOnSave').prop('checked', true);
            if (values.includes('T')) $('#basedOnTransactionDate').prop('checked', true);
            if (values.includes('D')) $('#basedOnDueDate').prop('checked', true);
            if (values.includes('O')) $('#basedOnOutstanding').prop('checked', true);
            if (values.includes('EN') || values.includes('EU')) {
                $('#basedOnEvent').prop('checked', true);
                $('#onEventSettings').css('display', 'block');
                if (values.includes('EN')) $('#settingsOnEvents').prop('checked', true);
                if (values.includes('EU')) $('#settingsOnLogout').prop('checked', true);
            }
        } else {
            $('#basedOnSettings input').prop('checked', false);
        }

        $("#frequencyModal").modal('toggle');
    },
    'click #blncSheets #edtFrequency': function () {
        $("#frequencyModal").modal('toggle');

    },

    'click .edtRecipients': function () {
        let recipientsID = event.target.id || '';
        $('#customerSelectLineID').val(recipientsID);
        const recipients = event.target.value ? event.target.value.split('; ') : [];
        $('.chkServiceCard').prop('checked', false);
        $('#swtAllCustomers').prop('checked', false);
        $('#swtAllEmployees').prop('checked', false);
        $('#swtAllSuppliers').prop('checked', false);
        const recipientList = $('#tblContactlist tbody tr');
        for (let i = 0; i < recipientList.length; i++) {
            const recEmail = $(recipientList[i]).find('td.colEmail').text();
            const recType = $(recipientList[i]).find('td.colType').text();
            if (recipients.includes(recEmail) && recType !== 'Job') $(recipientList[i]).find('.chkServiceCard').prop('checked', true);
        }
        $("#customerListModal").modal('toggle');
    },
    'click #groupedReports': function () {
        let formIds = $(event.target).attr('data-ids') || '';
        formIds = formIds ? formIds.split('; ') : [];
        if (formIds.length > 0) {
            for (let i = 0; i < formIds.length; i++) {
                $("#groupedReports-" + formIds[i] + ' input.star').prop('checked', true);
            }
        }
        $("#groupedReportsModal").modal('toggle');
    },

    'click .btn-show-history': function (event) {
        const templateObject = Template.instance();
        var items = [];
        var _rowElement = $(event.target).closest('tr')
        var _id = _rowElement.attr('data-id');
        var _transType = _rowElement.find('>td:first-child').html();
        var taxRateService = new TaxRateService();
        let tempArray  = templateObject.originScheduleData.get();

        items = tempArray.filter((item) => {
            return item.fields.FormID.toString() === _id
        });
        items.map((item) => {
            item.transactionType = _transType
        })
        templateObject.essentialReportSchedules.set(items);
        $("#historyUpcomingModal").modal('toggle');
    },
    'click input[name="frequencyRadio"]': function () {
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
            $("#frequencyModal").modal('toggle');
        }
    },
    'click input[name="settingsMonthlyRadio"]': function () {
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
    'click input[name="dailyRadio"]': function () {
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
    'click #edtBasedOn': function (event) {
        localStorage.setItem('selected_editBasedOn_id', $(event.target).closest('tr').attr('data-id'));
        const basedOnType = $(event.target).text();
        $('#edtBasedOnDate').val('');
        $('#basedOnPrint').prop('checked', true);
        $('#onEventSettings').css('display', 'none');
        if (basedOnType === "On Time") {
            const dateTime = $(event.target).attr('data-time');
            $('#edtBasedOnDate').val(dateTime);
            $('#basedOnDate').trigger('click');
            $('#basedOnDate').prop('checked', true);
        } else if (basedOnType === "If Outstanding") $('#basedOnOutstanding').prop('checked', true);
        else if (basedOnType === "On Due Date") $('#basedOnDueDate').prop('checked', true);
        else if (basedOnType === "On Transaction Date") $('#basedOnTransactionDate').prop('checked', true);
        else if (basedOnType === "On Save") $('#basedOnSave').prop('checked', true);
        else if (basedOnType === "On Print") $('#basedOnPrint').prop('checked', true);
        else if (basedOnType === "On Event") {
            $('#onEventSettings').css('display', 'block');
            $('#basedOnEvent').prop('checked', true);
            const isInOut = $(event.target).attr('data-inout');
            if (isInOut == "true") $('#settingsOnLogout').prop('checked', true);
        }
        $("#basedOnModal").modal('toggle');
    },
    'click input.basedOnSettings': function (event) {
        if (event.target.id == "basedOnEvent") {
            const value = $(event.target).prop('checked');
            if (value) {
                $('#onEventSettings').css('display', 'block');
                $('#settingsOnEvents').prop('checked', true);
            } else {
                $('#onEventSettings').css('display', 'none');
                $('#settingsOnEvents').prop('checked', false);
                $('#settingsOnLogout').prop('checked', false);
            }
        } else if (event.target.id == 'basedOnFrequency') {
            const value = $(event.target).prop('checked');
            if(value) {
                $('#edtFrequencyDetail').css('display', 'flex');
                $('#basedOnSettingsTitle').css('border-top-width', '1px');
            }else {
                $('#edtFrequencyDetail').css('display', 'none');
                $('#basedOnSettingsTitle').css('border-top-width', '0px');
            }
        }
    },
    'click .btnSaveBasedOn': function () {
        event.preventDefault();
        let radioBasedOn = $('input[type=radio][name=basedOnRadio]:checked').attr('id');
        const selectedBasedOnId = localStorage.getItem('selected_editBasedOn_id');

        if (radioBasedOn == "basedOnPrint") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Print");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnSave") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Save");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnTransactionDate") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Transaction Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnDueDate") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Due Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnDate") {
            const dateValue = $('#edtBasedOnDate').val();
            if (dateValue) {
                $('#edtBasedOnDateRequiredText').css('display', 'none');
                setTimeout(function () {
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Time");
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').attr("data-time", dateValue);
                    $("#basedOnModal").modal('toggle');
                }, 100);
            } else {
                $('#edtBasedOnDateRequiredText').css('display', 'block');
            }
        } else if (radioBasedOn == "basedOnOutstanding") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("If Outstanding");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnEvent") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Event");
                const logInOrOut = $('#onEventSettings input[type=radio]:checked').attr('id');
                if (logInOrOut == 'settingsOnLogon') {
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').attr('data-inout', 'in');
                } else {
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').attr('data-inout', 'out');
                }
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else {
            $("#basedOnModal").modal('toggle');
        }

        localStorage.setItem('emailsetting-send', radioBasedOn);
    },


    'click .btnAddLetter': function (event) {
        let templateObject = Template.instance();
        templateObject.isAdd.set(true);
        $('#addLetterTemplateModal').modal('toggle');
    },

    'click #save-correspondence': function () {
        const templateObject = Template.instance()
        $('.fullScreenSpin').css('display', 'inline-block');
        // let correspondenceData = localStorage.getItem('correspondence');
        let correspondenceTemp = templateObject.correspondences.get()
        let tempLabel = $("#edtTemplateLbl").val();
        let tempSubject = $('#edtTemplateSubject').val();
        let tempContent = $("#edtTemplateContent").val();
        if(templateObject.isAdd.get() == true) {
            if(correspondenceTemp.length > 0 ) {
                let index = correspondenceTemp.findIndex(item=>{
                    return item.Ref_Type == tempLabel
                })
                if(index > 0) {
                    swal({
                        title: 'Oooops...',
                        text: 'There is already a template labeled ' + tempLabel,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                        } else if (result.dismiss === 'cancel') { }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                } else {
                   
                    sideBarService.getCorrespondences().then(dObject =>{
    
                        let temp = {
                            Active: true,
                            EmployeeId: Session.get('mySessionEmployeeLoggedID'),
                            Ref_Type: tempLabel,
                            MessageAsString: tempContent,
                            MessageFrom: "",
                            MessageId : dObject.tcorrespondence.length.toString(),
                            MessageTo : "",
                            ReferenceTxt: tempSubject,
                            Ref_Date: moment().format('YYYY-MM-DD'),
                            Status: ""
                        }
                        let objDetails = {
                            type: 'TCorrespondence',
                            fields: temp
                        }
        
                        // let array = [];
                        // array.push(objDetails)
                       
                        sideBarService.saveCorrespondence(objDetails).then(data=>{
                            sideBarService.getCorrespondences().then(function(dataUpdate){
                                addVS1Data('TCorrespondence', JSON.stringify(dataUpdate)).then(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    swal({
                                        title: 'Success',
                                        text: 'Template has been saved successfully ',
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'Continue'
                                    }).then((result) => {
                                        if (result.value) {
                                            $('#addLetterTemplateModal').modal('toggle')
                                            templateObject.getCorrespondence();
                                            
                                        } else if (result.dismiss === 'cancel') { }
                                    });
                                }).catch(function(err) {
                                })
                            }).catch(function(err) {
                            })
                        }).catch(function () {
                            swal({
                                title: 'Oooops...',
                                text: 'Something went wrong',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    $('#addLetterTemplateModal').modal('toggle')
                                    $('.fullScreenSpin').css('display', 'none');
                                } else if (result.dismiss === 'cancel') { }
                            });
                        })
                    })
                }
            } else {
    
                sideBarService.getCorrespondences().then(dObject =>{
                    let temp = {
                        Active: true,
                        EmployeeId: Session.get('mySessionEmployeeLoggedID'),
                        Ref_Type: tempLabel,
                        MessageAsString: tempContent,
                        MessageFrom: "",
                        MessageId : dObject.tcorrespondence.length.toString(),
                        MessageTo : "",
                        ReferenceTxt: tempSubject,
                        Ref_Date: moment().format('YYYY-MM-DD'),
                        Status: ""
                    }
                    let objDetails = {
                        type: 'TCorrespondence',
                        fields: temp
                    }
        
                    let array = [];
                        array.push(objDetails)
        
                    sideBarService.saveCorrespondence(objDetails).then(data=>{
                        sideBarService.getCorrespondences().then(function(dataUpdate){
                            addVS1Data('TCorrespondence', JSON.stringify(dataUpdate)).then(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'Success',
                                    text: 'Template has been saved successfully ',
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'Continue'
                                }).then((result) => {
                                    if (result.value) {
                                        $('#addLetterTemplateModal').modal('toggle')
                                        templateObject.getCorrespondence();
                                        
                                    } else if (result.dismiss === 'cancel') { }
                                });
                            }).catch(function(err) {
                            })
                        }).catch(function(err) {
                        })
                    }).catch(function () {
                        swal({
                            title: 'Oooops...',
                            text: 'Something went wrong',
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                $('#addLetterTemplateModal').modal('toggle')
                                $('.fullScreenSpin').css('display', 'none');
                            } else if (result.dismiss === 'cancel') { }
                        });
                    })
                })
            }
        } else {
            if(correspondenceTemp.length > 0 ) {
                let index = correspondenceTemp.findIndex(item=>{
                    return item.MessageId == templateObject.selectedRowID.get()
                })
                if(index > -1) {
                    let objDetail = correspondenceTemp[index];
                    objDetail.Ref_Type = tempLabel;
                    objDetail.ReferenceTxt = tempSubject;
                    objDetail.MessageAsString = tempContent;
                    let objectData = {
                        type: "TCorrespondence",
                        fields: objDetail
                    }
                    sideBarService.saveCorrespondence(objectData).then(function() {
                        sideBarService.getCorrespondences().then(function(dataUpdate){
                            addVS1Data('TCorrespondence', JSON.stringify(dataUpdate)).then(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                swal({
                                    title: 'Success',
                                    text: 'Template has been updated successfully ',
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'Continue'
                                }).then((result) => {
                                    if (result.value) {
                                        templateObject.getCorrespondence();
                                        $('#addLetterTemplateModal').modal('toggle')
                                    } else if (result.dismiss === 'cancel') { }
                                });
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            })
                        })
                    }).catch(function(error) {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Ooops',
                            text: 'Template has not been updated',
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Continue'
                        }).then((result) => {
                            if (result.value) {
                                templateObject.getCorrespondence();
                            } else if (result.dismiss === 'cancel') { }
                        });
                    })
                }
            } 
        }
    },


    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        location.reload(true);
    }
});


Template.emailsettings.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.code == 'NA') {
                return 1;
            } else if (b.code == 'NA') {
                return -1;
            }
            return (a.code.toUpperCase() > b.code.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },

    invoicerecords: () => {
        return Template.instance().invoicerecords.get();
    },

    correspondences: () => {
        return Template.instance().correspondences.get();
    },

    essentialReportSchedules: () => {
        return Template.instance().essentialReportSchedules.get();
    },
    employeescheduledrecord: () => {
        return Template.instance().employeescheduledrecord.get();
    },
    reportTypeData: () => {
        return Template.instance().formsData.get();
    },
    checkIfEssentials: (typeId) => {
        return typeId == 1 || typeId == 54 || typeId == 129 || typeId == 177;
    },
    checkIfNotEssentials: (typeId) => {
        return typeId !== 1 && typeId !== 54 && typeId !== 129 && typeId !== 177;
    },

    organizationname: () => {
        return Session.get('vs1companyName');
    },
    organizationurl: () => {
        return Session.get('vs1companyURL');
    },
    companyaddress1: () => {
        return Session.get('vs1companyaddress1');
    },
    companyaddress2: () => {
        return Session.get('vs1companyaddress2');
    },
    city: () => {
        return Session.get('vs1companyCity');
    },
    state: () => {
        return Session.get('companyState');
    },
    poBox: () => {
        return Session.get('vs1companyPOBox');
    },

    companyphone: () => {

        let phone = "Phone: " + Session.get('vs1companyPhone');
        return phone;
    },
    companyabn: () => { //Update Company ABN
        let countryABNValue = "ABN: " + Session.get('vs1companyABN');
        if (LoggedCountry == "South Africa") {
            countryABNValue = "Vat No: " + Session.get('vs1companyABN');;
        }
        return countryABNValue;
    },
    companyReg: () => { //Add Company Reg
        let countryRegValue = '';
        if (LoggedCountry == "South Africa") {
            countryRegValue = "Reg No: " + Session.get('vs1companyReg');
        }

        return countryRegValue;
    },

    isAdd:()=>{
        return Template.instance().isAdd.get();
    }

});
