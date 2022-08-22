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

  templateObject.getDashboardData = function () {
    getVS1Data('TProspectEx').then(function (dataObject) {
        if(dataObject.length) {
            let {tprospect = []} = JSON.parse(dataObject[0].data);
            let myLeadsLast3Months = 0;
            let teamAvrgLast3Months = 0;
            let myNewOppertunityLast3Months = 0;
            let teamNewOppertunityLast3Months = 0;
            let loggedEmpID = Session.get('mySessionEmployeeLoggedID');
            const momentUnix =  moment().subtract(3, 'months').unix();
            tprospect.forEach(prospect  =>  {
                if(moment(prospect.fields.CreationDate).unix() > momentUnix && prospect.fields.Status === 'Unqualified') {
                    teamAvrgLast3Months +=1;
                    if(loggedEmpID == prospect.fields.ID) {
                        myLeadsLast3Months +=1;
                    }
                }

                if(moment(prospect.fields.CreationDate).unix() > momentUnix && prospect.fields.Status === 'Opportunity') {
                    teamNewOppertunityLast3Months +=1;
                    if(loggedEmpID == prospect.fields.ID) {
                        myNewOppertunityLast3Months +=1;
                    }
                }
            });
            $('#new-leads-my-metric').text(myLeadsLast3Months);
            $('#new-leads-team-avg').text(teamAvrgLast3Months);

            $('#new-opptertunties-my-metric').text(myNewOppertunityLast3Months);
            $('#new-opptertunties-team-avg').text(teamNewOppertunityLast3Months);
        }
    }).catch(function (err) {
    });

    getVS1Data('TInvoiceList').then(function (dataObject) {
        let totalInvoiceValueLast3Months = 0;
        let totalQuoteValueLast3Months = 0;
        if(dataObject.length) {
            let {tinvoicelist} = JSON.parse(dataObject[0].data);
            let myWonOppertunities = 0;
            let teamWonOppertunities = 0;
            let employeeName = Session.get('mySessionEmployee');
            const momentUnix =  moment().subtract(3, 'months').unix();
            tinvoicelist.forEach(tinvoice  =>  {
                if(moment(tinvoice.SaleDate).unix() > momentUnix) {
                    totalInvoiceValueLast3Months += tinvoice.Balance;
                    teamWonOppertunities += 1;

                    if(employeeName == tinvoice.EmployeeName) {
                        myWonOppertunities += 1;
                    }
                }

            });
            $('#won-opptertunties-my-metric').text(myWonOppertunities.toFixed(2));
            $('#won-opptertunties-team-avg').text(teamWonOppertunities.toFixed(2));
        }

        getVS1Data('TQuoteList').then(function (dataObject) {
            if(dataObject.length) {
                let {tquotelist = []} = JSON.parse(dataObject[0].data);
                const momentUnix =  moment().subtract(3, 'months').unix();
                tquotelist.forEach(tquote  =>  {
                    if(moment(tquote.SaleDate).unix() > momentUnix) {
                        if(!tquote.Converted) {
                            totalQuoteValueLast3Months += tquote.Balance;
                        }
                    }
                });
            }
            $('#gap-to-quota').text(`$ ${totalInvoiceValueLast3Months.toFixed(2)}`);
            if(totalInvoiceValueLast3Months > totalQuoteValueLast3Months) {
                $('#gap-to-quota').removeClass('text-danger');
                $('#gap-to-quota').addClass('text-success');
            } else {
                $('#gap-to-quota').removeClass('text-success');
                $('#gap-to-quota').addClass('text-danger');
            }
        }).catch(function (err) {
        });
    }).catch(function (err) {
    });

    getVS1Data('TQuoteList').then(function (dataObject) {
        if(dataObject.length) {
            let {tquotelist = []} = JSON.parse(dataObject[0].data);
            const momentUnix =  moment().subtract(3, 'months').unix();
            let [convertedQuotesCount, nonConvertedQuotesCount, convertedQuotesAmount] = [0, 0, 0, 0];
            let [myConvertedQuotesCount, myNonConvertedQuotesCount, myConvertedQuotesAmount] = [0, 0, 0, 0];
            let [myPipeLineAmount, teamPipeLineAmount] = [0, 0];
            let employeeName = Session.get('mySessionEmployee');
            tquotelist.forEach(tquote  =>  {
                if(moment(tquote.SaleDate).unix() > momentUnix) {
                    if(tquote.Converted) {
                        convertedQuotesCount +=1;
                        convertedQuotesAmount += tquote.Balance;
                    } else {
                        nonConvertedQuotesCount += 1;
                        teamPipeLineAmount += tquote.Balance;
                    }

                    if(employeeName == tquote.EmployeeName) {
                        if(tquote.Converted) {
                            myConvertedQuotesCount +=1;
                            myConvertedQuotesAmount += tquote.Balance;
                        } else {
                            myNonConvertedQuotesCount += 1;
                            myPipeLineAmount += tquote.Balance;
                        }
                    }
                }
            });
            const myWinRate = myConvertedQuotesCount;
            const teamWinRate = convertedQuotesCount;
            $('#win-rate-my-metric').text(myWinRate);
            $('#win-rate-team-avg').text(teamWinRate);

            const myAvgSalesCycle = myConvertedQuotesAmount ? myConvertedQuotesAmount/30 : myConvertedQuotesAmount; 
            const teamAvgSalesCycle = convertedQuotesAmount ? convertedQuotesAmount/30 : convertedQuotesAmount;
            $('#avg-sales-cycle-my-metric').text(myAvgSalesCycle.toFixed(2));
            $('#avg-sales-cycle-team-avg').text(teamAvgSalesCycle.toFixed(2));

            $('#pipeline-amount-my-metric').text(myPipeLineAmount.toFixed(2));
            $('#pipeline-amount-team-avg').text(teamPipeLineAmount.toFixed(2));
        }
    }).catch(function (err) {
    });

  }
  templateObject.getDashboardData();

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