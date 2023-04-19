import { ReportService } from "../report-service";
import { UtilityService } from "../../utility-service";
import layoutEditor from "./layoutEditor";
import ApiService from "../../js/Api/Module/ApiService";
import { ProductService } from "../../product/product-service";
import ProfitLossLayout from "../../js/Api/Model/ProfitLossLayout";
import ProfitLossLayoutFields from "../../js/Api/Model/ProfitLossLayoutFields";
import ProfitLossLayoutApi from "../../js/Api/ProfitLossLayoutApi";
import { TaxRateService } from "../../settings/settings-service";
import LoadingOverlay from "../../LoadingOverlay";
import GlobalFunctions from "../../GlobalFunctions";
import moment from "moment";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import CachedHttp from "../../lib/global/CachedHttp";
import erpObject from "../../lib/global/erp-objects";
import TemplateInjector from "../../TemplateInjector";
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import "jQuery.print/jQuery.print.js";
import { jsPDF } from "jspdf";
import Datehandler from "../../DateHandler";
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './nplEditLayoutScreenModal.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {NumberResource as random} from "twilio/lib/rest/pricing/v1/voice/number";
import {Integer} from "read-excel-file";
import newnode from "../../CronSetting";

let utilityService = new UtilityService();
let reportService = new ReportService();
let taxRateService = new TaxRateService();

const templateObject = Template.instance();
const productService = new ProductService();
const defaultPeriod = 3;
const employeeId = localStorage.getItem("mySessionEmployeeLoggedID");
let defaultCurrencyCode = CountryAbbr; // global variable "AUD"


Template.npleditlayoutscreen.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.departments = new ReactiveVar([]);
  templateObject.reportOptions = new ReactiveVar();
  templateObject.recordslayout = new ReactiveVar([]);
  templateObject.profitlosslayoutrecords = new ReactiveVar([]);
  templateObject.profitlosslayoutfields = new ReactiveVar([]);
  templateObject.daterange = new ReactiveVar();
  templateObject.layoutinfo = new ReactiveVar([]);
  FxGlobalFunctions.initVars(templateObject);
  templateObject.pnlEditLayoutData = new ReactiveVar();

  var pnlEditLayoutData = [
    {
      name: 'Tranding Income',
      id: 'Tranding Income',
      children: [
        {
          label: 'Sales',
          id: 'Sales',
        },
        {
          label: 'Total Trending Income',
          id: 'Total Trending Income',
        }
      ]
    },
    {
      name: 'Cost of Sales',
      id: 'Cost of Sales',
      children: [
        {
          label: 'Cost of Goods Sold',
          id: 'Cost of Goods Sold',
        },
        {
          label: 'Purchases',
          id: 'Purchases',
        },
        {
          label: 'Total Cost of Sales',
          id: 'Total Cost of Sales',
        }
      ]
    },
    {
      label: "Gross Profit",
      id: "Gross Profit",
    },
    {
      label: "Other Income",
      id: "Other Income",
      children: [
        {
          label: 'Interest Income',
          id: 'Interest Income',
        },
        {
          label: 'Other Revenue',
          id: 'Other Revenue',
        },
        {
          label: 'Total Other Income',
          id: 'Total Other Income',
        }
      ]
    },
    {
      label: "Net Profit",
      id: "Net Profit",
    }
  ];

  templateObject.pnlEditLayoutData.set(pnlEditLayoutData);


});

function buildPositions() {
  const sortfields = $(".pSortItems");

  // Level 0 Sorting
  let counter = 1;
  for (let i = 0; i <= sortfields.length; i++) {
    $(sortfields[i]).attr("position", counter );
    counter++;
  }
  // Level 1 Sorting
  const cSortItems = $(".cSortItems");
  counter = 1;
  for (let i = 0; i <= cSortItems.length; i++) {
    $(cSortItems[i]).attr("position", counter );
    counter++;
  }
  // Level 2 Sorting
  const scSortItems = $(".scSortItems");
  counter = 1;
  for (let i = 0; i <= scSortItems.length; i++) {
    $(scSortItems[i]).attr("position", counter );
    counter++;
  }
}

function buildSubAccountJson( $sortContainer ){
  return Array.from($sortContainer.map(function(){
    return {
      "accountId": $(this).attr('plid'),
      "position": $(this).attr('position'),
      "accountType": $(this).data('group'),
      "employeeId": employeeId,
      "subAccounts": ( $(this).find('ol li').length > 0 )? buildSubAccountJson( $(this).find('ol li') ) : []
    }
  }))
}

Template.npleditlayoutscreen.onRendered(function () {
  const templateObject = Template.instance();

  $(document).ready(function () {
    let pnlLayoutTree = $('#pnlLayoutTree');

    pnlLayoutTree.tree({
      data: templateObject.pnlEditLayoutData.get(),
      autoOpen: true,
      dragAndDrop: true,
      onCanMoveTo: function(movedNode, targetNode, position) {
        if(targetNode.children.length > 0) {
          //console.log(movedNode, targetNode, position);
          return true;
        }
        if(position == "inside") {
          //console.log(movedNode, targetNode, position)
          return false;
        }
        if(!targetNode.parent.parent && movedNode.parent.parent)
          return false;
        return true;
      }
    });

    pnlLayoutTree.on(
        'tree.click',
        function(e) {
          // The clicked node is 'event.node'
          e.preventDefault();
          var selected_node = e.node;

          if (selected_node.id === undefined) {
            console.warn('The multiple selection functions require that nodes have an id');
          }

          if (pnlLayoutTree.tree('isNodeSelected', selected_node)) {
            pnlLayoutTree.tree('removeFromSelection', selected_node);
          } else {
            pnlLayoutTree.tree('addToSelection', selected_node);
          }

          $(".formCreateLayout").addClass('hidden');
          $(".pnlSideLayout").removeClass("hidden");

          var nodes = pnlLayoutTree.tree('getSelectedNodes');
          $(".selectedRowCount").text(`${nodes.length} Rows`);

          if(!nodes.length) {
            /* Cases for no selected row. Hide side layout. */
            $(".pnlSideLayout").addClass("hidden");
          }

          if(nodes.length == 1) {
            if(nodes[0].children.length) {
              $(".selectedRowCount").text("Group");
            }
            else {
              $(".selectedRowCount").text("Row");
            }
          }
        }
    );
  });
  // templateObject.getPNLLayout = async () => {    
  //   getVS1Data("TPNLLayout")
  //     .then(function (dataObject) {
  //       if (dataObject.length == 0) {
  //         reportService.getPNLLayout().then(function(data) {
  //           addVS1Data("TPNLLayout", JSON.stringify(data));
  //           if(data.tpnllayout.length > 0){
  //             for(var i=0; i<data.tpnllayout.length; i++){
  //               if(data.tpnllayout[i].IsCurrentLayout == true){                
  //                 templateObject.layoutinfo.set(data.tpnllayout[i]);
  //                 $("#nplLayoutID").val(data.tpnllayout[i].Id);
  //                 $("#sltLaybout").val(data.tpnllayout[i].LName);
  //                 break;
  //               }
  //             }
  //           }
  //         });          
  //       } else {
  //         let data = JSON.parse(dataObject[0].data);
  //         if(data.tpnllayout.length > 0){
  //           for(var i=0; i<data.tpnllayout.length; i++){
  //             if(data.tpnllayout[i].IsCurrentLayout == true){                
  //               templateObject.layoutinfo.set(data.tpnllayout[i]);
  //               $("#nplLayoutID").val(data.tpnllayout[i].Id);
  //               $("#sltLaybout").val(data.tpnllayout[i].LName);
  //               break;
  //             }
  //           }
  //         }
  //       }
  //     })
  //     .catch(function (err) {
  //       reportService.getPNLLayout().then(function(data) {
  //         addVS1Data("TPNLLayout", JSON.stringify(data));
  //         if(data.tpnllayout.length > 0){
  //           for(var i=0; i<data.tpnllayout.length; i++){
  //             if(data.tpnllayout[i].IsCurrentLayout == true){                
  //               templateObject.layoutinfo.set(data.tpnllayout[i]);
  //               $("#nplLayoutID").val(data.tpnllayout[i].Id);
  //               $("#sltLaybout").val(data.tpnllayout[i].LName);
  //               break;
  //             }
  //           }
  //         }
  //       });
  //     });    
  // }

  // templateObject.getPNLLayout();

  $(document).on("click", "ol.nested_with_switch div.mainHeadingDiv, ol.nested_with_switch span.childInner", function(e) {
    let groupID = $(this).closest("li").attr("plid");
    let groupName = $(this).closest("li").attr("data-group");
    $(".editDefault").hide();
    $(".editRowGroup").show();
    $("#editGroupName").val(groupName);
    $("#editGroupID").val(groupID);
  });

  $('#sltLaybout').editableSelect();
  $('#sltLaybout').editableSelect()
      .on('click.editable-select', function(e, li) {
          var $earch = $(this);
          var offset = $earch.offset();
          var deptDataName = e.target.value || '';
          $('#edtLayoutID').val('');
          if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
              $('#layoutModal').modal('toggle');
              $('#tblLayoutsList').css("width", "100%");
              // }, 1000);
          } else {
              $('#layoutModal').modal('toggle');
              $('#tblLayoutsList').css("width", "100%");
          }
      });
});

Template.npleditlayoutscreen.events({
  "click #btnGroupSelection": async function () {
    //$("#nplAddGroupScreen").modal("toggle");
    let pnlLayoutTree = $('#pnlLayoutTree');
    let nodes = pnlLayoutTree.tree("getSelectedNodes");
    let firstNode = nodes[0];
    let newNode = {
      name:"Untitled Group",
      id: parseInt(Math.random() * 1000),
      children: [],
    }
    pnlLayoutTree.tree("addNodeAfter", newNode, firstNode);
    newNode = pnlLayoutTree.tree("getNodeById", newNode.id);
    pnlLayoutTree.tree("refresh");
    nodes.forEach(function (node) {
      pnlLayoutTree.tree('moveNode', node, newNode, 'inside');
    })
    pnlLayoutTree.tree("refresh");
  },
  "click .saveProfitLossLayouts": async function () {
    let id = $("#nplLayoutID").val();
    let name = $("#nplLayoutName").val();
    let description = $("#nplLayoutDescr").val();
    let isdefault = $("#npldefaultSettting").is(":checked") ? true : false;
    if(id != "" && (name != "" || description != "")){
      $('.fullScreenSpin').css('display', 'block');
      // buildPositions();

      // const profitLossLayoutApis = new ProfitLossLayoutApi();

      // // make post request to save layout data
      // const apiEndpoint = profitLossLayoutApis.collection.findByName(
      //   profitLossLayoutApis.collectionNames.TProfitLossLayout
      // );

      // const pSortfields = $(".pSortItems");
      // const employeeId = localStorage.getItem("mySessionEmployeeLoggedID");
      // let pSortList = [];
      // pSortfields.each(function(){
      //   let Position = $(this).attr('position');
      //   let accountType = $(this).data('group');
      //   pSortList.push({
      //     "position": Position,
      //     "accountType": accountType,
      //     "employeeId": employeeId,
      //     "subAccounts": buildSubAccountJson( $(this).find('ol li') )
      //   });
      // });

      /**
       *
       * Update all layout fields index DB
       */
      
      let jsonObj = {
        type: "TPNLLayout",
        fields: {
          "ID": id,
          "LName": name,
          "Description": description,
          "IsCurrentLayout": isdefault
        }
      }

      reportService.savePNLLayout(jsonObj).then(function(res) {
        reportService.getPNLLayout().then(function(data) {
          addVS1Data("TPNLLayout", JSON.stringify(data)).then(function(datareturn) {
            if($("#npldefaultSettting").prop('checked') == true){
              $("#nplEditLayoutScreen").modal("toggle");
            }
          }).catch(function(err) {
            if($("#npldefaultSettting").prop('checked') == true){
              $("#nplEditLayoutScreen").modal("toggle");
            }
          });
          $('.fullScreenSpin').css('display', 'none');
        });        
      }).catch(function(err) {
          swal({
              title: 'Oooops...',
              text: err,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
          }).then((result) => {
              if (result.value) {
                  // Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {}
          });
          $('.fullScreenSpin').css('display', 'none');
      });

      // let profitLossLayoutData = {
      //   "type": "TProfitLossLayout",
      //   "action": "save",
      //   "layout": pSortList
      // }

      // try {
      //   const ApiResponse = await apiEndpoint.fetch(null, {
      //       method: "POST",
      //       headers: ApiService.getPostHeaders(),
      //       body: JSON.stringify(profitLossLayoutData),
      //   });

      //   if (ApiResponse.ok == true) {
      //       const jsonResponse = await ApiResponse.json();
      //       LoadingOverlay.hide();
      //   }else{
      //       LoadingOverlay.hide();
      //   }
      // } catch (error) {
      //     LoadingOverlay.hide();
      // }

      // "type": "TProfitLossLayout",
      // "action": "save",
      // "layout": [

      // let layoutLists = {
      //   Name: name,
      //   Description: description,
      //   Isdefault: isdefault,
      //   EmployeeID: employeeID,
      //   LayoutLists: profitlosslayoutfields,
      // };
      // await addVS1Data("TProfitLossEditLayout", JSON.stringify(layoutLists));
    }
  },
  "click .btnCreateLayout": async function () {
    let name = $("#nplLayoutName").val();
    let description = $("#nplLayoutDescr").val();
    let isdefault = $("#npldefaultSettting").is(":checked") ? true : false;
    if(name != "" || description != ""){
      $('.fullScreenSpin').css('display', 'block');
      let jsonObj = {
        type: "TPNLLayout",
        fields: {
          "LName": name,
          "Description": description,
          "IsCurrentLayout": isdefault
        }
      }

      reportService.savePNLLayout(jsonObj).then(function(res) {
        reportService.getPNLLayout().then(function(data) {
          addVS1Data("TPNLLayout", JSON.stringify(data)).then(function(datareturn) {
            $("#layoutModal #btnViewDeleted").click();
          }).catch(function(err) {
            $("#layoutModal #btnViewDeleted").click();
          });
          $('.fullScreenSpin').css('display', 'none');
        });
      }).catch(function(err) {
          swal({
              title: 'Oooops...',
              text: err,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
          }).then((result) => {
              if (result.value) {
                  // Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {}
          });
          $('.fullScreenSpin').css('display', 'none');
      });
    }
  },

  "click #nplShowCreateLayoutForm" : function (event) {
    $(".pnlSideLayout").addClass("hidden");
    $(".formCreateLayout").removeClass('hidden');
  },
});

Template.npleditlayoutscreen.helpers({
  companyname: () => {
    return loggedCompany;
  },
  dateAsAt: () => {
    const templateObject = Template.instance();
    return templateObject.data.dateAsAt || "";
  },
  // profitlosslayoutrecords: () => {
  //   const templateObject = Template.instance();
  //   return templateObject.data.profitlosslayoutrecords || [];
  // },
  recordslayout: () => {
    return Template.instance().recordslayout.get();
  },
  layoutinfo: () => {
    return Template.instance().layoutinfo.get();
  },
  isAccount(layout) {
    if (layout.ID > 1) {
      return true;
    }
    return false;
  },
});

Template.registerHelper("equal", function (a, b) {
  return a == b;
});

Template.registerHelper("equals", function (a, b) {
  return a === b;
});

Template.registerHelper("notEquals", function (a, b) {
  return a != b;
});

Template.registerHelper("containsequals", function (a, b) {
  let chechTotal = false;
  if (a.toLowerCase().indexOf(b.toLowerCase()) >= 0) {
    chechTotal = true;
  }
  return chechTotal;
});

Template.registerHelper("shortDate", function (a) {
  let dateIn = a;
  let dateOut = moment(dateIn, "DD/MM/YYYY").format("MMM YYYY");
  return dateOut;
});

Template.registerHelper("noDecimal", function (a) {
  let numIn = a;
  let numOut = parseInt(numIn);
  return numOut;
});
