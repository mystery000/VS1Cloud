import { Template } from 'meteor/templating';
import './allCardCharts.html';

Template.allCardCharts.helpers({
    create: function() {

    },
    rendered: function() {

    },
    destroyed: function() {

    },
});

Template.allCardCharts.events({
    "click .editCardBtn": async function (e) {
        playSaveAudio();
        e.preventDefault();
        let templateObject = Template.instance();
        setTimeout(async function(){
        $(".card-visibility").removeClass('hideelement');
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
});