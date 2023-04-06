import { Template } from 'meteor/templating';
import "./modals/index.js";
import "./components/index.js";

import "./transaction_cheque_header.html";
import "./transaction_deposit_header.html";
import "./transaction_journal_header.html";
import "./transaction_payment_header.html";
import "./transaction_shippingdocket_header.html";
import "./transaction_stocktransfer_header.html";
import "./transaction_stockadjustment_header.html";
import "./transaction_header.html";
import "./components/customer_selector.html";
Template.transaction_header.onCreated(function() {

})

Template.transaction_header.onRendered(function() {

  let isCompleted = Template.instance().data.showCompleted;
  if (isCompleted) {
    $("#workorder-detail :input").prop("disabled", true);
  } 
})


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
  getCustomerID:function(){
    let templateObject = Template.instance();
    if (templateObject.data.clientType == 'Supplier') {
        return 'edtSupplierName'
    } else {
        return 'edtCustomerName'
    }
},
  getContactType: () => {
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
  modal_id: function() {
      let templateObject = Template.instance();
      if (templateObject.data.clientType == 'Supplier') {
          return 'supplierList_modal'
      } else {
          return 'customerList_modal'
      }
  },
  getDateInputLabel: () => {
    const cardType = Template.instance().data.cardType;
    if (cardType === 'Invoice'|| cardType === 'Sales Order' || cardType === 'PO' ) return "Sales Date";
    else return "Order Date";
  },

  getTemplate:()=>{
    const cardType = Template.instance().data.cardType.toLowerCase();
    switch(cardType) {
      case 'bill':
      case "po" :
      case "credit":
        return 'supplierlistpop';
      default:
        return 'customerlistpop'
    }
  },

  getModalTitle:()=>{
    const cardType = Template.instance().data.cardType.toLowerCase();
    switch(cardType) {
      case 'bill':
      case "po" :
      case "credit":
        return 'Supplier List';
      default:
        return 'Customer List'
    }
  },

  getTargetModalID: ()=> {
    const cardType = Template.instance().data.cardType.toLowerCase();
    switch(cardType) {
      case 'bill':
      case "po" :
      case "credit":
        return 'edtSupplier_modal';
      default:
        return 'edtCustomer_modal'
    }
  },

  getTargetTemplate: ()=>{
    const cardType = Template.instance().data.cardType.toLowerCase();
    switch(cardType) {
      case 'bill':
      case "po" :
      case "credit":
        return 'addsupplierpop';
      default:
        return 'addcustomerpop'
    }
  },

  getModalId: ()=> {
    const cardType = Template.instance().data.cardType.toLowerCase();
    switch(cardType) {
      case 'bill':
      case 'po':
      case 'credit':
        return '';
      default: 'supplierListModal'
        return 'customerListModal'
    }
  },
  getgridTableId: function() {
    let templateObject = Template.instance();
      return templateObject.data.gridTableId;
  }
  
})
