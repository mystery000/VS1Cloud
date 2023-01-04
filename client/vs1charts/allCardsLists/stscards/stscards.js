import { ReactiveVar } from 'meteor/reactive-var';

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './stscards.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.seedtosalecards.onCreated(function() {
    const templateObject = Template.instance();
});

Template.seedtosalecards.onRendered(function() {
    let templateObject = Template.instance();
});

Template.seedtosalecards.helpers({

});
