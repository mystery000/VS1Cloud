import { ReactiveVar } from "meteor/reactive-var";
import ChartsApi from "../../js/Api/ChartsApi";
import draggableCharts from "../../js/Charts/draggableCharts";
import ChartHandler from "../../js/Charts/ChartHandler";
import Tvs1CardPreference from "../../js/Api/Model/Tvs1CardPreference";
import Tvs1CardPreferenceFields from "../../js/Api/Model/Tvs1CardPreferenceFields";
import ApiService from "../../js/Api/Module/ApiService";
import '../../lib/global/indexdbstorage.js';

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './allCardsLists.html';

const employeeId = localStorage.getItem("mySessionEmployeeLoggedID");
let _chartGroup = "";
let _tabGroup = 0;

<<<<<<< .merge_file_a08784
=======
Template.kpiCard.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.tooltip_text = new ReactiveVar("");
});

>>>>>>> .merge_file_a02980
Template.allCardsLists.onRendered(function () {
    _tabGroup = $(".connectedCardSortable").data("tabgroup");
    _chartGroup = $(".connectedCardSortable").data("chartgroup");
    const templateObject = Template.instance();

    templateObject.deactivateDraggable = () => {
        draggableCharts.disable();
    };

    templateObject.saveCardsLocalDB = async () => {
        const cardsApis = new ChartsApi();
        let employeeID = localStorage.getItem("mySessionEmployeeLoggedID");
        const cardPreferencesEndpoint = cardsApis.collection.findByName(
            cardsApis.collectionNames.Tvs1CardPreference
        );
        cardPreferencesEndpoint.url.searchParams.append(
            "ListType",
            "'Detail'"
        );
        cardPreferencesEndpoint.url.searchParams.append(
            "select",
            `[EmployeeID]=${employeeID}`
        );
        const cardPreferencesEndpointResponse = await cardPreferencesEndpoint.fetch(); // here i should get from database all charts to be displayed

        if (cardPreferencesEndpointResponse.ok == true) {
            const cardPreferencesEndpointJsonResponse = await cardPreferencesEndpointResponse.json();
            await addVS1Data('Tvs1CardPreference', JSON.stringify(cardPreferencesEndpointJsonResponse))
            return true
        }
    }

    templateObject.setCardPositions = async () => {
        setTimeout(async function(){
            $('.card-visibility').addClass('hideelement')
            let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
            let cardList = [];
            let employeeID = localStorage.getItem("mySessionEmployeeLoggedID");
            if( Tvs1CardPref.length == 0 ){
                await templateObject.saveCardsLocalDB();
                Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
            }
<<<<<<< .merge_file_a08784
=======

>>>>>>> .merge_file_a02980
            if( Tvs1CardPref.length > 0 ){
                let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
                cardList = Tvs1CardPreference.fromList(
                    Tvs1CardPreferenceData.tvs1cardpreference
                ).filter((card) => {
                    if ( parseInt( card.fields.EmployeeID ) == employeeID && parseInt( card.fields.TabGroup ) == _tabGroup ) {
                        return card;
                    }
                });
            }
<<<<<<< .merge_file_a08784
=======
            console.log(cardList);
>>>>>>> .merge_file_a02980
            if( cardList.length > 0 ){
                cardList.forEach((card) => {
                    $(`[card-key='${card.fields.CardKey}']`).attr("position", card.fields.Position);
                    $(`[card-key='${card.fields.CardKey}']`).attr("card-id", card.fields.ID);
                    $(`[card-key='${card.fields.CardKey}']`).attr("card-active", card.fields.Active);
                    if( card.fields.Active == false ){
<<<<<<< .merge_file_a08784
                        $(`[card-key='${card.fields.CardKey}']`).addClass("hideelement");
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').removeClass('fa-eye');
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').addClass('fa-eye-slash');
                    }else{
                        $(`[card-key='${card.fields.CardKey}']`).removeClass("hideelement");
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').removeClass('fa-eye-slash');
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').addClass('fa-eye');
=======
                        console.log("hey");
                        $(`[card-key='${card.fields.CardKey}']`).addClass("hideelement");
                        $(`[card-key='${card.fields.CardKey}'] .chkDatatable`).prop('checked', false);
                    }else{
                        $(`[card-key='${card.fields.CardKey}']`).removeClass("hideelement");
                        $(`[card-key='${card.fields.CardKey}']`).find('.chkDatatable').prop('checked', true);
>>>>>>> .merge_file_a02980
                    }
                });
                let $chartWrappper = $(".connectedCardSortable");
                $chartWrappper
                .find(".card-visibility")
                .sort(function (a, b) {
                    return +a.getAttribute("position") - +b.getAttribute("position");
                })
                .appendTo($chartWrappper);
            }else{
                // Set default cards list
                $('.card-visibility').each(function(){
                    $(this).find('.cardShowBtn .far').removeClass('fa-eye');
                    let position = $(this).data('default-position');
                    $(this).attr('position', position);
                    $(this).find('.cardShowBtn .far').addClass('fa-eye-slash');
                    $(this).attr("card-active", 'false');
                })
                $(`[chartgroup='${_chartGroup}']`).attr("card-active", 'true');
                $(`[chartgroup='${_chartGroup}']`).removeClass('hideelement');
                $(`[chartgroup='${_chartGroup}']`).find('.cardShowBtn .far').removeClass('fa-eye-slash');
                $(`[chartgroup='${_chartGroup}']`).find('.cardShowBtn .far').addClass('fa-eye');
            }
        }, 0);
    };
    templateObject.setCardPositions();

    templateObject.activateDraggable = () => {
        setTimeout(function(){
            $(".connectedCardSortable").sortable({
                disabled: false,
                scroll: false,
                placeholder: "portlet-placeholder ui-corner-all",
                tolerance: 'pointer',
                stop: async (event, ui) => {
                    if( $(ui.item[0]).hasClass("dimmedChart") == false ){
                        // Here we rebuild positions tree in html
                        await ChartHandler.buildCardPositions();
                        // Here we save card list
                        templateObject.saveCards();
                        $(".fullScreenSpin").css("display", "none");
                    }
                },
            }).disableSelection();
        }, 500)
    };
    templateObject.activateDraggable();

    templateObject.saveCards = async () => {
<<<<<<< .merge_file_a08784
=======
        
>>>>>>> .merge_file_a02980
        $(".fullScreenSpin").css("display", "block");
        // Here we get that list and create and object

        await ChartHandler.buildCardPositions();

        const cardsApis = new ChartsApi();
        // now we have to make the post request to save the data in database
        const apiEndpoint = cardsApis.collection.findByName(
            cardsApis.collectionNames.Tvs1CardPreference
        );

        const cards = $(".card-visibility");
        const cardList = [];
        for (let i = 0; i < cards.length; i++) {
<<<<<<< .merge_file_a08784
=======
            console.log($(cards[i]).find(".custom-control-input").is(":checked"));
>>>>>>> .merge_file_a02980
            cardList.push(
                new Tvs1CardPreference({
                    type: "Tvs1CardPreference",
                    fields: new Tvs1CardPreferenceFields({
                        ID: parseInt($(cards[i]).attr("card-id")),
                        EmployeeID: parseInt(localStorage.getItem("mySessionEmployeeLoggedID")),
                        CardKey: $(cards[i]).attr("card-key"),
                        Position: parseInt($(cards[i]).attr("position")),
                        TabGroup: parseInt(_tabGroup),
<<<<<<< .merge_file_a08784
                        Active: ( $(cards[i]).attr("card-active") == 'true' )? true : false
=======
                        Active: $(cards[i]).find(".custom-control-input").is(":checked"),
>>>>>>> .merge_file_a02980
                    })
                })
            );
        }
        if( cardList ){

             let cardJSON = {
                type: "Tvs1CardPreference",
                objects:cardList
             };

            try {
                const ApiResponse = await apiEndpoint.fetch(null, {
                    method: "POST",
                    headers: ApiService.getPostHeaders(),
                    body: JSON.stringify(cardJSON),
                });

                if (ApiResponse.ok == true) {
                    const jsonResponse = await ApiResponse.json();
                    await templateObject.saveCardsLocalDB();
                    $(".fullScreenSpin").css("display", "none");
                }
            } catch (error) {
                $(".fullScreenSpin").css("display", "none");
            }
        }
    };
});

Template.allCardsLists.events({
    'click .customerawaitingpayments':function(event){
        const url = window.location.href;
        const newurl = new URL(window.location.href);
        let customerID = 0;
        if (url.indexOf("customerscard?id=") > 0) {
            customerID = ( !isNaN(newurl.searchParams.get("id")) )? newurl.searchParams.get("id") : 0;
        }
        if (url.indexOf("customerscard?jobid=") > 0) {
            customerID = ( !isNaN(newurl.searchParams.get("jobid")) )? newurl.searchParams.get("jobid") : 0;
        }
        if (customerID != 0) {
            window.location.href = 'customerawaitingpayments?id=' + customerID;
        } else {
            window.location.href = 'customerawaitingpayments';
        }
    },
    'click .overduecustomerawaitingpayments':function(event){
        const url = window.location.href;
        const newurl = new URL(window.location.href);
        let customerID = 0;
        if (url.indexOf("customerscard?id=") > 0) {
            customerID = ( !isNaN(newurl.searchParams.get("id")) )? newurl.searchParams.get("id") : 0;
        }
        if (url.indexOf("customerscard?jobid=") > 0) {
            customerID = ( !isNaN(newurl.searchParams.get("jobid")) )? newurl.searchParams.get("jobid") : 0;
        }
        if (customerID != 0) {
            window.location.href = 'overduecustomerawaitingpayments?id=' + customerID;
        } else {
            window.location.href = 'overduecustomerawaitingpayments';
        }
    },
    'click .supplierawaitingpurchaseorder':function(event){
        const url = window.location.href;
        const newurl = new URL(window.location.href);
        let supplierID = 0;
        if (url.indexOf("supplierscard?id=") > 0) {
            supplierID = ( !isNaN(newurl.searchParams.get("id")) )? newurl.searchParams.get("id") : 0;
        }
        if (supplierID != 0) {
            window.location.href = 'supplierawaitingpurchaseorder?id=' + supplierID;
        } else {
            window.location.href = 'supplierawaitingpurchaseorder';
        }
    },
    'click .overduesupplierawaiting':function(event){
        const url = window.location.href;
        const newurl = new URL(window.location.href);
        let supplierID = 0;
        if (url.indexOf("supplierscard?id=") > 0) {
            supplierID = ( !isNaN(newurl.searchParams.get("id")) )? newurl.searchParams.get("id") : 0;
        }
        if (supplierID != 0) {
            window.location.href = 'overduesupplierawaiting?id=' + supplierID;
        } else {
            window.location.href = 'overduesupplierawaiting';
        }
    },
    "click .editCardBtn": async function (e) {
        playSaveAudio();
        e.preventDefault();
        let templateObject = Template.instance();
        setTimeout(async function(){
        $(".card-visibility").removeClass('hideelement');
<<<<<<< .merge_file_a08784
        if( $('.editCardBtn').find('i').hasClass('fa-cog') ){
            $('.cardShowBtn').removeClass('hideelement');
            $('.editCardBtn').find('i').removeClass('fa-cog')
            $('.editCardBtn').find('i').addClass('fa-save')
            $('.actionButtonCardsTop').removeClass('hideelement');
        }else{
            $(".fullScreenSpin").css("display", "block");
            $('.cardShowBtn').addClass('hideelement');
            $('.actionButtonCardsTop').addClass('hideelement');
            $('.editCardBtn').find('i').removeClass('fa-save')
            $('.editCardBtn').find('i').addClass('fa-cog');
=======
         if( !$('.cardSettingBtn').hasClass('hideelement') ){
            console.log("false");
            $('.cardShowBtn .custom-control-label').removeClass('hideelement');
            $('.simplestart').removeClass('hideelement');
            // $('.editCardBtn').find('i').removeClass('fa-cog')
            $('.cardSettingBtn').addClass('hideelement');
            $('.actionButtonCardsTop').removeClass('hideelement');
        }else{
            $(".fullScreenSpin").css("display", "block");
            $('.cardShowBtn .custom-control-label').addClass('hideelement');
            $('.simplestart').addClass('hideelement');
            $('.actionButtonCardsTop').addClass('hideelement');
            $('.cardSettingBtn').removeClass('hideelement');
>>>>>>> .merge_file_a02980
            // Save cards
            await templateObject.saveCards();
            await templateObject.setCardPositions();
            $(".fullScreenSpin").css("display", "none");
        }
        if( $('.card-visibility').hasClass('dimmedChart') ){
            $('.card-visibility').removeClass('dimmedChart');
            $('.cardShowBtn').removeClass('hideelement');
        }else{
            $('.card-visibility').addClass('dimmedChart');
        }
    }, delayTimeAfterSound);
    },
<<<<<<< .merge_file_a08784
    "click .cardShowBtn": function(e){
        e.preventDefault();
        let templateObject = Template.instance();
        if( $(e.target).find('.far').hasClass('fa-eye') ){
            $(e.target).find('.far').removeClass('fa-eye')
            $(e.target).find('.far').addClass('fa-eye-slash')
            $(e.target).parents('.card-visibility').attr('card-active', 'false')
        }else{
            $(e.target).find('.far').removeClass('fa-eye-slash')
            $(e.target).find('.far').addClass('fa-eye')
            $(e.target).parents('.card-visibility').attr('card-active', 'true')
        }
    },
=======
    // "click .cardShowBtn": function(e){
    //     e.preventDefault();
    //     let templateObject = Template.instance();
    //     if( $(e.target).find('.far').hasClass('fa-eye') ){
    //         $(e.target).find('.far').removeClass('fa-eye')
    //         $(e.target).find('.far').addClass('fa-eye-slash')
    //         $(e.target).parents('.card-visibility').attr('card-active', 'false')
    //     }else{
    //         $(e.target).find('.far').removeClass('fa-eye-slash')
    //         $(e.target).find('.far').addClass('fa-eye')
    //         $(e.target).parents('.card-visibility').attr('card-active', 'true')
    //     }
    // },
>>>>>>> .merge_file_a02980
    "click .resetcards": async function(e){
        e.preventDefault();
        $(".fullScreenSpin").css("display", "block");
        let templateObject = Template.instance();
        let _tabGroup = $(".connectedCardSortable").data("tabgroup");
        let employeeId = localStorage.getItem("mySessionEmployeeLoggedID");

        const cardsApis = new ChartsApi();
        // now we have to make the post request to save the data in database
        const apiEndpoint = cardsApis.collection.findByName(
            cardsApis.collectionNames.Tvs1CardPreference
        );
        let resetCards = {
            type: "Tvs1CardPreference",
            delete: true,
            fields: {
              EmployeeID: parseInt(employeeId),
              TabGroup: _tabGroup,
            }
        }
        try {
            const ApiResponse = await apiEndpoint.fetch(null, {
              method: "POST",
              headers: ApiService.getPostHeaders(),
              body: JSON.stringify(resetCards),
            });

            if (ApiResponse.ok == true) {
                const jsonResponse = await ApiResponse.json();
                $('.cardShowBtn').addClass('hideelement');
<<<<<<< .merge_file_a08784
                $('.actionButtonCardsTop').addClass('hideelement');
                $('.editCardBtn').find('i').removeClass('fa-save')
                $('.editCardBtn').find('i').addClass('fa-cog');
                await templateObject.saveCardsLocalDB();
                await templateObject.setCardPositions();
                $('.card-visibility').removeClass('dimmedChart');
                $('.cardShowBtn').removeClass('hideelement');
=======
                $('.simplestart').addClass("hideelement");
                $('.actionButtonCardsTop').addClass('hideelement');
                await templateObject.saveCardsLocalDB();
                await templateObject.setCardPositions();
                $('.card-visibility').removeClass('dimmedChart');
                $('.cardSettingBtn').removeClass('hideelement');
>>>>>>> .merge_file_a02980
                $(".fullScreenSpin").css("display", "none");
            }
        } catch (error) {
            $(".fullScreenSpin").css("display", "none");
        }

    },
    "click .cancelCards": async function(e){
        playCancelAudio();
        e.preventDefault();
        let templateObject = Template.instance();
        setTimeout(async function(){
        $(".fullScreenSpin").css("display", "block");
        $('.cardShowBtn').addClass('hideelement');
<<<<<<< .merge_file_a08784
        $('.actionButtonCardsTop').addClass('hideelement');
        $('.editCardBtn').find('i').removeClass('fa-save')
        $('.editCardBtn').find('i').addClass('fa-cog');
=======
        $('.simplestart').addClass('hideelement');
        $('.actionButtonCardsTop').addClass('hideelement');
>>>>>>> .merge_file_a02980
        await templateObject.setCardPositions();
        $('.card-visibility').removeClass('dimmedChart');
        $('.cardShowBtn').removeClass('hideelement');
        $(".fullScreenSpin").css("display", "none");
        }, delayTimeAfterSound);
<<<<<<< .merge_file_a08784
    }
});
=======
        $('.cardSettingBtn').removeClass('hideelement');
    },
    // "mouseenter .chkDatatable": (e) => {
    //     console.log(e.target)
    //     let templateObject = Template.instance();
    //     if($(e.target).is(":checked"))
    //         templateObject.tooltip = "Hide";
    //     else
    //         templateObject.tooltip = "Show";
    // },
});

Template.kpiCard.events({
    "mouseenter .chkDatatable": (e) => {
        if($(e.currentTarget).is(":checked")){
            Template.instance().tooltip_text.set("Hide");
        }
        else
            Template.instance().tooltip_text.set("Show");
    },
})
Template.kpiCard.helpers({
    tooltip_text: () => {        
        return Template.instance().tooltip_text.get();
    },
})
>>>>>>> .merge_file_a02980
