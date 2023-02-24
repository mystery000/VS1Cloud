import {ReactiveVar} from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import "./reports.html"

import { TaxRateService } from "../settings/settings-service"; 
import { template } from 'lodash';

Template.allreports.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.isBalanceSheet = new ReactiveVar();
    templateObject.isBalanceSheet.set(false);
    templateObject.isProfitLoss = new ReactiveVar();
    templateObject.isProfitLoss.set(false);
    templateObject.isPLMonthly = new ReactiveVar();
    templateObject.isPLMonthly.set(false);
    templateObject.isPLQuarterly = new ReactiveVar();
    templateObject.isPLQuarterly.set(false);
    templateObject.isPLYearly = new ReactiveVar();
    templateObject.isPLYearly.set(false);
    templateObject.isPLYTD = new ReactiveVar();
    templateObject.isPLYTD.set(false);
    templateObject.isJobSalesSummary = new ReactiveVar();
    templateObject.isJobSalesSummary.set(false);
    templateObject.isAgedReceivables = new ReactiveVar();
    templateObject.isAgedReceivables.set(false);
    templateObject.isAgedReceivablesSummary = new ReactiveVar();
    templateObject.isAgedReceivablesSummary.set(false);
    templateObject.isProductSalesReport = new ReactiveVar();
    templateObject.isProductSalesReport.set(false);
    templateObject.isSalesReport = new ReactiveVar();
    templateObject.isSalesReport.set(false);
    templateObject.isJobProfitReport = new ReactiveVar();
    templateObject.isJobProfitReport.set(false);
    templateObject.isSupplierDetails = new ReactiveVar();
    templateObject.isSupplierDetails.set(false);
    templateObject.isSupplierProduct = new ReactiveVar();
    templateObject.isSupplierProduct.set(false);
    templateObject.isCustomerDetails = new ReactiveVar();
    templateObject.isCustomerDetails.set(false);
    templateObject.isCustomerSummary = new ReactiveVar();
    templateObject.isCustomerSummary.set(false);
    templateObject.isLotReport = new ReactiveVar();
    templateObject.isLotReport.set(false);
    templateObject.isStockValue = new ReactiveVar();
    templateObject.isStockValue.set(false);
    templateObject.isStockQuantity = new ReactiveVar();
    templateObject.isStockQuantity.set(false);
    templateObject.isStockMovementReport = new ReactiveVar();
    templateObject.isStockMovementReport.set(false);
    templateObject.isPayrollHistoryReport = new ReactiveVar();
    templateObject.isPayrollHistoryReport.set(false);
    templateObject.isForeignExchangeHistoryList = new ReactiveVar();
    templateObject.isForeignExchangeHistoryList.set(false);
    templateObject.isForeignExchangeList = new ReactiveVar();
    templateObject.isForeignExchangeList.set(false);
    templateObject.isSalesSummaryReport = new ReactiveVar();
    templateObject.isSalesSummaryReport.set(false);
    templateObject.isGeneralLedger = new ReactiveVar();
    templateObject.isGeneralLedger.set(false);
    templateObject.isTaxSummaryReport = new ReactiveVar();
    templateObject.isTaxSummaryReport.set(false);
    templateObject.isTrialBalance = new ReactiveVar();
    templateObject.isTrialBalance.set(false);
    templateObject.isTimeSheetSummary = new ReactiveVar();
    templateObject.isTimeSheetSummary.set(false);
    templateObject.isPayrollLeaveAccrued = new ReactiveVar();
    templateObject.isPayrollLeaveAccrued.set(false);
    templateObject.isPayrollLeaveTaken = new ReactiveVar();
    templateObject.isPayrollLeaveTaken.set(false);
    templateObject.isSerialNumberReport = new ReactiveVar();
    templateObject.isSerialNumberReport.set(false);
    templateObject.is1099Transaction = new ReactiveVar();
    templateObject.is1099Transaction.set(false);
    templateObject.isAccountsLists = new ReactiveVar();
    templateObject.isAccountsLists.set(false);
    templateObject.isBinLocations = new ReactiveVar();
    templateObject.isBinLocations.set(false);
    templateObject.isTransactionJournal = new ReactiveVar();
    templateObject.isTransactionJournal.set(false);
    templateObject.isUnpaidBills = new ReactiveVar();
    templateObject.isUnpaidBills.set(false);
    templateObject.isUnpaidPO = new ReactiveVar();
    templateObject.isUnpaidPO.set(false);
    templateObject.isBackOrderedPO = new ReactiveVar();
    templateObject.isBackOrderedPO.set(false);
    templateObject.isSalesOrderConverted = new ReactiveVar();
    templateObject.isSalesOrderConverted.set(false);
    templateObject.isSalesOrderUnconverted = new ReactiveVar();
    templateObject.isSalesOrderUnconverted.set(false);
    templateObject.isPaymentMethodsList = new ReactiveVar();
    templateObject.isPaymentMethodsList.set(false);
    templateObject.isBackOrderedInvoices = new ReactiveVar();
    templateObject.isBackOrderedInvoices.set(false);
    templateObject.isQuotesConverted = new ReactiveVar();
    templateObject.isQuotesConverted.set(false);
    templateObject.isQuotesUnconverted = new ReactiveVar();
    templateObject.isQuotesUnconverted.set(false);
    templateObject.isInvoicesPaid = new ReactiveVar();
    templateObject.isInvoicesPaid.set(false);
    templateObject.isInvoicesUnpaid = new ReactiveVar();
    templateObject.isInvoicesUnpaid.set(false);
    templateObject.isTimeSheetDetails = new ReactiveVar();
    templateObject.isTimeSheetDetails.set(false);
    templateObject.isChequeList = new ReactiveVar();
    templateObject.isChequeList.set(false);
    templateObject.isJournalEntryList = new ReactiveVar();
    templateObject.isJournalEntryList.set(false);
    templateObject.isStockAdjustmentList = new ReactiveVar();
    templateObject.isStockAdjustmentList.set(false);
    templateObject.isAgedPayables = new ReactiveVar();
    templateObject.isAgedPayables.set(false);
    templateObject.isAgedPayablesSummary = new ReactiveVar();
    templateObject.isAgedPayablesSummary.set(false);
    templateObject.isPurchaseReport = new ReactiveVar();
    templateObject.isPurchaseReport.set(false);
    templateObject.isPurchaseSummaryReport = new ReactiveVar();
    templateObject.isPurchaseSummaryReport.set(false);
    templateObject.isPrintStatement = new ReactiveVar();
    templateObject.isPrintStatement.set(false);
    templateObject.isExecutiveSummary = new ReactiveVar();
    templateObject.isExecutiveSummary.set(false);
    templateObject.isCashReport = new ReactiveVar();
    templateObject.isCashReport.set(false);
    templateObject.isProfitabilityReport = new ReactiveVar();
    templateObject.isProfitabilityReport.set(false);
    templateObject.isPerformanceReport = new ReactiveVar();
    templateObject.isPerformanceReport.set(false);
    templateObject.isBalanceSheetReport = new ReactiveVar();
    templateObject.isBalanceSheetReport.set(false);
    templateObject.isIncomeReport = new ReactiveVar();
    templateObject.isIncomeReport.set(false);
    templateObject.isPositionReport = new ReactiveVar();
    templateObject.isPositionReport.set(false);
    templateObject.accountantList = new ReactiveVar([]);

    templateObject.isBuildProfitability = new ReactiveVar();
    templateObject.isBuildProfitability.set(false);
    templateObject.isProductionWorksheet = new ReactiveVar();
    templateObject.isProductionWorksheet.set(false);
    templateObject.isWorkOrder = new ReactiveVar();
    templateObject.isWorkOrder.set(false);
    
});
Template.allreports.onRendered(() => {
    let templateObject = Template.instance();
    // let isBalanceSheet = localStorage.getItem('cloudBalanceSheet');
    let isBalanceSheet;
    getVS1Data("BalanceSheetReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            // addVS1Data('BalanceSheetReport', JSON.stringify(false));
            isBalanceSheet = false;
        } else {
            isBalanceSheet = JSON.parse(dataObject[0].data);
        }
    });
    // let isProfitLoss = localStorage.getItem('cloudProfitLoss');
    let isProfitLoss;
    getVS1Data("ProfitLossReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('ProfitLossReport', JSON.stringify(false));
            isProfitLoss = false;
        } else {
            isProfitLoss = JSON.parse(dataObject[0].data);
        }
    });
    let isPLMonthly;
    getVS1Data("PLMonthlyReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PLMonthlyReport', JSON.stringify(false));
            isPLMonthly = false;
        } else {
            isPLMonthly = JSON.parse(dataObject[0].data);
        }
    });
    // let isPLQuarterly = localStorage.getItem('cloudPLQuarterly');
    let isPLQuarterly;
    getVS1Data("PLQuarterlyReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PLQuarterlyReport', JSON.stringify(false));
            isPLQuarterly = false;
        } else {
            isPLQuarterly = JSON.parse(dataObject[0].data);
        }
    });
    // let isPLYearly = localStorage.getItem('cloudPLYearly');
    let isPLYearly;
    getVS1Data("PLYearlyReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PLYearlyReport', JSON.stringify(false));
            isPLYearly = false;
        } else {
            isPLYearly = JSON.parse(dataObject[0].data);
        }
    });
    // let isPLYTD = localStorage.getItem('cloudPLYTD');
    let isPLYTD;
    getVS1Data("PLYTDReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PLYTDReport', JSON.stringify(false));
            isPLYTD = false;
        } else {
            isPLYTD = JSON.parse(dataObject[0].data);
        }
    });
    // let isJobSalesSummary = localStorage.getItem('cloudJobSalesSummary');
    let isJobSalesSummary;
    getVS1Data("JobSalesSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('JobSalesSummaryReport', JSON.stringify(false));
            isJobSalesSummary = false;
        } else {
            isJobSalesSummary = JSON.parse(dataObject[0].data);
        }
    });
    // let isAgedReceivables = localStorage.getItem('cloudAgedReceivables');
    let isAgedReceivables;
    getVS1Data("AgedReceivablesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('AgedReceivablesReport', JSON.stringify(false));
            isAgedReceivables = false;
        } else {
            isAgedReceivables = JSON.parse(dataObject[0].data);
        }
    });
    // let isAgedReceivablesSummary = localStorage.getItem('cloudAgedReceivablesSummary');
    let isAgedReceivablesSummary;
    getVS1Data("AgedReceivablesSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('AgedReceivablesSummaryReport', JSON.stringify(false));
            isAgedReceivablesSummary = false;
        } else {
            isAgedReceivablesSummary = JSON.parse(dataObject[0].data);
        }
    });
    // let isProductSalesReport = localStorage.getItem('cloudProductSalesReport');
    let isProductSalesReport;
    getVS1Data("ProductSalesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('ProductSalesReport', JSON.stringify(false));
            isProductSalesReport = false;
        } else {
            isProductSalesReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isSalesReport = localStorage.getItem('cloudSalesReport');
    let isSalesReport;
    getVS1Data("SalesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('SalesReport', JSON.stringify(false));
            isSalesReport = false;
        } else {
            isSalesReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isJobProfitReport = localStorage.getItem('cloudJobProfit');
    let isJobProfitReport;
    getVS1Data("JobProfitReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('JobProfitReport', JSON.stringify(false));
            isJobProfitReport = false;
        } else {
            isJobProfitReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isSupplierDetails = localStorage.getItem('cloudSupplierDetails');
    let isSupplierDetails;
    getVS1Data("SupplierDetailsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('SupplierDetailsReport', JSON.stringify(false));
            isSupplierDetails = false;
        } else {
            isSupplierDetails = JSON.parse(dataObject[0].data);
        }
    });
    // let isSupplierProduct = localStorage.getItem('cloudSupplierProduct');
    let isSupplierProduct;
    getVS1Data("SupplierProductReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('SupplierProductReport', JSON.stringify(false));
            isSupplierProduct = false;
        } else {
            isSupplierProduct = JSON.parse(dataObject[0].data);
        }
    });
    // let isCustomerDetails = localStorage.getItem('cloudCustomerDetails');
    let isCustomerDetails;
    getVS1Data("CustomerDetailsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('CustomerDetailsReport', JSON.stringify(false));
            isCustomerDetails = false;
        } else {
            isCustomerDetails = JSON.parse(dataObject[0].data);
        }
        // isCustomerDetails =JSON.parse(dataObject[0]).data;
    });
    // let isCustomerSummary = localStorage.getItem('cloudCustomerSummary');
    let isCustomerSummary;
    getVS1Data("CustomerSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('CustomerSummaryReport', JSON.stringify(false));
            isCustomerSummary = false;
        } else {
            isCustomerSummary = JSON.parse(dataObject[0].data);
        }
    });
    // let isLotReport = localStorage.getItem('cloudLotReport');
    let isLotReport;
    getVS1Data("LotReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('LotReport', JSON.stringify(false));
            isLotReport = false;
        } else {
            isLotReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isStockValue = localStorage.getItem('cloudStockValue');
    let isStockValue;
    getVS1Data("StockValueReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('StockValueReport', JSON.stringify(false));
            isStockValue = false;
        } else {
            isStockValue = JSON.parse(dataObject[0].data);
        }
    });
    // let isStockQuantity = localStorage.getItem('cloudStockQuantity');
    let isStockQuantity;
    getVS1Data("StockQuantityReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('StockQuantityReport', JSON.stringify(false));
            isStockQuantity = false;
        } else {
            isStockQuantity = JSON.parse(dataObject[0].data);
        }
    });
    // let isStockMovementReport = localStorage.getItem('cloudStockMovementReport');
    let isStockMovementReport;
    getVS1Data("StockMovementReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('StockMovementReport', JSON.stringify(false));
            isStockMovementReport = false;
        } else {
            isStockMovementReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isPayrollHistoryReport = localStorage.getItem('cloudPayrollHistoryReport');
    let isPayrollHistoryReport;
    getVS1Data("PayrollHistoryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PayrollHistoryReport', JSON.stringify(false));
            isPayrollHistoryReport = false;
        } else {
            isPayrollHistoryReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isForeignExchangeHistoryList = localStorage.getItem('cloudForeignExchangeHistoryList');
    let isForeignExchangeHistoryList;
    getVS1Data("ForeignExchangeHistoryListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('ForeignExchangeHistoryListReport', JSON.stringify(false));
            isForeignExchangeHistoryList = false;
        } else {
            isForeignExchangeHistoryList = JSON.parse(dataObject[0].data);
        }
    });
    // let isForeignExchangeList = localStorage.getItem('cloudForeignExchangeList');
    let isForeignExchangeList;
    getVS1Data("ForeignExchangeListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('ForeignExchangeListReport', JSON.stringify(false));
            isForeignExchangeList = false;
        } else {
            isForeignExchangeList = JSON.parse(dataObject[0].data);
        }
    });
    // let isSalesSummaryReport = localStorage.getItem('cloudSalesSummaryReport');
    let isSalesSummaryReport;
    getVS1Data("SalesSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('SalesSummaryReport', JSON.stringify(false));
            isSalesSummaryReport = false;
        } else {
            isSalesSummaryReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isGeneralLedger = localStorage.getItem('cloudGeneralLedger');
    let isGeneralLedger;
    getVS1Data("GeneralLedgerReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('GeneralLedgerReport', JSON.stringify(false));
            isGeneralLedger = false;
        } else {
            isGeneralLedger = JSON.parse(dataObject[0].data);
        }
    });
    // let isTaxSummaryReport = localStorage.getItem('cloudTaxSummaryReport');
    let isTaxSummaryReport;
    getVS1Data("TaxSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('TaxSummaryReport', JSON.stringify(false));
            isTaxSummaryReport = false;
        } else {
            isTaxSummaryReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isTrialBalance = localStorage.getItem('cloudTrialBalance');
    let isTrialBalance;
    getVS1Data("TrialBalanceReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            // //addVS1Data('TrialBalanceReport', JSON.stringify(false));
            isTrialBalance = false;
        } else {
            isTrialBalance = JSON.parse(dataObject[0].data);
        }
    });
    // let isTimeSheetSummary = localStorage.getItem('cloudTimeSheetSummary');
    let isTimeSheetSummary;
    getVS1Data("TimeSheetSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('TimeSheetSummaryReport', JSON.stringify(false));
            isTimeSheetSummary = false;
        } else {
            isTimeSheetSummary = JSON.parse(dataObject[0].data);
        }
    });
    // let isPayrollLeaveAccrued = localStorage.getItem('cloudPayrollLeaveAccrued');
    let isPayrollLeaveAccrued;
    getVS1Data("PayrollLeaveAccruedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PayrollLeaveAccruedReport', JSON.stringify(false));
            isPayrollLeaveAccrued = false;
        } else {
            isPayrollLeaveAccrued = JSON.parse(dataObject[0].data);
        }
    });
    // let isPayrollLeaveTaken = localStorage.getItem('cloudPayrollLeaveTaken');
    let isPayrollLeaveTaken;
    getVS1Data("PayrollLeaveTakenReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PayrollLeaveTakenReport', JSON.stringify(false));
            isPayrollLeaveTaken = false;
        } else {
            isPayrollLeaveTaken = JSON.parse(dataObject[0].data);
        }
    });
    // let isSerialNumberReport = localStorage.getItem('cloudSerialNumberReport');
    let isSerialNumberReport;
    getVS1Data("SerialNumberReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('SerialNumberReport', JSON.stringify(false));
            isSerialNumberReport = false;
        } else {
            isSerialNumberReport = JSON.parse(dataObject[0].data);
        }
    });
    // let is1099Transaction = localStorage.getItem('cloud1099Transaction');
    let is1099Transaction;
    getVS1Data("1099TransactionReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('1099TransactionReport', JSON.stringify(false));
            is1099Transaction = false;
        } else {
            is1099Transaction = JSON.parse(dataObject[0].data);
        }
    });
    // let isAccountsLists = localStorage.getItem('cloudAccountList');
    let isAccountsLists;
    getVS1Data("AccountsListsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('AccountsListsReport', JSON.stringify(false));
            isAccountsLists = false;
        } else {
            isAccountsLists = JSON.parse(dataObject[0].data);
        }
    });
    // let isBinLocations = localStorage.getItem('cloudBinLocations');
    let isBinLocations;
    getVS1Data("BinLocationsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('BinLocationsReport', JSON.stringify(false));
            isBinLocations = false;
        } else {
            isBinLocations = JSON.parse(dataObject[0].data);
        }
    });
    // let isTransactionJournal = localStorage.getItem('cloudTransactionJournal');
    let isTransactionJournal;
    getVS1Data("TransactionJournalReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('TransactionJournalReport', JSON.stringify(false));
            isTransactionJournal = false;
        } else {
            isTransactionJournal = JSON.parse(dataObject[0].data);
        }
    });
    // let isUnpaidBills = localStorage.getItem('cloudBillsUnpaid');
    let isUnpaidBills;
    getVS1Data("UnpaidBillsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('UnpaidBillsReport', JSON.stringify(false));
            isUnpaidBills = false;
        } else {
            isUnpaidBills = JSON.parse(dataObject[0].data);
        }
    });
    // let isUnpaidPO = localStorage.getItem('cloudPurchaseOrderUnpaid');
    let isUnpaidPO;
    getVS1Data("UnpaidPOReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('UnpaidPOReport', JSON.stringify(false));
            isUnpaidPO = false;
        } else {
            isUnpaidPO = JSON.parse(dataObject[0].data);
        }
    });
    // let isBackOrderedPO = localStorage.getItem('cloudPurchaseOrderBO');
    let isBackOrderedPO;
    getVS1Data("BackOrderedPOReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('BackOrderedPOReport', JSON.stringify(false));
            isBackOrderedPO = false;
        } else {
            isBackOrderedPO = JSON.parse(dataObject[0].data);
        }
    });
    // let isSalesOrderConverted = localStorage.getItem('cloudSalesOrderConverted');
    let isSalesOrderConverted;
    getVS1Data("SalesOrderConvertedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('SalesOrderConvertedReport', JSON.stringify(false));
            isSalesOrderConverted = false;
        } else {
            isSalesOrderConverted = JSON.parse(dataObject[0].data);
        }
    });
    // let isSalesOrderUnconverted = localStorage.getItem('cloudSalesOrderUnconverted');
    let isSalesOrderUnconverted;
    getVS1Data("SalesOrderUnconvertedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('SalesOrderUnconvertedReport', JSON.stringify(false));
            isSalesOrderUnconverted = false;
        } else {
            isSalesOrderUnconverted = JSON.parse(dataObject[0].data);
        }
    });
    // let isPaymentMethodsList = localStorage.getItem('cloudPaymentMethodList');
    let isPaymentMethodsList;
    getVS1Data("PaymentMethodsListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PaymentMethodsListReport', JSON.stringify(false));
            isPaymentMethodsList = false;
        } else {
            isPaymentMethodsList = JSON.parse(dataObject[0].data);
        }
    });
    // let isBackOrderedInvoices = localStorage.getItem('cloudInvoicesBackOrdered');
    let isBackOrderedInvoices;
    getVS1Data("BackOrderedInvoicesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('BackOrderedInvoicesReport', JSON.stringify(false));
            isBackOrderedInvoices = false;
        } else {
            isBackOrderedInvoices = JSON.parse(dataObject[0].data);
        }
    });
    // let isQuotesConverted = localStorage.getItem('cloudQuotesConverted');
    let isQuotesConverted;
    getVS1Data("QuotesConvertedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('QuotesConvertedReport', JSON.stringify(false));
            isQuotesConverted = false;
        } else {
            isQuotesConverted = JSON.parse(dataObject[0].data);
        }
    });
    // let isQuotesUnconverted = localStorage.getItem('cloudQuotesUnconverted');
    let isQuotesUnconverted;
    getVS1Data("QuotesUnconvertedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('QuotesUnconvertedReport', JSON.stringify(false));
            isQuotesUnconverted = false;
        } else {
            isQuotesUnconverted = JSON.parse(dataObject[0].data);
        }
    });
    // let isInvoicesPaid = localStorage.getItem('cloudInvoicesPaid');
    let isInvoicesPaid;
    getVS1Data("InvoicesPaidReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('InvoicesPaidReport', JSON.stringify(false));
            isInvoicesPaid = false;
        } else {
            isInvoicesPaid = JSON.parse(dataObject[0].data);
        }
    });
    // let isInvoicesUnpaid = localStorage.getItem('cloudInvoicesUnpaid');
    let isInvoicesUnpaid;
    getVS1Data("InvoicesUnpaidReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('InvoicesUnpaidReport', JSON.stringify(false));
            isInvoicesUnpaid = false;
        } else {
            isInvoicesUnpaid = JSON.parse(dataObject[0].data);
        }
    });
    // let isTimeSheetDetails = localStorage.getItem('cloudTimeSheet');
    let isTimeSheetDetails;
    getVS1Data("TimeSheetDetailsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('TimeSheetDetailsReport', JSON.stringify(false));
            isTimeSheetDetails = false;
        } else {
            isTimeSheetDetails = JSON.parse(dataObject[0].data);
        }
    });
    // let isChequeList = localStorage.getItem('cloudChequeList');
    let isChequeList;
    getVS1Data("ChequeListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('ChequeListReport', JSON.stringify(false));
            isChequeList = false;
        } else {
            isChequeList = JSON.parse(dataObject[0].data);
        }
    });
    // let isStockAdjustmentList = localStorage.getItem('cloudStockAdjustmentList');
    let isStockAdjustmentList;
    getVS1Data("StockAdjustmentListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('StockAdjustmentListReport', JSON.stringify(false));
            isStockAdjustmentList = false;
        } else {
            isStockAdjustmentList = JSON.parse(dataObject[0].data);
        }
    });
    // let isJournalEntryList = localStorage.getItem('cloudJournalEntryList');
    let isJournalEntryList;
    getVS1Data("JournalEntryListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('JournalEntryListReport', JSON.stringify(false));
            isJournalEntryList = false;
        } else {
            isJournalEntryList = JSON.parse(dataObject[0].data);
        }
    });
    // let isAgedPayables = localStorage.getItem('cloudAgedPayables');
    let isAgedPayables;
    getVS1Data("AgedPayablesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('AgedPayablesReport', JSON.stringify(false));
            isAgedPayables = false;
        } else {
            isAgedPayables = JSON.parse(dataObject[0].data);
        }
    });
    // let isAgedPayablesSummary = localStorage.getItem('cloudAgedPayablesSummary');
    let isAgedPayablesSummary;
    getVS1Data("AgedPayablesSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('AgedPayablesSummaryReport', JSON.stringify(false));
            isAgedPayablesSummary = false;
        } else {
            isAgedPayablesSummary = JSON.parse(dataObject[0].data);
        }
    });
    // let isPurchaseReport = localStorage.getItem('cloudPurchaseReport');
    let isPurchaseReport;
    getVS1Data("PurchaseReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PurchaseReport', JSON.stringify(false));
            isPurchaseReport = false;
        } else {
            isPurchaseReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isPurchaseSummaryReport = localStorage.getItem('cloudPurchaseSummaryReport');
    let isPurchaseSummaryReport;
    getVS1Data("PurchaseSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PurchaseSummaryReport', JSON.stringify(false));
            isPurchaseSummaryReport = false;
        } else {
            isPurchaseSummaryReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isPrintStatement = localStorage.getItem('cloudPrintStatement');
    let isPrintStatement;
    getVS1Data("PrintStatementReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PrintStatementReport', JSON.stringify(false));
            isPrintStatement = false;
        } else {
            isPrintStatement = JSON.parse(dataObject[0].data);
        }
    });
    // let isExecutiveSummary = localStorage.getItem('cloudExecutiveSummary');
    let isExecutiveSummary;
    getVS1Data("ExecutiveSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('ExecutiveSummaryReport', JSON.stringify(false));
            isExecutiveSummary = false;
        } else {
            isExecutiveSummary = JSON.parse(dataObject[0].data);
        }
    });
    // let isCashReport = localStorage.getItem('cloudCashReport');
    let isCashReport;
    getVS1Data("CashReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('CashReport', JSON.stringify(false));
            isCashReport = false;
        } else {
            isCashReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isProfitabilityReport = localStorage.getItem('cloudProfitabilityReport');
    let isProfitabilityReport;
    getVS1Data("ProfitabilityReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('ProfitabilityReport', JSON.stringify(false));
            isProfitabilityReport = false;
        } else {
            isProfitabilityReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isPerformanceReport = localStorage.getItem('cloudPerformanceReport');
    let isPerformanceReport;
    getVS1Data("PerformanceReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('PerformanceReport', JSON.stringify(false));
            isPerformanceReport = false;
        } else {
            isPerformanceReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isBalanceSheetReport = localStorage.getItem('cloudBalanceSheetReport');
    let isBalanceSheetReport;
    getVS1Data("BalanceSheetReports").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('BalanceSheetReports', JSON.stringify(false));
            isBalanceSheetReport = false;
        } else {
            isBalanceSheetReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isIncomeReport = localStorage.getItem('cloudIncomeReport');
    let isIncomeReport;
    getVS1Data("IncomeReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            //addVS1Data('IncomeReport', JSON.stringify(false));
            isIncomeReport = false;
        } else {
            isIncomeReport = JSON.parse(dataObject[0].data);
        }
    });
    // let isPositionReport = localStorage.getItem('cloudPositionReport');
    let isPositionReport;
    getVS1Data("PositionReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            // addVS1Data('PositionReport', JSON.stringify(false));
            isPositionReport = false;
        } else {
            isPositionReport = JSON.parse(dataObject[0].data);
        }
    });

    //BuildProfitability 
    let isBuildProfitability;
    getVS1Data("BuildProfitabilityReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            // addVS1Data('PositionReport', JSON.stringify(false));
            isBuildProfitability = false;
        } else {
            isBuildProfitability = JSON.parse(dataObject[0].data);
        }
    });

    //ProductionWorkSheet 
    let isProductionWorkSheet;
    getVS1Data("ProductionWorksheetReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            // addVS1Data('PositionReport', JSON.stringify(false));
            isProductionWorkSheet = false;
        } else {
            isProductionWorkSheet = JSON.parse(dataObject[0].data);
        }
    });

    //WorkOrder 
    let isWorkOrder;
    getVS1Data("WorkOrderReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            // addVS1Data('PositionReport', JSON.stringify(false));
            isWorkOrder = false;
        } else {
            isWorkOrder = JSON.parse(dataObject[0].data);
        }
    });

    const taxRateService = new TaxRateService();
    const accountantList = [];

    if (isBalanceSheet == true) {
        templateObject.isBalanceSheet.set(true);
    }
    if (isProfitLoss == true) {
        templateObject.isProfitLoss.set(true);
    }
    if (isPLMonthly == true) {
        templateObject.isPLMonthly.set(true);
    }
    if (isPLQuarterly == true) {
        templateObject.isPLQuarterly.set(true);
    }
    if (isPLYearly == true) {
        templateObject.isPLYearly.set(true);
    }
    if (isPLYTD == true) {
        templateObject.isPLYTD.set(true);
    }
    if (isJobSalesSummary == true) {
        templateObject.isJobSalesSummary.set(true);
    }
    if (isBalanceSheet == true) {
        templateObject.isBalanceSheet.set(true);
    }
    if (isAgedReceivables == true) {
        templateObject.isAgedReceivables.set(true);
    }
    if (isAgedReceivablesSummary == true) {
        templateObject.isAgedReceivablesSummary.set(true);
    }
    if (isProductSalesReport == true) {
        templateObject.isProductSalesReport.set(true);
    }
    if (isSalesReport == true) {
        templateObject.isSalesReport.set(true);
    }
    if (isJobProfitReport == true) {
        templateObject.isJobProfitReport.set(true);
    }
    if (isSupplierDetails == true) {
        templateObject.isSupplierDetails.set(true);
    }
    if (isSupplierProduct == true) {
        templateObject.isSupplierProduct.set(true);
    }
    if (isCustomerDetails == true) {
        templateObject.isCustomerDetails.set(true);
    }
    if (isCustomerSummary == true) {
        templateObject.isCustomerSummary.set(true);
    }
    if (isLotReport == true) {
        templateObject.isLotReport.set(true);
    }
    if (isStockValue == true) {
        templateObject.isStockValue.set(true);
    }
    if (isStockQuantity == true) {
        templateObject.isStockQuantity.set(true);
    }
    if (isStockMovementReport == true) {
        templateObject.isStockMovementReport.set(true);
    }
    if (isPayrollHistoryReport == true) {
        templateObject.isPayrollHistoryReport.set(true);
    }
    if (isForeignExchangeHistoryList == true) {
        templateObject.isForeignExchangeHistoryList.set(true);
    }
    if (isForeignExchangeList == true) {
        templateObject.isForeignExchangeList.set(true);
    }
    if (isSalesSummaryReport == true) {
        templateObject.isSalesSummaryReport.set(true);
    }
    if (isGeneralLedger == true) {
        templateObject.isGeneralLedger.set(true);
    }
    if (isTaxSummaryReport == true) {
        templateObject.isTaxSummaryReport.set(true);
    }
    if (isTrialBalance == true) {
        templateObject.isTrialBalance.set(true);
    }
    if (isTimeSheetSummary == true) {
        templateObject.isTimeSheetSummary.set(true);
    }
    if (isPayrollLeaveAccrued == true) {
        templateObject.isPayrollLeaveAccrued.set(true);
    }
    if (isPayrollLeaveTaken == true) {
        templateObject.isPayrollLeaveTaken.set(true);
    }
    if (isSerialNumberReport == true) {
        templateObject.isSerialNumberReport.set(true);
    }
    if (is1099Transaction == true) {
        templateObject.is1099Transaction.set(true);
    }
    if (isAccountsLists == true) {
        templateObject.isAccountsLists.set(true);
    }
    if (isBinLocations == true) {
        templateObject.isBinLocations.set(true);
    }
    if (isTransactionJournal == true) {
        templateObject.isTransactionJournal.set(true);
    }
    if (isUnpaidBills == true) {
        templateObject.isUnpaidBills.set(true);
    }
    if (isUnpaidPO == true) {
        templateObject.isUnpaidPO.set(true);
    }
    if (isBackOrderedPO == true) {
        templateObject.isBackOrderedPO.set(true);
    }
    if (isSalesOrderConverted == true) {
        templateObject.isSalesOrderConverted.set(true);
    }
    if (isSalesOrderUnconverted == true) {
        templateObject.isSalesOrderUnconverted.set(true);
    }
    if (isPaymentMethodsList == true) {
        templateObject.isPaymentMethodsList.set(true);
    }
    if (isBackOrderedInvoices == true) {
        templateObject.isBackOrderedInvoices.set(true);
    }
    if (isQuotesConverted == true) {
        templateObject.isQuotesConverted.set(true);
    }
    if (isQuotesUnconverted == true) {
        templateObject.isQuotesUnconverted.set(true);
    }
    if (isInvoicesPaid == true) {
        templateObject.isInvoicesPaid.set(true);
    }
    if (isInvoicesUnpaid == true) {
        templateObject.isInvoicesUnpaid.set(true);
    }
    if (isTimeSheetDetails == true) {
        templateObject.isTimeSheetDetails.set(true);
    }
    if (isChequeList == true) {
        templateObject.isChequeList.set(true);
    }
    if (isStockAdjustmentList == true) {
        templateObject.isStockAdjustmentList.set(true);
    }
    if (isJournalEntryList == true) {
        templateObject.isJournalEntryList.set(true);
    }
    if (isAgedPayables == true) {
        templateObject.isAgedPayables.set(true);
    }
    if (isAgedPayablesSummary == true) {
        templateObject.isAgedPayablesSummary.set(true);
    }
    if (isPurchaseReport == true) {
        templateObject.isPurchaseReport.set(true);
    }
    if (isPurchaseSummaryReport == true) {
        templateObject.isPurchaseSummaryReport.set(true);
    }
    if (isPrintStatement == true) {
        templateObject.isPrintStatement.set(true);
    }
    if (isExecutiveSummary == true) {
        templateObject.isExecutiveSummary.set(true);
    }
    if (isCashReport == true) {
        templateObject.isCashReport.set(true);
    }
    if (isProfitabilityReport == true) {
        templateObject.isProfitabilityReport.set(true);
    }
    if (isPerformanceReport == true) {
        templateObject.isPerformanceReport.set(true);
    }
    if (isBalanceSheetReport == true) {
        templateObject.isBalanceSheetReport.set(true);
    }
    if (isIncomeReport == true) {
        templateObject.isIncomeReport.set(true);
    }
    if (isPositionReport == true) {
        templateObject.isPositionReport.set(true);
    }

    if(isBuildProfitability == true) {
        templateObject.isBuildProfitability.set(true);
    }
    if(isProductionWorkSheet == true) {
        templateObject.isProductionWorkSheet.set(true);
    }
    if(isWorkOrder == true) {
        templateObject.isWorkOrder.set(true);
    }





    templateObject.getAccountantList = function() {
        getVS1Data('TReportsAccountantsCategory').then(function(dataObject) {

                //         if(dataObject.length == 0){
                //           taxRateService.getAccountantCategory().then(function (data) {
                //               let lineItems = [];
                //               let lineItemObj = {};
                //               for(let i=0; i<data.tdeptclass.length; i++){
                //                   var dataList = {
                //                     id: data.tdeptclass[i].Id || ' ',
                //                     firstname: data.tdeptclass[i].FirstName || '-',
                //                     lastname: data.tdeptclass[i].LastName || '-',
                //                     companyname: data.tdeptclass[i].CompanyName || '-',
                //                     address: data.tdeptclass[i].Address || '-',
                //                     docname: data.tdeptclass[i].DocName || '-',
                //                     towncity: data.tdeptclass[i].TownCity || '-',
                //                     postalzip: data.tdeptclass[i].PostalZip || '-',
                //                     stateregion: data.tdeptclass[i].StateRegion || '-',
                //                     country: data.tdeptclass[i].Country || '-',
                //                     status:data.tdeptclass[i].Active || 'false',
                //                   };

                //                   dataTableList.push(dataList);
                //               }

                //               templateObject.datatablerecords.set(dataTableList);

                //               if(templateObject.datatablerecords.get()){

                //                   Meteor.call('readPrefMethod',localStorage.getItem('mycloudLogonID'),'accountantList', function(error, result){
                //                       if(error){

                //                       }else{
                //                           if(result){
                //                               for (let i = 0; i < result.customFields.length; i++) {
                //                                   let customcolumn = result.customFields;
                //                                   let columData = customcolumn[i].label;
                //                                   let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                //                                   let hiddenColumn = customcolumn[i].hidden;
                //                                   let columnClass = columHeaderUpdate.split('.')[1];
                //                                   let columnWidth = customcolumn[i].width;
                //                                   let columnindex = customcolumn[i].index + 1;

                //                                   if(hiddenColumn == true){
                //                                       $("."+columnClass+"").addClass('hiddenColumn');
                //                                       $("."+columnClass+"").removeClass('showColumn');
                //                                   }
                //                                   else if(hiddenColumn == false){
                //                                       $("."+columnClass+"").removeClass('hiddenColumn');
                //                                       $("."+columnClass+"").addClass('showColumn');
                //                                   }
                //                               }
                //                           }
                //                       }
                //                   });

                //                   setTimeout(function () {
                //                       MakeNegative();
                //                   }, 100);
                //               }

                //               $('.fullScreenSpin').css('display','none');
                //               setTimeout(function () {
                //                   $('#accountantList').DataTable({
                //                       columnDefs: [
                //                           {type: 'date', targets: 0},
                //                           { "orderable": false, "targets": -1 }
                //                       ],
                //                       "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                //                       buttons: [
                //                           {
                //                               extend: 'excelHtml5',
                //                               text: '',
                //                               download: 'open',
                //                               className: "btntabletocsv hiddenColumn",
                //                               filename: "departmentlist_"+ moment().format(),
                //                               orientation:'portrait',
                //                               exportOptions: {
                //                                   columns: ':visible'
                //                               }
                //                           },{
                //                               extend: 'print',
                //                               download: 'open',
                //                               className: "btntabletopdf hiddenColumn",
                //                               text: '',
                //                               title: 'Department List',
                //                               filename: "departmentlist_"+ moment().format(),
                //                               exportOptions: {
                //                                   columns: ':visible'
                //                               }
                //                           }],
                //                       select: true,
                //                       destroy: true,
                //                       colReorder: true,
                //                       colReorder: {
                //                           fixedColumnsRight: 1
                //                       },
                //                       // bStateSave: true,
                //                       // rowId: 0,
                //                       paging: false,
                // //                      "scrollY": "400px",
                // //                      "scrollCollapse": true,
                //                       info: true,
                //                       responsive: true,
                //                       "order": [[ 0, "asc" ]],
                //                       action: function () {
                //                           $('#accountantList').DataTable().ajax.reload();
                //                       },
                //                       "fnDrawCallback": function (oSettings) {
                //                           setTimeout(function () {
                //                               MakeNegative();
                //                           }, 100);
                //                       },

                //                   }).on('page', function () {
                //                       setTimeout(function () {
                //                           MakeNegative();
                //                       }, 100);
                //                       let draftRecord = templateObject.datatablerecords.get();
                //                       templateObject.datatablerecords.set(draftRecord);
                //                   }).on('column-reorder', function () {

                //                   }).on( 'length.dt', function ( e, settings, len ) {
                //                       setTimeout(function () {
                //                           MakeNegative();
                //                       }, 100);
                //                   });

                //                   // $('#accountantList').DataTable().column( 0 ).visible( true );
                //                   $('.fullScreenSpin').css('display','none');
                //               }, 0);

                //               var columns = $('#accountantList th');
                //               let sTible = "";
                //               let sWidth = "";
                //               let sIndex = "";
                //               let sVisible = "";
                //               let columVisible = false;
                //               let sClass = "";
                //               $.each(columns, function(i,v) {
                //                   if(v.hidden == false){
                //                       columVisible =  true;
                //                   }
                //                   if((v.className.includes("hiddenColumn"))){
                //                       columVisible = false;
                //                   }
                //                   sWidth = v.style.width.replace('px', "");

                //                   let datatablerecordObj = {
                //                       sTitle: v.innerText || '',
                //                       sWidth: sWidth || '',
                //                       sIndex: v.cellIndex || '',
                //                       sVisible: columVisible || false,
                //                       sClass: v.className || ''
                //                   };
                //                   tableHeaderList.push(datatablerecordObj);
                //               });
                //               templateObject.tableheaderrecords.set(tableHeaderList);
                //               $('div.dataTables_filter input').addClass('form-control form-control-sm');

                //           }).catch(function (err) {
                //               swal({
                //                   title: 'Oooops...',
                //                   text: err,
                //                   type: 'error',
                //                   showCancelButton: false,
                //                   confirmButtonText: 'Try Again'
                //               }).then((result) => {
                //                   if (result.value) {
                //                       Meteor._reload.reload();
                //                   } else if (result.dismiss === 'cancel') {

                //                   }
                //               });
                //               $('.fullScreenSpin').css('display','none');
                //               // Meteor._reload.reload();
                //           });
                //         }
                //         else{
                let data = JSON.parse(dataObject[0].data);

                // for(let i=0; i<useData.length; i++){
                var dataInfo = {
                    id: data.Id || '',
                    firstname: data.FirstName || '-',
                    lastname: data.LastName || '-',
                    companyname: data.CompanyName || '-',
                    address: data.Address || '-',
                    towncity: data.TownCity || '-',
                    postalzip: data.PostalZip || '-',
                    stateregion: data.StateRegion || '-',
                    country: data.Country || '-',
                };
                accountantList.push(dataInfo);
                // }
                templateObject.accountantList.set(accountantList);
                // }
            })
            .catch(function(err) {
  
            });
    }
    templateObject.getAccountantList();

    $('.c-report-favourite-icon').on("click", function() {
        if (!$(this).hasClass('marked-star')) {
            $(this).addClass('marked-star');
        } else {
            $(this).removeClass('marked-star');
        }
    });
});
Template.allreports.events({
    'click .reportComingSoon': function(event) {
        swal('Coming Soon', '', 'info');
    },
    'click .chkBalanceSheet': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // addVS1Data('BalanceSheetReport', JSON.stringify(true));
            templateObject.isBalanceSheet.set(true);
        } else {
            //addVS1Data('BalanceSheetReport', JSON.stringify(false));
            templateObject.isBalanceSheet.set(false);
        }
    },
    'click .chkProfitLoss': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('ProfitLossReport', JSON.stringify(true));
            templateObject.isProfitLoss.set(true);
        } else {
            //addVS1Data('ProfitLossReport', JSON.stringify(false));
            templateObject.isProfitLoss.set(false);
        }
    },
    'click .chkPLMonthly': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PLMonthlyReport', JSON.stringify(true));
            templateObject.isPLMonthly.set(true);
        } else {
            //addVS1Data('PLMonthlyReport', JSON.stringify(false));
            templateObject.isPLMonthly.set(false);
        }
    },
    'click .chkPLQuarterly': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PLQuarterlyReport', JSON.stringify(true));
            templateObject.isPLQuarterly.set(true);
        } else {
            //addVS1Data('PLQuarterlyReport', JSON.stringify(false));
            templateObject.isPLQuarterly.set(false);
        }
    },
    'click .chkPLYearly': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PLQuarterlyReport', JSON.stringify(true));
            templateObject.isPLYearly.set(true);
        } else {
            localStorage.setItem('cloudPLYearly', false);
            //addVS1Data('PLQuarterlyReport', JSON.stringify(false));
            templateObject.isPLYearly.set(false);
        }
    },
    'click .chkPLYTD': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PLYTDReport', JSON.stringify(true));
            templateObject.isPLYTD.set(true);
        } else {
            //addVS1Data('PLYTDReport', JSON.stringify(false));
            // localStorage.setItem('cloudPLYTD', false);
            templateObject.isPLYTD.set(false);
        }
    },
    'click .chkJobSalesSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('JobSalesSummaryReport', JSON.stringify(true));
            // localStorage.setItem('cloudJobSalesSummary', true);
            templateObject.isJobSalesSummary.set(true);
        } else {
            //addVS1Data('JobSalesSummaryReport', JSON.stringify(false));
            // localStorage.setItem('cloudJobSalesSummary', false);
            templateObject.isJobSalesSummary.set(false);
        }
    },
    'click .chkAgedReceivables': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('AgedReceivablesReport', JSON.stringify(true));
            // localStorage.setItem('cloudAgedReceivables', true);
            templateObject.isAgedReceivables.set(true);
        } else {
            // localStorage.setItem('cloudAgedReceivables', false);
            //addVS1Data('AgedReceivablesReport', JSON.stringify(false));
            templateObject.isAgedReceivables.set(false);
        }
    },
    'click .chkAgedReceivablesSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudAgedReceivablesSummary', true);
            //addVS1Data('AgedReceivablesSummaryReport', JSON.stringify(true));
            templateObject.isAgedReceivablesSummary.set(true);
        } else {
            // localStorage.setItem('cloudAgedReceivablesSummary', false);
            //addVS1Data('AgedReceivablesSummaryReport', JSON.stringify(false));
            templateObject.isAgedReceivablesSummary.set(false);
        }
    },
    'click .chkProductSalesReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('ProductSalesReport', JSON.stringify(true));
            // localStorage.setItem('cloudProductSalesReport', true);
            templateObject.isProductSalesReport.set(true);
        } else {
            //addVS1Data('ProductSalesReport', JSON.stringify(false));
            // localStorage.setItem('cloudProductSalesReport', false);
            templateObject.isProductSalesReport.set(false);
        }
    },
    'click .chkSalesReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('SalesReport', JSON.stringify(true));
            // localStorage.setItem('cloudSalesReport', true);
            templateObject.isSalesReport.set(true);
        } else {
            // localStorage.setItem('cloudSalesReport', false);
            //addVS1Data('SalesReport', JSON.stringify(false));
            templateObject.isSalesReport.set(false);
        }
    },
    'click .chkJobProfitReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudJobProfit', true);
            //addVS1Data('JobProfitReport', JSON.stringify(true));
            templateObject.isJobProfitReport.set(true);
        } else {
            // localStorage.setItem('cloudJobProfit', false);
            //addVS1Data('JobProfitReport', JSON.stringify(false));
            templateObject.isJobProfitReport.set(false);
        }
    },
    'click .chkSupplierDetails': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudSupplierDetails', true);
            //addVS1Data('SupplierDetailsReport', JSON.stringify(true));
            templateObject.isSupplierDetails.set(true);
        } else {
            // localStorage.setItem('cloudSupplierDetails', false);
            //addVS1Data('SupplierDetailsReport', JSON.stringify(false));
            templateObject.isSupplierDetails.set(false);
        }
    },
    'click .chkSupplierProduct': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudSupplierProduct', true);
            //addVS1Data('SupplierProductReport', JSON.stringify(true));
            templateObject.isSupplierProduct.set(true);
        } else {
            // localStorage.setItem('cloudSupplierProduct', false);
            //addVS1Data('SupplierProductReport', JSON.stringify(false));
            templateObject.isSupplierProduct.set(false);
        }
    },
    'click .chkCustomerDetails': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudCustomerDetails', true);
            //addVS1Data('CustomerDetailsReport', JSON.stringify(true));
            templateObject.isCustomerDetails.set(true);
        } else {
            // localStorage.setItem('cloudCustomerDetails', false);
            //addVS1Data('CustomerDetailsReport', JSON.stringify(false));
            templateObject.isCustomerDetails.set(false);
        }
    },
    'click .chkCustomerSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudCustomerSummary', true);
            //addVS1Data('CustomerSummaryReport', JSON.stringify(true));
            templateObject.isCustomerSummary.set(true);
        } else {
            // localStorage.setItem('cloudCustomerSummary', false);
            //addVS1Data('CustomerSummaryReport', JSON.stringify(false));
            templateObject.isCustomerSummary.set(false);
        }
    },
    'click .chkLotReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudLotReport', true);
            //addVS1Data('LotReport', JSON.stringify(true));
            templateObject.isLotReport.set(true);
        } else {
            // localStorage.setItem('cloudLotReport', false);
            //addVS1Data('LotReport', JSON.stringify(false));
            templateObject.isLotReport.set(false);
        }
    },
    'click .chkStockValue': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudStockValue', true);
            //addVS1Data('StockValueReport', JSON.stringify(true));
            templateObject.isStockValue.set(true);
        } else {
            // localStorage.setItem('cloudStockValue', false);
            //addVS1Data('StockValueReport', JSON.stringify(false));
            templateObject.isStockValue.set(false);
        }
    },
    'click .chkStockQuantity': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('StockQuantityReport', JSON.stringify(true));
            // localStorage.setItem('cloudStockQuantity', true);
            templateObject.isStockQuantity.set(true);
        } else {
            // localStorage.setItem('cloudStockQuantity', false);
            //addVS1Data('StockQuantityReport', JSON.stringify(false));
            templateObject.isStockQuantity.set(false);
        }
    },
    'click .chkStockMovementReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudStockMovementReport', true);
            //addVS1Data('StockMovementReport', JSON.stringify(true));
            templateObject.isStockMovementReport.set(true);
        } else {
            // localStorage.setItem('cloudStockMovementReport', false);
            //addVS1Data('StockMovementReport', JSON.stringify(false));
            templateObject.isStockMovementReport.set(false);
        }
    },
    'click .chkPayrollHistoryReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudPayrollHistoryReport', true);
            //addVS1Data('PayrollHistoryReport', JSON.stringify(true));
            templateObject.isPayrollHistoryReport.set(true);
        } else {
            // localStorage.setItem('cloudPayrollHistoryReport', false);
            //addVS1Data('PayrollHistoryReport', JSON.stringify(false));
            templateObject.isPayrollHistoryReport.set(false);
        }
    },
    'click .chkForeignExchangeHistoryList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('ForeignExchangeHistoryListReport', JSON.stringify(true));
            // localStorage.setItem('cloudForeignExchangeHistoryList', true);
            templateObject.isForeignExchangeHistoryList.set(true);
        } else {
            // localStorage.setItem('cloudForeignExchangeHistoryList', false);
            //addVS1Data('ForeignExchangeHistoryListReport', JSON.stringify(false));
            templateObject.isForeignExchangeHistoryList.set(false);
        }
    },
    'click .chkForeignExchangeList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudForeignExchangeList', true);
            //addVS1Data('ForeignExchangeListReport', JSON.stringify(true));
            templateObject.isForeignExchangeList.set(true);
        } else {
            // localStorage.setItem('cloudForeignExchangeList', false);
            //addVS1Data('ForeignExchangeListReport', JSON.stringify(false));
            templateObject.isForeignExchangeList.set(false);
        }
    },
    'click .chkSalesSummaryReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('SalesSummaryReport', JSON.stringify(true));
            // localStorage.setItem('cloudSalesSummaryReport', true);
            templateObject.isSalesSummaryReport.set(true);
        } else {
            // localStorage.setItem('cloudSalesSummaryReport', false);
            //addVS1Data('SalesSummaryReport', JSON.stringify(false));
            templateObject.isSalesSummaryReport.set(false);
        }
    },
    'click .chkGeneralLedger': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudGeneralLedger', true);
            //addVS1Data('GeneralLedgerReport', JSON.stringify(true));
            templateObject.isGeneralLedger.set(true);
        } else {
            // localStorage.setItem('cloudGeneralLedger', false);
            //addVS1Data('GeneralLedgerReport', JSON.stringify(false));
            templateObject.isGeneralLedger.set(false);
        }
    },
    'click .chkTaxSummaryReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudTaxSummaryReport', true);
            //addVS1Data('TaxSummaryReport', JSON.stringify(true));
            templateObject.isTaxSummaryReport.set(true);
        } else {
            // localStorage.setItem('cloudTaxSummaryReport', false);
            //addVS1Data('TaxSummaryReport', JSON.stringify(false));
            templateObject.isTaxSummaryReport.set(false);
        }
    },
    'click .chkTrialBalance': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudTrialBalance', true);
            //addVS1Data('TrialBalanceReport', JSON.stringify(true));
            templateObject.isTrialBalance.set(true);
        } else {
            // localStorage.setItem('cloudTrialBalance', false);
            //addVS1Data('TrialBalanceReport', JSON.stringify(false));
            templateObject.isTrialBalance.set(false);
        }
    },
    'click .chkTimeSheetSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudTimeSheetSummary', true);
            //addVS1Data('TimeSheetSummaryReport', JSON.stringify(true));
            templateObject.isTimeSheetSummary.set(true);
        } else {
            // localStorage.setItem('cloudTimeSheetSummary', false);
            //addVS1Data('TimeSheetSummaryReport', JSON.stringify(false));
            templateObject.isTimeSheetSummary.set(false);
        }
    },
    'click .chkSerialNumberReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudSerialNumberReport', true);
            //addVS1Data('SerialNumberReport', JSON.stringify(true));
            templateObject.isSerialNumberReport.set(true);
        } else {
            // localStorage.setItem('cloudSerialNumberReport', false);
            //addVS1Data('SerialNumberReport', JSON.stringify(false));
            templateObject.isSerialNumberReport.set(false);
        }
    },
    'click .chk1099Transaction': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloud1099Transaction', true);
            //addVS1Data('1099TransactionReport', JSON.stringify(true));
            templateObject.is1099Transaction.set(true);
        } else {
            // localStorage.setItem('cloud1099Transaction', false);
            //addVS1Data('1099TransactionReport', JSON.stringify(false));
            templateObject.is1099Transaction.set(false);
        }
    },
    'click .chkAccountsLists': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudAccountList', true);
            //addVS1Data('AccountsListsReport', JSON.stringify(true));
            templateObject.isAccountsLists.set(true);
        } else {
            // localStorage.setItem('cloudAccountList', false);
            //addVS1Data('AccountsListsReport', JSON.stringify(false));
            templateObject.isAccountsLists.set(false);
        }
    },
    'click .chkBinLocationsList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudBinLocations', true);
            //addVS1Data('BinLocationsListReport', JSON.stringify(true));
            templateObject.isBinLocations.set(true);
        } else {
            // localStorage.setItem('cloudBinLocations', false);
            //addVS1Data('BinLocationsListReport', JSON.stringify(false));
            templateObject.isBinLocations.set(false);
        }
    },
    'click .chkTransactionJournal': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudTransactionJournal', true);
            //addVS1Data('TransactionJournalReport', JSON.stringify(true));
            templateObject.isTransactionJournal.set(true);
        } else {
            // localStorage.setItem('cloudTransactionJournal', false);
            //addVS1Data('TransactionJournalReport', JSON.stringify(false));
            templateObject.isTransactionJournal.set(false);
        }
    },
    'click .chkUnpaidBills': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudBillsUnpaid', true);
            //addVS1Data('UnpaidBillsReport', JSON.stringify(true));
            templateObject.isUnpaidBills.set(true);
        } else {
            // localStorage.setItem('cloudBillsUnpaid', false);
            //addVS1Data('UnpaidBillsReport', JSON.stringify(false));
            templateObject.isUnpaidBills.set(false);
        }
    },
    'click .chkUnpaidPO': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudPurchaseOrderBO', true);
            //addVS1Data('UnpaidPOReport', JSON.stringify(true));
            templateObject.isUnpaidPO.set(true);
        } else {
            // localStorage.setItem('cloudPurchaseOrderBO', false);
            //addVS1Data('UnpaidPOReport', JSON.stringify(false));
            templateObject.isUnpaidPO.set(false);
        }
    },
    'click .chkBackOrderedPO': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudPurchaseOrderBO', true);
            //addVS1Data('BackOrderedPOReport', JSON.stringify(true));
            templateObject.isBackOrderedPO.set(true);
        } else {
            // localStorage.setItem('cloudPurchaseOrderBO', false);
            //addVS1Data('BackOrderedPOReport', JSON.stringify(false));
            templateObject.isBackOrderedPO.set(false);
        }
    },
    'click .chkSalesOrderConverted': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('SalesOrderConvertedReport', JSON.stringify(true));
            // localStorage.setItem('cloudSalesOrderConverted', true);
            templateObject.isSalesOrderConverted.set(true);
        } else {
            //addVS1Data('SalesOrderConvertedReport', JSON.stringify(false));
            // localStorage.setItem('cloudSalesOrderConverted', false);
            templateObject.isSalesOrderConverted.set(false);
        }
    },
    'click .chkSalesOrderUnconverted': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('SalesOrderUnconvertedReport', JSON.stringify(true));
            // localStorage.setItem('cloudSalesOrderUnconverted', true);
            templateObject.isSalesOrderUnconverted.set(true);
        } else {
            // localStorage.setItem('cloudSalesOrderUnconverted', false);
            //addVS1Data('SalesOrderUnconvertedReport', JSON.stringify(false));
            templateObject.isSalesOrderUnconverted.set(false);
        }
    },
    'click .chkPaymentMethodsList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PaymentMethodsListReport', JSON.stringify(true));
            // localStorage.setItem('cloudPaymentMethodList', true);
            templateObject.isPaymentMethodsList.set(true);
        } else {
            //addVS1Data('PaymentMethodsListReport', JSON.stringify(false));
            // localStorage.setItem('cloudPaymentMethodList', false);
            templateObject.isPaymentMethodsList.set(false);
        }
    },
    'click .chkBackOrderedInvoices': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudInvoicesBackOrdered', true);
            //addVS1Data('BackOrderedInvoicesReport', JSON.stringify(true));
            templateObject.isBackOrderedInvoices.set(true);
        } else {
            // localStorage.setItem('cloudInvoicesBackOrdered', false);
            //addVS1Data('BackOrderedInvoicesReport', JSON.stringify(false));
            templateObject.isBackOrderedInvoices.set(false);
        }
    },
    'click .chkQuotesConverted': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('QuotesConvertedReport', JSON.stringify(true));
            // localStorage.setItem('cloudQuotesConverted', true);
            templateObject.isQuotesConverted.set(true);
        } else {
            //addVS1Data('QuotesConvertedReport', JSON.stringify(false));
            // localStorage.setItem('cloudQuotesConverted', false);
            templateObject.isQuotesConverted.set(false);
        }
    },
    'click .chkQuotesUnconverted': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('QuotesUnconvertedReport', JSON.stringify(true));
            // localStorage.setItem('cloudQuotesUnconverted', true);
            templateObject.isQuotesUnconverted.set(true);
        } else {
            // localStorage.setItem('cloudQuotesUnconverted', false);
            //addVS1Data('QuotesUnconvertedReport', JSON.stringify(false));
            templateObject.isQuotesUnconverted.set(false);
        }
    },
    'click .chkInvoicesPaid': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('InvoicesPaidReport', JSON.stringify(true));
            // localStorage.setItem('cloudInvoicesPaid', true);
            templateObject.isInvoicesPaid.set(true);
        } else {
            //addVS1Data('InvoicesPaidReport', JSON.stringify(false));
            // localStorage.setItem('cloudInvoicesPaid', false);
            templateObject.isInvoicesPaid.set(false);
        }
    },
    'click .chkInvoicesUnpaid': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudInvoicesUnpaid', true);
            //addVS1Data('InvoicesUnpaidReport', JSON.stringify(true));
            templateObject.isInvoicesUnpaid.set(true);
        } else {
            // localStorage.setItem('cloudInvoicesUnpaid', false);
            //addVS1Data('InvoicesUnpaidReport', JSON.stringify(false));
            templateObject.isInvoicesUnpaid.set(false);
        }
    },
    'click .chkTimeSheet': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('TimeSheetReport', JSON.stringify(true));
            // localStorage.setItem('cloudTimeSheet', true);
            templateObject.isTimeSheetDetails.set(true);
        } else {
            //addVS1Data('TimeSheetReport', JSON.stringify(false));
            // localStorage.setItem('cloudTimeSheet', false);
            templateObject.isTimeSheetDetails.set(false);
        }
    },
    'click .chkChequeList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('ChequeListReport', JSON.stringify(true));
            // localStorage.setItem('cloudChequeList', true);
            templateObject.isChequeList.set(true);
        } else {
            //addVS1Data('ChequeListReport', JSON.stringify(false));
            // localStorage.setItem('cloudChequeList', false);
            templateObject.isChequeList.set(false);
        }
    },
    'click .chkPayrollLeaveAccrued': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PayrollLeaveAccruedReport', JSON.stringify(true));
            // localStorage.setItem('cloudPayrollLeaveAccrued', true);
            templateObject.isPayrollLeaveAccrued.set(true);
        } else {
            //addVS1Data('PayrollLeaveAccruedReport', JSON.stringify(false));
            // localStorage.setItem('cloudPayrollLeaveAccrued', false);
            templateObject.isPayrollLeaveAccrued.set(false);
        }
    },
    'click .chkPayrollLeaveTaken': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PayrollLeaveTakenReport', JSON.stringify(true));
            // localStorage.setItem('cloudPayrollLeaveTaken', true);
            templateObject.isPayrollLeaveTaken.set(true);
        } else {
            //addVS1Data('PayrollLeaveTakenReport', JSON.stringify(false));
            // localStorage.setItem('cloudPayrollLeaveTaken', false);
            templateObject.isPayrollLeaveTaken.set(false);
        }
    },
    'click .chkStockAdjustmentList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('StockAdjustmentListReport', JSON.stringify(true));
            // localStorage.setItem('cloudStockAdjustmentList', true);
            templateObject.isStockAdjustmentList.set(true);
        } else {
            //addVS1Data('StockAdjustmentListReport', JSON.stringify(false));
            // localStorage.setItem('cloudStockAdjustmentList', false);
            templateObject.isStockAdjustmentList.set(false);
        }
    },
    'click .chkJournalEntryList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('JournalEntryListReport', JSON.stringify(true));
            // localStorage.setItem('cloudJournalEntryList', true);
            templateObject.isJournalEntryList.set(true);
        } else {
            //addVS1Data('JournalEntryListReport', JSON.stringify(false));
            // localStorage.setItem('cloudJournalEntryList', false);
            templateObject.isJournalEntryList.set(false);
        }
    },
    'click .chkAgedPayables': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('AgedPayablesReport', JSON.stringify(true));
            // localStorage.setItem('cloudAgedPayables', true);
            templateObject.isAgedPayables.set(true);
        } else {
            //addVS1Data('AgedPayablesReport', JSON.stringify(false));
            // localStorage.setItem('cloudAgedPayables', false);
            templateObject.isAgedPayables.set(false);
        }
    },
    'click .chkAgedPayablesSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('AgedPayablesSummaryReport', JSON.stringify(true));
            // localStorage.setItem('cloudAgedPayablesSummary', true);
            templateObject.isAgedPayablesSummary.set(true);
        } else {
            //addVS1Data('AgedPayablesSummaryReport', JSON.stringify(false));
            // localStorage.setItem('cloudAgedPayablesSummary', false);
            templateObject.isAgedPayablesSummary.set(false);
        }
    },
    'click .chkPurchaseReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PurchaseReportReport', JSON.stringify(true));
            // localStorage.setItem('cloudPurchaseReport', true);
            templateObject.isPurchaseReport.set(true);
        } else {
            // localStorage.setItem('cloudPurchaseReport', false);
            //addVS1Data('PurchaseReportReport', JSON.stringify(false));
            templateObject.isPurchaseReport.set(false);
        }
    },
    'click .chkPurchaseSummaryReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudPurchaseSummaryReport', true);
            //addVS1Data('PurchaseSummaryReportReport', JSON.stringify(true));
            templateObject.isPurchaseSummaryReport.set(true);
        } else {
            // localStorage.setItem('cloudPurchaseSummaryReport', false);
            //addVS1Data('PurchaseSummaryReportReport', JSON.stringify(false));
            templateObject.isPurchaseSummaryReport.set(false);
        }
    },
    'click .chkPrintStatement': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PrintStatementReport', JSON.stringify(true));
            // localStorage.setItem('cloudPrintStatement', true);
            templateObject.isPrintStatement.set(true);
        } else {
            //addVS1Data('PrintStatementReport', JSON.stringify(false));
            // localStorage.setItem('cloudPrintStatement', false);
            templateObject.isPrintStatement.set(false);
        }
    },
    'click .chkExecutiveSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('ExecutiveSummaryReport', JSON.stringify(true));
            // localStorage.setItem('cloudExecutiveSummary', true);
            templateObject.isExecutiveSummary.set(true);
        } else {
            //addVS1Data('ExecutiveSummaryReport', JSON.stringify(false));
            // localStorage.setItem('cloudExecutiveSummary', false);
            templateObject.isExecutiveSummary.set(false);
        }
    },
    'click .chkCashReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('CashReport', JSON.stringify(true));
            // localStorage.setItem('cloudCashReport', true);
            templateObject.isCashReport.set(true);
        } else {
            //addVS1Data('CashReport', JSON.stringify(false));
            // localStorage.setItem('cloudCashReport', false);
            templateObject.isCashReport.set(false);
        }
    },
    'click .chkProfitabilityReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudProfitabilityReport', true);
            //addVS1Data('ProfitabilityReport', JSON.stringify(true));
            templateObject.isProfitabilityReport.set(true);
        } else {
            // localStorage.setItem('cloudProfitabilityReport', false);
            //addVS1Data('ProfitabilityReport', JSON.stringify(false));
            templateObject.isProfitabilityReport.set(false);
        }
    },
    'click .chkPerformanceReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('PerformanceReport', JSON.stringify(true));
            // localStorage.setItem('cloudPerformanceReport', true);
            templateObject.isPerformanceReport.set(true);
        } else {
            //addVS1Data('PerformanceReport', JSON.stringify(false));
            // localStorage.setItem('cloudPerformanceReport', false);
            templateObject.isPerformanceReport.set(false);
        }
    },
    'click .chkBalanceSheetReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            //addVS1Data('BalanceSheetReports', JSON.stringify(true));
            templateObject.isBalanceSheetReport.set(true);
        } else {
            //addVS1Data('BalanceSheetReports', JSON.stringify(false));
            templateObject.isBalanceSheetReport.set(false);
        }
    },
    'click .chkIncomeReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudIncomeReport', true);
            //addVS1Data('IncomeReport', JSON.stringify(true));
            templateObject.isIncomeReport.set(true);
        } else {
            // localStorage.setItem('cloudIncomeReport', false);
            //addVS1Data('IncomeReport', JSON.stringify(false));
            templateObject.isIncomeReport.set(false);
        }
    },
    'click .chkPositionReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            // localStorage.setItem('cloudPositionReport', true);
            //addVS1Data('PositionReport', JSON.stringify(true));
            templateObject.isPositionReport.set(true);
        } else {
            // localStorage.setItem('cloudPositionReport', false);
            //addVS1Data('PositionReport', JSON.stringify(false));
            templateObject.isPositionReport.set(false);
        }
    },
    'click .showhidden_fin': function(event) {
        if (event.target.id === "ellipsis_fin") {
            $('#ellipsis_fin').hide();
            $('#chevron_up_fin').show();
        } else {
            $('#chevron_up_fin').hide();
            $('#ellipsis_fin').show();
        }
    },
    'click .showhidden_account': function(event) {
        if (event.target.id === "ellipsis_account") {
            $('#ellipsis_account').hide();
            $('#chevron_up_account').show();
        } else {
            $('#chevron_up_account').hide();
            $('#ellipsis_account').show();
        }
    },
    'click .showhidden_sales': function(event) {
        if (event.target.id === "ellipsis_sales") {
            $('#ellipsis_sales').hide();
            $('#chevron_up_sales').show();
        } else {
            $('#chevron_up_sales').hide();
            $('#ellipsis_sales').show();
        }
    },
    'click .showhidden_purchases': function(event) {
        if (event.target.id === "ellipsis_purchases") {
            $('#ellipsis_purchases').hide();
            $('#chevron_up_purchases').show();
        } else {
            $('#chevron_up_purchases').hide();
            $('#ellipsis_purchases').show();
        }
    },
    'click .showhidden_inventory': function(event) {
        if (event.target.id === "ellipsis_inventory") {
            $('#ellipsis_inventory').hide();
            $('#chevron_up_inventory').show();
        } else {
            $('#chevron_up_inventory').hide();
            $('#ellipsis_inventory').show();
        }
    },
    'click .btnBatchUpdate': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        batchUpdateCall();
    },
    'click .reportpage': function() {
        setTimeout(function() {
            Meteor._reload.reload();
        }, 100);
    }
});

Template.allreports.helpers({
    isBalanceSheet: function() {
        return Template.instance().isBalanceSheet.get();
    },
    lastBatchUpdate: () => {
        let transactionTableLastUpdated = "";
        var currentDate = new Date();
        if (localStorage.getItem('VS1TransTableUpdate')) {
            transactionTableLastUpdated = moment(localStorage.getItem('VS1TransTableUpdate')).format("ddd MMM D, YYYY, hh:mm A");
        } else {
            transactionTableLastUpdated = moment(currentDate).format("ddd MMM D, YYYY, hh:mm A");
        }
        return transactionTableLastUpdated;
    },
    isAccountsLists: function() {
        return Template.instance().isAccountsLists.get();
    },
    isBinLocations: function() {
        return Template.instance().isBinLocations.get();
    },
    isTransactionJournal: function() {
        return Template.instance().isTransactionJournal.get();
    },
    isUnpaidBills: function() {
        return Template.instance().isUnpaidBills.get();
    },
    isUnpaidPO: function() {
        return Template.instance().isUnpaidPO.get();
    },
    isBackOrderedPO: function() {
        return Template.instance().isBackOrderedPO.get();
    },
    isSalesOrderConverted: function() {
        return Template.instance().isSalesOrderConverted.get();
    },
    isSalesOrderUnconverted: function() {
        return Template.instance().isSalesOrderUnconverted.get();
    },
    isPaymentMethodsList: function() {
        return Template.instance().isPaymentMethodsList.get();
    },
    isBackOrderedInvoices: function() {
        return Template.instance().isBackOrderedInvoices.get();
    },
    isQuotesConverted: function() {
        return Template.instance().isQuotesConverted.get();
    },
    isQuotesUnconverted: function() {
        return Template.instance().isQuotesUnconverted.get();
    },
    isInvoicesPaid: function() {
        return Template.instance().isInvoicesPaid.get();
    },
    isInvoicesUnpaid: function() {
        return Template.instance().isInvoicesUnpaid.get();
    },
    isPayrollLeaveAccrued: function() {
        return Template.instance().isPayrollLeaveAccrued.get();
    },
    isPayrollLeaveTaken: function() {
        return Template.instance().isPayrollLeaveTaken.get();
    },
    isTimeSheetDetails: function() {
        return Template.instance().isTimeSheetDetails.get();
    },
    isChequeList: function() {
        return Template.instance().isChequeList.get();
    },
    isStockAdjustmentList: function() {
        return Template.instance().isStockAdjustmentList.get();
    },
    isJournalEntryList: function() {
        return Template.instance().isJournalEntryList.get();
    },
    isProfitLoss: function() {
        return Template.instance().isProfitLoss.get();
    },
    isPLMonthly: function() {
        return Template.instance().isPLMonthly.get();
    },
    isPLQuarterly: function() {
        return Template.instance().isPLQuarterly.get();
    },
    isPLYearly: function() {
        return Template.instance().isPLYearly.get();
    },
    isPLYTD: function() {
        return Template.instance().isPLYTD.get();
    },
    isJobSalesSummary: function() {
        return Template.instance().isJobSalesSummary.get();
    },
    isAgedReceivables: function() {
        return Template.instance().isAgedReceivables.get();
    },
    isAgedReceivablesSummary: function() {
        return Template.instance().isAgedReceivablesSummary.get();
    },
    isProductSalesReport: function() {
        return Template.instance().isProductSalesReport.get();
    },
    isSalesReport: function() {
        return Template.instance().isSalesReport.get();
    },
    isJobProfitReport: function() {
        return Template.instance().isJobProfitReport.get();
    },
    isSupplierDetails: function() {
        return Template.instance().isSupplierDetails.get();
    },
    isSupplierProduct: function() {
        return Template.instance().isSupplierProduct.get();
    },
    isCustomerDetails: function() {
        return Template.instance().isCustomerDetails.get();
    },
    isCustomerSummary: function() {
        return Template.instance().isCustomerSummary.get();
    },
    isLotReport: function() {
        return Template.instance().isLotReport.get();
    },
    isStockValue: function() {
        return Template.instance().isStockValue.get();
    },
    isStockQuantity: function() {
        return Template.instance().isStockQuantity.get();
    },
    isStockMovementReport: function() {
        return Template.instance().isStockMovementReport.get();
    },
    isPayrollHistoryReport: function() {
        return Template.instance().isPayrollHistoryReport.get();
    },
    isForeignExchangeHistoryList: function() {
        return Template.instance().isForeignExchangeHistoryList.get();
    },
    isForeignExchangeList: function() {
        return Template.instance().isForeignExchangeList.get();
    },
    isSalesSummaryReport: function() {
        return Template.instance().isSalesSummaryReport.get();
    },
    isGeneralLedger: function() {
        return Template.instance().isGeneralLedger.get();
    },
    isTaxSummaryReport: function() {
        return Template.instance().isTaxSummaryReport.get();
    },
    isTrialBalance: function() {
        return Template.instance().isTrialBalance.get();
    },
    isTimeSheetSummary: function() {
        return Template.instance().isTimeSheetSummary.get();
    },
    isSerialNumberReport: function() {
        return Template.instance().isSerialNumberReport.get();
    },
    is1099Transaction: function() {
        return Template.instance().is1099Transaction.get();
    },
    isAgedPayables: function() {
        return Template.instance().isAgedPayables.get();
    },
    isAgedPayablesSummary: function() {
        return Template.instance().isAgedPayablesSummary.get();
    },
    isPurchaseReport: function() {
        return Template.instance().isPurchaseReport.get();
    },
    isPurchaseSummaryReport: function() {
        return Template.instance().isPurchaseSummaryReport.get();
    },
    isPrintStatement: function() {
        return Template.instance().isPrintStatement.get();
    },
    isExecutiveSummary: function() {
        return Template.instance().isExecutiveSummary.get();
    },
    isCashReport: function() {
        return Template.instance().isCashReport.get();
    },
    isProfitabilityReport: function() {
        return Template.instance().isProfitabilityReport.get();
    },
    isPerformanceReport: function() {
        return Template.instance().isPerformanceReport.get();
    },
    isBalanceSheetReport: function() {
        return Template.instance().isBalanceSheetReport.get();
    },
    isIncomeReport: function() {
        return Template.instance().isIncomeReport.get();
    },
    isPositionReport: function() {
        return Template.instance().isPositionReport.get();
    },
    isBuildProfitability: function() {
        return Template.instance().isBuildProfitability.get();
    },
    isProductionWorkSheet:function() {
        return Template.instance().isProductionWorkSheet.get();
    },

    isWorkOrder:function() {
        return template.instance().isWorkOrder.get();
    },

    isFavorite: function() {
        let isBalanceSheet = Template.instance().isBalanceSheet.get();
        let isProfitLoss = Template.instance().isProfitLoss.get();
        let isPLMonthly = Template.instance().isPLMonthly.get();
        let isPLQuarterly = Template.instance().isPLQuarterly.get();
        let isPLYearly = Template.instance().isPLYearly.get();
        let isPLYTD = Template.instance().isPLYTD.get();
        let isJobSalesSummary = Template.instance().isJobSalesSummary.get();
        let isAgedReceivables = Template.instance().isAgedReceivables.get();
        let isAgedReceivablesSummary = Template.instance().isAgedReceivablesSummary.get();
        let isProductSalesReport = Template.instance().isProductSalesReport.get();
        let isSalesReport = Template.instance().isSalesReport.get();
        let isJobProfitReport = Template.instance().isJobProfitReport.get();
        let isSupplierDetails = Template.instance().isSupplierDetails.get();
        let isSupplierProduct = Template.instance().isSupplierProduct.get();
        let isCustomerDetails = Template.instance().isCustomerDetails.get();
        let isCustomerSummary = Template.instance().isCustomerSummary.get();
        let isLotReport = Template.instance().isLotReport.get();
        let isStockValue = Template.instance().isStockValue.get();
        let isStockQuantity = Template.instance().isStockQuantity.get();
        let isStockMovementReport = Template.instance().isStockMovementReport.get();
        let isPayrollHistoryReport = Template.instance().isPayrollHistoryReport.get();
        let isForeignExchangeHistoryList = Template.instance().isForeignExchangeHistoryList.get();
        let isForeignExchangeList = Template.instance().isForeignExchangeList.get();
        let isSalesSummaryReport = Template.instance().isSalesSummaryReport.get();
        let isGeneralLedger = Template.instance().isGeneralLedger.get();
        let isTaxSummaryReport = Template.instance().isTaxSummaryReport.get();
        let isTrialBalance = Template.instance().isTrialBalance.get();
        let isTimeSheetSummary = Template.instance().isTimeSheetSummary.get();
        let isPayrollLeaveAccrued = Template.instance().isPayrollLeaveAccrued.get();
        let isPayrollLeaveTaken = Template.instance().isPayrollLeaveTaken.get();
        let isSerialNumberReport = Template.instance().isSerialNumberReport.get();
        let is1099Transaction = Template.instance().is1099Transaction.get();
        let isAccountsLists = Template.instance().isAccountsLists.get();
        let isBinLocations = Template.instance().isBinLocations.get();
        let isTransactionJournal = Template.instance().isTransactionJournal.get();
        let isUnpaidBills = Template.instance().isUnpaidBills.get();
        let isUnpaidPO = Template.instance().isUnpaidPO.get();
        let isBackOrderedPO = Template.instance().isBackOrderedPO.get();
        let isSalesOrderConverted = Template.instance().isSalesOrderConverted.get();
        let isSalesOrderUnconverted = Template.instance().isSalesOrderUnconverted.get();
        let isPaymentMethodsList = Template.instance().isPaymentMethodsList.get();
        let isBackOrderedInvoices = Template.instance().isBackOrderedInvoices.get();
        let isQuotesConverted = Template.instance().isQuotesConverted.get();
        let isQuotesUnconverted = Template.instance().isQuotesUnconverted.get();
        let isInvoicesPaid = Template.instance().isInvoicesPaid.get();
        let isInvoicesUnpaid = Template.instance().isInvoicesUnpaid.get();
        let isTimeSheetDetails = Template.instance().isTimeSheetDetails.get();
        let isChequeList = Template.instance().isChequeList.get();
        let isStockAdjustmentList = Template.instance().isStockAdjustmentList.get();
        let isJournalEntryList = Template.instance().isJournalEntryList.get();
        let isAgedPayables = Template.instance().isAgedPayables.get();
        let isAgedPayablesSummary = Template.instance().isAgedPayablesSummary.get();
        let isPurchaseReport = Template.instance().isPurchaseReport.get();
        let isPurchaseSummaryReport = Template.instance().isPurchaseSummaryReport.get();
        let isPrintStatement = Template.instance().isPrintStatement.get();
        let isExecutiveSummary = Template.instance().isExecutiveSummary.get();
        let isCashReport = Template.instance().isCashReport.get();
        let isProfitabilityReport = Template.instance().isProfitabilityReport.get();
        let isPerformanceReport = Template.instance().isPerformanceReport.get();
        let isBalanceSheetReport = Template.instance().isBalanceSheetReport.get();
        let isIncomeReport = Template.instance().isIncomeReport.get();
        let isPositionReport = Template.instance().isPositionReport.get();
        let isBuildProfitability = Template.instance().isBuildProfitability.get();
        let isProductionWorkSheet = Template.instance().isProductionWorkSheet.get();
        let isWorkOrder = Template.instance().isWorkOrder.get();

        let isShowFavorite = false;

        if (isBalanceSheet || isProfitLoss || isAgedReceivables || isProductSalesReport || isSalesReport || isSalesSummaryReport || isGeneralLedger || isTaxSummaryReport || isTrialBalance || isExecutiveSummary || isCashReport || isProfitabilityReport || isPerformanceReport || isBalanceSheetReport || isIncomeReport || isPositionReport || is1099Transaction || isAccountsLists || isAgedPayables || isPurchaseReport || isPurchaseSummaryReport || isPrintStatement || isAgedReceivablesSummary || isAgedPayablesSummary || isJournalEntryList || isStockAdjustmentList || isChequeList || isTimeSheetDetails || isInvoicesPaid || isInvoicesUnpaid || isQuotesConverted || isQuotesUnconverted || isBackOrderedInvoices || isPaymentMethodsList || isSalesOrderConverted || isSalesOrderUnconverted || isBackOrderedPO || isUnpaidPO || isUnpaidBills || isTransactionJournal || isSerialNumberReport || isPayrollLeaveAccrued || isPayrollLeaveTaken || isForeignExchangeHistoryList || isForeignExchangeList || isBinLocations || isTimeSheetSummary || isPayrollHistoryReport || isStockValue || isStockMovementReport || isStockQuantity || isLotReport || isCustomerDetails || isCustomerSummary || isSupplierDetails || isSupplierProduct || isJobProfitReport || isPLMonthly || isPLQuarterly || isPLYearly || isPLYTD || isJobSalesSummary || isBuildProfitability || isProductionWorkSheet || isWorkOrder) {
            isShowFavorite = true;
        }
        return isShowFavorite;
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },
    accountantList: () => {
        return Template.instance().accountantList.get().sort(function(a, b) {
            if (a.headDept == 'NA') {
                return 1;
            } else if (b.headDept == 'NA') {
                return -1;
            }
            return (a.headDept.toUpperCase() > b.headDept.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
