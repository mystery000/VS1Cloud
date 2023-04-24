import { Template } from 'meteor/templating';
import './transaction_card.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../../js/sidebar-service';
import { ContactService } from '../../../contacts/contact-service';
import { UtilityService } from '../../../utility-service';
import FxGlobalFunctions from "../../../packages/currency/FxGlobalFunctions";
import { cloneDeep } from 'lodash';
import { SalesBoardService } from '../../../js/sales-service';
import LoadingOverlay from '../../../LoadingOverlay';
import { Random } from "meteor/random";

let sideBarService = new SideBarService();
let contactService = new ContactService();
let utilityService = new UtilityService();
let salesService = new SalesBoardService();
var noHasTotals = ["Customer Payment", "Customer Statement", "Supplier Payment", "Statement", "Delivery Docket", "Journal Entry", "Deposit"];
Template.transaction_card.onCreated(function () {
  let templateObject = Template.instance();
  templateObject.transactionrecord = new ReactiveVar();
  templateObject.hasFollow = new ReactiveVar();
  templateObject.accountID = new ReactiveVar();
  templateObject.stripe_fee_method = new ReactiveVar();
  templateObject.clientrecords = new ReactiveVar();
  templateObject.selectedLineId = new ReactiveVar('');
  templateObject.taxraterecords = new ReactiveVar();
  templateObject.taxcodes = new ReactiveVar();
  templateObject.attachmentCount = new ReactiveVar();
  templateObject.uploadedFiles = new ReactiveVar();
  templateObject.selectedCurrency = new ReactiveVar();
  templateObject.defaultsaleterm = new ReactiveVar();
  templateObject.termrecords = new ReactiveVar();
})

Template.transaction_card.onRendered(async function () {
  let templateObject = Template.instance()
  templateObject.getDayNumber = function (day) {
    day = day.toLowerCase();
    if (day == "") {
      return;
    }
    if (day == "monday") {
      return 1;
    }
    if (day == "tuesday") {
      return 2;
    }
    if (day == "wednesday") {
      return 3;
    }
    if (day == "thursday") {
      return 4;
    }
    if (day == "friday") {
      return 5;
    }
    if (day == "saturday") {
      return 6;
    }
    if (day == "sunday") {
      return 0;
    }
  }
  templateObject.setClientVS1 = function(data) {
    if(templateObject.data.clientType == 'Customer') {
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
    } else if(templateObject.data.clientType == 'Supplier') {
      for (let i in data.tsuppliervs1) {
        if (data.tsuppliervs1.hasOwnProperty(i)) {
            let supplierrecordObj = {
                supplierid: data.tsuppliervs1[i].fields.ID || ' ',
                suppliername: data.tsuppliervs1[i].fields.ClientName || ' ',
                supplieremail: data.tsuppliervs1[i].fields.Email || ' ',
                street: data.tsuppliervs1[i].fields.Street || ' ',
                street2: data.tsuppliervs1[i].fields.Street2 || ' ',
                street3: data.tsuppliervs1[i].fields.Street3 || ' ',
                suburb: data.tsuppliervs1[i].fields.Suburb || ' ',
                statecode: data.tsuppliervs1[i].fields.State + ' ' + data.tsuppliervs1[i].fields.Postcode || ' ',
                country: data.tsuppliervs1[i].fields.Country || ' ',
                termsName: data.tsuppliervs1[i].fields.TermsName || ''
            };
            clientList.push(supplierrecordObj);
        }
    }
      templateObject.clientrecords.set(clientList);
      for (let i = 0; i < clientList.length; i++) {
          //$('#edtSupplierName').editableSelect('add', clientList[i].customername);
      }
      if (FlowRouter.current().queryParams.id || FlowRouter.current().queryParams.supplierid || FlowRouter.current().queryParams.copypoid) {

      } else {
          setTimeout(function() {
              $('#edtSupplierName').trigger("click");
          }, 200);
      }
    }
  }
  templateObject.getAllClients = function () {
    if(templateObject.data.clientType == 'Customer') {
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
    }else if(templateObject.data.clientType == 'Supplier') {
      getVS1Data('TSupplierVS1').then(function(dataObject) {
        if (dataObject.length === 0) {
            clientsService.getSupplierVS1().then(function(data) {
              templateObject.setClientVS1(data);
            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            templateObjec.setClientVS1(data);
        }
    }).catch(function(err) {
        clientsService.getSupplierVS1().then(function(data) {
            templateObject.setClientVS1(data);
        });
    });
    }
  }

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

  templateObject.getTerms();

  templateObject.getAllClients();
  templateObject.getOrganisationDetails = function () {
    let account_id = localStorage.getItem("vs1companyStripeID") || "";
    let stripe_fee = localStorage.getItem("vs1companyStripeFeeMethod") || "apply";
    templateObject.accountID.set(account_id);
    templateObject.stripe_fee_method.set(stripe_fee);
  };
  templateObject.getOrganisationDetails()
  /**
   * Get Invoice Data from indexedb
   */
  async function getTransDataFromIndexedDB(trans_id) {
    try {
      const dataObject = await getVS1Data(exIndexDBName);
      if (dataObject.length === 0) {
        return undefined;
      }
      const transactions = JSON.parse(dataObject[0].data)[exLowercaseName];
      const currentTransactionData = transactions.find(trans => trans.fields.ID === trans_id);
      return currentTransactionData
    } catch (error) {
      return undefined;
    }
  }
  /**
   * Get invoice data from server
   * @param trans_id
   */
  async function getTransDataFromServer(trans_id) {
    try {
      let that = templateObject.data.service;
      const dataObject = await templateObject.data.oneExAPIName.apply(that, [trans_id]);
      return dataObject;
    } catch (error) {
      swal({
        title: "Oooops...",
        text: error,
        type: "error",
        showCancelButton: false,
        confirmButtonText: "Try Again",
      }).then((result) => {
        if (result.value) {
          // if (error === checkResponseError) {
            // window.open("/", "_self");
          // }
        } else if (result.dismiss === "cancel") { }
      });
      $(".fullScreenSpin").css("display", "none");
    }
  }

  templateObject.getTransactionData = async function(trans_id) {
    let data = await getTransDataFromIndexedDB(trans_id)
    if (data === undefined) {
      data = await getTransDataFromServer(trans_id)
    }
    $(".fullScreenSpin").css("display", "none");
    if(data) {
      let record = templateObject.data.setTransData(data);
      templateObject.transactionrecord.set(record.record)
      templateObject.selectedCurrency.set(record.record.currency)
      if(record.attachmentCount) {
        templateObject.attachmentCount.set(record.attachmentCount);
      }
      if(record.uploadedFiles) {
        templateObject.uploadedFiles.set(record.uploadedFiles)
      }
    }
  }

  function loadTemplateBody1(object_invoce) {
    if (object_invoce[0]["taxItems"]) {
      let taxItems = object_invoce[0]["taxItems"];
      if (taxItems && Object.keys(taxItems).length > 0) {
        $("#templatePreviewModal #tax_list_print").html("");
        Object.keys(taxItems).map((code) => {
          let html = `
              <div style="width: 100%; display: flex;">
                  <div style="padding-right: 16px; width: 50%;">
                      <p style="font-weight: 600; text-align: left; margin-bottom: 8px; color: rgb(0 0 0);">
                          ${code}</p>
                  </div>
                  <div style="padding-left: 16px; width: 50%;">
                      <p style="font-weight: 600; text-align: right; margin-bottom: 8px; color: rgb(0 0 0);">
                          $${taxItems[code].toFixed(3)}</p>
                  </div>
              </div>
          `;
          $("#templatePreviewModal #tax_list_print").append(html);
        });
      } else {
        $("#templatePreviewModal #tax_list_print").remove();
      }
    }


    // table content
    var tbl_content = $("#templatePreviewModal .tbl_content");
    tbl_content.empty();
    const data = object_invoce[0]["data"];
    let idx = 0;
    for (item of data) {
      idx = 0;
      var html = "";
      html += "<tr style='border-bottom: 1px solid rgba(0, 0, 0, 0.1);'>";
      for (item_temp of item) {
        if (idx > 1)
          html = html + "<td style='text-align: right; padding-right: " + firstIndentLeft + "px;'>" + item_temp + "</td>";
        else
          html = html + "<td style='padding-left: " + firstIndentLeft + "px;'>" + item_temp + "</td>";
        idx++;
      }

      html += "</tr>";
      tbl_content.append(html);
    }


    // total amount
    if (noHasTotals.includes(object_invoce[0]["title"])) {
      $("#templatePreviewModal .field_amount").hide();
      $("#templatePreviewModal .field_payment").css("borderRight", "0px solid black");
    } else {
      $("#templatePreviewModal .field_amount").show();
      $("#templatePreviewModal .field_payment").css("borderRight", "1px solid black");
    }

    $("#templatePreviewModal #subtotal_total").text("Sub total");
    $("#templatePreviewModal #subtotal_totalPrint").text(
      object_invoce[0]["subtotal"]
    );

    $("#templatePreviewModal #grandTotal").text("Grand total");
    $("#templatePreviewModal #totalTax_totalPrint").text(
      object_invoce[0]["gst"]
    );

    $("#templatePreviewModal #grandTotalPrint").text(
      object_invoce[0]["total"]
    );

    $("#templatePreviewModal #totalBalanceDuePrint").text(
      object_invoce[0]["bal_due"]
    );

    $("#templatePreviewModal #paid_amount").text(
      object_invoce[0]["paid_amount"]
    );
  }

  function loadTemplateBody2(object_invoce) {
    if (object_invoce[0]["taxItems"]) {
      let taxItems = object_invoce[0]["taxItems"];
      if (taxItems && Object.keys(taxItems).length > 0) {
        $("#templatePreviewModal #tax_list_print").html("");
        Object.keys(taxItems).map((code) => {
          let html = `
                        <div style="width: 100%; display: flex;">
                            <div style="padding-right: 16px; width: 50%;">
                                <p style="font-weight: 600; text-align: left; margin-bottom: 8px; color: rgb(0 0 0);">
                                    ${code}</p>
                            </div>
                            <div style="padding-left: 16px; width: 50%;">
                                <p style="font-weight: 600; text-align: right; margin-bottom: 8px; color: rgb(0 0 0);">
                                    $${taxItems[code].toFixed(3)}</p>
                            </div>
                        </div>
                    `;
          $("#templatePreviewModal #tax_list_print").append(html);
        });
      } else {
        $("#templatePreviewModal #tax_list_print").remove();
      }
    }


    // table content
    var tbl_content = $("#templatePreviewModal .tbl_content");
    tbl_content.empty();
    const data = object_invoce[0]["data"];
    let idx = 0;
    for (item of data) {
      idx = 0;
      var html = "";
      html += "<tr style='border-bottom: 1px solid rgba(0, 0, 0, 0.1);'>";
      for (item_temp of item) {
        if (idx > 1)
          html = html + "<td style='text-align: right; padding-right: " + firstIndentLeft + "px;'>" + item_temp + "</td>";
        else
          html = html + "<td style='padding-left: " + firstIndentLeft + "px;'>" + item_temp + "</td>";
        idx++;
      }

      html += "</tr>";
      tbl_content.append(html);
    }


    if (noHasTotals.includes(object_invoce[0]["title"])) {
      $(".subtotal2").hide();
    } else {
      $(".subtotal2").show();
    }

    $("#templatePreviewModal #subtotal_totalPrint2").text(
      object_invoce[0]["subtotal"]
    );
    $("#templatePreviewModal #grandTotalPrint2").text(
      object_invoce[0]["total"]
    );
    $("#templatePreviewModal #totalBalanceDuePrint2").text(
      object_invoce[0]["bal_due"]
    );
    $("#templatePreviewModal #paid_amount2").text(
      object_invoce[0]["paid_amount"]
    );
  }

  function loadTemplateBody3(object_invoce) {
    if (object_invoce[0]["taxItems"]) {
      let taxItems = object_invoce[0]["taxItems"];
      if (taxItems && Object.keys(taxItems).length > 0) {
        $("#templatePreviewModal #tax_list_print").html("");
        Object.keys(taxItems).map((code) => {
          let html = `
                        <div style="width: 100%; display: flex;">
                            <div style="padding-right: 16px; width: 50%;">
                                <p style="font-weight: 600; text-align: left; margin-bottom: 8px; color: rgb(0 0 0);">
                                    ${code}</p>
                            </div>
                            <div style="padding-left: 16px; width: 50%;">
                                <p style="font-weight: 600; text-align: right; margin-bottom: 8px; color: rgb(0 0 0);">
                                    $${taxItems[code].toFixed(3)}</p>
                            </div>
                        </div>
                    `;
            $("#templatePreviewModal #tax_list_print").append(html);
          });
        } else {
          $("#templatePreviewModal #tax_list_print").remove();
        }
      }


      // table content
      var tbl_content = $("#templatePreviewModal .tbl_content");
      tbl_content.empty();
      const data = object_invoce[0]["data"];
      let idx = 0;
      for (item of data) {
        idx = 0;
        var html = "";
        html += "<tr style='border-bottom: 1px solid rgba(0, 0, 0, 0.1);'>";
        for (item_temp of item) {
          if (idx > 1)
            html = html + "<td style='text-align: right; padding-right: " + firstIndentLeft + "px;'>" + item_temp + "</td>";
          else
            html = html + "<td style='padding-left: " + firstIndentLeft + "px;'>" + item_temp + "</td>";
          idx++;
        }

        html += "</tr>";
        tbl_content.append(html);
      }

      if (noHasTotals.includes(object_invoce[0]["title"])) {
        $(".subtotal3").hide();
      } else {
        $(".subtotal3").show();
      }

      $("#templatePreviewModal #subtotal_totalPrint3").text(
        object_invoce[0]["subtotal"]
      );
      $("#templatePreviewModal #totalTax_totalPrint3").text(
        object_invoce[0]["gst"]
      );
      $("#templatePreviewModal #totalBalanceDuePrint3").text(
        object_invoce[0]["bal_due"]
      );
  }

  function updateTemplate1(object_invoce, bprint) {
    initTemplateHeaderFooter1();
    $("#html-2-pdfwrapper_invoice").show();
    $("#html-2-pdfwrapper_invoice2").hide();
    $("#html-2-pdfwrapper_invoice3").hide();
    if (bprint == false)
      $("#templatePreviewModal").modal("toggle");
    loadTemplateHeaderFooter1(object_invoce);
    loadTemplateBody1(object_invoce);
  }

  function updateTemplate2(object_invoce, bprint) {
    initTemplateHeaderFooter2();
    $("#html-2-pdfwrapper_invoice").hide();
    $("#html-2-pdfwrapper_invoice2").show();
    $("#html-2-pdfwrapper_invoice3").hide();
    if (bprint == false)
      $("#templatePreviewModal").modal("toggle");
    loadTemplateHeaderFooter2(object_invoce);
    loadTemplateBody2(object_invoce);
  }

  function updateTemplate3(object_invoce, bprint) {
    initTemplateHeaderFooter3();
    $("#html-2-pdfwrapper_invoice").hide();
    $("#html-2-pdfwrapper_invoice2").hide();
    $("#html-2-pdfwrapper_invoice3").show();
    if (bprint == false)
      $("#templatePreviewModal").modal("toggle");
    loadTemplateHeaderFooter3(object_invoce);
    loadTemplateBody3(object_invoce);
  }

  function saveTemplateFields(key, value){
    localStorage.setItem(key, value)
  }

  templateObject.showTemplate1 = async function(template_title, number, bprint){
    var array_data = [];
    let lineItems = [];
    let taxItems = {};
    let object_invoce = [];
    let item_invoices = "";

    let trans_data =  templateObject.transactionrecord.get();
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
    if(templateObject.data.clientType == 'Supplier') {
        customer = $('#edtSupplierName').val();
    }
    let name = $("#firstname").val();
    let surname = $("#lastname").val();
    let dept = $("#sltDept").val();
    let fx = $("#sltCurrency").val();
    var comment = $("#txaComment").val();
    var subtotal_tax = $("#subtotal_tax").html() || Currency+ 0;
    var total_paid = $("#totalPaidAmt").html() || Currency+ 0 ;
    var ref = $("#edtRef").val() || "-";
    var txabillingAddress = $("#txabillingAddress").val() || "";
    txabillingAddress = txabillingAddress.replace(/\n/g, '<br/>');
    var dtSODate = $("#dtSODate").val();
    var subtotal_total = $("#subtotal_total").text() || Currency+ 0;
    var grandTotal = $("#grandTotal").text() || Currency+ 0;
    var duedate = $("#dtDueDate").val();
    var po = $("#ponumber").val() || ".";


    $("#"+templateObject.data.gridTableName+" > tbody > tr").each(function () {
        var lineID = this.id;
        let tdproduct = $("#" + lineID + " .lineProductName").val();
        let tddescription = $("#" + lineID + " .lineProductDesc").text();
        let tdpqa = $("#" + lineID + " .lineProductDesc").attr("data-pqa");
        if(tdpqa){
            tddescription += " " + tdpqa;
        }

        let tdQty = $("#" + lineID + " .lineQty").val();
        let tdunitprice = $("#" + lineID + " .colUnitPriceExChange").val();
        let tdtaxrate = $("#" + lineID + " .lineTaxRate").text();
        let tdlineamt = $("#" + lineID + " .colAmountEx").first().text();
        let taxAmount = $("#"+ lineID+ " .colTaxAmount").first().text();

        let targetRow = $("#" + lineID);
        let targetTaxCode = targetRow.find(".lineTaxCode").val();
        let qty = targetRow.find(".lineQty").val() || 0
        let price = targetRow.find(".colUnitPriceExChange").val() || 0;
        const taxDetail = templateObject.taxcodes.get().find((v) => v.CodeName === targetTaxCode);

        if (taxDetail) {
            let priceTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, ""));
            if (taxDetail.Lines) {
                taxDetail.Lines.map((line) => {
                    let taxCode = line.SubTaxCode;
                    let amount = priceTotal * line.Percentage / 100;
                    if (taxItems[taxCode]) {
                        taxItems[taxCode] += amount;
                    }
                    else {
                        taxItems[taxCode] = amount;
                    }
                });
            }
            else {
                // taxItems[targetTaxCode] = taxTotal;
            }
        }

        array_data.push([
            tdproduct,
            tddescription,
            tdQty,
            tdunitprice,
            taxAmount,
            tdlineamt,
        ]);

        const lineItemObj = {
            description: tddescription || "",
            quantity: tdQty || 0,
            unitPrice: tdunitprice.toLocaleString(undefined, {
                minimumFractionDigits: 2
            }) || 0,
            tax: tdtaxrate || 0,
            amount: tdlineamt || 0,
        }

        lineItems.push(lineItemObj);
    });


    let company = localStorage.getItem("vs1companyName");
    let vs1User = localStorage.getItem("mySession");
    let customerEmail = $("#edtCustomerEmail").val();
    let currencyname = (CountryAbbr).toLowerCase();
    let stringQuery = "?";
    for (let l = 0; l < lineItems.length; l++) {
        stringQuery = stringQuery + "product" + l + "=" + lineItems[l].description + "&price" + l + "=" + lineItems[l].unitPrice + "&qty" + l + "=" + lineItems[l].quantity + "&";
    }

    stringQuery = stringQuery + "tax=" + tax + "&total=" + grandTotal + "&customer=" + customer + "&name=" + name + "&surname=" + surname + "&quoteid=" + trans_data.id + "&transid=" + stripe_id + "&feemethod=" + stripe_fee_method + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + customerEmail + "&type=Invoice&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + dept + "&currency=" + currencyname;

    if (stripe_id != "") {
        $(".linkText").attr("href", stripeGlobalURL + stringQuery);
    } else {
        $('.linkText').attr('href', '#');
    }
    if(number == 1)
    {
        item_invoices = {
            o_url: localStorage.getItem("vs1companyURL"),
            o_name: localStorage.getItem("vs1companyName"),
            o_address: localStorage.getItem("vs1companyaddress1"),
            o_city: localStorage.getItem("vs1companyCity"),
            o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
            o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
            o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
            o_phone:Template.new_invoice.__helpers.get("companyphone").call(),
            title: templateObject.data.printName,
            value:trans_data.id,
            date: dtSODate,
            invoicenumber:trans_data.id,
            refnumber: ref,
            pqnumber: po,
            duedate: duedate,
            paylink: "",
            supplier_type: templateObject.data.clientType,
            supplier_name : customer,
            supplier_addr : txabillingAddress,
            fields: {
              "Product Name": ["25", "left"],
              "Description": ["30", "left"],
              "Qty": ["7", "right"],
              "Unit Price": ["15", "right"],
              "Tax": ["7", "right"],
              "Amount": ["15", "right"],
            },
            subtotal :subtotal_total,
            gst : subtotal_tax,
            total : grandTotal,
            paid_amount : total_paid,
            bal_due : balancedue,
            bsb : Template.new_invoice.__helpers.get("vs1companyBankBSB").call(),
            account : Template.new_invoice.__helpers
                .get("vs1companyBankAccountNo")
                .call(),
            swift : Template.new_invoice.__helpers
                .get("vs1companyBankSwiftCode")
                .call(),
            data: array_data,
            customfield1:"NA",
            customfield2:"NA",
            customfield3:"NA",
            customfieldlabel1:"NA",
            customfieldlabel2:"NA",
            customfieldlabel3:"NA",
            applied : "",
            showFX:"",
            comment:comment,
        };

    }
    else if(number == 2)
    {
        item_invoices = {

            o_url: localStorage.getItem("vs1companyURL"),
            o_name: localStorage.getItem("vs1companyName"),
            o_address: localStorage.getItem("vs1companyaddress1"),
            o_city: localStorage.getItem("vs1companyCity"),
            o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
            o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
            o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
            o_phone:Template.new_invoice.__helpers.get("companyphone").call(),
            title: templateObject.data.printName,
            value:trans_data.id,
            date: dtSODate,
            invoicenumber:trans_data.id,
            refnumber: ref,
            pqnumber: po,
            duedate: duedate,
            paylink: "",
            supplier_type: templateObject.data.clientType,
            supplier_name : customer,
            supplier_addr : txabillingAddress,
            fields: {
              "Product Name": ["25", "left"],
              "Description": ["30", "left"],
              "Qty": ["7", "right"],
              "Unit Price": ["15", "right"],
              "Tax": ["7", "right"],
              "Amount": ["15", "right"],
            },
            subtotal :subtotal_total,
            gst : subtotal_tax,
            total : grandTotal,
            paid_amount : total_paid,
            bal_due : balancedue,
            bsb : Template.new_invoice.__helpers.get("vs1companyBankBSB").call(),
            account : Template.new_invoice.__helpers
                .get("vs1companyBankAccountNo")
                .call(),
            swift : Template.new_invoice.__helpers
                .get("vs1companyBankSwiftCode")
                .call(),
            data: array_data,
            customfield1:customfield1,
            customfield2:customfield2,
            customfield3:customfield3,
            customfieldlabel1:customfieldlabel1,
            customfieldlabel2:customfieldlabel2,
            customfieldlabel3:customfieldlabel3,
            applied : "",
            showFX:"",
            comment:comment,

        };

    }
    else
    {
        item_invoices = {
            o_url: localStorage.getItem("vs1companyURL"),
            o_name: localStorage.getItem("vs1companyName"),
            o_address: localStorage.getItem("vs1companyaddress1"),
            o_city: localStorage.getItem("vs1companyCity"),
            o_state: localStorage.getItem("companyState") + " " + localStorage.getItem("vs1companyPOBox"),
            o_reg: Template.new_invoice.__helpers.get("companyReg").call(),
            o_abn: Template.new_invoice.__helpers.get("companyabn").call(),
            o_phone:Template.new_invoice.__helpers.get("companyphone").call(),
            title: templateObject.data.printName,
            value:trans_data.id,
            date: dtSODate,
            invoicenumber:trans_data.id,
            refnumber: ref,
            pqnumber: po,
            duedate: duedate,
            paylink: "",
            supplier_type: templateObject.data.clientType,
            supplier_name : customer,
            supplier_addr : txabillingAddress,
            fields: {
                "Product Name": ["25", "left"],
                "Description": ["30", "left"],
                "Qty": ["7", "right"],
                "Unit Price": ["15", "right"],
                "Tax": ["7", "right"],
                "Amount": ["15", "right"],
            },
            subtotal :subtotal_total,
            gst : subtotal_tax,
            total : grandTotal,
            paid_amount : total_paid,
            bal_due : balancedue,
            bsb : Template.new_invoice.__helpers.get("vs1companyBankBSB").call(),
            account : Template.new_invoice.__helpers
                .get("vs1companyBankAccountNo")
                .call(),
            swift : Template.new_invoice.__helpers
                .get("vs1companyBankSwiftCode")
                .call(),
            data: array_data,
            customfield1:customfield1,
            customfield2:customfield2,
            customfield3:customfield3,
            customfieldlabel1:customfieldlabel1,
            customfieldlabel2:customfieldlabel2,
            customfieldlabel3:customfieldlabel3,
            applied : "",
            showFX:fx,
            comment:comment,
        };

    }

    item_invoices.taxItems = taxItems;

    object_invoce.push(item_invoices);

    $("#templatePreviewModal .field_payment").show();
    $("#templatePreviewModal .field_amount").show();

    if (bprint == false) {
        
        $("#"+templateObject.data.printWrapPrefix).css("width", "90%");
        $("#"+templateObject.data.printWrapPrefix+"2").css("width", "90%");
        $("#"+templateObject.data.printWrapPrefix+"3").css("width", "90%");
    } else {
        $("#"+templateObject.data.printWrapPrefix).css("width", "210mm");
        $("#"+templateObject.data.printWrapPrefix+"2").css("width", "210mm");
        $("#"+templateObject.data.printWrapPrefix+"3").css("width", "210mm");
    }
    if (number == 1) {
        updateTemplate1(object_invoce, bprint);
    } else if (number == 2) {
        updateTemplate2(object_invoce, bprint);
    } else {
        updateTemplate3(object_invoce, bprint);
    }

    saveTemplateFields("fields" + template_title , object_invoce[0]["fields"]);


  }

  templateObject.generateInvoiceData = function (template_title,number) {
    let object_invoce = [];
    switch (template_title) {
        case templateObject.data.printName:
            templateObject.showTemplate1(template_title, number, false);
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

  templateObject.getAllTaxCodes();

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

  templateObject.exportSalesToPdf = async function (template_title, number) {
    if (template_title == templateObject.data.printName) {
      await templateObject.showTemplate1(template_title, number, true);
    }
    
    let transactionData = templateObject.transactionrecord.get();
    let lowerCasePrintName = templateObject.data.Category.toLowerCase()
    var source;
    if (number == 1) {
      $("#html-2-pdfwrapper_"+lowerCasePrintName).show();
      $("#html-2-pdfwrapper_"+lowerCasePrintName+"2").hide();
      $("#html-2-pdfwrapper_"+lowerCasePrintName+"3").hide();
      source = document.getElementById("html-2-pdfwrapper_"+lowerCasePrintName);
    } else if (number == 2) {
      $("#html-2-pdfwrapper_"+lowerCasePrintName).hide();
      $("#html-2-pdfwrapper_"+lowerCasePrintName+"2").show();
      $("#html-2-pdfwrapper_"+lowerCasePrintName+"3").hide();
      source = document.getElementById("html-2-pdfwrapper_"+lowerCasePrintName+"2");
    } else {
      $("#html-2-pdfwrapper_"+lowerCasePrintName).hide();
      $("#html-2-pdfwrapper_"+lowerCasePrintName+"2").hide();
      $("#html-2-pdfwrapper_"+lowerCasePrintName+"3").show();
      source = document.getElementById("html-2-pdfwrapper_"+lowerCasePrintName+"3");
    }

    let file = templateObject.data.printName +".pdf";
    if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
      if (template_title == templateObject.data.printName) {
        file = template_title + '-' + transactionData.id + '.pdf';
      }
    }
    const opt = {
      margin: 0,
      filename: file,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      }
    };
    html2pdf().set(opt).from(source).toPdf().output('datauristring').then(data => {
      let attachment = [];
      let base64data = data.split(',')[1];
      let chequeId = FlowRouter.current().queryParams.id ? FlowRouter.current().queryParams.id : ''
      let pdfObject = {
        filename: templateObject.data.printName + '-' + chequeId + '.pdf',
        content: base64data,
        encoding: 'base64'
      };
      attachment.push(pdfObject);
      let values = [];
      let basedOnTypeStorages = Object.keys(localStorage);
      basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
        let employeeId = storage.split('_')[2];
        return storage.includes('BasedOnType_');
      });
      let j = basedOnTypeStorages.length;
      if (j > 0) {
        while (j--) {
          values.push(localStorage.getItem(basedOnTypeStorages[j]));
        }
      }
      if (values.length > 0) {
        values.forEach(value => {
          let reportData = JSON.parse(value);
          let temp = { ...reportData };
          temp.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
          reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
          temp.attachments = attachment;
          if (temp.BasedOnType.includes("P")) {
            if (temp.FormID == 1) {
              let formIds = temp.FormIDs.split(',');
              if (formIds.includes(templateObject.data.transreportindex.toString())) {
                temp.FormID = templateObject.data.transreportindex;
                Meteor.call('sendNormalEmail', temp);
              }
            } else {
              if (temp.FormID == templateObject.data.transreportindex.toString())
                Meteor.call('sendNormalEmail', temp);
            }
          }
        });
      }
    });
    html2pdf().set(opt).from(source).save().then(function (dataObject) {
      if ($('.printID').attr('id') == undefined || $('.printID').attr('id') == "") {
      } else {
        $('#html-2-pdfwrapper_new').css('display', 'none');
        $('#html-2-pdfwrapper').css('display', 'none');
        $("#html-2-pdfwrapper_quotes").hide();
        $("#html-2-pdfwrapper_quotes2").hide();
        $("#html-2-pdfwrapper_quotes3").hide();
        $('.fullScreenSpin').css("display", "none");
      }
    });
    return true;
    // }
  }

  templateObject.sendEmailWithAttachment = async () => {
    let data = await templateObject.data.sendEmail();
    templateObject.addAttachment(data)
  }

  templateObject.generatePdfForMail = async (invoiceId) => {
    let stripe_id = templateObject.accountID.get() || "";
    let file = templateObject.data.printName + "-" + invoiceId + ".pdf";
    let stringQuery = '?';
    return new Promise((resolve, reject) => {
      var source = document.getElementById("html-2-pdfwrapper_" + templateObject.data.Category);
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


  templateObject.addAttachment = async(objDetails) => {
    let attachment = [];
    let invoiceId = objDetails.fields.ID;
    let encodedPdf = await templateObject.generatePdfForMail(invoiceId);
    let base64data = encodedPdf.split(',')[1];
    let pdfObject = {
        filename: templateObject.data.printName + '-' + invoiceId + '.pdf',
        content: base64data,
        encoding: 'base64'
    };
    attachment.push(pdfObject);
    let erpInvoiceId = objDetails.fields.ID;
    let mailFromName = localStorage.getItem('vs1companyName');
    let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
    let customerEmailName = $('#edtSupplierName').val();
    let checkEmailData = $('#edtSupplierEmail').val();
    let mailSubject = templateObject.data.printName +' ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
    
    var htmlmailBody = templateObject.data.mailHtml(objDetails);
    if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
        Meteor.call('sendEmail', {
            from: "" + mailFromName + " <" + mailFrom + ">",
            to: checkEmailData,
            subject: mailSubject,
            text: '',
            html: htmlmailBody,
            attachments: attachment
        }, function(error, result) {
            if (error && error.error === "error") {
                if(isBORedirect == true){
                }else{
                };
            } else {
            }
        });
  
        Meteor.call('sendEmail', {
            from: "" + mailFromName + " <" + mailFrom + ">",
            to: mailFrom,
            subject: mailSubject,
            text: '',
            html: htmlmailBody,
            attachments: attachment
        }, function(error, result) {
            if (error && error.error === "error") {
                if(isBORedirect == true){
                }else{
                };
            } else {
                $('#html-2-pdfwrapper').css('display', 'none');
                swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        if(FlowRouter.current().queryParams.trans){
                        }else{
                            if(isBORedirect == true){
                            }else{
                            };
                        };
                    } else if (result.dismiss === 'cancel') {
  
                    }
                });
  
                $('.fullScreenSpin').css('display', 'none');
            }
        });
  
        // templateObject.chkEmailFrequencySetting()
  
    } else if (($('.chkEmailCopy').is(':checked'))) {
        Meteor.call('sendEmail', {
            from: "" + mailFromName + " <" + mailFrom + ">",
            to: checkEmailData,
            subject: mailSubject,
            text: '',
            html: htmlmailBody,
            attachments: attachment
        }, function(error, result) {
            if (error && error.error === "error") {
  
            } else {
                $('#html-2-pdfwrapper').css('display', 'none');
                swal({
                    title: 'SUCCESS',
                    text: "Email Sent To Supplier: " + checkEmailData + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        if(FlowRouter.current().queryParams.trans){
                        }else{
                        };
                    } else if (result.dismiss === 'cancel') {
  
                    }
                });
  
                $('.fullScreenSpin').css('display', 'none');
            }
        });
  
        // templateObject.chkEmailFrequencySetting()
  
    } else if (($('.chkEmailRep').is(':checked'))) {
        Meteor.call('sendEmail', {
            from: "" + mailFromName + " <" + mailFrom + ">",
            to: mailFrom,
            subject: mailSubject,
            text: '',
            html: htmlmailBody,
            attachments: attachment
        }, function(error, result) {
            if (error && error.error === "error") {
            } else {
                $('#html-2-pdfwrapper').css('display', 'none');
                swal({
                    title: 'SUCCESS',
                    text: "Email Sent To User: " + mailFrom + " ",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        if(FlowRouter.current().queryParams.trans){
                        }else{
                        };
                    } else if (result.dismiss === 'cancel') {
  
                    }
                });
  
                $('.fullScreenSpin').css('display', 'none');
            }
        });
  
        // templateObject.chkEmailFrequencySetting()
  
    } else {
  
        // templateObject.chkEmailFrequencySetting()
        
  
        if(FlowRouter.current().queryParams.trans){
        }else{

        };
    };
  }

  // templateObject.chkEmailFrequencySetting = async () => {
  //   let values = [];
  //   let basedOnTypeStorages = Object.keys(localStorage);
  //   basedOnTypeStorages = basedOnTypeStorages.filter((storage) => {
  //       let employeeId = storage.split('_')[2];
  //       return storage.includes('BasedOnType_')
  //   });
  //   let i = basedOnTypeStorages.length;
  //   if (i > 0) {
  //       while (i--) {
  //           values.push(localStorage.getItem(basedOnTypeStorages[i]));
  //       }
  //   }
  //   values.forEach(value => {
  //       let reportData = JSON.parse(value);
  //       reportData.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
  //       reportData.attachments = attachment;
  //       if (reportData.BasedOnType.includes("S")) {
  //           if (reportData.FormID == 1) {
  //               let formIds = reportData.FormIDs.split(',');
  //               if (formIds.includes(templateObject.data.transreportindex.toString())) {
  //                   reportData.FormID = templateObject.data.transreportindex;
  //                   Meteor.call('sendNormalEmail', reportData);
  //               }
  //           } else {
  //               if (reportData.FormID == templateObject.data.transreportindex)
  //                   Meteor.call('sendNormalEmail', reportData);
  //           }
  //       }
  //   });

  // }

  templateObject.hasFollowings = async function() {
    var url = FlowRouter.current().path;
    var getso_id = url.split('?id=');
    var currentInvoice = getso_id[getso_id.length - 1];
    if (getso_id[1]) {
        currentInvoice = parseInt(currentInvoice);
        let that = templateObject.data.service;
        let transData = await templateObject.data.oneExAPIName.apply(that, [currentInvoice])
        var isRepeated = transData.fields.RepeatedFrom;
        templateObject.hasFollow.set(isRepeated);
    }
  }
  templateObject.hasFollowings();

  templateObject.print = async (_template = '') => {
    LoadingOverlay.show();
    setTimeout(async function () {
      var printTemplate = [];
      $("#html-2-pdfwrapper").css("display", "block");
     
      if(_template !== ''){
        const _templateNumber = $(`input[name="${_template}"]:checked`).val();
        await templateObject.exportSalesToPdf(_template, _templateNumber);
        return;
      }

      $(".pdfCustomerName").html($("#edtCustomerName").val());
      $(".pdfCustomerAddress").html(
        $("#txabillingAddress")
          .val()
          .replace(/[\r\n]/g, "<br />")
      );
      $("#printcomment").html(
        $("#txaComment")
          .val()
          .replace(/[\r\n]/g, "<br />")
      );
      var ponumber = $("#ponumber").val() || ".";
      $(".po").text(ponumber);

      var invoice_type = FlowRouter.current().queryParams.type;
      if (invoice_type == "bo") {
        if (
          $("#print_"+templateObject.data.printName+"_back_orders").is(":checked") ||
          $("#print_"+templateObject.data.printName+"_back_orders_second").is(":checked")
        ) {
          printTemplate.push(templateObject.data.printName + " Back Orders");
        }
      } else {
        if (
          $("#"+templateObject.data.printTemplateId).is(":checked") ||
          $("#"+templateObject.data.printTemplateId+"_second").is(":checked")
        ) {
          printTemplate.push(templateObject.data.printName);
        }
        if (
          $("#print_delivery_docket").is(":checked") ||
          $("#print_delivery_docket_second").is(":checked")
        ) {
          printTemplate.push("Delivery Docket");
        }
      }

      if(printTemplate.length === 0) {
        printTemplate.push(templateObject.data.printName);
      }

      var template_number = 1;
      if (printTemplate.length > 0) {
        for (var i = 0; i < printTemplate.length; i++) {
          if (printTemplate[i] == templateObject.data.printName) {
            template_number = $("input[name=Invoices]:checked").val();
          } else if (printTemplate[i] == "Delivery Docket") {
            template_number = $(
              'input[name="Delivery Docket"]:checked'
            ).val();
          } else if (printTemplate[i] == templateObject.data.printName + " Back Orders") {
            template_number = $(
              'input[name='+templateObject.data.printName+'" Back Orders"]:checked'
            ).val();
          } else { }

          let result = await templateObject.exportSalesToPdf(
            printTemplate[i],
            template_number
          );
          if (result == true) { }
        }
      }
      const isCheckedEmail = $("#printModal").find("#emailSend").is(":checked");
      if(isCheckedEmail){

        if(templateObject.data.clientType == 'Customer') {
          if ($("#edtCustomerEmail").val() != "") {
            await templateObject.sendEmail();
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
        } else if(templateObject.data.clientType == 'Supplier') {
          if ($("#edtCustomerEmail").val() != "") {
            await templateObject.sendEmail();
          } else {
            swal({
              title: "Supplier Email Required",
              text: "Please enter supplier email",
              type: "error",
              showCancelButton: false,
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.value) { } else if (result.dismiss === "cancel") { }
            });
          }
        }
      }
      $("#printModal").modal('hide');
      LoadingOverlay.hide();

    }, delayTimeAfterSound);
  }

  $(document).on("click", ".templateItem .btnPreviewTemplate", function(e) {
    title = $(this).parent().attr("data-id");
    let number =  $(this).parent().attr("data-template-id");//e.getAttribute("data-template-id");
    templateObject.generateInvoiceData(title,number);
  });

  $(document).on('mouseover', '#'+templateObject.data.tablename +' tbody tr', function(e) {
    let targetRowId = $(e.target).closest('tr').attr('id');
    templateObject.selectedLineId.set(targetRowId);
  })


 

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
  

  let url = FlowRouter.current().path;
  if (url.indexOf("?id=") > 0) {
    let getso_id = url.split("?id=");
    getso_id = getso_id[1].split("&");
    currentInvoice = parseInt(getso_id[0]);
    $(".printID").attr("id", currentInvoice);
    if (currentInvoice && currentInvoice !== NaN) {
      templateObject.getTransactionData(currentInvoice);
    }
  } else {
    let initialRecords = templateObject.data.initialRecords();
    templateObject.transactionrecord.set(initialRecords);
    let clientId = ''
    if (FlowRouter.current().queryParams.customerid) {
      clientId = FlowRouter.current().queryParams.customerid;
    } else if (FlowRouter.current().queryParams.supplierid) {
      clientId = FlowRouter.current().queryParams.supplierid;
    }

    if(clientId != '') {
      let clients = templateObject.clientrecords.get();

      async function getClientDetail(id) {
        return new Promise((resolve, reject)=> {
          let client;
          let clientIndex = clients.findIndex(item=>{
            return item.customerid == clientId;
          })
          if(clientIndex != -1) {
            resolve(clients[clientIndex])
          } else {
            if(templateObject.data.clientType == 'Customer') {
              contactService.getOneCustomerDataEx(clientId).then(data=> {
                let client = {
                  customerid: data.tcustomer[0].fields.ID || " ",
                  firstname: data.tcustomer[0].fields.FirstName || " ",
                  lastname: data.tcustomer[0].fields.LastName || " ",
                  customername: data.tcustomer[0].fields.ClientName || " ",
                  customeremail: data.tcustomer[0].fields.Email || " ",
                  street: data.tcustomer[0].fields.Street || " ",
                  street2: data.tcustomer[0].fields.Street2 || " ",
                  street3: data.tcustomer[0].fields.Street3 || " ",
                  suburb: data.tcustomer[0].fields.Suburb || " ",
                  statecode: data.tcustomer[0].fields.State +
                    " " +
                    data.tcustomer[0].fields.Postcode || " ",
                  country: data.tcustomer[0].fields.Country || " ",
                  termsName: data.tcustomer[0].fields.TermsName || "",
                  taxCode: data.tcustomer[0].fields.TaxCodeName || "E",
                  clienttypename: data.tcustomer[0].fields.ClientTypeName || "Default",
                  discount: data.tcustomer[0].fields.Discount || 0,
                }
                resolve(client)
              }).catch(function(err) {resolve('')})
            } else if(templateObject.data.clientType == 'Supplier') {
              contactService.getOneSupplierDataEx(clientId).then (data => {
                let client = {
                    supplierid: data.tsupplier[0].fields.ID || ' ',
                    suppliername: data.tsupplier[0].fields.ClientName || ' ',
                    supplieremail: data.tsupplier[0].fields.Email || ' ',
                    street: data.tsupplier[0].fields.Street || ' ',
                    street2: data.tsupplier[0].fields.Street2 || ' ',
                    street3: data.tsupplier[0].fields.Street3 || ' ',
                    suburb: data.tsupplier[0].fields.Suburb || ' ',
                    statecode: data.tsupplier[0].fields.State + ' ' + data.tsupplier[0].fields.Postcode || ' ',
                    country: data.tsupplier[0].fields.Country || ' ',
                    termsName: data.tsupplier[0].fields.TermsName || ''
                }
                resolve(client)
              }).catch(function(err) {resolve('')})
            }
          }
        })
      }
      
      let clientData = await getClientDetail(clientId);
      if(clientData != '') {
        if(templateObject.clientType == 'Customer') {
          $("#edtCustomerEmail").val(clientData.customeremail);
          $("#edtCustomerEmail").attr("customerid", clientData.customerid);
          $("#edtCustomerName").attr("custid", clientData.customerid);
          $("#edtCustomerEmail").attr("customerfirstname", clientData.firstname);
          $("#edtCustomerEmail").attr("customerlastname",clientData.lastname);
          $("#customerType").text(clientData.clienttypename || "Default");
          $("#customerDiscount").text(clientData.discount + "%" || 0 + "%");
          $("#edtCustomerUseType").val(clientData.clienttypename || "Default");
          $("#edtCustomerUseDiscount").val(clientData.discount || 0);
          let postalAddress = clientData.customername + 
            "\n" +
            clientData.street +
            "\n" +
            clientData.street2 +
            " " +
            clientData.statecode +
            "\n" +
            clientData.country;
          $("#txabillingAddress").val(postalAddress);
          $("#pdfCustomerAddress").html(postalAddress);
          $(".pdfCustomerAddress").text(postalAddress);
          $("#txaShipingInfo").val(postalAddress);
          $("#sltTerms").val(clientData.termsName || "");
        } else if (templateObject.data.clientType == 'Supplier') {
          $('#edtSupplierName').val(clientData.suppliername);
          $('#edtSupplierName').attr("suppid", clientData.supplierid);
          $('#edtSupplierEmail').val(clientData.supplieremail);
          $('#edtSupplierEmail').attr('customerid', clientData.supplierId);
          $('#edtSupplierName').attr('suppid', clientData.supplierId);
  
          let postalAddress = clientData.suppliername + '\n' + clientData.street + '\n' + clientData.street2 + ' ' + clientData.statecode + '\n' + clientData.country;
          $('#txabillingAddress').val(postalAddress);
          $('#pdfSupplierAddress').html(postalAddress);
          $('.pdfSupplierAddress').text(postalAddress);
          $('#txaShipingInfo').val(postalAddress);
          $('#sltTerms').val(clientData.termsName);
        }
      } else {
        templateObject.initialRecords
      }
    } else {
      if(templateObject.data.clientType == 'Customer') {
        $('.edtCustomerName').trigger('click')
      } else if(templateObject.data.clientType == 'Supplier') {
        $('.edtSupplierName').trigger('click')
      }
    }
  }
  $(document).on("click", ".tblInventory tbody tr", async function (e) {
    $(".colProductName").removeClass("boldtablealertsborder");
    let selectLineID = $("#selectLineID").val();
    let taxcodeList = await templateObject.taxraterecords.get();
    let customers = await templateObject.clientrecords.get();
    var table = $(this);
    var $printrows = $(".invoice_print tbody tr");
    let utilityService = new UtilityService();
    let $tblrows = $("#tblInvoiceLine tbody tr");
    let taxcode1 = "";

    let selectedCust = $("#edtCustomerName").val();
    let getCustDetails = "";
    let lineTaxRate = "";
    let taxRate = "";
    if (selectedCust != "") {
      getCustDetails = customers.filter((customer) => {
        return customer.customername == selectedCust;
      });
    }

    if (getCustDetails.length > 0) {
      taxRate = taxcodeList.filter((taxrate) => {
        return taxrate.codename == getCustDetails[0].taxCode || "";
      });
      if (taxRate.length > 0) {
        if (taxRate.codename != "") {
          lineTaxRate = taxRate[0].codename;
        } else {
          lineTaxRate = table.find(".taxrate").text();
        }
      } else {
        lineTaxRate = table.find(".taxrate").text();
      }

      taxcode1 = getCustDetails[0].taxCode || "";
    } else {
      var customerTaxCode =
        $("#edtCustomerName").attr("custtaxcode").replace(/\s/g, "") || "";
      taxRate = taxcodeList.filter((taxrate) => {
        return taxrate.codename == customerTaxCode || "";
      });
      if (taxRate.length > 0) {
        if (taxRate.codename != "") {
          lineTaxRate = taxRate[0].codename;
        } else {
          lineTaxRate = table.find(".taxrate").text();
        }
      } else {
        lineTaxRate = table.find(".taxrate").text();
      }

      taxcode1 = customerTaxCode || "";
    }

    if (selectLineID) {
      let lineProductName = table.find(".productName").text();
      let lineProductDesc = table.find(".productDesc").text();
      let lineUnitPrice = table.find(".salePrice").text();
      let lineExtraSellPrice =
        JSON.parse(table.find(".colExtraSellPrice").text()) || null;
      let getCustomerClientTypeName =
        $("#edtCustomerUseType").val() || "Default";
      let getCustomerDiscount =
        parseFloat($("#edtCustomerUseDiscount").val()) || 0;
      let getCustomerProductDiscount = 0;
      let discountAmount = getCustomerDiscount;
      if (lineExtraSellPrice != null) {
        for (let e = 0; e < lineExtraSellPrice.length; e++) {
          if (
            lineExtraSellPrice[e].fields.ClientTypeName ===
            getCustomerClientTypeName
          ) {
            getCustomerProductDiscount =
              parseFloat(lineExtraSellPrice[e].fields.QtyPercent1) || 0;
            if (getCustomerProductDiscount > getCustomerDiscount) {
              discountAmount = getCustomerProductDiscount;
            }
          }
        }
      } else {
        discountAmount = getCustomerDiscount;
      }

      $("#" + selectLineID + " .lineDiscount").val(discountAmount);
      let lineAmount = 0;
      let subGrandTotal = 0;
      let taxGrandTotal = 0;

      let subDiscountTotal = 0; // New Discount
      let taxGrandTotalPrint = 0;
      if (taxcodeList) {
        for (var i = 0; i < taxcodeList.length; i++) {
          if (taxcodeList[i].codename == lineTaxRate) {
            $("#" + selectLineID + " .lineTaxRate").text(
              taxcodeList[i].coderate
            );
          }
        }
      }

      $("#" + selectLineID + " .lineProductName").val(lineProductName);
      $("#" + selectLineID + " .lineProductDesc").text(lineProductDesc);
      $("#" + selectLineID + " .lineOrdered").val(1);
      $("#" + selectLineID + " .lineQty").val(1);
      $("#" + selectLineID + " .lineUnitPrice").val(lineUnitPrice);

      if (
        $(".printID").attr("id") == undefined ||
        $(".printID").attr("id") != undefined ||
        $(".printID").attr("id") != ""
      ) {
        $("#" + selectLineID + " #lineProductName").text(lineProductName);
        $("#" + selectLineID + " #lineProductDesc").text(lineProductDesc);
        $("#" + selectLineID + " #lineOrdered").text(1);
        $("#" + selectLineID + " #lineQty").text(1);
        $("#" + selectLineID + " #lineUnitPrice").text(lineUnitPrice);
      }

      if (lineTaxRate == "NT") {
        lineTaxRate = "E";
        $("#" + selectLineID + " .lineTaxCode").val(lineTaxRate);
        if (
          $(".printID").attr("id") != undefined ||
          $(".printID").attr("id") != ""
        ) {
          $("#" + selectLineID + " #lineTaxCode").text(lineTaxRate);
        }
      } else {
        $("#" + selectLineID + " .lineTaxCode").val(lineTaxRate);
        if (
          $(".printID").attr("id") != undefined ||
          $(".printID").attr("id") != ""
        ) {
          $("#" + selectLineID + " #lineTaxCode").text(lineTaxRate);
        }
      }

      lineAmount = 1 * Number(lineUnitPrice.replace(/[^0-9.-]+/g, "")) || 0;
      $("#" + selectLineID + " .lineAmt").text(
        utilityService.modifynegativeCurrencyFormat(lineAmount)
      );
      if (
        $(".printID").attr("id") == undefined ||
        $(".printID").attr("id") != undefined ||
        $(".printID").attr("id") != ""
      ) {
        $("#" + selectLineID + " #lineAmt").text(
          utilityService.modifynegativeCurrencyFormat(lineAmount)
        );
      }
      $("#productListModal").modal("hide");
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
            document.getElementById("subtotal_total").innerHTML =
              utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
          }

          if (!isNaN(taxTotal)) {
            taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
            taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
            document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
          }

          if (!isNaN(subGrandTotal) && !isNaN(taxGrandTotal)) {
            let GrandTotal = parseFloat(subGrandTotal) + parseFloat(taxGrandTotal);
            let GrandTotalNet = parseFloat(subGrandTotalNet) + parseFloat(taxGrandTotalNet);
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
          document.getElementById("grandTotalPrint").innerHTML = $("#grandTotal").text();
          document.getElementById("totalBalanceDuePrint").innerHTML = $("#totalBalanceDue").text();
        }
        e.stopImmediatePropagation();
      });
    }

    $("#tblInventory_filter .form-control-sm").val("");
    $(".fullScreenSpin").css("display", "none");
  });

  $(window).on("load", function () {
    const win = $(this); //this = window
    if (win.width() <= 1024 && win.width() >= 450) {
      $("#colBalanceDue").addClass("order-12");
    }
    if (win.width() <= 926) {
      $("#totalSection").addClass("offset-md-6");
    }
  });


  $(document).on("click", "#tblTaxRate tbody tr", function (e) {
    let selectLineID = $("#selectLineID").val();
    let taxcodeList = templateObject.taxraterecords.get();
    var table = $(this);
    let utilityService = new UtilityService();
    let $tblrows = $("#"+templateObject.data.gridTableId+" tbody tr");
    var $printrows = $("."+templateObject.data.printTableId+" tbody tr");

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


})

Template.transaction_card.helpers({
  isBatchSerialNoTracking: () => {
    return localStorage.getItem("CloudShowSerial") || false;
  },
  transactionrecord: ()=> {
    return Template.instance().transactionrecord.get()
  },
  
  selectedLineId: ()=>{
    return Template.instance().selectedLineId.get();
  },

  currency: ()=> {
    return Template.instance().selectedCurrency.get();
  }
})

Template.transaction_card.events({
  "click .new_attachment_btn": function (event) {
    $("#attachment-upload").trigger("click");
  },

  'change #attachment-upload': function(e) {
    let templateObj = Template.instance();
    let saveToTAttachment = false;
    let lineIDForAttachment = false;
    let uploadedFilesArray = templateObj.uploadedFiles.get();

    let myFiles = $('#attachment-upload')[0].files;
    let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
    templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
    templateObj.attachmentCount.set(uploadData.totalAttachments);
  },

  "click .img_new_attachment_btn": function (event) {
    $("#img-attachment-upload").trigger("click");
  },
  "change #img-attachment-upload": function (e) {
    let templateObj = Template.instance();
    let saveToTAttachment = false;
    let lineIDForAttachment = false;
    let uploadedFilesArray = templateObj.uploadedFiles.get();

    let myFiles = $("#img-attachment-upload")[0].files;
    let uploadData = utilityService.attachmentUpload(
      uploadedFilesArray,
      myFiles,
      saveToTAttachment,
      lineIDForAttachment
    );
    templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
    templateObj.attachmentCount.set(uploadData.totalAttachments);
  },

  'click .remove-attachment': function(event, ui) {
    let tempObj = Template.instance();
    let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
    if (tempObj.$("#confirm-action-" + attachmentID).length) {
        tempObj.$("#confirm-action-" + attachmentID).remove();
    } else {
        let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">' +
            'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
        tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
    }
    tempObj.$("#new-attachment2-tooltip").show();

  },

  "click .file-name": function (event) {
    let attachmentID = parseInt(event.currentTarget.parentNode.id.split("attachment-name-")[1] );
    let templateObj = Template.instance();
    let uploadedFiles = templateObj.uploadedFiles.get();
    $("#myModalAttachment").modal("hide");
    let previewFile = {};
    let input = uploadedFiles[attachmentID].fields.Description;
    previewFile.link = "data:" + input +  ";base64," + uploadedFiles[attachmentID].fields.Attachment;
    previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
    let type = uploadedFiles[attachmentID].fields.Description;
    if (type === "application/pdf") {
      previewFile.class = "pdf-class";
    } else if ( type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ) {
      previewFile.class = "docx-class";
    } else if ( type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) {
      previewFile.class = "excel-class";
    } else if ( type === "application/vnd.ms-powerpoint" || type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
      previewFile.class = "ppt-class";
    } else if ( type === "application/vnd.oasis.opendocument.formula" || type === "text/csv" || type === "text/plain" || type === "text/rtf") {
      previewFile.class = "txt-class";
    } else if ( type === "application/zip" || type === "application/rar" || type === "application/x-zip-compressed" || type === "application/x-zip,application/x-7z-compressed" ) {
      previewFile.class = "zip-class";
    } else {
      previewFile.class = "default-class";
    }

    if (type.split("/")[0] === "image") {
      previewFile.image = true;
    } else {
      previewFile.image = false;
    }
    templateObj.uploadedFile.set(previewFile);

    $("#files_view").modal("show");

    return;
  },

  "click .confirm-delete-attachment": function (event, ui) {
    let tempObj = Template.instance();
    tempObj.$("#new-attachment2-tooltip").show();
    let attachmentID = parseInt(event.target.id.split("delete-attachment-")[1]);
    let uploadedArray = tempObj.uploadedFiles.get();
    let attachmentCount = tempObj.attachmentCount.get();
    $("#attachment-upload").val("");
    uploadedArray.splice(attachmentID, 1);
    tempObj.uploadedFiles.set(uploadedArray);
    attachmentCount--;
    if (attachmentCount === 0) {
      let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>'; 
      $("#file-display").html(elementToAdd);
    }
    tempObj.attachmentCount.set(attachmentCount);
    if (uploadedArray.length > 0) {
      let utilityService = new UtilityService();
      utilityService.showUploadedAttachment(uploadedArray);
    } else {
      $(".attchment-tooltip").show();
    }
  },

  'click #btn_Attachment': function() {
    let templateInstance = Template.instance();
    let uploadedFileArray = templateInstance.uploadedFiles.get();
    if (uploadedFileArray.length > 0) {
        let utilityService = new UtilityService();
        utilityService.showUploadedAttachment(uploadedFileArray);
    } else {
        $(".attchment-tooltip").show();
    }
  },

  "click .chkEmailCopy": function (event) {
    let templateObject = Template.instance();
    let targetElement;
    if(templateObject.data.clientType == 'Customer') {
      targetElement = $('#edtCustomerEmail')
    } else if(clientType == 'Supplier') {
      targetElement = $('#edtSupplierEmail')
    }
    $(targetElement).val($(targetElement).val().replace(/\s/g, ""));
    if ($(event.target).is(":checked")) {
      let checkEmailData = $(targetElement).val();

      if (checkEmailData.replace(/\s/g, "") === "") {
        if(templateObject.data.clientType == 'Customer') {
          swal("Customer Email cannot be blank!", "", "warning");
        } else if(templateObject.data.clientType == 'Supplier') {
          swal("Supplier Email cannot be blank!", "", "warning");
        }
        event.preventDefault();
      } else {
        function isEmailValid(mailTo) {
          return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
        }
        if (!isEmailValid(checkEmailData)) {
          swal(
            "The email field must be a valid email address !",
            "",
            "warning"
          );

          event.preventDefault();
          return false;
        } else { }
      }
    } else { }
  },

   // add to custom field
   "click #edtSaleCustField1": function (e) {
    $("#clickedControl").val("one");
  },

  // add to custom field
  "click #edtSaleCustField2": function (e) {
    $("#clickedControl").val("two");
  },

  // add to custom field
  "click #edtSaleCustField3": function (e) {
    $("#clickedControl").val("three");
  },

  "click #printModal .btn-check-template": function (event) {
    const template = $(event.target).data('template');
    const templateObject = Template.instance()
    // $("#" + checkboxID).trigger("click");
    templateObject.print(template)
  },


  "click #printModal #btnSendEmail" : async function (event) {
    const templateObject = Template.instance()
    const checkedPrintOptions = $("#printModal").find(".chooseTemplateBtn:checked")
    if(templateObject.data.clientType == 'Customer') {
      if ($("#edtCustomerEmail").val() != "") {
        LoadingOverlay.show();
        await templateObject.sendEmailWithAttachment();
        LoadingOverlay.hide();
      } else {
        swal({
          title: "Customer Email Required",
          text: "Please enter customer email",
          type: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
        })
      }
    } else if(templateObject.data.clientType == 'Supplier') {
      if ($("#edtSupplierEmail").val() != "") {
        LoadingOverlay.show();
        await templateObject.sendEmailWithAttachment();
        LoadingOverlay.hide();
      } else {
        swal({
          title: "Supplier Email Required",
          text: "Please enter supplier email",
          type: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
        })
      }
    }
  },

  "click .printConfirm": async function (event) {
    const checkedPrintOptions = $("#printModal").find(".chooseTemplateBtn:checked")
    // if(checkedPrintOptions.length == 0){
    //   return;
    // }
    playPrintAudio();
    const templateObject = Template.instance();
    templateObject.print()
  },

  'click .btnSave': function (event) {
    let templateObject = Template.instance();
    let uploadedData = templateObject.uploadedFiles.get();
    let accountId = templateObject.accountID.get();
    let stripe_fee_method = templateObject.stripe_fee_method.get();
    let obj = {
      uploadedData: uploadedData,
      accoundId: accountId,
      stripe_fee_method: stripe_fee_method
    }
    templateObject.data.saveTransaction(obj)
  },

  'change .exchange-rate-js, change input.lineUnitPrice, change input.lineCostPrice': (e, ui) => {
    let templateObject = Template.instance();
    let tablename = templateObject.data.gridTableId;
    FxGlobalFunctions.convertToForeignEveryFieldsInTableId("#"+tablename, new UtilityService());
    setTimeout(()=>{
      let rate = $("#exchange_rate").val();
      let cloneRecord  = cloneDeep(templateObject.transactionrecord.get());
      let lineItems = cloneRecord.LineItems;
      let lid = $(e.target).closest('tr').attr('id')
      let lineIndex = lineItems.findIndex(line =>{
        return line.lineID == lid
      })
  
      lineItems[lineIndex].lineCost = $(e.target).closest('tr').find('.colCostPrice .colCostPrice').val();
  
      lineItems[lineIndex].unitPrice = $(e.target).closest('tr').find('.colUnitPriceEx .colUnitPriceEx').val();
  
      lineItems[lineIndex].TotalAmt = $(e.target).closest('tr').find('.colAmountEx.lineAmount').text();
  
  
      // FxGlobalFunctions.convertToForeignAmount(value, rate, FxGlobalFunctions.getCurrentCurrencySymbol());
      // let fxCost = FxGlobalFunctions.convertToForeignAmount(lineItems[lineIndex].lineCost, rate, FxGlobalFunctions.getCurrentCurrencySymbol());
      // let fxTotalAmt = FxGlobalFunctions.convertToForeignAmount(lineItems[lineIndex].TotalAmt, rate, FxGlobalFunctions.getCurrentCurrencySymbol());
      // let fxUnitPrice = FxGlobalFunctions.convertToForeignAmount(lineItems[lineIndex].unitPrice, rate, FxGlobalFunctions.getCurrentCurrencySymbol());
  
      cloneRecord.LineItems = lineItems;
      templateObject.transactionrecord.set(cloneRecord)
    }, 1500)
  },

  "blur .lineQty": function (event) {
    let templateObject = Template.instance();
    let taxcodeList = templateObject.taxraterecords.get();
    let utilityService = new UtilityService();
    let $tblrows = $("#"+templateObject.data.gridTableId+" tbody tr");
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

  "click .lineProductName, keydown .lineProductName": function (event) {
    // if($(event.target).val() == '') {
      // $('#productlistmodal').modal('show')
    // }
    var targetID = $(event.target).closest("tr").attr("id");
    $("#selectLineID").val(targetID);
  },

  'click #addRow': function(event) {
    let templateObject = Template.instance();
    let tokenid = Random.id();
    let tempRecord = cloneDeep(templateObject.transactionrecord.get());
    let lineItems = tempRecord.LineItems;
    lineItems.push({
      DiscountPercent: 0,
      SalesLinesCustField1: "",
      TaxRate: "",
      TaxTotal: "",
      TotalAmt: "",
      TotalAmtInc: "",
      UnitOfMeasure: "",
      curTotalAmt: "",
      description: "",
      expirydates:"",
      item: "",
      lineCost: "",
      lineID: tokenid,
      lotnumbers: "",
      qtybo: 0,
      qtyordered: 0,
      qtyshipped: 0,
      quantity: 0,
      serialnumbers: "",
      taxCode: "",
      taxRate: "",
      unitPrice: "",
      unitPriceInc: "" , 
    })
    tempRecord.LineItems = lineItems;
    templateObject.transactionrecord.set(tempRecord);
    setTimeout(()=>{
      $('#'+templateObject.data.gridTableId+ ' tbody>tr:last').attr('id', tokenid);
      $('#'+templateObject.data.gridTableId+ ' tbody>tr:last td .lineProductName').trigger('click')
    }, 2000)
  }


})