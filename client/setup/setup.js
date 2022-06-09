import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    OrganisationService
} from '../js/organisation-service';
import {
    CountryService
} from '../js/country-service';
import {
    TaxRateService
} from "../settings/settings-service";
import {
    SideBarService
} from '../js/sidebar-service';
import { 
    UtilityService
} from "../utility-service";

let organisationService = new OrganisationService();
let sideBarService = new SideBarService();

Template.setup.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.stepNumber = new ReactiveVar(0);

    // Step 1 Variables
    templateObject.iscompanyemail = new ReactiveVar();
    templateObject.iscompanyemail.set(false);
    templateObject.paAddress1 = new ReactiveVar();
    templateObject.paAddress2 = new ReactiveVar();
    templateObject.paAddress3 = new ReactiveVar();
    templateObject.phAddress1 = new ReactiveVar();
    templateObject.phAddress2 = new ReactiveVar();
    templateObject.phAddress3 = new ReactiveVar();
    templateObject.fieldLength = new ReactiveVar();
    templateObject.imageFileData = new ReactiveVar();
    templateObject.countryList = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();

    // Step 2 variables
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.defaultpurchasetaxcode = new ReactiveVar();
    templateObject.defaultsaletaxcode = new ReactiveVar();

    // Step 3 variables
    templateObject.paymentmethoddatatablerecords = new ReactiveVar([]);
    templateObject.paymentmethodtableheaderrecords = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.includeCreditCard = new ReactiveVar();
    templateObject.includeCreditCard.set(false);
    templateObject.includeAccountID = new ReactiveVar();
    templateObject.includeAccountID.set(false);
    templateObject.accountID = new ReactiveVar();

    // Step 4 variables
    templateObject.termdatatablerecords = new ReactiveVar([]);
    templateObject.termtableheaderrecords = new ReactiveVar([]);
    templateObject.include7Days = new ReactiveVar(false);
    templateObject.include30Days = new ReactiveVar(false);
    templateObject.includeCOD = new ReactiveVar(false);
    templateObject.includeEOM = new ReactiveVar(false);
    templateObject.includeEOMPlus = new ReactiveVar(false);
    templateObject.includeSalesDefault = new ReactiveVar(false);
    templateObject.includePurchaseDefault = new ReactiveVar(false);

    // Step 5 variables
    templateObject.employeedatatablerecords = new ReactiveVar([]);
    templateObject.employeetableheaderrecords = new ReactiveVar([]);
    templateObject.selectedFile = new ReactiveVar();

    // Step 6 variables
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.CreditNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.creditrecord = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.CreditId = new ReactiveVar();
    templateObject.selectedCurrency = new ReactiveVar([]);
    templateObject.inputSelectedCurrency = new ReactiveVar([]);
    templateObject.currencySymbol = new ReactiveVar([]);
    templateObject.viarecords = new ReactiveVar();
    templateObject.termrecords = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();
    templateObject.statusrecords = new ReactiveVar([]);


    // Step 7 variables
    // Step 8 variables
    // Step 9 variables
});

Template.setup.onRendered(function () {
    $('.fullScreenSpin').css('display', 'none');
    const templateObject = Template.instance();

    // Get step local storage variable and set step
    const currentStep = localStorage.getItem("VS1Cloud_SETUP_STEP");
    if (currentStep !== null) {
        $('.first-page').css('display', 'none');
        $('.main-setup').css('display', 'flex');
        $('.setup-step').css('display', 'none');
        let confirmedSteps = localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || '';
        for (let i = 0; i < currentStep; i++) {
            if (confirmedSteps.includes(i + 1)) $(`.setup-stepper li:nth-child(${(i + 1)})`).addClass('completed');
        }
        if (currentStep !== 9) {
            $('.setup-step-' + currentStep).css('display', 'block');
            $(`.setup-stepper li:nth-child(${currentStep})`).addClass('current');
        } else {
            $('.setup-complete').css('display', 'block');
        }
    }

    // Step 1 Render functionalities
    let countries = [];
    var countryService = new CountryService();

    function getOrganisationDetails() {
        organisationService.getOrganisationDetail().then((dataListRet) => {
            for (let event in dataListRet) {
                let dataCopy = dataListRet[event];
                for (let data in dataCopy) {
                    let mainData = dataCopy[data];
                    templateObject.showSkype.set(mainData.ContactEmail);
                    templateObject.showMob.set(mainData.MobileNumber);
                    templateObject.showFax.set(mainData.FaxNumber);
                    templateObject.showLinkedIn.set(mainData.DvaABN);
                    templateObject.phCity.set(mainData.PoCity);
                    templateObject.phState.set(mainData.PoState);
                    templateObject.phCountry.set(mainData.PoCountry);
                    templateObject.phCode.set(mainData.PoPostcode);
                    templateObject.phAttention.set(mainData.Contact);
                    let companyName = mainData.CompanyName;
                    let postalAddress = mainData.PoBox + '\n' + mainData.PoBox2 + '\n' + mainData.PoBox3;
                    let physicalAddress = mainData.Address + '\n' + mainData.Address2 + '\n' + mainData.Address3;
                    templateObject.samePhysicalAddress1.set(mainData.Address);
                    templateObject.samePhysicalAddress2.set(mainData.Address2);
                    templateObject.samePhysicalAddress3.set(mainData.Address3);

                    $('#displayname').val(mainData.CompanyName);
                    $('#tradingname').val(mainData.TradingName);

                    $('#ownerfirstname').val(mainData.Firstname);
                    $('#ownerlastname').val(mainData.LastName);
                    //$('#businessnumber').val(mainData.Abn);
                    //$('#branch').val(mainData.Apcano);
                    //$('#comment').val(mainData.GlobalRef);
                    // $('#org_type').val(mainData.CompanyCategory);
                    $('#edtCompanyNumber').val(mainData.CompanyNumber);
                    $('#edtABNNumber').val(mainData.abn);
                    $('#edtAddress').val(mainData.Address);
                    $('#edtCity').val(mainData.City);
                    $('#edtState').val(mainData.State);
                    $('#edtPostCode').val(mainData.Postcode);
                    $('#edtCountry').val(mainData.Country);
                    $('#edtCountry').append('<option selected="selected" value="' + mainData.Country + '">' + mainData.Country + '</option>');
                    $('#edtpostaladdress').val(mainData.PoBox);
                    $('#edtPostalCity').val(mainData.PoCity);
                    $('#edtPostalState').val(mainData.PoState);
                    $('#edtPostalPostCode').val(mainData.PoPostcode);
                    $('#edtPostalCountry').val(mainData.PoCountry);
                    $('#edtPostalCountry').append('<option selected="selected" value="' + mainData.PoCountry + '">' + mainData.PoCountry + '</option>');

                    if ((mainData.Address == mainData.PoBox) && (mainData.City == mainData.PoCity) &&
                        (mainData.State == mainData.PoState) && (mainData.Postcode == mainData.PoPostcode) &&
                        (mainData.Country == mainData.PoCountry)) {
                        templateObject.isSameAddress.set(true);
                        $('#chksameaddress').attr("checked", "checked");
                        $('#show_address_data').css("display", "none");
                    } else {
                        $('#chksameaddress').removeAttr("checked");
                        $('#show_address_data').css("display", "block");
                    }
                    if (mainData.TrackEmails) {
                        templateObject.iscompanyemail.set(true);
                        $('#chkIsDefailtEmail').attr("checked", "checked");
                    } else {
                        //templateObject.iscompanyemail.set(false);
                        $('#chkIsDefailtEmail').removeAttr("checked");
                    }

                    $('#pocontact').val(mainData.Contact);
                    $('#contact').val(mainData.ContactName);
                    $('#edtphonenumber').val(mainData.PhoneNumber);
                    $('#edtemailaddress').val(mainData.Email);
                    $('#edtWebsite').val(mainData.Url);
                    //$('#mobile').val(mainData.MobileNumber);
                    $('#edtfaxnumber').val(mainData.FaxNumber);

                }
            }
            $('.fullScreenSpin').css('display', 'none');
        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
        });

    }
    getOrganisationDetails();
    templateObject.getCountryData = function () {
        getVS1Data('TCountries').then(function (dataObject) {
            if (dataObject.length == 0) {
                countryService.getCountry().then((data) => {
                    for (let i = 0; i < data.tcountries.length; i++) {
                        countries.push(data.tcountries[i].Country)
                    }
                    countries = _.sortBy(countries);
                    templateObject.countryData.set(countries);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcountries;
                for (let i = 0; i < useData.length; i++) {
                    countries.push(useData[i].Country)
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);

            }
        }).catch(function (err) {
            countryService.getCountry().then((data) => {
                for (let i = 0; i < data.tcountries.length; i++) {
                    countries.push(data.tcountries[i].Country)
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);
            });
        });
    };
    templateObject.getCountryData();


    // Step 2 Render functionalities
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    let purchasetaxcode = '';
    let salestaxcode = '';
    templateObject.defaultpurchasetaxcode.set(loggedTaxCodePurchaseInc);
    templateObject.defaultsaletaxcode.set(loggedTaxCodeSalesInc);
    setTimeout(function () {
        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'defaulttax', function (error, result) {
            if (error) {
                purchasetaxcode = loggedTaxCodePurchaseInc;
                salestaxcode = loggedTaxCodeSalesInc;
                templateObject.defaultpurchasetaxcode.set(loggedTaxCodePurchaseInc);
                templateObject.defaultsaletaxcode.set(loggedTaxCodeSalesInc);
            } else {
                if (result) {
                    purchasetaxcode = result.customFields[0].taxvalue || loggedTaxCodePurchaseInc;
                    salestaxcode = result.customFields[1].taxvalue || loggedTaxCodeSalesInc;
                    templateObject.defaultpurchasetaxcode.set(purchasetaxcode);
                    templateObject.defaultsaletaxcode.set(salestaxcode);
                }

            }
        });
    }, 500);

    function MakeNegative() {
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };
    $(document).on('click', '.table-remove-rax-rate', function () {
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteTaxRateLineModal').modal('toggle');
    });
    templateObject.getTaxRates = function () {
        getVS1Data('TTaxcodeVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getTaxRateVS1().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2) + '%';
                        var dataList = {
                            id: data.ttaxcodevs1[i].Id || '',
                            codename: data.ttaxcodevs1[i].CodeName || '-',
                            description: data.ttaxcodevs1[i].Description || '-',
                            region: data.ttaxcodevs1[i].RegionName || '-',
                            rate: taxRate || '-',


                        };

                        dataTableList.push(dataList);
                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'taxRatesList', function (error, result) {
                            if (error) {

                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.split('.')[1];
                                        let columnWidth = customcolumn[i].width;
                                        let columnindex = customcolumn[i].index + 1;

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


                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function () {
                        $('#taxRatesList').DataTable({
                            columnDefs: [{
                                    type: 'date',
                                    targets: 0
                                },
                                {
                                    "orderable": false,
                                    "targets": -1
                                }
                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "taxratelist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Tax Rate List',
                                filename: "taxratelist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }],
                            select: true,
                            destroy: true,
                            // colReorder: true,
                            colReorder: {
                                fixedColumnsRight: 1
                            },
                            // bStateSave: true,
                            // rowId: 0,
                            // pageLength: 25,
                            paging: false,
                            //                      "scrollY": "400px",
                            //                      "scrollCollapse": true,
                            info: true,
                            responsive: true,
                            "order": [
                                [0, "asc"]
                            ],
                            action: function () {
                                $('#taxRatesList').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },

                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {

                        }).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });

                        // $('#taxRatesList').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#taxRatesList th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function (i, v) {
                        if (v.hidden == false) {
                            columVisible = true;
                        }
                        if ((v.className.includes("hiddenColumn"))) {
                            columVisible = false;
                        }
                        sWidth = v.style.width.replace('px', "");

                        let datatablerecordObj = {
                            sTitle: v.innerText || '',
                            sWidth: sWidth || '',
                            sIndex: v.cellIndex || '',
                            sVisible: columVisible || false,
                            sClass: v.className || ''
                        };
                        tableHeaderList.push(datatablerecordObj);
                    });
                    templateObject.tableheaderrecords.set(tableHeaderList);
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');



                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttaxcodevs1;
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    let taxRate = (useData[i].Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: useData[i].Id || '',
                        codename: useData[i].CodeName || '-',
                        description: useData[i].Description || '-',
                        region: useData[i].RegionName || '-',
                        rate: taxRate || '-',


                    };

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'taxRatesList', function (error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#taxRatesList').DataTable({
                        columnDefs: [{
                                type: 'date',
                                targets: 0
                            },
                            {
                                "orderable": false,
                                "targets": -1
                            }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "taxratelist_" + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Tax Rate List',
                            filename: "taxratelist_" + moment().format(),
                            exportOptions: {
                                columns: ':visible'
                            }
                        }],
                        select: true,
                        destroy: true,
                        // colReorder: true,
                        colReorder: {
                            fixedColumnsRight: 1
                        },
                        // bStateSave: true,
                        // rowId: 0,
                        // pageLength: 25,
                        paging: false,
                        //          "scrollY": "400px",
                        //          "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        action: function () {
                            $('#taxRatesList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#taxRatesList').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#taxRatesList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');

            }
        }).catch(function (err) {
            taxRateService.getTaxRateVS1().then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: data.ttaxcodevs1[i].Id || '',
                        codename: data.ttaxcodevs1[i].CodeName || '-',
                        description: data.ttaxcodevs1[i].Description || '-',
                        region: data.ttaxcodevs1[i].RegionName || '-',
                        rate: taxRate || '-',


                    };

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'taxRatesList', function (error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#taxRatesList').DataTable({
                        columnDefs: [{
                                type: 'date',
                                targets: 0
                            },
                            {
                                "orderable": false,
                                "targets": -1
                            }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "taxratelist_" + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Tax Rate List',
                            filename: "taxratelist_" + moment().format(),
                            exportOptions: {
                                columns: ':visible'
                            }
                        }],
                        select: true,
                        destroy: true,
                        // colReorder: true,
                        colReorder: {
                            fixedColumnsRight: 1
                        },
                        // bStateSave: true,
                        // rowId: 0,
                        // pageLength: 25,
                        paging: false,
                        //                    "scrollY": "400px",
                        //                    "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        action: function () {
                            $('#taxRatesList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#taxRatesList').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#taxRatesList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');



            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });
    }
    templateObject.getTaxRates();


    // Step 3 Render functionalities
    let dataTableListPaymentMethod = [];
    let tableHeaderListPaymentMethod = [];
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'paymentmethodList', function (error, result) {
        if (error) {

        } else {
            if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");
                }
            }

        }
    });
    templateObject.getPaymentMethods = function () {
        getVS1Data('TPaymentMethod').then(function (dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getPaymentMethodVS1().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                        // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                        var dataList = {
                            id: data.tpaymentmethodvs1[i].Id || '',
                            paymentmethodname: data.tpaymentmethodvs1[i].PaymentMethodName || '',
                            iscreditcard: data.tpaymentmethodvs1[i].IsCreditCard || 'false',
                        };

                        dataTableListPaymentMethod.push(dataList);
                        //}
                    }

                    templateObject.paymentmethoddatatablerecords.set(dataTableListPaymentMethod);

                    if (templateObject.paymentmethoddatatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'paymentmethodList', function (error, result) {
                            if (error) {

                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.split('.')[1];
                                        let columnWidth = customcolumn[i].width;
                                        let columnindex = customcolumn[i].index + 1;

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


                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function () {
                        $('#paymentmethodList').DataTable({
                            columnDefs: [{
                                "orderable": false,
                                "targets": -1
                            }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'csvHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "paymentmethodList_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Payment Method List',
                                    filename: "paymentmethodList_" + moment().format(),
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                },
                                {
                                    extend: 'excelHtml5',
                                    title: '',
                                    download: 'open',
                                    className: "btntabletoexcel hiddenColumn",
                                    filename: "paymentmethodList_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                    // ,
                                    // customize: function ( win ) {
                                    //   $(win.document.body).children("h1:first").remove();
                                    // }

                                }
                            ],
                            // bStateSave: true,
                            // rowId: 0,
                            paging: false,
                            //                      "scrollY": "400px",
                            //                      "scrollCollapse": true,
                            info: true,
                            responsive: true,
                            "order": [
                                [0, "asc"]
                            ],
                            // "aaSorting": [[1,'desc']],
                            action: function () {
                                $('#paymentmethodList').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },

                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.paymentmethoddatatablerecords.get();
                            templateObject.paymentmethoddatatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {

                        }).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    }, 10);


                    var columns = $('#paymentmethodList th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function (i, v) {
                        if (v.hidden == false) {
                            columVisible = true;
                        }
                        if ((v.className.includes("hiddenColumn"))) {
                            columVisible = false;
                        }
                        sWidth = v.style.width.replace('px', "");

                        let datatablerecordObj = {
                            sTitle: v.innerText || '',
                            sWidth: sWidth || '',
                            sIndex: v.cellIndex || '',
                            sVisible: columVisible || false,
                            sClass: v.className || ''
                        };
                        tableHeaderListPaymentMethod.push(datatablerecordObj);
                    });
                    templateObject.paymentmethodtableheaderrecords.set(tableHeaderListPaymentMethod);
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tpaymentmethodvs1;
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        paymentmethodname: useData[i].fields.PaymentMethodName || '',
                        iscreditcard: useData[i].fields.IsCreditCard || 'false',
                    };

                    dataTableListPaymentMethod.push(dataList);
                    //}
                }

                templateObject.paymentmethoddatatablerecords.set(dataTableListPaymentMethod);

                if (templateObject.paymentmethoddatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'paymentmethodList', function (error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }


                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#paymentmethodList').DataTable({
                        columnDefs: [{
                            "orderable": false,
                            "targets": -1
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "paymentmethodList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Payment Method List',
                                filename: "paymentmethodList_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "paymentmethodList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                                // ,
                                // customize: function ( win ) {
                                //   $(win.document.body).children("h1:first").remove();
                                // }

                            }
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        paging: false,
                        //            "scrollY": "400px",
                        //            "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#paymentmethodList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.paymentmethoddatatablerecords.get();
                        templateObject.paymentmethoddatatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);


                var columns = $('#paymentmethodList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderListPaymentMethod.push(datatablerecordObj);
                });
                templateObject.paymentmethodtableheaderrecords.set(tableHeaderListPaymentMethod);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');

            }
        }).catch(function (err) {
            console.log(err);
            taxRateService.getPaymentMethodVS1().then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: data.tpaymentmethodvs1[i].Id || '',
                        paymentmethodname: data.tpaymentmethodvs1[i].PaymentMethodName || '',
                        iscreditcard: data.tpaymentmethodvs1[i].IsCreditCard || 'false',
                    };

                    dataTableListPaymentMethod.push(dataList);
                    //}
                }

                templateObject.paymentmethoddatatablerecords.set(dataTableListPaymentMethod);

                if (templateObject.paymentmethoddatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'paymentmethodList', function (error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#paymentmethodList').DataTable({
                        columnDefs: [{
                            "orderable": false,
                            "targets": -1
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "paymentmethodList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Payment Method List',
                                filename: "paymentmethodList_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "paymentmethodList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                                // ,
                                // customize: function ( win ) {
                                //   $(win.document.body).children("h1:first").remove();
                                // }

                            }
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        paging: false,
                        //                    "scrollY": "400px",
                        //                    "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#paymentmethodList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.paymentmethoddatatablerecords.get();
                        templateObject.paymentmethoddatatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);


                var columns = $('#paymentmethodList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderListPaymentMethod.push(datatablerecordObj);
                });
                templateObject.paymentmethodtableheaderrecords.set(tableHeaderListPaymentMethod);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });
    }
    templateObject.getPaymentMethods();
    $('#paymentmethodList tbody').on('click', 'tr .colName, tr .colIsCreditCard, tr .colStatus', function () {
        var listData = $(this).closest('tr').attr('id');
        var isCreditcard = false;
        if (listData) {
            $('#add-paymentmethod-title').text('Edit Payment Method');
            //$('#isformcreditcard').removeAttr('checked');
            if (listData !== '') {
                listData = Number(listData);
                //taxRateService.getOnePaymentMethod(listData).then(function (data) {

                var paymentMethodID = listData || '';
                var paymentMethodName = $(event.target).closest("tr").find(".colName").text() || '';
                // isCreditcard = $(event.target).closest("tr").find(".colName").text() || '';

                if ($(event.target).closest("tr").find(".colIsCreditCard .chkBox").is(':checked')) {
                    isCreditcard = true;
                }

                $('#edtPaymentMethodID').val(paymentMethodID);
                $('#edtPaymentMethodName').val(paymentMethodName);

                if (isCreditcard == true) {
                    templateObject.includeCreditCard.set(true);
                    //$('#iscreditcard').prop('checked');
                } else {
                    templateObject.includeCreditCard.set(false);
                }

                //});


                $(this).closest('tr').attr('data-target', '#btnAddPaymentMethod');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });
    $(document).on('click', '.table-remove-payment-method', function () {
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deletePaymentMethodLineModal').modal('toggle');
    });
    $(document).ready(function () {
        let url = window.location.href;
        if (url.indexOf("?code") > 0) {
            $('.fullScreenSpin').css('display', 'inline-block');
            url = url.split('?code=');
            var id = url[url.length - 1];

            $.ajax({
                url: 'https://depot.vs1cloud.com/stripe/connect-to-stripe.php',
                data: {
                    'code': id,
                },
                method: 'post',
                success: function (response) {
                    var dataReturnRes = JSON.parse(response);
                    if (dataReturnRes.stripe_user_id) {
                        let stripe_acc_id = dataReturnRes.stripe_user_id;
                        let companyID = 1;

                        var objDetails = {
                            type: "TCompanyInfo",
                            fields: {
                                Id: companyID,
                                Apcano: stripe_acc_id
                            }
                        };
                        organisationService.saveOrganisationSetting(objDetails).then(function (data) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Stripe Connection Successful',
                                text: "Your stripe account connection is successful",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'Ok'
                            }).then((result) => {
                                if (result.value) {
                                    window.open('/paymentmethodSettings', '_self');
                                } else if (result.dismiss === 'cancel') {
                                    window.open('/paymentmethodSettings', '_self');
                                } else {
                                    window.open('/paymentmethodSettings', '_self');
                                }
                            });
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Stripe Connection Successful',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {

                                }
                            });
                        })

                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: response,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {

                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }
                }
            });

        }

        $("#saveStep3").click(function () {
            $('.fullScreenSpin').css('display', 'inline-block');
            let companyID = 1;
            let feeMethod = "apply";

            if ($('#feeInPriceInput').is(':checked')) {
                feeMethod = "include";
            }

            var objDetails = {
                type: "TCompanyInfo",
                fields: {
                    Id: companyID,
                    DvaABN: feeMethod,
                }
            };
            organisationService.saveOrganisationSetting(objDetails).then(function (data) {
                Session.setPersistent('vs1companyStripeFeeMethod', feeMethod);
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Default Payment Method Setting Successfully Changed',
                    text: '',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    $('.setup-step').css('display', 'none');
                    $(`.setup-stepper li:nth-child(4)`).addClass('current');
                    $(`.setup-stepper li:nth-child(3)`).removeClass('current');
                    $(`.setup-stepper li:nth-child(3)`).addClass('completed');
                    $('.setup-step-4').css('display', 'block');
                    let confirmedSteps = localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || '';
                    localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", confirmedSteps + '3,');
                    localStorage.setItem("VS1Cloud_SETUP_STEP", 4);
                });
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Default Payment Method Setting Successfully Changed',
                    text: '',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    $('.setup-step').css('display', 'none');
                    $(`.setup-stepper li:nth-child(4)`).addClass('current');
                    $(`.setup-stepper li:nth-child(3)`).removeClass('current');
                    $(`.setup-stepper li:nth-child(3)`).addClass('completed');
                    $('.setup-step-4').css('display', 'block');
                    let confirmedSteps = localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || '';
                    localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", confirmedSteps + '3,');
                    localStorage.setItem("VS1Cloud_SETUP_STEP", 4);
                });
            });
        });

    })


    // Step 4 Render functionalities
    let dataTableListTerm = [];
    let tableHeaderListTerm = [];
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'termsList', function (error, result) {
        if (error) {

        } else {
            if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;

                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });
    templateObject.getTerms = function () {
        getVS1Data('TTermsVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getTermsVS1().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    let setISCOD = false;
                    for (let i = 0; i < data.ttermsvs1.length; i++) {
                        if ((data.ttermsvs1[i].IsDays == true) && (data.ttermsvs1[i].Days == 0)) {

                            setISCOD = true;
                        } else {
                            setISCOD = false;
                        }
                        // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                        var dataList = {
                            id: data.ttermsvs1[i].Id || '',
                            termname: data.ttermsvs1[i].TermsName || '',
                            termdays: data.ttermsvs1[i].Days || 0,
                            iscod: setISCOD || false,
                            description: data.ttermsvs1[i].Description || '',
                            iseom: data.ttermsvs1[i].IsEOM || 'false',
                            iseomplus: data.ttermsvs1[i].IsEOMPlus || 'false',
                            isPurchasedefault: data.ttermsvs1[i].isPurchasedefault || 'false',
                            isSalesdefault: data.ttermsvs1[i].isSalesdefault || 'false'
                        };

                        dataTableListTerm.push(dataList);
                        //}
                    }


                    templateObject.termdatatablerecords.set(dataTableListTerm);

                    if (templateObject.termdatatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'termsList', function (error, result) {
                            if (error) {

                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.split('.')[1];
                                        let columnWidth = customcolumn[i].width;
                                        let columnindex = customcolumn[i].index + 1;

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


                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function () {
                        $('#termsList').DataTable({
                            columnDefs: [{
                                "orderable": false,
                                "targets": -1
                            }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'csvHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "termsList_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Term List',
                                    filename: "termsList_" + moment().format(),
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                },
                                {
                                    extend: 'excelHtml5',
                                    title: '',
                                    download: 'open',
                                    className: "btntabletoexcel hiddenColumn",
                                    filename: "termsList_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                    // ,
                                    // customize: function ( win ) {
                                    //   $(win.document.body).children("h1:first").remove();
                                    // }

                                }
                            ],
                            // bStateSave: true,
                            // rowId: 0,
                            paging: false,
                            //                      "scrollY": "400px",
                            //                      "scrollCollapse": true,
                            info: true,
                            responsive: true,
                            "order": [
                                [0, "asc"]
                            ],
                            // "aaSorting": [[1,'desc']],
                            action: function () {
                                $('#termsList').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },

                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.termdatatablerecords.get();
                            templateObject.termdatatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {

                        }).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    }, 10);


                    var columns = $('#termsList th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function (i, v) {
                        if (v.hidden == false) {
                            columVisible = true;
                        }
                        if ((v.className.includes("hiddenColumn"))) {
                            columVisible = false;
                        }
                        sWidth = v.style.width.replace('px', "");

                        let datatablerecordObj = {
                            sTitle: v.innerText || '',
                            sWidth: sWidth || '',
                            sIndex: v.cellIndex || '',
                            sVisible: columVisible || false,
                            sClass: v.className || ''
                        };
                        tableHeaderListTerm.push(datatablerecordObj);
                    });
                    templateObject.termtableheaderrecords.set(tableHeaderListTerm);
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttermsvs1;
                let lineItems = [];
                let lineItemObj = {};
                let setISCOD = false;
                for (let i = 0; i < useData.length; i++) {
                    if ((useData[i].IsDays == true) && (useData[i].Days == 0)) {

                        setISCOD = true;
                    } else {
                        setISCOD = false;
                    }
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: useData[i].Id || '',
                        termname: useData[i].TermsName || '',
                        termdays: useData[i].Days || 0,
                        iscod: setISCOD || false,
                        description: useData[i].Description || '',
                        iseom: useData[i].IsEOM || 'false',
                        iseomplus: useData[i].IsEOMPlus || 'false',
                        isPurchasedefault: useData[i].isPurchasedefault || 'false',
                        isSalesdefault: useData[i].isSalesdefault || 'false'
                    };

                    dataTableListTerm.push(dataList);
                    //}
                }


                templateObject.termdatatablerecords.set(dataTableListTerm);

                if (templateObject.termdatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'termsList', function (error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#termsList').DataTable({
                        columnDefs: [{
                            "orderable": false,
                            "targets": -1
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "termsList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Term List',
                                filename: "termsList_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "termsList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                                // ,
                                // customize: function ( win ) {
                                //   $(win.document.body).children("h1:first").remove();
                                // }

                            }
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        paging: false,
                        //          "scrollY": "400px",
                        //          "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#termsList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.termdatatablerecords.get();
                        templateObject.termdatatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);


                var columns = $('#termsList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderListTerm.push(datatablerecordObj);
                });
                templateObject.termtableheaderrecords.set(tableHeaderListTerm);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');

            }
        }).catch(function (err) {
            taxRateService.getTermsVS1().then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                let setISCOD = false;
                for (let i = 0; i < data.ttermsvs1.length; i++) {
                    if ((data.ttermsvs1[i].IsDays == true) && (data.ttermsvs1[i].Days == 0)) {

                        setISCOD = true;
                    } else {
                        setISCOD = false;
                    }
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: data.ttermsvs1[i].Id || '',
                        termname: data.ttermsvs1[i].TermsName || '',
                        termdays: data.ttermsvs1[i].Days || 0,
                        iscod: setISCOD || false,
                        description: data.ttermsvs1[i].Description || '',
                        iseom: data.ttermsvs1[i].IsEOM || 'false',
                        iseomplus: data.ttermsvs1[i].IsEOMPlus || 'false',
                        isPurchasedefault: data.ttermsvs1[i].isPurchasedefault || 'false',
                        isSalesdefault: data.ttermsvs1[i].isSalesdefault || 'false'
                    };

                    dataTableListTerm.push(dataList);
                    //}
                }


                templateObject.termdatatablerecords.set(dataTableListTerm);

                if (templateObject.termdatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'termsList', function (error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#termsList').DataTable({
                        columnDefs: [{
                            "orderable": false,
                            "targets": -1
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "termsList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Term List',
                                filename: "termsList_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "termsList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                                // ,
                                // customize: function ( win ) {
                                //   $(win.document.body).children("h1:first").remove();
                                // }

                            }
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        paging: false,
                        //                    "scrollY": "400px",
                        //                    "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#termsList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.termdatatablerecords.get();
                        templateObject.termdatatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);


                var columns = $('#termsList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.termtableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }
    templateObject.getTerms();
    $(document).on('click', '.table-remove-term', function () {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteTermLineModal').modal('toggle');
    });
    $('#termsList tbody').on('click', 'tr .colName, tr .colIsDays, tr .colIsEOM, tr .colDescription, tr .colIsCOD, tr .colIsEOMPlus, tr .colCustomerDef, tr .colSupplierDef', function () {
        var listData = $(this).closest('tr').attr('id');
        var is7days = false;
        var is30days = false;
        var isEOM = false;
        var isEOMPlus = false;
        var isSalesDefault = false;
        var isPurchaseDefault = false;
        if (listData) {
            $('#add-terms-title').text('Edit Term ');
            if (listData !== '') {
                listData = Number(listData);

                var termsID = listData || '';
                var termsName = $(event.target).closest("tr").find(".colName").text() || '';
                var description = $(event.target).closest("tr").find(".colDescription").text() || '';
                var days = $(event.target).closest("tr").find(".colIsDays").text() || 0;
                //let isDays = data.fields.IsDays || '';
                if ($(event.target).closest("tr").find(".colIsEOM .chkBox").is(':checked')) {
                    isEOM = true;
                }

                if ($(event.target).closest("tr").find(".colIsEOMPlus .chkBox").is(':checked')) {
                    isEOMPlus = true;
                }

                if ($(event.target).closest("tr").find(".colCustomerDef .chkBox").is(':checked')) {
                    isSalesDefault = true;
                }

                if ($(event.target).closest("tr").find(".colSupplierDef .chkBox").is(':checked')) {
                    isPurchaseDefault = true;
                }

                if (isEOM == true || isEOMPlus == true) {
                    isDays = false;
                } else {
                    isDays = true;
                }

                $('#edtTermsID').val(termsID);
                $('#edtName').val(termsName);
                $('#edtName').prop('readonly', true);
                $('#edtDesc').val(description);
                $('#edtDays').val(days);

                if ((isDays == true) && (days == 0)) {
                    templateObject.includeCOD.set(true);
                } else {
                    templateObject.includeCOD.set(false);
                }

                if ((isDays == true) && (days == 30)) {
                    templateObject.include30Days.set(true);
                } else {
                    templateObject.include30Days.set(false);
                }

                if (isEOM == true) {
                    templateObject.includeEOM.set(true);
                } else {
                    templateObject.includeEOM.set(false);
                }

                if (isEOMPlus == true) {
                    templateObject.includeEOMPlus.set(true);
                } else {
                    templateObject.includeEOMPlus.set(false);
                }


                if (isSalesDefault == true) {
                    templateObject.includeSalesDefault.set(true);
                } else {
                    templateObject.includeSalesDefault.set(false);
                }

                if (isPurchaseDefault == true) {
                    templateObject.includePurchaseDefault.set(true);
                } else {
                    templateObject.includePurchaseDefault.set(false);
                }

                //});


                $(this).closest('tr').attr('data-target', '#myModal');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });


    // Step 5 Render functionalities
    const dataTableListEmployee = [];
    const tableHeaderListEmployee = [];
    if (FlowRouter.current().queryParams.success) {
        $('.btnRefreshEmployee').addClass('btnRefreshAlert');
    }
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblEmployeelist', function (error, result) {
        if (error) {

        } else {
            if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    // let columnindex = customcolumn[i].index + 1;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });
    templateObject.getEmployees = function () {
        getVS1Data('TEmployee').then(function (dataObject) {

            if (dataObject.length == 0) {
                sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                    addVS1Data('TEmployee', JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.temployee.length; i++) {
                        var dataList = {
                            id: data.temployee[i].fields.ID || '',
                            employeeno: data.temployee[i].fields.EmployeeNo || '',
                            employeename: data.temployee[i].fields.EmployeeName || '',
                            firstname: data.temployee[i].fields.FirstName || '',
                            lastname: data.temployee[i].fields.LastName || '',
                            phone: data.temployee[i].fields.Phone || '',
                            mobile: data.temployee[i].fields.Mobile || '',
                            email: data.temployee[i].fields.Email || '',
                            address: data.temployee[i].fields.Street || '',
                            country: data.temployee[i].fields.Country || '',
                            department: data.temployee[i].fields.DefaultClassName || '',
                            custFld1: data.temployee[i].fields.CustFld1 || '',
                            custFld2: data.temployee[i].fields.CustFld2 || '',
                            custFld3: data.temployee[i].fields.CustFld3 || '',
                            custFld4: data.temployee[i].fields.CustFld4 || ''
                        };

                        if (data.temployee[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                            dataTableListEmployee.push(dataList);
                        }
                        //}
                    }

                    templateObject.employeedatatablerecords.set(dataTableListEmployee);

                    if (templateObject.employeedatatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblEmployeelist', function (error, result) {
                            if (error) {

                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.split('.')[1];
                                        let columnWidth = customcolumn[i].width;
                                        let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function () {
                        $('#tblEmployeelist').DataTable({

                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'csvHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Employee List - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Employee List',
                                    filename: "Employee List - " + moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                },
                                {
                                    extend: 'excelHtml5',
                                    title: '',
                                    download: 'open',
                                    className: "btntabletoexcel hiddenColumn",
                                    filename: "Employee List - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }

                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "order": [
                                [1, "asc"]
                            ],
                            action: function () {
                                $('#tblEmployeelist').DataTable().ajax.reload();
                            },
                            "fnInitComplete": function () {
                                $("<button class='btn btn-primary btnRefreshEmployees' type='button' id='btnRefreshEmployees' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEmployeelist_filter");
                            }

                        }).on('page', function () {

                            let draftRecord = templateObject.employeedatatablerecords.get();
                            templateObject.employeedatatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {

                        });

                        // $('#tblEmployeelist').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblEmployeelist th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function (i, v) {
                        if (v.hidden == false) {
                            columVisible = true;
                        }
                        if ((v.className.includes("hiddenColumn"))) {
                            columVisible = false;
                        }
                        sWidth = v.style.width.replace('px', "");
                        let datatablerecordObj = {
                            sTitle: v.innerText || '',
                            sWidth: sWidth || '',
                            sIndex: v.cellIndex || '',
                            sVisible: columVisible || false,
                            sClass: v.className || ''
                        };
                        tableHeaderListTerm.push(datatablerecordObj);
                    });
                    templateObject.employeetableheaderrecords.set(tableHeaderListTerm);
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    $('#tblEmployeelist tbody').on('click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if (listData) {
                            FlowRouter.go('/employeescard?id=' + listData);
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.temployee;

                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        employeeno: useData[i].fields.EmployeeNo || '',
                        employeename: useData[i].fields.EmployeeName || '',
                        firstname: useData[i].fields.FirstName || '',
                        lastname: useData[i].fields.LastName || '',
                        phone: useData[i].fields.Phone || '',
                        mobile: useData[i].fields.Mobile || '',
                        email: useData[i].fields.Email || '',
                        address: useData[i].fields.Street || '',
                        country: useData[i].fields.Country || '',
                        department: useData[i].fields.DefaultClassName || '',
                        custFld1: useData[i].fields.CustFld1 || '',
                        custFld2: useData[i].fields.CustFld2 || '',
                        custFld3: useData[i].fields.CustFld3 || '',
                        custFld4: useData[i].fields.CustFld4 || ''
                    };

                    if (useData[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                        dataTableList.push(dataList);
                    }
                    //}
                }

                templateObject.employeedatatablerecords.set(dataTableList);

                if (templateObject.employeedatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblEmployeelist', function (error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                setTimeout(function () {
                    $('#tblEmployeelist').DataTable({

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Employee List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Employee List',
                                filename: "Employee List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Employee List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }

                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "asc"]
                        ],
                        action: function () {
                            $('#tblEmployeelist').DataTable().ajax.reload();
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnRefreshEmployees' type='button' id='btnRefreshEmployees' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEmployeelist_filter");
                        }

                    }).on('page', function () {

                        let draftRecord = templateObject.employeedatatablerecords.get();
                        templateObject.employeedatatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    });

                    // $('#tblEmployeelist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblEmployeelist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");
                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderListTerm.push(datatablerecordObj);
                });
                templateObject.employeetableheaderrecords.set(tableHeaderListTerm);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblEmployeelist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/employeescard?id=' + listData);
                    }
                });
            }
        }).catch(function (err) {
            sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                addVS1Data('TEmployee', JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.temployee.length; i++) {
                    var dataList = {
                        id: data.temployee[i].fields.ID || '',
                        employeeno: data.temployee[i].fields.EmployeeNo || '',
                        employeename: data.temployee[i].fields.EmployeeName || '',
                        firstname: data.temployee[i].fields.FirstName || '',
                        lastname: data.temployee[i].fields.LastName || '',
                        phone: data.temployee[i].fields.Phone || '',
                        mobile: data.temployee[i].fields.Mobile || '',
                        email: data.temployee[i].fields.Email || '',
                        address: data.temployee[i].fields.Street || '',
                        country: data.temployee[i].fields.Country || '',
                        department: data.temployee[i].fields.DefaultClassName || '',
                        custFld1: data.temployee[i].fields.CustFld1 || '',
                        custFld2: data.temployee[i].fields.CustFld2 || '',
                        custFld3: data.temployee[i].fields.CustFld3 || '',
                        custFld4: data.temployee[i].fields.CustFld4 || ''
                    };

                    if (data.temployee[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                        dataTableListTerm.push(dataList);
                    }
                    //}
                }

                templateObject.employeedatatablerecords.set(dataTableListTerm);

                if (templateObject.employeedatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblEmployeelist', function (error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                setTimeout(function () {
                    $('#tblEmployeelist').DataTable({

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Employee List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Employee List',
                                filename: "Employee List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Employee List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }

                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "asc"]
                        ],
                        action: function () {
                            $('#tblEmployeelist').DataTable().ajax.reload();
                        },

                    }).on('page', function () {

                        let draftRecord = templateObject.employeedatatablerecords.get();
                        templateObject.employeedatatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    });

                    // $('#tblEmployeelist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblEmployeelist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");
                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.employeetableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblEmployeelist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/employeescard?id=' + listData);
                    }
                });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });
    }
    templateObject.getEmployees();
    $('#tblEmployeelist tbody').on('click', 'tr', function () {
        var listData = $(this).closest('tr').attr('id');
        if (listData) {
            FlowRouter.go('/employeescard?id=' + listData);
        }
    });


    // Step 6 Render functionalities
    let sideBarService = new SideBarService();
    let utilityService = new UtilityService();
    var splashArrayAccountList = new Array();
    var currentLoc = FlowRouter.current().route.path;
    let accBalance = 0;
    templateObject.getAllAccountss = function () {
        getVS1Data('TAccountVS1').then(function (dataObject) {
            if (dataObject.length === 0) {
                sideBarService.getAccountListVS1().then(function (data) {
                    let records = [];
                    let inventoryData = [];
                    addVS1Data('TAccountVS1', JSON.stringify(data));
                    for (let i = 0; i < data.taccountvs1.length; i++) {
                        if (!isNaN(data.taccountvs1[i].fields.Balance)) {
                            accBalance = utilityService.modifynegativeCurrencyFormat(data.taccountvs1[i].fields.Balance) || 0.00;
                        } else {
                            accBalance = Currency + "0.00";
                        }
                        var dataList = [
                            data.taccountvs1[i].fields.AccountName || '-',
                            data.taccountvs1[i].fields.Description || '',
                            data.taccountvs1[i].fields.AccountNumber || '',
                            data.taccountvs1[i].fields.AccountTypeName || '',
                            accBalance,
                            data.taccountvs1[i].fields.TaxCode || '',
                            data.taccountvs1[i].fields.ID || ''
                        ];
                        if (currentLoc === "/billcard") {
                            if ((data.taccountvs1[i].fields.AccountTypeName !== "AP") && (data.taccountvs1[i].fields.AccountTypeName !== "AR") && (data.taccountvs1[i].fields.AccountTypeName !== "CCARD") && (data.taccountvs1[i].fields.AccountTypeName !== "BANK")) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else if (currentLoc === "/journalentrycard") {
                            if ((data.taccountvs1[i].fields.AccountTypeName !== "AP") && (data.taccountvs1[i].fields.AccountTypeName !== "AR")) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else if (currentLoc === "/chequecard") {
                            if ((data.taccountvs1[i].fields.AccountTypeName === "EQUITY") || (data.taccountvs1[i].fields.AccountTypeName === "BANK") || (data.taccountvs1[i].fields.AccountTypeName === "CCARD") || (data.taccountvs1[i].fields.AccountTypeName === "COGS") ||
                                (data.taccountvs1[i].fields.AccountTypeName === "EXP") || (data.taccountvs1[i].fields.AccountTypeName === "FIXASSET") || (data.taccountvs1[i].fields.AccountTypeName === "INC") || (data.taccountvs1[i].fields.AccountTypeName === "LTLIAB") ||
                                (data.taccountvs1[i].fields.AccountTypeName === "OASSET") || (data.taccountvs1[i].fields.AccountTypeName === "OCASSET") || (data.taccountvs1[i].fields.AccountTypeName === "OCLIAB") || (data.taccountvs1[i].fields.AccountTypeName === "EXEXP") ||
                                (data.taccountvs1[i].fields.AccountTypeName === "EXINC")) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else if (currentLoc === "/paymentcard" || currentLoc === "/supplierpaymentcard") {
                            if ((data.taccountvs1[i].fields.AccountTypeName === "BANK") || (data.taccountvs1[i].fields.AccountTypeName === "CCARD") ||
                                (data.taccountvs1[i].fields.AccountTypeName === "OCLIAB")
                            ) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else if (currentLoc === "/bankrecon" || currentLoc === "/newbankrecon") {
                            if ((data.taccountvs1[i].fields.AccountTypeName === "BANK") || (data.taccountvs1[i].fields.AccountTypeName === "CCARD")) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else {
                            splashArrayAccountList.push(dataList);
                        }

                    }
                    //localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayAccountList));

                    if (splashArrayAccountList) {

                        $('#tblAccount').dataTable({
                            data: splashArrayAccountList,

                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            // paging: true,
                            // "aaSorting": [],
                            // "orderMulti": true,
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
                                    className: "accountnumber",
                                    "targets": [2]
                                },
                                {
                                    className: "salePrice",
                                    "targets": [3]
                                },
                                {
                                    className: "prdqty text-right",
                                    "targets": [4]
                                },
                                {
                                    className: "taxrate",
                                    "targets": [5]
                                },
                                {
                                    className: "colAccountID hiddenColumn",
                                    "targets": [6]
                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "fnInitComplete": function () {
                                $("<button class='btn btn-primary btnAddNewAccount' data-dismiss='modal' data-toggle='modal' data-target='#addAccountModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAccount_filter");
                                $("<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAccount_filter");
                            }

                        });

                        $('div.dataTables_filter input').addClass('form-control form-control-sm');

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.taccountvs1;

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < useData.length; i++) {
                    if (!isNaN(useData[i].fields.Balance)) {
                        accBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance) || 0.00;
                    } else {
                        accBalance = Currency + "0.00";
                    }
                    var dataList = [
                        useData[i].fields.AccountName || '-',
                        useData[i].fields.Description || '',
                        useData[i].fields.AccountNumber || '',
                        useData[i].fields.AccountTypeName || '',
                        accBalance,
                        useData[i].fields.TaxCode || '',
                        useData[i].fields.ID || ''
                    ];
                    if (currentLoc === "/billcard") {
                        if ((useData[i].fields.AccountTypeName !== "AP") && (useData[i].fields.AccountTypeName !== "AR") && (useData[i].fields.AccountTypeName !== "CCARD") && (useData[i].fields.AccountTypeName !== "BANK")) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else if (currentLoc === "/journalentrycard") {
                        if ((useData[i].fields.AccountTypeName !== "AP") && (useData[i].fields.AccountTypeName !== "AR")) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else if (currentLoc === "/chequecard") {
                        if ((useData[i].fields.AccountTypeName === "EQUITY") || (useData[i].fields.AccountTypeName === "BANK") || (useData[i].fields.AccountTypeName === "CCARD") || (useData[i].fields.AccountTypeName === "COGS") ||
                            (useData[i].fields.AccountTypeName === "EXP") || (useData[i].fields.AccountTypeName === "FIXASSET") || (useData[i].fields.AccountTypeName === "INC") || (useData[i].fields.AccountTypeName === "LTLIAB") ||
                            (useData[i].fields.AccountTypeName === "OASSET") || (useData[i].fields.AccountTypeName === "OCASSET") || (useData[i].fields.AccountTypeName === "OCLIAB") || (useData[i].fields.AccountTypeName === "EXEXP") ||
                            (useData[i].fields.AccountTypeName === "EXINC")) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else if (currentLoc === "/paymentcard" || currentLoc === "/supplierpaymentcard") {
                        if ((useData[i].fields.AccountTypeName === "BANK") || (useData[i].fields.AccountTypeName === "CCARD") ||
                            (useData[i].fields.AccountTypeName === "OCLIAB")
                        ) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else if (currentLoc === "/bankrecon" || currentLoc === "/newbankrecon") {
                        if ((useData[i].fields.AccountTypeName === "BANK") || (useData[i].fields.AccountTypeName === "CCARD")) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else {
                        splashArrayAccountList.push(dataList);
                    }

                }
                //localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayAccountList));
                if (splashArrayAccountList) {

                    $('#tblAccount').dataTable({
                        data: splashArrayAccountList,

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
                                className: "accountnumber",
                                "targets": [2]
                            },
                            {
                                className: "salePrice",
                                "targets": [3]
                            },
                            {
                                className: "prdqty text-right",
                                "targets": [4]
                            },
                            {
                                className: "taxrate",
                                "targets": [5]
                            },
                            {
                                className: "colAccountID hiddenColumn",
                                "targets": [6]
                            }
                        ],
                        colReorder: true,



                        "order": [
                            [0, "asc"]
                        ],


                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnAddNewAccount' data-dismiss='modal' data-toggle='modal' data-target='#addAccountModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAccount_filter");
                            $("<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAccount_filter");
                        }

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }
            }
        }).catch(function (err) {
            sideBarService.getAccountListVS1().then(function (data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.taccountvs1.length; i++) {
                    if (!isNaN(data.taccountvs1[i].fields.Balance)) {
                        accBalance = utilityService.modifynegativeCurrencyFormat(data.taccountvs1[i].fields.Balance) || 0.00;
                    } else {
                        accBalance = Currency + "0.00";
                    }
                    var dataList = [
                        data.taccountvs1[i].fields.AccountName || '-',
                        data.taccountvs1[i].fields.Description || '',
                        data.taccountvs1[i].fields.AccountNumber || '',
                        data.taccountvs1[i].fields.AccountTypeName || '',
                        accBalance,
                        data.taccountvs1[i].fields.TaxCode || '',
                        data.taccountvs1[i].fields.ID || ''
                    ];
                    if (currentLoc === "/billcard") {
                        if ((data.taccountvs1[i].fields.AccountTypeName !== "AP") && (data.taccountvs1[i].fields.AccountTypeName !== "AR") && (data.taccountvs1[i].fields.AccountTypeName !== "CCARD") && (data.taccountvs1[i].fields.AccountTypeName !== "BANK")) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else if (currentLoc === "/journalentrycard") {
                        if ((data.taccountvs1[i].fields.AccountTypeName !== "AP") && (data.taccountvs1[i].fields.AccountTypeName !== "AR")) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else if (currentLoc === "/chequecard") {
                        if ((data.taccountvs1[i].fields.AccountTypeName === "EQUITY") || (data.taccountvs1[i].fields.AccountTypeName === "BANK") || (data.taccountvs1[i].fields.AccountTypeName === "CCARD") || (data.taccountvs1[i].fields.AccountTypeName === "COGS") ||
                            (data.taccountvs1[i].fields.AccountTypeName === "EXP") || (data.taccountvs1[i].fields.AccountTypeName === "FIXASSET") || (data.taccountvs1[i].fields.AccountTypeName === "INC") || (data.taccountvs1[i].fields.AccountTypeName === "LTLIAB") ||
                            (data.taccountvs1[i].fields.AccountTypeName === "OASSET") || (data.taccountvs1[i].fields.AccountTypeName === "OCASSET") || (data.taccountvs1[i].fields.AccountTypeName === "OCLIAB") || (data.taccountvs1[i].fields.AccountTypeName === "EXEXP") ||
                            (data.taccountvs1[i].fields.AccountTypeName === "EXINC")) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else if (currentLoc === "/paymentcard" || currentLoc === "/supplierpaymentcard") {
                        if ((data.taccountvs1[i].fields.AccountTypeName === "BANK") || (data.taccountvs1[i].fields.AccountTypeName === "CCARD") ||
                            (data.taccountvs1[i].fields.AccountTypeName === "OCLIAB")
                        ) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else if (currentLoc === "/bankrecon" || currentLoc === "/newbankrecon") {
                        if ((data.taccountvs1[i].fields.AccountTypeName === "BANK") || (data.taccountvs1[i].fields.AccountTypeName === "CCARD")) {
                            splashArrayAccountList.push(dataList);
                        }
                    } else {
                        splashArrayAccountList.push(dataList);
                    }

                }
                //localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayAccountList));

                if (splashArrayAccountList) {

                    $('#tblAccount').dataTable({
                        data: splashArrayAccountList,

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
                                className: "accountnumber",
                                "targets": [2]
                            },
                            {
                                className: "salePrice",
                                "targets": [3]
                            },
                            {
                                className: "prdqty text-right",
                                "targets": [4]
                            },
                            {
                                className: "taxrate",
                                "targets": [5]
                            },
                            {
                                className: "colAccountID hiddenColumn",
                                "targets": [6]
                            }
                        ],
                        colReorder: true,



                        "order": [
                            [0, "asc"]
                        ],


                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnAddNewAccount' data-dismiss='modal' data-toggle='modal' data-target='#addAccountModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblAccount_filter");
                            $("<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAccount_filter");
                        }

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }
            });
        });
    };
    templateObject.getAllAccountss();


    // Step 7 Render functionalities
    // Step 8 Render functionalities
    // Step 9 Render functionalities
});

Template.setup.events({
    'click #start-wizard': function () {
        $('.first-page').css('display', 'none');
        $('.main-setup').css('display', 'flex');
        localStorage.setItem("VS1Cloud_SETUP_STEP", 1);
    },
    'click .confirmBtn': function (event) {
        let stepId = $(event.target).attr('data-step-id');
        stepId = parseInt(stepId) + 1;
        $('.setup-step').css('display', 'none');
        $(`.setup-stepper li:nth-child(${stepId})`).addClass('current');
        $(`.setup-stepper li:nth-child(${stepId - 1})`).removeClass('current');
        $(`.setup-stepper li:nth-child(${stepId - 1})`).addClass('completed');
        if (stepId !== 9) {
            $('.setup-step-' + stepId).css('display', 'block');
        } else {
            $('.setup-complete').css('display', 'block');
        }
        let confirmedSteps = localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || '';
        localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", confirmedSteps + (stepId - 1) + ',');
        localStorage.setItem("VS1Cloud_SETUP_STEP", stepId);
    },
    'click .btnBack': function (event) {
        let stepId = $(event.target).attr('data-step-id');
        stepId = parseInt(stepId) + 1;
        $('.setup-step').css('display', 'none');
        $(`.setup-stepper li:nth-child(${stepId})`).addClass('current');
        $(`.setup-stepper li:nth-child(${(stepId - 1)})`).removeClass('current');
        if (stepId !== 9) {
            $('.setup-step-' + stepId).css('display', 'block');
        } else {
            $('.setup-complete').css('display', 'flex');
        }
        localStorage.setItem("VS1Cloud_SETUP_STEP", stepId);
    },
    'click #launchBtn': function () {
        window.location.href = "/";
    },


    // TODO: Step 1
    // Organization setting Events
    'click #chkIsDefailtEmail': function (event) {
        let templateObj = Template.instance();
        if ($(event.target).is(':checked')) {

            templateObj.iscompanyemail.set(true);
        } else {
            //alert("not checked");
            templateObj.iscompanyemail.set(false);
        }
    },
    'click #chksameaddress': function (event) {
        const templateObject = Template.instance();
        //templateObject.showPoAddress.set(!templateObject.showPoAddress.get());
        //let hideAddressData = templateObject.showPoAddress.get();
        if ($(event.target).is(':checked')) {
            document.getElementById('show_address_data').style.display = 'none';
        } else {
            document.getElementById('show_address_data').style.display = 'block';
        }
    },
    'click #saveStep1': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let companyID = 1;
        let companyName = $('#displayname').val();
        let tradingName = $('#tradingname').val();

        let ownerFistName = $('#ownerfirstname').val() || '';
        let ownerlastName = $('#ownerlastname').val() || '';
        // let companyCategory = $('#org_type').val();
        let companyABNNumber = $('#edtABNNumber').val();
        let companyNumber = $('#edtCompanyNumber').val();
        let pocontact = $('#pocontact').val();
        let contact = $('#contact').val();
        let phone = $('#edtphonenumber').val();
        let emailAddress = $('#edtemailaddress').val() || localStorage.getItem('VS1AdminUserName');
        let websiteURL = $('#edtWebsite').val();
        let fax = $('#edtfaxnumber').val();

        let shipAddress = $('#edtAddress').val();
        let shipCity = $('#edtCity').val();
        let shipState = $('#edtState').val();
        let shipPostCode = $('#edtPostCode').val();
        let shipCountry = $('#edtCountry').val();

        let poAddress = '';
        let poCity = '';
        let poState = '';
        let poPostCode = '';
        let poCountry = '';
        let isDefaultEmail = false;

        if ($('#chksameaddress').is(':checked')) {
            poAddress = shipAddress;
            poCity = shipCity;
            poState = shipState;
            poPostCode = shipPostCode;
            poCountry = shipCountry;
        } else {
            poAddress = $('#edtpostaladdress').val();
            poCity = $('#edtPostalCity').val();
            poState = $('#edtPostalState').val();
            poPostCode = $('#edtPostalPostCode').val();
            poCountry = $('#edtPostalCountry').val();
        }

        if ($('#chkIsDefailtEmail').is(':checked')) {
            isDefaultEmail = true;
        }

        var objDetails = {
            type: "TCompanyInfo",
            fields: {
                Id: companyID,
                CompanyName: companyName,
                TradingName: tradingName,
                Firstname: ownerFistName,
                LastName: ownerlastName,
                abn: companyABNNumber,
                CompanyNumber: companyNumber,
                ContactName: contact,
                Contact: pocontact,
                PhoneNumber: phone,
                Email: emailAddress,
                Url: websiteURL,
                FaxNumber: fax,
                Address: shipAddress,
                City: shipCity,
                State: shipState,
                Postcode: shipPostCode,
                Country: shipCountry,
                PoBox: poAddress,
                PoCity: poCity,
                PoState: poState,
                PoPostcode: poPostCode,
                PoCountry: poCountry,
                TrackEmails: isDefaultEmail
            }
        };
        organisationService.saveOrganisationSetting(objDetails).then(function (data) {
            // Bert.alert('<strong>'+ 'Organisation details successfully updated!'+'</strong>!', 'success');
            // swal('Organisation details successfully updated!', '', 'success');
            if (isDefaultEmail) {
                localStorage.setItem('VS1OrgEmail', emailAddress);
            } else {
                localStorage.setItem('VS1OrgEmail', localStorage.getItem('mySession'));
            }

            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Organisation details successfully saved!',
                text: '',
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
                $('.setup-step').css('display', 'none');
                $(`.setup-stepper li:nth-child(2)`).addClass('current');
                $(`.setup-stepper li:nth-child(1)`).removeClass('current');
                $(`.setup-stepper li:nth-child(1)`).addClass('completed');
                $('.setup-step-2').css('display', 'block');
                let confirmedSteps = localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || '';
                localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", confirmedSteps + '1,');
                localStorage.setItem("VS1Cloud_SETUP_STEP", 2);
            });
        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Oooops...',
                text: 'All fields are required.',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    // Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
            });
        });
    },
    'keyup #postaladdress': function (event) {
        let templateObject = Template.instance();
        var text = document.getElementById('postaladdress').value;
        var lines = text.split('\n');
        var arrArr = text.split('\n');
        let add = '';
        for (let i = 0; i < arrArr.length; i++) {
            if (!arrArr[i]) {
                lines.splice(i, 1);
            }
        }
        templateObject.paAddress1.set(lines[0] ? lines[0] : '');
        templateObject.paAddress2.set(lines[1] ? lines[1] : '');
        if (lines.length > 3) {
            for (let i = 2; i < arrArr.length; i++) {
                add += lines[i] + ' ';
            }
            templateObject.paAddress3.set(add ? add : '');
        } else {
            templateObject.paAddress3.set(lines[2] ? lines[2] : '');
        }
    },
    'keyup #physicaladdress': function (event) {
        let templateObject = Template.instance();
        let text = document.getElementById('physicaladdress').value;
        let address = text.split('\n');
        let arrArr = text.split('\n');
        let add = '';
        for (let i = 0; i < arrArr.length; i++) {
            if (!arrArr[i]) {
                address.splice(i, 1);
            }
        }
        templateObject.phAddress1.set(address[0] ? address[0] : '');
        templateObject.phAddress2.set(address[1] ? address[1] : '');
        if (address.length > 3) {
            for (let i = 2; i < arrArr.length; i++) {
                add += address[i] + ' ';
            }
            templateObject.phAddress3.set(add ? add : '');
        } else {
            templateObject.phAddress3.set(address[2] ? address[2] : '');
        }
    },
    'click #uploadImg': function (event) {
        //let imageData= (localStorage.getItem("Image"));
        let templateObject = Template.instance();
        let imageData = templateObject.imageFileData.get();
        if (imageData != null && imageData != "") {
            localStorage.setItem("Image", imageData);
            $('#uploadedImage').attr('src', imageData);
            $('#uploadedImage').attr('width', '50%');
            $('#removeLogo').show();
            $('#changeLogo').show();
        }
    },
    'change #fileInput': function (event) {
        let templateObject = Template.instance();
        let selectedFile = event.target.files[0];
        let reader = new FileReader();
        $(".Choose_file").text('');
        reader.onload = function (event) {
            $("#uploadImg").prop("disabled", false);
            $("#uploadImg").addClass("on-upload-logo");
            $(".Choose_file").text(selectedFile.name);
            //$("#uploadImg").css("background-color","yellow");
            templateObject.imageFileData.set(event.target.result);
            //localStorage.setItem("Image",event.target.result);
        };
        reader.readAsDataURL(selectedFile);
    },
    'click #removeLogo': function (event) {
        let templateObject = Template.instance();
        templateObject.imageFileData.set(null);
        localStorage.removeItem("Image");
        // location.reload();
        Meteor._reload.reload();
        //window.open('/organisationsettings','_self');
        //Router.current().render(Template.organisationSettings);
    },
    'click .btnUploadLogoImgFile': function (event) {
        $('#fileInput').trigger('click');
    },



    // TODO: Step 2
    // Active Tax Rates
    'click .chkDatatableTaxRate': function (event) {
        var columns = $('#taxRatesList th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumnTaxRate").text();

        $.each(columns, function (i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTaxRateTable': function (event) {
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
                    PrefName: 'taxRatesList'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTaxRateTable': function (event) {
        let lineItems = [];
        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumnTaxRate").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumnTaxRate").attr("valueupdate") || '';
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
                    PrefName: 'taxRatesList'
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
                            PrefName: 'taxRatesList',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#btnOpenSettingsTaxRate').modal('toggle');
                        } else {
                            $('#btnOpenSettingsTaxRate').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'taxRatesList',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#btnOpenSettingsTaxRate').modal('toggle');
                        } else {
                            $('#btnOpenSettingsTaxRate').modal('toggle');

                        }
                    });
                }
            }
        }

    },
    'blur .divcolumnTaxRate': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#taxRatesList').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRangeTaxRate': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumnTaxRate").text();
        var datable = $('#taxRatesList th');
        $.each(datable, function (i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettingsTaxRate': function (event) {
        let templateObject = Template.instance();
        var columns = $('#taxRatesList th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");

            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
    },
    'click .btnRefreshTaxRate': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getTaxRateVS1().then(function (dataReload) {
            addVS1Data('TTaxcodeVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                location.reload(true);
            }).catch(function (err) {
                location.reload(true);
            });
        }).catch(function (err) {
            location.reload(true);
        });
    },
    'click .btnAddNewTaxRate': function () {
        $('#newTaxRate').css('display', 'block');

    },
    'click .btnCloseAddNewTax': function () {
        $('#newTaxRate').css('display', 'none');

    },
    'click #saveStep2': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let purchasetaxcode = $('input[name=optradioP]:checked').val() || '';
        let salestaxcode = $('input[name=optradioS]:checked').val() || '';

        Session.setPersistent('ERPTaxCodePurchaseInc', purchasetaxcode || '');
        Session.setPersistent('ERPTaxCodeSalesInc', salestaxcode || '');
        getVS1Data('vscloudlogininfo').then(function (dataObject) {
            if (dataObject.length == 0) {
                swal({
                    title: 'Default Tax Rate Successfully Changed',
                    text: '',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        Meteor._reload.reload();
                    } else {
                        Meteor._reload.reload();
                    }
                });
            } else {
                let loginDataArray = [];
                if (dataObject[0].EmployeeEmail === localStorage.getItem('mySession')) {
                    loginDataArray = dataObject[0].data;

                    loginDataArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc = purchasetaxcode;
                    loginDataArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc = salestaxcode;
                    addLoginData(loginDataArray).then(function (datareturnCheck) {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Default Tax Rate Successfully Changed',
                            text: '',
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            $('.setup-step').css('display', 'none');
                            $(`.setup-stepper li:nth-child(3)`).addClass('current');
                            $(`.setup-stepper li:nth-child(2)`).removeClass('current');
                            $(`.setup-stepper li:nth-child(2)`).addClass('completed');
                            $('.setup-step-3').css('display', 'block');
                            let confirmedSteps = localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || '';
                            localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", confirmedSteps + '2,');
                            localStorage.setItem("VS1Cloud_SETUP_STEP", 3);
                        });

                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Default Tax Rate Successfully Changed',
                            text: '',
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            $('.setup-step').css('display', 'none');
                            $(`.setup-stepper li:nth-child(3)`).addClass('current');
                            $(`.setup-stepper li:nth-child(2)`).removeClass('current');
                            $(`.setup-stepper li:nth-child(2)`).addClass('completed');
                            $('.setup-step-3').css('display', 'block');
                            let confirmedSteps = localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || '';
                            localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", confirmedSteps + '2,');
                            localStorage.setItem("VS1Cloud_SETUP_STEP", 3);
                        });
                    });

                } else {

                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Default Tax Rate Successfully Changed',
                        text: '',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        $('.setup-step').css('display', 'none');
                        $(`.setup-stepper li:nth-child(3)`).addClass('current');
                        $(`.setup-stepper li:nth-child(2)`).removeClass('current');
                        $(`.setup-stepper li:nth-child(2)`).addClass('completed');
                        $('.setup-step-3').css('display', 'block');
                        let confirmedSteps = localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || '';
                        localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", confirmedSteps + '2,');
                        localStorage.setItem("VS1Cloud_SETUP_STEP", 3);
                    });
                }
            }
        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Default Tax Rate Successfully Changed',
                text: '',
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
                $('.setup-step').css('display', 'none');
                $(`.setup-stepper li:nth-child(3)`).addClass('current');
                $(`.setup-stepper li:nth-child(2)`).removeClass('current');
                $(`.setup-stepper li:nth-child(2)`).addClass('completed');
                $('.setup-step-3').css('display', 'block');
                let confirmedSteps = localStorage.getItem("VS1Cloud_SETUP_CONFIRMED_STEPS") || '';
                localStorage.setItem("VS1Cloud_SETUP_CONFIRMED_STEPS", confirmedSteps + '2,');
                localStorage.setItem("VS1Cloud_SETUP_STEP", 3);
            });
        });

    },
    'keydown #edtTaxRate': function (event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {} else {
            event.preventDefault();
        }
    },
    'click .btnSaveTaxRate': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        let taxtID = $('#edtTaxID').val();
        let taxName = $('#edtTaxName').val();
        let taxDesc = $('#edtTaxDesc').val();
        let taxRate = parseFloat($('#edtTaxRate').val() / 100);
        let objDetails = '';
        if (taxName === '') {
            Bert.alert('<strong>WARNING:</strong> Tax Rate cannot be blank!', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
        }

        if (taxtID == "") {
            taxRateService.checkTaxRateByName(taxName).then(function (data) {
                taxtID = data.ttaxcode[0].Id;
                objDetails = {
                    type: "TTaxcode",
                    fields: {
                        ID: parseInt(taxtID),
                        Active: true,
                        // CodeName: taxName,
                        Description: taxDesc,
                        Rate: taxRate,
                        PublishOnVS1: true
                    }
                };
                taxRateService.saveTaxRate(objDetails).then(function (objDetails) {
                    sideBarService.getTaxRateVS1().then(function (dataReload) {
                        addVS1Data('TTaxcodeVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                            Meteor._reload.reload();
                        }).catch(function (err) {
                            Meteor._reload.reload();
                        });
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
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
            }).catch(function (err) {
                objDetails = {
                    type: "TTaxcode",
                    fields: {
                        // Id: taxCodeId,
                        Active: true,
                        CodeName: taxName,
                        Description: taxDesc,
                        Rate: taxRate,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTaxRate(objDetails).then(function (objDetails) {
                    sideBarService.getTaxRateVS1().then(function (dataReload) {
                        addVS1Data('TTaxcodeVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                            Meteor._reload.reload();
                        }).catch(function (err) {
                            Meteor._reload.reload();
                        });
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
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
            });

        } else {
            objDetails = {
                type: "TTaxcode",
                fields: {
                    ID: parseInt(taxtID),
                    Active: true,
                    CodeName: taxName,
                    Description: taxDesc,
                    Rate: taxRate,
                    PublishOnVS1: true
                }
            };
            taxRateService.saveTaxRate(objDetails).then(function (objDetails) {
                sideBarService.getTaxRateVS1().then(function (dataReload) {
                    addVS1Data('TTaxcodeVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                        Meteor._reload.reload();
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
                    Meteor._reload.reload();
                });
            }).catch(function (err) {
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
        }
    },
    'click .btnAddTaxRate': function () {
        $('#add-tax-title').text('Add New Tax Rate');
        $('#edtTaxID').val('');
        $('#edtTaxName').val('');
        $('#edtTaxName').prop('readonly', false);
        $('#edtTaxRate').val('');
        $('#edtTaxDesc').val('');
    },
    'click .btnDeleteTaxRate': function () {
        let taxRateService = new TaxRateService();
        let taxCodeId = $('#selectDeleteLineID').val();


        let objDetails = {
            type: "TTaxcode",
            fields: {
                Id: parseInt(taxCodeId),
                Active: false
            }
        };

        taxRateService.saveTaxRate(objDetails).then(function (objDetails) {
            sideBarService.getTaxRateVS1().then(function (dataReload) {
                addVS1Data('TTaxcodeVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                }).catch(function (err) {
                    Meteor._reload.reload();
                });
            }).catch(function (err) {
                Meteor._reload.reload();
            });
        }).catch(function (err) {
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

    },

    // TODO: Step 3
    // Payment method settings
    'click .feeOnTopInput': function (event) {
        if ($(event.target).is(':checked')) {
            $('.feeInPriceInput').attr('checked', false);
        }
    },
    'click .feeInPriceInput': function (event) {
        if ($(event.target).is(':checked')) {
            $('.feeOnTopInput').attr('checked', false);
        }
    },
    'click .chkDatatablePaymentMethod': function (event) {
        var columns = $('#paymentmethodList th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumnPaymentMethod").text();

        $.each(columns, function (i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetPaymentMethodTable': function (event) {
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
                    PrefName: 'paymentmethodList'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .savePaymentMethodTable': function (event) {
        let lineItems = [];
        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumnPaymentMethod").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumnPaymentMethod").attr("valueupdate") || '';
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
                    PrefName: 'paymentmethodList'
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
                            PrefName: 'paymentmethodList',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#btnOpenSettingsPaymentMethod').modal('toggle');
                        } else {
                            $('#btnOpenSettingsPaymentMethod').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'paymentmethodList',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#btnOpenSettingsPaymentMethod').modal('toggle');
                        } else {
                            $('#btnOpenSettingsPaymentMethod').modal('toggle');

                        }
                    });
                }
            }
        }

    },
    'blur .divcolumnPaymentMethod': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#paymentmethodList').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRangePaymentMethod': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumnPaymentMethod").text();
        var datable = $('#paymentmethodList th');
        $.each(datable, function (i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettingsPaymentMethod': function (event) {
        let templateObject = Template.instance();
        var columns = $('#paymentmethodList th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");

            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
    },
    'click .btnRefreshPaymentMethod': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getPaymentMethodDataVS1().then(function (dataReload) {
            addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function (datareturn) {
                location.reload(true);
            }).catch(function (err) {
                location.reload(true);
            });
        }).catch(function (err) {
            location.reload(true);
        });
    },
    'click .btnDeletePaymentMethod': function () {
        let taxRateService = new TaxRateService();
        let paymentMethodId = $('#selectDeleteLineID').val();


        let objDetails = {
            type: "TPaymentMethod",
            fields: {
                Id: parseInt(paymentMethodId),
                Active: false
            }
        };

        taxRateService.savePaymentMethod(objDetails).then(function (objDetails) {
            sideBarService.getPaymentMethodDataVS1().then(function (dataReload) {
                addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function (datareturn) {
                    location.reload(true);
                }).catch(function (err) {
                    location.reload(true);
                });
            }).catch(function (err) {
                location.reload(true);
            });
        }).catch(function (err) {
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

    },
    'click .btnSavePaymentMethod': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        let paymentMethodID = $('#edtPaymentMethodID').val();
        //let headerDept = $('#sltDepartment').val();
        let paymentName = $('#edtPaymentMethodName').val();
        let isCreditCard = false;
        let siteCode = $('#edtSiteCode').val();

        if ($('#isformcreditcard').is(':checked')) {
            isCreditCard = true;
        } else {
            isCreditCard = false;
        }

        let objDetails = '';
        if (paymentName === '') {
            $('.fullScreenSpin').css('display', 'none');
            Bert.alert('<strong>WARNING:</strong> Payment Method Name cannot be blank!', 'warning');
            e.preventDefault();
        }

        if (paymentMethodID == "") {
            taxRateService.checkPaymentMethodByName(paymentName).then(function (data) {
                paymentMethodID = data.tpaymentmethod[0].Id;
                objDetails = {
                    type: "TPaymentMethod",
                    fields: {
                        ID: parseInt(paymentMethodID),
                        Active: true,
                        //PaymentMethodName: paymentName,
                        IsCreditCard: isCreditCard,
                        PublishOnVS1: true
                    }
                };

                taxRateService.savePaymentMethod(objDetails).then(function (objDetails) {
                    sideBarService.getPaymentMethodDataVS1().then(function (dataReload) {
                        addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function (datareturn) {
                            location.reload(true);
                        }).catch(function (err) {
                            location.reload(true);
                        });
                    }).catch(function (err) {
                        location.reload(true);
                    });
                }).catch(function (err) {
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
            }).catch(function (err) {
                objDetails = {
                    type: "TPaymentMethod",
                    fields: {
                        Active: true,
                        PaymentMethodName: paymentName,
                        IsCreditCard: isCreditCard,
                        PublishOnVS1: true
                    }
                };

                taxRateService.savePaymentMethod(objDetails).then(function (objDetails) {
                    sideBarService.getPaymentMethodDataVS1().then(function (dataReload) {
                        addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function (datareturn) {
                            location.reload(true);
                        }).catch(function (err) {
                            location.reload(true);
                        });
                    }).catch(function (err) {
                        location.reload(true);
                    });
                }).catch(function (err) {
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
            });

        } else {
            objDetails = {
                type: "TPaymentMethod",
                fields: {
                    ID: parseInt(paymentMethodID),
                    Active: true,
                    PaymentMethodName: paymentName,
                    IsCreditCard: isCreditCard,
                    PublishOnVS1: true
                }
            };

            taxRateService.savePaymentMethod(objDetails).then(function (objDetails) {
                sideBarService.getPaymentMethodDataVS1().then(function (dataReload) {
                    addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function (datareturn) {
                        location.reload(true);
                    }).catch(function (err) {
                        location.reload(true);
                    });
                }).catch(function (err) {
                    location.reload(true);
                });
            }).catch(function (err) {
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
        }
    },
    'click .btnAddPaymentMethod': function () {
        let templateObject = Template.instance();
        $('#add-paymentmethod-title').text('Add New Payment Method');
        $('#edtPaymentMethodID').val('');
        $('#edtPaymentMethodName').val('');
        templateObject.includeCreditCard.set(false);
    },


    // TODO: Step 4
    // Term settings
    'click .chkDatatableTerm': function (event) {
        var columns = $('#termsList th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumnTerm").text();
        $.each(columns, function (i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTermTable': function (event) {
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
                    PrefName: 'termsList'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTermTable': function (event) {
        let lineItems = [];
        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumnTerm").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumnTerm").attr("valueupdate") || '';
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
                    PrefName: 'termsList'
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
                            PrefName: 'termsList',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#btnOpenSettingsTerm').modal('toggle');
                        } else {
                            $('#btnOpenSettingsTerm').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'termsList',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#btnOpenSettingsTerm').modal('toggle');
                        } else {
                            $('#btnOpenSettingsTerm').modal('toggle');

                        }
                    });
                }
            }
        }

    },
    'blur .divcolumnTerm': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#termsList').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRangeTerm': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumnTerm").text();
        var datable = $('#termsList th');
        $.each(datable, function (i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettingsTerm': function (event) {
        let templateObject = Template.instance();
        var columns = $('#termsList th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");

            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.termtableheaderrecords.set(tableHeaderList);
    },
    'click .btnRefreshTerm': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getTermsVS1().then(function (dataReload) {
            addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                location.reload(true);
            }).catch(function (err) {
                location.reload(true);
            });
        }).catch(function (err) {
            location.reload(true);
        });
    },
    'click .btnDeleteTerms': function () {
        let taxRateService = new TaxRateService();
        let termsId = $('#selectDeleteLineID').val();


        let objDetails = {
            type: "TTerms",
            fields: {
                Id: parseInt(termsId),
                Active: false
            }
        };

        taxRateService.saveTerms(objDetails).then(function (objDetails) {
            sideBarService.getTermsVS1().then(function (dataReload) {
                addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                    Meteor._reload.reload();
                }).catch(function (err) {
                    Meteor._reload.reload();
                });
            }).catch(function (err) {
                Meteor._reload.reload();
            });
        }).catch(function (err) {
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

    },
    'click .btnSaveTerms': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        let termsID = $('#edtTermsID').val();
        let termsName = $('#edtName').val();
        let description = $('#edtDesc').val();
        let termdays = $('#edtDays').val();

        let isDays = false;
        let is30days = false;
        let isEOM = false;
        let isEOMPlus = false;
        let days = 0;

        let isSalesdefault = false;
        let isPurchasedefault = false;
        if (termdays.replace(/\s/g, '') != "") {
            isDays = true;
        } else {
            isDays = false;
        }

        if ($('#isEOM').is(':checked')) {
            isEOM = true;
        } else {
            isEOM = false;
        }

        if ($('#isEOMPlus').is(':checked')) {
            isEOMPlus = true;
        } else {
            isEOMPlus = false;
        }

        if ($('#chkCustomerDef').is(':checked')) {
            isSalesdefault = true;
        } else {
            isSalesdefault = false;
        }

        if ($('#chkSupplierDef').is(':checked')) {
            isPurchasedefault = true;
        } else {
            isPurchasedefault = false;
        }

        let objDetails = '';
        if (termsName === '') {
            $('.fullScreenSpin').css('display', 'none');
            Bert.alert('<strong>WARNING:</strong> Term Name cannot be blank!', 'warning');
            e.preventDefault();
        }

        if (termsID == "") {
            taxRateService.checkTermByName(termsName).then(function (data) {
                termsID = data.tterms[0].Id;
                objDetails = {
                    type: "TTerms",
                    fields: {
                        ID: parseInt(termsID),
                        Active: true,
                        //TermsName: termsName,
                        Description: description,
                        IsDays: isDays,
                        IsEOM: isEOM,
                        IsEOMPlus: isEOMPlus,
                        isPurchasedefault: isPurchasedefault,
                        isSalesdefault: isSalesdefault,
                        Days: termdays || 0,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTerms(objDetails).then(function (objDetails) {
                    sideBarService.getTermsVS1().then(function (dataReload) {
                        addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                            Meteor._reload.reload();
                        }).catch(function (err) {
                            Meteor._reload.reload();
                        });
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
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
            }).catch(function (err) {
                objDetails = {
                    type: "TTerms",
                    fields: {
                        Active: true,
                        TermsName: termsName,
                        Description: description,
                        IsDays: isDays,
                        IsEOM: isEOM,
                        IsEOMPlus: isEOMPlus,
                        Days: termdays || 0,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTerms(objDetails).then(function (objDetails) {
                    sideBarService.getTermsVS1().then(function (dataReload) {
                        addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                            Meteor._reload.reload();
                        }).catch(function (err) {
                            Meteor._reload.reload();
                        });
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
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
            });

        } else {
            objDetails = {
                type: "TTerms",
                fields: {
                    ID: parseInt(termsID),
                    TermsName: termsName,
                    Description: description,
                    IsDays: isDays,
                    IsEOM: isEOM,
                    isPurchasedefault: isPurchasedefault,
                    isSalesdefault: isSalesdefault,
                    IsEOMPlus: isEOMPlus,
                    Days: termdays || 0,
                    PublishOnVS1: true
                }
            };

            taxRateService.saveTerms(objDetails).then(function (objDetails) {
                sideBarService.getTermsVS1().then(function (dataReload) {
                    addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                        Meteor._reload.reload();
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
                    Meteor._reload.reload();
                });
            }).catch(function (err) {
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
        }
    },
    'click .btnAddTerms': function () {
        let templateObject = Template.instance();
        $('#add-terms-title').text('Add New Term ');
        $('#edtTermsID').val('');
        $('#edtName').val('');
        $('#edtName').prop('readonly', false);
        $('#edtDesc').val('');
        $('#edtDays').val('');

        templateObject.include7Days.set(false);
        templateObject.includeCOD.set(false);
        templateObject.include30Days.set(false);
        templateObject.includeEOM.set(false);
        templateObject.includeEOMPlus.set(false);
    },
    'click .chkTerms': function (event) {
        var $box = $(event.target);

        if ($box.is(":checked")) {
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    },
    'keydown #edtDays': function (event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {} else {
            event.preventDefault();
        }
    },


    // TODO: Step 5
    'click #btnNewEmployee': function (event) {
        FlowRouter.go('/employeescard');
    },
    'click .btnAddVS1User': function (event) {
        swal({
            title: 'Is this an existing Employee?',
            text: '',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                swal("Please select the employee from the list below.", "", "info");
                $('#employeeListModal').modal('toggle');
                // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            } else if (result.dismiss === 'cancel') {
                FlowRouter.go('/employeescard?addvs1user=true');
            }
        })
    },
    'click .chkDatatableEmployee': function (event) {
        var columns = $('#tblEmployeelist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumnEmployee").text();

        $.each(columns, function (i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'keyup #tblEmployeelist_filter input': function (event) {
        if ($(event.target).val() != '') {
            $(".btnRefreshEmployees").addClass('btnSearchAlert');
        } else {
            $(".btnRefreshEmployees").removeClass('btnSearchAlert');
        }
        if (event.keyCode == 13) {
            $(".btnRefreshEmployees").trigger("click");
        }
    },
    'click .btnRefreshEmployees': function (event) {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let tableProductList;
        const dataTableList = [];
        var splashArrayInvoiceList = new Array();
        const lineExtaSellItems = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        let dataSearchName = $('#tblEmployeelist_filter input').val();
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getNewEmployeeByNameOrID(dataSearchName).then(function (data) {
                $(".btnRefreshEmployees").removeClass('btnSearchAlert');
                let lineItems = [];
                let lineItemObj = {};
                if (data.temployee.length > 0) {
                    for (let i = 0; i < data.temployee.length; i++) {
                        var dataList = {
                            id: data.temployee[i].fields.ID || '',
                            employeeno: data.temployee[i].fields.EmployeeNo || '',
                            employeename: data.temployee[i].fields.EmployeeName || '',
                            firstname: data.temployee[i].fields.FirstName || '',
                            lastname: data.temployee[i].fields.LastName || '',
                            phone: data.temployee[i].fields.Phone || '',
                            mobile: data.temployee[i].fields.Mobile || '',
                            email: data.temployee[i].fields.Email || '',
                            address: data.temployee[i].fields.Street || '',
                            country: data.temployee[i].fields.Country || '',
                            department: data.temployee[i].fields.DefaultClassName || '',
                            custFld1: data.temployee[i].fields.CustFld1 || '',
                            custFld2: data.temployee[i].fields.CustFld2 || '',
                            custFld3: data.temployee[i].fields.CustFld3 || '',
                            custFld4: data.temployee[i].fields.CustFld4 || ''
                        };

                        if (data.temployee[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                            dataTableList.push(dataList);
                        }
                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    let item = templateObject.datatablerecords.get();
                    $('.fullScreenSpin').css('display', 'none');
                    if (dataTableList) {
                        var datatable = $('#tblEmployeelist').DataTable();
                        $("#tblEmployeelist > tbody").empty();
                        for (let x = 0; x < item.length; x++) {
                            $("#tblEmployeelist > tbody").append(
                                ' <tr class="dnd-moved" id="' + item[x].id + '" style="cursor: pointer;">' +
                                '<td contenteditable="false" class="colEmployeeID">' + item[x].id + '</td>' +
                                '<td contenteditable="false" class="colEmployeeName" >' + item[x].employeename + '</td>' +
                                '<td contenteditable="false" class="colFirstName">' + item[x].firstname + '</td>' +
                                '<td contenteditable="false" class="colLastName" >' + item[x].lastname + '</td>' +
                                '<td contenteditable="false" class="colPhone">' + item[x].phone + '</td>' +
                                '<td contenteditable="false" class="colMobile">' + item[x].mobile + '</td>' +
                                '<td contenteditable="false" class="colEmail">' + item[x].email + '</td>' +
                                '<td contenteditable="false" class="colDepartment">' + item[x].department + '</td>' +
                                '<td contenteditable="false" class="colCountry hiddenColumn">' + item[x].country + '</td>' +
                                '<td contenteditable="false" class="colCustFld1 hiddenColumn">' + item[x].custFld1 + '</td>' +
                                '<td contenteditable="false" class="colCustFld2 hiddenColumn">' + item[x].custFld2 + '</td>' +
                                '<td contenteditable="false" class="colAddress">' + item[x].address + '</td>' +
                                '</tr>');

                        }
                        $('.dataTables_info').html('Showing 1 to ' + data.temployee.length + ' of ' + data.temployee.length + ' entries');

                    }
                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Question',
                        text: "Employee does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            FlowRouter.go('/employeescard');
                        } else if (result.dismiss === 'cancel') {
                            //$('#productListModal').modal('toggle');
                        }
                    });
                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            $(".btnRefreshEmployee").trigger("click");
        }
    },
    'click .resetEmployeeTable': function (event) {
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
                    PrefName: 'tblEmployeelist'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveEmployeeTable': function (event) {
        let lineItems = [];
        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumnEmployee").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumnEmployee").attr("valueupdate") || '';
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
                    PrefName: 'tblEmployeelist'
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
                            PrefName: 'tblEmployeelist',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#btnOpenSettingsEmployee').modal('toggle');
                        } else {
                            $('#btnOpenSettingsEmployee').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'tblEmployeelist',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#btnOpenSettingsEmployee').modal('toggle');
                        } else {
                            $('#btnOpenSettingsEmployee').modal('toggle');

                        }
                    });
                }
            }
        }
        $('#btnOpenSettingsEmployee').modal('toggle');
    },
    'blur .divcolumnEmployee': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblEmployeelist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRangeEmployee': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumnEmployee").text();
        var datable = $('#tblEmployeelist th');
        $.each(datable, function (i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettingsEmployee': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblEmployeelist th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");
            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.employeetableheaderrecords.set(tableHeaderList);
    },
    'click .exportbtnEmployee': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblEmployeelist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .exportbtnExcelEmployee': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblEmployeelist_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .btnRefreshEmployee': function () {

        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        sideBarService.getAllAppointmentPredList().then(function (data) {
            addVS1Data('TAppointmentPreferences', JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function (err) {

        });
        sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
            addVS1Data('TEmployee', JSON.stringify(data)).then(function (datareturn) {
                window.open('/employeelist', '_self');
            }).catch(function (err) {
                window.open('/employeelist', '_self');
            });
        }).catch(function (err) {
            window.open('/employeelist', '_self');
        });
    },
    'click .printConfirmEmployee': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblEmployeelist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .templateDownload-employee': function () {
        let utilityService = new UtilityService();
        let rows = [];
        const filename = 'SampleEmployee' + '.csv';
        rows[0] = ['First Name', 'Last Name', 'Phone', 'Mobile', 'Email', 'Skype', 'Street', 'City/Suburb', 'State', 'Post Code', 'Country', 'Gender'];
        rows[1] = ['John', 'Smith', '9995551213', '9995551213', 'johnsmith@email.com', 'johnsmith', '123 Main Street', 'Brooklyn', 'New York', '1234', 'United States', 'M'];
        rows[1] = ['Jane', 'Smith', '9995551213', '9995551213', 'janesmith@email.com', 'janesmith', '123 Main Street', 'Brooklyn', 'New York', '1234', 'United States', 'F'];
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .templateDownloadXLSX-employee': function (e) {
        e.preventDefault(); //stop the browser from following
        window.location.href = 'sample_imports/SampleEmployee.xlsx';
    },
    'click .btnUploadFile-employee': function (event) {
        $('#attachment-upload-employee').val('');
        $('.file-name').text('');
        $('#attachment-upload-employee').trigger('click');
    },
    'change #attachment-upload-employee': function (e) {
        let templateObj = Template.instance();
        var filename = $('#attachment-upload-employee')[0].files[0]['name'];
        var fileExtension = filename.split('.').pop().toLowerCase();
        var validExtensions = ["csv", "txt", "xlsx"];
        var validCSVExtensions = ["csv", "txt"];
        var validExcelExtensions = ["xlsx", "xls"];

        if (validExtensions.indexOf(fileExtension) == -1) {
            swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
            $('.file-name').text('');
            $(".btnImportEmployee").Attr("disabled");
        } else if (validCSVExtensions.indexOf(fileExtension) != -1) {

            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            templateObj.selectedFile.set(selectedFile);
            if ($('.file-name').text() != "") {
                $(".btnImportEmployee").removeAttr("disabled");
            } else {
                $(".btnImportEmployee").Attr("disabled");
            }
        } else if (fileExtension == 'xlsx') {
            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            var oFileIn;
            var oFile = selectedFile;
            var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();

            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, {
                    type: 'array'
                });

                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1
                    });
                    var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length) result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.
            };
            reader.readAsArrayBuffer(oFile);

            if ($('.file-name').text() != "") {
                $(".btnImportEmployee").removeAttr("disabled");
            } else {
                $(".btnImportEmployee").Attr("disabled");
            }
        }
    },
    'click .btnImportEmployee': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let objDetails;
        var saledateTime = new Date();
        //let empStartDate = new Date().format("YYYY-MM-DD");
        var empStartDate = moment(saledateTime).format("YYYY-MM-DD");
        Papa.parse(templateObject.selectedFile.get(), {
            complete: function (results) {

                if (results.data.length > 0) {
                    if ((results.data[0][0] == "First Name") &&
                        (results.data[0][1] == "Last Name") && (results.data[0][2] == "Phone") &&
                        (results.data[0][3] == "Mobile") && (results.data[0][4] == "Email") &&
                        (results.data[0][5] == "Skype") && (results.data[0][6] == "Street") &&
                        ((results.data[0][7] == "Street2") || (results.data[0][7] == "City/Suburb")) && (results.data[0][8] == "State") &&
                        (results.data[0][9] == "Post Code") && (results.data[0][10] == "Country") &&
                        (results.data[0][11] == "Gender")) {

                        let dataLength = results.data.length * 500;
                        setTimeout(function () {
                            // $('#importModal').modal('toggle');
                            //Meteor._reload.reload();
                            window.open('/employeelist?success=true', '_self');
                        }, parseInt(dataLength));

                        for (let i = 0; i < results.data.length - 1; i++) {
                            objDetails = {
                                type: "TEmployee",
                                fields: {
                                    FirstName: results.data[i + 1][0],
                                    LastName: results.data[i + 1][1],
                                    Phone: results.data[i + 1][2],
                                    Mobile: results.data[i + 1][3],
                                    DateStarted: empStartDate,
                                    DOB: empStartDate,
                                    Sex: results.data[i + 1][11] || "F",
                                    Email: results.data[i + 1][4],
                                    SkypeName: results.data[i + 1][5],
                                    Street: results.data[i + 1][6],
                                    Street2: results.data[i + 1][7],
                                    Suburb: results.data[i + 1][7],
                                    State: results.data[i + 1][8],
                                    PostCode: results.data[i + 1][9],
                                    Country: results.data[i + 1][10]
                                }
                            };
                            if (results.data[i + 1][1]) {
                                if (results.data[i + 1][1] !== "") {
                                    contactService.saveEmployee(objDetails).then(function (data) {
                                        ///$('.fullScreenSpin').css('display','none');
                                        //Meteor._reload.reload();
                                    }).catch(function (err) {
                                        //$('.fullScreenSpin').css('display','none');
                                        swal({
                                            title: 'Oooops...',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {}
                                        });
                                    });
                                }
                            }
                        }
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                    }
                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }
            }
        });
    },


    // TODO: Step 6
    'click .btnAddNewAccount': function (event) {
        $('#add-account-title').text('Add New Account');
        $('#edtAccountID').val('');
        $('#sltAccountType').val('');
        $('#sltAccountType').removeAttr('readonly', true);
        $('#sltAccountType').removeAttr('disabled', 'disabled');
        $('#edtAccountName').val('');
        $('#edtAccountName').attr('readonly', false);
        $('#edtAccountNo').val('');
        $('#sltTaxCode').val('NT' || '');
        $('#txaAccountDescription').val('');
        $('#edtBankAccountName').val('');
        $('#edtBSB').val('');
        $('#edtBankAccountNo').val('');
        $('#routingNo').val('');
        $('#edtBankName').val('');
        $('#swiftCode').val('');
        $('.showOnTransactions').prop('checked', false);
        $('.isBankAccount').addClass('isNotBankAccount');
        $('.isCreditAccount').addClass('isNotCreditAccount');
    },
    'click .btnRefreshAccount': function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        const customerList = [];
        const clientList = [];
        let salesOrderTable;
        var splashArray = [];
        var splashArrayAccountList = [];
        let utilityService = new UtilityService();
        const dataTableList = [];
        const tableHeaderList = [];
        let sideBarService = new SideBarService();
        let accountService = new AccountService();
        let dataSearchName = $('#tblAccount_filter input').val();
        var currentLoc = FlowRouter.current().route.path;
        if (dataSearchName.replace(/\s/g, '') !== '') {
            sideBarService.getAllAccountDataVS1ByName(dataSearchName).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                if (data.taccountvs1.length > 0) {
                    for (let i = 0; i < data.taccountvs1.length; i++) {
                        var dataList = [
                            data.taccountvs1[i].fields.AccountName || '-',
                            data.taccountvs1[i].fields.Description || '',
                            data.taccountvs1[i].fields.AccountNumber || '',
                            data.taccountvs1[i].fields.AccountTypeName || '',
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.taccountvs1[i].fields.Balance * 100) / 100) || 0,
                            data.taccountvs1[i].fields.TaxCode || '',
                            data.taccountvs1[i].fields.ID || ''
                        ];
                        if (currentLoc === "/billcard") {
                            if ((data.taccountvs1[i].fields.AccountTypeName !== "AP") && (data.taccountvs1[i].fields.AccountTypeName !== "AR") && (data.taccountvs1[i].fields.AccountTypeName !== "CCARD") && (data.taccountvs1[i].fields.AccountTypeName !== "BANK")) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else if (currentLoc === "/journalentrycard") {
                            if ((data.taccountvs1[i].fields.AccountTypeName !== "AP") && (data.taccountvs1[i].fields.AccountTypeName !== "AR")) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else if (currentLoc === "/chequecard") {
                            if ((data.taccountvs1[i].fields.AccountTypeName === "EQUITY") || (data.taccountvs1[i].fields.AccountTypeName === "BANK") || (data.taccountvs1[i].fields.AccountTypeName === "CCARD") || (data.taccountvs1[i].fields.AccountTypeName === "COGS") ||
                                (data.taccountvs1[i].fields.AccountTypeName === "EXP") || (data.taccountvs1[i].fields.AccountTypeName === "FIXASSET") || (data.taccountvs1[i].fields.AccountTypeName === "INC") || (data.taccountvs1[i].fields.AccountTypeName === "LTLIAB") ||
                                (data.taccountvs1[i].fields.AccountTypeName === "OASSET") || (data.taccountvs1[i].fields.AccountTypeName === "OCASSET") || (data.taccountvs1[i].fields.AccountTypeName === "OCLIAB") || (data.taccountvs1[i].fields.AccountTypeName === "EXEXP") ||
                                (data.taccountvs1[i].fields.AccountTypeName === "EXINC")) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else if (currentLoc === "/paymentcard" || currentLoc === "/supplierpaymentcard") {
                            if ((data.taccountvs1[i].fields.AccountTypeName === "BANK") || (data.taccountvs1[i].fields.AccountTypeName === "CCARD") ||
                                (data.taccountvs1[i].fields.AccountTypeName === "OCLIAB")
                            ) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else if (currentLoc === "/bankrecon" || currentLoc === "/newbankrecon") {
                            if ((data.taccountvs1[i].fields.AccountTypeName === "BANK") || (data.taccountvs1[i].fields.AccountTypeName === "CCARD")) {
                                splashArrayAccountList.push(dataList);
                            }
                        } else {
                            splashArrayAccountList.push(dataList);
                        }

                    }
                    var datatable = $('#tblAccountlist').DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayAccountList);
                    datatable.draw(false);

                    $('.fullScreenSpin').css('display', 'none');
                } else {

                    $('.fullScreenSpin').css('display', 'none');
                    $('#accountListModal').modal('toggle');
                    swal({
                        title: 'Question',
                        text: "Account does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            $('#addAccountModal').modal('toggle');
                            $('#edtAccountName').val(dataSearchName);
                        } else if (result.dismiss === 'cancel') {
                            $('#accountListModal').modal('toggle');
                        }
                    });

                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            sideBarService.getAccountListVS1().then(function (data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.taccountvs1.length; i++) {
                    var dataList = [
                        data.taccountvs1[i].fields.AccountName || '-',
                        data.taccountvs1[i].fields.Description || '',
                        data.taccountvs1[i].fields.AccountNumber || '',
                        data.taccountvs1[i].fields.AccountTypeName || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.taccountvs1[i].fields.Balance * 100) / 100),
                        data.taccountvs1[i].fields.TaxCode || '',
                        data.taccountvs1[i].fields.ID || ''
                    ];

                    splashArrayAccountList.push(dataList);
                }
                var datatable = $('#tblAccountlist').DataTable();
                datatable.clear();
                datatable.rows.add(splashArrayAccountList);
                datatable.draw(false);

                $('.fullScreenSpin').css('display', 'none');
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'keyup #tblAccount_filter input': function (event) {
        if (event.keyCode === 13) {
            $(".btnRefreshAccount").trigger("click");
        }
    },
    'change #sltStatus': function () {
        let status = $('#sltStatus').find(":selected").val();
        if (status === "newstatus") {
            $('#statusModal').modal();
        }
    },
    'click .btnSaveStatus': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let clientService = new SalesBoardService();
        let status = $('#status').val();
        let leadData = {
            type: 'TLeadStatusType',
            fields: {
                TypeName: status,
                KeyValue: status
            }
        };

        if (status !== "") {
            clientService.saveLeadStatus(leadData).then(function (objDetails) {
                sideBarService.getAllLeadStatus().then(function (dataUpdate) {
                    addVS1Data('TLeadStatusType', JSON.stringify(dataUpdate)).then(function (datareturn) {
                        $('.fullScreenSpin').css('display', 'none');
                        let id = $('.printID').attr("id");
                        if (id !== "") {
                            window.open("/creditcard?id=" + id);
                        } else {
                            window.open("/creditcard");
                        }
                    }).catch(function (err) {

                    });
                }).catch(function (err) {

                    window.open('/creditcard', '_self');
                });
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');

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
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Please Enter Status',
                text: "Status field cannot be empty",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {} else if (result.dismiss === 'cancel') {

                }
            });
        }
    },
    'blur .lineMemo': function (event) {
        var targetID = $(event.target).closest('tr').attr('id');

        $('#' + targetID + " #lineMemo").text($('#' + targetID + " .lineMemo").text());
    },
    'blur .colAmount': function (event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        var targetID = $(event.target).closest('tr').attr('id');
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));


        }
        let $tblrows = $("#tblCreditLine tbody tr");

        let $printrows = $(".credit_print tbody tr");

        if ($('.printID').attr('id') !== undefined || $('.printID').attr('id') !== "") {
            $('#' + targetID + " #lineAmount").text($('#' + targetID + " .colAmount").val());
            $('#' + targetID + " #lineTaxCode").text($('#' + targetID + " .lineTaxCode").text());
        }

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        $tblrows.each(function (index) {
            var $tblrow = $(this);
            var amount = $tblrow.find(".colAmount").val() || "0";
            var taxcode = $tblrow.find(".lineTaxCode").text() || 0;
            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename === taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }


            var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
            if (!isNaN(subTotal)) {
                $tblrow.find('.colAmount').val(utilityService.modifynegativeCurrencyFormat(subTotal));
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
                document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

            }
        });

        if ($('.printID').attr('id') !== undefined || $('.printID').attr('id') !== "") {
            $printrows.each(function (index) {
                var $printrows = $(this);
                var amount = $printrows.find("#lineAmount").text() || "0";
                var taxcode = $printrows.find("#lineTaxCode").text() || 0;

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename === taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100 || 0;
                        }
                    }
                }


                var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))

                if (!isNaN(subTotal)) {
                    $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                }
                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                    //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                }
            });
        }

    },
    'click #btnCustomFileds': function (event) {
        var x = document.getElementById("divCustomFields");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    'click .lineAccountName': function (event) {
        $('#tblCreditLine tbody tr .lineAccountName').attr("data-toggle", "modal");
        $('#tblCreditLine tbody tr .lineAccountName').attr("data-target", "#accountListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);

        setTimeout(function () {
            $('#tblAccount_filter .form-control-sm').focus();
        }, 500);
    },
    'click #accountListModal #refreshpagelist': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        Meteor._reload.reload();
        templateObject.getAllAccountss();

    },
    'click .lineTaxRate': function (event) {
        $('#tblCreditLine tbody tr .lineTaxRate').attr("data-toggle", "modal");
        $('#tblCreditLine tbody tr .lineTaxRate').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .lineTaxCode': function (event) {
        $('#tblCreditLine tbody tr .lineTaxCode').attr("data-toggle", "modal");
        $('#tblCreditLine tbody tr .lineTaxCode').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .printConfirmAccount': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierName').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
        $('#printcomment').html($('#txaComment').val().replace(/[\r\n]/g, "<br />"));
        var ponumber = $('#ponumber').val() || '.';
        $('.po').text(ponumber);
        exportSalesToPdf();
    },
    'keydown .lineQty, keydown .lineUnitPrice, keydown .lineAmount': function (event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||

            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||

            (event.keyCode >= 35 && event.keyCode <= 40)) {

            return;
        }

        if (event.shiftKey === true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode === 8 || event.keyCode === 9 ||
            event.keyCode === 37 || event.keyCode === 39 ||
            event.keyCode === 46 || event.keyCode === 190 || event.keyCode === 189 || event.keyCode === 109) {} else {
            event.preventDefault();
        }
    },
    'click .btnSaveAccount': function (event) {
        let templateObject = Template.instance();
        let suppliername = $('#edtSupplierName');
        let purchaseService = new PurchaseBoardService();
        if (suppliername.val() === '') {
            swal('Supplier has not been selected!', '', 'warning');
            e.preventDefault();
        } else {

            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = [];
            let lineItemsForm = [];
            let lineItemObjForm = {};
            $('#tblCreditLine > tbody > tr').each(function () {
                var lineID = this.id;
                let tdaccount = $('#' + lineID + " .lineAccountName").text();
                let tddmemo = $('#' + lineID + " .lineMemo").text();
                let tdamount = $('#' + lineID + " .lineAmount").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();

                if (tdaccount !== "") {

                    lineItemObjForm = {
                        type: "TCreditLine",
                        fields: {
                            AccountName: tdaccount || '',
                            ProductDescription: tddmemo || '',


                            LineCost: Number(tdamount.replace(/[^0-9.-]+/g, "")) || 0,
                            LineTaxCode: tdtaxCode || '',
                            LineClassName: $('#sltDept').val() || defaultDept
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

            let supplier = $('#edtSupplierName').val();
            let supplierEmail = $('#edtSupplierEmail').val();
            let billingAddress = $('#txabillingAddress').val();

            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();
            let termname = $('#sltTerms').val();
            let departement = $('#sltVia').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();

            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            let orderStatus = $('#edtStatus').val();

            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentCredit = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentCredit = parseInt(currentCredit);
                objDetails = {
                    type: "TCredit",
                    fields: {
                        ID: currentCredit,
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        Deleted: false,


                        OrderDate: saleDate,

                        SupplierInvoiceNumber: poNumber,
                        ConNote: reference,
                        TermsName: termname,
                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,


                        SalesComments: pickingInfrmation,

                        OrderStatus: $('#sltStatus').val()
                    }
                };
            } else {
                objDetails = {
                    type: "TCredit",
                    fields: {
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        OrderDate: saleDate,
                        Deleted: false,

                        SupplierInvoiceNumber: poNumber,
                        ConNote: reference,
                        TermsName: termname,
                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,


                        SalesComments: pickingInfrmation,

                        OrderStatus: $('#sltStatus').val()
                    }
                };
            }

            purchaseService.saveCredit(objDetails).then(function (objDetails) {
                var supplierID = $('#edtSupplierEmail').attr('supplierid');

                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                var ponumber = $('#ponumber').val() || '.';
                $('.po').text(ponumber);
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function () {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'Credit ' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();

                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Credit ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
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
                            '                        Please find credit <span>' + erpInvoiceId + '</span> attached below.' +
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
                            }, function (error, result) {
                                if (error && error.error === "error") {
                                    FlowRouter.go('/creditlist?success=true');

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
                            }, function (error, result) {
                                if (error && error.error === "error") {
                                    FlowRouter.go('/creditlist?success=true');
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
                                            FlowRouter.go('/creditlist?success=true');
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
                            }, function (error, result) {
                                if (error && error.error === "error") {
                                    FlowRouter.go('/creditlist?success=true');

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
                                            FlowRouter.go('/creditlist?success=true');
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
                            }, function (error, result) {
                                if (error && error.error === "error") {
                                    FlowRouter.go('/creditlist?success=true');
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
                                            FlowRouter.go('/creditlist?success=true');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            FlowRouter.go('/creditlist?success=true');
                        }
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
                        doc.addHTML(source, function () {

                            resolve(doc.output('blob'));

                        });
                    });
                }


                if (supplierID !== " ") {
                    let supplierEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: supplierID,
                            Email: supplierEmail
                        }
                    }
                }

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
                            PrefName: 'creditcard'
                        });

                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'purchaseform',
                                    PrefName: 'creditcard',
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
                            }, function (err, idTag) {
                                if (err) {

                                } else {


                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'purchaseform',
                                PrefName: 'creditcard',
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
                            }, function (err, idTag) {
                                if (err) {

                                } else {


                                }
                            });
                        }
                    }
                } else {

                }


            }).catch(function (err) {
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
    'click .chkAccountName': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colAccountName').css('display', 'table-cell');
            $('.colAccountName').css('padding', '.75rem');
            $('.colAccountName').css('vertical-align', 'top');
        } else {
            $('.colAccountName').css('display', 'none');
        }
    },
    'click .chkMemo': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colMemo').css('display', 'table-cell');
            $('.colMemo').css('padding', '.75rem');
            $('.colMemo').css('vertical-align', 'top');
        } else {
            $('.colMemo').css('display', 'none');
        }
    },
    'click .chkAmount': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colAmount').css('display', 'table-cell');
            $('.colAmount').css('padding', '.75rem');
            $('.colAmount').css('vertical-align', 'top');
        } else {
            $('.colAmount').css('display', 'none');
        }
    },
    'click .chkTaxRate': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colTaxRate').css('display', 'table-cell');
            $('.colTaxRate').css('padding', '.75rem');
            $('.colTaxRate').css('vertical-align', 'top');
        } else {
            $('.colTaxRate').css('display', 'none');
        }
    },
    'click .chkTaxCode': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colTaxCode').css('display', 'table-cell');
            $('.colTaxCode').css('padding', '.75rem');
            $('.colTaxCode').css('vertical-align', 'top');
        } else {
            $('.colTaxCode').css('display', 'none');
        }
    },
    'click .chkCustomField1': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colCustomField1').css('display', 'table-cell');
            $('.colCustomField1').css('padding', '.75rem');
            $('.colCustomField1').css('vertical-align', 'top');
        } else {
            $('.colCustomField1').css('display', 'none');
        }
    },
    'click .chkCustomField2': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colCustomField2').css('display', 'table-cell');
            $('.colCustomField2').css('padding', '.75rem');
            $('.colCustomField2').css('vertical-align', 'top');
        } else {
            $('.colCustomField2').css('display', 'none');
        }
    },
    'change .rngRangeAccountName': function (event) {

        let range = $(event.target).val();
        $(".spWidthAccountName").html(range + '%');
        $('.colAccountName').css('width', range + '%');

    },
    'change .rngRangeMemo': function (event) {

        let range = $(event.target).val();
        $(".spWidthMemo").html(range + '%');
        $('.colMemo').css('width', range + '%');

    },
    'change .rngRangeAmount': function (event) {

        let range = $(event.target).val();
        $(".spWidthAmount").html(range + '%');
        $('.colAmount').css('width', range + '%');

    },
    'change .rngRangeTaxRate': function (event) {

        let range = $(event.target).val();
        $(".spWidthTaxRate").html(range + '%');
        $('.colTaxRate').css('width', range + '%');

    },
    'change .rngRangeTaxCode': function (event) {

        let range = $(event.target).val();
        $(".spWidthTaxCode").html(range + '%');
        $('.colTaxCode').css('width', range + '%');

    },
    'change .rngRangeCustomField1': function (event) {

        let range = $(event.target).val();
        $(".spWidthCustomField1").html(range + '%');
        $('.colCustomField1').css('width', range + '%');

    },
    'change .rngRangeCustomField2': function (event) {

        let range = $(event.target).val();
        $(".spWidthCustomField2").html(range + '%');
        $('.colCustomField2').css('width', range + '%');

    },
    'blur .divcolumnAccount': function (event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);

    },
    'click .btnSaveGridSettings': function (event) {
        let lineItems = [];

        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumnAccount").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumnAccount").attr("valueupdate") || '';
            var colHidden = false;
            colHidden = !$tblrow.find(".custom-control-input").is(':checked');
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass
            };

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
                    PrefName: 'tblCreditLine'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'purchaseform',
                            PrefName: 'tblCreditLine',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
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
                        PrefGroup: 'purchaseform',
                        PrefName: 'tblCreditLine',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');

                        } else {
                            $('#myModal2').modal('toggle');


                        }
                    });

                }
            }
        }
        $('#myModal2').modal('toggle');
    },
    'click .btnResetGridSettings': function (event) {
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
                    PrefName: 'tblCreditLine'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .btnResetSettings': function (event) {
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
                    PrefName: 'creditcard'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .new_attachment_btn_account': function (event) {
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload-account': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload-account')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'change #img-attachment-upload-account': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#img-attachment-upload-account')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function (event, ui) {
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
    'click .file-name': function (event) {
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

        previewFile.image = type.split('/')[0] === 'image';
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');


    },
    'click .confirm-delete-attachment': function (event, ui) {
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
    'click .save-to-library': function (event, ui) {
        $('.confirm-delete-attachment').trigger('click');
    },
    'click #btn_Attachment': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click #btnPayment': function () {

        let templateObject = Template.instance();
        let suppliername = $('#edtSupplierName');
        let purchaseService = new PurchaseBoardService();
        if (suppliername.val() === '') {
            swal('Supplier has not been selected!', '', 'warning');
            e.preventDefault();
        } else {

            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = [];
            let lineItemsForm = [];
            let lineItemObjForm = {};
            $('#tblCreditLine > tbody > tr').each(function () {
                var lineID = this.id;
                let tdaccount = $('#' + lineID + " .lineAccountName").text();
                let tddmemo = $('#' + lineID + " .lineMemo").text();
                let tdamount = $('#' + lineID + " .lineAmount").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").text();

                if (tdaccount !== "") {

                    lineItemObjForm = {
                        type: "TCreditLine",
                        fields: {
                            AccountName: tdaccount || '',
                            ProductDescription: tddmemo || '',


                            LineCost: Number(tdamount.replace(/[^0-9.-]+/g, "")) || 0,
                            LineTaxCode: tdtaxCode || '',
                            LineClassName: $('#sltDept').val() || defaultDept
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

            let supplier = $('#edtSupplierName').val();
            let supplierEmail = $('#edtSupplierEmail').val();
            let billingAddress = $('#txabillingAddress').val();


            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();
            let termname = $('#sltTerms').val();
            let departement = $('#sltVia').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();

            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentCredit = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentCredit = parseInt(currentCredit);
                objDetails = {
                    type: "TCredit",
                    fields: {
                        ID: currentCredit,
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        OrderDate: saleDate,
                        Deleted: false,

                        SupplierInvoiceNumber: poNumber,
                        ConNote: reference,
                        TermsName: termname,
                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,


                        SalesComments: pickingInfrmation,

                        OrderStatus: $('#sltStatus').val()
                    }
                };
            } else {
                objDetails = {
                    type: "TCredit",
                    fields: {
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        Deleted: false,


                        SupplierInvoiceNumber: poNumber,
                        ConNote: reference,
                        TermsName: termname,
                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,


                        SalesComments: pickingInfrmation,

                        OrderStatus: $('#sltStatus').val()
                    }
                };
            }

            purchaseService.saveCredit(objDetails).then(function (objDetails) {

                var supplierID = $('#edtSupplierEmail').attr('supplierid');
                if (supplierID !== " ") {
                    let supplierEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: supplierID,
                            Email: supplierEmail
                        }
                    };
                    purchaseService.saveSupplierEmail(supplierEmailData).then(function (supplierEmailData) {

                    });
                }
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
                            PrefName: 'creditcard'
                        });

                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'purchaseform',
                                    PrefName: 'creditcard',
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
                            }, function (err, idTag) {
                                if (err) {
                                    window.open('/paymentcard?soid=' + linesave, '_self');
                                } else {
                                    window.open('/paymentcard?soid=' + linesave, '_self');

                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'purchaseform',
                                PrefName: 'creditcard',
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
                            }, function (err, idTag) {
                                if (err) {
                                    window.open('/paymentcard?soid=' + linesave, '_self');
                                } else {
                                    window.open('/paymentcard?soid=' + linesave, '_self');

                                }
                            });
                        }
                    }
                }


            }).catch(function (err) {
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
    'click .chkEmailCopy': function (event) {
        $('#edtSupplierEmail').val($('#edtSupplierEmail').val().replace(/\s/g, ''));
        if ($(event.target).is(':checked')) {
            let checkEmailData = $('#edtSupplierEmail').val();
            if (checkEmailData.replace(/\s/g, '') === '') {
                swal('Supplier Email cannot be blank!', '', 'warning');
                event.preventDefault();
            } else {

                function isEmailValid(mailTo) {
                    return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
                }
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


    // TODO: Step 7
    // TODO: Step 8
    // TODO: Step 9
});

Template.setup.helpers({

    // Step 1 helpers
    countryList: () => {
        return Template.instance().countryData.get();
    },


    // Step 2 helpers
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.codename == 'NA') {
                return 1;
            } else if (b.codename == 'NA') {
                return -1;
            }
            return (a.codename.toUpperCase() > b.codename.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'taxRatesList'
        });
    },
    defaultpurchasetaxcode: () => {
        return Template.instance().defaultpurchasetaxcode.get();
    },
    defaultsaletaxcode: () => {
        return Template.instance().defaultsaletaxcode.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },


    // Step 3 helpers
    paymentmethoddatatablerecords: () => {
        return Template.instance().paymentmethoddatatablerecords.get() ? Template.instance().paymentmethoddatatablerecords.get().sort(function (a, b) {
            if (a.paymentmethodname == 'NA') {
                return 1;
            } else if (b.paymentmethodname == 'NA') {
                return -1;
            }
            return (a.paymentmethodname.toUpperCase() > b.paymentmethodname.toUpperCase()) ? 1 : -1;
        }) : [];
    },
    accountID: () => {
        return Template.instance().accountID.get();
    },
    paymentmethodtableheaderrecords: () => {
        return Template.instance().paymentmethodtableheaderrecords.get();
    },
    salesCloudPreferenceRecPaymentMethod: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'paymentmethodList'
        });
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get() ? Template.instance().deptrecords.get().sort(function (a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        }) : [];
    },
    includeAccountID: () => {
        return Template.instance().includeAccountID.get();
    },
    includeCreditCard: () => {
        return Template.instance().includeCreditCard.get();
    },



    // Step 4 helpers
    termdatatablerecords: () => {
        return Template.instance().termdatatablerecords.get().sort(function (a, b) {
            if (a.termname == 'NA') {
                return 1;
            } else if (b.termname == 'NA') {
                return -1;
            }
            return (a.termname.toUpperCase() > b.termname.toUpperCase()) ? 1 : -1;
        });
    },
    termtableheaderrecords: () => {
        return Template.instance().termtableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'termsList'
        });
    },
    include7Days: () => {
        return Template.instance().include7Days.get();
    },
    include30Days: () => {
        return Template.instance().include30Days.get();
    },
    includeCOD: () => {
        return Template.instance().includeCOD.get();
    },
    includeEOM: () => {
        return Template.instance().includeEOM.get();
    },
    includeEOMPlus: () => {
        return Template.instance().includeEOMPlus.get();
    },
    includeSalesDefault: () => {
        return Template.instance().includeSalesDefault.get();
    },
    includePurchaseDefault: () => {
        return Template.instance().includePurchaseDefault.get();
    },


    // Step 5 helpers
    employeedatatablerecords: () => {
        return Template.instance().employeedatatablerecords.get().sort(function (a, b) {
            if (a.employeename == 'NA') {
                return 1;
            } else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    employeetableheaderrecords: () => {
        return Template.instance().employeetableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblEmployeelist'
        });
    },


    // Step 6 helpers
    creditrecord: () => {
        return Template.instance().creditrecord.get();
    },
    viarecords: () => {
        return Template.instance().viarecords.get().sort(function (a, b) {
            if (a.shippingmethod === 'NA') {
                return 1;
            } else if (b.shippingmethod === 'NA') {
                return -1;
            }
            return (a.shippingmethod.toUpperCase() > b.shippingmethod.toUpperCase()) ? 1 : -1;
        });
    },
    termrecords: () => {
        return Template.instance().termrecords.get().sort(function (a, b) {
            if (a.termsname === 'NA') {
                return 1;
            } else if (b.termsname === 'NA') {
                return -1;
            }
            return (a.termsname.toUpperCase() > b.termsname.toUpperCase()) ? 1 : -1;
        });
    },
    purchaseCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'creditcard'
        });
    },
    purchaseCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblCreditLine'
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
        return Template.instance().statusrecords.get().sort(function (a, b) {
            if (a.orderstatus === 'NA') {
                return 1;
            } else if (b.orderstatus === 'NA') {
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
    },
    isCurrencyEnable: () => {
        return Session.get('CloudUseForeignLicence');
    },


    // Step 7 helpers
    // Step 8 helpers
    // Step 9 helpers
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});