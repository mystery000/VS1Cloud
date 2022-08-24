import { ReactiveVar } from "meteor/reactive-var";


Template.eftExportModal.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.eftOptionsList = new ReactiveVar([]);
});

Template.eftExportModal.onRendered(function () {
  let templateObject = Template.instance();
});

Template.eftExportModal.events({
 
  "click .btnCancelEftExport": (e) => {
    $('#eftExportModal').modal('hide');
  },

});

Template.eftExportModal.helpers({ 
});
