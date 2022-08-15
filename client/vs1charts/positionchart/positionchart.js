import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.positionchart.onCreated(()=>{
  const templateObject = Template.instance();
});

Template.positionchart.onRendered(()=>{
  const templateObject = Template.instance();  
});

Template.positionchart.events({
});



