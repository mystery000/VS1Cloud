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
import './vatreturn_list.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let utilityService = new UtilityService();
let sideBarService = new SideBarService();
let taxRateService = new TaxRateService();
let reportService = new ReportService();

let defaultCurrencyCode = CountryAbbr;


Template.vatreturnlist.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    // Currency related vars //
    FxGlobalFunctions.initVars(templateObject);
});

Template.vatreturnlist.onRendered(function() {
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

    $('#tblVATReturnList tbody').on('click', 'tr', function() {
        var listData = $(this).closest('tr').attr('id');
        var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';

        if (listData) {
            if (checkDeleted == "Deleted") {
                swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
            } else {
                FlowRouter.go('/vatreturn?id=' + listData);
            }
        }
    });
});

Template.vatreturnlist.events({
    "click .btnRefresh": function() {
        $(".fullScreenSpin").css("display", "inline-block");
        let templateObject = Template.instance();
        reportService.getAllVATReturn().then(function(data) {
            addVS1Data("TVATReturn", JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {
                window.open("/vatreturnlist", "_self");
            }).catch(function(err) {
                window.open("/vatreturnlist", "_self");
            });
        }).catch(function(err) {
            window.open("/vatreturnlist", "_self");
        });
    },
    "click #btnNewVATReturn": function(event) {
        FlowRouter.go("/vatreturn");
    },
    "click .chkDatatable": function(event) {
        var columns = $("#tblVATReturnList th");
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(":checked")) {
                    $("." + replaceClass + "").css("display", "table-cell");
                    $("." + replaceClass + "").css("padding", ".75rem");
                    $("." + replaceClass + "").css("vertical-align", "top");
                } else {
                    $("." + replaceClass + "").css("display", "none");
                }
            }
        });
    },
    "click .btnRefreshBasReturn": function(event) {
        $(".btnRefresh").trigger("click");
    },
    "click .resetTable": function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: localStorage.getItem("mycloudLogonID"), clouddatabaseID: localStorage.getItem("mycloudLogonDBID") });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: "tblJournalList" });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {} else {
                            Meteor._reload.reload();
                        }
                    });
                }
            }
        }
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
        var getcurrentCloudDetails = CloudUser.findOne({ _id: localStorage.getItem("mycloudLogonID"), clouddatabaseID: localStorage.getItem("mycloudLogonDBID") });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: "tblJournalList" });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: "salesform",
                            PrefName: "tblJournalList",
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $("#myModal2").modal("toggle");
                        } else {
                            $("#myModal2").modal("toggle");
                        }
                    });
                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: "salesform",
                        PrefName: "tblJournalList",
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
                        if (err) {
                            $("#myModal2").modal("toggle");
                        } else {
                            $("#myModal2").modal("toggle");
                        }
                    });
                }
            }
        }
        $("#myModal2").modal("toggle");
        //Meteor._reload.reload();
    },
    "click .btnOpenSettings": function(event) {
        let templateObject = Template.instance();
        var columns = $("#tblVATReturnList th");

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
        jQuery("#tblVATReturnList_wrapper .dt-buttons .btntabletocsv").click();
        $(".fullScreenSpin").css("display", "none");
    },
    "click .printConfirm": function(event) {
        playPrintAudio();
        setTimeout(function() {
            $(".fullScreenSpin").css("display", "inline-block");
            jQuery("#tblVATReturnList_wrapper .dt-buttons .btntabletopdf").click();
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

Template.vatreturnlist.helpers({
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
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
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
    }
});