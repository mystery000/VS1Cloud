import {ReactiveVar} from 'meteor/reactive-var';
import { ProductService } from '../product/product-service';
import { UtilityService } from '../utility-service';
import { Calendar, formatDate } from "@fullcalendar/core";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import {ManufacturingService} from '../manufacture/manufacturing-service';


Template.production_planner.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.resources = new ReactiveVar([]);
    templateObject.events = new ReactiveVar([]);
    templateObject.viewMode = new ReactiveVar();
    templateObject.headerGroup = new ReactiveVar()
})
let manufacturingService = new ManufacturingService();
Template.production_planner.onRendered(async function() {
    const templateObject = Template.instance();
   
    
    async function getResources() {
        return new Promise(async(resolve, reject) =>{
            getVS1Data('TProcessStep').then(function(dataObject){
                if(dataObject.length == 0) {
                    manufacturingService.getAllProcessData().then(function(data){
                        addVS1Data('TProcessStep', JSON.stringify(data))
                        let useData = data.tprocessstep;
                        let temp = []
                        for(let i = 0; i<useData.length; i++) {
                            temp.push({
                                id: i,
                                title: useData[i].fields.KeyValue,
                            })
                        }
                        resolve(temp)
                    })
                }else{
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tprocessstep;
                    let temp = [];
                    for(let i = 0; i<useData.length; i++) {
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
                for(let i = 0; i<useData.length; i++) {
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
    let workorders = localStorage.getItem('TWorkorders')?JSON.parse(localStorage.getItem('TWorkorders')) : []
    // templateObject.workorders.set(workorders);
    async function getEvents () {
        return new Promise(async function(resolve, reject) {
            getVS1Data('TProductionPlan').then(function(dataObject){

            }).catch(function(e) {
                let events = [];
                for(let i = 0; i < workorders.length; i ++ ){
                    let processName = workorders[i].BOM.process;
                    let productName = workorders[i].BOM.productName;
                    let startTime = new Date(workorders[i].StartTime);
                    let duration = workorders[i].BOM.duration;
                    if(workorders[i].quantity)  duration = duration * parseFloat(workorders[i].quantity);
                    let endTime  = new Date();
                    endTime.getTime(startTime.getTime() + duration * 3600000)
                    let index = resources.findIndex(resource => {
                        return resource.title == processName;
                    })
                    let resourceId = resources[index].id;
                    var randomColor = Math.floor(Math.random()*16777215).toString(16);
                    let event = {
                        "resourceId":resourceId,"title":productName,"start":startTime,"end":endTime, "color": "black",
                    }
                    events.push(event);
                }
                templateObject.events.set(events)
                resolve(events);
            })
        })
    }
  
    let calendarEl = document.getElementById('calendar');
    let calendar = new Calendar(calendarEl, {
        plugins: [
            resourceTimelinePlugin,
            interactionPlugin,
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            bootstrapPlugin
        ],
        timeZone: 'local',
        initialDate: new Date(),
        themeSystem: "bootstrap",
        initialView: "resourceTimeline",
        longPressDelay: 100,
        resources: await getResources(),
        events: await getEvents()
      });
      calendar.render();
})

Template.production_planner.events({

})

Template.production_planner.helpers({
    
})