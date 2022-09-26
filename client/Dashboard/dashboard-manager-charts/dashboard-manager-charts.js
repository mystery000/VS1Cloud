import { ReactiveVar } from "meteor/reactive-var";
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
let _ = require("lodash");
import { UtilityService } from "../../utility-service";
import {SideBarService} from "../../js/sidebar-service";

let sideBarService = new SideBarService();

Template.dashboardManagerCharts.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.employees = new ReactiveVar([]);
    templateObject.employeesByTotalSales = new ReactiveVar([]);
});

Template.dashboardManagerCharts.onRendered(function () {
    const templateObject = Template.instance();
/*
    templateObject.getEmployees = function () {
        getVS1Data('TEmployee').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getAllEmployees("All",0).then(function (data) {
                    setAllEmployees(data);
                }).catch(function (err) {
                    $('.fullScreenSpin').css('display','none');
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                setAllEmployees(data);
            }
        }).catch(function (err) {
            sideBarService.getAllEmployees("All",0).then(function (data) {
                setAllEmployees(data);
            }).catch(function (err) {
                $('.fullScreenSpin').css('display','none');
            });
        });
    }
    function setAllEmployees(data) {
        console.log(data);
        addVS1Data('TEmployee',JSON.stringify(data));
        let dataTableList = [];
        for(let i=0; i<data.temployee.length; i++){
            const dataList = {
                id: data.temployee[i].fields.ID || '',
                employeeno: data.temployee[i].fields.EmployeeNo || '',
                employeename: data.temployee[i].fields.EmployeeName || '',
                firstname: data.temployee[i].fields.FirstName || '',
                lastname: data.temployee[i].fields.LastName || '',
                phone: data.temployee[i].fields.Phone || '',
                email: data.temployee[i].fields.Email || '',
                address: data.temployee[i].fields.Street || '',
                country: data.temployee[i].fields.Country || '',
                department: data.temployee[i].fields.DefaultClassName || '',
                custFld1: data.temployee[i].fields.CustFld1 || '',
                custFld2: data.temployee[i].fields.CustFld2 || '',
                custFld3: data.temployee[i].fields.CustFld3 || '',
                custFld4: data.temployee[i].fields.CustFld4 || ''
            };
            if(data.temployee[i].fields.EmployeeName.replace(/\s/g, '') != ''){
                dataTableList.push(dataList);
            }
            //}
        }
        templateObject.employeesByTotalSales.set(dataTableList);

    }
    templateObject.getEmployees();

 */

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
                type: 'bar'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: 'Discount Given By Employees'
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

    function setGaugeChart({ divId, empData, index }) {
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
                plotShadow: false,
            },
            title: {
                text: empData.name,
                align: 'center',
                verticalAlign: 'bottom',
                y: 10
            },
            exporting: {
                enabled: false
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
                dataLabels: {
                    useHTML: true,
                    enabled: true,
                    align: 'center',
                    x: 0,
                    y: 45,
                    overflow: "allow",
                    borderWidth: 0,
                    className: 'rev-counter',
                }
            }]
        };

        if ($(`#${divId}`).length) {
            highCharts.chart(divId, options);
            $(`#${divId}`).css('display', 'block');
            $('.sortable-chart-widget-js').removeClass(`spd-gauge-chart${index+1}`);
            // if($(`#${divId}-emp`).length) {
            //     $(`#${divId}-emp`).css('display', 'block');
            //     $(`#${divId}-emp`).html(empData.name);
            // }
            // if($(`#${divId}-amount`).length) {
            //     $(`#${divId}-amount`).css('display', 'block');
            //     $(`#${divId}-amount`).html(formatPrice(empData.totalSales));
            // }
        }
    }

    templateObject.renderSPDCharts = function () {
        const filteredEmployees = _.sortBy(_.filter(templateObject.employeesByTotalSales.get(), emp => !!emp.salesQuota), ['totalSales']);
        const employeesByTotalSales = _.sortBy(filteredEmployees, ['sale']).reverse().slice(0, 6); // get top 6 employees
        _.each(employeesByTotalSales, (empData, index) => {
            setGaugeChart({ divId: `spd-gauge-area${index + 1}`, empData, index });
        });
    };

    templateObject.getDashboardData = async function () {
        const employeeObject = await getVS1Data('TEmployee');
        // const employeeObject = await getVS1Data('TCustomerVS1');
        let employeeNames = [];
        let employeeSalesQuota = [];
        if (employeeObject.length) {
            let { temployee = [] } = JSON.parse(employeeObject[0].data);
            let employees = [];
            temployee.forEach(employee => {
                employees.push(employee.fields);
                if(!(isNaN(parseInt(employee.fields.CustFld12)) || parseInt(employee.fields.CustFld12) == 0)) {
                    // employeeNames.push(employee.fields.EmployeeName);
                    employeeNames.push(employee.fields.FirstName + " " + employee.fields.LastName);
                    employeeSalesQuota.push(parseInt(employee.fields.CustFld12));
                    // employeeNames.push(employee.fields.CustomerName);
                    // employeeSalesQuota.push(parseInt(employee.fields.CUSTFLD12));
                }
            });
            templateObject.employees.set(employees);
        }
        // if (employeeObject.length) {
        //     let { tcustomervs1 = [] } = JSON.parse(employeeObject[0].data);
        //     let employees = [];
        //     tcustomervs1.forEach(employee => {
        //         employees.push(employee.fields);
        //         if(!(isNaN(parseInt(employee.fields.CUSTFLD12)) || parseInt(employee.fields.CUSTFLD12) == 0)) {
        //             // employeeNames.push(employee.fields.EmployeeName);
        //             employeeNames.push(employee.fields.ClientName);
        //             employeeSalesQuota.push(parseInt(employee.fields.CUSTFLD12));
        //         }
        //     });
        //     templateObject.employees.set(employees);
        // }

        getVS1Data('TInvoiceList').then(function (dataObject) {
            if (dataObject.length) {
                let { tinvoicelist } = JSON.parse(dataObject[0].data);
                const tinvoicelistGroupBy = _.groupBy(tinvoicelist, 'EmployeeName');
                // const tinvoicelistGroupBy = _.groupBy(tinvoicelist, 'CustomerName');
                let employeesByTotalSales = [];
                _.each(templateObject.employees.get(), employee => {
                    let lastMonthUnix = moment().subtract(1, 'months').unix();
                    let empName = employee.FirstName + " " + employee.LastName;
                    let employeeData = { name: empName, totalSales: 0, salesQuota: 0, totalDiscount: 0 };
                    if (employee.CustFld12 && Number(employee.CustFld12) != 'NaN' && Number(employee.CustFld12) > 0) {
                        employeeData.salesQuota = Number(employee.CustFld12);
                    }
                    // let employeeData = { name: employee.ClientName, totalSales: 0, salesQuota: 0, totalDiscount: 0 };
                    // if (employee.CUSTFLD12 && Number(employee.CUSTFLD12) != 'NaN' && Number(employee.CUSTFLD12) > 0) {
                    //     employeeData.salesQuota = Number(employee.CUSTFLD12);
                    // }
                    if (tinvoicelistGroupBy[empName]) {
                        _.each(tinvoicelistGroupBy[empName], invoiceData => {
                            if (moment(invoiceData.SaleDate).unix() > lastMonthUnix) {
                                employeeData.totalSales += invoiceData.TotalAmountInc;
                                employeeData.totalDiscount += invoiceData.TotalDiscount;
                            }
                        });
                    }
                    // if(tinvoicelistGroupBy[employee.ClientName]) {
                    //     _.each(tinvoicelistGroupBy[employee.ClientName], invoiceData => {
                    //         // if (moment(invoiceData.SaleDate).unix() > lastMonthUnix) {
                    //             employeeData.totalSales += invoiceData.TotalAmountInc
                    //             employeeData.totalDiscount += invoiceData.TotalDiscount
                    //         // }
                    //     });
                    // }
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
