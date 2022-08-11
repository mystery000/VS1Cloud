import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.cashchart.onCreated(()=>{
  const templateObject = Template.instance();
});

Template.cashchart.onRendered(()=>{
  const templateObject = Template.instance();  
});

Template.cashchart.events({
});



