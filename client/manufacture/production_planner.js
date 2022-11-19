import { ReactiveVar } from 'meteor/reactive-var';
import { ProductService } from '../product/product-service';
import { UtilityService } from '../utility-service';
import { Calendar, formatDate } from "@fullcalendar/core";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { ManufacturingService } from '../manufacture/manufacturing-service';
import commonStyles from '@fullcalendar/common/main.css';
import dayGridStyles from '@fullcalendar/daygrid/main.css';
import timelineStyles from '@fullcalendar/timeline/main.css';
import resourceTimelineStyles from '@fullcalendar/resource-timeline/main.css';
import 'jQuery.print/jQuery.print.js';


Template.production_planner.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.resources = new ReactiveVar([]);
    templateObject.events = new ReactiveVar([]);
    templateObject.viewMode = new ReactiveVar();
    templateObject.headerGroup = new ReactiveVar();
    templateObject.viewInfoData = new ReactiveVar();
    templateObject.calendar = new ReactiveVar();
    templateObject.calendarOptions = new ReactiveVar();
    templateObject.startDate = new ReactiveVar();
})
let manufacturingService = new ManufacturingService();
Template.production_planner.onRendered(async function() {
    const templateObject = Template.instance();



    async function getResources() {
        return new Promise(async(resolve, reject) => {
            getVS1Data('TProcessStep').then(function(dataObject) {
                if (dataObject.length == 0) {
                    manufacturingService.getAllProcessData().then(function(data) {
                        addVS1Data('TProcessStep', JSON.stringify(data))
                        let useData = data.tprocessstep;
                        let temp = []
                        for (let i = 0; i < useData.length; i++) {
                            temp.push({
                                id: i,
                                title: useData[i].fields.KeyValue,
                            })
                        }
                        resolve(temp)
                    })
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tprocessstep;
                    let temp = [];
                    for (let i = 0; i < useData.length; i++) {
                        temp.push({
                            id: i,
                            title: useData[i].fields.KeyValue,
                        })
                    }
                    resolve(temp)
                }
            }).catch(function(err) {
                addVS1Data('TProcessStep', JSON.stringify(data))
                let useData = data.tprocessstep;
                let temp = []
                for (let i = 0; i < useData.length; i++) {
                    temp.push({
                        id: i,
                        title: useData[i].fields.KeyValue,
                    })
                }
                resolve(temp)
            })
        })
    }
    let resources = await getResources();
    await templateObject.resources.set(resources);
    let workorders = localStorage.getItem('TWorkorders') ? JSON.parse(localStorage.getItem('TWorkorders')) : []
        // templateObject.workorders.set(workorders);
    async function getEvents() {
        return new Promise(async function(resolve, reject) {
            let events = [];
            let eventsData = localStorage.getItem('TProductionPlan') ? JSON.parse(localStorage.getItem('TProductionPlan')) : [];
            if (eventsData.length == 0) {

                let events = [];
                for (let i = 0; i < workorders.length; i++) {
                    let processName = workorders[i].BOM.process;
                    let productName = workorders[i].BOM.productName;
                    let startTime = new Date(workorders[i].StartTime);
                    let duration = workorders[i].BOM.duration;
                    if (workorders[i].Quantity) duration = duration * parseFloat(workorders[i].Quantity);
                    let endTime = new Date();
                    endTime.setTime(startTime.getTime() + duration * 3600000)
                    let index = resources.findIndex(resource => {
                        return resource.title == processName;
                    })
                    let resourceId = resources[index].id;
                    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
                    let event = {
                        "resourceId": resourceId,
                        "resourceName": resources[index].title,
                        "title": productName,
                        "start": startTime,
                        "end": endTime,
                        "color": "#" + randomColor,
                    }
                    events.push(event);
                }
                templateObject.events.set(events)
                resolve(events);
            } else {
                events = eventsData;
                templateObject.events.set(events)
                resolve(events)
            }
        })
    }

    let events = await getEvents();
  
    let dayIndex = new Date().getDay();
    templateObject.startDate.set(dayIndex);
    let calendarEl = document.getElementById('calendar');

    let calendarOptions = {
        plugins: [
            resourceTimelinePlugin,
            interactionPlugin,
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            bootstrapPlugin
        ],
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        timeZone: 'local',
        initialView: 'resourceTimelineWeek',
        firstDay: dayIndex,
        resourceAreaWidth: "15%",
        aspectRatio: 1.5,
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
        },
        contentHeight: resources.length * 40 + 80,
        editable: true,
        resourceAreaHeaderContent: 'Resources',
        resources: await getResources(),
        events: templateObject.events.get().length == 0 ? events : templateObject.events.get(),
        eventOverlap: true,
        eventResourceEditable: false,
        businessHours: [{
            daysOfWeek: [1, 2, 3, 4],
            startTime: '10:00',
            endTime: '18:00'
        }, {
            daysOfWeek: [5],
            startTime: '10:00',
            endTime: '14:00'
        }],
        // eventDrop: function(info) {
        //     let totalEvents = templateObject.events.get();
        //     let cloneEvents = JSON.parse(JSON.stringify(totalEvents));
        //     let updatedStart = info.event.start;
        //     let updatedEnd = info.event.end;
        //     let color = info.event.color;
        //     let title = info.event.title;
            
        //     let currentIndex = cloneEvents.findIndex(event => {
        //         return event.title == title
        //     })
        //     let currentEvent = cloneEvents[currentIndex];
        //     currentEvent.start = updatedStart;
        //     currentEvent.end = updatedEnd
        //     cloneEvents[currentIndex] = currentEvent;
        //     templateObject.events.set(cloneEvents)
          
    
        // },
        eventResizeStop: function(info) {
            let totalEvents = templateObject.events.get();
            let cloneEvents = JSON.parse(JSON.stringify(totalEvents));
            let updatedStart = info.event.start;
            let updatedEnd = info.event.end;
            let color = info.event.color;
            let title = info.event.title;

            let currentIndex = cloneEvents.findIndex(event => {
                return event.title == title
            })
            let currentEvent = cloneEvents[currentIndex];
            currentEvent.start = updatedStart;
            currentEvent.end = updatedEnd
            cloneEvents[currentIndex] = currentEvent;
            templateObject.events.set(cloneEvents)
        },
        eventDrop: function(info) {
            let resourceId = info.event._def.resourceIds[0]


            let newStart = info.event.start;
            let newEnd = info.event.end;
            let events = templateObject.events.get();
            let tempEvents = JSON.parse(JSON.stringify(events));
            tempEvents = tempEvents.filter(event =>
                // event.resourceId == resourceId
                event.resourceId == resourceId && event.title != info.event.title
            )


            tempEvents.sort((a, b)=>{
                new Date(a.start) - new Date(b.start)
            })


            let targetEvent = tempEvents[0]
            if(targetEvent) {
                let moveDistance =  newEnd.getTime() - new Date(targetEvent.start).getTime();
                tempEvents = tempEvents.filter(event => new Date(event.start).getTime() < newEnd.getTime() && newStart.getTime() < new Date(event.start).getTime()  );
                for (let i = 0; i < tempEvents.length; i++) {
                    let index = events.findIndex(event => {
                        return event.resourceId == resourceId && event.title == tempEvents[i].title;
                    })
                    if(index > -1) {
                        events[index].start = new Date((new Date(tempEvents[i].start).getTime() + moveDistance));
                        events[index].end = new Date((new Date(tempEvents[i].end).getTime() + moveDistance));
                    }
                }
                let targetIndex = events.findIndex(event => {
                    return event.resourceId == resourceId && event.title == info.event.title;
                })
                events[targetIndex].start = newStart;
                events[targetIndex].end = newEnd;
                templateObject.events.set(events);
                if(calendar) {
                    calendar.destroy();
                    let dayIndex = newStart.getDay();
                    calendar = new Calendar(calendarEl, {
                        ...calendarOptions,
                        events: events,
                        firstDay: dayIndex
                    })
                    calendar.render();
                }
            }

            // calendar.render()
            // window.location.reload();
        },
        eventClick: function(info) {
                let title = info.event.title;
                let orderIndex = workorders.findIndex(order => {
                    return order.BOM.productName == title;
                })
                let percentage = 0;
                if (new Date().getTime() > (new Date(info.event.start)).getTime() && new Date().getTime() < (new Date(info.event.end)).getTime()) {
                    let overallTime = (new Date(info.event.end)).getTime() - (new Date(info.event.start)).getTime();
                    let processedTime = new Date().getTime() - (new Date(info.event.start)).getTime();
                    percentage = (processedTime / overallTime) * 100;
                }
                let object = {
                    SONumber: workorders[orderIndex].SalesOrderID,
                    Customer: workorders[orderIndex].Customer,
                    OrderDate: workorders[orderIndex].OrderDate,
                    ShipDate: workorders[orderIndex].Line.fields.ShipDate,
                    JobNotes: workorders[orderIndex].BOM.processNote || '',
                    Percentage: percentage + '%',
                }
                templateObject.viewInfoData.set(object);
            }
            // expandRows: true,
            // events: [{"resourceId":"1","title":"event 1","start":"2022-11-14","end":"2022-11-16"},{"resourceId":"2","title":"event 3","start":"2022-11-15T12:00:00+00:00","end":"2022-11-16T06:00:00+00:00"},{"resourceId":"0","title":"event 4","start":"2022-11-15T07:30:00+00:00","end":"2022-11-15T09:30:00+00:00"},{"resourceId":"2","title":"event 5","start":"2022-11-15T10:00:00+00:00","end":"2022-11-15T15:00:00+00:00"},{"resourceId":"1","title":"event 2","start":"2022-11-15T09:00:00+00:00","end":"2022-11-15T14:00:00+00:00"}]

    }
    templateObject.calendarOptions.set(calendarOptions)
    let calendar = new Calendar(calendarEl, calendarOptions);
    templateObject.calendar.set(calendar);
      calendar.render();
   
})

Template.production_planner.events({
    'click .btnApply': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block')
        let templateObject = Template.instance();
        let events = templateObject.events.get();
        localStorage.setItem('TProductionPlan', JSON.stringify(events));
        $('.fullScreenSpin').css('display', 'none');
        swal({
            title: 'Success',
            text: 'Production planner has been saved successfully',
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Continue',
        }).then((result) => {
            window.location.reload();
        });
    },

    'click .btn-print-event': function(event) {
        document.title = 'Product BOM Setup';
        $(".eventInfo .eventDetail").print({
            // title   :  document.title +" | Product Sales Report | "+loggedCompany,
            // noPrintSelector : ".btnAddProduct",
            // noPrintSelector : ".btnAddSubProduct",
            // noPrintSelector : ".btn-remove-raw",
            // noPrintSelector : ".btnAddAttachment",
        });
    },

    'click .btn-optimize': function(event) {
        let templateObject = Template.instance();
        let resources = templateObject.resources.get();
        let events = templateObject.events.get();
        let cloneEvents = JSON.parse(JSON.stringify(events))
        for(let i = 0; i< resources.length; i++) {
            let resourceId = resources[i].id;
            let filteredEvents = cloneEvents.filter(event=>
                event.resourceId == resourceId
            )
            filteredEvents.sort((a, b) => {
                return new Date(a.start) - new Date(b.start);
            }); 


            for (let j = 1; j<filteredEvents.length; j++) {
                async function updateEvent() {
                    return new Promise(async(resolve, reject) => {
                        let eventDuration = new Date(filteredEvents[j].end).getTime() - new Date(filteredEvents[j].start).getTime();
                        let index = cloneEvents.findIndex(event => {
                            return event.resourceId == filteredEvents[j].resourceId && event.title == filteredEvents[j].title;
                        })
                        cloneEvents[index].start =  new Date(filteredEvents[j-1].end);
                        let endTime = new Date()
                        endTime.setTime(new Date(filteredEvents[j - 1].end).getTime() + eventDuration)
                        cloneEvents[index].end = endTime;
                        resolve()
                    })
                }
                updateEvent()
            }
        }
        templateObject.events.set(cloneEvents);
        if(templateObject.calendar.get() != null) {
            let calendar = templateObject.calendar.get();
            calendar.destroy();
            let dayIndex = new Date(events[0].start).getDay();
            let calendarOptions = templateObject.calendarOptions.get();
            let calendarEl= document.getElementById('calendar');
            let newCalendar = new Calendar(calendarEl, {...calendarOptions, events: cloneEvents, firstDay: dayIndex})
            newCalendar.render();
            templateObject.calendar.set(newCalendar)
        }

    }
})

Template.production_planner.helpers({
    viewInfoData: () => {
        return Template.instance().viewInfoData.get();
    }
})
