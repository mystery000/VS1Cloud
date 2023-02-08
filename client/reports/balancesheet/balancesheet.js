import { ReportService } from "../report-service";
import { SalesBoardService } from "../../js/sales-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import GlobalFunctions from "../../GlobalFunctions";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";
import Datehandler from "../../DateHandler";
import { Template } from 'meteor/templating';
import "./balancesheet.html"
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let defaultCurrencyCode = CountryAbbr; // global variable "AUD"

let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();
Template.balancesheetreport.inheritsHooksFrom('vs1_report_template');

Template.balancesheetreport.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.selected = new ReactiveVar();
    templateObject.transactiondatatablerecords = new ReactiveVar();
    templateObject.netAssetTotal = new ReactiveVar();
    templateObject.dateAsAtAYear = new ReactiveVar();
    templateObject.dateAsAt = new ReactiveVar();
    templateObject.currentYear = new ReactiveVar();
    templateObject.nextYear = new ReactiveVar();
    templateObject.currentMonth = new ReactiveVar();
    templateObject.currencyRecord = new ReactiveVar([]);
    templateObject.tabinationRecord = new ReactiveVar([]);

    templateObject.currencyList = new ReactiveVar([]);
    templateObject.activeCurrencyList = new ReactiveVar([]);
    templateObject.tcurrencyratehistory = new ReactiveVar([]);
});

Template.balancesheetreport.onRendered(() => {
    const templateObject = Template.instance();
    LoadingOverlay.show();

    templateObject.init_reset_data = function () {
        let reset_data = [];
        reset_data = [
            { index: 1, label: 'ACCNAME', class: 'colACCNAME', active: true, display: true, width: "150" },
            { index: 2, label: 'Account Tree', class: 'colAccountTree', active: true, display: true, width: "250" },
            { index: 3, label: 'Account No', class: 'colAccountNo', active: true, display: true, width: "100" },
            { index: 4, label: 'Header-Account-Totals', class: 'colHeaderAccountTotals', active: true, display: true, width: "200" },
            { index: 5, label: 'ID', class: 'colID', active: true, display: true, width: "85" },
            { index: 6, label: 'SortID', class: 'colSortID', active: true, display: true, width: "85" },
            { index: 7, label: 'Sub-Account-Totals', class: 'colSubAccountTotals', active: true, display: true, width: "200" },
            { index: 8, label: 'Total ~Assets &~Liabilities', class: 'colTotalAssets', active: true, display: true, width: "200" },
            { index: 9, label: 'Total Current~Assets &~Liabilities', class: 'colTotalCurrentAssets', active: true, display: true, width: "300" },
            { index: 10, label: 'TypeID', class: 'colTypeID', active: true, display: true, width: "150" },
        ]
        templateObject.currencyRecord.set(reset_data);
    }
    templateObject.init_reset_data();

    // await reportService.getBalanceSheetReport(dateAOsf) :

    // --------------------------------------------------------------------------------------------------

    templateObject.initDate = () => {
        Datehandler.initOneMonth();
    };
    templateObject.setDateAs = (dateFrom = null) => {
        templateObject.dateAsAt.set((dateFrom) ? moment(dateFrom).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
    };
    templateObject.initDate();

    let date = new Date();
    //balance date dropdown
    templateObject.currentYear.set(date.getFullYear());
    templateObject.nextYear.set(date.getFullYear() + 1);
    let currentMonth = moment(date).format("DD/MM/YYYY");
    templateObject.currentMonth.set(currentMonth);

    templateObject.setDateAs(GlobalFunctions.convertYearMonthDay($('#dateFrom').val()));

    templateObject.getBalanceSheetData = async function (dateAsOf, ignoreDate = false) {
        getVS1Data('BalanceSheetReport').then(function (dataObject) {
            if (dataObject.length == 0) {
                reportService.getBalanceSheetReport(dateAsOf).then(async function (data) {
                    await addVS1Data('BalanceSheetReport', JSON.stringify(data));
                    templateObject.displayBalanceSheetData(data);
                }).catch(function (err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                templateObject.displayBalanceSheetData(data);
            }
        }).catch(function (err) {
            reportService.getBalanceSheetReport(dateAsOf).then(async function (data) {
                await addVS1Data('BalanceSheetReport', JSON.stringify(data));
                templateObject.displayBalanceSheetData(data);
            }).catch(function (err) {

            });
        });
    }

    templateObject.getBalanceSheetData(
        GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
        false
    );
    templateObject.displayBalanceSheetData = async function (data) {
        var splashArrayBalanceSheetReport = new Array();
        let deleteFilter = false;
        if (data.Params.Search.replace(/\s/g, "") == "") {
            deleteFilter = true;
        } else {
            deleteFilter = false;
        };
        for (let i = 0; i < data.balancesheetreport.length; i++) {
            //   if (!isNaN(data.taccountvs1list[i].Balance)) {
            //       accBalance = utilityService.modifynegativeCurrencyFormat(data.taccountvs1list[i].Balance) || 0.0;
            //   } else {
            //       accBalance = Currency + "0.00";
            //   }
            //   if (data.taccountvs1list[i].ReceiptCategory && data.taccountvs1list[i].ReceiptCategory != '') {
            //       usedCategories.push(data.taccountvs1list[i].fields);
            //   }
            //   let linestatus = '';
            //   if (data.taccountvs1list[i].Active == true) {
            //       linestatus = "";
            //   } else if (data.taccountvs1list[i].Active == false) {
            //       linestatus = "In-Active";
            //   };

            var dataList = [
                data.balancesheetreport[i].ACCNAME || "",
                data.balancesheetreport[i]["Account Tree"] || "",
                data.balancesheetreport[i].AccountNumber || "",
                data.balancesheetreport[i]["Header Account Total"] || "",
                data.balancesheetreport[i].ID || "",
                data.balancesheetreport[i].TaxCode || '',
                data.balancesheetreport[i]["Sub Account Total"] || '',
                data.balancesheetreport[i]["Total Asset & Liability"] || '',
                data.balancesheetreport[i]["Total Current Asset & Liability"] || '',
                data.balancesheetreport[i].TypeID || "",
            ];
            splashArrayBalanceSheetReport.push(dataList);
            templateObject.transactiondatatablerecords.set(splashArrayBalanceSheetReport);
        }


        if (templateObject.transactiondatatablerecords.get()) {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        }

        setTimeout(function () {
            $('#tblBalanceSheet').DataTable({
                data: splashArrayBalanceSheetReport,
                searching: false,
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                columnDefs: [
                    {
                        targets: 0,
                        className: "colACCNAME",
                    },
                    {
                        targets: 1,
                        className: "colAccountTree"
                    },
                    {
                        targets: 2,
                        className: "colAccountNo"
                    },
                    {
                        targets: 3,
                        className: "colHeaderAccountTotals",
                    },
                    {
                        targets: 4,
                        className: "colID",
                    },
                    {
                        targets: 5,
                        className: "colSortID",
                    },
                    {
                        targets: 6,
                        className: "colSubAccountTotals",
                    },
                    {
                        targets: 7,
                        className: "colSubAccountTotals",
                    },
                    {
                        targets: 8,
                        className: "colTotalCurrentAssets",
                    },
                    {
                        targets: 9,
                        className: "colTypeID",
                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
                info: true,
                // responsive: true,
                "order": [[1, "asc"]],
                action: function () {
                    $('#' + currenttablename).DataTable().ajax.reload();
                },

            }).on('page', function () {
                setTimeout(function () {
                    MakeNegative();
                }, 100);
            }).on('column-reorder', function () {

            }).on('length.dt', function (e, settings, len) {

                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                    } else {
                        $(".fullScreenSpin").css("display", "none");
                    }
                } else {
                    $(".fullScreenSpin").css("display", "none");
                }
                setTimeout(function () {
                    MakeNegative();
                }, 100);
            });
            $(".fullScreenSpin").css("display", "none");
        }, 0);

        $('div.dataTables_filter input').addClass('form-control form-control-sm');
    }


    // ------------------------------------------------------------------------------------------------------


    LoadingOverlay.hide();
});

// function sortByAlfa(a, b) {
//     return a.currency - b.currency;
// }
Template.balancesheetreport.helpers({
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

        // get default currency symbol
        // let _defaultCurrency = currencyList.filter(
        //   (a) => a.Code == defaultCurrencyCode
        // )[0];

        //amount = amount.replace(_defaultCurrency.symbol, "");

        // amount =
        //   isNaN(amount) == true
        //     ? parseFloat(amount.substring(1))
        //     : parseFloat(amount);



        // Get the selected date
        let dateTo = $("#dateFrom").val();
        const day = dateTo.split("/")[0];
        const m = dateTo.split("/")[1];
        const y = dateTo.split("/")[2];
        dateTo = new Date(y, m, day);
        dateTo.setMonth(dateTo.getMonth() - 1); // remove one month (because we added one before)


        // Filter by currency code
        currencyList = currencyList.filter((a) => a.Code == currencyData.code);


        // if(currencyList.length == 0) {
        //   currencyList = Template.instance().currencyList.get();
        //   currencyList = currencyList.filter((a) => a.Code == currencyData.code);
        // }


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

            // const adate= new Date(a.MsTimeStamp);
            // const bdate = new Date(b.MsTimeStamp);

            // if(adate < bdate) {
            //   return 1;
            // }
            // return -1;
        });

        const [firstElem] = currencyList; // Get the firest element of the array which is the closest to that date



        let rate = currencyData.code == defaultCurrencyCode ? 1 : firstElem.BuyRate; // Must used from tcurrecyhistory
        //amount = amount + 0.36;
        amount = parseFloat(amount * rate); // Multiply by the rate
        amount = Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }); // Add commas


        // amount = amount.toLocaleString();

        let convertedAmount =
            isMinus == true ?
                `- ${currencyData.symbol}${amount}` :
                `${currencyData.symbol}${amount}`;


        return convertedAmount;
    },
    count: (array) => {
        return array.length;
    },
    countActive: (array) => {
        if (array.length == 0) {
            return 0;
        }
        let activeArray = array.filter((c) => c.active == true);
        return activeArray.length;
    },
    currencyList: () => {
        return Template.instance().currencyList.get();
    },
    isNegativeAmount(amount) {
        if (Math.sign(amount) === -1) {
            return true;
        }
        return false;
    },
    isOnlyDefaultActive() {
        const array = Template.instance().currencyList.get();
        if (array.length == 0) {
            return false;
        }
        let activeArray = array.filter((c) => c.active == true);

        if (activeArray.length == 1) {

            if (activeArray[0].code == defaultCurrencyCode) {
                return !true;
            } else {
                return !false;
            }
        } else {
            return !false;
        }
    },
    isCurrencyListActive() {
        const array = Template.instance().currencyList.get();
        let activeArray = array.filter((c) => c.active == true);
        return activeArray.length > 0;
    },
    isObject: (variable) => {
        return typeof variable === "object" && variable !== null;
    },
    currency: () => {
        return Currency;
    },
    companyname: () => {
        return loggedCompany;
    },
    dateAsAt: () => {
        //var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
        //var date = new Date();
        //var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return Template.instance().dateAsAt.get() || "-";
    },
    dateAsAtAYear: () => {
        return Template.instance().dateAsAtAYear.get() || "-";
    },
    transactiondatatablerecords: () => {
        return Template.instance().transactiondatatablerecords.get();
    },

    selectedObj: () => {
        return Template.instance().selectedObj.get().length;
    },

    netAssetTotal: () => {
        return Template.instance().netAssetTotal.get() || 0;
    },
    currentYear: () => {
        return Template.instance().currentYear.get();
    },
    nextYear: () => {
        return Template.instance().nextYear.get();
    },
    currentMonth: () => {
        return Template.instance().currentMonth.get();
    },
    currencyRecord: () => {
        return Template.instance().currencyRecord.get();
    },
    tabinationRecord: () => {
        return Template.instance().tabinationRecord.get();
    },
});

Template.balancesheetreport.events({

    'click .chkDatatable': function (event) {
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").attr('valueupdate');
        if ($(event.target).is(':checked')) {
            $('.' + columnDataValue).addClass('showColumn');
            $('.' + columnDataValue).removeClass('hiddenColumn');
        } else {
            $('.' + columnDataValue).addClass('hiddenColumn');
            $('.' + columnDataValue).removeClass('showColumn');
        }
    },
    'click .btnOpenReportSettings': () => {
        let templateObject = Template.instance();
        // let currenttranstablename = templateObject.data.tablename||";
        $(`thead tr th`).each(function (index) {
            var $tblrow = $(this);
            var colWidth = $tblrow.width() || 0;
            var colthClass = $tblrow.attr('data-class') || "";
            $('.rngRange' + colthClass).val(colWidth);
        });
        $('.' + templateObject.data.tablename + '_Modal').modal('toggle');
    },
    'change .custom-range': async function (event) {
        //   const tableHandler = new TableHandler();
        let range = $(event.target).val() || 0;
        let colClassName = $(event.target).attr("valueclass");
        await $('.' + colClassName).css('width', range);
        //   await $('.colAccountTree').css('width', range);
        $('.dataTable').resizable();
    },
    "click .currency-modal-save": (e) => {
        //$(e.currentTarget).parentsUntil(".modal").modal("hide");
        LoadingOverlay.show();

        let templateObject = Template.instance();

        // Get all currency list
        let _currencyList = templateObject.currencyList.get();

        // Get all selected currencies
        const currencySelected = $(".currency-selector-js:checked");
        let _currencySelectedList = [];
        if (currencySelected.length > 0) {
            $.each(currencySelected, (index, e) => {
                const sellRate = $(e).attr("sell-rate");
                const buyRate = $(e).attr("buy-rate");
                const currencyCode = $(e).attr("currency");
                const currencyId = $(e).attr("currency-id");
                let _currency = _currencyList.find((c) => c.id == currencyId);
                _currency.active = true;
                _currencySelectedList.push(_currency);
            });
        } else {
            let _currency = _currencyList.find((c) => c.code == defaultCurrencyCode);
            _currency.active = true;
            _currencySelectedList.push(_currency);
        }



        _currencyList.forEach((value, index) => {
            if (_currencySelectedList.some((c) => c.id == _currencyList[index].id)) {
                _currencyList[index].active = _currencySelectedList.find(
                    (c) => c.id == _currencyList[index].id
                ).active;
            } else {
                _currencyList[index].active = false;
            }
        });

        _currencyList = _currencyList.sort((a, b) => {
            if (a.code == defaultCurrencyCode) {
                return -1;
            }
            return 1;
        });

        // templateObject.activeCurrencyList.set(_activeCurrencyList);
        templateObject.currencyList.set(_currencyList);

        LoadingOverlay.hide();
    },
    "click .wide_viewbtn": function () {
        $("#wrapper_main").addClass("more-padding-bottom");
        $(".Standard_viewbtn, .header_section").show();
        $(".wide_viewbtn, .active_page").hide();
    },
    "click .Standard_viewbtn": function () {
        $("#wrapper_main").removeClass("more-padding-bottom");
        $(".wide_viewbtn, .active_page").show();
        $(".Standard_viewbtn , .header_section").hide();
    },
    "click .newReportHelp": function () {
        $(".report-tooltip").show();
    },
    "click .close_Bnt": function () {
        $(".report-tooltip").hide();
    },
    "click #printButtonBalanceSheet": function () {
        $("#printBalanceSheet").print({
            prepend: "<p style='margin-top: 80px; font-size: 23px;'>" +
                "<strong>" +
                loggedCompany +
                " - Balance Sheet</strong></p></br>",
            title: document.title + " | Balance Sheet | " + loggedCompany,
            noPrintSelector: ".addSummaryEditor",
        });
    },
    "click #balance-exportbtn-export": function () {
        let utilityService = new UtilityService();
        let templateObject = Template.instance();
        const filename = loggedCompany.substring(0, 3) + "-Balance Sheet" + ".xls";
        let rows = [];
        reportService.getBalanceSheetData().then(function (data) {
            if (data.balancesheetreport) {
                rows[0] = ["", "Balance Sheet", ""];
                rows[1] = ["", loggedCompany, ""];
                rows[2] = ["As at", templateObject.dateAsAt.get(), ""];
                data.balancesheetreport.forEach(function (e, i) {
                    rows.push([
                        data.balancesheetreport[i].ACCNAME,
                        data.balancesheetreport[i]["Sub Account Total"],
                        data.balancesheetreport[i]["Header Account Total"],
                    ]);
                });
                setTimeout(function () {
                    utilityService.exportToCsv(rows, filename, "xls");
                }, 1000);
            }
        });
    },
    "click td": async function (event) {
        let accountName = $(event.target).parent().first().text();
        let toDate = moment($("#balanceDate").val()).clone().endOf("month").format("YYYY-MM-DD");
        let fromDate = "1899-01-01";
        localStorage.setItem("showHeader", true);
        await clearData('TAccountRunningBalanceReport');
        window.open("/balancetransactionlist?accountName=" + accountName + "&toDate=" + toDate + "&fromDate=" + fromDate + "&isTabItem=" + false, "_self");
    },
    "click #moreOptionBal": function () {
        $("#more_search").show();
        $("#moreOptionBal").hide();
    },
    "click #fewerOptionbtn": function () {
        $("#more_search").hide();
        $("#moreOptionBal").show();
    },
    "click .currencyDropdown": function (event) {
        $("#currency").val(event.target.innerHTML);
    },
    "click .regionDropdown": function (event) {
        $("#region").val(event.target.innerHTML);
    },
    "click .sortDropdown": function (event) {
        $("#sort").val(event.target.innerHTML);
    },
    "click .compareToDropdown": function (event) {
        $("#compareTo").val(event.target.innerHTML);
    },
    "click .comparePeriodDropdown": function (event) {
        $("#comparePeriod").val(event.target.innerHTML);
    },
    "click .balanceDateDropdown": function (event) {
        $("#balanceDate").val(event.target.innerHTML);
    },
    "click .update_search": function () {
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
        if (!localStorage.getItem("AgedReceivablesTemplate")) {
            FlowRouter.go(url);
        }
    },
    "click #ignoreDate": function () {
        let templateObject = Template.instance();
        LoadingOverlay.show();
        localStorage.setItem("VS1BalanceSheet_Report", "");
        $("#dateFrom").attr("readonly", true);
        templateObject.getBalanceSheetReports(null, true);
    },
    "change .edtReportDates": (e) => {
        let templateObject = Template.instance();
        LoadingOverlay.show();
        localStorage.setItem("VS1BalanceSheet_Report", "");
        templateObject.getBalanceSheetReports(
            GlobalFunctions.convertYearMonthDay($('#dateFrom').val()),
            false
        )
    },
    ...Datehandler.getDateRangeEvents(),
    "click .sales-tab-item": function (event) {
        let tempInstance = Template.instance();
        let accountName = event.target.id.split("tabitem-")[1];
        accountName = accountName.split("_").join(" ");
        let toDate = moment($("#balanceDate").val())
            .clone()
            .endOf("month")
            .format("YYYY-MM-DD");
        let fromDate = moment($("#balanceDate").val())
            .clone()
            .startOf("year")
            .format("YYYY-MM-DD");
        window.open(
            "/balance-sheet-detail?accountName=" +
            accountName +
            "&toDate=" +
            toDate +
            "&fromDate=" +
            fromDate +
            "&isTabItem=" +
            true,
            "_self"
        );
    },
    "click #add-summary": function () {
        tinymce.remove();
        let utilityService = new UtilityService();
        let tempInstance = Template.instance();
        tempInstance.$("#add-summary").hide();
        utilityService.addSummaryTinyMCEditor("#editor-text");
        $("#editor-text_ifr").contents().find("p").css("margin", "0px");
        $("#summary-title").show();
        $("#tiny-editor").show();
        $("#editor-buttons").show();
        $(".text-editor-bg").show();
    },

    "click #cancel-editor": function () {
        $("#tiny-editor").hide();
        $("#editor-buttons").hide();
        $("#add-summary").show();
        $("#summary-title").hide();
        $(".text-editor-bg").hide();
    },

    "click #save-summary": function () {
        let tempInstance = Template.instance();
        tinymce.triggerSave();
        let summaryValue = $("#editor-text").val();
        $(".text-editor-bg").hide();
        let summaryItem =
            '<tr id="summary-row" class="summary-row"><td class="NotesDiv" colspan="12">' +
            '<div class="summary-item">' +
            '<span id="summary-number" class="summary-number"></span>' +
            '<span class="summary-text" id="summary-text-item">' +
            summaryValue +
            "</div></td></tr>";
        //tempInstance.$('.summarySection').append(summaryItem);

        $("#tiny-editor").hide();
        $("#editor-buttons").hide();
    },
    "click .btnRefresh": function () {
        LoadingOverlay.show();
        localStorage.setItem("VS1BalanceSheet_Report", "");
        Meteor._reload.reload();
        LoadingOverlay.hide();
    },
    "click .btnPrintReport": function (event) {
        playPrintAudio();
        setTimeout(function () {
            $("a").attr("href", "/");
            document.title = "Balance Sheet Report";
            $(".printReport").print({
                title: document.title + " | Balance Sheet | " + loggedCompany,
                noPrintSelector: ".addSummaryEditor",
                mediaPrint: false,
            });

            setTimeout(function () {
                $("a").attr("href", "#");
            }, 100);
        }, delayTimeAfterSound);
    },
    "click .btnExportReport": function () {
        LoadingOverlay.show();
        let utilityService = new UtilityService();
        let templateObject = Template.instance();
        let balanceDate = new Date($("#balancedate").datepicker("getDate"));

        let formatBalDate =
            balanceDate.getFullYear() +
            "-" +
            (balanceDate.getMonth() + 1) +
            "-" +
            balanceDate.getDate();
        const filename = loggedCompany + "-Balance Sheet" + ".csv";
        utilityService.exportReportToCsvTable("tblBalanceSheet", filename, "csv");
        let rows = [];
        LoadingOverlay.hide();
    },
    "keyup #myInputSearch": function (event) {
        $(".table tbody tr").show();
        let searchItem = $(event.target).val();
        if (searchItem != "") {
            var value = searchItem.toLowerCase();
            $(".table tbody tr").each(function () {
                var found = "false";
                $(this).each(function () {
                    if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                        found = "true";
                    }
                });
                if (found == "true") {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $(".table tbody tr").show();
        }
    },
    "blur #myInputSearch": function (event) {
        $(".table tbody tr").show();
        let searchItem = $(event.target).val();
        if (searchItem != "") {
            var value = searchItem.toLowerCase();
            $(".table tbody tr").each(function () {
                var found = "false";
                $(this).each(function () {
                    if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                        found = "true";
                    }
                });
                if (found == "true") {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $(".table tbody tr").show();
        }
    },
    ...FxGlobalFunctions.getEvents(),
});

Template.registerHelper("equal", function (a, b) {
    return a == b;
});

Template.registerHelper("equals", function (a, b) {
    return a === b;
});

Template.registerHelper("notEquals", function (a, b) {
    return a != b;
});

Template.registerHelper("containsequals", function (a, b) {
    let chechTotal = false;
    if (a.toLowerCase().indexOf(b.toLowerCase()) >= 0) {
        chechTotal = true;
    }
    return chechTotal;
});

Template.registerHelper("shortDate", function (a) {
    let dateIn = a;
    let dateOut = moment(dateIn, "DD/MM/YYYY").format("MMM YYYY");
    return dateOut;
});

Template.registerHelper("noDecimal", function (a) {
    let numIn = a;
    let numOut = parseInt(numIn);
    return numOut;
});
