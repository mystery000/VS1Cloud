import { BaseService } from "../js/base-service.js";
import ChartHandler from "../js/Charts/ChartHandler";
import ChartsApi from "../js/Api/ChartsApi";
import Tvs1CardPreference from "../js/Api/Model/Tvs1CardPreference";
import Tvs1CardPreferenceFields from "../js/Api/Model/Tvs1CardPreferenceFields";
import ApiService from "../js/Api/Module/ApiService";

export class CardService extends BaseService {
  async saveCardsLocalDB() {
    const cardsApis = new ChartsApi();
    let employeeID = localStorage.getItem("mySessionEmployeeLoggedID");
    const cardPreferencesEndpoint = cardsApis.collection.findByName(
      cardsApis.collectionNames.Tvs1CardPreference
    );
    cardPreferencesEndpoint.url.searchParams.append("ListType", "'Detail'");
    cardPreferencesEndpoint.url.searchParams.append(
      "select",
      `[EmployeeID]=${employeeID}`
    );
    const cardPreferencesEndpointResponse =
      await cardPreferencesEndpoint.fetch(); // here i should get from database all charts to be displayed

    if (cardPreferencesEndpointResponse.ok == true) {
      const cardPreferencesEndpointJsonResponse =
        await cardPreferencesEndpointResponse.json();
      await addVS1Data(
        "Tvs1CardPreference",
        JSON.stringify(cardPreferencesEndpointJsonResponse)
      );
      return cardPreferencesEndpointJsonResponse;
    }
  }

  async setCardPositions() {
    $(".card-visibility").addClass("hideelement");
    let Tvs1CardPref = await getVS1Data("Tvs1CardPreference");
    let cardList = [];
    let employeeID = localStorage.getItem("mySessionEmployeeLoggedID");
    let Tvs1CardPreferenceData;
    if (Tvs1CardPref.length == 0) {
      Tvs1CardPreferenceData = await this.saveCardsLocalDB();
    } else {
      Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
    }
    if (Tvs1CardPreferenceData) {
      cardList = Tvs1CardPreference.fromList(
        Tvs1CardPreferenceData.tvs1cardpreference
      ).filter((card) => {
        if (
          parseInt(card.fields.EmployeeID) == employeeID &&
          parseInt(card.fields.TabGroup) == $(".connectedCardSortable").data("tabgroup")
        ) {
          return card;
        }
      });
    }

    if (cardList.length > 0) {
      cardList.forEach((card) => {
        $(`[card-key='${card.fields.CardKey}']`).attr(
          "position",
          card.fields.Position
        );
        $(`[card-key='${card.fields.CardKey}']`).attr(
          "card-id",
          card.fields.ID
        );        
        if (card.fields.Active == false) {
          $(`[card-key='${card.fields.CardKey}']`).addClass("hideelement");
          $(`[card-key='${card.fields.CardKey}']`)
            .find(".cardShowOption")
            .prop("checked", false);
        } else {
          $(`[card-key='${card.fields.CardKey}']`).removeClass("hideelement");
          $(`[card-key='${card.fields.CardKey}']`)
            .find(".cardShowOption")
            .prop("checked", true);
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
      $(".card-visibility").each(function () {
        $(this).find(".cardShowOption").prop("checked", true);
        let position = $(this).data("default-position");
        $(this).attr("position", position);        
      });      
      $(`[chartgroup='${$(".connectedCardSortable").data("chartgroup")}']`).removeClass("hideelement");
    }
  }

  async saveCards() {
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
            EmployeeID: parseInt(
              localStorage.getItem("mySessionEmployeeLoggedID")
            ),
            CardKey: $(cards[i]).attr("card-key"),
            Position: parseInt($(cards[i]).attr("position")),
            TabGroup: parseInt($(".connectedCardSortable").data("tabgroup")),
            Active: $(cards[i]).find(".cardShowOption").prop("checked") ? true : false,
          }),
        })
      );
    }
    if (cardList) {
      let cardJSON = {
        type: "Tvs1CardPreference",
        objects: cardList,
      };
      try {
        const ApiResponse = await apiEndpoint.fetch(null, {
          method: "POST",
          headers: ApiService.getPostHeaders(),
          body: JSON.stringify(cardJSON),
        });

        if (ApiResponse.ok == true) {
          await clearData("Tvs1CardPreference");
        }
      } catch (error) {
        $(".fullScreenSpin").css("display", "none");
      }
    }
    $(".card-visibility").removeClass("dimmedChart");
    $(".cardSettingBtn").removeClass("hideelement");
    $(".cardEditOptions").addClass("hideelement");
    $(".actionButtonsTop").addClass("hideelement");
    $(".card-visibility").addClass("hideelement");
    $.each(cards, function (i, card) {
      if ($(card).find(".cardShowOption").prop("checked"))
        $(card).removeClass("hideelement");
    });
    $(".fullScreenSpin").css("display", "none");
  }

  async resetCards() {
    $(".fullScreenSpin").css("display", "block");    
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
        TabGroup: $(".connectedCardSortable").data("tabgroup"),
      },
    };
    try {
      const ApiResponse = await apiEndpoint.fetch(null, {
        method: "POST",
        headers: ApiService.getPostHeaders(),
        body: JSON.stringify(resetCards),
      });

      if (ApiResponse.ok == true) {
        const jsonResponse = await ApiResponse.json();
        // $('.cardShowBtn').addClass('hideelement');
        $(".actionButtonsTop").addClass("hideelement");
        // $('.cardSettingBtn').find('i').removeClass('fa-save')
        // $('.cardSettingBtn').find('i').addClass('fa-cog');
        await this.saveCardsLocalDB();
        await this.setCardPositions();
        $(".card-visibility").removeClass("dimmedChart");
        $(".cardEditOptions").addClass("hideelement");
        $(".cardSettingBtn").removeClass("hideelement");
        $(".fullScreenSpin").css("display", "none");
      }
    } catch (error) {
      $(".fullScreenSpin").css("display", "none");
    }
  }

  async cancelCards() {
    $(".fullScreenSpin").css("display", "block");
    $(".actionButtonsTop").addClass("hideelement");
    // $('.cardSettingBtn').find('i').removeClass('fa-save')
    // $('.cardSettingBtn').find('i').addClass('fa-cog');
    await this.setCardPositions();
    $(".card-visibility").removeClass("dimmedChart");
    $(".cardEditOptions").addClass("hideelement");
    $(".cardSettingBtn").removeClass("hideelement");
    $(".fullScreenSpin").css("display", "none");
  }
}
