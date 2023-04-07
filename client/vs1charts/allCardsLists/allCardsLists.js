import { ReactiveVar } from "meteor/reactive-var";
import ChartsApi from "../../js/Api/ChartsApi";
import draggableCharts from "../../js/Charts/draggableCharts";
import Tvs1CardPreference from "../../js/Api/Model/Tvs1CardPreference";
import '../../lib/global/indexdbstorage.js';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import './allCardsLists.html';
import { CardService } from "../card-service";

const cardService = new CardService()

Template.allCardsLists.onRendered(function () {
    cardService.setCardPositions();
    const templateObject = Template.instance();    
    templateObject.deactivateDraggable = () => {
        draggableCharts.disable();
    };
    templateObject.activateDraggable = () => {
        setTimeout(function () {
            $(".connectedCardSortable").sortable({
                disabled: false,
                scroll: false,
                placeholder: "portlet-placeholder ui-corner-all",
                tolerance: 'pointer',
                start: (event, ui) => {
                    ui.placeholder.height(ui.item.height())
                    ui.placeholder.width(ui.item.width())
                },
                stop: async (event, ui) => {
                    if ($(ui.item[0]).hasClass("dimmedChart") == false) {
                        // Here we save card list
                        // templateObject.saveCards();
                    }
                },
            }).disableSelection();
        }, 500)
    };
    templateObject.activateDraggable();    
});

Template.allCardsLists.events({
    'click .customerawaitingpayments': function (event) {
        const url = window.location.href;
        const newurl = new URL(window.location.href);
        let customerID = 0;
        if (url.indexOf("customerscard?id=") > 0) {
            customerID = (!isNaN(newurl.searchParams.get("id"))) ? newurl.searchParams.get("id") : 0;
        }
        if (url.indexOf("customerscard?jobid=") > 0) {
            customerID = (!isNaN(newurl.searchParams.get("jobid"))) ? newurl.searchParams.get("jobid") : 0;
        }
        if (customerID != 0) {
            window.location.href = 'customerawaitingpayments?id=' + customerID;
        } else {
            window.location.href = 'customerawaitingpayments';
        }
    },
    'click .overduecustomerawaitingpayments': function (event) {
        const url = window.location.href;
        const newurl = new URL(window.location.href);
        let customerID = 0;
        if (url.indexOf("customerscard?id=") > 0) {
            customerID = (!isNaN(newurl.searchParams.get("id"))) ? newurl.searchParams.get("id") : 0;
        }
        if (url.indexOf("customerscard?jobid=") > 0) {
            customerID = (!isNaN(newurl.searchParams.get("jobid"))) ? newurl.searchParams.get("jobid") : 0;
        }
        if (customerID != 0) {
            window.location.href = 'overduecustomerawaitingpayments?id=' + customerID;
        } else {
            window.location.href = 'overduecustomerawaitingpayments';
        }
    },
    'click .supplierawaitingpurchaseorder': function (event) {
        const url = window.location.href;
        const newurl = new URL(window.location.href);
        let supplierID = 0;
        if (url.indexOf("supplierscard?id=") > 0) {
            supplierID = (!isNaN(newurl.searchParams.get("id"))) ? newurl.searchParams.get("id") : 0;
        }
        if (supplierID != 0) {
            window.location.href = 'supplierawaitingpurchaseorder?id=' + supplierID;
        } else {
            window.location.href = 'supplierawaitingpurchaseorder';
        }
    },
    'click .overduesupplierawaiting': function (event) {
        const url = window.location.href;
        const newurl = new URL(window.location.href);
        let supplierID = 0;
        if (url.indexOf("supplierscard?id=") > 0) {
            supplierID = (!isNaN(newurl.searchParams.get("id"))) ? newurl.searchParams.get("id") : 0;
        }
        if (supplierID != 0) {
            window.location.href = 'overduesupplierawaiting?id=' + supplierID;
        } else {
            window.location.href = 'overduesupplierawaiting';
        }
    },
    "click .cardSettingBtn": async function (e) {        
        e.preventDefault();
        // if ($('.cardSettingBtn').find('i').hasClass('fa-save')) {
        //     $('.cardSettingBtn').find('i').removeClass('fa-save')
        //     $('.cardSettingBtn').find('i').addClass('fa-cog');            
        //     $(".card-visibility").find(".cardEditOptions").addClass("hideelement");            
        //     $('.card-visibility').removeClass('dimmedChart');                        
        // } else {
            // $('.cardSettingBtn').find('i').removeClass('fa-cog')
            // $('.cardSettingBtn').find('i').addClass('fa-save');            
            $(".cardSettingBtn").addClass("hideelement");
            $(".card-visibility").removeClass('hideelement');
            $(".card-visibility").addClass('dimmedChart');                    
            $(".cardEditOptions").removeClass("hideelement");
            $(".actionButtonsTop").removeClass("hideelement");
        // }
    },    
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
