import { TaxRateService } from "../../settings/settings-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../js/sidebar-service";
import "../../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();

Template.CurrencyWidget.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.currencyData = new ReactiveVar();
});

Template.CurrencyWidget.onRendered(function () {
  console.log("Currency widget");
  // console.log($(this));
  // console.log($(".currencyModal"));
  // console.log($(".newCurrencyModal"));

  //   $("#sltCurrency")
  //     .editableSelect()
  //     .on("click.editable-select", function (e, li) {
  //       var $earch = $(this);
  //       var offset = $earch.offset();
  //       var currencyDataName = e.target.value || "";
  //       $("#edtCurrencyID").val("");
  //       if (e.pageX > offset.left + $earch.width() - 8) {
  //         // X button 16px wide?
  //         $("#currencyModal").modal("toggle");
  //       } else {
  //         if (currencyDataName.replace(/\s/g, "") != "") {
  //           $("#add-currency-title").text("Edit Currency");
  //           $("#sedtCountry").prop("readonly", true);
  //           getVS1Data("TCurrency")
  //             .then(function (dataObject) {
  //               if (dataObject.length == 0) {
  //                 $(".fullScreenSpin").css("display", "inline-block");
  //                 sideBarService.getCurrencies().then(function (data) {
  //                   for (let i in data.tcurrency) {
  //                     if (data.tcurrency[i].Code === currencyDataName) {
  //                       $("#edtCurrencyID").val(data.tcurrency[i].Id);
  //                       setTimeout(function () {
  //                         $("#sedtCountry").val(data.tcurrency[i].Country);
  //                       }, 200);
  //                       //$('#sedtCountry').val(data.tcurrency[i].Country);
  //                       $("#currencyCode").val(currencyDataName);
  //                       $("#currencySymbol").val(
  //                         data.tcurrency[i].CurrencySymbol
  //                       );
  //                       $("#edtCurrencyName").val(data.tcurrency[i].Currency);
  //                       $("#edtCurrencyDesc").val(data.tcurrency[i].CurrencyDesc);
  //                       $("#edtBuyRate").val(data.tcurrency[i].BuyRate);
  //                       $("#edtSellRate").val(data.tcurrency[i].SellRate);
  //                     }
  //                   }
  //                   setTimeout(function () {
  //                     $(".fullScreenSpin").css("display", "none");
  //                     $("#newCurrencyModal").modal("toggle");
  //                     $("#sedtCountry").attr("readonly", true);
  //                   }, 200);
  //                 });
  //               } else {
  //                 let data = JSON.parse(dataObject[0].data);
  //                 let useData = data.tcurrency;
  //                 for (let i = 0; i < data.tcurrency.length; i++) {
  //                   if (data.tcurrency[i].Code === currencyDataName) {
  //                     $("#edtCurrencyID").val(data.tcurrency[i].Id);
  //                     $("#sedtCountry").val(data.tcurrency[i].Country);
  //                     $("#currencyCode").val(currencyDataName);
  //                     $("#currencySymbol").val(data.tcurrency[i].CurrencySymbol);
  //                     $("#edtCurrencyName").val(data.tcurrency[i].Currency);
  //                     $("#edtCurrencyDesc").val(data.tcurrency[i].CurrencyDesc);
  //                     $("#edtBuyRate").val(data.tcurrency[i].BuyRate);
  //                     $("#edtSellRate").val(data.tcurrency[i].SellRate);
  //                   }
  //                 }
  //                 setTimeout(function () {
  //                   $(".fullScreenSpin").css("display", "none");
  //                   $("#newCurrencyModal").modal("toggle");
  //                 }, 200);
  //               }
  //             })
  //             .catch(function (err) {
  //               $(".fullScreenSpin").css("display", "inline-block");
  //               sideBarService.getCurrencies().then(function (data) {
  //                 for (let i in data.tcurrency) {
  //                   if (data.tcurrency[i].Code === currencyDataName) {
  //                     $("#edtCurrencyID").val(data.tcurrency[i].Id);
  //                     setTimeout(function () {
  //                       $("#sedtCountry").val(data.tcurrency[i].Country);
  //                     }, 200);
  //                     //$('#sedtCountry').val(data.tcurrency[i].Country);
  //                     $("#currencyCode").val(currencyDataName);
  //                     $("#currencySymbol").val(data.tcurrency[i].CurrencySymbol);
  //                     $("#edtCurrencyName").val(data.tcurrency[i].Currency);
  //                     $("#edtCurrencyDesc").val(data.tcurrency[i].CurrencyDesc);
  //                     $("#edtBuyRate").val(data.tcurrency[i].BuyRate);
  //                     $("#edtSellRate").val(data.tcurrency[i].SellRate);
  //                   }
  //                 }
  //                 setTimeout(function () {
  //                   $(".fullScreenSpin").css("display", "none");
  //                   $("#newCurrencyModal").modal("toggle");
  //                   $("#sedtCountry").attr("readonly", true);
  //                 }, 200);
  //               });
  //             });
  //         } else {
  //           $("#currencyModal").modal();
  //           setTimeout(function () {
  //             $("#tblCurrencyPopList_filter .form-control-sm").focus();
  //             $("#tblCurrencyPopList_filter .form-control-sm").val("");
  //             $("#tblCurrencyPopList_filter .form-control-sm").trigger("input");
  //             var datatable = $("#tblCurrencyPopList").DataTable();
  //             datatable.draw();
  //             $("#tblCurrencyPopList_filter .form-control-sm").trigger("input");
  //           }, 500);
  //         }
  //       }
  //     });
});

Template.CurrencyWidget.events({
  "click #sltCurrency": (event) => {
    $("#currencyModal").modal("toggle");
  },
  "click #tblCurrencyPopList tbody tr": (e) => {
    console.log("currency clicked");

    const rateType = $(".currency-js").attr("type"); // String "buy" | "sell"

    const currencyCode = $(e.currentTarget).find(".colCode").text();
    const currencyRate =
      rateType == "buy"
        ? $(e.currentTarget).find(".colBuyRate").text()
        : $(e.currentTarget).find(".colSellRate").text();

    $("#sltCurrency").val(currencyCode);
    $("#sltCurrency").trigger("change");
    $("#exchange_rate").val(currencyRate);
    $("#exchange_rate").trigger("change");
    $("#currencyModal").modal("toggle");

    $("#tblCurrencyPopList_filter .form-control-sm").val("");

    setTimeout(function () {
      $(".btnRefreshCurrency").trigger("click");
      $(".fullScreenSpin").css("display", "none");
    }, 1000);
  },
});

Template.CurrencyWidget.helpers({
  isCurrencyEnable: () => {
    return Session.get("CloudUseForeignLicence");
  },
});
