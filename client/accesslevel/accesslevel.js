import {AccessLevelService} from '../js/accesslevel-service';
import {EmployeeProfileService} from '../js/profile-service';
import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
import '../lib/global/erp-objects';
import {UtilityService} from "../utility-service";
import {AccountService} from "../accounts/account-service";
const _ = require('lodash');
let addNewEmployeesList = [];

Template.accesslevel.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar();
  templateObject.recordsaccess = new ReactiveVar();
  templateObject.accesslevelrecord = new ReactiveVar({});
  templateObject.erpAccessLevelRecord = new ReactiveVar({});
  templateObject.employeename = new ReactiveVar();
  templateObject.employeerecords = new ReactiveVar([]);
  templateObject.newEmployeeID = new ReactiveVar();
  templateObject.employeeID = new ReactiveVar();
  templateObject.employeeformID = new ReactiveVar();
  templateObject.employeeformaccessrecord = new ReactiveVar({});
  templateObject.accessgrouprecord = new ReactiveVar({});

});

Template.accesslevel.onRendered(function(){
  const templateObject = Template.instance();

  templateObject.upgradeCompanyAsppSettings = function () {
    var erpGet = erpDb();

    let objDetailsUser = {
        Name: "VS1_AddModules",
        Params: {
          CloudUserName: erpGet.ERPUsername,
          CloudPassword: erpGet.ERPPassword,
          Paymentamount:900,
          PayMethod:"Cash",
          LicenseLevel:3,
          ExtraModules:[
           {ModuleName:"Payroll Integration"},
           {ModuleName:"Shipping"}
           ]
      }
    };


    var oPost = new XMLHttpRequest();
    oPost.open("POST",URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_AddModules"', true);
    oPost.setRequestHeader("database",vs1loggedDatatbase);
    oPost.setRequestHeader("username",'VS1_Cloud_Admin');
    oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
    oPost.setRequestHeader("Accept", "application/json");
    oPost.setRequestHeader("Accept", "application/html");
    oPost.setRequestHeader("Content-type", "application/json");
    var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsUser);

     oPost.send(myString);

oPost.onreadystatechange = function() {
if(oPost.readyState == 4 && oPost.status == 200) {

      $('.fullScreenSpin').css('display','none');
      var myArrResponse = JSON.parse(oPost.responseText);
      if(myArrResponse.ProcessLog.Error){
        swal('Oooops...', myArrResponse.ProcessLog.Error, 'error');
      }else{
        swal({
        title: 'License Successfully Changed',
        text: "Please log out to activate your changes.",
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
        }).then((result) => {
        if (result.value) {
           window.open('/','_self');
        } else if (result.dismiss === 'cancel') {

        }
        });

      }

  }else if(oPost.readyState == 4 && oPost.status == 403){
$('.fullScreenSpin').css('display','none');
swal({
title: 'Oooops...',
text: oPost.getResponseHeader('errormessage'),
type: 'error',
showCancelButton: false,
confirmButtonText: 'Try Again'
}).then((result) => {
if (result.value) {

} else if (result.dismiss === 'cancel') {

}
});
  }else if(oPost.readyState == 4 && oPost.status == 406){
    $('.fullScreenSpin').css('display','none');
    var ErrorResponse = oPost.getResponseHeader('errormessage');
    var segError = ErrorResponse.split(':');

  if((segError[1]) == ' "Unable to lock object'){

    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }else{

    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }

}else if(oPost.readyState == '') {
  $('.fullScreenSpin').css('display','none');

  swal('Connection Failed', oPost.getResponseHeader('errormessage') +' Please try again!', 'error');
}
}
  };


  });

  Template.registerHelper('equals', function (a, b) {
      return a === b;
  });
  Template.registerHelper('notEquals', function (a, b) {
      return a != b;
  });
  Template.accesslevel.helpers({
      records: () => {
          return Template.instance().records.get();
      },
      recordsaccess: () => {
          return Template.instance().recordsaccess.get();
      },
      accesslevelrecord: () => {
          return Template.instance().accesslevelrecord.get().sort(function (a, b) {
            if (a.description.toLowerCase() == 'NA') {
              return 1;
            }
            else if (b.description.toLowerCase() == 'NA') {
              return -1;
            }
            return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
          });
      },
      erpAccessLevelRecord: () => {
          return Template.instance().erpAccessLevelRecord.get().sort(function (a, b) {
            if (a.description.toLowerCase() == 'NA') {
              return 1;
            }
            else if (b.description.toLowerCase() == 'NA') {
              return -1;
            }
            return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
          });
      },
      employeeID: () => {
          return Template.instance().employeeID.get();
      },
      employeename: () => {
          return Template.instance().employeename.get();
      },
      employeeformaccessrecord: () => {
          return Template.instance().employeeformaccessrecord.get();
      },
      isAccountsLicence: () => {
          return localStorage.getItem('CloudAccountsLicence');
      },
      employeerecords: () => {
          return Template.instance().employeerecords.get().sort(function(a, b){
            if (a.employeename == 'NA') {
          return 1;
              }
          else if (b.employeename == 'NA') {
            return -1;
          }
        return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
      },
    accessgrouprecord: () => {
        return Template.instance().accessgrouprecord.get();
      }
  });

  Template.registerHelper('arrayify',function(obj){
      var result = [];
      for (var key in obj) result.push({name:key,value:obj[key]});
      return result.sort(function(a, b){
        if (a.name == 'NA') {
      return 1;
          }
      else if (b.name == 'NA') {
        return -1;
      }
    return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1;
    });
  });

Template.accesslevel.events({
  'click .employee-img': function (event) {
      let templateObject = Template.instance();
      let tempInstance = Template.instance();
      templateObject.$("#STEmployeeName").trigger("focus");


  },
  'change #sltEmploy22222eeName': function (event) {
      let templateObject = Template.instance();
      let employeeName = $(event.target).val();
      let employeeID = $('option:selected', event.target).attr('mytag');


      if(employeeID){
       templateObject.accessgrouprecord.set('');
       templateObject.getTableData(employeeID);

     }


  },
  'click .inactiveLicence': function (event) {

    var targetID = '';
    var $cell= $(event.target).closest('td');
    var targetID = $(event.target).closest('tr').attr('id');


let isFixedAssetsLicence = localStorage.getItem('CloudFixedAssetsLicence');
let isInventoryLicence = localStorage.getItem('CloudInventoryLicence');
let isManufacturingLicence = localStorage.getItem('CloudManufacturingLicence');
let isPurchasesLicence = localStorage.getItem('CloudPurchasesLicence');
let isSalesLicence = localStorage.getItem('CloudSalesLicence');
let isShippingLicence = localStorage.getItem('CloudShippingLicence');
let isStockTakeLicence = localStorage.getItem('CloudStockTakeLicence');
let isStockTransferLicence = localStorage.getItem('CloudStockTransferLicence');
let isMainLicence = localStorage.getItem('CloudMainLicence');
let isDashboardLicence = localStorage.getItem('CloudDashboardLicence');


let isAccountsLicence = localStorage.getItem('CloudAccountsLicence');
let isContactsLicence = localStorage.getItem('CloudContactsLicence');
let isExpenseClaimsLicence = localStorage.getItem('CloudExpenseClaimsLicence');
let isPaymentsLicence = localStorage.getItem('CloudPaymentsLicence');
let isReportsLicence = localStorage.getItem('CloudReportsLicence');
let isSettingsLicence = localStorage.getItem('CloudSettingsLicence');





      let accessDesc = $("#"+targetID+"_accessDesc").val();
      $('.upgModule').html(accessDesc);
      $('#upgradeModal').modal('toggle');


  },
  'click #tblAccessLevel tbody tr td': function (event) {


    var targetID = '';
    var $cell= $(event.target).closest('td');

    if($cell.index() != 0){
      if((event.target.name !== '') && (event.target.name !== undefined)){
         targetID = event.target.name;







         if($cell.index() == 1){
           $("."+targetID+"_noaccess").css('opacity','1');
           $("."+targetID+"_readonly").css('opacity','1');
           $("."+targetID+"_createandread").css('opacity','1');
           $("."+targetID+"_fullwithoutdelete").css('opacity','1');
           $("."+targetID+"_fullwithdelete").css('opacity','1');
         }else if($cell.index() == 2){
           $("."+targetID+"_noaccess").css('opacity','0');
           $("."+targetID+"_readonly").css('opacity','1');
           $("."+targetID+"_createandread").css('opacity','1');
           $("."+targetID+"_fullwithoutdelete").css('opacity','1');
           $("."+targetID+"_fullwithdelete").css('opacity','1');
         }

      }

    }

  }
  });

  Template.accesslevel.events({
     'click #refreshpagelist': function(event){
       $('.fullScreenSpin').css('display','inline-block');
       localStorage.setItem('VS1TERPFormList', '');
         Meteor._reload.reload();
         let templateObject = Template.instance();
          let loggedEmpID = localStorage.getItem('mySessionEmployeeLoggedID');
          if((loggedEmpID) && (loggedEmpID !== null)){
            setTimeout(function () {
              localStorage.setItem('VS1AccessLevelList', '');
              templateObject.getTableData();
            },1000);
            templateObject.employeeID.set(loggedEmpID);
          }else{
            $('.fullScreenSpin').css('display','none');
          }
     },
     'click .btnRefresh': function () {
       Meteor._reload.reload();
     },
     'click .chkSettings': function (event) {

       if($(event.target).is(':checked')){
         $(event.target).val(1);
       }else{
         $(event.target).val(6);
       }
     },
     'click .chkSettings.chkInventory': function (event) {

       if($(event.target).is(':checked')){

         swal('PLEASE NOTE', 'If Inventory tracking is turned on it cannot be disabled in the future.', 'info');
       }else{

       }
     },
     'click .btnGlobalSaveNOT': function () {
      playSaveAudio();
      let templateObject = Template.instance();
      let accesslevelService = new AccessLevelService();
      setTimeout(function(){
        var erpGet = erpDb();

       let empInputValue = templateObject.$("#sltEmployeeName").val();

       if(empInputValue === "All"){

       }else{

       let employeeID = $("#sltEmployeeName").find('option:selected').attr('mytag');


       var loggedEmpName = localStorage.getItem('mySession');
       let empLoggedID = localStorage.getItem('mySessionEmployeeLoggedID');
       let isSidePanelID = '';
       let isTopPanelID = '';


       let isFixedAssetsLicence = localStorage.getItem('CloudFixedAssetsLicence');
       let isInventoryLicence = localStorage.getItem('CloudInventoryLicence');
       let isManufacturingLicence = localStorage.getItem('CloudManufacturingLicence');
       let isPurchasesLicence = localStorage.getItem('CloudPurchasesLicence');
       let isSalesLicence = localStorage.getItem('CloudSalesLicence');
       let isShippingLicence = localStorage.getItem('CloudShippingLicence');
       let isStockTakeLicence = localStorage.getItem('CloudStockTakeLicence');
       let isStockTransferLicence = localStorage.getItem('CloudStockTransferLicence');
       let isMainLicence = localStorage.getItem('CloudMainLicence');
       let isDashboardLicence = localStorage.getItem('CloudDashboardLicence');


       let isAccountsLicence = localStorage.getItem('CloudAccountsLicence');
       let isContactsLicence = localStorage.getItem('CloudContactsLicence');
       let isExpenseClaimsLicence = localStorage.getItem('CloudExpenseClaimsLicence');
       let isPaymentsLicence = localStorage.getItem('CloudPaymentsLicence');
       let isReportsLicence = localStorage.getItem('CloudReportsLicence');
       let isSettingsLicence = localStorage.getItem('CloudSettingsLicence');



       if(employeeID){
         $('.fullScreenSpin').css('display','inline-block');
           $('.tblAccessLevel > tbody > tr').each(function(){
             var $tblrow = $(this);
             var lineID = this.id;

             var radioValue = $("input:checkbox[name='"+lineID+"']").val();
             var radioValueCheck = $("input[name='"+lineID+"']:checked").val();
             let accessDesc = $("#"+lineID+"_accessDesc").val();
             let accessInitialValue = $("#"+lineID+"_accessInit").val();
             if(radioValue != accessInitialValue){
               if(radioValue){
                 var tableID = $(this).attr('name');
                 let data = {
                    type: "TEmployeeFormAccess",
                    fields: {
                    ID : tableID,
                    EmployeeId : employeeID,
                    AccessLevel : radioValue,
                    FormId:this.id
                   }
                };
                accesslevelService.saveEmpAccess(data).then(function (data) {
                  if((employeeID == empLoggedID) ){
                  if((radioValue == 1) && (accessDesc == "Print Delivery Docket")){
                    isDocket = true;
                    localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
                  }else if((radioValue != 1) && (accessDesc == "Print Delivery Docket")){
                    isDocket = false;
                    localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
                  }

                  if((radioValue == 1) && (accessDesc == "Print Invoice")){
                    isInvoice = true;
                    localStorage.setItem('CloudPrintInvoice', isInvoice);
                  }else if((radioValue != 1) && (accessDesc == "Print Invoice")){
                    isInvoice = false;
                    localStorage.setItem('CloudPrintInvoice', isInvoice);
                  }

                  if((radioValue == 1) && (accessDesc == "User Password Details")){
                    isUserPassDetail = true;
                    localStorage.setItem('CloudUserPass', isUserPassDetail);
                  }else if((radioValue != 1) && (accessDesc == "User Password Details")){
                    isUserPassDetail = false;
                    localStorage.setItem('CloudUserPass', isUserPassDetail);
                  }

                  if((radioValue == 1) && (accessDesc == "View Dockets")){
                    isViewDockets = true;
                    localStorage.setItem('CloudViewDockets', isViewDockets);
                  }else if((radioValue != 1) && (accessDesc == "View Dockets")){
                    isViewDockets = false;
                    localStorage.setItem('CloudViewDockets', isViewDockets);
                  }


                  if((radioValue == 1) && (accessDesc == "Qty Only on Purchase Order")){
                    isPurchaseQtyOnly = true;
                    localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                  }else if((radioValue != 1) && (accessDesc == "Qty Only on Purchase Order")){
                    isPurchaseQtyOnly = false;
                    localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                  }

                  if((radioValue == 1) && (accessDesc == "Qty Only on Sales")){
                    isSalesQtyOnly = true;
                    localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
                  }else if((radioValue != 1) && (accessDesc == "Qty Only on Sales")){
                    isSalesQtyOnly = false;
                    localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
                  }

                  if((radioValue == 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                    isDashboard = true;
                    localStorage.setItem('CloudDashboardModule', isDashboard);
                  }else if((radioValue != 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                    isDashboard = false;
                    localStorage.setItem('CloudDashboardModule', isDashboard);
                  }


                  if((radioValue == 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                    isInventory = true;
                    localStorage.setItem('CloudInventoryModule', isInventory);
                  }else if((radioValue != 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                    isInventory = false;
                    localStorage.setItem('CloudInventoryModule', isInventory);
                  }

                  if((radioValue == 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                    isManufacturing = true;
                    localStorage.setItem('CloudManufacturingModule', isManufacturing);
                  }else if((radioValue != 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                    isManufacturing = false;
                    localStorage.setItem('CloudManufacturingModule', isManufacturing);
                  }

                  if((radioValue == 1) && (accessDesc == "Settings")){
                    isAccessLevels = true;
                    localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
                  }else if((radioValue != 1) && (accessDesc == "Settings")){
                    isAccessLevels = false;
                    localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
                  }

                  if((radioValue == 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                    isShipping = true;
                    localStorage.setItem('CloudShippingModule', isShipping);
                  }else if((radioValue != 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                    isShipping = false;
                    localStorage.setItem('CloudShippingModule', isShipping);
                  }

                  if((radioValue == 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                    isStockTransfer = true;
                    localStorage.setItem('CloudStockTransferModule', isStockTransfer);
                  }else if((radioValue != 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                    isStockTransfer = false;
                    localStorage.setItem('CloudStockTransferModule', isStockTransfer);
                  }

                  if((radioValue == 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                    isStockTake = true;
                    localStorage.setItem('CloudStockTakeModule', isStockTake);
                  }else if((radioValue != 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                    isStockTake = false;
                    localStorage.setItem('CloudStockTakeModule', isStockTake);
                  }
                  if((radioValue == 1) && (accessDesc == "Sales") && (isSalesLicence)){
                    isSales = true;
                    localStorage.setItem('CloudSalesModule', isSales);
                  }else if((radioValue != 1) && (accessDesc == "Sales") && (isSalesLicence)){
                    isSales = false;
                    localStorage.setItem('CloudSalesModule', isSales);
                  }
                  if((radioValue == 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                    isPurchases = true;
                    localStorage.setItem('CloudPurchasesModule', isPurchases);
                  }else if((radioValue != 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                    isPurchases = false;
                    localStorage.setItem('CloudPurchasesModule', isPurchases);
                  }
                  if((radioValue == 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                    isExpenseClaims = true;
                    localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
                  }else if((radioValue != 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                    isExpenseClaims = false;
                    localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
                  }
                  if((radioValue == 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                    isFixedAssets = true;
                    localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);
                  }else if((radioValue != 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                    isFixedAssets = false;
                    localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);
                  }
                  if((radioValue == 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                    isPayments = true;
                    localStorage.setItem('CloudPaymentsModule', isPayments);
                  }else if((radioValue != 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                    isPayments = false;
                    localStorage.setItem('CloudPaymentsModule', isPayments);
                  }
                  if((radioValue == 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                    isContacts = true;
                    localStorage.setItem('CloudContactsModule', isContacts);
                  }else if((radioValue != 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                    isContacts = false;
                    localStorage.setItem('CloudContactsModule', isContacts);
                  }
                  if((radioValue == 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                    isAccounts = true;
                    localStorage.setItem('CloudAccountsModule', isAccounts);
                  }else if((radioValue != 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                    isAccounts = false;
                    localStorage.setItem('CloudAccountsModule', isAccounts);
                  }
                  if((radioValue == 1) && (accessDesc == "Reports") && (isReportsLicence)){
                    isReports = true;
                    localStorage.setItem('CloudReportsModule', isReports);
                  }else if((radioValue != 1) && (accessDesc == "Reports") && (isReportsLicence)){
                    isReports = false;
                    localStorage.setItem('CloudReportsModule', isReports);
                  }
                  if((radioValue == 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                    isSettings = true;
                    localStorage.setItem('CloudSettingsModule', isSettings);
                  }else if((radioValue != 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                    isSettings = false;
                    localStorage.setItem('CloudSettingsModule', isSettings);
                  }

                  }
                }).catch(function (err) {

                    swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {

                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                    $('.fullScreenSpin').css('display','none');
                });

               }else{
                  let data = {
                      type: "TEmployeeFormAccess",
                      fields: {
                      EmployeeId : employeeID,
                      AccessLevel : radioValue,
                      FormId:this.id
                     }
                  };
                  accesslevelService.saveEmpAccess(data).then(function (data) {
                    if((employeeID == empLoggedID)){
                    if((radioValue == 1) && (accessDesc == "Print Delivery Docket")){
                      isDocket = true;
                      localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
                    }else if((radioValue != 1) && (accessDesc == "Print Delivery Docket")){
                      isDocket = false;
                      localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
                    }

                    if((radioValue == 1) && (accessDesc == "Print Invoice")){
                      isInvoice = true;
                      localStorage.setItem('CloudPrintInvoice', isInvoice);
                    }else if((radioValue != 1) && (accessDesc == "Print Invoice")){
                      isInvoice = false;
                      localStorage.setItem('CloudPrintInvoice', isInvoice);
                    }

                    if((radioValue == 1) && (accessDesc == "User Password Details")){
                      isUserPassDetail = true;
                      localStorage.setItem('CloudUserPass', isUserPassDetail);
                    }else if((radioValue != 1) && (accessDesc == "User Password Details")){
                      isUserPassDetail = false;
                      localStorage.setItem('CloudUserPass', isUserPassDetail);
                    }

                    if((radioValue == 1) && (accessDesc == "View Dockets")){
                      isViewDockets = true;
                      localStorage.setItem('CloudViewDockets', isViewDockets);
                    }else if((radioValue != 1) && (accessDesc == "View Dockets")){
                      isViewDockets = false;
                      localStorage.setItem('CloudViewDockets', isViewDockets);
                    }

                    if((radioValue == 1) && (accessDesc == "Qty Only on Purchase Order")){
                      isPurchaseQtyOnly = true;
                      localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                    }else if((radioValue != 1) && (accessDesc == "Qty Only on Purchase Order")){
                      isPurchaseQtyOnly = false;
                      localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                    }

                    if((radioValue == 1) && (accessDesc == "Qty Only on Sales")){
                      isSalesQtyOnly = true;
                      localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
                    }else if((radioValue != 1) && (accessDesc == "Qty Only on Sales")){
                      isSalesQtyOnly = false;
                      localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
                    }

                    if((radioValue == 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                      isDashboard = true;
                      localStorage.setItem('CloudDashboardModule', isDashboard);
                    }else if((radioValue != 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                      isDashboard = false;
                      localStorage.setItem('CloudDashboardModule', isDashboard);
                    }

                    if((radioValue == 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                      isInventory = true;
                      localStorage.setItem('CloudInventoryModule', isInventory);
                    }else if((radioValue != 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                      isInventory = false;
                      localStorage.setItem('CloudInventoryModule', isInventory);
                    }

                    if((radioValue == 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                      isManufacturing = true;
                      localStorage.setItem('CloudManufacturingModule', isManufacturing);
                    }else if((radioValue != 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                      isManufacturing = false;
                      localStorage.setItem('CloudManufacturingModule', isManufacturing);
                    }

                    if((radioValue == 1) && (accessDesc == "Settings")){
                      isAccessLevels = true;
                      localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
                    }else if((radioValue != 1) && (accessDesc == "Settings")){
                      isAccessLevels = false;
                      localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
                    }

                    if((radioValue == 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                      isShipping = true;
                      localStorage.setItem('CloudShippingModule', isShipping);
                    }else if((radioValue != 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                      isShipping = false;
                      localStorage.setItem('CloudShippingModule', isShipping);
                    }

                    if((radioValue == 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                      isStockTransfer = true;
                      localStorage.setItem('CloudStockTransferModule', isStockTransfer);
                    }else if((radioValue != 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                      isStockTransfer = false;
                      localStorage.setItem('CloudStockTransferModule', isStockTransfer);
                    }

                    if((radioValue == 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                      isStockTake = true;
                      localStorage.setItem('CloudStockTakeModule', isStockTake);
                    }else if((radioValue != 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                      isStockTake = false;
                      localStorage.setItem('CloudStockTakeModule', isStockTake);
                    }
                    if((radioValue == 1) && (accessDesc == "Sales") && (isSalesLicence)){
                      isSales = true;
                      localStorage.setItem('CloudSalesModule', isSales);
                    }else if((radioValue != 1) && (accessDesc == "Sales") && (isSalesLicence)){
                      isSales = false;
                      localStorage.setItem('CloudSalesModule', isSales);
                    }
                    if((radioValue == 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                      isPurchases = true;
                      localStorage.setItem('CloudPurchasesModule', isPurchases);
                    }else if((radioValue != 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                      isPurchases = false;
                      localStorage.setItem('CloudPurchasesModule', isPurchases);
                    }
                    if((radioValue == 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                      isExpenseClaims = true;
                      localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
                    }else if((radioValue != 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                      isExpenseClaims = false;
                      localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
                    }
                    if((radioValue == 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                      isFixedAssets = true;
                      localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);
                    }else if((radioValue != 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                      isFixedAssets = false;
                      localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);
                    }
                    if((radioValue == 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                      isPayments = true;
                      localStorage.setItem('CloudPaymentsModule', isPayments);
                    }else if((radioValue != 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                      isPayments = false;
                      localStorage.setItem('CloudPaymentsModule', isPayments);
                    }
                    if((radioValue == 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                      isContacts = true;
                      localStorage.setItem('CloudContactsModule', isContacts);
                    }else if((radioValue != 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                      isContacts = false;
                      localStorage.setItem('CloudContactsModule', isContacts);
                    }
                    if((radioValue == 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                      isAccounts = true;
                      localStorage.setItem('CloudAccountsModule', isAccounts);
                    }else if((radioValue != 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                      isAccounts = false;
                      localStorage.setItem('CloudAccountsModule', isAccounts);
                    }
                    if((radioValue == 1) && (accessDesc == "Reports") && (isReportsLicence)){
                      isReports = true;
                      localStorage.setItem('CloudReportsModule', isReports);
                    }else if((radioValue != 1) && (accessDesc == "Reports") && (isReportsLicence)){
                      isReports = false;
                      localStorage.setItem('CloudReportsModule', isReports);
                    }
                    if((radioValue == 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                      isSettings = true;
                      localStorage.setItem('CloudSettingsModule', isSettings);
                    }else if((radioValue != 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                      isSettings = false;
                      localStorage.setItem('CloudSettingsModule', isSettings);
                    }
                    }
                  }).catch(function (err) {

                      swal({
                      title: 'Oooops...',
                      text: err,
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonText: 'Try Again'
                      }).then((result) => {
                      if (result.value) {

                      } else if (result.dismiss === 'cancel') {

                      }
                    });
                      $('.fullScreenSpin').css('display','none');
                  });
                }
             }

          });
       }

       setTimeout(function () {

           $('.fullScreenSpin').css('display','none');
       }, 5000);

     }
    }, delayTimeAfterSound);
    },
   'click .btnTopGlobalSave': function () {
    playSaveAudio();
    setTimeout(function(){
     swal({
       title: 'Do you want to save both VS1 and Employee Modules?',
       text: 'Yes to Save Both and No to Save only the VS1 Modules.',
       type: 'question',
       showCancelButton: true,
       confirmButtonText: 'Yes',
       cancelButtonText: 'No'
     }).then((result) => {
       if (result.value) {
         $(".btnGlobalSave").trigger("click");
       } else if (result.dismiss === 'cancel') {

        }
     });
    }, delayTimeAfterSound);
 },
     'click .btnSaveAccess': function () {
      playSaveAudio();
      let templateObject = Template.instance();
      let accesslevelService = new AccessLevelService();
      setTimeout(function(){
       let empInputValue = templateObject.$("#sltEmployeeName").val();


       let employeeID = $("#sltEmployeeName").find('option:selected').attr('mytag');


       var loggedEmpName = localStorage.getItem('mySession');
       let empLoggedID = localStorage.getItem('mySessionEmployeeLoggedID');
       let isSidePanelID = '';
       let isTopPanelID = '';


       let isFixedAssetsLicence = localStorage.getItem('CloudFixedAssetsLicence');
       let isInventoryLicence = localStorage.getItem('CloudInventoryLicence');
       let isManufacturingLicence = localStorage.getItem('CloudManufacturingLicence');
       let isPurchasesLicence = localStorage.getItem('CloudPurchasesLicence');
       let isSalesLicence = localStorage.getItem('CloudSalesLicence');
       let isShippingLicence = localStorage.getItem('CloudShippingLicence');
       let isStockTakeLicence = localStorage.getItem('CloudStockTakeLicence');
       let isStockTransferLicence = localStorage.getItem('CloudStockTransferLicence');
       let isMainLicence = localStorage.getItem('CloudMainLicence');
       let isDashboardLicence = localStorage.getItem('CloudDashboardLicence');


       let isAccountsLicence = localStorage.getItem('CloudAccountsLicence');
       let isContactsLicence = localStorage.getItem('CloudContactsLicence');
       let isExpenseClaimsLicence = localStorage.getItem('CloudExpenseClaimsLicence');
       let isPaymentsLicence = localStorage.getItem('CloudPaymentsLicence');
       let isReportsLicence = localStorage.getItem('CloudReportsLicence');
       let isSettingsLicence = localStorage.getItem('CloudSettingsLicence');



       if(employeeID){
         $('.fullScreenSpin').css('display','inline-block');
           $('.tblAccessLevel > tbody > tr').each(function(){
             var $tblrow = $(this);
             var lineID = this.id;

             var radioValue = $("input:checkbox[name='"+lineID+"']").val();
             var radioValueCheck = $("input[name='"+lineID+"']:checked").val();
             let accessDesc = $("#"+lineID+"_accessDesc").val();
             let accessInitialValue = $("#"+lineID+"_accessInit").val();
             if(radioValue != accessInitialValue){
               if(radioValue){
                 var tableID = $(this).attr('name');
                 let data = {
                    type: "TEmployeeFormAccess",
                    fields: {
                    ID : tableID,
                    EmployeeId : employeeID,
                    AccessLevel : radioValue,
                    FormId:this.id
                   }
                };
                accesslevelService.saveEmpAccess(data).then(function (data) {
                  if((employeeID == empLoggedID) ){
                  if((radioValue == 1) && (accessDesc == "Print Delivery Docket")){
                    isDocket = true;
                    localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
                  }else if((radioValue != 1) && (accessDesc == "Print Delivery Docket")){
                    isDocket = false;
                    localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
                  }

                  if((radioValue == 1) && (accessDesc == "Print Invoice")){
                    isInvoice = true;
                    localStorage.setItem('CloudPrintInvoice', isInvoice);
                  }else if((radioValue != 1) && (accessDesc == "Print Invoice")){
                    isInvoice = false;
                    localStorage.setItem('CloudPrintInvoice', isInvoice);
                  }

                  if((radioValue == 1) && (accessDesc == "User Password Details")){
                    isUserPassDetail = true;
                    localStorage.setItem('CloudUserPass', isUserPassDetail);
                  }else if((radioValue != 1) && (accessDesc == "User Password Details")){
                    isUserPassDetail = false;
                    localStorage.setItem('CloudUserPass', isUserPassDetail);
                  }

                  if((radioValue == 1) && (accessDesc == "View Dockets")){
                    isViewDockets = true;
                    localStorage.setItem('CloudViewDockets', isViewDockets);
                  }else if((radioValue != 1) && (accessDesc == "View Dockets")){
                    isViewDockets = false;
                    localStorage.setItem('CloudViewDockets', isViewDockets);
                  }

                  if((radioValue == 1) && (accessDesc == "Qty Only on Purchase Order")){
                    isPurchaseQtyOnly = true;
                    localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                  }else if((radioValue != 1) && (accessDesc == "Qty Only on Purchase Order")){
                    isPurchaseQtyOnly = false;
                    localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                  }

                  if((radioValue == 1) && (accessDesc == "Qty Only on Sales")){
                    isSalesQtyOnly = true;
                    localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
                  }else if((radioValue != 1) && (accessDesc == "Qty Only on Sales")){
                    isSalesQtyOnly = false;
                    localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
                  }

                  if((radioValue == 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                    isDashboard = true;
                    localStorage.setItem('CloudDashboardModule', isDashboard);
                  }else if((radioValue != 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                    isDashboard = false;
                    localStorage.setItem('CloudDashboardModule', isDashboard);
                  }









                  if((radioValue == 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                    isInventory = true;
                    localStorage.setItem('CloudInventoryModule', isInventory);
                  }else if((radioValue != 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                    isInventory = false;
                    localStorage.setItem('CloudInventoryModule', isInventory);
                  }

                  if((radioValue == 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                    isManufacturing = true;
                    localStorage.setItem('CloudManufacturingModule', isManufacturing);
                  }else if((radioValue != 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                    isManufacturing = false;
                    localStorage.setItem('CloudManufacturingModule', isManufacturing);
                  }

                  if((radioValue == 1) && (accessDesc == "Settings")){
                    isAccessLevels = true;
                    localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
                  }else if((radioValue != 1) && (accessDesc == "Settings")){
                    isAccessLevels = false;
                    localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
                  }

                  if((radioValue == 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                    isShipping = true;
                    localStorage.setItem('CloudShippingModule', isShipping);
                  }else if((radioValue != 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                    isShipping = false;
                    localStorage.setItem('CloudShippingModule', isShipping);
                  }

                  if((radioValue == 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                    isStockTransfer = true;
                    localStorage.setItem('CloudStockTransferModule', isStockTransfer);
                  }else if((radioValue != 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                    isStockTransfer = false;
                    localStorage.setItem('CloudStockTransferModule', isStockTransfer);
                  }

                  if((radioValue == 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                    isStockTake = true;
                    localStorage.setItem('CloudStockTakeModule', isStockTake);
                  }else if((radioValue != 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                    isStockTake = false;
                    localStorage.setItem('CloudStockTakeModule', isStockTake);
                  }
                  if((radioValue == 1) && (accessDesc == "Sales") && (isSalesLicence)){
                    isSales = true;
                    localStorage.setItem('CloudSalesModule', isSales);
                  }else if((radioValue != 1) && (accessDesc == "Sales") && (isSalesLicence)){
                    isSales = false;
                    localStorage.setItem('CloudSalesModule', isSales);
                  }
                  if((radioValue == 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                    isPurchases = true;
                    localStorage.setItem('CloudPurchasesModule', isPurchases);
                  }else if((radioValue != 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                    isPurchases = false;
                    localStorage.setItem('CloudPurchasesModule', isPurchases);
                  }
                  if((radioValue == 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                    isExpenseClaims = true;
                    localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
                  }else if((radioValue != 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                    isExpenseClaims = false;
                    localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
                  }
                  if((radioValue == 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                    isFixedAssets = true;
                    localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);
                  }else if((radioValue != 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                    isFixedAssets = false;
                    localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);
                  }
                  if((radioValue == 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                    isPayments = true;
                    localStorage.setItem('CloudPaymentsModule', isPayments);
                  }else if((radioValue != 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                    isPayments = false;
                    localStorage.setItem('CloudPaymentsModule', isPayments);
                  }
                  if((radioValue == 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                    isContacts = true;
                    localStorage.setItem('CloudContactsModule', isContacts);
                  }else if((radioValue != 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                    isContacts = false;
                    localStorage.setItem('CloudContactsModule', isContacts);
                  }
                  if((radioValue == 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                    isAccounts = true;
                    localStorage.setItem('CloudAccountsModule', isAccounts);
                  }else if((radioValue != 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                    isAccounts = false;
                    localStorage.setItem('CloudAccountsModule', isAccounts);
                  }
                  if((radioValue == 1) && (accessDesc == "Reports") && (isReportsLicence)){
                    isReports = true;
                    localStorage.setItem('CloudReportsModule', isReports);
                  }else if((radioValue != 1) && (accessDesc == "Reports") && (isReportsLicence)){
                    isReports = false;
                    localStorage.setItem('CloudReportsModule', isReports);
                  }
                  if((radioValue == 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                    isSettings = true;
                    localStorage.setItem('CloudSettingsModule', isSettings);
                  }else if((radioValue != 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                    isSettings = false;
                    localStorage.setItem('CloudSettingsModule', isSettings);
                  }





















                  }
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

               }else{
                  let data = {
                      type: "TEmployeeFormAccess",
                      fields: {
                      EmployeeId : employeeID,
                      AccessLevel : radioValue,
                      FormId:this.id
                     }
                  };
                  accesslevelService.saveEmpAccess(data).then(function (data) {
                    if((employeeID == empLoggedID) ){
                    if((radioValue == 1) && (accessDesc == "Print Delivery Docket")){
                      isDocket = true;
                      localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
                    }else if((radioValue != 1) && (accessDesc == "Print Delivery Docket")){
                      isDocket = false;
                      localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
                    }

                    if((radioValue == 1) && (accessDesc == "Print Invoice")){
                      isInvoice = true;
                      localStorage.setItem('CloudPrintInvoice', isInvoice);
                    }else if((radioValue != 1) && (accessDesc == "Print Invoice")){
                      isInvoice = false;
                      localStorage.setItem('CloudPrintInvoice', isInvoice);
                    }

                    if((radioValue == 1) && (accessDesc == "User Password Details")){
                      isUserPassDetail = true;
                      localStorage.setItem('CloudUserPass', isUserPassDetail);
                    }else if((radioValue != 1) && (accessDesc == "User Password Details")){
                      isUserPassDetail = false;
                      localStorage.setItem('CloudUserPass', isUserPassDetail);
                    }

                    if((radioValue == 1) && (accessDesc == "View Dockets")){
                      isViewDockets = true;
                      localStorage.setItem('CloudViewDockets', isViewDockets);
                    }else if((radioValue != 1) && (accessDesc == "View Dockets")){
                      isViewDockets = false;
                      localStorage.setItem('CloudViewDockets', isViewDockets);
                    }

                    if((radioValue == 1) && (accessDesc == "Qty Only on Purchase Order")){
                      isPurchaseQtyOnly = true;
                      localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                    }else if((radioValue != 1) && (accessDesc == "Qty Only on Purchase Order")){
                      isPurchaseQtyOnly = false;
                      localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                    }

                    if((radioValue == 1) && (accessDesc == "Qty Only on Sales")){
                      isSalesQtyOnly = true;
                      localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
                    }else if((radioValue != 1) && (accessDesc == "Qty Only on Sales")){
                      isSalesQtyOnly = false;
                      localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
                    }

                    if((radioValue == 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                      isDashboard = true;
                      localStorage.setItem('CloudDashboardModule', isDashboard);
                    }else if((radioValue != 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                      isDashboard = false;
                      localStorage.setItem('CloudDashboardModule', isDashboard);
                    }









                    if((radioValue == 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                      isInventory = true;
                      localStorage.setItem('CloudInventoryModule', isInventory);
                    }else if((radioValue != 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                      isInventory = false;
                      localStorage.setItem('CloudInventoryModule', isInventory);
                    }

                    if((radioValue == 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                      isManufacturing = true;
                      localStorage.setItem('CloudManufacturingModule', isManufacturing);
                    }else if((radioValue != 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                      isManufacturing = false;
                      localStorage.setItem('CloudManufacturingModule', isManufacturing);
                    }

                    if((radioValue == 1) && (accessDesc == "Settings")){
                      isAccessLevels = true;
                      localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
                    }else if((radioValue != 1) && (accessDesc == "Settings")){
                      isAccessLevels = false;
                      localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
                    }

                    if((radioValue == 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                      isShipping = true;
                      localStorage.setItem('CloudShippingModule', isShipping);
                    }else if((radioValue != 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                      isShipping = false;
                      localStorage.setItem('CloudShippingModule', isShipping);
                    }

                    if((radioValue == 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                      isStockTransfer = true;
                      localStorage.setItem('CloudStockTransferModule', isStockTransfer);
                    }else if((radioValue != 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                      isStockTransfer = false;
                      localStorage.setItem('CloudStockTransferModule', isStockTransfer);
                    }

                    if((radioValue == 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                      isStockTake = true;
                      localStorage.setItem('CloudStockTakeModule', isStockTake);
                    }else if((radioValue != 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                      isStockTake = false;
                      localStorage.setItem('CloudStockTakeModule', isStockTake);
                    }
                    if((radioValue == 1) && (accessDesc == "Sales") && (isSalesLicence)){
                      isSales = true;
                      localStorage.setItem('CloudSalesModule', isSales);
                    }else if((radioValue != 1) && (accessDesc == "Sales") && (isSalesLicence)){
                      isSales = false;
                      localStorage.setItem('CloudSalesModule', isSales);
                    }
                    if((radioValue == 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                      isPurchases = true;
                      localStorage.setItem('CloudPurchasesModule', isPurchases);
                    }else if((radioValue != 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                      isPurchases = false;
                      localStorage.setItem('CloudPurchasesModule', isPurchases);
                    }
                    if((radioValue == 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                      isExpenseClaims = true;
                      localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
                    }else if((radioValue != 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                      isExpenseClaims = false;
                      localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
                    }
                    if((radioValue == 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                      isFixedAssets = true;
                      localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);
                    }else if((radioValue != 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                      isFixedAssets = false;
                      localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);
                    }
                    if((radioValue == 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                      isPayments = true;
                      localStorage.setItem('CloudPaymentsModule', isPayments);
                    }else if((radioValue != 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                      isPayments = false;
                      localStorage.setItem('CloudPaymentsModule', isPayments);
                    }
                    if((radioValue == 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                      isContacts = true;
                      localStorage.setItem('CloudContactsModule', isContacts);
                    }else if((radioValue != 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                      isContacts = false;
                      localStorage.setItem('CloudContactsModule', isContacts);
                    }
                    if((radioValue == 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                      isAccounts = true;
                      localStorage.setItem('CloudAccountsModule', isAccounts);
                    }else if((radioValue != 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                      isAccounts = false;
                      localStorage.setItem('CloudAccountsModule', isAccounts);
                    }
                    if((radioValue == 1) && (accessDesc == "Reports") && (isReportsLicence)){
                      isReports = true;
                      localStorage.setItem('CloudReportsModule', isReports);
                    }else if((radioValue != 1) && (accessDesc == "Reports") && (isReportsLicence)){
                      isReports = false;
                      localStorage.setItem('CloudReportsModule', isReports);
                    }
                    if((radioValue == 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                      isSettings = true;
                      localStorage.setItem('CloudSettingsModule', isSettings);
                    }else if((radioValue != 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                      isSettings = false;
                      localStorage.setItem('CloudSettingsModule', isSettings);
                    }





















                    }
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
             }

          });
       }

       setTimeout(function () {
           Meteor._reload.reload();
           $('.fullScreenSpin').css('display','none');
       }, 5000);
      }, delayTimeAfterSound);
      },
     'click .inactiveLicence .chkSettings': function (event) {
        return false;
     },
     'click .btnBack':function(event){
       playCancelAudio();
       event.preventDefault();
       setTimeout(function(){
        history.back(1);
       }, delayTimeAfterSound);
     },
     'click .btnAddVS1User':function(event){

      swal({
        title: 'Is this an existing Employee?',
        text: '',
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          swal("Please select the employee from the list below.", "", "info");
          $('#employeeListModal').modal('toggle');

        } else if (result.dismiss === 'cancel') {
          FlowRouter.go('/employeescard?addvs1user=true');
        }
      })
     },
     'click .essentialsdiv .chkSettings': function (event) {

       if($(event.target).is(':checked')){
         $(event.target).val(1);
         $('#upgradeModal').modal('toggle');
       }else{
         $(event.target).val(6);
       }
     },
     'click .plusdiv .chkSettings': function (event) {
       if($(event.target).is(':checked')){
         $(event.target).val(1);
         $('#upgradeModalPlus').modal('toggle');
       }else{
         $(event.target).val(6);
       }
     }
    });
