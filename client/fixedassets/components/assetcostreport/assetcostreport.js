import { ReactiveVar } from "meteor/reactive-var";
import { FixedAssetService } from "../../fixedasset-service";
import { SideBarService } from "../../../js/sidebar-service";
import { UtilityService } from "../../../utility-service";
import "../../../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let fixedAssetService = new FixedAssetService();

Template.assetcostreport.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
});

Template.assetcostreport.onRendered(function () {
  // $(".fullScreenSpin").css("display", "inline-block");
  let templateObject = Template.instance();

  // set initial table rest_data
  templateObject.init_reset_data = function () {
    fixedAssetService.getCostTypeList().then(function (data) {
      console.log(data);
      addVS1Data('TCostTypes', JSON.stringify(data.tcosttypes));
      for (let i = 0; i < data.tcosttypes.length; i ++) {
        const costType = data.tcosttypes[i];
        const typeFeild = {
          index: i,
          label: costType.fields.Description,
          class: 'costType' + i,
          active: true,
          display: true,
          width: ''
        };
        reset_data.push(typeFeild);
      }
      let reset_data = [];
      let templateObject = Template.instance();
      templateObject.reset_data.set(reset_data);
    });

  }
  templateObject.init_reset_data();
  // set initial table rest_data

  // custom field displaysettings
  templateObject.initCustomFieldDisplaySettings = function (listType) {
    let reset_data = templateObject.reset_data.get();
    showCustomFieldDisplaySettings(reset_data);

    try {
      getVS1Data("VS1_Customize").then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')), listType).then(function (data) {
            reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
            showCustomFieldDisplaySettings(reset_data);
          }).catch(function (err) {
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          if(data.ProcessLog.Obj.CustomLayout.length > 0){
           for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
             if(data.ProcessLog.Obj.CustomLayout[i].TableName == listType){
               reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
               showCustomFieldDisplaySettings(reset_data);
             }
           }
         };
          // handle process here
        }
      });
    } catch (error) {
    }
    return;
  }

  function showCustomFieldDisplaySettings(reset_data) {
    let custFields = [];
    let customData = {};
    let customFieldCount = reset_data.length;

    for (let r = 0; r < customFieldCount; r++) {
      customData = {
        active: reset_data[r].active,
        id: reset_data[r].index,
        custfieldlabel: reset_data[r].label,
        class: reset_data[r].class,
        display: reset_data[r].display,
        width: reset_data[r].width ? reset_data[r].width : ''
      };
      custFields.push(customData);
    }
    templateObject.displayfields.set(custFields);
  }

  templateObject.initCustomFieldDisplaySettings("tblFixedAssetCostType");
  // set initial table rest_data  //


  tableResize();
});

Template.assetcostreport.events({

  "click .btnRefresh": function () {

  },

});

Template.assetcostreport.helpers({
  datatablerecords: () => {
    return Template.instance().datatablerecords.get().sort(function (a, b) {
      if (a.assetname === "NA") {
        return 1;
      } else if (b.assetname === "NA") {
        return -1;
      }
      return a.assetname.toUpperCase() > b.assetname.toUpperCase() ? 1 : -1;
    });
  },
  // custom fields displaysettings
  displayfields: () => {
    return Template.instance().displayfields.get();
  },
});
