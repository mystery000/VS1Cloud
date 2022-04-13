import {
    PaymentsService
} from '../payments/payments-service';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    EmployeeProfileService
} from "../js/profile-service";
import {
    AccountService
} from "../accounts/account-service";
import {
    UtilityService
} from "../utility-service";
import {
    SideBarService
} from '../js/sidebar-service';
import {
    OCRService
} from '../js/ocr-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let accountService = new AccountService();
let ocrService = new OCRService();
Template.receiptsoverview.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.employees = new ReactiveVar([]);
    templateObject.suppliers = new ReactiveVar([]);
    templateObject.chartAccounts = new ReactiveVar([]);
    templateObject.expenseClaimList = new ReactiveVar([]);
    templateObject.editExpenseClaim = new ReactiveVar();
});

Template.receiptsoverview.onRendered(function () {
    let templateObject = Template.instance();

    $('.employees').editableSelect();
    $('.merchants').editableSelect();
    $('.chart-accounts').editableSelect();
    $('.currencies').editableSelect();
    $('.transactionTypes').editableSelect();

    $('.employees').on('click', function(e, li) {
        setEmployeeSelect(e);
    });
    $('.merchants').on('click', function(e, li) {
        setSupplierSelect(e);
    });
    $('.currencies').on('click', function(e, li) {
        setCurrencySelect(e);
    });
    $('.chart-accounts').on('click', function(e, li) {
        setAccountSelect(e);
    });
    $('.transactionTypes').on('click', function(e, li) {
        setPaymentMethodSelect(e);
    });

    function setEmployeeSelect(e) {
        var $earch = $(e.target);
        var offset = $earch.offset();
        var employeeName = e.target.value || '';        

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
            $('#employeeListModal').modal('toggle');
            setTimeout(function () {
                $('#tblEmployeelist_filter .form-control-sm').focus();
                $('#tblEmployeelist_filter .form-control-sm').val('');
                $('#tblEmployeelist_filter .form-control-sm').trigger("input");
                var datatable = $('#tblEmployeelist').DataTable();
                datatable.draw();
                $('#tblEmployeelist_filter .form-control-sm').trigger("input");
            }, 500);
        } else {
            if (employeeName.replace(/\s/g, '') != '') {    // edit employee
                let editId = $('#viewReceiptModal .employees').attr('data-id');
                
                getVS1Data('TEmployee').then(function (dataObject) {

                    if (dataObject.length == 0) {
                        sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                            addVS1Data('TEmployee', JSON.stringify(data));
                            for (let i = 0; i < data.temployee.length; i++) {
                                if (data.temployee[i].fields.ID == editId) {
                                    showEditEmployeeView(data.temployee[i].fields);
                                }    
                            }
                        }).catch(function (err) {
        
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.temployee;

                        for (let i = 0; i < useData.length; i++) {
                            if (useData[i].fields.ID == editId) {
                                showEditEmployeeView(useData[i].fields);
                            }
                        }
                    }
                }).catch(function (err) {
                    sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                        addVS1Data('TEmployee', JSON.stringify(data));
                        for (let i = 0; i < data.temployee.length; i++) {
                            if (data.temployee[i].fields.ID == editId) {
                                showEditEmployeeView(data.temployee[i].fields);
                            } 
                        }
                    }).catch(function (err) {
        
                    });
                });
            } else {
                $('#employeeListModal').modal('toggle');
            }
        }
    }
    function showEditEmployeeView(data) {
        $('.fullScreenSpin').css('display', 'none');
        $('#add-customer-title').text('Edit Customer');
        let popCustomerID = data.ID || '';
        let popCustomerName = data.EmployeeName || '';
        let popCustomerEmail = data.Email || '';
        let popCustomerTitle = data.Title || '';
        let popCustomerFirstName = data.FirstName || '';
        let popCustomerMiddleName = data.MiddleName || '';
        let popCustomerLastName = data.LastName || '';
        let popCustomerPhone = data.Phone || '';
        let popCustomerMobile = data.Mobile || '';
        let popCustomerFaxnumber = data.Faxnumber || '';
        let popCustomerSkypeName = data.SkypeName || '';
        let popCustomerURL = data.URL || '';
        let popCustomerStreet = data.Street || '';
        let popCustomerStreet2 = data.Street2 || '';
        let popCustomerState = data.State || '';
        let popCustomerPostcode = data.Postcode || '';
        let popCustomerCountry = data.Country || LoggedCountry;
        let popCustomercustfield1 = data.CustFld1 || '';
        let popCustomercustfield2 = data.CustFld2 || '';
        let popCustomercustfield3 = data.CustFld3 || '';
        let popCustomercustfield4 = data.CustFld4 || '';
        let popCustomernotes = data.Notes || '';
        let popCustomerpreferedpayment = data.PaymentMethodName || '';
        let popGender = data.Sex == "F" ? "Female" : data.Sex == "M" ? "Male" : "";
        
        //$('#edtCustomerCompany').attr('readonly', true);
        $('#edtCustomerCompany').val(popCustomerName);
        $('#edtEmployeePOPID').val(popCustomerID);
        $('#edtEmailAddress').val(popCustomerEmail);
        $('#edtTitle').val(popCustomerTitle);
        $('#edtFirstName').val(popCustomerFirstName);
        $('#edtMiddleName').val(popCustomerMiddleName);
        $('#edtLastName').val(popCustomerLastName);
        $('#edtPhone').val(popCustomerPhone);
        $('#edtMobile').val(popCustomerMobile);
        $('#edtFax').val(popCustomerFaxnumber);
        $('#edtSkype').val(popCustomerSkypeName);
        $('#edtCustomerWebsite').val(popCustomerURL);
        $('#edtAddress').val(popCustomerStreet);
        $('#edtCity').val(popCustomerStreet2);
        $('#edtState').val(popCustomerState);
        $('#edtPostalCode').val(popCustomerPostcode);
        $('#sedtCountry').val(popCustomerCountry);
        $('#txaNotes').val(popCustomernotes);
        $('#sltPreferedPayment').val(popCustomerpreferedpayment);
        $('#edtCustomeField1').val(popCustomercustfield1);
        $('#edtCustomeField2').val(popCustomercustfield2);
        $('#edtCustomeField3').val(popCustomercustfield3);
        $('#edtCustomeField4').val(popCustomercustfield4);
        $('#edtGender').val(popGender);

        setTimeout(function () {
            $('#addEmployeeModal').modal('show');
        }, 200);
    }

    function setSupplierSelect(e) {
        var $earch = $(e.target);
        var offset = $earch.offset();
        $('#edtSupplierPOPID').val('');
        var supplierDataName = e.target.value || '';
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
            $('#supplierListModal').modal();
            setTimeout(function() {
                $('#tblSupplierlist_filter .form-control-sm').focus();
                $('#tblSupplierlist_filter .form-control-sm').val('');
                $('#tblSupplierlist_filter .form-control-sm').trigger("input");
                var datatable = $('#tblSupplierlist').DataTable();
                datatable.draw();
                $('#tblSupplierlist_filter .form-control-sm').trigger("input");
            }, 500);
        } else {
            if (supplierDataName.replace(/\s/g, '') != '') {
                getVS1Data('TSupplierVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                            showEditSupplierView(data.tsuppliervs1[0].fields);
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        var added = false;
                        for (let i = 0; i < data.tsuppliervs1.length; i++) {
                            if ((data.tsuppliervs1[i].fields.ClientName) === supplierDataName) {
                                added = true;
                                showEditSupplierView(data.tsuppliervs1[i].fields);
                            }
                        }

                        if (!added) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                                showEditSupplierView(data.tsuppliervs1[0].fields);
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                }).catch(function(err) {
                    sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                        showEditSupplierView(data.tsuppliervs1[0].fields);
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                });
            } else {
                $('#supplierListModal').modal();
                setTimeout(function() {
                    $('#tblSupplierlist_filter .form-control-sm').focus();
                    $('#tblSupplierlist_filter .form-control-sm').val('');
                    $('#tblSupplierlist_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblSupplierlist').DataTable();
                    datatable.draw();
                    $('#tblSupplierlist_filter .form-control-sm').trigger("input");
                }, 500);
            }
        }
    }
    function showEditSupplierView(data) {
        $('.fullScreenSpin').css('display', 'none');

        $('#add-supplier-title').text('Edit Supplier');
        let popSupplierID = data.ID || '';
        let popSupplierName = data.ClientName || '';
        let popSupplierEmail = data.Email || '';
        let popSupplierTitle = data.Title || '';
        let popSupplierFirstName = data.FirstName || '';
        let popSupplierMiddleName = data.CUSTFLD10 || '';
        let popSupplierLastName = data.LastName || '';
        let popSuppliertfn = '' || '';
        let popSupplierPhone = data.Phone || '';
        let popSupplierMobile = data.Mobile || '';
        let popSupplierFaxnumber = data.Faxnumber || '';
        let popSupplierSkypeName = data.SkypeName || '';
        let popSupplierURL = data.URL || '';
        let popSupplierStreet = data.Street || '';
        let popSupplierStreet2 = data.Street2 || '';
        let popSupplierState = data.State || '';
        let popSupplierPostcode = data.Postcode || '';
        let popSupplierCountry = data.Country || LoggedCountry;
        let popSupplierbillingaddress = data.BillStreet || '';
        let popSupplierbcity = data.BillStreet2 || '';
        let popSupplierbstate = data.BillState || '';
        let popSupplierbpostalcode = data.BillPostcode || '';
        let popSupplierbcountry = data.Billcountry || LoggedCountry;
        let popSuppliercustfield1 = data.CUSTFLD1 || '';
        let popSuppliercustfield2 = data.CUSTFLD2 || '';
        let popSuppliercustfield3 = data.CUSTFLD3 || '';
        let popSuppliercustfield4 = data.CUSTFLD4 || '';
        let popSuppliernotes = data.Notes || '';
        let popSupplierpreferedpayment = data.PaymentMethodName || '';
        let popSupplierterms = data.TermsName || '';
        let popSupplierdeliverymethod = data.ShippingMethodName || '';
        let popSupplieraccountnumber = data.ClientNo || '';
        let popSupplierisContractor = data.Contractor || false;
        let popSupplierissupplier = data.IsSupplier || false;
        let popSupplieriscustomer = data.IsCustomer || false;

        $('#edtSupplierCompany').val(popSupplierName);
        $('#edtSupplierPOPID').val(popSupplierID);
        $('#edtSupplierCompanyEmail').val(popSupplierEmail);
        $('#edtSupplierTitle').val(popSupplierTitle);
        $('#edtSupplierFirstName').val(popSupplierFirstName);
        $('#edtSupplierMiddleName').val(popSupplierMiddleName);
        $('#edtSupplierLastName').val(popSupplierLastName);
        $('#edtSupplierPhone').val(popSupplierPhone);
        $('#edtSupplierMobile').val(popSupplierMobile);
        $('#edtSupplierFax').val(popSupplierFaxnumber);
        $('#edtSupplierSkypeID').val(popSupplierSkypeName);
        $('#edtSupplierWebsite').val(popSupplierURL);
        $('#edtSupplierShippingAddress').val(popSupplierStreet);
        $('#edtSupplierShippingCity').val(popSupplierStreet2);
        $('#edtSupplierShippingState').val(popSupplierState);
        $('#edtSupplierShippingZIP').val(popSupplierPostcode);
        $('#sedtCountry').val(popSupplierCountry);
        $('#txaNotes').val(popSuppliernotes);
        $('#sltPreferedPayment').val(popSupplierpreferedpayment);
        $('#sltTerms').val(popSupplierterms);
        $('#suppAccountNo').val(popSupplieraccountnumber);
        $('#edtCustomeField1').val(popSuppliercustfield1);
        $('#edtCustomeField2').val(popSuppliercustfield2);
        $('#edtCustomeField3').val(popSuppliercustfield3);
        $('#edtCustomeField4').val(popSuppliercustfield4);

        setTimeout(function() {
            $('#addSupplierModal').modal('show');
        }, 200);
    }

    function setCurrencySelect(e) {
        var $earch = $(e.target);
        var offset = $earch.offset();
        var currencyDataName = e.target.value || '';

        $('#edtCurrencyID').val('');
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
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
                                    showEditCurrencyView(data.tcurrency[i]);
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
                                showEditCurrencyView(data.tcurrency[i]);
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
                                showEditCurrencyView(data.tcurrency[i]);
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
    }
    function showEditCurrencyView(data) {
        $('#edtCurrencyID').val(data.Id);
        setTimeout(function() {
            $('#sedtCountry').val(data.Country);
        }, 200);
        //$('#sedtCountry').val(data.Country);
        // $('#currencyCode').val(currencyDataName);
        $('#currencySymbol').val(data.CurrencySymbol);
        $('#edtCurrencyName').val(data.Currency);
        $('#edtCurrencyDesc').val(data.CurrencyDesc);
        $('#edtBuyRate').val(data.BuyRate);
        $('#edtSellRate').val(data.SellRate);
    }    

    function setAccountSelect(e) {
        var $earch = $(e.target);
        var offset = $earch.offset();
        var accountDataName = e.target.value || '';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
            $('#accountListModal').modal('toggle');
            setTimeout(function() {
                $('#tblAccount_filter .form-control-sm').focus();
                $('#tblAccount_filter .form-control-sm').val('');
                $('#tblAccount_filter .form-control-sm').trigger("input");

                var datatable = $('#tblAccount').DataTable();
                datatable.draw();
                $('#tblAccount_filter .form-control-sm').trigger("input");

            }, 500);
        } else {
            if (accountDataName.replace(/\s/g, '') != '') {    // edit employee
                getVS1Data('TAccountVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        accountService.getOneAccountByName(accountDataName).then(function(data) {
                            $('#add-account-title').text('Edit Account Details');
                            $('#edtAccountName').attr('readonly', true);
                            $('#sltAccountType').attr('readonly', true);
                            $('#sltAccountType').attr('disabled', 'disabled');

                            showEditAccountView(data.taccountvs1[0]);

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.taccountvs1;
                        var added = false;
                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');
                        for (let a = 0; a < data.taccountvs1.length; a++) {

                            if ((data.taccountvs1[a].fields.AccountName) === accountDataName) {
                                added = true;

                                showEditAccountView(data.taccountvs1[a]);
                            }
                        }
                        if (!added) {
                            accountService.getOneAccountByName(accountDataName).then(function(data) {
                              $('#add-account-title').text('Edit Account Details');
                              $('#edtAccountName').attr('readonly', true);
                              $('#sltAccountType').attr('readonly', true);
                              $('#sltAccountType').attr('disabled', 'disabled');

                              showEditAccountView(data.taccountvs1[0]);

                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }

                    }
                }).catch(function(err) {
                    accountService.getOneAccountByName(accountDataName).then(function(data) {
                      let lineItems = [];
                      let lineItemObj = {};
                      let fullAccountTypeName = '';
                      let accBalance = '';
                      $('#add-account-title').text('Edit Account Details');
                      $('#edtAccountName').attr('readonly', true);
                      $('#sltAccountType').attr('readonly', true);
                      $('#sltAccountType').attr('disabled', 'disabled');
                      
                      showEditAccountView(data.taccountvs1[0]);

                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });

                });
                $('#addAccountModal').modal('toggle');

            } else {
                $('#accountListModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
                setTimeout(function() {
                    $('#tblAccount_filter .form-control-sm').focus();
                    $('#tblAccount_filter .form-control-sm').val('');
                    $('#tblAccount_filter .form-control-sm').trigger("input");

                    var datatable = $('#tblInventory').DataTable();
                    datatable.draw();
                    $('#tblAccount_filter .form-control-sm').trigger("input");

                }, 500);
            }
        }
    }
    function showEditAccountView(data) {
        $('.fullScreenSpin').css('display', 'none');
        var accountid = data.fields.ID || '';
        var accounttype = data.fields.AccountTypeName || '';
        var accountname = data.fields.AccountName || '';
        var accountno = data.fields.AccountNumber || '';
        var taxcode = data.fields.TaxCode || '';
        var accountdesc = data.fields.Description || '';
        var bankaccountname = data.fields.BankAccountName || '';
        var bankbsb = data.fields.BSB || '';
        var bankacountno = data.fields.BankAccountNumber || '';

        var swiftCode = data.fields.Extra || '';
        var routingNo = data.BankCode || '';

        var showTrans = data.fields.IsHeader || false;

        var cardnumber = data.fields.CarNumber || '';
        var cardcvc = data.fields.CVC || '';
        var cardexpiry = data.fields.ExpiryDate || '';

        if ((accounttype === "BANK")) {
            $('.isBankAccount').removeClass('isNotBankAccount');
            $('.isCreditAccount').addClass('isNotCreditAccount');
        } else if ((accounttype === "CCARD")) {
            $('.isCreditAccount').removeClass('isNotCreditAccount');
            $('.isBankAccount').addClass('isNotBankAccount');
        } else {
            $('.isBankAccount').addClass('isNotBankAccount');
            $('.isCreditAccount').addClass('isNotCreditAccount');
        }

        $('#edtAccountID').val(accountid);
        $('#sltAccountType').val(accounttype);
        $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
        $('#edtAccountName').val(accountname);
        $('#edtAccountNo').val(accountno);
        $('#sltTaxCode').val(taxcode);
        $('#txaAccountDescription').val(accountdesc);
        $('#edtBankAccountName').val(bankaccountname);
        $('#edtBSB').val(bankbsb);
        $('#edtBankAccountNo').val(bankacountno);
        $('#swiftCode').val(swiftCode);
        $('#routingNo').val(routingNo);
        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

        $('#edtCardNumber').val(cardnumber);
        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
        $('#edtCvc').val(cardcvc);

        if (showTrans == 'true') {
            $('.showOnTransactions').prop('checked', true);
        } else {
            $('.showOnTransactions').prop('checked', false);
        }

        setTimeout(function() {
            $('#addNewAccount').modal('show');
        }, 500);
    }

    function setPaymentMethodSelect(e) {
        var $earch = $(e.target);
        var offset = $earch.offset();

        var paymentDataName = e.target.value || '';
        $('#edtPaymentMethodID').val('');
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
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
                                    $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
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
                                $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
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
                                $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
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
    }

    $("#date-input,#dateTo,#dateFrom,.dtReceiptDate").datepicker({
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

    templateObject.setTimeFilter = function(option) {
        
        var startDate;
        var endDate = moment().format("DD/MM/YYYY");

        if (option == 'lastMonth') {
            startDate = moment().subtract(1, 'months').format("DD/MM/YYYY");
        } else if (option == 'lastQuarter') {
            startDate = moment().subtract(1, 'quarter').format("DD/MM/YYYY");
        } else if (option == 'last12Months') {
            startDate = moment().subtract(12, 'months').format("DD/MM/YYYY");
        } else if (option == 'ignoreDate') {
            startDate = '';
            endDate = '';
        }
        $('#dateFrom').val(startDate);
        $('#dateTo').val(endDate);

        $('#dateFrom').trigger('change');

    }

    $.fn.dataTableExt.afnFiltering.push(
        function( settings, data, dataIndex ) {
            if (settings.nTable.id === 'tblReceiptList') {
                var min = $('#dateFrom').val();
                var max = $('#dateTo').val();
                let startDate = moment(min, 'DD/MM/YYYY');
                let endDate = moment(max, 'DD/MM/YYYY');
                var date = moment(data[1], 'DD/MM/YYYY');
                if (
                    ( min === '' && max === '' ) ||
                    ( min === '' && date <= endDate ) ||
                    ( startDate <= date   && max === null ) ||
                    ( startDate <= date   && date <= endDate )
                ) {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        }
    );

    setTimeout(function () {
        //$.fn.dataTable.moment('DD/MM/YY');
        $('#tblSplitExpense').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": 3
            }, {
                type: 'date',
                targets: 0
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilterSplit'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "Awaiting Customer Payments List - " + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
                    format: {
                        body: function (data, row, column) {
                            if (data.includes("</span>")) {
                                var res = data.split("</span>");
                                data = res[1];
                            }

                            return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                        }
                    }
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Supplier Payment',
                filename: "Awaiting Customer Payments List - " + moment().format(),
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
                    stripHtml: false
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsLeft: 0
            },
            pageLength: initialReportDatatableLoad,
            "bLengthChange": false,
            info: true,
            responsive: true,
            "order": [
                [1, "desc"]
            ],
            action: function () {
                // $('#tblSplitExpense').DataTable().ajax.reload();
            },
            "fnInitComplete": function () {
                $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshSplit' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSplitExpense_filter");
                $('.myvarFilterFormSplit').appendTo(".colDateFilterSplit");
            }
        }).on('page', function () {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        });
    }, 0);

    setTimeout(function () {
        //$.fn.dataTable.moment('DD/MM/YY');
        $('#tblMerge').DataTable({
            columnDefs: [{
                type: 'date',
                targets: 0
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilterMerge'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "Awaiting Customer Payments List - " + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
                    format: {
                        body: function (data, row, column) {
                            if (data.includes("</span>")) {
                                var res = data.split("</span>");
                                data = res[1];
                            }

                            return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                        }
                    }
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Supplier Payment',
                filename: "Awaiting Customer Payments List - " + moment().format(),
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
                    stripHtml: false
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            // colReorder: {
            //     fixedColumnsLeft: 0
            // },
            pageLength: initialReportDatatableLoad,
            "bLengthChange": false,
            info: true,
            responsive: true,
            "order": [
                [1, "desc"]
            ],
            action: function () {
                $('#tblMerge').DataTable().ajax.reload();
            },
            "fnInitComplete": function () {
                $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshMerge' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus'></i></button>").insertAfter("#tblMerge_filter");
                $('.myvarFilterFormMerge').appendTo(".colDateFilterMerge");
            }
        }).on('page', function () {
            setTimeout(function () {
                MakeNegative();
            }, 100);
            // let draftRecord = templateObject.datatablerecords.get();
            // templateObject.datatablerecords.set(draftRecord);
        }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        });
    }, 0);


    $('.imageParent')
        // tile mouse actions
        .on('mouseover', function () {
            $(this).children('.receiptPhoto').css({
                'transform': 'scale(' + $(this).attr('data-scale') + ')'
            });
        })
        .on('mouseout', function () {
            $(this).children('.receiptPhoto').css({
                'transform': 'scale(1)'
            });
        })
        .on('mousemove', function (e) {
            $(this).children('.receiptPhoto').css({
                'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 + '%'
            });
        })
        // tiles set up
        .each(function () {
            $(this)
                // add a photo container
                .append('<div class="receiptPhoto"></div>')
                // set up a background image for each tile based on data-image attribute
                // .children('.receiptPhoto').css({
                //     'background-image': 'url(' + $(this).attr('data-image') + ')'
                // });
        })

    templateObject.getExpenseClaims = function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        accountService.getExpenseClaim().then(function (data) {
            let lineItems = [];
            console.log('expense', data)
            data.texpenseclaim.forEach(expense => {

                if (expense.fields.Active) {
                    if(Object.prototype.toString.call(expense.fields.Lines) === "[object Array]"){
                        expense.fields.Lines.forEach(claim => {
                            let lineItem = claim.fields;
                            lineItem.DateTime = claim.fields.DateTime != '' ? moment(claim.fields.DateTime).format("DD/MM/YYYY") : '';
                            lineItems.push(lineItem);
                        })
                    }else if(Object.prototype.toString.call(expense.fields.Lines) === "[object Object]"){    
                        let lineItem = expense.fields.Lines.fields;
                        lineItem.DateTime = lineItem.DateTime != '' ? moment(lineItem.DateTime).format("DD/MM/YYYY") : '';
                        lineItems.push(lineItem);
                    }
                }
            });

            templateObject.expenseClaimList.set(lineItems);

            setTimeout(function () {
                //$.fn.dataTable.moment('DD/MM/YY');
                $('#tblReceiptList').DataTable({
                    columnDefs: [{
                        "orderable": false,
                        "targets": 0
                    }, {
                        type: 'date',
                        targets: 1
                    }],
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-12 col-md-6 colDateFilter p-0'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [{
                        extend: 'excelHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Awaiting Customer Payments List - " + moment().format(),
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible:not(.chkBox)',
                            format: {
                                body: function (data, row, column) {
                                    if (data.includes("</span>")) {
                                        var res = data.split("</span>");
                                        data = res[1];
                                    }
        
                                    return column === 1 ? data.replace(/<.*?>/ig, "") : data;
        
                                }
                            }
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Supplier Payment',
                        filename: "Awaiting Customer Payments List - " + moment().format(),
                        exportOptions: {
                            columns: ':visible:not(.chkBox)',
                            stripHtml: false
                        }
                    }],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 0
                    },
                    pageLength: initialReportDatatableLoad,
                    "bLengthChange": false,
                    info: true,
                    responsive: true,
                    "order": [
                        [1, "desc"]
                    ],
                    action: function () {
                        // $('#tblReceiptList').DataTable().ajax.reload();
                    },
                    "fnInitComplete": function () {
                        $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefresh' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblReceiptList_filter");
                        $('.myvarFilterForm').appendTo(".colDateFilter");
                    }
                }).on('page', function () {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                    
                }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                });
                $('.fullScreenSpin').css('display', 'none');

                templateObject.setTimeFilter('lastMonth');
            }, 0);

            // $('.dataTables_info').html('Showing 1 to '+ lineItems.length + ' of ' + lineItems.length + ' entries');
        });
    }

    templateObject.getExpenseClaims();


    templateObject.getLineAttachmentList = function(lineId) {
        accountService.getLineAttachmentList(lineId).then(function (data) {
            console.log('attachmentdata', data);
        })
    }

    templateObject.getOCRResultFromImage = function(imageData, fileName) {
        $('.fullScreenSpin').css('display', 'inline-block');
        ocrService.POST(imageData, fileName).then(function(data) {
            console.log('ocrresult', data);
            $('.fullScreenSpin').css('display', 'none');
        }).catch(function (err) {
            console.log('ocrresult err', err);
            $('.fullScreenSpin').css('display', 'none');
        });
    }

    templateObject.base64data = function (file) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onerror = reject;
            fr.onload = function () {
                resolve(fr.result);
            }
            fr.readAsDataURL(file);
        })
    };
});

Template.receiptsoverview.events({
    'click a#showManuallyCreate, click .btnNewReceipt, click #newReceiptModal #nav-expense-tab': function () {
        $('a.nav-link.active').removeClass('active');
        $('a.nav-link#nav-expense-tab').addClass('active');

        $('#newReceiptModal .tab-pane.show.active').removeClass('show active');
        $('#newReceiptModal .tab-pane#nav-expense').addClass('show active');

        $('#employeeListModal').attr('data-from', 'NavExpense');

        $('#nav-expense .employees').attr('data-id', '');
        $('#nav-expense .employees').val('');
        $('#nav-expense .transactionTypes').attr('data-id', '');
        $('#nav-expense .transactionTypes').val('');
        $('#nav-expense .merchants').attr('data-id', '');
        $('#nav-expense .merchants').val('');
        $('#nav-expense .currencies').attr('data-id', '');
        $('#nav-expense .currencies').val('');
        $('#nav-expense .chart-accounts').attr('data-id', '');
        $('#nav-expense .chart-accounts').val('');
        $('#nav-expense .dtReceiptDate').datepicker('setDate', new Date());
        $('#nav-expense #edtTotal').val('');
        $('#nav-expense .swtReiumbursable').attr('checked', false);
        $('#nav-expense #sltLinkedReport').val('');
        $('#nav-expense #txaDescription').val('');
    },
    'click a#showMultiple': function () {
        $('a.nav-link.active').removeClass('active');
        $('a.nav-link#nav-multiple-tab').addClass('active');

        $('#newReceiptModal .tab-pane.show.active').removeClass('show active');
        $('#newReceiptModal .tab-pane#nav-multiple').addClass('show active');
    },
    'click a#showTime, click #newReceiptModal #nav-time-tab': function () {
        $('a.nav-link.active').removeClass('active');
        $('a.nav-link#nav-time-tab').addClass('active');

        $('#newReceiptModal .tab-pane.show.active').removeClass('show active');
        $('#newReceiptModal .tab-pane#nav-time').addClass('show active');

        $('#employeeListModal').attr('data-from', 'NavTime');

        $('#nav-time .employees').attr('data-id', '');
        $('#nav-time .employees').val('');
        $('#nav-time .transactionTypes').attr('data-id', '');
        $('#nav-time .transactionTypes').val('');
        $('#nav-time .merchants').attr('data-id', '');
        $('#nav-time .merchants').val('');
        $('#nav-time .currencies').attr('data-id', '');
        $('#nav-time .currencies').val('');
        $('#nav-time .chart-accounts').attr('data-id', '');
        $('#nav-time .chart-accounts').val('');
        $('#nav-time .dtReceiptDate').datepicker('setDate', new Date());
        $('#nav-time #edtTotal').val('');
        $('#nav-time .swtReiumbursable').attr('checked', false);
        $('#nav-time #sltLinkedReport').val('');
        $('#nav-time #txaDescription').val('');
    },
    'click #nav-expense .btn-upload': function (event) {
        $('#nav-expense .attachment-upload').trigger('click');
    },
    'click #nav-time .btn-upload': function (event) {
        $('#nav-time .attachment-upload').trigger('click');
    },
    'click #viewReceiptModal .btn-upload': function (event) {
        $('#viewReceiptModal .attachment-upload').trigger('click');
    },

    'change #viewReceiptModal .attachment-upload': function(event) {
        let files = $(event.target)[0].files;
        let imageFile = files[0];
        console.log('file changed', imageFile);
        let template = Template.instance();
        template.base64data(imageFile).then(imageData => {
            // template.getOCRResultFromImage(imageData, imageFile.name);
            $('#viewReceiptModal .receiptPhoto').css('background-image', "url('" + imageData + "')");
        })
    },

    'change #dateFrom, change #dateTo': function (event) {
        var receiptTable = $('#tblReceiptList').DataTable();
        receiptTable.draw();
    },

    'click #formCheck-All': function (event) {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
        } else {
            $(".chkBox").prop("checked", false);
        }
    },

    'click .timeFilter': function (event) {
        let id = event.target.id;
        let template = Template.instance();
        template.setTimeFilter(id);
    },

    'click #tblReceiptList tbody tr td:not(:first-child)': function (event) {
        let template = Template.instance();
        var selectedId = $(event.target).closest('tr').attr('id');
        let selectedClaim = template.expenseClaimList.get().filter(claim => claim.ID == selectedId)[0];
        template.editExpenseClaim.set(selectedClaim);

        template.getLineAttachmentList(selectedClaim.ID);

        $('#employeeListModal').attr('data-from', 'ViewReceipt');

        $('#viewReceiptModal').modal('toggle');

        $('#viewReceiptModal .employees').val(selectedClaim.EmployeeName);
        $('#viewReceiptModal .employees').attr('data-id', selectedClaim.EmployeeID);
        $('#viewReceiptModal .merchants').val(selectedClaim.SupplierName);
        $('#viewReceiptModal .merchants').attr('data-id', selectedClaim.SupplierID);
        $('#viewReceiptModal .chart-accounts').val(selectedClaim.AccountName);
        $('#viewReceiptModal .chart-accounts').attr('data-id', selectedClaim.AccountId);

        // $('#viewReceiptModal .receiptPhoto').css('background-image', "url('" + selectedClaim.attachmentData + "')");
    },
    'click #tblEmployeelist tbody tr': function (e) {
        let employeeName = $(e.target).closest('tr').find(".colEmployeeName").text() || '';
        let employeeID = $(e.target).closest('tr').find(".colID").text() || '';
        let from = $('#employeeListModal').attr('data-from');

        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .employees').val(employeeName);
            $('#viewReceiptModal .employees').attr('data-id', employeeID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .employees').val(employeeName);
            $('#nav-expense .employees').attr('data-id', employeeID);
        } else if (from == 'NavTime') {
            $('#nav-time .employees').val(employeeName);
            $('#nav-time .employees').attr('data-id', employeeID);
        }
        $('#employeeListModal').modal('toggle');
    },
    'click #tblSupplierlist tbody tr': function (e) {
        let supplierName = $(e.target).closest('tr').find(".colCompany").text() || '';
        let supplierID = $(e.target).closest('tr').find(".colID").text() || '';
        let from = $('#employeeListModal').attr('data-from');
        
        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .merchants').val(supplierName);
            $('#viewReceiptModal .merchants').attr('data-id', supplierID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .merchants').val(supplierName);
            $('#nav-expense .merchants').attr('data-id', supplierID);
        } else if (from == 'NavTime') {
            $('#nav-time .merchants').val(supplierName);
            $('#nav-time .merchants').attr('data-id', supplierID);
        }
        $('#supplierListModal').modal('toggle');
    },
    'click #tblCurrencyPopList tbody tr': function (e) {
        let currencyName = $(e.target).closest('tr').find(".colCode").text() || '';
        let currencyID = $(e.target).closest('tr').attr('id') || '';
        let from = $('#employeeListModal').attr('data-from');
        
        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .currencies').val(currencyName);
            $('#viewReceiptModal .currencies').attr('data-id', currencyID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .currencies').val(currencyName);
            $('#nav-expense .currencies').attr('data-id', currencyID);
        } else if (from == 'NavTime') {
            $('#nav-time .currencies').val(currencyName);
            $('#nav-time .currencies').attr('data-id', currencyID);
        }
        $('#currencyModal').modal('toggle');
    },
    'click #tblAccount tbody tr': function (e) {
        let accountName = $(e.target).closest('tr').find(".productName").text() || '';
        let accountID = $(e.target).closest('tr').find(".colAccountID").text() || '';
        let from = $('#employeeListModal').attr('data-from');
        
        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .chart-accounts').val(accountName);
            $('#viewReceiptModal .chart-accounts').attr('data-id', accountID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .chart-accounts').val(accountName);
            $('#nav-expense .chart-accounts').attr('data-id', accountID);
        } else if (from == 'NavTime') {
            $('#nav-time .chart-accounts').val(accountName);
            $('#nav-time .chart-accounts').attr('data-id', accountID);
        }
        $('#accountListModal').modal('toggle');
    },
    'click #paymentmethodList tbody tr': function (e) {
        let typeName = $(e.target).closest('tr').find(".colName").text() || '';
        let typeID = $(e.target).closest('tr').find("input.chkBox").attr('id') || '';
        let from = $('#employeeListModal').attr('data-from');
        
        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .transactionTypes').val(typeName);
            $('#viewReceiptModal .transactionTypes').attr('data-id', typeID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .transactionTypes').val(typeName);
            $('#nav-expense .transactionTypes').attr('data-id', typeID);
        } else if (from == 'NavTime') {
            $('#nav-time .transactionTypes').val(typeName);
            $('#nav-time .transactionTypes').attr('data-id', typeID);
        }
        $('#paymentMethodModal').modal('toggle');
    },

    // update receipt record
    'click #viewReceiptModal .btnSave': function (e) {

        let template = Template.instance();
        let receipt = template.editExpenseClaim.get();

        let employeeId = $('#viewReceiptModal .employees').attr('data-id');
        let employeeName = $('#viewReceiptModal .employees').val()  || ' ';
        let transactionTypeId = $('#viewReceiptModal .transactionTypes').attr('data-id');
        let transactionTypeName = $('#viewReceiptModal .transactionTypes').val() || ' ';
        let supplierId = $('#viewReceiptModal .merchants').attr('data-id');
        let supplierName = $('#viewReceiptModal .merchants').val() || ' ';
        let currencyId = $('#viewReceiptModal .currencies').attr('data-id');
        let currencyName = $('#viewReceiptModal .currencies').val() || ' ';
        let chartAccountId = $('#viewReceiptModal .chart-accounts').attr('data-id');
        let chartAccountName = $('#viewReceiptModal .chart-accounts').val() || ' ';
        let claimDate = $('#viewReceiptModal .dtReceiptDate').val() || ' ';
        let totalAmount = $('#viewReceiptModal #edtTotal').val().replace('$', '');
        let reimbursement = $('#viewReceiptModal .swtReiumbursable').prop('checked');
        let groupReport = $('#viewReceiptModal #sltLinkedReport').val() || ' ';
        let description = $('#viewReceiptModal #txaDescription').val() || ' ';

        let expenseClaimLine = {
            type: "TExpenseClaimLine",
            fields: {
                ID: receipt.ID,
                EmployeeID: employeeId ? parseInt(employeeId) : 0,
                EmployeeName: employeeName,
                SupplierID: supplierId ? parseInt(supplierId) : 0,
                SupplierName: supplierName,
                AccountId: chartAccountId ? parseInt(chartAccountId) : 0,
                AccountName: chartAccountName,
                AmountInc: totalAmount ? parseInt(totalAmount) : 0,
                Reimbursement: reimbursement,
                DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                Description: description,
                // GroupReport: groupReport,
                // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                // TransactionTypeName: transactionTypeName,
                // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                // CurrencyName: currencyName,                
            }
        };

        let expenseClaim = {
            type: "TExpenseClaim",
            fields: {
                ID: receipt.ExpenseClaimID,
                EmployeeID: employeeId ? parseInt(employeeId) : 0,
                EmployeeName: employeeName,
                DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                Description: description,
                Lines: [expenseClaimLine],
                RequestToEmployeeID: employeeId ? parseInt(employeeId) : 0,
                RequestToEmployeeName: employeeName,
            }
        }

        console.log('ExpenseClaim', expenseClaim)

        accountService.saveReceipt(expenseClaim).then(function (data) {
            $('#viewReceiptModal').modal('toggle');
            setTimeout(() => {
                template.getExpenseClaims();
            }, 200);
        });
    },

    'click #newReceiptModal .btnSave': function (e) {

        let template = Template.instance();

        let from = $('#employeeListModal').attr('data-from');
        let parentElement = from == 'NavExpense' ? '#nav-expense' : '#nav-time'

        let employeeId = $(parentElement + ' .employees').attr('data-id');
        let employeeName = $(parentElement + ' .employees').val()  || ' ';
        let transactionTypeId = $(parentElement + ' .transactionTypes').attr('data-id');
        let transactionTypeName = $(parentElement + ' .transactionTypes').val() || ' ';
        let supplierId = $(parentElement + ' .merchants').attr('data-id');
        let supplierName = $(parentElement + ' .merchants').val() || ' ';
        let currencyId = $(parentElement + ' .currencies').attr('data-id');
        let currencyName = $(parentElement + ' .currencies').val() || ' ';
        let chartAccountId = $(parentElement + ' .chart-accounts').attr('data-id');
        let chartAccountName = $(parentElement + ' .chart-accounts').val() || ' ';
        let claimDate = $(parentElement + ' .dtReceiptDate').val() || ' ';
        let reimbursement = $(parentElement + ' .swtReiumbursable').prop('checked');
        let groupReport = $(parentElement + ' #sltLinkedReport').val() || ' ';
        let description = $(parentElement + ' #txaDescription').val() || ' ';

        var totalAmount = 0;
        totalAmount = $(parentElement + ' #edtTotal').val();
        if (from == 'NavExpense') {
            
        } else if (from == 'NavTime') {
            let hours = $('#claimHours').val() || 0;
            let rate = $('#claimRate').val() || 0;
            // totalAmount = hours * rate;
        }

        let expenseClaimLine = {
            type: "TExpenseClaimLine",
            fields: {
                EmployeeID: employeeId ? parseInt(employeeId) : 0,
                EmployeeName: employeeName,
                SupplierID: supplierId ? parseInt(supplierId) : 0,
                SupplierName: supplierName,
                AccountId: chartAccountId ? parseInt(chartAccountId) : 0,
                AccountName: chartAccountName,
                AmountInc: totalAmount ? parseInt(totalAmount) : 0,
                Reimbursement: reimbursement,
                DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                Description: description,
                // GroupReport: groupReport,
                // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                // TransactionTypeName: transactionTypeName,
                // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                // CurrencyName: currencyName,                
            }
        };

        let expenseClaim = {
            type: "TExpenseClaim",
            fields: {
                EmployeeID: employeeId ? parseInt(employeeId) : 0,
                EmployeeName: employeeName,
                DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                Description: description,
                Lines: [expenseClaimLine],
                RequestToEmployeeID: employeeId ? parseInt(employeeId) : 0,
                RequestToEmployeeName: employeeName,
            }
        }

        console.log('ExpenseClaim', expenseClaim)

        accountService.saveReceipt(expenseClaim).then(function (data) {
            console.log('update receipt result', data);
            $('#newReceiptModal').modal('toggle');
            setTimeout(() => {
                template.getExpenseClaims();
            }, 200);
        });
    },

    'click #btnDeleteReceipt': function(e) {
        let template = Template.instance();
        let receipt = template.editExpenseClaim.get();
        swal({
            title: 'Delete Receipt Claim',
            text: 'Are you sure to delete this receipt claim?',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value) {
        
                let employeeId = $('#viewReceiptModal .employees').attr('data-id');
                let employeeName = $('#viewReceiptModal .employees').val()  || ' ';
                let transactionTypeId = $('#viewReceiptModal .transactionTypes').attr('data-id');
                let transactionTypeName = $('#viewReceiptModal .transactionTypes').val() || ' ';
                let supplierId = $('#viewReceiptModal .merchants').attr('data-id');
                let supplierName = $('#viewReceiptModal .merchants').val() || ' ';
                let currencyId = $('#viewReceiptModal .currencies').attr('data-id');
                let currencyName = $('#viewReceiptModal .currencies').val() || ' ';
                let chartAccountId = $('#viewReceiptModal .chart-accounts').attr('data-id');
                let chartAccountName = $('#viewReceiptModal .chart-accounts').val() || ' ';
                let claimDate = $('#viewReceiptModal .dtReceiptDate').val() || ' ';
                let totalAmount = $('#viewReceiptModal #edtTotal').val().replace('$', '');
                let reimbursement = $('#viewReceiptModal .swtReiumbursable').prop('checked');
                let groupReport = $('#viewReceiptModal #sltLinkedReport').val() || ' ';
                let description = $('#viewReceiptModal #txaDescription').val() || ' ';
        
                let expenseClaimLine = {
                    type: "TExpenseClaimLine",
                    fields: {
                        ID: receipt.ID,
                        EmployeeID: employeeId ? parseInt(employeeId) : 0,
                        EmployeeName: employeeName,
                        SupplierID: supplierId ? parseInt(supplierId) : 0,
                        SupplierName: supplierName,
                        AccountId: chartAccountId ? parseInt(chartAccountId) : 0,
                        AccountName: chartAccountName,
                        AmountInc: totalAmount ? parseInt(totalAmount) : 0,
                        Reimbursement: reimbursement,
                        DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        Description: description,
                        Active: false
                        // GroupReport: groupReport,
                        // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                        // TransactionTypeName: transactionTypeName,
                        // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                        // CurrencyName: currencyName,                
                    }
                };
        
                let expenseClaim = {
                    type: "TExpenseClaim",
                    fields: {
                        ID: receipt.ExpenseClaimID,
                        EmployeeID: employeeId ? parseInt(employeeId) : 0,
                        EmployeeName: employeeName,
                        DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        Description: description,
                        Lines: [expenseClaimLine],
                        RequestToEmployeeID: employeeId ? parseInt(employeeId) : 0,
                        RequestToEmployeeName: employeeName,
                        Active: false
                    }
                }
        
                console.log('ExpenseClaim', expenseClaim)
        
                accountService.saveReceipt(expenseClaim).then(function (data) {
                    window.open('/receiptsoverview', '_self');
                });
            } else if (result.dismiss === 'cancel') {

            }
          });
    }
});

Template.receiptsoverview.helpers({
    expenseClaimList: () => {
        return Template.instance().expenseClaimList.get().sort(function (a, b) {
            if (a.claimDate == 'NA') {
                return 1;
            } else if (b.claimDate == 'NA') {
                return -1;
            }
            return (a.claimDate > b.claimDate) ? 1 : -1;
        });
    },
    editExpenseClaim: () => {   
        return Template.instance().editExpenseClaim.get();
    }
});
