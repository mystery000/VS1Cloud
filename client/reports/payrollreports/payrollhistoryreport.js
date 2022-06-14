import { ReportService } from "../report-service";
import 'jQuery.print/jQuery.print.js';
import { UtilityService } from "../../utility-service";

let reportService = new ReportService();
let utilityService = new UtilityService();

Template.payrollhistoryreport.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.dateAsAt = new ReactiveVar();
});

Template.payrollhistoryreport.onRendered(() => {

    const templateObject = Template.instance();

    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('#uploadedImage').attr('src', imageData);
        $('#uploadedImage').attr('width', '50%');
    }

    var today = moment().format('DD/MM/YYYY');
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();

    if ((currentDate.getMonth() + 1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }

    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }
    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

    templateObject.dateAsAt.set(begunDate);

    const dataTableList = [];
    const deptrecords = [];

    $("#date-input,#dateTo,#dateFrom").datepicker({
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
        onChangeMonthYear: function(year, month, inst) {
            $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
        }
    });

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

});

Template.payrollhistoryreport.events({

});

Template.payrollhistoryreport.helpers({
    dateAsAt: () =>{
        return Template.instance().dateAsAt.get() || '-';
    },
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});

Template.registerHelper('notEquals', function(a, b) {
    return a != b;
});

Template.registerHelper('containsequals', function(a, b) {
    return (a.indexOf(b) >= 0);
});
