import { ReactiveVar } from "meteor/reactive-var";
import ChartsApi from "../../js/Api/ChartsApi";
import draggableCharts from "../../js/Charts/draggableCharts";
import ChartHandler from "../../js/Charts/ChartHandler";
import Tvs1CardPreference from "../../js/Api/Model/Tvs1CardPreference";
import Tvs1CardPreferenceFields from "../../js/Api/Model/Tvs1CardPreferenceFields";
import ApiService from "../../js/Api/Module/ApiService";
import '../../lib/global/indexdbstorage.js';

import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import './allCardsLists.html';

const employeeId = localStorage.getItem("mySessionEmployeeLoggedID");
let _chartGroup = "";
let _tabGroup = 0;

Template.allCardsLists.onRendered(function () {
    _tabGroup = $(".connectedCardSortable").data("tabgroup");
    _chartGroup = $(".connectedCardSortable").data("chartgroup");
    const templateObject = Template.instance();

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
        setTimeout(async function () {
            $('.card-visibility').addClass('hideelement')
            let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
            let cardList = [];
            let employeeID = localStorage.getItem("mySessionEmployeeLoggedID");
            if (Tvs1CardPref.length == 0) {
                await templateObject.saveCardsLocalDB();
            }
            if (Tvs1CardPref.length > 0) {
                let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
                cardList = Tvs1CardPreference.fromList(
                    Tvs1CardPreferenceData.tvs1cardpreference
                ).filter((card) => {
                    if (parseInt(card.fields.EmployeeID) == employeeID && parseInt(card.fields.TabGroup) == _tabGroup) {
                        return card;
                    }
                });
            }

            if (cardList.length > 0) {
                cardList.forEach((card) => {
                    $(`[card-key='${card.fields.CardKey}']`).attr("position", card.fields.Position);
                    $(`[card-key='${card.fields.CardKey}']`).attr("card-id", card.fields.ID);
                    $(`[card-key='${card.fields.CardKey}']`).attr("card-active", card.fields.Active);
                    if (card.fields.Active == false) {
                        $(`[card-key='${card.fields.CardKey}']`).addClass("hideelement");
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowOption').prop('checked', false);                        
                    } else {
                        $(`[card-key='${card.fields.CardKey}']`).removeClass("hideelement");
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowOption').prop('checked', true);
                    }
                });
                let $chartWrappper = $(".connectedCardSortable");
                $chartWrappper
                    .find(".card-visibility")
                    .sort(function (a, b) {
                        return +a.getAttribute("position") - +b.getAttribute("position");
                    })
                    .appendTo($chartWrappper);
            } else {
                // Set default cards list
                $('.card-visibility').each(function () {
                    $(this).find('.cardShowOption').prop('checked', true);
                    let position = $(this).data('default-position');
                    $(this).attr('position', position);                    
                    $(this).attr("card-active", false);
                })
                $(`[chartgroup='${_chartGroup}']`).attr("card-active", true);
                $(`[chartgroup='${_chartGroup}']`).removeClass('hideelement');               
            }
        }, 0);
    };
    templateObject.setCardPositions();

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

    templateObject.saveCards = async () => {
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
            cardList.push(
                new Tvs1CardPreference({
                    type: "Tvs1CardPreference",
                    fields: new Tvs1CardPreferenceFields({
                        ID: parseInt($(cards[i]).attr("card-id")),
                        EmployeeID: parseInt(localStorage.getItem("mySessionEmployeeLoggedID")),
                        CardKey: $(cards[i]).attr("card-key"),
                        Position: parseInt($(cards[i]).attr("position")),
                        TabGroup: parseInt(_tabGroup),
                        Active: ($(cards[i]).attr("card-active") == 'true') ? true : false
                    })
                })
            );
        }
        if (cardList) {

            let cardJSON = {
                type: "Tvs1CardPreference",
                objects: cardList
            };

            try {
                const ApiResponse = await apiEndpoint.fetch(null, {
                    method: "POST",
                    headers: ApiService.getPostHeaders(),
                    body: JSON.stringify(cardJSON),
                });

                if (ApiResponse.ok == true) {                    
                    await templateObject.saveCardsLocalDB();
                }
            } catch (error) {
                $(".fullScreenSpin").css("display", "none");
            }
        }
        $(".fullScreenSpin").css("display", "none");
    };
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
            // $(".actionButtonCardsTop").removeClass("hideelement");
        // }
    },
    "change .cardShowOption": function (e) {
        e.preventDefault();
        if ($(e.target).prop(checked)) {            
            $(e.target).parents('.card-visibility').attr('card-active', false)
        } else {
            $(e.target).parents('.card-visibility').attr('card-active', true)
        }
    },
    "click .saveCards": async function (e) {
        e.preventDefault();
        let templateObject = Template.instance();
        setTimeout(async function () {
            await templateObject.saveCards();
            $('.card-visibility').removeClass('dimmedChart');
            $(".cardSettingBtn").removeClass("hideelement");
            $(".cardEditOptions").addClass("hideelement");
            // $('.actionButtonCardsTop').addClass('hideelement');
            $(".card-visibility").addClass('hideelement');
            let cards = $(".card-visibility");
            $.each(cards, function (i, card) {
                if ($(card).attr("card-active") == 'true') $(card).removeClass("hideelement");
            });
        }, 0);
    },
    "click .resetCards": async function (e) {
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
                // $('.cardShowBtn').addClass('hideelement');
                // $('.actionButtonCardsTop').addClass('hideelement');
                // $('.cardSettingBtn').find('i').removeClass('fa-save')
                // $('.cardSettingBtn').find('i').addClass('fa-cog');
                await templateObject.saveCardsLocalDB();
                await templateObject.setCardPositions();
                $('.card-visibility').removeClass('dimmedChart');                
                $(".cardEditOptions").addClass("hideelement");
                $(".cardSettingBtn").removeClass("hideelement");
                $(".fullScreenSpin").css("display", "none");
            }
        } catch (error) {
            $(".fullScreenSpin").css("display", "none");
        }

    },
    "click .cancelCards": async function (e) {
        // playCancelAudio();
        e.preventDefault();
        let templateObject = Template.instance();
        setTimeout(async function () {
            $(".fullScreenSpin").css("display", "block");            
            // $('.actionButtonCardsTop').addClass('hideelement');
            // $('.cardSettingBtn').find('i').removeClass('fa-save')
            // $('.cardSettingBtn').find('i').addClass('fa-cog');
            await templateObject.setCardPositions();
            $('.card-visibility').removeClass('dimmedChart');
            $(".cardEditOptions").addClass("hideelement");
            $(".cardSettingBtn").removeClass("hideelement");            
            $(".fullScreenSpin").css("display", "none");
        });
    }
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
