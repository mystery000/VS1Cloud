import { ReactiveVar } from 'meteor/reactive-var';


Template.loggedcompanyoverview.helpers({
  vs1TradingName: () => {
      return localStorage.getItem('vs1TradingName') || '';
  }
});
