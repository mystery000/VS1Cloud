import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();

Template.mailchimpSettings.onCreated(() => {
  const templateObject = Template.instance();
});

Template.mailchimpSettings.onRendered(function () {

});

Template.mailchimpSettings.events({
  'click #mailchimpSignUp': function () {
    window.open("https://login.mailchimp.com/signup");
  },
});
