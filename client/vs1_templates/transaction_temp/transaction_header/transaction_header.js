import { Template } from 'meteor/templating';
import "./modals/index.js"
import "./components/index.js"

import "./transaction_cheque_header.html"
import "./transaction_deposit_header.html"
import "./transaction_journal_header.html"
import "./transaction_payment_header.html"
import "./transaction_shippingdocket_header.html"
import "./transaction_stocktransfer_header.html"
import "./transaction_stockadjustment_header.html"
import "./transaction_header.html"

Template.transaction_header.helpers({
  getUserLabel: () => {
    const cardType = Template.instance().data.cardType.toLowerCase();
    switch(cardType){
      case "invoice":
      case "sales order":
        return "Customer";
      case "bill":
      case "po":
      case "credit": 
        return "Supplier";
      default:
        return "Customer"
    }
  },
  getCustomerID: () => {
    const cardType = Template.instance().data.cardType.toLowerCase();
    switch(cardType) {
      case 'bill':
      case "po" :
      case "credit":
        return "edtSupplierName";
      default:
        return "edtCustomerName"
    }
  },
  getDateInputLabel: () => {
    const cardType = Template.instance().data.cardType;
    if (cardType === 'Invoice'|| cardType === 'Sales Order' || cardType === 'PO' ) return "Sales Date";
    else return "Order Date";
  }
})