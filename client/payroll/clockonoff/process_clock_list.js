import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import { ContactService } from "../../contacts/contact-service";
import { ProductService } from "../../product/product-service";
import { SideBarService } from '../../js/sidebar-service';
import 'jquery-editable-select';
import CachedHttp from '../../lib/global/CachedHttp';
import erpObject from '../../lib/global/erp-objects';
import LoadingOverlay from '../../LoadingOverlay';
import TableHandler from '../../js/Table/TableHandler';
import { Template } from 'meteor/templating';
import "./process_clock_list.html";

let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.process_clock_template.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords1 = new ReactiveVar([]);
    templateObject.productsdatatablerecords = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.jobsrecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedTimesheet = new ReactiveVar([]);
    templateObject.timesheetrecords = new ReactiveVar([]);
    templateObject.selectedTimesheetID = new ReactiveVar();
    templateObject.selectedFile = new ReactiveVar();

    templateObject.includeAllProducts = new ReactiveVar();
    templateObject.includeAllProducts.set(true);

    templateObject.useProductCostaspayRate = new ReactiveVar();
    templateObject.useProductCostaspayRate.set(false);

    templateObject.allnoninvproducts = new ReactiveVar([]);

    templateObject.selectedConvertTimesheet = new ReactiveVar([]);
    templateObject.isAccessLevels = new ReactiveVar();

    templateObject.timesheets = new ReactiveVar([]);
    templateObject.employees = new ReactiveVar([]);
    templateObject.payPeriods = new ReactiveVar([]);
});

Template.process_clock_template.onRendered(function() {

    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();
    let productService = new ProductService();
    const employeeList = [];
    const jobsList = [];
    const timesheetList = [];
    const timeSheetList = [];
    const dataTableList = [];
    const tableHeaderList = [];

    var splashArrayTimeSheetList = new Array();

    let isAccessLevels = localStorage.getItem('CloudAccessLevelsModule');
    templateObject.isAccessLevels.set(isAccessLevels);


    let seeOwnTimesheets = localStorage.getItem('CloudTimesheetSeeOwnTimesheets') || false;
    let launchClockOnOff = localStorage.getItem('CloudTimesheetLaunch') || false;
    let canClockOnClockOff = localStorage.getItem('CloudClockOnOff') || false;
    let createTimesheet = localStorage.getItem('CloudCreateTimesheet') || false;
    let timesheetStartStop = localStorage.getItem('CloudTimesheetStartStop') || false;
    let showTimesheetEntry = localStorage.getItem('CloudTimesheetEntry') || false;
    let showTimesheet = localStorage.getItem('CloudShowTimesheet') || false;
    
    if (launchClockOnOff == true && canClockOnClockOff == true) {
        setTimeout(function() {
            $("#btnClockOnOff").trigger("click");
        }, 500);
    }

    if (createTimesheet == false) {
        setTimeout(function() {
            $(".btnSaveTimeSheetForm").prop("disabled", true);
        }, 500);
    }

    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentBeginDate.getMonth() + 1);
    let fromDateDay = currentBeginDate.getDate();
    if ((currentBeginDate.getMonth() + 1) < 10) {
        fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
        fromDateMonth = (currentBeginDate.getMonth() + 1);
    }

    if (currentBeginDate.getDate() < 10) {
        fromDateDay = "0" + currentBeginDate.getDate();
    }

    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();

    let prevMonthToDate = (moment().subtract(reportsloadMonths, 'months')).format("DD/MM/YYYY");

    Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), 'tblProcessClockList', function(error, result) {
        if (error) {} else {
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
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0)
                $(this).addClass('text-danger')
        });
    };


    


    templateObject.timeToDecimal = function(time) {
        var hoursMinutes = time.split(/[.:]/);
        var hours = parseInt(hoursMinutes[0], 10);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes / 60;
    }

    templateObject.timeFormat = function(hours) {
        var decimalTime = parseFloat(hours).toFixed(2);
        decimalTime = decimalTime * 60 * 60;
        var hours = Math.floor((decimalTime / (60 * 60)));
        decimalTime = decimalTime - (hours * 60 * 60);
        var minutes = Math.abs(decimalTime / 60);
        decimalTime = decimalTime - (minutes * 60);
        hours = ("0" + hours).slice(-2);
        minutes = ("0" + Math.round(minutes)).slice(-2);
        let time = hours + ":" + minutes;
        return time;
    }

    function checkStockColor() {
        $('td.colStatus').each(function() {
            if ($(this).text() == "Processed") {
                $(this).addClass('isProcessedColumn');
            } else if ($(this).text() == "Unprocessed") {
                $(this).addClass('isUnprocessedColumn');
            } else if ($(this).text() == "Converted") {
                $(this).addClass('isConvertedColumn');
            }

        });
    };
      

});

Template.process_clock_template.events({
   
    'click .chkDatatable': function(event) {
        var columns = $('#tblTimeSheet th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
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
    'click .resetTable': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: localStorage.getItem('mycloudLogonID'),
            clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'tblTimeSheet'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {} else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function(event) {
        let lineItems = [];
        //let datatable =$('#tblTimeSheet').DataTable();
        $('.columnSettings').each(function(index) {
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
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: localStorage.getItem('mycloudLogonID'),
            clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'tblTimeSheet'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'tblTimeSheet',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'tblTimeSheet',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
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
    'blur .divcolumn': function(event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblTimeSheet').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblProcessClockList th');
        $.each(datable, function(i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click #check-all': function(event) {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
        } else {
            $(".chkBox").prop("checked", false);
        }
    },
    'click .chkBox': function() {
        var listData = $(this).closest('tr').find(".colID").text() || 0;
        const templateObject = Template.instance();
        const selectedTimesheetList = [];
        const selectedTimesheetToConvertList = [];
        const selectedTimesheetCheck = [];
        let ids = [];
        let JsonIn = {};
        let JsonIn1 = {};
        let myStringJSON = '';
        $('.chkBox:checkbox:checked').each(function() {
            var chkIdLine = $(this).closest('tr').find(".colID").text() || 0;
            let obj = {
                TimesheetID: parseInt(chkIdLine)
            }

            selectedTimesheetList.push(obj);
            selectedTimesheetToConvertList.push(parseInt(chkIdLine));
            templateObject.selectedTimesheetID.set(chkIdLine);
            // selectedAppointmentCheck.push(JsonIn1);
            // }
        });
        templateObject.selectedTimesheet.set(selectedTimesheetList);
        JsonIn = {
            Name: "VS1_InvoiceTimesheet",
            Params: {
                TimesheetIDs: selectedTimesheetToConvertList
            }
        };
        templateObject.selectedConvertTimesheet.set(JsonIn);
    },
  
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        var columns = $('#tblProcessClockList th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
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
    
    'click .btnRefreshOne': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        // sideBarService.getAllTimeSheetList().then(function(data) {
        //     addVS1Data('TTimeSheet', JSON.stringify(data));
        //     setTimeout(function() {
        //         window.open('/timesheet', '_self');
        //     }, 500);
        // }).catch(function(err) {
        //     $('.fullScreenSpin').css('display', 'none');
        //     swal({
        //         title: 'Oooops...',
        //         text: err,
        //         type: 'error',
        //         showCancelButton: false,
        //         confirmButtonText: 'Try Again'
        //     }).then((result) => {
        //         if (result.value) {
        //             // Meteor._reload.reload();
        //         } else if (result.dismiss === 'cancel') {}
        //     });
        // });
        $('.fullScreenSpin').css('display', 'none');
    },

  
    'click #btnGroupClockOnOff': function(event) {
        $('#groupclockonoff').modal('show');
    },

    
    'click .btnGroupClockSave': function(event) {

        $('.fullScreenSpin').css('display', 'inline-block');

        templateObject = Template.instance();
        let contactService = new ContactService();
       
        let type = "Clockon";
        if ($('#break').is(":checked")) {
            type = $('#break').val();
        } else if ($('#lunch').is(":checked")) {
            type = $('#lunch').val();
        } else if ($('#clockonswitch').is(":checked")) {
            type = $('#clockonswitch').val();
        } else if ($('#clockoffswitch').is(":checked")) {
            type = $('#clockoffswitch').val();
        }else {
            swal({
                title: 'Please Select Option',
                text: 'Please select Clockon, Break, Lunch or ClockOff Option',
                type: 'info',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((results) => {
                if (results.value) {} else if (results.dismiss === 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
            return false;
        }

        $('.fullScreenSpin').css('display', 'none');

        swal('The Group Clock On/Off  is saved', '', 'success');
    

    },

    'change #clockonswitch': function(event) {
        $('#break').prop('checked', false);
        $('#lunch').prop('checked', false);
        $('#clockoffswitch').prop('checked', false);
    },

    'change #clockoffswitch': function(event) {
        $('#break').prop('checked', false);
        $('#lunch').prop('checked', false);
        $('#clockonswitch').prop('checked', false);
    },
    
    'change #lunch': function(event) {
        $('#break').prop('checked', false);
        $('#clockoffswitch').prop('checked', false);
        $('#clockonswitch').prop('checked', false);
    },

    'change #break': function(event) {
        $('#lunch').prop('checked', false);
        $('#clockoffswitch').prop('checked', false);
        $('#clockonswitch').prop('checked', false);

    },
        



});

Template.process_clock_template.helpers({
    jobsrecords: () => {
        return Template.instance().jobsrecords.get().sort(function(a, b) {
            if (a.jobname == 'NA') {
                return 1;
            } else if (b.jobname == 'NA') {
                return -1;
            }
            return (a.jobname.toUpperCase() > b.jobname.toUpperCase()) ? 1 : -1;
        });
    },
    edithours: () => {
        return localStorage.getItem('CloudEditTimesheetHours') || false;
    },
    clockOnOff: () => {
        return localStorage.getItem('CloudClockOnOff') || false;
    },
    launchClockOnOff: () => {
        return localStorage.getItem('launchClockOnOff') || false;
    },
    seeOwnTimesheets: () => {
        return localStorage.getItem('seeOwnTimesheets') || false;
    },
    timesheetStartStop: () => {
        return localStorage.getItem('timesheetStartStop') || false;
    },
    showTimesheetEntries: () => {
        return localStorage.getItem('CloudTimesheetEntry') || false;
    },
    showTimesheet: () => {
        return localStorage.getItem('CloudShowTimesheet') || false;
    },
    employeerecords: () => {
        return Template.instance().employeerecords.get().sort(function(a, b) {
            if (a.employeename == 'NA') {
                return 1;
            } else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.sortdate == 'NA') {
                return 1;
            } else if (b.sortdate == 'NA') {
                return -1;
            }
            return (a.sortdate.toUpperCase() > b.sortdate.toUpperCase()) ? 1 : -1;
        });
    },
    productsdatatablerecords: () => {
        return Template.instance().productsdatatablerecords.get().sort(function(a, b) {
            if (a.productname == 'NA') {
                return 1;
            } else if (b.productname == 'NA') {
                return -1;
            }
            return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },
    loggedInEmployee: () => {
        return localStorage.getItem('mySessionEmployee') || '';
    }

});
