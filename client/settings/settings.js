import {
    ReactiveVar
} from 'meteor/reactive-var';
import { OrganisationService } from "../js/organisation-service";
let organisationService = new OrganisationService();

Template.settings.onRendered(function () {

    let isFxCurrencyLicence = Session.get('CloudUseForeignLicence');

    setTimeout(function () {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) {
                $("#settingsCard").removeClass("col-8");
                $("#settingsCard").addClass("col-12");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 500);


    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('#uploadedImage').attr('src', imageData);
        $('#uploadedImage').attr('width', '160');
        $('#uploadedImage').attr('height', '50%');
    }
});

Template.settings.events({
    'click .btnOrganisationSettings': function (event) {
        //window.open('/organisationSettings','_self');
        FlowRouter.go('/organisationsettings');
    },
    'click .btnAccessLevel': function (event) {
        FlowRouter.go('/accesslevel');
    },
    'click .btnCompanyAppSettings': function (event) {
        FlowRouter.go('/companyappsettings');
    },
    'click .btnReportsAccountant': function (event) {
        FlowRouter.go('/reportsAccountantSettings');
    },
    'click .btnCustomerType': function (event) {
        FlowRouter.go('/clienttypesettings');
    },
    'click .btncurrenciesSettings': function (event) {
        FlowRouter.go('/currenciessettings');
    },
    'click .btntaxRatesSettings': function (event) {
        FlowRouter.go('/taxratesettings');
        // $('.fullScreenSpin').css('display', 'inline-block');
        // organisationService.getChkUSRegionTaxSetting().then(function (dataListRet) {
        //     let mainData = dataListRet.tcompanyinfo[0];
        //     $('.fullScreenSpin').css('display', 'none');
        //     if (mainData.ChkUSRegionTax || mainData.Country == "United States") {
        //         FlowRouter.go('/subtaxsettings');
        //     } else {
        //         FlowRouter.go('/taxratesettings');
        //     }
        // }).catch(function(err) {
        //     $('.fullScreenSpin').css('display', 'none');
        //     FlowRouter.go('/taxratesettings');
        // });
    },
    'click .btnDepartmentSettings': function (event) {
        FlowRouter.go('/departmentSettings');
    },
    'click .btnpaymentMethodSettings': function (event) {
        FlowRouter.go('/paymentmethodSettings');
    },
    'click .btnTermsSettings': function (event) {
        FlowRouter.go('/termsettings');
    },
    'click .btnSubcription': function (event) {
        FlowRouter.go('/subscriptionSettings');
    },
    'click .btnSetupWizard': function (event) {
        FlowRouter.go('/setup');
    },
    'click .btnBackupRestore': function (event) {
        FlowRouter.go('/backuprestore');
    },
    'click .btnPayrollSettings': function (event) {
        FlowRouter.go('/payrollrules');
    },
    'click .btnEmailSettings': function (event) {
        FlowRouter.go('/emailsettings');
    },
    'click .btnSmsSettings': function (event) {
        FlowRouter.go('/smssettings');
    },
    'click .btnTemplates': function (event) {
        FlowRouter.go('/templatesettings');
    },
    'click .btnUomSettings': function (event) {
        FlowRouter.go('/uomSettings');
    },
    'click .btnEDIIntegrations': function(event) {
        FlowRouter.go('/settings/edi-integrations');
    }
});

Template.settings.helpers({
    checkFXCurrency: () => {
        return Session.get('CloudUseForeignLicence');
    },
    isGreenTrack: function () {
        let checkGreenTrack = Session.get('isGreenTrack') || false;
        return checkGreenTrack;
    }
});
