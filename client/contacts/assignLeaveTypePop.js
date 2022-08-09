Template.assignLeaveTypePop.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.custdatatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();
});

Template.assignLeaveTypePop.onRendered(function () {
    const templateObject = Template.instance();
    templateObject.currentDrpDownID = new ReactiveVar();
});

Template.assignLeaveTypePop.onCreated(function () {
    const templateObject = Template.instance();
    setTimeout(function () {
        $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf,#edtLeaveStartDate,#edtLeaveEndDate,#edtPeriodPaymentDate").datepicker({
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
        $('#edtLeavePayPeriod').editableSelect('add','Weekly');
        $('#edtLeavePayPeriod').editableSelect('add','Fortnightly');
        $('#edtLeavePayPeriod').editableSelect('add','Twice Monthly');
        $('#edtLeavePayPeriod').editableSelect('add','Four Weekly');
        $('#edtLeavePayPeriod').editableSelect('add','Monthly');
        $('#edtLeavePayPeriod').editableSelect('add','Quarterly');
        $('#edtLeavePayStatus').editableSelect('add','Awaiting');
        $('#edtLeavePayStatus').editableSelect('add','Approved');
        $('#edtLeavePayStatus').editableSelect('add','Denied');

        $('#edtLeaveTypeofRequest').editableSelect();
        $('#edtLeaveTypeofRequest').editableSelect()
            .on('click.editable-select', async function (e, li) {
                let $search = $(this);
                let dropDownID = $search.attr('id')
                templateObject.currentDrpDownID.set(dropDownID);
                let offset = $search.offset();
                let searchName = e.target.value || '';
                if (e.pageX > offset.left + $search.width() - 8) { // X button 16px wide?
                    $('#assignLeaveTypeSettingsModal').modal('show');
                } else {
                    if (searchName.replace(/\s/g, '') == '') {
                        $('#assignLeaveTypeSettingsModal').modal('show');
                        return false
                    }
                    let dataObject = await getVS1Data('TAssignLeaveType');
                    if ( dataObject.length > 0) {
                        data = JSON.parse(dataObject[0].data);
                        let tAssignteavetype = data.tassignleavetype.filter((item) => {
                            if( item.fields.LeaveType == searchName ){
                                return item;
                            }
                        });

                        if( tAssignteavetype.length > 0 ){

                            let leaveCalcMethod = tAssignteavetype[0].fields.LeaveCalcMethod || '';

                            $('#leaveCalcMethodSelect').val(leaveCalcMethod)
                            switch(leaveCalcMethod){
                                case 'Manually Recorded Rate':
                                    $('#hoursLeave').val('');
                                    $('.handleLeaveTypeOption').addClass('hideelement');
                                    $('.manuallyRecordedRate').removeClass('hideelement');
                                    $('#hoursLeave').val(tAssignteavetype[0].fields.HoursLeave);
                                break;
                                case 'No Calculation Required':
                                    $('.handleLeaveTypeOption').addClass('hideelement')
                                break;
                                case 'Based on Ordinary Earnings':
                                    $('#hoursAccruedAnnuallyFullTimeEmp').val('');
                                    $('#hoursFullTimeEmpFortnightlyPay').val('');
                                    $('.handleLeaveTypeOption').addClass('hideelement');
                                    $('.basedonOrdinaryEarnings').removeClass('hideelement');
                                    $('#hoursAccruedAnnuallyFullTimeEmp').val(tAssignteavetype[0].fields.HoursAccruedAnnuallyFullTimeEmp);
                                    $('#hoursFullTimeEmpFortnightlyPay').val(tAssignteavetype[0].fields.HoursFullTimeEmpFortnightlyPay);
                                break;
                                default:
                                    $('#hoursAccruedAnnually').val('');
                                    $('.handleLeaveTypeOption').addClass('hideelement');
                                    $('.fixedAmountEachPeriodOption').removeClass('hideelement');
                                    $('#hoursAccruedAnnually').val(tAssignteavetype[0].fields.HoursAccruedAnnually);
                                break;
                            }

                            $('#leaveTypeSelect').val(tAssignteavetype[0].fields.LeaveType || '');
                            $('#leaveCalcMethodSelect').val(tAssignteavetype[0].fields.LeaveCalcMethod);
                            
                            $('#openingBalance').val(tAssignteavetype[0].fields.OpeningBalance);
                            $('#onTerminationUnusedBalance').prop("checked", tAssignteavetype[0].fields.OnTerminationUnusedBalance);
                            $("#eftLeaveType").prop('checked', tAssignteavetype[0].fields.EFTLeaveType)
                            $("#superannuationGuarantee").prop('checked', tAssignteavetype[0].fields.SuperannuationGuarantee)

                            $('#assignteavetypeID').val(tAssignteavetype[0].fields.ID) || 0 ;
                        }
                        $('#assignLeaveTypeModal').modal('show');
                    }
                }
            });
    }, 1000);

    $(document).on("click", "#tblAssignLeaveTypes tbody tr", function (e) {
        var table = $(this);
        let name = table.find(".colALTypeLeave").text()||'';
        let ID = table.find(".colALTypeID").text()||'';
        let searchFilterID = templateObject.currentDrpDownID.get()
        $('#' + searchFilterID).val(name);
        $('#' + searchFilterID + 'ID').val(ID);
        $('#assignLeaveTypeSettingsModal').modal('toggle');
    });

});