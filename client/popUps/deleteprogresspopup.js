import { Template } from 'meteor/templating';

import './deleteprogresspopup.html';

Template.deleteprogresspopup.onCreated(function () {
  const templateObject = Template.instance();
});
Template.deleteprogresspopup.onRendered(function () {
    $('.headerprogressbar').addClass('headerprogressbarShow');
    $('.headerprogressbar').removeClass('headerprogressbarHidden');
});

Template.deleteprogresspopup.helpers({
});
