import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { ReportService } from "../../reports/report-service";
import TableHandler from '../../js/Table/TableHandler';
import moment from 'moment';
let sideBarService = new SideBarService();
let reportService = new ReportService();
let utilityService = new UtilityService();
Template.vs1_report_template.inheritsHooksFrom('export_import_print_display_button');

// Template.vs1_report_template.inheritsHelpersFrom('generalledger');
// Template.vs1_report_template.inheritsEventsFrom('generalledger');
// Template.vs1_report_template.inheritsHooksFrom('generalledger');

Template.vs1_report_template.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.tablename = new ReactiveVar();
    templateObject.tabledisplayname = new ReactiveVar();
    templateObject.transactiondatatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();
    templateObject.report_displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);
    templateObject.isAccountingMoreOption = new ReactiveVar();
    templateObject.isTaxCodeOption = new ReactiveVar();
    // templateObject.dateAsAt = new ReactiveVar();
});

Template.vs1_report_template.onRendered(function() {
  let templateObject = Template.instance();

  templateObject.initUploadedImage = () => {
    let imageData = localStorage.getItem("Image");
    if (imageData) {
      $("#uploadedImage").attr("src", imageData);
      $("#uploadedImage").attr("width", "50%");
      $("#uploadedImage2").attr("src", imageData);
      $("#uploadedImage2").attr("width", "50%");
    }
  };

  templateObject.initUploadedImage();

  var url = FlowRouter.current().path;
  let currenttablename = "";
  let displaytablename = "";
  templateObject.isAccountingMoreOption.set(false);
  templateObject.isTaxCodeOption.set(false);
  if (url.includes("/taxsummaryreport")) {
    templateObject.isAccountingMoreOption.set(true);
    templateObject.isTaxCodeOption.set(true);
  };

  currenttablename = templateObject.data.tablename||"";
  displaytablename = templateObject.data.tabledisplayname||"";

  templateObject.tablename.set(currenttablename);
  templateObject.tabledisplayname.set(displaytablename);

  // set initial table rest_data
  templateObject.init_reset_data = function(){
    let reset_data = [];
    switch (currenttablename) {
      case "tblgeneralledger":
        reset_data = [
          { index: 1, label: 'Date', class:'colAccountNo', active: true, display: true, width: "" },
          { index: 2, label: 'Account Name', class:'colDate', active: true, display: true, width: "" },
          { index: 3, label: 'Type', class:'colClientName', active: true, display: true, width: "" },
          { index: 4, label: 'Department', class:'colType', active: false, display: true, width: "" },
          { index: 5, label: 'Debits (Ex)', class:'colDebits', active: false, display: true, width: "" },
          { index: 6, label: 'Credits (Ex)', class:'colCredit', active: false, display: true, width: "" },
          { index: 7, label: 'Debits (Inc)', class:'colDebits', active: true, display: true, width: "" },
          { index: 8, label: 'Credits (Inc)', class:'colCredit', active: true, display: true, width: "" },
          { index: 9, label: 'Amount (Ex)', class:'colDebits', active: true, display: true, width: "" },
          { index: 10, label: 'Amount (Inc)', class:'colCredit', active: true, display: true, width: "" },
          { index: 11, label: 'Product ID', class:'colCredit', active: false, display: true, width: "" },
          { index: 12, label: 'Product Description', class:'colCredit', active: false, display: true, width: "" },
          { index: 13, label: 'Client Name', class:'colCredit', active: true, display: true, width: "" },
          { index: 14, label: 'Rep Name', class:'colCredit', active: false, display: true, width: "" },
          { index: 15, label: 'Accounts', class:'colCredit', active: false, display: true, width: "" },
          { index: 16, label: 'Global Ref', class:'colCredit', active: false, display: true, width: "" },
          { index: 17, label: 'Account Number', class:'colCredit', active: true, display: true, width: "" },
          { index: 18, label: 'Tax Code', class:'colCredit', active: false, display: true, width: "150" },
          { index: 19, label: 'Tax Rate', class:'colCredit', active: false, display: true, width: "" },
          { index: 20, label: 'Class ID', class:'colCredit', active: false, display: true, width: "" },
          { index: 21, label: 'Sale ID', class:'colCredit', active: false, display: true, width: "" },
          { index: 22, label: 'Purchase Order ID', class:'colCredit', active: false, display: true, width: "" },
          { index: 23, label: 'Payment ID', class:'colCredit', active: false, display: true, width: "" },
          { index: 24, label: 'Details', class:'colCredit', active: false, display: true, width: "" },
          { index: 25, label: 'Account ID', class:'colCredit', active: false, display: true, width: "" },
          { index: 26, label: 'FixedAsset ID', class:'colCredit', active: false, display: true, width: "" },
          { index: 27, label: 'Check Number', class:'colCredit', active: false, display: true, width: "" },
          { index: 28, label: 'Memo', class:'colCredit', active: false, display: true, width: "" },
          { index: 29, label: 'Ref No', class:'colCredit', active: false, display: true, width: "" },
          { index: 30, label: 'PrepaymentID', class:'colCredit', active: false, display: true, width: "" },
        ];
        break;
        case "taxSummary":
          reset_data = [
            { index: 1, label: 'TaxCode', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'INPUTS Ex (Purchases)', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'INPUTS Inc (Purchases)', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'OUTPUTS Ex  (Sales)', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'OUTPUTS Inc (Sales)', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Total Net', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Total Tax', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'TaxRate', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Total Tax1', class:'colAccountName', active: false, display: true, width: "" },
            { index: 10, label: 'ID', class:'colAccountName', active: false, display: true, width: "" },
          ]
          break;
      case "tblBalanceSheet":
        reset_data = [
          { index: 1, label: 'Account Tree', class:'colAccountNo', active: true, display: true, width: "86" },
          { index: 2, label: 'Account No', class:'colDate', active: true, display: true, width: "86" },
          { index: 3, label: 'Sub-Account-Totals', class:'colClientName', active: true, display: true, width: "192" },
          { index: 4, label: 'Header-Account-Totals', class:'colType', active: true, display: true, width: "137" },
          { index: 5, label: 'Total Current~Assets &~Liabilities', class:'colDebits', active: true, display: true, width: "85" },
          { index: 6, label: 'Total ~Assets &~Liabilities', class:'colCredit', active: true, display: true, width: "85" },
          
          { index: 7, label: 'ID', class:'colAmount', active: false, display: true, width: "85" },
          { index: 8, label: 'SortID', class:'colAmount', active: false, display: true, width: "85" },
          { index: 9, label: 'TypeID', class:'colAmount', active: false, display: true, width: "85" },
          { index: 10, label: 'ACCNAME', class:'colAmount', active: false, display: true, width: "85" },
        ]
        break;
        case "trialbalance":
          reset_data = [
            { index: 1, label: 'Account Name', class:'colAccountNo', active: true, display: true, width: "86" },
            { index: 2, label: 'Account Number', class:'colDate', active: true, display: true, width: "86" },
            { index: 3, label: 'Account', class:'colClientName', active: true, display: true, width: "192" },
            { index: 4, label: 'Credits (Ex)', class:'colType', active: true, display: true, width: "137" },
            { index: 5, label: 'Credits (Inc)', class:'colDebits', active: true, display: true, width: "85" },
            { index: 6, label: 'Debits (Ex)', class:'colCredit', active: true, display: true, width: "85" }, 
            { index: 7, label: 'Debits (Inc)', class:'colAmount', active: true, display: true, width: "85" },
            { index: 8, label: 'Account Name Only', class:'colAmount', active: false, display: true, width: "85" },
            { index: 9, label: 'TransID', class:'colAmount', active: false, display: true, width: "85" },
          ]
          break;
      case "customerdetailsreport":
        reset_data = [
          { index: 1, label: 'Company Name', class:'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Rep', class:'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Discount Type', class:'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Discount', class:'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Special Discount', class:'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Orig Price', class:'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Line Price', class:'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Description', class:'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'Sub Group', class:'colAccountName', active: true, display: true, width: "" },
          { index: 11, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Dept', class:'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'Customer ID', class:'colAccountName', active: false, display: true, width: "" },
          { index: 14, label: 'Password', class:'colAccountName', active: false, display: true, width: "" },
          { index: 15, label: 'Test', class:'colAccountName', active: false, display: true, width: "" },
          { index: 16, label: 'Birthday', class:'colAccountName', active: false, display: true, width: "" },
        ]
        break;
        case "customersummaryreport":
          reset_data = [
            { index: 1, label: 'Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Phone', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Rep', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Invoice Number', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'SaleDate', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'DueDate', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Total Amount (Ex)', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Total Amount (Inc)', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Gross Profit', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Margin', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: 'Address', class:'colAccountName', active: true, display: true, width: "" },
            { index: 13, label: 'Address 2', class:'colAccountName', active: true, display: true, width: "" },
            { index: 14, label: 'Suburb', class:'colAccountName', active: true, display: true, width: "" },
            { index: 15, label: 'Postcode', class:'colAccountName', active: true, display: true, width: "" },
            { index: 16, label: 'State', class:'colAccountName', active: true, display: true, width: "" },
            { index: 17, label: 'FaxNumber', class:'colAccountName', active: true, display: true, width: "" },
            { index: 18, label: 'Sale ID', class:'colAccountName', active: false, display: true, width: "" },
            { index: 19, label: 'Customer ID', class:'colAccountName', active: false, display: true, width: "" },
            { index: 20, label: 'Address 3', class:'colAccountName', active: false, display: true, width: "" },
            { index: 21, label: 'Country', class:'colAccountName', active: false, display: true, width: "" },
            { index: 22, label: 'Details', class:'colAccountName', active: false, display: true, width: "" },
            { index: 23, label: 'Client ID', class:'colAccountName', active: false, display: true, width: "" },
            { index: 24, label: 'Markup', class:'colAccountName', active: false, display: true, width: "" },
            { index: 25, label: 'Last Sale Date', class:'colAccountName', active: false, display: true, width: "" },
            { index: 26, label: 'Gross Profit(Ex)', class:'colAccountName', active: false, display: true, width: "" },
            { index: 27, label: 'Customer Type', class:'colAccountName', active: false, display: true, width: "" },
            { index: 28, label: 'Email', class:'colAccountName', active: false, display: true, width: "" },
            { index: 29, label: 'Total Cost', class:'colAccountName', active: false, display: true, width: "" },
          ]
          break;
          case "trialbalance":
            reset_data = [
              { index: 1, label: 'Account Name', class:'colAccountNo', active: true, display: true, width: "86" },
              { index: 2, label: 'Account Number', class:'colDate', active: true, display: true, width: "86" },
              { index: 3, label: 'Account', class:'colClientName', active: true, display: true, width: "192" },
              { index: 4, label: 'Credits (Ex)', class:'colType', active: true, display: true, width: "137" },
              { index: 5, label: 'Credits (Inc)', class:'colDebits', active: true, display: true, width: "85" },
              { index: 6, label: 'Debits (Ex)', class:'colCredit', active: true, display: true, width: "85" }, 
              { index: 7, label: 'Debits (Inc)', class:'colAmount', active: true, display: true, width: "85" },
              { index: 8, label: 'Account Name Only', class:'colAmount', active: false, display: true, width: "85" },
              { index: 9, label: 'TransID', class:'colAmount', active: false, display: true, width: "85" },
            ]
            break;
        case "customerdetailsreport":
          reset_data = [
            { index: 1, label: 'Company Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Rep', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Discount Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Discount', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Special Discount', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Orig Price', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Line Price', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Description', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Sub Group', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: 'Dept', class:'colAccountName', active: true, display: true, width: "" },
            { index: 13, label: 'Customer ID', class:'colAccountName', active: false, display: true, width: "" },
            { index: 14, label: 'Password', class:'colAccountName', active: false, display: true, width: "" },
            { index: 15, label: 'Test', class:'colAccountName', active: false, display: true, width: "" },
            { index: 16, label: 'Birthday', class:'colAccountName', active: false, display: true, width: "" },
          ]
          break;
        case "supplierdetail":
          reset_data = [
            { index: 1, label: 'Supplier ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Contact Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Phone', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Mobile', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Fax Number', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'AR Balance', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'AP Balance', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Balance', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Street', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Suburb', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'State', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: 'Postcode', class:'colAccountName', active: true, display: true, width: "" },
            { index: 13, label: 'Country', class:'colAccountName', active: true, display: true, width: "" },
            { index: 14, label: 'Bank Account Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 15, label: 'Bank Account BSB', class:'colAccountName', active: true, display: true, width: "" },
            { index: 16, label: 'Bank Account No', class:'colAccountName', active: true, display: true, width: "" },
            { index: 17, label: 'Creation Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 18, label: 'Active', class:'colAccountName', active: true, display: true, width: "" },
            { index: 19, label: 'Global Ref', class:'colAccountName', active: false, display: true, width: "" },
            { index: 20, label: 'Street2', class:'colAccountName', active: false, display: true, width: "" },
            { index: 21, label: 'Street3', class:'colAccountName', active: false, display: true, width: "" },
            { index: 22, label: 'No Staff', class:'colAccountName', active: false, display: true, width: "" },
            { index: 23, label: 'Min Inv value', class:'colAccountName', active: false, display: true, width: "" },
            { index: 24, label: 'Freight to Store', class:'colAccountName', active: false, display: true, width: "" },
            { index: 25, label: 'Rebate', class:'colAccountName', active: false, display: true, width: "" },
            { index: 26, label: 'First Name', class:'colAccountName', active: false, display: true, width: "" },
            { index: 27, label: 'Last Name', class:'colAccountName', active: false, display: true, width: "" },
            { index: 28, label: 'Contact Details', class:'colAccountName', active: false, display: true, width: "" },
            { index: 29, label: 'ABN', class:'colAccountName', active: false, display: true, width: "" },
            { index: 30, label: 'Print Name', class:'colAccountName', active: false, display: true, width: "" },
            { index: 31, label: 'ClientID', class:'colAccountName', active: false, display: true, width: "" },
          ]
          break;
        case "supplierproductreport":
          reset_data = [
            { index: 1, label: 'PO #', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'PO Num', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Supplier ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Invoice~Number', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Description', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Tax', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Street', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Inc', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Tax Code', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: 'Ordered', class:'colAccountName', active: true, display: true, width: "" },
            { index: 13, label: 'Received', class:'colAccountName', active: true, display: true, width: "" },
            { index: 14, label: 'Back Order', class:'colAccountName', active: true, display: true, width: "" },
            { index: 15, label: 'ETA~Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 16, label: 'Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 17, label: 'Inc', class:'colAccountName', active: true, display: true, width: "" },
            { index: 18, label: 'Comments', class:'colAccountName', active: true, display: true, width: "" },
            { index: 19, label: 'Original #', class:'colAccountName', active: true, display: true, width: "" },
            { index: 20, label: 'Global #', class:'colAccountName', active: true, display: true, width: "" },
            { index: 21, label: 'Sales~Comments', class:'colAccountName', active: true, display: true, width: "" },
            { index: 22, label: 'Class Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 23, label: 'Account~Number', class:'colAccountName', active: true, display: true, width: "" },
            { index: 24, label: 'Account Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 25, label: 'Product~Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 26, label: 'Department', class:'colAccountName', active: true, display: true, width: "" },
            { index: 27, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 28, label: 'Manufacturer', class:'colAccountName', active: true, display: true, width: "" },
            { index: 29, label: 'Deleted', class:'colAccountName', active: true, display: true, width: "" },
            { index: 30, label: 'Order Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 31, label: 'Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 32, label: 'Tax', class:'colAccountName', active: true, display: true, width: "" },
            { index: 33, label: 'Inc', class:'colAccountName', active: true, display: true, width: "" },
            { index: 34, label: 'Employee~Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 35, label: 'Buy Metre', class:'colAccountName', active: true, display: true, width: "" },
            { index: 36, label: 'Buy Weight', class:'colAccountName', active: true, display: true, width: "" },
            { index: 37, label: 'Buy Price / Metre', class:'colAccountName', active: true, display: true, width: "" },
            { index: 39, label: 'Docket~Number', class:'colAccountName', active: true, display: true, width: "" },
            { index: 40, label: 'Received~Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 41, label: 'Barcode', class:'colAccountName', active: true, display: true, width: "" },
            { index: 42, label: 'Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 43, label: 'Inc', class:'colAccountName', active: true, display: true, width: "" },
            { index: 44, label: 'Cogs', class:'colAccountName', active: true, display: true, width: "" },
            { index: 45, label: 'Asset', class:'colAccountName', active: true, display: true, width: "" },        
            { index: 46, label: 'Income', class:'colAccountName', active: true, display: true, width: "" },
            { index: 47, label: 'Cogs', class:'colAccountName', active: true, display: true, width: "" },
            { index: 48, label: 'Asset', class:'colAccountName', active: true, display: true, width: "" },
            { index: 49, label: 'Income', class:'colAccountName', active: true, display: true, width: "" },    
          ]
          break;
          case "supplierdetail":
            reset_data = [
              { index: 1, label: 'Supplier ID', class:'colAccountName', active: true, display: true, width: "" },
              { index: 2, label: 'Contact Name', class:'colAccountName', active: true, display: true, width: "" },
              { index: 3, label: 'Phone', class:'colAccountName', active: true, display: true, width: "" },
              { index: 4, label: 'Mobile', class:'colAccountName', active: true, display: true, width: "" },
              { index: 5, label: 'Fax Number', class:'colAccountName', active: true, display: true, width: "" },
              { index: 6, label: 'AR Balance', class:'colAccountName', active: true, display: true, width: "" },
              { index: 7, label: 'AP Balance', class:'colAccountName', active: true, display: true, width: "" },
              { index: 8, label: 'Balance', class:'colAccountName', active: true, display: true, width: "" },
              { index: 9, label: 'Street', class:'colAccountName', active: true, display: true, width: "" },
              { index: 10, label: 'Suburb', class:'colAccountName', active: true, display: true, width: "" },
              { index: 11, label: 'State', class:'colAccountName', active: true, display: true, width: "" },
              { index: 12, label: 'Postcode', class:'colAccountName', active: true, display: true, width: "" },
              { index: 13, label: 'Country', class:'colAccountName', active: true, display: true, width: "" },
              { index: 14, label: 'Bank Account Name', class:'colAccountName', active: true, display: true, width: "" },
              { index: 15, label: 'Bank Account BSB', class:'colAccountName', active: true, display: true, width: "" },
              { index: 16, label: 'Bank Account No', class:'colAccountName', active: true, display: true, width: "" },
              { index: 17, label: 'Creation Date', class:'colAccountName', active: true, display: true, width: "" },
              { index: 18, label: 'Active', class:'colAccountName', active: true, display: true, width: "" },
              { index: 19, label: 'Global Ref', class:'colAccountName', active: false, display: true, width: "" },
              { index: 20, label: 'Street2', class:'colAccountName', active: false, display: true, width: "" },
              { index: 21, label: 'Street3', class:'colAccountName', active: false, display: true, width: "" },
              { index: 22, label: 'No Staff', class:'colAccountName', active: false, display: true, width: "" },
              { index: 23, label: 'Min Inv value', class:'colAccountName', active: false, display: true, width: "" },
              { index: 24, label: 'Freight to Store', class:'colAccountName', active: false, display: true, width: "" },
              { index: 25, label: 'Rebate', class:'colAccountName', active: false, display: true, width: "" },
              { index: 26, label: 'First Name', class:'colAccountName', active: false, display: true, width: "" },
              { index: 27, label: 'Last Name', class:'colAccountName', active: false, display: true, width: "" },
              { index: 28, label: 'Contact Details', class:'colAccountName', active: false, display: true, width: "" },
              { index: 29, label: 'ABN', class:'colAccountName', active: false, display: true, width: "" },
              { index: 30, label: 'Print Name', class:'colAccountName', active: false, display: true, width: "" },
              { index: 31, label: 'ClientID', class:'colAccountName', active: false, display: true, width: "" },
            ]
            break;
        case "jobsalessummary":
          reset_data = [
            { index: 1, label: 'Customer ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Contact Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Job Customer Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Job Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Sale Date Time', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Sale Total Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Sale Amount Inc', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Sale Tax', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Sale Cust Field1', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Sale Cust Field2', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Sale Cust Field3', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: 'Sale Cust Field4', class:'colAccountName', active: true, display: true, width: "" },
            { index: 13, label: 'Sale Cust Field5', class:'colAccountName', active: true, display: true, width: "" },
            { index: 14, label: 'Sale Cust Field6', class:'colAccountName', active: true, display: true, width: "" },
            { index: 15, label: 'Sale Cust Field7', class:'colAccountName', active: true, display: true, width: "" },
            { index: 16, label: 'Sale Cust Field8', class:'colAccountName', active: true, display: true, width: "" },
            { index: 17, label: 'Sale Cust Field9', class:'colAccountName', active: true, display: true, width: "" },
            { index: 18, label: 'Sale Cust Field10', class:'colAccountName', active: true, display: true, width: "" },
            { index: 19, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 20, label: 'Uom Qty Shipped', class:'colAccountName', active: true, display: true, width: "" },
            { index: 21, label: 'Uom Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 22, label: 'Amount Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 23, label: 'Amount Inc', class:'colAccountName', active: true, display: true, width: "" },
            { index: 24, label: 'Amount Tax', class:'colAccountName', active: true, display: true, width: "" },
            { index: 25, label: 'Tax Code', class:'colAccountName', active: true, display: true, width: "" },
            { index: 26, label: 'Amount Discount', class:'colAccountName', active: true, display: true, width: "" },
            { index: 27, label: 'Discount Per Unit', class:'colAccountName', active: true, display: true, width: "" },
            { index: 28, label: 'DetailType', class:'colAccountName', active: false, display: true, width: "" },
            { index: 29, label: 'CustomerID', class:'colAccountName', active: false, display: true, width: "" },
            { index: 30, label: 'ClientNo', class:'colAccountName', active: false, display: true, width: "" },
            { index: 31, label: 'CustomerType', class:'colAccountName', active: false, display: true, width: "" },
            { index: 32, label: 'CustomerStreet', class:'colAccountName', active: false, display: true, width: "" },
            { index: 33, label: 'CustomerStreet2', class:'colAccountName', active: false, display: true, width: "" },
            { index: 34, label: 'CustomerStreet3', class:'colAccountName', active: false, display: true, width: "" },
            { index: 35, label: 'Suburb', class:'colAccountName', active: false, display: true, width: "" },
            { index: 36, label: 'State', class:'colAccountName', active: false, display: true, width: "" },
            { index: 37, label: 'CustomerPostcode', class:'colAccountName', active: false, display: true, width: "" },
            { index: 39, label: 'JobID', class:'colAccountName', acticve: false, display: true, width: "" },
            { index: 40, label: 'JobClientNo', class:'colAccountName', active: false, display: true, width: "" },
            { index: 41, label: 'JobRegistration', class:'colAccountName', active: false, display: true, width: "" },
            { index: 42, label: 'JobNumber', class:'colAccountName', active: false, display: true, width: "" },
            { index: 43, label: 'JobWarrantyPeriod', class:'colAccountName', active: false, display: true, width: "" },
            { index: 44, label: 'JobNotes', class:'colAccountName', active: false, display: true, width: "" },
            { index: 45, label: 'SaleCustomerName', class:'colAccountName', active: false, display: true, width: "" },        
            { index: 46, label: 'SaleDate', class:'colAccountName', active: false, display: true, width: "" },
            { index: 47, label: 'SaleDepartment', class:'colAccountName', active: false, display: true, width: "" },
            { index: 48, label: 'SaleComments', class:'colAccountName', active: false, display: true, width: "" },
            { index: 49, label: 'SaleTerms', class:'colAccountName', active: false, display: true, width: "" },    
            { index: 50, label: 'SaleCustomerName', class:'colAccountName', active: false, display: true, width: "" },        
            { index: 51, label: 'DocketNumber', class:'colAccountName', active: false, display: true, width: "" },
            { index: 52, label: 'MemoLine', class:'colAccountName', active: false, display: true, width: "" },
            { index: 53, label: 'UomQtySold', class:'colAccountName', active: false, display: true, width: "" },
            { index: 54, label: 'UomQtyBackorder ', class:'colAccountName', active: false, display: true, width: "" },   
          ]
          break;
        case "jobprofitabilityreport":
          reset_data = [
            { index: 1, label: 'Company Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Job Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Job Number', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Txn Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Txn No', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Cost Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Income Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Quoted Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Diff Inc Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: '%Diff Inc By Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Diff Inc Quote', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: '%Diff Inc By Quote', class:'colAccountName', active: true, display: true, width: "" },
            { index: 13, label: 'Backorders', class:'colAccountName', active: true, display: true, width: "" },
            { index: 14, label: 'Account Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 15, label: 'Debit Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 16, label: 'Credit Ex', class:'colAccountName', active: true, display: true, width: "" },
            { index: 17, label: 'Profit %', class:'colAccountName', active: true, display: true, width: "" },
            { index: 18, label: 'Department', class:'colAccountName', active: true, display: true, width: "" },
            { index: 19, label: 'Product', class:'colAccountName', active: true, display: true, width: "" },
            { index: 20, label: 'Sub  Group', class:'colAccountName', active: true, display: true, width: "" },
            { index: 21, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 22, label: 'Dept', class:'colAccountName', active: true, display: true, width: "" },
            { index: 23, label: 'Area', class:'colAccountName', active: true, display: true, width: "" },
            { index: 24, label: 'Landed Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 25, label: 'Latestcost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 26, label: 'First Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 27, label: 'Last Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 28, label: 'Diff Inc Landedcost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 29, label: '%Diff Inc By Landedcost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 30, label: 'Diff Inc Latestcost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 31, label: '%Diff Inc By Latestcost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 32, label: 'Ordered', class:'colAccountName', active: true, display: true, width: "" },
            { index: 33, label: 'Shipped', class:'colAccountName', active: true, display: true, width: "" },
            { index: 34, label: 'Back Ordered', class:'colAccountName', active: true, display: true, width: "" },
            { index: 35, label: 'CUSTFLD1', class:'colAccountName', active: true, display: true, width: "" },
            { index: 36, label: 'CUSTFLD2', class:'colAccountName', active: true, display: true, width: "" },
            { index: 37, label: 'CUSTFLD3', class:'colAccountName', active: true, display: true, width: "" },
            { index: 39, label: 'CUSTFLD4', class:'colAccountName', acticve: true, display: true, width: "" },
            { index: 40, label: 'CUSTFLD5', class:'colAccountName', active: true, display: true, width: "" },
            { index: 41, label: 'CUSTFLD6', class:'colAccountName', active: true, display: true, width: "" },
            { index: 42, label: 'CUSTFLD7', class:'colAccountName', active: true, display: true, width: "" },
            { index: 43, label: 'CUSTFLD8', class:'colAccountName', active: true, display: true, width: "" },
            { index: 44, label: 'JobNotes', class:'colAccountName', active: true, display: true, width: "" },
            { index: 45, label: 'CUSTFLD9', class:'colAccountName', active: true, display: true, width: "" },        
            { index: 46, label: 'CUSTFLD10', class:'colAccountName', active: true, display: true, width: "" },
            { index: 47, label: 'CUSTFLD11', class:'colAccountName', active: true, display: true, width: "" },
            { index: 48, label: 'CUSTFLD12', class:'colAccountName', active: true, display: true, width: "" },
            { index: 49, label: 'CUSTFLD13', class:'colAccountName', active: true, display: true, width: "" },    
            { index: 50, label: 'CUSTFLD14', class:'colAccountName', active: true, display: true, width: "" },        
            { index: 51, label: 'CUSTFLD15', class:'colAccountName', active: true, display: true, width: "" },
            { index: 52, label: 'Profit $', class:'colAccountName', active: true, display: true, width: "" },
          ]
          break;
        case "binlocationslist":
          reset_data = [
            { index: 1, label: 'Department', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Location', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Bin Number', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Volume Total', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Volume Used', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Volume Available', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Active', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'GlobalRef', class:'colAccountName', active: false, display: true, width: "" },
            { index: 9, label: 'BinID', class:'colAccountName', active: false, display: true, width: "" },
            { index: 10, label: 'ClassID', class:'colAccountName', active: false, display: true, width: "" },
          ]
          break;
        case "stockmovementreport":
          reset_data = [
            { index: 1, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'No', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Opening', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Current', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Running', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Unit Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Total Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Unit Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Total Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Department Name', class:'colAccountName', active: false, display: true, width: "" },
            { index: 12, label: 'TransDate', class:'colAccountName', active: false, display: true, width: "" },
            { index: 13, label: 'Actual Date', class:'colAccountName', active: false, display: true, width: "" },
            { index: 14, label: 'Sub Group', class:'colAccountName', active: false, display: true, width: "" },
            { index: 15, label: 'Type', class:'colAccountName', active: false, display: true, width: "" },
            { index: 16, label: 'Dept', class:'colAccountName', active: false, display: true, width: "" },
          ]
          break;
          case "stockquantitybylocation":
          reset_data = [
            { index: 1, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Parts Description', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Department', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'UOM', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Manufacture', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Dept', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Batch No', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Expiry Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Location', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'No', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Serial~No', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: 'Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 13, label: 'Value', class:'colAccountName', active: true, display: true, width: "" },
            { index: 14, label: 'Sales Order', class:'colAccountName', active: true, display: true, width: "" },
            { index: 15, label: 'In-Stock', class:'colAccountName', active: true, display: true, width: "" },
            { index: 16, label: 'If read as UOM', class:'colAccountName', active: true, display: true, width: "" },
            { index: 17, label: 'Multiplier', class:'colAccountName', active: true, display: true, width: "" },
            { index: 18, label: 'If read as Units', class:'colAccountName', active: true, display: true, width: "" },
            { index: 19, label: 'If read as Units', class:'colAccountName', active: true, display: true, width: "" },
            { index: 20, label: 'Multiplier', class:'colAccountName', active: true, display: true, width: "" },
            { index: 21, label: 'If read as UOM', class:'colAccountName', active: true, display: true, width: "" },
            { index: 22, label: 'In-Stock', class:'colAccountName', active: true, display: true, width: "" },
            { index: 23, label: 'Sales Order', class:'colAccountName', active: true, display: true, width: "" },
            { index: 24, label: 'Available', class:'colAccountName', active: true, display: true, width: "" },
            { index: 25, label: 'UOMMultiplier', class:'colAccountName', active: false, display: true, width: "" },
            { index: 26, label: 'Unit Volume', class:'colAccountName', active: false, display: true, width: "" },
            { index: 27, label: 'Volume~ Available Qty', class:'colAccountName', active: false, display: true, width: "" },
            { index: 28, label: 'Volume~ Instock Qty', class:'colAccountName', active: false, display: true, width: "" },
            { index: 29, label: 'Part Type', class:'colAccountName', active: false, display: true, width: "" },
            { index: 30, label: 'Truck Load No', class:'colAccountName', active: false, display: true, width: "" },
            { index: 31, label: 'Expiry Date', class:'colAccountName', active: false, display: true, width: "" },
            { index: 32, label: 'SOQty', class:'colAccountName', active: false, display: true, width: "" },
            { index: 33, label: 'Instock Qty', class:'colAccountName', active: false, display: true, width: "" },
            { index: 34, label: 'Allocated UOMQty', class:'colAccountName', active: false, display: true, width: "" },
            { index: 35, label: 'Allocated SOUOMQty', class:'colAccountName', active: false, display: true, width: "" },
            { index: 36, label: 'Allocated In Stock UOMQty', class:'colAccountName', active: false, display: true, width: "" },
            { index: 37, label: 'Bin', class:'colAccountName', active: false, display: true, width: "" },
            { index: 39, label: 'Batch', class:'colAccountName', acticve: false, display: true, width: "" },
            { index: 39, label: 'SN', class:'colAccountName', acticve: false, display: true, width: "" },
            { index: 40, label: 'Preferred Supplier', class:'colAccountName', active: false, display: true, width: "" },
            { index: 41, label: 'Print Name', class:'colAccountName', active: false, display: true, width: "" },
          ]
          break;
        case "stockvaluereport":
          reset_data = [
            { index: 1, label: 'Department Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Trans Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Qty', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Running Qty', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Unit Cost~When Posted', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Todays Unit~Avg Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Total Cost~When Posted', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Todays Total~Avg Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Trans Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Transaction No', class:'colAccountName', active: false, display: true, width: "" },
            { index: 12, label: 'Opening', class:'colAccountName', active: false, display: true, width: "" },
            { index: 13, label: 'Actual Date', class:'colAccountName', active: false, display: true, width: "" },
            { index: 14, label: 'Sub Group', class:'colAccountName', active: false, display: true, width: "" },
            { index: 15, label: 'Type', class:'colAccountName', active: false, display: true, width: "" },
            { index: 16, label: 'Dept', class:'colAccountName', active: false , display: true, width: "" },  
          ]
          break;
        case "payrollhistory":
          reset_data = [
            { index: 1, label: 'LastName', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'FirstName', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'G/L', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Date Paid', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Gross', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Tax', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Wages', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Commission', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Deductions', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Allowances', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'CDEP', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Sundries', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: 'Superannuation', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: 'ClassName', class:'colAccountName', active: true, display: true, width: "" },
            { index: 13, label: 'PayPeriod', class:'colAccountName', active: true, display: true, width: "" },
            { index: 14, label: 'PayNo', class:'colAccountName', active: true, display: true, width: "" },
            { index: 15, label: 'Splits', class:'colAccountName', active: true, display: true, width: "" },
            { index: 16, label: 'Deleted', class:'colAccountName', active: true, display: true, width: "" },
            { index: 17, label: 'Global Ref', class:'colAccountName', active: false, display: true, width: "" },
            { index: 18, label: 'Employee Name', class:'colAccountName', active: false, display: true, width: "" },
            { index: 19, label: 'Pay Date', class:'colAccountName', active: false, display: true, width: "" },
            { index: 20, label: 'Pay Periods', class:'colAccountName', active: false, display: true, width: "" },
            { index: 21, label: 'Salary Sacrifice', class:'colAccountName', active: false, display: true, width: "" },
            { index: 22, label: 'Workplacegiving', class:'colAccountName', active: false, display: true, width: "" },
            { index: 23, label: 'Net Comb', class:'colAccountName', active: false, display: true, width: "" },
            { index: 24, label: 'Net Only', class:'colAccountName', active: false, display: true, width: "" },
            { index: 25, label: 'Paid', class:'colAccountName', active: false, display: true, width: "" },
            { index: 26, label: 'Pay', class:'colAccountName', active: false, display: true, width: "" },
            { index: 27, label: 'Test staff', class:'colAccountName', active: false, display: true, width: "" },
            { index: 28, label: 'Customer ID Tax', class:'colAccountName', active: false, display: true, width: "" },
            { index: 29, label: 'PAYG Tax', class:'colAccountName', active: false, display: true, width: "" },
            { index: 30, label: 'BSB', class:'colAccountName', active: false, display: true, width: "" },
            { index: 31, label: 'BankAccNo', class:'colAccountName', active: false, display: true, width: "" },
            { index: 32, label: 'Employee ID', class:'colAccountName', active: false, display: true, width: "" },
          ]
          break;
        case "PayrollLeaveAccrued":
          reset_data = [
            { index: 1, label: 'Accrued Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Leave Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Employee', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Pay No', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Accrued Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Hours', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Value', class:'colAccountName', active: true, display: true, width: "" },
          ]
        break;
        case "tblpayrollLeaveTaken":
          reset_data = [
            { index: 1, label: 'Employee Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Pay Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Date Taken', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Leave Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Hours', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Is Certified', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Pay ID', class:'colAccountName', active: false, display: true, width: "" },
            { index: 8, label: 'Employee ID', class:'colAccountName', active: false, display: true, width: "" },
          ]
        break;
        case "tblTimeSheetSummary":
          reset_data = [
            { index: 1, label: 'Entry Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 2, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
            { index: 3, label: 'Entered by', class:'colAccountName', active: true, display: true, width: "" },
            { index: 4, label: 'Job', class:'colAccountName', active: true, display: true, width: "" },
            { index: 5, label: 'Timesheet Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 6, label: 'Hours', class:'colAccountName', active: true, display: true, width: "" },
            { index: 7, label: 'Active', class:'colAccountName', active: true, display: true, width: "" },
            { index: 8, label: 'Total', class:'colAccountName', active: true, display: true, width: "" },
            { index: 9, label: 'Employee Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 10, label: 'Labour Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 11, label: 'Department Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 12, label: 'Service Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 13, label: 'Service Date', class:'colAccountName', active: true, display: true, width: "" },
            { index: 14, label: 'Charge Rate', class:'colAccountName', active: true, display: true, width: "" },
            { index: 15, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 16, label: 'Product Description', class:'colAccountName', active: true, display: true, width: "" },
            { index: 17, label: 'Use Time Cost', class:'colAccountName', active: true, display: true, width: "" },
            { index: 18, label: 'Tax', class:'colAccountName', active: true, display: true, width: "" },
            { index: 19, label: 'Pay Rate Type Name', class:'colAccountName', active: true, display: true, width: "" },
            { index: 20, label: 'Hourly Rate', class:'colAccountName', active: true, display: true, width: "" },
            { index: 21, label: 'Super Inc', class:'colAccountName', active: true, display: true, width: "" },
            { index: 22, label: 'Super Amount', class:'colAccountName', active: true, display: true, width: "" },
            { index: 23, label: 'Notes', class:'colAccountName', active: true, display: true, width: "" },
            { index: 24, label: 'Qty', class:'colAccountName', active: true, display: true, width: "" },
            { index: 25, label: 'Equipment', class:'colAccountName', active: true, display: true, width: "" },
            { index: 26, label: 'Total Service Charge', class:'colAccountName', active: true, display: true, width: "" },
            { index: 27, label: 'Timesheet Entry ID', class:'colAccountName', active: true, display: true, width: "" },
            { index: 28, label: 'Repair #', class:'colAccountName', active: true, display: true, width: "" },
            { index: 29, label: 'Area', class:'colAccountName', active: false, display: true, width: "" },
            { index: 30, label: 'ContactName', class:'colAccountName', active: false, display: true, width: "" },
          ]
          break;
      default:
        break;
    }
    templateObject.reset_data.set(reset_data);
  }
   templateObject.init_reset_data();

  // custom field displaysettings

  templateObject.initCustomFieldDisplaySettings = function(data, listType){
    //function initCustomFieldDisplaySettings(data, listType) {
      let templateObject = Template.instance();
      let reset_data = templateObject.reset_data.get();
      templateObject.showCustomFieldDisplaySettings(reset_data);

      try {
        /*
        getVS1Data("VS1_Customize").then(function (dataObject) {
          if (dataObject.length == 0) {
            sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')), listType).then(function (data) {
                reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
                templateObject.showCustomFieldDisplaySettings(reset_data);
            }).catch(function (err) {
            });
          } else {
            let data = JSON.parse(dataObject[0].data);
            if(data.ProcessLog.Obj.CustomLayout.length > 0){
             for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
               if(data.ProcessLog.Obj.CustomLayout[i].TableName == listType){
                 reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
                 templateObject.showCustomFieldDisplaySettings(reset_data);
               }
             }
           };
          }
        });
        */
      } catch (error) {
      }
      return;
    }
    templateObject.showCustomFieldDisplaySettings = async function(reset_data){
      let custFields = [];
      let customData = {};
      let customFieldCount = reset_data.length;

      for (let r = 0; r < customFieldCount; r++) {
        customData = {
          active: reset_data[r].active,
          id: reset_data[r].index,
          custfieldlabel: reset_data[r].label,
          class: reset_data[r].class,
          display: reset_data[r].display,
          width: reset_data[r].width ? reset_data[r].width : ''
        };

        // if(reset_data[r].active == true){
        //   $('#'+currenttablename+' .'+reset_data[r].class).removeClass('hiddenColumn');
        // }else if(reset_data[r].active == false){
        //   $('#'+currenttablename+' .'+reset_data[r].class).addClass('hiddenColumn');
        // };
        custFields.push(customData);
      }
      await templateObject.report_displayfields.set(custFields);
      $('.dataTable').resizable();
    }
    templateObject.initCustomFieldDisplaySettings("", currenttablename);

    templateObject.resetData = function (dataVal) {
        location.reload();
    };

  tableResize();
});

Template.vs1_report_template.events({
  'click .btnOpenReportSettings': async function (event, template) {
      let templateObject = Template.instance();
      let currenttranstablename = templateObject.data.tablename||"";
      $(`#${currenttranstablename} thead tr th`).each(function (index) {
        var $tblrow = $(this);
        var colWidth = $tblrow.width() || 0;
        var colthClass = $tblrow.attr('data-class') || "";
        $('.rngRange' + colthClass).val(colWidth);
      });
     $('.'+templateObject.data.tablename+'_Modal').modal('toggle');
  },
  'change .custom-range': async function(event) {
    const tableHandler = new TableHandler();
    let range = $(event.target).val()||0;
    let colClassName = $(event.target).attr("valueclass");
    await $('.' + colClassName).css('width', range);
    $('.dataTable').resizable();
  },
  'click .chkDatatable': function(event) {
      let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
      if ($(event.target).is(':checked')) {
        $('.'+columnDataValue).addClass('showColumn');
        $('.'+columnDataValue).removeClass('hiddenColumn');
      } else {
        $('.'+columnDataValue).addClass('hiddenColumn');
        $('.'+columnDataValue).removeClass('showColumn');
      }
  },
  "blur .divcolumn": async function (event) {
    const templateObject = Template.instance();
    let columData = $(event.target).text();
    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr("custid");
    let currenttablename = await templateObject.tablename.get()||'';
    var datable = $('#'+currenttablename).DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  'click .resetTable' : async function(event){
    let templateObject = Template.instance();
    let reset_data = templateObject.reset_data.get();
    let currenttablename = await templateObject.tablename.get()||'';
      //reset_data[9].display = false;
      reset_data = reset_data.filter(redata => redata.display);
    $(".displaySettings").each(function (index) {
      let $tblrow = $(this);
      $tblrow.find(".divcolumn").text(reset_data[index].label);
      $tblrow.find(".custom-control-input").prop("checked", reset_data[index].active);

      let title = $('#'+currenttablename).find("th").eq(index);
        $(title).html(reset_data[index].label);

      if (reset_data[index].active) {
        $('.' + reset_data[index].class).addClass('showColumn');
        $('.' + reset_data[index].class).removeClass('hiddenColumn');
      } else {
        $('.' + reset_data[index].class).addClass('hiddenColumn');
        $('.' + reset_data[index].class).removeClass('showColumn');
      }
      $(".rngRange" + reset_data[index].class).val(reset_data[index].width);
      $("." + reset_data[index].class).css('width', reset_data[index].width);
    });
  },
  "click .saveTable": async function(event) {
    let lineItems = [];
    $(".fullScreenSpin").css("display", "inline-block");

    $(".displaySettings").each(function (index) {
      var $tblrow = $(this);
      var fieldID = $tblrow.attr("custid") || 0;
      var colTitle = $tblrow.find(".divcolumn").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(":checked")) {
        colHidden = true;
      } else {
        colHidden = false;
      }
      let lineItemObj = {
        index: parseInt(fieldID),
        label: colTitle,
        active: colHidden,
        width: parseInt(colWidth),
        class: colthClass,
        display: true
      };

      lineItems.push(lineItemObj);
    });

    let templateObject = Template.instance();
    let reset_data = templateObject.reset_data.get();
    reset_data = reset_data.filter(redata => redata.display == false);
    lineItems.push(...reset_data);
    lineItems.sort((a,b) => a.index - b.index);
      let erpGet = erpDb();
      let tableName = await templateObject.tablename.get()||'';
      let employeeId = parseInt(Session.get('mySessionEmployeeLoggedID'))||0;
      let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);

      if(added){
        sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')),'').then(function (dataCustomize) {
            addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
        }).catch(function (err) {
        });
        $(".fullScreenSpin").css("display", "none");
        swal({
          title: 'SUCCESS',
          text: "Display settings is updated!",
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
            if (result.value) {
                $('#'+tableName+'_Modal').modal('hide');
            }
        });
      }else{
        $(".fullScreenSpin").css("display", "none");
      }

    },
});

Template.vs1_report_template.helpers({
  loggedCompany: () => {
      return localStorage.getItem('mySession') || '';
  },
  isAccountingMoreOption: () => {
    return Template.instance().isAccountingMoreOption.get();;
  },
  companyname: () =>{
    return loggedCompany;
  },
  isTaxCodeOption: () => {
    return Template.instance().isTaxCodeOption.get();;
  },

  // tablename: () => {
  //     return Template.instance().tablename.get();
  // },
  // tabledisplayname: () => {
  //     return Template.instance().tabledisplayname.get();
  // },
  report_displayfields: () => {
    return Template.instance().report_displayfields.get();
  },
  // dateAsAt: () => {
  //   return Template.instance().dateAsAt.get() || "-";
  // },
});
