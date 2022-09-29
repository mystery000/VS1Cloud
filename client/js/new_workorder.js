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
    templateObject.selectedInputElement = new ReactiveVar();
    templateObject.selectedProcessField = new ReactiveVar();
    templateObject.selectedProductField = new ReactiveVar();
    templateObject.isMobileDevices = new ReactiveVar(false);
})

Template.new_workorder.onRendered(function(){
    const templateObject = Template.instance();
    let salesorderid = FlowRouter.current().queryParams.salesorderid;
    let lineId = FlowRouter.current().queryParams.lineId;

    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))){
        templateObject.isMobileDevices.set(true);
    }
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
        let tempalteObject = Template.instance();
        let productName = $(event.target).closest('tr').find('input.lineProductName').val()
        let tempBOMs = localStorage.getItem('TProcTree');
        let bomProducts = tempBOMs?JSON.parse(tempBOMs):[];
        let bomIndex = bomProducts.findIndex(product=>{
            return product.fields.productName == productName
        })
        $('#edtMainProductName').val(productName);
        $('#BOMSetupModal').modal('toggle')
        $('#edtProcess').editableSelect();
        $('#BOMSetupModal .edtProductName').editableSelect();
        if(bomIndex > -1) {
            let product = bomProducts[bomIndex]
            $('.edtProcess').val(product.fields.process)
            $('.edtProcessNote').val(product.fields.processNote)
            
            let subs = product.fields.subs;
            if(!subs || subs.length == 0) {
                return
            }
            for(let i = 0; i< subs.length; i++) {
                let rows = $('#BOMSetupModal .modal-body').find('.product-content');
                let lastrow = rows[rows.length-1]
                let addedRow = "<div class='product-content'>"+
                "<div class='d-flex productRow'>"+
                "<div class='colProduct form-group d-flex'>";
                if(subs[i].raws && subs[i].raws.length > 0) {
                    addedRow += "<div style='width: 29%'><button class='btn btn-danger btn-from-stock w-100 px-0'>FROM STOCK</button></div>" +
                    "<select type='search' class='edtProductName form-control' style='width: 30%'></select>"+
                 "</div>"+
                 "<div class='colQty form-group'><input type='text' class='form-control edtQuantity w-100'/></div>"+
                 "<div class='colProcess form-group'><select type='search' class='edtProcessName form-control w-100' disabled style='background-color: #ddd'></select></div>"+
                 "<div class='colNote form-group'><input type='text' class='edtProcessNote form-control w-100' disabled style='background-color: #ddd'/></div>"+
                 "<div class='colAttachment form-group'><a class='btn btn-primary btnAddAttachment' role='button' data-toggle='modal' href='#myModalAttachment-MemoOnly' id='btn_Attachment' name='btn_Attachment'><i class='fa fa-paperclip' style='padding-right: 8px;'></i>Add Attachments</a><div class='d-none attachedFiles'></div></div>" +
                 "<div class='colDelete d-flex align-items-center justify-content-center'><button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button></div>" +
                "</div>"+
                "</div>";
                }else {
                    addedRow += "<div style='width: 29%'></div>" +
                    "<select type='search' class='edtProductName form-control' style='width: 30%'></select>"+
                    "</div>"+
                    "<div class='colQty form-group'><input type='text' class='form-control edtQuantity w-100'/></div>"+
                    "<div class='colProcess form-group'></div><div class='colNote form-group'></div><div class='colAttachment form-group'></div><div class='colDelete d-flex align-items-center justify-content-center'><button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button></div>"+
                   "</div>"+
                   "</div>";
                }
                $(lastrow).before(addedRow)
                let productContents = $('#BOMSetupModal .modal-body').find('.product-content');
                $(productContents[productContents.length-2]).find('.edtProductName').editableSelect();
                $(productContents[productContents.length-2]).find('.edtProcessName').editableSelect();

                $(productContents[productContents.length-2]).find('input.edtProductName').val(subs[i].product)
                $(productContents[productContents.length-2]).find('input.edtQuantity').val(subs[i].quantity)
                $(productContents[productContents.length-2]).find('input.edtProcessName').val(subs[i].process)
                $(productContents[productContents.length-2]).find('input.edtProcessNote').val(subs[i].note)

            }
        }

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

Template.new_workorder.events({
    'click #BOMSetupModal .edtProductName': function(event) {
        // let targetElement = $(event.target);
        // let templateObject = Template.instance();
        // templateObject.selectedInputElement.set(targetElement);
        // $('#productListModal').modal('toggle');


        let templateObject = Template.instance();
        let colProduct = $(event.target).closest('div.colProduct');
        $(event.target).editableSelect()
        templateObject.selectedProductField.set($(colProduct).children('.edtProductName'))
        // templateObject.selectedProductField.set($(event.target))
        $('#productListModal').modal('toggle');
    },

    'click #BOMSetupModal .edtProcessName': function(event) {
        let targetElement = $(event.target);
        let colProcess = $(event.target).closest('div.colProcess');
        let templateObject = Template.instance();
        $(event.target).editableSelect();
        templateObject.selectedProcessField.set($(colProcess).children('.edtProcessName'));
        $('#processListModal').modal('toggle');
    },

    'click #productListModal table tr': function(event) {
        let name = $(event.target).closest('tr').find('.productName').text();
        let templateObject = Template.instance();
        let targetElement = templateObject.selectedProductField.get();
        $(targetElement).val(name)
        let temp = localStorage.getItem('TProcTree');
        let bomProducts  = temp?JSON.parse(temp):[];
        let index = bomProducts.findIndex(product => {
            return product.fields.productName == name;
        })
        let removeDiv = $(targetElement).parent().find('div');
        $(removeDiv).remove();
        if(index > -1) {
            $(targetElement).before("<div style='width: 29%'><button class='btn btn-danger btn-from-stock w-100 px-0'>FROM STOCK</button></div>")
        
        let row = $(targetElement).closest('div.productRow');
        $(row).find('.colProcess').append("<select type='search' class='form-control edtProcessName'></select>")
        $(row).find('.colNote').append("<input type='text' class='form-control edtProcessNote'/>")
        $(row).find('.edtProcessName').editableSelect();
        $(row).find('.edtProcessName').val(bomProducts[index].fields.process)
        $(row).find('.edtProcessName').prop('disabled', true)
        $(row).find('.edtProcessName').css('background', '#ddd')
        $(row).find('.edtProcessNote').val(bomProducts[index].fields.processNote);
        $(row).find('.edtProcessNote').prop('disabled', true)
        $(row).find('.edtProcessNote').css('background', '#ddd');

        let parent = row.parent();


        let grandParent = parent.parent();
        let modalElement = $(row).closest('.modal#BOMSetupModal');
        let topParent = modalElement.parent();

        let colAttachment = $(row).find('.colAttachment')


        let productContentCount = $(grandParent).find('.product-content').length;
        $(colAttachment).append("<a class='btn btn-primary btnAddAttachment' role='button' data-toggle='modal' href='#myModalAttachment-"+productContentCount+"' id='btn_Attachment' name='btn_Attachment'>"+
                    "<i class='fa fa-paperclip' style='padding-right: 8px;'></i>Add Attachments</a><div class='d-none attachedFiles'></div>")

        let attachModalHtml = "<div class='modal fade' role='dialog' tabindex='-1' id='myModalAttachment-"+productContentCount+"'>" +
        "<div class='modal-dialog modal-dialog-centered' role='document'>" +
            "<div class='modal-content'>" +
                "<div class='modal-header'>" +
                    "<h4>Upload Attachments</h4><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>" +
                "</div>" +
                "<div class='modal-body' style='padding: 0px;'>" +
                    "<div class='divTable file-display'>" +
                        "<div class='col inboxcol1'>" +
                            "<img src='/icons/nofiles_icon.jpg' class=' style='width:100%;'>" +
                        "</div>" +
                        "<div class='col inboxcol2' style='text-align: center;'>" +
                            "<div>Upload files or add files from the file library.</div>"
                            if(templateObject.isMobileDevices.get() == true) {
                                attachModalHtml = attachModalHtml +"<div>Capture copies of receipt's or take photo's of completed jobs.</div>"
                            }


                                        attachModalHtml = attachModalHtml + "<p style='color: #ababab;'>Only users with access to your company can view these files</p>" +
                                    "</div>" +
                                "</div>" +
                            "</div>"+
                            "<div class='modal-footer'>";
                            if(templateObject.isMobileDevices.get() == true) {
                                attachModalHtml = attachModalHtml +"<input type='file' class='img-attachment-upload' id='img-attachment-upload' style='display:none' accept='image/*' capture='camera'>" +
                                "<button class='btn btn-primary btnUploadFile img_new_attachment_btn' type='button'><i class='fas fa-camera' style='margin-right: 5px;'></i>Capture</button>" +

                                "<input type='file' class='attachment-upload' id='attachment-upload' style='display:none' multiple accept='.jpg,.gif,.png'>"
                            }else {
                                attachModalHtml = attachModalHtml + "<input type='file' class='attachment-upload' id='attachment-upload' style='display:none' multiple accept='.jpg,.gif,.png,.bmp,.tiff,.pdf,.doc,.docx,.xls,.xlsx,.ppt," +
                                ".pptx,.odf,.csv,.txt,.rtf,.eml,.msg,.ods,.odt,.keynote,.key,.pages-tef," +
                                ".pages,.numbers-tef,.numbers,.zip,.rar,.zipx,.xzip,.7z,image/jpeg," +
                                "image/gif,image/png,image/bmp,image/tiff,application/pdf," +
                                "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
                                "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
                                "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation," +
                                "application/vnd.oasis.opendocument.formula,text/csv,text/plain,text/rtf,message/rfc822," +
                                "application/vnd.ms-outlook,application/vnd.oasis.opendocument.spreadsheet," +
                                "application/vnd.oasis.opendocument.text,application/x-iwork-keynote-sffkey," +
                                "application/vnd.apple.keynote,application/x-iwork-pages-sffpages," +
                                "application/vnd.apple.pages,application/x-iwork-numbers-sffnumbers," +
                                "application/vnd.apple.numbers,application/zip,application/rar," +
                                "application/x-zip-compressed,application/x-zip,application/x-7z-compressed'>"
                            }
                            attachModalHtml = attachModalHtml +
                                "<button class='btn btn-primary btnUploadFile new_attachment_btn' type='button'><i class='fa fa-cloud-upload' style='margin-right: 5px;'></i>Upload</button>" +
                                "<button class='btn btn-success closeModal' data-dismiss='modal' type='button' style='margin-right: 5px;' autocomplete='off'>" +
                                    "<i class='fa fa-save' style='padding-right: 8px;'></i>Save" +
                                "</button>" +
                                "<button class='btn btn-secondary' data-dismiss='modal' type='button'><i class='fa fa-remove' style='margin-right: 5px;'></i>Close</button>" +
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>"
                    topParent.append(attachModalHtml);

                }else {
                    $(targetElement).before("<div style='width: 29%'></div>")
                }
        $('#productListModal').modal('toggle')
    },

    'click #processListModal table tr': function(event) {
        let templateObject = Template.instance()
        let processName = $(event.target).closest('tr').find('.colProcessName').text();
        let selEle = templateObject.selectedProcessField.get();
        selEle.val(processName);
        $('#processListModal').modal('toggle')
    },


    'click .btn-remove-raw': function(event) {
        let row = $(event.target).closest('div.productRow');
        let productName = $(row).find('.edtProductName').val();
        let content = $(event.target).closest('div.product-content');
        let rowCount = $(content).find('.productRow').length;
        if (rowCount == 1 || $(content).first().find('.edtProductName').val() == productName) {
            $(content).remove();
        } else {
            $(row).remove();
        }
    },

    'click #BOMSetupModal .btnAddProduct': function (event) {
        let row = $(event.target).closest('.productRow');
        let tempObject = Template.instance();
        let parent = row.parent();


        let grandParent = parent.parent();
        let modalElement = $(row).closest('.modal#BOMSetupModal');
        let topParent = modalElement.parent();

        let count = $(grandParent).find('.product-content').length;
        if(count > 1) {
            let lastRow = $(grandParent).find('.product-content')[count-2];
            if(lastRow && lastRow != null) {
                if ($(lastRow).find('.edtProductName').val() == '' || $(lastRow).find('.edtProcessName').val()== '' || $(lastRow).find('.edtQuantity').val() == '') {
                    return 
                }
            }
        }

        
        let colProduct = row.find('.colProduct');
        let colQty = row.find('.colQty');
        let colProcess = row.find('.colProcess');
        let colNote = row.find('.colNote');
        let colAttachment = row.find('.colAttachment');
        let colDelete = row.find('.colDelete');
        $(colProduct).prepend("<div style='width: 29%'></div><select class='edtProductName edtRaw form-control' id='edtRaw' type='search' style='width: 30%'></select>")
        $(event.target).remove()
        $(colProduct).find('.edtProductName').editableSelect()
        $(colQty).append("<input type='text' class='form-control edtQuantity w-100'/>");
        // $(colProduct).append("<button type='button' class='btnShowSub btn btn-primary'>Show Sub</button>");
        // $(colProcess).append("<select class='edtProcessName form-control w-100' type='search' ></select>")
        $(colProcess).find('.edtProcessName').editableSelect();
        // $(colNote).append("<input class='w-100 form-control edtProcessNote' type='text'/>");
        $(colDelete).addClass('d-flex align-items-center justify-content-center')
        $(colDelete).append("<button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button>")

       

        grandParent.append("<div class='product-content'><div class='d-flex productRow'>" +
                        "<div class='colProduct  d-flex form-group'>" +
                        "<button class='btn btn-primary btnAddProduct' style='width: 29%;'>Product+</button>" +
                        "</div>" +
                        "<div class='colQty form-group'>" +
                        "</div>" +
                        "<div class='colProcess form-group'>" +
                        "</div>" +
                        "<div class='colNote form-group'>" +
                        "</div>" +
                        "<div class='colAttachment form-group'></div>" +
                        "<div class='colDelete'>" +
                        "</div>" +
                        "</div></div>")
        
    },

    'click #BOMSetupModal .btn-from-stock': function(event) {
        let row = $(event.target).closest('.product-content');
        let templateObject = Template.instance();
        let temp = localStorage.getItem('TProcTree');
        let bomProducts = temp?JSON.parse(temp):[];
        let productName = $(event.target).closest('.productRow').find('.edtProductName').val();
        let processName = $(event.target).closest('.productRow').find('.edtProcessName').val();
        let quantity = $(event.target).closest('.productRow').find('.edtQuantity').val();
        let bomIndex = bomProducts.findIndex(product=>{
            let pContent = $('#BOMSetupModal').find('.product-content')[0];

            return product.fields.productName == $(pContent).find('.edtProductName').val()
        })
        if(productName == '' || quantity == '' || processName == '') {
            return
        }

        if(bomIndex > -1) {
            let index = bomProducts[bomIndex].fields.subs.findIndex(product => {
                return product.product == productName;
            });
            let subs = bomProducts[bomIndex].fields.subs[index].raws
            if(index > -1) {
                $(event.target).remove()
                if(subs && subs.length) {
                    for (let i = 0; i < subs.length; i++) {
                        $(row).append("<div class='d-flex productRow'>" +
                            "<div class= 'd-flex colProduct form-group'>" +
                            "<div style='width: 60%'></div>" +
                            "<select class='edtProductName edtRaw form-control' type='search' style='width: 40%'></select>" +
                            "</div>" +
                            "<div class='colQty form-group'>" +
                            "<input type='text' class='edtQuantity w-100 form-control' value='" + subs[i].rawQty + "'/>" +
                            "</div>" +
                            "<div class='colProcess form-group'>"+
                            // "<select type='search' autocomplete='off' class='edtProcessName form-control w-100 es-input' ></select>"+
                            "</div>" +
                            "<div class='colNote form-group'></div>" +
                            "<div class='colAttachment'></div>" +
                            "<div class='d-flex colDelete align-items-center justify-content-center'><button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button></div>" +
                            "</div>")
                            
                        let elements = $(row).find('.edtProductName')
                        $(elements[elements.length - 1]).editableSelect();
                        let inputElements = $(row).find('input.edtProductName');
                            $(inputElements[inputElements.length - 1]).val(subs[i].rawName)
                        let processes = $(row).find('.edtProcessName');
                        $(processes[processes.length - 1]).editableSelect();
                        let processElements = $(row).find('input.edtProcessName');
                        $(processElements[processElements.length - 1]).val(subs[i].rawProcess)
                    }
                }
                    
            }

            let processElement = $(event.target).closest('.productRow').find('.edtProcessName');
            $(processElement).css('background', 'transparent');
            $(processElement).prop('disabled', false);
            let noteElement = $(event.target).closest('.productRow').find('edtProcessNote');
            $(noteElement).css('background', 'transparent');
            $(noteElement).prop('disabled', false);

            let parent = $(event.target).parent();
            $(event.target).remove();
            $(parent).append("<button class='btn btn-success w-100 px-0 btn-product-build'>BUILD</button>")
        }

      
    },

    'click #BOMSetupModal .btnAddSubProduct': function(event) {
        let button  = $(event.target).closest('button.btnAddSubProduct');
        let tempObject = Template.instance();
        let row = $(event.target).closest('.productRow');
        let colProduct = row.find('.colProduct');
        let colQty = row.find('.colQty');
        let colProcess = row.find('.colProcess');
        let colNote = row.find('.colNote');
        let colAttachment = row.find('.colAttachment');
        let colDelete = row.find('.colDelete');

        if($(colProduct).find('.edtProductName').val() != '') {
            if($(colQty).find('.edtQuantity').val() != '') {
                let quantity = $(colQty).find('.edtQuantity').val();
                let edtRaw = colProduct.find('.edtProductName')
                $(event.target).remove();
                $(button).remove();
                $(colDelete).addClass('d-flex align-items-center justify-content-center')
                $(colDelete).append("<button class='btn btn-danger btn-rounded btn-sm my-0 btn-remove-raw'><i class='fa fa-remove'></i></button>")
                let parent = row.parent();
           
                $(parent).append("<div class='d-flex productRow'>"+
                "<div class='d-flex colProduct form-group'>"+
                "<div class='d-flex align-items-center justify-content-end form-group' style='width: 60%'>"+
                "<button class='btn btn-primary w-25 d-flex align-items-center justify-content-center form-control btnAddSubProduct'><span class='fas fa-plus'></span></button>" +
                "</div>"+
                "<select class='edtProductName edtRaw form-control' type='search' style='width: 40%'></select>" +
                "</div>"+
                "<div class='colQty'>" +
                "<input type='text' class='edtQuantity w-100 form-control' />" +
                "</div>"+
                "<div class='colProcess form-group'>"+
                "<select type='search' autocomplete='off' class='edtProcessName form-control w-100 es-input' ></select>"+
                "</div>" +
                "<div class='colNote form-group'></div>" +
                "<div class='colAttachment'></div>" +
                "<div class='colDelete'></div>"+
                "</div>")
                let eles = $(parent).find('.edtProductName')
                $(eles[eles.length - 1]).editableSelect();
                let procElements = $(parent).find('.edtProcessName')
                $(procElements[procElements.length -1]).editableSelect()
            }
        }
    },
})

