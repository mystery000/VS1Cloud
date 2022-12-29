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
import './product/product-service.js';
import './utility-service';
//import './js/alertmessage.js';
import './js/Apptimer.js';
import './js/base-service.js';
import './js/Base64.js';
//import './js/cheque_card.js';
import './js/core-service.js';
import './js/country-service.js';
//import './js/email_settings.js';
import './js/employeepayroll-service.js';
import './lib/global/indexdbstorage.js';
// import './js/files.js';
//import './js/forgotpassword.js';
// import './js/frm_deposit.js';
// import './js/frm_journalentry.js';
import './js/header.js';
import './js/Logger.js';
import './js/mailchimp-service.js';
// import './js/new_bill.js';
import './js/new_bom_temp.js';
// import './js/new_credit.js';
// import './js/new_invoice.js';
// import './js/new_process.js';
import './js/new_processpop.js';
import './js/new_purchaseorder.js';
// import './js/new_quote.js';
import './js/new_salesorder.js';
import './js/new_workorder.js';
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

import './accounts/accountlistpop.js';
import './accounts/addaccountpop.js';


import './eft/bankNameModal/bankNameModal.js';


import './vs1_templates/vs1_video/vs1_login_video.html';
import './popUps/vs1_databasepopup.html';
import './Help_Form/help_advisor.html';
import './Help_Form/help_gotoforum.html';
import './Help_Form/help_button.html';
import './route.js';

import './lib/global/globalfunction.js';
import './lib/global/utBarcodeConst.js';
// import '/imports/startup/client';
import './settings/email-settings/emailsettings.js';
import './settings/xe-currencies/xe-currencies.js';
import './settings/payroll-settings/payrollrules.js';
import './settings/payroll-settings/ratetypelistpop.js';
import './settings/payroll-settings/grouptype.js';
import './settings/payroll-settings/addratetype.js';
import './settings/payroll-settings/fundtypelist.js';


import './vs1_templates/template_buttons/export_import_print_display_button.js';
import './vs1_templates/non_transactional_list/non_transactional_list.js';
import './vs1_templates/import_template/import_template.html';
import './vs1_templates/report/vs1_report_template.js';
import './vs1_templates/loggedcompanyoverview/loggedcompanyoverview.js';
import './vs1_templates/date_picker/daterangedropdownoption.js';
import './vs1_templates/date_picker/daterangefromto.js';
import './vs1_templates/print_templates/custom_print_template.html';
import './vs1_templates/print_templates/preview_header1.html';
import './vs1_templates/print_templates/preview_header2.html';
import './vs1_templates/print_templates/preview_header3.html';
import './vs1_templates/print_templates/preview_body1.html';
import './vs1_templates/print_templates/preview_body2.html';
import './vs1_templates/print_templates/preview_body3.html';
import './vs1_templates/print_templates/preview_footer1.html';
import './vs1_templates/print_templates/preview_footer2.html';
import './vs1_templates/print_templates/preview_footer3.html';
import './vs1_templates/date_picker/single_date_picker.html';
import './vs1_templates/transaction_temp/transaction_header/transaction_header.js';
import './vs1_templates/transaction_temp/transaction_header/modals/help_modal.html';
import './vs1_templates/transaction_temp/transaction_header/modals/files_viewer_modal.html';
import './vs1_templates/transaction_temp/transaction_header/components/customer_selector.html';
import './vs1_templates/transaction_temp/transaction_header/components/customer_email_input.html';
import './vs1_templates/transaction_temp/transaction_header/components/sale_date_selector.html';
import './vs1_templates/transaction_temp/transaction_header/components/po_number_input.html';
import './vs1_templates/transaction_temp/transaction_header/components/default_input.html';
import './vs1_templates/transaction_temp/transaction_button_top.html';
import './vs1_templates/transaction_temp/transaction_footer/index.js';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_save_button.html';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_print_button.html';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_attachment_button.html';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_remove_button.html';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_cancel_button.html';
import './vs1_templates/transaction_temp/transaction_print_modal';
import './vs1_templates/vs1_textarea/vs1_textarea.html';
import './vs1_templates/drop_down/vs1_dropdown.html';
import './vs1_templates/attachments/vs1_attachments.js';
import './vs1_templates/init_form_page_script/init_form_page_script.html'
import './popUps/customfieldDroppop.html';
import './popUps/customfieldpop.js';
import './popUps/deletepop.js';

import './pdfTemplates/bill_pdf_temp.js';
import './pdfTemplates/cheque_pdf_temp.js';
import './pdfTemplates/credit_pdf_temp.js';
import './pdfTemplates/invoice_pdf_temp.js';
import './pdfTemplates/payments_pdf_temp.js';
import './pdfTemplates/purchaseorder_pdf_temp.js';
import './pdfTemplates/qutoes_pdf_temp.js';
import './pdfTemplates/refund_pdf_temp.js';
import './pdfTemplates/salesorder_pdf_temp.js';
import './pdfTemplates/statement_pdf_temp';
import './pdfTemplates/supplierpayment_pdf_temp.js';

import './reports/agedpayables/agedpayables.js';
import './reports/agedreceivables/agedreceivables.js';
import './reports/profitandloss/new_profit.js';
import './reports/generalledger/generalledger.js';
import './reports/sales/productsalesreport.js';
import './reports/purchasesreport/purchasesreport.js';
import './reports/purchasesreport/purchasesummaryreport.js';
import './reports/sales/salesreport.js';
import './reports/tax/taxsummaryreport.js';
import './reports/trialbalance/trialbalance.js';
import './reports/poweredby.html';

import './packages/currency/FxRatesButton.js';
import './packages/currency/modals/FxRateModal.js';
import './salesorder/salesorderlistpop.js';
import './inventory/productlistpop.js';
import './manufacture/processListPopup.js';
import './manufacture/production_planner.js';

import './accounts/accountlistpop.js';
import './accounts/expenseaccountlist.js';
import './accounts/inventoryassetaccountpop.js';

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
