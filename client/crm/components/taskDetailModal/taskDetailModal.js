import { CRMService } from '../../crm-service';
let crmService = new CRMService();

Template.taskDetailModal.onCreated(function() {});

Template.taskDetailModal.onRendered(function() {
    $("#taskmodalDuedate").datepicker({
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
});

Template.taskDetailModal.events({

});

Template.taskDetailModal.helpers({});