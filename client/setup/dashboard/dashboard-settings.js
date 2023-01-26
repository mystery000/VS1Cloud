import './dashboard-settings.html'
import {TaxRateService} from "../../settings/settings-service";
import {ReactiveVar} from 'meteor/reactive-var';
import {SideBarService} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';

Template.wizard_dashboard.onCreated(function(){
    this.dashboardoptionrecords = new ReactiveVar([]);
    this.tableheaderrecords = new ReactiveVar([]);

    this.deptrecords = new ReactiveVar();

    this.include7Days = new ReactiveVar(false);
    this.include30Days = new ReactiveVar(false);
    this.includeCOD = new ReactiveVar(false);
    this.includeEOM = new ReactiveVar(false);
    this.includeEOMPlus = new ReactiveVar(false);

    this.includeSalesDefault = new ReactiveVar(false);
    this.includePurchaseDefault = new ReactiveVar(false);
})