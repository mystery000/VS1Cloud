import { ReportService } from "../report-service";
import 'jQuery.print/jQuery.print.js';
import { UtilityService } from "../../utility-service";

import { CountryService } from "../../js/country-service";
import { ReactiveVar } from "meteor/reactive-var";
import { AccountService } from "../../accounts/account-service";
import { SideBarService } from "../../js/sidebar-service";
import "../../lib/global/indexdbstorage.js";
import LoadingOverlay from "../../LoadingOverlay";
let sideBarService = new SideBarService();

let reportService = new ReportService();
let utilityService = new UtilityService();

Template.accountant_trust.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.countryList = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.accountantPanList = new ReactiveVar([]);
    templateObject.dateAsAt = new ReactiveVar();
    templateObject.currentYear = new ReactiveVar();
    templateObject.currentMonth = new ReactiveVar();
    templateObject.currentDate = new ReactiveVar();
    templateObject.endMonth = new ReactiveVar();
    templateObject.endDate = new ReactiveVar();

    templateObject.balancesheetList = new ReactiveVar([]);
    templateObject.profitList = new ReactiveVar([]);
    templateObject.reportOptions = new ReactiveVar();
});

Template.accountant_trust.onRendered(() => {

    const templateObject = Template.instance();
    let accountService = new AccountService();
    let countries = [];
    const accountTypeList = [];
    const dataTableList = [];

    templateObject.accountantPanList.set([{
        no: 2,
        name: "Cash and Cash Equivalents",
    }, {
        no: 3,
        name: "Receivables",
    }, {
        no: 4,
        name: "Inventory",
    }, {
        no: 5,
        name: "Property Plant and Equipment",
    }, {
        no: 6,
        name: "Financial Assets",
    }, {
        no: 7,
        name: "Intangibles",
    }, {
        no: 8,
        name: "Provisions",
    }, {
        no: 9,
        name: "Payables",
    }]);


    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('#uploadedImage').attr('src', imageData);
        $('#uploadedImage').attr('width', '50%');
    }

    function MakeNegative() {
        var TDs = document.getElementsByTagName("td");
        for (var i = 0; i < TDs.length; i++) {
            var temp = TDs[i];
            if (temp.firstChild.nodeValue.indexOf("-" + Currency) === 0) {
                temp.className = "colBalance text-danger";
            }
        }
    }

    var countryService = new CountryService();
    templateObject.getCountryData = function() {
        getVS1Data("TCountries")
            .then(function(dataObject) {
                if (dataObject.length == 0) {
                    countryService.getCountry().then((data) => {
                        for (let i = 0; i < data.tcountries.length; i++) {
                            countries.push(data.tcountries[i].Country);
                        }
                        countries = _.sortBy(countries);
                        templateObject.countryData.set(countries);
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tcountries;
                    for (let i = 0; i < useData.length; i++) {
                        countries.push(useData[i].Country);
                    }
                    countries = _.sortBy(countries);
                    templateObject.countryData.set(countries);
                }
            })
            .catch(function(err) {
                countryService.getCountry().then((data) => {
                    for (let i = 0; i < data.tcountries.length; i++) {
                        countries.push(data.tcountries[i].Country);
                    }
                    countries = _.sortBy(countries);
                    templateObject.countryData.set(countries);
                });
            });
    };
    templateObject.getCountryData();

    templateObject.getAccountLists = function() {
        getVS1Data("TAccountVS1")
            .then(function(dataObject) {
                if (dataObject.length == 0) {
                    accountService
                        .getAccountListVS1()
                        .then(function(data) {
                            setAccountListVS1(data);
                        })
                        .catch(function(err) {
                            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                            $(".fullScreenSpin").css("display", "none");
                            // Meteor._reload.reload();
                        });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    setAccountListVS1(data, true);
                }
            })
            .catch(function(err) {
                accountService
                    .getAccountListVS1()
                    .then(function(data) {
                        setAccountListVS1(data);
                    })
                    .catch(function(err) {
                        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                        $(".fullScreenSpin").css("display", "none");
                        // Meteor._reload.reload();
                    });
            });
    };

    function setAccountListVS1(data, isField = false) {

        //addVS1Data('TAccountVS1', JSON.stringify(data));
        let lineItems = [];
        let lineItemObj = {};
        let fullAccountTypeName = "";
        let accBalance = "";
        dataTableList = [];

        for (let i = 0; i < data.taccountvs1.length; i++) {
            let lineData = data.taccountvs1[i];
            if (isField) {
                lineData = data.taccountvs1[i].fields;
            }
            if (accountTypeList) {
                for (var j = 0; j < accountTypeList.length; j++) {
                    if (
                        lineData.AccountTypeName ===
                        accountTypeList[j].accounttypename
                    ) {
                        fullAccountTypeName = accountTypeList[j].description || "";
                    }
                }
            }

            if (!isNaN(data.taccountvs1[i].Balance)) {
                accBalance =
                    utilityService.modifynegativeCurrencyFormat(
                        lineData.Balance
                    ) || 0.0;
            } else {
                accBalance = Currency + "0.00";
            }

            var dataList = {
                id: lineData.ID || lineData.Id || "",
                accountname: lineData.AccountName || "",
                description: lineData.Description || "",
                accountnumber: lineData.AccountNumber || "",
                accounttypename: fullAccountTypeName || lineData.AccountTypeName,
                accounttypeshort: lineData.AccountTypeName || "",
                taxcode: lineData.TaxCode || "",
                bankaccountname: lineData.BankAccountName || "",
                bankname: lineData.BankName || "",
                bsb: lineData.BSB || "",
                bankaccountnumber: lineData.BankAccountNumber || "",
                swiftcode: lineData.Extra || "",
                routingNo: lineData.BankCode || "",
                apcanumber: lineData.BankNumber || "",
                balance: accBalance || 0.0,
                isheader: lineData.IsHeader || false,
                cardnumber: lineData.CarNumber || "",
                expirydate: lineData.ExpiryDate || "",
                cvc: lineData.CVC || "",
                useReceiptClaim: lineData.AllowExpenseClaim || false,
                expenseCategory: lineData.AccountGroup || ""
            };
            dataTableList.push(dataList);
        }

        templateObject.datatablerecords.set(dataTableList);

        if (templateObject.datatablerecords.get()) {
            Meteor.call(
                "readPrefMethod",
                Session.get("mycloudLogonID"),
                "tblAccountOverview",
                function(error, result) {
                    if (error) {} else {
                        if (result) {
                            for (let i = 0; i < result.customFields.length; i++) {
                                let customcolumn = result.customFields;
                                let columData = customcolumn[i].label;
                                let columHeaderUpdate = customcolumn[
                                    i
                                ].thclass.replace(/ /g, ".");
                                let hiddenColumn = customcolumn[i].hidden;
                                let columnClass = columHeaderUpdate.split(".")[1];
                                let columnWidth = customcolumn[i].width;
                                let columnindex = customcolumn[i].index + 1;

                                if (hiddenColumn == true) {
                                    $("." + columnClass + "").addClass("hiddenColumn");
                                    $("." + columnClass + "").removeClass("showColumn");
                                } else if (hiddenColumn == false) {
                                    $("." + columnClass + "").removeClass(
                                        "hiddenColumn"
                                    );
                                    $("." + columnClass + "").addClass("showColumn");
                                }
                            }
                        }
                    }
                }
            );

            setTimeout(function() {
                MakeNegative();
            }, 100);
        }

        $(".fullScreenSpin").css("display", "none");
        setTimeout(function() {
            // //$.fn.dataTable.moment('DD/MM/YY');
            $("#tblAccountOverview")
                .DataTable({
                    columnDefs: [
                        // { type: 'currency', targets: 4 }
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [{
                            extend: "csvHtml5",
                            text: "",
                            download: "open",
                            className: "btntabletocsv hiddenColumn",
                            filename: "accountoverview_" + moment().format(),
                            orientation: "portrait",
                            exportOptions: {
                                columns: ":visible",
                            },
                        },
                        {
                            extend: "print",
                            download: "open",
                            className: "btntabletopdf hiddenColumn",
                            text: "",
                            title: "Accounts Overview",
                            filename: "Accounts Overview_" + moment().format(),
                            exportOptions: {
                                columns: ":visible",
                            },
                        },
                        {
                            extend: "excelHtml5",
                            title: "",
                            download: "open",
                            className: "btntabletoexcel hiddenColumn",
                            filename: "accountoverview_" + moment().format(),
                            orientation: "portrait",
                            exportOptions: {
                                columns: ":visible",
                            },
                        },
                    ],
                    pageLength: initialDatatableLoad,
                    lengthMenu: [
                        [initialDatatableLoad, -1],
                        [initialDatatableLoad, "All"],
                    ],
                    info: true,
                    responsive: true,
                    order: [
                        [0, "asc"]
                    ],
                    action: function() {
                        $("#tblAccountOverview").DataTable().ajax.reload();
                    },
                    fnDrawCallback: function(oSettings) {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    },
                    fnInitComplete: function() {
                        $(
                            "<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                        ).insertAfter("#tblAccountOverview_filter");
                    },
                })
                .on("page", function() {
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                    let draftRecord = templateObject.datatablerecords.get();
                    templateObject.datatablerecords.set(draftRecord);
                })
                .on("column-reorder", function() {})
                .on("length.dt", function(e, settings, len) {
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                });
            // $('.fullScreenSpin').css('display','none');
        }, 10);

        var columns = $("#tblAccountOverview th");
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden === false) {
                columVisible = true;
            }
            if (v.className.includes("hiddenColumn")) {
                columVisible = false;
            }
            sWidth = v.style.width.replace("px", "");

            let datatablerecordObj = {
                sTitle: v.innerText || "",
                sWidth: sWidth || "",
                sIndex: v.cellIndex || "",
                sVisible: columVisible || false,
                sClass: v.className || "",
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
        $("div.dataTables_filter input").addClass(
            "form-control form-control-sm"
        );
    }

    templateObject.getAccountLists();

    $(document).ready(function() {
        let imageData = localStorage.getItem("Image");
        if (imageData) {
            $("#uploadedImage").attr("src", imageData);
            $("#uploadedImage").attr("width", "50%");
        }

        var today = moment().format("DD/MM/YYYY");
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        templateObject.dateAsAt.set(begunDate);

        let accountantID = FlowRouter.getParam("_id");

        getVS1Data('TReportsAccountantsCategory').then(function(dataObject) {
                let data = JSON.parse(dataObject[0].data);
                var dataInfo = {
                    id: data.Id || '',
                    firstname: data.FirstName || '-',
                    lastname: data.LastName || '-',
                    companyname: data.CompanyName || '-',
                    address: data.Address || '-',
                    towncity: data.TownCity || '-',
                    postalzip: data.PostalZip || '-',
                    stateregion: data.StateRegion || '-',
                    country: data.Country || '-',
                };

                let headerHtml = "<div style='border-top:1px solid #858796; width:172px; margin-bottom:12px'></div>";
                headerHtml += "<span style='float:left; padding-bottom:8px'>" + dataInfo.firstname + " " + dataInfo.lastname + ", CPA</span>";
                headerHtml += "<span style='float:left; padding-bottom:8px'><b>OnPoint Advisory</b></span>";
                headerHtml += "<span style='float:left; padding-bottom:20px'>" + dataInfo.address + "<br/>" + dataInfo.towncity + ", " + dataInfo.postalzip + ", " + dataInfo.stateregion + ", " + dataInfo.country + "</span>";
                headerHtml += "<span style='float:left;'>Dated: 31 August 2021</span>";

                $("#reportsAccountantHeader").html(headerHtml);
            })
            .catch(function(err) {
                // taxRateService.getAccountantCategory().then(function (data) {
                //     for(let i=0; i<data.tdeptclass.length; i++){
                //         var dataList = {
                //             id: data.tdeptclass[i].Id || '',
                //             firstname: data.tdeptclass[i].FirstName || '-',
                //             lastname: data.tdeptclass[i].LastName || '-',
                //             companyname: data.tdeptclass[i].CompanyName || '-',
                //             address: data.tdeptclass[i].Address || '-',
                //             docname: data.tdeptclass[i].DocName || '-',
                //             towncity: data.tdeptclass[i].TownCity || '-',
                //             postalzip: data.tdeptclass[i].PostalZip || '-',
                //             stateregion: data.tdeptclass[i].StateRegion || '-',
                //             country: data.tdeptclass[i].Country || '-',
                //             status:data.tdeptclass[i].Active || 'false',
                //         };
                //     }
                // }).catch(function (err) {
                // });
            });

    });

    templateObject.getBalanceSheetReports = async(dateAsOf) => {
        LoadingOverlay.show();

        let data = !localStorage.getItem("VS1BalanceSheet_Report1") ?
            await reportService.getBalanceSheetReport(dateAsOf) :
            JSON.parse(localStorage.getItem("VS1BalanceSheet_Report"));

        let records = [];
        if (data.balancesheetreport) {
            let date = new Date(dateAsOf);
            let Balancedatedisplay = moment(dateAsOf).format("DD/MM/YYYY");
            templateObject.dateAsAt.set(Balancedatedisplay);
            setTimeout(function() {
                $("#balanceData tbody tr:first td .SubHeading").html(
                    "As at " + moment(dateAsOf).format("DD/MM/YYYY")
                );
            }, 0);

            let sort = templateObject.$("#sort").val();
            let flag = false;
            if (sort == "Account Code") {
                flag = true;
            }

            let totalNetAssets = 0;
            let GrandTotalLiability = 0;
            let GrandTotalAsset = 0;
            for (let i = 0, len = data.balancesheetreport.length; i < len; i++) {
                let recordObj = {};
                recordObj.id = data.balancesheetreport[i].ID;
                recordObj.name = $.trim(data.balancesheetreport[i]["Account Tree"])
                    .split(" ")
                    .join("_");
                recordObj.dispName = $.trim(data.balancesheetreport[i]["Account Tree"]);

                let SubAccountTotal = data.balancesheetreport[i]["Sub Account Total"];
                if (SubAccountTotal !== 0) {
                    SubAccountTotal = utilityService.modifynegativeCurrencyFormat(SubAccountTotal);
                } else {
                    SubAccountTotal = " ";
                }

                let HeaderAccountTotal = data.balancesheetreport[i]["Header Account Total"];
                if (HeaderAccountTotal !== 0) {
                    HeaderAccountTotal = utilityService.modifynegativeCurrencyFormat(HeaderAccountTotal);
                } else {
                    HeaderAccountTotal = " ";
                }

                let TotalCurrentAsset_Liability = data.balancesheetreport[i]["Total Current Asset & Liability"];
                if (TotalCurrentAsset_Liability !== 0) {
                    TotalCurrentAsset_Liability = utilityService.modifynegativeCurrencyFormat(TotalCurrentAsset_Liability);
                } else {
                    TotalCurrentAsset_Liability = " ";
                }

                let TotalAsset_Liability = data.balancesheetreport[i]["Total Asset & Liability"];
                if (TotalAsset_Liability !== 0) {
                    TotalAsset_Liability = utilityService.modifynegativeCurrencyFormat(TotalAsset_Liability);
                } else {
                    TotalAsset_Liability = " ";
                }

                let AccountTree = data.balancesheetreport[i]["Account Tree"];
                recordObj.selected = false;

                if (
                    (i == 0 && AccountTree == "ASSETS") ||
                    AccountTree.replace(/\s/g, "") == "LIABILITIES&EQUITY"
                ) {
                    recordObj.dataArrHeader = [
                        data.balancesheetreport[i]["Account Tree"] || " ",
                    ];

                } else if (i == 1 || i == 2 || AccountTree == "") {
                    recordObj.dataArrAsset = [
                        data.balancesheetreport[i]["Account Tree"] || " ",
                    ];
                } else if (AccountTree.replace(/\s/g, "") == "TotalChequeorSaving") {
                    recordObj.value = HeaderAccountTotal || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "";
                    recordObj.dataArrTotal = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: HeaderAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "",
                        },
                    ];

                } else if (
                    AccountTree.replace(/\s/g, "") == "TotalAccountsReceivable"
                ) {
                    recordObj.value = HeaderAccountTotal || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "";
                    recordObj.dataArrTotal = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: HeaderAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "",
                        }, ,
                    ];

                } else if (AccountTree.replace(/\s/g, "") == "TotalOtherCurrentAsset") {
                    recordObj.value = HeaderAccountTotal || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "";
                    recordObj.dataArrTotal = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: HeaderAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "",
                        },
                    ];

                } else if (AccountTree.replace(/\s/g, "") == "TotalCurrentAssets") {
                    recordObj.value = TotalCurrentAsset_Liability || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(TotalCurrentAsset_Liability) || "";
                    recordObj.dataArrTotal1 = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: TotalCurrentAsset_Liability || "",
                            amount: utilityService.convertSubstringParseFloat(TotalCurrentAsset_Liability) || "",
                        },
                    ];
                } else if (AccountTree.replace(/\s/g, "") == "FixedAsset") {
                    recordObj.dataArrAsset = [
                        data.balancesheetreport[i]["Account Tree"] || " ",
                    ];

                } else if (AccountTree.replace(/\s/g, "") == "TotalFixedAsset") {
                    recordObj.value = TotalCurrentAsset_Liability || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(TotalCurrentAsset_Liability) || "";
                    recordObj.dataArrTotal1 = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: TotalCurrentAsset_Liability || "",
                            amount: utilityService.convertSubstringParseFloat(TotalCurrentAsset_Liability) || "",
                        },
                    ];
                } else if (AccountTree.replace(/\s/g, "") == "TOTALASSETS") {
                    recordObj.value = TotalAsset_Liability || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(TotalAsset_Liability) || "";
                    recordObj.dataArrTotal1 = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: TotalAsset_Liability || "",
                            amount: utilityService.convertSubstringParseFloat(TotalAsset_Liability) || "",
                        },
                    ];

                    GrandTotalAsset = TotalAsset_Liability;
                } else if (
                    AccountTree.replace(/\s/g, "") == "Liabilities" ||
                    AccountTree.replace(/\s/g, "") == "CurrentLiabilities"
                ) {
                    recordObj.dataArrAsset = [
                        data.balancesheetreport[i]["Account Tree"] || " ",
                    ];
                } else if (AccountTree.replace(/\s/g, "") == "TotalCreditCardAccount") {
                    recordObj.value = HeaderAccountTotal || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "";
                    recordObj.dataArrTotal = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: HeaderAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "",
                        },
                    ];
                } else if (AccountTree.replace(/\s/g, "") == "TotalAccountsPayable") {
                    recordObj.value = HeaderAccountTotal || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "";
                    recordObj.dataArrTotal = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: HeaderAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "",
                        },
                    ];
                } else if (
                    AccountTree.replace(/\s/g, "") == "TotalOtherCurrentLiability"
                ) {
                    recordObj.value = HeaderAccountTotal || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "";
                    recordObj.dataArrTotal = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: HeaderAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "",
                        },
                    ];
                } else if (
                    AccountTree.replace(/\s/g, "") == "TotalCurrentLiabilities"
                ) {
                    recordObj.value = TotalCurrentAsset_Liability || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(TotalCurrentAsset_Liability) || "";
                    recordObj.dataArrTotal1 = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: TotalCurrentAsset_Liability || "",
                            amount: utilityService.convertSubstringParseFloat(TotalCurrentAsset_Liability) || "",
                        },
                    ];
                } else if (AccountTree.replace(/\s/g, "") == "TotalCapital/Equity") {
                    recordObj.value = TotalCurrentAsset_Liability || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(TotalCurrentAsset_Liability) || "";
                    recordObj.dataArrTotal1 = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: TotalCurrentAsset_Liability || "",
                            amount: utilityService.convertSubstringParseFloat(TotalCurrentAsset_Liability) || "",
                        },
                    ];
                } else if (
                    AccountTree.replace(/\s/g, "") == "TOTALLIABILITIES&EQUITY"
                ) {
                    recordObj.value = TotalAsset_Liability || "";
                    recordObj.amount = utilityService.convertSubstringParseFloat(TotalAsset_Liability) || "";
                    recordObj.dataArrTotal1 = [
                        data.balancesheetreport[i]["Account Tree"] || "-",
                        {
                            type: "amount",
                            value: SubAccountTotal || "",
                            amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                "",
                        },
                        {
                            type: "amount",
                            value: TotalAsset_Liability || "",
                            amount: utilityService.convertSubstringParseFloat(TotalAsset_Liability) || "",
                        },
                    ];

                    GrandTotalLiability = TotalAsset_Liability;
                } else if (
                    AccountTree.replace(/\s/g, "") == "Capital/Equity" ||
                    AccountTree.replace(/\s/g, "") == "OtherCurrentLiability" ||
                    AccountTree.replace(/\s/g, "") == "OtherCurrentAsset" ||
                    AccountTree.replace(/\s/g, "") == "CreditCardAccount"
                ) {
                    recordObj.dataArrAsset = [
                        data.balancesheetreport[i]["Account Tree"] || " ",
                    ];
                } else {
                    if (flag) {
                        let accountCode = "";
                        if (data.balancesheetreport[i].AccountNumber) {
                            accountCode = data.balancesheetreport[i].AccountNumber + "-";
                        }
                        recordObj.value = SubAccountTotal || "";
                        recordObj.amount = utilityService.convertSubstringParseFloat(SubAccountTotal) || "";
                        if (recordObj.amount == "") {
                            recordObj.value = HeaderAccountTotal || "";
                            recordObj.amount = utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "";
                        }

                        recordObj.dataArr2 = [
                            accountCode + data.balancesheetreport[i]["Account Tree"] || "-",
                            {
                                type: "amount",
                                value: SubAccountTotal || "",
                                amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                    "",
                            },
                            {
                                type: "amount",
                                value: HeaderAccountTotal || "",
                                amount: utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "",
                            },
                        ];
                    } else {
                        recordObj.value = SubAccountTotal || "";
                        recordObj.amount = utilityService.convertSubstringParseFloat(SubAccountTotal) || "";
                        if (recordObj.amount == "") {
                            recordObj.value = HeaderAccountTotal || "";
                            recordObj.amount = utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "";
                        }
                        recordObj.dataArr2 = [
                            data.balancesheetreport[i]["Account Tree"] || "-",
                            {
                                type: "amount",
                                value: SubAccountTotal || "",
                                amount: utilityService.convertSubstringParseFloat(SubAccountTotal) ||
                                    "",
                            },
                            {
                                type: "amount",
                                value: HeaderAccountTotal || "",
                                amount: utilityService.convertSubstringParseFloat(HeaderAccountTotal) || "",
                            },
                        ];
                    }
                }
                if (recordObj.dataArr2) {
                    if (HeaderAccountTotal.replace(/\s/g, "") || SubAccountTotal.replace(/\s/g, "")) {
                        records.push(recordObj);
                    }
                } else {
                    records.push(recordObj);
                }
            }
        }

        templateObject.balancesheetList.set(records);

        if (templateObject.balancesheetList.get()) {
            setTimeout(function() {
                function MakeNegative() {
                    $("td").each(function() {
                        if (
                            $(this)
                            .text()
                            .indexOf("-" + Currency) >= 0
                        )
                            $(this).addClass("text-danger");
                    });
                }
                MakeNegative();
                $("td a").each(function() {
                    if (
                        $(this)
                        .text()
                        .indexOf("-" + Currency) >= 0
                    )
                        $(this).addClass("text-danger");
                });
            }, 500);
        }

        LoadingOverlay.hide();
    };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let endMonth = "06";
    templateObject.endMonth.set(endMonth);
    templateObject.currentYear.set(new Date().getFullYear());
    templateObject.currentMonth.set(new Date().getMonth());
    templateObject.currentDate.set(new Date().getDate() + " " + months[new Date().getMonth()] + " " + new Date().getFullYear());

    var currentDate2 = new Date(new Date().getFullYear(), (parseInt(endMonth)), 0);
    templateObject.endDate.set(currentDate2.getDate() + " " + months[parseInt(endMonth) - 1] + " " + new Date().getFullYear());
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    templateObject.getBalanceSheetReports(getLoadDate);

    templateObject.setReportOptions = async function(
        compPeriod = 0,
        formatDateFrom = new Date(),
        formatDateTo = new Date()
    ) {
        // New Code Start here
        let dateRange = [];
        dateRange.push(
            moment(formatDateFrom).format("DD MMM YYYY") +
            "-" +
            moment(formatDateTo).format("DD MMM YYYY")
        );

        let defaultOptions = templateObject.reportOptions.get();
        if (defaultOptions) {
            defaultOptions.fromDate = formatDateFrom;
            defaultOptions.toDate = formatDateTo;
            defaultOptions.threcords = dateRange;
        } else {
            defaultOptions = {
                compPeriod: compPeriod,
                fromDate: formatDateFrom,
                toDate: formatDateTo,
                threcords: dateRange,
                departments: [],
                showDecimal: true,
                showtotal: true,
            };
        }
        await templateObject.reportOptions.set(defaultOptions);

        await templateObject.getProfitandLossReports();
    };

    templateObject.getProfitandLossReports = async function() {
        const options = await templateObject.reportOptions.get();
        let dateFrom =
            moment(options.fromDate).format("YYYY-MM-DD") ||
            moment().format("YYYY-MM-DD");
        let dateTo =
            moment(options.toDate).format("YYYY-MM-DD") ||
            moment().format("YYYY-MM-DD");
        // Compare period
        if (options.compPeriod) {
            try {
                let periodMonths = `${options.compPeriod} Month`;
                let data = await reportService.getProfitandLossCompare(
                    dateFrom,
                    dateTo,
                    false,
                    periodMonths
                );
                let records = [];
                options.threcords = [];
                if (data.tprofitandlossperiodcomparereport) {
                    let accountData = data.tprofitandlossperiodcomparereport;

                    let accountType = "";
                    var dataList = "";
                    for (let i = 0; i < accountData.length; i++) {
                        if (accountData[i]["AccountTypeDesc"].replace(/\s/g, "") == "") {
                            accountType = "";
                        } else {
                            accountType = accountData[i]["AccountTypeDesc"];
                        }
                        let compPeriod = options.compPeriod + 1;
                        let periodAmounts = [];
                        let totalAmount = 0;
                        for (let counter = 1; counter <= compPeriod; counter++) {
                            if (i == 0) {
                                options.threcords.push(accountData[i]["DateDesc_" + counter]);
                            }
                            totalAmount += accountData[i]["Amount_" + counter];
                            let AmountEx =
                                utilityService.modifynegativeCurrencyFormat(
                                    accountData[i]["Amount_" + counter]
                                ) || 0.0;
                            let RoundAmount =
                                Math.round(accountData[i]["Amount_" + counter]) || 0;
                            periodAmounts.push({
                                decimalAmt: AmountEx,
                                roundAmt: RoundAmount,
                            });
                        }
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(totalAmount) || 0.0;
                        let totalRoundAmount = Math.round(totalAmount) || 0;
                        if (accountData[i]["AccountHeaderOrder"].replace(/\s/g, "") == "" && accountType != "") {
                            dataList = {
                                id: accountData[i]["AccountID"] || "",
                                accounttype: accountType || "",
                                accounttypeshort: accountData[i]["AccountType"] || "",
                                accountname: accountData[i]["AccountName"] || "",
                                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                                accountno: accountData[i]["AccountNo"] || "",
                                totalamountex: "",
                                totalroundamountex: "",
                                periodAmounts: "",
                                name: $.trim(accountData[i]["AccountName"])
                                    .split(" ")
                                    .join("_"),
                            };
                        } else {
                            dataList = {
                                id: accountData[i]["AccountID"] || "",
                                accounttype: accountType || "",
                                accounttypeshort: accountData[i]["AccountType"] || "",
                                accountname: accountData[i]["AccountName"] || "",
                                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                                accountno: accountData[i]["AccountNo"] || "",
                                totalamountex: totalAmountEx || 0.0,
                                periodAmounts: periodAmounts,
                                totalroundamountex: totalRoundAmount,
                                name: $.trim(accountData[i]["AccountName"])
                                    .split(" ")
                                    .join("_"),
                                // totaltax: totalTax || 0.00
                            };
                        }

                        if (accountData[i]["AccountType"].replace(/\s/g, "") == "" && accountType == "") {} else {
                            if (dataList.totalroundamountex !== 0) {
                                records.push(dataList);
                            }
                        }
                    }

                    // Set Table Data
                    templateObject.reportOptions.set(options);
                    templateObject.profitList.set(records);
                }
            } catch (err) {
                $(".fullScreenSpin").css("display", "none");
            }
        } else {
            try {
                options.threcords = [];
                let fromYear = moment(dateFrom).format("YYYY");
                let toYear = moment(dateTo).format("YYYY");
                let dateRange = [];
                if (toYear === fromYear) {
                    dateRange.push(
                        moment(dateFrom).format("DD MMM") +
                        "-" +
                        moment(dateTo).format("DD MMM") +
                        " " +
                        toYear
                    );
                } else {
                    dateRange.push(
                        moment(dateFrom).format("DD MMM YYYY") +
                        "-" +
                        moment(dateTo).format("DD MMM YYYY")
                    );
                }
                options.threcords = dateRange;
                let departments = options.departments.length ?
                    options.departments.join(",") :
                    "";
                let data = await reportService.getProfitandLoss(
                    dateFrom,
                    dateTo,
                    false,
                    departments
                );
                let records = [];
                if (data.profitandlossreport) {
                    let accountData = data.profitandlossreport;
                    let accountType = "";
                    var dataList = "";
                    for (let i = 0; i < accountData.length; i++) {
                        if (accountData[i]["Account Type"].replace(/\s/g, "") == "") {
                            accountType = "";
                        } else {
                            accountType = accountData[i]["Account Type"];
                        }
                        let periodAmounts = []
                        var totalAmount = accountData[i]["TotalAmountEx"];
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(accountData[i]["TotalAmountEx"]) || 0.0;
                        let totalRoundAmount = Math.round(accountData[i]["TotalAmountEx"]) || 0;
                        periodAmounts.push({
                            decimalAmt: totalAmountEx,
                            roundAmt: totalRoundAmount,
                        });
                        if (options.departments.length) {
                            options.departments.forEach(dept => {
                                totalAmount += accountData[i][dept + "_AmountColumnInc"];
                                let deptAmountEx = utilityService.modifynegativeCurrencyFormat(accountData[i][dept + "_AmountColumnInc"]) || 0.0;
                                let deptRoundAmount = Math.round(accountData[i][dept + "_AmountColumnInc"]) || 0;
                                if (i == 0) {
                                    options.threcords.push(dept);
                                }
                                periodAmounts.push({
                                    decimalAmt: deptAmountEx,
                                    roundAmt: deptRoundAmount,
                                });
                            });
                        }
                        if (
                            accountData[i]["AccountHeaderOrder"].replace(/\s/g, "") == "" &&
                            accountType != ""
                        ) {
                            dataList = {
                                id: accountData[i]["AccountID"] || "",
                                accounttype: accountType || "",
                                accounttypeshort: accountData[i]["AccountType"] || "",
                                accountname: accountData[i]["AccountName"] || "",
                                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                                accountno: accountData[i]["AccountNo"] || "",
                                totalamountex: "",
                                periodAmounts: "",
                                totalroundamountex: "",
                                name: $.trim(accountData[i]["AccountName"])
                                    .split(" ")
                                    .join("_"),
                            };
                        } else {
                            dataList = {
                                id: accountData[i]["AccountID"] || "",
                                accounttype: accountType || "",
                                accounttypeshort: accountData[i]["AccountType"] || "",
                                accountname: accountData[i]["AccountName"] || "",
                                accountheaderorder: accountData[i]["AccountHeaderOrder"] || "",
                                accountno: accountData[i]["AccountNo"] || "",
                                totalamountex: totalAmountEx || 0.0,
                                totalroundamountex: totalRoundAmount,
                                periodAmounts: periodAmounts,
                                name: $.trim(accountData[i]["AccountName"])
                                    .split(" ")
                                    .join("_"),
                                // totaltax: totalTax || 0.00
                            };
                        }

                        if (
                            accountData[i]["AccountType"].replace(/\s/g, "") == "" &&
                            accountType == ""
                        ) {} else {
                            if (dataList.totalroundamountex !== 0) {
                                records.push(dataList);
                            }
                        }
                    }

                    // Set Table Data

                    templateObject.reportOptions.set(options);
                    templateObject.profitList.set(records);
                }
            } catch (error) {
                $(".fullScreenSpin").css("display", "none");
            }
        }
    };

    var getDateFrom = "2020-01-01";
    var getLoadDate = getLoadDate;
    templateObject.setReportOptions(0, getDateFrom, getLoadDate);
});

Template.accountant_trust.events({
    "click #btnaddAccountant": function() {
        FlowRouter.go("/reportsAccountantSettings");
    },

    'click .btnselAccountant': function(event) {
        const templateObject = Template.instance();
        let accountantList = templateObject.datatablerecords.curValue;

        let innerHtml = "";
        let accountantPanID = $(event.target).attr('id').split("-")[1];
        for (var i = 0; i < accountantList.length; i++) {
            if ($("#f-" + accountantPanID + "-" + accountantList[i].id).prop('checked') == true) {
                innerHtml += "<div style='width: calc(100% - 12px); border-bottom: 1px solid #ccc; padding:0' id='row-" + accountantPanID + "-" + accountantList[i].id + "'>";
                innerHtml += "<div style='width:calc(100% - 180px); float:left; padding-top:4px'>" + accountantList[i].accountname + "</div>";
                innerHtml += "<div style='float:left; padding-top:4px; width:90px'>" + accountantList[i].balance + "</div>";
                innerHtml += "<div style='float:left; padding-top:4px; width:90px'>" + accountantList[i].balance + "</div>";
                innerHtml += "</div>";
            }
        }
        $("#reportAccPan" + accountantPanID).html(innerHtml);
        $("#reportAccPanPrt" + accountantPanID).html(innerHtml);
        $("#accountantList_" + accountantPanID).modal('toggle');
    },

    "click .update_search": function() {
        let templateObject = Template.instance();
        let balanceDate = templateObject.$("#balanceDate").val();
        let compareTo = templateObject.$("#compareTo").val();
        let comparePeriod = templateObject.$("#comparePeriod").val();
        let sort = templateObject.$("#sort").val();
        let Date = moment(balanceDate).clone().endOf("month").format("YYYY-MM-DD");
        templateObject.getBalanceSheetReports(Date);
        let url =
            "/reports/balance-sheet?balanceDate=" +
            moment(balanceDate).clone().endOf("month").format("YYYY-MM-DD") +
            "&compareTo=" +
            compareTo +
            "&comparePeriod=" +
            comparePeriod +
            "&sort=" +
            sort;
        if (!Session.get("AgedReceivablesTemplate")) {
            FlowRouter.go(url);
        }
    },
    "click .btnPrintReport": function(event) {
        $(".printReport").show();
        $("a").attr("href", "/");
        document.title = "Company As Trustee";
        $(".printReport").print({
            title: document.title + " | " + loggedCompany,
            noPrintSelector: ".addSummaryEditor",
            mediaPrint: false,
        });

        setTimeout(function() {
            $("a").attr("href", "#");
            $(".printReport").hide();
        }, 100);
    },
    "click .btnExportReport": function() {
        $(".fullScreenSpin").css("display", "inline-block");
        let utilityService = new UtilityService();

        const filename = loggedCompany + "-Balance Sheet" + ".csv";
        utilityService.exportReportToCsvTable("tableExport", filename, "csv");
    },
});

Template.accountant_trust.helpers({
    countryList: () => {
        return Template.instance().countryData.get();
    },
    datatablerecords: () => {
        return Template.instance()
            .datatablerecords.get()
            .sort(function(a, b) {
                if (a.accountname === "NA") {
                    return 1;
                } else if (b.accountname === "NA") {
                    return -1;
                }
                return a.accountname.toUpperCase() > b.accountname.toUpperCase() ?
                    1 :
                    -1;
            });
    },

    accountantPanList: () => {
        return Template.instance().accountantPanList.get();
    },

    companyname: () => {
        return loggedCompany;
    },

    fiscalYearEnding: () => {
        return Template.instance().currentYear.get();
    },

    dateAsAt: () => {
        return Template.instance().dateAsAt.get() || "-";
    },

    balancesheetList: () => {
        return Template.instance().balancesheetList.get();
    },

    profitList: () => {
        return Template.instance().profitList.get();
    },

    currentYear: () => {
        return Template.instance().currentYear.get();
    },
    currentMonth: () => {
        return Template.instance().currentMonth.get();
    },
    currentDate: () => {
        return Template.instance().currentDate.get();
    },
    endDate: () => {
        return Template.instance().endDate.get();
    },
    convertAmount: (amount, currencyData) => {
        let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

        if (!amount || amount.trim() == "") {
            return "";
        }
        if (currencyData.code == defaultCurrencyCode) {
            // default currency
            return amount;
        }

        amount = utilityService.convertSubstringParseFloat(amount); // This will remove all currency symbol

        // Lets remove the minus character
        const isMinus = amount < 0;
        if (isMinus == true) amount = amount * -1; // Make it positive

        // Get the selected date
        let dateTo = $("#balancedate").val();
        const day = dateTo.split("/")[0];
        const m = dateTo.split("/")[1];
        const y = dateTo.split("/")[2];
        dateTo = new Date(y, m, day);
        dateTo.setMonth(dateTo.getMonth() - 1); // remove one month (because we added one before)

        // Filter by currency code
        currencyList = currencyList.filter((a) => a.Code == currencyData.code);

        // Sort by the closest date
        currencyList = currencyList.sort((a, b) => {
            a = GlobalFunctions.timestampToDate(a.MsTimeStamp);
            a.setHours(0);
            a.setMinutes(0);
            a.setSeconds(0);

            b = GlobalFunctions.timestampToDate(b.MsTimeStamp);
            b.setHours(0);
            b.setMinutes(0);
            b.setSeconds(0);

            var distancea = Math.abs(dateTo - a);
            var distanceb = Math.abs(dateTo - b);
            return distancea - distanceb; // sort a before b when the distance is smaller
        });

        const [firstElem] = currencyList; // Get the firest element of the array which is the closest to that date

        let rate = currencyData.code == defaultCurrencyCode ? 1 : firstElem.BuyRate; // Must used from tcurrecyhistory
        //amount = amount + 0.36;
        amount = parseFloat(amount * rate); // Multiply by the rate
        amount = Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }); // Add commas

        let convertedAmount =
            isMinus == true ?
            `- ${currencyData.symbol} ${amount}` :
            `${currencyData.symbol} ${amount}`;

        return convertedAmount;
    },
});