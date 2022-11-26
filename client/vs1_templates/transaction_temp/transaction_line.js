import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import '../../lib/global/indexdbstorage.js';
import { SideBarService } from '../../js/sidebar-service';
import TableHandler from '../../js/Table/TableHandler';

import FxGlobalFunctions from '../../packages/currency/FxGlobalFunctions';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

export const foreignCols = ["Unit Price (Ex)", "Tax Amt", "Amount (Ex)", "Amount (Inc)", "Unit Price (Inc)", "Cost Price"];

//Template.transaction_line.inheritsHelpersFrom('new_invoice');
// Template.new_invoice.inheritsEventsFrom('transaction_line');
// Template.new_invoice.inheritsHooksFrom('transaction_line');

Template.transaction_line.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.isForeignEnabled = new ReactiveVar(false);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
  templateObject.initialTableWidth = new ReactiveVar('');
});
Template.transaction_line.onRendered(function() {
  let templateObject = Template.instance();
  let currenttranstablename = templateObject.data.tablename||"";
  // set initial table rest_data
  templateObject.init_reset_data = function() {
      let reset_data = [
          { index: 0, label: "Product Name", class: "ProductName", width: "300", active: true, display: true },
          { index: 1, label: "Description", class: "Description", width: "", active: true, display: true },
          { index: 2, label: "Qty", class: "Qty", width: "50", active: true, display: true },
          { index: 3, label: "Ordered", class: "Ordered", width: "75", active: true, display: true },
          { index: 4, label: "Shipped", class: "Shipped", width: "75", active: true, display: true },
          { index: 5, label: "BO", class: "BackOrder", width: "75", active: true, display: true },
          { index: 6, label: "Unit Price (Ex)", class: "UnitPriceEx", width: "125", active: true, display: true },
          { index: 7, label: "Unit Price (Inc)", class: "UnitPriceInc", width: "130", active: false, display: true },
          { index: 8, label: "Disc %", class: "Discount", width: "75", active: true, display: true },
          { index: 9, label: "Cost Price", class: "CostPrice", width: "110", active: false, display: true },
          { index: 10, label: "SalesLines CustField1", class: "SalesLinesCustField1", width: "110", active: false, display: true },
          { index: 11, label: "Tax Rate", class: "TaxRate", width: "91", active: false, display: true },
          { index: 12, label: "Tax Code", class: "TaxCode", width: "95", active: true, display: true },
          { index: 13, label: "Tax Amt", class: "TaxAmount", width: "75", active: true, display: true },
          { index: 14, label: "Serial/Lot No", class: "SerialNo", width: "100", active: true, display: true },
          { index: 15, label: "Amount (Ex)", class: "AmountEx", width: "120", active: true, display: true },
          { index: 16, label: "Amount (Inc)", class: "AmountInc", width: "120", active: false, display: true },
          { index: 17, label: "Units", class: "Units", width: "95", active: false, display: true },
      ];

      let isBatchSerialNoTracking = Session.get("CloudShowSerial") || false;
      let isBOnShippedQty = Session.get("CloudSalesQtyOnly");
      if (isBOnShippedQty) {
          reset_data[2].display = true;
          reset_data[3].display = false;
          reset_data[4].display = false;
          reset_data[5].display = false;
      } else {
          reset_data[2].display = false;
          reset_data[3].display = true;
          reset_data[4].display = true;
          reset_data[5].display = true;
      }
      if (isBatchSerialNoTracking) {
          reset_data[14].display = true;
      } else {
          reset_data[14].display = false;
      }

      let templateObject = Template.instance();
      templateObject.reset_data.set(reset_data);
  }
  templateObject.init_reset_data();
  // set initial table rest_data
  templateObject.insertItemWithLabel = (reset_data, a,b) => {
        let data = reset_data.slice();
        var aPos, bPos;
        for(var i = 0; i < data.length; i++) if(data[i].label === a) aPos = i; else if(data[i].label === b) {bPos = i; break;}
        data[bPos].index = aPos + 1;
        for(var i = aPos + 1; i < bPos; i++) data[i].index += 1;
        data.sort((a,b) => a.index - b.index);
        return data;
  }
  // custom field displaysettings
  templateObject.initCustomFieldDisplaySettings = function(data, listType) {
      let templateObject = Template.instance();
      let reset_data = templateObject.reset_data.get();

      templateObject.showCustomFieldDisplaySettings(templateObject.insertItemWithLabel(reset_data, 'BO', 'Serial/Lot No'));

      try {

          getVS1Data("VS1_Customize").then(function(dataObject) {
              if (dataObject.length == 0) {
                  sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')), listType).then(function(data) {
                      reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;
                      templateObject.insertItemWithLabel(reset_data, 'BO', 'Serial/Lot No');
                      templateObject.showCustomFieldDisplaySettings(templateObject.insertItemWithLabel(reset_data, 'BO', 'Serial/Lot No'));
                  }).catch(function(err) {});
              } else {
                  let data = JSON.parse(dataObject[0].data);
                  if (data.ProcessLog.Obj.CustomLayout.length > 0) {
                      for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
                          if (data.ProcessLog.Obj.CustomLayout[i].TableName == listType) {
                              reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
                              templateObject.showCustomFieldDisplaySettings(templateObject.insertItemWithLabel(reset_data, 'BO', 'Serial/Lot No'));
                          }
                      }
                  };
                  // handle process here
              }
          });

      } catch (error) {}
      return;
  }

  templateObject.showCustomFieldDisplaySettings = async function(reset_data) {
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

          if(reset_data[r].active == true){
            $('#'+currenttranstablename+' .'+reset_data[r].class).removeClass('hiddenColumn');
          }else if(reset_data[r].active == false){
            $('#'+currenttranstablename+' .'+reset_data[r].class).addClass('hiddenColumn');
          };
          custFields.push(customData);
      }
      await templateObject.displayfields.set(custFields);
      $('.dataTable').resizable();
  }

  templateObject.initCustomFieldDisplaySettings("", currenttranstablename);

});

Template.transaction_line.events({
  // custom field displaysettings
  "click .btnResetGridSettings": async function(event) {
      let templateObject = Template.instance();
      let currenttranstablename = templateObject.data.tablename||"";
      let reset_data = templateObject.reset_data.get();
      let isBatchSerialNoTracking = Session.get("CloudShowSerial") || false;
      if (isBatchSerialNoTracking) {
          reset_data[11].display = true;
      } else {
          reset_data[11].display = false;
      }
      reset_data = reset_data.filter(redata => redata.display);

      $(".displaySettings").each(function(index) {
          let $tblrow = $(this);
          $tblrow.find(".divcolumn").text(reset_data[index].label);
          $tblrow.find(".custom-control-input").prop("checked", reset_data[index].active);
          let title = $(`#${currenttranstablename}`).find("th").eq(index);
          if (reset_data[index].class === 'AmountEx' || reset_data[index].class === 'UnitPriceEx') {
              $(title).html(reset_data[index].label + `<i class="fas fa-random fa-trans"></i>`);
          } else if (reset_data[index].class === 'AmountInc' || reset_data[index].class === 'UnitPriceInc') {
              $(title).html(reset_data[index].label + `<i class="fas fa-random"></i>`);
          } else {
              $(title).html(reset_data[index].label);
          }

          if (reset_data[index].active) {
              $('.col' + reset_data[index].class).addClass('showColumn');
              $('.col' + reset_data[index].class).removeClass('hiddenColumn');
          } else {
              $('.col' + reset_data[index].class).addClass('hiddenColumn');
              $('.col' + reset_data[index].class).removeClass('showColumn');
          }
          $(".rngRange" + reset_data[index].class).val(reset_data[index].width);
          $(".col" + reset_data[index].class).css('width', reset_data[index].width);
      });
  },
  'click .btnOpenTranSettings': async function (event, template) {
      let templateObject = Template.instance();
      let currenttranstablename = templateObject.data.tablename||"";
      $(`#${currenttranstablename} thead tr th`).each(function (index) {
        var $tblrow = $(this);
        var colWidth = $tblrow.width() || 0;
        var colthClass = $tblrow.attr('data-class') || "";
        $('.rngRange' + colthClass).val(colWidth);
      });
     $('.'+currenttranstablename+'_Modal').modal('toggle');
  },
  'mouseenter .transTable .dataTable': async function (event, template) {
      let templateObject = Template.instance();
      let currenttranstablename = templateObject.data.tablename||"";

  },
  'mouseleave .transTable .dataTable': async function (event, template) {
      let templateObject = Template.instance();
      let currenttranstablename = templateObject.data.tablename||"";


  },
});

Template.transaction_line.helpers({
  // custom field displaysettings
  displayfields: () => {
      return Template.instance().displayfields.get();
  },

  displayFieldColspan: (displayfield, isForeignEnabled) => {
      if (foreignCols.includes(displayfield.custfieldlabel)) {
          if (isForeignEnabled == true) {
              return 2
          }
          return 1;
      }
      return 1;
  },

  subHeaderForeign: (displayfield) => {

      if (foreignCols.includes(displayfield.custfieldlabel)) {
          return true;
      }
      return false;
  },
  convertToForeignAmount: (amount) => {
      return FxGlobalFunctions.convertToForeignAmount(amount, $('#exchange_rate').val(), FxGlobalFunctions.getCurrentCurrencySymbol());
  }
});

Template.registerHelper("equals", function (a, b) {
  return a === b;
});
