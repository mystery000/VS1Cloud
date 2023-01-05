import { ProductService } from "../../product/product-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { UtilityService } from "../../utility-service";
import 'jquery-editable-select';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let productService = new ProductService();
let utilityService = new UtilityService();
let sideBarService = new SideBarService();

Template.recentTransactionPopUp.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.recentTrasactions = new ReactiveVar([]);
    
});

Template.recentTransactionPopUp.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    var currentProductID = FlowRouter.current().queryParams.id;
    var currentProductName = FlowRouter.current().queryParams.prodname;

    templateObject.getAllProductRecentTransactions = function() {


        productService.getProductRecentTransactionsAll(currentProductID).then(function(data) {
            recentTransList = [];
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
                recentTransList.push(recentTranObject);
            }

            templateObject.recentTrasactions.set(recentTransList);
            setTimeout(function() {
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
                $('.fullScreenSpin').css('display', 'none');
            }, 0);

            $('#productrecentlist tbody').on('click', 'tr', function() {
                var listData = $(this).closest('tr').attr('id');
                var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

                if ((listData) && (transactiontype)) {
                    if (transactiontype === 'Quote') {
                        window.open('/quotecard?id=' + listData, '_self');
                    } else if (transactiontype === 'Sales Order') {
                        window.open('/salesordercard?id=' + listData, '_self');
                    } else if (transactiontype === 'Invoice') {
                        window.open('/invoicecard?id=' + listData, '_self');
                    } else if (transactiontype === 'Purchase Order') {
                        window.open('/purchaseordercard?id=' + listData, '_self');
                    } else if (transactiontype === 'Bill') {
                        //window.open('/billcard?id=' + listData,'_self');
                    } else if (transactiontype === 'Credit') {
                        //window.open('/creditcard?id=' + listData,'_self');
                    }

                }
            });

            $('.product_recent_trans').css('display', 'block');
            $([document.documentElement, document.body]).animate({
                scrollTop: $(".product_recent_trans").offset().top
            }, 2000);
            $('.fullScreenSpin').css('display', 'none');
        }).catch(function(err) {

            $('.fullScreenSpin').css('display', 'none');
            $('.product_recent_trans').css('display', 'block');
            $([document.documentElement, document.body]).animate({
                scrollTop: $(".product_recent_trans").offset().top
            }, 2000);

            //Bert.alert('<strong>' + err + '</strong>!', 'deleting products failed');
        });

    };
    $('.fullScreenSpin').css('display', 'none');
});

Template.recentTransactionPopUp.helpers({

    recentTrasactions: () => {
        return Template.instance().recentTrasactions.get();
    },
    
});
