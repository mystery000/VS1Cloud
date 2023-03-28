import { Template } from 'meteor/templating';
import "./customerselector.html"
import { ContactService } from "../../../../../contacts/contact-service";
import { SideBarService } from '../../../../../js/sidebar-service';
import { UtilityService } from '../../../../../utility-service';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { SalesBoardService } from "../../../../../js/sales-service";
import { PurchaseBoardService } from "../../../../../js/purchase-service";
import { TaxRateService } from "../../../../../settings/settings-service.js";

let utilityService = new UtilityService();
let salesService = new SalesBoardService();
let purchaseService = new PurchaseBoardService();
let taxRateService = new TaxRateService();
let contactService = new ContactService();
Template.customerselector.onCreated(function() {
    let templateObject = Template.instance();
    templateObject.taxraterecords = new ReactiveVar();
    templateObject.subtaxcodes = new ReactiveVar();
    templateObject.taxcodes = new ReactiveVar()
})

Template.customerselector.onRendered(function() {
    let templateObject = Template.instance();

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
    templateObject.getSubTaxCodes();


    templateObject.setCustomerInfo = function(selectedTaxCodeName) {
        let taxcodeList = templateObject.taxraterecords.get();
        let $tblrows = $("#"+templateObject.data.lineTableId+" tbody tr");
        let $printrows = $("."+templateObject.data.printTableId+" tbody tr");
        let selectedCustomer = $("#edtCustomerName").val();

        let taxRate = "";
          taxRate = taxcodeList.filter((taxrate) => {
            return taxrate.codename == selectedTaxCodeName;
          });
          if (taxRate.length > 0) {
            let rate = taxRate[0].coderate;
            let code = selectedTaxCodeName || "E";
            if (code == "NT") {
              code = "E";
            }
            let taxcodeList = templateObject.taxraterecords.get();

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
              if ($tblrow.find(".lineProductName").val() == "") {
                $tblrow.find(".colProductName").addClass("boldtablealertsborder");
              }
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
              var taxcode = code;
              $printrows.find("#lineTaxCode").text(code);
              $printrows.find("#lineTaxRate").text(rate);
              var taxrateamount = 0;
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
          }
        $("#tblCustomerlist_filter .form-control-sm").val("");
    }

    templateObject.setCustomerByID = function(data) {
        $("#edtCustomerName").val(data.fields.ClientName);
        $("#edtCustomerName").attr("custid", data.fields.ID);
        $("#edtCustomerEmail").val(data.fields.Email);
        $("#edtCustomerEmail").attr("customerid", data.fields.ID);
        $("#edtCustomerEmail").attr("customerfirstname", data.fields.FirstName);
        $("#edtCustomerEmail").attr("customerlastname", data.fields.LastName);
        $("#customerType").text(data.fields.ClientTypeName || "Default");
        $("#customerDiscount").text(data.fields.Discount + "%" || 0 + "%");
        $("#edtCustomerUseType").val(data.fields.ClientTypeName || "Default");
        $("#edtCustomerUseDiscount").val(data.fields.Discount || 0);
        let postalAddress =
          data.fields.Companyname +
          "\n" +
          data.fields.Street +
          "\n" +
          data.fields.Street2 +
          " " +
          data.fields.State +
          " " +
          data.fields.Postcode +
          "\n" +
          data.fields.Country;
        $("#txabillingAddress").val(postalAddress);
        $("#pdfCustomerAddress").html(postalAddress);
        $(".pdfCustomerAddress").text(postalAddress);
        $("#txaShipingInfo").val(postalAddress);
        $("#sltTerms").val(
          data.fields.TermsName || templateObject.defaultsaleterm.get() || ""
        );
        let selectedTaxCodeName = data.fields.TaxCodeName || "E";
        templateObject.setCustomerInfo(selectedTaxCodeName);
    }

    if(FlowRouter.current().queryParams.customerid) {
        let customerID = FlowRouter.current().queryParams.customerid
        getVS1Data("TCustomerVS1").then(function (dataObject) {
        if (dataObject.length === 0) {
          contactService.getOneCustomerDataEx(customerID).then(function (data) {
            templateObject.setCustomerByID(data);
          });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tcustomervs1;
          let added = false;
          for (let i = 0; i < useData.length; i++) {
            if (parseInt(useData[i].fields.ID) === parseInt(customerID)) {
              added = true;
              templateObject.setCustomerByID(useData[i]);
            }
          }
          if (!added) {
            contactService
              .getOneCustomerDataEx(customerID)
              .then(function (data) {
                templateObject.setCustomerByID(data);
              });
          }
        }
      })
      .catch(function (err) {
        contactService.getOneCustomerDataEx(customerID).then(function (data) {
          $(".fullScreenSpin").css("display", "none");
          templateObject.setCustomerByID(data);
        });
      });
    }

    templateObject.setSupplierInfo = function(){

        let utilityService = new UtilityService();
        let taxcodeList = templateObject.taxraterecords.get();
        let $tblrows = $("#"+templateObject.data.lineTableId+" tbody tr");

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        $tblrows.each(function(index) {
            let taxTotal;
            const $tblrow = $(this);
            const qty = $tblrow.find(".lineQty").val() || 0;
            const price = $tblrow.find(".colUnitPriceExChange").val() || 0;
            const taxcode = $tblrow.find(".lineTaxCode").val() || '';
            if($tblrow.find(".lineAccountName").val() === ''){
                $tblrow.find(".colAccountName").addClass('boldtablealertsborder');
            }
            if($tblrow.find(".lineProductName").val() === ''){
                $tblrow.find(".colProductName").addClass('boldtablealertsborder');
            }
            let taxrateamount = 0;
            if (taxcodeList) {
                for (let i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename === taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }
            const subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            if ((taxrateamount === '') || (taxrateamount === ' ')) {
                taxTotal = 0;
            } else {
                taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            }
            let lineTotalAmount = subTotal + taxTotal;
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
            let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
            let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
            let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
            $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
            $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));
            if (!isNaN(subTotal)) {
                $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
            }
            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
            }
            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                if(document.getElementById("balanceDue") && document.getElementById("balanceDue") !=null) {
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                }
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
            }
        });
        $('#tblSupplierlist_filter .form-control-sm').val('');
        setTimeout(function() {
            $('.btnRefreshSupplier').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    }


    function setSupplierByID(data){
        $('#edtSupplierName').val(data.fields.ClientName);
        $('#edtSupplierName').attr("suppid", data.fields.ID);
        $('#edtSupplierEmail').val(data.fields.Email);
        $('#edtSupplierEmail').attr('customerid', data.fields.ID);
        $('#edtSupplierName').attr('suppid', data.fields.ID);

        let postalAddress = data.fields.Companyname + '\n' + data.fields.Street + '\n' + data.fields.Street2 + ' ' + data.fields.State + ' ' + data.fields.Postcode + '\n' + data.fields.Country;
        $('#txabillingAddress').val(postalAddress);
        $('#pdfSupplierAddress').html(postalAddress);
        $('.pdfSupplierAddress').text(postalAddress);
        $('#txaShipingInfo').val(postalAddress);
        $('#sltTerms').val(data.fields.TermsName || purchaseDefaultTerms);
        templateObject.setSupplierInfo();
    }

    function getSupplierData(supplierID) {
        getVS1Data('TSupplierVS1').then(function (dataObject) {
            if (dataObject.length === 0) {
                contactService.getOneSupplierDataEx(supplierID).then(function (data) {
                    setSupplierByID(data);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsuppliervs1;
                let added = false;
                for (let i = 0; i < useData.length; i++) {
                    if (parseInt(useData[i].fields.ID) === parseInt(supplierID)) {
                        added = true;
                        setSupplierByID(useData[i]);
                    }
                }
                if (!added) {
                    contactService.getOneSupplierDataEx(supplierID).then(function (data) {
                        setSupplierByID(data);
                    });
                }
            }
        }).catch(function (err) {
            contactService.getOneSupplierDataEx(supplierID).then(function (data) {
                $('.fullScreenSpin').css('display', 'none');
                setSupplierByID(data);
            });
        });
    }

    if(FlowRouter.current().queryParams.supplierid) {
        getSupplierData(FlowRouter.current().queryParams.supplierid)
    }

    // $(document).on('click')
    $(document).on('click', '#tblCustomerlist tbody tr', function(event) {
        let value = $(event.target).closest('tr').find('.colCompany').text();
        let address = '';
        let billingAddressField = $('#txabillingAddress');
        let street = $(event.target).closest('tr').find('.colStreetAddress')?.text()
        let city = $(event.target).closest('tr').find('.colCity')?.text()
        let state = $(event.target).closest('tr').find('.colState')?.text()
        let postCode = $(event.target).closest('tr').find('.colZipCode')?.text()
        let country = $(event.target).closest('tr').find('.colCountry')?.text()
        address = value + '\n' + street+"\n"+ city + ' '+ state+' ' + postCode + '\n' + country
        if(billingAddressField && billingAddressField.length > 0) {
            $(billingAddressField).val(address)
        }
        let clientEmailInput = 'edtCustomerEmail';
        let colTerms = 'colCustomerTermName'
        let email = $(event.target).closest('tr').find('.colEmail').text();
        $('#'+clientEmailInput).val(email)
        let termsField = $('#sltTerms');
        if(termsField && termsField.length > 0) {
            $(termsField).val($(event.target).closest('tr').find('.'+ colTerms).text())
        }
        let customerId = $(event.target).closest('tr').find('.colCustomerID').text();
        let firstName = $(event.target).closest('tr').find('.colCustomerFirstName').text();
        let lastName = $(event.target).closest('tr').find('.colCustomerLastName').text();
        let customerType = $(event.target).closest('tr').find('.colCustomerType').text() || 'Default'
        let customerDiscount = $(event.target).closest('tr').find('.colCustomerDiscount').text() || 0;
        let taxCode = $(event.target).closest('tr').find('.colCustomerTaxCode').text() || 'E';
        $("#edtCustomerName").attr("custid", customerId);
        // $("#edtCustomerEmail").val(data.fields.Email);
        $("#edtCustomerEmail").attr("customerid", customerId);
        // $("#edtCustomerName").attr("custid", data.fields.ID);
        $("#edtCustomerEmail").attr("customerfirstname", firstName);
        $("#edtCustomerEmail").attr("customerlastname", lastName);
        $("#customerType").text(customerType);
        $("#customerDiscount").text(customerDiscount + "%");
        $("#edtCustomerUseType").val(customerType);
        $("#edtCustomerUseDiscount").val(customerDiscount);

        $("#pdfCustomerAddress").html(address);
        $(".pdfCustomerAddress").text(address);
        $("#txaShipingInfo").val(address);
        templateObject.setCustomerInfo(taxCode);
    })

    $(document).on('click', '#tblSupplierlist tbody tr', function(event) {
        let value = $(event.target).closest('tr').find('.colCompany').text();
        let address = '';

        let street = $(event.target).closest('tr').find('.colStreetAddress')?.text()
        let city = $(event.target).closest('tr').find('.colCity')?.text()
        let state = $(event.target).closest('tr').find('.colState')?.text()
        let postCode = $(event.target).closest('tr').find('.colZipCode')?.text()
        let country = $(event.target).closest('tr').find('.colCountry')?.text()
        address = value + '\n' + street+"\n"+ city + ' '+ state+' ' + postCode + '\n' + country

        let clientEmailInput = 'edtSupplierEmail';
        let colTerms = 'colSupplierTermName'
        let email = $(event.target).closest('tr').find('.colEmail').text();
        $('#'+clientEmailInput).val(email)
        let termsField = $('#sltTerms');
        if(termsField && termsField.length > 0) {
            $(termsField).val($(event.target).closest('tr').find('.'+ colTerms).text())
        }
        let customerId = $(event.target).closest('tr').find('.colID').text();
        let firstName = $(event.target).closest('tr').find('.colSupplierFirstName').text();
        let lastName = $(event.target).closest('tr').find('.colSupplierLastName').text();
        let supplierType = $(event.target).closest('tr').find('.colSupplierType').text() || 'Default'
        let supplierDiscount = $(event.target).closest('tr').find('.colSupplierDiscount').text() || 0;
        $("#edtSupplierName").attr("custid", customerId);
        // $("#edtCustomerEmail").val(data.fields.Email);
        $("#edtSupplierEmail").attr("customerid", customerId);
        // $("#edtSupplierName").attr("custid", data.fields.ID);
        $("#edtSupplierEmail").attr("customerfirstname", firstName);
        $("#edtSupplierEmail").attr("customerlastname", lastName);
        $("#customerType").text(supplierType);
        $("#customerDiscount").text(supplierDiscount + "%");
        $("#edtCustomerUseType").val(supplierType);
        $("#edtCustomerUseDiscount").val(supplierDiscount);

        $("#pdfCustomerAddress").html(address);
        $(".pdfCustomerAddress").text(address);
        $("#txabillingAddress").val(address);
        templateObject.setSupplierInfo();
    })

})

Template.customerselector.events( {
    'click #tblCustomerlist tbody tr': function(event) {
        let templateObject = Template.instance();

    },

    'click #tblSupplierList tbody tr': function(event) {
        let templateObject = Template.instance();

    }
})
