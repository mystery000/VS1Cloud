import './bankaccounts-settings.html'
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import "../../lib/global/indexdbstorage.js";
import { AccountService } from '../../accounts/account-service';

const accountService = new AccountService();

Template.wizard_bankaccounts.onCreated(function () {
  Template.wizard_bankaccounts.inheritsEventsFrom('non_transactional_list');
  Template.wizard_bankaccounts.inheritsHelpersFrom('non_transactional_list');
})

Template.wizard_bankaccounts.events({
  'change [name="showontransactioninput"]'(event) {
    const id = parseInt($(event.target).val());
    const templpateObject = Template.instance();
    if(id) {
      getVS1Data('TAccountVS1')
        .then(dataObject => {
          let data = JSON.parse(dataObject[0].data);
          const updatedDataIndex = data.taccountvs1.findIndex(tac => tac.fields.ID == id);
        })
    }
  },
})
