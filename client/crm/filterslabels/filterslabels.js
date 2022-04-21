import { CRMService } from '../crm-service';
import '../../lib/global/indexdbstorage.js';
let crmService = new CRMService();

Template.filterslabels.onCreated(function () {

  const templateObject = Template.instance();

});

Template.filterslabels.onRendered(function () {

  $("#labelsCollapseContainer").sortable({
    // handle: '.filtersmenuoption',
    update: function (event, ui) {
    },
  });

  $("#filtersCollapseContainer").sortable({
    // handle: '.filtersmenuoption',
    update: function (event, ui) {
    },
  });

  $("#date-input, #dtRescheduleDate").datepicker({
    showOn: 'button',
    buttonText: 'Show Date',
    buttonImageOnly: true,
    buttonImage: '/img/imgCal2.png',
    constrainInput: false,
    dateFormat: 'd/mm/yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });

  let templateObject = Template.instance();

});

Template.filterslabels.events({


});

Template.filterslabels.helpers({

  getTodoDate: (date, format) => {
    return moment(date).format(format);
  },

  getTodayDate: (format) => {
    return moment().format(format);
  },

  getDescription: (description) => {
    return description.length < 80 ? description : description.substring(0, 79) + '...'
  }
});
