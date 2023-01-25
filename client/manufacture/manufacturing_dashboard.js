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
})

Template.manufacturingoverview.events({
    'click .productionplannercard': function(e) {
        FlowRouter.go('/productionplanner')
    }
})

Template.manufacturingoverview.helpers({})