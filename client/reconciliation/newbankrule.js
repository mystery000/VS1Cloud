import { ReactiveVar, ReactiveArray } from 'meteor/reactive-var';
import '../lib/global/erp-objects';
import '../lib/global/indexdbstorage.js';
import 'jquery-editable-select';
import { Random } from 'meteor/random';
import { bankNameList } from "../lib/global/bank-names";

Template.newbankrule.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.bankRuleData = new ReactiveVar([]);
    templateObject.bankNames = new ReactiveVar([]);
});

Template.newbankrule.onRendered(function() {
    const templateObject = Template.instance();
    templateObject.bankNames.set(bankNameList);
    templateObject.bankRuleData.set([]);
});

Template.newbankrule.events({
    'change .lineColumn': function (event) {
        let dataId = $(event.currentTarget).data('id');
        let tmp = Template.instance().bankRuleData.get();
        tmp[dataId].column = $(event.currentTarget).val();
        Template.instance().bankRuleData.set(tmp);
    },
    'blur .lineOrder': function (event) {
        let dataId = $(event.currentTarget).data('id');
        let tmp = Template.instance().bankRuleData.get();
        let tmpValue = $(event.currentTarget).val();
        if (tmpValue > 0 && tmpValue <= tmp.length) {
            for (let index = 0; index < tmp.length; index++) {
                if (tmp[index].order == tmpValue) {
                    tmp[index].order = tmp[dataId].order
                    tmp[dataId].order = tmpValue
                    break
                }
            }
            tmp[dataId].order = tmpValue
        } else {
            $(event.currentTarget).val(tmp[dataId].order)
        }
        Template.instance().bankRuleData.set(tmp);
    },
    'click .btnRemove': function (event) {
        event.preventDefault();
        let dataId = $(event.currentTarget).data('id');
        let tmp = Template.instance().bankRuleData.get()
        tmp.splice(dataId, 1);
        Template.instance().bankRuleData.set(tmp);
    },
    'click #addLineColumn': function() {
        let noDataLine = null;
        noDataLine = $("#tblBankRule tbody #noData");
        if (noDataLine != null) {
            noDataLine.remove();
        }
        let a = Template.instance().bankRuleData.get()
        a.push({order: a.length + 1, column: ""})
        Template.instance().bankRuleData.set(a)
    },

    'click .btnSave': function (event) {
        playSaveAudio();
        setTimeout(function(){
            let tmp = Template.instance().bankRuleData.get()
            if (tmp.length === 0) {
                swal('Please add columns', '', 'error');
            } else {
                swal({
                    title: 'Bank Rule Successfully Saved',
                    text: "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {

                    } else if (result.dismiss === 'cancel') {

                    }
                });
            }
        }, delayTimeAfterSound);
    },
});

Template.newbankrule.helpers({
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
    orderNumber: (val) => val + 1,
 });

