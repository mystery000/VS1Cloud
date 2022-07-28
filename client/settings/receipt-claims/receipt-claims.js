import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();

Template.receiptclaims.onCreated(() => {
  const templateObject = Template.instance();
  
});

Template.receiptclaims.onRendered(function () {


});

Template.receiptclaims.events({
  'click #receiptClaimsSignUp': function() {
    window.open("https://hub.veryfi.com/");
  },
  
});
