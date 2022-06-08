import { ReactiveVar } from "meteor/reactive-var";
import draggableCharts from "../../js/Charts/draggableCharts";
import ChartHandler from "../../js/Charts/ChartHandler";
import Tvs1CardPreference from "../../js/Api/Model/Tvs1CardPreference";
import Tvs1CardPreferenceFields from "../../js/Api/Model/Tvs1CardPreferenceFields";

const employeeId = Session.get("mySessionEmployeeLoggedID");
const _chartGroup = "";
const _tabGroup = 0;

Template.allCardsLists.onRendered(function () {
    _tabGroup = $(".connectedCardSortable").data("tabgroup");
    _chartGroup = $(".connectedCardSortable").data("chartgroup");
    const templateObject = Template.instance();

    templateObject.deactivateDraggable = () => {
        draggableCharts.disable();
    };
    templateObject.activateDraggable = () => {
        draggableCharts.enable();
    };

    templateObject.setCardPositions = async () => {
        $(".fullScreenSpin").css("display", "block");
        setTimeout(async function(){
            $('.card-visibility').addClass('hideelement')
            let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
            const cardList = [];
            if( Tvs1CardPref.length ){
                let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
                let employeeID = Session.get("mySessionEmployeeLoggedID");
                cardList = new Tvs1CardPreference.fromList(
                    Tvs1CardPreferenceData.tvs1cardpreference
                ).filter((card) => {
                    if ( parseInt( card.fields.EmployeeID ) == employeeID && parseInt( card.fields.TabGroup ) == _tabGroup ) {
                        return card;
                    }
                });
            }

            if( cardList.length > 0 ){
                cardList.forEach((card) => {
                    $(`[card-key='${card.fields.CardKey}']`).attr("position", card.fields.Position);
                    $(`[card-key='${card.fields.CardKey}']`).attr("card-active", card.fields.Active);
                    if( card.fields.Active == false ){
                        $(`[card-key='${card.fields.CardKey}']`).addClass("hideelement");
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').removeClass('fa-eye');
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').addClass('fa-eye-slash');
                    }else{
                        $(`[card-key='${card.fields.CardKey}']`).removeClass("hideelement");
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').removeClass('fa-eye-slash');
                        $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').addClass('fa-eye');
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
                    $(this).find('.cardShowBtn .far').addClass('fa-eye-slash');
                    $(this).attr("card-active", 'false');
                })
                $(`[chartgroup='${_chartGroup}']`).attr("card-active", 'true');
                $(`[chartgroup='${_chartGroup}']`).removeClass('hideelement');
                $(`[chartgroup='${_chartGroup}']`).find('.cardShowBtn .far').removeClass('fa-eye-slash');
                $(`[chartgroup='${_chartGroup}']`).find('.cardShowBtn .far').addClass('fa-eye');
            }
            $(".fullScreenSpin").css("display", "none");
        }, 500);
    };
    templateObject.setCardPositions();

    templateObject.saveCards = async () => {
        $(".fullScreenSpin").css("display", "block");
        // Here we get that list and create and object
        const cards = $(".connectedCardSortable .card-visibility");
        const cardList = [];
        let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
        if( Tvs1CardPref.length ){
            let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
            let employeeID = Session.get("mySessionEmployeeLoggedID");
            cardList = new Tvs1CardPreference.fromList(
                Tvs1CardPreferenceData.tvs1cardpreference
            ).filter((card) => {
                if ( parseInt( card.fields.EmployeeID ) != employeeID && parseInt( card.fields.TabGroup ) != _tabGroup ) {
                    return card;
                }
            });
        }
        // console.log(cards);
        for (let i = 0; i < cards.length; i++) {
            cardList.push(
                new Tvs1CardPreference({
                    type: "Tvs1CardPreference",
                    fields: new Tvs1CardPreferenceFields({
                        EmployeeID: Session.get("mySessionEmployeeLoggedID"),
                        CardKey: $(cards[i]).attr("card-key"),
                        Position: $(cards[i]).attr("position"),
                        TabGroup: _tabGroup,
                        Active: ( $(cards[i]).attr("card-active") == 'true' )? true : false
                    })
                })
            );
        }
        let updatedTvs1CardPreference = {
            tvs1cardpreference: cardList,
        }
        await addVS1Data('Tvs1CardPreference', JSON.stringify(updatedTvs1CardPreference));
        $(".fullScreenSpin").css("display", "none");
    };

    $(".connectedCardSortable")
    .sortable({
      disabled: false,
      connectWith: ".connectedCardSortable",
      placeholder: "portlet-placeholder ui-corner-all",
      stop: async (event, ui) => {
        // console.log($(ui.item[0]));
        console.log("Dropped the sortable chart");

        // Here we rebuild positions tree in html
        ChartHandler.buildCardPositions(
          $(".connectedCardSortable .card-visibility")
        );
        // Here we save card list
        templateObject.saveCards()
      },
    })
    .disableSelection(); 
});

Template.allCardsLists.events({
    "click .editCardBtn": async function (e) {
        e.preventDefault();
        let templateObject = Template.instance();
        $(".card-visibility").removeClass('hideelement');
        if( $('.editCardBtn').find('i').hasClass('fa-cog') ){
            $('.cardShowBtn').removeClass('hideelement');
            $('.editCardBtn').find('i').removeClass('fa-cog')
            $('.editCardBtn').find('i').addClass('fa-save')      
        }else{
            $(".fullScreenSpin").css("display", "block");
            $('.cardShowBtn').addClass('hideelement');
            $('.editCardBtn').find('i').removeClass('fa-save')
            $('.editCardBtn').find('i').addClass('fa-cog');
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
        return false
    },
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
        return false
    },
});