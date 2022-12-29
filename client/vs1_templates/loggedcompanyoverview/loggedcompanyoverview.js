import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './loggedcompanyoverview.html';


Template.loggedcompanyoverview.helpers({
  vs1TradingName: () => {
      return localStorage.getItem('vs1TradingName') || '';
  },
  firstName: () => {
      let loggedEmployeedName = localStorage.getItem('vs1LoggedEmployeeName').split(" ") || '';
      return loggedEmployeedName[0] || '';
  },
  loggedEmpID: () => {
      return localStorage.getItem('vs1LoggedEmployeeID') || '';
  }
});
