import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './deletepop.html';
const TransactionTypeTemplates = {
  sales: 
    {
      item1: "Sales Order",
      item2: "sales order",
      item3: "Sales Order",
      button1: 'btnDeleteSO',
      button2: 'btnDeleteFollowingSOs'
    },
  bills: 
    {
      item1: "Bill",
      item2: "bill",
      item3: "Bill",
      button1: 'btnDeleteBill',
      button2 : 'btnDeleteFollowingBills'
    },
  cheques: 
    {
      item1: "Cheque",
      item2: "cheque",
      item3: "Cheque",
      button1: 'btnDeleteCheque',
      button2: 'btnDeleteFollowingCheques'
    },
  credits: 
    {
      item1: "Credit",
      item2: "credit",
      item3: "Credit",
      button1: 'btnDeleteCredit',
      button2: 'btnDeleteFollowingCredits'
    },
  invoices: 
    {
      item1: "Invoice",
      item2: "invoice",
      item3: "Invoices",
      button1: 'btnDeleteInvoice',
      button2: 'btnDeleteFollowingInvoices'
    },
  refunds:
    {
      item1: "Refund",
      item2: "refund",
      item3: "Refund",
      button1: 'btnDeleteRefund',
      button2: 'btnDeleteFollowingRefunds'
    },
  workorders:
    {
      item1: 'Work Order',
      item2: 'wokr order',
      item3: 'Work Order',
      button1: 'btnDeleteWO',
      button2: 'btnDeleteFollowingWOs'
    },
  supplierpayments:
    {
      item1: "Supplier Payments",
      item2: "supplier payment",
      item3: "Supplier Payment",
      button1: 'btnDeletePayment',
      button2: 'btnDeleteFollowingPayments',
    },
  purchaseorders:
    {
      item1: "Purchase Orders",
      item2: "purchase order",
      item3: "Purchase Order",
      button1: "btnDeletePO",
      button2: "btnDeleteFollowingPOs"
    },
  quotes:
    {
      item1: "Quote",
      item2: "quote",
      item3: "Quote",
      button1: 'btnDeleteQuote',
      button2: 'btnDeleteFollowingQuotes'
    },
  stockadjustment: {
    item1: 'Stock Adj',
    item2: 'stock adjustment',
    item3: 'Stock Adjustment',
    button1: 'btnDeleteStock',
    button2: 'btnDeleteFollowingStocks'
  },
  stocktransfer: {
    item1: 'Transfer',
    item2: 'stock transfer',
    item3: 'Stock Transfer',
    button1: 'btnDeleteStock',
    button2: 'btnDeleteFollowingStocks'
  },
};

// Template.deletepop.onRendered(function () {
//   const { type } = Template.currentData();
// })

Template.deletepop.helpers({
  itemName1: () => {
    const templateInstance = Template.instance();
    const formName = TransactionTypeTemplates[templateInstance.data.formType].item1;
    return formName;
  },
  itemName2: () => {
    const templateInstance = Template.instance();
    const formName = TransactionTypeTemplates[templateInstance.data.formType].item2;

    return formName;
  },
  itemName3: () => {
    const templateInstance = Template.instance();
    const formName = TransactionTypeTemplates[templateInstance.data.formType].item3;

    return formName;
  },
  button1: () => {
    const templateInstance = Template.instance();
    const formName = TransactionTypeTemplates[templateInstance.data.formType].button1;

    return formName;
  },
  button2: () => {
    const templateInstance = Template.instance();
    const formName = TransactionTypeTemplates[templateInstance.data.formType].button2;
    return formName;
  }

})