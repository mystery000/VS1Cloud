import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();

Template.mailchimp.onCreated(() => {
  const templateObject = Template.instance();
  
});

Template.mailchimp.onRendered(function () {


});

Template.mailchimp.events({
  
});
