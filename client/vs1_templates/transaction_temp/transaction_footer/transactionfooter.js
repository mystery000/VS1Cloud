import { Template } from 'meteor/templating';
import "./transactionfooter.html";
import FxGlobalFunctions from '../../../packages/currency/FxGlobalFunctions';

Template.transactionfooter.onCreated(function() {
    
});

Template.transactionfooter.onRendered(function() {

});

Template.transactionfooter.helpers({
    footerFields: ()=>{
        return Template.instance().data.footerFields;
    },
    footerButtons: ()=> {
        return Template.instance().data.footerButtons;
    },
    convertToForeignAmount: (amount) => {
        return FxGlobalFunctions.convertToForeignAmount(amount, $('#exchange_rate').val(), FxGlobalFunctions.getCurrentCurrencySymbol());
    }
});

