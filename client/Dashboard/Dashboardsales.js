import { ReactiveVar } from "meteor/reactive-var";
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);

Template.dashboardsales.onCreated(function () {
  this.loggedDb = new ReactiveVar("");
  const templateObject = Template.instance();
  templateObject.includeDashboard = new ReactiveVar();
  templateObject.includeDashboard.set(false);
});

Template.dashboardsales.onRendered(function () {
  let templateObject = Template.instance();
  let isDashboard = Session.get("CloudDashboardModule");
  if (isDashboard) {
    templateObject.includeDashboard.set(true);
  }

  function renderCharts() {
    renderComparisonChart();
    renderOppertunitiesChart();
  };

  function renderComparisonChart() {
    const series = [{
        name: 'Quota Amount',
        data: [10000, 15000, 20000]
    }, {
        name: 'Expected Amount',
        data: [2800, 18000, 30000]
    }, {
        name: 'Closed/Won',
        data: [5100, 12000, 15000]
    }];
    const categories =  ['April 2014', 'July 2014', 'Oct 2014'];

    highCharts.chart('sd-comparison-chart', {
        title: {
            text: 'Sales Performance VS Quota'
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        xAxis: {
            categories
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
  }

  function renderOppertunitiesChart() {
    const amount = [1000, 2000, 3000, 4000, 5000];
    const expectedAmount = [1500, 2500, 2500, 4500, 5000];
    const categories = ['Qualification', 'Process Analysis', 'Negotiation Review', 'Needs Analysis', 'Proposal Price Quote'];
    highCharts.chart('opens-oppertunities-chart', {
      series: [{
          name: 'Amount',
          data: amount
          
      }, {
        name: 'Expected Amount',
        data: expectedAmount
        
    }],
      chart: {
          type: 'column'
      },
      subtitle: {
          text:
              'Open Oppertunities by Stage'
      },
      xAxis: {
          categories
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

  setTimeout(() => renderCharts(), 500);

});

Template.dashboardsales.helpers({
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
Template.dashboardsales.events({
  
});