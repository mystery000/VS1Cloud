import { ReactiveVar } from "meteor/reactive-var";
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
const GaugeChart = require('gauge-chart');

import "gauge-chart";

Template.dashboardsalesmanager.onCreated(function () {
  this.loggedDb = new ReactiveVar("");
  const templateObject = Template.instance();
  templateObject.includeDashboard = new ReactiveVar();
  templateObject.includeDashboard.set(false);
});

Template.dashboardsalesmanager.onRendered(function () {
  let templateObject = Template.instance();
  let isDashboard = Session.get("CloudDashboardModule");
  if (isDashboard) {
    templateObject.includeDashboard.set(true);
  }

  function renderSPMEmployeeChart(employeeNames, employeeSalesQuota) {
    highCharts.chart('spd-employee-chart', {
      series: [{
          name: 'Employees',
          data: employeeSalesQuota

      }],
      chart: {
          type: 'column'
      },
      title: {
          text: ''
      },
      subtitle: {
          text:
              'Discount Given By Employees'
      },
      xAxis: {
          categories: employeeNames
      },
      yAxis: {
          allowDecimals: false,
          title: {
              text: ''
          }
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.series.name + '</b><br/>' +
                  this.point.y;
          }
      }
    });
  }

  function renderSPDCharts() {
    // Properties of the gauge
    let gaugeOptions = {
      hasNeedle: true,
      needleValue: 20,
      needleColor: 'gray',
      needleUpdateSpeed: 1000,
      arcColors: ['#FE4619', '#F6961D', '#ECDB21', '#AEE12B', '#69D72D', 'lightgray'],
      arcLabels: ['200k', '400k', '600k', '800k'],
      arcDelimiters: [20, 40, 60, 80],
      rangeLabel: ['0', '100'],
      centralLabel: '',
    }
    // Drawing and updating the chart
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area1'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area2'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area3'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area4'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area5'), 400, gaugeOptions).updateNeedle(50);
    GaugeChart.gaugeChart(document.querySelector('#spd-gauge-area6'), 400, gaugeOptions).updateNeedle(50);
  }
  setTimeout(() => renderSPDCharts(), 500);
  templateObject.getDashboardData = function () {
    getVS1Data('TProspectEx').then(function (dataObject) {
        if(dataObject.length) {
            let {tprospect = []} = JSON.parse(dataObject[0].data);
            let leadsThisMonthCount = 0;
            const currentMonth = new Date().getMonth();
            tprospect.forEach(prospect  =>  {
                if(currentMonth === new Date(prospect.fields.CreationDate).getMonth() && prospect.fields.SourceName) {
                    leadsThisMonthCount += 1;
                }
            });
            $('#new-leads-month').text(leadsThisMonthCount);
        }
    }).catch(function (err) {
    });

    getVS1Data('TQuoteList').then(function (dataObject) {
        if(dataObject.length) {
            let {tquotelist = []} = JSON.parse(dataObject[0].data);
            let dealsThisMonthCount = 0;
            let convertedQuotesCount = 0;
            let nonConvertedQuotesCount = 0;
            let convertedQuotesAmount = 0;
            const currentMonth = new Date().getMonth();
            tquotelist.forEach(tquote  =>  {
                if(currentMonth === new Date(tquote.SaleDate).getMonth()) {
                    dealsThisMonthCount += 1;
                    if(tquote.Converted) {
                        convertedQuotesCount +=1;
                        convertedQuotesAmount += tquote.Balance;
                    } else {
                        nonConvertedQuotesCount += 1;
                    }
                }
            });
            const winRate = convertedQuotesCount ? parseInt((convertedQuotesCount/convertedQuotesCount+nonConvertedQuotesCount) * 100) : 0;
            const avgSalesCycle = convertedQuotesAmount ? convertedQuotesAmount/30 : convertedQuotesAmount;
            $('#sales-winrate').text(winRate.toFixed(2));
            $('#new-deals-month').text(dealsThisMonthCount);
            $('#avg-sales-cycle').text(avgSalesCycle.toFixed(2));
        }
    }).catch(function (err) {
    });

    getVS1Data('TInvoiceList').then(function (dataObject) {
        if(dataObject.length) {
            let {tinvoicelist} = JSON.parse(dataObject[0].data);
            let closedDealsThisMonth = 0;
            let closedDealsThisYear = 0;
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            tinvoicelist.forEach(tinvoice  =>  {
                if(currentMonth === new Date(tinvoice.SaleDate).getMonth()) {
                    closedDealsThisMonth += tinvoice.Balance;
                }

                if(currentYear === new Date(tinvoice.SaleDate).getFullYear()) {
                    closedDealsThisYear += tinvoice.Balance;
                }
            });
            $('#closed-deals-month').text(closedDealsThisMonth.toFixed(2));
            $('#closed-deals-year').text(closedDealsThisYear.toFixed(2));
        }
    }).catch(function (err) {
    });

    getVS1Data('TEmployee').then(function (dataObject) {
        let employeeNames = [];
        let employeeSalesQuota = [];
        if(dataObject.length) {
            let {temployee = []} = JSON.parse(dataObject[0].data);
            temployee.forEach(employee => {
                employeeNames.push(employee.fields.EmployeeName);
                employeeSalesQuota.push(isNaN(parseInt(employee.fields.CustFld12)) ? 0 : parseInt(employee.fields.CustFld12));
            });
        }
        renderSPMEmployeeChart(employeeNames, employeeSalesQuota);
    });
  }
  templateObject.getDashboardData();
});

Template.dashboardsalesmanager.helpers({
  includeDashboard: () => {
    const res = Template.instance().includeDashboard.get();
    return res;
  },
  loggedDb: function () {
    return Template.instance().loggedDb.get();
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
});

// Listen to event to update reactive variable
Template.dashboardsalesmanager.events({

});
