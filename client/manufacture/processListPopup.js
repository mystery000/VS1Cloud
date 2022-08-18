import {SalesBoardService} from '../js/sales-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {InvoiceService} from "../invoice/invoice-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import {OrganisationService} from '../js/organisation-service';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-editable-select';


Template.processlistpopup.onCreated(function(e){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
})

Template.processlistpopup.onRendered(function(e){
    const templateObject = Template.instance();
    templateObject.getProcessList = function(e) {
        let tempArray = localStorage.getItem('TProcesses');
        templateObject.datatablerecords.set(tempArray?JSON.parse(tempArray): []);
    }
    templateObject.getProcessList()
})

Template.processlistpopup.helpers({
    datatablerecords:()=>{
        return Template.instance().datatablerecords.get();
    }
})