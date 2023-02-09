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
import './departmentOptionModal.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let utilityService = new UtilityService();
let sideBarService = new SideBarService();
let taxRateService = new TaxRateService();
let reportService = new ReportService();

let defaultCurrencyCode = CountryAbbr;

Template.departmentOptionModal.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    // Currency related vars //
    FxGlobalFunctions.initVars(templateObject);
});

Template.departmentOptionModal.onRendered(function() {
});

Template.departmentOptionModal.events({
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
    "click .chkDatatable": function(event) {
        var columns = $("#tblBASReturnList th");
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

Template.departmentOptionModal.helpers({
});
