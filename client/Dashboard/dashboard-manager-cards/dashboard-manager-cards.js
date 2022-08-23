import { ReactiveVar } from "meteor/reactive-var";
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
import _ from "lodash";

Template.dashboardManagerCards.onCreated(()=>{
    const templateObject = Template.instance();
    templateObject.employees = new ReactiveVar([]);
    templateObject.employeesByTotalSales = new ReactiveVar([]);
});

Template.dashboardManagerCards.onRendered(()=>{
    let templateObject = Template.instance();
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
    };
    
    function setGauageChart({divId, empData}) {
        const fourtyPercentOfQuota =  ((40/100) * empData.salesQuota).toFixed();
        const eightyPercentOfQuota =  ((80/100) * empData.salesQuota).toFixed();
        const oneTwentyPercentOfQuota =  ((120/100) * empData.salesQuota).toFixed();
        const chartEndRangeValue = empData.totalSales > oneTwentyPercentOfQuota ? parseInt(empData.totalSales) : oneTwentyPercentOfQuota;
        const options = {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            }, 
            title: {
                text: empData.name
            },
            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#333'],
                            [1, '#FFF']
                        ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
                    // default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },
            // the value axis
            yAxis: {
                min: 0,
                max: chartEndRangeValue,
                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickPosition: 'inside',
                minorTickColor: '#666',
                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: empData.name
                },
                plotBands: [{
                    from: 0,
                    to: fourtyPercentOfQuota,
                    color: '#DF5353' // red
                }, {
                    from: fourtyPercentOfQuota,
                    to: eightyPercentOfQuota,
                    color: '#DDDF0D' // yellow
                }, {
                    from: eightyPercentOfQuota,
                    to: chartEndRangeValue,
                    color: '#55BF3B' // green
                }]
            },
            series: [{
                name: 'Total Sales ',
                data: [empData.totalSales]
            }]
        };
        
        if($(`#${divId}`).length) {
            highCharts.chart(divId, options);
            $(`#${divId}`).css('display', 'block');
        }
    };
    
    templateObject.renderSPDCharts = function() {
        const employeesByTotalSales =  _.sortBy(templateObject.employeesByTotalSales.get(), ['sale']).reverse().slice(0, 6); // get top 6 employees
        _.each(employeesByTotalSales, (empData, index) => {
            setGauageChart({divId: `spd-gauge-area${index+1}`, empData});
        });
    };
    
    templateObject.getDashboardData = async function () {
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
                const winRate = convertedQuotesCount ? parseInt((convertedQuotesCount/(convertedQuotesCount+nonConvertedQuotesCount)) * 100) : 0;
                const avgSalesCycle = convertedQuotesAmount ? convertedQuotesAmount/30 : convertedQuotesAmount;
                $('#sales-winrate').text(winRate.toFixed(2));
                $('#new-deals-month').text(dealsThisMonthCount);
                $('#avg-sales-cycle').text(avgSalesCycle.toFixed(2));
            }
        }).catch(function (err) {
        });
    
        const employeeObject = await getVS1Data('TEmployee');
        let employeeNames = [];
        let employeeSalesQuota = [];
        if(employeeObject.length) {
            let {temployee = []} = JSON.parse(employeeObject[0].data);
            let employees = [];
            temployee.forEach(employee => {
                employees.push(employee.fields);
                employeeNames.push(employee.fields.EmployeeName);
                employeeSalesQuota.push(isNaN(parseInt(employee.fields.CustFld12)) ? 0 : parseInt(employee.fields.CustFld12));
            });
            templateObject.employees.set(employees);
        }
        renderSPMEmployeeChart(employeeNames, employeeSalesQuota);
    
        getVS1Data('TInvoiceList').then(function (dataObject) {
            if(dataObject.length) {
                let {tinvoicelist} = JSON.parse(dataObject[0].data);
                const tinvoicelistGroupBy = _.groupBy(tinvoicelist, 'EmployeeName');
                let employeesByTotalSales = [];
                _.each(_.keys(tinvoicelistGroupBy), key => {
                    let lastMonthUnix = moment().subtract(1, 'months').unix();
                        let employeeData = {name: key, totalSales: 0, salesQuota: 0};
                        let employee = _.find(templateObject.employees.get(), {EmployeeName: key});
                        if(employee) {
                            employeeData.salesQuota = isNaN(parseInt(employee.CustFld12)) ? 0 : parseInt(employee.CustFld12);
                        }
                        _.each(tinvoicelistGroupBy[key], invoiceData => {
                            if(moment(invoiceData.SaleDate).unix() > lastMonthUnix) {
                                employeeData.totalSales += invoiceData.TotalAmountInc
                            }
                        });
                        employeesByTotalSales.push(employeeData);
                });
                templateObject.employeesByTotalSales.set(_.filter(employeesByTotalSales, emp => !!emp.salesQuota));
                let closedDealsThisMonth = 0;
                let closedDealsThisYear = 0;
                const lastMonthUnix =  moment().subtract(1, 'months').unix();
                const lastYearUnix =  moment().subtract(12, 'months').unix();
                tinvoicelist.forEach(tinvoice  =>  {
                    if(moment(tinvoice.SaleDate).unix() > lastMonthUnix) {
                        closedDealsThisMonth += tinvoice.Balance;
                    }
    
                    if(moment(tinvoice.SaleDate).unix() > lastYearUnix) {
                        closedDealsThisYear += tinvoice.Balance;
                    }
                });
                $('#closed-deals-month').text(closedDealsThisMonth.toFixed(2));
                $('#closed-deals-year').text(closedDealsThisYear.toFixed(2));
    
                templateObject.renderSPDCharts();
            }
        }).catch(function (err) {
        });
    };
    templateObject.getDashboardData();

    $('.new-leads-month').on('click', function() {
        FlowRouter.go('/leadlist?range=month');
    });

    $('.closed-deals-month').on('click', function() {
        FlowRouter.go('/paymentoverview?range=month');
    });

    $('.closed-deals-year').on('click', function() {
        FlowRouter.go('/paymentoverview?range=year');
    });
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
