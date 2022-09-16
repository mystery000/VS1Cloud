import {SalesBoardService} from './sales-service';
import {PurchaseBoardService} from './purchase-service';
import {ReactiveVar} from 'meteor/reactive-var';
import {UtilityService} from "../utility-service";
import {ProductService} from "../product/product-service";
import {OrganisationService} from '../js/organisation-service';
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import {Random} from 'meteor/random';
import {jsPDF} from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import 'jquery-editable-select';
import {SideBarService} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
import {ContactService} from "../contacts/contact-service";
import { TaxRateService } from "../settings/settings-service";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let accountService = new SalesBoardService();
let times = 0;
let clickedInput = "";
let isDropDown = false;
let salesDefaultTerms = "";

var template_list = [
    "Sales Order",
    "Delivery Docket",
];

Template.new_workorder.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.workorderrecord = new ReactiveVar();
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.salesOrderId = new ReactiveVar();
    templateObject.workOrderRecords = new ReactiveVar([]);
    templateObject.workOrderLineId = new ReactiveVar(-1);
})

Template.new_workorder.onRendered(function(){
    const templateObject = Template.instance();
    let salesorderid = FlowRouter.current().queryParams.salesorderid;
    let lineId = FlowRouter.current().queryParams.lineId;
    templateObject.getWorkorderRecord = function() {
        setTimeout(()=>{
            $('.fullScreenSpin.fullScreenSpin_workorder').css('display', 'inline-block')
        }, 200)
        //check if there is any workorder which order number is matched to salesorderid.
        let workordersCount = 0;
        let workorders = templateObject.workOrderRecords.get().filter(order=>{
            return order.SalesOrderID == templateObject.salesOrderId.get();
        })
        workordersCount = workorders.length
        //end checking

        
        if(templateObject.salesOrderId.get()) {
            getVS1Data('TSalesOrderEx').then(function(dataObject){
                if(dataObject.length == 0) {
                    accountService.getOneSalesOrderdataEx(templateObject.salesOrderId.get()).then(function(data){
                        let currencySymbol = Currency;
                        let record = {
                            id: data.fields.ID + "_"+(workordersCount + 1).toString(),
                            salesorderid: data.fields.ID,
                            lid: 'Edit Work Order' + ' ' + data.fields.ID + ' - ' + (workordersCount+1).toString(),
                            customer: data.fields.CustomerName,
                            orderTo: data.fields.InvoiceToDesc,
                            ponumber: data.fields.CustPONumber,
                            saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                            duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                            line: data.fields.Lines[templateObject.workOrderLineId.get()]
                        }
                        record.line.fields.ShipDate = record.line.fields.ShipDate?moment(record.line.fields.ShipDate).format('DD/MM/YYYY'):''
                        templateObject.workorderrecord.set(record);
                        $('#edtCustomerName').val(record.customer)
                        $('.fullScreenSpin').css('display', 'none');

                    })
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tsalesorderex;
                    for(let d = 0; d< useData.length; d++) {
                        if(parseInt(useData[d].fields.ID) == templateObject.salesOrderId.get()) {
                            let record = {
                                id: useData[d].fields.ID + "_"+(workordersCount + 1).toString(),
                                salesorderid: useData[d].fields.fields.ID,
                                lid: 'Edit Work Order' + ' ' + useData[d].fields.ID + ' - ' + (workordersCount+1).toString(),
                                customer: useData[d].fields.CustomerName,
                                orderTo: useData[d].fields.InvoiceToDesc,
                                ponumber: useData[d].fields.CustPONumber,
                                saledate: useData[d].fields.SaleDate ? moment(useData[d].fields.SaleDate).format('DD/MM/YYYY') : "",
                                duedate: useData[d].fields.DueDate ? moment(useData[d].fields.DueDate).format('DD/MM/YYYY') : "",
                                line: useData[d].fields.Lines[templateObject.workOrderLineId.get()]
                            }
                            record.line.fields.ShipDate = record.line.fields.ShipDate?moment(record.line.fields.ShipDate).format('DD/MM/YYYY'):''

                            templateObject.workorderrecord.set(record);
                            $('#edtCustomerName').val(record.customer)
                            setTimeout(()=>{
                                $('.fullScreenSpin').css('display', 'none');
                            }, 2000)
                        }
                    }
                }
            }).catch(function() {
                accountService.getOneSalesOrderdataEx(templateObject.salesOrderId.get()).then(function(data){
                    let currencySymbol = Currency;
                    let record = {
                        id: data.fields.ID + "_"+(workordersCount + 1).toString(),
                        salesorderid: data.fields.ID,
                        lid: 'Edit Work Order' + ' ' + data.fields.ID + ' - ' + (workordersCount+1).toString(),
                        customer: data.fields.CustomerName,
                        orderTo: data.fields.InvoiceToDesc,
                        ponumber: data.fields.CustPONumber,
                        saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                        duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                        line: data.fields.Lines[templateObject.workOrderLineId.get()]
                    }
                    record.line.fields.ShipDate = record.line.fields.ShipDate?moment(record.line.fields.ShipDate).format('DD/MM/YYYY'):''
                    templateObject.workorderrecord.set(record);
                    $('#edtCustomerName').val(record.customer)
                    $('.fullScreenSpin').css('display', 'none');
                })
            })
        }
    }
    if(lineId) {
        templateObject.workOrderLineId.set(lineId);
    }
    if(salesorderid){
        templateObject.salesOrderId.set(salesorderid);
    }
    if(!salesorderid) {
        setTimeout(()=>{
            $('#salesOrderListModal').modal('toggle')
        }, 500)
    } else {
        templateObject.getWorkorderRecord();
    }

    setTimeout(()=>{
        $("#edtCustomerName").editableSelect();
    }, 500)

  
    //get all work orders 
    let temp = localStorage.getItem('TWorkorders');
    templateObject.workOrderRecords.set(temp?JSON.parse(temp):[]);

    //end getting work orders

  

})

Template.new_workorder.events({
    'click #salesOrderListModal table tr': function(event) {
        let workorderRecords = [];
        let templateObject = Template.instance();
        let salesorderid = $(event.target).closest('tr').find('.colSalesNo').text();
        templateObject.salesOrderId.set(salesorderid);
        workorderRecords = templateObject.workOrderRecords.get();
        getVS1Data('TSalesOrderEx').then(function(dataObject){
            if(dataObject.length == 0) {
                accountService.getOneSalesOrderdataEx(salesorderid).then(function(data) {
                  let lineItems = data.fields.Lines;
                  for(let i = 0; i< lineItems.length; i ++ ) {
                    let isExisting = false;
                    workorderRecords.map(order => {
                      if(order.Line.fields.productName == lineItems[i].fields.ProductName) {
                          isExisting = true
                      }
                    }) 
                  //   if(lineItems[i].fields.isManufactured == true && isExisting == false) {
                    if(isExisting == false) {
                      templateObject.workOrderLineId.set(i);
                      templateObject.getWorkorderRecord()
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
                                
                                workorderRecords.map(order => {
                                  if(order.Line.fields.productName == lineItems[i].fields.ProductName) {
                                      isExisting = true
                                  }
                                }) 
                            }

                          //   if(lineItems[i].fields.isManufactured == true && isExisting == false) {
                            if(isExisting == false) {
                              templateObject.workOrderLineId.set(i);
                              templateObject.getWorkorderRecord();
                              $('#salesOrderListModal').modal('toggle');
                              break
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
                      if(order.Line.fields.productName == lineItems[i].fields.ProductName) {
                      isExisting = true
                  }
                }) 
              //   if(lineItems[i].fields.isManufactured == true && isExisting == false) {
                if(isExisting == false) {
                  templateObject.workOrderLineId.set(i);
                  templateObject.getWorkorderRecord();
                  return
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

    'click .btnSave': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let record = templateObject.workorderrecord.get();
        let objDetail = {
            ID: record.id,
            Customer: $('#edtCustomerName').val() || '',
            OrderTo: $('#txabillingAddress').text() || '',
            PONumber: $('#ponumber').val()||'',
            SaleDate: $('#dtSODate').val() || '',
            DueDate: record.duedate,
            Line: record.line,
            BOM: {},
            SalesOrderID: templateObject.salesOrderId.get()
        }

        let tempArray = localStorage.getItem('TWorkorders');
        let workorders = tempArray?JSON.parse(tempArray): [];
        workorders = [...workorders, objDetail];
        localStorage.setItem('TWorkorders', JSON.stringify(workorders));
        $('.fullScreenSpin').css('display', 'none');
        swal({
            title: 'Success',
            text: 'Process has been saved successfully',
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Continue',
        }).then ((result)=>{
            FlowRouter.go('/workorderlist')
        })
        
    },

    'click #tblWorkOrderLine tbody tr': function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('#BOMSetupModal').modal('toggle')
    }
})

Template.new_workorder.helpers({
    workorderrecord: ()=>{
        return Template.instance().workorderrecord.get()
    },

    uploadedFile : () => {
        return Template.instance().uploadedFile.get()
    }
})

