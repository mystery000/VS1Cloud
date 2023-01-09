
import './recentTransactionTable.html';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ProductService } from "../../product/product-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../../utility-service";
import 'jquery-editable-select';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let productService = new ProductService();
let utilityService = new UtilityService();
let sideBarService = new SideBarService();


Template.recentTransactionTable.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.recentTrasactions = new ReactiveVar([]);
    templateObject.productID = new ReactiveVar();
    templateObject.autorun(() => {
        const data = Template.currentData(); // creates a reactive dependency
        templateObject.productID.set(data.productID);
        

        function MakeNegative() {
            $('td').each(function () {
                if ($(this).text().indexOf('-' + Currency) >= 0)
                    $(this).addClass('text-danger')
            });
        
            $('td.colAvailable, td.colOnSO, td.colOnBO, td.colInStock, td.colOnOrder').each(function(){
                // if(parseInt($(this).text()) == 0) $(this).addClass('neutralVolume');
                if (parseInt($(this).text()) > 0) $(this).addClass('positiveVolume');
                if (parseInt($(this).text()) < 0) $(this).addClass('negativeVolume');
            });
        };
        
        currentProductID = templateObject.productID.get();
        let transType = data.type;
        if(currentProductID){
            $('.fullScreenSpin').css('display', 'inline-block');
            let recentTransList = new Array();

            productService.getProductRecentTransactionsAll(currentProductID).then(function(data) {
                for (let i = 0; i < data.t_vs1_report_productmovement.length; i++) {
                    let recentTranObject = {
                        date: data.t_vs1_report_productmovement[i].TransactionDate != '' ? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY") : data.t_vs1_report_productmovement[i].TransactionDate,
                        type: data.t_vs1_report_productmovement[i].TranstypeDesc,
                        transactionno: data.t_vs1_report_productmovement[i].TransactionNo,
                        reference: data.t_vs1_report_productmovement[i].TransactionNo,
                        quantity: data.t_vs1_report_productmovement[i].Qty,
                        unitPrice: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].Price),
                        total: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].TotalPrice)
                    };
                    if(transType == "all")
                        recentTransList.push(recentTranObject);
                    else if(recentTranObject.type == transType)
                        recentTransList.push(recentTranObject);
                    else if(transType === "On Order" && (recentTranObject.type == "Purchase Order" || recentTranObject.type == "Sales Order"))
                        recentTransList.push(recentTranObject);
                }
                templateObject.recentTrasactions.set(recentTransList);
                // $('#productrecentlist').DataTable({
                //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                //         // data : templateObject.recentTrasactions.get(),
                //         select: true,
                //         destroy: true,
                //         colReorder: true,
                //         // bStateSave: true,
                //         // rowId: 0,
                //         pageLength: initialDatatableLoad,
                //         lengthMenu: [
                //             [initialDatatableLoad, -1],
                //             [initialDatatableLoad, "All"]
                //         ],
                //         info: true,
                //         responsive: true,
                //         "order": [[0, "desc"],[3, "desc"]],
                //         action: function() {
                //             $('#productrecentlist').DataTable().ajax.reload();
                //         },
                //         "fnDrawCallback": function(oSettings) {
                //             let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
                //             //if(checkurlIgnoreDate == 'true'){

                //             //}else{
                //             $('.paginate_button.page-item').removeClass('disabled');
                //             $('#tblPaymentOverview_ellipsis').addClass('disabled');

                //             if (oSettings._iDisplayLength == -1) {
                //                 if (oSettings.fnRecordsDisplay() > 150) {
                //                     $('.paginate_button.page-item.previous').addClass('disabled');
                //                     $('.paginate_button.page-item.next').addClass('disabled');
                //                 }
                //             } else {}
                //             if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                //                 $('.paginate_button.page-item.next').addClass('disabled');
                //             }
                //             $('.paginate_button.next:not(.disabled)', this.api().table().container())
                //                 .on('click', function() {
                //                     console.log('spin');
                //                     $('.fullScreenSpin').css('display', 'inline-block');
                //                     let dataLenght = oSettings._iDisplayLength;

                //                     var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                //                     var dateTo = new Date($("#dateTo").datepicker("getDate"));

                //                     let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                //                     let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                //                     if(data.Params.IgnoreDates == true){
                //                         sideBarService.getTPaymentList(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                //                             getVS1Data('TPaymentList').then(function(dataObjectold) {
                //                                 if (dataObjectold.length == 0) {} else {
                //                                     let dataOld = JSON.parse(dataObjectold[0].data);
                //                                     var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                //                                     let objCombineData = {
                //                                         Params: dataOld.Params,
                //                                         tpaymentlist: thirdaryData
                //                                     }

                //                                     addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                //                                         templateObject.resetData(objCombineData);
                //                                         $('.fullScreenSpin').css('display', 'none');
                //                                     }).catch(function(err) {
                //                                         $('.fullScreenSpin').css('display', 'none');
                //                                     });

                //                                 }
                //                             }).catch(function(err) {});

                //                         }).catch(function(err) {
                //                             $('.fullScreenSpin').css('display', 'none');
                //                         });
                //                     } else {
                //                         sideBarService.getTPaymentList(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                //                             getVS1Data('TPaymentList').then(function(dataObjectold) {
                //                                 if (dataObjectold.length == 0) {} else {
                //                                     let dataOld = JSON.parse(dataObjectold[0].data);
                //                                     var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                //                                     let objCombineData = {
                //                                         Params: dataOld.Params,
                //                                         tpaymentlist: thirdaryData
                //                                     }

                //                                     addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                //                                         templateObject.resetData(objCombineData);
                //                                         $('.fullScreenSpin').css('display', 'none');
                //                                     }).catch(function(err) {
                //                                         $('.fullScreenSpin').css('display', 'none');
                //                                     });

                //                                 }
                //                             }).catch(function(err) {});

                //                         }).catch(function(err) {
                //                             $('.fullScreenSpin').css('display', 'none');
                //                         });

                //                     }

                //                 });

                //             //}
                //             setTimeout(function() {
                //                 MakeNegative();
                //             }, 100);
                //         },

                //     }).on('page', function() {}).on('column-reorder', function() {});
                //     $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('.fullScreenSpin').css('display', 'none');
            });
        }
        
    });    
});

Template.recentTransactionTable.onRendered(function() {
    const templateObject = Template.instance();
    function MakeNegative() {
            $('td').each(function () {
                if ($(this).text().indexOf('-' + Currency) >= 0)
                    $(this).addClass('text-danger')
            });
        
            $('td.colAvailable, td.colOnSO, td.colOnBO, td.colInStock, td.colOnOrder').each(function(){
                // if(parseInt($(this).text()) == 0) $(this).addClass('neutralVolume');
                if (parseInt($(this).text()) > 0) $(this).addClass('positiveVolume');
                if (parseInt($(this).text()) < 0) $(this).addClass('negativeVolume');
            });
        };
    $('#productrecentlist').DataTable({
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                select: true,
                destroy: true,
                colReorder: true,
                // bStateSave: true,
                // rowId: 0,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"]
                ],
                info: true,
                responsive: true,
                "order": [[0, "desc"],[3, "desc"]],
                action: function() {
                    $('#productrecentlist').DataTable().ajax.reload();
                },
                "fnDrawCallback": function(oSettings) {
                    let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
                    //if(checkurlIgnoreDate == 'true'){

                    //}else{
                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblPaymentOverview_ellipsis').addClass('disabled');

                    if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {
                            $('.paginate_button.page-item.previous').addClass('disabled');
                            $('.paginate_button.page-item.next').addClass('disabled');
                        }
                    } else {}
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }
                    $('.paginate_button.next:not(.disabled)', this.api().table().container())
                        .on('click', function() {
                            console.log('spin');
                            $('.fullScreenSpin').css('display', 'inline-block');
                            let dataLenght = oSettings._iDisplayLength;

                            var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                            var dateTo = new Date($("#dateTo").datepicker("getDate"));

                            let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                            let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                            if(data.Params.IgnoreDates == true){
                                sideBarService.getTPaymentList(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                                    getVS1Data('TPaymentList').then(function(dataObjectold) {
                                        if (dataObjectold.length == 0) {} else {
                                            let dataOld = JSON.parse(dataObjectold[0].data);
                                            var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                            let objCombineData = {
                                                Params: dataOld.Params,
                                                tpaymentlist: thirdaryData
                                            }

                                            addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                templateObject.resetData(objCombineData);
                                                $('.fullScreenSpin').css('display', 'none');
                                            }).catch(function(err) {
                                                $('.fullScreenSpin').css('display', 'none');
                                            });

                                        }
                                    }).catch(function(err) {});

                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            } else {
                                sideBarService.getTPaymentList(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
                                    getVS1Data('TPaymentList').then(function(dataObjectold) {
                                        if (dataObjectold.length == 0) {} else {
                                            let dataOld = JSON.parse(dataObjectold[0].data);
                                            var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                            let objCombineData = {
                                                Params: dataOld.Params,
                                                tpaymentlist: thirdaryData
                                            }

                                            addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                templateObject.resetData(objCombineData);
                                                $('.fullScreenSpin').css('display', 'none');
                                            }).catch(function(err) {
                                                $('.fullScreenSpin').css('display', 'none');
                                            });

                                        }
                                    }).catch(function(err) {});

                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });

                            }

                        });

                    //}
                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                },

            }).on('page', function() {}).on('column-reorder', function() {});
            $('div.dataTables_filter input').addClass('form-control form-control-sm');
    if(currentProductID)
    {
        
        
        // let transactionList = templateObject.recentTrasactions.get();
        // console.log(recentTransList);
        // if(recentTransList && recentTransList.length > 0){
        // // drawing DataTable
        // console.log('spin');
        // $('.fullScreenSpin').css('display', 'inline-block');
        // setTimeout(function() {
        //             //$('.fullScreenSpin').css('display', 'none');
        //             let transactionList = templateObject.recentTrasactions.get();
                    
        //             $('#productrecentlist').DataTable({
        //                 "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
        //                 data : recentTransList,
        //                 select: true,
        //                 destroy: true,
        //                 colReorder: true,
        //                 // bStateSave: true,
        //                 // rowId: 0,
        //                 pageLength: initialDatatableLoad,
        //                 lengthMenu: [
        //                     [initialDatatableLoad, -1],
        //                     [initialDatatableLoad, "All"]
        //                 ],
        //                 info: true,
        //                 responsive: true,
        //                 "order": [[0, "desc"],[3, "desc"]],
        //                 action: function() {
        //                     $('#productrecentlist').DataTable().ajax.reload();
        //                 },
        //                 "fnDrawCallback": function(oSettings) {
        //                     let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
        //                     //if(checkurlIgnoreDate == 'true'){

        //                     //}else{
        //                     $('.paginate_button.page-item').removeClass('disabled');
        //                     $('#tblPaymentOverview_ellipsis').addClass('disabled');

        //                     if (oSettings._iDisplayLength == -1) {
        //                         if (oSettings.fnRecordsDisplay() > 150) {
        //                             $('.paginate_button.page-item.previous').addClass('disabled');
        //                             $('.paginate_button.page-item.next').addClass('disabled');
        //                         }
        //                     } else {}
        //                     if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
        //                         $('.paginate_button.page-item.next').addClass('disabled');
        //                     }
        //                     $('.paginate_button.next:not(.disabled)', this.api().table().container())
        //                         .on('click', function() {
        //                             console.log('spin');
        //                             $('.fullScreenSpin').css('display', 'inline-block');
        //                             let dataLenght = oSettings._iDisplayLength;

        //                             var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        //                             var dateTo = new Date($("#dateTo").datepicker("getDate"));

        //                             let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        //                             let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
        //                             if(data.Params.IgnoreDates == true){
        //                                 sideBarService.getTPaymentList(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
        //                                     getVS1Data('TPaymentList').then(function(dataObjectold) {
        //                                         if (dataObjectold.length == 0) {} else {
        //                                             let dataOld = JSON.parse(dataObjectold[0].data);
        //                                             var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
        //                                             let objCombineData = {
        //                                                 Params: dataOld.Params,
        //                                                 tpaymentlist: thirdaryData
        //                                             }

        //                                             addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
        //                                                 templateObject.resetData(objCombineData);
        //                                                 $('.fullScreenSpin').css('display', 'none');
        //                                             }).catch(function(err) {
        //                                                 $('.fullScreenSpin').css('display', 'none');
        //                                             });

        //                                         }
        //                                     }).catch(function(err) {});

        //                                 }).catch(function(err) {
        //                                     $('.fullScreenSpin').css('display', 'none');
        //                                 });
        //                             } else {
        //                                 sideBarService.getTPaymentList(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay(),viewdeleted).then(function(dataObjectnew) {
        //                                     getVS1Data('TPaymentList').then(function(dataObjectold) {
        //                                         if (dataObjectold.length == 0) {} else {
        //                                             let dataOld = JSON.parse(dataObjectold[0].data);
        //                                             var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
        //                                             let objCombineData = {
        //                                                 Params: dataOld.Params,
        //                                                 tpaymentlist: thirdaryData
        //                                             }

        //                                             addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
        //                                                 templateObject.resetData(objCombineData);
        //                                                 $('.fullScreenSpin').css('display', 'none');
        //                                             }).catch(function(err) {
        //                                                 $('.fullScreenSpin').css('display', 'none');
        //                                             });

        //                                         }
        //                                     }).catch(function(err) {});

        //                                 }).catch(function(err) {
        //                                     $('.fullScreenSpin').css('display', 'none');
        //                                 });

        //                             }

        //                         });

        //                     //}
        //                     setTimeout(function() {
        //                         MakeNegative();
        //                     }, 100);
        //                 },

        //             }).on('page', function() {}).on('column-reorder', function() {});
        //             $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    
                    
                    
        //         }, 0);
        // console.log('hide');
        
        // $('.fullScreenSpin').css('display', 'none');
        // }
                
            }
});

Template.recentTransactionTable.helpers({

    recentTrasactions: () => {
        return Template.instance().recentTrasactions.get();
    },
    productID: () => {
        // let templateObject = Template.instance();
        // templateObject.getAllProductRecentTransactions();
        return Template.instance().productID.get();
    },
    
});
