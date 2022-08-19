import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.profitabilitychart.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();

  templateObject.salesperc = new ReactiveVar();
  templateObject.expenseperc = new ReactiveVar();
  templateObject.salespercTotal = new ReactiveVar();
  templateObject.expensepercTotal = new ReactiveVar();

  templateObject.netincomepercTotal = new ReactiveVar();
  templateObject.netincomeperc = new ReactiveVar();

  templateObject.grossprofitpercTotal = new ReactiveVar();
  templateObject.grossprofitperc = new ReactiveVar();

  templateObject.totalSales = new ReactiveVar();
  templateObject.grossProfit = new ReactiveVar();
  templateObject.totalExpenses = new ReactiveVar();
  templateObject.nettProfit = new ReactiveVar();
});

Template.profitabilitychart.onRendered(()=>{
  const templateObject = Template.instance();
  let utilityService = new UtilityService();

  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = (currentDate.getMonth() + 1);
  let fromDateDay = currentDate.getDate();
  if((currentDate.getMonth()+1) < 10){
    fromDateMonth = "0" + (currentDate.getMonth()+1);
  }
  if(currentDate.getDate() < 10){
    fromDateDay = "0" + currentDate.getDate();
  }

  templateObject.dateAsAt.set(begunDate);

  var currentDate2 = new Date();
  var currentDate3 = new Date();
  currentDate3.setMonth(currentDate3.getMonth() - 1);
  var dateFrom = new Date();
  var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
  var getLoadDate2 = moment(currentDate2).format("YYYY-MM-DD");

  dateFrom.setMonth(dateFrom.getMonth()-6);
  dateFrom = dateFrom.getFullYear() +'-'+ ("0"+ (dateFrom.getMonth()+1)).slice(-2) + '-' + ("0"+ (dateFrom.getDate())).slice(-2);
  $("#profitloss1").attr("href", "/newprofitandloss?dateFrom="+dateFrom+"&dateTo="+getLoadDate);
  let totalExpense = localStorage.getItem('VS1ProfitandLoss_ExpEx_dash') || 0;
  let totalCOGS = localStorage.getItem('VS1ProfitandLoss_COGSEx_dash') || 0;
  let totalSales = localStorage.getItem('VS1ProfitandLoss_IncomeEx_dash') || 0;
  let totalNetIncome = localStorage.getItem('VS1ProfitandLoss_netIncomeEx_dash') || 0;
  
  let totalSalesPerc = 0;
  let totalExpensePerc = 0;
  let grossProfitPerc = 0;
  let totalNetIncomePerc = 0;
  let totalSumProfitLoss = 0;
  let sumTotalExpense = Math.abs(Number(totalExpense) + Number(totalCOGS)) || 0;
  let grossProfit = (Number(totalSales) + Number(totalExpense) + Number(totalCOGS)) || 0;

  templateObject.totalSales.set(utilityService.modifynegativeCurrencyFormat(totalSales));
  templateObject.grossProfit.set(utilityService.modifynegativeCurrencyFormat(grossProfit));
  templateObject.totalExpenses.set(utilityService.modifynegativeCurrencyFormat(sumTotalExpense));
  templateObject.nettProfit.set(utilityService.modifynegativeCurrencyFormat(totalNetIncome));

  $('.spnTotalSales').html(utilityService.modifynegativeCurrencyFormat(totalSales));
  $('.spnGrossProfit').html(utilityService.modifynegativeCurrencyFormat(grossProfit));
  $('.spnTotalExpense').html(utilityService.modifynegativeCurrencyFormat(Math.abs(sumTotalExpense)));
  $('.spnTotalnetincome').html(utilityService.modifynegativeCurrencyFormat(totalNetIncome));
  

  if((!isNaN(sumTotalExpense))&&(!isNaN(totalSales))){
    setTimeout(function  (){
      totalSumProfitLoss =  (Number(totalSales) + Math.abs(sumTotalExpense)) || 0;

      totalExpensePerc = (sumTotalExpense / totalSumProfitLoss) * 100;
      totalSalesPerc = (totalSales / totalSumProfitLoss) * 100;
      grossProfitPerc = (grossProfit / totalSumProfitLoss) * 100;
      totalNetIncomePerc = (totalNetIncome / totalSumProfitLoss) * 100;

      // templateObject.netincomeperc.set(Math.abs(totalNetIncomePerc));
      templateObject.netincomepercTotal.set(parseInt(Math.abs(totalNetIncomePerc)));
      templateObject.salespercTotal.set(parseInt(Math.abs(totalSalesPerc)));
      templateObject.expensepercTotal.set(parseInt(Math.abs(totalExpensePerc)));
      templateObject.grossprofitpercTotal.set(parseInt(Math.abs(grossProfitPerc)));
      templateObject.salesperc.set(totalSalesPerc);

      if(totalExpensePerc < 0 ){
        templateObject.expenseperc.set(Math.abs(totalExpensePerc));
      }else{
        templateObject.expenseperc.set(totalExpensePerc);
      }
    }, 1000);
  }
});

Template.profitabilitychart.events({

});

Template.profitabilitychart.helpers({
  dateAsAt: () =>{
      return Template.instance().dateAsAt.get() || '-';
  },
  salesperc: () =>{
      return Template.instance().salesperc.get() || 0;
  },
  expenseperc: () =>{
      return Template.instance().expenseperc.get() || 0;
  },
  salespercTotal: () =>{
      return Template.instance().salespercTotal.get() || 0;
  },
  expensepercTotal: () =>{
      return Template.instance().expensepercTotal.get() || 0;
  },
  grossprofitpercTotal: () =>{
      return Template.instance().grossprofitpercTotal.get() || 0;
  },
  netincomepercTotal: () =>{
      return Template.instance().netincomepercTotal.get() || 0;
  },
  netincomeperc: () =>{
      return Template.instance().netincomeperc.get() || 0;
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

