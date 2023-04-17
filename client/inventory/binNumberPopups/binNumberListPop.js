import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './binNumberListPop.html';
import { ProductService } from "../../product/product-service";
let productService = new ProductService();
Template.binNumberListPop.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.getDataTableList = function (data) {
        let linestatus = '';
        if (data.Active == true) {
            linestatus = "";
        } else if (data.Active == false) {
            linestatus = "In-Active";
        };
        var dataList = [
            data.Id || "",
            data.BinClassName || "-",
            data.BinLocation || "",
            linestatus,
        ];
        return dataList;
      };
    
      
    
      let headerStructure = [
        { index: 0, label: 'ID', class: '', active: false, display: true, width: "10" },
        { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "200" },
        { index: 2, label: 'BinLocation', class: 'colBinLocation', active: true, display: true, width: "400" },
        { index: 3, label: 'Status', class: 'colStatus', active: true, display: true, width: "120" },
      ];
      templateObject.tableheaderrecords.set(headerStructure);


});
Template.binNumberListPop.onRendered(function() {
    const templateObject = Template.instance();
});
Template.binNumberListPop.events({
    'click .btnAddNewBin': function (event) {
        $("#addBinNumberModal").modal('toggle');
    }
});
Template.binNumberListPop.helpers({
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
      },
    datatablerecords: () => {
    return Template.instance().datatablerecords.get();
    },
    apiFunction: function () {
    // do not use arrow function
    return productService.getAllBinProductVS1;
    },

    searchAPI: function () {
    return productService.getNewBinListBySearch;
    },

    apiParams: function () {
    return [
        "limitCount",
        "limitFrom",
        "deleteFilter",
    ];
    },

    service: () => {
    return productService;
    },

    datahandler: function () {
    let templateObject = Template.instance();
    return function (data) {
        let dataReturn = templateObject.getDataTableList(data);
        return dataReturn;
    };
    },

    exDataHandler: function () {
    let templateObject = Template.instance();
    return function (data) {
        let dataReturn = templateObject.getDataTableList(data);
        return dataReturn;
    };
    },
    tablename : function () {
        let templateObject = Template.instance();
        return 'tblBinLocations' + templateObject.data.custid;
    }
});

