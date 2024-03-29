import {
    TaxRateService
} from "../settings/settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    OrganisationService
} from '../js/organisation-service';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
import { Template } from 'meteor/templating';
import './paymentmethodpopup.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let organisationService = new OrganisationService();
Template.paymentmethodpop.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.deptrecords = new ReactiveVar();

    templateObject.includeCreditCard = new ReactiveVar();
    templateObject.includeCreditCard.set(false);

    templateObject.includeAccountID = new ReactiveVar();
    templateObject.includeAccountID.set(false);

    templateObject.accountID = new ReactiveVar();
    templateObject.tablename = new ReactiveVar();
});

Template.paymentmethodpop.onRendered(function() {
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    var splashArrayPaymentMethodList = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];
    let currenttablename = templateObject.data.tablename || "paymentmethodList";
    templateObject.tablename.set(currenttablename);

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };


    templateObject.getOrganisationDetails = function() {    
        getVS1Data('TCompanyInfo').then(function(dataObject){
            if(dataObject.length == 0){
                organisationService.getOrganisationDetail().then((dataListRet) => {
                    let account_id = dataListRet.tcompanyinfo[0].Apcano || '';
                    let feeMethod = dataListRet.tcompanyinfo[0].DvaABN || ''
                    if (feeMethod == "apply") {
                        $("#feeOnTopInput").prop("checked", true);
                        $("#feeInPriceInput").prop("checked", false);
                    } else if (feeMethod == "include") {
                        $("#feeOnTopInput").prop("checked", false);
                        $("#feeInPriceInput").prop("checked", true);
                    } else {
                        $("#feeOnTopInput").prop("checked", true);
                        $("#feeInPriceInput").prop("checked", false);
                    }
                    if (dataListRet.tcompanyinfo[0].Apcano == '') {
                        templateObject.includeAccountID.set(false);
                    } else {
                        templateObject.includeAccountID.set(true);
                    }
        
                    templateObject.accountID.set(account_id);
                });
            } else {
                let dataListRet = JSON.parse(dataObject[0].data);
                let account_id = dataListRet.tcompanyinfo[0].Apcano || '';
                let feeMethod = dataListRet.tcompanyinfo[0].DvaABN || ''
                if (feeMethod == "apply") {
                    $("#feeOnTopInput").prop("checked", true);
                    $("#feeInPriceInput").prop("checked", false);
                } else if (feeMethod == "include") {
                    $("#feeOnTopInput").prop("checked", false);
                    $("#feeInPriceInput").prop("checked", true);
                } else {
                    $("#feeOnTopInput").prop("checked", true);
                    $("#feeInPriceInput").prop("checked", false);
                }
                if (dataListRet.tcompanyinfo[0].Apcano == '') {
                    templateObject.includeAccountID.set(false);
                } else {
                    templateObject.includeAccountID.set(true);
                }
                templateObject.accountID.set(account_id);
            }
        });
    }
    templateObject.getOrganisationDetails();
    templateObject.getTaxRates = function() {
        getVS1Data('TPaymentMethod').then(function(dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getPaymentMethodVS1().then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                        // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                        var dataList = {
                            id: data.tpaymentmethodvs1[i].fields.ID || '',
                            paymentmethodname: data.tpaymentmethodvs1[i].fields.PaymentMethodName || '',
                            iscreditcard: data.tpaymentmethodvs1[i].fields.IsCreditCard || 'false',
                        };

                        let getIsCreditCard = '';
                        if(data.tpaymentmethodvs1[i].fields.IsCreditCard){
                          getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-data.tpaymentmethodvs1[i].fields.ID" checked><label class="custom-control-label chkBox"for="iscreditcard-data.tpaymentmethodvs1[i].fields.ID"></label></div>';
                        }else{
                          getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-data.tpaymentmethodvs1[i].fields.ID"><label class="custom-control-label chkBox"for="iscreditcard-data.tpaymentmethodvs1[i].fields.ID"></label></div>';
                        }
                        var dataList = [
                          data.tpaymentmethodvs1[i].fields.PaymentMethodName || '',
                          getIsCreditCard
                        ];
                        splashArrayPaymentMethodList.push(dataList);

                        dataTableList.push(dataList);
                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), 'paymentmethodList', function(error, result) {
                            if (error) {

                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.split('.')[1];
                                        let columnWidth = customcolumn[i].width;
                                        let columnindex = customcolumn[i].index + 1;

                                        if (hiddenColumn == true) {

                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                        }

                                    }
                                }

                            }
                        });


                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function() {
                        $('#'+currenttablename).DataTable({
                            data: splashArrayPaymentMethodList,

                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [
                                { className: "colName colNamePopUp pointer", "targets": [0] },
                                { className: "colIsCreditCard colCreditCardPopUp text-center", "targets": [1] }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            language: { search: "",searchPlaceholder: "Search List..." },
                            "fnInitComplete": function () {
                              $("<button class='btn btn-primary btnAddNewPaymentMethod' data-dismiss='modal' data-toggle='modal' data-target='#newPaymentMethodModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#"+currenttablename+"_filter");
                              $("<button class='btn btn-primary btnRefreshPaymentMethod' type='button' id='btnRefreshPaymentMethod' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#"+currenttablename+"_filter");
                            }

                        });
                        $('.fullScreenSpin').css('display', 'none');
                    }, 10);


                    var columns = $('#'+currenttablename+' th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function(i, v) {
                        if (v.hidden == false) {
                            columVisible = true;
                        }
                        if ((v.className.includes("hiddenColumn"))) {
                            columVisible = false;
                        }
                        sWidth = v.style.width.replace('px', "");

                        let datatablerecordObj = {
                            sTitle: v.innerText || '',
                            sWidth: sWidth || '',
                            sIndex: v.cellIndex || '',
                            sVisible: columVisible || false,
                            sClass: v.className || ''
                        };
                        tableHeaderList.push(datatablerecordObj);
                    });
                    templateObject.tableheaderrecords.set(tableHeaderList);
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }).catch(function(err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tpaymentmethodvs1;
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        paymentmethodname: useData[i].fields.PaymentMethodName || '',
                        iscreditcard: useData[i].fields.IsCreditCard || 'false',
                    };
                    let getIsCreditCard = '';
                    if(useData[i].fields.IsCreditCard){
                      getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="' + useData[i].fields.ID + '" checked><label class="custom-control-label chkBox"for="' + useData[i].fields.ID + '"></label></div>';
                    }else{
                      getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="' + useData[i].fields.ID + '"><label class="custom-control-label chkBox"for="' + useData[i].fields.ID + '"></label></div>';
                    }
                    var dataList = [
                      useData[i].fields.PaymentMethodName || '',
                      getIsCreditCard
                    ];
                    splashArrayPaymentMethodList.push(dataList);

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), 'paymentmethodList', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

                                    if (hiddenColumn == true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }


                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#'+currenttablename).DataTable({
                        data: splashArrayPaymentMethodList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                            { className: "colName colNamePopUp pointer", "targets": [0] },
                            { className: "colIsCreditCard colCreditCardPopUp text-center", "targets": [1] }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        language: { search: "",searchPlaceholder: "Search List..." },
                        "fnInitComplete": function () {
                          $("<button class='btn btn-primary btnAddNewPaymentMethod' data-dismiss='modal' data-toggle='modal' data-target='#newPaymentMethodModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#"+currenttablename+"_filter");
                          $("<button class='btn btn-primary btnRefreshPaymentMethod' type='button' id='btnRefreshPaymentMethod' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#"+currenttablename+"_filter");
                        }

                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);


                var columns = $('#'+currenttablename+' th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');

            }
        }).catch(function(err) {
            taxRateService.getPaymentMethodVS1().then(function(data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: data.tpaymentmethodvs1[i].fields.ID || '',
                        paymentmethodname: data.tpaymentmethodvs1[i].fields.PaymentMethodName || '',
                        iscreditcard: data.tpaymentmethodvs1[i].fields.IsCreditCard || 'false',
                    };

                    let getIsCreditCard = '';
                    if(data.tpaymentmethodvs1[i].IsCreditCard){
                      getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-data.tpaymentmethodvs1[i].Id" checked><label class="custom-control-label chkBox"for="iscreditcard-data.tpaymentmethodvs1[i].Id"></label></div>';
                    }else{
                      getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="iscreditcard-data.tpaymentmethodvs1[i].Id"><label class="custom-control-label chkBox"for="iscreditcard-data.tpaymentmethodvs1[i].Id"></label></div>';
                    }
                    var dataList = [
                      data.tpaymentmethodvs1[i].fields.PaymentMethodName || '',
                      getIsCreditCard
                    ];
                    splashArrayPaymentMethodList.push(dataList);

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), 'paymentmethodList', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

                                    if (hiddenColumn == true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#'+currenttablename).DataTable({
                        data: splashArrayPaymentMethodList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                            { className: "colName colNamePopUp pointer", "targets": [0] },
                            { className: "colIsCreditCard colCreditCardPopUp text-center", "targets": [1] }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        language: { search: "",searchPlaceholder: "Search List..." },
                        "fnInitComplete": function () {
                          $("<button class='btn btn-primary btnAddNewPaymentMethod' data-dismiss='modal' data-toggle='modal' data-target='#newPaymentMethodModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#"+currenttablename+"_filter");
                          $("<button class='btn btn-primary btnRefreshPaymentMethod' type='button' id='btnRefreshPaymentMethod' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#"+currenttablename+"_filter");
                        }

                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);


                var columns = $('#'+currenttablename+' th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');

            }).catch(function(err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });


    }

    $(document).ready(function() {
        let url = window.location.href;
        if (url.indexOf("?code") > 0) {
            $('.fullScreenSpin').css('display', 'inline-block');
            url = url.split('?code=');
            var id = url[url.length - 1];

            $.ajax({
                url: 'https://depot.vs1cloud.com/stripe/connect-to-stripe.php',
                data: {
                    'code': id,
                },
                method: 'post',
                success: function(response) {
                    var dataReturnRes = JSON.parse(response);
                    if (dataReturnRes.stripe_user_id) {
                        const templateObject = Template.instance();
                        let stripe_acc_id = dataReturnRes.stripe_user_id;
                        let companyID = 1;

                        var objDetails = {
                            type: "TCompanyInfo",
                            fields: {
                                Id: companyID,
                                Apcano: stripe_acc_id
                            }
                        };
                        organisationService.saveOrganisationSetting(objDetails).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Stripe Connection Successful',
                                text: "Your stripe account connection is successful",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'Ok'
                            }).then((result) => {
                                if (result.value) {
                                    window.open('/paymentmethodSettings', '_self');
                                } else if (result.dismiss === 'cancel') {
                                    window.open('/paymentmethodSettings', '_self');
                                } else {
                                    window.open('/paymentmethodSettings', '_self');
                                }
                            });
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Stripe Connection Successful',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {

                                }
                            });
                        })

                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: response,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {

                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }
                }
            });

        }


        $("#saveStripeID").click(function() {
            playSaveAudio();
            setTimeout(function(){
            $('.fullScreenSpin').css('display', 'inline-block');
            let companyID = 1;
            let feeMethod = "apply";

            if ($('#feeInPriceInput').is(':checked')) {
                feeMethod = "include";
            }

            var objDetails = {
                type: "TCompanyInfo",
                fields: {
                    Id: companyID,
                    DvaABN: feeMethod,
                }
            };
            organisationService.saveOrganisationSetting(objDetails).then(function(data) {
                localStorage.setItem('vs1companyStripeFeeMethod', feeMethod);
                window.open('/paymentmethodSettings', '_self');
            }).catch(function(err) {
                window.open('/paymentmethodSettings', '_self');
            });
        }, delayTimeAfterSound);
        });

    })

    templateObject.getTaxRates();

    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
        // if ($('.paymentmethodList tbody>tr').length > 1) {
        // // if(confirm("Are you sure you want to delete this row?")) {
        // this.click;
        // $(this).closest('tr').remove();
        // //} else { }
        // event.preventDefault();
        // return false;
        // }
    });

    // $('#paymentmethodList tbody').on('click', 'tr .colName, tr .colIsCreditCard, tr .colStatus', function() {
    //     var listData = $(this).closest('tr').attr('id');
    //     var isCreditcard = false;
    //     if (listData) {
    //         $('#add-paymentmethod-title').text('Edit Payment Method');
    //         //$('#isformcreditcard').removeAttr('checked');
    //         if (listData !== '') {
    //             listData = Number(listData);
    //             //taxRateService.getOnePaymentMethod(listData).then(function (data) {
    //
    //             var paymentMethodID = listData || '';
    //             var paymentMethodName = $(event.target).closest("tr").find(".colName").text() || '';
    //             // isCreditcard = $(event.target).closest("tr").find(".colName").text() || '';
    //
    //             if ($(event.target).closest("tr").find(".colIsCreditCard .chkBox").is(':checked')) {
    //                 isCreditcard = true;
    //             }
    //
    //             $('#edtPaymentMethodID').val(paymentMethodID);
    //             $('#edtName').val(paymentMethodName);
    //
    //             if (isCreditcard == true) {
    //                 templateObject.includeCreditCard.set(true);
    //                 //$('#iscreditcard').prop('checked');
    //             } else {
    //                 templateObject.includeCreditCard.set(false);
    //             }
    //
    //             //});
    //
    //
    //             $(this).closest('tr').attr('data-target', '#myModal');
    //             $(this).closest('tr').attr('data-toggle', 'modal');
    //
    //         }
    //
    //     }
    //
    // });
});


Template.paymentmethodpop.events({
    'click #btnNewInvoice': function(event) {
        // FlowRouter.go('/invoicecard');
    },
    'click .btnAddNewPaymentMethod': function (event) {
          $('#isformcreditcard').prop('checked', false);
          $('#edtPaymentMethodName').val('');
        setTimeout(function () {
          $('#edtPaymentMethodName').focus();
        }, 1000);
    },
    'click .feeOnTopInput': function(event) {
        if ($(event.target).is(':checked')) {
            $('.feeInPriceInput').attr('checked', false);
        }
    },
    'click .feeInPriceInput': function(event) {
        if ($(event.target).is(':checked')) {
            $('.feeOnTopInput').attr('checked', false);
        }
    },

    'click .chkDatatable': function(event) {
        var columns = $('#'+currenttablename+' th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTable': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: localStorage.getItem('mycloudLogonID'),
            clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'paymentmethodList'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function(event) {
        let lineItems = [];
        $('.columnSettings').each(function(index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(':checked')) {
                colHidden = false;
            } else {
                colHidden = true;
            }
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass
            }

            lineItems.push(lineItemObj);
        });

        var getcurrentCloudDetails = CloudUser.findOne({
            _id: localStorage.getItem('mycloudLogonID'),
            clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'paymentmethodList'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'paymentmethodList',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'paymentmethodList',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');

                        }
                    });
                }
            }
        }
        $('#myModal2').modal('toggle');
    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).text();
        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        let currenttablename = templateObject.tablename.get() || '';
        var datable = $('#'+currenttablename).DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        let currenttablename = templateObject.tablename.get() || '';
        var datable = $('#'+currenttablename+' th');
        $.each(datable, function(i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        let currenttablename = templateObject.tablename.get() || '';
        var columns = $('#'+currenttablename+' th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");

            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
    },
    'click #exportbtn': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let currenttablename = templateObject.tablename.get() || '';
        jQuery('#'+currenttablename+'_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
            addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function(datareturn) {
                location.reload(true);
            }).catch(function(err) {
                location.reload(true);
            });
        }).catch(function(err) {
            location.reload(true);
        });
    },
    'click .btnRefreshPaymentMethod': function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        const customerList = [];
        const clientList = [];
        let salesOrderTable;
        var splashArray = new Array();
        var splashArrayPaymentMethodList = new Array();
        const dataTableList = [];
        const tableHeaderList = [];
        let sideBarService = new SideBarService();
        let taxRateService = new TaxRateService();
        let currenttablename = templateObject.tablename.get() || '';
        let dataSearchName = $('#'+currenttablename+'_filter input').val();
        var currentLoc = FlowRouter.current().route.path;
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getPaymentMethodVS1ByName(dataSearchName).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                if (data.tpaymentmethodvs1.length > 0) {
                  for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    let getIsCreditCard = '';
                    if(data.tpaymentmethodvs1[i].fields.IsCreditCard){
                      getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="' + data.tpaymentmethodvs1[i].Id + '" checked><label class="custom-control-label chkBox"for="' + data.tpaymentmethodvs1[i].Id + '"></label></div>';
                    }else{
                      getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="' + data.tpaymentmethodvs1[i].Id + '"><label class="custom-control-label chkBox"for="' + data.tpaymentmethodvs1[i].Id + '"></label></div>';
                    }
                    var dataList = [
                      data.tpaymentmethodvs1[i].fields.PaymentMethodName || '',
                      getIsCreditCard
                    ];
                splashArrayPaymentMethodList.push(dataList);
                  }

                    var datatable = $('#'+currenttablename).DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayPaymentMethodList);
                    datatable.draw(false);

                    $('.fullScreenSpin').css('display', 'none');
                } else {

                    $('.fullScreenSpin').css('display', 'none');
                     $('#paymentMethodModal').modal('toggle');
                    swal({
                        title: 'Question',
                        text: "Payment Method does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            $('#newPaymentMethodModal').modal('toggle');
                            $('#edtPaymentMethodName').val(dataSearchName);
                        } else if (result.dismiss === 'cancel') {
                            $('#newPaymentMethodModal').modal('toggle');
                        }
                    });

                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
          sideBarService.getPaymentMethodVS1().then(function(data) {

                  let records = [];
                  let inventoryData = [];
                  for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    let getIsCreditCard = '';
                    if(data.tpaymentmethodvs1[i].fields.IsCreditCard){
                      getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="' + data.tpaymentmethodvs1[i].Id + '" checked><label class="custom-control-label chkBox"for="' + data.tpaymentmethodvs1[i].Id + '"></label></div>';
                    }else{
                      getIsCreditCard = '<div class="custom-control custom-checkbox chkBox"><input class="custom-control-input chkBox" type="checkbox" id="' + data.tpaymentmethodvs1[i].Id + '"><label class="custom-control-label chkBox"for="' + data.tpaymentmethodvs1[i].Id + '"></label></div>';
                    }
                    var dataList = [
                      data.tpaymentmethodvs1[i].fields.PaymentMethodName || '',
                      getIsCreditCard
                    ];
                splashArrayPaymentMethodList.push(dataList);

                  }
        var datatable = $('#'+currenttablename).DataTable();
              datatable.clear();
              datatable.rows.add(splashArrayPaymentMethodList);
              datatable.draw(false);

              $('.fullScreenSpin').css('display', 'none');
              }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'keyup #paymentmethodList_filter input': function (event) {
      if (event.keyCode == 13) {
         $(".btnRefreshPaymentMethod").trigger("click");
      }
    },
    'click .btnDeletePaymentMethod': function() {
        playDeleteAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function(){
        let paymentMethodId = $('#selectDeleteLineID').val();

        let objDetails = {
            type: "TPaymentMethod",
            fields: {
                Id: parseInt(paymentMethodId),
                Active: false
            }
        };

        taxRateService.savePaymentMethod(objDetails).then(function(objDetails) {
            sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
                addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function(datareturn) {
                    location.reload(true);
                }).catch(function(err) {
                    location.reload(true);
                });
            }).catch(function(err) {
                location.reload(true);
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
                    Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
            });
            $('.fullScreenSpin').css('display', 'none');
        });
    }, delayTimeAfterSound);
    },
    // 'click .btnSavePaymentMethod': function() {
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     let taxRateService = new TaxRateService();
    //     let paymentMethodID = $('#edtPaymentMethodID').val();
    //     //let headerDept = $('#sltDepartment').val();
    //     let paymentName = $('#edtName').val();
    //     let isCreditCard = false;
    //     let siteCode = $('#edtSiteCode').val();
    //
    //     if ($('#isformcreditcard').is(':checked')) {
    //         isCreditCard = true;
    //     } else {
    //         isCreditCard = false;
    //     }
    //
    //     let objDetails = '';
    //     if (paymentName === '') {
    //         $('.fullScreenSpin').css('display', 'none');
    //         Bert.alert('<strong>WARNING:</strong> Payment Method Name cannot be blank!', 'warning');
    //         e.preventDefault();
    //     }
    //
    //     if (paymentMethodID == "") {
    //         taxRateService.checkPaymentMethodByName(paymentName).then(function(data) {
    //             paymentMethodID = data.tpaymentmethod[0].Id;
    //             objDetails = {
    //                 type: "TPaymentMethod",
    //                 fields: {
    //                     ID: parseInt(paymentMethodID),
    //                     Active: true,
    //                     //PaymentMethodName: paymentName,
    //                     IsCreditCard: isCreditCard,
    //                     PublishOnVS1: true
    //                 }
    //             };
    //
    //             taxRateService.savePaymentMethod(objDetails).then(function(objDetails) {
    //                 sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
    //                     addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function(datareturn) {
    //                         location.reload(true);
    //                     }).catch(function(err) {
    //                         location.reload(true);
    //                     });
    //                 }).catch(function(err) {
    //                     location.reload(true);
    //                 });
    //             }).catch(function(err) {
    //                 swal({
    //                     title: 'Oooops...',
    //                     text: err,
    //                     type: 'error',
    //                     showCancelButton: false,
    //                     confirmButtonText: 'Try Again'
    //                 }).then((result) => {
    //                     if (result.value) {
    //                         Meteor._reload.reload();
    //                     } else if (result.dismiss === 'cancel') {
    //
    //                     }
    //                 });
    //                 $('.fullScreenSpin').css('display', 'none');
    //             });
    //         }).catch(function(err) {
    //             objDetails = {
    //                 type: "TPaymentMethod",
    //                 fields: {
    //                     Active: true,
    //                     PaymentMethodName: paymentName,
    //                     IsCreditCard: isCreditCard,
    //                     PublishOnVS1: true
    //                 }
    //             };
    //
    //             taxRateService.savePaymentMethod(objDetails).then(function(objDetails) {
    //                 sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
    //                     addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function(datareturn) {
    //                         location.reload(true);
    //                     }).catch(function(err) {
    //                         location.reload(true);
    //                     });
    //                 }).catch(function(err) {
    //                     location.reload(true);
    //                 });
    //             }).catch(function(err) {
    //                 swal({
    //                     title: 'Oooops...',
    //                     text: err,
    //                     type: 'error',
    //                     showCancelButton: false,
    //                     confirmButtonText: 'Try Again'
    //                 }).then((result) => {
    //                     if (result.value) {
    //                         Meteor._reload.reload();
    //                     } else if (result.dismiss === 'cancel') {
    //
    //                     }
    //                 });
    //                 $('.fullScreenSpin').css('display', 'none');
    //             });
    //         });
    //
    //     } else {
    //         objDetails = {
    //             type: "TPaymentMethod",
    //             fields: {
    //                 ID: parseInt(paymentMethodID),
    //                 Active: true,
    //                 PaymentMethodName: paymentName,
    //                 IsCreditCard: isCreditCard,
    //                 PublishOnVS1: true
    //             }
    //         };
    //
    //         taxRateService.savePaymentMethod(objDetails).then(function(objDetails) {
    //             sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
    //                 addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function(datareturn) {
    //                     location.reload(true);
    //                 }).catch(function(err) {
    //                     location.reload(true);
    //                 });
    //             }).catch(function(err) {
    //                 location.reload(true);
    //             });
    //         }).catch(function(err) {
    //             swal({
    //                 title: 'Oooops...',
    //                 text: err,
    //                 type: 'error',
    //                 showCancelButton: false,
    //                 confirmButtonText: 'Try Again'
    //             }).then((result) => {
    //                 if (result.value) {
    //                     Meteor._reload.reload();
    //                 } else if (result.dismiss === 'cancel') {
    //
    //                 }
    //             });
    //             $('.fullScreenSpin').css('display', 'none');
    //         });
    //     }
    //
    //
    //
    //
    // },
    'click .btnAddPaymentMethod': function() {
        let templateObject = Template.instance();
        $('#add-paymentmethod-title').text('Add New Payment Method');
        $('#edtPaymentMethodID').val('');
        $('#edtPaymentMethodName').val('');
        templateObject.includeCreditCard.set(false);
    },
    'click .btnBack': function(event) {
        playCancelAudio();
        event.preventDefault();
        setTimeout(function(){
        history.back(1);
        }, delayTimeAfterSound);
    }


});

Template.paymentmethodpop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.paymentmethodname == 'NA') {
                return 1;
            } else if (b.paymentmethodname == 'NA') {
                return -1;
            }
            return (a.paymentmethodname.toUpperCase() > b.paymentmethodname.toUpperCase()) ? 1 : -1;
        });
    },
    accountID: () => {
        return Template.instance().accountID.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: localStorage.getItem('mycloudLogonID'),
            PrefName: 'paymentmethodList'
        });
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    includeAccountID: () => {
        return Template.instance().includeAccountID.get();
    },
    includeCreditCard: () => {
        return Template.instance().includeCreditCard.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },
    tablename: () => {
        return Template.instance().tablename.get();
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
