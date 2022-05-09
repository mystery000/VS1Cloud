import '../lib/global/indexdbstorage.js';
import draggableCharts from "../js/Charts/draggableCharts";
import ChartHandler from "../js/Charts/ChartHandler";
import Tvs1CardPreference from "../js/Api/Model/Tvs1CardPreference";
import Tvs1CardPreferenceFields from "../js/Api/Model/Tvs1CardPreferenceFields";
const _tabGroup = 9;

Template.crmoverview.onCreated(function () {

  let templateObject = Template.instance();
  templateObject.crmtaskmitem = new ReactiveVar('all');
});

Template.crmoverview.onRendered(function () {
  const templateObject = Template.instance();
  let currentId = FlowRouter.current().queryParams.id;
  currentId = currentId ? currentId : 'all';
  templateObject.crmtaskmitem.set(currentId);

  templateObject.deactivateDraggable = () => {
    draggableCharts.disable();
  };
  templateObject.activateDraggable = () => {
    draggableCharts.enable();
  };

  templateObject.setCardPositions = async () => {
    let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
    const cardList = [];
    if (Tvs1CardPref.length) {
      let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
      let employeeID = Session.get("mySessionEmployeeLoggedID");
      cardList = new Tvs1CardPreference.fromList(
        Tvs1CardPreferenceData.tvs1cardpreference
      ).filter((card) => {
        if (parseInt(card.fields.EmployeeID) == employeeID && parseInt(card.fields.TabGroup) == _tabGroup) {
          return card;
        }
      });
    }

    if (cardList.length) {
      let cardcount = 0;
      cardList.forEach((card) => {
        $(`[card-key='${card.fields.CardKey}']`).attr("position", card.fields.Position);
        $(`[card-key='${card.fields.CardKey}']`).attr("card-active", card.fields.Active);
        if (card.fields.Active == false) {
          cardcount++;
          $(`[card-key='${card.fields.CardKey}']`).addClass("hideelement");
          $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').removeClass('fa-eye');
          $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').addClass('fa-eye-slash');
        }
      })
      if (cardcount == cardList.length) {
        $('.card-visibility').eq(0).removeClass('hideelement')
      }
      let $chartWrappper = $(".connectedCardSortable");
      $chartWrappper
        .find(".card-visibility")
        .sort(function (a, b) {
          return +a.getAttribute("position") - +b.getAttribute("position");
        })
        .appendTo($chartWrappper);
    }
  };
  templateObject.setCardPositions();

  templateObject.saveCards = async () => {
    // Here we get that list and create and object
    const cards = $(".connectedCardSortable .card-visibility");
    const cardList = [];
    let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
    if (Tvs1CardPref.length) {
      let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
      let employeeID = Session.get("mySessionEmployeeLoggedID");
      cardList = new Tvs1CardPreference.fromList(
        Tvs1CardPreferenceData.tvs1cardpreference
      ).filter((card) => {
        if (parseInt(card.fields.EmployeeID) != employeeID && parseInt(card.fields.TabGroup) != _tabGroup) {
          return card;
        }
      });
    }
    for (let i = 0; i < cards.length; i++) {
      cardList.push(
        new Tvs1CardPreference({
          type: "Tvs1CardPreference",
          fields: new Tvs1CardPreferenceFields({
            EmployeeID: Session.get("mySessionEmployeeLoggedID"),
            CardKey: $(cards[i]).attr("card-key"),
            Position: $(cards[i]).attr("position"),
            TabGroup: _tabGroup,
            Active: ($(cards[i]).attr("card-active") == 'true') ? true : false
          })
        })
      );
    }
    let updatedTvs1CardPreference = {
      tvs1cardpreference: cardList,
    }
    await addVS1Data('Tvs1CardPreference', JSON.stringify(updatedTvs1CardPreference));
  };

  templateObject.activateDraggable();
  $(".connectedCardSortable")
    .sortable({
      disabled: false,
      connectWith: ".connectedCardSortable",
      placeholder: "portlet-placeholder ui-corner-all",
      stop: async (event, ui) => {
        // Here we rebuild positions tree in html
        ChartHandler.buildCardPositions(
          $(".connectedCardSortable .card-visibility")
        );

        // Here we save card list
        templateObject.saveCards()
      },
    })
    .disableSelection();


  $(".task_items_wrapper").sortable({
    handle: '.taskDrag',
    update: function (event, ui) {
      var sorted = $("#task_items_wrapper").sortable("serialize", { key: "sort" });
      var sortedIDs = $("#task_items_wrapper").sortable("toArray");

      let current_id = ui.item[0].id;
      let prev_id = ui.item[0].previousElementSibling.id;
      let next_id = ui.item[0].nextElementSibling.id;
    },
  });
});

Template.crmoverview.events({
  "click #btnTaskList": function (event) {
    FlowRouter.go("/tasklist");
  },
  "click .editCardBtn": function (e) {
    e.preventDefault();
    $(".card-visibility").removeClass('hideelement');
    if ($('.editCardBtn').find('i').hasClass('fa-cog')) {
      $('.cardShowBtn').removeClass('hideelement');
      $('.editCardBtn').find('i').removeClass('fa-cog')
      $('.editCardBtn').find('i').addClass('fa-save')
    } else {
      $('.cardShowBtn').addClass('hideelement');
      $('.editCardBtn').find('i').removeClass('fa-save')
      $('.editCardBtn').find('i').addClass('fa-cog')
      let templateObject = Template.instance();
      templateObject.setCardPositions();
    }
    if ($('.card-visibility').hasClass('dimmedChart')) {
      $('.card-visibility').removeClass('dimmedChart');
    } else {
      $('.card-visibility').addClass('dimmedChart');
    }
    return false
  },
  "click .cardShowBtn": function (e) {
    e.preventDefault();
    if ($(e.target).find('.far').hasClass('fa-eye')) {
      $(e.target).find('.far').removeClass('fa-eye')
      $(e.target).find('.far').addClass('fa-eye-slash')
      $(e.target).parents('.card-visibility').attr('card-active', 'false')
    } else {
      $(e.target).find('.far').removeClass('fa-eye-slash')
      $(e.target).find('.far').addClass('fa-eye')
      $(e.target).parents('.card-visibility').attr('card-active', 'true')
    }
    let templateObject = Template.instance();
    templateObject.saveCards()
    return false
  },


  'click .menuTasklist': function (e) {
    Template.instance().crmtaskmitem.set('all');
  },

  'click .menuTasktoday': function (e) {
    Template.instance().crmtaskmitem.set('today');
  },

  'click .menuTaskupcoming': function (e) {
    Template.instance().crmtaskmitem.set('upcoming');
  },
});

Template.crmoverview.helpers({
  crmtaskmitem: () => {
    return Template.instance().crmtaskmitem.get();
  },
  isAllTasks: () => {
    return Template.instance().crmtaskmitem.get() === 'all';
  },
  isTaskToday: () => {
    return Template.instance().crmtaskmitem.get() === 'today';
  },
  isTaskUpcoming: () => {
    return Template.instance().crmtaskmitem.get() === 'upcoming';
  },
});
