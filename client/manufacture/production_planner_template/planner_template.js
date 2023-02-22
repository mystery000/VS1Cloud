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
import moment from 'moment/moment';
import { ContactService } from '../../contacts/contact-service';

let manufacturingService = new ManufacturingService();
let contactService = new ContactService();
let appendHtmlOnTitle = '<div><div class="input-group date" style="width: 160px; float:left"><input type="text" class="form-control" id="calendarDate" name="calendarDate" value=""><div class="input-group-addon"><span class="glyphicon glyphicon-th"></span></div></div><div class="custom-control custom-switch" style="width:170px; float:left; margin:8px 5px 0 60px;"><input class="custom-control-input" type="checkbox" name="chkmyAppointments" id="chkmyAppointments" style="cursor: pointer;" autocomplete="on" checked="checked"><label class="custom-control-label" for="chkmyAppointments" style="cursor: pointer;">My Jobs</label></div></div>';
let appendHtmlOnLeft = '<div class="custom-control custom-switch"><input class="custom-control-input toggle-resource-employee" id="toggle-resource-employee" type="checkbox" style="cursor: pointer;"><label class="custom-control-label" style="position:relative;width:200px;cursor: pointer;" for="toggle-resource-employee">Resource / Employee</label></div>'
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
    templateObject.plannerSettings = new ReactiveVar();
    templateObject.ignoreDates = new ReactiveVar();
    templateObject.showStart = new ReactiveVar();
    templateObject.showEnd = new ReactiveVar();
    templateObject.slotDuration = new ReactiveVar();
    templateObject.employees = new ReactiveVar();
    templateObject.resourceJobs = new ReactiveVar(true)
})



Template.production_planner_template.onRendered(async function() {
    const templateObject = Template.instance();
    templateObject.getSettings = async function() {
        return new Promise((resolve, reject)=>{
            getVS1Data('ManufacturingSettings').then(function(dataObject) {
                if(dataObject.length == 0) {
                    let records = {
                        showSaturday: true,
                        showSunday: true,
                        showQA: true,
                        startTime: '08:00',
                        endTime: '17:00',
                        showTimein: '1'
                    }
                    templateObject.plannerSettings.set(records)
                    resolve(records)
                } else {
                    let records = JSON.parse(dataObject[0].data).fields;
                    templateObject.plannerSettings.set(records);
                    let showTimein = records.showTimein;
                    $('.edtShowTimein').val(showTimein);
                    resolve(records)
                }
            }).catch(function(error) {
                let records = {
                    showSaturday: true,
                    showSunday: true,
                    showQA: true,
                    startTime: '08:00',
                    endTime: '17:00',
                    showTimein: '1'
                }
                templateObject.plannerSettings.set(records)
                resolve(records)
            })
        })
    }

    let records = await templateObject.getSettings()

    if(records) {
        if(records.showSaturday == true && records.showSunday == true) {
            templateObject.ignoreDates.set('')
        }else if(records.showSaturday == true && records.showSunday == false) {
            templateObject.ignoreDates.set('0')
        } else if(records.showSaturday == false && records.showSunday == true) {
            templateObject.ignoreDates.set('6')
        } else if(records.showSaturday == false && records.showSunday == false) {
            templateObject.ignoreDates.set('0, 6')
        }
        templateObject.showStart.set(records.startTime)
        templateObject.showEnd.set(records.endTime);
        let slotDuration = ''
        switch(records.showTimein) {
            case '0.5':
                slotDuration = '00:30:00'
                break;
            case '1':
                slotDuration = '00:60:00'
                break;
            case '2':
                slotDuration = '02:00:00'
                break;
            case '3':
                slotDuration = '03:00:00'
                break;
            case '4':
                slotDuration = '04:00:00'
                break;
            case '6':
                slotDuration = '06:00:00'
                break;
            case '12':
                slotDuration = '12:00:00'
                break;
            default:
                slotDuration = '00:60:00'
                break;
        }
        templateObject.slotDuration.set(slotDuration);
        $('.edtShowTimein').val(records.showTimein)

    }



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

    templateObject.getEmployees=async function() {
        return new Promise(async(resolve, reject)=>{
            getVS1Data("TEmployee").then(function(dataObject){
                if(dataObject.length == 0) {
                    contactService.getAllEmployeeSideData().then(function(data) {
                        let temp = [];
                        for(let i = 0; i< data.temployee; i++) {
                            temp.push({
                                id: i,
                                title: data.temployee[i].fields.EmployeeName
                            })
                        }
                        resolve(temp)
                    })
                }else{
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.temployee;
                    let temp = []
                    for(let i = 0; i< useData.length; i++ ) {
                        temp.push({
                            id: i,
                            title: useData[i].fields.EmployeeName,
                        })
                    }
                    resolve(temp)
                }
            }).catch(function (e) {
                contactService.getAllEmployeeSideData().then(function(data) {
                    let temp = [];
                        for(let i = 0; i< data.temployee; i++) {
                            temp.push({
                                id: i,
                                title: data.temployee[i].fields.EmployeeName
                            })
                        }
                    resolve(temp)
                })
            })
        })
    }

    let employees = await templateObject.getEmployees();
    templateObject.employees.set(employees)

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
    const workSpec = [
        {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: templateObject.showStart.get(),
            endTime: templateObject.showEnd.get(),
        }
    ]
    const workMin = workSpec.map(item => item.startTime).sort().shift()
    const workMax = workSpec.map(item => item.endTime).sort().pop()

    let calendarOptions = {
        
        plugins: [
            resourceTimelinePlugin,
            interactionPlugin,
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            bootstrapPlugin
        ],
        customButtons: {
            settingsmodalbutton: {
                text: "",
                click: function() {
                    $("#settingsModal").modal();
                }
            },
        },
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        timeZone: 'local',
        initialView: 'resourceTimelineWeek',
        firstDay: dayIndex,
        resourceAreaWidth: "15%",
        aspectRatio: 1.5,
        headerToolbar: {
            left: 'prev,next',
            center: '',
            right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth,settingsmodalbutton'
        },
        hiddenDays: templateObject.ignoreDates.get(),
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
                    let options = {...calendarOptions, events: events}
                    templateObject.calendarOptions.set(options)
                    // calendar = new Calendar(calendarEl, {
                    //     ...calendarOptions,
                    //     events: events,
                    // })
                    // calendar.render();
                    calendar.setOption('events', events)
                }
            }else {
                let targetIndex = events.findIndex(event => {
                    return event.resourceId == resourceId && event.title == info.event.title;
                })
                events[targetIndex].start = newStart;
                events[targetIndex].end = newEnd;
                templateObject.events.set(events);
                let options = {...calendarOptions, events: events}
                templateObject.calendarOptions.set(options);
                calendar.setOption('events', events)
                // calendar.destroy();
                // calendar = new Calendar(calendarEl, {
                //     ...calendarOptions,
                //     events: events
                // })
                // calendar.render()
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
                    ShipDate: new Date(workorders[orderIndex].fields.ShipDate).toLocaleDateString(),
                    JobNotes: JSON.parse(workorders[orderIndex].fields.BOMStructure).CustomInputClass || '',
                    Percentage: percentage + '%',
                    Status: workorders[orderIndex].fields.Status
                }
                templateObject.viewInfoData.set(object);
                $('.eventInfo').css('display', 'flex')
                let orderId = info.event.extendedProps.orderId;
                let salesorderId = orderId.toString().split('_')[0];
                templateObject.selectedEventSalesorderId.set(salesorderId);
                let dayIndex = info.event.start.getDay();
                // calendar.destroy();
                // calendar = new Calendar(calendarEl, {
                //     ...calendarOptions,
                //     firstDay: dayIndex,
                //     events: templateObject.events.get()
                // })
                // calendar.render();
                let myEvents = templateObject.events.get();
                let options = {...calendarOptions, firstDay: dayIndex, events:myEvents}
                templateObject.calendarOptions.set(options);
                calendar.setOption('firstDay', dayIndex);
                calendar.setOption('events', myEvents)
            }, 300)
        },
        slotMinTime :workMin,
        slotMaxTime:workMax,
        slotDuration: templateObject.slotDuration.get()

            // expandRows: true,
            // events: [{"resourceId":"1","title":"event 1","start":"2022-11-14","end":"2022-11-16"},{"resourceId":"2","title":"event 3","start":"2022-11-15T12:00:00+00:00","end":"2022-11-16T06:00:00+00:00"},{"resourceId":"0","title":"event 4","start":"2022-11-15T07:30:00+00:00","end":"2022-11-15T09:30:00+00:00"},{"resourceId":"2","title":"event 5","start":"2022-11-15T10:00:00+00:00","end":"2022-11-15T15:00:00+00:00"},{"resourceId":"1","title":"event 2","start":"2022-11-15T09:00:00+00:00","end":"2022-11-15T14:00:00+00:00"}]

    }
    templateObject.calendarOptions.set(calendarOptions)
    let calendar = new Calendar(calendarEl, calendarOptions);
    templateObject.calendar.set(calendar);
      calendar.render();
      let leftElement = $("#calendar .fc-header-toolbar .fc-toolbar-chunk:nth-child(1)");
      let titleElement = $("#calendar .fc-header-toolbar div:nth-child(2)");
      $(titleElement).css('display', 'flex')
      $(titleElement).append(appendHtmlOnTitle);
      $(titleElement).css('gap', '30px')
      $(leftElement).css('display', 'flex')
      $(leftElement).css('align-items', 'center')
      $(leftElement).append(appendHtmlOnLeft);
      $(leftElement).css('gap', '30px')

      $("#calendarDate").datepicker({
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
        onSelect: function(formated, dates) {
            let gotoDate = new Date(formated.split("/")[2] + "-" + formated.split("/")[1] + "-" + formated.split("/")[0]);
            calendar.gotoDate(gotoDate);
        },
      });
    
      $('#calendarDate').val(moment(new Date()).format('DD/MM/YYYY'))

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
                let showSaturday = $('.toggleShowSat').is(':checked');
                        let showSunday = $('.toggleShowSun').is(':checked');
                        let showQA = $('.toggleShowQA').is(':checked');
                        let showTimein = $('.edtShowTimein').val();
                        let startTime = templateObject.showStart.get();
                        let endTime = templateObject.showEnd.get();
                        let objectDetail = {
                            type: 'ManufacturingSettings',
                            fields: {
                                showSaturday: showSaturday,
                                showSunday: showSunday,
                                showQA: showQA,
                                startTime: startTime,
                                endTime: endTime,
                                showTimein: showTimein
                            }
                        }
                        addVS1Data('ManufacturingSettings', JSON.stringify(objectDetail)).then(function(){
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
                // calendar.destroy();
                let calendarOptions = templateObject.calendarOptions.get();
                let calendarEl= document.getElementById('calendar');
                // let newCalendar = new Calendar(calendarEl, {...calendarOptions, events: cloneEvents})
                // newCalendar.render();
                let options = {...calendarOptions, events:cloneEvents}
                templateObject.calendarOptions.set(options)
                calendar.setOption('events', cloneEvents)
                templateObject.calendar.set(calendar)
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
                    let tempEvent = cloneDeep(event) 
                    tempEvent.start = newStart;
                    tempEvent.end = newEnd;
                    events[eventIndex] = tempEvent;
                }
            }

            templateObject.events.set(events);
            if(templateObject.calendar.get() != null) {
                let calendar = templateObject.calendar.get();
                // calendar.destroy();
                // let dayIndex = new Date(events[0].start).getDay();
                let calendarOptions = templateObject.calendarOptions.get();
                // let calendarEl= document.getElementById('calendar');
                // let newCalendar = new Calendar(calendarEl, {...calendarOptions, events: events})
                let options = {...calendarOptions, events: events}
                templateObject.calendarOptions.set(options)
                let fEvents = events
                // newCalendar.render();
                setTimeout(()=>{
                    calendar.setOption('events', fEvents)
                    templateObject.calendar.set(calendar)
                }, 1000)
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

        const formatTime = milliseconds => {
            const seconds = Math.floor((milliseconds / 1000) % 60);
            const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
            const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

            return [
                hours.toString().padStart(2, "0"),
                minutes.toString().padStart(2, "0"),
                seconds.toString().padStart(2, "0")
            ].join(":");
        }
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
        if(status == 'started' || status == 'resumed' || status == 'QAStarted' || status == 'QAResumed') {
            if(status == 'started') {
                tempOrder.fields.StartTime = new Date();
                tempOrder.fields.InProgress = true;
            }
            startedTimes.push(new Date());
            tempOrder.fields.StartedTimes = JSON.stringify(startedTimes)
        }
        if(status == 'paused' || status == 'stopped' || status == 'QAPaused' || status == 'QAStopped') {
            let trackedTime = tempOrder.fields.TrackedTime;
            pausedTimes.push(new Date());
            if(status == 'paused' || status == 'QAPaused' || ((status == 'stopped' || status == 'QAStopped')&&new Date(startedTimes[startedTimes.length-1]).getTime() > new Date(pausedTimes[pausedTimes.length -2]).getTime() )) {
                trackedTime = trackedTime + (new Date().getTime() - new Date(startedTimes[startedTimes.length -1]).getTime())
            }
            if(status =='QAStopped') {
                let stoppedTime = new Date();
                tempOrder.fields.StoppedTime = stoppedTime;
            }
            tempOrder.fields.PausedTimes = JSON.stringify(pausedTimes);
            tempOrder.fields.TrackedTime = trackedTime;
            if(status == 'QAStopped') {
            }
        }

        if(status == 'Completed') {
            tempOrder.fields.IsCompleted = true;
        }

        tempOrders.splice(workorderIndex, 1, tempOrder);
        addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: tempOrders})).then(function(){})
    }

})

Template.production_planner_template.helpers({
    viewInfoData: () => {
        return Template.instance().viewInfoData.get();
    },

    showStartTimer: ()=> {
        let templateObject = Template.instance();
        let info = templateObject.viewInfoData.get();
        return info.Status == 'scheduled'
    },
    showPauseTimer: ()=> {
        let templateObject = Template.instance();
        let info = templateObject.viewInfoData.get();
        return info.Status == 'started' || info.Status == 'resumed'
    },
    showStopTimer: ()=> {
        let templateObject = Template.instance();
        let info = templateObject.viewInfoData.get();
        return info.Status == 'started' || info.Status == 'resumed' || info.Status == 'paused'
    },
    showResumeTimer: ()=> {
        let templateObject = Template.instance();
        let info = templateObject.viewInfoData.get();
        return info.Status == 'paused'
    },
    showStartQA: ()=>{
        let templateObject = Template.instance();
        let info = templateObject.viewInfoData.get();
        return info.Status == 'stopped'
    },
    showPauseQA: ()=> {
        let templateObject = Template.instance();
        let info = templateObject.viewInfoData.get();
        return info.Status == 'QAStarted' || info.Status == 'QAResumed'
    },
    showStopQA: ()=> {
        let templateObject = Template.instance();
        let info = templateObject.viewInfoData.get();
        return info.Status == 'QAStarted' || info.Status == 'QAResumed' || info.Status == 'QAPaused'
    },
    showResumeQA: ()=> {
        let templateObject = Template.instance();
        let info = templateObject.viewInfoData.get();
        return info.Status == 'QAPaused'
    },
    showMarkAsCompleted:() => {
        let templateObject = Template.instance();
        let info = templateObject.viewInfoData.get();
        return info.Status == 'QAStopped'
    },
    plannerSettings:() => {
        return Template.instance().plannerSettings.get()
    }
})

Template.production_planner_template.events({
    'click #btnMarkAsScheduled': async function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('scheduled')
    },

    'click #btnMarkAsUnscheduled': async function (e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('unscheduled')
    },

    'click #btnStartTimer': async function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('started')
    },

    'click #btnPauseTimer': async function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('paused')
    },

    'click #btnStopTimer': function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('stopped')
    },

    'click #btnResumeTimer': function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('resumed')
    },

    'click #btnStartQA': function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus ('QAStarted')
    },

    'click #btnResumeQA': function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('QAResumed')
    },
    'click #btnPauseQA': function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('QAPaused')
    },
    'click #btnStopQA': function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('QAStopped');
    },
    'click #btnMarkAsComplete': function(e) {
        let templateObject = Template.instance();
        templateObject.changeStatus('Completed')
    },

    'change .toggleShowWeekend': function(event) {
        event.preventDefault();
        event.stopPropagation();
        let templateObject = Template.instance();
        let calendar = templateObject.calendar.get();
        let calendarOptions= templateObject.calendarOptions.get();
        let showSaturday = $('.toggleShowSat').is(':checked');
        let showSunday = $('.toggleShowSun').is(':checked');
        let hiddenDays = '';
        if(showSaturday == true && showSunday == false) {
            hiddenDays = ''
        } else if (showSaturday == true && showSunday == false ) {
            hiddenDays = '0'
        } else if (showSaturday == false && showSunday == true) {
            hiddenDays = '6'
        } else if (showSaturday == false && showSunday == false) {
            hiddenDays = "0, 6"
        }
        calendar.setOption('hiddenDays', hiddenDays)
        let options = {...calendarOptions, hiddenDays: hiddenDays}
        templateObject.calendarOptions.set(options)
        templateObject.calendar.set(calendar)
    },

    'change #hoursFrom': function(event) {
        let templateObject = Template.instance();
        let calendar = templateObject.calendar.get();
        templateObject.showStart.set($(event.target).val())
        const workSpec = [
            {
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: $(event.target).val(),
                endTime: templateObject.showEnd.get(),
            }
        ]
        const workMin = workSpec.map(item => item.startTime).sort().shift()
        let calendarOptions = templateObject.calendarOptions.get();
        let options = {...calendarOptions, slotMinTime: workMin}
        templateObject.calendarOptions.set(options)
        calendar.setOption('slotMinTime', workMin)
        templateObject.calendar.set(calendar)
    },

    'change #hoursTo': function(event) {
        let templateObject = Template.instance();
        let calendar = templateObject.calendar.get();
        templateObject.showEnd.set($(event.target).val())
        const workSpec = [
            {
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: $(event.target).val(),
                endTime: templateObject.showEnd.get(),
            }
        ]
        const workMax = workSpec.map(item => item.endTime).sort().pop()
        let calendarOptions = templateObject.calendarOptions.get();
        let options = {...calendarOptions, slotMaxTime: workMax}
        templateObject.calendarOptions.set(options)
        calendar.setOption('slotMaxTime', workMax)
        templateObject.calendar.set(calendar)
    },

    'change .edtShowTimein': function(event) {
        event.preventDefault();
        event.stopPropagation()
        let templateObject = Template.instance();
        let calendar = templateObject.calendar.get();
        let value = $(event.target).val();
        let slotDuration ='';
        switch(value) {
            case '0.5':
                slotDuration = '00:30:00'
                break;
            case '1':
                slotDuration = '00:60:00'
                break;
            case '2':
                slotDuration = '02:00:00'
                break;
            case '3':
                slotDuration = '03:00:00'
                break;
            case '4':
                slotDuration = '04:00:00'
                break;
            case '6':
                slotDuration = '06:00:00'
                break;
            case '12':
                slotDuration = '12:00:00'
                break;
            default:
                slotDuration = '00:60:00'
                break;
        }
        let calendarOptions = templateObject.calendarOptions.get();
        let options = {...calendarOptions, slotDuration: slotDuration}
        templateObject.slotDuration.set(slotDuration)
        templateObject.calendarOptions.set(options)
        calendar.setOption('slotDuration', slotDuration)
        templateObject.calendar.set(calendar)
    },

    'click .btnSaveSettings': function(event) {
        event.preventDefault();
        event.stopPropagation();
        let templateObject = Template.instance();
        let showSaturday = $('.toggleShowSat').is(':checked');
        let showSunday = $('.toggleShowSun').is(':checked');
        let showQA = $('.toggleShowQA').is(':checked');
        let showTimein = $('.edtShowTimein').val();
        let startTime = templateObject.showStart.get();
        let endTime = templateObject.showEnd.get();
        let objectDetail = {
            type: 'ManufacturingSettings',
            fields: {
                showSaturday: showSaturday,
                showSunday: showSunday,
                showQA: showQA,
                startTime: startTime,
                endTime: endTime,
                showTimein: showTimein
            }
        }
        addVS1Data('ManufacturingSettings', JSON.stringify(objectDetail)).then(function(){
            swal({
                title: 'Success',
                text: 'Production planner setting has been saved successfully',
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'Continue',
            }).then((result) => {
                $('#settingsModal').modal('toggle')
            });
        })
    },

    'click .btnResetSettings': function(event) {
        event.preventDefault()
        event.stopPropagation();
        let templateObject = Template.instance();
        let records = templateObject.plannerSettings.get();
        let slotDuration = '';
        switch (records.showTimein) {
            case '0.5':
                slotDuration = '00:30:00'
                break;
            case '1':
                slotDuration = '00:60:00'
                break;
            case '2':
                slotDuration = '02:00:00'
                break;
            case '3':
                slotDuration = '03:00:00'
                break;
            case '4':
                slotDuration = '04:00:00'
                break;
            case '6':
                slotDuration = '06:00:00'
                break;
            case '12':
                slotDuration = '12:00:00'
                break;
            default:
                slotDuration = '00:60:00'
                break;
        }
        let calendar = templateObject.calendar.get()
        $('.toggleShowSat').prop('checked', records.showSaturday);
        $('.toggleShowSun').prop('checked', records.showSunday);
        $('.toggleShowQA').prop('checked', records.showQA);
        $('#hoursFrom').val(records.startTime)
        $('#hoursTo').val(records.endTime)
        $('.edtShowTimein').val(records.showTimein);

        let hiddenDays = '';
        if(records.showSaturday == true && records.showSunday == false) {
            hiddenDays = ''
        } else if (records.showSaturday == true && records.showSunday == false ) {
            hiddenDays = '0'
        } else if (records.showSaturday == false && records.showSunday == true) {
            hiddenDays = '6'
        } else if (records.showSaturday == false && records.showSunday == false) {
            hiddenDays = "0, 6"
        }

        const workSpec = [
            {
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: records.startTime,
                endTime: records.endTime,
            }
        ]
        const workMin = workSpec.map(item => item.startTime).sort().shift()
        const workMax = workSpec.map(item => item.endTime).sort().pop()
        let calendarOptions = templateObject.calendarOptions.get();
        let options = {
            ...calendarOptions,
            hiddenDays: hiddenDays,
            slotMinTime: workMin,
            slotMaxTime: workMax,
            slotDuration: slotDuration,
        }
        templateObject.calendarOptions.set(options);
        calendar.setOption('hiddenDays', hiddenDays)
        calendar.setOption('slotMinTime', workMin)
        calendar.setOption('slotMaxTime', workMax)
        calendar.setOption('slotDuration', slotDuration)
        templateObject.showStart.set(records.startTime);
        templateObject.showEnd.set(records.endTime)
        templateObject.slotDuration.set(slotDuration);
        $('.edtShowTimein').val(records.showTimein)
    },

    'click .btnCancelSettings': function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('.btnResetSettings').trigger('click');
        $('#settingsModal').modal('toggle')
    },

    'change .toggle-resource-employee': function(event) {
        let templateObject = Template.instance();
        let calendar = templateObject.calendar.get()
        if($(event.target).is(':checked') == true) {
            let employees = templateObject.employees.get();
            let calendarOptions = templateObject.calendarOptions.get();
            let options = {...calendarOptions, resources: employees, events: []}
            calendar.setOption('resources', employees)
            calendar.setOption('events', [])
            templateObject.calendarOptions.set(options)
            templateObject.calendar.set(calendar)
            templateObject.resourceJobs.set(false)
        }else {
            let resources = templateObject.resources.get();
            let calendarOptions = templateObject.calendarOptions.get();
            let options = {...calendarOptions, resources: resources, events: templateObject.events.get()}
            calendar.setOption('resources', resources)
            calendar.setOption('events', templateObject.events.get())
            templateObject.calendarOptions.set(options)
            templateObject.calendarOptions.set(calendar);
            templateObject.resourceJobs.set(true)
        }
    }

})
