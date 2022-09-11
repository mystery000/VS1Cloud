import { ReactiveVar } from "meteor/reactive-var";
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
let _ = require("lodash");
import { UtilityService } from "../../utility-service";


Template.dashboardManagerCharts.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.employees = new ReactiveVar([]);
    templateObject.employeesByTotalSales = new ReactiveVar([]);
});

Template.dashboardManagerCharts.onRendered(function () {
    const templateObject = Template.instance();

    function formatPrice( amount ){
        let utilityService = new UtilityService();
        if( isNaN(amount) || !amount){
            amount = ( amount === undefined || amount === null || amount.length === 0 ) ? 0 : amount;
            amount = ( amount )? Number(amount.replace(/[^0-9.-]+/g,"")): 0;
        }
        return utilityService.modifynegativeCurrencyFormat(amount)|| 0.00;
    }

    function renderSPMEmployeeChart() {
        let employeeNames = [];
        let employeesTotalDiscount = [];
        const filteredEmployees = _.filter(templateObject.employeesByTotalSales.get(), emp => !!emp.totalDiscount);
        _.each(filteredEmployees, emp => {
            if(emp.totalDiscount > 0) {
                employeeNames.push(emp.name);
                employeesTotalDiscount.push(emp.totalDiscount);
            }
        });
        highCharts.chart('spd-employee-chart', {
            series: [{
                name: 'Employees',
                data: employeesTotalDiscount

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
                text: ''
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
                    rotation: 'auto',
                    style: {
                        color: '#000'
                    }
                },
                title: {
                    text: ''
                },
                plotBands: [{
                    from: 0,
                    to: fourtyPercentOfQuota,
                    color: '#DF5353', // red
                    thickness: 30
                }, {
                    from: fourtyPercentOfQuota,
                    to: eightyPercentOfQuota,
                    color: '#DDDF0D', // yellow
                    thickness: 30
                }, {
                    from: eightyPercentOfQuota,
                    to: chartEndRangeValue,
                    color: '#55BF3B', // green
                    thickness: 30
                }]
            },
            series: [{
                name: 'Total Sales ',
                data: [empData.totalSales],
                dial: {
                    radius: '80%',
                    backgroundColor: 'gray',
                    baseWidth: 12,
                    baseLength: '0%',
                    rearLength: '0%'
                },
            }]
        };

        if ($(`#${divId}`).length) {
            highCharts.chart(divId, options);
            $(`#${divId}`).css('display', 'block');
            $('.sortable-chart-widget-js').removeClass(`spd-gauge-chart${index+1}`);
            if($(`#${divId}-emp`).length) {
                $(`#${divId}-emp`).css('display', 'block');
                $(`#${divId}-emp`).html(empData.name);
            }
            if($(`#${divId}-amount`).length) {
                $(`#${divId}-amount`).css('display', 'block');
                $(`#${divId}-amount`).html(formatPrice(empData.totalSales));
            }
        }
    };

    templateObject.renderSPDCharts = function () {
        const filteredEmployees = _.sortBy(_.filter(templateObject.employeesByTotalSales.get(), emp => !!emp.salesQuota), ['totalSales']);
        const employeesByTotalSales = _.sortBy(filteredEmployees, ['sale']).reverse().slice(0, 6); // get top 6 employees
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

        getVS1Data('TInvoiceList').then(function (dataObject) {
            if (dataObject.length) {
                let { tinvoicelist } = JSON.parse(dataObject[0].data);
                const tinvoicelistGroupBy = _.groupBy(tinvoicelist, 'EmployeeName');
                let employeesByTotalSales = [];
                _.each(templateObject.employees.get(), employee => {
                    let lastMonthUnix = moment().subtract(1, 'months').unix();
                    let employeeData = { name: employee.EmployeeName, totalSales: 0, salesQuota: 0, totalDiscount: 0 };
                    if (employee.CustFld12 && Number(employee.CustFld12) != 'NaN' && Number(employee.CustFld12) > 0) {
                        employeeData.salesQuota = Number(employee.CustFld12);
                    }
                    if(tinvoicelistGroupBy[employee.EmployeeName]) {
                        _.each(tinvoicelistGroupBy[employee.EmployeeName], invoiceData => {
                            if (moment(invoiceData.SaleDate).unix() > lastMonthUnix) {
                                employeeData.totalSales += invoiceData.TotalAmountInc
                                employeeData.totalDiscount += invoiceData.TotalDiscount
                            }
                        });
                    }
                    employeesByTotalSales.push(employeeData);
                });
                templateObject.employeesByTotalSales.set(employeesByTotalSales);
                renderSPMEmployeeChart();
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
