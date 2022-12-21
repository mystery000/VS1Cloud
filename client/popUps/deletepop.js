
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
  workorders:
    {
      name: "Delivery Docket",
      title: "Delivery Docket",
      key: "delivery_docket",
    },
  supplierpayments:
    {
      name: "Supplier Payments",
      title: "Supplier Payment",
      key: "supplier_payment",
    },
  purchaseorders:
    {
      name: "Purchase Orders",
      title: "Purchase Order",
      key: "purchase_order",
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
    item3: 'Stock Adjustment'
  },
  stocktransfer: {
    item1: 'Transfer',
    item2: 'stock transfer',
    item3: 'Stock Transfer'
  },
  workorder: {
    item1: 'Sales Order',
    item2: 'sales order',
    item3: 'Sales Order'
  }
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
  }

})