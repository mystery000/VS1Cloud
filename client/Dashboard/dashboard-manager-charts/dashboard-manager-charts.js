import { ReactiveVar } from "meteor/reactive-var";
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
let _ = require("lodash");


Template.dashboardManagerCharts.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.employees = new ReactiveVar([]);
    templateObject.employeesByTotalSales = new ReactiveVar([]);
});

Template.dashboardManagerCharts.onRendered(function () {
    const templateObject = Template.instance();
    window.highCharts = highCharts;
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

    function setGauageChart({ divId, empData, index }) {
        const fourtyPercentOfQuota = ((40 / 100) * empData.salesQuota).toFixed();
        const eightyPercentOfQuota = ((80 / 100) * empData.salesQuota).toFixed();
        const oneTwentyPercentOfQuota = ((120 / 100) * empData.salesQuota).toFixed();
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

        if ($(`#${divId}`).length) {
            highCharts.chart(divId, options);
            $(`#${divId}`).css('display', 'block');
            $('.sortable-chart-widget-js').removeClass(`spd-gauge-chart${index+1}`);
        }
    };

    templateObject.renderSPDCharts = function () {
        const employeesByTotalSales = _.sortBy(templateObject.employeesByTotalSales.get(), ['sale']).reverse().slice(0, 6); // get top 6 employees
        _.each(employeesByTotalSales, (empData, index) => {
            setGauageChart({ divId: `spd-gauge-area${index + 1}`, empData, index });
        });
    };

    templateObject.getDashboardData = async function () {
        const employeeObject = await getVS1Data('TEmployee');
        let employeeNames = [];
        let employeeSalesQuota = [];
        if (employeeObject.length) {
            let { temployee = [] } = JSON.parse(employeeObject[0].data);
            let employees = [];
            temployee.forEach(employee => {
                employees.push(employee.fields);
                if(!(isNaN(parseInt(employee.fields.CustFld12)) || parseInt(employee.fields.CustFld12) == 0)) {
                    employeeNames.push(employee.fields.EmployeeName);
                    employeeSalesQuota.push(parseInt(employee.fields.CustFld12));
                }
            });
            templateObject.employees.set(employees);
        }
        renderSPMEmployeeChart(employeeNames, employeeSalesQuota);

        getVS1Data('TInvoiceList').then(function (dataObject) {
            if (dataObject.length) {
                let { tinvoicelist } = JSON.parse(dataObject[0].data);
                const tinvoicelistGroupBy = _.groupBy(tinvoicelist, 'EmployeeName');
                let employeesByTotalSales = [];
                _.each(_.keys(tinvoicelistGroupBy), key => {
                    let lastMonthUnix = moment().subtract(1, 'months').unix();
                    let employeeData = { name: key, totalSales: 0, salesQuota: 0 };
                    let employee = _.find(templateObject.employees.get(), { EmployeeName: key });
                    if (employee) {
                        employeeData.salesQuota = isNaN(parseInt(employee.CustFld12)) ? 0 : parseInt(employee.CustFld12);
                    }
                    _.each(tinvoicelistGroupBy[key], invoiceData => {
                        if (moment(invoiceData.SaleDate).unix() > lastMonthUnix) {
                            employeeData.totalSales += invoiceData.TotalAmountInc
                        }
                    });
                    employeesByTotalSales.push(employeeData);
                });
                templateObject.employeesByTotalSales.set(_.filter(employeesByTotalSales, emp => !!emp.salesQuota));
                templateObject.renderSPDCharts();
            }
        }).catch(function (err) {
        });
    };
    
    templateObject.getDashboardData();
});

Template.dashboardManagerCharts.events({
    "click #spd-employee-chart": () => {
        FlowRouter.go('/employeelist');
    },
    "click #spd-gauge-area1": () => {
        const fromDate = moment().subtract(1, 'month').format('DD-MM-YYYY');
        const toDate = moment().format('DD-MM-YYYY');
        FlowRouter.go(`/invoicelist?fromDate${fromDate}&toDate=${toDate}`);
    },
    "click #spd-gauge-area2": () => {
        const fromDate = moment().subtract(1, 'month').format('DD-MM-YYYY');
        const toDate = moment().format('DD-MM-YYYY');
        FlowRouter.go(`/invoicelist?fromDate${fromDate}&toDate=${toDate}`);
    },
    "click #spd-gauge-area3": () => {
        const fromDate = moment().subtract(1, 'month').format('DD-MM-YYYY');
        const toDate = moment().format('DD-MM-YYYY');
        FlowRouter.go(`/invoicelist?fromDate${fromDate}&toDate=${toDate}`);
    },
    "click #spd-gauge-area4": () => {
        const fromDate = moment().subtract(1, 'month').format('DD-MM-YYYY');
        const toDate = moment().format('DD-MM-YYYY');
        FlowRouter.go(`/invoicelist?fromDate${fromDate}&toDate=${toDate}`);
    },
    "click #spd-gauge-area5": () => {
        const fromDate = moment().subtract(1, 'month').format('DD-MM-YYYY');
        const toDate = moment().format('DD-MM-YYYY');
        FlowRouter.go(`/invoicelist?fromDate${fromDate}&toDate=${toDate}`);
    },
    "click #spd-gauge-area6": () => {
        const fromDate = moment().subtract(1, 'month').format('DD-MM-YYYY');
        const toDate = moment().format('DD-MM-YYYY');
        FlowRouter.go(`/invoicelist?fromDate${fromDate}&toDate=${toDate}`);
    },
});
