import { ReactiveVar } from "meteor/reactive-var";
import { Template } from 'meteor/templating';
import './title_list_pop.html';
import {SideBarService} from "../../js/sidebar-service.js";

let sideBarService = new SideBarService();
Template.title_list_pop.onCreated(function () {
    const templateObject = Template.instance();

    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.getDataTableList = function(data) {
        let dataList = [
            data[0],
            data[1],
            data[2],
        ];
        return dataList;
    }

    let headerStructure = [
        { index: 0, label: '#ID', class: '', active: false, display: true, width: "30" },
        { index: 1, label: 'Title', class: 'colTitleName', active: true, display: true, width: "150" },
        { index: 2, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
    ];

    templateObject.tableheaderrecords.set(headerStructure);
});

Template.title_list_pop.onRendered(function () {
});


Template.title_list_pop.events({

});

Template.title_list_pop.helpers({
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },

    apiFunction:function() {
        let sideBarService = new SideBarService();
        return sideBarService.getTitleList;
    },

    searchAPI: function() {
        return sideBarService.getTitleList;
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
});
