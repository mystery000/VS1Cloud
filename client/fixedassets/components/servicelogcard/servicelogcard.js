import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FixedAssetService } from "../../fixedasset-service";
import { template } from "lodash";

let fixedAssetService = new FixedAssetService();

Template.servicelogcard.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.currentServiceLogID = new ReactiveVar(0);
  templateObject.fixedAssets = new ReactiveVar([]);

  templateObject.asset_id = new ReactiveVar(0);
  templateObject.asset_code = new ReactiveVar('');
  templateObject.asset_name = new ReactiveVar('');
  templateObject.asset_status = new ReactiveVar(false);
});

Template.servicelogcard.onRendered(function () {
  let templateObject = Template.instance();

  templateObject.getFixedAssetsList = function () {
    getVS1Data("TFixedAssets").then(function (dataObject) {
      if (dataObject.length == 0) {
        fixedAssetService.getTFixedAssetsList().then(function (data) {
          setFixedAssetsList(data);
        }).catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
      } else {
        let data = JSON.parse(dataObject[0].data);
        setFixedAssetsList(data);
      }
    }).catch(function (err) {
      fixedAssetService.getTFixedAssetsList().then(function (data) {
        setFixedAssetsList(data);
      }).catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
      });
    });
  };

  // $(".fullScreenSpin").css("display", "inline-block");
  templateObject.getFixedAssetsList();

  function setFixedAssetsList(data) {
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
    templateObject.fixedAssets.get().forEach((asset, index) => {
      $('#edtAssetCode').editableSelect('add', function(){
        $(this).val(index);
        $(this).text(asset.assetcode);
      });
    });
    $('#edtAssetCode').editableSelect();
  }

  $('#edtAssetCode').editableSelect();
  $('#edtAssetCode').editableSelect()
  .on('select.editable-select', function (e, li) {
    if (li) {
      const index = parseInt(li.val() || -1);
      if (index >= 0) {
        const assetsList = templateObject.fixedAssets.get();
        templateObject.asset_id.set(assetsList[index].id);
        templateObject.asset_code.set(assetsList[index].assetcode);
        templateObject.asset_name.set(assetsList[index].assetname);
      }
    }
  });

  let cServiceID = parseInt(FlowRouter.current().queryParams.id || '0');
  templateObject.currentServiceLogID.set(cServiceID);

  if (cServiceID > 0) {
    fixedAssetService.getServiceLogDetail(cServiceID).then((data) => {
      const serviceData = data.tserviceloglist;
      if (serviceData.length > 0) {
        const recordInfo = serviceData[0];
        templateObject.asset_id.set(recordInfo.AssetID);
        templateObject.asset_code.set(recordInfo.AssetCode);
        $("#edtAssetCode").val(recordInfo.AssetCode);
        templateObject.asset_name.set(recordInfo.AssetName);
        $("#edtAssetName").val(recordInfo.AssetName);

        $("#edtServiceProvider").val(recordInfo.ServiceProvider);
        // ServiceType: $("#edtServiceProvider").val(),
        $("#dtServiceDate").val(getDatePickerForm(recordInfo.ServiceDate));
        $("#dtNextServiceDate").val(getDatePickerForm(recordInfo.NextServiceDate));
        $('#edtHours').val(recordInfo.HoursForNextService);
        $('#edtKms').val(recordInfo.KmsForNextService);
        $("#txtServiceNotes").val(recordInfo.ServiceNotes);
        if(recordInfo.Done) {
          $("#chkDone").trigger("click");
        }

      }
    });
  }

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

  function getDatePickerForm(dateStr) {
    const date = new Date(dateStr);
    let year = date.getFullYear();
    let month = date.getMonth() < 9 ? '0'+(date.getMonth()+1) : (date.getMonth()+1);
    let day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
    if (year && month && day)
      return day+"/"+month+"/"+year;
    else
      return '';
  }
});

Template.servicelogcard.events({
  "click button.btnSave": function() {
    const templateObject = Template.instance();
    let newServiceLog = {
      "type": "TServiceLog",
      "fields": {
        AssetID: templateObject.asset_id.get(),
        AssetCode: templateObject.asset_code.get(),
        AssetName: templateObject.asset_name.get(),
        ServiceProvider: $("#edtServiceProvider").val(),
        // ServiceType: $("#edtServiceProvider").val(),
        ServiceDate: getDateStr($("#dtServiceDate").datepicker("getDate")),
        NextServiceDate: getDateStr($("#dtNextServiceDate").datepicker("getDate")),
        HoursForNextService: parseInt($('#edtHours').val()) || 0,
        KmsForNextService: parseInt($('#edtKms').val()) || 0,
        ServiceNotes: $("#txtServiceNotes").val(),
        Done: templateObject.asset_status.get()
      }
    };

    function getDateStr(dateVal) {
      if (!dateVal)
        return '';
      const dateObj = new Date(dateVal);
      var hh = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
      var min = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
      var ss = dateObj.getSeconds() < 10 ? "0" + dateObj.getSeconds() : dateObj.getSeconds();
      return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate() + " " + hh + ":" + min + ":" + ss;
    };

    if (templateObject.currentServiceLogID.get() == 0) {
      fixedAssetService.saveServiceLog(newServiceLog).then((data) => {
        fixedAssetService.getServiceLogList().then(function (data) {
          addVS1Data("TServiceLogList", JSON.stringify(data));
        });
        FlowRouter.go('/serviceloglist');
      }).catch((err) => {
      });
    } else {
      newServiceLog.fields['ServiceID'] = templateObject.currentServiceLogID.get();
      fixedAssetService.saveServiceLog(newServiceLog).then((data) => {
        fixedAssetService.getServiceLogList().then(function (data) {
          addVS1Data("TServiceLogList", JSON.stringify(data));
        });
        FlowRouter.go('/serviceloglist');
      }).catch((err) => {
      });
    }
  },
  "click input#chkDone": function() {
    const templateObject = Template.instance();
    templateObject.asset_status.set(!templateObject.asset_status.get());
  },
  "click button.btnBack": function() {
    FlowRouter.go('/serviceloglist');
  }
});

Template.servicelogcard.helpers({
  assetName: () => {
    return Template.instance().asset_name.get();
  }
});
