import {
    SalesBoardService
} from './sales-service';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    DashBoardService
} from "../Dashboard/dashboard-service";
import {
    UtilityService
} from "../utility-service";
import {
    ProductService
} from "../product/product-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';

import {
    Random
} from 'meteor/random';
import {
    jsPDF
} from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import {
    autoTable
} from 'jspdf-autotable';

import 'jquery-editable-select';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.refundcard.onCreated(() => {

    const templateObject = Template.instance();
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

    /* Attachments */
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();

    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();
    templateObject.statusrecords = new ReactiveVar([]);
    templateObject.productextrasellrecords = new ReactiveVar([]);

    templateObject.defaultsaleterm = new ReactiveVar();

    setTimeout(function() {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#colInvnoReference").removeClass("col-auto");
                $("#colInvnoReference").addClass("col-6");

                $("#colTermsVia").removeClass("col-auto");
                $("#colTermsVia").addClass("col-6");

                $("#colStatusDepartment").removeClass("col-auto");
                $("#colStatusDepartment").addClass("col-6");

                $("#colBillingAddress").removeClass("col-auto");
                $("#colBillingAddress").addClass("col-6");

                $("#colOrderDue").removeClass("col-auto");
                $("#colOrderDue").addClass("col-6");

                $("#fieldwidth").removeClass("billaddressfield");
                $("#fieldwidth").addClass("billaddressfield2");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

    setTimeout(function() {

        var x = window.matchMedia("(max-width: 420px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#colInvnoReference").removeClass("col-auto");
                $("#colInvnoReference").addClass("col-12");

                $("#colTermsVia").removeClass("col-auto");
                $("#colTermsVia").addClass("col-12");

                $("#colStatusDepartment").removeClass("col-auto");
                $("#colStatusDepartment").addClass("col-12");

                $("#colBillingAddress").removeClass("col-auto");
                $("#colBillingAddress").addClass("col-12");

                $("#colOrderDue").removeClass("col-auto");
                $("#colOrderDue").addClass("col-12");

                $("#colSupplierName").removeClass("col-auto");
                $("#colSupplierName").addClass("col-12");

                $("#colSupplierEmail").removeClass("col-auto");
                $("#colSupplierEmail").addClass("col-12");

                $("#fieldwidth").removeClass("billaddressfield");
                $("#fieldwidth").addClass("billaddressfield2");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

});
Template.refundcard.onRendered(() => {

    $(window).on('load', function() {
        var win = $(this); //this = window
        if (win.width() <= 1024 && win.width() >= 450) {
            $("#colBalanceDue").addClass("order-12");
        }

        if (win.width() <= 926) {
            $("#totalSection").addClass("offset-md-6");
        }

    });

    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('.uploadedImage').attr('src', imageData);
    };

    const templateObject = Template.instance();
    const records = [];
    let salesService = new SalesBoardService();
    let clientsService = new SalesBoardService();
    let productsService = new SalesBoardService();
    let accountService = new SalesBoardService();
    const clientList = [];
    const productsList = [];
    const accountsList = [];
    const deptrecords = [];
    const termrecords = [];
    const statusList = [];

    $("#date-input,#dtSODate,#dtDueDate").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        dateFormat: 'dd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });


    $(document).ready(function() {


        $('#formCheck-one').click(function() {


            if ($(event.target).is(':checked')) {
                $('.checkbox1div').css('display', 'block');
            } else {
                $('.checkbox1div').css('display', 'none');
            }
        });
        $('#formCheck-two').click(function() {


            if ($(event.target).is(':checked')) {
                $('.checkbox2div').css('display', 'block');
            } else {
                $('.checkbox2div').css('display', 'none');
            }
        });

        $('.customField1Text').blur(function() {
            var inputValue1 = $('.customField1Text').text();
            $('.lblCustomField1').text(inputValue1);
        });

        $('.customField2Text').blur(function() {
            var inputValue2 = $('.customField2Text').text();
            $('.lblCustomField2').text(inputValue2);
        });


    });

    $('.fullScreenSpin').css('display', 'inline-block');
    templateObject.getAllClients = function() {
        getVS1Data('TCustomerVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                clientsService.getClientVS1().then(function(data) {
                    for (let i in data.tcustomervs1) {

                        let customerrecordObj = {
                            customerid: data.tcustomervs1[i].Id || ' ',
                            customername: data.tcustomervs1[i].ClientName || ' ',
                            customeremail: data.tcustomervs1[i].Email || ' ',
                            street: data.tcustomervs1[i].Street || ' ',
                            street2: data.tcustomervs1[i].Street2 || ' ',
                            street3: data.tcustomervs1[i].Street3 || ' ',
                            suburb: data.tcustomervs1[i].Suburb || ' ',
                            statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                            country: data.tcustomervs1[i].Country || ' ',
                            termsName: data.tcustomervs1[i].TermsName || '',
                            taxCode: data.tcustomervs1[i].TaxCodeName || 'E',
                            clienttypename: data.tcustomervs1[i].ClientTypeName || 'Default',
                            discount: data.tcustomervs1[i].Discount || 0
                        };

                        clientList.push(customerrecordObj);


                    }

                    templateObject.clientrecords.set(clientList.sort(function(a, b) {
                        if (a.customername == 'NA') {
                            return 1;
                        } else if (b.customername == 'NA') {
                            return -1;
                        }
                        return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                    }));

                    for (var i = 0; i < clientList.length; i++) {
                        //$('#edtCustomerName').editableSelect('add',clientList[i].customername);
                    }
                    if (FlowRouter.current().queryParams.id) {

                    } else {
                        setTimeout(function() {
                            $('#edtCustomerName').trigger("click");
                        }, 200);
                    }

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;

                for (let i in useData) {

                    let customerrecordObj = {
                        customerid: useData[i].fields.ID || ' ',
                        customername: useData[i].fields.ClientName || ' ',
                        customeremail: useData[i].fields.Email || ' ',
                        street: useData[i].fields.Street || ' ',
                        street2: useData[i].fields.Street2 || ' ',
                        street3: useData[i].fields.Street3 || ' ',
                        suburb: useData[i].fields.Suburb || ' ',
                        statecode: useData[i].fields.State + ' ' + useData[i].fields.Postcode || ' ',
                        country: useData[i].fields.Country || ' ',
                        termsName: useData[i].fields.TermsName || '',
                        taxCode: useData[i].fields.TaxCodeName || 'E',
                        clienttypename: useData[i].fields.ClientTypeName || 'Default',
                        discount: useData[i].fields.Discount || 0
                    };

                    clientList.push(customerrecordObj);


                }

                templateObject.clientrecords.set(clientList.sort(function(a, b) {
                    if (a.customername == 'NA') {
                        return 1;
                    } else if (b.customername == 'NA') {
                        return -1;
                    }
                    return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    //$('#edtCustomerName').editableSelect('add',clientList[i].customername);
                }
                if (FlowRouter.current().queryParams.id) {

                } else {
                    setTimeout(function() {
                        $('#edtCustomerName').trigger("click");
                    }, 100);
                }
            }
        }).catch(function(err) {
            clientsService.getClientVS1().then(function(data) {
                for (let i in data.tcustomervs1) {

                    let customerrecordObj = {
                        customerid: data.tcustomervs1[i].Id || ' ',
                        customername: data.tcustomervs1[i].ClientName || ' ',
                        customeremail: data.tcustomervs1[i].Email || ' ',
                        street: data.tcustomervs1[i].Street || ' ',
                        street2: data.tcustomervs1[i].Street2 || ' ',
                        street3: data.tcustomervs1[i].Street3 || ' ',
                        suburb: data.tcustomervs1[i].Suburb || ' ',
                        statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                        country: data.tcustomervs1[i].Country || ' ',
                        termsName: data.tcustomervs1[i].TermsName || '',
                        clienttypename: data.tcustomervs1[i].ClientTypeName || 'Default',
                        discount: data.tcustomervs1[i].Discount || 0
                    };

                    clientList.push(customerrecordObj);


                }

                templateObject.clientrecords.set(clientList.sort(function(a, b) {
                    if (a.customername == 'NA') {
                        return 1;
                    } else if (b.customername == 'NA') {
                        return -1;
                    }
                    return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    //$('#edtCustomerName').editableSelect('add',clientList[i].customername);
                }
                if (FlowRouter.current().queryParams.id) {

                } else {
                    setTimeout(function() {
                        $('#edtCustomerName').trigger("click");
                    }, 200);
                }

            });
        });
    };

    templateObject.getAllLeadStatuss = function() {
        getVS1Data('TLeadStatusType').then(function(dataObject) {
            if (dataObject.length == 0) {
                clientsService.getAllLeadStatus().then(function(data) {
                    for (let i in data.tleadstatustype) {
                        let leadrecordObj = {
                            orderstatus: data.tleadstatustype[i].TypeName || ' '

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
                        orderstatus: useData[i].TypeName || ' '

                    };

                    statusList.push(leadrecordObj);
                }
                templateObject.statusrecords.set(statusList);

            }
            setTimeout(function() {
                $('#sltStatus').append('<option value="newstatus">New Lead Status</option>');
            }, 1500)
        }).catch(function(err) {
            clientsService.getAllLeadStatus().then(function(data) {
                for (let i in data.tleadstatustype) {
                    let leadrecordObj = {
                        orderstatus: data.tleadstatustype[i].TypeName || ' '

                    };

                    statusList.push(leadrecordObj);
                }
                templateObject.statusrecords.set(statusList);


            });
        });
    };

    templateObject.getAllClients();
    templateObject.getAllLeadStatuss();
    var url = FlowRouter.current().path;
    if (url.indexOf('?id=') > 0) {
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            templateObject.getInvoiceData = function() {

                accountService.getRefundSales(currentInvoice).then(function(data) {
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];
                    let lineItemObj = {};
                    let lineItemsTable = [];
                    let lineItemTableObj = {};
                    let exchangeCode = data.fields.ForeignExchangeCode;
                    let currencySymbol = Currency;
                    let total =  utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalInc =  utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalDiscount = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let subTotal = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.fields.TotalTax).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let totalPaidAmount = utilityService.modifynegativeCurrencyFormat(data.fields.TotalPaid).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    if (data.fields.Lines.length) {
                        for (let i = 0; i < data.fields.Lines.length; i++) {
                            let AmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount);
                            let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                            let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                            lineItemObj = {
                                lineID: Random.id(),
                                id: data.fields.Lines[i].fields.ID || '',
                                item: data.fields.Lines[i].fields.ProductName || '',
                                description: data.fields.Lines[i].fields.ProductDescription || '',
                                quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                unitPrice: currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                }) || 0,
                                taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                TotalAmt: AmountGbp || 0,
                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                TaxTotal: TaxTotalGbp || 0,
                                TaxRate: TaxRateGbp || 0,
                                DiscountPercent: data.fields.Lines[i].fields.DiscountPercent || 0
                            };
                            var dataListTable = [
                                data.fields.Lines[i].fields.ProductName || '',
                                data.fields.Lines[i].fields.ProductDescription || '',
                                "<div contenteditable='true' class='qty'>" + '' + data.fields.Lines[i].fields.UOMOrderQty + '' + "</div>" || "<div>" + '' + 0 + '' + "</div>",
                                "<div>" + '' + currencySymbol + '' + data.fields.Lines[i].fields.LinePrice.toFixed(2) + '' + "</div>" || currencySymbol + '' + 0.00,
                                data.fields.Lines[i].fields.LineTaxCode || '',
                                AmountGbp || currencySymbol + '' + 0.00,
                                '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
                            ];
                            lineItemsTable.push(dataListTable);
                            lineItems.push(lineItemObj);
                        }
                    } else {
                        let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let currencyAmountGbp = currencySymbol + '' + data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                        let TaxRateGbp = currencySymbol + '' + data.fields.Lines.fields.LineTaxRate;
                        lineItemObj = {
                            lineID: Random.id(),
                            id: data.fields.Lines.fields.ID || '',
                            description: data.fields.Lines.fields.ProductDescription || '',
                            quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                            unitPrice: data.fields.Lines[i].fields.LinePrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0,
                            lineCost: data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0,
                            taxRate: data.fields.Lines.fields.LineTaxRate || 0,
                            taxCode: data.fields.Lines.fields.LineTaxCode || '',
                            TotalAmt: AmountGbp || 0,
                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                            TaxTotal: TaxTotalGbp || 0,
                            TaxRate: TaxRateGbp || 0
                        };
                        lineItems.push(lineItemObj);
                    }

                    let invoicerecord = {
                        id: data.fields.ID,
                        lid: 'Refund' + ' ' + data.fields.ID,
                        socustomer: data.fields.CustomerName,
                        salesOrderto: data.fields.InvoiceToDesc,
                        shipto: data.fields.ShipToDesc,
                        department: data.fields.SaleClassName,
                        docnumber: data.fields.DocNumber,
                        custPONumber: data.fields.CustPONumber,
                        saledate: data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD/MM/YYYY') : "",
                        duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
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
                        TotalDiscount: totalDiscount,
                        LineItems: lineItems,
                        TotalTax: totalTax,
                        SubTotal: subTotal,
                        balanceDue: totalBalance,
                        saleCustField1: data.fields.SaleCustField1,
                        saleCustField2: data.fields.SaleCustField2,
                        totalPaid: totalPaidAmount,
                        ispaid: data.fields.IsPaid
                    };

                    $('#edtCustomerName').val(data.fields.CustomerName);
                    $('#sltTerms').val(data.fields.TermsName);
                    $('#sltDept').val(data.fields.SaleClassName);
                    $('#sltStatus').val(data.fields.SalesStatus);
                    templateObject.CleintName.set(data.fields.CustomerName);
                    $('#sltCurrency').val(data.fields.ForeignExchangeCode);
                    $('#sltPaymentMethod').val(data.fields.PayMethod);
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
                    setTimeout(function() {
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.CustomerName) {
                                    checkISCustLoad = true;
                                    invoicerecord.firstname = clientList[i].firstname || '';
                                    invoicerecord.lastname = clientList[i].lastname || '';
                                    templateObject.invoicerecord.set(invoicerecord);
                                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                                    $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                    $('#edtCustomerName').attr('custid', clientList[i].customerid);
                                    $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                                    $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                                    $('#customerType').text(clientList[i].clienttypename || 'Default');
                                    $('#customerDiscount').text(clientList[i].discount + '%' || 0 + '%');
                                    $('#edtCustomerUseType').val(clientList[i].clienttypename || 'Default');
                                    $('#edtCustomerUseDiscount').val(clientList[i].discount || 0);
                                }
                            }
                        };

                        if (data.fields.IsPaid === true) {
                            $('#edtCustomerName').attr('readonly', true);
                            $('.btn-primary').attr('disabled', 'disabled');

                            $('#btnCopyInvoice').attr('disabled', 'disabled');
                            $('#edtCustomerName').css('background-color', '#eaecf4');

                            $('#btnViewPayment').removeAttr('disabled', 'disabled');
                            $('.btnSave').attr('disabled', 'disabled');
                            $('#btnBack').removeAttr('disabled', 'disabled');
                            $('.printConfirm').removeAttr('disabled', 'disabled');
                            $('.tblInvoiceLine tbody tr').each(function() {
                                var $tblrow = $(this);
                                $tblrow.find("td").attr('contenteditable', false);
                                //$tblrow.find("td").removeClass("lineProductName");
                                $tblrow.find("td").removeClass("lineTaxRate");
                                $tblrow.find("td").removeClass("lineTaxCode");

                                $tblrow.find("td").attr('readonly', true);
                                $tblrow.find("td").attr('disabled', 'disabled');
                                $tblrow.find("td").css('background-color', '#eaecf4');
                                $tblrow.find("td .table-remove").removeClass("btnRemove");
                            });
                        }

                        if (!checkISCustLoad) {
                            sideBarService.getCustomersDataByName(useData[d].fields.CustomerName).then(function(dataClient) {
                                for (var c = 0; c < dataClient.tcustomervs1.length; c++) {
                                    var customerrecordObj = {
                                        customerid: dataClient.tcustomervs1[c].Id || ' ',
                                        firstname: dataClient.tcustomervs1[c].FirstName || ' ',
                                        lastname: dataClient.tcustomervs1[c].LastName || ' ',
                                        customername: dataClient.tcustomervs1[c].ClientName || ' ',
                                        customeremail: dataClient.tcustomervs1[c].Email || ' ',
                                        street: dataClient.tcustomervs1[c].Street || ' ',
                                        street2: dataClient.tcustomervs1[c].Street2 || ' ',
                                        street3: dataClient.tcustomervs1[c].Street3 || ' ',
                                        suburb: dataClient.tcustomervs1[c].Suburb || ' ',
                                        statecode: dataClient.tcustomervs1[c].State + ' ' + dataClient.tcustomervs1[c].Postcode || ' ',
                                        country: dataClient.tcustomervs1[c].Country || ' ',
                                        termsName: dataClient.tcustomervs1[c].TermsName || '',
                                        taxCode: dataClient.tcustomervs1[c].TaxCodeName || 'E',
                                        clienttypename: dataClient.tcustomervs1[c].ClientTypeName || 'Default'
                                    };
                                    clientList.push(customerrecordObj);

                                    invoicerecord.firstname = dataClient.tcustomervs1[c].FirstName || '';
                                    invoicerecord.lastname = dataClient.tcustomervs1[c].LastName || '';
                                    $('#edtCustomerEmail').val(dataClient.tcustomervs1[c].Email);
                                    $('#edtCustomerEmail').attr('customerid', clientList[c].customerid);
                                    $('#edtCustomerName').attr('custid', dataClient.tcustomervs1[c].Id);
                                    $('#edtCustomerEmail').attr('customerfirstname', dataClient.tcustomervs1[c].FirstName);
                                    $('#edtCustomerEmail').attr('customerlastname', dataClient.tcustomervs1[c].LastName);
                                    $('#customerType').text(dataClient.tcustomervs1[c].ClientTypeName || 'Default');
                                    $('#customerDiscount').text(dataClient.tcustomervs1[c].Discount + '%' || 0 + '%');
                                    $('#edtCustomerUseType').val(dataClient.tcustomervs1[c].ClientTypeName || 'Default');
                                    $('#edtCustomerUseDiscount').val(dataClient.tcustomervs1[c].Discount || 0);
                                }

                                templateObject.clientrecords.set(clientList.sort(function(a, b) {
                                    if (a.customername == 'NA') {
                                        return 1;
                                    } else if (b.customername == 'NA') {
                                        return -1;
                                    }
                                    return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                                }));
                            });
                        }
                    }, 100);


                    templateObject.invoicerecord.set(invoicerecord);

                    templateObject.selectedCurrency.set(invoicerecord.currency);
                    templateObject.inputSelectedCurrency.set(invoicerecord.currency);
                    if (templateObject.invoicerecord.get()) {





                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function(error, result) {
                            if (error) {


                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass;
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                        let columnWidth = customcolumn[i].width;


                                        $("" + columHeaderUpdate + "").html(columData);
                                        if (columnWidth != 0) {
                                            $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                        }

                                        if (hiddenColumn == true) {


                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');



                                        }

                                    }
                                }

                            }
                        });
                    }
                }).catch(function(err) {
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
                    $('.fullScreenSpin').css('display', 'none');

                });
            };

            templateObject.getInvoiceData();
        }
    } else {
        $('.fullScreenSpin').css('display', 'none');

        let lineItems = [];
        let lineItemsTable = [];
        let lineItemObj = {};
        lineItemObj = {
            lineID: Random.id(),
            item: '',
            description: '',
            quantity: '',
            unitPrice: 0,
            taxRate: '',
            taxCode: '',
            TotalAmt: 0,
            curTotalAmt: 0,
            TaxTotal: 0,
            TaxRate: 0,

        };

        var dataListTable = [
            ' ' || '',
            ' ' || '',
            0 || 0,
            0.00 || 0.00,
            ' ' || '',
            0.00 || 0.00,
            '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
        ];
        lineItemsTable.push(dataListTable);
        lineItems.push(lineItemObj);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        let invoicerecord = {
            id: '',
            lid: 'Refund',
            socustomer: '',
            salesOrderto: '',
            shipto: '',
            department: '',
            docnumber: '',
            custPONumber: '',
            saledate: begunDate,
            duedate: '',
            employeename: '',
            status: '',
            category: '',
            comments: '',
            pickmemo: '',
            ponumber: '',
            via: '',
            connote: '',
            reference: '',
            currency: '',
            branding: '',
            invoiceToDesc: '',
            shipToDesc: '',
            termsName: '',
            Total: Currency + '' + 0.00,
            TotalDiscount: Currency + '' + 0.00,
            LineItems: lineItems,
            TotalTax: Currency + '' + 0.00,
            SubTotal: Currency + '' + 0.00,
            balanceDue: Currency + '' + 0.00,
            saleCustField1: '',
            saleCustField2: '',
            totalPaid: Currency + '' + 0.00,
            ispaid: false
        };

        $('#edtCustomerName').val('');
        let getPaymentMethodVal = Session.get('paymentmethod') || 'Cash';

        setTimeout(function() {
            $('#sltDept').val(defaultDept);
            $('#sltPaymentMethod').val(getPaymentMethodVal);
            $('#sltTerms').val(templateObject.defaultsaleterm.get());

        }, 200);

        templateObject.invoicerecord.set(invoicerecord);
        if (templateObject.invoicerecord.get()) {

            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblInvoiceLine', function(error, result) {
                if (error) {


                } else {
                    if (result) {
                        for (let i = 0; i < result.customFields.length; i++) {
                            let customcolumn = result.customFields;
                            let columData = customcolumn[i].label;
                            let columHeaderUpdate = customcolumn[i].thclass;
                            let hiddenColumn = customcolumn[i].hidden;
                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                            let columnWidth = customcolumn[i].width;

                            $("" + columHeaderUpdate + "").html(columData);
                            if (columnWidth != 0) {
                                $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                            }
                            if (hiddenColumn == true) {
                                $("." + columnClass + "").addClass('hiddenColumn');
                                $("." + columnClass + "").removeClass('showColumn');
                            } else if (hiddenColumn == false) {
                                $("." + columnClass + "").removeClass('hiddenColumn');
                                $("." + columnClass + "").addClass('showColumn');
                            }

                        }
                    }

                }
            });
        }


    }


    templateObject.getDepartments = function() {
        getVS1Data('TDeptClass').then(function(dataObject) {
            if (dataObject.length == 0) {
                salesService.getDepartment().then(function(data) {
                    for (let i in data.tdeptclass) {

                        let deptrecordObj = {
                            department: data.tdeptclass[i].DeptClassName || ' ',
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
                        department: useData[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }

            }
        }).catch(function(err) {
            salesService.getDepartment().then(function(data) {
                for (let i in data.tdeptclass) {

                    let deptrecordObj = {
                        department: data.tdeptclass[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }
            });
        });

    }

    templateObject.getTerms = function() {
        getVS1Data('TTermsVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                salesService.getTermVS1().then(function(data) {
                    for (let i in data.ttermsvs1) {

                        let termrecordObj = {
                            termsname: data.ttermsvs1[i].TermsName || ' ',
                        };

                        if (data.ttermsvs1[i].isSalesdefault == true) {
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
                        termsname: useData[i].TermsName || ' ',
                    };
                    if (useData[i].isSalesdefault == true) {
                        templateObject.defaultsaleterm.set(useData[i].TermsName);
                    }

                    termrecords.push(termrecordObj);
                    templateObject.termrecords.set(termrecords);

                }

            }
        }).catch(function(err) {
            salesService.getTermVS1().then(function(data) {
                for (let i in data.ttermsvs1) {

                    let termrecordObj = {
                        termsname: data.ttermsvs1[i].TermsName || ' ',
                    };

                    if (data.ttermsvs1[i].isSalesdefault == true) {
                        templateObject.defaultsaleterm.set(data.ttermsvs1[i].TermsName);
                    }


                    termrecords.push(termrecordObj);
                    templateObject.termrecords.set(termrecords);

                }
            });
        });

    }
    templateObject.getDepartments();
    templateObject.getTerms();



    let table;
    $(document).ready(function() {
        $('#edtCustomerName').editableSelect();
        $('#sltCurrency').editableSelect();
        $('#sltTerms').editableSelect();
        $('#sltDept').editableSelect();
        $('#sltStatus').editableSelect();
        $('#sltPaymentMethod').editableSelect();
        $('#addRow').on('click', function() {
            var rowData = $('#tblInvoiceLine tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineProductName", rowData).val("");
            $(".lineProductDesc", rowData).text("");
            $(".lineQty", rowData).val("");
            $(".lineUnitPrice", rowData).val("");
            $(".lineTaxRate", rowData).text("");
            $(".lineTaxCode", rowData).text("");
            $(".lineAmt", rowData).text("");
            $(".lineTaxAmount", rowData).text("");
            $(".lineDiscount", rowData).text("");
            $(".lineProductName", rowData).attr("prodid", '');
            rowData.attr('id', tokenid);
            $("#tblInvoiceLine tbody").append(rowData);

            setTimeout(function() {
                $('#' + tokenid + " .lineProductName").trigger('click');
            }, 200);

        });

    });

    /* On clik Inventory Line */
    $(document).on("click", "#tblInventory tbody tr", function(e) {
        $(".colProductName").removeClass('boldtablealertsborder');
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        let customers = templateObject.clientrecords.get();
        let productExtraSell = templateObject.productextrasellrecords.get();

        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblInvoiceLine tbody tr");
        let printrows = $(".invoice_print tbody tr");
        let taxcode1 = "";

        let selectedCust = $('#edtCustomerName').val();
        let getCustDetails = "";
        let lineTaxRate = "";
        let taxRate = ""

        if (selectedCust != "") {
            getCustDetails = customers.filter(customer => {
                return customer.customername == selectedCust
            });

            taxRate = taxcodeList.filter(taxrate => {
                return taxrate.codename == getCustDetails[0].taxCode
            });
            lineTaxRate = taxRate[0].codename
            taxcode1 = getCustDetails[0].taxCode
        } else {
            lineTaxRate = table.find(".taxrate").text();
        }

        if (selectLineID) {
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();
            let lineUnitPrice = table.find(".salePrice").text();
            let lineExtraSellPrice = JSON.parse(table.find(".colExtraSellPrice").text()) || null;
            let getCustomerClientTypeName = $('#edtCustomerUseType').val() || 'Default';
            let getCustomerDiscount = parseFloat($('#edtCustomerUseDiscount').val()) || 0;
            let getCustomerProductDiscount = 0;
            let discountAmount = getCustomerDiscount;
            if (lineExtraSellPrice != null) {
                for (let e = 0; e < lineExtraSellPrice.length; e++) {
                    if (lineExtraSellPrice[e].fields.ClientTypeName === getCustomerClientTypeName) {
                        getCustomerProductDiscount = parseFloat(lineExtraSellPrice[e].fields.QtyPercent1) || 0;
                        if (getCustomerProductDiscount > getCustomerDiscount) {
                            discountAmount = getCustomerProductDiscount;
                        }
                    }

                }
            } else {
                discountAmount = getCustomerDiscount;
            }

            $('#' + selectLineID + " .lineDiscount").text(discountAmount);

            let lineTaxCode = 0;
            let lineAmount = 0;
            let lineTaxAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;

            let subDiscountTotal = 0; // New Discount
            let taxGrandTotalPrint = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == lineTaxRate) {

                        $('#' + selectLineID + " .lineTaxRate").text(taxcodeList[i].coderate);
                    }
                }
            }

            $('#' + selectLineID + " .lineProductName").val(lineProductName);
            $('#' + selectLineID + " .lineProductName").attr("prodid", table.find(".colProuctPOPID").text());
            $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
            $('#' + selectLineID + " .lineOrdered").val(1);
            $('#' + selectLineID + " .lineQty").val(1);
            $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);

            if ($('.printID').attr('id') == undefined || $('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $('#' + selectLineID + " #lineProductName").text(lineProductName);
                $('#' + selectLineID + " #lineProductDesc").text(lineProductDesc);
                $('#' + selectLineID + " #lineOrdered").text(1);
                $('#' + selectLineID + " #lineQty").text(1);
                $('#' + selectLineID + " #lineUnitPrice").text(lineUnitPrice);
            }

            if (lineTaxRate == "NT") {
                lineTaxRate = "E";
                $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);
                if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                }

            } else {
                $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);
                if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                }
            }

            lineAmount = 1 * Number(lineUnitPrice.replace(/[^0-9.-]+/g, "")) || 0;
            $('#' + selectLineID + " .lineAmt").text(utilityService.modifynegativeCurrencyFormat(lineAmount));
            if ($('.printID').attr('id') == undefined || $('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $('#' + selectLineID + " #lineAmt").text(utilityService.modifynegativeCurrencyFormat(lineAmount));
            }
            $('#productListModal').modal('toggle');
            let subGrandTotalNet = 0;
            let taxGrandTotalNet = 0;
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".lineUnitPrice").val() || 0;
                var taxRate = $tblrow.find(".lineTaxCode").text();

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                var lineDiscountPerc = parseFloat($tblrow.find(".lineDiscount").text()) || 0; // New Discount
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
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalWithDiscountTotalLine));

                if (!isNaN(subTotal)) {
                    $tblrow.find('.lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ? 0 : subTotalWithDiscountTotalLine;
                    subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
                    taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
                }



                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    let GrandTotalNet = (parseFloat(subGrandTotalNet)) + (parseFloat(taxGrandTotalNet));
                    document.getElementById("subtotal_nett").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });

            //if ($('.printID').attr('id') == undefined || $('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $printrows.each(function(index) {
                var $printrows = $(this);
                var qty = $printrows.find("#lineQty").text() || 0;
                var price = $printrows.find("#lineUnitPrice").text() || "0";
                var taxrateamount = 0;
                var taxRate = $printrows.find("#lineTaxCode").text();
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                if (!isNaN(subTotal)) {
                    $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("totalTax_totalPrint").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
                }
                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                    //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                }
            });
            //}

        }
    });

    /* On Click TaxCode List */
    $(document).on("click", "#tblTaxRate tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblInvoiceLine tbody tr");

        if (selectLineID) {
            let lineTaxCode = table.find(".taxName").text();
            let lineTaxRate = table.find(".taxRate").text();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let subDiscountTotal = 0; // New Discount
            let taxGrandTotalPrint = 0;

            $('#' + selectLineID + " .lineTaxRate").text(lineTaxRate || 0);
            $('#' + selectLineID + " .lineTaxCode").text(lineTaxCode);
            if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $('#' + selectLineID + " #lineTaxCode").text(lineTaxCode);
            }

            $('#taxRateListModal').modal('toggle');
            let subGrandTotalNet = 0;
            let taxGrandTotalNet = 0;
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".lineUnitPrice").val() || 0;
                var taxRate = $tblrow.find(".lineTaxCode").text();

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                var lineDiscountPerc = parseFloat($tblrow.find(".lineDiscount").text()) || 0; // New Discount
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
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalWithDiscountTotalLine));

                if (!isNaN(subTotal)) {
                    $tblrow.find('.lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ? 0 : subTotalWithDiscountTotalLine;
                    subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
                    taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
                }



                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    let GrandTotalNet = (parseFloat(subGrandTotalNet)) + (parseFloat(taxGrandTotalNet));
                    document.getElementById("subtotal_nett").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });

            //if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $printrows.each(function(index) {
                var $printrows = $(this);
                var qty = $printrows.find("#lineQty").text() || 0;
                var price = $printrows.find("#lineUnitPrice").text() || "0";
                var taxrateamount = 0;
                var taxRate = $printrows.find("#lineTaxCode").text();
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }
                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                if (!isNaN(subTotal)) {
                    $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("totalTax_totalPrint").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
                }
                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                    document.getElementById("totalTax").innerHTML = $('#subtotal_tax').text();
                    //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                }
            });
            //}

        }
    });

    $(document).on("click", "#tblCurrencyPopList tbody tr", function(e) {
        $('#sltCurrency').val($(this).find(".colCode").text());
        $('#currencyModal').modal('toggle');
    });

    $(document).on("click", "#departmentList tbody tr", function(e) {
        $('#sltDept').val($(this).find(".colDeptName").text());
        $('#departmentModal').modal('toggle');
    });

    $(document).on("click", "#termsList tbody tr", function(e) {
        $('#sltTerms').val($(this).find(".colTermName").text());
        $('#termsListModal').modal('toggle');
    });

    $(document).on("click", "#tblStatusPopList tbody tr", function(e) {
        $('#sltStatus').val($(this).find(".colStatusName").text());
        $('#statusPopModal').modal('toggle');
    });
    /* On click Customer List */
    $(document).on("click", "#tblCustomerlist tbody tr", function(e) {
        let taxcodeList = templateObject.taxraterecords.get();
        let customers = templateObject.clientrecords.get();
        let $tblrows = $("#tblInvoiceLine tbody tr");
        let $printrows = $(".invoice_print tbody tr");
        var tableCustomer = $(this);
        $('#edtCustomerName').val(tableCustomer.find(".colCompany").text());
        $('#edtCustomerName').attr("custid", tableCustomer.find(".colID").text());
        $('#customerListModal').modal('toggle');

        // $('#customerType').text(tableCustomer.find(".colCustomerType").text()||'Default');
        // $('#customerDiscount').text(tableCustomer.find(".colCustomerDiscount").text()+'%'|| 0+'%');
        // $('#edtCustomerUseType').val(tableCustomer.find(".colCustomerType").text()||'Default');
        // $('#edtCustomerUseDiscount').val(tableCustomer.find(".colCustomerDiscount").text()||0);

        $('#edtCustomerEmail').val(tableCustomer.find(".colEmail").text());
        $('#edtCustomerEmail').attr('customerid', tableCustomer.find(".colID").text());
        $('#edtCustomerName').attr('custid', tableCustomer.find(".colID").text());
        $('#edtCustomerEmail').attr('customerfirstname', tableCustomer.find(".colCustomerFirstName").text());
        $('#edtCustomerEmail').attr('customerlastname', tableCustomer.find(".colCustomerLastName").text());
        $('#customerType').text(tableCustomer.find(".colCustomerType").text() || 'Default');
        $('#customerDiscount').text(tableCustomer.find(".colCustomerDiscount").text() + '%' || 0 + '%');
        $('#edtCustomerUseType').val(tableCustomer.find(".colCustomerType").text() || 'Default');
        $('#edtCustomerUseDiscount').val(tableCustomer.find(".colCustomerDiscount").text() || 0);
        let postalAddress = tableCustomer.find(".colCompany").text() + '\n' + tableCustomer.find(".colStreetAddress").text() + '\n' + tableCustomer.find(".colCity").text() + ' ' + tableCustomer.find(".colState").text() + ' ' + tableCustomer.find(".colZipCode").text() + '\n' + tableCustomer.find(".colCountry").text();
        $('#txabillingAddress').val(postalAddress);
        $('#pdfCustomerAddress').html(postalAddress);
        $('.pdfCustomerAddress').text(postalAddress);
        $('#txaShipingInfo').val(postalAddress);
        $('#sltTerms').val(tableCustomer.find(".colCustomerTermName").text() || '');

        //if (li.text() != undefined) {
        let selectedCustomer = $('#edtCustomerName').val();
        if (clientList) {
            for (var i = 0; i < clientList.length; i++) {
                if (clientList[i].customername == selectedCustomer) {
                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                    $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                    $('#edtCustomerName').attr('custid', clientList[i].customerid);
                    $('#edtCustomerEmail').attr('customerfirstname', clientList[i].firstname);
                    $('#edtCustomerEmail').attr('customerlastname', clientList[i].lastname);
                    $('#customerType').text(clientList[i].clienttypename || 'Default');
                    $('#customerDiscount').text(clientList[i].discount + '%' || 0 + '%');
                    $('#edtCustomerUseType').val(clientList[i].clienttypename || 'Default');
                    $('#edtCustomerUseDiscount').val(clientList[i].discount || 0);
                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + ' ' + clientList[i].statecode + '\n' + clientList[i].country;
                    $('#txabillingAddress').val(postalAddress);
                    $('#pdfCustomerAddress').html(postalAddress);
                    $('.pdfCustomerAddress').text(postalAddress);
                    $('#txaShipingInfo').val(postalAddress);
                    $('#sltTerms').val(clientList[i].termsName || '');
                }
            }
        }

        let getCustDetails = "";
        let taxRate = "";
        if (selectedCustomer != "") {
            getCustDetails = customers.filter(customer => {
                return customer.customername == selectedCustomer
            });
            if (getCustDetails.length > 0) {
                taxRate = taxcodeList.filter(taxrate => {
                    return taxrate.codename == getCustDetails[0].taxCode
                });

                if (taxRate.length > 0) {
                    let rate = taxRate[0].coderate;
                    let code = getCustDetails[0].taxCode;
                    if (code == "NT") {
                        code = "E";
                    }
                    let taxcodeList = templateObject.taxraterecords.get();

                    let lineAmount = 0;
                    let subGrandTotal = 0;
                    let taxGrandTotal = 0;
                    let subDiscountTotal = 0; // New Discount
                    let taxGrandTotalPrint = 0;
                    let subGrandTotalNet = 0;
                    let taxGrandTotalNet = 0;
                    $tblrows.each(function(index) {
                        var $tblrow = $(this);
                        var qty = $tblrow.find(".lineQty").val() || 0;
                        var price = $tblrow.find(".lineUnitPrice").val() || 0;
                        var taxRate = $tblrow.find(".lineTaxCode").text();
                        if ($tblrow.find(".lineProductName").val() == '') {
                            $tblrow.find(".colProductName").addClass('boldtablealertsborder');
                        }
                        var taxrateamount = 0;
                        if (taxcodeList) {
                            for (var i = 0; i < taxcodeList.length; i++) {
                                if (taxcodeList[i].codename == taxRate) {
                                    taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                                }
                            }
                        }

                        var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                        var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                        var lineDiscountPerc = parseFloat($tblrow.find(".lineDiscount").text()) || 0; // New Discount
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
                        $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalWithDiscountTotalLine));

                        if (!isNaN(subTotal)) {
                            $tblrow.find('.lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                            subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ? 0 : subTotalWithDiscountTotalLine;
                            subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
                            document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
                        }

                        if (!isNaN(taxTotal)) {
                            taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
                            taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
                            document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
                        }



                        if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                            let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                            let GrandTotalNet = (parseFloat(subGrandTotalNet)) + (parseFloat(taxGrandTotalNet));
                            document.getElementById("subtotal_nett").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
                            document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                            document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                            document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                        }
                    });

                    //if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $printrows.each(function(index) {
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
                                    taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                                }
                            }
                        }

                        var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                        var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                        $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                        if (!isNaN(subTotal)) {
                            $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                            subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                            document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                        }

                        if (!isNaN(taxTotal)) {
                            taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                            document.getElementById("totalTax_totalPrint").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalPrint);
                        }
                        if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                            let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                            document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                            //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                            document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                        }
                    });
                    //}

                }
            }
        }
        $('#tblCustomerlist_filter .form-control-sm').val('');
        setTimeout(function() {
            //$('#tblCustomerlist_filter .form-control-sm').focus();
            $('.btnRefreshCustomer').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
        // }
    });

    $('#sltTerms').editableSelect()
        .on('click.editable-select', function(e, li) {

            var $earch = $(this);
            var offset = $earch.offset();
            var termsDataName = e.target.value || '';
            $('#edtTermsID').val('');
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#termsListModal').modal('toggle');
            } else {
                if (termsDataName.replace(/\s/g, '') != '') {
                    $('#termModalHeader').text('Edit Terms');
                    getVS1Data('TTermsVS1').then(function(dataObject) { //edit to test indexdb
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getTermsVS1().then(function(data) {
                                for (let i in data.ttermsvs1) {
                                    if (data.ttermsvs1[i].TermsName === termsDataName) {
                                        $('#edtTermsID').val(data.ttermsvs1[i].Id);
                                        $('#edtDays').val(data.ttermsvs1[i].Days);
                                        $('#edtName').val(data.ttermsvs1[i].TermsName);
                                        $('#edtDesc').val(data.ttermsvs1[i].Description);
                                        if (data.ttermsvs1[i].IsEOM === true) {
                                            $('#isEOM').prop('checked', true);
                                        } else {
                                            $('#isEOM').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].IsEOMPlus === true) {
                                            $('#isEOMPlus').prop('checked', true);
                                        } else {
                                            $('#isEOMPlus').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].isSalesdefault === true) {
                                            $('#chkCustomerDef').prop('checked', true);
                                        } else {
                                            $('#chkCustomerDef').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].isPurchasedefault === true) {
                                            $('#chkSupplierDef').prop('checked', true);
                                        } else {
                                            $('#chkSupplierDef').prop('checked', false);
                                        }
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newTermsModal').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.ttermsvs1;
                            for (let i in useData) {
                                if (useData[i].TermsName === termsDataName) {
                                    $('#edtTermsID').val(useData[i].Id);
                                    $('#edtDays').val(useData[i].Days);
                                    $('#edtName').val(useData[i].TermsName);
                                    $('#edtDesc').val(useData[i].Description);
                                    if (useData[i].IsEOM === true) {
                                        $('#isEOM').prop('checked', true);
                                    } else {
                                        $('#isEOM').prop('checked', false);
                                    }
                                    if (useData[i].IsEOMPlus === true) {
                                        $('#isEOMPlus').prop('checked', true);
                                    } else {
                                        $('#isEOMPlus').prop('checked', false);
                                    }
                                    if (useData[i].isSalesdefault === true) {
                                        $('#chkCustomerDef').prop('checked', true);
                                    } else {
                                        $('#chkCustomerDef').prop('checked', false);
                                    }
                                    if (useData[i].isPurchasedefault === true) {
                                        $('#chkSupplierDef').prop('checked', true);
                                    } else {
                                        $('#chkSupplierDef').prop('checked', false);
                                    }
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newTermsModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getTermsVS1().then(function(data) {
                            for (let i in data.ttermsvs1) {
                                if (data.ttermsvs1[i].TermsName === termsDataName) {
                                    $('#edtTermsID').val(data.ttermsvs1[i].Id);
                                    $('#edtDays').val(data.ttermsvs1[i].Days);
                                    $('#edtName').val(data.ttermsvs1[i].TermsName);
                                    $('#edtDesc').val(data.ttermsvs1[i].Description);
                                    if (data.ttermsvs1[i].IsEOM === true) {
                                        $('#isEOM').prop('checked', true);
                                    } else {
                                        $('#isEOM').prop('checked', false);
                                    }
                                    if (data.ttermsvs1[i].IsEOMPlus === true) {
                                        $('#isEOMPlus').prop('checked', true);
                                    } else {
                                        $('#isEOMPlus').prop('checked', false);
                                    }
                                    if (data.ttermsvs1[i].isSalesdefault === true) {
                                        $('#chkCustomerDef').prop('checked', true);
                                    } else {
                                        $('#chkCustomerDef').prop('checked', false);
                                    }
                                    if (data.ttermsvs1[i].isPurchasedefault === true) {
                                        $('#chkSupplierDef').prop('checked', true);
                                    } else {
                                        $('#chkSupplierDef').prop('checked', false);
                                    }
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newTermsModal').modal('toggle');
                            }, 200);
                        });
                    });
                } else {
                    $('#termsListModal').modal();
                    setTimeout(function() {
                        $('#termsList_filter .form-control-sm').focus();
                        $('#termsList_filter .form-control-sm').val('');
                        $('#termsList_filter .form-control-sm').trigger("input");
                        var datatable = $('#termsList').DataTable();
                        datatable.draw();
                        $('#termsList_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }
        });

    $('#sltDept').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var deptDataName = e.target.value || '';
            $('#edtDepartmentID').val('');
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#departmentModal').modal('toggle');
            } else {
                if (deptDataName.replace(/\s/g, '') != '') {
                    $('#newDeptHeader').text('Edit Department');

                    getVS1Data('TDeptClass').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getDepartment().then(function(data) {
                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                    if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                        $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                        $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                        $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                        $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newDepartmentModal').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tdeptclass;
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                    $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                    $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                    $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getDepartment().then(function(data) {
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                    $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                    $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                    $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        });
                    });
                } else {
                    $('#departmentModal').modal();
                    setTimeout(function() {
                        $('#departmentList_filter .form-control-sm').focus();
                        $('#departmentList_filter .form-control-sm').val('');
                        $('#departmentList_filter .form-control-sm').trigger("input");
                        var datatable = $('#departmentList').DataTable();
                        datatable.draw();
                        $('#departmentList_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }
        });

    $('#sltStatus').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            $('#statusId').val('');
            var statusDataName = e.target.value || '';
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#statusPopModal').modal('toggle');
            } else {
                if (statusDataName.replace(/\s/g, '') != '') {
                    $('#newStatusHeader').text('Edit Status');
                    $('#newStatus').val(statusDataName);

                    getVS1Data('TLeadStatusType').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getAllLeadStatus().then(function(data) {
                                for (let i in data.tleadstatustype) {
                                    if (data.tleadstatustype[i].TypeName === statusDataName) {
                                        $('#statusId').val(data.tleadstatustype[i].Id);
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newStatusPopModal').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tleadstatustype;
                            for (let i in useData) {
                                if (useData[i].TypeName === statusDataName) {
                                    $('#statusId').val(useData[i].Id);

                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newStatusPopModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getAllLeadStatus().then(function(data) {
                            for (let i in data.tleadstatustype) {
                                if (data.tleadstatustype[i].TypeName === statusDataName) {
                                    $('#statusId').val(data.tleadstatustype[i].Id);

                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newStatusPopModal').modal('toggle');
                            }, 200);
                        });
                    });
                    setTimeout(function() {
                        $('.fullScreenSpin').css('display', 'none');
                        $('#newStatusPopModal').modal('toggle');
                    }, 200);

                } else {
                    $('#statusPopModal').modal();
                    setTimeout(function() {
                        $('#tblStatusPopList_filter .form-control-sm').focus();
                        $('#tblStatusPopList_filter .form-control-sm').val('');
                        $('#tblStatusPopList_filter .form-control-sm').trigger("input");
                        var datatable = $('#tblStatusPopList').DataTable();

                        datatable.draw();
                        $('#tblStatusPopList_filter .form-control-sm').trigger("input");

                    }, 500);
                }
            }
        });

    $('#sltCurrency').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var currencyDataName = e.target.value || '';
            $('#edtCurrencyID').val('');
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#currencyModal').modal('toggle');
            } else {
                if (currencyDataName.replace(/\s/g, '') != '') {
                    $('#add-currency-title').text('Edit Currency');
                    $('#sedtCountry').prop('readonly', true);
                    getVS1Data('TCurrency').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getCurrencies().then(function(data) {
                                for (let i in data.tcurrency) {
                                    if (data.tcurrency[i].Code === currencyDataName) {
                                        $('#edtCurrencyID').val(data.tcurrency[i].Id);
                                        setTimeout(function() {
                                            $('#sedtCountry').val(data.tcurrency[i].Country);
                                        }, 200);
                                        //$('#sedtCountry').val(data.tcurrency[i].Country);
                                        $('#currencyCode').val(currencyDataName);
                                        $('#currencySymbol').val(data.tcurrency[i].CurrencySymbol);
                                        $('#edtCurrencyName').val(data.tcurrency[i].Currency);
                                        $('#edtCurrencyDesc').val(data.tcurrency[i].CurrencyDesc);
                                        $('#edtBuyRate').val(data.tcurrency[i].BuyRate);
                                        $('#edtSellRate').val(data.tcurrency[i].SellRate);
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newCurrencyModal').modal('toggle');
                                    $('#sedtCountry').attr('readonly', true);
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tcurrency;
                            for (let i = 0; i < data.tcurrency.length; i++) {
                                if (data.tcurrency[i].Code === currencyDataName) {
                                    $('#edtCurrencyID').val(data.tcurrency[i].Id);
                                    $('#sedtCountry').val(data.tcurrency[i].Country);
                                    $('#currencyCode').val(currencyDataName);
                                    $('#currencySymbol').val(data.tcurrency[i].CurrencySymbol);
                                    $('#edtCurrencyName').val(data.tcurrency[i].Currency);
                                    $('#edtCurrencyDesc').val(data.tcurrency[i].CurrencyDesc);
                                    $('#edtBuyRate').val(data.tcurrency[i].BuyRate);
                                    $('#edtSellRate').val(data.tcurrency[i].SellRate);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newCurrencyModal').modal('toggle');
                            }, 200);
                        }

                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getCurrencies().then(function(data) {
                            for (let i in data.tcurrency) {
                                if (data.tcurrency[i].Code === currencyDataName) {
                                    $('#edtCurrencyID').val(data.tcurrency[i].Id);
                                    setTimeout(function() {
                                        $('#sedtCountry').val(data.tcurrency[i].Country);
                                    }, 200);
                                    //$('#sedtCountry').val(data.tcurrency[i].Country);
                                    $('#currencyCode').val(currencyDataName);
                                    $('#currencySymbol').val(data.tcurrency[i].CurrencySymbol);
                                    $('#edtCurrencyName').val(data.tcurrency[i].Currency);
                                    $('#edtCurrencyDesc').val(data.tcurrency[i].CurrencyDesc);
                                    $('#edtBuyRate').val(data.tcurrency[i].BuyRate);
                                    $('#edtSellRate').val(data.tcurrency[i].SellRate);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newCurrencyModal').modal('toggle');
                                $('#sedtCountry').attr('readonly', true);
                            }, 200);
                        });
                    });

                } else {
                    $('#currencyModal').modal();
                    setTimeout(function() {
                        $('#tblCurrencyPopList_filter .form-control-sm').focus();
                        $('#tblCurrencyPopList_filter .form-control-sm').val('');
                        $('#tblCurrencyPopList_filter .form-control-sm').trigger("input");
                        var datatable = $('#tblCurrencyPopList').DataTable();
                        datatable.draw();
                        $('#tblCurrencyPopList_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }
        });

    $('#edtCustomerName').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            $('#edtCustomerPOPID').val('');
            var customerDataName = e.target.value || '';
            var customerDataID = $('#edtCustomerName').attr('custid').replace(/\s/g, '') || '';
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#customerListModal').modal();
                setTimeout(function() {
                    $('#tblCustomerlist_filter .form-control-sm').focus();
                    $('#tblCustomerlist_filter .form-control-sm').val('');
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblCustomerlist').DataTable();
                    //datatable.clear();
                    //datatable.rows.add(splashArrayCustomerList);
                    datatable.draw();
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                    //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
                }, 500);
            } else {
                if (customerDataName.replace(/\s/g, '') != '') {
                    //FlowRouter.go('/customerscard?name=' + e.target.value);
                    $('#edtCustomerPOPID').val('');
                    getVS1Data('TCustomerVS1').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                $('#add-customer-title').text('Edit Customer');
                                let popCustomerID = data.tcustomer[0].fields.ID || '';
                                let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                                let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                                let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                                let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                                let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                                let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                                let popCustomertfn = '' || '';
                                let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                                let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                                let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                                let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                                let popCustomerURL = data.tcustomer[0].fields.URL || '';
                                let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                                let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                                let popCustomerState = data.tcustomer[0].fields.State || '';
                                let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                                let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                                let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                                let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                                let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                                let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                                let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                                let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                                let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                                let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                                let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                                let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                                let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                                let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                                let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                                let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                                let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                                let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                                let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                                let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                                let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                                let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                                $('#edtCustomerCompany').val(popCustomerName);
                                $('#edtCustomerPOPID').val(popCustomerID);
                                $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                $('#edtTitle').val(popCustomerTitle);
                                $('#edtFirstName').val(popCustomerFirstName);
                                $('#edtMiddleName').val(popCustomerMiddleName);
                                $('#edtLastName').val(popCustomerLastName);
                                $('#edtCustomerPhone').val(popCustomerPhone);
                                $('#edtCustomerMobile').val(popCustomerMobile);
                                $('#edtCustomerFax').val(popCustomerFaxnumber);
                                $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                $('#edtCustomerWebsite').val(popCustomerURL);
                                $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                $('#edtCustomerShippingState').val(popCustomerState);
                                $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                $('#sedtCountry').val(popCustomerCountry);
                                $('#txaNotes').val(popCustomernotes);
                                $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                $('#sltTermsPOP').val(popCustomerterms);
                                $('#sltCustomerType').val(popCustomerType);
                                $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                $('#edtCustomeField1').val(popCustomercustfield1);
                                $('#edtCustomeField2').val(popCustomercustfield2);
                                $('#edtCustomeField3').val(popCustomercustfield3);
                                $('#edtCustomeField4').val(popCustomercustfield4);

                                $('#sltTaxCode').val(popCustomerTaxCode);

                                if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                    (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                    (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                    $('#chkSameAsShipping2').attr("checked", "checked");
                                }

                                if (data.tcustomer[0].fields.IsSupplier == true) {
                                    // $('#isformcontractor')
                                    $('#chkSameAsSupplier').attr("checked", "checked");
                                } else {
                                    $('#chkSameAsSupplier').removeAttr("checked");
                                }

                                setTimeout(function() {
                                    $('#addCustomerModal').modal('show');
                                }, 200);
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tcustomervs1;

                            var added = false;
                            for (let i = 0; i < data.tcustomervs1.length; i++) {
                                if (data.tcustomervs1[i].fields.ClientName === customerDataName) {
                                    let lineItems = [];
                                    added = true;
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#add-customer-title').text('Edit Customer');
                                    let popCustomerID = data.tcustomervs1[i].fields.ID || '';
                                    let popCustomerName = data.tcustomervs1[i].fields.ClientName || '';
                                    let popCustomerEmail = data.tcustomervs1[i].fields.Email || '';
                                    let popCustomerTitle = data.tcustomervs1[i].fields.Title || '';
                                    let popCustomerFirstName = data.tcustomervs1[i].fields.FirstName || '';
                                    let popCustomerMiddleName = data.tcustomervs1[i].fields.CUSTFLD10 || '';
                                    let popCustomerLastName = data.tcustomervs1[i].fields.LastName || '';
                                    let popCustomertfn = '' || '';
                                    let popCustomerPhone = data.tcustomervs1[i].fields.Phone || '';
                                    let popCustomerMobile = data.tcustomervs1[i].fields.Mobile || '';
                                    let popCustomerFaxnumber = data.tcustomervs1[i].fields.Faxnumber || '';
                                    let popCustomerSkypeName = data.tcustomervs1[i].fields.SkypeName || '';
                                    let popCustomerURL = data.tcustomervs1[i].fields.URL || '';
                                    let popCustomerStreet = data.tcustomervs1[i].fields.Street || '';
                                    let popCustomerStreet2 = data.tcustomervs1[i].fields.Street2 || '';
                                    let popCustomerState = data.tcustomervs1[i].fields.State || '';
                                    let popCustomerPostcode = data.tcustomervs1[i].fields.Postcode || '';
                                    let popCustomerCountry = data.tcustomervs1[i].fields.Country || LoggedCountry;
                                    let popCustomerbillingaddress = data.tcustomervs1[i].fields.BillStreet || '';
                                    let popCustomerbcity = data.tcustomervs1[i].fields.BillStreet2 || '';
                                    let popCustomerbstate = data.tcustomervs1[i].fields.BillState || '';
                                    let popCustomerbpostalcode = data.tcustomervs1[i].fields.BillPostcode || '';
                                    let popCustomerbcountry = data.tcustomervs1[i].fields.Billcountry || LoggedCountry;
                                    let popCustomercustfield1 = data.tcustomervs1[i].fields.CUSTFLD1 || '';
                                    let popCustomercustfield2 = data.tcustomervs1[i].fields.CUSTFLD2 || '';
                                    let popCustomercustfield3 = data.tcustomervs1[i].fields.CUSTFLD3 || '';
                                    let popCustomercustfield4 = data.tcustomervs1[i].fields.CUSTFLD4 || '';
                                    let popCustomernotes = data.tcustomervs1[i].fields.Notes || '';
                                    let popCustomerpreferedpayment = data.tcustomervs1[i].fields.PaymentMethodName || '';
                                    let popCustomerterms = data.tcustomervs1[i].fields.TermsName || '';
                                    let popCustomerdeliverymethod = data.tcustomervs1[i].fields.ShippingMethodName || '';
                                    let popCustomeraccountnumber = data.tcustomervs1[i].fields.ClientNo || '';
                                    let popCustomerisContractor = data.tcustomervs1[i].fields.Contractor || false;
                                    let popCustomerissupplier = data.tcustomervs1[i].fields.IsSupplier || false;
                                    let popCustomeriscustomer = data.tcustomervs1[i].fields.IsCustomer || false;
                                    let popCustomerTaxCode = data.tcustomervs1[i].fields.TaxCodeName || '';
                                    let popCustomerDiscount = data.tcustomervs1[i].fields.Discount || 0;
                                    let popCustomerType = data.tcustomervs1[i].fields.ClientTypeName || '';
                                    $('#edtCustomerCompany').val(popCustomerName);
                                    $('#edtCustomerPOPID').val(popCustomerID);
                                    $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                    $('#edtTitle').val(popCustomerTitle);
                                    $('#edtFirstName').val(popCustomerFirstName);
                                    $('#edtMiddleName').val(popCustomerMiddleName);
                                    $('#edtLastName').val(popCustomerLastName);
                                    $('#edtCustomerPhone').val(popCustomerPhone);
                                    $('#edtCustomerMobile').val(popCustomerMobile);
                                    $('#edtCustomerFax').val(popCustomerFaxnumber);
                                    $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                    $('#edtCustomerWebsite').val(popCustomerURL);
                                    $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                    $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                    $('#edtCustomerShippingState').val(popCustomerState);
                                    $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                    $('#sedtCountry').val(popCustomerCountry);
                                    $('#txaNotes').val(popCustomernotes);
                                    $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                    $('#sltTermsPOP').val(popCustomerterms);
                                    $('#sltCustomerType').val(popCustomerType);
                                    $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                    $('#edtCustomeField1').val(popCustomercustfield1);
                                    $('#edtCustomeField2').val(popCustomercustfield2);
                                    $('#edtCustomeField3').val(popCustomercustfield3);
                                    $('#edtCustomeField4').val(popCustomercustfield4);

                                    $('#sltTaxCode').val(popCustomerTaxCode);

                                    if ((data.tcustomervs1[i].fields.Street == data.tcustomervs1[i].fields.BillStreet) && (data.tcustomervs1[i].fields.Street2 == data.tcustomervs1[i].fields.BillStreet2) &&
                                        (data.tcustomervs1[i].fields.State == data.tcustomervs1[i].fields.BillState) && (data.tcustomervs1[i].fields.Postcode == data.tcustomervs1[i].fields.BillPostcode) &&
                                        (data.tcustomervs1[i].fields.Country == data.tcustomervs1[i].fields.Billcountry)) {
                                        $('#chkSameAsShipping2').attr("checked", "checked");
                                    }

                                    if (data.tcustomervs1[i].fields.IsSupplier == true) {
                                        // $('#isformcontractor')
                                        $('#chkSameAsSupplier').attr("checked", "checked");
                                    } else {
                                        $('#chkSameAsSupplier').removeAttr("checked");
                                    }

                                    setTimeout(function() {
                                        $('#addCustomerModal').modal('show');
                                    }, 200);

                                }
                            }
                            if (!added) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                                    $('.fullScreenSpin').css('display', 'none');
                                    let lineItems = [];
                                    $('#add-customer-title').text('Edit Customer');
                                    let popCustomerID = data.tcustomer[0].fields.ID || '';
                                    let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                                    let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                                    let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                                    let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                                    let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                                    let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                                    let popCustomertfn = '' || '';
                                    let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                                    let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                                    let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                                    let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                                    let popCustomerURL = data.tcustomer[0].fields.URL || '';
                                    let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                                    let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                                    let popCustomerState = data.tcustomer[0].fields.State || '';
                                    let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                                    let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                                    let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                                    let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                                    let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                                    let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                                    let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                                    let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                                    let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                                    let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                                    let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                                    let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                                    let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                                    let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                                    let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                                    let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                                    let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                                    let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                                    let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                                    let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                                    let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                                    let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                                    $('#edtCustomerCompany').val(popCustomerName);
                                    $('#edtCustomerPOPID').val(popCustomerID);
                                    $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                    $('#edtTitle').val(popCustomerTitle);
                                    $('#edtFirstName').val(popCustomerFirstName);
                                    $('#edtMiddleName').val(popCustomerMiddleName);
                                    $('#edtLastName').val(popCustomerLastName);
                                    $('#edtCustomerPhone').val(popCustomerPhone);
                                    $('#edtCustomerMobile').val(popCustomerMobile);
                                    $('#edtCustomerFax').val(popCustomerFaxnumber);
                                    $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                    $('#edtCustomerWebsite').val(popCustomerURL);
                                    $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                    $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                    $('#edtCustomerShippingState').val(popCustomerState);
                                    $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                    $('#sedtCountry').val(popCustomerCountry);
                                    $('#txaNotes').val(popCustomernotes);
                                    $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                    $('#sltTermsPOP').val(popCustomerterms);
                                    $('#sltCustomerType').val(popCustomerType);
                                    $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                    $('#edtCustomeField1').val(popCustomercustfield1);
                                    $('#edtCustomeField2').val(popCustomercustfield2);
                                    $('#edtCustomeField3').val(popCustomercustfield3);
                                    $('#edtCustomeField4').val(popCustomercustfield4);

                                    $('#sltTaxCode').val(popCustomerTaxCode);

                                    if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                        (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                        (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                        $('#chkSameAsShipping2').attr("checked", "checked");
                                    }

                                    if (data.tcustomer[0].fields.IsSupplier == true) {
                                        // $('#isformcontractor')
                                        $('#chkSameAsSupplier').attr("checked", "checked");
                                    } else {
                                        $('#chkSameAsSupplier').removeAttr("checked");
                                    }

                                    setTimeout(function() {
                                        $('#addCustomerModal').modal('show');
                                    }, 200);
                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }
                        }
                    }).catch(function(err) {
                        sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            $('#add-customer-title').text('Edit Customer');
                            let popCustomerID = data.tcustomer[0].fields.ID || '';
                            let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                            let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                            let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                            let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                            let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                            let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                            let popCustomertfn = '' || '';
                            let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                            let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                            let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                            let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                            let popCustomerURL = data.tcustomer[0].fields.URL || '';
                            let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                            let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                            let popCustomerState = data.tcustomer[0].fields.State || '';
                            let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                            let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                            let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                            let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                            let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                            let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                            let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                            let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                            let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                            let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                            let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                            let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                            let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                            let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                            let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                            let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                            let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                            let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                            let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                            let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                            let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                            let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                            $('#edtCustomerCompany').val(popCustomerName);
                            $('#edtCustomerPOPID').val(popCustomerID);
                            $('#edtCustomerPOPEmail').val(popCustomerEmail);
                            $('#edtTitle').val(popCustomerTitle);
                            $('#edtFirstName').val(popCustomerFirstName);
                            $('#edtMiddleName').val(popCustomerMiddleName);
                            $('#edtLastName').val(popCustomerLastName);
                            $('#edtCustomerPhone').val(popCustomerPhone);
                            $('#edtCustomerMobile').val(popCustomerMobile);
                            $('#edtCustomerFax').val(popCustomerFaxnumber);
                            $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                            $('#edtCustomerWebsite').val(popCustomerURL);
                            $('#edtCustomerShippingAddress').val(popCustomerStreet);
                            $('#edtCustomerShippingCity').val(popCustomerStreet2);
                            $('#edtCustomerShippingState').val(popCustomerState);
                            $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                            $('#sedtCountry').val(popCustomerCountry);
                            $('#txaNotes').val(popCustomernotes);
                            $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                            $('#sltTermsPOP').val(popCustomerterms);
                            $('#sltCustomerType').val(popCustomerType);
                            $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                            $('#edtCustomeField1').val(popCustomercustfield1);
                            $('#edtCustomeField2').val(popCustomercustfield2);
                            $('#edtCustomeField3').val(popCustomercustfield3);
                            $('#edtCustomeField4').val(popCustomercustfield4);

                            $('#sltTaxCode').val(popCustomerTaxCode);

                            if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                $('#chkSameAsShipping2').attr("checked", "checked");
                            }

                            if (data.tcustomer[0].fields.IsSupplier == true) {
                                // $('#isformcontractor')
                                $('#chkSameAsSupplier').attr("checked", "checked");
                            } else {
                                $('#chkSameAsSupplier').removeAttr("checked");
                            }

                            setTimeout(function() {
                                $('#addCustomerModal').modal('show');
                            }, 200);
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    });
                } else {
                    $('#customerListModal').modal();
                    setTimeout(function() {
                        $('#tblCustomerlist_filter .form-control-sm').focus();
                        $('#tblCustomerlist_filter .form-control-sm').val('');
                        $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                        var datatable = $('#tblCustomerlist').DataTable();
                        //datatable.clear();
                        //datatable.rows.add(splashArrayCustomerList);
                        datatable.draw();
                        $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                        //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
                    }, 500);
                }
            }


        });

    $(document).on("click", "#paymentmethodList tbody tr", function(e) {
       $('#sltPaymentMethod').val($(this).find(".colName").text());
       $('#paymentMethodModal').modal('toggle');
   });

   $('#sltPaymentMethod').editableSelect()
       .on('click.editable-select', function(e, li) {
           var $earch = $(this);
           var offset = $earch.offset();
           var paymentDataName = e.target.value || '';
           $('#edtPaymentMethodID').val('');
           if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
               $('#paymentMethodModal').modal('toggle');
           } else {
               if (paymentDataName.replace(/\s/g, '') != '') {
                   $('#paymentMethodHeader').text('Edit Payment Method');

                   getVS1Data('TPaymentMethod').then(function(dataObject) {
                       if (dataObject.length == 0) {
                           $('.fullScreenSpin').css('display', 'inline-block');
                           sideBarService.getPaymentMethodDataVS1().then(function(data) {
                               for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                   if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                       $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                       $('#edtName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                       if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                           $('#isformcreditcard').prop('checked', true);
                                       } else {
                                           $('#isformcreditcard').prop('checked', false);
                                       }
                                   }
                               }
                               setTimeout(function() {
                                   $('.fullScreenSpin').css('display', 'none');
                                   $('#newPaymentMethodModal').modal('toggle');
                               }, 200);
                           });
                       } else {
                           let data = JSON.parse(dataObject[0].data);
                           let useData = data.tpaymentmethodvs1;

                           for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                               if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                   $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                   $('#edtName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                   if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                       $('#isformcreditcard').prop('checked', true);
                                   } else {
                                       $('#isformcreditcard').prop('checked', false);
                                   }
                               }
                           }
                           setTimeout(function() {
                               $('.fullScreenSpin').css('display', 'none');
                               $('#newPaymentMethodModal').modal('toggle');
                           }, 200);
                       }
                   }).catch(function(err) {
                       $('.fullScreenSpin').css('display', 'inline-block');
                       sideBarService.getPaymentMethodDataVS1().then(function(data) {
                           for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                               if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                   $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                   $('#edtName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                   if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                       $('#isformcreditcard').prop('checked', true);
                                   } else {
                                       $('#isformcreditcard').prop('checked', false);
                                   }
                               }
                           }
                           setTimeout(function() {
                               $('.fullScreenSpin').css('display', 'none');
                               $('#newPaymentMethodModal').modal('toggle');
                           }, 200);
                       });
                   });
               } else {
                   $('#paymentMethodModal').modal();
                   setTimeout(function() {
                       $('#paymentmethodList_filter .form-control-sm').focus();
                       $('#paymentmethodList_filter .form-control-sm').val('');
                       $('#paymentmethodList_filter .form-control-sm').trigger("input");
                       var datatable = $('#paymentmethodList').DataTable();
                       datatable.draw();
                       $('#paymentmethodList_filter .form-control-sm').trigger("input");
                   }, 500);
               }
           }
       });

    exportSalesToPdf = function() {
        let margins = {
            top: 0,
            bottom: 0,
            left: 0,
            width: 100
        };
        var pdf = new jsPDF('p', 'pt', 'a4');


        pdf.setFontSize(18);
        var source = document.getElementById('html-2-pdfwrapper');
        pdf.addHTML(source, function() {
            pdf.save('invoice.pdf');
            $('#html-2-pdfwrapper').css('display', 'none');
        });

    };
});
Template.refundcard.onRendered(function() {
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let salesService = new SalesBoardService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    const lineExtaSellItems = [];
    tempObj.getAllProducts = function() {
        getVS1Data('TProductVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                productService.getNewProductListVS1().then(function(data) {

                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.tproductvs1.length; i++) {
                        var dataList = [


                            data.tproductvs1[i].ProductName || '-',
                            data.tproductvs1[i].SalesDescription || '',
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].BuyQty1Cost * 100) / 100),
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].SellQty1Price * 100) / 100),
                            data.tproductvs1[i].TotalQtyInStock,
                            data.tproductvs1[i].TaxCodeSales || ''
                        ];

                        splashArrayProductList.push(dataList);
                    }
                    localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                    if (splashArrayProductList) {

                        $('#tblInventory').dataTable({
                            data: splashArrayProductList,

                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [

                                {
                                    className: "productName",
                                    "targets": [0]
                                },
                                {
                                    className: "productDesc",
                                    "targets": [1]
                                },
                                {
                                    className: "costPrice text-right",
                                    "targets": [2]
                                },
                                {
                                    className: "salePrice text-right",
                                    "targets": [3]
                                },
                                {
                                    className: "prdqty text-right",
                                    "targets": [4]
                                },
                                {
                                    className: "taxrate",
                                    "targets": [5]
                                }
                            ],
                            colReorder: true,



                            bStateSave: true,


                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "fnInitComplete": function() {
                                $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventory_filter");
                            }

                        });

                        $('div.dataTables_filter input').addClass('form-control form-control-sm');






                    }
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < useData.length; i++) {
                    var dataList = [


                        useData[i].fields.ProductName || '-',
                        useData[i].fields.SalesDescription || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(useData[i].fields.BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(useData[i].fields.SellQty1Price * 100) / 100),
                        useData[i].fields.TotalQtyInStock,
                        useData[i].fields.TaxCodeSales || ''
                    ];

                    if (useData[i].fields.ExtraSellPrice != null) {
                        for (let e = 0; e < useData[i].fields.ExtraSellPrice.length; e++) {
                            let lineExtaSellObj = {
                                clienttype: useData[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                productname: useData[i].fields.ExtraSellPrice[e].fields.ProductName || useData[i].fields.ProductName,
                                price: utilityService.modifynegativeCurrencyFormat(useData[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                            };
                            lineExtaSellItems.push(lineExtaSellObj);

                        }
                    }

                    splashArrayProductList.push(dataList);
                }
                localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
                tempObj.productextrasellrecords.set(lineExtaSellItems);
                if (splashArrayProductList) {

                    $('#tblInventory').dataTable({
                        data: splashArrayProductList,

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [

                            {
                                className: "productName",
                                "targets": [0]
                            },
                            {
                                className: "productDesc",
                                "targets": [1]
                            },
                            {
                                className: "costPrice text-right",
                                "targets": [2]
                            },
                            {
                                className: "salePrice text-right",
                                "targets": [3]
                            },
                            {
                                className: "prdqty text-right",
                                "targets": [4]
                            },
                            {
                                className: "taxrate",
                                "targets": [5]
                            }
                        ],
                        colReorder: true,



                        bStateSave: true,


                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function() {
                            $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventory_filter");
                        }

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');






                }
            }
        }).catch(function(err) {
            productService.getNewProductListVS1().then(function(data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tproductvs1.length; i++) {
                    var dataList = [


                        data.tproductvs1[i].ProductName || '-',
                        data.tproductvs1[i].SalesDescription || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].SellQty1Price * 100) / 100),
                        data.tproductvs1[i].TotalQtyInStock,
                        data.tproductvs1[i].TaxCodeSales || ''
                    ];

                    splashArrayProductList.push(dataList);
                }
                localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                if (splashArrayProductList) {

                    $('#tblInventory').dataTable({
                        data: splashArrayProductList,

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [

                            {
                                className: "productName",
                                "targets": [0]
                            },
                            {
                                className: "productDesc",
                                "targets": [1]
                            },
                            {
                                className: "costPrice text-right",
                                "targets": [2]
                            },
                            {
                                className: "salePrice text-right",
                                "targets": [3]
                            },
                            {
                                className: "prdqty text-right",
                                "targets": [4]
                            },
                            {
                                className: "taxrate",
                                "targets": [5]
                            }
                        ],
                        colReorder: true,



                        bStateSave: true,


                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function() {
                            $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventory_filter");
                        }

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');






                }
            })
        });
    };

    //tempObj.getAllProducts();



    tempObj.getAllTaxCodes = function() {
        getVS1Data('TTaxcodeVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                salesService.getTaxCodesVS1().then(function(data) {

                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                        var dataList = [
                            data.ttaxcodevs1[i].Id || '',
                            data.ttaxcodevs1[i].CodeName || '',
                            data.ttaxcodevs1[i].Description || '-',
                            taxRate || 0,
                        ];

                        let taxcoderecordObj = {
                            codename: data.ttaxcodevs1[i].CodeName || ' ',
                            coderate: taxRate || ' ',
                        };

                        taxCodesList.push(taxcoderecordObj);

                        splashArrayTaxRateList.push(dataList);
                    }
                    tempObj.taxraterecords.set(taxCodesList);


                    if (splashArrayTaxRateList) {

                        $('#tblTaxRate').DataTable({
                            data: splashArrayTaxRateList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [{
                                    orderable: false,
                                    targets: 0
                                },
                                {
                                    className: "taxName",
                                    "targets": [1]
                                },
                                {
                                    className: "taxDesc",
                                    "targets": [2]
                                },
                                {
                                    className: "taxRate text-right",
                                    "targets": [3]
                                }
                            ],
                            colReorder: true,



                            bStateSave: true,


                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "fnInitComplete": function() {
                                $("<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_filter");
                            }

                        });






                    }
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttaxcodevs1;

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < useData.length; i++) {
                    let taxRate = (useData[i].Rate * 100).toFixed(2);
                    var dataList = [
                        useData[i].Id || '',
                        useData[i].CodeName || '',
                        useData[i].Description || '-',
                        taxRate || 0,
                    ];

                    let taxcoderecordObj = {
                        codename: useData[i].CodeName || ' ',
                        coderate: taxRate || ' ',
                    };

                    taxCodesList.push(taxcoderecordObj);

                    splashArrayTaxRateList.push(dataList);
                }
                tempObj.taxraterecords.set(taxCodesList);


                if (splashArrayTaxRateList) {

                    $('#tblTaxRate').DataTable({
                        data: splashArrayTaxRateList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [{
                                orderable: false,
                                targets: 0
                            },
                            {
                                className: "taxName",
                                "targets": [1]
                            },
                            {
                                className: "taxDesc",
                                "targets": [2]
                            },
                            {
                                className: "taxRate text-right",
                                "targets": [3]
                            }
                        ],
                        colReorder: true,



                        bStateSave: true,


                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function() {
                            $("<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_filter");
                        }

                    });






                }
            }
        }).catch(function(err) {
            salesService.getTaxCodesVS1().then(function(data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                    var dataList = [
                        data.ttaxcodevs1[i].Id || '',
                        data.ttaxcodevs1[i].CodeName || '',
                        data.ttaxcodevs1[i].Description || '-',
                        taxRate || 0,
                    ];

                    let taxcoderecordObj = {
                        codename: data.ttaxcodevs1[i].CodeName || ' ',
                        coderate: taxRate || ' ',
                    };

                    taxCodesList.push(taxcoderecordObj);

                    splashArrayTaxRateList.push(dataList);
                }
                tempObj.taxraterecords.set(taxCodesList);


                if (splashArrayTaxRateList) {

                    $('#tblTaxRate').DataTable({
                        data: splashArrayTaxRateList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [{
                                orderable: false,
                                targets: 0
                            },
                            {
                                className: "taxName",
                                "targets": [1]
                            },
                            {
                                className: "taxDesc",
                                "targets": [2]
                            },
                            {
                                className: "taxRate text-right",
                                "targets": [3]
                            }
                        ],
                        colReorder: true,



                        bStateSave: true,


                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function() {
                            $("<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_filter");
                        }

                    });






                }
            })
        });
    };
    tempObj.getAllTaxCodes();

});
Template.refundcard.helpers({
    invoicerecord: () => {
        return Template.instance().invoicerecord.get();
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    termrecords: () => {
        return Template.instance().termrecords.get().sort(function(a, b) {
            if (a.termsname == 'NA') {
                return 1;
            } else if (b.termsname == 'NA') {
                return -1;
            }
            return (a.termsname.toUpperCase() > b.termsname.toUpperCase()) ? 1 : -1;
        });
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'refundcard'
        });
    },
    salesCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblInvoiceLine'
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
        return Template.instance().statusrecords.get().sort(function(a, b) {
            if (a.orderstatus == 'NA') {
                return 1;
            } else if (b.orderstatus == 'NA') {
                return -1;
            }
            return (a.orderstatus.toUpperCase() > b.orderstatus.toUpperCase()) ? 1 : -1;
        });
    },
    companyaddress1: () => {
        return Session.get('vs1companyaddress1');
    },
    companyaddress2: () => {
        return Session.get('vs1companyaddress2');
    },
    city: () => {
        return Session.get('vs1companyCity');
    },
    state: () => {
        return Session.get('companyState');
    },
    poBox: () => {
        return Session.get('vs1companyPOBox');
    },
    companyphone: () => {
        return Session.get('vs1companyPhone');
    },
    companyabn: () => {
        return Session.get('vs1companyABN');
    },
    organizationname: () => {
        return Session.get('vs1companyName');
    },
    organizationurl: () => {
        return Session.get('vs1companyURL');
    },
    isMobileDevices: () => {
        var isMobile = false;

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    }
});

Template.refundcard.events({
    'click #edtCustomerName': function(event) {
        $('#edtCustomerName').select();
        $('#edtCustomerName').editableSelect();
    },
    'click #sltCurrency': function(event) {
        $('#sltCurrency').select();
        $('#sltCurrency').editableSelect();
    },
    'click #sltTerms': function(event) {
        $('#sltTerms').select();
        $('#sltTerms').editableSelect();
    },
    'click #sltDept': function(event) {
        $('#sltDept').select();
        $('#sltDept').editableSelect();
    },
    'click #sltStatus': function(event) {
        $('#sltStatus').select();
        $('#sltStatus').editableSelect();
    },
    // 'change #sltStatus': function() {
    //     let status = $('#sltStatus').find(":selected").val();
    //     if (status == "newstatus") {
    //         $('#statusModal').modal();
    //     }
    // },
    // 'click .btnSaveStatus': function() {
    //     $('.fullScreenSpin').css('display', 'inline-block');
    //     let clientService = new SalesBoardService()
    //     let status = $('#status').val();
    //     let leadData = {
    //         type: 'TLeadStatusType',
    //         fields: {
    //             TypeName: status,
    //             KeyValue: status
    //         }
    //     }
    //
    //     if (status != "") {
    //         clientService.saveLeadStatus(leadData).then(function(objDetails) {
    //             sideBarService.getAllLeadStatus().then(function(dataUpdate) {
    //                 addVS1Data('TLeadStatusType', JSON.stringify(dataUpdate)).then(function(datareturn) {
    //                     $('.fullScreenSpin').css('display', 'none');
    //                     let id = $('.printID').attr("id");
    //                     window.open("/refundcard");
    //                 }).catch(function(err) {
    //
    //                 });
    //             }).catch(function(err) {
    //
    //                 window.open('/refundcard', '_self');
    //             });
    //         }).catch(function(err) {
    //             $('.fullScreenSpin').css('display', 'none');
    //
    //             swal({
    //                 title: 'Oooops...',
    //                 text: err,
    //                 type: 'error',
    //                 showCancelButton: false,
    //                 confirmButtonText: 'Try Again'
    //             }).then((result) => {
    //                 if (result.value) {
    //
    //                 } else if (result.dismiss === 'cancel') {
    //
    //                 }
    //             });
    //
    //             $('.fullScreenSpin').css('display', 'none');
    //         });
    //     } else {
    //         $('.fullScreenSpin').css('display', 'none');
    //         swal({
    //             title: 'Please Enter Status',
    //             text: "Status field cannot be empty",
    //             type: 'warning',
    //             showCancelButton: false,
    //             confirmButtonText: 'Try Again'
    //         }).then((result) => {
    //             if (result.value) {} else if (result.dismiss === 'cancel') {
    //
    //             }
    //         });
    //     }
    // },
    'blur .lineQty': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let $tblrows = $("#tblInvoiceLine tbody tr");

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let subDiscountTotal = 0; // New Discount
        let taxGrandTotalPrint = 0;

        let subGrandTotalNet = 0;
        let taxGrandTotalNet = 0;
        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".lineUnitPrice").val() || 0;
            var taxRate = $tblrow.find(".lineTaxCode").text();

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxRate) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }

            var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            var lineDiscountPerc = parseFloat($tblrow.find(".lineDiscount").text()) || 0; // New Discount
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
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalWithDiscountTotalLine));

            if (!isNaN(subTotal)) {
                $tblrow.find('.lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ? 0 : subTotalWithDiscountTotalLine;
                subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
                taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
            }



            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                let GrandTotalNet = (parseFloat(subGrandTotalNet)) + (parseFloat(taxGrandTotalNet));
                document.getElementById("subtotal_nett").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
                document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

            }
        });

    },
    'change .lineUnitPrice': function(event) {

        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2
            })));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2
            })));


        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();

        let $tblrows = $("#tblInvoiceLine tbody tr");

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let subDiscountTotal = 0; // New Discount
        let taxGrandTotalPrint = 0;

        let subGrandTotalNet = 0;
        let taxGrandTotalNet = 0;
        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".lineUnitPrice").val() || 0;
            var taxRate = $tblrow.find(".lineTaxCode").text();

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxRate) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }

            var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            var lineDiscountPerc = parseFloat($tblrow.find(".lineDiscount").text()) || 0; // New Discount
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
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalWithDiscountTotalLine));

            if (!isNaN(subTotal)) {
                $tblrow.find('.lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ? 0 : subTotalWithDiscountTotalLine;
                subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
                taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
            }



            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                let GrandTotalNet = (parseFloat(subGrandTotalNet)) + (parseFloat(taxGrandTotalNet));
                document.getElementById("subtotal_nett").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
                document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

            }
        });
    },
    'click #btnCustomFileds': function(event) {
        var x = document.getElementById("divCustomFields");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    'click .lineProductName, keydown .lineProductName': function(event) {
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();

        let customername = $('#edtCustomerName').val();
        $("#selectProductID").val('');
        if (customername === '') {
            swal('Customer has not been selected!', '', 'warning');
            event.preventDefault();
        } else {
            var productDataName = $(event.target).val() || '';
            if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
                $('#productListModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
                setTimeout(function() {
                    $('#tblInventory_filter .form-control-sm').focus();
                    $('#tblInventory_filter .form-control-sm').val('');
                    $('#tblInventory_filter .form-control-sm').trigger("input");

                    var datatable = $('#tblInventory').DataTable();
                    datatable.draw();
                    $('#tblInventory_filter .form-control-sm').trigger("input");

                }, 500);
            } else {
                if (productDataName.replace(/\s/g, '') != '') {
                    //FlowRouter.go('/productview?prodname=' +  $(event.target).text());
                    let lineExtaSellItems = [];
                    let lineExtaSellObj = {};
                    $('.fullScreenSpin').css('display', 'inline-block');
                    getVS1Data('TProductVS1').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let currencySymbol = Currency;
                                let totalquantity = 0;
                                let productname = data.tproduct[0].fields.ProductName || '';
                                let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                                let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                                let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                                let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                                let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                                let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                                let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                                let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                                let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                                let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                                let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                                let active = data.tproduct[0].fields.Active;
                                let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                                let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                                let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                                let barcode = data.tproduct[0].fields.BARCODE || '';
                                $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                                $('#add-product-title').text('Edit Product');
                                $('#edtproductname').val(productname);
                                $('#edtsellqty1price').val(sellqty1price);
                                $('#txasalesdescription').val(salesdescription);
                                $('#sltsalesacount').val(incomeaccount);
                                $('#slttaxcodesales').val(taxcodesales);
                                $('#edtbarcode').val(barcode);
                                $('#txapurchasedescription').val(purchasedescription);
                                $('#sltcogsaccount').val(cogsaccount);
                                $('#slttaxcodepurchase').val(taxcodepurchase);
                                $('#edtbuyqty1cost').val(buyqty1cost);

                                setTimeout(function() {
                                    $('#newProductModal').modal('show');
                                }, 500);
                            }).catch(function(err) {

                                $('.fullScreenSpin').css('display', 'none');
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tproductvs1;
                            var added = false;

                            for (let i = 0; i < data.tproductvs1.length; i++) {
                                if (data.tproductvs1[i].fields.ProductName === productDataName) {
                                    added = true;
                                    $('.fullScreenSpin').css('display', 'none');
                                    let lineItems = [];
                                    let lineItemObj = {};
                                    let currencySymbol = Currency;
                                    let totalquantity = 0;

                                    let productname = data.tproductvs1[i].fields.ProductName || '';
                                    let productcode = data.tproductvs1[i].fields.PRODUCTCODE || '';
                                    let productprintName = data.tproductvs1[i].fields.ProductPrintName || '';
                                    let assetaccount = data.tproductvs1[i].fields.AssetAccount || '';
                                    let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.BuyQty1Cost) || 0;
                                    let cogsaccount = data.tproductvs1[i].fields.CogsAccount || '';
                                    let taxcodepurchase = data.tproductvs1[i].fields.TaxCodePurchase || '';
                                    let purchasedescription = data.tproductvs1[i].fields.PurchaseDescription || '';
                                    let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.SellQty1Price) || 0;
                                    let incomeaccount = data.tproductvs1[i].fields.IncomeAccount || '';
                                    let taxcodesales = data.tproductvs1[i].fields.TaxCodeSales || '';
                                    let salesdescription = data.tproductvs1[i].fields.SalesDescription || '';
                                    let active = data.tproductvs1[i].fields.Active;
                                    let lockextrasell = data.tproductvs1[i].fields.LockExtraSell || '';
                                    let customfield1 = data.tproductvs1[i].fields.CUSTFLD1 || '';
                                    let customfield2 = data.tproductvs1[i].fields.CUSTFLD2 || '';
                                    let barcode = data.tproductvs1[i].fields.BARCODE || '';
                                    $("#selectProductID").val(data.tproductvs1[i].fields.ID).trigger("change");
                                    $('#add-product-title').text('Edit Product');
                                    $('#edtproductname').val(productname);
                                    $('#edtsellqty1price').val(sellqty1price);
                                    $('#txasalesdescription').val(salesdescription);
                                    $('#sltsalesacount').val(incomeaccount);
                                    $('#slttaxcodesales').val(taxcodesales);
                                    $('#edtbarcode').val(barcode);
                                    $('#txapurchasedescription').val(purchasedescription);
                                    $('#sltcogsaccount').val(cogsaccount);
                                    $('#slttaxcodepurchase').val(taxcodepurchase);
                                    $('#edtbuyqty1cost').val(buyqty1cost);

                                    setTimeout(function() {
                                        $('#newProductModal').modal('show');
                                    }, 500);
                                }
                            }
                            if (!added) {
                                sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                                    $('.fullScreenSpin').css('display', 'none');
                                    let lineItems = [];
                                    let lineItemObj = {};
                                    let currencySymbol = Currency;
                                    let totalquantity = 0;
                                    let productname = data.tproduct[0].fields.ProductName || '';
                                    let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                                    let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                                    let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                                    let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                                    let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                                    let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                                    let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                                    let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                                    let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                                    let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                                    let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                                    let active = data.tproduct[0].fields.Active;
                                    let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                                    let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                                    let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                                    let barcode = data.tproduct[0].fields.BARCODE || '';
                                    $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                                    $('#add-product-title').text('Edit Product');
                                    $('#edtproductname').val(productname);
                                    $('#edtsellqty1price').val(sellqty1price);
                                    $('#txasalesdescription').val(salesdescription);
                                    $('#sltsalesacount').val(incomeaccount);
                                    $('#slttaxcodesales').val(taxcodesales);
                                    $('#edtbarcode').val(barcode);
                                    $('#txapurchasedescription').val(purchasedescription);
                                    $('#sltcogsaccount').val(cogsaccount);
                                    $('#slttaxcodepurchase').val(taxcodepurchase);
                                    $('#edtbuyqty1cost').val(buyqty1cost);

                                    setTimeout(function() {
                                        $('#newProductModal').modal('show');
                                    }, 500);
                                }).catch(function(err) {

                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }
                        }
                    }).catch(function(err) {

                        sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let currencySymbol = Currency;
                            let totalquantity = 0;
                            let productname = data.tproduct[0].fields.ProductName || '';
                            let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                            let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                            let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                            let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                            let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                            let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                            let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                            let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                            let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                            let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                            let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                            let active = data.tproduct[0].fields.Active;
                            let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                            let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                            let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                            let barcode = data.tproduct[0].fields.BARCODE || '';
                            $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                            $('#add-product-title').text('Edit Product');
                            $('#edtproductname').val(productname);
                            $('#edtsellqty1price').val(sellqty1price);
                            $('#txasalesdescription').val(salesdescription);
                            $('#sltsalesacount').val(incomeaccount);
                            $('#slttaxcodesales').val(taxcodesales);
                            $('#edtbarcode').val(barcode);
                            $('#txapurchasedescription').val(purchasedescription);
                            $('#sltcogsaccount').val(cogsaccount);
                            $('#slttaxcodepurchase').val(taxcodepurchase);
                            $('#edtbuyqty1cost').val(buyqty1cost);

                            setTimeout(function() {
                                $('#newProductModal').modal('show');
                            }, 500);
                        }).catch(function(err) {

                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                } else {
                    $('#productListModal').modal('toggle');
                    var targetID = $(event.target).closest('tr').attr('id');
                    $('#selectLineID').val(targetID);
                    setTimeout(function() {
                        $('#tblInventory_filter .form-control-sm').focus();
                        $('#tblInventory_filter .form-control-sm').val('');
                        $('#tblInventory_filter .form-control-sm').trigger("input");

                        var datatable = $('#tblInventory').DataTable();
                        datatable.draw();
                        $('#tblInventory_filter .form-control-sm').trigger("input");

                    }, 500);
                }
            }
        }
    },
    'click #productListModal #refreshpagelist': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        localStorage.setItem('VS1SalesProductList', '');
        let templateObject = Template.instance();
        Meteor._reload.reload();
        templateObject.getAllProducts();

    },
    'click .lineTaxRate': function(event) {
        $('#tblInvoiceLine tbody tr .lineTaxRate').attr("data-toggle", "modal");
        $('#tblInvoiceLine tbody tr .lineTaxRate').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .lineTaxCode': function(event) {
        $('#tblInvoiceLine tbody tr .lineTaxCode').attr("data-toggle", "modal");
        $('#tblInvoiceLine tbody tr .lineTaxCode').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .printConfirm': function(event) {
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtCustomerName').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
        exportSalesToPdf();
    },
    'keydown .lineQty, keydown .lineUnitPrice': function(event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||

            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||

            (event.keyCode >= 35 && event.keyCode <= 40)) {

            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
            event.preventDefault();
        }
    },
    'click .btnRemove': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectDeleteLineID').val(targetID);

        times++;
        if (times == 1) {
            $('#deleteLineModal').modal('toggle');
        } else {
            if ($('#tblInvoiceLine tbody>tr').length > 1) {
                this.click;
                $(event.target).closest('tr').remove();
                event.preventDefault();
                let $tblrows = $("#tblInvoiceLine tbody tr");

                let lineAmount = 0;
                let subGrandTotal = 0;
                let taxGrandTotal = 0;
                let subDiscountTotal = 0; // New Discount
                let taxGrandTotalPrint = 0;

                let subGrandTotalNet = 0;
                let taxGrandTotalNet = 0;
                $tblrows.each(function(index) {
                    var $tblrow = $(this);
                    var qty = $tblrow.find(".lineQty").val() || 0;
                    var price = $tblrow.find(".lineUnitPrice").val() || 0;
                    var taxRate = $tblrow.find(".lineTaxCode").text();

                    var taxrateamount = 0;
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxRate) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                            }
                        }
                    }

                    var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    var lineDiscountPerc = parseFloat($tblrow.find(".lineDiscount").text()) || 0; // New Discount
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
                    $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalWithDiscountTotalLine));

                    if (!isNaN(subTotal)) {
                        $tblrow.find('.lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                        subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ? 0 : subTotalWithDiscountTotalLine;
                        subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
                        taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
                        document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
                    }



                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        let GrandTotalNet = (parseFloat(subGrandTotalNet)) + (parseFloat(taxGrandTotalNet));
                        document.getElementById("subtotal_nett").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
                        document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                    }
                });
                return false;

            } else {
                $('#deleteLineModal').modal('toggle');
            }
        }
    },
    'click .btnDeleteRefund': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let salesService = new SalesBoardService();
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        var objDetails = '';
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            var objDetails = {
                type: "TRefundSale",
                fields: {
                    ID: currentInvoice,
                    Deleted: true,
                    Lines: null
                }
            };

            salesService.saveRefundSale(objDetails).then(function(objDetails) {
                window.open('/refundlist', '_self');
            }).catch(function(err) {
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
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            window.open('/refundlist', '_self');
        }
        $('#deleteLineModal').modal('toggle');
    },
    'click .btnDeleteLine': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let selectLineID = $('#selectDeleteLineID').val();
        if ($('#tblInvoiceLine tbody>tr').length > 1) {
            this.click;

            $('#' + selectLineID).closest('tr').remove();

            let $tblrows = $("#tblInvoiceLine tbody tr");

            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let subDiscountTotal = 0; // New Discount
            let taxGrandTotalPrint = 0;

            let subGrandTotalNet = 0;
            let taxGrandTotalNet = 0;
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".lineUnitPrice").val() || 0;
                var taxRate = $tblrow.find(".lineTaxCode").text();

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                var lineDiscountPerc = parseFloat($tblrow.find(".lineDiscount").text()) || 0; // New Discount
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
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotalWithDiscountTotalLine));

                if (!isNaN(subTotal)) {
                    $tblrow.find('.lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotalWithDiscountTotalLine) ? 0 : subTotalWithDiscountTotalLine;
                    subGrandTotalNet += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotalNet);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotalWithDiscountTotalLine) ? 0 : taxTotalWithDiscountTotalLine;
                    taxGrandTotalNet += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotalNet);
                }



                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    let GrandTotalNet = (parseFloat(subGrandTotalNet)) + (parseFloat(taxGrandTotalNet));
                    document.getElementById("subtotal_nett").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotalNet);
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });


        } else {
            this.click;

            $('#' + selectLineID + " .lineProductName").val('');
            $('#' + selectLineID + " .lineProductDesc").text('');
            $('#' + selectLineID + " .lineOrdered").val('');
            $('#' + selectLineID + " .lineQty").val('');
            $('#' + selectLineID + " .lineBo").val('');
            $('#' + selectLineID + " .lineUnitPrice").val('');
            $('#' + selectLineID + " .lineCostPrice").val('');
            $('#' + selectLineID + " .lineSalesLinesCustField1").text('');
            $('#' + selectLineID + " .lineTaxRate").text('');
            $('#' + selectLineID + " .lineTaxCode").text('');
            $('#' + selectLineID + " .lineAmt").text('');

            document.getElementById("subtotal_tax").innerHTML = Currency + '0.00';
            document.getElementById("subtotal_total").innerHTML = Currency + '0.00';
            document.getElementById("grandTotal").innerHTML = Currency + '0.00';
            document.getElementById("balanceDue").innerHTML = Currency + '0.00';
            document.getElementById("totalBalanceDue").innerHTML = Currency + '0.00';



        }

        $('#deleteLineModal').modal('toggle');
    },
    'click .btnSaveSettings': function(event) {

        $('#myModal4').modal('toggle');
    },
    'click .btnSave': function(event) {
        let templateObject = Template.instance();
        let customername = $('#edtCustomerName');
        let salesService = new SalesBoardService();
        let termname = $('#sltTerms').val() || '';
        let payMethod = $("#sltPaymentMethod").val() || 'Cash';
        Session.setPersistent('paymentmethod', payMethod);
        if (termname === '') {
            swal('Terms has not been selected!', '', 'warning');
            event.preventDefault();
            return false;
        }

        if (customername.val() === '') {
            swal('Customer has not been selected!', '', 'warning');
            e.preventDefault();
        } else {

            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));

            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();
            $('#tblInvoiceLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").val();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();
                let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                if (tdproduct != "") {

                    lineItemObjForm = {
                        type: "TRefundSaleLine",
                        fields: {
                            ProductName: tdproduct || '',
                            ProductDescription: tddescription || '',
                            UOMOrderQty:-parseFloat(tdQty) || 0,
                            UOMQtySold: -parseFloat(tdQty) || 0,
                            UOMQtyShipped: -parseFloat(tdQty) || 0,
                            LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                            Headershipdate: saleDate,
                            LineTaxCode: tdtaxCode || '',
                            DiscountPercent: parseFloat($('#' + lineID + " .lineDiscount").text()) || 0
                        }
                    };
                    lineItemsForm.push(lineItemObjForm);
                    splashLineArray.push(lineItemObjForm);
                }
            });
            let getchkcustomField1 = true;
            let getchkcustomField2 = true;
            let getcustomField1 = $('.customField1Text').html();
            let getcustomField2 = $('.customField2Text').html();
            if ($('#formCheck-one').is(':checked')) {
                getchkcustomField1 = false;
            }
            if ($('#formCheck-two').is(':checked')) {
                getchkcustomField2 = false;
            }

            let customer = $('#edtCustomerName').val();
            let customerEmail = $('#edtCustomerEmail').val();
            let billingAddress = $('#txabillingAddress').val();


            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();

            let departement = $('#sltDept').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();

            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentInvoice = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentInvoice = parseInt(currentInvoice);
                objDetails = {
                    type: "TRefundSale",
                    fields: {
                        ID: currentInvoice,
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,

                        CustPONumber: poNumber,
                        // ReferenceNo: reference,
                        TermsName: termname,
                        PayMethod:payMethod||'Cash',
                        SaleClassName: departement,
                        ShipToDesc: shippingAddress,
                        Comments: comments,
                        SaleCustField1: saleCustField1,
                        SaleCustField2: saleCustField2,
                        PickMemo: pickingInfrmation,
                        // Attachments: uploadedItems,
                        SalesStatus: $('#sltStatus').val()
                    }
                };
            } else {
                objDetails = {
                    type: "TRefundSale",
                    fields: {
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        InvoiceToDesc: billingAddress,
                        SaleDate: saleDate,

                        CustPONumber: poNumber,
                        // ReferenceNo: reference,
                        TermsName: termname,
                        PayMethod:payMethod||'Cash',
                        SaleClassName: departement,
                        ShipToDesc: shippingAddress,
                        Comments: comments,
                        SaleCustField1: saleCustField1,
                        SaleCustField2: saleCustField2,
                        PickMemo: pickingInfrmation,
                        // Attachments: uploadedItems,
                        SalesStatus: $('#sltStatus').val()
                    }
                };
            }
            salesService.saveRefundSale(objDetails).then(function(objDetails) {
                var customerID = $('#edtCustomerEmail').attr('customerid');

                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtCustomerName').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'invoice-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;


                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtCustomerName').val();
                        let checkEmailData = $('#edtCustomerEmail').val();

                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Refund ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's invoice " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find refund <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        The amount outstanding of <span>' + amountDueEmail + '</span> is due on <span>' + emailDueDate + '</span>' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

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
                                    FlowRouter.go('/refundlist?success=true');

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
                                    FlowRouter.go('/refundlist?success=true');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            FlowRouter.go('/refundlist?success=true');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

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
                                    FlowRouter.go('/refundlist?success=true');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Customer: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            FlowRouter.go('/refundlist?success=true');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

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
                                    FlowRouter.go('/refundlist?success=true');
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
                                            FlowRouter.go('/refundlist?success=true');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            FlowRouter.go('/refundlist?success=true');
                        };
                    };


                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();

                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {

                            resolve(doc.output('blob'));

                        });
                    });
                }

                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TCustomer",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }



                };
                var getcurrentCloudDetails = CloudUser.findOne({
                    _id: Session.get('mycloudLogonID'),
                    clouddatabaseID: Session.get('mycloudLogonDBID')
                });
                if (getcurrentCloudDetails) {
                    if (getcurrentCloudDetails._id.length > 0) {
                        var clientID = getcurrentCloudDetails._id;
                        var clientUsername = getcurrentCloudDetails.cloudUsername;
                        var clientEmail = getcurrentCloudDetails.cloudEmail;
                        var checkPrefDetails = CloudPreference.findOne({
                            userid: clientID,
                            PrefName: 'refundcard'
                        });

                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'refundcard',
                                    published: true,
                                    customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }],
                                    updatedAt: new Date()
                                }
                            }, function(err, idTag) {
                                if (err) {

                                } else {


                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'salesform',
                                PrefName: 'refundcard',
                                published: true,
                                customFields: [{
                                    index: '1',
                                    label: getcustomField1,
                                    hidden: getchkcustomField1
                                }, {
                                    index: '2',
                                    label: getcustomField2,
                                    hidden: getchkcustomField2
                                }],
                                createdAt: new Date()
                            }, function(err, idTag) {
                                if (err) {

                                } else {


                                }
                            });
                        }
                    }
                }


            }).catch(function(err) {
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

                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click .chkProductName': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colProductName').css('display', 'table-cell');
            $('.colProductName').css('padding', '.75rem');
            $('.colProductName').css('vertical-align', 'top');
        } else {
            $('.colProductName').css('display', 'none');
        }
    },
    'click .chkDescription': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colDescription').css('display', 'table-cell');
            $('.colDescription').css('padding', '.75rem');
            $('.colDescription').css('vertical-align', 'top');
        } else {
            $('.colDescription').css('display', 'none');
        }
    },
    'click .chkQty': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colQty').css('display', 'table-cell');
            $('.colQty').css('padding', '.75rem');
            $('.colQty').css('vertical-align', 'top');
        } else {
            $('.colQty').css('display', 'none');
        }
    },
    'click .chkUnitPrice': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colUnitPrice').css('display', 'table-cell');
            $('.colUnitPrice').css('padding', '.75rem');
            $('.colUnitPrice').css('vertical-align', 'top');
        } else {
            $('.colUnitPrice').css('display', 'none');
        }
    },
    'click .chkCostPrice': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colCostPrice').css('display', 'table-cell');
            $('.colCostPrice').css('padding', '.75rem');
            $('.colCostPrice').css('vertical-align', 'top');
        } else {
            $('.colCostPrice').css('display', 'none');
        }
    },
    'click .chkSalesLinesCustField1': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colSalesLinesCustField1').css('display', 'table-cell');
            $('.colSalesLinesCustField1').css('padding', '.75rem');
            $('.colSalesLinesCustField1').css('vertical-align', 'top');
        } else {
            $('.colSalesLinesCustField1').css('display', 'none');
        }
    },
    'click .chkTaxRate': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colTaxRate').css('display', 'table-cell');
            $('.colTaxRate').css('padding', '.75rem');
            $('.colTaxRate').css('vertical-align', 'top');
        } else {
            $('.colTaxRate').css('display', 'none');
        }
    },
    'click .chkAmount': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colAmount').css('display', 'table-cell');
            $('.colAmount').css('padding', '.75rem');
            $('.colAmount').css('vertical-align', 'top');
        } else {
            $('.colAmount').css('display', 'none');
        }
    },
    'change .rngRangeProductName': function(event) {

        let range = $(event.target).val();
        $(".spWidthProductName").html(range + '%');
        $('.colProductName').css('width', range + '%');

    },
    'change .rngRangeDescription': function(event) {

        let range = $(event.target).val();
        $(".spWidthDescription").html(range + '%');
        $('.colDescription').css('width', range + '%');

    },
    'change .rngRangeQty': function(event) {

        let range = $(event.target).val();
        $(".spWidthQty").html(range + '%');
        $('.colQty').css('width', range + '%');

    },
    'change .rngRangeUnitPrice': function(event) {

        let range = $(event.target).val();
        $(".spWidthUnitPrice").html(range + '%');
        $('.colUnitPrice').css('width', range + '%');

    },
    'change .rngRangeTaxRate': function(event) {

        let range = $(event.target).val();
        $(".spWidthTaxRate").html(range + '%');
        $('.colTaxRate').css('width', range + '%');

    },
    'change .rngRangeAmount': function(event) {

        let range = $(event.target).val();
        $(".spWidthAmount").html(range + '%');
        $('.colAmount').css('width', range + '%');

    },
    'change .rngRangeCostPrice': function(event) {

        let range = $(event.target).val();
        $(".spWidthCostPrice").html(range + '%');
        $('.colCostPrice').css('width', range + '%');

    },
    'change .rngRangeSalesLinesCustField1': function(event) {

        let range = $(event.target).val();
        $(".spWidthSalesLinesCustField1").html(range + '%');
        $('.colSalesLinesCustField1').css('width', range + '%');

    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);

    },
    'click .btnSaveGridSettings': function(event) {
        let lineItems = [];

        $('.columnSettings').each(function(index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(':checked')) {
                colHidden = false;
            } else {
                colHidden = true;
            }
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass
            }

            lineItems.push(lineItemObj);



        });


        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'tblInvoiceLine'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'tblInvoiceLine',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');

                        } else {
                            $('#myModal2').modal('toggle');


                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'tblInvoiceLine',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');

                        } else {
                            $('#myModal2').modal('toggle');


                        }
                    });

                }
            }
        }

    },
    'click .btnResetGridSettings': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'tblInvoiceLine'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .btnResetSettings': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'refundcard'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .new_attachment_btn': function(event) {
        $('#attachment-upload').trigger('click');

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
    'click .img_new_attachment_btn': function(event) {
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function(e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
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
    'click .file-name': function(event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();

        $('#myModalAttachment').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        } else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        } else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        } else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        } else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        } else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');

        return;
    },
    'click .confirm-delete-attachment': function(event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
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
    'click #btnPayment': function() {
        let templateObject = Template.instance();
        let customername = $('#edtCustomerName');
        let salesService = new SalesBoardService();
        let termname = $('#sltTerms').val() || '';
        if (termname === '') {
            swal('Terms has not been selected!', '', 'warning');
            event.preventDefault();
            return false;
        }
        if (customername.val() === '') {
            swal('Customer has not been selected!', '', 'warning');
            e.preventDefault();
        } else {

            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();
            $('#tblInvoiceLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").val();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();
                let tdunitprice = $('#' + lineID + " .lineUnitPrice").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                if (tdproduct != "") {

                    lineItemObjForm = {
                        type: "TRefundSaleLine",
                        fields: {
                            ProductName: tdproduct || '',
                            ProductDescription: tddescription || '',
                            UOMOrderQty:parseFloat(tdQty) || 0,
                            UOMQtySold: parseFloat(tdQty) || 0,
                            UOMQtyShipped: parseFloat(tdQty) || 0,
                            LinePrice: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                            Headershipdate: saleDate,
                            LineTaxCode: tdtaxCode || '',
                            DiscountPercent: parseFloat($('#' + lineID + " .lineDiscount").text()) || 0
                        }
                    };
                    lineItemsForm.push(lineItemObjForm);
                    splashLineArray.push(lineItemObjForm);
                }
            });
            let getchkcustomField1 = true;
            let getchkcustomField2 = true;
            let getcustomField1 = $('.customField1Text').html();
            let getcustomField2 = $('.customField2Text').html();
            if ($('#formCheck-one').is(':checked')) {
                getchkcustomField1 = false;
            }
            if ($('#formCheck-two').is(':checked')) {
                getchkcustomField2 = false;
            }

            let customer = $('#edtCustomerName').val();
            let customerEmail = $('#edtCustomerEmail').val();
            let billingAddress = $('#txabillingAddress').val();



            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();

            let departement = $('#sltDept').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();

            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentInvoice = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentInvoice = parseInt(currentInvoice);
                objDetails = {
                    type: "TRefundSale",
                    fields: {
                        ID: currentInvoice,
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
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
                        PickMemo: pickingInfrmation,
                        Attachments: uploadedItems,
                        SalesStatus: $('#sltStatus').val()
                    }
                };
            } else {
                objDetails = {
                    type: "TRefundSale",
                    fields: {
                        CustomerName: customer,
                        ForeignExchangeCode: currencyCode,
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
                        PickMemo: pickingInfrmation,
                        Attachments: uploadedItems,
                        SalesStatus: $('#sltStatus').val()
                    }
                };
            }

            salesService.saveRefundSale(objDetails).then(function(objDetails) {
                var customerID = $('#edtCustomerEmail').attr('customerid');
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TCustomer",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // salesService.saveCustomerEmail(customerEmailData).then(function(customerEmailData) {
                    //
                    // });
                };
                let linesave = objDetails.fields.ID;
                var getcurrentCloudDetails = CloudUser.findOne({
                    _id: Session.get('mycloudLogonID'),
                    clouddatabaseID: Session.get('mycloudLogonDBID')
                });
                if (getcurrentCloudDetails) {
                    if (getcurrentCloudDetails._id.length > 0) {
                        var clientID = getcurrentCloudDetails._id;
                        var clientUsername = getcurrentCloudDetails.cloudUsername;
                        var clientEmail = getcurrentCloudDetails.cloudEmail;
                        var checkPrefDetails = CloudPreference.findOne({
                            userid: clientID,
                            PrefName: 'refundcard'
                        });

                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'refundcard',
                                    published: true,
                                    customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }],
                                    updatedAt: new Date()
                                }
                            }, function(err, idTag) {
                                if (err) {
                                    window.open('/paymentcard?invid=' + linesave, '_self');
                                } else {
                                    window.open('/paymentcard?invid=' + linesave, '_self');

                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'salesform',
                                PrefName: 'refundcard',
                                published: true,
                                customFields: [{
                                    index: '1',
                                    label: getcustomField1,
                                    hidden: getchkcustomField1
                                }, {
                                    index: '2',
                                    label: getcustomField2,
                                    hidden: getchkcustomField2
                                }],
                                createdAt: new Date()
                            }, function(err, idTag) {
                                if (err) {
                                    window.open('/paymentcard?invid=' + linesave, '_self');
                                } else {
                                    window.open('/paymentcard?invid=' + linesave, '_self');

                                }
                            });
                        }
                    }
                }


            }).catch(function(err) {
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

                $('.fullScreenSpin').css('display', 'none');
            });
        }


    },
    'click #btnViewPayment': function() {
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];

        let customer = $('#edtCustomerName').val();
        window.open('/paymentcard?custname=' + customer + '&from=' + currentInvoice, '_self');
    },
    'click .btnBack': function(event) {


        event.preventDefault();
        history.back(1);
    },
    'click .chkEmailCopy': function(event) {
        $('#edtCustomerEmail').val($('#edtCustomerEmail').val().replace(/\s/g, ''));
        if ($(event.target).is(':checked')) {
            let checkEmailData = $('#edtCustomerEmail').val();
            if (checkEmailData.replace(/\s/g, '') === '') {
                swal('Customer Email cannot be blank!', '', 'warning');
                event.preventDefault();
            } else {

                function isEmailValid(mailTo) {
                    return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
                };
                if (!isEmailValid(checkEmailData)) {
                    swal('The email field must be a valid email address !', '', 'warning');

                    event.preventDefault();
                    return false;
                } else {


                }
            }
        } else {

        }
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
