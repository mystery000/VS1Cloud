import {
    TaxRateService
} from "../settings/settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './termspopup.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
Template.termlistpop.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.deptrecords = new ReactiveVar();

    templateObject.include7Days = new ReactiveVar();
    templateObject.include7Days.set(false);
    templateObject.include30Days = new ReactiveVar();
    templateObject.include30Days.set(false);
    templateObject.includeCOD = new ReactiveVar();
    templateObject.includeCOD.set(false);
    templateObject.includeEOM = new ReactiveVar();
    templateObject.includeEOM.set(false);
    templateObject.includeEOMPlus = new ReactiveVar();
    templateObject.includeEOMPlus.set(false);

    templateObject.includeSalesDefault = new ReactiveVar();
    templateObject.includeSalesDefault.set(false);
    templateObject.includePurchaseDefault = new ReactiveVar();
    templateObject.includePurchaseDefault.set(false);


    templateObject.getDataTableList = function(data){
      console.log(data);
        let linestatus = '';
            if (data.Active == true) {
                linestatus = "";
            } else if (data.Active == false) {
                linestatus = "In-Active";
            };
            let tdEOM = '';
            let tdEOMPlus = '';
            let tdCustomerDef = ''; //isSalesdefault
            let tdSupplierDef = ''; //isPurchasedefault
            let tdProgressPayment = ''; //isProgressPayment
            let tdRequired = ''; //Required

            //Check if EOM is checked
            if (data.IsEOM == true) {
                tdEOM = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseom-' + data.ID + '" checked><label class="custom-control-label chkBox" for="iseom-' + data.ID + '"></label></div>';
            } else {
                tdEOM = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseom-' + data.ID + '"><label class="custom-control-label chkBox" for="iseom-' + data.ID + '"></label></div>';
            }
            //Check if EOM Plus is checked
            if (data.IsEOMPlus == true) {
                tdEOMPlus = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.ID + '" checked><label class="custom-control-label chkBox" for="iseomplus-' + data.ID + '"></label></div>';
            } else {
                tdEOMPlus = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.ID + '"><label class="custom-control-label chkBox" for="iseomplus-' + data.ID + '"></label></div>';
            }
            //Check if Customer Default is checked // //isSalesdefault
            if (data.isSalesdefault == true) {
                tdCustomerDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isSalesdefault-' + data.ID + '" checked><label class="custom-control-label chkBox" for="isSalesdefault-' + data.ID + '"></label></div>';
            } else {
                tdCustomerDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isSalesdefault-' + data.ID + '"><label class="custom-control-label chkBox" for="isSalesdefault-' + data.ID + '"></label></div>';
            }
            //Check if Supplier Default is checked // isPurchasedefault
            if (data.isPurchasedefault == true) {
                tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="isPurchasedefault-' + data.ID + '" checked><label class="custom-control-label chkBox" for="isPurchasedefault-' + data.ID + '"></label></div>';
            } else {
                tdSupplierDef = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="iseomplus-' + data.ID + '"><label class="custom-control-label chkBox" for="isPurchasedefault-' + data.ID + '"></label></div>';
            }
            //Check if is progress payment is checked
            if (data.IsProgressPayment == true) {
                tdProgressPayment = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="IsProgressPayment-' + data.ID + '" checked><label class="custom-control-label chkBox" for="IsProgressPayment-' + data.ID + '"></label></div>';
            } else {
                tdProgressPayment = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="IsProgressPayment-' + data.ID + '"><label class="custom-control-label chkBox" for="IsProgressPayment-' + data.ID + '"></label></div>';
            }
            //Check if Required is checked
            if (data.Required == true) {
                tdRequired = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="Required-' + data.ID + '" checked><label class="custom-control-label chkBox" for="Required-' + data.ID + '"></label></div>';
            } else {
                tdRequired = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="Required-' + data.ID + '"><label class="custom-control-label chkBox" for="Required-' + data.ID + '"></label></div>';
            }

            //Check if ProgressPaymentfirstPayonSaleDate is checked
            if (data.ProgressPaymentfirstPayonSaleDate == true) {
                tdPayOnSale = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="ProgressPaymentfirstPayonSaleDate-' + data.ID + '" checked><label class="custom-control-label chkBox" for="ProgressPaymentfirstPayonSaleDate-' + data.ID + '"></label></div>';
            } else {
                tdPayOnSale = '<div class="custom-control custom-switch chkBox text-center"><input class="custom-control-input chkBox" type="checkbox" id="ProgressPaymentfirstPayonSaleDate-' + data.ID + '"><label class="custom-control-label chkBox" for="ProgressPaymentfirstPayonSaleDate-' + data.ID + '"></label></div>';
            };

            var dataList = [
                data.ID || "",
                data.Terms || "",
                data.TermsAmount || "",
                tdEOM,
                tdEOMPlus,
                data.Description || "",
                tdCustomerDef,
                tdSupplierDef,
                linestatus,
                tdProgressPayment,
                tdRequired,
                data.EarlyPaymentDiscount || 0.00,
                data.EarlyPaymentDays || 0.00,
                data.ProgressPaymentType || "",
                data.ProgressPaymentDuration || 0.00,
                data.ProgressPaymentInstallments || 0.00,
                data.ProgressPaymentfirstPayonSaleDate || 0.00,
            ];
        // let dataList = [];
        return dataList;
    }

    let headerStructure  = [
        { index: 0, label: 'ID', class: 'colTermsID', active: false, display: true, width: "10" },
        { index: 1, label: 'Term Name', class: 'colName', active: true, display: true, width: "150" },
        { index: 2, label: 'Terms Amount', class: 'colTermsAmount', active: true, display: true, width: "120" },
        { index: 3, label: 'EOM', class: 'colIsEOM', active: true, display: true, width: "50" },
        { index: 4, label: 'EOM Plus', class: 'colIsEOMPlus', active: true, display: true, width: "80" },
        { index: 5, label: 'Description', class: 'colDescription', active: true, display: true, width: "" },
        { index: 6, label: 'Customer Default', class: 'colCustomerDef', active: true, display: true, width: "130" },
        { index: 7, label: 'Supplier Default', class: 'colSupplierDef', active: true, display: true, width: "130" },
        { index: 8, label: 'Status', class: 'colStatus', active: true, display: true, width: "100" },
        { index: 9, label: 'Is Progress Payment', class: 'colIsProgressPayment', active: false, display: true, width: "200" },
        { index: 10, label: 'Required', class: 'colRequired', active: false, display: true, width: "100" },
        { index: 11, label: 'Early Payment Discount', class: 'colEarlyPayDiscount', active: false, display: true, width: "200" },
        { index: 12, label: 'Early Payment Days', class: 'colEarlyPay', active: false, display: true, width: "150" },
        { index: 13, label: 'Payment Type', class: 'colProgressPayType', active: false, display: true, width: "150" },
        { index: 14, label: 'Payment Duration', class: 'colProgressPayDuration', active: false, display: true, width: "100" },
        { index: 15, label: 'Pay On Sale Date', class: 'colPayOnSale', active: false, display: true, width: "150" },
    ];

    templateObject.tableheaderrecords.set(headerStructure)

});

Template.termlistpop.onRendered(function() {

});


Template.termlistpop.events({

    'click .btnAddNewTerm': function (event) {
        setTimeout(function () {
          $('#edtName').focus();
        }, 1000);
    },
    // 'click #btnNewInvoice': function(event) {
    //     // FlowRouter.go('/invoicecard');
    // },
    // 'click .chkDatatable': function(event) {
    //     var columns = $('#termsList th');
    //     let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

    //     $.each(columns, function(i, v) {
    //         let className = v.classList;
    //         let replaceClass = className[1];

    //         if (v.innerText == columnDataValue) {
    //             if ($(event.target).is(':checked')) {
    //                 $("." + replaceClass + "").css('display', 'table-cell');
    //                 $("." + replaceClass + "").css('padding', '.75rem');
    //                 $("." + replaceClass + "").css('vertical-align', 'top');
    //             } else {
    //                 $("." + replaceClass + "").css('display', 'none');
    //             }
    //         }
    //     });
    // },
    // 'click .resetTable': function(event) {
    //     var getcurrentCloudDetails = CloudUser.findOne({
    //         _id: localStorage.getItem('mycloudLogonID'),
    //         clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
    //     });
    //     if (getcurrentCloudDetails) {
    //         if (getcurrentCloudDetails._id.length > 0) {
    //             var clientID = getcurrentCloudDetails._id;
    //             var clientUsername = getcurrentCloudDetails.cloudUsername;
    //             var clientEmail = getcurrentCloudDetails.cloudEmail;
    //             var checkPrefDetails = CloudPreference.findOne({
    //                 userid: clientID,
    //                 PrefName: 'termsList'
    //             });
    //             if (checkPrefDetails) {
    //                 CloudPreference.remove({
    //                     _id: checkPrefDetails._id
    //                 }, function(err, idTag) {
    //                     if (err) {

    //                     } else {
    //                         Meteor._reload.reload();
    //                     }
    //                 });

    //             }
    //         }
    //     }
    // },
    // 'click .saveTable': function(event) {
    //     let lineItems = [];
    //     $('.columnSettings').each(function(index) {
    //         var $tblrow = $(this);
    //         var colTitle = $tblrow.find(".divcolumn").text() || '';
    //         var colWidth = $tblrow.find(".custom-range").val() || 0;
    //         var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
    //         var colHidden = false;
    //         if ($tblrow.find(".custom-control-input").is(':checked')) {
    //             colHidden = false;
    //         } else {
    //             colHidden = true;
    //         }
    //         let lineItemObj = {
    //             index: index,
    //             label: colTitle,
    //             hidden: colHidden,
    //             width: colWidth,
    //             thclass: colthClass
    //         }

    //         lineItems.push(lineItemObj);
    //     });

    //     var getcurrentCloudDetails = CloudUser.findOne({
    //         _id: localStorage.getItem('mycloudLogonID'),
    //         clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
    //     });
    //     if (getcurrentCloudDetails) {
    //         if (getcurrentCloudDetails._id.length > 0) {
    //             var clientID = getcurrentCloudDetails._id;
    //             var clientUsername = getcurrentCloudDetails.cloudUsername;
    //             var clientEmail = getcurrentCloudDetails.cloudEmail;
    //             var checkPrefDetails = CloudPreference.findOne({
    //                 userid: clientID,
    //                 PrefName: 'termsList'
    //             });
    //             if (checkPrefDetails) {
    //                 CloudPreference.update({
    //                     _id: checkPrefDetails._id
    //                 }, {
    //                     $set: {
    //                         userid: clientID,
    //                         username: clientUsername,
    //                         useremail: clientEmail,
    //                         PrefGroup: 'salesform',
    //                         PrefName: 'termsList',
    //                         published: true,
    //                         customFields: lineItems,
    //                         updatedAt: new Date()
    //                     }
    //                 }, function(err, idTag) {
    //                     if (err) {
    //                         $('#myModal2').modal('toggle');
    //                     } else {
    //                         $('#myModal2').modal('toggle');
    //                     }
    //                 });

    //             } else {
    //                 CloudPreference.insert({
    //                     userid: clientID,
    //                     username: clientUsername,
    //                     useremail: clientEmail,
    //                     PrefGroup: 'salesform',
    //                     PrefName: 'termsList',
    //                     published: true,
    //                     customFields: lineItems,
    //                     createdAt: new Date()
    //                 }, function(err, idTag) {
    //                     if (err) {
    //                         $('#myModal2').modal('toggle');
    //                     } else {
    //                         $('#myModal2').modal('toggle');

    //                     }
    //                 });
    //             }
    //         }
    //     }
    //     $('#myModal2').modal('toggle');
    // },
    // 'blur .divcolumn': function(event) {
    //     let columData = $(event.target).text();

    //     let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
    //     var datable = $('#termsList').DataTable();
    //     var title = datable.column(columnDatanIndex).header();
    //     $(title).html(columData);

    // },
    // 'change .rngRange': function(event) {
    //     let range = $(event.target).val();
    //     $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

    //     let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    //     let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    //     var datable = $('#termsList th');
    //     $.each(datable, function(i, v) {

    //         if (v.innerText == columnDataValue) {
    //             let className = v.className;
    //             let replaceClass = className.replace(/ /g, ".");
    //             $("." + replaceClass + "").css('width', range + 'px');

    //         }
    //     });

    // },
    // 'click .btnOpenSettings': function(event) {
    //     let templateObject = Template.instance();
    //     var columns = $('#termsList th');

    //     const tableHeaderList = [];
    //     let sTible = "";
    //     let sWidth = "";
    //     let sIndex = "";
    //     let sVisible = "";
    //     let columVisible = false;
    //     let sClass = "";
    //     $.each(columns, function(i, v) {
    //         if (v.hidden == false) {
    //             columVisible = true;
    //         }
    //         if ((v.className.includes("hiddenColumn"))) {
    //             columVisible = false;
    //         }
    //         sWidth = v.style.width.replace('px', "");

    //         let datatablerecordObj = {
    //             sTitle: v.innerText || '',
    //             sWidth: sWidth || '',
    //             sIndex: v.cellIndex || '',
    //             sVisible: columVisible || false,
    //             sClass: v.className || ''
    //         };
    //         tableHeaderList.push(datatablerecordObj);
    //     });
    //     templateObject.tableheaderrecords.set(tableHeaderList);
    // },
    // 'click #exportbtn': function() {
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     jQuery('#termsList_wrapper .dt-buttons .btntabletoexcel').click();
    //     $('.fullScreenSpin').css('display', 'none');

    // },
    // 'click .btnRefresh': function() {
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     sideBarService.getTermsVS1().then(function(dataReload) {
    //         addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
    //             location.reload(true);
    //         }).catch(function(err) {
    //             location.reload(true);
    //         });
    //     }).catch(function(err) {
    //         location.reload(true);
    //     });
    // },
    'click .btnDeleteTerms': function() {
        playDeleteAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function(){

        let termsId = $('#selectDeleteLineID').val();

        let objDetails = {
            type: "TTerms",
            fields: {
                Id: parseInt(termsId),
                Active: false
            }
        };

        taxRateService.saveTerms(objDetails).then(function(objDetails) {
            sideBarService.getTermsVS1().then(function(dataReload) {
                addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                    Meteor._reload.reload();
                }).catch(function(err) {
                    Meteor._reload.reload();
                });
            }).catch(function(err) {
                Meteor._reload.reload();
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
    'click .btnSaveTerms': function() {
        playSaveAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');

        let termsID = $('#edtTermsID').val();
        let termsName = $('#edtName').val();
        let description = $('#edtDesc').val();
        let termdays = $('#edtDays').val();

        let isDays = false;
        let is30days = false;
        let isEOM = false;
        let isEOMPlus = false;
        let days = 0;

        let isSalesdefault = false;
        let isPurchasedefault = false;
        if (termdays.replace(/\s/g, '') != "") {
            isDays = true;
        } else {
            isDays = false;
        }

        if ($('#isEOM').is(':checked')) {
            isEOM = true;
        } else {
            isEOM = false;
        }

        if ($('#isEOMPlus').is(':checked')) {
            isEOMPlus = true;
        } else {
            isEOMPlus = false;
        }

        if ($('#chkCustomerDef').is(':checked')) {
            isSalesdefault = true;
        } else {
            isSalesdefault = false;
        }

        if ($('#chkSupplierDef').is(':checked')) {
            isPurchasedefault = true;
        } else {
            isPurchasedefault = false;
        }

        let objDetails = '';
        if (termsName === '') {
            $('.fullScreenSpin').css('display', 'none');
            Bert.alert('<strong>WARNING:</strong> Term Name cannot be blank!', 'warning');
            e.preventDefault();
        }

        if (termsID == "") {
            taxRateService.checkTermByName(termsName).then(function(data) {
                termsID = data.tterms[0].Id;
                objDetails = {
                    type: "TTerms",
                    fields: {
                        ID: parseInt(termsID),
                        Active: true,
                        //TermsName: termsName,
                        Description: description,
                        IsDays: isDays,
                        IsEOM: isEOM,
                        IsEOMPlus: isEOMPlus,
                        isPurchasedefault: isPurchasedefault,
                        isSalesdefault: isSalesdefault,
                        Days: termdays || 0,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTerms(objDetails).then(function(objDetails) {
                    sideBarService.getTermsVS1().then(function(dataReload) {
                        addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                            Meteor._reload.reload();
                        }).catch(function(err) {
                            Meteor._reload.reload();
                        });
                    }).catch(function(err) {
                        Meteor._reload.reload();
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
            }).catch(function(err) {
                objDetails = {
                    type: "TTerms",
                    fields: {
                        Active: true,
                        TermsName: termsName,
                        Description: description,
                        IsDays: isDays,
                        IsEOM: isEOM,
                        IsEOMPlus: isEOMPlus,
                        Days: termdays || 0,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTerms(objDetails).then(function(objDetails) {
                    sideBarService.getTermsVS1().then(function(dataReload) {
                        addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                            Meteor._reload.reload();
                        }).catch(function(err) {
                            Meteor._reload.reload();
                        });
                    }).catch(function(err) {
                        Meteor._reload.reload();
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
            });

        } else {
            objDetails = {
                type: "TTerms",
                fields: {
                    ID: parseInt(termsID),
                    TermsName: termsName,
                    Description: description,
                    IsDays: isDays,
                    IsEOM: isEOM,
                    isPurchasedefault: isPurchasedefault,
                    isSalesdefault: isSalesdefault,
                    IsEOMPlus: isEOMPlus,
                    Days: termdays || 0,
                    PublishOnVS1: true
                }
            };

            taxRateService.saveTerms(objDetails).then(function(objDetails) {
                sideBarService.getTermsVS1().then(function(dataReload) {
                    addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                        Meteor._reload.reload();
                    }).catch(function(err) {
                        Meteor._reload.reload();
                    });
                }).catch(function(err) {
                    Meteor._reload.reload();
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
        }
    }, delayTimeAfterSound);
    },
    'click .btnAddTerms': function() {
        let templateObject = Template.instance();
        $('#add-terms-title').text('Add New Term ');
        $('#edtTermsID').val('');
        $('#edtName').val('');
        $('#edtName').prop('readonly', false);
        $('#edtDesc').val('');
        $('#edtDays').val('');

        templateObject.include7Days.set(false);
        templateObject.includeCOD.set(false);
        templateObject.include30Days.set(false);
        templateObject.includeEOM.set(false);
        templateObject.includeEOMPlus.set(false);
    },
    'click .btnBack': function(event) {
        playCancelAudio();
        event.preventDefault();
        setTimeout(function(){
        history.back(1);
        }, delayTimeAfterSound);
    },
    'click .chkTerms': function(event) {
        var $box = $(event.target);

        if ($box.is(":checked")) {
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    },
    // 'keydown #edtDays': function(event) {
    //     if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
    //         // Allow: Ctrl+A, Command+A
    //         (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
    //         // Allow: home, end, left, right, down, up
    //         (event.keyCode >= 35 && event.keyCode <= 40)) {
    //         // let it happen, don't do anything
    //         return;
    //     }

    //     if (event.shiftKey == true) {
    //         event.preventDefault();
    //     }

    //     if ((event.keyCode >= 48 && event.keyCode <= 57) ||
    //         (event.keyCode >= 96 && event.keyCode <= 105) ||
    //         event.keyCode == 8 || event.keyCode == 9 ||
    //         event.keyCode == 37 || event.keyCode == 39 ||
    //         event.keyCode == 46 || event.keyCode == 190) {} else {
    //         event.preventDefault();
    //     }
    // }


});

Template.termlistpop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.termname == 'NA') {
                return 1;
            } else if (b.termname == 'NA') {
                return -1;
            }
            return (a.termname.toUpperCase() > b.termname.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: localStorage.getItem('mycloudLogonID'),
            PrefName: 'termsList'
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
    include7Days: () => {
        return Template.instance().include7Days.get();
    },
    include30Days: () => {
        return Template.instance().include30Days.get();
    },
    includeCOD: () => {
        return Template.instance().includeCOD.get();
    },
    includeEOM: () => {
        return Template.instance().includeEOM.get();
    },
    includeEOMPlus: () => {
        return Template.instance().includeEOMPlus.get();
    },
    includeSalesDefault: () => {
        return Template.instance().includeSalesDefault.get();
    },
    includePurchaseDefault: () => {
        return Template.instance().includePurchaseDefault.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },
    apiFunction:function() {
        let sideBarService = new SideBarService();
        return sideBarService.getTermsDataList;
    },
    service: ()=>{
        let sideBarService = new SideBarService();
        return sideBarService;
    },
    apiParams: ()=>{
        return ['limitCount', 'limitFrom', 'deleteFilter']
    },
    searchAPI: function() {
        let sideBarService = new SideBarService();
        return sideBarService.getOneTermsByTermName
    },

    datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    exDataHandler: function() {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
