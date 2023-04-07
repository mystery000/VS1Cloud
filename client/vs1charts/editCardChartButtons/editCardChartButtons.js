import { Template } from "meteor/templating";
import "./editCardChartButtons.html";
import { CardService } from "../card-service";

const cardService = new CardService();

const cardExist = () => {
  return $(".card-visibility").length;
};

Template.editCardChartButtons.events({
  "click .saveButton": async function (e) {
    e.preventDefault();
    if (cardExist()) {
      cardService.saveCards();
    }
  },
  "click .resetButton": async function (e) {
    e.preventDefault();
    if (cardExist()) {
      cardService.resetCards();
    }
  },
  "click .cancelButton": async function (e) {
    e.preventDefault();
    if (cardExist()) {
      cardService.cancelCards();
    }     
  },
});
