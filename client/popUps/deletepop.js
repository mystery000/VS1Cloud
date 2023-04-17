import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './deletepop.html';
import { InvoiceService } from "../invoice/invoice-service";
import { SalesBoardService } from "../js/sales-service";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { SideBarService } from "../js/sidebar-service";
import { PaymentsService } from "../payments/payments-service";
import { StockTransferService } from "../inventory/stockadjust-service";
import { PurchaseBoardService } from "../js/purchase-service";

let invoiceService = new InvoiceService();
const sideBarService = new SideBarService();
let isRendered = false;

const TransactionTypeTemplates = {
  sales: 
    {
      item1: "Sales Order",
      item2: "sales order",
      item3: "Sales Order",
      button1: 'btnDeleteSO',
      button2: 'btnDeleteFollowingSOs'
    },
  bills: 
    {
      item1: "Bill",
      item2: "bill",
      item3: "Bill",
      button1: 'btnDeleteBill',
      button2 : 'btnDeleteFollowingBills'
    },
  cheques: 
    {
      item1: "Cheque",
      item2: "cheque",
      item3: "Cheque",
      button1: 'btnDeleteCheque',
      button2: 'btnDeleteFollowingCheques'
    },
  deposit: 
    {
      item1: "Deposit",
      item2: "deposit",
      item3: "Deposit",
      button1: 'btnDeleteDeposit',
      button2: 'btnDeleteFollowingDeposits'
    },
  credits: 
    {
      item1: "Credit",
      item2: "credit",
      item3: "Credit",
      button1: 'btnDeleteCredit',
      button2: 'btnDeleteFollowingCredits'
    },
  invoices: 
    {
      item1: "Invoice",
      item2: "invoice",
      item3: "Invoices",
      button1: 'btnDeleteInvoice',
      button2: 'btnDeleteFollowingInvoices'
    },
  refunds:
    {
      item1: "Refund",
      item2: "refund",
      item3: "Refund",
      button1: 'btnDeleteRefund',
      button2: 'btnDeleteFollowingRefunds'
    },
  workorders:
    {
      item1: 'Work Order',
      item2: 'wokr order',
      item3: 'Work Order',
      button1: 'btnDeleteWO',
      button2: 'btnDeleteFollowingWOs'
    },
  supplierpayments:
    {
      item1: "Supplier Payments",
      item2: "supplier payment",
      item3: "Supplier Payment",
      button1: 'btnDeletePayment',
      button2: 'btnDeleteFollowingPayments',
    },
  purchaseorders:
    {
      item1: "Purchase Orders",
      item2: "purchase order",
      item3: "Purchase Order",
      button1: "btnDeletePO",
      button2: "btnDeleteFollowingPOs"
    },
  quotes:
    {
      item1: "Quote",
      item2: "quote",
      item3: "Quote",
      button1: 'btnDeleteQuote',
      button2: 'btnDeleteFollowingQuotes'
    },
  stockadjustment: {
    item1: 'Stock Adj',
    item2: 'stock adjustment',
    item3: 'Stock Adjustment',
    button1: 'btnDeleteStock',
    button2: 'btnDeleteFollowingStocks'
  },
  stocktransfer: {
    item1: 'Transfer',
    item2: 'stock transfer',
    item3: 'Stock Transfer',
    button1: 'btnDeleteStock',
    button2: 'btnDeleteFollowingStocks'
  },
  customer_payment: {
    item1: 'Payment',
    item2: 'payment',
    item3: 'Payment',
    button1: 'btnDeletePayment',
    button2: 'btnDeleteFollowingPayments'
  }
};

Template.deletepop.onCreated(() => {

})

Template.deletepop.onRendered(function () {
  hasFollowings();
})

Template.deletepop.helpers({
  // itemName1: () => {
  //   const templateInstance = Template.instance();
  //   const formName = TransactionTypeTemplates[templateInstance.data.formType]?.item1;
  //   console.log('formName:',formName)
  //   return formName;
  // },
  // itemName2: () => {
  //   const templateInstance = Template.instance();
  //   const formName = TransactionTypeTemplates[templateInstance.data.formType]?.item2;

  //   return formName;
  // },
  // itemName3: () => {
  //   const templateInstance = Template.instance();
  //   const formName = TransactionTypeTemplates[templateInstance.data.formType]?.item3;

  //   return formName;
  // },
  // button1: () => {
  //   const templateInstance = Template.instance();
  //   const formName = TransactionTypeTemplates[templateInstance.data.formType]?.button1;

  //   return formName;
  // },
  // button2: () => {
  //   const templateInstance = Template.instance();
  //   const formName = TransactionTypeTemplates[templateInstance.data.formType]?.button2;
  //   return formName;
  // }

})

const hasFollowings = async function() {
  if (isRendered) {
    return;
  }
  isRendered = true;
  const templateInstance = Template.instance();
  let salesService = new SalesBoardService();
  let paymentService = new PaymentsService();
  let stockTransferService = new StockTransferService();
  let purchaseService = new PurchaseBoardService();
  var url = FlowRouter.current().path;
  var getso_id = url.split('?id=');
  var currentInvoice = getso_id[getso_id.length - 1];
  const currentDate = new Date();
  if('invoices' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var invData = await salesService.getOneInvoicedataEx(currentInvoice);
      var creationDate = invData.fields.CreationDate;
      var fromDate = creationDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingInvoices = await sideBarService.getAllTInvoiceListData(
        fromDate,
        toDate,
        false,
        initialReportLoad,
        0
      );
      var invList = followingInvoices.tinvoicelist;
      $("#following_cnt").val(invList.length);
      if (invList.length > 0) {
        $("#btn_follow1").css("display", "inline-block");
        $("#btn_follow2").css("display", "inline-block");
      } else {
        $("#btn_follow1").css("display", "none");
        $("#btn_follow2").css("display", "none");
      }
    }
  }
  if('customer_payment' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var paymentData = await paymentService.getOneCustomerPayment(currentInvoice);
      var paymentDate = paymentData.fields.PaymentDate;
      var fromDate = paymentDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingPayments = await sideBarService.getAllTCustomerPaymentListData(
          fromDate,
          toDate,
          false,
          initialReportLoad,
          0
      );
      var paymentList = followingPayments.tcustomerpaymentlist;
      $("#following_cnt").val(paymentList.length);
      if (paymentList.length > 0) {
        $("#btn_follow1").css("display", "inline-block");
        $("#btn_follow2").css("display", "inline-block");
      } else {
        $("#btn_follow1").css("display", "none");
        $("#btn_follow2").css("display", "none");
      }
    }
  }
  if('stockadjustment' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var stockData = await stockTransferService.getOneStockAdjustData(currentInvoice);
      var adjustmentDate = stockData.fields.AdjustmentDate;
      var fromDate = adjustmentDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingStocks = await sideBarService.getAllStockAdjustEntry("All", stockData.fields.Recno);//initialDataLoad
      var stockList = followingStocks.tstockadjustentry;
      $("#following_cnt").val(stockList.length);
      if (stockList.length > 0) {
        $("#btn_follow1").css("display", "inline-block");
        $("#btn_follow2").css("display", "inline-block");
      } else {
        $("#btn_follow1").css("display", "none");
        $("#btn_follow2").css("display", "none");
      }
    }
  }
  if('cheques' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var chequeData = await purchaseService.getOneChequeDataEx(currentInvoice);
      var orderDate = chequeData.fields.OrderDate;
      var fromDate = orderDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingCheques = await sideBarService.getAllChequeListData(
        fromDate,
        toDate,
        false,
        initialReportLoad,
        0
      );
      var chequeList = followingCheques.tchequelist;
      $("#following_cnt").val(chequeList.length);
      if (chequeList.length > 0) {
        $("#btn_follow1").css("display", "inline-block");
        $("#btn_follow2").css("display", "inline-block");
      } else {
        $("#btn_follow1").css("display", "none");
        $("#btn_follow2").css("display", "none");
      }
    }
  }
  if('deposit' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var depositEntryData = await purchaseService.getOneDepositEnrtyData(currentInvoice);
      var depositDate = depositEntryData.fields.DepositDate;
      var fromDate = depositDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingDeposits = await sideBarService.getAllTBankDepositListData(
          fromDate,
          toDate,
          false,
          initialReportLoad,
          0
      );
      var depositList = followingDeposits.tbankdepositlist;
      $("#following_cnt").val(depositList.length);
      if (depositList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }
  if('bills' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var billData = await purchaseService.getOneBilldataEx(currentInvoice);
      var orderDate = billData.fields.OrderDate;
      var fromDate = orderDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingBills = await sideBarService.getAllBillListData(
          fromDate,
          toDate,
          false,
          initialReportLoad,
          0
      );
      var billList = followingBills.tbilllist;
      $("#following_cnt").val(billList.length);
      if (billList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }
  if('credits' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var creditData = await purchaseService.getOneCreditData(
        currentInvoice
      );
      var orderDate = creditData.fields.OrderDate;
      var fromDate = orderDate.substring(0, 10);
      var toDate =
        currentDate.getFullYear() +
        "-" +
        ("0" + (currentDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + currentDate.getDate()).slice(-2);
      var followingCredits = await sideBarService.getTCreditListData(
        fromDate,
        toDate,
        false,
        initialReportLoad,
        0
      );
      var creditList = followingCredits.tcreditlist;
      $("#following_cnt").val(creditList.length);
      if (creditList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }
  if('purchaseorders' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var poData = await purchaseService.getOnePurchaseOrderdataEx(currentInvoice);
      var orderDate = poData.fields.OrderDate;
      var fromDate = orderDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingPOs = await sideBarService.getAllTPurchaseOrderListData(
          fromDate,
          toDate,
          false,
          initialReportLoad,
          0
      );
      var poList = followingPOs.tpurchaseorderlist;
      $("#following_cnt").val(poList.length);
      if (poList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }
  if('quotes' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var quoteData = await salesService.getOneQuotedataEx(currentInvoice);
      var creationDate = quoteData.fields.CreationDate;
      var fromDate = creationDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingQuotes = await sideBarService.getAllTQuoteListData(
          fromDate,
          toDate,
          false,
          initialReportLoad,
          0
      );
      var quoteList = followingQuotes.tquotelist;
      $("#following_cnt").val(quoteList.length);
      if (quoteList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }
  if('sales' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var soData = await salesService.getOneSalesOrderdataEx(currentInvoice);
      var creationDate = soData.fields.CreationDate;
      var fromDate = creationDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingSOs = await sideBarService.getAllTSalesOrderListData(
        fromDate,
        toDate,
        false,
        initialReportLoad,
        0
      );
      var soList = followingSOs.tsalesorderlist;
      $("#following_cnt").val(soList.length);
      if (soList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }
  if('refunds' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var refundData = await salesService.getRefundSales(currentInvoice);
      var creationDate = refundData.fields.CreationDate;
      var fromDate = creationDate.substring(0, 10);
      var toDate =
          currentDate.getFullYear() +
          "-" +
          ("0" + (currentDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + currentDate.getDate()).slice(-2);
      var followingRefunds =
          await sideBarService.getAllTRefundSaleListData(
              fromDate,
              toDate,
              false,
              initialReportLoad,
              0
          );
      var refundList = followingRefunds.trefundsalelist;
      $("#following_cnt").val(refundList.length);
      if (refundList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }
  if('supplierpayments' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var paymentData = await paymentService.getOneSupplierPayment(currentInvoice);
      var paymentDate = paymentData.fields.PaymentDate;
      var fromDate = paymentDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingPayments = await sideBarService.getAllTSupplierPaymentListData(
          fromDate,
          toDate,
          false,
          initialReportLoad,
          0
      );
      var paymentList = followingPayments.tsupplierpaymentlist;
      $("#following_cnt").val(paymentList.length);
      if (paymentList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }
  if('stocktransfer' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var stockData = await stockTransferService.getOneStockTransferData(currentInvoice);
      var transferDate = stockData.fields.DateTransferred;
      var fromDate = transferDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingStocks = await sideBarService.getAllStockTransferEntry("All", stockData.fields.Recno);//initialDataLoad
      var stockList = followingStocks.tstocktransferentry;
      $("#following_cnt").val(stockList.length);
      if (stockList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }
  if('shippingdocket' == templateInstance.data.formType) {
    if (getso_id[1]) {
      currentInvoice = parseInt(currentInvoice);
      var invData = await salesService.getOneInvoicedataEx(currentInvoice);
      var creationDate = invData.fields.CreationDate;
      var fromDate = creationDate.substring(0, 10);
      var toDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
      var followingInvoices = await sideBarService.getAllTInvoiceListData(
          fromDate,
          toDate,
          false,
          initialReportLoad,
          0
        );
      var invList = followingInvoices.tinvoicelist;
      $("#following_cnt").val(invList.length);
      if (invList.length > 0) {
          $("#btn_follow1").css("display", "inline-block");
          $("#btn_follow2").css("display", "inline-block");
        } else {
          $("#btn_follow1").css("display", "none");
          $("#btn_follow2").css("display", "none");
        }
    }
  }

}