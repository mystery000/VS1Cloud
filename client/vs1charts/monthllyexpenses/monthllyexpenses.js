import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';

import { Template } from 'meteor/templating';
import './monthllyexpenses.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { template } from "lodash";

let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();

Template.monthllyexpenses.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();
  templateObject.salesperc = new ReactiveVar();
  templateObject.expenseperc = new ReactiveVar();
  templateObject.salespercTotal = new ReactiveVar();
  templateObject.expensepercTotal = new ReactiveVar();
  templateObject.topTenData = new ReactiveVar([]);
});

Template.monthllyexpenses.onRendered(()=>{

  const templateObject = Template.instance();
  templateObject.autorun(function() {
    const currentData = Template.currentData();
    const context = currentData.updateChart;
    if(context.update) {
        templateObject.updateChart(context.dateFrom, context.dateTo);
    }
  });

  let topTenData1 = [];
  let topTenSuppData1 = [];
  let topData = this;
  function chartClickEvent() {
    FlowRouter.go("/newprofitandloss?daterange=ignore&?show=loss");
  }

  if (!localStorage.getItem('VS1PNLPeriodReport_dash')) {
    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    var dateFrom = new Date();
    dateFrom.setMonth(dateFrom.getMonth()-6);
    dateFrom = dateFrom.getFullYear() +'-'+ ("0"+ (dateFrom.getMonth()+1)).slice(-2) + '-' + ("0"+ (dateFrom.getDate())).slice(-2);
    $("#expenses1").attr("href", "/agedpayables?dateFrom="+dateFrom+"&dateTo="+getLoadDate);
    getInvSales(function () {
      let currentDate = new Date();
      let currentMonthDate = currentDate.getMonth() + 1;
      let currentYear = currentDate.getFullYear();
      let currentMonthData = [];
      let prevMonthData = [];
      let prevMonth2Data = [];
      let prevMonth3Data = [];
      let prevMonth4Data = [];
      let prevMonth5Data = [];
      let prevMonth6Data = [];
      let prevMonth7Data = [];
      let totalPayment  = 0;
      let totalPayment2  = 0;
      let totalPayment3  = 0;
      let totalPayment4  = 0;
      let totalPayment5  = 0;
      let totalPayment6  = 0;
      let totalPayment7  = 0;
      let totalPayment8  = 0;
      var sessionmyExpenses = localStorage.getItem('myExpenses');
      if(sessionmyExpenses){
        setTimeout(function () {
        let filterData = _.filter(sessionmyExpenses.tapreport, function (sessionmyExpenses) {
          return sessionmyExpenses.Name
        });

        let graphData = _.orderBy(filterData, 'OrderDate');
        let initialData = _.filter(graphData, obj => (obj.OrderDate !== ''));

        for (let l = 0; l < initialData.length; l++) {
            let getMonth = new Date(initialData[l].OrderDate).getMonth() + 1;
            if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                totalPayment += initialData[l].OriginalAmount;

            } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                totalPayment2 += initialData[l].OriginalAmount;

            } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                totalPayment3 += initialData[l].OriginalAmount;

            } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                totalPayment4 += initialData[l].OriginalAmount;

            } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                totalPayment5 += initialData[l].OriginalAmount;

            } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                totalPayment6 += initialData[l].OriginalAmount;

            } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                totalPayment7 += initialData[l].OriginalAmount;

            } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                totalPayment8 += initialData[l].OriginalAmount;

            }
        }
        // topData.topTenData.set(data);
        let currentMonth = moment().format("MMMM").substring(0, 3);
        let prevMonth = (moment().subtract(1, 'months')).format("MMMM").substring(0, 3);// Current date (date month and year)
        let prevMonth2 = (moment().subtract(2, 'months')).format("MMMM").substring(0, 3);
        let prevMonth3 = (moment().subtract(3, 'months')).format("MMMM").substring(0, 3);
        let prevMonth4 = (moment().subtract(4, 'months')).format("MMMM").substring(0, 3);
        let prevMonth5 = (moment().subtract(5, 'months')).format("MMMM").substring(0, 3);
        let prevMonth6 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
        let prevMonth7 = (moment().subtract(7, 'months')).format("MMMM").substring(0, 3);

        var ctx = document.getElementById("myMonthlyExpensesChart").getContext("2d");
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              prevMonth7,
              prevMonth6,
              prevMonth5,
              prevMonth4,
              prevMonth3,
              prevMonth2,
              prevMonth,
              currentMonth
            ],
            datasets: [{
              label: 'Amount #'+ this.value,
              data: [
                '-'+totalPayment8,
                '-'+totalPayment7,
                '-'+totalPayment6,
                '-'+totalPayment5,
                '-'+totalPayment4,
                '-'+totalPayment3,
                '-'+totalPayment2,
                '-'+totalPayment
              ],

              backgroundColor: [
              '#f6c23e',
              '#f6c23e',
              '#f6c23e',
              '#f6c23e',
              '#f6c23e',
              '#f6c23e',
              '#f6c23e',
              '#f6c23e'
              ],
              borderColor: [
                'rgba(78,115,223,0)',
                'rgba(78,115,223,0)',
                'rgba(78,115,223,0)',
                'rgba(78,115,223,0)',
                'rgba(78,115,223,0)',
                'rgba(78,115,223,0)',
                'rgba(78,115,223,0)',
                'rgba(78,115,223,0)'
              ],
              borderWidth: 1
              }]
          },
          options: {
            'onClick' : chartClickEvent,
            maintainAspectRatio: false,
            responsive: true,
            tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel))|| 0.00;
              }
            }
          },
          "legend":{
            "display":false
          },
          "title":{},
          "scales":{
            "xAxes":[
              {"gridLines":{
              "color":"rgb(234, 236, 244)",
              "zeroLineColor":"rgb(234, 236, 244)",
              "drawBorder":false,
              "drawTicks":false,
              "borderDash":["2"],
              "zeroLineBorderDash":["2"],
              "drawOnChartArea":false},
              "ticks":{
              "fontColor":"#858796",
              "beginAtZero":true,
              "padding":20
            }}],
            "yAxes":[{
              "gridLines":{"color":"rgb(234, 236, 244)",
              "zeroLineColor":"rgb(234, 236, 244)",
              "drawBorder":false,
              "drawTicks":false,
              "borderDash":["2"],
              "zeroLineBorderDash":["2"]},
              "ticks":{
                "fontColor":"#858796",
                "beginAtZero":true,
                "padding":20
              }}]
            }}}
          );
        }, 0);
      }else{
        setTimeout(function () {
          let filterData = _.filter(sessionmyExpenses.tapreport, function (sessionmyExpenses) {
            return sessionmyExpenses.Name;
          });

          let graphData = _.orderBy(filterData, 'OrderDate');
          let initialData = _.filter(graphData, obj => (obj.OrderDate !== ''));

          for (let l = 0; l < initialData.length; l++) {
                  let getMonth = new Date(initialData[l].OrderDate).getMonth() + 1;
                  if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                      totalPayment += initialData[l].OriginalAmount;

                  } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                      totalPayment2 += initialData[l].OriginalAmount;

                  } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                      totalPayment3 += initialData[l].OriginalAmount;

                  } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                      totalPayment4 += initialData[l].OriginalAmount;

                  } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                      totalPayment5 += initialData[l].OriginalAmount;

                  } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                      totalPayment6 += initialData[l].OriginalAmount;

                  } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                      totalPayment7 += initialData[l].OriginalAmount;

                  } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].OrderDate).getFullYear()) {
                      totalPayment8 += initialData[l].OriginalAmount;

                  }
            }
            // topData.topTenData.set(data);
            let currentMonth = moment().format("MMMM").substring(0, 3);
            let prevMonth = (moment().subtract(1, 'months')).format("MMMM").substring(0, 3);// Current date (date month and year)
            let prevMonth2 = (moment().subtract(2, 'months')).format("MMMM").substring(0, 3);
            let prevMonth3 = (moment().subtract(3, 'months')).format("MMMM").substring(0, 3);
            let prevMonth4 = (moment().subtract(4, 'months')).format("MMMM").substring(0, 3);
            let prevMonth5 = (moment().subtract(5, 'months')).format("MMMM").substring(0, 3);
            let prevMonth6 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
            let prevMonth7 = (moment().subtract(7, 'months')).format("MMMM").substring(0, 3);

            var ctx = document.getElementById("myMonthlyExpensesChart").getContext("2d");
            var myChart = new Chart(ctx, {
              type: 'bar',
              data: {
              labels: [
              prevMonth7,
              prevMonth6,
              prevMonth5,
              prevMonth4,
              prevMonth3,
              prevMonth2,
              prevMonth,
              currentMonth
            ],
              datasets: [{
              label: 'Amount #'+ this.value,
              data: [
                '-'+totalPayment8,
                '-'+totalPayment7,
                '-'+totalPayment6,
                '-'+totalPayment5,
                '-'+totalPayment4,
                '-'+totalPayment3,
                '-'+totalPayment2,
                '-'+totalPayment
              ],

              backgroundColor: [
              '#00a3d3',
              '#00a3d3',
              '#00a3d3',
              '#00a3d3',
              '#00a3d3',
              '#00a3d3',
              '#00a3d3',
              '#00a3d3'
              ],
              borderColor: [
              'rgba(78,115,223,0)',
              'rgba(78,115,223,0)',
              'rgba(78,115,223,0)',
              'rgba(78,115,223,0)',
              'rgba(78,115,223,0)',
              'rgba(78,115,223,0)',
              'rgba(78,115,223,0)',
              'rgba(78,115,223,0)'
              ],
              borderWidth: 1
              }]
              },
              options: {
                'onClick' : chartClickEvent,
                maintainAspectRatio: false,
                responsive: true,
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                        return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel))|| 0.00;
                    }
                  }
                },
                "legend":{
                  "display":false
                },
                "title":{},
                "scales":{
                  "xAxes":[
                  {"gridLines":{
                      "color":"rgb(234, 236, 244)",
                      "zeroLineColor":"rgb(234, 236, 244)",
                      "drawBorder":false,
                      "drawTicks":false,
                      "borderDash":["2"],
                      "zeroLineBorderDash":["2"],
                      "drawOnChartArea":false},
                      "ticks":{
                      "fontColor":"#858796",
                      "beginAtZero":true,
                      "padding":20}}],
                      "yAxes":[{
                      "gridLines":{"color":"rgb(234, 236, 244)",
                      "zeroLineColor":"rgb(234, 236, 244)",
                      "drawBorder":false,
                      "drawTicks":false,
                      "borderDash":["2"],
                      "zeroLineBorderDash":["2"]},
                      "ticks":{
                      "fontColor":"#858796",
                      "beginAtZero":true,
                      "padding":20
                    }
                    }]
                  }
                }
              });
        },1000);
      }

    });

    function getInvSales(callback) {
        return new Promise((res, rej) => {
           callback();
        });
    }
  }else{
    setTimeout(function () {
      let data = JSON.parse(localStorage.getItem('VS1PNLPeriodReport_dash'));
      var currentDate2 = new Date();
      var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
      var dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth()-6);
      dateFrom = dateFrom.getFullYear() +'-'+ ("0"+ (dateFrom.getMonth()+1)).slice(-2) + '-' + ("0"+ (dateFrom.getDate())).slice(-2);
      $("#expenses1").attr("href", "/agedpayables?dateFrom="+dateFrom+"&dateTo="+getLoadDate);
      let month_1 = data[0].fields.DateDesc_1||'';
      let month_2 = data[0].fields.DateDesc_2||'';
      let month_3 = data[0].fields.DateDesc_3||'';
      let month_4 = data[0].fields.DateDesc_4||'';
      let month_5 = data[0].fields.DateDesc_5||'';
      let month_6 = data[0].fields.DateDesc_6||'';
      let month_7 = data[0].fields.DateDesc_7||'';


      let month_1_loss_exp = 0;
      let month_2_loss_exp = 0;
      let month_3_loss_exp = 0;
      let month_4_loss_exp = 0;
      let month_5_loss_exp = 0;
      let month_6_loss_exp = 0;
      let month_7_loss_exp = 0;
      let month_8_loss_exp = 0;

      let month_1_loss = 0;
      let month_2_loss = 0;
      let month_3_loss = 0;
      let month_4_loss = 0;
      let month_5_loss = 0;
      let month_6_loss = 0;
      let month_7_loss = 0;
      let month_8_loss = 0;

      let total_month_1_loss = 0;
      let total_month_2_loss = 0;
      let total_month_3_loss = 0;
      let total_month_4_loss = 0;
      let total_month_5_loss = 0;
      let total_month_6_loss = 0;
      let total_month_7_loss = 0;
      let total_month_8_loss = 0;

      for (let l = 0; l < data.length; l++) {
        if(data[l].fields.AccountTypeDesc.replace(/\s/g, '') == 'TotalExpenses'){
          month_1_loss_exp = data[l].fields.Amount_1 || 0;
          month_2_loss_exp = data[l].fields.Amount_2 ||0;
          month_3_loss_exp = data[l].fields.Amount_3 ||0;
          month_4_loss_exp = data[l].fields.Amount_4 ||0;
          month_5_loss_exp = data[l].fields.Amount_5 ||0;
          month_6_loss_exp = data[l].fields.Amount_6 ||0;
          month_7_loss_exp = data[l].fields.Amount_7 ||0;
          // month_8_loss_exp = data[l].Amount_8 ||0;
        }

        if(data[l].fields.AccountTypeDesc.replace(/\s/g, '') == 'TotalCOGS'){
          month_1_loss = data[l].fields.Amount_1 || 0;
          month_2_loss = data[l].fields.Amount_2 || 0;
          month_3_loss = data[l].fields.Amount_3 || 0;
          month_4_loss = data[l].fields.Amount_4 || 0;
          month_5_loss = data[l].fields.Amount_5 || 0;
          month_6_loss = data[l].fields.Amount_6 || 0;
          month_7_loss = data[l].fields.Amount_7 || 0;
          //month_8_loss = data[l].Amount_8 || 0;
        }
      }

      total_month_1_loss = (Number(month_1_loss) + Number(month_1_loss_exp));
      total_month_2_loss = (Number(month_2_loss) + Number(month_2_loss_exp));
      total_month_3_loss = (Number(month_3_loss) + Number(month_3_loss_exp));
      total_month_4_loss = (Number(month_4_loss) + Number(month_4_loss_exp));
      total_month_5_loss = (Number(month_5_loss) + Number(month_5_loss_exp));
      total_month_6_loss = (Number(month_6_loss) + Number(month_6_loss_exp));
      total_month_7_loss = (Number(month_7_loss) + Number(month_7_loss_exp));
      var ctx = document.getElementById("myMonthlyExpensesChart").getContext("2d");
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: [
        month_1,
        month_2,
        month_3,
        month_4,
        month_5,
        month_6,
        month_7
      ],
        datasets: [{
        label: 'Amount #'+ this.value,
        data: [
          total_month_1_loss,
          total_month_2_loss,
          total_month_3_loss,
          total_month_4_loss,
          total_month_5_loss,
          total_month_6_loss,
          total_month_7_loss
        ],

        backgroundColor: [
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e'
        ],
        borderColor: [
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)'
        ],
        borderWidth: 1
        }]
        },
        options: {
          'onClick' : chartClickEvent,
          maintainAspectRatio: false,
          responsive: true,
        tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel))|| 0.00;

            }
        }
      },
        "legend":{
        "display":false
        },
        "title":{},
        "scales":{
        "xAxes":[
        {"gridLines":{
        "color":"rgb(234, 236, 244)",
        "zeroLineColor":"rgb(234, 236, 244)",
        "drawBorder":false,
        "drawTicks":false,
        "borderDash":["2"],
        "zeroLineBorderDash":["2"],
        "drawOnChartArea":false},
        "ticks":{
        "fontColor":"#858796",
        "beginAtZero":true,
        "padding":20}}],
        "yAxes":[{
        "gridLines":{"color":"rgb(234, 236, 244)",
        "zeroLineColor":"rgb(234, 236, 244)",
        "drawBorder":false,
        "drawTicks":false,
        "borderDash":["2"],
        "zeroLineBorderDash":["2"]},
        "ticks":{
        "fontColor":"#858796",
        "beginAtZero":true,
        "padding":20
        }
        }
        ]
        }
        }
      });
    }, 1000);
  }

  templateObject.updateChart = (dateFrom, dateTo) => {
    setTimeout(function () {
      let data = JSON.parse(localStorage.getItem('VS1PNLPeriodReport_dash'));
      $("#expenses1").attr("href", "/agedpayables?dateFrom="+dateFrom+"&dateTo="+dateTo);

      let month_1 = data[0].fields.DateDesc_1||'';
      let month_2 = data[0].fields.DateDesc_2||'';
      let month_3 = data[0].fields.DateDesc_3||'';
      let month_4 = data[0].fields.DateDesc_4||'';
      let month_5 = data[0].fields.DateDesc_5||'';
      let month_6 = data[0].fields.DateDesc_6||'';
      let month_7 = data[0].fields.DateDesc_7||'';

      let month_1_loss_exp = 0;
      let month_2_loss_exp = 0;
      let month_3_loss_exp = 0;
      let month_4_loss_exp = 0;
      let month_5_loss_exp = 0;
      let month_6_loss_exp = 0;
      let month_7_loss_exp = 0;
      let month_8_loss_exp = 0;

      let month_1_loss = 0;
      let month_2_loss = 0;
      let month_3_loss = 0;
      let month_4_loss = 0;
      let month_5_loss = 0;
      let month_6_loss = 0;
      let month_7_loss = 0;
      let month_8_loss = 0;

      let total_month_1_loss = 0;
      let total_month_2_loss = 0;
      let total_month_3_loss = 0;
      let total_month_4_loss = 0;
      let total_month_5_loss = 0;
      let total_month_6_loss = 0;
      let total_month_7_loss = 0;
      let total_month_8_loss = 0;

      for (let l = 0; l < data.length; l++) {
        if(data[l].fields.AccountTypeDesc.replace(/\s/g, '') == 'TotalExpenses'){
          month_1_loss_exp = data[l].fields.Amount_1 || 0;
          month_2_loss_exp = data[l].fields.Amount_2 ||0;
          month_3_loss_exp = data[l].fields.Amount_3 ||0;
          month_4_loss_exp = data[l].fields.Amount_4 ||0;
          month_5_loss_exp = data[l].fields.Amount_5 ||0;
          month_6_loss_exp = data[l].fields.Amount_6 ||0;
          month_7_loss_exp = data[l].fields.Amount_7 ||0;
        }

        if(data[l].fields.AccountTypeDesc.replace(/\s/g, '') == 'TotalCOGS'){
          month_1_loss = data[l].fields.Amount_1 || 0;
          month_2_loss = data[l].fields.Amount_2 || 0;
          month_3_loss = data[l].fields.Amount_3 || 0;
          month_4_loss = data[l].fields.Amount_4 || 0;
          month_5_loss = data[l].fields.Amount_5 || 0;
          month_6_loss = data[l].fields.Amount_6 || 0;
          month_7_loss = data[l].fields.Amount_7 || 0;
        }
      }

      total_month_1_loss = (Number(month_1_loss) + Number(month_1_loss_exp));
      total_month_2_loss = (Number(month_2_loss) + Number(month_2_loss_exp));
      total_month_3_loss = (Number(month_3_loss) + Number(month_3_loss_exp));
      total_month_4_loss = (Number(month_4_loss) + Number(month_4_loss_exp));
      total_month_5_loss = (Number(month_5_loss) + Number(month_5_loss_exp));
      total_month_6_loss = (Number(month_6_loss) + Number(month_6_loss_exp));
      total_month_7_loss = (Number(month_7_loss) + Number(month_7_loss_exp));

      let list_months = [
        month_1,
        month_2,
        month_3,
        month_4,
        month_5,
        month_6,
        month_7
      ];

      let list_total_month = [
        total_month_1_loss,
        total_month_2_loss,
        total_month_3_loss,
        total_month_4_loss,
        total_month_5_loss,
        total_month_6_loss,
        total_month_7_loss
      ];
      startIdx = list_months.indexOf(moment(dateFrom).format('MMM YYYY'));
      toIdx = list_months.indexOf(moment(dateTo).format("MMM YYYY"));
      if(startIdx < 0) startIdx = 0;
      list_months = list_months.slice(startIdx, toIdx+1);
      list_total_month = list_total_month.slice(startIdx, toIdx+1);

      var ctx = document.getElementById("myMonthlyExpensesChart").getContext("2d");
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: list_months,
        datasets: [{
        label: 'Amount #'+ this.value,
        data: list_total_month,
        backgroundColor: [
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e'
        ],
        borderColor: [
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)'
        ],
        borderWidth: 1
        }]
        },
        options: {
          'onClick' : chartClickEvent,
          maintainAspectRatio: false,
          responsive: true,
        tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel))|| 0.00;

            }
        }
      },
        "legend":{
        "display":false
        },
        "title":{},
        "scales":{
        "xAxes":[
        {"gridLines":{
        "color":"rgb(234, 236, 244)",
        "zeroLineColor":"rgb(234, 236, 244)",
        "drawBorder":false,
        "drawTicks":false,
        "borderDash":["2"],
        "zeroLineBorderDash":["2"],
        "drawOnChartArea":false},
        "ticks":{
        "fontColor":"#858796",
        "beginAtZero":true,
        "padding":20}}],
        "yAxes":[{
        "gridLines":{"color":"rgb(234, 236, 244)",
        "zeroLineColor":"rgb(234, 236, 244)",
        "drawBorder":false,
        "drawTicks":false,
        "borderDash":["2"],
        "zeroLineBorderDash":["2"]},
        "ticks":{
        "fontColor":"#858796",
        "beginAtZero":true,
        "padding":20
        }
        }
        ]
        }
        }
      });
    }, 1000);
  }
});


Template.monthllyexpenses.helpers({
  dateAsAt: () =>{
      return Template.instance().dateAsAt.get() || '-';
  },
  topTenData: () => {
        return Template.instance().topTenData.get();
  },
  Currency: () => {
        return Currency;
  },
  companyname: () =>{
      return loggedCompany;
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
