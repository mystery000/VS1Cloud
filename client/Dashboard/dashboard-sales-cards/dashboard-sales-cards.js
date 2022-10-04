import { ReactiveVar } from "meteor/reactive-var";

let formatDateFrom;
let formatDateTo;

Template.dashboardManagerCharts.onCreated(function() {

});

Template.dashboardSalesCards.onRendered(function () {
    let templateObject = Template.instance();
    templateObject.getDashboardData = function (fromDate,toDate,ignoreDate) {
        getVS1Data('TProspectEx').then(function (dataObject) {
            if(dataObject.length) {
                let {tprospect = []} = JSON.parse(dataObject[0].data);
                console.log(tprospect);
                let myLeadsLast3Months = 0;
                let teamAvgLast3Months = 0;
                let myNewOpportunityLast3Months = 0;
                let teamNewOpportunityLast3Months = 0;
                let loggedEmpID = Session.get('mySessionEmployeeLoggedID');
                const momentUnix =  moment().subtract(3, 'months').unix();
                tprospect.forEach(prospect  =>  {
                    if(moment(prospect.fields.CreationDate).unix() > momentUnix && prospect.fields.Status === 'Unqualified') {
                        teamAvgLast3Months +=1;
                        if (loggedEmpID == prospect.fields.ID) {
                            myLeadsLast3Months +=1;
                        }
                    }
                    if(moment(prospect.fields.CreationDate).unix() > momentUnix && prospect.fields.Status === 'Opportunity') {
                        teamNewOpportunityLast3Months +=1;
                        if (loggedEmpID == prospect.fields.ID) {
                            myNewOpportunityLast3Months +=1;
                        }
                    }
                });
                $('#new-leads-my-metric').text(myLeadsLast3Months);
                $('#new-leads-team-avg').text(teamAvgLast3Months);
                $('#new-opportunities-my-metric').text(myNewOpportunityLast3Months);
                $('#new-opportunities-team-avg').text(teamNewOpportunityLast3Months);
            }
        }).catch(function (err) {

        });
        getVS1Data('TInvoiceList').then(function (dataObject) {
            let totalInvoiceValueLast3Months = 0;
            let totalQuoteValueLast3Months = 0;
            if(dataObject.length) {
                let {tinvoicelist} = JSON.parse(dataObject[0].data);
                let myWonOpportunities = 0;
                let teamWonOpportunities = 0;
                let employeeName = Session.get('mySessionEmployee');
                const momentUnix =  moment().subtract(3, 'months').unix();
                tinvoicelist.forEach(tinvoice  =>  {
                    if(moment(tinvoice.SaleDate).unix() > momentUnix) {
                        totalInvoiceValueLast3Months += tinvoice.Balance;
                        teamWonOpportunities += 1;
                        if(employeeName == tinvoice.EmployeeName) {
                            myWonOpportunities += 1;
                        }
                    }
                });
                $('#won-opportunities-my-metric').text(myWonOpportunities.toFixed(2));
                $('#won-opportunities-team-avg').text(teamWonOpportunities.toFixed(2));
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
                $('#win-rate-my-metric').text(`${myWinRate} %`);
                $('#win-rate-team-avg').text(`${teamWinRate} %`);

                const myAvgSalesCycle = myConvertedQuotesAmount ? myConvertedQuotesAmount/30 : myConvertedQuotesAmount;
                const teamAvgSalesCycle = convertedQuotesAmount ? convertedQuotesAmount/30 : convertedQuotesAmount;
                $('#avg-sales-cycle-my-metric').text(`${parseInt(myAvgSalesCycle)} day(s)`);
                $('#avg-sales-cycle-team-avg').text(`${parseInt(teamAvgSalesCycle)} day(s)`);

                $('#pipeline-amount-my-metric').text(`$ ${myPipeLineAmount.toFixed(2)}`);
                $('#pipeline-amount-team-avg').text(`$ ${teamPipeLineAmount.toFixed(2)}`);
            }
        }).catch(function (err) {
        });
    }
    templateObject.setDateVal = function () {
        const dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        const dateTo = new Date($("#dateTo").datepicker("getDate"));
        formatDateFrom =
            dateFrom.getFullYear() +
            "-" +
            (dateFrom.getMonth() + 1) +
            "-" +
            dateFrom.getDate();
        formatDateTo =
            dateTo.getFullYear() +
            "-" +
            (dateTo.getMonth() + 1) +
            "-" +
            dateTo.getDate();
        if ( $("#dateFrom").val() == "" && $("#dateFrom").val() == "") {
            templateObject.getDashboardData(formatDateFrom, formatDateTo, true);
        } else {
            templateObject.getDashboardData(formatDateFrom, formatDateTo, false);
        }
    }

    setTimeout(function(){
        templateObject.setDateVal();
    },500);
});

// Listen to event to update reactive variable
Template.dashboardSalesCards.events({
    "click #new-leads-my-metric": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #new-leads-team-avg": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #new-opportunities-my-metric": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #new-opportunities-team-avg": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #won-opportunities-my-metric": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #won-opportunities-team-avg": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #gap-to-quota": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #avg-sales-cycle-my-metric": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #avg-sales-cycle-team-avg": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #pipeline-amount-my-metric": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
    "click #pipeline-amount-team-avg": (e) => {
        let fromDate = new Date(formatDateFrom);
        fromDate = moment(fromDate).format('DD-MM-YYYY');
        let toDate = new Date(formatDateTo);
        toDate = moment().format('DD-MM-YYYY');
        // FlowRouter.go(`/invoicelist?fromDate=${fromDate}&toDate=${toDate}`);
        window.open("/invoicelist?fromDate="+fromDate+"&toDate="+toDate, '_self');
    },
});

Template.dashboardSalesCards.helpers({

});