import {SalesBoardService} from '../js/sales-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {InvoiceService} from "../invoice/invoice-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import {OrganisationService} from '../js/organisation-service';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-editable-select';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.processList.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.selectedAccount = new ReactiveVar('');
    // templateObject.selectedInventoryAssetAccount = new ReactiveVar('');
})

Template.processList.onRendered (function() {
    const templateObject = Template.instance();

    templateObject.getProcessRecords  = function(e) {
        let tempArray = localStorage.getItem('TProcesses');
        templateObject.datatablerecords.set(tempArray?JSON.parse(tempArray): []);
    }
    templateObject.getProcessRecords();

    $(document).on('click', '.btnRefresh', function(e) {
        templateObject.getProcessRecords();
    })

    $(document).on('keyup', '.edtHourlyCost', function(e) {
        if($('#edtHourlyCost').val() != '' &&  $('#edtHourlyOverheadCost').val() == '') {
            $('#edtTotalHourlyCosts').val($('#edtHourlyCost').val())
        } else if ($('#edtHourlyCost').val() == '' &&  $('#edtHourlyOverheadCost').val() != '') {
            $('#edtTotalHourlyCosts').val($('#edtHourlyOverheadCost').val())
        } else if ($('#edtHourlyCost').val() != '' &&  $('#edtHourlyOverheadCost').val() != '') {
            $('#edtTotalHourlyCosts').val((parseFloat($('#edtHourlyCost').val()) + parseFloat($('#edtHourlyOverheadCost').val())).toString())
        }
        })

        

    $(document).on("click", "#btnNewProcess", function (e) {
        $('#newProcessModal').modal('toggle')
    });

    $(document).on('click', '#newProcessModal #btnSaveProcess', function (e) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let processName = $('#edtProcessName').val() || '';
        let processDescription = $('#edtDescription').val()|| '';
        let dailyHours = $('#edtDailyHours').val()|| '';
        let hourlyCost = $('#edtHourlyCost').val()|| '';
        let cogs = $('#edtCOGS').val() || '';
        let expenseAccount = $('#edtExpenseAccount').val() || '';
        let overheadHourlyCost = $('#edtHourlyOverheadCost').val() || '';
        let overheadCOGS = $('#edtOverheadCOGS').val() || '';
        let overheadExpenseAcc = $('#edtOverheadExpenseAccount').val() || '';
        let totalHourCost = $('#edtTotalHourlyCosts').val() || '';
        let wastage = $('#edtWastage').val() || '';

        if(processName == '') {
            swal('Please provide the process name !', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }

        if(dailyHours == '') {
            swal('Please input daily hours !', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }


        if(hourlyCost == '') {
            swal('Please input hourly cost', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }

        if(cogs == '') {
            swal('Please provide Cost of goods sold', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }

        if(expenseAccount == '') {
            swal('Please provide expense account', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }

        if(overheadHourlyCost != '' && overheadCOGS == '') {
            swal('Please provide cost of goods sold', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }

        if(overheadHourlyCost != '' && overheadExpenseAcc == '') {
            swal('Please provide cost of expense account', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }
        
        let objDetail = {
            type: 'TProcess',
            fields: {
                name: processName,
                description: processDescription,
                dailyHours:  dailyHours,
                hourlyLabourCost: hourlyCost,
                cogs: cogs,
                expenseAccount: expenseAccount,
                oHourlyCost: overheadHourlyCost,
                oCogs: overheadCOGS,
                oExpense: overheadExpenseAcc,
                totalHourlyCost: totalHourCost,
                wastage: wastage
            }
        }

        let processReocords = localStorage.getItem('TProcesses')
        let processesTemp =  processReocords?JSON.parse(processReocords):[];

        if(processesTemp.length == 0 ) {
            processesTemp.push(objDetail);
        } else {
            let index = processesTemp.findIndex(item=>{
                return item.fields.name == objDetail.fields.name
            })
            if(index > -1) {
                $('.fullScreenSpin').css('display', 'none')
                swal({
                    title: 'Oooops...',
                    text: 'Process name is duplicated',
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {
    
                    }
                });
                return;
            } else {
                processesTemp.push(objDetail)
            }
        }
        localStorage.setItem('TProcesses', JSON.stringify(processesTemp))
        $('.fullScreenSpin').css('display', 'none');
        swal({
            title: 'Success',
            text: 'Process has been saved successfully',
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Continue',
        }).then ((result)=>{
            templateObject.getProcessRecords();
            $('#newProcessModal').modal('toggle');
        })
    })

    $(document).ready(function() {
        $('#edtCOGS').editableSelect();
        $('#edtExpenseAccount').editableSelect();
        $('#edtOverheadCOGS').editableSelect();
        $('#edtOverheadExpenseAccount').editableSelect();
        $('#edtWastage').editableSelect();
        // templateObject.selectedInventoryAssetAccount.set('Inventory Asset Wastage')
    })

    $(document).on('click', '#newProcessModal #edtCOGS', function (e) {
        $('#accountListModal').modal('toggle')
        templateObject.selectedAccount.set('cogs');
    })
    $(document).on('click', '#newProcessModal #edtExpenseAccount', function (e) {
        $('#accountListModal').modal();
        templateObject.selectedAccount.set('expenseAccount');
    })
    $(document).on('click', '#newProcessModal #edtOverheadCOGS', function(e) {
        $('#accountListModal').modal();
        templateObject.selectedAccount.set('overheadCOGS');
    })
    $(document).on('click', '#newProcessModal #edtOverheadExpenseAccount', function (e) {
        $('#accountListModal').modal();
        templateObject.selectedAccount.set('overheadExpenseAccount');
    })

    $(document).on('click', '#newProcessModal #edtWastage', function(e){
        $('#accountListModal').modal();
        templateObject.selectedAccount.set('wastage');
    })
    $(document).on('click', '#accountListModal table tr', function(e) {
        let columnDataValue = $(e.target).closest('tr').find('.productName').text();
        switch(templateObject.selectedAccount.get()) {
            case 'cogs':
                $('#newProcessModal #edtCOGS').val(columnDataValue);
                break;
            case 'expenseAccount':
                $('#newProcessModal #edtExpenseAccount').val(columnDataValue);
                break;
            case 'overheadCOGS':
                $('#newProcessModal #edtOverheadCOGS').val(columnDataValue);
                break;
            case 'overheadExpenseAccount':
                $('#newProcessModal #edtOverheadExpenseAccount').val(columnDataValue);
                break;
            case 'wastage':
                // templateObject.selectedInventoryAssetAccount.set(columnDataValue);
                $('#newProcessModal #edtWastage').val(columnDataValue);
                break;
            default:
                break;
        }
        $('#accountListModal').modal('toggle');
    })
});

Template.processList.helpers ({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get();
    },
    selectedInventoryAssetAccount: () => {
        return Template.instance().selectedInventoryAssetAccount.get();
    }
    
})

// Template.processList.events({
//     'click #newProcessModal #edtCOGS': function (event) {
//         $('#newProcessModal #edtCOGS').select();
//         $('#newProcessModal #edtCOGS').editableSelect()
//     },

//     'click #newProcessModal #edtExpenseAccount': function(event) {
//         $('#newProcessModal #edtExpenseAccount').select();
//         $('#newProcessModal #edtExpenseAccount').editableSelect()
//     },

//     'click #newProcessModal #edtOverheadCOGS': function(event) {
//         $('#newProcessModal #edtOverheadCOGS').select();
//         $('#newProcessModal #edtOverheadCOGS').editableSelect();
//     },

//     'click #newProcessModal #edtOverheadExpenseAccount': function (event) {
//         $('#newProcessModal #edtOverheadExpenseAccount').select();
//         $('#newProcessModal #edtOverheadExpenseAccount').editableSelect();
//     }
// })