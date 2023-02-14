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
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './workorderList.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let accountService = new SalesBoardService();
Template.workorderlist.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);



    templateObject.getDataTableList = function(data){

        let dataList = [
            data.fields.ID ,
            data.fields.SaleID || '',
            data.fields.Customer || '',
            data.fields.PONumber || '',
            data.fields.SaleDate || '',
            data.fields.DueDate || '',
            data.fields.ProductName || '',
            data.fields.Quantity || '',
            data.fields.Comment || '',
        ];
        return dataList;
      }

    let headerStructure = [
        { index: 0, label: "#ID", class: "SortDate", width: "0", active: false, display: true },
        { index: 1, label: "SalesOrderID", class: "colOrderNumber", width: "80", active: true, display: true },
        { index: 2, label: "Customer", class: "colCustomer", width: "80", active: true, display: true },
        { index: 3, label: "PO Number", class: "colPONumber", width: "100", active: true, display: true },
        { index: 4, label: "Sale Date", class: "colSaleDate", width: "200", active: true, display: true },
        { index: 5, label: "Due Date", class: "colDueDate", width: "200", active: true, display: true },
        { index: 6, label: "Product", class: "colProductName", width: "120", active: true, display: true },
        { index: 7, label: "Amount", class: "colAmount", width: "80", active: true, display: true },
        { index: 8, label: "Comments", class: "colComment", width: "", active: true, display: true },
    ];
    templateObject.tableheaderrecords.set(headerStructure)
})

Template.workorderlist.onRendered (function() {
    const templateObject = Template.instance();
});

Template.workorderlist.helpers ({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get();
    },
    selectedInventoryAssetAccount: () => {
        return Template.instance().selectedInventoryAssetAccount.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

})


Template.workorderlist.events({

    'click .workorderList .btnRefresh': function(e) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        setTimeout(function () {
            // templateObject.getWorkorderRecords();
            window.open('/workorderlist', '_self');
            }, 3000);
        },


        'click .workorderList #btnNewWorkorder': function (e) {
            FlowRouter.go('/workordercard');
        },

        'click #tblWorkorderList tbody tr': function (event) {
            var id = $(event.target).closest('tr').find('.colID').text();
            FlowRouter.go('/workordercard?id='+id)
        }

        

})
