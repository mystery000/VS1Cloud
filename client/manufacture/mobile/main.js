import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './layout/header.html'
import './main.html';
import './container/startbreak.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ManufacturingService } from "../manufacturing-service";
import { ContactService } from "../../contacts/contact-service";
import { cloneDeep, template } from 'lodash';


const contactService = new ContactService();
const manufacturingService = new ManufacturingService();


var html5QrcodeScannerProdModal = null;

Template.mobileapp.onCreated(function() {
    const templateObject = Template.instance();

    templateObject.datatablerecords = new ReactiveVar([]);

    templateObject.jobNumber = new ReactiveVar();
    templateObject.jobProcess = new ReactiveVar();
    templateObject.employeeNameData = new ReactiveVar();
    templateObject.breakMessage = new ReactiveVar();
    templateObject.employeeIdData = new ReactiveVar();



    templateObject.inputStatus = new ReactiveVar();

    templateObject.showBOMModal = new ReactiveVar(false);

    templateObject.isEnterJobNumber = new ReactiveVar();
    templateObject.isEnterJobNumber.set(true);

    templateObject.isEnterJobProcess = new ReactiveVar();
    templateObject.isEnterJobProcess.set(false);

    templateObject.isClockin = new ReactiveVar();
    templateObject.isClockin.set(false);

    templateObject.isSelectEmployeeNumber = new ReactiveVar();
    templateObject.isSelectEmployeeNumber.set(false);

    templateObject.isSelectEmployeeName = new ReactiveVar();
    templateObject.isSelectEmployeeName.set(false);

    templateObject.breakState = new ReactiveVar();
    templateObject.breakState.set(false);

    templateObject.lunchState = new ReactiveVar();
    templateObject.lunchState.set(false);

    templateObject.purchaseState = new ReactiveVar();
    templateObject.purchaseState.set(false);

    templateObject.workOrderRecords = new ReactiveVar([]);
    templateObject.bomProducts = new ReactiveVar([]);

    templateObject.bomStructure = new ReactiveVar([]);


})

Template.mobileapp.onRendered(async function() {
    const templateObject = Template.instance();
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
    let temp_bom = await templateObject.getAllBOMProducts();
    templateObject.bomProducts.set(temp_bom);

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
    let temp = await templateObject.getAllWorkorders();
    templateObject.workOrderRecords.set(temp);
    templateObject.inputStatus.set("enterJobNumber");  // enterProcess, enterEmployee,  
});

Template.mobileapp.events({
    
    // Press Enter keyboard
    'keydown': function(e, instance) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#mobileBtnEnter').click();            
        }
    },

    // table tr click
    'click #tblWorkOrderList tbody tr' : function(e, instance) {
        let SaleID = $(e.target).closest('tr').find('td.sorting_1').text();
        $(".mobile-main-input").val(SaleID);

    } ,

    'click #tblJobProcessList tbody tr' : function(e, instance) {
        let processName = $(e.target).closest('tr').find('td.sorting_1').text();
        $(".mobile-main-input").val(processName);

    } ,

    'click #tblEmployeeList tbody tr' : function(e, instance) {
        let empId = $(e.target).closest('tr').find('td:eq(0)').text();
        let empName = $(e.target).closest('tr').find('td:eq(1)').text() + " " + $(e.target).closest('tr').find('td:eq(2)').text() ;
              
        Template.instance().employeeNameData.set(empName);
        Template.instance().employeeIdData.set(empId);     
      
        $(".mobile-main-input").val(empId);

    } ,

    'click #btnOpentList': function(e, instance) {

        let manufacturingService = new ManufacturingService();
        let inputStatus = Template.instance().inputStatus.get();
        let isMobile = window.innerWidth < 468;

        if(inputStatus == "enterJobNumber"){

            $(".mobile-left-employee-list").css('display', 'none');
            $(".mobile-left-jobprocess-list").css('display', 'none');
            $(".mobile-left-btn-containner").css('display', 'none');

                                  
            getVS1Data('TVS1Workorder').then(function (dataObject) {

                
                if(dataObject.length == 0 || dataObject[0].data.length == 0 ) {

                    let workOrderList = manufacturingService.getWorkOrderList();
                    $(".mobile-left-workorder-list").css('display', 'block');
                    let workOrderData = workOrderList;

                    if(!isMobile) {
                        let table = $("#tblWorkOrderList").DataTable({
                            data: workOrderData,
                            paging: false,
                            searching: false,
                            destroy:true,
                            dom: 't',
                            scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                            scrollCollapse: true,
                            autoWidth: true,
                            sScrollXInner: "100%",
                            columns: [
                                { title: 'Work Order.', mData: 'fields.ID' },
                                { title: 'Customer', mData: 'fields.Customer' },
                                { title: 'Sale Date', mData: 'fields.SaleDate' },
                            ]
                        })

                    }else {
                        let table = $("#tblWorkOrderList").DataTable({
                            data: workOrderData,
                            paging: false,
                            searching: false,
                            destroy:true,
                            dom: 't',
                            scrollY: '300px',
                            scrollCollapse: true,
                            autoWidth: true,
                            sScrollXInner: "100%",
                            columns: [
                                { title: 'Work Order.', mData: 'fields.ID' },
                                { title: 'Customer', mData: 'fields.Customer' },
                                { title: 'Sale Date', mData: 'fields.SaleDate' },
                            ]
                        })

                    }
                                     
                    
                    $("#startBreakContainer").css('display', 'none');
                    $("#btnOpentList").prop('disabled', true);

                    addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workOrderList})).then(function(datareturn){
                        
                    }).catch(function(err){
                    });


                }else {

                    $(".mobile-left-workorder-list").css('display', 'block');
                    let workOrderData = JSON.parse(dataObject[0].data);
                   
                    if(!isMobile) {

                        let table = $("#tblWorkOrderList").DataTable({
                            data: workOrderData.tvs1workorder,
                            paging: false,
                            searching: false,
                            destroy:true,
                            dom: 't',
                            scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                            scrollCollapse: true,
                            autoWidth: true,
                            sScrollXInner: "100%",
                            columns: [
                                { title: 'Work Order.', mData: 'fields.ID' },
                                { title: 'Customer', mData: 'fields.Customer' },
                                { title: 'Sale Date', mData: 'fields.SaleDate' },
                            ]
                        })

                    }else {

                        let table = $("#tblWorkOrderList").DataTable({
                            data: workOrderData.tvs1workorder,
                            paging: false,
                            searching: false,
                            destroy:true,
                            dom: 't',
                            scrollY: '300px',
                            scrollCollapse: true,
                            autoWidth: true,
                            sScrollXInner: "100%",
                            columns: [
                                { title: 'Work Order.', mData: 'fields.ID' },
                                { title: 'Customer', mData: 'fields.Customer' },
                                { title: 'Sale Date', mData: 'fields.SaleDate' },
                            ]
                        })

                    }                    

                    $("#startBreakContainer").css('display', 'none');
                    $("#btnOpentList").prop('disabled', true);

                }
            }).catch(function(error) {

                let workOrderList = manufacturingService.getWorkOrderList();

                    $(".mobile-left-workorder-list").css('display', 'block');
                    let workOrderData = workOrderList;

                    if(!isMobile) {
                        let table = $("#tblWorkOrderList").DataTable({
                            data: workOrderData,
                            paging: false,
                            searching: false,
                            destroy:true,
                            dom: 't',
                            scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                            scrollCollapse: true,
                            autoWidth: true,
                            sScrollXInner: "100%",
                            columns: [
                                { title: 'Work Order.', mData: 'fields.ID' },
                                { title: 'Customer', mData: 'fields.Customer' },
                                { title: 'Sale Date', mData: 'fields.SaleDate' },
                            ]
                        })

                    } else {
                        let table = $("#tblWorkOrderList").DataTable({
                            data: workOrderData,
                            paging: false,
                            searching: false,
                            destroy:true,
                            dom: 't',
                            scrollY: '300px',
                            scrollCollapse: true,
                            autoWidth: true,
                            sScrollXInner: "100%",
                            columns: [
                                { title: 'Work Order.', mData: 'fields.ID' },
                                { title: 'Customer', mData: 'fields.Customer' },
                                { title: 'Sale Date', mData: 'fields.SaleDate' },
                            ]
                        })

                    }                  
                    

                    $("#startBreakContainer").css('display', 'none');
                    $("#btnOpentList").prop('disabled', true);

                    addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workOrderList})).then(function(datareturn){

                    }).catch(function(err){
                    });
                
            })                 


        }

        if (inputStatus == "enterProcess") {

            $(".mobile-left-employee-list").css('display', 'none');
            $(".mobile-left-workorder-list").css('display', 'none');

            getVS1Data('TProcessStep').then(function (dataObject) {
                if(dataObject.length == 0) {

                    manufacturingService.getAllProcessData(initialBaseDataLoad, 0, false).then(function(data) {
                    
                        $(".mobile-left-jobprocess-list").css('display', 'block');
                        let processData = JSON.stringify(data);                        
                        let table_data = JSON.parse(processData);

                        if(!isMobile) {
                            let table = $("#tblJobProcessList").DataTable({
                                data: table_data.tprocessstep,
                                paging: false,
                                searching: false,
                                destroy:true,
                                dom: 't',
                                scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                                scrollCollapse: true,
                                autoWidth: true,
                                sScrollXInner: "100%",
                                columns: [
                                    { title: 'Process Name', mData: 'fields.KeyValue' },
    
                                ]
                            })

                        }else {
                            let table = $("#tblJobProcessList").DataTable({
                                data: table_data.tprocessstep,
                                paging: false,
                                searching: false,
                                destroy:true,
                                dom: 't',
                                scrollY: '300px',
                                scrollCollapse: true,
                                autoWidth: true,
                                sScrollXInner: "100%",
                                columns: [
                                    { title: 'Process Name', mData: 'fields.KeyValue' },
    
                                ]
                            })

                        }                    


                        $("#startBreakContainer").css('display', 'none');
                        $(".mobile-left-btn-containner").css('display', 'none');
                        $("#btnOpentList").prop('disabled', true);

                        addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn){
                                  
                        }).catch(function(err){
                        });

                    })


                } else {
                    $(".mobile-left-jobprocess-list").css('display', 'block');
                    let processData = JSON.parse(dataObject[0].data);

                    if(!isMobile) {
                        let table = $("#tblJobProcessList").DataTable({
                            data: processData.tprocessstep,
                            paging: false,
                            searching: false,
                            destroy:true,
                            dom: 't',
                            scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                            scrollCollapse: true,
                            autoWidth: true,
                            sScrollXInner: "100%",
                            columns: [
                                { title: 'Process Name', mData: 'fields.KeyValue' },
    
                            ]
                        })

                    }else {
                        
                        let table = $("#tblJobProcessList").DataTable({
                            data: processData.tprocessstep,
                            paging: false,
                            searching: false,
                            destroy:true,
                            dom: 't',
                            scrollY: '300px',
                            scrollCollapse: true,
                            autoWidth: true,
                            sScrollXInner: "100%",
                            columns: [
                                { title: 'Process Name', mData: 'fields.KeyValue' },
    
                            ]
                        })

                    }
                    


                    $("#startBreakContainer").css('display', 'none');
                    $(".mobile-left-btn-containner").css('display', 'none');
                    $("#btnOpentList").prop('disabled', true);
                }


            }).catch(function(error) {

                    manufacturingService.getAllProcessData(initialBaseDataLoad, 0, false).then(function(data) {
                        addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn){
                        }).catch(function(err){
                        });

                        $(".mobile-left-jobprocess-list").css('display', 'block');
                        let processData = JSON.parse(data);
                        if(!isMobile) {
                            let table = $("#tblJobProcessList").DataTable({
                                data: processData.tprocessstep,
                                paging: false,
                                searching: false,
                                destroy:true,
                                dom: 't',
                                scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                                scrollCollapse: true,
                                autoWidth: true,
                                sScrollXInner: "100%",
                                columns: [
                                    { title: 'Process Name', mData: 'fields.KeyValue' },
    
                                ]
                            })

                        }else {
                            let table = $("#tblJobProcessList").DataTable({
                                data: processData.tprocessstep,
                                paging: false,
                                searching: false,
                                destroy:true,
                                dom: 't',
                                scrollY: '300px',
                                scrollCollapse: true,
                                autoWidth: true,
                                sScrollXInner: "100%",
                                columns: [
                                    { title: 'Process Name', mData: 'fields.KeyValue' },
    
                                ]
                            })

                        }
                        


                        $("#startBreakContainer").css('display', 'none');
                        $(".mobile-left-btn-containner").css('display', 'none');
                        $("#btnOpentList").prop('disabled', true);

                    })
            })

            $("#startBreakContainer").css('display', 'none');
            $(".mobile-left-btn-containner").css('display', 'none');
            $("#btnOpentList").prop('disabled', true);

        }
        if(inputStatus == "enterEmployee") {

            $(".mobile-left-workorder-list").css('display', 'none');
            $(".mobile-left-jobprocess-list").css('display', 'none');

            
            getVS1Data('TEmployee').then(function (dataObject) {
                $(".mobile-left-employee-list").css('display', 'block');
                let empdata = JSON.parse(dataObject[0].data);
                if(!isMobile) {
                    let table = $("#tblEmployeeList").DataTable({
                        data: empdata.temployee,
                        paging: false,
                        searching: false,
                        destroy:true,
                        dom: 't',
                        scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                        scrollCollapse: true,
                        autoWidth: true,
                        sScrollXInner: "100%",
                        columns: [
                            
                            { title: 'EmpId', mData: 'fields.ID' },
    
                            { title: 'FirstName', mData: 'fields.FirstName' },
                            { title: 'LastName', mData: 'fields.LastName' },
                        ]
                    });

                }else {
                    let table = $("#tblEmployeeList").DataTable({
                        data: empdata.temployee,
                        paging: false,
                        searching: false,
                        destroy:true,
                        dom: 't',
                        scrollY: '300px',
                        scrollCollapse: true,
                        autoWidth: true,
                        sScrollXInner: "100%",
                        columns: [
                            
                            { title: 'EmpId', mData: 'fields.ID' },
    
                            { title: 'FirstName', mData: 'fields.FirstName' },
                            { title: 'LastName', mData: 'fields.LastName' },
                        ]
                    });
                }
                
                // $('#tblEmployeeList tbody').on('click', 'tr', function () {
                //     var data = table.row(this).data();

                //     $(".mobile-main-input").val(data.fields.FirstName + "  " + data.fields.LastName);
                // });

                $("#startBreakContainer").css('display', 'none');
                $(".mobile-left-btn-containner").css('display', 'none');
                $("#btnOpentList").prop('disabled', true);

            });
       

        }

    },
    'click #phoneVoid': function(e, instance) {
        $(".mobile-checkin-container").css('display', 'none');
        $(".mobile-right-btn-containner").css('display', 'flex');
    },
    'click .mobile-btn-number': function(e, instance) {

        // if(Template.instance().inputStatus.get() == "stopJob") {
        //     $(".mobile-stop-job-input").val($(".mobile-stop-job-input").val() + e.target.attributes.calcvalue.nodeValue)     
        // } else {
        //     $(".mobile-main-input").val($(".mobile-main-input").val() + e.target.attributes.calcvalue.nodeValue)
        // }

        $(".mobile-main-input").val($(".mobile-main-input").val() + e.target.attributes.calcvalue.nodeValue)
        
    },
    'click #phoneQrCodeScan': function(e, instance) {
        $('#tblPhoneEmployeeListContent').css('display', 'none');
        if ($.fn.DataTable.isDataTable( '#tblPhoneEmployeeList' ) ) {
            $("#tblPhoneEmployeeList").DataTable().destroy();
        }
        $("#mobile-phone-qr-scan").css('display', 'block');
        function onScanSuccessProdModal(decodedText, decodedResult) {
        }
        html5QrcodeScannerProdModal = new Html5QrcodeScanner(
            "mobile-phone-qr-scan", {
                fps: 10,
                qrbox: 250,
                rememberLastUsedCamera: true
            });
        html5QrcodeScannerProdModal.render(onScanSuccessProdModal);
    },
    'click #mobileBtnQrCodeScan': function(e, instance) {
        $("#qr-reader-productmodal").css('display', 'block');
        function onScanSuccessProdModal(decodedText, decodedResult) {
        }
        html5QrcodeScannerProdModal = new Html5QrcodeScanner(
            "qr-reader-productmodal", {
                fps: 10,
                qrbox: 250,
                rememberLastUsedCamera: true
            });
        html5QrcodeScannerProdModal.render(onScanSuccessProdModal);
    },
    'click #mobilePhoneOpenList': function(e, instance) {
        $('#mobile-phone-qr-scan').css('display', 'none');
        $('#tblPhoneEmployeeListContent').css('display', 'block');
        if ($.fn.DataTable.isDataTable( '#tblPhoneEmployeeList' ) ) {
            $("#tblPhoneEmployeeList").DataTable().destroy();
        }
        getVS1Data('TEmployee').then(function (dataObject) {
            let empdata = JSON.parse(dataObject[0].data);
            let table = $("#tblPhoneEmployeeList").DataTable({
                data: empdata.temployee,
                paging: false,
                searching: true,
                dom: 't',
                scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                scrollCollapse: true,
                autoWidth: true,
                sScrollXInner: "100%",
                columns: [
                    { title: 'FirstName', mData: 'fields.FirstName' },
                    { title: 'LastName', mData: 'fields.LastName' },
                ]
            })
            $('#tblPhoneEmployeeList tbody').on('click', 'tr', function () {
                var data = table.row(this).data();
                $(".mobile-main-input").val(data.fields.EmployeeName)
            });
        });
    },

    'click #mobileBtnCancel': function(e, instance) {

        $("#qr-reader-productmodal").css('display', 'none');
        $(".mobile-main-input").val("");
        $(".mobile-left-employee-list").css('display','none');
        $(".mobile-left-workorder-list").css('display','none');
        $(".mobile-left-jobprocess-list").css('display','none');

        $(".mobile-left-btn-containner").css('display', 'block');
        $("#startBreakContainer").css('display', 'none');

        $("#btnOpentList").removeAttr('disabled'); // when click cancel , openlist button will be active

        if(Template.instance().isSelectEmployeeName.get()) {  //after employ number not find result, click cancel
            Template.instance().isSelectEmployeeNumber.set(true);
        }

        // html5QrcodeScannerProdModal.html5Qrcode.stop().then((ignore) => {
        // }).catch((err) => console.log(err));

    },

    'click #btnClockIn': async function(e, instance) {
        
        let templateObject = Template.instance();
        Template.instance().isClockin.set(true);

        let empName = templateObject.employeeNameData.get();
        
       // Template.instance().inputStatus.set("enterEmployee");
       
        if (window.screen.width <= 480) {
            $(".mobile-right-btn-containner").css('display', 'none');
        }

        $("#btnClockIn").css('background', '#999');
        $("#btnStartJob").css('background', '#00AE00');
        $("#btnStartBreak").css('background', '#00AE00');
        $("#btnClockOut").css('background', '#C5000B');
        $('#btnClockIn').prop('disabled', true);
        $("#btnClockOut").removeAttr('disabled');
        $("#btnStartBreak").removeAttr('disabled');
        $("#btnStartJob").removeAttr('disabled');
        $(".mobile-header-status-text").text("Clock In");

        let jobNumber = templateObject.jobNumber.get();
       
        let workorders = await templateObject.getAllWorkorders();
        let currentworkorder;

        let workorderindex = workorders.findIndex(order => {
            return order.fields.ID == jobNumber;
        })

        let currentime = new Date().toLocaleTimeString();
        let startedTimes = [];
       
        if(workorderindex > -1) {
            currentworkorder = workorders[workorderindex];

            startedTimes = currentworkorder.fields.StartedTimes;
            startedTimes.push(currentime);

            let process_name = templateObject.jobProcess.get();
            let tempworkorder = cloneDeep(currentworkorder);
            let bomStructure = JSON.parse(tempworkorder.fields.BOMStructure);
            let bomDetailData = JSON.parse(bomStructure.Details);

            for(let i=0 ;i < bomDetailData.length; i++) {
                if(bomDetailData[i].process == process_name) {
                    bomDetailData[i].startedTimes = startedTimes;
                }
            }
             bomStructure.details = JSON.stringify(bomDetailData);
            
            tempworkorder.fields = {...tempworkorder.fields, StartedTimes: startedTimes,EmployeeName: empName, BOMStructure:JSON.stringify(bomStructure)};
            workorders.splice(workorderindex, 1, tempworkorder);
            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){

            })
        }
    },

    'click #btnClockIn_phone': async function(e, instance) {
        let templateObject = Template.instance();
        Template.instance().isClockin.set(true);
        // Template.instance().isEnterJobNumber.set(false);
        // Template.instance().isEnterJobProcess.set(false);
        // Template.instance().isSelectEmployeeNumber.set(true);

        // $(".mobile-checkin-container").css('display', 'block');

        if (window.screen.width <= 480) {
            $(".mobile-right-btn-containner").css('display', 'none');
        }

        $("#btnClockIn_phone").css('background', '#999');
        $("#btnStartJob_phone").css('background', '#00AE00');
        $("#btnStartBreak_phone").css('background', '#00AE00');
        $("#btnClockOut_phone").css('background', '#C5000B');
        $('#btnClockIn_phone').prop('disabled', true);
        $("#btnClockOut_phone").removeAttr('disabled');
        $("#btnStartBreak_phone").removeAttr('disabled');
        $("#btnStartJob_phone").removeAttr('disabled');
        $(".mobile-header-status-text").text("Clock In");

        let jobNumber = templateObject.jobNumber.get();
        let empName = templateObject.employeeNameData.get();
 

       
        let workorders = await templateObject.getAllWorkorders();
        let currentworkorder;

        let workorderindex = workorders.findIndex(order => {
            return order.fields.ID == jobNumber;
        })

        let currentime = new Date().toLocaleTimeString();
        let startedTimes = [];
       
        if(workorderindex > -1) {
            currentworkorder = workorders[workorderindex];

            startedTimes = currentworkorder.fields.StartedTimes;
            startedTimes.push(currentime);

            let process_name = templateObject.jobProcess.get();
            let tempworkorder = cloneDeep(currentworkorder);
            let bomStructure = JSON.parse(tempworkorder.fields.BOMStructure);
            let bomDetailData = JSON.parse(bomStructure.Details);

            for(let i=0 ;i < bomDetailData.length; i++) {
                if(bomDetailData[i].process == process_name) {
                    bomDetailData[i].startedTimes = startedTimes;
                }
            }
             bomStructure.details = JSON.stringify(bomDetailData);
            
            tempworkorder.fields = {...tempworkorder.fields, StartedTimes: startedTimes,EmployeeName: empName, BOMStructure:JSON.stringify(bomStructure)};
            workorders.splice(workorderindex, 1, tempworkorder);
            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){

            })
        }
    },

    'click #btnClockOut': async function (e, instance) {
        let templateObject = Template.instance();
        Template.instance().isClockin.set(false);
     //   Template.instance().inputStatus.set("enterJobNumber");

        $('#btnClockOut').prop('disabled', true);
        $("#btnClockOut").css('background', '#0084D1');
        $("#btnClockIn").removeAttr('disabled');
        $('#btnStartJob').prop('disabled', true);
        $('#btnStartBreak').prop('disabled', true);
        $("#btnClockIn").css('background', '#00AE00');
        $("#btnStartJob").css('background', '#0084D1');
        $("#btnStartBreak").css('background', '#0084D1');
        $("#btnStopJob").css('background', '#0084D1');
        $('#btnStopJob').prop('disabled', true);
        $("#btnStopBreak").css('background', '#0084D1');
        $('#btnStopBreak').prop('disabled', true);
        $(".mobile-header-status-text").text("Clock Out");

        let jobNumber = templateObject.jobNumber.get();

       
        let workorders = await templateObject.getAllWorkorders();
        let currentworkorder;

        let workorderindex = workorders.findIndex(order => {
            return order.fields.ID == jobNumber;
        })

        let currentime = new Date().toLocaleTimeString();
        let stoppedTimes = [];
       
        
        if(workorderindex > -1) {
            currentworkorder = workorders[workorderindex];

            stoppedTimes = currentworkorder.fields.StoppedTimes;
            stoppedTimes.push(currentime);

            let process_name = templateObject.jobProcess.get();
            let tempworkorder = cloneDeep(currentworkorder);
            let bomStructure = JSON.parse(tempworkorder.fields.BOMStructure);
            let bomDetailData = JSON.parse(bomStructure.Details);

            for(let i=0 ;i < bomDetailData.length; i++) {
                if(bomDetailData[i].process == process_name) {
                    bomDetailData[i].StoppedTime = stoppedTimes;
                }
            }
            bomStructure.details = JSON.stringify(bomDetailData);
            tempworkorder.fields = {...tempworkorder.fields, StoppedTimes: stoppedTimes, BOMStructure:JSON.stringify(bomStructure)};
            workorders.splice(workorderindex, 1, tempworkorder);
            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){

            })
        }
    },

    'click #btnClockOut_phone': async function (e, instance) {

        let templateObject = Template.instance();
        Template.instance().isClockin.set(false);

       // Template.instance().inputStatus.set("enterJobNumber");

        $('#btnClockOut_phone').prop('disabled', true);
        $("#btnClockOut_phone").css('background', '#0084D1');
        $("#btnClockIn_phone").removeAttr('disabled');
        $('#btnStartJob_phone').prop('disabled', true);
        $('#btnStartBreak_phone').prop('disabled', true);
        $("#btnClockIn_phone").css('background', '#00AE00');
        $("#btnStartJob_phone").css('background', '#0084D1');
        $("#btnStartBreak_phone").css('background', '#0084D1');
        $("#btnStopJob_phone").css('background', '#0084D1');
        $('#btnStopJob_phone').prop('disabled', true);
        $("#btnStopBreak_phone").css('background', '#0084D1');
        $('#btnStopBreak_phone').prop('disabled', true);
        $(".mobile-header-status-text").text("Clock Out");

        let jobNumber = templateObject.jobNumber.get();

       
        let workorders = await templateObject.getAllWorkorders();
        let currentworkorder;

        let workorderindex = workorders.findIndex(order => {
            return order.fields.ID == jobNumber;
        })

        let currentime = new Date().toLocaleTimeString();
        let stoppedTimes;
       
        if(workorderindex > -1) {
            currentworkorder = workorders[workorderindex];

            stoppedTimes = currentworkorder.fields.StoppedTimes;
            stoppedTimes.push(currentime);

            let process_name = templateObject.jobProcess.get();
            let tempworkorder = cloneDeep(currentworkorder);
            let bomStructure = JSON.parse(tempworkorder.fields.BOMStructure);
            let bomDetailData = JSON.parse(bomStructure.Details);

            for(let i=0 ;i < bomDetailData.length; i++) {
                if(bomDetailData[i].process == process_name) {
                    bomDetailData[i].StoppedTime = stoppedTimes;
                }
            }
            bomStructure.details = JSON.stringify(bomDetailData);
            tempworkorder.fields = {...tempworkorder.fields, StoppedTimes: stoppedTimes, BOMStructure:JSON.stringify(bomStructure)};
            workorders.splice(workorderindex, 1, tempworkorder);
            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){

            })
        }
    },


    'click #btnStartJob': function(e, instance) {
        $('#btnStartJob').prop('disabled', true);
        $("#btnStartJob").css('background', '#999');
        $("#btnStopJob").css('background', '#C5000B');
        $("#btnStopJob").removeAttr('disabled');

        $(".mobile-header-status-text").text("Start Job");
        $(".mobile-main-input").val("Start Job");

    },

    'click #btnStartJob_phone': function(e, instance) {
        $('#btnStartJob_phone').prop('disabled', true);
        $("#btnStartJob_phone").css('background', '#999');
        $("#btnStopJob_phone").css('background', '#C5000B');
        $("#btnStopJob_phone").removeAttr('disabled');

        $(".mobile-header-status-text").text("Start Job");
        $(".mobile-main-input").val("Start Job");

    },


    'click #btnStartBreak': function(e, instance) {
        $("#startBreakContainer").css('display', 'block');
        $('#btnStartBreak').prop('disabled', true);
        $("#btnStartBreak").css('background', '#999');
        $("#btnStopBreak").css('background', '#C5000B');
        $("#btnStopBreak").removeAttr('disabled');
        $("#btnOpentList").removeAttr('disabled');
        $(".mobile-left-btn-containner").css('display', 'none');
        $(".mobile-left-employee-list").css('display', 'none');
       // $("#mobileBtnCancel").prop('disabled', true);
        $(".mobile-header-status-text").text("Start Break");

        $(".mobile-main-input").val("Start Break");

    },

    'click #btnStartBreak_phone': function(e, instance) {
        $("#startBreakContainer").css('display', 'block');
        $('#btnStartBreak_phone').prop('disabled', true);
        $("#btnStartBreak_phone").css('background', '#999');
        $("#btnStopBreak_phone").css('background', '#C5000B');
        $("#btnStopBreak_phone").removeAttr('disabled');
        $("#btnOpentList").removeAttr('disabled');
        $(".mobile-left-btn-containner").css('display', 'none');
        $(".mobile-left-employee-list").css('display', 'none');
     //   $("#mobileBtnCancel").prop('disabled', true);
        $(".mobile-header-status-text").text("Start Break");

        $(".mobile-main-input").val("Start Break");

    },


    'click #btnStopJob': function(e, instance) {
        $('#btnStopJob').prop('disabled', true);
        $("#btnStartJob").css('background', '#00AE00');
        $("#btnStopJob").css('background', '#0084D1');
        $("#btnStartJob").removeAttr('disabled');
        $('.mobile-stop-job-container').css('display', 'block');
        $('.mobile-right-btn-containner').css('display', 'none');
        $("#startBreakContainer").css('display', 'none');
        $(".mobile-left-btn-containner").css('display', 'block');

        $(".mobile-header-status-text").text("Stop Job");
        $(".mobile-main-input").val("Stop Job");

        Template.instance().inputStatus.set("stopJob");

    },

    'click #btnStopJob_phone': function(e, instance) {
        $('#btnStopJob_phone').prop('disabled', true);
        $("#btnStartJob_phone").css('background', '#00AE00');
        $("#btnStopJob_phone").css('background', '#0084D1');
        $("#btnStartJob_phone").removeAttr('disabled');
        $('.mobile-stop-job-container').css('display', 'block');
        $('.mobile-right-btn-containner').css('display', 'none');
        $("#startBreakContainer").css('display', 'none');
        $(".mobile-left-btn-containner").css('display', 'block');

        $(".mobile-header-status-text").text("Stop Job");
        $(".mobile-main-input").val("Stop Job");

        Template.instance().inputStatus.set("stopJob");


    },


    'click #btnStopBreak': function(e, instance) {
        $(".mobile-left-btn-containner").css('display', 'flex');
        $(".mobile-left-employee-list").css('display', 'none');
        $("#startBreakContainer").css('display', 'none');
        $('#btnStopBreak').prop('disabled', true);
        $("#btnStartBreak").css('background', '#00AE00');
        $("#btnStopBreak").css('background', '#0084D1');
        $("#btnStartBreak").removeAttr('disabled');
        $("#btnOpentList").removeAttr('disabled');
        $("#mobileBtnCancel").removeAttr('disabled');
        $(".mobile-header-status-text").text("Stop Break");

        $(".mobile-main-input").val("Stop Break");
    },

    'click #btnStopBreak_phone': function(e, instance) {
        $(".mobile-left-btn-containner").css('display', 'flex');
        $(".mobile-left-employee-list").css('display', 'none');
        $("#startBreakContainer").css('display', 'none');
        $('#btnStopBreak_phone').prop('disabled', true);
        $("#btnStartBreak_phone").css('background', '#00AE00');
        $("#btnStopBreak_phone").css('background', '#0084D1');
        $("#btnStartBreak_phone").removeAttr('disabled');
        $("#btnOpentList").removeAttr('disabled');
        $("#mobileBtnCancel").removeAttr('disabled');
        $(".mobile-header-status-text").text("Stop Break");

        $(".mobile-main-input").val("Stop Break");
    },

    'click #mobileBtnEnter': function(e, instance) {  // Click enter button
        
        let templateObject = Template.instance();
        let inputValue  = $(".mobile-main-input").val();
        let isClockin = Template.instance().isClockin.get();
        
        let inputStatus = Template.instance().inputStatus.get();

        $("#btnOpentList").removeAttr('disabled');  //openlist button enable
        $(".mobile-left-workorder-list").css('display', 'none'); // workorder list none
        $(".mobile-left-jobprocess-list").css('display', 'none'); // process list none
        $(".mobile-left-employee-list").css('display', 'none');  // employee list none
        $(".mobile-left-btn-containner").css('display', 'block');  // Keypad display
    

        if (inputStatus == "enterJobNumber") {

            
            let templateObject = Template.instance();

            getVS1Data('TVS1Workorder').then(function (dataObject) {
                let checkWorkorder = false ;

                if(dataObject.length == 0) {
                    let workOrderData = manufacturingService.getWorkOrderList();

                    for(var i = 0; i < workOrderData.length; i ++) {
                        if (workOrderData[i].fields.ID == inputValue) {
                            checkWorkorder = true
                        }
                    }

                    if (!checkWorkorder) {
                        $('.mobile-header-status-text').text('The Workorder Number is not correct. Please type correct workorder number');
                        $(".mobile-main-input").val("");
                    }

                    else {

                        $('.mobile-header-status-text').text('Please set Job Process');
                        templateObject.jobNumber.set(inputValue);

                        $(".mobile-main-input").val("");
                        templateObject.inputStatus.set("enterProcess");                           
            
                    }                  
                    
                    
                    addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workOrderData})).then(function(datareturn){
                        
                    }).catch(function(err){

                    });

                } else {
                    
                    let workOrderData = JSON.parse(dataObject[0].data).tvs1workorder;

                    for(var i = 0; i < workOrderData.length; i ++) {
                        if (workOrderData[i].fields.ID == inputValue) {
                            checkWorkorder = true
                        }
                    }

                    if (!checkWorkorder) {
                        $('.mobile-header-status-text').text('The Workorder Number is not correct. Please type correct workorder number');
                        $(".mobile-main-input").val("");
                    }

                    else {

                        $('.mobile-header-status-text').text('Please set Job Process');
                        templateObject.jobNumber.set(inputValue);

                        $(".mobile-main-input").val("");
                        templateObject.inputStatus.set("enterProcess");                           
            
                    }

                }

                            
                
                
            });           
                     
          

        }

        if (inputStatus == "enterProcess") {     
           
            getVS1Data('TProcessStep').then(function (dataObject) {
               
                let checkProcessData = false;
               
                if(dataObject.length == 0) {

                    manufacturingService.getAllProcessData(initialBaseDataLoad, 0, false).then(function(data) {                    
                                                

                        let processData = data.tprocessstep; 
                        for(var i = 0; i < processData.length; i ++) {
                            if (processData[i].fields.Description == inputValue) {
                                
                                checkProcessData = true;                            
                                
                            }
                        }
    
                        if(checkProcessData) {
    
                            $('.mobile-header-status-text').text('Successfully added JobProcess information. Please Select Employee');
                            $(".mobile-main-input").val("");
                            // $("#btnClockIn").removeAttr('disabled');
                            // $("#btnClockIn").css('background', '#00AE00');
                
                            // $("#btnClockIn_phone").removeAttr('disabled');
                            // $("#btnClockIn_phone").css('background', '#00AE00');
                
                            templateObject.jobProcess.set(inputValue);
                            templateObject.inputStatus.set("enterEmployee");
    
                        }else {
                            $('.mobile-header-status-text').text('The process name is not correct. Please type correct process');
                            $(".mobile-main-input").val("");
    
                        }

                    })


                } else {
                    
                    let processData = JSON.parse(dataObject[0].data).tprocessstep;

                    for(var i = 0; i < processData.length; i ++) {
                        if (processData[i].fields.Description == inputValue) {
                            
                            checkProcessData = true;                            
                            
                        }
                    }

                    if(checkProcessData) {

                        $('.mobile-header-status-text').text('Successfully added JobProcess information. Please Select Employee');
                        $(".mobile-main-input").val("");
                        // $("#btnClockIn").removeAttr('disabled');
                        // $("#btnClockIn").css('background', '#00AE00');
            
                        // $("#btnClockIn_phone").removeAttr('disabled');
                        // $("#btnClockIn_phone").css('background', '#00AE00');
            
                        templateObject.jobProcess.set(inputValue);
                        templateObject.inputStatus.set("enterEmployee");

                    }else {
                        $('.mobile-header-status-text').text('The process name is not correct. Please type correct process');
                        $(".mobile-main-input").val("");

                    }

                    
                }


            }).catch(function(error) {

                    manufacturingService.getAllProcessData(initialBaseDataLoad, 0, false).then(function(data) {
                        let processData = data.tprocessstep; 

                        for(var i = 0; i < processData.length; i ++) {
                            if (processData[i].fields.Description == inputValue) {
                                
                                checkProcessData = true;                            
                                
                            }
                        }
    
                        if(checkProcessData) {
    
                            $('.mobile-header-status-text').text('Successfully added JobProcess information. Please Select Employee');
                            $(".mobile-main-input").val("");
                            // $("#btnClockIn").removeAttr('disabled');
                            // $("#btnClockIn").css('background', '#00AE00');
                
                            // $("#btnClockIn_phone").removeAttr('disabled');
                            // $("#btnClockIn_phone").css('background', '#00AE00');
                
                            templateObject.jobProcess.set(inputValue);
                            templateObject.inputStatus.set("enterEmployee");
    
                        }else {
                            $('.mobile-header-status-text').text('The process name is not correct. Please type correct process');
                            $(".mobile-main-input").val("");
    
                        }                                      


                        
                    })
            })         
            

        }

        if(inputStatus == "enterEmployee") {

            let empId = $('.mobile-main-input').val();
            let checkEmpId = false;
            
            
            getVS1Data('TEmployee').then(function (dataObject) {
            
                let employData = JSON.parse(dataObject[0].data);
                             
                for(var i = 0; i < employData.temployee.length; i ++) {
                    if (employData.temployee[i].fields.ID == empId) {
                        checkEmpId = true;
                    }
                }

                if (!checkEmpId) {
                    $('.mobile-header-status-text').text('Employee Number is not correct. Please select correct Number');
                    $(".mobile-main-input").val("");
                }

                else {

                    $('.mobile-header-status-text').text('Clock Starting');
                    $(".mobile-main-input").val("");
                    
                    $("#btnClockIn").removeAttr('disabled');
                    $("#btnClockIn").css('background', '#00AE00');
        
                    $("#btnClockIn_phone").removeAttr('disabled');
                    $("#btnClockIn_phone").css('background', '#00AE00');

                    templateObject.inputStatus.set("Clockin");

                    $('.mobile-header-status-text').text('Successfully Set Employee Number');         
                        
                }
                
            }); 

            
        }

    },

    'click #btnSaveClose': function(e, instance) {
        $('.mobile-stop-job-container').css('display', 'none');
        $('.mobile-right-btn-containner').css('display', 'flex');
        $('.mobile-stop-job-input').val(0);
    },

    'click #btnCompleteProcess': async function(e, instance) {
        $('.mobile-stop-job-container').css('display', 'none');
        $('.mobile-right-btn-containner').css('display', 'flex');

        $('#startBreakContainer').css('display','none');
        $(".mobile-left-btn-containner").css('display', 'block');  // Keypad display
        
        let templateObject = Template.instance();
        templateObject.inputStatus.set("enterJobNumber");      

        templateObject.isClockin.set(false);
        let jobNumber = templateObject.jobNumber.get();

        let empId = templateObject.employeeIdData.get();
        let empName = templateObject.employeeNameData.get();


        // $('.fullScreenSpin').css('display', 'inline-block');

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

        let workorders = await templateObject.getAllWorkorders();
        let currentworkorder;
        let currentime = new Date().toLocaleTimeString();

        let workorderindex = workorders.findIndex(order => {
            return order.fields.ID == jobNumber;
        });
        let stoppedTimes;
        
        if(workorderindex > -1) {
            currentworkorder = workorders[workorderindex];

            stoppedTimes = currentworkorder.fields.StoppedTimes;
            stoppedTimes.push(currentime);

            let process_name = templateObject.jobProcess.get();
            let tempworkorder = cloneDeep(currentworkorder);
            let bomStructure = JSON.parse(tempworkorder.fields.BOMStructure);
            let bomDetailData = JSON.parse(bomStructure.Details);

            for(let i=0 ;i < bomDetailData.length; i++) {
                if(bomDetailData[i].process == process_name) {
                    bomDetailData[i].StoppedTime = stoppedTimes;
                }
            }
            bomStructure.details = JSON.stringify(bomDetailData);
            tempworkorder.fields = {...tempworkorder.fields, StoppedTimes: stoppedTimes, BOMStructure:JSON.stringify(bomStructure)};
            workorders.splice(workorderindex, 1, tempworkorder);
            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){

            })            
          
            
            
            let BomDataList = [];
            let bomStructureData = JSON.parse(currentworkorder.fields.BOMStructure);
            let change_to = bomStructureData.TotalChangeQty;
            let total_qty_original = bomStructureData.TotalQtyOriginal;
            let wastage_qty_temp; 
       

            if(isNaN(total_qty_original) || total_qty_original == "") {
                total_qty_original = 0;
            } else {
                total_qty_original = parseFloat(total_qty_original).toFixed(2);
            } 

            if(isNaN(change_to) || change_to == "") {
                change_to = total_qty_original;
            }else {
                change_to = parseFloat(change_to).toFixed(2);
            }

         

            wastage_qty_temp = change_to - total_qty_original;

            let tempBomData = {item: bomStructureData.Caption , uom: "Units(1)", total : total_qty_original, changeTo: change_to, wastage: wastage_qty_temp };



            BomDataList.push(tempBomData);

            bomDetailData = JSON.parse(bomStructureData.Details);
            let change_to_detail;
            let total_qty_detail;
            let wastage_qty_detail;


            for (let i = 0; i < bomDetailData.length; i++) {
               
                total_qty_detail = bomDetailData[i].qty;
                change_to_detail = bomDetailData[i].changed_qty;

                
                if(isNaN(total_qty_detail) || total_qty_detail == "") {
                    total_qty_detail = 0;
                } else {
                    total_qty_detail = parseFloat(total_qty_detail).toFixed(2);
                }

                    
                if(isNaN(change_to_detail) || change_to_detail == "" || change_to_detail == 0) {
                    change_to_detail = total_qty_detail;
                }else {
                    change_to_detail = parseFloat(change_to_detail).toFixed(2);
                }
                
                wastage_qty_detail = change_to_detail - total_qty_detail;               

                tempBomData = {item: '<span style = "margin-left:20px;"> '+ bomDetailData[i].productName + '</span>', uom:"Units(1)",  total: total_qty_detail, changeTo: change_to_detail , wastage: wastage_qty_detail };
                BomDataList.push(tempBomData);  
            }

            let wastage_table = $("#tblWastageForm").DataTable({
                data: BomDataList,
                paging: true,
                searching: false,
                destroy: true,
                dom: 't',
                ordering: false,
                editable:true,
                info:true,
                columns: [
                    { title: 'Item', mData: 'item' },
                    { title: 'UOM', mData: 'uom' },
                    { title: 'Total', mData: 'total' },
                    { title: 'Change To', mData: 'changeTo', className: 'editable' },
                    { title: 'Wastage', mData: 'wastage' }

                ],
                responsive: true,
            })




            $('#tblWastageForm').on( 'click', 'tbody td.editable', function () {
                $(this).attr('contenteditable', 'true');

            } );

            $('#tblWastageForm').on( 'change keyup input', 'tbody td.editable', function () {
                                           
                // var cell = wastage_table.cell(this);
                // var index = cell.index();
                // var column = index.column;
                // var row = index.row;

                // var cur_val = parseFloat($(this).text());
                // var prev_val = parseFloat(cell.data());
                          
                // var nextCell = wastage_table.cell(row, column + 1);
                //     nextCell.data(prev_val - cur_val);    
                
                var total_qty = parseFloat($(this).parent().find("td:eq(2)").text());
                var change_to_qty = parseFloat($(this).parent().find("td:eq(3)").text());
                var wastage_qty = 0;

                               
                if(isNaN(change_to_qty)){
                    wastage_qty = 0;
                }else {
                    wastage_qty = change_to_qty - total_qty;
                }

                
                $(this).parent().find("td:eq(4)").text(wastage_qty);
                           
            } );

            $('.btn-save-wastage').on('click', function(e,instance) {
                $('.fullScreenSpin').css('display', 'inline-block');
                $('.fullScreenSpin').css('display', 'none')
        
                var changed_temp = [];
                
       
                $("#tblWastageForm tr").each(function(){
                    var thirdColumnValue = $(this).find("td:eq(3)").text();
                    changed_temp.push(thirdColumnValue);
        
                });
                 
                bomStructureData.TotalChangeQty = changed_temp[1];
              
                for (let i = 0; i < bomDetailData.length; i++) {
                    bomDetailData[i].changed_qty = changed_temp[i+2] ;
                }
                               
                bomStructureData.Details = JSON.stringify(bomDetailData);
                tempworkorder.fields = {...tempworkorder.fields, BOMStructure: JSON.stringify(bomStructureData), EmployeeId: empId, EmployeeName: empName }
                workorders.splice(workorderindex, 1, tempworkorder);

                addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){

                       $('.fullScreenSpin').css('display', 'none')
                       swal('The wastage is saved', '', 'success');
                       $('#WastageModal').modal('toggle');
                })       
                        
            });           

        }

        // wastage form modal
        e.preventDefault();
        e.stopPropagation();
        $('#WastageModal').modal('toggle');

        // tablet buttons
   
        $('#btnClockOut').prop('disabled', true);
        $("#btnClockOut").css('background', '#0084D1');

        $("#btnClockIn").prop('disabled',true);
        $("#btnClockIn").css('background', '#0084D1');

        $('#btnStartBreak').prop('disabled', true);
        $("#btnStartBreak").css('background', '#0084D1');
        
        $('#btnStopBreak').prop('disabled', true);
        $("#btnStopBreak").css('background', '#0084D1');

        $('#btnStartJob').prop('disabled', true);
        $("#btnStartJob").css('background', '#0084D1');
        $('#btnStopJob').prop('disabled', true);
        $("#btnStopJob").css('background', '#0084D1');      
        
        // phone button 

        $("#btnClockIn_phone").prop('disabled',true);
        $("#btnClockIn_phone").css('background', '#0084D1');

        $('#btnClockOut_phone').prop('disabled', true);
        $("#btnClockOut_phone").css('background', '#0084D1');

        $('#btnStartBreak_phone').prop('disabled', true);
        $("#btnStartBreak_phone").css('background', '#0084D1');
        
        $('#btnStopBreak_phone').prop('disabled', true);
        $("#btnStopBreak_phone").css('background', '#0084D1');

        $('#btnStartJob_phone').prop('disabled', true);        
        $("#btnStartJob_phone").css('background', '#0084D1');
        
        $('#btnStopJob_phone').prop('disabled', true);
        $("#btnStopJob_phone").css('background', '#0084D1');
 
        $(".mobile-header-status-text").text("Enter Job Number");
        $(".mobile-main-input").val(" ");


    },

    'change #breakCheck': function(e, instance) {

        $('#lunchCheck').prop('checked', false);
        $('#purchaseCheck').prop('checked', false);


        if($('#breakCheck').is(":checked") == true){
            const now = new Date();
            const currentTime = now.toLocaleTimeString(); // returns a formatted string like "3:30:45 PM"

            $(".mobile-main-input").val("Job Paused  " + currentTime);
            Template.instance().breakState.set(true);
         }else{
            $(".mobile-main-input").val("Job Started ");
            Template.instance().breakState.set(false);
         }
    },

    'change #lunchCheck': function(event) {
        $('#breakCheck').prop('checked', false);
        $('#purchaseCheck').prop('checked', false);

        if($('#lunchCheck').is(":checked") == true){
            const now = new Date();
            const currentTime = now.toLocaleTimeString(); // returns a formatted string like "3:30:45 PM"
         
            $(".mobile-main-input").val("Job Paused  " + currentTime);
            Template.instance().lunchState.set(true);
        } else{
            $(".mobile-main-input").val("Job Started ");
            Template.instance().lunchState.set(false);
        }        
    },

    'change #purchaseCheck': function(event) {
        $('#breakCheck').prop('checked', false);
        $('#lunchCheck').prop('checked', false);
        
        if($('#breakCheck').is(":checked") == true) {
            const now = new Date();
            const currentTime = now.toLocaleTimeString(); // returns a formatted string like "3:30:45 PM"
            $(".mobile-main-input").val("Job Paused  " + currentTime);            
            Template.instance().purchaseState.set(true);
        
        }else {
            $(".mobile-main-input").val("Job Started ");
            Template.instance().purchaseState.set(false);
        }
    },




    'click #breakSave': function(e, instance) {
        let breakMessage = $('#txtpause-notes').val();

        Template.instance().breakMessage.set(breakMessage);
        swal('Successfully  Save', '', 'success');
        $("#startBreakContainer").css('display', 'none');
        if (window.screen.width <= 480) {
            $(".mobile-left-btn-containner").css('display', 'none');
        } else {
            $(".mobile-left-btn-containner").css('display', 'block');
        }
        $('#txtpause-notes').val("");
    }
    ,
    'click #breakClose': function(e,instance) {
        $("#startBreakContainer").css('display', 'none');
        Template.instance().breakState.set(false);
        Template.instance().breakMessage.set("");
        if (window.screen.width <= 480) {
            $(".mobile-left-btn-containner").css('display', 'none');
        } else {
            $(".mobile-left-btn-containner").css('display', 'block');
        }
    }
    ,
    
    'click .btn-cancel-wastage': function(e,instance) {

        $('#WastageModal').modal('toggle');

    }

});

Template.mobileapp.helpers({

    showBOMModal: ()=> {
        return Template.instance().showBOMModal.get();
    },

    bomRecord: ()=> {
        return Template.instance().bomStructure.get();
    }
});
