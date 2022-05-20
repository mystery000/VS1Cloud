import {ReactiveVar} from 'meteor/reactive-var';

Template.setup.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.stepNumber = new ReactiveVar(0);
});

Template.setup.onRendered(function () {
});

Template.setup.events({
    'click #start-wizard': function() {
        $('.first-page').css('display', 'none');
        $('.main-setup').css('display', 'flex');
    },
    'click .confirmBtn': function(event) {
        let stepId = $(event.target).attr('data-step-id');
        stepId = parseInt(stepId) + 1;
        $('.setup-step').css('display', 'none');
        $(`.setup-stepper li:nth-child(${stepId})`).addClass('current');
        if (stepId !== 9) {
            $('.setup-step-' + stepId).css('display', 'block');
        } else {
            $('.setup-complete').css('display', 'block');
        }
    },
    'click .btnBack': function(event) {
        let stepId = $(event.target).attr('data-step-id');
        stepId = parseInt(stepId) + 1;
        $('.setup-step').css('display', 'none');
        $(`.setup-stepper li:nth-child(${stepId})`).addClass('current');
        if (stepId !== 9) {
            $('.setup-step-' + stepId).css('display', 'block');
        } else {
            $('.setup-complete').css('display', 'flex');
        }
    },
    'click #launchBtn': function() {
        window.location.href = "/";
    }
});
