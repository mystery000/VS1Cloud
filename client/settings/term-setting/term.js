import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.termsettings.onCreated(function(){
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

});

Template.termsettings.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];


$('#tblTermsList tbody').on( 'click', 'tr', function () {
var listData = $(this).closest('tr').attr('id');
var is7days = false;
var is30days = false;
var isEOM = false;
var isEOMPlus = false;
var isSalesDefault = false;
var isPurchaseDefault = false;
if(listData){
  $('#add-terms-title').text('Edit Term Settings');
  //$('#isformcreditcard').removeAttr('checked');
  if (listData !== '') {
    listData = Number(listData);
    //taxRateService.getOneTerms(listData).then(function (data) {

   var termsID = listData || '';
   var termsName = $(event.target).closest("tr").find(".colName").text() || '';
   var description = $(event.target).closest("tr").find(".colDescription").text() || '';
   var days =  $(event.target).closest("tr").find(".colIsDays").text() || 0;
   //let isDays = data.fields.IsDays || '';
   if($(event.target).closest("tr").find(".colIsEOM .chkBox").is(':checked')){
     isEOM = true;
   }

   if($(event.target).closest("tr").find(".colIsEOMPlus .chkBox").is(':checked')){
     isEOMPlus = true;
   }

   if($(event.target).closest("tr").find(".colCustomerDef .chkBox").is(':checked')){
     isSalesDefault = true;
   }

   if($(event.target).closest("tr").find(".colSupplierDef .chkBox").is(':checked')){
     isPurchaseDefault = true;
   }

   if(isEOM == true || isEOMPlus ==  true){
     isDays = false;
   }else{
     isDays = true;
   }


   $('#edtTermsID').val(termsID);
   $('#edtName').val(termsName);
   $('#edtName').prop('readonly', true);
   $('#edtDesc').val(description);
   $('#edtDays').val(days);


   // if((isDays == true) && (days == 7)){
   //   templateObject.include7Days.set(true);
   // }else{
   //   templateObject.include7Days.set(false);
   // }
   if((isDays == true) && (days == 0)){
     templateObject.includeCOD.set(true);
   }else{
     templateObject.includeCOD.set(false);
   }

   if((isDays == true) && (days == 30)){
     templateObject.include30Days.set(true);
   }else{
     templateObject.include30Days.set(false);
   }

   if(isEOM == true){
     templateObject.includeEOM.set(true);
   }else{
     templateObject.includeEOM.set(false);
   }

   if(isEOMPlus == true){
     templateObject.includeEOMPlus.set(true);
   }else{
     templateObject.includeEOMPlus.set(false);
   }


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

  //});


  $(this).closest('tr').attr('data-target', '#myModalTerms');
  $(this).closest('tr').attr('data-toggle', 'modal');

}

}

});
});


Template.termsettings.events({
    'click #btnNewInvoice':function(event){
        // FlowRouter.go('/invoicecard');
    },
  'click #exportbtn': function () {
    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#tblTermsList_wrapper .dt-buttons .btntabletoexcel').click();
     $('.fullScreenSpin').css('display','none');

  },
  "click .printConfirm": function (event) {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblTermsList_wrapper .dt-buttons .btntabletopdf").click();
    $(".fullScreenSpin").css("display", "none");
  },
  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display','inline-block');
    sideBarService.getTermsVS1().then(function(dataReload) {
            addVS1Data('TTermsVS1',JSON.stringify(dataReload)).then(function (datareturn) {
              location.reload(true);
            }).catch(function (err) {
              location.reload(true);
            });
          }).catch(function(err) {
          location.reload(true);
          });
  },
  'click .btnDeleteTerms': function () {
    playDeleteAudio();
    let taxRateService = new TaxRateService();
    setTimeout(function(){
    
    let termsId = $('#selectDeleteLineID').val();
    let objDetails = {
        type: "TTermsVS1",
        fields: {
            Id: parseInt(termsId),
            Active: false
        }
    };

    taxRateService.saveTerms(objDetails).then(function (objDetails) {
      sideBarService.getTermsVS1().then(function(dataReload) {
            addVS1Data('TTermsVS1',JSON.stringify(dataReload)).then(function (datareturn) {
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
  'click .btnSaveTerms': function () {
    playSaveAudio();
    let taxRateService = new TaxRateService();
    setTimeout(function(){
    $('.fullScreenSpin').css('display','inline-block');
    
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
    if(termdays.replace(/\s/g, '') != ""){
      isDays = true;
    }else{
      isDays = false;
    }

    if($('#isEOM').is(':checked')){
      isEOM = true;
    }else{
      isEOM = false;
    }

    if($('#isEOMPlus').is(':checked')){
      isEOMPlus = true;
    }else{
      isEOMPlus = false;
    }

    if($('#chkCustomerDef').is(':checked')){
      isSalesdefault = true;
    }else{
      isSalesdefault = false;
    }

    if($('#chkSupplierDef').is(':checked')){
      isPurchasedefault = true;
    }else{
      isPurchasedefault = false;
    }

    let objDetails = '';
    if (termsName === ''){
    $('.fullScreenSpin').css('display','none');
    Bert.alert('<strong>WARNING:</strong> Term Name cannot be blank!', 'warning');
    e.preventDefault();
    }

    if(termsID == ""){
      taxRateService.checkTermByName(termsName).then(function (data) {
        termsID = data.tterms[0].Id;
        objDetails = {
           type: "TTermsVS1",
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
               Days: termdays||0,
               PublishOnVS1:true
           }
       };

       taxRateService.saveTerms(objDetails).then(function (objDetails) {
         sideBarService.getTermsVS1().then(function(dataReload) {
            addVS1Data('TTermsVS1',JSON.stringify(dataReload)).then(function (datareturn) {
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
           type: "TTermsVS1",
           fields: {
               Active: true,
               TermsName: termsName,
               Description: description,
               IsDays: isDays,
               IsEOM: isEOM,
               IsEOMPlus: isEOMPlus,
               Days: termdays||0,
               PublishOnVS1:true
           }
       };

       taxRateService.saveTerms(objDetails).then(function (objDetails) {
         sideBarService.getTermsVS1().then(function(dataReload) {
            addVS1Data('TTermsVS1',JSON.stringify(dataReload)).then(function (datareturn) {
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
        type: "TTermsVS1",
        fields: {
            ID: parseInt(termsID),
            TermsName: termsName,
            Description: description,
            IsDays: isDays,
            IsEOM: isEOM,
            isPurchasedefault: isPurchasedefault,
            isSalesdefault: isSalesdefault,
            IsEOMPlus: isEOMPlus,
            Days: termdays||0,
            PublishOnVS1:true
        }
    };

    taxRateService.saveTerms(objDetails).then(function (objDetails) {
      sideBarService.getTermsVS1().then(function(dataReload) {
            addVS1Data('TTermsVS1',JSON.stringify(dataReload)).then(function (datareturn) {
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
  'click .btnAddTerms': function () {
    let templateObject = Template.instance();
      $('#add-terms-title').text('Add New Term');
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
  'click .btnBack':function(event){
    playCancelAudio();
    event.preventDefault();
    setTimeout(function(){
    history.back(1);
    }, delayTimeAfterSound);
  },
  'click .chkTerms':function(event){
    var $box =$(event.target);

 if ($box.is(":checked")) {
   var group = "input:checkbox[name='" + $box.attr("name") + "']";
   $(group).prop("checked", false);
   $box.prop("checked", true);
 } else {
   $box.prop("checked", false);
 }
  },
  'keydown #edtDays': function(event){
      if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
              // Allow: Ctrl+A, Command+A
             (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
              // Allow: home, end, left, right, down, up
             (event.keyCode >= 35 && event.keyCode <= 40)) {
                  // let it happen, don't do anything
                  return;
         }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode == 8 || event.keyCode == 9 ||
        event.keyCode == 37 || event.keyCode == 39 ||
        event.keyCode == 46 || event.keyCode == 190) {
        } else {
            event.preventDefault();
        }
    }


});

Template.termsettings.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get().sort(function(a, b){
       if (a.termname == 'NA') {
     return 1;
         }
     else if (b.termname == 'NA') {
       return -1;
     }
   return (a.termname.toUpperCase() > b.termname.toUpperCase()) ? 1 : -1;
   });
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblTermsList'});
},
deptrecords: () => {
    return Template.instance().deptrecords.get().sort(function(a, b){
      if (a.department == 'NA') {
    return 1;
        }
    else if (b.department == 'NA') {
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
}
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
