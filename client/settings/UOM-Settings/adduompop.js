import { Template } from 'meteor/templating';
import './adduompop.html';
import { TaxRateService } from '../settings-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let taxSelected = '';
Template.adduompop.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.includeSalesDefault = new ReactiveVar();
    templateObject.includeSalesDefault.set(false);
    templateObject.includePurchaseDefault = new ReactiveVar();
    templateObject.includePurchaseDefault.set(false);
    templateObject.record = new ReactiveVar();
});

Template.adduompop.onRendered(async function () {
    let templateObject = Template.instance();
    templateObject.getUOMData = async function () {
        return new Promise((resolve, reject) => {
            if(templateObject.data.name) {
                let name = templateObject.data.name;
                getVS1Data("TUnitOfMeasure").then(function(dataObject) {
                    if(dataObject.length ==0) {
                        sideBarService.getUOMVS1ByName(name).then(function(data) {
                            if(data.tunitofmeasure.length > 0){
                                resolve(data.tunitofmeasure[0])
                            } else {
                                resolve(null)
                            }
                        })
                    }else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tunitofmeasure;
                        let added = false;
                        for(let i=0; i< useData.length; i++) {
                            if(useData[i].fields.UOMName == name) {
                                added = true;
                                resolve(useData[i]);
                            }
                        }
                        if(added == false) {
                            sideBarService.getUOMVS1ByName(name).then(function(data) {
                                if(data.tunitofmeasure.length > 0) {
                                    resolve(data.tunitofmeasure[0])
                                } else {
                                    resolve(null)
                                }
                            })  
                        }
                    }
                }).catch(function(e) {
                    sideBarService.getUOMVS1ByName(name).then(function(data) {
                        if(data.tunitofmeasure.length > 0) {
                            resolve(data.tunitofmeasure[0])
                        } else {
                            resolve(null)
                        }
                    })
                })
            } else {
                resolve(null);
            }
        })
    }

    let data = await templateObject.getUOMData();
    let record = "";
    if(data && data != null) {
        $("#edtUOMNamePop").attr("readonly", true);
        let taxRate = (
            data.fields.Rate * 100
        ).toFixed(2);
        var taxRateID = data.fields.ID || "";
        var taxRateName =
            data.fields.UOMName || "";
        var taxRateDesc =
            data.fields.Description || "";
        var multi = data.fields.Multiplier || 0;
        var salesDefault = data.fields.SalesDefault || false;
        templateObject.includeSalesDefault.set(salesDefault);
        var purchaseDefault = data.fields.PurchasesDefault || false;
        templateObject.includePurchaseDefault.set(purchaseDefault)
        // $("#edtUOMID").val(taxRateID);
        // $("#edtUOMNamePop").val(taxRateName);
        // $("#edtTaxRatePop").val(taxRate);
        // $("#edtTaxDescPop").val(taxRateDesc);
        record = {
            unitName: taxRateName,
            unitDescription: taxRateDesc,
            unitID: taxRateID,
            unitMutli: multi,
        }
        templateObject.record.set(record)
    }else {
        record = {
            unitName: '',
            unitDescription: '',
            unitID: '',
            unitMutli: 0,
        }
        templateObject.record.set(record);
        templateObject.includeSalesDefault.set(false);
        templateObject.includePurchaseDefault.set(false);
    }

});

Template.adduompop.events({
    'click .btnSaveUOM': function () {
        playSaveAudio();
        let taxRateService = new TaxRateService();
        setTimeout(function () {
            //$('.fullScreenSpin').css('display','inline-block');
            let objDetails = '';
            let uomID = $('#edtUOMID').val();
            let uomName = $('#edtUnitName').val() || '';
            let uomDescription = $('#txaUnitDescription').val() || '';
            let uomProduct = $('#sltProduct').val() || '';
            let uomMultiplier = $('#edtUnitMultiplier').val() || 0;
            let uomWeight = $('#edtUnitWeight').val() || 0;
            let uomNonOfBoxes = $('#edtNoOfBoxes').val() || 0;
            let uomHeight = $('#edtHeight').val() || 0;
            let uomWidth = $('#edtWidth').val() || 0;
            let uomLength = $('#edtLength').val() || 0;
            let uomVolume = $('#edtVolume').val() || 0;

            let isSalesdefault = false;
            let isPurchasedefault = false;

            if ($('#swtSalesDefault').is(':checked')) {
                isSalesdefault = true;
            } else {
                isSalesdefault = false;
            }

            if ($('#swtPurchaseDefault').is(':checked')) {
                isPurchasedefault = true;
            } else {
                isPurchasedefault = false;
            }

            if (uomName === '') {
                $('.fullScreenSpin').css('display', 'none');
                Bert.alert('<strong>WARNING:</strong> Unit Name cannot be blank!', 'warning');
                e.preventDefault();
            }

            if (uomID == '') {
                taxRateService
                    .checkTermByName(uomName)
                    .then(function (data) {
                        uomID = data.tunitofmeasure[0].Id;
                        objDetails = {
                            type: 'TUnitOfMeasureList',
                            fields: {
                                ID: parseInt(uomID),
                                UOMName: uomName,
                                UnitDescription: uomDescription,
                                ProductName: uomProduct,
                                Multiplier: parseFloat(uomMultiplier) || 0,
                                PurchasesDefault: isPurchasedefault,
                                SalesDefault: isSalesdefault,
                                Weight: parseFloat(uomWeight) || 0,
                                NoOfBoxes: parseFloat(uomNonOfBoxes) || 0,
                                Height: parseFloat(uomHeight) || 0,
                                Length: parseFloat(uomLength) || 0,
                                Width: parseFloat(uomWidth) || 0,
                                Volume: parseFloat(uomVolume) || 0,
                                Active: true,
                            },
                        };

                        taxRateService
                            .saveUOM(objDetails)
                            .then(function (objDetails) {
                                sideBarService.getUOMVS1().then(function (dataReload) {
                                    addVS1Data('TUnitOfMeasureList', JSON.stringify(dataReload))
                                        .then(function (datareturn) {
                                            Meteor._reload.reload();
                                        })
                                        .catch(function (err) {
                                            Meteor._reload.reload();
                                        });
                                });
                            })
                            .catch(function (err) {
                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again',
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {
                                    }
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            });
                    })
                    .catch(function (err) {
                        objDetails = {
                            type: 'TUnitOfMeasureList',
                            fields: {
                                UOMName: uomName,
                                UnitDescription: uomDescription,
                                ProductName: uomProduct,
                                Multiplier: parseFloat(uomMultiplier) || 0,
                                PurchasesDefault: isPurchasedefault,
                                SalesDefault: isSalesdefault,
                                Weight: parseFloat(uomWeight) || 0,
                                NoOfBoxes: parseFloat(uomNonOfBoxes) || 0,
                                Height: parseFloat(uomHeight) || 0,
                                Length: parseFloat(uomLength) || 0,
                                Width: parseFloat(uomWidth) || 0,
                                Volume: parseFloat(uomVolume) || 0,
                                Active: true,
                            },
                        };

                        taxRateService
                            .saveUOM(objDetails)
                            .then(function (objDetails) {
                                sideBarService.getUOMVS1().then(function (dataReload) {
                                    addVS1Data('TUnitOfMeasureList', JSON.stringify(dataReload))
                                        .then(function (datareturn) {
                                            Meteor._reload.reload();
                                        })
                                        .catch(function (err) {
                                            Meteor._reload.reload();
                                        });
                                });
                            })
                            .catch(function (err) {
                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again',
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
                    type: 'TUnitOfMeasureList',
                    fields: {
                        ID: parseInt(uomID),
                        UOMName: uomName,
                        UnitDescription: uomDescription,
                        ProductName: uomProduct,
                        Multiplier: parseFloat(uomMultiplier) || 0,
                        PurchasesDefault: isPurchasedefault,
                        SalesDefault: isSalesdefault,
                        Weight: parseFloat(uomWeight) || 0,
                        NoOfBoxes: parseFloat(uomNonOfBoxes) || 0,
                        Height: parseFloat(uomHeight) || 0,
                        Length: parseFloat(uomLength) || 0,
                        Width: parseFloat(uomWidth) || 0,
                        Volume: parseFloat(uomVolume) || 0,
                        Active: true,
                    },
                };

                taxRateService
                    .saveUOM(objDetails)
                    .then(function (objDetails) {
                        sideBarService.getUOMVS1().then(function (dataReload) {
                            addVS1Data('TUnitOfMeasureList', JSON.stringify(dataReload))
                                .then(function (datareturn) {
                                    Meteor._reload.reload();
                                })
                                .catch(function (err) {
                                    Meteor._reload.reload();
                                });
                        });
                    })
                    .catch(function (err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again',
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
});

Template.adduompop.helpers({
    record: ()=>{
        return Template.instance().record.get();
    }
});
