import "../../lib/global/indexdbstorage.js";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import "./manufacturingsettings.html";
import _ from "lodash";
import { EditableService } from "../../editable-service";

Template.manufacturingsettings.onCreated(function(){
    let templateObject = Template.instance();
    
    templateObject.initialRecords = new ReactiveVar();
})

Template.manufacturingsettings.onRendered(async function() {
    let templateObject = Template.instance();
    templateObject.getSettings = async function() {
        return new Promise((resolve, reject)=>{
            
            getVS1Data('ManufacturingSettings').then(function(dataObject) {
                if(dataObject.length == 0) {
                    let records = {
                        showSaturday: true,
                        showSunday: true,
                        showQA: true,
                        startTime: '08:00',
                        endTime: '17:00',
                        showTimein: '1'
                    }
                    templateObject.initialRecords.set(records);
                    $('.edtShowTimein').val(records.showTimein);
                    resolve()
                } else {
                    let records = JSON.parse(dataObject[0].data).fields;
                    templateObject.initialRecords.set(records);
                    let showTimein = records.showTimein;
                    $('.edtShowTimein').val(showTimein);
                    resolve()
                }
            }).catch(function(error) {
                let records = {
                    showSaturday: true,
                    showSunday: true,
                    showQA: true,
                    startTime: '08:00',
                    endTime: '17:00',
                    showTimein: '1'
                }
                templateObject.initialRecords.set(records)
                let showTimein = records.showTimein;
                    $('.edtShowTimein').val(showTimein);
                resolve()
            })
        })
    }
    await templateObject.getSettings()
})

Template.manufacturingsettings.helpers({
    initialRecords:()=>{
        return Template.instance().initialRecords.get();
    },
})

Template.manufacturingsettings.events({
    

    'click .btnSaveSettings': function(event) {
        event.preventDefault();
        event.stopPropagation();
        let templateObject = Template.instance();
        let showSaturday = $('.toggleShowSat').is(':checked');
        let showSunday = $('.toggleShowSun').is(':checked');
        let showQA = $('.toggleShowQA').is(':checked');
        let startTime = $('#hoursFrom').val();
        let endTime = $('#hoursTo').val();
        let showTimein = $('.edtShowTimein').val();
        let objectDetail = {
            type: 'ManufacturingSettings',
            fields: {
                showSaturday: showSaturday,
                showSunday: showSunday,
                showQA: showQA,
                startTime: startTime,
                endTime: endTime,
                showTimein: showTimein
            }
        }
        addVS1Data('ManufacturingSettings', JSON.stringify(objectDetail)).then(function(){
            getVS1Data('ManufacturingSettings').then(function(dataNew){
                swal({
                    title: 'Success',
                    text: 'Settings has been saved successfully',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Continue',
                }).then((result) => {
                    
                });
            })
        })
    },

    'click .btnResetSettings': function(event) {
        event.preventDefault()
        event.stopPropagation();
        let templateObject = Template.instance();
        let records = templateObject.initialRecords.get();
        $('.toggleShowSat').prop('checked', records.showSaturday);
        $('.toggleShowSun').prop('checked', records.showSunday);
        $('.toggleShowQA').prop('checked', records.showQA);
        $('#hoursFrom').val(records.startTime)
        $('#hoursTo').val(records.endTime)
        $('.edtShowTimein').val(records.showTimein);
    },

    'click .btnCancelSettings': function(event) {
        event.preventDefault();
        event.stopPropagation();
        FlowRouter.go('/settings')
    }

})