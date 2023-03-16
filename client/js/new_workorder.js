import {SalesBoardService} from './sales-service';
import {PurchaseBoardService} from './purchase-service';
import {ReactiveVar} from 'meteor/reactive-var';
import {UtilityService} from "../utility-service";
import {ProductService} from "../product/product-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jQuery.print/jQuery.print.js';
import 'jquery-editable-select';
import {SideBarService} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
import {ContactService} from "../contacts/contact-service";
import { Template } from 'meteor/templating';
import '../manufacture/frm_workorder.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { cloneDeep, template } from 'lodash';
// import '../manufacture/bomlistpop.js';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let accountService = new SalesBoardService();
let productService = new ProductService();
let contactService = new ContactService();
let purchaseService = new PurchaseBoardService();
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
    templateObject.bomStructure = new ReactiveVar();
    templateObject.quantityBuild = new ReactiveVar(true);
    templateObject.showBOMModal = new ReactiveVar(false);
    templateObject.bomProducts = new ReactiveVar([]);
    templateObject.isSaved = new ReactiveVar(false);
    templateObject.updateFromPO = new ReactiveVar(false);
    templateObject.isCompleted = new ReactiveVar(false);
    templateObject.targetProductField = new ReactiveVar();
})

Template.new_workorder.onRendered(async function(){
    const templateObject = Template.instance();
    let salesorderid = FlowRouter.current().queryParams.salesorderid;
    let lineId = FlowRouter.current().queryParams.lineId;

    if(FlowRouter.current().queryParams.id) {
        templateObject.isSaved.set(true)
    }

    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))){
        templateObject.isMobileDevices.set(true);
    }

    templateObject.getAllBOMProducts = async()=>{
        return new Promise(async(resolve, reject)=> {
            getVS1Data('TProcTree').then(function(dataObject){
                if(dataObject.length == 0) {
                    productService.getAllBOMProducts(initialBaseDataLoad, 0).then(function(data) {
                        templateObject.bomProducts.set(data.tproctree);
                        resolve();
                    })
                }else {
                    let data = JSON.parse(dataObject[0].data);
                    templateObject.bomProducts.set(data.tproctree);
                    resolve();
                }
            }).catch(function(e) {
                productService.getAllBOMProducts(initialBaseDataLoad, 0).then(function(data) {
                    templateObject.bomProducts.set(data.tproctree);
                    resolve()
                })
            })
        })
    }
    //get all bom products
    await templateObject.getAllBOMProducts();

    //get all work orders
    templateObject.getAllWorkorders = async function() {
        return new Promise(async(resolve, reject)=>{
            getVS1Data('TVS1Workorder').then(function(dataObject){
                if(dataObject.length == 0) {
                    resolve ([]);
                }else  {
                    let data = JSON.parse(dataObject[0].data);
                    resolve(data.tvs1workorder)
                }
            })
        })
    }
    let temp = await templateObject.getAllWorkorders()
    templateObject.workOrderRecords.set(temp);


    templateObject.getCustomerData = async function(customername = 'Workshop') {
        return new Promise(async(resolve, reject)=> {
            getVS1Data('TCustomerVS1').then(function(dataObject){
                if(dataObject.length == 0) {
                    contactService.getOneCustomerDataExByName(customername).then(function(data){
                        $('.fullScreenSpin').css('display', 'none')
                        resolve(data.tcustomer[0].fields)

                    }).catch(function(err){
                        $('.fullScreenSpin').css('display', 'none')
                        resolve({ClientID: '', ClientName: customername, Companyname: customername,  Email: '', Street: '', Street2: '', Suburb: '', State: '', Postcode: '', Country: ''})
                    })
                }else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tcustomervs1;
                    let added = true
                    for(let i = 0; i< useData.length; i++) {
                        if(useData[i].fields.ClientName == customername) {
                            added = false
                            $('.fullScreenSpin').css('display', 'none')
                            resolve(useData[i].fields)
                        }
                    }

                    if(added == true) {
                        contactService.getOneCustomerDataExByName(customername).then(function(data){
                            $('.fullScreenSpin').css('display', 'none')
                            resolve(data.tcustomer[0].fields)
                        }).catch(function(error){
                            $('.fullScreenSpin').css('display', 'none')
                            resolve({ClientID: '',ClientName: customername, Companyname: customername,  Email: '', Street: '', Street2: '', Suburb: '', State: '', Postcode: '', Country: ''})
                        })
                    }
                }
            }).catch(function (e) {
                contactService.getOneCustomerDataExByName(customername).then(function(data){
                    $('.fullScreenSpin').css('display', 'none')
                    resolve(data.tcustomer[0].fields)
                }).catch(function(error){
                    $('.fullScreenSpin').css('display', 'none')
                    resolve({ClientID: '', ClientName: customername, Companyname: customername,  Email: '', Street: '', Street2: '', Suburb: '', State: '', Postcode: '', Country: ''})
                })
            })
        })
    }


    templateObject.getWorkorderRecord = async function() {
        if(FlowRouter.current().queryParams.id) {
            $('.fullScreenSpin').css('display', 'inline-block')
            let orderid = FlowRouter.current().queryParams.id
            let workorderIndex = templateObject.workOrderRecords.get().findIndex(order => {
                return order.fields.ID == orderid
            })
            let workorder = templateObject.workOrderRecords.get()[workorderIndex]
            // if(workorder.fields.StoppedTime && new Date(workorder.fields.StoppedTime).getTime() < new Date().getTime()) {
            //     templateObject.isCompleted = true;
            // }
           

            let isCompleted = false
            
            if(workorder.fields.IsCompleted == true) {
                isCompleted = true;
               
                templateObject.isCompleted.set(true);
                
            }

            templateObject.salesOrderId.set(workorder.fields.SaleID)
            let customerData = await templateObject.getCustomerData(workorder.fields.Customer);
            let record = {
                id: orderid,
                salesorderid: workorder.fields.SaleID,
                lid: 'Edit Work Order ' + orderid,
                customer: workorder.fields.Customer || '',
                ClientName: workorder.fields.Customer || '',
                CustomerID: customerData.ID,
                ClientEmail: customerData.Email,
                invoiceToDesc: workorder.fields.OrderTo || '',
                custPONumber: workorder.fields.PONumber  || '',
                saledate: workorder.fields.SaleDate || "",
                duedate: workorder.fields.DueDate || "",
                // line: workorder.Line,
                productname: workorder.fields.ProductName || "",
                productDescription: workorder.fields.ProductDescription || "",
                quantity: workorder.fields.Quantity || 1,
                shipDate: workorder.fields.ShipDate || "",
                isStarted: workorder.fields.InProgress,
                poStatus: workorder.fields.POStatus,
                status: workorder.fields.Status,
                showSchedule: isCompleted == false && workorder.fields.Status == 'unscheduled'? true: false,
                showUnschedule: isCompleted == false && workorder.fields.Status == 'scheduled'? true: false,
                showTimerStart: isCompleted == false &&  workorder.fields.Status == 'scheduled' ? true : false,
                showTimerPause: isCompleted == false &&  (workorder.fields.Status == 'started' || workorder.fields.Status == 'resumed') ? true: false,
                showTimerStop: isCompleted == false &&  (workorder.fields.Status == 'started' || workorder.fields.Status == 'resumed' || workorder.fields.Status =='paused') ? true: false,
                showTimerResume: isCompleted == false &&  workorder.fields.Status == 'paused'? true: false,
                showQAStart: isCompleted == false &&  workorder.fields.Status == 'stopped'? true: false,
                showQAPause: isCompleted == false &&  (workorder.fields.Status == 'QAStarted' || workorder.fields.Status == 'QAResumed')? true: false,
                showQAResume: isCompleted == false &&  workorder.fields.Status == 'QAPaused'? true : false,
                showQAStop: isCompleted == false &&  (workorder.fields.Status == 'QAStarted' || workorder.fields.Status == 'QAResumed' || workorder.fields.Status == 'QAPaused')? true: false,
                trackedTime: workorder.fields.TrackedTime || 0,
                startedTimes: JSON.parse(workorder.fields.StartedTimes),
                pausedTimes: JSON.parse(workorder.fields.PausedTimes),
                stoppedTime: workorder.fields.StoppedTime,
                startTime: workorder.fields.StartTime,
                showCompleteProcess: isCompleted == false &&  workorder.fields.Status == 'QAStopped'  ? true: false,
                isCompleted: isCompleted
            }
            templateObject.updateFromPO.set(workorder.fields.UpdateFromPO)
            templateObject.workorderrecord.set(record);
            templateObject.bomStructure.set(JSON.parse(workorder.fields.BOMStructure));
            templateObject.showBOMModal.set(true)
            $('#edtCustomerName').val(record.customer)
            $('.fullScreenSpin').css('display', 'none');

        }else {
                $('.fullScreenSpin').css('display', 'inline-block')

            //check if there is any workorder which order number is matched to salesorderid.
            let workordersCount = 0;
            let workorders = [];
            let tempArray = templateObject.workOrderRecords.get();
            if (tempArray.length > 0) {
                workorders = templateObject.workOrderRecords.get().filter(order=>{
                    return order.fields.SaleID == templateObject.salesOrderId.get();
                })
            }
            workordersCount = workorders.length
            //end checking
            if(templateObject.salesOrderId.get()) {
                async function getRecord () {
                    return new Promise((resolve, reject) => {
                        getVS1Data('TSalesOrderEx').then(function(dataObject) {
                            if(dataObject.length == 0) {
                                accountService.getOneSalesOrderdataEx(templateObject.salesOrderId.get()).then(function(data){
                                    resolve(data)
                                })
                            }else {
                                let data = JSON.parse(dataObject[0].data);
                                let useData = data.tsalesorderex;
                                let added = true;
                                for(let i=0; i< useData.length; i++) {
                                    if(parseInt(useData[d].fields.ID) == templateObject.salesOrderId.get()){
                                        added = false;
                                        resolve(useData[d])
                                    }
                                }
                                if(added == true) {
                                    accountService.getOneSalesOrderdataEx(templateObject.salesOrderId.get()).then(function(data){
                                        resolve(data)
                                    }).catch (function(e){
                                    }) 
                                }
                            }
                        }).catch(
                            accountService.getOneSalesOrderdataEx(templateObject.salesOrderId.get()).then(function(data){
                                resolve(data)
                            })
                        )
                    })
                }

                let data = await getRecord();
                let record = {
                    id: data.fields.ID + "_"+(workordersCount + 1).toString(),
                    salesorderid: data.fields.ID,
                    lid: 'Edit Work Order' + ' ' + data.fields.ID + '_' + (workordersCount+1).toString(),
                    customer: data.fields.CustomerName,
                    ClientName: data.fields.CustomerName || '',
                    ClientEmail: data.fields.ContactEmail || '',
                    CustomerID: data.fields.CustomerID,
                    invoiceToDesc: data.fields.InvoiceToDesc,
                    custPONumber: data.fields.CustPONumber,
                    saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                    duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                    // line: data.fields.Lines[templateObject.workOrderLineId.get()],
                    productname: data.fields.Lines[templateObject.workOrderLineId.get()].fields.ProductName || "",
                    productDescription: data.fields.Lines[templateObject.workOrderLineId.get()].fields.Product_Description || "",
                    quantity: data.fields.Lines[templateObject.workOrderLineId.get()].fields.Qty || 1,
                    shipDate: data.fields.Lines[templateObject.workOrderLineId.get()].fields.ShipDate || "",
                    poStatus: 'not created',
                    status: 'unscheduled',
                    showSchedule: false,
                    showUnschedule: false,
                    showTimerStart: false,
                    showTimerStop: false,
                    showTimerPause: false,
                    showTimerResume: false,
                    trackedTime: 0,
                    startedTimes: [],
                    pausedTimes: [],
                    stoppedTime: '',
                    startTime: '',
                    showQAStart: false,
                    showQAStop: false,
                    showQAResume: false,
                    showQAPause: false,
                    showCompleteProcess: false,
                    isCompleted: false
                }
                templateObject.workorderrecord.set(record);
                templateObject.showBOMModal.set(true)
                let name = record.productname;
                let bomProductsTemp = templateObject.bomProducts.get();
                let index = bomProductsTemp.findIndex(product=>{
                    return product.Caption == name;
                })
                if(index == -1) {
                    productService.getOneBOMProductByName(name).then(function(data){
                        if(data.tproctree.length>0) {
                            templateObject.bomStructure.set(data.tproctree[0])
                        }
                    })
                }else {
                    templateObject.bomStructure.set(bomProductsTemp[index])
                }
                // templateObject.bomStructure.set(bomProductsTemp[index].fields)
                $('#edtCustomerName').val(record.customer)
                // setTimeout(()=>{
                    $('.fullScreenSpin').css('display', 'none');
                // }, 15000)

            }else {
                
                let customerData = await templateObject.getCustomerData();
                let orderAddress = customerData.Companyname + '\n' + customerData.Street+" "+customerData.Street2 + '\n'+ customerData.State+'\n' + customerData.Postcode + ' ' + customerData.Country
                let record = {
                    id: '',
                    salesorderid: '',
                    lid: 'New WorkOrder',
                    customer: 'Workshop',
                    ClientName: 'Workshop',
                    CustomerID: customerData.ID || 2,
                    ClientEmail: '',
                    invoiceToDesc: orderAddress,
                    custPONumber: '',
                    saledate: moment().format('DD/MM/YYYY'),
                    duedate: moment().format('DD/MM/YYYY'),
                    // line: useData[d].fields.Lines[templateObject.workOrderLineId.get()],
                    productname: "",
                    productDescription: "",
                    quantity: 1,
                    shipDate: moment().format('DD/MM/YYYY'),
                    poStatus: 'not created',
                    status: 'unscheduled',
                    showSchedule: false,
                    showUnschedule: false,
                    showTimerStart: false,
                    showTimerStop: false,
                    showTimerPause: false,
                    showTimerResume: false,
                    trackedTime: 0,
                    startedTimes: [],
                    pausedTimes: [],
                    stoppedTime: '',
                    startTime: '',
                    showQAStart: false,
                    showQAStop: false,
                    showQAResume: false,
                    showQAPause: false,
                    showCompleteProcess: false,
                    isCompleted: false
                }
                templateObject.workorderrecord.set(record);
                $('.fullScreenSpin').css('display', 'none');
                // this.$('#edtCust')

            }
        }
    }
    if(lineId) {
        templateObject.workOrderLineId.set(lineId);
    }
    if(salesorderid){
        templateObject.salesOrderId.set(salesorderid);
    }
    if(!salesorderid) {
        if(FlowRouter.current().queryParams.id) {
            templateObject.getWorkorderRecord();
        } else {
            await templateObject.getWorkorderRecord();
            // setTimeout(()=>{
            //     $('#bomListModal').modal('toggle')
            // }, 1000)
        }
    } else {
        templateObject.getWorkorderRecord();
    }



    setTimeout(()=>{
        $("#edtCustomerName").editableSelect();
    }, 500)

    //end getting work orders

    templateObject.changeWorkorderStatus = function(status) {

        const formatTime = milliseconds => {
            const seconds = Math.floor((milliseconds / 1000) % 60);
            const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
            const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

            return [
                hours.toString().padStart(2, "0"),
                minutes.toString().padStart(2, "0"),
                seconds.toString().padStart(2, "0")
            ].join(":");
        }
        let workorders = templateObject.workOrderRecords.get();
        let tempOrders  = cloneDeep(workorders);
        let id = FlowRouter.current().queryParams.id;
        // if(!id) {return}
        let orderIndex = tempOrders.findIndex(order => {
            return order.fields.ID == id;
        })
        if(orderIndex > -1) {
            let tempOrder = tempOrders[orderIndex];
            let startedTimes = tempOrder.fields.StartedTimes !=''? JSON.parse(tempOrder.fields.StartedTimes): [];
            let pausedTimes = tempOrder.fields.PausedTimes!= ''? JSON.parse(tempOrder.fields.PausedTimes): [];
            let record = templateObject.workorderrecord.get();
            tempOrder.fields.Status = status;
            if(status == 'scheduled') {
                record.showSchedule = false
                record.showTimerStart = true;
                record.showUnschedule = true
            }
            if(status == 'unscheduled') {
                record.showSchedule = true;
                record.showUnschedule = false;
            }
            if(status == 'started' || status == 'resumed' || status == 'QAStarted' || status == 'QAResumed') {
                if(status == 'started') {
                    tempOrder.fields.StartTime = new Date();
                    record.isStarted = true
                }
                startedTimes.push(new Date());
                tempOrder.fields.StartedTimes = JSON.stringify(startedTimes)
                record.startedTimes = startedTimes;
                // if(status == 'scheduled') {
                //     record.showSchedule = false
                //     record.showTimerStart = true;
                //     record.showUnschedule = true
                // }
                // if(status == 'unscheduled') {
                //     record.showSchedule = true;
                //     record.showUnschedule = false;
                // }
                if(status == 'started' ||  status == 'resumed') {
                    record.showTimerPause = true;
                    record.showTimerStop = true;
                    record.showTimerStart = false;
                    record.showTimerResume = false;
                }
                if(status == 'QAStarted' || status == 'QAResumed') {
                    record.showQAStart = false;
                    record.showQAResume = false;
                    record.showQAPause = true;
                    record.showQAStop = true;
                }
            }
            if(status == 'paused' || status == 'stopped' || status == 'QAPaused' || status == 'QAStopped') {
                let trackedTime = tempOrder.fields.TrackedTime;
                // if(status == 'paused') {
                    pausedTimes.push(new Date());
                 if(status == 'QAStopped') {
                    let stoppedTime = new Date();
                    tempOrder.fields.StoppedTime = stoppedTime;
                    record.stoppedTime = stoppedTime
                }
                if(status == 'paused' || status == 'QAPaused' || ((status == 'stopped' || status == 'QAStopped') && new Date(startedTimes[startedTimes.length - 1]).getTime() > new Date(pausedTimes[pausedTimes.length -2]).getTime())) {
                    trackedTime = trackedTime + (new Date().getTime() - new Date(startedTimes[startedTimes.length -1]).getTime())
                }

                tempOrder.fields.PausedTimes = JSON.stringify(pausedTimes);
                tempOrder.fields.TrackedTime = trackedTime;
                record.trackedTime = trackedTime;
                record.pausedTimes = pausedTimes;
                if(status == 'paused') {
                    record.showTimerPause = false
                    record.showTimerResume = true;
                } else if (status == 'stopped') {
                    record.showTimerStart = false;
                    record.showTimerPause = false;
                    record.showTimerStop = false;
                    record.showTimerResume = false;
                    record.showQAStart = true;
                } else if (status == 'QAPaused') {
                    record.showQAPause = false;
                    record.showQAResume = true
                } else if (status == 'QAStopped') {
                    record.showQAStart = false;
                    record.showQAPause = false;
                    record.showQAResume = false;
                    record.showQAStop = false;
                    record.showCompleteProcess = true;
                }
            }

            if(status == 'QAStarted' || status == 'QAResumed') {

            }

            record.status = status;
            templateObject.workorderrecord.set(record);
            tempOrders.splice(orderIndex, 1, tempOrder);
            templateObject.workOrderRecords.set(tempOrders);
            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: tempOrders})).then(function(){})
        }


    }

    if(templateObject.isCompleted.get()) {
     
        $("#workorder-detail :input").prop("disabled", true);  

        
    }

})

Template.new_workorder.events({

    'click .btnSave': function(event) {
        event.stopPropagation();
        event.preventDefault()
        let templateObject = Template.instance();

        playSaveAudio();
        if(!FlowRouter.current().queryParams.id) {
            swal({
                title: 'Question',
                text: 'Do you want to forward this order to vendor service?',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(async (result)=>{
                if(result.value) {
                    let record = templateObject.workorderrecord.get();
                    let productData = await getProductData(record.productname)
                    let splashLineArray = [];
                    let tdunitprice = utilityService.modifynegativeCurrencyFormat(Math.floor(productData.BuyQty1Cost * 100) / 100);

                    async function getTaxRate ()  {
                        return new Promise(async(resolve, reject)=> {

                            getVS1Data('TTaxcodeVS1').then(function(dataObject){
                                if(dataObject.length == 0) {
                                    let data = JSON.parse(dataObject[0].data);
                                    let useData = data.ttaxcodevs1;
                                    let index = useData.findIndex(taxCode=>{
                                        return taxCode.CodeName == productData.TaxCodePurchase
                                    })
                                    if(index == -1) {
                                        sideBarService.getTaxRateVS1ByName(productData.TaxCodePurchase).then(function(data){
                                            resolve(data.ttaxcodevs1[0].Rate)
                                        })
                                    }else {
                                        resolve(useData[index].Rate)
                                    }

                                }else {
                                    sideBarService.getTaxRateVS1ByName(productData.TaxCodePurchase).then(function(data){
                                        resolve(data.ttaxcodevs1[0].Rate)
                                    })
                                }
                            }).catch(function(err){
                                sideBarService.getTaxRateVS1ByName(productData.TaxCodePurchase).then(function(data){
                                    resolve(data.ttaxcodevs1[0].Rate)
                                })
                            })
                        })
                    }
                    let taxRate = await getTaxRate()
                    let lineItemObjForm = {
                        type: "TPurchaseOrderLine",
                        fields: {
                            ProductName: record.productname || '',
                            ProductDescription: productData.ProductDescription || '',
                            UOMQtySold: record.quantity,
                            UOMQtyShipped: 0,
                            UOMQtyBackOrder: record.quantity,
                            LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                            CustomerJob: record.customer || '',
                            LineTaxCode: productData.TaxCodePurchase || '',
                            LineTaxRate: taxRate || 0,
                            LineClassName: defaultDept
                        }
                    };

                    splashLineArray.push(lineItemObjForm);
                    $('.fullScreenSpin').css('display', 'none')
                    localStorage.setItem("newPOParamItem", JSON.stringify(splashLineArray))
                    swal({
                        title: 'Question',
                        text: 'Do you want to update work orders based on purchase order status changes?',
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then(async (res)=>{
                        if(res.value) {
                            templateObject.updateFromPO.set(true);
                            await saveOrders(true)
                        } else if(res.dismiss == 'cancel') {
                            templateObject.updateFromPO.set(false)
                            await saveOrders(true)
                        }
                    })

                }else if(result.dismiss == 'cancel') {
                    swal({
                        title: 'Warning',
                        text: 'For the required raws and materials, if there is not enough for building in stock, will create purchase order automatically',
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonText: 'Continue',
                    }).then ((result)=>{
                        saveOrders(false);
                    });
                }
            })
        } else {
                saveOrders(false);
        }


        async function getProductData(productName) {
            return new Promise(async(resolve, reject)=> {
                let record = templateObject.workorderrecord.get();
                getVS1Data('TProductVS1').then(async function(dataObject){
                    if(dataObject.length == 0) {
                        productService.getOneProductdatavs1byname(productName).then(function(data){
                            resolve(data.tproduct[0].fields)
                        })
                    }else {
                         let added = false;
                         let data = JSON.parse(dataObject[0].data);
                         let useData = data.tproduct;
                         let index = useData.findIndex(item=>{
                            return item.fields.ProductName == productName
                         })
                         if(index == -1) {
                            productService.getOneProductdatavs1byname(productName).then(function(data){
                                resolve(data.tproduct[0].fields)
                            })
                         }else {
                            resolve(useData[index].fields)
                         }
                    }
                }).catch(function(err){
                    productService.getOneProductdatavs1byname(productName).then(function(data){
                        resolve(data.tproduct[0].fields)
                    })
                })
            })
        }

        async function saveOrders (vendorService) {
            setTimeout(async function(){
                $('.fullScreenSpin').css('display', 'inline-block');
                let mainOrderStart = new Date();

                async function getSupplierDetail ()  {
                    return new Promise(async(resolve, reject)=>{
                        let supplierName = 'Misc Supplier';

                        contactService.getOneSupplierDataExByName(supplierName).then(function(dataObject) {
                            let data = dataObject.tsupplier;
                            if(data.length > 0) {
                                let clientName = data[0].fields.ClientName;
                                let street = data[0].fields.Street || '';
                                let city = data[0].fields.Street2 || '';
                                let state = data[0].fields.State || '';
                                let zipCode = data[0].fields.Postcode || '';
                                let country = data[0].fields.Country || '';

                                let postalAddress = data[0].fields.ClientName + '\n' + street + '\n' + city + ' ' + state + ' ' + zipCode + '\n' + country;
                                resolve(postalAddress)
                            }else {
                                resolve('')
                            }
                        }).catch(function(e) {
                            resolve('')
                        })
                    })


                }

                async function createPurchaseOrder(products) {
                    return new Promise(async(resolve, reject)=>{
                        let foreignCurrencyFields = {
                            ForeignExchangeCode: CountryAbbr,
                            ForeignExchangeRate: 0.00,
                        }
                        let purchaseService = new PurchaseBoardService();
                        let splashLineArray = [];
                        let billingAddress = await getSupplierDetail();
                        for (let i = 0; i< products.length; i++) {
                            let productData = await getProductData(products[i].productName);
                            let stockQty = productData.TotalQtyInStock;
                            if(stockQty < products[i].qty) {
                                let tdunitprice = utilityService.modifynegativeCurrencyFormat(Math.floor(productData.BuyQty1Cost * 100) / 100);
                                let lineItemObjForm = {
                                    type: "TPurchaseOrderLine",
                                    fields: {
                                        ProductName: products[i].productName || '',
                                        ProductDescription: productData.ProductDescription || '',
                                        UOMQtySold: parseFloat(products[i].qty - stockQty),
                                        UOMQtyShipped: 0,
                                        LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                        CustomerJob: '',
                                        LineTaxCode: productData.TaxCodePurchase || '',
                                        LineClassName: defaultDept
                                    }
                                };

                                splashLineArray.push(lineItemObjForm);
                            }
                        }
                        if(splashLineArray.length > 0) {
                            let saledateTime = new Date();
                            let date =  saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate()
                            let objDetails = {
                                type: "TPurchaseOrderEx",
                                fields: {
                                    SupplierName: 'Misc Supplier',
                                    ...foreignCurrencyFields,
                                    SupplierInvoiceNumber: ' ',
                                    Lines: splashLineArray,
                                    OrderTo: billingAddress,
                                    OrderDate: date,

                                    SupplierInvoiceDate: date,

                                    SaleLineRef: '',
                                    TermsName: 'COD',
                                    Shipping: '',
                                    ShipTo: billingAddress,
                                    Comments: '',
                                    SalesComments: '',
                                    Attachments: [],
                                    OrderStatus: ''
                                }
                            };
                            purchaseService.savePurchaseOrderEx(objDetails).then(function(dataReturn) {
                                sideBarService.getAllTPurchasesBackOrderReportData('', '', true, initialReportLoad, 0).then(function(data)  {
                                    addVS1Data('TPurchasesBackOrderReport', JSON.stringify(data)).then(function (dataUpdate) {
                                        resolve()
                                    })
                                })
                            }).catch(function(err) {
                                resolve()
                            })
                        } else {
                            resolve()
                        }

                    })
                }
                let poProducts = [];
                async function saveSubOrders () {
                    let record = templateObject.workorderrecord.get();
                    let bomStructure = templateObject.bomStructure.get();
                    let bomProducts = templateObject.bomProducts.get();
                    poProducts = [];

                    let totalWorkOrders = await templateObject.getAllWorkorders();
                    let savedworkorders = totalWorkOrders.filter(order => {
                        return order.fields.SaleID == templateObject.salesOrderId.get();
                    })
                    let count = savedworkorders.length;
                    if(bomStructure.Details && JSON.parse(bomStructure.Details).length > 0) {
                        let subBOMs = JSON.parse(bomStructure.Details);
                        for(let k = 0; k< subBOMs.length; k++) {
                            let subs = subBOMs[k];
                            if(subs.isBuild == true) {
                                let subBOMIndex = bomProducts.findIndex(product=>{
                                    return product.Caption == subs.productName
                                })
                                let duration = 0;
                                if(subBOMIndex > -1) {
                                    duration = bomProducts[subBOMIndex].QtyVariation
                                }else {
                                    await productService.getOneBOMProductByName(subs.productName).then(function(dataObject){
                                            let d = JSON.parse(dataObject[0].data);
                                        duration = d.tproctree[0].QtyVariation
                                    })
                                }


                                let subBOMStructure = {
                                    Caption: subs.productName,
                                    Info: subs.process,
                                    CustomInputClass: subs.processNote,
                                    Details: JSON.stringify(subs.subs),
                                    QtyVariation: duration
                                }
                                async function getProductionPlanData() {
                                    return new Promise(async(resolve, reject)=>{
                                        let returnVal = [];
                                        getVS1Data('TProductionPlanData').then(function(dataObject) {
                                            if(dataObject.length == 0) {
                                                resolve(returnVal)
                                            }else {
                                                returnVal = JSON.parse(dataObject[0].data.tproductionplandata[0].fields.events);
                                                if(returnVal == undefined) {
                                                    returnVal = [];
                                                }
                                                resolve(returnVal)
                                            }
                                        }).catch(function(e) {
                                            resolve(returnVal)
                                        })
                                    })
                                }
                                async function saveOneSubOrder() {
                                    return new Promise(async(resolve, reject)=>{
                                        let subProductName = subs.productName;
                                        let plans = await getProductionPlanData();
                                        let tempPlans = cloneDeep(plans);
                                        tempPlans = tempPlans.filter(plan=>plan.resourceName == subs.process);
                                        let subStart = new Date();
                                        if (tempPlans.length > 0) {
                                            subStart = new Date(Math.max.apply(null, tempPlans.map(function(e) {
                                                return new Date(e.end);
                                            })));
                                        }

                                        let subDetail = {
                                            ID: templateObject.salesOrderId.get() + "_" + (count + k + 1).toString(),
                                            LID: templateObject.salesOrderId.get() + "_" + (count + k + 1).toString(),
                                            Customer: $('#edtCustomerName').val() || '',
                                            InvoiceToDesc: $('#txabillingAddress').val() || '',
                                            PONumber: $('#ponumber').val()||'',
                                            // SaleDate: new Date($('#dtSODate').val()) || '',
                                            SaleDate: record.saledate,
                                            DueDate: record.duedate,
                                            BOMStructure: JSON.stringify(subBOMStructure),
                                            SaleID: templateObject.salesOrderId.get(),
                                            StartTime: subStart,
                                            OrderDate: new Date(),
                                            InProgress: record.isStarted,
                                            Quantity: record.quantity? record.quantity* parseFloat(subs.qty) : subs.qty,
                                            TrackedTime: 0,
                                            StartedTimes: JSON.stringify([]),
                                            PausedTimes: JSON.stringify([]),
                                            StartTime: '',
                                            StoppedTime: ''
                                        }


                                        if(subs.subs&&subs.subs.length > 0) {
                                            for(let n=0; n<subs.subs.length; n++) {
                                                let rawName = subs.subs[n].productName;
                                                let neededQty = subs.subs[n].qty * subDetail.Quantity;
                                                // await createPurchaseOrder(rawName, neededQty)
                                                poProducts.push({productName: rawName, qty: neededQty})
                                            }
                                        }
                                        let subEnd = new Date();
                                        subEnd.setTime(subStart.getTime() + subDetail.Quantity * duration * 3600000);
                                        if(subEnd.getTime() > mainOrderStart.getTime()) {
                                            mainOrderStart = subEnd;
                                        }


                                        getVS1Data('TProductVS1').then(async function(dataObject) {
                                            if(dataObject.length == 0) {
                                                productService.getOneProductdatavs1byname(subProductName).then(async function(data){

                                                    // let line = JSON.parse(JSON.stringify(record.line));
                                                    let productname = subProductName;
                                                    let product_description = data.tproduct[0].fields.ProductDescription;
                                                    let productid = data.tproduct[0].fields.ID;
                                                    // let quantity = record.Quantity * parseFloat(subs.qty)
                                                    // subDetail = {...subDetail, ProductName: productname, ProductDescription: product_description, };
                                                    subDetail.ProductName = productname;
                                                    subDetail.ProductDescription = product_description;
                                                    // subDetail.Quantity = quantity;
                                                    subDetail.ProductID = productid;

                                                    // let tempArray = localStorage.getItem('TWorkorders');
                                                    // let workorders = tempArray?JSON.parse(tempArray): [];
                                                    let workorders = await templateObject.getAllWorkorders();
                                                    let existIndex = workorders.findIndex(order=>{
                                                        return order.fields.SaleID == subDetail.SaleID && order.fields.ProductName == subDetail.ProductName
                                                    })
                                                    if(existIndex > -1) {
                                                        subDetail.TrackedTime =  workorders[existIndex].fields.TrackedTime
                                                        subDetail.StartedTimes =  workorders[existIndex].fields.StartedTimes,
                                                        subDetail.PausedTimes =  workorders[existIndex].fields.pausedTimes,
                                                        subDetail.StartTime =  workorders[existIndex].fields.StartTime,
                                                        subDetail.StoppedTime =  workorders[existIndex].fields.StoppedTime
                                                        workorders.splice(existIndex, 1, {type:'TVS1Workorder', fields:subDetail})
                                                    }else {
                                                        workorders = [...workorders, {type:'TVS1Workorder', fields:subDetail}];
                                                    }
                                                    addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function() {
                                                        resolve();
                                                    })
                                                    // localStorage.setItem('TWorkorders', JSON.stringify(workorders));
                                                })
                                            }else {
                                                let data = JSON.parse(dataObject[0].data);
                                                let useData = data.tproductvs1;
                                                for(let i=0 ; i< useData.length; i++) {
                                                    if(useData[i].fields.ProductName == subProductName) {
                                                            let productname = subProductName;
                                                            let product_description = useData[i].fields.ProductDescription;
                                                            let productid = useData[i].fields.ID;
                                                            // let quantity = record.Quantity * parseFloat(subs.qty)
                                                            // subDetail = {...subDetail, ProductName: productname, ProductDescription: product_description, };
                                                            subDetail.ProductName = productname;
                                                            subDetail.ProductDescription = product_description;
                                                            // subDetail.Quantity = quantity;
                                                            subDetail.ProductID = productid;
                                                            let workorders = await templateObject.getAllWorkorders();
                                                            let existIndex = workorders.findIndex(order=>{
                                                                return order.fields.SaleID == subDetail.SaleID && order.fields.ProductName == subDetail.ProductName
                                                            })
                                                            if(existIndex > -1) {
                                                                workorders.splice(existIndex, 1, {type:'TVS1Workorder', fields:subDetail})
                                                            }else {
                                                                workorders = [...workorders, {type:'TVS1Workorder', fields:subDetail}];
                                                            }
                                                            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){
                                                                resolve();
                                                            })
                                                            // localStorage.setItem('TWorkorders', JSON.stringify(workorders));
                                                    } else if (i == useData.length -1) {
                                                        resolve();
                                                    }
                                                }
                                            }
                                        }).catch(function(err){
                                            productService.getOneProductdatavs1byname(subProductName).then(async function(data){
                                                let productname = subProductName;
                                                let product_description = data.tproduct[0].fields.ProductDescription;
                                                let productid = data.tproduct[0].fields.ID;
                                                // let quantity = record.Quantity * parseFloat(subs.qty)
                                                // subDetail = {...subDetail, ProductName: productname, ProductDescription: product_description, };
                                                subDetail.ProductName = productname;
                                                subDetail.ProductDescription = product_description;
                                                // subDetail.Quantity = quantity;
                                                subDetail.ProductID = productid;

                                                // let tempArray = localStorage.getItem('TWorkorders');
                                                // let workorders = tempArray?JSON.parse(tempArray): [];
                                                let workorders = await templateObject.getAllWorkorders();
                                                let existIndex = workorders.findIndex(order=>{
                                                    return order.fields.SaleID == subDetail.SaleID && order.fields.ProductName == subDetail.ProductName
                                                })
                                                if(existIndex > -1) {
                                                    workorders.splice(existIndex, 1, {type:'TVS1Workorder', fields:subDetail})
                                                }else {
                                                    workorders = [...workorders, {type:'TVS1Workorder', fields:subDetail}];
                                                }
                                                addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function() {
                                                    resolve();
                                                })
                                                // localStorage.setItem('TWorkorders', JSON.stringify(workorders));
                                                // resolve();
                                            }).catch(function(error){
                                                resolve();
                                            })
                                        })
                                    })
                                }
                                await saveOneSubOrder();

                            }

                        }
                    }
                }

                await saveSubOrders();

                if(poProducts.length > 0) {
                    await createPurchaseOrder(poProducts);
                }

                async function saveMainOrders() {
                    let record = templateObject.workorderrecord.get();
                    let totalWorkOrders = await templateObject.getAllWorkorders();
                    
                   
                    let savedworkorders = totalWorkOrders.filter(order => {
                        return order.fields.SaleID == templateObject.salesOrderId.get();
                    })
                    let count = savedworkorders.length;
                    let temp = cloneDeep(record);
                    // temp = {...temp, isStarted: true}
                    templateObject.workorderrecord.set(temp);
                    record = templateObject.workorderrecord.get();
                    let objDetail = {
                    //    LID: templateObject.salesOrderId.get() + "_" + (count + 1).toString(),
                        LID: $('#ponumber').val() + "_" + (count + 1).toString(),
                        Customer: $('#edtCustomerName').val() || '',
                        OrderTo: $('#txabillingAddress').val() || '',
                        PONumber: $('#ponumber').val()||'',
                        OrderNumber:$('#edtOrderNumber').val() || '',
                        SaleDate: record.saledate,
                        DueDate: record.duedate,
                        BOMStructure: JSON.stringify(templateObject.bomStructure.get()),
                        SaleID: templateObject.salesOrderId.get(),
                        OrderDate: new Date(),
                        StartTime: mainOrderStart,
                        ProductName: record.productname,
                        ProductDescription: record.product_description,
                        ShipDate: record.shipDate,
                        // ProductID: record.productid,
                        Quantity: record.quantity || 1,
                        InProgress: record.isStarted,
                        //ID: templateObject.salesOrderId.get() + "_" + (count + 1).toString(),
                        ID: $('#ponumber').val() + "_" + (count + 1).toString(),

                        UpdateFromPO: templateObject.updateFromPO.get(),
                        POStatus: record.poStatus,
                        Status: record.status,
                        TrackedTime: record.trackedTime,
                        StartedTimes: JSON.stringify(record.startedTimes),
                        PausedTimes: JSON.stringify(record.pausedTimes),
                        StartTime: record.startTime,
                        StoppedTime: record.stoppedTime
                    }

                    // manufacturingService.saveWorkOrder({
                    //     type: 'TVS1Workorder',
                    //     fields: objDetail
                    // }).then(function(){
                    // }).catch(function(er) {
                    // })


                    let workorders = await templateObject.getAllWorkorders();
                    let existIndex = workorders.findIndex(order=>{
                        return order.fields.SaleID == objDetail.SaleID && order.fields.ProductName == objDetail.ProductName
                    })
                    if(existIndex > -1) {
                        workorders.splice(existIndex, 1, {type:'TVS1Workorder', fields:objDetail})
                    }else {
                        workorders = [...workorders, {type:'TVS1Workorder', fields:objDetail}];
                    }
                    
                    addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){})
                    // localStorage.setItem('TWorkorders', JSON.stringify(workorders));
                }

                await saveMainOrders();

                $('.fullScreenSpin').css('display', 'none');

                if(vendorService == false) {
                    swal({
                        title: 'Success',
                        text: 'Work Order has been saved successfully',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'Continue',
                    }).then ((result)=>{

                        if (localStorage.getItem("enteredURL") != null) {
                            FlowRouter.go(localStorage.getItem("enteredURL"));
                            localStorage.removeItem("enteredURL");
                            return;
                        }

                        FlowRouter.go('/workorderlist')
                    });
                } else {
                    let totalWorkOrders = await templateObject.getAllWorkorders();
                    let savedworkorders = totalWorkOrders.filter(order => {
                        return order.fields.SaleID == templateObject.salesOrderId.get();
                    })
                    FlowRouter.go('/purchaseordercard?workorderid=' + templateObject.salesOrderId.get() + "_" + (savedworkorders.length).toString())
                }


            }, delayTimeAfterSound);
        }
    },

    'click #tblWorkOrderLine tbody tr td.colProductName': function(event) {
        event.preventDefault();
        event.stopPropagation();
        let templateObject = Template.instance();
        templateObject.showBOMModal.set(false)
        let productName = $(event.target).closest('tr').find('input.lineProductName').val()
        let tempBOMs = templateObject.bomProducts.get();
        templateObject.targetProductField.set($(event.target))
        $('#bomProductListModal').modal('toggle')
    },

    'click #bomProductListModal tbody tr': function(event) {
        event.preventDefault()
        event.stopPropagation();
        let templateObject = Template.instance();
        let productName = $(event.target).closest('tr').find('.colName').text()
        let description = $(event.target).closest('tr').find('.colDescription').text()
        let field = templateObject.targetProductField.get();
        $(field).val(productName)
        let descriptionField = $(field).closest('tr').find('.colDescription');
        $(descriptionField).text(description) 
        let record = templateObject.workorderrecord.get();
        let tempRecord = cloneDeep(record)
        tempRecord.productname = productName;
        tempRecord.productDescription = description;
        templateObject.workorderrecord.set(tempRecord)
        $('#bomProductListModal').modal('toggle');


    },
    'change .edtQuantity' : function(event) {
        let value = $(event.target).val();
        value = parseFloat(value).toFixed(5);
        $(event.target).val(value);
        let record = JSON.parse(JSON.stringify(templateObject.workorderrecord.get()))
        record.quantity = parseFloat(value)
        templateObject.workorderrecord.set(record);
    },

    'click #btnVendorService': async function(event) {
        event.preventDefault();
        event.stopPropagation();
        let templateObject = Template.instance();
        async function checkExistPurchaseOrder (workorderid) {
            return new Promise(async(resolve, reject)=> {
                getVS1Data('TPurchaseOrderEx').then(function(dataObject) {
                    if(dataObject.length == 0) {
                        purchaseService.getPurchaseOrderByWorkorderid(workorderid).then(function(data){
                            if(data.tpurchaseorderex.length > 0) {
                                resolve(data.tpurhcaseorderex[0].fields.ID)
                            } else {
                                resolve('')
                            }
                        }).catch(function(e){
                            resolve('')
                        })
                    }else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tpurchaseorderex;
                        let index = useData.findIndex(purchaseOrder => {
                            return purchaseOrder.fields.CustField3 == workorderid
                        })
                        if(index == -1 ) {
                            purchaseService.getPurchaseOrderByWorkorderid(workorderid).then(function(data){
                                if(data.tpurchaseorderex.length > 0) {
                                    resolve((data.tpurchaseorderex)[0].fields.ID)
                                } else {
                                    resolve('')
                                }
                            }).catch(function(error){
                                resolve('')
                            })
                        } else {
                            resolve(useData[index].fields.ID)
                        }
                    }
                }).catch(function(e) {
                    purchaseService.getPurchaseOrderByWorkorderid(workorderid).then(function(data){
                        if(data.tpurchaseorderex.length > 0) {
                            resolve(data.tpurhcaseorderex[0].fields.ID)
                        } else {
                            resolve('')
                        }
                    }).catch(function(err) {
                        resolve('')
                    })
                })
            })
        }

        async function getProductData(productName) {
            return new Promise(async(resolve, reject)=> {
                let record = templateObject.workorderrecord.get();
                getVS1Data('TProductVS1').then(async function(dataObject){
                    if(dataObject.length == 0) {
                        productService.getOneProductdatavs1byname(productName).then(function(data){
                            resolve(data.tproduct[0].fields)
                        })
                    }else {
                         let added = false;
                         let data = JSON.parse(dataObject[0].data);
                         let useData = data.tproduct;
                         let index = useData.findIndex(item=>{
                            return item.fields.ProductName == productName
                         })
                         if(index == -1) {
                            productService.getOneProductdatavs1byname(productName).then(function(data){
                                resolve(data.tproduct[0].fields)
                            })
                         }else {
                            resolve(useData[index].fields)
                         }
                    }
                }).catch(function(err){
                    productService.getOneProductdatavs1byname(productName).then(function(data){
                        resolve(data.tproduct[0].fields)
                    })
                })
            })
        }

        let purchaseOrderId = await checkExistPurchaseOrder(FlowRouter.current().queryParams.id);
        if(purchaseOrderId == '') {
            swal({
                title: 'Question',
                text: 'Do you want to forward this order to vendor service?',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(async (result)=>{
                if(result.value) {
                    let record = templateObject.workorderrecord.get();
                    let productData = await getProductData(record.productname)
                    let splashLineArray = [];
                    let tdunitprice = utilityService.modifynegativeCurrencyFormat(Math.floor(productData.BuyQty1Cost * 100) / 100);
                    $('.fullScreenSpin').css('display', 'inline-block')
                    async function getTaxRate ()  {
                        return new Promise(async(resolve, reject)=> {

                            getVS1Data('TTaxcodeVS1').then(function(dataObject){
                                if(dataObject.length == 0) {
                                    let data = JSON.parse(dataObject[0].data);
                                    let useData = data.ttaxcodevs1;
                                    let index = useData.findIndex(taxCode=>{
                                        return taxCode.CodeName == productData.TaxCodePurchase
                                    })
                                    if(index == -1) {
                                        sideBarService.getTaxRateVS1ByName(productData.TaxCodePurchase).then(function(data){
                                            resolve(data.ttaxcodevs1[0].Rate)
                                        })
                                    }else {
                                        resolve(useData[index].Rate)
                                    }

                                }else {
                                    sideBarService.getTaxRateVS1ByName(productData.TaxCodePurchase).then(function(data){
                                        resolve(data.ttaxcodevs1[0].Rate)
                                    })
                                }
                            }).catch(function(err){
                                sideBarService.getTaxRateVS1ByName(productData.TaxCodePurchase).then(function(data){
                                    resolve(data.ttaxcodevs1[0].Rate)
                                })
                            })
                        })
                    }
                    let taxRate = await getTaxRate()
                    let lineItemObjForm = {
                        type: "TPurchaseOrderLine",
                        fields: {
                            ProductName: record.productname || '',
                            ProductDescription: productData.ProductDescription || '',
                            UOMQtySold: record.quantity,
                            UOMQtyShipped: 0,
                            UOMQtyBackOrder: record.quantity,
                            LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                            CustomerJob: record.customer || '',
                            LineTaxCode: productData.TaxCodePurchase || '',
                            LineTaxRate: taxRate || 0,
                            LineClassName: defaultDept
                        }
                    };

                    splashLineArray.push(lineItemObjForm);
                    $('.fullScreenSpin').css('display', 'none')
                    localStorage.setItem("newPOParamItem", JSON.stringify(splashLineArray))

                    FlowRouter.go('/purchaseordercard?workorderid='+ FlowRouter.current().queryParams.id)
                }else if(result.dismiss == 'cancel') {
                    return;
                }
            })
        } else {
            FlowRouter.go('/purchaseordercard?id=' + purchaseOrderId)
        }
    },

    'click #btnScheduleOrder': async function(event) {
        let templateObject = Template.instance();
        templateObject.changeWorkorderStatus('scheduled')
    },
    'click #btnUnscheduleOrder': async function(event) {
        let templateObject = Template.instance();
        templateObject.changeWorkorderStatus('unscheduled');
    },

    'click #btnStartTimer': async function(event) {
        let templateObject = Template.instance();
        templateObject.changeWorkorderStatus('started')
    },

    'click #btnPauseTimer': async function(event) {
        let templateObject = Template.instance();

        templateObject.changeWorkorderStatus('paused')
    },

    'click #btnResumeTimer': async function(event) {
        let templateObject = Template.instance();
        templateObject.changeWorkorderStatus('resumed')
    },

    'click #btnStopTimer': async function(event) {
        let templateObject = Template.instance();
        templateObject.changeWorkorderStatus('stopped')
    },

    'click #btnStartQA': function(event) {
        let templateObject = Template.instance();
        templateObject.changeWorkorderStatus('QAStarted')
    },

    'click #btnPauseQA': function(event) {
        let templateObject = Template.instance();
        templateObject.changeWorkorderStatus('QAPaused')
    },

    'click #btnResumeQA': function(event) {
        let templateObject = Template.instance();
        templateObject.changeWorkorderStatus('QAResumed')
    },

    'click #btnStopQA': function(event){
        let templateObject = Template.instance();
        templateObject.changeWorkorderStatus('QAStopped')
    },

    'click #tblBOMList tbody tr': async function(event) {
        let templateObject = Template.instance();
        let productName = $(event.target).closest('tr').find('.colName').text();
        let productDescription = $(event.target).closest('tr').find('.colDescription').text();
        let record = cloneDeep(templateObject.workorderrecord.get())
        record.productname = productName;
        record.productDescription = productDescription;
        async function getBOMStructure() {
         getVS1Data('TProcTree').then(function(dataObject){
            return new Promise(async(resolve, reject) =>{
                if(dataObject.length == 0) {
                    productService.getOneBOMProductByName(productName).then(function(data) {
                        if (data.tproctree.length > -1) {
                            templateObject.bomStructure.set(data.tproctree[0])
                            resolve()
                        }
                    })
                }else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tproctree;
                    let added = false
                    for(let i=0; i< useData.length; i++){
                        if(useData[i].Caption == productName) {
                            added = true;
                            templateObject.bomStructure.set(useData[i])
                            resolve()
                        }
                    }
                    if(added == false) {
                        productService.getOneBOMProductByName(productName).then(function(data) {
                            if (data.tproctree.length > -1) {
                                templateObject.bomStructure.set(data.tproctree[0])
                                resolve()
                            }
                        })  
                    }
                }
            })
            }).catch(function(e){
                productService.getOneBOMProductByName(productName).then(function(data) {
                    if (data.tproctree.length > -1) {
                        templateObject.bomStructure.set(data.tproctree[0])
                        resolve()
                    }
                })
            })  
        }
        await getBOMStructure();
        templateObject.workorderrecord.set(record)
        templateObject.showBOMModal.set(true)
        $('#bomListModal').modal('toggle')
    },

    'click #btnShowBOM': function(event) {
        event.preventDefault();
        event.stopPropagation();
        let templateObject = Template.instance();
        $('#BOMSetupModal').modal('toggle')
    },

    'change #edtCustomerName': function(event) {
        let templateObject = Template.instance();
        setTimeout(async function(){
            let customerName = $('#edtCustomerName').val()
            
            let record = cloneDeep(templateObject.workorderrecord.get());
            let customerData = await templateObject.getCustomerData(customerName);
            record.customer= customerName,
            record.ClientName= customerName,
            record.CustomerID= customerData.ID,
            record.ClientEmail= customerData.Email,
            templateObject.workorderrecord.set(record);

        }, 1000)
    }



})

Template.new_workorder.helpers({
    workorderrecord: ()=>{
        return Template.instance().workorderrecord.get()
    },

    uploadedFile : () => {
        return Template.instance().uploadedFile.get()
    },
    quantityBuild: ()=> {
        return Template.instance().quantityBuild.get()
    },

    showBOMModal: ()=> {
        return Template.instance().showBOMModal.get()
    },

    isMobileDevices: ()=> {
        return Template.instance().isMobileDevices.get()
    },

    isSaved: () => {
        return Template.instance().isSaved.get();
    },

    popup_template: () => {
        return Template.customerlistpop
    }
})

Template.new_workorder.events({


    'click #BOMSetupModal .btn-save-bom': function(event) {
        let templateObject = Template.instance();
        playSaveAudio();
        setTimeout(async function(){
            let finalStructure = {};
            let bomProduct = templateObject.bomProducts.get();
            let mainProductName = $('#tblWorkOrderLine tbody tr .lineProductName').val();

            // let currentBOMIndex = bomProduct.findIndex(product => {
            //     return product.fields.productName == mainProductName
            // })
            let mainOrderSaved = false;
            // let currentBOMStructure = bomProduct[currentBOMIndex].fields;

            let builtCount = $('.btn-product-build').length;
            let tempRecord = templateObject.workorderrecord.get();
            let currentRecord = cloneDeep(tempRecord)
            let totalWorkOrders = await templateObject.getAllWorkorders();
            let savedworkorders = totalWorkOrders.filter(order => {
                return order.fields.SalesID == templateObject.salesOrderId.get();
            })
            let count = savedworkorders.length;
            let mainOrderId = currentRecord.id.split('_')[1];
            if(mainOrderId <= count) {
                mainOrderSaved = true;
            }else {
                mainOrderSaved = false;
            }
            saveMainBOMStructure();

        }, delayTimeAfterSound);
    async function saveMainBOMStructure() {
        let mainProductName = $('#edtMainProductName').val();
        let mainProcessName = $('#edtProcess').val();
        // let mainQuantity = $('#edtMainQty').val();
        let bomProducts = templateObject.bomProducts.get();

        if(mainProcessName == '') {
            swal('Please provide the process !', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            return false;
        }

        let products = $('.product-content');
        if(products.length < 3) {
            swal('Must have sub builds or raws !', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            return false;
        }

        async function getDetailInfoFromName (prodName) {
            return new Promise(async(resolve, reject) => {
                getVS1Data('TProductVS1').then(dataObject => {
                    if(dataObject.length == 0) {
                        productService.getOneProductdatavs1byname(prodName).then(function(data){
                            resolve({
                                totalQtyInStock: data.tproduct[0].fields.TotalQtyInStock,
                                productDescription: data.tproduct[0].fields.SalesDescription
                            })
                        })
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tproductvs1;
                        for(let i = 0; i< useData.length; i ++ ) {
                            if(useData[i].fields.ProductName == prodName) {
                                resolve({
                                    totalQtyInStock: useData[i].fields.TotalQtyInStock,
                                    productDescription: useData[i].fields.SalesDescription
                                })
                            }
                        }
                    }
                }).catch(function(err) {
                    productService.getOneProductdatavs1byname(prodName).then(function(data){
                        resolve({
                            totalQtyInStock: data.tproduct[0].fields.TotalQtyInStock,
                            productDescription: data.tproduct[0].fields.SalesDescription
                        })
                    })
                })
            })
        }

        let productInfo = await getDetailInfoFromName(mainProductName);
        let objDetails  = {
            Caption: mainProductName,
            // qty: mainQuantity,
            Info: mainProcessName,
            CustomInputClass: $(products[0]).find('.edtProcessNote').val() || '',
            Value: JSON.stringify(JSON.parse($(products[0]).find('.attachedFiles').text() != ''?$(products[0]).find('.attachedFiles').text(): '[]').uploadedFilesArray) || JSON.stringify([]),
            Details: '',
            TotalQtyOriginal: productInfo.totalQtyInStock,
            Description: productInfo.productDescription,
            QtyVariation: parseFloat($('.edtDuration').val()) || 1.00

        }

        let mainSubs = [];
        for(let i = 1; i< products.length - 1; i ++) {
            let productRows = products[i].querySelectorAll('.productRow');
            let objectDetail;
                let _name = $(productRows[0]).find('.edtProductName').val();
                let _qty = $(productRows[0]).find('.edtQuantity').val();
                let _process = $(productRows[0]).find('.edtProcessName').val();
                let _note = $(productRows[0]).find('.edtProcessNote').val();
                let _attachments = JSON.parse($(productRows[0]).find('.attachedFiles').text()!= ''?$(productRows[0]).find('.attachedFiles').text(): '[]').uploadedFilesArray || [];
                let _subInfo = await getDetailInfoFromName(_name);
                objectDetail = {
                    productName: _name,
                    qty: _qty,
                    process: _process,
                    processNote: _note,
                    attachments: _attachments,
                    subs:[],
                    isBuild: false
                }
                if(productRows.length > 1) {
                    let boms = templateObject.bomProducts.get();
                    let index = boms.findIndex(bom=>{
                        return bom.Caption == _name;
                    })
                    if(index > -1) {
                        objectDetail.duration = boms[index].duration
                    }else {
                        await productService.getOneBOMProductByName(_name).then(function(data) {
                            if(data.tproctree.length > 0) {
                                objectDetail.duration = data.tproctree[0].QtyVariation
                            }
                        })
                    }
                    for(let j = 1; j<productRows.length; j++) {
                        let _productName = $(productRows[j]).find('.edtProductName').val();
                        let _productQty = $(productRows[j]).find('.edtQuantity').val();
                        let _rawProcess = $(productRows[j]).find('.edtProcessName').val();
                        if(_productName != '' && _productQty != '' && _rawProcess != '') {
                            objectDetail.subs.push ({
                                productName: _productName || '',
                                qty: _productQty || 1,
                                process: _rawProcess || '',
                                processNote: '',
                                attachments: [],
                                subs: []
                            })
                        }
                    }
                } else {
                    let bomProductIndex = bomProducts.findIndex(product => {
                        return product.productName == _name;
                    })
                    if(bomProductIndex > -1) {
                        let subProduct = bomProducts[bomProductIndex];
                        if(subProduct && subProduct.fields.subs && subProduct.fields.subs.length> 0) {
                            for(let j=0; j< subProduct.fields.subs.length; j++) {
                                let sub = subProduct.fields.subs[j];
                                objectDetail.subs.push({
                                    productName: sub.product || '',
                                    qty: sub.quantity || 1,
                                    process: sub.process || '',
                                    processNote: '',
                                    attachments: [],
                                    subs: []
                                })
                            }
                        }
                    }
                }
                if($(productRows[0]).find('.btn-product-build').length > 0) {
                    objectDetail.isBuild = true;
                }

            // }
            mainSubs.push(objectDetail);
        }

        objDetails.Details = JSON.stringify(mainSubs)
        finalStructure = objDetails;

        //global save action
        templateObject.bomStructure.set(finalStructure);
        swal('BOM Settings Successfully Saved', '', 'success');
        // let productContents = $('#BOMSetupModal').find('.product-content');
        // for (let l = 1; l < productContents.length -1; l++) {
        //     $(productContents[l]).remove()
        // }
        $('#BOMSetupModal').modal('toggle');
    }
    },

    'click #BOMSetupModal .btn-cancel-bom': function(event) {
        playCancelAudio();
        setTimeout(function(){
        // let productContents = $('#BOMSetupModal').find('.product-content');
        // for (let l = 1; l < productContents.length -1; l++) {
        //     $(productContents[l]).remove();
        // }
            $('#BOMSetupModal').modal('toggle');
        }, delayTimeAfterSound);
    },

    'click #btn-save-close': function(event) {
        $('.btnSave').trigger('click')
    },

    'click #btnBuildQty': function(event) {
        event.preventDefault();
        let templateObject = Template.instance();
        templateObject.quantityBuild.set(true);
    },

    'keyup #edtTotalQuantity': function(event) {
        event.preventDefault();
        let templateObject = Template.instance();

    },

    'click #btnCompleteProcess': async function(event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block')
        let workorders = await templateObject.getAllWorkorders()
        let currentworkorder;

        let workorderindex = workorders.findIndex(order => {
            return order.fields.SaleID == templateObject.salesOrderId.get() && order.fields.ProductName == templateObject.workorderrecord.get().productname;
        })
        if(workorderindex > -1) {
            currentworkorder = workorders[workorderindex];
            let productName = currentworkorder.fields.ProductName;
            // getVS1Data('TProductVS1').then(function(dataObject) {
            //     if(dataObject.length == 0) {
            //         productService.getOneProductdatavs1byname(productName).then(function(dataDetail)  {
            //             let data = dataDetail.tproduct[0];
            //             productService.saveProduct({
            //                 type: 'TProduct',
            //                 fields: {
            //                     ...data.fields,
            //                     TotalQtyInStock: currentworkorder.fields.Quantity + data.fields.TotalQtyInStock
            //                 }
            //                 // ID: data.fields.ID,
            //             }).then(function(){
            //                 sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
            //                     addVS1Data('TProductVS1',JSON.stringify(data));
            //                 })
            //             })
            //         })
            //     } else {
            //         let data = JSON.parse(dataObject[0].data)
            //         let useData = data.tproductvs1;
            //         for(let i = 0; i< useData.length; i++) {
            //             if(useData[i].fields.ProductName == productName ) {
            //                 productService.saveProductVS1({
            //                     type: 'TProductVS1',
            //                     fields: {
            //                         // ...useData[i].fields,
            //                         ID: useData[i].fields.ID,
            //                         TotalQtyInStock: currentworkorder.fields.Quantity + useData[i].fields.TotalQtyInStock
            //                     }
            //                 }).then(function(){
            //                     sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
            //                         addVS1Data('TProductVS1',JSON.stringify(data)).then(()=>{
            //                         });
            //                     })
            //                 })
            //             }
            //         }
            //     }
            // }).catch(function(err){
            //     productService.getOneProductdatavs1byname(productName).then(function(dataDetail)  {
            //         let data = dataDetail.tproduct[0];
            //         productService.saveProduct({
            //             type: 'TProduct',
            //             fields: {
            //                 ...data.fields,
            //                 TotalQtyInStock: currentworkorder.fields.Quantity + data.fields.TotalQtyInStock
            //             }
            //         }).then(function(){
            //             sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
            //                 addVS1Data('TProductVS1',JSON.stringify(data));
            //             })
            //         })
            //     })
            // })

            let subs = JSON.parse(JSON.parse(currentworkorder.fields.BOMStructure).Details);
            // for(let j = 0; j< subs.length; j++) {
            //     let name = subs[j].productName;
            //     // getVS1Data('TProductVS1').then(function(dataObject) {
            //     //     if(dataObject.length == 0) {
            //     //         productService.getOneProductdatavs1byname(name).then(function(dataDetail)  {
            //     //             let data = dataDetail.tproduct[0];
            //     //             productService,saveProduct({
            //     //                 type: 'TProduct',
            //     //                 fields: {
            //     //                     ...data.fields,
            //     //                     TotalQtyInStock: data.fields.TotalQtyInStock - parseFloat(currentworkorder.fields.Quantity * subs[j].qty)
            //     //                 }
            //     //             }).then(function(){
            //     //                 $('.fullScreenSpin').css('display', 'none')
            //     //                 sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
            //     //                     addVS1Data('TProductVS1',JSON.stringify(data)).then(function() {
            //     //                         swal('Process Completed', '', 'success');
            //     //                     });
            //     //                 })
            //     //             })
            //     //         })
            //     //     } else {
            //     //         let data = JSON.parse(dataObject[0].data)
            //     //         let useData = data.tproductvs1;
            //     //         for(let i = 0; i< useData.length; i++) {
            //     //             if(useData[i].fields.ProductName == name ) {
            //     //                 productService.saveProductVS1({
            //     //                     type: 'TProductVS1',
            //     //                     fields: {
            //     //                         ...useData[i].fields,
            //     //                         // ID: useData[i].fields.ID,
            //     //                         TotalQtyInStock: useData[i].fields.TotalQtyInStock - parseFloat(currentworkorder.fields.Quantity * subs[j].qty)
            //     //                     }
            //     //                 }).then(function(){
            //     //                     $('.fullScreenSpin').css('display', 'none')
            //     //                     sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
            //     //                         addVS1Data('TProductVS1',JSON.stringify(data)).then(function(){
            //     //                             swal('Process Completed', '', 'success');
            //     //                         });
            //     //                     })
            //     //                 })
            //     //             }
            //     //         }
            //     //     }
            //     // }).catch(function(err){
            //     //     productService.getOneProductdatavs1byname(name).then(function(dataDetail)  {
            //     //         let data = dataDetail.tproduct[0];
            //     //         productService,saveProduct({
            //     //             type: 'TProduct',
            //     //             fields:{
            //     //                 ...data.fields,
            //     //                 TotalQtyInStock: data.fields.TotalQtyInStock - parseFloat(currentworkorder.fields.Quantity * subs[j].qty)
            //     //             }
            //     //             // ID: data.fields.ID,
            //     //         }).then(function(){
            //     //             $('.fullScreenSpin').css('display', 'none')
            //     //             sideBarService.getNewProductListVS1(initialBaseDataLoad,0).then(function (data) {
            //     //                 addVS1Data('TProductVS1',JSON.stringify(data)).then(function() {
            //     //                     swal('Process Completed', '', 'success');
            //     //                 });
            //     //             })
            //     //         })
            //     //     })
            //     // })
            // }
            let tempworkorder = cloneDeep(currentworkorder);
            tempworkorder.fields = {...tempworkorder.fields, IsCompleted: true, Status: 'Completed'}
            // tempworkorder.fields = {...tempworkorder.fields, EndTime: new Date(), IsCompleted: true}
            workorders.splice(workorderindex, 1, tempworkorder)
            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){
                // async function getSalesOrders() {
                //     return new Promise(async(resolve, reject)=> {
                //         getVS1Data('TSalesOrderEx').then(function(dataObject) {
                //             if (dataObject.length === 0) {
                //                 accountService.getOneSalesOrderdataEx(templateObject.salesOrderId.get()).then(function(data) {

                //                 })
                //             }else {
                //                 let data = JSON.parse(dataObject[0].data);
                //                 let useData = data.tsalesorderex;
                //                 let index = useData.findIndex(order=> {
                //                     return order.fields.ID == templateObject.salesOrderId.get()
                //                 })
                //                 if(index > -1) {
                //                     accountService.getOneSalesOrderdataEx(templateObject.salesOrderId.get()).then(function(data) {
                //                         let cloneData = cloneDeep(data.fields);
                //                         cloneData.
                //                     })
                //                 }
                //             }
                //         })

                //     })
                // }

                $('.fullScreenSpin').css('display', 'none')
                swal('Process Completed', '', 'success');
            })
            // productService.getOneProductdatavs1byname(productName).then(function(data){

            // })



        }else {
            $('.fullScreenSpin').css('display', 'none')
        }
        let record = templateObject.workorderrecord.get();
        record.isCompleted = true;
        record.status = 'Completed';
        templateObject.workorderrecord.set(record);
    },

    'click .btnBack': function(event) {
        if(FlowRouter.current().queryParams.salesorderid) {
            FlowRouter.go('/salesordercard?id='+FlowRouter.current().queryParams.salesorderid)
        }else{
            FlowRouter.go('/workorderlist')
        }
    },

    // 'click #tblBOMList tbody tr': function(event) {
    //     let templateObject = Template.instance();
    //     let bomProducts =
    // }

})
