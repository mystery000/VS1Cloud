import { SalesBoardService } from "../js/sales-service";
import { PurchaseBoardService } from "../js/purchase-service";
import { ReactiveVar } from "meteor/reactive-var";
import { UtilityService } from "../utility-service"; 
import { ProductService } from "../product/product-service"; 
import "../lib/global/erp-objects";
import "jquery-ui-dist/external/jquery/jquery";
import "jquery-ui-dist/jquery-ui";
import { Random } from "meteor/random";
import { jsPDF } from "jspdf";
import "jQuery.print/jQuery.print.js";
import "jquery-editable-select";
import { SideBarService } from "../js/sidebar-service";
import "../lib/global/indexdbstorage.js";
import { ContactService } from "../contacts/contact-service";
import { TaxRateService } from "../settings/settings-service";
import { saveCurrencyHistory } from "../packages/currency/CurrencyWidget";
import FxGlobalFunctions from "../packages/currency/FxGlobalFunctions";
import CachedHttp from "../lib/global/CachedHttp";
import erpObject from "../lib/global/erp-objects";
import { Template } from 'meteor/templating';
import './frm_invoice_with_temp.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import LoadingOverlay from '../LoadingOverlay';

const sideBarService = new SideBarService();
const utilityService = new UtilityService();
const productService = new ProductService();
const salesService = new SalesBoardService();
const contactService = new ContactService();
const taxRateService = new TaxRateService();
const initialDatatableLoad = 10

let times = 0;
let clickedInput = "";

let template_list = ["Invoices", "Invoice Back Orders", "Delivery Docket"];
var noHasTotals = ["Customer Payment", "Customer Statement", "Supplier Payment", "Statement", "Delivery Docket", "Journal Entry", "Deposit"];

let defaultCurrencyCode = CountryAbbr;

function generateHtmlMailBody(erpInvoiceId, emailDueDate, grandtotal, stripeGlobalURL, stringQuery, customerEmailName, mailFromName, customerBillingAddress, customerTerms, customerSubtotal, customerTax, customerNett, customerTotal) {
  let html =
            '    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">' +
            "        <tr>" +
            '            <td class="container" style="display: block; margin: 0 auto !important; max-width: 650px; padding: 10px; width: 650px;">' +
            '                <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 650px; padding: 10px;">' +
            '                    <table class="main">' +
            "                        <tr>" +
            '                            <td class="wrapper">' +
            '                                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
            "                                    <tr>" +
            '                                        <td class="content-block" style="text-align: center; letter-spacing: 2px;">' +
            '                                            <span class="doc-details" style="color: #999999; font-size: 12px; text-align: center; margin: 0 auto; text-transform: uppercase;">Invoice No. ' +
            erpInvoiceId +
            " Details</span>" +
            "                                        </td>" +
            "                                    </tr>" +
            '                                    <tr style="height: 16px;"></tr>' +
            "                                    <tr>" +
            "                                        <td>" +
            '                                            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;" />' +
            "                                        </td>" +
            "                                    </tr>" +
            '                                    <tr style="height: 48px;"></tr>' +
            '                                    <tr style="background-color: rgba(0, 163, 211, 0.5); ">' +
            '                                        <td style="text-align: center;padding: 32px 0px 16px 0px;">' +
            '                                             <p style="font-weight: 700; font-size: 16px; color: #363a3b; margin-bottom: 6px;">DUE ' +
            emailDueDate +
            "</p>" +
            '                                            <p style="font-weight: 700; font-size: 36px; color: #363a3b; margin-bottom: 6px; margin-top: 6px;">' +
            grandtotal +
            "</p>" +
            '                                            <table border="0" cellpadding="0" cellspacing="0" style="box-sizing: border-box; width: 100%;">' +
            "                                                <tbody>" +
            "                                                    <tr>" +
            '                                                        <td align="center" style="padding-bottom: 15px;">' +
            '                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: auto;">' +
            "                                                                <tbody>" +
            "                                                                    <tr>" +
            '                                                                        <td> <a href="' +
            stripeGlobalURL +
            "" +
            stringQuery +
            '" style="border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none;' +
            '                                                                        text-transform: capitalize; background-color: #363a3b; border-color: #363a3b; color: #ffffff;" target="">Pay Now</a> </td>' +
            "                                                                    </tr>" +
            "                                                                </tbody>" +
            "                                                            </table>" +
            "                                                        </td>" +
            "                                                    </tr>" +
            "                                                </tbody>" +
            "                                            </table>" +
            '                                            <p style="margin-top: 0px;">Powered by VS1 Cloud</p>' +
            "                                        </td>" +
            "                                    </tr>" +
            "                                    <tr>" +
            '                                        <td class="content-block" style="padding: 16px 32px;">' +
            '                                            <p style="font-size: 18px;">Dear ' +
            customerEmailName +
            ",</p>" +
            '                                            <p style="font-size: 18px; margin: 34px 0px;">Here\'s your invoice! We appreciate your prompt payment.</p>' +
            '                                            <p style="font-size: 18px; margin-bottom: 8px;">Thanks for your business!</p>' +
            '                                            <p style="font-size: 18px;">' +
            mailFromName +
            "</p>" +
            "                                        </td>" +
            "                                    </tr>" +
            '                                    <tr style="background-color: #ededed;">' +
            '                                        <td class="content-block" style="padding: 16px 32px;">' +
            '                                            <div style="width: 100%; padding: 16px 0px;">' +
            '                                                <div style="width: 50%; float: left;">' +
            '                                                    <p style="font-size: 18px;">Invoice To</p>' +
            "                                                </div>" +
            '                                                <div style="width: 50%; float: right;">' +
            '                                                    <p style="margin-bottom: 0px;font-size: 16px;">' +
            customerEmailName +
            "</p>" +
            '                                                    <p style="margin-bottom: 0px;font-size: 16px;">' +
            customerBillingAddress +
            "</p>" +
            "                                                </div>" +
            "                                            </div>" +
            "                                        </td>" +
            "                                    </tr>" +
            '                                    <tr style="background-color: #ededed;">' +
            '                                        <td class="content-block" style="padding: 16px 32px;">' +
            '                                            <hr style=" border-top: 1px dotted #363a3b;" />' +
            '                                            <div style="width: 100%; padding: 16px 0px;">' +
            '                                                <div style="width: 50%; float: left;">' +
            '                                                    <p style="font-size: 18px;">Terms</p>' +
            "                                                </div>" +
            '                                                <div style="width: 50%; float: right;">' +
            '                                                    <p style="font-size: 18px;">' +
            customerTerms +
            "</p>" +
            "                                                </div>" +
            "                                            </div>" +
            "                                        </td>" +
            "                                    </tr>" +
            "                                    <tr>" +
            '                                        <td class="content-block" style="padding: 16px 32px;">' +
            '                                            <hr style=" border-top: 1px dotted #363a3b;" />' +
            '                                            <div style="width: 100%; float: right; padding-top: 24px;">' +
            '                                                <div style="width: 50%; float: left;">' +
            '                                                    <p style="font-size: 18px; font-weight: 600;">Subtotal</p>' +
            '                                                    <p style="font-size: 18px; font-weight: 600;">Tax</p>' +
            '                                                    <p style="font-size: 18px; font-weight: 600;">Nett</p>' +
            '                                                    <p style="font-size: 18px; font-weight: 600;">Balance Due</p>' +
            "                                                </div>" +
            '                                                <div style="width: 50%; float: right; text-align: right;">' +
            '                                                    <p style="font-size: 18px; font-weight: 600;">' +
            customerSubtotal +
            "</p>" +
            '                                                    <p style="font-size: 18px; font-weight: 600;">' +
            customerTax +
            "</p>" +
            '                                                    <p style="font-size: 18px; font-weight: 600;">' +
            customerNett +
            "</p>" +
            '                                                    <p style="font-size: 18px; font-weight: 600;">' +
            customerTotal +
            "</p>" +
            "                                                </div>" +
            "                                            </div>" +
            "                                        </td>" +
            "                                    </tr>" +
            "                                    <tr>" +
            '                                        <td class="content-block" style="padding: 16px 32px; padding-top: 0px;">' +
            '                                            <hr style=" border-top: 1px dotted #363a3b;" />' +
            '                                            <table border="0" cellpadding="0" cellspacing="0" style="box-sizing: border-box; width: 100%;">' +
            "                                                <tbody>" +
            "                                                    <tr>" +
            '                                                        <td align="center">' +
            '                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: auto;">' +
            "                                                                <tbody>" +
            "                                                                    <tr>" +
            '                                                                        <td> <a href="' +
            stripeGlobalURL +
            "" +
            stringQuery +
            '" style="border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none;' +
            '                                                                        text-transform: capitalize; background-color: #363a3b; border-color: #363a3b; color: #ffffff;" target="">Pay Now</a> </td>' +
            "                                                                    </tr>" +
            "                                                                </tbody>" +
            "                                                            </table>" +
            "                                                        </td>" +
            "                                                    </tr>" +
            "                                                </tbody>" +
            "                                            </table>" +
            "                                        </td>" +
            "                                    </tr>" +
            "                                    <tr>" +
            '                                        <td class="content-block" style="padding: 16px 32px;">' +
            '                                            <p style="font-size: 15px; color: #666666;">If you receive an email that seems fraudulent, please check with the business owner before paying.</p>' +
            "                                        </td>" +
            "                                    </tr>" +
            "                                    <tr>" +
            "                                        <td>" +
            '                                            <table border="0" cellpadding="0" cellspacing="0" style="box-sizing: border-box; width: 100%;">' +
            "                                                <tbody>" +
            "                                                    <tr>" +
            '                                                        <td align="center">' +
            '                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: auto;">' +
            "                                                                <tbody>" +
            "                                                                    <tr>" +
            '                                                                        <td> <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; width: 20%; margin: 0; padding: 12px 25px; display: inline-block;" /> </td>' +
            "                                                                    </tr>" +
            "                                                                </tbody>" +
            "                                                            </table>" +
            "                                                        </td>" +
            "                                                    </tr>" +
            "                                                </tbody>" +
            "                                            </table>" +
            "                                        </td>" +
            "                                    </tr>" +
            "                                </table>" +
            "                            </td>" +
            "                        </tr>" +
            "                    </table>" +
            '                    <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">' +
            '                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
            "                            <tr>" +
            '                                <td class="content-block" style="color: #999999; font-size: 12px; text-align: center;">' +
            '                                    <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">' +
            mailFromName +
            "</span>" +
            "                                    <br>" +
            '                                    <a href="https://vs1cloud.com/downloads/VS1%20Privacy%20ZA.pdf" style="color: #999999; font-size: 12px; text-align: center;">Privacy</a>' +
            '                                    <a href="https://vs1cloud.com/downloads/VS1%20Terms%20ZA.pdf" style="color: #999999; font-size: 12px; text-align: center;">Terms of Service</a>' +
            "                                </td>" +
            "                            </tr>" +
            "                        </table>" +
            "                    </div>" +
            "                </div>" +
            "            </td>" +
            "        </tr>" +
            "    </table>";

        return html;
}

Template.invoice_temp.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.isForeignEnabled = new ReactiveVar(false);
  templateObject.records = new ReactiveVar();
  templateObject.CleintName = new ReactiveVar();
  templateObject.Department = new ReactiveVar();
  templateObject.Date = new ReactiveVar();
  templateObject.DueDate = new ReactiveVar();
  templateObject.InvoiceNo = new ReactiveVar();
  templateObject.RefNo = new ReactiveVar();
  templateObject.Branding = new ReactiveVar();
  templateObject.Currency = new ReactiveVar();
  templateObject.Total = new ReactiveVar();
  templateObject.Subtotal = new ReactiveVar();
  templateObject.TotalTax = new ReactiveVar();
  templateObject.invoicerecord = new ReactiveVar({});
  templateObject.taxrateobj = new ReactiveVar();
  templateObject.Accounts = new ReactiveVar([]);
  templateObject.InvoiceId = new ReactiveVar();
  templateObject.selectedCurrency = new ReactiveVar([]);
  templateObject.inputSelectedCurrency = new ReactiveVar([]);
  templateObject.currencySymbol = new ReactiveVar([]);
  templateObject.deptrecords = new ReactiveVar();
  templateObject.termrecords = new ReactiveVar();
  templateObject.clientrecords = new ReactiveVar([]);
  templateObject.taxraterecords = new ReactiveVar([]);
  templateObject.taxcodes = new ReactiveVar([]);
  templateObject.custfields = new ReactiveVar([]);
  templateObject.record = new ReactiveVar({});
  templateObject.accountID = new ReactiveVar();
  templateObject.stripe_fee_method = new ReactiveVar();
  /* Attachments */
  templateObject.uploadedFile = new ReactiveVar();
  templateObject.uploadedFiles = new ReactiveVar([]);
  templateObject.attachmentCount = new ReactiveVar();
  templateObject.address = new ReactiveVar();
  templateObject.abn = new ReactiveVar();
  templateObject.referenceNumber = new ReactiveVar();
  templateObject.statusrecords = new ReactiveVar([]);
  templateObject.includeBOnShippedQty = new ReactiveVar();
  templateObject.includeBOnShippedQty.set(true);
  templateObject.productextrasellrecords = new ReactiveVar([]);
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.selectedcustomerpayrecords = new ReactiveVar([]);
  templateObject.singleInvoiceData = new ReactiveVar([]);
  templateObject.defaultsaleterm = new ReactiveVar();

  templateObject.invoice_data = new ReactiveVar([]);
  templateObject.subtaxcodes = new ReactiveVar([]);
  templateObject.isbackorderredirect = new ReactiveVar();
  templateObject.isbackorderredirect.set(false);
  templateObject.hasFollow = new ReactiveVar(false);
  templateObject.customers = new ReactiveVar([]);
  templateObject.customer = new ReactiveVar();

  templateObject.customerRecord = new ReactiveVar();
  templateObject.headerfields = new ReactiveVar();
  templateObject.headerbuttons = new ReactiveVar();
  templateObject.transactiongridfields = new ReactiveVar();
  templateObject.tranasctionfooterfields = new ReactiveVar();

  function formatDate (date) {
    return moment(date).format('DD/MM/YYYY'); 
  }

  let transactionheaderfields = [
      {label: "Sales Date", type:"date", readonly: false, value: formatDate(new Date())},
      {label: "P.O.Number", type:'default', id: 'ponumber', value: '', readonly: false},
      {label: 'Terms', type: 'search', id: 'sltTerms', listModalId:'termsList_modal', listModalTemp: 'termlistpop', colName: 'colName', editModalId: 'newTerms_modal', editModalTemp:'newtermspop', editable: true},
      {label: 'Status', type: 'search', id: 'sltStatus', listModalId:'statusPop_modal', listModalTemp: 'statuspop', colName: 'colStatusName', editModalId: 'newStatusPop_modal', editModalTemp:'newstatuspop', editable: true},
      {label: 'Reference', type: 'defailt', id:'edtRef', value: '', readonly: false},
      {label: 'Department', type: 'search', id: 'sltDept', listModalId:'department_modal', listModalTemp: 'departmentpop', colName: 'colDeptName', editModalId: 'newDepartment_modal', editModalTemp:'newdepartmentpop', editable: true},
  ]
  templateObject.headerfields.set(transactionheaderfields);

  let transactionheaderbuttons = [
      {label: "Pay Now", class:'btnTransaction payNow', id:'btnPayNow', bsColor:'success', icon:'dollar-sign'},
      {label: "Payment", class:'btnTransaction btnMakePayment', id:'btnPayment', bsColor:'primary'},
      {label: "Copy Invoice", class:'btnTransaction copyInvoice', id:'btnCopyInvoice', bsColor:'primary'}
  ]
  templateObject.headerbuttons.set(transactionheaderbuttons)

  let transactiongridfields = [
        { index: 0,  label: "Product Name",        class: "ProductName",   width: "300",       active: true,   display: true },
        { index: 1,  label: "Description",         class: "Description",   width: "",          active: true,   display: true },
        { index: 2,  label: "Qty",                 class: "Qty",           width: "55",        active: true,   display: true },
        { index: 3,  label: "Unit Price (Ex)",     class: "UnitPriceEx",   width: "152",       active: true,   display: true },
        { index: 4,  label: "Unit Price (Inc)",    class: "UnitPriceInc",  width: "152",       active: false,  display: true },
        { index: 5,  label: "Disc %",              class: "Discount",      width: "95",        active: true,   display: true },
        { index: 6,  label: "Cost Price",          class: "CostPrice",     width: "110",       active: true,   display: true },
        { index: 7,  label: "SalesLinesCustField1",class: "SalesLinesCustField1", width: "110",active: false,  display: true },
        { index: 8,  label: "Tax Rate",           class: "TaxRate",        width: "95",        active: true,   display: true },
        { index: 9,  label: "Tax Code",           class: "TaxCode",        width: "95",        active: true,   display: true },
        { index: 10, label: "Tax Amt",            class: "TaxAmount",      width: "95",        active: true,   display: true },
        { index: 11, label: "Amount (Ex)",        class: "AmountEx",       width: "140",       active: true,   display: true },
        { index: 12, label: "Amount (Inc)",       class: "AmountInc",      width: "140",       active: false,  display: true },
        { index: 13, label: "Units",              class: "Units",          width: "95",        active: true,   display: true },
  ];

  templateObject.transactiongridfields.set(transactiongridfields)

  let transactionfooterfields = [
    {label: 'Comments', id: "txaComment", name:"txaComment", row: 6},
    {label: 'Picking Instructions', id: "txapickmemo", name:"txapickmemo", row: 6},
  ];

  templateObject.tranasctionfooterfields.set(transactionfooterfields);

  templateObject.printOptions = new ReactiveVar();
  let options = [ {title: 'Invoices', number: 1, nameFieldID:'Invoices_1'}, {title: 'Invoices', number: 2, nameFieldID:'Invoices_2'}, {title: 'Invoices', number: 3, nameFieldID:'Invoices_3'},
  {title: 'Invoice Back Orders', number: 1, nameFieldID:'Invoice Back Orders_1'},{title: 'Invoice Back Orders', number: 2, nameFieldID:'Invoice Back Orders_2'},{title: 'Invoice Back Orders', number: 3, nameFieldID:'Invoice Back Orders_3'},
  {title: 'Delivery Docket', number: 1, nameFieldID:'Delivery Docket_1'},{title: 'Delivery Docket', number: 2, nameFieldID:'Delivery Docket_2'},{title: 'Delivery Docket', number: 3, nameFieldID:'Delivery Docket_3'},
  ]

  templateObject.printOptions.set(options)


  templateObject.setInitialRecords = function () {
    let lineItems = [];
    let lineItemsTable = [];
    let lineItemObj = {};
    lineItemObj = {
      lineID: Random.id(),
      item: "",
      description: "",
      quantity: "",
      qtyordered: "",
      qtyshipped: "",
      qtybo: "",
      UnitOfMeasure: defaultUOM || "",
      unitPrice: 0,
      unitPriceInc: 0,
      TotalAmt: 0,
      TotalAmtInc: 0,
      taxRate: "",
      taxCode: "",
      curTotalAmt: 0,
      TaxTotal: 0,
      TaxRate: 0,
    };
    const dataListTable = [
      " " || "",
      " " || "",
      0 || 0,
      0.0 || 0.0,
      " " || "",
      0.0 || 0.0,
      '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>',
    ];
    lineItemsTable.push(dataListTable);
    lineItems.push(lineItemObj);
    const currentDate = new Date();
    const begunDate = moment(currentDate).format("DD/MM/YYYY");
    let invoicerecord = {
      id: "",
      lid: "New Invoice",
      socustomer: "",
      salesOrderto: "",
      shipto: "",
      department: defaultDept || "",
      docnumber: "",
      custPONumber: "",
      saledate: begunDate,
      duedate: "",
      employeename: "",
      status: "",
      category: "",
      comments: "",
      pickmemo: "",
      ponumber: "",
      via: "",
      connote: "",
      reference: "",
      currency: "",
      branding: "",
      invoiceToDesc: "",
      shipToDesc: "",
      termsName: templateObject.defaultsaleterm.get() || "",
      Total: Currency + "" + 0.0,
      TotalDiscount: Currency + "" + 0.0,
      LineItems: lineItems,
      TotalTax: Currency + "" + 0.0,
      SubTotal: Currency + "" + 0.0,
      balanceDue: Currency + "" + 0.0,
      saleCustField1: "",
      saleCustField2: "",
      totalPaid: Currency + "" + 0.0,
      ispaid: false,
      isPartialPaid: false,
    };
    if (FlowRouter.current().queryParams.customerid) {
      // templateObject.getCustomerData(FlowRouter.current().queryParams.customerid);
    } else {
      $("#edtCustomerName").val("");
    }
    $("#sltDept").val(defaultDept);
    $("#sltTerms").val(invoicerecord.termsName);
    templateObject.getLastInvoiceData();
    templateObject.invoicerecord.set(invoicerecord)
    return invoicerecord;
  }
  
 
  /**
   * It should be updated with indexeddb
   */
  templateObject.getLastInvoiceData = async function () {
    let lastDepartment = defaultDept || "";
    salesService
      .getLastInvoiceID()
      .then(function (data) {
        let latestInvoiceId;
        if (data.tinvoice.length > 0) {
          lastInvoice = data.tinvoice[data.tinvoice.length - 1];
          latestInvoiceId = lastInvoice.Id;
        } else {
          latestInvoiceId = 0;
        }
        newInvoiceId = latestInvoiceId + 1;
        setTimeout(function () {
          $("#sltDept").val(lastDepartment);
        }, 50);
      })
      .catch(function (err) {
        $("#sltDept").val(lastDepartment);
      });
  };


  templateObject.setClientVS1 = function(data) {
    const clientList = [];
    for (let i in data.tcustomervs1) {
      if (data.tcustomervs1.hasOwnProperty(i)) {
        let customerrecordObj = {
          customerid: data.tcustomervs1[i].fields.ID || " ",
          firstname: data.tcustomervs1[i].fields.FirstName || " ",
          lastname: data.tcustomervs1[i].fields.LastName || " ",
          customername: data.tcustomervs1[i].fields.ClientName || " ",
          customeremail: data.tcustomervs1[i].fields.Email || " ",
          street: data.tcustomervs1[i].fields.Street || " ",
          street2: data.tcustomervs1[i].fields.Street2 || " ",
          street3: data.tcustomervs1[i].fields.Street3 || " ",
          suburb: data.tcustomervs1[i].fields.Suburb || " ",
          statecode: data.tcustomervs1[i].fields.State +
            " " +
            data.tcustomervs1[i].fields.Postcode || " ",
          country: data.tcustomervs1[i].fields.Country || " ",
          termsName: data.tcustomervs1[i].fields.TermsName || "",
          taxCode: data.tcustomervs1[i].fields.TaxCodeName || "E",
          clienttypename: data.tcustomervs1[i].fields.ClientTypeName || "Default",
          discount: data.tcustomervs1[i].fields.Discount || 0,
        };
        clientList.push(customerrecordObj);
      }
    }
    templateObject.clientrecords.set(clientList);
    if (!(FlowRouter.current().queryParams.id ||
      FlowRouter.current().queryParams.customerid ||
      FlowRouter.current().queryParams.copyquid ||
      FlowRouter.current().queryParams.copyinvid ||
      FlowRouter.current().queryParams.copysoid)
    ) {
      setTimeout(function () {
        $("#edtCustomerName").trigger("click");
      }, 200);
    }
  }

  templateObject.getAllClients = function () {
    getVS1Data("TCustomerVS1")
      .then(function (dataObject) {
        if (dataObject.length === 0) {
          sideBarService.getAllCustomersDataVS1("All").then(function (data) {
            templateObject.setClientVS1(data);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          templateObject.setClientVS1(data);
        }
      })
      .catch(function (err) {
        sideBarService.getAllCustomersDataVS1("All").then(function (data) {
          templateObject.setClientVS1(data);
        });
      });
  };

  /**
 *  Should be updated with indexeddb
 */
  templateObject.getOrganisationDetails = function () {
    let account_id = localStorage.getItem("vs1companyStripeID") || "";
    let stripe_fee = localStorage.getItem("vs1companyStripeFeeMethod") || "apply";
    templateObject.accountID.set(account_id);
    templateObject.stripe_fee_method.set(stripe_fee);
  };
  templateObject.getAllLeadStatuss = function () {
    const statusList = [];
    getVS1Data("TLeadStatusType")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          salesService.getAllLeadStatus().then(function (data) {
            for (let i in data.tleadstatustype) {
              let leadrecordObj = {
                orderstatus: data.tleadstatustype[i].TypeName || " ",
              };

              statusList.push(leadrecordObj);
            }
            templateObject.statusrecords.set(statusList);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tleadstatustype;
          for (let i in useData) {
            let leadrecordObj = {
              orderstatus: useData[i].TypeName || " ",
            };

            statusList.push(leadrecordObj);
          }
          templateObject.statusrecords.set(statusList);
        }
      })
      .catch(function (err) {
        const templateObject = Template.instance();
        salesService.getAllLeadStatus().then(function (data) {
          for (let i in data.tleadstatustype) {
            let leadrecordObj = {
              orderstatus: data.tleadstatustype[i].TypeName || " ",
            };

            statusList.push(leadrecordObj);
          }
          templateObject.statusrecords.set(statusList);
        });
      });
  };
  templateObject.getDepartments = function () {
    const deptrecords = [];
    getVS1Data("TDeptClass")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          salesService.getDepartment().then(function (data) {
            for (let i in data.tdeptclass) {
              let deptrecordObj = {
                department: data.tdeptclass[i].DeptClassName || " ",
              };
              deptrecords.push(deptrecordObj);
              templateObject.deptrecords.set(deptrecords);
            }
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tdeptclass;
          for (let i in useData) {
            let deptrecordObj = {
              department: useData[i].DeptClassName || " ",
            };

            deptrecords.push(deptrecordObj);
            templateObject.deptrecords.set(deptrecords);
          }
        }
      })
      .catch(function (err) {
        salesService.getDepartment().then(function (data) {
          const templateObject = Template.instance()
          for (let i in data.tdeptclass) {
            let deptrecordObj = {
              department: data.tdeptclass[i].DeptClassName || " ",
            };

            deptrecords.push(deptrecordObj);
            templateObject.deptrecords.set(deptrecords);
          }
        });
      });
  };

  templateObject.getTerms = function () {
    const termrecords = [];
    getVS1Data("TTermsVS1")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          salesService.getTermVS1().then(function (data) {
            for (let i in data.ttermsvs1) {
              let termrecordObj = {
                termsname: data.ttermsvs1[i].TermsName || " ",
                isSalesdefault: data.ttermsvs1[i].isSalesdefault || ""
              };

              if (data.ttermsvs1[i].isSalesdefault == true) {
                localStorage.setItem(
                  "ERPTermsSales",
                  data.ttermsvs1[i].TermsName || "COD"
                );
                templateObject.defaultsaleterm.set(data.ttermsvs1[i].TermsName);
              }

              termrecords.push(termrecordObj);
              templateObject.termrecords.set(termrecords);
            }
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.ttermsvs1;
          for (let i in useData) {
            let termrecordObj = {
              termsname: useData[i].TermsName || " ",
              isSalesdefault: useData[i].isSalesdefault || ""
            };
            if (useData[i].isSalesdefault == true) {
              templateObject.defaultsaleterm.set(useData[i].TermsName);
            }

            termrecords.push(termrecordObj);
            templateObject.termrecords.set(termrecords);
          }
        }
      })
      .catch(function (err) {
        salesService.getTermVS1().then(function (data) {
          for (let i in data.ttermsvs1) {
            let termrecordObj = {
              termsname: data.ttermsvs1[i].TermsName || " ",
              isSalesdefault: data.ttermsvs1[i].isSalesdefault || ""
            };
            if (data.ttermsvs1[i].isSalesdefault == true) {
              localStorage.setItem(
                "ERPTermsSales",
                data.ttermsvs1[i].TermsName || "COD"
              );
              templateObject.defaultsaleterm.set(data.ttermsvs1[i].TermsName);
            }
            termrecords.push(termrecordObj);
            templateObject.termrecords.set(termrecords);
          }
        });
      });
  };

  /**
 * Should be updated with indexeddb
 */
  templateObject.getAllSelectPaymentData = function () {
    let customerName = $("#edtCustomerName").val() || "";
    salesService
      .getCheckPaymentDetailsByName(customerName)
      .then(function (data) {
        const dataTableList = [];
        for (let i = 0; i < data.tcustomerpayment.length; i++) {
          let amount =
            utilityService.modifynegativeCurrencyFormat(
              data.tcustomerpayment[i].fields.Amount
            ) || 0.0;
          let applied =
            utilityService.modifynegativeCurrencyFormat(
              data.tcustomerpayment[i].fields.Applied
            ) || 0.0;
          let balance =
            utilityService.modifynegativeCurrencyFormat(
              data.tcustomerpayment[i].fields.Balance
            ) || 0.0;
          var dataList = {
            id: data.tcustomerpayment[i].fields.ID || "",
            sortdate: data.tcustomerpayment[i].fields.PaymentDate != "" ?
              moment(data.tcustomerpayment[i].fields.PaymentDate).format(
                "YYYY/MM/DD"
              ) : data.tcustomerpayment[i].fields.PaymentDate,
            paymentdate: data.tcustomerpayment[i].fields.PaymentDate != "" ?
              moment(data.tcustomerpayment[i].fields.PaymentDate).format(
                "DD/MM/YYYY"
              ) : data.tcustomerpayment[i].fields.PaymentDate,
            customername: data.tcustomerpayment[i].fields.CompanyName || "",
            paymentamount: amount || 0.0,
            applied: applied || 0.0,
            balance: balance || 0.0,
            lines: data.tcustomerpayment[i].fields.Lines,
            bankaccount: data.tcustomerpayment[i].fields.AccountName || "",
            department: data.tcustomerpayment[i].fields.DeptClassName || "",
            refno: data.tcustomerpayment[i].fields.ReferenceNo || "",
            paymentmethod: data.tcustomerpayment[i].fields.PaymentMethodName || "",
            notes: data.tcustomerpayment[i].fields.Notes || "",
          };
          dataTableList.push(dataList);
        }
        templateObject.selectedcustomerpayrecords.set(dataTableList);
      })
      .catch(function (err) { });
  };


  templateObject.setInvoiceDataFields = function(data) {
    templateObject.singleInvoiceData.set(data);
    const isRepeated = data.fields.RepeatedFrom;
    templateObject.hasFollow.set(isRepeated);
    let lineItems = [];
    let lineItemObj = {};
    let lineItemsTable = [];
    let currencySymbol = Currency;
    let totalInc = currencySymbol + "" +
      data.fields.TotalAmountInc.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
    let totalDiscount = utilityService
      .modifynegativeCurrencyFormat(data.fields.TotalDiscount)
      .toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
    let subTotal =
      currencySymbol +
      "" +
      data.fields.TotalAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
    let totalTax =
      currencySymbol +
      "" +
      data.fields.TotalTax.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
    let totalBalance = utilityService
      .modifynegativeCurrencyFormat(data.fields.TotalBalance)
      .toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });

    let totalPaidAmount =
      currencySymbol +
      "" +
      data.fields.TotalPaid.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
    if (data.fields.Lines != null) {
      if (data.fields.Lines.length) {
        for (let i = 0; i < data.fields.Lines.length; i++) {
          let AmountGbp =
            currencySymbol +
            "" +
            data.fields.Lines[
              i
            ].fields.TotalLineAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            });
          let currencyAmountGbp =
            currencySymbol +
            "" +
            data.fields.Lines[i].fields.TotalLineAmount.toFixed(
              2
            );
          let TaxTotalGbp =
            utilityService.modifynegativeCurrencyFormat(
              data.fields.Lines[i].fields.LineTaxTotal
            );
          let TaxRateGbp = (
            data.fields.Lines[i].fields.LineTaxRate * 100
          ).toFixed(2);

          let SalesLinesCustField1Val = (
            data.fields.Lines[i].fields.SalesLinesCustField1
          );

          let serialno = "";
          let lotno = "";
          let expirydate = "";
          if(data.fields.Lines[i].fields?.PQA?.fields?.PQASN != null){
            for (let j = 0; j < data.fields.Lines[i].fields.PQA.fields.PQASN.length; j++) {
              serialno += (serialno == "") ? data.fields.Lines[i].fields.PQA.fields.PQASN[j].fields.SerialNumber : ","+data.fields.Lines[i].fields.PQA.fields.PQASN[j].fields.SerialNumber;
            }
          }
          if(data.fields.Lines[i].fields?.PQA?.fields?.PQABatch != null){
            for (let j = 0; j < data.fields.Lines[i].fields.PQA.fields.PQABatch.length; j++) {
              lotno += (lotno == "") ? data.fields.Lines[i].fields.PQA.fields.PQABatch[j].fields.BatchNo : ","+data.fields.Lines[i].fields.PQA.fields.PQABatch[j].fields.BatchNo;
              let expirydateformat = data.fields.Lines[i].fields.PQA.fields.PQABatch[j].fields.BatchExpiryDate != '' ? moment(data.fields.Lines[i].fields.PQA.fields.PQABatch[j].fields.BatchExpiryDate).format("YYYY/MM/DD"): data.fields.Lines[i].fields.PQA.fields.PQABatch[j].fields.BatchExpiryDate;
              expirydate += (expirydate == "") ? expirydateformat : ","+expirydateformat;
            }
          }
          lineItemObj = {
            lineID: Random.id(),
            id: data.fields.Lines[i].fields.ID || "",
            item: data.fields.Lines[i].fields.ProductName || "",
            description: data.fields.Lines[i].fields.ProductDescription ||
              "",
            quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
            qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
            qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
            qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
            UnitOfMeasure: data.fields.Lines[i].fields.UnitOfMeasure || defaultUOM,
            unitPrice: utilityService
              .modifynegativeCurrencyFormat(
                data.fields.Lines[i].fields.OriginalLinePrice
              )
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }) || 0,
            unitPriceInc: utilityService
              .modifynegativeCurrencyFormat(
                data.fields.Lines[i].fields.OriginalLinePriceInc
              )
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }) || 0,
            TotalAmt: utilityService
              .modifynegativeCurrencyFormat(
                data.fields.Lines[i].fields.TotalLineAmount
              )
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }) || 0,
            TotalAmtInc: utilityService
              .modifynegativeCurrencyFormat(
                data.fields.Lines[i].fields.TotalLineAmountInc
              )
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }) || 0,
            lineCost: utilityService
              .modifynegativeCurrencyFormat(
                data.fields.Lines[i].fields.LineCost
              )
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }) || 0,
            taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
            taxCode: data.fields.Lines[i].fields.LineTaxCode || "",
            curTotalAmt: currencyAmountGbp || currencySymbol + "0",
            TaxTotal: TaxTotalGbp || 0,
            TaxRate: TaxRateGbp || 0,
            DiscountPercent: data.fields.Lines[i].fields.DiscountPercent || 0,
            SalesLinesCustField1: SalesLinesCustField1Val,
            serialnumbers: serialno,
            lotnumbers: lotno,
            expirydates: expirydate
          };
          var dataListTable = [
            data.fields.Lines[i].fields.ProductName || "",
            data.fields.Lines[i].fields.ProductDescription || "",
            "<div contenteditable='true' class='qty'>" +
            "" +
            data.fields.Lines[i].fields.UOMOrderQty +
            "" +
            "</div>" || "<div>" + "" + 0 + "" + "</div>",
            "<div>" +
            "" +
            currencySymbol +
            "" +
            data.fields.Lines[i].fields.LinePrice.toFixed(2) +
            "" +
            "</div>" || currencySymbol + "" + 0.0,
            data.fields.Lines[i].fields.LineTaxCode || "",
            AmountGbp || currencySymbol + "" + 0.0,
            '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>',
          ];
          lineItemsTable.push(dataListTable);
          lineItems.push(lineItemObj);
        }
      } else {
        let AmountGbp =
          data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(
            undefined, {
            minimumFractionDigits: 2,
          }
          );
        let currencyAmountGbp =
          currencySymbol +
          "" +
          data.fields.Lines.fields.TotalLineAmount.toFixed(2);
        let TaxTotalGbp =
          utilityService.modifynegativeCurrencyFormat(
            data.fields.Lines.fields.LineTaxTotal
          );
        let TaxRateGbp = (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2);
        lineItemObj = {
          lineID: Random.id(),
          id: data.fields.Lines.fields.ID || "",
          description: data.fields.Lines.fields.ProductDescription || "",
          quantity: data.fields.Lines.fields.UOMOrderQty || 0,
          UnitOfMeasure: data.fields.Lines.fields.UnitOfMeasure || defaultUOM,
          unitPrice: data.fields.Lines[i].fields.OriginalLinePrice.toLocaleString(undefined, { minimumFractionDigits: 2, }) || 0,
          lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
          taxRate: (data.fields.Lines.fields.LineTaxRate * 100).toFixed(2) || 0,
          taxCode: data.fields.Lines.fields.LineTaxCode || "",
          TotalAmt: AmountGbp || 0,
          curTotalAmt: currencyAmountGbp || currencySymbol + "0",
          TaxTotal: TaxTotalGbp || 0,
          TaxRate: TaxRateGbp || 0,
          DiscountPercent: data.fields.Lines.fields.DiscountPercent || 0,
          SalesLinesCustField1: data.fields.Lines.fields.SalesLinesCustField1 || "",
        };
        lineItems.push(lineItemObj);
      }
    }
    let lidData = "Edit Invoice" + " " + data.fields.ID || "";
    if (data.fields.IsBackOrder) {
      lidData = "Edit Invoice" + " (BO) " + data.fields.ID || "";
      templateObject.isbackorderredirect.set(true);
    }
    let isPartialPaid = data.fields.TotalPaid > 0;
    let invoicerecord = {
      id: data.fields.ID,
      lid: lidData,
      socustomer: data.fields.CustomerName,
      salesOrderto: data.fields.InvoiceToDesc,
      shipto: data.fields.ShipToDesc,
      department: data.fields.SaleClassName,
      docnumber: data.fields.DocNumber,
      custPONumber: data.fields.CustPONumber,
      saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : "",
      duedate: data.fields.DueDate ? moment(data.fields.DueDate).format("DD/MM/YYYY") : "",
      employeename: data.fields.EmployeeName,
      status: data.fields.SalesStatus,
      category: data.fields.SalesCategory,
      comments: data.fields.Comments,
      pickmemo: data.fields.PickMemo,
      ponumber: data.fields.CustPONumber,
      via: data.fields.Shipping,
      connote: data.fields.ConNote,
      reference: data.fields.ReferenceNo,
      currency: data.fields.ForeignExchangeCode,
      branding: data.fields.MedType,
      invoiceToDesc: data.fields.InvoiceToDesc,
      shipToDesc: data.fields.ShipToDesc,
      termsName: data.fields.TermsName,
      Total: totalInc,
      TotalDiscount: totalDiscount,
      LineItems: lineItems,
      TotalTax: totalTax,
      SubTotal: subTotal,
      balanceDue: totalBalance,
      saleCustField1: data.fields.SaleCustField1,
      saleCustField2: data.fields.SaleCustField2,
      totalPaid: totalPaidAmount,
      ispaid: data.fields.IsPaid,
      isPartialPaid: isPartialPaid,
      CustomerID: data.fields.CustomerID
    };

    $("#edtCustomerName").val(data.fields.CustomerName);
    $("#sltStatus").val(data.fields.SalesStatus);
    $("#sltDept").val(data.fields.SaleClassName);
    $("#sltCurrency").val(data.fields.ForeignExchangeCode);
    FxGlobalFunctions.handleChangedCurrency(data.fields.ForeignExchangeCode, defaultCurrencyCode);

    $('#exchange_rate').val(data.fields.ForeignExchangeRate);
    $("#sltTerms").val(data.fields.TermsName);
    templateObject.CleintName.set(data.fields.CustomerName);

    /* START attachment */
    templateObject.attachmentCount.set(0);
    if (data.fields.Attachments) {
      if (data.fields.Attachments.length) {
        templateObject.attachmentCount.set(data.fields.Attachments.length);
        templateObject.uploadedFiles.set(data.fields.Attachments);
      }
    }
    /* END  attachment */
    var checkISCustLoad = false;
    const clientList = templateObject.clientrecords.get()
    if (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].customername == data.fields.CustomerName) {
          checkISCustLoad = true;
          invoicerecord.firstname = clientList[i].firstname || "";
          invoicerecord.lastname = clientList[i].lastname || "";
          templateObject.invoicerecord.set(invoicerecord);
          $("#edtCustomerEmail").val(clientList[i].customeremail);
          $("#edtCustomerEmail").attr("customerid", clientList[i].customerid);
          $("#edtCustomerName").attr("custid", clientList[i].customerid);
          $("#edtCustomerEmail").attr("customerfirstname", clientList[i].firstname);
          $("#edtCustomerEmail").attr("customerlastname", clientList[i].lastname);
          $("#customerType").text(clientList[i].clienttypename || "Default");
          $("#customerDiscount").text(clientList[i].discount + "%" || 0 + "%");
          $("#edtCustomerUseType").val(clientList[i].clienttypename || "Default");
          $("#edtCustomerUseDiscount").val(clientList[i].discount || 0);
          break;
        }
      }
    }

    if (data.fields.IsPaid === true) {
      $("#edtCustomerName").attr("readonly", true);
      $(".btn-primary").attr("disabled", "disabled");
      $("#btnCopyInvoice").attr("disabled", "disabled");
      $("#edtCustomerName").css("background-color", "#eaecf4");
      $("#btnViewPayment").removeAttr("disabled", "disabled");
      $(".btnSave").attr("disabled", "disabled");
      $("#btnBack").removeAttr("disabled", "disabled");
      $(".printConfirm").removeAttr("disabled", "disabled");
      $(".tblInvoiceLine tbody tr").each(function () {
        var $tblrow = $(this);
        $tblrow.find("td").attr("contenteditable", false);
        $tblrow.find("td").removeClass("lineTaxRate");
        $tblrow.find("td").removeClass("lineTaxCode");
        $tblrow.find("td").attr("readonly", true);
        $tblrow.find("td").attr("disabled", "disabled");
        $tblrow.find("td").css("background-color", "#eaecf4");
        $tblrow
          .find("td .table-remove")
          .removeClass("btnRemove");
      });
    }
    templateObject.invoicerecord.set(invoicerecord);

    templateObject.selectedCurrency.set(invoicerecord.currency);
    templateObject.inputSelectedCurrency.set(
      invoicerecord.currency
    );
    return {record: invoicerecord, attachmentCount: templateObject.attachmentCount.get(), uploadedFiles: templateObject.uploadedFiles.get(), selectedCurrency: invoicerecord.currency}
  }

  // templateObject.showInvoice1 = function(template_title, number, bprint) {
  //   let array_data = [];
  //   let lineItems = [];
  //   let taxItems = {};
  //   let object_invoce = [];
  //   let item_invoices = "";
  //   let invoice_data = templateObject.invoicerecord.get();
  //   let stripe_id = templateObject.accountID.get() || "";
  //   let stripe_fee_method = templateObject.stripe_fee_method.get();
  //   var erpGet = erpDb();
  //   var customfield1 = $("#edtSaleCustField1").val() || "  ";
  //   var customfield2 = $("#edtSaleCustField2").val() || "  ";
  //   var customfield3 = $("#edtSaleCustField3").val() || "  ";

  //   var customfieldlabel1 =
  //     $(".lblCustomField1").first().text() || "Custom Field 1";
  //   var customfieldlabel2 =
  //     $(".lblCustomField2").first().text() || "Custom Field 2";
  //   var customfieldlabel3 =
  //     $(".lblCustomField3").first().text() || "Custom Field 3";
  //   let balancedue = $("#totalBalanceDue").html() || 0;
  //   let tax = $("#subtotal_tax").html() || 0;
  //   let customer = $("#edtCustomerName").val();
  //   let name = $("#firstname").val();
  //   let surname = $("#lastname").val();
  //   let dept = $("#sltDept").val();
  //   let fx = $("#sltCurrency").val();
  //   var comment = $("#txaComment").val();
  //   var subtotal_tax = $("#subtotal_tax").html() || Currency + 0;
  //   var total_paid = $("#totalPaidAmt").html() || Currency + 0;
  //   var ref = $("#edtRef").val() || "-";
  //   var txabillingAddress = $("#txabillingAddress").val() || "";
  //   txabillingAddress = txabillingAddress.replace(/\n/g, '<br/>');
  //   var dtSODate = $("#dtSODate").val();
  //   var subtotal_total = $("#subtotal_total").text() || Currency + 0;
  //   var grandTotal = $("#grandTotal").text() || Currency + 0;
  //   var duedate = $("#dtDueDate").val();
  //   var po = $("#ponumber").val() || ".";

  //   $("#tblInvoiceLine > tbody > tr").each(function () {
  //     var lineID = this.id;
  //     const tdproduct = $(this).find(".lineProductName").val();
  //     let tddescription = $(this).find('.lineProductDesc').text();
  //     let tdpqa = $('#' + lineID + " .lineProductDesc").attr('data-pqa');
  //     if(tdpqa){
  //         tddescription += " " + tdpqa;
  //     }

  //     const tdQty = $(this).find('.lineQty').val();
  //     const tdunitprice = $(this).find('.colUnitPriceExChange').val();
  //     const tdtaxrate = $(this).find(".lineTaxRate").val();
  //     const taxamount = $(this).find('.colTaxAmount').val();
  //     const tdlineamt = $(this).find(".colAmountInc").text();

  //     let targetRow = $(this);
  //     let targetTaxCode = targetRow.find(".lineTaxCode").val();
  //     let qty = targetRow.find(".lineQty").val() || 0;
  //     let price = targetRow.find(".colUnitPriceExChange").val() || 0;
  //     const taxDetail = templateObject.taxcodes
  //       .get()
  //       .find((v) => v.CodeName === targetTaxCode);

  //     if (taxDetail) {
  //       let priceTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, ""));
  //       if (taxDetail.Lines) {
  //         taxDetail.Lines.map((line) => {
  //           let taxCode = line.SubTaxCode;
  //           let amount = (priceTotal * line.Percentage) / 100;
  //           if (taxItems[taxCode]) {
  //             taxItems[taxCode] += amount;
  //           } else {
  //             taxItems[taxCode] = amount;
  //           }
  //         });
  //       }
  //     }

  //     array_data.push([
  //       tdproduct,
  //       tddescription,
  //       tdQty,
  //       tdunitprice,
  //       taxamount,
  //       tdlineamt,
  //     ]);

  //     const lineItemObj = {
  //       description: tddescription || "",
  //       quantity: tdQty || 0,
  //       unitPrice: tdunitprice.toLocaleString(undefined, {
  //         minimumFractionDigits: 2,
  //       }) || 0,
  //       tax: tdtaxrate || 0,
  //       amount: tdlineamt || 0,
  //     };
  //     lineItems.push(lineItemObj);
  //   });
  //   let company = localStorage.getItem("vs1companyName");
  //   let vs1User = localStorage.getItem("mySession");
  //   let customerEmail = $("#edtCustomerEmail").val();
  //   let currencyname = CountryAbbr.toLowerCase();
  //   stringQuery = "?";
  //   for (let l = 0; l < lineItems.length; l++) {
  //     stringQuery =
  //       stringQuery +
  //       "product" +
  //       l +
  //       "=" +
  //       lineItems[l].description +
  //       "&price" +
  //       l +
  //       "=" +
  //       lineItems[l].unitPrice +
  //       "&qty" +
  //       l +
  //       "=" +
  //       lineItems[l].quantity +
  //       "&";
  //   }
  //   stringQuery =
  //     stringQuery +
  //     "tax=" +
  //     tax +
  //     "&total=" +
  //     grandTotal +
  //     "&customer=" +
  //     customer +
  //     "&name=" +
  //     name +
  //     "&surname=" +
  //     surname +
  //     "&quoteid=" +
  //     invoice_data.id +
  //     "&transid=" +
  //     stripe_id +
  //     "&feemethod=" +
  //     stripe_fee_method +
  //     "&company=" +
  //     company +
  //     "&vs1email=" +
  //     vs1User +
  //     "&customeremail=" +
  //     customerEmail +
  //     "&type=Invoice&url=" +
  //     window.location.href +
  //     "&server=" +
  //     erpGet.ERPIPAddress +
  //     "&username=" +
  //     erpGet.ERPUsername +
  //     "&token=" +
  //     erpGet.ERPPassword +
  //     "&session=" +
  //     erpGet.ERPDatabase +
  //     "&port=" +
  //     erpGet.ERPPort +
  //     "&dept=" +
  //     dept +
  //     "&currency=" +
  //     currencyname;
  //   if (stripe_id != "") {
  //     $(".linkText").attr("href", stripeGlobalURL + stringQuery);
  //   } else {
  //     $(".linkText").attr("href", "#");
  //   }

  //   if (number == 1) {
  //     item_invoices = {
  //       o_url: localStorage.getItem("vs1companyURL"),
  //       o_name: localStorage.getItem("vs1companyName"),
  //       o_address: localStorage.getItem("vs1companyaddress1"),
  //       o_city: localStorage.getItem("vs1companyCity"),
  //       o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
  //       o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
  //       o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
  //       o_phone: Template.new_invoice.__helpers.get("companyphone").call(),
  //       title: "Invoice",
  //       value: invoice_data.id,
  //       date: dtSODate,
  //       invoicenumber: invoice_data.id,
  //       refnumber: ref,
  //       pqnumber: po,
  //       duedate: duedate,
  //       paylink: "Pay Now",
  //       supplier_type: "Customer",
  //       supplier_name: customer,
  //       supplier_addr: txabillingAddress,
  //       employee_name: invoice_data.employeename,
  //       fields: {
  //         "Product Name": ["25", "left"],
  //         "Description": ["30", "left"],
  //         "Qty": ["10", "right"],
  //         "Unit Price": ["10", "right"],
  //         "Tax": ["10", "right"],
  //         "Amount": ["15", "right"],
  //       },
  //       subtotal: subtotal_total,
  //       gst: subtotal_tax,
  //       total: grandTotal,
  //       paid_amount: total_paid,
  //       bal_due: balancedue,
  //       bsb: Template.new_invoice.__helpers.get("vs1companyBankBSB").call(),
  //       account: Template.new_invoice.__helpers
  //         .get("vs1companyBankAccountNo")
  //         .call(),
  //       swift: Template.new_invoice.__helpers
  //         .get("vs1companyBankSwiftCode")
  //         .call(),
  //       data: array_data,
  //       customfield1: "NA",
  //       customfield2: "NA",
  //       customfield3: "NA",
  //       customfieldlabel1: "NA",
  //       customfieldlabel2: "NA",
  //       customfieldlabel3: "NA",
  //       applied: "",
  //       showFX: "",
  //       comment: comment,
  //     };
  //   } else if (number == 2) {
  //     item_invoices = {
  //       o_url: localStorage.getItem("vs1companyURL"),
  //       o_name: localStorage.getItem("vs1companyName"),
  //       o_address: localStorage.getItem("vs1companyaddress1"),
  //       o_city: localStorage.getItem("vs1companyCity"),
  //       o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
  //       o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
  //       o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
  //       o_phone: Template.new_invoice.__helpers.get("companyphone").call(),
  //       title: "Invoice",
  //       value: invoice_data.id,
  //       date: dtSODate,
  //       invoicenumber: invoice_data.id,
  //       refnumber: ref,
  //       pqnumber: po,
  //       duedate: duedate,
  //       paylink: "Pay Now",
  //       supplier_type: "Customer",
  //       supplier_name: customer,
  //       supplier_addr: txabillingAddress,
  //       fields: {
  //         "Product Name": ["25", "left"],
  //         "Description": ["30", "left"],
  //         "Qty": ["10", "right"],
  //         "Unit Price": ["10", "right"],
  //         "Tax": ["10", "right"],
  //         "Amount": ["15", "right"],
  //       },
  //       subtotal: subtotal_total,
  //       gst: subtotal_tax,
  //       total: grandTotal,
  //       paid_amount: total_paid,
  //       bal_due: balancedue,
  //       bsb: Template.new_invoice.__helpers.get("vs1companyBankBSB").call(),
  //       account: Template.new_invoice.__helpers
  //         .get("vs1companyBankAccountNo")
  //         .call(),
  //       swift: Template.new_invoice.__helpers
  //         .get("vs1companyBankSwiftCode")
  //         .call(),
  //       data: array_data,
  //       customfield1: customfield1,
  //       customfield2: customfield2,
  //       customfield3: customfield3,
  //       customfieldlabel1: customfieldlabel1,
  //       customfieldlabel2: customfieldlabel2,
  //       customfieldlabel3: customfieldlabel3,
  //       applied: "",
  //       showFX: "",
  //       comment: comment,
  //     };
  //   } else {
  //     item_invoices = {
  //       o_url: localStorage.getItem("vs1companyURL"),
  //       o_name: localStorage.getItem("vs1companyName"),
  //       o_address: localStorage.getItem("vs1companyaddress1"),
  //       o_city: localStorage.getItem("vs1companyCity"),
  //       o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
  //       o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
  //       o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
  //       o_phone: Template.new_invoice.__helpers.get("companyphone").call(),
  //       title: "Invoice",
  //       value: invoice_data.id,
  //       date: dtSODate,
  //       invoicenumber: invoice_data.id,
  //       refnumber: ref,
  //       pqnumber: po,
  //       duedate: duedate,
  //       paylink: "Pay Now",
  //       supplier_type: "Customer",
  //       supplier_name: customer,
  //       supplier_addr: txabillingAddress,
  //       fields: {
  //         "Product Name": ["25", "left"],
  //         "Description": ["30", "left"],
  //         "Qty": ["10", "right"],
  //         "Unit Price": ["10", "right"],
  //         "Tax": ["10", "right"],
  //         "Amount": ["15", "right"],
  //       },
  //       subtotal: subtotal_total,
  //       gst: subtotal_tax,
  //       total: grandTotal,
  //       paid_amount: total_paid,
  //       bal_due: balancedue,
  //       bsb: Template.new_invoice.__helpers.get("vs1companyBankBSB").call(),
  //       account: Template.new_invoice.__helpers
  //         .get("vs1companyBankAccountNo")
  //         .call(),
  //       swift: Template.new_invoice.__helpers
  //         .get("vs1companyBankSwiftCode")
  //         .call(),
  //       data: array_data,
  //       customfield1: customfield1,
  //       customfield2: customfield2,
  //       customfield3: customfield3,
  //       customfieldlabel1: customfieldlabel1,
  //       customfieldlabel2: customfieldlabel2,
  //       customfieldlabel3: customfieldlabel3,
  //       applied: "",
  //       showFX: fx,
  //       comment: comment,
  //     };
  //   }

  //   item_invoices.taxItems = taxItems;
  //   if (stripe_id == "") {
  //     item_invoices.paylink = "";
  //   }

  //   object_invoce.push(item_invoices);

  //   $("#templatePreviewModal .field_payment").show();
  //   $("#templatePreviewModal .field_amount").show();

  //   if (bprint == false) {
  //     $("#html-2-pdfwrapper_invoice").css("width", "90%");
  //     $("#html-2-pdfwrapper_invoice2").css("width", "90%");
  //     $("#html-2-pdfwrapper_invoice3").css("width", "90%");
  //   } else {
  //     $("#html-2-pdfwrapper_invoice").css("width", "210mm");
  //     $("#html-2-pdfwrapper_invoice2").css("width", "210mm");
  //     $("#html-2-pdfwrapper_invoice3").css("width", "210mm");
  //   }
  //   if (number == 1) {
  //     updateTemplate1(object_invoce, bprint);
  //   } else if (number == 2) {
  //     updateTemplate2(object_invoce, bprint);
  //   } else {
  //     updateTemplate3(object_invoce, bprint);
  //   }

  //   saveTemplateFields("fields" + template_title, object_invoce[0]["fields"]);
  // }

  templateObject.showInvoiceBack1 = function(template_title, number, bprint) {
    var array_data = [];
    let lineItems = [];
    let object_invoce = [];
    let item_invoices = "";

    let invoice_data = templateObject.invoicerecord.get();
    let stripe_id = templateObject.accountID.get() || "";
    let stripe_fee_method = templateObject.stripe_fee_method.get();
    var erpGet = erpDb();
    var customfield1 = $("#edtSaleCustField1").val() || "  ";
    var customfield2 = $("#edtSaleCustField2").val() || "  ";
    var customfield3 = $("#edtSaleCustField3").val() || "  ";

    var customfieldlabel1 =
      $(".lblCustomField1").first().text() || "Custom Field 1";
    var customfieldlabel2 =
      $(".lblCustomField2").first().text() || "Custom Field 2";
    var customfieldlabel3 =
      $(".lblCustomField3").first().text() || "Custom Field 3";
    let balancedue = $("#totalBalanceDue").html() || 0;
    let tax = $("#subtotal_tax").html() || 0;
    let customer = $("#edtCustomerName").val();
    let name = $("#firstname").val();
    let surname = $("#lastname").val();
    let dept = $("#sltDept").val();
    let fx = $("#sltCurrency").val();
    var comment = $("#txaComment").val();
    var subtotal_tax = $("#subtotal_tax").html() || Currency + 0;
    var total_paid = $("#totalPaidAmt").html() || Currency + 0;
    var ref = $("#edtRef").val() || "-";
    var txabillingAddress = $("#txabillingAddress").val() || "";
    var dtSODate = $("#dtSODate").val();
    var subtotal_total = $("#subtotal_total").text() || Currency + 0;
    var grandTotal = $("#grandTotal").text() || Currency + 0;
    var duedate = $("#dtDueDate").val();
    var po = $("#ponumber").val() || ".";

    $("#tblInvoiceLine > tbody > tr").each(function () {
      var lineID = this.id;
      let tdproduct = $("#" + lineID + " .lineProductName").val();
      let tddescription = $("#" + lineID + " .lineProductDesc").text();
      let tdQty = $("#" + lineID + " .lineQty").val();
      let tdunitprice = $("#" + lineID + " .colUnitPriceExChange").val();
      let tdtaxrate = $("#" + lineID + " .lineTaxRate").text();
      let taxamount = $("#" + lineID + " .colTaxAmount").first().text();
      let tdlineamt = $("#" + lineID + " .colAmountInc").first().text();

      array_data.push([
        tdproduct,
        tddescription,
        tdQty,
        tdunitprice,
        taxamount,
        tdlineamt,
      ]);

      lineItemObj = {
        description: tddescription || "",
        quantity: tdQty || 0,
        unitPrice: tdunitprice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }) || 0,
        tax: tdtaxrate || 0,
        amount: tdlineamt || 0,
      };
      lineItems.push(lineItemObj);
    });

    let company = localStorage.getItem("vs1companyName");
    let vs1User = localStorage.getItem("mySession");
    let customerEmail = $("#edtCustomerEmail").val();
    let currencyname = CountryAbbr.toLowerCase();
    stringQuery = "?";
    for (let l = 0; l < lineItems.length; l++) {
      stringQuery =
        stringQuery +
        "product" +
        l +
        "=" +
        lineItems[l].description +
        "&price" +
        l +
        "=" +
        lineItems[l].unitPrice +
        "&qty" +
        l +
        "=" +
        lineItems[l].quantity +
        "&";
    }
    stringQuery =
      stringQuery +
      "tax=" +
      tax +
      "&total=" +
      grandTotal +
      "&customer=" +
      customer +
      "&name=" +
      name +
      "&surname=" +
      surname +
      "&quoteid=" +
      invoice_data.id +
      "&transid=" +
      stripe_id +
      "&feemethod=" +
      stripe_fee_method +
      "&company=" +
      company +
      "&vs1email=" +
      vs1User +
      "&customeremail=" +
      customerEmail +
      "&type=Invoice&url=" +
      window.location.href +
      "&server=" +
      erpGet.ERPIPAddress +
      "&username=" +
      erpGet.ERPUsername +
      "&token=" +
      erpGet.ERPPassword +
      "&session=" +
      erpGet.ERPDatabase +
      "&port=" +
      erpGet.ERPPort +
      "&dept=" +
      dept +
      "&currency=" +
      currencyname;
    if (stripe_id != "") {
      $(".linkText").attr("href", stripeGlobalURL + stringQuery);
    } else {
      $(".linkText").attr("href", "#");
    }

    if (number == 1) {
      item_invoices = {
        o_url: localStorage.getItem("vs1companyURL"),
        o_name: localStorage.getItem("vs1companyName"),
        o_address: localStorage.getItem("vs1companyaddress1"),
        o_city: localStorage.getItem("vs1companyCity"),
        o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
        o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
        o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
        o_phone: Template.new_invoice.__helpers.get("companyphone").call(),
        title: "Invoice Back Order",
        value: invoice_data.id,
        date: dtSODate,
        invoicenumber: invoice_data.id,
        refnumber: ref,
        pqnumber: po,
        duedate: duedate,
        paylink: "Pay Now",
        supplier_type: "Customer",
        supplier_name: customer,
        supplier_addr: txabillingAddress,
        fields: {
          "Product Name": ["25", "left"],
          "Description": ["30", "left"],
          "Qty": ["10", "right"],
          "Unit Price": ["10", "right"],
          "Tax": ["10", "right"],
          "Amount": ["15", "right"],
        },
        subtotal: subtotal_total,
        gst: subtotal_tax,
        total: grandTotal,
        paid_amount: total_paid,
        bal_due: balancedue,
        bsb: Template.new_invoice.__helpers.get("vs1companyBankBSB").call(),
        account: Template.new_invoice.__helpers
          .get("vs1companyBankAccountNo")
          .call(),
        swift: Template.new_invoice.__helpers
          .get("vs1companyBankSwiftCode")
          .call(),
        data: array_data,
        customfield1: "NA",
        customfield2: "NA",
        customfield3: "NA",
        customfieldlabel1: "NA",
        customfieldlabel2: "NA",
        customfieldlabel3: "NA",
        applied: "",
        showFX: "",
        comment: comment,
      };
    } else if (number == 2) {
      item_invoices = {
        o_url: localStorage.getItem("vs1companyURL"),
        o_name: localStorage.getItem("vs1companyName"),
        o_address: localStorage.getItem("vs1companyaddress1"),
        o_city: localStorage.getItem("vs1companyCity"),
        o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
        o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
        o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
        o_phone: Template.new_invoice.__helpers.get("companyphone").call(),
        title: "Invoice Back Order",
        value: invoice_data.id,
        date: dtSODate,
        invoicenumber: invoice_data.id,
        refnumber: ref,
        pqnumber: po,
        duedate: duedate,
        paylink: "Pay Now",
        supplier_type: "Customer",
        supplier_name: customer,
        supplier_addr: txabillingAddress,
        fields: {
          "Product Name": ["25", "left"],
          "Description": ["30", "left"],
          "Qty": ["10", "right"],
          "Unit Price": ["10", "right"],
          "Tax": ["10", "right"],
          "Amount": ["15", "right"],
        },
        subtotal: subtotal_total,
        gst: subtotal_tax,
        total: grandTotal,
        paid_amount: total_paid,
        bal_due: balancedue,
        bsb: Template.new_invoice.__helpers.get("vs1companyBankBSB").call(),
        account: Template.new_invoice.__helpers
          .get("vs1companyBankAccountNo")
          .call(),
        swift: Template.new_invoice.__helpers
          .get("vs1companyBankSwiftCode")
          .call(),
        data: array_data,
        customfield1: customfield1,
        customfield2: customfield2,
        customfield3: customfield3,
        customfieldlabel1: customfieldlabel1,
        customfieldlabel2: customfieldlabel2,
        customfieldlabel3: customfieldlabel3,
        applied: "",
        showFX: "",
        comment: comment,
      };
    } else {
      item_invoices = {
        o_url: localStorage.getItem("vs1companyURL"),
        o_name: localStorage.getItem("vs1companyName"),
        o_address: localStorage.getItem("vs1companyaddress1"),
        o_city: localStorage.getItem("vs1companyCity"),
        o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
        o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
        o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
        o_phone: Template.new_invoice.__helpers.get("companyphone").call(),
        title: "Invoice Back Order",
        value: invoice_data.id,
        date: dtSODate,
        invoicenumber: invoice_data.id,
        refnumber: ref,
        pqnumber: po,
        duedate: duedate,
        paylink: "Pay Now",
        supplier_type: "Customer",
        supplier_name: customer,
        supplier_addr: txabillingAddress,
        fields: {
          "Product Name": ["25", "left"],
          "Description": ["30", "left"],
          "Qty": ["10", "right"],
          "Unit Price": ["10", "right"],
          "Tax": ["10", "right"],
          "Amount": ["15", "right"],
        },
        subtotal: subtotal_total,
        gst: subtotal_tax,
        total: grandTotal,
        paid_amount: total_paid,
        bal_due: balancedue,
        bsb: Template.new_invoice.__helpers.get("vs1companyBankBSB").call(),
        account: Template.new_invoice.__helpers
          .get("vs1companyBankAccountNo")
          .call(),
        swift: Template.new_invoice.__helpers
          .get("vs1companyBankSwiftCode")
          .call(),
        data: array_data,
        customfield1: customfield1,
        customfield2: customfield2,
        customfield3: customfield3,
        customfieldlabel1: customfieldlabel1,
        customfieldlabel2: customfieldlabel2,
        customfieldlabel3: customfieldlabel3,
        applied: "",
        showFX: fx,
        comment: comment,
      };
    }

    if (stripe_id == "") {
      item_invoices.paylink = "";
    }
    object_invoce.push(item_invoices);

    $("#templatePreviewModal .field_payment").show();
    $("#templatePreviewModal .field_amount").show();

    if (bprint == false) {
      $("#html-2-pdfwrapper").css("width", "90%");
      $("#html-2-pdfwrapper2").css("width", "90%");
      $("#html-2-pdfwrapper3").css("width", "90%");
    } else {
      $("#html-2-pdfwrapper").css("width", "210mm");
      $("#html-2-pdfwrapper2").css("width", "210mm");
      $("#html-2-pdfwrapper3").css("width", "210mm");
    }

    if (number == 1) {
      updateTemplate1(object_invoce, bprint);
    } else if (number == 2) {
      updateTemplate2(object_invoce, bprint);
    } else {
      updateTemplate3(object_invoce, bprint);
    }

    saveTemplateFields("fields" + template_title, object_invoce[0]["fields"]);
    return;
  }

  templateObject.showDeliveryDocket1 = function(template_title, number, bprint) {
    var array_data = [];
    let lineItems = [];
    let object_invoce = [];
    let item_invoices = "";

    let invoice_data = templateObject.invoicerecord.get();
    let stripe_id = templateObject.accountID.get() || "";
    let stripe_fee_method = templateObject.stripe_fee_method.get();
    var erpGet = erpDb();

    var customfield1 = $("#edtSaleCustField1").val() || "  ";
    var customfield2 = $("#edtSaleCustField2").val() || "  ";
    var customfield3 = $("#edtSaleCustField3").val() || "  ";

    var customfieldlabel1 =
      $(".lblCustomField1").first().text() || "Custom Field 1";
    var customfieldlabel2 =
      $(".lblCustomField2").first().text() || "Custom Field 2";
    var customfieldlabel3 =
      $(".lblCustomField3").first().text() || "Custom Field 3";
    let balancedue = $("#totalBalanceDue").html() || 0;
    let tax = $("#subtotal_tax").html() || 0;
    let customer = $("#edtCustomerName").val();
    let name = $("#firstname").val();
    let surname = $("#lastname").val();
    let dept = $("#sltDept").val();
    var comment = $("#txaComment").val();
    var ref = $("#edtRef").val() || "-";
    var txabillingAddress = $("#txabillingAddress").val() || "";
    var dtSODate = $("#dtSODate").val();
    var grandTotal = $("#grandTotal").text() || Currency + 0;
    var duedate = $("#dtDueDate").val();
    var po = $("#ponumber").val() || ".";

    $("#tblInvoiceLine > tbody > tr").each(function () {
      const tdproduct = $(this).find(".lineProductName").val();
      const tddescription = $(this).find('.lineProductDesc').text();
      const tdQty = $(this).find('.lineQty').val();
      const tdunitprice = $(this).find('.colUnitPriceExChange').val();
      const tdtaxrate = $(this).find(".lineTaxRate").val();
      const taxamount = $(this).find('.colTaxAmount').val();
      const tdlineamt = $(this).find(".colAmountInc").text();

      array_data.push([tdproduct, tddescription, tdQty]);

      lineItemObj = {
        description: tddescription || "",
        quantity: tdQty || 0,
        unitPrice: tdunitprice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }) || 0,
        tax: tdtaxrate || 0,
        amount: tdlineamt || 0,
      };
      lineItems.push(lineItemObj);
    });

    let company = localStorage.getItem("vs1companyName");
    let vs1User = localStorage.getItem("mySession");
    let customerEmail = $("#edtCustomerEmail").val();
    let currencyname = CountryAbbr.toLowerCase();
    stringQuery = "?";
    for (let l = 0; l < lineItems.length; l++) {
      stringQuery =
        stringQuery +
        "product" +
        l +
        "=" +
        lineItems[l].description +
        "&price" +
        l +
        "=" +
        lineItems[l].unitPrice +
        "&qty" +
        l +
        "=" +
        lineItems[l].quantity +
        "&";
    }
    stringQuery =
      stringQuery +
      "tax=" +
      tax +
      "&total=" +
      grandTotal +
      "&customer=" +
      customer +
      "&name=" +
      name +
      "&surname=" +
      surname +
      "&quoteid=" +
      invoice_data.id +
      "&transid=" +
      stripe_id +
      "&feemethod=" +
      stripe_fee_method +
      "&company=" +
      company +
      "&vs1email=" +
      vs1User +
      "&customeremail=" +
      customerEmail +
      "&type=Invoice&url=" +
      window.location.href +
      "&server=" +
      erpGet.ERPIPAddress +
      "&username=" +
      erpGet.ERPUsername +
      "&token=" +
      erpGet.ERPPassword +
      "&session=" +
      erpGet.ERPDatabase +
      "&port=" +
      erpGet.ERPPort +
      "&dept=" +
      dept +
      "&currency=" +
      currencyname;
    if (stripe_id != "") {
      $(".linkText").attr("href", stripeGlobalURL + stringQuery);
    } else {
      $(".linkText").attr("href", "#");
    }

    if (number == 1) {
      item_invoices = {
        o_url: localStorage.getItem("vs1companyURL"),
        o_name: localStorage.getItem("vs1companyName"),
        o_address: localStorage.getItem("vs1companyaddress1"),
        o_city: localStorage.getItem("vs1companyCity"),
        o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
        o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
        o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
        o_phone: Template.new_invoice.__helpers.get("companyphone").call(),
        title: "Delivery Docket",
        value: invoice_data.id,
        date: dtSODate,
        invoicenumber: invoice_data.id,
        refnumber: ref,
        pqnumber: po,
        duedate: duedate,
        paylink: "Pay Now",
        supplier_type: "Customer",
        supplier_name: customer,
        supplier_addr: txabillingAddress,
        fields: {
          "Product Name": ["40", "left"],
          "Description": ["40", "left"],
          "Qty": ["20", "right"]
        },
        subtotal: "",
        gst: "",
        total: "",
        paid_amount: "",
        bal_due: "",
        bsb: "",
        account: "",
        swift: "",
        data: array_data,
        customfield1: "NA",
        customfield2: "NA",
        customfield3: "NA",
        customfieldlabel1: "NA",
        customfieldlabel2: "NA",
        customfieldlabel3: "NA",
        applied: "",
        showFX: "",
        comment: comment,
      };
    } else if (number == 2) {
      item_invoices = {
        o_url: localStorage.getItem("vs1companyURL"),
        o_name: localStorage.getItem("vs1companyName"),
        o_address: localStorage.getItem("vs1companyaddress1"),
        o_city: localStorage.getItem("vs1companyCity"),
        o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
        o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
        o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
        o_phone: Template.new_invoice.__helpers.get("companyphone").call(),
        title: "Delivery Docket",
        value: invoice_data.id,
        date: dtSODate,
        invoicenumber: invoice_data.id,
        refnumber: ref,
        pqnumber: po,
        duedate: duedate,
        paylink: "Pay Now",
        supplier_type: "Customer",
        supplier_name: customer,
        supplier_addr: txabillingAddress,
        fields: {
          "Product Name": ["40", "left"],
          "Description": ["40", "left"],
          "Qty": ["20", "right"]
        },
        subtotal: "",
        gst: "",
        total: "",
        paid_amount: "",
        bal_due: "",
        bsb: "",
        account: "",
        swift: "",
        data: array_data,
        customfield1: customfield1,
        customfield2: customfield2,
        customfield3: customfield3,
        customfieldlabel1: customfieldlabel1,
        customfieldlabel2: customfieldlabel2,
        customfieldlabel3: customfieldlabel3,
        applied: "",
        showFX: "",
        comment: comment,
      };
    } else {
      item_invoices = {
        o_url: localStorage.getItem("vs1companyURL"),
        o_name: localStorage.getItem("vs1companyName"),
        o_address: localStorage.getItem("vs1companyaddress1"),
        o_city: localStorage.getItem("vs1companyCity"),
        o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
        o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
        o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
        o_phone: Template.new_invoice.__helpers.get("companyphone").call(),
        title: "Delivery Docket",
        value: invoice_data.id,
        date: dtSODate,
        invoicenumber: invoice_data.id,
        refnumber: ref,
        pqnumber: po,
        duedate: duedate,
        paylink: "Pay Now",
        supplier_type: "Customer",
        supplier_name: customer,
        supplier_addr: txabillingAddress,
        fields: {
          "Product Name": ["40", "left"],
          "Description": ["40", "left"],
          "Qty": ["20", "right"]
        },
        subtotal: "",
        gst: "",
        total: "",
        paid_amount: "",
        bal_due: "",
        bsb: "",
        account: "",
        swift: "",
        data: array_data,
        customfield1: customfield1,
        customfield2: customfield2,
        customfield3: customfield3,
        customfieldlabel1: customfieldlabel1,
        customfieldlabel2: customfieldlabel2,
        customfieldlabel3: customfieldlabel3,
        applied: "",
        showFX: "",
        comment: comment,
      };
    }

    if (stripe_id == "") {
      item_invoices.paylink = "";
    }

    object_invoce.push(item_invoices);

    $("#templatePreviewModal .field_payment").show();
    $("#templatePreviewModal .field_amount").show();

    if (bprint == false) {
      $("#html-2-pdfwrapper_invoice").css("width", "90%");
      $("#html-2-pdfwrapper_invoice2").css("width", "90%");
      $("#html-2-pdfwrapper_invoice3").css("width", "90%");
    } else {
      $("#html-2-pdfwrapper_invoice").css("width", "210mm");
      $("#html-2-pdfwrapper_invoice2").css("width", "210mm");
      $("#html-2-pdfwrapper_invoice3").css("width", "210mm");
    }

    if (number == 1) {
      updateTemplate1(object_invoce, bprint);
    } else if (number == 2) {
      updateTemplate2(object_invoce, bprint);
    } else {
      updateTemplate3(object_invoce, bprint);
    }

    saveTemplateFields("fields" + template_title, object_invoce[0]["fields"]);
  }

  templateObject.generateInvoiceData = function (template_title, number) {
    object_invoce = [];
    switch (template_title) {
      case "Invoices":
        templateObject.showInvoice1(template_title, number, false);
        break;

      case "Invoice Back Orders":
        templateObject.showInvoiceBack1(template_title, number, false);
        break;

      case "Delivery Docket":
        templateObject.showDeliveryDocket1(template_title, number, false);
        break;
    }
  };

  templateObject.getAllTaxCodes = function () {
    const splashArrayTaxRateList = [];
    const taxCodesList = [];
    getVS1Data("TTaxcodeVS1")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          salesService.getTaxCodesDetailVS1().then(function (data) {
            const taxCodes = data.ttaxcodevs1;
            templateObject.taxcodes.set(taxCodes);
            for (let i = 0; i < data.ttaxcodevs1.length; i++) {
              let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
              let dataList = [
                data.ttaxcodevs1[i].Id || "",
                data.ttaxcodevs1[i].CodeName || "",
                data.ttaxcodevs1[i].Description || "-",
                taxRate || 0,
              ];

              let taxcoderecordObj = {
                codename: data.ttaxcodevs1[i].CodeName || " ",
                coderate: taxRate || " ",
              };
              taxCodesList.push(taxcoderecordObj);
              splashArrayTaxRateList.push(dataList);
            }
            templateObject.taxraterecords.set(taxCodesList);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.ttaxcodevs1;
          const taxCodes = data.ttaxcodevs1;
          templateObject.taxcodes.set(taxCodes);
          for (let i = 0; i < useData.length; i++) {
            let taxRate = (useData[i].Rate * 100).toFixed(2);
            var dataList = [
              useData[i].Id || "",
              useData[i].CodeName || "",
              useData[i].Description || "-",
              taxRate || 0,
            ];

            let taxcoderecordObj = {
              codename: useData[i].CodeName || " ",
              coderate: taxRate || " ",
            };
            taxCodesList.push(taxcoderecordObj);
            splashArrayTaxRateList.push(dataList);
          }
          templateObject.taxraterecords.set(taxCodesList);
        }
      })
      .catch(function () {
        salesService.getTaxCodesDetailVS1().then(function (data) {
          taxCodes = data.ttaxcodevs1;
          templateObject.taxcodes.set(taxCodes);
          for (let i = 0; i < data.ttaxcodevs1.length; i++) {
            let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
            var dataList = [
              data.ttaxcodevs1[i].Id || "",
              data.ttaxcodevs1[i].CodeName || "",
              data.ttaxcodevs1[i].Description || "-",
              taxRate || 0,
            ];
            splashArrayTaxRateList.push(dataList);
          }
          templateObject.taxraterecords.set(taxCodesList);
        });
      });
  };

  templateObject.getSubTaxCodes = function () {
    let subTaxTableList = [];
    getVS1Data("TSubTaxVS1")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          taxRateService.getSubTaxCode().then(function (data) {
            for (let i = 0; i < data.tsubtaxcode.length; i++) {
              var dataList = {
                id: data.tsubtaxcode[i].Id || "",
                codename: data.tsubtaxcode[i].Code || "-",
                description: data.tsubtaxcode[i].Description || "-",
                category: data.tsubtaxcode[i].Category || "-",
              };
              subTaxTableList.push(dataList);
            }
            templateObject.subtaxcodes.set(subTaxTableList);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tsubtaxcode;
          for (let i = 0; i < useData.length; i++) {
            var dataList = {
              id: useData[i].Id || "",
              codename: useData[i].Code || "-",
              description: useData[i].Description || "-",
              category: useData[i].Category || "-",
            };
            subTaxTableList.push(dataList);
          }
          templateObject.subtaxcodes.set(subTaxTableList);
        }
      })
      .catch(function (err) {
        taxRateService.getSubTaxCode().then(function (data) {
          for (let i = 0; i < data.tsubtaxcode.length; i++) {
            var dataList = {
              id: data.tsubtaxcode[i].Id || "",
              codename: data.tsubtaxcode[i].Code || "-",
              description: data.tsubtaxcode[i].Description || "-",
              category: data.tsubtaxcode[i].Category || "-",
            };
            subTaxTableList.push(dataList);
          }
          templateObject.subtaxcodes.set(subTaxTableList);
        });
      });
  };

  // in this function, we'll handle the new line to add
  templateObject.addInvoiceLine = async (event) => {
    // get all lines first
    let lines = await this.invoiceLines.get();
    // then open the product modal
  }

  templateObject.generatePdfForMail = async (invoiceId) => {
    let stripe_id = templateObject.accountID.get() || "";
    let file = "Invoice-" + invoiceId + ".pdf";
    let stringQuery = '?';
    return new Promise((resolve, reject) => {
      var source = document.getElementById("html-2-pdfwrapper_invoice");
      var opt = {
        margin: 0,
        filename: file,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      };
      resolve(
        html2pdf().set(opt).from(source).toPdf().output("datauristring")
      );
    });
  }


  templateObject.getEmailBody = (objDetails)=> {
    let invoiceId = objDetails.fields.ID;
    let erpInvoiceId = objDetails.fields.ID;
    let mailFromName = localStorage.getItem("vs1companyName");
    let mailFrom = localStorage.getItem("VS1OrgEmail") || localStorage.getItem("VS1AdminUserName");
    let customerEmailName = $("#edtCustomerName").val();
    let checkEmailData = $("#edtCustomerEmail").val();
    let grandtotal = $("#grandTotal").html();
    let emailDueDate = $("#dtDueDate").val();
    let customerBillingAddress = $("#txabillingAddress").val();
    let customerTerms = $("#sltTerms").val();

    let customerSubtotal = $("#subtotal_total").html();
    let customerTax = $("#subtotal_tax").html();
    let customerNett = $("#subtotal_nett").html();
    let customerTotal = $("#grandTotal").html();

    const stringQuery = "";
    const stripeGlobalURL = ""
    return generateHtmlMailBody(erpInvoiceId, emailDueDate, grandtotal, stripeGlobalURL, stringQuery, customerEmailName, mailFromName, customerBillingAddress, customerTerms, customerSubtotal, customerTax, customerNett, customerTotal)
  }


  templateObject.addAttachment = async (objDetails, isforced = false) => {
    let attachment = [];
    let invoiceId = objDetails.fields.ID;
    let encodedPdf = await templateObject.generatePdfForMail(invoiceId);
    let base64data = encodedPdf.split(",")[1];
    let pdfObject = {
      filename: "invoice-" + invoiceId + ".pdf",
      content: base64data,
      encoding: "base64",
    };
    attachment.push(pdfObject);
    let erpInvoiceId = objDetails.fields.ID;

    let mailFromName = localStorage.getItem("vs1companyName");
    let mailFrom = localStorage.getItem("VS1OrgEmail") || localStorage.getItem("VS1AdminUserName");
    let customerEmailName = $("#edtCustomerName").val();
    let checkEmailData = $("#edtCustomerEmail").val();
    let grandtotal = $("#grandTotal").html();
    let emailDueDate = $("#dtDueDate").val();
    let customerBillingAddress = $("#txabillingAddress").val();
    let customerTerms = $("#sltTerms").val();

    let customerSubtotal = $("#subtotal_total").html();
    let customerTax = $("#subtotal_tax").html();
    let customerNett = $("#subtotal_nett").html();
    let customerTotal = $("#grandTotal").html();

    const stringQuery = "";
    const stripeGlobalURL = ""

    let mailSubject = "Invoice " + erpInvoiceId + " from " + mailFromName + " for " + customerEmailName;
    var htmlmailBody = generateHtmlMailBody(erpInvoiceId, emailDueDate, grandtotal, stripeGlobalURL, stringQuery, customerEmailName, mailFromName, customerBillingAddress, customerTerms, customerSubtotal, customerTax, customerNett, customerTotal)
      

    if (
      $(".chkEmailCopy").is(":checked") &&
      $(".chkEmailRep").is(":checked")
    ) {
      Meteor.call(
        "sendEmail", {
        from: "" + mailFromName + " <" + mailFrom + ">",
        to: checkEmailData,
        subject: mailSubject,
        text: "",
        html: htmlmailBody,
        attachments: attachment,
      },
        function (error, result) {
          if (error && error.error === "error") {
          } else {
            $("#html-Invoice-pdfwrapper").css("display", "none");
            swal({
              title: "SUCCESS",
              text: "Email Sent To Customer: " + checkEmailData + " ",
              type: "success",
              showCancelButton: false,
              confirmButtonText: "OK",
            }).then((result) => {
            });
          }
        }
      );

      Meteor.call(
        "sendEmail", {
        from: "" + mailFromName + " <" + mailFrom + ">",
        to: mailFrom,
        subject: mailSubject,
        text: "",
        html: htmlmailBody,
        attachments: attachment,
      },
        function (error, result) {
          if (error && error.error === "error") {

          } else {
            $("#html-Invoice-pdfwrapper").css("display", "none");
            swal({
              title: "SUCCESS",
              text: "Email Sent To Customer: " +
                checkEmailData +
                " and User: " +
                mailFrom +
                "",
              type: "success",
              showCancelButton: false,
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.value) {
                window.open(url, "_self");
              } else if (result.dismiss === "cancel") { }
            });
          }
        }
      );
    } else if ($(".chkEmailCopy").is(":checked") || isforced) {
      Meteor.call(
        "sendEmail", {
        from: "" + mailFromName + " <" + mailFrom + ">",
        to: checkEmailData,
        subject: mailSubject,
        text: "",
        html: htmlmailBody,
        attachments: attachment,
      },
        function (error, result) {
          if (error && error.error === "error") {
          } else {
            $("#html-Invoice-pdfwrapper").css("display", "none");
            swal({
              title: "SUCCESS",
              text: "Email Sent To Customer: " + checkEmailData + " ",
              type: "success",
              showCancelButton: false,
              confirmButtonText: "OK",
            }).then((result) => {
            });
          }
        }
      );
    } else if ($(".chkEmailRep").is(":checked")) {
      Meteor.call(
        "sendEmail", {
        from: "" + mailFromName + " <" + mailFrom + ">",
        to: mailFrom,
        subject: mailSubject,
        text: "",
        html: htmlmailBody,
        attachments: attachment,
      },
        function (error, result) {
          if (error && error.error === "error") {
          } else {
            $("#html-Invoice-pdfwrapper").css("display", "none");
            swal({
              title: "SUCCESS",
              text: "Email Sent To User: " + mailFrom + " ",
              type: "success",
              showCancelButton: false,
              confirmButtonText: "OK",
            });
          }
        }
      );
    } else {
      // window.open(url, "_self");
    }
  }

  templateObject.sendEmail = async (isforced = false) => {
    return new Promise((resolve, reject)=> {
      var splashLineArray = new Array();
      let lineItemsForm = [];
      let lineItems = [];
      let lineItemObjForm = {};
      var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
      let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) +"-" + saledateTime.getDate();
      let checkBackOrder = templateObject.includeBOnShippedQty.get();
      $("#tblInvoiceLine > tbody > tr").each(function () {
        var lineID = this.id;
        const tdproduct = $(this).find(".lineProductName").val();
        const tddescription = $(this).find('.lineProductDesc').text();
        const tdQty = $(this).find('.lineQty').val();
        const tdOrderd = $(this).find(".lineOrdered").val();
        const tdunitprice = $(this).find('.colUnitPriceExChange').val();
        const tdtaxCode = $(this).find(".lineTaxCode").val();
        const tdtaxrate = $(this).find(".lineTaxRate").val();
        const tdlineUnit = $(this).find(".lineUOM").text() || defaultUOM;
        const taxamount = $(this).find('.colTaxAmount').val();
        const tdlineamt = $(this).find(".colAmountInc").text();
        const tdSalesLineCustField1 = $(this).find(".lineSalesLinesCustField1").val();
  
        const lineItemObj = {
          description: tddescription || "",
          quantity: tdQty || 0,
          unitPrice: tdunitprice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }) || 0,
        };
  
        lineItems.push(lineItemObj);
  
        if (tdproduct != "") {
          if (checkBackOrder == true) {
            lineItemObjForm = {
              type: "TInvoiceLine",
              fields: {
                ProductName: tdproduct || "",
                ProductDescription: tddescription || "",
                UOMQtySold: parseFloat(tdOrderd) || 0,
                UOMQtyShipped: parseFloat(tdQty) || 0,
                LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                Headershipdate: saleDate,
                LineTaxCode: tdtaxCode || "",
                DiscountPercent: parseFloat($(this).find(".lineDiscount").val()) || 0,
                UnitOfMeasure: tdlineUnit,
                SalesLinesCustField1: tdSalesLineCustField1,
              },
            };
          } else {
            lineItemObjForm = {
              type: "TInvoiceLine",
              fields: {
                ProductName: tdproduct || "",
                ProductDescription: tddescription || "",
                UOMQtySold: parseFloat(tdQty) || 0,
                UOMQtyShipped: parseFloat(tdQty) || 0,
                LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                Headershipdate: saleDate,
                LineTaxCode: tdtaxCode || "",
                DiscountPercent: parseFloat($(this).find(".lineDiscount").val()) || 0,
                UnitOfMeasure: tdlineUnit,
                SalesLinesCustField1: tdSalesLineCustField1,
              },
            };
          }
  
          lineItemsForm.push(lineItemObjForm);
          splashLineArray.push(lineItemObjForm);
        }
      });
      if ($("#formCheck-one").is(":checked")) {
        getchkcustomField1 = false;
      }
      if ($("#formCheck-two").is(":checked")) {
        getchkcustomField2 = false;
      }
  
      let customer = $("#edtCustomerName").val();
  
      let poNumber = $("#ponumber").val();
      let reference = $("#edtRef").val();
  
      let departement = $("#sltDept").val();
      let shippingAddress = $("#txaShipingInfo").val();
      let comments = $("#txaComment").val();
      let pickingInfrmation = $("#txapickmemo").val();
      let saleCustField1 = $("#edtSaleCustField1").val() || "";
      let saleCustField2 = $("#edtSaleCustField2").val() || "";
      let saleCustField3 = $("#edtSaleCustField3").val() || "";
      const billingAddress  = $("#txabillingAddress").val();
      var url = FlowRouter.current().path;
      var getso_id = url.split("?id=");
      var currentInvoice = getso_id[getso_id.length - 1];
      let uploadedItems = templateObject.uploadedFiles.get();
      var currencyCode = $("#sltCurrency").val() || CountryAbbr;
      let ForeignExchangeRate = $('#exchange_rate').val() || 0;
      var objDetails = "";
      let termname = $('#sltTerms').val() || '';
      if (termname === '') {
        swal('Terms has not been selected!', '', 'warning');
        event.preventDefault();
        return false;
      }
      if (getso_id[1]) {
        currentInvoice = parseInt(currentInvoice);
        objDetails = {
          type: "TInvoiceEx",
          fields: {
            ID: currentInvoice,
            CustomerName: customer,
            ForeignExchangeCode: currencyCode,
            ForeignExchangeRate: parseFloat(ForeignExchangeRate),
            Lines: splashLineArray,
            InvoiceToDesc: billingAddress,
            SaleDate: saleDate,
            CustPONumber: poNumber,
            ReferenceNo: reference,
            TermsName: termname,
            SaleClassName: departement,
            ShipToDesc: shippingAddress,
            Comments: comments,
            SaleCustField1: saleCustField1,
            SaleCustField2: saleCustField2,
            SaleCustField3: saleCustField3,
            PickMemo: pickingInfrmation,
            Attachments: uploadedItems,
            SalesStatus: $("#sltStatus").val(),
          },
        };
      } else {
        objDetails = {
          type: "TInvoiceEx",
          fields: {
            CustomerName: customer,
            ForeignExchangeCode: currencyCode,
            ForeignExchangeRate: parseFloat(ForeignExchangeRate),
            Lines: splashLineArray,
            InvoiceToDesc: billingAddress,
            SaleDate: saleDate,
            CustPONumber: poNumber,
            ReferenceNo: reference,
            TermsName: termname,
            SaleClassName: departement,
            ShipToDesc: shippingAddress,
            Comments: comments,
            SaleCustField1: saleCustField1,
            SaleCustField2: saleCustField2,
            SaleCustField3: saleCustField3,
            PickMemo: pickingInfrmation,
            Attachments: uploadedItems,
            SalesStatus: $("#sltStatus").val(),
          },
        };
      }
      resolve(objDetails)
    })
    
  }
  
  // templateObject.print = async (_template = '') => {
  //   LoadingOverlay.show();
  //   setTimeout(async function () {
  //     var printTemplate = [];
  //     $("#html-2-pdfwrapper").css("display", "block");
  //     var invoices = $('input[name="Invoices"]:checked').val();
  //     var invoices_back_order = $(
  //       'input[name="Invoice Back Orders"]:checked'
  //     ).val();
  //     var delivery_docket = $('input[name="Delivery Docket"]:checked').val();
  //     let emid = localStorage.getItem("mySessionEmployeeLoggedID");

  //     if(_template !== ''){
  //       const _templateNumber = $(`input[name="${_template}"]:checked`).val();
  //       await templateObject.exportSalesToPdf(_template, _templateNumber);
  //       return;
  //     }

  //     $(".pdfCustomerName").html($("#edtCustomerName").val());
  //     $(".pdfCustomerAddress").html(
  //       $("#txabillingAddress")
  //         .val()
  //         .replace(/[\r\n]/g, "<br />")
  //     );
  //     $("#printcomment").html(
  //       $("#txaComment")
  //         .val()
  //         .replace(/[\r\n]/g, "<br />")
  //     );
  //     var ponumber = $("#ponumber").val() || ".";
  //     $(".po").text(ponumber);

  //     var invoice_type = FlowRouter.current().queryParams.type;
  //     if (invoice_type == "bo") {
  //       if (
  //         $("#print_Invoices_back_orders").is(":checked") ||
  //         $("#print_Invoices_back_orders_second").is(":checked")
  //       ) {
  //         printTemplate.push("Invoice Back Orders");
  //       }
  //     } else {
  //       if (
  //         $("#print_invoice").is(":checked") ||
  //         $("#print_invoice_second").is(":checked")
  //       ) {
  //         printTemplate.push("Invoices");
  //       }
  //       if (
  //         $("#print_delivery_docket").is(":checked") ||
  //         $("#print_delivery_docket_second").is(":checked")
  //       ) {
  //         printTemplate.push("Delivery Docket");
  //       }
  //     }

  //     if(printTemplate.length === 0) {
  //       printTemplate.push("Invoices");
  //     }

  //     var template_number = 1;
  //     if (printTemplate.length > 0) {
  //       for (var i = 0; i < printTemplate.length; i++) {
  //         if (printTemplate[i] == "Invoices") {
  //           template_number = $("input[name=Invoices]:checked").val();
  //         } else if (printTemplate[i] == "Delivery Docket") {
  //           template_number = $(
  //             'input[name="Delivery Docket"]:checked'
  //           ).val();
  //         } else if (printTemplate[i] == "Invoice Back Orders") {
  //           template_number = $(
  //             'input[name="Invoice Back Orders"]:checked'
  //           ).val();
  //         } else { }

  //         let result = await templateObject.exportSalesToPdf(
  //           printTemplate[i],
  //           template_number
  //         );
  //         if (result == true) { }
  //       }
  //     }
  //     const isCheckedEmail = $("#printModal").find("#emailSend").is(":checked");
  //     if(isCheckedEmail){
  //       if ($("#edtCustomerEmail").val() != "") {
  //         await templateObject.sendEmail();
  //       } else {
  //         swal({
  //           title: "Customer Email Required",
  //           text: "Please enter customer email",
  //           type: "error",
  //           showCancelButton: false,
  //           confirmButtonText: "OK",
  //         }).then((result) => {
  //           if (result.value) { } else if (result.dismiss === "cancel") { }
  //         });
  //       }
  //     }
  //     $("#printModal").modal('hide');
  //     LoadingOverlay.hide();

  //   }, delayTimeAfterSound);
  // }


  templateObject.exportSalesToPdf = function (template_title, number) {
    if (template_title == "Invoices") {
      templateObject.showInvoice1(template_title, number, true);
    } else if (template_title == "Delivery Docket") {
      templateObject.showDeliveryDocket1(template_title, number, true);
    } else if (template_title == "Invoice Back Orders") {
      templateObject.showInvoiceBack1(template_title, number, true);
    } else { }

    let invoice_data_info = templateObject.invoicerecord.get();
    var source;
    if (number == 1) {
      $("#html-2-pdfwrapper_invoice").show();
      $("#html-2-pdfwrapper_invoice2").hide();
      $("#html-2-pdfwrapper_invoice3").hide();
      source = document.getElementById("html-2-pdfwrapper_invoice");
    } else if (number == 2) {
      $("#html-2-pdfwrapper_invoice").hide();
      $("#html-2-pdfwrapper_invoice2").show();
      $("#html-2-pdfwrapper_invoice3").hide();
      source = document.getElementById("html-2-pdfwrapper_invoice2");
    } else {
      $("#html-2-pdfwrapper_invoice").hide();
      $("#html-2-pdfwrapper_invoice2").hide();
      $("#html-2-pdfwrapper_invoice3").show();
      source = document.getElementById("html-2-pdfwrapper_invoice3");
    }
    let file = "Invoice.pdf";
    if (
      $(".printID").attr("id") != undefined ||
      $(".printID").attr("id") != ""
    ) {
      if (template_title == "Invoices") {
        file = "Invoice-" + invoice_data_info.id + ".pdf";
      } else if (template_title == "Invoice Back Orders") {
        file = "Invoice Back Orders-" + invoice_data_info.id + ".pdf";
      } else if (template_title == "Delivery Docket") {
        file = "Delivery Docket-" + invoice_data_info.id + ".pdf";
      }
    }

    var opt = {
      margin: 0,
      filename: file,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf()
      .set(opt)
      .from(source)
      .save()
      .then(function () {
        $("#html-2-pdfwrapper_new").css("display", "none");
        $("#html-2-pdfwrapper_invoice").css("display", "none");
        $("#html-2-pdfwrapper_invoice2").css("display", "none");
        $("#html-2-pdfwrapper_invoice3").css("display", "none");
        $("#printModal").modal('hide');
        LoadingOverlay.hide();
      });
    return true;
  };

  

});

Template.invoice_temp.onRendered(function () {

  $(".fullScreenSpin").css("display", "inline-block");
  const templateObject = Template.instance();

  let currentInvoice;
  let getso_id;

  // templateObject.initPage();

  templateObject.getAllTaxCodes();
  templateObject.getSubTaxCodes();

  // templateObject.getAllClients();
  // templateObject.getOrganisationDetails();
  // templateObject.getAllLeadStatuss();
  // templateObject.getDepartments();
  // templateObject.getTerms();

  if (
    FlowRouter.current().queryParams.id ||
    FlowRouter.current().queryParams.customerid
  ) {
    templateObject.getAllSelectPaymentData();
  } else {
    $("#sltTerms").val(templateObject.defaultsaleterm.get() || "");
  }

  $('#edtFrequencyDetail').css('display', 'none');
  $("#date-input,#edtWeeklyStartDate,#edtWeeklyFinishDate,#dtDueDate,#customdateone,#edtMonthlyStartDate,#edtMonthlyFinishDate,#edtDailyStartDate,#edtDailyFinishDate,#edtOneTimeOnlyDate").datepicker({
    showOn: 'button',
    buttonText: 'Show Date',
    buttonImageOnly: true,
    buttonImage: '/img/imgCal2.png',
    constrainInput: false,
    dateFormat: 'd/mm/yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });

  $("#serialNumberModal .btnSelect").removeClass("d-none");
  $("#serialNumberModal .btnAutoFill").addClass("d-none");
  $("#choosetemplate").attr("checked", true);
  var invoice_type = FlowRouter.current().queryParams.type;

  if (invoice_type == "bo") {
    localStorage.setItem("invoice_type", "bo");
  } else {
    localStorage.setItem("invoice_type", "invoice");
  }

  if (localStorage.getItem("invoice_type") == "bo") {
    $(".Invoices").css("display", "none");
    $(".Docket").css("display", "none");
    $(".add_dy .coltr").removeClass("col-md-6");
  } else {
    $(".Invoices").css("display", "block");
    $(".Docket").css("display", "block");
    $(".Invoice").css("display", "none");
    $(".add_dy .coltr").addClass("col-md-6");
  }

  $(window).on("load", function () {
    const win = $(this); //this = window
    if (win.width() <= 1024 && win.width() >= 450) {
      $("#colBalanceDue").addClass("order-12");
    }
    if (win.width() <= 926) {
      $("#totalSection").addClass("offset-md-6");
    }
  });

  let imageData = localStorage.getItem("Image");

  if (imageData) {
    $(".uploadedImage").attr("src", imageData);
  }

  let isBOnShippedQty = localStorage.getItem("CloudSalesQtyOnly")||false;
  if(JSON.parse(isBOnShippedQty)) {
    templateObject.includeBOnShippedQty.set(false);
  }

  $("#date-input,#dtSODate,#dtDueDate,#customdateone").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonImageOnly: true,
    buttonImage: "/img/imgCal2.png",
    constrainInput: false,
    dateFormat: "d/mm/yy",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });

  /**
   * This if else clause is sucks, should updated.
   */
  let url = FlowRouter.current().path;

  
  if (
    $(".printID").attr("id") == undefined ||
    $(".printID").attr("id") != undefined ||
    $(".printID").attr("id") != ""
  ) {
    var duedate = new Date();
    let dueDate =
      ("0" + duedate.getDate()).slice(-2) +
      "/" +
      ("0" + (duedate.getMonth() + 1)).slice(-2) +
      "/" +
      duedate.getFullYear();
    $(".due").text(dueDate);
  }

  /* On Click TaxCode List */
  $(document).on("click", "#tblTaxRate tbody tr", function (e) {
    let selectLineID = $("#selectLineID").val();
    let taxcodeList = templateObject.taxraterecords.get();
    var table = $(this);
    let utilityService = new UtilityService();
    let $tblrows = $("#tblInvoiceLine tbody tr");
    var $printrows = $(".invoice_print tbody tr");

    if (selectLineID) {
      let lineTaxCode = table.find(".taxName").text();
      let lineTaxRate = table.find(".taxRate").text();
      let subGrandTotal = 0;
      let taxGrandTotal = 0;
      let subDiscountTotal = 0; // New Discount
      let taxGrandTotalPrint = 0;

      $("#" + selectLineID + " .lineTaxRate").text(lineTaxRate || 0);
      $("#" + selectLineID + " .lineTaxCode").val(lineTaxCode);
      if (
        $(".printID").attr("id") != undefined ||
        $(".printID").attr("id") != ""
      ) {
        $("#" + selectLineID + " #lineTaxCode").text(lineTaxCode);
      }

      $("#taxRateListModal").modal("toggle");
      let subGrandTotalNet = 0;
      let taxGrandTotalNet = 0;
      $tblrows.each(function (index) {
        var $tblrow = $(this);
        let tdproduct = $tblrow.find(".lineProductName").val() || "";
        if (tdproduct != "") {
          var qty = $tblrow.find(".lineQty").val() || 0;
          var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
          var taxRate = $tblrow.find(".lineTaxCode").val();

          var taxrateamount = 0;
          if (taxcodeList) {
            for (var i = 0; i < taxcodeList.length; i++) {
              if (taxcodeList[i].codename == taxRate) {
                taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
              }
            }
          }

          var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
          var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
          var lineDiscountPerc = parseFloat($tblrow.find(".lineDiscount").val()) || 0; // New Discount
          let lineTotalAmount = subTotal + taxTotal;

          let lineDiscountTotal = lineDiscountPerc / 100;

          var discountTotal = lineTotalAmount * lineDiscountTotal;
          var subTotalWithDiscount = subTotal * lineDiscountTotal || 0;
          var subTotalWithDiscountTotalLine = subTotal - subTotalWithDiscount || 0;
          var taxTotalWithDiscount = taxTotal * lineDiscountTotal || 0;
          var taxTotalWithDiscountTotalLine = taxTotal - taxTotalWithDiscount;
          if (!isNaN(discountTotal)) {
            subDiscountTotal += isNaN(discountTotal) ? 0 : discountTotal;
            document.getElementById("subtotal_discount").innerHTML =
              utilityService.modifynegativeCurrencyFormat(subDiscountTotal);
          }
          $tblrow
            .find(".lineTaxAmount")
            .text(
              utilityService.modifynegativeCurrencyFormat(
                taxTotalWithDiscountTotalLine
              )
            );

          let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) || 0;
          let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
          let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc || 0;
          $tblrow
            .find(".colUnitPriceExChange")
            .val(
              utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal)
            );
          $tblrow
            .find(".colUnitPriceIncChange")
            .val(
              utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal)
            );

          if (!isNaN(subTotal)) {
            $tblrow
              .find(".colAmountEx")
              .text(utilityService.modifynegativeCurrencyFormat(subTotal));
            $tblrow
              .find(".colAmountInc")
              .text(
                utilityService.modifynegativeCurrencyFormat(lineTotalAmount)
              );
            subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ? 0 : subTotalWithDiscountTotalLine;
            subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
            document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
          }

          if (!isNaN(taxTotal)) {
            taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
            taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
            document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
          }

          if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
            let GrandTotal = parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
            let GrandTotalNet = parseFloat(subGrandTotalNet) + parseFloat(taxGrandTotalNet);
            document.getElementById("subtotal_nett").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
            document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
            document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
            document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
          }
        }
      });

      $printrows.each(function () {
        var $printrows = $(this);
        var qty = $printrows.find("#lineQty").text() || 0;
        var price = $printrows.find("#lineUnitPrice").text() || "0";
        var taxrateamount = 0;
        var taxRate = $printrows.find("#lineTaxCode").text();
        if (taxcodeList) {
          for (var i = 0; i < taxcodeList.length; i++) {
            if (taxcodeList[i].codename == taxRate) {
              taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
            }
          }
        }
        var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
        $printrows
          .find("#lineTaxAmount")
          .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
        if (!isNaN(subTotal)) {
          $printrows
            .find("#lineAmt")
            .text(utilityService.modifynegativeCurrencyFormat(subTotal));
          subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
          document.getElementById("subtotal_totalPrint").innerHTML = $("#subtotal_total").text();
        }

        if (!isNaN(taxTotal)) {
          taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
          document.getElementById("totalTax_totalPrint").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
        }
        if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
          document.getElementById("grandTotalPrint").innerHTML = $("#grandTotal").text();
          document.getElementById("totalBalanceDuePrint").innerHTML = $("#totalBalanceDue").text();
        }
      });
    }
  });


  $(document).on("click", "#custListType tbody tr", function (e) {
    if (clickedInput == "one") {
      $("#edtSaleCustField1").val($(this).find(".colFieldName").text());
    } else if (clickedInput == "two") {
      $("#edtSaleCustField2").val($(this).find(".colFieldName").text());
    } else if (clickedInput == "three") {
      $("#edtSaleCustField3").val($(this).find(".colFieldName").text());
    }
    $("#customFieldList").modal("toggle");

  });
  

  $(document).ready(function () {
    // $("#edtCustomerName").editableSelect();
    // $("#sltTerms").editableSelect();
    // $('.sltTerms').each(function(i, obj) {
    //   $(obj).editableSelect();
    // })
    // $("#sltDept").editableSelect();
    // $("#sltStatus").editableSelect();

    // $(document).on("click", "#tblUOMList tbody tr", function (e) {
    //   let table = $(this);
    //   let uomName = table.find(".colUOMName").text();
    //   $("input.lineUOM").val(uomName);
    //   $("#UOMListModal").modal("toggle");
    // });


  // $("#sltTerms").editableSelect().on("click.editable-select", function (e, li) {
  //     var $earch = $(this);
  //     var offset = $earch.offset();
  //     var termsDataName = e.target.value || "";
  //     $("#edtTermsID").val("");
  //     if (e.pageX > offset.left + $earch.width() - 8) {
  //       // X button 16px wide?
  //       $("#termsListModal").modal("show");
  //     } else {
  //       if (termsDataName.replace(/\s/g, "") != "") {
  //         $("#termModalHeader").text("Edit Terms");
  //         getVS1Data("TTermsVS1")
  //           .then(function (dataObject) {
  //             //edit to test indexdb
  //             if (dataObject.length == 0) {
  //               $(".fullScreenSpin").css("display", "inline-block");
  //               sideBarService.getTermsVS1().then(function (data) {
  //                 for (let i in data.ttermsvs1) {
  //                   if (data.ttermsvs1[i].TermsName === termsDataName) {
  //                     $("#edtTermsID").val(data.ttermsvs1[i].Id);
  //                     $("#edtDays").val(data.ttermsvs1[i].Days);
  //                     $("#edtName").val(data.ttermsvs1[i].TermsName);
  //                     $("#edtDesc").val(data.ttermsvs1[i].Description);
  //                     if (data.ttermsvs1[i].IsEOM === true) {
  //                       $("#isEOM").prop("checked", true);
  //                     } else {
  //                       $("#isEOM").prop("checked", false);
  //                     }
  //                     if (data.ttermsvs1[i].IsEOMPlus === true) {
  //                       $("#isEOMPlus").prop("checked", true);
  //                     } else {
  //                       $("#isEOMPlus").prop("checked", false);
  //                     }
  //                     if (data.ttermsvs1[i].isSalesdefault === true) {
  //                       $("#chkCustomerDef").prop("checked", true);
  //                     } else {
  //                       $("#chkCustomerDef").prop("checked", false);
  //                     }
  //                     if (data.ttermsvs1[i].isPurchasedefault === true) {
  //                       $("#chkSupplierDef").prop("checked", true);
  //                     } else {
  //                       $("#chkSupplierDef").prop("checked", false);
  //                     }

  //                     break;
  //                   }
  //                 }
  //                 $(".fullScreenSpin").css("display", "none");
  //                 $("#newTermsModal").modal("show");
  //               });
  //             } else {
  //               let data = JSON.parse(dataObject[0].data);
  //               let useData = data.ttermsvs1;
  //               for (let i in useData) {
  //                 if (useData[i].TermsName === termsDataName) {
  //                   $("#edtTermsID").val(useData[i].Id);
  //                   $("#edtDays").val(useData[i].Days);
  //                   $("#edtName").val(useData[i].TermsName);
  //                   $("#edtDesc").val(useData[i].Description);
  //                   if (useData[i].IsEOM === true) {
  //                     $("#isEOM").prop("checked", true);
  //                   } else {
  //                     $("#isEOM").prop("checked", false);
  //                   }
  //                   if (useData[i].IsEOMPlus === true) {
  //                     $("#isEOMPlus").prop("checked", true);
  //                   } else {
  //                     $("#isEOMPlus").prop("checked", false);
  //                   }
  //                   if (useData[i].isSalesdefault === true) {
  //                     $("#chkCustomerDef").prop("checked", true);
  //                   } else {
  //                     $("#chkCustomerDef").prop("checked", false);
  //                   }
  //                   if (useData[i].isPurchasedefault === true) {
  //                     $("#chkSupplierDef").prop("checked", true);
  //                   } else {
  //                     $("#chkSupplierDef").prop("checked", false);
  //                   }

  //                   break;
  //                 }
  //               }
  //               $(".fullScreenSpin").css("display", "none");
  //               $("#newTermsModal").modal("show");
  //             }
  //           })
  //           .catch(function (err) {
  //             $(".fullScreenSpin").css("display", "inline-block");
  //             sideBarService.getTermsVS1().then(function (data) {
  //               for (let i in data.ttermsvs1) {
  //                 if (data.ttermsvs1[i].TermsName === termsDataName) {
  //                   $("#edtTermsID").val(data.ttermsvs1[i].Id);
  //                   $("#edtDays").val(data.ttermsvs1[i].Days);
  //                   $("#edtName").val(data.ttermsvs1[i].TermsName);
  //                   $("#edtDesc").val(data.ttermsvs1[i].Description);
  //                   if (data.ttermsvs1[i].IsEOM === true) {
  //                     $("#isEOM").prop("checked", true);
  //                   } else {
  //                     $("#isEOM").prop("checked", false);
  //                   }
  //                   if (data.ttermsvs1[i].IsEOMPlus === true) {
  //                     $("#isEOMPlus").prop("checked", true);
  //                   } else {
  //                     $("#isEOMPlus").prop("checked", false);
  //                   }
  //                   if (data.ttermsvs1[i].isSalesdefault === true) {
  //                     $("#chkCustomerDef").prop("checked", true);
  //                   } else {
  //                     $("#chkCustomerDef").prop("checked", false);
  //                   }
  //                   if (data.ttermsvs1[i].isPurchasedefault === true) {
  //                     $("#chkSupplierDef").prop("checked", true);
  //                   } else {
  //                     $("#chkSupplierDef").prop("checked", false);
  //                   }

  //                   break;
  //                 }
  //               }
  //               $(".fullScreenSpin").css("display", "none");
  //               $("#newTermsModal").modal("show");
  //             });
  //           });
  //       } else {
  //         $("#termsListModal").modal('show');
  //         $("#termsList_filter .form-control-sm").focus();
  //         $("#termsList_filter .form-control-sm").val("");
  //         $("#termsList_filter .form-control-sm").trigger("input");
  //         var datatable = $("#termsList").DataTable();
  //         datatable.draw();
  //         $("#termsList_filter .form-control-sm").trigger("input");
  //       }
  //     }
  //   });
  // $("#sltDept")
  //   .editableSelect()
  //   .on("click.editable-select", function (e, li) {
  //     var $earch = $(this);
  //     var offset = $earch.offset();
  //     var deptDataName = e.target.value || "";
  //     $("#edtDepartmentID").val("");
  //     if (e.pageX > offset.left + $earch.width() - 8) {
  //       // X button 16px wide?
  //       $("#departmentModal").modal("toggle");
  //     } else {
  //       if (deptDataName.replace(/\s/g, "") != "") {
  //         $("#newDeptHeader").text("Edit Department");
  //         getVS1Data("TDeptClass")
  //           .then(function (dataObject) {
  //             if (dataObject.length == 0) {
  //               $(".fullScreenSpin").css("display", "inline-block");
  //               sideBarService.getDepartment().then(function (data) {
  //                 for (let i = 0; i < data.tdeptclass.length; i++) {
  //                   if (data.tdeptclass[i].DeptClassName === deptDataName) {
  //                     $("#edtDepartmentID").val(data.tdeptclass[i].Id);
  //                     $("#edtNewDeptName").val(
  //                       data.tdeptclass[i].DeptClassName
  //                     );
  //                     $("#edtSiteCode").val(data.tdeptclass[i].SiteCode);
  //                     $("#edtDeptDesc").val(data.tdeptclass[i].Description);
  //                   }
  //                 }
  //                 setTimeout(function () {
  //                   $(".fullScreenSpin").css("display", "none");
  //                   $("#newDepartmentModal").modal("toggle");
  //                 }, 200);
  //               });
  //             } else {
  //               let data = JSON.parse(dataObject[0].data);
  //               for (let i = 0; i < data.tdeptclass.length; i++) {
  //                 if (data.tdeptclass[i].DeptClassName === deptDataName) {
  //                   $("#edtDepartmentID").val(data.tdeptclass[i].Id);
  //                   $("#edtNewDeptName").val(data.tdeptclass[i].DeptClassName);
  //                   $("#edtSiteCode").val(data.tdeptclass[i].SiteCode);
  //                   $("#edtDeptDesc").val(data.tdeptclass[i].Description);
  //                 }
  //                 break;
  //               }
  //               $(".fullScreenSpin").css("display", "none");
  //               $("#newDepartmentModal").modal("toggle");
  //             }
  //           })
  //           .catch(function (err) {
  //             $(".fullScreenSpin").css("display", "inline-block");
  //             sideBarService.getDepartment().then(function (data) {
  //               for (let i = 0; i < data.tdeptclass.length; i++) {
  //                 if (data.tdeptclass[i].DeptClassName === deptDataName) {
  //                   $("#edtDepartmentID").val(data.tdeptclass[i].Id);
  //                   $("#edtNewDeptName").val(data.tdeptclass[i].DeptClassName);
  //                   $("#edtSiteCode").val(data.tdeptclass[i].SiteCode);
  //                   $("#edtDeptDesc").val(data.tdeptclass[i].Description);
  //                 }
  //                 break;
  //               }
  //               $(".fullScreenSpin").css("display", "none");
  //               $("#newDepartmentModal").modal("toggle");
  //             });
  //           });
  //       } else {
  //         $("#departmentModal").modal();
  //         setTimeout(function () {
  //           $("#departmentList_filter .form-control-sm").focus();
  //           $("#departmentList_filter .form-control-sm").val("");
  //           $("#departmentList_filter .form-control-sm").trigger("input");
  //           var datatable = $("#departmentList").DataTable();
  //           datatable.draw();
  //           $("#departmentList_filter .form-control-sm").trigger("input");
  //         }, 500);
  //       }
  //     }
  //   });
  // $("#sltStatus")
  //   .editableSelect()
  //   .on("click.editable-select", function (e, li) {
  //     var $earch = $(this);
  //     var offset = $earch.offset();
  //     $("#statusId").val("");
  //     var statusDataName = e.target.value || "";
  //     if (e.pageX > offset.left + $earch.width() - 8) {
  //       // X button 16px wide?
  //       $("#statusPopModal").modal("toggle");
  //     } else {
  //       if (statusDataName.replace(/\s/g, "") != "") {
  //         $("#newStatusHeader").text("Edit Status");
  //         $("#newStatus").val(statusDataName);
  //         getVS1Data("TLeadStatusType")
  //           .then(function (dataObject) {
  //             if (dataObject.length == 0) {
  //               $(".fullScreenSpin").css("display", "inline-block");
  //               sideBarService.getAllLeadStatus().then(function (data) {
  //                 for (let i in data.tleadstatustype) {
  //                   if (data.tleadstatustype[i].TypeName === statusDataName) {
  //                     $("#statusId").val(data.tleadstatustype[i].Id);
  //                     break;
  //                   }
  //                 }
  //                 $(".fullScreenSpin").css("display", "none");
  //                 $("#newStatusPopModal").modal("toggle");
  //               });
  //             } else {
  //               let data = JSON.parse(dataObject[0].data);
  //               let useData = data.tleadstatustype;
  //               for (let i in useData) {
  //                 if (useData[i].TypeName === statusDataName) {
  //                   $("#statusId").val(useData[i].Id);
  //                   break;
  //                 }
  //               }
  //               $(".fullScreenSpin").css("display", "none");
  //               $("#newStatusPopModal").modal("toggle");
  //             }
  //           })
  //           .catch(function (err) {
  //             $(".fullScreenSpin").css("display", "inline-block");
  //             sideBarService.getAllLeadStatus().then(function (data) {
  //               for (let i in data.tleadstatustype) {
  //                 if (data.tleadstatustype[i].TypeName === statusDataName) {
  //                   $("#statusId").val(data.tleadstatustype[i].Id);
  //                   break;
  //                 }
  //               }
  //               $(".fullScreenSpin").css("display", "none");
  //               $("#newStatusPopModal").modal("toggle");
  //             });
  //           });
  //         $(".fullScreenSpin").css("display", "none");
  //         $("#newStatusPopModal").modal("toggle");
  //       } else {
  //         $("#statusPopModal").modal();
  //         $("#tblStatusPopList_filter .form-control-sm").focus();
  //         $("#tblStatusPopList_filter .form-control-sm").val("");
  //         $("#tblStatusPopList_filter .form-control-sm").trigger("input");
  //         var datatable = $("#tblStatusPopList").DataTable();

  //         datatable.draw();
  //         $("#tblStatusPopList_filter .form-control-sm").trigger("input");
  //       }
  //     }
  //   });
  });


  templateObject.saveInvoiceData = function(data) {
    setTimeout(function () {
      saveCurrencyHistory();
      let uploadedItems = data.uploadedData
      let stripe_id = templateObject.accountID.get();
      let stripe_fee_method = templateObject.stripe_fee_method.get();
      let customername = $("#edtCustomerName");
      let name = $("#edtCustomerEmail").attr("customerfirstname");
      let surname = $("#edtCustomerEmail").attr("customerlastname");

      let termname = $("#sltTerms").val() || "";
      if (termname === "") {
        swal({
          title: "Terms has not been selected!",
          text: '',
          type: 'warning',
        }).then((result) => {
          if (result.value) {
            $('#sltTerms').focus();
          } else if (result.dismiss == 'cancel') {

          }
        });
        event.preventDefault();
        return false;
      }
      if (customername.val() === "") {
        swal({
          title: "Customer has not been selected!",
          text: '',
          type: 'warning',
        }).then((result) => {
          if (result.value) {
            $('#edtCustomerName').focus();
          } else if (result.dismiss == 'cancel') {

          }
        });
        event.preventDefault();
      } else {
        $(".fullScreenSpin").css("display", "inline-block");
        var splashLineArray = new Array();
        let lineItemsForm = [];
        let lineItems = [];
        let lineItemObjForm = {};
        var erpGet = erpDb();
        var saledateTime = new Date($("#dtSODate").datepicker("getDate"));

        var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

        let saleDate =
          saledateTime.getFullYear() +
          "-" +
          (saledateTime.getMonth() + 1) +
          "-" +
          saledateTime.getDate();

        let checkBackOrder = templateObject.includeBOnShippedQty.get();
        $("#tblInvoiceLine > tbody > tr").each(function () {
          var lineID = this.id;
          let tdproduct = $("#" + lineID + " .lineProductName").val();
          let tddescription = $("#" + lineID + " .lineProductDesc").text();
          let tdQty = $("#" + lineID + " .lineQty").val();

          let tdOrderd = $("#" + lineID + " .lineOrdered").val() || 1;

          let tdunitprice = $("#" + lineID + " .colUnitPriceExChange").val();
          let tdtaxCode =
            $("#" + lineID + " .lineTaxCode").val() || loggedTaxCodeSalesInc;
          let tdlineUnit = $("#" + lineID + " .lineUOM").text() || defaultUOM;

          let tdSerialNumber = $("#" + lineID + " .colSerialNo").attr(
            "data-serialnumbers"
          );
          let tdLotNumber = $("#" + lineID + " .colSerialNo").attr(
            "data-lotnumbers"
          );
          let tdLotExpiryDate = $("#" + lineID + " .colSerialNo").attr(
            "data-expirydates"
          );
          let tdSalesLineCustField1 = $("#" + lineID + " .colSalesLinesCustField1").text();

          lineItemObj = {
            description: tddescription || "",
            quantity: tdQty || 0,
            unitPrice: tdunitprice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            }) || 0,
          };

          lineItems.push(lineItemObj);

          if (tdproduct != "") {
            if (checkBackOrder == true) {
              lineItemObjForm = {
                type: "TInvoiceLine",
                fields: {
                  ProductName: tdproduct || "",
                  ProductDescription: tddescription || "",
                  UOMQtySold: parseFloat(tdOrderd) || 0,
                  UOMQtyShipped: parseFloat(tdQty) || 0,
                  LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                  Headershipdate: saleDate,
                  LineTaxCode: tdtaxCode || "",
                  DiscountPercent: parseFloat($("#" + lineID + " .lineDiscount").val()) || 0,
                  UnitOfMeasure: tdlineUnit,
                  SalesLinesCustField1: tdSalesLineCustField1,
                },
              };
            } else {
              lineItemObjForm = {
                type: "TInvoiceLine",
                fields: {
                  ProductName: tdproduct || "",
                  ProductDescription: tddescription || "",
                  UOMQtySold: parseFloat(tdQty) || 0,
                  UOMQtyShipped: parseFloat(tdQty) || 0,
                  LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                  Headershipdate: saleDate,
                  LineTaxCode: tdtaxCode || "",
                  DiscountPercent: parseFloat($("#" + lineID + " .lineDiscount").val()) || 0,
                  UnitOfMeasure: tdlineUnit,
                  SalesLinesCustField1: tdSalesLineCustField1,
                },
              };
            }

            // Feature/ser-lot number tracking: Save Serial Numbers
            if (tdSerialNumber) {
              const serialNumbers = tdSerialNumber.split(",");
              let tpqaList = [];
              for (let i = 0; i < serialNumbers.length; i++) {
                const tpqaObject = {
                  type: "TPQASN",
                  fields: {
                    Active: true,
                    Qty: 1,
                    SerialNumber: serialNumbers[i],
                  },
                };
                tpqaList.push(tpqaObject);
              }
              const pqaObject = {
                type: "TPQA",
                fields: {
                  Active: true,
                  PQASN: tpqaList,
                  Qty: serialNumbers.length,
                },
              };
              lineItemObjForm.fields.PQA = pqaObject;
            }

            // Feature/ser-lot number tracking: Save Lot Number
            if (tdLotNumber != undefined && tdLotNumber != "") {
              const lotNumbers = tdLotNumber.split(",");
              const expiryDates = tdLotExpiryDate.split(",");
              let tpqaList = [];
              for (let i = 0; i < lotNumbers.length; i++) {
                const dates = expiryDates[i].split("/");
                const tpqaObject = {
                  type: "PQABatch",
                  fields: {
                    Active: true,
                    BatchExpiryDate: new Date(
                      parseInt(dates[0]),
                      parseInt(dates[1]) - 1,
                      parseInt(dates[2])
                    ).toISOString(),
                    Qty: 1,
                    BatchNo: lotNumbers[i],
                  },
                };
                tpqaList.push(tpqaObject);
              }
              const pqaObject = {
                type: "TPQA",
                fields: {
                  Active: true,
                  PQABatch: tpqaList,
                  Qty: lotNumbers.length,
                },
              };
              lineItemObjForm.fields.PQA = pqaObject;
            }

            lineItemsForm.push(lineItemObjForm);
            splashLineArray.push(lineItemObjForm);
          }
        });
        let getchkcustomField1 = true;
        let getchkcustomField2 = true;
        let getcustomField1 = $(".customField1Text").html() || "";
        let getcustomField2 = $(".customField2Text").html() || "";
        if ($("#formCheck-one").is(":checked")) {
          getchkcustomField1 = false;
        }
        if ($("#formCheck-two").is(":checked")) {
          getchkcustomField2 = false;
        }

        let customer = $("#edtCustomerName").val();
        let customerEmail = $("#edtCustomerEmail").val();
        let billingAddress = $("#txabillingAddress").val();

        let poNumber = $("#ponumber").val();
        let reference = $("#edtRef").val();

        let departement = $("#sltDept").val() || "";
        let shippingAddress = $("#txaShipingInfo").val();
        let comments = $("#txaComment").val();
        let pickingInfrmation = $("#txapickmemo").val();
        let total = $("#totalBalanceDue").html() || 0;
        let tax = $("#subtotal_tax").html() || 0;
        let saleCustField1 = $("#edtSaleCustField1").val() || "";
        let saleCustField2 = $("#edtSaleCustField2").val() || "";
        let saleCustField3 = $("#edtSaleCustField3").val() || "";
        var url = FlowRouter.current().path;
        var getso_id = url.split("?id=");
        var currentInvoice = getso_id[getso_id.length - 1];

        var currencyCode = $("#sltCurrency").val() || CountryAbbr;
        let ForeignExchangeRate = $('#exchange_rate').val() || 0;
        var objDetails = "";
        if (departement === "") {
          swal({
            title: "Department has not been selected!",
            text: '',
            type: 'warning',
          }).then((result) => {
            if (result.value) {
              $('#sltDept').focus();
            } else if (result.dismiss == 'cancel') {

            }
          });
          $(".fullScreenSpin").css("display", "none");
          event.preventDefault();
          return false;
        }
        if (splashLineArray.length > 0) {
          if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);

            objDetails = {
              type: "TInvoiceEx",
              fields: {
                ID: currentInvoice,
                CustomerName: customer,
                ForeignExchangeCode: currencyCode,
                ForeignExchangeRate: parseFloat(ForeignExchangeRate),
                Lines: splashLineArray,
                InvoiceToDesc: billingAddress,
                SaleDate: saleDate,
                CustPONumber: poNumber,
                ReferenceNo: reference,
                TermsName: termname,
                SaleClassName: departement,
                ShipToDesc: shippingAddress,
                Comments: comments,
                SaleCustField1: saleCustField1,
                SaleCustField2: saleCustField2,
                SaleCustField3: saleCustField3,
                PickMemo: pickingInfrmation,
                Attachments: uploadedItems,
                SalesStatus: $("#sltStatus").val(),
              },
            };

          } else {
            objDetails = {
              type: "TInvoiceEx",
              fields: {
                CustomerName: customer,
                ForeignExchangeCode: currencyCode,
                ForeignExchangeRate: parseFloat(ForeignExchangeRate),
                Lines: splashLineArray,
                InvoiceToDesc: billingAddress,
                SaleDate: saleDate,
                CustPONumber: poNumber,
                ReferenceNo: reference,
                TermsName: termname,
                SaleClassName: departement,
                ShipToDesc: shippingAddress,
                Comments: comments,
                SaleCustField1: saleCustField1,
                SaleCustField2: saleCustField2,
                SaleCustField3: saleCustField3,
                PickMemo: pickingInfrmation,
                Attachments: uploadedItems,
                SalesStatus: $("#sltStatus").val(),
              },
            };
          }
        } else {
          swal("Product name has not been selected!", "", "warning");
          $(".fullScreenSpin").css("display", "none");
          event.preventDefault();
          return false;
        }

        salesService.saveInvoiceEx(objDetails).then(function (objDetails) {

          sideBarService.getAllSerialNumber().then(async function(data) {
              await addVS1Data('TSerialNumberListCurrentReport', JSON.stringify(data));
          }).catch(function (err){
          });

          productService.getProductBatches().then(async function (data) {
              await addVS1Data('TProductBatches', JSON.stringify(data));
          }).catch(function (err) {
          });

          if (localStorage.getItem("enteredURL") != null) {
            FlowRouter.go(localStorage.getItem("enteredURL"));
            localStorage.removeItem("enteredURL");
            return;
          }

          // add to custom field
          let company = localStorage.getItem("vs1companyName");
          let vs1User = localStorage.getItem("mySession");
          let customerEmail = $("#edtCustomerEmail").val() || "";
          let currencyname = CountryAbbr.toLowerCase();
          let stringQuery = "?";
          var customerID = $("#edtCustomerEmail").attr("customerid");
          for (let l = 0; l < lineItems.length; l++) {
            stringQuery =
              stringQuery +
              "product" +
              l +
              "=" +
              lineItems[l].description +
              "&price" +
              l +
              "=" +
              lineItems[l].unitPrice +
              "&qty" +
              l +
              "=" +
              lineItems[l].quantity +
              "&";
          }
          stringQuery =
            stringQuery +
            "tax=" +
            tax +
            "&total=" +
            total +
            "&customer=" +
            customer +
            "&name=" +
            name +
            "&surname=" +
            surname +
            "&quoteid=" +
            objDetails.fields.ID +
            "&transid=" +
            stripe_id +
            "&feemethod=" +
            stripe_fee_method +
            "&company=" +
            company +
            "&vs1email=" +
            vs1User +
            "&customeremail=" +
            customerEmail +
            "&type=Invoice&url=" +
            window.location.href +
            "&server=" +
            erpGet.ERPIPAddress +
            "&username=" +
            erpGet.ERPUsername +
            "&token=" +
            erpGet.ERPPassword +
            "&session=" +
            erpGet.ERPDatabase +
            "&port=" +
            erpGet.ERPPort +
            "&dept=" +
            departement +
            "&currency=" +
            currencyname;
          $("#html-Invoice-pdfwrapper").css("display", "block");
          $(".pdfCustomerName").html($("#edtCustomerName").val());
          $(".pdfCustomerAddress").html(
            $("#txabillingAddress")
              .val()
              .replace(/[\r\n]/g, "<br />")
          );
          var ponumber = $("#ponumber").val() || ".";
          $(".po").text(ponumber);

          function generatePdfForMail(invoiceId) {
            let stripe_id = templateObject.accountID.get() || "";
            let file = "Invoice-" + invoiceId + ".pdf";
            return new Promise((resolve, reject) => {
              if (stripe_id != "") {
                $(".linkText").attr("href", stripeGlobalURL + stringQuery);
              } else {
                $(".linkText").attr("href", "#");
              }
              var source = document.getElementById("html-Invoice-pdfwrapper");
              var opt = {
                margin: 0,
                filename: file,
                image: {
                  type: "jpeg",
                  quality: 0.98,
                },
                html2canvas: {
                  scale: 2,
                },
                jsPDF: {
                  unit: "in",
                  format: "a4",
                  orientation: "portrait",
                },
              };
              resolve(
                html2pdf().set(opt).from(source).toPdf().output("datauristring")
              );
            });
          }
          async function addAttachment() {
            let attachment = [];
            let invoiceId = objDetails.fields.ID;
            let encodedPdf = await generatePdfForMail(invoiceId);
            let base64data = encodedPdf.split(",")[1];
            pdfObject = {
              filename: "invoice-" + invoiceId + ".pdf",
              content: base64data,
              encoding: "base64",
            };
            attachment.push(pdfObject);
            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = localStorage.getItem("vs1companyName");
            let mailFrom = localStorage.getItem("VS1OrgEmail") || localStorage.getItem("VS1AdminUserName");
            let customerEmailName = $("#edtCustomerName").val();
            let checkEmailData = $("#edtCustomerEmail").val();
            let grandtotal = $("#grandTotal").html();
            let amountDueEmail = $("#totalBalanceDue").html();
            let emailDueDate = $("#dtDueDate").val();
            let customerBillingAddress = $("#txabillingAddress").val();
            let customerTerms = $("#sltTerms").val();

            let customerSubtotal = $("#subtotal_total").html();
            let customerTax = $("#subtotal_tax").html();
            let customerNett = $("#subtotal_nett").html();
            let customerTotal = $("#grandTotal").html();
            let mailSubject = "Invoice " + erpInvoiceId + " from " + mailFromName + " for " + customerEmailName;

              var htmlmailBody = generateHtmlMailBody(erpInvoiceId, emailDueDate, grandtotal, stripeGlobalURL, stringQuery, customerEmailName, mailFromName, customerBillingAddress, customerTerms, customerSubtotal, customerTax, customerNett, customerTotal)

            if (
              $(".chkEmailCopy").is(":checked") &&
              $(".chkEmailRep").is(":checked")
            ) {
              Meteor.call(
                "sendEmail", {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: "",
                html: htmlmailBody,
                attachments: attachment,
              },
                function (error, result) {
                  if (error && error.error === "error") {
                    FlowRouter.go("/invoicelist?success=true");
                  } else { }
                }
              );

              Meteor.call(
                "sendEmail", {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: "",
                html: htmlmailBody,
                attachments: attachment,
              },
                function (error, result) {
                  if (error && error.error === "error") {
                    if (FlowRouter.current().queryParams.trans) {
                      FlowRouter.go(
                        "/customerscard?id=" +
                        FlowRouter.current().queryParams.trans +
                        "&transTab=active"
                      );
                    } else {
                      FlowRouter.go("/invoicelist?success=true");
                    }
                  } else {
                    $("#html-Invoice-pdfwrapper").css("display", "none");
                    swal({
                      title: "SUCCESS",
                      text: "Email Sent To Customer: " +
                        checkEmailData +
                        " and User: " +
                        mailFrom +
                        "",
                      type: "success",
                      showCancelButton: false,
                      confirmButtonText: "OK",
                    }).then((result) => {
                      if (result.value) { } else if (result.dismiss === "cancel") { }
                    });

                    $(".fullScreenSpin").css("display", "none");
                  }
                }
              );

              let values = [];
              let basedOnTypeStorages = Object.keys(localStorage);
              basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
                let employeeId = storage.split("_")[2];
                return storage.includes("BasedOnType_");
                // return storage.includes('BasedOnType_') && employeeId == localStorage.getItem('mySessionEmployeeLoggedID')
              });
              let i = basedOnTypeStorages.length;
              if (i > 0) {
                while (i--) {
                  values.push(localStorage.getItem(basedOnTypeStorages[i]));
                }
              }
              values.forEach((value) => {
                let reportData = JSON.parse(value);
                reportData.HostURL = $(location).attr("protocal") ?
                  $(location).attr("protocal") +
                  "://" +
                  $(location).attr("hostname") :
                  "http://" + $(location).attr("hostname");
                reportData.attachments = attachment;
                if (reportData.BasedOnType.includes("S")) {
                  if (reportData.FormID == 1) {
                    let formIds = reportData.FormIDs.split(",");
                    if (formIds.includes("54")) {
                      reportData.FormID = 54;
                      Meteor.call("sendNormalEmail", reportData);
                    }
                  } else {
                    if (reportData.FormID == 54)
                      Meteor.call("sendNormalEmail", reportData);
                  }
                }
              });
            } else if ($(".chkEmailCopy").is(":checked")) {
              Meteor.call(
                "sendEmail", {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: checkEmailData,
                subject: mailSubject,
                text: "",
                html: htmlmailBody,
                attachments: attachment,
              },
                function (error, result) {
                  if (error && error.error === "error") {
                    FlowRouter.go("/invoicelist?success=true");
                  } else {
                    $("#html-Invoice-pdfwrapper").css("display", "none");
                    swal({
                      title: "SUCCESS",
                      text: "Email Sent To Customer: " + checkEmailData + " ",
                      type: "success",
                      showCancelButton: false,
                      confirmButtonText: "OK",
                    }).then((result) => {
                      if (result.value) {
                        if (FlowRouter.current().queryParams.trans) {
                          FlowRouter.go(
                            "/customerscard?id=" +
                            FlowRouter.current().queryParams.trans +
                            "&transTab=active"
                          );
                        } else {
                          FlowRouter.go("/invoicelist?success=true");
                        }
                      } else if (result.dismiss === "cancel") { }
                    });

                    $(".fullScreenSpin").css("display", "none");
                  }
                }
              );

              let values = [];
              let basedOnTypeStorages = Object.keys(localStorage);
              basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
                let employeeId = storage.split("_")[2];
                return storage.includes("BasedOnType_");
                // return storage.includes('BasedOnType_') && employeeId == localStorage.getItem('mySessionEmployeeLoggedID')
              });
              let i = basedOnTypeStorages.length;
              if (i > 0) {
                while (i--) {
                  values.push(localStorage.getItem(basedOnTypeStorages[i]));
                }
              }
              values.forEach((value) => {
                let reportData = JSON.parse(value);
                reportData.HostURL = $(location).attr("protocal") ?
                  $(location).attr("protocal") +
                  "://" +
                  $(location).attr("hostname") :
                  "http://" + $(location).attr("hostname");
                reportData.attachments = attachment;
                if (reportData.BasedOnType.includes("S")) {
                  if (reportData.FormID == 1) {
                    let formIds = reportData.FormIDs.split(",");
                    if (formIds.includes("54")) {
                      reportData.FormID = 54;
                      Meteor.call("sendNormalEmail", reportData);
                    }
                  } else {
                    if (reportData.FormID == 54)
                      Meteor.call("sendNormalEmail", reportData);
                  }
                }
              });
            } else if ($(".chkEmailRep").is(":checked")) {
              Meteor.call(
                "sendEmail", {
                from: "" + mailFromName + " <" + mailFrom + ">",
                to: mailFrom,
                subject: mailSubject,
                text: "",
                html: htmlmailBody,
                attachments: attachment,
              },
                function (error, result) {
                  if (error && error.error === "error") {
                    FlowRouter.go("/invoicelist?success=true");
                  } else {
                    $("#html-Invoice-pdfwrapper").css("display", "none");
                    swal({
                      title: "SUCCESS",
                      text: "Email Sent To User: " + mailFrom + " ",
                      type: "success",
                      showCancelButton: false,
                      confirmButtonText: "OK",
                    }).then((result) => {
                      if (result.value) {
                        if (FlowRouter.current().queryParams.trans) {
                          FlowRouter.go(
                            "/customerscard?id=" +
                            FlowRouter.current().queryParams.trans +
                            "&transTab=active"
                          );
                        } else {
                          FlowRouter.go("/invoicelist?success=true");
                        }
                      } else if (result.dismiss === "cancel") { }
                    });

                    $(".fullScreenSpin").css("display", "none");
                  }
                }
              );

              let values = [];
              let basedOnTypeStorages = Object.keys(localStorage);
              basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
                let employeeId = storage.split("_")[2];
                return storage.includes("BasedOnType_");
                // return storage.includes('BasedOnType_') && employeeId == localStorage.getItem('mySessionEmployeeLoggedID')
              });
              let i = basedOnTypeStorages.length;
              if (i > 0) {
                while (i--) {
                  values.push(localStorage.getItem(basedOnTypeStorages[i]));
                }
              }
              values.forEach((value) => {
                let reportData = JSON.parse(value);
                reportData.HostURL = $(location).attr("protocal") ?
                  $(location).attr("protocal") +
                  "://" +
                  $(location).attr("hostname") :
                  "http://" + $(location).attr("hostname");
                reportData.attachments = attachment;
                if (reportData.BasedOnType.includes("S")) {
                  if (reportData.FormID == 1) {
                    let formIds = reportData.FormIDs.split(",");
                    if (formIds.includes("54")) {
                      reportData.FormID = 54;
                      Meteor.call("sendNormalEmail", reportData);
                    }
                  } else {
                    if (reportData.FormID == 54)
                      Meteor.call("sendNormalEmail", reportData);
                  }
                }
              });
            } else {
              let values = [];
              let basedOnTypeStorages = Object.keys(localStorage);
              basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
                let employeeId = storage.split("_")[2];
                return storage.includes("BasedOnType_");
                // return storage.includes('BasedOnType_') && employeeId == localStorage.getItem('mySessionEmployeeLoggedID')
              });
              let i = basedOnTypeStorages.length;
              if (i > 0) {
                while (i--) {
                  values.push(localStorage.getItem(basedOnTypeStorages[i]));
                }
              }
              values.forEach((value) => {
                let reportData = JSON.parse(value);
                reportData.HostURL = $(location).attr("protocal") ?
                  $(location).attr("protocal") +
                  "://" +
                  $(location).attr("hostname") :
                  "http://" + $(location).attr("hostname");
                reportData.attachments = attachment;
                // reportData.attachments.push(attachment);
                if (reportData.BasedOnType.includes("S")) {
                  if (reportData.FormID == 1) {
                    let formIds = reportData.FormIDs.split(",");
                    if (formIds.includes("54")) {
                      reportData.FormID = 54;
                      Meteor.call("sendNormalEmail", reportData);
                    }
                  } else {
                    if (reportData.FormID == 54)
                      Meteor.call("sendNormalEmail", reportData);
                  }
                }
              });
              if (FlowRouter.current().queryParams.trans) {
                FlowRouter.go(
                  "/customerscard?id=" +
                  FlowRouter.current().queryParams.trans +
                  "&transTab=active"
                );
              } else {
                FlowRouter.go("/invoicelist?success=true");
              }
            }
          }
          addAttachment();
        }).catch(function (err) {
            $("#html-Invoice-pdfwrapper").css("display", "none");
            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
                if (err === checkResponseError) {
                  window.open("/", "_self");
                }
              } else if (result.dismiss === "cancel") { }
            });
            $(".fullScreenSpin").css("display", "none");
          });
      }
    }, delayTimeAfterSound);
  }

});

Template.invoice_temp.helpers({
  oneExAPIName:function() {
    let salesService = new SalesBoardService();
    return salesService.getOneInvoicedataEx;
  },

  service: ()=>{
    let salesService = new SalesBoardService();
    return salesService;
  },

  setTransData: ()=> {
    let templateObject = Template.instance();
    return function(data) {
        let dataReturn =  templateObject.setInvoiceDataFields(data)
        return dataReturn;
    }
  },


  sendEmail:() => {
    let templateObject = Template.instance();
    return async function() {
      let dataReturn = await templateObject.sendEmail();
      return dataReturn
    }
  },

  getTemplateList: function () {
    return template_list;
  },

  getTemplateNumber: function () {
    let template_numbers = ["1", "2", "3"];
    return template_numbers;
  },
  

  mailHtml: function () {
    return function(data) {
      return Template.instance().getEmailBody(data)
    }
  },
  

  initialRecords: function () {
    let templateObject = Template.instance();
    return function() {
      let data = templateObject.setInitialRecords();
      return data;
    }
  },

  saveTransaction: function() {
    return function(data) {
      Template.instance().saveInvoiceData(data)
    }
  },

  printOptions: ()=>{
    return Template.instance().printOptions.get()
  },



  isBatchSerialNoTracking: () => {
    return localStorage.getItem("CloudShowSerial") || false;
  },
  vs1companyBankName: () => {
    return localStorage.getItem("vs1companyBankName") || "";
  },
  bsbRegionName: () => {
    return bsbCodeName;
  },
  vs1companyBankAccountName: () => {
    return localStorage.getItem("vs1companyBankAccountName") || "";
  },
  vs1companyBankAccountNo: () => {
    return localStorage.getItem("vs1companyBankAccountNo") || "";
  },
  vs1companyBankBSB: () => {
    return localStorage.getItem("vs1companyBankBSB") || "";
  },
  vs1companyBankSwiftCode: () => {
    return localStorage.getItem("vs1companyBankSwiftCode") || "";
  },
  vs1companyBankRoutingNo: () => {
    return localStorage.getItem("vs1companyBankRoutingNo") || "";
  },
  custfields: () => {
    return Template.instance().custfields.get();
  },
  invoicerecord: () => {
    return Template.instance().invoicerecord.get();
  },
  accountID: () => {
    return Template.instance().accountID.get();
  },
  custfield1: () => {
    return localStorage.getItem("custfield1sales") || "Custom Field 1";
  },
  custfield2: () => {
    return localStorage.getItem("custfield2sales") || "Custom Field 2";
  },
  custfield3: () => {
    return localStorage.getItem("custfield3sales") || "Custom Field 3";
  },
  currentDate: () => {
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    return begunDate;
  },
  deptrecords: () => {
    return Template.instance()
      .deptrecords.get()
      .sort(function (a, b) {
        if (a.department == "NA") {
          return 1;
        } else if (b.department == "NA") {
          return -1;
        }
        return a.department.toUpperCase() > b.department.toUpperCase() ? 1 : -1;
      });
  },
  termrecords: () => {
    return Template.instance()
      .termrecords.get()
      .sort(function (a, b) {
        if (a.termsname == "NA") {
          return 1;
        } else if (b.termsname == "NA") {
          return -1;
        }
        return a.termsname.toUpperCase() > b.termsname.toUpperCase() ? 1 : -1;
      });
  },
  clientrecords: () => {
    return Template.instance()
      .clientrecords.get()
      .sort(function (a, b) {
        if (a.customername == "NA") {
          return 1;
        } else if (b.customername == "NA") {
          return -1;
        }
        return a.customername.toUpperCase() > b.customername.toUpperCase() ?
          1 :
          -1;
      });
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "new_invoice",
    });
  },
  salesCloudGridPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: localStorage.getItem("mycloudLogonID"),
      PrefName: "tblInvoiceLine",
    });
  },
  uploadedFiles: () => {
    return Template.instance().uploadedFiles.get();
  },
  attachmentCount: () => {
    return Template.instance().attachmentCount.get();
  },
  uploadedFile: () => {
    return Template.instance().uploadedFile.get();
  },
  statusrecords: () => {
    return Template.instance()
      .statusrecords.get()
      .sort(function (a, b) {
        if (a.orderstatus == "NA") {
          return 1;
        } else if (b.orderstatus == "NA") {
          return -1;
        }
        return a.orderstatus.toUpperCase() > b.orderstatus.toUpperCase() ?
          1 :
          -1;
      });
  },
  includeBOnShippedQty: () => {
    return Template.instance().includeBOnShippedQty.get();
  },
  companyname: () => {
    return loggedCompany;
  },
  companyaddress1: () => {
    return localStorage.getItem("vs1companyaddress1");
  },
  companyaddress2: () => {
    return localStorage.getItem("vs1companyaddress2");
  },
  city: () => {
    return localStorage.getItem("vs1companyCity");
  },
  state: () => {
    return localStorage.getItem("companyState");
  },
  poBox: () => {
    return localStorage.getItem("vs1companyPOBox");
  },
  companyphone: () => {
    let phone = "Phone: " + localStorage.getItem("vs1companyPhone");
    return phone;
  },
  companyabn: () => {
    //Update Company ABN
    let countryABNValue = localStorage.getItem("vs1companyABN");
    return countryABNValue;
  },
  companyReg: () => {
    //Add Company Reg
    let countryRegValue = "";
    if (LoggedCountry == "South Africa") {
      countryRegValue = "Reg No: " + localStorage.getItem("vs1companyReg");
    }

    return countryRegValue;
  },
  organizationname: () => {
    return localStorage.getItem("vs1companyName");
  },
  organizationurl: () => {
    return localStorage.getItem("vs1companyURL");
  },
  isMobileDevices: () => {
    var isMobile = false;
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4)
      )
    ) {
      isMobile = true;
    }

    return isMobile;
  },
  record: () => {
    return Template.instance().record.get();
  },

  customerRecord: () => {
    return Template.instance().customerRecord.get();
  },

  productqtyrecords: () => {
    return Template.instance()
      .productqtyrecords.get()
      .sort(function (a, b) {
        if (a.department == "NA") {
          return 1;
        } else if (b.department == "NA") {
          return -1;
        }
        return a.department.toUpperCase() > b.department.toUpperCase() ? 1 : -1;
      });
  },
  productExtraSell: () => {
    return Template.instance()
      .productExtraSell.get()
      .sort(function (a, b) {
        if (a.clienttype == "NA") {
          return 1;
        } else if (b.clienttype == "NA") {
          return -1;
        }
        return a.clienttype.toUpperCase() > b.clienttype.toUpperCase() ? 1 : -1;
      });
  },
  totaldeptquantity: () => {
    return Template.instance().totaldeptquantity.get();
  },
  isTrackChecked: () => {
    let templateObj = Template.instance();
    return templateObj.isTrackChecked.get();
  },
  isExtraSellChecked: () => {
    let templateObj = Template.instance();
    return templateObj.isExtraSellChecked.get();
  },

  // custom field displaysettings

  loggedInCountryVAT: () => {
    let countryVatLabel = "GST";
    if (localStorage.getItem("ERPLoggedCountry") == "South Africa") {
      countryVatLabel = "VAT";
    }
    return countryVatLabel;
  },


  isForeignEnabled: () => {
    return Template.instance().isForeignEnabled.get();
  },
  getDefaultCurrency: () => {
    return defaultCurrencyCode;
  },

  headerfields: () => {
    return Template.instance().headerfields.get()
  },

  headerbuttons:()=>{
    return Template.instance().headerbuttons.get()
  },

  transactiongridfields: () => {
    return Template.instance().transactiongridfields.get()
  },

  

  apiFunction: function() {
    return salesService.getOneInvoicedataEx
  },
  service: function() {
    return salesService
  },
  isCurrencyEnable: () => FxGlobalFunctions.isCurrencyEnabled(),
  lineDataHandler: function () {
    let templateObject = Template.instance();
    return function(data) {
        let dataReturn =  templateObject.getLineTableData(data)
        return dataReturn
    }
  },
  getAttributes: function() {
    let templateObject = Template.instance();
    return function(data) {
      let dataReturn = templateObject.getLineAttributes(data)
      return dataReturn
    }
  },
  footerFields: function() {
    return Template.instance().tranasctionfooterfields.get()
  }
});

Template.invoice_temp.events({
  'click input[name="frequencyRadio"]': function (event) {
    if (event.target.id == "frequencyMonthly") {
      document.getElementById("monthlySettings").style.display = "block";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
    } else if (event.target.id == "frequencyWeekly") {
      document.getElementById("weeklySettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
    } else if (event.target.id == "frequencyDaily") {
      document.getElementById("dailySettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("oneTimeOnlySettings").style.display = "none";
    } else if (event.target.id == "frequencyOnetimeonly") {
      document.getElementById("oneTimeOnlySettings").style.display = "block";
      document.getElementById("monthlySettings").style.display = "none";
      document.getElementById("weeklySettings").style.display = "none";
      document.getElementById("dailySettings").style.display = "none";
    } else {
      $("#copyFrequencyModal").modal('toggle');
    }
  },
  'click input[name="settingsMonthlyRadio"]': function (event) {
    if (event.target.id == "settingsMonthlyEvery") {
      $('.settingsMonthlyEveryOccurence').attr('disabled', false);
      $('.settingsMonthlyDayOfWeek').attr('disabled', false);
      $('.settingsMonthlySpecDay').attr('disabled', true);
    } else if (event.target.id == "settingsMonthlyDay") {
      $('.settingsMonthlySpecDay').attr('disabled', false);
      $('.settingsMonthlyEveryOccurence').attr('disabled', true);
      $('.settingsMonthlyDayOfWeek').attr('disabled', true);
    } else {
      $("#frequencyModal").modal('toggle');
    }
  },
  'click input[name="dailyRadio"]': function (event) {
    if (event.target.id == "dailyEveryDay") {
      $('.dailyEveryXDays').attr('disabled', true);
    } else if (event.target.id == "dailyWeekdays") {
      $('.dailyEveryXDays').attr('disabled', true);
    } else if (event.target.id == "dailyEvery") {
      $('.dailyEveryXDays').attr('disabled', false);
    } else {
      $("#frequencyModal").modal('toggle');
    }
  },
  "click .btnRefreshCustomField": function (event) {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    sideBarService
      .getAllCustomFields()
      .then(function (data) {
        addVS1Data("TCustomFieldList", JSON.stringify(data))
          .then(function (datareturn) {
            Meteor._reload.reload();
          })
          .catch(function (err) {
            Meteor._reload.reload();
          });
        templateObject.getSalesCustomFieldsList();
        $(".fullScreenSpin").css("display", "none");
      })
      .catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
      });
  },
  "click #edtSaleCustField1": function (event) {
    clickedInput = "one";
    $("#clickedControl").val(clickedInput);
  },
  "click #edtSaleCustField2": function (event) {
    clickedInput = "two";
    $("#clickedControl").val(clickedInput);
  },
  "click  #open_print_confirm": function (event) { },

  "click #choosetemplate": function (event) {
    if ($("#choosetemplate").is(":checked")) {
      $("#templateselection").modal("show");
    } else {
      $("#templateselection").modal("hide");
    }
  },
  "click #edtSaleCustField3": function (event) {
    clickedInput = "three";
    $("#clickedControl").val(clickedInput);
  },
 
  "change #sltStatus": function () {
    let status = $("#sltStatus").find(":selected").val();
    if (status == "newstatus") {
      $("#statusModal").modal();
    }
  },
  "blur .lineProductDesc": function (event) {
    var targetID = $(event.target).closest("tr").attr("id");
    $("#" + targetID + " #lineProductDesc").text(
      $("#" + targetID + " .lineProductDesc").text()
    );
  },
  "click .payNow": function (event) {
    let templateObject = Template.instance();
    let stripe_id = templateObject.accountID.get() || "";
    let stripe_fee_method = templateObject.stripe_fee_method.get();
    if (stripe_id != "") {
      var url = FlowRouter.current().path;
      var id_available = url.includes("?id=");
      if (id_available == true) {
        if ($("#edtCustomerEmail").val() != "") {
          let quoteData = templateObject.invoicerecord.get();
          let lineItems = [];
          let total = $("#totalBalanceDue").html() || 0;
          let tax = $("#subtotal_tax").html() || 0;
          let customer = $("#edtCustomerName").val();
          let company = localStorage.getItem("vs1companyName");
          let name = $("#firstname").val();
          let surname = $("#lastname").val();
          $("#tblInvoiceLine > tbody > tr").each(function () {
            var lineID = this.id;
            let tddescription = $("#" + lineID + " .lineProductDesc").text();
            let tdQty = $("#" + lineID + " .lineQty").val();
            let tdunitprice = $("#" + lineID + " .colUnitPriceExChange").val();
            const lineItemObj = {
              description: tddescription || "",
              quantity: tdQty || 0,
              unitPrice: tdunitprice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }) || 0,
            };

            lineItems.push(lineItemObj);
          });
          var erpGet = erpDb();
          let vs1User = localStorage.getItem("mySession");
          let customerEmail = $("#edtCustomerEmail").val();
          let currencyname = CountryAbbr.toLowerCase();
          let stringQuery = "?";
          let dept = $("#sltDept").val();
          for (let l = 0; l < lineItems.length; l++) {
            stringQuery =
              stringQuery +
              "product" +
              l +
              "=" +
              lineItems[l].description +
              "&price" +
              l +
              "=" +
              lineItems[l].unitPrice +
              "&qty" +
              l +
              "=" +
              lineItems[l].quantity +
              "&";
          }
          stringQuery =
            stringQuery +
            "tax=" +
            tax +
            "&total=" +
            total +
            "&customer=" +
            customer +
            "&name=" +
            name +
            "&surname=" +
            surname +
            "&quoteid=" +
            quoteData.id +
            "&transid=" +
            stripe_id +
            "&feemethod=" +
            stripe_fee_method +
            "&company=" +
            company +
            "&vs1email=" +
            vs1User +
            "&customeremail=" +
            customerEmail +
            "&type=Invoice&url=" +
            window.location.href +
            "&server=" +
            erpGet.ERPIPAddress +
            "&username=" +
            erpGet.ERPUsername +
            "&token=" +
            erpGet.ERPPassword +
            "&session=" +
            erpGet.ERPDatabase +
            "&port=" +
            erpGet.ERPPort +
            "&dept=" +
            dept +
            "&currency=" +
            currencyname;
          window.open(stripeGlobalURL + stringQuery, "_self");
        } else {
          swal({
            title: "Customer Email Required",
            text: "Please enter customer email",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) { } else if (result.dismiss === "cancel") { }
          });
        }
      } else {
        let templateObject = Template.instance();
        let customername = $("#edtCustomerName");
        let name = $("#edtCustomerEmail").attr("customerfirstname");
        let surname = $("#edtCustomerEmail").attr("customerlastname");
        let salesService = new SalesBoardService();
        let termname =
          $("#sltTerms").val() || templateObject.defaultsaleterm.get();
        if (termname === "") {
          swal({
            title: "Terms has not been selected!",
            text: '',
            type: 'warning',
          }).then((result) => {
            if (result.value) {
              $('#sltTerms').focus();
            }
          });
          event.preventDefault();
          return false;
        }
        if (customername.val() === "") {
          swal({
            title: "Customer has not been selected!",
            text: '',
            type: 'warning',
          }).then((result) => {
            if (result.value) {
              $('#edtCustomerName').focus();
            }
          });
          e.preventDefault();
        } else {
          $(".fullScreenSpin").css("display", "inline-block");
          var splashLineArray = new Array();
          let lineItemsForm = [];
          let lineItems = [];
          let lineItemObjForm = {};
          var erpGet = erpDb();
          var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
          let saleDate =
            saledateTime.getFullYear() +
            "-" +
            (saledateTime.getMonth() + 1) +
            "-" +
            saledateTime.getDate();
          let checkBackOrder = templateObject.includeBOnShippedQty.get();
          $("#tblInvoiceLine > tbody > tr").each(function () {
            var lineID = this.id;
            let tdproduct = $("#" + lineID + " .lineProductName").val();
            let tddescription = $("#" + lineID + " .lineProductDesc").text();
            let tdQty = $("#" + lineID + " .lineQty").val();
            let tdOrderd = $("#" + lineID + " .lineOrdered").val();
            let tdunitprice = $("#" + lineID + " .colUnitPriceExChange").val();
            let tdtaxCode = $("#" + lineID + " .lineTaxCode").val();
            let tdlineUnit = $("#" + lineID + " .lineUOM").text() || defaultUOM;
            let tdSalesLineCustField1 = $("#" + lineID + " .lineSalesLinesCustField1").val();

            const lineItemObj = {
              description: tddescription || "",
              quantity: tdQty || 0,
              unitPrice: tdunitprice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }) || 0,
            };

            lineItems.push(lineItemObj);

            if (tdproduct != "") {
              if (checkBackOrder == true) {
                lineItemObjForm = {
                  type: "TInvoiceLine",
                  fields: {
                    ProductName: tdproduct || "",
                    ProductDescription: tddescription || "",
                    UOMQtySold: parseFloat(tdOrderd) || 0,
                    UOMQtyShipped: parseFloat(tdQty) || 0,
                    LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                    Headershipdate: saleDate,
                    LineTaxCode: tdtaxCode || "",
                    DiscountPercent: parseFloat($("#" + lineID + " .lineDiscount").val()) || 0,
                    UnitOfMeasure: tdlineUnit,
                    SalesLinesCustField1: tdSalesLineCustField1,
                  },
                };
              } else {
                lineItemObjForm = {
                  type: "TInvoiceLine",
                  fields: {
                    ProductName: tdproduct || "",
                    ProductDescription: tddescription || "",
                    UOMQtySold: parseFloat(tdQty) || 0,
                    UOMQtyShipped: parseFloat(tdQty) || 0,
                    LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                    Headershipdate: saleDate,
                    LineTaxCode: tdtaxCode || "",
                    DiscountPercent: parseFloat($("#" + lineID + " .lineDiscount").val()) || 0,
                    UnitOfMeasure: tdlineUnit,
                    SalesLinesCustField1: tdSalesLineCustField1,
                  },
                };
              }

              lineItemsForm.push(lineItemObjForm);
              splashLineArray.push(lineItemObjForm);
            }
          });
          if ($("#formCheck-one").is(":checked")) {
            getchkcustomField1 = false;
          }
          if ($("#formCheck-two").is(":checked")) {
            getchkcustomField2 = false;
          }

          let customer = $("#edtCustomerName").val();

          let poNumber = $("#ponumber").val();
          let reference = $("#edtRef").val();

          let departement = $("#sltDept").val();
          let shippingAddress = $("#txaShipingInfo").val();
          let comments = $("#txaComment").val();
          let pickingInfrmation = $("#txapickmemo").val();
          let total = $("#totalBalanceDue").html() || 0;
          let tax = $("#subtotal_tax").html() || 0;
          let saleCustField1 = $("#edtSaleCustField1").val() || "";
          let saleCustField2 = $("#edtSaleCustField2").val() || "";
          let saleCustField3 = $("#edtSaleCustField3").val() || "";
          var url = FlowRouter.current().path;
          var getso_id = url.split("?id=");
          var currentInvoice = getso_id[getso_id.length - 1];
          let uploadedItems = templateObject.uploadedFiles.get();
          var currencyCode = $("#sltCurrency").val() || CountryAbbr;
          let ForeignExchangeRate = $('#exchange_rate').val() || 0;
          var objDetails = "";
          if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            objDetails = {
              type: "TInvoiceEx",
              fields: {
                ID: currentInvoice,
                CustomerName: customer,
                ForeignExchangeCode: currencyCode,
                ForeignExchangeRate: parseFloat(ForeignExchangeRate),
                Lines: splashLineArray,
                InvoiceToDesc: billingAddress,
                SaleDate: saleDate,
                CustPONumber: poNumber,
                ReferenceNo: reference,
                TermsName: termname,
                SaleClassName: departement,
                ShipToDesc: shippingAddress,
                Comments: comments,
                SaleCustField1: saleCustField1,
                SaleCustField2: saleCustField2,
                SaleCustField3: saleCustField3,
                PickMemo: pickingInfrmation,
                Attachments: uploadedItems,
                SalesStatus: $("#sltStatus").val(),
              },
            };
          } else {
            objDetails = {
              type: "TInvoiceEx",
              fields: {
                CustomerName: customer,
                ForeignExchangeCode: currencyCode,
                ForeignExchangeRate: parseFloat(ForeignExchangeRate),
                Lines: splashLineArray,
                InvoiceToDesc: billingAddress,
                SaleDate: saleDate,
                CustPONumber: poNumber,
                ReferenceNo: reference,
                TermsName: termname,
                SaleClassName: departement,
                ShipToDesc: shippingAddress,
                Comments: comments,
                SaleCustField1: saleCustField1,
                SaleCustField2: saleCustField2,
                SaleCustField3: saleCustField3,
                PickMemo: pickingInfrmation,
                Attachments: uploadedItems,
                SalesStatus: $("#sltStatus").val(),
              },
            };
          }

          salesService
            .saveInvoiceEx(objDetails)
            .then(function (objDetails) {
              let company = localStorage.getItem("vs1companyName");
              let vs1User = localStorage.getItem("mySession");
              let customerEmail = $("#edtCustomerEmail").val() || "";
              let currencyname = CountryAbbr.toLowerCase();
              let stringQuery = "?";
              for (let l = 0; l < lineItems.length; l++) {
                stringQuery =
                  stringQuery +
                  "product" +
                  l +
                  "=" +
                  lineItems[l].description +
                  "&price" +
                  l +
                  "=" +
                  lineItems[l].unitPrice +
                  "&qty" +
                  l +
                  "=" +
                  lineItems[l].quantity +
                  "&";
              }
              stringQuery =
                stringQuery +
                "tax=" +
                tax +
                "&total=" +
                total +
                "&customer=" +
                customer +
                "&name=" +
                name +
                "&surname=" +
                surname +
                "&quoteid=" +
                objDetails.fields.ID +
                "&transid=" +
                stripe_id +
                "&feemethod=" +
                stripe_fee_method +
                "&company=" +
                company +
                "&vs1email=" +
                vs1User +
                "&customeremail=" +
                customerEmail +
                "&type=Invoice&url=" +
                window.location.href +
                "&server=" +
                erpGet.ERPIPAddress +
                "&username=" +
                erpGet.ERPUsername +
                "&token=" +
                erpGet.ERPPassword +
                "&session=" +
                erpGet.ERPDatabase +
                "&port=" +
                erpGet.ERPPort +
                "&dept=" +
                departement +
                "&currency=" +
                currencyname;
              let url = stripeGlobalURL + stringQuery;
              $("#html-Invoice-pdfwrapper").css("display", "block");
              $(".pdfCustomerName").html($("#edtCustomerName").val());
              $(".pdfCustomerAddress").html(
                $("#txabillingAddress")
                  .val()
                  .replace(/[\r\n]/g, "<br />")
              );

              function generatePdfForMail(invoiceId) {
                let stripe_id = templateObject.accountID.get() || "";
                let file = "Invoice-" + invoiceId + ".pdf";
                return new Promise((resolve, reject) => {
                  if (stripe_id != "") {
                    $(".linkText").attr("href", stripeGlobalURL + stringQuery);
                  } else {
                    $(".linkText").attr("href", "#");
                  }
                  var source = document.getElementById(
                    "html-Invoice-pdfwrapper"
                  );
                  var opt = {
                    margin: 0,
                    filename: file,
                    image: {
                      type: "jpeg",
                      quality: 0.98,
                    },
                    html2canvas: {
                      scale: 2,
                    },
                    jsPDF: {
                      unit: "in",
                      format: "a4",
                      orientation: "portrait",
                    },
                  };
                  resolve(
                    html2pdf()
                      .set(opt)
                      .from(source)
                      .toPdf()
                      .output("datauristring")
                  );
                });
              }
              async function addAttachment() {
                let attachment = [];
                let invoiceId = objDetails.fields.ID;
                let encodedPdf = await generatePdfForMail(invoiceId);
                let base64data = encodedPdf.split(",")[1];
                let pdfObject = {
                  filename: "invoice-" + invoiceId + ".pdf",
                  content: base64data,
                  encoding: "base64",
                };
                attachment.push(pdfObject);
                let erpInvoiceId = objDetails.fields.ID;

                let mailFromName = localStorage.getItem("vs1companyName");
                let mailFrom = localStorage.getItem("VS1OrgEmail") || localStorage.getItem("VS1AdminUserName");
                let customerEmailName = $("#edtCustomerName").val();
                let checkEmailData = $("#edtCustomerEmail").val();
                let grandtotal = $("#grandTotal").html();
                let emailDueDate = $("#dtDueDate").val();
                let customerBillingAddress = $("#txabillingAddress").val();
                let customerTerms = $("#sltTerms").val();

                let customerSubtotal = $("#subtotal_total").html();
                let customerTax = $("#subtotal_tax").html();
                let customerNett = $("#subtotal_nett").html();
                let customerTotal = $("#grandTotal").html();

                let mailSubject = "Invoice " + erpInvoiceId + " from " + mailFromName + " for " + customerEmailName;
                var htmlmailBody = generateHtmlMailBody(erpInvoiceId, emailDueDate, grandtotal, stripeGlobalURL, stringQuery, customerEmailName, mailFromName, customerBillingAddress, customerTerms, customerSubtotal, customerTax, customerNett, customerTotal)

                if (
                  $(".chkEmailCopy").is(":checked") &&
                  $(".chkEmailRep").is(":checked")
                ) {
                  Meteor.call(
                    "sendEmail", {
                    from: "" + mailFromName + " <" + mailFrom + ">",
                    to: checkEmailData,
                    subject: mailSubject,
                    text: "",
                    html: htmlmailBody,
                    attachments: attachment,
                  },
                    function (error, result) {
                      if (error && error.error === "error") {
                        FlowRouter.go("/invoicelist?success=true");
                      }
                    }
                  );

                  Meteor.call(
                    "sendEmail", {
                    from: "" + mailFromName + " <" + mailFrom + ">",
                    to: mailFrom,
                    subject: mailSubject,
                    text: "",
                    html: htmlmailBody,
                    attachments: attachment,
                  },
                    function (error, result) {
                      if (error && error.error === "error") {
                        if (FlowRouter.current().queryParams.trans) {
                          FlowRouter.go(
                            "/customerscard?id=" +
                            FlowRouter.current().queryParams.trans +
                            "&transTab=active"
                          );
                        } else {
                          FlowRouter.go("/invoicelist?success=true");
                        }
                      } else {
                        $("#html-Invoice-pdfwrapper").css("display", "none");
                        swal({
                          title: "SUCCESS",
                          text: "Email Sent To Customer: " +
                            checkEmailData +
                            " and User: " +
                            mailFrom +
                            "",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonText: "OK",
                        }).then((result) => {
                          if (result.value) {
                            window.open(url, "_self");
                          } else if (result.dismiss === "cancel") { }
                        });

                        $(".fullScreenSpin").css("display", "none");
                      }
                    }
                  );
                } else if ($(".chkEmailCopy").is(":checked")) {
                  Meteor.call(
                    "sendEmail", {
                    from: "" + mailFromName + " <" + mailFrom + ">",
                    to: checkEmailData,
                    subject: mailSubject,
                    text: "",
                    html: htmlmailBody,
                    attachments: attachment,
                  },
                    function (error, result) {
                      if (error && error.error === "error") {
                        FlowRouter.go("/invoicelist?success=true");
                      } else {
                        $("#html-Invoice-pdfwrapper").css("display", "none");
                        swal({
                          title: "SUCCESS",
                          text: "Email Sent To Customer: " + checkEmailData + " ",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonText: "OK",
                        }).then((result) => {
                          if (result.value) {
                            window.open(url, "_self");
                          }
                        });

                        $(".fullScreenSpin").css("display", "none");
                      }
                    }
                  );
                } else if ($(".chkEmailRep").is(":checked")) {
                  Meteor.call(
                    "sendEmail", {
                    from: "" + mailFromName + " <" + mailFrom + ">",
                    to: mailFrom,
                    subject: mailSubject,
                    text: "",
                    html: htmlmailBody,
                    attachments: attachment,
                  },
                    function (error, result) {
                      if (error && error.error === "error") {
                        FlowRouter.go("/invoicelist?success=true");
                      } else {
                        $("#html-Invoice-pdfwrapper").css("display", "none");
                        swal({
                          title: "SUCCESS",
                          text: "Email Sent To User: " + mailFrom + " ",
                          type: "success",
                          showCancelButton: false,
                          confirmButtonText: "OK",
                        }).then((result) => {
                          if (result.value) {
                            window.open(url, "_self");
                          }
                        });

                        $(".fullScreenSpin").css("display", "none");
                      }
                    }
                  );
                } else {
                  window.open(url, "_self");
                }
              }
              addAttachment();
            })
            .catch(function (err) {
              $("#html-Invoice-pdfwrapper").css("display", "none");
              swal({
                title: "Oooops...",
                text: err,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Try Again",
              }).then((result) => {
                if (result.value) {
                  if (err === checkResponseError) {
                    window.open("/", "_self");
                  }
                } else if (result.dismiss === "cancel") { }
              });
              $(".fullScreenSpin").css("display", "none");
            });
        }
      }
    } else {
      swal({
        title: "WARNING",
        text: "Please Set Up Payment Method To Use This Option, Click Ok to be Redirected to Payment Method page.",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.value) {
          window.open("paymentmethodSettings", "_self");
        } else if (result.dismiss === "cancel") { }
      });
    }
  },
  "blur .lineQty": function (event) {
    let templateObject = Template.instance();
    let taxcodeList = templateObject.taxraterecords.get();
    let utilityService = new UtilityService();
    let $tblrows = $("#tblInvoiceLine tbody tr");
    let $printrows = $(".invoice_print tbody tr");
    let isBOnShippedQty = templateObject.includeBOnShippedQty.get();
    var targetID = $(event.target).closest("tr").attr("id");
    if (isBOnShippedQty == true) {
      let qtyOrdered = $("#" + targetID + " .lineOrdered").val();
      let qtyShipped = $("#" + targetID + " .lineQty").val();
      let boValue = "";

      if (qtyOrdered == "" || isNaN(qtyOrdered)) {
        qtyOrdered = 0;
      }
      if (parseInt(qtyOrdered) < parseInt(qtyShipped)) {
        $("#" + targetID + " .lineQty").val(qtyOrdered);
        $("#" + targetID + " .lineBackOrder").val(0);
      } else if (parseInt(qtyShipped) <= parseInt(qtyOrdered)) {
        boValue = parseInt(qtyOrdered) - parseInt(qtyShipped);
        $("#" + targetID + " .lineBackOrder").val(boValue);
      }
    }

    let subGrandTotal = 0;
    let taxGrandTotal = 0;
    let subDiscountTotal = 0; // New Discount
    let taxGrandTotalPrint = 0;

    let subGrandTotalNet = 0;
    let taxGrandTotalNet = 0;
    $tblrows.each(function (index) {
      var $tblrow = $(this);
      let tdproduct = $tblrow.find(".lineProductName").val() || "";
      if (tdproduct != "") {
        var qty = $tblrow.find(".lineQty").val() || 0;
        var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
        var taxRate = $tblrow.find(".lineTaxCode").val();

        var taxrateamount = 0;
        if (taxcodeList) {
          for (var i = 0; i < taxcodeList.length; i++) {
            if (taxcodeList[i].codename == taxRate) {
              taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
            }
          }
        }

        var subTotal =
          parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        var taxTotal =
          parseFloat(qty, 10) *
          Number(price.replace(/[^0-9.-]+/g, "")) *
          parseFloat(taxrateamount);
        var lineDiscountPerc = parseFloat($tblrow.find(".lineDiscount").val()) || 0; // New Discount
        let lineTotalAmount = subTotal + taxTotal;
        let lineDiscountTotal = lineDiscountPerc / 100;
        var discountTotal = lineTotalAmount * lineDiscountTotal;
        var subTotalWithDiscount = subTotal * lineDiscountTotal || 0;
        var subTotalWithDiscountTotalLine = subTotal - subTotalWithDiscount || 0;
        var taxTotalWithDiscount = taxTotal * lineDiscountTotal || 0;
        var taxTotalWithDiscountTotalLine = taxTotal - taxTotalWithDiscount;
        if (!isNaN(discountTotal)) {
          subDiscountTotal += isNaN(discountTotal) ? 0 : discountTotal;
          document.getElementById("subtotal_discount").innerHTML = utilityService.modifynegativeCurrencyFormat(subDiscountTotal);
        }
        $tblrow
          .find(".lineTaxAmount")
          .text(
            utilityService.modifynegativeCurrencyFormat(
              taxTotalWithDiscountTotalLine
            )
          );

        let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) || 0;
        let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc || 0;
        $tblrow
          .find(".colUnitPriceExChange")
          .val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
        $tblrow
          .find(".colUnitPriceIncChange")
          .val(
            utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal)
          );

        if (!isNaN(subTotal)) {
          $tblrow
            .find(".colAmountEx")
            .text(utilityService.modifynegativeCurrencyFormat(subTotal));
          $tblrow
            .find(".colAmountInc")
            .text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
          subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ?
            0 :
            subTotalWithDiscountTotalLine;
          subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
          document.getElementById("subtotal_total").innerHTML =
            utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
        }

        if (!isNaN(taxTotal)) {
          taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ?
            0 :
            taxTotalWithDiscountTotalLine;
          taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
          document.getElementById("subtotal_tax").innerHTML =
            utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
        }

        if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
          let GrandTotal =
            parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
          let GrandTotalNet =
            parseFloat(subGrandTotalNet) + parseFloat(taxGrandTotalNet);
          document.getElementById("subtotal_nett").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
          document.getElementById("grandTotal").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("balanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("totalBalanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
        }
      }
    });

    $printrows.each(function (index) {
      var $printrows = $(this);
      var qty = $printrows.find("#lineQty").text() || 0;
      var price = $printrows.find("#lineUnitPrice").text() || "0";
      var taxrateamount = 0;
      var taxcode = $printrows.find("#lineTaxCode").text();
      if (taxcodeList) {
        for (var i = 0; i < taxcodeList.length; i++) {
          if (taxcodeList[i].codename == taxcode) {
            taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
          }
        }
      }
      var subTotal =
        parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
      var taxTotal =
        parseFloat(qty, 10) *
        Number(price.replace(/[^0-9.-]+/g, "")) *
        parseFloat(taxrateamount);
      $printrows
        .find("#lineTaxAmount")
        .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
      if (!isNaN(subTotal)) {
        $printrows
          .find("#lineAmt")
          .text(utilityService.modifynegativeCurrencyFormat(subTotal));
        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
        document.getElementById("subtotal_totalPrint").innerHTML =
          $("#subtotal_total").text();
      }

      if (!isNaN(taxTotal)) {
        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
        document.getElementById("totalTax_totalPrint").innerHTML =
          utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
      }
      if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
        document.getElementById("grandTotalPrint").innerHTML =
          $("#grandTotal").text();
        document.getElementById("totalBalanceDuePrint").innerHTML =
          $("#totalBalanceDue").text();
      }
    });
  },
  "blur .lineOrdered": function (event) {
    let templateObject = Template.instance();
    let taxcodeList = templateObject.taxraterecords.get();
    let utilityService = new UtilityService();
    let $tblrows = $("#tblInvoiceLine tbody tr");
    let isBOnShippedQty = templateObject.includeBOnShippedQty.get();
    var targetID = $(event.target).closest("tr").attr("id");
    if (isBOnShippedQty == true) {
      let qtyOrdered = $("#" + targetID + " .lineOrdered").val();
      let qtyShipped = $("#" + targetID + " .lineQty").val();
      let boValue = "";

      if (qtyOrdered == "" || isNaN(qtyOrdered)) {
        qtyOrdered = 0;
      }
      if (parseInt(qtyOrdered) < parseInt(qtyShipped)) {
        $("#" + targetID + " .lineQty").val(qtyOrdered);
        $("#" + targetID + " .lineBackOrder").val(0);
      } else if (parseInt(qtyShipped) <= parseInt(qtyOrdered)) {
        boValue = parseInt(qtyOrdered) - parseInt(qtyShipped);
        $("#" + targetID + " .lineBackOrder").val(boValue);
      }
    }

    let subGrandTotal = 0;
    let taxGrandTotal = 0;
    let subDiscountTotal = 0; // New Discount

    let subGrandTotalNet = 0;
    let taxGrandTotalNet = 0;
    $tblrows.each(function (index) {
      var $tblrow = $(this);
      let tdproduct = $tblrow.find(".lineProductName").val() || "";
      if (tdproduct != "") {
        var qty = $tblrow.find(".lineQty").val() || 0;
        var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
        var taxRate = $tblrow.find(".lineTaxCode").val();

        var taxrateamount = 0;
        if (taxcodeList) {
          for (var i = 0; i < taxcodeList.length; i++) {
            if (taxcodeList[i].codename == taxRate) {
              taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
            }
          }
        }

        var subTotal =
          parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        var taxTotal =
          parseFloat(qty, 10) *
          Number(price.replace(/[^0-9.-]+/g, "")) *
          parseFloat(taxrateamount);
        var lineDiscountPerc =
          parseFloat($tblrow.find(".lineDiscount").val()) || 0; // New Discount
        let lineTotalAmount = subTotal + taxTotal;

        let lineDiscountTotal = lineDiscountPerc / 100;

        var discountTotal = lineTotalAmount * lineDiscountTotal;
        var subTotalWithDiscount = subTotal * lineDiscountTotal || 0;
        var subTotalWithDiscountTotalLine =
          subTotal - subTotalWithDiscount || 0;
        var taxTotalWithDiscount = taxTotal * lineDiscountTotal || 0;
        var taxTotalWithDiscountTotalLine = taxTotal - taxTotalWithDiscount;
        if (!isNaN(discountTotal)) {
          subDiscountTotal += isNaN(discountTotal) ? 0 : discountTotal;

          document.getElementById("subtotal_discount").innerHTML =
            utilityService.modifynegativeCurrencyFormat(subDiscountTotal);
        }
        $tblrow
          .find(".lineTaxAmount")
          .text(
            utilityService.modifynegativeCurrencyFormat(
              taxTotalWithDiscountTotalLine
            )
          );

        let unitPriceIncCalc =
          Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) ||
          0;
        let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc || 0;
        $tblrow
          .find(".colUnitPriceExChange")
          .val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
        $tblrow
          .find(".colUnitPriceIncChange")
          .val(
            utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal)
          );

        if (!isNaN(subTotal)) {
          $tblrow
            .find(".colAmountEx")
            .text(utilityService.modifynegativeCurrencyFormat(subTotal));
          $tblrow
            .find(".colAmountInc")
            .text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
          subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ?
            0 :
            subTotalWithDiscountTotalLine;
          subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
          document.getElementById("subtotal_total").innerHTML =
            utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
        }

        if (!isNaN(taxTotal)) {
          taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ?
            0 :
            taxTotalWithDiscountTotalLine;
          taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
          document.getElementById("subtotal_tax").innerHTML =
            utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
        }

        if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
          let GrandTotal =
            parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
          let GrandTotalNet =
            parseFloat(subGrandTotalNet) + parseFloat(taxGrandTotalNet);
          document.getElementById("subtotal_nett").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
          document.getElementById("grandTotal").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("balanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("totalBalanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
        }
      }
    });
  },
  "blur .lineDiscount": function (event) {
    let templateObject = Template.instance();
    let taxcodeList = templateObject.taxraterecords.get();
    let utilityService = new UtilityService();
    let $tblrows = $("#tblInvoiceLine tbody tr");
    let $printrows = $(".invoice_print tbody tr");
    let subGrandTotal = 0;
    let taxGrandTotal = 0;
    let subDiscountTotal = 0; // New Discount
    let taxGrandTotalPrint = 0;

    let subGrandTotalNet = 0;
    let taxGrandTotalNet = 0;
    $tblrows.each(function (index) {
      var $tblrow = $(this);
      let tdproduct = $tblrow.find(".lineProductName").val() || "";
      if (tdproduct != "") {
        var qty = $tblrow.find(".lineQty").val() || 0;
        var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
        var taxRate = $tblrow.find(".lineTaxCode").val();

        var taxrateamount = 0;
        if (taxcodeList) {
          for (var i = 0; i < taxcodeList.length; i++) {
            if (taxcodeList[i].codename == taxRate) {
              taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
            }
          }
        }

        var subTotal =
          parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        var taxTotal =
          parseFloat(qty, 10) *
          Number(price.replace(/[^0-9.-]+/g, "")) *
          parseFloat(taxrateamount);
        var lineDiscountPerc =
          parseFloat($tblrow.find(".lineDiscount").val()) || 0; // New Discount
        let lineTotalAmount = subTotal + taxTotal;

        let lineDiscountTotal = lineDiscountPerc / 100;

        var discountTotal = lineTotalAmount * lineDiscountTotal;
        var subTotalWithDiscount = subTotal * lineDiscountTotal || 0;
        var subTotalWithDiscountTotalLine =
          subTotal - subTotalWithDiscount || 0;
        var taxTotalWithDiscount = taxTotal * lineDiscountTotal || 0;
        var taxTotalWithDiscountTotalLine = taxTotal - taxTotalWithDiscount;
        if (!isNaN(discountTotal)) {
          subDiscountTotal += isNaN(discountTotal) ? 0 : discountTotal;

          document.getElementById("subtotal_discount").innerHTML =
            utilityService.modifynegativeCurrencyFormat(subDiscountTotal);
        }
        $tblrow.find(".lineTaxAmount").text(utilityService.modifynegativeCurrencyFormat(taxTotalWithDiscountTotalLine));

        let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) || 0;
        let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc || 0;
        $tblrow.find(".colUnitPriceExChange").val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
        $tblrow.find(".colUnitPriceIncChange").val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

        if (!isNaN(subTotal)) {
          $tblrow.find(".colAmountEx").text(utilityService.modifynegativeCurrencyFormat(subTotal));
          $tblrow.find(".colAmountInc").text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
          subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ? 0 : subTotalWithDiscountTotalLine;
          subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
          document.getElementById("subtotal_total").innerHTML =
            utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
        }

        if (!isNaN(taxTotal)) {
          taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
          taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
          document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
        }

        if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
          let GrandTotal =
            parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
          let GrandTotalNet =
            parseFloat(subGrandTotalNet) + parseFloat(taxGrandTotalNet);
          document.getElementById("subtotal_nett").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
          document.getElementById("grandTotal").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("balanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("totalBalanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
        }
      }
    });

    $printrows.each(function (index) {
      var $printrows = $(this);
      var qty = $printrows.find("#lineQty").text() || 0;
      var price = $printrows.find("#lineUnitPrice").text() || "0";
      var taxrateamount = 0;
      var taxcode = $printrows.find("#lineTaxCode").text();
      if (taxcodeList) {
        for (var i = 0; i < taxcodeList.length; i++) {
          if (taxcodeList[i].codename == taxcode) {
            taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
          }
        }
      }
      var subTotal =
        parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
      var taxTotal =
        parseFloat(qty, 10) *
        Number(price.replace(/[^0-9.-]+/g, "")) *
        parseFloat(taxrateamount);
      $printrows
        .find("#lineTaxAmount")
        .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
      if (!isNaN(subTotal)) {
        $printrows
          .find("#lineAmt")
          .text(utilityService.modifynegativeCurrencyFormat(subTotal));
        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
        document.getElementById("subtotal_totalPrint").innerHTML =
          $("#subtotal_total").text();
      }

      if (!isNaN(taxTotal)) {
        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
        document.getElementById("totalTax_totalPrint").innerHTML =
          utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
      }
      if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
        document.getElementById("grandTotalPrint").innerHTML =
          $("#grandTotal").text();
        document.getElementById("totalBalanceDuePrint").innerHTML =
          $("#totalBalanceDue").text();
      }
    });
  },
  "change .colUnitPriceExChange": function (event) {
    let utilityService = new UtilityService();
    let inputUnitPrice = 0;
    if (!isNaN($(event.target).val())) {
      inputUnitPrice = parseFloat($(event.target).val()) || 0;
      $(event.target).val(
        utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
      );
    } else {
      inputUnitPrice =
        Number(
          $(event.target)
            .val()
            .replace(/[^0-9.-]+/g, "")
        ) || 0;

      $(event.target).val(
        utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
      );
    }
    let templateObject = Template.instance();
    let taxcodeList = templateObject.taxraterecords.get();
    let $tblrows = $("#tblInvoiceLine tbody tr");
    let $printrows = $(".invoice_print tbody tr");
    var targetID = $(event.target).closest("tr").attr("id"); // table row ID
    let subGrandTotal = 0;
    let taxGrandTotal = 0;
    let subDiscountTotal = 0; // New Discount
    let taxGrandTotalPrint = 0;

    $("#" + targetID + " #lineUnitPrice").text(
      $("#" + targetID + " .colUnitPriceExChange").val()
    );

    let subGrandTotalNet = 0;
    let taxGrandTotalNet = 0;
    $tblrows.each(function (index) {
      var $tblrow = $(this);
      let tdproduct = $tblrow.find(".lineProductName").val() || "";
      if (tdproduct != "") {
        var qty = $tblrow.find(".lineQty").val() || 0;
        var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
        var taxRate = $tblrow.find(".lineTaxCode").val();

        var taxrateamount = 0;
        if (taxcodeList) {
          for (var i = 0; i < taxcodeList.length; i++) {
            if (taxcodeList[i].codename == taxRate) {
              taxrateamount =
                taxcodeList[i].coderate.replace("%", "") / 100 || 0;
            }
          }
        }

        var subTotal =
          parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        var taxTotal =
          parseFloat(qty, 10) *
          Number(price.replace(/[^0-9.-]+/g, "")) *
          parseFloat(taxrateamount);
        var lineDiscountPerc =
          parseFloat($tblrow.find(".lineDiscount").val()) || 0; // New Discount
        let lineTotalAmount = subTotal + taxTotal;

        let lineDiscountTotal = lineDiscountPerc / 100;

        var discountTotal = lineTotalAmount * lineDiscountTotal;
        var subTotalWithDiscount = subTotal * lineDiscountTotal || 0;
        var subTotalWithDiscountTotalLine =
          subTotal - subTotalWithDiscount || 0;
        var taxTotalWithDiscount = taxTotal * lineDiscountTotal || 0;
        var taxTotalWithDiscountTotalLine = taxTotal - taxTotalWithDiscount;
        if (!isNaN(discountTotal)) {
          subDiscountTotal += isNaN(discountTotal) ? 0 : discountTotal;

          document.getElementById("subtotal_discount").innerHTML =
            utilityService.modifynegativeCurrencyFormat(subDiscountTotal);
        }
        $tblrow
          .find(".lineTaxAmount")
          .text(
            utilityService.modifynegativeCurrencyFormat(
              taxTotalWithDiscountTotalLine
            )
          );

        let unitPriceIncCalc =
          Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) ||
          0;
        let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc || 0;
        $tblrow
          .find(".colUnitPriceExChange")
          .val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
        $tblrow
          .find(".colUnitPriceIncChange")
          .val(
            utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal)
          );

        if (!isNaN(subTotal)) {
          $tblrow
            .find(".colAmountEx")
            .text(utilityService.modifynegativeCurrencyFormat(subTotal));
          $tblrow
            .find(".colAmountInc")
            .text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
          subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ?
            0 :
            subTotalWithDiscountTotalLine;
          subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
          document.getElementById("subtotal_total").innerHTML =
            utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
        }

        if (!isNaN(taxTotal)) {
          taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ?
            0 :
            taxTotalWithDiscountTotalLine;
          taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
          document.getElementById("subtotal_tax").innerHTML =
            utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
        }

        if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
          let GrandTotal =
            parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
          let GrandTotalNet =
            parseFloat(subGrandTotalNet) + parseFloat(taxGrandTotalNet);
          document.getElementById("subtotal_nett").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
          document.getElementById("grandTotal").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("balanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("totalBalanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
        }
      }
    });

    $printrows.each(function (index) {
      var $printrows = $(this);
      var qty = $printrows.find("#lineQty").text() || 0;
      var price = $printrows.find("#lineUnitPrice").text() || "0";
      var taxrateamount = 0;
      var taxRate = $printrows.find("#lineTaxCode").text();
      if (taxcodeList) {
        for (var i = 0; i < taxcodeList.length; i++) {
          if (taxcodeList[i].codename == taxRate) {
            taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
          }
        }
      }

      var subTotal =
        parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
      var taxTotal =
        parseFloat(qty, 10) *
        Number(price.replace(/[^0-9.-]+/g, "")) *
        parseFloat(taxrateamount);
      $printrows
        .find("#lineTaxAmount")
        .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
      if (!isNaN(subTotal)) {
        $printrows
          .find("#lineAmt")
          .text(utilityService.modifynegativeCurrencyFormat(subTotal));
        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
        document.getElementById("subtotal_totalPrint").innerHTML =
          $("#subtotal_total").text();
      }

      if (!isNaN(taxTotal)) {
        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
        document.getElementById("totalTax_totalPrint").innerHTML =
          utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
      }
      if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
        document.getElementById("grandTotalPrint").innerHTML =
          $("#grandTotal").text();
        document.getElementById("totalBalanceDuePrint").innerHTML =
          $("#totalBalanceDue").text();
      }
    });
  },
  "change .colUnitPriceIncChange": function (event) {
    let utilityService = new UtilityService();
    let inputUnitPrice = 0;
    if (!isNaN($(event.target).val())) {
      inputUnitPrice = parseFloat($(event.target).val()) || 0;
      $(event.target).val(
        utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
      );
    } else {
      inputUnitPrice =
        Number(
          $(event.target)
            .val()
            .replace(/[^0-9.-]+/g, "")
        ) || 0;

      $(event.target).val(
        utilityService.modifynegativeCurrencyFormat(inputUnitPrice)
      );
    }
    let templateObject = Template.instance();
    let taxcodeList = templateObject.taxraterecords.get();
    let $tblrows = $("#tblInvoiceLine tbody tr");
    let $printrows = $(".invoice_print tbody tr");
    var targetID = $(event.target).closest("tr").attr("id"); // table row ID
    let subGrandTotal = 0;
    let taxGrandTotal = 0;
    let subDiscountTotal = 0; // New Discount
    let taxGrandTotalPrint = 0;

    let subGrandTotalNet = 0;
    let taxGrandTotalNet = 0;
    $tblrows.each(function (index) {
      var $tblrow = $(this);
      let tdproduct = $tblrow.find(".lineProductName").val() || "";
      if (tdproduct != "") {
        var qty = $tblrow.find(".lineQty").val() || 0;
        var price = $tblrow.find(".colUnitPriceIncChange").val() || 0;
        var taxRate = $tblrow.find(".lineTaxCode").val();

        var taxrateamount = 0;
        if (taxcodeList) {
          for (var i = 0; i < taxcodeList.length; i++) {
            if (taxcodeList[i].codename == taxRate) {
              taxrateamount = taxcodeList[i].coderate.replace("%", "");
            }
          }
        }

        let taxRateAmountCalc = (parseFloat(taxrateamount) + 100) / 100;

        var subTotal =
          (parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, ""))) /
          taxRateAmountCalc || 0;
        var taxTotal =
          parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) -
          parseFloat(subTotal) || 0;

        var subTotalExQty =
          parseFloat(price.replace(/[^0-9.-]+/g, "")) / taxRateAmountCalc || 0;
        var taxTotalExQty =
          parseFloat(price.replace(/[^0-9.-]+/g, "")) -
          parseFloat(subTotalExQty) || 0;

        var lineDiscountPerc =
          parseFloat($tblrow.find(".lineDiscount").val()) || 0; // New Discount
        let lineTotalAmount = subTotal + taxTotal;

        let lineDiscountTotal = lineDiscountPerc / 100;

        var discountTotal = lineTotalAmount * lineDiscountTotal;
        var subTotalWithDiscount = subTotal * lineDiscountTotal || 0;
        var subTotalWithDiscountTotalLine =
          subTotal - subTotalWithDiscount || 0;
        var taxTotalWithDiscount = taxTotal * lineDiscountTotal || 0;
        var taxTotalWithDiscountTotalLine = taxTotal - taxTotalWithDiscount;
        if (!isNaN(discountTotal)) {
          subDiscountTotal += isNaN(discountTotal) ? 0 : discountTotal;

          document.getElementById("subtotal_discount").innerHTML =
            utilityService.modifynegativeCurrencyFormat(subDiscountTotal);
        }
        $tblrow
          .find(".lineTaxAmount")
          .text(
            utilityService.modifynegativeCurrencyFormat(
              taxTotalWithDiscountTotalLine
            )
          );

        let lineUnitPriceIncVal = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
        let lineUnitPriceExVal = lineUnitPriceIncVal - taxTotalExQty || 0;
        $tblrow
          .find(".colUnitPriceExChange")
          .val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
        $tblrow
          .find(".colUnitPriceIncChange")
          .val(
            utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal)
          );

        if (!isNaN(subTotal)) {
          $tblrow
            .find(".colAmountEx")
            .text(utilityService.modifynegativeCurrencyFormat(subTotal));
          $tblrow
            .find(".colAmountInc")
            .text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
          subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ?
            0 :
            subTotalWithDiscountTotalLine;
          subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
          document.getElementById("subtotal_total").innerHTML =
            utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
        }

        if (!isNaN(taxTotal)) {
          taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ?
            0 :
            taxTotalWithDiscountTotalLine;
          taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
          document.getElementById("subtotal_tax").innerHTML =
            utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
        }

        if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
          let GrandTotal =
            parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
          let GrandTotalNet =
            parseFloat(subGrandTotalNet) + parseFloat(taxGrandTotalNet);
          document.getElementById("subtotal_nett").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
          document.getElementById("grandTotal").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("balanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
          document.getElementById("totalBalanceDue").innerHTML =
            utilityService.modifynegativeCurrencyFormat(GrandTotal);
        }
      }
    });

    $("#" + targetID + " #lineUnitPrice").text(
      $("#" + targetID + " .colUnitPriceExChange").val()
    );

    $printrows.each(function (index) {
      var $printrows = $(this);
      var qty = $printrows.find("#lineQty").text() || 0;
      var price = $printrows.find("#lineUnitPrice").text() || "0";
      var taxrateamount = 0;
      var taxRate = $printrows.find("#lineTaxCode").text();
      if (taxcodeList) {
        for (var i = 0; i < taxcodeList.length; i++) {
          if (taxcodeList[i].codename == taxRate) {
            taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
          }
        }
      }

      var subTotal =
        parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
      var taxTotal =
        parseFloat(qty, 10) *
        Number(price.replace(/[^0-9.-]+/g, "")) *
        parseFloat(taxrateamount);
      $printrows
        .find("#lineTaxAmount")
        .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
      if (!isNaN(subTotal)) {
        $printrows
          .find("#lineAmt")
          .text(utilityService.modifynegativeCurrencyFormat(subTotal));
        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
        document.getElementById("subtotal_totalPrint").innerHTML =
          $("#subtotal_total").text();
      }

      if (!isNaN(taxTotal)) {
        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
        document.getElementById("totalTax_totalPrint").innerHTML =
          utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
      }
      if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
        document.getElementById("grandTotalPrint").innerHTML =
          $("#grandTotal").text();
        document.getElementById("totalBalanceDuePrint").innerHTML =
          $("#totalBalanceDue").text();
      }
    });
  },
 
  "click #btnCustomFileds": function (event) {
    var x = document.getElementById("divCustomFields");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  },
  "keydown .lineQty, keydown .lineUnitPrice, keydown .lineOrdered": function (
    event
  ) {
    if (
      $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      (event.keyCode === 65 &&
        (event.ctrlKey === true || event.metaKey === true)) ||
      (event.keyCode >= 35 && event.keyCode <= 40)
    ) {
      return;
    }

    if (event.shiftKey == true) {
      event.preventDefault();
    }

    if (
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode == 8 ||
      event.keyCode == 9 ||
      event.keyCode == 37 ||
      event.keyCode == 39 ||
      event.keyCode == 46 ||
      event.keyCode == 190 ||
      event.keyCode == 189 ||
      event.keyCode == 109
    ) { } else {
      event.preventDefault();
    }
  },
  "click .btnRemove": async function (event) {

    let templateObject = Template.instance();
    let taxcodeList = templateObject.taxraterecords.get();
    let utilityService = new UtilityService();
    var targetID = $(event.target).closest("tr").attr("id");
    $("#selectDeleteLineID").val(targetID);
    if (targetID != undefined) {
      times++;
      if (times == 1) {
        $("#deleteLineModal").modal("toggle");
      } else {
        if ($("#tblInvoiceLine tbody>tr").length > 1) {
          this.click;
          $(event.target).closest("tr").remove();
          $(".invoice_print #" + targetID).remove();
          event.preventDefault();
          let $tblrows = $("#tblInvoiceLine tbody tr");
          let $printrows = $(".invoice_print tbody tr");
          let subGrandTotal = 0;
          let taxGrandTotal = 0;
          let subDiscountTotal = 0; // New Discount
          let taxGrandTotalPrint = 0;

          let subGrandTotalNet = 0;
          let taxGrandTotalNet = 0;
          $tblrows.each(function (index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
            var taxRate = $tblrow.find(".lineTaxCode").val();

            var taxrateamount = 0;
            if (taxcodeList) {
              for (var i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename == taxRate) {
                  taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
                }
              }
            }

            var subTotal =
              parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal =
              parseFloat(qty, 10) *
              Number(price.replace(/[^0-9.-]+/g, "")) *
              parseFloat(taxrateamount);
            var lineDiscountPerc =
              parseFloat($tblrow.find(".lineDiscount").val()) || 0; // New Discount
            let lineTotalAmount = subTotal + taxTotal;

            let lineDiscountTotal = lineDiscountPerc / 100;

            var discountTotal = lineTotalAmount * lineDiscountTotal;
            var subTotalWithDiscount = subTotal * lineDiscountTotal || 0;
            var subTotalWithDiscountTotalLine =
              subTotal - subTotalWithDiscount || 0;
            var taxTotalWithDiscount = taxTotal * lineDiscountTotal || 0;
            var taxTotalWithDiscountTotalLine = taxTotal - taxTotalWithDiscount;
            if (!isNaN(discountTotal)) {
              subDiscountTotal += isNaN(discountTotal) ? 0 : discountTotal;

              document.getElementById("subtotal_discount").innerHTML =
                utilityService.modifynegativeCurrencyFormat(subDiscountTotal);
            }
            $tblrow
              .find(".lineTaxAmount")
              .text(
                utilityService.modifynegativeCurrencyFormat(
                  taxTotalWithDiscountTotalLine
                )
              );

            let unitPriceIncCalc =
              Number(price.replace(/[^0-9.-]+/g, "")) *
              parseFloat(taxrateamount) || 0;
            let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc || 0;
            $tblrow
              .find(".colUnitPriceExChange")
              .val(
                utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal)
              );
            $tblrow
              .find(".colUnitPriceIncChange")
              .val(
                utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal)
              );

            if (!isNaN(subTotal)) {
              $tblrow
                .find(".colAmountEx")
                .text(utilityService.modifynegativeCurrencyFormat(subTotal));
              $tblrow
                .find(".colAmountInc")
                .text(
                  utilityService.modifynegativeCurrencyFormat(lineTotalAmount)
                );
              subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ?
                0 :
                subTotalWithDiscountTotalLine;
              subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
              document.getElementById("subtotal_total").innerHTML =
                utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
            }

            if (!isNaN(taxTotal)) {
              taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ?
                0 :
                taxTotalWithDiscountTotalLine;
              taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
              document.getElementById("subtotal_tax").innerHTML =
                utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
            }

            if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
              let GrandTotal =
                parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
              let GrandTotalNet =
                parseFloat(subGrandTotalNet) + parseFloat(taxGrandTotalNet);
              document.getElementById("subtotal_nett").innerHTML =
                utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
              document.getElementById("grandTotal").innerHTML =
                utilityService.modifynegativeCurrencyFormat(GrandTotal);
              document.getElementById("balanceDue").innerHTML =
                utilityService.modifynegativeCurrencyFormat(GrandTotal);
              document.getElementById("totalBalanceDue").innerHTML =
                utilityService.modifynegativeCurrencyFormat(GrandTotal);
            }
          });

          $printrows.each(function (index) {
            var $printrows = $(this);
            var qty = $printrows.find("#lineQty").text() || 0;
            var price = $printrows.find("#lineUnitPrice").text() || "0";
            var taxrateamount = 0;
            var taxRate = $printrows.find("#lineTaxCode").text();
            if (taxcodeList) {
              for (var i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename == taxRate) {
                  taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
                }
              }
            }
            var subTotal =
              parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal =
              parseFloat(qty, 10) *
              Number(price.replace(/[^0-9.-]+/g, "")) *
              parseFloat(taxrateamount);
            $printrows
              .find("#lineTaxAmount")
              .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
            if (!isNaN(subTotal)) {
              $printrows
                .find("#lineAmt")
                .text(utilityService.modifynegativeCurrencyFormat(subTotal));
              subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
              document.getElementById("subtotal_totalPrint").innerHTML =
                $("#subtotal_total").text();
            }

            if (!isNaN(taxTotal)) {
              taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
              document.getElementById("totalTax_totalPrint").innerHTML =
                utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
            }
            if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
              let GrandTotal =
                parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
              document.getElementById("grandTotalPrint").innerHTML =
                $("#grandTotal").text();
              document.getElementById("totalBalanceDuePrint").innerHTML =
                $("#totalBalanceDue").text();
            }
          });
          return false;
        } else {
          $("#deleteLineModal").modal("toggle");
        }
      }
    } else {
      if (templateObject.hasFollow.get()) $("#footerDeleteModal2").modal("toggle");
      else $("#footerDeleteModal1").modal("toggle");
    }
  },
  "click .btnDeleteFollowingInvoices": async function (event) {
    playDeleteAudio();
    var currentDate = new Date();
    let salesService = new SalesBoardService();
    setTimeout(async function () {

      swal({
        title: 'You are deleting ' + $("#following_cnt").val() + ' invoices',
        text: "Do you wish to delete this transaction and all others associated with it moving forward?",
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then(async (result) => {
        if (result.value) {
          var url = FlowRouter.current().path;
          var getso_id = url.split("?id=");
          var currentInvoice = getso_id[getso_id.length - 1];
          var objDetails = "";
          if (getso_id[1]) {
            $('.deleteloadingbar').css('width', ('0%')).attr('aria-valuenow', 0);
            $("#deleteLineModal").modal('hide');
            $("#deleteprogressbar").css('display', 'block');
            $("#deleteprogressbar").modal('show');
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
            var j = 0;
            for (var i = 0; i < invList.length; i++) {
              var objDetails = {
                type: "TInvoiceEx",
                fields: {
                  ID: invList[i].SaleID,
                  Deleted: true,
                },
              };
              j ++;
              document.getElementsByClassName("deleteprogressBarInner")[0].innerHTML = j + '';
              $('.deleteloadingbar').css('width', ((100/invList.length*j)) + '%').attr('aria-valuenow', ((100/invList.length*j)));
              var result = await salesService.saveInvoiceEx(objDetails);
              // var result = await salesService.saveInvoiceEx(objDetails);
            }
          }
          // if (FlowRouter.current().queryParams.trans) {
          //   FlowRouter.go(
          //     "/customerscard?id=" +
          //     FlowRouter.current().queryParams.trans +
          //     "&transTab=active"
          //   );
          // } else {
          //   FlowRouter.go("/invoicelist?success=true");
          // }
          // $('.modal-backdrop').css('display', 'none');
          // $("#deleteLineModal").modal("toggle");
          $("#deletecheckmarkwrapper").removeClass('hide');
          $('.modal-backdrop').css('display', 'none');
          $("#deleteprogressbar").modal('hide');
          $("#btn_data").click();
        }
      });
    }, delayTimeAfterSound);
  },
  "click .btnDeleteInvoice2": function (event) {
    playDeleteAudio();
    let templateObject = Template.instance();
    let salesService = new SalesBoardService();
    setTimeout(function () {
      $(".fullScreenSpin").css("display", "inline-block");

      var url = FlowRouter.current().path;
      var getso_id = url.split("?id=");
      var currentInvoice = getso_id[getso_id.length - 1];
      var objDetails = "";
      if (getso_id[1]) {
        currentInvoice = parseInt(currentInvoice);
        var objDetails = {
          type: "TInvoiceEx",
          fields: {
            ID: currentInvoice,
            Deleted: true,
          },
        };

        salesService
          .saveInvoiceEx(objDetails)
          .then(function (objDetails) {
            if (FlowRouter.current().queryParams.trans) {
              FlowRouter.go(
                "/customerscard?id=" +
                FlowRouter.current().queryParams.trans +
                "&transTab=active"
              );
            } else {
              FlowRouter.go("/invoicelist?success=true");
            }
          })
          .catch(function (err) {
            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
                if (err === checkResponseError) {
                  window.open("/", "_self");
                }
              } else if (result.dismiss === "cancel") { }
            });
            $(".fullScreenSpin").css("display", "none");
          });
      } else {
        if (FlowRouter.current().queryParams.trans) {
          FlowRouter.go(
            "/customerscard?id=" +
            FlowRouter.current().queryParams.trans +
            "&transTab=active"
          );
        } else {
          FlowRouter.go("/invoicelist?success=true");
        }
      }
    }, delayTimeAfterSound);
  },
  "click .btnDeleteInvoice": function (event) {
    playDeleteAudio();
    let salesService = new SalesBoardService();
    setTimeout(function () {
      $(".fullScreenSpin").css("display", "inline-block");

      var url = FlowRouter.current().path;
      var getso_id = url.split("?id=");
      var currentInvoice = getso_id[getso_id.length - 1];
      var objDetails = "";
      if (getso_id[1]) {
        currentInvoice = parseInt(currentInvoice);
        var objDetails = {
          type: "TInvoiceEx",
          fields: {
            ID: currentInvoice,
            Deleted: true,
          },
        };

        salesService
          .saveInvoiceEx(objDetails)
          .then(function (objDetails) {
            if (FlowRouter.current().queryParams.trans) {
              FlowRouter.go(
                "/customerscard?id=" +
                FlowRouter.current().queryParams.trans +
                "&transTab=active"
              );
            } else {
              FlowRouter.go("/invoicelist?success=true");
            }
          })
          .catch(function (err) {
            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
                if (err === checkResponseError) {
                  window.open("/", "_self");
                }
              } else if (result.dismiss === "cancel") { }
            });
            $(".fullScreenSpin").css("display", "none");
          });
      } else {
        if (FlowRouter.current().queryParams.trans) {
          FlowRouter.go(
            "/customerscard?id=" +
            FlowRouter.current().queryParams.trans +
            "&transTab=active"
          );
        } else {
          FlowRouter.go("/invoicelist?success=true");
        }
      }
      $("#deleteLineModal").modal("toggle");
      $('.modal-backdrop').css('display', 'none');
    }, delayTimeAfterSound);
  },
  "click .btnDeleteLine": function (event) {
    playDeleteAudio();
    let templateObject = Template.instance();
    let utilityService = new UtilityService();
    setTimeout(function () {

      let taxcodeList = templateObject.taxraterecords.get();
      let selectLineID = $("#selectDeleteLineID").val();
      if ($("#tblInvoiceLine tbody>tr").length > 1) {
        this.click;

        $("#" + selectLineID)
          .closest("tr")
          .remove();
        $("#deleteLineModal").modal("toggle");
        let $tblrows = $("#tblInvoiceLine tbody tr");
        let $printrows = $(".invoice_print tbody tr");
        $(".invoice_print #" + selectLineID).remove();
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let subDiscountTotal = 0; // New Discount
        let taxGrandTotalPrint = 0;

        let subGrandTotalNet = 0;
        let taxGrandTotalNet = 0;
        $tblrows.each(function (index) {
          var $tblrow = $(this);
          var qty = $tblrow.find(".lineQty").val() || 0;
          var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
          var taxRate = $tblrow.find(".lineTaxCode").val();

          var taxrateamount = 0;
          if (taxcodeList) {
            for (var i = 0; i < taxcodeList.length; i++) {
              if (taxcodeList[i].codename == taxRate) {
                taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
              }
            }
          }

          var subTotal =
            parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
          var taxTotal =
            parseFloat(qty, 10) *
            Number(price.replace(/[^0-9.-]+/g, "")) *
            parseFloat(taxrateamount);
          var lineDiscountPerc =
            parseFloat($tblrow.find(".lineDiscount").val()) || 0; // New Discount
          let lineTotalAmount = subTotal + taxTotal;

          let lineDiscountTotal = lineDiscountPerc / 100;

          var discountTotal = lineTotalAmount * lineDiscountTotal;
          var subTotalWithDiscount = subTotal * lineDiscountTotal || 0;
          var subTotalWithDiscountTotalLine =
            subTotal - subTotalWithDiscount || 0;
          var taxTotalWithDiscount = taxTotal * lineDiscountTotal || 0;
          var taxTotalWithDiscountTotalLine = taxTotal - taxTotalWithDiscount;
          if (!isNaN(discountTotal)) {
            subDiscountTotal += isNaN(discountTotal) ? 0 : discountTotal;

            document.getElementById("subtotal_discount").innerHTML =
              utilityService.modifynegativeCurrencyFormat(subDiscountTotal);
          }
          $tblrow
            .find(".lineTaxAmount")
            .text(
              utilityService.modifynegativeCurrencyFormat(
                taxTotalWithDiscountTotalLine
              )
            );

          let unitPriceIncCalc =
            Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount) ||
            0;
          let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
          let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc || 0;
          $tblrow
            .find(".colUnitPriceExChange")
            .val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
          $tblrow
            .find(".colUnitPriceIncChange")
            .val(
              utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal)
            );

          if (!isNaN(subTotal)) {
            $tblrow
              .find(".colAmountEx")
              .text(utilityService.modifynegativeCurrencyFormat(subTotal));
            $tblrow
              .find(".colAmountInc")
              .text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
            subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ?
              0 :
              subTotalWithDiscountTotalLine;
            subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
            document.getElementById("subtotal_total").innerHTML =
              utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
          }

          if (!isNaN(taxTotal)) {
            taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ?
              0 :
              taxTotalWithDiscountTotalLine;
            taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
            document.getElementById("subtotal_tax").innerHTML =
              utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
          }

          if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
            let GrandTotal =
              parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
            let GrandTotalNet =
              parseFloat(subGrandTotalNet) + parseFloat(taxGrandTotalNet);
            document.getElementById("subtotal_nett").innerHTML =
              utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
            document.getElementById("grandTotal").innerHTML =
              utilityService.modifynegativeCurrencyFormat(GrandTotal);
            document.getElementById("balanceDue").innerHTML =
              utilityService.modifynegativeCurrencyFormat(GrandTotal);
            document.getElementById("totalBalanceDue").innerHTML =
              utilityService.modifynegativeCurrencyFormat(GrandTotal);
          }
        });

        $printrows.each(function (index) {
          var $printrows = $(this);
          var qty = $printrows.find("#lineQty").text() || 0;
          var price = $printrows.find("#lineUnitPrice").text() || "0";
          var taxrateamount = 0;
          var taxRate = $printrows.find("#lineTaxCode").text();
          if (taxcodeList) {
            for (var i = 0; i < taxcodeList.length; i++) {
              if (taxcodeList[i].codename == taxRate) {
                taxrateamount = taxcodeList[i].coderate.replace("%", "") / 100;
              }
            }
          }
          var subTotal =
            parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
          var taxTotal =
            parseFloat(qty, 10) *
            Number(price.replace(/[^0-9.-]+/g, "")) *
            parseFloat(taxrateamount);
          $printrows
            .find("#lineTaxAmount")
            .text(utilityService.modifynegativeCurrencyFormat(taxTotal));
          if (!isNaN(subTotal)) {
            $printrows
              .find("#lineAmt")
              .text(utilityService.modifynegativeCurrencyFormat(subTotal));
            subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
            document.getElementById("subtotal_totalPrint").innerHTML =
              $("#subtotal_total").text();
          }

          if (!isNaN(taxTotal)) {
            taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
            document.getElementById("totalTax_totalPrint").innerHTML =
              utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
          }
          if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
            let GrandTotal =
              parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
            document.getElementById("grandTotalPrint").innerHTML =
              $("#grandTotal").text();
            document.getElementById("totalBalanceDuePrint").innerHTML =
              $("#totalBalanceDue").text();
          }
        });
      } else {
        this.click;
        $("#" + selectLineID + " .lineProductName").val("");
        $("#" + selectLineID + " .lineProductDesc").text("");
        $("#" + selectLineID + " .lineOrdered").val("");
        $("#" + selectLineID + " .lineQty").val("");
        $("#" + selectLineID + " .lineBackOrder").val("");
        $("#" + selectLineID + " .lineUnitPrice").val("");
        $("#" + selectLineID + " .lineCostPrice").val("");
        $("#" + selectLineID + " .lineSalesLinesCustField1").text("");
        $("#" + selectLineID + " .lineTaxRate").text("");
        $("#" + selectLineID + " .lineTaxCode").val("");
        $("#" + selectLineID + " .lineAmt").text("");
        $("#" + selectLineID + " .lineTaxAmount").text("");
        $("#" + selectLineID + " .lineDiscount").val("");

        document.getElementById("subtotal_tax").innerHTML = Currency + "0.00";
        document.getElementById("subtotal_total").innerHTML = Currency + "0.00";
        document.getElementById("grandTotal").innerHTML = Currency + "0.00";
        document.getElementById("balanceDue").innerHTML = Currency + "0.00";
        document.getElementById("totalBalanceDue").innerHTML = Currency + "0.00";
        $("#deleteLineModal").modal("toggle");
      }

    }, delayTimeAfterSound);
  },
  // display settings
  
  "click #btnPayment": function (e) {
    var currenturl = FlowRouter.current().path;
    var getcurrent_id = currenturl.split("?id=");
    let templateObject = Template.instance();
    let customername = $("#edtCustomerName");
    let salesService = new SalesBoardService();
    let termname = $("#sltTerms").val() || templateObject.defaultsaleterm.get();
    if (termname === "") {
      swal('Terms has not been selected!', '', 'warning');
      e.preventDefault();
      return false;
    }
    if (customername.val() === "") {
      swal('Supplier has not been selected!', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
    } else {
      $(".fullScreenSpin").css("display", "inline-block");
      var splashLineArray = new Array();
      let lineItemsForm = [];
      let lineItems = [];
      let lineItemObjForm = {};
      var saledateTime = new Date($("#dtSODate").datepicker("getDate"));

      var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

      let saleDate =
        saledateTime.getFullYear() +
        "-" +
        (saledateTime.getMonth() + 1) +
        "-" +
        saledateTime.getDate();

      let checkBackOrder = templateObject.includeBOnShippedQty.get();
      $("#tblInvoiceLine > tbody > tr").each(function () {
        var lineID = this.id;
        let tdproduct = $("#" + lineID + " .lineProductName").val();
        let tddescription = $("#" + lineID + " .lineProductDesc").text();
        let tdQty = $("#" + lineID + " .lineQty").val();

        let tdOrderd = $("#" + lineID + " .lineOrdered").val();

        let tdunitprice = $("#" + lineID + " .colUnitPriceExChange").val();
        let tdtaxCode = $("#" + lineID + " .lineTaxCode").val();
        let tdlineUnit = $("#" + lineID + " .lineUOM").text() || defaultUOM;
        let tdSalesLineCustField1 = $("#" + lineID + ". lineSalesLinesCustField1").text();
        lineItemObj = {
          description: tddescription || "",
          quantity: tdQty || 0,
          unitPrice: tdunitprice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }) || 0,
        };

        lineItems.push(lineItemObj);

        if (tdproduct != "") {
          if (checkBackOrder == true) {
            lineItemObjForm = {
              type: "TInvoiceLine",
              fields: {
                ProductName: tdproduct || "",
                ProductDescription: tddescription || "",
                UOMQtySold: parseFloat(tdOrderd) || 0,
                UOMQtyShipped: parseFloat(tdQty) || 0,
                LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                Headershipdate: saleDate,
                LineTaxCode: tdtaxCode || "",
                DiscountPercent: parseFloat($("#" + lineID + " .lineDiscount").val()) || 0,
                UnitOfMeasure: tdlineUnit,
                SalesLinesCustField1: tdSalesLineCustField1,
              },
            };
          } else {
            lineItemObjForm = {
              type: "TInvoiceLine",
              fields: {
                ProductName: tdproduct || "",
                ProductDescription: tddescription || "",
                UOMQtySold: parseFloat(tdQty) || 0,
                UOMQtyShipped: parseFloat(tdQty) || 0,
                LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                Headershipdate: saleDate,
                LineTaxCode: tdtaxCode || "",
                DiscountPercent: parseFloat($("#" + lineID + " .lineDiscount").val()) || 0,
                UnitOfMeasure: tdlineUnit,
                SalesLinesCustField1: tdSalesLineCustField1,
              },
            };
          }

          lineItemsForm.push(lineItemObjForm);
          splashLineArray.push(lineItemObjForm);
        }
      });

      let getchkcustomField1 = true;
      let getchkcustomField2 = true;
      let getcustomField1 = $(".customField1Text").html();
      let getcustomField2 = $(".customField2Text").html();
      if ($("#formCheck-one").is(":checked")) {
        getchkcustomField1 = false;
      }
      if ($("#formCheck-two").is(":checked")) {
        getchkcustomField2 = false;
      }

      let customer = $("#edtCustomerName").val();
      let customerEmail = $("#edtCustomerEmail").val();
      let billingAddress = $("#txabillingAddress").val();

      let poNumber = $("#ponumber").val();
      let reference = $("#edtRef").val();

      let departement = $("#sltDept").val();
      let shippingAddress = $("#txaShipingInfo").val();
      let comments = $("#txaComment").val();
      let pickingInfrmation = $("#txapickmemo").val();

      let saleCustField1 = $("#edtSaleCustField1").val() || "";
      let saleCustField2 = $("#edtSaleCustField2").val() || "";
      let saleCustField3 = $("#edtSaleCustField3").val() || "";
      var url = FlowRouter.current().path;
      var getso_id = url.split("?id=");
      var currentInvoice = getso_id[getso_id.length - 1];
      let uploadedItems = templateObject.uploadedFiles.get();
      var currencyCode = $("#sltCurrency").val() || CountryAbbr;
      let ForeignExchangeRate = $('#exchange_rate').val() || 0;
      var objDetails = "";
      if (getso_id[1]) {
        currentInvoice = parseInt(currentInvoice);
        objDetails = {
          type: "TInvoiceEx",
          fields: {
            ID: currentInvoice,
            CustomerName: customer,
            ForeignExchangeCode: currencyCode,
            ForeignExchangeRate: parseFloat(ForeignExchangeRate),
            Lines: splashLineArray,
            InvoiceToDesc: billingAddress,
            SaleDate: saleDate,
            CustPONumber: poNumber,
            ReferenceNo: reference,
            TermsName: termname,
            SaleClassName: departement,
            ShipToDesc: shippingAddress,
            Comments: comments,
            SaleCustField1: saleCustField1,
            SaleCustField2: saleCustField2,
            SaleCustField3: saleCustField3,
            PickMemo: pickingInfrmation,
            Attachments: uploadedItems,
            SalesStatus: $("#sltStatus").val(),
          },
        };
      } else {
        objDetails = {
          type: "TInvoiceEx",
          fields: {
            CustomerName: customer,
            ForeignExchangeCode: currencyCode,
            ForeignExchangeRate: parseFloat(ForeignExchangeRate),
            Lines: splashLineArray,
            InvoiceToDesc: billingAddress,
            SaleDate: saleDate,
            CustPONumber: poNumber,
            ReferenceNo: reference,
            TermsName: termname,
            SaleClassName: departement,
            ShipToDesc: shippingAddress,
            Comments: comments,
            SaleCustField1: saleCustField1,
            SaleCustField2: saleCustField2,
            SaleCustField3: saleCustField3,
            PickMemo: pickingInfrmation,
            Attachments: uploadedItems,
            SalesStatus: $("#sltStatus").val(),
          },
        };
      }

      salesService
        .saveInvoiceEx(objDetails)
        .then(function (objDetails) {
          var customerID = $("#edtCustomerEmail").attr("customerid");
          $("#html-Invoice-pdfwrapper").css("display", "block");
          $(".pdfCustomerName").html($("#edtCustomerName").val());
          $(".pdfCustomerAddress").html(
            $("#txabillingAddress")
              .val()
              .replace(/[\r\n]/g, "<br />")
          );
          async function addAttachment() {
            let attachment = [];
            let invoiceId = objDetails.fields.ID;
            let encodedPdf = await generatePdfForMail(invoiceId);
            var reader = new FileReader();
            reader.readAsDataURL(encodedPdf);
            reader.onloadend = function () {
              var base64data = reader.result;
              base64data = base64data.split(",")[1];
            let pdfObject = {
              filename: "invoice-" + invoiceId + ".pdf",
              content: base64data,
              encoding: "base64",
            };
            attachment.push(pdfObject);
            let erpInvoiceId = objDetails.fields.ID;

            let mailFromName = localStorage.getItem("vs1companyName");
            let mailFrom = localStorage.getItem("VS1OrgEmail") || localStorage.getItem("VS1AdminUserName");
            let customerEmailName = $("#edtCustomerName").val();
            let checkEmailData = $("#edtCustomerEmail").val();
            let grandtotal = $("#grandTotal").html();
            let amountDueEmail = $("#totalBalanceDue").html();
            let emailDueDate = $("#dtDueDate").val();
            let customerBillingAddress = $("#txabillingAddress").val();
            let customerTerms = $("#sltTerms").val();

            let customerSubtotal = $("#subtotal_total").html();
            let customerTax = $("#subtotal_tax").html();
            let customerNett = $("#subtotal_nett").html();
            let customerTotal = $("#grandTotal").html();
            let mailSubject = "Invoice " + erpInvoiceId + " from " + mailFromName + " for " + customerEmailName;
            var htmlmailBody = generateHtmlMailBody(erpInvoiceId, emailDueDate, grandtotal, stripeGlobalURL, stringQuery, customerEmailName, mailFromName, customerBillingAddress, customerTerms, customerSubtotal, customerTax, customerNett, customerTotal)

              if ($(".chkEmailCopy").is(":checked") && $(".chkEmailRep").is(":checked")) {
                Meteor.call(
                  "sendEmail", {
                  from: "" + mailFromName + " <" + mailFrom + ">",
                  to: checkEmailData,
                  subject: mailSubject,
                  text: "",
                  html: htmlmailBody,
                  attachments: attachment,
                },
                  function (error, result) {
                    if (error && error.error === "error") { } else { }
                  }
                );

                Meteor.call(
                  "sendEmail", {
                  from: "" + mailFromName + " <" + mailFrom + ">",
                  to: mailFrom,
                  subject: mailSubject,
                  text: "",
                  html: htmlmailBody,
                  attachments: attachment,
                },
                  function (error, result) {
                    if (error && error.error === "error") { } else {
                      $("#html-Invoice-pdfwrapper").css("display", "none");
                      swal({
                        title: "SUCCESS",
                        text: "Email Sent To Customer: " +
                          checkEmailData +
                          " and User: " +
                          mailFrom +
                          "",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                      }).then((result) => {
                        if (result.value) { } else if (result.dismiss === "cancel") { }
                      });
                    }
                  }
                );
              } else if ($(".chkEmailCopy").is(":checked")) {
                Meteor.call(
                  "sendEmail", {
                  from: "" + mailFromName + " <" + mailFrom + ">",
                  to: checkEmailData,
                  subject: mailSubject,
                  text: "",
                  html: htmlmailBody,
                  attachments: attachment,
                },
                  function (error, result) {
                    if (error && error.error === "error") { } else {
                      $("#html-Invoice-pdfwrapper").css("display", "none");
                      swal({
                        title: "SUCCESS",
                        text: "Email Sent To Customer: " + checkEmailData + " ",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                      }).then((result) => {
                        if (result.value) { } else if (result.dismiss === "cancel") { }
                      });
                    }
                  }
                );
              } else if ($(".chkEmailRep").is(":checked")) {
                Meteor.call(
                  "sendEmail", {
                  from: "" + mailFromName + " <" + mailFrom + ">",
                  to: mailFrom,
                  subject: mailSubject,
                  text: "",
                  html: htmlmailBody,
                  attachments: attachment,
                },
                  function (error, result) {
                    if (error && error.error === "error") { } else {
                      $("#html-Invoice-pdfwrapper").css("display", "none");
                      swal({
                        title: "SUCCESS",
                        text: "Email Sent To User: " + mailFrom + " ",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                      }).then((result) => {
                        if (result.value) { } else if (result.dismiss === "cancel") { }
                      });
                    }
                  }
                );
              } else { }
            };
          }
          addAttachment();

          function generatePdfForMail(invoiceId) {
            return new Promise((resolve, reject) => {
              let doc = new jsPDF("p", "pt", "a4");
              doc.setFontSize(18);
              var source = document.getElementById("html-Invoice-pdfwrapper");
              doc.addHTML(source, function () {
                resolve(doc.output("blob"));
                $("#html-Invoice-pdfwrapper").css("display", "none");
              });
            });
          }
          if (customerID !== " ") { }
          let linesave = objDetails.fields.ID;

          sideBarService
            .getAllInvoiceList(initialDataLoad, 0)
            .then(function (data) {
              addVS1Data("TInvoiceEx", JSON.stringify(data))
                .then(function (datareturn) {
                  window.open("/paymentcard?invid=" + linesave, "_self");
                })
                .catch(function (err) {
                  window.open("/paymentcard?invid=" + linesave, "_self");
                });
            })
            .catch(function (err) {
              window.open("/paymentcard?invid=" + linesave, "_self");
            });
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: err,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              if (err === checkResponseError) {
                window.open("/", "_self");
              }
            } else if (result.dismiss === "cancel") { }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    }
  },
  "click #btnViewPayment": async function () {
    let salesService = new SalesBoardService();
    $(".fullScreenSpin").css("display", "inline-block");
    let paymentID = "";
    var url = FlowRouter.current().path;
    var getso_id = url.split("?id=");
    var currentInvoice = getso_id[getso_id.length - 1];
    let paymentData =
      (await salesService.getCheckPaymentLineByTransID(currentInvoice)) || "";

    if (paymentData) {
      for (let x = 0; x < paymentData.tcustomerpaymentline.length; x++) {
        if (paymentData.tcustomerpaymentline.length > 1) {
          paymentID = paymentData.tcustomerpaymentline[x].fields.Payment_ID;
          window.open("/paymentcard?id=" + paymentID, "_self");
        } else {
          paymentID = paymentData.tcustomerpaymentline[0].fields.Payment_ID;
          window.open("/paymentcard?id=" + paymentID, "_self");
        }
      }
    } else {
      $(".fullScreenSpin").css("display", "none");
    }
  },
  "click .btnTransactionPaid": async function () {
    let salesService = new SalesBoardService();
    $(".fullScreenSpin").css("display", "inline-block");
    let selectedSupplierPaymentID = [];
    let paymentID = "";
    var url = FlowRouter.current().path;
    var getso_id = url.split("?id=");
    var currentInvoice = getso_id[getso_id.length - 1];
    let suppliername = $("#edtCustomerName").val() || "";
    let paymentData =
      (await salesService.getCheckPaymentLineByTransID(currentInvoice)) || "";
    if (paymentData) {
      for (let x = 0; x < paymentData.tcustomerpaymentline.length; x++) {
        if (paymentData.tcustomerpaymentline.length > 1) {
          paymentID = paymentData.tcustomerpaymentline[x].fields.Payment_ID;
          selectedSupplierPaymentID.push(paymentID);
        } else {
          paymentID = paymentData.tcustomerpaymentline[0].fields.Payment_ID;
          window.open("/paymentcard?id=" + paymentID, "_self");
        }
      }

      setTimeout(function () {
        let selectPayID = selectedSupplierPaymentID;
        window.open(
          "/customerpayment?payment=" + selectPayID + "&name=" + suppliername,
          "_self"
        );
      }, 500);
    } else {
      $(".fullScreenSpin").css("display", "none");
    }
  },
  "click .btnBack": function (event) {
    playCancelAudio();
    event.preventDefault();
    setTimeout(function () {
      if (FlowRouter.current().queryParams.trans) {
        FlowRouter.go(
          "/customerscard?id=" +
          FlowRouter.current().queryParams.trans +
          "&transTab=active"
        );
      } else {
        history.back(1);
      }
    }, delayTimeAfterSound);
  },
  "click #btnCopyInvoice": async function () {
    playCopyAudio();
    setTimeout(async function () {
      // $("#basedOnFrequency").prop('checked', true);
      // $("#formCheck-monday").prop('checked', true);
      $('#edtFrequencyDetail').css('display', 'flex');
      // $(".ofMonthList input[type=checkbox]").each(function () {
      //   $(this).prop('checked', false);
      // });
      // $(".selectDays input[type=checkbox]").each(function () {
      //   $(this).prop('checked', true);
      // });
      $("#copyFrequencyModal").modal("toggle");
    }, delayTimeAfterSound);
  },
  'click .btnSaveFrequency': async function () {
    playSaveAudio();
    let templateObject = Template.instance();
    let startDate = '';
    let finishDate = '';
    let convertedStartDate = '';
    let convertedFinishDate = '';
    let monthDate = '';
    let ofMonths = '';
    let isFirst = true;
    let everyWeeks = '';
    let selectDays = '';
    let dailyRadioOption = '';
    let everyDays = '';

    let basedOnTypeAttr = 'F,';
    var erpGet = erpDb();
    let sDate2 = '';
    let fDate2 = '';
    setTimeout(async function () {
      let radioFrequency = $('input[type=radio][name=frequencyRadio]:checked').attr('id');
      frequencyVal = radioFrequency + '@';
      const values = basedOnTypeAttr.split(',');
      if (values.includes('F')) {
        if (radioFrequency == "frequencyMonthly") {
          isFirst = true;
          monthDate = $("#sltDay").val().replace('day', '');
          $(".ofMonthList input[type=checkbox]:checked").each(function () {
            ofMonths += isFirst ? $(this).val() : ',' + $(this).val();
            isFirst = false;
          });
          startDate = $('#edtMonthlyStartDate').val();
          finishDate = $('#edtMonthlyFinishDate').val();
          frequencyVal += monthDate + '@' + ofMonths;
        } else if (radioFrequency == "frequencyWeekly") {
          isFirst = true;
          everyWeeks = $("#weeklyEveryXWeeks").val();
          let sDay = -1;
          $(".selectDays input[type=checkbox]:checked").each(function () {
            sDay = templateObject.getDayNumber($(this).val());
            selectDays += isFirst ? sDay : ',' + sDay;
            isFirst = false;
          });
          startDate = $('#edtWeeklyStartDate').val();
          finishDate = $('#edtWeeklyFinishDate').val();
          frequencyVal += everyWeeks + '@' + selectDays;
        } else if (radioFrequency == "frequencyDaily") {
          dailyRadioOption = $('#dailySettings input[type=radio]:checked').attr('id');
          everyDays = $("#dailyEveryXDays").val();
          startDate = $('#edtDailyStartDate').val();
          finishDate = $('#edtDailyFinishDate').val();
          frequencyVal += dailyRadioOption + '@' + everyDays;
        } else if (radioFrequency == "frequencyOnetimeonly") {
          startDate = $('#edtOneTimeOnlyDate').val();
          finishDate = $('#edtOneTimeOnlyDate').val();
          $('#edtOneTimeOnlyTimeError').css('display', 'none');
          $('#edtOneTimeOnlyDateError').css('display', 'none');
          frequencyVal = radioFrequency;
        }
      }
      $('#copyFrequencyModal').modal('toggle');
      convertedStartDate = startDate ? startDate.split('/')[2] + '-' + startDate.split('/')[1] + '-' + startDate.split('/')[0] : '';
      convertedFinishDate = finishDate ? finishDate.split('/')[2] + '-' + finishDate.split('/')[1] + '-' + finishDate.split('/')[0] : '';
      sDate = convertedStartDate ? moment(convertedStartDate + ' ' + copyStartTime).format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm");
      fDate = convertedFinishDate ? moment(convertedFinishDate + ' ' + copyStartTime).format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm");
      sDate2 = convertedStartDate ? moment(convertedStartDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
      fDate2 = convertedFinishDate ? moment(convertedFinishDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
      $(".fullScreenSpin").css("display", "inline-block");
      var url = FlowRouter.current().path;
      if (
        url.indexOf("?id=") > 0 ||
        url.indexOf("?copyquid=") > 0 ||
        url.indexOf("?copyinvid=")
      ) {
        var getso_id = url.split("?id=");
        var currentInvoice = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
          currentInvoice = parseInt(currentInvoice);
          let period = ""; // 0
          let days = [];
          let i = 0;
          let frequency2 = 0;
          let weekdayObj = {
            saturday: 0,
            sunday: 0,
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
          };
          let repeatMonths = [];
          let repeatDates = [];
          if (radioFrequency == "frequencyDaily" || radioFrequency == "frequencyOnetimeonly") {
            period = "Daily"; // 0
            if (radioFrequency == "frequencyDaily") {
              frequency2 = parseInt(everyDays);
              if (dailyRadioOption == "dailyEveryDay") {
                for (i = 0; i < 7; i++) {
                  days.push(i);
                }
              }
              if (dailyRadioOption == "dailyWeekdays") {
                for (i = 1; i < 6; i++) {
                  days.push(i);
                }
              }
              if (dailyRadioOption == "dailyEvery") {

              }
            } else {
              repeatDates.push({
                "Dates": sDate2
              })
              frequency2 = 1;
            }
          }
          if (radioFrequency == "frequencyWeekly") {
            period = "Weekly"; // 1
            frequency2 = parseInt(everyWeeks);
            let arrSelectDays = selectDays.split(",");
            for (i = 0; i < arrSelectDays.length; i++) {
              days.push(arrSelectDays[i]);
              if (parseInt(arrSelectDays[i]) == 0)
                weekdayObj.sunday = 1;
              if (parseInt(arrSelectDays[i]) == 1)
                weekdayObj.monday = 1;
              if (parseInt(arrSelectDays[i]) == 2)
                weekdayObj.tuesday = 1;
              if (parseInt(arrSelectDays[i]) == 3)
                weekdayObj.wednesday = 1;
              if (parseInt(arrSelectDays[i]) == 4)
                weekdayObj.thursday = 1;
              if (parseInt(arrSelectDays[i]) == 5)
                weekdayObj.friday = 1;
              if (parseInt(arrSelectDays[i]) == 6)
                weekdayObj.saturday = 1;
            }
          }
          if (radioFrequency == "frequencyMonthly") {
            period = "Monthly"; // 0
            repeatMonths = convertStrMonthToNum(ofMonths);
            repeatDates = getRepeatDates(sDate2, fDate2, repeatMonths, monthDate);
            frequency2 = parseInt(monthDate);
          }
          if (days.length > 0) {
            for (let x = 0; x < days.length; x++) {
              let dayObj = {
                Name: "VS1_RepeatTrans",
                Params: {
                  CloudUserName: erpGet.ERPUsername,
                  CloudPassword: erpGet.ERPPassword,
                  TransID: currentInvoice,
                  TransType: "Invoice",
                  Repeat_Frequency: frequency2,
                  Repeat_Period: period,
                  Repeat_BaseDate: sDate2,
                  Repeat_finalDateDate: fDate2,
                  Repeat_Saturday: weekdayObj.saturday,
                  Repeat_Sunday: weekdayObj.sunday,
                  Repeat_Monday: weekdayObj.monday,
                  Repeat_Tuesday: weekdayObj.tuesday,
                  Repeat_Wednesday: weekdayObj.wednesday,
                  Repeat_Thursday: weekdayObj.thursday,
                  Repeat_Friday: weekdayObj.friday,
                  Repeat_Holiday: 0,
                  Repeat_Weekday: parseInt(days[x].toString()),
                  Repeat_MonthOffset: 0,
                },
              };
              var myString = '"JsonIn"' + ":" + JSON.stringify(dayObj);
              var oPost = new XMLHttpRequest();
              oPost.open(
                "POST",
                URLRequest +
                erpGet.ERPIPAddress +
                ":" +
                erpGet.ERPPort +
                "/" +
                'erpapi/VS1_Cloud_Task/Method?Name="VS1_RepeatTrans"',
                true
              );
              oPost.setRequestHeader("database", erpGet.ERPDatabase);
              oPost.setRequestHeader("username", erpGet.ERPUsername);
              oPost.setRequestHeader("password", erpGet.ERPPassword);
              oPost.setRequestHeader("Accept", "application/json");
              oPost.setRequestHeader("Accept", "application/html");
              oPost.setRequestHeader("Content-type", "application/json");
              oPost.send(myString);

              oPost.onreadystatechange = function () {
                if (oPost.readyState == 4 && oPost.status == 200) {
                  var myArrResponse = JSON.parse(oPost.responseText);
                  var success = myArrResponse.ProcessLog.ResponseStatus.includes("OK");
                } else if (oPost.readyState == 4 && oPost.status == 403) {

                } else if (oPost.readyState == 4 && oPost.status == 406) {

                } else if (oPost.readyState == "") {

                }
                $(".fullScreenSpin").css("display", "none");
              };
            }
          } else {
            let dayObj = {};
            if (radioFrequency == "frequencyOnetimeonly" || radioFrequency == "frequencyMonthly") {
              dayObj = {
                Name: "VS1_RepeatTrans",
                Params: {
                  CloudUserName: erpGet.ERPUsername,
                  CloudPassword: erpGet.ERPPassword,
                  TransID: currentInvoice,
                  TransType: "Invoice",
                  Repeat_Dates: repeatDates,
                  Repeat_Frequency: frequency2,
                  Repeat_Period: period,
                  Repeat_BaseDate: sDate2,
                  Repeat_finalDateDate: fDate2,
                  Repeat_Saturday: weekdayObj.saturday,
                  Repeat_Sunday: weekdayObj.sunday,
                  Repeat_Monday: weekdayObj.monday,
                  Repeat_Tuesday: weekdayObj.tuesday,
                  Repeat_Wednesday: weekdayObj.wednesday,
                  Repeat_Thursday: weekdayObj.thursday,
                  Repeat_Friday: weekdayObj.friday,
                  Repeat_Holiday: 0,
                  Repeat_Weekday: 0,
                  Repeat_MonthOffset: 0,
                },
              };
            } else {
              dayObj = {
                Name: "VS1_RepeatTrans",
                Params: {
                  CloudUserName: erpGet.ERPUsername,
                  CloudPassword: erpGet.ERPPassword,
                  TransID: currentInvoice,
                  TransType: "Invoice",
                  Repeat_Frequency: frequency2,
                  Repeat_Period: period,
                  Repeat_BaseDate: sDate2,
                  Repeat_finalDateDate: fDate2,
                  Repeat_Saturday: weekdayObj.saturday,
                  Repeat_Sunday: weekdayObj.sunday,
                  Repeat_Monday: weekdayObj.monday,
                  Repeat_Tuesday: weekdayObj.tuesday,
                  Repeat_Wednesday: weekdayObj.wednesday,
                  Repeat_Thursday: weekdayObj.thursday,
                  Repeat_Friday: weekdayObj.friday,
                  Repeat_Holiday: 0,
                  Repeat_Weekday: 0,
                  Repeat_MonthOffset: 0,
                },
              };
            }
            var myString = '"JsonIn"' + ":" + JSON.stringify(dayObj);
            var oPost = new XMLHttpRequest();
            oPost.open(
              "POST",
              URLRequest +
              erpGet.ERPIPAddress +
              ":" +
              erpGet.ERPPort +
              "/" +
              'erpapi/VS1_Cloud_Task/Method?Name="VS1_RepeatTrans"',
              true
            );
            oPost.setRequestHeader("database", erpGet.ERPDatabase);
            oPost.setRequestHeader("username", erpGet.ERPUsername);
            oPost.setRequestHeader("password", erpGet.ERPPassword);
            oPost.setRequestHeader("Accept", "application/json");
            oPost.setRequestHeader("Accept", "application/html");
            oPost.setRequestHeader("Content-type", "application/json");
            // let objDataSave = '"JsonIn"' + ':' + JSON.stringify(selectClient);
            oPost.send(myString);

            oPost.onreadystatechange = function () {
              if (oPost.readyState == 4 && oPost.status == 200) {
                var myArrResponse = JSON.parse(oPost.responseText);
              } else if (oPost.readyState == 4 && oPost.status == 403) {

              } else if (oPost.readyState == 4 && oPost.status == 406) {

              } else if (oPost.readyState == "") {

              }
              $(".fullScreenSpin").css("display", "none");
            };
          }
        }
      } else {
        window.open("/invoicecard", "_self");
      }
      FlowRouter.go("/invoicelist?success=true");
      $('.modal-backdrop').css('display', 'none');
    }, delayTimeAfterSound);
  },
  
  "focusout .lineShipped": function (event) {
    // $(".fullScreenSpin").css("display", "inline-block");
    var target = event.target;
    let selectedunit = $(target).closest("tr").find(".lineOrdered").val();
    localStorage.setItem("productItem", selectedunit);
    let selectedProductName = $(target).closest("tr").find(".lineProductName").val();
    localStorage.setItem("selectedProductName", selectedProductName);

    let productService = new ProductService();
    const templateObject = Template.instance();
    const InvoiceData = templateObject.invoicerecord.get();
    let existProduct = false;
    if(parseInt($(target).val()) > 0){
      InvoiceData.LineItems.forEach(async (element) => {
        if (element.item == selectedProductName) {
          existProduct = true;
        }
      });
      if (!existProduct) {
        if (selectedProductName == "") {
          swal("You have to select Product.", "", "info");
          event.preventDefault();
          return false;
        } else {
          getVS1Data("TProductQtyList").then(function (dataObject) {
            if (dataObject.length == 0) {
              productService.getProductStatus(selectedProductName).then(async function (data) {
                if (data.tproductvs1[0].Batch == false && data.tproductvs1[0].SNTracking == false) {
                  return false;
                } else if (data.tproductvs1[0].Batch == true && data.tproductvs1[0].SNTracking == false) {
                  let selectedLot = $(target).closest("tr").find(".colSerialNo").attr('data-lotnumbers');
                  if(selectedLot != undefined && selectedLot != ""){
                    shareFunctionByName.initTable(selectedLot, "tblAvailableLotCheckbox");
                  }
                  else{
                    shareFunctionByName.initTable("empty", "tblAvailableLotCheckbox");
                  }
                  setTimeout(function () {
                    var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                    $("#availableLotNumberModal").attr("data-row", row + 1);
                    $("#availableLotNumberModal").modal("show");
                  }, 200);
                } else if (data.tproductvs1[0].Batch == false && data.tproductvs1[0].SNTracking == true) {
                  let selectedSN = $(target).closest("tr").find(".colSerialNo").attr('data-serialnumbers');
                  if(selectedSN != undefined && selectedSN != ""){
                    shareFunctionByName.initTable(selectedSN, "tblAvailableSNCheckbox");
                  }
                  else{
                    shareFunctionByName.initTable("empty", "tblAvailableSNCheckbox");
                  }
                  setTimeout(function () {
                    var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                    $("#availableSerialNumberModal").attr("data-row", row + 1);
                    $('#availableSerialNumberModal').modal('show');
                    if(data.tproductvs1[0].CUSTFLD13 == 'true'){
                      $("#availableSerialNumberModal .btnSNCreate").show();
                    }
                    else{
                      $("#availableSerialNumberModal .btnSNCreate").hide();
                    }
                  }, 200);
                }
              });
            }
            else{
              let data = JSON.parse(dataObject[0].data);
              for (let i = 0; i < data.tproductqtylist.length; i++) {
                if(data.tproductqtylist[i].ProductName == selectedProductName){
                  if (data.tproductqtylist[i].batch == false && data.tproductqtylist[i].SNTracking == false) {
                    return false;
                  } else if (data.tproductqtylist[i].batch == true && data.tproductqtylist[i].SNTracking == false) {
                    let selectedLot = $(target).closest("tr").find(".colSerialNo").attr('data-lotnumbers');
                    if(selectedLot != undefined && selectedLot != ""){
                      shareFunctionByName.initTable(selectedLot, "tblAvailableLotCheckbox");
                    }
                    else{
                      shareFunctionByName.initTable("empty", "tblAvailableLotCheckbox");
                    }
                    setTimeout(function () {
                      var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                      $("#availableLotNumberModal").attr("data-row", row + 1);
                      $("#availableLotNumberModal").modal("show");
                    }, 200);
                  } else if (data.tproductqtylist[i].batch == false && data.tproductqtylist[i].SNTracking == true) {
                    let selectedSN = $(target).closest("tr").find(".colSerialNo").attr('data-serialnumbers');
                    if(selectedSN != undefined && selectedSN != ""){
                      shareFunctionByName.initTable(selectedSN, "tblAvailableSNCheckbox");
                    }
                    else{
                      shareFunctionByName.initTable("empty", "tblAvailableSNCheckbox");
                    }
                    setTimeout(function () {
                      var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                      $("#availableSerialNumberModal").attr("data-row", row + 1);
                      $('#availableSerialNumberModal').modal('show');
                      if(data.tproductqtylist[i].CUSTFLD13 == 'true'){
                        $("#availableSerialNumberModal .btnSNCreate").show();
                      }
                      else{
                        $("#availableSerialNumberModal .btnSNCreate").hide();
                      }
                    }, 200);
                  }
                }
              }
            }
          }).catch(function (err) {
            productService.getProductStatus(selectedProductName).then(async function (data) {
              if (data.tproductvs1[0].Batch == false && data.tproductvs1[0].SNTracking == false) {
                return false;
              } else if (data.tproductvs1[0].Batch == true && data.tproductvs1[0].SNTracking == false) {
                let selectedLot = $(target).closest("tr").find(".colSerialNo").attr('data-lotnumbers');
                if(selectedLot != undefined && selectedLot != ""){
                  shareFunctionByName.initTable(selectedLot, "tblAvailableLotCheckbox");
                }
                else{
                  shareFunctionByName.initTable("empty", "tblAvailableLotCheckbox");
                }
                setTimeout(function () {
                  var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                  $("#availableLotNumberModal").attr("data-row", row + 1);
                  $("#availableLotNumberModal").modal("show");
                }, 200);
              } else if (data.tproductvs1[0].Batch == false && data.tproductvs1[0].SNTracking == true) {
                let selectedSN = $(target).closest("tr").find(".colSerialNo").attr('data-serialnumbers');
                if(selectedSN != undefined && selectedSN != ""){
                  shareFunctionByName.initTable(selectedSN, "tblAvailableSNCheckbox");
                }
                else{
                  shareFunctionByName.initTable("empty", "tblAvailableSNCheckbox");
                }
                setTimeout(function () {
                  var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                  $("#availableSerialNumberModal").attr("data-row", row + 1);
                  $('#availableSerialNumberModal').modal('show');
                  if(data.tproductvs1[0].CUSTFLD13 == 'true'){
                    $("#availableSerialNumberModal .btnSNCreate").show();
                  }
                  else{
                    $("#availableSerialNumberModal .btnSNCreate").hide();
                  }
                }, 200);
              }
            });
          });
        }
      }
    }
  },
  "click .btnSnLotmodal": function (event) {
    var target = event.target;
    let selectedShipped = $(target).closest("tr").find(".lineShipped").val();
    let selectedunit = $(target).closest("tr").find(".lineOrdered").val();
    localStorage.setItem("productItem", selectedunit);
    let selectedProductName = $(target).closest("tr").find(".lineProductName").val();
    localStorage.setItem("selectedProductName", selectedProductName);

    let productService = new ProductService();
    const templateObject = Template.instance();
    const InvoiceData = templateObject.invoicerecord.get();
    let existProduct = false;
    if(parseInt(selectedShipped) > 0){
      InvoiceData.LineItems.forEach(async (element) => {
        if (element.item == selectedProductName) {
          existProduct = true;
        }
      });
      if (!existProduct) {
        if (selectedProductName == "") {
          swal("You have to select Product.", "", "info");
          event.preventDefault();
          return false;
        } else {
          getVS1Data("TProductQtyList").then(function (dataObject) {
            if (dataObject.length == 0) {
              productService.getProductStatus(selectedProductName).then(async function (data) {
                if (data.tproductvs1[0].Batch == false && data.tproductvs1[0].SNTracking == false) {
                  var buttons = $("<div>")
                  .append($('<button id="trackSN" class="swal2-styled" style="background-color: rgb(48, 133, 214); border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">Track Serial Number</button>'))
                  .append($('<button id="trackLN" class="swal2-styled" style="background-color: rgb(48, 133, 214); border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">Track Lot Number</button>'))
                  .append($('<button id="trackCancel" class="swal2-styled" style="background-color: rgb(170, 170, 170);">No</button>'));
                  swal({
                    title: 'This Product "' + selectedProductName + '" does not currently track Serial Numbers, Lot Numbers or Bin Locations, Do You Wish To Add that Ability.',
                    type: "warning",
                    showCancelButton: false,
                    showConfirmButton: false,
                    html: buttons,
                    onOpen: function (dObj) {
                      $('#trackSN').on('click',function () {
                        objDetails = {
                          type: "TProductVS1",
                          fields: {
                            ID: parseInt(data.tproductqtylist[i].PARTSID),
                            Active: true,
                            SNTracking: "true",
                            Batch: "false",
                          },
                        };

                        productService.saveProductVS1(objDetails)
                        .then(async function (objDetails) {
                          sideBarService.getProductListVS1("All", 0)
                            .then(async function (dataReload) {
                              await addVS1Data("TProductQtyList", JSON.stringify(dataReload));
                              swal.close();
                              $(target).click();
                            })
                            .catch(function (err) {
                            });
                        })
                        .catch(function (err) {
                          swal({
                            title: "Oooops...",
                            text: err,
                            type: "error",
                            showCancelButton: false,
                            confirmButtonText: "Try Again",
                          }).then((result) => {
                            if (result.value) {
                              // Meteor._reload.reload();
                            } else if (result.dismiss === "cancel") {
                            }
                          });
                        });
                      });
                      $('#trackLN').on('click',function () {
                        swal.close();
                        objDetails = {
                          type: "TProductVS1",
                          fields: {
                            ID: parseInt(data.tproductqtylist[i].PARTSID),
                            Active: true,
                            SNTracking: "false",
                            Batch: "true",
                          },
                        };

                        productService.saveProductVS1(objDetails)
                        .then(async function (objDetails) {
                          sideBarService.getProductListVS1("All", 0)
                            .then(async function (dataReload) {
                              await addVS1Data("TProductQtyList", JSON.stringify(dataReload));
                              swal.close();
                              $(target).click();
                            })
                            .catch(function (err) {
                            });
                        })
                        .catch(function (err) {
                          swal({
                            title: "Oooops...",
                            text: err,
                            type: "error",
                            showCancelButton: false,
                            confirmButtonText: "Try Again",
                          }).then((result) => {
                            if (result.value) {
                              // Meteor._reload.reload();
                            } else if (result.dismiss === "cancel") {
                            }
                          });
                        });
                      });
                      $('#trackCancel').on('click',function () {
                          swal.close();
                      });
                    }
                  });
                } else if (data.tproductvs1[0].Batch == true && data.tproductvs1[0].SNTracking == false) {
                  let selectedLot = $(target).closest("tr").find(".colSerialNo").attr('data-lotnumbers');
                  if(selectedLot != undefined && selectedLot != ""){
                    shareFunctionByName.initTable(selectedLot, "tblAvailableLotCheckbox");
                  }
                  else{
                    shareFunctionByName.initTable("empty", "tblAvailableLotCheckbox");
                  }
                  setTimeout(function () {
                    var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                    $("#availableLotNumberModal").attr("data-row", row + 1);
                    $("#availableLotNumberModal").modal("show");
                  }, 200);
                } else if (data.tproductvs1[0].Batch == false && data.tproductvs1[0].SNTracking == true) {
                  let selectedSN = $(target).closest("tr").find(".colSerialNo").attr('data-serialnumbers');
                  if(selectedSN != undefined && selectedSN != ""){
                    shareFunctionByName.initTable(selectedSN, "tblAvailableSNCheckbox");
                  }
                  else{
                    shareFunctionByName.initTable("empty", "tblAvailableSNCheckbox");
                  }
                  setTimeout(function () {
                    var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                    $("#availableSerialNumberModal").attr("data-row", row + 1);
                    $('#availableSerialNumberModal').modal('show');
                    if(data.tproductvs1[0].CUSTFLD13 == 'true'){
                      $("#availableSerialNumberModal .btnSNCreate").show();
                    }
                    else{
                      $("#availableSerialNumberModal .btnSNCreate").hide();
                    }
                  }, 200);
                }
              });
            }
            else{
              let data = JSON.parse(dataObject[0].data);
              for (let i = 0; i < data.tproductqtylist.length; i++) {
                if(data.tproductqtylist[i].ProductName == selectedProductName){
                  if (data.tproductqtylist[i].batch == false && data.tproductqtylist[i].SNTracking == false) {
                    var buttons = $("<div>")
                    .append($('<button id="trackSN" class="swal2-styled" style="background-color: rgb(48, 133, 214); border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">Track Serial Number</button>'))
                    .append($('<button id="trackLN" class="swal2-styled" style="background-color: rgb(48, 133, 214); border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">Track Lot Number</button>'))
                    .append($('<button id="trackCancel" class="swal2-styled" style="background-color: rgb(170, 170, 170);">No</button>'));
                    swal({
                      title: 'This Product "' + selectedProductName + '" does not currently track Serial Numbers, Lot Numbers or Bin Locations, Do You Wish To Add that Ability.',
                      type: "warning",
                      showCancelButton: false,
                      showConfirmButton: false,
                      html: buttons,
                      onOpen: function (dObj) {
                        $('#trackSN').on('click',function () {
                          objDetails = {
                            type: "TProductVS1",
                            fields: {
                              ID: parseInt(data.tproductqtylist[i].PARTSID),
                              Active: true,
                              SNTracking: "true",
                              Batch: "false",
                            },
                          };

                          productService.saveProductVS1(objDetails)
                          .then(async function (objDetails) {
                            sideBarService.getProductListVS1("All", 0)
                              .then(async function (dataReload) {
                                await addVS1Data("TProductQtyList", JSON.stringify(dataReload));
                                swal.close();
                                $(target).click();
                              })
                              .catch(function (err) {
                              });
                          })
                          .catch(function (err) {
                            swal({
                              title: "Oooops...",
                              text: err,
                              type: "error",
                              showCancelButton: false,
                              confirmButtonText: "Try Again",
                            }).then((result) => {
                              if (result.value) {
                                // Meteor._reload.reload();
                              } else if (result.dismiss === "cancel") {
                              }
                            });
                          });
                        });
                        $('#trackLN').on('click',function () {
                          swal.close();
                          objDetails = {
                            type: "TProductVS1",
                            fields: {
                              ID: parseInt(data.tproductqtylist[i].PARTSID),
                              Active: true,
                              SNTracking: "false",
                              Batch: "true",
                            },
                          };

                          productService.saveProductVS1(objDetails)
                          .then(async function (objDetails) {
                            sideBarService.getProductListVS1("All", 0)
                              .then(async function (dataReload) {
                                await addVS1Data("TProductQtyList", JSON.stringify(dataReload));
                                swal.close();
                                $(target).click();
                              })
                              .catch(function (err) {
                              });
                          })
                          .catch(function (err) {
                            swal({
                              title: "Oooops...",
                              text: err,
                              type: "error",
                              showCancelButton: false,
                              confirmButtonText: "Try Again",
                            }).then((result) => {
                              if (result.value) {
                                // Meteor._reload.reload();
                              } else if (result.dismiss === "cancel") {
                              }
                            });
                          });
                        });
                        $('#trackCancel').on('click',function () {
                            swal.close();
                        });
                      }
                    });
                  } else if (data.tproductqtylist[i].batch == true && data.tproductqtylist[i].SNTracking == false) {
                    let selectedLot = $(target).closest("tr").find(".colSerialNo").attr('data-lotnumbers');
                    if(selectedLot != undefined && selectedLot != ""){
                      shareFunctionByName.initTable(selectedLot, "tblAvailableLotCheckbox");
                    }
                    else{
                      shareFunctionByName.initTable("empty", "tblAvailableLotCheckbox");
                    }
                    setTimeout(function () {
                      var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                      $("#availableLotNumberModal").attr("data-row", row + 1);
                      $("#availableLotNumberModal").modal("show");
                    }, 200);
                  } else if (data.tproductqtylist[i].batch == false && data.tproductqtylist[i].SNTracking == true) {
                    let selectedSN = $(target).closest("tr").find(".colSerialNo").attr('data-serialnumbers');
                    if(selectedSN != undefined && selectedSN != ""){
                      shareFunctionByName.initTable(selectedSN, "tblAvailableSNCheckbox");
                    }
                    else{
                      shareFunctionByName.initTable("empty", "tblAvailableSNCheckbox");
                    }
                    setTimeout(function () {
                      var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                      $("#availableSerialNumberModal").attr("data-row", row + 1);
                      $('#availableSerialNumberModal').modal('show');
                      if(data.tproductqtylist[i].CUSTFLD13 == 'true'){
                        $("#availableSerialNumberModal .btnSNCreate").show();
                      }
                      else{
                        $("#availableSerialNumberModal .btnSNCreate").hide();
                      }
                    }, 200);
                  }
                }
              }
            }
          }).catch(function (err) {
            productService.getProductStatus(selectedProductName).then(async function (data) {
              if (data.tproductvs1[0].Batch == false && data.tproductvs1[0].SNTracking == false) {
                var buttons = $("<div>")
                .append($('<button id="trackSN" class="swal2-styled" style="background-color: rgb(48, 133, 214); border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">Track Serial Number</button>'))
                .append($('<button id="trackLN" class="swal2-styled" style="background-color: rgb(48, 133, 214); border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">Track Lot Number</button>'))
                .append($('<button id="trackCancel" class="swal2-styled" style="background-color: rgb(170, 170, 170);">No</button>'));
                swal({
                  title: 'This Product "' + selectedProductName + '" does not currently track Serial Numbers, Lot Numbers or Bin Locations, Do You Wish To Add that Ability.',
                  type: "warning",
                  showCancelButton: false,
                  showConfirmButton: false,
                  html: buttons,
                  onOpen: function (dObj) {
                    $('#trackSN').on('click',function () {
                      objDetails = {
                        type: "TProductVS1",
                        fields: {
                          ID: parseInt(data.tproductqtylist[i].PARTSID),
                          Active: true,
                          SNTracking: "true",
                          Batch: "false",
                        },
                      };

                      productService.saveProductVS1(objDetails)
                      .then(async function (objDetails) {
                        sideBarService.getProductListVS1("All", 0)
                          .then(async function (dataReload) {
                            await addVS1Data("TProductQtyList", JSON.stringify(dataReload));
                            swal.close();
                            $(target).click();
                          })
                          .catch(function (err) {
                          });
                      })
                      .catch(function (err) {
                        swal({
                          title: "Oooops...",
                          text: err,
                          type: "error",
                          showCancelButton: false,
                          confirmButtonText: "Try Again",
                        }).then((result) => {
                          if (result.value) {
                            // Meteor._reload.reload();
                          } else if (result.dismiss === "cancel") {
                          }
                        });
                      });
                    });
                    $('#trackLN').on('click',function () {
                      swal.close();
                      objDetails = {
                        type: "TProductVS1",
                        fields: {
                          ID: parseInt(data.tproductqtylist[i].PARTSID),
                          Active: true,
                          SNTracking: "false",
                          Batch: "true",
                        },
                      };

                      productService.saveProductVS1(objDetails)
                      .then(async function (objDetails) {
                        sideBarService.getProductListVS1("All", 0)
                          .then(async function (dataReload) {
                            await addVS1Data("TProductQtyList", JSON.stringify(dataReload));
                            swal.close();
                            $(target).click();
                          })
                          .catch(function (err) {
                          });
                      })
                      .catch(function (err) {
                        swal({
                          title: "Oooops...",
                          text: err,
                          type: "error",
                          showCancelButton: false,
                          confirmButtonText: "Try Again",
                        }).then((result) => {
                          if (result.value) {
                            // Meteor._reload.reload();
                          } else if (result.dismiss === "cancel") {
                          }
                        });
                      });
                    });
                    $('#trackCancel').on('click',function () {
                        swal.close();
                    });
                  }
                });
              } else if (data.tproductvs1[0].Batch == true && data.tproductvs1[0].SNTracking == false) {
                let selectedLot = $(target).closest("tr").find(".colSerialNo").attr('data-lotnumbers');
                if(selectedLot != undefined && selectedLot != ""){
                  shareFunctionByName.initTable(selectedLot, "tblAvailableLotCheckbox");
                }
                else{
                  shareFunctionByName.initTable("empty", "tblAvailableLotCheckbox");
                }
                setTimeout(function () {
                  var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                  $("#availableLotNumberModal").attr("data-row", row + 1);
                  $("#availableLotNumberModal").modal("show");
                }, 200);
              } else if (data.tproductvs1[0].Batch == false && data.tproductvs1[0].SNTracking == true) {
                let selectedSN = $(target).closest("tr").find(".colSerialNo").attr('data-serialnumbers');
                if(selectedSN != undefined && selectedSN != ""){
                  shareFunctionByName.initTable(selectedSN, "tblAvailableSNCheckbox");
                }
                else{
                  shareFunctionByName.initTable("empty", "tblAvailableSNCheckbox");
                }
                setTimeout(function () {
                  var row = $(target).parent().parent().parent().children().index($(target).parent().parent());
                  $("#availableSerialNumberModal").attr("data-row", row + 1);
                  $('#availableSerialNumberModal').modal('show');
                  if(data.tproductvs1[0].CUSTFLD13 == 'true'){
                    $("#availableSerialNumberModal .btnSNCreate").show();
                  }
                  else{
                    $("#availableSerialNumberModal .btnSNCreate").hide();
                  }
                }, 200);
              }
            });
          });
        }
      }
    }
  },
  "click .btnSNCreate": function (event) {
    // $("#availableSerialNumberModal").modal("hide");
    // $("#serialNumberModal").modal("show");

    let tokenid = "random";
    var rowData = `<tr class="dnd-moved checkRowSelected" id="${tokenid}">
            <td class="colChkBox pointer" style="width:10%!important;">
                <div class="custom-control custom-switch chkBox pointer chkServiceCard" style="width:15px;">
                    <input name="pointer" class="custom-control-input chkBox pointer chkServiceCard" type="checkbox" id="formCheck-${tokenid}" checked>
                    <label class="custom-control-label chkBox pointer" for="formCheck-${tokenid}"></label>
                </div>
            </td>
            <td class="colID hiddenColumn dtr-control" tabindex="0">
                ${tokenid}
            </td>
            <td class="colSN" contenteditable="true">Random</td>
        </tr>`;

    $("#tblAvailableSNCheckbox tbody").prepend(rowData);
  },

  'change #sltCurrency': (e, ui) => {
    if ($("#sltCurrency").val() && $("#sltCurrency").val() != defaultCurrencyCode) {
      $(".foreign-currency-js").css("display", "block");
      ui.isForeignEnabled.set(true);
      FxGlobalFunctions.toggleVisbilityOfValuesToConvert(true);
    } else {
      $(".foreign-currency-js").css("display", "none");
      ui.isForeignEnabled.set(false);
      FxGlobalFunctions.toggleVisbilityOfValuesToConvert(false);
    }
  },

  'change .exchange-rate-js, change input.lineUnitPrice': (e, ui) => {
    FxGlobalFunctions.convertToForeignEveryFieldsInTableId("#tblInvoiceLine", new UtilityService());
  },

  // "click #printModal .btn-check-template": function (event) {
  //   const template = $(event.target).data('template');
  //   const templateObject = Template.instance()
  //   // $("#" + checkboxID).trigger("click");
  //   templateObject.print(template)
  // },

  // "click .printConfirm": async function (event) {
  //   const checkedPrintOptions = $("#printModal").find(".chooseTemplateBtn:checked")
  //   // if(checkedPrintOptions.length == 0){
  //   //   return;
  //   // }
  //   playPrintAudio();
  //   const templateObject = Template.instance();
  //   templateObject.print()
  // },

});

Template.registerHelper("equals", function (a, b) {
  return a === b;
});

export const convertToForeignCurrencyAllFieldsInTheTable = (tableId) => {

}
