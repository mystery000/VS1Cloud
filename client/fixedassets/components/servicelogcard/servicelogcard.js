import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FixedAssetService } from "../../fixedasset-service";
import { ServiceLogService } from "../../servicelog-service";

let fixedAssetService = new FixedAssetService();
let serviceLogService = new ServiceLogService();

Template.servicelogcard.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.fixedAssets = new ReactiveVar([]);

  templateObject.asset_code = new ReactiveVar();
  templateObject.asset_name = new ReactiveVar();
});

Template.servicelogcard.onRendered(function () {
  let templateObject = Template.instance();

  templateObject.getFixedAssetsList = function () {
    getVS1Data("TFixedAssets").then(function (dataObject) {
      if (dataObject.length == 0) {

      } else {
        let data = JSON.parse(dataObject[0].data);
        setFixedAssetsList(data);
      }
    }).catch(function (err) {
    });
  };

  // $(".fullScreenSpin").css("display", "inline-block");
  templateObject.getFixedAssetsList();

  function setFixedAssetsList(data) {
    console.log('TFxiedAssets', data);
    const dataTableList = [];
    for (const asset of data.tfixedassets) {
      const dataList = {
        id: asset.fields.ID || "",
        assetname: asset.fields.AssetName || "",
        assetcode: asset.fields.AssetCode || "",
      };
      dataTableList.push(dataList);
    }
    templateObject.fixedAssets.set(dataTableList);
  }

  $('#edtAssetCode').editableSelect();
  // $('#edtAssetCode').editableSelect().on('click.editable-select', function (e, li) {
  //   var $earch = $(this);
  //   var offset = $earch.offset();
  //   var taxRateDataName = e.target.value || '';
  //   if (taxRateDataName.replace(/\s/g, '') != '') {
  //     console.log(taxRateDataName);
  //     const fixedAssetsList = templateObject.fixedAssets.get();
  //     let lineItems = [];
  //     for (let i = 0; i < fixedAssetsList.length; i++) {
  //       if ((fixedAssetsList[i].assetcode) === taxRateDataName) {
  //         lineItems.push(fixedAssetsList[i]);
  //       }
  //     }
  //     $()
  //   }
  // });

  $("#date-input,#dtServiceDate,#dtNextServiceDate").datepicker({
    showOn: 'button',
    buttonText: 'Show Date',
    buttonImageOnly: true,
    buttonImage: '/img/imgCal2.png',
    dateFormat: 'dd/mm/yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });
});

Template.servicelogcard.events({
  "click button.btnSave": function() {
    const templateObject = Template.instance();
    let newServiceLog = {
      "type": "TServiceLog",
      "fields": {
        AssetID: '6',
        AssetCode: 'TestAsset -111',
        AssetName: 'Asset Name -tEst',
        ServiceProvider:"Lion Park Holden",
        ServiceDate:"2008-08-14 00:00:00",
        NextServiceDate:"2008-11-21 00:00:00",
        ServiceNotes:"Basic 3000 km service",
        Done:false
      }
    };
    console.log(newServiceLog);
    serviceLogService.saveServiceLog(newServiceLog);
  },
  "click button.btnBack": function() {
    FlowRouter.go('/serviceloglist');
  }
});

Template.servicelogcard.helpers({
  fixedAssets: () => {
    return Template.instance().fixedAssets.get().sort(function (a, b) {
      if (a.assetname === "NA") {
        return 1;
      } else if (b.assetname === "NA") {
        return -1;
      }
      return a.assetname.toUpperCase() > b.assetname.toUpperCase() ? 1 : -1;
    });
  },
});