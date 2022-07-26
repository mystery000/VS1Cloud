import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();

Template.yoodledeveloper.onCreated(() => {
  const templateObject = Template.instance();
  
});

Template.yoodledeveloper.onRendered(function () {


});

Template.yoodledeveloper.events({
  'click #yoodleDeveloperSignUp': function() {
    window.open("https://developer.yodlee.com/user/login");
  }  
});
