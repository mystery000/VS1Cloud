import 'jquery-ui-dist/external/jquery/jquery';
//Calendar
import '../../lib/global/indexdbstorage.js';

import { Template } from 'meteor/templating';
import './dsm-appointments-widget.html';
import '../../vs1_templates/calender/calender.html';

Template.dsmAppointmentsWidget.onCreated(function() {
    const templateObject = Template.instance();
});

Template.dsmAppointmentsWidget.onRendered(function() {
    $(document).ready(function() {
        $('#customer').editableSelect();
        $('#product-list').editableSelect();
    });
});

Template.dsmAppointmentsWidget.events({
});

Template.dsmAppointmentsWidget.helpers({
});

