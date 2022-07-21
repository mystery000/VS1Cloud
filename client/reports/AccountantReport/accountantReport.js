// import { ReportService } from "../report-service";
// import 'jQuery.print/jQuery.print.js';
import { UtilityService } from "../../utility-service";

import { OrganisationService } from "../../js/organisation-service";
import { CountryService } from "../../js/country-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../js/sidebar-service";
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();


// let reportService = new ReportService();
let utilityService = new UtilityService();

Template.accountant.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.countryList = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
});

Template.accountant.onRendered(() => {

    const templateObject = Template.instance();
    let countries = [];
    
    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('#uploadedImage').attr('src', imageData);
        $('#uploadedImage').attr('width', '50%');
    }

    var countryService = new CountryService();
    templateObject.getCountryData = function () {
        getVS1Data("TCountries")
          .then(function (dataObject) {
            if (dataObject.length == 0) {
              countryService.getCountry().then((data) => {
                for (let i = 0; i < data.tcountries.length; i++) {
                  countries.push(data.tcountries[i].Country);
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);
              });
            } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tcountries;
              for (let i = 0; i < useData.length; i++) {
                countries.push(useData[i].Country);
              }
              countries = _.sortBy(countries);
              templateObject.countryData.set(countries);
            }
          })
          .catch(function (err) {
            countryService.getCountry().then((data) => {
              for (let i = 0; i < data.tcountries.length; i++) {
                countries.push(data.tcountries[i].Country);
              }
              countries = _.sortBy(countries);
              templateObject.countryData.set(countries);
            });
          });
    };
    templateObject.getCountryData();
});

Template.accountant.events({
    // 'click #btnSummary': function() {
    //     FlowRouter.go('/customersummaryreport');
    // },
    // 'click .btnRefresh': function() {
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     localStorage.setItem('VS1CustomerDetails_Report', '');
    //     Meteor._reload.reload();
    // },
    // 'click .btnExportReport': function() {
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     let utilityService = new UtilityService();
    //     let templateObject = Template.instance();
    //     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    //     var dateTo = new Date($("#dateTo").datepicker("getDate"));

    //     let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    //     let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

    //     const filename = loggedCompany + '- Customer Details Report' + '.csv';
    //     utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
    //     let rows = [];
    // },
    // 'click .btnPrintReport': function(event) {

    //     let values = [];
    //     let basedOnTypeStorages = Object.keys(localStorage);
    //     basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
    //         let employeeId = storage.split('_')[2];
    //         return storage.includes('BasedOnType_') && employeeId == Session.get('mySessionEmployeeLoggedID')
    //     });
    //     let i = basedOnTypeStorages.length;
    //     if (i > 0) {
    //         while (i--) {
    //             values.push(localStorage.getItem(basedOnTypeStorages[i]));
    //         }
    //     }
    //     values.forEach(value => {
    //         let reportData = JSON.parse(value);
    //         reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
    //         if (reportData.BasedOnType.includes("P")) {
    //             if (reportData.FormID == 1) {
    //                 let formIds = reportData.FormIDs.split(',');
    //                 if (formIds.includes("225")) {
    //                     reportData.FormID = 225;
    //                     Meteor.call('sendNormalEmail', reportData);
    //                 }
    //             } else {
    //                 if (reportData.FormID == 225)
    //                     Meteor.call('sendNormalEmail', reportData);
    //             }
    //         }
    //     });

    //     document.title = 'Customer Details Report';
    //     $(".printReport").print({
    //         title: "Customer Details Report | " + loggedCompany,
    //         noPrintSelector: ".addSummaryEditor"
    //     })
    // },
    // 'keyup #myInputSearch': function(event) {
    //     $('.table tbody tr').show();
    //     let searchItem = $(event.target).val();
    //     if (searchItem != '') {
    //         var value = searchItem.toLowerCase();
    //         $('.table tbody tr').each(function() {
    //             var found = 'false';
    //             $(this).each(function() {
    //                 if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
    //                     found = 'true';
    //                 }
    //             });
    //             if (found == 'true') {
    //                 $(this).show();
    //             } else {
    //                 $(this).hide();
    //             }
    //         });
    //     } else {
    //         $('.table tbody tr').show();
    //     }
    // },
    // 'blur #myInputSearch': function(event) {
    //     $('.table tbody tr').show();
    //     let searchItem = $(event.target).val();
    //     if (searchItem != '') {
    //         var value = searchItem.toLowerCase();
    //         $('.table tbody tr').each(function() {
    //             var found = 'false';
    //             $(this).each(function() {
    //                 if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
    //                     found = 'true';
    //                 }
    //             });
    //             if (found == 'true') {
    //                 $(this).show();
    //             } else {
    //                 $(this).hide();
    //             }
    //         });
    //     } else {
    //         $('.table tbody tr').show();
    //     }
    // }
});

Template.accountant.helpers({
    countryList: () => {
        return Template.instance().countryData.get();
    },
});

// Template.registerHelper('equals', function(a, b) {
//     return a === b;
// });

// Template.registerHelper('notEquals', function(a, b) {
//     return a != b;
// });

// Template.registerHelper('containsequals', function(a, b) {
//     return (a.indexOf(b) >= 0);
// });
