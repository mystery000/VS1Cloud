import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../utility-service";
import '../lib/global/erp-objects';
import '../lib/global/indexdbstorage.js';
import 'jquery-editable-select';
import { Random } from 'meteor/random';
import { bankNameList } from "../lib/global/bank-names";

let utilityService = new UtilityService();

Template.newbankrule.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.bankRuleData = new ReactiveVar([]);
    templateObject.bankNames = new ReactiveVar([]);
});

Template.newbankrule.onRendered(function() {
    const templateObject = Template.instance();
    templateObject.bankNames.set(bankNameList);
});

Template.newbankrule.events({
    'click .lineField, keydown .lineField': function (event) {
        selectedLineID = $(event.target).closest('tr').attr('id');
        $("#fieldModal").modal("toggle");
    },
    'change .lineValue': function (event) {
        selectedLineID = $(event.target).closest('tr').attr('id');
    },
    'click .btnRemove': function (event) {
        selectedLineID = null;
        $(event.target).closest('tr').remove();
        event.preventDefault();
        setCalculated();
    },
    'click #addLineColumn': function() {
        let noDataLine = null;
        let rowData = null;
        rowData = $("#tblBankRule tbody #sampleData").clone(true);
        noDataLine = $("#tblBankRule tbody #noData");
        if (noDataLine != null) {
            noDataLine.remove();
        }
        if (rowData != null) {
            let tokenid = Random.id();
            $(".colID", rowData).text(tokenid);
            $(".lineField", rowData).val("");
            $(".lineCondition", rowData).val("");
            $(".lineValue", rowData).val("");
            rowData.attr("id", tokenid);
            rowData.show();
            $("#tblBankRule tbody").append(rowData);
        }
    },

    'click .btnSave': function (event) {
        playSaveAudio();
        setTimeout(function(){
        let selectedCard = $('#selectedCard').val();
        if (selectedCard == "spent") {
            let tblBankRuleRows = $('#tblBankRule tbody tr');
            let tblSpentFixedRows = $('#tblSpentFixedItem tbody tr');
            let tblSpentPercentRows = $('#tblSpentFixedItem tbody tr');
            let spentTotalPercent = $("#spentTotalPercent").text();
            spentTotalPercent = Number(spentTotalPercent.replace(/[^0-9.-]+/g, "")) || 0;
            if (spentTotalPercent != 100) {
                swal('The total percent must be 100%.', '', 'error');
                return false;
            }
            // $('.fullScreenSpin').css('display', 'inline-block');
        } else if (selectedCard == "received") {
            let receivedTotalPercent = $("#receivedTotalPercent").text();
            receivedTotalPercent = Number(receivedTotalPercent.replace(/[^0-9.-]+/g, "")) || 0;
            if (receivedTotalPercent != 100) {
                swal('The total percent must be 100%.', '', 'error');
                return false;
            }
        } else if (selectedCard == "transfer") {

        }
        swal('API is not ready.', '', 'error');
        return false;
    }, delayTimeAfterSound);
    },
    'click #btnSpentRule': function(event) {
        $('#btnSpentRule').addClass('ruleTypeActive');
        $('#btnReceivedRule').removeClass('ruleTypeActive');
        $('#btnTransferRule').removeClass('ruleTypeActive');
        $('#spentRuleCard').show();
        $('#receivedRuleCard').hide();
        $('#transferRuleCard').hide();
        $('#selectedCard').val("spent");
    },
    'click #btnReceivedRule': function(event) {
        $('#btnSpentRule').removeClass('ruleTypeActive');
        $('#btnReceivedRule').addClass('ruleTypeActive');
        $('#btnTransferRule').removeClass('ruleTypeActive');
        $('#spentRuleCard').hide();
        $('#receivedRuleCard').show();
        $('#transferRuleCard').hide();
        $('#selectedCard').val("received");
    },
    'click #btnTransferRule': function(event) {
        $('#btnSpentRule').removeClass('ruleTypeActive');
        $('#btnReceivedRule').removeClass('ruleTypeActive');
        $('#btnTransferRule').addClass('ruleTypeActive');
        $('#spentRuleCard').hide();
        $('#receivedRuleCard').hide();
        $('#transferRuleCard').show();
        $('#selectedCard').val("transfer");
    },
});

Template.newbankrule.helpers({
    taxraterecords: () => {
        return Template.instance()
            .taxraterecords.get()
            .sort(function (a, b) {
                if (a.description == "NA") {
                    return 1;
                } else if (b.description == "NA") {
                    return -1;
                }
                return a.description.toUpperCase() > b.description.toUpperCase()
                    ? 1
                    : -1;
            });
    },
    baselinedata : () => {
        return Template.instance().baselinedata.get();
    },
    spentConditionData : () => {
        return Template.instance().spentConditionData.get();
    },
    spentFixedItemData : () => {
        return Template.instance().spentFixedItemData.get();
    },
    spentPercentItemData : () => {
        return Template.instance().spentPercentItemData.get();
    },
    receivedConditionData : () => {
        return Template.instance().receivedConditionData.get();
    },
    receivedFixedItemData : () => {
        return Template.instance().receivedFixedItemData.get();
    },
    receivedPercentItemData : () => {
        return Template.instance().receivedPercentItemData.get();
    },
    transferConditionData : () => {
        return Template.instance().transferConditionData.get();
    },
    bankRuleData : () => {
        return Template.instance().bankRuleData.get();
    },
    bankNames: () => {
        return Template.instance()
          .bankNames.get()
          .sort(function (a, b) {
            return a.name > b.name ? 1 : -1;
          });
    },
});

function setCalculated() {
    let tblSpentFixedRows = $('#tblSpentFixedItem tbody tr');
    let spentFixedTotal = 0;
    let tblSpentPercentRows = $('#tblSpentPercentItem tbody tr');
    let spentPercentTotal = 0;
    let tblReceivedFixedRows = $('#tblReceivedFixedItem tbody tr');
    let receivedFixedTotal = 0;
    let tblReceivedPercentRows = $('#tblReceivedPercentItem tbody tr');
    let receivedPercentTotal = 0;
    tblSpentFixedRows.each(function (index) {
        const $tblrow = $(this);
        let trid = $tblrow.attr('id');
        if (trid != undefined && trid != 'sampleData' && trid != 'noData') {
            let lineAmount = $tblrow.find(".lineAmount").val();
            lineAmount = Number(lineAmount.replace(/[^0-9.-]+/g, "")) || 0;
            spentFixedTotal += lineAmount;
        }
    });
    tblSpentPercentRows.each(function (index) {
        const $tblrow = $(this);
        let trid = $tblrow.attr('id');
        if (trid != undefined && trid != 'sampleData' && trid != 'noData') {
            let linePercent = $tblrow.find(".linePercent").val();
            linePercent = Number(linePercent.replace(/[^0-9.-]+/g, "")) || 0;
            spentPercentTotal += linePercent;
        }
    });
    tblReceivedFixedRows.each(function (index) {
        const $tblrow = $(this);
        let trid = $tblrow.attr('id');
        if (trid != undefined && trid != 'sampleData' && trid != 'noData') {
            let lineAmount = $tblrow.find(".lineAmount").val();
            lineAmount = Number(lineAmount.replace(/[^0-9.-]+/g, "")) || 0;
            receivedFixedTotal += lineAmount;
        }
    });
    tblReceivedPercentRows.each(function (index) {
        const $tblrow = $(this);
        let trid = $tblrow.attr('id');
        if (trid != undefined && trid != 'sampleData' && trid != 'noData') {
            let linePercent = $tblrow.find(".linePercent").val();
            linePercent = Number(linePercent.replace(/[^0-9.-]+/g, "")) || 0;
            receivedPercentTotal += linePercent;
        }
    });
    $("#spentTotalAmount").text(utilityService.modifynegativeCurrencyFormat(spentFixedTotal));
    $("#spentTotalPercent").text(setPercentFormat(spentPercentTotal));
    $("#receivedTotalAmount").text(utilityService.modifynegativeCurrencyFormat(receivedFixedTotal));
    $("#receivedTotalPercent").text(setPercentFormat(receivedPercentTotal));
}

function setPercentFormat(price) {
    if(price < 0) {
        let currency = price.toString().split('-')[1];
        currency = (parseFloat(currency).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})) + '%';
        return currency;
    } else {
        return ((parseFloat(price).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})) + '%');
    }
}
