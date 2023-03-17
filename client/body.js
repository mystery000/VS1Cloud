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
import './popUps/supportpopup.js';
import './vs1_templates/global_search/vs1_global_search_modal.html';

import './js/newsidenav.js';
import './js/accesslevel-service.js';
import './js/account_settings.js';
import './product/product-service.js';
import './utility-service.js';
//import './js/alertmessage.js';

import './js/Apptimer.js';
import './js/base-service.js';
import './js/Base64.js';
import './js/cheque_card.js';
import './js/core-service.js';
import './js/country-service.js';
//import './js/email_settings.js';
import './js/employeepayroll-service.js';
import './lib/global/indexdbstorage.js';
// import './js/files.js';
//import './js/forgotpassword.js';
import './js/frm_deposit.js';
import './js/frm_journalentry.js';
import './js/header.js';
import './js/Logger.js';
import './js/mailchimp-service.js';
import './js/new_bom_temp.js';
import './js/new_credit.js';
import './js/new_invoice.js';
import './js/new_process.js';
import './js/new_processpop.js';
import './js/new_purchaseorder.js';
import './js/new_quote.js';
import './js/new_salesorder.js';
import './js/new_workorder.js';
import './js/ocr-service.js';
import './js/organisation-service.js';
import './js/profile-service.js';
import './js/purchase-service.js';
// import './js/purchasedb.js';
import './js/ratetype_service.js';
import './js/refundcard.js';
import './js/register.js';
import './js/registerdb.js';
import './js/registersts.js';
import './js/resetpassword.js';
import './js/sales-service.js';
import './js/sidebar-service.js';
import '../collections/registerDB.js';
// import './js/simonpurchasedb.js';
import './js/sms-settings-service.js';
// import './js/testLogin.js';
// import './js/vs1check.js';
import './js/vs1greentracklogin.js';
import './js/header.js';
import './js/yodlee-service.js';
import './js/new_bom_setup.js';
// import './lib/global/utBarcodeConst.js';
// import './setup/setup.html';
// import './setup/setup.js';

import './eft/bankNameModal/bankNameModal.js';


import './vs1_templates/vs1_video/vs1_login_video.html';
import './popUps/vs1_databasepopup.html';
import './Help_Form/help_gotoforum.html';
import './Help_Form/help_button.html';
import './route.js';

import './lib/global/globalfunction.js';
import './lib/global/utBarcodeConst.js';
// import "../lib/global/indexdbstorage.js";
// import '/imports/startup/client';
// Transaction Header and Footer
import "./vs1_templates/transaction_temp/transaction_header/transaction_header.js"
import "./vs1_templates/transaction_temp/transaction_footer/index.js"

import './settings/email-settings/emailsettings.js';
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
import './vs1_templates/transaction_temp/transaction_button_top.html';
import './vs1_templates/transaction_temp/transaction_footer/index.js';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_save_button.html';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_print_button.html';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_attachment_button.html';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_remove_button.html';
import './vs1_templates/transaction_temp/transaction_footer/template_footer_cancel_button.html';
import './vs1_templates/transaction_temp/transaction_print_modal';
import './vs1_templates/vs1_textarea/vs1_textarea.html';
import "./vs1_templates/vs1_button/vs1_button.js";
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

import './accounts/expenseaccountlist.js';
import './accounts/inventoryassetaccountpop.js';

/* edit Roverto */

import './vs1_templates/init_form_page_script/init_form_page_script.html';
import './vs1_templates/draggable_panel/draggable_panel.html';
import './vs1_templates/transaction_temp/all_transaction_modals.html';
import './vs1_templates/kpi_card/kpi_card.html';
import './vs1_templates/kpi_card/kpi_card_title.html';
import './vs1_templates/kpi_card/kpi_card_body.html';
import './vs1_templates/kpi_card/kpi_card_single_value.html';
import './vs1_templates/contact_card_header/vs1_contact_card_header.html';
import './vs1_templates/toggle_button/toggle_button.html';
import './popUps/copyfrequencypop.js';
import './Template/AppTableModal.html';


import './vs1_templates/internal_transaction_list/internal_transaction_list_with_switchbox.js';
import './vs1charts/allCardsLists/allCardsLists.js';
import './vs1charts/allChartLists/allChartLists.js';
import './vs1charts/allCardsLists/bankingoverview/bankingoverviewcards.js';
import './vs1charts/allCardsLists/paymentoverview/paymentoverviewcards.js';
import './vs1charts/allCardsLists/crmoverviewcards/crmoverviewcards.js';
import './vs1charts/allCardsLists/purchasesoverviewcards/purchasesoverviewcards.js';
import './vs1charts/allCardsLists/stscards/stscards.js';
import './vs1charts/allCardsLists/shippingcards/shippingcards.js';
import './vs1charts/allCardsLists/paymentoverview/paymentoverviewcardssupplier.js';
import './vs1charts/allCardsLists/paymentoverview/paymentoverviewcardscustomer.js';
import './vs1charts/activeEmployees/activeEmployees.js';
import './vs1charts/top10Customers/top10Customers.js';
import './vs1charts/top10Suppliers/top10Suppliers.js';
import './vs1charts/activeEmployees/activeEmployees.js';
import './vs1charts/purchasesaleschart/purchasesaleschart.js';
import './popUps/departmentpop.js';
import './popUps/newdepartmentpop.js';
import './popUps/currnecypopup.js';
import './popUps/paymentmethodpopup.js';
import './popUps/newpaymentmethodpop.js';
import './popUps/termspopup.js';
import './popUps/newtermspopup.js';
import './popUps/clienttypepopup.js';
import './popUps/statuspop.js';
import './popUps/newstatuspop.js';
import './popUps/customfieldformpop.js';
import './popUps/serialnumberpop.js';
import './popUps/lotnumberpop.js';
import './popUps/availableserialnumberpop.js';
import './popUps/availablelotnumberpop.js';
import './popUps/shipviapop.js';
import './popUps/newshipvia.js';
import './popUps/dashboardoptionspopup.js';
import './accounts/accountlistpop.js';
import './accounts/addaccountpop.js';
import './eft/bankNameModal/bankNameModal.js';
import './settings/tax-rates-setting/newtaxratepop.js';
import './settings/xe-currencies/xe-currencies.js';
import './settings/clienttype-setting/clientypemodal.js';
import './settings/tax-rates-setting/taxratelistpop.js';
import './settings/tax-rates-setting/taxratedetailpop.js';
import './settings/UOM-Settings/uomlistpop.js';
import './packages/currency/modals/FxRateModal.js';
import './packages/currency/modals/CountryModal.js';
import './packages/currency/newcurrencypop.js';
import './contacts/employeelistpop.js';
import './contacts/customerlistpop.js';
import './contacts/global_customerlist.js';
import './contacts/supplierlistpop.js';
import './contacts/contactlistpop.js';
import './crm/components/taskDetailModal/taskDetailModal.js';
import './crm/components/newTaskModal/newTaskModal.js';
import './crm/components/projectListPop/projectListPop.js';
import './appointments/frmappointmentpop.js';
import './inventory/newproductpop.js';
import './inventory/payrollproductlistpop.js';
import './inventory/productlistpopwithcheckboxes.js';
import './inventory/employeeproductlistpop.js';
import './overviews/Modal/SelectPayCalendar.js';
import './overviews/bankingoverview.js';

import './basreturn/basreturn_list.js';
import './basreturn/frm_basreturn.js';
import './basreturn/basreturntransactionlist.js';
import './vatreturn/vatreturn_list.js';
import './vatreturn/frm_vatreturn.js';
import './vatreturn/vatreturntransactionlist.js';
import './overviews/contactoverview.js';
import './contacts/addCustomer.js';
import './contacts/addSupplier.js';
import './contacts/addLead.js';
import './contacts/addEmployee.js';
import './popUps/layoutpop.js';
import './settings/service-checker/serviceChecker.js';

/* Riley*/
import './accounts/addApcaModal/addApcaModal.html';
/* Riley*/

/* Tinyiko */
import './settings/subscription-settings/subscription.js';
import './contacts/popemployeelist.js';
import './overviews/accountsoverview.js';
import './overviews/Modal/AddAccountModal.js';
import './overviews/purchaseOverview.js';
import './eft/optionsModal/eftOptionsModal.js';
import './eft/bankCodesModal/eftBankCodesModal.js';
import './vs1charts/accountrevenuestreams/accountrevenuestreams.js';
import './settings/template-settings/templatesettings.js';
import './accesslevel/accesslevel.js';
import './accesslevel/featureallocation.html';
import './accounts/chartsofaccounts/chartofaccounts.html';
// import './accounts/account-service.js';
// import './packages/currency/CurrencyRate.js';
import './vs1_templates/transaction_temp/transaction_print_modal.js';
import './vs1_templates/transaction_temp/transaction_calculation.js';
import './manufacture/bomList.js';
import './fixedassets/fixedassets.js';
// import './settings/chart-accounts-setting/chart-accounts.js';
// import './settings/chart-accounts-setting/chart-account-settings-table.js';
import './settings/edi-integrations/edi-integrations.js';
import './settings/fixed-asset_edit-asset-type/fixed-asset_edit-asset-type.js';
import './settings/fxupdate/fxUpdateSettings.js';
import './settings/linktrueerp/linkTrueERP.js';
import './settings/mailchimp-settings/mailchimpSettings.js';
import './shipping/shippinglist.js';
import './stocktake/add-new-stock-adjust/stockadjustadd.js';
import './timesheetdetail/timesheetdetail.js';
import './journalEntry/journalentry_list.js';
import './manufacture/processList.js';
import './vs1shipping/shippingoverview.js';
import './vs1shipping/shippingdocket.js';
import './deposits/deposit_list.js';
import './vs1_templates/dashboard_options/dashboard_options.html';
/* Tinyiko */

/* Rasheed */
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { _ } from 'meteor/underscore';
import 'datatables.net-responsive-bs4';
import './lib/global/globalShipping.js';
import './lib/global/soundalert.js';
import './js/packagerenewal.js';
import './Navigation/onsuccesswaterfall.js';
import './Help_Form/help_advisor.js';
import './js/Table/TableHandler.js';
import "./vs1_templates/vs1filteroptions/customfiltersdropdownbutton.js";
import "./vs1_templates/vs1filteroptions/customfiltersmodal.js";
/* Rasheed */

/* Jeyhun */

import 'datatables.net';
import 'datatables.net-buttons';
import 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.print.min.mjs';
import 'datatables.net-bs4/js/dataTables.bootstrap4.min.mjs';
import 'datatables.net-responsive/js/dataTables.responsive.min.mjs'
import 'datatables.net-responsive-bs4/js/responsive.bootstrap4.min.mjs'
import './vs1_templates/datatablelist/datatablelist.js'

import './manufacture/workorderList.js';
import './manufacture/manufacturing_dashboard.js';
import './vs1charts/mfgPlanner/mfgPlannerchart.js';
import './settings/manufacturingsettings/manufacturingsettings.js';
import './vs1_templates/drop_down/vs1___dropdown.js';
import './manufacture/bomlistpop.js';
import './vs1_templates/transaction_temp/transaction_header/transactionheader.js';
import './vs1_templates/transaction_temp/transaction_header/components/customerselector/customerselector.js';
/* Jeyhun */

/* DevTop/Dev Pioneer */
import './vs1_templates/report/accountant_header.js';
import './reports/AccountantReport/accountantCompany.js';
import './reports/AccountantReport/accountantCompanyastrustee.js';
import './reports/AccountantReport/accountantFinancialstatement.js';
import './reports/AccountantReport/accountantIndividual.js';
import './reports/AccountantReport/accountantPartnershipnontrading.js';
import './reports/AccountantReport/accountantSelfmanagedsuperfund.js';
import './reports/AccountantReport/accountantSingledirector.js';
import './reports/AccountantReport/accountantSoletradernontrading.js';
import './reports/AccountantReport/accountantTrust.js';
import './reports/AccountantReport/accountantTrustnontrading.js';
import './reports/allreports.js';
/* DevTop/Dev Pioneer */

/* Matthias */
import './inventory/inventory.js';
import './inventory/inventorylist.js';
import './inventory/productlist.js';
import './inventory/productview.js';
import './inventory/inventorypopups/onBackOrderPopUp.js';
import './inventory/inventorypopups/onOrderPopUp.js';
import './inventory/inventorypopups/onSalesOrderPopUp.js';
/* Matthias */

/* Sasa */
import './Dashboard/Dashboard.js';
import './Dashboard/dashboardCardCharts/dashboardCardCharts.js';
import './Dashboard/my-tasks-widget/my-tasks-widget.js';
import './contacts/addcustomerpop.js';
import './Dashboard/Dashboardexe.js';
import './vs1charts/quotedsalesorderinvoicedamounts/quotedsalesorderinvoicedamounts.js';
import './vs1charts/invstockonhandanddemand/invstockonhandanddemand.js';
import './vs1charts/monthlyearnings/monthlyearnings.js';
import './vs1charts/quotedinvoicedamounts/quotedinvoicedamounts.js';
import './vs1charts/employeecompletedjobs/employeecompletedjobs.js';
import './vs1charts/clockedOnEmployees/clockedOnEmployees.js';
import './vs1charts/monthlyearnings/monthlyearnings.js';
import './vs1charts/monthllyexpenses/monthllyexpenses.js';
import './vs1charts/expensebreakdown/expensebreakdown.js';
import './vs1charts/absenteeRate/absenteeRate.js';
import './Dashboard/dashboard-manager-charts/dashboard-manager-charts.js';
import './Dashboard/dashboard-sales-charts/dashboard-sales-charts.js';
import './Dashboard/Dashboardsales.js';
import './Dashboard/DashboardSalesManager.js';
import './Dashboard/dashboard-manager-cards/dashboard-manager-cards.js';
import './Dashboard/dashboard-sales-cards/dashboard-sales-cards.js';
import './Dashboard/appointments-widget/ds-appointments-widget.js';
import './vs1charts/leadlist/dsleadlistchart.js';
import './vs1charts/opportunitiesStatus/opportunitiesStatus.js';
import './vs1charts/leadlist/dsmleadlistchart.js';
import './eft/eft.js';
import './vs1charts/bankaccountschart/bankaccountschart.js';
import './vs1charts/accountslist/accountslistchart.js';
import './vs1charts/crmleadchart/crmleadchart.js';
/* Sasa */

/* Martin */
import './contacts/addcustomerpop.js';
import './contacts/addsupplierpop.js';
import './reconciliation/importModal/reconImportModal.js';
import './reconciliation/accounttransactions.js';
import './reconciliation/bankrecon.js';
import './reconciliation/bankrecon2.js';
import './reconciliation/bankrulelist.js';
import './reconciliation/newbankrecon.js';
import './reconciliation/newbankrule.js';
import './reconciliation/newreconrule.js';
import './reconciliation/reconciliation.js';
import './reconciliation/reconciliationlist.js';
import './reconciliation/reconrulelist.js';
import './inventory/departmentModal/departmentModal.js';
import './inventory/binNumberPopups/addBinNumberPop.js';
import './inventory/binNumberPopups/binNumberListPop.js';
import './settings/inventory-setting/inventorySettings.js';
import './settings/UOM-Settings/adduompop.js';
/* Martin */

/* AlexV */
import './reports/balancesheet/balancesheet.js';
import './reports/customerreports/customerdetailsreport.js';
import './reports/customerreports/customersummaryreport.js';
import './reports/supplierreports/supplierdetail.js';
import './reports/supplierreports/supplierproductreport.js';
import './reports/supplierreports/supplierreport.js';
import './reports/supplierreports/suppliersummary.js';
import './reports/fxreports/fxhistorylist.js';
import './reports/jobreports/jobprofitabilityreport.js';
import './reports/jobreports/jobsalessummary.js';
import './reports/stockreports/stockmovementreport.js';
import './reports/stockreports/stockquantitybylocation.js';
import './reports/stockreports/stockvaluereport.js';
import './reports/agedpayables/agedpayablessummary.js';
import './reports/agedreceivables/agedreceivablessummary.js';
import './reports/printstatement/printstatement.js';
import './reports/payrollreports/leaveaccruedreport.js';
import './reports/payrollreports/payrollhistoryreport.js';
import './reports/payrollreports/payrollleavetaken.js';
import './reports/payrollreports/timesheetsummary.js';
import './reports/sales/salessummaryreport.js';
import './reports/1099report/1099report.js';

import './inventory/lotnumberlist.js';
import './inventory/serialnumberlist.js';
import './inventory/stockadjustment/stockadjustmentoverview.js';
import './cheque/cheque_list.js';
import './settings/paymentmethod-setting/paymentmethods.js';
import './salesorder/salesorder_express_list_tables.js';
import './payroll/timesheet/timesheet.js';
import './overviews/Modal/AddPayRunModal.js';
/* Alex */

/*Vladyslav*/
import './packages/currency/CurrencyWidget.js';
import './contacts/customerlist.js';
import './contacts/supplierlist.js';
import './contacts/leadlist.js';
import './contacts/employeelist.js';
import './contacts/addemployeepop.js';
import './packages/currency/currencydropdown.js';
import './accesslevel/accessleveldup.js';
import './accesslevel/companyappsettingsdup.js';
import './accesslevel/companyappsettings.js';
import './settings/payroll-settings/earningsRate.js';
import './settings/payroll-settings/deductions.js';
import './settings/payroll-settings/superannuation.js';
import './settings/payroll-settings/reimbursement.js';
import './settings/payroll-settings/leaveTypes.js';
import './contacts/assignLeaveTypePop.js';
import './vs1_templates/contact_title/contact_title.html';
import './vs1charts/employeeAbsentDays/employeeAbsentDays.js';
import './vs1charts/employeeLeave/employeeLeave.js';
/*Vladyslav*/

/* Roverto */
import './manufacture/mobile/main.js';
import './basreturn/departmentOptionModal.js';
import './Dashboard/appointments-widget/dsm-appointments-widget.js';
import './crm/crm.js';
import './crm/components/help-modal.html';
import './crm/components/projectTasksModal/projectTasksModal.html';
import './crm/components/editProjectModal/editProjectModal.html';
import './crm/components/newProjectModal/newProjectModal.html';
import './crm/components/moveToProjectModal/moveToProjectModal.html';
import './crm/components/newLabelModal/newLabelModal.html';
import './crm/components/editLabelModal/editLabelModal.html';
import './crm/mailchimpReport/mailchimp-modal.html';
import './crm/components/leadBarChart/leadbarchart.js';
import './crm/components/crm_top_menu/top-menu.js';
import './crm/components/campaignReport/campaignReport.js';
import './crm/allTasksTab/alltaskdatatable.js';
import './crm/mailchimpReport/mailchimp-add-campaign-moda.js';
import './crm/mailchimpReport/mailchimpList.js';
import './settings/leadstatus-setting/leadstatus.js';
import './settings/leadstatus-setting/leadstatusmodal.js';
import './contacts/joblist.js';
import './receipts/receiptclaims.js';
import './receipts/tripgroup.js';
import './receipts/receiptcategory.js';
import './settings/settings.js';
import './settings/tax-rates-setting/tax-rates.js';
import './settings/tax-rates-setting/subtaxes.js';
import './settings/tax-rates-setting/DeleteLineModal.html';
import './overviews/paymentoverview.js';
import './payments/customerAwaitingPayments.js';
import './payments/customerpayment.js';
import './payments/supplierpayment.js';
import './payments/supplierAwaitingPurchaseOrder.js';
import './contacts/statementlist.js';
import './reports/balancesheet/balancetransactionlist.js';
import './inventory/serialnumberview.js';
import './popUps/deleteprogresspopup.js';
import './reports/profitandloss/nplEditLayoutScreenModal.js';
import './reports/profitandloss/nplAddGroupScreenModal.js';
import './popUps/editServiceCheckerModal.js';
import './vs1_templates/transaction_temp/transaction_grid/transactiongrid.js';
import './payroll/clockonoff/employeeclockonoff.js';
import './reports/buildcost/buildcostreport';
import './reports/worksheet/worksheetreport.js';
/* Roverto */

/* Kelvin More */
import './js/new_bill.js';
import './eft/exportModal/eftExportModal.js';
import './eft/transactionDescriptionModal/transactionDescriptionModal.js';
import './eft/addNewEftModal/addNewEftModal.js';
import 'jquery-editable-select';
import './inventory/stockadjustment/frm_stockAdjustment.js';
import './stocktransfer/stocktransfercard.js';
import './stocktransfer/stocktransferlist.js';
import './payments/paymentcard/paymentcard.js';
import './settings/tax-rates-setting/addnew-taxrate.js';
import './settings/tax-rates-setting/AddTaxRateModal.html';
import './overviews/salesoverview.js';
import './vs1_templates/date_picker/daterangefromto_trans.js';
import './fixedassets/components/costtypelistpop/costtypelistpop.js';
import './vs1_templates/vs1_input/default_input.html';
import './vs1_templates/vs1_select/default_select.html'
/* Kelvin More */

/* Stefan */
import './packages/currency/FxCurrencyHistory.js';
import './packages/currency/FxGlobalFunctions.js';
import './vs1_templates/transaction_list/transaction_list.js';

// import 'datatables.net';
// import 'datatables.net-bs';
// import 'datatables.net-dt';
// import 'datatables.net-buttons/js/dataTables.buttons.js';
// import 'datatables.net-buttons-dt';
// import 'datatables.net-buttons/js/buttons.colVis.js';
// import 'datatables.net-buttons/js/buttons.flash.js';
// import 'datatables.net-buttons/js/buttons.html5.js';
// import 'datatables.net-buttons/js/buttons.print.js';
import "datatables.net-colreorder";
// import "datatables.net-fixedheader";
// import "datatables.net-fixedcolumns";
// import "datatables.net-select";

import '../public/js/cdnjs/pdfmake.min.js';
import '../public/js/cdnjs/split.min.js';
import '../public/js/cdnjs/jszip.min.js';
import '../public/js/cdnjs/vfs_fonts.js';
import './vs1_templates/title_list_pop/title_list_pop.js';
import './expenseclaim/expenseclaims.html';
/* Stefan */

/* Arthlo */
import './js/Api/Model/PayrollSettingsOvertimes.js';
import './vs1_templates/transaction_temp/transaction_line.js';
import './invoice/invoice_express_list_tables.js';
import './invoice/invoice_express_listBO_tables.js';
import './invoice/invoiceemail.js';
import './quote/quote_express_list_tables.js';
import './refunds/refunds_list.js';
import './bills/bill_list.js';
import './credit/credit_list.js';
import './purchase/purchaseorder_express_list_tables.js';
import './purchase/purchaseorderbo_express_list_tables.js';
import './purchase/purchase-service.js';
import './fixedassets/components/fixedassetlistpop/fixedassetlistpop.js';
/* Arthlo */

/* Colton */
import './appointments/appointments.js';
import './appointments/appointmentlist.js';
import './appointments/appointment-service.js';
import './appointments/appointmenttimelist.js';
import './overviews/Modal/newLeaveRequest.js';
import './vs1_templates/calender/calender.js';
/* Colton */

/* Andrew */
import './settings/clienttype-setting/clienttype.js';
import './settings/department-setting/departments.js';
import './settings/term-setting/term.js';
import './settings/UOM-Settings/uomsettings.js';
import './settings/adp/adp.js';
import './settings/mail-chimp/mail-chimp.js';
import './settings/paychex/paychex.js';
import './settings/receipt-claims/receipt-claims.js';
import './settings/edi-sms-settings/edi-sms-settings.js';
import './settings/true-erp/true-erp.js';
import './settings/yoodle-developer/yoodle-developer.js';
import './settings/organisation-setting/organisation_settings.js';
import './settings/backup-settings/backuprestore.js';
import './settings/currencies-setting/_frequencyModal.js';
import './settings/currencies-setting/currencies.js';
import './vs1charts/monthlyprofitandloss/monthlyprofitandloss.js';
import './vs1charts/resalescomparision/resalescomparision.js';
import './vs1charts/expenses/expenseschart.js';
import './vs1charts/top10Customers/dsm_top10Customers.js';
import './vs1charts/resalescomparision/dsm_resalescomparision.js';
/* Andrew */

/* XiaoJang*/
import './overviews/payrolloverview.js';
import './overviews/payrollleave.js';
import './payroll/singletouchpayroll/singletouch.js';
import './payroll/singletouchpayroll/singletouchpayroll.js';
import './payroll/clockonoff/clockonoff.js';
import './payroll/paychexapi/paychexapi.js';
import './payroll/payrun/payrun.js';
import './payroll/payrun/payrundetails.js';
import './overviews/payrolloverview_tmp.html';
import './eft/exportModal/eftExportModal.js';
import './eft/transactionDescriptionModal/transactionDescriptionModal.js';
import './eft/addNewEftModal/addNewEftModal.js';

import './reports/transactionjournal/transactionjournal.js';
/* XiaoJang*/

/* Scott */
import './vs1_templates/template_buttons/spreadsheet_link.js';
import './reports/executivesummary/executivesummary.js';
import './reports/exebalancesheet/exebalancesheet.js';
import './reports/execash/execash.js';
import './reports/exeincome/exeincome.js';
import './reports/exeperformance/exeperformance.js';
import './reports/exeposition/exeposition.js';
import './reports/exeprofitability/exeprofitability.js';
// import './reconciliation/newstatementrule.js';
// import './vs1_templates/template_buttons/report_export_import_print_display_button.js';
/* Scott */

/* Mainstar */
import './inventory/binlocations/binlocations.js';
/* Mainstar */

/* Damien Begin */
import './vs1_templates/transaction_type_modal/transaction_type_modal.js'
/* Damien End */

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
    let isSidePanel = localStorage.getItem('CloudSidePanelMenu');
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
        let checkGreenTrack = localStorage.getItem('isGreenTrack') || false;
        return checkGreenTrack;
    }
});
Template.registerHelper('equals', function(a, b) {
    return a === b;
});

Template.registerHelper('notEquals', function(a, b) {
    return a != b;
});
