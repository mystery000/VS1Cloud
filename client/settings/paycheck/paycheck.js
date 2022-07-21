import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();

Template.paycheck.onCreated(() => {
  const templateObject = Template.instance();
  
});

Template.paycheck.onRendered(function () {


});

Template.paycheck.events({
  
});
