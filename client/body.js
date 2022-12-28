import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import '../imports/startup/client/serviceWorker.js';
// client/main.js
import './body.html';
import './Login/vs1_login.html';
// import './setup/setup.html';
import './js/vs1Login.js';

import './Navigation/newsidenav.html';
import './Navigation/header.html';
import './popUps/supportpopup.html';
import './vs1_templates/global_search/vs1_global_search_modal.html';


// import './lib/global/utBarcodeConst.js';
// import './setup/setup.html';
// import './setup/setup.js';


import './vs1_templates/vs1_video/vs1_login_video.html';
import './popUps/vs1_databasepopup.html';
import './Help_Form/help_advisor.html';
import './Help_Form/help_gotoforum.html';
import './route.js';
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
