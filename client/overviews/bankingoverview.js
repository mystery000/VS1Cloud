import { PaymentsService } from '../payments/payments-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { UtilityService } from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './bankingoverview.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import moment from "moment";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.bankingoverview.inheritsHooksFrom('transaction_list');

Template.bankingoverview.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.awaitingcustpaymentCount = new ReactiveVar();
    templateObject.awaitingsupppaymentCount = new ReactiveVar();

    templateObject.overduecustpaymentCount = new ReactiveVar();
    templateObject.overduesupppaymentCount = new ReactiveVar();
    templateObject.bankaccountdatarecord = new ReactiveVar([]);

    templateObject.displayfields = new ReactiveVar([]);
    templateObject.reset_data = new ReactiveVar([]);

    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.getDataTableList = function(data) {
        let lineID = "LineID";
        let accountType = data.Type || '';
        let amount = utilityService.modifynegativeCurrencyFormat(data.Amount) || 0.00;
        let amountInc = utilityService.modifynegativeCurrencyFormat(data.Amountinc) || 0.00;
        let creditEx = utilityService.modifynegativeCurrencyFormat(data.TotalCreditInc) || 0.00;
        let openningBalance = utilityService.modifynegativeCurrencyFormat(data.OpeningBalanceInc) || 0.00;
        let closingBalance = utilityService.modifynegativeCurrencyFormat(data.ClosingBalanceInc) || 0.00;

        if (data.Type == "Un-Invoiced PO") {
            lineID = data.PurchaseOrderID;
        } else if (data.Type == "PO") {
            lineID = data.PurchaseOrderID;
        } else if (data.Type == "Invoice") {
            lineID = data.SaleID;
        } else if (data.Type == "Credit") {
            lineID = data.PurchaseOrderID;
        } else if (data.Type == "Supplier Payment") {
            lineID = data.PaymentID;
        } else if (data.Type == "Bill") {
            lineID = data.PurchaseOrderID;
        } else if (data.Type == "Customer Payment") {
            lineID = data.PaymentID;
        } else if (data.Type == "Journal Entry") {
            lineID = data.SaleID;
        } else if (data.Type == "UnInvoiced SO") {
            lineID = data.SaleID;
        } else if (data.Type == "Cheque") {
            if (localStorage.getItem('ERPLoggedCountry') == "Australia") {
                accountType = "Cheque";
            } else if (localStorage.getItem('ERPLoggedCountry') == "United States of America") {
                accountType = "Check";
            } else {
                accountType = "Cheque";
            }

            lineID = data.PurchaseOrderID;
        } else if (data.Type == "Check") {
            lineID = data.PurchaseOrderID;
        }else {
            lineID = data.TransID;
        }

        var dataList = [
            data.Date != '' ? moment(data.Date).format("YYYY/MM/DD") : data.Date,
            '<span style="display:none;">' + (data.Date != '' ? moment(data.Date).format("YYYY/MM/DD") : data.Date).toString() + '</span>' +
            (data.Date != '' ? moment(data.Date).format("DD/MM/YYYY") : data.Date).toString(),
            lineID || '',
            data.AccountName || '',
            accountType || '',
            amount || 0.00,
            amountInc || 0.00,
            data.ClassName || '',
            data.ChqRefNo || '',
            data.Active == true ? '' : "Deleted",
            data.Notes || '',
            // creditex: creditEx || 0.00,
            // customername: data.ClientName || '',
            // openingbalance: openningBalance || 0.00,
            // closingbalance: closingBalance || 0.00,
            // accountnumber: data.AccountNumber || '',
            // accounttype: data.AccountType || '',
            // balance: balance || 0.00,
            // receiptno: data.ReceiptNo || '',
            // jobname: data.jobname || '',
            // paymentmethod: data.PaymentMethod || '',
        ];
        return dataList;
    }

    let headerStructure = [
        {index: 0, label: "#ID", class: "colSortDate", width: "0", active: false, display: false},
        {index: 1, label: "Date", class: "colPaymentDate", width: "80", active: true, display: true},
        {index: 2, label: "Trans ID", class: "colAccountId", width: "80", active: true, display: true},
        {index: 3, label: "Account", class: "colBankAccount", width: "100", active: true, display: true},
        {index: 4, label: "Type", class: "colType", width: "120", active: true, display: true},
        {index: 5, label: "Amount", class: "colPaymentAmount", width: "80", active: true, display: true},
        {index: 6, label: "Amount (Inc)", class: "colDebitEx", width: "120", active: true, display: true},
        {index: 7, label: "Department", class: "colDepartment", width: "80", active: true, display: true},
        {index: 8, label: "#ChqRefNo", class: "colChqRefNo", width: "110", active: false, display: true},
        {index: 9, label: "Status", class: "colStatus", width: "100", active: true, display: true},
        {index: 10, label: "Comments", class: "colNotes", width: "", active: true, display: true},
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.bankingoverview.onRendered(function() {
});

Template.bankingoverview.events({
    'click #tblBankingOverview tbody tr': function (event) {
        var listData = $(event.target).closest('tr').find('.colAccountId').text();
        var transactiontype = $(event.target).closest("tr").find(".colType").text();
        if ((listData) && (transactiontype)) {
            if (transactiontype == "Un-Invoiced PO") {
                FlowRouter.go('/purchaseordercard?id=' + listData);
            } else if (transactiontype == "PO") {
                FlowRouter.go('/purchaseordercard?id=' + listData);
            } else if (transactiontype == "Invoice") {
                FlowRouter.go('/invoicecard?id=' + listData);
            } else if (transactiontype == "Credit") {
                FlowRouter.go('/creditcard?id=' + listData);
            } else if (transactiontype == "Supplier Payment") {
                FlowRouter.go('/supplierpaymentcard?id=' + listData);
            } else if (transactiontype == "Bill") {
                FlowRouter.go('/billcard?id=' + listData);
            } else if (transactiontype == "Customer Payment") {
                FlowRouter.go('/paymentcard?id=' + listData);
            } else if (transactiontype == "Journal Entry") {
                FlowRouter.go('/journalentrycard?id=' + listData);
            } else if (transactiontype == "UnInvoiced SO") {
                FlowRouter.go('/salesordercard?id=' + listData);
            } else if (transactiontype == "Cheque") {
                FlowRouter.go('/chequecard?id=' + listData);
            } else if (transactiontype == "Check") {
                FlowRouter.go('/chequecard?id=' + listData);
            } else if (transactiontype == "Deposit Entry") {
                FlowRouter.go('/depositcard?id=' + listData);
            } else {
                FlowRouter.go('/chequelist');
            }
        }
    },
    'click .btnEft': function() {
      FlowRouter.go('/eft');
    },
    "keyup #tblBankingOverview_filter input": function (event) {
      if ($(event.target).val() != "") {
        $(".btnRefreshBankingOverview").addClass("btnSearchAlert");
      } else {
        $(".btnRefreshBankingOverview").removeClass("btnSearchAlert");
      }
      if (event.keyCode == 13) {
        $(".btnRefresh").trigger("click");
      }
    },
    "click .btnRefreshBankingOverview": function () {
        $(".btnRefresh").trigger("click");
    },
    'click .btnRefresh': function() {
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
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();

        sideBarService.getAllBankAccountDetails(prevMonth11Date,toDate, true,initialReportLoad,0).then(function(data) {
            addVS1Data('TBankAccountReport', JSON.stringify(data)).then(function(datareturn) {
                window.open('/bankingoverview','_self');
            }).catch(function(err) {
                window.open('/bankingoverview','_self');
            });
        }).catch(function(err) {
            window.open('/bankingoverview','_self');
        });
        //templateObject.getAllBankAccountData();
    },

    // 'click #today': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentBeginDate = new Date();
    //     var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    //     let fromDateMonth = (currentBeginDate.getMonth() + 1);
    //     let fromDateDay = currentBeginDate.getDate();
    //     if((currentBeginDate.getMonth()+1) < 10){
    //         fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
    //     }else{
    //       fromDateMonth = (currentBeginDate.getMonth()+1);
    //     }
    //
    //     if(currentBeginDate.getDate() < 10){
    //         fromDateDay = "0" + currentBeginDate.getDate();
    //     }
    //     var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    //     var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    //
    //     var toDateDisplayFrom = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
    //     var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
    //
    //     $("#dateFrom").val(toDateDisplayFrom);
    //     $("#dateTo").val(toDateDisplayTo);
    //     templateObject.getAllFilterbankingData(toDateERPFrom,toDateERPTo, false);
    // },
    // 'click #lastweek': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentBeginDate = new Date();
    //     var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    //     let fromDateMonth = (currentBeginDate.getMonth() + 1);
    //     let fromDateDay = currentBeginDate.getDate();
    //     if((currentBeginDate.getMonth()+1) < 10){
    //         fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
    //     }else{
    //       fromDateMonth = (currentBeginDate.getMonth()+1);
    //     }
    //
    //     if(currentBeginDate.getDate() < 10){
    //         fromDateDay = "0" + currentBeginDate.getDate();
    //     }
    //     var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay - 7);
    //     var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    //
    //     var toDateDisplayFrom = (fromDateDay -7)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
    //     var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
    //
    //     $("#dateFrom").val(toDateDisplayFrom);
    //     $("#dateTo").val(toDateDisplayTo);
    //     templateObject.getAllFilterbankingData(toDateERPFrom,toDateERPTo, false);
    // },
    // 'click #lastMonth': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentDate = new Date();
    //
    //     var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    //     var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);
    //
    //     var formatDateComponent = function(dateComponent) {
    //       return (dateComponent < 10 ? '0' : '') + dateComponent;
    //     };
    //
    //     var formatDate = function(date) {
    //       return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
    //     };
    //
    //     var formatDateERP = function(date) {
    //       return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
    //     };
    //
    //
    //     var fromDate = formatDate(prevMonthFirstDate);
    //     var toDate = formatDate(prevMonthLastDate);
    //
    //     $("#dateFrom").val(fromDate);
    //     $("#dateTo").val(toDate);
    //
    //     var getLoadDate = formatDateERP(prevMonthLastDate);
    //     let getDateFrom = formatDateERP(prevMonthFirstDate);
    //     templateObject.getAllFilterbankingData(getDateFrom,getLoadDate, false);
    // },
    // 'click #lastQuarter': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentDate = new Date();
    //     var begunDate = moment(currentDate).format("DD/MM/YYYY");
    //
    //     var begunDate = moment(currentDate).format("DD/MM/YYYY");
    //     function getQuarter(d) {
    //         d = d || new Date();
    //         var m = Math.floor(d.getMonth() / 3) + 2;
    //         return m > 4 ? m - 4 : m;
    //     }
    //
    //     var quarterAdjustment = (moment().month() % 3) + 1;
    //     var lastQuarterEndDate = moment().subtract({
    //         months: quarterAdjustment
    //     }).endOf('month');
    //     var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
    //         months: 2
    //     }).startOf('month');
    //
    //     var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
    //     var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");
    //
    //
    //     $("#dateFrom").val(lastQuarterStartDateFormat);
    //     $("#dateTo").val(lastQuarterEndDateFormat);
    //
    //     let fromDateMonth = getQuarter(currentDate);
    //     var quarterMonth = getQuarter(currentDate);
    //     let fromDateDay = currentDate.getDate();
    //
    //     var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
    //     let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
    //     templateObject.getAllFilterbankingData(getDateFrom,getLoadDate, false);
    // },
    // 'click #last12Months': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', false);
    //     $('#dateTo').attr('readonly', false);
    //     var currentDate = new Date();
    //     var begunDate = moment(currentDate).format("DD/MM/YYYY");
    //
    //     let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    //     let fromDateDay = currentDate.getDate();
    //     if ((currentDate.getMonth()+1) < 10) {
    //         fromDateMonth = "0" + (currentDate.getMonth()+1);
    //     }
    //     if (currentDate.getDate() < 10) {
    //         fromDateDay = "0" + currentDate.getDate();
    //     }
    //
    //     var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
    //     $("#dateFrom").val(fromDate);
    //     $("#dateTo").val(begunDate);
    //
    //     var currentDate2 = new Date();
    //     if ((currentDate2.getMonth()+1) < 10) {
    //         fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
    //     }
    //     if (currentDate2.getDate() < 10) {
    //         fromDateDay2 = "0" + currentDate2.getDate();
    //     }
    //     var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    //     let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
    //     templateObject.getAllFilterbankingData(getDateFrom,getLoadDate, false);
    //
    // },
    // 'click #ignoreDate': function () {
    //     let templateObject = Template.instance();
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     $('#dateFrom').attr('readonly', true);
    //     $('#dateTo').attr('readonly', true);
    //     templateObject.getAllFilterbankingData('', '', true);
    // },
    'click #newSalesOrder': function(event) {
        FlowRouter.go('/salesordercard');
    },
    'click .btnNewDepositEnrty': function(event) {
        FlowRouter.go('/depositcard');
    },
    'click .btnDepositList': function(event) {
        FlowRouter.go('/depositlist');
    },
    'click .btnCustomerlist': function(event) {
        FlowRouter.go('/customerpayment');
    },
    'click #newInvoice': function(event) {
        FlowRouter.go('/invoicecard');
    },
    'click .btnSupplierPaymentList': function(event) {
        FlowRouter.go('/supplierpayment');
    },
    'click #newQuote': function(event) {
        FlowRouter.go('/quotecard');
    },
    'click .QuoteList': function(event) {
        FlowRouter.go('/quoteslist');
    },
    'click #btnNewCheck': function(event) {
        FlowRouter.go('/chequecard');
    },
    // 'click .chkDatatable': function(event) {
    //     var columns = $('#tblBankingOverview th');
    //     let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();
    //
    //     $.each(columns, function(i, v) {
    //         let className = v.classList;
    //         let replaceClass = className[1];
    //
    //         if (v.innerText === columnDataValue) {
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


  // custom field displaysettings
  // "click .saveTable": async function(event) {
  //   let lineItems = [];
  //   $(".fullScreenSpin").css("display", "inline-block");
  //
  //   $(".customDisplaySettings").each(function (index) {
  //     var $tblrow = $(this);
  //     var fieldID = $tblrow.attr("custid") || 0;
  //     var colTitle = $tblrow.find(".divcolumn").text() || "";
  //     var colWidth = $tblrow.find(".custom-range").val() || 0;
  //     var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
  //     var colHidden = false;
  //     if ($tblrow.find(".custom-control-input").is(":checked")) {
  //       colHidden = true;
  //     } else {
  //       colHidden = false;
  //     }
  //     let lineItemObj = {
  //       index: parseInt(fieldID),
  //       label: colTitle,
  //       active: colHidden,
  //       width: parseInt(colWidth),
  //       class: colthClass,
  //       display: true
  //     };
  //
  //     lineItems.push(lineItemObj);
  //   });
  //
  //   let templateObject = Template.instance();
  //   let reset_data = templateObject.reset_data.get();
  //   reset_data = reset_data.filter(redata => redata.display == false);
  //   lineItems.push(...reset_data);
  //   lineItems.sort((a,b) => a.index - b.index);
  //
  //   try {
  //     let erpGet = erpDb();
  //     let tableName = "tblBankingOverview";
  //     let employeeId = parseInt(localStorage.getItem('mySessionEmployeeLoggedID'))||0;
  //
  //     let added = await sideBarService.saveNewCustomFields(erpGet, tableName, employeeId, lineItems);
  //     $(".fullScreenSpin").css("display", "none");
  //     if(added) {
  //       sideBarService.getNewCustomFieldsWithQuery(parseInt(localStorage.getItem('mySessionEmployeeLoggedID')),'').then(function (dataCustomize) {
  //           addVS1Data('VS1_Customize', JSON.stringify(dataCustomize));
  //       });
  //         swal({
  //           title: 'SUCCESS',
  //           text: "Display settings is updated!",
  //           type: 'success',
  //           showCancelButton: false,
  //           confirmButtonText: 'OK'
  //         }).then((result) => {
  //             if (result.value) {
  //               $('#myModal2').modal('hide');
  //             }
  //         });
  //     } else {
  //       swal("Something went wrong!", "", "error");
  //     }
  //   } catch (error) {
  //     $(".fullScreenSpin").css("display", "none");
  //     swal("Something went wrong!", "", "error");
  //   }
  // },

  // custom field displaysettings
  // "click .resetTable": async function (event) {
  //     let templateObject = Template.instance();
  //       let reset_data = templateObject.reset_data.get();
  //       reset_data = reset_data.filter(redata => redata.display);
  //
  //       $(".customDisplaySettings").each(function (index) {
  //         let $tblrow = $(this);
  //         $tblrow.find(".divcolumn").text(reset_data[index].label);
  //         $tblrow
  //           .find(".custom-control-input")
  //           .prop("checked", reset_data[index].active);
  //
  //         let title = $("#tblQuoteLine").find("th").eq(index);
  //         if(reset_data[index].class === 'AmountEx' || reset_data[index].class === 'UnitPriceEx') {
  //           $(title).html(reset_data[index].label + `<i class="fas fa-random fa-trans"></i>`);
  //         } else if( reset_data[index].class === 'AmountInc' || reset_data[index].class === 'UnitPriceInc') {
  //           $(title).html(reset_data[index].label + `<i class="fas fa-random"></i>`);
  //         } else {
  //           $(title).html(reset_data[index].label);
  //         }
  //
  //
  //         if (reset_data[index].active) {
  //           $('.col' + reset_data[index].class).addClass('showColumn');
  //           $('.col' + reset_data[index].class).removeClass('hiddenColumn');
  //         } else {
  //           $('.col' + reset_data[index].class).addClass('hiddenColumn');
  //           $('.col' + reset_data[index].class).removeClass('showColumn');
  //         }
  //         $(".rngRange" + reset_data[index].class).val(reset_data[index].width);
  //       });
  //   },
  //   'change .custom-range': function(event) {
  //     let range = $(event.target).val();
  //     let colClassName = $(event.target).attr("valueclass");
  //     $('.col' + colClassName).css('width', range);
  //   },
    // 'click .custom-control-input': function(event) {
    //   let colClassName = $(event.target).attr("id");
    //   if ($(event.target).is(':checked')) {
    //     $('.col' + colClassName).addClass('showColumn');
    //     $('.col' + colClassName).removeClass('hiddenColumn');
    //   } else {
    //     $('.col' + colClassName).addClass('hiddenColumn');
    //     $('.col' + colClassName).removeClass('showColumn');
    //   }
    // },

    // 'blur .divcolumn': function(event) {
    //     let columData = $(event.target).text();

    //     let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

    //     var datable = $('#tblBankingOverview').DataTable();
    //     var title = datable.column(columnDatanIndex).header();
    //     $(title).html(columData);

    // },
    // 'change .rngRange': function(event) {
    //     let range = $(event.target).val();
    //     // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    //     // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    //     let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    //     var datable = $('#tblBankingOverview th');
    //     $.each(datable, function(i, v) {

    //         if (v.innerText === columnDataValue) {
    //             let className = v.className;
    //             let replaceClass = className.replace(/ /g, ".");
    //             $("." + replaceClass + "").css('width', range + 'px');

    //         }
    //     });

    // },
    // 'click .btnOpenSettings': function(event) {
    //     let templateObject = Template.instance();
    //     var columns = $('#tblBankingOverview th');
    //
    //     const tableHeaderList = [];
    //     let sTible = "";
    //     let sWidth = "";
    //     let sIndex = "";
    //     let sVisible = "";
    //     let columVisible = false;
    //     let sClass = "";
    //     $.each(columns, function(i, v) {
    //         if (v.hidden === false) {
    //             columVisible = true;
    //         }
    //         if ((v.className.includes("hiddenColumn"))) {
    //             columVisible = false;
    //         }
    //         sWidth = v.style.width.replace('px', "");
    //
    //         let datatablerecordObj = {
    //             sTitle: v.innerText || '',
    //             sWidth: sWidth || '',
    //             sIndex: v.cellIndex || 0,
    //             sVisible: columVisible || false,
    //             sClass: v.className || ''
    //         };
    //         tableHeaderList.push(datatablerecordObj);
    //     });
    //     templateObject.tableheaderrecords.set(tableHeaderList);
    // },
    'click .exportbtn': function() {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblBankingOverview_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .printConfirm': function(event) {
        playPrintAudio();
        setTimeout(function(){
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblBankingOverview_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    }, delayTimeAfterSound);
    },
    'click .openaccountpayable': function() {
        FlowRouter.go('/chequelist');
    },
    'click .opentrans': async function(event) {
        let bankAccountName = $(event.target).closest('.openaccountreceivable').attr('id');
        // FlowRouter.go('/accounttransactions?id=' + id);
        await clearData('TAccountRunningBalanceReport');
        FlowRouter.go("/balancetransactionlist?accountName=" +bankAccountName +"&isTabItem=" +false);
    },
    'click .btnPrinStatment': function() {
        FlowRouter.go('/statementlist');
    },
    'click .btnStockAdjustment': function() {
        FlowRouter.go('/chequelist');
    },
    'click .btnReconcile': function() {
        FlowRouter.go('/bankrecon');
        // FlowRouter.go('/bankrecon');
        // window.open('/newbankrecon', '_self');
    },
    'click .btnBankRecon': function() {
        FlowRouter.go('/newbankrecon');
    },
    'click .btnReconList': function() {
        FlowRouter.go('/reconciliationlist');
    },
    'click #btnReconRuleList': function() {
        FlowRouter.go('/reconrulelist');
    },
    'click #btnNewReconRule': function(event) {
        FlowRouter.go('/newreconrule');
    },
    'click #btnEFTBankRuleList': function() {
        FlowRouter.go('/eft');
    },
    'click #btnNewEFTBankRule': function(event) {
        FlowRouter.go('/newbankrule');
    },
});
Template.bankingoverview.helpers({
    // datatablerecords: () => {
    //     return Template.instance().datatablerecords.get().sort(function(a, b) {
    //         if (a.paymentdate === 'NA') {
    //             return 1;
    //         } else if (b.paymentdate === 'NA') {
    //             return -1;
    //         }
    //         return (a.paymentdate.toUpperCase() > b.paymentdate.toUpperCase()) ? 1 : -1;
    //     });
    // },

    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: localStorage.getItem('mycloudLogonID'), PrefName: 'tblBankingOverview' });
    },
    formname: () => {
        return chequeSpelling;
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },
    bankaccountdatarecord: () => {
        return Template.instance().bankaccountdatarecord.get();
    },
    // custom field displaysettings
    displayfields: () => {
      return Template.instance().displayfields.get();
    },

    datatablerecords : () => {
        return Template.instance().datatablerecords.get();
    },
    selectedInventoryAssetAccount: () => {
        return Template.instance().selectedInventoryAssetAccount.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },

    apiFunction:function() {
        let sideBarService = new SideBarService();
        return sideBarService.getAllBankAccountDetails;
    },

    searchAPI: function() {
        return sideBarService.searchAllBankAccountDetails;
    },

    service: ()=>{
        let sideBarService = new SideBarService();
        return sideBarService;

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

    apiParams: function() {
      return ['dateFrom', 'dateTo', 'ignoredate', 'limitCount', 'limitFrom', 'deleteFilter'];
    },
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
