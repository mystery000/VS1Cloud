import { ReactiveVar } from 'meteor/reactive-var';

Template.seedtosalecards.onCreated(function() {
    const templateObject = Template.instance();
});

Template.seedtosalecards.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
});

Template.seedtosalecards.helpers({

});
