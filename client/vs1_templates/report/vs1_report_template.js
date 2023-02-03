import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { ReportService } from "../../reports/report-service";
import TableHandler from '../../js/Table/TableHandler';
import moment from 'moment';
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './vs1_report_template.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
  let currenttablename = "100";
  let displaytablename = "100";
  templateObject.isAccountingMoreOption.set(false);
  templateObject.isTaxCodeOption.set(false);
  if (url.includes("/taxsummaryreport")) {
    templateObject.isAccountingMoreOption.set(true);
    templateObject.isTaxCodeOption.set(true);
  };

  currenttablename = templateObject.data.tablename || "100";
  displaytablename = templateObject.data.tabledisplayname || "100";

  templateObject.tablename.set(currenttablename);
  templateObject.tabledisplayname.set(displaytablename);

  // set initial table rest_data
  templateObject.init_reset_data = function () {
    let reset_data = [];
    switch (currenttablename) {
      case "tblgeneralledger":
        reset_data = [
          { index: 1, label: 'Account ID', class: 'colAccountID', active: false, display: true, width: "155" },
          { index: 2, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "110" },
          { index: 3, label: 'Account No', class: 'colAccountNo', active: true, display: true, width: "85" },
          { index: 4, label: 'Accounts', class: 'colAccounts', active: false, display: true, width: "85" },
          { index: 5, label: 'Amount (Inc)', class: 'colAmountInc', active: false, display: true, width: "120" },
          { index: 6, label: 'Cheque Number', class: 'colChequeNumber', active: false, display: true, width: "85" },
          { index: 7, label: 'Department', class: 'colDepartment', active: false, display: true, width: "100" },
          { index: 8, label: 'Class ID', class: 'colClassID', active: false, display: true, width: "85" },
          { index: 12, label: 'Date', class: 'colDate', active: true, display: true, width: "85" },
          { index: 9, label: 'Client Name', class: 'colProductDescription', active: true, display: true, width: "120" },
          { index: 31, label: 'Type', class: 'colType', active: true, display: true, width: "85" },
          { index: 10, label: 'Credits ', class: 'colCreditEx', active: true, display: true, width: "85" },
          { index: 11, label: 'Credits (Inc)', class: 'colCreditInc', active: false, display: true, width: "85" },
          { index: 13, label: 'Debits ', class: 'colDebitsEx', active: true, display: true, width: "85" },
          { index: 14, label: 'Amount ', class: 'colAmountEx', active: true, display: true, width: "85" },
          { index: 15, label: 'Debits (Inc)', class: 'colDebitsInc', active: false, display: true, width: "85" },
          { index: 16, label: 'Details', class: 'colDetails', active: false, display: true, width: "85" },
          { index: 17, label: 'FixedAsset ID', class: 'colFixedAssetID', active: false, display: true, width: "85" },
          { index: 18, label: 'Global Ref', class: 'colGlobalRef', active: false, display: true, width: "85" },
          { index: 19, label: 'ID', class: 'colID', active: false, display: true, width: "50" },
          { index: 20, label: 'Memo', class: 'colMemo', active: false, display: true, width: "85" },
          { index: 21, label: 'Payment ID', class: 'colPaymentID', active: false, display: true, width: "85" },
          { index: 22, label: 'PrepaymentID', class: 'colPrepaymentID', active: false, display: true, width: "85" },
          { index: 23, label: 'Product Description', class: 'colCredit', active: false, display: true, width: "150" },
          { index: 24, label: 'Product ID', class: 'colProductID', active: false, display: true, width: "120" },
          { index: 25, label: 'Purchase Order ID', class: 'colPurchaseOrderID', active: false, display: true, width: "150" },
          { index: 26, label: 'Ref No', class: 'colRefNo', active: false, display: true, width: "85" },
          { index: 27, label: 'Rep Name', class: 'colRepName', active: false, display: true, width: "85" },
          { index: 28, label: 'Sale ID', class: 'colSaleID', active: false, display: true, width: "85" },
          { index: 29, label: 'Tax Code', class: 'colTaxCode', active: false, display: true, width: "150" },
          { index: 30, label: 'Tax Rate', class: 'colTaxRate', active: false, display: true, width: "85" }
        ];
        break;
      case "taxSummary":
        reset_data = [
          { index: 1, label: 'TaxCode', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 2, label: 'INPUTS Ex (Purchases)', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 3, label: 'INPUTS Inc (Purchases)', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 4, label: 'OUTPUTS Ex  (Sales)', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 5, label: 'OUTPUTS Inc (Sales)', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 6, label: 'Total Net', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 7, label: 'Total Tax', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 8, label: 'TaxRate', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 9, label: 'Total Tax1', class: 'colAccountName', active: false, display: true, width: "100" },
          { index: 10, label: 'ID', class: 'colAccountName', active: false, display: true, width: "100" },
        ]
        break;
      case "tblBalanceSheet":
        reset_data = [
          { index: 1, label: 'ACCNAME', class: 'colACCNAME', active: true, display: true, width: "85" },
          { index: 2, label: 'Account Tree', class: 'colAccountTree', active: true, display: true, width: "250" },
          { index: 3, label: 'Account No', class: 'colAccountNo', active: true, display: true, width: "100" },
          { index: 4, label: 'Header-Account-Totals', class: 'colHeaderAccountTotals', active: true, display: true, width: "200" },
          { index: 5, label: 'ID', class: 'colID', active: true, display: true, width: "85" },
          { index: 6, label: 'SortID', class: 'colSortID', active: true, display: true, width: "85" },
          { index: 7, label: 'Sub-Account-Totals', class: 'colSubAccountTotals', active: true, display: true, width: "200" },
          { index: 8, label: 'Total ~Assets &~Liabilities', class: 'colTotalAssets', active: true, display: true, width: "200" },
          { index: 9, label: 'Total Current~Assets &~Liabilities', class: 'colTotalCurrentAssets', active: true, display: true, width: "300" },
          { index: 10, label: 'TypeID', class: 'colTypeID', active: true, display: true, width: "85" },
        ]
        break;
      case "transactionjournallist":
        reset_data = [
          { index: 1, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
          { index: 2, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 3, label: 'Type', class: 'colType', active: true, display: true, width: "100" },
          { index: 4, label: 'Debits (Ex)', class: 'colDebitsEx', active: true, display: true, width: "100" },
          { index: 5, label: 'Debits (Inc)', class: 'colDebitsInc', active: true, display: true, width: "100" },
          { index: 6, label: 'Credits (Ex)', class: 'colCreditsEx', active: true, display: true, width: "100" },
          { index: 7, label: 'Credits (Inc)', class: 'colCreditsInc', active: true, display: true, width: "100" },
          { index: 8, label: 'Global Ref', class: 'colGlobalRef', active: true, display: true, width: "100" },
          { index: 9, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
          { index: 10, label: 'Client Name', class: 'colClientName', active: false, display: true, width: "100" },
          { index: 11, label: 'Account Number', class: 'colAccountName', active: false, display: true, width: "100" },
          { index: 12, label: 'Tax Code', class: 'colTaxCode', active: false, display: true, width: "100" },
          { index: 13, label: 'Product Desc', class: 'colProductDesc', active: false, display: true, width: "100" },
          { index: 14, label: 'Account Type', class: 'colAccuntType', active: false, display: true, width: "100" },
          { index: 15, label: 'Trans Time Stamp', class: 'colTransTimeStamp', active: false, display: true, width: "100" },
          { index: 16, label: 'Employee Name', class: 'colEmployeeName', active: false, display: true, width: "100" },
          { index: 17, label: 'Department', class: 'colDepartment', active: false, display: true, width: "100" },
          { index: 18, label: 'Memo', class: 'colMemo', active: false, display: true, width: "100" },
          { index: 19, label: 'Reference No', class: 'colReferencNo', active: false, display: true, width: "100" },
          { index: 20, label: 'FixedAssetId', class: 'colfixedAssetID', active: false, display: true, width: "100" },
        ]
        break;
      case "tblAgedReceivables":
      case "tblAgedReceivablesSummary":
        reset_data = [
          { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "100" },
          { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "100" },
          { index: 3, label: 'AR Notes', class: 'colARNotes', active: true, display: true, width: "100" },
          { index: 4, label: 'Amount~Due', class: 'colAmountDue', active: true, display: true, width: "100" },
          { index: 5, label: 'Current', class: 'colCurrent', active: true, display: true, width: "100" },
          { index: 6, label: '1-30 Days', class: 'col1-30Days', active: true, display: true, width: "100" },
          { index: 7, label: '30-60 Days', class: 'col30-60Days', active: true, display: true, width: "100" },
          { index: 8, label: '60-90 Days', class: 'col60-90Days', active: true, display: true, width: "100" },
          { index: 9, label: '> 90 Days', class: 'col90Days', active: true, display: true, width: "100" },
          { index: 10, label: 'Avg Days Customer~Takes to pay', class: 'colAvgDaysCustomer', active: false, display: true, width: "100" },
          { index: 11, label: 'Invoice#', class: 'colInvoice', active: true, display: true, width: "100" },
          { index: 12, label: 'Rep Name', class: 'colRepName', active: true, display: true, width: "100" },
          { index: 13, label: 'FaxNumber', class: 'colFaxNumber', active: true, display: true, width: "100" },
          { index: 14, label: 'Mobile', class: 'colMobile', active: true, display: true, width: "100" },
          { index: 15, label: 'AltPhone', class: 'colAltPhone', active: true, display: true, width: "100" },
          { index: 16, label: 'StopCredit', class: 'colStopCredit', active: true, display: true, width: "100" },
          { index: 17, label: 'CreditLimit', class: 'colCreditLimit', active: true, display: true, width: "100" },
          { index: 18, label: 'Cust Type', class: 'colCustType', active: false, display: true, width: "100" },
          { index: 19, label: 'P.O. No#', class: 'colPONo', active: false, display: true, width: "100" },
          { index: 20, label: 'Sale Date', class: 'colSaleDate', active: false, display: true, width: "100" },
          { index: 21, label: 'Due Date', class: 'colDueDate', active: false, display: true, width: "100" },
          { index: 22, label: 'Type', class: 'colType', active: false, display: true, width: "100" },
          { index: 23, label: 'Pre-pay#', class: 'colPre-pay', active: false, display: true, width: "100" },
          { index: 24, label: 'Original Amount', class: 'colOriginalAmount', active: false, display: true, width: "100" },
          { index: 25, label: '1-7 Days', class: 'col1-7Days', active: false, display: true, width: "100" },
          { index: 26, label: '7-14 Days', class: 'col7-14Days', active: false, display: true, width: "100" },
          { index: 27, label: '14-21 Days', class: 'col14-21Days', active: false, display: true, width: "100" },
          { index: 28, label: '>21 Days', class: 'col21Days', active: false, display: true, width: "100" },
          { index: 29, label: 'Expiration Date', class: 'colExpirationDate', active: false, display: true, width: "100" },
          { index: 30, label: 'Reg NY', class: 'colRegNY', active: false, display: true, width: "100" },
          { index: 31, label: 'adv emails', class: 'coladvemails', active: false, display: true, width: "100" },
          { index: 32, label: 'Length', class: 'colLength', active: false, display: true, width: "100" },
          { index: 33, label: 'Width', class: 'colWidth', active: false, display: true, width: "100" },
          { index: 34, label: 'Height', class: 'colHeight', active: false, display: true, width: "100" },
          { index: 35, label: 'Region', class: 'colRegion', active: false, display: true, width: "100" },
          { index: 36, label: 'Account~ Name', class: 'colAccountName', active: false, display: true, width: "100" },
          { index: 37, label: 'Overdue~ Surcharge', class: 'colOverdueSurcharge', active: false, display: true, width: "100" },
          { index: 38, label: 'Shipping', class: 'colShipping', active: false, display: true, width: "100" },
          { index: 39, label: 'Terms', class: 'colTerms', active: false, display: true, width: "100" },
          { index: 40, label: 'Related Name', class: 'colRelatedName', active: false, display: true, width: "100" },
          { index: 41, label: 'Department', class: 'colDepartment', active: false, display: true, width: "100" },
          { index: 42, label: 'Status', class: 'colStatus', active: false, display: true, width: "100" },
          { index: 43, label: 'Customer Account No', class: 'colCustomerAccountNo', active: false, display: true, width: "100" },
          { index: 44, label: 'Email', class: 'colEmail', active: false, display: true, width: "100" },
          { index: 45, label: 'Overdue~ Surcharge~ Desc', class: 'colOverdueSurchargeDesc', active: false, display: true, width: "100" },
          { index: 46, label: 'Print Name', class: 'colPrintName', active: false, display: true, width: "100" },
          { index: 47, label: 'TransactionName', class: 'colTransactionName', active: false, display: true, width: "100" },
          { index: 48, label: 'Customer ID', class: 'colCustomerID', active: false, display: true, width: "100" },
          { index: 49, label: 'ConNote', class: 'colConNote', active: false, display: true, width: "100" },
          { index: 50, label: 'CheckNo', class: 'CheckNo', active: false, display: true, width: "100" },
        ]
        break;
      case "tblProductSales":
        reset_data = [
          { index: 1, label: 'Doc Number', class: 'colDocNumber', active: true, display: true, width: "100" },
          { index: 2, label: 'Transaction~Type', class: 'colTransactionType', active: true, display: true, width: "100" },
          { index: 3, label: 'Ship~Date', class: 'colShipDate', active: true, display: true, width: "100" },
          { index: 4, label: 'Customer ID', class: 'colCustomerID', active: true, display: true, width: "100" },
          { index: 5, label: 'Contact Name', class: 'colContractName', active: true, display: true, width: "100" },
          { index: 6, label: 'Address1', class: 'colAddress1', active: true, display: true, width: "100" },
          { index: 7, label: 'Address2', class: 'colAddress2', active: true, display: true, width: "100" },
          { index: 8, label: 'Address3', class: 'colAddress3', active: true, display: true, width: "100" },
          { index: 9, label: 'Ship To City', class: 'colShipToCity', active: true, display: true, width: "100" },
          { index: 10, label: 'State', class: 'colState', active: false, display: true, width: "100" },
          { index: 11, label: 'Zip Code', class: 'colZipCode', active: true, display: true, width: "100" },
          { index: 12, label: 'Email', class: 'colEmail', active: true, display: true, width: "100" },
          { index: 13, label: 'Phone', class: 'colPhone', active: true, display: true, width: "100" },
          { index: 14, label: 'Sales~Status', class: 'colSalesStatus', active: true, display: true, width: "100" },
          { index: 15, label: 'Rush Order', class: 'colRushOrder', active: true, display: true, width: "100" },
          { index: 16, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
          { index: 17, label: 'Barcode', class: 'colBarcode', active: true, display: true, width: "100" },
          { index: 18, label: 'Unit of~Measure', class: 'colUnitofMeasure', active: true, display: true, width: "100" },
          { index: 19, label: 'Ordered', class: 'colOrdered', active: true, display: true, width: "100" },
          { index: 20, label: 'Shipped', class: 'colShipped', active: true, display: true, width: "100" },
          { index: 21, label: 'Special~Instruction', class: 'colSpecialInstruction', active: true, display: true, width: "100" },
          { index: 22, label: 'SaleID', class: 'colSaleID', active: false, display: true, width: "100" },
          { index: 23, label: 'Comments', class: 'colComments', active: false, display: true, width: "100" },
        ]
        break;
      case "salesreport":
        reset_data = [
          { index: 1, label: 'Customer ID', class: 'colCustomerID', active: true, display: true, width: "100" },
          { index: 2, label: 'Sale Date', class: 'colSaleDate', active: true, display: true, width: "100" },
          { index: 3, label: 'Invoice~Number', class: 'colInvoiceNumber', active: true, display: true, width: "100" },
          { index: 4, label: 'Transaction~Type', class: 'colTransactionType', active: true, display: true, width: "100" },
          { index: 5, label: 'Customer~Type', class: 'colCustomerType', active: true, display: true, width: "100" },
          { index: 6, label: 'Amount(Ex)', class: 'colAmountEx', active: true, display: true, width: "100" },
          { index: 7, label: 'Tax', class: 'colTax', active: true, display: true, width: "100" },
          { index: 8, label: 'Amount(Inc)', class: 'colAmountInc', active: true, display: true, width: "100" },
          { index: 9, label: 'Qty Shipped', class: 'colQtyShipped', active: true, display: true, width: "100" },
          { index: 10, label: 'UOM', class: 'colUOM', active: false, display: true, width: "100" },
          { index: 11, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
          { index: 12, label: 'Catagory', class: 'colCatagory', active: true, display: true, width: "100" },
          { index: 13, label: 'Switch', class: 'colSwitch', active: true, display: true, width: "100" },
          { index: 14, label: 'Dept', class: 'colDept', active: true, display: true, width: "100" },
          { index: 15, label: 'Description', class: 'colDescription', active: true, display: true, width: "100" },
          { index: 16, label: 'Employee~Name', class: 'colEmployeeName', active: true, display: true, width: "100" },
          { index: 17, label: 'Ship Date', class: 'colShipDate', active: true, display: true, width: "100" },
          { index: 18, label: 'Ex', class: 'colEx', active: false, display: true, width: "100" },
          { index: 19, label: 'Inc', class: 'colInc', active: false, display: true, width: "100" },
          { index: 20, label: 'Ex', class: 'colEx', active: false, display: true, width: "100" },
          { index: 21, label: 'Inc', class: 'colInc', active: false, display: true, width: "100" },
          { index: 22, label: 'Ex', class: 'colEx', active: false, display: true, width: "100" },
          { index: 23, label: 'Tax Code', class: 'colTaxCode', active: true, display: true, width: "100" },
          { index: 24, label: 'Line Tax', class: 'colLineTax', active: true, display: true, width: "100" },
          { index: 25, label: 'Ex', class: 'colEx', active: false, display: true, width: "100" },
          { index: 26, label: 'Inc', class: 'colInc', active: false, display: true, width: "100" },
          { index: 27, label: 'Discount $', class: 'colDiscountdollar', active: true, display: true, width: "100" },
          { index: 28, label: 'Discount %', class: 'colDiscountpercent', active: true, display: true, width: "100" },
          { index: 29, label: 'Percent', class: 'colPercent', active: true, display: true, width: "100" },
          { index: 30, label: 'Gross', class: 'colGross', active: true, display: true, width: "100" },
          { index: 31, label: 'Till', class: 'colTill', active: true, display: true, width: "100" },
          { index: 32, label: 'Area', class: 'colArea', active: true, display: true, width: "100" },
          { index: 33, label: 'Department Name', class: 'colDepartment', active: true, display: true, width: "100" },
          { index: 34, label: 'Source', class: 'colSource', active: true, display: true, width: "100" },
          { index: 35, label: 'Type', class: 'colType', active: true, display: true, width: "100" },
          { index: 36, label: 'Sale Id', class: 'colSaleID', active: false, display: true, width: "100" },
          { index: 37, label: 'Due Date', class: 'colDueDate', active: false, display: true, width: "100" },
          { index: 38, label: 'Sales Ref No', class: 'colSalesRefNo', active: false, display: true, width: "100" },
          { index: 39, label: 'Shipped To~ Address', class: 'colShippedToAddress', active: false, display: true, width: "100" },
          { index: 40, label: 'Time of Sale', class: 'colTimeofSale', active: false, display: true, width: "100" },
          { index: 41, label: 'Memo', class: 'colMemo', active: false, display: true, width: "100" },
          { index: 42, label: 'Comments', class: 'colComments', active: false, display: true, width: "100" },
          { index: 43, label: 'Original No', class: 'colOriginalNo', active: false, display: true, width: "100" },
          { index: 44, label: 'PO Number', class: 'colPONumber', active: false, display: true, width: "100" },
          { index: 45, label: 'Consignment~ Note', class: 'colConsignmentNote', active: false, display: true, width: "100" },
          { index: 46, label: 'Lines Ref No', class: 'colLinesRefNo', active: false, display: true, width: "100" },
          { index: 47, label: 'Preferred Supplier', class: 'colPreferredSupplier', active: false, display: true, width: "100" },
          { index: 48, label: 'Supplier Product code', class: 'colSupplierProductCode', active: false, display: true, width: "100" },
          { index: 49, label: 'POS Source', class: 'colPOSSource', active: false, display: true, width: "100" },
          { index: 50, label: 'Warranty Ends On', class: 'colWarrantyEnsOn', active: false, display: true, width: "100" },
          { index: 51, label: 'Warranty Period', class: 'colWarrantyPeriod', active: false, display: true, width: "100" },
          { index: 52, label: 'POS Post Code', class: 'colPOSPostCode', active: false, display: true, width: "100" },
          { index: 53, label: 'Line~ Ship date', class: 'colLineShipDate', active: false, display: true, width: "100" },
          { index: 54, label: 'Markup $', class: 'colMarkupdollar', active: false, display: true, width: "100" },
          { index: 55, label: 'Markup %', class: 'colMarkuppercent', active: false, display: true, width: "100" },
          { index: 56, label: 'Run Name', class: 'colRunName', active: false, display: true, width: "100" },
          { index: 57, label: 'Print Name', class: 'colPrintName', active: false, display: true, width: "100" },
          { index: 58, label: 'Globalref', class: 'colGlobalref', active: false, display: true, width: "100" },
        ]
        break;
      case "tblSalesSummary":
        reset_data = [
          { index: 1, label: 'Weekday', class: 'colWeekday', active: true, display: true, width: "100" },
          { index: 2, label: 'Cost Amount (Burleigh)', class: 'colCostAmountBurleigh', active: true, display: true, width: "100" },
          { index: 3, label: 'Sold Amount (Burleigh)', class: 'colSoldAmountBurleigh', active: true, display: true, width: "100" },
          { index: 4, label: 'Cost Amount (Default)', class: 'colCostAmountDefault', active: true, display: true, width: "100" },
          { index: 5, label: 'Sold Amount (Default)', class: 'colSoldAmountDefault', active: true, display: true, width: "100" },
          { index: 6, label: 'Total Cost Amount', class: 'colTotalCostAmount', active: true, display: true, width: "100" },
          { index: 7, label: 'Total Sold Amount', class: 'colTotalSoldAmount', active: true, display: true, width: "100" },
          { index: 8, label: 'Sold Amount Ex(Default)', class: 'colSoldAmountExDefault', active: false, display: true, width: "100" },
          { index: 9, label: 'Sales Tax (Default)', class: 'colSalesTaxDefault', active: false, display: true, width: "100" },
          { index: 10, label: 'Sold Amount Ex(Hawaii)', class: 'colSoldAmountExHawaii', active: false, display: true, width: "100" },
          { index: 11, label: 'Sales Tax (Hawaii)', class: 'colSalesTaxHawaii', active: false, display: true, width: "100" },
          { index: 12, label: 'Cost Amount (Los Angeles)', class: 'colCostAmountLosAngels', active: false, display: true, width: "100" },
          { index: 13, label: 'Sold Amount (Los Angeles)', class: 'colSoldAmountLosAngels', active: false, display: true, width: "100" },
          { index: 14, label: 'Sold Amount Ex(Los Angeles)', class: 'colSoldAmountExLosAngels', active: false, display: true, width: "100" },
          { index: 15, label: 'Sales Tax (Los Angeles)', class: 'colSalesTaxLosAngels', active: false, display: true, width: "100" },
          { index: 16, label: 'Cost Amount (New York)', class: 'colCostAmountNewYork', active: false, display: true, width: "100" },
          { index: 17, label: 'Sold Amount (New York)', class: 'colSoldAmountNewYork', active: false, display: true, width: "100" },
          { index: 18, label: 'Sold Amount Ex(New York)', class: 'colSoldAmountExNewYork', active: false, display: true, width: "100" },
          { index: 19, label: 'Sales Tax (New York)', class: 'colSalesTaxNewYork', active: false, display: true, width: "100" },
          { index: 20, label: 'Cost Amount (Sales One)', class: 'colCostAmountSalesOne', active: false, display: true, width: "100" },
          { index: 21, label: 'Sold Amount (Sales One)', class: 'colSoldAmountSalesOne', active: false, display: true, width: "100" },
          { index: 22, label: 'Sold Amount Ex(Sales One)', class: 'colSoldAmountSalesExOne', active: false, display: true, width: "100" },
          { index: 23, label: 'Sales Tax (Sales One)', class: 'colSalesTaxSalesOne', active: false, display: true, width: "100" },
          { index: 24, label: 'Cost Not Used6', class: 'colCostNotUsed6', active: false, display: true, width: "100" },
          { index: 25, label: 'Sold Not Used6', class: 'colSoldNotUsed6', active: false, display: true, width: "100" },
          { index: 26, label: 'Sold Not Used6(Ex)', class: 'colSoldNotUsed6Ex', active: false, display: true, width: "100" },
          { index: 27, label: 'Sold Not Used6(Tax)', class: 'colSoldNotUsed6Tax', active: false, display: true, width: "100" },
          { index: 28, label: 'Cost Not Used7', class: 'colCostNotUsed7', active: false, display: true, width: "100" },
          { index: 29, label: 'Sold Not Used7', class: 'colSoldNotUsed7', active: false, display: true, width: "100" },
          { index: 30, label: 'Sold Not Used7(Ex)', class: 'colSoldNotUsed7Ex', active: false, display: true, width: "100" },
          { index: 31, label: 'Sold Not Used7(Tax)', class: 'colSoldNotUsed7Tax', active: false, display: true, width: "100" },
          { index: 32, label: 'Cost Not Used8', class: 'colCostNotUsed8', active: false, display: true, width: "100" },
          { index: 33, label: 'Sold Not Used8', class: 'colSoldNotUsed8', active: false, display: true, width: "100" },
          { index: 34, label: 'Sold Not Used8(Ex)', class: 'colSoldNotUsed8Ex', active: false, display: true, width: "100" },
          { index: 35, label: 'Sold Not Used8(Tax)', class: 'colSoldNotUsed8Tax', active: false, display: true, width: "100" },
          { index: 36, label: 'Cost Not Used9', class: 'colCostNotUsed9', active: false, display: true, width: "100" },
          { index: 37, label: 'Sold Not Used9', class: 'colSoldNotUsed9', active: false, display: true, width: "100" },
          { index: 38, label: 'Sold Not Used9(Ex)', class: 'colSoldNotUsed9Ex', active: false, display: true, width: "100" },
          { index: 39, label: 'Sold Not Used9(Tax)', class: 'colSoldNotUsed9Tax', active: false, display: true, width: "100" },
          { index: 40, label: 'Cost Not Used10', class: 'colCostNotUsed10', active: false, display: true, width: "100" },
          { index: 41, label: 'Sold Not Used10', class: 'colSoldNotUsed10', active: false, display: true, width: "100" },
          { index: 42, label: 'Sold Not Used10(Ex)', class: 'colSoldNotUsed10Ex', active: false, display: true, width: "100" },
          { index: 43, label: 'Sold Not Used10(Tax)', class: 'colSoldNotUsed10Tax', active: false, display: true, width: "100" },
          { index: 44, label: 'Cost Not Used11', class: 'colCostNotUsed11', active: false, display: true, width: "100" },
          { index: 45, label: 'Sold Not Used11', class: 'colSoldNotUsed11', active: false, display: true, width: "100" },
          { index: 46, label: 'Sold Not Used11(Ex)', class: 'colSoldNotUsed11Ex', active: false, display: true, width: "100" },
          { index: 47, label: 'Sold Not Used11(Tax)', class: 'colSoldNotUsed11Tax', active: false, display: true, width: "100" },
          { index: 48, label: 'Cost Not Used12', class: 'colCostNotUsed12', active: false, display: true, width: "100" },
          { index: 49, label: 'Sold Not Used12', class: 'colSoldNotUsed12', active: false, display: true, width: "100" },
          { index: 50, label: 'Sold Not Used12(Ex)', class: 'colSoldNotUsed12Ex', active: false, display: true, width: "100" },
          { index: 51, label: 'Sold Not Used12(Tax)', class: 'colSoldNotUsed12Tax', active: false, display: true, width: "100" },
          { index: 52, label: 'Cost Not Used13', class: 'colCostNotUsed13', active: false, display: true, width: "100" },
          { index: 53, label: 'Sold Not Used13', class: 'colSoldNotUsed13', active: false, display: true, width: "100" },
          { index: 54, label: 'Sold Not Used13(Ex)', class: 'colSoldNotUsed13Ex', active: false, display: true, width: "100" },
          { index: 55, label: 'Sold Not Used13(Tax)', class: 'colSoldNotUsed13Tax', active: false, display: true, width: "100" },
          { index: 56, label: 'Cost Not Used14', class: 'colCostNotUsed14', active: false, display: true, width: "100" },
          { index: 57, label: 'Sold Not Used14', class: 'colSoldNotUsed14', active: false, display: true, width: "100" },
          { index: 58, label: 'Sold Not Used14(Ex)', class: 'colSoldNotUsed14Ex', active: false, display: true, width: "100" },
          { index: 59, label: 'Sold Not Used14(Tax)', class: 'colSoldNotUsed14Tax', active: false, display: true, width: "100" },
          { index: 60, label: 'Cost Not Used15', class: 'colCostNotUsed15', active: false, display: true, width: "100" },
          { index: 61, label: 'Sold Not Used15', class: 'colSoldNotUsed15', active: false, display: true, width: "100" },
          { index: 62, label: 'Sold Not Used15(Ex)', class: 'colSoldNotUsed15Ex', active: false, display: true, width: "100" },
          { index: 63, label: 'Sold Not Used15(Tax)', class: 'colSoldNotUsed15Tax', active: false, display: true, width: "100" },
          { index: 64, label: 'Cost Not Used16', class: 'colCostNotUsed16', active: false, display: true, width: "100" },
          { index: 65, label: 'Sold Not Used16', class: 'colSoldNotUsed16', active: false, display: true, width: "100" },
          { index: 66, label: 'Sold Not Used16(Ex)', class: 'colSoldNotUsed16Ex', active: false, display: true, width: "100" },
          { index: 67, label: 'Sold Not Used16(Tax)', class: 'colSoldNotUsed16Tax', active: false, display: true, width: "100" },
          { index: 68, label: 'Cost Not Used17', class: 'colCostNotUsed17', active: false, display: true, width: "100" },
          { index: 69, label: 'Sold Not Used17', class: 'colSoldNotUsed17', active: false, display: true, width: "100" },
          { index: 70, label: 'Sold Not Used17(Ex)', class: 'colSoldNotUsed17Ex', active: false, display: true, width: "100" },
          { index: 71, label: 'Sold Not Used17(Tax)', class: 'colSoldNotUsed17Tax', active: false, display: true, width: "100" },
          { index: 72, label: 'Cost Not Used18', class: 'colCostNotUsed18', active: false, display: true, width: "100" },
          { index: 73, label: 'Sold Not Used18', class: 'colSoldNotUsed18', active: false, display: true, width: "100" },
          { index: 74, label: 'Sold Not Used18(Ex)', class: 'colSoldNotUsed18Ex', active: false, display: true, width: "100" },
          { index: 75, label: 'Sold Not Used18(Tax)', class: 'colSoldNotUsed18Tax', active: false, display: true, width: "100" },
          { index: 76, label: 'Cost Not Used19', class: 'colCostNotUsed19', active: false, display: true, width: "100" },
          { index: 77, label: 'Sold Not Used19', class: 'colSoldNotUsed19', active: false, display: true, width: "100" },
          { index: 78, label: 'Sold Not Used19(Ex)', class: 'colSoldNotUsed19Ex', active: false, display: true, width: "100" },
          { index: 79, label: 'Sold Not Used19(Tax)', class: 'colSoldNotUsed19Tax', active: false, display: true, width: "100" },
          { index: 80, label: 'Cost Not Used20', class: 'colCostNotUsed20', active: false, display: true, width: "100" },
          { index: 81, label: 'Sold Not Used20', class: 'colSoldNotUsed20', active: false, display: true, width: "100" },
          { index: 82, label: 'Sold Not Used20(Ex)', class: 'colSoldNotUsed20Ex', active: false, display: true, width: "100" },
          { index: 83, label: 'Sold Not Used20(Tax)', class: 'colSoldNotUsed20Tax', active: false, display: true, width: "100" },
          { index: 84, label: 'Cost Not Used21', class: 'colCostNotUsed21', active: false, display: true, width: "100" },
          { index: 85, label: 'Sold Not Used21', class: 'colSoldNotUsed21', active: false, display: true, width: "100" },
          { index: 86, label: 'Sold Not Used21(Ex)', class: 'colSoldNotUsed21Ex', active: false, display: true, width: "100" },
          { index: 87, label: 'Sold Not Used21(Tax)', class: 'colSoldNotUsed21Tax', active: false, display: true, width: "100" },
          { index: 88, label: 'Cost Not Used22', class: 'colCostNotUsed22', active: false, display: true, width: "100" },
          { index: 89, label: 'Sold Not Used22', class: 'colSoldNotUsed22', active: false, display: true, width: "100" },
          { index: 90, label: 'Sold Not Used22(Ex)', class: 'colSoldNotUsed22Ex', active: false, display: true, width: "100" },
          { index: 91, label: 'Sold Not Used22(Tax)', class: 'colSoldNotUsed22Tax', active: false, display: true, width: "100" },
          { index: 92, label: 'Cost Not Used23', class: 'colCostNotUsed23', active: false, display: true, width: "100" },
          { index: 93, label: 'Sold Not Used23', class: 'colSoldNotUsed23', active: false, display: true, width: "100" },
          { index: 94, label: 'Sold Not Used23(Ex)', class: 'colSoldNotUsed23Ex', active: false, display: true, width: "100" },
          { index: 95, label: 'Sold Not Used23(Tax)', class: 'colSoldNotUsed23Tax', active: false, display: true, width: "100" },
          { index: 96, label: 'Cost Not Used24', class: 'colCostNotUsed24', active: false, display: true, width: "100" },
          { index: 97, label: 'Sold Not Used24', class: 'colSoldNotUsed24', active: false, display: true, width: "100" },
          { index: 98, label: 'Sold Not Used24(Ex)', class: 'colSoldNotUsed24Ex', active: false, display: true, width: "100" },
          { index: 99, label: 'Sold Not Used24(Tax)', class: 'colSoldNotUsed24Tax', active: false, display: true, width: "100" },
          { index: 100, label: 'Cost Not Used25', class: 'colCostNotUsed25', active: false, display: true, width: "100" },
          { index: 101, label: 'Sold Not Used25', class: 'colSoldNotUsed25', active: false, display: true, width: "100" },
          { index: 102, label: 'Sold Not Used25(Ex)', class: 'colSoldNotUsed25Ex', active: false, display: true, width: "100" },
          { index: 103, label: 'Sold Not Used25(Tax)', class: 'colSoldNotUsed25Tax', active: false, display: true, width: "100" },
          { index: 104, label: 'Cost Not Used26', class: 'colCostNotUsed26', active: false, display: true, width: "100" },
          { index: 105, label: 'Sold Not Used26', class: 'colSoldNotUsed26', active: false, display: true, width: "100" },
          { index: 106, label: 'Sold Not Used26(Ex)', class: 'colSoldNotUsed26Ex', active: false, display: true, width: "100" },
          { index: 107, label: 'Sold Not Used26(Tax)', class: 'colSoldNotUsed26Tax', active: false, display: true, width: "100" },
          { index: 108, label: 'Cost Not Used27', class: 'colCostNotUsed27', active: false, display: true, width: "100" },
          { index: 109, label: 'Sold Not Used27', class: 'colSoldNotUsed27', active: false, display: true, width: "100" },
          { index: 110, label: 'Sold Not Used27(Ex)', class: 'colSoldNotUsed27Ex', active: false, display: true, width: "100" },
          { index: 111, label: 'Sold Not Used27(Tax)', class: 'colSoldNotUsed27Tax', active: false, display: true, width: "100" },
          { index: 112, label: 'Cost Not Used28', class: 'colCostNotUsed28', active: false, display: true, width: "100" },
          { index: 113, label: 'Sold Not Used28', class: 'colSoldNotUsed28', active: false, display: true, width: "100" },
          { index: 114, label: 'Sold Not Used28(Ex)', class: 'colSoldNotUsed28Ex', active: false, display: true, width: "100" },
          { index: 115, label: 'Sold Not Used28(Tax)', class: 'colSoldNotUsed28Tax', active: false, display: true, width: "100" },
          { index: 116, label: 'Cost Not Used29', class: 'colCostNotUsed29', active: false, display: true, width: "100" },
          { index: 117, label: 'Sold Not Used29', class: 'colSoldNotUsed29', active: false, display: true, width: "100" },
          { index: 118, label: 'Sold Not Used29(Ex)', class: 'colSoldNotUsed29Ex', active: false, display: true, width: "100" },
          { index: 119, label: 'Sold Not Used29(Tax)', class: 'colSoldNotUsed29Tax', active: false, display: true, width: "100" },
          { index: 120, label: 'Cost Not Used30', class: 'colCostNotUsed30', active: false, display: true, width: "100" },
          { index: 121, label: 'Sold Not Used30', class: 'colSoldNotUsed30', active: false, display: true, width: "100" },
          { index: 122, label: 'Sold Not Used30(Ex)', class: 'colSoldNotUsed30Ex', active: false, display: true, width: "100" },
          { index: 123, label: 'Sold Not Used30(Tax)', class: 'colSoldNotUsed30Tax', active: false, display: true, width: "100" },
          { index: 124, label: 'Cost Not Used31', class: 'colCostNotUsed31', active: false, display: true, width: "100" },
          { index: 125, label: 'Sold Not Used31', class: 'colSoldNotUsed31', active: false, display: true, width: "100" },
          { index: 126, label: 'Sold Not Used31(Ex)', class: 'colSoldNotUsed31Ex', active: false, display: true, width: "100" },
          { index: 127, label: 'Sold Not Used31(Tax)', class: 'colSoldNotUsed31Tax', active: false, display: true, width: "100" },
          { index: 128, label: 'Cost Not Used32', class: 'colCostNotUsed32', active: false, display: true, width: "100" },
          { index: 129, label: 'Sold Not Used32', class: 'colSoldNotUsed32', active: false, display: true, width: "100" },
          { index: 130, label: 'Sold Not Used32(Ex)', class: 'colSoldNotUsed32Ex', active: false, display: true, width: "100" },
          { index: 131, label: 'Sold Not Used32(Tax)', class: 'colSoldNotUsed32Tax', active: false, display: true, width: "100" },
          { index: 132, label: 'Cost Not Used33', class: 'colCostNotUsed33', active: false, display: true, width: "100" },
          { index: 133, label: 'Sold Not Used33', class: 'colSoldNotUsed33', active: false, display: true, width: "100" },
          { index: 134, label: 'Sold Not Used33(Ex)', class: 'colSoldNotUsed33Ex', active: false, display: true, width: "100" },
          { index: 135, label: 'Sold Not Used33(Tax)', class: 'colSoldNotUsed33Tax', active: false, display: true, width: "100" },
          { index: 136, label: 'Cost Not Used34', class: 'colCostNotUsed34', active: false, display: true, width: "100" },
          { index: 137, label: 'Sold Not Used34', class: 'colSoldNotUsed34', active: false, display: true, width: "100" },
          { index: 138, label: 'Sold Not Used34(Ex)', class: 'colSoldNotUsed34Ex', active: false, display: true, width: "100" },
          { index: 139, label: 'Sold Not Used34(Tax)', class: 'colSoldNotUsed34Tax', active: false, display: true, width: "100" },
          { index: 140, label: 'Cost Not Used35', class: 'colCostNotUsed35', active: false, display: true, width: "100" },
          { index: 141, label: 'Sold Not Used35', class: 'colSoldNotUsed35', active: false, display: true, width: "100" },
          { index: 142, label: 'Sold Not Used35(Ex)', class: 'colSoldNotUsed35Ex', active: false, display: true, width: "100" },
          { index: 143, label: 'Sold Not Used35(Tax)', class: 'colSoldNotUsed35Tax', active: false, display: true, width: "100" },
          { index: 144, label: 'Cost Not Used36', class: 'colCostNotUsed36', active: false, display: true, width: "100" },
          { index: 145, label: 'Sold Not Used36', class: 'colSoldNotUsed36', active: false, display: true, width: "100" },
          { index: 146, label: 'Sold Not Used36(Ex)', class: 'colSoldNotUsed36Ex', active: false, display: true, width: "100" },
          { index: 147, label: 'Sold Not Used36(Tax)', class: 'colSoldNotUsed36Tax', active: false, display: true, width: "100" },
          { index: 148, label: 'Cost Not Used37', class: 'colCostNotUsed37', active: false, display: true, width: "100" },
          { index: 149, label: 'Sold Not Used37', class: 'colSoldNotUsed37', active: false, display: true, width: "100" },
          { index: 150, label: 'Sold Not Used37(Ex)', class: 'colSoldNotUsed37Ex', active: false, display: true, width: "100" },
          { index: 151, label: 'Sold Not Used37(Tax)', class: 'colSoldNotUsed37Tax', active: false, display: true, width: "100" },
          { index: 152, label: 'Cost Not Used38', class: 'colCostNotUsed38', active: false, display: true, width: "100" },
          { index: 153, label: 'Sold Not Used38', class: 'colSoldNotUsed38', active: false, display: true, width: "100" },
          { index: 154, label: 'Sold Not Used38(Ex)', class: 'colSoldNotUsed38Ex', active: false, display: true, width: "100" },
          { index: 155, label: 'Sold Not Used38(Tax)', class: 'colSoldNotUsed38Tax', active: false, display: true, width: "100" },
          { index: 156, label: 'Cost Not Used39', class: 'colCostNotUsed39', active: false, display: true, width: "100" },
          { index: 157, label: 'Sold Not Used39', class: 'colSoldNotUsed39', active: false, display: true, width: "100" },
          { index: 158, label: 'Sold Not Used39(Ex)', class: 'colSoldNotUsed39Ex', active: false, display: true, width: "100" },
          { index: 159, label: 'Sold Not Used39(Tax)', class: 'colSoldNotUsed39Tax', active: false, display: true, width: "100" },
          { index: 160, label: 'Cost Not Used40', class: 'colCostNotUsed40', active: false, display: true, width: "100" },
          { index: 161, label: 'Sold Not Used40', class: 'colSoldNotUsed40', active: false, display: true, width: "100" },
          { index: 162, label: 'Sold Not Used40(Ex)', class: 'colSoldNotUsed40Ex', active: false, display: true, width: "100" },
          { index: 163, label: 'Sold Not Used40(Tax)', class: 'colSoldNotUsed40Tax', active: false, display: true, width: "100" },
          { index: 164, label: 'Total Sold Amount Ex', class: 'colAccountName', active: false, display: true, width: "100" },
          { index: 165, label: 'Total Sale Tax', class: 'colAccountName', active: false, display: true, width: "100" },
        ]
        break;
      case "tblAgedPayables":
      case "tblAgedPayablesSummary":
        reset_data = [
          { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "100" },
          { index: 2, label: 'Type', class: 'colType', active: true, display: true, width: "100" },
          { index: 3, label: 'PO Number', class: 'colPONumber', active: true, display: true, width: "100" },
          { index: 4, label: 'Due Date', class: 'colDueDate', active: true, display: true, width: "100" },
          { index: 5, label: 'Amount Due', class: 'colAmountDue', active: true, display: true, width: "100" },
          { index: 6, label: 'Current', class: 'colCurrent', active: true, display: true, width: "100" },
          { index: 7, label: '1-30 Days', class: 'col130Days', active: true, display: true, width: "100" },
          { index: 8, label: '30-60 Days', class: 'col3060Days', active: true, display: true, width: "100" },
          { index: 9, label: '60-90 Days', class: 'col6090Days', active: true, display: true, width: "100" },
          { index: 10, label: '> 90 Days', class: 'col90Days', active: true, display: true, width: "100" },
          { index: 11, label: 'Order Date', class: 'colOrderDate', active: true, display: true, width: "100" },
          { index: 12, label: 'Invoice Date', class: 'colInvoiceDate', active: true, display: true, width: "100" },
          { index: 13, label: 'Original Amount', class: 'colOriginalAmount', active: true, display: true, width: "100" },
          { index: 14, label: 'Details', class: 'colDetails', active: false, display: true, width: "100" },
          { index: 15, label: 'Invoice Number', class: 'colInvoiceNumber', active: false, display: true, width: "100" },
          { index: 16, label: 'Account Name', class: 'colAccountName', active: false, display: true, width: "100" },
          { index: 17, label: 'Supplier ID', class: 'colSupplierID', active: false, display: true, width: "100" },
          { index: 18, label: 'Terms', class: 'colTerms', active: false, display: true, width: "100" },
          { index: 19, label: 'APNotes', class: 'colAPNotes', active: false, display: true, width: "100" },
          { index: 20, label: 'Print Name', class: 'colPrintName', active: false, display: true, width: "100" },
          { index: 21, label: 'PCStatus', class: 'colPCStatus', active: false, display: true, width: "100" },
          { index: 22, label: 'GlobalRef', class: 'colGlobalRef', active: false, display: true, width: "100" },
          { index: 23, label: 'POGlobalRef', class: 'colPOGlobalRef', active: false, display: true, width: "100" },
        ]
        break;
      case "trialbalance":
        reset_data = [
          { index: 1, label: 'ID', class:'colID', active: false, display: true, width: "50" },
          { index: 2, label: 'Account', class:'colAccount', active: true, display: true, width: "150" },
          { index: 3, label: 'Account Name', class:'colAccountName', active: true, display: true, width: "250" },
          { index: 4, label: 'Account Name Only', class:'colAccountNameOnly', active: false, display: true, width: "200" },
          { index: 5, label: 'Account Number', class:'colAccountNo', active: true, display: true, width: "150" },
          { index: 6, label: 'Credits (Ex)', class:'colCreditsEx', active: true, display: true, width: "120" },
          { index: 7, label: 'Credits (Inc)', class:'colCreditsInc', active: true, display: true, width: "120" },
          { index: 8, label: 'Debits (Ex)', class:'colDebitsEx', active: true, display: true, width: "120" },
          { index: 9, label: 'Debits (Inc)', class:'colDebitsInc', active: true, display: true, width: "120" },
          { index: 10, label: 'Sort ID', class:'colSortID', active: false, display: true, width: "80" },
          { index: 11, label: 'Sort Order', class:'colSortOrder', active: false, display: true, width: "80" },
          { index: 12, label: 'Trans ID', class:'colTransID', active: false, display: true, width: "80" },
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
          { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "200" },
          { index: 2, label: 'Phone', class: 'colPhone', active: true, display: true, width: "150" },
          { index: 3, label: 'Rep', class: 'colRep', active: true, display: true, width: "100" },
          { index: 4, label: 'Type', class: 'colType', active: true, display: true, width: "100" },
          { index: 5, label: 'Invoice Number', class: 'colInvoiceNumber', active: true, display: true, width: "130" },
          { index: 6, label: 'SaleDate', class: 'colSaleDate', active: true, display: true, width: "160" },
          { index: 7, label: 'DueDate', class: 'colDueDate', active: true, display: true, width: "160" },
          { index: 8, label: 'Total Amount (Ex)', class: 'colTotalAEX', active: true, display: true, width: "150" },
          { index: 9, label: 'Total Amount (Inc)', class: 'colTotalAInc', active: true, display: true, width: "150" },
          { index: 10, label: 'Gross Profit', class: 'colGrossProfit', active: true, display: true, width: "100" },
          { index: 11, label: 'Margin', class: 'colMargin', active: false, display: true, width: "100" },
          { index: 12, label: 'Address', class: 'colAddress', active: true, display: true, width: "200" },
          { index: 13, label: 'Address 2', class: 'colAddress2', active: true, display: true, width: "200" },
          { index: 14, label: 'Suburb', class: 'colSuburb', active: true, display: true, width: "100" },
          { index: 15, label: 'Postcode', class: 'colPostcode', active: true, display: true, width: "100" },
          { index: 16, label: 'State', class: 'colState', active: true, display: true, width: "100" },
          { index: 17, label: 'FaxNumber', class: 'colFaxNumber', active: true, display: true, width: "100" },
          { index: 18, label: 'Sale ID', class: 'colSaleID', active: false, display: true, width: "100" },
          { index: 19, label: 'Customer ID', class: 'colCustomerID', active: false, display: true, width: "100" },
          { index: 20, label: 'Address 3', class: 'colAddress3', active: false, display: true, width: "200" },
          { index: 21, label: 'Country', class: 'colCountry', active: false, display: true, width: "100" },
          { index: 22, label: 'Details', class: 'colDetails', active: false, display: true, width: "100" },
          { index: 23, label: 'Client ID', class: 'colClientID', active: false, display: true, width: "100" },
          { index: 24, label: 'Markup', class: 'colMarkup', active: false, display: true, width: "100" },
          { index: 25, label: 'Last Sale Date', class: 'colLastSaleDate', active: false, display: true, width: "100" },
          { index: 26, label: 'Gross Profit(Ex)', class: 'colGrossProfitEx', active: false, display: true, width: "100" },
          { index: 27, label: 'Customer Type', class: 'colCustomerType', active: false, display: true, width: "100" },
          { index: 28, label: 'Email', class: 'colEmail', active: false, display: true, width: "100" },
          { index: 29, label: 'Total Cost', class: 'colTotalCost', active: false, display: true, width: "100" },
        ];
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
          { index: 1, label: 'Company Name', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 2, label: 'Rep', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 3, label: 'Discount Type', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 4, label: 'Discount', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 5, label: 'Special Discount', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 6, label: 'Orig Price', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 7, label: 'Line Price', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 8, label: 'Product ID', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 9, label: 'Description', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 10, label: 'Sub Group', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 11, label: 'Type', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 12, label: 'Dept', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 13, label: 'Customer ID', class: 'colAccountName', active: false, display: true, width: "100" },
          { index: 14, label: 'Password', class: 'colAccountName', active: false, display: true, width: "100" },
          { index: 15, label: 'Test', class: 'colAccountName', active: false, display: true, width: "100" },
          { index: 16, label: 'Birthday', class: 'colAccountName', active: false, display: true, width: "100" },
        ]
        break;
      case "supplierreport":
      case "suppliersummary":
      case "supplierdetail":
        reset_data = [
          { index: 1, label: 'Supplier ID', class: 'colSupplierID', active: true, display: true, width: "100" },
          { index: 2, label: 'Contact Name', class: 'colContactName', active: true, display: true, width: "100" },
          { index: 3, label: 'Phone', class: 'colPhone', active: true, display: true, width: "100" },
          { index: 4, label: 'Mobile', class: 'colMobile', active: true, display: true, width: "100" },
          { index: 5, label: 'Fax Number', class: 'colFaxNumber', active: true, display: true, width: "100" },
          { index: 6, label: 'AR Balance', class: 'colARBalance', active: true, display: true, width: "100" },
          { index: 7, label: 'AP Balance', class: 'colAPBalance', active: true, display: true, width: "100" },
          { index: 8, label: 'Balance', class: 'colBalance', active: true, display: true, width: "100" },
          { index: 9, label: 'Street', class: 'colStreet', active: true, display: true, width: "100" },
          { index: 10, label: 'Suburb', class: 'colSubburb', active: true, display: true, width: "100" },
          { index: 11, label: 'State', class: 'colState', active: true, display: true, width: "100" },
          { index: 12, label: 'Postcode', class: 'colPostcode', active: true, display: true, width: "100" },
          { index: 13, label: 'Country', class: 'colCountry', active: true, display: true, width: "100" },
          { index: 14, label: 'Bank Account Name', class: 'colBankAccountName', active: true, display: true, width: "100" },
          { index: 15, label: 'Bank Account BSB', class: 'colBankAccountBSB', active: true, display: true, width: "100" },
          { index: 16, label: 'Bank Account No', class: 'colAccountNo', active: true, display: true, width: "100" },
          { index: 17, label: 'Creation Date', class: 'colCreationDate', active: true, display: true, width: "100" },
          { index: 18, label: 'Active', class: 'colActive', active: true, display: true, width: "100" },
          { index: 19, label: 'Global Ref', class: 'colGlobalRef', active: false, display: true, width: "100" },
          { index: 20, label: 'Street2', class: 'colStreet2', active: false, display: true, width: "100" },
          { index: 21, label: 'Street3', class: 'colStreet3', active: false, display: true, width: "100" },
          { index: 22, label: 'No Staff', class: 'colNoStaff', active: false, display: true, width: "100" },
          { index: 23, label: 'Min Inv value', class: 'colMinInvValue', active: false, display: true, width: "100" },
          { index: 24, label: 'Freight to Store', class: 'colFrighttoStore', active: false, display: true, width: "100" },
          { index: 25, label: 'Rebate', class: 'colRebate', active: false, display: true, width: "100" },
          { index: 26, label: 'First Name', class: 'colFirstName', active: false, display: true, width: "100" },
          { index: 27, label: 'Last Name', class: 'colLastName', active: false, display: true, width: "100" },
          { index: 28, label: 'Contact Details', class: 'colContractDetails', active: false, display: true, width: "100" },
          { index: 29, label: 'ABN', class: 'colABN', active: false, display: true, width: "100" },
          { index: 30, label: 'Print Name', class: 'colPrintName', active: false, display: true, width: "100" },
          { index: 31, label: 'ClientID', class: 'colClientID', active: false, display: true, width: "100" },
        ]
        break;
      case "supplierproductreport":
        reset_data = [
          { index: 1, label: 'PO #', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 2, label: 'PO Num', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 3, label: 'Supplier ID', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 4, label: 'Invoice~Number', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 5, label: 'Product ID', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 6, label: 'Description', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 7, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 8, label: 'Tax', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 9, label: 'Street', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 10, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 11, label: 'Tax Code', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 12, label: 'Ordered', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 13, label: 'Received', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 14, label: 'Back Order', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 15, label: 'ETA~Date', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 16, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 17, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 18, label: 'Comments', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 19, label: 'Original #', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 20, label: 'Global #', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 21, label: 'Sales~Comments', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 22, label: 'Class Name', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 23, label: 'Account~Number', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 24, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 25, label: 'Product~Type', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 26, label: 'Department', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 27, label: 'Type', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 28, label: 'Manufacturer', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 29, label: 'Deleted', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 30, label: 'Order Date', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 31, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 32, label: 'Tax', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 33, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 34, label: 'Employee~Name', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 35, label: 'Buy Metre', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 36, label: 'Buy Weight', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 37, label: 'Buy Price / Metre', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 39, label: 'Docket~Number', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 40, label: 'Received~Date', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 41, label: 'Barcode', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 42, label: 'Ex', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 43, label: 'Inc', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 44, label: 'Cogs', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 45, label: 'Asset', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 46, label: 'Income', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 47, label: 'Cogs', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 48, label: 'Asset', class: 'colAccountName', active: true, display: true, width: "100" },
          { index: 49, label: 'Income', class: 'colAccountName', active: true, display: true, width: "100" },
        ]
        break;
      case "jobsalessummary":
        reset_data = [
          { index: 1, label: 'Customer', class: 'colCustomer', active: true, display: true, width: "100" },
          { index: 2, label: 'Job Customer', class: 'colJobCustomer', active: true, display: true, width: "150" },
          { index: 3, label: 'Job Number', class: 'colJobNumber', active: true, display: true, width: "100" },
          { index: 4, label: 'Job Name', class: 'colJobName', active: true, display: true, width: "100" },
          { index: 5, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
          { index: 6, label: 'Qty Shipped', class: 'colQtyShipped', active: true, display: true, width: "100" },
          { index: 7, label: 'Discount', class: 'colDiscount', active: true, display: true, width: "100" },
          { index: 8, label: 'Tax', class: 'colTax', active: true, display: true, width: "100" },
          { index: 9, label: 'Amount Ex', class: 'colAmountEx', active: true, display: true, width: "100" },
          { index: 10, label: 'Amount Inc', class: 'colAmountInc', active: true, display: true, width: "100" },
          { index: 11, label: 'DetailType', class: 'colDetailType', active: false, display: true, width: "100" },
          { index: 12, label: 'ParentClientID', class: 'colParentClientID', active: false, display: true, width: "100" },
          { index: 13, label: 'ClientID', class: 'colClientID', active: false, display: true, width: "100" },
        ]
        break;
      case "jobprofitabilityreport":
        reset_data = [
          { index: 1, label: 'Company Name', class: 'colCompanyName', active: true, display: true, width: "120" },
          { index: 2, label: 'Job Name', class: 'colJobName', active: true, display: true, width: "120" },
          { index: 3, label: 'Job Number', class: 'colJobNumber', active: true, display: true, width: "120" },
          { index: 4, label: 'Txn Type', class: 'colTxnType', active: true, display: true, width: "120" },
          { index: 5, label: 'Txn No', class: 'colTxnNo', active: true, display: true, width: "120" },
          { index: 6, label: 'Cost Ex', class: 'colCostEx', active: true, display: true, width: "120" },
          { index: 7, label: 'Income Ex', class: 'colIncomeEx', active: true, display: true, width: "120" },
          { index: 8, label: 'Quoted Ex', class: 'colQuotedEx', active: true, display: true, width: "120" },
          { index: 9, label: 'Diff Inc Cost', class: 'colDiffIncCost', active: true, display: true, width: "120" },
          { index: 10, label: '%Diff Inc By Cost', class: 'colDiffIncByCost', active: true, display: true, width: "120" },
          { index: 11, label: 'Diff Inc Quote', class: 'colDiffIncQuote', active: true, display: true, width: "120" },
          { index: 12, label: '%Diff Inc By Quote', class: 'colDiffIncByQuote', active: true, display: true, width: "120" },
          { index: 13, label: 'Backorders', class: 'colBackorders', active: true, display: true, width: "120" },
          { index: 14, label: 'Account Name', class: 'colAccountName', active: true, display: true, width: "120" },
          { index: 15, label: 'Debit Ex', class: 'colDebitEx', active: true, display: true, width: "120" },
          { index: 16, label: 'Credit Ex', class: 'colCreditEx', active: true, display: true, width: "120" },
          { index: 17, label: 'Profit %', class: 'colProfitpercent', active: true, display: true, width: "120" },
          { index: 18, label: 'Department', class: 'colDepartment', active: true, display: true, width: "120" },
          { index: 19, label: 'Product', class: 'colProduct', active: true, display: true, width: "120" },
          { index: 20, label: 'Sub Group', class: 'colSubGroup', active: true, display: true, width: "120" },
          { index: 21, label: 'Type', class: 'colType', active: true, display: true, width: "120" },
          { index: 22, label: 'Dept', class: 'colDept', active: true, display: true, width: "120" },
          { index: 23, label: 'Area', class: 'colArea', active: true, display: true, width: "120" },
          { index: 24, label: 'Landed Cost', class: 'colLandedCost', active: true, display: true, width: "120" },
          { index: 25, label: 'Latestcost', class: 'colLatestcost', active: true, display: true, width: "120" },
          { index: 26, label: 'Diff Inc Landedcost', class: 'colDiffIncLandedcost', active: true, display: true, width: "120" },
          { index: 27, label: '%Diff Inc By Landedcost', class: 'colDiffIncByLandedcost', active: true, display: true, width: "120" },
          { index: 28, label: 'Diff Inc Latestcost', class: 'colDiffIncLatestcost', active: true, display: true, width: "120" },
          { index: 29, label: '%Diff Inc By Latestcost', class: 'colDiffIncByLatestcost', active: true, display: true, width: "120" },
          { index: 30, label: 'Ordered', class: 'colOrderd', active: true, display: true, width: "120" },
          { index: 31, label: 'Shipped', class: 'colShipped', active: true, display: true, width: "120" },
          { index: 32, label: 'Back Ordered', class: 'colBackOrdered', active: true, display: true, width: "120" },
          { index: 33, label: 'CUSTFLD1', class: 'colCUSTFLD1', active: true, display: true, width: "120" },
          { index: 34, label: 'CUSTFLD2', class: 'colCUSTFLD2', active: true, display: true, width: "120" },
          { index: 35, label: 'CUSTFLD3', class: 'colCUSTFLD3', active: true, display: true, width: "120" },
          { index: 36, label: 'CUSTFLD4', class: 'colCUSTFLD4', active: true, display: true, width: "120" },
          { index: 37, label: 'CUSTFLD5', class: 'colCUSTFLD5', active: true, display: true, width: "120" },
          { index: 38, label: 'CUSTFLD6', class: 'colCUSTFLD6', active: true, display: true, width: "120" },
          { index: 39, label: 'CUSTFLD7', class: 'colCUSTFLD7', active: true, display: true, width: "120" },
          { index: 40, label: 'CUSTFLD8', class: 'colCUSTFLD8', active: true, display: true, width: "120" },
          { index: 41, label: 'CUSTFLD9', class: 'colCUSTFLD9', active: true, display: true, width: "120" },
          { index: 42, label: 'CUSTFLD10', class: 'colCUSTFLD10', active: true, display: true, width: "120" },
          { index: 43, label: 'CUSTFLD11', class: 'colCUSTFLD11', active: true, display: true, width: "120" },
          { index: 44, label: 'CUSTFLD12', class: 'colCUSTFLD12', active: true, display: true, width: "120" },
          { index: 45, label: 'CUSTFLD13', class: 'colCUSTFLD13', active: true, display: true, width: "120" },
          { index: 46, label: 'CUSTFLD14', class: 'colCUSTFLD14', active: true, display: true, width: "120" },
          { index: 47, label: 'CUSTFLD15', class: 'colCUSTFLD15', active: true, display: true, width: "120" },
          { index: 48, label: 'Profit $', class: 'colProfitdoller', active: true, display: true, width: "120" },
          { index: 49, label: 'Trans Date', class: 'colTransDate', active: true, display: true, width: "120" },
          { index: 50, label: 'Supplier ID', class: 'colSupplierID', active: false, display: true, width: "120" },
        ]
        break;
      case "binlocationslist":
        reset_data = [
          { index: 1, label: 'Department', class: 'colDepartment', active: true, display: true, width: "100" },
          { index: 2, label: 'Location', class: 'colLocation', active: true, display: true, width: "100" },
          { index: 3, label: 'Bin Number', class: 'colBinNumber', active: true, display: true, width: "100" },
          { index: 4, label: 'Volume Total', class: 'colVolumeTotal', active: true, display: true, width: "100" },
          { index: 5, label: 'Volume Used', class: 'colVolumeUsed', active: true, display: true, width: "100" },
          { index: 6, label: 'Volume Available', class: 'colVolumeAvailable', active: true, display: true, width: "100" },
          { index: 7, label: 'Active', class: 'colActive', active: true, display: true, width: "100" },
          { index: 8, label: 'GlobalRef', class: 'colGlobalRef', active: false, display: true, width: "100" },
          { index: 9, label: 'BinID', class: 'colBinID', active: false, display: true, width: "100" },
          { index: 10, label: 'ClassID', class: 'colClassID', active: false, display: true, width: "100" },
        ]
        break;
      case "stockmovementreport":
        reset_data = [
          { index: 1, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
          { index: 2, label: 'Transaction Type', class: 'colTrType', active: true, display: true, width: "100" },
          { index: 3, label: 'Transaction No', class: 'colTrNo', active: true, display: true, width: "100" },
          { index: 4, label: 'Quantity Opening', class: 'colOpening', active: true, display: true, width: "100" },
          { index: 5, label: 'Quantity Current', class: 'colCurrent', active: true, display: true, width: "100" },
          { index: 6, label: 'Quantity Running', class: 'colRunning', active: true, display: true, width: "100" },
          { index: 7, label: 'Average Unit Cost', class: 'colAvUnitCost', active: true, display: true, width: "100" },
          { index: 8, label: 'Average Total Cost', class: 'colAvTotalCost', active: true, display: true, width: "100" },
          { index: 9, label: 'Amount(Ex) Unit Cost', class: 'colAmUnitCost', active: true, display: true, width: "100" },
          { index: 10, label: 'Amount(Ex) Total Cost', class: 'colAmTotalCost', active: true, display: true, width: "100" },
          { index: 11, label: 'Department Name', class: 'colDepartmentName', active: false, display: true, width: "100" },
          { index: 12, label: 'TransDate', class: 'colTransDate', active: false, display: true, width: "100" },
          { index: 13, label: 'Actual Date', class: 'colActualDate', active: false, display: true, width: "100" },
          { index: 14, label: 'Sub Group', class: 'colSubGroup', active: false, display: true, width: "100" },
          { index: 15, label: 'Type', class: 'colType', active: false, display: true, width: "100" },
          { index: 16, label: 'Dept', class: 'colDept', active: false, display: true, width: "100" },
        ]
        break;
      case "stockquantitybylocation":
        reset_data = [
          { index: 1, label: 'Department', class: 'colDepartment', active: true, display: true, width: "100" },
          { index: 2, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
          { index: 3, label: 'Parts Description', class: 'colDescription', active: true, display: true, width: "100" },
          { index: 4, label: 'UOM', class: 'colUOM', active: true, display: true, width: "100" },
          { index: 5, label: 'Manufacture', class: 'colManufacture', active: true, display: true, width: "100" },
          { index: 6, label: 'Products Type', class: 'colProductsType', active: true, display: true, width: "100" },
          { index: 7, label: 'Products Dept', class: 'colProductsDept', active: true, display: true, width: "100" },
          { index: 8, label: 'Batch No', class: 'colBatchNo', active: true, display: true, width: "100" },
          { index: 9, label: 'Expiry Date', class: 'colExpiryDate', active: true, display: true, width: "100" },
          { index: 10, label: 'Location', class: 'colLocation', active: true, display: true, width: "100" },
          { index: 11, label: 'No', class: 'colNo', active: true, display: true, width: "100" },
          { index: 11, label: 'Serial~No', class: 'colSerialNo', active: true, display: true, width: "100" },
          { index: 12, label: 'Cost', class: 'colCost', active: true, display: true, width: "100" },
          { index: 13, label: 'Value', class: 'colValue', active: true, display: true, width: "100" },
          { index: 14, label: 'Sales Order', class: 'colSalesOrder', active: true, display: true, width: "100" },
          { index: 15, label: 'In-Stock', class: 'colInStock', active: true, display: true, width: "100" },
          { index: 16, label: 'If read as UOM', class: 'colIfreadasUOM', active: true, display: true, width: "100" },
          { index: 17, label: 'Multiplier', class: 'colMultiplier', active: true, display: true, width: "100" },
          { index: 18, label: 'If read as Units', class: 'colIfreadasUnits1', active: true, display: true, width: "100" },
          { index: 19, label: 'If read as Units', class: 'colIfreadasUnits2', active: true, display: true, width: "100" },
          { index: 20, label: 'Multiplier', class: 'colMultiplier', active: true, display: true, width: "100" },
          { index: 21, label: 'If read as UOM', class: 'colIfreadasUOM2', active: true, display: true, width: "100" },
          { index: 22, label: 'In-Stock', class: 'colIn-stock', active: true, display: true, width: "100" },
          { index: 23, label: 'Sales Order', class: 'colSalesOrder', active: true, display: true, width: "100" },
          { index: 24, label: 'Available', class: 'colAvailable', active: true, display: true, width: "100" },
          { index: 25, label: 'UOMMultiplier', class: 'colUOMMultiplier', active: false, display: true, width: "100" },
          { index: 26, label: 'Unit Volume', class: 'colUnitVolume', active: false, display: true, width: "100" },
          { index: 27, label: 'Volume~ Available Qty', class: 'colVolumeAvailableQty', active: false, display: true, width: "100" },
          { index: 28, label: 'Volume~ Instock Qty', class: 'colVolumeINstockQty', active: false, display: true, width: "100" },
          { index: 29, label: 'Part Type', class: 'colPartType', active: false, display: true, width: "100" },
          { index: 30, label: 'Truck Load No', class: 'colTruckLoadNo', active: false, display: true, width: "100" },
          { index: 31, label: 'Expiry Date', class: 'colExpiryDate', active: false, display: true, width: "100" },
          { index: 32, label: 'SOQty', class: 'colSQQty', active: false, display: true, width: "100" },
          { index: 33, label: 'Instock Qty', class: 'colInstockQty2', active: false, display: true, width: "100" },
          { index: 34, label: 'Allocated UOMQty', class: 'colAllocatedUOMQty', active: false, display: true, width: "100" },
          { index: 35, label: 'Allocated SOUOMQty', class: 'colAllocatedSOUOMQty', active: false, display: true, width: "100" },
          { index: 36, label: 'Allocated In Stock UOMQty', class: 'colAllocatedInStockUOMQty', active: false, display: true, width: "100" },
          { index: 37, label: 'Bin', class: 'colBin', active: false, display: true, width: "100" },
          { index: 39, label: 'Batch', class: 'colBatch', acticve: false, display: true, width: "100" },
          { index: 39, label: 'SN', class: 'colSn', acticve: false, display: true, width: "100" },
          { index: 40, label: 'Preferred Supplier', class: 'colPreferredsupplier', active: false, display: true, width: "100" },
          { index: 41, label: 'Print Name', class: 'colPrintName', active: false, display: true, width: "100" },
        ]
        break;
      case "stockvaluereport":
        reset_data = [
          { index: 1, label: 'Department Name', class: 'colDepartmentName', active: true, display: true, width: "100" },
          { index: 2, label: 'Product ID', class: 'colProductID', active: true, display: true, width: "100" },
          { index: 3, label: 'Trans Type', class: 'colTransType', active: true, display: true, width: "100" },
          { index: 4, label: 'Qty', class: 'colQty', active: true, display: true, width: "100" },
          { index: 5, label: 'Running Qty', class: 'colRunningQty', active: true, display: true, width: "100" },
          { index: 6, label: 'Unit Cost~When Posted', class: 'colUnitCostWhenPosted', active: true, display: true, width: "100" },
          { index: 7, label: 'Todays Unit~Avg Cost', class: 'colTodaysUnitAvgCost', active: true, display: true, width: "100" },
          { index: 8, label: 'Total Cost~When Posted', class: 'colTotalCostWhenPosted', active: true, display: true, width: "100" },
          { index: 9, label: 'Todays Total~Avg Cost', class: 'colTodaysTotalAvgCost', active: true, display: true, width: "100" },
          { index: 10, label: 'Trans Date', class: 'colTransDate', active: true, display: true, width: "100" },
          { index: 11, label: 'Transaction No', class: 'colTransactionNo', active: false, display: true, width: "100" },
          { index: 12, label: 'Opening', class: 'colOpenning', active: false, display: true, width: "100" },
          { index: 13, label: 'Actual Date', class: 'colActualDate', active: false, display: true, width: "100" },
          { index: 14, label: 'Sub Group', class: 'colSubGroup', active: false, display: true, width: "100" },
          { index: 15, label: 'Type', class: 'colType', active: false, display: true, width: "100" },
          { index: 16, label: 'Dept', class: 'colDept', active: false, display: true, width: "100" },
        ]
        break;
      case "payrollhistory":
        reset_data = [
          { index: 1, label: 'LastName', class: 'colLastName', active: true, display: true, width: "100" },
          { index: 2, label: 'FirstName', class: 'colFirstName', active: true, display: true, width: "100" },
          { index: 3, label: 'G/L', class: 'colGL', active: true, display: true, width: "100" },
          { index: 4, label: 'Date Paid', class: 'colDatePaid', active: true, display: true, width: "100" },
          { index: 5, label: 'Gross', class: 'colGross', active: true, display: true, width: "100" },
          { index: 6, label: 'Tax', class: 'colTax', active: true, display: true, width: "100" },
          { index: 7, label: 'Wages', class: 'colWages', active: true, display: true, width: "100" },
          { index: 8, label: 'Commission', class: 'colCommission', active: true, display: true, width: "100" },
          { index: 9, label: 'Deductions', class: 'colDeductions', active: true, display: true, width: "100" },
          { index: 10, label: 'Allowances', class: 'colAllowances', active: true, display: true, width: "100" },
          { index: 11, label: 'CDEP', class: 'colCDEP', active: true, display: true, width: "100" },
          { index: 11, label: 'Sundries', class: 'colSundries', active: true, display: true, width: "100" },
          { index: 12, label: 'Superannuation', class: 'colSuperannuation', active: true, display: true, width: "100" },
          { index: 12, label: 'ClassName', class: 'colClassName', active: true, display: true, width: "100" },
          { index: 13, label: 'PayPeriod', class: 'colPayPeriod', active: true, display: true, width: "100" },
          { index: 14, label: 'PayNo', class: 'colPayNo', active: true, display: true, width: "100" },
          { index: 15, label: 'Splits', class: 'colSplits', active: true, display: true, width: "100" },
          { index: 16, label: 'Deleted', class: 'colDeleted', active: true, display: true, width: "100" },
          { index: 17, label: 'Global Ref', class: 'colGlobalRef', active: false, display: true, width: "100" },
          { index: 18, label: 'Employee Name', class: 'colEmployeeName', active: false, display: true, width: "100" },
          { index: 19, label: 'Pay Date', class: 'PayDate', active: false, display: true, width: "100" },
          { index: 20, label: 'Pay Periods', class: 'colPayPeriods', active: false, display: true, width: "100" },
          { index: 21, label: 'Salary Sacrifice', class: 'colSalarySacrifice', active: false, display: true, width: "100" },
          { index: 22, label: 'Workplacegiving', class: 'colWorkplacegiving', active: false, display: true, width: "100" },
          { index: 23, label: 'Net Comb', class: 'colNetComb', active: false, display: true, width: "100" },
          { index: 24, label: 'Net Only', class: 'colNetOnly', active: false, display: true, width: "100" },
          { index: 25, label: 'Paid', class: 'colPaid', active: false, display: true, width: "100" },
          { index: 26, label: 'Pay', class: 'colPay', active: false, display: true, width: "100" },
          { index: 27, label: 'Test staff', class: 'colTeststaff', active: false, display: true, width: "100" },
          { index: 28, label: 'Customer ID Tax', class: 'colCustomerIDTax', active: false, display: true, width: "100" },
          { index: 29, label: 'PAYG Tax', class: 'colPaygTax', active: false, display: true, width: "100" },
          { index: 30, label: 'BSB', class: 'colBSB', active: false, display: true, width: "100" },
          { index: 31, label: 'BankAccNo', class: 'colBankAccNo', active: false, display: true, width: "100" },
          { index: 32, label: 'Employee ID', class: 'colEmployeeID', active: false, display: true, width: "100" },
        ]
        break;
      case "PayrollLeaveAccrued":
        reset_data = [
          { index: 1, label: 'Accrued Date', class: 'colAccruedDate', active: true, display: true, width: "100" },
          { index: 2, label: 'Leave Type', class: 'colLeaveType', active: true, display: true, width: "100" },
          { index: 3, label: 'Employee', class: 'colEmployee', active: true, display: true, width: "100" },
          { index: 4, label: 'Pay No', class: 'colPayNo', active: true, display: true, width: "100" },
          { index: 5, label: 'Accrued Type', class: 'colAccruedType', active: true, display: true, width: "100" },
          { index: 6, label: 'Hours', class: 'colHours', active: true, display: true, width: "100" },
          { index: 7, label: 'Value', class: 'colValue', active: true, display: true, width: "100" },
        ]
        break;
      case "tblpayrollLeaveTaken":
        reset_data = [
          { index: 1, label: 'Employee Name', class: 'colEmployeeName', active: true, display: true, width: "100" },
          { index: 2, label: 'Pay Date', class: 'colPayDate', active: true, display: true, width: "100" },
          { index: 3, label: 'Date Taken', class: 'colDateTaken', active: true, display: true, width: "100" },
          { index: 4, label: 'Leave Type', class: 'colLeaveType', active: true, display: true, width: "100" },
          { index: 5, label: 'Hours', class: 'colHours', active: true, display: true, width: "100" },
          { index: 6, label: 'Is Certified', class: 'colIsCertified', active: true, display: true, width: "100" },
          { index: 7, label: 'Pay ID', class: 'colPayID', active: false, display: true, width: "100" },
          { index: 8, label: 'Employee ID', class: 'colEmployeeED', active: false, display: true, width: "100" },
        ]
        break;
      case "tbl1099Contractor":
        reset_data = [
          { index: 1, label: 'Company', class: 'colCompany', active: true, display: true, width: "100" },
          { index: 2, label: 'Type', class: 'colType', active: true, display: true, width: "100" },
          { index: 3, label: 'Payment', class: 'colPayment', active: true, display: true, width: "100" },
          { index: 4, label: 'Date', class: 'colDate', active: true, display: true, width: "100" },
          { index: 5, label: 'Method', class: 'colMethod', active: true, display: true, width: "100" },
          { index: 6, label: 'Bill Street', class: 'colBillStreet', active: true, display: true, width: "100" },
          { index: 7, label: 'Bill Place', class: 'colBillPlace', active: true, display: true, width: "100" },
          { index: 8, label: 'Card Amount', class: 'colCardAmount', active: true, display: true, width: "100" },
          { index: 9, label: 'Non Card Amount', class: 'colNonCardAmount', active: true, display: true, width: "100" },
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
          { index: 1, label: 'Company', class: 'colCompany', active: true, display: true, width: "100" },
          { index: 2, label: 'Currency', class: 'colCurrency', active: true, display: true, width: "100" },
          { index: 3, label: 'Code', class: 'colCode', active: true, display: true, width: "100" },
          { index: 4, label: 'Buy Rate', class: 'colBuyRate', active: true, display: true, width: "100" },
          { index: 5, label: 'Sell Rate', class: 'colSellRate', active: true, display: true, width: "100" },
          { index: 6, label: 'Rate Last Modified', class: 'colRateLastModified', active: true, display: true, width: "100" },
          { index: 7, label: 'Active', class: 'colActive', active: true, display: true, width: "100" },
          { index: 8, label: 'Global Ref', class: 'colGlobalRef', active: false, display: true, width: "100" },
          { index: 9, label: 'Currency Symbol', class: 'colCurrencySymbol', active: false, display: true, width: "100" },
          { index: 10, label: 'Currency ID', class: 'colCurrencyID', active: false, display: true, width: "100" },
          { index: 11, label: 'Edited Flag', class: 'colEditedFlag', active: false, display: true, width: "100" },
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
    //       sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), listType).then(function (data) {
    //           reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
    //           templateObject.showCustomFieldDisplaySettings(reset_data);
    //       }).catch(function (err) {
    //       });
    //     } else {
    //       let data = JSON.parse(dataObject[0].data);
    //       if(data.ProcessLog.Obj.CustomLayout.length > 0){
    //        for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
    //          if(data.ProcessLog.Obj.CustomLayout[i].TableName == listType){
    //            reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
    //            templateObject.showCustomFieldDisplaySettings(reset_data);
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
  templateObject.initCustomFieldDisplaySettings("100", currenttablename);

  templateObject.resetData = function (dataVal) {
    location.reload();
  };

  tableResize();
});



Template.vs1_report_template.events({
  'click .btnOpenReportSettings': () => {
    let templateObject = Template.instance();
    // let currenttranstablename = templateObject.data.tablename||";
    $(`thead tr th`).each(function (index) {
      var $tblrow = $(this);
      var colWidth = $tblrow.width() || 0;
      var colthClass = $tblrow.attr('data-class') || "";
      $('.rngRange' + colthClass).val(colWidth);
    });
    console.log("mytablename:" + templateObject.data.tablename)
    $('.' + templateObject.data.tablename + '_Modal').modal('toggle');
  },
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
      var colTitle = $tblrow.find(".divcolumn").text() || "100";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "100";
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
    let employeeId = parseInt(localStorage.getItem('mySessionEmployeeLoggedID')) || 0;
    let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);

    if (added) {
      sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), '').then(function (dataCustomize) {
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
