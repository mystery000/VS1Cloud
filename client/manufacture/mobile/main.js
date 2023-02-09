import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './layout/header.html'
import './main.html';

var html5QrcodeScannerProdModal = null;

Template.mobileapp.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords.set([{ID: 1, KeyValue: 0, Description: "hello"}]);
})

Template.mobileapp.fetchEmployeeList = () => {
    getVS1Data('TEmployee').then(function (dataObject) {
        console.log(dataObject)
    });
}

Template.mobileapp.events({
    'click #btnOpentList': function(e, instance) {

    },
    'click .mobile-btn-number': function(e, instance) {
        $(".mobile-main-input").val($(".mobile-main-input").val() + e.target.attributes.calcvalue.nodeValue)
    },
    'click #mobileBtnQrCobeScan': function(e, instance) {
        $("#qr-reader-productmodal").css('display', 'block');
        function onScanSuccessProdModal(decodedText, decodedResult) {
            console.log(decodedText)
            alert(decodedText)
        }
        html5QrcodeScannerProdModal = new Html5QrcodeScanner(
            "qr-reader-productmodal", {
                fps: 10,
                qrbox: 250,
                rememberLastUsedCamera: true
            });
        html5QrcodeScannerProdModal.render(onScanSuccessProdModal);
        console.log(html5QrcodeScannerProdModal)
    },
    'click #mobileBtnCancel': function(e, instance) {
        $("#qr-reader-productmodal").css('display', 'none');
        console.log(html5QrcodeScannerProdModal)
        html5QrcodeScannerProdModal.html5Qrcode.stop().then((ignore) => {
            console.log(ignore)
        }).catch((err) => console.log(err));
    },
    'click #btnClockIn': function(e, instance) {
        $("#btnClockIn").css('background', '#999');
        $("#btnStartJob").css('background', '#00AE00');
        $("#btnStartBreak").css('background', '#00AE00');
        $("#btnClockOut").css('background', '#C5000B');
        $(".mobile-header-status-text").text("Select Employee");
    },
    'click #btnStartJob': function(e, instance) {
        $("#btnStartJob").css('background', '#999');
        $("#btnStopJob").css('background', '#C5000B');
    },
    'click #btnStartBreak': function(e, instance) {
        $("#btnStartBreak").css('background', '#999');
        $("#btnStopBreak").css('background', '#C5000B');
    },
    'click #mobileBtnEnter': function(e, instance) {
        Template.mobileapp.fetchEmployeeList();
    }
});
