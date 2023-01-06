import { Template } from 'meteor/templating';
import './transaction_calculation.html'

Template.registerHelper("equals", function (a, b) {
  return a === b;
});
