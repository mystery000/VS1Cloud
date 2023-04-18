import {SalesBoardService} from '../js/sales-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {InvoiceService} from "../invoice/invoice-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import {OrganisationService} from '../js/organisation-service';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-editable-select';
import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './workorderList.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';
import { ManufacturingService} from "./manufacturing-service";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let accountService = new SalesBoardService();
Template.workorderlist.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);



    templateObject.getDataTableList = function(data){

        let cur_date = new Date()

        let dataList = [
            data.fields.ID ,
            data.fields.SaleID || '',
            data.fields.Customer || '',
            data.fields.PONumber || '',
            // moment(data.fields.SaleDate).format("DD/MM/YYYY") || '',
            // moment(data.fields.DueDate).format("DD/MM/YYYY") || '',
            moment(cur_date).format("DD/MM/YYYY") || '',
            moment(cur_date).format("DD/MM/YYYY") || '',
            data.fields.ProductName || '',
            data.fields.Quantity || '',
            data.fields.Comment || '',
        ];
        return dataList;
      }

    let headerStructure = [
        { index: 0, label: "#ID", class: "colID", width: "0", active: false, display: true },
        { index: 1, label: "SalesOrderID", class: "colOrderNumber", width: "80", active: true, display: true },
        { index: 2, label: "Customer", class: "colCustomer", width: "80", active: true, display: true },
        { index: 3, label: "PO Number", class: "colPONumber", width: "100", active: true, display: true },
        { index: 4, label: "Sale Date", class: "colSaleDate", width: "200", active: true, display: true },
        { index: 5, label: "Due Date", class: "colDueDate", width: "200", active: true, display: true },
        { index: 6, label: "Product", class: "colProductName", width: "120", active: true, display: true },
        { index: 7, label: "Amount", class: "colAmount", width: "80", active: true, display: true },
        { index: 8, label: "Comments", class: "colComment", width: "", active: true, display: true },
    ];
    templateObject.tableheaderrecords.set(headerStructure)
})

Template.workorderlist.onRendered (function() {
    const templateObject = Template.instance();
    templateObject.getAllWorkorders = async function() {
        return new Promise(async(resolve, reject)=>{
            getVS1Data('TVS1Workorder').then(function(dataObject){
                if(dataObject.length == 0) {
                    resolve([])
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    resolve(data.tvs1workorder)
                }
            }).catch(function(e) {
                resolve([])
            })
        })
    }
});

Template.workorderlist.helpers ({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get();
    },
    selectedInventoryAssetAccount: () => {
        return Template.instance().selectedInventoryAssetAccount.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    apiFunction:function() {
        let manufacturingService = new ManufacturingService();
        return manufacturingService.getWorkOrder;
    },

    searchAPI: function() {
        return ManufacturingService.getWorkOrder;
    },

    service: ()=>{
        let manufacturingService = new ManufacturingService();
        return manufacturingService;

    },

    exDataHandler: function() {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    apiParams: function() {
        return ['limitCount', 'limitFrom'];
    },

})


Template.workorderlist.events({

    'click .workorderList .btnRefresh': function(e) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        setTimeout(function () {
            // templateObject.getWorkorderRecords();
            window.open('/workorderlist', '_self');
            }, 3000);
        },


    'click .workorderList #btnConvertSalesorder': function (e) {
        // FlowRouter.go('/workordercard');
        $('#salesOrderListModal').modal('toggle');
    },

    'click #salesOrderListModal table tbody tr': async function(event) {
        let workorderRecords = [];
        let templateObject = Template.instance();
        let salesorderid = $(event.target).closest('tr').find('.colSalesNo').text();
        workorderRecords = await templateObject.getAllWorkorders();
        getVS1Data('TSalesOrderEx').then(function(dataObject){
            if(dataObject.length == 0) {
                accountService.getOneSalesOrderdataEx(salesorderid).then(function(data) {
                  let lineItems = data.fields.Lines;
                  for(let i = 0; i< lineItems.length; i ++ ) {
                    let isExisting = false;
                    workorderRecords.map(order => {
                      if(order.fields.ProductName == lineItems[i].fields.ProductName && order.fields.SaleID == data.fields.ID) {
                          isExisting = true
                      }
                    })
                  //   if(lineItems[i].fields.isManufactured == true && isExisting == false) {
                    if(isExisting == false) {
                        let bomProducts = templateObject.bomProducts.get() || []
                        let index = bomProducts.findIndex(product => {
                          return product.Caption == lineItems[i].fields.ProductName;
                        })
                      if(index > -1) {
                          $('#salesOrderListModal').modal('toggle');
                          FlowRouter.go('workordercard?salesorderid='+salesorderid + '&lineId='+i)
                          break;
                      } else {
                        productService.getOneBOMProductByName(name).then(function(data){
                            if(data.tproctree.length>0) {
                                $('#salesOrderListModal').modal('toggle');
                                FlowRouter.go('workordercard?salesorderid='+salesorderid + '&lineId='+i)
                            }
                        })
                      }
                    }
                  }

                  if(templateObject.workOrderLineId.get() == -1) {
                      swal({
                          title: 'Oooops...',
                          text: 'This record is not available to create work order.',
                          type: 'error',
                          showCancelButton: false,
                          confirmButtonText: 'Ok'
                      }).then((result) => {
                          if (result.value) {}
                          else if (result.dismiss === 'cancel') {

                          }
                      });
                  } else {
                    $('#salesOrderListModal').modal('toggle');
                  }
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsalesorderex;
                for(let d = 0; d< useData.length; d++) {
                    if(parseInt(useData[d].fields.ID) == salesorderid) {
                       let lineItems = useData[d].fields.Lines;
                        for(let i = 0; i< lineItems.length; i ++ ) {
                            let isExisting = false;
                            if(workorderRecords.length> 0) {
                                    for(let j = 0; j< workorderRecords.length; j ++) {
                                        if(workorderRecords[j].fields.ProductName == lineItems[i].fields.ProductName && workorderRecords[j].fields.SaleID == useData[d].fields.ID) {
                                            isExisting = true
                                        }
                                    }
                            }
                          //   if(lineItems[i].fields.isManufactured == true && isExisting == false) {
                            if(isExisting == false) {
                                let bomProducts = templateObject.bomProducts.get();
                                let index = bomProducts.findIndex(product => {
                                    return product.Caption == lineItems[i].fields.ProductName;
                                })
                                if(index > -1) {
                                    $('#salesOrderListModal').modal('toggle');
                                    FlowRouter.go('workordercard?salesorderid='+salesorderid + '&lineId='+i)
                                    break
                                } else {
                                    productService.getOneBOMProductByName(name).then(function(data){
                                        if(data.tproctree.length>0) {
                                            $('#salesOrderListModal').modal('toggle');
                                            FlowRouter.go('workordercard?salesorderid='+salesorderid + '&lineId='+i)
                                        }
                                    })
                                }
                            }
                          }

                          if(templateObject.workOrderLineId.get() == -1) {
                              swal({
                                  title: 'Oooops...',
                                  text: 'This record is not available to create work order.',
                                  type: 'error',
                                  showCancelButton: false,
                                  confirmButtonText: 'Cancel'
                              }).then((result) => {
                                  if (result.value) {}
                                  else if (result.dismiss === 'cancel') {

                                  }
                              });
                          }else{
                            $('#salesOrderListModal').modal('toggle');
                          }
                    }
                }
            }
        }).catch(function(err){
            accountService.getOneSalesOrderdataEx(salesorderid).then(function(data) {
               let lineItems = data.fields.Lines;
               for(let i = 0; i< lineItems.length; i ++ ) {
                let isExisting = false;
                workorderRecords.map(order => {
                      if(order.fields.ProductName == lineItems[i].fields.ProductName && order.fields.SaleID == data.fields.ID) {
                      isExisting = true
                  }
                })
              //   if(lineItems[i].fields.isManufactured == true && isExisting == false) {
                if(isExisting == false) {
                    let bomProducts = templateObject.bomProducts.get()
                    let index = bomProducts.findIndex(product => {
                        return product.Caption == lineItems[i].fields.ProductName;
                    })
                    if(index > -1) {
                        $('#salesOrderListModal').modal('toggle');
                        templateObject.workOrderLineId.set(i);
                        FlowRouter.go('workordercard?salesorderid='+salesorderid + '&lineId='+i)
                        break
                    }else {
                        productService.getOneBOMProductByName(name).then(function(data){
                            if(data.tproctree.length>0) {
                               
                                $('#salesOrderListModal').modal('toggle');
                                FlowRouter.go('workordercard?salesorderid='+salesorderid + '&lineId='+i)
                            }
                        })
                    }
                }
              }

              if(templateObject.workOrderLineId.get() == -1) {
                  swal({
                      title: 'Oooops...',
                      text: err,
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonText: 'This record is not available to create work order.'
                  }).then((result) => {
                      if (result.value) {}
                      else if (result.dismiss === 'cancel') {

                      }
                  });
              }else{
                $('#salesOrderListModal').modal('toggle');
              }
            })
        })

        // consider the api for product has field named 'isManufactured'

    },

    'click #tblWorkorderList tbody tr': function (event) {
        var id = $(event.target).closest('tr').find('.colID').text();
        FlowRouter.go('/workordercard?id='+id)
    },

    'click .workorderList #btnNewWorkorder': function(e) {
        let template = Template.instance();
        FlowRouter.go('/workordercard')
    }

        

})
