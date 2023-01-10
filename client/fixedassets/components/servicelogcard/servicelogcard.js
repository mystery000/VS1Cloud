import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.servicelogcard.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);

  templateObject.asset_code = new ReactiveVar();
  templateObject.asset_name = new ReactiveVar();
  templateObject.service_tyoe = new ReactiveVar();
  templateObject.service_date = new ReactiveVar();
  templateObject.service_provider = new ReactiveVar();
  templateObject.next_service_cate = new ReactiveVar();
});

Template.servicelogcard.onRendered(function () {
  $('#edtAssetCode').editableSelect();
  let objDetails = {
    type: "TServiceLog",
    fields: {
      
    }
};

  $("#date-input,#dtServiceDate,#dtNextServiceDate").datepicker({
    showOn: 'button',
    buttonText: 'Show Date',
    buttonImageOnly: true,
    buttonImage: '/img/imgCal2.png',
    dateFormat: 'dd/mm/yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });
});
Template.servicelogcard.events({
  "click button.btnSave": function() {
    
  },
  "click button.btnBack": function() {
    FlowRouter.go('/serviceloglist');
  }
});