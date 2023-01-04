import { Template } from 'meteor/templating';
import "./modals/index.js"
import "./components/index.js"

import "./transaction_cheque_header.html"
import "./transaction_deposit_header.html"
import "./transaction_journal_header.html"
import "./transaction_payment_header.html"
import "./transaction_shippingdocket_header.html"
import "./transaction_stocktransfer_header.html"
import "./transaction_header.html"

Template.transaction_header.helpers({
  getUserLabel: () => {
    const cardType = Template.instance().data.cardType;
    switch(cardType){
      case "Invoice":
      case "Sales Order":
        return "Customer";
      case "Bill":
      case "PO":
      case "credit": 
        return "Supplier";
      default:
        return "Customer"
    }
  },
  getDateInputLabel: () => {
    const cardType = Template.instance().data.cardType;
    if (cardType === 'Invoice'|| cardType === 'Sales Order' || cardType === 'PO' ) return "Sales Date";
    else return "Order Date";
  }
})