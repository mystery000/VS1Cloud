import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.profitabilitychart.onCreated(()=>{
  const templateObject = Template.instance();
});

Template.profitabilitychart.onRendered(()=>{
  const templateObject = Template.instance();  
});

Template.profitabilitychart.events({
});



