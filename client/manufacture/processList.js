import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-editable-select';
import { Template } from 'meteor/templating';
import './processList.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ManufacturingService } from './manufacturing-service';

Template.processList.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    // templateObject.selectedInventoryAssetAccount = new ReactiveVar('');
    templateObject.getDataTableList = function(data){
        let dataList = [
                data.fields.ID || "",
                data.fields.KeyValue || "",
                data.fields.Description || "",
                data.fields.DailyHours || "",
                Currency + data.fields.HourlyLabourCost || 0,
                data.fields.COGS || "",
                data.fields.ExpenseAccount || "",
                Currency + data.fields.OHourlyCost || 0,
                data.fields.OCOGS || "",
                data.fields.OExpense || "",
                Currency + data.fields.TotalHourlyCost || 0,
                data.fields.Wastage || "",
        ]
        // let dataList = [];
        return dataList;
    }

    let headerStructure  = [
        { index: 0, label: '#ID', class: 'colProcessId', active: false, display: true, width: "10" },
        { index: 1, label: 'Name', class: 'colName', active: true, display: true, width: "100" },
        { index: 2, label: 'Description', class: 'colDescription', active: true, display: true, width: "200" },
        { index: 3, label: 'Daily Hours', class: 'colDailyHours', active: true, display: true, width: "100" },
        { index: 4, label: 'Hourly Labour Cost', class: 'colHourlyLabourCost', active: true, display: true, width: "100" },
        { index: 5, label: 'Cost of Goods Sold', class: 'colCOGS', active: true, display: true, width: "200" },
        { index: 6, label: 'Expense Account', class: 'colExpense', active: true, display: true, width: "200" },
        { index: 7, label: 'Hourly Overhead Cost', class: 'colHourlyOverheadCost', active: true, display: true, width: "100" },
        { index: 8, label: 'Cost of Goods Sold(Overhead)', class: 'colOverGOGS', active: true, display: true, width: "200" },
        { index: 9, label: 'Expense Account(Overhead)', class: 'colOverExpense', active: true, display: true, width: "120" },
        { index: 10, label: 'Total Hourly Costs', class: 'colTotalHourlyCosts', active: true, display: true, width: "100" },
        { index: 11, label: 'Inventory Asset Wastage', class: 'colWastage', active: true, display: true, width: "200" }
    ];

    templateObject.tableheaderrecords.set(headerStructure);
})

Template.processList.onRendered (function() {
    const templateObject = Template.instance();

    
});

Template.processList.helpers ({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get();
    },
    selectedInventoryAssetAccount: () => {
        return Template.instance().selectedInventoryAssetAccount.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },

    apiFunction:function() {
        let manufacturingService = new ManufacturingService();
        return manufacturingService.getAllProcessData;
    },

    searchAPI: function() {
        let manufacturingService = new ManufacturingService();
        return manufacturingService.getProcessByName;
    },

    service: ()=>{
        let manufacturingService = new ManufacturingService();
        return manufacturingService;
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

    apiParams: ()=>{
        return ['limitCount', 'limitFrom', 'deleteFilter']
    }

})


Template.processList.events({
    
    'click .processList .btnRefresh': function(e) {
        let templateObject = Template.instance();
        let manufacturingService = new ManufacturingService();
        $('.fullScreenSpin').css('display', 'inline-block');
        setTimeout(function () {
            manufacturingService.getAllProcessData(initialBaseDataLoad, 0, false).then(function(data) {
                addVS1Data('TProcessStep', JSON.stringify(data)).then(function(){
                    window.open('/processlist', '_self');
                })
            })
        }, 3000);
    },

    'click .processList #btnNewProcess': function (e) {
        FlowRouter.go('/processcard');
    },

    'click #tblProcessList tbody tr': function (e) {
        var listData = $(e.target).closest('tr').find('.colProcessId').text();
        FlowRouter.go('/processcard?id=' + listData)
    }

})
