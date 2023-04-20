import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import '../../lib/global/colResizable.js';
import TableHandler from '../../js/Table/TableHandler';
import { Session } from 'meteor/session';
import { HTTP } from "meteor/http";
let sideBarService = new SideBarService();
modalDraggable = function () {
  $.fn.dataTable.ext.errMode = 'none'; //Remove datatable Errors
    $('.modal-dialog').draggable({
        appendTo: "body",
        "handle":".modal-header, .modal-footer"
    });
$(document).ready(function(){
  $(document).on('click', '.highlightInput', function () {
    $(this).select();
  });

  $(document).on('click', '.close', function () {
    var vid = document.getElementById("myVideo");
    vid.pause();
  });

  // $(document).on('click', '.highlightSelect', function () {
  //   $(this).select();
  // });

  $(document).on('click', "input[type='text']", function () {
    $(this).select();
  });

  $(document).on('click', "input[type='email']", function () {
    $(this).select();
  });

  $(document).on('click', "input[type='number']", function () {
    $(this).select();
  });

  $(document).on('click', "input[type='password']", function () {
    $(this).select();
  });
  $("input[type='text']").on("click", function () {
   $(this).select();
 });

 $(".highlightInput").on("click", function () {
  $(this).select();
});

 $("input[type='number']").on("click", function () {
  $(this).select();
});

$("input[type='text']").click(function () {
   $(this).select();
});

$("input[type='number']").click(function () {
   $(this).select();
});

setTimeout(function () {
var usedNames = {};
$("select[name='edtBankAccountName'] > option").each(function () {
    if(usedNames[this.text]) {
        $(this).remove();
    } else {
        usedNames[this.text] = this.value;
    }
});
}, 3000);

// $(".hasDatepicker").on("blur", function () {

  $(document).on('blur', '.hasDatepicker', function () {
         let dateEntered = $(event.target).val();
         let parts = [];
         if(dateEntered.length > 6){

             let isReceiptDateValid = moment($(event.target).val()).isValid();
             let symbolArr = ['/', '-', '.', ' ',','];
             symbolArr.forEach(function (e, i) {
                 if ($(event.target).val().indexOf(symbolArr[i]) > -1) {
                     parts = $(event.target).val().split(symbolArr[i]);
                 }
             });
             if(parts.length){
                 if(!isReceiptDateValid) {
                     if (!(parts[0] && (parts[1] < 13) && (parts[2] > 999 && parts[2] < 9999 ))) {
                       //let parts = dateEntered.match(/.{1,2}/g);
                       tempDay = parseInt(parts[0]);
                       tempMonth = parseInt(parts[1])-1;
                       tempYear = parseInt(parts[2])+2000;
                       if(!((tempDay < 31) && (tempMonth <12) && tempDay && tempMonth && tempYear)){
                           $(event.target).val(moment().format('DD/MM/YYYY'));
                       }else {
                           let tempDate = moment(new Date(tempYear,tempMonth,tempDay)).format('DD/MM/YYYY');
                           $(event.target).val(tempDate);
                       }
                     } else {
                         let myDate = moment(new Date(parts[2], parts[1] - 1, parts[0])).format("DD/MM/YYYY");
                         $(event.target).val(myDate);
                     }
                 }else{
                     if (!(parts[0] && (parts[1] < 13) && (parts[2] > 999 && parts[2] < 9999 ))) {
                       //let parts = dateEntered.match(/.{1,2}/g);
                       tempDay = parseInt(parts[0]);
                       tempMonth = parseInt(parts[1])-1;
                       tempYear = parseInt(parts[2])+2000;
                       if(!((tempDay < 31) && (tempMonth <12) && tempDay && tempMonth && tempYear)){
                           $(event.target).val(moment().format('DD/MM/YYYY'));
                       }else {
                           let tempDate = moment(new Date(tempYear,tempMonth,tempDay)).format('DD/MM/YYYY');
                           $(event.target).val(tempDate);
                       }
                     } else {
                         let myDate = moment(new Date(parts[2], parts[1] - 1, parts[0])).format("DD/MM/YYYY");
                         $(event.target).val(myDate);
                     }
                 }
             }else{
                 $(event.target).val(moment().format('DD/MM/YYYY'));

             }

         }else if(dateEntered.length === 6){
             let parts = dateEntered.match(/.{1,2}/g);
             tempDay = parseInt(parts[0]);
             tempMonth = parseInt(parts[1])-1;
             tempYear = parseInt(parts[2])+2000;
             if(!((tempDay < 31) && (tempMonth <12) && tempDay && tempMonth && tempYear)){
                 $(event.target).val(moment().format('DD/MM/YYYY'));
             }else {
                 let tempDate = moment(new Date(tempYear,tempMonth,tempDay)).format('DD/MM/YYYY');
                 $(event.target).val(tempDate);
             }
         }else {
           let symbolArr = ['/', '-', '.', ' ',','];
           symbolArr.forEach(function (e, i) {
               if ($(event.target).val().indexOf(symbolArr[i]) > -1) {
                   parts = $(event.target).val().split(symbolArr[i]);
               }
           });
           if(parts.length > 1){
             tempDay = parseInt(parts[0]);
             tempMonth = parseInt(parts[1])-1;
             tempYear = new Date().getFullYear();  // returns the current year
             if(!((tempDay < 31) && (tempMonth <12) && tempDay && tempMonth && tempYear)){
                 $(event.target).val(moment().format('DD/MM/YYYY'));
             }else {
                 let tempDate = moment(new Date(tempYear,tempMonth,tempDay)).format('DD/MM/YYYY');
                 $(event.target).val(tempDate);
             }
           }else{
             $(event.target).val(moment().format('DD/MM/YYYY'));
           }
         }
});

$(document).on('keypress', '.hasDatepicker', function (e) {
    if(e.which == 13) {
       let dateEntered = $(event.target).val();
       let parts = [];
       if(dateEntered.length > 6){

           let isReceiptDateValid = moment($(event.target).val()).isValid();
           let symbolArr = ['/', '-', '.', ' ',','];
           symbolArr.forEach(function (e, i) {
               if ($(event.target).val().indexOf(symbolArr[i]) > -1) {
                   parts = $(event.target).val().split(symbolArr[i]);
               }
           });
           if(parts.length){
               if(!isReceiptDateValid) {

                   if (!(parts[0] && (parts[1] < 13) && (parts[2] > 999 && parts[2] < 9999 ))) {

                     tempDay = parseInt(parts[0]);
                     tempMonth = parseInt(parts[1])-1;
                     tempYear = parseInt(parts[2])+2000;

                     if(!((tempDay < 31) && (tempMonth <12) && tempDay && tempMonth && tempYear)){

                         $(event.target).val(moment().format('DD/MM/YYYY'));
                     }else {

                         let tempDate = moment(new Date(tempYear,tempMonth,tempDay)).format('DD/MM/YYYY');
                         $(event.target).val(tempDate);
                     }
                   } else {

                       let myDate = moment(new Date(parts[2], parts[1] - 1, parts[0])).format("DD/MM/YYYY");
                       $(event.target).val(myDate);
                   }
               }else{

                   if (!(parts[0] && (parts[1] < 13) && (parts[2] > 999 && parts[2] < 9999 ))) {

                     tempDay = parseInt(parts[0]);
                     tempMonth = parseInt(parts[1])-1;
                     tempYear = parseInt(parts[2])+2000;
                     if(!((tempDay < 31) && (tempMonth <12) && tempDay && tempMonth && tempYear)){
                         $(event.target).val(moment().format('DD/MM/YYYY'));
                     }else {
                         let tempDate = moment(new Date(tempYear,tempMonth,tempDay)).format('DD/MM/YYYY');
                         $(event.target).val(tempDate);
                     }
                   } else {
                       let myDate = moment(new Date(parts[2], parts[1] - 1, parts[0])).format("DD/MM/YYYY");
                       $(event.target).val(myDate);
                   }
               }
           }else{
               $(event.target).val(moment().format('DD/MM/YYYY'));

           }

       }else if(dateEntered.length === 6){
           let parts = dateEntered.match(/.{1,2}/g);
           tempDay = parseInt(parts[0]);
           tempMonth = parseInt(parts[1])-1;
           tempYear = parseInt(parts[2])+2000;
           if(!((tempDay < 31) && (tempMonth <12) && tempDay && tempMonth && tempYear)){
               $(event.target).val(moment().format('DD/MM/YYYY'));
           }else {
               let tempDate = moment(new Date(tempYear,tempMonth,tempDay)).format('DD/MM/YYYY');
               $(event.target).val(tempDate);
           }
       }else {
         let symbolArr = ['/', '-', '.', ' ',','];
         symbolArr.forEach(function (e, i) {
             if ($(event.target).val().indexOf(symbolArr[i]) > -1) {
                 parts = $(event.target).val().split(symbolArr[i]);
             }
         });
         if(parts.length > 1){
           tempDay = parseInt(parts[0]);
           tempMonth = parseInt(parts[1])-1;
           tempYear = new Date().getFullYear();  // returns the current year
           if(!((tempDay < 31) && (tempMonth <12) && tempDay && tempMonth && tempYear)){
               $(event.target).val(moment().format('DD/MM/YYYY'));
           }else {
               let tempDate = moment(new Date(tempYear,tempMonth,tempDay)).format('DD/MM/YYYY');
               $(event.target).val(tempDate);
           }
         }else{
           $(event.target).val(moment().format('DD/MM/YYYY'));
         }
       }
     }
});

$('.dropdown-toggle').on("click",function(event){

    //event.stopPropagation();
});
// $('.dropdown-toggle').click(e => e.stopPropagation());
  });


    /*
      Bert.defaults = {
      hideDelay: 5000,
      style: 'fixed-top',
      type: 'default'
        };
        */
};


  makeNegativeGlobal = function () {
    $('td').each(function() {
        if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
    });
    $('td.colStatus').each(function(){
        if ($(this).text() == "In-Active") $(this).addClass("text-deleted");
        if($(this).text() == "Deleted") $(this).addClass('text-deleted');
        if ($(this).text() == "Full") $(this).addClass('text-fullyPaid');
        if ($(this).text() == "Part") $(this).addClass('text-partialPaid');
        if ($(this).text() == "Rec") $(this).addClass('text-reconciled');
    });
  };

  let updateReportCounter = 6;
  let countTimes = 0;
  let percent = 0;
  let textArray = [];

  showCounterProgressModal = function(){
      updateReportCounter = 6;
      countTimes = 0;
      percent = 0;
      textArray = [];

      $('.headerprogressbar').addClass('headerprogressbarShow');
      $('.headerprogressbar').removeClass('headerprogressbarHidden');
      $('.headerprogressbar').removeClass('killProgressBar');

      $('.headerprogressbar .modal').modal()
  };

  hideCounterProgressModal = function(){
      $('.headerprogressbar .modal').modal("hide");
  };

  updateCounterProgress = function(text){
      if(textArray.join(',').indexOf(text) >= 0){
          return;
      }

      textArray.push(text);
      countTimes ++;
      percent = (countTimes * 100) / updateReportCounter;

      if(percent > 100) return;

      $('.loadingbar').css('width', percent + '%').attr('aria-valuenow', percent);
      //$(".progressBarInner").text("AP Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(percent) + "%");
      $(".progressName").text("text");

      $("<span class='process'>" + text + " Done <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
  };
  updateCounterProgressDone = function(){
      let text = 'All';

      if(textArray.join(',').indexOf(text) >= 0){
          return;
      }

      textArray.push(text);
      percent = 100;
      $('.loadingbar').css('width', percent + '%').attr('aria-valuenow', percent);
      //$(".progressBarInner").text("AP Report "+Math.round(progressPercentage)+"%");
      $(".progressBarInner").text(Math.round(percent) + "%");
      $(".progressName").text(text);

      $("<span class='process'>" + text + " Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
  };

batchUpdateCall = function (url, flag = false) {
    var erpGet = erpDb();
    let dashboardArray = [];
    var oReq = new XMLHttpRequest();
    var oReq2 = new XMLHttpRequest();
    var oReq3 = new XMLHttpRequest();
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentBeginDate.getMonth() + 1);
    let fromDateDay = currentBeginDate.getDate();
    if((currentBeginDate.getMonth()+1) < 10){
        fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
    }else{
      fromDateMonth = (currentBeginDate.getMonth()+1);
    }

    if(currentBeginDate.getDate() < 10){
        fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");


    oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/VS1_BatchUpdate', true);
    oReq.setRequestHeader("database",erpGet.ERPDatabase);
    oReq.setRequestHeader("username",erpGet.ERPUsername);
    oReq.setRequestHeader("password",erpGet.ERPPassword);
    oReq.send();
    oReq.onreadystatechange = function() {
        if(flag){
            updateCounterProgress('BatchUpdate');
        }
        if(oReq.readyState == 4 && oReq.status == 200) {
          var myArrResponse = JSON.parse(oReq.responseText);
          let responseBack = myArrResponse.ProcessLog.ResponseStatus;

          if (~responseBack.indexOf("Finished Batch Update")){

            // sideBarService.getTTransactionListReport('').then(function(data) {
            //     addVS1Data('TTransactionListReport',JSON.stringify(data));
            // }).catch(function(err) {
            //
            // });
            // sideBarService.getTAPReport(prevMonth11Date,toDate, false).then(function(data) {
            //   addVS1Data('TAPReport',JSON.stringify(data));
            // }).catch(function(err) {
            // });
            // sideBarService.getTARReport(prevMonth11Date,toDate, false).then(function(data) {
            //   addVS1Data('TARReport',JSON.stringify(data));
            //
            // }).catch(function(err) {
            //
            // });
            //Meteor._reload.reload();
            oReq2.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/Vs1_Dashboard', true);
            oReq2.setRequestHeader("database",erpGet.ERPDatabase);
            oReq2.setRequestHeader("username",erpGet.ERPUsername);
            oReq2.setRequestHeader("password",erpGet.ERPPassword);
            oReq2.send();

            oReq2.onreadystatechange = function() {

                if(flag){
                    updateCounterProgress('Dashboard Request');
                }

                if(oReq2.readyState == 4 && oReq2.status == 200) {
                  // var myArrResponse2 = JSON.parse(oReq2.responseText);
                  var dataReturnRes = JSON.parse(oReq2.responseText);

                  //Dashboard API:
                  if(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields){
                  localStorage.setItem('vs1companyName', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName||'');
                  localStorage.setItem('vs1companyaddress1', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address||'');
                  localStorage.setItem('vs1companyaddress2', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2||'');
                  localStorage.setItem('vs1companyABN', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN||'');
                  localStorage.setItem('vs1companyPhone', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber||'');
                  localStorage.setItem('vs1companyURL', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL||'');

                  localStorage.setItem('ERPDefaultDepartment', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass||'');
                  localStorage.setItem('ERPDefaultUOM', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM||'');


                  // localStorage.setItem('ERPCurrency', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_CurrencySymbol||'');
                  localStorage.setItem('ERPCountryAbbr', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault||'');
                  localStorage.setItem('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc||'');
                  localStorage.setItem('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc||'');


                  localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT||Currency+'0');
                  localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY||0);
                  localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT||Currency+'0');
                  localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY||0);

                  localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
                  localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
                  localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
                  localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

                  localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                  //Profit & Loss
                  localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx||0);
                  localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx||0);
                  localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx||0);
                  localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx||0);

                   //Income
                  localStorage.setItem('VS1ReportsDateFrom_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ReportsDateFrom||"");
                  localStorage.setItem('VS1ReportsDateTo_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ReportsDateTo||"");
                  localStorage.setItem('VS1TransTableUpdate', dataReturnRes.ProcessLog.TUser.TransactionTableLastUpdated);
                  sessionStorage.setItem("pageLoaded", true);
                  if(dataReturnRes.ProcessLog.TUser.TEmployeePicture.ResponseNo == 401){
                    localStorage.setItem('vs1LoggedEmployeeImages_dash','');
                  }else{
                    if(dataReturnRes.ProcessLog.TUser.TEmployeePicture.fields){
                    localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic|| '');
                    }else{
                      localStorage.setItem('vs1LoggedEmployeeImages_dash','');
                    }
                  }
                  }
                  localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_ap_report.items)||'');
                  localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items)||'');
                  localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_saleslist.items)||'');
                  localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items)||'');

                  getVS1Data('vscloudlogininfo').then(function (dataObject) {
                    if(dataObject.length == 0){

                        if (localStorage.getItem("enteredURL") != null) {
                            FlowRouter.go(localStorage.getItem("enteredURL"));
                            localStorage.removeItem("enteredURL");
                            return;
                        }

                      setTimeout(function () {
                        if(url){
                          window.open(url,'_self');
                        }else{
                          location.reload(true);
                        }
                      }, 1000);
                    }else{
                      //let userData = dataObject[0].data;
                      dashboardArray = dataObject[0].data;



                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture = dataReturnRes.ProcessLog.TUser.TEmployeePicture;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_ap_report;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_pnl_period;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_saleslist;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_salesperemployee;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TransactionTableLastUpdated = dataReturnRes.ProcessLog.TUser.TransactionTableLastUpdated;

                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TEmployeePicture = dataReturnRes.ProcessLog.TUser.TEmployeePicture;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_ap_report = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_ap_report;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_pnl_period = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_pnl_period;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_saleslist = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_saleslist;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_salesperemployee = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_salesperemployee;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_summary = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TransactionTableLastUpdated = dataReturnRes.ProcessLog.TUser.TransactionTableLastUpdated;

                      addLoginData(dashboardArray).then(function (datareturnCheck) {
                          if(flag){
                              updateCounterProgress('Login Data Added');
                          }
                          if (localStorage.getItem("enteredURL") != null) {
                              FlowRouter.go(localStorage.getItem("enteredURL"));
                              localStorage.removeItem("enteredURL");
                              return;
                          }

                        setTimeout(function () {
                        if(url){
                          window.open(url,'_self');
                        }else{
                          location.reload(true);
                        }
                      }, 500);
                      }).catch(function (err) {
                          if(flag){
                              updateCounterProgress('Login Data Added');
                          }

                          if(url){
                            window.open(url,'_self');
                          }else{
                            location.reload(true);
                          }
                      });
                    }


                  }).catch(function (err) {

                  });

                }else if (oReq2.status != 200){

                  setTimeout(function () {
                    if(url){
                      window.open(url,'_self');
                    }else{
                      location.reload(true);
                    }
                  }, 10000);
                }
            }
            oReq3.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/TAccountVS1?ListType="Detail"&select=[AccountTypeName]="BANK"', true);
            oReq3.setRequestHeader("database",erpGet.ERPDatabase);
            oReq3.setRequestHeader("username",erpGet.ERPUsername);
            oReq3.setRequestHeader("password",erpGet.ERPPassword);
            oReq3.send();

            oReq3.onreadystatechange = function() {

                if(flag){
                    updateCounterProgress('TAccountVS1 Request');
                }

                if(oReq3.readyState == 4 && oReq3.status == 200) {
                  var dataReturnRes3 = JSON.parse(oReq3.responseText);
                  if (dataReturnRes3.taccountvs1.length > 0) {
                    localStorage.setItem('VS1TAccount_Bank_dash', dataReturnRes3.taccountvs1[0].fields.Balance||0);
                    localStorage.setItem('VS1TAccount_Bank_Payroll_Clearing_dash', dataReturnRes3.taccountvs1[1].fields.Balance||0);
                    localStorage.setItem('VS1TAccount_Petty_Cash_dash', dataReturnRes3.taccountvs1[2].fields.Balance||0);
                    localStorage.setItem('VS1TAccount_Payroll_Bank_dash', dataReturnRes3.taccountvs1[3].fields.Balance||0);
                    localStorage.setItem('VS1TAccount_Offset_Account_dash', dataReturnRes3.taccountvs1[4].fields.Balance||0);
                  }
                }else if (oReq3.status != 200){

                  setTimeout(function () {
                    if(url){
                      window.open(url,'_self');
                    }else{
                      location.reload(true);
                    }
                  }, 10000);
                }
            }
          }else{

            setTimeout(function () {
                if(flag){
                    updateCounterProgressDone();
                }

              if(url){
                window.open(url,'_self');
              }else{
                location.reload(true);
              }
            }, 10000);
          }
          //if(responseBack.ResponseStatus == )
            //Meteor._reload.reload();
        }else if (oReq.status != 200){
          setTimeout(function () {
              if(flag){
                  updateCounterProgressDone();
              }
            if(url){
              window.open(url,'_self');
            }else{
              location.reload(true);
            }
          }, 10000);
        }
    }

    getVS1Data('TAppUser').then(function (data) {

        if(flag){
            updateCounterProgress('Getting Current Logged User');
        }

      // addVS1Data('TAppUser', JSON.stringify(data));
    });

    if (localStorage.getItem("enteredURL") != null) {
        FlowRouter.go(localStorage.getItem("enteredURL"));
        localStorage.removeItem("enteredURL");
    }
};

/**
 * Damien
 * Date Format Function
 * params
 *   dateStr: javascript date string
 * return
 *   converted date with correct date format based on company country ( the country got from localStorage )
* */
formatDateByCountry = function(dateStr){
    let country = localStorage.getItem('vs1companyCountry');

    if(country == 'United States'){
        return moment(dateStr).format('MM/DD/YYYY');
    }else{
        return moment(dateStr).format('DD/MM/YYYY');
    }
};

getHour24 = function (timeString) {
  let time = null;
  let timeSplit = timeString.split(':'),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }

let getTimeString = hours + ':' + minutes + ' ' + meridian;
var matches = getTimeString.match(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);

 if (matches != null && matches.length == 3){

     time = parseInt(matches[1]);
     if (meridian == 'PM'){
       if(time >= 1 && time < 12){
         time += 12;
       }else if(time == 12){
         time = 12;
       }
     }
 }
return time + ':' + minutes;
};


vs1GlobalBackButton = async function () {
  jQuery(document).ready(async function($) {
     window.onpopstate = async function(event) {
      if(JSON.stringify(event.state) == "forward"){
        let lastPageVisitUrl = "";
        if(localStorage.getItem('vs1lastvisiturl') !== undefined){
          lastPageVisitUrl = localStorage.getItem('vs1lastvisiturl');
          await window.open(lastPageVisitUrl, '_self');
        }
      }
    }
 });
};

tableResize = function() {
  setTimeout(function() {
    const tableHandler = new TableHandler();
    $('.dataTables_filter input[type="search"]').attr("placeholder", "Search List...");
    $('.dataTables_filter label:contains("Search:")').each(function(){
      $(this).html($(this).html().split("Search:").join(""));
    });
  }, 2500);
  setTimeout(function() {
    $('.dataTables_filter input[type="search"]').attr("placeholder", "Search List...");
    $('.dataTables_filter label:contains("Search:")').each(function(){
      $(this).html($(this).html().split("Search:").join(""));
    });
  }, 1000);
};

// $(window).load(function() {
//
// });

//$(document).ready(function(){
// $(window).unload(function(){
//   if(localStorage.getItem('mycloudLogonID')){
//     CloudUser.update({_id: localStorage.getItem('mycloudLogonID')},{ $set: {userMultiLogon: false}});
//   }
// });
//});

cleanPrice = async function( amount ){
  if( isNaN(amount) || !amount){
      amount = ( amount === undefined || amount === null || amount.length === 0 ) ? 0 : amount;
      amount = ( amount )? Number(amount.replace(/[^0-9.-]+/g,"")): 0;
  }
  return amount;
}

isAdditionalModulePurchased = async function( moduleName ){
  let purchaedAdModuleList = []
  let additionModuleSettings = await getVS1Data('vscloudlogininfo');
  if( additionModuleSettings.length > 0 ){
      let additionModules = additionModuleSettings[0].data.ProcessLog.Modules.Modules;
      if( additionModules.length > 0 ){
          let adModulesList = additionModules.filter((item) => {
              if( item.ModuleActive == true && item.ModuleName == moduleName ){
                  return item;
              }
          });

          if( adModulesList.length > 0 ){
              return true
          }
          return false
      }
  }
  return false
}




handleValidationError = async function ( errorMessage, fieldID ) {
  swal({
      title: errorMessage,
      type: 'warning',
      showCancelButton: false,
      confirmButtonText: 'OK'
  }).then((result) => {
      if (result.value) {
          if (result.value) {
              $(`#${fieldID}`).focus();
          }
      }
  });
}

playCancelAudio = function () {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'sounds/Cancel.mp3');
  audioElement.play();
}

playCopyAudio = function () {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'sounds/Copy.mp3');
  audioElement.play();
}

playDeleteAudio = function () {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'sounds/Delete.mp3');
  audioElement.play();
}

playEmailAudio = function () {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'sounds/Email.mp3');
  audioElement.play();
}

playPrintAudio = function () {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'sounds/Print.mp3');
  audioElement.play();
}

playSaveAudio = function () {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'sounds/Save.mp3');
  audioElement.play();
}
checkSetupFinished = function () {
  let setupFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
  if( setupFinished === null || setupFinished ===  "" ){
    let ERPIPAddress = localStorage.getItem('EIPAddress');
    let ERPUsername = localStorage.getItem('EUserName');
    let ERPPassword = localStorage.getItem('EPassword');
    let ERPDatabase = localStorage.getItem('EDatabase');
    let ERPPort = localStorage.getItem('EPort');
    const apiUrl = `${URLRequest}${ERPIPAddress}:${ERPPort}/erpapi/TCompanyInfo?PropertyList=ID,IsSetUpWizard`; //,IsSetUpWizard
    const _headers = {
        database: ERPDatabase,
        username: ERPUsername,
        password: ERPPassword
    };
  HTTP.get(apiUrl, { headers: _headers }, (error, result) => {
        if (error) {
          // handle error here
        } else {
          if(result.data != undefined) {
            if( result.data.tcompanyinfo.length > 0 ){
              let data = result.data.tcompanyinfo[0];
              // let cntConfirmedSteps = data.Address3 == "" ? 0 : parseInt(data.Address3);
              let cntConfirmedSteps = data.IsSetUpWizard||false;
              setupFinished = cntConfirmedSteps == confirmStepCount ? true : false;
              localStorage.setItem("IS_SETUP_FINISHED", setupFinished);
              if (data.IsSetUpWizard == true) {
                  $('.setupIncompleatedMsg').hide();
              } else {
                  $('.setupIncompleatedMsg').show();
              }
            }
          }
        }
    });
  }else{
    if (setupFinished == true || setupFinished == "true") {
      $('.setupIncompleatedMsg').hide();
    } else {
      $('.setupIncompleatedMsg').show();
    }
  }
}

checkSetupFinished2 = function () {
  let setupFinished = localStorage.getItem("IS_SETUP_FINISHED") || false;
  if( setupFinished === null || setupFinished ===  "" ){
    let ERPIPAddress = localStorage.getItem('EIPAddress');
    let ERPUsername = localStorage.getItem('EUserName');
    let ERPPassword = localStorage.getItem('EPassword');
    let ERPDatabase = localStorage.getItem('EDatabase');
    let ERPPort = localStorage.getItem('EPort');
    const apiUrl = `${URLRequest}${ERPIPAddress}:${ERPPort}/erpapi/TCompanyInfo?PropertyList=ID`; //,IsSetUpWizard
    const _headers = {
        database: ERPDatabase,
        username: ERPUsername,
        password: ERPPassword
    };
    HTTP.get(apiUrl, { headers: _headers }, (error, result) => {
        if (error) {
          // handle error here
        } else {
          if(result.data != undefined) {
            if( result.data.tcompanyinfo.length > 0 ){
              let data = result.data.tcompanyinfo[0];
              let cntConfirmedSteps = data.Address3 == "" ? 0 : parseInt(data.Address3);
              setupFinished = cntConfirmedSteps == confirmStepCount ? true : false;
              localStorage.setItem("IS_SETUP_FINISHED", setupFinished);
              if (setupFinished) {
                  $('.trueERPConnection').hide();
              } else {
                  $('.trueERPConnection').show();
              }
            }
          }
        }
    });
  }else{
    if (setupFinished == true || setupFinished == "true") {
      $('.trueERPConnection').hide();
    } else {
      $('.trueERPConnection').show();
    }
  }
}

convertStrMonthToNum = function (strMonths) {
  let arrMonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  let ret = [];
  let arrStrMonths = strMonths.split(",");
  let i = 0, idx = -1;
  let mm = "";
  for (i=0; i<arrStrMonths.length; i++) {
      idx = arrMonths.indexOf(arrStrMonths[i]) + 1;
      mm = ("0" + idx).toString().slice(-2);
      ret.push(mm);
  }
  return ret;
}

getRepeatDates = function(startFrom, endBy, months, repdate) {
  let ret = [];
  let arrStartFrom = startFrom.split("-");
  let arrEndBy = endBy.split("-");
  let startYear = arrStartFrom[0];
  let startMonth = arrStartFrom[1];
  let startDate = arrStartFrom[2];
  let endYear = arrEndBy[0];
  let endMonth = arrEndBy[1];
  let endDate = arrEndBy[2];
  let i=0, j=0, k=0;
  let mm = "";
  let repdate2 = "";
  repdate2 = ("0" + repdate).toString().slice(-2);
  for (j=parseInt(startMonth); j<=12; j++) {
      mm = ("0" + j).toString().slice(-2);
      if (months.includes(mm) && parseInt(repdate) >= parseInt(startDate)) {
          ret.push({
              "Dates": startYear + "-" + mm + "-" + repdate2
          });
      }
  }
  for (i=parseInt(startYear)+1; i<parseInt(endYear); i++) {
      for (j=0; j<months.length; j++) {
          ret.push({
              "Dates": i + "-" + months[j] + "-" + repdate2
          });
      }
  }
  for (j=1; j<=parseInt(endMonth); j++) {
      mm = ("0" + j).toString().slice(-2);
      if (j < parseInt(endMonth)) {
          if (months.includes(mm)) {
              ret.push({
                  "Dates": endYear + "-" + mm + "-" + repdate2
              });
          }
      } else {
          if (months.includes(mm) && parseInt(repdate) <= parseInt(endDate)) {
              ret.push({
                  "Dates": endYear + "-" + mm + "-" + repdate2
              });
          }
      }
  }
  return ret;
};

convertDateFormatForPrint = function(pDate) {
  let ret = "";
  let sMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let arrDate = pDate.split("/");
  ret = arrDate[0] + "-" + sMonths[parseInt(arrDate[1]) - 1] + "-" + arrDate[2].substring(2, 4);
  return ret;
}

convertDateFormatForPrint2 = function(pDate) {
  let ret = "";
  let sMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let arrDate = pDate.split("/");
  ret = arrDate[0] + " " + sMonths[parseInt(arrDate[1]) - 1] + " " + arrDate[2];
  return ret;
}

convertDateFormatForPrint3 = function(pDate) {
  let ret = "";
  let sMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let arrDate = pDate.split("/");
  ret = arrDate[0] + " " + sMonths[parseInt(arrDate[1]) - 1] + " " + arrDate[2];
  return ret;
}

initTemplateHeaderFooter1 = function() {
  $("#templatePreviewModal #printcomment").text("");
  $("#templatePreviewModal .pdfCustomerAddress").empty();
  $("#templatePreviewModal .print-header").text("");
  $("#templatePreviewModal .modal-title").text("");
  $("#templatePreviewModal .bankname").text("");
  $("#templatePreviewModal .ban").text("");
  $("#templatePreviewModal .bsb").text("");
  $("#templatePreviewModal .account_number").text("");
  $("#templatePreviewModal .o_name").text("");
  $("#templatePreviewModal .o_address").text("");
  $("#templatePreviewModal .o_city").text("");
  $("#templatePreviewModal .o_state").text("");
  $("#templatePreviewModal .o_phone").text("");
  $("#templatePreviewModal .o_email").text("");
  $("#templatePreviewModal .o_abn_label").text("");
  $("#templatePreviewModal .o_abn").text("");
  $("#templatePreviewModal .date").text("");
  $("#templatePreviewModal .io").text("");
  $("#templatePreviewModal .ro").text("");
  $("#templatePreviewModal .po").text("");
  $("#templatePreviewModal .amountdue").text("");
  $("#templatePreviewModal .due").text("");
}

initTemplateHeaderFooter2 = function() {
  $("#templatePreviewModal #printcomment2").text("");
  $("#templatePreviewModal .pdfCustomerAddress2").empty();
  $("#templatePreviewModal .print-header2").text("");
  $("#templatePreviewModal .modal-title").text("");
  $("#templatePreviewModal .bankname2").text("");
  $("#templatePreviewModal .ban2").text("");
  $("#templatePreviewModal .bsb2").text("");
  $("#templatePreviewModal .account_number2").text("");
  $("#templatePreviewModal .o_name2").text("");
  $("#templatePreviewModal .o_address2").text("");
  $("#templatePreviewModal .o_city2").text("");
  $("#templatePreviewModal .o_state2").text("");
  $("#templatePreviewModal .o_phone2").text("");
  $("#templatePreviewModal .o_email2").text("");
  $("#templatePreviewModal .o_abn_label2").text("");
  $("#templatePreviewModal .o_abn2").text("");
  $("#templatePreviewModal .date2").text("");
  $("#templatePreviewModal .io2").text("");
  $("#templatePreviewModal .ro2").text("");
  $("#templatePreviewModal .due2").text("");
}

initTemplateHeaderFooter3 = function() {
  $("#templatePreviewModal .pdfCustomerAddress3").empty();
  $("#templatePreviewModal .print-header3").text("");
  $("#templatePreviewModal .toLabel3").text("");
  $("#templatePreviewModal .dateLabel3").text("");
  $("#templatePreviewModal .modal-title").text("");
  $("#templatePreviewModal .bankname3").text("");
  $("#templatePreviewModal .ban3").text("");
  $("#templatePreviewModal .swift3").text("");
  $("#templatePreviewModal .account_number3").text("");
  $("#templatePreviewModal .o_name3").text("");
  $("#templatePreviewModal .o_address3").text("");
  $("#templatePreviewModal .o_city3").text("");
  $("#templatePreviewModal .o_state3").text("");
  $("#templatePreviewModal .o_phone3").text("");
  $("#templatePreviewModal .o_email3").text("");
  $("#templatePreviewModal .o_url3").text("");
  $("#templatePreviewModal .o_abn_label3").text("");
  $("#templatePreviewModal .o_abn3").text("");
  $("#templatePreviewModal .date3").text("");
  $("#templatePreviewModal .io3").text("");
  $("#templatePreviewModal .ro3").text("");
  $("#templatePreviewModal .po3").text("");
  $("#templatePreviewModal .amountdue3").text("");
  $("#templatePreviewModal .due3").text("");
  $("#templatePreviewModal .termdays").text("");
  $("#templatePreviewModal .termdesc").text("");
}

loadTemplateHeaderFooter1 = function(object_invoce) {
    if (object_invoce.length > 0) {
        let pcomment = object_invoce[0]["comment"];
        if (pcomment != "" && pcomment != null && pcomment != undefined)
            pcomment = pcomment.replace(/[\r\n]/g, "<br/>");
        $("#templatePreviewModal #printcomment").text(pcomment);

        $("#templatePreviewModal .pdfCustomerAddress").empty();
        let txabillingAddress = object_invoce[0]["supplier_addr"];
        if (txabillingAddress != "" && txabillingAddress != null && txabillingAddress != undefined)
            txabillingAddress = txabillingAddress.replace(/[\r\n]/g, "<br/>");
        $("#templatePreviewModal .pdfCustomerAddress").html(txabillingAddress);
        $("#templatePreviewModal .print-header").text(object_invoce[0]["title"]);
        $("#templatePreviewModal .modal-title").text(object_invoce[0]["title"] + " " + " Template");
        $("#templatePreviewModal .print-header-value").text(object_invoce[0]["value"]);

        $("#templatePreviewModal .bankname").text("Bank Name : " + localStorage.getItem("vs1companyBankName"));
        $("#templatePreviewModal .ban").text("Name : " + localStorage.getItem('vs1companyBankAccountName'));
        if (LoggedCountry == "Australia")
            $("#templatePreviewModal .bsb").text("BSB (Branch Number) : " + object_invoce[0]["bsb"]);
        if (LoggedCountry == "United States" || LoggedCountry == "United States of America")
            $("#templatePreviewModal .bsb").text("Routing Number : " + object_invoce[0]["bsb"]);
        if (LoggedCountry == "South Africa")
            $("#templatePreviewModal .bsb").text("Branch Code : " + object_invoce[0]["bsb"]);
        $("#templatePreviewModal .account_number").text("ACC : " + object_invoce[0]["account"]);

        let companyName = localStorage.getItem("vs1companyName");
        let companyReg = localStorage.getItem("vs1companyReg");
        let companyAddr = localStorage.getItem("vs1companyaddress1");
        if (companyAddr == "")
            companyAddr = localStorage.getItem("vs1companyaddress");
        let companyCity = localStorage.getItem("vs1companyCity");
        let companyState = localStorage.getItem("companyState");
        let companyPostcode = localStorage.getItem("vs1companyPOBox");
        let companyCountry = localStorage.getItem("vs1companyCountry");
        let companyPhone = localStorage.getItem("vs1companyPhone");

        $("#templatePreviewModal .o_name").text(companyName);
        $("#templatePreviewModal .o_address").text(companyAddr);
        $("#templatePreviewModal .o_city").text(companyCity);
        $("#templatePreviewModal .o_state").text(companyState + " " + companyPostcode);
        if (companyPhone != "") {
            $("#templatePreviewModal .o_phone").text(companyPhone.substring(0, 4) + " " + companyPhone.substring(4, 7) + " " + companyPhone.substring(7, companyPhone.length));
        } else if (object_invoce[0]["o_phone"]) {
            $("#templatePreviewModal .o_phone").text(object_invoce[0]["o_phone"]);
        }

        if (object_invoce[0]["title"] == "Customer Payment") {
            $("#templatePreviewModal .o_email").text(object_invoce[0]["supplier_name"]);
        } else {
            $("#templatePreviewModal .o_email").text(localStorage.getItem("VS1Accountant"));
        }

        $("#templatePreviewModal .o_abn_label").text("Company #");
        if (LoggedCountry == "South Africa")
            $("#templatePreviewModal .o_abn_label").text("VAT #");
        if (LoggedCountry == "Australia")
            $("#templatePreviewModal .o_abn_label").text("ABN");

        let companyABN = object_invoce[0]["o_abn"];
        if (companyABN != "")
            $("#templatePreviewModal .o_abn").text(companyABN.substring(0, 2) + " " + companyABN.substring(2, 5) + " " + companyABN.substring(5, 8) + " " + companyABN.substring(8, companyABN.length));
        else
            $("#templatePreviewModal .o_abn").text("");

        if (object_invoce[0]["date"] != "" && object_invoce[0]["date"] != undefined)
            $("#templatePreviewModal .date").text(convertDateFormatForPrint2(object_invoce[0]["date"]));

        $("#templatePreviewModal .io").text(object_invoce[0]["invoicenumber"]);
        $("#templatePreviewModal .ro").text(object_invoce[0]["refnumber"]);
        $("#templatePreviewModal .po").text(object_invoce[0]["pqnumber"]);
        $("#templatePreviewModal .amountdue").text(object_invoce[0]["bal_due"]);
        if (object_invoce[0]["duedate"] != "" && object_invoce[0]["duedate"] != undefined)
            $("#templatePreviewModal .due").text(convertDateFormatForPrint2(object_invoce[0]["duedate"]));

        //   table header
        var tbl_header = $("#templatePreviewModal .tbl_header");
        tbl_header.empty();
        for (const [key, value] of Object.entries(object_invoce[0]["fields"])) {
            tbl_header.append(
                "<th class=" + key + " style='width: " + value[0] + "%; color: #000000; text-align: " + value[1] + "; padding-" + value[1] + ": " + firstIndentLeft + "px;'>" + key + "</th>"
            );
        }
    }
}

loadTemplateHeaderFooter2 = function(object_invoce) {
  if (object_invoce.length > 0) {
      let pcomment = object_invoce[0]["comment"];
      if (pcomment != "" && pcomment != null && pcomment != undefined)
        pcomment = pcomment.replace(/[\r\n]/g, "<br/>");
      $("#templatePreviewModal #printcomment2").text(pcomment);

      $("#templatePreviewModal .pdfCustomerAddress2").empty();
      let txabillingAddress = object_invoce[0]["supplier_addr"];
      if (txabillingAddress != "" && txabillingAddress != null && txabillingAddress != undefined)
          txabillingAddress = txabillingAddress.replace(/[\r\n]/g, "<br/>");
      $("#templatePreviewModal .pdfCustomerAddress2").html(txabillingAddress);
      $("#templatePreviewModal .print-header2").text(object_invoce[0]["title"]);
      $("#templatePreviewModal .modal-title").text(object_invoce[0]["title"] + " " + " Template");
      $("#templatePreviewModal .print-header-value2").text(object_invoce[0]["value"]);

      $("#templatePreviewModal .bankname2").text("Bank Name : " + localStorage.getItem("vs1companyBankName"));
      $("#templatePreviewModal .ban2").text("Name : " + localStorage.getItem('vs1companyBankAccountName'));
      if (LoggedCountry == "Australia")
        $("#templatePreviewModal .bsb2").text("BSB (Branch Number) : " + object_invoce[0]["bsb"]);
      if (LoggedCountry == "United States" || LoggedCountry == "United States of America")
        $("#templatePreviewModal .bsb2").text("Routing Number : " + object_invoce[0]["bsb"]);
      if (LoggedCountry == "South Africa")
        $("#templatePreviewModal .bsb2").text("Branch Code : " + object_invoce[0]["bsb"]);
      $("#templatePreviewModal .account_number2").text("ACC : " + object_invoce[0]["account"]);

      let companyName = localStorage.getItem("vs1companyName");
      let companyReg = localStorage.getItem("vs1companyReg");
      let companyAddr = localStorage.getItem("vs1companyaddress1");
      if (companyAddr == "")
          companyAddr = localStorage.getItem("vs1companyaddress2");
      let companyCity = localStorage.getItem("vs1companyCity");
      let companyState = localStorage.getItem("companyState");
      let companyPostcode = localStorage.getItem("vs1companyPOBox");
      let companyCountry = localStorage.getItem("vs1companyCountry");
      let companyPhone = localStorage.getItem("vs1companyPhone");

      $("#templatePreviewModal .o_name2").text(companyName);
      $("#templatePreviewModal .o_address2").text(companyAddr);
      $("#templatePreviewModal .o_city2").text(companyCity);
      $("#templatePreviewModal .o_state2").text(companyState + " " + companyPostcode);
      if (companyPhone != "") {
          $("#templatePreviewModal .o_phone2").text(companyPhone.substring(0, 4) + " " + companyPhone.substring(4, 7) + " " + companyPhone.substring(7, companyPhone.length));
      } else if (object_invoce[0]["o_phone"]) {
          $("#templatePreviewModal .o_phone2").text(object_invoce[0]["o_phone"]);
      }

      if (object_invoce[0]["title"] == "Statement") {
        $("#templatePreviewModal .p_header2").hide();
        $("#templatePreviewModal .p_header2_2").show();
        $("#templatePreviewModal .div_invoice2").hide();
      } else {
        $("#templatePreviewModal .p_header2").show();
        $("#templatePreviewModal .p_header2_2").hide();
        $("#templatePreviewModal .div_invoice2").show();
      }

      if (object_invoce[0]["title"] == "Customer Payment") {
        $("#templatePreviewModal .o_email2").text(object_invoce[0]["supplier_name"]);
        $("#templatePreviewModal .label_date2").text("Payment Date");
        $("#templatePreviewModal .p_inv_num").hide();
        $("#templatePreviewModal .div_payment2").hide();
      } else {
        $("#templatePreviewModal .o_email2").text(localStorage.getItem("VS1Accountant"));
        $("#templatePreviewModal .label_date2").text("Invoice Date");
        $("#templatePreviewModal .p_inv_num").show();
        $("#templatePreviewModal .div_payment2").show();
      }

      $("#templatePreviewModal .o_abn_label2").text("Company #");
      if (LoggedCountry == "South Africa")
          $("#templatePreviewModal .o_abn_label2").text("VAT #");
      if (LoggedCountry == "Australia")
          $("#templatePreviewModal .o_abn_label2").text("ABN");

      let companyABN = object_invoce[0]["o_abn"];
      if (companyABN != "")
        $("#templatePreviewModal .o_abn2").text(companyABN.substring(0, 2) + " " + companyABN.substring(2, 5) + " " + companyABN.substring(5, 8) + " " + companyABN.substring(8, companyABN.length));
      else
        $("#templatePreviewModal .o_abn2").text("");

      if (object_invoce[0]["date"] != "" && object_invoce[0]["date"] != undefined)
          $("#templatePreviewModal .date2").text(convertDateFormatForPrint2(object_invoce[0]["date"]));

      $("#templatePreviewModal .io2").text(object_invoce[0]["invoicenumber"]);
      $("#templatePreviewModal .ro2").text(object_invoce[0]["refnumber"]);
      if (object_invoce[0]["duedate"] != "" && object_invoce[0]["duedate"] != undefined)
          $("#templatePreviewModal .due2").text(convertDateFormatForPrint2(object_invoce[0]["duedate"]));

      //   table header
      var tbl_header = $("#templatePreviewModal .tbl_header");
      tbl_header.empty();
      for (const [key, value] of Object.entries(object_invoce[0]["fields"])) {
          tbl_header.append(
              "<th class=" + key + " style='width: " + value[0] + "%; color: #000000; text-align: " + value[1] + "; padding-" + value[1] + ": " + firstIndentLeft + "px;'>" + key + "</th>"
          );
      }
  }
}

loadTemplateHeaderFooter3 = function(object_invoce) {
  if (object_invoce.length > 0) {
      $("#templatePreviewModal .pdfCustomerAddress3").empty();
      let txabillingAddress = object_invoce[0]["supplier_addr"];
      if (txabillingAddress != "" && txabillingAddress != null && txabillingAddress != undefined)
          txabillingAddress = txabillingAddress.replace(/[\r\n]/g, "<br/>");
      $("#templatePreviewModal .pdfCustomerAddress3").html(txabillingAddress);

      if (object_invoce[0]["title"] == "Customer Payment") {
        $("#templatePreviewModal .template-preview-body3").css("height", "140mm");
        $("#templatePreviewModal .print-header3").text(object_invoce[0]["title"].toUpperCase() + " # " + object_invoce[0]["value"]);
        $("#templatePreviewModal .toLabel3").text("CUSTOMER TO: ");
        $("#templatePreviewModal .div_invoice3").hide();
        $("#templatePreviewModal .div_payment3_title").hide();
        $("#templatePreviewModal .div_payment3").hide();
        $("#templatePreviewModal .div_company_info3").hide();
      } else {
        $("#templatePreviewModal .template-preview-body3").css("height", "100mm");
        $("#templatePreviewModal .print-header3").text(object_invoce[0]["title"].toUpperCase());
        $("#templatePreviewModal .toLabel3").text(object_invoce[0]["title"].toUpperCase() + " TO: ");
        $("#templatePreviewModal .div_invoice3").show();
        $("#templatePreviewModal .div_payment3_title").show();
        $("#templatePreviewModal .div_payment3").show();
        $("#templatePreviewModal .div_company_info3").show();
      }
      $("#templatePreviewModal .dateLabel3").text(object_invoce[0]["title"].toUpperCase() + " DATE: ");
      //   $("#templatePreviewModal .invNumber3").text(object_invoce[0]["title"].toUpperCase() + " NUMBER");
      $("#templatePreviewModal .modal-title").text(
          object_invoce[0]["title"] + " " + " Template"
      );
      $("#templatePreviewModal .bankname3").text("Bank Name : " + localStorage.getItem("vs1companyBankName"));
      $("#templatePreviewModal .ban3").text(localStorage.getItem('vs1companyBankAccountName'));
      $("#templatePreviewModal .swift3").text(object_invoce[0]["swift"]);
      $("#templatePreviewModal .account_number3").text(object_invoce[0]["account"]);

      let companyName = localStorage.getItem("vs1companyName");
      let companyReg = localStorage.getItem("vs1companyReg");
      let companyAddr = localStorage.getItem("vs1companyaddress1");
      if (companyAddr == "")
          companyAddr = localStorage.getItem("vs1companyaddress2");
      let companyCity = localStorage.getItem("vs1companyCity");
      let companyState = localStorage.getItem("companyState");
      let companyPostcode = localStorage.getItem("vs1companyPOBox");
      let companyCountry = localStorage.getItem("vs1companyCountry");
      let companyPhone = localStorage.getItem("vs1companyPhone");
      let companyURL = localStorage.getItem("vs1companyURL");

      $("#templatePreviewModal .o_name3").text(companyName);
      $("#templatePreviewModal .o_address3").text(companyAddr);
      $("#templatePreviewModal .o_city3").text(companyCity + ", " + companyState);
      $("#templatePreviewModal .o_state3").text(companyPostcode + ", " + LoggedCountry);
      if (companyPhone != "") {
          $("#templatePreviewModal .o_phone3").text(companyPhone.substring(0, 4) + " " + companyPhone.substring(4, 7) + " " + companyPhone.substring(7, companyPhone.length));
      } else if (object_invoce[0]["o_phone"]) {
          $("#templatePreviewModal .o_phone3").text(object_invoce[0]["o_phone"]);
      }
      $("#templatePreviewModal .o_email3").text(localStorage.getItem("VS1Accountant"));
      $("#templatePreviewModal .o_url3").text(companyURL);

      $("#templatePreviewModal .o_abn_label3").text("Company #");
      if (LoggedCountry == "South Africa")
          $("#templatePreviewModal .o_abn_label3").text("VAT #");
      if (LoggedCountry == "Australia")
          $("#templatePreviewModal .o_abn_label3").text("ABN");

      let companyABN = object_invoce[0]["o_abn"];
      if (companyABN != "")
        $("#templatePreviewModal .o_abn3").text(companyABN.substring(0, 2) + " " + companyABN.substring(2, 5) + " " + companyABN.substring(5, 8) + " " + companyABN.substring(8, companyABN.length));
      else
        $("#templatePreviewModal .o_abn3").text("");

      if (object_invoce[0]["date"] != "" && object_invoce[0]["date"] != undefined)
          $("#templatePreviewModal .date3").text(convertDateFormatForPrint3(object_invoce[0]["date"]));
      $("#templatePreviewModal .io3").text(object_invoce[0]["invoicenumber"]);
      $("#templatePreviewModal .ro3").text(object_invoce[0]["refnumber"]);
      $("#templatePreviewModal .po3").text(object_invoce[0]["pqnumber"]);
      $("#templatePreviewModal .amountdue3").text(object_invoce[0]["bal_due"]);

      if (object_invoce[0]["duedate"] != "" && object_invoce[0]["duedate"] != undefined)
          $("#templatePreviewModal .due3").text(convertDateFormatForPrint2(object_invoce[0]["duedate"]));
      $("#templatePreviewModal .termdays").text($("#sltTerms").val());
      $("#templatePreviewModal .termdesc").text(localStorage.getItem("ERPTermDesc") || "-");

      //   table header
      var tbl_header = $("#templatePreviewModal .tbl_header");
      tbl_header.empty();
      for (const [key, value] of Object.entries(object_invoce[0]["fields"])) {
          tbl_header.append(
              "<th class=" + key + " style='width: " + value[0] + "%; background-color: #00949E; color: white; text-align: " + value[1] + "; padding-" + value[1] + ": " + firstIndentLeft + "px;'>" + key + "</th>"
          );
      }
  }
}

var getPrintGridSettings = function() {
    return {
        "Bill": {
            "Account_Name": ["30", "left", true],
            "Description": ["40", "left", true],
            "Tax": ["15", "right", true],
            "Amount": ["15", "right", true],
        },
        "Credit": {
            Date: ["15", "left", true],
            Type: ["15", "left", true],
            Trans: ["10", "right", true],
            Original: ["15", "right", true],
            Due: ["15", "right", true],
            Paid: ["15", "right", true],
            Outstanding: ["15", "right", true],
        },
        "Customer Payment": {
            Date: ["15", "left", true],
            Type: ["15", "left", true],
            Trans: ["10", "right", true],
            Original: ["15", "right", true],
            Due: ["15", "right", true],
            Paid: ["15", "right", true],
            Outstanding: ["15", "right", true],
        },
        "Customer Statement": {
            ID: ["10", "left", true],
            Date: ["15", "left", true],
            Type: ["15", "left", true],
            "Due_Date": ["15", "left", true],
            Total: ["15", "right", true],
            Paid: ["15", "right", true],
            Balance: ["15", "right", true],
        },
        "Invoice": {
            "Product_Name": ["20", "left", true],
            Description: ["25", "left", true],
            "Bin_Location": ["15", "left", false],
            Qty: ["10", "left", true],
            "Unit_Price": ["10", "left", true],
            Tax: ["10", "left", true],
            Amount: ["10", "left", true],
        },
        "Invoice Back Order": {
            "Product_Name": ["20", "left", true],
            Description: ["25", "left", true],
            "Bin_Location": ["15", "left", false],
            Qty: ["10", "left", true],
            "Unit_Price": ["10", "left", true],
            Tax: ["10", "left", true],
            Amount: ["10", "left", true],
        },
        "Purchase Order": {
            "Product_Name": ["20", "left", true],
            Description: ["25", "left", true],
            "Bin_Location": ["15", "left", false],
            Qty: ["10", "left", true],
            "Unit_Price": ["10", "left", true],
            Tax: ["10", "left", true],
            Amount: ["10", "left", true],
        },
        "Quote": {
            "Product_Name": ["20", "left", true],
            Description: ["25", "left", true],
            "Bin_Location": ["15", "left", false],
            Qty: ["10", "left", true],
            "Unit_Price": ["10", "left", true],
            Tax: ["10", "left", true],
            Amount: ["10", "left", true],
        },
        "Refund": {
            "Product_Name": ["20", "left", true],
            Description: ["25", "left", true],
            "Bin_Location": ["15", "left", false],
            Qty: ["10", "left", true],
            "Unit_Price": ["10", "left", true],
            Tax: ["10", "left", true],
            Amount: ["10", "left", true],
        },
        "Sales Order": {
            "Product_Name": ["20", "left", true],
            Description: ["25", "left", true],
            "Bin_Location": ["15", "left", false],
            Qty: ["10", "left", true],
            "Unit_Price": ["10", "left", true],
            Tax: ["10", "left", true],
            Amount: ["10", "left", true],
        },
        "Supplier Payment": {
            Date: ["15", "left", true],
            Type: ["15", "left", true],
            No: ["10", "left", true],
            Amount: ["15", "left", true],
            Due: ["15", "left", true],
            Paid: ["15", "left", true],
            Outstanding: ["15", "left", true],
        },
        "Statement": {
            Date: ["15", "left", true],
            Type: ["15", "left", true],
            No: ["10", "left", true],
            Amount: ["15", "left", true],
            Due: ["15", "left", true],
            Paid: ["15", "left", true],
            Outstanding: ["15", "left", true],
        },
        "Delivery Docket": {
            "Product_Name": ["30", "left", true],
            Description: ["30", "left", true],
            "Bin_Location": ["20", "left", false],
            Qty: ["20", "left", true],
        },
        "Journal Entry": {
            "Account_Name": ["30", "left", true],
            Description: ["40", "left", true],
            "Credit_Ex": ["15", "left", true],
            "Debit_Ex": ["15", "left", true],
        },
        "Deposit": {
            "From_Account": ["20", "left", true],
            "Payment_Method": ["20", "left", true],
            "Reference_No": ["20", "left", true],
            "Received_From": ["25", "left", true],
            Amount: ["15", "left"],
        },
        "Cheque": {
            "Account_Name": ["30", "left", true],
            Description: ["40", "left", true],
            Tax: ["15", "left", true],
            Amount: ["15", "left", true],
        },
        "Stock Transfer": {
            "Product_Name": ["30", "left", true],
            Description: ["30", "left", true],
            "Bin_Location": ["20", "left", false],
            Qty: ["20", "left", true],
        },
        "Stock Adjustment": {
            "Product_Name": ["30", "left", true],
            Description: ["30", "left", true],
            "Bin_Location": ["20", "left", false],
            Qty: ["20", "left", true],
        },
    };
}
getPrintMainSettings = function () {
    return {
        "1": {
            "LOGO": ['', 'left', true],
            "ABN": ['', 'left', true],
            "HEADER_TITLE": ['', 'left', true],
            "NO": ['', 'left', true],
            "CUSTOMER_ADDRESS": ['', 'left', true],
            "COMPANY_NAME": ['', 'left', true],
            "COMPANY_ADDRESS": ['', 'left', true],
            "COMPANY_CITY": ['', 'left', true],
            "COMPANY_PHONE": ['', 'left', true],
            "COMPANY_EMAIL": ['', 'left', true],
            "COMPANY_STATE": ['', 'left', true],
            "BARCODE": ['', 'left', true],
            "INVOICE_NUMBER": ['', 'left', true],
            "REFERENCE": ['', 'left', true],
            "ACCOUNT_NUMBER": ['', 'left', true],
            "AMOUNT_DUE": ['', 'left', true],
            "DUE_DATE": ['', 'left', true],
            "COMMENT": ['', 'left', true],
            "ACCOUNT_NAME": ['', 'left', true],
            "BANK_NAME": ['', 'left', true],
            "BSB": ['', 'left', true],
            "ACC": ['', 'left', true],
            "SUB_TOTAL": ['', 'left', true],
            "TOTAL_TAX": ['', 'left', true],
            "GST": ['', 'left', true],
            "BALANCE": ['', 'left', true],
        },
        "2": {
            "LOGO2": ['', 'left', true],
            "ABN2": ['', 'left', true],
            "HEADER_TITLE2": ['', 'left', true],
            "CUSTOMER_ADDRESS2": ['', 'left', true],
            "COMPANY_NAME2": ['', 'left', true],
            "COMPANY_ADDRESS2": ['', 'left', true],
            "COMPANY_CITY2": ['', 'left', true],
            "COMPANY_PHONE2": ['', 'left', true],
            "COMPANY_EMAIL2": ['', 'left', true],
            "COMPANY_STATE2": ['', 'left', true],
            "BARCODE2": ['', 'left', true],
            "INVOICE_DATE2": ['', 'left', true],
            "INVOICE_NUMBER2": ['', 'left', true],
            "REFERENCE2": ['', 'left', true],
            "AMOUNT_DUE2": ['', 'left', true],
            "COMMENT2": ['', 'left', true],
            "ACCOUNT_NAME2": ['', 'left', true],
            "BANK_NAME2": ['', 'left', true],
            "BSB2": ['', 'left', true],
            "ACC2": ['', 'left', true],
            "SUB_TOTAL2": ['', 'left', true],
            "TOTAL_AUD2": ['', 'left', true],
            "PAID_AMOUNT2": ['', 'left', true],
            "AMOUNT_DUE_AUD2": ['', 'left', true],
        },
        "3": {
            "LOGO3": ['', 'left', true],
            "ABN3": ['', 'left', true],
            "HEADER_TITLE3": ['', 'left', true],
            "BARCODE3": ['', 'left', true],
            "BILL_TO2": ['', 'left', true],
            "BILL_DATE3": ['', 'left', true],
            "CUSTOMER_ADDRESS3": ['', 'left', true],
            "INVOICE_NUMBER3": ['', 'left', true],
            "REFERENCE3": ['', 'left', true],
            "ACCOUNT_NUMBER3": ['', 'left', true],
            "AMOUNT_DUE3": ['', 'left', true],
            "DUE_DATE3": ['', 'left', true],
            "PAYMENT_DETAILS3": ['', 'left', true],
            "ACCOUNT_NAME3": ['', 'left', true],
            "BANK_NAME3": ['', 'left', true],
            "SORT_CODE3": ['', 'left', true],
            "ACC3": ['', 'left', true],
            "ACCOUNT_DETAIL3": ['', 'left', true],
            "PAYMENT_TERMS3": ['', 'left', true],
            "SUB_TOTAL3": ['', 'left', true],
            "BOTTOM_LOGO3": ['', 'left', true],
            "COMPANY_NAME3": ['', 'left', true],
            "COMPANY_ADDRESS3": ['', 'left', true],
            "COMPANY_CITY3": ['', 'left', true],
            "COMPANY_STATE3": ['', 'left', true],
            "COMPANY_PHONE3": ['', 'left', true],
            "COMPANY_EMAIL3": ['', 'left', true],
            "COMPANY_URL3": ['', 'left', true],
        }
    };
};

getPrintSettings = async function (type, template) {
    if (type.lastIndexOf('s') == type.length -1 ) {
        type = type.slice(0, -1);
    }
    let settings = await getVS1Data('PrintDisplaySettings');
    if (settings.length > 0) {
        let parsedData = JSON.parse(settings[0].data);
        if (parsedData[type]) {
            return parsedData[type][template];
        }
    }

    let gridSettings = getPrintGridSettings();
    if (!gridSettings[type]) {
        return null;
    }

    let printSettings = getPrintMainSettings()[template];
    if (!printSettings) {
        printSettings = {};
    }

    for (key in gridSettings[type]) {
        printSettings[key] = [];
        printSettings[key] = gridSettings[type][key];
    }

    return printSettings;
};

setPrintSettings = async function (type, template, newSettings) {
    if (type.lastIndexOf('s') == type.length -1 ) {
        type = type.slice(0, -1);
    }
    let printSettings = await getVS1Data('PrintDisplaySettings');
    if (printSettings.length > 0) {
        let parsedData = JSON.parse(printSettings[0].data);
        for (let key in newSettings) {
            parsedData[type][template][key] = newSettings[key];
        }
        await addVS1Data('PrintDisplaySettings', JSON.stringify(parsedData));
    } else {
        let types = ['Bill', 'Credit', 'Customer Payment', 'Customer Statement', 'Invoice', 'Invoice Back Order', 'Purchase Order', 'Quote', 'Refund',
            'Sales Order', 'Supplier Payment', 'Statement', 'Delivery Docket', 'Journal Entry', 'Deposit', 'Cheque', 'Stock Transfer', 'Stock Adjustment'];

        printSettings = {}
        for (let i = 0; i < types.length; i++) {
            let templates = {'1': {}, '2': {}, '3': {}};
            printSettings[types[i]] = Object.assign({}, templates);
            let printMainSettings = getPrintMainSettings();
            for (templateKey in printMainSettings) {
                if (type == types[i] && template == templateKey) {
                    for (key in newSettings) {
                        printSettings[type][template][key] = newSettings[key];
                    }
                } else {
                    let values = printMainSettings[templateKey];
                    for (innerKey in values) {
                        printSettings[types[i]][templateKey][innerKey] = values[innerKey];
                    }
                }
            }
        }
        await addVS1Data('PrintDisplaySettings', JSON.stringify(printSettings));
    }
};

validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
