import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import '../imports/startup/client/serviceWorker.js';
// client/main.js
import './body.html';
import './Login/vs1_login.html';

import './vs1_templates/leave_confirm_script/leave_confirm_script.html';
// import './setup/setup.html';
import './js/vs1Login.js';
import './js/appPopRelogin.js';
import './Navigation/newsidenav.html';
import './Navigation/header.html';
import './popUps/supportpopup.html';
import './vs1_templates/global_search/vs1_global_search_modal.html';

import './js/newsidenav.js';
import './js/accesslevel-service.js';
import './js/account_settings.js';
//import './js/alertmessage.js';
import './js/Apptimer.js';
import './js/base-service.js';
import './js/Base64.js';
//import './js/cheque_card.js';
import './js/core-service.js';
import './js/country-service.js';
//import './js/email_settings.js';
import './js/employeepayroll-service.js';
// import './js/files.js';
//import './js/forgotpassword.js';
// import './js/frm_deposit.js';
// import './js/frm_journalentry.js';
import './js/header.js';
import './js/Logger.js';
import './js/mailchimp-service.js';
// import './js/new_bill.js';
// import './js/new_bom_temp.js';
// import './js/new_credit.js';
// import './js/new_invoice.js';
// import './js/new_process.js';
// import './js/new_processpop.js';
// import './js/new_purchaseorder.js';
// import './js/new_quote.js';
// import './js/new_salesorder.js';
// import './js/new_workorder.js';
import './js/ocr-service.js';
import './js/organisation-service.js';
// import './js/packagerenewal.js';
import './js/profile-service.js';
import './js/purchase-service.js';
// import './js/purchasedb.js';
import './js/ratetype_service.js';
// import './js/refundcard.js';
// import './js/register.js';
// import './js/registerdb.js';
// import './js/registersts.js';
// import './js/resetpassword.js';
import './js/sales-service.js';
import './js/sidebar-service.js';
// import './js/simonpurchasedb.js';
import './js/sms-settings-service.js';
// import './js/testLogin.js';
// import './js/vs1check.js';
// import './js/vs1greentracklogin.js';
import './js/header.js';
import './js/yodlee-service.js';
// import './lib/global/utBarcodeConst.js';
// import './setup/setup.html';
// import './setup/setup.js';


import './vs1_templates/vs1_video/vs1_login_video.html';
import './popUps/vs1_databasepopup.html';
import './Help_Form/help_advisor.html';
import './Help_Form/help_gotoforum.html';
import './route.js';

import './lib/global/globalfunction.js';
import './lib/global/utBarcodeConst.js';
// import '/imports/startup/client';


import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

//import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

Template.body.onCreated(function bodyOnCreated() {
    const templateObject = Template.instance();
    Meteor.subscribe('RegisterUsers');
    Meteor.subscribe('CloudDatabases');
    Meteor.subscribe('CloudUsers');
    Meteor.subscribe('ForgotPasswords');
    Meteor.subscribe('CloudPreferences');

    templateObject.isCloudSidePanelMenu = new ReactiveVar();
    templateObject.isCloudSidePanelMenu.set(false);
});

Template.body.onRendered(function() {
    const templateObject = Template.instance();
    let isSidePanel = Session.get('CloudSidePanelMenu');
    if (isSidePanel) {
        templateObject.isCloudSidePanelMenu.set(true);
        $("html").addClass("hasSideBar");
        $("body").addClass("hasSideBar");
    }
    // document.addEventListener('contextmenu', function(e) {
    // e.preventDefault();
    // });

    $(document).ready(function() {
        var loc = FlowRouter.current().path;
        if (loc == "/vs1greentracklogin") {
            document.title = 'GreenTrack';
            $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/greentrackIcon.png">');
        } else if (loc == "/") {
            document.title = 'VS1 Cloud';
            $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">');
        } else if (loc == "/registersts") {
            document.title = 'GreenTrack';
            $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/greentrackIcon.png">');
        }

        $("body").on("mouseenter", "#colContent", function() {
            if ($(".collapse.show")[0]) {

                $('.collapse').collapse('hide');
                // Do something if class exists
            }
        });

    });

});
Template.body.helpers({
    isCloudSidePanelMenu: () => {
        return Template.instance().isCloudSidePanelMenu.get();
    },
    isGreenTrack: function() {
        let checkGreenTrack = Session.get('isGreenTrack') || false;
        return checkGreenTrack;
    }
});
Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('notEquals', function (a, b) {
    return a != b;
});
