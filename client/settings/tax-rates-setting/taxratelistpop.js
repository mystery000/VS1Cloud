import {
    TaxRateService
} from "../settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

import { Template } from 'meteor/templating';
import './taxratelistpop.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import moment from "moment";

let taxRateService = new TaxRateService();
let sideBarService = new SideBarService();

Template.taxratelistpop.onCreated(function () {
    templateObject = Template.instance();
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.getDataTableList = function(data) {
        let taxRate = (data.Rate * 100).toFixed(2);
        var dataList = [
            data.Id || '',
            data.CodeName || '',
            data.Description || '-',
            taxRate || 0,
        ];
        return dataList;
    }

    let headerStructure = [
        {index: 0, label: "ID", class: "colID", width: "50", active: true, display: true},
        {index: 1, label: "Name", class: "colName taxName", width: "80", active: true, display: true},
        {index: 2, label: "Description", class: "colDescription", width: "", active: true, display: true},
        {index: 3, label: "Rate", class: "colRate taxRate", width: "100", active: true, display: true},
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.taxratelistpop.onRendered(function () {

});

Template.taxratelistpop.events({
    'click .btnRefreshTax': function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        const customerList = [];
        const clientList = [];
        let salesOrderTable;
        var splashArray = new Array();
        var splashArrayTaxRateList = new Array();
        const dataTableList = [];
        const tableHeaderList = [];

        let dataSearchName = $('#tblTaxRate_filter input').val();
        var currentLoc = FlowRouter.current().route.path;
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getTaxRateVS1ByName(dataSearchName).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                if (data.ttaxcodevs1.length > 0) {
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                        var dataList = [
                            data.ttaxcodevs1[i].Id || '',
                            data.ttaxcodevs1[i].CodeName || '',
                            data.ttaxcodevs1[i].Description || '-',
                            taxRate || 0,
                        ];

                        let taxcoderecordObj = {
                            codename: data.ttaxcodevs1[i].CodeName || ' ',
                            coderate: taxRate || ' ',
                        };

                        // taxCodesList.push(taxcoderecordObj);

                        splashArrayTaxRateList.push(dataList);
                    }

                    var datatable = $('#tblTaxRate').DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayTaxRateList);
                    datatable.draw(false);

                    $('.fullScreenSpin').css('display', 'none');
                } else {

                    $('.fullScreenSpin').css('display', 'none');
                    $('#taxRateListModal').modal('toggle');
                    swal({
                        title: 'Question',
                        text: "Tax Code does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            $('#newTaxRateModal').modal('toggle');
                            $('#edtTaxNamePop').val(dataSearchName);
                        } else if (result.dismiss === 'cancel') {
                            $('#newTaxRateModal').modal('toggle');
                        }
                    });

                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            sideBarService.getTaxRateVS1().then(function (data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                    var dataList = [
                        data.ttaxcodevs1[i].Id || '',
                        data.ttaxcodevs1[i].CodeName || '',
                        data.ttaxcodevs1[i].Description || '-',
                        taxRate || 0,
                    ];

                    let taxcoderecordObj = {
                        codename: data.ttaxcodevs1[i].CodeName || ' ',
                        coderate: taxRate || ' ',
                    };

                    // taxCodesList.push(taxcoderecordObj);

                    splashArrayTaxRateList.push(dataList);
                }
                var datatable = $('#tblTaxRate').DataTable();
                datatable.clear();
                datatable.rows.add(splashArrayTaxRateList);
                datatable.draw(false);

                $('.fullScreenSpin').css('display', 'none');
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'keyup #tblTaxRate_filter input': function (event) {
        if (event.keyCode == 13) {
            $(".btnRefreshTax").trigger("click");
        }
    },
    'click .btnNewTaxRate' : function (event) {
        let modal = $('#newTaxRateModal');
        modal.find('#edtTaxNamePop').val('');
        modal.find('#edtTaxRatePop').val('');
        modal.find('#edtTaxDescPop').val('');
    }
});

Template.taxratelistpop.helpers({
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    apiFunction:function() {
        let sideBarService = new SideBarService();
        return sideBarService.getTaxRateVS1;
    },

    searchAPI: function() {
        return sideBarService.getTaxRateVS1ByName;
    },

    service: ()=>{
        let sideBarService = new SideBarService();
        return sideBarService;

    },

    datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    exDataHandler: function() {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    apiParams: function() {
        return [];
    },
    tablename: () => {
        let templateObject = Template.instance();
        return 'tblTaxRate'+templateObject.data.custid;
      },
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
