import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();

Template.adp.onCreated(() => {
  const templateObject = Template.instance();
  
});

Template.adp.onRendered(function () {


});

Template.adp.events({
  'click #openLink': function() {
    window.open("https://in.adp.com");
  },
});
