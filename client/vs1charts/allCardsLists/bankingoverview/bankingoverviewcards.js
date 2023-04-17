import { Template } from 'meteor/templating';
import { PaymentsService } from '../../../payments/payments-service.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../../js/core-service.js';
import { EmployeeProfileService } from "../../../js/profile-service.js";
import { AccountService } from "../../../accounts/account-service.js";
import { UtilityService } from "../../../utility-service.js";
import { SideBarService } from '../../../js/sidebar-service.js';

import {Session} from 'meteor/session';

import './bankingoverviewcards.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { _ } from 'meteor/underscore';
const _tabGroup = 12;
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.bankingoverviewcards.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.bankaccountdatarecord = new ReactiveVar([]);
});

Template.bankingoverviewcards.onRendered(function() {
    let templateObject = Template.instance();

    templateObject.getDataFromAPI = function() {
        $(".fullScreenSpin").css("display", "inline-block");      
        sideBarService.getAccountListVS1().then(async function(data) {
            $(".fullScreenSpin").css("display", "none");      
            addVS1Data('TAccountVS1',JSON.stringify(data));
            let useData = data.taccountvs1;            
            templateObject.displayData(useData)              
        }).catch(function(err) {
            $(".fullScreenSpin").css("display", "none");
        });
    }

    templateObject.displayData = function(useData) {
        let arrayDataUse = [];
        let totalAmountCalculation = '';
        for (let i = 0; i < useData.length; i++) {
            if ((useData[i].fields.AccountTypeName == 'CCARD') && (useData[i].fields.Balance != 0) || (useData[i].fields.AccountTypeName == 'BANK') && (useData[i].fields.Balance != 0)) {
                arrayDataUse.push(useData[i].fields);
                let filterDueDateData = _.filter(arrayDataUse, function(data) {
                    return data.AccountName
                });
                let groupData = _.omit(_.groupBy(filterDueDateData, 'AccountName'), ['']);
                totalAmountCalculation = _.map(groupData, function(value, key) {
                    let totalBalance = 0;
                    let creditcard = 'fas fa-credit-card';
                    let id = 0;
                    for (let i = 0; i < value.length; i++) {
                        id = value[i].ID;
                        totalBalance += value[i].Balance;
                        let accountName = value[i].AccountName.toLowerCase();
                        if (accountName.includes("credit")) {
                            creditcard = 'fas fa-credit-card';
                        } else if (accountName.includes("mastercard")) {
                            creditcard = 'fab fa-cc-mastercard'
                        } else if (accountName.includes("bank")) {
                            creditcard = 'fab fa-cc-visa'
                        }
                    }
                    let userObject = {};
                    userObject.id = id;
                    userObject.name = key;
                    userObject.totalbalance = utilityService.modifynegativeCurrencyFormat(totalBalance);
                    userObject.card = creditcard;
                    userObject.cardAccountID = 'banking-' + key.replaceAll(' ', '').toLowerCase();
                    return userObject;
                });
            }
        }
        let sortedArray = [];
        sortedArray = totalAmountCalculation.sort(function(a, b) {
            return b.totalbalance - a.totalbalance;
        });
        let getTop4Data = sortedArray;            
        templateObject.bankaccountdatarecord.set(getTop4Data);        
    }

    getVS1Data('TAccountVS1').then(function(dataObject) {
        if (dataObject.length == 0) {
            templateObject.getDataFromAPI()
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.taccountvs1;            
            templateObject.displayData(useData)
        }
    }).catch(function(err) {
        templateObject.getDataFromAPI()
    });

    $(document).on("change", "#dateFrom, #dateTo", templateObject.getDataFromAPI)
});

Template.bankingoverviewcards.events({
  'click .opentransBank': async function(event) {
      let bankAccountName = $(event.target).closest('.openaccountreceivable').attr('id');
      // FlowRouter.go('/accounttransactions?id=' + id);
      await clearData('TAccountRunningBalanceReport');
      FlowRouter.go("/balancetransactionlist?accountName=" +bankAccountName +"&isTabItem=" +false);
  }
});
Template.bankingoverviewcards.helpers({
    bankaccountdatarecord: () => {
        return Template.instance().bankaccountdatarecord.get();
    }
});
