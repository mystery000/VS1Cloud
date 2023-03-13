import { Template } from 'meteor/templating';
import "./modals/index.js"
import "./components/custom_fields.html"
import "./components/customer_email_input.html"
import "./components/customer_selector.html"
import "./transactionheader.html"

Template.transactionheader.onCreated(function(){

})

Template.transactionheader.onRendered(function(){

})

Template.transactionheader.helpers({
    getCustomerID:function(){
        let templateObject = Template.instance();
        if (templateObject.data.clientType == 'Supplier') {
            return 'edtSupplierName'
        } else {
            return 'edtCustomerName'
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
    getTemplate: function() {
        let templateObject = Template.instance();
        if (templateObject.data.clientType == 'Supplier') {
            return 'supplierlistpop'
        } else {
            return 'customerlistpop'
        }
    },
    getTargetModalID: function() {
        let templateObject = Template.instance();
        if (templateObject.data.clientType == 'Supplier') {
            return 'edtSupplier_modal'
        } else {
            return 'edtCustomer_modal'
        }
    },
    getTargetTemplate: function() {
        let templateObject = Template.instance();
        if (templateObject.data.clientType == 'Supplier') {
            return 'addsupplierpop'
        } else {
            return 'addcustomerpop'
        }
    },
    getModalTitle: function() {
        let templateObject = Template.instance();
        if (templateObject.data.clientType == 'Supplier') {
            return 'Supplier List'
        } else {
            return 'Customer List'
        }
    }
})

Template.transactionheader.events({

})