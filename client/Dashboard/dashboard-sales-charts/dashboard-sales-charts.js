import { ReactiveVar } from "meteor/reactive-var";
import '../../lib/global/indexdbstorage.js';
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
let _ = require("lodash");



Template.dashboardSalesCharts.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.employees = new ReactiveVar([]);
    templateObject.employeesByTotalSales = new ReactiveVar([]);
});

Template.dashboardSalesCharts.onRendered(function () {
    const templateObject = Template.instance();

    async function renderCharts() {

        const dataInvoiceObject = await getVS1Data('TInvoiceList');
        let totalInvoiceValue2ndLastQuater = 0;
        let totalInvoiceValueLastQuater = 0;
        if(dataInvoiceObject.length) {
            let {tinvoicelist} = JSON.parse(dataInvoiceObject[0].data);
            const start2ndLastQuater =  moment().subtract(6, 'months').unix();
            const endSecondLastQuater =  moment().subtract(3, 'months').unix();
            const startLastQuater = moment().subtract(3, 'months').unix();
            const endLastQuater = moment().unix();
            tinvoicelist.forEach(tinvoice  =>  {
                if(moment(tinvoice.SaleDate).unix() > start2ndLastQuater && moment(tinvoice.SaleDate).unix() < endSecondLastQuater) {
                    totalInvoiceValue2ndLastQuater += tinvoice.Balance;
                }
                if(moment(tinvoice.SaleDate).unix() > startLastQuater && moment(tinvoice.SaleDate).unix() < endLastQuater) {
                    totalInvoiceValueLastQuater += tinvoice.Balance;
                }
            });
        }
    
        const dataQuoteObject = await getVS1Data('TQuoteList');
        let totalQuotesValue2ndLastQuater = 0;
        let totalQuotesValueLastQuater = 0;
        if(dataQuoteObject.length) {
            let {tquotelist = []} = JSON.parse(dataQuoteObject[0].data);
            const start2ndLastQuater =  moment().subtract(6, 'months').unix();
            const endSecondLastQuater =  moment().subtract(3, 'months').unix();
            const startLastQuater = moment().subtract(3, 'months').unix();
            const endLastQuater = moment().unix();
            tquotelist.forEach(tquote  =>  {
                if(moment(tquote.SaleDate).unix() > start2ndLastQuater && moment(tquote.SaleDate).unix() < endSecondLastQuater) {
                    totalQuotesValue2ndLastQuater += tquote.Balance;
                }

                if(moment(tquote.SaleDate).unix() > startLastQuater && moment(tquote.SaleDate).unix() < endLastQuater) {
                    totalQuotesValueLastQuater += tquote.Balance;
                }
            });
        }

        const dataSaleObject = await getVS1Data('TSalesList');
        let totalSalesValue2ndLastQuater = 0;
        let totalSalesValueLastQuater = 0;
        if(dataSaleObject.length) {
            let {tsaleslist = []} = JSON.parse(dataSaleObject[0].data);
            const start2ndLastQuater =  moment().subtract(6, 'months').unix();
            const endSecondLastQuater =  moment().subtract(3, 'months').unix();
            const startLastQuater = moment().subtract(3, 'months').unix();
            const endLastQuater = moment().unix();
            tsaleslist.forEach(tsale  =>  {
                if(moment(tsale.SaleDate).unix() > start2ndLastQuater && moment(tsale.SaleDate).unix() < endSecondLastQuater) {
                    totalSalesValue2ndLastQuater += tsale.Balance;
                }

                if(moment(tsale.SaleDate).unix() > startLastQuater && moment(tsale.SaleDate).unix() < endLastQuater) {
                    totalSalesValueLastQuater += tsale.Balance;
                }
            });
        }
        const categories = [moment().subtract(6, 'months').format('MMMM YYYY'), moment().subtract(3, 'months').format('MMMM YYYY'), moment().format('MMMM YYYY')];
        const quotaAmount = [0, totalQuotesValue2ndLastQuater, totalQuotesValueLastQuater];
        const invoiceAmount = [0, totalInvoiceValue2ndLastQuater, totalInvoiceValueLastQuater];
        const closedAmount = [0, totalSalesValue2ndLastQuater, totalSalesValueLastQuater];
        renderComparisonChart({categories, quotaAmount, invoiceAmount, closedAmount});

        // leads comparison charts logic
        const dataProspectObject = await getVS1Data('TProspectEx');
        let leadsCount6Months = 0;
        let leadsSources = {};
        if(dataProspectObject.length) {
            let {tprospect = []} = JSON.parse(dataProspectObject[0].data);
            const momentUnix =  moment().subtract(6, 'months').unix();
            tprospect.forEach(tprospect  =>  {
                if(moment(tprospect.fields.CreationDate).unix() > momentUnix && tprospect.fields.Status == 'Quoted') {
                    leadsSources[tprospect.fields.SourceName || 'Unknown'] = isNaN(parseInt(leadsSources[tprospect.fields.SourceName || 'Unknown'])) ? 1 : parseInt(leadsSources[tprospect.fields.SourceName || 'Unknown']) + 1;
                    leadsCount6Months += 1;
                }
            });
        }
        let leadsSorcesCount = _.map(_.keys(leadsSources), key => {
            return {totalCount: leadsSources[key], sourceName: key};
        });
        leadsSorcesCount = _.sortBy(leadsSorcesCount, ['totalCount']).reverse().slice(0, 3);
        let sources = ['Total Leads'];
        let sourcesValues = [leadsCount6Months];
        _.each(leadsSorcesCount, (sourceCount) => {
            sources.push(sourceCount.sourceName);
            sourcesValues.push(sourceCount.totalCount)
        });
        renderOppertunitiesChart({sources, sourcesValues});
    };

    function renderComparisonChart({categories, quotaAmount, invoiceAmount, closedAmount}) {
        const series = [{
            name: 'Quota Amount',
            data: quotaAmount
        }, {
            name: 'Expected Amount',
            data: invoiceAmount
        }, {
            name: 'Closed/Won',
            data: closedAmount
        }];

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

    function renderOppertunitiesChart({sources, sourcesValues}) {
        highCharts.chart('opens-oppertunities-chart', {
            series: [{
                name: 'Leads Count',
                data: sourcesValues

            }],
            chart: {
                type: 'column'
            },
            title: {
                text: 'Open Oppertunities by Stage'
            },
            subtitle: {
                text:''
            },
            xAxis: {
                categories: sources
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

Template.dashboardSalesCharts.events({

});
