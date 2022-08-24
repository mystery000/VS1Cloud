import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.cashchart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.titleMonth1 = new ReactiveVar();
  templateObject.titleMonth2 = new ReactiveVar();
  templateObject.cashReceived = new ReactiveVar();
  templateObject.cashSpent = new ReactiveVar();
  templateObject.cashSurplus = new ReactiveVar();
  templateObject.bankBalance = new ReactiveVar();
});

Template.cashchart.onRendered(()=>{
  const templateObject = Template.instance();  
  var currentDate = new Date();
  const monSml = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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
  templateObject.titleMonth1.set(currMonth1);
  templateObject.titleMonth2.set(currMonth2);

  // getVS1Data('TAccountVS1').then(function(dataObject) {
  //   if (dataObject.length == 0) {
  //   } else {
  //     let data = JSON.parse(dataObject[0].data);
  //     let useData = data.taccountvs1;
  //   }
  // }).catch(function(err) {
  // });
  let bankBalance = Number(localStorage.getItem('VS1TAccount_Bank_dash'));
  let payrollBankClearing = Number(localStorage.getItem('VS1TAccount_Bank_Payroll_Clearing_dash'));
  let pettyCash = Number(localStorage.getItem('VS1TAccount_Petty_Cash_dash'));
  let payrollBank = Number(localStorage.getItem('VS1TAccount_Payroll_Bank_dash'));
  let offsetAccountBalance = Number(localStorage.getItem('VS1TAccount_Offset_Account_dash'));

  let cashReceived = bankBalance + pettyCash + offsetAccountBalance;
  let cashSpent = Math.abs(payrollBankClearing + payrollBank);
  let cashSurplus = cashReceived - cashSpent;

  templateObject.cashReceived.set(utilityService.modifynegativeCurrencyFormat(cashReceived));
  templateObject.cashSpent.set(utilityService.modifynegativeCurrencyFormat(cashSpent));
  templateObject.cashSurplus.set(utilityService.modifynegativeCurrencyFormat(cashSurplus));
  templateObject.bankBalance.set(utilityService.modifynegativeCurrencyFormat(bankBalance));

  $('.spnCashReceived').html(utilityService.modifynegativeCurrencyFormat(cashReceived));
  $('.spnCashSpent').html(utilityService.modifynegativeCurrencyFormat(cashSpent));
  $('.spnCashSurplus').html(utilityService.modifynegativeCurrencyFormat(cashSurplus));
  $('.spnBankBalance').html(utilityService.modifynegativeCurrencyFormat(bankBalance));

});

Template.cashchart.events({
});

Template.cashchart.helpers({
  titleMonth1: () =>{
      return Template.instance().titleMonth1.get();
  },
  titleMonth2: () =>{
      return Template.instance().titleMonth2.get();
  },
  cashReceived: () =>{
      return Template.instance().cashReceived.get() || 0;
  },
  cashSpent: () =>{
      return Template.instance().cashSpent.get() || 0;
  },
  cashSurplus: () =>{
      return Template.instance().cashSurplus.get() || 0;
  },
  bankBalance: () =>{
      return Template.instance().bankBalance.get() || 0;
  }
});

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.registerHelper('notEquals', function (a, b) {
  return a != b;
});

Template.registerHelper('containsequals', function (a, b) {
  return (a.indexOf(b) >= 0 );
});


