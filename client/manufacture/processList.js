import {SalesBoardService} from '../js/sales-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {InvoiceService} from "../invoice/invoice-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import {OrganisationService} from '../js/organisation-service';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-editable-select';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.processList.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    // templateObject.selectedInventoryAssetAccount = new ReactiveVar('');
})

Template.processList.onRendered (function() {
    const templateObject = Template.instance();


    // function MakeNegative() {
    //     $('td').each(function () {
    //         if ($(this).text().indexOf('-' + Currency) >= 0)
    //             $(this).addClass('text-danger')
    //     });

    //     $('td.colStatus').each(function(){
    //         if($(this).text() == "Deleted") $(this).addClass('text-deleted');
    //         if ($(this).text() == "Full") $(this).addClass('text-fullyPaid');
    //         if ($(this).text() == "Part") $(this).addClass('text-partialPaid');
    //         if ($(this).text() == "Rec") $(this).addClass('text-reconciled');
    //     });
    // };
    templateObject.getProcessRecords  = function(e) {
        let tempArray = localStorage.getItem('TProcesses');
        templateObject.datatablerecords.set(tempArray?JSON.parse(tempArray): []);
        if (templateObject.datatablerecords.get()) {
            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblProcessList', function (error, result) {
                if (error) {
                }
                else {
                    if (result) {
                        for (let i = 0; i < result.customFields.length; i++) {
                            let customcolumn = result.customFields;
                            let columData = customcolumn[i].label;
                            let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                            let hiddenColumn = customcolumn[i].hidden;
                            let columnClass = columHeaderUpdate.split('.')[1];
                            let columnWidth = customcolumn[i].width;
                            let columnindex = customcolumn[i].index + 1;

                            if (hiddenColumn == true) {

                                $("." + columnClass + "").addClass('hiddenColumn');
                                $("." + columnClass + "").removeClass('showColumn');
                            } else if (hiddenColumn == false) {
                                $("." + columnClass + "").removeClass('hiddenColumn');
                                $("." + columnClass + "").addClass('showColumn');
                            }

                        }
                    }

                }
            });

            // setTimeout(function () {
            //     MakeNegative();
            // }, 100);

        }

        $('.fullScreenSpin').css('display', 'none');
        setTimeout(function () {
            $('#tblProcessList').DataTable({
                columnDefs: [{
                        type: 'date',
                        targets: 0
                    }
                ],
                "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [{
                        extend: 'excelHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Process List excel - " + moment().format(),
                        orientation: 'portrait',
                        exportOptions: {
                            columns: ':visible',
                            format: {
                                body: function (data, row, column) {
                                    if (data.includes("</span>")) {
                                        var res = data.split("</span>");
                                        data = res[1];
                                    }

                                    return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                                }
                            }
                        }
                    }, {
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Process List',
                        filename: "Process List - " + moment().format(),
                        exportOptions: {
                            columns: ':visible',
                            stripHtml: false
                        }
                    }
                ],
                select: true,
                destroy: true,
                colReorder: true,
                // bStateSave: true,
                // rowId: 0,
                pageLength: initialDatatableLoad,
                "bLengthChange": false,
                info: true,
                responsive: true,
                "order": [[ 0, "desc" ],[ 2, "desc" ]],
                action: function () {
                    $('#tblProcessOList').DataTable().ajax.reload();
                },
                "fnDrawCallback": function (oSettings) {
                    let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                    $('.paginate_button.page-item').removeClass('disabled');
                    $('#tblProcessList_ellipsis').addClass('disabled');

                    if(oSettings._iDisplayLength == -1){
                    if(oSettings.fnRecordsDisplay() > 150){
                        $('.paginate_button.page-item.previous').addClass('disabled');
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }
                    }else{

                    }
                    if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                        $('.paginate_button.page-item.next').addClass('disabled');
                    }

                    $('.paginate_button.next:not(.disabled)', this.api().table().container())
                    .on('click', function(){
                        $('.fullScreenSpin').css('display','inline-block');
                        let dataLenght = oSettings._iDisplayLength;
                        // var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                        // var dateTo = new Date($("#dateTo").datepicker("getDate"));

                        // let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                        // let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                        // if(data.Params.IgnoreDates == true){
                        // sideBarService.getAllTInvoiceListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                        //     getVS1Data('TInvoiceList').then(function (dataObjectold) {
                        //     if(dataObjectold.length == 0){

                        //     }else{
                        //         let dataOld = JSON.parse(dataObjectold[0].data);

                        //         var thirdaryData = $.merge($.merge([], dataObjectnew.tinvoicelist), dataOld.tinvoicelist);
                        //         let objCombineData = {
                        //         Params: dataOld.Params,
                        //         tinvoicelist:thirdaryData
                        //         }


                        //         addVS1Data('TInvoiceList',JSON.stringify(objCombineData)).then(function (datareturn) {
                        //             templateObject.resetData(objCombineData);
                        //         $('.fullScreenSpin').css('display','none');
                        //         }).catch(function (err) {
                        //         $('.fullScreenSpin').css('display','none');
                        //         });

                        //     }
                        //     }).catch(function (err) {

                        //     });

                        // }).catch(function(err) {
                        //     $('.fullScreenSpin').css('display','none');
                        // });
                        // }else{
                        // sideBarService.getAllTInvoiceListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                        // getVS1Data('TInvoiceList').then(function (dataObjectold) {
                        //     if(dataObjectold.length == 0){

                        //     }else{
                        //     let dataOld = JSON.parse(dataObjectold[0].data);

                        //     var thirdaryData = $.merge($.merge([], dataObjectnew.tinvoicelist), dataOld.tinvoicelist);
                        //     let objCombineData = {
                        //         Params: dataOld.Params,
                        //         tinvoicelist:thirdaryData
                        //     }


                        //         addVS1Data('TInvoiceList',JSON.stringify(objCombineData)).then(function (datareturn) {
                        //         templateObject.resetData(objCombineData);
                        //         $('.fullScreenSpin').css('display','none');
                        //         }).catch(function (err) {
                        //         $('.fullScreenSpin').css('display','none');
                        //         });

                        //     }
                        // }).catch(function (err) {

                        // });

                        // }).catch(function(err) {
                        // $('.fullScreenSpin').css('display','none');
                        // });
                        // }
                    });

                    // setTimeout(function () {
                    //     MakeNegative();
                    // }, 100);
                },
                "fnInitComplete": function () {
                    this.fnPageChange('last');
                    $("<button class='btn btn-primary btnRefreshProcessList' type='button' id='btnRefreshProcessList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInvoicelist_filter");
                    $('.myvarFilterForm').appendTo(".colDateFilter");
                },
                // "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                //     let countTableData = data.Params.Count || 0; //get count from API data

                //     return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                // }

            }).on('page', function () {
                // setTimeout(function () {
                //     MakeNegative();
                // }, 100);
                let draftRecord = templateObject.datatablerecords.get();
                templateObject.datatablerecords.set(draftRecord);
            }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                // setTimeout(function () {
                //     MakeNegative();
                // }, 100);
            });

            // $('#tblInvoicelist').DataTable().column( 0 ).visible( true );
            $('.fullScreenSpin').css('display', 'none');

        }, 0);

        var columns = $('#tblProcessList th');
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let isCustomField = false;
        let sClass = "";
        $.each(columns, function (i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columVisible = false;
            }

            if ((v.className.includes("customFieldColumn"))) {
                isCustomField = true;
            } else {
                isCustomField = false;
            }

            sWidth = v.style.width.replace('px', "");

            let datatablerecordObj = {
                custid: $(this).attr("custid") || 0,
                sTitle: v.innerText || '',
                sWidth: sWidth || '9',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sCustomField: isCustomField || false,
                sClass: v.className || ''
            };
            // tableHeaderList.push(datatablerecordObj);
        });
        // templateObject.tableheaderrecords.set(tableHeaderList);
        $('div.dataTables_filter input').addClass('form-control form-control-sm');
        $('#tblProcessList tbody').on('click', 'tr', function () {
            var listData = $(this).closest('tr').attr('id');
            FlowRouter.go('/processcard?id=' + listData)
        });
    }
    templateObject.getProcessRecords();

    $(document).on('click', '.processList .btnRefresh', function(e) {
        $('.fullScreenSpin').css('display', 'inline-block');
        templateObject.getProcessRecords();
        setTimeout(function () {
            window.open('/processlist', '_self');
          }, 2000);
    });

    $(document).on('click', '.processList #exportbtn', function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblProcessList_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');
    });

    $(document).on('click', '.processList .printConfirm', function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblProcessList_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    });


    $(document).on("click", ".processList #btnNewProcess", function (e) {
        FlowRouter.go('/processcard');
    });


});

Template.processList.helpers ({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get();
    },
    selectedInventoryAssetAccount: () => {
        return Template.instance().selectedInventoryAssetAccount.get();
    }

})
