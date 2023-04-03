import { Template } from 'meteor/templating';
import "../manufacture/frm_process.html";
import { SalesBoardService } from './sales-service';
import {PurchaseBoardService} from './purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
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
import {ManufacturingService} from "../manufacture/manufacturing-service";


import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let manufacturingService = new ManufacturingService()


Template.new_process.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.processrecord = new ReactiveVar([]);
    templateObject.selectedAccount = new ReactiveVar('cogs');
});

Template.new_process.onRendered(() => {
    const templateObject = Template.instance();
    // $('#edtCOGS').editableSelect();
    // $('#edtExpenseAccount').editableSelect();
    // $('#edtOverheadCOGS').editableSelect();
    // $('#edtOverheadExpenseAccount').editableSelect();
    // $('#edtWastage').editableSelect();
    var currentID = FlowRouter.current().queryParams.id;
    templateObject.getProcessDetail  = function() {
        $('.fullScreenSpin').css('display', 'inline-block')
        // getVS1Data('TProcessStep').then()
        let objDetail = {}

        if(FlowRouter.current().queryParams.id) {
            let id=FlowRouter.current().queryParams.id
            getVS1Data('TProcessStep').then(function(dataObject){
                if(dataObject.length == 0) {
                    manufacturingService.getOneProcessDataByID(id).then(function(data){
                        objDetail = data.fields
                        templateObject.processrecord.set(objDetail);
                        $('.fullScreenSpin').css('display', 'none');
                    })
                }else {
                    let data = JSON.parse(dataObject[0].data)
                    let useData = data.tprocessstep;
                    let added = true
                    for(let i = 0; i< useData.length; i++) {
                        if(useData[i].fields.ID == id) {
                            added =  false
                           objDetail = useData[i].fields;
                           $('.fullScreenSpin').css('display', 'none');
                        }
                    }
                    if(added == true) {
                        manufacturingService.getOneProcessDataByID(id).then(function(data){
                            objDetail = data.fields
                            templateObject.processrecord.set(objDetail);
                            $('.fullScreenSpin').css('display', 'none');
                        })
                    }

                    templateObject.processrecord.set(objDetail);
                }
            }).catch(function(error) {
                manufacturingService.getOneProcessDataByID(id).then(function(data){
                    objDetail = data.fields;
                    templateObject.processrecord.set(objDetail);
                    $('.fullScreenSpin').css('display', 'none');
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal("Something went wrong!", "", "error");
                })
            })
        } else {
             objDetail = {
                        KeyValue: '',
                        DailyHours: '',
                        Description: '',
                        HourlyLabourCost: '$0.00',
                        COGS: 'Manufacturing Labour',
                        ExpenseAccount: 'Manufacturing Labour off Set',
                        OHourlyCost: '$0.00',
                        OCOGS: 'Manufacturing Labour OH',
                        OExpense: 'Manufacturing Labour Set OH',
                        TotalHourlyCost: '$0.00',
                        Wastage: 'Manufacturing Wastage'
                    }

                    templateObject.processrecord.set(objDetail);
                    $('.fullScreenSpin').css('display', 'none')
        }

    }

    
    templateObject.getProcessDetail();
    setTimeout(()=>{
            $('#edtCOGS').editableSelect();
            $('#edtExpenseAccount').editableSelect();
            $('#edtOverheadCOGS').editableSelect();
            $('#edtOverheadExpenseAccount').editableSelect();
            $('#edtWastage').editableSelect();
    },2000)
            // templateObject.selectedInventoryAssetAccount.set('Inventory Asset Wastage')

});



Template.new_process.helpers({
   processrecord: ()=>{
    return Template.instance().processrecord.get();
   }
});

Template.new_process.events({
    'click .btnSave': function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('.fullScreenSpin').css('display', 'inline-block');
        let currentID = FlowRouter.current().queryParams.id;
        // let tempArray = localStorage.getItem('TProcesses');
        // let processes = tempArray?JSON.parse(tempArray):[];
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
            type: 'TProcessStep',
            fields: {
                KeyValue: processName,
                Description: processDescription,
                DailyHours:  dailyHours,
                HourlyLabourCost: parseInt(hourlyCost.replace(Currency, '')),
                COGS: cogs,
                ExpenseAccount: expenseAccount,
                OHourlyCost: parseInt(overheadHourlyCost.replace(Currency, '')),
                OCogs: overheadCOGS,
                OExpense: overheadExpenseAcc,
                TotalHourlyCost: parseInt(totalHourCost.replace(Currency, '')),
                Wastage: wastage
            }
        }
        if(currentID) {
            objDetail.fields.ID = currentID
        }


        manufacturingService.saveProcessData(objDetail).then(function(){

            if (localStorage.getItem("enteredURL") != null) {
                FlowRouter.go(localStorage.getItem("enteredURL"));
                localStorage.removeItem("enteredURL");
                return;
            }

            manufacturingService.getAllProcessData(initialBaseDataLoad, 0, false).then(function(datareturn) {
                addVS1Data('TProcessStep', JSON.stringify(datareturn)).then(function(){
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
                }).catch(function(err){
                    swal('Ooops, Something went wrong', '', 'warning');
                    $('.fullScreenSpin').css('display', 'none');
                })
            })
        }).catch(function(err) {
            swal("Something went wrong!", "", "error");
            $('.fullScreenSpin').css('display', 'none');
        })

        // processes.push(objDetail);
        // localStorage.setItem('TProcesses', JSON.stringify(processes))
        // $('.fullScreenSpin').css('display', 'none');

    },

    'click .btnBack': function(event) {
        event.preventDefault();
        event.stopPropagation();
        FlowRouter.go('/processlist')
    },

    'click .btnRemove': async function(event) {
        event.preventDefault();
        event.stopPropagation();
        let templateObject = Template.instance()
        if(FlowRouter.current().queryParams.id) {
            let id = FlowRouter.current().queryParams.id;
           
            let fields = templateObject.processrecord.get();
            let objDetail = {
                type: 'TProcessStep',
                fields: {
                    ...fields,
                    Active: false
                }
            }
            manufacturingService.saveProcessData(objDetail).then(function() {
                FlowRouter.go('/processlist?success=true')
            }).catch(function(e) {
            })

        }
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

    'click #accountListModal table tbody tr': function(e) {
        let templateObject = Template.instance();
        let columnDataValue = $(e.target).closest('tr').find('.colAccountName').text();
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
    'click #expenseAccountListModal table tbody tr': function(e){
        let templateObject = Template.instance();
        let columnDataValue = $(e.target).closest('tr').find('.colAccountName').text();
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

    'click #assetAccountListModal table tbody tr': function(e) {
        let columnDataValue = $(e.target).closest('tr').find('.colAccountName').text();
        $('#edtWastage').val(columnDataValue);
        $('#assetAccountListModal').modal('toggle');
    },
    'blur .edtHourlyCost': function(e) {
        let costPrice = $('#edtHourlyCost').val();
        let cost = parseFloat(costPrice.replace(/[^0-9.-]+/g, "")) || 0;
        $("#edtHourlyCost").val(utilityService.modifynegativeCurrencyFormat(cost));
            // $('#edtTotalHourlyCosts').val($('#edtHourlyCost').val())
        if ($('#edtHourlyCost').val() != '' &&  $('#edtHourlyOverheadCost').val() != '') {
            costPrice = (parseFloat($('#edtHourlyCost').val().replace(/[^0-9.-]+/g, "")) || 0 ) + (parseFloat($('#edtHourlyOverheadCost').val().replace(/[^0-9.-]+/g, "")) || 0 )
            $('#edtTotalHourlyCosts').val(utilityService.modifynegativeCurrencyFormat(costPrice))
        }
    },

    'blur .edtHourlyOverheadCost': function(e) {
        let costPrice = $('#edtHourlyOverheadCost').val();
        let cost = parseFloat(costPrice.replace(/[^0-9.-]+/g, "")) || 0;
        $('#edtHourlyOverheadCost').val(utilityService.modifynegativeCurrencyFormat(cost))

        if ($('#edtHourlyCost').val() != '' &&  $('#edtHourlyOverheadCost').val() != '') {
            costPrice = (parseFloat($('#edtHourlyCost').val().replace(/[^0-9.-]+/g, "")) || 0 ) + (parseFloat($('#edtHourlyOverheadCost').val().replace(/[^0-9.-]+/g, "")) || 0 )
            $('#edtTotalHourlyCosts').val(utilityService.modifynegativeCurrencyFormat(costPrice))
            // $('#edtTotalHourlyCosts').val(Currency + (parseFloat($('#edtHourlyCost').val().replace('$', '')) + parseFloat($('#edtHourlyOverheadCost').val().replace('$', ''))).toFixed(2))
        }
    },

    'blur #edtHourlyCost': function(e){
        e.preventDefault();
        e.stopPropagation();
        // $('#edtHourlyCost').val(Currency +parseFloat( $('#edtHourlyCost').val()).toFixed(2))
    },

    'focus #edtHourlyCost': function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#edtHourlyCost').val($('#edtHourlyCost').val().replace('$', ''));
    },

    'blur #edtHourlyOverheadCost': function(e){
        e.preventDefault();
        e.stopPropagation();
        // $('#edtHourlyOverheadCost').val(Currency +parseFloat( $('#edtHourlyOverheadCost').val()).toFixed(2))
    },

    'focus #edtHourlyOverheadCost': function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#edtHourlyOverheadCost').val($('#edtHourlyOverheadCost').val().replace('$', ''));
    },
    // 'click #edtCOGS': function (e) {

    // }
});
