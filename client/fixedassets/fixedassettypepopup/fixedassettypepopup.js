import "../../lib/global/indexdbstorage.js";
import { FixedAssetService } from "../fixedasset-service.js";

let fixedAssetService = new FixedAssetService();

Template.fixedassettypepopup.onCreated(function () {
  const templateObject = Template.instance();
});

Template.fixedassettypepopup.onRendered(function () {
});

Template.fixedassettypepopup.events({
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },
  "click button#btnNewAssetType": () => {
    $('div#createAssetType').modal('show');
  },
  "click button#btnCreateAssetType": () => {
    const templateObject = Template.instance();
    let newAssetType = {
      "type":"TFixedAssetType",
      "fields": {
        AssetTypeCode: $('input#edtAssetTypeCode').val(),
        AssetTypeName: $('input#edtAssetTypeName').val(),
        Notes: $('input#edtAssetTypeDescription').val()
      }
    }
    fixedAssetService.saveTFixedAssetType(newAssetType).then((data) => {
      fixedAssetService.getFixedAssetTypes().then(function (data) {
        addVS1Data('TFixedAssetType', JSON.stringify(data));
      }).catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
      });
      $("div#createAssetType").modal('hide');
      $("div#fixedassettypepopup").modal('hide');
    })
  }
});