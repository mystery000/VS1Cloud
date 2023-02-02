import { ReactiveVar } from 'meteor/reactive-var';
import { ProductService } from '../../product/product-service';
import { UtilityService } from '../../utility-service';
import { Calendar, formatDate } from "@fullcalendar/core";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { ManufacturingService } from '../manufacturing-service';
import commonStyles from '@fullcalendar/common/main.css';
import dayGridStyles from '@fullcalendar/daygrid/main.css';
import timelineStyles from '@fullcalendar/timeline/main.css';
import resourceTimelineStyles from '@fullcalendar/resource-timeline/main.css';
import 'jQuery.print/jQuery.print.js';
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './planner_template.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { cloneDeep } from 'lodash';

let manufacturingService = new ManufacturingService();
Template.production_planner_template.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.resources = new ReactiveVar([]);
    templateObject.events = new ReactiveVar([]);
    templateObject.viewMode = new ReactiveVar();
    templateObject.headerGroup = new ReactiveVar();
    templateObject.viewInfoData = new ReactiveVar();
    templateObject.calendar = new ReactiveVar();
    templateObject.calendarOptions = new ReactiveVar();
    templateObject.startDate = new ReactiveVar();
    templateObject.selectedEventSalesorderId = new ReactiveVar(-1);
})



Template.production_planner_template.onRendered(async function() {
    const templateObject = Template.instance();

    async function getResources() {
        return new Promise(async(resolve, reject) => {
            getVS1Data('TProcessStep').then(function(dataObject) {
                if (dataObject.length == 0) {
                    manufacturingService.getAllProcessData(initialBaseDataLoad, 0).then(function(data) {
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

    templateObject.getWorkorders = function() {
        return new Promise(async(resolve, reject)=>{
            getVS1Data('TVS1Workorder').then(function(dataObject){
                if(dataObject.length == 0) {
                    resolve([])
                }else {
                    let data = JSON.parse(dataObject[0].data);
                    resolve(data.tvs1workorder)
                }
            })
        })
    }
    
    let workorders = await templateObject.getWorkorders();
        // templateObject.workorders.set(workorders);
    async function getPlanData() {
        return new Promise(async(resolve, reject)=> {
            let returnVal = [];
            getVS1Data('TProductionPlanData').then(function(dataObject) {
                if(dataObject.length == 0) {
                    resolve(returnVal)
                } else {
                    returnVal = JSON.parse(dataObject[0].data)
                    if(returnVal == undefined) {
                        resolve([])
                    }
                    resolve(returnVal.tproductionplandata)
                }
            }).catch(function(e) {
                returnVal = [];
                resolve(returnVal)
            })
        })
    }

    function getRandomColor () {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        if (randomColor.length == 5) {
            randomColor = "0"+randomColor;
        }
        return randomColor;
    }
    async function getEvents() {
        return new Promise(async function(resolve, reject) {
            // let events = [];
            let planData = await getPlanData();
            
            let eventsData = planData;
            // if (eventsData.length == 0) {

                let tempEvents = [];
                if(workorders && workorders.length > 0) {
                    for (let i = 0; i < workorders.length; i++) {
                        let processName = JSON.parse(workorders[i].fields.BOMStructure).Info;
                        let productName = workorders[i].fields.ProductName;
                        let index = resources.findIndex(resource => {
                            return resource.title == processName;
                        })
                        let resourceId = resources[index].id;
                        let startTime = new Date(workorders[i].fields.OrderDate);
                        let filteredEvents = tempEvents.filter(itemEvent => itemEvent.resourceName == processName && new Date(itemEvent.end).getTime() > startTime.getTime() && new Date(itemEvent.start).getTime() < startTime.getTime())
                        if(filteredEvents.length > 1) {
                            filteredEvents.sort((a,b)=> a.end.getTime() - b.end.getTime())
                            startTime = filteredEvents[filteredEvents.length -1].end;
                        }else if(filteredEvents.length == 1) {
                            startTime = filteredEvents[0].end;
                        }
                        let duration = JSON.parse(workorders[i].fields.BOMStructure).QtyVariation;
                        let quantity = workorders[i].fields.Quantity;
                        let buildSubs = [];
                        let stockRaws = [];
                        let subs = JSON.parse(JSON.parse(workorders[i].fields.BOMStructure).Details);
                        if(subs.length > 1) {
                            for(let j = 0; j < subs.length; j++ ) {
                                if(subs[j].isBuild == true) {
                                    buildSubs.push(subs[j].productName)
                                }else {
                                    stockRaws.push(subs[j].productName)
                                }
                            }
                        }
                        if (workorders[i].fields.Quantity) duration = duration * parseFloat(workorders[i].fields.Quantity);
                        let endTime = new Date();
                        endTime.setTime(startTime.getTime() + duration * 3600000)
                        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
                        let event = {
                            "resourceId": resourceId,
                            "resourceName": resources[index].title,
                            "title": productName,
                            "start": startTime,
                            "end": endTime,
                            "color": "#" + randomColor,
                            "extendedProps": {
                                "orderId": workorders[i].fields.ID,
                                'quantity': quantity,
                                "builds": buildSubs,
                                "fromStocks": stockRaws,
                                "completed":workorders[i].fields.IsCompleted || false,
                                "status": workorders[i].fields.Status
                            }
                        }
                        tempEvents.push(event);
                    }
                }
                templateObject.events.set(tempEvents)
                resolve(tempEvents);
            // }
            //  else {
            //     // events = eventsData;
            //     templateObject.events.set(eventsData)
            //     resolve(eventsData)
            // }
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
        contentHeight: resources.length * 60 + 80,
        editable: true,
        resourceAreaHeaderContent: 'Resources',
        resources: await getResources(),
        events: templateObject.events.get().length == 0 ? events : templateObject.events.get(),
        eventOverlap: true,
        eventResourceEditable: false,
        eventClassNames: function(arg) {
            if (arg.event.extendedProps.orderId.toString().split('_')[0] == templateObject.selectedEventSalesorderId.get()) {
                return [ 'highlighted' ]
              } else {
                return [ 'normal' ]
              }
        },
        eventContent:  function (arg) {
            var event = arg.event;

            async function getCurrentStockCount () {
                return new Promise(async(resolve, reject) => {
                    getVS1Data('TProductVS1').then(function(dataObject){
                        if(dataObject.length == 0) {

                        }else {
                            let aaa;
                            resolve(aaa)
                        }
                    })
                })
            }
            function checkQtyAvailable() {
                let productName = event.title;
                // let currentStockCount = await getCurrentStockCount();
                let events = templateObject.events.get();
                let buildSubs = event.extendedProps.builds;
                let retResult = true;
                for(let i = 0; i < buildSubs.length ;  i++) {
                    let subEvents = events.filter(e=>e.title == buildSubs[i] && new Date(e.start).getTime() <= new Date(event.start).getTime());
                    // let subEvents = events.filter(e=>e.title == buildSubs[i] && e.start <= event.start && new Date(e.end).getTime() > new Date().getTime());
                    let subQuantity = 0; 
                    let needQty = 0;
                 
                    function getSeconds(time) {
                        let mSeconds = new Date(time).getTime();
                        let seconds = Math.floor(mSeconds / 1000);
                        return seconds
                    }
                    let filteredMainEvents = events.filter(e => getSeconds(e.start) <= getSeconds(event.start) && getSeconds(e.end) > getSeconds(new Date()) && e.extendedProps.builds.includes(buildSubs[i]))
                    for (let k = 0; k< filteredMainEvents.length; k++) {
                        let filteredOrder = workorders.findIndex(order => {
                            return order.fields.ID == filteredMainEvents[k].extendedProps.orderId
                        })
                        if(filteredOrder > -1) {
                            let bom = JSON.parse(JSON.parse(workorders[filteredOrder].fields.BOMStructure).Details);
                            let index = bom.findIndex(item=>{
                                return item.productName == buildSubs[i];
                            })
                            if(index>-1) {
                                needQty += bom[index].qty *  filteredMainEvents[k].extendedProps.quantity
                            }
                        }

                    }
                    for(let j = 0; j< subEvents.length; j++) {
                        if(getSeconds(subEvents[j].end) <= getSeconds(event.start)) {
                            subQuantity += subEvents[j].extendedProps.quantity
                        }
                       
                    }

                    if(needQty > subQuantity) {
                        retResult = false
                    }
                }

                return retResult;
            }

            let available = checkQtyAvailable();
            var customHtml = '';
            
            if(available == true) {
                customHtml += "<div class='w-100 h-100 d-flex align-items-start justify-content-center process-event' style='color: black'>" + event.title + "</div>"
            }else {

                customHtml += "<div class='w-100 h-100 unable-process d-flex align-items-start justify-content-center process-event' style='color: black'>" + event.title + "</div>";
            }


            let sTime = event.start;
            let eTime = event.end;
            let current = new Date();
            if(available == true) {
                if(current.getTime() > sTime.getTime() && current.getTime() < eTime.getTime()) {
                    let totalDuration = eTime.getTime() - sTime.getTime();
                    let progressed = current.getTime() - sTime.getTime();
                    let percent = Math.round((progressed / totalDuration) * 100);
                    if(event.extendedProps.completed == false) {
                        customHtml = "<div class='w-100 h-100 current-progress process-event' style='color: black'>" + event.title + "<div class='progress-percentage' style='width:"+percent+"%'>" + percent + "%</div></div>"
                    } else {
                        customHtml = "<div class='w-100 h-100 current-progress process-event' style='color: black'>" + event.title + "<div class='progress-percentage' style='width:100%'>Completed</div></div>"
                    }
                } 
            }
            
            // customHtml += "<span class='r10 highlighted-badge font-xxs font-bold'>" + event.extendedProps.age + text + "</span>";

            return { html: customHtml }
        },
        eventDidMount : function(arg) {
            let event = arg.event;
            arg.el.addEventListener('dblclick', (e)=>{
                e.preventDefault();
                e.stopPropagation();
                let id = event.extendedProps.orderId;
                FlowRouter.go('/workordercard?id=' + id)
            })

            arg.el.addEventListener("contextmenu", (e)=> {
                e.preventDefault()
            })
            let sTime = event.start
            let current = new Date().getTime()
            if(current>sTime.getTime())   {
                let unableProcesses = arg.el.getElementsByClassName('unable-process');
                if(unableProcesses.length == 0) {
                    arg.el.classList.remove('fc-event-resizable');
                    // arg.el.classList.remove('fc-event-draggable');
                }
            }
            
            
        },
        businessHours: [{
            daysOfWeek: [1, 2, 3, 4],
            startTime: '10:00',
            endTime: '18:00'
        }, {
            daysOfWeek: [5],
            startTime: '10:00',
            endTime: '14:00'
        }],
       
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
                return new Date(a.start) - new Date(b.start)
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
                    })
                    calendar.render();
                }
            }else {
                let targetIndex = events.findIndex(event => {
                    return event.resourceId == resourceId && event.title == info.event.title;
                })
                events[targetIndex].start = newStart;
                events[targetIndex].end = newEnd;
                templateObject.events.set(events);
                calendar.destroy();
                calendar = new Calendar(calendarEl, {
                    ...calendarOptions,
                    events: events
                })
                calendar.render()
            }

            // calendar.render()
            // window.location.reload();
        },
        eventClick: function(info) {
            setTimeout(()=>{
                let title = info.event.title;
                let orderIndex = workorders.findIndex(order => {
                    return order.fields.ProductName == title;
                })
                let percentage = 0;
                if(info.event.extendedProps.status != 'unscheduled') {
                    if (new Date().getTime() > (new Date(info.event.start)).getTime() && new Date().getTime() < (new Date(info.event.end)).getTime()) {
                        let overallTime = (new Date(info.event.end)).getTime() - (new Date(info.event.start)).getTime();
                        let processedTime = new Date().getTime() - (new Date(info.event.start)).getTime();
                        percentage = ((processedTime / overallTime) * 100).toFixed(2);
                    }
                }
                let object = {
                    JOBNumber: workorders[orderIndex].fields.ID,
                    Customer: workorders[orderIndex].fields.Customer,
                    OrderDate: new Date(workorders[orderIndex].fields.OrderDate).toLocaleDateString(),
                    ShipDate: workorders[orderIndex].fields.ShipDate,
                    JobNotes: JSON.parse(workorders[orderIndex].fields.BOMStructure).CustomInputClass || '',
                    Percentage: percentage + '%',
                    Status: workorders[orderIndex].fields.Status
                }
                templateObject.viewInfoData.set(object);
                $('.eventInfo').css('display', 'flex')
                let orderId = info.event.extendedProps.orderId;
                let salesorderId = orderId.toString().split('000')[0];
                templateObject.selectedEventSalesorderId.set(salesorderId);
                let dayIndex = info.event.start.getDay();
                calendar.destroy();
                calendar = new Calendar(calendarEl, {
                    ...calendarOptions,
                    firstDay: dayIndex,
                    events: templateObject.events.get()
                })
                calendar.render();
            }, 300)
        }
            // expandRows: true,
            // events: [{"resourceId":"1","title":"event 1","start":"2022-11-14","end":"2022-11-16"},{"resourceId":"2","title":"event 3","start":"2022-11-15T12:00:00+00:00","end":"2022-11-16T06:00:00+00:00"},{"resourceId":"0","title":"event 4","start":"2022-11-15T07:30:00+00:00","end":"2022-11-15T09:30:00+00:00"},{"resourceId":"2","title":"event 5","start":"2022-11-15T10:00:00+00:00","end":"2022-11-15T15:00:00+00:00"},{"resourceId":"1","title":"event 2","start":"2022-11-15T09:00:00+00:00","end":"2022-11-15T14:00:00+00:00"}]

    }
    templateObject.calendarOptions.set(calendarOptions)
    let calendar = new Calendar(calendarEl, calendarOptions);
    templateObject.calendar.set(calendar);
      calendar.render();

    $(document).ready(function() {
        $('.productionplannermodule .btnApply').on('click', async function(event) {
            $('.fullScreenSpin').css('display', 'inline-block')
            let events = templateObject.events.get();
            let objectDetail = {
                tproductionplandata: events
            }
            let workorders = await templateObject.getWorkorders();
            let tempOrders = cloneDeep(workorders);
            for(let i = 0; i< events.length; i++) {
                let workorderid = events[i].extendedProps.orderId;
                let index = workorders.findIndex(order=> {
                    return order.fields.ID == workorderid
                })
                let temp = tempOrders[index];
                temp.fields.StartTime = events[i].start
                tempOrders.splice(index, 1, temp);
            }
    
            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder:tempOrders})).then(function(){
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
                
            })
            
        })
    
        $('.productionplannermodule .btn-print-event').on('click', function(event) {
            document.title = 'Work order detail';
            
            $(".eventInfo .eventDetail").print({
            });
        })
    
        $('.productionplannermodule .btn-optimize').on('click',  function(event) {
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
                
                if(filteredEvents.length > 0) {
    
                    if(new Date(filteredEvents[0].start).getTime() > new Date().getTime()) {
                        let firstDuration = new Date(filteredEvents[0].end).getTime() - new Date(filteredEvents[0].start).getTime()
                        filteredEvents[0].start = new Date();
                        filteredEvents[0].end  = new Date(new Date().getTime() + firstDuration); 
                    }
                    let firstIndex = cloneEvents.findIndex(event => {
                        return event.resourceId == filteredEvents[0].resourceId && event.extendedProps.orderId == filteredEvents[0].extendedProps.orderId
                    })
                    if(firstIndex > -1) {
                        cloneEvents[firstIndex] = filteredEvents[0];
                    }
                    if(filteredEvents.length > 1) {
                        for (let j = 1; j<filteredEvents.length; j++) {
                            async function updateEvent() {
                                return new Promise(async(resolve, reject) => {
                                    let eventDuration = new Date(filteredEvents[j].end).getTime() - new Date(filteredEvents[j].start).getTime();
                                    let index = cloneEvents.findIndex(event => {
                                        return event.resourceId == filteredEvents[j].resourceId && event.title == filteredEvents[j].title && event.extendedProps.orderId == filteredEvents[j].extendedProps.orderId;
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
    
                }else {
    
                }
            }
            templateObject.events.set(cloneEvents);
            if(templateObject.calendar.get() != null) {
                let calendar = templateObject.calendar.get();
                calendar.destroy();
                // let dayIndex = new Date(events[0].start).getDay();
                let calendarOptions = templateObject.calendarOptions.get();
                let calendarEl= document.getElementById('calendar');
                let newCalendar = new Calendar(calendarEl, {...calendarOptions, events: cloneEvents})
                newCalendar.render();
                templateObject.calendar.set(newCalendar)
            }
    
        })
    
    
        $('.productionplannermodule .btn-raw-material').on('click', function(eve) {
            let events = templateObject.events.get();
            for(let i = 0; i< events.length; i++) {
                let event = events[i];
                if(event.extendedProps.builds.length == 0) {
                    continue;
                } else {
                    let buildSubNames = event.extendedProps.builds;
                    let buildSubs = []
                    for(let k = 0; k < buildSubNames.length; k++) {
                        // let index = events.findIndex(e=>{
                        //     return e.title == buildSubNames[k]
                        // })
    
                        for(let n = 0; n < events.length; n++) {
                            if(events[n].title == buildSubNames[k] && events[n].extendedProps.orderId.toString().split('_')[0] == event.extendedProps.orderId.toString().split('_')[0]) {
                                buildSubs.push(events[n])
                            }
                        }
                    }
                    buildSubs.sort((a, b)=>{
                        return new Date(a.end) - new Date(b.end)
                    });
                    let newStart = new Date(buildSubs[buildSubs.length-1].end)
                    let duration = new Date(event.end).getTime() - new Date(event.start).getTime();
                    let newEnd = new Date(newStart.getTime() + duration)
                    let eventIndex = events.findIndex(e=>{
                        return e.extendedProps.orderId == event.extendedProps.orderId
                    })
                    let tempEvent = (JSON.parse(JSON.stringify(events)) )[eventIndex] 
                    tempEvent.start = newStart;
                    tempEvent.end = newEnd;
                    events[eventIndex] = tempEvent;
                }
            }
            templateObject.events.set(events);
            if(templateObject.calendar.get() != null) {
                let calendar = templateObject.calendar.get();
                calendar.destroy();
                let dayIndex = new Date(events[0].start).getDay();
                let calendarOptions = templateObject.calendarOptions.get();
                let calendarEl= document.getElementById('calendar');
                let newCalendar = new Calendar(calendarEl, {...calendarOptions, events: events})
                newCalendar.render();
                templateObject.calendar.set(newCalendar)
            }
    
        })
    
        $('.productionplannermodule .btnPrintWorkSheet').on('click', function(event) {
            document.title = 'production planner worksheet';
            
            $(".productionPlannerTable").print({
                // title   :  document.title +" | Product Sales Report | "+loggedCompany,
                // noPrintSelector : ".btnAddProduct",
                // noPrintSelector : ".btnAddSubProduct",
                // noPrintSelector : ".btn-remove-raw",
                // noPrintSelector : ".btnAddAttachment",
            });
        })
    })

    // if(FlowRouter.current().path.includes('/manufacturingoverview')) {
    //     setTimeout(()=>{
    //         $('.fc-next-button').trigger('click');

    //     }, 100)
    //     setTimeout(()=>{
    //         $('.fc-prev-button').trigger('click')
    //     }, 1000)
    // }

    templateObject.changeStatus = async function(status) {
        // let templateObject = Template.instance();
        let orderData = templateObject.viewInfoData.get();
        let workorderid = orderData.JOBNumber;
        let workorders = await templateObject.getWorkorders();
        let events = templateObject.events.get();
        let tempEvents = cloneDeep(events);
        let tempInfoData = cloneDeep(templateObject.viewInfoData.get());
        tempInfoData.Status = status;
        templateObject.viewInfoData.set(tempInfoData)
        let eventIndex = tempEvents.findIndex(event=>{
            return event.extendedProps.orderId == workorderid
        })
        let event = tempEvents[eventIndex];
        let eventStartTime = event.start;
        let tempOrders = cloneDeep(workorders)
        let workorderIndex = workorders.findIndex(order=> {
            return order.fields.ID == workorderid
        })
        let targetOrder = workorders[workorderIndex];
        let tempOrder = cloneDeep(targetOrder);
        let startedTimes = tempOrder.fields.StartedTimes !=''? JSON.parse(tempOrder.fields.StartedTimes): [];
        let pausedTimes = tempOrder.fields.PausedTimes!= ''? JSON.parse(tempOrder.fields.PausedTimes): [];
        tempOrder.fields.Status = status;
        if(status == 'scheduled') {
            tempOrder.fields.StartTime = new Date(eventStartTime);
        }
        if(status == 'unscheduled') {
            tempOrder.fields.StartTime = '';
        }
        if(status == 'started') {
            tempOrder.fields.StartTime = new Date();
            startedTimes.push(new Date());
            tempOrder.fields.StartedTimes = JSON.stringify(startedTimes)
        }
        if(status == 'paused' || status == 'stopped') {
            let trackedTime = tempOrder.fields.TrackedTime;
            if(status == 'paused') {
                pausedTimes.push(new Date());
            } else {
                let stoppedTime = new Date();
                tempOrder.fields.StoppedTime = stoppedTime;
            }
            tempOrder.fields.PausedTimes = JSON.stringify(pausedTimes);
            trackedTime = trackedTime + (new Date().getTime() - new Date(startedTimes[startedTimes.length -1]).getTime())
            tempOrder.fields.TrackedTime = trackedTime;
        }
        
        tempOrders.splice(workorderIndex, 1, tempOrder);
        addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: tempOrders})).then(function(){})
    }
   
})

Template.production_planner_template.helpers({
    viewInfoData: () => {
        return Template.instance().viewInfoData.get();
    }
})

Template.production_planner_template.events({
    'click #btnMarkAsScheduled': async function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('scheduled')
        // let orderData = templateObject.viewInfoData.get();
        // let workorderid = orderData.JOBNumber;
        // let workorders = await templateObject.getWorkorders();
        // let events = templateObject.events.get();
        // let tempEvents = cloneDeep(events);
        // let tempInfoData = cloneDeep(templateObject.viewInfoData.get());
        // tempInfoData.Status = 'scheduled';
        // templateObject.viewInfoData.set(tempInfoData)
        // let eventIndex = tempEvents.findIndex(event=>{
        //     return event.extendedProps.orderId == workorderid
        // })
        // let event = tempEvents[eventIndex];
        // let eventStartTime = event.start;
        // let tempOrders = cloneDeep(workorders)
        // let workorderIndex = workorders.findIndex(order=> {
        //     return order.fields.ID == workorderid
        // })
        // let targetOrder = workorders[workorderIndex];
        // let tempOrder = cloneDeep(targetOrder);
        // tempOrder.fields.StartTime = new Date(eventStartTime);
        // tempOrder.fields.Status = 'scheduled';
        // tempOrders.splice(workorderIndex, 1, tempOrder);
        // addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: tempOrders})).then(function(){})

    },

    'click #btnMarkAsUnscheduled': async function (e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('unscheduled')
        // let orderData = templateObject.viewInfoData.get();
        // let workorderid = orderData.JOBNumber;
        // let workorders = await templateObject.getWorkorders();
        // let events = templateObject.events.get();
        // let tempEvents = cloneDeep(events);
        // let tempInfoData = cloneDeep(templateObject.viewInfoData.get());
        // tempInfoData.Status = 'unscheduled';
        // templateObject.viewInfoData.set(tempInfoData)
        // let eventIndex = tempEvents.findIndex(event=>{
        //     return event.extendedProps.orderId == workorderid
        // })
        // let event = tempEvents[eventIndex];
        // let eventStartTime = event.start;
        // let tempOrders = cloneDeep(workorders)
        // let workorderIndex = workorders.findIndex(order=> {
        //     return order.fields.ID == workorderid
        // })
        // let targetOrder = workorders[workorderIndex];
        // let tempOrder = cloneDeep(targetOrder);
        // tempOrder.fields.StartTime = new Date(eventStartTime);
        // tempOrder.fields.Status = 'unscheduled';
        // tempOrders.splice(workorderIndex, 1, tempOrder);
        // addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: tempOrders})).then(function(){})
    },

    'click #btnStartTimer': async function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('started')
        // let orderData = templateObject.viewInfoData.get();
        // let workorderid = orderData.JOBNumber;
        // let workorders = await templateObject.getWorkorders();
        // let events = templateObject.events.get();
        // let tempEvents = cloneDeep(events);
        // let tempInfoData = cloneDeep(templateObject.viewInfoData.get());
        // tempInfoData.Status = 'started';
        // templateObject.viewInfoData.set(tempInfoData)
        // let eventIndex = tempEvents.findIndex(event=>{
        //     return event.extendedProps.orderId == workorderid
        // })
        // let event = tempEvents[eventIndex];
        // event.start = new Date();
        // tempEvents.splice(eventIndex, 1, event);
        // templateObject.events.set(tempEvents)
        // let tempOrders = cloneDeep(workorders)
        // let workorderIndex = workorders.findIndex(order=> {
        //     return order.fields.ID == workorderid
        // })
        // let targetOrder = workorders[workorderIndex];
        // let tempOrder = cloneDeep(targetOrder);
        // tempOrder.fields.StartTime = new Date();
        // tempOrder.fields.Status = 'started';
        // tempOrders.splice(workorderIndex, 1, tempOrder);
        // addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: tempOrders})).then(function(){})
    },

    'click #btnPauseTimer': async function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('paused')
    },

    'click #btnStopTimer': function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('stopped')
    }
})