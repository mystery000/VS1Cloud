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


var html5QrcodeScannerProdModal = null;

Template.mobileapp.onCreated(function() {
    const templateObject = Template.instance();

    templateObject.datatablerecords = new ReactiveVar([]);

    templateObject.jobNumber = new ReactiveVar();
    templateObject.jobProcess = new ReactiveVar();
    templateObject.employeeName = new ReactiveVar();
    templateObject.breakMessage = new ReactiveVar();


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
    let temp = await templateObject.getAllWorkorders()
    templateObject.workOrderRecords.set(temp);


    templateObject.inputStatus.set("enterJobNumber");  // enterProcess, enterEmployee,  

      



});

Template.mobileapp.events({
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
    //    let lastName = $(e.target).closest('tr').find('td:eq(1)').text();
        $(".mobile-main-input").val(empId);

    } ,

    'click #btnOpentList': function(e, instance) {

        let isEnterJobProcess = Template.instance().isEnterJobProcess.get();
        let isEnterJobNumber = Template.instance().isEnterJobNumber.get();
        let isSelectEmployeeNumber = Template.instance().isSelectEmployeeNumber.get();
        let manufacturingService = new ManufacturingService();

        let inputStatus = Template.instance().inputStatus.get();

        let isMobile = window.innerWidth < 468;


        if(inputStatus == "enterJobNumber"){

            $(".mobile-left-employee-list").css('display', 'none');
            $(".mobile-left-jobprocess-list").css('display', 'none');
            $(".mobile-left-btn-containner").css('display', 'none');

            // if ($.fn.DataTable.isDataTable( '#tblWorkOrderList' ) ) {
            //     $("#tblWorkOrderList").DataTable().fnDestroy();
            // }

                        
            getVS1Data('TVS1Workorder').then(function (dataObject) {
                if(dataObject.length == 0) {

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
                        console.log("workorder data is inserted");
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
                        console.log("workorder data is inserted");
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

            // Template.instance().isSelectEmployeeNumber.set(false);
            // Template.instance().isSelectEmployeeName.set(true);

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

    'click #btnClockIn': function(e, instance) {
        Template.instance().isClockin.set(true);
        
       // Template.instance().inputStatus.set("enterEmployee");

       // $(".mobile-checkin-container").css('display', 'block');
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
        $(".mobile-header-status-text").text("Select Employee");
    },

    'click #btnClockIn_phone': function(e, instance) {
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
        $(".mobile-header-status-text").text("Select Employee");
    },

    'click #btnClockOut': function (e, instance) {

        Template.instance().isClockin.set(false);
        // Template.instance().isEnterJobProcess.set(false);
        // Template.instance().isEnterJobNumber.set(true);
        // Template.instance().isSelectEmployeeName.set(false);
        // Template.instance().isSelectEmployeeNumber.set(false);

      //  Template.instance().inputStatus.set("enterJobNumber");

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
        $(".mobile-header-status-text").text("Enter Job Number");
    },

    'click #btnClockOut_phone': function (e, instance) {

        Template.instance().isClockin.set(false);
        // Template.instance().isEnterJobProcess.set(false);
        // Template.instance().isEnterJobNumber.set(true);
        // Template.instance().isSelectEmployeeName.set(false);
        // Template.instance().isSelectEmployeeNumber.set(false);
       
      //  Template.instance().inputStatus.set("enterJobNumber");


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
        $(".mobile-header-status-text").text("Enter Job Number");
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

        let inputValue  = $(".mobile-main-input").val();
        let isClockin = Template.instance().isClockin.get();
        
        let inputStatus = Template.instance().inputStatus.get();

        $("#btnOpentList").removeAttr('disabled');  //openlist button enable
        $(".mobile-left-workorder-list").css('display', 'none'); // workorder list none
        $(".mobile-left-jobprocess-list").css('display', 'none'); // process list none
        $(".mobile-left-employee-list").css('display', 'none');  // employee list none
        $(".mobile-left-btn-containner").css('display', 'block');  // Keypad display
    

        if (inputStatus == "enterJobNumber") {

            let temp_id = 0;
            let templateObject = Template.instance();

            getVS1Data('TVS1Workorder').then(function (dataObject) {
            
                let workOrderData = JSON.parse(dataObject[0].data);
             
                for(var i = 0; i < workOrderData.tvs1workorder.length; i ++) {
                    if (workOrderData.tvs1workorder[i].fields.ID == inputValue) {
                        temp_id = inputValue;
                    }
                }

                if (temp_id == 0 ) {
                    $('.mobile-header-status-text').text('Job Number is not correct.');
                    $(".mobile-main-input").val("");
                }

                else {

                    $('.mobile-header-status-text').text('Please set Job Process');
                    templateObject.jobNumber.set(inputValue);

                    $(".mobile-main-input").val("");
                    templateObject.inputStatus.set("enterProcess");                           
        
                }
                
            });           
                     
          

        }

        if (inputStatus == "enterProcess") {
            $('.mobile-header-status-text').text('Successfully added JobProcess information. Please Click Clock in');
            
            $(".mobile-main-input").val("");
            $("#btnClockIn").removeAttr('disabled');
            $("#btnClockIn").css('background', '#00AE00');

            $("#btnClockIn_phone").removeAttr('disabled');
            $("#btnClockIn_phone").css('background', '#00AE00');

            Template.instance().jobProcess.set(inputValue);
            Template.instance().inputStatus.set("enterEmployee");
            

        }

        if(inputStatus == "enterEmployee") {

            let empId = $('.mobile-main-input').val();
            let temp_id;
            let templateObject = Template.instance();

            getVS1Data('TEmployee').then(function (dataObject) {
            
                let employData = JSON.parse(dataObject[0].data);
                             
                for(var i = 0; i < employData.temployee.length; i ++) {
                    if (employData.temployee[i].fields.ID == empId) {
                        temp_id = empId;
                    }
                }

                if (temp_id == 0 ) {
                    $('.mobile-header-status-text').text('Employee Number is not correct. Please select correct Number');
                    $(".mobile-main-input").val("");
                }

                else {

                    $('.mobile-header-status-text').text('Clock Starting');
                    $(".mobile-main-input").val("");
                    templateObject.employeeName.set(empId);
                    templateObject.inputStatus.set("Clockin");

                    $('.mobile-header-status-text').text('Successfully Set Employee Number');

          
                 
        
                }
                
            }); 


            // getVS1Data('TEmployee').then(function (dataObject) {
            //     if (dataObject.length == 0) {
            //       contactService.getOneEmployeeDataEx(empId).then(function (data) {
            //         employeeDetail = data;
            //       });
            //     } else {
            //       let data = JSON.parse(dataObject[0].data);
            //       let useData = data.temployee;
            //       for (let i = 0; i < useData.length; i++) {
            //         if (parseInt(useData[i].fields.ID) === parseInt(empId)) {
            //           employeeDetail = useData[i];
            //         }
            //       }
            //     }
            //     $(".mobile-left-employee-list").css('display', 'block');

            //     let table = $("#tblEmployeeList").DataTable({
            //             data: employeeDetail,
            //             paging: false,
            //             searching: true,

            //             dom: 't',
            //             scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
            //             scrollCollapse: true,
            //             autoWidth: true,
            //             sScrollXInner: "100%",
            //             columns: [

            //                 { title: 'FirstName', mData: 'fields.FirstName' },
            //                 { title: 'LastName', mData: 'fields.LastName' },
            //             ]
            //     })

            //     $("#startBreakContainer").css('display', 'none');
            //     $(".mobile-left-btn-containner").css('display', 'none');
            //     $("#btnOpentList").prop('disabled', true);

            //   }).catch(function (err) {
            //     contactService.getOneEmployeeDataEx(empId).then(function (data) {
            //       employeeDetail = data;
            //     });
            // });

            
        }

        // if(isSelectEmployeeName) {
        //     Template.instance().employeeName.set(inputValue);
        //     $('.mobile-header-status-text').text('Successfully Set Employee Name');

        //     Template.instance().isEnterJobProcess.set(false);
        //     Template.instance().isEnterJobNumber.set(false);
        //     Template.instance().isSelectEmployeeNumber.set(false);
        //     Template.instance().isSelectEmployeeName.set(false);
        //     $(".mobile-main-input").val("Clock Starting");
        // }

    },
    'click #btnSaveClose': function(e, instance) {
        $('.mobile-stop-job-container').css('display', 'none');
        $('.mobile-right-btn-containner').css('display', 'flex');
    },
    'click #btnCompleteProcess': async function(e, instance) {
        $('.mobile-stop-job-container').css('display', 'none');
        $('.mobile-right-btn-containner').css('display', 'flex');

        $('#startBreakContainer').css('display','none');
        $(".mobile-left-btn-containner").css('display', 'block');  // Keypad display
        
        let templateObject = Template.instance();
        templateObject.inputStatus.set("enterJobNumber");      

        templateObject.isClockin.set(false);
        // Template.instance().isEnterJobProcess.set(false);
        // Template.instance().isEnterJobNumber.set(true);
        // Template.instance().isSelectEmployeeName.set(false);
        // Template.instance().isSelectEmployeeNumber.set(false);

        let jobNumber = templateObject.jobNumber.get();

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

        let workorderindex = workorders.findIndex(order => {
            return order.fields.ID == jobNumber;
        })

        if(workorderindex > -1) {
            currentworkorder = workorders[workorderindex];

            // Set bom Structure for current workorder
            templateObject.bomStructure.set(JSON.parse(currentworkorder.fields.BOMStructure));



            let tempworkorder = cloneDeep(currentworkorder);
            tempworkorder.fields = {...tempworkorder.fields, IsCompleted: true, Status: 'Completed'}
            workorders.splice(workorderindex, 1, tempworkorder);
            addVS1Data('TVS1Workorder', JSON.stringify({tvs1workorder: workorders})).then(function(){

             //   $('.fullScreenSpin').css('display', 'none')
             //   swal('Work Order state is updated', '', 'success');
            })

            let BomDataList = [];

            let bomStructureData = JSON.parse(currentworkorder.fields.BOMStructure);
            let change_to = bomStructureData.TotalQtyOriginal;

            let tempBomData = {item: bomStructureData.Caption , uom: "Units(1)", total : bomStructureData.TotalQtyOriginal, changeTo: change_to, wastage: parseFloat(bomStructureData.TotalQtyOriginal) - parseFloat(change_to) };

            BomDataList.push(tempBomData);

            let bomDetailData = JSON.parse(bomStructureData.Details);

            for (let i = 0; i < bomDetailData.length; i++) {
                tempBomData = {item: '<span style = "margin-left:20px;"> '+ bomDetailData[i].productName + '</span>', uom:"Units(1)",  total:bomDetailData[i].qty, changeTo: bomDetailData[i].qty, wastage: parseFloat(bomDetailData[i].qty) - parseFloat(bomDetailData[i].qty) };
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
                                           
                var cell = wastage_table.cell(this);
                var index = cell.index();
                var column = index.column;
                var row = index.row;

                var cur_val = parseFloat($(this).text());
                var prev_val = parseFloat(cell.data());
                          
                var nextCell = wastage_table.cell(row, column + 1);
                    nextCell.data(prev_val - cur_val);                             
                           
            } );

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
    'click .btn-save-wastage': function(e,instance) {
        $('.fullScreenSpin').css('display', 'inline-block');
        $('.fullScreenSpin').css('display', 'none')

        var temp = [];

        $("#tblWastageForm tr").each(function(){
            var thirdColumnValue = $(this).find("td:eq(3)").text();
            temp.push(thirdColumnValue);

        });


        swal('The wastage is saved', '', 'success');
        $('#WastageModal').modal('toggle');

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
