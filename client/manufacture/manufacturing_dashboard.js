// import { ReactiveVar } from 'meteor/reactive-var';
// import { ProductService } from '../product/product-service';
// import { UtilityService } from '../utility-service';
// import { Calendar, formatDate } from "@fullcalendar/core";
// import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
// import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import listPlugin from "@fullcalendar/list";
// import bootstrapPlugin from "@fullcalendar/bootstrap";
// import { ManufacturingService } from '../manufacture/manufacturing-service';
// import commonStyles from '@fullcalendar/common/main.css';
// import dayGridStyles from '@fullcalendar/daygrid/main.css';
// import timelineStyles from '@fullcalendar/timeline/main.css';
// import resourceTimelineStyles from '@fullcalendar/resource-timeline/main.css';
// import 'jQuery.print/jQuery.print.js';
// import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './manufacturing_dashboard.html';
import './production_planner_template/planner_template';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// import { cloneDeep } from 'lodash';

Template.manufacturingoverview.onCreated(function(){

})

Template.manufacturingoverview.onRendered(function(){
    $('.production_planner_chart .charts .draggable-panel').css('display', 'block !important')
    const currentDate = new Date();
    let fromDate = moment().subtract(2, 'month').format('DD/MM/YYYY');
    let toDate = moment(currentDate).format("DD/MM/YYYY");

    setTimeout(function() {
        $("#date-input,#dateTo,#dateFrom").datepicker({
            showOn: "button",
            buttonText: "Show Date",
            buttonImageOnly: true,
            buttonImage: "/img/imgCal2.png",
            dateFormat: "dd/mm/yy",
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+10",
            onChangeMonthYear: function(year, month, inst) {
                // Set date to picker
                $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
                // Hide (close) the picker
                // $(this).datepicker('hide');
                // // Change ttrigger the on change function
                // $(this).trigger('change');
            }
        });
        let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
        let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
        let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
        if (urlParametersDateFrom) {
            if (urlParametersIgnoreDate == true) {
                $("#dateFrom").attr("readonly", true);
                $("#dateTo").attr("readonly", true);
            } else {
                let paramFromDate = urlParametersDateFrom != "" ? new Date(urlParametersDateFrom) : urlParametersDateFrom;
                paramFromDate = moment(paramFromDate).format("DD/MM/YYYY");
                $("#dateFrom").val(paramFromDate);
                let paramToDate = urlParametersDateTo != "" ? new Date(urlParametersDateTo) : urlParametersDateTo;
                paramToDate = moment(paramToDate).format("DD/MM/YYYY");
                $("#dateTo").val(paramToDate);
            }
        } else {
            $("#dateFrom").val(fromDate);
            $("#dateTo").val(toDate);
        }
        if (urlParametersIgnoreDate == "true") {
            $("#dateFrom").val(null);
            $("#dateTo").val(null);
        }
        $('[data-toggle="tooltip"]').tooltip({ html: true });
    }, 500);
})

Template.manufacturingoverview.events({
    'click .productionplannercard': function(e) {
        FlowRouter.go('/productionplanner')
    },

    'click #tblWorkorderList tbody tr': function(event) {
        let workorderid = $(event.target).closest('tr').find('.colID').text();
        FlowRouter.go('/workordercard?id='+workorderid)
    }

})

Template.manufacturingoverview.helpers({})