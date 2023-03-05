import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './layout/header.html'
import './main.html';
import './container/startbreak.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ManufacturingService } from "../manufacturing-service";
import { ContactService } from "../../contacts/contact-service";

const contactService = new ContactService();


var html5QrcodeScannerProdModal = null;

Template.mobileapp.onCreated(function() {
    const templateObject = Template.instance();

    templateObject.datatablerecords = new ReactiveVar([]);

    templateObject.jobNumber = new ReactiveVar();
    templateObject.jobProcess = new ReactiveVar();
    templateObject.employeeName = new ReactiveVar();
    templateObject.breakMessage = new ReactiveVar();
    

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
      
})

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
        let firstName = $(e.target).closest('tr').find('td:eq(0)').text();
        let lastName = $(e.target).closest('tr').find('td:eq(1)').text();
        $(".mobile-main-input").val(firstName + " " + lastName);

    } ,

    'click #btnOpentList': function(e, instance) {

        let isEnterJobProcess = Template.instance().isEnterJobProcess.get();
        let isEnterJobNumber = Template.instance().isEnterJobNumber.get();
        let isSelectEmployeeNumber = Template.instance().isSelectEmployeeNumber.get();

        if(isEnterJobNumber){

            $(".mobile-left-employee-list").css('display', 'none');
            $(".mobile-left-jobprocess-list").css('display', 'none');
            $(".mobile-left-btn-containner").css('display', 'none');

            // if ($.fn.DataTable.isDataTable( '#tblWorkOrderList' ) ) {
            //     $("#tblWorkOrderList").DataTable().fnDestroy();
            // }

            getVS1Data('TSalesOrderList').then(function (dataObject) {
                $(".mobile-left-workorder-list").css('display', 'block');
                let workOrderData = JSON.parse(dataObject[0].data);

                let table = $("#tblWorkOrderList").DataTable({
                    data: workOrderData.tsalesorderlist,
                    paging: false,
                    searching: false,
                    destroy:true,
                    dom: 't',
                    scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                    scrollCollapse: true,
                    autoWidth: true,
                    sScrollXInner: "100%",
                    columns: [
                        { title: 'Sales No.', mData: 'SaleID' },
                        { title: 'Customer', mData: 'CustomerName' },
                        { title: 'Sale Date', mData: 'SaleDate' },
                    ]
                })

                $("#startBreakContainer").css('display', 'none');
                $("#btnOpentList").prop('disabled', true);

            });

        }
        if (isEnterJobProcess) {

            $(".mobile-left-employee-list").css('display', 'none');
            $(".mobile-left-workorder-list").css('display', 'none');

            let manufacturingService = new ManufacturingService();
            
            getVS1Data('TProcessStep').then(function (dataObject) {
                if(dataObject.length == 0) {
                    
                    manufacturingService.getAllProcessData(initialBaseDataLoad, 0, false).then(function(data) {
                 
                        addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn){
                                                                            console.log("TprocessStep data is inserted to server database.");
                                                                        }).catch(function(err){
                                                                            console.log("TprocessStep data inserting to database is failed.")
                                                                        });

                        $(".mobile-left-jobprocess-list").css('display', 'block');
                        let processData = JSON.parse(data);
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

                        
                        $("#startBreakContainer").css('display', 'none');
                        $(".mobile-left-btn-containner").css('display', 'none');
                        $("#btnOpentList").prop('disabled', true);

                    })


                } else {
                    $(".mobile-left-jobprocess-list").css('display', 'block');
                    let processData = JSON.parse(dataObject[0].data);
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

                    
                    $("#startBreakContainer").css('display', 'none');
                    $(".mobile-left-btn-containner").css('display', 'none');
                    $("#btnOpentList").prop('disabled', true);
                }
                
                
            }).catch(function(error) {
                    
                    manufacturingService.getAllProcessData(initialBaseDataLoad, 0, false).then(function(data) {
                        addVS1Data('TProcessStep', JSON.stringify(data)).then(function(datareturn){
                            console.log("TprocessStep data is inserted to server database.");
                        }).catch(function(err){
                            console.log("TprocessStep data inserting to database is failed.")
                        });
                        
                        //console.log(data);

                        $(".mobile-left-jobprocess-list").css('display', 'block');
                        let processData = JSON.parse(data);
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

                        
                        $("#startBreakContainer").css('display', 'none');
                        $(".mobile-left-btn-containner").css('display', 'none');
                        $("#btnOpentList").prop('disabled', true);

                    })
            })

            $("#startBreakContainer").css('display', 'none');
            $(".mobile-left-btn-containner").css('display', 'none');
            $("#btnOpentList").prop('disabled', true);

        }
        if(isSelectEmployeeNumber) {            
            
            $(".mobile-left-workorder-list").css('display', 'none');
            $(".mobile-left-jobprocess-list").css('display', 'none');

            getVS1Data('TEmployee').then(function (dataObject) {
                $(".mobile-left-employee-list").css('display', 'block');
                let empdata = JSON.parse(dataObject[0].data);
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

                        { title: 'FirstName', mData: 'fields.FirstName' },
                        { title: 'LastName', mData: 'fields.LastName' },
                    ]
                })
                // $('#tblEmployeeList tbody').on('click', 'tr', function () {
                //     var data = table.row(this).data();

                //     $(".mobile-main-input").val(data.fields.FirstName + "  " + data.fields.LastName);
                // });

                $("#startBreakContainer").css('display', 'none');
                $(".mobile-left-btn-containner").css('display', 'none');
                $("#btnOpentList").prop('disabled', true);

            });

            Template.instance().isSelectEmployeeNumber.set(false);
            Template.instance().isSelectEmployeeName.set(true);

        }

    },
    'click #phoneVoid': function(e, instance) {
        $(".mobile-checkin-container").css('display', 'none');
        $(".mobile-right-btn-containner").css('display', 'flex');
    },
    'click .mobile-btn-number': function(e, instance) {
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
    'click #mobileBtnQrCobeScan': function(e, instance) {
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

        $("#btnOpentList").removeAttr('disabled'); // when click cancel , openlist button will be active
        
        if(Template.instance().isSelectEmployeeName.get()) {  //after employ number not find result, click cancel
            Template.instance().isSelectEmployeeNumber.set(true);
        }


        // html5QrcodeScannerProdModal.html5Qrcode.stop().then((ignore) => {
        // }).catch((err) => console.log(err));
      
        
    },    
    'click #btnClockIn': function(e, instance) {
        Template.instance().isClockin.set(true);
        Template.instance().isEnterJobNumber.set(false);
        Template.instance().isEnterJobProcess.set(false);
        Template.instance().isSelectEmployeeNumber.set(true);

        $(".mobile-checkin-container").css('display', 'block');
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

    'click #btnClockOut': function (e, instance) {

        Template.instance().isClockin.set(false);
        Template.instance().isEnterJobProcess.set(false);
        Template.instance().isEnterJobNumber.set(true);
        Template.instance().isSelectEmployeeName.set(false);
        Template.instance().isSelectEmployeeNumber.set(false);

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
        $('#btnStopBreak').prop('disabled', true);
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
    'click #btnStartBreak': function(e, instance) {
        $("#startBreakContainer").css('display', 'block');
        $('#btnStartBreak').prop('disabled', true);
        $("#btnStartBreak").css('background', '#999');
        $("#btnStopBreak").css('background', '#C5000B');
        $("#btnStopBreak").removeAttr('disabled');
        $("#btnOpentList").removeAttr('disabled');
        $(".mobile-left-btn-containner").css('display', 'none');
        $(".mobile-left-employee-list").css('display', 'none');
        $("#mobileBtnCancel").prop('disabled', true);
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
    'click #mobileBtnEnter': function(e, instance) {  // Click enter button

        let inputValue  = $(".mobile-main-input").val();
        let isClockin = Template.instance().isClockin.get();
        let isEnterJobProcess = Template.instance().isEnterJobProcess.get();
        let isEnterJobNumber = Template.instance().isEnterJobNumber.get();
        let isSelectEmployeeNumber = Template.instance().isSelectEmployeeNumber.get();
        let isSelectEmployeeName = Template.instance().isSelectEmployeeName.get();


        $("#btnOpentList").removeAttr('disabled');  //openlist button enable
        $(".mobile-left-workorder-list").css('display', 'none'); // workorder list none
        $(".mobile-left-jobprocess-list").css('display', 'none'); // process list none
        $(".mobile-left-employee-list").css('display', 'none');  // employee list none
        $(".mobile-left-btn-containner").css('display', 'block');  // Keypad display


        if (isEnterJobNumber) {
            $('.mobile-header-status-text').text('Please set Job Process');
            // let empId = $('.mobile-main-input').val();
            // getVS1Data('TEmployee').then(function (dataObject) {
            //     let empdata = JSON.parse(dataObject[0].data);
            //     for(var i = 0; i < empdata.temployee.length; i ++) {
            //         if (empdata.temployee[i].fields.ID == empId) {
            //             FlowRouter.go('/employeescard?id=' + empId);
            //         }
            //     }
            //     $('.mobile-header-status-text').text('Job Number information not found.')
            // });

            Template.instance().jobNumber.set(inputValue);

            $(".mobile-main-input").val("");
            Template.instance().isEnterJobNumber.set(false);
            Template.instance().isEnterJobProcess.set(true);
            Template.instance().isClockin.set(false);

        }

        if (isEnterJobProcess) {
            $('.mobile-header-status-text').text('Successfully added JobProcess information. Please add employee info');
            // let empId = $('.mobile-main-input').val();
            // getVS1Data('TEmployee').then(function (dataObject) {
            //     let empdata = JSON.parse(dataObject[0].data);
            //     for(var i = 0; i < empdata.temployee.length; i ++) {
            //         if (empdata.temployee[i].fields.ID == empId) {
            //             FlowRouter.go('/employeescard?id=' + empId);
            //         }
            //     }
            //     $('.mobile-header-status-text').text('Job Process information not found.')
            // });

            $(".mobile-main-input").val("");
            $("#btnClockIn").removeAttr('disabled');
            $("#btnClockIn").css('background', '#00AE00');

            Template.instance().jobProcess.set(inputValue);

            Template.instance().isEnterJobProcess.set(false);
            Template.instance().isClockin.set(false);
            Template.instance().isEnterJobNumber.set(false);
            Template.instance().isSelectEmployeeNumber.set(true);

        }

        if(isSelectEmployeeNumber) {

            let empId = $('.mobile-main-input').val();
            let employeeDetail ;    
            getVS1Data('TEmployee').then(function (dataObject) {
                if (dataObject.length == 0) {
                  contactService.getOneEmployeeDataEx(empId).then(function (data) {
                    employeeDetail = data;
                  });
                } else {
                  let data = JSON.parse(dataObject[0].data);
                  let useData = data.temployee;
                  for (let i = 0; i < useData.length; i++) {
                    if (parseInt(useData[i].fields.ID) === parseInt(empId)) {
                      employeeDetail = useData[i];
                    }
                  }
                  
                 
                }
                $(".mobile-left-employee-list").css('display', 'block');

                console.log(employeeDetail);
                let table = $("#tblEmployeeList").DataTable({
                        data: employeeDetail,
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

                $("#startBreakContainer").css('display', 'none');
                $(".mobile-left-btn-containner").css('display', 'none');
                $("#btnOpentList").prop('disabled', true);

              }).catch(function (err) {
                contactService.getOneEmployeeDataEx(empId).then(function (data) {
                  employeeDetail = data;
                });
            });
                

            // getVS1Data('TEmployee').then(function (dataObject) {
            //     $(".mobile-left-employee-list").css('display', 'block');

            //     let empdata = JSON.parse(dataObject[0].data);
            //     console.log(empdata.temployee);
            
            //     let table = $("#tblEmployeeList").DataTable({
            //         data: empdata.temployee,
            //         paging: false,
            //         searching: true,
            //         dom: 't',
            //         scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
            //         scrollCollapse: true,
            //         autoWidth: true,
            //         sScrollXInner: "100%",
            //         columns: [
                        
            //             { title: 'FirstName', mData: 'fields.FirstName' },
            //             { title: 'LastName', mData: 'fields.LastName' },
            //         ]
            //     })

            //     $('#tblEmployeeList tbody').on('click', 'tr', function () {
            //         var data = table.row(this).data();
            //         $(".mobile-main-input").val(data.fields.FirstName + "  " + data.fields.LastName);
                    
            //     });

            //     $("#startBreakContainer").css('display', 'none');
            //     $(".mobile-left-btn-containner").css('display', 'none');
            //     $("#btnOpentList").prop('disabled', true);
        

            // }); 

            Template.instance().isSelectEmployeeName.set(true);
            Template.instance().isSelectEmployeeNumber.set(false);
        }

        if(isSelectEmployeeName) {
            Template.instance().employeeName.set(inputValue);
            $('.mobile-header-status-text').text('Successfully Set Employee Name');

            Template.instance().isEnterJobProcess.set(false);
            Template.instance().isEnterJobNumber.set(false);
            Template.instance().isSelectEmployeeNumber.set(false);
            Template.instance().isSelectEmployeeName.set(false);
            $(".mobile-main-input").val("Clock Starting");
        }

    },
    'click #btnSaveClose': function(e, instance) {
        $('.mobile-stop-job-container').css('display', 'none');
        $('.mobile-right-btn-containner').css('display', 'flex');
    },
    'click #btnCompleteProcess': function(e, instance) {
        $('.mobile-stop-job-container').css('display', 'none');
        $('.mobile-right-btn-containner').css('display', 'flex');

        $('#startBreakContainer').css('display','none');
        $(".mobile-left-btn-containner").css('display', 'block');  // Keypad display

        Template.instance().isClockin.set(false);
        Template.instance().isEnterJobProcess.set(false);
        Template.instance().isEnterJobNumber.set(true);
        Template.instance().isSelectEmployeeName.set(false);
        Template.instance().isSelectEmployeeNumber.set(false);

        $('#btnClockOut').prop('disabled', true);
        $("#btnClockOut").css('background', '#0084D1');
        $("#btnClockIn").prop('disabled',true);
        $('#btnStartJob').prop('disabled', true);
        $('#btnStartBreak').prop('disabled', true);
        $("#btnClockIn").css('background', '#00AE00');
        $("#btnStartJob").css('background', '#0084D1');
        $("#btnStartBreak").css('background', '#0084D1');
        $("#btnStopBreak").css('background', '#0084D1');
        $("#btnStopJob").css('background', '#0084D1');
        $('#btnStopJob').prop('disabled', true);
        $('#btnStopBreak').prop('disabled', true);
        $(".mobile-header-status-text").text("Enter Job Number");

        $(".mobile-main-input").val(" ");

    },
    'change #breakCheck': function(e, instance) {

        if($('#breakCheck').is(":checked") == true){

            $(".mobile-main-input").val("Job Paused ");
         }else{
            $(".mobile-main-input").val("Job Started ");
         }
    },
    'click #breakSave': function(e, instance) {
        Template.instance().breakState.set(false);
        Template.instance().breakMessage.set("dddddd");        

    }
});
