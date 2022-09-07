import { SalesBoardService } from './sales-service';
import {PurchaseBoardService} from './purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
import { OrganisationService } from '../js/organisation-service';
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { Random } from 'meteor/random';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
import {ContactService} from "../contacts/contact-service";
import { TaxRateService } from "../settings/settings-service";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();


Template.new_process.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.processrecord = new ReactiveVar([]);
    templateObject.selectedAccount = new ReactiveVar('cogs');
});

Template.new_process.onRendered(() => {
    const templateObject = Template.instance();
    // $('#edtCOGS').select();
    // $('#edtCOGS').editableSelect();
    // $('#edtExpenseAccount').editableSelect();
    // $('#edtOverheadCOGS').editableSelect();
    // $('#edtOverheadExpenseAccount').editableSelect();
    // $('#edtWastage').editableSelect();
    var currentID = FlowRouter.current().queryParams.id;
    templateObject.getProcessDetail  = function() {
        let tempArray = localStorage.getItem('TProcesses');
        let processList = tempArray?JSON.parse(tempArray):[];
        let processDetail = {};
        if(currentID) {
            let index = processList.findIndex(process=>{
                return process.fields.id == parseInt(currentID);
            })
            if(index > -1) {
                processDetail = processList[index].fields
            }
        } 
        let objDetail = {
            id: currentID?currentID : processList.length + 1,
            name: processDetail.name?processDetail.name: '',
            dailyHours: processDetail.dailyHours?processDetail.dailyHours: '',
            description: processDetail.description?processDetail.description: '',
            hourlyCost: processDetail.hourlyLabourCost?processDetail.hourlyLabourCost: '',
            cogs: processDetail.cogs?processDetail.cogs:'',
            expenseAccount: processDetail.expenseAccount?processDetail.expenseAccount : '',
            oHourlyCost: processDetail.oHourlyCost?processDetail.oHourlyCost: '',
            oCOGS: processDetail.oCogs?processDetail.oCogs: '',
            oExpenseAccount: processDetail.oExpense? processDetail.oExpense : '',
            totalHCost: processDetail.totalHourlyCost?processDetail.totalHourlyCost: '',
            wastage: processDetail.wastage?processDetail.wastage: ''
        }

        templateObject.processrecord.set(objDetail);        
    }

    templateObject.getProcessDetail();

   
    setTimeout(()=>{
        $('#edtCOGS').editableSelect();
        $('#edtExpenseAccount').editableSelect();
        $('#edtOverheadCOGS').editableSelect();
        $('#edtOverheadExpenseAccount').editableSelect();
        $('#edtWastage').editableSelect();
    }, 500)
            // templateObject.selectedInventoryAssetAccount.set('Inventory Asset Wastage')
            



  
});



Template.new_process.helpers({
   processrecord: ()=>{
    return Template.instance().processrecord.get();
   }
});

Template.new_process.events({
    'click #btnSaveProcess': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let currentID = FlowRouter.current().queryParams.id;
        let tempArray = localStorage.getItem('TProcesses');
        let processes = tempArray?JSON.parse(tempArray):[];
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
        let existIndex = -1;
        if(currentID) {
            existIndex = processes.findIndex(process=>{
                return process.fields.id == parseInt(currentID)
            })
        }
        if(existIndex > -1) {
            processes.splice(existIndex, 1);
        }

        let objDetail = {
            type: 'TProcess',
            fields: {
                id: -1,
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
        if(currentID) {
            objDetail.fields.id = currentID
        }else {
            objDetail.fields.id = processes.length + 1
        }

        processes.push(objDetail);
        localStorage.setItem('TProcesses', JSON.stringify(processes))
        $('.fullScreenSpin').css('display', 'none');
        swal({
            title: 'Success',
            text: 'Process has been saved successfully',
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Continue',
        }).then ((result)=>{
            FlowRouter.go('/processlist')
        })
    },

    'click #btnCancel': function(event) {
        FlowRouter.go('/processlist')
    },

    'click #edtCOGS': function (event) {
        $('#edtCOGS').select();
        $('#edtCOGS').editableSelect()
    },

    'click #edtExpenseAccount': function(event) {
        $('#edtExpenseAccount').select();
        $('#edtExpenseAccount').editableSelect()
    },

    'click #edtOverheadCOGS': function(event) {
        $('#edtOverheadCOGS').select();
        $('#edtOverheadCOGS').editableSelect();
    },

    'click #edtOverheadExpenseAccount': function (event) {
        $('#edtOverheadExpenseAccount').select();
        $('#edtOverheadExpenseAccount').editableSelect();
    },

    'click #edtWastage': function(event) {
        $('#edtWastage').select();
        $('#edtWastage').editableSelect();
    },


    'click #edtCOGS': function(e) {
        let templateObject = Template.instance();
        $('#accountListModal').modal();
        templateObject.selectedAccount.set('cogs');
    },
    'click #edtExpenseAccount': function (e) {
        let templateObject = Template.instance();
        $('#expenseAccountListModal').modal();
        templateObject.selectedAccount.set('expenseAccount');
    },
    'click #edtOverheadCOGS': function(e) {
        let templateObject = Template.instance();
        $('#accountListModal').modal();
        templateObject.selectedAccount.set('overheadCOGS');
    },
    'click #edtOverheadExpenseAccount': function (e) {
        let templateObject = Template.instance();
        $('#expenseAccountListModal').modal();
        templateObject.selectedAccount.set('overheadExpenseAccount');
    },

    'click #edtWastage': function(e){
        $('#assetAccountListModal').modal();
    },
    'click #accountListModal table tr': function(e) {
        let templateObject = Template.instance();
        let columnDataValue = $(e.target).closest('tr').find('.productName').text();
        switch(templateObject.selectedAccount.get()) {
            case 'cogs':
                $('#edtCOGS').val(columnDataValue);
                break;
           
            case 'overheadCOGS':
                $('#edtOverheadCOGS').val(columnDataValue);
                break;
           
            default:
                break;
        }
        $('#accountListModal').modal('toggle');
    },
    'click #expenseAccountListModal table tr': function(e){
        let templateObject = Template.instance();
        let columnDataValue = $(e.target).closest('tr').find('.productName').text();
        switch(templateObject.selectedAccount.get()) {
            case 'expenseAccount':
                $('#edtExpenseAccount').val(columnDataValue);
                break;
            case 'overheadExpenseAccount':
                $('#edtOverheadExpenseAccount').val(columnDataValue);
                break;
            default:
                break;
        }
        $('#expenseAccountListModal').modal('toggle');
    }, 

    'click #assetAccountListModal table tr': function(e) {
        let columnDataValue = $(e.target).closest('tr').find('.productName').text();
        $('#edtWastage').val(columnDataValue);
        $('#assetAccountListModal').modal('toggle');
    },
    'blur .edtHourlyCost': function(e) {
        if($('#edtHourlyCost').val() != '' &&  $('#edtHourlyOverheadCost').val() == '') {
            $('#edtTotalHourlyCosts').val($('#edtHourlyCost').val())
        } else if ($('#edtHourlyCost').val() == '' &&  $('#edtHourlyOverheadCost').val() != '') {
            $('#edtTotalHourlyCosts').val($('#edtHourlyOverheadCost').val())
        } else if ($('#edtHourlyCost').val() != '' &&  $('#edtHourlyOverheadCost').val() != '') {
            $('#edtTotalHourlyCosts').val(Currency + (parseFloat($('#edtHourlyCost').val().replace('$', '')) + parseFloat($('#edtHourlyOverheadCost').val().replace('$', ''))).toFixed(2))
        }
    },

    'blur #edtHourlyCost': function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#edtHourlyCost').val(Currency +parseFloat( $('#edtHourlyCost').val()).toFixed(2)) 
    },

    'focus #edtHourlyCost': function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#edtHourlyCost').val($('#edtHourlyCost').val().replace('$', ''));
    },

    'blur #edtHourlyOverheadCost': function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#edtHourlyOverheadCost').val(Currency +parseFloat( $('#edtHourlyOverheadCost').val()).toFixed(2)) 
    },

    'focus #edtHourlyOverheadCost': function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#edtHourlyOverheadCost').val($('#edtHourlyOverheadCost').val().replace('$', ''));
    },
    // 'click #edtCOGS': function (e) {
      
    // }
});



