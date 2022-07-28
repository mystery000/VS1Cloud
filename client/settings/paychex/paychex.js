import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();

Template.paychex.onCreated(() => {
  const templateObject = Template.instance();
  
});

Template.paychex.onRendered(function () {


});

Template.paychex.events({

  'click #openLink': function() {

    window.open("https://www.paychex.com/contact/sales");
  },
  
});
