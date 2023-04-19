// @ts-nocheck
import "../lib/global/indexdbstorage.js";
import LoadingOverlay from "../LoadingOverlay";
import GlobalFunctions from '../GlobalFunctions';
import { CoreService } from "../js/core-service";
import erpObject from "../lib/global/erp-objects";
import CachedHttp from "../lib/global/CachedHttp";
import { ReactiveVar } from "meteor/reactive-var";
import { UtilityService } from "../utility-service";
import TableHandler from "../js/Table/TableHandler";
import { SideBarService } from "../js/sidebar-service";
import { SalesBoardService } from "../js/sales-service";
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { InvoiceService } from "../invoice/invoice-service";

import { Template } from 'meteor/templating';
import './invoice_list.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.invoicelist.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.custfields = new ReactiveVar([]);
  templateObject.displayfields = new ReactiveVar([]);
  templateObject.reset_data = new ReactiveVar([]);
  templateObject.convertedStatus = new ReactiveVar();

  templateObject.getDataTableList = function(data){ //This function is used to get data
    //This is the only major job where you make sure your data are correct.
    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.TotalAmount)|| 0.00;
    let totalTax = utilityService.modifynegativeCurrencyFormat(data.TotalTax) || 0.00;
    // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.TotalAmountInc)|| 0.00;
    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.Payment)|| 0.00;
    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.Balance)|| 0.00;
    let salestatus = data.QuoteStatus || '';
    if(data.Deleted == true){
      salestatus = "Deleted";
    };
    // else if(data.CustomerName == ''){
    //   salestatus = "Deleted";
    // };
    let dataList = [
        // data.SaleDate !=''? moment(data.SaleDate).format("YYYY/MM/DD"): data.SaleDate,
        '<span style="display:none;">'+(data.SaleDate !=''? moment(data.SaleDate).format("YYYY/MM/DD"): data.SaleDate)+'</span>'+(data.SaleDate !=''? moment(data.SaleDate).format("DD/MM/YYYY"): data.SaleDate),
        data.SaleID || '',
        data.DueDate !=''? moment(data.DueDate).format("DD/MM/YYYY"): data.DueDate,
        data.CustomerName || '',
        totalAmountEx || 0.00,
        totalTax || 0.00,
        totalAmount || 0.00,
        totalPaid || 0.00,
        data.EmployeeName || '',
        data.Converted? 'Converted': 'Unconverted',
        data.Comments || '',
        // data.SaleCustField1 || '',
        // data.SaleCustField2 || '',
        // data.SaleCustField3 || '',
        salestatus || '',
    ];
    return dataList;
  }

  let headerStructure = [
  // { index: 0, label: 'Sort Date', class:'colSortDate', active: false, display: true, width: "20" },
  { index: 0, label: "Sale Date", class:"colSaleDate", active: true, display: true, width: "100" },
  { index: 1, label: "Sales No.", class:"colSalesNo", active: true, display: true, width: "74" },
  { index: 2, label: "Due Date", class:"colDueDate", active: true, display: true, width: "100" },
  { index: 3, label: "Customer", class:"colCustomer", active: true, display: true, width: "150" },
  { index: 4, label: "Amount (Ex)", class:"colAmountEx", active: true, display: true, width: "100" },
  { index: 5, label: "Tax", class:"colTax", active: true, display: true, width: "100" },
  { index: 6, label: "Amount (Inc)", class:"colAmount", active: true, display: true, width: "100" },
  { index: 7, label: "Paid", class:"colPaid", active: true, display: true, width: "100" },
  { index: 8, label: "Employee", class:"colEmployee", active: true, display: true, width: "100" },
   { index: 9, label:"Converted", class:"colConverted", active: true, display: true, width: "100" },
  { index: 10, label:"Comments", class:"colComments", active: true, display: true, width: "355" },
  // { index: 11, label: "Custom Field 1", class: "colCustomField1", active: false, display: true, width: "280" },
  // { index: 12, label: "Custom Field 2", class: "colCustomField2", active: false, display: true, width: "280" },
  // { index: 13, label: "Custom Field 3", class: "colCustomField3", active: false, display: true, width: "280" },
  { index: 11, label: "Status", class:"colStatus", active: true, display: true, width: "100" }
];
templateObject.tableheaderrecords.set(headerStructure);

});

Template.invoicelist.onRendered(function () {
  $(".fullScreenSpin").css("display", "inline-block");
  let templateObject = Template.instance();
  let custfield1_index = 0;
  let custfield2_index = 1;
  let custfield3_index = 2;




  if (FlowRouter.current().queryParams.success) {
    $(".btnRefresh").addClass("btnRefreshAlert");
  }

  var today = moment().format("DD/MM/YYYY");
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = currentDate.getMonth() + 1;
  let fromDateDay = currentDate.getDate();
  if (currentDate.getMonth() + 1 < 10) {
    fromDateMonth = "0" + (currentDate.getMonth() + 1);
  }

  if (currentDate.getDate() < 10) {
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate =
    fromDateDay + "/" + fromDateMonth + "/" + currentDate.getFullYear();

  $("#date-input,#dateTo,#dateFrom").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonImageOnly: true,
    buttonImage: "/img/imgCal2.png",
    dateFormat: "dd/mm/yy",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
    onChangeMonthYear: function (year, month, inst) {
      // Set date to picker
      $(this).datepicker(
        "setDate",
        new Date(year, inst.selectedMonth, inst.selectedDay)
      );
      // Hide (close) the picker
      // $(this).datepicker('hide');
      // // Change ttrigger the on change function
      // $(this).trigger('change');
    },
  });

  if (FlowRouter.current().queryParams.range == "month") {
    fromDate = moment().startOf("month").startOf("day").format("DD/MM/YYYY");
    begunDate = moment().endOf("month").endOf("day").format("DD/MM/YYYY");
  }

  if (FlowRouter.current().queryParams.range == "year") {
    fromDate = moment()
      .subtract(12, "months")
      .startOf("day")
      .format("DD/MM/YYYY");
    begunDate = moment().endOf("day").format("DD/MM/YYYY");
  }

  if (FlowRouter.current().queryParams.range == "lastMonth") {
    fromDate = moment()
      .subtract(1, "month")
      .startOf("day")
      .format("DD/MM/YYYY");
    begunDate = moment().endOf("day").format("DD/MM/YYYY");
  }

  $("#dateFrom").val(fromDate);
  $("#dateTo").val(begunDate);


  let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
  let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
  let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
  if (urlParametersDateFrom) {
    if (urlParametersIgnoreDate == true) {
      $("#dateFrom").attr("readonly", true);
      $("#dateTo").attr("readonly", true);
    } else {
      $("#dateFrom").val(
        urlParametersDateFrom != ""
          ? moment(urlParametersDateFrom).format("DD/MM/YYYY")
          : urlParametersDateFrom
      );
      $("#dateTo").val(
        urlParametersDateTo != ""
          ? moment(urlParametersDateTo).format("DD/MM/YYYY")
          : urlParametersDateTo
      );
    }
  }

  $('#tblInvoicelist tbody').on( 'click', 'tr', function () {
      var listData = $(this).closest('tr').find('.colSalesNo').text()
      var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
      if(listData){
        if(checkDeleted == "Deleted"){
          swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
        }else{
          FlowRouter.go('/invoicecard?id=' + listData);
        }
      }

  });

  templateObject.initPage = async (refresh = false) => {
    LoadingOverlay.show();
     await templateObject.loadCustomFields();
     templateObject.loadInvoices(refresh);

    LoadingOverlay.hide();
  }
  // templateObject.initPage();
});

Template.invoicelist.events({
  "click #btnNewInvoice": function (event) {
    FlowRouter.go("/invoicecard");
  },
  "keyup #tblInvoicelist_filter input": function (event) {
    if ($(event.target).val() != "") {
      $(".btnRefreshInvoiceList").addClass("btnSearchAlert");
    } else {
      $(".btnRefreshInvoiceList").removeClass("btnSearchAlert");
    }
    if (event.keyCode == 13) {
      $(".btnRefreshInvoiceList").trigger("click");
    }
  },
  "click .btnRefreshInvoiceList": function (event, ui) {
    ui.initPage(true);

    let templateObject = Template.instance();
    let utilityService = new UtilityService();
    let tableProductList;
    const dataTableList = [];
    var splashArrayInvoiceList = new Array();
    const lineExtaSellItems = [];
    $(".fullScreenSpin").css("display", "inline-block");
    let dataSearchName = $("#tblInvoicelist_filter input").val();
    if (dataSearchName.replace(/\s/g, "") != "") {
      sideBarService
        .getNewInvoiceByNameOrID(dataSearchName)
        .then(function (data) {
          $(".btnRefreshInvoiceList").removeClass("btnSearchAlert");
          let lineItems = [];
          let lineItemObj = {};
          if (data.tinvoiceex.length > 0) {
            for (let i = 0; i < data.tinvoiceex.length; i++) {
              let totalAmountEx =
                utilityService.modifynegativeCurrencyFormat(
                  data.tinvoiceex[i].fields.TotalAmount
                ) || 0.0;
              let totalTax =
                utilityService.modifynegativeCurrencyFormat(
                  data.tinvoiceex[i].fields.TotalTax
                ) || 0.0;
              // Currency+''+data.tinvoiceex[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
              let totalAmount =
                utilityService.modifynegativeCurrencyFormat(
                  data.tinvoiceex[i].fields.TotalAmountInc
                ) || 0.0;
              let totalPaid =
                utilityService.modifynegativeCurrencyFormat(
                  data.tinvoiceex[i].fields.TotalPaid
                ) || 0.0;
              let totalOutstanding =
                utilityService.modifynegativeCurrencyFormat(
                  data.tinvoiceex[i].fields.TotalBalance
                ) || 0.0;
              let salestatus = data.tinvoiceex[i].fields.SalesStatus || "";
              if (data.tinvoiceex[i].fields.Deleted == true) {
                salestatus = "Deleted";
              } else if (data.tinvoiceex[i].fields.CustomerName == "") {
                salestatus = "Deleted";
              }

              var dataList = {
                id: data.tinvoiceex[i].fields.ID || "",
                apptid: data.tinvoicelist[i].fields.AppointID || 0,
                employee: data.tinvoiceex[i].fields.EmployeeName || "",
                sortdate:
                  data.tinvoiceex[i].fields.SaleDate != ""
                    ? moment(data.tinvoiceex[i].fields.SaleDate).format(
                        "YYYY/MM/DD"
                      )
                    : data.tinvoiceex[i].fields.SaleDate,
                saledate:
                  data.tinvoiceex[i].fields.SaleDate != ""
                    ? moment(data.tinvoiceex[i].fields.SaleDate).format(
                        "DD/MM/YYYY"
                      )
                    : data.tinvoiceex[i].fields.SaleDate,
                duedate:
                  data.tinvoiceex[i].fields.DueDate != ""
                    ? moment(data.tinvoiceex[i].fields.DueDate).format(
                        "DD/MM/YYYY"
                      )
                    : data.tinvoiceex[i].fields.DueDate,
                customername: data.tinvoiceex[i].fields.CustomerName || "",
                totalamountex: totalAmountEx || 0.0,
                totaltax: totalTax || 0.0,
                totalamount: totalAmount || 0.0,
                totalpaid: totalPaid || 0.0,
                totaloustanding: totalOutstanding || 0.0,
                salestatus: salestatus || "",
                ponumber: data.tinvoicelist[i].PONumber || "",
                referenceno: data.tinvoicelist[i].ReferenceNo || "",
                custfield1: data.tinvoiceex[i].fields.SaleCustField1 || "",
                custfield2: data.tinvoiceex[i].fields.SaleCustField2 || "",
                custfield3: data.tinvoiceex[i].fields.SaleCustField3 || "",
                comments: data.tinvoiceex[i].fields.Comments || "",
                // shipdate:data.tinvoiceex[i].fields.ShipDate !=''? moment(data.tinvoiceex[i].fields.ShipDate).format("DD/MM/YYYY"): data.tinvoiceex[i].fields.ShipDate,
              };

              //if(data.tinvoiceex[i].fields.Deleted == false){
              //splashArrayInvoiceList.push(dataList);
              dataTableList.push(dataList);
              //}

              //}
            }
            templateObject.datatablerecords.set(dataTableList);

            let item = templateObject.datatablerecords.get();
            $(".fullScreenSpin").css("display", "none");
            if (dataTableList) {
              var datatable = $("#tblInvoicelist").DataTable();
              $("#tblInvoicelist > tbody").empty();
              for (let x = 0; x < item.length; x++) {
                $("#tblInvoicelist > tbody").append(
                  ' <tr class="dnd-moved" id="' +
                    item[x].id +
                    '" style="cursor: pointer;">' +
                    '<td contenteditable="false" class="colSortDate hiddenColumn">' +
                    item[x].sortdate +
                    "</td>" +
                    '<td contenteditable="false" class="colSaleDate" ><span style="display:none;">' +
                    item[x].sortdate +
                    "</span>" +
                    item[x].saledate +
                    "</td>" +
                    '<td contenteditable="false" class="colSalesNo">' +
                    item[x].id +
                    "</td>" +
                    '<td contenteditable="false" class="colDueDate" >' +
                    item[x].duedate +
                    "</td>" +
                    '<td contenteditable="false" class="colCustomer">' +
                    item[x].customername +
                    "</td>" +
                    '<td contenteditable="false" class="colAmountEx" style="text-align: right!important;">' +
                    item[x].totalamountex +
                    "</td>" +
                    '<td contenteditable="false" class="colTax" style="text-align: right!important;">' +
                    item[x].totaltax +
                    "</td>" +
                    '<td contenteditable="false" class="colAmount" style="text-align: right!important;">' +
                    item[x].totalamount +
                    "</td>" +
                    '<td contenteditable="false" class="colPaid" style="text-align: right!important;">' +
                    item[x].totalpaid +
                    "</td>" +
                    '<td contenteditable="false" class="colBalanceOutstanding" style="text-align: right!important;">' +
                    item[x].totaloustanding +
                    "</td>" +
                    '<td contenteditable="false" class="colStatus">' +
                    item[x].salestatus +
                    "</td>" +
                    '<td contenteditable="false" class="colPONumber">' +
                    item[x].ponumber +
                    "</td>" +
                    '<td contenteditable="false" class="colReference">' +
                    item[x].referenceno +
                    "</td>" +
                    '<td contenteditable="false" class="colSaleCustField1 customFieldColumn hiddenColumn">' +
                    item[x].custfield1 +
                    "</td>" +
                    '<td contenteditable="false" class="colSaleCustField2 customFieldColumn hiddenColumn">' +
                    item[x].custfield2 +
                    "</td>" +
                    '<td contenteditable="false" class="colSaleCustField3 customFieldColumn hiddenColumn">' +
                    item[x].custfield3 +
                    "</td>" +
                    '<td contenteditable="false" class="colEmployee hiddenColumn">' +
                    item[x].employee +
                    "</td>" +
                    '<td contenteditable="false" class="colComments">' +
                    item[x].comments +
                    "</td>" +
                    "</tr>"
                );
              }
              $(".dataTables_info").html(
                "Showing 1 to " +
                  data.tinvoiceex.length +
                  " of " +
                  data.tinvoiceex.length +
                  " entries"
              );
              setTimeout(function () {
                makeNegativeGlobal();
              }, 100);
            }
          } else {
            $(".fullScreenSpin").css("display", "none");

            swal({
              title: "Question",
              text: "Invoice does not exist, would you like to create it?",
              type: "question",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "No",
            }).then((result) => {
              if (result.value) {
                FlowRouter.go("/invoicecard");
              } else if (result.dismiss === "cancel") {
                //$('#productListModal').modal('toggle');
              }
            });
          }
        })
        .catch(function (err) {
          $(".fullScreenSpin").css("display", "none");
        });
    } else {
      $(".btnRefresh").trigger("click");
    }
  },
  "click #btnInvoiceBOList": function (event) {
    FlowRouter.go("/invoicelistBO");
  },


  // 'click .chkSaleDate': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colSaleDate').addClass('showColumn');
  //     $('.colSaleDate').removeClass('hiddenColumn');
  //   } else {
  //     $('.colSaleDate').addClass('hiddenColumn');
  //     $('.colSaleDate').removeClass('showColumn');
  //   }
  // },
  // 'click .chkSalesNo': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colSalesNo').addClass('showColumn');
  //     $('.colSalesNo').removeClass('hiddenColumn');
  //   } else {
  //     $('.colSalesNo').addClass('hiddenColumn');
  //     $('.colSalesNo').removeClass('showColumn');
  //   }
  // },
  // 'click .chkDueDate': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colDueDate').addClass('showColumn');
  //     $('.colDueDate').removeClass('hiddenColumn');
  //   } else {
  //     $('.colDueDate').addClass('hiddenColumn');
  //     $('.colDueDate').removeClass('showColumn');
  //   }
  // },
  // 'click .chkCustomer': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colCustomer').addClass('showColumn');
  //     $('.colCustomer').removeClass('hiddenColumn');
  //   } else {
  //     $('.colCustomer').addClass('hiddenColumn');
  //     $('.colCustomer').removeClass('showColumn');
  //   }
  // },
  // 'click .chkAmountEx': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colAmountEx').addClass('showColumn');
  //     $('.colAmountEx').removeClass('hiddenColumn');
  //   } else {
  //     $('.colAmountEx').addClass('hiddenColumn');
  //     $('.colAmountEx').removeClass('showColumn');
  //   }
  // },
  // 'click .chkTax': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colTax').addClass('showColumn');
  //     $('.colTax').removeClass('hiddenColumn');
  //   } else {
  //     $('.colTax').addClass('hiddenColumn');
  //     $('.colTax').removeClass('showColumn');
  //   }
  // },
  // // displaysettings
  // 'click .chkAmount': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colAmount').addClass('showColumn');
  //     $('.colAmount').removeClass('hiddenColumn');
  //   } else {
  //     $('.colAmount').addClass('hiddenColumn');
  //     $('.colAmount').removeClass('showColumn');
  //   }
  // },
  // 'click .chkPaid': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colPaid').addClass('showColumn');
  //     $('.colPaid').removeClass('hiddenColumn');
  //   } else {
  //     $('.colPaid').addClass('hiddenColumn');
  //     $('.colPaid').removeClass('showColumn');
  //   }
  // },

  // 'click .chkBalanceOutstanding': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colBalanceOutstanding').addClass('showColumn');
  //     $('.colBalanceOutstanding').removeClass('hiddenColumn');
  //   } else {
  //       $('.colBalanceOutstanding').addClass('hiddenColumn');
  //       $('.colBalanceOutstanding').removeClass('showColumn');
  //   }
  // },
  // 'click .chkStatus': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colStatus').addClass('showColumn');
  //     $('.colStatus').removeClass('hiddenColumn');
  //   } else {
  //     $('.colStatus').addClass('hiddenColumn');
  //     $('.colStatus').removeClass('showColumn');
  //   }
  // },
  // 'click .chkEmployee': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colEmployee').addClass('showColumn');
  //     $('.colEmployee').removeClass('hiddenColumn');
  //   } else {
  //     $('.colEmployee').addClass('hiddenColumn');
  //     $('.colEmployee').removeClass('showColumn');
  //   }
  // },
  // 'click .chkComments': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colComments').addClass('showColumn');
  //     $('.colComments').removeClass('hiddenColumn');
  //   } else {
  //     $('.colComments').addClass('hiddenColumn');
  //     $('.colComments').removeClass('showColumn');
  //   }
  // },
  // 'click .chkPONumber': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colPONumber').addClass('showColumn');
  //     $('.colPONumber').removeClass('hiddenColumn');
  //   } else {
  //     $('.colPONumber').addClass('hiddenColumn');
  //     $('.colPONumber').removeClass('showColumn');
  //   }
  // },
  // 'click .chkReference': function(event) {
  //   if ($(event.target).is(':checked')) {
  //     $('.colReference').addClass('showColumn');
  //     $('.colReference').removeClass('hiddenColumn');
  //   } else {
  //     $('.colReference').addClass('hiddenColumn');
  //     $('.colReference').removeClass('showColumn');
  //   }
  // },
  // // display settings


  // 'change .rngRangeSaleDate': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthSaleDate").html(range);
  //     $('.colSaleDate').css('width', range);
  // },
  // 'change .rngRangeSalesNo': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthSalesNo").html(range);
  //     $('.colSalesNo').css('width', range);
  // },
  // 'change .rngRangeDueDate': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthDueDate").html(range);
  //     $('.colDueDate').css('width', range);
  // },
  // 'change .rngRangeUnitPriceInc': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthUnitPrice").html(range);
  //     $('.colUnitPriceInc').css('width', range);
  // },
  // 'change .rngRangeUnitPriceEx': function(event) {
  //     let range = $(event.target).val();
  //     $('.colUnitPriceEx').css('width', range);
  // },
  // 'change .rngRangeTax': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthTax").html(range);
  //     $('.colTax').css('width', range);
  // },
  // 'change .rngRangeAmountInc': function (event) {
  //     let range = $(event.target).val();
  //     //$(".spWidthAmount").html(range);
  //     $('.colAmountInc').css('width', range);
  // },
  // 'change .rngRangeAmountEx': function (event) {
  //     let range = $(event.target).val();
  //     //$(".spWidthAmount").html(range);
  //     $('.colAmountEx').css('width', range);
  // },
  // 'change .rngRangePaid': function (event) {
  //     let range = $(event.target).val();
  //     //$(".spWidthAmount").html(range);
  //     $('.colPaid').css('width', range);
  // },
  // 'change .rngRangeBalanceOutstanding': function (event) {
  //     let range = $(event.target).val();
  //     $('.colBalanceOutstanding').css('width', range);
  // },
  // 'change .rngRangeStatus': function (event) {
  //     let range = $(event.target).val();
  //     $('.colStatus').css('width', range);
  // },
  // 'change .rngRangeAmount': function (event) {
  //     let range = $(event.target).val();
  //     $('.colAmount').css('width', range);
  // },
  // 'change .rngRangeCustomer': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthCustomer").html(range);
  //     $('.colCustomer').css('width', range);
  // },
  // 'change .rngRangeEmployee': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthEmployee").html(range);
  //     $('.colEmployee').css('width', range);
  // },
  // 'change .rngRangeComments': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthComments").html(range);
  //     $('.colComments').css('width', range);
  // },
  // 'change .rngRangePONumber': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthPONumber").html(range);
  //     $('.colPONumber').css('width', range);
  // },
  // 'change .rngRangeReference': function(event) {
  //     let range = $(event.target).val();
  //     $(".spWidthReference").html(range);
  //     $('.colReference').css('width', range);
  // },
  "blur .divcolumn": function (event) {
    let columData = $(event.target).html();
    let columHeaderUpdate = $(event.target).attr("valueupdate");
    $("th.col" + columHeaderUpdate + "").html(columData);
  },

  "change .rngRange": function (event) {
    let range = $(event.target).val();
    $(event.target)
      .closest("div.divColWidth")
      .find(".spWidth")
      .html(range + "px");

    let columData = $(event.target)
      .closest("div.divColWidth")
      .find(".spWidth")
      .attr("value");
    let columnDataValue = $(event.target)
      .closest("div")
      .prev()
      .find(".divcolumn")
      .text();
    var datable = $("#tblInvoicelist th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  // "click .btnOpenSettings": function (event) {
  //   let templateObject = Template.instance();
  //   var columns = $("#tblInvoicelist th");

  //   const tableHeaderList = [];
  //   let sTible = "";
  //   let sWidth = "";
  //   let sIndex = "";
  //   let sVisible = "";
  //   let columVisible = false;
  //   let sClass = "";
  //   let isCustomField = false;
  //   $.each(columns, function (i, v) {
  //     if (v.hidden == false) {
  //       columVisible = true;
  //     }
  //     if (v.className.includes("hiddenColumn")) {
  //       columVisible = false;
  //     }
  //     sWidth = v.style.width.replace("px", "");

  //     if (v.className.includes("customFieldColumn")) {
  //       isCustomField = true;
  //     } else {
  //       isCustomField = false;
  //     }

  //     let datatablerecordObj = {
  //       custid: $(this).attr("custid") || 0,
  //       sTitle: v.innerText || "",
  //       sWidth: sWidth || "",
  //       sIndex: v.cellIndex || "",
  //       sVisible: columVisible || false,
  //       sCustomField: isCustomField || false,
  //       sClass: v.className || "",
  //     };
  //     tableHeaderList.push(datatablerecordObj);
  //   });
  //   templateObject.tableheaderrecords.set(tableHeaderList);
  // },
  "click #exportbtn": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblInvoicelist_wrapper .dt-buttons .btntabletocsv").click();
    $(".fullScreenSpin").css("display", "none");
  },
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let currentDate = new Date();
    let hours = currentDate.getHours(); //returns 0-23
    let minutes = currentDate.getMinutes(); //returns 0-59
    let seconds = currentDate.getSeconds(); //returns 0-59
    let month = currentDate.getMonth() + 1;
    let days = currentDate.getDate();

    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDate =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    let prevMonth11Date = moment().subtract(reportsloadMonths, "months").format("YYYY-MM-DD");


    sideBarService.getSalesListData(prevMonth11Date, toDate, true, initialReportLoad, 0).then(function (dataSales) {
        addVS1Data("TSalesList", JSON.stringify(dataSales)).then(function (datareturn) {}).catch(function (err) {});
      }).catch(function (err) {});


      sideBarService.getTPaymentList(prevMonth11Date,toDate,true,initialReportLoad,0,"").then(function (dataPaymentList) {
         addVS1Data("TPaymentList",JSON.stringify(dataPaymentList)).then(function (datareturn) {
            }).catch(function (err) {

            });
        }).catch(function (err) {

        });

    sideBarService.getAllTInvoiceListData(prevMonth11Date,toDate,true,initialReportLoad,0).then(function (dataInvoice) {
        addVS1Data("TInvoiceList", JSON.stringify(dataInvoice)).then(function (datareturn) {
              sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function (dataInvoice) {
                   addVS1Data("TInvoiceEx", JSON.stringify(dataInvoice)).then(function (datareturn) {
                     window.open("/invoicelist", "_self");
                   }).catch(function (err) {
                     window.open("/invoicelist", "_self");
                   });
                }).catch(function (err) {
                  window.open("/invoicelist", "_self");
                });
          }).catch(function (err) {
            window.open("/invoicelist", "_self");
          });
      }).catch(function (err) {
        window.open("/invoicelist", "_self");
      });
  },
  "change #dateTo": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    setTimeout(function () {
      var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
      var dateTo = new Date($("#dateTo").datepicker("getDate"));

      let formatDateFrom =
        dateFrom.getFullYear() +
        "-" +
        (dateFrom.getMonth() + 1) +
        "-" +
        dateFrom.getDate();
      let formatDateTo =
        dateTo.getFullYear() +
        "-" +
        (dateTo.getMonth() + 1) +
        "-" +
        dateTo.getDate();

      //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
      var formatDate =
        dateTo.getDate() +
        "/" +
        (dateTo.getMonth() + 1) +
        "/" +
        dateTo.getFullYear();
      //templateObject.dateAsAt.set(formatDate);
      if (
        $("#dateFrom").val().replace(/\s/g, "") == "" &&
        $("#dateFrom").val().replace(/\s/g, "") == ""
      ) {
      } else {
        templateObject.getAllFilterInvoiceData(
          formatDateFrom,
          formatDateTo,
          false
        );
      }
    }, 500);
  },
  "change #dateFrom": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    setTimeout(function () {
      var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
      var dateTo = new Date($("#dateTo").datepicker("getDate"));

      let formatDateFrom =
        dateFrom.getFullYear() +
        "-" +
        (dateFrom.getMonth() + 1) +
        "-" +
        dateFrom.getDate();
      let formatDateTo =
        dateTo.getFullYear() +
        "-" +
        (dateTo.getMonth() + 1) +
        "-" +
        dateTo.getDate();

      //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
      var formatDate =
        dateTo.getDate() +
        "/" +
        (dateTo.getMonth() + 1) +
        "/" +
        dateTo.getFullYear();
      //templateObject.dateAsAt.set(formatDate);
      if (
        $("#dateFrom").val().replace(/\s/g, "") == "" &&
        $("#dateFrom").val().replace(/\s/g, "") == ""
      ) {
      } else {
        templateObject.getAllFilterInvoiceData(
          formatDateFrom,
          formatDateTo,
          false
        );
      }
    }, 500);
  },
  "click #today": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    var toDateERPTo =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();
    var toDateDisplayTo =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterInvoiceData(toDateERPFrom, toDateERPTo, false);
  },
  "click #lastweek": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom =
      currentBeginDate.getFullYear() +
      "-" +
      fromDateMonth +
      "-" +
      (fromDateDay - 7);
    var toDateERPTo =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom =
      fromDateDay -
      7 +
      "/" +
      fromDateMonth +
      "/" +
      currentBeginDate.getFullYear();
    var toDateDisplayTo =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterInvoiceData(toDateERPFrom, toDateERPTo, false);
  },
  "click #lastMonth": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();

    var prevMonthLastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    var prevMonthFirstDate = new Date(
      currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1),
      (currentDate.getMonth() - 1 + 12) % 12,
      1
    );

    var formatDateComponent = function (dateComponent) {
      return (dateComponent < 10 ? "0" : "") + dateComponent;
    };

    var formatDate = function (date) {
      return (
        formatDateComponent(date.getDate()) +
        "/" +
        formatDateComponent(date.getMonth() + 1) +
        "/" +
        date.getFullYear()
      );
    };

    var formatDateERP = function (date) {
      return (
        date.getFullYear() +
        "-" +
        formatDateComponent(date.getMonth() + 1) +
        "-" +
        formatDateComponent(date.getDate())
      );
    };

    var fromDate = formatDate(prevMonthFirstDate);
    var toDate = formatDate(prevMonthLastDate);

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(toDate);

    var getLoadDate = formatDateERP(prevMonthLastDate);
    let getDateFrom = formatDateERP(prevMonthFirstDate);
    templateObject.getAllFilterInvoiceData(getDateFrom, getLoadDate, false);
  },
  "click #lastQuarter": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    function getQuarter(d) {
      d = d || new Date();
      var m = Math.floor(d.getMonth() / 3) + 2;
      return m > 4 ? m - 4 : m;
    }

    var quarterAdjustment = (moment().month() % 3) + 1;
    var lastQuarterEndDate = moment()
      .subtract({
        months: quarterAdjustment,
      })
      .endOf("month");
    var lastQuarterStartDate = lastQuarterEndDate
      .clone()
      .subtract({
        months: 2,
      })
      .startOf("month");

    var lastQuarterStartDateFormat =
      moment(lastQuarterStartDate).format("DD/MM/YYYY");
    var lastQuarterEndDateFormat =
      moment(lastQuarterEndDate).format("DD/MM/YYYY");

    $("#dateFrom").val(lastQuarterStartDateFormat);
    $("#dateTo").val(lastQuarterEndDateFormat);

    let fromDateMonth = getQuarter(currentDate);
    var quarterMonth = getQuarter(currentDate);
    let fromDateDay = currentDate.getDate();

    var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
    let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
    templateObject.getAllFilterInvoiceData(getDateFrom, getLoadDate, false);
  },
  "click #last12Months": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if (currentDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }
    if (currentDate.getDate() < 10) {
      fromDateDay = "0" + currentDate.getDate();
    }

    var fromDate =
      fromDateDay +
      "/" +
      fromDateMonth +
      "/" +
      Math.floor(currentDate.getFullYear() - 1);
    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    var currentDate2 = new Date();
    if (currentDate2.getMonth() + 1 < 10) {
      fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
    }
    if (currentDate2.getDate() < 10) {
      fromDateDay2 = "0" + currentDate2.getDate();
    }
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom =
      Math.floor(currentDate2.getFullYear() - 1) +
      "-" +
      fromDateMonth2 +
      "-" +
      currentDate2.getDate();
    templateObject.getAllFilterInvoiceData(getDateFrom, getLoadDate, false);
  },
  "click #ignoreDate": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.getAllFilterInvoiceData("", "", true);
  },
  "click .printConfirm": function (event) {
    playPrintAudio();
    setTimeout(function(){
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblInvoicelist_wrapper .dt-buttons .btntabletopdf").click();
    $(".fullScreenSpin").css("display", "none");
  }, delayTimeAfterSound);
  },
});

Template.invoicelist.helpers({
  datatablerecords : () => {
      return Template.instance().datatablerecords.get();
  },
  tableheaderrecords: () => {
      return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
      return CloudPreference.findOne({userid:localStorage.getItem('mycloudLogonID'),PrefName:'tblInvoicelist'});
  },
  // custom fields displaysettings
  custfields: () => {
    return Template.instance().custfields.get();
  },

  // custom fields displaysettings
  displayfields: () => {
    return Template.instance().displayfields.get();
  },

  convertedStatus: () => {
    return Template.instance().convertedStatus.get()
  },

  apiFunction:function() { // do not use arrow function
    return sideBarService.getAllTInvoiceListData //This is to pass API data to template
  },

  searchAPI: function() {
    return sideBarService.getNewInvoiceByNameOrID //This is to Pass search data
  },

  apiParams: function() {
    return ['dateFrom', 'dateTo', 'ignoredate', 'limitCount', 'limitFrom', 'deleteFilter'];
  },

  service: ()=>{
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
      let dataReturn = templateObject.getExData(data);
      return dataReturn
    }
  }
});
