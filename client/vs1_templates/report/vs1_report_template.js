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
      case "transactionjournallist":
        reset_data = [
          { index: 1, label: 'Date', class:'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Account Name', class:'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Debits (Ex)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Debits (Inc)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Credits (Ex)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Credits (Inc)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Global Ref', class:'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'Client Name', class:'colAccountName', active: false, display: true, width: "" },
          { index: 11, label: 'Account Number', class:'colAccountName', active: false, display: true, width: "" },
          { index: 12, label: 'Tax Code', class:'colAccountName', active: false, display: true, width: "" },
          { index: 13, label: 'Product Desc', class:'colAccountName', active: false, display: true, width: "" },
          { index: 14, label: 'Account Type', class:'colAccountName', active: false, display: true, width: "" },
          { index: 15, label: 'Trans Time Stamp', class:'colAccountName', active: false, display: true, width: "" },
          { index: 16, label: 'Employee Name', class:'colAccountName', active: false, display: true, width: "" },
          { index: 17, label: 'Department', class:'colAccountName', active: false, display: true, width: "" },
          { index: 18, label: 'Memo', class:'colAccountName', active: false, display: true, width: "" },
          { index: 19, label: 'Reference No', class:'colAccountName', active: false, display: true, width: "" },
          { index: 20, label: 'FixedAssetId', class:'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "tblAgedReceivables":
      case "tblAgedReceivablesSummary":
        reset_data = [
          { index: 1, label: 'Name', class:'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Phone', class:'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'AR Notes', class:'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Amount~Due', class:'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Current', class:'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: '1-30 Days', class:'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: '30-60 Days', class:'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: '60-90 Days', class:'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: '> 90 Days', class:'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'Avg Days Customer~Takes to pay', class:'colAccountName', active: false, display: true, width: "" },
          { index: 11, label: 'Invoice#', class:'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Rep Name', class:'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'FaxNumber', class:'colAccountName', active: true, display: true, width: "" },
          { index: 14, label: 'Mobile', class:'colAccountName', active: true, display: true, width: "" },
          { index: 15, label: 'AltPhone', class:'colAccountName', active: true, display: true, width: "" },
          { index: 16, label: 'StopCredit', class:'colAccountName', active: true, display: true, width: "" },
          { index: 17, label: 'CreditLimit', class:'colAccountName', active: true, display: true, width: "" },
          { index: 18, label: 'Cust Type', class:'colAccountName', active: false, display: true, width: "" },
          { index: 19, label: 'P.O. No#', class:'colAccountName', active: false, display: true, width: "" },
          { index: 20, label: 'Sale Date', class:'colAccountName', active: false, display: true, width: "" },
          { index: 21, label: 'Due Date', class:'colAccountName', active: false, display: true, width: "" },
          { index: 22, label: 'Type', class:'colAccountName', active: false, display: true, width: "" },
          { index: 23, label: 'Pre-pay#', class:'colAccountName', active: false, display: true, width: "" },
          { index: 24, label: 'Original Amount', class:'colAccountName', active: false, display: true, width: "" },
          { index: 25, label: '1-7 Days', class:'colAccountName', active: false, display: true, width: "" },
          { index: 26, label: '7-14 Days', class:'colAccountName', active: false, display: true, width: "" },
          { index: 27, label: '14-21 Days', class:'colAccountName', active: false, display: true, width: "" },
          { index: 28, label: '>21 Days', class:'colAccountName', active: false, display: true, width: "" },
          { index: 29, label: 'Expiration Date', class:'colAccountName', active: false, display: true, width: "" },
          { index: 30, label: 'Reg NY', class:'colAccountName', active: false, display: true, width: "" },
          { index: 31, label: 'adv emails', class:'colAccountName', active: false, display: true, width: "" },
          { index: 32, label: 'Length', class:'colAccountName', active: false, display: true, width: "" },
          { index: 33, label: 'Width', class:'colAccountName', active: false, display: true, width: "" },
          { index: 34, label: 'Height', class:'colAccountName', active: false, display: true, width: "" },
          { index: 35, label: 'Region', class:'colAccountName', active: false, display: true, width: "" },
          { index: 36, label: 'Account~ Name', class:'colAccountName', active: false, display: true, width: "" },
          { index: 37, label: 'Overdue~ Surcharge', class:'colAccountName', active: false, display: true, width: "" },
          { index: 38, label: 'Shipping', class:'colAccountName', active: false, display: true, width: "" },
          { index: 39, label: 'Terms', class:'colAccountName', active: false, display: true, width: "" },
          { index: 40, label: 'Related Name', class:'colAccountName', active: false, display: true, width: "" },
          { index: 41, label: 'Department', class:'colAccountName', active: false, display: true, width: "" },
          { index: 42, label: 'Status', class:'colAccountName', active: false, display: true, width: "" },
          { index: 43, label: 'Customer Account No', class:'colAccountName', active: false, display: true, width: "" },
          { index: 44, label: 'Email', class:'colAccountName', active: false, display: true, width: "" },
          { index: 45, label: 'Overdue~ Surcharge~ Desc', class:'colAccountName', active: false, display: true, width: "" },
          { index: 46, label: 'Print Name', class:'colAccountName', active: false, display: true, width: "" },
          { index: 47, label: 'TransactionName', class:'colAccountName', active: false, display: true, width: "" },
          { index: 48, label: 'Customer ID', class:'colAccountName', active: false, display: true, width: "" },
          { index: 49, label: 'ConNote', class:'colAccountName', active: false, display: true, width: "" },
          { index: 50, label: 'CheckNo', class:'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "tblProductSales":
        reset_data = [
          { index: 1, label: 'Doc Number', class:'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Transaction~Type', class:'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Ship~Date', class:'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Customer ID', class:'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Contact Name', class:'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Address1', class:'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Address2', class:'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Address3', class:'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Ship To City', class:'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'State', class:'colAccountName', active: false, display: true, width: "" },
          { index: 11, label: 'Zip Code', class:'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Email', class:'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'Phone', class:'colAccountName', active: true, display: true, width: "" },
          { index: 14, label: 'Sales~Status', class:'colAccountName', active: true, display: true, width: "" },
          { index: 15, label: 'Rush Order', class:'colAccountName', active: true, display: true, width: "" },
          { index: 16, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
          { index: 17, label: 'Barcode', class:'colAccountName', active: true, display: true, width: "" },
          { index: 18, label: 'Unit of~Measure', class:'colAccountName', active: true, display: true, width: "" },
          { index: 19, label: 'Ordered', class:'colAccountName', active: true, display: true, width: "" },
          { index: 20, label: 'Shipped', class:'colAccountName', active: true, display: true, width: "" },
          { index: 21, label: 'Special~Instruction', class:'colAccountName', active: true, display: true, width: "" },
          { index: 22, label: 'SaleID', class:'colAccountName', active: false, display: true, width: "" },
          { index: 23, label: 'Comments', class:'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "salesreport":
        reset_data = [
          { index: 1, label: 'Customer ID', class:'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Sale Date', class:'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Invoice~Number', class:'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Transaction~Type', class:'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Customer~Type', class:'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Amount(Ex)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Tax', class:'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Amount(Inc)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Qty Shipped', class:'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'UOM', class:'colAccountName', active: false, display: true, width: "" },
          { index: 11, label: 'Product ID', class:'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Catagory', class:'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'Switch', class:'colAccountName', active: true, display: true, width: "" },
          { index: 14, label: 'Dept', class:'colAccountName', active: true, display: true, width: "" },
          { index: 15, label: 'Description', class:'colAccountName', active: true, display: true, width: "" },
          { index: 16, label: 'Employee~Name', class:'colAccountName', active: true, display: true, width: "" },
          { index: 17, label: 'Ship Date', class:'colAccountName', active: true, display: true, width: "" },
          { index: 18, label: 'Ex', class:'colAccountName', active: true, display: true, width: "" },
          { index: 19, label: 'Inc', class:'colAccountName', active: true, display: true, width: "" },
          { index: 20, label: 'Ex', class:'colAccountName', active: true, display: true, width: "" },
          { index: 21, label: 'Inc', class:'colAccountName', active: true, display: true, width: "" },
          { index: 22, label: 'Ex', class:'colAccountName', active: true, display: true, width: "" },
          { index: 23, label: 'Tax Code', class:'colAccountName', active: true, display: true, width: "" },
          { index: 24, label: 'Line Tax', class:'colAccountName', active: true, display: true, width: "" },
          { index: 25, label: 'Ex', class:'colAccountName', active: true, display: true, width: "" },
          { index: 26, label: 'Inc', class:'colAccountName', active: true, display: true, width: "" },
          { index: 27, label: 'Discount $', class:'colAccountName', active: true, display: true, width: "" },
          { index: 28, label: 'Discount %', class:'colAccountName', active: true, display: true, width: "" },
          { index: 29, label: 'Percent', class:'colAccountName', active: true, display: true, width: "" },
          { index: 30, label: 'Gross', class:'colAccountName', active: true, display: true, width: "" },
          { index: 31, label: 'Till', class:'colAccountName', active: true, display: true, width: "" },
          { index: 32, label: 'Area', class:'colAccountName', active: true, display: true, width: "" },
          { index: 33, label: 'Department Name', class:'colAccountName', active: true, display: true, width: "" },
          { index: 34, label: 'Source', class:'colAccountName', active: true, display: true, width: "" },
          { index: 35, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
          { index: 36, label: 'Sale Id', class:'colAccountName', active: false, display: true, width: "" },
          { index: 37, label: 'Due Date', class:'colAccountName', active: false, display: true, width: "" },
          { index: 38, label: 'Sales Ref No', class:'colAccountName', active: false, display: true, width: "" },
          { index: 39, label: 'Shipped To~ Address', class:'colAccountName', active: false, display: true, width: "" },
          { index: 40, label: 'Time of Sale', class:'colAccountName', active: false, display: true, width: "" },
          { index: 41, label: 'Memo', class:'colAccountName', active: false, display: true, width: "" },
          { index: 42, label: 'Comments', class:'colAccountName', active: false, display: true, width: "" },
          { index: 43, label: 'Original No', class:'colAccountName', active: false, display: true, width: "" },
          { index: 44, label: 'PO Number', class:'colAccountName', active: false, display: true, width: "" },
          { index: 45, label: 'Consignment~ Note', class:'colAccountName', active: false, display: true, width: "" },
          { index: 46, label: 'Lines Ref No', class:'colAccountName', active: false, display: true, width: "" },
          { index: 47, label: 'Preferred Supplier', class:'colAccountName', active: false, display: true, width: "" },
          { index: 48, label: 'Supplier Product code', class:'colAccountName', active: false, display: true, width: "" },
          { index: 49, label: 'POS Source', class:'colAccountName', active: false, display: true, width: "" },
          { index: 50, label: 'Warranty Ends On', class:'colAccountName', active: false, display: true, width: "" },
          { index: 51, label: 'Warranty Period', class:'colAccountName', active: false, display: true, width: "" },
          { index: 52, label: 'POS Post Code', class:'colAccountName', active: false, display: true, width: "" },
          { index: 53, label: 'Line~ Ship date', class:'colAccountName', active: false, display: true, width: "" },
          { index: 54, label: 'Markup $', class:'colAccountName', active: false, display: true, width: "" },
          { index: 55, label: 'Markup %', class:'colAccountName', active: false, display: true, width: "" },
          { index: 56, label: 'Run Name', class:'colAccountName', active: false, display: true, width: "" },
          { index: 57, label: 'Print Name', class:'colAccountName', active: false, display: true, width: "" },
          { index: 58, label: 'Globalref', class:'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "tblSalesSummary":
        reset_data = [
          { index: 1, label: 'Weekday', class:'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Cost Amount (Burleigh)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Sold Amount (Burleigh)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Cost Amount (Default)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Sold Amount (Default)', class:'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Total Cost Amount', class:'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Total Sold Amount', class:'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Sold Amount Ex(Default)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 9, label: 'Sales Tax (Default)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 10, label: 'Sold Amount Ex(Hawaii)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 11, label: 'Sales Tax (Hawaii)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 12, label: 'Cost Amount (Los Angeles)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 13, label: 'Sold Amount (Los Angeles)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 14, label: 'Sold Amount Ex(Los Angeles)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 15, label: 'Sales Tax (Los Angeles)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 16, label: 'Cost Amount (New York)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 17, label: 'Sold Amount (New York)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 18, label: 'Sold Amount Ex(New York)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 19, label: 'Sales Tax (New York)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 20, label: 'Cost Amount (Sales One)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 21, label: 'Sold Amount (Sales One)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 22, label: 'Sold Amount Ex(Sales One)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 23, label: 'Sales Tax (Sales One)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 24, label: 'Cost Not Used6', class:'colAccountName', active: false, display: true, width: "" },
          { index: 25, label: 'Sold Not Used6', class:'colAccountName', active: false, display: true, width: "" },
          { index: 26, label: 'Sold Not Used6(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 27, label: 'Sold Not Used6(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 28, label: 'Cost Not Used7', class:'colAccountName', active: false, display: true, width: "" },
          { index: 29, label: 'Sold Not Used7', class:'colAccountName', active: false, display: true, width: "" },
          { index: 30, label: 'Sold Not Used7(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 31, label: 'Sold Not Used7(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 32, label: 'Cost Not Used8', class:'colAccountName', active: false, display: true, width: "" },
          { index: 33, label: 'Sold Not Used8', class:'colAccountName', active: false, display: true, width: "" },
          { index: 34, label: 'Sold Not Used8(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 35, label: 'Sold Not Used8(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 36, label: 'Cost Not Used9', class:'colAccountName', active: false, display: true, width: "" },
          { index: 37, label: 'Sold Not Used9', class:'colAccountName', active: false, display: true, width: "" },
          { index: 38, label: 'Sold Not Used9(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 39, label: 'Sold Not Used9(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 40, label: 'Cost Not Used10', class:'colAccountName', active: false, display: true, width: "" },
          { index: 41, label: 'Sold Not Used10', class:'colAccountName', active: false, display: true, width: "" },
          { index: 42, label: 'Sold Not Used10(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 43, label: 'Sold Not Used10(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 44, label: 'Cost Not Used11', class:'colAccountName', active: false, display: true, width: "" },
          { index: 45, label: 'Sold Not Used11', class:'colAccountName', active: false, display: true, width: "" },
          { index: 46, label: 'Sold Not Used11(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 47, label: 'Sold Not Used11(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 48, label: 'Cost Not Used12', class:'colAccountName', active: false, display: true, width: "" },
          { index: 49, label: 'Sold Not Used12', class:'colAccountName', active: false, display: true, width: "" },
          { index: 50, label: 'Sold Not Used12(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 51, label: 'Sold Not Used12(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 52, label: 'Cost Not Used13', class:'colAccountName', active: false, display: true, width: "" },
          { index: 53, label: 'Sold Not Used13', class:'colAccountName', active: false, display: true, width: "" },
          { index: 54, label: 'Sold Not Used13(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 55, label: 'Sold Not Used13(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 56, label: 'Cost Not Used14', class:'colAccountName', active: false, display: true, width: "" },
          { index: 57, label: 'Sold Not Used14', class:'colAccountName', active: false, display: true, width: "" },
          { index: 58, label: 'Sold Not Used14(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 59, label: 'Sold Not Used14(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 60, label: 'Cost Not Used15', class:'colAccountName', active: false, display: true, width: "" },
          { index: 61, label: 'Sold Not Used15', class:'colAccountName', active: false, display: true, width: "" },
          { index: 62, label: 'Sold Not Used15(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 63, label: 'Sold Not Used15(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 64, label: 'Cost Not Used16', class:'colAccountName', active: false, display: true, width: "" },
          { index: 65, label: 'Sold Not Used16', class:'colAccountName', active: false, display: true, width: "" },
          { index: 66, label: 'Sold Not Used16(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 67, label: 'Sold Not Used16(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 68, label: 'Cost Not Used17', class:'colAccountName', active: false, display: true, width: "" },
          { index: 69, label: 'Sold Not Used17', class:'colAccountName', active: false, display: true, width: "" },
          { index: 70, label: 'Sold Not Used17(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 71, label: 'Sold Not Used17(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 72, label: 'Cost Not Used18', class:'colAccountName', active: false, display: true, width: "" },
          { index: 73, label: 'Sold Not Used18', class:'colAccountName', active: false, display: true, width: "" },
          { index: 74, label: 'Sold Not Used18(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 75, label: 'Sold Not Used18(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 76, label: 'Cost Not Used19', class:'colAccountName', active: false, display: true, width: "" },
          { index: 77, label: 'Sold Not Used19', class:'colAccountName', active: false, display: true, width: "" },
          { index: 78, label: 'Sold Not Used19(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 79, label: 'Sold Not Used19(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 80, label: 'Cost Not Used20', class:'colAccountName', active: false, display: true, width: "" },
          { index: 81, label: 'Sold Not Used20', class:'colAccountName', active: false, display: true, width: "" },
          { index: 82, label: 'Sold Not Used20(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 83, label: 'Sold Not Used20(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 84, label: 'Cost Not Used21', class:'colAccountName', active: false, display: true, width: "" },
          { index: 85, label: 'Sold Not Used21', class:'colAccountName', active: false, display: true, width: "" },
          { index: 86, label: 'Sold Not Used21(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 87, label: 'Sold Not Used21(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 88, label: 'Cost Not Used22', class:'colAccountName', active: false, display: true, width: "" },
          { index: 89, label: 'Sold Not Used22', class:'colAccountName', active: false, display: true, width: "" },
          { index: 90, label: 'Sold Not Used22(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 91, label: 'Sold Not Used22(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 92, label: 'Cost Not Used23', class:'colAccountName', active: false, display: true, width: "" },
          { index: 93, label: 'Sold Not Used23', class:'colAccountName', active: false, display: true, width: "" },
          { index: 94, label: 'Sold Not Used23(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 95, label: 'Sold Not Used23(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 96, label: 'Cost Not Used24', class:'colAccountName', active: false, display: true, width: "" },
          { index: 97, label: 'Sold Not Used24', class:'colAccountName', active: false, display: true, width: "" },
          { index: 98, label: 'Sold Not Used24(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 99, label: 'Sold Not Used24(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 100, label: 'Cost Not Used25', class:'colAccountName', active: false, display: true, width: "" },
          { index: 101, label: 'Sold Not Used25', class:'colAccountName', active: false, display: true, width: "" },
          { index: 102, label: 'Sold Not Used25(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 103, label: 'Sold Not Used25(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 104, label: 'Cost Not Used26', class:'colAccountName', active: false, display: true, width: "" },
          { index: 105, label: 'Sold Not Used26', class:'colAccountName', active: false, display: true, width: "" },
          { index: 106, label: 'Sold Not Used26(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 107, label: 'Sold Not Used26(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 108, label: 'Cost Not Used27', class:'colAccountName', active: false, display: true, width: "" },
          { index: 109, label: 'Sold Not Used27', class:'colAccountName', active: false, display: true, width: "" },
          { index: 110, label: 'Sold Not Used27(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 111, label: 'Sold Not Used27(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 112, label: 'Cost Not Used28', class:'colAccountName', active: false, display: true, width: "" },
          { index: 113, label: 'Sold Not Used28', class:'colAccountName', active: false, display: true, width: "" },
          { index: 114, label: 'Sold Not Used28(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 115, label: 'Sold Not Used28(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 116, label: 'Cost Not Used29', class:'colAccountName', active: false, display: true, width: "" },
          { index: 117, label: 'Sold Not Used29', class:'colAccountName', active: false, display: true, width: "" },
          { index: 118, label: 'Sold Not Used29(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 119, label: 'Sold Not Used29(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 120, label: 'Cost Not Used30', class:'colAccountName', active: false, display: true, width: "" },
          { index: 121, label: 'Sold Not Used30', class:'colAccountName', active: false, display: true, width: "" },
          { index: 122, label: 'Sold Not Used30(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 123, label: 'Sold Not Used30(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 124, label: 'Cost Not Used31', class:'colAccountName', active: false, display: true, width: "" },
          { index: 125, label: 'Sold Not Used31', class:'colAccountName', active: false, display: true, width: "" },
          { index: 126, label: 'Sold Not Used31(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 127, label: 'Sold Not Used31(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 128, label: 'Cost Not Used32', class:'colAccountName', active: false, display: true, width: "" },
          { index: 129, label: 'Sold Not Used32', class:'colAccountName', active: false, display: true, width: "" },
          { index: 130, label: 'Sold Not Used32(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 131, label: 'Sold Not Used32(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 132, label: 'Cost Not Used33', class:'colAccountName', active: false, display: true, width: "" },
          { index: 133, label: 'Sold Not Used33', class:'colAccountName', active: false, display: true, width: "" },
          { index: 134, label: 'Sold Not Used33(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 135, label: 'Sold Not Used33(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 136, label: 'Cost Not Used34', class:'colAccountName', active: false, display: true, width: "" },
          { index: 137, label: 'Sold Not Used34', class:'colAccountName', active: false, display: true, width: "" },
          { index: 138, label: 'Sold Not Used34(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 139, label: 'Sold Not Used34(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 140, label: 'Cost Not Used35', class:'colAccountName', active: false, display: true, width: "" },
          { index: 141, label: 'Sold Not Used35', class:'colAccountName', active: false, display: true, width: "" },
          { index: 142, label: 'Sold Not Used35(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 143, label: 'Sold Not Used35(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 144, label: 'Cost Not Used36', class:'colAccountName', active: false, display: true, width: "" },
          { index: 145, label: 'Sold Not Used36', class:'colAccountName', active: false, display: true, width: "" },
          { index: 146, label: 'Sold Not Used36(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 147, label: 'Sold Not Used36(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 148, label: 'Cost Not Used37', class:'colAccountName', active: false, display: true, width: "" },
          { index: 149, label: 'Sold Not Used37', class:'colAccountName', active: false, display: true, width: "" },
          { index: 150, label: 'Sold Not Used37(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 151, label: 'Sold Not Used37(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 152, label: 'Cost Not Used38', class:'colAccountName', active: false, display: true, width: "" },
          { index: 153, label: 'Sold Not Used38', class:'colAccountName', active: false, display: true, width: "" },
          { index: 154, label: 'Sold Not Used38(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 155, label: 'Sold Not Used38(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 156, label: 'Cost Not Used39', class:'colAccountName', active: false, display: true, width: "" },
          { index: 157, label: 'Sold Not Used39', class:'colAccountName', active: false, display: true, width: "" },
          { index: 158, label: 'Sold Not Used39(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 159, label: 'Sold Not Used39(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 160, label: 'Cost Not Used40', class:'colAccountName', active: false, display: true, width: "" },
          { index: 161, label: 'Sold Not Used40', class:'colAccountName', active: false, display: true, width: "" },
          { index: 162, label: 'Sold Not Used40(Ex)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 163, label: 'Sold Not Used40(Tax)', class:'colAccountName', active: false, display: true, width: "" },
          { index: 164, label: 'Total Sold Amount Ex', class:'colAccountName', active: false, display: true, width: "" },
          { index: 165, label: 'Total Sale Tax', class:'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "tblAgedPayables":
      case "tblAgedPayablesSummary":
        reset_data = [
          { index: 1, label: 'Name', class:'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Type', class:'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'PO Number', class:'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Due Date', class:'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Amount Due', class:'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Current', class:'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: '1-30 Days', class:'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: '30-60 Days', class:'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: '60-90 Days', class:'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: '> 90 Days', class:'colAccountName', active: true, display: true, width: "" },
          { index: 11, label: 'Order Date', class:'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Invoice Date', class:'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'Original Amount', class:'colAccountName', active: true, display: true, width: "" },
          { index: 14, label: 'Details', class:'colAccountName', active: false, display: true, width: "" },
          { index: 15, label: 'Invoice Number', class:'colAccountName', active: false, display: true, width: "" },
          { index: 16, label: 'Account Name', class:'colAccountName', active: false, display: true, width: "" },
          { index: 17, label: 'Supplier ID', class:'colAccountName', active: false, display: true, width: "" },
          { index: 18, label: 'Terms', class:'colAccountName', active: false, display: true, width: "" },
          { index: 19, label: 'APNotes', class:'colAccountName', active: false, display: true, width: "" },
          { index: 20, label: 'Print Name', class:'colAccountName', active: false, display: true, width: "" },
          { index: 21, label: 'PCStatus', class:'colAccountName', active: false, display: true, width: "" },
          { index: 22, label: 'GlobalRef', class:'colAccountName', active: false, display: true, width: "" },
          { index: 23, label: 'POGlobalRef', class:'colAccountName', active: false, display: true, width: "" },
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
