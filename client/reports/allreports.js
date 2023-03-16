import {ReactiveVar} from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import "./reports.html"
import { TaxRateService } from "../settings/settings-service"; 

Template.allreports.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.isBalanceSheet = new ReactiveVar(false);
    templateObject.isProfitLoss = new ReactiveVar(false);
    templateObject.isPLMonthly = new ReactiveVar(false);
    templateObject.isPLQuarterly = new ReactiveVar(false);
    templateObject.isPLYearly = new ReactiveVar(false);
    templateObject.isPLYTD = new ReactiveVar(false);
    templateObject.isJobSalesSummary = new ReactiveVar(false);
    templateObject.isAgedReceivables = new ReactiveVar(false);
    templateObject.isAgedReceivablesSummary = new ReactiveVar(false);
    templateObject.isProductSalesReport = new ReactiveVar(false);
    templateObject.isSalesReport = new ReactiveVar(false);
    templateObject.isJobProfitReport = new ReactiveVar(false);
    templateObject.isSupplierDetails = new ReactiveVar(false);
    templateObject.isSupplierProduct = new ReactiveVar(false);
    templateObject.isCustomerDetails = new ReactiveVar(false);
    templateObject.isCustomerSummary = new ReactiveVar(false);
    templateObject.isLotReport = new ReactiveVar(false);
    templateObject.isStockValue = new ReactiveVar(false);
    templateObject.isStockQuantity = new ReactiveVar(false);
    templateObject.isStockMovementReport = new ReactiveVar(false);
    templateObject.isPayrollHistoryReport = new ReactiveVar(false);
    templateObject.isForeignExchangeHistoryList = new ReactiveVar(false);
    templateObject.isForeignExchangeList = new ReactiveVar(false);
    templateObject.isSalesSummaryReport = new ReactiveVar(false);
    templateObject.isGeneralLedger = new ReactiveVar(false);
    templateObject.isTaxSummaryReport = new ReactiveVar(false);
    templateObject.isTrialBalance = new ReactiveVar(false);
    templateObject.isTimeSheetSummary = new ReactiveVar(false);
    templateObject.isPayrollLeaveAccrued = new ReactiveVar(false);
    templateObject.isPayrollLeaveTaken = new ReactiveVar(false);
    templateObject.isSerialNumberReport = new ReactiveVar(false);
    templateObject.is1099Transaction = new ReactiveVar(false);
    templateObject.isAccountsLists = new ReactiveVar(false);
    templateObject.isBinLocations = new ReactiveVar(false);
    templateObject.isTransactionJournal = new ReactiveVar(false);
    templateObject.isUnpaidBills = new ReactiveVar(false);
    templateObject.isUnpaidPO = new ReactiveVar(false);
    templateObject.isBackOrderedPO = new ReactiveVar(false);
    templateObject.isSalesOrderConverted = new ReactiveVar(false);
    templateObject.isSalesOrderUnconverted = new ReactiveVar(false);
    templateObject.isPaymentMethodsList = new ReactiveVar(false);
    templateObject.isBackOrderedInvoices = new ReactiveVar(false);
    templateObject.isQuotesConverted = new ReactiveVar(false);
    templateObject.isQuotesUnconverted = new ReactiveVar(false);
    templateObject.isInvoicesPaid = new ReactiveVar(false);
    templateObject.isInvoicesUnpaid = new ReactiveVar(false);
    templateObject.isTimeSheetDetails = new ReactiveVar(false);
    templateObject.isChequeList = new ReactiveVar(false);
    templateObject.isJournalEntryList = new ReactiveVar(false);
    templateObject.isStockAdjustmentList = new ReactiveVar(false);
    templateObject.isAgedPayables = new ReactiveVar(false);
    templateObject.isAgedPayablesSummary = new ReactiveVar(false);
    templateObject.isPurchaseReport = new ReactiveVar(false);
    templateObject.isPurchaseSummaryReport = new ReactiveVar(false);
    templateObject.isPrintStatement = new ReactiveVar(false);
    templateObject.isExecutiveSummary = new ReactiveVar(false);
    templateObject.isCashReport = new ReactiveVar(false);
    templateObject.isProfitabilityReport = new ReactiveVar(false);
    templateObject.isPerformanceReport = new ReactiveVar(false);
    templateObject.isBalanceSheetReport = new ReactiveVar(false);
    templateObject.isIncomeReport = new ReactiveVar(false);
    templateObject.isPositionReport = new ReactiveVar(false);
    templateObject.accountantList = new ReactiveVar([]);
    templateObject.isBuildProfitability = new ReactiveVar(false);
    templateObject.isProductionWorkSheet = new ReactiveVar(false);
    templateObject.isWorkOrder = new ReactiveVar(false);
    // For Accountants
    templateObject.isCompanyAccountant = new ReactiveVar(false);
    templateObject.isTrustee = new ReactiveVar(false);
    templateObject.isFinancialStatement = new ReactiveVar(false);
    templateObject.isIndividual = new ReactiveVar(false);
    templateObject.isPartnershipNonTrading = new ReactiveVar(false);
    templateObject.isTrustNonTrading = new ReactiveVar(false);
    templateObject.isSelfManagedSuperfund = new ReactiveVar(false);
    templateObject.isSingleDirector = new ReactiveVar(false);
    templateObject.isSoleTraderNonTrading = new ReactiveVar(false);
    templateObject.isTrust = new ReactiveVar(false);

    templateObject.isSupplierList = new ReactiveVar(false);
    templateObject.isSupplierSummaryReport = new ReactiveVar(false);
});
Template.allreports.onRendered(() => {
    let templateObject = Template.instance();

    let isBalanceSheet;
    getVS1Data("BalanceSheetReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isBalanceSheet = false;
        } else {
            isBalanceSheet = dataObject[0].data === "true";
            templateObject.isBalanceSheet.set(isBalanceSheet);
        }
    });

    let isProfitLoss;
    getVS1Data("ProfitLossReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isProfitLoss = false;
        } else {
            isProfitLoss = dataObject[0].data === 'true';
            templateObject.isProfitLoss.set(isProfitLoss);
        }
    });
    let isPLMonthly;
    getVS1Data("PLMonthlyReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPLMonthly = false;
        } else {
            isPLMonthly = dataObject[0].data === 'true';
            templateObject.isPLMonthly.set(isPLMonthly);
        }
    });
    let isPLQuarterly;
    getVS1Data("PLQuarterlyReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPLQuarterly = false;
        } else {
            isPLQuarterly = dataObject[0].data === 'true';
            templateObject.isPLQuarterly.set(isPLQuarterly);
        }
    });
    let isPLYearly;
    getVS1Data("PLYearlyReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPLYearly = false;
        } else {
            isPLYearly = dataObject[0].data === 'true';
            templateObject.isPLYearly.set(isPLYearly);
        }
    });
    let isPLYTD;
    getVS1Data("PLYTDReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPLYTD = false;
        } else {
            isPLYTD = dataObject[0].data === 'true';
            templateObject.isPLYTD.set(isPLYTD);
        }
    });
    let isJobSalesSummary;
    getVS1Data("JobSalesSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isJobSalesSummary = false;
        } else {
            isJobSalesSummary = dataObject[0].data === 'true';
            templateObject.isJobSalesSummary.set(isJobSalesSummary);
        }
    });
    let isAgedReceivables;
    getVS1Data("AgedReceivablesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isAgedReceivables = false;
        } else {
            isAgedReceivables = dataObject[0].data === 'true';
            templateObject.isAgedReceivables.set(isAgedReceivables);
        }
    });
    let isAgedReceivablesSummary;
    getVS1Data("AgedReceivablesSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isAgedReceivablesSummary = false;
        } else {
            isAgedReceivablesSummary = dataObject[0].data === 'true';
            templateObject.isAgedReceivablesSummary.set(isAgedReceivablesSummary);
        }
    });
    let isProductSalesReport;
    getVS1Data("ProductSalesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isProductSalesReport = false;
        } else {
            isProductSalesReport = dataObject[0].data === 'true';
            templateObject.isProductSalesReport.set(isProductSalesReport);
        }
    });
    let isSalesReport;
    getVS1Data("SalesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isSalesReport = false;
        } else {
            isSalesReport = dataObject[0].data === 'true';
            templateObject.isSalesReport.set(isSalesReport);
        }
    });
    let isJobProfitReport;
    getVS1Data("JobProfitReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isJobProfitReport = false;
        } else {
            isJobProfitReport = dataObject[0].data === 'true';
            templateObject.isJobProfitReport.set(isJobProfitReport);
        }
    });
    let isSupplierDetails;
    getVS1Data("SupplierDetailsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isSupplierDetails = false;
        } else {
            isSupplierDetails = dataObject[0].data === 'true';
            templateObject.isSupplierDetails.set(isSupplierDetails);
        }
    });
    let isSupplierProduct;
    getVS1Data("SupplierProductReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isSupplierProduct = false;
        } else {
            isSupplierProduct = dataObject[0].data === 'true';
            templateObject.isSupplierProduct.set(isSupplierProduct);
        }
    });
    let isCustomerDetails;
    getVS1Data("CustomerDetailsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isCustomerDetails = false;
        } else {
            isCustomerDetails = dataObject[0].data === 'true';
            templateObject.isCustomerDetails.set(isCustomerDetails);
        }
    });
    let isCustomerSummary;
    getVS1Data("CustomerSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isCustomerSummary = false;
        } else {
            isCustomerSummary = dataObject[0].data === 'true';
            templateObject.isCustomerSummary.set(isCustomerSummary);
        }
    });
    let isLotReport;
    getVS1Data("LotReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isLotReport = false;
        } else {
            isLotReport = dataObject[0].data === 'true';
            templateObject.isLotReport.set(isLotReport);
        }
    });
    let isStockValue;
    getVS1Data("StockValueReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isStockValue = false;
        } else {
            isStockValue = dataObject[0].data === 'true';
            templateObject.isStockValue.set(isStockValue);
        }
    });
    let isStockQuantity;
    getVS1Data("StockQuantityReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isStockQuantity = false;
        } else {
            isStockQuantity = dataObject[0].data === 'true';
            templateObject.isStockQuantity.set(isStockQuantity);
        }
    });
    let isStockMovementReport;
    getVS1Data("StockMovementReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isStockMovementReport = false;
        } else {
            isStockMovementReport = dataObject[0].data === 'true';
            templateObject.isStockMovementReport.set(isStockMovementReport);
        }
    });
    let isPayrollHistoryReport;
    getVS1Data("PayrollHistoryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPayrollHistoryReport = false;
        } else {
            isPayrollHistoryReport = dataObject[0].data === 'true';
            templateObject.isPayrollHistoryReport.set(isPayrollHistoryReport);
        }
    });
    let isForeignExchangeHistoryList;
    getVS1Data("ForeignExchangeHistoryListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isForeignExchangeHistoryList = false;
        } else {
            isForeignExchangeHistoryList = dataObject[0].data === 'true';
            templateObject.isForeignExchangeHistoryList.set(isForeignExchangeHistoryList);
        }
    });
    let isForeignExchangeList;
    getVS1Data("ForeignExchangeListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isForeignExchangeList = false;
        } else {
            isForeignExchangeList = dataObject[0].data === 'true';
            templateObject.isForeignExchangeList.set(isForeignExchangeList);
        }
    });
    let isSalesSummaryReport;
    getVS1Data("SalesSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isSalesSummaryReport = false;
        } else {
            isSalesSummaryReport = dataObject[0].data === 'true';
            templateObject.isSalesSummaryReport.set(isSalesSummaryReport);
        }
    });
    let isGeneralLedger;
    getVS1Data("GeneralLedgerReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isGeneralLedger = false;
        } else {
            isGeneralLedger = dataObject[0].data === 'true';
            templateObject.isGeneralLedger.set(isGeneralLedger);
        }
    });
    let isTaxSummaryReport;
    getVS1Data("TaxSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isTaxSummaryReport = false;
        } else {
            isTaxSummaryReport = dataObject[0].data === 'true';
            templateObject.isTaxSummaryReport.set(isTaxSummaryReport);
        }
    });
    let isTrialBalance;
    getVS1Data("TrialBalanceReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isTrialBalance = false;
        } else {
            isTrialBalance = dataObject[0].data === 'true';
            templateObject.isTrialBalance.set(isTrialBalance);
        }
    });
    let isTimeSheetSummary;
    getVS1Data("TimeSheetSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isTimeSheetSummary = false;
        } else {
            isTimeSheetSummary = dataObject[0].data === 'true'
            templateObject.isTimeSheetSummary.set(isTimeSheetSummary);
        }
    });
    let isPayrollLeaveAccrued;
    getVS1Data("PayrollLeaveAccruedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPayrollLeaveAccrued = false;
        } else {
            isPayrollLeaveAccrued = dataObject[0].data === 'true';
            templateObject.isPayrollLeaveAccrued.set(isPayrollLeaveAccrued);
        }
    });
    let isPayrollLeaveTaken;
    getVS1Data("PayrollLeaveTakenReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPayrollLeaveTaken = false;
        } else {
            isPayrollLeaveTaken = dataObject[0].data === 'true';
            templateObject.isPayrollLeaveTaken.set(isPayrollLeaveTaken);
        }
    });
    let isSerialNumberReport;
    getVS1Data("SerialNumberReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isSerialNumberReport = false;
        } else {
            isSerialNumberReport = dataObject[0].data === 'true'
            templateObject.isSerialNumberReport.set(isSerialNumberReport);
        }
    });
    let is1099Transaction;
    getVS1Data("1099TransactionReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            is1099Transaction = false;
        } else {
            is1099Transaction = dataObject[0].data === 'true';
            templateObject.is1099Transaction.set(is1099Transaction);
        }
    });
    let isAccountsLists;
    getVS1Data("AccountsListsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isAccountsLists = false;
        } else {
            isAccountsLists = dataObject[0].data === 'true';
            templateObject.isAccountsLists.set(isAccountsLists);
        }
    });
    let isBinLocations;
    getVS1Data("BinLocationsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isBinLocations = false;
        } else {
            isBinLocations = dataObject[0].data === 'true';
            templateObject.isBinLocations.set(isBinLocations);
        }
    });
    let isTransactionJournal;
    getVS1Data("TransactionJournalReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isTransactionJournal = false;
        } else {
            isTransactionJournal = dataObject[0].data === 'true';
            templateObject.isTransactionJournal.set(isTransactionJournal);
        }
    });
    let isUnpaidBills;
    getVS1Data("UnpaidBillsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isUnpaidBills = false;
        } else {
            isUnpaidBills = dataObject[0].data === 'true';
            templateObject.isUnpaidBills.set(isUnpaidBills);
        }
    });
    let isUnpaidPO;
    getVS1Data("UnpaidPOReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isUnpaidPO = false;
        } else {
            isUnpaidPO = dataObject[0].data === 'true';
            templateObject.isUnpaidPO.set(isUnpaidPO);
        }
    });
    let isBackOrderedPO;
    getVS1Data("BackOrderedPOReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isBackOrderedPO = false;
        } else {
            isBackOrderedPO = dataObject[0].data === 'true';
            templateObject.isBackOrderedPO.set(isBackOrderedPO);
        }
    });
    let isSalesOrderConverted;
    getVS1Data("SalesOrderConvertedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isSalesOrderConverted = false;
        } else {
            isSalesOrderConverted = dataObject[0].data === 'true';
            templateObject.isSalesOrderConverted.set(isSalesOrderConverted);
        }
    });
    let isSalesOrderUnconverted;
    getVS1Data("SalesOrderUnconvertedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isSalesOrderUnconverted = false;
        } else {
            isSalesOrderUnconverted = dataObject[0].data === 'true';
            templateObject.isSalesOrderUnconverted.set(isSalesOrderUnconverted);
        }
    });
    let isPaymentMethodsList;
    getVS1Data("PaymentMethodsListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPaymentMethodsList = false;
        } else {
            isPaymentMethodsList = dataObject[0].data === 'true';
            templateObject.isPaymentMethodsList.set(isPaymentMethodsList);
        }
    });
    let isBackOrderedInvoices;
    getVS1Data("BackOrderedInvoicesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isBackOrderedInvoices = false;
        } else {
            isBackOrderedInvoices = dataObject[0].data === 'true';
            templateObject.isBackOrderedInvoices.set(isBackOrderedInvoices);
        }
    });
    let isQuotesConverted;
    getVS1Data("QuotesConvertedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isQuotesConverted = false;
        } else {
            isQuotesConverted = dataObject[0].data === 'true';
            templateObject.isQuotesConverted.set(isQuotesConverted);
        }
    });
    let isQuotesUnconverted;
    getVS1Data("QuotesUnconvertedReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isQuotesUnconverted = false;
        } else {
            isQuotesUnconverted = dataObject[0].data === 'true';
            templateObject.isQuotesUnconverted.set(isQuotesUnconverted);
        }
    });
    let isInvoicesPaid;
    getVS1Data("InvoicesPaidReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isInvoicesPaid = false;
        } else {
            isInvoicesPaid = dataObject[0].data === 'true';
            templateObject.isInvoicesPaid.set(isInvoicesPaid);
        }
    });
    let isInvoicesUnpaid;
    getVS1Data("InvoicesUnpaidReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isInvoicesUnpaid = false;
        } else {
            isInvoicesUnpaid = dataObject[0].data === 'true';
            templateObject.isInvoicesUnpaid.set(isInvoicesUnpaid);
        }
    });
    let isTimeSheetDetails;
    getVS1Data("TimeSheetDetailsReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isTimeSheetDetails = false;
        } else {
            isTimeSheetDetails = dataObject[0].data === 'true';
            templateObject.isTimeSheetDetails.set(isTimeSheetDetails);
        }
    });
    let isChequeList;
    getVS1Data("ChequeListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isChequeList = false;
        } else {
            isChequeList = dataObject[0].data === 'true';
            templateObject.isChequeList.set(isChequeList);
        }
    });
    let isStockAdjustmentList;
    getVS1Data("StockAdjustmentListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isStockAdjustmentList = false;
        } else {
            isStockAdjustmentList = dataObject[0].data === 'true';
            templateObject.isStockAdjustmentList.set(isStockAdjustmentList);
        }
    });
    let isJournalEntryList;
    getVS1Data("JournalEntryListReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isJournalEntryList = false;
        } else {
            isJournalEntryList = dataObject[0].data === 'true';
            templateObject.isJournalEntryList.set(isJournalEntryList);
        }
    });
    let isAgedPayables;
    getVS1Data("AgedPayablesReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isAgedPayables = false;
        } else {
            isAgedPayables = dataObject[0].data === 'true';
            templateObject.isAgedPayables.set(isAgedPayables);
        }
    });
    let isAgedPayablesSummary;
    getVS1Data("AgedPayablesSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isAgedPayablesSummary = false;
        } else {
            isAgedPayablesSummary = dataObject[0].data === 'true';
            templateObject.isAgedPayablesSummary.set(isAgedPayablesSummary);
        }
    });
    let isPurchaseReport;
    getVS1Data("PurchaseReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPurchaseReport = false;
        } else {
            isPurchaseReport = dataObject[0].data === 'true';
            templateObject.isPurchaseReport.set(isPurchaseReport);
        }
    });
    let isPurchaseSummaryReport;
    getVS1Data("PurchaseSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPurchaseSummaryReport = false;
        } else {
            isPurchaseSummaryReport = dataObject[0].data === 'true';
            templateObject.isPurchaseSummaryReport.set(isPurchaseSummaryReport);
        }
    });
    let isPrintStatement;
    getVS1Data("PrintStatementReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPrintStatement = false;
        } else {
            isPrintStatement = dataObject[0].data === 'true';
            templateObject.isPrintStatement.set(isPrintStatement);
        }
    });
    let isExecutiveSummary;
    getVS1Data("ExecutiveSummaryReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isExecutiveSummary = false;
        } else {
            isExecutiveSummary = dataObject[0].data === 'true';
            templateObject.isExecutiveSummary.set(isExecutiveSummary);
        }
    });
    let isCashReport;
    getVS1Data("CashReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isCashReport = false;
        } else {
            isCashReport = dataObject[0].data === 'true';
            templateObject.isCashReport.set(isCashReport);
        }
    });
    let isProfitabilityReport;
    getVS1Data("ProfitabilityReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isProfitabilityReport = false;
        } else {
            isProfitabilityReport = dataObject[0].data === "true";
            templateObject.isProfitabilityReport.set(isProfitabilityReport)
        }
    })
    let isPerformanceReport;
    getVS1Data("PerformanceReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPerformanceReport = false;
        } else {
            isPerformanceReport = dataObject[0].data === 'true';
            templateObject.isPerformanceReport.set(isPerformanceReport);
        }
    });
    let isBalanceSheetReport;
    getVS1Data("BalanceSheetReports").then(function (dataObject) {
        if (dataObject.length === 0) {
            isBalanceSheetReport = false;
        } else {
            isBalanceSheetReport = dataObject[0].data === 'true';
            templateObject.isBalanceSheetReport.set(isBalanceSheetReport);
        }
    });
    let isIncomeReport;
    getVS1Data("IncomeReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isIncomeReport = false;
        } else {
            isIncomeReport = dataObject[0].data === 'true';
            templateObject.isIncomeReport.set(isIncomeReport);
        }
    });
    let isPositionReport;
    getVS1Data("PositionReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isPositionReport = false;
        } else {
            isPositionReport = dataObject[0].data === 'true';
            templateObject.isPositionReport.set(isPositionReport);
        }
    });

    let isBuildProfitability;
    getVS1Data("BuildProfitabilityReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isBuildProfitability = false;
        } else {
            isBuildProfitability = dataObject[0].data === 'true';
            templateObject.isBuildProfitability.set(isBuildProfitability);
        }
    });

    let isProductionWorkSheet;
    getVS1Data("ProductionWorksheetReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isProductionWorkSheet = false;
        } else {
            isProductionWorkSheet = dataObject[0].data === 'true';
            templateObject.isProductionWorkSheet.set(isProductionWorkSheet);
        }
    });

    let isWorkOrder;
    getVS1Data("WorkOrderReport").then(function (dataObject) {
        if (dataObject.length === 0) {
            isWorkOrder = false;
        } else {
            isWorkOrder = dataObject[0].data === 'true';
            templateObject.isWorkOrder.set(isWorkOrder);
        }
    });

    getVS1Data("TFavReportCompany").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isCompanyAccountant.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavReportTrustee").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isTrustee.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavReportFinancialStatement").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isFinancialStatement.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavReportIndividual").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isIndividual.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavReportPartnershipNonTrading").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isPartnershipNonTrading.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavReportTrustNonTrading").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isTrustNonTrading.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavReportSelfManagedSuperfund").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isSelfManagedSuperfund.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavReportSingleDirector").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isSingleDirector.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavReportSoleTraderNonTrading").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isSoleTraderNonTrading.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavReportTrust").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isTrust.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavSupplierList").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isSupplierList.set(dataObject[0].data === 'true')
        }
    })

    getVS1Data("TFavSupplierSummaryReport").then(function (dataObject) {
        if(dataObject.length > 0) {
            templateObject.isSupplierSummaryReport.set(dataObject[0].data === 'true')
        }
    })

    const taxRateService = new TaxRateService();
    const accountantList = [];

    templateObject.getAccountantList = function() {
        getVS1Data('TReportsAccountantsCategory').then(function(dataObject) {
            let data = JSON.parse(dataObject[0].data);
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
            templateObject.accountantList.set(accountantList);
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
            addVS1Data('BalanceSheetReport',"true");
            templateObject.isBalanceSheet.set(true);
        } else {
            addVS1Data('BalanceSheetReport', 'false');
            templateObject.isBalanceSheet.set(false);
        }
    },
    'click .chkProfitLoss': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('ProfitLossReport', 'true');
            templateObject.isProfitLoss.set(true);
        } else {
            addVS1Data('ProfitLossReport', 'false');
            templateObject.isProfitLoss.set(false);
        }
    },
    'click .chkPLMonthly': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PLMonthlyReport', 'true');
            templateObject.isPLMonthly.set(true);
        } else {
            addVS1Data('PLMonthlyReport', 'false');
            templateObject.isPLMonthly.set(false);
        }
    },
    'click .chkPLQuarterly': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PLQuarterlyReport', 'true');
            templateObject.isPLQuarterly.set(true);
        } else {
            addVS1Data('PLQuarterlyReport','false');
            templateObject.isPLQuarterly.set(false);
        }
    },
    'click .chkPLYearly': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PLQuarterlyReport', 'true');
            templateObject.isPLYearly.set(true);
        } else {
            addVS1Data('PLQuarterlyReport', 'false');
            templateObject.isPLYearly.set(false);
        }
    },
    'click .chkPLYTD': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PLYTDReport', 'true');
            templateObject.isPLYTD.set(true);
        } else {
            addVS1Data('PLYTDReport', 'false');
            templateObject.isPLYTD.set(false);
        }
    },
    'click .chkJobSalesSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('JobSalesSummaryReport', 'true');
            templateObject.isJobSalesSummary.set(true);
        } else {
            addVS1Data('JobSalesSummaryReport', 'false');
            templateObject.isJobSalesSummary.set(false);
        }
    },
    'click .chkAgedReceivables': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('AgedReceivablesReport', 'true');
            templateObject.isAgedReceivables.set(true);
        } else {
            addVS1Data('AgedReceivablesReport', 'false');
            templateObject.isAgedReceivables.set(false);
        }
    },
    'click .chkAgedReceivablesSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('AgedReceivablesSummaryReport', 'true');
            templateObject.isAgedReceivablesSummary.set(true);
        } else {
            addVS1Data('AgedReceivablesSummaryReport', 'false');
            templateObject.isAgedReceivablesSummary.set(false);
        }
    },
    'click .chkProductSalesReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('ProductSalesReport', 'true');
            templateObject.isProductSalesReport.set(true);
        } else {
            addVS1Data('ProductSalesReport', 'false');
            templateObject.isProductSalesReport.set(false);
        }
    },
    'click .chkSalesReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('SalesReport', 'true');
            templateObject.isSalesReport.set(true);
        } else {
            addVS1Data('SalesReport', 'false');
            templateObject.isSalesReport.set(false);
        }
    },
    'click .chkJobProfitReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('JobProfitReport', 'true');
            templateObject.isJobProfitReport.set(true);
        } else {
            addVS1Data('JobProfitReport', 'false');
            templateObject.isJobProfitReport.set(false);
        }
    },
    'click #formCheck-SupplierDetails': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('SupplierDetailsReport', 'true');
            templateObject.isSupplierDetails.set(true);
        } else {
            addVS1Data('SupplierDetailsReport', 'false');
            templateObject.isSupplierDetails.set(false);
        }
    },
    'click #formCheck-SupplierList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavSupplierList', 'true');
            templateObject.isSupplierList.set(true);
        } else {
            addVS1Data('TFavSupplierList', 'false');
            templateObject.isSupplierList.set(false);
        }
    },
    'click #formCheck-SupplierSummaryReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavSupplierSummaryReport', 'true');
            templateObject.isSupplierSummaryReport.set(true);
        } else {
            addVS1Data('TFavSupplierSummaryReport', 'false');
            templateObject.isSupplierSummaryReport.set(false);
        }
    },
    'click .chkSupplierProduct': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('SupplierProductReport', 'true');
            templateObject.isSupplierProduct.set(true);
        } else {
            addVS1Data('SupplierProductReport', 'false');
            templateObject.isSupplierProduct.set(false);
        }
    },
    'click .chkCustomerDetails': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('CustomerDetailsReport', 'true');
            templateObject.isCustomerDetails.set(true);
        } else {
            addVS1Data('CustomerDetailsReport', 'false');
            templateObject.isCustomerDetails.set(false);
        }
    },
    'click .chkCustomerSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('CustomerSummaryReport', 'true');
            templateObject.isCustomerSummary.set(true);
        } else {
            addVS1Data('CustomerSummaryReport', 'false');
            templateObject.isCustomerSummary.set(false);
        }
    },
    'click .chkLotReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('LotReport', 'true');
            templateObject.isLotReport.set(true);
        } else {
            addVS1Data('LotReport', 'false');
            templateObject.isLotReport.set(false);
        }
    },
    'click .chkStockValue': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('StockValueReport', 'true');
            templateObject.isStockValue.set(true);
        } else {
            addVS1Data('StockValueReport', 'false');
            templateObject.isStockValue.set(false);
        }
    },
    'click .chkStockQuantity': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('StockQuantityReport', 'true');
            templateObject.isStockQuantity.set(true);
        } else {
            addVS1Data('StockQuantityReport', 'false');
            templateObject.isStockQuantity.set(false);
        }
    },
    'click .chkStockMovementReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('StockMovementReport', 'true');
            templateObject.isStockMovementReport.set(true);
        } else {
            addVS1Data('StockMovementReport', 'false');
            templateObject.isStockMovementReport.set(false);
        }
    },
    'click .chkPayrollHistoryReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PayrollHistoryReport', 'true');
            templateObject.isPayrollHistoryReport.set(true);
        } else {
            addVS1Data('PayrollHistoryReport', 'false');
            templateObject.isPayrollHistoryReport.set(false);
        }
    },
    'click .chkForeignExchangeHistoryList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('ForeignExchangeHistoryListReport', 'true');
            templateObject.isForeignExchangeHistoryList.set(true);
        } else {
            addVS1Data('ForeignExchangeHistoryListReport', 'false');
            templateObject.isForeignExchangeHistoryList.set(false);
        }
    },
    'click .chkForeignExchangeList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('ForeignExchangeListReport', 'true');
            templateObject.isForeignExchangeList.set(true);
        } else {
            addVS1Data('ForeignExchangeListReport', 'false');
            templateObject.isForeignExchangeList.set(false);
        }
    },
    'click .chkSalesSummaryReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('SalesSummaryReport', 'true');
            templateObject.isSalesSummaryReport.set(true);
        } else {
            addVS1Data('SalesSummaryReport', 'false');
            templateObject.isSalesSummaryReport.set(false);
        }
    },
    'click .chkGeneralLedger': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('GeneralLedgerReport', 'true');
            templateObject.isGeneralLedger.set(true);
        } else {
            addVS1Data('GeneralLedgerReport', 'false');
            templateObject.isGeneralLedger.set(false);
        }
    },
    'click .chkTaxSummaryReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TaxSummaryReport', 'true');
            templateObject.isTaxSummaryReport.set(true);
        } else {
            addVS1Data('TaxSummaryReport', 'false');
            templateObject.isTaxSummaryReport.set(false);
        }
    },
    'click .chkTrialBalance': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TrialBalanceReport', 'true');
            templateObject.isTrialBalance.set(true);
        } else {
            addVS1Data('TrialBalanceReport', 'false');
            templateObject.isTrialBalance.set(false);
        }
    },
    'click .chkTimeSheetSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TimeSheetSummaryReport', 'true');
            templateObject.isTimeSheetSummary.set(true);
        } else {
            addVS1Data('TimeSheetSummaryReport', 'false');
            templateObject.isTimeSheetSummary.set(false);
        }
    },
    'click .chkSerialNumberReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('SerialNumberReport', 'true');
            templateObject.isSerialNumberReport.set(true);
        } else {
            addVS1Data('SerialNumberReport', 'false');
            templateObject.isSerialNumberReport.set(false);
        }
    },
    'click .chk1099Transaction': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('1099TransactionReport', 'true');
            templateObject.is1099Transaction.set(true);
        } else {
            addVS1Data('1099TransactionReport', 'false');
            templateObject.is1099Transaction.set(false);
        }
    },
    'click .chkAccountsLists': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('AccountsListsReport', 'true');
            templateObject.isAccountsLists.set(true);
        } else {
            addVS1Data('AccountsListsReport', 'false');
            templateObject.isAccountsLists.set(false);
        }
    },
    'click .chkBinLocationsList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('BinLocationsListReport', 'true');
            templateObject.isBinLocations.set(true);
        } else {
            addVS1Data('BinLocationsListReport', 'false');
            templateObject.isBinLocations.set(false);
        }
    },
    'click .chkTransactionJournal': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TransactionJournalReport', 'true');
            templateObject.isTransactionJournal.set(true);
        } else {
            addVS1Data('TransactionJournalReport', 'false');
            templateObject.isTransactionJournal.set(false);
        }
    },
    'click .chkUnpaidBills': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('UnpaidBillsReport', 'true');
            templateObject.isUnpaidBills.set(true);
        } else {
            addVS1Data('UnpaidBillsReport', 'false');
            templateObject.isUnpaidBills.set(false);
        }
    },
    'click .chkUnpaidPO': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('UnpaidPOReport', 'true');
            templateObject.isUnpaidPO.set(true);
        } else {
            addVS1Data('UnpaidPOReport', 'false');
            templateObject.isUnpaidPO.set(false);
        }
    },
    'click .chkBackOrderedPO': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('BackOrderedPOReport', 'true');
            templateObject.isBackOrderedPO.set(true);
        } else {
            addVS1Data('BackOrderedPOReport', 'false');
            templateObject.isBackOrderedPO.set(false);
        }
    },
    'click .chkSalesOrderConverted': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('SalesOrderConvertedReport', 'true');
            templateObject.isSalesOrderConverted.set(true);
        } else {
            addVS1Data('SalesOrderConvertedReport', 'false');
            templateObject.isSalesOrderConverted.set(false);
        }
    },
    'click .chkSalesOrderUnconverted': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('SalesOrderUnconvertedReport', 'true');
            templateObject.isSalesOrderUnconverted.set(true);
        } else {
            addVS1Data('SalesOrderUnconvertedReport', 'false');
            templateObject.isSalesOrderUnconverted.set(false);
        }
    },
    'click .chkPaymentMethodsList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PaymentMethodsListReport', 'true');
            templateObject.isPaymentMethodsList.set(true);
        } else {
            addVS1Data('PaymentMethodsListReport', 'false');
            templateObject.isPaymentMethodsList.set(false);
        }
    },
    'click .chkBackOrderedInvoices': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('BackOrderedInvoicesReport', 'true');
            templateObject.isBackOrderedInvoices.set(true);
        } else {
            addVS1Data('BackOrderedInvoicesReport', 'false');
            templateObject.isBackOrderedInvoices.set(false);
        }
    },
    'click .chkQuotesConverted': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('QuotesConvertedReport', 'true');
            templateObject.isQuotesConverted.set(true);
        } else {
            addVS1Data('QuotesConvertedReport', 'false');
            templateObject.isQuotesConverted.set(false);
        }
    },
    'click .chkQuotesUnconverted': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('QuotesUnconvertedReport', 'true');
            templateObject.isQuotesUnconverted.set(true);
        } else {
            addVS1Data('QuotesUnconvertedReport', 'false');
            templateObject.isQuotesUnconverted.set(false);
        }
    },
    'click .chkInvoicesPaid': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('InvoicesPaidReport', 'true');
            templateObject.isInvoicesPaid.set(true);
        } else {
            addVS1Data('InvoicesPaidReport', 'false');
            templateObject.isInvoicesPaid.set(false);
        }
    },
    'click .chkInvoicesUnpaid': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('InvoicesUnpaidReport', 'true');
            templateObject.isInvoicesUnpaid.set(true);
        } else {
            addVS1Data('InvoicesUnpaidReport', 'false');
            templateObject.isInvoicesUnpaid.set(false);
        }
    },
    'click .chkTimeSheet': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TimeSheetReport', 'true');
            templateObject.isTimeSheetDetails.set(true);
        } else {
            addVS1Data('TimeSheetReport', 'false');
            templateObject.isTimeSheetDetails.set(false);
        }
    },
    'click .chkChequeList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('ChequeListReport', 'true');
            templateObject.isChequeList.set(true);
        } else {
            addVS1Data('ChequeListReport', 'false');
            templateObject.isChequeList.set(false);
        }
    },
    'click .chkPayrollLeaveAccrued': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PayrollLeaveAccruedReport', 'true');
            templateObject.isPayrollLeaveAccrued.set(true);
        } else {
            addVS1Data('PayrollLeaveAccruedReport', 'false');
            templateObject.isPayrollLeaveAccrued.set(false);
        }
    },
    'click .chkPayrollLeaveTaken': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PayrollLeaveTakenReport', 'true');
            templateObject.isPayrollLeaveTaken.set(true);
        } else {
            addVS1Data('PayrollLeaveTakenReport', 'false');
            templateObject.isPayrollLeaveTaken.set(false);
        }
    },
    'click .chkStockAdjustmentList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('StockAdjustmentListReport', 'true');
            templateObject.isStockAdjustmentList.set(true);
        } else {
            addVS1Data('StockAdjustmentListReport', 'false');
            templateObject.isStockAdjustmentList.set(false);
        }
    },
    'click .chkJournalEntryList': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('JournalEntryListReport', 'true');
            templateObject.isJournalEntryList.set(true);
        } else {
            addVS1Data('JournalEntryListReport', 'false');
            templateObject.isJournalEntryList.set(false);
        }
    },
    'click .chkAgedPayables': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('AgedPayablesReport', 'true');
            templateObject.isAgedPayables.set(true);
        } else {
            addVS1Data('AgedPayablesReport', 'false');
            templateObject.isAgedPayables.set(false);
        }
    },
    'click .chkAgedPayablesSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('AgedPayablesSummaryReport', 'true');
            templateObject.isAgedPayablesSummary.set(true);
        } else {
            addVS1Data('AgedPayablesSummaryReport', 'false');
            templateObject.isAgedPayablesSummary.set(false);
        }
    },
    'click .chkPurchaseReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PurchaseReportReport', 'true');
            templateObject.isPurchaseReport.set(true);
        } else {
            addVS1Data('PurchaseReportReport', 'false');
            templateObject.isPurchaseReport.set(false);
        }
    },
    'click .chkPurchaseSummaryReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PurchaseSummaryReportReport', 'true');
            templateObject.isPurchaseSummaryReport.set(true);
        } else {
            addVS1Data('PurchaseSummaryReportReport', 'false');
            templateObject.isPurchaseSummaryReport.set(false);
        }
    },
    'click .chkPrintStatement': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PrintStatementReport', 'true');
            templateObject.isPrintStatement.set(true);
        } else {
            addVS1Data('PrintStatementReport', 'false');
            templateObject.isPrintStatement.set(false);
        }
    },
    'click .chkExecutiveSummary': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('ExecutiveSummaryReport', 'true');
            templateObject.isExecutiveSummary.set(true);
        } else {
            addVS1Data('ExecutiveSummaryReport', 'false');
            templateObject.isExecutiveSummary.set(false);
        }
    },
    'click .chkCashReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('CashReport', 'true');
            templateObject.isCashReport.set(true);
        } else {
            addVS1Data('CashReport', 'false');
            templateObject.isCashReport.set(false);
        }
    },
    'click .chkProfitabilityReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('ProfitabilityReport', 'true');
            templateObject.isProfitabilityReport.set(true);
        } else {
            addVS1Data('ProfitabilityReport', 'false');
            templateObject.isProfitabilityReport.set(false);
        }
    },
    'click .chkPerformanceReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PerformanceReport', 'true');
            templateObject.isPerformanceReport.set(true);
        } else {
            addVS1Data('PerformanceReport', 'false');
            templateObject.isPerformanceReport.set(false);
        }
    },
    'click .chkBalanceSheetReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('BalanceSheetReports', 'true');
            templateObject.isBalanceSheetReport.set(true);
        } else {
            addVS1Data('BalanceSheetReports', 'false');
            templateObject.isBalanceSheetReport.set(false);
        }
    },
    'click .chkIncomeReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('IncomeReport', 'true');
            templateObject.isIncomeReport.set(true);
        } else {
            addVS1Data('IncomeReport', 'false');
            templateObject.isIncomeReport.set(false);
        }
    },
    'click .chkPositionReport': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('PositionReport', 'true');
            templateObject.isPositionReport.set(true);
        } else {
            addVS1Data('PositionReport', 'false');
            templateObject.isPositionReport.set(false);
        }
    },
    'click #formCheck-Company': function(event) {
        console.log(event)
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportCompany', 'true');
            templateObject.isCompanyAccountant.set(true);
        } else {
            addVS1Data('TFavReportCompany', 'false');
            templateObject.isCompanyAccountant.set(false);
        }
    },
    'click #formCheck-CompanyTrustee': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportTrustee', 'true');
            templateObject.isTrustee.set(true);
        } else {
            addVS1Data('TFavReportTrustee', 'false');
            templateObject.isTrustee.set(false);
        }
    },
    'click #formCheck-FinancialStatement': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportFinancialStatement', 'true');
            templateObject.isFinancialStatement.set(true);
        } else {
            addVS1Data('TFavReportFinancialStatement', 'false');
            templateObject.isFinancialStatement.set(false);
        }
    },
    'click #formCheck-Individual': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportIndividual', 'true');
            templateObject.isIndividual.set(true);
        } else {
            addVS1Data('TFavReportIndividual', 'false');
            templateObject.isIndividual.set(false);
        }
    },
    'click #formCheck-Partnership': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportPartnershipNonTrading', 'true');
            templateObject.isPartnershipNonTrading.set(true);
        } else {
            addVS1Data('TFavReportPartnershipNonTrading', 'false');
            templateObject.isPartnershipNonTrading.set(false);
        }
    },
    'click #formCheck-TrustNon': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportTrustNonTrading', 'true');
            templateObject.isTrustNonTrading.set(true);
        } else {
            addVS1Data('TFavReportTrustNonTrading', 'false');
            templateObject.isTrustNonTrading.set(false);
        }
    },
    'click #formCheck-Superfund': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportSelfManagedSuperfund', 'true');
            templateObject.isSelfManagedSuperfund.set(true);
        } else {
            addVS1Data('TFavReportSelfManagedSuperfund', 'false');
            templateObject.isSelfManagedSuperfund.set(false);
        }
    },
    'click #formCheck-SingleDirector': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportSingleDirector', 'true');
            templateObject.isSingleDirector.set(true);
        } else {
            addVS1Data('TFavReportSingleDirector', 'false');
            templateObject.isSingleDirector.set(false);
        }
    },
    'click #formCheck-SoleTrader': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportSoleTraderNonTrading', 'true');
            templateObject.isSoleTraderNonTrading.set(true);
        } else {
            addVS1Data('TFavReportSoleTraderNonTrading', 'false');
            templateObject.isSoleTraderNonTrading.set(false);
        }
    },
    'click #formCheck-Trust': function(event) {
        let templateObject = Template.instance();
        if ($(event.target).is(':checked')) {
            addVS1Data('TFavReportTrust', 'true');
            templateObject.isTrust.set(true);
        } else {
            addVS1Data('TFavReportTrust', 'false');
            templateObject.isTrust.set(false);
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
        return Template.instance().isWorkOrder.get();
    },

    isCompanyAccountant: function() {
        return Template.instance().isCompanyAccountant.get();
    },
    isTrustee : function () {
        return Template.instance().isTrustee.get();
    },
    isFinancialStatement : function () {
        return Template.instance().isFinancialStatement.get();
    },
    isIndividual : function () {
        return Template.instance().isIndividual.get();
    },
    isPartnershipNonTrading : function () {
        return Template.instance().isPartnershipNonTrading.get();
    },
    isTrustNonTrading : function () {
        return Template.instance().isTrustNonTrading.get();
    },
    isSelfManagedSuperfund : function () {
        return Template.instance().isSelfManagedSuperfund.get();
    },
    isSingleDirector : function () {
        return Template.instance().isSingleDirector.get();
    },
    isSoleTraderNonTrading : function () {
        return Template.instance().isSoleTraderNonTrading.get();
    },
    isTrust : function () {
        return Template.instance().isTrust.get();
    },
    isSupplierList: function () {
        return Template.instance().isSupplierList.get();
    },
    isSupplierSummaryReport: function () {
        return Template.instance().isSupplierSummaryReport.get();
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

        if (isBalanceSheet || 
            isProfitLoss || 
            isAgedReceivables || 
            isProductSalesReport || 
            isSalesReport || 
            isSalesSummaryReport || 
            isGeneralLedger || 
            isTaxSummaryReport || 
            isTrialBalance || 
            isExecutiveSummary || 
            isCashReport || 
            isProfitabilityReport || 
            isPerformanceReport || 
            isBalanceSheetReport || 
            isIncomeReport || 
            isPositionReport || 
            is1099Transaction || 
            isAccountsLists || 
            isAgedPayables || 
            isPurchaseReport || 
            isPurchaseSummaryReport || 
            isPrintStatement || 
            isAgedReceivablesSummary || 
            isAgedPayablesSummary || 
            isJournalEntryList || 
            isStockAdjustmentList || 
            isChequeList || 
            isTimeSheetDetails || 
            isInvoicesPaid || 
            isInvoicesUnpaid || 
            isQuotesConverted || 
            isQuotesUnconverted || 
            isBackOrderedInvoices || 
            isPaymentMethodsList || 
            isSalesOrderConverted || 
            isSalesOrderUnconverted || 
            isBackOrderedPO || 
            isUnpaidPO || 
            isUnpaidBills || 
            isTransactionJournal || 
            isSerialNumberReport || 
            isPayrollLeaveAccrued || 
            isPayrollLeaveTaken || 
            isForeignExchangeHistoryList || 
            isForeignExchangeList || 
            isBinLocations || 
            isTimeSheetSummary || 
            isPayrollHistoryReport || 
            isStockValue || 
            isStockMovementReport || 
            isStockQuantity || 
            isLotReport || 
            isCustomerDetails || 
            isCustomerSummary || 
            isSupplierDetails || 
            isSupplierProduct || 
            isJobProfitReport || 
            isPLMonthly || 
            isPLQuarterly || 
            isPLYearly || 
            isPLYTD || 
            isJobSalesSummary || 
            isBuildProfitability || 
            isProductionWorkSheet || 
            isWorkOrder ||
            Template.instance().isCompanyAccountant.get() || 
            Template.instance().isTrustee.get() || 
            Template.instance().isFinancialStatement.get() || 
            Template.instance().isIndividual.get() || 
            Template.instance().isPartnershipNonTrading.get() || 
            Template.instance().isTrustNonTrading.get() || 
            Template.instance().isSelfManagedSuperfund.get() || 
            Template.instance().isSingleDirector.get() || 
            Template.instance().isSoleTraderNonTrading.get() || 
            Template.instance().isTrust.get() || 
            Template.instance().isSupplierList.get() || 
            Template.instance().isSupplierSummaryReport.get()
            ) {
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
