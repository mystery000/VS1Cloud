import { Template } from 'meteor/templating';
import './help_advisor.html';

Template.helpadvisor.onCreated(function(){


});

Template.helpadvisor.events({
  'click .btngetAdvisor': function(event) {
      swal('Coming Soon', '', 'info');
  }
});
