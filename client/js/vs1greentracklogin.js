import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
import {AccessLevelService} from './accesslevel-service';
import {EmployeeProfileService} from './profile-service';
Template.vs1greentracklogin.onCreated( () => {
   Template.instance().subscribe( 'RegisterUser' );
});
Template.vs1greentracklogin.helpers({

    currentLoginEmail: function() {
          return localStorage.getItem('loginEmail') == this._email;
    },
    companyDatabases: function(){
      if(localStorage.getItem('loginEmail')){
       return RegisterUser.find({useremail: localStorage.getItem('loginEmail')}).fetch().sort(function (a, b) {
         if (a.description.toLowerCase() == 'NA') {
           return 1;
         }
         else if (b.description.toLowerCase() == 'NA') {
           return -1;
         }
         return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
       });

    }
  }
});

Template.vs1greentracklogin.onCreated(function(){
  const templateObject = Template.instance();
   templateObject.loggedUser = new ReactiveVar();
   templateObject.loggedDB = new ReactiveVar();
   templateObject.steelmainDB = new ReactiveVar();
   templateObject.employeeID = new ReactiveVar();
   templateObject.employeeformID = new ReactiveVar();
   templateObject.employeeformDetail = new ReactiveVar();
   templateObject.employeeformaccessrecord = new ReactiveVar({});
});


Template.vs1greentracklogin.onRendered(function(){
  localStorage.setItem('VS1ProductList', '');
  localStorage.setItem('VS1SalesProductList', '');
  localStorage.setItem('VS1PurchaseAccountList', '');

  localStorage.setItem('VS1ProductPrintList', '');
  localStorage.setItem('VS1CustomerList', '');
  localStorage.setItem('VS1SupplierList', '');
  localStorage.setItem('VS1EmployeeList', '');
  localStorage.setItem('VS1ManufacturingList', '');
  localStorage.setItem('VS1ShippingList', '');

  localStorage.setItem('VS1CustomerAwaitingPaymentList', '');
  localStorage.setItem('VS1CustomerPaymentList', '');
  localStorage.setItem('VS1SupplierPOAwaitingPaymentList', '');
  localStorage.setItem('VS1SupplierBillAwaitingPaymentList', '');
  localStorage.setItem('VS1SupplierPaymentList', '');

  localStorage.setItem('VS1StockTransferList', '');
  localStorage.setItem('VS1AccessLevelList', '');
  localStorage.setItem('VS1TERPFormList', '');



  localStorage.setItem('ERPCurrency', '');
  localStorage.setItem('ERPCountryAbbr', '');
  localStorage.setItem('ERPDefaultDepartment', '');

  localStorage.setItem('mycloudLogonPassword', '');
  localStorage.setItem('mycloudLogonID', '');
  localStorage.setItem('mycloudLogonRole', '');
  localStorage.setItem('myerpPassword', '');
  localStorage.setItem('mySessionEmployee', '');
  localStorage.setItem('EIPAddress', '');
  localStorage.setItem('EUserName', '');
  localStorage.setItem('EPassword', '');
  localStorage.setItem('EDatabase', '');
  localStorage.setItem('EPort', '');
  localStorage.setItem('mySessionEmployeeLoggedID', '');
  localStorage.setItem('mySession', '');
  localStorage.setItem('mySessionEmployee', '');
  localStorage.setItem('loginEmail', '');

  localStorage.setItem('mycloudLogonDBID', '');
  localStorage.setItem('mycloudLogonID', '');
  localStorage.setItem('mycloudLogonUsername', '');
  localStorage.setItem('mycloudLogonUserEmail', '');

  localStorage.setItem('mainEIPAddress', '');
  localStorage.setItem('mainEPort', '');
  localStorage.setItem('isGreenTrack', false);

  localStorage.setItem('VS1AdminUserName', '');

  localStorage.setItem('vs1cloudlicenselevel', '');






  const templateObject = Template.instance();
  const arrayformid =[];
  const arrayformdet =[];
  let accesslevelService = new AccessLevelService();
  var employeeProfileService = new EmployeeProfileService();

  function getSideBarData(employeeID, accessUserName, accessDatabase,erpdbname){



    let lineItemslevel = [];
    let lineItemObjlevel = {};

    let lineItemsAccesslevel = [];
    let lineItemAccessObjlevel = {};

    let isInvoice = false;
    let isDocket = false;
    let isUserPassDetail = false;
    let isViewDockets = false;

    let isSalesQtyOnly = false;
    let isPurchaseQtyOnly = false;

    let isDashboard = false;
    let isMain = false;
    let isInventory = false;
    let isManufacturing = false;
    let isAccessLevels = false;
    let isShipping = false;
    let isStockTransfer = false;
    let isStockTake = false;
    let isSales = false;
    let isPurchases = false;
    let isExpenseClaims = false;
    let isFixedAssets = false;


    let isPayments = false;
    let isContacts = false;
    let isAccounts = false;
    let isReports = false;
    let isSettings = false;

    let isSidePanel = false;
    let isTopPanel = false;
    let isSidePanelID = '';
    let isTopPanelID = '';
    let isSidePanelFormID = '';
    let isTopPanelFormID = '';

    /* Lincence Check for Menu Options */
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


        /*Licence Check Menu to add */
    let isAccountsLicence = localStorage.getItem('CloudAccountsLicence');
    let isContactsLicence = localStorage.getItem('CloudContactsLicence');
    let isExpenseClaimsLicence = localStorage.getItem('CloudExpenseClaimsLicence');
    let isPaymentsLicence = localStorage.getItem('CloudPaymentsLicence');
    let isReportsLicence = localStorage.getItem('CloudReportsLicence');
    let isSettingsLicence = localStorage.getItem('CloudSettingsLicence');
       /*End Licence Check Menu to add */

    /* End Licence Check for menu option */
    var ERPDetails = erpdbname;
    var SegsDatabase = ERPDetails.split(',');
    var ERPFormAccessDetailObject = "TEmployeeFormAccessDetail?ListType=Detail&Select=[TabGroup]=26 and [EmployeeId]='"+employeeID+"'";
    var oReqFormAccessDetailObject = new XMLHttpRequest();
    oReqFormAccessDetailObject.open("GET",URLRequest + SegsDatabase[0] + ':' + SegsDatabase[4] + '/' + "erpapi" + '/' + ERPFormAccessDetailObject, true);
    oReqFormAccessDetailObject.setRequestHeader("database",SegsDatabase[1]);
    oReqFormAccessDetailObject.setRequestHeader("username",SegsDatabase[2]);
    oReqFormAccessDetailObject.setRequestHeader("password",SegsDatabase[3]);
    oReqFormAccessDetailObject.send();

    oReqFormAccessDetailObject.onreadystatechange = function() {
    if (oReqFormAccessDetailObject.readyState == 4 && oReqFormAccessDetailObject.status == 200) {
         var data = JSON.parse(oReqFormAccessDetailObject.responseText)
         for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {
           lineItemObjlevel = {
              formID: data.temployeeformaccessdetail[i].fields.FormId || '',
              accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
              accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
              description: data.temployeeformaccessdetail[i].fields.Description || '',
              formName: data.temployeeformaccessdetail[i].fields.FormName || '',
              accessID: data.temployeeformaccessdetail[i].fields.ID || '',
          };

          if(data.temployeeformaccessdetail[i].fields.AccessLevelName === "Full Access"){
            if(data.temployeeformaccessdetail[i].fields.Description === "Print Delivery Docket"){
              isDocket = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Print Invoice"){
              isInvoice = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "User Password Details"){
              isUserPassDetail = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "Dashboard"){
              isDashboard = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Main"){
              isMain = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking"){
              isInventory = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Manufacturing"){
              isManufacturing = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "Settings"){
              isAccessLevels = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Shipping"){
              isShipping = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer"){
              isStockTransfer = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Side Panel Menu"){
              isSidePanel = true;
              isSidePanelID = data.temployeeformaccessdetail[i].fields.ID;
              isSidePanelFormID = data.temployeeformaccessdetail[i].fields.FormId;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Top Panel Menu"){
              isTopPanel = true;
              isTopPanelID = data.temployeeformaccessdetail[i].fields.ID;
              isTopPanelFormID = data.temployeeformaccessdetail[i].fields.FormId;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Stock Take"){
              isStockTake = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Sales"){
              isSales = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Purchases"){
              isPurchases = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Expense Claims"){
              isExpenseClaims = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets"){
              isFixedAssets = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Payments"){
              isPayments = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Contacts"){
              isContacts = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Accounts"){

              isAccounts = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Reports"){
              isReports = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Settings"){
              isSettings = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "View Dockets"){
              isViewDockets = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "Qty Only on Purchase Order"){
              isPurchaseQtyOnly = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "Qty Only on Sales"){
              isSalesQtyOnly = true;
            }



            lineItemAccessObjlevel = {
               formID: data.temployeeformaccessdetail[i].fields.FormId || '',
               accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
               accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
               description: data.temployeeformaccessdetail[i].fields.Description || '',
               formName: data.temployeeformaccessdetail[i].fields.FormName || '',
               accessID: data.temployeeformaccessdetail[i].fields.ID || '',
           };
           lineItemsAccesslevel.push(lineItemAccessObjlevel);
          }

          lineItemslevel.push(lineItemObjlevel);

         }
         if(!isDashboardLicence){
           isDashboard = false;
         }

         if(!isFixedAssetsLicence){
           isFixedAssets = false;
         }
         if(!isInventoryLicence){
           isInventory = false;
         }
         if(!isManufacturingLicence){
           isManufacturing = false;
         }
         if(!isPurchasesLicence){
           isPurchases = false;
         }
         if(!isSalesLicence){
           isSales = false;
         }
         if(!isShippingLicence){
           isShipping = false;
         }
         if(!isStockTakeLicence){
           isStockTake = false;
         }
         if(!isStockTransferLicence){
           isStockTransfer = false;
         }

         if(!isAccountsLicence){
           isAccounts = false;
         }
         if(!isContactsLicence){
           isContacts = false;
         }
         if(!isExpenseClaimsLicence){
           isExpenseClaims = false;
         }
         if(!isPaymentsLicence){
           isPayments = false;
         }
         if(!isReportsLicence){
           isReports = false;
         }

         if(!isSettingsLicence){
           isSettings = false;
         }

         if(!isMainLicence){
           isMain = false;
         }

        localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
        localStorage.setItem('CloudPrintInvoice', isInvoice);
        localStorage.setItem('CloudUserPass', isUserPassDetail);

        localStorage.setItem('CloudViewDockets', isViewDockets);

        localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
        localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);


        localStorage.setItem('CloudDashboardModule', isDashboard);
        localStorage.setItem('CloudMainModule', isMain);
        localStorage.setItem('CloudInventoryModule', isInventory);
        localStorage.setItem('CloudManufacturingModule', isManufacturing);
        localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
        localStorage.setItem('CloudShippingModule', isShipping);
        localStorage.setItem('CloudStockTransferModule', isStockTransfer);
        localStorage.setItem('CloudStockTakeModule', isStockTake);
        localStorage.setItem('CloudSalesModule', isSales);
        localStorage.setItem('CloudPurchasesModule', isPurchases);
        localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
        localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);

        localStorage.setItem('CloudPaymentsModule', isPayments);
        localStorage.setItem('CloudContactsModule', isContacts);
        localStorage.setItem('CloudAccountsModule', isAccounts);
        localStorage.setItem('CloudReportsModule', isReports);
        localStorage.setItem('CloudSettingsModule', isSettings);

        localStorage.setItem('CloudSidePanelMenu', isSidePanel);
        localStorage.setItem('CloudTopPanelMenu', isTopPanel);
        localStorage.setItem('CloudSidePanelMenuID', isSidePanelID);
        localStorage.setItem('CloudTopPanelMenuID', isTopPanelID);
        localStorage.setItem('CloudSidePanelMenuFormID', isSidePanelFormID);
        localStorage.setItem('CloudTopPanelMenuFormID', isTopPanelFormID);

         let userSerssion = {'loggedEmpID':employeeID,
                             'loggedUserName':accessUserName,
                             'loggedDatabase':accessDatabase,
                             'loggedAccessData':lineItemslevel};
        localStorage.setItem('ERPSolidCurrentUSerAccess', userSerssion);

       let userModuleRedirect = lineItemsAccesslevel.sort(function (a, b) {
         if (a.description.toLowerCase() == 'NA') {
           return 1;
         }
         else if (b.description.toLowerCase() == 'NA') {
           return -1;
         }
         return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
       });






window.open('/dashboard','_self');

    }
    }

  }

  /* ERP Licence Info */
  function getERPLicenceInfo(erpdbname){
    let licenceitemsoption = [];
    let licenceitemsObj = {};

    /* licence Option To Add */
    let isAccountsLicence = true;
    let isContactsLicence = true;
    let isExpenseClaimsLicence = false;
    let isPaymentsLicence = true;
    let isReportsLicence = true;
    let isSettingsLicence = true;
    /*End Option to Add */

    let isFixedAssetsLicence = false;
    let isInventoryLicence = false;
    let isManufacturingLicence = false;
    let isPurchasesLicence = true;
    let isSalesLicence = true;
    let isShippingLicence = false;
    let isStockTakeLicence = true;
    let isStockTransferLicence = false;

    let isMainLicence = true;
    let isDashboardLicence = true;

/* Remove licence */

    localStorage.setItem('CloudAccountsLicence', isAccountsLicence);
    localStorage.setItem('CloudContactsLicence', isContactsLicence);
    localStorage.setItem('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
    localStorage.setItem('CloudPaymentsLicence', isPaymentsLicence);
    localStorage.setItem('CloudReportsLicence', isReportsLicence);
    localStorage.setItem('CloudSettingsLicence', isSettingsLicence);

    localStorage.setItem('CloudMainLicence', isMainLicence);
    localStorage.setItem('CloudDashboardLicence', isDashboardLicence);



      localStorage.setItem('CloudFixedAssetsLicence', isFixedAssetsLicence);
      localStorage.setItem('CloudInventoryLicence', isInventoryLicence);
      localStorage.setItem('CloudManufacturingLicence', isManufacturingLicence);
      localStorage.setItem('CloudPurchasesLicence', isPurchasesLicence);
      localStorage.setItem('CloudSalesLicence', isSalesLicence);
      localStorage.setItem('CloudShippingLicence', isShippingLicence);
      localStorage.setItem('CloudStockTakeLicence', isStockTakeLicence);
      localStorage.setItem('CloudStockTransferLicence', isStockTransferLicence);
      /* End Remove licence */


  }

  function getAccessLevelData(userAccessOptions){




    let lineItemslevel = [];
    let lineItemObjlevel = {};

    let lineItemsAccesslevel = [];
    let lineItemAccessObjlevel = {};

    let isInvoice = false;
    let isDocket = false;
    let isUserPassDetail = false;
    let isViewDockets = false;

    let isSalesQtyOnly = false;
    let isPurchaseQtyOnly = false;

    let isDashboard = true;
    let isMain = false;
    let isInventory = false;
    let isManufacturing = false;
    let isAccessLevels = false;
    let isShipping = false;
    let isStockTransfer = false;
    let isStockTake = false;
    let isSales = false;
    let isPurchases = false;
    let isExpenseClaims = false;
    let isFixedAssets = false;


    let isPayments = false;
    let isContacts = false;
    let isAccounts = false;
    let isReports = false;
    let isSettings = true;

    let isSidePanel = false;
    let isTopPanel = false;
    let isSidePanelID = '';
    let isTopPanelID = '';
    let isSidePanelFormID = '';
    let isTopPanelFormID = '';

    let isSeedToSale = true;
    let isBanking = false;
    let isPayroll = false;

    /* Lincence Check for Menu Options */
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

    let isSeedToSaleLicence = localStorage.getItem('CloudSeedToSaleLicence');
    let isBankingLicence = localStorage.getItem('CloudBankingLicence');
    let isPayrollLicence = localStorage.getItem('CloudPayrollLicence');


        /*Licence Check Menu to add */
    let isAccountsLicence = localStorage.getItem('CloudAccountsLicence');
    let isContactsLicence = localStorage.getItem('CloudContactsLicence');
    let isExpenseClaimsLicence = localStorage.getItem('CloudExpenseClaimsLicence');
    let isPaymentsLicence = localStorage.getItem('CloudPaymentsLicence');
    let isReportsLicence = localStorage.getItem('CloudReportsLicence');
    let isSettingsLicence = localStorage.getItem('CloudSettingsLicence');
       /*End Licence Check Menu to add */

    /* End Licence Check for menu option */
    if(userAccessOptions.items){

    if(!isDashboardLicence){
      isDashboard = false;
    }

    if(!isFixedAssetsLicence){
      isFixedAssets = false;
    }
    if(!isInventoryLicence){
      isInventory = false;
    }
    if(!isManufacturingLicence){
      isManufacturing = false;
    }
    if(!isPurchasesLicence){
      isPurchases = false;
    }
    if(!isSalesLicence){
      isSales = false;
    }
    if(!isShippingLicence){
      isShipping = false;
    }
    if(!isStockTakeLicence){
      isStockTake = false;
    }
    if(!isStockTransferLicence){
      isStockTransfer = false;
    }

    if(!isAccountsLicence){
      isAccounts = false;
    }
    if(!isContactsLicence){
      isContacts = false;
    }
    if(!isExpenseClaimsLicence){
      isExpenseClaims = false;
    }
    if(!isPaymentsLicence){
      isPayments = false;
    }
    if(!isReportsLicence){
      isReports = false;
    }

    if(!isSettingsLicence){
      isSettings = false;
    }

    if(!isMainLicence){
      isMain = false;
    }


    if(!isSeedToSaleLicence){
      isSeedToSale = false;
    }

    if(!isBankingLicence){
      isBanking = false;
    }

    if(!isPayrollLicence){
      isPayroll = false;
    }
   localStorage.setItem('CloudPrintDeliveryDocket', isDocket);
   localStorage.setItem('CloudPrintInvoice', isInvoice);
   localStorage.setItem('CloudUserPass', isUserPassDetail);

   localStorage.setItem('CloudViewDockets', isViewDockets);

   localStorage.setItem('CloudSalesQtyOnly', isSalesQtyOnly);
   localStorage.setItem('CloudPurchaseQtyOnly', isPurchaseQtyOnly);


   localStorage.setItem('CloudDashboardModule', isDashboard);
   localStorage.setItem('CloudMainModule', isMain);
   localStorage.setItem('CloudInventoryModule', isInventory);
   localStorage.setItem('CloudManufacturingModule', isManufacturing);
   localStorage.setItem('CloudAccessLevelsModule', isAccessLevels);
   localStorage.setItem('CloudShippingModule', isShipping);
   localStorage.setItem('CloudStockTransferModule', isStockTransfer);
   localStorage.setItem('CloudStockTakeModule', isStockTake);
   localStorage.setItem('CloudSalesModule', isSales);
   localStorage.setItem('CloudPurchasesModule', isPurchases);
   localStorage.setItem('CloudExpenseClaimsModule', isExpenseClaims);
   localStorage.setItem('CloudFixedAssetsModule', isFixedAssets);

   localStorage.setItem('CloudPaymentsModule', isPayments);
   localStorage.setItem('CloudContactsModule', isContacts);
   localStorage.setItem('CloudAccountsModule', isAccounts);
   localStorage.setItem('CloudReportsModule', isReports);
   localStorage.setItem('CloudSettingsModule', isSettings);

   localStorage.setItem('CloudSidePanelMenu', isSidePanel);
   localStorage.setItem('CloudTopPanelMenu', isTopPanel);
   localStorage.setItem('CloudSidePanelMenuID', isSidePanelID);
   localStorage.setItem('CloudTopPanelMenuID', isTopPanelID);
   localStorage.setItem('CloudSidePanelMenuFormID', isSidePanelFormID);
   localStorage.setItem('CloudTopPanelMenuFormID', isTopPanelFormID);

   localStorage.setItem('CloudSeedToSaleModule', isSeedToSale);
   localStorage.setItem('CloudBankingModule', isBanking);
   localStorage.setItem('CloudPayrollModule', isPayroll);

    let userSerssion = {'loggedEmpID':userAccessOptions.items[0].fields.EmployeeId,
                        'loggedUserName':localStorage.getItem('EUserName'),
                        'loggedDatabase':localStorage.getItem('EDatabase'),
                        'loggedAccessData':lineItemslevel};
   localStorage.setItem('ERPSolidCurrentUSerAccess', userSerssion);

  let userModuleRedirect = lineItemsAccesslevel.sort(function (a, b) {
    if (a.description.toLowerCase() == 'NA') {
      return 1;
    }
    else if (b.description.toLowerCase() == 'NA') {
      return -1;
    }
    return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
  });
   window.open('/stsdashboard','_self');

}
  }
var times = 0;
$("#login-button").click(function(e){


  let userLoginEmail = $("#email").val();
  let userLoginPassword = $('#erppassword').val();
  let hashUserLoginPassword = CryptoJS.MD5(userLoginPassword).toString().toUpperCase();
  var counterUserRec = null;
  let employeeUserID = '';
  let loggedUserEventFired = false;

  localStorage.setItem('ERPCurrency', '$');
  localStorage.setItem('ERPCountryAbbr', 'AUD');
  localStorage.setItem('ERPDefaultDepartment', 'Default');
  localStorage.setItem('ERPDefaultUOM', '');


  if ($('#remember_me').is(':checked')) {

      localStorage.usremail = $('#email').val();
      localStorage.usrpassword = $('#erppassword').val();
      localStorage.chkbx = $('#remember_me').val();
  } else {
      localStorage.usremail = '';
      localStorage.usrpassword = '';
      localStorage.chkbx = '';
  };

  if ($("#erppassword").val() == '') {

    swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
    $("#erppassword").focus();
    e.preventDefault();
  }else if(userLoginEmail === '') {

      swal('Invalid VS1 Email Address', 'The entered your user email address is not correct, please re-enter your email address and try again!', 'error');
      $("#email").focus();
      e.preventDefault();
  }else{
  Meteor.call('readMethodLog',userLoginEmail,hashUserLoginPassword, function(error, result){
  if(error){


    swal('Oops...', 'user-not-found, no user found please try again!', 'info');
  }else{
  let regUserDetails = result;
  if(regUserDetails){
    if(regUserDetails.length === 0){
      times++;
      if (times > 2) {
        window.open('/forgotpassword','_self');
      }else {

      }

      swal('Oops...', 'Your email or password is incorrect, please try again!', 'error');
      e.preventDefault();
    }
  for (let i = 0; i < regUserDetails.length; i++) {
    if(regUserDetails.length == 1){
      if(regUserDetails[i].userMultiLogon == true){

        swal('Oops...', 'VS1 User Name is already logged in. Select "Sign me out of all devices" to login', 'info');
        $('.signmeout').css('display','block');

      }else{
        times = 0;
      var ERPIPAdderess= regUserDetails[i].server;
      var ERPdbName = regUserDetails[i].database;
      var ERPuserName = regUserDetails[i].username;
      var ERPpassword = regUserDetails[i].password;
      var ERPport = regUserDetails[i].port;

      var ERPLoggeduserName = regUserDetails[i].cloudUsername;
      var cloudLoggedID = '';
      var cloudLoggedDBID = '';
      var cloudLoggedUsername = '';
      var cloudLoggedRole = regUserDetails[i].role;
      var cloudUserEmail = regUserDetails[i].cloudEmail;
      var cloudUserpassword = regUserDetails[i].cloudHashPassword;


       localStorage.setItem('mycloudLogonPassword', cloudUserpassword);

      let erpdbname = ERPIPAdderess+','+ERPdbName+','+ERPuserName+','+ERPpassword+','+ERPport;
      getERPLicenceInfo(erpdbname);
      var useremail = userLoginEmail;
      var password = $("#erppassword").val();
      var hashPassword = CryptoJS.MD5(password).toString().toUpperCase();
      var cloudPassword = regUserDetails[i].password;
      if (hashPassword == cloudUserpassword){
        $('.loginSpinner').css('display','inline-block');
        $('.fullScreenSpin').css('display','inline-block');
        cloudLoggedID = regUserDetails[i]._id;
        cloudLoggedDBID = regUserDetails[i].clouddatabaseID;
        cloudLoggedUsername = regUserDetails[i].cloudUsername;


        localStorage.setItem('mycloudLogonDBID', cloudLoggedDBID);
        localStorage.setItem('mycloudLogonID', cloudLoggedID);
        localStorage.setItem('mycloudLogonUsername', cloudLoggedUsername);
        localStorage.setItem('mycloudLogonUserEmail', cloudUserEmail);

        localStorage.setItem('myerpPassword', cloudUserpassword);
        localStorage.setItem('mySessionEmployee', ERPuserName);

        localStorage.setItem('EIPAddress', ERPIPAdderess);
        localStorage.setItem('EUserName', ERPuserName);
        localStorage.setItem('EPassword', ERPpassword);
        localStorage.setItem('EDatabase', ERPdbName);
        localStorage.setItem('EPort', ERPport);
        loggedUserEventFired = true;

        localStorage.setItem('mainEIPAddress', licenceIPAddress);
        localStorage.setItem('mainEPort', checkSSLPorts);

        var ERPCheackUserObject = "TUser?PropertyList=ID,EmployeeId,LogonName,EmployeeName,PasswordHash,Active&Select=[LogonName]='"+ERPLoggeduserName+"'";
        var oReqCheackUserObject = new XMLHttpRequest();
        oReqCheackUserObject.open("GET",URLRequest + ERPIPAdderess + ':' + ERPport + '/' + "erpapi" + '/' + ERPCheackUserObject, true);
        oReqCheackUserObject.setRequestHeader("database",ERPdbName);
        oReqCheackUserObject.setRequestHeader("username",ERPuserName);
        oReqCheackUserObject.setRequestHeader("password",ERPpassword);
        oReqCheackUserObject.send();

        oReqCheackUserObject.onreadystatechange = function() {
        if (oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 200) {
          localStorage.setItem('LoggedUserEventFired', loggedUserEventFired);
          localStorage.setItem('userlogged_status', 'active');
          var dataListCheackUser = JSON.parse(oReqCheackUserObject.responseText)
          for (var eventCheackUser in dataListCheackUser) {
            var dataCheackUserCopy = dataListCheackUser[eventCheackUser];
            for (var dataCheackUser in dataCheackUserCopy) {
              var mainCheackUserData = dataCheackUserCopy[dataCheackUser];
              var user_password = mainCheackUserData.PasswordHash;
              var empusername = mainCheackUserData.EmployeeName;
              var employeeUserLogon = mainCheackUserData.LogonName;
              var employeeUserID = mainCheackUserData.EmployeeId;
              var employeename = mainCheackUserData.EmployeeName;
              localStorage.setItem('mySessionEmployeeLoggedID', employeeUserID);
              localStorage.setItem('mySession', empusername);
              var sessionDataToLog = localStorage.getItem('mySession');
              localStorage.setItem('mySessionEmployee', employeename);

              var ERPCheackAppUserObject = "TAppUser?PropertyList=ID,DatabaseName,UserName,MultiLogon&Select=[DatabaseName]='"+ERPdbName+"' and [UserName]='"+ERPLoggeduserName+"'";
              var oReqCheackAppUserObject = new XMLHttpRequest();
              oReqCheackAppUserObject.open("GET",URLRequest + ERPIPAdderess + ':' + ERPport + '/' + "erpapi" + '/' + ERPCheackAppUserObject, true);
              oReqCheackAppUserObject.setRequestHeader("database",ERPdbName);
              oReqCheackAppUserObject.setRequestHeader("username",ERPuserName);
              oReqCheackAppUserObject.setRequestHeader("password",ERPpassword);
              oReqCheackAppUserObject.send();

              oReqCheackAppUserObject.timeout = 30000;
              oReqCheackAppUserObject.onreadystatechange = function() {
              if (oReqCheackAppUserObject.readyState == 4 && oReqCheackAppUserObject.status == 200) {
                var dataListCheackAppUser = JSON.parse(oReqCheackAppUserObject.responseText)
                for (var eventCheackAppUser in dataListCheackAppUser) {
                  var dataCheackAppUserCopy = dataListCheackAppUser[eventCheackAppUser];
                  if(dataCheackAppUserCopy.length === 0){
                    counterUserRec = true;
                  }else if(dataCheackAppUserCopy.length === 1){
                    if(ERPuserName.toString().toUpperCase() == ERPLoggeduserName.toString().toUpperCase()){
                      counterUserRec = true;
                    }else{
                      counterUserRec = false;
                    }

                  }else{
                    counterUserRec = false;
                  };

                  for (var dataCheackAppUser in dataCheackAppUserCopy) {
                    var mainCheackAppUserData = dataCheackAppUserCopy[dataCheackAppUser];
                    var erpUsername = mainCheackAppUserData.UserName;

                  }
              if(counterUserRec === true){

                 getSideBarData(employeeUserID,employeeUserLogon,ERPIPAdderess,erpdbname);



              document.getElementById("error_log").style.display = 'none';

              // Add get sms messaging log when login here
              const smsSettings = {
                twilioAccountId: "",
                twilioAccountToken: "",
                twilioTelephoneNumber: "",
            }
            smsService.getSMSSettings().then((result) => {
                if (result.terppreference.length > 0) {
                    for (let i = 0; i < result.terppreference.length; i++) {
                        switch(result.terppreference[i].PrefName) {
                            case "VS1SMSID": smsSettings.twilioAccountId = result.terppreference[i].Fieldvalue; break;
                            case "VS1SMSToken": smsSettings.twilioAccountToken = result.terppreference[i].Fieldvalue; break;
                            case "VS1SMSPhone": smsSettings.twilioTelephoneNumber = result.terppreference[i].Fieldvalue; break;
                        }
                    }
                }
                $.ajax(
                    {
                        method: 'GET',
                        url: 'https://api.twilio.com/2010-04-01/Accounts/' + smsSettings.twilioAccountId + `/SMS/Messages.json?PageSize=1000`,
                        dataType: 'json',
                        contentType: 'application/x-www-form-urlencoded', // !
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization",
                                "Basic " + btoa(smsSettings.twilioAccountId + ":" + smsSettings.twilioAccountToken) // !
                            );
                        },
                        success: function(data) {
                            if (!data.sms_messages) {
                                addVS1Data('TVS1SMSLogs', data).then((res) => {
                                }).then(error => console.log(error));
                            }
                        },
                        error: function(e) {
                            reject(e.message);
                        }
                    }
                )
            });


              }else{

                swal('Oops...', 'VS1 User Name is already logged in. Select "Sign me out of all devices" to login', 'info');
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');

              }
              }
              }

              }
              /*END APPUSER*/

            }
        }
      }else if(oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 403){
        swal({
          title: 'Oooops...',
          text: oReqCheackUserObject.getResponseHeader('errormessage'),
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
        }else if(oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 406){
          swal({
            title: 'Oooops...',
            text: oReqCheackUserObject.getResponseHeader('errormessage'),
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
            }).then((result) => {
            if (result.value) {
              Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
          });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
        }else if(oReqCheackUserObject.status == 0 && oReqCheackUserObject.statusText == '') {

        swal('Err Connection Refused', 'Please check setup connection!', 'error');
        setTimeout(function () {
            Meteor._reload.reload();
        }, 1500);
        }
      }
      }else{

        swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
        $("#erppassword").focus();
      }

    }
    }else{

    }
  }
  }else{
    times++;
    if(times > 2){
      window.open('/forgotpassword','_self');
    } else {

    }

  swal('Oops...', 'Your email or password is incorrect, please try again!', 'error');
  setTimeout(function () {
      Meteor._reload.reload();

  }, 1000);
  $("#email").focus();
  e.preventDefault();
  }
  }

  });
}

e.preventDefault();
});

$("#erplogin-button").click(function(e){
  e.preventDefault();
   /* VS1 Licence Info */

   let licenceitemsoption = [];
    let licenceitemsObj = {};

    let isSameUserLogin = false;
    /* licence Option To Add */
    let isAccountsLicence = false;
    let isContactsLicence = false;
    let isPaymentsLicence = false;
    let isReportsLicence = false;
    let isSettingsLicence = true;
    let isFixedAssetsLicence = false;
    let isInventoryLicence = false;
    let isPurchasesLicence = false;
    let isSalesLicence = false;

    let isStockTakeLicence = false;
    let isStockTransferLicence = false;

    let isMainLicence = true;
    let isDashboardLicence = false;
    let isBankingLicence = false;

    let isBinTrackingLicence = false;
    let isBatchSerialNoLicence = false;
    let isJobsConstructionLicence = false;

    let isFxCurrencyLicence = false;
    let isSeedToSaleLicence = true;
    let isManufacturingLicence = false;
    let isWMSLicence = false;
    let isAddExtraUserLicence = false;
    let isMatrixLicence = false;
    let isShippingLicence = false;
    let isPayrollLicence = false;
    let isExpenseClaimsLicence = false;
    let isPOSLicence = false;

    /*End Option to Add */
    let isTrueERPConnection = false;

  let userLoginEmail = $("#email").val();
  let userLoginPassword = $("#erppassword").val();
  let hashUserLoginPassword = CryptoJS.MD5(userLoginPassword).toString().toUpperCase();
  var counterUserRec = null;
  let employeeUserID = '';
  let loggedUserEventFired = false;





  if ($('#remember_me').is(':checked')) {

      localStorage.usremail = $('#email').val();
      localStorage.usrpassword = $('#erppassword').val();
      localStorage.chkbx = $('#remember_me').val();
  }else{
      localStorage.usremail = '';
      localStorage.usrpassword = '';
      localStorage.chkbx = '';
  };

  if ($("#erppassword").val() == '') {

    swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
    $("#erppassword").focus();
    e.preventDefault();
  }else if(userLoginEmail === '') {

      swal('Please enter email address! ', '', 'warning');
      $("#email").focus();
      e.preventDefault();
  }else{

    storeExists1(userLoginEmail).then(function(data) {
        if(data == true) {
          var dataRes = getLoginData(userLoginEmail).then(function (dataObject) {
            if(dataObject.length == 0){
              var serverTest = URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/erpapi/Vs1_Logon?Vs1UserName="'+userLoginEmail+'"&vs1Password="'+userLoginPassword+'"';

              var oReq = new XMLHttpRequest();
              oReq.open("GET",serverTest, true);
              oReq.setRequestHeader("database",vs1loggedDatatbase);
              oReq.setRequestHeader("username","VS1_Cloud_Admin");
              oReq.setRequestHeader("password","DptfGw83mFl1j&9");
              oReq.send();


              oReq.onreadystatechange = function() {

                if (oReq.readyState == 4 && oReq.status == 200) {
                  localStorage.setItem('mainEIPAddress', licenceIPAddress);
                  localStorage.setItem('mainEPort', checkSSLPorts);


                  var dataReturnRes = JSON.parse(oReq.responseText);


                  if(dataReturnRes.ProcessLog){
                  if(dataReturnRes.ProcessLog.ResponseStatus != "OK"){
                    if(dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due"){
                      $('.loginSpinner').css('display','none');
                      $('.fullScreenSpin').css('display','none');

                      swal({
                        title: 'You Seem To Have Missed a Payment Recently, Can You Please Update your Subscription Information!',
                        text: '',
                        type: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Update Payment',
                        cancelButtonText: 'Cancel'
                      }).then((result) => {
                        if (result.value) {
                          window.open('https://magento-473757-1929062.cloudwaysapps.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_self');
                        } else if (result.dismiss === 'cancel') {

                        }
                      });

                    }else{
                      swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');

                      $('.loginSpinner').css('display','none');
                      $('.fullScreenSpin').css('display','none');
                    }



                  }else{


                    Meteor.call('readMethod',dataReturnRes.ProcessLog.VS1AdminUserName, function(error, result){
                    if(error){

                    }else{
                    let regUserDetails = result;
                    if(regUserDetails){
                      if(regUserDetails.length === 0){

                      }





                          localStorage.setItem('mycloudLogonDBID', regUserDetails.clouddatabaseID);
                          localStorage.setItem('mycloudLogonID', regUserDetails._id);

                    }
                    }

                    });

                    localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
                    localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
                    localStorage.setItem('isGreenTrack', true);
                    if(!localStorage.getItem('VS1loggedDatabase')){
                      localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
                      localStorage.setItem('VS11099Contractor_Report', '');
                      localStorage.setItem('VS1AgedPayables_Report', '');
                      localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                      localStorage.setItem('VS1AgedReceivables_Report', '');
                      localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                      localStorage.setItem('VS1BalanceSheet_Report', '');
                      localStorage.setItem('VS1BalanceTrans_Report', '');
                      localStorage.setItem('VS1GeneralLedger_Report', '');
                      localStorage.setItem('VS1ProfitandLoss_Report', '');
                      localStorage.setItem('VS1Purchase_List', '');
                      localStorage.setItem('VS1Purchase_Report', '');
                      localStorage.setItem('VS1PurchaseSummary_Report', '');
                      localStorage.setItem('VS1ProductSales_List', '');
                      localStorage.setItem('VS1ProductSales_Report', '');
                      localStorage.setItem('VS1Sales_List', '');
                      localStorage.setItem('VS1Sales_Report', '');
                      localStorage.setItem('VS1SalesSummary_Report', '');
                      localStorage.setItem('VS1TaxSummary_Report', '');
                      localStorage.setItem('VS1TrialBalance_Report', '');
                      localStorage.setItem('VS1PrintStatements_Report', '');
                      localStorage.setItem('bankaccountid', '');

                      localStorage.setItem('VS1ProductList', '');
                      localStorage.setItem('VS1CustomerList', '');
                      localStorage.setItem('VS1SupplierList', '');
                      localStorage.setItem('VS1AccountList', '');
                      localStorage.setItem('VS1TaxCodeList', '');
                      localStorage.setItem('VS1TermsList', '');
                      localStorage.setItem('VS1DepartmentList', '');
                      localStorage.setItem('VS1CurrencyList', '');
                      localStorage.setItem('VS1LeadStatusList', '');
                      localStorage.setItem('VS1ShippingMethodList', '');
                      localStorage.setItem('VS1AccountTypeList', '');
                      localStorage.setItem('VS1ERPCombinedContactsList', '');
                      localStorage.setItem('VS1EmployeeList', '');
                      localStorage.setItem('VS1JournalEntryLineList', '');
                      localStorage.setItem('VS1BankAccountReportList', '');
                      localStorage.setItem('VS1TInvoiceList', '');
                      localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
                      localStorage.setItem('VS1BackOrderSalesListList', '');
                      localStorage.setItem('VS1TPurchaseOrderList', '');
                      localStorage.setItem('VS1TReconcilationList', '');
                      localStorage.setItem('VS1TChequeList', '');
                      localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
                      localStorage.setItem('VS1TAppUserList', '');
                      localStorage.setItem('VS1TJobVS1List', '');
                      localStorage.setItem('VS1TStockAdjustEntryList', '');
                      localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
                      localStorage.setItem('VS1TbillReport', '');
                      localStorage.setItem('VS1TbillReport', '');
                      localStorage.setItem('VS1TCreditList', '');
                      localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
                      localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
                      localStorage.setItem('VS1TSalesList', '');
                    }else{
                      if((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.DatabaseName)) {
                        isSameUserLogin = true;
                      }else{
                        localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
                        localStorage.setItem('VS11099Contractor_Report', '');
                        localStorage.setItem('VS1AgedPayables_Report', '');
                        localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                        localStorage.setItem('VS1AgedReceivables_Report', '');
                        localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                        localStorage.setItem('VS1BalanceSheet_Report', '');
                        localStorage.setItem('VS1BalanceTrans_Report', '');
                        localStorage.setItem('VS1GeneralLedger_Report', '');
                        localStorage.setItem('VS1ProfitandLoss_Report', '');
                        localStorage.setItem('VS1Purchase_List', '');
                        localStorage.setItem('VS1Purchase_Report', '');
                        localStorage.setItem('VS1PurchaseSummary_Report', '');
                        localStorage.setItem('VS1ProductSales_List', '');
                        localStorage.setItem('VS1ProductSales_Report', '');
                        localStorage.setItem('VS1Sales_List', '');
                        localStorage.setItem('VS1Sales_Report', '');
                        localStorage.setItem('VS1SalesSummary_Report', '');
                        localStorage.setItem('VS1TaxSummary_Report', '');
                        localStorage.setItem('VS1TrialBalance_Report', '');
                        localStorage.setItem('VS1PrintStatements_Report', '');


                        localStorage.setItem('VS1AccoountList','');
                        localStorage.setItem('bankaccountid', '');
                      }
                    }



                    localStorage.setItem('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

                    var region = dataReturnRes.ProcessLog.RegionName;
                    localStorage.setItem('ERPLoggedCountry', region);

                    if(dataReturnRes.ProcessLog.RegionName === "Australia"){
                      localStorage.setItem('ERPCountryAbbr', 'AUD');
                    }else if(dataReturnRes.ProcessLog.RegionName === "Canada"){
                      localStorage.setItem('ERPCountryAbbr', 'CAD');
                    }else if(dataReturnRes.ProcessLog.RegionName === "Colombia"){
                      localStorage.setItem('ERPCountryAbbr', 'COP');
                    }else if(dataReturnRes.ProcessLog.RegionName === "Kuwait"){
                      localStorage.setItem('ERPCountryAbbr', 'KYD');
                    }else if(dataReturnRes.ProcessLog.RegionName === "Mexico"){
                      localStorage.setItem('ERPCountryAbbr', 'MXN');
                    }else if(dataReturnRes.ProcessLog.RegionName === "New Zealand"){
                      localStorage.setItem('ERPCountryAbbr', 'NZD');
                    }else if(dataReturnRes.ProcessLog.RegionName === "Qatar"){
                      localStorage.setItem('ERPCountryAbbr', 'QAR');
                    }else if(dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia"){
                      localStorage.setItem('ERPCountryAbbr', 'SAR');
                    }else if(dataReturnRes.ProcessLog.RegionName === "Singapore"){
                      localStorage.setItem('ERPCountryAbbr', 'SGD');
                    }else if(dataReturnRes.ProcessLog.RegionName === "South Africa"){
                      localStorage.setItem('ERPCountryAbbr', 'ZAR');
                    }else if(dataReturnRes.ProcessLog.RegionName === "United Arab Emirates"){
                      localStorage.setItem('ERPCountryAbbr', 'AED');
                    }else if(dataReturnRes.ProcessLog.RegionName === "United Kingdom"){
                      localStorage.setItem('ERPCountryAbbr', 'GBP');
                    }else if(dataReturnRes.ProcessLog.RegionName === "United States of America"){
                      localStorage.setItem('ERPCountryAbbr', 'USD');
                    }
                    localStorage.setItem('ERPDefaultDepartment', 'Default');
                    localStorage.setItem('ERPDefaultUOM', '');
                    localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                    dataReturnRes.ProcessLog.VS1AdminPassword = userLoginPassword;
                    dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                    var ERPIPAdderess= "";
                    if(dataReturnRes.ProcessLog.ServerName == "110.145.181.218"){
                      ERPIPAdderess= "www.login.vs1cloud.com";
                    }else{
                      ERPIPAdderess= dataReturnRes.ProcessLog.ServerName;
                    }
               var ERPdbName = dataReturnRes.ProcessLog.DatabaseName;

               var ERPport = dataReturnRes.ProcessLog.APIPort;

                 localStorage.setItem('mycloudLogonUserEmail', userLoginEmail);

               var ERPuserName = userLoginEmail;
                var ERPLoggeduserName = userLoginEmail;
               var ERPpassword = userLoginPassword;

               let erpdbname = ERPIPAdderess+','+ERPdbName+','+ERPuserName+','+ERPpassword+','+ERPport;
              let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
              $.each(licenceOptions, function (item, option) {

                        if(option.ModuleName == 'Accounts Payable Reports'){
                          isAccountsLicence = false;
                        }else if(option.ModuleName == 'Statements'){
                          isContactsLicence = false;
                        }else if((option.ModuleName == 'Expense Claims / Receipt Claiming')){
                          isExpenseClaimsLicence = false;
                        }else if(option.ModuleName == 'CloudDashboard'){
                          isDashboardLicence = false;
                        }else if(option.ModuleName == 'CloudFixedAssets'){
                          isFixedAssetsLicence = false;
                        }else if(option.ModuleName == 'Inventory Tracking'){
                          isInventoryLicence = false;
                        }else if(option.ModuleName == 'CloudMain'){
                          isMainLicence = false;
                        }else if(option.ModuleName == 'Manufacturing'){
                          isManufacturingLicence = false;
                        }else if(option.ModuleName == 'Payemnts'){
                          isPaymentsLicence = false;
                        }else if(option.ModuleName == 'Bills'){
                          isPurchasesLicence = false;
                        }else if(option.ModuleName == 'Reports Dashboard'){
                           isReportsLicence = false;
                        }else if((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')){
                          isSalesLicence = false;
                        }else if(option.ModuleName == 'CloudSettings'){
                          isSettingsLicence = true;
                        }else if((option.ModuleName == 'Shipping')){
                          isShippingLicence = false;
                        }else if(option.ModuleName == 'Stock Adjustments'){
                          isStockTakeLicence = false;
                        }else if(option.ModuleName == 'Stock Adjustments'){
                          isStockTransferLicence = false;
                        }else if((option.ModuleName == 'Seed To Sale')){
                          isSeedToSaleLicence = true;
                        }else if(option.ModuleName == 'CloudBanking'){
                          isBankingLicence = true;
                        }else if((option.ModuleName == 'Payroll Integration') ){
                          isPayrollLicence = false;
                        }else if((option.ModuleName == 'Manufacturing')){
                          isManufacturingLicence = false;
                        }else if((option.ModuleName == 'POS')){
                          isPOSLicence = false;
                        }else if((option.ModuleName == 'WMS')){
                          isWMSLicence = false;
                        }else if((option.ModuleName == 'Matrix')){
                          isMatrixLicence = false;
                        }else if((option.ModuleName == 'Add Extra User')){
                          isAddExtraUserLicence = true;
                        }else if((option.ModuleName == 'FX Currency')){
                          isFxCurrencyLicence = false;
                        }else if((option.ModuleName == 'Use Foreign Currency')){
                          isFxCurrencyLicence = true;
                        }else if((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')){
                          if(option.ModuleActive){
                            isTrueERPConnection = false;
                          }else{
                            isTrueERPConnection = false;
                          }
                        }

              });

              /* Remove licence */

                  localStorage.setItem('CloudTrueERPModule', isTrueERPConnection);
                  localStorage.setItem('CloudAccountsLicence', isAccountsLicence);
                  localStorage.setItem('CloudContactsLicence', isContactsLicence);
                  localStorage.setItem('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
                  localStorage.setItem('CloudPaymentsLicence', isPaymentsLicence);
                  localStorage.setItem('CloudReportsLicence', isReportsLicence);
                  localStorage.setItem('CloudSettingsLicence', isSettingsLicence);

                  localStorage.setItem('CloudMainLicence', isMainLicence);
                  localStorage.setItem('CloudDashboardLicence', isDashboardLicence);


                  localStorage.setItem('CloudSeedToSaleLicence', isSeedToSaleLicence);
                  localStorage.setItem('CloudBankingLicence', isBankingLicence);
                  localStorage.setItem('CloudPayrollLicence', isPayrollLicence);

                  localStorage.setItem('CloudFixedAssetsLicence', isFixedAssetsLicence);
                  localStorage.setItem('CloudInventoryLicence', isInventoryLicence);
                  localStorage.setItem('CloudManufacturingLicence', isManufacturingLicence);
                  localStorage.setItem('CloudPurchasesLicence', isPurchasesLicence);
                  localStorage.setItem('CloudSalesLicence', isSalesLicence);
                  localStorage.setItem('CloudShippingLicence', isShippingLicence);
                  localStorage.setItem('CloudStockTakeLicence', isStockTakeLicence);
                  localStorage.setItem('CloudStockTransferLicence', isStockTransferLicence);

                  localStorage.setItem('CloudAddExtraLicence', isAddExtraUserLicence);
                  localStorage.setItem('CloudMatrixLicence', isMatrixLicence);
                  localStorage.setItem('CloudPOSLicence', isPOSLicence);
                  localStorage.setItem('CloudUseForeignLicence', isFxCurrencyLicence);
                  localStorage.setItem('CloudWMSLicence', isWMSLicence);
                    /* End Remove licence */

                    if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined){
                      swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
                      $('.fullScreenSpin').css('display','none');
                      $('.loginSpinner').css('display','none');
                      return false;

                    };
                    if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401){
                      swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
                      $('.fullScreenSpin').css('display','none');
                      $('.loginSpinner').css('display','none');
                      return false;

                    };






            localStorage.setItem('mycloudLogonUsername', ERPuserName);
            localStorage.setItem('mycloudLogonUserEmail', ERPuserName);

          localStorage.setItem('myerpPassword', userLoginPassword);
          localStorage.setItem('mySessionEmployee', ERPuserName);

          localStorage.setItem('EIPAddress', ERPIPAdderess);
          localStorage.setItem('EUserName', ERPuserName);
          localStorage.setItem('EPassword', ERPpassword);
          localStorage.setItem('EDatabase', ERPdbName);
          localStorage.setItem('EPort', ERPport);
          loggedUserEventFired = true;

          localStorage.setItem('mainEIPAddress', licenceIPAddress);
          localStorage.setItem('mainEPort', checkSSLPorts);


          if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields){
          localStorage.setItem('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName||'');
          localStorage.setItem('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address||'');
          localStorage.setItem('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2||'');
          localStorage.setItem('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN||'');
          localStorage.setItem('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber||'');
          localStorage.setItem('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL||'');

          localStorage.setItem('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass||'');
          localStorage.setItem('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM||'');



          localStorage.setItem('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault||'');
          localStorage.setItem('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc||'');
          localStorage.setItem('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc||'');


          localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT||Currency+'0');
          localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY||0);
          localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT||Currency+'0');
          localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY||0);
          sessionStorage.setItem("pageLoaded", true);
          localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
          localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
          localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
          localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

          localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


          localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx||0);
          localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx||0);
          localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx||0);
          localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx||0);

          if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields){
          localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic|| '');
          }else{
            localStorage.setItem('vs1LoggedEmployeeImages_dash','');
          }
          }else{
            localStorage.setItem('vs1companyName', '');
            localStorage.setItem('vs1companyaddress1', '');
            localStorage.setItem('vs1companyaddress2', '');
            localStorage.setItem('vs1companyABN', '');
            localStorage.setItem('vs1companyPhone', '');
            localStorage.setItem('vs1companyURL', '');

            localStorage.setItem('ERPDefaultDepartment', '');
            localStorage.setItem('ERPDefaultUOM', '');



            localStorage.setItem('ERPTaxCodePurchaseInc', '');
            localStorage.setItem('ERPTaxCodeSalesInc', '');


            localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
            localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
            localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
            localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

            localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
            localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
            localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
            localStorage.setItem('VS1OverDuePayablesQty_dash', '');

            localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


            localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
            localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
            localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
            localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
          }

          localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items)||'');
          localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items)||'');
          localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items)||'');
          localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items)||'');

            localStorage.setItem('LoggedUserEventFired', true);
            localStorage.setItem('userlogged_status', 'active');

                var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                var employeeUserLogon = ERPLoggeduserName;
                var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
                var employeename =dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                localStorage.setItem('mySessionEmployeeLoggedID', employeeUserID);
                localStorage.setItem('mySession', employeeUserLogon);
                var sessionDataToLog = localStorage.getItem('mySession');
                localStorage.setItem('mySessionEmployee', employeename);
                let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';
                if(userAccessOptions != ""){
                  addLoginData(dataReturnRes).then(function (datareturn) {
                    getAccessLevelData(userAccessOptions,isSameUserLogin);
                  }).catch(function (err) {
                    getAccessLevelData(userAccessOptions,isSameUserLogin);
                  });
                }
             }
                   }else{
                     swal({
                       title: 'Ooops...',
                       text: 'It seems we are unable to connect you to GreenTrack at the moment. Please try again in a few minutes.',
                       type: 'error',
                       showCancelButton: false,
                       confirmButtonText: 'Try Again'
                       }).then((result) => {
                       if (result.value) {
                         Meteor._reload.reload();
                       } else if (result.dismiss === 'cancel') {

                       }
                     });

                     $('.loginSpinner').css('display','none');
                     $('.fullScreenSpin').css('display','none');
                   }
                } else if(oReq.statusText == '') {
                  swal({
                    title: 'Ooops...',
                    text: 'It seems we are unable to connect you to GreenTrack at the moment. Please try again in a few minutes.',
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                      Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                  $('.loginSpinner').css('display','none');
                  $('.fullScreenSpin').css('display','none');
                }else if(oReq.readyState == 4 && oReq.status == 403){
                  swal({
                    title: 'Ooops...',
                    text: 'It seems we are unable to connect you to GreenTrack at the moment. Please try again in a few minutes.',
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                      Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                  $('.loginSpinner').css('display','none');
                  $('.fullScreenSpin').css('display','none');
                }else if(oReq.readyState == 4 && oReq.status == 406){
                  swal({
                    title: 'Oooops...',
                    text: oReq.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                      Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                  $('.loginSpinner').css('display','none');
                  $('.fullScreenSpin').css('display','none');
                }else if(oReq.readyState == 4 && oReq.status == 500){
                  var ErrorResponse = oReq.getResponseHeader('errormessage');
                  if (ErrorResponse.indexOf("Access violation") >= 0){
                    swal({
                      title: 'Your database is being created. ',
                      text: "Please try again in 10 minutes",
                      type: 'info',
                      showCancelButton: false,
                      confirmButtonText: 'Try Again'
                      }).then((result) => {
                      if (result.value) {
                        Meteor._reload.reload();
                      } else if (result.dismiss === 'cancel') {

                      }
                    });
                  }else{
                    swal({
                      title: 'Oooops...',
                      text: oReq.getResponseHeader('errormessage'),
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonText: 'Try Again'
                      }).then((result) => {
                      if (result.value) {
                        Meteor._reload.reload();
                      } else if (result.dismiss === 'cancel') {

                      }
                    });
                  }
                  $('.loginSpinner').css('display','none');
                  $('.fullScreenSpin').css('display','none');
                }else{

                }
            }
            }else{
              let dataReturnRes = dataObject[0].data;
              if(dataReturnRes.ProcessLog.VS1AdminPassword){
              if ($("#erppassword").val() != dataReturnRes.ProcessLog.VS1AdminPassword) {
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
                swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
                $("#erppassword").focus();
                e.preventDefault();
                return false;
              }
            }

              if(dataReturnRes.ProcessLog.ResponseStatus != "OK"){
         if(dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due"){
           $('.loginSpinner').css('display','none');
           $('.fullScreenSpin').css('display','none');

           swal({
             title: 'You Seem To Have Missed a Payment Recently, Can You Please Update your Subscription Information!',
             text: '',
             type: 'error',
             showCancelButton: true,
             confirmButtonText: 'Update Payment',
             cancelButtonText: 'Cancel'
           }).then((result) => {
             if (result.value) {
               window.open('https://magento-473757-1929062.cloudwaysapps.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_self');
             } else if (result.dismiss === 'cancel') {

             }
           });

         }else{
           swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');

           $('.loginSpinner').css('display','none');
           $('.fullScreenSpin').css('display','none');
         }



       }else{
         Meteor.call('readMethod',dataReturnRes.ProcessLog.VS1AdminUserName, function(error, result){
         if(error){

         }else{
         let regUserDetails = result;
         if(regUserDetails){
           if(regUserDetails.length === 0){

           }
               localStorage.setItem('mycloudLogonDBID', regUserDetails.clouddatabaseID);
               localStorage.setItem('mycloudLogonID', regUserDetails._id);

         }
         }

         });

         localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
         localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
         localStorage.setItem('isGreenTrack', true);
         if(!localStorage.getItem('VS1loggedDatabase')){
           localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
           localStorage.setItem('VS11099Contractor_Report', '');
           localStorage.setItem('VS1AgedPayables_Report', '');
           localStorage.setItem('VS1AgedPayablesSummary_Report', '');
           localStorage.setItem('VS1AgedReceivables_Report', '');
           localStorage.setItem('VS1AgedReceivableSummary_Report', '');
           localStorage.setItem('VS1BalanceSheet_Report', '');
           localStorage.setItem('VS1BalanceTrans_Report', '');
           localStorage.setItem('VS1GeneralLedger_Report', '');
           localStorage.setItem('VS1ProfitandLoss_Report', '');
           localStorage.setItem('VS1Purchase_List', '');
           localStorage.setItem('VS1Purchase_Report', '');
           localStorage.setItem('VS1PurchaseSummary_Report', '');
           localStorage.setItem('VS1ProductSales_List', '');
           localStorage.setItem('VS1ProductSales_Report', '');
           localStorage.setItem('VS1Sales_List', '');
           localStorage.setItem('VS1Sales_Report', '');
           localStorage.setItem('VS1SalesSummary_Report', '');
           localStorage.setItem('VS1TaxSummary_Report', '');
           localStorage.setItem('VS1TrialBalance_Report', '');
           localStorage.setItem('VS1PrintStatements_Report', '');
           localStorage.setItem('bankaccountid', '');

           localStorage.setItem('VS1ProductList', '');
           localStorage.setItem('VS1CustomerList', '');
           localStorage.setItem('VS1SupplierList', '');
           localStorage.setItem('VS1AccountList', '');
           localStorage.setItem('VS1TaxCodeList', '');
           localStorage.setItem('VS1TermsList', '');
           localStorage.setItem('VS1DepartmentList', '');
           localStorage.setItem('VS1CurrencyList', '');
           localStorage.setItem('VS1LeadStatusList', '');
           localStorage.setItem('VS1ShippingMethodList', '');
           localStorage.setItem('VS1AccountTypeList', '');
           localStorage.setItem('VS1ERPCombinedContactsList', '');
           localStorage.setItem('VS1EmployeeList', '');
           localStorage.setItem('VS1JournalEntryLineList', '');
           localStorage.setItem('VS1BankAccountReportList', '');
           localStorage.setItem('VS1TInvoiceList', '');
           localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
           localStorage.setItem('VS1BackOrderSalesListList', '');
           localStorage.setItem('VS1TPurchaseOrderList', '');
           localStorage.setItem('VS1TReconcilationList', '');
           localStorage.setItem('VS1TChequeList', '');
           localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
           localStorage.setItem('VS1TAppUserList', '');
           localStorage.setItem('VS1TJobVS1List', '');
           localStorage.setItem('VS1TStockAdjustEntryList', '');
           localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
           localStorage.setItem('VS1TbillReport', '');
           localStorage.setItem('VS1TbillReport', '');
           localStorage.setItem('VS1TCreditList', '');
           localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
           localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
           localStorage.setItem('VS1TSalesList', '');
         }else{
           if((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.DatabaseName)) {
             isSameUserLogin = true;
           }else{
             localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
             localStorage.setItem('VS11099Contractor_Report', '');
             localStorage.setItem('VS1AgedPayables_Report', '');
             localStorage.setItem('VS1AgedPayablesSummary_Report', '');
             localStorage.setItem('VS1AgedReceivables_Report', '');
             localStorage.setItem('VS1AgedReceivableSummary_Report', '');
             localStorage.setItem('VS1BalanceSheet_Report', '');
             localStorage.setItem('VS1BalanceTrans_Report', '');
             localStorage.setItem('VS1GeneralLedger_Report', '');
             localStorage.setItem('VS1ProfitandLoss_Report', '');
             localStorage.setItem('VS1Purchase_List', '');
             localStorage.setItem('VS1Purchase_Report', '');
             localStorage.setItem('VS1PurchaseSummary_Report', '');
             localStorage.setItem('VS1ProductSales_List', '');
             localStorage.setItem('VS1ProductSales_Report', '');
             localStorage.setItem('VS1Sales_List', '');
             localStorage.setItem('VS1Sales_Report', '');
             localStorage.setItem('VS1SalesSummary_Report', '');
             localStorage.setItem('VS1TaxSummary_Report', '');
             localStorage.setItem('VS1TrialBalance_Report', '');
             localStorage.setItem('VS1PrintStatements_Report', '');


             localStorage.setItem('VS1AccoountList','');
             localStorage.setItem('bankaccountid', '');
           }
         }



         localStorage.setItem('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

         var region = dataReturnRes.ProcessLog.RegionName;
         localStorage.setItem('ERPLoggedCountry', region);

         if(dataReturnRes.ProcessLog.RegionName === "Australia"){
           localStorage.setItem('ERPCountryAbbr', 'AUD');
         }else if(dataReturnRes.ProcessLog.RegionName === "Canada"){
           localStorage.setItem('ERPCountryAbbr', 'CAD');
         }else if(dataReturnRes.ProcessLog.RegionName === "Colombia"){
           localStorage.setItem('ERPCountryAbbr', 'COP');
         }else if(dataReturnRes.ProcessLog.RegionName === "Kuwait"){
           localStorage.setItem('ERPCountryAbbr', 'KYD');
         }else if(dataReturnRes.ProcessLog.RegionName === "Mexico"){
           localStorage.setItem('ERPCountryAbbr', 'MXN');
         }else if(dataReturnRes.ProcessLog.RegionName === "New Zealand"){
           localStorage.setItem('ERPCountryAbbr', 'NZD');
         }else if(dataReturnRes.ProcessLog.RegionName === "Qatar"){
           localStorage.setItem('ERPCountryAbbr', 'QAR');
         }else if(dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia"){
           localStorage.setItem('ERPCountryAbbr', 'SAR');
         }else if(dataReturnRes.ProcessLog.RegionName === "Singapore"){
           localStorage.setItem('ERPCountryAbbr', 'SGD');
         }else if(dataReturnRes.ProcessLog.RegionName === "South Africa"){
           localStorage.setItem('ERPCountryAbbr', 'ZAR');
         }else if(dataReturnRes.ProcessLog.RegionName === "United Arab Emirates"){
           localStorage.setItem('ERPCountryAbbr', 'AED');
         }else if(dataReturnRes.ProcessLog.RegionName === "United Kingdom"){
           localStorage.setItem('ERPCountryAbbr', 'GBP');
         }else if(dataReturnRes.ProcessLog.RegionName === "United States of America"){
           localStorage.setItem('ERPCountryAbbr', 'USD');
         }

         localStorage.setItem('ERPDefaultDepartment', 'Default');
         localStorage.setItem('ERPDefaultUOM', '');
         localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);

         var ERPIPAdderess= "";
         if(dataReturnRes.ProcessLog.ServerName == "110.145.181.218"){
           ERPIPAdderess= "www.login.vs1cloud.com";
         }else{
           ERPIPAdderess= dataReturnRes.ProcessLog.ServerName;
         }
    var ERPdbName = dataReturnRes.ProcessLog.DatabaseName;

    var ERPport = dataReturnRes.ProcessLog.APIPort;


      localStorage.setItem('mycloudLogonUserEmail', userLoginEmail);

    var ERPuserName = userLoginEmail;
     var ERPLoggeduserName = userLoginEmail;
    var ERPpassword = userLoginPassword;

    let erpdbname = ERPIPAdderess+','+ERPdbName+','+ERPuserName+','+ERPpassword+','+ERPport;
    let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
    $.each(licenceOptions, function (item, option) {

              if(option.ModuleName == 'Accounts Payable Reports'){
                isAccountsLicence = false;
              }else if(option.ModuleName == 'Statements'){
                isContactsLicence = false;
              }else if((option.ModuleName == 'Expense Claims / Receipt Claiming')){
                isExpenseClaimsLicence = false;
              }else if(option.ModuleName == 'CloudDashboard'){
                isDashboardLicence = false;
              }else if(option.ModuleName == 'CloudFixedAssets'){
                isFixedAssetsLicence = false;
              }else if(option.ModuleName == 'Inventory Tracking'){
                isInventoryLicence = false;
              }else if(option.ModuleName == 'CloudMain'){
                isMainLicence = false;
              }else if(option.ModuleName == 'Manufacturing'){
                isManufacturingLicence = false;
              }else if(option.ModuleName == 'Payemnts'){
                isPaymentsLicence = false;
              }else if(option.ModuleName == 'Bills'){
                isPurchasesLicence = false;
              }else if(option.ModuleName == 'Reports Dashboard'){
                 isReportsLicence = false;
              }else if((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')){
                isSalesLicence = false;
              }else if(option.ModuleName == 'CloudSettings'){
                isSettingsLicence = true;
              }else if((option.ModuleName == 'Shipping')){
                isShippingLicence = false;
              }else if(option.ModuleName == 'Stock Adjustments'){
                isStockTakeLicence = false;
              }else if(option.ModuleName == 'Stock Adjustments'){
                isStockTransferLicence = false;
              }else if((option.ModuleName == 'Seed To Sale')){
                isSeedToSaleLicence = true;
              }else if(option.ModuleName == 'CloudBanking'){
                isBankingLicence = true;
              }else if((option.ModuleName == 'Payroll Integration') ){
                isPayrollLicence = false;
              }else if((option.ModuleName == 'Manufacturing')){
                isManufacturingLicence = false;
              }else if((option.ModuleName == 'POS')){
                isPOSLicence = false;
              }else if((option.ModuleName == 'WMS')){
                isWMSLicence = false;
              }else if((option.ModuleName == 'Matrix')){
                isMatrixLicence = false;
              }else if((option.ModuleName == 'Add Extra User')){
                isAddExtraUserLicence = true;
              }else if((option.ModuleName == 'FX Currency')){
                isFxCurrencyLicence = false;
              }else if((option.ModuleName == 'Use Foreign Currency')){
                isFxCurrencyLicence = true;
              }else if((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')){
                if(option.ModuleActive){
                  isTrueERPConnection = false;
                }else{
                  isTrueERPConnection = false;
                }
              }

    });

    /* Remove licence */

       localStorage.setItem('CloudTrueERPModule', isTrueERPConnection);
       localStorage.setItem('CloudAccountsLicence', isAccountsLicence);
       localStorage.setItem('CloudContactsLicence', isContactsLicence);
       localStorage.setItem('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
       localStorage.setItem('CloudPaymentsLicence', isPaymentsLicence);
       localStorage.setItem('CloudReportsLicence', isReportsLicence);
       localStorage.setItem('CloudSettingsLicence', isSettingsLicence);

       localStorage.setItem('CloudMainLicence', isMainLicence);
       localStorage.setItem('CloudDashboardLicence', isDashboardLicence);


       localStorage.setItem('CloudSeedToSaleLicence', isSeedToSaleLicence);
       localStorage.setItem('CloudBankingLicence', isBankingLicence);
       localStorage.setItem('CloudPayrollLicence', isPayrollLicence);

       localStorage.setItem('CloudFixedAssetsLicence', isFixedAssetsLicence);
       localStorage.setItem('CloudInventoryLicence', isInventoryLicence);
       localStorage.setItem('CloudManufacturingLicence', isManufacturingLicence);
       localStorage.setItem('CloudPurchasesLicence', isPurchasesLicence);
       localStorage.setItem('CloudSalesLicence', isSalesLicence);
       localStorage.setItem('CloudShippingLicence', isShippingLicence);
       localStorage.setItem('CloudStockTakeLicence', isStockTakeLicence);
       localStorage.setItem('CloudStockTransferLicence', isStockTransferLicence);

       localStorage.setItem('CloudAddExtraLicence', isAddExtraUserLicence);
       localStorage.setItem('CloudMatrixLicence', isMatrixLicence);
       localStorage.setItem('CloudPOSLicence', isPOSLicence);
       localStorage.setItem('CloudUseForeignLicence', isFxCurrencyLicence);
       localStorage.setItem('CloudWMSLicence', isWMSLicence);
         /* End Remove licence */

         if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined){
           swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
           $('.fullScreenSpin').css('display','none');
           $('.loginSpinner').css('display','none');
           return false;

         };

         if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401){
           swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
           $('.fullScreenSpin').css('display','none');
           $('.loginSpinner').css('display','none');
           return false;

         };



    localStorage.setItem('mycloudLogonUsername', ERPuserName);
    localStorage.setItem('mycloudLogonUserEmail', ERPuserName);

    localStorage.setItem('myerpPassword', userLoginPassword);
    localStorage.setItem('mySessionEmployee', ERPuserName);

    localStorage.setItem('EIPAddress', ERPIPAdderess);
    localStorage.setItem('EUserName', ERPuserName);
    localStorage.setItem('EPassword', ERPpassword);
    localStorage.setItem('EDatabase', ERPdbName);
    localStorage.setItem('EPort', ERPport);
    loggedUserEventFired = true;

    localStorage.setItem('mainEIPAddress', licenceIPAddress);
    localStorage.setItem('mainEPort', checkSSLPorts);

    if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields){
    localStorage.setItem('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName||'');
    localStorage.setItem('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address||'');
    localStorage.setItem('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2||'');
    localStorage.setItem('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN||'');
    localStorage.setItem('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber||'');
    localStorage.setItem('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL||'');

    localStorage.setItem('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass||'');
    localStorage.setItem('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM||'');



    localStorage.setItem('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault||'');
    localStorage.setItem('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc||'');
    localStorage.setItem('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc||'');


    localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT||Currency+'0');
    localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY||0);
    localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT||Currency+'0');
    localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY||0);
    sessionStorage.setItem("pageLoaded", true);
    localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
    localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
    localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
    localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

    localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


    localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx||0);
    localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx||0);
    localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx||0);
    localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx||0);

    if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields){
    localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic|| '');
    }else{
    localStorage.setItem('vs1LoggedEmployeeImages_dash','');
    }
    }else{
    localStorage.setItem('vs1companyName', '');
    localStorage.setItem('vs1companyaddress1', '');
    localStorage.setItem('vs1companyaddress2', '');
    localStorage.setItem('vs1companyABN', '');
    localStorage.setItem('vs1companyPhone', '');
    localStorage.setItem('vs1companyURL', '');

    localStorage.setItem('ERPDefaultDepartment', '');
    localStorage.setItem('ERPDefaultUOM', '');



    localStorage.setItem('ERPTaxCodePurchaseInc', '');
    localStorage.setItem('ERPTaxCodeSalesInc', '');


    localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
    localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
    localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
    localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

    localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
    localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
    localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
    localStorage.setItem('VS1OverDuePayablesQty_dash', '');

    localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


    localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
    localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
    localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
    localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
    }

    localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items)||'');
    localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items)||'');
    localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items)||'');
    localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items)||'');

    localStorage.setItem('LoggedUserEventFired', true);
    localStorage.setItem('userlogged_status', 'active');

     var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
     var employeeUserLogon = ERPLoggeduserName;
     var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
     var employeename =dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
     localStorage.setItem('mySessionEmployeeLoggedID', employeeUserID);
     localStorage.setItem('mySession', employeeUserLogon);
     var sessionDataToLog = localStorage.getItem('mySession');
     localStorage.setItem('mySessionEmployee', employeename);
     let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';
     if(userAccessOptions != ""){
       addLoginData(dataReturnRes).then(function (datareturn) {
         getAccessLevelData(userAccessOptions,isSameUserLogin);
       }).catch(function (err) {
         getAccessLevelData(userAccessOptions,isSameUserLogin);
       });
     }

    }
            }
          }).catch(function (err) {
            var serverTest = URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/erpapi/Vs1_Logon?Vs1UserName="'+userLoginEmail+'"&vs1Password="'+userLoginPassword+'"';

            var oReq = new XMLHttpRequest();
            oReq.open("GET",serverTest, true);
            oReq.setRequestHeader("database",vs1loggedDatatbase);
            oReq.setRequestHeader("username","VS1_Cloud_Admin");
            oReq.setRequestHeader("password","DptfGw83mFl1j&9");
            oReq.send();


            oReq.onreadystatechange = function() {

              if (oReq.readyState == 4 && oReq.status == 200) {
                localStorage.setItem('mainEIPAddress', licenceIPAddress);
                localStorage.setItem('mainEPort', checkSSLPorts);


                var dataReturnRes = JSON.parse(oReq.responseText);


                if(dataReturnRes.ProcessLog.ResponseStatus != "OK"){
                  if(dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due"){
                    $('.loginSpinner').css('display','none');
                    $('.fullScreenSpin').css('display','none');

                    swal({
                      title: 'You Seem To Have Missed a Payment Recently, Can You Please Update your Subscription Information!',
                      text: '',
                      type: 'error',
                      showCancelButton: true,
                      confirmButtonText: 'Update Payment',
                      cancelButtonText: 'Cancel'
                    }).then((result) => {
                      if (result.value) {
                        window.open('https://magento-473757-1929062.cloudwaysapps.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_self');
                      } else if (result.dismiss === 'cancel') {

                      }
                    });

                  }else{
                    swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');

                    $('.loginSpinner').css('display','none');
                    $('.fullScreenSpin').css('display','none');
                  }



                }else{



                  Meteor.call('readMethod',dataReturnRes.ProcessLog.VS1AdminUserName, function(error, result){
                  if(error){

                  }else{
                  let regUserDetails = result;
                  if(regUserDetails){
                    if(regUserDetails.length === 0){

                    }





                        localStorage.setItem('mycloudLogonDBID', regUserDetails.clouddatabaseID);
                        localStorage.setItem('mycloudLogonID', regUserDetails._id);

                  }
                  }

                  });

                  localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
                  localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
                  localStorage.setItem('isGreenTrack', true);
                  if(!localStorage.getItem('VS1loggedDatabase')){
                    localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
                    localStorage.setItem('VS11099Contractor_Report', '');
                    localStorage.setItem('VS1AgedPayables_Report', '');
                    localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                    localStorage.setItem('VS1AgedReceivables_Report', '');
                    localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                    localStorage.setItem('VS1BalanceSheet_Report', '');
                    localStorage.setItem('VS1BalanceTrans_Report', '');
                    localStorage.setItem('VS1GeneralLedger_Report', '');
                    localStorage.setItem('VS1ProfitandLoss_Report', '');
                    localStorage.setItem('VS1Purchase_List', '');
                    localStorage.setItem('VS1Purchase_Report', '');
                    localStorage.setItem('VS1PurchaseSummary_Report', '');
                    localStorage.setItem('VS1ProductSales_List', '');
                    localStorage.setItem('VS1ProductSales_Report', '');
                    localStorage.setItem('VS1Sales_List', '');
                    localStorage.setItem('VS1Sales_Report', '');
                    localStorage.setItem('VS1SalesSummary_Report', '');
                    localStorage.setItem('VS1TaxSummary_Report', '');
                    localStorage.setItem('VS1TrialBalance_Report', '');
                    localStorage.setItem('VS1PrintStatements_Report', '');
                    localStorage.setItem('bankaccountid', '');

                    localStorage.setItem('VS1ProductList', '');
                    localStorage.setItem('VS1CustomerList', '');
                    localStorage.setItem('VS1SupplierList', '');
                    localStorage.setItem('VS1AccountList', '');
                    localStorage.setItem('VS1TaxCodeList', '');
                    localStorage.setItem('VS1TermsList', '');
                    localStorage.setItem('VS1DepartmentList', '');
                    localStorage.setItem('VS1CurrencyList', '');
                    localStorage.setItem('VS1LeadStatusList', '');
                    localStorage.setItem('VS1ShippingMethodList', '');
                    localStorage.setItem('VS1AccountTypeList', '');
                    localStorage.setItem('VS1ERPCombinedContactsList', '');
                    localStorage.setItem('VS1EmployeeList', '');
                    localStorage.setItem('VS1JournalEntryLineList', '');
                    localStorage.setItem('VS1BankAccountReportList', '');
                    localStorage.setItem('VS1TInvoiceList', '');
                    localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
                    localStorage.setItem('VS1BackOrderSalesListList', '');
                    localStorage.setItem('VS1TPurchaseOrderList', '');
                    localStorage.setItem('VS1TReconcilationList', '');
                    localStorage.setItem('VS1TChequeList', '');
                    localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
                    localStorage.setItem('VS1TAppUserList', '');
                    localStorage.setItem('VS1TJobVS1List', '');
                    localStorage.setItem('VS1TStockAdjustEntryList', '');
                    localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
                    localStorage.setItem('VS1TbillReport', '');
                    localStorage.setItem('VS1TbillReport', '');
                    localStorage.setItem('VS1TCreditList', '');
                    localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
                    localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
                    localStorage.setItem('VS1TSalesList', '');
                  }else{
                    if((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.DatabaseName)) {
                      isSameUserLogin = true;
                    }else{
                      localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
                      localStorage.setItem('VS11099Contractor_Report', '');
                      localStorage.setItem('VS1AgedPayables_Report', '');
                      localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                      localStorage.setItem('VS1AgedReceivables_Report', '');
                      localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                      localStorage.setItem('VS1BalanceSheet_Report', '');
                      localStorage.setItem('VS1BalanceTrans_Report', '');
                      localStorage.setItem('VS1GeneralLedger_Report', '');
                      localStorage.setItem('VS1ProfitandLoss_Report', '');
                      localStorage.setItem('VS1Purchase_List', '');
                      localStorage.setItem('VS1Purchase_Report', '');
                      localStorage.setItem('VS1PurchaseSummary_Report', '');
                      localStorage.setItem('VS1ProductSales_List', '');
                      localStorage.setItem('VS1ProductSales_Report', '');
                      localStorage.setItem('VS1Sales_List', '');
                      localStorage.setItem('VS1Sales_Report', '');
                      localStorage.setItem('VS1SalesSummary_Report', '');
                      localStorage.setItem('VS1TaxSummary_Report', '');
                      localStorage.setItem('VS1TrialBalance_Report', '');
                      localStorage.setItem('VS1PrintStatements_Report', '');


                      localStorage.setItem('VS1AccoountList','');
                      localStorage.setItem('bankaccountid', '');
                    }
                  }



                  localStorage.setItem('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

                  var region = dataReturnRes.ProcessLog.RegionName;
                  localStorage.setItem('ERPLoggedCountry', region);

                  if(dataReturnRes.ProcessLog.RegionName === "Australia"){
                    localStorage.setItem('ERPCountryAbbr', 'AUD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Canada"){
                    localStorage.setItem('ERPCountryAbbr', 'CAD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Colombia"){
                    localStorage.setItem('ERPCountryAbbr', 'COP');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Kuwait"){
                    localStorage.setItem('ERPCountryAbbr', 'KYD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Mexico"){
                    localStorage.setItem('ERPCountryAbbr', 'MXN');
                  }else if(dataReturnRes.ProcessLog.RegionName === "New Zealand"){
                    localStorage.setItem('ERPCountryAbbr', 'NZD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Qatar"){
                    localStorage.setItem('ERPCountryAbbr', 'QAR');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia"){
                    localStorage.setItem('ERPCountryAbbr', 'SAR');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Singapore"){
                    localStorage.setItem('ERPCountryAbbr', 'SGD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "South Africa"){
                    localStorage.setItem('ERPCountryAbbr', 'ZAR');
                  }else if(dataReturnRes.ProcessLog.RegionName === "United Arab Emirates"){
                    localStorage.setItem('ERPCountryAbbr', 'AED');
                  }else if(dataReturnRes.ProcessLog.RegionName === "United Kingdom"){
                    localStorage.setItem('ERPCountryAbbr', 'GBP');
                  }else if(dataReturnRes.ProcessLog.RegionName === "United States of America"){
                    localStorage.setItem('ERPCountryAbbr', 'USD');
                  }
                  localStorage.setItem('ERPDefaultDepartment', 'Default');
                  localStorage.setItem('ERPDefaultUOM', '');
                  localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                  var ERPIPAdderess= "";
                  if(dataReturnRes.ProcessLog.ServerName == "110.145.181.218"){
                    ERPIPAdderess= "www.login.vs1cloud.com";
                  }else{
                    ERPIPAdderess= dataReturnRes.ProcessLog.ServerName;
                  }


             var ERPdbName = dataReturnRes.ProcessLog.DatabaseName;

             var ERPport = dataReturnRes.ProcessLog.APIPort;


               localStorage.setItem('mycloudLogonUserEmail', userLoginEmail);

             var ERPuserName = userLoginEmail;
              var ERPLoggeduserName = userLoginEmail;
             var ERPpassword = userLoginPassword;

             let erpdbname = ERPIPAdderess+','+ERPdbName+','+ERPuserName+','+ERPpassword+','+ERPport;
            let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
            $.each(licenceOptions, function (item, option) {

                      if(option.ModuleName == 'Accounts Payable Reports'){
                        isAccountsLicence = false;
                      }else if(option.ModuleName == 'Statements'){
                        isContactsLicence = false;
                      }else if((option.ModuleName == 'Expense Claims / Receipt Claiming')){
                        isExpenseClaimsLicence = false;
                      }else if(option.ModuleName == 'CloudDashboard'){
                        isDashboardLicence = false;
                      }else if(option.ModuleName == 'CloudFixedAssets'){
                        isFixedAssetsLicence = false;
                      }else if(option.ModuleName == 'Inventory Tracking'){
                        isInventoryLicence = false;
                      }else if(option.ModuleName == 'CloudMain'){
                        isMainLicence = false;
                      }else if(option.ModuleName == 'Manufacturing'){
                        isManufacturingLicence = false;
                      }else if(option.ModuleName == 'Payemnts'){
                        isPaymentsLicence = false;
                      }else if(option.ModuleName == 'Bills'){
                        isPurchasesLicence = false;
                      }else if(option.ModuleName == 'Reports Dashboard'){
                         isReportsLicence = false;
                      }else if((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')){
                        isSalesLicence = false;
                      }else if(option.ModuleName == 'CloudSettings'){
                        isSettingsLicence = true;
                      }else if((option.ModuleName == 'Shipping')){
                        isShippingLicence = false;
                      }else if(option.ModuleName == 'Stock Adjustments'){
                        isStockTakeLicence = false;
                      }else if(option.ModuleName == 'Stock Adjustments'){
                        isStockTransferLicence = false;
                      }else if((option.ModuleName == 'Seed To Sale')){
                        isSeedToSaleLicence = true;
                      }else if(option.ModuleName == 'CloudBanking'){
                        isBankingLicence = true;
                      }else if((option.ModuleName == 'Payroll Integration') ){
                        isPayrollLicence = false;
                      }else if((option.ModuleName == 'Manufacturing')){
                        isManufacturingLicence = false;
                      }else if((option.ModuleName == 'POS')){
                        isPOSLicence = false;
                      }else if((option.ModuleName == 'WMS')){
                        isWMSLicence = false;
                      }else if((option.ModuleName == 'Matrix')){
                        isMatrixLicence = false;
                      }else if((option.ModuleName == 'Add Extra User')){
                        isAddExtraUserLicence = true;
                      }else if((option.ModuleName == 'FX Currency')){
                        isFxCurrencyLicence = false;
                      }else if((option.ModuleName == 'Use Foreign Currency')){
                        isFxCurrencyLicence = true;
                      }else if((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')){
                        if(option.ModuleActive){
                          isTrueERPConnection = false;
                        }else{
                          isTrueERPConnection = false;
                        }
                      }

            });

            /* Remove licence */

                localStorage.setItem('CloudTrueERPModule', isTrueERPConnection);
                localStorage.setItem('CloudAccountsLicence', isAccountsLicence);
                localStorage.setItem('CloudContactsLicence', isContactsLicence);
                localStorage.setItem('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
                localStorage.setItem('CloudPaymentsLicence', isPaymentsLicence);
                localStorage.setItem('CloudReportsLicence', isReportsLicence);
                localStorage.setItem('CloudSettingsLicence', isSettingsLicence);

                localStorage.setItem('CloudMainLicence', isMainLicence);
                localStorage.setItem('CloudDashboardLicence', isDashboardLicence);


                localStorage.setItem('CloudSeedToSaleLicence', isSeedToSaleLicence);
                localStorage.setItem('CloudBankingLicence', isBankingLicence);
                localStorage.setItem('CloudPayrollLicence', isPayrollLicence);

                localStorage.setItem('CloudFixedAssetsLicence', isFixedAssetsLicence);
                localStorage.setItem('CloudInventoryLicence', isInventoryLicence);
                localStorage.setItem('CloudManufacturingLicence', isManufacturingLicence);
                localStorage.setItem('CloudPurchasesLicence', isPurchasesLicence);
                localStorage.setItem('CloudSalesLicence', isSalesLicence);
                localStorage.setItem('CloudShippingLicence', isShippingLicence);
                localStorage.setItem('CloudStockTakeLicence', isStockTakeLicence);
                localStorage.setItem('CloudStockTransferLicence', isStockTransferLicence);

                localStorage.setItem('CloudAddExtraLicence', isAddExtraUserLicence);
                localStorage.setItem('CloudMatrixLicence', isMatrixLicence);
                localStorage.setItem('CloudPOSLicence', isPOSLicence);
                localStorage.setItem('CloudUseForeignLicence', isFxCurrencyLicence);
                localStorage.setItem('CloudWMSLicence', isWMSLicence);
                  /* End Remove licence */

                  if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined){
                    swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
                    $('.fullScreenSpin').css('display','none');
                    $('.loginSpinner').css('display','none');
                    return false;

                  };

                  if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401){
                    swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
                    $('.fullScreenSpin').css('display','none');
                    $('.loginSpinner').css('display','none');
                    return false;

                  };


          localStorage.setItem('mycloudLogonUsername', ERPuserName);
          localStorage.setItem('mycloudLogonUserEmail', ERPuserName);

        localStorage.setItem('myerpPassword', userLoginPassword);
        localStorage.setItem('mySessionEmployee', ERPuserName);

        localStorage.setItem('EIPAddress', ERPIPAdderess);
        localStorage.setItem('EUserName', ERPuserName);
        localStorage.setItem('EPassword', ERPpassword);
        localStorage.setItem('EDatabase', ERPdbName);
        localStorage.setItem('EPort', ERPport);
        loggedUserEventFired = true;

        localStorage.setItem('mainEIPAddress', licenceIPAddress);
        localStorage.setItem('mainEPort', checkSSLPorts);

        if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields){
        localStorage.setItem('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName||'');
        localStorage.setItem('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address||'');
        localStorage.setItem('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2||'');
        localStorage.setItem('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN||'');
        localStorage.setItem('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber||'');
        localStorage.setItem('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL||'');

        localStorage.setItem('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass||'');
        localStorage.setItem('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM||'');



        localStorage.setItem('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault||'');
        localStorage.setItem('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc||'');
        localStorage.setItem('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc||'');


        localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT||Currency+'0');
        localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY||0);
        localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT||Currency+'0');
        localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY||0);
        sessionStorage.setItem("pageLoaded", true);
        localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
        localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
        localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
        localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

        localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


        localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx||0);
        localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx||0);
        localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx||0);
        localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx||0);

        if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields){
        localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic|| '');
        }else{
          localStorage.setItem('vs1LoggedEmployeeImages_dash','');
        }
        }else{
          localStorage.setItem('vs1companyName', '');
          localStorage.setItem('vs1companyaddress1', '');
          localStorage.setItem('vs1companyaddress2', '');
          localStorage.setItem('vs1companyABN', '');
          localStorage.setItem('vs1companyPhone', '');
          localStorage.setItem('vs1companyURL', '');

          localStorage.setItem('ERPDefaultDepartment', '');
          localStorage.setItem('ERPDefaultUOM', '');



          localStorage.setItem('ERPTaxCodePurchaseInc', '');
          localStorage.setItem('ERPTaxCodeSalesInc', '');


          localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
          localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
          localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
          localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

          localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
          localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
          localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
          localStorage.setItem('VS1OverDuePayablesQty_dash', '');

          localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


          localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
          localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
          localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
          localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
        }

        localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items)||'');
        localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items)||'');
        localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items)||'');
        localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items)||'');

          localStorage.setItem('LoggedUserEventFired', true);
          localStorage.setItem('userlogged_status', 'active');

              var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
              var employeeUserLogon = ERPLoggeduserName;
              var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
              var employeename =dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
              localStorage.setItem('mySessionEmployeeLoggedID', employeeUserID);
              localStorage.setItem('mySession', employeeUserLogon);
              var sessionDataToLog = localStorage.getItem('mySession');
              localStorage.setItem('mySessionEmployee', employeename);
              let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';
              if(userAccessOptions != ""){
                addLoginData(dataReturnRes).then(function (datareturn) {
                  getAccessLevelData(userAccessOptions,isSameUserLogin);
                }).catch(function (err) {
                  getAccessLevelData(userAccessOptions,isSameUserLogin);
                });
              }

              /*END APPUSER*/

           }

              } else if(oReq.statusText == '') {
                swal({
                  title: 'Oooops...',
                  text: "Connection Failed, Please try again",
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {

                  }
                });
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
              }else if(oReq.readyState == 4 && oReq.status == 403){
                swal({
                  title: 'Ooops...',
                  text: 'It seems we are unable to connect you to GreenTrack at the moment. Please try again in a few minutes.',
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {

                  }
                });
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
              }else if(oReq.readyState == 4 && oReq.status == 406){
                swal({
                  title: 'Oooops...',
                  text: oReq.getResponseHeader('errormessage'),
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {

                  }
                });
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
              }else if(oReq.readyState == 4 && oReq.status == 500){
                var ErrorResponse = oReq.getResponseHeader('errormessage');
                if (ErrorResponse.indexOf("Access violation") >= 0){
                  swal({
                    title: 'Your database is being created. ',
                    text: "Please try again in 10 minutes",
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                      Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                }else{
                  swal({
                    title: 'Oooops...',
                    text: oReq.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                      Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                }
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
              }else{

              }
          }
          });


        }
        else{

        var serverTest = URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/erpapi/Vs1_Logon?Vs1UserName="'+userLoginEmail+'"&vs1Password="'+userLoginPassword+'"';




        var oReq = new XMLHttpRequest();
        oReq.open("GET",serverTest, true);
        oReq.setRequestHeader("database",vs1loggedDatatbase);
        oReq.setRequestHeader("username","VS1_Cloud_Admin");
        oReq.setRequestHeader("password","DptfGw83mFl1j&9");
        oReq.send();


        oReq.onreadystatechange = function() {

          if (oReq.readyState == 4 && oReq.status == 200) {
            localStorage.setItem('mainEIPAddress', licenceIPAddress);
            localStorage.setItem('mainEPort', checkSSLPorts);


            var dataReturnRes = JSON.parse(oReq.responseText);


            if(dataReturnRes.ProcessLog.ResponseStatus != "OK"){
              if(dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due"){
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');

                swal({
                  title: 'You Seem To Have Missed a Payment Recently, Can You Please Update your Subscription Information!',
                  text: '',
                  type: 'error',
                  showCancelButton: true,
                  confirmButtonText: 'Update Payment',
                  cancelButtonText: 'Cancel'
                }).then((result) => {
                  if (result.value) {
                    window.open('https://magento-473757-1929062.cloudwaysapps.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_self');
                  } else if (result.dismiss === 'cancel') {

                  }
                });

              }else{
                swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');

                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
              }



            }else{


              Meteor.call('readMethod',dataReturnRes.ProcessLog.VS1AdminUserName, function(error, result){
              if(error){

              }else{
              let regUserDetails = result;
              if(regUserDetails){
                if(regUserDetails.length === 0){

                }





                    localStorage.setItem('mycloudLogonDBID', regUserDetails.clouddatabaseID);
                    localStorage.setItem('mycloudLogonID', regUserDetails._id);

              }
              }

              });

              localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
              localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
              localStorage.setItem('isGreenTrack', true);
              if(!localStorage.getItem('VS1loggedDatabase')){
                localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
                localStorage.setItem('VS11099Contractor_Report', '');
                localStorage.setItem('VS1AgedPayables_Report', '');
                localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                localStorage.setItem('VS1AgedReceivables_Report', '');
                localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                localStorage.setItem('VS1BalanceSheet_Report', '');
                localStorage.setItem('VS1BalanceTrans_Report', '');
                localStorage.setItem('VS1GeneralLedger_Report', '');
                localStorage.setItem('VS1ProfitandLoss_Report', '');
                localStorage.setItem('VS1Purchase_List', '');
                localStorage.setItem('VS1Purchase_Report', '');
                localStorage.setItem('VS1PurchaseSummary_Report', '');
                localStorage.setItem('VS1ProductSales_List', '');
                localStorage.setItem('VS1ProductSales_Report', '');
                localStorage.setItem('VS1Sales_List', '');
                localStorage.setItem('VS1Sales_Report', '');
                localStorage.setItem('VS1SalesSummary_Report', '');
                localStorage.setItem('VS1TaxSummary_Report', '');
                localStorage.setItem('VS1TrialBalance_Report', '');
                localStorage.setItem('VS1PrintStatements_Report', '');
                localStorage.setItem('bankaccountid', '');

                localStorage.setItem('VS1ProductList', '');
                localStorage.setItem('VS1CustomerList', '');
                localStorage.setItem('VS1SupplierList', '');
                localStorage.setItem('VS1AccountList', '');
                localStorage.setItem('VS1TaxCodeList', '');
                localStorage.setItem('VS1TermsList', '');
                localStorage.setItem('VS1DepartmentList', '');
                localStorage.setItem('VS1CurrencyList', '');
                localStorage.setItem('VS1LeadStatusList', '');
                localStorage.setItem('VS1ShippingMethodList', '');
                localStorage.setItem('VS1AccountTypeList', '');
                localStorage.setItem('VS1ERPCombinedContactsList', '');
                localStorage.setItem('VS1EmployeeList', '');
                localStorage.setItem('VS1JournalEntryLineList', '');
                localStorage.setItem('VS1BankAccountReportList', '');
                localStorage.setItem('VS1TInvoiceList', '');
                localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
                localStorage.setItem('VS1BackOrderSalesListList', '');
                localStorage.setItem('VS1TPurchaseOrderList', '');
                localStorage.setItem('VS1TReconcilationList', '');
                localStorage.setItem('VS1TChequeList', '');
                localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
                localStorage.setItem('VS1TAppUserList', '');
                localStorage.setItem('VS1TJobVS1List', '');
                localStorage.setItem('VS1TStockAdjustEntryList', '');
                localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
                localStorage.setItem('VS1TbillReport', '');
                localStorage.setItem('VS1TbillReport', '');
                localStorage.setItem('VS1TCreditList', '');
                localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
                localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
                localStorage.setItem('VS1TSalesList', '');
              }else{
                if((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.DatabaseName)) {
                  isSameUserLogin = true;
                }else{
                  localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
                  localStorage.setItem('VS11099Contractor_Report', '');
                  localStorage.setItem('VS1AgedPayables_Report', '');
                  localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                  localStorage.setItem('VS1AgedReceivables_Report', '');
                  localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                  localStorage.setItem('VS1BalanceSheet_Report', '');
                  localStorage.setItem('VS1BalanceTrans_Report', '');
                  localStorage.setItem('VS1GeneralLedger_Report', '');
                  localStorage.setItem('VS1ProfitandLoss_Report', '');
                  localStorage.setItem('VS1Purchase_List', '');
                  localStorage.setItem('VS1Purchase_Report', '');
                  localStorage.setItem('VS1PurchaseSummary_Report', '');
                  localStorage.setItem('VS1ProductSales_List', '');
                  localStorage.setItem('VS1ProductSales_Report', '');
                  localStorage.setItem('VS1Sales_List', '');
                  localStorage.setItem('VS1Sales_Report', '');
                  localStorage.setItem('VS1SalesSummary_Report', '');
                  localStorage.setItem('VS1TaxSummary_Report', '');
                  localStorage.setItem('VS1TrialBalance_Report', '');
                  localStorage.setItem('VS1PrintStatements_Report', '');


                  localStorage.setItem('VS1AccoountList','');
                  localStorage.setItem('bankaccountid', '');
                }
              }



              localStorage.setItem('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

              var region = dataReturnRes.ProcessLog.RegionName;
              localStorage.setItem('ERPLoggedCountry', region);

              if(dataReturnRes.ProcessLog.RegionName === "Australia"){
                localStorage.setItem('ERPCountryAbbr', 'AUD');
              }else if(dataReturnRes.ProcessLog.RegionName === "Canada"){
                localStorage.setItem('ERPCountryAbbr', 'CAD');
              }else if(dataReturnRes.ProcessLog.RegionName === "Colombia"){
                localStorage.setItem('ERPCountryAbbr', 'COP');
              }else if(dataReturnRes.ProcessLog.RegionName === "Kuwait"){
                localStorage.setItem('ERPCountryAbbr', 'KYD');
              }else if(dataReturnRes.ProcessLog.RegionName === "Mexico"){
                localStorage.setItem('ERPCountryAbbr', 'MXN');
              }else if(dataReturnRes.ProcessLog.RegionName === "New Zealand"){
                localStorage.setItem('ERPCountryAbbr', 'NZD');
              }else if(dataReturnRes.ProcessLog.RegionName === "Qatar"){
                localStorage.setItem('ERPCountryAbbr', 'QAR');
              }else if(dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia"){
                localStorage.setItem('ERPCountryAbbr', 'SAR');
              }else if(dataReturnRes.ProcessLog.RegionName === "Singapore"){
                localStorage.setItem('ERPCountryAbbr', 'SGD');
              }else if(dataReturnRes.ProcessLog.RegionName === "South Africa"){
                localStorage.setItem('ERPCountryAbbr', 'ZAR');
              }else if(dataReturnRes.ProcessLog.RegionName === "United Arab Emirates"){
                localStorage.setItem('ERPCountryAbbr', 'AED');
              }else if(dataReturnRes.ProcessLog.RegionName === "United Kingdom"){
                localStorage.setItem('ERPCountryAbbr', 'GBP');
              }else if(dataReturnRes.ProcessLog.RegionName === "United States of America"){
                localStorage.setItem('ERPCountryAbbr', 'USD');
              }
              localStorage.setItem('ERPDefaultDepartment', 'Default');
              localStorage.setItem('ERPDefaultUOM', '');
              localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
              dataReturnRes.ProcessLog.VS1AdminPassword = userLoginPassword;
              dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
              var ERPIPAdderess= "";
              if(dataReturnRes.ProcessLog.ServerName == "110.145.181.218"){
                ERPIPAdderess= "www.login.vs1cloud.com";
              }else{
                ERPIPAdderess= dataReturnRes.ProcessLog.ServerName;
              }
         var ERPdbName = dataReturnRes.ProcessLog.DatabaseName;

         var ERPport = dataReturnRes.ProcessLog.APIPort;


           localStorage.setItem('mycloudLogonUserEmail', userLoginEmail);

         var ERPuserName = userLoginEmail;
          var ERPLoggeduserName = userLoginEmail;
         var ERPpassword = userLoginPassword;

         let erpdbname = ERPIPAdderess+','+ERPdbName+','+ERPuserName+','+ERPpassword+','+ERPport;
        let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
        $.each(licenceOptions, function (item, option) {

                  if(option.ModuleName == 'Accounts Payable Reports'){
                    isAccountsLicence = false;
                  }else if(option.ModuleName == 'Statements'){
                    isContactsLicence = false;
                  }else if((option.ModuleName == 'Expense Claims / Receipt Claiming')){
                    isExpenseClaimsLicence = false;
                  }else if(option.ModuleName == 'CloudDashboard'){
                    isDashboardLicence = false;
                  }else if(option.ModuleName == 'CloudFixedAssets'){
                    isFixedAssetsLicence = false;
                  }else if(option.ModuleName == 'Inventory Tracking'){
                    isInventoryLicence = false;
                  }else if(option.ModuleName == 'CloudMain'){
                    isMainLicence = false;
                  }else if(option.ModuleName == 'Manufacturing'){
                    isManufacturingLicence = false;
                  }else if(option.ModuleName == 'Payemnts'){
                    isPaymentsLicence = false;
                  }else if(option.ModuleName == 'Bills'){
                    isPurchasesLicence = false;
                  }else if(option.ModuleName == 'Reports Dashboard'){
                     isReportsLicence = false;
                  }else if((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')){
                    isSalesLicence = false;
                  }else if(option.ModuleName == 'CloudSettings'){
                    isSettingsLicence = true;
                  }else if((option.ModuleName == 'Shipping')){
                    isShippingLicence = false;
                  }else if(option.ModuleName == 'Stock Adjustments'){
                    isStockTakeLicence = false;
                  }else if(option.ModuleName == 'Stock Adjustments'){
                    isStockTransferLicence = false;
                  }else if((option.ModuleName == 'Seed To Sale')){
                    isSeedToSaleLicence = true;
                  }else if(option.ModuleName == 'CloudBanking'){
                    isBankingLicence = true;
                  }else if((option.ModuleName == 'Payroll Integration') ){
                    isPayrollLicence = false;
                  }else if((option.ModuleName == 'Manufacturing')){
                    isManufacturingLicence = false;
                  }else if((option.ModuleName == 'POS')){
                    isPOSLicence = false;
                  }else if((option.ModuleName == 'WMS')){
                    isWMSLicence = false;
                  }else if((option.ModuleName == 'Matrix')){
                    isMatrixLicence = false;
                  }else if((option.ModuleName == 'Add Extra User')){
                    isAddExtraUserLicence = true;
                  }else if((option.ModuleName == 'FX Currency')){
                    isFxCurrencyLicence = false;
                  }else if((option.ModuleName == 'Use Foreign Currency')){
                    isFxCurrencyLicence = true;
                  }else if((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')){
                    if(option.ModuleActive){
                      isTrueERPConnection = false;
                    }else{
                      isTrueERPConnection = false;
                    }
                  }

        });

        /* Remove licence */

            localStorage.setItem('CloudTrueERPModule', isTrueERPConnection);
            localStorage.setItem('CloudAccountsLicence', isAccountsLicence);
            localStorage.setItem('CloudContactsLicence', isContactsLicence);
            localStorage.setItem('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
            localStorage.setItem('CloudPaymentsLicence', isPaymentsLicence);
            localStorage.setItem('CloudReportsLicence', isReportsLicence);
            localStorage.setItem('CloudSettingsLicence', isSettingsLicence);

            localStorage.setItem('CloudMainLicence', isMainLicence);
            localStorage.setItem('CloudDashboardLicence', isDashboardLicence);


            localStorage.setItem('CloudSeedToSaleLicence', isSeedToSaleLicence);
            localStorage.setItem('CloudBankingLicence', isBankingLicence);
            localStorage.setItem('CloudPayrollLicence', isPayrollLicence);

            localStorage.setItem('CloudFixedAssetsLicence', isFixedAssetsLicence);
            localStorage.setItem('CloudInventoryLicence', isInventoryLicence);
            localStorage.setItem('CloudManufacturingLicence', isManufacturingLicence);
            localStorage.setItem('CloudPurchasesLicence', isPurchasesLicence);
            localStorage.setItem('CloudSalesLicence', isSalesLicence);
            localStorage.setItem('CloudShippingLicence', isShippingLicence);
            localStorage.setItem('CloudStockTakeLicence', isStockTakeLicence);
            localStorage.setItem('CloudStockTransferLicence', isStockTransferLicence);

            localStorage.setItem('CloudAddExtraLicence', isAddExtraUserLicence);
            localStorage.setItem('CloudMatrixLicence', isMatrixLicence);
            localStorage.setItem('CloudPOSLicence', isPOSLicence);
            localStorage.setItem('CloudUseForeignLicence', isFxCurrencyLicence);
            localStorage.setItem('CloudWMSLicence', isWMSLicence);
              /* End Remove licence */

              if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined){
                swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
                $('.fullScreenSpin').css('display','none');
                $('.loginSpinner').css('display','none');
                return false;

              };

              if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401){
                swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
                $('.fullScreenSpin').css('display','none');
                $('.loginSpinner').css('display','none');
                return false;

              };


              dataReturnRes.ProcessLog.VS1AdminPassword = userLoginPassword;
              dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
      localStorage.setItem('mycloudLogonUsername', ERPuserName);
      localStorage.setItem('mycloudLogonUserEmail', ERPuserName);

    localStorage.setItem('myerpPassword', userLoginPassword);
    localStorage.setItem('mySessionEmployee', ERPuserName);

    localStorage.setItem('EIPAddress', ERPIPAdderess);
    localStorage.setItem('EUserName', ERPuserName);
    localStorage.setItem('EPassword', ERPpassword);
    localStorage.setItem('EDatabase', ERPdbName);
    localStorage.setItem('EPort', ERPport);
    loggedUserEventFired = true;

    localStorage.setItem('mainEIPAddress', licenceIPAddress);
    localStorage.setItem('mainEPort', checkSSLPorts);

    if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields){
    localStorage.setItem('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName||'');
    localStorage.setItem('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address||'');
    localStorage.setItem('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2||'');
    localStorage.setItem('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN||'');
    localStorage.setItem('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber||'');
    localStorage.setItem('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL||'');

    localStorage.setItem('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass||'');
    localStorage.setItem('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM||'');



    localStorage.setItem('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault||'');
    localStorage.setItem('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc||'');
    localStorage.setItem('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc||'');


    localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT||Currency+'0');
    localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY||0);
    localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT||Currency+'0');
    localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY||0);
    sessionStorage.setItem("pageLoaded", true);
    localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
    localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
    localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
    localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

    localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


    localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx||0);
    localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx||0);
    localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx||0);
    localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx||0);

    if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields){
    localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic|| '');
    }else{
      localStorage.setItem('vs1LoggedEmployeeImages_dash','');
    }
    }else{
      localStorage.setItem('vs1companyName', '');
      localStorage.setItem('vs1companyaddress1', '');
      localStorage.setItem('vs1companyaddress2', '');
      localStorage.setItem('vs1companyABN', '');
      localStorage.setItem('vs1companyPhone', '');
      localStorage.setItem('vs1companyURL', '');

      localStorage.setItem('ERPDefaultDepartment', '');
      localStorage.setItem('ERPDefaultUOM', '');



      localStorage.setItem('ERPTaxCodePurchaseInc', '');
      localStorage.setItem('ERPTaxCodeSalesInc', '');


      localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
      localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
      localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
      localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

      localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
      localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
      localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
      localStorage.setItem('VS1OverDuePayablesQty_dash', '');

      localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


      localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
      localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
      localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
      localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
    }

    localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items)||'');
    localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items)||'');
    localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items)||'');
    localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items)||'');

      localStorage.setItem('LoggedUserEventFired', true);
      localStorage.setItem('userlogged_status', 'active');

          var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
          var employeeUserLogon = ERPLoggeduserName;
          var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
          var employeename =dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
          localStorage.setItem('mySessionEmployeeLoggedID', employeeUserID);
          localStorage.setItem('mySession', employeeUserLogon);
          var sessionDataToLog = localStorage.getItem('mySession');
          localStorage.setItem('mySessionEmployee', employeename);
          let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';
          if(userAccessOptions != ""){
            addLoginData(dataReturnRes).then(function (datareturn) {
              getAccessLevelData(userAccessOptions,isSameUserLogin);
            }).catch(function (err) {
              getAccessLevelData(userAccessOptions,isSameUserLogin);
            });



          }


          /*END APPUSER*/

       }

          } else if(oReq.statusText == '') {
            swal({
              title: 'Oooops...',
              text: "Connection Failed, Please try again",
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
              }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {

              }
            });
            $('.loginSpinner').css('display','none');
            $('.fullScreenSpin').css('display','none');
          }else if(oReq.readyState == 4 && oReq.status == 403){
            swal({
              title: 'Ooops...',
              text: 'It seems we are unable to connect you to GreenTrack at the moment. Please try again in a few minutes.',
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
              }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {

              }
            });
            $('.loginSpinner').css('display','none');
            $('.fullScreenSpin').css('display','none');
          }else if(oReq.readyState == 4 && oReq.status == 406){
            swal({
              title: 'Oooops...',
              text: oReq.getResponseHeader('errormessage'),
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Try Again'
              }).then((result) => {
              if (result.value) {
                Meteor._reload.reload();
              } else if (result.dismiss === 'cancel') {

              }
            });
            $('.loginSpinner').css('display','none');
            $('.fullScreenSpin').css('display','none');
          }else if(oReq.readyState == 4 && oReq.status == 500){
            var ErrorResponse = oReq.getResponseHeader('errormessage');
            if (ErrorResponse.indexOf("Access violation") >= 0){
              swal({
                title: 'Your database is being created. ',
                text: "Please try again in 10 minutes",
                type: 'info',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
                }).then((result) => {
                if (result.value) {
                  Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
              });
            }else{
              swal({
                title: 'Oooops...',
                text: oReq.getResponseHeader('errormessage'),
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
                }).then((result) => {
                if (result.value) {
                  Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
              });
            }
            $('.loginSpinner').css('display','none');
            $('.fullScreenSpin').css('display','none');
          }else{















          }
      }
      }

          }).catch(function (err) {
            var serverTest = URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/erpapi/Vs1_Logon?Vs1UserName="'+userLoginEmail+'"&vs1Password="'+userLoginPassword+'"';

            var oReq = new XMLHttpRequest();
            oReq.open("GET",serverTest, true);
            oReq.setRequestHeader("database",vs1loggedDatatbase);
            oReq.setRequestHeader("username","VS1_Cloud_Admin");
            oReq.setRequestHeader("password","DptfGw83mFl1j&9");
            oReq.send();


            oReq.onreadystatechange = function() {

              if (oReq.readyState == 4 && oReq.status == 200) {
                localStorage.setItem('mainEIPAddress', licenceIPAddress);
                localStorage.setItem('mainEPort', checkSSLPorts);


                var dataReturnRes = JSON.parse(oReq.responseText);


                if(dataReturnRes.ProcessLog.ResponseStatus != "OK"){
                  if(dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due"){
                    $('.loginSpinner').css('display','none');
                    $('.fullScreenSpin').css('display','none');

                    swal({
                      title: 'You Seem To Have Missed a Payment Recently, Can You Please Update your Subscription Information!',
                      text: '',
                      type: 'error',
                      showCancelButton: true,
                      confirmButtonText: 'Update Payment',
                      cancelButtonText: 'Cancel'
                    }).then((result) => {
                      if (result.value) {
                        window.open('https://magento-473757-1929062.cloudwaysapps.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_self');
                      } else if (result.dismiss === 'cancel') {

                      }
                    });

                  }else{
                    swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');

                    $('.loginSpinner').css('display','none');
                    $('.fullScreenSpin').css('display','none');
                  }



                }else{


                  Meteor.call('readMethod',dataReturnRes.ProcessLog.VS1AdminUserName, function(error, result){
                  if(error){

                  }else{
                  let regUserDetails = result;
                  if(regUserDetails){
                    if(regUserDetails.length === 0){

                    }





                        localStorage.setItem('mycloudLogonDBID', regUserDetails.clouddatabaseID);
                        localStorage.setItem('mycloudLogonID', regUserDetails._id);

                  }
                  }

                  });

                  localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
                  localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
                  localStorage.setItem('isGreenTrack', true);
                  if(!localStorage.getItem('VS1loggedDatabase')){
                    localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
                    localStorage.setItem('VS11099Contractor_Report', '');
                    localStorage.setItem('VS1AgedPayables_Report', '');
                    localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                    localStorage.setItem('VS1AgedReceivables_Report', '');
                    localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                    localStorage.setItem('VS1BalanceSheet_Report', '');
                    localStorage.setItem('VS1BalanceTrans_Report', '');
                    localStorage.setItem('VS1GeneralLedger_Report', '');
                    localStorage.setItem('VS1ProfitandLoss_Report', '');
                    localStorage.setItem('VS1Purchase_List', '');
                    localStorage.setItem('VS1Purchase_Report', '');
                    localStorage.setItem('VS1PurchaseSummary_Report', '');
                    localStorage.setItem('VS1ProductSales_List', '');
                    localStorage.setItem('VS1ProductSales_Report', '');
                    localStorage.setItem('VS1Sales_List', '');
                    localStorage.setItem('VS1Sales_Report', '');
                    localStorage.setItem('VS1SalesSummary_Report', '');
                    localStorage.setItem('VS1TaxSummary_Report', '');
                    localStorage.setItem('VS1TrialBalance_Report', '');
                    localStorage.setItem('VS1PrintStatements_Report', '');
                    localStorage.setItem('bankaccountid', '');

                    localStorage.setItem('VS1ProductList', '');
                    localStorage.setItem('VS1CustomerList', '');
                    localStorage.setItem('VS1SupplierList', '');
                    localStorage.setItem('VS1AccountList', '');
                    localStorage.setItem('VS1TaxCodeList', '');
                    localStorage.setItem('VS1TermsList', '');
                    localStorage.setItem('VS1DepartmentList', '');
                    localStorage.setItem('VS1CurrencyList', '');
                    localStorage.setItem('VS1LeadStatusList', '');
                    localStorage.setItem('VS1ShippingMethodList', '');
                    localStorage.setItem('VS1AccountTypeList', '');
                    localStorage.setItem('VS1ERPCombinedContactsList', '');
                    localStorage.setItem('VS1EmployeeList', '');
                    localStorage.setItem('VS1JournalEntryLineList', '');
                    localStorage.setItem('VS1BankAccountReportList', '');
                    localStorage.setItem('VS1TInvoiceList', '');
                    localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
                    localStorage.setItem('VS1BackOrderSalesListList', '');
                    localStorage.setItem('VS1TPurchaseOrderList', '');
                    localStorage.setItem('VS1TReconcilationList', '');
                    localStorage.setItem('VS1TChequeList', '');
                    localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
                    localStorage.setItem('VS1TAppUserList', '');
                    localStorage.setItem('VS1TJobVS1List', '');
                    localStorage.setItem('VS1TStockAdjustEntryList', '');
                    localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
                    localStorage.setItem('VS1TbillReport', '');
                    localStorage.setItem('VS1TbillReport', '');
                    localStorage.setItem('VS1TCreditList', '');
                    localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
                    localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
                    localStorage.setItem('VS1TSalesList', '');
                  }else{
                    if((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.DatabaseName)) {
                      isSameUserLogin = true;
                    }else{
                      localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.DatabaseName);
                      localStorage.setItem('VS11099Contractor_Report', '');
                      localStorage.setItem('VS1AgedPayables_Report', '');
                      localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                      localStorage.setItem('VS1AgedReceivables_Report', '');
                      localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                      localStorage.setItem('VS1BalanceSheet_Report', '');
                      localStorage.setItem('VS1BalanceTrans_Report', '');
                      localStorage.setItem('VS1GeneralLedger_Report', '');
                      localStorage.setItem('VS1ProfitandLoss_Report', '');
                      localStorage.setItem('VS1Purchase_List', '');
                      localStorage.setItem('VS1Purchase_Report', '');
                      localStorage.setItem('VS1PurchaseSummary_Report', '');
                      localStorage.setItem('VS1ProductSales_List', '');
                      localStorage.setItem('VS1ProductSales_Report', '');
                      localStorage.setItem('VS1Sales_List', '');
                      localStorage.setItem('VS1Sales_Report', '');
                      localStorage.setItem('VS1SalesSummary_Report', '');
                      localStorage.setItem('VS1TaxSummary_Report', '');
                      localStorage.setItem('VS1TrialBalance_Report', '');
                      localStorage.setItem('VS1PrintStatements_Report', '');


                      localStorage.setItem('VS1AccoountList','');
                      localStorage.setItem('bankaccountid', '');
                    }
                  }



                  localStorage.setItem('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

                  var region = dataReturnRes.ProcessLog.RegionName;
                  localStorage.setItem('ERPLoggedCountry', region);

                  if(dataReturnRes.ProcessLog.RegionName === "Australia"){
                    localStorage.setItem('ERPCountryAbbr', 'AUD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Canada"){
                    localStorage.setItem('ERPCountryAbbr', 'CAD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Colombia"){
                    localStorage.setItem('ERPCountryAbbr', 'COP');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Kuwait"){
                    localStorage.setItem('ERPCountryAbbr', 'KYD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Mexico"){
                    localStorage.setItem('ERPCountryAbbr', 'MXN');
                  }else if(dataReturnRes.ProcessLog.RegionName === "New Zealand"){
                    localStorage.setItem('ERPCountryAbbr', 'NZD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Qatar"){
                    localStorage.setItem('ERPCountryAbbr', 'QAR');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia"){
                    localStorage.setItem('ERPCountryAbbr', 'SAR');
                  }else if(dataReturnRes.ProcessLog.RegionName === "Singapore"){
                    localStorage.setItem('ERPCountryAbbr', 'SGD');
                  }else if(dataReturnRes.ProcessLog.RegionName === "South Africa"){
                    localStorage.setItem('ERPCountryAbbr', 'ZAR');
                  }else if(dataReturnRes.ProcessLog.RegionName === "United Arab Emirates"){
                    localStorage.setItem('ERPCountryAbbr', 'AED');
                  }else if(dataReturnRes.ProcessLog.RegionName === "United Kingdom"){
                    localStorage.setItem('ERPCountryAbbr', 'GBP');
                  }else if(dataReturnRes.ProcessLog.RegionName === "United States of America"){
                    localStorage.setItem('ERPCountryAbbr', 'USD');
                  }
                  localStorage.setItem('ERPDefaultDepartment', 'Default');
                  localStorage.setItem('ERPDefaultUOM', '');
                  localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                  dataReturnRes.ProcessLog.VS1AdminPassword = userLoginPassword;
                  dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                  var ERPIPAdderess= "";
                  if(dataReturnRes.ProcessLog.ServerName == "110.145.181.218"){
                    ERPIPAdderess= "www.login.vs1cloud.com";
                  }else{
                    ERPIPAdderess= dataReturnRes.ProcessLog.ServerName;
                  }
             var ERPdbName = dataReturnRes.ProcessLog.DatabaseName;

             var ERPport = dataReturnRes.ProcessLog.APIPort;


               localStorage.setItem('mycloudLogonUserEmail', userLoginEmail);

             var ERPuserName = userLoginEmail;
              var ERPLoggeduserName = userLoginEmail;
             var ERPpassword = userLoginPassword;

             let erpdbname = ERPIPAdderess+','+ERPdbName+','+ERPuserName+','+ERPpassword+','+ERPport;
            let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
            $.each(licenceOptions, function (item, option) {

                      if(option.ModuleName == 'Accounts Payable Reports'){
                        isAccountsLicence = false;
                      }else if(option.ModuleName == 'Statements'){
                        isContactsLicence = false;
                      }else if((option.ModuleName == 'Expense Claims / Receipt Claiming')){
                        isExpenseClaimsLicence = false;
                      }else if(option.ModuleName == 'CloudDashboard'){
                        isDashboardLicence = false;
                      }else if(option.ModuleName == 'CloudFixedAssets'){
                        isFixedAssetsLicence = false;
                      }else if(option.ModuleName == 'Inventory Tracking'){
                        isInventoryLicence = false;
                      }else if(option.ModuleName == 'CloudMain'){
                        isMainLicence = false;
                      }else if(option.ModuleName == 'Manufacturing'){
                        isManufacturingLicence = false;
                      }else if(option.ModuleName == 'Payemnts'){
                        isPaymentsLicence = false;
                      }else if(option.ModuleName == 'Bills'){
                        isPurchasesLicence = false;
                      }else if(option.ModuleName == 'Reports Dashboard'){
                         isReportsLicence = false;
                      }else if((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')){
                        isSalesLicence = false;
                      }else if(option.ModuleName == 'CloudSettings'){
                        isSettingsLicence = true;
                      }else if((option.ModuleName == 'Shipping')){
                        isShippingLicence = false;
                      }else if(option.ModuleName == 'Stock Adjustments'){
                        isStockTakeLicence = false;
                      }else if(option.ModuleName == 'Stock Adjustments'){
                        isStockTransferLicence = false;
                      }else if((option.ModuleName == 'Seed To Sale')){
                        isSeedToSaleLicence = true;
                      }else if(option.ModuleName == 'CloudBanking'){
                        isBankingLicence = true;
                      }else if((option.ModuleName == 'Payroll Integration') ){
                        isPayrollLicence = false;
                      }else if((option.ModuleName == 'Manufacturing')){
                        isManufacturingLicence = false;
                      }else if((option.ModuleName == 'POS')){
                        isPOSLicence = false;
                      }else if((option.ModuleName == 'WMS')){
                        isWMSLicence = false;
                      }else if((option.ModuleName == 'Matrix')){
                        isMatrixLicence = false;
                      }else if((option.ModuleName == 'Add Extra User')){
                        isAddExtraUserLicence = true;
                      }else if((option.ModuleName == 'FX Currency')){
                        isFxCurrencyLicence = false;
                      }else if((option.ModuleName == 'Use Foreign Currency')){
                        isFxCurrencyLicence = true;
                      }else if((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')){
                        if(option.ModuleActive){
                          isTrueERPConnection = false;
                        }else{
                          isTrueERPConnection = false;
                        }
                      }

            });

            /* Remove licence */

                localStorage.setItem('CloudTrueERPModule', isTrueERPConnection);
                localStorage.setItem('CloudAccountsLicence', isAccountsLicence);
                localStorage.setItem('CloudContactsLicence', isContactsLicence);
                localStorage.setItem('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
                localStorage.setItem('CloudPaymentsLicence', isPaymentsLicence);
                localStorage.setItem('CloudReportsLicence', isReportsLicence);
                localStorage.setItem('CloudSettingsLicence', isSettingsLicence);

                localStorage.setItem('CloudMainLicence', isMainLicence);
                localStorage.setItem('CloudDashboardLicence', isDashboardLicence);


                localStorage.setItem('CloudSeedToSaleLicence', isSeedToSaleLicence);
                localStorage.setItem('CloudBankingLicence', isBankingLicence);
                localStorage.setItem('CloudPayrollLicence', isPayrollLicence);

                localStorage.setItem('CloudFixedAssetsLicence', isFixedAssetsLicence);
                localStorage.setItem('CloudInventoryLicence', isInventoryLicence);
                localStorage.setItem('CloudManufacturingLicence', isManufacturingLicence);
                localStorage.setItem('CloudPurchasesLicence', isPurchasesLicence);
                localStorage.setItem('CloudSalesLicence', isSalesLicence);
                localStorage.setItem('CloudShippingLicence', isShippingLicence);
                localStorage.setItem('CloudStockTakeLicence', isStockTakeLicence);
                localStorage.setItem('CloudStockTransferLicence', isStockTransferLicence);

                localStorage.setItem('CloudAddExtraLicence', isAddExtraUserLicence);
                localStorage.setItem('CloudMatrixLicence', isMatrixLicence);
                localStorage.setItem('CloudPOSLicence', isPOSLicence);
                localStorage.setItem('CloudUseForeignLicence', isFxCurrencyLicence);
                localStorage.setItem('CloudWMSLicence', isWMSLicence);
                  /* End Remove licence */

                  if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined){
                    swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
                    $('.fullScreenSpin').css('display','none');
                    $('.loginSpinner').css('display','none');
                    return false;

                  };

                  if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401){
                    swal('Sorry, You do not have access to any Greentrack Modules!', '', 'error');
                    $('.fullScreenSpin').css('display','none');
                    $('.loginSpinner').css('display','none');
                    return false;

                  };



          localStorage.setItem('mycloudLogonUsername', ERPuserName);
          localStorage.setItem('mycloudLogonUserEmail', ERPuserName);

        localStorage.setItem('myerpPassword', userLoginPassword);
        localStorage.setItem('mySessionEmployee', ERPuserName);

        localStorage.setItem('EIPAddress', ERPIPAdderess);
        localStorage.setItem('EUserName', ERPuserName);
        localStorage.setItem('EPassword', ERPpassword);
        localStorage.setItem('EDatabase', ERPdbName);
        localStorage.setItem('EPort', ERPport);
        loggedUserEventFired = true;

        localStorage.setItem('mainEIPAddress', licenceIPAddress);
        localStorage.setItem('mainEPort', checkSSLPorts);

        if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields){
        localStorage.setItem('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName||'');
        localStorage.setItem('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address||'');
        localStorage.setItem('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2||'');
        localStorage.setItem('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN||'');
        localStorage.setItem('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber||'');
        localStorage.setItem('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL||'');

        localStorage.setItem('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass||'');
        localStorage.setItem('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM||'');



        localStorage.setItem('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault||'');
        localStorage.setItem('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc||'');
        localStorage.setItem('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc||'');


        localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT||Currency+'0');
        localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY||0);
        localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT||Currency+'0');
        localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY||0);
        sessionStorage.setItem("pageLoaded", true);
        localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
        localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
        localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
        localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

        localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


        localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx||0);
        localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx||0);
        localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx||0);
        localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx||0);

        if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields){
        localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic|| '');
        }else{
          localStorage.setItem('vs1LoggedEmployeeImages_dash','');
        }
        }else{
          localStorage.setItem('vs1companyName', '');
          localStorage.setItem('vs1companyaddress1', '');
          localStorage.setItem('vs1companyaddress2', '');
          localStorage.setItem('vs1companyABN', '');
          localStorage.setItem('vs1companyPhone', '');
          localStorage.setItem('vs1companyURL', '');

          localStorage.setItem('ERPDefaultDepartment', '');
          localStorage.setItem('ERPDefaultUOM', '');



          localStorage.setItem('ERPTaxCodePurchaseInc', '');
          localStorage.setItem('ERPTaxCodeSalesInc', '');


          localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
          localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
          localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
          localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

          localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
          localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
          localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
          localStorage.setItem('VS1OverDuePayablesQty_dash', '');

          localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


          localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
          localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
          localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
          localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
        }

        localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items)||'');
        localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items)||'');
        localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items)||'');
        localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items)||'');

          localStorage.setItem('LoggedUserEventFired', true);
          localStorage.setItem('userlogged_status', 'active');

              var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
              var employeeUserLogon = ERPLoggeduserName;
              var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
              var employeename =dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
              localStorage.setItem('mySessionEmployeeLoggedID', employeeUserID);
              localStorage.setItem('mySession', employeeUserLogon);
              var sessionDataToLog = localStorage.getItem('mySession');
              localStorage.setItem('mySessionEmployee', employeename);

              let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';
              if(userAccessOptions != ""){
                addLoginData(dataReturnRes).then(function (datareturn) {
                  getAccessLevelData(userAccessOptions,isSameUserLogin);
                }).catch(function (err) {
                  getAccessLevelData(userAccessOptions,isSameUserLogin);
                });
              }

           }

              } else if(oReq.statusText == '') {
                swal({
                  title: 'Oooops...',
                  text: "Connection Failed, Please try again",
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {

                  }
                });
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
              }else if(oReq.readyState == 4 && oReq.status == 403){
                swal({
                  title: 'Ooops...',
                  text: 'It seems we are unable to connect you to GreenTrack at the moment. Please try again in a few minutes.',
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {

                  }
                });
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
              }else if(oReq.readyState == 4 && oReq.status == 406){
                swal({
                  title: 'Oooops...',
                  text: oReq.getResponseHeader('errormessage'),
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonText: 'Try Again'
                  }).then((result) => {
                  if (result.value) {
                    Meteor._reload.reload();
                  } else if (result.dismiss === 'cancel') {

                  }
                });
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
              }else if(oReq.readyState == 4 && oReq.status == 500){
                var ErrorResponse = oReq.getResponseHeader('errormessage');
                if (ErrorResponse.indexOf("Access violation") >= 0){
                  swal({
                    title: 'Your database is being created. ',
                    text: "Please try again in 10 minutes",
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                      Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                }else{
                  swal({
                    title: 'Oooops...',
                    text: oReq.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                      Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                }

                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');
              }else{

              }
          }

        });

}

e.preventDefault();
});
$("#erppassword").keyup(function (e) {
  if (e.keyCode == 13) {
     $("#erplogin-button").trigger("click");
  }
});

$("#signmeout").click(function(e){
  e.preventDefault();
  $('.fullScreenSpin').css('display','inline-block');
  let userLoginEmail = $("#email").val();
  if(userLoginEmail === '') {
    let getLasTDatabase = localStorage.getItem('vs1Db');
    if(getLasTDatabase){
      deleteStoreDatabase(getLasTDatabase).then(function(data) {
        swal({
        title: 'You are now Signed Out of all devices',
        text: "",
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
        }).then((result) => {
        if (result.value) {
          location.reload(true);
        }
        });
        $('.fullScreenSpin').css('display','none');
     }).catch(function (err) {
       swal({
       title: 'You are now Signed Out of all devices',
       text: "",
       type: 'success',
       showCancelButton: false,
       confirmButtonText: 'OK'
       }).then((result) => {
       if (result.value) {
         location.reload(true);
       }
       });
       $('.fullScreenSpin').css('display','none');
     });
    }else{
    swal({
    title: 'You are now Signed Out of all devices',
    text: "",
    type: 'success',
    showCancelButton: false,
    confirmButtonText: 'OK'
    }).then((result) => {
    if (result.value) {
      location.reload(true);
    }
    });
    $('.fullScreenSpin').css('display','none');
  }
  }else{
    getStoreToDelete(userLoginEmail).then(function(data) {
      swal({
      title: 'You are now Signed Out of all devices',
      text: "",
      type: 'success',
      showCancelButton: false,
      confirmButtonText: 'OK'
      }).then((result) => {
      if (result.value) {
        location.reload(true);
      }
      });
      $('.fullScreenSpin').css('display','none');
   }).catch(function (err) {
     swal({
     title: 'You are now Signed Out of all devices',
     text: "",
     type: 'success',
     showCancelButton: false,
     confirmButtonText: 'OK'
     }).then((result) => {
     if (result.value) {
       location.reload(true);
     }
     });
     $('.fullScreenSpin').css('display','none');
   });
  }
});

$(".toggle-password").click(function() {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var passwordSecret = $("#erppassword");

    if (passwordSecret.attr("type") == "password") {
        passwordSecret.attr("type", "text");
    } else {
        passwordSecret.attr("type", "password");
    }
});

});
