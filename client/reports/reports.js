import {ReactiveVar} from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import "./allreports.html"
import { TaxRateService } from "../settings/settings-service";

Template.reports.onCreated(function(){
    let templateObject = Template.instance();
    templateObject.favoritereports = new ReactiveVar([]);
    templateObject.accountantreports = new ReactiveVar();
    templateObject.accountingreports = new ReactiveVar();
    templateObject.contactreports = new ReactiveVar();
    templateObject.executivereports = new ReactiveVar();
    templateObject.generalreports = new ReactiveVar();
    templateObject.inventoryreports = new ReactiveVar();
    templateObject.manufacturingreports = new ReactiveVar();
    templateObject.paymentsreports = new ReactiveVar();
    templateObject.payrollreports = new ReactiveVar();
    templateObject.purchasereports = new ReactiveVar();
    templateObject.salesreports = new ReactiveVar();
    templateObject.transactionreports = new ReactiveVar();

    templateObject.allReports = new ReactiveVar();

    let allReports = [];

    let accountantreports = {label: 'Accountant', reports: [
        {label: 'Company', route: '/accountant_company'},
        {label: 'Company as Trustee', route: '/accountant_companyastrustee'},
        {label: 'Financial Statement', route: '/accountant_financialstatement'},
        {label: 'Individual', route: '/accountant_individual'},
        {label: 'Partnership Non Trading', route: '/accountant_partnershipnontrading'},
        {label: 'Trust Non Trading', route: '/accountant_trustnontrading'}
    ]}

    if (localStorage.getItem('vs1companyBankAccountName') === localStorage.getItem('VS1Accountant')) {
        allReports.push(accountantreports)
    }

    let accountreports = {label: 'Accounting', reports:[
        {label: 'Accounts List', route: '/accountsoverview'},
        {label: 'Balance Sheet', route: '/balancesheetreport'},
        {label: 'General Ledger', route: '/generalledger'},
        {label: 'Journal Entry List', route: '/journalentrylist'},
        {label: 'Profit and Loss', route: '/newprofitandloss'},
        {label: 'Profit and Loss - Monthly', route: '/newprofitandloss?daterange=monthly'},
        {label: 'Profit and Loss - Quarterly', route: '/newprofitandloss?daterange=quarterly'},
        {label: 'Profit and Loss - Yearly', route: '/newprofitandloss?daterange=yearly'},
        {label: 'Profit and Loss - YTD', route: '/newprofitandloss?daterange=ytd'},
        {label: 'Tax Summary Report', route: '/taxsummaryreport'},
        {label: 'Trial Balance', route: '/trialbalance'},
    ]}
    // templateObject.accountingreports.set(accountreports);
    allReports.push(accountreports)
    let contactreports = { label: "Contacts", reports:[
        {label: 'Customer Details Report', route: '/customerdetailsreport'},
        {label: 'Customer Summary Report', route: '/customersummaryreport'},
        {label: 'Supplier List', route: '/supplierlist'},
        {label: 'Supplier Detail Report', route: '/supplierdetail'},
        {label: 'Supplier Summary Report', route: '/suppliersummary'},
        {label: 'Supplier Product Report', route: '/supplierproductreport'},
    ]}
    // templateObject.contactreports.set(contactreports)
    allReports.push(contactreports);

    let executivereports = {label: 'Executive', reports:[
        {label: 'Executive Summary Report', route: '/executivesummaryreport'},
        {label: 'Balance Sheet Report', route: '/exebalancesheetreport'},
        {label: 'Cash Report', route: '/execashreport'},
        {label: 'Income Report', route: '/exeincomereport'},
        {label: 'Performance Report', route: '/exeperformancereport'},
        {label: 'Position Report', route: '/exepositionreport'},
        {label: 'Profitability Report', route: '/exeprofitabilityreport'}
    ]}

    allReports.push(executivereports);

    let generalreports = {label: 'General', reports: [
        {label: 'Banking Report', route: '/bankingoverview'},
        {label: 'Foreign Exchange History List', route: '/fxhistorylist'},
        {label: 'Foreign Exchange List', route: '/currenciessettings'},
        {label: 'Job Sales Summary', route: '/jobsalessummary'},
        {label: 'Job Profitability Report', route: '/jobprofitabilityreport'}
    ]}

    allReports.push(generalreports)

    let inventoryreports = {label: 'Inventory', reports: [
        {label: 'Bin Locations List', route: '/binlocationlist'},
        {label: 'Lot Number Report', route: '/lotnumberlist'},
        {label: 'Serial Number Report', route: '/serialnumberlist'},
        {label: 'Stock Adjustment List', route: '/stockadjustmentoverview'},
        {label: 'Stock Movement Report', route: '/stockmovementreport'},
        {label: 'stock Quantity by Location', route: '/stockquantitybylocation'},
        {label: 'Stock Value Report', route: '/stockvaluereport'},
    ]}

    allReports.push(inventoryreports);

    let mfgreports = {label: 'Manufacturing', reports: [
        {label: 'Build Profitability', route: '/buildcostreport'},
        {label: 'Production Workseet', route: '/worksheetreport'},
        {label: 'Work Orders', route: '/workorderlist'}
    ]}

    allReports.push(mfgreports)

    let paymentReports ={label: 'Payments', reports: [
        {label: 'Aged Payables', route: '/agedpayables'},
        {label: 'Aged Payables Summary', route: '/agedpayablessummary'},
        {label: 'Aged Receivables', route: '/agedreceivables'},
        {label: 'Aged Receivables Summary', route: '/agedreceivablessummary'},
        {label: 'Cheque List', route: '/chequelist'},
        {label: 'Payment Methods List', route: '/paymentmethodSettings'},
        {label: 'Print Statements', route: '/statementlist'}
    ]}

    allReports.push(paymentReports);

    let payrollreports = {label: 'Payroll', reports: [
        {label: 'Payroll History Report', route: '/payrollhistoryreport'},
        {label: 'Payroll Leave Accrued', route: '/leaveaccruedreport'},
        {label: 'Payroll Leave Taken', route: '/payrollleavetaken'},
        {label: 'Time Sheet', route: '/timesheet'},
        {label: 'Time Sheet Summary', route: '/timesheetsummary'}
    ]}

    allReports.push(payrollreports)

    let purchasereports = {label: 'Purchases', reports:[
        {label: '1099 Contractor Report', route: '/1099report'},
        {label: 'Aged Payables', route: '/agedpayables'},
        {label: 'Aged Payables Summary', route: '/agedpayablessummary'},
        {label: 'Supplier Report', route: '/supplierreport'},
        {label: 'Supplier Summary Report', route: '/suppliersummary'},
    ]}
    allReports.push(purchasereports)

    let salesreports = {label: 'Sales', reports: [
        {label: 'Aged Receivables', route: '/agedreceivables'},
        {label: 'Aged Receivables Summary', route: '/agedreceivablessummary'},
        {label: 'Product Sales Report', route: '/productsalesreport'},
        {label: 'Sales Orders - Converted', route: '/salesorderslist?converted=true'},
        {label: 'Sales Orders - Unconverted', route: '/salesorderslist?converted=false'},
        {label: 'Sales Report', route: '/salesreport'},
        {label: 'Sales Summary Report', route: '/salessummaryreport'},
    ]}
    allReports.push(salesreports)

    let transactionreports = {label: 'Transactions', reports: [
        {label: 'All Outstanding Expenses', route: '/supplierwaitingpurchaseorder?type=bill'},
        {label: 'Invoices - Back Ordered', route: '/invoicelistBO'},
        {label: 'Customer Payments', route: '/customerpayment'},
        {label: 'All Outstanding Invoices', route: '/customerwaitingpayments'},
        {label: 'Purchase Orders - Back Orders', route: '/purchaseorderlistBO'},
        {label: 'All Outstading Expenses', route: '/supplierwaitingpurchaseorder?type=po'},
        {label: 'Quotes - Converted', route: '/quoteslist?converted=true'},
        {label: 'Quotes - Unconverted', route: '/quotelist?converted=false'},
        {label: 'Transaction Journal', route: '/transactionjournallist'}
    ]}

    allReports.push(transactionreports);

    templateObject.allReports.set(allReports)

})

Template.reports.onRendered(function(){
    let templateObject = Template.instance();
    templateObject.getFavoriteReports = function() {
        return new Promise((resolve, reject) => {
            getVS1Data('TFavoriteReport').then(function(dataObject){
                if(dataObject.length > 0) {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tfavoritereport;
                    templateObject.favoritereports.set(useData)
                    resolve()
                } else {
                    templateObject.favoritereports.set([])
                    resolve()
                }
            }).catch(function(err) {
                templateObject.favoritereports.set([])
                resolve()
            })
        })
    }

})

Template.reports.helpers( {
   reports: ()=>{
    console.log("$$$$$$$$$$$", Template.instance().allReports.get())
    return Template.instance().allReports.get()
   },

   isFavorite: async (label) => {
    let templateObject = Template.instance();
    let favoriteReports = templateObject.favoritereports.get();
    let index = favoriteReports.findIndex(report => {
        return report.label == label
    })

    if(index > -1) {
        return true
    } else {
        return false
    }
    
   },

   tolowercase: (text) => {
    let lowercaseText = text.tolowercase().replace(/[^a-z]/gi, '');
    return lowercaseText;
   },

   noFavorite: ()=> {
    let templateObject = Template.instance();
    let favoritereports = templateObject.favoritereports.get();
    if(favoritereports.length > 0) {
        return false
    } else {
        return true
    }
   }
})

Template.reports.events({
    'change .favCheckBox': function(event) {
        let templateObject = Template.instance();
        let dataLabel = $(event.target).attr('data-label');
        let allreports = templateObject.allReports.get();
        for(let i = 0; i< allreports.length; i++) {
            let group = allreports[i];
            let index = group.findIndex(report=>{
                return report.label == dataLabel
            })
            if(index > -1) {
                let report = group[index];
                getVS1Data('TFavoriteReport').then(dataObject => {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tfavoritereport;
                    if($(event.target).checked) {
                        useData = [...useData, report]
                    } else {
                        let exIndex = useData.findIndex(item=> {
                            return item.label == dataLabel
                        });
                        if(exIndex > -1) {
                            useData = useData.splice(exIndex, 1);
                        }
                    }
                    let newObj = {tfavoritereport: useData}
                    addVS1Data('TFavoriteReport', JSON.sringify(newObj)).then(function() { templateObject.getFavoriteReports()})
                })
            }
        }

    }
})