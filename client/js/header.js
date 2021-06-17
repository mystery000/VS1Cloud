import { ReactiveVar } from 'meteor/reactive-var';
import {EmployeeProfileService} from './profile-service';
import {AccessLevelService} from './accesslevel-service';
import { CoreService } from '../js/core-service';

import {ProductService} from "../product/product-service";
import {UtilityService} from "../utility-service";
import {OrganisationService} from './organisation-service';

let utilityService = new UtilityService();
let productService = new ProductService();
let organizationService = new OrganisationService();

Template.header.onCreated(function(){
  const templateObject = Template.instance();

  templateObject.isCloudUserPass = new ReactiveVar();
  templateObject.isCloudUserPass.set(false);

  templateObject.includeDashboard = new ReactiveVar();
  templateObject.includeDashboard.set(false);
  templateObject.includeMain = new ReactiveVar();
  templateObject.includeMain.set(false);
  templateObject.includeInventory = new ReactiveVar();
  templateObject.includeInventory.set(false);
  templateObject.includeManufacturing = new ReactiveVar();
  templateObject.includeManufacturing.set(false);
  templateObject.includeAccessLevels = new ReactiveVar();
  templateObject.includeAccessLevels.set(false);
  templateObject.includeShipping = new ReactiveVar();
  templateObject.includeShipping.set(false);
  templateObject.includeStockTransfer = new ReactiveVar();
  templateObject.includeStockTransfer.set(false);
  templateObject.includeStockTake = new ReactiveVar();
  templateObject.includeStockTake.set(false);
  templateObject.includeSales = new ReactiveVar();
  templateObject.includeSales.set(false);
  templateObject.includeExpenseClaims = new ReactiveVar();
  templateObject.includeExpenseClaims.set(false);
  templateObject.includeFixedAssets = new ReactiveVar();
  templateObject.includeFixedAssets.set(false);
  templateObject.includePurchases = new ReactiveVar();
  templateObject.includePurchases.set(false);


  templateObject.includePayments = new ReactiveVar();
  templateObject.includePayments.set(false);
  templateObject.includeContacts = new ReactiveVar();
  templateObject.includeContacts.set(false);
  templateObject.includeAccounts = new ReactiveVar();
  templateObject.includeAccounts.set(false);
  templateObject.includeReports = new ReactiveVar();
  templateObject.includeReports.set(false);
  templateObject.includeSettings = new ReactiveVar();
  templateObject.includeSettings.set(false);

  templateObject.isCloudSidePanelMenu = new ReactiveVar();
  templateObject.isCloudSidePanelMenu.set(false);
  templateObject.isCloudTopPanelMenu = new ReactiveVar();
  templateObject.isCloudTopPanelMenu.set(false);


  templateObject.profilePhoto = new ReactiveVar();

  templateObject.searchdatatablerecords = new ReactiveVar([]);


$(document).ready(function(){

var loc = window.location.pathname;

});

});

Template.header.onRendered(function(){
  const templateObject = Template.instance();
  let sidePanelToggle = Session.get('sidePanelToggle');
  /*
  setTimeout(function () {

    $('#tblSearchOverview').DataTable({
          select: true,
          destroy: true,
          colReorder: true,
          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
          buttons: [
                {
             extend: 'csvHtml5',
             text: '',
             download: 'open',
             className: "btntabletocsv hiddenColumn",
             filename: "globalsearch_"+ moment().format(),
             orientation:'portrait',
              exportOptions: {
              columns: ':visible'
            }
          },{
              extend: 'print',
              download: 'open',
              className: "btntabletopdf hiddenColumn",
              text: '',
              title: 'Global Search',
              filename: "globalsearch_"+ moment().format(),
              exportOptions: {
              columns: ':visible'
            }
          },
          {
           extend: 'excelHtml5',
           title: '',
           download: 'open',
           className: "btntabletoexcel hiddenColumn",
           filename: "accountoverview_"+ moment().format(),
           orientation:'portrait',
            exportOptions: {
            columns: ':visible'
          }
          }],
          pageLength: 25,
          lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
          info: true,
          responsive: true,
          "order": [[ 0, "asc" ]],

          action: function () {
              $('#tblSearchOverview').DataTable().ajax.reload();
          },
          "fnDrawCallback": function (oSettings) {

          },

      }).on('page', function () {

      }).on('column-reorder', function () {

      }).on( 'length.dt', function ( e, settings, len ) {

      });

  }, 10);
  */
  templateObject.getAllGlobalSearch = function (searchName) {
    $('.fullScreenSpin').css('display','inline-block');
      productService.getGlobalSearchReport(searchName).then(function (data) {
        let dataSelectID =  '';
        var splashArrayList = new Array();
        $('.fullScreenSpin').css('display','none');

        let dataTableList = [];
          for(let i=0; i<data.tglobalsearchreport.length; i++){
            if(data.tglobalsearchreport[i].Type === "Purchase Order"){
              dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
            }else if(data.tglobalsearchreport[i].Type === "Bill"){
              dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
            }else if(data.tglobalsearchreport[i].Type === "Credit"){
              dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
            }else if(data.tglobalsearchreport[i].Type === "Customer Payment"){
              dataSelectID = data.tglobalsearchreport[i].PaymentID;
            }else if(data.tglobalsearchreport[i].Type === "Supplier Payment"){
              dataSelectID = data.tglobalsearchreport[i].PaymentID;
            }else if(data.tglobalsearchreport[i].Type === "Invoice"){
              dataSelectID = data.tglobalsearchreport[i].SaleID;
            }else if(data.tglobalsearchreport[i].Type === "PO"){
              dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
            }else if(data.tglobalsearchreport[i].Type === "Cheque"){
              dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
            }else if(data.tglobalsearchreport[i].Type === "Customer"){
              dataSelectID = data.tglobalsearchreport[i].clientId;
            }else if(data.tglobalsearchreport[i].Type === "Sales Order"){
              dataSelectID = data.tglobalsearchreport[i].SaleID;
            }else if(data.tglobalsearchreport[i].Type === "Quote"){
              dataSelectID = data.tglobalsearchreport[i].SaleID;
            }else if(data.tglobalsearchreport[i].Type === "Employee"){
              dataSelectID = data.tglobalsearchreport[i].ID;
            }else if(data.tglobalsearchreport[i].Type === "Product"){
              dataSelectID = data.tglobalsearchreport[i].PartsID;
            }else if(data.tglobalsearchreport[i].Type === "Refund"){
              dataSelectID = data.tglobalsearchreport[i].SaleID;
            }else if(data.tglobalsearchreport[i].Type === "INV-BO"){
              dataSelectID = data.tglobalsearchreport[i].SaleID;
            }
            var dataList = {
            catg: data.tglobalsearchreport[i].Catg || '',
            catgdesc:data.tglobalsearchreport[i].Catgdesc || '',
            clientId: data.tglobalsearchreport[i].clientId || '',
            id: dataSelectID || '',
            type: data.tglobalsearchreport[i].Type || '',
            company: data.tglobalsearchreport[i].company || '',
            globalref: data.tglobalsearchreport[i].Globalref || '',
            transDate:  data.tglobalsearchreport[i].TransDate !=''? moment(data.tglobalsearchreport[i].TransDate).format("YYYY/MM/DD"): data.tglobalsearchreport[i].TransDate,
            transId: data.tglobalsearchreport[i].TransId || '',
            saleID: data.tglobalsearchreport[i].SaleID || '',
            purchaseOrderID: data.tglobalsearchreport[i].PurchaseOrderID || '',
            paymentID: data.tglobalsearchreport[i].PaymentID || '',
            prepaymentID: data.tglobalsearchreport[i].PrepaymentID || '',
            fixedAssetID: data.tglobalsearchreport[i].FixedAssetID || '',
            partsID: data.tglobalsearchreport[i].PartsID || ''

          };

          var dataListNew = [
            dataSelectID || '',
            data.tglobalsearchreport[i].company || '',
            data.tglobalsearchreport[i].Type || '',
            data.tglobalsearchreport[i].Globalref || ''

          ];
             dataTableList.push(dataList);
             splashArrayList.push(dataListNew);
          }



            setTimeout(function () {
              $('#searchPOP').modal('toggle');

              $('#tblSearchOverview').DataTable({
                    data :  splashArrayList,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    paging: true,
                    "aaSorting": [],
                    "orderMulti": true,
                    columnDefs: [
                      { className: "colId", "targets": [ 0 ] },
                      { className: "colName", "targets": [ 1 ] },
                      { className: "colType", "targets": [ 2 ] },
                      { className: "colTransGlobal", "targets": [ 3 ] }

                    ],
                    rowId: 0,
                    select: true,
                    destroy: true,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 1
                    },

                    pageLength: 25,
                    lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                    info: true,
                    responsive: true




                });
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
            }, 0);

            $('#tblSearchOverview tbody').on( 'click', 'tr', function () {
            var listData = $(this).closest('tr').attr('id');
            var transactiontype = $(event.target).closest("tr").find(".colType").text();
            if((listData) && (transactiontype)){
              if(transactiontype === 'Purchase Order' ){
                window.open('/purchaseordercard?id=' + listData,'_self');
              }else if(transactiontype === 'Bill'){
               window.open('/billcard?id=' + listData,'_self');
             }else if(transactiontype === 'Credit'){
               window.open('/creditcard?id=' + listData,'_self');
            }else if(transactiontype === 'Customer Payment'){
              window.open('/paymentcard?id=' + listData,'_self');
            }else if(transactiontype === 'Supplier Payment'){
              window.open('/supplierpaymentcard?id=' + listData,'_self');
            }else if(transactiontype === 'Invoice'){
              window.open('/invoicecard?id=' + listData,'_self');
            }else if(transactiontype === 'PO'){
                window.open('/purchaseordercard?id=' + listData,'_self');
            }else if(transactiontype === 'Cheque'){
              window.open('/chequecard?id=' + listData,'_self');
           }else if(transactiontype === 'Customer'){
             window.open('/customerscard?id=' + listData,'_self');
          }else if(transactiontype === 'Sales Order'){
             window.open('/salesordercard?id=' + listData,'_self');
          }else if(transactiontype === 'Quote'){
             window.open('/quotecard?id=' + listData,'_self');
          }else if(transactiontype === 'Employee'){
             window.open('/employeescard?id=' + listData,'_self');
          }else if(transactiontype === 'Product'){
             window.open('/productview?id=' + listData,'_self');
          }else if(transactiontype === 'Refund'){
             window.open('/refundcard?id=' + listData,'_self');
          }else if(transactiontype === 'INV-BO'){
             window.open('/invoicecard?id=' + listData,'_self');
          }else{

          }

        }


          });




      }).catch(function (err) {
        $('.fullScreenSpin').css('display','none');
      });
  };






  if(sidePanelToggle){
    if(sidePanelToggle === "toggled"){
      $("#sidenavbar").addClass("toggled");
    }else{
      $("#sidenavbar").removeClass("toggled");
    }
  }

  let employeeLoggedUserAccess = Session.get('ERPSolidCurrentUSerAccess');
  var sessionDataToLog = localStorage.getItem('mySession');
  document.getElementById("logged_user").innerHTML = sessionDataToLog;

  let isDashboard = Session.get('CloudDashboardModule');
  let isMain= Session.get('CloudMainModule');
  let isInventory = Session.get('CloudInventoryModule');
  let isManufacturing = Session.get('CloudManufacturingModule');
  let isAccessLevels = Session.get('CloudAccessLevelsModule');
  let isShipping = Session.get('CloudShippingModule');
  let isStockTransfer = Session.get('CloudStockTransferModule');
  let isStockTake = Session.get('CloudStockTakeModule');
  let isSales = Session.get('CloudSalesModule');
  let isPurchases = Session.get('CloudPurchasesModule');
  let isExpenseClaims = Session.get('CloudExpenseClaimsModule');
  let isFixedAssets = Session.get('CloudFixedAssetsModule');

  let isPayments = Session.get('CloudPaymentsModule');
  let isContacts = Session.get('CloudContactsModule');
  let isAccounts = Session.get('CloudAccountsModule');
  let isReports = Session.get('CloudReportsModule');
  let isSettings = Session.get('CloudSettingsModule');

  let isSidePanel = Session.get('CloudSidePanelMenu');
  let isTopPanel = Session.get('CloudTopPanelMenu');
  let loggedUserEventFired = Session.get('LoggedUserEventFired');
    var splashArrayProd = new Array();
  templateObject.getAllProducts = function () {

      productService.getNewProductList().then(function (data) {
          let records = [];
          let inventoryData = [];
          for (let i = 0; i < data.tproduct.length; i++) {
              let recordObj = {};
              recordObj.id = data.tproduct[i].Id;
              recordObj.selected = false;
              recordObj.active = data.tproduct[i].Active;
              let ProductPrintName;
              if(data.tproduct[i].Active){
                  ProductPrintName = data.tproduct[i].ProductPrintName || '-';
              }else{
                  ProductPrintName = data.tproduct[i].ProductPrintName +'             '+ 'INACTIVE' ;
              }
              recordObj.dataArr = [
                  data.tproduct[i].Id,
                  data.tproduct[i].ProductName || '-',
                  ProductPrintName,
                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproduct[i].BuyQty1CostInc * 100) / 100),
                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproduct[i].SellQty1PriceInc * 100) / 100),
                  data.tproduct[i].TotalStockQty
              ];




              var dataList = [
                data.tproduct[i].Id || '',

              data.tproduct[i].ProductName || '-',
              ProductPrintName || '',
              utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproduct[i].BuyQty1CostInc * 100) / 100),
              utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproduct[i].SellQty1PriceInc * 100) / 100),
              data.tproduct[i].TotalStockQty];

              splashArrayProd.push(dataList);

          }


          localStorage.setItem('VS1ProductList', JSON.stringify(splashArrayProd));


      })
  };

  templateObject.getCompanyInfo = function () {

      organizationService.getCompanyInfo().then(function (data) {

           let companyName = data.tcompanyinfo[0].CompanyName;
           let companyaddress1 = data.tcompanyinfo[0].PoBox;
           let companyaddress2 = data.tcompanyinfo[0].PoBox2 + ' ' + data.tcompanyinfo[0].PoBox3;

           let companyABN = data.tcompanyinfo[0].abn;
           let companyPhone = data.tcompanyinfo[0].PhoneNumber;
           let companyURL = data.tcompanyinfo[0].Url
           Session.setPersistent('vs1companyName', companyName);
           Session.setPersistent('vs1companyaddress1', companyaddress1);
           Session.setPersistent('vs1companyaddress2', companyaddress2);
           Session.setPersistent('vs1companyABN', companyABN);
           Session.setPersistent('vs1companyPhone', companyPhone);
           Session.setPersistent('vs1companyURL', companyURL);

      })
  };
  if(!localStorage.getItem('vs1LoggedEmployeeImages_dash')){

  }else{
    if(localStorage.getItem('vs1LoggedEmployeeImages_dash') == ''){

    }else{
      let pictureData = localStorage.getItem('vs1LoggedEmployeeImages_dash');
      $('.img-profile').attr('src', 'data:image/jpeg;base64,'+pictureData);
    }

  }
  /*
  organizationService.getEmployeeProfileImageByName(sessionDataToLog).then((data) => {
    Session.setPersistent('vs1EmployeeImages', data);
          let employeeProfile = '';
          for (let i = 0; i < data.temployeepicture.length; i++) {

              if (data.temployeepicture[i].EmployeeName === sessionDataToLog) {
                  employeeProfile = data.temployeepicture[i].EncodedPic;


                  $('.img-profile').attr('src', 'data:image/jpeg;base64,'+employeeProfile);
              }
          }
    });
    */
var erpGet = erpDb();

var LoggedDB = erpGet.ERPDatabase;
if(loggedUserEventFired){
    $(document).ready(function() {
        let checkGreenTrack = Session.get('isGreenTrack') || false;
      if(checkGreenTrack){
      document.title = 'GreenTrack';
      $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/greentrackIcon.png">');
      }else{
      document.title = 'VS1 Cloud';
      $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">');
      }

     });

  setTimeout(function () {


  },0);

if (!localStorage.getItem('VS1TERPFormList')) {

}

if(Session.get('userlogged_status')){

 CloudUser.update({_id: Session.get('mycloudLogonID')},{ $set: {userMultiLogon: true}});
}

}



var LoggedUser = localStorage.getItem('mySession');
document.getElementById("logged_user").innerHTML = LoggedUser;

/*document.getElementById("loggeddatabaseuser").innerHTML = LoggedUser;*/
var CloudUserPass = Session.get('CloudUserPass');
var currentLoc = window.location.pathname;
if(CloudUserPass){
  templateObject.isCloudUserPass.set(true);

}
if(isSidePanel){
  templateObject.isCloudSidePanelMenu.set(true);


}

if(LoggedDB !== null){
  if(isDashboard){
    templateObject.includeDashboard.set(true);
  }
  if(isMain){
    templateObject.includeMain.set(true);
  }
  if(isInventory){
    templateObject.includeInventory.set(true);
  }
  if(isManufacturing){
    templateObject.includeManufacturing.set(true);
  }
  if(isAccessLevels){
    templateObject.includeAccessLevels.set(true);
  }
  if(isShipping){
    templateObject.includeShipping.set(true);
  }
  if(isStockTransfer){
    templateObject.includeStockTransfer.set(true);
  }

  if(isStockTake){
    templateObject.includeStockTake.set(true);
  }

  if(isSales){
    templateObject.includeSales.set(true);
  }

  if(isPurchases){
    templateObject.includePurchases.set(true);
  }

  if(isExpenseClaims){
    templateObject.includeExpenseClaims.set(true);
  }

  if(isFixedAssets){
    templateObject.includeFixedAssets.set(true);
  }

  if(isPayments){
    templateObject.includePayments.set(true);
  }

  if(isContacts){
    templateObject.includeContacts.set(true);
  }

  if(isAccounts){
    templateObject.includeAccounts.set(true);
  }

  if(isReports){
    templateObject.includeReports.set(true);
  }

  if(isSettings){
    templateObject.includeSettings.set(true);
  }

  if(isSidePanel){
    templateObject.isCloudSidePanelMenu.set(true);
    $("html").addClass("hasSideBar");
    $("body").addClass("hasSideBar");
  }
  if(isTopPanel){
    templateObject.isCloudTopPanelMenu.set(true);
  }
}else{

}
});

Template.header.events({
  'click .btnGlobalSearch' : function(event){
    let templateObject = Template.instance();
    var searchData = $('.txtGlobalSearch').val().toLowerCase();
      if(searchData != ''){
        templateObject.getAllGlobalSearch(searchData);

      }
  },
  'keypress .txtGlobalSearch' : function(event){
    var key = event.which;
    if(key == 13) {
    let templateObject = Template.instance();
    var searchData = $('.txtGlobalSearch').val().toLowerCase();
      if(searchData != ''){
        templateObject.getAllGlobalSearch(searchData);
        event.preventDefault();
      }
    }
  },
  'click .btnCloseModal' : function(event){
    let templateObject = Template.instance();
    templateObject.searchdatatablerecords.set('');
    $('.txtGlobalSearch').val('');

  },
  'click #sidebarToggleTop' : function(event){
  var sideBarPanel = $("#sidenavbar").attr("class");
    if(sideBarPanel.indexOf("toggled") >= 0){

      Session.setPersistent('sidePanelToggle', "toggled");
    }else{

      Session.setPersistent('sidePanelToggle', "");
    }
  },

  'click #navOrganisationSettings' : function(event){
  window.open('/accesslevel','_self');
  },
  'click #navhome' : function(event){
  window.open('/dashboard','_self');
  },
  'click #navmain' : function(event){
  window.open('/home','_self');
  },
  'click #navbankaccounts' : function(event){
  window.open('/bankaccounts','_self');
  },
  'click #navchartofaccounts' : function(event){
  window.open('/settings/accounts/all-accounts','_self');
  },
  'click #navpurchases' : function(event){
  window.open('/purchases','_self');
  },
  'click #navinventory' : function(event){
  window.open('/productexpresslist','_self');
  },
  'click #navstocktransferlist' : function(event){
  window.open('/stocktransfer','_self');
  },
  'click #navstockadjlist' : function(event){
  window.open('/stocktake','_self');
  },
  'click #navshipping' : function(event){
  window.open('/shipping','_self');
  },
  'click #navfittings' : function(event){
  window.open('/manufacturing','_self');
  },
  'click #navexpenseclaims' : function(event){
  window.open('/expenseclaims/current-claims','_self');
  },
  'click #navfixedassets' : function(event){
  window.open('/fixedassets/draft','_self');
  },
  'click #navallreports' : function(event){
  window.open('/allreports','_self');
  },
  'click #navvatreturns' : function(event){
  window.open('/vatreturn','_self');
  },
  'click #navallcontacts' : function(event){
  window.open('/allcontacts','_self');
  },
  'click #navcustomers' : function(event){
  window.open('/customerslist','_self');
  },
  'click #navsuppliers' : function(event){
  window.open('/supplierlist','_self');
  },
  'click #navemployees' : function(event){
  window.open('/employeeslist','_self');
  },
  'click #navtraining' : function(event){
  window.open('/traininglist','_self');
  },
  'click #navgeneralsettings' : function(event){
  window.open('/settings','_self');
  },
  'click #navsales' : function(event){
  window.open('/allsales','_self');
  },
  'click #navinvoices' : function(event){
  window.open('/invoicelist/All','_self');
  },
  'click #navquotes' : function(event){
  window.open('/quoteslist/#All','_self');
  },
  'click #navsalesorder' : function(event){
  window.open('/salesorderslist','_self');
  },
  'click #navAccessLevel' : function(event){
  window.open('/accesslevel','_self');
  },
  'click #navexpenseclaims' : function(event){
  window.open('/expenseclaims/current-claims','_self');
  },
  'click #navfixedassets' : function(event){
  window.open('/fixedassets/draft','_self');
  },
  'click #navpurchases' : function(event){
  window.open('/purchases','_self');
  },
  'click #navbill' : function(event){
  window.open('/billslist/All','_self');
  },
  'click #navpurchaseorder' : function(event){
  window.open('/polist/#All','_self');
  },
  'click #navawaitingcustpayment' : function(event){
  window.open('/awaitingcustomerpaylist','_self');
  },
  'click #navcustPaymentList' : function(event){
  window.open('/customerpaymentlist','_self');
  },
  'click #navawaitingsupptpayment' : function(event){
  window.open('/awaitingsupplierpaylist','_self');
  },
  'click #navsuppPaymentList' : function(event){
  window.open('/supplierpaymentlist','_self');
  },
  'click #navPaymentOverview' : function(event){
  window.open('/payments','_self');
  },
'click #closeCloudTopPanelMenu' : function(event){
  let templateObject = Template.instance();
  let empLoggedID = Session.get('mySessionEmployeeLoggedID');
  let accesslevelService = new AccessLevelService();
  let isTopPanel = false;
  let topPanelID = Session.get('CloudTopPanelMenuID');
  let topPanelFormID = Session.get('CloudTopPanelMenuFormID');

  let data = {
      type: "TEmployeeFormAccess",
      fields: {
      ID : topPanelID,
      EmployeeId : empLoggedID,
      AccessLevel : 6,
      FormId: topPanelFormID
     }
  }
if(confirm("Are you sure you want to close the top panel?")) {
  accesslevelService.saveEmpAccess(data).then(function (data) {
    Session.setPersistent('CloudTopPanelMenu', isTopPanel);

    Meteor._reload.reload();
  }).catch(function (err) {
      Bert.alert('<strong>' + err + '</strong>!', 'danger');

  });
} else { }
},
'click .userprofileclick' : function(event){
window.open('/employeescard?id='+Session.get('mySessionEmployeeLoggedID'),'_self');
},
'click .btnRefreshSearch' : function(event){
  let templateObject = Template.instance();
  templateObject.searchdatatablerecords.set('');
  var searchData = $('.txtGlobalSearch').val().toLowerCase();
    if(searchData != ''){
      templateObject.getAllGlobalSearch(searchData);
    }
},
'click #exportbtn': function () {
jQuery('#tblSearchOverview_wrapper .dt-buttons .btntabletocsv').click();
},
'click .printConfirm' : function(event){
  jQuery('#tblSearchOverview_wrapper .dt-buttons .btntabletopdf').click();
},
'click .dropdown-toggle' : function(event){







}

});

Template.header.helpers({
  isCloudUserPass: () => {
      return Template.instance().isCloudUserPass.get();
  },
  includeDashboard: () => {
      return Template.instance().includeDashboard.get();
  },
  includeMain: () => {
      return Template.instance().includeMain.get();
  },
  includeInventory: () => {
      return Template.instance().includeInventory.get();
  },
  includeManufacturing: () => {
      return Template.instance().includeManufacturing.get();
  },
  includeAccessLevels: () => {
      return Template.instance().includeAccessLevels.get();
  },
  includeShipping: () => {
      return Template.instance().includeShipping.get();
  },
  includeStockTransfer: () => {
      return Template.instance().includeStockTransfer.get();
  },
  includeStockTake: () => {
      return Template.instance().includeStockTake.get();
  },
  isCloudSidePanelMenu: () => {
      return Template.instance().isCloudSidePanelMenu.get();
  },
  isCloudTopPanelMenu: () => {
      return Template.instance().isCloudTopPanelMenu.get();
  },
  includeSales: () => {
      return Template.instance().includeSales.get();
  },
  includePurchases: () => {
      return Template.instance().includePurchases.get();
  },
  includeExpenseClaims: () => {
      return Template.instance().includeExpenseClaims.get();
  },
  includeFixedAssets: () => {
      return Template.instance().includeFixedAssets.get();
  },
  includePayments: () => {
      return Template.instance().includePayments.get();
  },
  includeContacts: () => {
      return Template.instance().includeContacts.get();
  },
  includeAccounts: () => {
      return Template.instance().includeAccounts.get();
  },
  includeReports: () => {
      return Template.instance().includeReports.get();
  },
  includeSettings: () => {
      return Template.instance().includeSettings.get();
  },
  isGreenTrack: function() {
    let checkGreenTrack = Session.get('isGreenTrack') || false;
        return checkGreenTrack;
  },
  isCloudTrueERP: function() {
    let checkCloudTrueERP = Session.get('CloudTrueERPModule') || false;
        return checkCloudTrueERP;
  },
  searchdatatablerecords : () => {
     return Template.instance().searchdatatablerecords.get().sort(function(a, b){
       if (a.transDate == 'NA') {
     return 1;
         }
     else if (b.transDate == 'NA') {
       return -1;
     }
   return (a.transDate.toUpperCase() > b.transDate.toUpperCase()) ? 1 : -1;
   });
  }
});
