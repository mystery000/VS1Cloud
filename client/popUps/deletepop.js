
const TransactionTypeTemplates = {
  sales: 
    {
      name: "Sales Orders",
      title: "Sales Order",
      key: "sales_order",
    },
  bills: 
    {
      name: "bill",
      title: "Bill",
      key: "bill",
    },
  cheques: 
    {
      name: "Cheques",
      title: "Cheque",
      key: "cheque",
    },
  credits: 
    {
      name: "Credits",
      title: "Credit",
      key: "credit",
    },
  invoices: 
    {
      name: "Invoices",
      title: "Invoice",
      key: "invoice",
    },
  refunds:
    {
      name: "Refunds",
      title: "Refund",
      key: "refund",
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
      item1: "Purchase Order",
      item2: "purchase order",
      item3: "Purchase Order",
      button1: 'btnDeletePO',
      button2: 'btnDeleteFollowingPOs',
    },
  quotes:
    {
      name: "Quotes",
      title: "Quote",
      key: "quote",
    },
  stockadjustment: {
    item1: 'Stock Adj',
    item2: 'stock adjustment',
    item3: 'Stock Adjustment',
    button1: 'btnDeleteStock',
    button2: 'btnDeleteFollowingStocks',
  },
  stocktransfer: {
    item1: 'Transfer',
    item2: 'stock transfer',
    item3: 'Stock Transfer',
    button1: 'btnDeleteStock',
    button2: 'btnDeleteFollowingStocks',
  },
  workorder: {
    item1: 'Sales Order',
    item2: 'sales order',
    item3: 'Sales Order',
    button1: 'btnDeleteSO',
    button2: 'btnDeleteFollowingSOs',
  },
  customer_payment: {
    item1: 'Payment',
    item2: 'payment',
    item3: 'Payment',
    button1: 'btnDeletePayment',
    button2: 'btnDeleteFollowingPayments',
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