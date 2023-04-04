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
        {id: 0, label: 'Company', route: '/accountant_company'},
        {id: 1, label: 'Company as Trustee', route: '/accountant_companyastrustee'},
        {id: 2, label: 'Financial Statement', route: '/accountant_financialstatement'},
        {id: 3, label: 'Individual', route: '/accountant_individual'},
        {id: 4, label: 'Partnership Non Trading', route: '/accountant_partnershipnontrading'},
        {id: 5, label: 'Trust Non Trading', route: '/accountant_trustnontrading'}
    ]}

    if (localStorage.getItem('vs1companyBankAccountName') === localStorage.getItem('VS1Accountant')) {
        allReports.push(accountantreports)
    }

    let accountreports = {label: 'Accounting', reports:[
        {id: 6, label: 'Accounts List', route: '/accountsoverview'},
        {id: 7, label: 'Balance Sheet', route: '/balancesheetreport'},
        {id: 8, label: 'General Ledger', route: '/generalledger'},
        {id: 9, label: 'Journal Entry List', route: '/journalentrylist'},
        {id: 10, label: 'Profit and Loss', route: '/newprofitandloss'},
        {id: 11, label: 'Profit and Loss - Monthly', route: '/newprofitandloss?daterange=monthly'},
        {id: 12, label: 'Profit and Loss - Quarterly', route: '/newprofitandloss?daterange=quarterly'},
        {id: 13, label: 'Profit and Loss - Yearly', route: '/newprofitandloss?daterange=yearly'},
        {id: 14, label: 'Profit and Loss - YTD', route: '/newprofitandloss?daterange=ytd'},
        {id: 15, label: 'Tax Summary Report', route: '/taxsummaryreport'},
        {id: 16, label: 'Trial Balance', route: '/trialbalance'},
    ]}
    // templateObject.accountingreports.set(accountreports);
    allReports.push(accountreports)
    let contactreports = { label: "Contacts", reports:[
        {id: 17, label: 'Customer Details Report', route: '/customerdetailsreport'},
        {id: 18, label: 'Customer Summary Report', route: '/customersummaryreport'},
        {id: 19, label: 'Supplier List', route: '/supplierlist'},
        {id: 20, label: 'Supplier Detail Report', route: '/supplierdetail'},
        {id: 21, label: 'Supplier Summary Report', route: '/suppliersummary'},
        {id: 22, label: 'Supplier Product Report', route: '/supplierproductreport'},
    ]}
    // templateObject.contactreports.set(contactreports)
    allReports.push(contactreports);

    let executivereports = {label: 'Executive', reports:[
        {id: 23, label: 'Executive Summary Report', route: '/executivesummaryreport'},
        {id: 24, label: 'Balance Sheet Report', route: '/exebalancesheetreport'},
        {id: 25, label: 'Cash Report', route: '/execashreport'},
        {id: 26, label: 'Income Report', route: '/exeincomereport'},
        {id: 27, label: 'Performance Report', route: '/exeperformancereport'},
        {id: 28, label: 'Position Report', route: '/exepositionreport'},
        {id: 29, label: 'Profitability Report', route: '/exeprofitabilityreport'}
    ]}

    allReports.push(executivereports);

    let generalreports = {label: 'General', reports: [
        {id: 30, label: 'Banking Report', route: '/bankingoverview'},
        {id: 31, label: 'Foreign Exchange History List', route: '/fxhistorylist'},
        {id: 32, label: 'Foreign Exchange List', route: '/currenciessettings'},
        {id: 33, label: 'Job Sales Summary', route: '/jobsalessummary'},
        {id: 34, label: 'Job Profitability Report', route: '/jobprofitabilityreport'}
    ]}

    allReports.push(generalreports)

    let inventoryreports = {label: 'Inventory', reports: [
        {id: 35, label: 'Bin Locations List', route: '/binlocationlist'},
        {id: 36, label: 'Lot Number Report', route: '/lotnumberlist'},
        {id: 37, label: 'Serial Number Report', route: '/serialnumberlist'},
        {id: 38, label: 'Stock Adjustment List', route: '/stockadjustmentoverview'},
        {id: 39, label: 'Stock Movement Report', route: '/stockmovementreport'},
        {id: 40, label: 'stock Quantity by Location', route: '/stockquantitybylocation'},
        {id: 41, label: 'Stock Value Report', route: '/stockvaluereport'},
    ]}

    allReports.push(inventoryreports);

    let mfgreports = {label: 'Manufacturing', reports: [
        {id: 42, label: 'Build Profitability', route: '/buildcostreport'},
        {id: 43, label: 'Production Workseet', route: '/worksheetreport'},
        {id: 44, label: 'Work Orders', route: '/workorderlist'}
    ]}

    allReports.push(mfgreports)

    let paymentReports ={label: 'Payments', reports: [
        {id: 45, label: 'Aged Payables', route: '/agedpayables'},
        {id: 46, label: 'Aged Payables Summary', route: '/agedpayablessummary'},
        {id: 47, label: 'Aged Receivables', route: '/agedreceivables'},
        {id: 48, label: 'Aged Receivables Summary', route: '/agedreceivablessummary'},
        {id: 49, label: 'Cheque List', route: '/chequelist'},
        {id: 50, label: 'Payment Methods List', route: '/paymentmethodSettings'},
        {id: 51, label: 'Print Statements', route: '/statementlist'}
    ]}

    allReports.push(paymentReports);

    let payrollreports = {label: 'Payroll', reports: [
        {id: 52, label: 'Payroll History Report', route: '/payrollhistoryreport'},
        {id: 53, label: 'Payroll Leave Accrued', route: '/leaveaccruedreport'},
        {id: 54, label: 'Payroll Leave Taken', route: '/payrollleavetaken'},
        {id: 55, label: 'Time Sheet', route: '/timesheet'},
        {id: 56, label: 'Time Sheet Summary', route: '/timesheetsummary'}
    ]}

    allReports.push(payrollreports)

    let purchasereports = {label: 'Purchases', reports:[
        {id: 57, label: '1099 Contractor Report', route: '/1099report'},
        {id: 58, label: 'Aged Payables', route: '/agedpayables'},
        {id: 59, label: 'Aged Payables Summary', route: '/agedpayablessummary'},
        {id: 60, label: 'Supplier Report', route: '/supplierreport'},
        {id: 61, label: 'Supplier Summary Report', route: '/suppliersummary'},
    ]}
    allReports.push(purchasereports)

    let salesreports = {label: 'Sales', reports: [
        {id: 62, label: 'Aged Receivables', route: '/agedreceivables'},
        {id: 63, label: 'Aged Receivables Summary', route: '/agedreceivablessummary'},
        {id: 64, label: 'Product Sales Report', route: '/productsalesreport'},
        {id: 65, label: 'Sales Orders - Converted', route: '/salesorderslist?converted=true'},
        {id: 66, label: 'Sales Orders - Unconverted', route: '/salesorderslist?converted=false'},
        {id: 67, label: 'Sales Report', route: '/salesreport'},
        {id: 68, label: 'Sales Summary Report', route: '/salessummaryreport'},
    ]}
    allReports.push(salesreports)

    let transactionreports = {label: 'Transactions', reports: [
        {id: 69, label: 'All Outstanding Expenses', route: '/supplierawaitingpurchaseorder?type=bill'},
        {id: 70, label: 'Invoices - Back Ordered', route: '/invoicelistBO'},
        {id: 71, label: 'Customer Payments', route: '/customerpayment'},
        {id: 72, label: 'All Outstanding Invoices', route: '/customerwaitingpayments'},
        {id: 73, label: 'Purchase Orders - Back Orders', route: '/purchaseorderlistBO'},
        {id: 74, label: 'All Outstading Expenses', route: '/supplierawaitingpurchaseorder?type=po'},
        {id: 75, label: 'Quotes - Converted', route: '/quoteslist?converted=true'},
        {id: 76, label: 'Quotes - Unconverted', route: '/quotelist?converted=false'},
        {id: 77, label: 'Transaction Journal', route: '/transactionjournallist'}
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
    return Template.instance().allReports.get()
   },

   isFavorite:  (id) => {
    let templateObject = Template.instance();
    let favoriteReports = templateObject.favoritereports.get();
    let index = favoriteReports.findIndex(report => {
        return report.id == id
    })
    if(index > -1) {
        return true
    } else {
        return false
    }
    
   },


   noFavorite: ()=> {
    let templateObject = Template.instance();
    let favoritereports = templateObject.favoritereports.get();
    if(favoritereports.length > 0) {
        return false
    } else {
        return true
    }
   },

   favoritereports: () =>{
    return Template.instance().favoritereports.get();
   }
})

Template.reports.events({
    'change .favCheckBox': async function(event) {
        let templateObject = Template.instance();
        let dataId = $(event.target).attr('data-id');
        let allreports = templateObject.allReports.get();
        for(let i = 0; i< allreports.length; i++) {
            let group = allreports[i];
            let index = group.reports.findIndex(report=>{
                return report.id == dataId
            })
            let useData = []
            if(index > -1) {
                let report = group.reports[index];
                async function getTFav () {
                    return new Promise((resolve, reject) => {
                        getVS1Data('TFavoriteReport').then(dataObject=> {
                            if(dataObject.length != 0) {
                                let data = JSON.parse(dataObject[0].data);
                                let useData = data.tfavoritereport;
                                resolve(useData)
                            } else {
                                resolve([])
                            }
                        }).catch(function(e) {resolve([])})
                    })
                }

                useData = await getTFav();
                useData = [...useData, report]
            } else {
                let exIndex = useData.findIndex(item=> {
                    return item.label == dataId
                });
                if(exIndex > -1) {
                    useData = useData.splice(exIndex, 1);
                }
            }
            let newObj = {tfavoritereport: useData}
            addVS1Data('TFavoriteReport', JSON.stringify(newObj)).then(function() { templateObject.getFavoriteReports()})
            return
            
        }

    }
})