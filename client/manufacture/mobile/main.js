import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './layout/header.html'
import './main.html';
import './container/startbreak.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

var html5QrcodeScannerProdModal = null;

Template.mobileapp.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.jobNumber = new ReactiveVar();
    templateObject.jobProcess = new ReactiveVar();
    templateObject.employeeName = new ReactiveVar();

    templateObject.isEnterJobNumber = new ReactiveVar();
    templateObject.isEnterJobNumber.set(true);

    templateObject.isEnterJobProcess = new ReactiveVar();
    templateObject.isEnterJobProcess.set(false);

    templateObject.isClockin = new ReactiveVar();
    templateObject.isClockin.set(false);
       
      
})

Template.mobileapp.events({
    
    'click #btnOpentList': function(e, instance) {

       

        let isClockin = Template.instance().isClockin.get();
        let isEnterJobProcess = Template.instance().isEnterJobProcess.get();
        let isEnterJobNumber = Template.instance().isEnterJobNumber.get();
        
        if(isClockin) {
            
            if ($.fn.DataTable.isDataTable( '#tblEmployeeList' ) ) {
                $("#tblEmployeeList").DataTable().destroy();
            }
            $(".mobile-left-workorder-list").css('display', 'none');
            $(".mobile-left-jobprocess-list").css('display', 'none');

            getVS1Data('TEmployee').then(function (dataObject) {
                $(".mobile-left-employee-list").css('display', 'block');
                let empdata = JSON.parse(dataObject[0].data);
                let table = $("#tblEmployeeList").DataTable({
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
                $('#tblEmployeeList tbody').on('click', 'tr', function () {
                    var data = table.row(this).data();
                    $(".mobile-main-input").val(data.fields.EmployeeName)
                    Template.instance().employeeName.set(data);
                });

                $("#startBreakContainer").css('display', 'none');
                $(".mobile-left-btn-containner").css('display', 'none');
                $("#btnOpentList").prop('disabled', true);

            }); 

        } 
        
        if(isEnterJobNumber){
            
            $(".mobile-left-employee-list").css('display', 'none');
            $(".mobile-left-jobprocess-list").css('display', 'none');
            
            if ($.fn.DataTable.isDataTable( '#tblWorkOrderList' ) ) {
                $("#tblWorkOrderList").DataTable().destroy();
            }
            getVS1Data('TEmployee').then(function (dataObject) {
                $(".mobile-left-workorder-list").css('display', 'block');
                let saleOrderData = JSON.parse(dataObject[0].data);
                let table = $("#tblWorkOrderList").DataTable({
                    data: saleOrderData.temployee,
                    paging: false,
                    searching: true,
                    dom: 't',
                    scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                    scrollCollapse: true,
                    autoWidth: true,
                    sScrollXInner: "100%",
                    columns: [
                        { title: 'Sales No.', mData: 'fields.FirstName' },
                        { title: 'Customer', mData: 'fields.LastName' },
                        { title: 'Sale Date', mData: 'fields.LastName' },
                    ]
                })
                $('#tblWorkOrderList tbody').on('click', 'tr', function () {
                    var data = table.row(this).data();
                    $(".mobile-main-input").val(data.fields.EmployeeName);
                    
                });
                $("#startBreakContainer").css('display', 'none');
                $(".mobile-left-btn-containner").css('display', 'none');
                $("#btnOpentList").prop('disabled', true);
                
            });
        } 
        if (isEnterJobProcess) {
            
            $(".mobile-left-employee-list").css('display', 'none');
            $(".mobile-left-workorder-list").css('display', 'none');

            if ($.fn.DataTable.isDataTable( '#tblJobProcessList' ) ) {
                $("#tblJobProcessList").DataTable().destroy();
            }
            getVS1Data('TProcessStep').then(function (dataObject) {
                $(".mobile-left-jobprocess-list").css('display', 'block');
                let processData = JSON.parse(dataObject[0].data);
                let table = $("#tblJobProcessList").DataTable({
                    data: processData.tprocessstep,
                    paging: false,
                    searching: true,
                    dom: 't',
                    scrollY: document.getElementsByClassName('mobile-right-btn-containner')[0].clientHeight - 58 + 'px',
                    scrollCollapse: true,
                    autoWidth: true,
                    sScrollXInner: "100%",
                    columns: [
                        { title: 'Process Name', mData: 'fields.KeyValue' },
                        
                    ]
                })
                $('#tblJobProcessList tbody').on('click', 'tr', function () {
                    var data = table.row(this).data();
                    $(".mobile-main-input").val(data.fields.KeyValue);
                    
                });
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
        Template.instance().isEnterJobNumber.set(true);
        
        
        // html5QrcodeScannerProdModal.html5Qrcode.stop().then((ignore) => {
        // }).catch((err) => console.log(err));

        
        
    },    
    'click #btnClockIn': function(e, instance) {

        Template.instance().isClockin.set(true);

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
    },
    'click #btnStopJob': function(e, instance) {
        $('#btnStopJob').prop('disabled', true);
        $("#btnStartJob").css('background', '#00AE00');
        $("#btnStopJob").css('background', '#0084D1');
        $("#btnStartJob").removeAttr('disabled');
        $('.mobile-stop-job-container').css('display', 'block');
        $('.mobile-right-btn-containner').css('display', 'none')
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
    },
    'click #mobileBtnEnter': function(e, instance) {  // Click enter button
        
        let isClockin = Template.instance().isClockin.get();
        let isEnterJobNumber = Template.instance().isEnterJobNumber.get();
        let isEnterJobProcess = Template.instance().isEnterJobProcess.get();

        let inputValue  = $(".mobile-main-input").val();

        $("#btnOpentList").removeAttr('disabled');  //openlist button enable
        $(".mobile-left-workorder-list").css('display', 'none'); // workorder list none
        $(".mobile-left-jobprocess-list").css('display', 'none'); // process list none
        $(".mobile-left-employee-list").css('display', 'none');  // employee list none

        $(".mobile-left-btn-containner").css('display', 'block');  // Keypad display 



        if (isClockin) {
            $('.mobile-header-status-text').text('Setting employee information.');
            // let empId = $('.mobile-main-input').val();
            // getVS1Data('TEmployee').then(function (dataObject) {
            //     let empdata = JSON.parse(dataObject[0].data);
            //     for(var i = 0; i < empdata.temployee.length; i ++) {
            //         if (empdata.temployee[i].fields.ID == empId) {
            //             FlowRouter.go('/employeescard?id=' + empId);
            //         }
            //     }
            //     $('.mobile-header-status-text').text('Employee information not found.')
            // });
            Template.instance().employeeName.set(inputValue);
            $(".mobile-main-input").val("");

            Template.instance().isClockin.set(false);
            Template.instance().isEnterJobNumber.set(true);
            Template.instance().isEnterJobProcess.set(false);
            
        }

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
            Template.instance().isClockin.set(true);
            Template.instance().isEnterJobNumber.set(false);

        }
        
        
    },
    'click #btnSaveClose': function(e, instance) {
        $('.mobile-stop-job-container').css('display', 'none');
        $('.mobile-right-btn-containner').css('display', 'flex');
    }
});
