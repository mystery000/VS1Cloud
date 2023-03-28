import {ReactiveVar} from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import "./reportcard.html"
import { TaxRateService } from '../../settings/settings-service';

Template.reportcard.onCreated(function(){
    let templateObject = Template.instance();
    templateObject.reportrecords = new ReactiveVar();
})

Template.reportcard.onRendered(function() {
    let templateObject = Template.instance();
    
})

Template.reportcard.helpers({

})

Template.reportcard.events({

})