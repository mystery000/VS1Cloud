import { CRMService } from '../crm-service';
import '../../lib/global/indexdbstorage.js';
let crmService = new CRMService();

Template.addTask.onCreated(function () {
});

Template.addTask.events({

});

Template.addTask.helpers({

  getTodayDate: (format) => {
    return moment().format(format);
  },

  getTomorrowDay: () => {
    return moment().add(1, 'day').format('ddd');
  },

  getNextMonday: () => {
    var startDate = moment();
    return moment(startDate).day(1 + 7).format('ddd MMM D');
  },

  getDescription: (description) => {
    return description.length < 80 ? description : description.substring(0, 79) + '...'
  }
});
