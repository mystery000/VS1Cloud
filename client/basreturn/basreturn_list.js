import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { UtilityService } from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import { ReportService } from "../reports/report-service";
import '../lib/global/indexdbstorage.js';
import LoadingOverlay from '../LoadingOverlay';
import GlobalFunctions from '../GlobalFunctions';
import { TaxRateService } from '../settings/settings-service';
import FxGlobalFunctions from '../packages/currency/FxGlobalFunctions';

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './basreturn_list.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let utilityService = new UtilityService();
let sideBarService = new SideBarService();
let taxRateService = new TaxRateService();
let reportService = new ReportService();

let defaultCurrencyCode = CountryAbbr;

const months = [];
months["January"] = "01";
months["February"] = "02";
months["March"] = "03";
months["April"] = "04";
months["May"] = "05";
months["June"] = "06";
months["July"] = "07";
months["August"] = "08";
months["September"] = "09";
months["October"] = "10";
months["November"] = "11";
months["December"] = "12";

Template.basreturnlist.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    // Currency related vars //
    FxGlobalFunctions.initVars(templateObject);

    templateObject.getDataTableList = function(data) {
        // const datefrom = $("#dateFrom").val();
        // const dateto = $("#dateTo").val();
        //
        // let fromDate = datefrom == "" ? moment().subtract(2, 'month').format('DD/MM/YYYY') : datefrom;
        // let toDate = dateto == "" ? moment().format("DD/MM/YYYY") : dateto;
        //
        // fromDate = new Date(fromDate.split("/")[2]+"-"+fromDate.split("/")[1]+"-"+(parseInt(fromDate.split("/")[0])+1)+" 00:00:01");
        // toDate = new Date(toDate.split("/")[2]+"-"+toDate.split("/")[1]+"-"+(parseInt(toDate.split("/")[0])+1)+" 23:59:59");
        //
        // let sort_date = data.fields.MsTimeStamp == "" ? "1770-01-01" : data.fields.MsTimeStamp;
        // sort_date = new Date(sort_date);
        var dataList;
        // //if (sort_date >= fromDate && sort_date <= toDate )
        {
            let tab1startDate = "";
            let tab1endDate = "";
            let tab2startDate = "";
            let tab2endDate = "";
            let tab3startDate = "";
            let tab3endDate = "";
            let tab4startDate = "";
            let tab4endDate = "";
            if (data.fields.Tab1_Year > 0 && data.fields.Tab1_Month != "") {
                tab1startDate = data.fields.Tab1_Year + "-" + months[data.fields.Tab1_Month] + "-01";
                var endMonth = (data.fields.Tab1_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.fields.Tab1_Month]) / 3) * 3) : (months[data.fields.Tab1_Month]);
                tab1endDate = new Date(data.fields.Tab1_Year, (parseInt(endMonth)), 0);
                tab1endDate = moment(tab1endDate).format("YYYY-MM-DD");
            }
            if (data.fields.Tab2_Year > 0 && data.fields.Tab2_Month != "") {
                tab2startDate = data.fields.Tab2_Year + "-" + months[data.fields.Tab2_Month] + "-01";
                var endMonth = (data.fields.Tab2_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.fields.Tab2_Month]) / 3) * 3) : (months[data.fields.Tab2_Month]);
                tab2endDate = new Date(data.fields.Tab2_Year, (parseInt(endMonth)), 0);
                tab2endDate = moment(tab2endDate).format("YYYY-MM-DD");
            }
            if (data.fields.Tab3_Year > 0 && data.fields.Tab3_Month != "") {
                tab3startDate = data.fields.Tab3_Year + "-" + months[data.fields.Tab3_Month] + "-01";
                var endMonth = (data.fields.Tab3_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.fields.Tab3_Month]) / 3) * 3) : (months[data.fields.Tab3_Month]);
                tab3endDate = new Date(data.fields.Tab3_Year, (parseInt(endMonth)), 0);
                tab3endDate = moment(tab3endDate).format("YYYY-MM-DD");
            }
            if (data.fields.Tab4_Year > 0 && data.fields.Tab4_Month != "") {
                tab4startDate = data.fields.Tab4_Year + "-" + months[data.fields.Tab4_Month] + "-01";
                var endMonth = (data.fields.Tab4_Type == "Quarterly") ? (Math.ceil(parseInt(months[data.fields.Tab4_Month]) / 3) * 3) : (months[data.fields.Tab4_Month]);
                tab4endDate = new Date(data.fields.Tab4_Year, (parseInt(endMonth)), 0);
                tab4endDate = moment(tab4endDate).format("YYYY-MM-DD");
            }

            dataList = [
                    data.fields.ID || '',
                    data.fields.BasSheetDesc || '',
                    data.fields.Tab1_Type,
                    tab1startDate,
                    tab1endDate,
                    (tab2startDate != "" && tab2endDate != "") ? data.fields.Tab2_Type : "",
                    tab2startDate,
                    tab2endDate,
                    (tab3startDate != "" && tab3endDate != "") ? data.fields.Tab3_Type : "",
                    tab3startDate,
                    tab3endDate,
                    // (tab4startDate != "" && tab4endDate != "") ? data.fields.Tab4_Type : "",
                    // tab4startDate,
                    // tab4endDate,
                    data.fields.Active ? "" : "In-Active",
                ];
        }
        return dataList;
    }

    let headerStructure = [
        { index: 0, label: "BAS Number", class: "colBasNumber", width: "80", active: true, display: true },
        { index: 1, label: "Description", class: "colBasName", width: "250", active: true, display: true },
        { index: 2, label: "GST\nPeriod", class: "t1Period", width: "100", active: true, display: true },
        { index: 3, label: "GST\nFrom", class: "t1From", width: "120", active: true, display: true },
        { index: 4, label: "GST\nTo", class: "t1To", width: "120", active: true, display: true },
        { index: 5, label: "Withheld\nPeriod", class: "t2Period", width: "100", active: true, display: true },
        { index: 6, label: "Withheld\nFrom", class: "t2From", width: "120", active: true, display: true },
        { index: 7, label: "Withheld\nTo", class: "t2To", width: "120", active: true, display: true },
        { index: 8, label: "instalment\nPeriod", class: "t3Period", width: "100", active: true, display: true },
        { index: 9, label: "instalment\nFrom", class: "t3From", width: "120", active: true, display: true },
        { index: 10, label: "instalment\nTo", class: "t3To", width: "120", active: true, display: true },
        { index: 11, label: "Active", class: "colStatus", width: "60", active: true, display: true },
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.basreturnlist.onRendered(function() {
    // $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    const dataTableList = [];
    const tableHeaderList = [];
    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    }

    function MakeNegative() {

        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
        $('td.colStatus').each(function() {
            if ($(this).text() == "Deleted") $(this).addClass('text-deleted');
            if ($(this).text() == "Full") $(this).addClass('text-fullyPaid');
            if ($(this).text() == "Part") $(this).addClass('text-partialPaid');
            if ($(this).text() == "Rec") $(this).addClass('text-reconciled');
        });
    };

    $('#tblBASReturnList tbody').on('click', 'tr', function() {
        var listData = $(this).closest('tr').find(".colBasNumber").text();
        var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';

        if (listData) {
            if (checkDeleted == "Deleted") {
                swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
            } else {
                FlowRouter.go('/basreturn?id=' + listData);
            }
        }
    });
});

Template.basreturnlist.events({
    "click .btnRefresh": function() {
        $(".fullScreenSpin").css("display", "inline-block");
        let templateObject = Template.instance();
        reportService.getAllBASReturn().then(function(data) {
            addVS1Data("TBASReturn", JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {
                window.open("/basreturnlist", "_self");
            }).catch(function(err) {
                window.open("/basreturnlist", "_self");
            });
        }).catch(function(err) {
            window.open("/basreturnlist", "_self");
        });
    },
    "click #btnNewBasReturn": function(event) {
        FlowRouter.go("/basreturn");
    },
    // "click .chkDatatable": function(event) {
    //     var columns = $("#tblBASReturnList th");
    //     let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();
    //
    //     $.each(columns, function(i, v) {
    //         let className = v.classList;
    //         let replaceClass = className[1];
    //
    //         if (v.innerText == columnDataValue) {
    //             if ($(event.target).is(":checked")) {
    //                 $("." + replaceClass + "").css("display", "table-cell");
    //                 $("." + replaceClass + "").css("padding", ".75rem");
    //                 $("." + replaceClass + "").css("vertical-align", "top");
    //             } else {
    //                 $("." + replaceClass + "").css("display", "none");
    //             }
    //         }
    //     });
    // },
    // "click .btnRefreshBasReturn": function(event) {
    //     $(".btnRefresh").trigger("click");
    // },
    "click .resetTable": function(event) {
        Meteor._reload.reload();
    },
    "click .saveTable": function(event) {
        let lineItems = [];
        //let datatable =$('#tblJournalList').DataTable();
        $(".columnSettings").each(function(index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text() || "";
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(":checked")) {
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
            };

            lineItems.push(lineItemObj);
        });
        //datatable.state.save();
        $("#myModal2").modal("toggle");
        //Meteor._reload.reload();
    },
    "click .btnOpenSettings": function(event) {
        let templateObject = Template.instance();
        var columns = $("#tblBASReturnList th");

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if (v.className.includes("hiddenColumn")) {
                columVisible = false;
            }
            sWidth = v.style.width.replace("px", "");

            let datatablerecordObj = {
                sTitle: v.innerText || "",
                sWidth: sWidth || "",
                sIndex: v.id || "",
                sVisible: columVisible || false,
                sClass: v.className || ""
            };
            tableHeaderList.push(datatablerecordObj);
        });

        templateObject.tableheaderrecords.set(tableHeaderList);
    },
    "click #exportbtn": function() {
        $(".fullScreenSpin").css("display", "inline-block");
        jQuery("#tblBASReturnList_wrapper .dt-buttons .btntabletocsv").click();
        $(".fullScreenSpin").css("display", "none");
    },
    "click .printConfirm": function(event) {
        playPrintAudio();
        setTimeout(function() {
            $(".fullScreenSpin").css("display", "inline-block");
            jQuery("#tblBASReturnList_wrapper .dt-buttons .btntabletopdf").click();
            $(".fullScreenSpin").css("display", "none");
            // $('#html-2-pdfwrapper').css('display','block');
            // var pdf =  new jsPDF('portrait','mm','a4');
            // new jsPDF('p', 'pt', 'a4');
            //   pdf.setFontSize(18);
            //   var source = document.getElementById('html-2-pdfwrapper');
            //   pdf.addHTML(source, function () {
            //      pdf.save('journalentrylist.pdf');
            //      $('#html-2-pdfwrapper').css('display','none');
            //  });
        }, delayTimeAfterSound);
    },
    // CURRENCY MODULE //
    ...FxGlobalFunctions.getEvents(),
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
});

Template.basreturnlist.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get()
            // .sort(function(a, b) {
            //     if (a.transactiondate == "NA") {
            //         return 1;
            //     } else if (b.transactiondate == "NA") {
            //         return -1;
            //     }
            //     return a.transactiondate.toUpperCase() > b.transactiondate.toUpperCase() ?
            //         1 :
            //         -1;
            // });
    },

    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: localStorage.getItem("mycloudLogonID"), PrefName: "tblJournalList" });
    },
    currentdate: () => {
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        return begunDate;
    },


    // FX Module
    convertAmount: (amount, currencyData) => {
        let currencyList = Template.instance().tcurrencyratehistory.get(); // Get tCurrencyHistory

        if (isNaN(amount)) {
            if (!amount || amount.trim() == "") {
                return "";
            }
            amount = utilityService.convertSubstringParseFloat(amount); // This will remove all currency symbol
        }
        // if (currencyData.code == defaultCurrencyCode) {
        //    default currency
        //   return amount;
        // }

        // Lets remove the minus character
        const isMinus = amount < 0;
        if (isMinus == true)
            amount = amount * -1; // make it positive for now

        //  get default currency symbol
        // let _defaultCurrency = currencyList.filter(
        //   (a) => a.Code == defaultCurrencyCode
        // )[0];

        // amount = amount.replace(_defaultCurrency.symbol, "");

        // amount =
        //   isNaN(amount) == true
        //     ? parseFloat(amount.substring(1))
        //     : parseFloat(amount);

        // Get the selected date
        let dateTo = $("#dateTo").val();
        const day = dateTo.split("/")[0];
        const m = dateTo.split("/")[1];
        const y = dateTo.split("/")[2];
        dateTo = new Date(y, m, day);
        dateTo.setMonth(dateTo.getMonth() - 1); // remove one month (because we added one before)

        // Filter by currency code
        currencyList = currencyList.filter(a => a.Code == currencyData.code);

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

        let rate = currencyData.code == defaultCurrencyCode ?
            1 :
            firstElem.BuyRate; // Must used from tcurrecyhistory

        amount = parseFloat(amount * rate); // Multiply by the rate
        amount = Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }); // Add commas

        let convertedAmount = isMinus == true ?
            `- ${currencyData.symbol} ${amount}` :
            `${currencyData.symbol} ${amount}`;

        return convertedAmount;
    },
    count: array => {
        return array.length;
    },
    countActive: array => {
        if (array.length == 0) {
            return 0;
        }
        let activeArray = array.filter(c => c.active == true);
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
        let activeArray = array.filter(c => c.active == true);

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
        let activeArray = array.filter(c => c.active == true);

        return activeArray.length > 0;
    },
    isObject(variable) {
        return typeof variable === "object" && variable !== null;
    },
    currency: () => {
        return Currency;
    },

    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    apiFunction:function() {
        let reportService = new ReportService();
        return reportService.getAllBASReturn;
    },

    searchAPI: function() {
        return reportService.getAllBASReturn;
    },

    service: ()=>{
        let reportService = new ReportService();
        return reportService;

    },

    datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    exDataHandler: function() {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    apiParams: function() {
        return ["limitCount", "limitFrom", "deleteFilter", "dateFrom", "dateTo", "ignoredate"];
    },
});
