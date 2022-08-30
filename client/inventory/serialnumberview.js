import { ProductService } from "../product/product-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { TaxRateService } from "../settings/settings-service";
import { CoreService } from '../js/core-service';
import { AccountService } from "../accounts/account-service";
import { PurchaseBoardService } from '../js/purchase-service';
import { UtilityService } from "../utility-service";
import 'jquery-editable-select';
import { Random } from 'meteor/random';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.serialnumberview.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.currentSerialNumber = new ReactiveVar();

});

Template.serialnumberview.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    var currentSerialNumber = FlowRouter.current().queryParams.serialnumber;
    if (currentSerialNumber) {
        templateObject.currentSerialNumber.set(currentSerialNumber);
    }
});

Template.serialnumberview.helpers({
    currentSerialNumber: () => {
        return Template.instance().currentSerialNumber.get();
    }
});

Template.serialnumberview.events({
});
