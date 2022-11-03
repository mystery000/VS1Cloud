import { ReportService } from "../report-service";
import { SalesBoardService } from "../../js/sales-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import GlobalFunctions from "../../GlobalFunctions";
import LoadingOverlay from "../../LoadingOverlay";
import { TaxRateService } from "../../settings/settings-service";
import FxGlobalFunctions from "../../packages/currency/FxGlobalFunctions";

let defaultCurrencyCode = CountryAbbr; // global variable "AUD"

let reportService = new ReportService();
let utilityService = new UtilityService();
let taxRateService = new TaxRateService();
let salesService = new SalesBoardService();
let initCurrency = Currency;

Template.exepositionreport.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.titleMonth1 = new ReactiveVar();
    templateObject.titleMonth2 = new ReactiveVar();

    templateObject.avgDebtors1 = new ReactiveVar();
    templateObject.avgCreditors1 = new ReactiveVar();
    templateObject.shortTermCash1 = new ReactiveVar();
    templateObject.currentAsset1 = new ReactiveVar();
    templateObject.termAsset1 = new ReactiveVar();
    templateObject.avgDebtors2 = new ReactiveVar();
    templateObject.avgCreditors2 = new ReactiveVar();
    templateObject.shortTermCash2 = new ReactiveVar();
    templateObject.currentAsset2 = new ReactiveVar();
    templateObject.termAsset2 = new ReactiveVar();
    templateObject.titleMonth1 = new ReactiveVar();
    templateObject.titleMonth2 = new ReactiveVar();

    templateObject.dateAsAt = new ReactiveVar();
    templateObject.currencyList = new ReactiveVar([]);
    templateObject.activeCurrencyList = new ReactiveVar([]);
    templateObject.tcurrencyratehistory = new ReactiveVar([]);
});

Template.exepositionreport.onRendered(() => {
    const templateObject = Template.instance();

    templateObject.setMonthsOnHeader = (yy, mm, dd) => {
        var currentDate = new Date(yy, mm, dd);
        const monSml = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var currMonth1 = "", currMonth2 = "";
        if (currentDate.getMonth() == 0) {
            currMonth1 = monSml[10] + " " + (currentDate.getFullYear() - 1);
            currMonth2 = monSml[11] + " " + (currentDate.getFullYear() - 1);
        } else if (currentDate.getMonth() == 1) {
            currMonth1 = monSml[11] + " " + (currentDate.getFullYear() - 1);
            currMonth2 = monSml[0] + " " + currentDate.getFullYear();
        } else {
            currMonth1 = monSml[currentDate.getMonth() - 2] + " " + currentDate.getFullYear();
            currMonth2 = monSml[currentDate.getMonth() - 1] + " " + currentDate.getFullYear();
        }
        $(".titleMonth1").html(currMonth1);
        $(".titleMonth2").html(currMonth2);
    }

    $(document).ready(function () {
        $("#balancedate").datepicker({
            showOn: "button",
            buttonText: "Show Date",
            buttonImageOnly: true,
            buttonImage: "/img/imgCal2.png",
            dateFormat: "dd/mm/yy",
            // dateFormat: 'yy-mm-dd',
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

        let imageData = localStorage.getItem("Image");
        if (imageData) {
            $("#uploadedImage").attr("src", imageData);
            $("#uploadedImage").attr("width", "50%");
        }
    });

    let avgDebtors = [0, 0];
    let avgCreditors = [0, 0];
    let shortTermCash = [0, 0];
    let currentAsset = [0, 0];
    let termAsset = [0, 0];

    let varianceRed = "#ff420e";
    let varianceGreen = "#579D1C"; //#1cc88a

    templateObject.setFieldVariance = function (fieldVal1, fieldVal2, fieldSelector) {
        var fieldVariance = 0;
        var fieldVariance = 0;
        if (fieldVal1 == 0 && fieldVal2 == 0) {
            fieldVariance = 0;
        } else if (fieldVal1 == 0) {
            fieldVariance = fieldVal2;
        } else if (fieldVal2 == 0) {
            fieldVariance = (-1) * fieldVal1;
        } else {
            // if (fieldVal2 >= fieldVal1) {
            //     fieldVariance = (fieldVal2 / fieldVal1) * 100;
            // } else {
            //     fieldVariance = (fieldVal1 / fieldVal2) * (-100);
            // }
            if (fieldVal1 > 0 && fieldVal2 > 0) {
                fieldVariance = (fieldVal2 / fieldVal1) * 100;
            }
            if (fieldVal1 > 0 && fieldVal2 < 0) {
                fieldVariance = (Math.abs(fieldVal2) / fieldVal1) * 100;
            }
            if (fieldVal1 < 0 && fieldVal2 > 0) {
                fieldVariance = (Math.abs(fieldVal1) / fieldVal2) * 100;
            }
            if (fieldVal1 < 0 && fieldVal2 < 0) {
                fieldVariance = (fieldVal2 / fieldVal1) * 100;
            }
        }
        if (fieldVariance >= 0) {
            $('.' + fieldSelector).css("color", varianceGreen);
        } else {
            $('.' + fieldSelector).css("color", varianceRed);
        }
        $('.' + fieldSelector).html(fieldVariance.toFixed(2));
    }

    templateObject.getPositionReports = async (dateAsOf, ignoreDate = false) => {
        LoadingOverlay.show();
        try {
            let data = await reportService.getCardDataReport(dateAsOf);
            if (data.tcarddatareport) {
                let resData = data.tcarddatareport[0];
                avgDebtors[0] = parseInt(resData.Pos_AvgDebtDays1);
                avgDebtors[1] = parseInt(resData.Pos_AvgDebtDays2);
                avgCreditors[0] = parseInt(resData.Pos_AvgCredDays1);
                avgCreditors[1] = parseInt(resData.Pos_AvgCredDays2);
                shortTermCash[0] = parseFloat(resData.Pos_CashForecast1);
                shortTermCash[1] = parseFloat(resData.Pos_CashForecast2);
                currentAsset[0] = parseFloat(resData.Pos_AssetToLiab1);
                currentAsset[1] = parseFloat(resData.Pos_AssetToLiab2);
                termAsset[0] = parseFloat(resData.Sheet_AssetToLiab1);
                termAsset[1] = parseFloat(resData.Sheet_AssetToLiab2);
            }

            templateObject.avgDebtors1.set(avgDebtors[0]);
            templateObject.avgCreditors1.set(avgCreditors[0]);
            templateObject.shortTermCash1.set(utilityService.modifynegativeCurrencyFormat(shortTermCash[0].toFixed(2)));
            templateObject.currentAsset1.set(utilityService.modifynegativeCurrencyFormat(currentAsset[0].toFixed(2)));
            templateObject.termAsset1.set(utilityService.modifynegativeCurrencyFormat(termAsset[0].toFixed(2)));
            templateObject.avgDebtors2.set(avgDebtors[1]);
            templateObject.avgCreditors2.set(avgCreditors[1]);
            templateObject.shortTermCash2.set(utilityService.modifynegativeCurrencyFormat(shortTermCash[1].toFixed(2)));
            templateObject.currentAsset2.set(utilityService.modifynegativeCurrencyFormat(currentAsset[1].toFixed(2)));
            templateObject.termAsset2.set(utilityService.modifynegativeCurrencyFormat(termAsset[1].toFixed(2)));

            templateObject.setFieldVariance(avgDebtors[0], avgDebtors[1], "spnAverageDebtorsVariance");
            templateObject.setFieldVariance(avgCreditors[0], avgCreditors[1], "spnAverageCreditorsVariance");
            templateObject.setFieldVariance(shortTermCash[0], shortTermCash[1], "spnShortTermCashVariance");
            templateObject.setFieldVariance(currentAsset[0], currentAsset[1], "spnCurrentAssetVariance");
            templateObject.setFieldVariance(termAsset[0], termAsset[1], "spnTermAssetVariance");
        } catch (err) {

        }
        LoadingOverlay.hide();
    };
    var currentDate = new Date();
    var getLoadDate = moment(currentDate).format("YYYY-MM-DD");
    // var getLoadDate = currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (currentDate.getDate())).slice(-2);
    let pDate = FlowRouter.current().queryParams.viewDate || getLoadDate;
    templateObject.getPositionReports(pDate);
    let strDate = "";
    if (pDate.length == 10)
        strDate = pDate;
    else
        strDate = pDate.substring(1, 11);
    arrDate = strDate.split("-");
    let newbalanceDate = new Date(arrDate[0], eval(arrDate[1]) - 1, arrDate[2]);
    templateObject.setMonthsOnHeader(arrDate[0], eval(arrDate[1]) - 1, arrDate[2]);
    let newbalanceDate2 = moment(newbalanceDate).format("DD/MM/YYYY")
    $("#balancedate").val(newbalanceDate2);
    templateObject.dateAsAt.set(newbalanceDate2);
});

function sortByAlfa(a, b) {
    return a.currency - b.currency;
}
Template.exepositionreport.helpers({
    titleMonth1: () => {
        return Template.instance().titleMonth1.get();
    },
    titleMonth2: () => {
        return Template.instance().titleMonth2.get();
    },
    avgDebtors1: () => {
        return Template.instance().avgDebtors1.get() || 0;
    },
    avgCreditors1: () => {
        return Template.instance().avgCreditors1.get() || 0;
    },
    shortTermCash1: () => {
        return Template.instance().shortTermCash1.get() || 0;
    },
    currentAsset1: () => {
        return Template.instance().currentAsset1.get() || 0;
    },
    termAsset1: () => {
        return Template.instance().termAsset1.get() || 0;
    },
    avgDebtors2: () => {
        return Template.instance().avgDebtors2.get() || 0;
    },
    avgCreditors2: () => {
        return Template.instance().avgCreditors2.get() || 0;
    },
    shortTermCash2: () => {
        return Template.instance().shortTermCash2.get() || 0;
    },
    currentAsset2: () => {
        return Template.instance().currentAsset2.get() || 0;
    },
    termAsset2: () => {
        return Template.instance().termAsset2.get() || 0;
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
        let dateTo = $("#balancedate").val();
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
                `- ${currencyData.symbol} ${amount}` :
                `${currencyData.symbol} ${amount}`;
        // let convertedAmount =
        //     isMinus == true ?
        //         `- ${amount}` :
        //         `${amount}`;

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
    }
});

Template.exepositionreport.events({
    "change .balancedate": function () {
        let templateObject = Template.instance();
        LoadingOverlay.show();
        let balanceDate = $("#balancedate").val();
        let arrDate = balanceDate.split("/");
        // let formatBalDate = moment(balanceDate).format("YYYY-MM-DD");
        let formatBalDate = arrDate[2] + "-" + arrDate[1] + "-" + arrDate[0];
        templateObject.setMonthsOnHeader(arrDate[2], eval(arrDate[1]) - 1, arrDate[0]);
        localStorage.setItem("VS1BalanceSheet_Report", "");
        templateObject.getPositionReports(formatBalDate);
        var formatDate = moment(formatBalDate).format("DD MMM YYYY");
        templateObject.dateAsAt.set(formatDate);
        LoadingOverlay.hide();
    },
    "change input[type='checkbox']": (event) => {
        // This should be global
        $(event.currentTarget).attr(
            "checked",
            $(event.currentTarget).prop("checked")
        );
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
    "click .btnRefresh": function () {
        LoadingOverlay.show();
        localStorage.setItem("VS1BalanceSheet_Report", "");
        Meteor._reload.reload();
        LoadingOverlay.hide();
    },
    "click .btnPrintReport": function (event) {
        playPrintAudio();
        setTimeout(function(){
        $("a").attr("href", "/");
        document.title = "Position (Executive) Report";
        $(".printReport").print({
            title: document.title + " | Position (Executive) | " + loggedCompany,
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

        const filename = loggedCompany + "-Position" + ".csv";
        utilityService.exportReportToCsvTable("tableExport", filename, "csv");
        // let rows = [];
        // reportService.getBalanceSheetReport(formatBalDate).then(function (data) {
        //     if(data.balancesheetreport){
        //         rows[0] = ['Account Tree','Account Number', 'Sub Total', 'Totals'];
        //         data.balancesheetreport.forEach(function (e, i) {
        //             rows.push([data.balancesheetreport[i]['Account Tree'],data.balancesheetreport[i].AccountNumber, utilityService.modifynegativeCurrencyFormat(data.balancesheetreport[i]['Sub Account Total']),utilityService.modifynegativeCurrencyFormat(data.balancesheetreport[i]['Header Account Total'])]);
        //         });
        //         setTimeout(function () {
        //             utilityService.exportReportToCsv(rows, filename, 'xls');
        //             $('.fullScreenSpin').css('display','none');
        //         }, 1000);
        //     }
        //
        // });
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
    // numIn= $(numIn).val().substring(1);
    // numIn= $(numIn).val().replace('$','');

    // numIn= $numIn.text().replace('-','');
    let numOut = parseInt(numIn);
    return numOut;
});
