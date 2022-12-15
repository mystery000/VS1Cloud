import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
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

Template.vs1_report_template.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.tablename = new ReactiveVar();
  templateObject.tabledisplayname = new ReactiveVar();
  templateObject.transactiondatatablerecords = new ReactiveVar([]);
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.selectedFile = new ReactiveVar();
  templateObject.report_displayfields = new ReactiveVar();
  templateObject.reset_data = new ReactiveVar([]);
  templateObject.isAccountingMoreOption = new ReactiveVar();
  templateObject.isTaxCodeOption = new ReactiveVar();
  // templateObject.dateAsAt = new ReactiveVar();
});

Template.vs1_report_template.onRendered(function () {
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

  currenttablename = templateObject.data.tablename || "";
  displaytablename = templateObject.data.tabledisplayname || "";

  templateObject.tablename.set(currenttablename);
  templateObject.tabledisplayname.set(displaytablename);

  // set initial table rest_data
  templateObject.init_reset_data = function () {
    let reset_data = [];
    switch (currenttablename) {
      case "tblgeneralledger":
        reset_data = [
          { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "85" },
          { index: 2, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "110" },
          { index: 3, label: 'Type', class: 'colType', active: true, display: true, width: "85" },
          { index: 4, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "85" },
          { index: 5, label: 'Product Description', class: 'colCredit', active: true, display: true, width: "85" },
          { index: 6, label: 'Department', class: 'colDepartment', active: true, display: true, width: "85" },
          { index: 7, label: 'Debits (Ex)', class: 'colDebitsEx', active: true, display: true, width: "120" },
          { index: 8, label: 'Credits (Ex)', class: 'colCreditEx', active: true, display: true, width: "120" },
          { index: 9, label: 'Client Name', class: 'colProductDescription', active: true, display: true, width: "120" },
          { index: 10, label: 'Rep Name', class: 'colRepName', active: true, display: true, width: "85" },
          { index: 11, label: 'Debits (Inc)', class: 'colDebitsInc', active: true, display: true, width: "120" },
          { index: 12, label: 'Credits (Inc)', class: 'colCreditInc', active: true, display: true, width: "120" },
          { index: 13, label: 'Amount (Ex)', class: 'colAmountEx', active: true, display: true, width: "120" },
          { index: 14, label: 'Amount (Inc)', class: 'colAmountInc', active: true, display: true, width: "120" },
          { index: 15, label: 'Accounts', class: 'colAccounts', active: false, display: true, width: "85" },
          { index: 16, label: 'Global Ref', class: 'colGlobalRef', active: false, display: true, width: "85" },
          { index: 17, label: 'Account Number', class: 'colAccountNo', active: false, display: true, width: "140" },
          { index: 18, label: 'Tax Code', class: 'colTaxCode', active: false, display: true, width: "150" },
          { index: 19, label: 'Tax Rate', class: 'colTaxRate', active: false, display: true, width: "85" },
          { index: 20, label: 'Class ID', class: 'colClassID', active: false, display: true, width: "85" },
          { index: 21, label: 'Sale ID', class: 'colSaleID', active: false, display: true, width: "85" },
          { index: 22, label: 'Purchase Order ID', class: 'colPurchaseOrderID', active: false, display: true, width: "85" },
          { index: 23, label: 'Payment ID', class: 'colPaymentID', active: false, display: true, width: "85" },
          { index: 24, label: 'Details', class: 'colDetails', active: false, display: true, width: "85" },
          { index: 25, label: 'Account ID', class: 'colAccountID', active: false, display: true, width: "85" },
          { index: 26, label: 'FixedAsset ID', class: 'colFixedAssetID', active: false, display: true, width: "85" },
          { index: 27, label: 'Check Number', class: 'colCheckNumber', active: false, display: true, width: "85" },
          { index: 28, label: 'Memo', class: 'colMemo', active: false, display: true, width: "85" },
          { index: 29, label: 'Ref No', class: 'colRefNo', active: false, display: true, width: "85" },
          { index: 30, label: 'PrepaymentID', class: 'colPrepaymentID', active: false, display: true, width: "85" },
        ];
        break;
      case "taxSummary":
        reset_data = [
          { index: 1, label: 'TaxCode', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'INPUTS Ex (Purchases)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'INPUTS Inc (Purchases)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'OUTPUTS Ex  (Sales)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'OUTPUTS Inc (Sales)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Total Net', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Total Tax', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'TaxRate', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Total Tax1', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 10, label: 'ID', class: 'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "tblBalanceSheet":
        // reset_data = templateObject.data.currencyList;
        // console.log("------------>", templateObject.data.currencyList);
        reset_data = [
          { index: 1, label: 'Account Tree', class: 'colAccountTree', active: true, display: true, width: "86" },
          { index: 2, label: 'Account No', class: 'colAccountNo', active: true, display: true, width: "86" },
          { index: 3, label: 'Sub-Account-Totals', class: 'colSubAccountTotals', active: true, display: true, width: "192" },
          { index: 4, label: 'Header-Account-Totals', class: 'colHeaderAccountTotals', active: true, display: true, width: "137" },
          { index: 5, label: 'Total Current~Assets &~Liabilities', class: 'colTotalCurrentAssets', active: true, display: true, width: "85" },
          { index: 6, label: 'Total ~Assets &~Liabilities', class: 'colTotalAssets', active: true, display: true, width: "85" },
          { index: 7, label: 'ID', class: 'colID', active: false, display: true, width: "85" },
          { index: 8, label: 'SortID', class: 'colSortID', active: false, display: true, width: "85" },
          { index: 9, label: 'TypeID', class: 'colTypeID', active: false, display: true, width: "85" },
          { index: 10, label: 'ACCNAME', class: 'colACCNAME', active: false, display: true, width: "85" },
        ]
        break;
      case "transactionjournallist":
        reset_data = [
          { index: 1, label: 'Date', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Debits (Ex)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Debits (Inc)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Credits (Ex)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Credits (Inc)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Global Ref', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Product ID', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'Client Name', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 11, label: 'Account Number', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 12, label: 'Tax Code', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 13, label: 'Product Desc', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 14, label: 'Account Type', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 15, label: 'Trans Time Stamp', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 16, label: 'Employee Name', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 17, label: 'Department', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 18, label: 'Memo', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 19, label: 'Reference No', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 20, label: 'FixedAssetId', class: 'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "tblAgedReceivables":
      case "tblAgedReceivablesSummary":
        reset_data = [
          { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "" },
          { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "" },
          { index: 3, label: 'AR Notes', class: 'colARNotes', active: true, display: true, width: "" },
          { index: 4, label: 'Amount~Due', class: 'colAmountDue', active: true, display: true, width: "" },
          { index: 5, label: 'Current', class: 'colCurrent', active: true, display: true, width: "" },
          { index: 6, label: '1-30 Days', class: 'col1-30Days', active: true, display: true, width: "" },
          { index: 7, label: '30-60 Days', class: 'col30-60Days', active: true, display: true, width: "" },
          { index: 8, label: '60-90 Days', class: 'col60-90Days', active: true, display: true, width: "" },
          { index: 9, label: '> 90 Days', class: 'col90Days', active: true, display: true, width: "" },
          { index: 10, label: 'Avg Days Customer~Takes to pay', class: 'colAvgDaysCustomer', active: false, display: true, width: "" },
          { index: 11, label: 'Invoice#', class: 'colInvoice', active: true, display: true, width: "" },
          { index: 12, label: 'Rep Name', class: 'colRepName', active: true, display: true, width: "" },
          { index: 13, label: 'FaxNumber', class: 'colFaxNumber', active: true, display: true, width: "" },
          { index: 14, label: 'Mobile', class: 'colMobile', active: true, display: true, width: "" },
          { index: 15, label: 'AltPhone', class: 'colAltPhone', active: true, display: true, width: "" },
          { index: 16, label: 'StopCredit', class: 'colStopCredit', active: true, display: true, width: "" },
          { index: 17, label: 'CreditLimit', class: 'colCreditLimit', active: true, display: true, width: "" },
          { index: 18, label: 'Cust Type', class: 'colCustType', active: false, display: true, width: "" },
          { index: 19, label: 'P.O. No#', class: 'colPONo', active: false, display: true, width: "" },
          { index: 20, label: 'Sale Date', class: 'colSaleDate', active: false, display: true, width: "" },
          { index: 21, label: 'Due Date', class: 'colDueDate', active: false, display: true, width: "" },
          { index: 22, label: 'Type', class: 'colType', active: false, display: true, width: "" },
          { index: 23, label: 'Pre-pay#', class: 'colPre-pay', active: false, display: true, width: "" },
          { index: 24, label: 'Original Amount', class: 'colOriginalAmount', active: false, display: true, width: "" },
          { index: 25, label: '1-7 Days', class: 'col1-7Days', active: false, display: true, width: "" },
          { index: 26, label: '7-14 Days', class: 'col7-14Days', active: false, display: true, width: "" },
          { index: 27, label: '14-21 Days', class: 'col14-21Days', active: false, display: true, width: "" },
          { index: 28, label: '>21 Days', class: 'col21Days', active: false, display: true, width: "" },
          { index: 29, label: 'Expiration Date', class: 'colExpirationDate', active: false, display: true, width: "" },
          { index: 30, label: 'Reg NY', class: 'colRegNY', active: false, display: true, width: "" },
          { index: 31, label: 'adv emails', class: 'coladvemails', active: false, display: true, width: "" },
          { index: 32, label: 'Length', class: 'colLength', active: false, display: true, width: "" },
          { index: 33, label: 'Width', class: 'colWidth', active: false, display: true, width: "" },
          { index: 34, label: 'Height', class: 'colHeight', active: false, display: true, width: "" },
          { index: 35, label: 'Region', class: 'colRegion', active: false, display: true, width: "" },
          { index: 36, label: 'Account~ Name', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 37, label: 'Overdue~ Surcharge', class: 'colOverdueSurcharge', active: false, display: true, width: "" },
          { index: 38, label: 'Shipping', class: 'colShipping', active: false, display: true, width: "" },
          { index: 39, label: 'Terms', class: 'colTerms', active: false, display: true, width: "" },
          { index: 40, label: 'Related Name', class: 'colRelatedName', active: false, display: true, width: "" },
          { index: 41, label: 'Department', class: 'colDepartment', active: false, display: true, width: "" },
          { index: 42, label: 'Status', class: 'colStatus', active: false, display: true, width: "" },
          { index: 43, label: 'Customer Account No', class: 'colCustomerAccountNo', active: false, display: true, width: "" },
          { index: 44, label: 'Email', class: 'colEmail', active: false, display: true, width: "" },
          { index: 45, label: 'Overdue~ Surcharge~ Desc', class: 'colOverdueSurchargeDesc', active: false, display: true, width: "" },
          { index: 46, label: 'Print Name', class: 'colPrintName', active: false, display: true, width: "" },
          { index: 47, label: 'TransactionName', class: 'colTransactionName', active: false, display: true, width: "" },
          { index: 48, label: 'Customer ID', class: 'colCustomerID', active: false, display: true, width: "" },
          { index: 49, label: 'ConNote', class: 'colConNote', active: false, display: true, width: "" },
          { index: 50, label: 'CheckNo', class: 'CheckNo', active: false, display: true, width: "" },
        ]
        break;
      case "tblProductSales":
        reset_data = [
          { index: 1, label: 'Doc Number', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Transaction~Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Ship~Date', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Customer ID', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Contact Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Address1', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Address2', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Address3', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Ship To City', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'State', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 11, label: 'Zip Code', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Email', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'Phone', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 14, label: 'Sales~Status', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 15, label: 'Rush Order', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 16, label: 'Product ID', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 17, label: 'Barcode', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 18, label: 'Unit of~Measure', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 19, label: 'Ordered', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 20, label: 'Shipped', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 21, label: 'Special~Instruction', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 22, label: 'SaleID', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 23, label: 'Comments', class: 'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "salesreport":
        reset_data = [
          { index: 1, label: 'Customer ID', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Sale Date', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Invoice~Number', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Transaction~Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Customer~Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Amount(Ex)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Tax', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Amount(Inc)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Qty Shipped', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'UOM', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 11, label: 'Product ID', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Catagory', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'Switch', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 14, label: 'Dept', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 15, label: 'Description', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 16, label: 'Employee~Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 17, label: 'Ship Date', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 18, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 19, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 20, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 21, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 22, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 23, label: 'Tax Code', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 24, label: 'Line Tax', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 25, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 26, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 27, label: 'Discount $', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 28, label: 'Discount %', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 29, label: 'Percent', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 30, label: 'Gross', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 31, label: 'Till', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 32, label: 'Area', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 33, label: 'Department Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 34, label: 'Source', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 35, label: 'Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 36, label: 'Sale Id', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 37, label: 'Due Date', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 38, label: 'Sales Ref No', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 39, label: 'Shipped To~ Address', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 40, label: 'Time of Sale', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 41, label: 'Memo', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 42, label: 'Comments', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 43, label: 'Original No', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 44, label: 'PO Number', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 45, label: 'Consignment~ Note', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 46, label: 'Lines Ref No', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 47, label: 'Preferred Supplier', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 48, label: 'Supplier Product code', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 49, label: 'POS Source', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 50, label: 'Warranty Ends On', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 51, label: 'Warranty Period', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 52, label: 'POS Post Code', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 53, label: 'Line~ Ship date', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 54, label: 'Markup $', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 55, label: 'Markup %', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 56, label: 'Run Name', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 57, label: 'Print Name', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 58, label: 'Globalref', class: 'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "tblSalesSummary":
        reset_data = [
          { index: 1, label: 'Weekday', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Cost Amount (Burleigh)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Sold Amount (Burleigh)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Cost Amount (Default)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Sold Amount (Default)', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Total Cost Amount', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Total Sold Amount', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Sold Amount Ex(Default)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 9, label: 'Sales Tax (Default)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 10, label: 'Sold Amount Ex(Hawaii)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 11, label: 'Sales Tax (Hawaii)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 12, label: 'Cost Amount (Los Angeles)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 13, label: 'Sold Amount (Los Angeles)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 14, label: 'Sold Amount Ex(Los Angeles)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 15, label: 'Sales Tax (Los Angeles)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 16, label: 'Cost Amount (New York)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 17, label: 'Sold Amount (New York)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 18, label: 'Sold Amount Ex(New York)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 19, label: 'Sales Tax (New York)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 20, label: 'Cost Amount (Sales One)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 21, label: 'Sold Amount (Sales One)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 22, label: 'Sold Amount Ex(Sales One)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 23, label: 'Sales Tax (Sales One)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 24, label: 'Cost Not Used6', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 25, label: 'Sold Not Used6', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 26, label: 'Sold Not Used6(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 27, label: 'Sold Not Used6(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 28, label: 'Cost Not Used7', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 29, label: 'Sold Not Used7', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 30, label: 'Sold Not Used7(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 31, label: 'Sold Not Used7(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 32, label: 'Cost Not Used8', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 33, label: 'Sold Not Used8', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 34, label: 'Sold Not Used8(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 35, label: 'Sold Not Used8(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 36, label: 'Cost Not Used9', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 37, label: 'Sold Not Used9', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 38, label: 'Sold Not Used9(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 39, label: 'Sold Not Used9(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 40, label: 'Cost Not Used10', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 41, label: 'Sold Not Used10', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 42, label: 'Sold Not Used10(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 43, label: 'Sold Not Used10(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 44, label: 'Cost Not Used11', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 45, label: 'Sold Not Used11', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 46, label: 'Sold Not Used11(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 47, label: 'Sold Not Used11(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 48, label: 'Cost Not Used12', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 49, label: 'Sold Not Used12', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 50, label: 'Sold Not Used12(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 51, label: 'Sold Not Used12(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 52, label: 'Cost Not Used13', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 53, label: 'Sold Not Used13', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 54, label: 'Sold Not Used13(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 55, label: 'Sold Not Used13(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 56, label: 'Cost Not Used14', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 57, label: 'Sold Not Used14', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 58, label: 'Sold Not Used14(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 59, label: 'Sold Not Used14(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 60, label: 'Cost Not Used15', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 61, label: 'Sold Not Used15', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 62, label: 'Sold Not Used15(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 63, label: 'Sold Not Used15(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 64, label: 'Cost Not Used16', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 65, label: 'Sold Not Used16', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 66, label: 'Sold Not Used16(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 67, label: 'Sold Not Used16(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 68, label: 'Cost Not Used17', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 69, label: 'Sold Not Used17', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 70, label: 'Sold Not Used17(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 71, label: 'Sold Not Used17(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 72, label: 'Cost Not Used18', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 73, label: 'Sold Not Used18', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 74, label: 'Sold Not Used18(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 75, label: 'Sold Not Used18(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 76, label: 'Cost Not Used19', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 77, label: 'Sold Not Used19', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 78, label: 'Sold Not Used19(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 79, label: 'Sold Not Used19(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 80, label: 'Cost Not Used20', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 81, label: 'Sold Not Used20', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 82, label: 'Sold Not Used20(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 83, label: 'Sold Not Used20(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 84, label: 'Cost Not Used21', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 85, label: 'Sold Not Used21', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 86, label: 'Sold Not Used21(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 87, label: 'Sold Not Used21(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 88, label: 'Cost Not Used22', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 89, label: 'Sold Not Used22', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 90, label: 'Sold Not Used22(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 91, label: 'Sold Not Used22(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 92, label: 'Cost Not Used23', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 93, label: 'Sold Not Used23', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 94, label: 'Sold Not Used23(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 95, label: 'Sold Not Used23(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 96, label: 'Cost Not Used24', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 97, label: 'Sold Not Used24', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 98, label: 'Sold Not Used24(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 99, label: 'Sold Not Used24(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 100, label: 'Cost Not Used25', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 101, label: 'Sold Not Used25', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 102, label: 'Sold Not Used25(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 103, label: 'Sold Not Used25(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 104, label: 'Cost Not Used26', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 105, label: 'Sold Not Used26', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 106, label: 'Sold Not Used26(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 107, label: 'Sold Not Used26(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 108, label: 'Cost Not Used27', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 109, label: 'Sold Not Used27', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 110, label: 'Sold Not Used27(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 111, label: 'Sold Not Used27(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 112, label: 'Cost Not Used28', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 113, label: 'Sold Not Used28', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 114, label: 'Sold Not Used28(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 115, label: 'Sold Not Used28(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 116, label: 'Cost Not Used29', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 117, label: 'Sold Not Used29', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 118, label: 'Sold Not Used29(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 119, label: 'Sold Not Used29(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 120, label: 'Cost Not Used30', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 121, label: 'Sold Not Used30', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 122, label: 'Sold Not Used30(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 123, label: 'Sold Not Used30(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 124, label: 'Cost Not Used31', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 125, label: 'Sold Not Used31', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 126, label: 'Sold Not Used31(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 127, label: 'Sold Not Used31(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 128, label: 'Cost Not Used32', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 129, label: 'Sold Not Used32', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 130, label: 'Sold Not Used32(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 131, label: 'Sold Not Used32(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 132, label: 'Cost Not Used33', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 133, label: 'Sold Not Used33', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 134, label: 'Sold Not Used33(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 135, label: 'Sold Not Used33(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 136, label: 'Cost Not Used34', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 137, label: 'Sold Not Used34', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 138, label: 'Sold Not Used34(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 139, label: 'Sold Not Used34(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 140, label: 'Cost Not Used35', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 141, label: 'Sold Not Used35', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 142, label: 'Sold Not Used35(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 143, label: 'Sold Not Used35(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 144, label: 'Cost Not Used36', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 145, label: 'Sold Not Used36', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 146, label: 'Sold Not Used36(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 147, label: 'Sold Not Used36(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 148, label: 'Cost Not Used37', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 149, label: 'Sold Not Used37', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 150, label: 'Sold Not Used37(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 151, label: 'Sold Not Used37(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 152, label: 'Cost Not Used38', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 153, label: 'Sold Not Used38', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 154, label: 'Sold Not Used38(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 155, label: 'Sold Not Used38(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 156, label: 'Cost Not Used39', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 157, label: 'Sold Not Used39', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 158, label: 'Sold Not Used39(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 159, label: 'Sold Not Used39(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 160, label: 'Cost Not Used40', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 161, label: 'Sold Not Used40', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 162, label: 'Sold Not Used40(Ex)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 163, label: 'Sold Not Used40(Tax)', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 164, label: 'Total Sold Amount Ex', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 165, label: 'Total Sale Tax', class: 'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "tblAgedPayables":
      case "tblAgedPayablesSummary":
        reset_data = [
          { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "" },
          { index: 2, label: 'Type', class: 'colType', active: true, display: true, width: "" },
          { index: 3, label: 'PO Number', class: 'colPONumber', active: true, display: true, width: "" },
          { index: 4, label: 'Due Date', class: 'colDueDate', active: true, display: true, width: "" },
          { index: 5, label: 'Amount Due', class: 'colAmountDue', active: true, display: true, width: "" },
          { index: 6, label: 'Current', class: 'colCurrent', active: true, display: true, width: "" },
          { index: 7, label: '1-30 Days', class: 'col130Days', active: true, display: true, width: "" },
          { index: 8, label: '30-60 Days', class: 'col3060Days', active: true, display: true, width: "" },
          { index: 9, label: '60-90 Days', class: 'col6090Days', active: true, display: true, width: "" },
          { index: 10, label: '> 90 Days', class: 'col90Days', active: true, display: true, width: "" },
          { index: 11, label: 'Order Date', class: 'colOrderDate', active: true, display: true, width: "" },
          { index: 12, label: 'Invoice Date', class: 'colInvoiceDate', active: true, display: true, width: "" },
          { index: 13, label: 'Original Amount', class: 'colOriginalAmount', active: true, display: true, width: "" },
          { index: 14, label: 'Details', class: 'colDetails', active: false, display: true, width: "" },
          { index: 15, label: 'Invoice Number', class: 'colInvoiceNumber', active: false, display: true, width: "" },
          { index: 16, label: 'Account Name', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 17, label: 'Supplier ID', class: 'colSupplierID', active: false, display: true, width: "" },
          { index: 18, label: 'Terms', class: 'colTerms', active: false, display: true, width: "" },
          { index: 19, label: 'APNotes', class: 'colAPNotes', active: false, display: true, width: "" },
          { index: 20, label: 'Print Name', class: 'colPrintName', active: false, display: true, width: "" },
          { index: 21, label: 'PCStatus', class: 'colPCStatus', active: false, display: true, width: "" },
          { index: 22, label: 'GlobalRef', class: 'colGlobalRef', active: false, display: true, width: "" },
          { index: 23, label: 'POGlobalRef', class: 'colPOGlobalRef', active: false, display: true, width: "" },
        ]
        break;
      case "trialbalance":
        reset_data = [
          { index: 1, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "86" },
          { index: 2, label: 'Account Number', class: 'colAccountNo', active: true, display: true, width: "86" },
          { index: 3, label: 'Account', class: 'colAccount', active: true, display: true, width: "192" },
          { index: 4, label: 'Credits (Ex)', class: 'colCreditsEx', active: true, display: true, width: "137" },
          { index: 5, label: 'Credits (Inc)', class: 'colCreditsInc', active: true, display: true, width: "85" },
          { index: 6, label: 'Debits (Ex)', class: 'colDebitsEx', active: true, display: true, width: "85" },
          { index: 7, label: 'Debits (Inc)', class: 'colDebitsInc', active: true, display: true, width: "85" },
          { index: 8, label: 'Account Name Only', class: 'colAccountNameOnly', active: false, display: true, width: "85" },
          { index: 9, label: 'TransID', class: 'colTransID', active: false, display: true, width: "85" },
        ]
        break;
      case "customerdetailsreport":
        reset_data = [
          { index: 1, label: 'Company Name', class: 'colCompanyName', active: true, display: true, width: "85" },
          { index: 2, label: 'Rep', class: 'colRep', active: true, display: true, width: "85" },
          { index: 3, label: 'Discount Type', class: 'colDiscountType', active: true, display: true, width: "85" },
          { index: 4, label: 'Discount', class: 'colDiscount', active: true, display: true, width: "85" },
          { index: 5, label: 'Special Discount', class: 'colSpecialDiscount', active: true, display: true, width: "85" },
          { index: 6, label: 'Orig Price', class: 'colOrigPrice', active: true, display: true, width: "85" },
          { index: 7, label: 'Line Price', class: 'colLinePrice', active: true, display: true, width: "85" },
          { index: 8, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "85" },
          { index: 9, label: 'Description', class: 'colDescription', active: true, display: true, width: "85" },
          { index: 10, label: 'Sub Group', class: 'colSubGroup', active: true, display: true, width: "85" },
          { index: 11, label: 'Type', class: 'colType', active: true, display: true, width: "85" },
          { index: 12, label: 'Dept', class: 'colDept', active: true, display: true, width: "85" },
          { index: 13, label: 'Customer ID', class: 'colCustomerID', active: false, display: true, width: "85" },
          { index: 14, label: 'Password', class: 'colPassword', active: false, display: true, width: "85" },
          { index: 15, label: 'Test', class: 'colTest', active: false, display: true, width: "85" },
          { index: 16, label: 'Birthday', class: 'colBirthday', active: false, display: true, width: "85" },
        ]
        break;
      case "customersummaryreport":
        reset_data = [
          { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "" },
          { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "" },
          { index: 3, label: 'Rep', class: 'colRep', active: true, display: true, width: "" },
          { index: 4, label: 'Type', class: 'colType', active: true, display: true, width: "" },
          { index: 5, label: 'Invoice Number', class: 'colInvoiceNumber', active: true, display: true, width: "" },
          { index: 6, label: 'SaleDate', class: 'colSaleDate', active: true, display: true, width: "" },
          { index: 7, label: 'DueDate', class: 'colDueDate', active: true, display: true, width: "" },
          { index: 8, label: 'Total Amount (Ex)', class: 'colTotalAEX', active: true, display: true, width: "" },
          { index: 9, label: 'Total Amount (Inc)', class: 'colTotalAInc', active: true, display: true, width: "" },
          { index: 10, label: 'Gross Profit', class: 'colGrossProfit', active: true, display: true, width: "" },
          { index: 11, label: 'Margin', class: 'colMargin', active: true, display: true, width: "" },
          { index: 12, label: 'Address', class: 'colAddress', active: true, display: true, width: "" },
          { index: 13, label: 'Address 2', class: 'colAddress2', active: true, display: true, width: "" },
          { index: 14, label: 'Suburb', class: 'colSuburb', active: true, display: true, width: "" },
          { index: 15, label: 'Postcode', class: 'colPostcode', active: true, display: true, width: "" },
          { index: 16, label: 'State', class: 'colState', active: true, display: true, width: "" },
          { index: 17, label: 'FaxNumber', class: 'colFaxNumber', active: true, display: true, width: "" },
          { index: 18, label: 'Sale ID', class: 'colSaleID', active: false, display: true, width: "" },
          { index: 19, label: 'Customer ID', class: 'colCustomerID', active: false, display: true, width: "" },
          { index: 20, label: 'Address 3', class: 'colAddress3', active: false, display: true, width: "" },
          { index: 21, label: 'Country', class: 'colCountry', active: false, display: true, width: "" },
          { index: 22, label: 'Details', class: 'colDetails', active: false, display: true, width: "" },
          { index: 23, label: 'Client ID', class: 'colClientID', active: false, display: true, width: "" },
          { index: 24, label: 'Markup', class: 'colMarkup', active: false, display: true, width: "" },
          { index: 25, label: 'Last Sale Date', class: 'colLastSaleDate', active: false, display: true, width: "" },
          { index: 26, label: 'Gross Profit(Ex)', class: 'colGrossProfitEx', active: false, display: true, width: "" },
          { index: 27, label: 'Customer Type', class: 'colCustomerType', active: false, display: true, width: "" },
          { index: 28, label: 'Email', class: 'colEmail', active: false, display: true, width: "" },
          { index: 29, label: 'Total Cost', class: 'colTotalCost', active: false, display: true, width: "" },
        ]
        break;
      // case "trialbalance":
      //     reset_data = [
      //       { index: 1, label: 'Account Name', class:'colAccountNo', active: true, display: true, width: "86" },
      //       { index: 2, label: 'Account Number', class:'colDate', active: true, display: true, width: "86" },
      //       { index: 3, label: 'Account', class:'colClientName', active: true, display: true, width: "192" },
      //       { index: 4, label: 'Credits (Ex)', class:'colType', active: true, display: true, width: "137" },
      //       { index: 5, label: 'Credits (Inc)', class:'colDebits', active: true, display: true, width: "85" },
      //       { index: 6, label: 'Debits (Ex)', class:'colCredit', active: true, display: true, width: "85" },
      //       { index: 7, label: 'Debits (Inc)', class:'colAmount', active: true, display: true, width: "85" },
      //       { index: 8, label: 'Account Name Only', class:'colAmount', active: false, display: true, width: "85" },
      //       { index: 9, label: 'TransID', class:'colAmount', active: false, display: true, width: "85" },
      //     ]
      //     break;
      case "customerdetailsreport":
        reset_data = [
          { index: 1, label: 'Company Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Rep', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Discount Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Discount', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Special Discount', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Orig Price', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Line Price', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Product ID', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Description', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'Sub Group', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 11, label: 'Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Dept', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'Customer ID', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 14, label: 'Password', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 15, label: 'Test', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 16, label: 'Birthday', class: 'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "supplierreport":
      case "suppliersummary":
      case "supplierdetail":
        reset_data = [
          { index: 1, label: 'Supplier ID', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Contact Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Phone', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Mobile', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Fax Number', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'AR Balance', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'AP Balance', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Balance', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Street', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'Suburb', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 11, label: 'State', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Postcode', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'Country', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 14, label: 'Bank Account Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 15, label: 'Bank Account BSB', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 16, label: 'Bank Account No', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 17, label: 'Creation Date', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 18, label: 'Active', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 19, label: 'Global Ref', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 20, label: 'Street2', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 21, label: 'Street3', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 22, label: 'No Staff', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 23, label: 'Min Inv value', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 24, label: 'Freight to Store', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 25, label: 'Rebate', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 26, label: 'First Name', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 27, label: 'Last Name', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 28, label: 'Contact Details', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 29, label: 'ABN', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 30, label: 'Print Name', class: 'colAccountName', active: false, display: true, width: "" },
          { index: 31, label: 'ClientID', class: 'colAccountName', active: false, display: true, width: "" },
        ]
        break;
      case "supplierproductreport":
        reset_data = [
          { index: 1, label: 'PO #', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'PO Num', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Supplier ID', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Invoice~Number', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Product ID', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Description', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Tax', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Street', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 10, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 11, label: 'Tax Code', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 12, label: 'Ordered', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 13, label: 'Received', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 14, label: 'Back Order', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 15, label: 'ETA~Date', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 16, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 17, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 18, label: 'Comments', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 19, label: 'Original #', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 20, label: 'Global #', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 21, label: 'Sales~Comments', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 22, label: 'Class Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 23, label: 'Account~Number', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 24, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 25, label: 'Product~Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 26, label: 'Department', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 27, label: 'Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 28, label: 'Manufacturer', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 29, label: 'Deleted', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 30, label: 'Order Date', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 31, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 32, label: 'Tax', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 33, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 34, label: 'Employee~Name', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 35, label: 'Buy Metre', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 36, label: 'Buy Weight', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 37, label: 'Buy Price / Metre', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 39, label: 'Docket~Number', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 40, label: 'Received~Date', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 41, label: 'Barcode', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 42, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 43, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 44, label: 'Cogs', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 45, label: 'Asset', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 46, label: 'Income', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 47, label: 'Cogs', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 48, label: 'Asset', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 49, label: 'Income', class: 'colAccountName', active: true, display: true, width: "" },
        ]
        break;
      case "jobsalessummary":
        reset_data = [
          { index: 1, label: 'Customer ID', class: 'colCustomerID', active: true, display: true, width: "" },
          { index: 2, label: 'Contact Name', class: 'colContactName', active: true, display: true, width: "" },
          { index: 3, label: 'Job Customer Name', class: 'colJobCustomerName', active: true, display: true, width: "" },
          { index: 4, label: 'Job Name', class: 'colJobName', active: true, display: true, width: "" },
          { index: 5, label: 'Sale Date Time', class: 'colSaleDateTime', active: true, display: true, width: "" },
          { index: 6, label: 'Sale Total Ex', class: 'colSaleTotalEx', active: true, display: true, width: "" },
          { index: 7, label: 'Sale Amount Inc', class: 'colSaleAmountInc', active: true, display: true, width: "" },
          { index: 8, label: 'Sale Tax', class: 'colSaleTax', active: true, display: true, width: "" },
          { index: 9, label: 'Sale Cust Field1', class: 'colSaleCustField1', active: true, display: true, width: "" },
          { index: 10, label: 'Sale Cust Field2', class: 'colSaleCustField2', active: true, display: true, width: "" },
          { index: 11, label: 'Sale Cust Field3', class: 'colSaleCustField3', active: true, display: true, width: "" },
          { index: 12, label: 'Sale Cust Field4', class: 'colSaleCustField4', active: true, display: true, width: "" },
          { index: 13, label: 'Sale Cust Field5', class: 'colSaleCustField5', active: true, display: true, width: "" },
          { index: 14, label: 'Sale Cust Field6', class: 'colSaleCustField6', active: true, display: true, width: "" },
          { index: 15, label: 'Sale Cust Field7', class: 'colSaleCustField7', active: true, display: true, width: "" },
          { index: 16, label: 'Sale Cust Field8', class: 'colSaleCustField8', active: true, display: true, width: "" },
          { index: 17, label: 'Sale Cust Field9', class: 'colSaleCustField9', active: true, display: true, width: "" },
          { index: 18, label: 'Sale Cust Field10', class: 'colSaleCustField10', active: true, display: true, width: "" },
          { index: 19, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "" },
          { index: 20, label: 'Uom Qty Shipped', class: 'colUomQtyShipped', active: true, display: true, width: "" },
          { index: 21, label: 'Uom Name', class: 'colUomName', active: true, display: true, width: "" },
          { index: 22, label: 'Amount Ex', class: 'colAmountEx', active: true, display: true, width: "" },
          { index: 23, label: 'Amount Inc', class: 'colAmountInc', active: true, display: true, width: "" },
          { index: 24, label: 'Amount Tax', class: 'colAmountTax', active: true, display: true, width: "" },
          { index: 25, label: 'Tax Code', class: 'colTaxCode', active: true, display: true, width: "" },
          { index: 26, label: 'Amount Discount', class: 'colAmountDiscount', active: true, display: true, width: "" },
          { index: 27, label: 'Discount Per Unit', class: 'colDiscountPerUnit', active: true, display: true, width: "" },
          { index: 28, label: 'DetailType', class: 'colDetailType', active: false, display: true, width: "" },
          { index: 29, label: 'CustomerID', class: 'colCustomerID', active: false, display: true, width: "" },
          { index: 30, label: 'ClientNo', class: 'colClientNo', active: false, display: true, width: "" },
          { index: 31, label: 'CustomerType', class: 'colCustomerType', active: false, display: true, width: "" },
          { index: 32, label: 'CustomerStreet', class: 'colCustomerStreet', active: false, display: true, width: "" },
          { index: 33, label: 'CustomerStreet2', class: 'colCustomerStreet2', active: false, display: true, width: "" },
          { index: 34, label: 'CustomerStreet3', class: 'colCustomerStreet3', active: false, display: true, width: "" },
          { index: 35, label: 'Suburb', class: 'colSuburb', active: false, display: true, width: "" },
          { index: 36, label: 'State', class: 'colState', active: false, display: true, width: "" },
          { index: 37, label: 'CustomerPostcode', class: 'colCustomerPostcode', active: false, display: true, width: "" },
          { index: 39, label: 'JobID', class: 'colJobID', acticve: false, display: true, width: "" },
          { index: 40, label: 'JobClientNo', class: 'colJobClientNo', active: false, display: true, width: "" },
          { index: 41, label: 'JobRegistration', class: 'colJobRegistration', active: false, display: true, width: "" },
          { index: 42, label: 'JobNumber', class: 'colJobNumber', active: false, display: true, width: "" },
          { index: 43, label: 'JobWarrantyPeriod', class: 'colJobWarrantyPeriod', active: false, display: true, width: "" },
          { index: 44, label: 'JobNotes', class: 'colJobNotes', active: false, display: true, width: "" },
          { index: 45, label: 'SaleCustomerName', class: 'colSaleCustomerName', active: false, display: true, width: "" },
          { index: 46, label: 'SaleDate', class: 'colSaleDate', active: false, display: true, width: "" },
          { index: 47, label: 'SaleDepartment', class: 'colSaleDepartment', active: false, display: true, width: "" },
          { index: 48, label: 'SaleComments', class: 'colSaleComments', active: false, display: true, width: "" },
          { index: 49, label: 'SaleTerms', class: 'colSaleTerms', active: false, display: true, width: "" },
          { index: 50, label: 'SaleCustomerName', class: 'colSaleCustomerName', active: false, display: true, width: "" },
          { index: 51, label: 'DocketNumber', class: 'colDocketNumber', active: false, display: true, width: "" },
          { index: 52, label: 'MemoLine', class: 'colMemoLine', active: false, display: true, width: "" },
          { index: 53, label: 'UomQtySold', class: 'colUomQtySold', active: false, display: true, width: "" },
          { index: 54, label: 'UomQtyBackorder ', class: 'colUomQtyBackorder', active: false, display: true, width: "" },
        ]
        break;
      case "jobprofitabilityreport":
        reset_data = [
          { index: 1, label: 'Company Name', class: 'colCompanyName', active: true, display: true, width: "85" },
          { index: 2, label: 'Job Name', class: 'colJobName', active: true, display: true, width: "85" },
          { index: 3, label: 'Job Number', class: 'colJobNumber', active: true, display: true, width: "85" },
          { index: 4, label: 'Txn Type', class: 'colTxnType', active: true, display: true, width: "85" },
          { index: 5, label: 'Txn No', class: 'colTxnNo', active: true, display: true, width: "85" },
          { index: 6, label: 'Cost Ex', class: 'colCostEx', active: true, display: true, width: "85" },
          { index: 7, label: 'Income Ex', class: 'colIncomeEx', active: true, display: true, width: "85" },
          { index: 8, label: 'Quoted Ex', class: 'colQuotedEx', active: true, display: true, width: "85" },
          { index: 9, label: 'Diff Inc Cost', class: 'colDiffIncCost', active: true, display: true, width: "85" },
          { index: 10, label: '%Diff Inc By Cost', class: 'colDiffIncByCost', active: true, display: true, width: "85" },
          { index: 11, label: 'Diff Inc Quote', class: 'colDiffIncQuote', active: true, display: true, width: "85" },
          { index: 12, label: '%Diff Inc By Quote', class: 'colDiffIncByQuote', active: true, display: true, width: "85" },
          { index: 13, label: 'Backorders', class: 'colBackorders', active: true, display: true, width: "85" },
          { index: 14, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "85" },
          { index: 15, label: 'Debit Ex', class: 'colDebitEx', active: true, display: true, width: "85" },
          { index: 16, label: 'Credit Ex', class: 'colCreditEx', active: true, display: true, width: "85" },
          { index: 17, label: 'Profit %', class: 'colProfitpercent', active: true, display: true, width: "85" },
          { index: 18, label: 'Department', class: 'colDepartment', active: true, display: true, width: "85" },
          { index: 19, label: 'Product', class: 'colProduct', active: true, display: true, width: "85" },
          { index: 20, label: 'Sub  Group', class: 'colSubGroup', active: true, display: true, width: "85" },
          { index: 21, label: 'Type', class: 'colType', active: true, display: true, width: "85" },
          { index: 22, label: 'Dept', class: 'colDept', active: true, display: true, width: "85" },
          { index: 23, label: 'Area', class: 'colArea', active: true, display: true, width: "85" },
          { index: 24, label: 'Landed Cost', class: 'colLandedCost', active: true, display: true, width: "85" },
          { index: 25, label: 'Latestcost', class: 'colLatestcost', active: true, display: true, width: "85" },
          { index: 26, label: 'First Name', class: 'colFirstName', active: true, display: true, width: "85" },
          { index: 27, label: 'Last Name', class: 'colLastName', active: true, display: true, width: "85" },
          { index: 28, label: 'Diff Inc Landedcost', class: 'colDiffIncLandedcost', active: true, display: true, width: "85" },
          { index: 29, label: '%Diff Inc By Landedcost', class: 'colDiffIncByLandedcost', active: true, display: true, width: "85" },
          { index: 30, label: 'Diff Inc Latestcost', class: 'colDiffIncLatestcost', active: true, display: true, width: "85" },
          { index: 31, label: '%Diff Inc By Latestcost', class: 'colDiffIncByLatestcost', active: true, display: true, width: "85" },
          { index: 32, label: 'Ordered', class: 'colOrderd', active: true, display: true, width: "85" },
          { index: 33, label: 'Shipped', class: 'colShipped', active: true, display: true, width: "85" },
          { index: 34, label: 'Back Ordered', class: 'colBackOrdered', active: true, display: true, width: "85" },
          { index: 35, label: 'CUSTFLD1', class: 'colCUSTFLD1', active: true, display: true, width: "85" },
          { index: 36, label: 'CUSTFLD2', class: 'colCUSTFLD2', active: true, display: true, width: "85" },
          { index: 37, label: 'CUSTFLD3', class: 'colCUSTFLD3', active: true, display: true, width: "85" },
          { index: 39, label: 'CUSTFLD4', class: 'colCUSTFLD4', acticve: true, display: true, width: "85" },
          { index: 40, label: 'CUSTFLD5', class: 'colCUSTFLD5', active: true, display: true, width: "85" },
          { index: 41, label: 'CUSTFLD6', class: 'colCUSTFLD6', active: true, display: true, width: "85" },
          { index: 42, label: 'CUSTFLD7', class: 'colCUSTFLD7', active: true, display: true, width: "85" },
          { index: 43, label: 'CUSTFLD8', class: 'colCUSTFLD8', active: true, display: true, width: "85" },
          { index: 44, label: 'JobNotes', class: 'colJobNotes', active: true, display: true, width: "85" },
          { index: 45, label: 'CUSTFLD9', class: 'colCUSTFLD9', active: true, display: true, width: "85" },
          { index: 46, label: 'CUSTFLD10', class: 'colCUSTFLD10', active: true, display: true, width: "85" },
          { index: 47, label: 'CUSTFLD11', class: 'colCUSTFLD11', active: true, display: true, width: "85" },
          { index: 48, label: 'CUSTFLD12', class: 'colCUSTFLD12', active: true, display: true, width: "85" },
          { index: 49, label: 'CUSTFLD13', class: 'colCUSTFLD13', active: true, display: true, width: "85" },
          { index: 50, label: 'CUSTFLD14', class: 'colCUSTFLD14', active: true, display: true, width: "85" },
          { index: 51, label: 'CUSTFLD15', class: 'colCUSTFLD15', active: true, display: true, width: "85" },
          { index: 52, label: 'Profit $', class: 'colProfitdoller', active: true, display: true, width: "85" },
        ]
        break;
      case "binlocationslist":
        reset_data = [
          { index: 1, label: 'Department', class: 'colDepartment', active: true, display: true, width: "" },
          { index: 2, label: 'Location', class: 'colLocation', active: true, display: true, width: "" },
          { index: 3, label: 'Bin Number', class: 'colBinNumber', active: true, display: true, width: "" },
          { index: 4, label: 'Volume Total', class: 'colVolumeTotal', active: true, display: true, width: "" },
          { index: 5, label: 'Volume Used', class: 'colVolumeUsed', active: true, display: true, width: "" },
          { index: 6, label: 'Volume Available', class: 'colVolumeAvailable', active: true, display: true, width: "" },
          { index: 7, label: 'Active', class: 'colActive', active: true, display: true, width: "" },
          { index: 8, label: 'GlobalRef', class: 'colGlobalRef', active: false, display: true, width: "" },
          { index: 9, label: 'BinID', class: 'colBinID', active: false, display: true, width: "" },
          { index: 10, label: 'ClassID', class: 'colClassID', active: false, display: true, width: "" },
        ]
        break;
      case "stockmovementreport":
        reset_data = [
          { index: 1, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "" },
          { index: 2, label: 'Transaction Type', class: 'colTrType', active: true, display: true, width: "" },
          { index: 3, label: 'Transaction No', class: 'colTrNo', active: true, display: true, width: "" },
          { index: 4, label: 'Quantity Opening', class: 'colOpening', active: true, display: true, width: "" },
          { index: 5, label: 'Quantity Current', class: 'colCurrent', active: true, display: true, width: "" },
          { index: 6, label: 'Quantity Running', class: 'colRunning', active: true, display: true, width: "" },
          { index: 7, label: 'Average Unit Cost', class: 'colAvUnitCost', active: true, display: true, width: "" },
          { index: 8, label: 'Average Total Cost', class: 'colAvTotalCost', active: true, display: true, width: "" },
          { index: 9, label: 'Amount(Ex) Unit Cost', class: 'colAmUnitCost', active: true, display: true, width: "" },
          { index: 10, label: 'Amount(Ex) Total Cost', class: 'colAmTotalCost', active: true, display: true, width: "" },
          { index: 11, label: 'Department Name', class: 'colDepartmentName', active: false, display: true, width: "" },
          { index: 12, label: 'TransDate', class: 'colTransDate', active: false, display: true, width: "" },
          { index: 13, label: 'Actual Date', class: 'colActualDate', active: false, display: true, width: "" },
          { index: 14, label: 'Sub Group', class: 'colSubGroup', active: false, display: true, width: "" },
          { index: 15, label: 'Type', class: 'colType', active: false, display: true, width: "" },
          { index: 16, label: 'Dept', class: 'colDept', active: false, display: true, width: "" },
        ]
        break;
      case "stockquantitybylocation":
        reset_data = [
          { index: 1, label: 'Department', class: 'colDepartment', active: true, display: true, width: "" },
          { index: 2, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "" },
          { index: 3, label: 'Parts Description', class: 'colDescription', active: true, display: true, width: "" },
          { index: 4, label: 'UOM', class: 'colUOM', active: true, display: true, width: "" },
          { index: 5, label: 'Manufacture', class: 'colManufacture', active: true, display: true, width: "" },
          { index: 6, label: 'Products Type', class: 'colProductsType', active: true, display: true, width: "" },
          { index: 7, label: 'Products Dept', class: 'colProductsDept', active: true, display: true, width: "" },
          { index: 8, label: 'Batch No', class: 'colBatchNo', active: true, display: true, width: "" },
          { index: 9, label: 'Expiry Date', class: 'colExpiryDate', active: true, display: true, width: "" },
          { index: 10, label: 'Location', class: 'colLocation', active: true, display: true, width: "" },
          { index: 11, label: 'No', class: 'colNo', active: true, display: true, width: "" },
          { index: 11, label: 'Serial~No', class: 'colSerialNo', active: true, display: true, width: "" },
          { index: 12, label: 'Cost', class: 'colCost', active: true, display: true, width: "" },
          { index: 13, label: 'Value', class: 'colValue', active: true, display: true, width: "" },
          { index: 14, label: 'Sales Order', class: 'colSalesOrder', active: true, display: true, width: "" },
          { index: 15, label: 'In-Stock', class: 'colInStock', active: true, display: true, width: "" },
          { index: 16, label: 'If read as UOM', class: 'colIfreadasUOM', active: true, display: true, width: "" },
          { index: 17, label: 'Multiplier', class: 'colMultiplier', active: true, display: true, width: "" },
          { index: 18, label: 'If read as Units', class: 'colIfreadasUnits1', active: true, display: true, width: "" },
          { index: 19, label: 'If read as Units', class: 'colIfreadasUnits2', active: true, display: true, width: "" },
          { index: 20, label: 'Multiplier', class: 'colMultiplier', active: true, display: true, width: "" },
          { index: 21, label: 'If read as UOM', class: 'colIfreadasUOM2', active: true, display: true, width: "" },
          { index: 22, label: 'In-Stock', class: 'colIn-stock', active: true, display: true, width: "" },
          { index: 23, label: 'Sales Order', class: 'colSalesOrder', active: true, display: true, width: "" },
          { index: 24, label: 'Available', class: 'colAvailable', active: true, display: true, width: "" },
          { index: 25, label: 'UOMMultiplier', class: 'colUOMMultiplier', active: false, display: true, width: "" },
          { index: 26, label: 'Unit Volume', class: 'colUnitVolume', active: false, display: true, width: "" },
          { index: 27, label: 'Volume~ Available Qty', class: 'colVolumeAvailableQty', active: false, display: true, width: "" },
          { index: 28, label: 'Volume~ Instock Qty', class: 'colVolumeINstockQty', active: false, display: true, width: "" },
          { index: 29, label: 'Part Type', class: 'colPartType', active: false, display: true, width: "" },
          { index: 30, label: 'Truck Load No', class: 'colTruckLoadNo', active: false, display: true, width: "" },
          { index: 31, label: 'Expiry Date', class: 'colExpiryDate', active: false, display: true, width: "" },
          { index: 32, label: 'SOQty', class: 'colSQQty', active: false, display: true, width: "" },
          { index: 33, label: 'Instock Qty', class: 'colInstockQty2', active: false, display: true, width: "" },
          { index: 34, label: 'Allocated UOMQty', class: 'colAllocatedUOMQty', active: false, display: true, width: "" },
          { index: 35, label: 'Allocated SOUOMQty', class: 'colAllocatedSOUOMQty', active: false, display: true, width: "" },
          { index: 36, label: 'Allocated In Stock UOMQty', class: 'colAllocatedInStockUOMQty', active: false, display: true, width: "" },
          { index: 37, label: 'Bin', class: 'colBin', active: false, display: true, width: "" },
          { index: 39, label: 'Batch', class: 'colBatch', acticve: false, display: true, width: "" },
          { index: 39, label: 'SN', class: 'colSn', acticve: false, display: true, width: "" },
          { index: 40, label: 'Preferred Supplier', class: 'colPreferredsupplier', active: false, display: true, width: "" },
          { index: 41, label: 'Print Name', class: 'colPrintName', active: false, display: true, width: "" },
        ]
        break;
      case "stockvaluereport":
        reset_data = [
          { index: 1, label: 'Department Name', class: 'colDepartmentName', active: true, display: true, width: "" },
          { index: 2, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "" },
          { index: 3, label: 'Trans Type', class: 'colTransType', active: true, display: true, width: "" },
          { index: 4, label: 'Qty', class: 'colQty', active: true, display: true, width: "" },
          { index: 5, label: 'Running Qty', class: 'colRunningQty', active: true, display: true, width: "" },
          { index: 6, label: 'Unit Cost~When Posted', class: 'colUnitCostWhenPosted', active: true, display: true, width: "" },
          { index: 7, label: 'Todays Unit~Avg Cost', class: 'colTodaysUnitAvgCost', active: true, display: true, width: "" },
          { index: 8, label: 'Total Cost~When Posted', class: 'colTotalCostWhenPosted', active: true, display: true, width: "" },
          { index: 9, label: 'Todays Total~Avg Cost', class: 'colTodaysTotalAvgCost', active: true, display: true, width: "" },
          { index: 10, label: 'Trans Date', class: 'colTransDate', active: true, display: true, width: "" },
          { index: 11, label: 'Transaction No', class: 'colTransactionNo', active: false, display: true, width: "" },
          { index: 12, label: 'Opening', class: 'colOpenning', active: false, display: true, width: "" },
          { index: 13, label: 'Actual Date', class: 'colActualDate', active: false, display: true, width: "" },
          { index: 14, label: 'Sub Group', class: 'colSubGroup', active: false, display: true, width: "" },
          { index: 15, label: 'Type', class: 'colType', active: false, display: true, width: "" },
          { index: 16, label: 'Dept', class: 'colDept', active: false, display: true, width: "" },
        ]
        break;
      case "payrollhistory":
        reset_data = [
          { index: 1, label: 'LastName', class: 'colLastName', active: true, display: true, width: "" },
          { index: 2, label: 'FirstName', class: 'colFirstName', active: true, display: true, width: "" },
          { index: 3, label: 'G/L', class: 'colGL', active: true, display: true, width: "" },
          { index: 4, label: 'Date Paid', class: 'colDatePaid', active: true, display: true, width: "" },
          { index: 5, label: 'Gross', class: 'colGross', active: true, display: true, width: "" },
          { index: 6, label: 'Tax', class: 'colTax', active: true, display: true, width: "" },
          { index: 7, label: 'Wages', class: 'colWages', active: true, display: true, width: "" },
          { index: 8, label: 'Commission', class: 'colCommission', active: true, display: true, width: "" },
          { index: 9, label: 'Deductions', class: 'colDeductions', active: true, display: true, width: "" },
          { index: 10, label: 'Allowances', class: 'colAllowances', active: true, display: true, width: "" },
          { index: 11, label: 'CDEP', class: 'colCDEP', active: true, display: true, width: "" },
          { index: 11, label: 'Sundries', class: 'colSundries', active: true, display: true, width: "" },
          { index: 12, label: 'Superannuation', class: 'colSuperannuation', active: true, display: true, width: "" },
          { index: 12, label: 'ClassName', class: 'colClassName', active: true, display: true, width: "" },
          { index: 13, label: 'PayPeriod', class: 'colPayPeriod', active: true, display: true, width: "" },
          { index: 14, label: 'PayNo', class: 'colPayNo', active: true, display: true, width: "" },
          { index: 15, label: 'Splits', class: 'colSplits', active: true, display: true, width: "" },
          { index: 16, label: 'Deleted', class: 'colDeleted', active: true, display: true, width: "" },
          { index: 17, label: 'Global Ref', class: 'colGlobalRef', active: false, display: true, width: "" },
          { index: 18, label: 'Employee Name', class: 'colEmployeeName', active: false, display: true, width: "" },
          { index: 19, label: 'Pay Date', class: 'PayDate', active: false, display: true, width: "" },
          { index: 20, label: 'Pay Periods', class: 'colPayPeriods', active: false, display: true, width: "" },
          { index: 21, label: 'Salary Sacrifice', class: 'colSalarySacrifice', active: false, display: true, width: "" },
          { index: 22, label: 'Workplacegiving', class: 'colWorkplacegiving', active: false, display: true, width: "" },
          { index: 23, label: 'Net Comb', class: 'colNetComb', active: false, display: true, width: "" },
          { index: 24, label: 'Net Only', class: 'colNetOnly', active: false, display: true, width: "" },
          { index: 25, label: 'Paid', class: 'colPaid', active: false, display: true, width: "" },
          { index: 26, label: 'Pay', class: 'colPay', active: false, display: true, width: "" },
          { index: 27, label: 'Test staff', class: 'colTeststaff', active: false, display: true, width: "" },
          { index: 28, label: 'Customer ID Tax', class: 'colCustomerIDTax', active: false, display: true, width: "" },
          { index: 29, label: 'PAYG Tax', class: 'colPaygTax', active: false, display: true, width: "" },
          { index: 30, label: 'BSB', class: 'colBSB', active: false, display: true, width: "" },
          { index: 31, label: 'BankAccNo', class: 'colBankAccNo', active: false, display: true, width: "" },
          { index: 32, label: 'Employee ID', class: 'colEmployeeID', active: false, display: true, width: "" },
        ]
        break;
      case "PayrollLeaveAccrued":
        reset_data = [
          { index: 1, label: 'Accrued Date', class: 'colAccruedDate', active: true, display: true, width: "" },
          { index: 2, label: 'Leave Type', class: 'colLeaveType', active: true, display: true, width: "" },
          { index: 3, label: 'Employee', class: 'colEmployee', active: true, display: true, width: "" },
          { index: 4, label: 'Pay No', class: 'colPayNo', active: true, display: true, width: "" },
          { index: 5, label: 'Accrued Type', class: 'colAccruedType', active: true, display: true, width: "" },
          { index: 6, label: 'Hours', class: 'colHours', active: true, display: true, width: "" },
          { index: 7, label: 'Value', class: 'colValue', active: true, display: true, width: "" },
        ]
        break;
      case "tblpayrollLeaveTaken":
        reset_data = [
          { index: 1, label: 'Employee Name', class: 'colEmployeeName', active: true, display: true, width: "" },
          { index: 2, label: 'Pay Date', class: 'colPayDate', active: true, display: true, width: "" },
          { index: 3, label: 'Date Taken', class: 'colDateTaken', active: true, display: true, width: "" },
          { index: 4, label: 'Leave Type', class: 'colLeaveType', active: true, display: true, width: "" },
          { index: 5, label: 'Hours', class: 'colHours', active: true, display: true, width: "" },
          { index: 6, label: 'Is Certified', class: 'colIsCertified', active: true, display: true, width: "" },
          { index: 7, label: 'Pay ID', class: 'colPayID', active: false, display: true, width: "" },
          { index: 8, label: 'Employee ID', class: 'colEmployeeED', active: false, display: true, width: "" },
        ]
        break;
      case "tbl1099Contractor":
        reset_data = [
          { index: 1, label: 'Company', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 2, label: 'Type', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 3, label: 'Payment', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 4, label: 'Date', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 5, label: 'Method', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 6, label: 'Bill Street', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 7, label: 'Bill Place', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 8, label: 'Card Amount', class: 'colAccountName', active: true, display: true, width: "" },
          { index: 9, label: 'Non Card Amount', class: 'colAccountName', active: true, display: true, width: "" },
        ]
        break;
      case "tblTimeSheetSummary":
        reset_data = [
          { index: 1, label: 'Entry Date', class: 'colEntryDate', active: true, display: true, width: "85" },
          { index: 2, label: 'Type', class: 'colType', active: true, display: true, width: "85" },
          { index: 3, label: 'Entered by', class: 'colEnteredby', active: true, display: true, width: "85" },
          { index: 4, label: 'Job', class: 'colJob', active: true, display: true, width: "85" },
          { index: 5, label: 'Timesheet Date', class: 'colTimesheetDate', active: true, display: true, width: "85" },
          { index: 6, label: 'Hours', class: 'colHours', active: true, display: true, width: "85" },
          { index: 7, label: 'Active', class: 'colActive', active: true, display: true, width: "85" },
          { index: 8, label: 'Total', class: 'colTotal', active: true, display: true, width: "85" },
          { index: 9, label: 'Employee Name', class: 'colEmployee', active: true, display: true, width: "85" },
          { index: 10, label: 'Labour Cost', class: 'colLabourCost', active: true, display: true, width: "85" },
          { index: 11, label: 'Department Name', class: 'colDepartmentName', active: true, display: true, width: "85" },
          { index: 12, label: 'Service Name', class: 'colServiceName', active: true, display: true, width: "85" },
          { index: 13, label: 'Service Date', class: 'colServiceDate', active: true, display: true, width: "85" },
          { index: 14, label: 'Charge Rate', class: 'colChargeRate', active: true, display: true, width: "85" },
          { index: 15, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "85" },
          { index: 16, label: 'Product Description', class: 'colProductDescription', active: true, display: true, width: "85" },
          { index: 17, label: 'Use Time Cost', class: 'colUseTimeCost', active: true, display: true, width: "85" },
          { index: 18, label: 'Tax', class: 'colTax', active: true, display: true, width: "85" },
          { index: 19, label: 'Pay Rate Type Name', class: 'colPayRateTypeName', active: true, display: true, width: "85" },
          { index: 20, label: 'Hourly Rate', class: 'colHourlyRate', active: true, display: true, width: "85" },
          { index: 21, label: 'Super Inc', class: 'colSuperInc', active: true, display: true, width: "85" },
          { index: 22, label: 'Super Amount', class: 'colSuperAmount', active: true, display: true, width: "85" },
          { index: 23, label: 'Notes', class: 'colNotes', active: true, display: true, width: "85" },
          { index: 24, label: 'Qty', class: 'colQty', active: true, display: true, width: "85" },
          { index: 25, label: 'Equipment', class: 'colEquipment', active: true, display: true, width: "85" },
          { index: 26, label: 'Total Service Charge', class: 'colTotalServiceCharge', active: true, display: true, width: "85" },
          { index: 27, label: 'Timesheet Entry ID', class: 'colTimesheetEntryID', active: true, display: true, width: "85" },
          { index: 28, label: 'Repair #', class: 'colRepair', active: true, display: true, width: "85" },
          { index: 29, label: 'Area', class: 'colArea', active: false, display: true, width: "85" },
          { index: 30, label: 'ContactName', class: 'colContactName', active: false, display: true, width: "85" },
        ]
        break;
      case "fxhistorylist":
        reset_data = [
          { index: 1, label: 'Company', class: 'colCompany', active: true, display: true, width: "" },
          { index: 2, label: 'Currency', class: 'colCurrency', active: true, display: true, width: "" },
          { index: 3, label: 'Code', class: 'colCode', active: true, display: true, width: "" },
          { index: 4, label: 'Buy Rate', class: 'colBuyRate', active: true, display: true, width: "" },
          { index: 5, label: 'Sell Rate', class: 'colSellRate', active: true, display: true, width: "" },
          { index: 6, label: 'Rate Last Modified', class: 'colRateLastModified', active: true, display: true, width: "" },
          { index: 7, label: 'Active', class: 'colActive', active: true, display: true, width: "" },
          { index: 8, label: 'Global Ref', class: 'colGlobalRef', active: false, display: true, width: "" },
          { index: 9, label: 'Currency Symbol', class: 'colCurrencySymbol', active: false, display: true, width: "" },
          { index: 10, label: 'Currency ID', class: 'colCurrencyID', active: false, display: true, width: "" },
          { index: 11, label: 'Edited Flag', class: 'colEditedFlag', active: false, display: true, width: "" },
        ]
        break;
      default:
        break;
    }
    templateObject.reset_data.set(reset_data);
  }
  templateObject.init_reset_data();

  // custom field displaysettings

  templateObject.initCustomFieldDisplaySettings = function (data, listType) {
    //function initCustomFieldDisplaySettings(data, listType) {
    let templateObject = Template.instance();
    let reset_data = templateObject.reset_data.get();
    templateObject.showCustomFieldDisplaySettings(reset_data);

    // try {

    //   getVS1Data("VS1_Customize").then(function (dataObject) {
    //     if (dataObject.length == 0) {
    //       sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')), listType).then(function (data) {
    //           reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
    //           templateObject.showCustomFieldDisplaySettings(reset_data);
    //           console.log("display-1: ", templateObject.report_displayfields.get());
    //       }).catch(function (err) {
    //       });
    //     } else {
    //       let data = JSON.parse(dataObject[0].data);
    //       if(data.ProcessLog.Obj.CustomLayout.length > 0){
    //        for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
    //          if(data.ProcessLog.Obj.CustomLayout[i].TableName == listType){
    //            reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
    //            templateObject.showCustomFieldDisplaySettings(reset_data);
    //            console.log("display-2: ", templateObject.report_displayfields.get());
    //          }
    //        }
    //      };
    //     }
    //   });

    // } catch (error) {
    // }
    return;
  }
  templateObject.showCustomFieldDisplaySettings = async function (reset_data) {
    let custFields = [];
    let customData = {};
    let customFieldCount = reset_data.length;
    console.log("===============================>", reset_data);

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
  // 'click .btnOpenReportSettings': async function (event, template) {
  //     console.log("=====================================");
  //     let templateObject = Template.instance();
  //     let currenttranstablename = templateObject.data.tablename||"";
  //     $(`#${currenttranstablename} thead tr th`).each(function (index) {
  //       var $tblrow = $(this);
  //       var colWidth = $tblrow.width() || 0;
  //       var colthClass = $tblrow.attr('data-class') || "";
  //       $('.rngRange' + colthClass).val(colWidth);
  //     });
  //    $('.'+templateObject.data.tablename+'_Modal').modal('toggle');
  // },
  // 'change .custom-range': async function(event) {
  //   const tableHandler = new TableHandler();
  //   let range = $(event.target).val()||0;
  //   let colClassName = $(event.target).attr("valueclass");
  //   await $('.' + colClassName).css('width', range);
  //   $('.dataTable').resizable();
  // },
  'click .btnOpenReportSettings': () => {
    let templateObject = Template.instance();
    // let currenttranstablename = templateObject.data.tablename||";
    $(`thead tr th`).each(function (index) {
      var $tblrow = $(this);
      var colWidth = $tblrow.width() || 0;
      var colthClass = $tblrow.attr('data-class') || "";
      $('.rngRange' + colthClass).val(colWidth);
    });
    $('.' + templateObject.data.tablename + '_Modal').modal('toggle');

  },
  // 'change .custom-range': async function(event) {
  // //   const tableHandler = new TableHandler();
  //   let range = $(event.target).val()||0;
  //   let colClassName = $(event.target).attr("valueclass");
  //   await $('.' + colClassName).css('width', range);
  //   $('.dataTable').resizable();
  // },
  // 'click .chkDatatable': function(event) {
  //     let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
  //     if ($(event.target).is(':checked')) {
  //       $('.'+columnDataValue).addClass('showColumn');
  //       $('.'+columnDataValue).removeClass('hiddenColumn');
  //     } else {
  //       $('.'+columnDataValue).addClass('hiddenColumn');
  //       $('.'+columnDataValue).removeClass('showColumn');
  //     }
  // },
  "blur .divcolumn": async function (event) {
    const templateObject = Template.instance();
    let columData = $(event.target).text();
    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr("custid");
    let currenttablename = await templateObject.tablename.get() || '';
    var datable = $('#' + currenttablename).DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  'click .resetTable': async function (event) {
    let templateObject = Template.instance();
    let reset_data = templateObject.reset_data.get();
    let currenttablename = await templateObject.tablename.get() || '';
    //reset_data[9].display = false;
    reset_data = reset_data.filter(redata => redata.display);
    $(".displaySettings").each(function (index) {
      let $tblrow = $(this);
      $tblrow.find(".divcolumn").text(reset_data[index].label);
      $tblrow.find(".custom-control-input").prop("checked", reset_data[index].active);

      let title = $('#' + currenttablename).find("th").eq(index);
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
  "click .saveTable": async function (event) {
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
    lineItems.sort((a, b) => a.index - b.index);
    let erpGet = erpDb();
    let tableName = await templateObject.tablename.get() || '';
    let employeeId = parseInt(Session.get('mySessionEmployeeLoggedID')) || 0;
    let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);

    if (added) {
      sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')), '').then(function (dataCustomize) {
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
          $('#' + tableName + '_Modal').modal('hide');
        }
      });
    } else {
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
  companyname: () => {
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
