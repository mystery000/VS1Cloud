import { Template } from "meteor/templating";
import "./editCardChartButtons.html";
import { CardService } from "../card-service";
import { ChartService } from "../chart-service";

const cardService = new CardService();
const chartService = new ChartService();

Template.editCardChartButtons.events({
  "click .saveButton": async function (e) {
    e.preventDefault();    
    cardService.saveCards();    
    chartService.saveCharts();
  },
  "click .resetButton": async function (e) {
    e.preventDefault();    
    cardService.resetCards();          
    chartService.resetCharts();
  },
  "click .cancelButton": async function (e) {
    e.preventDefault();    
    cardService.cancelCards();         
    chartService.cancelCharts();
  },
});
