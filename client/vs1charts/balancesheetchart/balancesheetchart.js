import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.balancesheetchart.onCreated(()=>{
  const templateObject = Template.instance();
});

Template.balancesheetchart.onRendered(()=>{
  const templateObject = Template.instance();  
});

Template.balancesheetchart.events({
});



