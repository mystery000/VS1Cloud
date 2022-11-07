import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();

Template.uomSettings.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.deptrecords = new ReactiveVar();

    templateObject.includeSalesDefault = new ReactiveVar();
    templateObject.includeSalesDefault.set(false);
    templateObject.includePurchaseDefault = new ReactiveVar();
    templateObject.includePurchaseDefault.set(false);
});

Template.uomSettings.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];


    $('#tblUOMList tbody').on( 'click', 'tr', function () {
    var listData = $(this).closest('tr').attr('id');

    var isSalesDefault = false;
    var isPurchaseDefault = false;
    if(listData){
      $('#add-uom-title').text('Edit UOM');
      //$('#isformcreditcard').removeAttr('checked');
      if (listData !== '') {
        listData = Number(listData);

       var uomID = listData || '';
       var uomName = $(event.target).closest("tr").find(".colUOMName").text() || '';
       var uomDescription = $(event.target).closest("tr").find(".colUOMDesc").text() || '';
       var uomProduct = $(event.target).closest("tr").find(".colUOMProduct").text() || '';
       var unitMultiplier =  $(event.target).closest("tr").find(".colUOMMultiplier").text() || 0;
       var uomWeight =  $(event.target).closest("tr").find(".colUOMWeight").text() || 0;
       var uomNoOfBoxes =  $(event.target).closest("tr").find(".colUOMNoOfBoxes").text() || 0;
       var uomLength =  $(event.target).closest("tr").find(".colUOMHeight").text() || 0;
       var uomWidth =  $(event.target).closest("tr").find(".colUOMWidth").text() || 0;
       var uomLength =  $(event.target).closest("tr").find(".colUOMLength").text() || 0;
       var uomVolume =  $(event.target).closest("tr").find(".colUOMVolume").text() || 0;

       if($(event.target).closest("tr").find(".colUOMSalesDefault .chkBox").is(':checked')){
         isSalesDefault = true;
       }
       if($(event.target).closest("tr").find(".colUOMPurchaseDefault .chkBox").is(':checked')){
         isPurchaseDefault = true;
       }

       $('#edtUOMID').val(uomID);
       $('#edtUnitName').val(uomName);
       $('#edtUnitName').prop('readonly', true);
       $('#txaUnitDescription').val(uomDescription);
       $('#sltProduct').val(uomProduct);
       $('#edtUnitMultiplier').val(unitMultiplier);
       $('#edtUnitWeight').val(uomWeight);
       $('#edtNoOfBoxes').val(uomNoOfBoxes);
       $('#edtHeight').val(uomNoOfBoxes);
       $('#edtWidth').val(uomNoOfBoxes);
       $('#edtLength').val(uomNoOfBoxes);
       $('#edtVolume').val(uomNoOfBoxes);

       if(isSalesDefault == true){
         templateObject.includeSalesDefault.set(true);
       }else{
         templateObject.includeSalesDefault.set(false);
       }

       if(isPurchaseDefault == true){
         templateObject.includePurchaseDefault.set(true);
       }else{
         templateObject.includePurchaseDefault.set(false);
       }

      $(this).closest('tr').attr('data-target', '#newUomModal');
      $(this).closest('tr').attr('data-toggle', 'modal');

    }

    }

    });

});

Template.uomSettings.events({
    'click #exportbtn': function () {
      $('.fullScreenSpin').css('display','inline-block');
      jQuery('#tblUOMList_wrapper .dt-buttons .btntabletoexcel').click();
       $('.fullScreenSpin').css('display','none');

    },
    "click .printConfirm": function (event) {
      $(".fullScreenSpin").css("display", "inline-block");
      jQuery("#tblUOMList_wrapper .dt-buttons .btntabletopdf").click();
      $(".fullScreenSpin").css("display", "none");
    },
    'click .btnRefresh': function () {
      $('.fullScreenSpin').css('display','inline-block');
      sideBarService.getUOMDataList().then(function(dataReload) {
              addVS1Data('TUnitOfMeasure',JSON.stringify(dataReload)).then(function (datareturn) {
                location.reload(true);
              }).catch(function (err) {
                location.reload(true);
              });
            }).catch(function(err) {
            location.reload(true);
            });
    },
    'click .btnDeleteUOM': function () {
      playDeleteAudio();
      setTimeout(function(){
      let taxRateService = new TaxRateService();
      let uomId = $('#selectDeleteLineID').val();


      let objDetails = {
          type: "TUnitOfMeasure",
          fields: {
              Id: parseInt(uomId),
              Active: false
          }
      };

      taxRateService.saveUOM(objDetails).then(function (objDetails) {
        sideBarService.getUOMDataList().then(function(dataReload) {
              addVS1Data('TUOMVS1',JSON.stringify(dataReload)).then(function (datareturn) {
                Meteor._reload.reload();
              }).catch(function (err) {
                Meteor._reload.reload();
              });
            }).catch(function(err) {
              Meteor._reload.reload();
            });
      }).catch(function (err) {
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
          $('.fullScreenSpin').css('display','none');
      });
    }, delayTimeAfterSound);
    },
    'click .btnSaveUOM': function () {
      playSaveAudio();
      setTimeout(function(){
      $('.fullScreenSpin').css('display','inline-block');
      let taxRateService = new TaxRateService();
      let uomID = $('#edtUOMID').val();
      let uomName = $('#edtUnitName').val();
      let uomDescription = $('#txaUnitDescription').val();
      let uomProduct = $('#sltProduct').val();
      let uomMultiplier = $('#edtUnitMultiplier').val();
      let uomWeight = $('#edtUnitWeight').val();
      let uomNonOfBoxes = $('#edtNoOfBoxes').val();
      let uomHeight = $('#edtHeight').val();
      let uomWidth = $('#edtWidth').val();
      let uomLength = $('#edtLength').val();
      let uomVolume = $('#edtVolume').val();

      let isSalesdefault = false;
      let isPurchasedefault = false;

      if($('#swtSalesDefault').is(':checked')){
        isSalesdefault = true;
      }else{
        isSalesdefault = false;
      }

      if($('#swtPurchaseDefault').is(':checked')){
        isPurchasedefault = true;
      }else{
        isPurchasedefault = false;
      }

      let objDetails = '';
      if (uomName === ''){
      $('.fullScreenSpin').css('display','none');
      Bert.alert('<strong>WARNING:</strong> Unit Name cannot be blank!', 'warning');
      e.preventDefault();
      }

      if(uomID == ""){
        taxRateService.checkTermByName(uomName).then(function (data) {
          uomID = data.tunitofmeasure[0].Id;
          objDetails = {
             type: "TUnitOfMeasure",
             fields: {
                 ID: parseInt(uomID),
                 Active: true,
                 UOMName: uomName,
                 UnitDescription: uomDescription,
                 ProductName: uomProduct,
                 UnitMultiplier: uomMultiplier||0,
                 PurchasesDefault: isPurchasedefault,
                 Salesdefault: isSalesdefault,
                 UOMWeight: uomWeight||0,
                 NoOfBoxes: uomNonOfBoxes||0,
                 Height: uomHeight||0,
                 Length: uomLength||0,
                 Width: uomWidth||0,
                 Volume: uomVolume||0,
                 PublishOnVS1:true
             }
         };

         taxRateService.saveUOM(objDetails).then(function (objDetails) {
           sideBarService.getUOMVS1().then(function(dataReload) {
              addVS1Data('TUnitOfMeasure',JSON.stringify(dataReload)).then(function (datareturn) {
                Meteor._reload.reload();
              }).catch(function (err) {
                Meteor._reload.reload();
              });
            }).catch(function(err) {
              Meteor._reload.reload();
            });
         }).catch(function (err) {
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
             $('.fullScreenSpin').css('display','none');
         });
        }).catch(function (err) {
          objDetails = {
             type: "TUnitOfMeasure",
             fields: {
                 Active: true,
                 UOMName: uomName,
                 UnitDescription: uomDescription,
                 ProductName: uomProduct,
                 UnitMultiplier: uomMultiplier||0,
                 PurchasesDefault: isPurchasedefault,
                 Salesdefault: isSalesdefault,
                 UOMWeight: uomWeight||0,
                 NoOfBoxes: uomNonOfBoxes||0,
                 Height: uomHeight||0,
                 Length: uomLength||0,
                 Width: uomWidth||0,
                 Volume: uomVolume||0,
                 PublishOnVS1:true
             }
         };

         taxRateService.saveUOM(objDetails).then(function (objDetails) {
           sideBarService.getUOMVS1().then(function(dataReload) {
              addVS1Data('TUnitOfMeasure',JSON.stringify(dataReload)).then(function (datareturn) {
                Meteor._reload.reload();
              }).catch(function (err) {
                Meteor._reload.reload();
              });
            }).catch(function(err) {
              Meteor._reload.reload();
            });
         }).catch(function (err) {
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
             $('.fullScreenSpin').css('display','none');
         });
        });

     }else{
       objDetails = {
          type: "TUnitOfMeasure",
          fields: {
              ID: parseInt(uomID),
              UOMName: uomName,
              UnitDescription: uomDescription,
              ProductName: uomProduct,
              UnitMultiplier: uomMultiplier||0,
              PurchasesDefault: isPurchasedefault,
              Salesdefault: isSalesdefault,
              UOMWeight: uomWeight||0,
              NoOfBoxes: uomNonOfBoxes||0,
              Height: uomHeight||0,
              Length: uomLength||0,
              Width: uomWidth||0,
              Volume: uomVolume||0,
              PublishOnVS1:true
          }
      };

      taxRateService.saveUOM(objDetails).then(function (objDetails) {
        sideBarService.getUOMVS1().then(function(dataReload) {
              addVS1Data('TUnitOfMeasure1',JSON.stringify(dataReload)).then(function (datareturn) {
                Meteor._reload.reload();
              }).catch(function (err) {
                Meteor._reload.reload();
              });
            }).catch(function(err) {
              Meteor._reload.reload();
            });
      }).catch(function (err) {
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
          $('.fullScreenSpin').css('display','none');
      });
     }
    }, delayTimeAfterSound);
    },
    'click .btnAddUOM': function () {
      let templateObject = Template.instance();
        $('#add-uom-title').text('Add New UOM');
        $('#edtUOMID').val('');
        $('#edtUnitName').val('');
        $('#edtUnitName').prop('readonly', false);
        $('#txaUnitDescription').val('');
        $('#sltProduct').val('');
        $('#edtUnitMultiplier').val('');
        $('#swtSalesDefault').val('');
        $('#swtPurchaseDefault').val('');
        $('#edtUnitWeight').val('');
        $('#edtNoOfBoxes').val('');
        $('#edtHeight').val('');
        $('#edtWidth').val('');
        $('#edtLength').val('');
        $('#edtVolume').val('');

        templateObject.includePurchaseDefault.set(false);
        templateObject.includeSalesDefault.set(false);
    },
    'click .btnBack':function(event){
      playCancelAudio();
      event.preventDefault();
      setTimeout(function(){
      history.back(1);
      }, delayTimeAfterSound);
    }
});

Template.uomSettings.helpers({
    datatablerecords : () => {
       return Template.instance().datatablerecords.get().sort(function(a, b){
         if (a.uomname == 'NA') {
       return 1;
           }
       else if (b.uomname == 'NA') {
         return -1;
       }
     return (a.uomname.toUpperCase() > b.uomname.toUpperCase()) ? 1 : -1;
     });
    },
    tableheaderrecords: () => {
       return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblUOMList'});
    },
    includeSalesDefault: () => {
      return Template.instance().includeSalesDefault.get();
    },
    includePurchaseDefault: () => {
      return Template.instance().includePurchaseDefault.get();
    },
    loggedCompany: () => {
    return localStorage.getItem('mySession') || '';
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
