import { ReactiveVar } from "meteor/reactive-var";
import { HTTP } from "meteor/http";
import { updateAllCurrencies } from "../settings/currencies-setting/currencies";


const currentDate = new Date();
let currentFormatedDate =
  currentDate.getDay() +
  "/" +
  currentDate.getMonth() +
  "/" +
  currentDate.getFullYear();


Template.updateCurrencies.onCreated(function () {
  const templateObject = Template.instance();
});

Template.updateCurrencies.onRendered(function () {
  let templateObject = Template.instance();
  console.log("Currency user");

  const targetUserId = FlowRouter.getParam("_userId");

  console.log(targetUserId);

  return {targetUserId};

  updateAllCurrencies(targetUserId);


});
