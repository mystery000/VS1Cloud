import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
//Calendar
import '../../lib/global/indexdbstorage.js';

import { Template } from 'meteor/templating';
import './ds-appointments-widget.html';
import '../../vs1_templates/calender/calender.html';

Template.dsAppointmentsWidget.onCreated(function() {
    const templateObject = Template.instance();
});

Template.dsAppointmentsWidget.onRendered(function() {
    $(document).ready(function() {
        $('#customer').editableSelect();
        $('#product-list').editableSelect();
    });
});

Template.dsAppointmentsWidget.events({
});

Template.dsAppointmentsWidget.helpers({
})
