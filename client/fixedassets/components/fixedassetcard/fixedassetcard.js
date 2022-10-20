Template.fixedassetcard.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
});

Template.fixedassetcard.onRendered(function () {
  $('#edtAssetType').editableSelect();
  $('#edtBoughtFrom').editableSelect();
  $('#edtDepartment').editableSelect();

  $("#date-input,#edtDateofPurchase,#edtDescriptionStartDate,#edtNextTimeDate,#edtLastTimeDate").datepicker({
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