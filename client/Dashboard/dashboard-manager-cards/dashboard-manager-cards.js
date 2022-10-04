import _ from "lodash";

Template.dashboardManagerCards.onRendered(()=>{
    let templateObject = Template.instance();
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
    
        getVS1Data('TInvoiceList').then(function (dataObject) {
            if(dataObject.length) {
                let {tinvoicelist} = JSON.parse(dataObject[0].data);
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
                $('#closed-deals-month').text(`$${closedDealsThisMonth.toFixed(2)}`);
                $('#closed-deals-year').text(`$${closedDealsThisYear.toFixed(2)}`);
            }
        }).catch(function (err) {
        });
    };
    templateObject.getDashboardData();
});

Template.dashboardManagerCards.events({
    "click #new-leads-month": (e) => {
        // FlowRouter.go('/leadlist?range=month');
        window.open("/leadlist?range=month", '_self');
    },
    "click #new-deals-month": (e) => {
        // FlowRouter.go('/quoteslist?range=month');
        window.open("/quoteslist?range=month", '_self');
    },
    "click #closed-deals-month": (e) => {
        // FlowRouter.go('/invoicelist?range=month');
        window.open("/invoicelist?range=month", '_self');
    },
    "click #closed-deals-year": (e) => {
        // FlowRouter.go('/invoicelist?range=year');
        window.open("/invoicelist?range=year", '_self');
    },
    "click #sales-winrate": (e) => {
        // FlowRouter.go('/quoteslist?filter=converted');
        window.open("/quoteslist?filter=converted", '_self');
    },
    "click #avg-sales-cycle": (e) => {
        // FlowRouter.go('/quoteslist');
        window.open("/quoteslist", '_self');
    },
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
