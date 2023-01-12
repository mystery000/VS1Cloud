import { template } from 'lodash';
import {Session} from 'meteor/session';
import '../../lib/global/indexdbstorage.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import TableHandler from '../../js/Table/TableHandler';
import { SideBarService } from '../../js/sidebar-service';
import FxGlobalFunctions from '../../packages/currency/FxGlobalFunctions';

import { Template } from 'meteor/templating';
import './transaction_line.html';

let sideBarService = new SideBarService();
export const foreignCols = ["Unit Price (Ex)", "Tax Amt", "Amount (Ex)", "Amount (Inc)", "Unit Price (Inc)", "Cost Price"];

//Template.transaction_line.inheritsHelpersFrom('new_invoice');
// Template.new_invoice.inheritsEventsFrom('transaction_line');
// Template.new_invoice.inheritsHooksFrom('transaction_line');

Template.transaction_line.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.isForeignEnabled = new ReactiveVar(false);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
  templateObject.init_data = new ReactiveVar([]); // initial reset data
  templateObject.initialTableWidth = new ReactiveVar('');
});
Template.transaction_line.onRendered(function() {
  let templateObject = Template.instance();
  let currenttranstablename = templateObject.data.tablename||"";
  // set initial table rest_data
  templateObject.init_reset_data = function() {
      let reset_data = [
          { index: 0,  label: "Product Name",       class: "ProductName",   width: "300",       active: true,   display: true },
          { index: 1,  label: "Description",        class: "Description",   width: "",          active: true,   display: true },
          { index: 2,  label: "Account Name",       class: "AccountName",   width: "300",       active: true,   display: true },
          { index: 3,  label: "Memo",               class: "Memo",          width: "",          active: true,   display: true },
          { index: 4,  label: "Qty",                class: "Qty",           width: "50",        active: true,   display: true },
          { index: 5,  label: "Ordered",            class: "Ordered",       width: "75",        active: true,   display: true },
          { index: 6,  label: "Shipped",            class: "Shipped",       width: "75",        active: true,   display: true },
          { index: 7,  label: "BO",                 class: "BackOrder",     width: "75",        active: true,   display: true },
          { index: 8,  label: "Serial/Lot No",      class: "SerialNo",      width: "100",       active: true,   display: true },
          { index: 9,  label: "Fixed Asset",        class: "FixedAsset",    width: "100",       active: true,   display: true },
          { index: 10, label: "Customer/Job",       class: "CustomerJob",   width: "110",       active: true,   display: true },
          { index: 11, label: "Unit Price (Ex)",    class: "UnitPriceEx",   width: "152",       active: true,   display: true },
          { index: 12, label: "Unit Price (Inc)",   class: "UnitPriceInc",  width: "152",       active: false,  display: true },
          { index: 13, label: "Cost Price",         class: "CostPrice",     width: "110",       active: true,   display: true },
          { index: 14, label: "Disc %",             class: "Discount",      width: "75",        active: true,   display: true },
          { index: 15, label: "CustField1",         class: "SalesLinesCustField1", width: "110",active: true,   display: true },
          { index: 16, label: "Tax Rate",           class: "TaxRate",       width: "91",        active: true,   display: true },
          { index: 17, label: "Tax Code",           class: "TaxCode",       width: "95",        active: true,   display: true },
          { index: 18, label: "Tax Amt",            class: "TaxAmount",     width: "75",        active: true,   display: true },
          { index: 19, label: "Amount (Ex)",        class: "AmountEx",      width: "152",       active: true,   display: true },
          { index: 20, label: "Amount (Inc)",       class: "AmountInc",     width: "152",       active: false,  display: true },
          { index: 21, label: "Units",              class: "Units",         width: "95",        active: true,   display: true },
          { index: 22, label: "Custom Field 1",     class: "CustomField1",  width: "124",       active: false,  display: true },
          { index: 23, label: "Custom Field 2",     class: "CustomField2",  width: "124",       active: false,  display: true },
      ];
      let isBatchSerialNoTracking = templateObject.data.isBatchSerialNoTracking || false;
      let isBOnShippedQty = templateObject.data.includeBOnShippedQty || false;
      if (isBOnShippedQty == false) {
         let x;
         x = reset_data.find(x => x.class === 'Qty'); if(x != undefined) x.display = true;
         x = reset_data.find(x => x.class === 'Ordered'); if(x != undefined) x.display = false;
         x = reset_data.find(x => x.class === 'Shipped'); if(x != undefined) x.display = false;
         x = reset_data.find(x => x.class === 'BackOrder'); if(x != undefined) x.display = false;
      }
      if (isBatchSerialNoTracking == false || isBatchSerialNoTracking == "false") {
        let x = reset_data.find(x => x.class === 'SerialNo'); if(x != undefined) x.display = false;
      }
      if(currenttranstablename == 'tblCreditLine' || currenttranstablename == 'tblBillLine') {
        let x;
        x = reset_data.find(x => x.class === 'ProductName'); if(x != undefined) x.display = false;
        x = reset_data.find(x => x.class === 'Description'); if(x != undefined) x.display = false;       
      } else {
        let x;
        x = reset_data.find(x => x.class === 'AccountName'); if(x != undefined) x.display = false;
        x = reset_data.find(x => x.class === 'Memo'); if(x != undefined) x.display = false;
      }
      templateObject.init_data.set(reset_data);
  }
  templateObject.init_reset_data();
  // custom field displaysettings
  templateObject.initCustomFieldDisplaySettings = function(data, listType) {
      let reset_data = templateObject.init_data.get();
      templateObject.showCustomFieldDisplaySettings(reset_data);
      try {
          getVS1Data("VS1_Customize").then(function(dataObject) {
              if (dataObject.length == 0) {
                  sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')), listType).then(function(data) {
                        reset_data = data.ProcessLog.Obj.CustomLayout[0].Columns;      
                        resetData = templateObject.init_data.get().map((item) => {
                            data =  reset_data.find(x => x.class == item.class);
                            if(data != undefined && !data.display) data.active = false;
                            if(data != undefined) {
                                if(currenttranstablename == 'tblBillLine') {
                                    if(data.class == 'UnitPriceInc' || data.class=='AmountInc') return {...item, active: false, display: true };
                                    return {...item, active: true, display: true};
                                }
                                return {...item, active: data.active, display: data.display};
                            }
                            return {...item, active: false, display: false};
                        });
                        canShowBackOrder = templateObject.data.canShowBackOrder || false;
                        canShowUOM = templateObject.data.canShowUOM || false;
                        includeBOnShippedQty = templateObject.data.includeBOnShippedQty || false;
                        isBatchSerialNoTracking = templateObject.data.isBatchSerialNoTracking || false;

                        if(canShowBackOrder == false || includeBOnShippedQty == false) {
                            ordered = resetData.find(x => x.class == "Ordered");
                            shipped = resetData.find(x => x.class == "Shipped");
                            backorder = resetData.find(x => x.class == "BackOrder");
                            if(backorder != undefined) backorder.display = false;                             
                            if(ordered != undefined) ordered.display = false;
                            if(shipped != undefined) shipped.display = false;
                        }
                        if(isBatchSerialNoTracking == "false" || isBatchSerialNoTracking == false) {
                            serialNo = resetData.find(x => x.class == "SerialNo");
                            if(serialNo != undefined) serialNo.display = false;
                        }
                        if(canShowUOM == false) {
                            units = resetData.find(x => x.class == "Units");
                            if(units != undefined) units.display = false;
                        }
                        if(currenttranstablename == 'tblBillLine' || currenttranstablename == 'tblCreditLine') {
                            let x;
                            x = resetData.find(x => x.class == 'AccountName'); {x.display = x.active = true};
                            x = resetData.find(x => x.class == 'Memo');        {x.display = x.active = true};
                            x = resetData.find(x => x.class == 'ProductName'); {x.display = x.active = false};
                            x = resetData.find(x => x.class == 'Description'); {x.display = x.active = false};
                        } else {
                            let x;
                            x = resetData.find(x => x.class == 'AccountName'); {x.display = x.active = false};
                            x = resetData.find(x => x.class == 'Memo');        {x.display = x.active = false};
                            x = resetData.find(x => x.class == 'ProductName'); {x.display = x.active = true};
                            x = resetData.find(x => x.class == 'Description'); {x.display = x.active = true};
                        } 
                        templateObject.showCustomFieldDisplaySettings(resetData);              
                  }).catch(function(err) {});
              } else {
                  let data = JSON.parse(dataObject[0].data);
                  if (data.ProcessLog.Obj.CustomLayout.length > 0) {
                      for (let i = 0; i < data.ProcessLog.Obj.CustomLayout.length; i++) {
                          if (data.ProcessLog.Obj.CustomLayout[i].TableName == listType) {
                                reset_data = data.ProcessLog.Obj.CustomLayout[i].Columns;
                                                     
                                resetData = templateObject.init_data.get().map((item) => {
                                    data =  reset_data.find(x => x.class == item.class);
                                    if(data != undefined && !data.display) data.active = false;
                                    if(data != undefined) {
                                        if(currenttranstablename == 'tblBillLine') {
                                            if(data.class == 'UnitPriceInc' || data.class=='AmountInc') return {...item, active: false, display: true };
                                            return {...item, active: true, display: true};
                                        }
                                        return {...item, active: data.active, display: data.display};
                                    }
                                    return {...item, active: false, display: false};
                                });
                                canShowBackOrder = templateObject.data.canShowBackOrder || false;
                                canShowUOM = templateObject.data.canShowUOM || false;
                                includeBOnShippedQty = templateObject.data.includeBOnShippedQty || false;
                                isBatchSerialNoTracking = templateObject.data.isBatchSerialNoTracking || false;

                                if(canShowBackOrder == false || includeBOnShippedQty == false) {
                                    ordered = resetData.find(x => x.class == "Ordered");
                                    shipped = resetData.find(x => x.class == "Shipped");
                                    backorder = resetData.find(x => x.class == "BackOrder");
                                    if(backorder != undefined) backorder.display = false;                             
                                    if(ordered != undefined) ordered.display = false;
                                    if(shipped != undefined) shipped.display = false;
                                }
                                if(isBatchSerialNoTracking == "false" || isBatchSerialNoTracking == false) {
                                    serialNo = resetData.find(x => x.class == "SerialNo");
                                    if(serialNo != undefined) serialNo.display = false;
                                }
                                if(canShowUOM == false) {
                                    units = resetData.find(x => x.class == "Units");
                                    if(units != undefined) units.display = false;
                                }
                                if(currenttranstablename == 'tblBillLine' || currenttranstablename == 'tblCreditLine') {
                                    let x;
                                    x = resetData.find(x => x.class == 'AccountName'); {x.display = x.active = true};
                                    x = resetData.find(x => x.class == 'Memo');        {x.display = x.active = true};
                                    x = resetData.find(x => x.class == 'ProductName'); {x.display = x.active = false};
                                    x = resetData.find(x => x.class == 'Description'); {x.display = x.active = false};
                                } else {
                                    let x;
                                    x = resetData.find(x => x.class == 'AccountName'); {x.display = x.active = false};
                                    x = resetData.find(x => x.class == 'Memo');        {x.display = x.active = false};
                                    x = resetData.find(x => x.class == 'ProductName'); {x.display = x.active = true};
                                    x = resetData.find(x => x.class == 'Description'); {x.display = x.active = true};
                                } 
                                templateObject.showCustomFieldDisplaySettings(resetData);
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
              width: reset_data[r].width ? reset_data[r].width : '',
              label: reset_data[r].label
          };

          if(reset_data[r].active == true){
            $('#'+currenttranstablename+' .'+reset_data[r].class).removeClass('hiddenColumn');
          }else if(reset_data[r].active == false){
            $('#'+currenttranstablename+' .'+reset_data[r].class).addClass('hiddenColumn');
          };
          custFields.push(customData);
      }      
      await templateObject.displayfields.set(custFields);
      await templateObject.reset_data.set(custFields);
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
      let isBatchSerialNoTracking = templateObject.data.isBatchSerialNoTracking || false;
      if (isBatchSerialNoTracking) {
        data = reset_data.find((x) => x.class === 'TaxRate');
        if(data != undefined) data = {...data, display: true, active: true};
      } else {
        data = reset_data.find((x) => x.class === 'TaxRate');
        if(data != undefined) data = {...data, display: false, active: false};
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
  'click .btnSaveGridSettings': async function(event) {
    playSaveAudio();
    let templateObject = Template.instance();
    setTimeout(async function(){
        let lineItems = [];
        $(".fullScreenSpin").css("display", "inline-block");

        $(".displaySettings").each(function (index) {
            var $tblrow = $(this);
            var fieldID = $tblrow.attr("custid") || 0;
            var colTitle = $tblrow.find(".divcolumn").text() || "";
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(":checked")) {
                colHidden = true;
            } else {
                colHidden = false;
            }
            let lineItemObj = {
                index: parseInt(fieldID),
                label: colTitle,
                active: colHidden,
                width: parseInt(colWidth),
                class: colthClass,
                display: true
            };

            lineItems.push(lineItemObj);
    });
    let reset_data = templateObject.reset_data.get();
    reset_data = reset_data.filter(redata => redata.display == false);
    lineItems.push(...reset_data);
    lineItems.sort((a,b) => a.index - b.index);

    try {
        let erpGet = erpDb();
        let tableName = templateObject.data.tablename||"";
        let employeeId = parseInt(Session.get('mySessionEmployeeLoggedID'))||0;
        let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);

        $(".fullScreenSpin").css("display", "none");
        if(added) {
        sideBarService.getNewCustomFieldsWithQuery(parseInt(Session.get('mySessionEmployeeLoggedID')),'').then(function (dataCustomize) {
            addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
        });

            swal({
            title: 'SUCCESS',
            text: "Display settings is updated!",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
                if (result.value) {
                $('#myModal2').modal('hide');
                }
            });
        } else {
        swal("Something went wrong!", "", "error");
        }
    } catch (error) {
        $(".fullScreenSpin").css("display", "none");
        swal("Something went wrong!", "", "error");
    }
    }, delayTimeAfterSound);
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
  displayFieldRowspan: (displayfield, isForeignEnabled) => {
    if(isForeignEnabled == true) {
        if (foreignCols.includes(displayfield.custfieldlabel)) {
            return 1;
        }
        return 2;
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
