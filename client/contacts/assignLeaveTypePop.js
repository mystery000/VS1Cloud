import { EmployeePayrollService } from '../js/employeepayroll-service';
import { Template } from 'meteor/templating';
import './assignLeaveTypePop.html';
import {SideBarService} from "../js/sidebar-service";

var sideBarService = new SideBarService();
var employeePayrollService = new EmployeePayrollService();
Template.assignLeaveTypePop.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.custdatatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.leaveTypesList = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();
    templateObject.currentDrpDownID = new ReactiveVar();


    templateObject.getDataTableList = function(data) {
        var dataList = [
            data.fields.ID || "",
            data.fields.LeaveType || "",
            data.fields.LeaveCalcMethod || "",
            data.fields.HoursAccruedAnnually || 0,
            data.fields.HoursAccruedAnnuallyFullTimeEmp || 0,
            data.fields.HoursFullTimeEmpFortnightlyPay || 0,
            data.fields.HoursLeave || 0,
            data.fields.OpeningBalance || 0,
            data.fields.OnTerminationUnusedBalance ? 'Paid Out': 'Not Paid Out',
            ""
        ];
        return dataList;
    }

    let headerStructure = [
        { index: 0, label: '#Assign Leave ID', class: 'colALTypeID', active: false, display: true, width: "50" },
        { index: 1, label: 'Leave', class: 'colALTypeLeave', active: true, display: true, width: "50" },
        { index: 2, label: 'Leave Calculation Method', class: 'colALTypeLeaveCalMethod', active: true, display: true, width: "50" },
        { index: 3, label: 'Hours accrued annually', class: 'colALTypeHoursAccruedAnnually', active: true, display: true, width: "50" },
        { index: 4, label: 'Hours accrued annually full time employee', class: 'colALTypeHoursAccruedAnnuallyFullTimeEmp', active: true, display: true, width: "50" },
        { index: 5, label: 'Hours a full-time employee works in a Fortnightly pay Period', class: 'colALTypeHoursFullTimeEmpFortnightlyPay', active: true, display: true, width: "50" },
        { index: 6, label: 'Hours', class: 'colALTypeHours', active: true, display: true, width: "50" },
        { index: 7, label: 'Opening Balance', class: 'colALTypeOpeningBalance', active: true, display: true, width: "50" },
        { index: 8, label: 'On termination Balance', class: 'colALTypeTerminationBalance', active: true, display: true, width: "50" },
        { index: 9, label: 'Status', class: 'colStatus', active: true, display: true, width: "50" },
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.assignLeaveTypePop.onRendered(function () {
    // const templateObject = Template.instance();

    //
    //
    // templateObject.getTLeaveTypes = async() => {
    //     try {
    //         let data = [];
    //         let dataObject = await getVS1Data('TAssignLeaveType')
    //         data = JSON.parse(dataObject[0].data);
    //         if (data.tassignleavetype.length > 0) {
    //             let useData = data.tassignleavetype;
    //             templateObject.leaveTypesList.set(useData);
    //         }
    //     } catch (err) {
    //     }
    // }
    //
    // templateObject.getTLeaveTypes();
});

Template.assignLeaveTypePop.events({
    "click #tblAssignLeaveTypes tbody tr": (e, ui) => {
        const id = $(e.currentTarget).closest("tr").find(".colALTypeID").text();
        let name = $(e.currentTarget).closest("tr").find(".colALTypeLeave").text();
        let Hours = $(e.currentTarget).closest("tr").find(".colALTypeHours").text() ||'';
        $('#edtLeaveRequestID').val(id);
        $('#edtLeaveTypeofRequestID').val(id);
        $('#edtLeaveTypeofRequest').val(name); 
        $('#edtLeaveHours').val(Hours); 

        $('#assignLeaveTypeSettingsModal').on('hidden.bs.modal', function(e) {
            // window.open("/appointments", "_self");
        });
        $('#assignLeaveTypeSettingsModal').hide();
    }
});


Template.assignLeaveTypePop.onCreated(function () {
    const templateObject = Template.instance();
    setTimeout(function () {
        $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf,#edtLeaveStartDate,#edtLeaveEndDate,#edtPeriodPaymentDate,#paymentDate").datepicker({
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
        $('#edtLeavePayPeriod').editableSelect('add','Weekly');
        $('#edtLeavePayPeriod').editableSelect('add','Fortnightly');
        $('#edtLeavePayPeriod').editableSelect('add','Twice Monthly');
        $('#edtLeavePayPeriod').editableSelect('add','Four Weekly');
        $('#edtLeavePayPeriod').editableSelect('add','Monthly');
        $('#edtLeavePayPeriod').editableSelect('add','Quarterly');
        $('#edtLeavePayStatus').editableSelect('add','Awaiting');
        $('#edtLeavePayStatus').editableSelect('add','Approved');
        $('#edtLeavePayStatus').editableSelect('add','Denied');
        $('#edtLeavePayStatus').editableSelect('add','Deleted');

        $('#period').editableSelect('add','Weekly');
        $('#period').editableSelect('add','Fortnightly');
        $('#period').editableSelect('add','Twice Monthly');
        $('#period').editableSelect('add','Four Weekly');
        $('#period').editableSelect('add','Monthly');
        $('#period').editableSelect('add','Quarterly');
        
        $('#edtTfnExemption').editableSelect('add', function(item){
            $(this).val(item.id);
            $(this).text(item.name);
        });
        $('#edtTfnExemption').editableSelect().on('blur.editable-select', async function (e, li) {
            $("#edtTaxFileNumber").val("");
        });
        $('#edtEmploymentBasis').editableSelect('add', function(item){
            $(this).val(item.id);
            $(this).text(item.name);
        });
        $('#edtResidencyStatus').editableSelect('add', function(item){
            $(this).val(item.id);
            $(this).text(item.name);
        });
        $('#leaveCalcMethodSelect').editableSelect('add', function(item){
            $(this).val(item.id);
            $(this).text(item.name);
        });
        $('#onTerminationUnusedBalance').editableSelect('add', function(item){
            $(this).val(item.id);
            $(this).text(item.name);
        });
        $('#onTerminationUnusedBalance').editableSelect().on('blur.editable-select', async function (e, li) {
            let onTerminationUnusedBalance = $('#onTerminationUnusedBalance').val();
            if( onTerminationUnusedBalance == '1' || onTerminationUnusedBalance == 'Paid Out'){
                $('.eftLeaveTypeCont').removeClass('hideelement')
                $("#eftLeaveType").attr('checked', false)
            }else{
                $('.eftLeaveTypeCont').addClass('hideelement')
                $('.superannuationGuaranteeCont').addClass('hideelement')
            }
        });
        $('#superannuationTypeSelect').editableSelect('add', function(item){
            $(this).val(item.id);
            $(this).text(item.name);
        });
        $('#paymentFrequency').editableSelect('add', function(item){
            $(this).val(item.id);
            $(this).text(item.name);
        });
        $('#leaveCalcMethodSelect').editableSelect();
        $('#leaveCalcMethodSelect').editableSelect().on('blur.editable-select', async function (e, li) {
            let leaveCalcMethod = e.target.value || '';
            switch(leaveCalcMethod){
                case 'Manually Recorded Rate':
                    $('#hoursLeave').val('');
                    $('.handleLeaveTypeOption').addClass('hideelement')
                    $('.manuallyRecordedRate').removeClass('hideelement')
                break;
                case 'No Calculation Required':
                    $('.handleLeaveTypeOption').addClass('hideelement')
                break;
                case 'Based on Ordinary Earnings':
                    $('#hoursAccruedAnnuallyFullTimeEmp').val('');
                    $('#hoursFullTimeEmpFortnightlyPay').val('');
                    $('.handleLeaveTypeOption').addClass('hideelement')
                    $('.basedonOrdinaryEarnings').removeClass('hideelement')
                break;
                default:
                    $('#hoursAccruedAnnually').val('');
                    $('.handleLeaveTypeOption').addClass('hideelement')
                    $('.fixedAmountEachPeriodOption').removeClass('hideelement')
                break;
            }
        });
        $('#edtLeaveTypeofRequest').editableSelect();
        $('#edtLeaveTypeofRequest').editableSelect()
            .on('click.editable-select', async function (e, li) {
                let $search = $(this);
                let dropDownID = $search.attr('id')
                templateObject.currentDrpDownID.set(dropDownID);
                let offset = $search.offset();
                let searchName = e.target.value || '';
                if (e.pageX > offset.left + $search.width() - 8) { // X button 16px wide?
                    $('#assignLeaveTypeSettingsModal').modal('show');
                } else {
                    if (searchName.replace(/\s/g, '') == '') {
                        $('#assignLeaveTypeSettingsModal').modal('show');
                        return false
                    }
                    let dataObject = await getVS1Data('TAssignLeaveType');
                    if ( dataObject.length > 0) {
                        data = JSON.parse(dataObject[0].data);
                        let tAssignteavetype = data.tassignleavetype.filter((item) => {
                            // if( item.fields.LeaveType == searchName ){
                                return item;
                            // }
                        });
                    }
                }
            });
        //                 if( tAssignteavetype.length > 0 ){

        //                     let leaveCalcMethod = tAssignteavetype[0].fields.LeaveCalcMethod || '';

        //                     $('#leaveCalcMethodSelect').val(leaveCalcMethod)
        //                     switch(leaveCalcMethod){
        //                         case 'Manually Recorded Rate':
        //                             $('#hoursLeave').val('');
        //                             $('.handleLeaveTypeOption').addClass('hideelement');
        //                             $('.manuallyRecordedRate').removeClass('hideelement');
        //                             $('#hoursLeave').val(tAssignteavetype[0].fields.HoursLeave);
        //                         break;
        //                         case 'No Calculation Required':
        //                             $('.handleLeaveTypeOption').addClass('hideelement')
        //                         break;
        //                         case 'Based on Ordinary Earnings':
        //                             $('#hoursAccruedAnnuallyFullTimeEmp').val('');
        //                             $('#hoursFullTimeEmpFortnightlyPay').val('');
        //                             $('.handleLeaveTypeOption').addClass('hideelement');
        //                             $('.basedonOrdinaryEarnings').removeClass('hideelement');
        //                             $('#hoursAccruedAnnuallyFullTimeEmp').val(tAssignteavetype[0].fields.HoursAccruedAnnuallyFullTimeEmp);
        //                             $('#hoursFullTimeEmpFortnightlyPay').val(tAssignteavetype[0].fields.HoursFullTimeEmpFortnightlyPay);
        //                         break;
        //                         default:
        //                             $('#hoursAccruedAnnually').val('');
        //                             $('.handleLeaveTypeOption').addClass('hideelement');
        //                             $('.fixedAmountEachPeriodOption').removeClass('hideelement');
        //                             $('#hoursAccruedAnnually').val(tAssignteavetype[0].fields.HoursAccruedAnnually);
        //                         break;
        //                     }

        //                     $('#leaveTypeSelect').val(tAssignteavetype[0].fields.LeaveType || '');
        //                     $('#leaveCalcMethodSelect').val(tAssignteavetype[0].fields.LeaveCalcMethod);
                            
        //                     $('#openingBalance').val(tAssignteavetype[0].fields.OpeningBalance);
        //                     $('#onTerminationUnusedBalance').prop("checked", tAssignteavetype[0].fields.OnTerminationUnusedBalance);
        //                     $("#eftLeaveType").prop('checked', tAssignteavetype[0].fields.EFTLeaveType)
        //                     $("#superannuationGuarantee").prop('checked', tAssignteavetype[0].fields.SuperannuationGuarantee)

        //                     $('#assignteavetypeID').val(tAssignteavetype[0].fields.ID) || 0 ;
        //                 }
        //                 $('#assignLeaveTypeModal').modal('show');
        //             }
        //         }
        //     });
    }, 1000);

    $(document).on("click", "#tblAssignLeaveTypes tbody tr .colALType", function (e) {
        var table = $(this);
        let name = table.parent().find(".colALTypeLeave").text()||'';
        let ID = table.parent().find(".colALTypeID").text()||'';
        let Hours = table.parent().find(".colALTypeOpeningBalance").text()||'';
        let searchFilterID = templateObject.currentDrpDownID.get()
        $('#' + searchFilterID).val(name);
        $('#' + searchFilterID + 'ID').val(ID);
        $('#edtLeaveHours').val(Hours);
        
        $('#assignLeaveTypeSettingsModal').modal('toggle');
    });

});

Template.assignLeaveTypePop.helpers({
    terminationBalance: (t) => {
        return t ?  'Paid Out': 'Not Paid Out';
    },
    leaveTypesList: () => { 
        return Template.instance().leaveTypesList.get();
    },

    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },

    apiFunction:function() {
        let employeePayrollService = new EmployeePayrollService();
        return employeePayrollService.getAssignLeaveType;
    },

    searchAPI: function() {
        return employeePayrollService.getAssignLeaveType;
    },

    service: ()=>{
        let employeePayrollService = new EmployeePayrollService();
        return employeePayrollService;

    },

    datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    exDataHandler: function() {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    apiParams: function() {
        return ['limitCount', 'limitFrom'];
    },
});
