
Template.dashboardSalesCards.onRendered(function () {
  let templateObject = Template.instance();

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

  $('.sp-new-leads').on('click', function() {
      FlowRouter.go('/leadlist?range=month');
    });

  $('.sp-new-oppertunities').on('click', function() {
      FlowRouter.go('/leadlist?status=oppertunities');
  });

  $('.sp-won-oppertunities').on('click', function() {
      FlowRouter.go('/leadlist?status=approved');
  });

});

// Listen to event to update reactive variable
Template.dashboardSalesCards.events({
  
});